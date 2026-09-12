import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ProductImage } from "@/components/ui/product-image";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collections & Services",
  description:
    "Explore the full range of Hair Secrets Store — human hair extensions, customized wigs, HD lace, frontals, closures, clip-ins, micro links, installations and hair care essentials.",
};

const images = [
  "/photos/s-extensions.webp",
  "/photos/s-customized.webp",
  "/photos/s-lace.webp",
  "/photos/s-install.webp",
  "/photos/s-care.webp",
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="container-lux py-16 text-center">
          <span className="eyebrow">Composed with consideration</span>
          <h1 className="mt-3 text-5xl text-espresso lg:text-6xl">
            Collections &amp; Services
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-espresso/70">
            From carefully selected extensions to fully customized units, every
            HSS piece is understood, considered and beautifully composed.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-brand-600">
            {site.slogan}
          </p>
        </div>
      </section>

      <section className="container-lux space-y-6 py-16">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 2) * 60}>
            <div
              className={`group grid overflow-hidden rounded-3xl bg-cream md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div>
                <ProductImage
                  src={images[i % images.length]}
                  alt={s.title}
                  ratio="aspect-[16/11]"
                  className="rounded-none"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="eyebrow">0{i + 1}</span>
                <h2 className="mt-2 text-3xl text-espresso lg:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-espresso/70">{s.blurb}</p>
                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-espresso/80"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* CTA */}
      <section className="container-lux pb-24">
        <div className="rounded-3xl bg-espresso px-6 py-16 text-center text-cream">
          <h2 className="text-4xl text-cream lg:text-5xl">
            Begin with a consultation
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">
            Every HSS experience begins with understanding you. Tell us your
            texture, length, tone and finish — we&apos;ll compose the rest.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="btn btn-primary shine bg-cream text-espresso hover:bg-brand-300"
            >
              Book a consultation
            </Link>
            <Link
              href="/shop"
              className="btn btn-outline border-cream/30 text-cream hover:bg-cream hover:text-espresso"
            >
              Shop ready-to-wear
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
