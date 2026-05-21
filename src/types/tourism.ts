export interface LocalizedString {
  en: string;
  fr: string;
}

export interface PricingField {
  id?: string;
  name: LocalizedString;
  price: number;
  isMain?: boolean;
}

export interface Activity {
  id: string;
  name: LocalizedString;
  slug: string;
  category: string;
  description: LocalizedString;
  highlights: {
    en: string[];
    fr: string[];
  };
  pricing: {
    adult?: number;
    child?: number;
    private?: number;
    extraPerson?: number;
    visitor?: number;
  };
  pricingFields?: PricingField[];
  ageRestrictions: LocalizedString;
  duration: string;
  startTime?: string;
  endTime?: string;
  times?: string[];
  maxCapacity?: number;
  maxWeight?: number;
  included: {
    en: string[];
    fr: string[];
  };
  excluded?: {
    en: string[];
    fr: string[];
  };
  imageUrl: string;
  galleryImages?: string[];
  featured?: boolean;
  childFriendly: boolean;
  familyFriendly: boolean;
  pickupIncluded: boolean;
  availableDaily?: boolean;
  freeCancellation?: boolean;
  privateAvailable: boolean;
  groupAvailable: boolean;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  hotelName: string;
  roomNumber?: string;
  nationality: string;
  preferredDate: string;
  adults: number;
  children: number;
  language: string;
  specialRequests?: string;
  selectedActivity: string;
}

export type Language = 'en' | 'fr';
