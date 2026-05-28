import { MapPin, Clock, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface PickupZone {
  name: string;
  time: string;
}

interface PickupInfoProps {
  zones: PickupZone[];
  notes?: {
    en: string;
    fr: string;
  };
}

export default function PickupInfo({ zones, notes }: PickupInfoProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-[#F9F5EE] dark:bg-[#071530] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {language === 'en' ? 'Pickup Information' : 'Informations de Transfert'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {zones.map((zone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-4 bg-[var(--sand)] dark:bg-[#0B1E42] rounded-xl"
          >
            <div className="w-10 h-10 bg-[var(--teal)]/10 dark:bg-[var(--turquoise)]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[var(--teal)] dark:text-[var(--turquoise)]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--navy)] dark:text-white">{zone.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {zone.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {notes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
              {notes[language]}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 bg-[#F9F5EE] dark:bg-[#0B1E42] rounded-xl overflow-hidden h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220924.52196876685!2d33.647788!3d27.25738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14531a7d47c3c499%3A0x86a8bd14e7de7081!2sHurghada%2C%20Red%20Sea%20Governorate%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Pickup Zones Map"
        />
      </div>
    </div>
  );
}
