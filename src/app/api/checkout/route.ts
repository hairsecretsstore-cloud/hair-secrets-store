import { NextResponse } from "next/server";
import { orderRef } from "@/lib/utils";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createToken } from "@/lib/integrations/dpo";

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
    typeof shipping === "number" ? shipping : subtotal >= 1000000 ? 0 : 100000;
  const total = subtotal + shippingCost;
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
      await supabase.from("orders").insert({
        reference,
        user_id: userId,
        email,
        customer_name: `${firstName} ${lastName}`.trim() || null,
        status: "pending",
        subtotal,
        shipping: shippingCost,
        total,
        currency: "UGX",
        items,
        shipping_address: shippingAddress ?? null,
        payment_method:
          plan === "deposit"
            ? `${paymentMethod ?? "Card"} · 70% deposit`
            : paymentMethod ?? null,
      });
    } catch (err) {
      console.error("Order persist failed:", err);
    }
  }

  // 2) Initiate DPO Pay when configured.
  if (process.env.DPO_COMPANY_TOKEN) {
    try {
      const token = await createToken({
        amount: amountDue,
        currency: "UGX",
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
    total,
    amountDue,
    paymentUrl: `/order/${reference}?status=paid`,
    demo: true,
  });
}
