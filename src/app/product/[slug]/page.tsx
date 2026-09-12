import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products as demoProducts } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/repository";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";

export const revalidate = 300;

export function generateStaticParams() {
  return demoProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.id !== product.id && p.collection === product.collection)
    .slice(0, 4);
  const fallback = all.filter((p) => p.id !== product.id).slice(0, 4);
  const recommendations = related.length >= 4 ? related : fallback;

  return (
    <>
      <section className="container-lux py-10 lg:py-14">
        <ProductDetail product={product} />
      </section>

      <section className="container-lux pb-20">
        <h2 className="mb-8 text-center text-3xl text-espresso lg:text-4xl">
          You may also love
        </h2>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {recommendations.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
