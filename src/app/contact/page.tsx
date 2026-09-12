import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Hair Secrets Store for orders, wholesale enquiries, and hair-care advice.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="container-lux py-14 text-center">
          <span className="eyebrow">We&apos;re here to help</span>
          <h1 className="mt-3 text-5xl text-espresso lg:text-6xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-espresso/70">
            Questions about a bundle, an order, or wholesale? Our team responds
            within 24 hours.
          </p>
        </div>
      </section>

      <section className="container-lux grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {[
            { icon: Mail, title: "Email", value: site.email },
            { icon: MessageCircle, title: "Call / WhatsApp", value: site.phone },
            {
              icon: MapPin,
              title: "Studio",
              value: `${site.address.line1}, ${site.address.area}, ${site.address.city} · Worldwide shipping`,
            },
            { icon: Clock, title: "Hours", value: "Mon–Sat, 9am–6pm EAT" },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream">
                <c.icon className="h-5 w-5 text-brand-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-brand-600">
                  {c.title}
                </p>
                <p className="text-espresso">{c.value}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-espresso p-7 text-cream">
            <h3 className="font-[family-name:var(--font-display)] text-2xl">
              Wholesale &amp; salons
            </h3>
            <p className="mt-2 text-sm text-cream/70">
              Special pricing for stylists and boutiques. Tell us about your
              business and we&apos;ll set you up.
            </p>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
