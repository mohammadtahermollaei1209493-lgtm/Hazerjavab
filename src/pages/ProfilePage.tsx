import { useStore, LEVEL_NAMES, getXPForNextLevel } from '../store/useStore';
import { useRef } from 'react';

export default function ProfilePage() {
  const { state, toggleDarkMode, exportData, importData } = useStore();
  const { stats } = state;
  const xpInfo = getXPForNextLevel(stats.xp);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hazerjavab_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const success = importData(json);
      if (success) {
        alert('اطلاعات با موفقیت بازیابی شد!');
      } else {
        alert('فایل نامعتبر است');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-l from-amber-500 to-orange-500 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-4">👤 پروفایل</h1>
        
        {/* Level Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              🏆
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold">{LEVEL_NAMES[stats.level]}</div>
              <div className="text-sm text-amber-100">سطح {stats.level}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-amber-200 mb-1">
                  <span>{stats.xp} XP</span>
                  <span>سطح بعدی</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${xpInfo.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Stats Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3">📊 آمار کلی</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatItem icon="🎯" label="تمرین‌ها" value={stats.totalPractice} />
            <StatItem icon="🧠" label="آزمون‌ها" value={stats.totalQuiz} />
            <StatItem icon="⭐" label="علاقه‌مندی" value={state.favorites.length} />
            <StatItem icon="🔥" label="استریک" value={`${stats.streak} روز`} />
            <StatItem icon="📈" label="میانگین" value={`${stats.averageScore}%`} />
            <StatItem icon="🏅" label="بهترین" value={`${stats.bestScore}%`} />
            <StatItem icon="💎" label="XP کل" value={stats.xp} />
            <StatItem icon="📂" label="دسته‌ها" value={stats.categoriesPracticed.length} />
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3">🎯 هدف روزانه</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{stats.dailyProgress} از {stats.dailyGoal}</span>
                <span className="text-green-600">{Math.round((stats.dailyProgress / stats.dailyGoal) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-green-400 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.dailyProgress / stats.dailyGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-2xl">
              {stats.dailyProgress >= stats.dailyGoal ? '✅' : '⏳'}
            </div>
          </div>
        </div>

        {/* Categories Practiced */}
        {stats.categoriesPracticed.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm mb-3">📂 دسته‌های تمرین‌شده</h3>
            <div className="flex flex-wrap gap-2">
              {stats.categoriesPracticed.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3">⚙️ تنظیمات</h3>
          <div className="space-y-3">
            <button
              onClick={toggleDarkMode}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="text-sm">حالت تاریک</span>
              <div className={`w-10 h-6 rounded-full transition-colors ${state.darkMode ? 'bg-indigo-600' : 'bg-slate-300'} relative`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${state.darkMode ? 'left-1' : 'left-5'}`} />
              </div>
            </button>
            
            <hr className="border-slate-100 dark:border-slate-700" />
            
            <button
              onClick={handleExport}
              className="w-full flex justify-between items-center py-2 text-sm"
            >
              <span>📥 پشتیبان‌گیری (Export)</span>
              <span className="text-slate-400">←</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex justify-between items-center py-2 text-sm"
            >
              <span>📤 بازیابی (Import)</span>
              <span className="text-slate-400">←</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* About */}
        <div className="text-center py-4 text-xs text-slate-400">
          <p>حاضر جواب | HAZER JAVAB</p>
          <p className="mt-1">نسخه ۱.۰.۰ — آفلاین</p>
          <p className="mt-1">۶۰۰۰+ دیالوگ فارسی</p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
      <div className="text-lg">{icon}</div>
      <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}
