import { useLanguage } from "@/react-app/hooks/useLanguage";
import { translations, WHATSAPP_NUMBER } from "@/react-app/data/content";
import { Mail, Phone, MapPin, MessageCircle, Clock, Zap } from "lucide-react";
import { Link } from "react-router";
import { useScrollReveal } from "@/react-app/hooks/useScrollReveal";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import Breadcrumbs from "@/react-app/components/Breadcrumbs";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const headerReveal = useScrollReveal({ initialVisible: true });

  useMetaTags({
    title: language === 'az' 
      ? 'Əlaqə - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Контакты - B2Brand Creative Agency'
      : 'Contact - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Bizimlə əlaqə saxlayın. Bakı, Azərbaycan. Tel: +994 50 123 45 67'
      : language === 'ru'
      ? 'Свяжитесь с нами. Баку, Азербайджан. Тел: +994 50 123 45 67'
      : 'Contact us. Baku, Azerbaijan. Tel: +994 50 123 45 67'
  });

  const contactInfo = [
    {
      icon: Phone,
      title: language === "az" ? "Telefon" : language === "ru" ? "Телефон" : "Phone",
      value: WHATSAPP_NUMBER,
      href: `tel:${WHATSAPP_NUMBER}`
    },
    {
      icon: Mail,
      title: "Email",
      value: "hello@b2brand.az",
      href: "mailto:hello@b2brand.az"
    },
    {
      icon: MapPin,
      title: language === "az" ? "Ünvan" : language === "ru" ? "Адрес" : "Address",
      value: language === "az" 
        ? "Bakı, Azərbaycan" 
        : language === "ru" 
        ? "Баку, Азербайджан" 
        : "Baku, Azerbaijan",
      href: null
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: WHATSAPP_NUMBER,
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`
    }
  ];

  const breadcrumbLabel = {
    az: 'Əlaqə',
    ru: 'Контакты',
    en: 'Contact'
  }[language];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
          <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t.nav.contact}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {language === "az"
              ? "Bizimlə əlaqə saxlayın və layihənizi müzakirə edək"
              : language === "ru"
              ? "Свяжитесь с нами и обсудите ваш проект"
              : "Get in touch and let's discuss your project"}
          </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                {language === "az"
                  ? "Əlaqə məlumatları"
                  : language === "ru"
                  ? "Контактная информация"
                  : "Contact Information"}
              </h2>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-[#FF4D00]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF4D00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#FF4D00]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-gray-400 hover:text-[#FF4D00] transition-colors"
                          target={info.href.startsWith("http") ? "_blank" : undefined}
                          rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Working hours & Response time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FF4D00]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#FF4D00]" />
                    </div>
                    <h3 className="text-white font-semibold">{t.contactPage.workingHoursTitle}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{t.contactPage.workingHoursText}</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FF4D00]/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#FF4D00]" />
                    </div>
                    <h3 className="text-white font-semibold">{t.contactPage.responseTimeTitle}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{t.contactPage.responseTimeText}</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-[#FF4D00] to-[#ff6b2c] rounded-xl p-8 mt-8">
                <h3 className="text-white font-bold text-xl mb-4">
                  {language === "az"
                    ? "Layihə haqqında danışaq?"
                    : language === "ru"
                    ? "Обсудим ваш проект?"
                    : "Let's discuss your project?"}
                </h3>
                <p className="text-white/90 mb-6">
                  {language === "az"
                    ? "Brifinizi doldurun və ödənişsiz məsləhət alın"
                    : language === "ru"
                    ? "Заполните бриф и получите бесплатную консультацию"
                    : "Fill out the brief and get a free consultation"}
                </p>
                <Link
                  to="/brief"
                  className="inline-block px-6 py-3 bg-white text-[#FF4D00] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {language === "az"
                    ? "Brifinizi doldurun"
                    : language === "ru"
                    ? "Заполнить бриф"
                    : "Fill the brief"}
                </Link>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-[#FF4D00] mx-auto mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">
                    {language === "az"
                      ? "Bakı, Azərbaycan"
                      : language === "ru"
                      ? "Баку, Азербайджан"
                      : "Baku, Azerbaijan"}
                  </h3>
                  <p className="text-gray-400">
                    {language === "az"
                      ? "Ofis görüşü üçün əvvəlcədən razılaşdırın"
                      : language === "ru"
                      ? "Договоритесь о встрече в офисе заранее"
                      : "Schedule an office meeting in advance"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {language === "az"
              ? "Hələ də sualınız var?"
              : language === "ru"
              ? "Всё ещё есть вопросы?"
              : "Still have questions?"}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {language === "az"
              ? "WhatsApp-da bizə yazın və dərhal cavab alın"
              : language === "ru"
              ? "Напишите нам в WhatsApp и получите быстрый ответ"
              : "Message us on WhatsApp and get a quick response"}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            {language === "az"
              ? "WhatsApp-da yaz"
              : language === "ru"
              ? "Написать в WhatsApp"
              : "Message on WhatsApp"}
          </a>
        </div>
      </section>
    </div>
  );
}
