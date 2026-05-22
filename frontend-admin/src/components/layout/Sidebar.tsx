import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE, adminNavGroups, appNavGroups, portalNavGroups } from "@/lib/constants";
import { authStore } from "@/lib/auth-store";
import { themeStore, useTheme } from "@/lib/theme-store";
import { useAuth } from "@/lib/auth-store";
import { useBranding } from "@/lib/stores/branding.store";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { data: branding } = useBranding();
  const appName = branding?.appName || APP_NAME;

  const permissions = user?.permissions ?? [];
  const canSee = (permission?: string) =>
    !permission || permissions.includes(permission) || permissions.includes("*");
  const canSeeRole = (role?: string) => !role || user?.role === role;

  const panel = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/portal")
    ? "portal"
    : "app";

  const navGroups =
    panel === "admin" ? adminNavGroups : panel === "portal" ? portalNavGroups : appNavGroups;

  const handleLogout = async () => {
    await authStore.logout();
    navigate({ to: "/login" });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 md:flex overflow-y-auto",
        collapsed ? "w-[72px]" : "w-[240px]",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <Link
          to={panel === "admin" ? "/admin/dashboard" : panel === "portal" ? "/portal/dashboard" : "/app/dashboard"}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [background:var(--gradient-primary)] overflow-hidden">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt={appName} className="h-full w-full object-contain" />
            ) : (
              <ShieldCheck className="h-4.5 w-4.5 text-primary-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">{appName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{APP_TAGLINE}</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "absolute right-[-12px] top-4 border border-sidebar-border bg-sidebar",
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronsLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 space-y-4 px-3 py-2">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) => canSee(item.permission) && canSeeRole(item.role));
          if (visible.length === 0) return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visible.map((item) => {
                  const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                        active
                          ? "bg-sidebar-accent text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("shrink-0 space-y-1.5 border-t border-sidebar-border p-3", collapsed && "px-2")}>
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <ThemeToggle collapsed={collapsed} theme={theme} onToggle={() => themeStore.toggle()} />
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

function ThemeToggle({
  collapsed,
  theme,
  onToggle,
}: {
  collapsed: boolean;
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex h-8 w-full items-center justify-center rounded-lg border border-sidebar-border text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </button>
    );
  }

  return (
    <div
      className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-0.5"
      role="radiogroup"
      aria-label="Theme"
    >
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          onClick={() => theme !== t && onToggle()}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all",
            theme === t
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t === "light" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
