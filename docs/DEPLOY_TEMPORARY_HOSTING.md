# Временный хостинг сайта

Есть два варианта: полный (фронт + API на Cloudflare) и быстрый (только фронт на Vercel/Netlify).

---

## Вариант 1: Cloudflare Pages + Workers (рекомендуется)

Сайт и API работают вместе. Нужен аккаунт [Cloudflare](https://dash.cloudflare.com/sign-up).

### Шаг 1: Установка и вход

```bash
npm install -g wrangler
npx wrangler login
```

Откроется браузер — войдите в аккаунт Cloudflare.

### Шаг 2: Сборка и деплой

```bash
npm run build
npx wrangler deploy
```

После деплоя будет выдан URL вида:

- `https://019c5d11-cee9-702d-ac72-8167f3104fc8.<ваш-поддомен>.workers.dev`

или, если включите Pages:

- `https://branded12.pages.dev` (если подключите репозиторий **branded12** к Cloudflare Pages).

### Шаг 3: База D1 и R2 (если ещё не созданы)

При первом деплое Wrangler может предложить создать D1 и R2. Либо создайте вручную:

```bash
# D1 (база данных)
npx wrangler d1 create 019c5d11-cee9-702d-ac72-8167f3104fc8

# R2 (хранилище)
npx wrangler r2 bucket create 019c5d11-cee9-702d-ac72-8167f3104fc8
```

В `wrangler.json` уже прописаны `database_id` и `bucket_name` — при необходимости подставьте реальные ID из дашборда Cloudflare.

### Шаг 4: Миграции D1 (таблицы и начальные данные)

Если API возвращает пустые данные или 500, примените миграции к удалённой D1:

```bash
npm run db:migrate
```

Скрипт выполнит `migrations/1.sql` … `10.sql` на базе **branded1-db**. После этого `/api/services` и `/api/packages` начнут возвращать данные.

### Шаг 5: Переменные окружения (секреты)

Если в коде используются секреты (API ключи, пароли):

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
# и т.д.
```

Значения вводятся в терминале по запросу (в дашборде они не показываются).

---

## Вариант 2: Только фронт на Vercel (быстро, без API)

Подходит, чтобы «просто показать» интерфейс. API и админка работать не будут (нет бэкенда).

### Шаг 1: Установка Vercel CLI

```bash
npm i -g vercel
```

### Шаг 2: Сборка статики

Сейчас проект собирается под Cloudflare. Для чистого статического экспорта можно временно отключить плагин Cloudflare в `vite.config.ts` (закомментировать `cloudflare()`), затем:

```bash
npm run build
```

Статика окажется в `dist/` (или в папке, указанной в `vite.config.ts`).

### Шаг 3: Деплой на Vercel

```bash
cd dist
vercel --prod
```

Либо из корня проекта (Vercel сам соберёт по настройкам):

```bash
vercel
```

Vercel выдаст ссылку вида `https://branded1-xxx.vercel.app`.

---

## Вариант 3: Только фронт на Netlify

Аналогично Vercel: только статика, без Worker/API.

1. Зарегистрируйтесь на [netlify.com](https://www.netlify.com).
2. Подключите репозиторий **ganbaroff/branded12** (GitHub).
3. Настройки сборки:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Деплой — Netlify выдаст URL вида `https://random-name-123.netlify.app`.

---

## Сравнение

| Вариант              | Плюсы                          | Минусы                    |
|----------------------|--------------------------------|---------------------------|
| **Cloudflare**       | Полный стек, API, D1, R2, бесплатный tier | Нужен аккаунт и настройка D1/R2 |
| **Vercel**           | Быстро, только фронт           | API и админка не работают |
| **Netlify**          | Удобно через GitHub            | Только фронт              |

Для временного хостинга с работающим сайтом и API используйте **Вариант 1 (Cloudflare)**. Для быстрого показа только интерфейса — **Вариант 2 или 3**.
