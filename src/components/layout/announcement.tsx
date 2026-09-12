"use client";

import { usePathname } from "next/navigation";

export function Announcement() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <div className="bg-espresso text-cream">
      <div className="container-lux flex items-center justify-center gap-3 py-2 text-center text-[11px] uppercase tracking-[0.25em]">
        <span>Free delivery within 5km of Central Kampala</span>
        <span className="hidden text-brand-400 sm:inline">•</span>
        <span className="hidden sm:inline">Worldwide shipping via DHL, FedEx &amp; UPS</span>
      </div>
    </div>
  );
}
