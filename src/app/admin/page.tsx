import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import {
  adminStats,
  revenueSeries,
  monthLabels,
  topProducts,
  adminOrders,
} from "@/lib/admin-data";
import { StatCard, BarChart, StatusPill } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Dashboard
        </h1>
        <p className="text-sm text-muted">
          Overview of your store&apos;s performance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatPrice(adminStats.revenue)}
          change={adminStats.revenueChange}
          icon={DollarSign}
        />
        <StatCard
          label="Orders"
          value={adminStats.orders.toString()}
          change={adminStats.ordersChange}
          icon={ShoppingCart}
        />
        <StatCard
          label="Customers"
          value={adminStats.customers.toLocaleString()}
          change={adminStats.customersChange}
          icon={Users}
        />
        <StatCard
          label="Conversion"
          value={`${adminStats.conversion}%`}
          change={adminStats.conversionChange}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-brand-100 bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-espresso">
              Revenue (12 months)
            </h2>
            <span className="text-sm text-green-600">
              +{adminStats.revenueChange}%
            </span>
          </div>
          <BarChart data={revenueSeries} labels={monthLabels} />
        </div>

        <div className="rounded-2xl border border-brand-100 bg-background p-6">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-xl text-espresso">
            Top Products
          </h2>
          <ul className="space-y-4">
            {topProducts.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/photos/p-${p.slug}.webp`}
                  alt={p.name}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  style={{ background: p.tone }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-espresso">{p.name}</p>
                  <p className="text-xs text-muted">{p.sold} sold</p>
                </div>
                <span className="text-sm font-medium text-espresso">
                  {formatPrice(p.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-background p-6">
        <h2 className="mb-5 font-[family-name:var(--font-display)] text-xl text-espresso">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {adminOrders.map((o) => (
                <tr key={o.ref} className="text-espresso">
                  <td className="py-3 font-medium">{o.ref}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3 text-muted">{o.date}</td>
                  <td className="py-3 text-muted">{o.payment}</td>
                  <td className="py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatPrice(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
