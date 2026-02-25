import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import { Card } from '@/react-app/components/ui/card';
import { ArrowRight, Filter, FolderOpen } from 'lucide-react';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import { useMetaTags } from '@/react-app/hooks/useMetaTags';
import Breadcrumbs from '@/react-app/components/Breadcrumbs';
import { apiGet } from '@/react-app/lib/api';
import { toast } from '@/react-app/lib/toast';
import { portfolioItems as staticPortfolioItems } from '@/react-app/data/content';
import type { PortfolioItem } from '@/react-app/types';

function mapStaticToPortfolioItem(
  item: (typeof staticPortfolioItems)[number]
): PortfolioItem {
  const title = item.title;
  const category = item.category;
  return {
    id: item.id,
    title_az: title.az,
    title_ru: title.ru,
    title_en: title.en,
    category_az: category.az,
    category_ru: category.ru,
    category_en: category.en,
    industry_az: category.az,
    industry_ru: category.ru,
    industry_en: category.en,
    service_type_az: category.az,
    service_type_ru: category.ru,
    service_type_en: category.en,
    image_url: item.image,
    project_year: new Date().getFullYear(),
    metric_value: '—',
    metric_label_az: 'Layihə',
    metric_label_ru: 'Проект',
    metric_label_en: 'Project',
    description_az: `${category.az} layihəsi.`,
    description_ru: `Проект: ${category.ru}.`,
    description_en: `Project: ${category.en}.`,
    is_featured: 0,
  };
}

export default function PortfolioPage() {
  const { language } = useLanguage();
  const headerReveal = useScrollReveal({ initialVisible: true });
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useMetaTags({
    title: language === 'az' 
      ? 'Portfolio - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Портфолио - B2Brand Creative Agency'
      : 'Portfolio - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Bizim uğurlu layihələrimiz və müştərilərimizin nəticələri. 120+ tamamlanmış layihə.'
      : language === 'ru'
      ? 'Наши успешные проекты и результаты клиентов. 120+ завершенных проектов.'
      : 'Our successful projects and client results. 120+ completed projects.'
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [portfolioItems, selectedIndustry, selectedService, selectedYear, language]);

  const fetchPortfolio = async () => {
    try {
      const data = await apiGet<PortfolioItem[]>('/api/portfolio');
      setPortfolioItems(data.length > 0 ? data : staticPortfolioItems.map(mapStaticToPortfolioItem));
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
      setPortfolioItems(staticPortfolioItems.map(mapStaticToPortfolioItem));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...portfolioItems];

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(item => item[`industry_${language}` as keyof PortfolioItem] === selectedIndustry);
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(item => item[`service_type_${language}` as keyof PortfolioItem] === selectedService);
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.project_year.toString() === selectedYear);
    }

    setFilteredItems(filtered);
  };

  const industries = Array.from(new Set(portfolioItems.map(item => item[`industry_${language}` as keyof PortfolioItem] as string)));
  const services = Array.from(new Set(portfolioItems.map(item => item[`service_type_${language}` as keyof PortfolioItem] as string)));
  const years = Array.from(new Set(portfolioItems.map(item => item.project_year))).sort((a, b) => b - a);

  const breadcrumbLabel = {
    az: 'Portfolio',
    ru: 'Портфолио',
    en: 'Portfolio'
  }[language];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
          <div className="text-center">
          <div className="inline-block px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-full mb-6 animate-fade-in">
            <span className="text-[#FF4D00] text-sm font-medium">
              {language === 'az' && 'Portfolio'}
              {language === 'ru' && 'Портфолио'}
              {language === 'en' && 'Portfolio'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {language === 'az' && 'Uğur Hekayələrimiz'}
            {language === 'ru' && 'Наши истории успеха'}
            {language === 'en' && 'Our Success Stories'}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {language === 'az' && 'Azərbaycan biznesləri üçün real nəticələr yaratdıq'}
            {language === 'ru' && 'Мы создали реальные результаты для азербайджанских бизнесов'}
            {language === 'en' && 'We created real results for Azerbaijani businesses'}
          </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-white/[0.02] sticky top-20 z-30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#FF4D00]" />
            <h3 className="text-white font-semibold">
              {language === 'az' && 'Filtr'}
              {language === 'ru' && 'Фильтр'}
              {language === 'en' && 'Filter'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                {language === 'az' && 'Sənayelər'}
                {language === 'ru' && 'Отрасли'}
                {language === 'en' && 'Industries'}
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              >
                <option value="all">
                  {language === 'az' && 'Hamısı'}
                  {language === 'ru' && 'Все'}
                  {language === 'en' && 'All'}
                </option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                {language === 'az' && 'Xidmətlər'}
                {language === 'ru' && 'Услуги'}
                {language === 'en' && 'Services'}
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              >
                <option value="all">
                  {language === 'az' && 'Hamısı'}
                  {language === 'ru' && 'Все'}
                  {language === 'en' && 'All'}
                </option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                {language === 'az' && 'İl'}
                {language === 'ru' && 'Год'}
                {language === 'en' && 'Year'}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              >
                <option value="all">
                  {language === 'az' && 'Hamısı'}
                  {language === 'ru' && 'Все'}
                  {language === 'en' && 'All'}
                </option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white/60 mt-4">
                {language === 'az' && 'Yüklənir...'}
                {language === 'ru' && 'Загрузка...'}
                {language === 'en' && 'Loading...'}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-10 h-10 text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'az' && 'Heç bir nəticə tapılmadı'}
                  {language === 'ru' && 'Результатов не найдено'}
                  {language === 'en' && 'No results found'}
                </h3>
                <p className="text-white/60 mb-8">
                  {language === 'az' && 'Seçilmiş filtrlərə uyğun layihə yoxdur. Filtrləri təmizləyin və ya bizimlə əlaqə saxlayın.'}
                  {language === 'ru' && 'Нет проектов по выбранным фильтрам. Сбросьте фильтры или свяжитесь с нами.'}
                  {language === 'en' && 'No projects match your filters. Clear filters or get in touch.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 gap-2"
                    onClick={() => {
                      setSelectedIndustry('all');
                      setSelectedService('all');
                      setSelectedYear('all');
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    {language === 'az' && 'Filtrləri təmizlə'}
                    {language === 'ru' && 'Сбросить фильтры'}
                    {language === 'en' && 'Clear filters'}
                  </Button>
                  <Link to="/contact">
                    <Button className="bg-[#FF4D00] hover:bg-[#FF6B00] text-white gap-2">
                      {language === 'az' && 'Əlaqə'}
                      {language === 'ru' && 'Контакты'}
                      {language === 'en' && 'Contact us'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#FF4D00]/50 transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item[`title_${language}` as keyof PortfolioItem] as string}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#FF4D00] text-white">
                        {item.metric_value}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                        {item[`industry_${language}` as keyof PortfolioItem] as string}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                        {item.project_year}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item[`title_${language}` as keyof PortfolioItem] as string}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      {item[`metric_label_${language}` as keyof PortfolioItem] as string}
                    </p>
                    <p className="text-white/70 text-sm mb-6 line-clamp-2">
                      {item[`description_${language}` as keyof PortfolioItem] as string}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-[#FF4D00] hover:border-[#FF4D00]"
                      asChild
                    >
                      <Link to={`/portfolio/${item.id}`}>
                        {language === 'az' && 'Ətraflı'}
                        {language === 'ru' && 'Подробнее'}
                        {language === 'en' && 'Learn more'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
