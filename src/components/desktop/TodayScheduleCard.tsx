import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DESKTOP_SCHEDULE } from '../../data/mockData';

interface TodayScheduleCardProps {
  onViewFullTimetable: () => void;
}

export const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({ onViewFullTimetable }) => {
  const [schedule, setSchedule] = useState<any[]>(DESKTOP_SCHEDULE);

  useEffect(() => {
    let isMounted = true;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()] || 'Monday';
    const dayQuery = currentDay === 'Sunday' ? 'Monday' : currentDay;

    api.academics
      .getTimetable(dayQuery)
      .then((res) => {
        if (isMounted && res?.timetable && res.timetable.length > 0) {
          const mapped = res.timetable.map((item, idx) => ({
            id: item.id || `sch-${idx}`,
            startTime: item.start_time?.slice(0, 5) || '09:00',
            endTime: item.end_time?.slice(0, 5) || '10:00',
            subject: item.subject,
            faculty: item.faculty_name,
            room: `Room ${item.room_number || '101'}`,
            building: item.building_name || 'Main Building',
            status: idx === 0 ? 'ongoing' : 'upcoming',
            countdown: idx === 1 ? 'in 45m' : undefined
          }));
          setSchedule(mapped);
        }
      })
      .catch((e) => {
        console.warn('Timetable API fetch warning:', e);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      id="today-schedule-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">Today's Schedule</h3>
          <p className="text-xs text-slate-400 mt-0.5">{dateString}</p>
        </div>
        <button
          onClick={onViewFullTimetable}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View Full Timetable</span>
          <span>→</span>
        </button>
      </div>

      {/* Timeline entries */}
      <div className="mt-5 space-y-4 relative">
        {/* Timeline vertical connector line */}
        <div className="absolute left-[7px] top-3 bottom-5 w-0.5 bg-slate-200 pointer-events-none" />

        {schedule.map((item, idx) => {
          const isOngoing = item.status === 'ongoing' || idx === 0;
          const isNext = item.countdown !== undefined || idx === 1;

          return (
            <div key={item.id} className="relative flex items-start gap-4 pl-0">
              {/* Timeline indicator node */}
              <div className="relative z-10 mt-1">
                {isOngoing ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                )}
              </div>

              {/* Class details */}
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block tracking-tight">
                    {item.startTime} – {item.endTime}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.subject}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.room} <span className="text-slate-300">|</span> {item.building}
                  </p>
                </div>

                {/* Status Badge */}
                <div>
                  {isOngoing && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Ongoing
                    </span>
                  )}
                  {!isOngoing && isNext && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200/60">
                      {item.countdown || 'Next Lecture'}
                    </span>
                  )}
                  {!isOngoing && !isNext && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
