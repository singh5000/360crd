import { Link } from "@tanstack/react-router";
import { Building, Eye } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/datatable/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { companyStatusTone, planTone, type Company } from "@/lib/company-store";
import { useUsers } from "@/lib/user-store";

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
];

const PLAN_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Basic", value: "Basic" },
  { label: "Pro", value: "Pro" },
  { label: "Enterprise", value: "Enterprise" },
];

export function CompanyTable({ data }: { data: Company[] }) {
  const users = useUsers();
  const userCountFor = (companyId: string) =>
    users.filter((u) => u.companyId === companyId).length;

  const columns: ColumnDef<Company>[] = [
    {
      id: "reference",
      header: "Company ID",
      sortable: true,
      width: 130,
      cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.reference}</span>,
    },
    {
      id: "name",
      header: "Name",
      sortable: true,
      minWidth: 220,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.industry}</p>
        </div>
      ),
    },
    { id: "industry", header: "Industry", sortable: true, width: 160 },
    {
      id: "plan",
      header: "Plan",
      sortable: true,
      width: 130,
      cell: (r) => <StatusBadge tone={planTone[r.plan]}>{r.plan}</StatusBadge>,
    },
    {
      id: "users",
      header: "Users",
      width: 90,
      accessor: (r) => userCountFor(r.id),
      sortable: true,
      cell: (r) => <span className="font-mono text-sm text-foreground">{userCountFor(r.id)}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: 140,
      cell: (r) => <StatusBadge tone={companyStatusTone[r.status]}>{r.status}</StatusBadge>,
    },
    {
      id: "createdAt",
      header: "Created",
      sortable: true,
      width: 130,
      cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span>,
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
            to="/companies/$id"
            params={{ id: r.id }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 px-2.5 text-xs font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
            aria-label={`View company ${r.reference}`}
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable<Company>
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      storageKey="companies"
      searchPlaceholder="Search companies by name, ID, industry…"
      searchAccessor={(r) => `${r.reference} ${r.name} ${r.industry}`}
      filters={[
        { id: "status", label: "Status", options: STATUS_OPTIONS },
        { id: "plan", label: "Plan", options: PLAN_OPTIONS },
      ]}
      filterPredicates={{
        status: (r, v) => r.status === v,
        plan: (r, v) => r.plan === v,
      }}
      initialSort={{ id: "name", dir: "asc" }}
      exportFilename="companies"
      emptyIcon={<Building className="h-6 w-6" />}
      emptyTitle="No companies found"
      emptyDescription="Adjust your search or onboard a new tenant company to get started."
    />
  );
}
