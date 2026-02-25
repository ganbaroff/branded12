# Architecture and practices (2026 production focus)

High-level overview of the B2Brand stack and recommendations to reach production-ready quality.

---

## 1. Project structure

**Current state:** Clear split between frontend and worker. React app lives under `src/react-app/` (pages, components, hooks, lib, data). Worker under `src/worker/` (routes, middleware, lib for DB). Shared types in `src/shared/` when needed. No feature-based folders; components and pages are flat or grouped by type.

**Recommendations for production:**
- Keep the current split; it is easy to navigate.
- If the app grows, consider feature folders (e.g. `features/brief`, `features/admin`) to colocate routes, components, and types per domain.
- Document env vars in one place (e.g. `.env.example` and this doc); already partially done in `docs/SUPABASE_SETUP.md` and `.env.example`.

---

## 2. Data and API layer

**Current state:** Single API client in `src/react-app/lib/api.ts`: `apiGet`, `apiPost`, `apiPut`, `apiDelete` with `credentials: "include"`. Response handling: non-OK throws `ApiError` with status and body; 401 can trigger `on401` callback (used in Admin for redirect to login). No API keys or secrets on the client; backend uses env (Supabase, admin auth, Gemini).

**Recommendations for production:**
- Keep all server-side secrets in Worker env only; never expose Gemini or Supabase service key to the client.
- Consider request timeouts (e.g. `AbortController` with timeout) for long-running API calls from the client.
- Optional: add a thin data layer per domain (e.g. `lib/leads.ts`, `lib/portfolio.ts`) that uses the central API client and returns typed data; helps with consistency and error handling.

---

## 3. Accessibility (a11y)

**Current state:** Main content in `<main id="main-content">`; Skip to main content link; ScrollToTop moves focus to main on route change. Header has `role="banner"`, nav has `aria-label`, language selector has `aria-label` and `aria-current`. Buttons (BackToTop, WhatsApp, Chat) have `aria-label`. Footer social links have `aria-label`. Focus styles on buttons (focus ring). Radix-based UI components use focus-visible and aria attributes.

**Recommendations for production:**
- Run an automated a11y check (e.g. axe-core or Lighthouse) on key pages and fix critical issues.
- Ensure all images have meaningful `alt` text; decorative images use `alt=""` or `aria-hidden`.
- For toast messages (Sonner), confirm they are announced (aria-live region or equivalent).
- Keep contrast ratios for text and CTAs within WCAG AA where possible.

---

## 4. Internationalisation (i18n)

**Current state:** Centralised translations in `src/react-app/data/content.ts` per language (az, ru, en). Pages and components use `useLanguage()` and `translations[language]`. Chat widget and other UI strings moved into `chat` (and similar) blocks for consistency. No runtime locale for dates/numbers (e.g. Intl.DateTimeFormat); dates are often static or simple.

**Recommendations for production:**
- Avoid hardcoding user-facing strings in components; keep them in `content.ts` or a dedicated i18n module.
- For date/number formatting, use `Intl` with the current language (e.g. `new Intl.DateTimeFormat(language === 'az' ? 'az-AZ' : language === 'ru' ? 'ru-RU' : 'en-US')`).
- If the project grows, consider a small i18n helper (e.g. `t('key')` with optional fallback) to reduce repetition.

---

## 5. Performance

**Current state:** All page components are lazy-loaded via `React.lazy()`; `Suspense` with `LoadingSpinner` wraps routes. No heavy images or lists on the critical path that clearly require virtualisation. Public API routes (e.g. services, packages) use server-side caching where implemented (e.g. in public routes).

**Recommendations for production:**
- Measure LCP and FID/INP on real devices; optimise images (formats, sizes, lazy loading) if needed.
- For long lists (e.g. portfolio, blog, leads in admin), consider virtualisation (e.g. react-window) if DOM size becomes an issue.
- Keep bundle size in check: run `vite build` and inspect chunk sizes; split vendor chunks if a single bundle is large.

---

## 6. Monitoring and errors

**Current state:** Client has an `ErrorBoundary` that catches render errors and shows a fallback. API errors are handled via `ApiError` and toasts or inline messages. No centralised error reporting (e.g. Sentry) or performance monitoring. Analytics (GA, FB Pixel, Yandex) are optional and configured via `VITE_*` env vars.

**Recommendations for production:**
- Add a client-side error reporting service (e.g. Sentry) for unhandled exceptions and API failures; ensure no PII or secrets are sent.
- Optionally report failed API calls (status code, path) for server-side monitoring.
- In production, avoid logging sensitive data (passwords, tokens) and do not expose stack traces in API responses; already aligned with current chat and error handling.

---

## 7. Tests and checks

**Current state:** Vitest is configured; unit tests exist for API client and hooks (e.g. `useScrollReveal`). Smoke checklist in `docs/SMOKE_CHECKLIST.md` for manual verification of main flows (public pages, admin login, brief, console errors). Pre-commit/deploy: `npm run lint`, `npm run build`, `npm run test`.

**Recommendations for production:**
- Run the smoke checklist before each release; consider automating critical paths with E2E (e.g. Playwright) if the team can maintain it.
- Keep unit tests for API error handling and any critical business logic (e.g. validation, formatting).
- In CI, run `npm run lint`, `npm run build`, and `npm run test`; block merge on failure.

---

## Summary

| Theme | Current state | Production focus |
|-------|----------------|------------------|
| Structure | Clear front/worker split | Optional feature folders as app grows |
| Data/API | Central client, 401 handling, no client secrets | Timeouts, optional domain data layer |
| a11y | Landmarks, skip link, aria-labels, focus | Automated a11y run, alt text, toasts announced |
| i18n | content.ts, three languages | No hardcoded strings, Intl for dates/numbers |
| Performance | Lazy routes, Suspense | LCP/image optimisation, virtualisation if needed |
| Monitoring | ErrorBoundary, toasts | Sentry or equivalent, no PII in logs |
| Tests | Vitest, smoke checklist | E2E for critical paths, CI gates |

This document should be updated when the architecture or tooling changes (e.g. new routes, new env vars, or new front-end frameworks).
