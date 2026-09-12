import type { Collection, Product } from "./types";

// Elegant tonal gradients used as premium image placeholders.
const TONES = {
  espresso: "linear-gradient(135deg,#3d302d 0%,#2a211f 100%)",
  mocha: "linear-gradient(135deg,#7d5f5a 0%,#4a3a37 100%)",
  mauve: "linear-gradient(135deg,#ccaeaa 0%,#98756f 100%)",
  nude: "linear-gradient(135deg,#e8d9cd 0%,#c9a996 100%)",
  honey: "linear-gradient(135deg,#e2c4a0 0%,#a97f5a 100%)",
  cream: "linear-gradient(135deg,#f7f2ec 0%,#d8c3b3 100%)",
  noir: "linear-gradient(135deg,#2a211f 0%,#0f0b0a 100%)",
};

export const collections: Collection[] = [
  {
    id: "c1",
    slug: "signature-raw",
    name: "Signature Raw",
    tagline: "Unprocessed. Untouched. Yours.",
    description:
      "Our flagship line of 100% raw, single-donor human hair — never chemically processed, never blended. Full cuticle, aligned, and built to last for years.",
    tone: TONES.mauve,
  },
  {
    id: "c2",
    slug: "raw-brazilian",
    name: "Raw Brazilian",
    tagline: "Bold body, effortless movement.",
    description:
      "Naturally full and forgiving, our Raw Brazilian holds curls beautifully and blends with most textures.",
    tone: TONES.mocha,
  },
  {
    id: "c3",
    slug: "cambodian-luxe",
    name: "Cambodian Luxe",
    tagline: "Dense, durable, dreamy.",
    description:
      "Coarser and incredibly resilient — Cambodian raw hair is the connoisseur's choice for longevity and thickness.",
    tone: TONES.espresso,
  },
  {
    id: "c4",
    slug: "vietnamese-silk",
    name: "Vietnamese Silk",
    tagline: "Sleek by nature.",
    description:
      "Prized for its natural silkiness and single-drawn fullness from root to tip.",
    tone: TONES.nude,
  },
];

function variants(base: number, opts?: { newSeason?: boolean }) {
  const lengths = [12, 14, 16, 18, 20, 22, 24, 26];
  return lengths.map((len, i) => {
    // Prices in whole Ugandan Shillings (UGX).
    const price = (base + i * 3500) * 20;
    const lowStock = i === lengths.length - 1;
    return {
      id: `v-${len}`,
      length: len,
      price,
      compareAt: opts?.newSeason ? undefined : Math.round((price * 1.18) / 1000) * 1000,
      stock: lowStock ? 3 : 8 + ((i * 7) % 20),
      sku: `HS-${len}-${base}`,
    };
  });
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "raw-brazilian-body-wave",
    name: "Raw Brazilian Body Wave",
    texture: "Body Wave",
    origin: "Brazilian",
    collection: "raw-brazilian",
    shortDescription: "Soft S-wave with luxurious bounce and natural sheen.",
    description:
      "Ethically sourced from a single donor, our Raw Brazilian Body Wave features a soft, undulating S-pattern that dries into effortless waves. Full cuticle and aligned for zero tangling, minimal shedding, and years of restyling — colour it, curl it, straighten it.",
    features: [
      "100% raw single-donor human hair",
      "Full cuticle, aligned & unprocessed",
      "Double-drawn for thickness end to end",
      "Colour-ready up to 613 blonde",
      "3–5 year lifespan with proper care",
    ],
    images: [],
    tone: TONES.mocha,
    variants: variants(18000),
    rating: 4.9,
    reviewCount: 214,
    bestseller: true,
  },
  {
    id: "p2",
    slug: "signature-raw-straight",
    name: "Signature Raw Straight",
    texture: "Straight",
    origin: "Cambodian",
    collection: "signature-raw",
    shortDescription: "Glass-sleek, bone-straight, mirror shine.",
    description:
      "The definition of understated luxury. Our Signature Raw Straight falls in a clean, weighty line with a natural mirror finish that needs almost no heat. A true investment bundle.",
    features: [
      "Single-donor raw Cambodian hair",
      "Natural straight — minimal flat-ironing",
      "Thick, blunt, healthy ends",
      "Neutral #1B natural black",
      "Reusable for 3+ years",
    ],
    images: [],
    tone: TONES.espresso,
    variants: variants(20000),
    rating: 5.0,
    reviewCount: 341,
    bestseller: true,
  },
  {
    id: "p3",
    slug: "cambodian-deep-wave",
    name: "Cambodian Deep Wave",
    texture: "Deep Wave",
    origin: "Cambodian",
    collection: "cambodian-luxe",
    shortDescription: "Deep, defined coils with wet-look drama.",
    description:
      "Rich, spiralling deep waves that spring to life when wet. Coarse and dense with exceptional hold — perfect for voluminous, romantic styles that last all day.",
    features: [
      "Raw Cambodian, coarse & dense",
      "Defined deep-wave pattern",
      "Holds curl without product",
      "Low shed, low tangle",
      "Restylable & reusable",
    ],
    images: [],
    tone: TONES.noir,
    variants: variants(21500),
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
  },
  {
    id: "p4",
    slug: "vietnamese-silk-straight",
    name: "Vietnamese Silk Straight",
    texture: "Straight",
    origin: "Vietnamese",
    collection: "vietnamese-silk",
    shortDescription: "Feather-light silk with a natural swing.",
    description:
      "Single-drawn Vietnamese hair known for its natural silky slip and lightweight feel. Lays flat against the crown for the most seamless installs.",
    features: [
      "Raw Vietnamese single-drawn",
      "Naturally silky & lightweight",
      "Seamless flat install",
      "Natural dark brown roots",
      "Heat-friendly & colour-ready",
    ],
    images: [],
    tone: TONES.nude,
    variants: variants(19000, { newSeason: true }),
    rating: 4.9,
    reviewCount: 98,
    isNew: true,
  },
  {
    id: "p5",
    slug: "raw-curly-brazilian",
    name: "Raw Brazilian Curly",
    texture: "Curly",
    origin: "Brazilian",
    collection: "raw-brazilian",
    shortDescription: "Bouncy natural curls with big volume.",
    description:
      "A springy, natural curl pattern with incredible fullness. Wash-and-go friendly and endlessly restylable — from defined coils to a stretched blowout.",
    features: [
      "Raw Brazilian curly pattern",
      "Big natural volume",
      "Wash-and-go ready",
      "Reverts perfectly after washing",
      "Long lifespan",
    ],
    images: [],
    tone: TONES.mauve,
    variants: variants(18500),
    rating: 4.7,
    reviewCount: 187,
  },
  {
    id: "p6",
    slug: "signature-kinky-curly",
    name: "Signature Kinky Curly",
    texture: "Kinky Curly",
    origin: "Indian",
    collection: "signature-raw",
    shortDescription: "Coily texture that blends with 4A–4C natural hair.",
    description:
      "Designed to melt into natural type-4 hair, our Kinky Curly is the go-to for protective styles that look like your own. Full, coily, and beautifully textured.",
    features: [
      "Blends with 4A–4C natural hair",
      "Raw Indian textured hair",
      "Protective-style perfect",
      "Defined coily pattern",
      "Reusable & restylable",
    ],
    images: [],
    tone: TONES.honey,
    variants: variants(17500),
    rating: 4.8,
    reviewCount: 132,
  },
  {
    id: "p7",
    slug: "peruvian-water-wave",
    name: "Peruvian Water Wave",
    texture: "Water Wave",
    origin: "Peruvian",
    collection: "signature-raw",
    shortDescription: "Loose, watery waves with airy movement.",
    description:
      "Light, flowing water waves that move like the real thing. Peruvian hair is soft and airy, making it ideal for a lived-in, beachy finish.",
    features: [
      "Raw Peruvian, soft & airy",
      "Loose water-wave pattern",
      "Lightweight & full",
      "Effortless beachy finish",
      "Colour-ready",
    ],
    images: [],
    tone: TONES.cream,
    variants: variants(18800),
    rating: 4.9,
    reviewCount: 121,
    bestseller: true,
  },
  {
    id: "p8",
    slug: "cambodian-straight-luxe",
    name: "Cambodian Luxe Straight",
    texture: "Straight",
    origin: "Cambodian",
    collection: "cambodian-luxe",
    shortDescription: "Thick, coarse, and built to outlast trends.",
    description:
      "For those who want maximum density and durability. Our coarsest raw straight bundle — thick from weft to tip with an unmistakably natural texture.",
    features: [
      "Coarsest raw Cambodian",
      "Maximum density",
      "Natural yaki-like texture",
      "Exceptional longevity",
      "Blends with relaxed hair",
    ],
    images: [],
    tone: TONES.espresso,
    variants: variants(22000),
    rating: 5.0,
    reviewCount: 76,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function productsInCollection(slug: string) {
  return products.filter((p) => p.collection === slug);
}

export const textures = [
  "Straight",
  "Body Wave",
  "Deep Wave",
  "Curly",
  "Kinky Curly",
  "Water Wave",
] as const;

export const origins = [
  "Brazilian",
  "Peruvian",
  "Cambodian",
  "Vietnamese",
  "Indian",
] as const;
