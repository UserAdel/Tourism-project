import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0EAD8]/30 dark:bg-[#040E26]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--teal)] dark:text-[var(--turquoise)]" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
}
