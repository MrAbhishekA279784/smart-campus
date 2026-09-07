import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';
import { CANTEEN_MENU, LIBRARY_BOOKS } from '../../data/mockData';

interface CanteenLibraryCardsProps {
  onViewCanteen: () => void;
  onViewLibrary: () => void;
}

export const CanteenLibraryCards: React.FC<CanteenLibraryCardsProps> = ({
  onViewCanteen,
  onViewLibrary,
}) => {
  const [canteenItem, setCanteenItem] = useState(CANTEEN_MENU[0]);
  const [libraryItem, setLibraryItem] = useState(LIBRARY_BOOKS[0]);

  useEffect(() => {
    let isMounted = true;
    api.canteen
      .getMenu()
      .then((res) => {
        if (isMounted && res?.menu && res.menu.length > 0) {
          const avail = res.menu.find((m: any) => m.isAvailable) || res.menu[0];
          setCanteenItem({
            id: avail.id,
            name: avail.name,
            price: avail.price,
            category: avail.category,
            available: avail.isAvailable,
            image: avail.image
          } as any);
        }
      })
      .catch((e) => console.warn('Canteen fetch error:', e));

    api.library
      .getBooks()
      .then((res) => {
        if (isMounted && res?.books && res.books.length > 0) {
          const first = res.books[0];
          setLibraryItem({
            id: first.id,
            title: first.title,
            author: first.author,
            category: first.category,
            copiesAvailable: first.available_copies ?? 3,
            totalCopies: first.total_copies ?? 5,
            image: first.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
          } as any);
        }
      })
      .catch((e) => console.warn('Library fetch error:', e));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Canteen Today Card */}
      <div
        id="canteen-today-card"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">Canteen Today</h3>
          <button
            onClick={onViewCanteen}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Menu</span>
            <span>→</span>
          </button>
        </div>

        <button
          onClick={onViewCanteen}
          className="mt-3 flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={canteenItem.image}
              alt={canteenItem.name}
              className="w-12 h-12 rounded-xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{canteenItem.name}</h4>
              <p className="text-xs font-bold text-slate-800 mt-0.5">₹ {canteenItem.price}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-700">Available</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Library Card */}
      <div
        id="library-mini-card"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">Library</h3>
          <button
            onClick={onViewLibrary}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Library</span>
            <span>→</span>
          </button>
        </div>

        <button
          onClick={onViewLibrary}
          className="mt-3 flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={libraryItem.image}
              alt={libraryItem.title}
              className="w-10 h-13 rounded-lg object-cover shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {libraryItem.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{libraryItem.author}</p>
              <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
                Available ({libraryItem.copiesAvailable} copies)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
