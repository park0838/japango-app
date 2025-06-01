import { useState, useEffect } from 'react';
import { HomePage } from './components/Home/HomePage';
import { WeekSelectionPage } from './components/WeekSelection/WeekSelectionPage';
import { StudyMode } from './components/StudyMode/StudyMode';
import { TestMode } from './components/TestMode/TestMode';
import { WrongAnswersPage } from './components/WrongAnswers/WrongAnswersPage';
import { StatsPage } from './components/Stats/StatsPage';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import './App.css';

export type PageType = 
  | 'home' 
  | 'weeks' 
  | 'wrong-answers' 
  | 'stats'
  | 'test-all'
  | `study-week-${number}`
  | `test-week-${number}`;

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 테마 초기화
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      setIsDarkMode(false);
    } else {
      // 시스템 테마 확인
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
        setIsDarkMode(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    // 주차별 학습 모드
    if (currentPage.startsWith('study-week-')) {
      const week = parseInt(currentPage.replace('study-week-', ''));
      return <StudyMode week={week} onNavigate={handleNavigate} />;
    }
    
    // 주차별 테스트 모드
    if (currentPage.startsWith('test-week-')) {
      const week = parseInt(currentPage.replace('test-week-', ''));
      return <TestMode week={week} onNavigate={handleNavigate} />;
    }
    
    // 일반 페이지
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'weeks':
        return <WeekSelectionPage onNavigate={handleNavigate} />;
      case 'wrong-answers':
        return <WrongAnswersPage onNavigate={handleNavigate} />;
      case 'stats':
        return <StatsPage onNavigate={handleNavigate} />;
      case 'test-all':
        return <TestMode week={0} onNavigate={handleNavigate} />; // week=0은 "종합 테스트"를 의미
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app force-horizontal">
      <Header 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      
      <main className="app-content">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
