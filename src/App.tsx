import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DesktopSidebar } from './components/desktop/DesktopSidebar';
import { DesktopHeader } from './components/desktop/DesktopHeader';
import { DesktopDashboard } from './components/desktop/DesktopDashboard';
import { DesktopSectionViews } from './components/desktop/DesktopSectionViews';
import { DesktopFullMapModal } from './components/desktop/DesktopFullMapModal';
import { SmartSatheLogin } from './components/common/SmartSatheLogin';
import { DigitalIdModal } from './components/common/DigitalIdModal';
import { PublicIdVerificationView } from './components/common/PublicIdVerificationView';

// Faculty Dashboards
import { FacultyDesktopDashboard } from './components/faculty/FacultyDesktopDashboard';
import { FacultyMobileDashboard } from './components/faculty/FacultyMobileDashboard';

// Library Dashboard
import { LibraryDesktopDashboard } from './components/library/LibraryDesktopDashboard';

// Canteen Dashboard
import { CanteenDesktopDashboard } from './components/canteen/CanteenDesktopDashboard';

// Admin Dashboard
import { AdminDesktopDashboard } from './components/admin/AdminDesktopDashboard';

// Mobile Components
import { MobileHome } from './components/mobile/MobileHome';
import { MobileMap } from './components/mobile/MobileMap';
import { MobileAcademics } from './components/mobile/MobileAcademics';
import { MobileEvents } from './components/mobile/MobileEvents';
import { MobileCanteen } from './components/mobile/MobileCanteen';
import { MobileLibrary } from './components/mobile/MobileLibrary';
import { MobileProfile } from './components/mobile/MobileProfile';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';

import { DesktopNavSection, MobileTab, UserRole } from './types';
import { Monitor, Smartphone, UserCheck, LogOut, Sparkles, X, Send, Bell, Megaphone, CheckCircle2 } from 'lucide-react';

function CampusPortalApp() {
  const { user, studentProfile, role, isAuthenticated, isLoading, logout, switchRole, roleVerified, session } = useAuth();

  // Handle public ID verification route without auth
  if (window.location.pathname.startsWith('/verify/id/')) {
    return <PublicIdVerificationView />;
  }

  // Navigation States for Student Portal
  const [desktopSection, setDesktopSection] = useState<DesktopNavSection>('dashboard');
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');

  // Modals
  const [isDigitalIdOpen, setIsDigitalIdOpen] = useState(false);
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotChat, setCopilotChat] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am Sathaye AI Copilot. How can I assist you with classrooms, library books, canteen orders, or event schedules today?' }
  ]);

  // Device mode switcher: 'auto', 'desktop', or 'mobile'
  const [forcedViewMode, setForcedViewMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeMode =
    forcedViewMode === 'auto'
      ? isMobileScreen
        ? 'mobile'
        : 'desktop'
      : forcedViewMode;

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 mt-4 tracking-wide">
          Verifying Sathaye Campus Credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Show New SmartSatheLogin Page
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center relative">
        <SmartSatheLogin />
      </div>
    );
  }

  // Top Bar Controls (Allows instant role switching + device view switching)
  const renderControlBar = () => (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 text-xs">
      {/* Role Switcher Pill */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {(['student', 'faculty', 'admin', 'library', 'canteen'] as UserRole[]).map((r) => (
          <button
            key={r}
            id={`switch-role-${r}`}
            onClick={() => switchRole(r)}
            className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
              role === r
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Device View Switcher for Student & Faculty */}
      {(role === 'student' || role === 'faculty') && (
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <button
            id="view-desktop-btn"
            onClick={() => setForcedViewMode('desktop')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'desktop' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            id="view-mobile-btn"
            onClick={() => setForcedViewMode('mobile')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'mobile' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Supabase Session & Role Verification Indicator */}
      <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Supabase Session</span>
        {roleVerified && (
          <span className="text-[10px] bg-emerald-200/60 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
            Verified
          </span>
        )}
      </div>

      {/* Logout button */}
      <button
        id="control-logout-btn"
        onClick={logout}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-l border-slate-200 pl-2"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );

  // 3. FACULTY DASHBOARD ROUTE (Matches fac_desktop.png and fac_phone.png)
  if (role === 'faculty') {
    return (
      <div className="min-h-screen relative">
        {renderControlBar()}
        {activeMode === 'mobile' ? (
          <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
            <FacultyMobileDashboard />
          </div>
        ) : (
          <FacultyDesktopDashboard />
        )}
      </div>
    );
  }

  // 4. LIBRARY DASHBOARD ROUTE (Matches lib.png)
  if (role === 'library') {
    return (
      <div className="min-h-screen relative">
        {renderControlBar()}
        <LibraryDesktopDashboard />
      </div>
    );
  }

  // 5. CANTEEN DASHBOARD ROUTE (Matches canteen.png)
  if (role === 'canteen') {
    return (
      <div className="min-h-screen relative">
        {renderControlBar()}
        <CanteenDesktopDashboard />
      </div>
    );
  }

  // 6. ADMIN DASHBOARD ROUTE (Matches admin.png)
  if (role === 'admin') {
    return (
      <div className="min-h-screen relative">
        {renderControlBar()}
        <AdminDesktopDashboard />
      </div>
    );
  }

  // 7. STUDENT DASHBOARD ROUTE (Strict adherence to studentdesktop.png & studentphone.png)
  const student = studentProfile || (user as any);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative antialiased selection:bg-blue-600 selection:text-white">
      {renderControlBar()}

      {/* DESKTOP STUDENT VIEW */}
      {activeMode === 'desktop' && (
        <div className="flex min-h-screen w-full">
          {/* Left Fixed Sidebar */}
          <DesktopSidebar
            activeSection={desktopSection}
            onSelectSection={(sec) => setDesktopSection(sec)}
            student={student}
            onLogout={logout}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
            <DesktopHeader
              student={student}
              onOpenProfile={() => setDesktopSection('profile')}
              onOpenNotifications={() => setDesktopSection('notifications')}
              onOpenDigitalId={() => setIsDigitalIdOpen(true)}
            />

            <main className="flex-1 overflow-y-auto">
              {desktopSection === 'dashboard' ? (
                <DesktopDashboard
                  student={student}
                  onNavigateSection={(sec) => {
                    if (sec === 'map') {
                      setIsFullMapOpen(true);
                    } else {
                      setDesktopSection(sec);
                    }
                  }}
                  onOpenDigitalId={() => setIsDigitalIdOpen(true)}
                  onOpenFullMap={() => setIsFullMapOpen(true)}
                />
              ) : (
                <DesktopSectionViews
                  section={desktopSection}
                  student={student}
                  onBackToDashboard={() => setDesktopSection('dashboard')}
                  onOpenDigitalId={() => setIsDigitalIdOpen(true)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* MOBILE STUDENT VIEW */}
      {activeMode === 'mobile' && (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[420px] min-h-screen sm:min-h-[844px] bg-[#f8fafc] sm:rounded-[36px] sm:shadow-2xl overflow-hidden sm:border-8 sm:border-slate-800 flex flex-col relative">
            {/* Top Device Notch on Simulated Phone Frame */}
            <div className="hidden sm:flex justify-center pt-2 pb-1 bg-white">
              <div className="w-28 h-4 bg-slate-900 rounded-full" />
            </div>

            {/* Mobile Screen Router */}
            <div className="flex-1 overflow-y-auto">
              {mobileTab === 'home' && (
                <MobileHome
                  student={student}
                  onSelectTab={(tab) => setMobileTab(tab)}
                  onOpenDigitalId={() => setIsDigitalIdOpen(true)}
                  onOpenCopilot={() => setIsCopilotOpen(true)}
                  onOpenNotifications={() => setIsNotificationsOpen(true)}
                  onNavigateToClass={() => setMobileTab('map')}
                />
              )}

              {mobileTab === 'academics' && (
                <MobileAcademics onBack={() => setMobileTab('home')} />
              )}

              {mobileTab === 'map' && (
                <MobileMap onBack={() => setMobileTab('home')} />
              )}

              {mobileTab === 'events' && (
                <MobileEvents onBack={() => setMobileTab('home')} />
              )}

              {mobileTab === 'canteen' && (
                <MobileCanteen onBack={() => setMobileTab('home')} />
              )}

              {mobileTab === 'profile' && (
                <MobileProfile
                  student={student}
                  onOpenDigitalId={() => setIsDigitalIdOpen(true)}
                  onNavigateSection={(sec) => {
                    if (sec === 'attendance' || sec === 'assignments') {
                      setMobileTab('academics');
                    } else if (sec === 'events') {
                      setMobileTab('events');
                    } else if (sec === 'notifications') {
                      setIsNotificationsOpen(true);
                    } else if (sec === 'help') {
                      setIsCopilotOpen(true);
                    } else {
                      setMobileTab('academics');
                    }
                  }}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav
              activeTab={mobileTab}
              onSelectTab={(tab) => setMobileTab(tab)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <DigitalIdModal
        isOpen={isDigitalIdOpen}
        onClose={() => setIsDigitalIdOpen(false)}
        student={student}
      />

      <DesktopFullMapModal
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
      />

      {/* AI COPILOT MODAL */}
      {isCopilotOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Sathaye AI Copilot</h3>
                  <p className="text-[10px] text-slate-400">Powered by Campus Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsCopilotOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs min-h-[160px]">
              {copilotChat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[88%] ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white ml-auto rounded-tr-xs font-medium'
                      : 'bg-slate-100 text-slate-800 mr-auto rounded-tl-xs font-normal'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
              <button
                onClick={() => {
                  setCopilotChat((prev) => [
                    ...prev,
                    { sender: 'user', text: 'Where is Lab 3?' },
                    { sender: 'ai', text: 'IT Block Lab 3 is located on Floor 2 of the Main Academic Wing. Take Staircase B or Elevator A.' }
                  ]);
                }}
                className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold whitespace-nowrap"
              >
                📍 Where is Lab 3?
              </button>
              <button
                onClick={() => {
                  setCopilotChat((prev) => [
                    ...prev,
                    { sender: 'user', text: 'What is today’s canteen special?' },
                    { sender: 'ai', text: 'Today’s special is Special Pav Bhaji & Fresh Cold Coffee at the Central Canteen!' }
                  ]);
                }}
                className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold whitespace-nowrap"
              >
                🍛 Canteen Specials
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!copilotQuery.trim()) return;
                const userQ = copilotQuery;
                setCopilotQuery('');
                setCopilotChat((prev) => [
                  ...prev,
                  { sender: 'user', text: userQ },
                  { sender: 'ai', text: `I found details for "${userQ}": You can check your dashboard schedule or campus map for live routing!` }
                ]);
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-100 shrink-0"
            >
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask AI anything about Sathaye..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">Campus Notices</h3>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Mid-Sem Exam Timetable Released</span>
                </div>
                <p className="text-[11px] text-amber-900/80">Check the Academics tab for your hall tickets and room allocations.</p>
                <span className="text-[10px] text-amber-600 font-semibold block">10 mins ago • Exam Cell</span>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>TechVerse 2026 Registrations Open</span>
                </div>
                <p className="text-[11px] text-blue-900/80">Submit your project entries for Hackathon and Coding Sprints before Oct 15.</p>
                <span className="text-[10px] text-blue-600 font-semibold block">2 hours ago • Gymkhana</span>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CampusPortalApp />
    </AuthProvider>
  );
}

