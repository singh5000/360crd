import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Webhook, Plus, CheckCircle, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SurfaceCard } from "@/components/shared/Card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/webhooks")({
  head: () => ({ meta: [{ title: "Webhooks · 360CRD" }] }),
  component: WebhooksPage,
});

function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.webhooks.list);
      setWebhooks(res.data ?? []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Webhooks</h1>
            <p className="mt-1 text-sm text-muted-foreground">Configure outbound webhooks for real-time event notifications.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : webhooks.length === 0 ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16">
            <Webhook className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No webhooks configured</p>
            <p className="mt-1 text-xs text-muted-foreground">Add a webhook endpoint to receive real-time event notifications.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-3">
            {webhooks.map((wh: any) => (
              <div key={wh.id} className="flex items-start gap-4 rounded-lg border border-border/60 bg-card/50 px-4 py-3">
                <div className="mt-0.5">
                  {wh.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{wh.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{wh.url}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wh.events?.slice(0, 4).map((e: string) => (
                      <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>
                    ))}
                    {wh.events?.length > 4 && (
                      <Badge variant="outline" className="text-[10px]">+{wh.events.length - 4}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {wh._count?.logs ?? 0} deliveries
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

