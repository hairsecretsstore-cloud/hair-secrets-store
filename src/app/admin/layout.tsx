"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  Boxes,
  FileText,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/team", label: "Team & Admins", icon: ShieldCheck },
  { href: "/admin/discounts", label: "Discounts", icon: Tag },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // When Supabase is configured, middleware already enforces admin access,
  // so we render straight through. In demo mode we show a local passcode gate.
  const [authed, setAuthed] = useState(hasSupabase);
  const [open, setOpen] = useState(false);

  async function signOut() {
    if (hasSupabase) {
      await createClient().auth.signOut();
      window.location.href = "/account";
    } else {
      setAuthed(false);
    }
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-espresso px-5">
        <div className="w-full max-w-sm rounded-2xl bg-background p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cream p-2">
              <Image
                src="/hss-logo.avif"
                alt="Hair Secrets Store"
                width={64}
                height={64}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-espresso">
              Admin Access
            </h1>
            <p className="mt-1 text-sm text-muted">
              Hair Secrets Store control panel
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Wire to Supabase auth + role check (row in `admins` table).
              setAuthed(true);
            }}
            className="space-y-4"
          >
            <input
              type="email"
              required
              placeholder="Admin email"
              className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="btn btn-primary w-full">
              Secure sign in
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-muted">
            Protected area · 2FA recommended
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f4]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-espresso text-cream/80 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-cream p-1">
              <Image
                src="/hss-logo.avif"
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl text-cream">
              Hair Secrets
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-brand-500 text-white"
                    : "hover:bg-espresso-soft hover:text-cream",
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2.5 text-sm text-cream/60 hover:bg-espresso-soft"
          >
            ← Back to store
          </Link>
          <button
            onClick={signOut}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-cream/60 hover:bg-espresso-soft"
          >
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-espresso/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-brand-100 bg-background px-5 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6 text-espresso" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-espresso/70">Admin</span>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-medium text-white">
              HS
            </div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
