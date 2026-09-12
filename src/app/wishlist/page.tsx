"use client";

import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlist, useCart } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);

  if (items.length === 0) {
    return (
      <div className="container-lux grid place-items-center py-32 text-center">
        <Heart className="h-14 w-14 text-brand-300" strokeWidth={1} />
        <h1 className="mt-6 text-4xl text-espresso">Your wishlist is empty</h1>
        <p className="mt-3 text-espresso/60">
          Tap the heart on any product to save it here.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Browse hair
        </Link>
      </div>
    );
  }

  return (
    <section className="container-lux py-14">
      <h1 className="text-4xl text-espresso lg:text-5xl">My Wishlist</h1>
      <p className="mt-2 text-espresso/60">{items.length} saved items</p>

      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {items.map((item) => {
          const product = getProduct(item.slug);
          return (
            <div key={item.productId} className="group relative">
              <button
                onClick={() => remove(item.productId)}
                aria-label="Remove from wishlist"
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur hover:bg-background"
              >
                <X className="h-4 w-4 text-espresso" />
              </button>
              <Link href={`/product/${item.slug}`} className="block">
                <ProductImage
                  src={`/photos/p-${item.slug}.webp`}
                  tone={item.tone}
                  alt={item.name}
                />
              </Link>
              <div className="mt-3">
                <p className="text-xs uppercase tracking-[0.15em] text-brand-600">
                  {item.texture ? `${item.origin} · ${item.texture}` : "Hair Care & Essentials"}
                </p>
                <Link href={`/product/${item.slug}`}>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-espresso group-hover:text-brand-600">
                    {item.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-espresso">
                  From {formatPrice(item.price)}
                </p>
                {product && (
                  <button
                    onClick={() => {
                      const v =
                        product.variants[
                          product.category === "accessory" ? 0 : 2
                        ] ?? product.variants[0];
                      add({
                        productId: product.id,
                        variantId: v.id,
                        slug: product.slug,
                        name: product.name,
                        length: v.length,
                        texture: product.texture,
                        price: v.price,
                        tone: product.tone,
                        quantity: 1,
                      });
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-300 py-2 text-sm text-espresso transition hover:bg-espresso hover:text-cream"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to bag
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
