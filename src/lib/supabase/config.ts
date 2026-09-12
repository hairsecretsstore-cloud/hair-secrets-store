/**
 * Whether Supabase is configured via environment variables.
 * When false, the app runs on built-in demo data so it always works —
 * locally and on the very first Vercel deploy before keys are added.
 */
export const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
