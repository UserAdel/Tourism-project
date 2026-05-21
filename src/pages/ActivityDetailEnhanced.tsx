import { type FormEvent, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities as fallbackActivities } from '../data/activities';
import { activityGalleries, activityVideos } from '../data/activityMedia';
import Button from '../components/Button';
import ActivityCard from '../components/ActivityCard';
import ImageGallery from '../components/ImageGallery';
import VideoGallery from '../components/VideoGallery';
import Testimonials from '../components/Testimonials';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useActivities, useActivity, useCreateActivityReview } from '../hooks/queries';
import { normalizeActivity } from '../utils/activityImages';
import { formatPricingLabel, getPrimaryPricingField, getPricingFields } from '../utils/pricing';
import {
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Baby,
  Weight,
  Shield,
  Star
} from 'lucide-react';

const reviewCountries = [
  '🇦🇪 United Arab Emirates',
  '🇦🇷 Argentina',
  '🇦🇺 Australia',
  '🇦🇹 Austria',
  '🇧🇪 Belgium',
  '🇧🇷 Brazil',
  '🇧🇬 Bulgaria',
  '🇨🇦 Canada',
  '🇨🇱 Chile',
  '🇨🇳 China',
  '🇨🇴 Colombia',
  '🇭🇷 Croatia',
  '🇨🇿 Czech Republic',
  '🇩🇰 Denmark',
  '🇪🇬 Egypt',
  '🇫🇷 France',
  '🇫🇮 Finland',
  '🇩🇪 Germany',
  '🇬🇷 Greece',
  '🇭🇺 Hungary',
  '🇮🇳 India',
  '🇮🇩 Indonesia',
  '🇮🇪 Ireland',
  '🇮🇹 Italy',
  '🇯🇵 Japan',
  '🇯🇴 Jordan',
  '🇰🇼 Kuwait',
  '🇱🇧 Lebanon',
  '🇱🇺 Luxembourg',
  '🇲🇽 Mexico',
  '🇲🇦 Morocco',
  '🇳🇱 Netherlands',
  '🇳🇿 New Zealand',
  '🇳🇴 Norway',
  '🇵🇱 Poland',
  '🇵🇹 Portugal',
  '🇶🇦 Qatar',
  '🇷🇴 Romania',
  '🇸🇦 Saudi Arabia',
  '🇷🇸 Serbia',
  '🇸🇬 Singapore',
  '🇿🇦 South Africa',
  '🇰🇷 South Korea',
  '🇪🇸 Spain',
  '🇸🇪 Sweden',
  '🇨🇭 Switzerland',
  '🇹🇳 Tunisia',
  '🇹🇷 Turkey',
  '🇬🇧 United Kingdom',
  '🇺🇸 United States',
  'Other',
];
const defaultReviewCountry = '';

function extractYouTubeId(url: string) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ];

  return patterns.map((pattern) => url.match(pattern)?.[1]).find(Boolean);
}

function youtubeThumbnailUrl(youtubeId: string | undefined) {
  return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '';
}

export default function ActivityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const fallbackActivityList = fallbackActivities.map(normalizeActivity);
  const { data: apiActivity } = useActivity(slug);
  const { data: apiActivities } = useActivities();
  const createReview = useCreateActivityReview(slug);
  const [reviewName, setReviewName] = useState('');
  const [reviewCountry, setReviewCountry] = useState(defaultReviewCountry);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCountryDropdownOpen(false);
  }, [slug]);

  const activities = apiActivities ?? fallbackActivityList;
  const activity = apiActivity ?? fallbackActivityList.find((a) => a.slug === slug);
  const isApiActivity = Boolean(apiActivity);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[var(--dark-page)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
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

  const gallery = isApiActivity
    ? activity.galleryImages ?? []
    : activity.galleryImages?.length
      ? activity.galleryImages
      : activityGalleries[activity.slug] || [];
  const videos = activity.videoHighlights?.length
    ? activity.videoHighlights.map((video, index) => {
        const youtubeId = video.youtubeId || extractYouTubeId(video.youtubeUrl);

        return {
          id: video.id || `${activity.slug}-video-${index + 1}`,
          thumbnail: video.thumbnail || youtubeThumbnailUrl(youtubeId),
          title: video.title,
          youtubeId,
        };
      })
    : isApiActivity
      ? []
      : activityVideos[activity.slug] || [];
  const pricingFields = getPricingFields(activity);
  const primaryPricing = getPrimaryPricingField(activity);
  const isPrivatePrice = primaryPricing?.id === 'private';
  const reviews = activity.reviews ?? [];
  const highlights = (activity.highlights?.[language] ?? []).filter(Boolean);
  const includedItems = (activity.included?.[language] ?? []).filter(Boolean);
  const excludedItems = (activity.excluded?.[language] ?? []).filter(Boolean);
  const ageRestriction = activity.ageRestrictions?.[language]?.trim() ?? '';
  const hasRequirements = Boolean(ageRestriction || activity.maxWeight || activity.maxCapacity);
  const testimonials = reviews.map((review) => ({
    id: review._id,
    name: review.name,
    nationality: review.country || (language === 'en' ? 'Unknown country' : 'Pays inconnu'),
    rating: review.rating,
    text: review.comment,
    date: review.date || (review.createdAt
      ? new Date(review.createdAt).toLocaleDateString(
          language === 'en' ? 'en-US' : 'fr-FR',
          { month: 'short', year: 'numeric' }
        )
      : ''),
  }));
  const countrySearch = reviewCountry.trim().toLowerCase();
  const filteredReviewCountries = reviewCountries
    .filter((country) => country.toLowerCase().includes(countrySearch))
    .slice(0, 12);

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createReview.mutateAsync({
        name: reviewName,
        country: reviewCountry,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewName('');
      setReviewCountry(defaultReviewCountry);
      setIsCountryDropdownOpen(false);
      setReviewRating(5);
      setReviewComment('');
      toast.success(language === 'en' ? 'Review added' : 'Avis ajouté');
    } catch {
      toast.error(language === 'en' ? 'Could not add review' : "Impossible d'ajouter l'avis");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[var(--dark-page)] min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={activity.imageUrl}
          alt={activity.name[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white mb-4 hover:text-[var(--gold)] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {language === 'en' ? 'Back' : 'Retour'}
            </button>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {activity.name[language]}
            </motion.h1>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 text-white/90"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{activity.duration}</span>
              </div>
              {activity.pickupIncluded && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{language === 'en' ? 'Pickup Included' : 'Transfert Inclus'}</span>
                </div>
              )}
              {activity.childFriendly && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4" />
                  <span>{language === 'en' ? 'Family Friendly' : 'Adapté aux Familles'}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                {t('activity.overview')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {activity.description[language]}
              </p>
            </motion.div>

            {highlights.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-[var(--teal)] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {hasRequirements && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
                  {t('activity.ageRestrictions')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ageRestriction && (
                    <div className="flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[var(--dark-muted)] rounded-xl">
                      <div className="w-10 h-10 bg-[var(--teal)] rounded-full flex items-center justify-center flex-shrink-0">
                        <Baby className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                          {language === 'en' ? 'Age Requirements' : 'Exigences d\'Âge'}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {ageRestriction}
                        </p>
                      </div>
                    </div>
                  )}
                {activity.maxWeight && (
                  <div className="flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[var(--dark-muted)] rounded-xl">
                    <div className="w-10 h-10 bg-[var(--gold)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Weight className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                        {language === 'en' ? 'Weight Limit' : 'Limite de Poids'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {language === 'en' ? 'Maximum' : 'Maximum'}: {activity.maxWeight}kg
                      </p>
                    </div>
                  </div>
                )}
                {activity.maxCapacity && (
                  <div className="flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[var(--dark-muted)] rounded-xl">
                    <div className="w-10 h-10 bg-[var(--turquoise)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                        {language === 'en' ? 'Group Capacity' : 'Capacité du Groupe'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {language === 'en' ? 'Up to' : 'Jusqu\'à'} {activity.maxCapacity} {language === 'en' ? 'people' : 'personnes'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
                {t('activity.pricing')}
              </h2>
              <div className="space-y-4">
                {pricingFields.map((field, index) => (
                  <div key={`${field.id ?? field.name.en}-${index}`} className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--sand)] to-white dark:from-[var(--dark-muted)] dark:to-[var(--dark-section)] rounded-xl border border-[var(--gold)]/20">
                    <span className="font-medium text-[var(--navy)] dark:text-white">{formatPricingLabel(field, language)}</span>
                    <span className="text-2xl font-bold text-[var(--teal)]">€{field.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {includedItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.included')}
                </h2>
                <ul className="space-y-2">
                  {includedItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {excludedItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.excluded')}
                </h2>
                <ul className="space-y-2">
                  {excludedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {gallery.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ImageGallery
                  images={gallery}
                  title={language === 'en' ? 'Photo Gallery' : 'Galerie Photos'}
                />
              </motion.div>
            )}

            {videos.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <VideoGallery
                  videos={videos}
                  title={language === 'en' ? 'Video Highlights' : 'Vidéos'}
                />
              </motion.div>
            )}

            {testimonials.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Testimonials testimonials={testimonials} />
              </motion.div>
            )}

            {/* Video Reviews section hidden by request. */}

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="mb-6 text-2xl font-bold text-[var(--navy)] dark:text-white">
                {language === 'en' ? 'Add Your Review' : 'Ajouter votre avis'}
              </h2>

              <form onSubmit={handleReviewSubmit} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {language === 'en' ? 'Name' : 'Nom'}
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      minLength={2}
                      maxLength={120}
                      required
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                    />
                  </label>
                  <label className="relative grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {language === 'en' ? 'Country' : 'Pays'}
                    <input
                      type="text"
                      value={reviewCountry}
                      onChange={(event) => {
                        setReviewCountry(event.target.value);
                        setIsCountryDropdownOpen(true);
                      }}
                      onFocus={() => setIsCountryDropdownOpen(true)}
                      onBlur={() => setIsCountryDropdownOpen(false)}
                      placeholder={language === 'en' ? 'Search country' : 'Rechercher un pays'}
                      minLength={2}
                      maxLength={120}
                      required
                      className="h-12 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                    />
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-[var(--dark-section)]">
                        {filteredReviewCountries.length > 0 ? (
                          filteredReviewCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                setReviewCountry(country);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[var(--sand)] dark:text-gray-200 dark:hover:bg-[var(--dark-muted)]"
                            >
                              {country}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {language === 'en' ? 'No country found' : 'Aucun pays trouvé'}
                          </div>
                        )}
                      </div>
                    )}
                  </label>
                  <fieldset className="grid gap-2">
                    <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {language === 'en' ? 'Rating' : 'Note'}
                    </legend>
                    <div className="flex h-12 items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="rounded-lg p-1 text-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                          aria-label={`${star}/5`}
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= reviewRating ? 'fill-[var(--gold)]' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {language === 'en' ? 'Review' : 'Avis'}
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    minLength={5}
                    maxLength={2000}
                    required
                    rows={4}
                    className="resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-section)] dark:text-white"
                  />
                </label>

                <div>
                  <Button type="submit" disabled={createReview.isPending}>
                    {createReview.isPending
                      ? language === 'en'
                        ? 'Adding...'
                        : 'Ajout...'
                      : language === 'en'
                        ? 'Add Review'
                        : 'Ajouter un avis'}
                  </Button>
                </div>
              </form>
            </motion.section>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="sticky top-24 bg-white dark:bg-[var(--dark-card)] rounded-2xl p-6 shadow-xl border-2 border-[var(--gold)] dark:border-[var(--teal)]"
            >
              <div className="text-center mb-6">
                <div className="text-[var(--teal)] dark:text-[var(--turquoise)] text-4xl font-bold mb-2 animate-glow-pulse">
                  €{primaryPricing?.price ?? 0}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {isPrivatePrice ? t('pricing.perGroup') : t('pricing.perPerson')}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {activity.startTime && activity.endTime && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-[var(--teal)]" />
                    <span>
                      {activity.startTime} - {activity.endTime}
                    </span>
                  </div>
                )}
                {activity.pickupIncluded && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Hotel pickup included' : 'Transfert hôtel inclus'}</span>
                  </div>
                )}
                {activity.availableDaily !== false && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Available daily' : 'Disponible quotidiennement'}</span>
                  </div>
                )}
                {activity.freeCancellation !== false && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Shield className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Free cancellation' : 'Annulation gratuite'}</span>
                  </div>
                )}
              </div>

              <Link to={`/book?activity=${activity.slug}`}>
                <Button className="w-full mb-3 animate-glow-pulse">
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
                <Button variant="outline" className="w-full hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('hero.whatsapp')}
                </Button>
              </a>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {language === 'en'
                    ? 'Instant confirmation via WhatsApp'
                    : 'Confirmation instantanée via WhatsApp'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {relatedActivities.length > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-[var(--navy)] dark:text-white mb-8">
              {t('activity.relatedActivities')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedActivities.map((act, index) => (
                <motion.div
                  key={act.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <ActivityCard activity={act} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
