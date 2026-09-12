import { cn } from "@/lib/utils";

/**
 * Product / editorial image. Renders a real photo when `src` is provided,
 * otherwise falls back to an elegant tonal gradient placeholder. Both keep the
 * slow zoom-on-hover (inside a `group`) and soft sheen.
 */
export function ProductImage({
  tone,
  src,
  alt,
  label,
  className,
  ratio = "aspect-[4/5]",
  priority,
}: {
  tone?: string;
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl bg-nude", ratio, className)}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? label ?? "Hair Secrets Store"}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          style={{ background: tone }}
        />
      )}

      {/* Soft sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      {label && !src && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center p-5">
          <span
            className="font-[family-name:var(--font-display)] text-center text-lg text-white/85 drop-shadow"
            style={{ letterSpacing: "0.02em" }}
          >
            {label}
          </span>
        </div>
      )}
      {!src && (
        <div className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.3em] text-white/60">
          Hair Secrets
        </div>
      )}
    </div>
  );
}
