import { Link } from "@tanstack/react-router";
import { Building2, Eye, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/datatable/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  facilityStatusTone,
  facilityStore,
  facilityTypeTone,
  type Facility,
} from "@/lib/facility-store";

const TYPE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Office", value: "Office" },
  { label: "Plant", value: "Plant" },
  { label: "Warehouse", value: "Warehouse" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Under Maintenance", value: "Under Maintenance" },
];

export function FacilityTable({ data }: { data: Facility[] }) {
  const columns: ColumnDef<Facility>[] = [
    {
      id: "reference",
      header: "ID",
      sortable: true,
      width: 120,
      cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.reference}</span>,
    },
    {
      id: "name",
      header: "Name",
      sortable: true,
      minWidth: 240,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.manager}</p>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      sortable: true,
      width: 130,
      cell: (r) => <StatusBadge tone={facilityTypeTone[r.type]}>{r.type}</StatusBadge>,
    },
    {
      id: "location",
      header: "Location",
      sortable: true,
      width: 200,
      cell: (r) => <span className="text-foreground/90">{r.location}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: 180,
      cell: (r) => <StatusBadge tone={facilityStatusTone[r.status]}>{r.status}</StatusBadge>,
    },
    {
      id: "lastMaintenance",
      header: "Last Maintenance",
      sortable: true,
      width: 160,
      cell: (r) => <span className="text-muted-foreground">{r.lastMaintenance}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      width: 110,
      align: "right",
      enableHiding: false,
      cell: (r) => (
        <div className="flex items-center justify-end">
          <Link
            to="/facilities/$id"
            params={{ id: r.id }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 px-2.5 text-xs font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
            aria-label={`View facility ${r.reference}`}
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable<Facility>
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      storageKey="facilities"
      searchPlaceholder="Search facilities by name, location, manager…"
      searchAccessor={(r) => `${r.reference} ${r.name} ${r.location} ${r.manager}`}
      filters={[
        { id: "type", label: "Type", options: TYPE_OPTIONS },
        { id: "status", label: "Status", options: STATUS_OPTIONS },
      ]}
      filterPredicates={{
        type: (r, v) => r.type === v,
        status: (r, v) => r.status === v,
      }}
      enableSelection
      bulkActions={[
        {
          id: "activate",
          label: "Set Active",
          onClick: (rows) =>
            rows.forEach((r) => facilityStore.updateFacility(r.id, { status: "Active" })),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          onClick: (rows) => rows.forEach((r) => facilityStore.removeFacility(r.id)),
        },
      ]}
      initialSort={{ id: "name", dir: "asc" }}
      exportFilename="facilities"
      emptyIcon={<Building2 className="h-6 w-6" />}
      emptyTitle="No facilities to show"
      emptyDescription="Adjust your filters or add a new facility to expand your operational footprint."
      emptyAction={
        <Link
          to="/facilities/create"
          className="inline-flex h-10 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
        >
          Add Facility
        </Link>
      }
    />
  );
}
