import pino from 'pino';

import { env } from '@/config/env';

/**
 * Application-wide Pino logger.
 * - Silent in test
 * - Pretty-printed in development
 * - JSON in production
 */
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  ...(env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
});
