import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyToken } from "@/lib/integrations/dpo";

/**
 * DPO Pay return/callback handler. DPO redirects the customer here with the
 * TransactionToken; we verify it and mark the order paid, then send the
 * customer to their order confirmation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transToken =
    searchParams.get("TransactionToken") ?? searchParams.get("ID");
  const companyRef = searchParams.get("CompanyRef");

  if (!transToken || !companyRef) {
    return NextResponse.redirect(
      new URL("/checkout?error=missing_token", request.url),
    );
  }

  // No gateway configured → treat as demo success.
  if (!process.env.DPO_COMPANY_TOKEN) {
    return NextResponse.redirect(
      new URL(`/order/${companyRef}?status=paid`, request.url),
    );
  }

  try {
    const result = await verifyToken(transToken);
    if (hasSupabase) {
      const supabase = createServiceClient();
      await supabase
        .from("orders")
        .update({ status: result.paid ? "paid" : "pending" })
        .eq("reference", companyRef);
    }
    if (result.paid) {
      return NextResponse.redirect(
        new URL(`/order/${companyRef}?status=paid`, request.url),
      );
    }
    return NextResponse.redirect(
      new URL(`/checkout?error=not_paid`, request.url),
    );
  } catch (err) {
    console.error("DPO verify failed:", err);
    return NextResponse.redirect(
      new URL(`/checkout?error=verify_failed`, request.url),
    );
  }
}
