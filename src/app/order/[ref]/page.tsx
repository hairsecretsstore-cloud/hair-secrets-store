import Link from "next/link";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  const steps = [
    { icon: CheckCircle2, label: "Order confirmed", done: true },
    { icon: Package, label: "Processing", done: false },
    { icon: Truck, label: "Shipped (DHL)", done: false },
    { icon: Home, label: "Delivered", done: false },
  ];

  return (
    <section className="container-lux py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-white">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-4xl text-espresso lg:text-5xl">
          Thank you for your order
        </h1>
        <p className="mt-3 text-espresso/70">
          Your payment was successful and your order is confirmed.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5">
          <span className="text-sm text-muted">Order reference</span>
          <span className="font-medium tracking-wide text-espresso">{ref}</span>
        </div>

        {/* Progress */}
        <div className="mt-12 flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.label} className="relative flex flex-1 flex-col items-center">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 h-0.5 w-full bg-brand-100" />
              )}
              <div
                className={`relative z-10 grid h-12 w-12 place-items-center rounded-full ${
                  s.done ? "bg-brand-500 text-white" : "bg-cream text-brand-400"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs text-espresso/70">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/track?ref=${ref}`} className="btn btn-primary">
            Track my order
          </Link>
          <Link href="/shop" className="btn btn-outline">
            Continue shopping
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted">
          A confirmation email with your DHL tracking number will arrive shortly.
        </p>
      </div>
    </section>
  );
}
