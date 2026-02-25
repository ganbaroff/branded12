
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  selected_services TEXT,
  selected_package TEXT,
  budget TEXT,
  goals TEXT,
  deadline TEXT,
  additional_info TEXT,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_az TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt_az TEXT,
  excerpt_ru TEXT,
  excerpt_en TEXT,
  content_az TEXT NOT NULL,
  content_ru TEXT NOT NULL,
  content_en TEXT NOT NULL,
  category_az TEXT,
  category_ru TEXT,
  category_en TEXT,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT 1,
  published_date DATE,
  author_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_category_az ON blog_posts(category_az);

INSERT INTO blog_posts (title_az, title_ru, title_en, slug, excerpt_az, excerpt_ru, excerpt_en, content_az, content_ru, content_en, category_az, category_ru, category_en, cover_image, published_date, author_name) VALUES
('Sosial mediada uğurlu marketinq strategiyaları', 'Успешные стратегии маркетинга в социальных сетях', 'Successful Social Media Marketing Strategies', 'sosial-media-marketing', 'Instagram, Facebook və digər platformalarda biznesinizi necə inkişaf etdirmək olar', 'Как развивать свой бизнес в Instagram, Facebook и других платформах', 'How to grow your business on Instagram, Facebook and other platforms', 'Sosial media marketinq müasir biznesin əsas hissəsidir. Bu məqalədə biz sizə ən effektiv strategiyaları göstərəcəyik...', 'Маркетинг в социальных сетях является важной частью современного бизнеса. В этой статье мы покажем вам наиболее эффективные стратегии...', 'Social media marketing is a crucial part of modern business. In this article, we will show you the most effective strategies...', 'Marketinq', 'Маркетинг', 'Marketing', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', '2024-01-15', 'B2Brand'),

('Brendinq və identikliyin əhəmiyyəti', 'Важность брендинга и идентичности', 'The Importance of Branding and Identity', 'branding-identity', 'Güclü brend identikliyi yaratmaq və onu qorumaq', 'Создание и поддержание сильной идентичности бренда', 'Creating and maintaining a strong brand identity', 'Brendinq sadəcə logo deyil. Bu sizin biznesinizin ruhu və məqsədidir...', 'Брендинг - это не просто логотип. Это душа и цель вашего бизнеса...', 'Branding is not just a logo. It is the soul and purpose of your business...', 'Dizayn', 'Дизайн', 'Design', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', '2024-01-20', 'B2Brand'),

('İçerik marketinqində uğur açarları', 'Ключи к успеху в контент-маркетинге', 'Keys to Success in Content Marketing', 'content-marketing-success', 'Auditoriyam üçün dəyərli məzmun necə yaratmaq olar', 'Как создавать ценный контент для вашей аудитории', 'How to create valuable content for your audience', 'Keyfiyyətli məzmun müştərilərinizlə əlaqə qurmağın ən yaxşı yoludur...', 'Качественный контент - лучший способ установить связь с вашими клиентами...', 'Quality content is the best way to connect with your customers...', 'Məzmun', 'Контент', 'Content', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '2024-01-25', 'B2Brand'),

('SEO optimallaşdırma: 2024 üçün tövsiyələr', 'SEO оптимизация: рекомендации на 2024 год', 'SEO Optimization: Tips for 2024', 'seo-optimization-2024', 'Google axtarışında daha yaxşı nəticələr əldə etmək üçün nə etməli', 'Что нужно делать для лучших результатов в поиске Google', 'What to do for better results in Google search', 'SEO daim dəyişir. 2024-də uğur qazanmaq üçün yeni strategiyalar tətbiq edin...', 'SEO постоянно меняется. Применяйте новые стратегии для успеха в 2024 году...', 'SEO is constantly changing. Apply new strategies for success in 2024...', 'SEO', 'SEO', 'SEO', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', '2024-02-01', 'B2Brand');
