import { useState, useMemo, useEffect } from 'react';
import { searchDialogs, Dialog, toneLabels, Tone, categories } from '../data/dialogs';
import { useStore } from '../store/useStore';

export default function SearchPage() {
  const { state, toggleFavorite } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Dialog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        let res = searchDialogs(query);
        if (selectedCategory) {
          res = res.filter(d => d.category === selectedCategory);
        }
        setResults(res.slice(0, 50));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedCategory]);

  if (selectedDialog) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-l from-teal-600 to-cyan-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
          <button onClick={() => setSelectedDialog(null)} className="text-white/80 mb-2 text-sm">→ بازگشت به نتایج</button>
          <h1 className="text-xl font-bold">نتیجه جستجو</h1>
        </div>
        <div className="px-5 py-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                {selectedDialog.category}
              </span>
              <span className="text-xs text-slate-400">{toneLabels[selectedDialog.tone as Tone]}</span>
            </div>
            <div className="text-sm text-slate-500 mb-2">{selectedDialog.situation}</div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 mb-4">
              <div className="text-xs text-slate-400 mb-1">پیام:</div>
              <div className="font-medium">«{selectedDialog.incomingMessage}»</div>
            </div>
            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-sm border-r-2 border-green-400">
                <div className="text-xs text-green-600 mb-1">طبیعی:</div>
                {selectedDialog.replyPrimary}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm border-r-2 border-blue-400">
                <div className="text-xs text-blue-600 mb-1">بامزه:</div>
                {selectedDialog.replyAlt1}
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-sm border-r-2 border-purple-400">
                <div className="text-xs text-purple-600 mb-1">خونسرد:</div>
                {selectedDialog.replyAlt2}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(selectedDialog.replyPrimary)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm"
              >📋 کپی</button>
              <button
                onClick={() => toggleFavorite(selectedDialog.id)}
                className={`flex-1 py-2 rounded-xl text-sm ${
                  state.favorites.includes(selectedDialog.id)
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-700'
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}
              >
                {state.favorites.includes(selectedDialog.id) ? '⭐ ذخیره شده' : '☆ ذخیره'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-l from-teal-600 to-cyan-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">🔍 جستجو</h1>
        <p className="text-teal-200 text-sm">در ۶۰۰۰+ دیالوگ جستجو کن</p>
        
        <div className="mt-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در پیام‌ها، پاسخ‌ها، دسته‌ها..."
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-teal-200 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-white/50"
            dir="rtl"
            autoFocus
          />
          <span className="absolute left-3 top-3">🔍</span>
        </div>

        {/* Category Filter */}
        <div className="mt-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm text-white rounded-xl px-4 py-2 text-sm outline-none"
            dir="rtl"
          >
            <option value="" className="text-slate-800">همه دسته‌ها</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="text-slate-800">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-5 py-4">
        {query && results.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500 dark:text-slate-400">نتیجه‌ای پیدا نشد</p>
            <p className="text-xs text-slate-400 mt-2">کلمات دیگه‌ای امتحان کن</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {results.length} نتیجه یافت شد
            </div>
            <div className="space-y-3">
              {results.map(dialog => (
                <button
                  key={dialog.id}
                  onClick={() => setSelectedDialog(dialog)}
                  className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                      {dialog.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{toneLabels[dialog.tone as Tone]}</span>
                      {state.favorites.includes(dialog.id) && <span className="text-amber-500 text-xs">⭐</span>}
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-1">«{dialog.incomingMessage}»</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{dialog.replyPrimary}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {!query && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-lg mb-2">جستجو در دیالوگ‌ها</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              کلمه یا عبارت مورد نظرت رو بنویس
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-slate-400">جستجو روی:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['پیام‌ها', 'پاسخ‌ها', 'دسته‌بندی', 'تگ‌ها', 'موقعیت'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
