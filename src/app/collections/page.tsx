import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCollections, getProducts } from "@/lib/repository";
import { ProductImage } from "@/components/ui/product-image";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore our curated collections of raw human hair — Signature Raw, Raw Brazilian, Cambodian Luxe, Vietnamese Silk and Hair Care Essentials.",
};

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts(),
  ]);
  const countFor = (slug: string) =>
    products.filter((p) => p.collection === slug).length;
  return (
    <>
      <section className="bg-cream">
        <div className="container-lux py-14 text-center">
          <span className="eyebrow">Curated by texture &amp; origin</span>
          <h1 className="mt-3 text-5xl text-espresso lg:text-6xl">Collections</h1>
          <p className="mx-auto mt-4 max-w-xl text-espresso/70">
            Signature lines and considered essentials, each hand-selected for a
            distinct feel, hold, and lifespan.
          </p>
        </div>
      </section>

      <section className="container-lux space-y-6 py-14">
        {collections.map((c, i) => {
          const count = countFor(c.slug);
          return (
            <Reveal key={c.id} delay={i * 60}>
              <Link
                href={`/collections/${c.slug}`}
                className="group grid overflow-hidden rounded-3xl bg-cream md:grid-cols-2"
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <ProductImage
                    src={`/photos/c-${c.slug}.webp`}
                    tone={c.tone}
                    alt={c.name}
                    ratio="aspect-[16/10]"
                    className="rounded-none"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-14">
                  <span className="eyebrow">{count} {count === 1 ? "style" : "styles"}</span>
                  <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">
                    {c.name}
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-xl italic text-brand-600">
                    {c.tagline}
                  </p>
                  <p className="mt-4 max-w-md text-espresso/70">{c.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-espresso transition-colors group-hover:text-brand-600">
                    Shop collection <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
