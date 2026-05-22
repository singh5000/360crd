import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, RefreshCw, ClipboardCheck, ChevronRight,
  CheckCircle2, Clock, AlertTriangle, BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuditStore } from "@/lib/stores/audit.store";
import { auditService, type CreateAuditPayload } from "@/lib/api/services/audit.service";
import { usePermissions, useAuth } from "@/lib/auth-store";
import { useTenantContext } from "@/lib/stores/tenant-context.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilterBar } from "@/components/shared/FilterBar";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/audits")({
  head: () => ({
    meta: [
      { title: "Audits · 360CRD" },
      { name: "description", content: "Plan, execute and review compliance audits." },
    ],
  }),
  component: AuditsPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:       "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SCHEDULED:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  COMPLETED:   "bg-green-500/10 text-green-600 border-green-500/20",
  REVIEWED:    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  CANCELLED:   "bg-red-500/10 text-red-600 border-red-500/20",
};

const AUDIT_TYPES = [
  "SCHEDULED", "UNANNOUNCED", "FOLLOW_UP", "COMPLIANCE", "INTERNAL", "EXTERNAL",
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "DRAFT", label: "Draft" },
      { value: "SCHEDULED", label: "Scheduled" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "COMPLETED", label: "Completed" },
      { value: "REVIEWED", label: "Reviewed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: AUDIT_TYPES.map((t) => ({ value: t, label: t.replace(/_/g, " ") })),
  },
];

const EMPTY_FORM: CreateAuditPayload = {
  title: "",
  description: "",
  type: "INTERNAL",
  scheduledAt: "",
  dueDate: "",
};

function AuditsPage() {
  const { audits, loading, initialized, fetchAudits, createAudit } = useAuditStore();
  const can = usePermissions();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const { selectedTenantId } = useTenantContext();
  const [stats, setStats] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<CreateAuditPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialized) fetchAudits();
    auditService.stats().then(setStats).catch(() => {});
  }, [initialized, fetchAudits]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return audits.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q) && !a.refNumber.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && a.status !== filterVals.status) return false;
      if (filterVals.type && filterVals.type !== "ALL" && a.type !== filterVals.type) return false;
      return true;
    });
  }, [audits, search, filterVals]);

  const pills = [
    { label: "Total", value: stats?.total ?? audits.length, icon: ClipboardCheck, color: "text-foreground" },
    { label: "Completed", value: stats?.completed ?? audits.filter((a) => a.status === "COMPLETED").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "In Progress", value: audits.filter((a) => a.status === "IN_PROGRESS").length, icon: Clock, color: "text-yellow-500" },
    { label: "Overdue", value: stats?.overdue ?? 0, icon: AlertTriangle, color: "text-red-500" },
    { label: "Avg Score", value: stats?.avgScore ? `${stats.avgScore.toFixed(0)}%` : "—", icon: BarChart3, color: "text-primary" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAudit({
        ...form,
        ...(isSuperAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
        scheduledAt: form.scheduledAt ? `${form.scheduledAt}T00:00:00.000Z` : undefined,
        dueDate: form.dueDate ? `${form.dueDate}T00:00:00.000Z` : undefined,
      });
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Audits</h1>
            <p className="mt-1 text-sm text-muted-foreground">Plan, execute and review compliance audits.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchAudits()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("audit:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> New Audit
              </Button>
            )}
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search audits..."
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {/* Table */}
        {loading && !initialized ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <ClipboardCheck className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No audits found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Create your first audit to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("audit:create") && (
              <Button size="sm" className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground" onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4" /> New Audit
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="w-[110px] text-xs">Ref #</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Type</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Site</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Scheduled</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[80px]">Score</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((audit) => (
                  <TableRow key={audit.id} className="border-border/60 cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">{audit.refNumber}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{audit.title}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[audit.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {audit.status.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {audit.type}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{audit.site?.name ?? "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {audit.assignedTo ? `${audit.assignedTo.firstName} ${audit.assignedTo.lastName}` : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {audit.scheduledAt ? new Date(audit.scheduledAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm font-semibold">
                      {audit.percentage != null ? (
                        <span className={audit.passed ? "text-green-500" : "text-red-500"}>
                          {audit.percentage.toFixed(0)}%
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create drawer */}
      <ModuleDrawer
        open={drawerOpen && can("audit:create")}
        onOpenChange={setDrawerOpen}
        title="New Audit"
        description="Create a new compliance audit"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-audit-form"
              type="submit"
              disabled={submitting || !form.title || (isSuperAdmin && !selectedTenantId)}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Creating..." : "Create Audit"}
            </Button>
          </div>
        }
      >
        <form id="create-audit-form" onSubmit={handleSubmit} className="space-y-5">
          {isSuperAdmin && !selectedTenantId && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-700 dark:text-yellow-400">
              Select a company from the header before creating an audit.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="audit-title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="audit-title"
              placeholder="e.g. Q2 Safety Compliance Audit"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audit-type">Audit Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger id="audit-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audit-scheduled">Scheduled Date</Label>
              <Input
                id="audit-scheduled"
                type="date"
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-due">Due Date</Label>
              <Input
                id="audit-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audit-desc">Description</Label>
            <Textarea
              id="audit-desc"
              placeholder="Describe the scope and objectives..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}

