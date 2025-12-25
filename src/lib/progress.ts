import { safeJsonParse } from './storage';
import { getDateKey } from './dateKey';

export type ExerciseResult = {
  id: string; // exercise id
  title: string;
  score: number; // điểm bài
  maxScore: number;
  createdAt: string; // ISO
};

export type ChildProgress = {
  userId: string;
  totalPoints: number; // tổng điểm tích luỹ (bài tập tương tác)
  achievements: string[]; // badge/achievement id
  exerciseHistory: ExerciseResult[];
  lastActiveDateKey: string; // phục vụ streak
  streakDays: number;
};

function key(userId: string) {
  return `childProgress:${userId}`;
}

export function loadProgress(userId: string): ChildProgress {
  return safeJsonParse<ChildProgress>(localStorage.getItem(key(userId)), {
    userId,
    totalPoints: 0,
    achievements: [],
    exerciseHistory: [],
    lastActiveDateKey: '',
    streakDays: 0,
  });
}

export function saveProgress(userId: string, p: ChildProgress) {
  localStorage.setItem(key(userId), JSON.stringify(p));
}

export function addExerciseResult(userId: string, r: ExerciseResult) {
  const p = loadProgress(userId);

  // streak logic đơn giản theo ngày
  const today = getDateKey();
  if (p.lastActiveDateKey !== today) {
    // nếu hôm qua -> +1 streak, nếu bỏ ngày -> reset
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = getDateKey(yesterday);

    if (p.lastActiveDateKey === yKey) p.streakDays = (p.streakDays || 0) + 1;
    else p.streakDays = 1;

    p.lastActiveDateKey = today;
  }

  p.totalPoints += r.score;
  p.exerciseHistory = [r, ...p.exerciseHistory].slice(0, 50);

  // achievements (ví dụ)
  const ach = new Set(p.achievements);
  if (p.totalPoints >= 100) ach.add('ach_100_points');
  if (p.totalPoints >= 300) ach.add('ach_300_points');
  if (p.streakDays >= 3) ach.add('ach_3day_streak');
  if (p.exerciseHistory.length >= 10) ach.add('ach_10_exercises');

  p.achievements = Array.from(ach);

  saveProgress(userId, p);
  return p;
}

export function achievementLabel(id: string) {
  const map: Record<string, { title: string; desc: string; emoji: string }> = {
    ach_100_points: {
      title: '100 điểm',
      desc: 'Đạt 100 điểm tích luỹ',
      emoji: '🏅',
    },
    ach_300_points: {
      title: '300 điểm',
      desc: 'Đạt 300 điểm tích luỹ',
      emoji: '🏆',
    },
    ach_3day_streak: {
      title: 'Streak 3 ngày',
      desc: 'Học 3 ngày liên tiếp',
      emoji: '🔥',
    },
    ach_10_exercises: {
      title: '10 bài tập',
      desc: 'Hoàn thành 10 bài tập tương tác',
      emoji: '📚',
    },
  };
  return map[id] || { title: id, desc: 'Thành tích', emoji: '⭐' };
}
