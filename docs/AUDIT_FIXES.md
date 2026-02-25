# Список правок по результатам аудита B2Brand

Конкретные предложения с путями к файлам и приоритетами. Согласованность с [CODE_ANALYSIS_IMPROVEMENTS.md](CODE_ANALYSIS_IMPROVEMENTS.md) и [TEAM_REVIEW_FINDINGS.md](TEAM_REVIEW_FINDINGS.md) учтена.

---

## Критично

### 1. Страница поста блога и переход по slug

**Проблема:** На `/blog` кнопка «Oxu» / «Read more» не ведёт на пост; в приложении нет маршрута `/blog/:slug` и страницы с полным текстом. API `GET /api/blog/:slug` уже есть.

**Правки:**

- **Добавить страницу поста:** создать `src/react-app/pages/BlogPost.tsx` — по `useParams().slug` вызывать `GET /api/blog/:slug`, при 404 показывать сообщение и ссылку на `/blog`, при успехе выводить заголовок, дату, автора, контент (поле `content_az` / `content_ru` / `content_en` или аналог из типа `BlogPost`/ответа API). Использовать `apiGet` и при ошибке — toast.
- **Добавить маршрут:** в `src/react-app/App.tsx` добавить `Route path="/blog/:slug" element={<BlogPostPage />}` и lazy-импорт `BlogPostPage`.
- **Связать карточку с постом:** в `src/react-app/pages/Blog.tsx` в компоненте `BlogPostCard` обернуть карточку (или кнопку «Read more») в `Link to={\`/blog/${post.slug}\`}` или заменить кнопку на `Link` с теми же стилями.

**Приоритет:** критично.

---

## Важно

### 2. Блог: единый API-клиент и обработка ошибок

**Файл:** `src/react-app/pages/Blog.tsx`

**Проблема:** Список постов запрашивается через `fetch("/api/blog")`; при не-200 тело не парсится и toast не показывается — пользователь видит пустой список без объяснения.

**Правка:** Использовать `apiGet<BlogPost[]>("/api/blog")` из `src/react-app/lib/api.ts`. В `catch` или при ответе с ошибкой показывать `toast.error(...)` с сообщением по языку и не перезаписывать state данными из ответа.

**Приоритет:** важно.

---

### 3. ErrorBoundary: локализация текста

**Файл:** `src/react-app/components/ErrorBoundary.tsx`

**Проблема:** Текст «Something went wrong», «We're sorry...», «Reload page» только на английском.

**Правка:** Получать текущий язык (например через контекст или `localStorage`/cookie, если язык там хранится) и выводить строки на AZ/RU/EN. Либо передавать в ErrorBoundary проп `locale: 'az' | 'ru' | 'en'` из родителя, обёрнутого в `LanguageProvider`.

**Приоритет:** важно.

---

### 4. Footer: видимый фокус у ссылок

**Файл:** `src/react-app/components/Footer.tsx`

**Проблема:** У ссылок навигации и соцсетей есть только `hover:`, нет явных стилей `focus:` для клавиатурной навигации (a11y).

**Правка:** Добавить к классам ссылок, например: `focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]` (или общий класс в tailwind). Аналогично для иконок соцсетей.

**Приоритет:** важно.

---

## Желательно

### 5. CSP: ужесточение script-src

**Файл:** `src/worker/middleware/security.ts`

**Проблема:** В CSP указаны `'unsafe-inline'` и `'unsafe-eval'` для script-src — ослабляет защиту от XSS.

**Правка:** По возможности перейти на nonce или hash для инлайновых скриптов (для Vite/React — типичная схема с nonce в HTML и передачей в CSP). Убрать или минимизировать `'unsafe-eval'`. Зафиксировать в отчёте как рекомендацию без блокировки деплоя.

**Приоритет:** желательно.

---

### 6. Аналитика: ID из env

**Файл:** `src/react-app/components/Analytics.tsx`

**Проблема:** TODO по ID аналитики; при подключении реальных счётчиков ID не должны быть захардкожены в клиенте.

**Правка:** Использовать переменные окружения (например `import.meta.env.VITE_GA_ID`, `VITE_FB_PIXEL_ID`) и не коммитить значения в репозиторий.

**Приоритет:** желательно.

---

### 7. Плейсхолдеры перед продакшеном

**Файлы:** `src/react-app/data/content.ts` (WHATSAPP_NUMBER), `src/react-app/components/Footer.tsx` (TODO про соцсети), `src/react-app/components/Analytics.tsx` (TODO по ID).

**Правка:** Заменить placeholder-номера и URL на реальные перед запуском; убрать или выполнить TODO в коде.

**Приоритет:** желательно.

---

## Сводка по приоритетам

| Приоритет   | Количество | Номера пунктов |
|------------|------------|----------------|
| Критично   | 1          | 1              |
| Важно      | 3          | 2, 3, 4        |
| Желательно | 3          | 5, 6, 7        |
