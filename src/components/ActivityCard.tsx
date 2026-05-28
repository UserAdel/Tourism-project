import { Link } from 'react-router-dom';
import type { Activity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Clock, Users, MapPin } from 'lucide-react';
import { getPrimaryPricingField } from '../utils/pricing';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { language, t } = useLanguage();
  const primaryPricing = getPrimaryPricingField(activity);
  const isPrivatePrice = primaryPricing?.id === 'private';

  return (
    <Link
      to={`/activities/${activity.slug}`}
      className="group bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:hover:shadow-[0_10px_40px_rgba(201,168,92,0.2)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={activity.imageUrl}
          alt={activity.name[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold mb-1">{activity.name[language]}</h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Clock className="w-4 h-4" />
            <span>{activity.duration}</span>
          </div>
        </div>
        {activity.featured && (
          <div className="absolute top-4 right-4 bg-[var(--gold)] text-[var(--navy)] px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {activity.description[language]}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[var(--teal)] text-2xl font-semibold">
              €{primaryPricing?.price ?? 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
              {isPrivatePrice ? t('pricing.perGroup') : t('pricing.perPerson')}
            </span>
          </div>
          <div className="flex gap-2">
            {activity.pickupIncluded && (
              <div className="p-2 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-lg transition-colors" title="Pickup Included">
                <MapPin className="w-4 h-4 text-[var(--teal)]" />
              </div>
            )}
            {activity.childFriendly && (
              <div className="p-2 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-lg transition-colors" title="Child Friendly">
                <Users className="w-4 h-4 text-[var(--teal)]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
