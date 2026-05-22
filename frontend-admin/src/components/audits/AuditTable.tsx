import { Link } from "@tanstack/react-router";
import { ClipboardList, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/datatable/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { auditStore, type Audit, type AuditStatus } from "@/lib/audit-store";

const statusToneMap: Record<AuditStatus, "success" | "info" | "warning" | "danger"> = {
  Completed: "success",
  "In Progress": "info",
  Planned: "warning",
  Overdue: "danger",
};

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Planned", value: "Planned" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Overdue", value: "Overdue" },
];

const PRIORITY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export function AuditTable({
  data,
  onView,
  onEdit,
}: {
  data: Audit[];
  onView?: (a: Audit) => void;
  onEdit?: (a: Audit) => void;
}) {
  const columns: ColumnDef<Audit>[] = [
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
      minWidth: 240,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{r.title}</p>
          <p className="truncate text-xs text-muted-foreground">{r.priority} priority</p>
        </div>
      ),
    },
    { id: "assignee", header: "Assigned To", sortable: true, width: 170 },
    {
      id: "dueDate",
      header: "Due Date",
      sortable: true,
      width: 130,
      cell: (r) => <span className="text-muted-foreground">{r.dueDate}</span>,
    },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      width: 120,
      cell: (r) => <span className="text-foreground/90">{r.priority}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: 150,
      cell: (r) => <StatusBadge tone={statusToneMap[r.status]}>{r.status}</StatusBadge>,
    },
    {
      id: "actions",
      header: "Actions",
      width: 130,
      align: "right",
      enableHiding: false,
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView?.(r)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="View audit"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(r)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Edit audit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<Audit>
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      storageKey="audits"
      searchPlaceholder="Search audits by title, reference, assignee…"
      searchAccessor={(r) => `${r.reference} ${r.title} ${r.assignee}`}
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
          id: "complete",
          label: "Mark completed",
          onClick: (rows) => rows.forEach((r) => auditStore.updateAudit(r.id, { status: "Completed" })),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          onClick: (rows) => rows.forEach((r) => auditStore.removeAudit(r.id)),
        },
      ]}
      initialSort={{ id: "dueDate", dir: "desc" }}
      exportFilename="audits"
      emptyIcon={<ClipboardList className="h-6 w-6" />}
      emptyTitle="No audits found"
      emptyDescription="Adjust filters or create a new audit to get started."
      emptyAction={
        <Link
          to="/audits/create"
          className="inline-flex h-10 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
        >
          Create Audit
        </Link>
      }
    />
  );
}
