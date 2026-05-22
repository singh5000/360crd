import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RefreshCw, Package, Wrench, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
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
import { FilterBar } from "@/components/shared/FilterBar";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePermissions } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/admin/assets")({
  head: () => ({ meta: [{ title: "Assets · 360CRD" }] }),
  component: AssetsPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:      "bg-green-500/10 text-green-600 border-green-500/20",
  IN_USE:      "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  RETIRED:     "bg-gray-500/10 text-gray-600 border-gray-500/20",
  DISPOSED:    "bg-red-500/10 text-red-600 border-red-500/20",
};

const ASSET_CATEGORIES = [
  "VEHICLE", "MACHINERY", "TOOL", "EQUIPMENT", "FURNITURE", "IT", "SAFETY", "OTHER",
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "IN_USE", label: "In Use" },
      { value: "MAINTENANCE", label: "Maintenance" },
      { value: "RETIRED", label: "Retired" },
      { value: "DISPOSED", label: "Disposed" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: ASSET_CATEGORIES.map((c) => ({ value: c, label: c })),
  },
];

const EMPTY_FORM = { name: "", category: "EQUIPMENT", brand: "", model: "", assetTag: "" };

function AssetsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const can = usePermissions();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        apiClient.get<any>(ENDPOINTS.assets.list, { limit: 100 }),
        apiClient.get<any>(ENDPOINTS.assets.stats),
      ]);
      setItems(listRes.data ?? []);
      setStats(statsRes.data ?? null);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !(item.assetTag ?? "").toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && item.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total Assets", value: stats?.total ?? items.length, icon: Package, color: "text-foreground" },
    { label: "Active", value: stats?.active ?? items.filter((i) => i.status === "ACTIVE").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Maintenance", value: stats?.maintenance ?? items.filter((i) => i.status === "MAINTENANCE").length, icon: Wrench, color: "text-yellow-500" },
    { label: "Service Overdue", value: stats?.serviceOverdue ?? 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.assets.create, {
        name: form.name,
        category: form.category,
        brand: form.brand || undefined,
        model: form.model || undefined,
        assetTag: form.assetTag || undefined,
      });
      toast.success("Asset registered");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to register asset");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Asset Register</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track company assets, assignments and service history.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("asset:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Register Asset
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
          searchPlaceholder="Search assets..."
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No assets found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Register your first asset to get started"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Brand / Model</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Asset Tag</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Site</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id} className="border-border/60 cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {[item.brand, item.model].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">{item.assetTag ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{item.site?.name ?? "—"}</TableCell>
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

      <ModuleDrawer
        open={drawerOpen && can("asset:create")}
        onOpenChange={setDrawerOpen}
        title="Register Asset"
        description="Add a new asset to the register"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-asset-form"
              type="submit"
              disabled={submitting || !form.name}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Registering..." : "Register Asset"}
            </Button>
          </div>
        }
      >
        <form id="create-asset-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="asset-name">Asset Name <span className="text-red-500">*</span></Label>
            <Input
              id="asset-name"
              placeholder="e.g. Forklift — Warehouse A"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger id="asset-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ASSET_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset-brand">Brand</Label>
              <Input id="asset-brand" placeholder="Toyota" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-model">Model</Label>
              <Input id="asset-model" placeholder="8FBE15" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-tag">Asset Tag</Label>
            <Input
              id="asset-tag"
              placeholder="AST-0001"
              value={form.assetTag}
              onChange={(e) => setForm((f) => ({ ...f, assetTag: e.target.value }))}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}

