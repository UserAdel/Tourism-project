import { Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface ItineraryStep {
  time: string;
  title: {
    en: string;
    fr: string;
  };
  description?: {
    en: string;
    fr: string;
  };
}

interface DetailedItineraryProps {
  steps: ItineraryStep[];
  title?: string;
}

export default function DetailedItinerary({ steps, title }: DetailedItineraryProps) {
  const { language } = useLanguage();

  const defaultTitle = language === 'en' ? 'Detailed Itinerary' : 'Itinéraire Détaillé';

  return (
    <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {title || defaultTitle}
      </h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--teal)] via-[var(--turquoise)] to-[var(--gold)]"></div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              {/* Time Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--teal)] to-[var(--turquoise)] rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="bg-[var(--sand)] dark:bg-[var(--dark-muted)] rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-sm font-semibold text-[var(--teal)] dark:text-[var(--turquoise)]">
                      {step.time}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--navy)] dark:text-white">
                      {step.title[language]}
                    </h3>
                  </div>
                  {step.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {step.description[language]}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
