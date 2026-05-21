import type { Activity } from '../types';
import { tourismImages } from '../data/tourismImages';
import { api } from '../lib/axios';

const activityImageMap: Record<string, string> = {
  redSea: tourismImages.redSea,
  island: tourismImages.island,
  seaAdventure: tourismImages.seaAdventure,
  luxor: tourismImages.luxor,
  temple: tourismImages.temple,
  dolphinWater: tourismImages.dolphinWater,
  boat: tourismImages.boat,
  localTourism: tourismImages.localTourism,
};

export function resolveActivityImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('/uploads/')) {
    const apiOrigin = (api.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    return `${apiOrigin}${imageUrl}`;
  }

  return activityImageMap[imageUrl] || imageUrl;
}

export function normalizeActivity(activity: Activity): Activity {
  return {
    ...activity,
    imageUrl: resolveActivityImageUrl(activity.imageUrl),
    galleryImages: activity.galleryImages?.map(resolveActivityImageUrl),
    videoHighlights: activity.videoHighlights?.map((video) => ({
      ...video,
      thumbnail: video.thumbnail ? resolveActivityImageUrl(video.thumbnail) : video.thumbnail,
    })),
  };
}
