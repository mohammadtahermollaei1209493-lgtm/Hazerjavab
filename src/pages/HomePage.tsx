import { useStore, LEVEL_NAMES, getXPForNextLevel } from '../store/useStore';
import { getRandomDialog, Dialog } from '../data/dialogs';
import { useState } from 'react';

type Page = 'home' | 'quickReply' | 'practice' | 'categories' | 'profile' | 'favorites' | 'quiz' | 'search';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: Props) {
  const { state, toggleDarkMode, toggleFavorite } = useStore();
  const [randomDialog, setRandomDialog] = useState<Dialog | null>(null);
  const { stats } = state;
  const xpInfo = getXPForNextLevel(stats.xp);

  const handleRandom = () => {
    setRandomDialog(getRandomDialog());
  };

  const today = new Date().toLocaleDateString('fa-IR');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">حاضر جواب</h1>
            <p className="text-indigo-200 text-sm mt-1">تمرین مکالمه و پاسخ سریع</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('search')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            >
              🔍
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            >
              {state.darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3">
          <div className="text-center">
            <div className="text-lg font-bold">{stats.level}</div>
            <div className="text-[10px] text-indigo-200">سطح</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-indigo-200 mb-1">
              <span>{LEVEL_NAMES[stats.level]}</span>
              <span>{stats.xp} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${xpInfo.percentage}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">🔥 {stats.streak}</div>
            <div className="text-[10px] text-indigo-200">روز</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-4">
        {/* Date */}
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
          {today}
        </div>

        {/* Daily Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">هدف روزانه</span>
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">
              {stats.dailyProgress}/{stats.dailyGoal}
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-green-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.dailyProgress / stats.dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('quickReply')}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-bold text-sm">الان چی جواب بدم؟</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">پاسخ سریع به پیام</div>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold text-sm">تمرین امروز</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">سناریو و ارزیابی</div>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="text-2xl mb-2">🧠</div>
            <div className="font-bold text-sm">آزمون سریع</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">چهار گزینه‌ای</div>
          </button>

          <button
            onClick={() => onNavigate('favorites')}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="text-2xl mb-2">⭐</div>
            <div className="font-bold text-sm">علاقه‌مندی‌ها</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{state.favorites.length} دیالوگ</div>
          </button>
        </div>

        {/* Random Dialog */}
        <button
          onClick={handleRandom}
          className="w-full bg-gradient-to-l from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🎲</span>
            <div className="text-right">
              <div className="font-bold">یه موقعیت تصادفی بده!</div>
              <div className="text-xs text-amber-100 mt-1">هر بار یه سناریوی جدید</div>
            </div>
          </div>
        </button>

        {/* Random Dialog Display */}
        {randomDialog && (
          <div className="animate-slide-up bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                {randomDialog.category}
              </span>
              <button
                onClick={() => setRandomDialog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              {randomDialog.situation}
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 mb-3">
              <div className="text-xs text-slate-400 mb-1">پیام دریافتی:</div>
              <div className="font-medium">«{randomDialog.incomingMessage}»</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">پاسخ‌های پیشنهادی:</div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-sm border-r-2 border-green-400">
                {randomDialog.replyPrimary}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-sm border-r-2 border-blue-400">
                {randomDialog.replyAlt1}
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-sm border-r-2 border-purple-400">
                {randomDialog.replyAlt2}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigator.clipboard.writeText(randomDialog.replyPrimary)}
                className="flex-1 text-xs py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                📋 کپی
              </button>
              <button
                onClick={() => {
                  toggleFavorite(randomDialog.id);
                }}
                className={`flex-1 text-xs py-2 rounded-lg transition ${
                  state.favorites.includes(randomDialog.id)
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {state.favorites.includes(randomDialog.id) ? '⭐ ذخیره شده' : '☆ ذخیره'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3">📊 آمار کوتاه</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{stats.totalPractice}</div>
              <div className="text-[10px] text-slate-500">تمرین</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.totalQuiz}</div>
              <div className="text-[10px] text-slate-500">آزمون</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.averageScore}%</div>
              <div className="text-[10px] text-slate-500">میانگین</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
