import { NextResponse } from "next/server";
import { orderRef } from "@/lib/utils";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createToken } from "@/lib/integrations/dpo";
import { resolveDiscount, discountAmount } from "@/lib/discounts";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

/**
 * Create an order and initiate payment.
 *
 * - Computes totals server-side (never trusts the client).
 * - Persists the order to Supabase when configured.
 * - Creates a DPO Pay token when DPO_COMPANY_TOKEN is set, returning its
 *   hosted paymentUrl.
 * - Falls back to a demo confirmation when nothing is configured yet.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const {
    items,
    email,
    firstName = "",
    lastName = "",
    shipping,
    shippingAddress,
    paymentMethod,
    plan = "full",
    code = "",
  } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const subtotal = items.reduce(
    (s: number, i: { price: number; quantity: number }) =>
      s + i.price * i.quantity,
    0,
  );
  const shippingCost =
    typeof shipping === "number" ? shipping : subtotal >= 30000 ? 0 : 2500;

  // Re-validate any promo code server-side (never trust a client-sent amount).
  let discountValue = 0;
  let discountCode: string | null = null;
  if (typeof code === "string" && code.trim()) {
    const d = await resolveDiscount(code);
    if (d && subtotal >= d.minSubtotal) {
      discountValue = discountAmount(d, subtotal, shippingCost);
      discountCode = d.code;
    }
  }

  const total = Math.max(0, subtotal + shippingCost - discountValue);
  // Payment Plan Policy: 70% deposit now, 30% on delivery.
  const amountDue = plan === "deposit" ? Math.round(total * 0.7) : total;
  const reference = orderRef();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // Attach the order to the logged-in customer (if any) — derived from the
  // session cookie server-side, never trusted from the client.
  let userId: string | null = null;
  if (hasSupabase) {
    try {
      const ssr = await createClient();
      const {
        data: { user },
      } = await ssr.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      /* guest checkout */
    }
  }

  // 1) Persist the order (pending) when Supabase is available.
  if (hasSupabase) {
    try {
      const supabase = createServiceClient();
      const baseOrder = {
        reference,
        user_id: userId,
        email,
        customer_name: `${firstName} ${lastName}`.trim() || null,
        status: "pending",
        subtotal,
        shipping: shippingCost,
        total,
        currency: "USD",
        items,
        shipping_address: shippingAddress ?? null,
        payment_method:
          plan === "deposit"
            ? `${paymentMethod ?? "Card"} · 70% deposit`
            : paymentMethod ?? null,
      };
      // Try with the discount columns; if the live schema predates them,
      // retry without so the order still persists.
      const { error: insertErr } = await supabase.from("orders").insert({
        ...baseOrder,
        discount_code: discountCode,
        discount_amount: discountValue,
      });
      if (insertErr?.code === "PGRST204" || insertErr?.code === "42703") {
        await supabase.from("orders").insert(baseOrder);
      } else if (insertErr) {
        console.error("Order persist failed:", insertErr.message);
      }
    } catch (err) {
      console.error("Order persist failed:", err);
    }
  }

  // 1b) Send the order-confirmation email (best-effort; never blocks checkout).
  if (email) {
    try {
      const { subject, html } = orderConfirmationEmail({
        name: `${firstName} ${lastName}`.trim(),
        reference,
        items,
        subtotal,
        shipping: shippingCost,
        discount: discountValue,
        total,
      });
      await sendEmail({ to: email, subject, html });
    } catch (err) {
      console.error("Confirmation email failed:", err);
    }
  }

  // 2) Initiate DPO Pay when configured.
  if (process.env.DPO_COMPANY_TOKEN) {
    try {
      const token = await createToken({
        amount: amountDue,
        currency: "USD",
        reference,
        customerEmail: email,
        customerFirstName: firstName,
        customerLastName: lastName,
        redirectUrl: `${siteUrl}/api/dpo/callback?CompanyRef=${reference}`,
        backUrl: `${siteUrl}/checkout`,
      });
      if (hasSupabase) {
        const supabase = createServiceClient();
        await supabase
          .from("orders")
          .update({ dpo_trans_token: token.transToken })
          .eq("reference", reference);
      }
      return NextResponse.json({
        reference,
        subtotal,
        shipping: shippingCost,
        discount: discountValue,
        total,
        paymentUrl: token.paymentUrl,
      });
    } catch (err) {
      console.error("DPO createToken failed:", err);
      return NextResponse.json(
        { error: "Payment initiation failed. Please try again." },
        { status: 502 },
      );
    }
  }

  // 3) Demo fallback (no payment gateway configured).
  return NextResponse.json({
    reference,
    subtotal,
    shipping: shippingCost,
    discount: discountValue,
    total,
    amountDue,
    paymentUrl: `/order/${reference}?status=paid`,
    demo: true,
  });
}
