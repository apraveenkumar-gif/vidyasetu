import React, { useState } from 'react';
import { LeaderboardEntry, Language, UserProfile } from '../types';
import { t } from '../data/translations';
import { INITIAL_LEADERBOARD } from '../data/curriculum';
import { sounds } from '../services/audio';
import { Trophy, Medal, Flame, Sparkles, School, MapPin } from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
  language: Language;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user, language }) => {
  const [filter, setFilter] = useState<'class' | 'village' | 'district'>('class');

  // Inject current user points into leaderboard
  const list = INITIAL_LEADERBOARD.map((item) => {
    if (item.id === 's-2') {
      return {
        ...item,
        name: `${user.name} (You)`,
        xp: user.xp,
        coins: user.coins,
        streakDays: user.streakDays,
        badgesCount: user.unlockedBadgeIds.length,
      };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp);

  const top3 = list.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Championship Cup Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-amber-100">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>{t('weeklyChampionship', language)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{t('timeRemaining', language)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit']">
              Rural Village Star Scholars
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-lg leading-relaxed">
              Earn XP by completing offline lessons, taking quizzes, and keeping your daily streak active!
            </p>
          </div>

          <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl bg-amber-100/30">
            <img
              src="/src/assets/images/badge_trophy_celebration_1791866711540.jpg"
              alt="Weekly Championship Trophy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs (Interactive filter control per design constitution) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('class');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'class'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Class 6A (Ramapuram)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('village');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'village'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mandal Schools
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('district');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'district'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            District Championship
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col items-center text-center order-2 sm:order-1 relative">
            <span className="absolute top-3 left-3 text-lg">🥈</span>
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-2xl border-2 border-stone-300 shadow-inner mb-2">
              {top3[1].avatar}
            </div>
            <h3 className="font-bold text-stone-900 text-sm">{top3[1].name}</h3>
            <span className="text-[11px] text-stone-500 mt-0.5">{top3[1].villageName}</span>
            <div className="mt-3 font-mono font-black text-amber-700 text-base">
              {top3[1].xp} XP
            </div>
            <span className="text-[10px] text-stone-500">{top3[1].streakDays}d Streak 🔥</span>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {top3[0] && (
          <div className="bg-linear-to-b from-amber-50 to-white rounded-2xl p-5 border-2 border-amber-300 shadow-md flex flex-col items-center text-center order-1 sm:order-2 -mt-2 relative">
            <div className="absolute -top-3 bg-amber-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
              👑 Current Leader
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl border-3 border-amber-400 shadow-inner mb-2 mt-1">
              {top3[0].avatar}
            </div>
            <h3 className="font-bold text-stone-900 text-base">{top3[0].name}</h3>
            <span className="text-[11px] text-stone-500 mt-0.5">{top3[0].villageName}</span>
            <div className="mt-3 font-mono font-black text-amber-700 text-lg">
              {top3[0].xp} XP
            </div>
            <span className="text-[10px] text-stone-500">{top3[0].streakDays}d Streak 🔥 · {top3[0].coins} Coins</span>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col items-center text-center order-3 relative">
            <span className="absolute top-3 left-3 text-lg">🥉</span>
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-2xl border-2 border-orange-200 shadow-inner mb-2">
              {top3[2].avatar}
            </div>
            <h3 className="font-bold text-stone-900 text-sm">{top3[2].name}</h3>
            <span className="text-[11px] text-stone-500 mt-0.5">{top3[2].villageName}</span>
            <div className="mt-3 font-mono font-black text-amber-700 text-base">
              {top3[2].xp} XP
            </div>
            <span className="text-[10px] text-stone-500">{top3[2].streakDays}d Streak 🔥</span>
          </div>
        )}
      </div>

      {/* Full Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Rankings Table (Tabular Data)
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Updated in real-time from offline & synced progress
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {list.map((entry, index) => {
            const isUser = entry.id === 's-2';
            return (
              <div
                key={entry.id}
                className={`px-6 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                  isUser ? 'bg-amber-50/80 font-bold' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono font-bold text-stone-500 text-xs tabular-nums text-center">
                    #{index + 1}
                  </span>
                  <span className="text-lg">{entry.avatar}</span>
                  <div>
                    <span className="text-xs sm:text-sm text-stone-900 block font-semibold">
                      {entry.name}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {entry.villageName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <span className="hidden sm:inline text-orange-600 font-medium">
                    🔥 {entry.streakDays}d
                  </span>
                  <span className="hidden sm:inline text-amber-600 font-medium">
                    🪙 {entry.coins}
                  </span>
                  <span className="font-bold text-amber-800 text-sm">
                    {entry.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
