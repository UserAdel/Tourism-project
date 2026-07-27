import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Globe, Moon, Sun, ShieldCheck } from 'lucide-react';
import logoPath from '../assets/tourism/hurghada-french-guide-logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/activities', label: t('nav.activities') },
    // { path: '/about', label: t('nav.about') },
    // { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="public-header sticky top-0 z-50 border-b border-[rgba(11,83,97,0.12)] bg-[#F7FBFA]/95 shadow-md backdrop-blur-md transition-all duration-300 dark:border-[rgba(33,199,183,0.22)] dark:bg-[#102A3A]/95 dark:shadow-[0_4px_20px_rgba(3,14,20,0.55)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1 rounded-full bg-white dark:bg-white shadow-sm ring-2 ring-[var(--gold)]/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={logoPath}
                alt="Hurghada French Guide"
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-[var(--navy)] dark:text-[var(--ivory)] font-semibold text-xl leading-tight tracking-wide">
                Hurghada French Guide
              </div>
              <div className="text-[var(--gold)] text-xs tracking-widest uppercase font-medium">Excursions</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link relative transition-colors ${
                  isActive(link.path)
                    ? 'text-[var(--navy)] dark:text-[var(--turquoise)] font-semibold'
                    : 'text-[#3A4A6A] dark:text-[#A9C0CA] hover:text-[var(--navy)] dark:hover:text-[var(--turquoise)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[var(--sand)] dark:bg-[#173C4D] hover:bg-[var(--gold)]/20 dark:hover:bg-[var(--turquoise)]/15 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[var(--navy)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--turquoise)]" />
              )}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--sand)] dark:bg-[#173C4D] hover:bg-[var(--gold)]/20 dark:hover:bg-[var(--turquoise)]/15 transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-[var(--navy)] dark:text-[var(--turquoise)]" />
              <span className="font-medium text-[var(--navy)] dark:text-[var(--ivory)] uppercase text-sm">{language}</span>
            </button>

            <Link
              to="/activities"
              className="hidden sm:inline-flex items-center px-6 py-2.5 bg-[var(--navy)] dark:bg-[var(--gold)] text-[var(--ivory)] dark:text-[#041B4A] rounded-xl hover:bg-[#031035] dark:hover:bg-[#B8963F] transition-all shadow-lg hover:shadow-xl active:scale-95 font-medium text-sm tracking-wide"
            >
              {t('nav.bookNow')}
            </Link>

            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[var(--sand)] p-2.5 text-[var(--navy)] transition-all hover:bg-[var(--gold)]/20 dark:bg-[#173C4D] dark:text-[var(--turquoise)] dark:hover:bg-[var(--turquoise)]/15"
              aria-label="Admin dashboard"
              title="Admin dashboard"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--navy)] hover:text-[var(--gold)] dark:text-[var(--ivory)] dark:hover:text-[var(--turquoise)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-panel lg:hidden border-t border-[rgba(11,83,97,0.1)] bg-[#F7FBFA] dark:border-[rgba(33,199,183,0.18)] dark:bg-[#102A3A]">
          <nav className="flex flex-col px-4 py-4 gap-2" data-stagger data-stagger-step="45">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[var(--sand)] dark:bg-[rgba(33,199,183,0.12)] text-[var(--navy)] dark:text-[var(--turquoise)] font-semibold'
                    : 'text-[#3A4A6A] dark:text-[#A9C0CA] hover:bg-[var(--sand)] dark:hover:bg-[#173C4D]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-[var(--navy)] dark:bg-[var(--gold)] text-[var(--ivory)] dark:text-[#041B4A] rounded-lg text-center font-semibold hover:bg-[#031035] dark:hover:bg-[#B8963F] transition-colors mt-2"
            >
              {t('nav.bookNow')}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-[#3A4A6A] hover:bg-[var(--sand)] dark:text-[#A9C0CA] dark:hover:bg-[#173C4D] dark:hover:text-[var(--turquoise)]"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
