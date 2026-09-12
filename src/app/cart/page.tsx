"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

const FREE_SHIP_THRESHOLD = 1000000; // USh 1,000,000

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : 100000;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="container-lux grid place-items-center py-32 text-center">
        <ShoppingBag className="h-14 w-14 text-brand-300" strokeWidth={1} />
        <h1 className="mt-6 text-4xl text-espresso">Your bag is empty</h1>
        <p className="mt-3 text-espresso/60">
          Discover raw hair worth keeping a secret.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="container-lux py-14">
      <h1 className="text-4xl text-espresso lg:text-5xl">Shopping Bag</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {remaining > 0 && (
            <div className="mb-6 rounded-xl bg-cream p-4 text-sm text-espresso">
              Add <strong>{formatPrice(remaining)}</strong> more for free
              worldwide DHL Express shipping.
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <ul className="divide-y divide-brand-100">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-6">
                <Link href={`/product/${item.slug}`} className="w-24 shrink-0">
                  <ProductImage
                    src={`/photos/p-${item.slug}.webp`}
                    tone={item.tone}
                    alt={item.name}
                    ratio="aspect-[4/5]"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-[family-name:var(--font-display)] text-xl text-espresso hover:text-brand-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {item.length > 0
                          ? `${item.texture} · ${item.length}"`
                          : "Hair Care & Essentials"}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.variantId)}
                      aria-label="Remove"
                      className="text-muted transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-full border border-brand-200">
                      <button
                        onClick={() => setQty(item.variantId, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.variantId, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-medium text-espresso">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-cream p-7 lg:sticky lg:top-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-espresso">
            Order Summary
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso/70">Subtotal</dt>
              <dd className="text-espresso">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso/70">Shipping</dt>
              <dd className="text-espresso">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-brand-200 pt-3 text-base">
              <dt className="font-medium text-espresso">Total</dt>
              <dd className="font-medium text-espresso">
                {formatPrice(subtotal + shipping)}
              </dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-brand-600 hover:text-espresso"
          >
            Continue shopping
          </Link>
          <p className="mt-5 text-center text-xs text-muted">
            Secure payments via DPO Pay · Mobile Money · Cards
          </p>
        </aside>
      </div>
    </section>
  );
}
