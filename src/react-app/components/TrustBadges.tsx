import { Shield, Zap, MapPin } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function TrustBadges() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      text: {
        az: 'Təhlükəsiz ödəniş',
        ru: 'Безопасная оплата',
        en: 'Secure payment'
      }
    },
    {
      icon: Zap,
      text: {
        az: 'Sürətli çatdırılma',
        ru: 'Быстрая доставка',
        en: 'Fast delivery'
      }
    },
    {
      icon: MapPin,
      text: {
        az: 'Bakıda yerli agentlik',
        ru: 'Местное агентство в Баку',
        en: 'Local agency in Baku'
      }
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-white/5">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF4D00]/10 flex items-center justify-center">
            <badge.icon className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <span className="text-white/60 text-sm">{badge.text[language]}</span>
        </div>
      ))}
    </div>
  );
}
