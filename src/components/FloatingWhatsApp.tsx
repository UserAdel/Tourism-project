import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { X, Send, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface FunnelOption {
  type: 'goto' | 'link';
  text: string;
  value: number | string;
}

interface FunnelStep {
  content: string[];
  options: FunnelOption[];
}

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = '201234567890';

  // Initial step based on current language (1 for FR, 6 for EN)
  const initialStep = language === 'fr' ? 1 : 6;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Sync initial step when language changes if on the root step
  useEffect(() => {
    if (currentStep === 1 || currentStep === 6) {
      setCurrentStep(language === 'fr' ? 1 : 6);
    }
  }, [language]);

  const openWhatsAppUrl = (urlOrText: string) => {
    let finalUrl = urlOrText;
    if (!urlOrText.startsWith('http')) {
      finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(urlOrText)}`;
    }
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    openWhatsAppUrl(customMessage.trim());
    setCustomMessage('');
  };

  // Funnel decision tree replicating the exact hurghadadream.com funnel
  const funnelSteps: Record<number, FunnelStep> = useMemo(
    () => ({
      // STEP 0: Language selection
      0: {
        content: ['👋 <strong>Hello !</strong> 😊', 'Bienvenue / Welcome !'],
        options: [
          { type: 'goto', text: '🇫🇷 Je souhaite continuer en français', value: 1 },
          { type: 'goto', text: '🇬🇧 I want to continue in English', value: 6 },
        ],
      },

      // FRENCH FLOW (Steps 1 to 5)
      1: {
        content: [
          "L'agence n°1 🇫🇷 d'activités à Hurghada !",
          'Que souhaitez-vous faire ?',
        ],
        options: [
          { type: 'goto', text: '🏝️ Je souhaite réserver une ou plusieurs activités', value: 2 },
          { type: 'goto', text: '🏨 Je souhaite réserver un hôtel', value: 3 },
          { type: 'goto', text: '✏️ Je souhaite modifier ou annuler une réservation', value: 4 },
          { type: 'goto', text: '🤙🏽 Autre demande', value: 5 },
          { type: 'goto', text: '👈🏽 Changer de langue', value: 0 },
        ],
      },

      2: {
        content: [
          '<strong>🏝️ Réserver une activité</strong><br>Vous pouvez retrouver toutes nos activités sur ce site via le lien ci-dessous :<br><a href="/activities" class="chat-link">👉🏽 Nos activités</a><br>Une fois l\'activité choisie, il suffit de cliquer sur le bouton "Réserver" et vous serez redirigé automatiquement vers un conseiller sur WhatsApp qui finalisera la ou les réservations voulues.',
          'Vous pouvez également discuter directement avec un de nos conseillers via WhatsApp en cliquant sur le bouton 🟩 ci-dessous :<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '🗣️ Réserver avec un conseiller 🕐 En ligne de 9h45 à 21h',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais avoir des informations pour réserver une ou plusieurs activités à Hurghada. Merci."
            )}`,
          },
          { type: 'goto', text: '👈🏽 Revenir en arrière', value: 1 },
        ],
      },

      3: {
        content: [
          '<strong>🏨 Réservation d\'hôtel</strong><br>Hurghada French Guide propose de nombreux hôtels de qualité à des prix très attractifs !<br>N\'hésitez pas à nous contacter sur notre 📱 WhatsApp réservé exclusivement aux 🏨 hôtels.<br>L\'un ou l\'une de nos agents se fera un plaisir de vous conseiller et vous offrir l\'hôtel qui vous correspond au meilleur prix ! 🤑<br>Cliquez sur le bouton 🟩 ci-dessous :<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: "🏨 Réservation d'hôtel 🕐 En ligne de 10h à 20h",
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais réserver un hôtel pour Hurghada. Que pouvez-vous me proposer ? Merci."
            )}`,
          },
          { type: 'goto', text: '👈🏽 Revenir en arrière', value: 1 },
        ],
      },

      4: {
        content: [
          '<strong>✏️ Modification & Annulation</strong><br>Vous pouvez trouver toutes les informations concernant la modification ou l\'annulation d\'une activité sur le lien ci-dessous :<br><a href="/faq" class="chat-link">ℹ️ Information modification / annulation</a>',
          'Pour modifier ou annuler une réservation veuillez <strong>préparer votre ticket de réservation avec vous</strong> et puis cliquer sur le bouton 🟩 ci-dessous pour discuter via WhatsApp à un conseiller.<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '✏️ Modification / Annulation 🕐 En ligne de 9h45 à 21h',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais modifier/annuler une réservation. Pouvez-vous m'aider ? Merci."
            )}`,
          },
          { type: 'goto', text: '👈🏽 Revenir en arrière', value: 1 },
        ],
      },

      5: {
        content: [
          'Vous avez besoin d\'autre chose ? 🤔<br>Sélectionnez un service ci-dessous pour joindre directement le service concerné :',
        ],
        options: [
          {
            type: 'link',
            text: '🚐 Transferts (☀️ Journée) 🕐 En ligne de 7h30 à 20h00',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite réserver ou avoir des informations sur un transfert journée à Hurghada.'
            )}`,
          },
          {
            type: 'link',
            text: '🚐 Transferts (🌙 Nuit) 🕐 En ligne de 1h à 5h30',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite réserver ou avoir des informations sur un transfert de nuit à Hurghada.'
            )}`,
          },
          {
            type: 'link',
            text: '✈️ Passeport 🇪🇬 Le Caire & Louxor',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite des informations concernant les excursions Le Caire et Louxor.'
            )}`,
          },
          {
            type: 'link',
            text: '🙋🏻‍♂️ Envoyer un message / Une remarque / Une suggestion',
            value: '/contact',
          },
          { type: 'goto', text: '👈🏽 Revenir en arrière', value: 1 },
        ],
      },

      // ENGLISH FLOW (Steps 6 to 10)
      6: {
        content: [
          'The #1 French & English-speaking activities agency in Hurghada!',
          'What would you like to do?',
        ],
        options: [
          { type: 'goto', text: '🏝️ I would like to book one or more activities', value: 7 },
          { type: 'goto', text: '🏨 I want to book a hotel', value: 8 },
          { type: 'goto', text: '✏️ I want to modify or cancel a reservation', value: 9 },
          { type: 'goto', text: '🤙🏽 Other request', value: 10 },
          { type: 'goto', text: '👈🏽 Change language', value: 0 },
        ],
      },

      7: {
        content: [
          '<strong>🏝️ Book an activity</strong><br>You can find all our activities on this site via the link below:<br><a href="/activities" class="chat-link">👉🏽 Our activities</a><br>Once the activity is chosen, simply click on the "Book" button and you will be automatically redirected to an advisor on WhatsApp who will finalize the reservation.',
          'You can also chat directly with one of our advisors via WhatsApp by clicking the 🟩 button below:<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '🗣️ Book with an advisor 🕐 Online from 9:45 AM to 9:00 PM',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information to book activities in Hurghada. Thank you.'
            )}`,
          },
          { type: 'goto', text: '👈🏽 Go back', value: 6 },
        ],
      },

      8: {
        content: [
          '<strong>🏨 Hotel reservation</strong><br>Hurghada French Guide offers quality hotels at very attractive prices!<br>Contact us on our dedicated 📱 WhatsApp for 🏨 hotels.<br>One of our agents will be happy to assist and offer you the hotel that best suits your needs! 🤑<br>Click on the 🟩 button below:<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '🏨 Hotel reservation 🕐 Online from 10:00 AM to 8:00 PM',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like to book a hotel in Hurghada. What can you recommend? Thank you.'
            )}`,
          },
          { type: 'goto', text: '👈🏽 Go back', value: 6 },
        ],
      },

      9: {
        content: [
          '<strong>✏️ Modification & Cancellation</strong><br>You can find all information regarding modification or cancellation of an activity on the link below:<br><a href="/faq" class="chat-link">ℹ️ Information modification / cancellation</a>',
          'To modify or cancel a reservation please <strong>prepare your reservation ticket with you</strong> and then click on the button 🟩 below to chat via WhatsApp with an advisor.<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '✏️ Modification / Cancellation 🕐 Online from 9:45 AM to 9:00 PM',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like to modify or cancel a reservation. Can you help me? Thank you.'
            )}`,
          },
          { type: 'goto', text: '👈🏽 Go back', value: 6 },
        ],
      },

      10: {
        content: [
          'Do you need anything else? 🤔<br>Select a department below to chat directly on WhatsApp:',
        ],
        options: [
          {
            type: 'link',
            text: '🚐 Transfers (☀️ Day) 🕐 Online from 7:30 AM to 8:00 PM',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding daytime airport transfers.'
            )}`,
          },
          {
            type: 'link',
            text: '🚐 Transfers (🌙 Night) 🕐 Online from 1:00 AM to 5:30 AM',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding night transfers.'
            )}`,
          },
          {
            type: 'link',
            text: '✈️ Passport 🇪🇬 Cairo & Luxor',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding Cairo and Luxor tours.'
            )}`,
          },
          {
            type: 'link',
            text: '🙋🏻‍♂️ Send a message / Suggestion / Feedback',
            value: '/contact',
          },
          { type: 'goto', text: '👈🏽 Go back', value: 6 },
        ],
      },
    }),
    [whatsappNumber]
  );

  const activeStep = funnelSteps[currentStep] || funnelSteps[1];

  useEffect(() => {
    if (isOpen) {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStep, isOpen]);

  const handleOptionClick = (option: FunnelOption) => {
    if (option.type === 'goto') {
      setCurrentStep(Number(option.value));
    } else if (option.type === 'link') {
      const val = String(option.value);
      if (val.startsWith('/')) {
        setIsOpen(false);
        navigate(val);
      } else {
        openWhatsAppUrl(val);
      }
    }
  };

  return (
    <>
      {/* Floating Launcher Button (visible when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-[#111b21] border border-[#25D366]/40 text-white rounded-xl shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 text-sm font-medium z-10">
                {language === 'fr' ? '💬 Discutez avec nous sur WhatsApp !' : '💬 Chat with us on WhatsApp!'}
                <div className="absolute bottom-0 right-5 w-2.5 h-2.5 bg-[#111b21] border-r border-b border-[#25D366]/40 transform rotate-45 translate-y-1/2" />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 rounded-full shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label={language === 'fr' ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
            >
              <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-50" />
              <FaWhatsapp className="w-9 h-9 text-white relative z-10" />

              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-[#111b21] z-20 shadow-md">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-1.5rem)] h-[600px] max-h-[88vh] bg-[#111b21] rounded-[26px] shadow-[0_24px_70px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-white/10 ring-1 ring-black/20"
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp Chat"
          >
            {/* Header matching hurghadadream / WhatsApp exactly */}
            <div className="bg-[#1ea855] px-4 py-3.5 flex items-center justify-between text-white shadow-md select-none shrink-0">
              <div className="flex items-center gap-2.5">
                <FaWhatsapp className="w-8 h-8 text-white shrink-0" />
                <span className="font-bold text-[19px] tracking-wide">WhatsApp</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#126b3c] hover:bg-[#0e5630] active:scale-90 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label={language === 'fr' ? 'Fermer le chat' : 'Close chat'}
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#111b21] scrollbar-thin scrollbar-thumb-white/10"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37,211,102,0.03) 0%, transparent 80%)',
              }}
            >
              {/* Message Bubbles for Current Step */}
              {activeStep.content.map((htmlText, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl rounded-bl-sm p-3.5 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md animate-in fade-in slide-in-from-bottom-1 duration-200"
                >
                  {/* WhatsApp tail on the bottom-left */}
                  <div className="absolute -left-2 bottom-2.5 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />

                  <div
                    dangerouslySetInnerHTML={{ __html: htmlText }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'A') {
                        const href = target.getAttribute('href');
                        if (href && href.startsWith('/')) {
                          e.preventDefault();
                          setIsOpen(false);
                          navigate(href);
                        }
                      }
                    }}
                    className="[&_a]:text-[#25D366] [&_a]:underline [&_a]:font-medium [&_a:hover]:text-[#2ee06f] [&_strong]:text-white [&_strong]:font-semibold"
                  />
                </div>
              ))}

              {/* Options Section */}
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                {activeStep.options.map((option, idx) => {
                  const isBack =
                    option.text.includes('Revenir') ||
                    option.text.includes('Go back') ||
                    option.text.includes('Geh zurück') ||
                    option.text.includes('Volver');

                  if (isBack) {
                    return (
                      <div key={idx} className="flex justify-center pt-2 pb-1">
                        <button
                          type="button"
                          onClick={() => handleOptionClick(option)}
                          className="px-6 py-2 rounded-full border-2 border-[#16a34a] bg-[#111b21] hover:bg-[#16a34a]/20 text-[#22c55e] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        >
                          {option.text}
                        </button>
                      </div>
                    );
                  }

                  if (option.type === 'link') {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className="w-full py-3.5 px-4 bg-[#1fa855] hover:bg-[#1b964c] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center text-center text-[14.5px] leading-snug cursor-pointer"
                      >
                        {option.text}
                      </button>
                    );
                  }

                  // Default 'goto' menu option button
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left p-3.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] active:scale-[0.99] border border-white/5 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                    >
                      <span className="font-semibold text-white text-[14px] group-hover:text-[#25D366] transition-colors pr-2 leading-snug">
                        {option.text}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] shrink-0 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom WhatsApp Message Input Footer */}
            <div className="p-3 bg-[#202c33] border-t border-white/10 shrink-0">
              <form onSubmit={handleSendCustomMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={
                    language === 'fr'
                      ? 'Écrivez votre message WhatsApp...'
                      : 'Write your WhatsApp message...'
                  }
                  className="flex-1 bg-[#2a3942] text-white placeholder-gray-400 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#25D366]/60 transition-all"
                />
                <button
                  type="submit"
                  disabled={!customMessage.trim()}
                  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#25D366] flex items-center justify-center text-white transition-all cursor-pointer shrink-0 shadow-md"
                  aria-label={language === 'fr' ? 'Envoyer sur WhatsApp' : 'Send on WhatsApp'}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
