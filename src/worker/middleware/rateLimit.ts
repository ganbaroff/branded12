import { Context } from 'hono';
import { getDb } from '@/worker/lib/db';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

export const rateLimitMiddleware = (limit = MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW) => {
  return async (c: Context<{ Bindings: Env }>, next: () => Promise<void>) => {
    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    const key = `${ip}:${c.req.path}`;

    try {
      const result = await getDb(c.env).rateLimitCheck(key, limit, windowMs);
      if (!result.allowed) {
        return c.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: result.retryAfter
          },
          429
        );
      }
      await next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      await next();
    }
  };
};
