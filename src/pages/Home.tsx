import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { activities as fallbackActivities, categories as fallbackCategories } from '../data/activities';
import { tourismImages } from '../data/tourismImages';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import { useActivities, useCategories } from '../hooks/queries';
import { normalizeActivity } from '../utils/activityImages';
import { motion } from 'motion/react';
import {
  Languages,
  Car,
  Award,
  Users,
  Heart,
  CheckCircle,
  Star,
  MessageCircle,
  Palmtree,
  Landmark,
  Waves,
  Ship,
  Compass,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { language, t } = useLanguage();
  const { data: apiActivities } = useActivities();
  const { data: apiCategories } = useCategories();
  const activities = apiActivities ?? fallbackActivities.map(normalizeActivity);
  const categories = apiCategories ?? fallbackCategories;

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

  const categoryIcons: Record<string, any> = {
    'island-trips': Palmtree,
    'historical-tours': Landmark,
    'dolphin-experiences': Waves,
    'sea-adventures': Ship,
    'private-tours': Compass,
    'wellness': Sparkles,
    'family-activities': Users
  };

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
    <div className="bg-white dark:bg-[var(--dark-page)]">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="w-full sm:w-auto">
                {t('hero.bookNow')}
              </Button>
            </Link>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-white bg-white/10 px-8 py-4 text-lg font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[var(--teal-dark)] focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto dark:border-[var(--turquoise)] dark:hover:bg-[var(--turquoise)] dark:hover:text-[var(--dark-page)]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.whatsapp')}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-[var(--dark-section)]">
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

      <section className="py-16 bg-white dark:bg-[var(--dark-page)]">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.id] || Compass;
              return (
                <motion.div
                  key={category.id}
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to={`/activities?category=${category.id}`}
                    className="group bg-gradient-to-br from-[var(--sand)] to-white dark:from-[var(--dark-muted)] dark:to-[var(--dark-section)] p-6 rounded-2xl text-center hover:shadow-xl dark:hover:shadow-[var(--shadow-cyan-large)] transition-all duration-300 hover:-translate-y-1 border border-[var(--gold)]/20 dark:border-[var(--teal)]/20 block"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-white dark:bg-[var(--dark-card)] rounded-full flex items-center justify-center group-hover:bg-[var(--teal)] transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-110">
                      <Icon className="w-8 h-8 text-[var(--teal)] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-[var(--navy)] dark:text-white">
                      {category.name[language]}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--navy)] dark:bg-[var(--dark-card)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('sections.whyChooseUs')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 dark:hover:bg-white/10 transition-all hover:shadow-[var(--shadow-cyan-glow)]"
              >
                <div className="w-14 h-14 bg-[var(--gold)] dark:bg-[var(--turquoise)] rounded-full flex items-center justify-center mb-4 animate-float">
                  <item.icon className="w-7 h-7 text-[var(--navy)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-[var(--dark-section)]">
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
                className="bg-white dark:bg-[var(--dark-card)] p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-[var(--shadow-cyan-large)] transition-all"
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

      <section className="py-20 bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                className="w-full sm:w-auto border-2 border-white !bg-white !text-[var(--teal)] hover:!bg-gray-100 hover:!text-[var(--teal-dark)] dark:border-[var(--turquoise)] dark:!bg-[var(--dark-page)] dark:!text-white dark:hover:!bg-[var(--dark-section)] dark:hover:!text-[var(--turquoise)]"
              >
                {t('hero.bookNow')}
              </Button>
            </Link>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-white hover:text-[var(--teal-dark)] focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto dark:border-[var(--turquoise)] dark:ring-1 dark:ring-[var(--turquoise)]/80 dark:hover:bg-[var(--turquoise)] dark:hover:text-[var(--dark-page)]"
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
