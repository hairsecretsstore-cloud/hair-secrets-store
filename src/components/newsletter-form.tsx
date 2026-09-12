"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/** Inline newsletter signup — posts to /api/newsletter and confirms in place. */
export function NewsletterForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, consent: true }),
      });
    } catch {
      /* non-blocking */
    }
  }

  if (done) {
    return (
      <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full bg-brand-50 px-5 py-3.5 text-sm text-espresso">
        <Check className="h-4 w-4 text-brand-600" />
        You&apos;re in — check your inbox for your 10% code.
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={submit}
        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-full border border-brand-200 bg-background px-5 py-3.5 text-sm outline-none focus:border-brand-500"
        />
        <button type="submit" className="btn btn-primary shine shrink-0">
          Subscribe
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </>
  );
}
