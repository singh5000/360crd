import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  LogIn,
  LogOut,
  PencilLine,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import type { ActivityAction, ActivityLog } from "@/lib/activity.types";
import { actionTone } from "@/lib/activity.types";
import { StatusBadge } from "@/components/shared/StatusBadge";

const iconMap: Record<ActivityAction, React.ComponentType<{ className?: string }>> = {
  created: Plus,
  updated: PencilLine,
  deleted: Trash2,
  status_changed: ArrowUpRight,
  escalated: AlertTriangle,
  enabled: ToggleRight,
  disabled: ToggleLeft,
  login: LogIn,
  logout: LogOut,
};

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  if (isToday) return "Today";
  if (isYest) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

type Props = {
  logs: ActivityLog[];
  onSelect: (log: ActivityLog) => void;
};

export function ActivityTimeline({ logs, onSelect }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, ActivityLog[]>();
    logs.forEach((l) => {
      const key = dayLabel(l.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(l);
    });
    return Array.from(map.entries());
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
        <Activity className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">No events to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([day, items]) => (
        <section key={day} className="space-y-3">
          <h3 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{day}</h3>
          <ol className="relative space-y-3 border-l border-border/60 pl-6">
            {items.map((l) => {
              const Icon = iconMap[l.action] ?? Activity;
              return (
                <li key={l.id} className="relative">
                  <span className="absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelect(l)}
                    className="group flex w-full flex-col gap-1.5 rounded-xl border border-border/60 bg-card/60 p-3.5 text-left transition-all hover:border-border hover:bg-accent/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={actionTone[l.action]}>{l.action.replace("_", " ")}</StatusBadge>
                        <span className="text-xs text-muted-foreground">{l.module}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{relative(l.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{l.summary}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> {l.user}
                      {l.companyName && <span>· {l.companyName}</span>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
