import { toast } from "sonner";
import { SurfaceCard } from "@/components/shared/Card";
import { Form, FormSwitch, FormActions } from "@/components/form";
import { notificationsSchema, type NotificationsSchema } from "@/lib/form-schemas";
import { settingsStore, useSettings } from "@/lib/settings-store";

const ITEMS: { name: keyof NotificationsSchema; label: string; description: string }[] = [
  { name: "auditUpdates", label: "Audit updates", description: "Status changes, assignments and completion." },
  { name: "incidentAlerts", label: "Incident alerts", description: "New incidents and escalations in real time." },
  { name: "maintenanceReminders", label: "Maintenance reminders", description: "Upcoming and overdue facility maintenance." },
  { name: "emailNotifications", label: "Email notifications", description: "Receive a daily summary by email." },
];

export function NotificationsSettings() {
  const { notifications } = useSettings();

  const onSubmit = async (values: NotificationsSchema) => {
    await new Promise((r) => setTimeout(r, 300));
    settingsStore.updateNotifications(values);
    toast.success("Notification preferences saved");
  };

  return (
    <SurfaceCard className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose which events trigger alerts.</p>
      </header>

      <Form<NotificationsSchema>
        schema={notificationsSchema}
        defaultValues={notifications}
        onSubmit={onSubmit}
      >
        <ul className="divide-y divide-border/60">
          {ITEMS.map((item) => (
            <li key={item.name} className="py-4">
              <FormSwitch<NotificationsSchema> name={item.name} label={item.label} description={item.description} />
            </li>
          ))}
        </ul>
        <FormActions submitLabel="Save" submittingLabel="Saving…" />
      </Form>
    </SurfaceCard>
  );
}
