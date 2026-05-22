import { useEffect } from "react";
import { Building2, ChevronDown, Globe, Plus, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-store";
import { useTenants, tenantStore, TENANT_STATUS_COLOR } from "@/lib/stores/tenant.store";
import { useTenantContext } from "@/lib/stores/tenant-context.store";
import { cn } from "@/lib/utils";

export function CompanySwitcher() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  if (isSuperAdmin) return <SuperAdminSwitcher />;
  return null;
}

function SuperAdminSwitcher() {
  const tenants = useTenants();
  const navigate = useNavigate();
  const { loading, initialized } = tenantStore.getState();
  const { selectedTenantId, selectedTenantName, setSelectedTenant, clearSelectedTenant } = useTenantContext();

  useEffect(() => {
    if (!initialized && !loading) {
      tenantStore.fetch({ limit: 100 });
    }
  }, [initialized, loading]);

  const activeCount = tenants.filter((t) => t.status === "ACTIVE").length;
  const selected = selectedTenantId ? tenants.find((t) => t.id === selectedTenantId) : null;

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-2.5 text-sm transition-colors hover:bg-accent"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              {selected ? (
                selected.branding?.logoUrl
                  ? <img src={selected.branding.logoUrl} alt={selected.name} className="h-full w-full rounded-md object-cover" />
                  : <Building2 className="h-3.5 w-3.5" />
              ) : (
                <Globe className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-xs font-medium leading-tight text-foreground max-w-[120px]">
                {selected ? selected.name : "All Companies"}
              </p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                {selected ? selected.slug : `${tenants.length} total · ${activeCount} active`}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72 max-h-[420px] overflow-y-auto">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Companies</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              {activeCount} active
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* All Companies option */}
          <DropdownMenuItem
            onClick={clearSelectedTenant}
            className={cn("flex items-center gap-2.5 py-2", !selectedTenantId && "bg-primary/5")}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Globe className="h-3.5 w-3.5 text-primary/70" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">All Companies</p>
              <p className="text-[10px] text-muted-foreground">{tenants.length} total</p>
            </div>
            {!selectedTenantId && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {loading && !tenants.length ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">Loading...</div>
          ) : tenants.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">No companies yet</div>
          ) : (
            tenants.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setSelectedTenant(t.id, t.name)}
                className={cn("flex items-center gap-2.5 py-2", selectedTenantId === t.id && "bg-primary/5")}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  {t.branding?.logoUrl ? (
                    <img src={t.branding.logoUrl} alt={t.name} className="h-full w-full rounded-md object-cover" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5 text-primary/70" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{t.slug}</p>
                </div>
                <span className={cn(
                  "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-medium",
                  TENANT_STATUS_COLOR[t.status],
                )}>
                  {t.status}
                </span>
                {selectedTenantId === t.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate({ to: "/admin/tenants" })}
            className="text-xs text-muted-foreground font-medium"
          >
            <Globe className="mr-2 h-3.5 w-3.5" /> Manage all companies
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate({ to: "/admin/tenants" })}
            className="text-xs text-primary font-semibold"
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Add Company
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear filter pill when a company is selected */}
      {selectedTenantId && (
        <button
          type="button"
          onClick={clearSelectedTenant}
          title="Clear company filter"
          className="flex h-7 items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 text-[11px] font-medium text-primary hover:bg-primary/20"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
