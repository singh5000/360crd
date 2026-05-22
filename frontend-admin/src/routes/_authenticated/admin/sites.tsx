import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, RefreshCw, Warehouse, MapPin, CheckCircle2, ChevronRight,
  ToggleLeft, ToggleRight, Pencil, Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useFacilityStore } from "@/lib/stores/facility.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FilterBar } from "@/components/shared/FilterBar";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/auth-store";
import type { Site } from "@/lib/api/services/site.service";

export const Route = createFileRoute("/_authenticated/admin/sites")({
  head: () => ({
    meta: [
      { title: "Sites · 360CRD" },
      { name: "description", content: "Manage operational sites and locations." },
    ],
  }),
  component: SitesPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:      "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:    "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED:      "bg-red-500/10 text-red-600 border-red-500/20",
};

const SITE_TYPES = ["FACILITY", "WAREHOUSE", "OFFICE", "CONSTRUCTION", "REMOTE", "RETAIL", "OTHER"];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "MAINTENANCE", label: "Maintenance" },
      { value: "CLOSED", label: "Closed" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: SITE_TYPES.map((t) => ({ value: t, label: t.replace(/_/g, " ") })),
  },
];

const EMPTY_FORM = {
  name: "", code: "", type: "FACILITY", status: "ACTIVE",
  address: "", city: "", state: "", country: "", postalCode: "",
};

function SitesPage() {
  const { facilities, loading, initialized, fetchFacilities, createFacility, updateFacility, removeFacility } = useFacilityStore();
  const can = usePermissions();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Site | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialized) fetchFacilities();
  }, [initialized, fetchFacilities]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return facilities.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !(s.code ?? "").toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && s.status !== filterVals.status) return false;
      if (filterVals.type && filterVals.type !== "ALL" && s.type !== filterVals.type) return false;
      return true;
    });
  }, [facilities, search, filterVals]);

  const pills = [
    { label: "Total Sites", value: facilities.length, icon: Warehouse, color: "text-foreground" },
    { label: "Active", value: facilities.filter((s) => s.status === "ACTIVE").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Locations", value: new Set(facilities.map((s) => s.country).filter(Boolean)).size, icon: MapPin, color: "text-blue-500" },
  ];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createFacility({
        name: form.name,
        code: form.code,
        type: form.type,
        status: form.status || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        postalCode: form.postalCode || undefined,
      });
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await updateFacility(editTarget.id, {
        name: editForm.name,
        code: editForm.code,
        type: editForm.type,
        status: editForm.status || undefined,
        address: editForm.address || undefined,
        city: editForm.city || undefined,
        state: editForm.state || undefined,
        country: editForm.country || undefined,
        postalCode: editForm.postalCode || undefined,
      });
      setEditDrawerOpen(false);
      setEditTarget(null);
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(site: Site) {
    setEditTarget(site);
    setEditForm({
      name: site.name,
      code: site.code,
      type: site.type,
      status: site.status,
      address: site.address ?? "",
      city: site.city ?? "",
      state: site.state ?? "",
      country: site.country ?? "",
      postalCode: site.postalCode ?? "",
    });
    setEditDrawerOpen(true);
  }

  async function handleToggleStatus(site: Site) {
    const newStatus = site.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateFacility(site.id, { status: newStatus });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await removeFacility(deleteTarget.id);
    setDeleteTarget(null);
  }

  function SiteForm({ id, formState, setFormState, onSubmit }: {
    id: string;
    formState: typeof EMPTY_FORM;
    setFormState: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
    onSubmit: (e: React.FormEvent) => void;
  }) {
    const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormState((f) => ({ ...f, [k]: e.target.value }));
    return (
      <form id={id} onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor={`${id}-name`}>Name <span className="text-red-500">*</span></Label>
            <Input id={`${id}-name`} placeholder="Main Warehouse" value={formState.name} onChange={set("name")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-code`}>Code <span className="text-red-500">*</span></Label>
            <Input id={`${id}-code`} placeholder="SITE-001" value={formState.code} onChange={set("code")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-type`}>Type</Label>
            <Select value={formState.type} onValueChange={(v) => setFormState((f) => ({ ...f, type: v }))}>
              <SelectTrigger id={`${id}-type`}><SelectValue /></SelectTrigger>
              <SelectContent>
                {SITE_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-status`}>Status</Label>
            <Select value={formState.status} onValueChange={(v) => setFormState((f) => ({ ...f, status: v }))}>
              <SelectTrigger id={`${id}-status`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-city`}>City</Label>
            <Input id={`${id}-city`} placeholder="Sydney" value={formState.city} onChange={set("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-state`}>State</Label>
            <Input id={`${id}-state`} placeholder="NSW" value={formState.state} onChange={set("state")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-country`}>Country</Label>
            <Input id={`${id}-country`} placeholder="Australia" value={formState.country} onChange={set("country")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-postal`}>Postal Code</Label>
            <Input id={`${id}-postal`} placeholder="2000" value={formState.postalCode} onChange={set("postalCode")} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor={`${id}-address`}>Address</Label>
            <Input id={`${id}-address`} placeholder="123 Main St" value={formState.address} onChange={set("address")} />
          </div>
        </div>
      </form>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Sites</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage operational sites, locations, and facilities.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchFacilities()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("site:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add Site
              </Button>
            )}
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
          searchPlaceholder="Search sites..."
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
            <Warehouse className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No sites found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Add your first site to get started"}
            </p>
            {can("site:create") && !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && (
              <Button
                size="sm"
                className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add Site
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs w-[90px]">Code</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Type</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Location</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[90px]">Incidents</TableHead>
                  <TableHead className="text-xs w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((site) => (
                  <TableRow key={site.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">{site.code}</TableCell>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {site.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {site.type ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {[site.city, site.country].filter(Boolean).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {site._count?.incidents ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {can("site:update") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title={site.status === "ACTIVE" ? "Deactivate" : "Activate"}
                              onClick={() => handleToggleStatus(site)}
                            >
                              {site.status === "ACTIVE"
                                ? <ToggleRight className="h-4 w-4 text-green-500" />
                                : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Edit site"
                              onClick={() => openEdit(site)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </>
                        )}
                        {can("site:delete") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-red-500"
                            title="Delete site"
                            onClick={() => setDeleteTarget(site)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-1" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Site Drawer */}
      <ModuleDrawer
        open={drawerOpen && can("site:create")}
        onOpenChange={setDrawerOpen}
        title="Add Site"
        description="Create a new operational site or facility"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-site-form"
              type="submit"
              disabled={submitting || !form.name || !form.code}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Adding..." : "Add Site"}
            </Button>
          </div>
        }
      >
        <SiteForm id="create-site-form" formState={form} setFormState={setForm} onSubmit={handleCreate} />
      </ModuleDrawer>

      {/* Edit Site Drawer */}
      <ModuleDrawer
        open={editDrawerOpen}
        onOpenChange={(v) => { setEditDrawerOpen(v); if (!v) setEditTarget(null); }}
        title="Edit Site"
        description={editTarget ? `Editing: ${editTarget.name}` : ""}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDrawerOpen(false)}>Cancel</Button>
            <Button
              form="edit-site-form"
              type="submit"
              disabled={submitting || !editForm.name || !editForm.code}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      >
        <SiteForm id="edit-site-form" formState={editForm} setFormState={setEditForm} onSubmit={handleEdit} />
      </ModuleDrawer>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
