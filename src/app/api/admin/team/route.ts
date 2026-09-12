import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Admin team management. Both handlers require the caller to be a signed-in
 * admin (verified from the session cookie), then use the service client for
 * the privileged read/write. Never trusts the client for authorization.
 */

async function requireAdmin() {
  if (!hasSupabase) return { error: "Supabase not configured", status: 503 };
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) return { error: "Not signed in", status: 401 };
  const { data: me } = await ssr
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) return { error: "Admins only", status: 403 };
  return { user };
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const service = createServiceClient();
  const [{ data: profiles }, { data: authData }] = await Promise.all([
    service.from("profiles").select("id, full_name, is_admin, created_at"),
    service.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailById = new Map(
    (authData?.users ?? []).map((u: { id: string; email?: string }) => [
      u.id,
      u.email ?? "",
    ]),
  );

  const members = (profiles ?? [])
    .map((p: { id: string; full_name: string | null; is_admin: boolean; created_at: string }) => ({
      id: p.id,
      name: p.full_name ?? "—",
      email: emailById.get(p.id) ?? "",
      isAdmin: p.is_admin,
      joined: p.created_at,
    }))
    .sort(
      (a: { isAdmin: boolean }, b: { isAdmin: boolean }) =>
        Number(b.isAdmin) - Number(a.isAdmin),
    );

  return NextResponse.json({ members, self: gate.user.id });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const { userId, isAdmin } = await request.json();
  if (!userId || typeof isAdmin !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Prevent locking yourself out.
  if (userId === gate.user.id && isAdmin === false) {
    return NextResponse.json(
      { error: "You can't remove your own admin access." },
      { status: 400 },
    );
  }

  const service = createServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ is_admin: isAdmin })
    .eq("id", userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
