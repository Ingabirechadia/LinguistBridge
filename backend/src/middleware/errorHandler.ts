import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { logger } from '@/utils/logger';

// ── Custom application error ────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, code = 'APP_ERROR', isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Centralised error handler ───────────────────────────────────────────────

/**
 * Must be registered as the LAST middleware in the Express app.
 * Handles: ZodError (validation), AppError (known), and unknown errors.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Validation errors from Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      errors: err.flatten().fieldErrors,
      requestId: req.id,
    });
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, requestId: req.id }, 'Non-operational AppError');
    }

    res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
      requestId: req.id,
    });
    return;
  }

  // Unknown / unexpected errors
  logger.error({ err, requestId: req.id }, 'Unhandled error');

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    requestId: req.id,
  });
}
