import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { Form, FormSelect, FormActions } from "@/components/form";
import { preferencesSchema, type PreferencesSchema } from "@/lib/form-schemas";
import { settingsStore, useSettings } from "@/lib/settings-store";
import { themeStore, useTheme } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
];

const TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Singapore",
];

export function PreferencesSettings() {
  const { preferences } = useSettings();
  const theme = useTheme();

  const onSubmit = async (values: PreferencesSchema) => {
    await new Promise((r) => setTimeout(r, 300));
    settingsStore.updatePreferences({ language: values.language, timezone: values.timezone });
    toast.success("Preferences saved");
  };

  return (
    <SurfaceCard className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">Customize the appearance and regional settings.</p>
      </header>

      <div className="space-y-2">
        <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Theme</p>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {(["dark", "light"] as const).map((t) => {
            const active = theme === t;
            const Icon = t === "dark" ? Moon : Sun;
            return (
              <button
                key={t}
                type="button"
                onClick={() => themeStore.set(t)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium capitalize transition-all",
                  active
                    ? "border-primary/60 bg-primary/10 ring-1 ring-inset ring-primary/30"
                    : "border-border/60 hover:border-border hover:bg-muted/40",
                )}
              >
                <Icon className="h-4 w-4" />
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <Form<PreferencesSchema>
        schema={preferencesSchema}
        defaultValues={{ language: preferences.language, timezone: preferences.timezone }}
        onSubmit={onSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect<PreferencesSchema> name="language" label="Language" options={LANGUAGES} />
          <FormSelect<PreferencesSchema> name="timezone" label="Timezone" options={TIMEZONES} />
        </div>
        <FormActions submitLabel="Save preferences" submittingLabel="Saving…" />
      </Form>
    </SurfaceCard>
  );
}
