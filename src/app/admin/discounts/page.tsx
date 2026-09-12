"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const initial = [
  { code: "WELCOME10", type: "10% off", usage: "482 uses", active: true },
  { code: "FREESHIP", type: "Free shipping", usage: "1,204 uses", active: true },
  { code: "LUXE20", type: "20% off orders USh 2M+", usage: "76 uses", active: true },
  { code: "SUMMER15", type: "15% off", usage: "301 uses", active: false },
];

export default function AdminDiscounts() {
  const [codes, setCodes] = useState(initial);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
            Discounts
          </h1>
          <p className="text-sm text-muted">Promo codes &amp; campaigns</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4" /> New code
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {codes.map((c, i) => (
          <div
            key={c.code}
            className="flex items-center justify-between rounded-2xl border border-brand-100 bg-background p-5"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cream">
                <Tag className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="font-medium tracking-wide text-espresso">
                  {c.code}
                </p>
                <p className="text-xs text-muted">
                  {c.type} · {c.usage}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setCodes((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, active: !x.active } : x,
                  ),
                )
              }
              className={cn(
                "relative h-6 w-11 rounded-full transition",
                c.active ? "bg-brand-500" : "bg-brand-200",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
                  c.active ? "left-5" : "left-0.5",
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
