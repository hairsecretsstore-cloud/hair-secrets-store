import { revenueSeries, monthLabels, topProducts } from "@/lib/admin-data";
import { BarChart } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalytics() {
  const channels = [
    { name: "Organic Search", value: 42, color: "#ad918f" },
    { name: "Instagram", value: 28, color: "#98756f" },
    { name: "Direct", value: 18, color: "#ccaeaa" },
    { name: "Referral", value: 12, color: "#e0cecb" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Analytics
        </h1>
        <p className="text-sm text-muted">Sales &amp; traffic insights</p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-background p-6">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl text-espresso">
          Monthly Revenue
        </h2>
        <BarChart data={revenueSeries} labels={monthLabels} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-background p-6">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-xl text-espresso">
            Traffic Sources
          </h2>
          <div className="space-y-4">
            {channels.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-espresso">{c.name}</span>
                  <span className="text-muted">{c.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value}%`, background: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-background p-6">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-xl text-espresso">
            Best Sellers by Revenue
          </h2>
          <ul className="space-y-4">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-2xl text-brand-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-espresso">{p.name}</p>
                  <p className="text-xs text-muted">{p.sold} units</p>
                </div>
                <span className="text-sm font-medium text-espresso">
                  {formatPrice(p.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
