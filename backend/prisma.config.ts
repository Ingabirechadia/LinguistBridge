// =============================================================================
// Prisma CLI configuration (Prisma ORM v7).
// Connection URLs, schema location, migrations path and the seed command are
// configured here instead of in schema.prisma / package.json.
// =============================================================================
import { defineConfig, env } from 'prisma/config';

// Prisma v7 does not auto-load .env files; load them explicitly so local
// development picks up backend/.env automatically.
import { config } from 'dotenv';

config({ path: '.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // The `url` here is used by the Prisma CLI for migrations.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
