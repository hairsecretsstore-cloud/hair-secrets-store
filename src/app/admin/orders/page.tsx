"use client";

import { useEffect, useState } from "react";
import { Loader2, Truck, FileDown, Copy, Check, Pencil, X } from "lucide-react";
import { adminOrders as demoOrders } from "@/lib/admin-data";
import { StatusPill } from "@/components/admin/ui";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, cn } from "@/lib/utils";

type Row = {
  ref: string;
  customer: string;
  email: string;
  date: string;
  status: string;
  total: number;
  payment: string;
  tracking?: string | null;
};

const filters = ["all", "pending", "paid", "processing", "shipped", "delivered"];

export default function AdminOrders() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<Row[]>(hasSupabase ? [] : (demoOrders as Row[]));
  const [loading, setLoading] = useState(hasSupabase);
  const [busy, setBusy] = useState<string | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editRef, setEditRef] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    if (!hasSupabase) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("reference, customer_name, email, created_at, status, total, payment_method, tracking_number")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(
          (data ?? []).map((o) => ({
            ref: o.reference,
            customer: o.customer_name || "—",
            email: o.email,
            date: new Date(o.created_at).toLocaleDateString(),
            status: o.status,
            total: o.total,
            payment: o.payment_method || "—",
            tracking: o.tracking_number,
          })),
        );
        setLoading(false);
      });
  }, []);

  async function fulfill(ref: string, tracking?: string) {
    setBusy(ref);
    setError(null);
    try {
      const res = await fetch("/api/admin/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref, trackingNumber: tracking }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fulfilment failed");
      setOrders((prev) =>
        prev.map((o) =>
          o.ref === ref
            ? { ...o, status: "shipped", tracking: data.trackingNumber }
            : o,
        ),
      );
      if (data.labelBase64) {
        setLabels((prev) => ({ ...prev, [ref]: data.labelBase64 }));
      }
      setEditRef(null);
      setTrackingInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fulfilment failed");
    } finally {
      setBusy(null);
    }
  }

  function downloadLabel(ref: string) {
    const b64 = labels[ref];
    if (!b64) return;
    const w = window.open();
    if (w) w.document.write(
      `<iframe src="data:application/pdf;base64,${b64}" style="width:100%;height:100%;border:0"></iframe>`,
    );
  }

  const rows = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Orders
        </h1>
        <p className="text-sm text-muted">
          Manage and fulfil customer orders
          {!hasSupabase && " (demo data — connect Supabase for live orders)"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-2 text-sm capitalize transition",
              filter === f
                ? "bg-espresso text-cream"
                : "border border-brand-200 text-espresso hover:bg-cream",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-background">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 text-right font-medium">Fulfilment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {rows.map((o) => {
                return (
                  <tr key={o.ref} className="text-espresso">
                    <td className="p-4 font-medium">{o.ref}</td>
                    <td className="p-4">
                      <p>{o.customer}</p>
                      <p className="text-xs text-muted">{o.email}</p>
                    </td>
                    <td className="p-4 text-muted">{o.date}</td>
                    <td className="p-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="p-4 font-medium">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {editRef === o.ref ? (
                          // Manual tracking entry / edit
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="DHL tracking # (blank = auto)"
                              className="w-44 rounded-lg border border-brand-300 bg-background px-2.5 py-1.5 text-xs outline-none focus:border-brand-500"
                            />
                            <button
                              onClick={() => fulfill(o.ref, trackingInput)}
                              disabled={busy === o.ref}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-espresso text-cream disabled:opacity-50"
                              title="Save"
                            >
                              {busy === o.ref ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditRef(null);
                                setTrackingInput("");
                              }}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-brand-200"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : o.tracking ? (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(o.tracking!);
                                setCopied(o.ref);
                                setTimeout(() => setCopied(null), 1500);
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs text-espresso"
                              title="Copy tracking number"
                            >
                              {copied === o.ref ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              {o.tracking}
                            </button>
                            {labels[o.ref] && (
                              <button
                                onClick={() => downloadLabel(o.ref)}
                                className="inline-flex items-center gap-1 text-xs text-brand-600 underline"
                              >
                                <FileDown className="h-3 w-3" /> Label
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditRef(o.ref);
                                setTrackingInput(o.tracking ?? "");
                              }}
                              className="grid h-6 w-6 place-items-center rounded-md hover:bg-cream"
                              title="Edit tracking number"
                            >
                              <Pencil className="h-3 w-3 text-muted" />
                            </button>
                          </>
                        ) : hasSupabase ? (
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => fulfill(o.ref)}
                              disabled={busy === o.ref}
                              className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 text-xs font-medium text-cream transition hover:bg-brand-600 disabled:opacity-50"
                            >
                              {busy === o.ref ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Truck className="h-3.5 w-3.5" />
                              )}
                              Create shipment
                            </button>
                            <button
                              onClick={() => {
                                setEditRef(o.ref);
                                setTrackingInput("");
                              }}
                              className="text-[11px] text-brand-600 underline"
                            >
                              add tracking # manually
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No orders {filter !== "all" && `with status "${filter}"`} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted">
        &quot;Create shipment&quot; generates a DHL Express label and tracking
        number when DHL is connected. Until then it assigns a simulated tracking
        number so you can practise the fulfilment flow.
      </p>
    </div>
  );
}
