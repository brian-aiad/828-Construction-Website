import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/constants";
import { buildOwnerEmail, type RenderedEmail } from "@/lib/contactEmail";
import {
  createContactDeliveryIdentity,
  verifyContactChallenge,
} from "@/lib/contactSecurity";

const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_ENTRIES = 10_000;
const MAX_BODY_BYTES = 20_000;
const VALID_SERVICES = ["ADU Construction", "Remediation", "Consulting", "Not sure"];

const rateMap = new Map<string, { count: number; resetAt: number }>();

const API_HEADERS = {
  Allow: "POST, OPTIONS",
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { ...API_HEADERS, ...headers },
  });
}

function methodNotAllowed() {
  return new NextResponse(null, { status: 405, headers: API_HEADERS });
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: API_HEADERS });
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    if (rateMap.size >= MAX_RATE_ENTRIES) {
      for (const [key, value] of rateMap) {
        if (now >= value.resetAt) rateMap.delete(key);
      }
      while (rateMap.size >= MAX_RATE_ENTRIES) {
        const oldest = rateMap.keys().next().value;
        if (typeof oldest !== "string") break;
        rateMap.delete(oldest);
      }
    }
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

function requestIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function normalizedOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function isSameOriginRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  // Local test utilities and server-side diagnostics may omit Origin. Real
  // production browser submissions must include it.
  if (!origin) return process.env.NODE_ENV !== "production";

  const allowedOrigins = new Set([
    normalizedOrigin(SITE.url),
    normalizedOrigin(request.nextUrl.origin),
  ]);
  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) allowedOrigins.add(normalizedOrigin(`https://${vercelHost}`));

  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.add("http://localhost:3001");
    allowedOrigins.add("http://localhost:3011");
    allowedOrigins.add("http://localhost:4001");
  }

  return allowedOrigins.has(normalizedOrigin(origin));
}

function normalizePhoneHref(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+1${digits.replace(/^1/, "")}`;
}

function brandedFrom(value: string) {
  return value.includes("<") ? value : `${SITE.name} <${value}>`;
}

function singleLine(value: string, max: number) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function multiline(value: string, max: number) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
}

function looksLikeSpam(message: string) {
  const links =
    message.match(
      /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|co|xyz|top|click|link)\b)/gi
    ) || [];
  if (links.length > 4) return true;
  if (/(.)\1{14,}/u.test(message)) return true;

  const words = message.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [];
  if (words.length >= 24) {
    const counts = new Map<string, number>();
    for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
    const mostRepeated = Math.max(...counts.values());
    if (mostRepeated / words.length > 0.55) return true;
  }
  return false;
}

type ProviderResult = {
  ok: boolean;
  status: number;
  code: string;
  body: Record<string, unknown>;
};

function providerCode(body: Record<string, unknown>) {
  if (typeof body.name === "string") return body.name;
  if (typeof body.code === "string") return body.code;
  return "unknown";
}

async function sendEmail({
  apiKey,
  from,
  to,
  replyTo,
  email,
  idempotencyKey,
}: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  email: RenderedEmail;
  idempotencyKey: string;
}): Promise<ProviderResult> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: replyTo,
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      const responseBody = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;
      const code = providerCode(responseBody);
      if (
        response.status === 409 &&
        code === "concurrent_idempotent_requests" &&
        attempt < 2
      ) {
        await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
        continue;
      }
      return { ok: response.ok, status: response.status, code, body: responseBody };
    } catch (error) {
      if (attempt < 2) continue;
      return {
        ok: false,
        status: 0,
        code: error instanceof Error ? error.name : "network_error",
        body: {},
      };
    }
  }
  return { ok: false, status: 0, code: "delivery_retry_exhausted", body: {} };
}

function fieldString(body: Record<string, unknown>, name: string) {
  const value = body[name];
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return json(
        { error: "Please submit the form using the official website." },
        403
      );
    }

    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return json({ error: "Please submit the form using the website." }, 415);
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return json(
        { error: "Message is too large. Please shorten it or call us directly." },
        413
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json(
        { error: "Message is too large. Please shorten it or call us directly." },
        413
      );
    }

    let body: Record<string, unknown>;
    try {
      const parsed = JSON.parse(rawBody);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      body = parsed as Record<string, unknown>;
    } catch {
      return json({ error: "Invalid form submission." }, 400);
    }

    // Honeypots deliberately return success before doing any expensive work.
    if (fieldString(body, "website").trim()) return json({ ok: true });

    const challenge = verifyContactChallenge(body.challengeToken);
    if (!challenge.ok) {
      const status = challenge.code === "challenge_too_fast" ? 425 : 403;
      const retryAfterMs = challenge.retryAfterMs;
      return json(
        {
          error:
            status === 425
              ? "Security check is still starting. Please try again."
              : "Security check expired. Please try again.",
          code: challenge.code,
          retryAfterMs,
        },
        status,
        retryAfterMs
          ? { "Retry-After": String(Math.max(1, Math.ceil(retryAfterMs / 1000))) }
          : undefined
      );
    }

    const name = fieldString(body, "name");
    const phone = fieldString(body, "phone");
    const email = fieldString(body, "email");
    const address = fieldString(body, "address");
    const service = fieldString(body, "service");
    const message = fieldString(body, "message");
    const errors: Record<string, string> = {};

    if (name.trim().length < 2 || name.length > 120 || /https?:\/\/|www\./i.test(name)) {
      errors.name = "Full name required";
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (
      !/^\+?[\d\s\-(). ]{7,40}$/.test(phone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15 ||
      new Set(phoneDigits).size < 3
    ) {
      errors.phone = "Valid phone number required";
    }
    if (
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      email.length > 160
    ) {
      errors.email = "Enter a valid email address";
    }
    if (address.length > 240) errors.address = "Address is too long";
    if (!VALID_SERVICES.includes(service)) errors.service = "Please select a valid service";
    if (message.trim().length < 20 || message.length > 4000) {
      errors.message = "Please describe your project (20-4000 characters)";
    } else if (looksLikeSpam(message)) {
      errors.message = "Please remove repeated text or excessive links";
    }

    if (Object.keys(errors).length > 0) return json({ errors }, 400);

    const rate = checkRateLimit(requestIp(request));
    if (!rate.allowed) {
      return json(
        { error: "Too many requests. Please try again in a few minutes." },
        429,
        { "Retry-After": String(rate.retryAfterSeconds) }
      );
    }

    const safeName = singleLine(name, 120);
    const safePhone = singleLine(phone, 40);
    const safeEmail = singleLine(email, 160).toLowerCase();
    const safeAddress = singleLine(address, 240);
    const safeService = singleLine(service, 60);
    const safeMessage = multiline(message, 4000);
    const identity = createContactDeliveryIdentity({
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      address: safeAddress,
      service: safeService,
      message: safeMessage,
    });
    const submittedAt = new Date(identity.bucketStartedAt).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const configuredToEmail = process.env.CONTACT_EMAIL?.trim();
    const toEmail = configuredToEmail || SITE.email;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      "828 Construction <website@updates.828constructions.com>";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      console.error("Contact recipient email is invalid.", {
        reference: identity.reference,
      });
      return json(
        { error: "Contact form is not configured. Please call us directly." },
        500
      );
    }
    if (!apiKey) {
      console.error("Contact email environment is not fully configured.", {
        reference: identity.reference,
      });
      return json(
        { error: "Contact form is not configured. Please call us directly." },
        500
      );
    }

    const ownerResult = await sendEmail({
      apiKey,
      from: brandedFrom(fromEmail),
      to: toEmail,
      replyTo: safeEmail || undefined,
      email: buildOwnerEmail({
        name: safeName,
        phone: safePhone,
        email: safeEmail,
        address: safeAddress,
        service: safeService,
        message: safeMessage,
        submittedAt,
        reference: identity.reference,
        phoneHref: normalizePhoneHref(safePhone),
      }),
      idempotencyKey: identity.idempotencyKey,
    });

    if (!ownerResult.ok) {
      console.error("Contact owner notification failed.", {
        reference: identity.reference,
        providerStatus: ownerResult.status,
        providerCode: ownerResult.code,
      });
      return json({ error: "Failed to send email. Please call us directly." }, 500);
    }

    const ownerMessageId =
      typeof ownerResult.body.id === "string" ? ownerResult.body.id : "unavailable";
    console.info("Contact owner notification accepted.", {
      reference: identity.reference,
      providerMessageId: ownerMessageId,
    });

    return json({ ok: true, reference: identity.reference });
  } catch (error) {
    console.error("Contact route error.", {
      error: error instanceof Error ? error.name : "unknown",
    });
    return json({ error: "An unexpected error occurred." }, 500);
  }
}
