export interface Activity {
  id: string;
  name: {
    en: string;
    fr: string;
  };
  slug: string;
  category: string;
  description: {
    en: string;
    fr: string;
  };
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
  ageRestrictions: {
    en: string;
    fr: string;
  };
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
  featured?: boolean;
  childFriendly: boolean;
  pickupIncluded: boolean;
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
