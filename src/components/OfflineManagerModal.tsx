import React from 'react';
import { UserProfile, Language, Subject } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { getSyncQueue, clearSyncQueue, toggleOfflineDownload, saveUserProfile } from '../services/storage';
import { X, HardDrive, CheckCircle2, Trash2, DownloadCloud, WifiOff, RefreshCw } from 'lucide-react';

interface OfflineManagerModalProps {
  user: UserProfile;
  language: Language;
  subjects: Subject[];
  onClose: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  user,
  language,
  subjects,
  onClose,
}) => {
  const syncQueue = getSyncQueue();
  const allLessons = subjects.flatMap((s) => s.lessons);

  const downloadedLessons = allLessons.filter((l) =>
    user.offlineDownloadedLessons.includes(l.id)
  );

  const totalDownloadedKb = downloadedLessons.reduce((sum, l) => sum + l.sizeKb, 0);

  const handleDownloadAll = () => {
    sounds.playCorrect();
    const updated = {
      ...user,
      offlineDownloadedLessons: allLessons.map((l) => l.id),
    };
    saveUserProfile(updated);
  };

  const handleClearAll = () => {
    sounds.playClick();
    const updated = {
      ...user,
      offlineDownloadedLessons: [],
    };
    saveUserProfile(updated);
  };

  const handleSyncNow = () => {
    sounds.playCorrect();
    clearSyncQueue();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Local Offline Storage Manager
              </h3>
              <p className="text-xs text-stone-500">
                Study in the village without internet or mobile data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage Stats */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Packs Downloaded
            </span>
            <span className="text-2xl font-black text-amber-900 font-mono">
              {downloadedLessons.length} / {allLessons.length}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Local Storage Used
            </span>
            <span className="text-2xl font-black text-amber-900 font-mono">
              {(totalDownloadedKb / 1024).toFixed(1)} MB
            </span>
          </div>
        </div>

        {/* Offline Sync Queue */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">
              Offline Actions Sync Queue:
            </span>
            <span className="text-xs font-mono font-bold text-amber-700">
              {syncQueue.length} Pending Items
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Quiz scores and doubts logged offline are stored locally in the browser and will auto-sync when connected.
          </p>
          {syncQueue.length > 0 && (
            <button
              onClick={handleSyncNow}
              className="mt-2 w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Cloud Sync ({syncQueue.length} Items)</span>
            </button>
          )}
        </div>

        {/* Quick Batch Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadAll}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Download All Lessons (1.8 MB)</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Clear downloaded packs"
          >
            <Trash2 className="w-4 h-4 text-stone-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
