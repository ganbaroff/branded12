// Centralized content and pricing data for B2Brand Creative Agency
// All prices, services, and content managed here for easy updates

export type Language = 'az' | 'ru' | 'en';

// TODO: Replace with your actual WhatsApp Business number
// Format: +994XXXXXXXXX (Azerbaijan country code + 994)
export const WHATSAPP_NUMBER = '+994501234567'; // Update with real number

export const translations = {
  az: {
    nav: {
      home: 'Ana səhifə',
      services: 'Xidmətlər',
      pricing: 'Qiymətlər',
      portfolio: 'Portfolio',
      contact: 'Əlaqə',
      brief: 'Brief'
    },
    hero: {
      headline: 'Brendlər yaradırıq ki, satılsın',
      subheadline: 'SMM, video çəkiliş, AI kontent, target reklam və brendinq — Bakıda ən sərfəli qiymətlə',
      cta1: 'İlk aya 50% endirim əldə et',
      cta2: 'WhatsApp-a yaz'
    },
    trustBar: {
      projects: '120+ layihə',
      retention: '94% müştəri yeniləyir',
      location: 'Bakı və regionlar'
    },
    services: {
      heading: 'Xidmətlərimiz',
      subheading: 'Hər bir biznes üçün düzgün həll',
      badge: 'İlk ay 50% endirim',
      viewAll: 'Bütün xidmətlər'
    },
    whyUs: {
      heading: 'Niyə məhz B2Brand?',
      subheading: 'Real nəticələr, şəffaf qiymət'
    },
    portfolio: {
      heading: 'Portfoliomuz',
      subheading: 'Son layihələrdən',
      viewAll: 'Bütün işlərə bax'
    },
    finalCta: {
      heading: '50% endirimlə başlamağa hazırsınız?',
      subheading: 'İlk ay yalnız yarı qiymətə! Ödənişsiz məsləhət alın.',
      button: 'İndi başla'
    },
    chat: {
      liveChatLabel: 'Canlı chat',
      headerTitle: 'Canlı konsultasiya',
      headerSubtitle: 'Layihənizi müzakirə edək, paket seçək',
      welcomeMessage: 'Salam! Brendinizi inkişaf etdirmək və layihənizi müzakirə etmək istəyirsiniz? Pulsuz konsultasiya və paket seçimi üçün mesaj göndərin.',
      ctaGetConsultation: 'Məsləhət al',
      placeholderName: 'Adınız',
      placeholderEmail: 'Email',
      placeholderMessage: 'Nə üçün kömək lazımdır? Layihə, büdcə və ya paket haqqında yazın',
      ctaSend: 'Göndər',
      sending: 'Göndərilir...',
      thankYou: 'Təşəkkürlər!',
      weWillContact: 'Tezliklə sizinlə əlaqə saxlayacağıq.',
      continueOnWhatsApp: 'WhatsApp-da davam edək'
    },
    howWeWork: {
      heading: 'Necə işləyirik?',
      subheading: '4 addımda layihənizə başlayaq',
      step1Title: 'Brif və soruş',
      step1Desc: 'Brifi doldurun və ya WhatsApp-da yazın. Ehtiyaclarınızı öyrənirik.',
      step2Title: 'Paket seçimi',
      step2Desc: 'Sizə uyğun paketi təklif edirik. İlk ay 50% endirim.',
      step3Title: 'Başlama',
      step3Desc: 'Kontent planı və strateji razılaşdırırıq. Komanda işə düşür.',
      step4Title: 'Nəticə',
      step4Desc: 'Aylıq hesabatlar və daimi dəstək. Brendiniz böyüyür.'
    },
    faq: {
      heading: 'Tez-tez verilən suallar',
      q1: 'İlk görüş ödənişlidir?',
      a1: 'Xeyr. Konsultasiya və paket seçimi tamamilə pulsuzdur. Ödəniş yalnız razılaşdırdıqdan sonra başlayır.',
      q2: 'Nə qədər vaxt ərzində nəticə görünər?',
      a2: 'İlk kontent 1–2 həftə ərzində. SMM-da davamlı böyümə üçün 2–3 ay tövsiyə olunur.',
      q3: 'Yalnız Bakıya xidmət edirsiniz?',
      a3: 'Əsasən bəli, amma onlayn xidmətlər (SMM, dizayn, reklam) bütün Azərbaycan üçün açıqdır.'
    },
    contactPage: {
      workingHoursTitle: 'İş saatları',
      workingHoursText: 'B.e. – C.a. 10:00–19:00',
      responseTimeTitle: 'Cavab müddəti',
      responseTimeText: 'Sorğulara 24 saat ərzində cavab veririk.'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      services: 'Услуги',
      pricing: 'Цены',
      portfolio: 'Портфолио',
      contact: 'Контакты',
      brief: 'Бриф'
    },
    hero: {
      headline: 'Создаём бренды, которые продают',
      subheadline: 'SMM, видеосъёмка, AI контент, таргетированная реклама и брендинг — по самой выгодной цене в Баку',
      cta1: 'Получить скидку 50% на первый месяц',
      cta2: 'Написать в WhatsApp'
    },
    trustBar: {
      projects: '120+ проектов',
      retention: '94% клиентов продлевают',
      location: 'Баку и регионы'
    },
    services: {
      heading: 'Наши услуги',
      subheading: 'Правильное решение для каждого бизнеса',
      badge: 'Первый месяц -50%',
      viewAll: 'Все услуги'
    },
    whyUs: {
      heading: 'Почему B2Brand?',
      subheading: 'Реальные результаты, прозрачные цены'
    },
    portfolio: {
      heading: 'Наше портфолио',
      subheading: 'Последние проекты',
      viewAll: 'Смотреть все работы'
    },
    finalCta: {
      heading: 'Готовы начать со скидкой 50%?',
      subheading: 'Первый месяц всего за полцены! Получите бесплатную консультацию.',
      button: 'Начать сейчас'
    },
    chat: {
      liveChatLabel: 'Живой чат',
      headerTitle: 'Живая консультация',
      headerSubtitle: 'Обсудим проект, подберём пакет',
      welcomeMessage: 'Привет! Хотите развить бренд и обсудить проект? Оставьте заявку — бесплатная консультация и подбор пакета под ваши цели.',
      ctaGetConsultation: 'Получить консультацию',
      placeholderName: 'Ваше имя',
      placeholderEmail: 'Email',
      placeholderMessage: 'Чем можем помочь? Опишите проект, бюджет или интересующий пакет',
      ctaSend: 'Отправить',
      sending: 'Отправка...',
      thankYou: 'Спасибо!',
      weWillContact: 'Скоро свяжемся с вами.',
      continueOnWhatsApp: 'Продолжим в WhatsApp'
    },
    howWeWork: {
      heading: 'Как мы работаем?',
      subheading: '4 шага до старта вашего проекта',
      step1Title: 'Бриф и запрос',
      step1Desc: 'Заполните бриф или напишите в WhatsApp. Узнаём ваши задачи.',
      step2Title: 'Выбор пакета',
      step2Desc: 'Подберём подходящий пакет. Скидка 50% на первый месяц.',
      step3Title: 'Старт',
      step3Desc: 'Согласуем контент-план и стратегию. Команда приступает к работе.',
      step4Title: 'Результат',
      step4Desc: 'Ежемесячные отчёты и постоянная поддержка. Ваш бренд растёт.'
    },
    faq: {
      heading: 'Частые вопросы',
      q1: 'Первая встреча платная?',
      a1: 'Нет. Консультация и подбор пакета бесплатны. Оплата начинается только после согласования.',
      q2: 'Когда появятся первые результаты?',
      a2: 'Первый контент — в течение 1–2 недель. Для стабильного роста в SMM рекомендуем 2–3 месяца.',
      q3: 'Работаете только в Баку?',
      a3: 'В основном да, но онлайн-услуги (SMM, дизайн, реклама) доступны по всему Азербайджану.'
    },
    contactPage: {
      workingHoursTitle: 'Режим работы',
      workingHoursText: 'Пн – Сб 10:00–19:00',
      responseTimeTitle: 'Время ответа',
      responseTimeText: 'Отвечаем на запросы в течение 24 часов.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      portfolio: 'Portfolio',
      contact: 'Contact',
      brief: 'Brief'
    },
    hero: {
      headline: 'We create brands that sell',
      subheadline: 'SMM, video production, AI content, targeted ads, and branding — at the best price in Baku',
      cta1: 'Get 50% off first month',
      cta2: 'Message on WhatsApp'
    },
    trustBar: {
      projects: '120+ projects',
      retention: '94% client retention',
      location: 'Baku and regions'
    },
    services: {
      heading: 'Our Services',
      subheading: 'The right solution for every business',
      badge: 'First month 50% off',
      viewAll: 'All services'
    },
    whyUs: {
      heading: 'Why B2Brand?',
      subheading: 'Real results, transparent pricing'
    },
    portfolio: {
      heading: 'Our Portfolio',
      subheading: 'Recent projects',
      viewAll: 'View all work'
    },
    finalCta: {
      heading: 'Ready to start with 50% off?',
      subheading: 'First month at half price! Get a free consultation.',
      button: 'Start now'
    },
    chat: {
      liveChatLabel: 'Live chat',
      headerTitle: 'Live consultation',
      headerSubtitle: 'Discuss your project, we\'ll pick a package',
      welcomeMessage: 'Hi! Want to grow your brand and discuss your project? Send a message for a free consultation and a package that fits your goals.',
      ctaGetConsultation: 'Get consultation',
      placeholderName: 'Your name',
      placeholderEmail: 'Email',
      placeholderMessage: 'What do you need help with? Describe your project, budget, or package',
      ctaSend: 'Send',
      sending: 'Sending...',
      thankYou: 'Thank you!',
      weWillContact: 'We\'ll contact you soon.',
      continueOnWhatsApp: 'Continue on WhatsApp'
    },
    howWeWork: {
      heading: 'How we work?',
      subheading: '4 steps to launch your project',
      step1Title: 'Brief & inquiry',
      step1Desc: 'Fill the brief or message us on WhatsApp. We learn your needs.',
      step2Title: 'Package choice',
      step2Desc: 'We suggest a package that fits. 50% off the first month.',
      step3Title: 'Kick-off',
      step3Desc: 'We agree on content plan and strategy. The team gets to work.',
      step4Title: 'Results',
      step4Desc: 'Monthly reports and ongoing support. Your brand grows.'
    },
    faq: {
      heading: 'Frequently asked questions',
      q1: 'Is the first meeting free?',
      a1: 'Yes. Consultation and package selection are free. Payment starts only after we agree.',
      q2: 'When will I see results?',
      a2: 'First content within 1–2 weeks. For steady SMM growth we recommend 2–3 months.',
      q3: 'Do you only serve Baku?',
      a3: 'Mostly yes, but online services (SMM, design, ads) are available across Azerbaijan.'
    },
    contactPage: {
      workingHoursTitle: 'Working hours',
      workingHoursText: 'Mon – Sat 10:00–19:00',
      responseTimeTitle: 'Response time',
      responseTimeText: 'We reply to inquiries within 24 hours.'
    },
    privacy: {
      metaTitle: 'Privacy Policy - B2Brand Creative Agency',
      metaDescription: 'Our privacy policy and data protection practices in accordance with Azerbaijan law',
      title: 'Məxfilik Siyasəti',
      lastUpdated: 'Son yenilənmə',
      intro: {
        title: 'Giriş',
        text: 'B2Brand Creative Agency olaraq şəxsi məlumatlarınızın təhlükəsizliyinə və məxfiliyinə böyük əhəmiyyət veririk. Bu siyasət sizin şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir.'
      },
      dataCollection: {
        title: 'Topladığımız Məlumatlar',
        intro: 'Biz aşağıdakı məlumatları toplayırıq:',
        item1: 'Ad, soyad və şirkət məlumatları',
        item2: 'Əlaqə məlumatları (email, telefon nömrəsi)',
        item3: 'Layihə tələbləri və məqsədləri',
        item4: 'Texniki məlumatlar (IP ünvanı, brauzer tipi)'
      },
      purpose: {
        title: 'Məlumatların İstifadə Məqsədi',
        item1: 'Xidmətlərimizin göstərilməsi və layihələrin idarə edilməsi',
        item2: 'Sizinlə əlaqə saxlamaq və məsləhətləşmələrin keçirilməsi',
        item3: 'Xidmətlərimizin təkmilləşdirilməsi',
        item4: 'Qanuni öhdəliklərin yerinə yetirilməsi'
      },
      legal: {
        title: 'Hüquqi Əsaslar',
        text: 'Şəxsi məlumatlarınızın emalı Azərbaycan Respublikasının "Şəxsi məlumatlar haqqında" Qanununa (11 may 2010-cu il, № 998-IIIQ) uyğun olaraq həyata keçirilir.',
        gdpr: 'Avropa İttifaqından olan ziyarətçilər üçün məlumatların emalı GDPR-a (General Data Protection Regulation) uyğun olaraq aparılır.'
      },
      storage: {
        title: 'Məlumatların Saxlanması',
        text: 'Şəxsi məlumatlarınız təhlükəsiz serverlərdə saxlanılır və qanunvericiliklə müəyyən edilmiş müddət ərzində mühafizə olunur. Müqavilə müddəti bitdikdən sonra məlumatlar təhlükəsiz şəkildə silinir və ya anonimləşdirilir.'
      },
      rights: {
        title: 'Sizin Hüquqlarınız',
        item1: 'Şəxsi məlumatlarınıza giriş hüququ',
        item2: 'Məlumatların düzəldilməsi və ya silinməsi tələbi',
        item3: 'Məlumatların emalına etiraz hüququ',
        item4: 'Şikayət vermək hüququ'
      },
      cookies: {
        title: 'Kukilər (Cookies)',
        text: 'Veb-saytımız istifadəçi təcrübəsini yaxşılaşdırmaq üçün kukilərdən istifadə edir. Siz brauzer parametrlərindən kukiləri idarə edə bilərsiniz.'
      },
      contact: {
        title: 'Bizimlə Əlaqə',
        text: 'Məxfilik siyasəti ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:'
      }
    },
    terms: {
      metaTitle: 'Terms of Service - B2Brand Creative Agency',
      metaDescription: 'Terms and conditions for using our services',
      title: 'İstifadəçi Razılaşması',
      lastUpdated: 'Son yenilənmə',
      acceptance: {
        title: 'Razılaşmanın Qəbulu',
        text: 'B2Brand Creative Agency-nin xidmətlərindən istifadə etməklə, siz bu şərtləri qəbul etdiyinizi təsdiq edirsiniz. Əgər bu şərtlərlə razı deyilsinizsə, xidmətlərimizdən istifadə etməməlisiniz.'
      },
      services: {
        title: 'Xidmətlərimiz',
        intro: 'B2Brand aşağıdakı xidmətləri təqdim edir:',
        item1: 'Sosial media marketinqi (SMM) və idarəetmə',
        item2: 'Video istehsal və montaj xidmətləri',
        item3: 'AI-əsaslı kontent yaradılması',
        item4: 'Brendinq və dizayn xidmətləri'
      },
      pricing: {
        title: 'Qiymətlər və Ödənişlər',
        text: 'İlk ay 50% endirim təklifi yalnız yeni müştərilər üçün etibarlıdır. Aylıq abunə ödənişləri hər ayın əvvəlində avtomatik çıxılır. Qiymətlər dəyişə bilər, lakin mövcud müştərilər üçün müqavilə müddəti ərzində qiymət dəyişməz.'
      },
      payment: {
        title: 'Ödəniş Şərtləri',
        intro: 'Ödənişlər ilə bağlı şərtlər:',
        item1: 'İlk ay üçün 50% endirim tətbiq edilir',
        item2: 'Aylıq ödənişlər hər ayın 1-də avtomatik həyata keçirilir',
        item3: 'Gec ödənişlər xidmətin dayandırılması ilə nəticələnə bilər'
      },
      ip: {
        title: 'İntellektual Mülkiyyət',
        text: 'Layihə tamamlandıqdan və tam ödəniş həyata keçirildikdən sonra, yaradılan materialların mülkiyyət hüququ müştəriyə keçir. B2Brand portfoliosunda istifadə hüququnu saxlayır.'
      },
      cancellation: {
        title: 'Ləğvetmə Şərtləri',
        text: 'Müştəri xidməti istənilən vaxt ləğv edə bilər. Ləğvetmə bildirişi 7 gün əvvəldən verilməlidir. Ödənilmiş dövr üçün geri qaytarma həyata keçirilmir.'
      },
      liability: {
        title: 'Məsuliyyət Məhdudiyyəti',
        text: 'B2Brand xidmətlərini peşəkar səviyyədə göstərməyə çalışır, lakin nəticələr üçün 100% zəmanət verə bilməz. Üçüncü tərəf platformalarının (Instagram, Facebook) qaydaları dəyişiklikləri bizim nəzarətimizdən kənardır.'
      },
      confidentiality: {
        title: 'Məxfilik',
        text: 'Hər iki tərəf layihə zamanı əldə edilən məlumatların məxfiliyini qorumağı öhdəsinə götürür. Müştəri məlumatları üçüncü şəxslərə ötürülmür.'
      },
      law: {
        title: 'Tətbiq Edilən Qanunvericillik',
        text: 'Bu razılaşma Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq tənzimlənir. Mübahisələr danışıqlar yolu ilə həll edilir, əks halda Bakı şəhər məhkəməsinə müraciət edilir.'
      },
      contact: {
        title: 'Əlaqə',
        text: 'Razılaşma ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:'
      }
    },
    cookies: {
      title: 'Kukilər haqqında',
      description: 'Biz veb-saytımızı yaxşılaşdırmaq və sizə daha yaxşı təcrübə təqdim etmək üçün kukilərdən istifadə edirik.',
      learnMore: 'Ətraflı',
      accept: 'Qəbul et',
      reject: 'Rədd et',
      close: 'Bağla'
    }
  }
};

// Оплату подключаем позже. Пока без Stripe — только бриф/заявка.
export const pricingPackages = [
  {
    id: 'starter',
    name: { az: 'Starter', ru: 'Стартер', en: 'Starter' },
    monthlyPrice: 1290,
    firstMonthPrice: 645,
    popular: false,
    stripePaymentLink: '' as string
  },
  {
    id: 'growth',
    name: { az: 'Growth', ru: 'Рост', en: 'Growth' },
    monthlyPrice: 1990,
    firstMonthPrice: 995,
    popular: true,
    stripePaymentLink: '' as string
  },
  {
    id: 'enterprise',
    name: { az: 'Enterprise', ru: 'Энтерпрайз', en: 'Enterprise' },
    monthlyPrice: 3490,
    firstMonthPrice: 1745,
    popular: false,
    stripePaymentLink: '' as string
  }
];

export const services = [
  {
    id: 'smm',
    icon: '📱',
    name: { az: 'SMM İdarəetmə', ru: 'SMM Управление', en: 'SMM Management' },
    description: { 
      az: 'Instagram, Facebook və TikTok hesablarınızın tam idarəsi. Kontent planı, dizayn və daimi yayımlar.',
      ru: 'Полное управление аккаунтами Instagram, Facebook и TikTok. Контент-план, дизайн и регулярные публикации.',
      en: 'Full management of Instagram, Facebook and TikTok accounts. Content plan, design and regular posts.'
    },
    monthlyPrice: 590,
    firstMonthPrice: 295
  },
  {
    id: 'video',
    icon: '🎥',
    name: { az: 'Video Çəkiliş', ru: 'Видеосъёмка', en: 'Video Production' },
    description: { 
      az: 'Reels, reklam videoları, korporativ çəkilişlər. Peşəkar kameraman və montaj.',
      ru: 'Reels, рекламные видео, корпоративные съёмки. Профессиональный оператор и монтаж.',
      en: 'Reels, promo videos, corporate shoots. Professional camera operator and editing.'
    },
    monthlyPrice: 890,
    firstMonthPrice: 445
  },
  {
    id: 'ai-content',
    icon: '🤖',
    name: { az: 'AI Kontent', ru: 'AI Контент', en: 'AI Content' },
    description: { 
      az: 'Süni intellekt ilə mətn yazma, şəkil yaratma və dizayn. Sürətli və keyfiyyətli.',
      ru: 'Написание текстов, создание изображений и дизайн с помощью ИИ. Быстро и качественно.',
      en: 'AI-powered copywriting, image generation and design. Fast and high-quality.'
    },
    monthlyPrice: 490,
    firstMonthPrice: 245
  },
  {
    id: 'targeting',
    icon: '🎯',
    name: { az: 'Target Reklam', ru: 'Таргетированная реклама', en: 'Targeted Ads' },
    description: { 
      az: 'Facebook, Instagram və Google reklamları. Kampaniya qurulması və optimallaşdırma.',
      ru: 'Реклама в Facebook, Instagram и Google. Настройка и оптимизация кампаний.',
      en: 'Facebook, Instagram and Google ads. Campaign setup and optimization.'
    },
    monthlyPrice: 690,
    firstMonthPrice: 345
  },
  {
    id: 'branding',
    icon: '✨',
    name: { az: 'Brendinq', ru: 'Брендинг', en: 'Branding' },
    description: { 
      az: 'Logo, brendbook, korporativ stil. Brendinizin tam kimliyi.',
      ru: 'Логотип, брендбук, корпоративный стиль. Полная идентичность бренда.',
      en: 'Logo, brand book, corporate identity. Complete brand identity.'
    },
    monthlyPrice: 1290,
    firstMonthPrice: 645
  },
  {
    id: 'photography',
    icon: '📸',
    name: { az: 'Foto Çəkiliş', ru: 'Фотосъёмка', en: 'Photography' },
    description: { 
      az: 'Məhsul, interyerlərin və korporativ fotosessiyalar. Professional çəkiliş və retuş.',
      ru: 'Продуктовая, интерьерная и корпоративная фотосъёмка. Профессиональная съёмка и ретушь.',
      en: 'Product, interior and corporate photography. Professional shooting and retouching.'
    },
    monthlyPrice: 590,
    firstMonthPrice: 295
  }
];

export const testimonials = [
  {
    id: 1,
    name: { az: 'Rəşad Məmmədov', ru: 'Рашад Мамедов', en: 'Rashad Mammadov' },
    company: { az: 'AutoPro Servis', ru: 'AutoPro Сервис', en: 'AutoPro Service' },
    text: { 
      az: '3 ay əvvəl B2Brand ilə işə başladıq. Instagram izləyicilər 2 dəfə artdı, müştəri sorğuları hər həftə gəlir. Qiymət də münasib, tövsiyə edirəm!',
      ru: 'Начали работать с B2Brand 3 месяца назад. Подписчики в Instagram выросли в 2 раза, заявки клиентов приходят каждую неделю. Цена разумная, рекомендую!',
      en: 'Started working with B2Brand 3 months ago. Instagram followers doubled, customer inquiries come every week. Price is reasonable, highly recommend!'
    },
    rating: 5
  },
  {
    id: 2,
    name: { az: 'Leyla Əliyeva', ru: 'Лейла Алиева', en: 'Leyla Aliyeva' },
    company: { az: 'Bella Beauty Salon', ru: 'Bella Beauty Salon', en: 'Bella Beauty Salon' },
    text: { 
      az: 'Video çəkilişlər əla oldu! Reels-lər min-min baxış alır. Komanda çox peşəkar və yaradıcı. İşlərindən razıyıq.',
      ru: 'Видеосъёмка получилась отличная! Reels набирают тысячи просмотров. Команда очень профессиональная и креативная. Довольны работой.',
      en: 'The video shoot turned out great! Reels are getting thousands of views. The team is very professional and creative. Very satisfied with the work.'
    },
    rating: 5
  },
  {
    id: 3,
    name: { az: 'Elvin Quliyev', ru: 'Эльвин Кулиев', en: 'Elvin Guliyev' },
    company: { az: 'TechStart MMC', ru: 'TechStart ООО', en: 'TechStart LLC' },
    text: { 
      az: 'Brendinq paketi aldıq - logo, brendbook, sosial media dizaynlar. Hər şey vaxtında və keyfiyyətlə hazırlandı. Startup üçün ideal variant.',
      ru: 'Взяли пакет брендинга - логотип, брендбук, дизайны для соцсетей. Всё подготовили вовремя и качественно. Идеальный вариант для стартапа.',
      en: 'Got the branding package - logo, brand book, social media designs. Everything was prepared on time and with quality. Perfect option for a startup.'
    },
    rating: 5
  }
];

export const portfolioItems = [
  {
    id: 1,
    title: { az: 'AutoPro Rebrendinq', ru: 'AutoPro Ребрендинг', en: 'AutoPro Rebranding' },
    category: { az: 'Brendinq & SMM', ru: 'Брендинг & SMM', en: 'Branding & SMM' },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
  },
  {
    id: 2,
    title: { az: 'Bella Salon Reklam Kampaniyası', ru: 'Рекламная кампания Bella Salon', en: 'Bella Salon Ad Campaign' },
    category: { az: 'Video & Target Reklam', ru: 'Видео & Таргет реклама', en: 'Video & Targeted Ads' },
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop'
  },
  {
    id: 3,
    title: { az: 'FreshMart Sosial Media', ru: 'FreshMart Социальные сети', en: 'FreshMart Social Media' },
    category: { az: 'SMM & Foto Çəkiliş', ru: 'SMM & Фотосъёмка', en: 'SMM & Photography' },
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'
  },
  {
    id: 4,
    title: { az: 'TechStart Branding', ru: 'TechStart Брендинг', en: 'TechStart Branding' },
    category: { az: 'Brendinq & AI Kontent', ru: 'Брендинг & AI Контент', en: 'Branding & AI Content' },
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
  }
];
