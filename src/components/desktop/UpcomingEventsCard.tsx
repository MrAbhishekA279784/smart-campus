import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { EVENTS_DATA } from '../../data/mockData';

interface UpcomingEventsCardProps {
  onViewAll: () => void;
}

export const UpcomingEventsCard: React.FC<UpcomingEventsCardProps> = ({ onViewAll }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>(EVENTS_DATA.slice(0, 3));
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const studentId = user?.id || 'db49e49e-6575-47ce-8c4e-77fbe86c5284';

  const loadEvents = () => {
    api.events
      .list(studentId)
      .then((res) => {
        if (res?.events && res.events.length > 0) {
          setEvents(res.events.slice(0, 3));
        }
      })
      .catch((e) => {
        console.warn('Failed to load events:', e);
      });
  };

  useEffect(() => {
    loadEvents();
  }, [studentId]);

  const handleToggleRegister = async (event: any) => {
    setLoadingId(event.id);
    try {
      if (event.isRegistered) {
        await api.events.cancel(event.id, studentId);
      } else {
        await api.events.register(event.id, {
          studentId,
          studentName: user?.name || 'Abhishek Gupta',
          studentRoll: '241023'
        });
      }
      loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update registration');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div
      id="upcoming-events-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base tracking-tight">Upcoming Events</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      {/* Events List */}
      <div className="mt-4 space-y-3.5">
        {events.map((event) => {
          const isRegistered = event.isRegistered;
          const isLoading = loadingId === event.id;

          return (
            <div
              key={event.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {/* Thumbnail + info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{event.subtitle}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {event.date} • {event.venue}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isLoading}
                onClick={() => handleToggleRegister(event)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isRegistered
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isLoading ? '...' : isRegistered ? 'Registered ✓' : 'Register'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
