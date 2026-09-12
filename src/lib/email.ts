import { site } from "./site";
import { formatPrice } from "./utils";

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

export function orderConfirmationEmail(o: {
  name: string;
  reference: string;
  items: { name: string; length?: number; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const orderUrl = `${siteUrl}/order/${encodeURIComponent(o.reference)}`;
  const firstName = o.name?.split(" ")[0] || "there";

  const rows = o.items
    .map(
      (i) => `
      <tr>
        <td style="font-size:14px;color:${ESPRESSO};padding:8px 0;border-bottom:1px solid #efe6e4;">
          ${i.name}${i.length ? ` · ${i.length}"` : ""}
          <span style="color:#8c7d76;"> × ${i.quantity}</span>
        </td>
        <td style="font-size:14px;color:${ESPRESSO};text-align:right;padding:8px 0;border-bottom:1px solid #efe6e4;">
          ${formatPrice(i.price * i.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const summaryRow = (label: string, value: string, strong = false) => `
    <tr><td style="font-size:13px;color:#8c7d76;padding:3px 0;">${label}</td>
        <td style="font-size:${strong ? "15px" : "13px"};color:${ESPRESSO};text-align:right;padding:3px 0;${strong ? "font-weight:bold;" : ""}">${value}</td></tr>`;

  const html = shell(`
    <p style="font-size:15px;margin:0 0 8px;">Hi ${firstName},</p>
    <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;color:${ESPRESSO};">Thank you for your order ✦</h1>
    <p style="font-size:14px;line-height:1.6;color:#5a4644;margin:0 0 20px;">
      We&rsquo;ve received your order <strong>${o.reference}</strong> and are preparing it with care. You&rsquo;ll receive tracking details as soon as it ships.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">${rows}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border-radius:12px;padding:16px;">
      ${summaryRow("Subtotal", formatPrice(o.subtotal))}
      ${summaryRow("Shipping", o.shipping === 0 ? "Free" : formatPrice(o.shipping))}
      ${o.discount && o.discount > 0 ? summaryRow("Discount", `− ${formatPrice(o.discount)}`) : ""}
      ${summaryRow("Total", formatPrice(o.total), true)}
    </table>
    ${button(orderUrl, "View your order")}
    <p style="font-size:13px;line-height:1.6;color:#8c7d76;margin:16px 0 0;text-align:center;">
      Questions? Reply to this email or reach us at ${site.email}.
    </p>
  `);

  return {
    subject: `Order confirmed — ${o.reference} ✦`,
    html,
  };
}

export function welcomeEmail(o: { email: string; code: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const html = shell(`
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 12px;color:${ESPRESSO};text-align:center;">Welcome to the inner circle ✦</h1>
    <p style="font-size:14px;line-height:1.6;color:#5a4644;margin:0 0 20px;text-align:center;">
      Thank you for joining Hair Secrets Store. As promised, here&rsquo;s <strong>10% off</strong> your first order — plus you&rsquo;ll be first to know about restocks, new textures and private sales.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border-radius:12px;padding:20px;text-align:center;margin:0 0 8px;">
      <tr><td style="font-size:11px;letter-spacing:2px;color:#8c7d76;text-transform:uppercase;padding-bottom:6px;">Your code</td></tr>
      <tr><td style="font-family:Georgia,serif;font-size:28px;letter-spacing:3px;color:${ESPRESSO};font-weight:bold;">${o.code}</td></tr>
    </table>
    ${button(`${siteUrl}/shop`, "Shop the collection")}
    <p style="font-size:12px;line-height:1.6;color:#8c7d76;margin:16px 0 0;text-align:center;">
      Apply <strong>${o.code}</strong> at checkout. Length. Luxury. Legacy.
    </p>
  `);

  return {
    subject: "Your 10% welcome gift ✦",
    html,
  };
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
