import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authStore } from "@/lib/auth-store";

type Mode = null | "deactivate" | "delete";

export function DangerZone() {
  const [mode, setMode] = useState<Mode>(null);
  const navigate = useNavigate();

  const confirm = async () => {
    if (mode === "deactivate") {
      toast.success("Account deactivated");
    } else if (mode === "delete") {
      toast.success("Account deleted");
    }
    setMode(null);
    authStore.logout();
    navigate({ to: "/login", search: { redirect: "/" } });
  };

  return (
    <SurfaceCard className="space-y-6 border-destructive/30">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/25">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">Irreversible actions. Proceed with caution.</p>
        </div>
      </header>

      <div className="divide-y divide-border/60">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Deactivate account</p>
            <p className="text-xs text-muted-foreground">Temporarily disable access. Data is preserved.</p>
          </div>
          <Button variant="outline" onClick={() => setMode("deactivate")}>Deactivate</Button>
        </div>
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently remove your account and all related data.</p>
          </div>
          <Button variant="destructive" onClick={() => setMode("delete")}>Delete</Button>
        </div>
      </div>

      <AlertDialog open={mode !== null} onOpenChange={(o) => !o && setMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mode === "delete" ? "Delete this account?" : "Deactivate this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "delete"
                ? "This action is permanent and cannot be undone. All your data will be lost."
                : "Your account will be disabled. You can reactivate by signing in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirm}
              className={mode === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
            >
              {mode === "delete" ? "Delete" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SurfaceCard>
  );
}
