import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SurfaceCard } from "@/components/shared/Card";
import type { AuditTrendPoint } from "@/lib/dashboard-store";

export function AuditTrendChart({ data }: { data: AuditTrendPoint[] }) {
  return (
    <SurfaceCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Audit Trend</h3>
          <p className="text-xs text-muted-foreground">Completed vs scheduled · last 12 days</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-scheduled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--info)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeOpacity={0.3} vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} fill="url(#grad-completed)" />
            <Area type="monotone" dataKey="scheduled" stroke="var(--info)" strokeWidth={2} fill="url(#grad-scheduled)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
