import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dialog } from '../data/dialogs';

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: string;
  totalPractice: number;
  totalQuiz: number;
  averageScore: number;
  bestScore: number;
  totalFavorites: number;
  categoriesPracticed: string[];
  dailyGoal: number;
  dailyProgress: number;
}

export interface AppState {
  favorites: number[];
  stats: UserStats;
  darkMode: boolean;
  practiceHistory: PracticeRecord[];
  quizHistory: QuizRecord[];
}

export interface PracticeRecord {
  dialogId: number;
  userAnswer: string;
  score: number;
  date: string;
}

export interface QuizRecord {
  dialogId: number;
  selectedAnswer: number;
  correctAnswer: number;
  score: number;
  date: string;
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];
export const LEVEL_NAMES = ['تازه‌کار', 'مبتدی', 'متوسط', 'پیشرفته', 'حرفه‌ای', 'استاد', 'افسانه‌ای', 'اسطوره', 'خدای حاضر جواب', 'جاودانه'];

function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function getXPForNextLevel(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 2;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, percentage: Math.min((current / needed) * 100, 100) };
}

const defaultStats: UserStats = {
  xp: 0,
  level: 0,
  streak: 0,
  lastPracticeDate: '',
  totalPractice: 0,
  totalQuiz: 0,
  averageScore: 0,
  bestScore: 0,
  totalFavorites: 0,
  categoriesPracticed: [],
  dailyGoal: 5,
  dailyProgress: 0,
};

const defaultState: AppState = {
  favorites: [],
  stats: defaultStats,
  darkMode: false,
  practiceHistory: [],
  quizHistory: [],
};

type Action =
  | { type: 'TOGGLE_FAVORITE'; dialogId: number }
  | { type: 'ADD_PRACTICE'; record: PracticeRecord; category: string }
  | { type: 'ADD_QUIZ'; record: QuizRecord }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UPDATE_STREAK' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'IMPORT_DATA'; data: AppState }
  | { type: 'RESET_DAILY_PROGRESS' };

function updateStreak(stats: UserStats): UserStats {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (stats.lastPracticeDate === today) return stats;
  
  if (stats.lastPracticeDate === yesterday) {
    return { ...stats, streak: stats.streak + 1, lastPracticeDate: today };
  } else if (stats.lastPracticeDate !== today) {
    return { ...stats, streak: 1, lastPracticeDate: today };
  }
  return stats;
}

function recalculateAverage(stats: UserStats, history: PracticeRecord[]): UserStats {
  if (history.length === 0) return { ...stats, averageScore: 0 };
  const total = history.reduce((sum, r) => sum + r.score, 0);
  return { ...stats, averageScore: Math.round(total / history.length) };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.dialogId);
      const newFavorites = exists
        ? state.favorites.filter(id => id !== action.dialogId)
        : [...state.favorites, action.dialogId];
      return {
        ...state,
        favorites: newFavorites,
        stats: { ...state.stats, totalFavorites: newFavorites.length }
      };
    }
    case 'ADD_PRACTICE': {
      const newHistory = [...state.practiceHistory, action.record];
      const newCategories = state.stats.categoriesPracticed.includes(action.category)
        ? state.stats.categoriesPracticed
        : [...state.stats.categoriesPracticed, action.category];
      const bestScore = Math.max(state.stats.bestScore, action.record.score);
      let newStats = {
        ...state.stats,
        totalPractice: state.stats.totalPractice + 1,
        bestScore,
        categoriesPracticed: newCategories,
        dailyProgress: state.stats.dailyProgress + 1,
      };
      newStats = updateStreak(newStats);
      newStats = recalculateAverage(newStats, newHistory);
      newStats = { ...newStats, level: getLevelFromXP(newStats.xp) };
      return { ...state, stats: newStats, practiceHistory: newHistory };
    }
    case 'ADD_QUIZ': {
      const newHistory = [...state.quizHistory, action.record];
      const bestScore = Math.max(state.stats.bestScore, action.record.score);
      let newStats = {
        ...state.stats,
        totalQuiz: state.stats.totalQuiz + 1,
        bestScore,
        dailyProgress: state.stats.dailyProgress + 1,
      };
      newStats = updateStreak(newStats);
      newStats = { ...newStats, level: getLevelFromXP(newStats.xp) };
      return { ...state, stats: newStats, quizHistory: newHistory };
    }
    case 'ADD_XP': {
      const newXP = state.stats.xp + action.amount;
      const newLevel = getLevelFromXP(newXP);
      return {
        ...state,
        stats: { ...state.stats, xp: newXP, level: newLevel }
      };
    }
    case 'UPDATE_STREAK': {
      return { ...state, stats: updateStreak(state.stats) };
    }
    case 'TOGGLE_DARK_MODE': {
      return { ...state, darkMode: !state.darkMode };
    }
    case 'IMPORT_DATA': {
      return action.data;
    }
    case 'RESET_DAILY_PROGRESS': {
      return { ...state, stats: { ...state.stats, dailyProgress: 0 } };
    }
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('hazerjavab_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if daily progress needs reset
      const today = new Date().toISOString().split('T')[0];
      const lastDate = parsed.stats?.lastPracticeDate;
      if (lastDate && lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastDate !== yesterday) {
          parsed.stats.streak = 0;
        }
        parsed.stats.dailyProgress = 0;
      }
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem('hazerjavab_state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toggleFavorite: (dialogId: number) => void;
  addPractice: (record: PracticeRecord, category: string) => void;
  addQuiz: (record: QuizRecord) => void;
  addXP: (amount: number) => void;
  toggleDarkMode: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [state.darkMode]);

  const toggleFavorite = (dialogId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', dialogId });
  };

  const addPractice = (record: PracticeRecord, category: string) => {
    dispatch({ type: 'ADD_PRACTICE', record, category });
    // Award XP based on score
    const xpGained = Math.round(record.score / 5);
    dispatch({ type: 'ADD_XP', amount: xpGained });
  };

  const addQuiz = (record: QuizRecord) => {
    dispatch({ type: 'ADD_QUIZ', record });
    const xpGained = record.score >= 80 ? 20 : record.score >= 50 ? 10 : 5;
    dispatch({ type: 'ADD_XP', amount: xpGained });
  };

  const addXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', amount });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const exportData = (): string => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      dispatch({ type: 'IMPORT_DATA', data });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{
      state,
      dispatch,
      toggleFavorite,
      addPractice,
      addQuiz,
      addXP,
      toggleDarkMode,
      exportData,
      importData,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}

// Practice evaluation engine (Rule-based for offline)
export interface ReplySuggestionEngine {
  suggestReplies(message: string, tone: string): Dialog[];
}

export function evaluateAnswer(userAnswer: string, situation: string, expectedTone: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 50; // Base score

  // Length check
  const len = userAnswer.trim().length;
  if (len < 3) {
    score -= 20;
    feedback.push('پاسخ خیلی کوتاه بود');
  } else if (len > 200) {
    score -= 10;
    feedback.push('پاسخ خیلی طولانی بود');
  } else if (len >= 10 && len <= 100) {
    score += 10;
    feedback.push('طول مناسب ✓');
  }

  // Contains question (engagement)
  if (userAnswer.includes('؟') || userAnswer.includes('?')) {
    score += 10;
    feedback.push('سؤال پرسیدی - عالی برای ادامه مکالمه ✓');
  }

  // Has emotion words
  const emotionWords = ['خوشحال', 'ناراحت', 'عصبانی', 'ممنون', 'مرسی', 'عزیز', 'دوست', 'لطف'];
  if (emotionWords.some(w => userAnswer.includes(w))) {
    score += 5;
    feedback.push('احساسات رو بیان کردی ✓');
  }

  // Not too aggressive
  const aggressiveWords = ['احمق', 'بیشعور', 'لعنتی', 'گمشو'];
  if (aggressiveWords.some(w => userAnswer.includes(w))) {
    score -= 15;
    feedback.push('لحن تهاجمی - بهتره مؤدبانه‌تر باشی');
  }

  // Has emoji (natural)
  if (/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/u.test(userAnswer)) {
    score += 5;
    feedback.push('استفاده از ایموجی - طبیعی ✓');
  }

  // Confidence words
  const confidenceWords = ['فکر می‌کنم', 'به نظرم', 'مطمئنم', 'اعتقاد دارم'];
  if (confidenceWords.some(w => userAnswer.includes(w))) {
    score += 8;
    feedback.push('اعتمادبه‌نفس در پاسخ ✓');
  }

  // Humor
  const humorIndicators = ['😂', '😄', 'هاها', 'lol', '😎', '😏'];
  if (humorIndicators.some(h => userAnswer.includes(h))) {
    score += 7;
    feedback.push('عنصر طنز ✓');
  }

  // Relevance to situation
  const situationWords = situation.split(' ').filter(w => w.length > 3);
  const relevantWords = situationWords.filter(w => userAnswer.includes(w));
  if (relevantWords.length > 0) {
    score += 10;
    feedback.push('مرتبط با موقعیت ✓');
  }

  // Creativity (unique words)
  const uniqueWords = new Set(userAnswer.split(' '));
  if (uniqueWords.size > userAnswer.split(' ').length * 0.7) {
    score += 5;
    feedback.push('تنوع کلمات ✓');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  if (feedback.length === 0) {
    feedback.push('پاسخ قابل قبولی بود');
  }

  return { score, feedback };
}
