import { useState } from 'react';
import { StoreProvider } from './store/useStore';
import HomePage from './pages/HomePage';
import QuickReplyPage from './pages/QuickReplyPage';
import PracticePage from './pages/PracticePage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import QuizPage from './pages/QuizPage';
import SearchPage from './pages/SearchPage';

type Page = 'home' | 'quickReply' | 'practice' | 'categories' | 'profile' | 'favorites' | 'quiz' | 'search';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'quickReply': return <QuickReplyPage />;
      case 'practice': return <PracticePage />;
      case 'categories': return <CategoriesPage />;
      case 'profile': return <ProfilePage />;
      case 'favorites': return <FavoritesPage />;
      case 'quiz': return <QuizPage />;
      case 'search': return <SearchPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="max-w-lg mx-auto pb-20">
          {renderPage()}
        </div>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg z-50">
          <div className="max-w-lg mx-auto flex justify-around items-center h-16">
            <NavButton 
              icon="🏠" 
              label="خانه" 
              active={currentPage === 'home'} 
              onClick={() => setCurrentPage('home')} 
            />
            <NavButton 
              icon="💬" 
              label="پاسخ سریع" 
              active={currentPage === 'quickReply'} 
              onClick={() => setCurrentPage('quickReply')} 
            />
            <NavButton 
              icon="🎯" 
              label="تمرین" 
              active={currentPage === 'practice'} 
              onClick={() => setCurrentPage('practice')} 
            />
            <NavButton 
              icon="📂" 
              label="دسته‌ها" 
              active={currentPage === 'categories'} 
              onClick={() => setCurrentPage('categories')} 
            />
            <NavButton 
              icon="👤" 
              label="پروفایل" 
              active={currentPage === 'profile'} 
              onClick={() => setCurrentPage('profile')} 
            />
          </div>
        </nav>
      </div>
    </StoreProvider>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
        active 
          ? 'text-indigo-600 dark:text-indigo-400 scale-105' 
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default App;
