import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, MapPin, User, Calendar, Tag, Building2, ClipboardList, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { incidentService, type Incident } from "@/lib/api/services/incident.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/incidents/$id")({
  head: () => ({
    meta: [
      { title: "Incident Detail · 360CRD" },
      { name: "description", content: "Incident details, timeline and actions." },
    ],
  }),
  component: IncidentDetailPage,
});

const SEVERITY_COLOR: Record<string, string> = {
  LOW: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  HIGH: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CRITICAL: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: "bg-red-500/10 text-red-600 border-red-500/20",
  INVESTIGATING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

function MetaItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary/70">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function IncidentDetailPage() {
  const { id } = Route.useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    incidentService
      .get(id)
      .then(setIncident)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link
          to="/app/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to incidents
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Skeleton className="h-48 rounded-xl lg:col-span-2" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        ) : notFound || !incident ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Incident not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            <SurfaceCard className="p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">{incident.refNumber}</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{incident.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[incident.status] ?? "bg-gray-500/10 text-gray-600")}>
                      {incident.status.replace(/_/g, " ")}
                    </span>
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", SEVERITY_COLOR[incident.severity] ?? "bg-gray-500/10 text-gray-600")}>
                      {incident.severity} severity
                    </span>
                    <Badge variant="outline" className="text-xs">{incident.type.replace(/_/g, " ")}</Badge>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg border", incident.priority === "CRITICAL" ? "bg-red-500/10 text-red-600 border-red-500/20" : incident.priority === "HIGH" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20")}>
                    {incident.priority} priority
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem icon={Building2} label="Site" value={incident.site?.name} />
                <MetaItem icon={User} label="Reported By" value={`${incident.reportedBy.firstName} ${incident.reportedBy.lastName}`} />
                <MetaItem icon={User} label="Assigned To" value={incident.assignedTo ? `${incident.assignedTo.firstName} ${incident.assignedTo.lastName}` : null} />
                <MetaItem icon={Calendar} label="Occurred" value={new Date(incident.occurredAt).toLocaleString()} />
                <MetaItem icon={MapPin} label="Location" value={incident.location} />
                <MetaItem icon={Tag} label="Category" value={incident.category} />
              </div>
            </SurfaceCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {incident.description && (
                  <SurfaceCard className="p-6">
                    <h2 className="text-sm font-semibold text-foreground">Description</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                      {incident.description}
                    </p>
                  </SurfaceCard>
                )}

                {incident.capas && incident.capas.length > 0 && (
                  <SurfaceCard className="p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      Corrective Actions ({incident.capas.length})
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {incident.capas.map((capa) => (
                        <li key={capa.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{capa.title}</p>
                            {capa.dueDate && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Due {new Date(capa.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", capa.status === "COMPLETED" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20")}>
                            {capa.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </SurfaceCard>
                )}
              </div>

              <div className="space-y-4">
                <SurfaceCard className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Details</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[incident.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {incident.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Anonymous</span>
                      <span className="font-medium">{incident.isAnonymous ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Notifiable</span>
                      <span className="font-medium">{incident.isNotifiable ? "Yes" : "No"}</span>
                    </div>
                    {incident.evidence && incident.evidence.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Evidence</span>
                        <span className="font-medium">{incident.evidence.length} files</span>
                      </div>
                    )}
                    <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      Created {new Date(incident.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </SurfaceCard>

                {incident.customer && (
                  <SurfaceCard className="p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" /> Customer
                    </h2>
                    <p className="mt-2 text-sm text-foreground">{incident.customer.name}</p>
                  </SurfaceCard>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

