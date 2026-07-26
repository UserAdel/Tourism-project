import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Loading from '../components/Loading';
import { tourismImages } from '../data/tourismImages';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import { useActivities, useCategories } from '../hooks/queries';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'motion/react';
import {
  Languages,
  Car,
  Award,
  Users,
  Heart,
  CheckCircle,
  Star,
  MessageCircle
} from 'lucide-react';

export default function Home() {
  const { language, t } = useLanguage();
  const { data: apiActivities, isLoading: isActivitiesLoading } = useActivities();
  const { data: apiCategories, isLoading: isCategoriesLoading } = useCategories();

  useSEO({
    title: language === 'fr'
      ? 'Hurghada French Guide | Excursions & Activités en Mer Rouge'
      : 'Hurghada French Guide | Red Sea Excursions & Activities',
    description: language === 'fr'
      ? 'Guide francophone à Hurghada. Excursions Orange Bay, Louxor, dauphins, plongée et plus. Réservez votre aventure en Mer Rouge avec un guide en français.'
      : 'French-speaking guide in Hurghada. Orange Bay, Luxor, dolphins, snorkeling & more. Book your Red Sea adventure with an expert guide.',
    keywords: language === 'fr'
      ? ['guide français Hurghada', 'excursions Hurghada', 'activités Mer Rouge', 'Orange Bay', 'guide francophone Égypte', 'Louxor excursion', 'dauphins Hurghada', 'plongée Hurghada']
      : ['Hurghada guide', 'Hurghada excursions', 'Red Sea activities', 'Orange Bay', 'French guide Egypt', 'Luxor tour', 'dolphins Hurghada', 'snorkeling Hurghada'],
    ogUrl: window.location.href,
    canonical: 'https://hurghadafrenchguide.com/',
    lang: language,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TouristInformationCenter',
      name: 'Hurghada French Guide',
      url: 'https://hurghadafrenchguide.com',
      description: language === 'fr'
        ? 'Guide francophone à Hurghada proposant des excursions en Mer Rouge'
        : 'French-speaking guide in Hurghada offering Red Sea excursions',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hurghada',
        addressCountry: 'EG',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['French', 'English'],
      },
      sameAs: ['https://wa.me/201234567890'],
    },
  });

  if (isActivitiesLoading || isCategoriesLoading) {
    return <Loading />;
  }

  const activities = apiActivities ?? [];
  const categories = apiCategories ?? [];

  const featuredActivities = activities.filter((a) => a.featured).slice(0, 6);

  const whyChooseUsItems = [
    {
      icon: Languages,
      title: t('whyUs.french'),
      description: t('whyUs.frenchDesc')
    },
    {
      icon: Car,
      title: t('whyUs.pickup'),
      description: t('whyUs.pickupDesc')
    },
    {
      icon: Award,
      title: t('whyUs.trusted'),
      description: t('whyUs.trustedDesc')
    },
    {
      icon: Users,
      title: t('whyUs.flexible'),
      description: t('whyUs.flexibleDesc')
    },
    {
      icon: Heart,
      title: t('whyUs.family'),
      description: t('whyUs.familyDesc')
    },
    {
      icon: CheckCircle,
      title: t('whyUs.instant'),
      description: t('whyUs.instantDesc')
    }
  ];



  const reviews = [
    {
      name: 'Sophie Laurent',
      rating: 5,
      text: language === 'en'
        ? 'Amazing experience! Our guide spoke perfect French and the Orange Bay trip was unforgettable.'
        : 'Expérience incroyable! Notre guide parlait parfaitement français et le voyage à Orange Bay était inoubliable.',
      activity: 'Orange Bay'
    },
    {
      name: 'Pierre Martin',
      rating: 5,
      text: language === 'en'
        ? 'The Luxor tour exceeded all expectations. Professional guides and excellent organization.'
        : 'La visite de Louxor a dépassé toutes les attentes. Guides professionnels et excellente organisation.',
      activity: 'Luxor'
    },
    {
      name: 'Marie Dubois',
      rating: 5,
      text: language === 'en'
        ? 'Swimming with dolphins was a dream come true! Highly recommend for families.'
        : 'Nager avec les dauphins était un rêve devenu réalité! Hautement recommandé pour les familles.',
      activity: 'Swim with Dolphins'
    }
  ];

  return (
    <div className="bg-[#F9F5EE] dark:bg-[#040E26]">
      <section className="public-hero relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src={tourismImages.redSea}
            alt="Red Sea"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/80 via-[var(--navy)]/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-reveal="up"
            data-reveal-delay="300"
          >
            <Link to="/book">
              <Button size="lg" className="w-full sm:w-auto">
                {t('hero.bookNow')}
              </Button>
            </Link>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-white bg-white/10 px-8 py-4 text-lg font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto dark:border-[var(--gold)] dark:hover:bg-[var(--gold)] dark:hover:text-[#041B4A]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.whatsapp')}
            </a>
          </div>
        </div>
      </section>

      {/* Explore by Category Section (3 in the same row - Restored Design) */}
      <section className="py-16 bg-[#F9F5EE] dark:bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--navy)] dark:text-white mb-4">
              {t('sections.categories')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category, index) => {
              const defaultImgs: Record<string, string> = {
                'sea-trips': tourismImages.dolphinWater,
                'desert-safari': tourismImages.island,
                'historical-cultural': tourismImages.luxor,
                'city-tours': tourismImages.temple,
              };
              const categoryImg = category.image || defaultImgs[category.id] || tourismImages.redSea;

              return (
                <motion.div
                  key={category.id}
                  initial={{ y: 30, opacity: 0, scale: 0.95 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="h-full flex flex-col"
                >
                  <Link
                    to={`/activities?category=${category.id}`}
                    className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-200/80 dark:border-[rgba(201,168,92,0.3)] bg-white dark:bg-[#061533] flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Clean Bright Category Image (No overlay, No icon) */}
                    <div className="relative h-52 sm:h-60 w-full overflow-hidden shrink-0">
                      <img
                        src={categoryImg}
                        alt={category.name[language]}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Clean Footer Bar */}
                    <div className="p-5 flex-1 flex items-center justify-between gap-3 bg-white dark:bg-[#0C2147] border-t border-gray-100 dark:border-gray-800">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-[var(--navy)] dark:text-white group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2">
                          {category.name[language]}
                        </h3>
                      </div>
                      <div className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--navy)] text-white font-bold text-xs shadow-sm group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)] transition-all duration-300 transform group-hover:translate-x-1 dark:bg-white/10 dark:text-white dark:group-hover:bg-[var(--gold)] dark:group-hover:text-[var(--navy)]">
                        <span>{t('common.explore')}</span>
                        <span className="text-sm leading-none">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Experiences Section */}
      <section className="py-16 bg-[#F0EAD8]/40 dark:bg-[#0C2147]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--navy)] dark:text-white mb-4">
              {t('sections.topExperiences')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/activities">
              <Button variant="outline" size="lg">
                {t('common.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--navy)] dark:bg-[#071530] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-reveal="up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('sections.whyChooseUs')}
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-stagger
            data-stagger-step="100"
          >
            {whyChooseUsItems.map((item, index) => (
              <div
                key={index}
                className="why-us-card bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 dark:hover:bg-white/10 transition-all hover:shadow-[0_0_30px_rgba(201,168,92,0.3)]"
              >
                <div className="w-14 h-14 bg-[var(--gold)] dark:bg-[var(--turquoise)] rounded-full flex items-center justify-center mb-4 animate-float">
                  <item.icon className="w-7 h-7 text-[var(--navy)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F0EAD8]/40 dark:bg-[#071530]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--navy)] dark:text-white mb-4">
              {t('sections.reviews')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#F9F5EE] dark:bg-[#071530] p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-[0_10px_40px_rgba(201,168,92,0.2)] transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{review.text}"</p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="font-semibold text-[var(--navy)] dark:text-white">{review.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.activity}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-hero py-20 bg-gradient-to-r from-[#041B4A] via-[#0A2456] to-[#1A8FA8] dark:from-[#040E26] dark:via-[#071530] dark:to-[#0B1E42] text-white relative overflow-hidden">
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-reveal="scale"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === 'en' ? 'Ready for Your Red Sea Adventure?' : 'Prêt pour Votre Aventure en Mer Rouge?'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'en'
              ? 'Book your unforgettable experience with our French-speaking guides today'
              : 'Réservez votre expérience inoubliable avec nos guides francophones dès aujourd\'hui'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button
                size="lg"
                className="w-full sm:w-auto !bg-[var(--gold)] !text-[#041B4A] hover:!bg-[#B8963F] !border-0"
              >
                {t('hero.bookNow')}
              </Button>
            </Link>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-white/70 bg-transparent px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-white hover:text-[#041B4A] focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
