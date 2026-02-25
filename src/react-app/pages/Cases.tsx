import { useState, useEffect } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Badge } from '@/react-app/components/ui/badge';
import { Card } from '@/react-app/components/ui/card';
import { Quote, TrendingUp, Users, Target } from 'lucide-react';
import { useScrollReveal } from '@/react-app/hooks/useScrollReveal';
import { useMetaTags } from '@/react-app/hooks/useMetaTags';
import Breadcrumbs from '@/react-app/components/Breadcrumbs';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import { apiGet } from '@/react-app/lib/api';
import { toast } from '@/react-app/lib/toast';
import { defaultCasesForFallback } from '@/react-app/data/defaultContent';
import type { CaseStudy } from '@/react-app/types';

export default function CasesPage() {
  const { language } = useLanguage();
  const headerReveal = useScrollReveal({ initialVisible: true });
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useMetaTags({
    title: language === 'az' 
      ? 'Keyslar - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Кейсы - B2Brand Creative Agency'
      : 'Case Studies - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Real nəticələr və müştəri uğur hekayələri. Azərbaycan bizneslərinə necə kömək etdiyimizi öyrənin.'
      : language === 'ru'
      ? 'Реальные результаты и истории успеха клиентов. Узнайте, как мы помогли азербайджанским бизнесам.'
      : 'Real results and client success stories. Learn how we helped Azerbaijani businesses.'
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await apiGet<CaseStudy[]>('/api/cases');
      setCases(data.length > 0 ? data : defaultCasesForFallback);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
      setCases(defaultCasesForFallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const breadcrumbLabel = {
    az: 'Keyslar',
    ru: 'Кейсы',
    en: 'Case Studies'
  }[language];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
          <div className="text-center">
          <div className="inline-block px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-full mb-6 animate-fade-in">
            <span className="text-[#FF4D00] text-sm font-medium">
              {language === 'az' && 'Keyslar'}
              {language === 'ru' && 'Кейсы'}
              {language === 'en' && 'Case Studies'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {language === 'az' && 'Real Nəticələr, Real Müştərilər'}
            {language === 'ru' && 'Реальные результаты, реальные клиенты'}
            {language === 'en' && 'Real Results, Real Clients'}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {language === 'az' && 'Azərbaycan bizneslərinə necə kömək etdiyimizi öyrənin'}
            {language === 'ru' && 'Узнайте, как мы помогли азербайджанским бизнесам'}
            {language === 'en' && 'Learn how we helped Azerbaijani businesses'}
          </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-32">
          {cases.map((caseStudy, index) => (
            <div key={caseStudy.id} className="space-y-12">
              {/* Hero Image */}
              <div className="relative aspect-video rounded-3xl overflow-hidden">
                <img
                  src={caseStudy.hero_image_url}
                  alt={caseStudy[`title_${language}` as keyof CaseStudy] as string}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#FF4D00] text-white">
                      {caseStudy[`industry_${language}` as keyof CaseStudy] as string}
                    </Badge>
                    <Badge variant="outline" className="border-white/40 text-white">
                      {caseStudy.project_year}
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {caseStudy[`title_${language}` as keyof CaseStudy] as string}
                  </h2>
                  <p className="text-white/80 text-lg">
                    {caseStudy.client_name} • {caseStudy[`service_type_${language}` as keyof CaseStudy] as string}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] border-0 p-8 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{caseStudy.metric1_value}</div>
                  <div className="text-white/90">{caseStudy[`metric1_label_${language}` as keyof CaseStudy] as string}</div>
                </Card>
                <Card className="bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] border-0 p-8 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{caseStudy.metric2_value}</div>
                  <div className="text-white/90">{caseStudy[`metric2_label_${language}` as keyof CaseStudy] as string}</div>
                </Card>
                <Card className="bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] border-0 p-8 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{caseStudy.metric3_value}</div>
                  <div className="text-white/90">{caseStudy[`metric3_label_${language}` as keyof CaseStudy] as string}</div>
                </Card>
              </div>

              {/* Challenge */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {language === 'az' && 'Çətinlik'}
                  {language === 'ru' && 'Вызов'}
                  {language === 'en' && 'Challenge'}
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  {caseStudy[`challenge_${language}` as keyof CaseStudy] as string}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {language === 'az' && 'Həll'}
                  {language === 'ru' && 'Решение'}
                  {language === 'en' && 'Solution'}
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  {caseStudy[`solution_${language}` as keyof CaseStudy] as string}
                </p>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {language === 'az' && 'Nəticələr'}
                  {language === 'ru' && 'Результаты'}
                  {language === 'en' && 'Results'}
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  {caseStudy[`results_${language}` as keyof CaseStudy] as string}
                </p>
              </div>

              {/* Quote */}
              {caseStudy.quote_text_az && (
                <Card className="bg-white/5 border-white/10 p-8 md:p-12">
                  <Quote className="w-12 h-12 text-[#FF4D00] mb-6" />
                  <blockquote className="text-white text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                    "{caseStudy[`quote_text_${language}` as keyof CaseStudy] as string}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold">
                      {caseStudy.quote_author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{caseStudy.quote_author}</div>
                      <div className="text-white/60 text-sm">{caseStudy.quote_position}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Divider */}
              {index < cases.length - 1 && (
                <div className="pt-12">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
