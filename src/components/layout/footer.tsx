"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Camera, MessageCircle, Send, Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Hair" },
      { href: "/collections/signature-raw", label: "Signature Raw" },
      { href: "/collections/raw-brazilian", label: "Raw Brazilian" },
      { href: "/collections/cambodian-luxe", label: "Cambodian Luxe" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/track", label: "Track Order" },
      { href: "/shipping-returns", label: "Shipping & Returns" },
      { href: "/payment-plans", label: "Payment Plans" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/services", label: "Collections & Services" },
      { href: "/community", label: "Community Guidelines" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const socialLinks = [
  { Icon: Camera, href: site.socials.instagram },
  { Icon: MessageCircle, href: `https://wa.me/${site.whatsapp.replace("+", "")}` },
  { Icon: Send, href: site.socials.tiktok },
  { Icon: Mail, href: `mailto:${site.email}` },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 bg-espresso text-cream/80">
      <div className="container-lux py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="mb-4 inline-grid h-14 w-14 place-items-center rounded-xl bg-cream p-1.5">
              <Image
                src="/hss-logo.avif"
                alt="Hair Secrets Store"
                width={56}
                height={56}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <span className="block font-[family-name:var(--font-display)] text-3xl text-cream">
              Hair Secrets
            </span>
            <span className="mb-5 block text-[10px] uppercase tracking-[0.4em] text-brand-400">
              Raw Human Hair
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              Ethically sourced, 100% raw single-donor human hair for those who
              never compromise. Where every strand is curated with class.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-cream/60">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-400" />
                {site.address.line1}, {site.address.area}, {site.address.city}
              </li>
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-2.5 hover:text-cream"
                >
                  <Phone className="h-4 w-4 text-brand-400" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 hover:text-cream"
                >
                  <Mail className="h-4 w-4 text-brand-400" />
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-cream/15 transition-colors hover:border-brand-400 hover:text-brand-300"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-[family-name:var(--font-sans)] text-xs font-medium uppercase tracking-[0.25em] text-brand-300">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cream/60 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Hair Secrets Store. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span>DPO Pay · Mobile Money · Visa · Mastercard</span>
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-cream">Privacy</Link>
            <Link href="/shipping-returns" className="hover:text-cream">Shipping</Link>
            <Link href="/community" className="hover:text-cream">Community</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
