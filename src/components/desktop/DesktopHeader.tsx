import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, ChevronDown, LogOut, User, CreditCard, ShieldAlert } from 'lucide-react';
import { StudentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DesktopHeaderProps {
  student: StudentProfile;
  onOpenProfile: () => void;
  onOpenDigitalId: () => void;
  onOpenNotifications?: () => void;
  onSearchFocus?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  student,
  onOpenProfile,
  onOpenDigitalId,
}) => {
  const { logout, setAttemptedRestrictedRoute } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="desktop-header"
      className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_6px_rgba(0,0,0,0.02)]"
    >
      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="desktop-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search for buildings, rooms, faculty, events, anything..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm pl-10 pr-20 py-2.5 rounded-xl border border-slate-200/90 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              K
            </kbd>
          </div>
        </div>

        {/* Live Search Quick Results overlay */}
        {searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
            <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Popular Quick Searches
            </p>
            <div className="space-y-1 mt-1 text-xs">
              <button
                onMouseDown={() => setSearchQuery('IT Block Lab 3')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span>📍 IT Block — Lab 3 (Data Structures)</span>
                <span className="text-slate-400">Classroom</span>
              </button>
              <button
                onMouseDown={() => setSearchQuery('TechVerse 2026')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span>🎉 TechVerse 2026 Annual Tech Fest</span>
                <span className="text-slate-400">Events</span>
              </button>
              <button
                onMouseDown={() => setSearchQuery('Masala Dosa')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span>🍛 Canteen: Masala Dosa (₹60)</span>
                <span className="text-slate-400">Canteen</span>
              </button>
              <button
                onMouseDown={() => setSearchQuery('Atomic Habits')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700"
              >
                <span>📚 Library: Atomic Habits (3 Available)</span>
                <span className="text-slate-400">Books</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right User & Settings Bar */}
      <div className="flex items-center gap-4 ml-6" ref={dropdownRef}>
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="header-notification-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                  <p className="font-semibold text-slate-900">Upcoming Class in 25 min</p>
                  <p className="text-slate-600 mt-0.5">Data Structures at Lab 3, IT Block</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 text-xs">
                  <p className="font-semibold text-slate-800">TY Exam Form Deadline</p>
                  <p className="text-slate-500 mt-0.5">Deadline: 5th Sept 2026</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Trigger */}
        <div className="relative">
          <button
            id="header-user-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200"
          >
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  {student.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {student.degree} | Roll No. {student.rollNo}
              </p>
            </div>
          </button>

          {/* User Profile Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-blue-600 tracking-wider">SIGNED IN AS STUDENT</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Supabase Verified
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">{student.name}</p>
                <p className="text-xs text-slate-500">{student.email}</p>
              </div>

              <div className="py-1">
                <button
                  id="menu-open-profile"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile Details</span>
                </button>
                <button
                  id="menu-open-digital-id"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenDigitalId();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Digital Campus ID Card</span>
                </button>

                {/* Test Role Guard Button (Shows strict 403 authorization guard) */}
                <button
                  id="menu-test-role-guard"
                  onClick={() => {
                    setDropdownOpen(false);
                    setAttemptedRestrictedRoute('/admin/finance');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Verify Role Security (Try /admin)</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  id="menu-logout"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout from Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme/Settings Icon */}
        <button
          id="header-theme-settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          title="Light Theme / Settings"
          aria-label="Settings"
        >
          <Sun className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
};
