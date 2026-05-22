import { L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { w as cn } from "./router-BNkFluS9.js";
import { k as createLucideIcon } from "./constants-Bl7kXxvf.js";
import { S as Search, X } from "./AppShell-CYz6-NtT.js";
const __iconNode = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
function FilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  values = {},
  onFilterChange,
  onClear,
  className,
  extra
}) {
  const activeCount = (search ? 1 : 0) + filters.filter((f) => values[f.key] && values[f.key] !== "ALL").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2.5",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground/60" }),
        onSearchChange && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[180px] flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: search,
              onChange: (e) => onSearchChange(e.target.value),
              placeholder: searchPlaceholder,
              className: "h-8 border-0 bg-transparent pl-8 pr-3 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            }
          )
        ] }),
        onSearchChange && filters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden h-5 w-px bg-border/60 sm:block" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: filters.map((filter) => {
          const val = values[filter.key] ?? "ALL";
          const isActive = val && val !== "ALL";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: val,
              onValueChange: (v) => onFilterChange?.(filter.key, v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: cn(
                      "h-8 gap-1.5 border-0 bg-transparent text-xs shadow-none focus:ring-0 focus:ring-offset-0",
                      filter.width ?? "w-auto min-w-[100px]",
                      isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                    ),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: filter.placeholder ?? filter.label })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "ALL", children: [
                    filter.label,
                    ": All"
                  ] }),
                  filter.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value))
                ] })
              ]
            },
            filter.key
          );
        }) }),
        extra && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: extra }),
        activeCount > 0 && onClear && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-px bg-border/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClear,
              className: "h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                "Clear",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary", children: activeCount })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  FilterBar as F
};
