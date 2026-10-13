import React, { useState } from 'react';
import { Lesson, Language, UserProfile } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { toggleOfflineDownload } from '../services/storage';
import { InteractiveSimulator } from './InteractiveSimulator';
import { 
  X, 
  Volume2, 
  HardDriveDownload, 
  Check, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Flame,
  Clock,
  Layers
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  language: Language;
  user: UserProfile;
  onClose: () => void;
  onStartQuiz: (lesson: Lesson) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  language,
  user,
  onClose,
  onStartQuiz,
}) => {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isDownloaded = user.offlineDownloadedLessons.includes(lesson.id);

  const currentConcept = lesson.concepts[activeConceptIndex] || lesson.concepts[0];

  const handleSpeak = (text: string) => {
    sounds.playClick();
    setIsSpeaking(true);
    sounds.speak(text, language);
    setTimeout(() => setIsSpeaking(false), 8000);
  };

  const handleToggleOffline = () => {
    sounds.playClick();
    const saved = toggleOfflineDownload(lesson.id);
    if (saved) {
      sounds.playCorrect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-linear-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200/80 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <span className="uppercase tracking-wider">{lesson.subjectId}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} mins
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold">+{lesson.coinReward} Coins</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
              {lesson.title[language]}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline Pack Save Button */}
            <button
              onClick={handleToggleOffline}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDownloaded
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Download full lesson and interactive lab for offline use"
            >
              {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <HardDriveDownload className="w-3.5 h-3.5" />}
              <span>{isDownloaded ? t('savedOffline', language) : `${t('downloadOffline', language)} (${lesson.sizeKb} KB)`}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Concept Tabs if multiple */}
          {lesson.concepts.length > 1 && (
            <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
              {lesson.concepts.map((concept, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    setActiveConceptIndex(idx);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeConceptIndex === idx
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {concept.heading[language]}
                </button>
              ))}
            </div>
          )}

          {/* Active Concept Explanation */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {currentConcept.heading[language]}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed mt-1">
                  {currentConcept.content[language]}
                </p>
              </div>

              {/* TTS Read-Aloud Button */}
              <button
                onClick={() => handleSpeak(`${currentConcept.heading[language]}. ${currentConcept.content[language]}. ${currentConcept.villageAnalogy[language]}`)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
                title="Listen in chosen language"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">{t('listenAloud', language)}</span>
              </button>
            </div>

            {/* Village Analogy Card */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌾</span> {t('villageAnalogyTitle', language)}
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {currentConcept.villageAnalogy[language]}
              </p>
            </div>

            {/* Interactive Concept Simulator if available */}
            {currentConcept.simulationType && (
              <div className="pt-2">
                <InteractiveSimulator
                  type={currentConcept.simulationType}
                  language={language}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Finished reading the concepts? Put your understanding to the test!
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-white text-stone-700 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => onStartQuiz(lesson)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('takeQuiz', language)} (+{lesson.coinReward} 🪙)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
