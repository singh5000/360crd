import { Search, X } from "lucide-react";
import type {
  IncidentFilters as TFilters,
  IncidentPriority,
  IncidentStatus,
} from "@/lib/incident-store";
import { cn } from "@/lib/utils";

const STATUSES: ("All" | IncidentStatus)[] = ["All", "Open", "In Progress", "Resolved", "Escalated"];
const PRIORITIES: ("All" | IncidentPriority)[] = ["All", "Low", "Medium", "High", "Critical"];

export function IncidentFilters({
  value,
  onChange,
}: {
  value: TFilters;
  onChange: (next: TFilters) => void;
}) {
  const set = <K extends keyof TFilters>(k: K, v: TFilters[K]) => onChange({ ...value, [k]: v });
  const hasFilters =
    value.search || value.status !== "All" || value.priority !== "All" || value.from || value.to;

  return (
    <div className="rounded-2xl border border-border/60 [background:var(--gradient-card)] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={value.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search by title, reference, facility or reporter"
            className="h-10 w-full rounded-lg border border-border/60 bg-background/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={value.status}
            onChange={(e) => set("status", e.target.value as TFilters["status"])}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>

          <select
            value={value.priority}
            onChange={(e) => set("priority", e.target.value as TFilters["priority"])}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === "All" ? "All priorities" : p}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={value.from}
            onChange={(e) => set("from", e.target.value)}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="date"
            value={value.to}
            onChange={(e) => set("to", e.target.value)}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="button"
            onClick={() =>
              onChange({ search: "", status: "All", priority: "All", from: "", to: "" })
            }
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-lg border border-border/60 px-3 text-sm text-muted-foreground transition-all hover:border-border hover:text-foreground",
              !hasFilters && "opacity-50 pointer-events-none",
            )}
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
