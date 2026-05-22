import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SurfaceCard } from "@/components/shared/Card";
import type { FacilityStatusSlice } from "@/lib/dashboard-store";

const COLORS: Record<FacilityStatusSlice["name"], string> = {
  Active: "var(--success)",
  Maintenance: "var(--warning)",
};

export function FacilityStatusChart({ data }: { data: FacilityStatusSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <SurfaceCard>
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Facility Status</h3>
        <p className="text-xs text-muted-foreground">{total} facilities tracked</p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-48 w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} stroke="none">
                {data.map((d) => (
                  <Cell key={d.name} fill={COLORS[d.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex w-full flex-1 flex-col gap-2">
          {data.map((d) => {
            const pct = total ? Math.round((d.value / total) * 100) : 0;
            return (
              <li key={d.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[d.name] }} />
                  {d.name}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {d.value} · {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </SurfaceCard>
  );
}
