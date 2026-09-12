"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart, useWishlist } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

export function ProductCard({ product }: { product: Product }) {
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const inWishlist = useWishlist((s) =>
    s.items.some((i) => i.productId === product.id),
  );
  const [added, setAdded] = useState(false);
  const cheapest = product.variants.reduce((a, b) => (b.price < a.price ? b : a));
  const from = cheapest.price;
  const compareAt = cheapest.compareAt;
  const savings =
    compareAt && compareAt > from
      ? Math.round(((compareAt - from) / compareAt) * 100)
      : 0;
  const isAccessory = product.category === "accessory";
  // Sensible default: mid-length for hair, the single variant for accessories.
  const defaultVariant =
    product.variants[isAccessory ? 0 : 2] ?? product.variants[0];

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      variantId: defaultVariant.id,
      slug: product.slug,
      name: product.name,
      length: defaultVariant.length,
      texture: product.texture,
      price: defaultVariant.price,
      tone: product.tone,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage
            tone={product.tone}
            src={`/photos/p-${product.slug}.webp`}
            alt={
              isAccessory
                ? product.name
                : `${product.name} — ${product.texture} raw human hair`
            }
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-espresso/55 via-espresso/5 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <button
              onClick={quickAdd}
              className="pointer-events-auto flex w-full translate-y-3 items-center justify-center gap-2 rounded-full bg-background/95 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-espresso backdrop-blur transition-transform duration-500 hover:bg-background group-hover:translate-y-0"
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5 text-brand-600" /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {isAccessory ? "Quick add" : "Quick add · 16”"}
                </>
              )}
            </button>
          </div>
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.bestseller && (
              <span className="rounded-full bg-espresso/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-cream">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white">
                New
              </span>
            )}
            {savings > 0 && (
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-brand-700 ring-1 ring-brand-200">
                Save {savings}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        aria-label="Toggle wishlist"
        onClick={() =>
          toggle({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            texture: product.texture,
            origin: product.origin,
            price: from,
            tone: product.tone,
          })
        }
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 backdrop-blur transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            inWishlist ? "fill-brand-500 text-brand-500" : "text-espresso",
          )}
        />
      </button>

      <div className="mt-4">
        <div className="flex items-center gap-1 text-xs text-muted">
          {isAccessory ? (
            <span className="uppercase tracking-[0.15em] text-brand-600">
              Hair Care &amp; Essentials
            </span>
          ) : (
            <>
              <span className="uppercase tracking-[0.15em] text-brand-600">
                {product.origin}
              </span>
              <span>·</span>
              <span>{product.texture}</span>
            </>
          )}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-espresso transition-colors group-hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-baseline gap-2 text-sm text-espresso">
            <span>
              {isAccessory ? (
                <span className="font-medium">{formatPrice(from)}</span>
              ) : (
                <>
                  From <span className="font-medium">{formatPrice(from)}</span>
                </>
              )}
            </span>
            {savings > 0 && (
              <span className="text-xs text-muted line-through">
                {formatPrice(compareAt!)}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Star className="h-3.5 w-3.5 fill-brand-400 text-brand-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
