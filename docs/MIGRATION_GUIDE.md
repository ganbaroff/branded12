# 🚀 Migration Guide - Critical Improvements

## Миграция 8: UTM Tracking & Stripe Links

### Шаг 1: Применить миграцию

```bash
# Если используете Wrangler
wrangler d1 execute DB --file=./migrations/8.sql

# Или через Cloudflare Dashboard
# Скопируйте содержимое migrations/8.sql и выполните в SQL Editor
```

### Шаг 2: Проверить изменения

```sql
-- Проверить новые колонки в leads
PRAGMA table_info(leads);

-- Проверить новую колонку в pricing_packages
PRAGMA table_info(pricing_packages);
```

### Шаг 3: Обновить данные (опционально)

Если у вас уже есть данные в `pricing_packages`, добавьте Stripe links:

```sql
UPDATE pricing_packages 
SET stripe_payment_link = 'https://buy.stripe.com/your-link' 
WHERE id = 'starter';
```

## Что изменилось:

### ✅ Backend (leads.ts)
- Добавлена валидация email через Zod
- Добавлен retry механизм для email отправки (3 попытки с exponential backoff)
- Добавлено сохранение UTM параметров и referrer

### ✅ Frontend
- Добавлена утилита `lib/utm.ts` для извлечения UTM параметров
- UTM tracking интегрирован в Brief.tsx и ChatWidget.tsx
- Добавлены Stripe Payment Links на странице Pricing

### ✅ Database
- Новые колонки в `leads`: `utm_source`, `utm_medium`, `utm_campaign`, `referrer`
- Новая колонка в `pricing_packages`: `stripe_payment_link`

## Тестирование

1. **UTM Tracking**:
   - Откройте `/?utm_source=google&utm_medium=cpc&utm_campaign=test`
   - Заполните Brief форму
   - Проверьте в Admin панели, что UTM данные сохранились

2. **Email Retry**:
   - Временно сломайте email endpoint
   - Отправьте lead
   - Проверьте логи - должны быть 3 попытки с задержками 1s, 2s, 4s

3. **Stripe Links**:
   - Перейдите на `/pricing`
   - Нажмите "İndi ödə"
   - Должен открыться Stripe Checkout

## Откат (если нужно)

```sql
-- Удалить новые колонки
ALTER TABLE leads DROP COLUMN utm_source;
ALTER TABLE leads DROP COLUMN utm_medium;
ALTER TABLE leads DROP COLUMN utm_campaign;
ALTER TABLE leads DROP COLUMN referrer;
ALTER TABLE pricing_packages DROP COLUMN stripe_payment_link;
```
