import { useState } from 'react';
import { categories, getDialogsByCategory, Dialog, toneLabels, Tone } from '../data/dialogs';
import { useStore } from '../store/useStore';

export default function CategoriesPage() {
  const { state, toggleFavorite } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);

  const categoryIcons: Record<string, string> = {
    'شروع مکالمه': '👋',
    'ادامه مکالمه': '💬',
    'جواب سریع': '⚡',
    'شوخی': '😄',
    'طنز': '🤣',
    'کنایه': '😏',
    'پاسخ به تعریف': '😊',
    'پاسخ به انتقاد': '🛡️',
    'پاسخ به متلک': '💪',
    'مکالمه سرد': '🧊',
    'مکالمه خشک': '🏜️',
    'چت اینستاگرام': '📸',
    'چت واتساپ': '📱',
    'آشنایی جدید': '🤝',
    'قرار اول': '❤️',
    'گفت‌وگوی دوستانه': '👫',
    'محیط کار': '💼',
    'جمع دوستانه': '🎉',
    'نه گفتن': '🚫',
    'مرزبندی': '🔒',
    'اعتمادبه‌نفس': '💎',
    'زبان بدن': '🧍',
    'فن بیان': '🎤',
    'موقعیت‌های awkward': '😅',
    'سؤال‌های سخت': '🤔',
    'بحث و اختلاف': '⚔️',
    'مکالمه رسمی': '👔',
    'مکالمه غیررسمی': '😎',
    'موقعیت‌های روزمره': '🏠',
    'سناریوهای غیرمنتظره': '🎭',
  };

  if (selectedDialog) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-l from-violet-600 to-purple-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
          <button onClick={() => setSelectedDialog(null)} className="text-white/80 mb-2 text-sm">→ بازگشت</button>
          <h1 className="text-xl font-bold">{selectedDialog.category}</h1>
        </div>
        <div className="px-5 py-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
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
                {state.favorites.includes(selectedDialog.id) ? '⭐' : '☆'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const dialogs = getDialogsByCategory(selectedCategory);
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-l from-violet-600 to-purple-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
          <button onClick={() => setSelectedCategory(null)} className="text-white/80 mb-2 text-sm">→ بازگشت</button>
          <h1 className="text-xl font-bold">{categoryIcons[selectedCategory] || '📂'} {selectedCategory}</h1>
          <p className="text-violet-200 text-sm mt-1">{dialogs.length} دیالوگ</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {dialogs.slice(0, 50).map(dialog => (
            <button
              key={dialog.id}
              onClick={() => setSelectedDialog(dialog)}
              className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500">
                  {dialog.subcategory}
                </span>
                <span className="text-[10px] text-slate-400">
                  {toneLabels[dialog.tone as Tone]}
                </span>
              </div>
              <div className="text-sm font-medium">«{dialog.incomingMessage}»</div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">{dialog.replyPrimary}</div>
            </button>
          ))}
          {dialogs.length > 50 && (
            <div className="text-center text-sm text-slate-400 py-4">
              و {dialogs.length - 50} دیالوگ دیگر...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-l from-violet-600 to-purple-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">📂 دسته‌بندی‌ها</h1>
        <p className="text-violet-200 text-sm">۳۰ دسته‌بندی مختلف</p>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <div className="text-2xl mb-1">{categoryIcons[cat] || '📂'}</div>
              <div className="font-medium text-xs">{cat}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {getDialogsByCategory(cat).length} مورد
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
