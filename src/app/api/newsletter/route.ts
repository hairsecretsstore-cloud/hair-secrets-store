import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, welcomeEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WELCOME_CODE = "WELCOME10";

/** Capture a newsletter signup and send the 10% welcome email. */
export async function POST(request: Request) {
  const { email, source = "site", consent = true } = (await request.json()) ?? {};

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const clean = email.trim().toLowerCase();

  // Persist (idempotent) when Supabase is configured. Never block on it.
  let isNew = true;
  if (hasSupabase) {
    try {
      const supabase = createServiceClient();
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: clean, source, consent });
      // Unique-violation means they're already subscribed — don't re-send.
      if (error?.code === "23505") isNew = false;
      else if (error) console.error("Subscriber insert failed:", error.message);
    } catch (err) {
      console.error("Subscriber persist error:", err);
    }
  }

  // Send the welcome gift once per new subscriber (best-effort).
  if (isNew) {
    const { subject, html } = welcomeEmail({ email: clean, code: WELCOME_CODE });
    await sendEmail({ to: clean, subject, html });
  }

  return NextResponse.json({ ok: true, code: WELCOME_CODE });
}
