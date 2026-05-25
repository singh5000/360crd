import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") }); // backend/.env

import { PrismaClient, UserType, TenantPlan, TenantStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── System Permissions ──────────────────────────────────────────────────────
  const resources = [
    "tenant", "user", "role", "site", "customer",
    "incident", "audit", "audit_template", "training",
    "induction", "ppe", "asset", "waste", "document",
    "notification", "report", "activity_log", "audit_log",
    "api_key", "webhook", "feedback",
  ];
  const actions = ["create", "read", "update", "delete", "approve", "export", "assign"];

  for (const resource of resources) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: { resource_action_scope: { resource, action, scope: "TENANT" } },
        update: {},
        create: { resource, action, scope: "TENANT", description: `${action} ${resource}` },
      });
    }
  }

  console.log("✅ Permissions seeded");

  // ── System Roles (tenantId = null → use findFirst+create, not upsert) ─────────
  async function findOrCreateSystemRole(data: {
    slug: string; name: string; description: string;
    level: number; isDefault?: boolean;
  }) {
    const existing = await prisma.role.findFirst({ where: { slug: data.slug, tenantId: null } });
    if (existing) return existing;
    return prisma.role.create({ data: { ...data, tenantId: null, isSystem: true } });
  }

  const superAdminRole = await findOrCreateSystemRole({
    slug: "super_admin", name: "Super Admin",
    description: "Platform super administrator", level: 100,
  });

  const tenantAdminRole = await findOrCreateSystemRole({
    slug: "tenant_admin", name: "Tenant Admin",
    description: "Tenant administrator with full tenant access", level: 80,
  });

  const managerRole = await findOrCreateSystemRole({
    slug: "manager", name: "Manager",
    description: "Manager with operational access", level: 60,
  });

  const staffRole = await findOrCreateSystemRole({
    slug: "staff", name: "Staff",
    description: "Regular staff member", level: 20, isDefault: true,
  });

  console.log("✅ System roles seeded");

  const customerRole = await findOrCreateSystemRole({
    slug: "customer", name: "Customer",
    description: "Customer with read-only site and compliance visibility", level: 10,
  });

  console.log("✅ System roles seeded");

  // Helper — assign a permission set to a role
  async function assignPerms(roleId: string, matrix: Record<string, string[]>) {
    for (const [resource, actions] of Object.entries(matrix)) {
      for (const action of actions) {
        const perm = await prisma.permission.findUnique({
          where: { resource_action_scope: { resource, action, scope: "TENANT" } },
        });
        if (!perm) continue;
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId: perm.id } },
          update: {},
          create: { roleId, permissionId: perm.id },
        });
      }
    }
  }

  // ── Super Admin — full system control + read-only on operational modules ─────
  // Operational day-to-day modules: Manager creates/approves, Super Admin views
  await assignPerms(superAdminRole.id, {
    // System / admin resources — full control
    tenant:       ["create", "read", "update", "delete", "export"],
    user:         ["create", "read", "update", "delete", "assign"],
    role:         ["create", "read", "update", "delete", "assign"],
    site:         ["create", "read", "update", "delete", "assign"],
    customer:     ["create", "read", "update", "delete"],
    notification: ["create", "read", "update", "delete"],
    report:       ["read", "export"],
    activity_log: ["read", "export"],
    audit_log:    ["read", "export"],
    api_key:      ["create", "read", "update", "delete"],
    webhook:      ["create", "read", "update", "delete"],
    feedback:     ["read", "update", "delete"],
    // Operational modules — read/export only (Manager does the actions)
    incident:       ["read", "export"],
    audit:          ["read", "export"],
    audit_template: ["read"],
    training:       ["read", "export"],
    induction:      ["read", "export"],
    ppe:            ["read", "export"],
    asset:          ["read", "export"],
    waste:          ["read", "export"],
    document:       ["read", "export"],
  });

  // ── Tenant Admin — same pattern scoped to tenant (no cross-tenant mgmt) ──────
  await assignPerms(tenantAdminRole.id, {
    // Admin resources — full control within tenant
    user:         ["create", "read", "update", "delete", "assign"],
    role:         ["read", "update", "assign"],
    site:         ["create", "read", "update", "delete", "assign"],
    customer:     ["create", "read", "update", "delete"],
    notification: ["create", "read", "update", "delete"],
    report:       ["read", "export"],
    activity_log: ["read", "export"],
    audit_log:    ["read", "export"],
    api_key:      ["create", "read", "update", "delete"],
    webhook:      ["create", "read", "update", "delete"],
    feedback:     ["read", "update"],
    // Operational modules — read/export only
    incident:       ["read", "export"],
    audit:          ["read", "export"],
    audit_template: ["read"],
    training:       ["read", "export"],
    induction:      ["read", "export"],
    ppe:            ["read", "export"],
    asset:          ["read", "export"],
    waste:          ["read", "export"],
    document:       ["read", "export"],
  });

  // ── Manager — operational control over assigned sites ────────────────────────
  await assignPerms(managerRole.id, {
    site:           ["create", "read", "update", "delete"],
    customer:       ["read"],
    user:           ["read", "assign"],
    incident:       ["create", "read", "update", "assign", "approve"],
    audit:          ["create", "read", "update", "assign", "approve"],
    audit_template: ["create", "read", "update"],
    training:       ["create", "read", "update", "assign"],
    induction:      ["create", "read", "update", "assign"],
    ppe:            ["create", "read", "update", "assign"],
    asset:          ["create", "read", "update", "assign"],
    waste:          ["create", "read", "update"],
    document:       ["create", "read", "update", "delete"],
    notification:   ["read"],
    report:         ["read", "export"],
    activity_log:   ["read"],
    feedback:       ["read", "update"],
  });

  // ── Staff — task execution, own data only ────────────────────────────────────
  await assignPerms(staffRole.id, {
    site:         ["read"],
    incident:     ["create", "read", "update"],
    audit:        ["read", "update"],
    training:     ["read"],
    induction:    ["read"],
    ppe:          ["read"],
    asset:        ["read"],
    waste:        ["create", "read"],
    document:     ["create", "read"],
    notification: ["read"],
    report:       ["read"],
  });

  // ── Customer — read-only visibility ──────────────────────────────────────────
  await assignPerms(customerRole.id, {
    site:         ["read"],
    incident:     ["read"],
    audit:        ["read"],
    report:       ["read", "export"],
    document:     ["read"],
    notification: ["read"],
    feedback:     ["create", "read"],
  });

  console.log("✅ Role permissions assigned");

  // ── System Tenant ─────────────────────────────────────────────────────────────
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: "system" },
    update: {},
    create: {
      slug: "system",
      name: "360CRD Platform",
      legalName: "360CRD Platform Pty Ltd",
      plan: TenantPlan.WHITE_LABEL,
      status: TenantStatus.ACTIVE,
      country: "AU",
      timezone: "Australia/Sydney",
      maxUsers: 9999,
      maxSites: 9999,
    },
  });

  // ── Super Admin User ──────────────────────────────────────────────────────────
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@360crd.io";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@360!";
  const passwordHash = await bcrypt.hash(superAdminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: systemTenant.id, email: superAdminEmail } },
    update: {},
    create: {
      tenantId: systemTenant.id,
      email: superAdminEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash,
      firstName: process.env.SUPER_ADMIN_FIRST_NAME || "Super",
      lastName: process.env.SUPER_ADMIN_LAST_NAME || "Admin",
      type: UserType.SUPER_ADMIN,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
      tenantId: systemTenant.id,
      assignedBy: superAdmin.id,
    },
  });

  console.log(`✅ Super admin created: ${superAdminEmail}`);

  // ── Demo Tenant ───────────────────────────────────────────────────────────────
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "demo-corp" },
    update: {},
    create: {
      slug: "demo-corp",
      name: "Demo Corporation",
      legalName: "Demo Corporation Pty Ltd",
      subdomain: "demo",
      plan: TenantPlan.ENTERPRISE,
      status: TenantStatus.ACTIVE,
      industry: "Construction",
      country: "AU",
      timezone: "Australia/Sydney",
      maxUsers: 200,
      maxSites: 50,
    },
  });

  await prisma.tenantBranding.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      appName: "Demo EHS",
      primaryColor: "#1E40AF",
      secondaryColor: "#7C3AED",
    },
  });

  await prisma.tenantConfig.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      features: { incidents: true, audits: true, training: true, ppe: true, assets: true },
    },
  });

  console.log(`✅ Demo tenant created: ${demoTenant.slug}`);

  // ── Demo Admin User ───────────────────────────────────────────────────────────
  const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL || "admin@demo-corp.com";
  const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD || "Demo@360!";
  const demoAdminHash = await bcrypt.hash(demoAdminPassword, 12);

  const demoAdmin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: demoAdminEmail } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: demoAdminEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash: demoAdminHash,
      firstName: "Demo",
      lastName: "Admin",
      type: UserType.STAFF,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demoAdmin.id, roleId: tenantAdminRole.id } },
    update: {},
    create: {
      userId: demoAdmin.id,
      roleId: tenantAdminRole.id,
      tenantId: demoTenant.id,
      assignedBy: demoAdmin.id,
    },
  });

  console.log(`✅ Demo admin created: ${demoAdminEmail}`);

  // ── Demo Manager User ─────────────────────────────────────────────────────────
  const demoManagerEmail = process.env.DEMO_MANAGER_EMAIL || "manager@demo-corp.com";
  const demoManagerPassword = process.env.DEMO_MANAGER_PASSWORD || "Manager@360!";
  const demoManagerHash = await bcrypt.hash(demoManagerPassword, 12);

  const demoManager = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: demoManagerEmail } },
    update: { type: UserType.MANAGER },
    create: {
      tenantId: demoTenant.id,
      email: demoManagerEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash: demoManagerHash,
      firstName: "Demo",
      lastName: "Manager",
      type: UserType.MANAGER,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demoManager.id, roleId: managerRole.id } },
    update: {},
    create: {
      userId: demoManager.id,
      roleId: managerRole.id,
      tenantId: demoTenant.id,
      assignedBy: demoAdmin.id,
    },
  });

  console.log(`✅ Demo manager created: ${demoManagerEmail}`);

  // ── Demo Staff User ───────────────────────────────────────────────────────────
  const demoStaffEmail = process.env.DEMO_STAFF_EMAIL || "staff@demo-corp.com";
  const demoStaffPassword = process.env.DEMO_STAFF_PASSWORD || "Staff@360!";
  const demoStaffHash = await bcrypt.hash(demoStaffPassword, 12);

  const demoStaff = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: demoStaffEmail } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: demoStaffEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash: demoStaffHash,
      firstName: "Demo",
      lastName: "Staff",
      type: UserType.STAFF,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demoStaff.id, roleId: staffRole.id } },
    update: {},
    create: {
      userId: demoStaff.id,
      roleId: staffRole.id,
      tenantId: demoTenant.id,
      assignedBy: demoAdmin.id,
    },
  });

  console.log(`✅ Demo staff created: ${demoStaffEmail}`);

  // ── Demo Customer User ────────────────────────────────────────────────────────
  const demoCustomerEmail = process.env.DEMO_CUSTOMER_EMAIL || "customer@demo-corp.com";
  const demoCustomerPassword = process.env.DEMO_CUSTOMER_PASSWORD || "Customer@360!";
  const demoCustomerHash = await bcrypt.hash(demoCustomerPassword, 12);

  const demoCustomer = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: demoCustomerEmail } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: demoCustomerEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      passwordHash: demoCustomerHash,
      firstName: "Demo",
      lastName: "Customer",
      type: UserType.CUSTOMER,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demoCustomer.id, roleId: customerRole.id } },
    update: {},
    create: {
      userId: demoCustomer.id,
      roleId: customerRole.id,
      tenantId: demoTenant.id,
      assignedBy: demoAdmin.id,
    },
  });

  console.log(`✅ Demo customer created: ${demoCustomerEmail}`);
  console.log("🎉 Seed complete!");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
