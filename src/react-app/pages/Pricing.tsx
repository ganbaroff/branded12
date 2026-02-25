import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { translations } from "@/react-app/data/content";
import { Check, ArrowRight, Calculator, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router";
import CountdownBanner from "@/react-app/components/CountdownBanner";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import { apiGet } from "@/react-app/lib/api";
import { toast } from "@/react-app/lib/toast";

type Service = {
  id: number;
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

type PricingPackage = {
  id: number;
  name_az: string;
  name_ru: string;
  name_en: string;
  monthly_price: number;
  first_month_price: number;
  is_popular: number;
  features_az: string;
  features_ru: string;
  features_en: string;
  stripe_payment_link?: string;
};

export default function PricingPage() {
  const { language } = useLanguage();
  const location = useLocation();
  const t = translations[language];
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const scrolledHashRef = useRef<string | null>(null);

  // Scroll to hash after content is ready (from Services e.g. /pricing#service-smm).
  // For #service-* we scroll to #calculator so the section is in view, not the bottom of the page.
  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (!hash || loading) return;
    if (scrolledHashRef.current === hash) return;
    scrolledHashRef.current = hash;

    const run = () => {
      const targetId = hash.startsWith("service-") ? "calculator" : hash;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timer = setTimeout(run, 150);
    return () => clearTimeout(timer);
  }, [location.hash, loading]);

  useMetaTags({
    title: language === 'az' 
      ? 'Qiymətlər - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Цены - B2Brand Creative Agency'
      : 'Pricing - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Şəffaf qiymətləndirmə, ilk aya 50% endirim. Starter, Growth və Enterprise paketlərimizlə tanış olun.'
      : language === 'ru'
      ? 'Прозрачные цены, скидка 50% на первый месяц. Пакеты Starter, Growth и Enterprise.'
      : 'Transparent pricing, 50% off first month. Starter, Growth and Enterprise packages.'
  });


  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, packagesData] = await Promise.all([
          apiGet<Service[]>("/api/services"),
          apiGet<PricingPackage[]>("/api/packages"),
        ]);
        setServices(servicesData);
        setPackages(packagesData);
      } catch (error) {
        console.error("Failed to load pricing data:", error);
        toast.error(language === "az" ? "Məlumat yüklənə bilmədi" : language === "ru" ? "Не удалось загрузить данные" : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculatedTotal = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return sum + (service?.monthly_price || 0);
  }, 0);

  const calculatedFirstMonth = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return sum + (service?.first_month_price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#FF4D00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <CountdownBanner />
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.nav.pricing}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {language === "az"
              ? "Biznesiniz üçün ən uyğun paketi seçin"
              : language === "ru"
              ? "Выберите подходящий пакет для вашего бизнеса"
              : "Choose the right package for your business"}
          </p>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="packages" className="py-20 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const featuresText = language === "az"
                ? pkg.features_az
                : language === "ru"
                ? pkg.features_ru
                : pkg.features_en;
              
              const featuresArray = featuresText ? featuresText.split("\n") : [];
              
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-[#1a1a1a] rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                    pkg.is_popular
                      ? "border-[#FF4D00] shadow-lg shadow-[#FF4D00]/20 hover:shadow-2xl hover:shadow-[#FF4D00]/30"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'slideUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {pkg.is_popular === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {language === "az"
                        ? "Ən Populyar"
                        : language === "ru"
                        ? "Популярный"
                        : "Most Popular"}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {language === "az"
                      ? pkg.name_az
                      : language === "ru"
                      ? pkg.name_ru
                      : pkg.name_en}
                  </h3>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-white">
                        {pkg.first_month_price}
                      </span>
                      <span className="text-gray-400">AZN</span>
                      <span className="text-sm text-gray-500">
                        {language === "az"
                          ? "ilk ay"
                          : language === "ru"
                          ? "первый месяц"
                          : "first month"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="line-through">{pkg.monthly_price} AZN</span>
                      <span className="text-[#FF4D00] font-semibold">-50%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === "az"
                        ? `Sonrakı aylar: ${pkg.monthly_price} AZN/ay`
                        : language === "ru"
                        ? `Следующие месяцы: ${pkg.monthly_price} AZN/мес`
                        : `Next months: ${pkg.monthly_price} AZN/mo`}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {featuresArray.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#FF4D00] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    {pkg.stripe_payment_link ? (
                      <a
                        href={pkg.stripe_payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                          pkg.is_popular
                            ? "bg-[#FF4D00] text-white hover:bg-[#ff6b2c]"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {language === "az"
                          ? "İndi ödə"
                          : language === "ru"
                          ? "Оплатить сейчас"
                          : "Pay now"}
                      </a>
                    ) : null}
                    <Link
                      to="/brief"
                      className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                        pkg.is_popular
                          ? "bg-[#FF4D00] text-white hover:bg-[#ff6b2c]"
                          : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {language === "az"
                        ? "Brif göndər"
                        : language === "ru"
                        ? "Отправить бриф"
                        : "Submit brief"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Price Calculator */}
      <section id="calculator" className="py-20 px-4 bg-[#1a1a1a] scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Calculator className="w-12 h-12 text-[#FF4D00] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === "az"
                ? "Qiymət Kalkulyatoru"
                : language === "ru"
                ? "Калькулятор цен"
                : "Price Calculator"}
            </h2>
            <p className="text-gray-400">
              {language === "az"
                ? "Xidmətləri seçin və qiyməti görün"
                : language === "ru"
                ? "Выберите услуги и посмотрите цену"
                : "Select services and see the price"}
            </p>
          </div>

          <div className="bg-[#0F0F0F] rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-800">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {services.map((service) => (
                <button
                  key={service.id}
                  id={`service-${String(service.id)}`}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedServices.includes(service.id)
                      ? "border-[#FF4D00] bg-[#FF4D00]/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedServices.includes(service.id)
                          ? "border-[#FF4D00] bg-[#FF4D00]"
                          : "border-gray-700"
                      }`}
                    >
                      {selectedServices.includes(service.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{service.icon}</span>
                        <h3 className="text-white font-semibold">
                          {language === "az"
                            ? service.name_az
                            : language === "ru"
                            ? service.name_ru
                            : service.name_en}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {language === "az"
                          ? service.description_az
                          : language === "ru"
                          ? service.description_ru
                          : service.description_en}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#FF4D00] font-bold">
                          {service.first_month_price} AZN
                        </span>
                        <span className="text-gray-500 text-sm line-through">
                          {service.monthly_price} AZN
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedServices.length > 0 && (
              <div className="border-t border-gray-800 pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 mb-2">
                      {language === "az"
                        ? "İlk ay ödəniş:"
                        : language === "ru"
                        ? "Оплата первого месяца:"
                        : "First month payment:"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-white">
                        {calculatedFirstMonth}
                      </span>
                      <span className="text-gray-400">AZN</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-500 line-through">
                        {calculatedTotal} AZN
                      </span>
                      <span className="px-2 py-1 bg-[#FF4D00]/20 text-[#FF4D00] text-sm font-semibold rounded">
                        -50%
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/brief"
                    className="px-6 py-3 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2"
                  >
                    {language === "az"
                      ? "Sifariş et"
                      : language === "ru"
                      ? "Заказать"
                      : "Order"}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  {language === "az"
                    ? `Növbəti aylar: ${calculatedTotal} AZN/ay`
                    : language === "ru"
                    ? `Следующие месяцы: ${calculatedTotal} AZN/мес`
                    : `Next months: ${calculatedTotal} AZN/mo`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {language === "az"
              ? "Paketləri müqayisə et"
              : language === "ru"
              ? "Сравнение пакетов"
              : "Compare packages"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-white font-semibold">
                    {language === "az"
                      ? "Xidmət"
                      : language === "ru"
                      ? "Услуга"
                      : "Service"}
                  </th>
                  {packages.map((pkg: PricingPackage) => (
                    <th key={pkg.id} className="p-4 text-white font-semibold">
                      {language === "az"
                        ? pkg.name_az
                        : language === "ru"
                        ? pkg.name_ru
                        : pkg.name_en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-800/50">
                    <td className="p-4 text-gray-300">
                      {language === "az"
                        ? service.name_az
                        : language === "ru"
                        ? service.name_ru
                        : service.name_en}
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-[#FF4D00] mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-[#FF4D00] mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-[#FF4D00] mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#FF4D00] to-[#ff6b2c]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {language === "az"
              ? "Fərdi təklif almağa hazırsınız?"
              : language === "ru"
              ? "Готовы получить индивидуальное предложение?"
              : "Ready to get a custom proposal?"}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === "az"
              ? "Brifinizi doldurun, sizinlə 24 saat ərzində əlaqə saxlayaq"
              : language === "ru"
              ? "Заполните бриф, свяжемся с вами в течение 24 часов"
              : "Fill out the brief, we'll contact you within 24 hours"}
          </p>
          <Link
            to="/brief"
            className="px-8 py-4 bg-white text-[#FF4D00] rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            {language === "az"
              ? "Fərdi təklif al"
              : language === "ru"
              ? "Получить предложение"
              : "Get a proposal"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
