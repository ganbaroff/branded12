import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/react-app/hooks/useLanguage";
import { ErrorBoundary } from "@/react-app/components/ErrorBoundary";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import ChatWidget from "@/react-app/components/ChatWidget";
import ExitIntentPopup from "@/react-app/components/ExitIntentPopup";
import FloatingActions from "@/react-app/components/FloatingActions";
import Analytics from "@/react-app/components/Analytics";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import StructuredData from "@/react-app/components/StructuredData";
import SkipToContent from "@/react-app/components/SkipToContent";
import ScrollToTop from "@/react-app/components/ScrollToTop";

// Lazy load pages for better performance
const HomePage = lazy(() => import("@/react-app/pages/Home"));
const ServicesPage = lazy(() => import("@/react-app/pages/Services"));
const PricingPage = lazy(() => import("@/react-app/pages/Pricing"));
const ContactPage = lazy(() => import("@/react-app/pages/Contact"));
const BriefPage = lazy(() => import("@/react-app/pages/Brief"));
const AdminPage = lazy(() => import("@/react-app/pages/Admin"));
const PortfolioPage = lazy(() => import("@/react-app/pages/Portfolio"));
const PortfolioDetailPage = lazy(() => import("@/react-app/pages/PortfolioDetail"));
const CasesPage = lazy(() => import("@/react-app/pages/Cases"));
const QuizPage = lazy(() => import("@/react-app/pages/Quiz"));
const BlogPage = lazy(() => import("@/react-app/pages/Blog"));
const BlogPostPage = lazy(() => import("@/react-app/pages/BlogPost"));
const NotFoundPage = lazy(() => import("@/react-app/pages/NotFound"));

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
            <ScrollToTop />
            <SkipToContent />
            <div className="min-h-screen bg-[#0F0F0F]">
              <Header />
              <Suspense fallback={<LoadingSpinner />}>
                <main id="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/brief" element={<BriefPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
                  <Route path="/cases" element={<CasesPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                </main>
              </Suspense>
              <Footer />
              <FloatingActions />
              <ChatWidget />
              <ExitIntentPopup />
              <Analytics />
              <StructuredData />
              <Toaster position="top-right" />
            </div>
          </Router>
        </LanguageProvider>
    </ErrorBoundary>
  );
}
