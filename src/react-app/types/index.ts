// Common types used across the application

export type Service = {
  id: string;
  icon: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  description_az: string;
  description_ru: string;
  description_en: string;
  monthly_price: number;
  first_month_price: number;
};

export type PricingPackage = {
  id: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  monthly_price: number;
  first_month_price: number;
  is_popular: number;
};

export type Testimonial = {
  id: number;
  name_az: string;
  name_ru: string;
  name_en: string;
  company_az: string;
  company_ru: string;
  company_en: string;
  text_az: string;
  text_ru: string;
  text_en: string;
  rating: number;
};

export type PortfolioItem = {
  id: number;
  title_az: string;
  title_ru: string;
  title_en: string;
  category_az: string;
  category_ru: string;
  category_en: string;
  industry_az: string;
  industry_ru: string;
  industry_en: string;
  service_type_az: string;
  service_type_ru: string;
  service_type_en: string;
  image_url: string;
  project_year: number;
  metric_value: string;
  metric_label_az: string;
  metric_label_ru: string;
  metric_label_en: string;
  description_az: string;
  description_ru: string;
  description_en: string;
  is_featured: number;
};

export type CaseStudy = {
  id: number;
  slug: string;
  title_az: string;
  title_ru: string;
  title_en: string;
  client_name: string;
  industry_az: string;
  industry_ru: string;
  industry_en: string;
  service_type_az: string;
  service_type_ru: string;
  service_type_en: string;
  hero_image_url: string;
  challenge_az: string;
  challenge_ru: string;
  challenge_en: string;
  solution_az: string;
  solution_ru: string;
  solution_en: string;
  results_az: string;
  results_ru: string;
  results_en: string;
  metric1_value: string;
  metric1_label_az: string;
  metric1_label_ru: string;
  metric1_label_en: string;
  metric2_value: string;
  metric2_label_az: string;
  metric2_label_ru: string;
  metric2_label_en: string;
  metric3_value: string;
  metric3_label_az: string;
  metric3_label_ru: string;
  metric3_label_en: string;
  quote_text_az: string;
  quote_text_ru: string;
  quote_text_en: string;
  quote_author: string;
  quote_position: string;
  project_year: number;
};

export type BlogPost = {
  id: number;
  title_az: string;
  title_ru: string;
  title_en: string;
  slug: string;
  excerpt_az: string;
  excerpt_ru: string;
  excerpt_en: string;
  content_az: string;
  content_ru: string;
  content_en: string;
  category_az: string;
  category_ru: string;
  category_en: string;
  cover_image: string;
  published_date: string;
  author_name: string;
  is_published: number;
};

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  score: number;
  status: string;
  created_at: string;
  updated_at?: string;
  selected_package: string | null;
  selected_services: string | null;
  budget: string | null;
  goals: string | null;
  deadline: string | null;
  additional_info: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
};

export type DashboardStats = {
  totalLeads: number;
  todayLeads: number;
  avgScore: number;
  conversionRate: number;
  packageDistribution: Array<{ selected_package: string; count: number }>;
};
