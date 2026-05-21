import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { k as Route, L as Link, w as cn } from "./router-BNkFluS9.js";
import { A as AppShell, U as User } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { s as siteService } from "./site.service-BcxgnHEC.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { e as Building2, W as Warehouse, C as ClipboardCheck } from "./constants-Bl7kXxvf.js";
import { M as MapPin } from "./map-pin-Dr8rgQ1g.js";
import { P as Phone } from "./phone-ATxLo5H7.js";
import { M as Mail } from "./mail-3ZyUvTlO.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
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
const STATUS_COLOR = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED: "bg-red-500/10 text-red-600 border-red-500/20"
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
function StatCard({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex items-center gap-4 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] });
}
function FacilityDetailPage() {
  const {
    id
  } = Route.useParams();
  const [site, setSite] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [notFound, setNotFound] = reactExports.useState(false);
  reactExports.useEffect(() => {
    siteService.get(id).then(setSite).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/facilities", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
      " Back to sites"
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) })
    ] }) : notFound || !site ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Site not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "It may have been removed or the link is invalid." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-6 w-6 text-primary/70" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: site.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: site.code })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600"), children: site.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground", children: site.type })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: MapPin, label: "Address", value: [site.address, site.city, site.state, site.country].filter(Boolean).join(", ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Building2, label: "Customer", value: site.customer?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: User, label: "Contact", value: site.contactName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Phone, label: "Phone", value: site.contactPhone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Mail, label: "Email", value: site.contactEmail }),
          site.capacity && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaItem, { icon: Warehouse, label: "Capacity", value: String(site.capacity) })
        ] })
      ] }),
      site._count && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Incidents", value: site._count.incidents, icon: TriangleAlert }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Audits", value: site._count.audits, icon: ClipboardCheck }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Users", value: site._count.users, icon: User })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3", children: [
          site.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: site.address })
          ] }),
          site.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: site.city })
          ] }),
          site.state && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "State / Region" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: site.state })
          ] }),
          site.country && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Country" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: site.country })
          ] }),
          site.postalCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Postal Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: site.postalCode })
          ] }),
          site.latitude && site.longitude && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Coordinates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-foreground", children: [
              site.latitude,
              ", ",
              site.longitude
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground", children: [
          "Created ",
          new Date(site.createdAt).toLocaleDateString(),
          " · Updated ",
          new Date(site.updatedAt).toLocaleDateString()
        ] })
      ] })
    ] })
  ] }) });
}
export {
  FacilityDetailPage as component
};
