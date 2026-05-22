import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, C as Check } from "./AppShell-CYz6-NtT.js";
import { u as useNotificationStore, C as CheckCheck } from "./notification.store-5NubKUgn.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { w as cn } from "./router-BNkFluS9.js";
import { B as Bell } from "./constants-Bl7kXxvf.js";
import { T as Trash2 } from "./trash-2-Cz8eoZhE.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-LBw-IAWe.js";
import "./index-TU15xtvZ.js";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "net";
import "tls";
import "assert";
import "os";
import "events";
import "http2";
import "zlib";
function NotificationsPage() {
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markRead,
    markAllRead,
    remove
  } = useNotificationStore();
  reactExports.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Notifications" }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          unreadCount,
          " unread"
        ] })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: markAllRead, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-4 w-4 mr-1.5" }),
        " Mark all read"
      ] })
    ] }),
    loading && notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, i)) }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-10 w-10 text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "You're all caught up!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors", n.readAt ? "border-border/40 bg-card/30" : "border-primary/20 bg-primary/5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", n.readAt ? "bg-transparent" : "bg-primary") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: n.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: n.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[10px] text-muted-foreground/60", children: [
          new Date(n.createdAt).toLocaleDateString(),
          " ",
          new Date(n.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
        !n.readAt && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => markRead(n.id), title: "Mark as read", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7 text-muted-foreground hover:text-destructive", onClick: () => remove(n.id), title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, n.id)) })
  ] }) });
}
export {
  NotificationsPage as component
};
