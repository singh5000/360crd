import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { TOTP } from "otpauth";
import { addDays, addMinutes, addSeconds } from "date-fns";
import { AuthRepository } from "./auth.repository";
import { sessionCache, otpCache } from "@360crd/cache";
import { eventBus, Events } from "@360crd/event-bus";
import { emailQueue } from "@360crd/queue";
import { config } from "../../config";
import type { LoginDtoType, RegisterDtoType, MfaLoginDtoType } from "./auth.dto";
import type { AuthTokens, JwtPayload, LoginResult, SafeUser } from "@360crd/shared-types";
import {
  UnauthorizedError,
  BadRequestError,
  AccountLockedError,
  InvalidTokenError,
  ConflictError,
  NotFoundError,
} from "../../shared/errors/http.errors";
import { basePrisma } from "@360crd/database";

const SESSION_TTL_SECONDS = 86400; // 24hr TTL in Redis (refreshed on activity)
const MFA_TOKEN_TTL_SECONDS = 300; // 5min MFA challenge window

function parseExpiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (multipliers[match[2]] ?? 1);
}

export class AuthService {
  private repo = new AuthRepository();

  // ── Login ────────────────────────────────────────────────────────────────
  async login(
    tenantId: string,
    dto: LoginDtoType,
    meta: { ipAddress?: string; userAgent?: string }
  ): Promise<LoginResult | { requiresMfa: true; mfaToken: string }> {
    const user = await this.repo.findUserByEmail(tenantId, dto.email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Account lock check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AccountLockedError(user.lockedUntil);
    }

    // Password verification
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      const tenant = await basePrisma.tenantConfig.findUnique({ where: { tenantId } });
      const maxAttempts = tenant?.maxLoginAttempts || 5;
      const lockedUntil = await this.repo.incrementFailedAttempts(user.id, maxAttempts);

      eventBus.publish({
        type: Events.USER_LOGIN_FAILED,
        tenantId,
        userId: user.id,
        payload: { email: dto.email, ipAddress: meta.ipAddress },
      });

      if (lockedUntil) {
        throw new AccountLockedError(lockedUntil);
      }

      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Account is not active");
    }

    // MFA check
    if (user.mfaEnabled && user.mfaSecret) {
      const mfaToken = randomUUID();
      await otpCache.set(`mfa:${mfaToken}`, { userId: user.id, tenantId }, MFA_TOKEN_TTL_SECONDS);
      return { requiresMfa: true, mfaToken };
    }

    return this.completeLogin(user, tenantId, dto, meta);
  }

  // ── Complete MFA Login ────────────────────────────────────────────────────
  async completeMfaLogin(
    dto: MfaLoginDtoType,
    meta: { ipAddress?: string; userAgent?: string }
  ): Promise<LoginResult> {
    const mfaData = await otpCache.get<{ userId: string; tenantId: string }>(`mfa:${dto.mfaToken}`);
    if (!mfaData) throw new InvalidTokenError();

    const user = await this.repo.findUserById(mfaData.userId);
    if (!user || !user.mfaSecret) throw new InvalidTokenError();

    const totp = new TOTP({ secret: user.mfaSecret, algorithm: "SHA1", digits: 6, period: 30 });
    const isValid = totp.validate({ token: dto.code, window: 1 }) !== null;

    if (!isValid) throw new UnauthorizedError("Invalid MFA code");

    await otpCache.del(`mfa:${dto.mfaToken}`);

    return this.completeLogin(user, mfaData.tenantId, { deviceId: undefined, rememberMe: false } as any, meta);
  }

  // ── Refresh Tokens ────────────────────────────────────────────────────────
  async refreshTokens(
    token: string,
    meta: { ipAddress?: string }
  ): Promise<AuthTokens> {
    const record = await this.repo.findRefreshToken(token);

    if (!record || record.isRevoked || record.expiresAt < new Date()) {
      if (record && !record.isRevoked) {
        // Detected token reuse — revoke entire family (rotation attack)
        await this.repo.revokeTokenFamily(record.family);
      }
      throw new InvalidTokenError();
    }

    await this.repo.revokeRefreshToken(record.id);

    const user = await this.repo.findUserById(record.userId);
    if (!user || user.status !== "ACTIVE") throw new UnauthorizedError();

    const roles = user.roles.map((ur) => ur.role.slug);

    // Create a new session in Redis so authenticate() can validate the refreshed token.
    // Previously, user.id was incorrectly used as the session ID, causing sess:userId
    // to not exist in Redis and every post-refresh request to fail with InvalidTokenError.
    const newSessionId = randomUUID();
    await sessionCache.set(
      `sess:${newSessionId}`,
      { userId: user.id, tenantId: record.tenantId },
      SESSION_TTL_SECONDS
    );

    const newTokens = await this.generateTokens(user.id, record.tenantId, newSessionId, user.type, roles, undefined, (user as any).customerId);

    await this.repo.createRefreshToken({
      userId: user.id,
      tenantId: record.tenantId,
      token: newTokens.refreshToken,
      family: record.family,
      deviceId: record.deviceId || undefined,
      ipAddress: meta.ipAddress,
      expiresAt: addDays(new Date(), 30),
    });

    return newTokens;
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async logout(
    userId: string,
    sessionId: string,
    refreshToken?: string,
    allDevices = false
  ): Promise<void> {
    await sessionCache.del(`sess:${sessionId}`);
    await this.repo.invalidateSession(sessionId);

    if (allDevices) {
      await this.repo.revokeAllUserTokens(userId);
      await this.repo.invalidateAllSessions(userId);
    } else if (refreshToken) {
      const record = await this.repo.findRefreshToken(refreshToken);
      if (record) await this.repo.revokeRefreshToken(record.id);
    }

    eventBus.publish({
      type: Events.USER_LOGGED_OUT,
      tenantId: (await this.repo.findUserById(userId))?.tenantId || "",
      userId,
      payload: { sessionId, allDevices },
    });
  }

  // ── Forgot Password ────────────────────────────────────────────────────────
  async forgotPassword(tenantId: string, email: string): Promise<void> {
    const user = await this.repo.findUserByEmail(tenantId, email);
    if (!user) return; // Silent — don't leak user existence

    const code = this.generateOtpCode();
    await this.repo.createOTP({
      userId: user.id,
      code,
      type: "FORGOT_PASSWORD",
      expiresAt: addMinutes(new Date(), 30),
    });

    await emailQueue.add("forgot-password", {
      to: user.email,
      subject: "Reset Your Password",
      htmlBody: `<p>Your password reset code is: <strong>${code}</strong></p><p>Valid for 30 minutes.</p>`,
      tenantId,
    });
  }

  // ── Reset Password ─────────────────────────────────────────────────────────
  async resetPassword(
    tenantId: string,
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.repo.findUserByEmail(tenantId, email);
    if (!user) throw new NotFoundError("User");

    const otp = await this.repo.validateOTP(user.id, token, "FORGOT_PASSWORD");
    if (!otp) throw new BadRequestError("Invalid or expired reset token");

    const hash = await bcrypt.hash(newPassword, config.auth.bcryptRounds);
    await this.repo.updateUserPassword(user.id, hash);
    await this.repo.revokeAllUserTokens(user.id);
    await this.repo.invalidateAllSessions(user.id);

    eventBus.publish({
      type: Events.USER_PASSWORD_CHANGED,
      tenantId,
      userId: user.id,
      payload: { method: "reset" },
    });
  }

  // ── Change Password ────────────────────────────────────────────────────────
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new NotFoundError("User");

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestError("Current password is incorrect");

    const hash = await bcrypt.hash(newPassword, config.auth.bcryptRounds);
    await this.repo.updateUserPassword(userId, hash);

    eventBus.publish({
      type: Events.USER_PASSWORD_CHANGED,
      tenantId: user.tenantId,
      userId,
      payload: { method: "change" },
    });
  }

  // ── MFA Setup ──────────────────────────────────────────────────────────────
  async setupMfa(userId: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new NotFoundError("User");

    const totp = new TOTP({
      issuer: "360CRD",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });

    const QRCode = await import("qrcode");
    const qrCodeUrl = await QRCode.toDataURL(totp.toString());

    await otpCache.set(`mfa:setup:${userId}`, totp.secret.base32, 600);

    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    return { secret: totp.secret.base32, qrCodeUrl, backupCodes };
  }

  async confirmMfa(userId: string, code: string): Promise<void> {
    const secret = await otpCache.get<string>(`mfa:setup:${userId}`);
    if (!secret) throw new BadRequestError("MFA setup session expired");

    const totp = new TOTP({ secret, algorithm: "SHA1", digits: 6, period: 30 });
    const isValid = totp.validate({ token: code, window: 1 }) !== null;

    if (!isValid) throw new BadRequestError("Invalid MFA code");

    await this.repo.updateMfaSecret(userId, secret);
    await otpCache.del(`mfa:setup:${userId}`);

    eventBus.publish({
      type: Events.USER_MFA_ENABLED,
      tenantId: (await this.repo.findUserById(userId))?.tenantId || "",
      userId,
      payload: {},
    });
  }

  async disableMfa(userId: string, code: string): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user || !user.mfaSecret) throw new BadRequestError("MFA is not enabled");

    const totp = new TOTP({ secret: user.mfaSecret, algorithm: "SHA1", digits: 6, period: 30 });
    const isValid = totp.validate({ token: code, window: 1 }) !== null;
    if (!isValid) throw new BadRequestError("Invalid MFA code");

    await this.repo.updateMfaSecret(userId, null);
  }

  // ── Private helpers ────────────────────────────────────────────────────────
  private async completeLogin(
    user: any,
    tenantId: string,
    dto: Partial<LoginDtoType>,
    meta: { ipAddress?: string; userAgent?: string }
  ): Promise<LoginResult> {
    const roles = user.roles.map((ur: any) => ur.role.slug);
    const sessionExpiry = addSeconds(new Date(), SESSION_TTL_SECONDS * (dto.rememberMe ? 24 : 1));

    // Fetch tenant slug once — used in JWT and returned to client for header persistence
    const tenant = await basePrisma.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } });
    const tenantSlug = tenant?.slug ?? "";

    const session = await this.repo.createSession({
      userId: user.id,
      tenantId,
      deviceId: dto.deviceId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: sessionExpiry,
    });

    const tokens = await this.generateTokens(user.id, tenantId, session.id, user.type, roles, tenantSlug, user.customerId);

    // Store session in Redis for fast validation
    await sessionCache.set(
      `sess:${session.id}`,
      { userId: user.id, tenantId },
      SESSION_TTL_SECONDS * (dto.rememberMe ? 24 : 1)
    );

    await this.repo.createRefreshToken({
      userId: user.id,
      tenantId,
      token: tokens.refreshToken,
      family: randomUUID(),
      deviceId: dto.deviceId,
      ipAddress: meta.ipAddress,
      expiresAt: dto.rememberMe ? addDays(new Date(), 90) : addDays(new Date(), 30),
    });

    await this.repo.updateLoginSuccess(user.id, meta.ipAddress);

    if (dto.deviceId) {
      await this.repo.upsertDevice({
        userId: user.id,
        tenantId,
        deviceId: dto.deviceId,
        deviceName: dto.deviceName,
      });
    }

    eventBus.publish({
      type: Events.USER_LOGGED_IN,
      tenantId,
      userId: user.id,
      payload: { sessionId: session.id, ipAddress: meta.ipAddress },
    });

    // Super admins get a wildcard — no need to enumerate every permission
    const permissions: string[] =
      user.type === "SUPER_ADMIN"
        ? ["*"]
        : [
            ...new Set<string>(
              user.roles.flatMap((ur: any) =>
                ur.role.permissions.map((rp: any) =>
                  `${rp.permission.resource}:${rp.permission.action}`
                )
              )
            ),
          ];
    const safeUser = this.toSafeUser(user, roles, permissions);

    return {
      user: safeUser,
      tokens,
      sessionId: session.id,
      tenantSlug,
    };
  }

  private async generateTokens(
    userId: string,
    tenantId: string,
    sessionId: string,
    userType: string,
    roles: string[],
    tenantSlug?: string,
    customerId?: string | null
  ): Promise<AuthTokens> {
    const slug = tenantSlug ?? (await basePrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { slug: true },
    }))?.slug ?? "";

    const payload: Omit<JwtPayload, "iat" | "exp"> = {
      sub: userId,
      tid: tenantId,
      tsl: slug,
      sid: sessionId,
      ...(customerId && { cid: customerId }),
      typ: userType as any,
      roles,
      iss: config.auth.issuer,
      aud: config.auth.audience,
    };

    const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.accessTokenExpiry as any,
    });

    const refreshToken = randomUUID() + "-" + randomUUID();
    const expiresIn = parseExpiryToSeconds(config.auth.accessTokenExpiry);

    return { accessToken, refreshToken, expiresIn, tokenType: "Bearer" };
  }

  private toSafeUser(user: any, roles: string[], permissions: string[]): SafeUser {
    return {
      id: user.id,
      tenantId: user.tenantId,
      customerId: user.customerId ?? null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.avatarUrl,
      type: user.type,
      status: user.status,
      department: user.department,
      jobTitle: user.jobTitle,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      roles,
      permissions,
      createdAt: user.createdAt,
    };
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
