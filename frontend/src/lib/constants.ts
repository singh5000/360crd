import {
  Activity,
  AlertTriangle,
  Archive,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HardHat,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Package,
  Recycle,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  Warehouse,
  Webhook,
  Bell,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  permission?: string;
  /** If set, item only renders for users with this exact role */
  role?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const APP_NAME = "360CRD";
export const APP_TAGLINE = "EHS & Compliance Platform";

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Activity", to: "/activity", icon: Activity },
    ],
  },
  {
    label: "Safety",
    items: [
      { label: "Incidents", to: "/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "PPE", to: "/ppe", icon: HardHat, permission: "ppe:read" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { label: "Training", to: "/training", icon: GraduationCap, permission: "training:read" },
      { label: "Inductions", to: "/inductions", icon: BookOpen, permission: "induction:read" },
      { label: "Documents", to: "/documents", icon: FileText, permission: "document:read" },
      { label: "Waste", to: "/waste", icon: Recycle, permission: "waste:read" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Assets", to: "/assets", icon: Package, permission: "asset:read" },
      { label: "Sites", to: "/facilities", icon: Warehouse, permission: "site:read" },
      { label: "Customers", to: "/companies", icon: Building2, permission: "customer:read" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Reports", to: "/reports", icon: Archive, permission: "report:read" },
      { label: "Notifications", to: "/notifications", icon: Bell },
      { label: "Team", to: "/users", icon: Users, permission: "user:read" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Roles", to: "/roles", icon: ShieldAlert, permission: "role:read" },
      { label: "Webhooks", to: "/webhooks", icon: Webhook, permission: "webhook:read" },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((g) => g.items);

// ── Panel-specific nav groups ─────────────────────────────────────────────────

export const adminNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Activity", to: "/admin/activity", icon: Activity },
    ],
  },
  {
    label: "Super Admin",
    items: [
      { label: "Companies", to: "/admin/tenants", icon: Building2, role: "super_admin" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Users", to: "/admin/users", icon: Users, permission: "user:read" },
      { label: "Sites", to: "/admin/sites", icon: Warehouse, permission: "site:read" },
      { label: "Roles", to: "/admin/roles", icon: ShieldCheck, permission: "role:read", role: "super_admin" },
    ],
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
      { label: "Waste", to: "/admin/waste", icon: Recycle, permission: "waste:read" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Reports", to: "/admin/reports", icon: Archive, permission: "report:read" },
      { label: "Feedback", to: "/admin/feedback", icon: MessageSquare, permission: "feedback:read" },
      { label: "Notifications", to: "/admin/notifications", icon: Bell },
      { label: "Webhooks", to: "/admin/webhooks", icon: Webhook, permission: "webhook:read" },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

export const appNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Safety",
    items: [
      { label: "Incidents", to: "/app/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/app/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "PPE", to: "/app/ppe", icon: HardHat, permission: "ppe:read" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { label: "Training", to: "/app/training", icon: GraduationCap, permission: "training:read" },
      { label: "Inductions", to: "/app/inductions", icon: BookOpen, permission: "induction:read" },
      { label: "Documents", to: "/app/documents", icon: FileText, permission: "document:read" },
      { label: "Waste", to: "/app/waste", icon: Recycle, permission: "waste:read" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Assets", to: "/app/assets", icon: Package, permission: "asset:read" },
      { label: "Sites", to: "/app/sites", icon: Warehouse, permission: "site:read" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Reports", to: "/app/reports", icon: Archive, permission: "report:read" },
      { label: "Notifications", to: "/app/notifications", icon: Bell },
    ],
  },
];

export const portalNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/portal/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Visibility",
    items: [
      { label: "My Sites", to: "/portal/sites", icon: Warehouse, permission: "site:read" },
      { label: "Incidents", to: "/portal/incidents", icon: ShieldAlert, permission: "incident:read" },
      { label: "Audits", to: "/portal/audits", icon: ClipboardCheck, permission: "audit:read" },
      { label: "Documents", to: "/portal/documents", icon: FileText, permission: "document:read" },
    ],
  },
  {
    label: "Reports & Support",
    items: [
      { label: "Reports", to: "/portal/reports", icon: Archive, permission: "report:read" },
      { label: "Feedback", to: "/portal/feedback", icon: MessageSquare },
      { label: "Notifications", to: "/portal/notifications", icon: Bell },
    ],
  },
];
