import { adminCustomers } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-espresso">
          Customers
        </h1>
        <p className="text-sm text-muted">Your growing community</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-background">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-left text-xs uppercase tracking-wider text-muted">
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Country</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 text-right font-medium">Lifetime value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {adminCustomers.map((c) => (
              <tr key={c.email} className="text-espresso">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted">{c.country}</td>
                <td className="p-4">{c.orders}</td>
                <td className="p-4 text-right font-medium">
                  {formatPrice(c.spent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
