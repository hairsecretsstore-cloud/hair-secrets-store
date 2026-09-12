import { Database, Truck, CreditCard, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { site } from "@/lib/site";

const integrations = [
  {
    icon: Database,
    name: "Supabase",
    desc: "Database, Auth & Storage",
    env: "NEXT_PUBLIC_SUPABASE_URL",
    connected: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    docs: "https://supabase.com/dashboard",
  },
  {
    icon: Truck,
    name: "DHL Shipment Tracking",
    desc: "Live tracking status on the order-tracking page",
    env: "DHL_TRACKING_API_KEY",
    connected: Boolean(process.env.DHL_TRACKING_API_KEY),
    docs: "https://developer.dhl.com/api-reference/shipment-tracking-unified",
  },
  {
    icon: Truck,
    name: "DHL Express (Rates & Labels)",
    desc: "MyDHL API — live rates & shipment/label creation",
    env: "DHL_API_KEY",
    connected: Boolean(process.env.DHL_API_KEY),
    docs: "https://developer.dhl.com/api-reference/dhl-express-mydhl-api",
  },
  {
    icon: CreditCard,
    name: "DPO Pay",
    desc: "Mobile Money & card payments",
    env: "DPO_COMPANY_TOKEN",
    connected: Boolean(process.env.DPO_COMPANY_TOKEN),
    docs: "https://docs.dpopay.com",
  },
  {
    icon: Mail,
    name: "Email (Resend)",
    desc: "Order & shipping notification emails",
    env: "RESEND_API_KEY",
    connected: Boolean(process.env.RESEND_API_KEY),
    docs: "https://resend.com",
  },
];

export default function AdminSettings() {
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Settings
        </h1>
        <p className="text-sm text-muted">Integrations &amp; store configuration</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-sans)] text-sm font-medium uppercase tracking-wider text-muted">
            Integrations
          </h2>
          <span className="text-xs text-muted">
            {connectedCount} of {integrations.length} connected
          </span>
        </div>

        {integrations.map((it) => (
          <div
            key={it.name}
            className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-background p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream">
                <it.icon className="h-6 w-6 text-brand-500" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-espresso">{it.name}</p>
                  {it.connected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                      Not connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{it.desc}</p>
                <code className="mt-1 inline-block rounded bg-cream px-2 py-0.5 text-xs text-brand-700">
                  {it.env}
                </code>
              </div>
            </div>

            <a
              href={it.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full shrink-0 text-sm sm:w-auto"
            >
              {it.connected ? "Manage" : "Set up"}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}

        <p className="text-xs leading-relaxed text-muted">
          Integrations are configured with environment variables (in{" "}
          <code className="rounded bg-cream px-1 py-0.5 text-brand-700">
            .env.local
          </code>{" "}
          locally, or your host&apos;s settings in production). Add the keys, then
          redeploy — the badge turns green automatically.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-background p-6">
        <h2 className="mb-1 font-[family-name:var(--font-display)] text-xl text-espresso">
          Store Details
        </h2>
        <p className="mb-4 text-xs text-muted">
          Read-only — sourced from your brand config (src/lib/site.ts).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" value={site.name} />
          <Field label="Support email" value={site.email} />
          <Field label="Phone" value={site.phone} />
          <Field label="Currency" value="USD ($)" />
          <Field label="Free shipping threshold" value="$300" />
          <Field
            label="Location"
            value={`${site.address.area}, ${site.address.city}`}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-espresso">{label}</label>
      <input
        defaultValue={value}
        readOnly
        className="w-full cursor-default rounded-xl border border-brand-200 bg-cream px-4 py-3 text-sm text-espresso/70 outline-none"
      />
    </div>
  );
}
