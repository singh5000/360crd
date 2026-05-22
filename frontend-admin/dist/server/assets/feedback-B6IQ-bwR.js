import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { M as MessageSquare } from "./constants-Bl7kXxvf.js";
import { S as Send } from "./send-D1lhRYvj.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-LBw-IAWe.js";
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
import "./index-TU15xtvZ.js";
import "./sheet-BVXXTVLX.js";
import "./index-BYUMqYpj.js";
const STATUS_COLOR = {
  OPEN: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20"
};
const EMPTY_FORM = {
  subject: "",
  message: "",
  type: "GENERAL"
};
function PortalFeedbackPage() {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get(ENDPOINTS.feedback.my);
      setItems(res.data ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.feedback.create, {
        subject: form.subject,
        message: form.message,
        type: form.type
      });
      toast.success("Feedback submitted successfully");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[900px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Feedback & Support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Submit queries, complaints or feedback." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Request"
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 3
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No feedback submitted yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: 'Click "New Request" to get in touch' }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Request"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: item.subject ?? "General Feedback" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: item.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[10px] text-muted-foreground/60", children: new Date(item.createdAt).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600"), children: item.status?.replace(/_/g, " ") })
      ] }) }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, title: "Submit Feedback", description: "Share your feedback, query or complaint", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { form: "feedback-form", type: "submit", disabled: submitting || !form.message, className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
        submitting ? "Submitting…" : "Submit"
      ] })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "feedback-form", onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fb-subject", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fb-subject", placeholder: "Brief description of your query", value: form.subject, onChange: (e) => setForm((f) => ({
          ...f,
          subject: e.target.value
        })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "fb-message", children: [
          "Message ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "fb-message", placeholder: "Describe your feedback or issue in detail…", rows: 5, required: true, value: form.message, onChange: (e) => setForm((f) => ({
          ...f,
          message: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  PortalFeedbackPage as component
};
