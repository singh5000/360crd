import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  ShieldAlert,
  UserPlus,
} from "lucide-react";

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: typeof Activity;
  hint: string;
};

export const kpis: KpiCard[] = [
  {
    id: "audits",
    label: "Total Audits",
    value: "1,284",
    delta: "+12.4%",
    trend: "up",
    icon: ClipboardCheck,
    hint: "vs. last quarter",
  },
  {
    id: "incidents",
    label: "Open Incidents",
    value: "37",
    delta: "-8.1%",
    trend: "down",
    icon: ShieldAlert,
    hint: "9 high severity",
  },
  {
    id: "facilities",
    label: "Active Facilities",
    value: "62",
    delta: "+3",
    trend: "up",
    icon: Building2,
    hint: "across 14 regions",
  },
  {
    id: "actions",
    label: "Pending Actions",
    value: "148",
    delta: "+5.2%",
    trend: "up",
    icon: Clock,
    hint: "23 overdue",
  },
];

export type Activity = {
  id: string;
  title: string;
  meta: string;
  time: string;
  icon: typeof Activity;
  tone: "success" | "warning" | "info" | "danger";
};

export const recentActivity: Activity[] = [
  {
    id: "a1",
    title: "Quarterly compliance audit closed",
    meta: "Northwind Logistics · Hamburg DC-04",
    time: "12 min ago",
    icon: CheckCircle2,
    tone: "success",
  },
  {
    id: "a2",
    title: "High-severity incident reported",
    meta: "Acme Manufacturing · Plant 7",
    time: "48 min ago",
    icon: AlertTriangle,
    tone: "danger",
  },
  {
    id: "a3",
    title: "New facility onboarded",
    meta: "Helix Biotech · Boston Lab",
    time: "2 h ago",
    icon: Building2,
    tone: "info",
  },
  {
    id: "a4",
    title: "Auditor invited to workspace",
    meta: "Priya Raman · Senior Inspector",
    time: "5 h ago",
    icon: UserPlus,
    tone: "info",
  },
  {
    id: "a5",
    title: "Corrective action plan submitted",
    meta: "Vantage Energy · Refinery South",
    time: "Yesterday",
    icon: FileText,
    tone: "warning",
  },
];

export type StatusOverview = {
  id: string;
  label: string;
  value: number;
  total: number;
  tone: "success" | "warning" | "info" | "danger";
  description: string;
};

export const statusOverview: StatusOverview[] = [
  {
    id: "compliance",
    label: "Compliance Score",
    value: 92,
    total: 100,
    tone: "success",
    description: "Above industry benchmark of 84%",
  },
  {
    id: "audits-progress",
    label: "Audits in Progress",
    value: 38,
    total: 60,
    tone: "info",
    description: "22 scheduled this week",
  },
  {
    id: "incident-resolution",
    label: "Incident Resolution SLA",
    value: 76,
    total: 100,
    tone: "warning",
    description: "Target: 85% within 72h",
  },
];

export type AuditRow = {
  id: string;
  reference: string;
  facility: string;
  company: string;
  auditor: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Overdue";
  date: string;
};

export const auditRows: AuditRow[] = [
  { id: "1", reference: "AUD-2049", facility: "Hamburg DC-04", company: "Northwind Logistics", auditor: "M. Lindqvist", status: "Completed", date: "Apr 22, 2026" },
  { id: "2", reference: "AUD-2050", facility: "Plant 7", company: "Acme Manufacturing", auditor: "P. Raman", status: "In Progress", date: "Apr 24, 2026" },
  { id: "3", reference: "AUD-2051", facility: "Boston Lab", company: "Helix Biotech", auditor: "J. Okafor", status: "Scheduled", date: "May 02, 2026" },
  { id: "4", reference: "AUD-2052", facility: "Refinery South", company: "Vantage Energy", auditor: "S. Martinez", status: "Overdue", date: "Apr 18, 2026" },
  { id: "5", reference: "AUD-2053", facility: "Warehouse 12", company: "Meridian Retail", auditor: "K. Tanaka", status: "Completed", date: "Apr 20, 2026" },
];
