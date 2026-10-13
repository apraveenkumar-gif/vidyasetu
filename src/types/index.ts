export type Language = 'en' | 'te' | 'hi';

export type UserRole = 'student' | 'teacher';

export type NetworkMode = 'online' | 'low2g' | 'offline';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  grade: number; // 6 or 7
  schoolName: string;
  villageName: string;
  language: Language;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedBadgeIds: string[];
  completedLessonIds: string[];
  quizScores: Record<string, number>; // lessonId -> percentage
  offlineDownloadedLessons: string[]; // lessonIds saved offline
}

export interface QuizQuestion {
  id: string;
  question: Record<Language, string>;
  options: Record<Language, string[]>;
  correctIndex: number;
  explanation: Record<Language, string>;
  ruralAnalogy: Record<Language, string>;
  hint: Record<Language, string>;
}

export interface Lesson {
  id: string;
  subjectId: 'math' | 'science' | 'english';
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  grade: number;
  icon: string;
  durationMinutes: number;
  xpReward: number;
  coinReward: number;
  sizeKb: number;
  concepts: {
    heading: Record<Language, string>;
    content: Record<Language, string>;
    villageAnalogy: Record<Language, string>;
    simulationType?: 'fractions' | 'photosynthesis' | 'pulley' | 'verbs';
  }[];
  quiz: QuizQuestion[];
}

export interface Subject {
  id: 'math' | 'science' | 'english';
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  color: string;
  accentBg: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: 'streak' | 'math' | 'science' | 'english' | 'offline' | 'general';
  xpThreshold?: number;
  requirement: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  schoolName: string;
  villageName: string;
  xp: number;
  coins: number;
  streakDays: number;
  avatar: string;
  badgesCount: number;
}

export interface DoubtMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  isOfflineSource?: boolean;
  topic?: string;
}

export interface StrugglingStudent {
  id: string;
  name: string;
  avatar: string;
  villageName: string;
  riskLevel: 'high' | 'medium' | 'low';
  weakTopics: string[];
  averageScore: number;
  attendanceRate: number;
  doubtsLogged: number;
  peerBuddy?: string;
}

export interface TopicDoubtMetric {
  topic: string;
  subject: string;
  doubtCount: number;
  averageScore: number;
  strugglingCount: number;
  reteachRecommended: boolean;
  ruralMaterialSuggestion: string;
}
