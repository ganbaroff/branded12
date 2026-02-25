import { useState } from "react";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import { services, pricingPackages } from "@/react-app/data/content";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useScrollReveal } from "@/react-app/hooks/useScrollReveal";
import { useMetaTags } from "@/react-app/hooks/useMetaTags";
import { trackBriefSubmit } from "@/react-app/components/Analytics";
import { toast } from "@/react-app/lib/toast";
import { getUTMParams } from "@/react-app/lib/utm";
import { getEngagementMetrics } from "@/react-app/lib/engagement";

type FormData = {
  name: string;
  company: string;
  phone: string;
  email: string;
  selectedServices: string[];
  selectedPackage: string;
  budget: string;
  goals: string;
  deadline: string;
  additionalInfo: string;
};

export default function BriefPage() {
  const { language } = useLanguage();
  const headerReveal = useScrollReveal({ initialVisible: true });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    phone: "",
    email: "",
    selectedServices: [],
    selectedPackage: "",
    budget: "",
    goals: "",
    deadline: "",
    additionalInfo: ""
  });

  useMetaTags({
    title: language === 'az' 
      ? 'Layihə Brifi - B2Brand Creative Agency'
      : language === 'ru'
      ? 'Бриф проекта - B2Brand Creative Agency'
      : 'Project Brief - B2Brand Creative Agency',
    description: language === 'az'
      ? 'Layihəniz haqqında bizə məlumat verin və pulsuz məsləhət alın.'
      : language === 'ru'
      ? 'Расскажите о вашем проекте и получите бесплатную консультацию.'
      : 'Tell us about your project and get a free consultation.'
  });

  const totalSteps = 4;

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleSubmit = async () => {
    const loadingId = toast.loading(
      language === "az" 
        ? "Göndərilir..."
        : language === "ru"
        ? "Отправка..."
        : "Submitting..."
    );

    try {
      // Get UTM parameters and engagement metrics
      const utmParams = getUTMParams();
      const engagement = getEngagementMetrics();
      
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          selectedServices: formData.selectedServices,
          selectedPackage: formData.selectedPackage,
          budget: formData.budget,
          goals: formData.goals,
          deadline: formData.deadline,
          additionalInfo: formData.additionalInfo,
          engagement,
          ...utmParams
        }),
      });

      if (response.ok) {
        toast.dismiss(loadingId);
        toast.success(
          language === "az" 
            ? "Təşəkkürlər! Tezliklə sizinlə əlaqə saxlayacağıq."
            : language === "ru"
            ? "Спасибо! Скоро свяжемся с вами."
            : "Thank you! We'll contact you soon."
        );
        setSubmitted(true);
        trackBriefSubmit(formData.selectedPackage);
      } else {
        toast.dismiss(loadingId);
        const errorData = await response.json();
        toast.error(
          errorData.error || (language === "az" 
            ? "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
            : language === "ru"
            ? "Произошла ошибка. Пожалуйста, попробуйте еще раз."
            : "An error occurred. Please try again.")
        );
      }
    } catch (error) {
      console.error("Error submitting brief:", error);
      toast.dismiss(loadingId);
      toast.error(
        language === "az" 
          ? "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
          : language === "ru"
          ? "Произошла ошибка. Пожалуйста, попробуйте еще раз."
          : "An error occurred. Please try again."
      );
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.phone && formData.email;
      case 2:
        return formData.selectedServices.length > 0 || formData.selectedPackage;
      case 3:
        return formData.goals;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-[#FF4D00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#FF4D00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {language === "az"
              ? "Təşəkkür edirik!"
              : language === "ru"
              ? "Спасибо!"
              : "Thank you!"}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {language === "az"
              ? "Brifiniz qəbul edildi. 24 saat ərzində sizinlə əlaqə saxlayacağıq."
              : language === "ru"
              ? "Ваш бриф принят. Мы свяжемся с вами в течение 24 часов."
              : "Your brief has been received. We'll contact you within 24 hours."}
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors"
          >
            {language === "az"
              ? "Ana səhifəyə qayıt"
              : language === "ru"
              ? "Вернуться на главную"
              : "Back to home"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]" ref={headerReveal.ref}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {language === "az"
              ? "Layihə Brifi"
              : language === "ru"
              ? "Бриф проекта"
              : "Project Brief"}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {language === "az"
              ? "Bir neçə sadə sual - və fərdi təklif sizindir"
              : language === "ru"
              ? "Несколько простых вопросов - и индивидуальное предложение ваше"
              : "A few simple questions - and a custom proposal is yours"}
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? "bg-[#FF4D00] text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? "bg-[#FF4D00]" : "bg-gray-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>
            {language === "az"
              ? "Əlaqə"
              : language === "ru"
              ? "Контакты"
              : "Contact"}
          </span>
          <span>
            {language === "az"
              ? "Xidmətlər"
              : language === "ru"
              ? "Услуги"
              : "Services"}
          </span>
          <span>
            {language === "az"
              ? "Məqsədlər"
              : language === "ru"
              ? "Цели"
              : "Goals"}
          </span>
          <span>
            {language === "az"
              ? "Əlavə"
              : language === "ru"
              ? "Доп. инфо"
              : "Additional"}
          </span>
        </div>
      </div>

      {/* Form Steps */}
      <div className="max-w-4xl mx-auto px-4 mt-8 sm:mt-12">
        <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-800">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === "az"
                  ? "Əlaqə məlumatlarınız"
                  : language === "ru"
                  ? "Ваши контактные данные"
                  : "Your contact information"}
              </h2>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Ad, soyad"
                    : language === "ru"
                    ? "Имя, фамилия"
                    : "Name, surname"}{" "}
                  *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder={
                    language === "az"
                      ? "Adınız və soyadınız"
                      : language === "ru"
                      ? "Ваше имя и фамилия"
                      : "Your name and surname"
                  }
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Şirkət adı"
                    : language === "ru"
                    ? "Название компании"
                    : "Company name"}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder={
                    language === "az"
                      ? "Şirkətinizin adı (mütləq deyil)"
                      : language === "ru"
                      ? "Название вашей компании (необязательно)"
                      : "Your company name (optional)"
                  }
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Telefon"
                    : language === "ru"
                    ? "Телефон"
                    : "Phone"}{" "}
                  *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder="+994 50 123 45 67"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Services Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === "az"
                  ? "Hansı xidmətlər lazımdır?"
                  : language === "ru"
                  ? "Какие услуги вам нужны?"
                  : "Which services do you need?"}
              </h2>

              {/* Package Selection */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-4">
                  {language === "az"
                    ? "Və ya paket seçin:"
                    : language === "ru"
                    ? "Или выберите пакет:"
                    : "Or choose a package:"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => updateField("selectedPackage", pkg.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.selectedPackage === pkg.id
                          ? "border-[#FF4D00] bg-[#FF4D00]/10"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <h3 className="text-white font-semibold mb-2">
                        {pkg.name[language]}
                      </h3>
                      <p className="text-[#FF4D00] font-bold">
                        {pkg.firstMonthPrice} AZN
                      </p>
                      <p className="text-gray-500 text-sm line-through">
                        {pkg.monthlyPrice} AZN
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Services */}
              <div>
                <label className="block text-white font-medium mb-4">
                  {language === "az"
                    ? "Və ya ayrı-ayrı xidmətlər seçin:"
                    : language === "ru"
                    ? "Или выберите отдельные услуги:"
                    : "Or select individual services:"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.selectedServices.includes(service.id)
                          ? "border-[#FF4D00] bg-[#FF4D00]/10"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                            formData.selectedServices.includes(service.id)
                              ? "border-[#FF4D00] bg-[#FF4D00]"
                              : "border-gray-700"
                          }`}
                        >
                          {formData.selectedServices.includes(service.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{service.icon}</span>
                            <h3 className="text-white font-semibold">
                              {service.name[language]}
                            </h3>
                          </div>
                          <p className="text-[#FF4D00] text-sm font-bold">
                            {service.firstMonthPrice} AZN
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Timeline */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === "az"
                  ? "Məqsədləriniz və müddət"
                  : language === "ru"
                  ? "Ваши цели и сроки"
                  : "Your goals and timeline"}
              </h2>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Hansı məqsədlərə nail olmaq istəyirsiniz?"
                    : language === "ru"
                    ? "Каких целей вы хотите достичь?"
                    : "What goals do you want to achieve?"}{" "}
                  *
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => updateField("goals", e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder={
                    language === "az"
                      ? "Məsələn: Instagram izləyiciləri artırmaq, satışları yüksəltmək, brend tanınması..."
                      : language === "ru"
                      ? "Например: увеличить подписчиков Instagram, повысить продажи, узнаваемость бренда..."
                      : "For example: increase Instagram followers, boost sales, brand awareness..."
                  }
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Təxmini büdcə (AZN)"
                    : language === "ru"
                    ? "Примерный бюджет (AZN)"
                    : "Approximate budget (AZN)"}
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder="1000 - 5000"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Nə vaxta qədər başlamaq istəyirsiniz?"
                    : language === "ru"
                    ? "Когда хотите начать?"
                    : "When do you want to start?"}
                </label>
                <select
                  value={formData.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                >
                  <option value="">
                    {language === "az"
                      ? "Seçin"
                      : language === "ru"
                      ? "Выберите"
                      : "Select"}
                  </option>
                  <option value="asap">
                    {language === "az"
                      ? "Tezliklə"
                      : language === "ru"
                      ? "Как можно скорее"
                      : "ASAP"}
                  </option>
                  <option value="this-month">
                    {language === "az"
                      ? "Bu ay"
                      : language === "ru"
                      ? "В этом месяце"
                      : "This month"}
                  </option>
                  <option value="next-month">
                    {language === "az"
                      ? "Gələn ay"
                      : language === "ru"
                      ? "В следующем месяце"
                      : "Next month"}
                  </option>
                  <option value="flexible">
                    {language === "az"
                      ? "Çevik"
                      : language === "ru"
                      ? "Гибко"
                      : "Flexible"}
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Additional Info */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === "az"
                  ? "Əlavə məlumat"
                  : language === "ru"
                  ? "Дополнительная информация"
                  : "Additional information"}
              </h2>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "az"
                    ? "Əlavə qeydləriniz və ya suallarınız"
                    : language === "ru"
                    ? "Дополнительные примечания или вопросы"
                    : "Additional notes or questions"}
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateField("additionalInfo", e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white focus:border-[#FF4D00] focus:outline-none"
                  placeholder={
                    language === "az"
                      ? "Bizə bildirmək istədiyiniz hər hansı əlavə məlumat..."
                      : language === "ru"
                      ? "Любая дополнительная информация, которую вы хотите сообщить..."
                      : "Any additional information you'd like to share..."
                  }
                />
              </div>

              {/* Summary */}
              <div className="bg-[#0F0F0F] border border-gray-800 rounded-lg p-6 mt-8">
                <h3 className="text-white font-bold mb-4">
                  {language === "az"
                    ? "Xülasə"
                    : language === "ru"
                    ? "Резюме"
                    : "Summary"}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    <span className="text-white font-medium">
                      {language === "az"
                        ? "Ad:"
                        : language === "ru"
                        ? "Имя:"
                        : "Name:"}
                    </span>{" "}
                    {formData.name}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Email:</span>{" "}
                    {formData.email}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">
                      {language === "az"
                        ? "Telefon:"
                        : language === "ru"
                        ? "Телефон:"
                        : "Phone:"}
                    </span>{" "}
                    {formData.phone}
                  </p>
                  {formData.selectedPackage && (
                    <p className="text-gray-400">
                      <span className="text-white font-medium">
                        {language === "az"
                          ? "Paket:"
                          : language === "ru"
                          ? "Пакет:"
                          : "Package:"}
                      </span>{" "}
                      {
                        pricingPackages.find((p) => p.id === formData.selectedPackage)
                          ?.name[language]
                      }
                    </p>
                  )}
                  {formData.selectedServices.length > 0 && (
                    <p className="text-gray-400">
                      <span className="text-white font-medium">
                        {language === "az"
                          ? "Xidmətlər:"
                          : language === "ru"
                          ? "Услуги:"
                          : "Services:"}
                      </span>{" "}
                      {formData.selectedServices.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 ${
                step === 1
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              {language === "az"
                ? "Geri"
                : language === "ru"
                ? "Назад"
                : "Back"}
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 ${
                  canProceed()
                    ? "bg-[#FF4D00] text-white hover:bg-[#ff6b2c]"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                {language === "az"
                  ? "Növbəti"
                  : language === "ru"
                  ? "Далее"
                  : "Next"}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-[#FF4D00] text-white rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors inline-flex items-center gap-2"
              >
                {language === "az"
                  ? "Göndər"
                  : language === "ru"
                  ? "Отправить"
                  : "Submit"}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
