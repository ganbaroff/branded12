/**
 * Track user engagement metrics for lead scoring
 * Stores in sessionStorage to persist across page navigations
 */

export interface EngagementMetrics {
  timeOnSite: number; // seconds
  pagesViewed: number;
  scrollDepth: number; // 0-100 percentage
  quizCompleted: boolean;
  returnVisit: boolean;
  interactions: number; // clicks, form interactions, etc.
}

const SESSION_START_KEY = 'b2brand_session_start';
const PAGES_VIEWED_KEY = 'b2brand_pages_viewed';
const LAST_VISIT_KEY = 'b2brand_last_visit';

// Initialize session tracking
if (typeof window !== 'undefined') {
  const sessionStart = sessionStorage.getItem(SESSION_START_KEY);
  if (!sessionStart) {
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }

  // Check for return visit
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  if (lastVisit) {
    // Mark as return visit if last visit was more than 30 minutes ago
    const timeSinceLastVisit = Date.now() - parseInt(lastVisit);
    if (timeSinceLastVisit > 30 * 60 * 1000) {
      sessionStorage.setItem('b2brand_return_visit', 'true');
    }
  }
  localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());

  // Track pages viewed
  const pagesViewed = parseInt(sessionStorage.getItem(PAGES_VIEWED_KEY) || '0');
  sessionStorage.setItem(PAGES_VIEWED_KEY, (pagesViewed + 1).toString());

  // Track scroll depth
  let maxScrollDepth = parseInt(sessionStorage.getItem('b2brand_max_scroll') || '0');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      sessionStorage.setItem('b2brand_max_scroll', maxScrollDepth.toString());
    }
  }, { passive: true });

  // Track interactions (clicks, form fields, etc.)
  let interactions = parseInt(sessionStorage.getItem('b2brand_interactions') || '0');
  document.addEventListener('click', () => {
    interactions++;
    sessionStorage.setItem('b2brand_interactions', interactions.toString());
  }, { once: false });
}

export function getEngagementMetrics(): EngagementMetrics {
  if (typeof window === 'undefined') {
    return {
      timeOnSite: 0,
      pagesViewed: 0,
      scrollDepth: 0,
      quizCompleted: false,
      returnVisit: false,
      interactions: 0
    };
  }

  const sessionStart = parseInt(sessionStorage.getItem(SESSION_START_KEY) || '0');
  const timeOnSite = sessionStart > 0 ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
  const pagesViewed = parseInt(sessionStorage.getItem(PAGES_VIEWED_KEY) || '1');
  const scrollDepth = parseInt(sessionStorage.getItem('b2brand_max_scroll') || '0');
  const quizCompleted = sessionStorage.getItem('b2brand_quiz_completed') === 'true';
  const returnVisit = sessionStorage.getItem('b2brand_return_visit') === 'true';
  const interactions = parseInt(sessionStorage.getItem('b2brand_interactions') || '0');

  return {
    timeOnSite,
    pagesViewed,
    scrollDepth,
    quizCompleted,
    returnVisit,
    interactions
  };
}

export function markQuizCompleted(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('b2brand_quiz_completed', 'true');
  }
}
