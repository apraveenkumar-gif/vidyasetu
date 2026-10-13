import React, { useState, useEffect } from 'react';
import { UserProfile, Language, UserRole, NetworkMode, Lesson } from './types';
import { 
  getUserProfile, 
  subscribeStorage, 
  setUserLanguage, 
  setUserRole, 
  getNetworkMode, 
  setNetworkMode as updateNetworkMode 
} from './services/storage';
import { SUBJECTS } from './data/curriculum';
import { t } from './data/translations';
import { sounds } from './services/audio';

import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { LessonsView } from './components/LessonsView';
import { LeaderboardView } from './components/LeaderboardView';
import { BadgesView } from './components/BadgesView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LessonModal } from './components/LessonModal';
import { QuizModal } from './components/QuizModal';
import { DoubtSolverModal } from './components/DoubtSolverModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';

import { 
  MessageCircleQuestion, 
  HardDrive, 
  WifiOff, 
  Heart, 
  BookOpen, 
  Radio
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [networkMode, setNetworkModeState] = useState<NetworkMode>(getNetworkMode());

  // Modals state
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);
  const [activeQuizModal, setActiveQuizModal] = useState<Lesson | null>(null);
  const [doubtSolverOpen, setDoubtSolverOpen] = useState<boolean>(false);
  const [offlineManagerOpen, setOfflineManagerOpen] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to storage updates (e.g. XP, coins, offline downloads)
    const unsubscribe = subscribeStorage(() => {
      setUser(getUserProfile());
      setNetworkModeState(getNetworkMode());
    });
    return () => unsubscribe();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setUserLanguage(lang);
  };

  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
  };

  const handleSetNetworkMode = (mode: NetworkMode) => {
    updateNetworkMode(mode);
  };

  const handleOpenLesson = (lesson: Lesson) => {
    sounds.playClick();
    setActiveLessonModal(lesson);
  };

  const handleOpenQuiz = (lesson: Lesson) => {
    sounds.playClick();
    setActiveQuizModal(lesson);
  };

  const handleStartQuizFromLesson = (lesson: Lesson) => {
    setActiveLessonModal(null);
    setActiveQuizModal(lesson);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={user.role}
        setUserRole={handleSetUserRole}
        language={user.language}
        setLanguage={handleSetLanguage}
        networkMode={networkMode}
        setNetworkMode={handleSetNetworkMode}
        coins={user.coins}
        streakDays={user.streakDays}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Offline Mode Banner if Offline or 2G */}
        {networkMode === 'offline' && (
          <div className="mb-6 bg-rose-50 border border-rose-200/90 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-rose-200 text-rose-800 rounded-lg shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold">Offline Local Safe Mode Active:</span>{' '}
                <span>All progress, lessons, and AI wisdom queries work seamlessly from local storage without signal!</span>
              </div>
            </div>
            <button
              onClick={() => setOfflineManagerOpen(true)}
              className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 font-bold rounded-lg text-xs whitespace-nowrap hover:bg-rose-100/50 cursor-pointer"
            >
              Manage Packs ({user.offlineDownloadedLessons.length})
            </button>
          </div>
        )}

        {/* 2G Rural Banner */}
        {networkMode === 'low2g' && (
          <div className="mb-6 bg-amber-50 border border-amber-200/90 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-200 text-amber-800 rounded-lg shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold">Rural 2G Edge Mode Active:</span>{' '}
                <span>High-compression lightweight assets enabled. Audio and data optimized for low bandwidth.</span>
              </div>
            </div>
            <button
              onClick={() => setOfflineManagerOpen(true)}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 font-bold rounded-lg text-xs whitespace-nowrap hover:bg-amber-100/50 cursor-pointer"
            >
              Offline Cache
            </button>
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'dashboard' && (
          <StudentDashboard
            user={user}
            language={user.language}
            subjects={SUBJECTS}
            onOpenLesson={handleOpenLesson}
            onOpenQuiz={handleOpenQuiz}
            onOpenDoubtSolver={() => setDoubtSolverOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsView
            subjects={SUBJECTS}
            language={user.language}
            user={user}
            onOpenLesson={handleOpenLesson}
            onOpenQuiz={handleOpenQuiz}
          />
        )}

        {activeTab === 'doubt_solver' && (
          <div className="pb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-stone-900 font-['Outfit']">
                  Vidya Mitra AI Doubt Solver
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  Ask any question in Science, Math, or English and get answers with everyday village stories!
                </p>
              </div>
            </div>
            <div className="h-[650px] relative">
              <DoubtSolverModal
                language={user.language}
                user={user}
                onClose={() => setActiveTab('dashboard')}
              />
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            user={user}
            language={user.language}
          />
        )}

        {activeTab === 'badges' && (
          <BadgesView
            user={user}
            language={user.language}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            language={user.language}
            user={user}
          />
        )}
      </main>

      {/* Floating Mascot Quick Help Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {/* Offline Storage Status Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setOfflineManagerOpen(true);
          }}
          className="bg-white hover:bg-stone-50 text-stone-700 p-3 rounded-2xl shadow-lg border border-stone-200 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer text-xs font-bold"
          title="Manage Offline Packs & Storage"
        >
          <HardDrive className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline font-mono">
            {user.offlineDownloadedLessons.length} Offline
          </span>
        </button>

        {/* Floating Mascot Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setDoubtSolverOpen(true);
          }}
          className="group relative flex items-center gap-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white pl-3.5 pr-4 py-2.5 rounded-2xl shadow-xl shadow-amber-500/25 border-2 border-white transition-all hover:scale-105 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 border border-amber-300">
            <img
              src="/src/assets/images/mascot_gajju_1791866709581.jpg"
              alt="Gajju Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-90 leading-tight">
              Ask Gajju
            </span>
            <span className="text-xs font-extrabold font-['Outfit'] leading-none">
              Vidya Mitra
            </span>
          </div>
        </button>
      </div>

      {/* Modals */}
      {activeLessonModal && (
        <LessonModal
          lesson={activeLessonModal}
          language={user.language}
          user={user}
          onClose={() => setActiveLessonModal(null)}
          onStartQuiz={handleStartQuizFromLesson}
        />
      )}

      {activeQuizModal && (
        <QuizModal
          lesson={activeQuizModal}
          language={user.language}
          onClose={() => setActiveQuizModal(null)}
          onLessonFinished={() => {}}
        />
      )}

      {doubtSolverOpen && (
        <DoubtSolverModal
          language={user.language}
          user={user}
          onClose={() => setDoubtSolverOpen(false)}
        />
      )}

      {offlineManagerOpen && (
        <OfflineManagerModal
          user={user}
          language={user.language}
          subjects={SUBJECTS}
          onClose={() => setOfflineManagerOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-stone-200 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 font-['Outfit']">VidyaSetu (విద్యాసేతు)</span>
            <span aria-hidden="true">·</span>
            <span>Knowledge Without Barriers for Rural India</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Telugu · Hindi · English</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">100% Offline-First Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
