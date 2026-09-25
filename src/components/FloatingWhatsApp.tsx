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

  // Funnel decision tree replicating hurghadadream.com with an ultra-premium UI
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
          '<strong>🏝️ Réserver une excursion</strong><br>Retrouvez toutes nos activités incontournables (Orange Bay, Louxor, Safari quad, Nage avec les dauphins...) sur notre catalogue avec guides francophones.',
          'Pour réserver immédiatement ou poser vos questions, échangez directement avec nos conseillers sur WhatsApp :<br>👇🏽👇🏽👇🏽👇🏽',
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
            text: '👈🏽 Revenir en arrière',
            title: 'Revenir au menu principal',
            isBack: true,
            value: 1,
          },
        ],
      },

      3: {
        content: [
          '<strong>🏨 Réservation d\'hôtel à Hurghada</strong><br>Hurghada French Guide vous fait bénéficier de tarifs négociés exclusifs sur les plus beaux complexes et resorts de la Mer Rouge ! 🤑<br>Contactez notre agent spécialiste hôtel sur WhatsApp pour recevoir une sélection personnalisée :',
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
            text: '👈🏽 Revenir en arrière',
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
            text: '👈🏽 Revenir en arrière',
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
            text: '👈🏽 Revenir en arrière',
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

  const getThemeStyles = (theme?: FunnelOption['theme']) => {
    switch (theme) {
      case 'emerald':
        return {
          cardBg:
            'from-[#162721]/95 via-[#1b2b25]/90 to-[#12201b]/95 hover:from-[#1d352b] hover:via-[#213c32] hover:to-[#172b22]',
          border: 'border-emerald-500/25 hover:border-[#25D366]/70',
          iconBox:
            'bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border-emerald-500/35 text-emerald-300 shadow-[0_0_15px_rgba(37,211,102,0.15)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(37,211,102,0.22)]',
          arrow: 'group-hover:bg-[#25D366] group-hover:text-white',
        };
      case 'amber':
        return {
          cardBg:
            'from-[#292113]/95 via-[#2f2515]/90 to-[#1f180e]/95 hover:from-[#372b17] hover:via-[#3d2f19] hover:to-[#292012]',
          border: 'border-amber-500/25 hover:border-amber-400/70',
          iconBox:
            'bg-gradient-to-br from-amber-500/25 to-orange-500/10 border-amber-500/35 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(245,158,11,0.22)]',
          arrow: 'group-hover:bg-amber-500 group-hover:text-white',
        };
      case 'indigo':
        return {
          cardBg:
            'from-[#1e1c2d]/95 via-[#252239]/90 to-[#181625]/95 hover:from-[#2a2642] hover:via-[#2f294a] hover:to-[#1d1b2b]',
          border: 'border-indigo-500/25 hover:border-indigo-400/70',
          iconBox:
            'bg-gradient-to-br from-indigo-500/25 to-purple-500/10 border-indigo-500/35 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(99,102,241,0.22)]',
          arrow: 'group-hover:bg-indigo-500 group-hover:text-white',
        };
      case 'sky':
        return {
          cardBg:
            'from-[#12242f]/95 via-[#172c39]/90 to-[#0e1a23]/95 hover:from-[#1b3546] hover:via-[#1e3c4e] hover:to-[#122530]',
          border: 'border-sky-500/25 hover:border-sky-400/70',
          iconBox:
            'bg-gradient-to-br from-sky-500/25 to-cyan-500/10 border-sky-500/35 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.15)]',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(14,165,233,0.22)]',
          arrow: 'group-hover:bg-sky-500 group-hover:text-white',
        };
      case 'teal':
        return {
          cardBg:
            'from-[#122425]/95 via-[#172c2e]/90 to-[#0e1a1b]/95 hover:from-[#1b3537] hover:via-[#1e3d3f] hover:to-[#122425]',
          border: 'border-teal-500/25 hover:border-teal-400/70',
          iconBox:
            'bg-gradient-to-br from-teal-500/25 to-emerald-500/10 border-teal-500/35 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(20,184,166,0.22)]',
          arrow: 'group-hover:bg-teal-500 group-hover:text-white',
        };
      case 'slate':
      default:
        return {
          cardBg:
            'from-[#1b272f]/95 via-[#202e37]/90 to-[#162127]/95 hover:from-[#24343f] hover:via-[#283a46] hover:to-[#1b272f]',
          border: 'border-white/10 hover:border-white/30',
          iconBox: 'bg-white/10 border-white/15 text-gray-200',
          badge: 'bg-white/10 text-gray-300 border-white/15',
          hoverGlow: 'hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]',
          arrow: 'group-hover:bg-white/20 group-hover:text-white',
        };
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
                {language === 'fr'
                  ? '💬 Discutez avec nous sur WhatsApp !'
                  : '💬 Chat with us on WhatsApp!'}
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
            className="fixed bottom-6 right-6 z-50 w-[385px] max-w-[calc(100vw-1.5rem)] h-[620px] max-h-[88vh] bg-[#111b21] rounded-[26px] shadow-[0_24px_70px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border border-white/10 ring-1 ring-black/20"
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp Chat"
          >
            {/* Elevated WhatsApp Header */}
            <div className="bg-gradient-to-r from-[#00a884] via-[#128c7e] to-[#0d6e63] px-3.5 py-3 flex items-center justify-between text-white shadow-lg select-none shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                {/* Official Avatar with Online Badge */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/15 border-2 border-white/30 overflow-hidden flex items-center justify-center p-0.5 shadow-md">
                    <img
                      src="/logo.png"
                      alt="Hurghada French Guide"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Pulsing Green Online Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#128c7e] rounded-full animate-pulse" />
                </div>

                {/* Title & Status */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14.5px] leading-tight text-white truncate">
                    Hurghada French Guide
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-100 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <span className="truncate">
                      {language === 'fr'
                        ? 'En ligne • Réponse en direct'
                        : 'Online • Fast live response'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Language quick-toggle + Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const nextLang = language === 'fr' ? 'en' : 'fr';
                    setLanguage(nextLang);
                    setCurrentStep(nextLang === 'fr' ? 1 : 6);
                  }}
                  className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/35 active:scale-95 text-white text-xs font-semibold tracking-wider flex items-center gap-1 transition-all border border-white/15 cursor-pointer"
                  title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
                >
                  <Globe className="w-3 h-3 opacity-80" />
                  <span>{language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-white/10"
                  aria-label={language === 'fr' ? 'Fermer le chat' : 'Close chat'}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body with WhatsApp subtle wallpaper background */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#111b21] scrollbar-thin scrollbar-thumb-white/10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 30%, rgba(37,211,102,0.04) 0%, transparent 70%), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 20px 20px',
              }}
            >
              {/* Message Bubbles for Current Step */}
              {activeStep.content.map((htmlText, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl rounded-bl-sm p-3.5 bg-[#202c33] text-[#e9edef] text-[13.5px] leading-relaxed shadow-[0_3px_12px_rgba(0,0,0,0.3)] border border-white/[0.06] animate-in fade-in slide-in-from-bottom-1 duration-200"
                >
                  {/* WhatsApp tail on the bottom-left */}
                  <div className="absolute -left-1.5 bottom-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#202c33] border-b-[4px] border-b-transparent" />

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
                    className="[&_a]:text-[#25D366] [&_a]:underline [&_a]:font-medium [&_a:hover]:text-[#2ee06f] [&_strong]:text-white [&_strong]:font-semibold space-y-1"
                  />

                  {/* WhatsApp Timestamp & double read checkmarks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400 select-none">
                    <span>{currentTime}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
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
                          className="px-5 py-2 rounded-full border border-emerald-500/40 bg-[#16232b] hover:bg-[#1f303a] hover:border-[#25D366] text-[#25D366] text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 group"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                          <span>{option.title || option.text.replace(/^[👈🏽\s]+/, '')}</span>
                        </button>
                      </div>
                    );
                  }

                  // 2. Primary High-Converting WhatsApp CTA Link Button
                  if (option.isPrimaryCta) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className="group relative w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20ba59] to-[#128C7E] hover:from-[#2cf176] hover:to-[#17a392] active:scale-[0.985] text-white shadow-[0_8px_25px_rgba(37,211,102,0.32)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.48)] transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer text-left"
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                        {/* WhatsApp Icon Box */}
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-inner">
                          <FaWhatsapp className="w-6 h-6 text-white" />
                        </div>

                        {/* Title & Online Hours */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-[14px] leading-tight text-white drop-shadow-sm truncate">
                              {option.title || option.text}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0 animate-pulse" />
                          </div>
                          <p className="text-[12px] text-white/90 leading-tight truncate">
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
                      <div key={idx} className="pt-1.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleOptionClick(option)}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-sm shrink-0 text-teal-300">
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
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 shrink-0">
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
                          <p className="text-[11.5px] text-gray-300/85 group-hover:text-gray-200 leading-snug line-clamp-1 transition-colors">
                            {option.subtitle}
                          </p>
                        )}

                        {option.onlineHours && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-medium">
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

            {/* Subtle WhatsApp Official Badge Footer */}
            <div className="py-2.5 px-4 bg-[#111b21] border-t border-white/5 text-center shrink-0 select-none">
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                <span>
                  {language === 'fr'
                    ? 'Sélectionnez une option pour continuer'
                    : 'Select an option to continue'}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
