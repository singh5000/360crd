import { Building2, CalendarClock, FileText, MapPin, User } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  facilityStatusTone,
  facilityTypeTone,
  type Facility,
} from "@/lib/facility-store";
import { MaintenanceLog } from "./MaintenanceLog";

export function FacilityDetail({ facility }: { facility: Facility }) {
  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{facility.reference}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {facility.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone={facilityStatusTone[facility.status]}>{facility.status}</StatusBadge>
              <StatusBadge tone={facilityTypeTone[facility.type]}>{facility.type}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Meta icon={Building2} label="Type" value={facility.type} />
          <Meta icon={MapPin} label="Location" value={facility.location} />
          <Meta icon={User} label="Manager" value={facility.manager} />
          <Meta icon={CalendarClock} label="Last Maintenance" value={facility.lastMaintenance} />
        </div>
      </SurfaceCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MaintenanceLog facility={facility} />
        </div>

        <SurfaceCard className="p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" /> Notes
          </h2>
          {facility.notes ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {facility.notes}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-muted-foreground">No notes recorded.</p>
          )}
          <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            Onboarded {facility.createdAt}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
