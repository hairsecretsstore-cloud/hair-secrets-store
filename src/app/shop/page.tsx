import type { Metadata } from "next";
import { getProducts } from "@/lib/repository";
import { ShopGrid } from "@/components/product/shop-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop Raw Human Hair",
  description:
    "Browse our full range of 100% raw, single-donor human hair bundles — straight, body wave, deep wave, curly and more.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <section className="bg-cream">
        <div className="container-lux py-14 text-center">
          <span className="eyebrow">The full collection</span>
          <h1 className="mt-3 text-5xl text-espresso lg:text-6xl">Shop All Hair</h1>
          <p className="mx-auto mt-4 max-w-xl text-espresso/70">
            Every bundle is 100% raw, single-donor, and hand-selected for
            longevity. Filter by texture and origin to find your perfect match.
          </p>
        </div>
      </section>
      <section className="container-lux py-12">
        <ShopGrid allProducts={products} />
      </section>
    </>
  );
}
