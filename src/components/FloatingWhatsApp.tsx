import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCheck,
  Globe,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface FunnelOption {
  type: 'goto' | 'link';
  text: string;
  value: number | string;
  icon?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  theme?: 'emerald' | 'amber' | 'indigo' | 'sky' | 'teal' | 'slate';
  onlineHours?: string;
  isPrimaryCta?: boolean;
  isBack?: boolean;
  isLanguage?: boolean;
}

interface FunnelStep {
  content: string[];
  options: FunnelOption[];
}

export default function FloatingWhatsApp() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  // Current formatted time for WhatsApp message receipts (e.g. "13:45")
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const openWhatsAppUrl = (urlOrText: string) => {
    let finalUrl = urlOrText;
    if (!urlOrText.startsWith('http')) {
      finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(urlOrText)}`;
    }
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  // Funnel decision tree tailored to Hurghada French Guide luxury branding
  const funnelSteps: Record<number, FunnelStep> = useMemo(
    () => ({
      // STEP 0: Language selection
      0: {
        content: [
          '👋 <strong>Bienvenue / Welcome !</strong> 😊',
          'Veuillez sélectionner votre langue / Please select your preferred language :',
        ],
        options: [
          {
            type: 'goto',
            text: '🇫🇷 Continuer en français',
            title: 'Français',
            subtitle: 'Guides francophones certifiés & conciergerie locale',
            badge: 'Guide 🇫🇷',
            icon: '🇫🇷',
            theme: 'emerald',
            value: 1,
          },
          {
            type: 'goto',
            text: '🇬🇧 Continue in English',
            title: 'English',
            subtitle: 'English-speaking expert guides & live WhatsApp booking',
            badge: 'Guide 🇬🇧',
            icon: '🇬🇧',
            theme: 'sky',
            value: 6,
          },
        ],
      },

      // FRENCH FLOW (Steps 1 to 5)
      1: {
        content: [
          "👋 <strong>Bonjour et Bienvenue !</strong>",
          "L'agence n°1 🇫🇷 d'activités & séjours à Hurghada.<br>Que souhaitez-vous faire aujourd'hui ?",
        ],
        options: [
          {
            type: 'goto',
            text: '🏝️ Je souhaite réserver une ou plusieurs activités',
            title: 'Réserver des activités',
            subtitle: 'Orange Bay, Louxor, Dauphins, Safari...',
            badge: 'Top Activités',
            icon: '🏝️',
            theme: 'emerald',
            value: 2,
          },
          {
            type: 'goto',
            text: '🏨 Je souhaite réserver un hôtel',
            title: 'Réserver un hôtel',
            subtitle: 'Hôtels 4★ & 5★ aux tarifs négociés',
            badge: 'Meilleurs Prix',
            icon: '🏨',
            theme: 'amber',
            value: 3,
          },
          {
            type: 'goto',
            text: '✏️ Je souhaite modifier ou annuler une réservation',
            title: 'Modifier ou annuler',
            subtitle: 'Gestion rapide avec votre ticket de résa',
            badge: 'Service Client',
            icon: '✏️',
            theme: 'indigo',
            value: 4,
          },
          {
            type: 'goto',
            text: '🤙🏽 Autre demande',
            title: 'Autre demande & Transferts',
            subtitle: 'Navettes aéroport, circuits Le Caire, devis VIP...',
            badge: '7j/7',
            icon: '🤙🏽',
            theme: 'sky',
            value: 5,
          },
          {
            type: 'goto',
            text: '👈🏽 Changer de langue',
            title: 'Changer de langue',
            subtitle: 'Switch language to English (🇬🇧 EN)',
            badge: 'FR ⇄ EN',
            icon: '🌐',
            theme: 'teal',
            isLanguage: true,
            value: 0,
          },
        ],
      },

      2: {
        content: [
          '<strong>🏝️ Réserver une excursion</strong><br>Retrouvez toutes nos activités incontournables (Orange Bay, Louxor, Safari quad, Nage avec les dauphins...) sur notre catalogue avec guides francophones certifiés.',
          'Pour réserver immédiatement ou vérifier les disponibilités, échangez directement avec notre équipe sur WhatsApp :<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '🗣️ Réserver avec un conseiller 🕐 En ligne de 9h45 à 21h',
            title: 'Discuter avec un conseiller WhatsApp',
            subtitle: 'Réponse rapide & réservation instantanée',
            onlineHours: 'En ligne de 9h45 à 21h00',
            icon: '💬',
            isPrimaryCta: true,
            theme: 'emerald',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais avoir des informations pour réserver une ou plusieurs activités à Hurghada. Merci."
            )}`,
          },
          {
            type: 'link',
            text: '👉🏽 Voir toutes les activités sur le site',
            title: 'Consulter le catalogue en ligne',
            subtitle: 'Photos, avis, programmes détaillés & tarifs',
            icon: '🏝️',
            theme: 'teal',
            value: '/activities',
          },
          {
            type: 'goto',
            text: '👈🏽 Revenir au menu principal',
            title: 'Revenir au menu principal',
            isBack: true,
            value: 1,
          },
        ],
      },

      3: {
        content: [
          '<strong>🏨 Réservation d\'hôtel à Hurghada</strong><br>Hurghada French Guide vous fait bénéficier de tarifs négociés exclusifs sur les plus beaux complexes et resorts de la Mer Rouge ! 🤑<br>Contactez notre spécialiste hôtel sur WhatsApp pour recevoir une sélection personnalisée :',
        ],
        options: [
          {
            type: 'link',
            text: "🏨 Réservation d'hôtel 🕐 En ligne de 10h à 20h",
            title: 'Contacter le spécialiste Hôtels',
            subtitle: 'Sélection sur-mesure & meilleurs tarifs garantis',
            onlineHours: 'En ligne de 10h00 à 20h00',
            icon: '🏨',
            isPrimaryCta: true,
            theme: 'amber',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais réserver un hôtel pour Hurghada. Que pouvez-vous me proposer ? Merci."
            )}`,
          },
          {
            type: 'goto',
            text: '👈🏽 Revenir au menu principal',
            title: 'Revenir au menu principal',
            isBack: true,
            value: 1,
          },
        ],
      },

      4: {
        content: [
          '<strong>✏️ Modification & Annulation</strong><br>Pour traiter votre demande dans les meilleures conditions, veuillez vous munir de votre <strong>ticket de réservation</strong> reçu par email ou WhatsApp.',
          'Cliquez ci-dessous pour discuter directement avec notre service clientèle :<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '✏️ Modification / Annulation 🕐 En ligne de 9h45 à 21h',
            title: 'Joindre le support Réservations',
            subtitle: 'Munissez-vous de votre référence de réservation',
            onlineHours: 'En ligne de 9h45 à 21h00',
            icon: '✏️',
            isPrimaryCta: true,
            theme: 'indigo',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Bonjour, j'aimerais modifier/annuler une réservation. Pouvez-vous m'aider ? Merci."
            )}`,
          },
          {
            type: 'link',
            text: 'ℹ️ Consulter les conditions d\'annulation (FAQ)',
            title: 'Conditions d\'annulation & Délais (FAQ)',
            subtitle: 'Modalités de remboursement et politiques',
            icon: 'ℹ️',
            theme: 'slate',
            value: '/faq',
          },
          {
            type: 'goto',
            text: '👈🏽 Revenir au menu principal',
            title: 'Revenir au menu principal',
            isBack: true,
            value: 1,
          },
        ],
      },

      5: {
        content: [
          '<strong>🤙🏽 Autre demande & Services</strong><br>Sélectionnez ci-dessous le service concerné pour contacter directement le bon interlocuteur :',
        ],
        options: [
          {
            type: 'link',
            text: '🚐 Transferts (☀️ Journée) 🕐 En ligne de 7h30 à 20h00',
            title: 'Transferts Aéroport (☀️ Journée)',
            subtitle: 'Chauffeur privé, van climatisé & accueil ponctuel',
            onlineHours: '7h30 à 20h00',
            icon: '🚐',
            theme: 'sky',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite réserver ou avoir des informations sur un transfert journée à Hurghada.'
            )}`,
          },
          {
            type: 'link',
            text: '🚐 Transferts (🌙 Nuit) 🕐 En ligne de 1h à 5h30',
            title: 'Transferts Aéroport (🌙 Nuit)',
            subtitle: 'Prise en charge nocturne 7j/7 pour vos vols tardifs',
            onlineHours: '1h00 à 5h30',
            icon: '🌙',
            theme: 'indigo',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite réserver ou avoir des informations sur un transfert de nuit à Hurghada.'
            )}`,
          },
          {
            type: 'link',
            text: '✈️ Passeport 🇪🇬 Le Caire & Louxor',
            title: 'Le Caire & Louxor (Excursions culturelles)',
            subtitle: 'Visites guidées des pyramides, musées et temples',
            icon: '✈️',
            theme: 'amber',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Bonjour, je souhaite des informations concernant les excursions Le Caire et Louxor.'
            )}`,
          },
          {
            type: 'link',
            text: '🙋🏻‍♂️ Envoyer un message / Une remarque / Une suggestion',
            title: 'Formulaire de contact en ligne',
            subtitle: 'Envoyer une remarque, suggestion ou demande spéciale',
            icon: '✍️',
            theme: 'slate',
            value: '/contact',
          },
          {
            type: 'goto',
            text: '👈🏽 Revenir au menu principal',
            title: 'Revenir au menu principal',
            isBack: true,
            value: 1,
          },
        ],
      },

      // ENGLISH FLOW (Steps 6 to 10)
      6: {
        content: [
          '👋 <strong>Hello and Welcome!</strong>',
          'The #1 French & English-speaking activities agency in Hurghada.<br>What would you like to do today?',
        ],
        options: [
          {
            type: 'goto',
            text: '🏝️ I would like to book one or more activities',
            title: 'Book Activities',
            subtitle: 'Orange Bay, Luxor, Dolphins, Quad Safari...',
            badge: 'Popular',
            icon: '🏝️',
            theme: 'emerald',
            value: 7,
          },
          {
            type: 'goto',
            text: '🏨 I want to book a hotel',
            title: 'Book a Hotel',
            subtitle: '4★ & 5★ luxury resorts at discounted rates',
            badge: 'Best Rates',
            icon: '🏨',
            theme: 'amber',
            value: 8,
          },
          {
            type: 'goto',
            text: '✏️ I want to modify or cancel a reservation',
            title: 'Modify or Cancel',
            subtitle: 'Fast support with your booking ticket',
            badge: 'Support',
            icon: '✏️',
            theme: 'indigo',
            value: 9,
          },
          {
            type: 'goto',
            text: '🤙🏽 Other request',
            title: 'Other Request & Transfers',
            subtitle: 'Airport shuttles, Cairo tours, VIP inquiries...',
            badge: '24/7',
            icon: '🤙🏽',
            theme: 'sky',
            value: 10,
          },
          {
            type: 'goto',
            text: '👈🏽 Change language',
            title: 'Change Language',
            subtitle: 'Passer en français (🇫🇷 FR)',
            badge: 'EN ⇄ FR',
            icon: '🌐',
            theme: 'teal',
            isLanguage: true,
            value: 0,
          },
        ],
      },

      7: {
        content: [
          '<strong>🏝️ Book an Activity</strong><br>Discover all our top-rated excursions (Orange Bay, Luxor, Quad Safari, Dolphin Swim...) on our online catalog.',
          'To check availability or book directly, chat live with our advisors on WhatsApp:<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '🗣️ Book with an advisor 🕐 Online from 9:45 AM to 9:00 PM',
            title: 'Chat with a WhatsApp Advisor',
            subtitle: 'Instant booking & friendly personalized service',
            onlineHours: 'Online 9:45 AM to 9:00 PM',
            icon: '💬',
            isPrimaryCta: true,
            theme: 'emerald',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information to book activities in Hurghada. Thank you.'
            )}`,
          },
          {
            type: 'link',
            text: '👉🏽 Browse all activities on site',
            title: 'Explore Full Catalog',
            subtitle: 'Photos, itineraries, customer reviews & pricing',
            icon: '🏝️',
            theme: 'teal',
            value: '/activities',
          },
          {
            type: 'goto',
            text: '👈🏽 Go back',
            title: 'Back to main menu',
            isBack: true,
            value: 6,
          },
        ],
      },

      8: {
        content: [
          '<strong>🏨 Hotel Reservation</strong><br>Hurghada French Guide offers quality 4★ & 5★ resort stays at exclusive discounted prices! 🤑<br>Chat with our hotel desk on WhatsApp to get the best custom deal for your trip:',
        ],
        options: [
          {
            type: 'link',
            text: '🏨 Hotel reservation 🕐 Online from 10:00 AM to 8:00 PM',
            title: 'Contact Hotel Booking Desk',
            subtitle: 'Custom recommendations & best rates guarantee',
            onlineHours: 'Online 10:00 AM to 8:00 PM',
            icon: '🏨',
            isPrimaryCta: true,
            theme: 'amber',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like to book a hotel in Hurghada. What can you recommend? Thank you.'
            )}`,
          },
          {
            type: 'goto',
            text: '👈🏽 Go back',
            title: 'Back to main menu',
            isBack: true,
            value: 6,
          },
        ],
      },

      9: {
        content: [
          '<strong>✏️ Modification & Cancellation</strong><br>Please have your <strong>booking ticket</strong> or customer reference ready so our support team can assist you right away.',
          'Click below to chat with an advisor on WhatsApp:<br>👇🏽👇🏽👇🏽👇🏽',
        ],
        options: [
          {
            type: 'link',
            text: '✏️ Modification / Cancellation 🕐 Online from 9:45 AM to 9:00 PM',
            title: 'Contact Booking Support Desk',
            subtitle: 'Have your booking confirmation reference handy',
            onlineHours: 'Online 9:45 AM to 9:00 PM',
            icon: '✏️',
            isPrimaryCta: true,
            theme: 'indigo',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like to modify or cancel a reservation. Can you help me? Thank you.'
            )}`,
          },
          {
            type: 'link',
            text: 'ℹ️ View FAQ Cancellation Policy',
            title: 'Cancellation & Refund Terms (FAQ)',
            subtitle: 'Refund conditions, delays and policies',
            icon: 'ℹ️',
            theme: 'slate',
            value: '/faq',
          },
          {
            type: 'goto',
            text: '👈🏽 Go back',
            title: 'Back to main menu',
            isBack: true,
            value: 6,
          },
        ],
      },

      10: {
        content: [
          '<strong>🤙🏽 Other Requests & Department Services</strong><br>Looking for airport shuttles or special tours? Choose a department below to connect immediately:',
        ],
        options: [
          {
            type: 'link',
            text: '🚐 Transfers (☀️ Day) 🕐 Online from 7:30 AM to 8:00 PM',
            title: 'Airport Transfers (☀️ Day)',
            subtitle: 'Private air-conditioned vehicle & on-time pickup',
            onlineHours: '7:30 AM to 8:00 PM',
            icon: '🚐',
            theme: 'sky',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding daytime airport transfers.'
            )}`,
          },
          {
            type: 'link',
            text: '🚐 Transfers (🌙 Night) 🕐 Online from 1:00 AM to 5:30 AM',
            title: 'Airport Transfers (🌙 Night)',
            subtitle: 'Safe 24/7 late-night & early-morning transfers',
            onlineHours: '1:00 AM to 5:30 AM',
            icon: '🌙',
            theme: 'indigo',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding night transfers.'
            )}`,
          },
          {
            type: 'link',
            text: '✈️ Passport 🇪🇬 Cairo & Luxor',
            title: 'Cairo & Luxor Cultural Tours',
            subtitle: 'Full-day tours to the Pyramids, Valley of the Kings...',
            icon: '✈️',
            theme: 'amber',
            value: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello, I would like information regarding Cairo and Luxor tours.'
            )}`,
          },
          {
            type: 'link',
            text: '🙋🏻‍♂️ Send a message / Suggestion / Feedback',
            title: 'Online Contact Form',
            subtitle: 'Send feedback, suggestions or custom queries',
            icon: '✍️',
            theme: 'slate',
            value: '/contact',
          },
          {
            type: 'goto',
            text: '👈🏽 Go back',
            title: 'Back to main menu',
            isBack: true,
            value: 6,
          },
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
      const nextStep = Number(option.value);
      // Auto-sync language if user selects a language in step 0
      if (nextStep === 1) {
        setLanguage('fr');
      } else if (nextStep === 6) {
        setLanguage('en');
      }
      setCurrentStep(nextStep);
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

  // Coastal Red Sea Brand Theming matching Hurghada French Guide colors
  const getThemeStyles = (theme?: FunnelOption['theme']) => {
    switch (theme) {
      case 'emerald':
        // Signature Coastal Turquoise & Marine Teal
        return {
          cardBg:
            'from-[#0b2832]/95 via-[#0e323e]/90 to-[#081f27]/95 hover:from-[#114050] hover:via-[#144859] hover:to-[#0a2934]',
          border: 'border-[#159c92]/35 hover:border-[#159c92]/90',
          iconBox:
            'bg-gradient-to-br from-[#159c92]/30 to-[#0b5361]/20 border border-[#159c92]/45 text-[#2ee06f] shadow-[0_0_18px_rgba(21,156,146,0.3)]',
          badge: 'bg-[#159c92]/20 text-[#38e8be] border border-[#159c92]/40',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(21,156,146,0.28)]',
          arrow: 'group-hover:bg-[#159c92] group-hover:text-white',
        };
      case 'amber':
        // Egyptian Warm Desert Gold & Sand
        return {
          cardBg:
            'from-[#231e13]/95 via-[#2b2516]/90 to-[#1a160d]/95 hover:from-[#362f1c] hover:via-[#3d341f] hover:to-[#221c0e]',
          border: 'border-[#d5a34f]/35 hover:border-[#d5a34f]/90',
          iconBox:
            'bg-gradient-to-br from-[#d5a34f]/30 to-[#e4b76b]/15 border border-[#d5a34f]/45 text-[#f5c364] shadow-[0_0_18px_rgba(213,163,79,0.3)]',
          badge: 'bg-[#d5a34f]/20 text-[#fcd34d] border border-[#d5a34f]/40',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(213,163,79,0.28)]',
          arrow: 'group-hover:bg-[#d5a34f] group-hover:text-white',
        };
      case 'indigo':
        // Royal Sapphire Navy & Support Violet
        return {
          cardBg:
            'from-[#131b2e]/95 via-[#18233a]/90 to-[#0e1424]/95 hover:from-[#1d2948] hover:via-[#223155] hover:to-[#11182c]',
          border: 'border-indigo-400/35 hover:border-indigo-400/90',
          iconBox:
            'bg-gradient-to-br from-indigo-500/30 to-blue-600/15 border border-indigo-400/45 text-indigo-300 shadow-[0_0_18px_rgba(99,102,241,0.3)]',
          badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(99,102,241,0.28)]',
          arrow: 'group-hover:bg-indigo-500 group-hover:text-white',
        };
      case 'sky':
        // Red Sea Clear Sky & Coastal Cyan
        return {
          cardBg:
            'from-[#0a2333]/95 via-[#0e2c40]/90 to-[#071925]/95 hover:from-[#123952] hover:via-[#16425e] hover:to-[#0a2436]',
          border: 'border-sky-400/35 hover:border-sky-400/90',
          iconBox:
            'bg-gradient-to-br from-sky-500/30 to-cyan-500/15 border border-sky-400/45 text-sky-300 shadow-[0_0_18px_rgba(14,165,233,0.3)]',
          badge: 'bg-sky-500/20 text-sky-300 border border-sky-400/40',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(14,165,233,0.28)]',
          arrow: 'group-hover:bg-sky-500 group-hover:text-white',
        };
      case 'teal':
        // Deep Coral Reef Teal
        return {
          cardBg:
            'from-[#0b2729]/95 via-[#0f3235]/90 to-[#081e20]/95 hover:from-[#133e43] hover:via-[#17484e] hover:to-[#0b2729]',
          border: 'border-[#159c92]/35 hover:border-teal-300/80',
          iconBox:
            'bg-gradient-to-br from-[#159c92]/30 to-teal-400/15 border border-[#159c92]/45 text-teal-300 shadow-[0_0_18px_rgba(20,184,166,0.3)]',
          badge: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(20,184,166,0.28)]',
          arrow: 'group-hover:bg-[#159c92] group-hover:text-white',
        };
      case 'slate':
      default:
        return {
          cardBg:
            'from-[#0e212b]/95 via-[#122a36]/90 to-[#0a1820]/95 hover:from-[#183645] hover:via-[#1d3f52] hover:to-[#0e212b]',
          border: 'border-white/10 hover:border-white/35',
          iconBox: 'bg-white/10 border border-white/20 text-gray-200',
          badge: 'bg-white/10 text-gray-300 border border-white/20',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(0,0,0,0.35)]',
          arrow: 'group-hover:bg-white/20 group-hover:text-white',
        };
    }
  };

  return (
    <>
      {/* Floating Launcher Button - Luxury Brand beacon with Turquoise/Gold aura */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-3 px-4 py-2.5 bg-[#081f2a]/95 backdrop-blur-md border border-[#d5a34f]/40 text-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 text-sm font-medium z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#159c92] animate-pulse" />
                <span>
                  {language === 'fr'
                    ? '💬 Discutez en direct avec notre équipe 🇫🇷'
                    : '💬 Chat live with our team!'}
                </span>
                <div className="absolute bottom-0 right-6 w-2.5 h-2.5 bg-[#081f2a] border-r border-b border-[#d5a34f]/40 transform rotate-45 translate-y-1/2" />
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
              className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#0b5361] via-[#159c92] to-[#25D366] hover:brightness-110 active:scale-95 rounded-full shadow-[0_10px_35px_rgba(21,156,146,0.5)] border-2 border-[#d5a34f]/40 hover:border-[#d5a34f] transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label={language === 'fr' ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
            >
              <div className="absolute inset-0 rounded-full bg-[#159c92] animate-ping opacity-35" />
              <FaWhatsapp className="w-8 h-8 text-white relative z-10 drop-shadow-md" />

              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-[#071a26] z-20 shadow-md">
                <span className="text-white text-[11px] font-bold">1</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Widget Modal - Infused with Hurghada French Guide Brand Aesthetics */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[390px] max-w-[calc(100vw-1.5rem)] h-[620px] max-h-[88vh] bg-[#071a26]/95 backdrop-blur-xl rounded-[28px] shadow-[0_25px_80px_rgba(7,26,38,0.9)] flex flex-col overflow-hidden border border-[#159c92]/30 ring-1 ring-[#d5a34f]/25"
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp Chat"
          >
            {/* Elevated Branded Header - Marine Navy & Warm Gold Accent */}
            <div className="relative bg-gradient-to-r from-[#07242f] via-[#0b3c48] to-[#082a35] px-4 py-3.5 flex items-center justify-between text-white shadow-lg select-none shrink-0 border-b border-[#159c92]/25">
              {/* Subtle Gold Brand Accent Line at bottom of header */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d5a34f] to-transparent opacity-75" />

              <div className="flex items-center gap-3 min-w-0">
                {/* Official Brand Avatar with Gold Ring & Pulsing Status */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#d5a34f] via-[#159c92] to-white shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#07242f] overflow-hidden flex items-center justify-center p-0.5">
                      <img
                        src="/logo.png"
                        alt="Hurghada French Guide"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  {/* Pulsing Green Online Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#07242f] rounded-full ring-1 ring-[#d5a34f]/60 animate-pulse" />
                </div>

                {/* Title & Concierge Status */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14.5px] leading-tight text-white tracking-wide truncate">
                    Hurghada French Guide
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#2dd4bf] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                    <span className="truncate">
                      {language === 'fr'
                        ? 'Conciergerie 🇫🇷 • En direct'
                        : 'Concierge Service • Live'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-white/10"
                  aria-label={language === 'fr' ? 'Fermer le chat' : 'Close chat'}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body with Luxury Marine & Desert Sand ambiance */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#071a26] scrollbar-thin scrollbar-thumb-[#159c92]/20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 20%, rgba(21,156,146,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(213,163,79,0.05) 0%, transparent 50%), radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 100% 100%, 22px 22px',
              }}
            >
              {/* Message Bubbles for Current Step */}
              {activeStep.content.map((htmlText, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl rounded-bl-sm p-3.5 bg-[#0c2533] text-[#eef6f5] text-[13.5px] leading-relaxed shadow-[0_4px_18px_rgba(7,26,38,0.5)] border border-[#159c92]/20 animate-in fade-in slide-in-from-bottom-1 duration-200"
                >
                  {/* Tail seamlessly matched to bubble */}
                  <div className="absolute -left-1.5 bottom-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#0c2533] border-b-[4px] border-b-transparent" />

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
                    className="[&_a]:text-[#159c92] [&_a]:underline [&_a]:font-semibold [&_a:hover]:text-[#38bdf8] [&_strong]:text-white [&_strong]:font-semibold space-y-1"
                  />

                  {/* WhatsApp Timestamp & double read checkmarks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400 select-none">
                    <span>{currentTime}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#159c92]" />
                  </div>
                </div>
              ))}

              {/* Elevated Options Section */}
              <div className="space-y-2.5 pt-1.5 animate-in fade-in duration-200">
                {activeStep.options.map((option, idx) => {
                  const isBack =
                    option.isBack ||
                    option.text.includes('Revenir') ||
                    option.text.includes('Go back') ||
                    option.text.includes('Geh zurück') ||
                    option.text.includes('Volver');

                  // 1. Back button style
                  if (isBack) {
                    return (
                      <div key={idx} className="flex justify-center pt-2 pb-1">
                        <button
                          type="button"
                          onClick={() => handleOptionClick(option)}
                          className="px-5 py-2 rounded-full border border-[#159c92]/40 bg-[#09232e] hover:bg-[#0e3140] hover:border-[#d5a34f] text-[#2dd4bf] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 group"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                          <span>{option.title || option.text.replace(/^[👈🏽\s]+/, '')}</span>
                        </button>
                      </div>
                    );
                  }

                  // 2. Primary High-Converting WhatsApp CTA Link Button (Brand + WhatsApp Fusion)
                  if (option.isPrimaryCta) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className="group relative w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#0b5361] via-[#159c92] to-[#25D366] hover:from-[#0e6374] hover:via-[#1cb2a7] hover:to-[#2ee06f] active:scale-[0.985] text-white shadow-[0_8px_25px_rgba(21,156,146,0.38)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.48)] transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer text-left border border-white/20"
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                        {/* WhatsApp Icon Box */}
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-inner">
                          <FaWhatsapp className="w-6 h-6 text-white drop-shadow" />
                        </div>

                        {/* Title & Online Hours */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-[14px] leading-tight text-white drop-shadow-sm truncate">
                              {option.title || option.text}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#f5c364] shrink-0 animate-pulse" />
                          </div>
                          <p className="text-[12px] text-emerald-50 leading-tight truncate">
                            {option.subtitle || (language === 'fr' ? 'Échangez en direct avec un conseiller' : 'Chat live with an advisor')}
                          </p>
                          {option.onlineHours && (
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-emerald-100">
                              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse inline-block" />
                              <span>{option.onlineHours}</span>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    );
                  }

                  // 3. Language Switcher Special Pill / Card
                  if (option.isLanguage) {
                    return (
                      <div key={idx} className="pt-1.5 border-t border-[#159c92]/15">
                        <button
                          type="button"
                          onClick={() => handleOptionClick(option)}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-[#159c92]/10 active:scale-[0.99] border border-white/10 hover:border-[#159c92]/40 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#159c92]/20 border border-[#159c92]/35 flex items-center justify-center text-sm shrink-0 text-[#2dd4bf]">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                              <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors block truncate">
                                {option.title || option.text}
                              </span>
                              <span className="text-[11px] text-gray-400 block truncate">
                                {option.subtitle}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#159c92]/20 text-[#2dd4bf] border border-[#159c92]/35 shrink-0">
                            {option.badge || (language === 'fr' ? 'FR ⇄ EN' : 'EN ⇄ FR')}
                          </span>
                        </button>
                      </div>
                    );
                  }

                  // 4. Default Interactive Card for Main Menu & Sub-Menu Options
                  const themeStyles = getThemeStyles(option.theme);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className={`group relative w-full text-left p-3 rounded-2xl bg-gradient-to-r ${themeStyles.cardBg} border ${themeStyles.border} transition-all duration-200 shadow-sm ${themeStyles.hoverGlow} active:scale-[0.985] flex items-center gap-3 cursor-pointer overflow-hidden`}
                    >
                      {/* Left Distinctive Icon Tile */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl border transition-transform duration-200 group-hover:scale-105 shadow-inner ${themeStyles.iconBox}`}
                      >
                        {option.icon || '👉'}
                      </div>

                      {/* Content Hierarchy: Title, Subtitle & Badge */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <span className="font-semibold text-white text-[13.5px] leading-tight group-hover:text-white transition-colors truncate">
                            {option.title || option.text}
                          </span>
                          {option.badge && (
                            <span
                              className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${themeStyles.badge}`}
                            >
                              {option.badge}
                            </span>
                          )}
                        </div>

                        {option.subtitle && (
                          <p className="text-[11.5px] text-gray-300/85 group-hover:text-gray-100 leading-snug line-clamp-1 transition-colors">
                            {option.subtitle}
                          </p>
                        )}

                        {option.onlineHours && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#2dd4bf] font-medium">
                            <Clock className="w-3 h-3" />
                            {option.onlineHours}
                          </span>
                        )}
                      </div>

                      {/* Right Indicator Arrow */}
                      <div
                        className={`w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 text-gray-400 ${themeStyles.arrow} transition-all duration-200 group-hover:translate-x-0.5`}
                      >
                        {option.type === 'link' && String(option.value).startsWith('/') ? (
                          <ExternalLink className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtle Brand Reassurance Bar (Official French Guide Concierge) */}
            <div className="py-2.5 px-4 bg-[#061620] border-t border-[#159c92]/15 text-center shrink-0 select-none">
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#159c92]" />
                <span className="truncate">
                  {language === 'fr'
                    ? 'Guide officiel francophone • Hurghada'
                    : 'Certified French Guide • Hurghada'}
                </span>
                <span className="text-[#d5a34f]">•</span>
                <span className="text-gray-400">
                  {language === 'fr' ? 'Support 7j/7' : '7/7 Support'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
