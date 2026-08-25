import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { NextRequest } from "next/server";
import * as contactRoute from "@/app/api/contact/route";
import * as challengeRoute from "@/app/api/contact/challenge/route";
import { SITE } from "@/lib/constants";
import {
  CONTACT_CHALLENGE_MAX_AGE_MS,
  CONTACT_CHALLENGE_MIN_AGE_MS,
  issueContactChallenge,
  verifyContactChallenge,
} from "@/lib/contactSecurity";

process.env.RESEND_API_KEY = "re_contact_security_test_key_828_construction";
process.env.CONTACT_FORM_SECRET = "contact_form_test_secret_with_more_than_twenty_bytes";
process.env.CONTACT_EMAIL = SITE.email;
process.env.CONTACT_FROM_EMAIL = "828 Construction <website@updates.828constructions.com>";

const originalFetch = globalThis.fetch;
const originalInfo = console.info;
const originalWarn = console.warn;
const originalError = console.error;

let ipCounter = 10;

type ProviderCall = {
  headers: Headers;
  body: Record<string, unknown>;
};

function challengeAtAge(age = CONTACT_CHALLENGE_MIN_AGE_MS + 50) {
  const token = issueContactChallenge(Date.now() - age);
  assert.ok(token);
  return token;
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Form Security Test",
    phone: "(310) 555-0182",
    email: "customer@example.com",
    address: "123 Main St, Torrance, CA",
    service: "ADU Construction",
    message: "We are planning an ADU and would like to discuss scope, budget, and timing.",
    website: "",
    challengeToken: challengeAtAge(),
    ...overrides,
  };
}

function requestFor(
  body: unknown,
  options: {
    ip?: string;
    origin?: string;
    fetchSite?: string;
    contentType?: string;
    contentLength?: string;
  } = {}
) {
  const headers = new Headers({
    "Content-Type": options.contentType || "application/json",
    Origin: options.origin || SITE.url,
    "Sec-Fetch-Site": options.fetchSite || "same-origin",
    "X-Forwarded-For": options.ip || `198.51.100.${ipCounter++}`,
  });
  if (options.contentLength) headers.set("Content-Length", options.contentLength);
  return new NextRequest(`${SITE.url}/api/contact`, {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function installProviderMock(
  responder: (call: ProviderCall, index: number) => Response = (_call, index) =>
    Response.json({ id: `provider-message-${index + 1}` })
) {
  const calls: ProviderCall[] = [];
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    const call = {
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body || "{}")) as Record<string, unknown>,
    };
    calls.push(call);
    return responder(call, calls.length - 1);
  }) as typeof fetch;
  return calls;
}

async function responseJson(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

before(() => {
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
});

after(() => {
  globalThis.fetch = originalFetch;
  console.info = originalInfo;
  console.warn = originalWarn;
  console.error = originalError;
});

test("challenge endpoint is no-store and method-restricted", async () => {
  const response = challengeRoute.GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") || "", /no-store/);
  const body = await responseJson(response);
  assert.equal(typeof body.token, "string");
  assert.equal(body.minWaitMs, CONTACT_CHALLENGE_MIN_AGE_MS);
  assert.equal(challengeRoute.POST().status, 405);
  assert.equal(challengeRoute.OPTIONS().status, 204);
});

test("signed challenges reject missing, tampered, future, fresh, and expired tokens", () => {
  assert.equal(verifyContactChallenge(undefined).ok, false);
  assert.equal(verifyContactChallenge("not-a-token").ok, false);

  const valid = challengeAtAge();
  const tampered = `${valid.slice(0, -1)}${valid.endsWith("a") ? "b" : "a"}`;
  assert.deepEqual(verifyContactChallenge(tampered), {
    ok: false,
    code: "challenge_invalid",
  });

  const fresh = issueContactChallenge();
  assert.ok(fresh);
  const freshResult = verifyContactChallenge(fresh);
  assert.equal(freshResult.ok, false);
  if (!freshResult.ok) assert.equal(freshResult.code, "challenge_too_fast");

  const future = issueContactChallenge(Date.now() + 5_000);
  assert.ok(future);
  assert.deepEqual(verifyContactChallenge(future), {
    ok: false,
    code: "challenge_invalid",
  });

  const expired = issueContactChallenge(Date.now() - CONTACT_CHALLENGE_MAX_AGE_MS - 1);
  assert.ok(expired);
  assert.deepEqual(verifyContactChallenge(expired), {
    ok: false,
    code: "challenge_expired",
  });
});

test("5,000 malformed challenge tokens fail closed without throwing", () => {
  for (let index = 0; index < 5_000; index++) {
    const token = `v1.${index}.${"x".repeat(index % 45)}.${"z".repeat(index % 55)}`;
    assert.equal(verifyContactChallenge(token).ok, false);
  }
});

test("a valid lead sends exactly one owner email and never relays mail to the visitor", async () => {
  const calls = installProviderMock();
  const response = await contactRoute.POST(requestFor(validBody()));
  const body = await responseJson(response);

  assert.equal(response.status, 200);
  assert.match(String(body.reference), /^828-[A-F0-9]{8}$/);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].body.to, [SITE.email]);
  assert.equal(calls[0].body.reply_to, "customer@example.com");
  assert.notDeepEqual(calls[0].body.to, ["customer@example.com"]);
  assert.match(calls[0].headers.get("idempotency-key") || "", /^contact-owner\/[a-f0-9]{64}$/);
});

test("duplicate payload retries have identical references, provider payloads, and idempotency keys", async () => {
  const calls = installProviderMock();
  const first = await contactRoute.POST(
    requestFor(validBody({ submissionId: "attacker-controlled-one" }))
  );
  const second = await contactRoute.POST(
    requestFor(validBody({ submissionId: "attacker-controlled-two" }))
  );
  const firstBody = await responseJson(first);
  const secondBody = await responseJson(second);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(firstBody.reference, secondBody.reference);
  assert.equal(calls.length, 2);
  assert.equal(
    calls[0].headers.get("idempotency-key"),
    calls[1].headers.get("idempotency-key")
  );
  assert.deepEqual(calls[0].body, calls[1].body);
});

test("cross-origin, cross-site, and missing-challenge submissions never reach the provider", async () => {
  const calls = installProviderMock();
  const crossOrigin = await contactRoute.POST(
    requestFor(validBody(), { origin: "https://spam.example", fetchSite: "cross-site" })
  );
  const crossSite = await contactRoute.POST(
    requestFor(validBody(), { origin: SITE.url, fetchSite: "cross-site" })
  );
  const missingChallenge = await contactRoute.POST(
    requestFor(validBody({ challengeToken: undefined }))
  );

  assert.equal(crossOrigin.status, 403);
  assert.equal(crossSite.status, 403);
  assert.equal(missingChallenge.status, 403);
  assert.equal(calls.length, 0);
});

test("honeypot submissions silently succeed without a challenge or provider call", async () => {
  const calls = installProviderMock();
  const response = await contactRoute.POST(
    requestFor(validBody({ website: "https://bot.example", challengeToken: undefined }))
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await responseJson(response), { ok: true });
  assert.equal(calls.length, 0);
});

test("invalid phones, repeated text, and excessive links are rejected before delivery", async () => {
  const calls = installProviderMock();
  const responses = await Promise.all([
    contactRoute.POST(requestFor(validBody({ phone: "111-1111" }))),
    contactRoute.POST(requestFor(validBody({ message: "x".repeat(80) }))),
    contactRoute.POST(
      requestFor(
        validBody({
          message:
            "Please review https://a.com https://b.com https://c.com https://d.com https://e.com for the project.",
        })
      )
    ),
  ]);
  assert.deepEqual(
    responses.map((response) => response.status),
    [400, 400, 400]
  );
  assert.equal(calls.length, 0);
});

test("HTML-like customer content is escaped in the owner email", async () => {
  const calls = installProviderMock();
  const response = await contactRoute.POST(
    requestFor(
      validBody({
        name: "<b>Test Owner</b>",
        message: "Please inspect this note: <script>alert('xss')</script> before calling us.",
      })
    )
  );
  assert.equal(response.status, 200);
  const html = String(calls[0].body.html);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;/);
});

test("the sixth accepted lead from one IP is throttled with Retry-After", async () => {
  const calls = installProviderMock();
  const ip = "203.0.113.240";
  const responses = [];
  for (let index = 0; index < 6; index++) {
    responses.push(
      await contactRoute.POST(
        requestFor(
          validBody({ message: `Qualified construction inquiry number ${index} with enough project detail.` }),
          { ip }
        )
      )
    );
  }

  assert.deepEqual(
    responses.map((response) => response.status),
    [200, 200, 200, 200, 200, 429]
  );
  assert.ok(Number(responses[5].headers.get("retry-after")) >= 1);
  assert.equal(calls.length, 5);
});

test("100 simultaneous replay attempts converge on one provider identity", async () => {
  const deliveredKeys = new Set<string>();
  const calls = installProviderMock((call) => {
    const key = call.headers.get("idempotency-key") || "";
    deliveredKeys.add(key);
    return Response.json({ id: `provider-${key.slice(-12)}` });
  });

  const responses = await Promise.all(
    Array.from({ length: 100 }, (_unused, index) =>
      contactRoute.POST(
        requestFor(validBody({ submissionId: `forged-${index}` }), {
          ip: `192.0.2.${index + 1}`,
        })
      )
    )
  );

  assert.equal(responses.filter((response) => response.status === 200).length, 100);
  assert.equal(calls.length, 100);
  assert.equal(deliveredKeys.size, 1);
  assert.equal(new Set(calls.map((call) => JSON.stringify(call.body))).size, 1);
});

test("provider concurrency conflicts are retried and network failures fail safely", async () => {
  let attempts = 0;
  installProviderMock(() => {
    attempts++;
    if (attempts < 3) {
      return Response.json(
        { name: "concurrent_idempotent_requests" },
        { status: 409 }
      );
    }
    return Response.json({ id: "provider-after-retry" });
  });
  const recovered = await contactRoute.POST(
    requestFor(validBody({ message: "A unique request that verifies safe provider concurrency retry handling." }))
  );
  assert.equal(recovered.status, 200);
  assert.equal(attempts, 3);

  let failures = 0;
  globalThis.fetch = (async () => {
    failures++;
    throw new TypeError("simulated network outage");
  }) as typeof fetch;
  const failed = await contactRoute.POST(
    requestFor(validBody({ message: "A different unique request that verifies provider outage handling." }))
  );
  assert.equal(failed.status, 500);
  assert.equal(failures, 3);
  assert.match(String((await responseJson(failed)).error), /call us directly/i);
});

test("malformed, oversized, and unsupported requests fail with bounded responses", async () => {
  const calls = installProviderMock();
  const malformed = await contactRoute.POST(requestFor("{not-json"));
  const oversized = await contactRoute.POST(
    requestFor(validBody(), { contentLength: "25000" })
  );
  const wrongType = await contactRoute.POST(
    requestFor(validBody(), { contentType: "text/plain" })
  );

  assert.equal(malformed.status, 400);
  assert.equal(oversized.status, 413);
  assert.equal(wrongType.status, 415);
  assert.equal(contactRoute.GET().status, 405);
  assert.equal(contactRoute.OPTIONS().status, 204);
  assert.equal(calls.length, 0);
});
