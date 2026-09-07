import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  CalendarDays,
  CalendarCheck2,
  FileText,
  Award,
  Calendar,
  MapPin,
  Utensils,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Search,
  Users,
  ShieldCheck,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { DesktopNavSection, StudentProfile } from '../../types';

interface DesktopSidebarProps {
  activeSection: DesktopNavSection;
  onSelectSection: (section: DesktopNavSection) => void;
  student?: StudentProfile | null;
  onLogout?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeSection,
  onSelectSection,
  student,
  onLogout,
}) => {
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(true);

  return (
    <aside
      id="desktop-sidebar"
      className="w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between select-none min-h-screen py-5 px-4 shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
    >
      {/* Top Logo & Branding */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            {/* Stylized flame / leaf torch */}
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C9.5 5 7 8 7 11.5C7 14.538 9.462 17 12.5 17C15.538 17 18 14.538 18 11.5C18 9 16.5 6.5 15.5 5C15 8 13.5 9.5 12 10C12.5 8 13 5.5 12 2Z" />
              <path
                d="M12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17Z"
                fill="#93c5fd"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                Smart Sathey
              </span>
              <span className="font-bold text-blue-600 text-base leading-tight">
                Campus
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider">
              Learn • Connect • Grow
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-0.5 text-sm font-medium">
          {/* Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => onSelectSection('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
              activeSection === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* My Profile */}
          <button
            id="nav-profile"
            onClick={() => onSelectSection('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          {/* Academics (Expandable or Direct) */}
          <div>
            <button
              id="nav-academics"
              onClick={() => {
                setAcademicsOpen(!academicsOpen);
                onSelectSection('academics');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                activeSection === 'academics'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4" />
                <span>Academics</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  academicsOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
          </div>

          {/* Timetable */}
          <button
            id="nav-timetable"
            onClick={() => onSelectSection('timetable')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'timetable'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <span>Timetable</span>
          </button>

          {/* Attendance */}
          <button
            id="nav-attendance"
            onClick={() => onSelectSection('attendance')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'attendance'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 text-slate-500" />
            <span>Attendance</span>
          </button>

          {/* Assignments */}
          <button
            id="nav-assignments"
            onClick={() => onSelectSection('assignments')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'assignments'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Assignments</span>
          </button>

          {/* Exams */}
          <button
            id="nav-exams"
            onClick={() => onSelectSection('exams')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'exams'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-slate-500" />
            <span>Exams</span>
          </button>

          {/* Events */}
          <button
            id="nav-events"
            onClick={() => onSelectSection('events')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'events'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Events</span>
          </button>

          {/* Campus Map */}
          <button
            id="nav-map"
            onClick={() => onSelectSection('map')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'map'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>Campus Map</span>
          </button>

          {/* Canteen */}
          <button
            id="nav-canteen"
            onClick={() => onSelectSection('canteen')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'canteen'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-slate-500" />
            <span>Canteen</span>
          </button>

          {/* Library */}
          <button
            id="nav-library"
            onClick={() => onSelectSection('library')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'library'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Library</span>
          </button>

          {/* Campus Support */}
          <div>
            <button
              id="nav-support"
              onClick={() => setSupportOpen(!supportOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Campus Support</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  supportOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
            {supportOpen && (
              <div className="pl-9 pr-1 py-1 space-y-1">
                <button
                  id="nav-report-issue"
                  onClick={() => onSelectSection('report-issue')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === 'report-issue'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Report an Issue
                </button>
                <button
                  id="nav-lost-found"
                  onClick={() => onSelectSection('lost-found')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === 'lost-found'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Lost & Found
                </button>
              </div>
            )}
          </div>

          {/* Community */}
          <button
            id="nav-community"
            onClick={() => onSelectSection('community')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'community'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Community</span>
          </button>

          {/* Safety */}
          <button
            id="nav-safety"
            onClick={() => onSelectSection('safety')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'safety'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Safety</span>
          </button>

          {/* Digital Campus ID */}
          <button
            id="nav-digital-id"
            onClick={() => onSelectSection('digital-id')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'digital-id'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Digital Campus ID</span>
          </button>

          {/* Notifications */}
          <button
            id="nav-notifications"
            onClick={() => onSelectSection('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeSection === 'notifications'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Notifications</span>
          </button>
        </nav>
      </div>

      {/* Bottom Sathaye College Branding Card & Logged-in Profile */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 p-3 border border-slate-200/60">
          <div className="relative z-10">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">
              Sathaye College
            </h4>
            <p className="text-[10px] font-medium text-slate-500">Autonomous • Mumbai</p>
            <p className="text-[9px] italic text-slate-400 mt-0.5 font-serif">
              “Tradition Meets Tomorrow”
            </p>
          </div>
        </div>

        {student && (
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{student.name}</p>
                <p className="text-[10px] text-slate-500 truncate">#{student.rollNo}</p>
              </div>
            </div>
            {onLogout && (
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                title="Sign out of student account"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
