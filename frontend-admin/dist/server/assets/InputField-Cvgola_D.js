import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { w as cn } from "./router-BNkFluS9.js";
import { k as createLucideIcon } from "./constants-Bl7kXxvf.js";
import { E as Eye } from "./eye-C01Vu7q5.js";
const __iconNode = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode);
const InputField = reactExports.forwardRef(
  ({ label, error, icon, type = "text", className, id, value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const reactId = reactExports.useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = reactExports.useState(false);
    const [internal, setInternal] = reactExports.useState(defaultValue ?? "");
    const isPassword = type === "password";
    const [showPwd, setShowPwd] = reactExports.useState(false);
    const effectiveType = isPassword && showPwd ? "text" : type;
    const currentValue = value !== void 0 ? String(value) : String(internal);
    const hasValue = currentValue.length > 0;
    const floated = focused || hasValue;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("group", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "relative flex h-14 items-center rounded-xl border bg-card/40 transition-all duration-200",
            "border-border/70",
            focused && "border-primary/70 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
            error && "border-destructive/70 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-destructive)_15%,transparent)]"
          ),
          children: [
            icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("pl-3.5 text-muted-foreground transition-colors", focused && "text-primary"), children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: inputId,
                className: cn(
                  "pointer-events-none absolute left-0 px-3.5 text-sm text-muted-foreground transition-all duration-200",
                  icon && "left-9",
                  floated ? "top-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground" : "top-1/2 -translate-y-1/2",
                  focused && "text-primary",
                  error && "text-destructive"
                ),
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref,
                id: inputId,
                type: effectiveType,
                value,
                defaultValue: value === void 0 ? defaultValue : void 0,
                onChange: (e) => {
                  if (value === void 0) setInternal(e.target.value);
                  onChange?.(e);
                },
                onFocus: (e) => {
                  setFocused(true);
                  onFocus?.(e);
                },
                onBlur: (e) => {
                  setFocused(false);
                  onBlur?.(e);
                },
                className: cn(
                  "peer h-full w-full bg-transparent px-3.5 pt-4 text-sm text-foreground placeholder-transparent outline-none",
                  icon && "pl-1",
                  isPassword && "pr-10"
                ),
                "aria-invalid": !!error,
                "aria-describedby": error ? `${inputId}-error` : void 0,
                ...props
              }
            ),
            isPassword && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPwd((s) => !s),
                className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground",
                "aria-label": showPwd ? "Hide password" : "Show password",
                tabIndex: -1,
                children: showPwd ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ]
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: `${inputId}-error`, className: "mt-1.5 px-1 text-xs font-medium text-destructive", children: error })
    ] });
  }
);
InputField.displayName = "InputField";
export {
  InputField as I
};
