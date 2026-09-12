"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.items.length);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the storefront header inside the admin area
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 shadow-[0_1px_0_rgba(90,70,68,0.08)] backdrop-blur-md"
          : "bg-background",
      )}
    >
      <div className="container-lux flex h-16 items-center justify-between gap-4 lg:h-20">
        <button
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6 text-espresso" />
        </button>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {nav.slice(0, 4).map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5"
        >
          <Image
            src="/hss-logo.avif"
            alt="Hair Secrets Store monogram"
            width={48}
            height={48}
            priority
            className="h-10 w-10 object-contain mix-blend-multiply lg:h-12 lg:w-12"
          />
          <span className="text-left">
            <span className="block font-[family-name:var(--font-display)] text-xl leading-none tracking-tight text-espresso lg:text-2xl">
              Hair Secrets
            </span>
            <span className="block text-[9px] uppercase tracking-[0.35em] text-brand-600">
              Raw Human Hair
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-5">
          <Link href="/shop" aria-label="Search" className="hidden sm:block">
            <Search className="h-5 w-5 text-espresso transition-colors hover:text-brand-600" />
          </Link>
          <Link href="/account" aria-label="Account" className="hidden sm:block">
            <User className="h-5 w-5 text-espresso transition-colors hover:text-brand-600" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative">
            <Heart className="h-5 w-5 text-espresso transition-colors hover:text-brand-600" />
            {mounted && wishCount > 0 && <Badge count={wishCount} />}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-espresso transition-colors hover:text-brand-600" />
            {mounted && cartCount > 0 && <Badge count={cartCount} />}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-espresso/40 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[82%] max-w-sm bg-background p-6 shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-display)] text-xl text-espresso">
              Menu
            </span>
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-espresso" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-brand-100 py-4 font-[family-name:var(--font-display)] text-2xl text-espresso"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="py-4 font-[family-name:var(--font-display)] text-2xl text-espresso"
            >
              My Account
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm uppercase tracking-[0.15em] transition-colors",
        active ? "text-brand-600" : "text-espresso hover:text-brand-600",
      )}
    >
      {label}
    </Link>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-medium text-white">
      {count}
    </span>
  );
}
