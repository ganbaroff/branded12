import { useEffect } from 'react';
import { useLocation } from 'react-router';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ym?: (...args: any[]) => void;
  }
}

// TODO: Replace with actual tracking IDs (or use import.meta.env.VITE_GA_ID etc.)
// 1. Create GA4 property: https://analytics.google.com → Get tracking ID (format: G-XXXXXXXXXX)
// 2. Create Meta Pixel: https://business.facebook.com → Events Manager → Create Pixel
// 3. Create Yandex Metrika: https://metrika.yandex.ru → Add counter → Get ID
const GA_TRACKING_ID = import.meta.env.VITE_GA_ID ?? 'G-XXXXXXXXXX';
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID ?? 'XXXXXXXXXX';
const YM_COUNTER_ID = import.meta.env.VITE_YM_ID ?? 'XXXXXXXX';

// Only init analytics when ID is set and not a placeholder (avoids "Invalid PixelID: null" and useless scripts)
const isInvalidId = (id: string) => !id || id === 'null' || id === 'undefined';
const isPlaceholder = (id: string, pattern: RegExp) => isInvalidId(id) || pattern.test(id);
const hasValidGa = !isPlaceholder(GA_TRACKING_ID, /^G-X+$/i);
const hasValidFb = !isPlaceholder(FB_PIXEL_ID, /^X+$/i);
const hasValidYm = !isPlaceholder(YM_COUNTER_ID, /^X+$/i);

export default function Analytics() {
  const location = useLocation();

  // Initialize Google Analytics (only when real ID is set)
  useEffect(() => {
    if (!hasValidGa) return;
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer!.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);
    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
    };
  }, []);

  // Initialize Meta Pixel (only when real ID is set — avoids "Invalid PixelID: null")
  useEffect(() => {
    if (!hasValidFb) return;
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
    window.fbq!('init', FB_PIXEL_ID);
    window.fbq!('track', 'PageView');
  }, []);

  // Initialize Yandex Metrika (only when real ID is set)
  useEffect(() => {
    if (!hasValidYm) return;
    (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
      m[i] = m[i] || function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
      m[i].l = 1 * new Date().getTime();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(
      window,
      document,
      'script',
      'https://mc.yandex.ru/metrika/tag.js',
      'ym'
    );
    window.ym!(YM_COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }, []);

  // Track page views on route change (only for inited providers)
  useEffect(() => {
    if (hasValidGa && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: location.pathname + location.search,
      });
    }
    if (hasValidFb && window.fbq) {
      window.fbq('track', 'PageView');
    }
    if (hasValidYm && window.ym) {
      window.ym(YM_COUNTER_ID, 'hit', location.pathname + location.search);
    }
  }, [location]);

  return null;
}

// Track custom events (only inited providers)
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (hasValidGa && window.gtag) {
    window.gtag('event', eventName, params);
  }
  if (hasValidFb && window.fbq) {
    window.fbq('track', eventName, params);
  }
  if (hasValidYm && window.ym) {
    window.ym(YM_COUNTER_ID, 'reachGoal', eventName, params);
  }
};

// Predefined conversion events
export const trackBriefSubmit = (packageName?: string) => {
  trackEvent('BriefSubmit', { package: packageName });
};

export const trackQuizComplete = (recommendedPackage: string) => {
  trackEvent('QuizComplete', { recommended_package: recommendedPackage });
};

export const trackWhatsAppClick = () => {
  trackEvent('WhatsAppClick');
};

export const trackPackageView = (packageName: string) => {
  trackEvent('ViewPackage', { package: packageName });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent('ViewService', { service: serviceName });
};
