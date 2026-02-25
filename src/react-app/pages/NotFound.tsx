import { Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#FF4D00]/20 to-[#FF4D00]/5 rounded-full">
            <span className="text-7xl font-bold bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] bg-clip-text text-transparent">
              404
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {language === 'az' && 'Səhifə tapılmadı'}
          {language === 'ru' && 'Страница не найдена'}
          {language === 'en' && 'Page Not Found'}
        </h1>

        {/* Description */}
        <p className="text-xl text-white/60 mb-12">
          {language === 'az' && 'Axtardığınız səhifə mövcud deyil və ya köçürülüb. Zəhmət olmasa əsas səhifəyə qayıdın.'}
          {language === 'ru' && 'Запрашиваемая страница не существует или была перемещена. Пожалуйста, вернитесь на главную.'}
          {language === 'en' && 'The page you are looking for does not exist or has been moved. Please return to the home page.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF4D00]/30 transition-all group"
          >
            <Home className="w-5 h-5 mr-2" />
            {language === 'az' && 'Əsas səhifə'}
            {language === 'ru' && 'Главная страница'}
            {language === 'en' && 'Home Page'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/services"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Search className="w-5 h-5 mr-2" />
            {language === 'az' && 'Xidmətlər'}
            {language === 'ru' && 'Услуги'}
            {language === 'en' && 'Services'}
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-sm text-white/40 mb-4">
            {language === 'az' && 'Populyar səhifələr:'}
            {language === 'ru' && 'Популярные страницы:'}
            {language === 'en' && 'Popular pages:'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/pricing" className="text-sm text-[#FF4D00] hover:text-[#FF6B00] transition-colors">
              {language === 'az' && 'Qiymətlər'}
              {language === 'ru' && 'Цены'}
              {language === 'en' && 'Pricing'}
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/portfolio" className="text-sm text-[#FF4D00] hover:text-[#FF6B00] transition-colors">
              {language === 'az' && 'Portfolio'}
              {language === 'ru' && 'Портфолио'}
              {language === 'en' && 'Portfolio'}
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/quiz" className="text-sm text-[#FF4D00] hover:text-[#FF6B00] transition-colors">
              Quiz
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/contact" className="text-sm text-[#FF4D00] hover:text-[#FF6B00] transition-colors">
              {language === 'az' && 'Əlaqə'}
              {language === 'ru' && 'Контакты'}
              {language === 'en' && 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
