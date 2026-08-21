import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/constants";
import {
  buildCustomerEmail,
  buildOwnerEmail,
  type RenderedEmail,
} from "@/lib/contactEmail";

// ── In-memory rate limiter (5 requests per 10 minutes per IP) ────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_ENTRIES = 10_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    if (rateMap.size >= MAX_RATE_ENTRIES) {
      for (const [key, value] of rateMap) {
        if (now > value.resetAt) rateMap.delete(key);
      }
      while (rateMap.size >= MAX_RATE_ENTRIES) {
        const oldest = rateMap.keys().next().value;
        if (typeof oldest !== "string") break;
        rateMap.delete(oldest);
      }
    }
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const VALID_SERVICES = ["ADU Construction", "Remediation", "Consulting", "Not sure"];
const MAX_BODY_BYTES = 20_000;
const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const METHOD_HEADERS = {
  Allow: "POST, OPTIONS",
  "Cache-Control": "no-store",
};

function methodNotAllowed() {
  return new NextResponse(null, { status: 405, headers: METHOD_HEADERS });
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: METHOD_HEADERS });
}

function normalizePhoneHref(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+1${digits.replace(/^1/, "")}`;
}

function brandedFrom(value: string) {
  return value.includes("<") ? value : `${SITE.name} <${value}>`;
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
}) {
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
    const responseBody = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, body: responseBody };
  } catch (error) {
    return { ok: false, status: 0, body: { error: String(error) } };
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: "Please submit the form using the website." },
        { status: 415 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Message is too large. Please shorten it or call us directly." },
        { status: 413 }
      );
    }

    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Message is too large. Please shorten it or call us directly." },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;
    try {
      const parsed = JSON.parse(rawBody);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
    }
    const { name, phone, email, address, service, message, website, submissionId } = body;

    // Honeypot check — bots fill this field, humans don't see it
    if (website && String(website).trim().length > 0) {
      // Silently succeed so bots don't know they were blocked
      return NextResponse.json({ ok: true });
    }

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!name || String(name).trim().length < 2) errors.name = "Full name required";
    if (!phone || !/^\+?[\d\s\-(). ]{7,}$/.test(String(phone))) errors.phone = "Valid phone number required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.email = "Enter a valid email address";
    if (!service || !VALID_SERVICES.includes(String(service))) errors.service = "Please select a valid service";
    if (!message || String(message).trim().length < 20) errors.message = "Please describe your project (min 20 characters)";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Sanitize
    const sanitize = (str: unknown, max = 2000) =>
      String(str)
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max);

    const safeName = sanitize(name, 120);
    const safePhone = sanitize(phone, 40);
    const safeEmail = sanitize(email || "", 160);
    const safeAddress = sanitize(address || "", 240);
    const safeService = sanitize(service, 60);
    const safeMessage = String(message).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").trim().slice(0, 4000);
    const safeSubmissionId = SUBMISSION_ID.test(String(submissionId || ""))
      ? String(submissionId)
      : crypto.randomUUID();
    const reference = `828-${safeSubmissionId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const phoneHref = normalizePhoneHref(safePhone);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      console.error("Contact email environment is not fully configured.", {
        hasApiKey: Boolean(apiKey),
        hasContactEmail: Boolean(toEmail),
        hasFromEmail: Boolean(fromEmail),
      });
      return NextResponse.json(
        { error: "Contact form is not configured. Please call us directly." },
        { status: 500 }
      );
    }

    const details = {
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      address: safeAddress,
      service: safeService,
      message: safeMessage,
      submittedAt,
      reference,
      phoneHref,
    };
    const sender = brandedFrom(fromEmail);
    const ownerRequest = sendEmail({
      apiKey,
      from: sender,
      to: toEmail,
      replyTo: safeEmail || undefined,
      email: buildOwnerEmail(details),
      idempotencyKey: `contact-owner/${safeSubmissionId}`,
    });
    const confirmationRequest = safeEmail
      ? sendEmail({
          apiKey,
          from: sender,
          to: safeEmail,
          replyTo: toEmail,
          email: buildCustomerEmail(details),
          idempotencyKey: `contact-confirmation/${safeSubmissionId}`,
        })
      : Promise.resolve(null);
    const [ownerResult, confirmationResult] = await Promise.all([
      ownerRequest,
      confirmationRequest,
    ]);

    if (!ownerResult.ok) {
      console.error("Resend owner notification error:", ownerResult);
      return NextResponse.json(
        { error: "Failed to send email. Please call us directly." },
        { status: 500 }
      );
    }
    if (confirmationResult && !confirmationResult.ok) {
      // The lead is safely delivered even if a customer mailbox rejects its
      // acknowledgment. Do not ask the customer to submit the lead again.
      console.error("Resend customer confirmation error:", confirmationResult);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
