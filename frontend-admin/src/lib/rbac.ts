export type Role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "MANAGER" | "USER";

export type Resource = "audits" | "incidents" | "facilities" | "companies" | "settings" | "users";
export type Action = "view" | "create" | "edit" | "delete" | "report" | "update_status" | "add_maintenance" | "manage";

export const ROLES: { value: Role; label: string; tone: "danger" | "warning" | "info" | "neutral" }[] = [
  { value: "SUPER_ADMIN", label: "Super Admin", tone: "danger" },
  { value: "COMPANY_ADMIN", label: "Company Admin", tone: "warning" },
  { value: "MANAGER", label: "Manager", tone: "info" },
  { value: "USER", label: "User", tone: "neutral" },
];

const matrix: Record<Role, Partial<Record<Resource, Action[] | "*">>> = {
  SUPER_ADMIN: {
    audits: "*", incidents: "*", facilities: "*", companies: "*", settings: "*", users: "*",
  },
  COMPANY_ADMIN: {
    audits: "*", incidents: "*", facilities: "*", settings: "*", users: "*",
  },
  MANAGER: {
    audits: ["view", "create", "edit"],
    incidents: ["view", "report", "update_status", "create", "edit"],
    facilities: ["view", "add_maintenance"],
    settings: ["view", "edit"],
  },
  USER: {
    audits: ["view"],
    incidents: ["view", "report"],
    facilities: ["view"],
    settings: ["view"],
  },
};

export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const entry = matrix[role]?.[resource];
  if (!entry) return false;
  if (entry === "*") return true;
  return entry.includes(action);
}

export function canAccessResource(role: Role, resource: Resource): boolean {
  const entry = matrix[role]?.[resource];
  return entry === "*" || (Array.isArray(entry) && entry.length > 0);
}
