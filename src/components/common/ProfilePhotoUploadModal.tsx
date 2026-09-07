import React, { useState, useRef } from 'react';
import { X, Upload, Camera, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface ProfilePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newPhotoUrl: string) => void;
}

export const ProfilePhotoUploadModal: React.FC<ProfilePhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (<= 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds maximum 5 MB limit. Please select a smaller photo.');
      return;
    }

    // Validate image format
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds maximum 5 MB limit.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await api.auth.uploadPhoto({
        userId: user?.id,
        email: user?.email,
        photoUrl: previewUrl
      });

      setSuccessMessage('Profile photo updated successfully across all campus portals!');
      if (onSuccess) {
        onSuccess(res.photoUrl || previewUrl);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        window.location.reload(); // Refresh session avatar state
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Change Profile Photo</h3>
              <p className="text-[11px] text-slate-500">Universal Digital ID & Profile Picture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-slate-50/80 hover:bg-indigo-50/30 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">Click to upload or drag & drop</p>
              <p className="text-[11px] text-slate-500 mt-1">Supports JPG, PNG, or WEBP (Max 5MB)</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview Canvas Box */}
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-600 shadow-xl bg-slate-900 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full h-full object-cover transition-transform duration-150"
                />
              </div>

              {/* Crop / Zoom Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-semibold"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Zoom Out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-semibold"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Zoom In</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Choose a different photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!previewUrl || isUploading}
            onClick={handleUpload}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <span>Saving Photo...</span>
            ) : (
              <span>Save & Update Profile</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
