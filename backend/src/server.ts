import http from 'http';

import app from '@/app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const server = http.createServer(app);

// ── Start listening ─────────────────────────────────────────────────────────
server.listen(env.PORT, () => {
  logger.info(
    `🚀  LinguistBridge API is running on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
  );
  logger.info(`   Health check → http://localhost:${env.PORT}/health`);
});

// ── Graceful shutdown ───────────────────────────────────────────────────────
function shutdown(signal: string): void {
  logger.info({ signal }, 'Shutdown signal received — closing HTTP server gracefully...');

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error while closing the HTTP server');
      process.exit(1);
    }
    logger.info('HTTP server closed. Goodbye 👋');
    process.exit(0);
  });

  // Force-kill after 10 s if connections won't drain
  const forceExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, 10_000);

  // Allow the event loop to exit even if the timer is still running
  forceExit.unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Unhandled rejection / exception guards ───────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection — shutting down');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});
