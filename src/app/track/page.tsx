"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle2, Package, Truck, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  done: boolean;
}

function TrackInner() {
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") ?? "");
  const [result, setResult] = useState<null | {
    ref: string;
    carrier: string;
    tracking: string;
    events: TrackingEvent[];
  }>(null);
  const [loading, setLoading] = useState(false);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    if (!ref) return;
    setLoading(true);
    // In production: GET /api/track?ref= → looks up the order in Supabase and
    // calls the DHL tracking API with the stored tracking number.
    await new Promise((r) => setTimeout(r, 900));
    setResult({
      ref,
      carrier: "DHL Express",
      tracking: "JD0140" + ref.replace(/\D/g, "").slice(0, 8).padEnd(8, "0"),
      events: [
        {
          status: "Order confirmed",
          location: "Kampala, UG",
          timestamp: "Placed",
          done: true,
        },
        {
          status: "Processing & quality check",
          location: "Hair Secrets Studio",
          timestamp: "In progress",
          done: true,
        },
        {
          status: "Handed to DHL Express",
          location: "Entebbe Gateway, UG",
          timestamp: "Pending",
          done: false,
        },
        {
          status: "In transit",
          location: "International hub",
          timestamp: "—",
          done: false,
        },
        {
          status: "Out for delivery",
          location: "Destination city",
          timestamp: "—",
          done: false,
        },
        {
          status: "Delivered",
          location: "Your address",
          timestamp: "—",
          done: false,
        },
      ],
    });
    setLoading(false);
  }

  const icons = [CheckCircle2, Package, Truck, MapPin, Truck, Home];

  return (
    <section className="container-lux py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">DHL Express tracking</span>
        <h1 className="mt-3 text-5xl text-espresso lg:text-6xl">Track Your Order</h1>
        <p className="mt-4 text-espresso/70">
          Enter your order reference to see live delivery updates.
        </p>

        <form
          onSubmit={track}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              placeholder="e.g. HS-2608-AB12X"
              className="w-full rounded-full border border-brand-200 bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <button type="submit" className="btn btn-primary shrink-0">
            {loading ? "Tracking…" : "Track"}
          </button>
        </form>
      </div>

      {result && (
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-brand-100 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-100 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-brand-600">
                Order
              </p>
              <p className="font-medium text-espresso">{result.ref}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.15em] text-brand-600">
                {result.carrier}
              </p>
              <p className="font-medium text-espresso">{result.tracking}</p>
            </div>
          </div>

          <ol className="mt-6 space-y-6">
            {result.events.map((ev, i) => {
              const Icon = icons[i] ?? Package;
              return (
                <li key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full",
                        ev.done
                          ? "bg-brand-500 text-white"
                          : "bg-cream text-brand-300",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {i < result.events.length - 1 && (
                      <div
                        className={cn(
                          "mt-1 w-0.5 flex-1",
                          ev.done ? "bg-brand-400" : "bg-brand-100",
                        )}
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="pb-2">
                    <p
                      className={cn(
                        "font-medium",
                        ev.done ? "text-espresso" : "text-muted",
                      )}
                    >
                      {ev.status}
                    </p>
                    <p className="text-sm text-muted">
                      {ev.location} · {ev.timestamp}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container-lux py-20" />}>
      <TrackInner />
    </Suspense>
  );
}
