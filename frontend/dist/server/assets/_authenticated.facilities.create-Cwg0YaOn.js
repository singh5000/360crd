import { L as jsxRuntimeExports, U as reactExports } from "./worker-entry-hKZhhGaI.js";
import { w as cn, e as FACILITY_TYPES, M as MANAGERS, F as FACILITY_STATUSES, a4 as useNavigate, L as Link, N as facilityStore } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { h as useFormContext, u as useFieldError, b as FormFieldShell, F as Form, f as facilitySchema, c as FormInput, d as FormSelect, C as Controller, a as FormActions } from "./form-schemas-DTUY_JIU.js";
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
function FormTextarea({
  name,
  label,
  description,
  placeholder,
  rows = 4,
  className
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldShell, { name, label, description, error, className, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      id: name,
      rows,
      placeholder,
      "aria-invalid": !!error,
      ...register(name),
      className: cn(
        "w-full rounded-xl border bg-card/40 px-3.5 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground",
        "border-border/70 focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
        error && "border-destructive/70"
      )
    }
  ) });
}
function FacilityForm({
  onSubmit,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Form,
    {
      schema: facilitySchema,
      defaultValues: {
        name: "",
        type: "Office",
        location: "",
        manager: "",
        status: "Active",
        notes: ""
      },
      onSubmit: async (v) => onSubmit({ ...v, type: v.type }),
      children: (form) => {
        const control = form.control;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormInput, { name: "name", label: "Facility Name", autoComplete: "off" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormSelect,
              {
                name: "type",
                label: "Type",
                options: FACILITY_TYPES,
                placeholder: "Select type"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormInput, { name: "location", label: "Location", autoComplete: "off" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormSelect,
              {
                name: "manager",
                label: "Manager",
                options: MANAGERS,
                placeholder: "Select manager"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Controller,
                {
                  control,
                  name: "status",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: FACILITY_STATUSES.map((s) => {
                    const active = field.value === s;
                    const tone = s === "Active" ? "border-success/50 text-success" : "border-warning/50 text-warning";
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
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormTextarea,
              {
                name: "notes",
                label: "Notes",
                placeholder: "Operational notes, certifications, or context for this facility."
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormActions,
            {
              submitLabel: "Add Facility",
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
function CreateFacilityPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = reactExports.useState(false);
  const handleSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 700));
    facilityStore.addFacility({
      name: values.name,
      type: values.type,
      location: values.location,
      manager: values.manager,
      status: values.status,
      notes: values.notes
    });
    setSuccess(true);
    setTimeout(() => navigate({
      to: "/facilities"
    }), 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/facilities", className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to facilities"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight md:text-3xl", children: "Add Facility" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Register a new site so it can be audited, monitored and maintained." })
    ] }),
    success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success ring-1 ring-inset ring-success/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base font-semibold text-foreground", children: "Facility added" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Redirecting to facilities list…" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FacilityForm, { onSubmit: handleSubmit, onCancel: () => navigate({
      to: "/facilities"
    }) }) })
  ] }) });
}
export {
  CreateFacilityPage as component
};
