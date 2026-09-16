import { useState, useCallback } from 'react';
import { allDialogs, Dialog, difficultyLabels, Difficulty } from '../data/dialogs';
import { useStore } from '../store/useStore';

interface QuizQuestion {
  dialog: Dialog;
  options: string[];
  correctIndex: number;
}

function generateQuiz(difficulty?: Difficulty): QuizQuestion {
  const filtered = difficulty
    ? allDialogs.filter(d => d.difficulty === difficulty)
    : allDialogs;
  
  const dialog = filtered[Math.floor(Math.random() * filtered.length)];
  const allReplies = [dialog.replyPrimary, dialog.replyAlt1, dialog.replyAlt2];
  
  // Get wrong answers from other dialogs
  const wrongAnswers: string[] = [];
  while (wrongAnswers.length < 3) {
    const randomDialog = allDialogs[Math.floor(Math.random() * allDialogs.length)];
    const randomReply = [randomDialog.replyPrimary, randomDialog.replyAlt1, randomDialog.replyAlt2][Math.floor(Math.random() * 3)];
    if (!allReplies.includes(randomReply) && !wrongAnswers.includes(randomReply)) {
      wrongAnswers.push(randomReply);
    }
  }
  
  const correctIndex = Math.floor(Math.random() * 4);
  const options = [...allReplies, ...wrongAnswers.slice(0, 3)];
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  const actualCorrectIndex = options.indexOf(dialog.replyPrimary);
  
  return { dialog, options, correctIndex: actualCorrectIndex };
}

export default function QuizPage() {
  const { addQuiz, addXP } = useStore();
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>(undefined);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = useCallback(() => {
    setQuiz(generateQuiz(selectedDifficulty));
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(true);
  }, [selectedDifficulty]);

  const submitAnswer = (index: number) => {
    if (showResult || !quiz) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === quiz.correctIndex;
    const questionScore = isCorrect ? 100 : Math.max(0, 30);
    setScore(prev => prev + questionScore);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) setCorrectAnswers(prev => prev + 1);
    
    addQuiz({
      dialogId: quiz.dialog.id,
      selectedAnswer: index,
      correctAnswer: quiz.correctIndex,
      score: questionScore,
      date: new Date().toISOString(),
    });
    
    if (isCorrect) addXP(15);
    else addXP(5);
  };

  const nextQuestion = () => {
    setQuiz(generateQuiz(selectedDifficulty));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!quizStarted) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-l from-pink-600 to-rose-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
          <h1 className="text-xl font-bold mb-1">🧠 آزمون سریع</h1>
          <p className="text-pink-200 text-sm">پاسخ درست رو انتخاب کن</p>
        </div>
        <div className="px-5 py-5 space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm mb-3">سطح دشواری</h3>
            <div className="grid grid-cols-2 gap-2">
              {([undefined, 'easy', 'medium', 'hard', 'expert'] as (Difficulty | undefined)[]).map(diff => (
                <button
                  key={diff || 'all'}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition ${
                    selectedDifficulty === diff
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {diff ? difficultyLabels[diff] : 'همه'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm mb-2">📋 قوانین</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• یه سناریو نمایش داده میشه</li>
              <li>• ۴ گزینه داری</li>
              <li>• بهترین پاسخ رو انتخاب کن</li>
              <li>• هر جواب درست = ۱۵ XP</li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-l from-pink-600 to-rose-600 text-white rounded-2xl py-4 font-bold text-lg shadow-md hover:shadow-lg transition-all"
          >
            🚀 شروع آزمون
          </button>
        </div>
      </div>
    );
  }

  const avgScore = totalQuestions > 0 ? Math.round(score / totalQuestions) : 0;

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-l from-pink-600 to-rose-600 text-white px-5 pt-8 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold">🧠 آزمون</h1>
          <div className="flex gap-3 text-sm">
            <span>✅ {correctAnswers}</span>
            <span>📝 {totalQuestions}</span>
            <span>📊 {avgScore}%</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {quiz && (
          <>
            {/* Question */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {quiz.dialog.category}
                </span>
                <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                  {difficultyLabels[quiz.dialog.difficulty]}
                </span>
              </div>
              <div className="text-sm text-slate-500 mb-2">{quiz.dialog.situation}</div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <div className="text-xs text-blue-400 mb-1">💬 پیام:</div>
                <div className="font-medium">«{quiz.dialog.incomingMessage}»</div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-500">بهترین پاسخ کدومه؟</div>
              {quiz.options.map((option, index) => {
                let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                if (showResult) {
                  if (index === quiz.correctIndex) {
                    optionClass = 'bg-green-50 dark:bg-green-900/20 border-green-400';
                  } else if (index === selectedAnswer && index !== quiz.correctIndex) {
                    optionClass = 'bg-red-50 dark:bg-red-900/20 border-red-400';
                  }
                } else if (index === selectedAnswer) {
                  optionClass = 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400';
                }

                return (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    disabled={showResult}
                    className={`w-full text-right p-3 rounded-xl border-2 text-sm transition-all ${optionClass} ${
                      !showResult ? 'hover:shadow-md hover:scale-[1.01]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {showResult && index === quiz.correctIndex ? '✅' :
                         showResult && index === selectedAnswer && index !== quiz.correctIndex ? '❌' :
                         String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {showResult && (
              <div className="animate-slide-up">
                <div className={`rounded-2xl p-4 ${
                  selectedAnswer === quiz.correctIndex
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="font-bold text-sm mb-2">
                    {selectedAnswer === quiz.correctIndex ? '🎉 آفرین! درسته!' : '❌ اشتباه بود!'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {quiz.dialog.explanation}
                  </div>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full mt-4 bg-gradient-to-l from-pink-600 to-rose-600 text-white rounded-2xl py-3 font-bold shadow-md"
                >
                  سؤال بعدی ←
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
