import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price stored in US cents as USD (e.g. 1261 → "$12.61", 25000 → "$250"). */
export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Generate a human-readable order reference. */
export function orderRef() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HS-${y}${(date.getMonth() + 1).toString().padStart(2, "0")}-${rand}`;
}
