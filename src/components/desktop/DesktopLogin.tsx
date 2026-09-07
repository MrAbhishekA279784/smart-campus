import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_STUDENTS } from '../../data/mockData';
import { Shield, KeyRound, UserCheck, ArrowRight, AlertCircle, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export const DesktopLogin: React.FC = () => {
  const { loginWithGoogle, loginWithCredentials, loginAsDemoStudent, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'google' | 'credentials'>('google');
  const [rollOrEmail, setRollOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!rollOrEmail.trim()) {
      setErrorMessage('Please enter your Sathaye Roll Number or Student Email.');
      return;
    }
    const res = await loginWithCredentials(rollOrEmail, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row relative z-10">
        {/* Left Side: College Brand & Visual */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 p-8 text-white flex flex-col justify-between relative">
          <div>
            {/* College Crest & Motto */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/80 flex items-center justify-center p-1.5 shadow-md">
                <div className="text-center">
                  <span className="text-amber-400 font-serif text-sm font-black leading-none block">★</span>
                  <span className="text-white font-extrabold text-[8px] tracking-tight">SATHAYE</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-blue-200 uppercase leading-none">
                  PTVA's Autonomous College
                </p>
                <h2 className="text-base font-black tracking-tight text-white mt-0.5">
                  Sathaye College
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-semibold text-blue-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Academic Year 2026–2027</span>
              </div>
              <h1 className="text-2xl font-black text-white leading-snug">
                Smart Campus <span className="text-blue-400">Student Portal</span>
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamlessly access your attendance, interactive 2D campus navigation, digital timetable, exam schedules, and library catalogs.
              </p>
            </div>

            {/* Portal Features Checklist */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <span>RFID Digital Identity & Barcode</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <BookOpen className="w-3 h-3" />
                </div>
                <span>Real-time Class Timetable & Attendance</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <Shield className="w-3 h-3" />
                </div>
                <span>Official PTVA Verified Credentials</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            <p>Vile Parle (East), Mumbai 400 057</p>
            <p className="text-slate-500 text-[10px] mt-0.5">Need assistance? helpdesk@sathaye.ac.in</p>
          </div>
        </div>

        {/* Right Side: Authentication Controls */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Sign In</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select your preferred login method below</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('google')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'google'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'credentials'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Roll No / PRN
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-medium animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: Google OAuth Sign-in */}
            {activeTab === 'google' && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-slate-700 text-xs leading-relaxed">
                  <p className="font-semibold text-blue-900">Instant College Google Sign In</p>
                  <p className="text-slate-600 mt-1">
                    Log in with your official <code className="bg-blue-100/70 text-blue-800 px-1 py-0.5 rounded text-[11px]">@sathaye.ac.in</code> institutional account or any linked student Google account.
                  </p>
                </div>

                <button
                  id="btn-desktop-google-login"
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-slate-800 font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60"
                >
                  {/* Google SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoading ? 'Authenticating Credentials...' : 'Continue with Google Workspace'}</span>
                </button>
              </div>
            )}

            {/* TAB 2: Roll Number / PRN Credentials */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Roll No or Sathaye Email
                  </label>
                  <div className="relative">
                    <input
                      id="input-roll-or-email"
                      type="text"
                      placeholder="e.g. 241023 or abhishek.gupta@sathaye.ac.in"
                      value={rollOrEmail}
                      onChange={(e) => setRollOrEmail(e.target.value)}
                      className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password / Student PIN
                  </label>
                  <div className="relative">
                    <input
                      id="input-student-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                    <span>Keep me logged in</span>
                  </label>
                  <span className="text-blue-600 hover:underline cursor-pointer">Forgot PIN?</span>
                </div>

                <button
                  id="btn-credentials-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In to Student Portal'}</span>
                </button>
              </form>
            )}

            {/* DEMO STUDENT PROFILES (1-Click Switcher) */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant Demo Login (Verified Students)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_STUDENTS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => loginAsDemoStudent(demo.id)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={demo.avatarUrl}
                        alt={demo.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">
                          {demo.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {demo.degree} • #{demo.rollNo}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            By signing in, you agree to the Sathaye College IT Conduct & Ethics Code.
          </div>
        </div>
      </div>
    </div>
  );
};
