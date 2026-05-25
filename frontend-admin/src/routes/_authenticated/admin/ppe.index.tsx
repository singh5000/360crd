import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, RefreshCw, HardHat, Package, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/admin/ppe/")({
  head: () => ({ meta: [{ title: "PPE · 360CRD" }] }),
  component: PPEPage,
});

const CONDITION_COLOR: Record<string, string> = {
  EXCELLENT: "text-green-500",
  GOOD:      "text-blue-500",
  FAIR:      "text-yellow-500",
  POOR:      "text-orange-500",
  DAMAGED:   "text-red-500",
};

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE:   "bg-green-500/10 text-green-600 border-green-500/20",
  ASSIGNED:    "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  DISPOSED:    "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const PPE_CATEGORIES = [
  "HEAD", "EYE", "EAR", "RESPIRATORY", "HAND", "FOOT", "BODY", "HIGH_VIS", "FALL_PROTECTION", "OTHER",
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "AVAILABLE", label: "Available" },
      { value: "ASSIGNED", label: "Assigned" },
      { value: "MAINTENANCE", label: "Maintenance" },
      { value: "DISPOSED", label: "Disposed" },
    ],
  },
  {
    key: "condition",
    label: "Condition",
    options: [
      { value: "EXCELLENT", label: "Excellent" },
      { value: "GOOD", label: "Good" },
      { value: "FAIR", label: "Fair" },
      { value: "POOR", label: "Poor" },
      { value: "DAMAGED", label: "Damaged" },
    ],
  },
];

const EMPTY_FORM = { name: "", category: "HEAD", manufacturer: "", model: "", serialNumber: "" };

function PPEPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const can = usePermissions();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  async function loadList() {
    setLoading(true);
    try {
      const listRes = await apiClient.get<any>(ENDPOINTS.ppe.list, { limit: 100 });
      setItems(listRes.data ?? []);
    } catch {
      toast.error("Failed to load PPE items");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const statsRes = await apiClient.get<any>(ENDPOINTS.ppe.stats);
      setStats(statsRes.data ?? null);
    } catch {
      // stats are non-critical
    }
  }

  useEffect(() => {
    loadList();
    loadStats();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !(item.serialNumber ?? "").toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.condition && filterVals.condition !== "ALL" && item.condition !== filterVals.condition) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total Items", value: stats?.total ?? items.length, icon: Package, color: "text-foreground" },
    { label: "Available", value: stats?.byStatus?.AVAILABLE ?? items.filter((i) => i.status === "AVAILABLE").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Assigned", value: stats?.byStatus?.ASSIGNED ?? items.filter((i) => i.status === "ASSIGNED").length, icon: HardHat, color: "text-blue-500" },
    { label: "Expiring Soon", value: stats?.expiringSoon ?? 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.ppe.create, {
        name: form.name,
        category: form.category,
        manufacturer: form.manufacturer || undefined,
        model: form.model || undefined,
        serialNumber: form.serialNumber || undefined,
      });
      toast.success("PPE item added");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      await loadList();
      loadStats();
    } catch {
      toast.error("Failed to add PPE item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">PPE Inventory</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage personal protective equipment and assignments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadList} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("ppe:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add PPE
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
          searchPlaceholder="Search PPE items..."
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
            <HardHat className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No PPE items found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Add your first PPE item to the inventory"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("ppe:create") && (
              <Button size="sm" className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground" onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4" /> Add PPE
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Condition</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Manufacturer / Model</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Serial #</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow
                    key={item.id}
                    className="border-border/60 cursor-pointer hover:bg-muted/30 group"
                    onClick={() => navigate({ to: "/admin/ppe/$id", params: { id: item.id } })}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.category.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.condition ? (
                        <span className={cn("text-xs font-medium", CONDITION_COLOR[item.condition] ?? "text-muted-foreground")}>
                          {item.condition}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {[item.manufacturer, item.model].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {item.serialNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ModuleDrawer
        open={drawerOpen && can("ppe:create")}
        onOpenChange={setDrawerOpen}
        title="Add PPE Item"
        description="Register new personal protective equipment"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-ppe-form"
              type="submit"
              disabled={submitting || !form.name}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Adding..." : "Add Item"}
            </Button>
          </div>
        }
      >
        <form id="create-ppe-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ppe-name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="ppe-name"
              placeholder="e.g. Safety Helmet — Class E"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ppe-category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger id="ppe-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PPE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ppe-manufacturer">Manufacturer</Label>
              <Input id="ppe-manufacturer" placeholder="3M" value={form.manufacturer} onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ppe-model">Model</Label>
              <Input id="ppe-model" placeholder="H-700" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ppe-serial">Serial Number</Label>
            <Input
              id="ppe-serial"
              placeholder="SN-XXXXXXXX"
              value={form.serialNumber}
              onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}
