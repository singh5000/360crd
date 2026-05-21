import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useNotificationStore } from "@/lib/stores/notification.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SurfaceCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications · 360CRD" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, loading, unreadCount, fetchNotifications, markRead, markAllRead, remove } = useNotificationStore();

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all read
            </Button>
          )}
        </div>

        {loading && notifications.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : notifications.length === 0 ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16">
            <Bell className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">You're all caught up!</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                  n.readAt
                    ? "border-border/40 bg-card/30"
                    : "border-primary/20 bg-primary/5",
                )}
              >
                <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", n.readAt ? "bg-transparent" : "bg-primary")} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">
                    {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.readAt && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => markRead(n.id)} title="Mark as read">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(n.id)} title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

