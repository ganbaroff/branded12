import { useState } from "react";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import { trackQuizComplete } from "@/react-app/components/Analytics";
import { markQuizCompleted } from "@/react-app/lib/engagement";

type QuizAnswer = {
  questionId: number;
  answer: string;
};

type QuizQuestion = {
  id: number;
  question: { az: string; ru: string; en: string };
  options: Array<{ value: string; label: { az: string; ru: string; en: string } }>;
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: {
      az: "Biznesinizin ölçüsü necədir?",
      ru: "Какого размера ваш бизнес?",
      en: "What is the size of your business?"
    },
    options: [
      { value: "startup", label: { az: "Yeni başlayan / Startup", ru: "Стартап", en: "Startup" } },
      { value: "small", label: { az: "Kiçik biznes (1-10 işçi)", ru: "Малый бизнес (1-10 сотрудников)", en: "Small business (1-10 employees)" } },
      { value: "medium", label: { az: "Orta biznes (10-50 işçi)", ru: "Средний бизнес (10-50 сотрудников)", en: "Medium business (10-50 employees)" } },
      { value: "large", label: { az: "Böyük şirkət (50+ işçi)", ru: "Крупная компания (50+ сотрудников)", en: "Large company (50+ employees)" } }
    ]
  },
  {
    id: 2,
    question: {
      az: "Əsas məqsədiniz nədir?",
      ru: "Какова ваша основная цель?",
      en: "What is your main goal?"
    },
    options: [
      { value: "awareness", label: { az: "Brend tanınması", ru: "Узнаваемость бренда", en: "Brand awareness" } },
      { value: "sales", label: { az: "Satışları artırmaq", ru: "Увеличить продажи", en: "Increase sales" } },
      { value: "engagement", label: { az: "Müştəri cəlbi", ru: "Привлечение клиентов", en: "Customer engagement" } },
      { value: "leads", label: { az: "Lead generasiya", ru: "Генерация лидов", en: "Lead generation" } }
    ]
  },
  {
    id: 3,
    question: {
      az: "Hansı platformalarda aktiv olmaq istəyirsiniz?",
      ru: "На каких платформах вы хотите быть активны?",
      en: "Which platforms do you want to be active on?"
    },
    options: [
      { value: "instagram", label: { az: "Instagram", ru: "Instagram", en: "Instagram" } },
      { value: "facebook", label: { az: "Facebook", ru: "Facebook", en: "Facebook" } },
      { value: "linkedin", label: { az: "LinkedIn", ru: "LinkedIn", en: "LinkedIn" } },
      { value: "all", label: { az: "Hamısı", ru: "Все", en: "All platforms" } }
    ]
  },
  {
    id: 4,
    question: {
      az: "Aylıq marketinq büdcəniz nə qədərdir?",
      ru: "Каков ваш месячный маркетинговый бюджет?",
      en: "What is your monthly marketing budget?"
    },
    options: [
      { value: "low", label: { az: "500-1000 AZN", ru: "500-1000 AZN", en: "500-1000 AZN" } },
      { value: "medium", label: { az: "1000-2500 AZN", ru: "1000-2500 AZN", en: "1000-2500 AZN" } },
      { value: "high", label: { az: "2500-5000 AZN", ru: "2500-5000 AZN", en: "2500-5000 AZN" } },
      { value: "enterprise", label: { az: "5000+ AZN", ru: "5000+ AZN", en: "5000+ AZN" } }
    ]
  },
  {
    id: 5,
    question: {
      az: "Hazırda marketinq komandanız varmı?",
      ru: "У вас есть маркетинговая команда?",
      en: "Do you have a marketing team?"
    },
    options: [
      { value: "none", label: { az: "Xeyr, heç kim yoxdur", ru: "Нет, никого нет", en: "No, no one" } },
      { value: "partial", label: { az: "Bəzi işçilər var", ru: "Есть несколько человек", en: "Some people" } },
      { value: "full", label: { az: "Tam komanda var", ru: "Полная команда", en: "Full team" } },
      { value: "agency", label: { az: "Agentlikdən istifadə edirik", ru: "Работаем с агентством", en: "Working with agency" } }
    ]
  }
];

export default function QuizPage() {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex((a) => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, answer };
    } else {
      newAnswers.push({ questionId, answer });
    }
    
    setAnswers(newAnswers);
  };

  const goNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const recommendation = getRecommendation();
      trackQuizComplete(recommendation);
      markQuizCompleted(); // Mark quiz as completed for engagement tracking
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getRecommendation = () => {
    const businessSize = answers.find((a: QuizAnswer) => a.questionId === 1)?.answer;
    const budget = answers.find((a: QuizAnswer) => a.questionId === 4)?.answer;
    const team = answers.find((a: QuizAnswer) => a.questionId === 5)?.answer;

    // Scoring logic
    if ((budget === "low" || businessSize === "startup") && team === "none") {
      return "starter";
    } else if (budget === "enterprise" || businessSize === "large") {
      return "enterprise";
    } else {
      return "growth";
    }
  };

  const recommendation = showResults ? getRecommendation() : null;

  useMetaTags({
    title: language === 'az' 
      ? 'Xidmət Tövsiyəsi Quiz - B2Brand'
      : language === 'ru'
      ? 'Квиз рекомендаций - B2Brand'
      : 'Service Recommendation Quiz - B2Brand',
    description: language === 'az'
      ? '5 sualda sizə ən uyğun marketinq paketini tapın.'
      : language === 'ru'
      ? 'Найдите подходящий маркетинговый пакет за 5 вопросов.'
      : 'Find the right marketing package in 5 questions.'
  });

  const packageDetails = {
    starter: {
      name: { az: "Starter Paket", ru: "Пакет Starter", en: "Starter Package" },
      price: 1290,
      firstMonthPrice: 645,
      description: {
        az: "Yeni başlayanlar və kiçik bizneslər üçün ideal. Sosial mediada möhkəm baza yaradın.",
        ru: "Идеально для стартапов и малого бизнеса. Создайте прочную базу в социальных сетях.",
        en: "Perfect for startups and small businesses. Build a solid foundation in social media."
      },
      features: {
        az: ["Instagram + Facebook idarəetmə", "Aylıq 12 post", "Əsas analitika", "Aylıq hesabat"],
        ru: ["Управление Instagram + Facebook", "12 постов в месяц", "Базовая аналитика", "Ежемесячный отчет"],
        en: ["Instagram + Facebook management", "12 posts per month", "Basic analytics", "Monthly report"]
      }
    },
    growth: {
      name: { az: "Growth Paket", ru: "Пакет Growth", en: "Growth Package" },
      price: 1990,
      firstMonthPrice: 995,
      description: {
        az: "İnkişaf edən bizneslər üçün. Kompleks strategiya və maksimum nəticə.",
        ru: "Для развивающихся бизнесов. Комплексная стратегия и максимальный результат.",
        en: "For growing businesses. Comprehensive strategy and maximum results."
      },
      features: {
        az: ["Bütün sosial media platformaları", "Aylıq 20 post", "Detallı analitika", "Reklamların idarəsi", "Məzmun strategiyası"],
        ru: ["Все платформы соцсетей", "20 постов в месяц", "Детальная аналитика", "Управление рекламой", "Контент-стратегия"],
        en: ["All social media platforms", "20 posts per month", "Detailed analytics", "Ad management", "Content strategy"]
      }
    },
    enterprise: {
      name: { az: "Enterprise Paket", ru: "Пакет Enterprise", en: "Enterprise Package" },
      price: 3490,
      firstMonthPrice: 1745,
      description: {
        az: "Böyük şirkətlər üçün premium xidmət. Tam idarəetmə və fərdi yanaşma.",
        ru: "Премиум услуга для крупных компаний. Полное управление и индивидуальный подход.",
        en: "Premium service for large companies. Full management and personalized approach."
      },
      features: {
        az: ["Premium məzmun istehsalı", "Limitsiz post", "Rəqib analizi", "Dedikə menecer", "Fərdi strategiya", "Prioritet dəstək"],
        ru: ["Премиум производство контента", "Безлимитные посты", "Конкурентный анализ", "Выделенный менеджер", "Индивидуальная стратегия", "Приоритетная поддержка"],
        en: ["Premium content production", "Unlimited posts", "Competitor analysis", "Dedicated manager", "Custom strategy", "Priority support"]
      }
    }
  };

  const currentAnswer = answers.find((a: QuizAnswer) => a.questionId === quizQuestions[currentQuestion]?.id)?.answer;
  const canProceed = currentAnswer !== undefined;

  if (showResults && recommendation) {
    const pkg = packageDetails[recommendation as keyof typeof packageDetails];
    
    return (
      <div className="min-h-screen pt-20 pb-20">
        <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF4D00] mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {language === "az"
                ? "Sizin üçün ideal paket:"
                : language === "ru"
                ? "Идеальный пакет для вас:"
                : "Your ideal package:"}
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-[#FF4D00] mb-8">
              {pkg.name[language]}
            </h2>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border-2 border-[#FF4D00] shadow-lg shadow-[#FF4D00]/20">
              <p className="text-xl text-gray-300 mb-8 text-center">
                {pkg.description[language]}
              </p>

              <div className="mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">{pkg.firstMonthPrice}</span>
                  <span className="text-gray-400">AZN</span>
                  <span className="text-sm text-gray-500">
                    {language === "az" ? "ilk ay" : language === "ru" ? "первый месяц" : "first month"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <span className="line-through">{pkg.price} AZN</span>
                  <span className="px-3 py-1 bg-[#FF4D00]/20 text-[#FF4D00] text-sm font-semibold rounded">
                    -50%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {language === "az"
                    ? `Sonrakı aylar: ${pkg.price} AZN/ay`
                    : language === "ru"
                    ? `Следующие месяцы: ${pkg.price} AZN/мес`
                    : `Next months: ${pkg.price} AZN/mo`}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {language === "az"
                    ? "Nə daxildir:"
                    : language === "ru"
                    ? "Что входит:"
                    : "What's included:"}
                </h3>
                <ul className="space-y-3">
                  {pkg.features[language].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF4D00] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/brief"
                  className="flex-1 py-4 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  {language === "az"
                    ? "Bu paketlə başla"
                    : language === "ru"
                    ? "Начать с этим пакетом"
                    : "Start with this package"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="flex-1 py-4 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
                >
                  {language === "az"
                    ? "Bütün paketlərə bax"
                    : language === "ru"
                    ? "Смотреть все пакеты"
                    : "View all packages"}
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers([]);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {language === "az"
                  ? "Yenidən başla"
                  : language === "ru"
                  ? "Начать заново"
                  : "Start over"}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {language === "az"
              ? "Xidmət Tövsiyə Quiz"
              : language === "ru"
              ? "Квиз для подбора услуг"
              : "Service Recommendation Quiz"}
          </h1>
          <p className="text-xl text-gray-400">
            {language === "az"
              ? "Biznesiniz üçün ən uyğun paketi tapmağa kömək edək"
              : language === "ru"
              ? "Поможем найти наиболее подходящий пакет для вашего бизнеса"
              : "Let's help you find the most suitable package for your business"}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                {language === "az"
                  ? `Sual ${currentQuestion + 1} / ${quizQuestions.length}`
                  : language === "ru"
                  ? `Вопрос ${currentQuestion + 1} / ${quizQuestions.length}`
                  : `Question ${currentQuestion + 1} / ${quizQuestions.length}`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4D00] to-[#ff6b2c] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              {question.question[language]}
            </h2>

            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    currentAnswer === option.value
                      ? "border-[#FF4D00] bg-[#FF4D00]/10"
                      : "border-gray-800 hover:border-gray-700 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        currentAnswer === option.value
                          ? "border-[#FF4D00] bg-[#FF4D00]"
                          : "border-gray-700"
                      }`}
                    >
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white text-lg">{option.label[language]}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={goBack}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 ${
                  currentQuestion === 0
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                {language === "az" ? "Geri" : language === "ru" ? "Назад" : "Back"}
              </button>

              <button
                onClick={goNext}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 ${
                  canProceed
                    ? "bg-[#FF4D00] text-white hover:bg-[#ff6b2c]"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                {currentQuestion === quizQuestions.length - 1
                  ? language === "az"
                    ? "Nəticəni gör"
                    : language === "ru"
                    ? "Увидеть результат"
                    : "See result"
                  : language === "az"
                  ? "Növbəti"
                  : language === "ru"
                  ? "Далее"
                  : "Next"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
