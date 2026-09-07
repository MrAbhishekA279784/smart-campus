import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_STUDENTS } from '../../data/mockData';
import { KeyRound, ArrowRight, UserCheck } from 'lucide-react';

interface MobileOnboardingProps {
  onSuccessLogin?: () => void;
}

export const MobileOnboarding: React.FC<MobileOnboardingProps> = ({ onSuccessLogin }) => {
  const { loginWithGoogle, loginWithCredentials, loginAsDemoStudent, isLoading } = useAuth();
  const [showRollLogin, setShowRollLogin] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      if (onSuccessLogin) onSuccessLogin();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRollLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      setError('Please enter your roll number.');
      return;
    }
    setError(null);
    const res = await loginWithCredentials(rollNumber);
    if (res.success) {
      if (onSuccessLogin) onSuccessLogin();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleDemoLogin = async (studentId: string) => {
    await loginAsDemoStudent(studentId);
    if (onSuccessLogin) onSuccessLogin();
  };

  return (
    <div
      id="mobile-onboarding-screen"
      className="min-h-screen bg-gradient-to-b from-[#f0f6ff] via-white to-[#edf4fe] flex flex-col justify-between p-6 select-none relative overflow-hidden"
    >
      {/* Top Status Bar & Skip */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pt-2 px-1">
        <span>9:41</span>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Skip'}
        </button>
      </div>

      {/* College Emblem & Branding */}
      <div className="flex flex-col items-center text-center mt-2">
        {/* Sathaye College Traditional Shield Crest */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-900 to-indigo-950 p-2 shadow-lg shadow-blue-900/20 flex items-center justify-center border-2 border-amber-400">
          <div className="text-center">
            <span className="text-amber-300 font-serif text-lg font-black tracking-widest block leading-none">
              ★
            </span>
            <span className="text-white font-extrabold text-[10px] tracking-tight">SATHAYE</span>
          </div>
        </div>

        <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-3">
          SATHAYE COLLEGE (MUMBAI)
        </p>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 leading-tight">
          Smart Sathey <span className="text-blue-600 block">Campus</span>
        </h1>

        <p className="text-xs font-medium text-slate-400 mt-1">
          Learn • Connect • Grow
        </p>
      </div>

      {/* Center College Building Visual */}
      <div className="my-4 px-2">
        <div className="relative w-full h-48 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
            alt="Sathaye College Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-0 right-0 text-center text-white px-4">
            <p className="text-sm font-bold tracking-tight">More than a College.</p>
            <p className="text-xs text-slate-200">A Community.</p>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <span className="w-4 h-1.5 rounded-full bg-blue-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* Bottom Authentication CTA */}
      <div className="space-y-3 pb-2">
        {error && (
          <p className="text-center text-xs text-rose-600 font-semibold bg-rose-50 py-1.5 px-3 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        {showRollLogin ? (
          <form onSubmit={handleRollLogin} className="space-y-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Roll No (e.g. 241023)"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Signing In...' : 'Sign In with Roll No'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRollLogin(false)}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
              >
                Back
              </button>
            </div>
          </form>
        ) : (
          <>
            <button
              id="btn-google-oauth-login"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
            >
              {/* Google 'G' logo */}
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              </div>
              <span>{isLoading ? 'Signing In...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRollLogin(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Sign in with Roll No / PRN</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </>
        )}

        {/* Quick Demo Student Pills */}
        <div className="pt-2">
          <p className="text-[10px] text-center text-slate-400 font-semibold mb-1.5">
            Or test with verified student profile:
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {DEMO_STUDENTS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoLogin(demo.id)}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-bold transition-all border border-slate-200"
              >
                {demo.name.split(' ')[0]} ({demo.rollNo})
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 leading-tight pt-1">
          By continuing, you agree to our{' '}
          <span className="text-blue-600 font-semibold">
            Terms & Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

