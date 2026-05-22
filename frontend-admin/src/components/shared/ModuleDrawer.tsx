import { X } from "lucide-react";
import { Sheet, SheetContent, SheetPortal, SheetOverlay } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "w-full sm:max-w-[420px]",
  md: "w-full sm:max-w-[560px]",
  lg: "w-full sm:max-w-[680px]",
  xl: "w-full sm:max-w-[820px]",
};

interface ModuleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: keyof typeof SIZE_CLASSES;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideFooter?: boolean;
}

export function ModuleDrawer({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  hideFooter,
}: ModuleDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-black/40 backdrop-blur-[2px]" />
        <SheetContent
          side="right"
          className={cn(
            SIZE_CLASSES[size],
            "flex flex-col gap-0 p-0 border-l border-border/60 bg-background shadow-2xl",
          )}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border/60 px-6 py-4 shrink-0">
            <div className="min-w-0 pr-4">
              <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
              {description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {children}
          </div>

          {/* Footer */}
          {!hideFooter && (
            <div className="shrink-0 border-t border-border/60 bg-muted/30 px-6 py-4">
              {footer ?? (
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
