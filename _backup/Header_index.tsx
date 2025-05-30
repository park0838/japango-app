import { Link, useLocation } from 'react-router-dom';
import './styles.css';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <Link to="/">JapanGo - 일본어 단어 학습</Link>
        </h1>
        
        <nav className="header-nav">
          <ul>
            <li>
              <Link 
                to="/study" 
                className={`nav-link ${location.pathname === '/study' ? 'active' : ''}`}
              >
                암기 모드
              </Link>
            </li>
            <li>
              <Link 
                to="/test" 
                className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
              >
                테스트 모드
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;