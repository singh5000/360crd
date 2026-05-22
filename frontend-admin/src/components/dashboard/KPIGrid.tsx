import { ArrowDownRight, ArrowRight, ArrowUpRight, Building2, ClipboardCheck, Clock, ShieldAlert } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { SurfaceCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import type { KpiMetric } from "@/lib/dashboard-store";

const ICONS = {
  audits: ClipboardCheck,
  incidents: ShieldAlert,
  facilities: Building2,
  actions: Clock,
} as const;

function Sparkline({ data, tone }: { data: number[]; tone: string }) {
  const series = data.map((v, i) => ({ i, v }));
  const stroke = tone === "danger" ? "var(--destructive)" : tone === "warning" ? "var(--warning)" : "var(--primary)";
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sg-${tone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill={`url(#sg-${tone})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KPIGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => {
        const Icon = ICONS[m.id];
        const TrendIcon = m.trend === "up" ? ArrowUpRight : m.trend === "down" ? ArrowDownRight : ArrowRight;
        const goodWhenDown = m.id === "incidents";
        const positive = goodWhenDown ? m.delta < 0 : m.delta >= 0;
        const tone = m.id === "incidents" ? "danger" : m.id === "actions" ? "warning" : "primary";
        return (
          <SurfaceCard key={m.id} interactive>
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    positive ? "text-success" : "text-destructive",
                  )}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {m.delta > 0 ? "+" : ""}
                  {m.delta}%
                </span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                {m.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
            </div>
            <div className="mt-3">
              <Sparkline data={m.spark} tone={tone} />
            </div>
          </SurfaceCard>
        );
      })}
    </section>
  );
}
