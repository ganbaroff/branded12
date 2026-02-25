
-- Add new columns to portfolio_items for full case study support
ALTER TABLE portfolio_items ADD COLUMN industry_az TEXT;
ALTER TABLE portfolio_items ADD COLUMN industry_ru TEXT;
ALTER TABLE portfolio_items ADD COLUMN industry_en TEXT;
ALTER TABLE portfolio_items ADD COLUMN service_type_az TEXT;
ALTER TABLE portfolio_items ADD COLUMN service_type_ru TEXT;
ALTER TABLE portfolio_items ADD COLUMN service_type_en TEXT;
ALTER TABLE portfolio_items ADD COLUMN project_year INTEGER;
ALTER TABLE portfolio_items ADD COLUMN metric_value TEXT;
ALTER TABLE portfolio_items ADD COLUMN metric_label_az TEXT;
ALTER TABLE portfolio_items ADD COLUMN metric_label_ru TEXT;
ALTER TABLE portfolio_items ADD COLUMN metric_label_en TEXT;
ALTER TABLE portfolio_items ADD COLUMN description_az TEXT;
ALTER TABLE portfolio_items ADD COLUMN description_ru TEXT;
ALTER TABLE portfolio_items ADD COLUMN description_en TEXT;
ALTER TABLE portfolio_items ADD COLUMN is_featured BOOLEAN DEFAULT 0;

-- Update existing portfolio items with sample data
UPDATE portfolio_items SET 
  industry_az = 'Avtoservis',
  industry_ru = 'Автосервис',
  industry_en = 'Auto Service',
  service_type_az = 'SMM',
  service_type_ru = 'SMM',
  service_type_en = 'SMM',
  project_year = 2025,
  metric_value = '+320%',
  metric_label_az = 'sosial mediada artım',
  metric_label_ru = 'рост в соцсетях',
  metric_label_en = 'social media growth',
  description_az = 'Premium avtoservis üçün tam rəqəmsal strategiya.',
  description_ru = 'Полная цифровая стратегия для премиум автосервиса.',
  description_en = 'Complete digital strategy for premium auto service.',
  is_featured = 1
WHERE id = 1;

UPDATE portfolio_items SET 
  industry_az = 'Ticarət',
  industry_ru = 'Розничная торговля',
  industry_en = 'Retail',
  service_type_az = 'Brendinq',
  service_type_ru = 'Брендинг',
  service_type_en = 'Branding',
  project_year = 2025,
  metric_value = '+180%',
  metric_label_az = 'satış artımı',
  metric_label_ru = 'рост продаж',
  metric_label_en = 'sales increase',
  description_az = 'Brenddən rəqəmsal platforma qədər tam həll.',
  description_ru = 'Полное решение от бренда до цифровой платформы.',
  description_en = 'Complete solution from brand to digital platform.',
  is_featured = 1
WHERE id = 2;

UPDATE portfolio_items SET 
  industry_az = 'Startup',
  industry_ru = 'Стартап',
  industry_en = 'Startup',
  service_type_az = 'Target Reklam',
  service_type_ru = 'Таргетированная реклама',
  service_type_en = 'Targeted Ads',
  project_year = 2024,
  metric_value = '+450%',
  metric_label_az = 'lid artımı',
  metric_label_ru = 'рост лидов',
  metric_label_en = 'lead growth',
  description_az = 'Yeni texnologiya startapı üçün peşəkar lansing.',
  description_ru = 'Профессиональный запуск нового tech-стартапа.',
  description_en = 'Professional launch for new tech startup.',
  is_featured = 0
WHERE id = 3;

UPDATE portfolio_items SET 
  industry_az = 'Xidmətlər',
  industry_ru = 'Услуги',
  industry_en = 'Services',
  service_type_az = 'Video İstehsal',
  service_type_ru = 'Видеопродакшн',
  service_type_en = 'Video Production',
  project_year = 2024,
  metric_value = '+200%',
  metric_label_az = 'müştəri cəlbi',
  metric_label_ru = 'привлечение клиентов',
  metric_label_en = 'client acquisition',
  description_az = 'Konsaltinq şirkəti üçün korporativ video seriyası.',
  description_ru = 'Серия корпоративных видео для консалтинговой компании.',
  description_en = 'Corporate video series for consulting company.',
  is_featured = 1
WHERE id = 4;
