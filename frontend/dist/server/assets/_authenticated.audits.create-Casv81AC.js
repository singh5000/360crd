import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { a4 as useNavigate, L as Link } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { u as useAuditStore } from "./audit.store-RbeqPsCg.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { S as Save } from "./save-BXfLpzUX.js";
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
import "./index-TU15xtvZ.js";
import "./index-BQhF8c1W.js";
const AUDIT_TYPES = ["INTERNAL", "EXTERNAL", "SUPPLIER", "REGULATORY", "ISO9001", "ISO14001", "ISO45001", "CUSTOM"];
function FieldLabel({
  children,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5", children: [
    children,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-red-500", children: "*" })
  ] });
}
function CreateAuditPage() {
  const navigate = useNavigate();
  const {
    createAudit
  } = useAuditStore();
  const [success, setSuccess] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [type, setType] = reactExports.useState("INTERNAL");
  const [scheduledAt, setScheduledAt] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createAudit({
        title: title.trim(),
        description: description.trim() || void 0,
        type,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : void 0,
        dueDate: dueDate ? new Date(dueDate).toISOString() : void 0
      });
      setSuccess(true);
      setTimeout(() => navigate({
        to: "/audits"
      }), 1500);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to audits"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight md:text-3xl", children: "Create Audit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Define scope, assign an auditor and schedule the engagement." })
    ] }),
    success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-600 ring-1 ring-inset ring-green-500/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Audit created" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Redirecting to audits list…" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { required: true, children: "Audit Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Q2 ISO 9001 Internal Audit", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe scope, objectives, and reference standards", rows: 4 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { required: true, children: "Audit Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: AUDIT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t.replace(/_/g, " ") }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Scheduled Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: scheduledAt, onChange: (e) => setScheduledAt(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Due Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 border-t border-border/60 pt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate({
          to: "/audits"
        }), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting || !title.trim(), className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          submitting ? "Creating…" : "Create Audit"
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  CreateAuditPage as component
};
