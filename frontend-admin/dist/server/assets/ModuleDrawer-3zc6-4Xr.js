import { L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { S as Sheet, d as SheetPortal, c as SheetOverlay, a as SheetContent } from "./sheet-BVXXTVLX.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { w as cn } from "./router-BNkFluS9.js";
import { X } from "./AppShell-CYz6-NtT.js";
const SIZE_CLASSES = {
  sm: "w-full sm:max-w-[420px]",
  md: "w-full sm:max-w-[560px]",
  lg: "w-full sm:max-w-[680px]",
  xl: "w-full sm:max-w-[820px]"
};
function ModuleDrawer({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  hideFooter
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, { className: "bg-black/40 backdrop-blur-[2px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        side: "right",
        className: cn(
          SIZE_CLASSES[size],
          "flex flex-col gap-0 p-0 border-l border-border/60 bg-background shadow-2xl"
        ),
        onInteractOutside: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-border/60 px-6 py-4 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold tracking-tight text-foreground", children: title }),
              description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onOpenChange(false),
                className: "shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-5", children }),
          !hideFooter && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-t border-border/60 bg-muted/30 px-6 py-4", children: footer ?? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Close" }) }) })
        ]
      }
    )
  ] }) });
}
export {
  ModuleDrawer as M
};
