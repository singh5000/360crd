import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar } from "@/components/shared/FilterBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/feedback")({
  head: () => ({ meta: [{ title: "Feedback · 360CRD" }] }),
  component: AdminFeedbackPage,
});

const STATUS_COLOR: Record<string, string> = {
  OPEN:        "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  RESOLVED:    "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED:      "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "OPEN", label: "Open" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "RESOLVED", label: "Resolved" },
      { value: "CLOSED", label: "Closed" },
    ],
  },
];

function AdminFeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.feedback.list, { limit: 100 });
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
      if (q && !item.subject?.toLowerCase().includes(q) && !item.message?.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const open = items.filter((i) => i.status === "OPEN").length;
  const inProgress = items.filter((i) => i.status === "IN_PROGRESS").length;
  const resolved = items.filter((i) => i.status === "RESOLVED").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Feedback</h1>
            <p className="mt-1 text-sm text-muted-foreground">Customer feedback, complaints and support requests.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "Open", value: open, icon: AlertCircle, color: "text-yellow-500" },
            { label: "In Progress", value: inProgress, icon: Clock, color: "text-blue-500" },
            { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-green-500" },
          ].map((p) => (
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
          searchPlaceholder="Search feedback…"
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No feedback found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "No feedback submitted yet"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Subject</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Type</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">From</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="font-medium">{item.subject ?? item.message?.slice(0, 60) ?? "—"}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status?.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.type ?? "GENERAL"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {item.submittedBy ? `${item.submittedBy.firstName} ${item.submittedBy.lastName}` : item.user?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
