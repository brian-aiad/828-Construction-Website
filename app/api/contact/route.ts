import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/constants";

// ── In-memory rate limiter (5 requests per 10 minutes per IP) ────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const VALID_SERVICES = ["ADU Construction", "Remediation", "Consulting", "Not sure"];
const MAX_BODY_BYTES = 20_000;

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePhoneHref(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+1${digits.replace(/^1/, "")}`;
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { name, phone, email, address, service, message, website } = body;

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
    const sanitize = (str: string, max = 2000) =>
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
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const htmlName = escapeHtml(safeName);
    const htmlPhone = escapeHtml(safePhone);
    const htmlEmail = escapeHtml(safeEmail);
    const htmlAddress = escapeHtml(safeAddress);
    const htmlService = escapeHtml(safeService);
    const htmlMessage = escapeHtml(safeMessage).replace(/\n/g, "<br />");
    const htmlSubmittedAt = escapeHtml(submittedAt);
    const htmlIp = escapeHtml(ip);
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

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e7e2df;width:132px;color:#7b7470;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;vertical-align:top;">${label}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e7e2df;color:#151515;font-size:16px;line-height:1.45;vertical-align:top;">${value}</td>
      </tr>`;

    const emailHtml = `
      <div style="margin:0;padding:0;background:#f4f1ed;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f4f1ed;">
          <tr>
            <td align="center" style="padding:28px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e4ded9;">
                <tr>
                  <td style="background:#050505;padding:28px 30px 24px;border-bottom:3px solid #631A16;">
                    <div style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;">828 Construction</div>
                    <div style="margin-top:10px;color:#b98b82;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;">New website inquiry / ${htmlService}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 30px 8px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:13px;letter-spacing:1.8px;text-transform:uppercase;color:#631A16;font-weight:700;">Priority Contact</div>
                    <h1 style="margin:8px 0 4px;color:#111111;font-size:28px;line-height:1.15;font-weight:700;">${htmlName}</h1>
                    <p style="margin:0;color:#6b6460;font-size:14px;line-height:1.6;">Submitted ${htmlSubmittedAt} PT from ${htmlIp}</p>
                    <div style="margin-top:20px;">
                      <a href="tel:${phoneHref}" style="display:inline-block;background:#631A16;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Call ${htmlPhone}</a>
                      ${safeEmail ? `<a href="mailto:${htmlEmail}" style="display:inline-block;margin-left:8px;border:1px solid #d6ccc6;color:#111111;text-decoration:none;padding:12px 18px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Reply by Email</a>` : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 30px 24px;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      ${row("Name", htmlName)}
                      ${row("Phone", `<a href="tel:${phoneHref}" style="color:#111111;text-decoration:underline;">${htmlPhone}</a>`)}
                      ${safeEmail ? row("Email", `<a href="mailto:${htmlEmail}" style="color:#111111;text-decoration:underline;">${htmlEmail}</a>`) : ""}
                      ${safeAddress ? row("Address", htmlAddress) : ""}
                      ${row("Service", htmlService)}
                    </table>
                    <div style="margin-top:24px;">
                      <div style="margin-bottom:10px;color:#7b7470;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;">Project Notes</div>
                      <div style="background:#f7f5f2;border-left:3px solid #631A16;padding:18px 20px;color:#171717;font-size:15px;line-height:1.7;">${htmlMessage}</div>
                    </div>
                    <p style="margin:24px 0 0;color:#8a817c;font-size:12px;line-height:1.6;">This lead came from ${escapeHtml(SITE.url)}. Reply directly to the email address above when available, or use the phone call button.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    const emailText = [
      "828 Construction - New Website Inquiry",
      "",
      `Service: ${safeService}`,
      `Name: ${safeName}`,
      `Phone: ${safePhone}`,
      safeEmail ? `Email: ${safeEmail}` : "",
      safeAddress ? `Address: ${safeAddress}` : "",
      `Submitted: ${submittedAt} PT`,
      `IP: ${ip}`,
      "",
      "Project Notes:",
      safeMessage,
    ].filter(Boolean).join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: safeEmail || undefined,
        subject: `828 Construction: ${safeService} inquiry from ${safeName}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("Resend error:", errBody);
      return NextResponse.json(
        { error: "Failed to send email. Please call us directly." },
        { status: 500 }
      );
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
