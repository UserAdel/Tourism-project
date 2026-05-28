import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface InfoItem {
  type: 'important' | 'recommended';
  text: {
    en: string;
    fr: string;
  };
}

interface ImportantInfoProps {
  items: InfoItem[];
  title?: string;
}

export default function ImportantInfo({ items, title }: ImportantInfoProps) {
  const { language } = useLanguage();

  const defaultTitle = language === 'en' ? 'Important Information' : 'Informations Importantes';

  return (
    <div className="bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {title || defaultTitle}
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-3 p-4 rounded-xl ${
              item.type === 'important'
                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {item.type === 'important' ? (
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm leading-relaxed ${
              item.type === 'important'
                ? 'text-orange-900 dark:text-orange-100'
                : 'text-blue-900 dark:text-blue-100'
            }`}>
              {item.text[language]}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
