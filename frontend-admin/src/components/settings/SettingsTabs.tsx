import { cn } from "@/lib/utils";
import { User, Sliders, Shield, Bell, AlertTriangle } from "lucide-react";

export type SettingsTabId = "profile" | "preferences" | "security" | "notifications" | "danger";

const TABS: { id: SettingsTabId; label: string; icon: React.ComponentType<{ className?: string }>; tone?: "danger" }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: Sliders },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, tone: "danger" },
];

export function SettingsTabs({
  active,
  onChange,
}: {
  active: SettingsTabId;
  onChange: (id: SettingsTabId) => void;
}) {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border/60 bg-card/40 p-1 md:flex-col md:gap-0.5 md:p-2">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "group flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all md:w-full",
              isActive
                ? "bg-primary/12 text-foreground ring-1 ring-inset ring-primary/25"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              t.tone === "danger" && isActive && "bg-destructive/10 ring-destructive/25 text-destructive",
              t.tone === "danger" && !isActive && "hover:text-destructive",
            )}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
