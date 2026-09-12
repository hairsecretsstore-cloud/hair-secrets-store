import { NextResponse } from "next/server";
import { resolveDiscount, discountAmount } from "@/lib/discounts";
import { formatPrice } from "@/lib/utils";

/** Validate a promo code against a cart and return the discount it yields. */
export async function POST(request: Request) {
  const { code, subtotal = 0, shipping = 0 } = (await request.json()) ?? {};
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ valid: false, error: "Enter a code" });
  }

  const d = await resolveDiscount(code);
  if (!d) {
    return NextResponse.json({ valid: false, error: "Invalid code" });
  }
  if (subtotal < d.minSubtotal) {
    return NextResponse.json({
      valid: false,
      error: `Spend ${formatPrice(d.minSubtotal)}+ to use ${d.code}`,
    });
  }

  const amount = discountAmount(d, subtotal, shipping);
  return NextResponse.json({
    valid: true,
    code: d.code,
    type: d.type,
    amount,
  });
}
