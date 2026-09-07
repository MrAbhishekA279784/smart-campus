import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BottomCtaBannerProps {
  onExplore: () => void;
}

export const BottomCtaBanner: React.FC<BottomCtaBannerProps> = ({ onExplore }) => {
  return (
    <div
      id="bottom-cta-banner"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-7 sm:p-9 shadow-lg shadow-blue-900/15"
    >
      {/* Background Architectural Watermark / Silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none overflow-hidden hidden sm:block">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&auto=format&fit=crop&q=80"
          alt="Campus Silhouette"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
            Your Campus. Your Story.
          </h2>
          <p className="text-sm sm:text-base font-medium text-blue-100/90 mt-1">
            Explore. Learn. Connect. Belong.
          </p>
        </div>

        {/* Middle Stats */}
        <div className="flex items-center gap-8 sm:gap-12">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">7+</span>
            <span className="text-xs font-semibold text-blue-200">Departments</span>
          </div>
          <div className="w-px h-8 bg-blue-400/40" />
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">5K+</span>
            <span className="text-xs font-semibold text-blue-200">Students</span>
          </div>
          <div className="w-px h-8 bg-blue-400/40" />
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">100+</span>
            <span className="text-xs font-semibold text-blue-200">Events/Year</span>
          </div>
        </div>

        {/* Right Button */}
        <div>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <span>Be a Part of It</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
