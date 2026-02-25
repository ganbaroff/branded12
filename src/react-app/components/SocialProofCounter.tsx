import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Briefcase, Users, Star, TrendingUp } from 'lucide-react';

export default function SocialProofCounter() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Briefcase,
      value: 120,
      label: {
        az: 'Tamamlanmış layihə',
        ru: 'Завершенных проектов',
        en: 'Completed projects'
      }
    },
    {
      icon: Users,
      value: 50,
      suffix: '+',
      label: {
        az: 'Xoşbəxt müştəri',
        ru: 'Довольных клиентов',
        en: 'Happy clients'
      }
    },
    {
      icon: Star,
      value: 4.9,
      decimal: true,
      suffix: '/5',
      label: {
        az: 'Orta reytinq',
        ru: 'Средний рейтинг',
        en: 'Average rating'
      }
    },
    {
      icon: TrendingUp,
      value: 95,
      suffix: '%',
      label: {
        az: 'Müştəri məmnuniyyəti',
        ru: 'Удовлетворенность клиентов',
        en: 'Client satisfaction'
      }
    }
  ];

  return (
    <div ref={sectionRef} className="py-16 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              decimal={stat.decimal}
              label={stat.label[language]}
              delay={index * 100}
              shouldAnimate={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  suffix = '',
  decimal = false,
  label,
  delay,
  shouldAnimate
}: {
  icon: any;
  value: number;
  suffix?: string;
  decimal?: boolean;
  label: string;
  delay: number;
  shouldAnimate: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let interval: NodeJS.Timeout | null = null;
    
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          if (interval) clearInterval(interval);
        } else {
          setCount(current);
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [shouldAnimate, value, delay]);

  const displayValue = decimal ? count.toFixed(1) : Math.floor(count);

  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-[#FF4D00]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF4D00]/20 transition-all">
        <Icon className="w-8 h-8 text-[#FF4D00]" />
      </div>
      <div className="text-4xl font-bold text-white mb-2">
        {displayValue}{suffix}
      </div>
      <div className="text-white/60 text-sm">
        {label}
      </div>
    </div>
  );
}
