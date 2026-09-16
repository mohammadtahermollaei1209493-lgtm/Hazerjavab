import { useState, useMemo } from 'react';
import { searchDialogs, allDialogs, Dialog, toneLabels, Tone } from '../data/dialogs';
import { useStore } from '../store/useStore';

export default function QuickReplyPage() {
  const { state, toggleFavorite } = useStore();
  const [query, setQuery] = useState('');
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);
  const [copied, setCopied] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchDialogs(query).slice(0, 20);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return allDialogs
      .filter(d => d.incomingMessage.toLowerCase().includes(query.toLowerCase()) ||
                   d.replyPrimary.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied('اشتراک');
      setTimeout(() => setCopied(''), 2000);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-cyan-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">💬 الان چی جواب بدم؟</h1>
        <p className="text-blue-200 text-sm">پیام طرف مقابل رو وارد کن</p>
        
        <div className="mt-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلاً: بالاخره یادت افتاد جواب بدی؟"
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-white/50 transition"
            dir="rtl"
          />
          <span className="absolute left-3 top-3 text-blue-200">🔍</span>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Selected Dialog Detail */}
        {selectedDialog && (
          <div className="animate-slide-up mb-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {selectedDialog.category}
                </span>
                <button onClick={() => setSelectedDialog(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{selectedDialog.situation}</div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 mb-4">
                <div className="text-xs text-slate-400 mb-1">پیام دریافتی:</div>
                <div className="font-medium">«{selectedDialog.incomingMessage}»</div>
              </div>

              <div className="space-y-3">
                <ReplyCard
                  label="پاسخ طبیعی"
                  text={selectedDialog.replyPrimary}
                  color="green"
                  onCopy={() => handleCopy(selectedDialog.replyPrimary, 'طبیعی')}
                  onShare={() => handleShare(selectedDialog.replyPrimary)}
                  copied={copied === 'طبیعی'}
                />
                <ReplyCard
                  label="پاسخ بامزه"
                  text={selectedDialog.replyAlt1}
                  color="blue"
                  onCopy={() => handleCopy(selectedDialog.replyAlt1, 'بامزه')}
                  onShare={() => handleShare(selectedDialog.replyAlt1)}
                  copied={copied === 'بامزه'}
                />
                <ReplyCard
                  label="پاسخ خونسرد"
                  text={selectedDialog.replyAlt2}
                  color="purple"
                  onCopy={() => handleCopy(selectedDialog.replyAlt2, 'خونسرد')}
                  onShare={() => handleShare(selectedDialog.replyAlt2)}
                  copied={copied === 'خونسرد'}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleFavorite(selectedDialog.id)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                    state.favorites.includes(selectedDialog.id)
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {state.favorites.includes(selectedDialog.id) ? '⭐ ذخیره شده' : '☆ ذخیره'}
                </button>
              </div>

              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">💡 نکته:</div>
                <div className="text-sm">{selectedDialog.explanation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && !selectedDialog && (
          <div className="space-y-3">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {results.length > 0 ? `${results.length} نتیجه پیدا شد` : 'نتیجه‌ای پیدا نشد'}
            </div>
            
            {results.map(dialog => (
              <button
                key={dialog.id}
                onClick={() => setSelectedDialog(dialog)}
                className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 text-right hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {dialog.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {toneLabels[dialog.tone as Tone]}
                  </span>
                </div>
                <div className="text-sm font-medium mb-1">«{dialog.incomingMessage}»</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {dialog.replyPrimary}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="font-bold text-lg mb-2">پیام رو وارد کن</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              متن پیامی که دریافت کردی رو بنویس تا بهترین پاسخ‌ها رو پیشنهاد بدیم
            </p>
            
            <div className="mt-6 space-y-2">
              <p className="text-xs text-slate-400">مثال‌های پرکاربرد:</p>
              {['بالاخره یادت افتاد جواب بدی؟', 'چرا دیر کردی؟', 'تو که همیشه همین‌طوری هستی'].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(example)}
                  className="block w-full text-right text-sm py-2 px-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  «{example}»
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions when typing */}
        {query && suggestions.length > 0 && !selectedDialog && results.length === 0 && (
          <div className="space-y-2">
            <div className="text-sm text-slate-500">پیشنهادات:</div>
            {suggestions.map(dialog => (
              <button
                key={dialog.id}
                onClick={() => setSelectedDialog(dialog)}
                className="w-full text-right text-sm py-2 px-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                «{dialog.incomingMessage}»
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyCard({ label, text, color, onCopy, onShare, copied }: {
  label: string;
  text: string;
  color: string;
  onCopy: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-400',
  };

  return (
    <div className={`rounded-xl p-3 border-r-3 ${colorClasses[color] || colorClasses.green}`} style={{ borderRightWidth: '3px' }}>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</div>
      <div className="text-sm mb-2">{text}</div>
      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="text-xs px-3 py-1 bg-white/70 dark:bg-slate-600/50 rounded-lg hover:bg-white dark:hover:bg-slate-500 transition"
        >
          {copied ? '✓ کپی شد' : '📋 کپی'}
        </button>
        <button
          onClick={onShare}
          className="text-xs px-3 py-1 bg-white/70 dark:bg-slate-600/50 rounded-lg hover:bg-white dark:hover:bg-slate-500 transition"
        >
          📤 اشتراک
        </button>
      </div>
    </div>
  );
}
