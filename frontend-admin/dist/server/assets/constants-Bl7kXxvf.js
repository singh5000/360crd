import { U as reactExports } from "./worker-entry-hKZhhGaI.js";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$i = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$i);
const __iconNode$h = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
];
const Archive = createLucideIcon("archive", __iconNode$h);
const __iconNode$g = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$g);
const __iconNode$f = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$f);
const __iconNode$e = [
  ["path", { d: "M10 12h4", key: "a56b0p" }],
  ["path", { d: "M10 8h4", key: "1sr2af" }],
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
  [
    "path",
    {
      d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
      key: "secmi2"
    }
  ],
  ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$e);
const __iconNode$d = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
];
const ClipboardCheck = createLucideIcon("clipboard-check", __iconNode$d);
const __iconNode$c = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$c);
const __iconNode$b = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode$b);
const __iconNode$a = [
  ["path", { d: "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5", key: "1p9q5i" }],
  ["path", { d: "M14 6a6 6 0 0 1 6 6v3", key: "1hnv84" }],
  ["path", { d: "M4 15v-3a6 6 0 0 1 6-6", key: "9ciidu" }],
  ["rect", { x: "2", y: "15", width: "20", height: "4", rx: "1", key: "g3x8cw" }]
];
const HardHat = createLucideIcon("hard-hat", __iconNode$a);
const __iconNode$9 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$9);
const __iconNode$8 = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",
      key: "x6z5xu"
    }
  ],
  [
    "path",
    {
      d: "M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",
      key: "1x4zh5"
    }
  ],
  ["path", { d: "m14 16-3 3 3 3", key: "f6jyew" }],
  ["path", { d: "M8.293 13.596 7.196 9.5 3.1 10.598", key: "wf1obh" }],
  [
    "path",
    {
      d: "m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",
      key: "9tzpgr"
    }
  ],
  ["path", { d: "m13.378 9.633 4.096 1.098 1.097-4.096", key: "1oe83g" }]
];
const Recycle = createLucideIcon("recycle", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11", key: "pb2vm6" }],
  [
    "path",
    {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
      key: "doq5xv"
    }
  ],
  ["path", { d: "M6 13h12", key: "yf64js" }],
  ["path", { d: "M6 17h12", key: "1jwigz" }]
];
const Warehouse = createLucideIcon("warehouse", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
      key: "q3hayz"
    }
  ],
  ["path", { d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06", key: "1go1hn" }],
  ["path", { d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8", key: "qlwsc0" }]
];
const Webhook = createLucideIcon("webhook", __iconNode);
const APP_NAME = "360CRD";
const APP_TAGLINE = "EHS & Compliance Platform";
const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Activity", to: "/activity", icon: Activity }
    ]
  },
  {
    label: "Safety",
    items: [
      { label: "Incidents", to: "/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "PPE", to: "/ppe", icon: HardHat, permission: "ppe:read" }
    ]
  },
  {
    label: "Compliance",
    items: [
      { label: "Training", to: "/training", icon: GraduationCap, permission: "training:read" },
      { label: "Inductions", to: "/inductions", icon: BookOpen, permission: "induction:read" },
      { label: "Documents", to: "/documents", icon: FileText, permission: "document:read" },
      { label: "Waste", to: "/waste", icon: Recycle, permission: "waste:read" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Assets", to: "/assets", icon: Package, permission: "asset:read" },
      { label: "Sites", to: "/facilities", icon: Warehouse, permission: "site:read" },
      { label: "Customers", to: "/companies", icon: Building2, permission: "customer:read" }
    ]
  },
  {
    label: "Management",
    items: [
      { label: "Reports", to: "/reports", icon: Archive, permission: "report:read" },
      { label: "Notifications", to: "/notifications", icon: Bell },
      { label: "Team", to: "/users", icon: Users, permission: "user:read" }
    ]
  },
  {
    label: "System",
    items: [
      { label: "Roles", to: "/roles", icon: ShieldAlert, permission: "role:read" },
      { label: "Webhooks", to: "/webhooks", icon: Webhook, permission: "webhook:read" },
      { label: "Settings", to: "/settings", icon: Settings }
    ]
  }
];
navGroups.flatMap((g) => g.items);
const adminNavGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Activity", to: "/admin/activity", icon: Activity }
    ]
  },
  {
    label: "Super Admin",
    items: [
      { label: "Companies", to: "/admin/tenants", icon: Building2, role: "super_admin" }
    ]
  },
  {
    label: "Platform",
    items: [
      { label: "Users", to: "/admin/users", icon: Users, permission: "user:read" },
      { label: "Sites", to: "/admin/sites", icon: Warehouse, permission: "site:read" },
      { label: "Roles", to: "/admin/roles", icon: ShieldCheck, permission: "role:read", role: "super_admin" }
    ]
  },
  {
    label: "Operations View",
    items: [
      { label: "Incidents", to: "/admin/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/admin/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "Training", to: "/admin/training", icon: GraduationCap, permission: "training:read" },
      { label: "Inductions", to: "/admin/inductions", icon: BookOpen, permission: "induction:read" },
      { label: "Documents", to: "/admin/documents", icon: FileText, permission: "document:read" },
      { label: "PPE", to: "/admin/ppe", icon: HardHat, permission: "ppe:read" },
      { label: "Assets", to: "/admin/assets", icon: Package, permission: "asset:read" },
      { label: "Waste", to: "/admin/waste", icon: Recycle, permission: "waste:read" }
    ]
  },
  {
    label: "System",
    items: [
      { label: "Reports", to: "/admin/reports", icon: Archive, permission: "report:read" },
      { label: "Feedback", to: "/admin/feedback", icon: MessageSquare, permission: "feedback:read" },
      { label: "Notifications", to: "/admin/notifications", icon: Bell },
      { label: "Webhooks", to: "/admin/webhooks", icon: Webhook, permission: "webhook:read" },
      { label: "Settings", to: "/admin/settings", icon: Settings }
    ]
  }
];
const appNavGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    label: "Safety",
    items: [
      { label: "Incidents", to: "/app/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/app/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "PPE", to: "/app/ppe", icon: HardHat, permission: "ppe:read" }
    ]
  },
  {
    label: "Compliance",
    items: [
      { label: "Training", to: "/app/training", icon: GraduationCap, permission: "training:read" },
      { label: "Inductions", to: "/app/inductions", icon: BookOpen, permission: "induction:read" },
      { label: "Documents", to: "/app/documents", icon: FileText, permission: "document:read" },
      { label: "Waste", to: "/app/waste", icon: Recycle, permission: "waste:read" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Assets", to: "/app/assets", icon: Package, permission: "asset:read" },
      { label: "Sites", to: "/app/sites", icon: Warehouse, permission: "site:read" }
    ]
  },
  {
    label: "Management",
    items: [
      { label: "Reports", to: "/app/reports", icon: Archive, permission: "report:read" },
      { label: "Notifications", to: "/app/notifications", icon: Bell }
    ]
  }
];
const portalNavGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/portal/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    label: "Visibility",
    items: [
      { label: "My Sites", to: "/portal/sites", icon: Warehouse, permission: "site:read" },
      { label: "Incidents", to: "/portal/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/portal/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "Documents", to: "/portal/documents", icon: FileText, permission: "document:read" }
    ]
  },
  {
    label: "Reports & Support",
    items: [
      { label: "Reports", to: "/portal/reports", icon: Archive, permission: "report:read" },
      { label: "Feedback", to: "/portal/feedback", icon: MessageSquare },
      { label: "Notifications", to: "/portal/notifications", icon: Bell }
    ]
  }
];
export {
  APP_NAME as A,
  Bell as B,
  ClipboardCheck as C,
  FileText as F,
  GraduationCap as G,
  HardHat as H,
  MessageSquare as M,
  Package as P,
  Recycle as R,
  Settings as S,
  Users as U,
  Warehouse as W,
  APP_TAGLINE as a,
  Activity as b,
  Archive as c,
  BookOpen as d,
  Building2 as e,
  ShieldAlert as f,
  ShieldCheck as g,
  Webhook as h,
  adminNavGroups as i,
  appNavGroups as j,
  createLucideIcon as k,
  portalNavGroups as p
};
