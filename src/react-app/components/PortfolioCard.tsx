import { Link } from 'react-router';
import { Card } from '@/react-app/components/ui/card';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';

interface PortfolioCardProps {
  title: { az: string; ru: string; en: string };
  category: { az: string; ru: string; en: string };
  image: string;
  to?: string;
}

export default function PortfolioCard({ title, category, image, to }: PortfolioCardProps) {
  const { language } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const content = (
    <Card className="group relative overflow-hidden bg-transparent border-white/10 hover:border-[#FF4D00]/50 transition-all duration-300 cursor-pointer hover:scale-105">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title[language]} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[#FF4D00] text-sm font-medium mb-2">{category[language]}</p>
          <h3 className="text-white text-xl font-bold">{title[language]}</h3>
        </div>
      </div>
    </Card>
  );

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {to ? <Link to={to} className="block">{content}</Link> : content}
    </div>
  );
}
