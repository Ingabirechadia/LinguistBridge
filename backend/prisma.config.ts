// =============================================================================
// Prisma CLI configuration (Prisma ORM v7).
// Connection URLs, schema location, migrations path and the seed command are
// configured here instead of in schema.prisma / package.json.
// =============================================================================
import { resolve } from 'node:path';

import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Prisma v7 does not auto-load .env files; load them explicitly so local
// development picks up backend/.env whether commands run from the root or backend.

config({ path: resolve(process.cwd(), 'backend/.env') });
config({ path: '.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node backend/node_modules/tsx/dist/cli.mjs backend/prisma/seed.ts',
  },
  // The `url` here is used by the Prisma CLI for migrations.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
