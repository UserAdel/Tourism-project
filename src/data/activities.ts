import type { Activity } from '../types';
import { tourismImages } from './tourismImages';

export const activities: Activity[] = [
  {
    id: 'orange-bay',
    slug: 'orange-bay',
    name: {
      en: 'Orange Bay',
      fr: 'Orange Bay'
    },
    category: 'island-trips',
    description: {
      en: 'Discover the stunning Orange Bay island with crystal-clear waters and pristine beaches. Perfect for families, couples, and groups.',
      fr: 'Découvrez l\'île d\'Orange Bay avec ses eaux cristallines et ses plages immaculées. Parfait pour les familles, couples et groupes.'
    },
    highlights: {
      en: ['Snorkeling in crystal waters', 'Water games and activities', '2-hour island relaxation', 'Beach hammocks and swings', 'Perfect for families and couples'],
      fr: ['Plongée avec tuba dans les eaux cristallines', 'Jeux aquatiques et activités', '2 heures de détente sur l\'île', 'Hamacs et balançoires sur la plage', 'Parfait pour les familles et couples']
    },
    pricing: {
      adult: 25,
      child: 15
    },
    ageRestrictions: {
      en: '10+ years',
      fr: '10 ans et plus'
    },
    duration: '8 hours',
    startTime: '08:30',
    endTime: '16:30',
    included: {
      en: ['Round-trip hotel transfer', 'Island entry fee', 'Snorkeling equipment', 'Lunch onboard', 'Unlimited soft drinks'],
      fr: ['Transfert hôtel aller-retour', 'Frais d\'entrée sur l\'île', 'Équipement de plongée', 'Déjeuner à bord', 'Boissons non alcoolisées à volonté']
    },
    imageUrl: tourismImages.redSea,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'photo-shoot-dolphins',
    slug: 'photo-shoot-dolphins',
    name: {
      en: 'Photo Shoot with Dolphins',
      fr: 'Séance Photo avec Dauphins'
    },
    category: 'dolphin-experiences',
    description: {
      en: 'Capture unforgettable memories with our professional dolphin photo shoot. Receive 10 selected digital photos via WhatsApp.',
      fr: 'Capturez des souvenirs inoubliables avec notre séance photo professionnelle avec dauphins. Recevez 10 photos numériques sélectionnées via WhatsApp.'
    },
    highlights: {
      en: ['Professional dolphin interaction', 'Photo shoot session', '10 selected digital photos', 'WhatsApp delivery', 'All ages welcome'],
      fr: ['Interaction professionnelle avec dauphins', 'Séance photo', '10 photos numériques sélectionnées', 'Livraison WhatsApp', 'Tous âges bienvenus']
    },
    pricing: {
      adult: 40,
      child: 40,
      visitor: 15
    },
    ageRestrictions: {
      en: '5+ in pool, 0-4 outside pool as visitors',
      fr: '5+ dans la piscine, 0-4 à l\'extérieur comme visiteurs'
    },
    duration: '2 hours',
    included: {
      en: ['Hotel transfer', '10 digital photos via WhatsApp', 'Professional photography'],
      fr: ['Transfert hôtel', '10 photos numériques via WhatsApp', 'Photographie professionnelle']
    },
    imageUrl: tourismImages.dolphinWater,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: false,
    groupAvailable: true
  },
  {
    id: 'grand-egyptian-museum',
    slug: 'grand-egyptian-museum',
    name: {
      en: 'Grand Egyptian Museum',
      fr: 'Grand Musée Égyptien'
    },
    category: 'historical-tours',
    description: {
      en: 'Explore the wonders of ancient Egypt with a French-speaking Egyptologist guide. Visit the Pyramids, Sphinx, and the magnificent Grand Egyptian Museum.',
      fr: 'Explorez les merveilles de l\'Égypte ancienne avec un guide égyptologue francophone. Visitez les Pyramides, le Sphinx et le magnifique Grand Musée Égyptien.'
    },
    highlights: {
      en: ['Pyramids of Giza', 'The Great Sphinx', 'Grand Egyptian Museum', 'French Egyptologist guide', 'Optional Nile boat ride'],
      fr: ['Pyramides de Gizeh', 'Le Grand Sphinx', 'Grand Musée Égyptien', 'Guide égyptologue francophone', 'Promenade en bateau sur le Nil en option']
    },
    pricing: {
      adult: 95
    },
    ageRestrictions: {
      en: 'All ages',
      fr: 'Tous âges'
    },
    duration: '22 hours',
    startTime: '01:00',
    endTime: '23:00',
    included: {
      en: ['Entry tickets', 'French Egyptologist guide', 'Lunch', 'Transport'],
      fr: ['Billets d\'entrée', 'Guide égyptologue francophone', 'Déjeuner', 'Transport']
    },
    imageUrl: tourismImages.luxor,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'luxor',
    slug: 'luxor',
    name: {
      en: 'Luxor Day Trip',
      fr: 'Excursion à Louxor'
    },
    category: 'historical-tours',
    description: {
      en: 'Journey to Luxor, the world\'s greatest open-air museum. Explore ancient temples and the Valley of the Kings with expert French-speaking guides.',
      fr: 'Voyage à Louxor, le plus grand musée à ciel ouvert du monde. Explorez les temples anciens et la Vallée des Rois avec des guides francophones experts.'
    },
    highlights: {
      en: ['Karnak Temple Complex', 'Hatshepsut Temple', 'Valley of the Kings', 'Colossi of Memnon', 'Optional Nile crossing'],
      fr: ['Complexe du Temple de Karnak', 'Temple d\'Hatchepsout', 'Vallée des Rois', 'Colosses de Memnon', 'Traversée du Nil en option']
    },
    pricing: {
      adult: 65,
      child: 35
    },
    ageRestrictions: {
      en: '4-10 years child rate',
      fr: '4-10 ans tarif enfant'
    },
    duration: '16 hours',
    startTime: '05:00',
    endTime: '21:00',
    included: {
      en: ['Entry fees', 'Lunch', 'Minivan transport', 'French-speaking guide'],
      fr: ['Frais d\'entrée', 'Déjeuner', 'Transport en minivan', 'Guide francophone']
    },
    imageUrl: tourismImages.temple,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'swim-with-dolphins',
    slug: 'swim-with-dolphins',
    name: {
      en: 'Swim with Dolphins',
      fr: 'Nager avec les Dauphins'
    },
    category: 'dolphin-experiences',
    description: {
      en: 'Experience the thrill of swimming alongside dolphins in a 5-minute unforgettable session.',
      fr: 'Vivez le frisson de nager aux côtés des dauphins lors d\'une séance inoubliable de 5 minutes.'
    },
    highlights: {
      en: ['Swim with dolphins', 'Ride beside dolphins', '5-minute session', 'Optional photo upgrade'],
      fr: ['Nager avec les dauphins', 'Chevaucher à côté des dauphins', 'Séance de 5 minutes', 'Mise à niveau photo en option']
    },
    pricing: {
      adult: 50
    },
    ageRestrictions: {
      en: '4+ years',
      fr: '4 ans et plus'
    },
    duration: '2 hours',
    included: {
      en: ['Hotel transfer', '5-minute swimming session'],
      fr: ['Transfert hôtel', 'Séance de natation de 5 minutes']
    },
    imageUrl: tourismImages.dolphinWater,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: false,
    groupAvailable: true
  },
  {
    id: 'speed-boat',
    slug: 'speed-boat',
    name: {
      en: 'Private Speed Boat',
      fr: 'Bateau Rapide Privé'
    },
    category: 'sea-adventures',
    description: {
      en: 'Enjoy a private speed boat adventure for up to 7 people. Customize your itinerary with snorkeling, sandbank stops, and island visits.',
      fr: 'Profitez d\'une aventure en bateau rapide privé pour jusqu\'à 7 personnes. Personnalisez votre itinéraire avec plongée, arrêts sur banc de sable et visites d\'îles.'
    },
    highlights: {
      en: ['Private boat for up to 7', 'Custom itinerary', 'Snorkeling equipment', 'Sandbank stop', 'Orange Bay/Paradise/Eden Island add-ons'],
      fr: ['Bateau privé jusqu\'à 7 personnes', 'Itinéraire personnalisé', 'Équipement de plongée', 'Arrêt sur banc de sable', 'Ajouts Orange Bay/Paradise/Eden Island']
    },
    pricing: {
      private: 160,
      extraPerson: 15
    },
    ageRestrictions: {
      en: 'All ages',
      fr: 'Tous âges'
    },
    duration: '4 hours',
    maxCapacity: 7,
    included: {
      en: ['Private boat', 'Snorkeling equipment', 'Sandbank stop', 'Captain and crew'],
      fr: ['Bateau privé', 'Équipement de plongée', 'Arrêt sur banc de sable', 'Capitaine et équipage']
    },
    imageUrl: tourismImages.boat,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: false
  },
  {
    id: 'royal-seascope',
    slug: 'royal-seascope',
    name: {
      en: 'Royal Seascope',
      fr: 'Royal Seascope'
    },
    category: 'sea-adventures',
    description: {
      en: 'Explore the underwater world through a glass-bottom boat. Perfect for families with young children.',
      fr: 'Explorez le monde sous-marin à travers un bateau à fond de verre. Parfait pour les familles avec jeunes enfants.'
    },
    highlights: {
      en: ['Glass-bottom viewing', 'Snorkeling stop', 'Air-conditioned boat', 'Family-friendly', 'Under 3 free'],
      fr: ['Vue à fond de verre', 'Arrêt plongée', 'Bateau climatisé', 'Adapté aux familles', 'Moins de 3 ans gratuit']
    },
    pricing: {
      adult: 15,
      child: 10
    },
    ageRestrictions: {
      en: 'Under 3 free',
      fr: 'Moins de 3 ans gratuit'
    },
    duration: '2 hours',
    times: ['10:00', '14:00'],
    included: {
      en: ['Glass-bottom boat', 'Snorkeling equipment', 'Hotel transfer'],
      fr: ['Bateau à fond de verre', 'Équipement de plongée', 'Transfert hôtel']
    },
    imageUrl: tourismImages.seaAdventure,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: false,
    groupAvailable: true
  },
  {
    id: 'aquarium',
    slug: 'aquarium',
    name: {
      en: 'Hurghada Grand Aquarium',
      fr: 'Grand Aquarium d\'Hurghada'
    },
    category: 'family-activities',
    description: {
      en: 'Visit one of the largest aquariums in the Middle East with over 1200 species. Features sharks, turtles, rays, and a mini zoo.',
      fr: 'Visitez l\'un des plus grands aquariums du Moyen-Orient avec plus de 1200 espèces. Comprend requins, tortues, raies et mini zoo.'
    },
    highlights: {
      en: ['1200+ marine species', 'Shark shows', 'Sea turtles and rays', 'Mini zoo with birds', 'Crocodiles and monkeys'],
      fr: ['1200+ espèces marines', 'Spectacles de requins', 'Tortues marines et raies', 'Mini zoo avec oiseaux', 'Crocodiles et singes']
    },
    pricing: {
      adult: 30,
      child: 15
    },
    ageRestrictions: {
      en: 'Under 4 free',
      fr: 'Moins de 4 ans gratuit'
    },
    duration: '2 hours',
    included: {
      en: ['Hotel transfer', 'Entry ticket', 'Shark show ticket'],
      fr: ['Transfert hôtel', 'Billet d\'entrée', 'Billet spectacle de requins']
    },
    imageUrl: tourismImages.seaAdventure,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: false,
    groupAvailable: true
  },
  {
    id: 'mahmya-island',
    slug: 'mahmya-island',
    name: {
      en: 'Mahmya Island',
      fr: 'Île Mahmya'
    },
    category: 'island-trips',
    description: {
      en: 'Escape to the natural reserve of Mahmya Island with pristine white sand beaches and turquoise waters.',
      fr: 'Évadez-vous dans la réserve naturelle de l\'île Mahmya avec ses plages de sable blanc immaculées et ses eaux turquoise.'
    },
    highlights: {
      en: ['Natural reserve island', 'White sand beaches', 'Crystal turquoise water', '1-hour buffet included', 'Snorkeling equipment'],
      fr: ['Île réserve naturelle', 'Plages de sable blanc', 'Eau turquoise cristalline', 'Buffet 1 heure inclus', 'Équipement de plongée']
    },
    pricing: {
      adult: 80,
      child: 40
    },
    ageRestrictions: {
      en: 'Under 3 free',
      fr: 'Moins de 3 ans gratuit'
    },
    duration: '8 hours',
    startTime: '08:30',
    endTime: '16:30',
    included: {
      en: ['Hotel transfer', 'Boat transfer', 'Island access', 'Snorkeling gear', '1-hour buffet', '1-hour drinks'],
      fr: ['Transfert hôtel', 'Transfert bateau', 'Accès à l\'île', 'Équipement plongée', 'Buffet 1 heure', 'Boissons 1 heure']
    },
    imageUrl: tourismImages.island,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'eden-island',
    slug: 'eden-island',
    name: {
      en: 'Eden Island',
      fr: 'Île Eden'
    },
    category: 'island-trips',
    description: {
      en: 'All-inclusive paradise island experience with unlimited buffet, drinks, and water activities.',
      fr: 'Expérience d\'île paradisiaque tout compris avec buffet illimité, boissons et activités nautiques.'
    },
    highlights: {
      en: ['All-inclusive island day', 'Snorkeling and kayaking', 'Breakfast snack', '2-hour buffet lunch', 'Unlimited drinks'],
      fr: ['Journée île tout compris', 'Plongée et kayak', 'Petit-déjeuner snack', 'Buffet déjeuner 2 heures', 'Boissons illimitées']
    },
    pricing: {
      adult: 60,
      child: 35
    },
    ageRestrictions: {
      en: 'Under 4 free',
      fr: 'Moins de 4 ans gratuit'
    },
    duration: '8 hours',
    startTime: '08:30',
    endTime: '16:30',
    included: {
      en: ['Hotel transfer', 'Boat transfer', 'Island access', 'Snorkeling gear', 'Kayak', 'Breakfast snack', '2-hour buffet', 'Unlimited drinks'],
      fr: ['Transfert hôtel', 'Transfert bateau', 'Accès île', 'Équipement plongée', 'Kayak', 'Petit-déjeuner', 'Buffet 2 heures', 'Boissons illimitées']
    },
    imageUrl: tourismImages.redSea,
    featured: true,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'spa-deluxe',
    slug: 'spa-deluxe',
    name: {
      en: 'Spa Deluxe Package',
      fr: 'Package Spa Deluxe'
    },
    category: 'wellness',
    description: {
      en: 'Indulge in 2 hours of luxury relaxation with sauna, steam bath, massages, and jacuzzi.',
      fr: 'Offrez-vous 2 heures de relaxation luxueuse avec sauna, bain de vapeur, massages et jacuzzi.'
    },
    highlights: {
      en: ['Sauna and steam bath', 'Face and body scrub', 'Bubble bath', 'Soap massage', 'Jacuzzi', 'Full body massage'],
      fr: ['Sauna et bain de vapeur', 'Gommage visage et corps', 'Bain moussant', 'Massage savon', 'Jacuzzi', 'Massage corps complet']
    },
    pricing: {
      adult: 25
    },
    ageRestrictions: {
      en: 'Adults only',
      fr: 'Adultes uniquement'
    },
    duration: '2 hours',
    included: {
      en: ['All spa treatments', 'Jacuzzi access', 'Couple-friendly'],
      fr: ['Tous les soins spa', 'Accès jacuzzi', 'Adapté aux couples']
    },
    imageUrl: tourismImages.localTourism,
    childFriendly: false,
    pickupIncluded: false,
    privateAvailable: true,
    groupAvailable: false
  },
  {
    id: 'horse-riding',
    slug: 'horse-riding',
    name: {
      en: 'Horse Riding at Sunset',
      fr: 'Balade à Cheval au Coucher du Soleil'
    },
    category: 'family-activities',
    description: {
      en: 'Ride along the beach and through the desert at sunset. A magical experience for horse lovers.',
      fr: 'Chevauchée le long de la plage et à travers le désert au coucher du soleil. Une expérience magique pour les amoureux des chevaux.'
    },
    highlights: {
      en: ['Sunset beach ride', 'Desert experience', 'All equipment included', 'Suitable for beginners'],
      fr: ['Balade plage au coucher du soleil', 'Expérience désertique', 'Tout équipement inclus', 'Convient aux débutants']
    },
    pricing: {
      adult: 25
    },
    ageRestrictions: {
      en: '6+ years, max 90kg',
      fr: '6 ans et plus, max 90kg'
    },
    duration: '6 hours',
    startTime: '15:00',
    endTime: '21:00',
    maxWeight: 90,
    included: {
      en: ['Hotel transfer', 'Horse rental', 'Equipment'],
      fr: ['Transfert hôtel', 'Location cheval', 'Équipement']
    },
    imageUrl: tourismImages.island,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: true,
    groupAvailable: true
  },
  {
    id: 'dolphin-show',
    slug: 'dolphin-show',
    name: {
      en: 'Dolphin & Sea Lion Show',
      fr: 'Spectacle Dauphins & Otaries'
    },
    category: 'dolphin-experiences',
    description: {
      en: 'Watch an entertaining show featuring dolphins and sea lions performing amazing tricks.',
      fr: 'Assistez à un spectacle divertissant mettant en vedette des dauphins et des otaries réalisant des tours incroyables.'
    },
    highlights: {
      en: ['Dolphin performances', 'Sea lion shows', 'Photo opportunities', 'Family entertainment'],
      fr: ['Spectacles de dauphins', 'Spectacles d\'otaries', 'Opportunités photos', 'Divertissement familial']
    },
    pricing: {
      adult: 15,
      child: 10
    },
    ageRestrictions: {
      en: 'Under 3 free',
      fr: 'Moins de 3 ans gratuit'
    },
    duration: '1.5 hours',
    included: {
      en: ['Hotel transfer', 'Show ticket', 'Photo opportunities'],
      fr: ['Transfert hôtel', 'Billet spectacle', 'Opportunités photos']
    },
    imageUrl: tourismImages.dolphinWater,
    childFriendly: true,
    pickupIncluded: true,
    privateAvailable: false,
    groupAvailable: true
  },
  {
    id: 'parasailing',
    slug: 'parasailing',
    name: {
      en: 'Parasailing Adventure',
      fr: 'Aventure Parachute Ascensionnel'
    },
    category: 'sea-adventures',
    description: {
      en: 'Soar above the Red Sea and enjoy breathtaking aerial views of Hurghada coastline.',
      fr: 'Survolez la Mer Rouge et profitez de vues aériennes à couper le souffle sur la côte d\'Hurghada.'
    },
    highlights: {
      en: ['Aerial Red Sea views', '5-minute flight', 'Solo or tandem', 'Professional equipment'],
      fr: ['Vues aériennes Mer Rouge', 'Vol de 5 minutes', 'Solo ou tandem', 'Équipement professionnel']
    },
    pricing: {
      adult: 15
    },
    ageRestrictions: {
      en: '6+ years',
      fr: '6 ans et plus'
    },
    duration: '5 minutes',
    included: {
      en: ['Parasailing flight', 'Safety equipment', 'Professional crew'],
      fr: ['Vol parachute ascensionnel', 'Équipement de sécurité', 'Équipe professionnelle']
    },
    excluded: {
      en: ['Hotel transfer (meet at marina)'],
      fr: ['Transfert hôtel (rendez-vous à la marina)']
    },
    imageUrl: tourismImages.boat,
    childFriendly: true,
    pickupIncluded: false,
    privateAvailable: false,
    groupAvailable: true
  }
];

export const categories = [
  { id: 'island-trips', name: { en: 'Island Trips', fr: 'Excursions Îles' } },
  { id: 'historical-tours', name: { en: 'Historical Tours', fr: 'Visites Historiques' } },
  { id: 'dolphin-experiences', name: { en: 'Dolphin Experiences', fr: 'Expériences Dauphins' } },
  { id: 'sea-adventures', name: { en: 'Sea Adventures', fr: 'Aventures Marines' } },
  { id: 'private-tours', name: { en: 'Private Tours', fr: 'Excursions Privées' } },
  { id: 'wellness', name: { en: 'Wellness', fr: 'Bien-être' } },
  { id: 'family-activities', name: { en: 'Family Activities', fr: 'Activités Familiales' } }
];
