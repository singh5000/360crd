import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Environment schema validation — fails fast at startup if missing
// ─────────────────────────────────────────────────────────────────────────────
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  APP_PORT: z.coerce.number().default(3000),
  APP_HOST: z.string().default("0.0.0.0"),
  APP_URL: z.string().default("http://localhost:3000"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),

  // Database
  DATABASE_URL: z.string().min(1),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_KEY_PREFIX: z.string().default("crd360:"),
  REDIS_TLS: z.string().default("false"),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES: z.string().default("1h"),
  JWT_REFRESH_EXPIRES: z.string().default("30d"),
  JWT_ISSUER: z.string().default("360crd.io"),
  JWT_AUDIENCE: z.string().default("360crd-api"),
  ENCRYPTION_KEY: z.string().length(64),
  BCRYPT_ROUNDS: z.coerce.number().default(12),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

  // CORS
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  // Storage
  STORAGE_PROVIDER: z.enum(["s3", "local"]).default("s3"),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().default("crd360-uploads"),
  AWS_S3_ENDPOINT: z.string().optional(),
  MAX_FILE_SIZE_MB: z.coerce.number().default(50),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.string().default("true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM_NAME: z.string().default("360CRD Platform"),
  SMTP_FROM_EMAIL: z.string().default("noreply@360crd.io"),

  // Queue
  QUEUE_CONCURRENCY: z.coerce.number().default(5),
  QUEUE_MAX_RETRIES: z.coerce.number().default(3),

  // Super Admin
  SUPER_ADMIN_EMAIL: z.string().email().default("superadmin@360crd.io"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

// ── Derived config ─────────────────────────────────────────────────────────
export const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",

  server: {
    port: env.APP_PORT,
    host: env.APP_HOST,
    url: env.APP_URL,
    frontendUrl: env.FRONTEND_URL,
  },

  auth: {
    jwtSecret: env.JWT_SECRET,
    accessTokenExpiry: env.JWT_ACCESS_EXPIRES,
    refreshTokenExpiry: env.JWT_REFRESH_EXPIRES,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    encryptionKey: Buffer.from(env.ENCRYPTION_KEY, "hex"),
    bcryptRounds: env.BCRYPT_ROUNDS,
  },

  cors: {
    origins: env.CORS_ORIGINS.split(",").map((o) => o.trim()),
  },

  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    auth: {
      max: env.AUTH_RATE_LIMIT_MAX,
      windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
    },
  },

  storage: {
    provider: env.STORAGE_PROVIDER,
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    bucket: env.AWS_S3_BUCKET,
    endpoint: env.AWS_S3_ENDPOINT,
    maxFileSizeMb: env.MAX_FILE_SIZE_MB,
  },

  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === "true",
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromName: env.SMTP_FROM_NAME,
    fromEmail: env.SMTP_FROM_EMAIL,
  },

  queue: {
    concurrency: env.QUEUE_CONCURRENCY,
    maxRetries: env.QUEUE_MAX_RETRIES,
  },

  logging: {
    level: env.LOG_LEVEL,
  },
} as const;

export type Config = typeof config;
