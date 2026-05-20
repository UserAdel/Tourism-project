import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import logoPath from '../assets/tourism/WhatsApp_Image_2026-05-17_at_3.34.53_PM.jpeg';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/activities', label: t('nav.activities') },
    { path: '/about', label: t('nav.about') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[var(--dark-page)]/95 backdrop-blur-md shadow-md dark:shadow-[var(--shadow-cyan-soft)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoPath} alt="Hurghada French Guide" className="h-14 w-14 rounded-full" />
            <div className="hidden sm:block">
              <div className="text-[var(--teal)] font-semibold text-lg leading-tight">
                Hurghada French Guide
              </div>
              <div className="text-[var(--gold)] text-xs">Excursions</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? 'text-[var(--teal)] font-medium'
                    : 'text-gray-700 hover:text-[var(--teal)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[var(--sand)] dark:bg-[var(--muted)] hover:bg-[var(--gold)] dark:hover:bg-[var(--teal)] transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[var(--teal)] dark:text-[var(--gold)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--gold)]" />
              )}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--sand)] dark:bg-[var(--muted)] hover:bg-[var(--gold)] dark:hover:bg-[var(--teal)] transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-[var(--teal)] dark:text-[var(--gold)]" />
              <span className="font-medium text-[var(--navy)] dark:text-white uppercase">{language}</span>
            </button>

            <Link
              to="/book"
              className="hidden sm:inline-flex items-center px-6 py-2.5 bg-[var(--teal)] text-white rounded-xl hover:bg-[var(--teal-dark)] transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              {t('nav.bookNow')}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[var(--teal)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[var(--dark-page)]">
          <nav className="flex flex-col px-4 py-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[var(--sand)] text-[var(--teal)] font-medium'
                    : 'text-gray-700 hover:bg-[var(--sand)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-[var(--teal)] text-white rounded-lg text-center font-medium hover:bg-[var(--teal-dark)] transition-colors mt-2"
            >
              {t('nav.bookNow')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
