import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Archive, Plus, Download, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SurfaceCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/reports")({
  head: () => ({ meta: [{ title: "Reports · 360CRD" }] }),
  component: ReportsPage,
});

const REPORT_TYPES = [
  { value: "INCIDENT_SUMMARY", label: "Incident Summary" },
  { value: "AUDIT_SUMMARY", label: "Audit Summary" },
  { value: "TRAINING_COMPLETION", label: "Training Completion" },
  { value: "PPE_INVENTORY", label: "PPE Inventory" },
  { value: "WASTE_SUMMARY", label: "Waste Summary" },
  { value: "COMPLIANCE_STATUS", label: "Compliance Status" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
};

function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.reports.list, { limit: 20 });
      setReports(res.data ?? []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function generate(type: string, label: string) {
    setGenerating(type);
    try {
      await apiClient.post<any>(ENDPOINTS.reports.create, {
        title: `${label} - ${new Date().toLocaleDateString()}`,
        type,
        parameters: {},
        filters: {},
      });
      toast.success(`${label} report requested — it will be ready shortly`);
      setTimeout(load, 2000);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">Generate and download compliance reports.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>

        {/* Report generators */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Generate Report</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {REPORT_TYPES.map((rt) => (
              <Button
                key={rt.value}
                variant="outline"
                className="h-auto flex-col gap-1.5 py-4"
                onClick={() => generate(rt.value, rt.label)}
                disabled={generating !== null}
              >
                {generating === rt.value ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Plus className="h-5 w-5 text-primary" />
                )}
                <span className="text-xs font-medium">{rt.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Recent Reports</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : reports.length === 0 ? (
            <SurfaceCard className="flex flex-col items-center justify-center py-12">
              <Archive className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium">No reports generated yet</p>
            </SurfaceCard>
          ) : (
            <div className="space-y-2">
              {reports.map((r: any) => (
                <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 px-4 py-3">
                  <Archive className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.type?.replace(/_/g, " ")} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[r.status] ?? "bg-gray-500/10 text-gray-600")}>
                      {r.status}
                    </span>
                    {r.status === "COMPLETED" && r.fileUrl && (
                      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                        <Download className="h-3 w-3" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

