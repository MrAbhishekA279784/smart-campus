import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, FileText, Calendar } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface StatCardsProps {
  onNavigate: (section: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classesToday: 4,
    attendancePercent: 87,
    pendingAssignments: 2,
    upcomingEvents: 3
  });

  useEffect(() => {
    let isMounted = true;
    const studentId = user?.id || 'db49e49e-6575-47ce-8c4e-77fbe86c5284';

    api.students
      .getStats(studentId)
      .then((data) => {
        if (isMounted && data) {
          setStats({
            classesToday: data.classesToday ?? 4,
            attendancePercent: data.attendancePercent ?? 87,
            pendingAssignments: data.pendingAssignments ?? 2,
            upcomingEvents: data.upcomingEvents ?? 3
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load student stats, using fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Classes Today */}
      <div
        id="stat-card-classes"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex items-start gap-4 transition-all hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-2xl font-bold text-slate-900 block leading-tight">
            {stats.classesToday}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-semibold text-slate-500">Classes Today</span>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              View →
            </button>
          </div>
        </div>
      </div>

      {/* 2. Attendance */}
      <div
        id="stat-card-attendance"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex items-start gap-4 transition-all hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-2xl font-bold text-slate-900 block leading-tight">
            {stats.attendancePercent}%
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-semibold text-slate-500">Attendance</span>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              View →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pending Assignments */}
      <div
        id="stat-card-assignments"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex items-start gap-4 transition-all hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-2xl font-bold text-slate-900 block leading-tight">
            {stats.pendingAssignments}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-semibold text-slate-500">Pending Assignments</span>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              View →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Upcoming Events */}
      <div
        id="stat-card-events"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex items-start gap-4 transition-all hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-2xl font-bold text-slate-900 block leading-tight">
            {stats.upcomingEvents}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-semibold text-slate-500">Upcoming Events</span>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
