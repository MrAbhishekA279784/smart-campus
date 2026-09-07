import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_STUDENT } from '../../data/mockData';

interface SmartSatheLoginProps {
  onSuccess?: () => void;
}

export const SmartSatheLogin: React.FC<SmartSatheLoginProps> = ({ onSuccess }) => {
  const {
    loginWithGoogle,
    loginWithCredentials,
    loginAsStaff,
    loginAsDemoStudent,
    isLoading
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  // Student inputs
  const [studentInput, setStudentInput] = useState('abhishekgupta8arollno29@gmail.com');
  const [studentPassword, setStudentPassword] = useState('••••••••••');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Staff inputs
  const [staffInput, setStaffInput] = useState('faculty@sathaye.edu');
  const [staffPassword, setStaffPassword] = useState('••••••••••');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = await loginWithCredentials(studentInput, studentPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed');
    } else {
      onSuccess?.();
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const lower = staffInput.toLowerCase();
    if (lower.includes('admin') || lower.includes('dean')) {
      await loginAsStaff('admin', staffInput);
    } else if (lower.includes('canteen')) {
      await loginAsStaff('canteen', staffInput);
    } else if (lower.includes('library') || lower.includes('sneha')) {
      await loginAsStaff('library', staffInput);
    } else {
      await loginAsStaff('faculty', staffInput);
    }
    onSuccess?.();
  };

  const handleInstantStudentLogin = async () => {
    setErrorMessage(null);
    await loginAsDemoStudent(CURRENT_STUDENT.id);
    onSuccess?.();
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    await loginWithGoogle('abhishekgupta8arollno29@gmail.com');
    onSuccess?.();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Container Card exactly matching image.png */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header with Graduation Icon */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-13 h-13 rounded-full bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Smart Sathey Campus
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Secure digital identity & academic services for students, faculty, and campus staff.
            </p>
          </div>
        </div>

        {/* Segmented Switcher: Student Portal vs Faculty & Staff */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            id="tab-student-portal"
            onClick={() => {
              setActiveTab('student');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            id="tab-faculty-staff"
            onClick={() => {
              setActiveTab('staff');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty & Staff</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: STUDENT PORTAL (image.png screenshot 1) */}
        {activeTab === 'student' && (
          <div className="space-y-4">
            {/* Quick Instant Login Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-blue-950 truncate">
                  Abhishek Gupta (Roll: 241023)
                </h3>
                <p className="text-[11px] font-medium text-blue-600 truncate mt-0.5">
                  FY B.Sc. IT • Sathaye College
                </p>
              </div>
              <button
                type="button"
                id="btn-instant-student-login"
                onClick={handleInstantStudentLogin}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>Instant Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              id="btn-google-student-login"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-800 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium tracking-wide">
                or student credentials
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student Email or Roll Number
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="input-student-email-roll"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Enter Roll Number or Sathaye Email"
                    required
                    className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                  <span className="absolute right-3 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                    SATHAYE
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Portal Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showStudentPassword ? 'text' : 'password'}
                    id="input-student-password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-student-submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                Sign In with Credentials
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: FACULTY & STAFF (image.png screenshot 2) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <form onSubmit={handleStaffSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="input-staff-email"
                    value={staffInput}
                    onChange={(e) => setStaffInput(e.target.value)}
                    placeholder="faculty@sathaye.edu"
                    required
                    className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                  <span className="absolute right-3 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                    SATHAYE
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    id="input-staff-password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-staff-submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                Staff Login
              </button>
            </form>

            {/* Demo Staff Accounts: (matches image.png screenshot 2) */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500">
                Demo Staff Accounts:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-demo-faculty"
                  onClick={() => {
                    loginAsStaff('faculty');
                    onSuccess?.();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 text-left transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate">
                    Faculty (Dr. Mehta)
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-demo-admin"
                  onClick={() => {
                    loginAsStaff('admin');
                    onSuccess?.();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 text-left transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-700 truncate">
                    Admin (Dean Office)
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-demo-canteen"
                  onClick={() => {
                    loginAsStaff('canteen');
                    onSuccess?.();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:border-orange-200 border border-slate-200/80 text-left transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <Coffee className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 group-hover:text-orange-700 truncate">
                    Canteen Staff
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-demo-library"
                  onClick={() => {
                    loginAsStaff('library');
                    onSuccess?.();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:border-purple-200 border border-slate-200/80 text-left transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 group-hover:text-purple-700 truncate">
                    Library Staff
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supabase Integration Status */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-700 font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Client Active</span>
            <span className="text-emerald-300">•</span>
            <span className="text-emerald-600">Session & Role Verification</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Parle Tilak Vidyalaya Association's Sathaye College
          </p>
        </div>

      </div>
    </div>
  );
};
