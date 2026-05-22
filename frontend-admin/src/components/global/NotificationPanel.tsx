import { useEffect } from "react";
import { Bell, Check, ClipboardCheck, ShieldAlert, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { notificationStore, useNotifications, type NotificationType } from "@/lib/notification-store";

const ICON: Record<NotificationType, typeof Bell> = {
  audit: ClipboardCheck,
  incident: ShieldAlert,
  maintenance: Wrench,
};

const TONE: Record<NotificationType, string> = {
  audit: "bg-info/10 text-info ring-info/20",
  incident: "bg-destructive/10 text-destructive ring-destructive/20",
  maintenance: "bg-warning/10 text-warning ring-warning/20",
};

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useNotifications();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" aria-modal>
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border/60 bg-card shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold tracking-tight">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={notificationStore.markAllRead}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={notificationStore.clearAll}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
                <Bell className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">You're all caught up</p>
              <p className="mt-1 text-xs text-muted-foreground">New notifications will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((n) => {
                const Icon = ICON[n.type];
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group flex items-start gap-3 rounded-xl border border-border/50 p-3 transition-colors",
                      n.read ? "bg-card" : "bg-accent/40",
                    )}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset", TONE[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{n.time}</span>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => notificationStore.markRead(n.id)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                          >
                            <Check className="h-3 w-3" /> Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
