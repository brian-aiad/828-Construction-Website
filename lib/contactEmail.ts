import { SITE } from "@/lib/constants";

export type ContactEmailDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  message: string;
  submittedAt: string;
  reference: string;
  phoneHref: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const palette = {
  ink: "#050505",
  paper: "#f4f1ed",
  white: "#ffffff",
  accent: "#631A16",
  accentSoft: "#b98b82",
  line: "#e4ded9",
  muted: "#746d69",
  text: "#171717",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function paragraph(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td width="132" style="padding:14px 0;border-bottom:1px solid ${palette.line};color:${palette.muted};font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.4;letter-spacing:1.6px;text-transform:uppercase;vertical-align:top;">${label}</td>
      <td style="padding:14px 0;border-bottom:1px solid ${palette.line};color:${palette.text};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;vertical-align:top;">${value}</td>
    </tr>`;
}

function emailShell({
  preheader,
  label,
  title,
  body,
}: {
  preheader: string;
  label: string;
  title: string;
  body: string;
}) {
  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;padding:0;background:${palette.paper};">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;background:${palette.paper};">
        <tr>
          <td align="center" style="padding:28px 12px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;border-collapse:collapse;background:${palette.white};border:1px solid ${palette.line};">
              <tr>
                <td style="padding:0;background:${palette.ink};">
                  <div style="height:3px;background:${palette.accent};font-size:0;line-height:0;">&nbsp;</div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:26px 30px 24px;color:${palette.white};font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;line-height:1;letter-spacing:2.2px;text-transform:uppercase;">828 Construction</td>
                      <td align="right" style="padding:26px 30px 24px;color:${palette.accentSoft};font-family:Arial,Helvetica,sans-serif;font-size:9px;line-height:1.4;letter-spacing:1.5px;text-transform:uppercase;">Torrance / South Bay</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:30px 30px 8px;font-family:Arial,Helvetica,sans-serif;">
                  <div style="color:${palette.accent};font-size:10px;font-weight:700;line-height:1.4;letter-spacing:1.8px;text-transform:uppercase;">${escapeHtml(label)}</div>
                  <h1 style="margin:10px 0 0;color:${palette.text};font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:600;line-height:1.08;letter-spacing:-0.6px;">${escapeHtml(title)}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 30px 30px;font-family:Arial,Helvetica,sans-serif;">${body}</td>
              </tr>
              <tr>
                <td style="padding:20px 30px;background:${palette.ink};border-top:3px solid ${palette.accent};font-family:Arial,Helvetica,sans-serif;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="color:#d5d1ce;font-size:11px;line-height:1.6;">CA License #${SITE.license}<br />${escapeHtml(SITE.phone)}</td>
                      <td align="right" style="color:#8f8985;font-size:10px;line-height:1.6;letter-spacing:1px;text-transform:uppercase;"><a href="${SITE.url}" style="color:#d5d1ce;text-decoration:none;">828constructions.com</a><br />Built with intent.</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export function buildOwnerEmail(details: ContactEmailDetails): RenderedEmail {
  const name = escapeHtml(details.name);
  const phone = escapeHtml(details.phone);
  const email = escapeHtml(details.email);
  const address = escapeHtml(details.address);
  const service = escapeHtml(details.service);
  const submittedAt = escapeHtml(details.submittedAt);
  const reference = escapeHtml(details.reference);
  const emailHref = encodeURIComponent(details.email);

  const body = `
    <p style="margin:0;color:${palette.muted};font-size:13px;line-height:1.65;">Submitted ${submittedAt} PT&nbsp;&nbsp;/&nbsp;&nbsp;Reference ${reference}</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 8px 8px 0;"><a href="tel:${details.phoneHref}" style="display:inline-block;background:${palette.accent};color:${palette.white};padding:13px 18px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:1.4px;text-decoration:none;text-transform:uppercase;">Call ${phone}</a></td>
        ${details.email ? `<td style="padding:0 0 8px;"><a href="mailto:${emailHref}" style="display:inline-block;border:1px solid #cfc7c2;color:${palette.text};padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:1.4px;text-decoration:none;text-transform:uppercase;">Reply by email</a></td>` : ""}
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;border-collapse:collapse;">
      ${detailRow("Name", name)}
      ${detailRow("Phone", `<a href="tel:${details.phoneHref}" style="color:${palette.text};text-decoration:underline;">${phone}</a>`)}
      ${details.email ? detailRow("Email", `<a href="mailto:${emailHref}" style="color:${palette.text};text-decoration:underline;">${email}</a>`) : ""}
      ${details.address ? detailRow("Address", address) : ""}
      ${detailRow("Service", service)}
    </table>
    <div style="margin-top:24px;color:${palette.muted};font-size:10px;line-height:1.4;letter-spacing:1.6px;text-transform:uppercase;">Project notes</div>
    <div style="margin-top:10px;padding:18px 20px;background:#f7f5f2;border-left:3px solid ${palette.accent};color:${palette.text};font-size:15px;line-height:1.72;">${paragraph(details.message)}</div>
    <p style="margin:22px 0 0;color:#8a817c;font-size:11px;line-height:1.65;">Website lead from ${SITE.url}. Use the contact actions above to follow up.</p>`;

  return {
    subject: `828 Construction: ${details.service} inquiry from ${details.name}`,
    html: emailShell({
      preheader: `${details.name} submitted a ${details.service} inquiry.`,
      label: `New project inquiry / ${details.service}`,
      title: details.name,
      body,
    }),
    text: [
      "828 Construction - New Project Inquiry",
      `Reference: ${details.reference}`,
      `Submitted: ${details.submittedAt} PT`,
      "",
      `Service: ${details.service}`,
      `Name: ${details.name}`,
      `Phone: ${details.phone}`,
      details.email ? `Email: ${details.email}` : "",
      details.address ? `Address: ${details.address}` : "",
      "",
      "Project notes:",
      details.message,
    ].filter(Boolean).join("\n"),
  };
}

