import { PageType } from '../../App';
import './Header.css';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onNavigate, 
  isDarkMode, 
  onToggleTheme 
}) => {
  const getPageName = (page: PageType): string => {
    if (page === 'home') return 'home';
    if (page === 'weeks') return 'weeks';
    if (page === 'wrong-answers') return 'wrong';
    if (page === 'stats') return 'stats';
    return '';
  };

  const isActive = (page: string): boolean => {
    const pageName = getPageName(currentPage);
    return pageName === page;
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <span className="logo-emoji">🇯🇵</span>
          <span className="logo-text">JapanGo</span>
        </a>
        
        <nav className="main-nav">
          <a 
            href="#"
            className={`nav-link ${isActive('home') ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            홈
          </a>
          <a 
            href="#"
            className={`nav-link ${isActive('weeks') ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('weeks');
            }}
          >
            주차별 학습
          </a>
          <a 
            href="#"
            className={`nav-link ${isActive('wrong') ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('wrong-answers');
            }}
          >
            틀린 문제
          </a>
          <a 
            href="#"
            className={`nav-link ${isActive('stats') ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('stats');
            }}
          >
            통계
          </a>
          
          <button 
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </nav>
        
        {/* 모바일 메뉴 버튼 */}
        <button className="mobile-menu-toggle" aria-label="메뉴">
          <span className="menu-icon"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
