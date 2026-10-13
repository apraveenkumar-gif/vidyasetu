import { UserProfile, NetworkMode, Language, UserRole } from '../types';

const STORAGE_KEY_USER = 'vidyasetu_user_v1';
const STORAGE_KEY_NETWORK = 'vidyasetu_network_mode';
const STORAGE_KEY_SYNC_QUEUE = 'vidyasetu_sync_queue';
const STORAGE_KEY_TEACHER_BROADCAST = 'vidyasetu_teacher_broadcast';

const DEFAULT_USER: UserProfile = {
  id: 'usr_raju_01',
  name: 'Raju M.',
  role: 'student',
  grade: 6,
  schoolName: 'Z.P. High School, Ramapuram',
  villageName: 'Ramapuram',
  language: 'en',
  avatar: '👦🏽',
  coins: 140,
  xp: 680,
  level: 3,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedBadgeIds: ['first_step', 'math_magician'],
  completedLessonIds: ['math-1-fractions'],
  quizScores: {
    'math-1-fractions': 100,
  },
  offlineDownloadedLessons: ['math-1-fractions', 'sci-1-photosynthesis'],
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) {
      saveUserProfile(DEFAULT_USER);
      return DEFAULT_USER;
    }
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    notify();
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function setUserLanguage(lang: Language) {
  const current = getUserProfile();
  current.language = lang;
  saveUserProfile(current);
}

export function setUserRole(role: UserRole) {
  const current = getUserProfile();
  current.role = role;
  saveUserProfile(current);
}

export function getNetworkMode(): NetworkMode {
  if (typeof window === 'undefined') return 'online';
  try {
    const mode = localStorage.getItem(STORAGE_KEY_NETWORK);
    if (mode === 'offline' || mode === 'low2g' || mode === 'online') {
      return mode;
    }
    // Fall back to physical navigator state
    return navigator.onLine ? 'online' : 'offline';
  } catch {
    return 'online';
  }
}

export function setNetworkMode(mode: NetworkMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_NETWORK, mode);
  notify();
}

export function isEffectivelyOnline(): boolean {
  const mode = getNetworkMode();
  if (mode === 'offline') return false;
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function addCoinsAndXp(coinsToAdd: number, xpToAdd: number) {
  const current = getUserProfile();
  current.coins += coinsToAdd;
  current.xp += xpToAdd;

  // Level computation: Every 300 XP is a new level
  const newLevel = Math.max(1, Math.floor(current.xp / 300) + 1);
  const leveledUp = newLevel > current.level;
  current.level = newLevel;

  saveUserProfile(current);
  return { newLevel, leveledUp };
}

export function markLessonCompleted(lessonId: string) {
  const current = getUserProfile();
  if (!current.completedLessonIds.includes(lessonId)) {
    current.completedLessonIds.push(lessonId);
  }
  saveUserProfile(current);
}

export function saveQuizScore(lessonId: string, scorePercent: number) {
  const current = getUserProfile();
  current.quizScores[lessonId] = scorePercent;

  // Unlock badges if conditions met
  if (!current.unlockedBadgeIds.includes('first_step')) {
    current.unlockedBadgeIds.push('first_step');
  }
  if (scorePercent === 100 && !current.unlockedBadgeIds.includes('math_magician') && lessonId.includes('math')) {
    current.unlockedBadgeIds.push('math_magician');
  }
  if (lessonId.includes('photo') && !current.unlockedBadgeIds.includes('green_scientist')) {
    current.unlockedBadgeIds.push('green_scientist');
  }

  saveUserProfile(current);

  // Queue sync if in offline mode
  if (!isEffectivelyOnline()) {
    queueOfflineItem({
      type: 'quiz_score',
      lessonId,
      score: scorePercent,
      timestamp: new Date().toISOString(),
    });
  }
}

export function toggleOfflineDownload(lessonId: string): boolean {
  const current = getUserProfile();
  let downloaded = false;
  if (current.offlineDownloadedLessons.includes(lessonId)) {
    current.offlineDownloadedLessons = current.offlineDownloadedLessons.filter((id) => id !== lessonId);
  } else {
    current.offlineDownloadedLessons.push(lessonId);
    downloaded = true;
    if (current.offlineDownloadedLessons.length >= 2 && !current.unlockedBadgeIds.includes('offline_champion')) {
      current.unlockedBadgeIds.push('offline_champion');
    }
  }
  saveUserProfile(current);
  return downloaded;
}

export function claimDailyStreakBonus(): { claimed: boolean; bonusCoins: number; currentStreak: number } {
  const current = getUserProfile();
  const today = new Date().toISOString().split('T')[0];

  if (current.lastActiveDate === today && current.coins > 0) {
    // If they already claimed today, provide a small encouragement
    return { claimed: false, bonusCoins: 0, currentStreak: current.streakDays };
  }

  const bonus = 20 + current.streakDays * 5;
  current.coins += bonus;
  current.xp += 30;
  current.streakDays += 1;
  current.lastActiveDate = today;

  if (current.streakDays >= 7 && !current.unlockedBadgeIds.includes('streak_sun')) {
    current.unlockedBadgeIds.push('streak_sun');
  }

  saveUserProfile(current);
  return { claimed: true, bonusCoins: bonus, currentStreak: current.streakDays };
}

export function queueOfflineItem(item: any) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(item);
    localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(queue));
    notify();
  } catch (e) {
    console.error(e);
  }
}

export function getSyncQueue(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearSyncQueue() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_SYNC_QUEUE);
  notify();
}

export function getTeacherBroadcast(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_TEACHER_BROADCAST);
}

export function setTeacherBroadcast(message: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TEACHER_BROADCAST, message);
  notify();
}
