import { cn } from "@/lib/utils";

const defaults = [
  "100% Raw Human Hair",
  "Single Donor",
  "Full Cuticle",
  "Ethically Sourced",
  "Worldwide Shipping",
  "Reusable for Years",
  "Curated with Class",
];

export function Marquee({
  items = defaults,
  className,
  dark = true,
}: {
  items?: string[];
  className?: string;
  dark?: boolean;
}) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "overflow-hidden border-y py-5",
        dark
          ? "border-brand-800/40 bg-espresso text-cream"
          : "border-brand-100 bg-background text-espresso",
        className,
      )}
    >
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-[family-name:var(--font-display)] text-2xl italic">
              {item}
            </span>
            <span className="text-brand-400">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
