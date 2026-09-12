"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Smartphone, CreditCard, Truck, Loader2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";

const FREE_SHIP_THRESHOLD = 1000000; // USh 1,000,000

type PayMethod = "mobile" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [method, setMethod] = useState<PayMethod>("mobile");
  const [plan, setPlan] = useState<"full" | "deposit">("full");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("Uganda");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : 100000;
  const total = subtotal + shipping;
  // HSS Payment Plan Policy: pay in full, or secure with a 70% deposit
  // (30% balance due on delivery).
  const amountDue = plan === "deposit" ? Math.round(total * 0.7) : total;
  const balance = total - amountDue;

  if (items.length === 0 && !loading) {
    return (
      <div className="container-lux grid place-items-center py-32 text-center">
        <h1 className="text-4xl text-espresso">Your bag is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const [firstName, ...rest] = String(fd.get("name") ?? "").split(" ");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: fd.get("email"),
          firstName,
          lastName: rest.join(" "),
          shipping,
          plan,
          paymentMethod: method === "mobile" ? "Mobile Money" : "Card",
          shippingAddress: {
            address: fd.get("address"),
            city: fd.get("city"),
            country,
            postal: fd.get("postal"),
            phone: fd.get("phone"),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      clear();
      // DPO returns an absolute hosted-payment URL; demo returns a local path.
      if (typeof data.paymentUrl === "string" && /^https?:\/\//.test(data.paymentUrl)) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(data.paymentUrl ?? `/order/${data.reference}?status=paid`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <section className="container-lux py-12">
      <h1 className="text-4xl text-espresso lg:text-5xl">Checkout</h1>

      <form
        onSubmit={placeOrder}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]"
      >
        <div className="space-y-10">
          {/* Contact */}
          <fieldset>
            <legend className="mb-4 font-[family-name:var(--font-display)] text-2xl text-espresso">
              1. Contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" name="name" />
              <Input label="Email" name="email" type="email" />
              <Input label="Phone (for delivery)" name="phone" type="tel" />
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset>
            <legend className="mb-4 font-[family-name:var(--font-display)] text-2xl text-espresso">
              2. Shipping address
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Address line" name="address" full />
              <Input label="City" name="city" />
              <div>
                <label className="mb-1.5 block text-sm text-espresso">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
                >
                  {["Uganda", "Kenya", "Tanzania", "Nigeria", "United States", "United Kingdom", "Canada", "South Africa"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    ),
                  )}
                </select>
              </div>
              <Input label="Postal code" name="postal" />
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-cream p-4 text-sm text-espresso">
              <Truck className="h-5 w-5 text-brand-500" />
              Delivered by <strong>DHL Express</strong> · tracked, 3–7 business days
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset>
            <legend className="mb-4 font-[family-name:var(--font-display)] text-2xl text-espresso">
              3. Payment
            </legend>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPlan("full")}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  plan === "full"
                    ? "border-brand-500 bg-brand-50"
                    : "border-brand-200 hover:border-brand-400",
                )}
              >
                <p className="text-sm font-medium text-espresso">Pay in full</p>
                <p className="text-xs text-muted">{formatPrice(total)} today</p>
              </button>
              <button
                type="button"
                onClick={() => setPlan("deposit")}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  plan === "deposit"
                    ? "border-brand-500 bg-brand-50"
                    : "border-brand-200 hover:border-brand-400",
                )}
              >
                <p className="text-sm font-medium text-espresso">
                  70% deposit plan
                </p>
                <p className="text-xs text-muted">
                  {formatPrice(Math.round(total * 0.7))} now · 30% on delivery
                </p>
              </button>
            </div>
            {plan === "deposit" && (
              <p className="mb-4 rounded-lg bg-cream px-3 py-2 text-xs text-espresso/80">
                Balance of {formatPrice(balance)} is payable on delivery. Plans
                must be completed within one month.{" "}
                <a href="/payment-plans" className="text-brand-600 underline">
                  See payment plan terms
                </a>
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <PayOption
                active={method === "mobile"}
                onClick={() => setMethod("mobile")}
                icon={Smartphone}
                title="Mobile Money"
                sub="MTN · Airtel via DPO Pay"
              />
              <PayOption
                active={method === "card"}
                onClick={() => setMethod("card")}
                icon={CreditCard}
                title="Card"
                sub="Visa · Mastercard via DPO Pay"
              />
            </div>
            <div className="mt-4 rounded-xl border border-brand-100 p-5">
              {method === "mobile" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Mobile Money number" name="momo" type="tel" />
                  <div>
                    <label className="mb-1.5 block text-sm text-espresso">
                      Network
                    </label>
                    <select className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500">
                      <option>MTN Mobile Money</option>
                      <option>Airtel Money</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted sm:col-span-2">
                    You&apos;ll receive a prompt on your phone to approve the
                    payment securely through DPO Pay.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <p className="text-sm text-espresso/70">
                    You&apos;ll be redirected to DPO Pay&apos;s secure hosted page
                    to enter your card details. We never store your card
                    information.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Lock className="h-4 w-4" /> PCI-DSS compliant · 3-D Secure
                  </div>
                </div>
              )}
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-cream p-7 lg:sticky lg:top-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-espresso">
            Your order
          </h2>
          <ul className="mt-5 space-y-4">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3">
                <div className="w-14 shrink-0">
                  <ProductImage
                    src={`/photos/p-${i.slug}.webp`}
                    tone={i.tone}
                    alt={i.name}
                    ratio="aspect-[4/5]"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="text-espresso">{i.name}</p>
                  <p className="text-muted">
                    {i.length > 0 ? `${i.length}" · ` : ""}Qty {i.quantity}
                  </p>
                </div>
                <span className="text-sm text-espresso">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-brand-200 pt-5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatPrice(shipping)}
            />
            <div className="flex justify-between border-t border-brand-200 pt-3 text-base font-medium text-espresso">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            {plan === "deposit" && (
              <>
                <Row label="Deposit due today (70%)" value={formatPrice(amountDue)} />
                <Row label="Balance on delivery (30%)" value={formatPrice(balance)} />
              </>
            )}
          </dl>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-6 w-full disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay {formatPrice(amountDue)}
              </>
            )}
          </button>
          <p className="mt-4 text-center text-xs text-muted">
            Secured by DPO Pay. By paying you agree to our terms.
          </p>
        </aside>
      </form>
    </section>
  );
}

function Input({
  label,
  name,
  type = "text",
  full,
}: {
  label: string;
  name: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm text-espresso">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function PayOption({
  active,
  onClick,
  icon: Icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 text-left transition",
        active
          ? "border-brand-500 bg-brand-50"
          : "border-brand-200 hover:border-brand-400",
      )}
    >
      <Icon className="h-6 w-6 text-brand-500" strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium text-espresso">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-espresso/70">{label}</dt>
      <dd className="text-espresso">{value}</dd>
    </div>
  );
}
