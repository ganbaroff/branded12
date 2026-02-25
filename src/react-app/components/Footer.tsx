import { Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { translations } from '@/react-app/data/content';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import TrustBadges from './TrustBadges';
import { useState, useEffect, useRef } from 'react';
import { Briefcase, Users } from 'lucide-react';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = counterRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="bg-black border-t border-white/5">
      {/* Trust Counters */}
      <div ref={counterRef} className="border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <TrustCounter
              icon={Briefcase}
              value={120}
              suffix="+"
              label={language === 'az' ? 'Tamamlanmış layihə' : language === 'ru' ? 'Завершенных проектов' : 'Completed projects'}
              shouldAnimate={isVisible}
              delay={0}
            />
            <TrustCounter
              icon={Users}
              value={94}
              suffix="%"
              label={language === 'az' ? 'Müştəri saxlayırıq' : language === 'ru' ? 'Удержание клиентов' : 'Client retention'}
              shouldAnimate={isVisible}
              delay={200}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B2</span>
              </div>
              <span className="text-white font-semibold text-lg">B2Brand</span>
            </div>
            <p className="text-white/60 text-sm">
              {language === 'az' && 'Kreativ marketinq agentliyi'}
              {language === 'ru' && 'Креативное маркетинговое агентство'}
              {language === 'en' && 'Creative marketing agency'}
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">
              {language === 'az' && 'Naviqasiya'}
              {language === 'ru' && 'Навигация'}
              {language === 'en' && 'Navigation'}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/services" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">{t.nav.services}</Link></li>
              <li><Link to="/pricing" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">{t.nav.pricing}</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">{t.nav.contact}</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">Blog</Link></li>
              <li><Link to="/admin" className="text-white/60 hover:text-[#FF4D00] text-sm transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">
              {language === 'az' && 'Əlaqə'}
              {language === 'ru' && 'Контакты'}
              {language === 'en' && 'Contact'}
            </h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>info@b2brand.az</li>
              <li>+994 50 123 45 67</li>
              <li>Bakı, Azərbaycan</li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">
              {language === 'az' && 'Sosial media'}
              {language === 'ru' && 'Социальные сети'}
              {language === 'en' && 'Social media'}
            </h3>
            <div className="flex space-x-4">
              {/* TODO: Add real social media URLs when accounts are created */}
              <a 
                href="https://instagram.com/b2brand.az" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#FF4D00] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/b2brand.az" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#FF4D00] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/b2brand" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#FF4D00] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <TrustBadges />

        <div className="border-t border-white/5 mt-8 pt-8 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} B2Brand Creative Agency. {language === 'az' && 'Bütün hüquqlar qorunur.'}{language === 'ru' && 'Все права защищены.'}{language === 'en' && 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}

function TrustCounter({
  icon: Icon,
  value,
  suffix = '',
  label,
  delay,
  shouldAnimate
}: {
  icon: any;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
  shouldAnimate: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, value, delay]);

  return (
    <div className="text-center group">
      <div className="w-20 h-20 bg-gradient-to-br from-[#FF4D00]/20 to-[#FF4D00]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-10 h-10 text-[#FF4D00]" />
      </div>
      <div className="text-5xl font-bold bg-gradient-to-r from-[#FF4D00] to-[#FF6B00] bg-clip-text text-transparent mb-2">
        {Math.floor(count)}{suffix}
      </div>
      <div className="text-white/60 text-sm font-medium">
        {label}
      </div>
    </div>
  );
}
