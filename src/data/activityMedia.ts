import { tourismImages } from './tourismImages';

export const activityGalleries: Record<string, string[]> = {
  'orange-bay': [
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.seaAdventure,
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.seaAdventure,
    tourismImages.boat,
    tourismImages.temple
  ],
  'photo-shoot-dolphins': [
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater
  ],
  'grand-egyptian-museum': [
    tourismImages.luxor,
    tourismImages.temple,
    tourismImages.luxor,
    tourismImages.temple,
    tourismImages.luxor,
    tourismImages.temple
  ],
  'luxor': [
    tourismImages.temple,
    tourismImages.luxor,
    tourismImages.temple,
    tourismImages.luxor,
    tourismImages.temple,
    tourismImages.luxor
  ],
  'swim-with-dolphins': [
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater
  ],
  'speed-boat': [
    tourismImages.boat,
    tourismImages.seaAdventure,
    tourismImages.island,
    tourismImages.boat,
    tourismImages.seaAdventure,
    tourismImages.island
  ],
  'royal-seascope': [
    tourismImages.seaAdventure,
    tourismImages.redSea,
    tourismImages.seaAdventure,
    tourismImages.redSea
  ],
  'aquarium': [
    tourismImages.seaAdventure,
    tourismImages.seaAdventure,
    tourismImages.seaAdventure,
    tourismImages.seaAdventure
  ],
  'mahmya-island': [
    tourismImages.island,
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.redSea
  ],
  'eden-island': [
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.redSea,
    tourismImages.island,
    tourismImages.redSea,
    tourismImages.island
  ],
  'spa-deluxe': [
    tourismImages.localTourism,
    tourismImages.localTourism,
    tourismImages.localTourism,
    tourismImages.localTourism
  ],
  'horse-riding': [
    tourismImages.island,
    tourismImages.island,
    tourismImages.island,
    tourismImages.island
  ],
  'dolphin-show': [
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater,
    tourismImages.dolphinWater
  ],
  'parasailing': [
    tourismImages.boat,
    tourismImages.boat,
    tourismImages.boat,
    tourismImages.boat
  ]
};

export const activityVideos: Record<string, Array<{
  id: string;
  thumbnail: string;
  title: string;
  youtubeId?: string;
}>> = {
  'orange-bay': [
    {
      id: 'ob-1',
      thumbnail: tourismImages.redSea,
      title: 'Orange Bay Island Tour Highlights',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: 'ob-2',
      thumbnail: tourismImages.island,
      title: 'Snorkeling Experience',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: 'ob-3',
      thumbnail: tourismImages.seaAdventure,
      title: 'Beach Activities & Lunch',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ],
  'luxor': [
    {
      id: 'lx-1',
      thumbnail: tourismImages.temple,
      title: 'Luxor Day Trip Tour',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: 'lx-2',
      thumbnail: tourismImages.luxor,
      title: 'Valley of the Kings Exploration',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ],
  'swim-with-dolphins': [
    {
      id: 'sd-1',
      thumbnail: tourismImages.dolphinWater,
      title: 'Swimming with Dolphins Experience',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ]
};

export const activityTestimonials: Record<string, Array<{
  id: string;
  name: string;
  nationality: string;
  rating: number;
  text: string;
  date: string;
}>> = {
  'orange-bay': [
    {
      id: 'ob-t1',
      name: 'Sophie Laurent',
      nationality: '🇫🇷 France',
      rating: 5,
      text: 'Absolutely stunning! The water was crystal clear and the guide spoke perfect French. Best day of our vacation!',
      date: 'May 2026'
    },
    {
      id: 'ob-t2',
      name: 'Jean Dupont',
      nationality: '🇧🇪 Belgium',
      rating: 5,
      text: 'Perfect organization, delicious lunch, and beautiful island. Highly recommend!',
      date: 'April 2026'
    },
    {
      id: 'ob-t3',
      name: 'Marie Dubois',
      nationality: '🇨🇭 Switzerland',
      rating: 5,
      text: 'Our kids loved the snorkeling and beach activities. Great family experience!',
      date: 'March 2026'
    }
  ],
  'luxor': [
    {
      id: 'lx-t1',
      name: 'Pierre Martin',
      nationality: '🇫🇷 France',
      rating: 5,
      text: 'The guide was incredibly knowledgeable. Valley of the Kings was breathtaking!',
      date: 'May 2026'
    },
    {
      id: 'lx-t2',
      name: 'Claire Bernard',
      nationality: '🇨🇦 Canada',
      rating: 5,
      text: 'Worth every penny! The French Egyptologist guide made history come alive.',
      date: 'April 2026'
    },
    {
      id: 'lx-t3',
      name: 'Thomas Rousseau',
      nationality: '🇫🇷 France',
      rating: 5,
      text: 'Long day but absolutely worth it. Karnak Temple was magnificent!',
      date: 'March 2026'
    }
  ],
  'swim-with-dolphins': [
    {
      id: 'sd-t1',
      name: 'Emma Mercier',
      nationality: '🇫🇷 France',
      rating: 5,
      text: 'Dream come true! The dolphins were so friendly and playful.',
      date: 'May 2026'
    },
    {
      id: 'sd-t2',
      name: 'Lucas Martin',
      nationality: '🇧🇪 Belgium',
      rating: 5,
      text: 'Unforgettable experience! Professional staff and amazing dolphins.',
      date: 'April 2026'
    }
  ],
  'grand-egyptian-museum': [
    {
      id: 'gem-t1',
      name: 'Antoine Dubois',
      nationality: '🇫🇷 France',
      rating: 5,
      text: 'Incredible museum! The guide explained everything in perfect French.',
      date: 'May 2026'
    }
  ]
};

export const activityItineraries: Record<string, Array<{
  time: string;
  title: { en: string; fr: string };
  description?: { en: string; fr: string };
}>> = {
  'luxor': [
    {
      time: '05:00',
      title: { en: 'Hotel Pickup', fr: 'Prise en charge à l\'hôtel' },
      description: { en: 'Comfortable pickup from your hotel', fr: 'Prise en charge confortable depuis votre hôtel' }
    },
    {
      time: '06:00',
      title: { en: 'Departure to Luxor', fr: 'Départ vers Louxor' },
      description: { en: 'Air-conditioned minivan journey', fr: 'Voyage en minivan climatisé' }
    },
    {
      time: '09:30',
      title: { en: 'Karnak Temple Complex', fr: 'Complexe du Temple de Karnak' },
      description: { en: 'Explore the magnificent ancient temple', fr: 'Explorez le magnifique temple ancien' }
    },
    {
      time: '11:30',
      title: { en: 'Nile Crossing', fr: 'Traversée du Nil' },
      description: { en: 'Optional boat ride across the Nile', fr: 'Promenade en bateau optionnelle à travers le Nil' }
    },
    {
      time: '13:00',
      title: { en: 'Lunch Break', fr: 'Pause Déjeuner' },
      description: { en: 'Traditional Egyptian lunch included', fr: 'Déjeuner égyptien traditionnel inclus' }
    },
    {
      time: '14:30',
      title: { en: 'Hatshepsut Temple', fr: 'Temple d\'Hatchepsout' },
      description: { en: 'Visit the stunning mortuary temple', fr: 'Visitez le magnifique temple funéraire' }
    },
    {
      time: '16:00',
      title: { en: 'Valley of the Kings', fr: 'Vallée des Rois' },
      description: { en: 'Discover ancient royal tombs', fr: 'Découvrez les anciennes tombes royales' }
    },
    {
      time: '17:30',
      title: { en: 'Colossi of Memnon', fr: 'Colosses de Memnon' },
      description: { en: 'Photo stop at the iconic statues', fr: 'Arrêt photo aux statues emblématiques' }
    },
    {
      time: '21:00',
      title: { en: 'Return to Hotel', fr: 'Retour à l\'hôtel' },
      description: { en: 'Safe return to your accommodation', fr: 'Retour sécurisé à votre hébergement' }
    }
  ],
  'orange-bay': [
    {
      time: '08:30',
      title: { en: 'Hotel Pickup', fr: 'Prise en charge' }
    },
    {
      time: '09:00',
      title: { en: 'Marina Departure', fr: 'Départ de la marina' }
    },
    {
      time: '10:00',
      title: { en: 'First Snorkeling Stop', fr: 'Premier arrêt plongée' }
    },
    {
      time: '11:00',
      title: { en: 'Orange Bay Island Arrival', fr: 'Arrivée île Orange Bay' }
    },
    {
      time: '13:00',
      title: { en: 'Lunch on Boat', fr: 'Déjeuner à bord' }
    },
    {
      time: '14:00',
      title: { en: 'Water Activities & Relaxation', fr: 'Activités nautiques et détente' }
    },
    {
      time: '15:00',
      title: { en: 'Return Journey', fr: 'Voyage de retour' }
    },
    {
      time: '16:30',
      title: { en: 'Hotel Drop-off', fr: 'Retour hôtel' }
    }
  ]
};

export const activityImportantInfo: Record<string, Array<{
  type: 'important' | 'recommended';
  text: { en: string; fr: string };
}>> = {
  'luxor': [
    {
      type: 'important',
      text: {
        en: 'Passport or ID required for entry to archaeological sites',
        fr: 'Passeport ou pièce d\'identité requis pour l\'entrée aux sites archéologiques'
      }
    },
    {
      type: 'important',
      text: {
        en: 'This is a long day trip (16 hours) - not recommended for young children',
        fr: 'Ceci est une longue excursion (16 heures) - non recommandé pour les jeunes enfants'
      }
    },
    {
      type: 'recommended',
      text: {
        en: 'Wear comfortable walking shoes and bring sunscreen',
        fr: 'Portez des chaussures de marche confortables et apportez de la crème solaire'
      }
    },
    {
      type: 'recommended',
      text: {
        en: 'Bring cash for optional activities and souvenirs',
        fr: 'Apportez de l\'argent liquide pour les activités optionnelles et les souvenirs'
      }
    },
    {
      type: 'important',
      text: {
        en: 'Modest clothing required (shoulders and knees covered)',
        fr: 'Vêtements modestes requis (épaules et genoux couverts)'
      }
    }
  ],
  'orange-bay': [
    {
      type: 'recommended',
      text: {
        en: 'Bring swimwear, towel, and waterproof bag for valuables',
        fr: 'Apportez maillot de bain, serviette et sac étanche pour objets de valeur'
      }
    },
    {
      type: 'recommended',
      text: {
        en: 'Apply reef-safe sunscreen to protect marine life',
        fr: 'Appliquez une crème solaire sans danger pour les récifs'
      }
    },
    {
      type: 'important',
      text: {
        en: 'Swimming ability required for snorkeling activities',
        fr: 'Capacité de nage requise pour les activités de plongée'
      }
    }
  ]
};

export const activityPickupZones: Record<string, Array<{
  name: string;
  time: string;
}>> = {
  'luxor': [
    { name: 'Hurghada Hotels', time: '05:00 - 05:30' },
    { name: 'Makadi Bay', time: '04:30 - 05:00' },
    { name: 'Sahl Hasheesh', time: '05:30 - 06:00' },
    { name: 'El Gouna', time: '04:00 - 04:30' }
  ],
  'orange-bay': [
    { name: 'Hurghada Hotels', time: '08:30 - 09:00' },
    { name: 'Makadi Bay', time: '08:00 - 08:30' },
    { name: 'Sahl Hasheesh', time: '09:00 - 09:30' }
  ]
};

export const activityGuides: Record<string, {
  name: string;
  title: { en: string; fr: string };
  experience: string;
  languages: string[];
  rating: number;
  tours: number;
  bio?: { en: string; fr: string };
}> = {
  'luxor': {
    name: 'Ahmed Hassan',
    title: {
      en: 'Licensed Egyptologist',
      fr: 'Égyptologue Certifié'
    },
    experience: '12 years experience',
    languages: ['French', 'English', 'Arabic'],
    rating: 4.9,
    tours: 2431,
    bio: {
      en: 'Ahmed is a passionate Egyptologist with over a decade of experience bringing ancient Egypt to life for visitors. Fluent in French and English, he specializes in Luxor and Cairo tours.',
      fr: 'Ahmed est un égyptologue passionné avec plus d\'une décennie d\'expérience pour donner vie à l\'Égypte ancienne aux visiteurs. Parlant couramment français et anglais, il se spécialise dans les visites de Louxor et du Caire.'
    }
  },
  'grand-egyptian-museum': {
    name: 'Sarah Mansour',
    title: {
      en: 'French Egyptologist Guide',
      fr: 'Guide Égyptologue Francophone'
    },
    experience: '8 years experience',
    languages: ['French', 'English', 'Arabic'],
    rating: 5.0,
    tours: 1856,
    bio: {
      en: 'Sarah is a French-speaking Egyptologist who studied in Paris. She brings deep knowledge and enthusiasm to every Grand Egyptian Museum tour.',
      fr: 'Sarah est une égyptologue francophone qui a étudié à Paris. Elle apporte des connaissances approfondies et de l\'enthousiasme à chaque visite du Grand Musée Égyptien.'
    }
  }
};

export const activityVideoTestimonials: Record<string, Array<{
  id: string;
  name: string;
  nationality: string;
  rating: number;
  thumbnail: string;
  quote: string;
  youtubeId?: string;
}>> = {
  'orange-bay': [
    {
      id: 'ob-vt1',
      name: 'Sophie & Marc',
      nationality: '🇫🇷 France',
      rating: 5,
      thumbnail: tourismImages.island,
      quote: 'The best excursion we did in Hurghada! Absolutely perfect day!',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: 'ob-vt2',
      name: 'Julie & Family',
      nationality: '🇧🇪 Belgium',
      rating: 5,
      thumbnail: tourismImages.redSea,
      quote: 'Our children are still talking about it! Amazing experience.',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ],
  'luxor': [
    {
      id: 'lx-vt1',
      name: 'Pierre & Claire',
      nationality: '🇫🇷 France',
      rating: 5,
      thumbnail: tourismImages.temple,
      quote: 'The guide was exceptional! So knowledgeable and passionate.',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ]
};
