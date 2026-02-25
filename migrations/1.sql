
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_az TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_en TEXT NOT NULL,
  monthly_price INTEGER NOT NULL,
  first_month_price INTEGER NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pricing_packages (
  id TEXT PRIMARY KEY,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  monthly_price INTEGER NOT NULL,
  first_month_price INTEGER NOT NULL,
  is_popular BOOLEAN DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  company_az TEXT NOT NULL,
  company_ru TEXT NOT NULL,
  company_en TEXT NOT NULL,
  text_az TEXT NOT NULL,
  text_ru TEXT NOT NULL,
  text_en TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_az TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  category_az TEXT NOT NULL,
  category_ru TEXT NOT NULL,
  category_en TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (id, icon, name_az, name_ru, name_en, description_az, description_ru, description_en, monthly_price, first_month_price, display_order) VALUES
('smm', '📱', 'SMM İdarəetmə', 'SMM Управление', 'SMM Management', 'Instagram, Facebook və TikTok hesablarınızın tam idarəsi. Kontent planı, dizayn və daimi yayımlar.', 'Полное управление аккаунтами Instagram, Facebook и TikTok. Контент-план, дизайн и регулярные публикации.', 'Full management of Instagram, Facebook and TikTok accounts. Content plan, design and regular posts.', 590, 295, 1),
('video', '🎥', 'Video Çəkiliş', 'Видеосъёмка', 'Video Production', 'Reels, reklam videoları, korporativ çəkilişlər. Peşəkar kameraman və montaj.', 'Reels, рекламные видео, корпоративные съёмки. Профессиональный оператор и монтаж.', 'Reels, promo videos, corporate shoots. Professional camera operator and editing.', 890, 445, 2),
('ai-content', '🤖', 'AI Kontent', 'AI Контент', 'AI Content', 'Süni intellekt ilə mətn yazma, şəkil yaratma və dizayn. Sürətli və keyfiyyətli.', 'Написание текстов, создание изображений и дизайн с помощью ИИ. Быстро и качественно.', 'AI-powered copywriting, image generation and design. Fast and high-quality.', 490, 245, 3),
('targeting', '🎯', 'Target Reklam', 'Таргетированная реклама', 'Targeted Ads', 'Facebook, Instagram və Google reklamları. Kampaniya qurulması və optimallaşdırma.', 'Реклама в Facebook, Instagram и Google. Настройка и оптимизация кампаний.', 'Facebook, Instagram and Google ads. Campaign setup and optimization.', 690, 345, 4),
('branding', '✨', 'Brendinq', 'Брендинг', 'Branding', 'Logo, brendbook, korporativ stil. Brendinizin tam kimliyi.', 'Логотип, брендбук, корпоративный стиль. Полная идентичность бренда.', 'Logo, brand book, corporate identity. Complete brand identity.', 1290, 645, 5),
('photography', '📸', 'Foto Çəkiliş', 'Фотосъёмка', 'Photography', 'Məhsul, interyerlərin və korporativ fotosessiyalar. Professional çəkiliş və retuş.', 'Продуктовая, интерьерная и корпоративная фотосъёмка. Профессиональная съёмка и ретушь.', 'Product, interior and corporate photography. Professional shooting and retouching.', 590, 295, 6);

INSERT INTO pricing_packages (id, name_az, name_ru, name_en, monthly_price, first_month_price, is_popular, display_order) VALUES
('starter', 'Starter', 'Стартер', 'Starter', 1290, 645, 0, 1),
('growth', 'Growth', 'Рост', 'Growth', 1990, 995, 1, 2),
('enterprise', 'Enterprise', 'Энтерпрайз', 'Enterprise', 3490, 1745, 0, 3);

INSERT INTO testimonials (name_az, name_ru, name_en, company_az, company_ru, company_en, text_az, text_ru, text_en, rating, display_order) VALUES
('Rəşad Məmmədov', 'Рашад Мамедов', 'Rashad Mammadov', 'AutoPro Servis', 'AutoPro Сервис', 'AutoPro Service', '3 ay əvvəl B2Brand ilə işə başladıq. Instagram izləyicilər 2 dəfə artdı, müştəri sorğuları hər həftə gəlir. Qiymət də münasib, tövsiyə edirəm!', 'Начали работать с B2Brand 3 месяца назад. Подписчики в Instagram выросли в 2 раза, заявки клиентов приходят каждую неделю. Цена разумная, рекомендую!', 'Started working with B2Brand 3 months ago. Instagram followers doubled, customer inquiries come every week. Price is reasonable, highly recommend!', 5, 1),
('Leyla Əliyeva', 'Лейла Алиева', 'Leyla Aliyeva', 'Bella Beauty Salon', 'Bella Beauty Salon', 'Bella Beauty Salon', 'Video çəkilişlər əla oldu! Reels-lər min-min baxış alır. Komanda çox peşəkar və yaradıcı. İşlərindən razıyıq.', 'Видеосъёмка получилась отличная! Reels набирают тысячи просмотров. Команда очень профессиональная и креативная. Довольны работой.', 'The video shoot turned out great! Reels are getting thousands of views. The team is very professional and creative. Very satisfied with the work.', 5, 2),
('Elvin Quliyev', 'Эльвин Кулиев', 'Elvin Guliyev', 'TechStart MMC', 'TechStart ООО', 'TechStart LLC', 'Brendinq paketi aldıq - logo, brendbook, sosial media dizaynlar. Hər şey vaxtında və keyfiyyətlə hazırlandı. Startup üçün ideal variant.', 'Взяли пакет брендинга - логотип, брендбук, дизайны для соцсетей. Всё подготовили вовремя и качественно. Идеальный вариант для стартапа.', 'Got the branding package - logo, brand book, social media designs. Everything was prepared on time and with quality. Perfect option for a startup.', 5, 3);

INSERT INTO portfolio_items (title_az, title_ru, title_en, category_az, category_ru, category_en, image_url, display_order) VALUES
('AutoPro Rebrendinq', 'AutoPro Ребрендинг', 'AutoPro Rebranding', 'Brendinq & SMM', 'Брендинг & SMM', 'Branding & SMM', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 1),
('Bella Salon Reklam Kampaniyası', 'Рекламная кампания Bella Salon', 'Bella Salon Ad Campaign', 'Video & Target Reklam', 'Видео & Таргет реклама', 'Video & Targeted Ads', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop', 2),
('FreshMart Sosial Media', 'FreshMart Социальные сети', 'FreshMart Social Media', 'SMM & Foto Çəkiliş', 'SMM & Фотосъёмка', 'SMM & Photography', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop', 3),
('TechStart Branding', 'TechStart Брендинг', 'TechStart Branding', 'Brendinq & AI Kontent', 'Брендинг & AI Контент', 'Branding & AI Content', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop', 4);
