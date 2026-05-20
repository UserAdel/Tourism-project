import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Phone, Mail, MapPin, MessageCircle, Share2, Camera, Send } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const popularActivities = [
    { name: 'Orange Bay', slug: 'orange-bay' },
    { name: 'Luxor', slug: 'luxor' },
    { name: 'Grand Egyptian Museum', slug: 'grand-egyptian-museum' },
    { name: 'Swim with Dolphins', slug: 'swim-with-dolphins' }
  ];

  return (
    <footer className="bg-[var(--navy)] dark:bg-[var(--dark-page)] text-white border-t border-transparent dark:border-[var(--teal)]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-4">{t('footer.about')}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.aboutText')}
            </p>
          </div>

          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.activities')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-4">{t('footer.popular')}</h3>
            <ul className="space-y-2">
              {popularActivities.map((activity) => (
                <li key={activity.slug}>
                  <Link
                    to={`/activities/${activity.slug}`}
                    className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm"
                  >
                    {activity.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-[var(--turquoise)]" />
                <span className="text-gray-300 text-sm">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 text-[var(--turquoise)]" />
                <span className="text-gray-300 text-sm">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[var(--turquoise)]" />
                <span className="text-gray-300 text-sm">info@hurghadafrenchguide.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--turquoise)]" />
                <span className="text-gray-300 text-sm">Hurghada, Red Sea, Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Hurghada French Guide Excursions. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[var(--turquoise)] transition-colors"
                aria-label="Facebook"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[var(--turquoise)] transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[var(--turquoise)] transition-colors"
                aria-label="Twitter"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
