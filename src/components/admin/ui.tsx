import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}) {
  const up = change >= 0;
  return (
    <div className="rounded-2xl border border-brand-100 bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-cream">
          <Icon className="h-4 w-4 text-brand-500" />
        </div>
      </div>
      <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-espresso">
        {value}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs",
          up ? "text-green-600" : "text-red-500",
        )}
      >
        {up ? (
          <ArrowUpRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" />
        )}
        {Math.abs(change)}% vs last month
      </p>
    </div>
  );
}

export function BarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data);
  return (
    <div className="flex h-56 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-brand-400 transition-all duration-500 group-hover:bg-brand-600"
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    pending: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs capitalize",
        map[status] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {status}
    </span>
  );
}
