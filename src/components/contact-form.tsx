"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { hasSupabase } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (hasSupabase) {
      try {
        await createClient()
          .from("messages")
          .insert({
            name: `${fd.get("firstName") ?? ""} ${fd.get("lastName") ?? ""}`.trim(),
            email: fd.get("email"),
            subject: fd.get("subject"),
            body: fd.get("message"),
          });
      } catch {
        // Non-blocking: still confirm to the customer.
      }
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid place-items-center rounded-2xl bg-cream p-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-espresso">
          Message received
        </h3>
        <p className="mt-2 max-w-sm text-espresso/70">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" />
        <Field label="Last name" name="lastName" />
      </div>
      <Field label="Email" name="email" type="email" />
      <Field label="Subject" name="subject" />
      <div>
        <label className="mb-1.5 block text-sm text-espresso">Message</label>
        <textarea
          required
          name="message"
          rows={5}
          className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        Send message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-espresso">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="w-full rounded-xl border border-brand-200 bg-background px-4 py-3 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
