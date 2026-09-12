import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import { getProducts, getCollections } from "@/lib/repository";
import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/ui/product-image";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/marquee";
import { NewsletterForm } from "@/components/newsletter-form";

export const revalidate = 300;

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const featured = products.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/40 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-nude/50 blur-[90px]" />
        <div className="container-lux relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="eyebrow">Ethically sourced · Single donor</span>
            <h1 className="mt-5 text-balance text-5xl leading-[1.05] text-espresso sm:text-6xl lg:text-7xl">
              Raw hair, <br />
              <span className="italic text-brand-600">real luxury.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-espresso/70">
              100% unprocessed, full-cuticle human hair that lasts for years.
              Discover the secret the world&apos;s most radiant women keep.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop" className="btn btn-primary shine">
                Shop the Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections" className="btn btn-outline">
                Explore Collections
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-espresso/60">
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl text-espresso">
                  12k+
                </p>
                <p>Happy clients</p>
              </div>
              <div className="h-10 w-px bg-brand-200" />
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl text-espresso">
                  4.9★
                </p>
                <p>Average rating</p>
              </div>
              <div className="h-10 w-px bg-brand-200" />
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl text-espresso">
                  60+
                </p>
                <p>Countries shipped</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in px-2 pb-10 sm:px-8 lg:pb-4">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              {/* Decorative frame */}
              <div className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-brand-200/70 lg:-inset-4" />
              {/* Primary editorial image */}
              <div className="overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)]">
                <ProductImage
                  src="/photos/hero-1.webp"
                  alt="Model wearing luxury raw human hair"
                  ratio="aspect-[4/5]"
                  priority
                />
              </div>
              {/* Overlapping secondary image */}
              <div className="animate-float-slow absolute -bottom-8 -left-6 hidden w-36 overflow-hidden rounded-2xl border-[5px] border-background shadow-[var(--shadow-card)] sm:block lg:-left-10 lg:w-44">
                <ProductImage
                  src="/photos/hero-2.webp"
                  alt="Model wearing sleek raw human hair"
                  ratio="aspect-[3/4]"
                  priority
                />
              </div>
              {/* Floating review chip */}
              <div className="animate-float absolute -right-3 top-8 rounded-2xl bg-background/95 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur lg:-right-6">
                <div className="flex gap-0.5 text-sm leading-none text-brand-400">
                  ★★★★★
                </div>
                <p className="mt-1.5 text-xs text-espresso/70">
                  <span className="font-medium text-espresso">4.9</span> from 12k+ clients
                </p>
              </div>
              {/* Guarantee ribbon */}
              <div className="absolute -bottom-5 right-4 rounded-full bg-espresso px-5 py-2.5 text-center shadow-[var(--shadow-soft)] lg:right-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-brand-300">
                  Guaranteed
                </p>
                <p className="font-[family-name:var(--font-display)] text-base text-cream">
                  Raw &amp; Unprocessed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-brand-100 bg-background">
        <div className="container-lux grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Free Kampala Delivery", sub: "Within 5km of Central Kampala" },
            { icon: ShieldCheck, title: "100% Raw Promise", sub: "Single-donor, verified" },
            { icon: RefreshCw, title: "Reusable for Years", sub: "3–5 year lifespan" },
            { icon: Sparkles, title: "Ethically Sourced", sub: "Fair-trade partners" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon className="h-6 w-6 shrink-0 text-brand-500" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-espresso">{item.title}</p>
                <p className="text-xs text-muted">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="container-lux py-20">
        <Reveal className="mb-12 text-center">
          <span className="eyebrow">Curated for you</span>
          <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">Our Collections</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="relative">
                  <ProductImage
                    src={`/photos/c-${c.slug}.webp`}
                    tone={c.tone}
                    alt={c.name}
                    ratio="aspect-[3/4]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent p-5 text-cream">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl">
                      {c.name}
                    </h3>
                    <p className="text-sm text-cream/80">{c.tagline}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] opacity-0 transition-opacity group-hover:opacity-100">
                      Discover <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee
        items={[
          "Length. Luxury. Legacy.",
          "Human Hair Extensions",
          "Customized Wigs",
          "HD Lace & Frontals",
          "Super Double Drawn",
          "Ethically Sourced",
          "Worldwide Shipping",
        ]}
      />

      {/* Bestsellers */}
      <section className="bg-cream py-20">
        <div className="container-lux">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="eyebrow">Loved by thousands</span>
              <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">Bestsellers</h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm uppercase tracking-[0.15em] text-brand-600 hover:text-espresso sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="container-lux grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal className="group">
          <ProductImage
            src="/photos/about-craft.webp"
            tone="linear-gradient(135deg,#2a211f 0%,#0f0b0a 100%)"
            alt="The Hair Secrets standard of craftsmanship"
            ratio="aspect-[4/3]"
          />
        </Reveal>
        <Reveal delay={120}>
          <span className="eyebrow">The Hair Secrets difference</span>
          <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">
            A secret worth keeping
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-espresso/70">
            Every bundle is sourced from a single donor, keeping cuticles intact
            and aligned in one direction. That&apos;s why our hair doesn&apos;t
            tangle, doesn&apos;t shed, and lasts through years of restyling.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Never chemically processed or acid-bathed",
              "Full, thick, double-drawn ends",
              "Colour-ready and heat-friendly",
              "Backed by our lifetime authenticity promise",
            ].map((li) => (
              <li key={li} className="flex items-start gap-3 text-espresso/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {li}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-outline mt-8">
            Read our story
          </Link>
        </Reveal>
      </section>

      {/* Editorial campaign band */}
      <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden lg:min-h-[70vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/editorial.webp"
          alt="Hair Secrets Store raw human hair collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-espresso/60" />
        <div className="container-lux relative text-center text-cream">
          <span className="eyebrow text-brand-300">The Hair Secrets standard</span>
          <p className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl italic leading-tight lg:text-6xl">
            Length. Luxury. Legacy.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-cream/80">
            100% raw, single-donor hair — understood, considered, and beautifully
            composed for the women who never compromise.
          </p>
          <Link href="/shop" className="btn btn-primary shine mt-9 bg-cream text-espresso hover:bg-brand-300">
            Discover the collection
          </Link>
        </div>
      </section>

      {/* Featured grid */}
      <section className="container-lux py-20">
        <Reveal className="mb-12 text-center">
          <span className="eyebrow">Fresh arrivals</span>
          <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">Shop New In</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-espresso py-24 text-cream">
        <div className="container-lux grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="group">
            <div className="relative overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/editorial-model.webp"
                alt="A Hair Secrets Store look"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent p-6">
                <p className="font-[family-name:var(--font-display)] text-2xl italic text-cream">
                  Wear your secret beautifully.
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <div className="mb-10">
              <span className="eyebrow text-brand-300">Loved worldwide</span>
              <h2 className="mt-3 text-4xl text-cream lg:text-5xl">
                From our community
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-1">
            {[
              {
                q: "Three years in and my Cambodian straight bundles still look brand new. Worth every penny.",
                a: "Amara O.",
                loc: "London, UK",
              },
              {
                q: "The body wave is unreal — no shedding, holds a curl for days. I'm a client for life.",
                a: "Nadia K.",
                loc: "Kampala, UG",
              },
              {
                q: "Fast DHL delivery and the hair blended perfectly with my 4C. Finally found my brand.",
                a: "Tiffany R.",
                loc: "Atlanta, US",
              },
            ].map((t) => (
              <div
                key={t.a}
                className="rounded-2xl border border-cream/10 bg-espresso-soft p-8"
              >
                <div className="mb-4 flex gap-1 text-brand-300">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <p className="font-[family-name:var(--font-display)] text-xl italic leading-relaxed text-cream/90">
                  &ldquo;{t.q}&rdquo;
                </p>
                <p className="mt-6 text-sm text-cream/60">
                  <span className="text-cream">{t.a}</span> · {t.loc}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-lux py-24">
        <div className="relative overflow-hidden rounded-3xl bg-cream px-6 py-16 text-center">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-nude/60 blur-3xl" />
          <div className="relative mx-auto max-w-xl">
            <span className="eyebrow">Join the inner circle</span>
            <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">
              Unlock 10% off your first order
            </h2>
            <p className="mt-4 text-espresso/70">
              Be first to know about restocks, new textures, and private sales.
            </p>
            <NewsletterForm source="homepage" />
          </div>
        </div>
      </section>
    </>
  );
}
