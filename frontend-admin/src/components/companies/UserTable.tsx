import { Power, PowerOff, Users as UsersIcon } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/datatable/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  roleTone,
  userStatusTone,
  userStore,
  type AppUser,
} from "@/lib/user-store";

const ROLE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "User", value: "User" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Disabled", value: "Disabled" },
];

export function UserTable({ data }: { data: AppUser[] }) {
  const columns: ColumnDef<AppUser>[] = [
    {
      id: "reference",
      header: "User ID",
      sortable: true,
      width: 120,
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
          <p className="truncate text-xs text-muted-foreground">{r.email}</p>
        </div>
      ),
    },
    { id: "email", header: "Email", sortable: true, width: 220 },
    {
      id: "role",
      header: "Role",
      sortable: true,
      width: 130,
      cell: (r) => <StatusBadge tone={roleTone[r.role]}>{r.role}</StatusBadge>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: 130,
      cell: (r) => <StatusBadge tone={userStatusTone[r.status]}>{r.status}</StatusBadge>,
    },
    {
      id: "actions",
      header: "Actions",
      width: 140,
      align: "right",
      enableHiding: false,
      cell: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => userStore.toggleUserStatus(r.id)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 px-2.5 text-xs font-medium text-foreground/80 transition-all hover:border-border hover:bg-accent hover:text-foreground"
          >
            {r.status === "Active" ? (
              <>
                <PowerOff className="h-3.5 w-3.5" /> Disable
              </>
            ) : (
              <>
                <Power className="h-3.5 w-3.5" /> Enable
              </>
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<AppUser>
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      storageKey="users"
      searchPlaceholder="Search users by name, email…"
      searchAccessor={(r) => `${r.reference} ${r.name} ${r.email}`}
      filters={[
        { id: "role", label: "Role", options: ROLE_OPTIONS },
        { id: "status", label: "Status", options: STATUS_OPTIONS },
      ]}
      filterPredicates={{
        role: (r, v) => r.role === v,
        status: (r, v) => r.status === v,
      }}
      enableSelection
      bulkActions={[
        {
          id: "enable",
          label: "Enable",
          onClick: (rows) =>
            rows.forEach((r) => r.status === "Disabled" && userStore.toggleUserStatus(r.id)),
        },
        {
          id: "disable",
          label: "Disable",
          variant: "destructive",
          onClick: (rows) =>
            rows.forEach((r) => r.status === "Active" && userStore.toggleUserStatus(r.id)),
        },
      ]}
      initialSort={{ id: "name", dir: "asc" }}
      exportFilename="users"
      emptyIcon={<UsersIcon className="h-5 w-5" />}
      emptyTitle="No users yet"
      emptyDescription="Add the first user to this company using the form on the right."
    />
  );
}
