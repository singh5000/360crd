import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RefreshCw, BookOpen, Users, Award, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_authenticated/admin/inductions")({
  head: () => ({ meta: [{ title: "Inductions · 360CRD" }] }),
  component: InductionsPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "bg-gray-500/10 text-gray-600 border-gray-500/20",
  PUBLISHED: "bg-green-500/10 text-green-600 border-green-500/20",
  ARCHIVED:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "DRAFT", label: "Draft" },
      { value: "PUBLISHED", label: "Published" },
      { value: "ARCHIVED", label: "Archived" },
    ],
  },
];

const EMPTY_FORM = { title: "", description: "", passingScore: "80" };

function InductionsPage() {
  const [items, setItems] = useState<any[]>([]);
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
      const res = await apiClient.get<any>(ENDPOINTS.inductions.list, { limit: 100 });
      setItems(res.data ?? []);
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
      if (q && !item.title.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total", value: items.length, icon: BookOpen, color: "text-foreground" },
    { label: "Published", value: items.filter((i) => i.status === "PUBLISHED").length, icon: Award, color: "text-green-500" },
    { label: "Enrollments", value: items.reduce((sum: number, i: any) => sum + (i._count?.enrollments ?? 0), 0), icon: Users, color: "text-blue-500" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.inductions.create, {
        title: form.title,
        description: form.description || undefined,
        passingScore: form.passingScore ? Number(form.passingScore) : undefined,
      });
      toast.success("Induction program created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create induction");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Inductions</h1>
            <p className="mt-1 text-sm text-muted-foreground">Site and role-based induction programs for new personnel.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("induction:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> New Induction
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
          searchPlaceholder="Search inductions..."
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No induction programs found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Create your first induction program to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("induction:create") && (
              <Button size="sm" className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground" onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4" /> New Induction
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Site</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Passing Score</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Enrollments</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id} className="border-border/60 cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{item.site?.name ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {item.passingScore != null ? `${item.passingScore}%` : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item._count?.enrollments ?? 0}
                      </span>
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
        open={drawerOpen && can("induction:create")}
        onOpenChange={setDrawerOpen}
        title="New Induction Program"
        description="Create a site or role-based induction"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-induction-form"
              type="submit"
              disabled={submitting || !form.title}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Creating..." : "Create Induction"}
            </Button>
          </div>
        }
      >
        <form id="create-induction-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="induction-title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="induction-title"
              placeholder="e.g. Site Safety Induction — Warehouse"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="induction-passing">Passing Score (%)</Label>
            <Input
              id="induction-passing"
              type="number"
              min={0}
              max={100}
              placeholder="80"
              value={form.passingScore}
              onChange={(e) => setForm((f) => ({ ...f, passingScore: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="induction-desc">Description</Label>
            <Textarea
              id="induction-desc"
              placeholder="Describe the induction scope and requirements..."
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

