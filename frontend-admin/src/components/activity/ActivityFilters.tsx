import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { ACTIVITY_ACTIONS, ACTIVITY_MODULES, type ActivityFilters as Filters } from "@/lib/activity.types";
import { useActivityLogs } from "@/lib/activity.store";
import { useCompanies } from "@/lib/company-store";
import { cn } from "@/lib/utils";

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export function ActivityFilters({ value, onChange }: Props) {
  const logs = useActivityLogs();
  const companies = useCompanies();
  const users = useMemo(() => Array.from(new Set(logs.map((l) => l.user))).sort(), [logs]);

  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  const hasFilters =
    value.search ||
    value.module !== "All" ||
    value.user !== "All" ||
    value.companyId !== "All" ||
    value.action !== "All" ||
    value.from ||
    value.to;

  return (
    <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-border/60 bg-card/70 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={value.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by event, target or user…"
            className="h-10 w-full rounded-xl border border-border/70 bg-card/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
          />
        </div>

        <Select label="Module" value={value.module} onChange={(v) => set({ module: v as Filters["module"] })}>
          <option value="All">All modules</option>
          {ACTIVITY_MODULES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>

        <Select label="Action" value={value.action} onChange={(v) => set({ action: v as Filters["action"] })}>
          <option value="All">All actions</option>
          {ACTIVITY_ACTIONS.map((a) => (
            <option key={a} value={a}>{a.replace("_", " ")}</option>
          ))}
        </Select>

        <Select label="User" value={value.user} onChange={(v) => set({ user: v })}>
          <option value="All">All users</option>
          {users.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </Select>

        <Select label="Company" value={value.companyId} onChange={(v) => set({ companyId: v })}>
          <option value="All">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <DateInput value={value.from} onChange={(v) => set({ from: v })} placeholder="From" />
        <DateInput value={value.to} onChange={(v) => set({ to: v })} placeholder="To" />

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({ search: "", module: "All", user: "All", companyId: "All", action: "All", from: "", to: "" })
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 rounded-xl border border-border/70 bg-card/40 px-3 text-sm text-foreground transition-colors",
        "focus:border-primary/70 focus:outline-none",
      )}
    >
      {children}
    </select>
  );
}

function DateInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="date"
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-xl border border-border/70 bg-card/40 px-3 text-sm text-foreground focus:border-primary/70 focus:outline-none"
    />
  );
}
