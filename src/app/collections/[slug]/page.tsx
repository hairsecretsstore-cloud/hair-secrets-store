import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections as demoCollections } from "@/lib/data";
import {
  getCollectionBySlug,
  getProductsInCollection,
} from "@/lib/repository";
import { ProductCard } from "@/components/product/product-card";

export const revalidate = 300;

export function generateStaticParams() {
  return demoCollections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollectionBySlug(slug);
  if (!c) return { title: "Collection not found" };
  return { title: c.name, description: c.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const items = await getProductsInCollection(slug);

  return (
    <>
      <section className="relative py-24 text-center text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/photos/c-${collection.slug}.webp`}
          alt={collection.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-espresso/60" />
        <div className="container-lux relative">
          <span className="eyebrow text-cream/80">Collection</span>
          <h1 className="mt-3 text-5xl text-cream lg:text-6xl">{collection.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/85">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="container-lux py-14">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
