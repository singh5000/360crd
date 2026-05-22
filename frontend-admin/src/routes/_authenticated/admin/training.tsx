import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RefreshCw, BookOpen, Users, Award, Clock } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/admin/training")({
  head: () => ({ meta: [{ title: "Training · 360CRD" }] }),
  component: TrainingPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "bg-gray-500/10 text-gray-600 border-gray-500/20",
  PUBLISHED: "bg-green-500/10 text-green-600 border-green-500/20",
  ARCHIVED:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const CATEGORIES = ["SAFETY", "COMPLIANCE", "OPERATIONS", "LEADERSHIP", "TECHNICAL", "OTHER"];

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
  {
    key: "category",
    label: "Category",
    options: CATEGORIES.map((c) => ({ value: c, label: c })),
  },
];

const EMPTY_FORM = { title: "", description: "", category: "SAFETY", durationMinutes: "" };

function TrainingPage() {
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
        apiClient.get<any>(ENDPOINTS.training.list, { limit: 100 }),
        apiClient.get<any>(ENDPOINTS.training.stats),
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
    return items.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && t.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && t.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total", value: stats?.total ?? items.length, icon: BookOpen, color: "text-foreground" },
    { label: "Published", value: stats?.published ?? items.filter((t) => t.status === "PUBLISHED").length, icon: Award, color: "text-green-500" },
    { label: "Enrollments", value: stats?.totalEnrollments ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Completion", value: stats?.completionRate ? `${stats.completionRate}%` : "—", icon: Clock, color: "text-primary" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.training.create, {
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
      });
      toast.success("Training program created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create training");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Training</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage safety and compliance training programs.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("training:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> New Training
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

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search training programs..."
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
            <p className="mt-4 text-sm font-medium">No training programs found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Create your first training program to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && (
              <Button size="sm" className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground" onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4" /> New Training
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
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Duration</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Enrollments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t: any) => (
                  <TableRow key={t.id} className="border-border/60 cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[t.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {t.category ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {t.durationMinutes ? `${t.durationMinutes} min` : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t._count?.enrollments ?? 0}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ModuleDrawer
        open={drawerOpen && can("training:create")}
        onOpenChange={setDrawerOpen}
        title="New Training Program"
        description="Create a new training or compliance program"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-training-form"
              type="submit"
              disabled={submitting || !form.title}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Creating..." : "Create Program"}
            </Button>
          </div>
        }
      >
        <form id="create-training-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="training-title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="training-title"
              placeholder="e.g. Manual Handling Safety"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training-category">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger id="training-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-duration">Duration (minutes)</Label>
              <Input
                id="training-duration"
                type="number"
                placeholder="60"
                min={1}
                value={form.durationMinutes}
                onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-desc">Description</Label>
            <Textarea
              id="training-desc"
              placeholder="Describe the training objectives and content..."
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

