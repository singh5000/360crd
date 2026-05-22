import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Globe, Laptop, Building2, Clock, User as UserIcon } from "lucide-react";
import type { ActivityLog } from "@/lib/activity.types";
import { actionTone } from "@/lib/activity.types";
import { StatusBadge } from "@/components/shared/StatusBadge";

type Props = {
  log: ActivityLog | null;
  onClose: () => void;
};

export function ActivityDetailsDrawer({ log, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && log) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [log, onClose]);

  return (
    <Sheet open={!!log} onOpenChange={(o) => (!o ? onClose() : null)}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        {log && (
          <div className="flex h-full flex-col">
            <SheetHeader className="space-y-3 border-b border-border/60 p-6">
              <div className="flex items-center gap-2">
                <StatusBadge tone={actionTone[log.action]}>{log.action.replace("_", " ")}</StatusBadge>
                <span className="text-xs text-muted-foreground">{log.module}</span>
              </div>
              <SheetTitle className="text-left text-lg font-semibold tracking-tight">{log.summary}</SheetTitle>
              <p className="text-xs font-mono text-muted-foreground">Event ID · {log.id}</p>
            </SheetHeader>

            <div className="space-y-6 p-6">
              <section className="grid grid-cols-2 gap-3">
                <Meta icon={UserIcon} label="User" value={`${log.user}${log.userEmail ? ` · ${log.userEmail}` : ""}`} />
                <Meta icon={Building2} label="Company" value={log.companyName ?? "—"} />
                <Meta icon={Clock} label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
                <Meta icon={Globe} label="IP address" value={log.metadata?.ip ?? "—"} />
                <Meta icon={Laptop} label="Device" value={log.metadata?.device ?? "—"} />
                <Meta icon={UserIcon} label="Target" value={log.targetLabel} />
              </section>

              <Diff before={log.before} after={log.after} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 truncate text-sm text-foreground/90">{value}</p>
    </div>
  );
}

function Diff({ before, after }: { before?: Record<string, unknown> | null; after?: Record<string, unknown> | null }) {
  if (!before && !after) return null;
  return (
    <section className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State change</h4>
      <div className="grid gap-3 md:grid-cols-2">
        <DiffPanel title="Before" data={before} tone="danger" />
        <DiffPanel title="After" data={after} tone="success" />
      </div>
    </section>
  );
}

function DiffPanel({ title, data, tone }: { title: string; data?: Record<string, unknown> | null; tone: "danger" | "success" }) {
  const ring =
    tone === "danger"
      ? "border-destructive/40 bg-destructive/5"
      : "border-emerald-500/40 bg-emerald-500/5";
  return (
    <div className={`rounded-xl border ${ring} p-3`}>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      {data && Object.keys(data).length > 0 ? (
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-foreground/90">
{JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-xs italic text-muted-foreground">— empty —</p>
      )}
    </div>
  );
}
