# Todo

## ✅ Completed - Production Sprint
- ✅ Security: Rate limiting on API endpoints (5 req/min for leads)
- ✅ Security: Security headers (CSP, X-Frame-Options, CORS)
- ✅ UX: Error boundary for React error handling
- ✅ UX: Toast notifications (sonner) for user feedback
- ✅ Performance: Lazy loading for all pages
- ✅ Performance: Database indexes on critical columns
- ✅ SEO: Sitemap.xml and robots.txt
- ✅ SEO: Structured data (Schema.org LocalBusiness)
- ✅ Accessibility: Skip to content link
- ✅ Accessibility: ARIA labels on Header navigation
- ✅ Accessibility: Focus management with visible focus rings
- ✅ Code Quality: Form validation hook
- ✅ Code Quality: Centralized toast notifications in all forms

## 🔴 Critical - B2B Agency Focus (ROI > 50)
- #1: Configure real Analytics tracking IDs (GA4, Meta Pixel, Yandex) - track lead conversions
- #2: Add conversion funnel tracking (Quiz start → Brief submit → WhatsApp click)
- #3: Implement email retry logic for failed lead notifications

## 🟡 High Priority - Lead Generation Optimization (ROI 10-50)
- #4: Add lead source tracking (UTM parameters, referrer)
- #5: Improve lead scoring with engagement metrics (time on site, pages viewed)
- #6: Add automated email sequences after brief submission
- #7: Split large components (Admin.tsx 1104 lines, Brief.tsx 681 lines)

## 🟢 Post-PMF - Technical Improvements (ROI < 10)
- #8: Add unit tests with Vitest for critical functions
- #9: Add E2E tests with Playwright for user journeys
- #10: Implement React Hook Form in forms
- #11: Add soft deletes (deleted_at column)
- #12: Add pagination to Admin panel tables
- #13: Add CSV export filters (date range, status)
- #14: Create design system documentation

## 💰 Cost Optimization Notes
**Current infrastructure: ~$0/month** (Cloudflare free tier)
- Workers: Free up to 100K req/day
- D1: Free up to 5GB storage
- R2: Free up to 10GB storage/month

**Break-even point:** 1 client project ($500+) covers all costs
**Focus:** Lead quality > infrastructure costs
