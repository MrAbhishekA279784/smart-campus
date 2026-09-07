import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    title: 'Sathaye College, Mumbai',
    subtitle: 'More than a college, a community.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    title: 'Historic Campus & Library',
    subtitle: 'Centre of excellence since 1959.',
  },
  {
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    title: 'Innovation & Research Hub',
    subtitle: 'Empowering future technologists & thinkers.',
  },
];

export const CampusBannerCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      id="campus-banner-carousel"
      className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] border border-slate-200/80 group select-none"
    >
      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Dark gradient for high contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent pointer-events-none" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Text Content */}
      <div className="absolute bottom-5 left-5 right-5 text-white">
        <h3 className="font-bold text-lg text-white tracking-tight drop-shadow-xs">
          {slide.title}
        </h3>
        <p className="text-xs text-slate-200 font-medium mt-0.5 drop-shadow-xs">
          {slide.subtitle}
        </p>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-1.5 mt-3">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
