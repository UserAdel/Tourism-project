import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/Button';
import ActivityCard from '../components/ActivityCard';
import ImageGallery from '../components/ImageGallery';
import VideoGallery from '../components/VideoGallery';
import Testimonials from '../components/Testimonials';
import VideoTestimonials from '../components/VideoTestimonials';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';
import Loading from '../components/Loading';
import { useActivities, useActivity, useCreateActivityReview } from '../hooks/queries';
import { formatPricingLabel, getPrimaryPricingField, getPricingFields } from '../utils/pricing';
import { countries } from '../data/countries';
import { useSEO } from '../hooks/useSEO';
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

const reviewCountries = [...countries.map((c) => `${c.flag} ${c.name}`), 'Other'];
const defaultReviewCountry = '';
const detailViewport = { once: true, amount: 0.12 };
const detailTransition = {
  duration: 0.78,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroScrollProgress, [0, 1], [0, 52]);
  const heroContentY = useTransform(heroScrollProgress, [0, 1], [0, 28]);
  const heroContentOpacity = useTransform(heroScrollProgress, [0, 0.82], [1, 0]);
  const { data: apiActivity, isLoading } = useActivity(slug);
  const { data: apiActivities } = useActivities();
  const createReview = useCreateActivityReview(slug);
  const [reviewName, setReviewName] = useState('');
  const [reviewCountry, setReviewCountry] = useState(defaultReviewCountry);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsCountryDropdownOpen(false);
  }, [slug]);

  const activities = apiActivities ?? [];
  const activity = apiActivity;

  // Generate dynamic keywords — admin keywords take priority at the front
  const autoKeywords = activity
    ? [
        activity.name[language],
        language === 'fr' ? `excursion ${activity.name[language]}` : `${activity.name[language]} excursion`,
        language === 'fr' ? `activité ${activity.name[language]} Hurghada` : `${activity.name[language]} activity Hurghada`,
        activity.category,
        'Hurghada',
        language === 'fr' ? 'Égypte' : 'Egypt',
        language === 'fr' ? 'guide francophone Hurghada' : 'Hurghada guide',
        language === 'fr' ? 'guide français Hurghada' : 'excursion Hurghada',
        language === 'fr' ? 'que faire à Hurghada' : 'things to do in Hurghada',
        'Hurghada French Guide',
      ]
    : [];
  const adminKeywords = activity?.seoKeywords ?? [];
  const seoKeywords = [...adminKeywords, ...autoKeywords.filter((kw) => !adminKeywords.includes(kw))];

  const seoPrimaryPricing = activity ? getPrimaryPricingField(activity) : null;

  // Generate JSON-LD TouristAttraction Structured Data
  const jsonLd = activity
    ? {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: activity.name[language],
        description: activity.description[language].slice(0, 200),
        image: activity.imageUrl,
        touristType: activity.childFriendly ? ['Family', 'Kids', 'Adults'] : ['Adults'],
        provider: {
          '@type': 'LocalBusiness',
          name: 'Hurghada French Guide',
          url: window.location.origin,
        },
        offers: {
          '@type': 'Offer',
          price: seoPrimaryPricing?.price ?? 0,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      }
    : undefined;

  useSEO({
    title: activity
      ? `${activity.name[language]} | Hurghada French Guide`
      : 'Hurghada French Guide',
    description: activity
      ? activity.description[language].slice(0, 160)
      : 'Discover the best excursions and activities in Hurghada with a French-speaking guide.',
    keywords: seoKeywords,
    ogImage: activity?.imageUrl,
    ogUrl: window.location.href,
    ogType: 'article',
    jsonLd,
  });

  if (isLoading && !activity) {
    return <Loading />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0EAD8]/30 dark:bg-[#040E26]">
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

  const gallery = activity.galleryImages ?? [];

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
    : [];
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
  const videoReviews = activity.videoReviews?.length
    ? activity.videoReviews.map((videoReview, index) => {
        const youtubeId = videoReview.youtubeId || extractYouTubeId(videoReview.youtubeUrl);

        return {
          id: videoReview.id || `${activity.slug}-video-review-${index + 1}`,
          name: videoReview.name,
          nationality: videoReview.nationality,
          rating: videoReview.rating,
          thumbnail: videoReview.thumbnail || youtubeThumbnailUrl(youtubeId),
          quote: videoReview.quote,
          youtubeId,
        };
      })
    : [];
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
    <div className="bg-[#F0EAD8]/30 dark:bg-[#040E26] min-h-screen">
      <div ref={heroRef} className="activity-detail-hero public-hero relative h-[28rem] overflow-hidden">
        <motion.img
          initial={{ scale: 1.12, filter: 'saturate(0.82)' }}
          animate={{ scale: 1, filter: 'saturate(1)' }}
          transition={{ duration: 1.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: heroImageY }}
          src={activity.imageUrl}
          alt={activity.name[language]}
          className="absolute -top-[12%] h-[124%] w-full object-cover will-change-transform"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5"
        />
        <motion.div
          style={{ y: heroContentY, opacity: heroContentOpacity }}
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.button
              initial={{ x: -18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.08, ...detailTransition }}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="activity-hero-back flex items-center gap-2 text-white mb-4 hover:text-[var(--gold)] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {language === 'en' ? 'Back' : 'Retour'}
            </motion.button>
            <motion.h1
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.16, ...detailTransition }}
              className="text-4xl md:text-6xl font-bold text-white mb-5 max-w-4xl"
            >
              {activity.name[language]}
            </motion.h1>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09, delayChildren: 0.28 } },
              }}
              className="flex flex-wrap gap-3 text-white/90"
            >
              <motion.div
                variants={{
                  hidden: { y: 14, opacity: 0, scale: 0.96 },
                  visible: { y: 0, opacity: 1, scale: 1 },
                }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="activity-hero-chip flex items-center gap-2 bg-white/12 backdrop-blur-md px-3.5 py-2 rounded-full"
              >
                <Clock className="w-4 h-4 text-[var(--gold)]" />
                <span>{activity.duration}</span>
              </motion.div>
              {activity.pickupIncluded && (
                <motion.div
                  variants={{
                    hidden: { y: 14, opacity: 0, scale: 0.96 },
                    visible: { y: 0, opacity: 1, scale: 1 },
                  }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="activity-hero-chip flex items-center gap-2 bg-white/12 backdrop-blur-md px-3.5 py-2 rounded-full"
                >
                  <MapPin className="w-4 h-4 text-[var(--gold)]" />
                  <span>{language === 'en' ? 'Pickup Included' : 'Transfert Inclus'}</span>
                </motion.div>
              )}
              {activity.childFriendly && (
                <motion.div
                  variants={{
                    hidden: { y: 14, opacity: 0, scale: 0.96 },
                    visible: { y: 0, opacity: 1, scale: 1 },
                  }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="activity-hero-chip flex items-center gap-2 bg-white/12 backdrop-blur-md px-3.5 py-2 rounded-full"
                >
                  <Users className="w-4 h-4 text-[var(--gold)]" />
                  <span>{language === 'en' ? 'Family Friendly' : 'Adapté aux Familles'}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute bottom-7 right-6 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 lg:flex"
        >
          <span>{language === 'en' ? 'Explore' : 'Découvrir'}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-8 w-px bg-gradient-to-b from-[var(--gold)] to-transparent"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={detailViewport}
              transition={detailTransition}
              className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                {t('activity.overview')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {activity.description[language]}
              </p>
            </motion.div>

            {highlights.length > 0 && (
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
                className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -16, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={detailViewport}
                      transition={{ ...detailTransition, delay: index * 0.06 }}
                      whileHover={{ x: 5 }}
                      className="activity-detail-list-item flex items-start gap-3"
                    >
                      <motion.span
                        initial={{ scale: 0.55, rotate: -20 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={detailViewport}
                        transition={{ delay: 0.08 + index * 0.06, type: 'spring', stiffness: 240 }}
                      >
                        <CheckCircle className="w-5 h-5 text-[var(--teal)] mt-0.5 flex-shrink-0" />
                      </motion.span>
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {hasRequirements && (
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
                className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
                  {t('activity.ageRestrictions')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ageRestriction && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={detailViewport}
                      whileHover={{ y: -4 }}
                      className="activity-requirement-card flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-xl"
                    >
                      <motion.div
                        whileHover={{ rotate: -8, scale: 1.08 }}
                        className="w-10 h-10 bg-[var(--teal)] rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Baby className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                          {language === 'en' ? 'Age Requirements' : 'Exigences d\'Âge'}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {ageRestriction}
                        </p>
                      </div>
                    </motion.div>
                  )}
                {activity.maxWeight && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.08 }}
                    whileHover={{ y: -4 }}
                    className="activity-requirement-card flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-xl"
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      className="w-10 h-10 bg-[var(--gold)] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Weight className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                        {language === 'en' ? 'Weight Limit' : 'Limite de Poids'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {language === 'en' ? 'Maximum' : 'Maximum'}: {activity.maxWeight}kg
                      </p>
                    </div>
                  </motion.div>
                )}
                {activity.maxCapacity && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.16 }}
                    whileHover={{ y: -4 }}
                    className="activity-requirement-card flex items-start gap-3 p-4 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-xl"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="w-10 h-10 bg-[var(--turquoise)] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Users className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-[var(--navy)] dark:text-white mb-1">
                        {language === 'en' ? 'Group Capacity' : 'Capacité du Groupe'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {language === 'en' ? 'Up to' : 'Jusqu\'à'} {activity.maxCapacity} {language === 'en' ? 'people' : 'personnes'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            )}

            <motion.div
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={detailViewport}
              transition={detailTransition}
              className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
                {t('activity.pricing')}
              </h2>
              <div className="space-y-4">
                {pricingFields.map((field, index) => (
                  <motion.div
                    key={`${field.id ?? field.name.en}-${index}`}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={detailViewport}
                    transition={{ ...detailTransition, delay: index * 0.07 }}
                    whileHover={{ x: 5, scale: 1.01 }}
                    className="activity-price-row flex items-center justify-between p-4 bg-gradient-to-r from-[var(--sand)] to-white dark:from-[#0B1E42] dark:to-[#071530] rounded-xl border border-[var(--gold)]/20"
                  >
                    <span className="font-medium text-[var(--navy)] dark:text-white">{formatPricingLabel(field, language)}</span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.72 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={detailViewport}
                      transition={{ delay: 0.12 + index * 0.07, type: 'spring', stiffness: 220 }}
                      className="text-2xl font-bold text-[var(--teal)]"
                    >
                      €{field.price}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {includedItems.length > 0 && (
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
                className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.included')}
                </h2>
                <ul className="space-y-2">
                  {includedItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -16, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={detailViewport}
                      transition={{ ...detailTransition, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="activity-detail-list-item flex items-start gap-3"
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
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
                className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
              >
                <h2 className="activity-detail-title text-2xl font-bold text-[var(--navy)] dark:text-white mb-4">
                  {t('activity.excluded')}
                </h2>
                <ul className="space-y-2">
                  {excludedItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -16, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={detailViewport}
                      transition={{ ...detailTransition, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="activity-detail-list-item flex items-start gap-3"
                    >
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {gallery.length > 0 && (
              <motion.div
                initial={{ y: 32, opacity: 0, scale: 0.985 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
              >
                <ImageGallery
                  images={gallery}
                  title={language === 'en' ? 'Photo Gallery' : 'Galerie Photos'}
                />
              </motion.div>
            )}

            {videos.length > 0 && (
              <motion.div
                initial={{ y: 32, opacity: 0, scale: 0.985 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
              >
                <VideoGallery
                  videos={videos}
                  title={language === 'en' ? 'Video Highlights' : 'Vidéos'}
                />
              </motion.div>
            )}

            {testimonials.length > 0 && (
              <motion.div
                initial={{ y: 32, opacity: 0, scale: 0.985 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
              >
                <Testimonials testimonials={testimonials} />
              </motion.div>
            )}

            {videoReviews.length > 0 && (
              <motion.div
                initial={{ y: 32, opacity: 0, scale: 0.985 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={detailViewport}
                transition={detailTransition}
              >
                <VideoTestimonials testimonials={videoReviews} />
              </motion.div>
            )}

            <motion.section
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={detailViewport}
              transition={detailTransition}
              className="activity-detail-panel bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg"
            >
              <h2 className="activity-detail-title mb-6 text-2xl font-bold text-[var(--navy)] dark:text-white">
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
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[#071530] dark:text-white"
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
                      className="h-12 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[#071530] dark:text-white"
                    />
                    <AnimatePresence>
                      {isCountryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-[#F9F5EE] py-2 shadow-xl dark:border-gray-700 dark:bg-[#071530]"
                      >
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
                              className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-[var(--sand)] dark:text-gray-200 dark:hover:bg-[#0B1E42]"
                            >
                              {country}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {language === 'en' ? 'No country found' : 'Aucun pays trouvé'}
                          </div>
                        )}
                      </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                  <fieldset className="grid gap-2">
                    <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {language === 'en' ? 'Rating' : 'Note'}
                    </legend>
                    <div className="flex h-12 items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          whileHover={{ y: -3, scale: 1.16, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-lg p-1 text-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                          aria-label={`${star}/5`}
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= reviewRating ? 'fill-[var(--gold)]' : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
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
                    className="resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[var(--teal)] dark:border-gray-600 dark:bg-[#071530] dark:text-white"
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
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={detailViewport}
              transition={{ ...detailTransition, delay: 0.12 }}
              className="activity-booking-card sticky top-24 bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-6 shadow-xl border-2 border-[var(--gold)] dark:border-[var(--teal)]"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.72 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={detailViewport}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 210, damping: 14 }}
                  className="text-[var(--teal)] dark:text-[var(--turquoise)] text-4xl font-bold mb-2"
                >
                  €{primaryPricing?.price ?? 0}
                </motion.div>
                <div className="text-gray-500 dark:text-gray-400">
                  {isPrivatePrice ? t('pricing.perGroup') : t('pricing.perPerson')}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {activity.startTime && activity.endTime && (
                  <motion.div
                    initial={{ x: 12, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.2 }}
                    whileHover={{ x: 4 }}
                    className="activity-booking-detail flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <Clock className="w-5 h-5 text-[var(--teal)]" />
                    <span>
                      {activity.startTime} - {activity.endTime}
                    </span>
                  </motion.div>
                )}
                {activity.pickupIncluded && (
                  <motion.div
                    initial={{ x: 12, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.27 }}
                    whileHover={{ x: 4 }}
                    className="activity-booking-detail flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <MapPin className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Hotel pickup included' : 'Transfert hôtel inclus'}</span>
                  </motion.div>
                )}
                {activity.availableDaily !== false && (
                  <motion.div
                    initial={{ x: 12, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.34 }}
                    whileHover={{ x: 4 }}
                    className="activity-booking-detail flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <Calendar className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Available daily' : 'Disponible quotidiennement'}</span>
                  </motion.div>
                )}
                {activity.freeCancellation !== false && (
                  <motion.div
                    initial={{ x: 12, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={detailViewport}
                    transition={{ delay: 0.41 }}
                    whileHover={{ x: 4 }}
                    className="activity-booking-detail flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <Shield className="w-5 h-5 text-[var(--teal)]" />
                    <span>{language === 'en' ? 'Free cancellation' : 'Annulation gratuite'}</span>
                  </motion.div>
                )}
              </div>

              <Link to={`/book?activity=${activity.slug}`}>
                <Button className="activity-booking-cta w-full mb-3">
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
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={detailViewport}
            transition={detailTransition}
            className="mt-16"
          >
            <h2 className="activity-detail-title text-3xl font-bold text-[var(--navy)] dark:text-white mb-8">
              {t('activity.relatedActivities')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedActivities.map((act, index) => (
                <motion.div
                  key={act.id}
                  initial={{ y: 24, opacity: 0, scale: 0.97 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={detailViewport}
                  transition={{ ...detailTransition, delay: index * 0.09 }}
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
