export type ActivityModule =
  | "Audits"
  | "Incidents"
  | "Facilities"
  | "Companies"
  | "Users"
  | "Settings"
  | "Auth";

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "escalated"
  | "enabled"
  | "disabled"
  | "login"
  | "logout";

export type ActivityLog = {
  id: string;
  timestamp: string; // ISO
  user: string;
  userEmail?: string;
  module: ActivityModule;
  action: ActivityAction;
  targetId: string;
  targetLabel: string;
  companyId?: string;
  companyName?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: {
    ip?: string;
    device?: string;
    [k: string]: unknown;
  };
  summary: string;
};

export type ActivityFilters = {
  search: string;
  module: "All" | ActivityModule;
  user: "All" | string;
  companyId: "All" | string;
  action: "All" | ActivityAction;
  from: string;
  to: string;
};

export const ACTIVITY_MODULES: ActivityModule[] = [
  "Audits",
  "Incidents",
  "Facilities",
  "Companies",
  "Users",
  "Settings",
  "Auth",
];

export const ACTIVITY_ACTIONS: ActivityAction[] = [
  "created",
  "updated",
  "deleted",
  "status_changed",
  "escalated",
  "enabled",
  "disabled",
  "login",
  "logout",
];

export const actionTone: Record<ActivityAction, "success" | "info" | "warning" | "danger" | "neutral"> = {
  created: "success",
  updated: "info",
  deleted: "danger",
  status_changed: "warning",
  escalated: "danger",
  enabled: "success",
  disabled: "neutral",
  login: "info",
  logout: "neutral",
};
