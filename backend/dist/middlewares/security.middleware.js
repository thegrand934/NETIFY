"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryLimiter = exports.authLimiter = void 0;
const rateLimitStore = new Map();
const createRateLimiter = (windowMs, maxRequests) => {
    return (req, res, next) => {
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
exports.authLimiter = createRateLimiter(15 * 60 * 1000, 20);
exports.recoveryLimiter = createRateLimiter(15 * 60 * 1000, 10);
