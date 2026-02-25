import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Link } from 'react-router';

export default function ExitIntentPopup() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  // Evergreen deadline: end of current month
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const deadlineDay = endOfMonth.getDate();
  const monthNamesAz = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
  const monthNamesRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIdx = endOfMonth.getMonth();

  const content = {
    az: {
      title: 'Gözləyin! ⏰',
      subtitle: 'Son fürsət: İlk aya 50% endirim!',
      description: `${deadlineDay} ${monthNamesAz[monthIdx]}dək hər hansı paketə sifariş edib ilk ay 50% endirim qazanın.`,
      cta: 'Endirimi əldə et',
      close: 'Bağla'
    },
    ru: {
      title: 'Подождите! ⏰',
      subtitle: 'Последний шанс: скидка 50% на первый месяц!',
      description: `До ${deadlineDay} ${monthNamesRu[monthIdx]} закажите любой пакет и получите скидку 50% на первый месяц.`,
      cta: 'Получить скидку',
      close: 'Закрыть'
    },
    en: {
      title: 'Wait! ⏰',
      subtitle: 'Last chance: 50% off first month!',
      description: `Order any package before ${monthNamesEn[monthIdx]} ${deadlineDay} and get 50% off your first month.`,
      cta: 'Get the discount',
      close: 'Close'
    }
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] border-2 border-[#FF4D00] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-[#FF4D00]/20 animate-scale-in relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label={t.close}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF4D00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#FF4D00]" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {t.title}
          </h2>

          <h3 className="text-xl font-semibold text-[#FF4D00] mb-4">
            {t.subtitle}
          </h3>

          <p className="text-white/70 mb-6 leading-relaxed">
            {t.description}
          </p>

          <Link
            to="/brief"
            onClick={() => setIsVisible(false)}
            className="block w-full py-4 bg-gradient-to-r from-[#FF4D00] to-[#ff6b2c] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF4D00]/30 transition-all mb-3"
          >
            {t.cta}
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
