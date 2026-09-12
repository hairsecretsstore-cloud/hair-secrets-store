import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { trackShipment, trackingConfigured } from "@/lib/integrations/dhl";

/**
 * Track an order by reference. Looks up the order in Supabase, then queries the
 * DHL tracking API with the stored tracking number. Returns { demo: true } when
 * nothing is configured so the UI can show its illustrative timeline.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  if (!hasSupabase) {
    return NextResponse.json({ ref, status: "processing", events: [], demo: true });
  }

  try {
    const supabase = createServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .select("status, tracking_number, carrier")
      .eq("reference", ref)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Not shipped yet, or the DHL tracking key isn't configured →
    // return the order's own status with no external events.
    if (!order.tracking_number || !trackingConfigured()) {
      return NextResponse.json({
        ref,
        status: order.status,
        carrier: order.carrier ?? "DHL Express",
        tracking: order.tracking_number ?? undefined,
        events: [],
      });
    }

    const tracking = await trackShipment(order.tracking_number);
    return NextResponse.json({
      ref,
      status: tracking.status,
      carrier: order.carrier ?? "DHL Express",
      tracking: order.tracking_number,
      events: tracking.events,
    });
  } catch (err) {
    console.error("Track lookup failed:", err);
    return NextResponse.json({ ref, status: "processing", events: [], demo: true });
  }
}
