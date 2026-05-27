import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@360crd/shared-types";
import { sessionCache, permissionCache } from "@360crd/cache";
import { basePrisma, tenantContext } from "@360crd/database";
import { config } from "../config";
import {
  UnauthorizedError,
  InvalidTokenError,
  TokenExpiredError,
} from "../shared/errors/http.errors";

// ─────────────────────────────────────────────────────────────────────────────
// JWT Authentication Middleware
// Validates access token, loads session + permissions
// ─────────────────────────────────────────────────────────────────────────────
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.slice(7);
  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, config.auth.jwtSecret, {
      issuer: config.auth.issuer,
      audience: config.auth.audience,
    }) as JwtPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") throw new TokenExpiredError();
    throw new InvalidTokenError();
  }

  // Verify session is still active in Redis
  const sessionKey = `sess:${payload.sid}`;
  const sessionActive = await sessionCache.exists(sessionKey);
  if (!sessionActive) {
    throw new InvalidTokenError();
  }

  // Load permissions (cached)
  const permissions = await getPermissions(payload.sub, payload.tid, payload.roles);

  // For superadmin: allow the admin panel to scope requests to a specific tenant
  // via X-Tenant-ID header (sent when the admin selects a company in the header).
  const isSuperAdmin = payload.typ === "SUPER_ADMIN";
  const headerTenantId = (request.headers["x-tenant-id"] as string | undefined)?.trim();
  const tenantOverrideActive = isSuperAdmin && !!headerTenantId;
  const effectiveTenantId = tenantOverrideActive ? headerTenantId! : payload.tid;

  // Attach to request
  (request as any).userId = payload.sub;
  (request as any).tenantId = effectiveTenantId;
  (request as any).tenantSlug = payload.tsl;
  (request as any).sessionId = payload.sid;
  (request as any).customerId = payload.cid ?? null;
  (request as any).userType = payload.typ;
  (request as any).roles = payload.roles;
  (request as any).permissions = permissions;
  (request as any).isSuperAdmin = isSuperAdmin;

  // Wire Prisma tenant isolation.
  // - Superadmin with a selected tenant (X-Tenant-ID header): apply filter to that
  //   tenant so reads/writes land in the correct company context.
  // - Superadmin without selection: bypass Prisma filter so cross-tenant operations
  //   (e.g. listing all tenants/feedback) still work. Routes that always apply
  //   `tenantId: r.tenantId` will fall back to the admin's own system tenant.
  tenantContext.enterWith({
    tenantId: effectiveTenantId,
    userId: payload.sub,
    sessionId: payload.sid,
    skipTenantFilter: isSuperAdmin && !tenantOverrideActive,
  });

  // Refresh session TTL on activity
  await sessionCache.expire(sessionKey, 3600);
}

// ─────────────────────────────────────────────────────────────────────────────
// Optional auth — sets user if token present but doesn't fail if not
// ─────────────────────────────────────────────────────────────────────────────
export async function authenticateOptional(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      await authenticate(request, _reply);
    }
  } catch {
    // silently ignore — optional auth
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API Key authentication (for external integrations)
// ─────────────────────────────────────────────────────────────────────────────
export async function authenticateApiKey(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const apiKey =
    (request.headers["x-api-key"] as string) ||
    (request.query as any)?.apiKey;

  if (!apiKey) throw new UnauthorizedError();

  const { createHash } = await import("crypto");
  const keyHash = createHash("sha256").update(apiKey).digest("hex");

  const record = await basePrisma.apiKey.findUnique({
    where: { keyHash },
    include: { tenant: { select: { id: true, slug: true, status: true } } },
  });

  if (!record || !record.isActive) throw new InvalidTokenError();
  if (record.expiresAt && record.expiresAt < new Date()) throw new TokenExpiredError();

  // Update last used
  await basePrisma.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });

  (request as any).tenantId = record.tenantId;
  (request as any).tenantSlug = record.tenant.slug;
  (request as any).permissions = record.permissions;
  (request as any).isApiKeyAuth = true;
}

// ── Permission cache ───────────────────────────────────────────────────────
async function getPermissions(
  userId: string,
  tenantId: string,
  roles: string[]
): Promise<string[]> {
  const cacheKey = `perms:${userId}:${tenantId}`;
  const cached = await permissionCache.get<string[]>(cacheKey);
  if (cached) return cached;

  const userRoles = await basePrisma.userRole.findMany({
    where: { userId, tenantId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();
  for (const ur of userRoles) {
    for (const rp of ur.role.permissions) {
      permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
    }
  }

  const permArray = Array.from(permissions);
  await permissionCache.set(cacheKey, permArray, 300); // 5min cache
  return permArray;
}

export async function invalidatePermissionCache(
  userId: string,
  tenantId: string
): Promise<void> {
  await permissionCache.del(`perms:${userId}:${tenantId}`);
}
