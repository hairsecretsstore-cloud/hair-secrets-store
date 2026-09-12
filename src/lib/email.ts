import { site } from "./site";

/**
 * Transactional email via Resend (https://resend.com).
 * Set RESEND_API_KEY and EMAIL_FROM. Until configured, sends are skipped
 * gracefully (logged, never throws) so fulfilment never fails on email.
 */

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const FROM =
  process.env.EMAIL_FROM || `Hair Secrets Store <orders@${site.domain}>`;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!emailConfigured()) {
    console.log(`[email skipped — not configured] → ${opts.to}: ${opts.subject}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("Email send failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

// ---- Templates ------------------------------------------------------------

const ESPRESSO = "#2a211f";
const BRAND = "#ad918f";
const CREAM = "#f7f2ec";

function shell(bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:${CREAM};font-family:Arial,Helvetica,sans-serif;color:${ESPRESSO};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #efe6e4;">
        <tr><td style="background:${ESPRESSO};padding:28px 32px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${CREAM};letter-spacing:1px;">Hair Secrets</div>
          <div style="font-size:10px;letter-spacing:4px;color:${BRAND};text-transform:uppercase;margin-top:4px;">Raw Human Hair</div>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #efe6e4;text-align:center;font-size:12px;color:#8c7d76;">
          ${site.address.line1}, ${site.address.area}, ${site.address.city}<br/>
          <a href="mailto:${site.email}" style="color:${BRAND};text-decoration:none;">${site.email}</a> · ${site.phone}<br/>
          <span style="color:${BRAND};letter-spacing:2px;font-size:11px;">LENGTH. LUXURY. LEGACY.</span>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;"><tr><td style="border-radius:999px;background:${ESPRESSO};">
    <a href="${href}" style="display:inline-block;padding:14px 30px;color:${CREAM};text-decoration:none;font-size:14px;letter-spacing:1px;">${label}</a>
  </td></tr></table>`;
}

export function shippedEmail(o: {
  name: string;
  reference: string;
  trackingNumber: string;
  carrier: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const trackUrl = `${siteUrl}/track?ref=${encodeURIComponent(o.reference)}`;
  const firstName = o.name?.split(" ")[0] || "there";

  const html = shell(`
    <p style="font-size:15px;margin:0 0 8px;">Hi ${firstName},</p>
    <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;color:${ESPRESSO};">Your order is on its way ✦</h1>
    <p style="font-size:14px;line-height:1.6;color:#5a4644;margin:0 0 20px;">
      Wonderful news — your Hair Secrets order has been shipped and is now with ${o.carrier}.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border-radius:12px;padding:16px;margin:0 0 8px;">
      <tr><td style="font-size:12px;color:#8c7d76;padding:4px 16px;">Order</td>
          <td style="font-size:14px;color:${ESPRESSO};text-align:right;padding:4px 16px;font-weight:bold;">${o.reference}</td></tr>
      <tr><td style="font-size:12px;color:#8c7d76;padding:4px 16px;">Carrier</td>
          <td style="font-size:14px;color:${ESPRESSO};text-align:right;padding:4px 16px;">${o.carrier}</td></tr>
      <tr><td style="font-size:12px;color:#8c7d76;padding:4px 16px;">Tracking number</td>
          <td style="font-size:14px;color:${ESPRESSO};text-align:right;padding:4px 16px;font-weight:bold;">${o.trackingNumber}</td></tr>
    </table>
    ${button(trackUrl, "Track your order")}
    <p style="font-size:13px;line-height:1.6;color:#8c7d76;margin:16px 0 0;text-align:center;">
      Thank you for choosing Hair Secrets Store — where every strand is curated with class.
    </p>
  `);

  return {
    subject: `Your Hair Secrets order ${o.reference} has shipped ✦`,
    html,
  };
}
