import React, { useState } from 'react';
import { ArrowLeft, Search, Bookmark, BookOpen, Users, Laptop } from 'lucide-react';
import { LIBRARY_BOOKS } from '../../data/mockData';

interface MobileLibraryProps {
  onBack: () => void;
}

export const MobileLibrary: React.FC<MobileLibraryProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Books' | 'Study Rooms' | 'Digital'>('Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedBooks, setSavedBooks] = useState<Record<string, boolean>>({
    'bk-1': true,
  });

  const tabs = ['Books', 'Study Rooms', 'Digital'] as const;

  const toggleSave = (id: string) => {
    setSavedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredBooks = LIBRARY_BOOKS.filter((b) => {
    if (!searchQuery.trim()) return true;
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="mobile-library-screen" className="pb-24 pt-2 bg-[#f8fafc] min-h-screen">
      {/* 1. Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Library</h2>
        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="px-4 py-3 bg-white border-b border-slate-200/60">
        <div className="flex items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, ISBN..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Tab Contents */}
      {activeTab === 'Books' && (
        <div className="px-4 space-y-3">
          {filteredBooks.map((book) => {
            const isSaved = savedBooks[book.id];

            return (
              <div
                key={book.id}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-16 rounded-lg object-cover shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{book.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                      {book.author}
                    </p>
                    <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                      Available ({book.copiesAvailable} copies)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleSave(book.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isSaved
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="Bookmark book"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Study Rooms' && (
        <div className="px-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900">Quiet Study Room 2A</h4>
            <p className="text-xs text-slate-500 mt-1">2nd Floor Library Wing • 12/20 seats open</p>
            <button className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">
              Reserve Seat
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Digital' && (
        <div className="px-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900">Sathaye E-Journal & Research DB</h4>
            <p className="text-xs text-slate-500 mt-1">Access over 100,000+ IEEE, JSTOR, and Springer articles via institutional login.</p>
            <button className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">
              Open Digital Repository
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
