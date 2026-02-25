# Детальный чек-лист аудита B2Brand

| Категория | Подпункт | Страница / компонент | OK | Требует правки | Рекомендация |
|-----------|----------|----------------------|:--:|:--------------:|--------------|
| **A** | Загрузка без ошибок | Все публичные страницы | ✓ | | |
| **A** | Контент с API где есть | Home (content), Services, Pricing, Portfolio, Cases, Blog | ✓ | | Blog: при ошибке API нет toast — желательно показывать |
| **A** | Смена языка AZ/RU/EN | Все страницы | ✓ | | |
| **A** | Ссылки ведут куда нужно | Header, Footer, CTA, NotFound | ✓ | | |
| **A** | Hero, услуги, отзывы, портфолио, CTA → /brief, WhatsApp | Home.tsx | ✓ | | |
| **A** | Данные /api/services, ссылки на /pricing, /brief | Services.tsx | ✓ | | |
| **A** | /api/services, /api/packages, только «Brif göndər», калькулятор | Pricing.tsx | ✓ | | |
| **A** | Контакты, WhatsApp, карта — заглушка | Contact.tsx | ✓ | | |
| **A** | Многошаговая форма, валидация, POST /api/leads, toast | Brief.tsx | ✓ | | |
| **A** | /api/portfolio, фильтры | Portfolio.tsx | ✓ | | |
| **A** | /api/cases, карточки | Cases.tsx | ✓ | | |
| **A** | Вопросы, расчёт пакета, CTA в бриф | Quiz.tsx | ✓ | | |
| **A** | /api/blog, список постов | Blog.tsx | ✓ | | |
| **A** | Переход на пост по slug | Blog → пост | | ✓ | Нет маршрута /blog/:slug и страницы поста; кнопка «Read more» не ведёт никуда |
| **A** | 404 ссылка на главную | NotFound.tsx | ✓ | | |
| **A** | Бриф: обязательные поля, валидация email, UTM, engagement | Brief.tsx | ✓ | | |
| **A** | Бриф: при ошибке API — toast | Brief.tsx | ✓ | | |
| **A** | Чат-виджет: имя, email, сообщение → POST /api/leads | ChatWidget.tsx | ✓ | | |
| **A** | Квиз: только выбор и CTA в бриф | Quiz.tsx | ✓ | | |
| **A** | Ценовые блоки: Pay now только при stripe_payment_link | Pricing.tsx | ✓ | | |
| **A** | Публичные API: при ошибке не парсить тело в state | Services, Portfolio, Cases, Pricing, Admin | ✓ | | Blog — исключение (рекомендация: apiGet + toast) |
| **A** | Админка: 401 → redirectToLogin | Admin.tsx, api.ts | ✓ | | |
| **A** | Админка: apiGet/apiPut/apiPost/apiDelete с apiOpts | Admin.tsx | ✓ | | |
| **A** | Экспорт лидов CSV | admin-export | ✓ | | |
| **A** | Вкладки и CRUD админки | Admin.tsx | ✓ | | |
| **B** | Hover/focus у кликабельных элементов | Header, формы (Brief, ChatWidget), UI (button, input) | ✓ | | |
| **B** | Focus у ссылок в Footer | Footer.tsx | | ✓ | Нет явного focus:ring/outline |
| **B** | Пустые href="#" | По коду | ✓ | | Не найдено |
| **B** | CTA ведут на /brief, /contact или якорь | Все страницы | ✓ | | |
| **B** | Админка: Save/Delete/Export loading/disabled, toast | Admin.tsx | ✓ | | |
| **C** | Scroll-reveal без дёрганий | useScrollReveal, секции | ✓ | | |
| **C** | Lazy-load, Suspense fallback | App.tsx (LoadingSpinner) | ✓ | | |
| **C** | Смена языка без артефактов | LanguageProvider | ✓ | | |
| **C** | Countdown / Exit intent — даты evergreen | CountdownBanner, ExitIntentPopup | ✓ | | |
| **D** | Security headers (X-Content-Type-Options и др.) | security.ts | ✓ | | |
| **D** | CSP: unsafe-inline/unsafe-eval | security.ts | ✓ | | Рекомендация: ужесточить (nonce/hash) |
| **D** | Admin за authMiddleware, 401 → редирект | admin.ts, Admin.tsx | ✓ | | |
| **D** | POST /api/leads: rate limit, Zod, без утечки стеков | leads.ts | ✓ | | |
| **D** | Секреты не в клиенте | — | ✓ | | Analytics ID — вынести в env |
| **E** | Адаптив: навигация, формы, админка, карточки | Все страницы | ✓ | | |
| **E** | Контраст, видимый фокус, семантика (h1–h6, main, footer) | Общее | ✓ | | |
| **E** | ErrorBoundary текст только EN | ErrorBoundary.tsx | ✓ | | Рекомендация: локализовать по языку |
| **F** | Смена языка/таб не дублирует запросы лишний раз | Admin loadData по табу/фильтрам | ✓ | | |
| **F** | Кэш публичных API (getCachedData) | public.ts (services, packages) | ✓ | | |
| **F** | Сетевые ошибки: toast/сообщение, не падение | api.ts, Brief, ChatWidget | ✓ | | Blog при ошибке API — пустой список без сообщения |
| **G** | Год в футере динамический | Footer.tsx | ✓ | | |
| **G** | Плейсхолдеры (WhatsApp, TODO соцсети, Analytics) | content.ts, Footer, Analytics | ✓ | | Заменить перед продакшеном |
