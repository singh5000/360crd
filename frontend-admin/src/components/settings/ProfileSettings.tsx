import { toast } from "sonner";
import { Camera } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { Form, FormInput, FormActions } from "@/components/form";
import { profileSchema, type ProfileSchema } from "@/lib/form-schemas";
import { settingsStore, useSettings } from "@/lib/settings-store";

export function ProfileSettings() {
  const { userProfile } = useSettings();
  const initials = userProfile.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const onSubmit = async (values: ProfileSchema) => {
    await new Promise((r) => setTimeout(r, 400));
    settingsStore.updateProfile({ fullName: values.fullName, phone: values.phone });
    toast.success("Profile updated");
  };

  return (
    <SurfaceCard className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Personal information visible across the workspace.</p>
      </header>

      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary ring-2 ring-primary/20">
          {initials}
          <button
            type="button"
            onClick={() => toast("Avatar upload is UI-only in demo mode")}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background ring-1 ring-border transition-colors hover:bg-muted"
            aria-label="Upload avatar"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium">{userProfile.fullName}</p>
          <p className="text-xs text-muted-foreground">{userProfile.email}</p>
        </div>
      </div>

      <Form<ProfileSchema>
        schema={profileSchema}
        defaultValues={{ fullName: userProfile.fullName, phone: userProfile.phone }}
        onSubmit={onSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput<ProfileSchema> name="fullName" label="Full Name" />
          <FormInput<ProfileSchema> name="phone" label="Phone" />
        </div>
        <FormActions submitLabel="Save changes" submittingLabel="Saving…" />
      </Form>
    </SurfaceCard>
  );
}
