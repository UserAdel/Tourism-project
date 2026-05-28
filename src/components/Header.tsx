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
    { path: '/about', label: t('nav.about') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(4,27,74,0.08)] bg-[#F9F5EE]/95 shadow-md backdrop-blur-md transition-all duration-300 dark:border-[rgba(201,168,92,0.1)] dark:bg-[#040E26]/95 dark:shadow-[0_4px_12px_rgba(201,168,92,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoPath}
              alt="Hurghada French Guide"
              className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-[var(--gold)]/30"
            />
            <div className="hidden sm:block">
              <div className="text-[var(--navy)] dark:text-[var(--ivory)] font-semibold text-lg leading-tight tracking-wide">
                Hurghada French Guide
              </div>
              <div className="text-[var(--gold)] text-xs tracking-widest uppercase">Excursions</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? 'text-[var(--navy)] dark:text-[var(--gold)] font-semibold'
                    : 'text-[#3A4A6A] dark:text-[#C7D0DE] hover:text-[var(--navy)] dark:hover:text-[var(--gold)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[var(--sand)] dark:bg-[#0B1E42] hover:bg-[var(--gold)]/20 dark:hover:bg-[var(--gold)]/20 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[var(--navy)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--gold)]" />
              )}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--sand)] dark:bg-[#0B1E42] hover:bg-[var(--gold)]/20 dark:hover:bg-[var(--gold)]/20 transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-[var(--navy)] dark:text-[var(--gold)]" />
              <span className="font-medium text-[var(--navy)] dark:text-[var(--ivory)] uppercase text-sm">{language}</span>
            </button>

            <Link
              to="/book"
              className="hidden sm:inline-flex items-center px-6 py-2.5 bg-[var(--navy)] dark:bg-[var(--gold)] text-[var(--ivory)] dark:text-[#041B4A] rounded-xl hover:bg-[#031035] dark:hover:bg-[#B8963F] transition-all shadow-lg hover:shadow-xl active:scale-95 font-medium text-sm tracking-wide"
            >
              {t('nav.bookNow')}
            </Link>

            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[var(--sand)] p-2.5 text-[var(--navy)] transition-all hover:bg-[var(--gold)]/20 dark:bg-[#0B1E42] dark:text-[var(--gold)] dark:hover:bg-[var(--gold)]/20"
              aria-label="Admin dashboard"
              title="Admin dashboard"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--navy)] hover:text-[var(--gold)] dark:text-[var(--ivory)] dark:hover:text-[var(--gold)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(4,27,74,0.08)] bg-[#F9F5EE] dark:border-[rgba(201,168,92,0.1)] dark:bg-[#040E26]">
          <nav className="flex flex-col px-4 py-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[var(--sand)] dark:bg-[#0B1E42] text-[var(--navy)] dark:text-[var(--gold)] font-semibold'
                    : 'text-[#3A4A6A] dark:text-[#C7D0DE] hover:bg-[var(--sand)] dark:hover:bg-[#0B1E42]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-[var(--navy)] dark:bg-[var(--gold)] text-[var(--ivory)] dark:text-[#041B4A] rounded-lg text-center font-semibold hover:bg-[#031035] dark:hover:bg-[#B8963F] transition-colors mt-2"
            >
              {t('nav.bookNow')}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-[#3A4A6A] hover:bg-[var(--sand)] dark:text-[#C7D0DE] dark:hover:bg-[#0B1E42]"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
