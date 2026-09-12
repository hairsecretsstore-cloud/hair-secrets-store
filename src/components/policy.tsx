import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { PolicyToc } from "@/components/experience/policy-toc";
import { slugify } from "@/lib/utils";

export function PolicyShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-brand-200/40 blur-[90px]" />
        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-[family-name:var(--font-display)] text-[10rem] leading-none text-brand-300/15 lg:text-[16rem]">
          HSS
        </div>
        <div className="container-lux relative py-16 text-center lg:py-20">
          <nav className="mb-5 flex items-center justify-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="text-brand-600">{title}</span>
          </nav>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-3 text-4xl text-espresso lg:text-6xl">{title}</h1>
          {intro && (
            <p className="mx-auto mt-5 max-w-2xl text-espresso/70">{intro}</p>
          )}
        </div>
      </section>

      {/* Body with sticky TOC */}
      <section className="container-lux py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <PolicyToc />
          <div className="policy-body max-w-3xl space-y-12">{children}</div>
        </div>
      </section>
    </>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const id = slugify(title);
  return (
    <Reveal>
      <section
        id={id}
        data-policy-section
        data-policy-title={title}
        className="scroll-mt-28 border-t border-brand-100 pt-8 first:border-t-0 first:pt-0"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-brand-400" />
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-espresso lg:text-[26px]">
            {title}
          </h2>
        </div>
        <div className="space-y-3 leading-relaxed text-espresso/75">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-400" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function PolicyTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 shadow-[var(--shadow-card)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-espresso text-left text-cream">
            <th className="px-4 py-3 font-medium tracking-wide">{head[0]}</th>
            <th className="px-4 py-3 font-medium tracking-wide">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-100">
          {rows.map(([a, b], i) => (
            <tr
              key={i}
              className="text-espresso/80 transition-colors odd:bg-cream/40 hover:bg-brand-50"
            >
              <td className="px-4 py-3 font-medium text-espresso">{a}</td>
              <td className="px-4 py-3">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
