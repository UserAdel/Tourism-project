import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Play, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCountryWithFlag } from '../data/countries';

interface VideoTestimonial {
  id: string;
  name: string;
  nationality: string;
  rating: number;
  thumbnail: string;
  youtubeId?: string;
  embedUrl?: string;
  quote: string;
}

interface VideoTestimonialsProps {
  testimonials: VideoTestimonial[];
  title?: string;
}

export default function VideoTestimonials({ testimonials, title }: VideoTestimonialsProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const { language } = useLanguage();

  const defaultTitle = language === 'en' ? 'Video Reviews' : 'Avis Vidéo';

  return (
    <div className="bg-white dark:bg-[var(--dark-card)] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--navy)] dark:text-white mb-6">
        {title || defaultTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedVideo(testimonial)}
          >
            <div className="relative aspect-video">
              <img
                src={testimonial.thumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-6 h-6 text-[var(--teal)] ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < testimonial.rating
                        ? 'fill-[var(--gold)] text-[var(--gold)]'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {testimonial.name}
              </h3>
              <p className="text-white/80 text-xs mb-2">{getCountryWithFlag(testimonial.nationality)}</p>
              <p className="text-white/90 text-xs line-clamp-2 italic">
                "{testimonial.quote}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl my-auto"
              onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                {selectedVideo.youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {selectedVideo.embedUrl && !selectedVideo.youtubeId && (
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedVideo.rating
                          ? 'fill-[var(--gold)] text-[var(--gold)]'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {selectedVideo.name}
                </h3>
                <p className="text-white/80 text-sm mb-2">{getCountryWithFlag(selectedVideo.nationality)}</p>
                <p className="text-white/90 italic">"{selectedVideo.quote}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
