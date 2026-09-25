import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useActivities } from '../hooks/queries';
import { Phone, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { socialProfiles } from '../data/socialProfiles';
import SocialPlatformIcon from './SocialPlatformIcon';

export default function Footer() {
  const { t, language } = useLanguage();
  const { data: activities } = useActivities();

  const popularActivities = useMemo(() => {
    const priorityKeywords = [
      'orange-bay',
      'luxor',
      'grand-egyptian-museum',
      'swim-with-dolphins',
    ];

    if (!activities || activities.length === 0) {
      return [
        {
          name: language === 'fr' ? 'Excursion Orange Bay' : 'Orange Bay Island',
          slug: 'orange-bay-island-snorkeling-cruise',
        },
        {
          name: language === 'fr' ? 'Excursion Louxor' : 'Luxor Day Trip',
          slug: 'luxor-day-trip-by-minivan',
        },
        {
          name: language === 'fr' ? 'Grand Musée Égyptien' : 'Grand Egyptian Museum',
          slug: 'cairo-grand-egyptian-museum-day-trip-van-option',
        },
        {
          name: language === 'fr' ? 'Nager avec les Dauphins' : 'Swim with Dolphins',
          slug: 'swim-with-dolphins-experience',
        },
      ];
    }

    const matched: typeof activities = [];

    // Prioritize popular activities matching keywords
    for (const keyword of priorityKeywords) {
      const found = activities.find(
        (act) => act.slug.includes(keyword) && !matched.some((m) => m.id === act.id)
      );
      if (found) {
        matched.push(found);
      }
    }

    // Fill any remaining slots with featured activities from database
    if (matched.length < 4) {
      const rest = activities.filter(
        (act) => act.featured && !matched.some((m) => m.id === act.id)
      );
      matched.push(...rest.slice(0, 4 - matched.length));
    }

    return matched.slice(0, 4).map((activity) => ({
      name: activity.name[language] || activity.name.en || activity.name.fr,
      slug: activity.slug,
    }));
  }, [activities, language]);

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
                    className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm line-clamp-1 block"
                    title={activity.name}
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
                <Phone className="w-4 h-4 mt-0.5 text-[var(--turquoise)] flex-shrink-0" />
                <a
                  href="tel:+201234567890"
                  className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm"
                >
                  +20 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaWhatsapp className="w-4 h-4 mt-0.5 text-[var(--turquoise)] flex-shrink-0" />
                <a
                  href="https://wa.me/201234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm"
                >
                  +20 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[var(--turquoise)] flex-shrink-0" />
                <a
                  href="mailto:info@hurghadafrenchguide.com"
                  className="text-gray-300 hover:text-[var(--turquoise)] transition-colors text-sm"
                >
                  info@hurghadafrenchguide.com
                </a>
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
