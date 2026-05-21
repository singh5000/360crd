import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { j as Route, L as Link, w as cn } from "./router-BNkFluS9.js";
import { A as AppShell, U as User } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { B as Badge } from "./badge-DGbn1ykj.js";
import { i as incidentService } from "./incident.service-Cg_BXvXy.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { f as ShieldAlert, e as Building2 } from "./constants-Bl7kXxvf.js";
import { C as Calendar } from "./calendar-CptVSQZ0.js";
import { M as MapPin } from "./map-pin-Dr8rgQ1g.js";
import { T as Tag, C as ClipboardList } from "./tag-lWlhjj2n.js";
import { C as CircleAlert } from "./circle-alert-C3zyU6-i.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
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
import "./index-LBw-IAWe.js";
import "./index-TU15xtvZ.js";
const SEVERITY_COLOR = {
  LOW: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  HIGH: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CRITICAL: "bg-red-500/10 text-red-600 border-red-500/20"
};
const STATUS_COLOR = {
  OPEN: "bg-red-500/10 text-red-600 border-red-500/20",
  INVESTIGATING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20"
};
function MetaItem({
  icon: Icon,
  label,
  value
}) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-sm font-medium text-foreground", children: value })
    ] })
  ] });
}
function IncidentDetailPage() {
  const {
    id
  } = Route.useParams();
  const [incident, setIncident] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [notFound, setNotFound] = reactExports.useState(false);
  reactExports.useEffect(() => {
    incidentService.get(id).then(setIncident).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/incidents", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
      " Back to incidents"
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl lg:col-span-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
      ] })
    ] }) : notFound || !incident ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Incident not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "It may have been removed or the link is invalid." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: incident.refNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight md:text-3xl", children: incident.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[incident.status] ?? "bg-gray-500/10 text-gray-600"), children: incident.status.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", SEVERITY_COLOR[incident.severity] ?? "bg-gray-500/10 text-gray-600"), children: [
                incident.severity,
                " severity"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: incident.type.replace(/_/g, " ") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-xs font-medium px-2.5 py-1 rounded-lg border", incident.priority === "CRITICAL" ? "bg-red-500/10 text-red-600 border-red-500/20" : incident.priority === "HIGH" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20"), children: [
            incident.priority,
            " priority"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Building2, label: "Site", value: incident.site?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: User, label: "Reported By", value: `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: User, label: "Assigned To", value: incident.assignedTo ? `${incident.assignedTo.firstName} ${incident.assignedTo.lastName}` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Calendar, label: "Occurred", value: new Date(incident.occurredAt).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: MapPin, label: "Location", value: incident.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Tag, label: "Category", value: incident.category })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
          incident.description && /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85", children: incident.description })
          ] }),
          incident.capas && incident.capas.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-muted-foreground" }),
              "Corrective Actions (",
              incident.capas.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: incident.capas.map((capa) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: capa.title }),
                capa.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
                  "Due ",
                  new Date(capa.dueDate).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", capa.status === "COMPLETED" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"), children: capa.status })
            ] }, capa.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[incident.status] ?? "bg-gray-500/10 text-gray-600"), children: incident.status.replace(/_/g, " ") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Anonymous" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: incident.isAnonymous ? "Yes" : "No" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Notifiable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: incident.isNotifiable ? "Yes" : "No" })
              ] }),
              incident.evidence && incident.evidence.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Evidence" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  incident.evidence.length,
                  " files"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 pt-3 text-xs text-muted-foreground", children: [
                "Created ",
                new Date(incident.createdAt).toLocaleDateString()
              ] })
            ] })
          ] }),
          incident.customer && /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-muted-foreground" }),
              " Customer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground", children: incident.customer.name })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  IncidentDetailPage as component
};
