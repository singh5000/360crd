import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  FileText,
  MessageSquare,
  Paperclip,
  User,
} from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  incidentStore,
  priorityTone,
  statusTone,
  type Incident,
  type TimelineEntry,
} from "@/lib/incident-store";
import { cn } from "@/lib/utils";

const timelineIcon: Record<TimelineEntry["type"], typeof CircleDot> = {
  created: CircleDot,
  status: CheckCircle2,
  comment: MessageSquare,
  escalated: AlertTriangle,
};

const timelineTone: Record<TimelineEntry["type"], string> = {
  created: "bg-info/10 text-info ring-info/20",
  status: "bg-success/10 text-success ring-success/20",
  comment: "bg-muted text-muted-foreground ring-border",
  escalated: "bg-destructive/10 text-destructive ring-destructive/20",
};

export function IncidentDetail({ incident }: { incident: Incident }) {
  const isResolved = incident.status === "Resolved";
  const isEscalated = incident.status === "Escalated";

  const handleResolve = () => incidentStore.updateIncidentStatus(incident.id, "Resolved");
  const handleEscalate = () => incidentStore.updateIncidentStatus(incident.id, "Escalated");

  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{incident.reference}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {incident.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone={statusTone[incident.status]}>{incident.status}</StatusBadge>
              <StatusBadge tone={priorityTone[incident.priority]}>
                {incident.priority} priority
              </StatusBadge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleEscalate}
              disabled={isEscalated}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 text-sm font-medium text-destructive transition-all hover:bg-destructive/15 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ArrowUpRight className="h-4 w-4" /> Escalate
            </button>
            <button
              type="button"
              onClick={handleResolve}
              disabled={isResolved}
              className="inline-flex h-10 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark as Resolved
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
          <Meta icon={Building2} label="Facility" value={incident.facility} />
          <Meta icon={User} label="Reported By" value={incident.reportedBy} />
          <Meta icon={CalendarClock} label="Created At" value={incident.createdAt} />
        </div>
      </SurfaceCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SurfaceCard className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" /> Description
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {incident.description}
            </p>
          </SurfaceCard>

          {incident.attachments.length > 0 && (
            <SurfaceCard className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Paperclip className="h-4 w-4 text-muted-foreground" /> Attachments
              </h2>
              <ul className="mt-3 space-y-2">
                {incident.attachments.map((a) => (
                  <li
                    key={a}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs"
                  >
                    <span className="truncate text-foreground">{a}</span>
                    <span className="text-[11px] text-muted-foreground">attached</span>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          )}
        </div>

        <SurfaceCard className="p-6">
          <h2 className="text-sm font-semibold text-foreground">Activity</h2>
          <ol className="mt-4 space-y-4">
            {incident.timeline.map((t, idx) => {
              const Icon = timelineIcon[t.type];
              const last = idx === incident.timeline.length - 1;
              return (
                <li key={t.id} className="relative flex gap-3">
                  {!last && (
                    <span className="absolute left-[15px] top-8 bottom-[-16px] w-px bg-border/60" />
                  )}
                  <div
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                      timelineTone[t.type],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-foreground">{t.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.author} · {t.at}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </SurfaceCard>
      </div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
