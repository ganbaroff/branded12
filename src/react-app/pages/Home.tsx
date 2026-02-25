import { Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { translations, WHATSAPP_NUMBER, services, testimonials, portfolioItems } from '@/react-app/data/content';
import { Button } from '@/react-app/components/ui/button';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Award, Sparkles, MessageCircle, Package, Rocket, BarChart3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/react-app/components/ui/accordion';
import ServiceCard from '@/react-app/components/ServiceCard';
import TestimonialCard from '@/react-app/components/TestimonialCard';
import PortfolioCard from '@/react-app/components/PortfolioCard';
import CountdownBanner from '@/react-app/components/CountdownBanner';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import { useMetaTags } from '@/react-app/hooks/useMetaTags';

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language];

  useMetaTags({
    title: language === 'az' 
      ? 'B2Brand - Bakıda Kreativ Marketinq Agentliyi'
      : language === 'ru'
      ? 'B2Brand - Креативное маркетинговое агентство в Баку'
      : 'B2Brand - Creative Marketing Agency in Baku',
    description: language === 'az'
      ? 'SMM, video çəkiliş, AI kontent, target reklam və brendinq. Bakıda ən sərfəli qiymətlə premium marketinq xidmətləri.'
      : language === 'ru'
      ? 'SMM, видеосъемка, AI контент, таргетированная реклама и брендинг. Премиум маркетинговые услуги в Баку по доступным ценам.'
      : 'SMM, video production, AI content, targeted advertising and branding. Premium marketing services in Baku at affordable prices.'
  });
  const whyUsReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const quizReveal = useScrollReveal();
  const portfolioReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const howWeWorkReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <CountdownBanner />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/80 via-[#0F0F0F]/60 to-[#0F0F0F] z-10" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="https://assets.mixkit.co/videos/1883/1883-720.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            {t.hero.headline}
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            {t.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/pricing">
              <Button
                size="lg"
                className="bg-[#FF4D00] hover:bg-[#FF6B00] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-[#FF4D00]/20 transition-all hover:scale-105"
              >
                {t.hero.cta1}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                {t.hero.cta2}
              </Button>
            </a>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF4D00]" />
              <span className="text-sm sm:text-base font-medium">{t.trustBar.projects}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF4D00]" />
              <span className="text-sm sm:text-base font-medium">{t.trustBar.retention}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF4D00]" />
              <span className="text-sm sm:text-base font-medium">{t.trustBar.location}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full mx-auto" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" ref={servicesReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.services.heading}
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t.services.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                icon={service.icon}
                name={service.name}
                description={service.description}
                monthlyPrice={service.monthlyPrice}
                firstMonthPrice={service.firstMonthPrice}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {t.services.viewAll}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/[0.02]" ref={quizReveal.ref}>
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${quizReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] rounded-3xl p-12 border-2 border-[#FF4D00]/30 shadow-2xl shadow-[#FF4D00]/10">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-[#FF4D00] mx-auto mb-6" />
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {language === 'az' && 'Sizə uyğun paketi tapın'}
                {language === 'ru' && 'Найдите подходящий пакет'}
                {language === 'en' && 'Find your perfect package'}
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                {language === 'az' && 'Sadəcə 5 sualı cavablandırın və biznesiniz üçün ideal xidmət paketini öyrənin'}
                {language === 'ru' && 'Ответьте на 5 вопросов и узнайте идеальный пакет услуг для вашего бизнеса'}
                {language === 'en' && 'Answer 5 questions and discover the ideal service package for your business'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-white/80 text-sm">
                  {language === 'az' && '2 dəqiqə'}
                  {language === 'ru' && '2 минуты'}
                  {language === 'en' && '2 minutes'}
                </p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-white/80 text-sm">
                  {language === 'az' && 'Fərdi tövsiyə'}
                  {language === 'ru' && 'Персональная рекомендация'}
                  {language === 'en' && 'Personalized recommendation'}
                </p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-white/80 text-sm">
                  {language === 'az' && 'Xüsusi qiymət'}
                  {language === 'ru' && 'Специальная цена'}
                  {language === 'en' && 'Special price'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/quiz">
                <Button
                  size="lg"
                  className="bg-[#FF4D00] hover:bg-[#ff6b2c] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-[#FF4D00]/30 hover:shadow-[#FF4D00]/50 transition-all hover:scale-105"
                >
                  {language === 'az' && 'Quiz başla'}
                  {language === 'ru' && 'Начать квиз'}
                  {language === 'en' && 'Start quiz'}
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]" ref={whyUsReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${whyUsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.whyUs.heading}
            </h2>
            <p className="text-xl text-white/60">
              {t.whyUs.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">+240%</h3>
              <p className="text-white/60">
                {language === 'az' && 'Ortalama böyümə'}
                {language === 'ru' && 'Средний рост'}
                {language === 'en' && 'Average growth'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">120+</h3>
              <p className="text-white/60">
                {language === 'az' && 'Uğurlu layihə'}
                {language === 'ru' && 'Успешных проектов'}
                {language === 'en' && 'Successful projects'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">94%</h3>
              <p className="text-white/60">
                {language === 'az' && 'Müştəri loyallığı'}
                {language === 'ru' && 'Лояльность клиентов'}
                {language === 'en' && 'Client retention'}
              </p>
            </div>
          </div>

          <div ref={testimonialsReveal.ref} className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/[0.02]" ref={howWeWorkReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${howWeWorkReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.howWeWork.heading}
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t.howWeWork.subheading}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4D00]/40 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FF4D00]">1</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">{t.howWeWork.step1Title}</h3>
              <p className="text-white/60 text-sm">{t.howWeWork.step1Desc}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4D00]/40 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FF4D00]">2</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">{t.howWeWork.step2Title}</h3>
              <p className="text-white/60 text-sm">{t.howWeWork.step2Desc}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4D00]/40 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FF4D00]">3</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">{t.howWeWork.step3Title}</h3>
              <p className="text-white/60 text-sm">{t.howWeWork.step3Desc}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4D00]/40 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FF4D00]">4</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">{t.howWeWork.step4Title}</h3>
              <p className="text-white/60 text-sm">{t.howWeWork.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" ref={faqReveal.ref}>
        <div className={`max-w-3xl mx-auto transition-all duration-700 ${faqReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.faq.heading}
            </h2>
          </div>
          <Accordion type="single" collapsible className="border-white/20 bg-white/5 rounded-2xl overflow-hidden">
            <AccordionItem value="q1" className="border-white/10 px-4">
              <AccordionTrigger className="text-white hover:no-underline hover:text-[#FF4D00] py-5 text-left">
                {t.faq.q1}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-5">
                {t.faq.a1}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="border-white/10 px-4">
              <AccordionTrigger className="text-white hover:no-underline hover:text-[#FF4D00] py-5 text-left">
                {t.faq.q2}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-5">
                {t.faq.a2}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="border-white/10 px-4">
              <AccordionTrigger className="text-white hover:no-underline hover:text-[#FF4D00] py-5 text-left">
                {t.faq.q3}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-5">
                {t.faq.a3}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" ref={portfolioReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${portfolioReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.portfolio.heading}
            </h2>
            <p className="text-xl text-white/60">
              {t.portfolio.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} {...item} to={`/portfolio/${item.id}`} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {t.portfolio.viewAll}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/[0.02]" ref={ctaReveal.ref}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ctaReveal.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-3xl p-12 shadow-2xl shadow-[#FF4D00]/20 hover:shadow-[#FF4D00]/30 transition-shadow duration-300">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t.finalCta.heading}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t.finalCta.subheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="bg-white text-[#FF4D00] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
                >
                  {t.finalCta.button}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  {t.hero.cta2}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
