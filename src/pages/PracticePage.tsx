import { useState } from 'react';
import { getRandomDialog, Dialog, categories, difficultyLabels, Difficulty } from '../data/dialogs';
import { useStore, evaluateAnswer } from '../store/useStore';

export default function PracticePage() {
  const { addPractice } = useStore();
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const startPractice = () => {
    let dialog: Dialog;
    if (selectedCategory) {
      const catDialogs = getRandomDialog(selectedDifficulty);
      dialog = catDialogs;
    } else {
      dialog = getRandomDialog(selectedDifficulty);
    }
    setCurrentDialog(dialog);
    setUserAnswer('');
    setShowResult(false);
    setResult(null);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim() || !currentDialog) return;
    
    const evaluation = evaluateAnswer(userAnswer, currentDialog.situation, currentDialog.tone);
    setResult(evaluation);
    setShowResult(true);
    
    addPractice({
      dialogId: currentDialog.id,
      userAnswer,
      score: evaluation.score,
      date: new Date().toISOString(),
    }, currentDialog.category);
  };

  const nextPractice = () => {
    startPractice();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-l from-green-600 to-emerald-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">🎯 تمرین مکالمه</h1>
        <p className="text-green-200 text-sm">سناریو بخون و جواب بده</p>
      </div>

      <div className="px-5 py-5">
        {!currentDialog ? (
          /* Setup Screen */
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-sm mb-3">سطح دشواری</h3>
              <div className="grid grid-cols-4 gap-2">
                {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? undefined : diff)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition ${
                      selectedDifficulty === diff
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-sm mb-3">دسته‌بندی (اختیاری)</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-3 text-sm outline-none"
                dir="rtl"
              >
                <option value="">همه دسته‌ها</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={startPractice}
              className="w-full bg-gradient-to-l from-green-600 to-emerald-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
            >
              🚀 شروع تمرین
            </button>
          </div>
        ) : (
          /* Practice Screen */
          <div className="space-y-4">
            {/* Scenario */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {currentDialog.category}
                </span>
                <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                  {difficultyLabels[currentDialog.difficulty]}
                </span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 mb-3">
                <div className="text-xs text-slate-400 mb-1">📋 سناریو:</div>
                <div className="text-sm font-medium">{currentDialog.situation}</div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <div className="text-xs text-blue-400 mb-1">💬 پیام دریافتی:</div>
                <div className="font-medium">«{currentDialog.incomingMessage}»</div>
              </div>
            </div>

            {/* User Input */}
            {!showResult ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-sm mb-3">✍️ پاسخ تو:</h3>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="اینجا جوابت رو بنویس..."
                  className="w-full bg-slate-50 dark:bg-slate-700 rounded-xl px-4 py-3 text-sm outline-none resize-none h-24 focus:ring-2 focus:ring-green-500 transition"
                  dir="rtl"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-400">{userAnswer.length} کاراکتر</span>
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
                  >
                    ثبت پاسخ ✓
                  </button>
                </div>
              </div>
            ) : (
              /* Result */
              result && (
                <div className="animate-slide-up space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold mb-2 ${
                        result.score >= 80 ? 'text-green-600' :
                        result.score >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {result.score}
                      </div>
                      <div className="text-sm text-slate-500">امتیاز از ۱۰۰</div>
                      <div className="mt-2 text-sm font-medium">
                        {result.score >= 80 ? '🌟 عالی!' :
                         result.score >= 60 ? '👍 خوب!' :
                         result.score >= 40 ? '💪 قابل بهبود' :
                         '🔄 تمرین بیشتر'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-500 mb-2">بازخورد:</div>
                      {result.feedback.map((fb, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span>{fb.includes('✓') ? '✅' : '⚠️'}</span>
                          <span>{fb.replace(' ✓', '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Answers */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-sm mb-3">💡 پاسخ‌های پیشنهادی:</h4>
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-sm border-r-2 border-green-400">
                        {currentDialog.replyPrimary}
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-sm border-r-2 border-blue-400">
                        {currentDialog.replyAlt1}
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-sm border-r-2 border-purple-400">
                        {currentDialog.replyAlt2}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={nextPractice}
                    className="w-full bg-gradient-to-l from-green-600 to-emerald-600 text-white rounded-2xl py-3 font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    🔄 تمرین بعدی
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
