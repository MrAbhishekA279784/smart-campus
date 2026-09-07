import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Building2, Calendar, UserCheck, ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api';

export const PublicIdVerificationView: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from path e.g. /verify/id/1a2b3c4d
    const pathParts = window.location.pathname.split('/');
    const tokenFromPath = pathParts[pathParts.length - 1];

    if (!tokenFromPath || tokenFromPath === 'id') {
      setError('No verification token provided in URL.');
      setLoading(false);
      return;
    }

    setToken(tokenFromPath);

    api.digitalId.verify(tokenFromPath)
      .then((res) => {
        setResult(res);
      })
      .catch((err) => {
        setError(err.message || 'Verification token check failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-slate-700 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 font-serif font-black text-xl flex items-center justify-center mx-auto shadow-md mb-2">
            ★
          </div>
          <h1 className="text-sm font-black tracking-wider uppercase text-amber-300">
            PTVA'S SATHAYE COLLEGE (AUTONOMOUS)
          </h1>
          <p className="text-xs text-blue-200 mt-0.5">Official Digital Identity Verification Portal</p>
          <p className="text-[10px] text-slate-400 mt-1">Vile Parle (East), Mumbai - 400 057</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-300">Verifying Digital ID Token with Central Campus Database...</p>
            </div>
          ) : error ? (
            <div className="p-5 bg-rose-950/60 border border-rose-800 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-rose-200">ID Verification Failed</h3>
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          ) : result?.verified && result.identity ? (
            <div className="space-y-6">
              {/* Verification Status Banner */}
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                      ✓ IDENTITY VERIFIED ACTIVE
                    </h2>
                    <p className="text-[11px] text-emerald-200">Authentic Sathaye College Institutional ID</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full">
                  OFFICIAL
                </span>
              </div>

              {/* Profile Overview Card */}
              <div className="flex items-start gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-700">
                <img
                  src={result.identity.avatarUrl}
                  alt={result.identity.fullName}
                  className="w-24 h-28 rounded-xl object-cover border-2 border-amber-400/80 shadow-md shrink-0 bg-slate-800"
                />
                <div className="space-y-1.5 flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
                    <h3 className="text-base font-bold text-white leading-tight">{result.identity.fullName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase">
                      {result.identity.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{result.identity.course}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Roll / Employee ID</span>
                      <p className="font-mono font-bold text-amber-300">{result.identity.rollNumber || result.identity.employeeId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">PRN Number</span>
                      <p className="font-mono font-bold text-slate-200">{result.identity.prn}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Details List */}
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Issuing Institution:</span>
                  <span className="font-bold text-slate-200">{result.college}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Validity Period:</span>
                  <span className="font-bold text-emerald-400">Valid until {result.identity.validUntil}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Verification Token Hash:</span>
                  <span className="font-mono text-[10px] text-slate-400">{token.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Verified Timestamp:</span>
                  <span className="text-slate-300">{new Date(result.identity.verifiedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-rose-950/60 border border-rose-800 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-rose-200">
                {result?.message || 'Invalid or Revoked ID Code'}
              </h3>
              <p className="text-xs text-rose-300">
                This QR code token has been revoked or expired. Please request a fresh ID QR code from the owner.
              </p>
            </div>
          )}

          <div className="pt-2 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Sathaye Campus App</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
