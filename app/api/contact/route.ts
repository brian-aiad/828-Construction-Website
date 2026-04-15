import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    // Basic validation
    if (!name || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Name, phone, service, and message are required." },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent injection
    const sanitize = (str: string) =>
      String(str).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    const safeName = sanitize(name);
    const safePhone = sanitize(phone);
    const safeEmail = sanitize(email || "");
    const safeService = sanitize(service);
    const safeMessage = sanitize(message);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "joe@828construction.com";

    if (!apiKey) {
      // In development without API key, log and return success
      console.log("Contact form submission (no Resend key):", {
        name: safeName,
        phone: safePhone,
        email: safeEmail,
        service: safeService,
        message: safeMessage,
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
            ${
              safeEmail
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px;"><a href="mailto:${safeEmail}" style="color: #000;">${safeEmail}</a></td>
            </tr>`
                : ""
            }
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
        from: "828 Construction Website <noreply@828construction.com>",
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
