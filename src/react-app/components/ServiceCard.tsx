import { Link } from 'react-router';
import { Card } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Button } from '@/react-app/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';

interface ServiceCardProps {
  id?: number;
  icon: string;
  name: { az: string; ru: string; en: string };
  description: { az: string; ru: string; en: string };
  monthlyPrice: number;
  firstMonthPrice: number;
  to?: string;
}

export default function ServiceCard({ icon, name, description, monthlyPrice, firstMonthPrice, to = '/services' }: ServiceCardProps) {
  const { language } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Card className="group relative bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#FF4D00]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF4D00]/10 hover:scale-105 overflow-hidden">
      <div className="absolute top-4 right-4">
        <Badge className="bg-[#FF4D00] text-white text-xs">
          {language === 'az' && 'İlk ay 50% endirim'}
          {language === 'ru' && '1-й месяц -50%'}
          {language === 'en' && 'First month 50% off'}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{name[language]}</h3>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">{description[language]}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-white">{firstMonthPrice} ₼</span>
            <span className="text-white/40 line-through text-lg">{monthlyPrice} ₼</span>
          </div>
          <p className="text-white/60 text-xs">
            {language === 'az' && 'ilk ay, sonra '}
            {language === 'ru' && 'первый месяц, затем '}
            {language === 'en' && 'first month, then '}
            {monthlyPrice} ₼/ay
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-[#FF4D00] hover:border-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-all"
          asChild
        >
          <Link to={to}>
            {language === 'az' && 'Ətraflı'}
            {language === 'ru' && 'Подробнее'}
            {language === 'en' && 'Learn more'}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
    </div>
  );
}
