import type { Request, Response } from 'express';

/**
 * GET /health
 * Returns API status, uptime, and request ID.
 * Used by Docker health checks and load balancers.
 */
export function getHealth(req: Request, res: Response): void {
  res.status(200).json({
    status: 'ok',
    service: 'linguistbridge-api',
    version: process.env['npm_package_version'] ?? '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    requestId: req.id,
  });
}
