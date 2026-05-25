import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ClipboardCheck, Building2, User, Calendar, Tag,
  AlertTriangle, CheckCircle2, Clock, BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { auditService, type Audit } from "@/lib/api/services/audit.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/portal/audits/$id")({
  head: () => ({
    meta: [
      { title: "Audit Detail · 360CRD" },
      { name: "description", content: "Audit details, findings and progress." },
    ],
  }),
  component: AuditDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:       "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SCHEDULED:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  COMPLETED:   "bg-green-500/10 text-green-600 border-green-500/20",
  REVIEWED:    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  CANCELLED:   "bg-red-500/10 text-red-600 border-red-500/20",
};

const FINDING_SEVERITY_COLOR: Record<string, string> = {
  LOW:      "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MEDIUM:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
  HIGH:     "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CRITICAL: "bg-red-500/10 text-red-600 border-red-500/20",
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

function AuditDetailPage() {
  const { id } = Route.useParams();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    auditService
      .get(id)
      .then(setAudit)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link
          to="/portal/audits"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to audits
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Skeleton className="h-48 rounded-xl lg:col-span-2" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        ) : notFound || !audit ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Audit not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            <SurfaceCard className="p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">{audit.refNumber}</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{audit.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[audit.status] ?? "bg-gray-500/10 text-gray-600")}>
                      {audit.status.replace(/_/g, " ")}
                    </span>
                    <span className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {audit.type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                {audit.percentage != null && (
                  <div className="shrink-0 flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/50 px-6 py-4">
                    <span className={cn("text-3xl font-bold", audit.passed ? "text-green-500" : "text-red-500")}>
                      {audit.percentage.toFixed(0)}%
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {audit.grade ? `Grade ${audit.grade}` : audit.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem icon={Building2} label="Site" value={audit.site?.name} />
                <MetaItem icon={User} label="Assigned To" value={audit.assignedTo ? `${audit.assignedTo.firstName} ${audit.assignedTo.lastName}` : null} />
                <MetaItem icon={Calendar} label="Scheduled" value={audit.scheduledAt ? new Date(audit.scheduledAt).toLocaleDateString() : null} />
                <MetaItem icon={Calendar} label="Due Date" value={audit.dueDate ? new Date(audit.dueDate).toLocaleDateString() : null} />
                <MetaItem icon={Calendar} label="Started" value={audit.startedAt ? new Date(audit.startedAt).toLocaleDateString() : null} />
                <MetaItem icon={CheckCircle2} label="Completed" value={audit.completedAt ? new Date(audit.completedAt).toLocaleDateString() : null} />
                <MetaItem icon={Tag} label="Customer" value={audit.customer?.name} />
                <MetaItem icon={User} label="Completed By" value={audit.completedBy ? `${audit.completedBy.firstName} ${audit.completedBy.lastName}` : null} />
              </div>
            </SurfaceCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {audit.description && (
                  <SurfaceCard className="p-6">
                    <h2 className="text-sm font-semibold text-foreground">Description</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{audit.description}</p>
                  </SurfaceCard>
                )}

                {audit.auditFindings && audit.auditFindings.length > 0 && (
                  <SurfaceCard className="p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      Findings ({audit.auditFindings.length})
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {audit.auditFindings.map((finding) => (
                        <li key={finding.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{finding.title}</p>
                            {finding.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{finding.description}</p>}
                            {finding.dueDate && <p className="mt-1 text-xs text-muted-foreground">Due {new Date(finding.dueDate).toLocaleDateString()}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", FINDING_SEVERITY_COLOR[finding.severity] ?? "bg-gray-500/10 text-gray-600")}>
                              {finding.severity}
                            </span>
                            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              finding.status === "CLOSED" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            )}>
                              {finding.status}
                            </span>
                          </div>
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
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[audit.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {audit.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    {audit.score != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-medium">{audit.score} / {audit.maxScore ?? "—"}</span>
                      </div>
                    )}
                    {audit._count && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Responses</span>
                          <span className="font-medium">{audit._count.responses}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Findings</span>
                          <span className="font-medium">{audit._count.auditFindings}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      Created {new Date(audit.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </SurfaceCard>

                <SurfaceCard className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Progress</h2>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Scheduled", icon: Clock, done: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "REVIEWED"].includes(audit.status) },
                      { label: "In Progress", icon: BarChart3, done: ["IN_PROGRESS", "COMPLETED", "REVIEWED"].includes(audit.status) },
                      { label: "Completed", icon: CheckCircle2, done: ["COMPLETED", "REVIEWED"].includes(audit.status) },
                      { label: "Reviewed", icon: CheckCircle2, done: audit.status === "REVIEWED" },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-full border",
                          step.done ? "border-green-500/30 bg-green-500/10 text-green-600" : "border-border/60 bg-muted/40 text-muted-foreground/50"
                        )}>
                          <step.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className={cn("text-sm", step.done ? "font-medium text-foreground" : "text-muted-foreground")}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
