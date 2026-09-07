import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Bell } from 'lucide-react';
import { api } from '../../lib/api';
import { ANNOUNCEMENTS } from '../../data/mockData';

interface AnnouncementsCardProps {
  onViewAll: () => void;
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({ onViewAll }) => {
  const [items, setItems] = useState<any[]>(ANNOUNCEMENTS);

  useEffect(() => {
    let isMounted = true;
    api.admin
      .getAnnouncements()
      .then((res) => {
        if (isMounted && res?.announcements && res.announcements.length > 0) {
          const mapped = res.announcements.map((a, idx) => ({
            id: a.id || `ann-${idx}`,
            title: a.title,
            authorDepartment: a.author_department || 'Dean of Academics',
            timestamp: a.created_at?.split('T')[0] || 'Today',
            badgeType: idx % 3 === 0 ? 'admin' : idx % 3 === 1 ? 'exam' : 'nss'
          }));
          setItems(mapped.slice(0, 3));
        }
      })
      .catch((e) => {
        console.warn('Announcements fetch warning:', e);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      id="announcements-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base tracking-tight">Announcements</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3.5">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {/* Distinctive badge icon matching screenshot */}
              <div className="mt-0.5 shrink-0">
                {item.badgeType === 'admin' && (
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                )}
                {item.badgeType === 'exam' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                {item.badgeType === 'nss' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                )}
                {!['admin', 'exam', 'nss'].includes(item.badgeType) && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-snug">{item.title}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  {item.authorDepartment} <span className="text-slate-300">|</span> {item.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
