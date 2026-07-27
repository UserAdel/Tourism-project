import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, ScanLine, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  socialProfiles,
  type SocialProfile,
  type SocialProfileId,
} from '../data/socialProfiles';
import SocialPlatformIcon from './SocialPlatformIcon';

const platformStyles: Record<SocialProfileId, {
  trigger: string;
  header: string;
  close: string;
  button: string;
  logo: string;
  qrColor: string;
}> = {
  instagram: {
    trigger: 'bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#fcb045] text-white',
    header: 'bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#fcb045] text-white',
    close: 'bg-white/15 text-white hover:bg-white/25',
    button: 'bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#f77737] text-white',
    logo: 'text-[#c13584]',
    qrColor: '#6f287c',
  },
  tiktok: {
    trigger: 'border border-[#25f4ee] bg-[#101010] text-white [box-shadow:3px_3px_0_#fe2c55]',
    header: 'text-white [background:radial-gradient(circle_at_88%_5%,rgba(37,244,238,0.2),transparent_34%),radial-gradient(circle_at_8%_100%,rgba(254,44,85,0.2),transparent_40%),#101010]',
    close: 'bg-white/10 text-white hover:bg-white/20',
    button: 'bg-[#101010] text-white hover:bg-black',
    logo: 'text-black',
    qrColor: '#101010',
  },
  snapchat: {
    trigger: 'bg-[#fffc00] text-black',
    header: 'bg-gradient-to-br from-[#fffc00] to-[#fff86b] text-black',
    close: 'bg-black/10 text-black hover:bg-black/20',
    button: 'bg-[#fffc00] text-black hover:bg-[#f2ef00]',
    logo: 'text-black',
    qrColor: '#000000',
  },
};

export default function FloatingSocialQr() {
  const { language } = useLanguage();
  const [activeProfile, setActiveProfile] = useState<SocialProfile | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeProfile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProfile(null);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>('button, a[href]'),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [activeProfile]);

  const openProfileQr = (
    profile: SocialProfile,
    trigger: HTMLButtonElement,
  ) => {
    lastTriggerRef.current = trigger;
    setActiveProfile(profile);
  };

  const modal = createPortal(
    <AnimatePresence>
      {activeProfile && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020a18]/85 p-4 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveProfile(null);
          }}
        >
          <motion.section
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="social-qr-modal-title"
            aria-describedby="social-qr-modal-description"
            className="my-auto w-full max-w-[410px] overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.38)] ring-1 ring-white/15 dark:bg-[#071530]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={`relative overflow-hidden px-6 pb-24 pt-6 ${platformStyles[activeProfile.id].header}`}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border-[30px] border-current opacity-[0.08]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-current opacity-[0.06]"
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-white/15 shadow-sm backdrop-blur-sm">
                    <SocialPlatformIcon id={activeProfile.id} className="h-8 w-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-65">
                      {language === 'fr' ? 'Profil officiel' : 'Social profile'}
                    </p>
                    <h2 id="social-qr-modal-title" className="mt-0.5 text-2xl font-bold">
                      {activeProfile.name}
                    </h2>
                    <p className="truncate text-sm font-medium opacity-80">
                      {activeProfile.handle}
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveProfile(null)}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-current ${platformStyles[activeProfile.id].close}`}
                  aria-label={language === 'fr' ? 'Fermer' : 'Close'}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative -mt-20 px-5 pb-6 text-center sm:px-7 sm:pb-7">
              <div className="mx-auto w-fit rounded-[1.75rem] bg-white p-3 shadow-[0_18px_45px_rgba(2,10,24,0.2)] ring-1 ring-black/5">
                <div className="relative overflow-hidden rounded-2xl">
                  <QRCodeSVG
                    value={activeProfile.url}
                    size={220}
                    level="H"
                    marginSize={3}
                    bgColor="#ffffff"
                    fgColor={platformStyles[activeProfile.id].qrColor}
                    title={`${activeProfile.name} ${activeProfile.handle}`}
                    className="h-auto w-full max-w-[220px]"
                  />
                  <div
                    className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-black/10 ${platformStyles[activeProfile.id].logo}`}
                    aria-hidden="true"
                  >
                    <SocialPlatformIcon id={activeProfile.id} className="h-7 w-7" />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--section-soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--teal)] dark:bg-white/10 dark:text-[var(--turquoise)]">
                  <ScanLine className="h-4 w-4" aria-hidden="true" />
                  {language === 'fr' ? 'Prêt à scanner' : 'Ready to scan'}
                </div>
                <h3 className="text-2xl font-bold text-[var(--navy)] dark:text-white">
                  {language === 'fr'
                    ? `Suivez-nous sur ${activeProfile.name}`
                    : `Follow us on ${activeProfile.name}`}
                </h3>
                <p
                  id="social-qr-modal-description"
                  className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                >
                  {language === 'fr'
                    ? 'Scannez ce code avec l’appareil photo de votre téléphone.'
                    : 'Scan this code with your phone camera to open our profile.'}
                </p>
              </div>

              <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                {language === 'fr' ? 'ou' : 'or'}
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
              </div>

              <a
                href={activeProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--turquoise)]/30 ${platformStyles[activeProfile.id].button}`}
              >
                {language === 'fr' ? 'Ouvrir sur cet appareil' : 'Open on this device'}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );

  return (
    <>
      <div
        className="fixed bottom-24 left-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:left-6"
        aria-label={language === 'fr' ? 'Réseaux sociaux' : 'Social media'}
      >
        {socialProfiles.map((profile) => (
          <div key={profile.id} className="group relative">
            <button
              type="button"
              onClick={(event) => openProfileQr(profile, event.currentTarget)}
              className={`flex h-13 w-13 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/70 sm:h-14 sm:w-14 ${platformStyles[profile.id].trigger}`}
              aria-label={`${language === 'fr' ? 'Afficher le QR code' : 'Show QR code'} ${profile.name}`}
              aria-haspopup="dialog"
              aria-expanded={activeProfile?.id === profile.id}
              title={profile.name}
            >
              <SocialPlatformIcon id={profile.id} className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            <div
              className="pointer-events-none absolute bottom-1/2 left-full ml-3 hidden translate-y-1/2 whitespace-nowrap rounded-lg bg-[#071530] px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
              aria-hidden="true"
            >
              {profile.name}
            </div>
          </div>
        ))}
      </div>

      {modal}
    </>
  );
}
