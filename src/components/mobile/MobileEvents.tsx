import React, { useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Bookmark, Calendar, ArrowRight } from 'lucide-react';
import { EVENTS_DATA } from '../../data/mockData';

interface MobileEventsProps {
  onBack: () => void;
}

export const MobileEvents: React.FC<MobileEventsProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Workshops' | 'Cultural' | 'Sports' | 'Clubs'>('All');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({
    'evt-4': true,
  });

  const categories = ['All', 'Workshops', 'Cultural', 'Sports', 'Clubs'] as const;

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (activeCategory === 'All') return true;
    return e.category === activeCategory;
  });

  return (
    <div id="mobile-events-screen" className="pb-24 pt-2 bg-[#f8fafc] min-h-screen">
      {/* 1. Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Events</h2>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="px-4 py-3 bg-white border-b border-slate-200/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 3. Featured Event Card matching screenshot */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-950 text-white group">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80"
            alt="TechFest 2026"
            className="w-full h-48 object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Featured Tag */}
          <div className="absolute top-3.5 right-3.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
              Featured
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <h3 className="text-xl font-black text-white tracking-tight leading-tight">
              SATHAYE <br />
              <span className="text-cyan-400">TECHFEST 2026</span>
            </h3>
            <p className="text-[11px] text-slate-300 font-medium">
              Innovate • Collaborate • Create
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>28 Aug 2026 | Auditorium</span>
              </div>
              <button
                onClick={() => alert('Registration confirmed for Sathaye Techfest 2026!')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Register →
              </button>
            </div>
          </div>
        </div>

        {/* 4. Other Events List */}
        <div className="space-y-3">
          {filteredEvents.slice(1).map((event) => {
            const isSaved = bookmarked[event.id];

            return (
              <div
                key={event.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-13 h-13 rounded-xl object-cover shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {event.date}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {event.organizedBy}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(event.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isSaved
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="Bookmark event"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
