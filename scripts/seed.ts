/**
 * Seed Supabase with the demo catalog (collections, products, variants).
 *
 * Usage (Node 22.18+ / 24 runs TypeScript directly):
 *   1. Set env vars (or put them in .env.local and export them):
 *        NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   2. Run:  node scripts/seed.ts
 *
 * Safe to re-run: it upserts by slug/sku.
 */
import { createClient } from "@supabase/supabase-js";
import { collections, products } from "../src/lib/data.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  console.log("Seeding collections…");
  const { data: cols, error: colErr } = await supabase
    .from("collections")
    .upsert(
      collections.map((c) => ({
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        tone: c.tone,
      })),
      { onConflict: "slug" },
    )
    .select("id, slug");
  if (colErr) throw colErr;

  const collectionIdBySlug = new Map(cols!.map((c) => [c.slug, c.id]));
  console.log(`  ✓ ${cols!.length} collections`);

  console.log("Seeding products…");
  for (const p of products) {
    const { data: prod, error: prodErr } = await supabase
      .from("products")
      .upsert(
        {
          slug: p.slug,
          name: p.name,
          // texture/origin are NOT NULL in the schema; accessories have none,
          // so fall back to placeholders (the app hides them for hair-care).
          texture: p.texture ?? "Accessory",
          origin: p.origin ?? "Hair Secrets",
          collection_id: collectionIdBySlug.get(p.collection) ?? null,
          short_description: p.shortDescription,
          description: p.description,
          features: p.features,
          images: p.images,
          tone: p.tone,
          rating: p.rating,
          review_count: p.reviewCount,
          bestseller: p.bestseller ?? false,
          is_new: p.isNew ?? false,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (prodErr) throw prodErr;

    const { error: varErr } = await supabase.from("product_variants").upsert(
      p.variants.map((v) => ({
        product_id: prod!.id,
        length: v.length,
        price: v.price,
        compare_at: v.compareAt ?? null,
        stock: v.stock,
        sku: v.sku,
      })),
      { onConflict: "sku" },
    );
    if (varErr) throw varErr;
    console.log(`  ✓ ${p.name} (${p.variants.length} variants)`);
  }

  console.log("\nDone. Catalog seeded successfully.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
