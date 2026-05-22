import { useState } from "react";
import { Briefcase, CalendarClock, CreditCard, Plus, Users as UsersIcon, X } from "lucide-react";
import { SurfaceCard } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  companyStatusTone,
  planTone,
  type Company,
} from "@/lib/company-store";
import {
  userStore,
  useUsers,
  type UserRole,
  type UserStatus,
} from "@/lib/user-store";
import { UserTable } from "./UserTable";
import { UserForm, type UserFormValues } from "./UserForm";

export function CompanyDetail({ company }: { company: Company }) {
  const allUsers = useUsers();
  const users = allUsers.filter((u) => u.companyId === company.id);
  const [showForm, setShowForm] = useState(false);

  const handleAddUser = async (values: UserFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    userStore.addUser({
      companyId: company.id,
      name: values.name,
      email: values.email,
      role: values.role as UserRole,
      status: values.status as UserStatus,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{company.reference}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {company.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone={companyStatusTone[company.status]}>{company.status}</StatusBadge>
              <StatusBadge tone={planTone[company.plan]}>{company.plan}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Meta icon={Briefcase} label="Industry" value={company.industry} />
          <Meta icon={CreditCard} label="Plan" value={company.plan} />
          <Meta icon={UsersIcon} label="Users" value={String(users.length)} />
          <Meta icon={CalendarClock} label="Created" value={company.createdAt} />
        </div>
      </SurfaceCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Users in this company</h2>
            <span className="text-xs text-muted-foreground">{users.length} total</span>
          </div>
          <UserTable data={users} />
        </div>

        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UsersIcon className="h-4 w-4 text-muted-foreground" /> Add User
            </h2>
            {showForm && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showForm ? (
            <div className="mt-4">
              <UserForm onSubmit={handleAddUser} onCancel={() => setShowForm(false)} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 text-sm font-medium text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4" /> New user
            </button>
          )}
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
  icon: typeof Briefcase;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
