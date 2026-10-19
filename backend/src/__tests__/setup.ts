/**
 * Jest environment bootstrap.
 * This file runs BEFORE any module is imported, so env vars
 * are set before config/env.ts validates them.
 */
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '4001'; // Avoid clash with a running dev server
process.env['DATABASE_URL'] =
  'postgresql://linguistbridge:linguistbridge_secret@localhost:5432/linguistbridge_test';
process.env['REDIS_URL'] = 'redis://:redis_secret@localhost:6379';
process.env['JWT_SECRET'] = 'test_jwt_secret_value_that_is_at_least_32_chars';
process.env['JWT_REFRESH_SECRET'] = 'test_refresh_secret_value_at_least_32_chars';
process.env['CORS_ORIGIN'] = 'http://localhost:3000';
