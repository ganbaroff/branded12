import { Link } from 'react-router';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { translations, type Language } from '@/react-app/data/content';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/services', label: t.nav.services },
    { 
      href: '/portfolio', 
      label: language === 'az' ? 'Portfolio' : language === 'ru' ? 'Портфолио' : 'Portfolio'
    },
    { 
      href: '/cases', 
      label: language === 'az' ? 'Keyslar' : language === 'ru' ? 'Кейсы' : 'Cases'
    },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/contact', label: t.nav.contact }
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'az', label: 'AZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="B2Brand Creative Agency - Home">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D00] to-[#FF6B00] rounded-lg flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-xl">B2</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">B2Brand</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white/80 hover:text-[#FF4D00] transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] rounded-sm px-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <div role="group" aria-label="Language selector">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D00] ${
                    language === lang.code
                      ? 'bg-[#FF4D00] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label={`Switch to ${lang.label}`}
                  aria-current={language === lang.code ? 'true' : 'false'}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2 p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00] rounded-lg"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/5" id="mobile-menu" role="menu">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-white/80 hover:text-[#FF4D00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4D00] rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
