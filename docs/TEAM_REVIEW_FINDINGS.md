# Результаты проверки проекта (командный ревью)

**Дата:** 2026-02-24  
**Цель:** Запуск проекта и устранение проблем по зонам ответственности.

---

## 1. Backend (Worker, DB, routes)

### Найденные проблемы
- **Типы Env:** Сгенерированный `worker-configuration.d.ts` (wrangler) не содержал секретов `MOCHA_*` и `SUPABASE_*`, из‑за чего `getDb(c.env)` и auth не проходили проверку типов.
- **getLeadStats (Supabase):** Вызов несуществующего RPC `get_avg_lead_score` и использование `.catch()` у типа, у которого его нет в типах.
- **admin-export:** Несовместимость типов `leads.map((lead: Record<...>) => ...)` с `unknown[]` и `rows.forEach`.
- **auth.ts:** После перевода MOCHA_* в опциональные типы передавались `string | undefined` в SDK, ожидающий `string`.
- **public.ts:** Тип `ExecutionContext` (DOM) не совпадал с контекстом Workers при вызове `ctx.waitUntil`.

### Что сделано
- Добавлен **`src/worker/env.d.ts`** — расширение `Cloudflare.Env` полями `MOCHA_USERS_SERVICE_API_URL?`, `MOCHA_USERS_SERVICE_API_KEY?`, `SUPABASE_URL?`, `SUPABASE_SERVICE_ROLE_KEY?`.
- В **`src/shared/types.ts`** поля `MOCHA_USERS_SERVICE_API_URL` и `MOCHA_USERS_SERVICE_API_KEY` сделаны опциональными (секреты задаются через wrangler / .dev.vars).
- В **`src/worker/lib/db.ts`** убран вызов RPC в getLeadStats (Supabase), расчёт среднего score выполняется через выборку по `score > 0`.
- В **`src/worker/routes/admin-export.ts`** поправлена типизация: `leads.map((lead: unknown) => { const l = lead as Record<...>; ... })`, для `rows.forEach` использовано приведение к `(string | number)[]`.
- В **auth.ts** добавлены проверки наличия `apiUrl`/`apiKey` перед вызовом SDK; при отсутствии возвращается 503.
- В **public.ts** тип третьего аргумента `getCachedData` заменён на `{ waitUntil(promise: Promise<unknown>): void }`, убрано использование `any`, добавлен generic `<T>`.

---

## 2. Frontend (React, страницы, API-клиент)

### Найденные проблемы
- **Неиспользуемые переменные/импорты (TS + ESLint):** `STORAGE_KEY` в `engagement.ts`; `Filter`, `Edit` в Admin; `editingBlog`/`setEditingBlog` в Admin; `useEffect` в Brief.

### Что сделано
- Удалён неиспользуемый **`STORAGE_KEY`** из `src/react-app/lib/engagement.ts`.
- В **Brief.tsx** из импорта убран неиспользуемый `useEffect`.
- В **Admin.tsx** убраны неиспользуемые иконки `Filter`, `Edit` и state `editingBlog`/`setEditingBlog`.

---

## 3. Конфигурация и сборка

### Найденные проблемы
- **worker-configuration.d.ts** отсутствовал — типы для Worker не генерировались, из‑за чего падала сборка `tsc -b`.

### Что сделано
- Выполнена команда **`npm run cf-typegen`** (wrangler types), сгенерирован **`worker-configuration.d.ts`** в корне проекта.

---

## 4. Запуск проекта

- **`npx tsc -b`** — успешно.
- **`npm run build`** — успешно (worker + client).
- **`npm run dev`** — dev-сервер поднимается на **http://localhost:5173/**.

---

## Что осталось (не блокирует запуск)

- **ESLint:** 41 ошибка и 16 предупреждений (в основном `no-explicit-any`, `no-unused-vars` в Analytics, Footer, useFormValidation, worker leads/public, vite.config).
- **React hooks deps:** предупреждения в Admin, Portfolio, Pricing, useCountdown (можно править по мере доработки).
- **react-refresh:** предупреждения в компонентах, экспортирующих и компоненты, и константы/функции — по желанию вынести в отдельные файлы.

Рекомендация: исправлять линт и предупреждения постепенно; текущее состояние позволяет стабильно собирать и запускать проект.
