import React, { useState } from 'react';
import { Language, UserProfile, StrugglingStudent, TopicDoubtMetric } from '../types';
import { t } from '../data/translations';
import { TOPIC_DOUBT_METRICS, INITIAL_STRUGGLING_STUDENTS } from '../data/curriculum';
import { sounds } from '../services/audio';
import { setTeacherBroadcast, getTeacherBroadcast, isEffectivelyOnline } from '../services/storage';
import { 
  Users, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  UserPlus, 
  Radio, 
  Loader2,
  FileText
} from 'lucide-react';

interface TeacherDashboardProps {
  language: Language;
  user: UserProfile;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ language, user }) => {
  const [students, setStudents] = useState<StrugglingStudent[]>(INITIAL_STRUGGLING_STUDENTS);
  const [selectedTopic, setSelectedTopic] = useState<TopicDoubtMetric | null>(null);
  const [aiReteachPlan, setAiReteachPlan] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const currentBroadcast = getTeacherBroadcast();

  // AI Reteach Intervention Plan generator
  const handleGenerateReteachPlan = async (metric: TopicDoubtMetric) => {
    sounds.playClick();
    setSelectedTopic(metric);
    setIsLoadingAi(true);
    setAiReteachPlan(null);

    try {
      if (isEffectivelyOnline()) {
        const res = await fetch('/api/teacher/intervention-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: metric.topic,
            subject: metric.subject,
            doubtCount: metric.doubtCount,
            strugglingStudents: students.filter((s) => s.weakTopics.some((w) => w.includes(metric.topic.split(':')[0]))),
            language: language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          sounds.playCorrect();
          setAiReteachPlan(data.plan);
          setIsLoadingAi(false);
          return;
        }
      }

      // Offline fallback plan
      await new Promise((r) => setTimeout(r, 600));
      sounds.playCorrect();
      setAiReteachPlan(
        `🌾 Offline Practical Reteach Guide for ${metric.topic}:\n\n` +
        `1. Hands-on Village Material Session:\n` +
        `   - Use: ${metric.ruralMaterialSuggestion}\n` +
        `   - Have students physically group objects into halves and quarters.\n\n` +
        `2. Peer Learning Circle:\n` +
        `   - Seat struggling students in groups of 3 with top scorers.\n\n` +
        `3. 5-Minute Blackboard Check:\n` +
        `   - Ask 2 rapid oral questions before lunch bell to verify clarity.`
      );
    } catch {
      setAiReteachPlan(`Hands-on Activity: Use ${metric.ruralMaterialSuggestion}`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Pair struggling student with a high scorer
  const handleAssignPeerBuddy = (studentId: string) => {
    sounds.playClick();
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            peerBuddy: s.peerBuddy ? undefined : 'Priya K. (Score 96%)',
          };
        }
        return s;
      })
    );
    sounds.playCorrect();
  };

  // Broadcast challenge to students
  const handleBroadcast = () => {
    if (!broadcastText.trim()) return;
    sounds.playClick();
    setTeacherBroadcast(broadcastText.trim());
    setBroadcastText('');
    setBroadcastSuccess(true);
    sounds.playCorrect();
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-emerald-100">
            <Users className="w-3.5 h-3.5" />
            <span>{t('teacherSubtitle', language)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit']">
            {t('teacherTitle', language)}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Monitor topic difficulty, identify students needing support, generate low-resource reteaching plans, and broadcast challenges to offline tablets.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider block text-emerald-200">
            Class Accuracy
          </span>
          <div className="text-3xl font-black font-mono text-white mt-0.5">
            76.4%
          </div>
          <span className="text-[10px] text-emerald-300">32 Tablets Synced</span>
        </div>
      </div>

      {/* Class Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Active Students
          </span>
          <div className="text-2xl font-black text-stone-900 font-mono mt-1">
            32 / 32
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">100% Attendance Rate</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Doubts Logged This Week
          </span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">
            48 Doubts
          </div>
          <span className="text-[11px] text-stone-500">Most questions in Fractions</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Students Needing Focus
          </span>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">
            {students.length} Students
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Scores below 60%</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Offline Packs Saved
          </span>
          <div className="text-2xl font-black text-sky-600 font-mono mt-1">
            64 Packs
          </div>
          <span className="text-[11px] text-stone-500">Ready for power cuts</span>
        </div>
      </div>

      {/* Weak Topics Heatmap Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{t('weakTopicsTitle', language)}</span>
            </h2>
            <p className="text-xs text-stone-600">
              Aggregated from student quizzes, mistakes, and questions asked to Vidya Mitra AI.
            </p>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {TOPIC_DOUBT_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 rounded-xl px-2 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">
                    {metric.topic}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {metric.subject}
                  </span>
                  {metric.reteachRecommended && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      ⚠️ Reteach Recommended
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-3">
                  <span className="text-amber-700 font-bold font-mono">
                    {metric.doubtCount} Doubts Logged
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">
                    Class Avg: {metric.averageScore}%
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-rose-600 font-medium">
                    {metric.strugglingCount} Students Struggling
                  </span>
                </div>

                <div className="text-[11px] text-stone-600 flex items-center gap-1.5 pt-0.5">
                  <span>🌾</span>
                  <span className="font-semibold">Local Material Idea:</span>
                  <span>{metric.ruralMaterialSuggestion}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleGenerateReteachPlan(metric)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('generateReteachPlan', language)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Reteach Intervention Modal / Output */}
      {selectedTopic && (
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-emerald-950 text-base">
                Intervention Strategy for: {selectedTopic.topic}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          {isLoadingAi ? (
            <div className="p-6 text-center text-xs text-emerald-800 flex items-center justify-center gap-2 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Generating hands-on low-resource rural lesson plan...</span>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl border border-emerald-200 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line space-y-2">
              {aiReteachPlan}
            </div>
          )}
        </div>
      )}

      {/* Lagging Students Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
            {t('laggingStudentsTitle', language)}
          </h2>
          <p className="text-xs text-stone-600">
            Identified through low quiz scores, high doubt count, and missed offline modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-xl border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3 bg-stone-50/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{st.avatar}</span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {st.name}
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Village: {st.villageName}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    st.riskLevel === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {st.riskLevel} Attention
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Weak Topics:</span>
                  <span className="font-semibold text-rose-700">
                    {st.weakTopics.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 font-mono">
                  <span>Average Score:</span>
                  <span className="font-bold text-stone-900">{st.averageScore}%</span>
                </div>
                <div className="flex justify-between text-stone-600 font-mono">
                  <span>Doubts Logged:</span>
                  <span className="text-amber-700 font-bold">{st.doubtsLogged} doubts</span>
                </div>
              </div>

              {/* Peer Buddy Status */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  {st.peerBuddy ? `Buddy: ${st.peerBuddy}` : 'No Peer Buddy Assigned'}
                </span>

                <button
                  onClick={() => handleAssignPeerBuddy(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    st.peerBuddy
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                  }`}
                >
                  {st.peerBuddy ? '✓ Buddy Paired' : t('assignPeerBuddy', language)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Offline Challenge / Notice to Student Tablets */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-amber-700" />
          <h3 className="font-bold text-amber-950 text-base">
            Broadcast Lesson Challenge or Voice Note to All 32 Student Tablets
          </h3>
        </div>
        <p className="text-xs text-amber-900/80">
          Messages sync automatically to all student tablets next time they connect or transfer via peer-to-peer Wi-Fi hotspot in the village school.
        </p>

        {currentBroadcast && (
          <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-stone-800">
            <span className="font-bold text-amber-800 block">Current Active Announcement:</span>
            <span>"{currentBroadcast}"</span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            placeholder="e.g. Master Sharma: Tomorrow morning at school tree, bring 10 pebbles for Fractions practice!"
            className="flex-1 bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
          />
          <button
            onClick={handleBroadcast}
            disabled={!broadcastText.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Tablets</span>
          </button>
        </div>

        {broadcastSuccess && (
          <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center animate-bounce">
            {t('broadcastSuccess', language)}
          </div>
        )}
      </div>
    </div>
  );
};
