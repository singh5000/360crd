import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ROLES, type Role } from "@/lib/rbac";

export function RoleBadge({ role }: { role: Role }) {
  const meta = ROLES.find((r) => r.value === role);
  if (!meta) return null;
  return (
    <StatusBadge tone={meta.tone}>
      <ShieldCheck className="h-3 w-3" />
      {meta.label}
    </StatusBadge>
  );
}
