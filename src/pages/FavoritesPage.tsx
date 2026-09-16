import { useState, useMemo } from 'react';
import { allDialogs, Dialog, toneLabels, Tone } from '../data/dialogs';
import { useStore } from '../store/useStore';

export default function FavoritesPage() {
  const { state, toggleFavorite } = useStore();
  const [search, setSearch] = useState('');
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);

  const favoriteDialogs = useMemo(() => {
    let dialogs = allDialogs.filter(d => state.favorites.includes(d.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      dialogs = dialogs.filter(d =>
        d.incomingMessage.toLowerCase().includes(q) ||
        d.replyPrimary.toLowerCase().includes(q) ||
        d.category.includes(q)
      );
    }
    return dialogs;
  }, [state.favorites, search]);

  if (selectedDialog) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-l from-amber-500 to-yellow-500 text-white px-5 pt-8 pb-6 rounded-b-3xl">
          <button onClick={() => setSelectedDialog(null)} className="text-white/80 mb-2 text-sm">→ بازگشت</button>
          <h1 className="text-xl font-bold">⭐ دیالوگ ذخیره‌شده</h1>
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
                className="flex-1 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-xl text-sm"
              >🗑️ حذف</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-l from-amber-500 to-yellow-500 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">⭐ علاقه‌مندی‌ها</h1>
        <p className="text-amber-100 text-sm">{favoriteDialogs.length} دیالوگ ذخیره‌شده</p>
        
        {state.favorites.length > 0 && (
          <div className="mt-4 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در علاقه‌مندی‌ها..."
              className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-amber-200 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-white/50"
              dir="rtl"
            />
            <span className="absolute left-3 top-3">🔍</span>
          </div>
        )}
      </div>

      <div className="px-5 py-4">
        {favoriteDialogs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-bold text-lg mb-2">هنوز دیالوگی ذخیره نکردی</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              دیالوگ‌هایی که دوست داری رو با ستاره ذخیره کن
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteDialogs.map(dialog => (
              <button
                key={dialog.id}
                onClick={() => setSelectedDialog(dialog)}
                className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                    {dialog.category}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(dialog.id); }}
                    className="text-amber-500 text-lg"
                  >
                    ⭐
                  </button>
                </div>
                <div className="text-sm font-medium">«{dialog.incomingMessage}»</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">{dialog.replyPrimary}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
