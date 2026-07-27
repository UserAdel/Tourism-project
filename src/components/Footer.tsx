import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { socialProfiles } from '../data/socialProfiles';
import SocialPlatformIcon from './SocialPlatformIcon';

export default function Footer() {
  const { t } = useLanguage();

  const popularActivities = [
    { name: 'Orange Bay', slug: 'orange-bay' },
    { name: 'Luxor', slug: 'luxor' },
    { name: 'Grand Egyptian Museum', slug: 'grand-egyptian-museum' },
    { name: 'Swim with Dolphins', slug: 'swim-with-dolphins' }
  ];

  return (
    <footer className="bg-[var(--navy)] dark:bg-[#061533] text-white border-t border-transparent dark:border-[rgba(33,199,183,0.14)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" data-stagger>
          <div data-reveal="up">
            <h3 className="text-[var(--gold)] font-semibold mb-4">{t('footer.about')}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.aboutText')}
            </p>
          </div>

          <div data-reveal="up">
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
                <Link to="/contact" className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div data-reveal="up">
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

          <div data-reveal="up">
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

        <div className="border-t border-white/10 pt-8 mt-8" data-reveal="fade">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Hurghada French Guide Excursions. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-2" aria-label={t('footer.followUs')}>
              {socialProfiles.map((profile) => (
                <a
                  key={profile.id}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-gray-300 hover:bg-white/10 hover:text-[var(--turquoise)]"
                  aria-label={`${profile.name}: ${profile.handle}`}
                  title={`${profile.name} ${profile.handle}`}
                >
                  <SocialPlatformIcon id={profile.id} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
