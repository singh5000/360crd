import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { a4 as useNavigate, L as Link, w as cn } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { u as useIncidentStore } from "./incident.store-CblRw8Bo.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { S as Send } from "./send-D1lhRYvj.js";
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
import "./constants-Bl7kXxvf.js";
import "./index-LBw-IAWe.js";
import "./incident.service-Cg_BXvXy.js";
import "./index-TU15xtvZ.js";
import "./index-BQhF8c1W.js";
const INCIDENT_TYPES = ["SAFETY", "ENVIRONMENTAL", "QUALITY", "SECURITY", "NEAR_MISS", "PROPERTY_DAMAGE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const SEVERITY_COLOR = {
  LOW: "border-muted-foreground/40 text-muted-foreground",
  MEDIUM: "border-blue-500/50 text-blue-600",
  HIGH: "border-yellow-500/50 text-yellow-600",
  CRITICAL: "border-red-500/50 text-red-600"
};
function FieldLabel({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5", children });
}
function CreateIncidentPage() {
  const navigate = useNavigate();
  const {
    createIncident
  } = useIncidentStore();
  const [success, setSuccess] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [type, setType] = reactExports.useState("SAFETY");
  const [severity, setSeverity] = reactExports.useState("MEDIUM");
  const [priority, setPriority] = reactExports.useState("MEDIUM");
  const [occurredAt, setOccurredAt] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 16));
  const [location, setLocation] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createIncident({
        title: title.trim(),
        description: description.trim() || void 0,
        type,
        severity,
        priority,
        occurredAt: new Date(occurredAt).toISOString(),
        location: location.trim() || void 0
      });
      setSuccess(true);
      setTimeout(() => navigate({
        to: "/incidents"
      }), 1500);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/incidents", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to incidents"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight md:text-3xl", children: "Report Incident" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Document what happened, classify severity, and notify the right team." })
    ] }),
    success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-600 ring-1 ring-inset ring-green-500/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Incident reported" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Redirecting to incidents list…" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Incident Title *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Brief description of the incident", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "What happened, where and when. Include any immediate actions taken.", rows: 4 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Type *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: INCIDENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t.replace(/_/g, " ") }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Date & Time Occurred *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: occurredAt, onChange: (e) => setOccurredAt(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Building, area or coordinates" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: SEVERITIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSeverity(s), className: cn("h-11 rounded-xl border text-sm font-medium transition-all", severity === s ? cn(SEVERITY_COLOR[s], "bg-foreground/[0.03] shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_12%,transparent)]") : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"), children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: PRIORITIES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPriority(p), className: cn("h-11 rounded-xl border text-sm font-medium transition-all", priority === p ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]" : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"), children: p }, p)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 border-t border-border/60 pt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate({
          to: "/incidents"
        }), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting || !title.trim(), className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          submitting ? "Submitting…" : "Report Incident"
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  CreateIncidentPage as component
};
