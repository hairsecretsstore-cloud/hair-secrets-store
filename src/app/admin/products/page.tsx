"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { products } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminProducts() {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const rows = products
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      texture: p.texture,
      origin: p.origin,
      price: Math.min(...p.variants.map((v) => v.price)),
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
      tone: p.tone,
    }))
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
            Products
          </h1>
          <p className="text-sm text-muted">{products.length} products</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-brand-200 bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-muted">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Texture</th>
              <th className="p-4 font-medium">Origin</th>
              <th className="p-4 font-medium">Price from</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {rows.map((p) => (
              <tr key={p.id} className="text-espresso">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/photos/p-${p.slug}.webp`}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      style={{ background: p.tone }}
                    />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted">{p.texture}</td>
                <td className="p-4 text-muted">{p.origin}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs",
                      p.stock < 30
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700",
                    )}
                  >
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-cream">
                      <Pencil className="h-4 w-4 text-espresso" />
                    </button>
                    <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-espresso/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-espresso">
                Add product
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}
              className="space-y-4"
            >
              <Field label="Product name" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Texture" />
                <Field label="Origin" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Base price (USD)" type="number" />
                <Field label="Initial stock" type="number" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-espresso">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-espresso">{label}</label>
      <input
        type={type}
        className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
