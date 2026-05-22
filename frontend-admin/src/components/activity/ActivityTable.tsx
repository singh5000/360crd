import { Eye } from "lucide-react";
import type { ActivityLog } from "@/lib/activity.types";
import { actionTone } from "@/lib/activity.types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

type Props = {
  logs: ActivityLog[];
  onSelect: (log: ActivityLog) => void;
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityTable({ logs, onSelect }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
        <p className="text-sm font-medium">No activity matches your filters</p>
        <p className="text-xs text-muted-foreground">Adjust the filters above to see more events.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 [background:var(--gradient-card)]">
      <div className="max-h-[640px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur">
            <tr className="border-b border-border/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr
                key={l.id}
                className="border-b border-border/40 transition-colors last:border-0 hover:bg-accent/40"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.id.slice(-8)}</td>
                <td className="px-4 py-3 font-medium text-foreground/90">{l.user}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.module}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={actionTone[l.action]}>{l.action.replace("_", " ")}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-foreground/90">{l.targetLabel}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.companyName ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(l.timestamp)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(l)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium",
                      "text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
