"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Check } from "lucide-react";

const STORAGE_KEY = "hss-newsletter-seen";

export function NewsletterModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Never on admin, and only once per visitor.
    if (pathname?.startsWith("/admin")) return;
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = setTimeout(() => setOpen(true), 7000);

    // Exit-intent: pointer leaves toward the top of the window.
    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0) setOpen(true);
    }
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname]);

  function persistSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — show at most once this session */
    }
  }

  function close() {
    setOpen(false);
    persistSeen();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setError("Please agree to receive emails to continue.");
      return;
    }
    setError("");
    setDone(true);
    persistSeen();
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup", consent }),
      });
    } catch {
      /* non-blocking: we've already thanked them */
    }
    setTimeout(() => setOpen(false), 2600);
  }

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[9997] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the Hair Secrets inner circle"
    >
      <div
        className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
        onClick={close}
      />
      <div className="animate-fade-up relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-background shadow-[var(--shadow-soft)] sm:grid-cols-2">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-espresso backdrop-blur transition hover:bg-cream"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Editorial image (hidden on small screens) */}
        <div className="relative hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/editorial-model.webp"
            alt="Hair Secrets Store"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-espresso">
                Welcome, beautiful
              </h2>
              <p className="mt-3 text-sm text-espresso/70">
                Your 10% code is on its way to your inbox. Check your email to
                unlock your first order.
              </p>
            </div>
          ) : (
            <>
              <span className="eyebrow">Join the inner circle</span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-espresso lg:text-4xl">
                Be the first to discover
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-espresso/70">
                Unlock <span className="font-medium text-espresso">10% off</span>{" "}
                your first order, plus early access to restocks, new textures and
                private sales.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-brand-200 bg-background px-5 py-3.5 text-sm outline-none focus:border-brand-500"
                />
                <label className="flex items-start gap-2.5 text-left text-xs text-espresso/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-600)]"
                  />
                  <span>
                    I agree to receive marketing emails from Hair Secrets Store.
                    Unsubscribe anytime.
                  </span>
                </label>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" className="btn btn-primary shine w-full">
                  Unlock my 10% off
                </button>
              </form>
              <button
                onClick={close}
                className="mt-4 w-full text-center text-xs uppercase tracking-[0.15em] text-muted transition hover:text-espresso"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
