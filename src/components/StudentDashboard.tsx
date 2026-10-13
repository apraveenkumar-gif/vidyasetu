import React, { useState } from 'react';
import { UserProfile, Language, Subject, Lesson } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { claimDailyStreakBonus, getTeacherBroadcast } from '../services/storage';
import { 
  Flame, 
  Coins, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  HardDriveDownload,
  Award,
  MessageCircleQuestion,
  Bell
} from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  language: Language;
  subjects: Subject[];
  onOpenLesson: (lesson: Lesson) => void;
  onOpenQuiz: (lesson: Lesson) => void;
  onOpenDoubtSolver: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  language,
  subjects,
  onOpenLesson,
  onOpenQuiz,
  onOpenDoubtSolver,
  onNavigateTab,
}) => {
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);

  const teacherBroadcast = getTeacherBroadcast();

  const handleClaimBonus = () => {
    const res = claimDailyStreakBonus();
    if (res.claimed) {
      sounds.playCoin();
      setBonusClaimed(true);
      setBonusMessage(`+${res.bonusCoins} Vidya Coins Added! Streak: ${res.currentStreak} Days 🔥`);
      setTimeout(() => setBonusMessage(null), 4000);
    } else {
      sounds.playClick();
      setBonusMessage('Daily reward already claimed today! Keep learning!');
      setTimeout(() => setBonusMessage(null), 3000);
    }
  };

  // Level Title Calculation
  const getLevelTitle = (lvl: number, lang: Language) => {
    const titles: Record<number, Record<Language, string>> = {
      1: { en: 'Village Explorer', te: 'గ్రామ అన్వేషకుడు', hi: 'गाँव का खोजी' },
      2: { en: 'Curious Thinker', te: 'జిజ్ఞాసువు', hi: 'जिज्ञासु बालक' },
      3: { en: 'Navodaya Scholar', te: 'నవోదయ మేధావి', hi: 'नवोदय विद्वान' },
      4: { en: 'Grama Ratna', te: 'గ్రామ రత్నం', hi: 'ग्राम रत्न' },
      5: { en: 'Super Innovator', te: 'బాల శాస్త్రవేత్త', hi: 'बाल वैज्ञानिक' },
    };
    return titles[lvl]?.[lang] || titles[3][lang];
  };

  const levelProgress = ((user.xp % 300) / 300) * 100;
  const totalLessonsCount = subjects.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedCount = user.completedLessonIds.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Announcement Broadcast if present */}
      {teacherBroadcast && (
        <div className="bg-amber-100/90 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <div className="p-2 bg-amber-600 text-white rounded-xl shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Teacher Broadcast from School:
            </span>
            <p className="text-xs sm:text-sm font-medium text-stone-900 mt-0.5">
              {teacherBroadcast}
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md">
        {/* Background Image Overlay with Scrim */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/banner_rural_learning_1791866709751.jpg"
            alt="Rural students learning"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold text-amber-100 border border-white/20">
              <span>{user.schoolName}</span>
              <span aria-hidden="true">·</span>
              <span>Class {user.grade}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-['Outfit'] text-white">
              {language === 'te'
                ? `నమస్కారం, ${user.name}!`
                : language === 'hi'
                ? `नमस्ते, ${user.name}!`
                : `Namaste, ${user.name}!`}
            </h1>

            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              {language === 'te'
                ? 'ఈరోజు కొత్త విషయాలు నేర్చుకుందాం! లెక్కలు, సైన్స్ మరియు ఇంగ్లీష్ పాఠాలు ఇంటర్నెట్ లేకపోయినా సులభంగా చదువుకోవచ్చు.'
                : language === 'hi'
                ? 'आज कुछ नया सीखते हैं! गणित, विज्ञान और अंग्रेज़ी के पाठ बिना इंटरनेट के भी आसानी से पढ़ें।'
                : 'Knowledge without barriers! Practice Math, Science, and English through fun village stories even without internet.'}
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={() => onNavigateTab('lessons')}
                className="px-5 py-2.5 bg-white text-amber-900 rounded-xl font-bold text-xs sm:text-sm hover:bg-amber-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{t('startLesson', language)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDoubtSolver}
                className="px-4 py-2.5 bg-amber-500/40 hover:bg-amber-500/60 border border-white/30 text-white rounded-xl font-bold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageCircleQuestion className="w-4 h-4 text-amber-200" />
                <span>Ask Vidya Mitra AI</span>
              </button>
            </div>
          </div>

          {/* Friendly Mascot Visual */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-xl bg-amber-100">
                <img
                  src="/src/assets/images/mascot_gajju_1791866709581.jpg"
                  alt="Gajju the friendly elephant mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-900 text-amber-200 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                Gajju Mitra 🐘
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification & Daily Reward Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Streak Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t('todayStreak', language)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-orange-600 font-mono tabular-nums">
                {user.streakDays}
              </span>
              <span className="text-xs font-semibold text-stone-600">Days Active</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xl shadow-inner">
            🔥
          </div>
        </div>

        {/* Vidya Coins Card with Claim Button */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t('vidyaCoins', language)}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-amber-600 font-mono tabular-nums">
                {user.coins}
              </span>
              <span className="text-xs font-semibold text-stone-500">🪙</span>
            </div>
          </div>
          <button
            onClick={handleClaimBonus}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {bonusClaimed ? 'Claimed' : 'Daily +25'}
          </button>
        </div>

        {/* Level Progression */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {t('currentLevel', language)} {user.level}
              </span>
              <div className="text-xs font-bold text-amber-900 mt-0.5 truncate">
                {getLevelTitle(user.level, language)}
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-black">
              L{user.level}
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>{user.xp} XP</span>
              <span>{user.level * 300} XP</span>
            </div>
          </div>
        </div>

        {/* Lessons Completed Tracker */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Mastered Lessons
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                {completedCount} / {totalLessonsCount}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl shadow-inner">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bonus Toast Notification */}
      {bonusMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold text-center shadow-xs animate-bounce">
          {bonusMessage}
        </div>
      )}

      {/* Core Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-stone-900 font-['Outfit']">
              {language === 'te' ? 'పాఠ్యాంశాలు' : language === 'hi' ? 'मुख्य विषय' : 'Core Subjects'}
            </h2>
            <p className="text-xs text-stone-600">
              Interactive village lessons with quizzes and offline packs.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('lessons')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const completedInSub = subject.lessons.filter((l) =>
              user.completedLessonIds.includes(l.id)
            ).length;
            const offlineInSub = subject.lessons.filter((l) =>
              user.offlineDownloadedLessons.includes(l.id)
            ).length;

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl ${subject.accentBg} text-xl font-bold`}>
                      {subject.id === 'math' ? '🧮' : subject.id === 'science' ? '🌿' : '📖'}
                    </div>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {subject.lessons.length} Lessons
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base">
                      {subject.title[language]}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {subject.description[language]}
                    </p>
                  </div>

                  <div className="pt-2 text-xs text-stone-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {completedInSub}/{subject.lessons.length} Completed
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-sky-700 font-medium">
                      <HardDriveDownload className="w-3.5 h-3.5" />
                      {offlineInSub} Offline
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 flex gap-2">
                  <button
                    onClick={() => onOpenLesson(subject.lessons[0])}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                  >
                    Open Lesson
                  </button>
                  <button
                    onClick={() => onOpenQuiz(subject.lessons[0])}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vidya Mitra Floating Help Banner */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-bold text-amber-950 text-sm sm:text-base">
              Got a doubt? Ask Vidya Mitra AI Anytime!
            </h4>
            <p className="text-xs text-amber-900/80 mt-0.5">
              Personalized mentor explaining math, science, and english using everyday village examples. Works 100% offline!
            </p>
          </div>
        </div>
        <button
          onClick={onOpenDoubtSolver}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-xs transition-all cursor-pointer"
        >
          {t('askButton', language)}
        </button>
      </div>
    </div>
  );
};
