import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

const ADMIN_SESSION_COOKIE = "admin_session";
const SALT = "b2brand_admin_salt";

async function hashSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function adminAuthMiddleware() {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const password = c.env.ADMIN_PASSWORD;
    if (!password || typeof password !== "string") {
      return c.json({ error: "Admin auth not configured" }, 503);
    }
    const cookieVal = getCookie(c, ADMIN_SESSION_COOKIE);
    if (!cookieVal) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const expected = await hashSessionToken(password);
    if (cookieVal !== expected) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  });
}

export { ADMIN_SESSION_COOKIE, hashSessionToken };
