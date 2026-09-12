import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { communityValues, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "The values that shape the Hair Secrets Store community — respectful, kind, honest, professional, curious, and private.",
};

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-700/30 blur-[100px]" />
        <div className="container-lux relative py-20 text-center lg:py-28">
          <span className="eyebrow text-brand-300">
            For the empowered queens who grace our space
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl leading-[1.05] text-cream lg:text-7xl">
            The Hair Secrets <span className="italic text-brand-300">community</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-cream/70">
            We are more than a brand — we are a community rooted in luxury, trust,
            and inclusivity. These guidelines uphold the standard of grace and
            excellence our community deserves.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-lux py-20">
        <div className="mb-14 text-center">
          <span className="eyebrow">The values we hold sacred</span>
          <h2 className="mt-3 text-4xl text-espresso lg:text-5xl">Six Signatures</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {communityValues.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 80}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-brand-100 bg-background p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[var(--shadow-soft)]">
                {/* watermark letter */}
                <span className="pointer-events-none absolute -right-2 -top-6 select-none font-[family-name:var(--font-display)] text-[9rem] leading-none text-brand-100/70 transition-colors duration-500 group-hover:text-brand-200/70">
                  {v.letter}
                </span>
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-brand-500 font-[family-name:var(--font-display)] text-xl text-white">
                  {v.letter}
                </span>
                <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl text-espresso">
                  {v.title}
                </h3>
                <p className="relative mt-2 leading-relaxed text-espresso/70">
                  {v.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing note */}
      <section className="container-lux pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-cream px-6 py-16 text-center">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-nude/60 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow">A note from us</span>
              <p className="mt-5 font-[family-name:var(--font-display)] text-2xl italic leading-relaxed text-espresso lg:text-3xl">
                Posts that violate these guidelines may be removed without notice.
                Thank you for keeping our space graceful.
              </p>
              <p className="mt-8 text-sm uppercase tracking-[0.3em] text-brand-600">
                With love — Hair Secrets Store Management
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-espresso/70">
                {site.slogan}
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/shop" className="btn btn-primary shine">
                  Shop the collection
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
