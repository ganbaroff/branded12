import { useState, useEffect } from "react";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { translations } from "@/react-app/data/content";
import ServiceCard from "@/react-app/components/ServiceCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useScrollReveal } from "@/react-app/hooks/useScrollReveal";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import Breadcrumbs from "@/react-app/components/Breadcrumbs";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import { apiGet } from "@/react-app/lib/api";
import { toast } from "@/react-app/lib/toast";
import type { Service } from "@/react-app/types";

export default function ServicesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const headerReveal = useScrollReveal({ initialVisible: true });
  const ctaReveal = useScrollReveal();

  useMetaTags({
    title: language === 'az' 
      ? 'Xidmətlər - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Услуги - B2Brand Creative Agency'
      : 'Services - B2Brand Creative Agency',
    description: language === 'az'
      ? 'SMM, video çəkiliş, AI kontent yaradılması, target reklam, brendinq və daha çox. Professional marketinq xidmətləri.'
      : language === 'ru'
      ? 'SMM, видеосъемка, создание AI контента, таргетированная реклама, брендинг и многое другое.'
      : 'SMM, video production, AI content creation, targeted advertising, branding and more.'
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await apiGet<Service[]>("/api/services");
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const breadcrumbLabel = {
    az: 'Xidmətlər',
    ru: 'Услуги',
    en: 'Services'
  }[language];

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
          <div className="text-center">
          <div className="inline-block px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-full mb-6 animate-fade-in">
            <span className="text-[#FF4D00] text-sm font-medium">
              {t.services.badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.services.heading}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.services.subheading}
          </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                name={{
                  az: service.name_az,
                  ru: service.name_ru,
                  en: service.name_en,
                }}
                description={{
                  az: service.description_az,
                  ru: service.description_ru,
                  en: service.description_en,
                }}
                monthlyPrice={service.monthly_price}
                firstMonthPrice={service.first_month_price}
                to={`/pricing#service-${service.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#FF4D00] to-[#ff6b2c]" ref={ctaReveal.ref}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t.finalCta.heading}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t.finalCta.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white text-[#FF4D00] rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t.finalCta.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/brief"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              {t.nav.brief}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
