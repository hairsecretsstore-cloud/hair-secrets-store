"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

export function ProductCard({ product }: { product: Product }) {
  const toggle = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) =>
    s.items.some((i) => i.productId === product.id),
  );
  const from = Math.min(...product.variants.map((v) => v.price));

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage
            tone={product.tone}
            src={`/photos/p-${product.slug}.webp`}
            alt={`${product.name} — ${product.texture} raw human hair`}
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="mb-4 translate-y-2 rounded-full bg-background/90 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-espresso backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
              View Details
            </span>
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
          <span className="uppercase tracking-[0.15em] text-brand-600">
            {product.origin}
          </span>
          <span>·</span>
          <span>{product.texture}</span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-espresso transition-colors group-hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-espresso">
            From <span className="font-medium">{formatPrice(from)}</span>
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
