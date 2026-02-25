import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { Loader2, LogOut, Save, Settings } from "lucide-react";
import { toast } from "@/react-app/lib/toast";
import { apiGet, apiPut, apiPost, apiDelete, ApiError } from "@/react-app/lib/api";
import type { 
  Service, 
  PricingPackage as Package, 
  Testimonial, 
  PortfolioItem, 
  CaseStudy, 
  BlogPost, 
  Lead, 
  DashboardStats 
} from "@/react-app/types";

type AdminUser = { id: string };

export default function AdminPage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authPending, setAuthPending] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "services" | "packages" | "testimonials" | "portfolio" | "cases" | "leads" | "blog">("dashboard");
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsPagination, setLeadsPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [leadsFilter, setLeadsFilter] = useState<{
    status: string;
    search: string;
    minScore: string;
  }>({ status: "all", search: "", minScore: "" });
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [creatingBlog, setCreatingBlog] = useState(false);

  const apiOpts = { on401: () => setUser(null) };

  const loadData = async () => {
    setLoading(true);
    const opts = apiOpts;
    try {
      const leadsParams = new URLSearchParams({
        page: leadsPage.toString(),
        limit: "20"
      });
      if (leadsFilter.status !== "all") leadsParams.append("status", leadsFilter.status);
      if (leadsFilter.search) leadsParams.append("search", leadsFilter.search);
      if (leadsFilter.minScore) leadsParams.append("minScore", leadsFilter.minScore);

      const [services, pkgList, testimonials, portfolioData, casesData, leadsData, blogPostsData, statsData] = await Promise.all([
        apiGet<Service[]>("/api/admin/services", opts),
        apiGet<Package[]>("/api/admin/packages", opts),
        apiGet<Testimonial[]>("/api/admin/testimonials", opts),
        apiGet<PortfolioItem[]>("/api/admin/portfolio", opts),
        apiGet<CaseStudy[]>("/api/admin/cases", opts),
        apiGet<{ leads: Lead[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
          `/api/admin/leads?${leadsParams.toString()}`,
          opts
        ),
        apiGet<BlogPost[]>("/api/admin/blog", opts),
        apiGet<DashboardStats>("/api/admin/stats", opts),
      ]);

      setServices(services);
      setPackages(pkgList);
      setTestimonials(testimonials);
      setPortfolio(portfolioData);
      setCases(casesData);
      setLeads(leadsData.leads ?? []);
      setLeadsPagination(leadsData.pagination ?? null);
      setBlogPosts(blogPostsData);
      setStats(statsData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
    // loadData intentionally omitted to avoid re-fetch on every identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, leadsPage, leadsFilter.status, leadsFilter.search, leadsFilter.minScore]);

  // Check session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!cancelled) {
          if (data?.user) setUser(data.user);
          else setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setAuthPending(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setUser({ id: "admin" });
        setPassword("");
      } else {
        setLoginError(language === "az" ? "Yanlış parol" : language === "ru" ? "Неверный пароль" : "Wrong password");
      }
    } catch {
      setLoginError(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  const updateService = async (service: Service) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/services/${service.id}`, service, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update service:", error);
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  const updatePackage = async (pkg: Package) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/packages/${pkg.id}`, pkg, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update package:", error);
      toast.error("Failed to update package");
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = async (testimonial: Testimonial) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/testimonials/${testimonial.id}`, testimonial, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update testimonial:", error);
      toast.error("Failed to update testimonial");
    } finally {
      setSaving(false);
    }
  };

  const updatePortfolioItem = async (item: PortfolioItem) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/portfolio/${item.id}`, item, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update portfolio item:", error);
      toast.error("Failed to update portfolio item");
    } finally {
      setSaving(false);
    }
  };

  const updateCase = async (caseStudy: CaseStudy) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/cases/${caseStudy.id}`, caseStudy, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update case:", error);
      toast.error("Failed to update case");
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm(language === "az" ? "Bu müraciəti silmək istədiyinizə əminsiniz?" : language === "ru" ? "Вы уверены, что хотите удалить этот лид?" : "Are you sure you want to delete this lead?")) return;
    
    setSaving(true);
    try {
      await apiDelete(`/api/admin/leads/${id}`, apiOpts);
      toast.success(language === "az" ? "Müraciət silindi" : language === "ru" ? "Лид удален" : "Lead deleted");
      await loadData();
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast.error("Failed to delete lead");
      toast.error(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/leads/${id}/status`, { status }, apiOpts);
      toast.success(language === "az" ? "Status yeniləndi" : language === "ru" ? "Статус обновлен" : "Status updated");
      await loadData();
    } catch (error) {
      console.error("Failed to update lead status:", error);
      toast.error(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedLeads.length === 0) return;
    
    setSaving(true);
    try {
      await apiPost("/api/admin/leads/bulk-status", { ids: selectedLeads, status }, apiOpts);
      toast.success(
        language === "az" 
          ? `${selectedLeads.length} müraciətin statusu yeniləndi`
          : language === "ru"
          ? `Статус ${selectedLeads.length} лидов обновлен`
          : `${selectedLeads.length} leads updated`
      );
      setSelectedLeads([]);
      await loadData();
    } catch (error) {
      console.error("Failed to bulk update:", error);
      toast.error(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const createBlogPost = async (post: Partial<BlogPost>) => {
    setSaving(true);
    try {
      await apiPost("/api/admin/blog", post, apiOpts);
      toast.success(language === "az" ? "Blog yazısı yaradıldı" : language === "ru" ? "Пост создан" : "Blog post created");
      setCreatingBlog(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create blog post:", error);
      toast.error(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteBlogPost = async (id: number) => {
    if (!confirm(language === "az" ? "Bu yazını silmək istədiyinizə əminsiniz?" : language === "ru" ? "Вы уверены, что хотите удалить этот пост?" : "Are you sure you want to delete this post?")) return;
    
    setSaving(true);
    try {
      await apiDelete(`/api/admin/blog/${id}`, apiOpts);
      toast.success(language === "az" ? "Yazı silindi" : language === "ru" ? "Пост удален" : "Post deleted");
      await loadData();
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      toast.error("Failed to delete blog post");
      toast.error(language === "az" ? "Xəta baş verdi" : language === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const exportLeads = () => {
    window.open("/api/admin/export/leads", "_blank");
  };

  const updateBlogPost = async (post: BlogPost) => {
    setSaving(true);
    try {
      await apiPut(`/api/admin/blog/${post.id}`, post, apiOpts);
      await loadData();
    } catch (error) {
      console.error("Failed to update blog post:", error);
      toast.error("Failed to update blog post");
    } finally {
      setSaving(false);
    }
  };

  if (authPending) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#FF4D00] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Settings className="w-16 h-16 text-[#FF4D00] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
            <p className="text-gray-400">
              {language === "az"
                ? "İdarəetmə panelinə daxil olmaq üçün parol daxil edin"
                : language === "ru"
                ? "Введите пароль для доступа к панели управления"
                : "Enter password to access the admin panel"}
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              placeholder={language === "az" ? "Parol" : language === "ru" ? "Пароль" : "Password"}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#FF4D00] focus:outline-none"
              autoFocus
              autoComplete="current-password"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              type="submit"
              disabled={loginSubmitting || !password.trim()}
              className="w-full px-8 py-4 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginSubmitting
                ? (language === "az" ? "Yoxlanılır..." : language === "ru" ? "Проверка..." : "Checking...")
                : (language === "az" ? "Daxil ol" : language === "ru" ? "Войти" : "Sign in")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Header */}
      <section className="py-8 px-4 bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {language === "az" ? "Çıxış" : language === "ru" ? "Выйти" : "Logout"}
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 px-4 bg-[#0F0F0F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto">
            {(["dashboard", "services", "packages", "testimonials", "portfolio", "cases", "leads", "blog"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-[#FF4D00] text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {tab === "dashboard"
                  ? language === "az"
                    ? "İdarə Paneli"
                    : language === "ru"
                    ? "Панель"
                    : "Dashboard"
                  : tab === "services"
                  ? language === "az"
                    ? "Xidmətlər"
                    : language === "ru"
                    ? "Услуги"
                    : "Services"
                  : tab === "packages"
                  ? language === "az"
                    ? "Paketlər"
                    : language === "ru"
                    ? "Пакеты"
                    : "Packages"
                  : tab === "testimonials"
                  ? language === "az"
                    ? "Rəylər"
                    : language === "ru"
                    ? "Отзывы"
                    : "Testimonials"
                  : tab === "portfolio"
                  ? language === "az"
                    ? "Portfolio"
                    : language === "ru"
                    ? "Портфолио"
                    : "Portfolio"
                  : tab === "cases"
                  ? language === "az"
                    ? "Keyslar"
                    : language === "ru"
                    ? "Кейсы"
                    : "Cases"
                  : tab === "leads"
                  ? language === "az"
                    ? "Müraciətlər"
                    : language === "ru"
                    ? "Лиды"
                    : "Leads"
                  : language === "az"
                  ? "Bloq"
                  : language === "ru"
                  ? "Блог"
                  : "Blog"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#FF4D00] animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-[#FF4D00]/20 to-[#FF4D00]/5 rounded-lg p-6 border border-[#FF4D00]/20">
                      <div className="text-white/60 text-sm mb-2">
                        {language === "az" ? "Cəmi Müraciətlər" : language === "ru" ? "Всего лидов" : "Total Leads"}
                      </div>
                      <div className="text-4xl font-bold text-white">{stats.totalLeads}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg p-6 border border-green-500/20">
                      <div className="text-white/60 text-sm mb-2">
                        {language === "az" ? "Bu gün" : language === "ru" ? "Сегодня" : "Today"}
                      </div>
                      <div className="text-4xl font-bold text-white">{stats.todayLeads}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-lg p-6 border border-blue-500/20">
                      <div className="text-white/60 text-sm mb-2">
                        {language === "az" ? "Orta Bal" : language === "ru" ? "Средний балл" : "Avg Score"}
                      </div>
                      <div className="text-4xl font-bold text-white">{stats.avgScore}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-lg p-6 border border-purple-500/20">
                      <div className="text-white/60 text-sm mb-2">
                        {language === "az" ? "Keyfiyyət" : language === "ru" ? "Качество" : "Quality Rate"}
                      </div>
                      <div className="text-4xl font-bold text-white">{stats.conversionRate}%</div>
                    </div>
                  </div>

                  {stats.packageDistribution.length > 0 && (
                    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                      <h3 className="text-xl font-bold text-white mb-4">
                        {language === "az" ? "Paket Seçimi" : language === "ru" ? "Выбор пакетов" : "Package Distribution"}
                      </h3>
                      <div className="space-y-3">
                        {stats.packageDistribution.map((pkg: { selected_package: string; count: number }) => (
                          <div key={pkg.selected_package} className="flex items-center justify-between">
                            <span className="text-white capitalize">{pkg.selected_package}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-[#FF4D00] h-2 rounded-full"
                                  style={{ width: `${(pkg.count / stats.totalLeads) * 100}%` }}
                                />
                              </div>
                              <span className="text-white/60 text-sm w-12 text-right">{pkg.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {language === "az" ? "Tez İşlər" : language === "ru" ? "Быстрые действия" : "Quick Actions"}
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setActiveTab("leads")}
                        className="px-6 py-3 bg-[#FF4D00] text-white rounded-lg hover:bg-[#FF6B00] transition-colors"
                      >
                        {language === "az" ? "Müraciətlərə bax" : language === "ru" ? "Смотреть лиды" : "View Leads"}
                      </button>
                      <button
                        onClick={() => setActiveTab("blog")}
                        className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {language === "az" ? "Blog yazısı əlavə et" : language === "ru" ? "Добавить пост" : "Add Blog Post"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" &&
                services.map((service) => (
                  <div key={service.id} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Icon</label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id ? { ...s, icon: e.target.value } : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Name (AZ)</label>
                        <input
                          type="text"
                          value={service.name_az}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id ? { ...s, name_az: e.target.value } : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Name (RU)</label>
                        <input
                          type="text"
                          value={service.name_ru}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id ? { ...s, name_ru: e.target.value } : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Name (EN)</label>
                        <input
                          type="text"
                          value={service.name_en}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id ? { ...s, name_en: e.target.value } : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Monthly Price (AZN)</label>
                        <input
                          type="number"
                          value={service.monthly_price}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id
                                  ? { ...s, monthly_price: parseInt(e.target.value) }
                                  : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          First Month Price (AZN)
                        </label>
                        <input
                          type="number"
                          value={service.first_month_price}
                          onChange={(e) =>
                            setServices(
                              services.map((s) =>
                                s.id === service.id
                                  ? { ...s, first_month_price: parseInt(e.target.value) }
                                  : s
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updateService(service)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                  </div>
                ))}

              {/* Packages Tab */}
              {activeTab === "packages" &&
                packages.map((pkg) => (
                  <div key={pkg.id} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Monthly Price (AZN)</label>
                        <input
                          type="number"
                          value={pkg.monthly_price}
                          onChange={(e) =>
                            setPackages(
                              packages.map((p) =>
                                p.id === pkg.id ? { ...p, monthly_price: parseInt(e.target.value) } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          First Month Price (AZN)
                        </label>
                        <input
                          type="number"
                          value={pkg.first_month_price}
                          onChange={(e) =>
                            setPackages(
                              packages.map((p) =>
                                p.id === pkg.id
                                  ? { ...p, first_month_price: parseInt(e.target.value) }
                                  : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={pkg.is_popular === 1}
                            onChange={(e) =>
                              setPackages(
                                packages.map((p) =>
                                  p.id === pkg.id ? { ...p, is_popular: e.target.checked ? 1 : 0 } : p
                                )
                              )
                            }
                            className="w-4 h-4"
                          />
                          {language === "az"
                            ? "Populyar kimi işarələ"
                            : language === "ru"
                            ? "Отметить как популярный"
                            : "Mark as popular"}
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePackage(pkg)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                  </div>
                ))}

              {/* Testimonials Tab */}
              {activeTab === "testimonials" &&
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Name (AZ)</label>
                        <input
                          type="text"
                          value={testimonial.name_az}
                          onChange={(e) =>
                            setTestimonials(
                              testimonials.map((t) =>
                                t.id === testimonial.id ? { ...t, name_az: e.target.value } : t
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Company (AZ)</label>
                        <input
                          type="text"
                          value={testimonial.company_az}
                          onChange={(e) =>
                            setTestimonials(
                              testimonials.map((t) =>
                                t.id === testimonial.id ? { ...t, company_az: e.target.value } : t
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Text (AZ)</label>
                        <textarea
                          value={testimonial.text_az}
                          onChange={(e) =>
                            setTestimonials(
                              testimonials.map((t) =>
                                t.id === testimonial.id ? { ...t, text_az: e.target.value } : t
                              )
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updateTestimonial(testimonial)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                  </div>
                ))}

              {/* Portfolio Tab */}
              {activeTab === "portfolio" &&
                portfolio.map((item) => (
                  <div key={item.id} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Title (AZ)</label>
                        <input
                          type="text"
                          value={item.title_az}
                          onChange={(e) =>
                            setPortfolio(
                              portfolio.map((p) =>
                                p.id === item.id ? { ...p, title_az: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Category (AZ)</label>
                        <input
                          type="text"
                          value={item.category_az}
                          onChange={(e) =>
                            setPortfolio(
                              portfolio.map((p) =>
                                p.id === item.id ? { ...p, category_az: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Image URL</label>
                        <input
                          type="text"
                          value={item.image_url}
                          onChange={(e) =>
                            setPortfolio(
                              portfolio.map((p) =>
                                p.id === item.id ? { ...p, image_url: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updatePortfolioItem(item)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                  </div>
                ))}

              {/* Cases Tab */}
              {activeTab === "cases" &&
                cases.map((caseStudy) => (
                  <div key={caseStudy.id} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4">{caseStudy.slug}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Title (AZ)</label>
                        <input
                          type="text"
                          value={caseStudy.title_az}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, title_az: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Client Name</label>
                        <input
                          type="text"
                          value={caseStudy.client_name}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, client_name: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Industry (AZ)</label>
                        <input
                          type="text"
                          value={caseStudy.industry_az}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, industry_az: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Year</label>
                        <input
                          type="number"
                          value={caseStudy.project_year}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, project_year: parseInt(e.target.value) } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Hero Image URL</label>
                        <input
                          type="text"
                          value={caseStudy.hero_image_url}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, hero_image_url: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Challenge (AZ)</label>
                        <textarea
                          value={caseStudy.challenge_az}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, challenge_az: e.target.value } : c
                              )
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Solution (AZ)</label>
                        <textarea
                          value={caseStudy.solution_az}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, solution_az: e.target.value } : c
                              )
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Metric 1 Value</label>
                        <input
                          type="text"
                          value={caseStudy.metric1_value}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, metric1_value: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Metric 1 Label (AZ)</label>
                        <input
                          type="text"
                          value={caseStudy.metric1_label_az}
                          onChange={(e) =>
                            setCases(
                              cases.map((c) =>
                                c.id === caseStudy.id ? { ...c, metric1_label_az: e.target.value } : c
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updateCase(caseStudy)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                  </div>
                ))}
              
              {/* Leads Tab */}
              {activeTab === "leads" &&
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {language === "az" ? "Müraciətlər" : language === "ru" ? "Лиды" : "Leads"}
                    </h2>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-400">
                        {leadsPagination?.total || leads.length} {language === "az" ? "müraciət" : language === "ru" ? "лидов" : "leads"}
                      </p>
                      <button
                        onClick={exportLeads}
                        className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#FF6B00] transition-colors text-sm"
                      >
                        {language === "az" ? "CSV Export" : language === "ru" ? "Экспорт CSV" : "Export CSV"}
                      </button>
                    </div>
                  </div>

                  {/* Filters and Search */}
                  <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={language === "az" ? "Axtar..." : language === "ru" ? "Поиск..." : "Search..."}
                          value={leadsFilter.search}
                          onChange={(e) => setLeadsFilter({ ...leadsFilter, search: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FF4D00] focus:outline-none"
                        />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={leadsFilter.status}
                        onChange={(e) => setLeadsFilter({ ...leadsFilter, status: e.target.value })}
                        className="px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                      >
                        <option value="all">{language === "az" ? "Bütün statuslar" : language === "ru" ? "Все статусы" : "All statuses"}</option>
                        <option value="new">{language === "az" ? "Yeni" : language === "ru" ? "Новый" : "New"}</option>
                        <option value="contacted">{language === "az" ? "Əlaqə saxlanıb" : language === "ru" ? "Связались" : "Contacted"}</option>
                        <option value="qualified">{language === "az" ? "Keyfiyyətli" : language === "ru" ? "Квалифицирован" : "Qualified"}</option>
                        <option value="converted">{language === "az" ? "Müştəri" : language === "ru" ? "Клиент" : "Converted"}</option>
                        <option value="lost">{language === "az" ? "İtirilmiş" : language === "ru" ? "Потерян" : "Lost"}</option>
                      </select>

                      {/* Min Score Filter */}
                      <input
                        type="number"
                        placeholder={language === "az" ? "Min bal" : language === "ru" ? "Мин. балл" : "Min score"}
                        value={leadsFilter.minScore}
                        onChange={(e) => setLeadsFilter({ ...leadsFilter, minScore: e.target.value })}
                        className="px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FF4D00] focus:outline-none"
                      />
                    </div>

                    {/* Bulk Actions */}
                    {selectedLeads.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                        <span className="text-white text-sm">
                          {selectedLeads.length} {language === "az" ? "seçilmiş" : language === "ru" ? "выбрано" : "selected"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => bulkUpdateStatus("contacted")}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                          >
                            {language === "az" ? "Əlaqə saxlanıb" : language === "ru" ? "Связались" : "Mark Contacted"}
                          </button>
                          <button
                            onClick={() => bulkUpdateStatus("qualified")}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                          >
                            {language === "az" ? "Keyfiyyətli" : language === "ru" ? "Квалифицирован" : "Mark Qualified"}
                          </button>
                          <button
                            onClick={() => setSelectedLeads([])}
                            className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-sm hover:bg-gray-500/30"
                          >
                            {language === "az" ? "Ləğv et" : language === "ru" ? "Отменить" : "Clear"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left text-white font-semibold p-3 w-12">
                            <button
                              onClick={() => {
                                if (selectedLeads.length === leads.length) {
                                  setSelectedLeads([]);
                                } else {
                                  setSelectedLeads(leads.map(l => l.id));
                                }
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              {selectedLeads.length === leads.length && leads.length > 0 ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Bal" : language === "ru" ? "Балл" : "Score"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Status" : language === "ru" ? "Статус" : "Status"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Ad" : language === "ru" ? "Имя" : "Name"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Şirkət" : language === "ru" ? "Компания" : "Company"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">Email</th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Telefon" : language === "ru" ? "Телефон" : "Phone"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Paket" : language === "ru" ? "Пакет" : "Package"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Mənbə" : language === "ru" ? "Источник" : "Source"}
                          </th>
                          <th className="text-left text-white font-semibold p-3">
                            {language === "az" ? "Tarix" : language === "ru" ? "Дата" : "Date"}
                          </th>
                          <th className="text-left text-white font-semibold p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-b border-gray-800 hover:bg-white/5">
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  if (selectedLeads.includes(lead.id)) {
                                    setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                  } else {
                                    setSelectedLeads([...selectedLeads, lead.id]);
                                  }
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                {selectedLeads.includes(lead.id) ? (
                                  <CheckSquare className="w-5 h-5" />
                                ) : (
                                  <Square className="w-5 h-5" />
                                )}
                              </button>
                            </td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                lead.score >= 70 ? 'bg-green-500/20 text-green-500' :
                                lead.score >= 50 ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-red-500/20 text-red-500'
                              }`}>
                                {lead.score}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={lead.status || 'new'}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                  lead.status === 'converted' ? 'bg-green-500/20 text-green-400' :
                                  lead.status === 'qualified' ? 'bg-blue-500/20 text-blue-400' :
                                  lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                  lead.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                                  'bg-gray-500/20 text-gray-400'
                                } border-0 focus:outline-none cursor-pointer`}
                              >
                                <option value="new">{language === "az" ? "Yeni" : language === "ru" ? "Новый" : "New"}</option>
                                <option value="contacted">{language === "az" ? "Əlaqə saxlanıb" : language === "ru" ? "Связались" : "Contacted"}</option>
                                <option value="qualified">{language === "az" ? "Keyfiyyətli" : language === "ru" ? "Квалифицирован" : "Qualified"}</option>
                                <option value="converted">{language === "az" ? "Müştəri" : language === "ru" ? "Клиент" : "Converted"}</option>
                                <option value="lost">{language === "az" ? "İtirilmiş" : language === "ru" ? "Потерян" : "Lost"}</option>
                              </select>
                            </td>
                            <td className="text-white p-3">{lead.name}</td>
                            <td className="text-gray-400 p-3">{lead.company || '—'}</td>
                            <td className="text-gray-400 p-3">{lead.email}</td>
                            <td className="text-gray-400 p-3">{lead.phone || '—'}</td>
                            <td className="text-gray-400 p-3">{lead.selected_package || '—'}</td>
                            <td className="text-gray-400 p-3 text-sm">
                              {lead.utm_source ? (
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs">{lead.utm_source}</span>
                                  {lead.utm_medium && <span className="text-xs text-gray-500">{lead.utm_medium}</span>}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-600">—</span>
                              )}
                            </td>
                            <td className="text-gray-400 p-3 text-sm">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="text-red-500 hover:text-red-400 text-sm"
                                >
                                  {language === "az" ? "Sil" : language === "ru" ? "Удалить" : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {leadsPagination && leadsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-gray-400 text-sm">
                        {language === "az" 
                          ? `Səhifə ${leadsPagination.page} / ${leadsPagination.totalPages}`
                          : language === "ru"
                          ? `Страница ${leadsPagination.page} / ${leadsPagination.totalPages}`
                          : `Page ${leadsPagination.page} / ${leadsPagination.totalPages}`}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLeadsPage(p => Math.max(1, p - 1))}
                          disabled={leadsPage === 1}
                          className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          {language === "az" ? "Əvvəlki" : language === "ru" ? "Назад" : "Previous"}
                        </button>
                        <button
                          onClick={() => setLeadsPage(p => Math.min(leadsPagination.totalPages, p + 1))}
                          disabled={leadsPage >= leadsPagination.totalPages}
                          className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#FF6B00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {language === "az" ? "Növbəti" : language === "ru" ? "Далее" : "Next"}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              }
              
              {/* Blog Tab */}
              {activeTab === "blog" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {language === "az" ? "Blog Yazıları" : language === "ru" ? "Посты блога" : "Blog Posts"}
                    </h2>
                    <button
                      onClick={() => setCreatingBlog(true)}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#FF6B00] transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {language === "az" ? "Yeni yazı" : language === "ru" ? "Новый пост" : "New Post"}
                    </button>
                  </div>

                  {/* Create Blog Post Form */}
                  {creatingBlog && (
                    <BlogPostForm
                      language={language}
                      onSave={(post) => {
                        createBlogPost(post);
                      }}
                      onCancel={() => setCreatingBlog(false)}
                      saving={saving}
                    />
                  )}

                  {/* Blog Posts List */}
                  {blogPosts.map((post) => (
                  <div key={post.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Title (AZ)</label>
                        <input
                          type="text"
                          value={post.title_az}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, title_az: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Slug</label>
                        <input
                          type="text"
                          value={post.slug}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, slug: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Category (AZ)</label>
                        <input
                          type="text"
                          value={post.category_az}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, category_az: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Excerpt (AZ)</label>
                        <textarea
                          value={post.excerpt_az}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, excerpt_az: e.target.value } : p
                              )
                            )
                          }
                          rows={2}
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Cover Image URL</label>
                        <input
                          type="text"
                          value={post.cover_image}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, cover_image: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Author</label>
                        <input
                          type="text"
                          value={post.author_name}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, author_name: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Published Date</label>
                        <input
                          type="date"
                          value={post.published_date}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, published_date: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Published</label>
                        <select
                          value={post.is_published}
                          onChange={(e) =>
                            setBlogPosts(
                              blogPosts.map((p) =>
                                p.id === post.id ? { ...p, is_published: Number(e.target.value) } : p
                              )
                            )
                          }
                          className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => updateBlogPost(post)}
                      disabled={saving}
                      className="px-4 py-2 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
                    </button>
                    <button
                      onClick={() => deleteBlogPost(post.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {language === "az" ? "Sil" : language === "ru" ? "Удалить" : "Delete"}
                    </button>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Blog Post Form Component
function BlogPostForm({
  language,
  onSave,
  onCancel,
  saving
}: {
  language: string;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: '',
    title_az: '',
    title_ru: '',
    title_en: '',
    excerpt_az: '',
    excerpt_ru: '',
    excerpt_en: '',
    content_az: '',
    content_ru: '',
    content_en: '',
    category_az: '',
    category_ru: '',
    category_en: '',
    cover_image: '',
    author_name: 'B2Brand',
    published_date: new Date().toISOString().split('T')[0],
    is_published: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.title_az) {
      toast.error(language === "az" ? "Slug və başlıq tələb olunur" : language === "ru" ? "Slug и заголовок обязательны" : "Slug and title are required");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">
        {language === "az" ? "Yeni Blog Yazısı" : language === "ru" ? "Новый пост" : "New Blog Post"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
            placeholder="blog-post-slug"
            required
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Author</label>
          <input
            type="text"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Title (AZ) *</label>
          <input
            type="text"
            value={formData.title_az}
            onChange={(e) => setFormData({ ...formData, title_az: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Title (RU)</label>
          <input
            type="text"
            value={formData.title_ru}
            onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Title (EN)</label>
          <input
            type="text"
            value={formData.title_en}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Category (AZ)</label>
          <input
            type="text"
            value={formData.category_az}
            onChange={(e) => setFormData({ ...formData, category_az: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Cover Image URL</label>
          <input
            type="text"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Published Date</label>
          <input
            type="date"
            value={formData.published_date}
            onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white font-medium mb-2">Excerpt (AZ)</label>
          <textarea
            value={formData.excerpt_az}
            onChange={(e) => setFormData({ ...formData, excerpt_az: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white font-medium mb-2">Content (AZ) *</label>
          <textarea
            value={formData.content_az}
            onChange={(e) => setFormData({ ...formData, content_az: e.target.value })}
            rows={10}
            className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white font-mono text-sm"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={formData.is_published === 1}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
              className="w-4 h-4"
            />
            {language === "az" ? "Dərhal yayımla" : language === "ru" ? "Опубликовать сразу" : "Publish immediately"}
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#FF6B00] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {language === "az" ? "Yadda saxla" : language === "ru" ? "Сохранить" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          {language === "az" ? "Ləğv et" : language === "ru" ? "Отменить" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
