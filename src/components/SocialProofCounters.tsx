import { Star, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface SocialProofCountersProps {
  bookingCount?: number;
  rating?: number;
  satisfaction?: number;
}

export default function SocialProofCounters({
  bookingCount = 2431,
  rating = 4.9,
  satisfaction = 98
}: SocialProofCountersProps) {
  const { language } = useLanguage();

  const counters = [
    {
      icon: Users,
      value: bookingCount.toLocaleString(),
      label: language === 'en' ? 'Bookings' : 'Réservations'
    },
    {
      icon: Star,
      value: `${rating}/5`,
      label: language === 'en' ? 'Average Rating' : 'Note Moyenne'
    },
    {
      icon: TrendingUp,
      value: `${satisfaction}%`,
      label: language === 'en' ? 'Satisfaction' : 'Satisfaction'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--turquoise)] dark:from-[var(--turquoise)] dark:to-[var(--teal)] rounded-2xl p-6 text-white">
      <div className="grid grid-cols-3 gap-4">
        {counters.map((counter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-2">
              <counter.icon className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">{counter.value}</div>
            <div className="text-xs md:text-sm text-white/80">{counter.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
