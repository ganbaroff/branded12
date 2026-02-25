# Risk audit

Summary of security and risk checks for the B2Brand platform. Re-run and update this doc periodically.

## 1. Secrets

| Check | Status | Notes |
|-------|--------|-------|
| No API keys in client bundle | OK | Gemini key used only in Worker (`c.env.GEMINI_API_KEY`). Analytics use `import.meta.env.VITE_*` (public IDs only). |
| No hardcoded passwords | OK | Admin password and session secret come from env (wrangler secret / `.dev.vars`). |
| Worker env types | OK | `env.d.ts` documents ADMIN_PASSWORD, ADMIN_SESSION_SECRET, SUPABASE_*, GEMINI_API_KEY. |

**Recommendation:** Keep `.dev.vars` and production secrets out of version control. Rotate keys if ever exposed.

---

## 2. Admin panel and 401 handling

| Check | Status | Notes |
|-------|--------|-------|
| All admin routes protected | OK | `adminAuthMiddleware()` applied to all routes in `admin.ts`, `admin-stats.ts`, `admin-export.ts`. |
| 401 returns JSON | OK | Middleware returns `c.json({ error: "Unauthorized" }, 401)`. |
| Client redirect on 401 | OK | Admin page uses `apiGet`/`apiPost` etc. with `on401: redirectToLogin`; no raw JSON shown to user. |

**Recommendation:** Ensure logout clears cookie and redirects to login; already implemented.

---

## 3. User input validation

| Check | Status | Notes |
|-------|--------|-------|
| POST /api/leads | OK | Zod schema in `leads.ts` with length limits (e.g. name 200, email, goals 5000). |
| POST /api/chat | OK | Zod schema in `chat.ts`: `message` required, max 4000 chars. |
| XSS via user content | Review | `BlogPost.tsx` uses `dangerouslySetInnerHTML` for post body from API. Content is admin-managed (not arbitrary user HTML). |

**Recommendation:** If blog posts can be edited by untrusted users, sanitize HTML (e.g. DOMPurify) before rendering. For admin-only content, current approach is acceptable with trusted admins. `StructuredData.tsx` uses `JSON.stringify` for script content — safe.

---

## 4. Security headers

| Check | Status | Notes |
|-------|--------|-------|
| X-Content-Type-Options | OK | `nosniff` set in `security.ts`. |
| X-Frame-Options | OK | `DENY`. |
| Referrer-Policy | OK | `strict-origin-when-cross-origin`. |
| CSP | OK | Present; includes script-src, style-src, connect-src, etc. |
| Permissions-Policy | OK | Restrictive (geolocation, microphone, camera disabled). |

**Recommendation:** Harden CSP when possible: reduce or remove `'unsafe-inline'` and `'unsafe-eval'` (e.g. use nonces or hashes for scripts). Enable HSTS in production if the app is served over HTTPS.

---

## 5. Dependencies (npm audit)

Last run: see below. Run `npm audit` and `npm audit fix` (or `npm audit fix --force` with care) regularly.

| Severity | Count | Notes |
|----------|-------|-------|
| High | 11 | Mostly ESLint, Hono, minimatch. Some fixes may require major upgrades. |
| Moderate | 1 | ajv (ReDoS). |
| Low | 1 | |

**Recommendation:** Run `npm audit fix`; for remaining high-severity issues, plan upgrades (e.g. Hono to 4.12+ if compatible, ESLint/typescript-eslint to fixed versions). Avoid `--force` without testing.

---

## 6. Rate limiting

| Endpoint | Status | Limit |
|----------|--------|-------|
| POST /api/leads | OK | 5 requests per 60s per IP (`rateLimitMiddleware(5, 60000)`). |
| POST /api/chat | OK | 15 requests per 60s per IP (`rateLimitMiddleware(15, 60000)`). |

**Recommendation:** Keep rate limits; adjust if traffic patterns change. Consider per-user limits if you add auth for public endpoints.

---

## 7. Logging and error responses

| Check | Status | Notes |
|-------|--------|-------|
| No secrets in logs | OK | Code does not log passwords or API keys. Chat route logs only status and truncated error text. |
| No stack traces to client | OK | On Gemini/chat failure, client receives generic "Service temporarily unavailable" (502). |

**Recommendation:** In production, avoid logging full request/response bodies. Use structured logging for debugging without PII.

---

## Summary table

| Area | Status | Priority |
|------|--------|----------|
| Secrets | OK | — |
| Admin auth & 401 | OK | — |
| Input validation (leads, chat) | OK | — |
| Blog HTML (dangerouslySetInnerHTML) | Review | Low (admin content) |
| Security headers | OK | — |
| CSP hardening | Recommendation | Medium |
| Dependencies (npm audit) | Action | High |
| Rate limiting | OK | — |
| Logs / error leakage | OK | — |

**Action plan (by priority):**

1. Run `npm audit fix`; then plan upgrades for any remaining high-severity issues (Hono, ESLint stack).
2. Document and, if needed, implement CSP nonce/hash for script-src before removing unsafe-inline/unsafe-eval.
3. If blog content can come from untrusted sources, add HTML sanitization before `dangerouslySetInnerHTML`.
