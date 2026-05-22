import { AlertTriangle, CheckCircle2, Info, Wrench } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/lib/dashboard-store";

const ICON = {
  success: CheckCircle2,
  danger: AlertTriangle,
  warning: Wrench,
  info: Info,
} as const;

export function ActivityFeed({ logs }: { logs: ActivityLog[] }) {
  return (
    <SurfaceCard className="p-2">
      <ul className="divide-y divide-border/50">
        {logs.map((a) => {
          const Icon = ICON[a.tone];
          return (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent/50 animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                  a.tone === "success" && "bg-success/10 text-success ring-success/20",
                  a.tone === "warning" && "bg-warning/10 text-warning ring-warning/20",
                  a.tone === "info" && "bg-info/10 text-info ring-info/20",
                  a.tone === "danger" && "bg-destructive/10 text-destructive ring-destructive/20",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}
