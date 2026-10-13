import React, { useState, useEffect } from 'react';
import { Lesson, Language } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { addCoinsAndXp, saveQuizScore, markLessonCompleted } from '../services/storage';
import { 
  X, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  Award
} from 'lucide-react';

interface QuizModalProps {
  lesson: Lesson;
  language: Language;
  onClose: () => void;
  onLessonFinished?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lesson,
  language,
  onClose,
  onLessonFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  const questions = lesson.quiz;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
      setCorrectCount((prev) => prev + 1);
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalCorrect = correctCount + (selectedOption === currentQ.correctIndex ? 0 : 0);
    const scorePercent = Math.round((finalCorrect / questions.length) * 100);

    const coinsToGive = Math.round(lesson.coinReward * (finalCorrect / questions.length)) + 5;
    const xpToGive = Math.round(lesson.xpReward * (finalCorrect / questions.length)) + 20;

    setEarnedCoins(coinsToGive);
    setEarnedXp(xpToGive);

    const res = addCoinsAndXp(coinsToGive, xpToGive);
    setLeveledUp(res.leveledUp);

    saveQuizScore(lesson.id, scorePercent);
    if (scorePercent >= 60) {
      markLessonCompleted(lesson.id);
    }

    setQuizCompleted(true);
    sounds.playLevelUp();
    triggerConfetti();

    if (onLessonFinished) {
      onLessonFinished();
    }
  };

  const handleSpeakQuestion = () => {
    sounds.playClick();
    const qText = `${currentQ.question[language]}. Options: ${currentQ.options[language].join(', ')}`;
    sounds.speak(qText, language);
  };

  // Pure canvas confetti animation without external libraries
  const triggerConfetti = () => {
    if (typeof window === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '99999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
    const particles: any[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
      });
    }

    let frames = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 120) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Gamified Interactive Quiz
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {lesson.title[language]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Screen */}
        {quizCompleted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner animate-bounce">
              🏆
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
                {correctCount === questions.length ? 'Outstanding Score! 100%' : 'Great Effort! Quiz Complete!'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                You answered {correctCount} out of {questions.length} questions correctly!
              </p>
            </div>

            {/* Rewards Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex justify-center gap-8">
              <div className="text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Coins Earned</span>
                <span className="text-2xl font-black text-amber-600 font-mono">+{earnedCoins} 🪙</span>
              </div>
              <div className="text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">XP Gained</span>
                <span className="text-2xl font-black text-orange-600 font-mono">+{earnedXp} ⚡</span>
              </div>
            </div>

            {leveledUp && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold animate-pulse">
                🎉 Congratulations! You reached a new Level! Check your Trophy Room!
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Back to Lessons
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Screen */
          <div className="p-6 space-y-6">
            {/* Progress Bar & Indicators */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-500">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-amber-700 font-mono">Score: {correctCount}/{questions.length}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {currentQ.question[language]}
                </h4>
                <button
                  onClick={handleSpeakQuestion}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 shrink-0 cursor-pointer"
                  title="Listen question"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options[language].map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/40';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Feedback & Village Analogy Explanation */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 animate-in fade-in duration-200 ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <span>{selectedOption === currentQ.correctIndex ? '✅ ' + t('correctAnswer', language) : '💡 ' + t('tryAgain', language)}</span>
                </div>
                <p>{currentQ.explanation[language]}</p>
                <div className="pt-1 text-stone-600 text-[11px] flex items-center gap-1">
                  <span>🌾</span>
                  <span className="font-semibold">Village Context:</span>
                  <span>{currentQ.ruralAnalogy[language]}</span>
                </div>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex === questions.length - 1 ? t('finishQuiz', language) : t('nextQuestion', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
