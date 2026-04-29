import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
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
    const { name, phone, email, service, message, website } = body;

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
    if (!service || !VALID_SERVICES.some(s => String(service).includes(s.split(" ")[0]))) errors.service = "Please select a valid service";
    if (!message || String(message).trim().length < 20) errors.message = "Please describe your project (min 20 characters)";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Sanitize
    const sanitize = (str: string) =>
      String(str).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    const safeName = sanitize(name);
    const safePhone = sanitize(phone);
    const safeEmail = sanitize(email || "");
    const safeService = sanitize(service);
    const safeMessage = sanitize(message);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "joe@828constructions.com";

    if (!apiKey) {
      console.log("📬 Contact form submission (dev — no Resend key):", {
        name: safeName,
        phone: safePhone,
        email: safeEmail,
        service: safeService,
        message: safeMessage,
        ip,
      });
      return NextResponse.json({ ok: true });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; padding: 24px; margin-bottom: 24px;">
          <h1 style="color: #fff; margin: 0; font-size: 18px; letter-spacing: 2px; text-transform: uppercase;">
            828 Construction — New Inquiry
          </h1>
        </div>
        <div style="padding: 0 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px; font-weight: bold;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px;"><a href="tel:${safePhone}" style="color: #000;">${safePhone}</a></td>
            </tr>
            ${safeEmail ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px;"><a href="mailto:${safeEmail}" style="color: #000;">${safeEmail}</a></td>
            </tr>` : ""}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px;">${safeService}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <div style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message</div>
            <div style="background: #f5f5f5; padding: 16px; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "828 Construction Website <noreply@828constructions.com>",
        to: [toEmail],
        reply_to: safeEmail || undefined,
        subject: `New ${safeService} Inquiry from ${safeName}`,
        html: emailHtml,
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
