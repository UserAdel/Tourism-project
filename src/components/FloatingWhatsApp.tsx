import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-xl whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in duration-200">
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {language === 'en' ? 'Chat with us!' : 'Discutez avec nous!'}
            </p>
            <div className="absolute bottom-0 right-4 w-3 h-3 bg-white dark:bg-[var(--dark-card)] transform rotate-45 translate-y-1/2"></div>
          </div>
        )}

        <a
          href="https://wa.me/201234567890"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group relative flex items-center justify-center w-16 h-16 bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-hover)] rounded-full shadow-2xl hover:shadow-[var(--shadow-whatsapp)] transition-all duration-300 hover:scale-110 animate-bounce-slow"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--whatsapp)] animate-ping opacity-75"></div>
          <MessageCircle className="w-8 h-8 text-white relative z-10" />

          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </a>
      </div>
    </div>
  );
}
