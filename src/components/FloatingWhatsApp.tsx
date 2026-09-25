import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { X, Send, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

type ChatScreen = 'menu' | 'modification' | 'booking' | 'advisor';

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ChatScreen>('menu');
  const [customMessage, setCustomMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const isFr = language === 'fr';
  const whatsappNumber = '201234567890';

  const openWhatsApp = (text?: string) => {
    const defaultText = isFr
      ? 'Bonjour, je souhaite avoir des informations sur vos excursions à Hurghada.'
      : 'Hello, I would like information about your excursions in Hurghada.';
    const message = text || defaultText;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    openWhatsApp(customMessage.trim());
    setCustomMessage('');
  };

  useEffect(() => {
    if (isOpen) {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentScreen, isOpen]);

  return (
    <>
      {/* Floating Launcher Button (visible when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-[#111b21] border border-[#25D366]/40 text-white rounded-xl shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 text-sm font-medium z-10">
                {isFr ? '💬 Discutez avec nous sur WhatsApp !' : '💬 Chat with us on WhatsApp!'}
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
              aria-label={isFr ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
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
            className="fixed bottom-6 right-6 z-50 w-[365px] max-w-[calc(100vw-1.5rem)] h-[585px] max-h-[88vh] bg-[#111b21] rounded-[26px] shadow-[0_24px_70px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-white/10 ring-1 ring-black/20"
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp Chat"
          >
            {/* Header */}
            <div className="bg-[#1ea855] px-4 py-3.5 flex items-center justify-between text-white shadow-md select-none shrink-0">
              <div className="flex items-center gap-2.5">
                <FaWhatsapp className="w-8 h-8 text-white shrink-0" />
                <span className="font-bold text-[19px] tracking-wide">WhatsApp</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#126b3c] hover:bg-[#0e5630] active:scale-90 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label={isFr ? 'Fermer le chat' : 'Close chat'}
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#111b21] scrollbar-thin scrollbar-thumb-white/10"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37,211,102,0.03) 0%, transparent 80%)',
              }}
            >
              {/* Screen: Modification & Annulation (Exact replica from user screenshot) */}
              {currentScreen === 'modification' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Bubble 1 */}
                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    {/* Tail */}
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />
                    
                    <p className="font-bold text-white text-[15px] mb-1.5 flex items-center gap-1.5">
                      <span>✏️</span>
                      <span>{isFr ? 'Modification & Annulation' : 'Reschedule & Cancellation'}</span>
                    </p>
                    <p className="text-gray-200 mb-2.5">
                      {isFr
                        ? "Vous pouvez trouver toutes les informations concernant la modification ou l'annulation d'une activité sur le lien ci-dessous"
                        : 'You can find all information regarding modification or cancellation of an activity on the link below'}
                    </p>
                    <Link
                      to="/faq"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#2ee06f] underline font-medium text-[13.5px] transition-colors"
                    >
                      <span>ℹ️</span>
                      <span>{isFr ? 'Information modification / annulation' : 'Modification / cancellation information'}</span>
                    </Link>
                  </div>

                  {/* Bubble 2 */}
                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    {/* Tail */}
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />

                    <p className="text-gray-200">
                      {isFr ? (
                        <>
                          Pour modifier ou annuler une réservation veuillez <strong className="text-white font-semibold">préparer votre ticket de réservation avec vous</strong> et puis cliquer sur le bouton 🟩 ci-dessous pour discuter via WhatsApp à un conseiller.
                        </>
                      ) : (
                        <>
                          To modify or cancel a reservation please <strong className="text-white font-semibold">have your booking ticket ready</strong> and then click the button 🟩 below to chat via WhatsApp with an advisor.
                        </>
                      )}
                    </p>
                    <p className="mt-2 text-base tracking-widest">👇👇👇👇</p>
                  </div>

                  {/* Main Action Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(
                        isFr
                          ? 'Bonjour, je souhaite modifier ou annuler ma réservation. Voici mon ticket :'
                          : 'Hello, I would like to modify or cancel my reservation. Here is my booking ticket:'
                      )}
                      className="w-full py-3.5 px-4 bg-[#1fa855] hover:bg-[#1b964c] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center text-center text-[14.5px] leading-snug cursor-pointer"
                    >
                      {isFr
                        ? '✏️ Modification / Annulation 🕗 En ligne de 9h45 à 21h'
                        : '✏️ Reschedule / Cancel 🕗 Online 9:45 AM to 9:00 PM'}
                    </button>
                  </div>

                  {/* Back Button */}
                  <div className="flex justify-center pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('menu')}
                      className="px-6 py-2 rounded-full border-2 border-[#16a34a] bg-[#111b21] hover:bg-[#16a34a]/20 text-[#22c55e] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>👈</span>
                      <span>{isFr ? 'Revenir en arrière' : 'Go back'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Screen: Réserver une excursion */}
              {currentScreen === 'booking' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />
                    <p className="font-bold text-white text-[15px] mb-1.5 flex items-center gap-1.5">
                      <span>🌴</span>
                      <span>{isFr ? 'Réserver une excursion' : 'Book an excursion'}</span>
                    </p>
                    <p className="text-gray-200 mb-2">
                      {isFr
                        ? 'Toutes nos excursions sont guidées en français avec transfert hôtel aller-retour inclus (Orange Bay, Louxor, Nager avec les dauphins, Safari...)'
                        : 'All our excursions are guided in French with round-trip hotel transfer included (Orange Bay, Luxor, Dolphins, Safari...)'}
                    </p>
                    <Link
                      to="/activities"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#2ee06f] underline font-medium text-[13.5px]"
                    >
                      <span>👉</span>
                      <span>{isFr ? 'Voir toutes nos excursions' : 'View all excursions'}</span>
                    </Link>
                  </div>

                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />
                    <p className="text-gray-200">
                      {isFr
                        ? 'Cliquez ci-dessous pour discuter directement avec notre équipe et bloquer vos dates sans paiement d’avance :'
                        : 'Click below to chat directly with our booking team and secure your dates:'}
                    </p>
                    <p className="mt-2 text-base tracking-widest">👇👇👇👇</p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(
                        isFr
                          ? 'Bonjour, je souhaite réserver une excursion à Hurghada.'
                          : 'Hello, I would like to book an excursion in Hurghada.'
                      )}
                      className="w-full py-3.5 px-4 bg-[#1fa855] hover:bg-[#1b964c] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center text-center text-[14.5px] leading-snug cursor-pointer"
                    >
                      {isFr
                        ? '🌴 Réserver via WhatsApp 🕗 En ligne de 9h45 à 21h'
                        : '🌴 Book via WhatsApp 🕗 Online 9:45 AM to 9:00 PM'}
                    </button>
                  </div>

                  <div className="flex justify-center pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('menu')}
                      className="px-6 py-2 rounded-full border-2 border-[#16a34a] bg-[#111b21] hover:bg-[#16a34a]/20 text-[#22c55e] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>👈</span>
                      <span>{isFr ? 'Revenir en arrière' : 'Go back'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Screen: Parler à un conseiller */}
              {currentScreen === 'advisor' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />
                    <p className="font-bold text-white text-[15px] mb-1.5 flex items-center gap-1.5">
                      <span>💬</span>
                      <span>{isFr ? 'Conseiller Francophone' : 'French-Speaking Advisor'}</span>
                    </p>
                    <p className="text-gray-200">
                      {isFr
                        ? 'Une question sur les excursions, les horaires, les tarifs de groupe ou les conseils personnalisés ? Notre équipe locale est à votre disposition.'
                        : 'Questions about excursions, timings, group rates or custom requests? Our local team is ready to help.'}
                    </p>
                    <p className="mt-2 text-base tracking-widest">👇👇👇👇</p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(
                        isFr
                          ? "Bonjour, j'aimerais poser une question à un conseiller."
                          : 'Hello, I have a question for an advisor.'
                      )}
                      className="w-full py-3.5 px-4 bg-[#1fa855] hover:bg-[#1b964c] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center text-center text-[14.5px] leading-snug cursor-pointer"
                    >
                      {isFr
                        ? '💬 Discuter sur WhatsApp 🕗 En ligne de 9h45 à 21h'
                        : '💬 Chat on WhatsApp 🕗 Online 9:45 AM to 9:00 PM'}
                    </button>
                  </div>

                  <div className="flex justify-center pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('menu')}
                      className="px-6 py-2 rounded-full border-2 border-[#16a34a] bg-[#111b21] hover:bg-[#16a34a]/20 text-[#22c55e] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>👈</span>
                      <span>{isFr ? 'Revenir en arrière' : 'Go back'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Screen: Menu Principal */}
              {currentScreen === 'menu' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Greeting Bubble */}
                  <div className="relative rounded-2xl rounded-bl-sm p-4 bg-[#384044] text-[#f1f5f9] text-[14px] leading-relaxed shadow-md">
                    <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#384044] border-b-[5px] border-b-transparent" />
                    <p className="font-bold text-white text-[15px] mb-1">
                      {isFr ? 'Bonjour 👋' : 'Hello 👋'}
                    </p>
                    <p className="text-gray-200">
                      {isFr ? (
                        <>Bienvenue chez <strong className="text-white">Hurghada French Guide</strong> 🌴 Comment pouvons-nous vous aider aujourd’hui ?</>
                      ) : (
                        <>Welcome to <strong className="text-white">Hurghada French Guide</strong> 🌴 How can we help you today?</>
                      )}
                    </p>
                  </div>

                  {/* Menu Options List */}
                  <div className="space-y-2 pt-1">
                    {/* Option 1: Modification & Annulation */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('modification')}
                      className="w-full text-left p-3.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] active:scale-[0.99] border border-white/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 text-[#fbbf24] flex items-center justify-center text-lg shrink-0">
                          ✏️
                        </div>
                        <div>
                          <div className="font-semibold text-white text-[14.5px] group-hover:text-[#25D366] transition-colors">
                            {isFr ? 'Modification & Annulation' : 'Reschedule & Cancellation'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isFr ? 'Modifier ou annuler une activité' : 'Modify or cancel an excursion'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                    </button>

                    {/* Option 2: Réserver une excursion */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('booking')}
                      className="w-full text-left p-3.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] active:scale-[0.99] border border-white/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center text-lg shrink-0">
                          🌴
                        </div>
                        <div>
                          <div className="font-semibold text-white text-[14.5px] group-hover:text-[#25D366] transition-colors">
                            {isFr ? 'Réserver une excursion' : 'Book an excursion'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isFr ? 'Orange Bay, Louxor, Dauphins, Safari...' : 'Orange Bay, Luxor, Dolphins, Safari...'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                    </button>

                    {/* Option 3: Discuter avec un conseiller */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('advisor')}
                      className="w-full text-left p-3.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] active:scale-[0.99] border border-white/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                          💬
                        </div>
                        <div>
                          <div className="font-semibold text-white text-[14.5px] group-hover:text-[#25D366] transition-colors">
                            {isFr ? 'Discuter avec un conseiller' : 'Chat with an advisor'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isFr ? 'Réponse rapide en français sur WhatsApp' : 'Quick reply in French on WhatsApp'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                    </button>

                    {/* Option 4: FAQ */}
                    <Link
                      to="/faq"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left p-3.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] active:scale-[0.99] border border-white/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#a855f7]/15 text-[#c084fc] flex items-center justify-center text-lg shrink-0">
                          ℹ️
                        </div>
                        <div>
                          <div className="font-semibold text-white text-[14.5px] group-hover:text-[#25D366] transition-colors">
                            {isFr ? 'Questions Fréquentes (FAQ)' : 'Frequently Asked Questions'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isFr ? 'Horaires, transferts, repas, météo...' : 'Timings, transfers, meals, weather...'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Message Input Footer */}
            <div className="p-3 bg-[#202c33] border-t border-white/10 shrink-0">
              <form onSubmit={handleSendCustomMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={isFr ? 'Écrivez votre message WhatsApp...' : 'Write your WhatsApp message...'}
                  className="flex-1 bg-[#2a3942] text-white placeholder-gray-400 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#25D366]/60 transition-all"
                />
                <button
                  type="submit"
                  disabled={!customMessage.trim()}
                  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#25D366] flex items-center justify-center text-white transition-all cursor-pointer shrink-0 shadow-md"
                  aria-label={isFr ? 'Envoyer sur WhatsApp' : 'Send on WhatsApp'}
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
