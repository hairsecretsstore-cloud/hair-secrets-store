"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Check,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart, useWishlist } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[2]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) =>
    s.items.some((i) => i.productId === product.id),
  );

  const photo = `/photos/p-${product.slug}.webp`;
  const secondaries: Record<string, string> = {
    "cambodian-deep-wave": "/photos/p2-deep-wave.webp",
    "signature-raw-straight": "/photos/p2-straight-a.webp",
    "vietnamese-silk-straight": "/photos/p2-straight-b.webp",
  };
  const second = secondaries[product.slug];
  const gallery: { src?: string; tone?: string }[] = [
    { src: photo },
    second ? { src: second } : { tone: product.tone },
    { tone: "linear-gradient(135deg,#2a211f 0%,#0f0b0a 100%)" },
  ];
  const active = gallery[activeImg];

  function handleAdd() {
    add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      length: variant.length,
      texture: product.texture,
      price: variant.price,
      tone: product.tone,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="group">
        <ProductImage
          src={active.src}
          tone={active.tone}
          alt={`${product.name} — ${product.texture}`}
          label={active.src ? undefined : product.texture}
          priority
        />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={cn(
                "overflow-hidden rounded-lg ring-2 transition",
                activeImg === i ? "ring-brand-500" : "ring-transparent",
              )}
            >
              <ProductImage
                src={g.src}
                tone={g.tone}
                alt={product.name}
                ratio="aspect-square"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/shop" className="hover:text-brand-600">Shop</Link>
          <span>/</span>
          <span>{product.origin}</span>
        </div>
        <h1 className="mt-3 text-4xl text-espresso lg:text-5xl">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(product.rating)
                    ? "fill-brand-400 text-brand-400"
                    : "text-brand-200",
                )}
              />
            ))}
          </span>
          <span className="text-sm text-muted">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-3xl font-medium text-espresso">
            {formatPrice(variant.price)}
          </span>
          {variant.compareAt && (
            <span className="mb-1 text-lg text-muted line-through">
              {formatPrice(variant.compareAt)}
            </span>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-espresso/75">
          {product.description}
        </p>

        {/* Length selector */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-espresso">
              Length: <span className="text-brand-600">{variant.length}"</span>
            </span>
            <span
              className={cn(
                "text-xs",
                variant.stock <= 3 ? "text-red-500" : "text-green-700",
              )}
            >
              {variant.stock <= 3
                ? `Only ${variant.stock} left`
                : "In stock"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v)}
                className={cn(
                  "min-w-[3.25rem] rounded-full border px-3 py-2 text-sm transition",
                  variant.id === v.id
                    ? "border-espresso bg-espresso text-cream"
                    : "border-brand-200 text-espresso hover:border-brand-500",
                )}
              >
                {v.length}"
              </button>
            ))}
          </div>
        </div>

        {/* Qty + add */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center justify-between rounded-full border border-brand-200 px-2 sm:w-36">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-10 place-items-center text-espresso"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-10 w-10 place-items-center text-espresso"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button onClick={handleAdd} className="btn btn-primary flex-1">
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to bag
              </>
            ) : (
              <>Add to bag · {formatPrice(variant.price * qty)}</>
            )}
          </button>
          <button
            onClick={() =>
              toggleWish({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                texture: product.texture,
                origin: product.origin,
                price: variant.price,
                tone: product.tone,
              })
            }
            aria-label="Add to wishlist"
            className="grid h-12 w-12 place-items-center rounded-full border border-brand-200 transition hover:border-brand-500"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                inWishlist ? "fill-brand-500 text-brand-500" : "text-espresso",
              )}
            />
          </button>
        </div>

        {/* Trust icons */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-brand-100 py-5 text-center text-xs text-espresso/70">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="h-5 w-5 text-brand-500" strokeWidth={1.5} />
            Worldwide DHL
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-brand-500" strokeWidth={1.5} />
            Raw guarantee
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RefreshCw className="h-5 w-5 text-brand-500" strokeWidth={1.5} />
            Reusable years
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-espresso">
            Why you&apos;ll love it
          </h3>
          <ul className="space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-espresso/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
