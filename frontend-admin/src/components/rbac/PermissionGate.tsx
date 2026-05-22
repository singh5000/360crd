import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { hasPermission, type Action, type Resource } from "@/lib/rbac";
import { useRole } from "@/lib/role-store";

type Props = {
  resource: Resource;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
  /** If true, render a disabled wrapper with tooltip instead of hiding. */
  mode?: "hide" | "disable";
};

export function PermissionGate({ resource, action, children, fallback = null, mode = "hide" }: Props) {
  const role = useRole();
  const allowed = hasPermission(role, resource, action);
  if (allowed) return <>{children}</>;
  if (mode === "disable") {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="pointer-events-none inline-flex cursor-not-allowed opacity-50">
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent>No permission</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return <>{fallback}</>;
}
