import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { env } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import { requestId } from '@/middleware/requestId';
import healthRouter from '@/modules/health/health.router';
import { logger } from '@/utils/logger';

const app: Express = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-idempotency-key'],
  }),
);

// ── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request ID + HTTP request logging ───────────────────────────────────────
app.use(requestId);
app.use(pinoHttp({ logger, useLevel: 'info' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/health', healthRouter);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'The requested route does not exist.',
  });
});

// ── Central error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
