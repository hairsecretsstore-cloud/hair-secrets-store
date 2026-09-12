"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Preloader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // Only show once per browser session.
    try {
      if (sessionStorage.getItem("hs-intro")) {
        setSkip(true);
        return;
      }
      sessionStorage.setItem("hs-intro", "1");
    } catch {
      /* ignore */
    }
    const t1 = setTimeout(() => setDone(true), 1500);
    const t2 = setTimeout(() => setHidden(true), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (skip || hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9997] flex items-center justify-center bg-cream transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: done ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="flex flex-col items-center animate-fade-in">
        <Image
          src="/hss-logo.avif"
          alt="Hair Secrets Store"
          width={96}
          height={96}
          priority
          className="h-24 w-24 object-contain mix-blend-multiply"
        />
        <span className="mt-4 overflow-hidden">
          <span className="block font-[family-name:var(--font-display)] text-3xl tracking-tight text-espresso animate-fade-up">
            Hair Secrets
          </span>
        </span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.5em] text-brand-600">
          Raw Human Hair
        </span>
        {/* progress line */}
        <span className="mt-6 block h-px w-40 overflow-hidden bg-brand-200">
          <span
            className="block h-full bg-brand-500 transition-all duration-[1400ms] ease-out"
            style={{ width: done ? "100%" : "8%" }}
          />
        </span>
      </div>
    </div>
  );
}
