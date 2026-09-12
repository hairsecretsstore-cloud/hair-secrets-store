import { products } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function AdminInventory() {
  const lowStockThreshold = 5;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Inventory
        </h1>
        <p className="text-sm text-muted">
          Stock levels per product length (SKU)
        </p>
      </div>

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-brand-100 bg-background p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/photos/p-${p.slug}.webp`}
                alt={p.name}
                className="h-10 w-10 rounded-lg object-cover"
                style={{ background: p.tone }}
              />
              <div>
                <p className="font-medium text-espresso">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.origin} · {p.texture}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {p.variants.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "rounded-lg border p-3 text-center",
                    v.stock <= lowStockThreshold
                      ? "border-amber-300 bg-amber-50"
                      : "border-brand-100",
                  )}
                >
                  <p className="text-xs text-muted">{v.length}&quot;</p>
                  <p
                    className={cn(
                      "font-medium",
                      v.stock <= lowStockThreshold
                        ? "text-amber-700"
                        : "text-espresso",
                    )}
                  >
                    {v.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
