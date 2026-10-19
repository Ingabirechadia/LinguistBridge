/**
 * Environment variable validation — runs at startup.
 * If any required variable is missing or invalid the process exits immediately.
 */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  REDIS_URL: z.string().url('REDIS_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('❌  Invalid or missing environment variables:\n');
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    // eslint-disable-next-line no-console
    console.error('\nCopy backend/.env.example → backend/.env and fill in real values.\n');
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
