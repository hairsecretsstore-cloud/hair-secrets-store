import type { Collection, Product, ProductVariant } from "./types";
import {
  products as demoProducts,
  collections as demoCollections,
} from "./data";
import { hasSupabase } from "./supabase/config";
import { createClient } from "./supabase/server";

/*
 * Single source of truth for catalog reads.
 * When Supabase is configured, data comes from the database; any error falls
 * back to demo data so pages never crash (important during first deploy /
 * before the tables are seeded).
 */

// ---- Row → domain mappers -------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapVariant(row: any): ProductVariant {
  return {
    id: row.id,
    length: row.length,
    price: row.price,
    compareAt: row.compare_at ?? undefined,
    stock: row.stock,
    sku: row.sku,
  };
}

function mapProduct(row: any): Product {
  const variants = (row.variants ?? []).map(mapVariant);
  variants.sort((a: ProductVariant, b: ProductVariant) => a.length - b.length);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    texture: row.texture,
    origin: row.origin,
    collection: row.collection?.slug ?? row.collection_slug ?? "",
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    features: row.features ?? [],
    images: row.images ?? [],
    tone: row.tone ?? "linear-gradient(135deg,#ccaeaa 0%,#98756f 100%)",
    variants,
    rating: Number(row.rating ?? 5),
    reviewCount: row.review_count ?? 0,
    bestseller: row.bestseller ?? false,
    isNew: row.is_new ?? false,
  };
}

function mapCollection(row: any): Collection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    tone: row.tone ?? "linear-gradient(135deg,#ccaeaa 0%,#98756f 100%)",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const PRODUCT_SELECT =
  "*, collection:collections(slug), variants:product_variants(*)";

// ---- Public API -----------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabase) return demoProducts;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: true });
    if (error || !data?.length) return demoProducts;
    return data.map(mapProduct);
  } catch {
    return demoProducts;
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  if (!hasSupabase) return demoProducts.find((p) => p.slug === slug);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .single();
    if (error || !data) return demoProducts.find((p) => p.slug === slug);
    return mapProduct(data);
  } catch {
    return demoProducts.find((p) => p.slug === slug);
  }
}

export async function getCollections(): Promise<Collection[]> {
  if (!hasSupabase) return demoCollections;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("collections").select("*");
    if (error || !data?.length) return demoCollections;
    return data.map(mapCollection);
  } catch {
    return demoCollections;
  }
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | undefined> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug);
}

export async function getProductsInCollection(
  slug: string,
): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.collection === slug);
}
