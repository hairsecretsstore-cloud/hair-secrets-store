import { hasSupabase } from "./supabase/config";
import { createServiceClient } from "./supabase/server";

export interface ResolvedDiscount {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number; // percent (0-100) or US cents
  minSubtotal: number; // US cents
}

// Built-in codes so promos work even before Supabase is configured, and as a
// fallback if the discounts table is unavailable. Kept in sync with schema.sql.
const FALLBACK: Record<string, ResolvedDiscount> = {
  WELCOME10: { code: "WELCOME10", type: "percent", value: 10, minSubtotal: 0 },
  LUXE20: { code: "LUXE20", type: "percent", value: 20, minSubtotal: 50000 },
};

/** Look up an active discount by code (case-insensitive). Returns null if none. */
export async function resolveDiscount(
  rawCode: string,
): Promise<ResolvedDiscount | null> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  if (hasSupabase) {
    try {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from("discounts")
        .select("code, type, value, min_subtotal, active")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();
      if (data) {
        return {
          code: data.code,
          type: data.type,
          value: data.value ?? 0,
          minSubtotal: data.min_subtotal ?? 0,
        };
      }
    } catch {
      /* fall through to built-in codes */
    }
  }
  return FALLBACK[code] ?? null;
}

/** Compute the discount amount (US cents) a code yields for a given order. */
export function discountAmount(
  d: ResolvedDiscount,
  subtotal: number,
  shipping: number,
): number {
  if (subtotal < d.minSubtotal) return 0;
  if (d.type === "percent") return Math.round((subtotal * d.value) / 100);
  if (d.type === "fixed") return Math.min(d.value, subtotal);
  if (d.type === "free_shipping") return shipping;
  return 0;
}
