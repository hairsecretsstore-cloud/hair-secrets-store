"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ShieldCheck, User } from "lucide-react";
import { hasSupabase } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  joined: string;
};

export default function AdminTeam() {
  const [members, setMembers] = useState<Member[]>([]);
  const [self, setSelf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setMembers(data.members);
      setSelf(data.self);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasSupabase) load();
    else setLoading(false);
  }, []);

  async function toggle(m: Member) {
    setBusy(m.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: m.id, isAdmin: !m.isAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setMembers((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, isAdmin: !x.isAdmin } : x)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  const rows = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()),
  );
  const adminCount = members.filter((m) => m.isAdmin).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Team &amp; Admins
        </h1>
        <p className="text-sm text-muted">
          Promote customers to admins, or revoke access. {adminCount} admin
          {adminCount !== 1 && "s"} · {members.length} total accounts
        </p>
      </div>

      {!hasSupabase ? (
        <div className="rounded-2xl border border-brand-100 bg-cream p-6 text-sm text-espresso/70">
          Connect Supabase to manage real accounts. In demo mode there are no
          stored users.
        </div>
      ) : (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-full border border-brand-200 bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-background">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-muted">
                    <th className="p-4 font-medium">Member</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {rows.map((m) => (
                    <tr key={m.id} className="text-espresso">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                            {m.name !== "—"
                              ? m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                              : "?"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {m.name}
                              {m.id === self && (
                                <span className="ml-2 text-xs text-brand-600">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
                            m.isAdmin
                              ? "bg-brand-100 text-brand-700"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {m.isAdmin ? (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                          {m.isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggle(m)}
                          disabled={busy === m.id || (m.id === self && m.isAdmin)}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
                            m.isAdmin
                              ? "border border-brand-200 text-espresso hover:bg-cream"
                              : "bg-espresso text-cream hover:bg-brand-600",
                          )}
                        >
                          {busy === m.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : m.isAdmin ? (
                            "Revoke admin"
                          ) : (
                            "Make admin"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted">
                        No accounts match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-muted">
            Note: a new person must sign up at{" "}
            <span className="text-brand-600">/account</span> first — they&apos;ll
            appear here as a Customer, ready to promote.
          </p>
        </>
      )}
    </div>
  );
}
