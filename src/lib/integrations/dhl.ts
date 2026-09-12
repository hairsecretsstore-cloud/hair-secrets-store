/**
 * DHL Express API integration.
 *
 * Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
 * Set DHL_API_KEY, DHL_API_SECRET and DHL_ACCOUNT_NUMBER in your environment.
 *
 * These helpers are written to be swapped straight into a Route Handler.
 * They fail loudly if credentials are missing, so the storefront can fall back
 * to a flat rate until DHL is fully configured.
 */

const DHL_BASE =
  process.env.DHL_API_ENV === "production"
    ? "https://express.api.dhl.com/mydhlapi"
    : "https://express.api.dhl.com/mydhlapi/test";

function authHeader() {
  const key = process.env.DHL_API_KEY;
  const secret = process.env.DHL_API_SECRET;
  if (!key || !secret) throw new Error("DHL credentials not configured");
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

export interface RateRequest {
  originCountry: string;
  originPostalCode: string;
  originCity: string;
  destCountry: string;
  destPostalCode: string;
  destCity: string;
  weightKg: number;
}

export interface ShippingRate {
  productName: string;
  totalPrice: number; // in cents
  currency: string;
  estimatedDays: number;
}

/** Get live shipping rates from DHL. */
export async function getRates(req: RateRequest): Promise<ShippingRate[]> {
  const params = new URLSearchParams({
    accountNumber: process.env.DHL_ACCOUNT_NUMBER ?? "",
    originCountryCode: req.originCountry,
    originCityName: req.originCity,
    originPostalCode: req.originPostalCode,
    destinationCountryCode: req.destCountry,
    destinationCityName: req.destCity,
    destinationPostalCode: req.destPostalCode,
    weight: String(req.weightKg),
    length: "20",
    width: "20",
    height: "10",
    plannedShippingDate: new Date().toISOString().slice(0, 10),
    isCustomsDeclarable: "true",
    unitOfMeasurement: "metric",
  });

  const res = await fetch(`${DHL_BASE}/rates?${params}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error(`DHL rates failed: ${res.status}`);
  const data = await res.json();

  return (data.products ?? []).map(
    (p: {
      productName: string;
      totalPrice?: { price: number; priceCurrency: string }[];
      deliveryCapabilities?: { totalTransitDays?: number };
    }): ShippingRate => ({
      productName: p.productName,
      totalPrice: Math.round((p.totalPrice?.[0]?.price ?? 0) * 100),
      currency: p.totalPrice?.[0]?.priceCurrency ?? "USD",
      estimatedDays: p.deliveryCapabilities?.totalTransitDays ?? 5,
    }),
  );
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
}

// DHL Shipment Tracking — Unified API (self-service).
// Docs: https://developer.dhl.com/api-reference/shipment-tracking-unified
const DHL_TRACK_BASE = "https://api-eu.dhl.com/track/shipments";

export function trackingConfigured() {
  return Boolean(process.env.DHL_TRACKING_API_KEY);
}

/**
 * Track a shipment via the DHL Shipment Tracking – Unified API.
 * Auth is a single `DHL-API-Key` header (no secret).
 */
export async function trackShipment(trackingNumber: string): Promise<{
  status: string;
  events: TrackingEvent[];
}> {
  const key = process.env.DHL_TRACKING_API_KEY;
  if (!key) throw new Error("DHL_TRACKING_API_KEY not configured");

  const params = new URLSearchParams({ trackingNumber });
  // Narrow to Express when the number looks like an Express AWB (JD/JJD…).
  if (/^JJ?D/i.test(trackingNumber)) params.set("service", "express");

  const res = await fetch(`${DHL_TRACK_BASE}?${params}`, {
    headers: { "DHL-API-Key": key, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`DHL tracking failed: ${res.status}`);
  const data = await res.json();
  const shipment = data.shipments?.[0];

  return {
    status:
      shipment?.status?.statusCode ?? shipment?.status?.status ?? "unknown",
    events: (shipment?.events ?? []).map(
      (e: {
        description?: string;
        status?: string;
        location?: { address?: { addressLocality?: string } };
        timestamp: string;
      }): TrackingEvent => ({
        status: e.description ?? e.status ?? "",
        location: e.location?.address?.addressLocality ?? "",
        timestamp: e.timestamp,
      }),
    ),
  };
}

/** Flat-rate fallback used when DHL is not yet configured. */
export function flatRate(): ShippingRate {
  return {
    productName: "DHL Express Worldwide",
    totalPrice: 2500,
    currency: "USD",
    estimatedDays: 5,
  };
}

export function dhlConfigured() {
  return Boolean(
    process.env.DHL_API_KEY &&
      process.env.DHL_API_SECRET &&
      process.env.DHL_ACCOUNT_NUMBER,
  );
}

export interface ShipmentAddress {
  name: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  postalCode: string;
  countryCode: string; // ISO-2, e.g. "UG", "US", "GB"
}

export interface ShipmentLineItem {
  description: string;
  quantity: number;
  priceUSD: number; // customs value per unit, in USD
  weightKg: number;
}

export interface CreateShipmentInput {
  reference: string;
  shipper: ShipmentAddress;
  receiver: ShipmentAddress;
  items: ShipmentLineItem[];
}

export interface ShipmentResult {
  trackingNumber: string;
  labelBase64?: string; // PDF label, base64
  carrier: "DHL Express";
}

/**
 * Create a DHL Express shipment and label via the MyDHL API.
 * Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api → /shipments
 *
 * Notes:
 *  - Product code "P" = Express Worldwide (non-doc). Adjust for your account.
 *  - International shipments are customs-declarable; a basic export declaration
 *    is built from the order line items.
 *  - Throws if DHL isn't configured — callers should check dhlConfigured() first.
 */
export async function createShipment(
  input: CreateShipmentInput,
): Promise<ShipmentResult> {
  if (!dhlConfigured()) throw new Error("DHL credentials not configured");

  const totalWeight = Math.max(
    0.5,
    input.items.reduce((w, i) => w + i.weightKg * i.quantity, 0),
  );
  const declaredValue = input.items.reduce(
    (v, i) => v + i.priceUSD * i.quantity,
    0,
  );
  const isInternational =
    input.shipper.countryCode !== input.receiver.countryCode;

  // Ship next business day at 10:00 local.
  const shipDate = new Date();
  shipDate.setDate(shipDate.getDate() + 1);
  const plannedShippingDateAndTime =
    shipDate.toISOString().slice(0, 19) + " GMT+03:00";

  const contact = (a: ShipmentAddress) => ({
    postalAddress: {
      cityName: a.city,
      countryCode: a.countryCode,
      postalCode: a.postalCode || "00000",
      addressLine1: a.addressLine,
    },
    contactInformation: {
      companyName: a.name,
      fullName: a.name,
      phone: a.phone,
      email: a.email,
    },
  });

  const body = {
    plannedShippingDateAndTime,
    pickup: { isRequested: false },
    productCode: "P",
    accounts: [
      { typeCode: "shipper", number: process.env.DHL_ACCOUNT_NUMBER },
    ],
    customerDetails: {
      shipperDetails: contact(input.shipper),
      receiverDetails: contact(input.receiver),
    },
    content: {
      packages: [
        {
          weight: totalWeight,
          dimensions: { length: 25, width: 20, height: 12 },
        },
      ],
      isCustomsDeclarable: isInternational,
      declaredValue: Number(declaredValue.toFixed(2)),
      declaredValueCurrency: "USD",
      description: "Human hair extensions",
      incoterm: "DAP",
      unitOfMeasurement: "metric",
      ...(isInternational && {
        exportDeclaration: {
          lineItems: input.items.map((it, idx) => ({
            number: idx + 1,
            description: it.description,
            price: it.priceUSD,
            quantity: { value: it.quantity, unitOfMeasurement: "PCS" },
            manufacturerCountry: input.shipper.countryCode,
            weight: {
              netValue: it.weightKg,
              grossValue: it.weightKg,
            },
          })),
          invoice: {
            number: input.reference,
            date: shipDate.toISOString().slice(0, 10),
          },
        },
      }),
    },
    outputImageProperties: {
      encodingFormat: "pdf",
      imageOptions: [{ typeCode: "label", templateName: "ECOM26_84_A4_001" }],
    },
  };

  const res = await fetch(`${DHL_BASE}/shipments`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DHL shipment failed: ${res.status} ${text.slice(0, 300)}`);
  }
  const data = await res.json();

  return {
    trackingNumber:
      data.shipmentTrackingNumber ??
      data.packages?.[0]?.trackingNumber ??
      "",
    labelBase64: data.documents?.find(
      (d: { typeCode?: string; content?: string }) => d.typeCode === "label",
    )?.content,
    carrier: "DHL Express",
  };
}
