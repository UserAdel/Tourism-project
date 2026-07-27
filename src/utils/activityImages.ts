import type { Activity } from '../types';
import type { SyntheticEvent } from 'react';
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

export const activityPlaceholderImage = tourismImages.activityPlaceholder;

export function resolveActivityImageUrl(imageUrl?: string | null) {
  const normalizedImageUrl = imageUrl?.trim();

  if (!normalizedImageUrl) {
    return activityPlaceholderImage;
  }

  if (normalizedImageUrl.startsWith('/uploads/')) {
    const apiOrigin = (api.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    return `${apiOrigin}${normalizedImageUrl}`;
  }

  return activityImageMap[normalizedImageUrl] || normalizedImageUrl;
}

export function handleActivityImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === 'true') return;

  image.dataset.fallbackApplied = 'true';
  image.src = activityPlaceholderImage;
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
    videoReviews: activity.videoReviews?.map((videoReview) => ({
      ...videoReview,
      thumbnail: videoReview.thumbnail
        ? resolveActivityImageUrl(videoReview.thumbnail)
        : videoReview.thumbnail,
    })),
  };
}
