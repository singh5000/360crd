import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Building2, CheckCircle2, ChevronRight, Loader2,
  Plus, RefreshCw, X, Globe, Users, Warehouse,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/shared/FilterBar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { authStore } from "@/lib/auth-store";
import {
  useTenantStore,
  TENANT_STATUS_COLOR,
  TENANT_PLAN_COLOR,
  TENANT_PLAN_LABEL,
  type TenantPlan,
} from "@/lib/stores/tenant.store";

export const Route = createFileRoute("/_authenticated/admin/tenants")({
  head: () => ({
    meta: [{ title: "Companies · 360CRD" }],
  }),
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = authStore.getState().user;
    if (user?.role !== "super_admin") throw redirect({ to: "/admin/dashboard" });
  },
  component: TenantsPage,
});

const PLAN_OPTIONS: { value: TenantPlan; label: string }[] = [
  { value: "STARTER", label: "Starter" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "WHITE_LABEL", label: "White Label" },
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "TRIAL", label: "Trial" },
      { value: "ACTIVE", label: "Active" },
      { value: "SUSPENDED", label: "Suspended" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
  {
    key: "plan",
    label: "Plan",
    options: PLAN_OPTIONS.map((p) => ({ value: p.value, label: p.label })),
  },
];

function TenantsPage() {
  const { tenants, loading, initialized, total, fetchTenants, createTenant } = useTenantStore();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (!initialized) fetchTenants();
  }, [initialized, fetchTenants]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tenants.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.slug.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && t.status !== filterVals.status) return false;
      if (filterVals.plan && filterVals.plan !== "ALL" && t.plan !== filterVals.plan) return false;
      return true;
    });
  }, [tenants, search, filterVals]);

  const pills = [
    { label: "Total", value: total, icon: Building2, color: "text-foreground" },
    { label: "Active", value: tenants.filter((t) => t.status === "ACTIVE").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Trial", value: tenants.filter((t) => t.status === "TRIAL").length, icon: Globe, color: "text-blue-500" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Companies</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              All organisations registered on the platform. Super admin only.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchTenants()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Company
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or slug…"
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading && !initialized ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No companies found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Add your first company to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && (
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Add Company
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Company</TableHead>
                  <TableHead className="text-xs">Slug</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Plan</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Industry</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[80px]">
                    <Users className="h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[80px]">
                    <Warehouse className="h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {t.branding?.logoUrl ? (
                          <img src={t.branding.logoUrl} alt={t.name} className="h-6 w-6 rounded object-cover" />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                            <Building2 className="h-3.5 w-3.5 text-primary/70" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{t.name}</p>
                          {t.legalName && t.legalName !== t.name && (
                            <p className="text-[10px] text-muted-foreground">{t.legalName}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.slug}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TENANT_STATUS_COLOR[t.status])}>
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TENANT_PLAN_COLOR[t.plan])}>
                        {TENANT_PLAN_LABEL[t.plan]}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {t.industry ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {t._count?.users ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {t._count?.sites ?? "—"}
                    </TableCell>
                    <TableCell className="pr-3 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AddTenantDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={async (body) => {
          await createTenant(body);
          setAddOpen(false);
        }}
      />
    </AppShell>
  );
}

function AddTenantDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (body: {
    slug: string; name: string; legalName?: string;
    plan: TenantPlan; industry?: string; country?: string;
    maxUsers: number; maxSites: number;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [legalName, setLegalName] = useState("");
  const [plan, setPlan] = useState<TenantPlan>("STARTER");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [maxUsers, setMaxUsers] = useState(50);
  const [maxSites, setMaxSites] = useState(10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const onNameChange = (v: string) => {
    setName(v);
    setSlug(autoSlug(v));
  };

  const handleClose = () => {
    setName(""); setSlug(""); setLegalName(""); setPlan("STARTER");
    setIndustry(""); setCountry(""); setMaxUsers(50); setMaxSites(10);
    setError(""); setSaving(false);
    onClose();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Company name is required"); return; }
    if (!slug.trim()) { setError("Slug is required"); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { setError("Slug must be lowercase letters, numbers and hyphens only"); return; }
    setError("");
    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        slug: slug.trim(),
        ...(legalName.trim() && { legalName: legalName.trim() }),
        plan,
        ...(industry.trim() && { industry: industry.trim() }),
        ...(country.trim() && { country: country.trim() }),
        maxUsers,
        maxSites,
      });
      handleClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create company");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Add Company
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Company name <span className="text-destructive">*</span></label>
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Acme Corporation"
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug <span className="text-destructive">*</span></label>
              <input
                value={slug}
                onChange={(e) => setSlug(autoSlug(e.target.value))}
                placeholder="acme-corporation"
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground">Used as subdomain identifier</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as TenantPlan)}
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Legal name</label>
              <input
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Acme Corporation Ltd."
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Industry</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Manufacturing"
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Australia"
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Max users</label>
              <input
                type="number"
                min={1}
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Max sites</label>
              <input
                type="number"
                min={1}
                value={maxSites}
                onChange={(e) => setMaxSites(Number(e.target.value))}
                disabled={saving}
                className="flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-70"
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create company"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
