import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ActivityFilters } from "@/components/activity/ActivityFilters";
import { ActivityTable } from "@/components/activity/ActivityTable";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { ActivityDetailsDrawer } from "@/components/activity/ActivityDetailsDrawer";
import { useActivityStore } from "@/lib/stores/activity.store";
import { filterLogs } from "@/lib/activity.store";
import type { ActivityFilters as Filters, ActivityLog } from "@/lib/activity.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  head: () => ({
    meta: [
      { title: "Activity Logs · 360CRD" },
      { name: "description", content: "Compliance-grade audit trail across the platform." },
    ],
  }),
  component: ActivityPage,
});

const DEFAULT_FILTERS: Filters = {
  search: "",
  module: "All",
  user: "All",
  companyId: "All",
  action: "All",
  from: "",
  to: "",
};

function ActivityPage() {
  const { logs, loading, initialized, fetchLogs } = useActivityStore();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [view, setView] = useState<"table" | "timeline">("table");
  const [selected, setSelected] = useState<ActivityLog | null>(null);

  useEffect(() => {
    if (!initialized) fetchLogs();
  }, [initialized, fetchLogs]);

  const filtered = useMemo(() => filterLogs(logs, filters), [logs, filters]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1280px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Activity Logs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Centralized audit trail across every module · {filtered.length} of {logs.length} events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchLogs()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <div className="inline-flex rounded-xl border border-border/70 bg-card/40 p-1">
              <ViewBtn active={view === "table"} onClick={() => setView("table")} icon={List} label="Table" />
              <ViewBtn active={view === "timeline"} onClick={() => setView("timeline")} icon={LayoutGrid} label="Timeline" />
            </div>
          </div>
        </div>

        <ActivityFilters value={filters} onChange={setFilters} />

        {view === "table" ? (
          <ActivityTable logs={filtered} onSelect={setSelected} />
        ) : (
          <ActivityTimeline logs={filtered} onSelect={setSelected} />
        )}
      </div>

      <ActivityDetailsDrawer log={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function ViewBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

