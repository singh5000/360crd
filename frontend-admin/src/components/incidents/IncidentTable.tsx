import { Link } from "@tanstack/react-router";
import { Eye, Inbox, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/datatable/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { incidentStore, priorityTone, statusTone, type Incident } from "@/lib/incident-store";

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
  { label: "Escalated", value: "Escalated" },
];

const PRIORITY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
];

export function IncidentTable({ data }: { data: Incident[] }) {
  const columns: ColumnDef<Incident>[] = [
    {
      id: "reference",
      header: "Reference",
      sortable: true,
      width: 130,
      cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.reference}</span>,
    },
    {
      id: "title",
      header: "Title",
      sortable: true,
      minWidth: 260,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{r.title}</p>
          <p className="truncate text-xs text-muted-foreground">{r.facility}</p>
        </div>
      ),
    },
    { id: "reportedBy", header: "Reported By", sortable: true, width: 170 },
    {
      id: "createdAt",
      header: "Date",
      sortable: true,
      width: 130,
      cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span>,
    },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      width: 130,
      cell: (r) => <StatusBadge tone={priorityTone[r.priority]}>{r.priority}</StatusBadge>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: 150,
      cell: (r) => <StatusBadge tone={statusTone[r.status]}>{r.status}</StatusBadge>,
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
            to="/incidents/$id"
            params={{ id: r.id }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 px-2.5 text-xs font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
            aria-label={`View incident ${r.reference}`}
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable<Incident>
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      storageKey="incidents"
      searchPlaceholder="Search incidents by title, reference, facility…"
      searchAccessor={(r) => `${r.reference} ${r.title} ${r.facility} ${r.reportedBy}`}
      filters={[
        { id: "status", label: "Status", options: STATUS_OPTIONS },
        { id: "priority", label: "Priority", options: PRIORITY_OPTIONS },
      ]}
      filterPredicates={{
        status: (r, v) => r.status === v,
        priority: (r, v) => r.priority === v,
      }}
      enableSelection
      bulkActions={[
        {
          id: "resolve",
          label: "Mark resolved",
          onClick: (rows) => rows.forEach((r) => incidentStore.updateIncident(r.id, { status: "Resolved" })),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          onClick: (rows) => rows.forEach((r) => incidentStore.removeIncident(r.id)),
        },
      ]}
      initialSort={{ id: "createdAt", dir: "desc" }}
      exportFilename="incidents"
      emptyIcon={<Inbox className="h-6 w-6" />}
      emptyTitle="No incidents to show"
      emptyDescription="Adjust your filters or report a new incident to populate the queue."
      emptyAction={
        <Link
          to="/incidents/create"
          className="inline-flex h-10 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
        >
          Report Incident
        </Link>
      }
    />
  );
}
