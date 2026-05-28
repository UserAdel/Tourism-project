import { Award, Languages, Star, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface GuideProfileProps {
  name: string;
  title: {
    en: string;
    fr: string;
  };
  experience: string;
  languages: string[];
  rating: number;
  tours: number;
  image?: string;
  bio?: {
    en: string;
    fr: string;
  };
}

export default function GuideProfile({
  name,
  title,
  experience,
  languages,
  rating,
  tours,
  image,
  bio
}: GuideProfileProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-[var(--sand)] to-white dark:from-[#0B1E42] dark:to-[#071530] rounded-2xl p-8 shadow-lg border border-[var(--gold)]/20 dark:border-[var(--teal)]/20"
    >
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {language === 'en' ? 'Meet Your Guide' : 'Rencontrez Votre Guide'}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Guide Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--gold)] shadow-xl">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--teal)] to-[var(--turquoise)] flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-[var(--teal)] dark:text-[var(--turquoise)] font-medium mb-3">
            {title[language]}
          </p>

          {bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {bio[language]}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-gray-700 dark:text-gray-300">{experience}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Languages className="w-4 h-4 text-[var(--teal)]" />
              <span className="text-gray-700 dark:text-gray-300">{languages.join(' / ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
              <span className="text-gray-700 dark:text-gray-300">{rating} {language === 'en' ? 'Rating' : 'Note'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[var(--turquoise)]" />
              <span className="text-gray-700 dark:text-gray-300">
                {tours.toLocaleString()} {language === 'en' ? 'Tours' : 'Visites'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="px-3 py-1 bg-[var(--teal)]/10 dark:bg-[var(--turquoise)]/10 rounded-full text-xs font-medium text-[var(--teal)] dark:text-[var(--turquoise)]">
              {language === 'en' ? 'Licensed Guide' : 'Guide Certifié'}
            </div>
            <div className="px-3 py-1 bg-[var(--gold)]/10 rounded-full text-xs font-medium text-[var(--gold)]">
              {language === 'en' ? 'Expert' : 'Expert'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
