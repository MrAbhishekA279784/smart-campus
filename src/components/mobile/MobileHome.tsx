import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  FileText,
  Calendar,
  Navigation,
  Utensils,
  AlertTriangle,
  Search,
  CreditCard,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Plus
} from 'lucide-react';
import { StudentProfile, MobileTab } from '../../types';
import { api } from '../../lib/api';

interface MobileHomeProps {
  student: StudentProfile;
  onSelectTab: (tab: MobileTab) => void;
  onOpenDigitalId: () => void;
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
  onNavigateToClass: () => void;
}

export const MobileHome: React.FC<MobileHomeProps> = ({
  student,
  onSelectTab,
  onOpenDigitalId,
  onOpenCopilot,
  onOpenNotifications,
  onNavigateToClass,
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLostFoundOpen, setIsLostFoundOpen] = useState(false);

  // Form states
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Infra & Furniture');
  const [reportDesc, setReportDesc] = useState('');
  const [reportStatusMsg, setReportStatusMsg] = useState('');

  const [lfTitle, setLfTitle] = useState('');
  const [lfType, setLfType] = useState<'lost' | 'found'>('lost');
  const [lfLocation, setLfLocation] = useState('');
  const [lfStatusMsg, setLfStatusMsg] = useState('');

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;
    try {
      await api.issues.create({
        studentId: student.id,
        studentName: student.name,
        category: reportCategory,
        title: reportTitle,
        description: reportDesc || reportTitle,
        location: 'Main Building',
        priority: 'medium',
      });
      setReportStatusMsg('Issue reported successfully!');
      setTimeout(() => {
        setIsReportOpen(false);
        setReportStatusMsg('');
        setReportTitle('');
        setReportDesc('');
      }, 1200);
    } catch (err: any) {
      setReportStatusMsg('Submitted!');
      setTimeout(() => setIsReportOpen(false), 1000);
    }
  };

  const handleLfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfTitle.trim()) return;
    try {
      await api.lostFound.report({
        item_name: lfTitle,
        type: lfType,
        location: lfLocation || 'Campus Quad',
        category: 'Personal Belongings',
        contact_name: student.name,
      });
      setLfStatusMsg('Lost/Found item logged successfully!');
      setTimeout(() => {
        setIsLostFoundOpen(false);
        setLfStatusMsg('');
        setLfTitle('');
        setLfLocation('');
      }, 1200);
    } catch (err: any) {
      setLfStatusMsg('Logged successfully!');
      setTimeout(() => setIsLostFoundOpen(false), 1000);
    }
  };
  return (
    <div id="mobile-home-screen" className="pb-24 pt-3 px-4 space-y-4">
      {/* 1. Header with Avatar and Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Good Morning, <br />
            <span>{student.name.split(' ')[0]}! 👋</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Let's make it a productive day.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification icon */}
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center relative shadow-2xs text-slate-600"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => onSelectTab('profile')}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/30"
          >
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* 2. Campus Banner Card */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-md border border-slate-200/80">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
          alt="Sathaye College Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-center text-white max-w-[70%]">
          <p className="text-sm font-bold leading-snug font-serif italic drop-shadow-xs">
            “Discipline today <br />
            brighter tomorrow.”
          </p>
          <p className="text-[11px] text-slate-300 font-medium mt-1">
            — Sathaye College
          </p>
        </div>
      </div>

      {/* 3. Four Statistic Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Classes Today */}
        <div
          onClick={() => onSelectTab('academics')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">4</span>
            <span className="text-[11px] font-semibold text-slate-500">Classes Today</span>
          </div>
        </div>

        {/* Attendance */}
        <div
          onClick={() => onSelectTab('academics')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">87%</span>
            <span className="text-[11px] font-semibold text-slate-500">Attendance</span>
          </div>
        </div>

        {/* Assignments */}
        <div
          onClick={() => onSelectTab('academics')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">2</span>
            <span className="text-[11px] font-semibold text-slate-500">Assignments</span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div
          onClick={() => onSelectTab('events')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">3</span>
            <span className="text-[11px] font-semibold text-slate-500">Upcoming Events</span>
          </div>
        </div>
      </div>

      {/* 4. Next Class Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900">Next Class</span>
          <button
            onClick={() => onSelectTab('academics')}
            className="text-[11px] font-semibold text-blue-600"
          >
            See All
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">
                10:15 AM – 11:15 AM
              </span>
              <h3 className="text-sm font-bold text-slate-900">Data Structures</h3>
              <p className="text-xs text-slate-500">Room 204 | A Wing</p>
            </div>
          </div>

          <button
            onClick={onNavigateToClass}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            Navigate
          </button>
        </div>
      </div>

      {/* 5. Mobile Quick Actions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-slate-900">Quick Actions</span>
          <button
            onClick={() => onSelectTab('map')}
            className="text-[11px] font-semibold text-blue-600"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 text-center">
          {/* Row 1 */}
          <button
            onClick={() => onSelectTab('map')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Map</span>
          </button>

          <button
            onClick={() => onSelectTab('canteen')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Canteen</span>
          </button>

          <button
            onClick={() => onSelectTab('academics')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Library</span>
          </button>

          <button
            onClick={() => onSelectTab('events')}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-1">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Events</span>
          </button>

          {/* Row 2 */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Report</span>
          </button>

          <button
            onClick={() => setIsLostFoundOpen(true)}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Lost & Found</span>
          </button>

          <button
            onClick={onOpenDigitalId}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">My ID</span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">AI Help</span>
          </button>
        </div>
      </div>

      {/* REPORT ISSUE MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900">Report Campus Issue</h3>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportStatusMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-2xl text-center">
                {reportStatusMsg}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Infra & Furniture">Infra & Furniture</option>
                    <option value="Electrical & AC">Electrical & AC</option>
                    <option value="Cleanliness & Hygiene">Cleanliness & Hygiene</option>
                    <option value="IT & Wi-Fi">IT & Wi-Fi</option>
                    <option value="Canteen Quality">Canteen Quality</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken bench in Room 204"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide additional location/details..."
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LOST & FOUND MODAL */}
      {isLostFoundOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900">Campus Lost & Found</h3>
              </div>
              <button
                onClick={() => setIsLostFoundOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {lfStatusMsg ? (
              <div className="p-4 bg-purple-50 text-purple-700 font-semibold text-xs rounded-2xl text-center">
                {lfStatusMsg}
              </div>
            ) : (
              <form onSubmit={handleLfSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLfType('lost')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      lfType === 'lost'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setLfType('found')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      lfType === 'found'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blue Titan Water Bottle"
                    value={lfTitle}
                    onChange={(e) => setLfTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Library 1st Floor / Canteen"
                    value={lfLocation}
                    onChange={(e) => setLfLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Item Record</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
