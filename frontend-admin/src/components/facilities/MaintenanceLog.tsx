import { useState } from "react";
import { CalendarClock, Plus, Wrench } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  facilityStore,
  maintenanceTone,
  type Facility,
  type MaintenanceStatus,
} from "@/lib/facility-store";
import { cn } from "@/lib/utils";

const STATUSES: MaintenanceStatus[] = ["Completed", "Pending"];

export function MaintenanceLog({ facility }: { facility: Facility }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MaintenanceStatus>("Completed");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setStatus("Completed");
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    facilityStore.addMaintenanceLog(facility.id, { date, description: description.trim(), status });
    reset();
    setOpen(false);
  };

  return (
    <SurfaceCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wrench className="h-4 w-4 text-muted-foreground" /> Maintenance Logs
        </h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 px-2.5 text-xs font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> {open ? "Cancel" : "Add Log"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-background/40 p-4 sm:grid-cols-[140px_1fr_140px_auto]"
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError(null);
            }}
            placeholder="What was performed?"
            className={cn(
              "h-10 rounded-lg border bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20",
              error ? "border-destructive/70" : "border-border/60",
            )}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
            className="h-10 rounded-lg border border-border/60 bg-background/60 px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
          >
            Save
          </button>
          {error && (
            <p className="sm:col-span-4 px-1 text-xs font-medium text-destructive">{error}</p>
          )}
        </form>
      )}

      {facility.logs.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
            <CalendarClock className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">No maintenance logs yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Record interventions to keep the maintenance history up to date.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {facility.logs.map((log) => (
            <li
              key={log.id}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <Wrench className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{log.description}</p>
                  <p className="text-xs text-muted-foreground">{log.date}</p>
                </div>
              </div>
              <StatusBadge tone={maintenanceTone[log.status]}>{log.status}</StatusBadge>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
