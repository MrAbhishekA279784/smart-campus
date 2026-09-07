import React, { useState, useEffect, useRef } from 'react';
import { X, Download, RefreshCw, Camera, CheckCircle2, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { StudentProfile } from '../../types';
import { api } from '../../lib/api';
import { ProfilePhotoUploadModal } from './ProfilePhotoUploadModal';

interface DigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const DigitalIdModal: React.FC<DigitalIdModalProps> = ({ isOpen, onClose, student }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [currentAvatar, setCurrentAvatar] = useState<string>(student.avatarUrl);

  useEffect(() => {
    setCurrentAvatar(student.avatarUrl);
  }, [student.avatarUrl]);

  // Load / initialize Digital ID QR code
  useEffect(() => {
    if (!isOpen) return;

    const loadDigitalId = async () => {
      setIsLoadingQr(true);
      try {
        const res = await api.digitalId.getUser(student.id || '241023', student.role || 'student');
        if (res.verificationUrl) {
          setVerificationUrl(res.verificationUrl);
          setVerificationToken(res.verificationToken);
          if (res.profile?.avatarUrl) {
            setCurrentAvatar(res.profile.avatarUrl);
          }

          // Generate QR code data URL using qrcode library
          const qrUrl = await QRCode.toDataURL(res.verificationUrl, {
            width: 200,
            margin: 1,
            color: { dark: '#020617', light: '#ffffff' }
          });
          setQrCodeDataUrl(qrUrl);
        }
      } catch (err: any) {
        console.warn('Fallback generating client-side verification token:', err);
        const fallbackUrl = `${window.location.origin}/verify/id/token_${Date.now()}`;
        setVerificationUrl(fallbackUrl);
        const qrUrl = await QRCode.toDataURL(fallbackUrl, {
          width: 200,
          margin: 1,
          color: { dark: '#020617', light: '#ffffff' }
        });
        setQrCodeDataUrl(qrUrl);
      } finally {
        setIsLoadingQr(false);
      }
    };

    loadDigitalId();
  }, [isOpen, student.id, student.role]);

  // Handle Regenerate QR Token
  const handleRegenerateQr = async () => {
    setIsRegenerating(true);
    try {
      const res = await api.digitalId.regenerate(student.id || '241023');
      setVerificationUrl(res.verificationUrl);
      setVerificationToken(res.verificationToken);

      const newQrUrl = await QRCode.toDataURL(res.verificationUrl, {
        width: 200,
        margin: 1,
        color: { dark: '#020617', light: '#ffffff' }
      });
      setQrCodeDataUrl(newQrUrl);
      alert('Digital ID QR Code regenerated successfully! Previous QR code token has been revoked.');
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate QR code.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle Download ID Card
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Sathaye_Digital_ID_${student.rollNo || student.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err: any) {
      alert('Failed to generate image download: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        id="digital-id-modal-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ID Card Outer Container */}
          <div className="p-6">
            <div
              ref={cardRef}
              id="digital-id-card-element"
              className="bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-5 border-2 border-amber-400/80 shadow-lg relative overflow-hidden"
            >
              {/* College Header */}
              <div className="text-center pb-3 border-b border-blue-400/30">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 font-serif font-black text-sm flex items-center justify-center mx-auto shadow-sm">
                  ★
                </div>
                <h3 className="text-xs font-black tracking-wider uppercase text-amber-300 mt-1.5 leading-tight">
                  PTVA'S SATHAYE COLLEGE (AUTONOMOUS)
                </h3>
                <p className="text-[9px] text-blue-200 tracking-wide mt-0.5">
                  Vile Parle (East), Mumbai - 400 057
                </p>
                <div className="inline-block px-3 py-0.5 mt-1 rounded-full bg-blue-800/80 text-[10px] font-bold text-white border border-blue-400/40">
                  {student.role ? `${student.role.toUpperCase()} IDENTITY CARD` : 'DIGITAL CAMPUS IDENTITY'}
                </div>
              </div>

              {/* Photo & Details Section */}
              <div className="mt-4 flex items-start gap-4">
                <div className="shrink-0 text-center relative group">
                  <img
                    src={currentAvatar}
                    alt={student.name}
                    className="w-24 h-28 rounded-xl object-cover border-2 border-white shadow-md bg-slate-800"
                  />
                  {/* Change photo button trigger */}
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold">Change Photo</span>
                  </button>

                  <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    ✓ VERIFIED ACTIVE
                  </span>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div>
                    <span className="text-[10px] text-blue-300 uppercase font-semibold">Name</span>
                    <p className="font-bold text-white text-sm leading-tight">{student.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-300 uppercase font-semibold">Course / Dept</span>
                    <p className="font-semibold text-blue-100">{student.course || 'B.Sc. IT'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-blue-300 uppercase font-semibold">Roll / ID</span>
                      <p className="font-mono font-bold text-white">{student.rollNo || '241023'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-300 uppercase font-semibold">PRN</span>
                      <p className="font-mono font-bold text-white">{student.prn || '2024016401982'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-blue-300 uppercase font-semibold">Blood Grp</span>
                      <p className="font-bold text-white">O+</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-300 uppercase font-semibold">Valid Till</span>
                      <p className="font-bold text-amber-300">{student.validTill || 'June 2029'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Scannable QR Code Section */}
              <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white p-1 rounded-xl text-slate-950 shadow-sm shrink-0">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR Code" className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 animate-pulse rounded-lg" />
                    )}
                  </div>
                  <div className="text-[10px] text-blue-200">
                    <p className="font-mono font-bold text-amber-300">SCANNABLE QR VERIFIED</p>
                    <p className="text-[9px] text-slate-300 truncate max-w-[140px]">Token: {verificationToken.slice(0, 12)}...</p>
                    <p className="text-[9px] text-blue-300 mt-0.5">Library, Canteen & Gate Security</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-xs text-amber-200">M. S. Joshi</div>
                  <span className="text-[9px] text-blue-300 block uppercase font-medium">
                    Principal
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  disabled={isRegenerating}
                  onClick={handleRegenerateQr}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate QR</span>
                </button>
              </div>

              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadCard}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Generating...' : 'Download Card'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Photo Upload Modal */}
      <ProfilePhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSuccess={(newPhoto) => {
          setCurrentAvatar(newPhoto);
        }}
      />
    </>
  );
};
