-- B2Brand Supabase (PostgreSQL) schema
-- Run this in Supabase Dashboard → SQL Editor

-- Services
CREATE TABLE IF NOT EXISTS services (
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing packages (with stripe_payment_link)
CREATE TABLE IF NOT EXISTS pricing_packages (
  id TEXT PRIMARY KEY,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  monthly_price INTEGER NOT NULL,
  first_month_price INTEGER NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  stripe_payment_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portfolio items (with case study fields)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  title_az TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  category_az TEXT NOT NULL,
  category_ru TEXT NOT NULL,
  category_en TEXT NOT NULL,
  industry_az TEXT,
  industry_ru TEXT,
  industry_en TEXT,
  service_type_az TEXT,
  service_type_ru TEXT,
  service_type_en TEXT,
  image_url TEXT NOT NULL,
  project_year INTEGER,
  metric_value TEXT,
  metric_label_az TEXT,
  metric_label_ru TEXT,
  metric_label_en TEXT,
  description_az TEXT,
  description_ru TEXT,
  description_en TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads (with UTM)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  selected_services TEXT,
  selected_package TEXT,
  budget TEXT,
  goals TEXT,
  deadline TEXT,
  additional_info TEXT,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
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
  is_published BOOLEAN DEFAULT true,
  published_date DATE,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_date);

-- Cases
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_az TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  client_name TEXT NOT NULL,
  industry_az TEXT NOT NULL,
  industry_ru TEXT NOT NULL,
  industry_en TEXT NOT NULL,
  service_type_az TEXT NOT NULL,
  service_type_ru TEXT NOT NULL,
  service_type_en TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  challenge_az TEXT NOT NULL,
  challenge_ru TEXT NOT NULL,
  challenge_en TEXT NOT NULL,
  solution_az TEXT NOT NULL,
  solution_ru TEXT NOT NULL,
  solution_en TEXT NOT NULL,
  results_az TEXT NOT NULL,
  results_ru TEXT NOT NULL,
  results_en TEXT NOT NULL,
  before_image_url TEXT,
  after_image_url TEXT,
  video_url TEXT,
  metric1_value TEXT,
  metric1_label_az TEXT,
  metric1_label_ru TEXT,
  metric1_label_en TEXT,
  metric2_value TEXT,
  metric2_label_az TEXT,
  metric2_label_ru TEXT,
  metric2_label_en TEXT,
  metric3_value TEXT,
  metric3_label_az TEXT,
  metric3_label_ru TEXT,
  metric3_label_en TEXT,
  quote_text_az TEXT,
  quote_text_ru TEXT,
  quote_text_en TEXT,
  quote_author TEXT,
  quote_position TEXT,
  project_year INTEGER NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cases_slug ON cases(slug);
CREATE INDEX IF NOT EXISTS idx_cases_featured ON cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_featured ON portfolio_items(is_featured);

-- Rate limits (for API throttling)
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_time BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- Enable RLS (optional): use service_role key from Workers to bypass RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (default for service_role)
-- No policies needed when using service_role key; anon/authenticated need policies if you add them later.
