import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Ruler, Palette, Layers, Scissors, Feather } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { Reveal } from "@/components/ui/reveal";
import { brandValues, collectionIncludes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Hair Secrets Store is a premium human hair house specializing in carefully selected extensions, customized units and refined hair solutions. Length. Luxury. Legacy.",
};

const consultation = [
  { icon: Feather, label: "Texture" },
  { icon: Ruler, label: "Length" },
  { icon: Palette, label: "Tone & Colour" },
  { icon: Layers, label: "Density" },
  { icon: Scissors, label: "Lace Requirements" },
  { icon: Sparkles, label: "Desired Finish" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/40 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-nude/50 blur-[90px]" />
        <div className="container-lux relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center rounded-full border border-brand-300 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-brand-600">
              {site.slogan}
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-espresso lg:text-6xl">
              The art of <span className="italic text-brand-600">considered</span> hair
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-espresso/70">
              Hair Secrets Store is a premium human hair house specializing in
              carefully selected extensions, customized units and refined hair
              solutions. At HSS, every piece begins with consideration — from the
              initial consultation to the selection of texture, tone, density and
              length.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/services" className="btn btn-primary shine">
                Explore our services
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Book a consultation
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="animate-float">
              <ProductImage
                src="/photos/about-hero.webp"
                alt="A Hair Secrets Store client"
                ratio="aspect-[4/5]"
                priority
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-background px-6 py-3 text-center shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-600">
                A premium
              </p>
              <p className="font-[family-name:var(--font-display)] text-lg text-espresso">
                Human Hair House
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection includes — strip */}
      <section className="border-y border-brand-100 bg-background">
        <div className="container-lux py-8">
          <p className="mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-brand-600">
            Our collection includes
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {collectionIncludes.map((c) => (
              <span
                key={c}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm text-espresso/80 transition-colors hover:border-brand-500 hover:text-espresso"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Signature pull-quote */}
      <section className="container-lux py-24 text-center">
        <Reveal>
          <p className="mx-auto max-w-4xl font-[family-name:var(--font-display)] text-3xl leading-[1.3] text-espresso lg:text-[2.75rem]">
            We believe exceptional hair should not simply be selected — it should
            be <span className="italic text-brand-600">understood, considered</span>{" "}
            and beautifully composed.
          </p>
        </Reveal>
      </section>

      {/* Our Approach — consultation */}
      <section className="bg-cream py-20">
        <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <span className="eyebrow">Our approach</span>
            <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">
              The art of personal consultation
            </h2>
            <p className="mt-5 leading-relaxed text-espresso/70">
              Every HSS experience begins with understanding the client. Our
              consultations allow us to consider individual preferences, natural
              hair characteristics, desired styling and the specifications
              required for each piece. Because refinement begins with attention.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {consultation.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl bg-background p-5 transition-transform duration-500 hover:-translate-y-1">
                  <c.icon className="h-6 w-6 text-brand-500" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-espresso">
                    {c.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="bg-espresso py-20 text-cream">
        <div className="container-lux grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="animate-float-slow">
              <ProductImage
                src="/photos/about-craft.webp"
                alt="Hand-crafted lace wig unit"
                ratio="aspect-[4/3]"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow text-brand-300">Craftsmanship & quality</span>
            <h2 className="mt-3 text-4xl text-cream lg:text-5xl">
              Quality, intentionally
            </h2>
            <p className="mt-5 leading-relaxed text-cream/70">
              Each piece is assessed with attention to the specifications that
              define its final presentation — length, density, texture, tone and
              overall finish. Our collections include premium human hair options
              such as Super Double Drawn extensions and customized pieces
              designed for balanced fullness and natural movement.
            </p>
            <p className="mt-4 leading-relaxed text-cream/70">
              From density measurement to lace customization, every detail is
              considered as part of the HSS standard.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-lux py-20">
        <div className="mb-12 text-center">
          <span className="eyebrow">What we stand for</span>
          <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">Our Values</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {brandValues.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 70}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-cream p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[var(--shadow-soft)]">
                <span className="pointer-events-none absolute -right-1 -top-5 select-none font-[family-name:var(--font-display)] text-[8rem] leading-none text-brand-200/60 transition-colors duration-500 group-hover:text-brand-300/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative font-[family-name:var(--font-display)] text-2xl text-espresso">
                  {v.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-espresso/70">
                  {v.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-lux pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-brand-100 p-10">
              <span className="eyebrow">Our mission</span>
              <p className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-relaxed text-espresso lg:text-3xl">
                {site.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl bg-brand-500 p-10 text-white">
              <span className="text-xs uppercase tracking-[0.28em] text-white/80">
                Our vision
              </span>
              <p className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-relaxed lg:text-3xl">
                {site.vision}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The HSS Standard */}
      <section className="relative overflow-hidden bg-espresso py-24 text-cream">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-[family-name:var(--font-display)] text-[14rem] leading-none text-cream/[0.04] lg:text-[22rem]">
          HSS
        </div>
        <div className="container-lux relative max-w-3xl text-center">
          <span className="eyebrow text-brand-300">The HSS standard</span>
          <p className="mt-6 font-[family-name:var(--font-display)] text-3xl italic leading-relaxed text-cream lg:text-4xl">
            &ldquo;Exceptional hair is not simply about length or texture. It is
            about proportion, quality, craftsmanship and the details that shape
            the final experience.&rdquo;
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-brand-300">
            {site.slogan}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-primary shine bg-cream text-espresso hover:bg-brand-300">
              Shop the collection
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline border-cream/30 text-cream hover:bg-cream hover:text-espresso"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
