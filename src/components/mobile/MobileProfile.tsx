import React, { useState } from 'react';
import {
  Settings,
  ChevronRight,
  CheckCircle2,
  FileText,
  Calendar,
  Bell,
  HelpCircle,
  LogOut,
  ExternalLink,
  QrCode,
  X,
  Save,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MobileProfileProps {
  student: StudentProfile;
  onOpenDigitalId: () => void;
  onNavigateSection: (sec: string) => void;
}

export const MobileProfile: React.FC<MobileProfileProps> = ({
  student,
  onOpenDigitalId,
  onNavigateSection,
}) => {
  const { logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [phoneVal, setPhoneVal] = useState('+91 98201 44521');
  const [emailVal, setEmailVal] = useState('abhishek.gupta@sathaye.edu.in');
  const [savedMsg, setSavedMsg] = useState('');

  const menuItems = [
    { id: 'attendance', label: 'My Attendance', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'assignments', label: 'My Assignments', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'events', label: 'My Events', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Profile updated successfully!');
    setTimeout(() => {
      setIsSettingsOpen(false);
      setSavedMsg('');
    }, 1200);
  };

  return (
    <div id="mobile-profile-screen" className="pb-24 pt-2 bg-[#f8fafc] min-h-screen">
      {/* 1. Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <h2 className="text-base font-bold text-slate-900">My Profile</h2>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* 2. Profile Info Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">{student.name}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{student.course}</p>
              <p className="text-[11px] text-slate-400">Roll No. {student.rollNo}</p>
              <p className="text-[11px] font-medium text-blue-600 mt-0.5">{student.collegeName}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* 3. Digital Campus ID Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-4 shadow-md shadow-blue-900/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-300 text-xs">★</span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-blue-100">
                  DIGITAL CAMPUS ID
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">{student.name}</h4>
              <p className="text-xs text-blue-100 font-mono mt-0.5">Roll No. {student.rollNo}</p>
              <p className="text-xs text-blue-200 mt-0.5">{student.course}</p>
              <p className="text-[11px] text-blue-300 mt-1">Valid till: {student.validTill}</p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-2 rounded-xl shadow-md text-slate-900 flex flex-col items-center">
              <QrCode className="w-14 h-14 text-slate-900" />
              <span className="text-[9px] font-mono text-slate-500 mt-1">SCAN ID</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-blue-500/40 flex items-center justify-between">
            <span className="text-[11px] text-blue-200">Sathaye College Student Pass</span>
            <button
              onClick={onOpenDigitalId}
              className="text-xs font-bold text-white flex items-center gap-1 hover:underline"
            >
              <span>View Full ID</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Menu Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateSection(item.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}

          {/* Logout Button */}
          <button
            id="mobile-btn-logout"
            onClick={logout}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-rose-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-rose-600">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-300" />
          </button>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-base text-slate-900">Profile Settings</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-2xl text-center">
                {savedMsg}
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={student.name}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
