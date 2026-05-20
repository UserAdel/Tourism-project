import { CheckCircle, Car, Languages, Users, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface TrustBadge {
  icon: any;
  label: {
    en: string;
    fr: string;
  };
}

export default function TrustBadges() {
  const { language } = useLanguage();

  const badges: TrustBadge[] = [
    {
      icon: CheckCircle,
      label: {
        en: 'Instant Confirmation',
        fr: 'Confirmation Instantanée'
      }
    },
    {
      icon: Car,
      label: {
        en: 'Hotel Pickup Included',
        fr: 'Transfert Hôtel Inclus'
      }
    },
    {
      icon: Shield,
      label: {
        en: 'Free Cancellation',
        fr: 'Annulation Gratuite'
      }
    },
    {
      icon: Languages,
      label: {
        en: 'French/English Guide',
        fr: 'Guide Français/Anglais'
      }
    },
    {
      icon: Users,
      label: {
        en: 'Family Friendly',
        fr: 'Adapté aux Familles'
      }
    },
    {
      icon: Heart,
      label: {
        en: 'Secure Booking',
        fr: 'Réservation Sécurisée'
      }
    }
  ];

  return (
    <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-6 shadow-lg border border-[var(--gold)]/10 dark:border-[var(--teal)]/10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-[var(--sand)] dark:hover:bg-[var(--dark-muted)] transition-colors"
          >
            <div className="w-10 h-10 bg-[var(--teal)]/10 dark:bg-[var(--turquoise)]/10 rounded-full flex items-center justify-center">
              <badge.icon className="w-5 h-5 text-[var(--teal)] dark:text-[var(--turquoise)]" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">
              {badge.label[language]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
