import { useEffect, useState } from "react";
import { Bell, Check, ChevronDown, LogOut, Settings as SettingsIcon, ShieldCheck, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CompanySwitcher } from "@/components/companies/CompanySwitcher";
import { GlobalSearch } from "@/components/global/GlobalSearch";
import { CommandPalette } from "@/components/global/CommandPalette";
import { NotificationPanel } from "@/components/global/NotificationPanel";
import { useNotifications } from "@/lib/notification-store";
import { RoleBadge } from "@/components/rbac/RoleBadge";
import { roleStore, useRole } from "@/lib/role-store";
import { ROLES } from "@/lib/rbac";

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = useNotifications();
  const unread = notifications.filter((n) => !n.read).length;
  const role = useRole();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
        <CompanySwitcher />
        <GlobalSearch onOpenPalette={() => setPaletteOpen(true)} />

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <RoleBadge role={role} />
          </div>

          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground ring-2 ring-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-10 items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 pl-1.5 pr-2.5 text-sm transition-colors hover:bg-accent"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
                    EM
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-medium leading-tight text-foreground">Elena Marchetti</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">Compliance Lead</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" /> Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Switch role (demo)
              </DropdownMenuLabel>
              {ROLES.map((r) => (
                <DropdownMenuItem key={r.value} onClick={() => roleStore.switchRole(r.value)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span className="flex-1">{r.label}</span>
                  {role === r.value && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
