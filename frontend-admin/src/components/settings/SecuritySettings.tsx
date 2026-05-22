import { useState } from "react";
import { toast } from "sonner";
import { Laptop, Smartphone, Monitor, LogOut } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/InputField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { settingsStore, useSettings, type Session } from "@/lib/settings-store";

function deviceIcon(device: string) {
  if (/iphone|android|mobile/i.test(device)) return Smartphone;
  if (/mac|laptop/i.test(device)) return Laptop;
  return Monitor;
}

export function SecuritySettings() {
  const { security } = useSettings();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onChangePwd = async () => {
    if (!current || !next) return toast.error("Fill all password fields");
    if (next !== confirm) return toast.error("Passwords do not match");
    if (next.length < 8) return toast.error("Password must be 8+ characters");
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCurrent(""); setNext(""); setConfirm("");
    toast.success("Password updated");
  };

  return (
    <div className="space-y-6">
      <SurfaceCard className="space-y-6">
        <header>
          <h2 className="text-lg font-semibold">Change password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use a strong password unique to this account.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          <InputField label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <InputField label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          <InputField label="Confirm new" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="flex justify-end border-t border-border/60 pt-4">
          <Button onClick={onChangePwd} disabled={saving}>{saving ? "Updating..." : "Update password"}</Button>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Active sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Devices currently signed in to your account.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              settingsStore.logoutAllSessions();
              toast.success("All other sessions signed out");
            }}
          >
            <LogOut className="h-4 w-4" /> Logout all
          </Button>
        </header>
        <ul className="divide-y divide-border/60">
          {security.sessions.map((s: Session) => {
            const Icon = deviceIcon(s.device);
            return (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-inset ring-border">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.device}</p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.current ? (
                    <StatusBadge tone="success">This device</StatusBadge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        settingsStore.revokeSession(s.id);
                        toast.success("Session revoked");
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>
    </div>
  );
}
