import { Hono } from "hono";
import { getDb } from "@/worker/lib/db";

const app = new Hono<{ Bindings: Env }>();

// Cache duration: 1 hour (3600 seconds)
const CACHE_TTL = 3600;

// Helper function to get cached data or fetch from DB
async function getCachedData<T>(
  cache: Cache,
  cacheKey: Request,
  fetchFn: () => Promise<T>,
  ctx: { waitUntil(promise: Promise<unknown>): void }
): Promise<T> {
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse.json() as Promise<T>;
  }

  const data = await fetchFn();

  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL}`
    }
  });

  const responseToCache = response.clone();
  ctx.waitUntil(cache.put(cacheKey, responseToCache));

  return data;
}

// Get all services (public) - cached
app.get("/api/services", async (c) => {
  const cache = caches.default;
  const cacheKey = new Request(`${c.req.url}`, c.req);

  const results = await getCachedData(
    cache,
    cacheKey,
    async () => getDb(c.env).getServices(),
    c.executionCtx
  );

  return c.json(results);
});

// Get all pricing packages (public) - cached
app.get("/api/packages", async (c) => {
  const cache = caches.default;
  const cacheKey = new Request(`${c.req.url}`, c.req);

  const results = await getCachedData(
    cache,
    cacheKey,
    async () => getDb(c.env).getPackages(),
    c.executionCtx
  );

  return c.json(results);
});

export default app;
