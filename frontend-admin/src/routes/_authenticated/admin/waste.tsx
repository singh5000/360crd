import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RefreshCw, Recycle, Scale, DollarSign, ChevronRight } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/admin/waste")({
  head: () => ({ meta: [{ title: "Waste · 360CRD" }] }),
  component: WastePage,
});

const STATUS_COLOR: Record<string, string> = {
  PENDING:  "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  DISPOSED: "bg-green-500/10 text-green-600 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const WASTE_CATEGORIES = ["HAZARDOUS", "NON_HAZARDOUS", "RECYCLABLE", "ELECTRONIC", "ORGANIC", "LIQUID", "OTHER"];
const WASTE_UNITS = ["KG", "LITRES", "UNITS", "TONNES", "M3"];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "DISPOSED", label: "Disposed" },
      { value: "REJECTED", label: "Rejected" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: WASTE_CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, " ") })),
  },
];

const EMPTY_FORM = { wasteType: "", category: "NON_HAZARDOUS", quantity: "", unit: "KG", disposedAt: "" };

function WastePage() {
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
        apiClient.get<any>(ENDPOINTS.waste.list, { limit: 100 }),
        apiClient.get<any>(ENDPOINTS.waste.stats),
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
      if (q && !item.wasteType.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && item.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total Records", value: stats?.total ?? items.length, icon: Recycle, color: "text-foreground" },
    { label: "Quantity (kg)", value: stats?.totalQuantity ? stats.totalQuantity.toFixed(1) : "—", icon: Scale, color: "text-blue-500" },
    { label: "Est. Cost", value: stats?.totalCost ? `$${stats.totalCost.toFixed(0)}` : "—", icon: DollarSign, color: "text-green-500" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.waste.create, {
        wasteType: form.wasteType,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        disposedAt: form.disposedAt || undefined,
      });
      toast.success("Waste record created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create waste record");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Waste Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track and manage waste disposal records.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("waste:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Log Waste
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
          searchPlaceholder="Search waste records..."
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
            <Recycle className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No waste records found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Log your first waste disposal record"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Waste Type</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Quantity</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Site</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Date</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id} className="border-border/60 cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-medium">{item.wasteType}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.category?.replace(/_/g, " ") ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{item.site?.name ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(item.disposedAt ?? item.createdAt).toLocaleDateString()}
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

      <ModuleDrawer
        open={drawerOpen && can("waste:create")}
        onOpenChange={setDrawerOpen}
        title="Log Waste Record"
        description="Record a waste disposal event"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-waste-form"
              type="submit"
              disabled={submitting || !form.wasteType || !form.quantity}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Logging..." : "Log Waste"}
            </Button>
          </div>
        }
      >
        <form id="create-waste-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="waste-type">Waste Type <span className="text-red-500">*</span></Label>
            <Input
              id="waste-type"
              placeholder="e.g. Chemical Solvent"
              value={form.wasteType}
              onChange={(e) => setForm((f) => ({ ...f, wasteType: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste-category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger id="waste-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {WASTE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waste-qty">Quantity <span className="text-red-500">*</span></Label>
              <Input
                id="waste-qty"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waste-unit">Unit</Label>
              <Select value={form.unit} onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}>
                <SelectTrigger id="waste-unit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WASTE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste-date">Disposal Date</Label>
            <Input
              id="waste-date"
              type="date"
              value={form.disposedAt}
              onChange={(e) => setForm((f) => ({ ...f, disposedAt: e.target.value }))}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}

