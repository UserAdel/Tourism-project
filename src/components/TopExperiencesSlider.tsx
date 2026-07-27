import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { Activity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ActivityCard from './ActivityCard';

interface TopExperiencesSliderProps {
  activities: Activity[];
}

const CARD_GAP = 24;
const AUTOPLAY_DELAY = 2200;

export default function TopExperiencesSlider({
  activities,
}: TopExperiencesSliderProps) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);

  const maxIndex = Math.max(0, activities.length - visibleCount);
  const pageIndexes = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );

  const scrollToIndex = useCallback(
    (requestedIndex: number) => {
      const nextIndex = Math.min(Math.max(requestedIndex, 0), maxIndex);
      const viewport = viewportRef.current;
      const targetCard = viewport?.children[nextIndex] as HTMLElement | undefined;
      const firstCard = viewport?.children[0] as HTMLElement | undefined;

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      if (viewport && targetCard && firstCard) {
        viewport.scrollTo({
          left: targetCard.offsetLeft - firstCard.offsetLeft,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      }
    },
    [maxIndex, reduceMotion],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateVisibleCount = () => {
      const width = viewport.clientWidth;
      setVisibleCount(width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    };

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const nextIndex = Math.min(currentIndexRef.current, maxIndex);
    const viewport = viewportRef.current;
    const targetCard = viewport?.children[nextIndex] as HTMLElement | undefined;
    const firstCard = viewport?.children[0] as HTMLElement | undefined;

    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);

    if (viewport && targetCard && firstCard) {
      viewport.scrollTo({
        left: targetCard.offsetLeft - firstCard.offsetLeft,
        behavior: 'auto',
      });
    }
  }, [visibleCount, maxIndex]);

  useEffect(() => {
    if (
      reduceMotion ||
      isInteractionPaused ||
      maxIndex === 0
    ) {
      return;
    }

    const autoplayTimer = window.setInterval(() => {
      const nextIndex =
        currentIndexRef.current >= maxIndex
          ? 0
          : currentIndexRef.current + 1;

      scrollToIndex(nextIndex);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(autoplayTimer);
  }, [
    isInteractionPaused,
    maxIndex,
    reduceMotion,
    scrollToIndex,
  ]);

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const cardWidth =
        (viewport.clientWidth - CARD_GAP * (visibleCount - 1)) / visibleCount;
      const nextIndex = Math.min(
        maxIndex,
        Math.max(0, Math.round(viewport.scrollLeft / (cardWidth + CARD_GAP))),
      );

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      scrollFrameRef.current = null;
    });
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <div
      className="top-experiences-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={
        language === 'fr'
          ? 'Carrousel des meilleures expériences'
          : 'Top experiences carousel'
      }
      onMouseEnter={() => setIsInteractionPaused(true)}
      onMouseLeave={() => setIsInteractionPaused(false)}
      onFocusCapture={() => setIsInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsInteractionPaused(false);
        }
      }}
      onTouchStart={() => setIsInteractionPaused(true)}
      onTouchEnd={() => setIsInteractionPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollToIndex(currentIndex - 1);
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollToIndex(currentIndex + 1);
        }
      }}
    >
      <div
        ref={viewportRef}
        className="top-experiences-viewport"
        onScroll={handleScroll}
        tabIndex={0}
      >
        {activities.map((activity, index) => (
          <article
            key={activity.id}
            className="top-experiences-slide"
            style={{
              flexBasis: `calc((100% - ${
                CARD_GAP * (visibleCount - 1)
              }px) / ${visibleCount})`,
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${activities.length}`}
          >
            <ActivityCard activity={activity} />
          </article>
        ))}
      </div>

      <div className="relative mt-7 flex items-center">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label={
            language === 'fr'
              ? 'Navigation du carrousel'
              : 'Carousel navigation'
          }
        >
          <button
            type="button"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="experience-slider-arrow"
            aria-label={
              language === 'fr'
                ? 'Expériences précédentes'
                : 'Previous experiences'
            }
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex === maxIndex}
            className="experience-slider-arrow"
            aria-label={
              language === 'fr'
                ? 'Expériences suivantes'
                : 'Next experiences'
            }
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
          {pageIndexes.map((pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              onClick={() => scrollToIndex(pageIndex)}
              className={`experience-slider-dot ${
                currentIndex === pageIndex ? 'is-active' : ''
              }`}
              aria-label={
                language === 'fr'
                  ? `Aller à la position ${pageIndex + 1}`
                  : `Go to slider position ${pageIndex + 1}`
              }
              aria-current={currentIndex === pageIndex ? 'true' : undefined}
            />
          ))}
        </div>

      </div>

      <p className="sr-only">
        {language === 'fr'
          ? `Position ${currentIndex + 1} sur ${maxIndex + 1}`
          : `Slider position ${currentIndex + 1} of ${maxIndex + 1}`}
      </p>
    </div>
  );
}
