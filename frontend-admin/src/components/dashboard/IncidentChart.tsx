import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SurfaceCard } from "@/components/shared/Card";
import type { IncidentBreakdown } from "@/lib/dashboard-store";

const COLORS: Record<IncidentBreakdown["name"], string> = {
  Open: "var(--warning)",
  "In Progress": "var(--info)",
  Resolved: "var(--success)",
  Escalated: "var(--destructive)",
};

export function IncidentChart({ data }: { data: IncidentBreakdown[] }) {
  return (
    <SurfaceCard>
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Incident Breakdown</h3>
        <p className="text-xs text-muted-foreground">Current open distribution</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeOpacity={0.3} vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "var(--accent)", opacity: 0.4 }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
