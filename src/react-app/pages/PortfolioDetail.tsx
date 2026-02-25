import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import { useMetaTags } from '@/react-app/hooks/useMetaTags';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import Breadcrumbs from '@/react-app/components/Breadcrumbs';
import { apiGet } from '@/react-app/lib/api';
import { ApiError } from '@/react-app/lib/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/react-app/lib/toast';
import type { PortfolioItem } from '@/react-app/types';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const headerReveal = useScrollReveal({ initialVisible: true });
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    const fetchItem = async () => {
      try {
        const data = await apiGet<PortfolioItem>(`/api/portfolio/${numId}`);
        setItem(data);
        setNotFound(false);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          setNotFound(true);
          setItem(null);
        } else {
          toast.error('Failed to load project');
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const title = item ? (item[`title_${language}` as keyof PortfolioItem] as string) : '';
  useMetaTags({
    title: title ? `${title} - B2Brand` : 'Portfolio - B2Brand',
    description: item ? (item[`description_${language}` as keyof PortfolioItem] as string) : '',
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (notFound || !item) {
    const notFoundText = { az: 'Layihə tapılmadı', ru: 'Проект не найден', en: 'Project not found' }[language];
    const backText = { az: 'Portfolioya qayıt', ru: 'Вернуться в портфолио', en: 'Back to portfolio' }[language];
    return (
      <div className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">{notFoundText}</h1>
          <Link to="/portfolio">
            <Button variant="outline" className="border-white/20 text-white hover:bg-[#FF4D00] hover:border-[#FF4D00]">
              <ArrowLeft className="mr-2 w-4 h-4" />
              {backText}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbLabel = { az: 'Portfolio', ru: 'Портфолио', en: 'Portfolio' }[language];
  const backText = { az: 'Portfolioya qayıt', ru: 'Вернуться в портфолио', en: 'Back to portfolio' }[language];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Breadcrumbs items={[{ label: breadcrumbLabel, href: '/portfolio' }, { label: title }]} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-[#FF4D00] text-white">{item.metric_value}</Badge>
                <Badge variant="outline" className="border-white/20 text-white/60">
                  {item[`industry_${language}` as keyof PortfolioItem] as string}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/60">
                  {item.project_year}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-white/60">
                {item[`service_type_${language}` as keyof PortfolioItem] as string}
              </p>
            </div>
            <Link to="/portfolio">
              <Button variant="outline" className="border-white/20 text-white hover:bg-[#FF4D00] hover:border-[#FF4D00]">
                <ArrowLeft className="mr-2 w-4 h-4" />
                {backText}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-white/5">
            <img
              src={item.image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-6">
            <p className="text-[#FF4D00] font-medium mb-2">
              {item[`metric_label_${language}` as keyof PortfolioItem] as string}
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              {item[`description_${language}` as keyof PortfolioItem] as string}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
