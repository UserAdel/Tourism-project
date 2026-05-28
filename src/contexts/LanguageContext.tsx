import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      activities: 'Activities',
      about: 'About',
      faq: 'FAQ',
      contact: 'Contact',
      bookNow: 'Book Now'
    },
    hero: {
      title: 'Discover Hurghada\'s Best Excursions',
      subtitle: 'Experience the magic of the Red Sea with expert French-speaking guides',
      bookNow: 'Book Now',
      whatsapp: 'WhatsApp Us'
    },
    sections: {
      topExperiences: 'Top Experiences',
      categories: 'Explore by Category',
      whyChooseUs: 'Why Choose Us',
      packages: 'Combo Packages',
      reviews: 'What Our Guests Say',
      gallery: 'Gallery',
      faq: 'Frequently Asked Questions'
    },
    whyUs: {
      french: 'French-Speaking Guides',
      frenchDesc: 'Expert local guides fluent in French',
      pickup: 'Hotel Pickup Included',
      pickupDesc: 'Convenient door-to-door service',
      trusted: 'Trusted Local Operator',
      trustedDesc: 'Years of experience in Hurghada',
      flexible: 'Private & Group Tours',
      flexibleDesc: 'Options for every preference',
      family: 'Family-Friendly',
      familyDesc: 'Activities for all ages',
      instant: 'Instant Confirmation',
      instantDesc: 'Quick response via WhatsApp'
    },
    pricing: {
      from: 'From',
      adult: 'Adult',
      child: 'Child',
      private: 'Private',
      perPerson: 'per person',
      perGroup: 'per group'
    },
    booking: {
      title: 'Book Your Experience',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      hotel: 'Hotel Name',
      room: 'Room Number (Optional)',
      nationality: 'Nationality',
      arrivalDate: 'Arrival Date',
      date: 'Preferred Date',
      adults: 'Adults',
      children: 'Children',
      language: 'Preferred Language',
      requests: 'Special Requests (Optional)',
      activity: 'Selected Activity',
      submit: 'Submit Booking Request',
      submitting: 'Sending...'
    },
    activity: {
      overview: 'Overview',
      highlights: 'Highlights',
      pricing: 'Pricing',
      included: 'What\'s Included',
      excluded: 'What\'s Not Included',
      duration: 'Duration',
      time: 'Time',
      ageRestrictions: 'Age Restrictions',
      pickupInfo: 'Pickup Information',
      relatedActivities: 'You May Also Like',
      bookThisActivity: 'Book This Activity'
    },
    filters: {
      title: 'Filters',
      category: 'Category',
      all: 'All Categories',
      priceRange: 'Price Range',
      duration: 'Duration',
      type: 'Tour Type',
      private: 'Private',
      group: 'Group',
      features: 'Features',
      childFriendly: 'Child Friendly',
      pickupIncluded: 'Pickup Included',
      clearAll: 'Clear All'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      send: 'Send Message',
      info: 'Contact Information',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      email_label: 'Email',
      location: 'Location'
    },
    footer: {
      about: 'About Hurghada French Guide',
      aboutText: 'Your trusted partner for unforgettable Red Sea excursions with French-speaking expertise.',
      quickLinks: 'Quick Links',
      popular: 'Popular Activities',
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    },
    common: {
      learnMore: 'Learn More',
      viewAll: 'View All',
      readMore: 'Read More',
      backHome: 'Back to Home',
      notFound: '404 - Page Not Found',
      loading: 'Loading...'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      activities: 'Activités',
      about: 'À Propos',
      faq: 'FAQ',
      contact: 'Contact',
      bookNow: 'Réserver'
    },
    hero: {
      title: 'Découvrez les Meilleures Excursions d\'Hurghada',
      subtitle: 'Vivez la magie de la Mer Rouge avec des guides francophones experts',
      bookNow: 'Réserver Maintenant',
      whatsapp: 'WhatsApp'
    },
    sections: {
      topExperiences: 'Expériences Recommandées',
      categories: 'Explorer par Catégorie',
      whyChooseUs: 'Pourquoi Nous Choisir',
      packages: 'Forfaits Combinés',
      reviews: 'Avis de Nos Clients',
      gallery: 'Galerie',
      faq: 'Questions Fréquentes'
    },
    whyUs: {
      french: 'Guides Francophones',
      frenchDesc: 'Guides locaux experts parlant couramment français',
      pickup: 'Transfert Hôtel Inclus',
      pickupDesc: 'Service porte-à-porte pratique',
      trusted: 'Opérateur Local de Confiance',
      trustedDesc: 'Des années d\'expérience à Hurghada',
      flexible: 'Excursions Privées & Groupe',
      flexibleDesc: 'Options pour toutes les préférences',
      family: 'Adapté aux Familles',
      familyDesc: 'Activités pour tous les âges',
      instant: 'Confirmation Instantanée',
      instantDesc: 'Réponse rapide via WhatsApp'
    },
    pricing: {
      from: 'À partir de',
      adult: 'Adulte',
      child: 'Enfant',
      private: 'Privé',
      perPerson: 'par personne',
      perGroup: 'par groupe'
    },
    booking: {
      title: 'Réservez Votre Expérience',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      whatsapp: 'Numéro WhatsApp',
      hotel: 'Nom de l\'Hôtel',
      room: 'Numéro de Chambre (Optionnel)',
      nationality: 'Nationalité',
      arrivalDate: 'Date d\'Arrivée',
      date: 'Date Préférée',
      adults: 'Adultes',
      children: 'Enfants',
      language: 'Langue Préférée',
      requests: 'Demandes Spéciales (Optionnel)',
      activity: 'Activité Sélectionnée',
      submit: 'Envoyer la Demande de Réservation',
      submitting: 'Envoi en cours...'
    },
    activity: {
      overview: 'Aperçu',
      highlights: 'Points Forts',
      pricing: 'Tarifs',
      included: 'Inclus',
      excluded: 'Non Inclus',
      duration: 'Durée',
      time: 'Horaire',
      ageRestrictions: 'Restrictions d\'Âge',
      pickupInfo: 'Informations de Transfert',
      relatedActivities: 'Vous Aimerez Aussi',
      bookThisActivity: 'Réserver Cette Activité'
    },
    filters: {
      title: 'Filtres',
      category: 'Catégorie',
      all: 'Toutes les Catégories',
      priceRange: 'Gamme de Prix',
      duration: 'Durée',
      type: 'Type d\'Excursion',
      private: 'Privé',
      group: 'Groupe',
      features: 'Caractéristiques',
      childFriendly: 'Adapté aux Enfants',
      pickupIncluded: 'Transfert Inclus',
      clearAll: 'Effacer Tout'
    },
    contact: {
      title: 'Contactez-Nous',
      subtitle: 'Contactez notre équipe',
      name: 'Votre Nom',
      email: 'Votre Email',
      message: 'Votre Message',
      send: 'Envoyer le Message',
      info: 'Coordonnées',
      phone: 'Téléphone',
      whatsapp: 'WhatsApp',
      email_label: 'Email',
      location: 'Localisation'
    },
    footer: {
      about: 'À Propos d\'Hurghada French Guide',
      aboutText: 'Votre partenaire de confiance pour des excursions inoubliables en Mer Rouge avec expertise francophone.',
      quickLinks: 'Liens Rapides',
      popular: 'Activités Populaires',
      contact: 'Contact',
      followUs: 'Suivez-Nous',
      rights: 'Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation'
    },
    common: {
      learnMore: 'En Savoir Plus',
      viewAll: 'Voir Tout',
      readMore: 'Lire Plus',
      backHome: 'Retour à l\'Accueil',
      notFound: '404 - Page Non Trouvée',
      loading: 'Chargement...'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
