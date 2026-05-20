import { useState } from 'react';
import { Share2, Heart, Link2, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

interface ShareSaveProps {
  activityName: string;
  activityUrl: string;
}

export default function ShareSave({ activityName, activityUrl }: ShareSaveProps) {
  const { language } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activityName,
        url: activityUrl
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
          saved
            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400'
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[var(--teal)]'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${saved ? 'fill-current' : ''}`}
        />
        <span className="text-sm font-medium">
          {saved
            ? (language === 'en' ? 'Saved' : 'Enregistré')
            : (language === 'en' ? 'Save' : 'Enregistrer')}
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[var(--teal)] transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'Share' : 'Partager'}
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
          copied
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600 dark:text-green-400'
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[var(--teal)]'
        }`}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {copied
            ? (language === 'en' ? 'Copied!' : 'Copié!')
            : (language === 'en' ? 'Copy Link' : 'Copier le lien')}
        </span>
      </motion.button>
    </div>
  );
}
