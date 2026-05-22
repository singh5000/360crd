import { L as jsxRuntimeExports, U as reactExports } from "./worker-entry-hKZhhGaI.js";
import { C as COMPANY_INDUSTRIES, b as COMPANY_PLANS, w as cn, c as COMPANY_STATUSES, a4 as useNavigate, L as Link, x as companyStore } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { F as Form, e as companySchema, c as FormInput, d as FormSelect, C as Controller, a as FormActions } from "./form-schemas-DTUY_JIU.js";
import { S as Send } from "./send-D1lhRYvj.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
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
import "./loader-circle-CMZ_gZVG.js";
function CompanyForm({
  onSubmit,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Form,
    {
      schema: companySchema,
      defaultValues: { name: "", industry: "", plan: "Pro", status: "Active" },
      onSubmit: async (v) => onSubmit({ ...v, industry: v.industry }),
      children: (form) => {
        const control = form.control;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormInput, { name: "name", label: "Company Name", autoComplete: "off" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormSelect,
              {
                name: "industry",
                label: "Industry",
                options: COMPANY_INDUSTRIES,
                placeholder: "Select industry"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Subscription Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Controller,
                {
                  control,
                  name: "plan",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: COMPANY_PLANS.map((p) => {
                    const active = field.value === p;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => field.onChange(p),
                        className: cn(
                          "h-12 rounded-xl border text-sm font-medium transition-all",
                          active ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]" : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                        ),
                        children: p
                      },
                      p
                    );
                  }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Controller,
                {
                  control,
                  name: "status",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: COMPANY_STATUSES.map((s) => {
                    const active = field.value === s;
                    const tone = s === "Active" ? "border-success/50 text-success" : "border-destructive/50 text-destructive";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => field.onChange(s),
                        className: cn(
                          "h-12 rounded-xl border text-sm font-medium transition-all",
                          active ? cn(tone, "bg-foreground/[0.03] shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_12%,transparent)]") : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                        ),
                        children: s
                      },
                      s
                    );
                  }) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormActions,
            {
              submitLabel: "Add Company",
              submittingLabel: "Saving…",
              onCancel,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
            }
          )
        ] });
      }
    }
  );
}
function CreateCompanyPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = reactExports.useState(false);
  const handleSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 700));
    companyStore.addCompany({
      name: values.name,
      industry: values.industry,
      plan: values.plan,
      status: values.status
    });
    setSuccess(true);
    setTimeout(() => navigate({
      to: "/companies"
    }), 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/companies", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to companies"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight md:text-3xl", children: "Add Company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Onboard a new tenant with plan, industry and initial status." })
    ] }),
    success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success ring-1 ring-inset ring-success/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Company added" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Redirecting to companies list…" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyForm, { onSubmit: handleSubmit, onCancel: () => navigate({
      to: "/companies"
    }) }) })
  ] }) });
}
export {
  CreateCompanyPage as component
};
