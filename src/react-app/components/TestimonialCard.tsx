import { Card } from '@/react-app/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';

interface TestimonialCardProps {
  name: { az: string; ru: string; en: string };
  company: { az: string; ru: string; en: string };
  text: { az: string; ru: string; en: string };
  rating: number;
}

export default function TestimonialCard({ name, company, text, rating }: TestimonialCardProps) {
  const { language } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className={`h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 h-full hover:border-[#FF4D00]/30 transition-all duration-300">
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#FF4D00] text-[#FF4D00]" />
          ))}
        </div>
        
        <p className="text-white/80 mb-6 leading-relaxed italic">"{text[language]}"</p>
        
        <div className="mt-auto">
          <p className="text-white font-semibold">{name[language]}</p>
          <p className="text-white/60 text-sm">{company[language]}</p>
        </div>
      </Card>
    </div>
  );
}
