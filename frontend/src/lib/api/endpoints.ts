/**
 * Centralized API endpoint registry.
 * Base URL → VITE_API_BASE_URL (http://localhost:3000/api/v1).
 *
 * NAMING NOTE:
 *   Frontend "companies"  → API "/customers" (not /tenants — those are super-admin only)
 *   Frontend "facilities" → API "/sites"
 */
export const ENDPOINTS = {
  public: {
    branding: "/public/branding",
    health:   "/public/health",
  },

  auth: {
    login:          "/auth/login",
    logout:         "/auth/logout",
    me:             "/auth/me",
    refresh:        "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword:  "/auth/reset-password",
    changePassword: "/auth/change-password",
    register:       "/auth/register",
    verifyEmail:    "/auth/verify-email",
  },

  users: {
    list:         "/users",
    me:           "/users/me",
    detail:       (id: string) => `/users/${id}`,
    create:       "/users",
    update:       (id: string) => `/users/${id}`,
    remove:       (id: string) => `/users/${id}`,
    status:       (id: string) => `/users/${id}/status`,
    roles:        (id: string) => `/users/${id}/roles`,
    revokeRole:   (id: string, roleId: string) => `/users/${id}/roles/${roleId}`,
    resendInvite: (id: string) => `/users/${id}/resend-invite`,
    sites:        (id: string) => `/users/${id}/sites`,
  },

  tenants: {
    list:   "/tenants",
    detail: (id: string) => `/tenants/${id}`,
    create: "/tenants",
    update: (id: string) => `/tenants/${id}`,
    remove: (id: string) => `/tenants/${id}`,
    status: (id: string) => `/tenants/${id}/status`,
    stats:  (id: string) => `/tenants/${id}/stats`,
  },

  customers: {
    list:   "/customers",
    detail: (id: string) => `/customers/${id}`,
    create: "/customers",
    update: (id: string) => `/customers/${id}`,
    remove: (id: string) => `/customers/${id}`,
    stats:  "/customers/stats",
  },

  sites: {
    list:   "/sites",
    detail: (id: string) => `/sites/${id}`,
    create: "/sites",
    update: (id: string) => `/sites/${id}`,
    remove: (id: string) => `/sites/${id}`,
    stats:  "/sites/stats",
  },

  incidents: {
    list:    "/incidents",
    detail:  (id: string) => `/incidents/${id}`,
    create:  "/incidents",
    update:  (id: string) => `/incidents/${id}`,
    remove:  (id: string) => `/incidents/${id}`,
    stats:   "/incidents/stats",
    assign:  (id: string) => `/incidents/${id}/assign`,
    close:   (id: string) => `/incidents/${id}/close`,
    cancel:  (id: string) => `/incidents/${id}/cancel`,
    investigate: (id: string) => `/incidents/${id}/investigate`,
    evidence:    (id: string) => `/incidents/${id}/evidence`,
    evidenceItem:(id: string, eId: string) => `/incidents/${id}/evidence/${eId}`,
    capas:   (id: string) => `/incidents/${id}/capas`,
    capa:    (id: string, capaId: string) => `/incidents/${id}/capas/${capaId}`,
    capaVerify: (id: string, capaId: string) => `/incidents/${id}/capas/${capaId}/verify`,
  },

  audits: {
    list:       "/audits",
    detail:     (id: string) => `/audits/${id}`,
    create:     "/audits",
    update:     (id: string) => `/audits/${id}`,
    remove:     (id: string) => `/audits/${id}`,
    stats:      "/audits/stats",
    start:      (id: string) => `/audits/${id}/start`,
    complete:   (id: string) => `/audits/${id}/complete`,
    cancel:     (id: string) => `/audits/${id}/cancel`,
    responses:  (id: string) => `/audits/${id}/responses`,
    findings:   (id: string) => `/audits/${id}/findings`,
    finding:    (id: string, fId: string) => `/audits/${id}/findings/${fId}`,
    templates:  "/audit-templates",
    template:   (id: string) => `/audit-templates/${id}`,
  },

  training: {
    list:        "/training",
    detail:      (id: string) => `/training/${id}`,
    create:      "/training",
    update:      (id: string) => `/training/${id}`,
    remove:      (id: string) => `/training/${id}`,
    publish:     (id: string) => `/training/${id}/publish`,
    archive:     (id: string) => `/training/${id}/archive`,
    enroll:      (id: string) => `/training/${id}/enroll`,
    enrollBulk:  (id: string) => `/training/${id}/enroll/bulk`,
    unenroll:    (id: string, userId: string) => `/training/${id}/enrollment/${userId}`,
    enrollments: (id: string) => `/training/${id}/enrollments`,
    enrollment:  (id: string, userId: string) => `/training/${id}/enrollment/${userId}`,
    start:       (id: string) => `/training/${id}/start`,
    submit:      (id: string) => `/training/${id}/submit`,
    contents:    (id: string) => `/training/${id}/contents`,
    content:     (id: string, cId: string) => `/training/${id}/contents/${cId}`,
    questions:   (id: string) => `/training/${id}/questions`,
    question:    (id: string, qId: string) => `/training/${id}/questions/${qId}`,
    myEnrollments: "/training/my-enrollments",
    stats:       "/training/stats",
  },

  inductions: {
    list:        "/inductions",
    detail:      (id: string) => `/inductions/${id}`,
    create:      "/inductions",
    update:      (id: string) => `/inductions/${id}`,
    remove:      (id: string) => `/inductions/${id}`,
    publish:     (id: string) => `/inductions/${id}/publish`,
    enroll:      (id: string) => `/inductions/${id}/enroll`,
    enrollUser:  (id: string, userId: string) => `/inductions/${id}/enroll/${userId}`,
    enrollments: (id: string) => `/inductions/${id}/enrollments`,
    complete:    (id: string) => `/inductions/${id}/complete`,
    completeUser:(id: string, userId: string) => `/inductions/${id}/complete/${userId}`,
    myInductions: "/inductions/my-inductions",
    bySite:      (siteId: string) => `/inductions/site/${siteId}`,
  },

  ppe: {
    list:        "/ppe",
    detail:      (id: string) => `/ppe/${id}`,
    create:      "/ppe",
    update:      (id: string) => `/ppe/${id}`,
    remove:      (id: string) => `/ppe/${id}`,
    stats:       "/ppe/stats",
    assign:      (id: string) => `/ppe/${id}/assign`,
    return:      (id: string) => `/ppe/${id}/return`,
    assignments: (id: string) => `/ppe/${id}/assignments`,
    myPpe:       "/ppe/my-ppe",
  },

  assets: {
    list:        "/assets",
    detail:      (id: string) => `/assets/${id}`,
    create:      "/assets",
    update:      (id: string) => `/assets/${id}`,
    remove:      (id: string) => `/assets/${id}`,
    stats:       "/assets/stats",
    assign:      (id: string) => `/assets/${id}/assign`,
    return:      (id: string) => `/assets/${id}/return`,
    service:     (id: string) => `/assets/${id}/service`,
    assignments: (id: string) => `/assets/${id}/assignments`,
  },

  waste: {
    list:   "/waste",
    detail: (id: string) => `/waste/${id}`,
    create: "/waste",
    update: (id: string) => `/waste/${id}`,
    remove: (id: string) => `/waste/${id}`,
    status: (id: string) => `/waste/${id}/status`,
    stats:  "/waste/stats",
  },

  documents: {
    list:     "/documents",
    detail:   (id: string) => `/documents/${id}`,
    create:   "/documents",
    update:   (id: string) => `/documents/${id}`,
    remove:   (id: string) => `/documents/${id}`,
    publish:  (id: string) => `/documents/${id}/publish`,
    archive:  (id: string) => `/documents/${id}/archive`,
    versions: (id: string) => `/documents/${id}/versions`,
    stats:    "/documents/stats",
  },

  notifications: {
    list:        "/notifications",
    detail:      (id: string) => `/notifications/${id}`,
    markRead:    (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    remove:      (id: string) => `/notifications/${id}`,
    preferences: "/notifications/preferences",
    broadcast:   "/notifications/broadcast",
  },

  reports: {
    list:      "/reports",
    detail:    (id: string) => `/reports/${id}`,
    create:    "/reports",
    remove:    (id: string) => `/reports/${id}`,
    dashboard: "/reports/dashboard",
    trend:     "/reports/compliance-trend",
  },

  roles: {
    list:        "/roles",
    detail:      (id: string) => `/roles/${id}`,
    create:      "/roles",
    update:      (id: string) => `/roles/${id}`,
    remove:      (id: string) => `/roles/${id}`,
    permissions: "/roles/permissions",
    permissionsGrouped: "/roles/permissions/grouped",
    addPerm:     (id: string) => `/roles/${id}/permissions`,
    removePerm:  (id: string, permId: string) => `/roles/${id}/permissions/${permId}`,
    setPerm:     (id: string) => `/roles/${id}/permissions`,
    users:       (id: string) => `/roles/${id}/users`,
  },

  webhooks: {
    list:   "/webhooks",
    detail: (id: string) => `/webhooks/${id}`,
    create: "/webhooks",
    update: (id: string) => `/webhooks/${id}`,
    remove: (id: string) => `/webhooks/${id}`,
    toggle: (id: string) => `/webhooks/${id}/toggle`,
    test:   (id: string) => `/webhooks/${id}/test`,
    logs:   (id: string) => `/webhooks/${id}/logs`,
  },

  feedback: {
    list:   "/feedback",
    my:     "/feedback/my",
    detail: (id: string) => `/feedback/${id}`,
    create: "/feedback",
    update: (id: string) => `/feedback/${id}`,
    remove: (id: string) => `/feedback/${id}`,
    stats:  "/feedback/stats",
  },

  settings: {
    branding:            "/settings/branding",
    config:              "/settings/config",
    smtp:                "/settings/smtp",
    smtpTest:            "/settings/smtp/test",
    apiKeys:             "/settings/api-keys",
    apiKey:              (id: string) => `/settings/api-keys/${id}`,
    apiKeyRevoke:        (id: string) => `/settings/api-keys/${id}/revoke`,
    notifTemplates:      "/settings/notification-templates",
    notifTemplate:       (id: string) => `/settings/notification-templates/${id}`,
    sessions:            "/settings/sessions",
    session:             (id: string) => `/settings/sessions/${id}`,
  },

  activity: {
    list: "/activity",
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
