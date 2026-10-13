import React, { useState } from 'react';
import { Subject, Lesson, Language, UserProfile } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { toggleOfflineDownload } from '../services/storage';
import { 
  BookOpen, 
  CheckCircle, 
  HardDriveDownload, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface LessonsViewProps {
  subjects: Subject[];
  language: Language;
  user: UserProfile;
  onOpenLesson: (lesson: Lesson) => void;
  onOpenQuiz: (lesson: Lesson) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  subjects,
  language,
  user,
  onOpenLesson,
  onOpenQuiz,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  const allLessons: Lesson[] = subjects.flatMap((s) => s.lessons);

  const filteredLessons = selectedSubjectId === 'all'
    ? allLessons
    : allLessons.filter((l) => l.subjectId === selectedSubjectId);

  const handleDownloadToggle = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    sounds.playClick();
    toggleOfflineDownload(lessonId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-['Outfit']">
            {t('navLessons', language)}
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Simple interactive lessons with village simulations and coin-reward quizzes.
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedSubjectId('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedSubjectId === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                sounds.playClick();
                setSelectedSubjectId(sub.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedSubjectId === sub.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {sub.title[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLessons.map((lesson) => {
          const isCompleted = user.completedLessonIds.includes(lesson.id);
          const isOffline = user.offlineDownloadedLessons.includes(lesson.id);
          const score = user.quizScores[lesson.id];

          return (
            <div
              key={lesson.id}
              onClick={() => onOpenLesson(lesson)}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <span className="uppercase tracking-wider">{lesson.subjectId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono text-stone-500">
                      <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                    </span>
                  </div>

                  {/* Offline Save Badge Button */}
                  <button
                    onClick={(e) => handleDownloadToggle(e, lesson.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                      isOffline
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isOffline ? <Check className="w-3 h-3" /> : <HardDriveDownload className="w-3 h-3" />}
                    <span>{isOffline ? 'Offline Ready' : `${lesson.sizeKb} KB`}</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {lesson.title[language]}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {lesson.subtitle[language]}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-amber-700 font-bold font-mono">
                    +{lesson.coinReward} 🪙 Coins
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-orange-700 font-bold font-mono">
                    +{lesson.xpReward} ⚡ XP
                  </span>
                  {score !== undefined && (
                    <>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-emerald-700 font-bold">
                        Best Score: {score}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLesson(lesson);
                  }}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                >
                  {t('startLesson', language)}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuiz(lesson);
                  }}
                  className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {t('takeQuiz', language)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
