import { z } from "zod";

export const auditSchema = z.object({
  title: z.string().trim().min(4, "Title is too short").max(120, "Too long"),
  description: z.string().trim().min(1, "Description is required").max(2000),
  assignee: z.string().min(1, "Select an assignee"),
  dueDate: z.string().min(1, "Select a due date"),
  priority: z.enum(["Low", "Medium", "High"]),
});
export type AuditSchema = z.infer<typeof auditSchema>;

export const incidentSchema = z.object({
  title: z.string().trim().min(4, "Title is too short").max(120),
  description: z.string().trim().min(1, "Description is required").max(2000),
  facility: z.string().min(1, "Select a facility"),
  reportedBy: z.string().min(1, "Select a reporter"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  attachments: z.array(z.string()),
});
export type IncidentSchema = z.infer<typeof incidentSchema>;

export const facilitySchema = z.object({
  name: z.string().trim().min(1, "Facility name is required").max(120),
  type: z.enum(["Office", "Plant", "Warehouse"], { message: "Select a type" }),
  location: z.string().trim().min(1, "Location is required").max(160),
  manager: z.string().min(1, "Select a manager"),
  status: z.enum(["Active", "Under Maintenance"]),
  notes: z.string().max(2000),
});
export type FacilitySchema = z.infer<typeof facilitySchema>;

export const companySchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(120),
  industry: z.string().min(1, "Select an industry"),
  plan: z.enum(["Basic", "Pro", "Enterprise"]),
  status: z.enum(["Active", "Suspended"]),
});
export type CompanySchema = z.infer<typeof companySchema>;

export const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  role: z.enum(["Admin", "Manager", "User"]),
  status: z.enum(["Active", "Disabled"]),
});
export type UserSchema = z.infer<typeof userSchema>;

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone: z.string().trim().max(40),
});
export type ProfileSchema = z.infer<typeof profileSchema>;

export const preferencesSchema = z.object({
  language: z.enum(["en", "es", "fr", "de", "pt"]),
  timezone: z.string().min(1),
});
export type PreferencesSchema = z.infer<typeof preferencesSchema>;

export const notificationsSchema = z.object({
  auditUpdates: z.boolean(),
  incidentAlerts: z.boolean(),
  maintenanceReminders: z.boolean(),
  emailNotifications: z.boolean(),
});
export type NotificationsSchema = z.infer<typeof notificationsSchema>;
