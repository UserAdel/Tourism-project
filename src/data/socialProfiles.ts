export type SocialProfileId = 'instagram' | 'tiktok' | 'snapchat';

export interface SocialProfile {
  id: SocialProfileId;
  name: string;
  handle: string;
  url: string;
}

export const socialProfiles: SocialProfile[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@Hurghada_french_guide',
    url: 'https://www.instagram.com/Hurghada_french_guide',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@hurghada_french_guide',
    url: 'https://www.tiktok.com/@hurghada_french_guide',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    handle: 'french_guide',
    url: 'https://www.snapchat.com/add/french_guide',
  },
];
