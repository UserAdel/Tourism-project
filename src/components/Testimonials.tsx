import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCountryWithFlag } from '../data/countries';

interface Testimonial {
  id: string;
  name: string;
  nationality: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
}

export default function Testimonials({ testimonials, title }: TestimonialsProps) {
  const { language } = useLanguage();

  const defaultTitle = language === 'en' ? 'Guest Reviews' : 'Avis des Clients';

  return (
    <div className="bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {title || defaultTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[var(--sand)] to-white dark:from-[#0B1E42] dark:to-[#071530] p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--gold)]/20 dark:border-[var(--teal)]/20 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-12 h-12 text-[var(--teal)]" />
            </div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
              {testimonial.avatar ? (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold)]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--teal)] flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-[var(--navy)] dark:text-white">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getCountryWithFlag(testimonial.nationality)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? 'fill-[var(--gold)] text-[var(--gold)]'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {testimonial.rating}/5
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 italic">
              "{testimonial.text}"
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              {testimonial.date}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
