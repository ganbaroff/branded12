import { useCountdown } from '@/react-app/hooks/useCountdown';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Clock } from 'lucide-react';

export default function CountdownBanner() {
  const { language } = useLanguage();
  
  // Evergreen deadline: always end of current month at 23:59:59
  const now = new Date();
  const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline);

  if (isExpired) return null;

  // Format deadline date for display
  const deadlineDay = deadline.getDate();
  const monthNames = {
    az: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  const monthName = monthNames[language][deadline.getMonth()];

  const text = {
    az: `50% endirim ${deadlineDay} ${monthName}dək!`,
    ru: `Скидка 50% до ${deadlineDay} ${monthName}!`,
    en: `50% discount until ${monthName} ${deadlineDay}!`
  };

  return (
    <div className="bg-gradient-to-r from-[#FF4D00] to-[#ff6b2c] py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-semibold text-sm sm:text-base">
            {text[language]}
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg min-w-[50px]">
              <span className="text-white font-bold text-lg">{String(days).padStart(2, '0')}</span>
            </div>
            <span className="text-white/80 text-xs mt-1 block">
              {language === 'az' ? 'gün' : language === 'ru' ? 'дней' : 'days'}
            </span>
          </div>
          <span className="text-white text-xl font-bold">:</span>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg min-w-[50px]">
              <span className="text-white font-bold text-lg">{String(hours).padStart(2, '0')}</span>
            </div>
            <span className="text-white/80 text-xs mt-1 block">
              {language === 'az' ? 'saat' : language === 'ru' ? 'часов' : 'hours'}
            </span>
          </div>
          <span className="text-white text-xl font-bold">:</span>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg min-w-[50px]">
              <span className="text-white font-bold text-lg">{String(minutes).padStart(2, '0')}</span>
            </div>
            <span className="text-white/80 text-xs mt-1 block">
              {language === 'az' ? 'dəq' : language === 'ru' ? 'минут' : 'min'}
            </span>
          </div>
          <span className="text-white text-xl font-bold">:</span>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg min-w-[50px]">
              <span className="text-white font-bold text-lg">{String(seconds).padStart(2, '0')}</span>
            </div>
            <span className="text-white/80 text-xs mt-1 block">
              {language === 'az' ? 'san' : language === 'ru' ? 'секунд' : 'sec'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
