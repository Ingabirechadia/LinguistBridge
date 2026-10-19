import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Attaches a unique request ID to every request.
 * Reads `x-request-id` from incoming headers if present, otherwise generates a new UUID v4.
 * The ID is forwarded in the response as `x-request-id` for client-side correlation.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string | undefined) ?? uuidv4();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}

// Augment Express Request to include `id`
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
    }
  }
}
