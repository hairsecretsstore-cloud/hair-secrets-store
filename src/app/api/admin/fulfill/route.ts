import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createShipment, dhlConfigured, type ShipmentAddress } from "@/lib/integrations/dhl";
import { sendEmail, shippedEmail } from "@/lib/email";
import { site } from "@/lib/site";

// Map the checkout country names to ISO-2 codes DHL expects.
const COUNTRY_CODES: Record<string, string> = {
  Uganda: "UG",
  Kenya: "KE",
  Tanzania: "TZ",
  Nigeria: "NG",
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  "South Africa": "ZA",
};

async function requireAdmin() {
  if (!hasSupabase) return { error: "Supabase not configured", status: 503 as const };
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) return { error: "Not signed in", status: 401 as const };
  const { data: me } = await ssr
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) return { error: "Admins only", status: 403 as const };
  return { user };
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const { reference, trackingNumber: manual } = await request.json();
  if (!reference) {
    return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
  }
  const manualTracking =
    typeof manual === "string" && manual.trim() ? manual.trim() : null;

  const service = createServiceClient();
  const { data: order, error } = await service
    .from("orders")
    .select("reference, email, customer_name, shipping_address, items, status, tracking_number")
    .eq("reference", reference)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  // Already fulfilled and no manual override supplied → return existing.
  if (order.tracking_number && !manualTracking) {
    return NextResponse.json({
      trackingNumber: order.tracking_number,
      already: true,
    });
  }

  let trackingNumber = "";
  let labelBase64: string | undefined;
  let demo = false;

  try {
    if (manualTracking) {
      // Admin pasted a real DHL AWB from a shipment created outside the app.
      trackingNumber = manualTracking;
    } else if (dhlConfigured()) {
      const addr = order.shipping_address ?? {};
      const receiver: ShipmentAddress = {
        name: order.customer_name || "Customer",
        phone: addr.phone || "+000000000",
        email: order.email,
        addressLine: addr.address || "",
        city: addr.city || "",
        postalCode: addr.postal || "00000",
        countryCode: COUNTRY_CODES[addr.country as string] ?? "UG",
      };
      const shipper: ShipmentAddress = {
        name: site.shipFrom.name,
        phone: site.phone,
        email: site.email,
        addressLine: site.shipFrom.addressLine,
        city: site.shipFrom.city,
        postalCode: site.shipFrom.postalCode,
        countryCode: site.shipFrom.countryCode,
      };
      const items = (Array.isArray(order.items) ? order.items : []).map(
        (i: { name?: string; price?: number; quantity?: number }) => ({
          description: i.name ?? "Hair extension",
          quantity: i.quantity ?? 1,
          priceUSD: Math.max(1, Math.round((i.price ?? 0) / 100)),
          weightKg: 0.2,
        }),
      );
      const result = await createShipment({ reference, shipper, receiver, items });
      trackingNumber = result.trackingNumber;
      labelBase64 = result.labelBase64;
    } else {
      // Simulated shipment so the fulfillment flow is usable before DHL is live.
      demo = true;
      trackingNumber = "JD" + Math.random().toString().slice(2, 12);
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Shipment failed" },
      { status: 502 },
    );
  }

  await service
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      carrier: "DHL Express",
      status: "shipped",
    })
    .eq("reference", reference);

  // Notify the customer their order shipped (skipped gracefully if email
  // isn't configured — never blocks fulfilment).
  let emailed = false;
  if (order.email) {
    const { subject, html } = shippedEmail({
      name: order.customer_name || "there",
      reference,
      trackingNumber,
      carrier: "DHL Express",
    });
    emailed = await sendEmail({ to: order.email, subject, html });
  }

  return NextResponse.json({ trackingNumber, labelBase64, demo, emailed });
}
