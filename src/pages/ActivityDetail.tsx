import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities } from '../data/activities';
import Button from '../components/Button';
import ActivityCard from '../components/ActivityCard';
import {
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { formatPricingLabel, getPrimaryPricingField, getPricingFields } from '../utils/pricing';

export default function ActivityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const activity = activities.find((a) => a.slug === slug);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('common.notFound')}
          </h1>
          <Link to="/activities">
            <Button>{t('common.backHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedActivities = activities
    .filter((a) => a.category === activity.category && a.id !== activity.id)
    .slice(0, 3);
  const pricingFields = getPricingFields(activity);
  const primaryPricing = getPrimaryPricingField(activity);
  const isPrivatePrice = primaryPricing?.id === 'private';
  const highlights = (activity.highlights?.[language] ?? []).filter(Boolean);
  const includedItems = (activity.included?.[language] ?? []).filter(Boolean);
  const excludedItems = (activity.excluded?.[language] ?? []).filter(Boolean);
  const ageRestriction = activity.ageRestrictions?.[language]?.trim() ?? '';
  const hasRestrictions = Boolean(ageRestriction || activity.maxWeight);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <img
          src={activity.imageUrl}
          alt={activity.name[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white mb-4 hover:text-[var(--gold)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'en' ? 'Back' : 'Retour'}
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {activity.name[language]}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{activity.duration}</span>
              </div>
              {activity.pickupIncluded && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{language === 'en' ? 'Pickup Included' : 'Transfert Inclus'}</span>
                </div>
              )}
              {activity.childFriendly && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{language === 'en' ? 'Family Friendly' : 'Adapté aux Familles'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                {t('activity.overview')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {activity.description[language]}
              </p>
            </div>

            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                  {t('activity.highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--teal)] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">
                {t('activity.pricing')}
              </h2>
              <div className="space-y-4">
                {pricingFields.map((field, index) => (
                  <div key={`${field.id ?? field.name.en}-${index}`} className="flex items-center justify-between p-4 bg-[var(--sand)] rounded-xl">
                    <span className="font-medium text-[var(--navy)]">{formatPricingLabel(field, language)}</span>
                    <span className="text-2xl font-bold text-[var(--teal)]">€{field.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {includedItems.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                  {t('activity.included')}
                </h2>
                <ul className="space-y-2">
                  {includedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {excludedItems.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                  {t('activity.excluded')}
                </h2>
                <ul className="space-y-2">
                  {excludedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasRestrictions && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">
                  {t('activity.ageRestrictions')}
                </h2>
                {ageRestriction && <p className="text-gray-700">{ageRestriction}</p>}
                {activity.maxWeight && (
                  <p className="text-gray-700 mt-2">
                    {language === 'en' ? 'Maximum weight: ' : 'Poids maximum: '}
                    {activity.maxWeight}kg
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border-2 border-[var(--gold)]">
              <div className="text-center mb-6">
                <div className="text-[var(--teal)] text-4xl font-bold mb-2">
                  €{primaryPricing?.price ?? 0}
                </div>
                <div className="text-gray-500">
                  {isPrivatePrice ? t('pricing.perGroup') : t('pricing.perPerson')}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {activity.startTime && activity.endTime && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-[var(--teal)]" />
                    <span>
                      {activity.startTime} - {activity.endTime}
                    </span>
                  </div>
                )}
                {activity.pickupIncluded && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Hotel pickup included' : 'Transfert hôtel inclus'}</span>
                  </div>
                )}
                {activity.availableDaily !== false && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Available daily' : 'Disponible quotidiennement'}</span>
                  </div>
                )}
                {activity.freeCancellation !== false && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Shield className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Free cancellation' : 'Annulation gratuite'}</span>
                  </div>
                )}
              </div>

              <Link to={`/book?activity=${activity.slug}`}>
                <Button className="w-full mb-3">
                  {t('activity.bookThisActivity')}
                </Button>
              </Link>

              <a
                href={`https://wa.me/201234567890?text=${encodeURIComponent(
                  `Hi, I'm interested in ${activity.name.en}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('hero.whatsapp')}
                </Button>
              </a>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  {language === 'en'
                    ? 'Instant confirmation via WhatsApp'
                    : 'Confirmation instantanée via WhatsApp'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {relatedActivities.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-8">
              {t('activity.relatedActivities')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
