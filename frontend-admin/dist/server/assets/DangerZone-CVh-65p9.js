import { L as jsxRuntimeExports, U as reactExports } from "./worker-entry-hKZhhGaI.js";
import { w as cn, a2 as useComposedRefs, g as Primitive, y as composeEventHandlers, a8 as useSize, H as createContextScope, a7 as useSettings, Y as toast, U as settingsStore, a4 as useNavigate, s as authStore } from "./router-BNkFluS9.js";
import { U as User, u as useControllableState, p as useTheme, M as Moon, g as Sun, t as themeStore, L as LogOut, f as StatusBadge } from "./AppShell-CYz6-NtT.js";
import { k as createLucideIcon, B as Bell } from "./constants-Bl7kXxvf.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { h as useFormContext, u as useFieldError, C as Controller, F as Form, g as profileSchema, c as FormInput, a as FormActions, p as preferencesSchema, d as FormSelect, n as notificationsSchema } from "./form-schemas-DTUY_JIU.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as InputField } from "./InputField-Cvgola_D.js";
import { L as Laptop } from "./laptop-C_oDjGx0.js";
import { u as usePrevious } from "./index-BQhF8c1W.js";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-Cv8VvcC8.js";
const __iconNode$4 = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$4);
const __iconNode$3 = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("monitor", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M10 8h4", key: "1sr2af" }],
  ["path", { d: "M12 21v-9", key: "17s77i" }],
  ["path", { d: "M12 8V3", key: "13r4qs" }],
  ["path", { d: "M17 16h4", key: "h1uq16" }],
  ["path", { d: "M19 12V3", key: "o1uvq1" }],
  ["path", { d: "M19 21v-5", key: "qua636" }],
  ["path", { d: "M3 14h4", key: "bcjad9" }],
  ["path", { d: "M5 10V3", key: "cb8scm" }],
  ["path", { d: "M5 21v-7", key: "1w1uti" }]
];
const SlidersVertical = createLucideIcon("sliders-vertical", __iconNode$1);
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersVertical },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: TriangleAlert, tone: "danger" }
];
function SettingsTabs({
  active,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex gap-1 overflow-x-auto rounded-xl border border-border/60 bg-card/40 p-1 md:flex-col md:gap-0.5 md:p-2", children: TABS.map((t) => {
    const Icon = t.icon;
    const isActive = active === t.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(t.id),
        className: cn(
          "group flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all md:w-full",
          isActive ? "bg-primary/12 text-foreground ring-1 ring-inset ring-primary/25" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          t.tone === "danger" && isActive && "bg-destructive/10 ring-destructive/25 text-destructive",
          t.tone === "danger" && !isActive && "hover:text-destructive"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          t.label
        ]
      },
      t.id
    );
  }) });
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
function FormSwitch({ name, label, description, className }) {
  const { control } = useFormContext();
  const error = useFieldError(name);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-start justify-between gap-4", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: label }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: description }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs font-medium text-destructive", children: error })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Controller,
      {
        control,
        name,
        render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!field.value, onCheckedChange: (v) => field.onChange(v) })
      }
    )
  ] });
}
function ProfileSettings() {
  const { userProfile } = useSettings();
  const initials = userProfile.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 400));
    settingsStore.updateProfile({ fullName: values.fullName, phone: values.phone });
    toast.success("Profile updated");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Personal information visible across the workspace." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary ring-2 ring-primary/20", children: [
        initials,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => toast("Avatar upload is UI-only in demo mode"),
            className: "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background ring-1 ring-border transition-colors hover:bg-muted",
            "aria-label": "Upload avatar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: userProfile.fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: userProfile.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        schema: profileSchema,
        defaultValues: { fullName: userProfile.fullName, phone: userProfile.phone },
        onSubmit,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormInput, { name: "fullName", label: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormInput, { name: "phone", label: "Phone" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { submitLabel: "Save changes", submittingLabel: "Saving…" })
        ]
      }
    )
  ] });
}
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" }
];
const TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Singapore"
];
function PreferencesSettings() {
  const { preferences } = useSettings();
  const theme = useTheme();
  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 300));
    settingsStore.updatePreferences({ language: values.language, timezone: values.timezone });
    toast.success("Preferences saved");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Preferences" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Customize the appearance and regional settings." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Theme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:max-w-md", children: ["dark", "light"].map((t) => {
        const active = theme === t;
        const Icon = t === "dark" ? Moon : Sun;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => themeStore.set(t),
            className: cn(
              "flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium capitalize transition-all",
              active ? "border-primary/60 bg-primary/10 ring-1 ring-inset ring-primary/30" : "border-border/60 hover:border-border hover:bg-muted/40"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              t
            ]
          },
          t
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        schema: preferencesSchema,
        defaultValues: { language: preferences.language, timezone: preferences.timezone },
        onSubmit,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormSelect, { name: "language", label: "Language", options: LANGUAGES }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormSelect, { name: "timezone", label: "Timezone", options: TIMEZONES })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { submitLabel: "Save preferences", submittingLabel: "Saving…" })
        ]
      }
    )
  ] });
}
function deviceIcon(device) {
  if (/iphone|android|mobile/i.test(device)) return Smartphone;
  if (/mac|laptop/i.test(device)) return Laptop;
  return Monitor;
}
function SecuritySettings() {
  const { security } = useSettings();
  const [current, setCurrent] = reactExports.useState("");
  const [next, setNext] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const onChangePwd = async () => {
    if (!current || !next) return toast.error("Fill all password fields");
    if (next !== confirm) return toast.error("Passwords do not match");
    if (next.length < 8) return toast.error("Password must be 8+ characters");
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password updated");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Change password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Use a strong password unique to this account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Current password", type: "password", value: current, onChange: (e) => setCurrent(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "New password", type: "password", value: next, onChange: (e) => setNext(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Confirm new", type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end border-t border-border/60 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onChangePwd, disabled: saving, children: saving ? "Updating..." : "Update password" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Active sessions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Devices currently signed in to your account." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              settingsStore.logoutAllSessions();
              toast.success("All other sessions signed out");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
              " Logout all"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: security.sessions.map((s) => {
        const Icon = deviceIcon(s.device);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-inset ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: s.device }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                s.location,
                " · ",
                s.lastActive
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: s.current ? /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: "success", children: "This device" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => {
                settingsStore.revokeSession(s.id);
                toast.success("Session revoked");
              },
              children: "Revoke"
            }
          ) })
        ] }, s.id);
      }) })
    ] })
  ] });
}
const ITEMS = [
  { name: "auditUpdates", label: "Audit updates", description: "Status changes, assignments and completion." },
  { name: "incidentAlerts", label: "Incident alerts", description: "New incidents and escalations in real time." },
  { name: "maintenanceReminders", label: "Maintenance reminders", description: "Upcoming and overdue facility maintenance." },
  { name: "emailNotifications", label: "Email notifications", description: "Receive a daily summary by email." }
];
function NotificationsSettings() {
  const { notifications } = useSettings();
  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 300));
    settingsStore.updateNotifications(values);
    toast.success("Notification preferences saved");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Choose which events trigger alerts." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        schema: notificationsSchema,
        defaultValues: notifications,
        onSubmit,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormSwitch, { name: item.name, label: item.label, description: item.description }) }, item.name)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { submitLabel: "Save", submittingLabel: "Saving…" })
        ]
      }
    )
  ] });
}
function DangerZone() {
  const [mode, setMode] = reactExports.useState(null);
  const navigate = useNavigate();
  const confirm = async () => {
    if (mode === "deactivate") {
      toast.success("Account deactivated");
    } else if (mode === "delete") {
      toast.success("Account deleted");
    }
    setMode(null);
    authStore.logout();
    navigate({ to: "/login", search: { redirect: "/" } });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-6 border-destructive/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-destructive", children: "Danger zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Irreversible actions. Proceed with caution." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Deactivate account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Temporarily disable access. Data is preserved." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setMode("deactivate"), children: "Deactivate" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Delete account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Permanently remove your account and all related data." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => setMode("delete"), children: "Delete" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: mode !== null, onOpenChange: (o) => !o && setMode(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: mode === "delete" ? "Delete this account?" : "Deactivate this account?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: mode === "delete" ? "This action is permanent and cannot be undone. All your data will be lost." : "Your account will be disabled. You can reactivate by signing in again." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: confirm,
            className: mode === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : void 0,
            children: mode === "delete" ? "Delete" : "Deactivate"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  DangerZone as D,
  NotificationsSettings as N,
  PreferencesSettings as P,
  SecuritySettings as S,
  ProfileSettings as a,
  SettingsTabs as b
};
