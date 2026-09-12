"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, LogOut, User, Loader2 } from "lucide-react";
import { useWishlist } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const demoOrders = [
  { ref: "HS-2607-KX92A", date: "12 Jul 2026", status: "Delivered", total: 850000, items: 2 },
  { ref: "HS-2608-PL10B", date: "02 Aug 2026", status: "In transit", total: 430000, items: 1 },
];

type Tab = "orders" | "wishlist" | "addresses" | "profile";
type Order = { ref: string; date: string; status: string; total: number; items: number };

export default function AccountPage() {
  const supabase = useMemo(() => (hasSupabase ? createClient() : null), []);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(hasSupabase);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [tab, setTab] = useState<Tab>("orders");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [orders, setOrders] = useState<Order[]>(hasSupabase ? [] : demoOrders);
  const wishlist = useWishlist((s) => s.items);

  // Load the signed-in user's profile (full name) into the form.
  async function loadProfile(uid: string) {
    if (!supabase) return;
    setUserId(uid);
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", uid)
      .single();
    if (data?.full_name) setName(data.full_name);
  }

  // Restore an existing session on load.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthed(true);
        setUserEmail(data.user.email ?? "");
        loadProfile(data.user.id);
      }
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // Load real orders once signed in.
  useEffect(() => {
    if (!supabase || !authed) return;
    supabase
      .from("orders")
      .select("reference, created_at, status, total, items")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        // Always reflect the real result (empty = no orders yet).
        setOrders(
          (data ?? []).map((o) => ({
            ref: o.reference,
            date: new Date(o.created_at).toLocaleDateString(),
            status: o.status,
            items: Array.isArray(o.items) ? o.items.length : 0,
            total: o.total,
          })),
        );
      });
  }, [supabase, authed]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Demo mode: no backend — just enter the dashboard.
    if (!supabase) {
      setAuthed(true);
      setUserEmail(email || "guest@hairsecretsstore.co");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setError("Check your email to confirm your account, then sign in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setAuthed(true);
        setUserEmail(email);
        if (data.user) loadProfile(data.user.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !userId) return;
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await supabase.from("profiles").update({ full_name: name }).eq("id", userId);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setSavingProfile(false);
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setAuthed(false);
    setUserEmail("");
    setUserId("");
    setName("");
  }

  if (checking) {
    return (
      <div className="container-lux grid place-items-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="container-lux grid place-items-center py-20">
        <div className="w-full max-w-md rounded-2xl border border-brand-100 p-8">
          <div className="mb-6 text-center">
            <span className="eyebrow">Members only</span>
            <h1 className="mt-2 text-3xl text-espresso">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            {!hasSupabase && (
              <p className="mt-2 text-xs text-muted">
                Demo mode — connect Supabase to enable real accounts.
              </p>
            )}
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                type="text"
                value={name}
                onChange={setName}
              />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-espresso/70">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="text-brand-600 underline underline-offset-4"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <section className="container-lux py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-espresso lg:text-5xl">My Account</h1>
          <p className="mt-1 text-espresso/60">
            {userEmail ? `Signed in as ${userEmail}` : "Welcome back, gorgeous."}
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-brand-600 hover:text-espresso"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-3 text-sm transition lg:rounded-xl",
                tab === t.id
                  ? "bg-espresso text-cream"
                  : "text-espresso hover:bg-cream",
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 && (
                <p className="text-espresso/60">No orders yet.</p>
              )}
              {orders.map((o) => (
                <div
                  key={o.ref}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-100 p-5"
                >
                  <div>
                    <p className="font-medium text-espresso">{o.ref}</p>
                    <p className="text-sm text-muted">
                      {o.date} · {o.items} item{o.items !== 1 && "s"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs capitalize",
                      /deliver/i.test(o.status)
                        ? "bg-green-100 text-green-800"
                        : "bg-brand-100 text-brand-700",
                    )}
                  >
                    {o.status}
                  </span>
                  <span className="font-medium text-espresso">
                    {formatPrice(o.total)}
                  </span>
                  <Link
                    href={`/track?ref=${o.ref}`}
                    className="text-sm text-brand-600 underline underline-offset-4"
                  >
                    Track
                  </Link>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              {wishlist.length === 0 ? (
                <p className="text-espresso/60">
                  Your wishlist is empty.{" "}
                  <Link href="/shop" className="text-brand-600 underline">
                    Browse hair
                  </Link>
                </p>
              ) : (
                <ul className="space-y-3">
                  {wishlist.map((w) => (
                    <li
                      key={w.productId}
                      className="flex items-center justify-between rounded-xl border border-brand-100 p-4"
                    >
                      <span className="text-espresso">{w.name}</span>
                      <Link
                        href={`/product/${w.slug}`}
                        className="text-sm text-brand-600 underline"
                      >
                        View
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="rounded-2xl border border-brand-100 p-6">
              <p className="text-espresso/70">No saved addresses yet.</p>
              <button className="btn btn-outline mt-4">Add address</button>
            </div>
          )}

          {tab === "profile" && (
            <form className="max-w-md space-y-4" onSubmit={saveProfile}>
              <Field label="Full name" type="text" value={name} onChange={setName} />
              <div>
                <label className="mb-1.5 block text-sm text-espresso">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-brand-200 bg-cream px-4 py-3 text-sm text-espresso/60 outline-none"
                />
                <p className="mt-1 text-xs text-muted">
                  Email is managed by your login and can&apos;t be changed here.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary disabled:opacity-70"
                >
                  {savingProfile ? "Saving…" : "Save changes"}
                </button>
                {profileSaved && (
                  <span className="text-sm text-green-600">✓ Saved</span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-espresso">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
