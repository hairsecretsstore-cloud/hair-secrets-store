"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { textures, origins } from "@/lib/data";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export function ShopGrid({ allProducts }: { allProducts: Product[] }) {
  const [selTextures, setSelTextures] = useState<string[]>([]);
  const [selOrigins, setSelOrigins] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) =>
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      const tOk = selTextures.length === 0 || selTextures.includes(p.texture);
      const oOk = selOrigins.length === 0 || selOrigins.includes(p.origin);
      return tOk && oOk;
    });
    const price = (p: Product) => Math.min(...p.variants.map((v) => v.price));
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return price(a) - price(b);
      if (sort === "price-desc") return price(b) - price(a);
      if (sort === "rating") return b.rating - a.rating;
      return Number(!!b.bestseller) - Number(!!a.bestseller);
    });
    return list;
  }, [allProducts, selTextures, selOrigins, sort]);

  const activeCount = selTextures.length + selOrigins.length;

  const Filters = () => (
    <div className="space-y-8">
      <FilterGroup
        title="Texture"
        options={[...textures]}
        selected={selTextures}
        onToggle={(v) => toggle(v, selTextures, setSelTextures)}
      />
      <FilterGroup
        title="Origin"
        options={[...origins]}
        selected={selOrigins}
        onToggle={(v) => toggle(v, selOrigins, setSelOrigins)}
      />
      {activeCount > 0 && (
        <button
          onClick={() => {
            setSelTextures([]);
            setSelOrigins([]);
          }}
          className="text-sm text-brand-600 underline underline-offset-4 hover:text-espresso"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <Filters />
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 rounded-full border border-brand-200 px-4 py-2 text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted lg:block">
            {filtered.length} product{filtered.length !== 1 && "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-brand-200 bg-background px-4 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted">
            No products match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-espresso">
                Filters
              </h3>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <Filters />
            <button
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary mt-8 w-full"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 font-[family-name:var(--font-sans)] text-xs font-medium uppercase tracking-[0.2em] text-espresso">
        {title}
      </h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-3 text-sm text-espresso/80"
          >
            <span
              className={cn(
                "grid h-4 w-4 place-items-center rounded border transition-colors",
                selected.includes(opt)
                  ? "border-brand-500 bg-brand-500"
                  : "border-brand-300",
              )}
            >
              {selected.includes(opt) && (
                <span className="h-1.5 w-1.5 rounded-sm bg-white" />
              )}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
