# 💳 Stripe Payment Links Setup Guide

## Шаг 1: Создайте Stripe Account

1. Перейдите на https://dashboard.stripe.com/register
2. Заполните данные вашего бизнеса
3. Подтвердите email и добавьте банковский счет

## Шаг 2: Создайте Payment Links

Для каждого пакета создайте отдельный Payment Link:

### Starter Package (645 AZN первый месяц)
1. В Stripe Dashboard → **Products** → **Payment Links**
2. Нажмите **Create payment link**
3. Настройки:
   - **Name**: "B2Brand Starter - First Month"
   - **Price**: 645 AZN (или эквивалент в валюте Stripe)
   - **Billing**: One-time payment
   - **Description**: "Starter package - 50% off first month"
4. Скопируйте Payment Link URL (формат: `https://buy.stripe.com/...`)

### Growth Package (995 AZN первый месяц)
Повторите шаги выше для Growth пакета

### Enterprise Package (1745 AZN первый месяц)
Повторите шаги выше для Enterprise пакета

## Шаг 3: Добавьте Links в Код

### Вариант 1: Environment Variables (Рекомендуется)

Создайте файл `.env.local`:

```env
VITE_STRIPE_STARTER_LINK=https://buy.stripe.com/your-starter-link
VITE_STRIPE_GROWTH_LINK=https://buy.stripe.com/your-growth-link
VITE_STRIPE_ENTERPRISE_LINK=https://buy.stripe.com/your-enterprise-link
```

### Вариант 2: Прямо в Database

Обновите `pricing_packages` таблицу через Admin панель или SQL:

```sql
UPDATE pricing_packages 
SET stripe_payment_link = 'https://buy.stripe.com/your-link' 
WHERE id = 'starter';
```

## Шаг 4: Тестирование

1. Перейдите на `/pricing`
2. Нажмите "İndi ödə" (Pay now) на любом пакете
3. Должен открыться Stripe Checkout
4. Используйте тестовую карту: `4242 4242 4242 4242`

## 💡 Советы

- **Recurring Payments**: Если хотите автоматические ежемесячные платежи, создайте Subscription вместо One-time payment
- **Coupons**: Добавьте купоны для дополнительных скидок
- **Webhooks**: Настройте webhooks для отслеживания успешных платежей
- **Tax**: Stripe автоматически обрабатывает налоги в зависимости от региона

## 🔗 Полезные ссылки

- [Stripe Payment Links Docs](https://stripe.com/docs/payment-links)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
