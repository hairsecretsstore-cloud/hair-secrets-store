import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-lux grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-[family-name:var(--font-display)] text-7xl text-brand-400">
          404
        </p>
        <h1 className="mt-4 text-4xl text-espresso">Page not found</h1>
        <p className="mt-3 text-espresso/60">
          The page you&apos;re looking for has moved or never existed.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  );
}
