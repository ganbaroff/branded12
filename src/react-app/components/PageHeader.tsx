import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import Breadcrumbs from './Breadcrumbs';

type PageHeaderProps = {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  badge?: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({ breadcrumbs, badge, title, subtitle }: PageHeaderProps) {
  const headerReveal = useScrollReveal({ initialVisible: true });

  return (
    <section 
      className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" 
      ref={headerReveal.ref}
    >
      <div 
        className={`max-w-7xl mx-auto transition-all duration-700 ${
          headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        
        <div className="text-center">
          {badge && (
            <div className="inline-block px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-full mb-6 animate-fade-in">
              <span className="text-[#FF4D00] text-sm font-medium">
                {badge}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
