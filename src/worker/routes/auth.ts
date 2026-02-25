import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { ADMIN_SESSION_COOKIE, hashSessionToken } from "@/worker/middleware/adminAuth";

const app = new Hono<{ Bindings: Env }>();

// POST /api/auth/login — body: { password }
app.post("/api/auth/login", async (c) => {
  const expected = c.env.ADMIN_PASSWORD;
  if (!expected || typeof expected !== "string") {
    return c.json({ error: "Auth not configured" }, 503);
  }
  let body: { password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid body" }, 400);
  }
  const password = body.password ?? "";
  if (password !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = await hashSessionToken(password);
  setCookie(c, ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: c.req.url.startsWith("https"),
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return c.json({ success: true }, 200);
});

// POST /api/auth/logout
app.post("/api/auth/logout", async (c) => {
  setCookie(c, ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: c.req.url.startsWith("https"),
    maxAge: 0,
  });
  return c.json({ success: true }, 200);
});

// GET /api/auth/me — returns { user } or null
app.get("/api/auth/me", async (c) => {
  const password = c.env.ADMIN_PASSWORD;
  if (!password) {
    return c.json(null, 200);
  }
  const cookieVal = getCookie(c, ADMIN_SESSION_COOKIE);
  if (!cookieVal) {
    return c.json(null, 200);
  }
  const expected = await hashSessionToken(password);
  if (cookieVal !== expected) {
    return c.json(null, 200);
  }
  return c.json({ user: { id: "admin" } }, 200);
});

// GET /api/users/me — same as /api/auth/me for compatibility
app.get("/api/users/me", async (c) => {
  const password = c.env.ADMIN_PASSWORD;
  if (!password) {
    return c.json(null, 200);
  }
  const cookieVal = getCookie(c, ADMIN_SESSION_COOKIE);
  if (!cookieVal) {
    return c.json(null, 200);
  }
  const expected = await hashSessionToken(password);
  if (cookieVal !== expected) {
    return c.json(null, 200);
  }
  return c.json({ id: "admin" }, 200);
});

export default app;
