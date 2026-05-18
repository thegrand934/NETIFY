import { Request, Response, NextFunction } from 'express';

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitEntry>();

const createRateLimiter = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip || 'unknown'}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
      return;
    }

    entry.count += 1;
    next();
  };
};

export const authLimiter = createRateLimiter(15 * 60 * 1000, 20);
export const recoveryLimiter = createRateLimiter(15 * 60 * 1000, 10);
