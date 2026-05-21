import { k as createLucideIcon, b as Activity, e as Building2 } from "./constants-Bl7kXxvf.js";
import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { Z as useActivityLogs, a1 as useCompanies, w as cn, B as create, q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
import { S as Search, X, f as StatusBadge, L as LogOut, U as User, G as Globe } from "./AppShell-CYz6-NtT.js";
import { E as Eye } from "./eye-C01Vu7q5.js";
import { T as ToggleLeft, a as ToggleRight } from "./toggle-right-CeggEEHh.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
import { T as Trash2 } from "./trash-2-Cz8eoZhE.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, e as SheetTitle } from "./sheet-BVXXTVLX.js";
import { C as Clock } from "./clock-kYCucZdt.js";
import { L as Laptop } from "./laptop-C_oDjGx0.js";
const __iconNode$4 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$4);
const __iconNode$3 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
];
const List = createLucideIcon("list", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$1);
const __iconNode = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PencilLine = createLucideIcon("pencil-line", __iconNode);
const ACTIVITY_MODULES = [
  "Audits",
  "Incidents",
  "Facilities",
  "Companies",
  "Users",
  "Settings",
  "Auth"
];
const ACTIVITY_ACTIONS = [
  "created",
  "updated",
  "deleted",
  "status_changed",
  "escalated",
  "enabled",
  "disabled",
  "login",
  "logout"
];
const actionTone = {
  created: "success",
  updated: "info",
  deleted: "danger",
  status_changed: "warning",
  escalated: "danger",
  enabled: "success",
  disabled: "neutral",
  login: "info",
  logout: "neutral"
};
function ActivityFilters({ value, onChange }) {
  const logs = useActivityLogs();
  const companies = useCompanies();
  const users = reactExports.useMemo(() => Array.from(new Set(logs.map((l) => l.user))).sort(), [logs]);
  const set = (patch) => onChange({ ...value, ...patch });
  const hasFilters = value.search || value.module !== "All" || value.user !== "All" || value.companyId !== "All" || value.action !== "All" || value.from || value.to;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 -mx-1 rounded-2xl border border-border/60 bg-card/70 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[220px] flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: value.search,
          onChange: (e) => set({ search: e.target.value }),
          placeholder: "Search by event, target or user…",
          className: "h-10 w-full rounded-xl border border-border/70 bg-card/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { label: "Module", value: value.module, onChange: (v) => set({ module: v }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All modules" }),
      ACTIVITY_MODULES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { label: "Action", value: value.action, onChange: (v) => set({ action: v }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All actions" }),
      ACTIVITY_ACTIONS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a.replace("_", " ") }, a))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { label: "User", value: value.user, onChange: (v) => set({ user: v }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All users" }),
      users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: u, children: u }, u))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { label: "Company", value: value.companyId, onChange: (v) => set({ companyId: v }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All companies" }),
      companies.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DateInput, { value: value.from, onChange: (v) => set({ from: v }), placeholder: "From" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DateInput, { value: value.to, onChange: (v) => set({ to: v }), placeholder: "To" }),
    hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange({ search: "", module: "All", user: "All", companyId: "All", action: "All", from: "", to: "" }),
        className: "inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
          " Clear"
        ]
      }
    )
  ] }) });
}
function Select({
  value,
  onChange,
  children,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      "aria-label": label,
      value,
      onChange: (e) => onChange(e.target.value),
      className: cn(
        "h-10 rounded-xl border border-border/70 bg-card/40 px-3 text-sm text-foreground transition-colors",
        "focus:border-primary/70 focus:outline-none"
      ),
      children
    }
  );
}
function DateInput({ value, onChange, placeholder }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "date",
      "aria-label": placeholder,
      value,
      onChange: (e) => onChange(e.target.value),
      className: "h-10 rounded-xl border border-border/70 bg-card/40 px-3 text-sm text-foreground focus:border-primary/70 focus:outline-none"
    }
  );
}
function fmt(iso) {
  const d = new Date(iso);
  return d.toLocaleString(void 0, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ActivityTable({ logs, onSelect }) {
  if (logs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No activity matches your filters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Adjust the filters above to see more events." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 [background:var(--gradient-card)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[640px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10 bg-card/80 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "User" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Module" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Action" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Target" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Timestamp" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Details" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: logs.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-border/40 transition-colors last:border-0 hover:bg-accent/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: l.id.slice(-8) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground/90", children: l.user }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: l.module }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: actionTone[l.action], children: l.action.replace("_", " ") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground/90", children: l.targetLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: l.companyName ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: fmt(l.timestamp) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSelect(l),
              className: cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium",
                "text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
                " View"
              ]
            }
          ) })
        ]
      },
      l.id
    )) })
  ] }) }) });
}
const iconMap = {
  created: Plus,
  updated: PencilLine,
  deleted: Trash2,
  status_changed: ArrowUpRight,
  escalated: TriangleAlert,
  enabled: ToggleRight,
  disabled: ToggleLeft,
  login: LogIn,
  logout: LogOut
};
function relative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
function dayLabel(iso) {
  const d = new Date(iso);
  const today = /* @__PURE__ */ new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yest = /* @__PURE__ */ new Date();
  yest.setDate(today.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  if (isToday) return "Today";
  if (isYest) return "Yesterday";
  return d.toLocaleDateString(void 0, { weekday: "long", month: "short", day: "numeric" });
}
function ActivityTimeline({ logs, onSelect }) {
  const groups = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    logs.forEach((l) => {
      const key = dayLabel(l.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(l);
    });
    return Array.from(map.entries());
  }, [logs]);
  if (logs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No events to display" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: day }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative space-y-3 border-l border-border/60 pl-6", children: items.map((l) => {
      const Icon = iconMap[l.action] ?? Activity;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onSelect(l),
            className: "group flex w-full flex-col gap-1.5 rounded-xl border border-border/60 bg-card/60 p-3.5 text-left transition-all hover:border-border hover:bg-accent/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: actionTone[l.action], children: l.action.replace("_", " ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: l.module })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: relative(l.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90", children: l.summary }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                " ",
                l.user,
                l.companyName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "· ",
                  l.companyName
                ] })
              ] })
            ]
          }
        )
      ] }, l.id);
    }) })
  ] }, day)) });
}
function ActivityDetailsDrawer({ log, onClose }) {
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && log) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [log, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!log, onOpenChange: (o) => !o ? onClose() : null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "right", className: "w-full overflow-y-auto p-0 sm:max-w-xl", children: log && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "space-y-3 border-b border-border/60 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: actionTone[log.action], children: log.action.replace("_", " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: log.module })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-left text-lg font-semibold tracking-tight", children: log.summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground", children: [
        "Event ID · ",
        log.id
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: User, label: "User", value: `${log.user}${log.userEmail ? ` · ${log.userEmail}` : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: Building2, label: "Company", value: log.companyName ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: Clock, label: "Timestamp", value: new Date(log.timestamp).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: Globe, label: "IP address", value: log.metadata?.ip ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: Laptop, label: "Device", value: log.metadata?.device ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: User, label: "Target", value: log.targetLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Diff, { before: log.before, after: log.after })
    ] })
  ] }) }) });
}
function Meta({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-sm text-foreground/90", children: value })
  ] });
}
function Diff({ before, after }) {
  if (!before && !after) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "State change" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DiffPanel, { title: "Before", data: before, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DiffPanel, { title: "After", data: after, tone: "success" })
    ] })
  ] });
}
function DiffPanel({ title, data, tone }) {
  const ring = tone === "danger" ? "border-destructive/40 bg-destructive/5" : "border-emerald-500/40 bg-emerald-500/5";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border ${ring} p-3`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: title }),
    data && Object.keys(data).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-foreground/90", children: JSON.stringify(data, null, 2) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs italic text-muted-foreground", children: "— empty —" })
  ] });
}
const MODULE_MAP = {
  incidents: "Incidents",
  audits: "Audits",
  sites: "Facilities",
  facilities: "Facilities",
  customers: "Companies",
  companies: "Companies",
  users: "Users",
  settings: "Settings",
  auth: "Auth"
};
const ACTION_MAP = {
  create: "created",
  created: "created",
  update: "updated",
  updated: "updated",
  delete: "deleted",
  deleted: "deleted",
  login: "login",
  logout: "logout",
  status_change: "status_changed",
  escalate: "escalated",
  enable: "enabled",
  disable: "disabled"
};
function mapBackendLog(item) {
  const resource = (item.resource ?? "system").toLowerCase();
  const action = (item.action ?? "updated").toLowerCase();
  const userName = item.user ? `${item.user.firstName ?? ""} ${item.user.lastName ?? ""}`.trim() : "System";
  const targetId = item.resourceId ?? item.id;
  const shortId = typeof targetId === "string" ? targetId.slice(0, 8) : String(targetId);
  return {
    id: item.id,
    timestamp: item.createdAt,
    user: userName || "System",
    module: MODULE_MAP[resource] ?? "Settings",
    action: ACTION_MAP[action] ?? "updated",
    targetId,
    targetLabel: `${resource.toUpperCase()}-${shortId}`,
    summary: `${ACTION_MAP[action] ?? action} ${resource} ${shortId}`,
    metadata: item.ipAddress ? { ip: item.ipAddress } : void 0
  };
}
const useActivityStore = create((set) => ({
  logs: [],
  loading: false,
  initialized: false,
  total: 0,
  fetchLogs: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await apiClient.get(
        ENDPOINTS.activity.list,
        { limit: 100, ...params }
      );
      const logs = (res.data ?? []).map(mapBackendLog);
      set({ logs, total: res.meta?.total ?? logs.length, loading: false, initialized: true });
    } catch {
      set({ loading: false, initialized: true });
    }
  }
}));
export {
  ActivityDetailsDrawer as A,
  LayoutGrid as L,
  ActivityFilters as a,
  ActivityTable as b,
  ActivityTimeline as c,
  List as d,
  useActivityStore as u
};
