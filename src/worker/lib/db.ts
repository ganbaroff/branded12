/**
 * Database abstraction: D1 or Supabase.
 * When env.SUPABASE_URL and env.SUPABASE_SERVICE_ROLE_KEY are set, Supabase is used; otherwise D1.
 */

import type { Env } from "@/shared/types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DataLayer = {
  getServices(): Promise<unknown[]>;
  getPackages(): Promise<unknown[]>;
  getTestimonials(): Promise<unknown[]>;
  getPortfolioItems(): Promise<unknown[]>;
  getPortfolioItem(id: number): Promise<unknown | null>;
  createPortfolioItem(data: Record<string, unknown>): Promise<void>;
  updatePortfolioItem(id: number, data: Record<string, unknown>): Promise<void>;
  deletePortfolioItem(id: number): Promise<void>;
  getCases(): Promise<unknown[]>;
  getCaseBySlug(slug: string): Promise<unknown | null>;
  createCase(data: Record<string, unknown>): Promise<void>;
  updateCase(id: number, data: Record<string, unknown>): Promise<void>;
  deleteCase(id: number): Promise<void>;
  getBlogPosts(): Promise<unknown[]>;
  getBlogPostBySlug(slug: string): Promise<unknown | null>;
  getAdminBlogPosts(): Promise<unknown[]>;
  createBlogPost(data: Record<string, unknown>): Promise<void>;
  updateBlogPost(id: number, data: Record<string, unknown>): Promise<void>;
  deleteBlogPost(id: number): Promise<void>;
  insertLead(data: Record<string, unknown>): Promise<{ id: number }>;
  getLeads(opts: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
    minScore?: number;
  }): Promise<{ leads: unknown[]; total: number }>;
  updateLeadStatus(id: number, status: string): Promise<void>;
  bulkUpdateLeadStatus(ids: number[], status: string): Promise<void>;
  deleteLead(id: number): Promise<void>;
  getAllLeads(): Promise<unknown[]>;
  getLeadStats(): Promise<{
    totalLeads: number;
    todayLeads: number;
    avgScore: number;
    conversionRate: number;
    packageDistribution: unknown[];
  }>;
  updateService(id: string, data: Record<string, unknown>): Promise<void>;
  updatePackage(id: string, data: Record<string, unknown>): Promise<void>;
  updateTestimonial(id: number, data: Record<string, unknown>): Promise<void>;
  rateLimitCheck(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; retryAfter?: number }>;
};

function createSupabaseClient(env: Env): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

function createD1DataLayer(db: D1Database): DataLayer {
  return {
    async getServices() {
      const { results } = await db.prepare("SELECT * FROM services ORDER BY display_order").all();
      return results ?? [];
    },
    async getPackages() {
      const { results } = await db
        .prepare("SELECT * FROM pricing_packages ORDER BY display_order")
        .all();
      return results ?? [];
    },
    async getTestimonials() {
      const { results } = await db
        .prepare("SELECT * FROM testimonials ORDER BY display_order")
        .all();
      return results ?? [];
    },
    async getPortfolioItems() {
      const { results } = await db
        .prepare(
          "SELECT * FROM portfolio_items ORDER BY display_order ASC, created_at DESC"
        )
        .all();
      return results ?? [];
    },
    async getPortfolioItem(id: number) {
      return db
        .prepare("SELECT * FROM portfolio_items WHERE id = ?")
        .bind(id)
        .first();
    },
    async createPortfolioItem(data: Record<string, unknown>) {
      await db
        .prepare(
          `INSERT INTO portfolio_items (
          title_az, title_ru, title_en, category_az, category_ru, category_en,
          industry_az, industry_ru, industry_en, service_type_az, service_type_ru, service_type_en,
          image_url, project_year, metric_value, metric_label_az, metric_label_ru, metric_label_en,
          description_az, description_ru, description_en, is_featured, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.title_az,
          data.title_ru,
          data.title_en,
          data.category_az,
          data.category_ru,
          data.category_en,
          data.industry_az ?? null,
          data.industry_ru ?? null,
          data.industry_en ?? null,
          data.service_type_az ?? null,
          data.service_type_ru ?? null,
          data.service_type_en ?? null,
          data.image_url,
          data.project_year ?? null,
          data.metric_value ?? null,
          data.metric_label_az ?? null,
          data.metric_label_ru ?? null,
          data.metric_label_en ?? null,
          data.description_az ?? null,
          data.description_ru ?? null,
          data.description_en ?? null,
          (data.is_featured as boolean) ? 1 : 0,
          (data.display_order as number) ?? 0
        )
        .run();
    },
    async updatePortfolioItem(id: number, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE portfolio_items SET
          title_az = ?, title_ru = ?, title_en = ?, category_az = ?, category_ru = ?, category_en = ?,
          industry_az = ?, industry_ru = ?, industry_en = ?, service_type_az = ?, service_type_ru = ?, service_type_en = ?,
          image_url = ?, project_year = ?, metric_value = ?, metric_label_az = ?, metric_label_ru = ?, metric_label_en = ?,
          description_az = ?, description_ru = ?, description_en = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(
          data.title_az,
          data.title_ru,
          data.title_en,
          data.category_az,
          data.category_ru,
          data.category_en,
          data.industry_az ?? null,
          data.industry_ru ?? null,
          data.industry_en ?? null,
          data.service_type_az ?? null,
          data.service_type_ru ?? null,
          data.service_type_en ?? null,
          data.image_url,
          data.project_year ?? null,
          data.metric_value ?? null,
          data.metric_label_az ?? null,
          data.metric_label_ru ?? null,
          data.metric_label_en ?? null,
          data.description_az ?? null,
          data.description_ru ?? null,
          data.description_en ?? null,
          (data.is_featured as boolean) ? 1 : 0,
          id
        )
        .run();
    },
    async deletePortfolioItem(id: number) {
      await db.prepare("DELETE FROM portfolio_items WHERE id = ?").bind(id).run();
    },
    async getCases() {
      const { results } = await db
        .prepare("SELECT * FROM cases ORDER BY display_order ASC, created_at DESC")
        .all();
      return results ?? [];
    },
    async getCaseBySlug(slug: string) {
      return db.prepare("SELECT * FROM cases WHERE slug = ?").bind(slug).first();
    },
    async createCase(data: Record<string, unknown>) {
      await db
        .prepare(
          `INSERT INTO cases (
          slug, title_az, title_ru, title_en, client_name,
          industry_az, industry_ru, industry_en, service_type_az, service_type_ru, service_type_en,
          hero_image_url, challenge_az, challenge_ru, challenge_en, solution_az, solution_ru, solution_en,
          results_az, results_ru, results_en,
          metric1_value, metric1_label_az, metric1_label_ru, metric1_label_en,
          metric2_value, metric2_label_az, metric2_label_ru, metric2_label_en,
          metric3_value, metric3_label_az, metric3_label_ru, metric3_label_en,
          quote_text_az, quote_text_ru, quote_text_en, quote_author, quote_position, project_year, is_featured, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.slug,
          data.title_az,
          data.title_ru,
          data.title_en,
          data.client_name,
          data.industry_az,
          data.industry_ru,
          data.industry_en,
          data.service_type_az,
          data.service_type_ru,
          data.service_type_en,
          data.hero_image_url,
          data.challenge_az,
          data.challenge_ru,
          data.challenge_en,
          data.solution_az,
          data.solution_ru,
          data.solution_en,
          data.results_az,
          data.results_ru,
          data.results_en,
          data.metric1_value ?? null,
          data.metric1_label_az ?? null,
          data.metric1_label_ru ?? null,
          data.metric1_label_en ?? null,
          data.metric2_value ?? null,
          data.metric2_label_az ?? null,
          data.metric2_label_ru ?? null,
          data.metric2_label_en ?? null,
          data.metric3_value ?? null,
          data.metric3_label_az ?? null,
          data.metric3_label_ru ?? null,
          data.metric3_label_en ?? null,
          data.quote_text_az ?? null,
          data.quote_text_ru ?? null,
          data.quote_text_en ?? null,
          data.quote_author ?? null,
          data.quote_position ?? null,
          data.project_year,
          (data.is_featured as boolean) ? 1 : 0,
          (data.display_order as number) ?? 0
        )
        .run();
    },
    async updateCase(id: number, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE cases SET
          slug = ?, title_az = ?, title_ru = ?, title_en = ?, client_name = ?,
          industry_az = ?, industry_ru = ?, industry_en = ?, service_type_az = ?, service_type_ru = ?, service_type_en = ?,
          hero_image_url = ?, challenge_az = ?, challenge_ru = ?, challenge_en = ?,
          solution_az = ?, solution_ru = ?, solution_en = ?, results_az = ?, results_ru = ?, results_en = ?,
          metric1_value = ?, metric1_label_az = ?, metric1_label_ru = ?, metric1_label_en = ?,
          metric2_value = ?, metric2_label_az = ?, metric2_label_ru = ?, metric2_label_en = ?,
          metric3_value = ?, metric3_label_az = ?, metric3_label_ru = ?, metric3_label_en = ?,
          quote_text_az = ?, quote_text_ru = ?, quote_text_en = ?, quote_author = ?, quote_position = ?, project_year = ?, is_featured = ?,
          updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        .bind(
          data.slug,
          data.title_az,
          data.title_ru,
          data.title_en,
          data.client_name,
          data.industry_az,
          data.industry_ru,
          data.industry_en,
          data.service_type_az,
          data.service_type_ru,
          data.service_type_en,
          data.hero_image_url,
          data.challenge_az,
          data.challenge_ru,
          data.challenge_en,
          data.solution_az,
          data.solution_ru,
          data.solution_en,
          data.results_az,
          data.results_ru,
          data.results_en,
          data.metric1_value,
          data.metric1_label_az,
          data.metric1_label_ru,
          data.metric1_label_en,
          data.metric2_value,
          data.metric2_label_az,
          data.metric2_label_ru,
          data.metric2_label_en,
          data.metric3_value,
          data.metric3_label_az,
          data.metric3_label_ru,
          data.metric3_label_en,
          data.quote_text_az,
          data.quote_text_ru,
          data.quote_text_en,
          data.quote_author,
          data.quote_position,
          data.project_year,
          (data.is_featured as boolean) ? 1 : 0,
          id
        )
        .run();
    },
    async deleteCase(id: number) {
      await db.prepare("DELETE FROM cases WHERE id = ?").bind(id).run();
    },
    async getBlogPosts() {
      const { results } = await db
        .prepare(
          "SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_date DESC"
        )
        .all();
      return results ?? [];
    },
    async getBlogPostBySlug(slug: string) {
      return db
        .prepare(
          "SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1"
        )
        .bind(slug)
        .first();
    },
    async getAdminBlogPosts() {
      const { results } = await db
        .prepare("SELECT * FROM blog_posts ORDER BY published_date DESC")
        .all();
      return results ?? [];
    },
    async createBlogPost(data: Record<string, unknown>) {
      await db
        .prepare(
          `INSERT INTO blog_posts (
          slug, title_az, title_ru, title_en, excerpt_az, excerpt_ru, excerpt_en,
          content_az, content_ru, content_en, category_az, category_ru, category_en,
          cover_image, author_name, published_date, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.slug,
          data.title_az,
          data.title_ru,
          data.title_en,
          data.excerpt_az ?? null,
          data.excerpt_ru ?? null,
          data.excerpt_en ?? null,
          (data.content_az as string) ?? "",
          (data.content_ru as string) ?? "",
          (data.content_en as string) ?? "",
          data.category_az ?? null,
          data.category_ru ?? null,
          data.category_en ?? null,
          data.cover_image ?? null,
          data.author_name ?? null,
          (data.published_date as string) ?? new Date().toISOString().split("T")[0],
          (data.is_published as boolean) ? 1 : 0
        )
        .run();
    },
    async updateBlogPost(id: number, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE blog_posts SET
          slug = ?, title_az = ?, title_ru = ?, title_en = ?,
          excerpt_az = ?, excerpt_ru = ?, excerpt_en = ?,
          category_az = ?, category_ru = ?, category_en = ?,
          cover_image = ?, author_name = ?, published_date = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(
          data.slug,
          data.title_az,
          data.title_ru,
          data.title_en,
          data.excerpt_az,
          data.excerpt_ru,
          data.excerpt_en,
          data.category_az,
          data.category_ru,
          data.category_en,
          data.cover_image,
          data.author_name,
          data.published_date,
          data.is_published,
          id
        )
        .run();
    },
    async deleteBlogPost(id: number) {
      await db.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
    },
    async insertLead(data: Record<string, unknown>) {
      const r = await db
        .prepare(
          `INSERT INTO leads (
          name, company, phone, email, selected_services, selected_package, budget,
          goals, deadline, additional_info, score, utm_source, utm_medium, utm_campaign, referrer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.name,
          data.company ?? null,
          data.phone ?? null,
          data.email,
          data.selected_services ?? null,
          data.selected_package ?? null,
          data.budget ?? null,
          data.goals ?? null,
          data.deadline ?? null,
          data.additional_info ?? null,
          (data.score as number) ?? 0,
          data.utm_source ?? null,
          data.utm_medium ?? null,
          data.utm_campaign ?? null,
          data.referrer ?? null
        )
        .run();
      return { id: r.meta?.last_row_id as number };
    },
    async getLeads(opts) {
      const { page, limit, status, search, minScore } = opts;
      const offset = (page - 1) * limit;
      const conditions: string[] = [];
      const params: (string | number)[] = [];
      if (status && status !== "all") {
        conditions.push("status = ?");
        params.push(status);
      }
      if (search) {
        conditions.push(
          "(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)"
        );
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      if (minScore != null) {
        conditions.push("score >= ?");
        params.push(minScore);
      }
      const where = conditions.length
        ? "WHERE " + conditions.join(" AND ")
        : "";
      const countR = await db
        .prepare(`SELECT COUNT(*) as total FROM leads ${where}`)
        .bind(...params)
        .first<{ total: number }>();
      const total = countR?.total ?? 0;
      const { results } = await db
        .prepare(
          `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
        )
        .bind(...params, limit, offset)
        .all();
      return { leads: results ?? [], total };
    },
    async updateLeadStatus(id: number, status: string) {
      await db
        .prepare(
          "UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
        .bind(status, id)
        .run();
    },
    async bulkUpdateLeadStatus(ids: number[], status: string) {
      if (ids.length === 0) return;
      const placeholders = ids.map(() => "?").join(",");
      await db
        .prepare(
          `UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`
        )
        .bind(status, ...ids)
        .run();
    },
    async deleteLead(id: number) {
      await db.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
    },
    async getAllLeads() {
      const { results } = await db
        .prepare("SELECT * FROM leads ORDER BY created_at DESC")
        .all();
      return results ?? [];
    },
    async getLeadStats() {
      const today = new Date().toISOString().split("T")[0];
      const [totalR, todayR, avgR, highR, pkgR] = await Promise.all([
        db.prepare("SELECT COUNT(*) as count FROM leads").first<{ count: number }>(),
        db
          .prepare(
            "SELECT COUNT(*) as count FROM leads WHERE DATE(created_at) = ?"
          )
          .bind(today)
          .first<{ count: number }>(),
        db
          .prepare("SELECT AVG(score) as avg FROM leads WHERE score > 0")
          .first<{ avg: number }>(),
        db
          .prepare("SELECT COUNT(*) as count FROM leads WHERE score >= 50")
          .first<{ count: number }>(),
        db
          .prepare(
            "SELECT selected_package, COUNT(*) as count FROM leads WHERE selected_package != '' GROUP BY selected_package"
          )
          .all(),
      ]);
      const totalLeads = totalR?.count ?? 0;
      const todayLeads = todayR?.count ?? 0;
      const avgScore = Math.round(avgR?.avg ?? 0);
      const highQuality = highR?.count ?? 0;
      const conversionRate =
        totalLeads > 0 ? Math.round((highQuality / totalLeads) * 100) : 0;
      return {
        totalLeads,
        todayLeads,
        avgScore,
        conversionRate,
        packageDistribution: pkgR?.results ?? [],
      };
    },
    async updateService(id: string, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE services SET
          icon = ?, name_az = ?, name_ru = ?, name_en = ?,
          description_az = ?, description_ru = ?, description_en = ?,
          monthly_price = ?, first_month_price = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(
          data.icon,
          data.name_az,
          data.name_ru,
          data.name_en,
          data.description_az,
          data.description_ru,
          data.description_en,
          data.monthly_price,
          data.first_month_price,
          id
        )
        .run();
    },
    async updatePackage(id: string, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE pricing_packages SET
          name_az = ?, name_ru = ?, name_en = ?, monthly_price = ?, first_month_price = ?,
          is_popular = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        .bind(
          data.name_az,
          data.name_ru,
          data.name_en,
          data.monthly_price,
          data.first_month_price,
          (data.is_popular as boolean) ? 1 : 0,
          id
        )
        .run();
    },
    async updateTestimonial(id: number, data: Record<string, unknown>) {
      await db
        .prepare(
          `UPDATE testimonials SET
          name_az = ?, name_ru = ?, name_en = ?, company_az = ?, company_ru = ?, company_en = ?,
          text_az = ?, text_ru = ?, text_en = ?, rating = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(
          data.name_az,
          data.name_ru,
          data.name_en,
          data.company_az,
          data.company_ru,
          data.company_en,
          data.text_az,
          data.text_ru,
          data.text_en,
          data.rating,
          id
        )
        .run();
    },
    async rateLimitCheck(key: string, limit: number, windowMs: number) {
      const now = Date.now();
      const resetTime = now + windowMs;
      const existing = await db
        .prepare("SELECT * FROM rate_limits WHERE key = ?")
        .bind(key)
        .first<{ key: string; count: number; reset_time: number }>();
      db.prepare("DELETE FROM rate_limits WHERE reset_time < ?")
        .bind(now)
        .run()
        .catch(() => {});
      if (!existing || now > existing.reset_time) {
        await db
          .prepare(
            "INSERT OR REPLACE INTO rate_limits (key, count, reset_time, created_at) VALUES (?, ?, ?, ?)"
          )
          .bind(key, 1, resetTime, now)
          .run();
        return { allowed: true };
      }
      const newCount = existing.count + 1;
      await db
        .prepare("UPDATE rate_limits SET count = ? WHERE key = ?")
        .bind(newCount, key)
        .run();
      if (newCount > limit) {
        return {
          allowed: false,
          retryAfter: Math.ceil((existing.reset_time - now) / 1000),
        };
      }
      return { allowed: true };
    },
  };
}

function createSupabaseDataLayer(supabase: SupabaseClient): DataLayer {
  return {
    async getServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
    async getPackages() {
      const { data, error } = await supabase
        .from("pricing_packages")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
    async getTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
    async getPortfolioItems() {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async getPortfolioItem(id: number) {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    async createPortfolioItem(data: Record<string, unknown>) {
      const { error } = await supabase.from("portfolio_items").insert({
        title_az: data.title_az,
        title_ru: data.title_ru,
        title_en: data.title_en,
        category_az: data.category_az,
        category_ru: data.category_ru,
        category_en: data.category_en,
        industry_az: data.industry_az ?? null,
        industry_ru: data.industry_ru ?? null,
        industry_en: data.industry_en ?? null,
        service_type_az: data.service_type_az ?? null,
        service_type_ru: data.service_type_ru ?? null,
        service_type_en: data.service_type_en ?? null,
        image_url: data.image_url,
        project_year: data.project_year ?? null,
        metric_value: data.metric_value ?? null,
        metric_label_az: data.metric_label_az ?? null,
        metric_label_ru: data.metric_label_ru ?? null,
        metric_label_en: data.metric_label_en ?? null,
        description_az: data.description_az ?? null,
        description_ru: data.description_ru ?? null,
        description_en: data.description_en ?? null,
        is_featured: !!data.is_featured,
        display_order: (data.display_order as number) ?? 0,
      });
      if (error) throw error;
    },
    async updatePortfolioItem(id: number, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("portfolio_items")
        .update({
          title_az: data.title_az,
          title_ru: data.title_ru,
          title_en: data.title_en,
          category_az: data.category_az,
          category_ru: data.category_ru,
          category_en: data.category_en,
          industry_az: data.industry_az ?? null,
          industry_ru: data.industry_ru ?? null,
          industry_en: data.industry_en ?? null,
          service_type_az: data.service_type_az ?? null,
          service_type_ru: data.service_type_ru ?? null,
          service_type_en: data.service_type_en ?? null,
          image_url: data.image_url,
          project_year: data.project_year ?? null,
          metric_value: data.metric_value ?? null,
          metric_label_az: data.metric_label_az ?? null,
          metric_label_ru: data.metric_label_ru ?? null,
          metric_label_en: data.metric_label_en ?? null,
          description_az: data.description_az ?? null,
          description_ru: data.description_ru ?? null,
          description_en: data.description_en ?? null,
          is_featured: !!data.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async deletePortfolioItem(id: number) {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    async getCases() {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async getCaseBySlug(slug: string) {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    async createCase(data: Record<string, unknown>) {
      const { error } = await supabase.from("cases").insert({
        slug: data.slug,
        title_az: data.title_az,
        title_ru: data.title_ru,
        title_en: data.title_en,
        client_name: data.client_name,
        industry_az: data.industry_az,
        industry_ru: data.industry_ru,
        industry_en: data.industry_en,
        service_type_az: data.service_type_az,
        service_type_ru: data.service_type_ru,
        service_type_en: data.service_type_en,
        hero_image_url: data.hero_image_url,
        challenge_az: data.challenge_az,
        challenge_ru: data.challenge_ru,
        challenge_en: data.challenge_en,
        solution_az: data.solution_az,
        solution_ru: data.solution_ru,
        solution_en: data.solution_en,
        results_az: data.results_az,
        results_ru: data.results_ru,
        results_en: data.results_en,
        metric1_value: data.metric1_value ?? null,
        metric1_label_az: data.metric1_label_az ?? null,
        metric1_label_ru: data.metric1_label_ru ?? null,
        metric1_label_en: data.metric1_label_en ?? null,
        metric2_value: data.metric2_value ?? null,
        metric2_label_az: data.metric2_label_az ?? null,
        metric2_label_ru: data.metric2_label_ru ?? null,
        metric2_label_en: data.metric2_label_en ?? null,
        metric3_value: data.metric3_value ?? null,
        metric3_label_az: data.metric3_label_az ?? null,
        metric3_label_ru: data.metric3_label_ru ?? null,
        metric3_label_en: data.metric3_label_en ?? null,
        quote_text_az: data.quote_text_az ?? null,
        quote_text_ru: data.quote_text_ru ?? null,
        quote_text_en: data.quote_text_en ?? null,
        quote_author: data.quote_author ?? null,
        quote_position: data.quote_position ?? null,
        project_year: data.project_year,
        is_featured: !!data.is_featured,
        display_order: (data.display_order as number) ?? 0,
      });
      if (error) throw error;
    },
    async updateCase(id: number, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("cases")
        .update({
          slug: data.slug,
          title_az: data.title_az,
          title_ru: data.title_ru,
          title_en: data.title_en,
          client_name: data.client_name,
          industry_az: data.industry_az,
          industry_ru: data.industry_ru,
          industry_en: data.industry_en,
          service_type_az: data.service_type_az,
          service_type_ru: data.service_type_ru,
          service_type_en: data.service_type_en,
          hero_image_url: data.hero_image_url,
          challenge_az: data.challenge_az,
          challenge_ru: data.challenge_ru,
          challenge_en: data.challenge_en,
          solution_az: data.solution_az,
          solution_ru: data.solution_ru,
          solution_en: data.solution_en,
          results_az: data.results_az,
          results_ru: data.results_ru,
          results_en: data.results_en,
          metric1_value: data.metric1_value,
          metric1_label_az: data.metric1_label_az,
          metric1_label_ru: data.metric1_label_ru,
          metric1_label_en: data.metric1_label_en,
          metric2_value: data.metric2_value,
          metric2_label_az: data.metric2_label_az,
          metric2_label_ru: data.metric2_label_ru,
          metric2_label_en: data.metric2_label_en,
          metric3_value: data.metric3_value,
          metric3_label_az: data.metric3_label_az,
          metric3_label_ru: data.metric3_label_ru,
          metric3_label_en: data.metric3_label_en,
          quote_text_az: data.quote_text_az,
          quote_text_ru: data.quote_text_ru,
          quote_text_en: data.quote_text_en,
          quote_author: data.quote_author,
          quote_position: data.quote_position,
          project_year: data.project_year,
          is_featured: !!data.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async deleteCase(id: number) {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
    },
    async getBlogPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async getBlogPostBySlug(slug: string) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    async getAdminBlogPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async createBlogPost(data: Record<string, unknown>) {
      const { error } = await supabase.from("blog_posts").insert({
        slug: data.slug,
        title_az: data.title_az,
        title_ru: data.title_ru,
        title_en: data.title_en,
        excerpt_az: data.excerpt_az ?? null,
        excerpt_ru: data.excerpt_ru ?? null,
        excerpt_en: data.excerpt_en ?? null,
        content_az: (data.content_az as string) ?? "",
        content_ru: (data.content_ru as string) ?? "",
        content_en: (data.content_en as string) ?? "",
        category_az: data.category_az ?? null,
        category_ru: data.category_ru ?? null,
        category_en: data.category_en ?? null,
        cover_image: data.cover_image ?? null,
        author_name: data.author_name ?? null,
        published_date:
          (data.published_date as string) ?? new Date().toISOString().split("T")[0],
        is_published: !!data.is_published,
      });
      if (error) throw error;
    },
    async updateBlogPost(id: number, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          slug: data.slug,
          title_az: data.title_az,
          title_ru: data.title_ru,
          title_en: data.title_en,
          excerpt_az: data.excerpt_az,
          excerpt_ru: data.excerpt_ru,
          excerpt_en: data.excerpt_en,
          category_az: data.category_az,
          category_ru: data.category_ru,
          category_en: data.category_en,
          cover_image: data.cover_image,
          author_name: data.author_name,
          published_date: data.published_date,
          is_published: data.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async deleteBlogPost(id: number) {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    async insertLead(data: Record<string, unknown>) {
      const { data: row, error } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          company: data.company ?? null,
          phone: data.phone ?? null,
          email: data.email,
          selected_services: data.selected_services ?? null,
          selected_package: data.selected_package ?? null,
          budget: data.budget ?? null,
          goals: data.goals ?? null,
          deadline: data.deadline ?? null,
          additional_info: data.additional_info ?? null,
          score: (data.score as number) ?? 0,
          utm_source: data.utm_source ?? null,
          utm_medium: data.utm_medium ?? null,
          utm_campaign: data.utm_campaign ?? null,
          referrer: data.referrer ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return { id: (row as { id: number }).id };
    },
    async getLeads(opts) {
      const { page, limit, status, search, minScore } = opts;
      const from = (page - 1) * limit;
      let q = supabase.from("leads").select("*", { count: "exact", head: false });
      if (status && status !== "all") q = q.eq("status", status);
      if (search) {
        q = q.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
        );
      }
      if (minScore != null) q = q.gte("score", minScore);
      const { data, error, count } = await q
        .order("created_at", { ascending: false })
        .range(from, from + limit - 1);
      if (error) throw error;
      return { leads: data ?? [], total: count ?? 0 };
    },
    async updateLeadStatus(id: number, status: string) {
      const { error } = await supabase
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    async bulkUpdateLeadStatus(ids: number[], status: string) {
      if (ids.length === 0) return;
      const { error } = await supabase
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
    },
    async deleteLead(id: number) {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    async getAllLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async getLeadStats() {
      const today = new Date().toISOString().split("T")[0];
      const nextDay = new Date(Date.UTC(
        parseInt(today.slice(0, 4), 10),
        parseInt(today.slice(5, 7), 10) - 1,
        parseInt(today.slice(8, 10), 10) + 1
      )).toISOString().slice(0, 19) + "Z";
      const [totalR, todayR, highR, pkgR] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", `${today}T00:00:00.000Z`)
          .lt("created_at", nextDay),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gte("score", 50),
        supabase
          .from("leads")
          .select("selected_package")
          .neq("selected_package", ""),
      ]);
      const totalLeads = totalR.count ?? 0;
      const todayLeads = todayR.count ?? 0;
      let avgScore = 0;
      const { data: avgData } = await supabase
        .from("leads")
        .select("score")
        .gt("score", 0);
      if (avgData?.length) {
        avgScore = Math.round(
          avgData.reduce((a, r) => a + (r.score ?? 0), 0) / avgData.length
        );
      }
      const highQuality = highR.count ?? 0;
      const conversionRate =
        totalLeads > 0 ? Math.round((highQuality / totalLeads) * 100) : 0;
      const packageMap = new Map<string, number>();
      for (const row of pkgR.data ?? []) {
        const pkg = (row as { selected_package: string }).selected_package;
        if (pkg) packageMap.set(pkg, (packageMap.get(pkg) ?? 0) + 1);
      }
      const packageDistribution = Array.from(packageMap.entries()).map(
        ([selected_package, count]) => ({ selected_package, count })
      );
      return {
        totalLeads,
        todayLeads,
        avgScore,
        conversionRate,
        packageDistribution,
      };
    },
    async updateService(id: string, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("services")
        .update({
          icon: data.icon,
          name_az: data.name_az,
          name_ru: data.name_ru,
          name_en: data.name_en,
          description_az: data.description_az,
          description_ru: data.description_ru,
          description_en: data.description_en,
          monthly_price: data.monthly_price,
          first_month_price: data.first_month_price,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async updatePackage(id: string, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("pricing_packages")
        .update({
          name_az: data.name_az,
          name_ru: data.name_ru,
          name_en: data.name_en,
          monthly_price: data.monthly_price,
          first_month_price: data.first_month_price,
          is_popular: !!data.is_popular,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async updateTestimonial(id: number, data: Record<string, unknown>) {
      const { error } = await supabase
        .from("testimonials")
        .update({
          name_az: data.name_az,
          name_ru: data.name_ru,
          name_en: data.name_en,
          company_az: data.company_az,
          company_ru: data.company_ru,
          company_en: data.company_en,
          text_az: data.text_az,
          text_ru: data.text_ru,
          text_en: data.text_en,
          rating: data.rating,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    async rateLimitCheck(key: string, limit: number, windowMs: number) {
      const now = Date.now();
      const resetTime = now + windowMs;
      const { data: existing } = await supabase
        .from("rate_limits")
        .select("key, count, reset_time")
        .eq("key", key)
        .maybeSingle();
      await supabase.from("rate_limits").delete().lt("reset_time", now);
      if (!existing || now > (existing.reset_time as number)) {
        await supabase.from("rate_limits").upsert(
          { key, count: 1, reset_time: resetTime, created_at: now },
          { onConflict: "key" }
        );
        return { allowed: true };
      }
      const newCount = (existing.count as number) + 1;
      await supabase
        .from("rate_limits")
        .update({ count: newCount })
        .eq("key", key);
      if (newCount > limit) {
        return {
          allowed: false,
          retryAfter: Math.ceil(((existing.reset_time as number) - now) / 1000),
        };
      }
      return { allowed: true };
    },
  };
}

export function getDb(env: Env): DataLayer {
  const supabase = createSupabaseClient(env);
  if (supabase) return createSupabaseDataLayer(supabase);
  if (!env.DB) throw new Error("No database: set either DB (D1) or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  return createD1DataLayer(env.DB);
}
