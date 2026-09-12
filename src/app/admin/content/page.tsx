import { Image, Type, Megaphone, FileText } from "lucide-react";

const blocks = [
  {
    icon: Megaphone,
    title: "Announcement Bar",
    desc: "Top-of-site promotional message",
    value: "Free delivery within 5km of Central Kampala",
  },
  {
    icon: Type,
    title: "Homepage Hero",
    desc: "Headline and subtext",
    value: "Raw hair, real luxury.",
  },
  {
    icon: Image,
    title: "Collection Banners",
    desc: "4 collection cover images",
    value: "4 banners configured",
  },
  {
    icon: FileText,
    title: "About / Story Page",
    desc: "Brand narrative & care guide",
    value: "Published",
  },
];

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Content
        </h1>
        <p className="text-sm text-muted">Manage storefront copy and imagery</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-brand-100 bg-background p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream">
                  <b.icon className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-espresso">{b.title}</p>
                  <p className="text-xs text-muted">{b.desc}</p>
                </div>
              </div>
              <button className="text-sm text-brand-600 underline underline-offset-4">
                Edit
              </button>
            </div>
            <p className="mt-4 rounded-lg bg-cream px-3 py-2 text-sm text-espresso/80">
              {b.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
