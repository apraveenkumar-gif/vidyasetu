import React, { useState } from 'react';
import { Badge, Language, UserProfile } from '../types';
import { BADGES } from '../data/curriculum';
import { sounds } from '../services/audio';
import { Award, Lock, CheckCircle, Sparkles } from 'lucide-react';

interface BadgesViewProps {
  user: UserProfile;
  language: Language;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ user, language }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedCount = user.unlockedBadgeIds.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Trophy Room Header */}
      <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-amber-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Trophy Room & Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit']">
            Your Earned Badges & Medals
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg leading-relaxed">
            Every quiz mastered and offline lesson explored awards you with commemorative badges!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-4 border border-white/30 text-center shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider block text-amber-100">
            Badges Unlocked
          </span>
          <div className="text-3xl font-black font-mono text-white mt-1">
            {unlockedCount} / {BADGES.length}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = user.unlockedBadgeIds.includes(badge.id);

          return (
            <button
              key={badge.id}
              onClick={() => {
                sounds.playClick();
                setSelectedBadge(badge);
              }}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-xs hover:shadow-md hover:scale-102'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    isUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-400'
                  }`}>
                    {badge.category === 'math' ? '🧮' : badge.category === 'science' ? '🌿' : badge.category === 'streak' ? '🔥' : badge.category === 'offline' ? '💾' : '🏆'}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isUnlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {badge.title[language]}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {badge.description[language]}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 text-[11px] font-medium text-stone-500">
                Requirement: {badge.requirement}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal if clicked */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-stone-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                {selectedBadge.title[language]}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {selectedBadge.description[language]}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block">How to earn:</span>
              <span>{selectedBadge.requirement}</span>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
