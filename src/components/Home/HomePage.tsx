import { useEffect, useState } from 'react';
import { useVocabulary } from '../../hooks/useVocabulary';
import { loadFromStorage } from '../../utils/storage';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { availableWeeks, totalWords } = useVocabulary();
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [studiedToday, setStudiedToday] = useState(0);

  useEffect(() => {
    const wrongAnswers = loadFromStorage('wrong_answers', []);
    setWrongAnswersCount(wrongAnswers.length);
    
    // 오늘 학습한 단어 수 계산
    let todayCount = 0;
    availableWeeks.forEach(week => {
      todayCount += loadFromStorage(`studied_today_week${week}`, 0);
    });
    setStudiedToday(todayCount);
  }, [availableWeeks]);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="emoji">🇯🇵</span>
          JapanGo
        </h1>
        <p className="hero-subtitle"></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-number">{availableWeeks.length}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{totalWords}</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{studiedToday}</div>
        </div>
        {wrongAnswersCount > 0 && (
          <div className="stat-card error">
            <div className="stat-number">{wrongAnswersCount}</div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate('weeks')}
        >
          <span className="btn-icon">🚀</span>
          학습
        </button>
        {availableWeeks.length > 1 && (
          <button 
            className="btn btn-warning btn-lg"
            onClick={() => onNavigate('test-all')}
          >
            <span className="btn-icon">🌐</span>
            테스트
          </button>
        )}
        {wrongAnswersCount > 0 && (
          <button 
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('wrong-answers')}
          >
            <span className="btn-icon">🔄</span>
            복습
          </button>
        )}
        <button 
          className="btn btn-secondary btn-lg"
          onClick={() => onNavigate('stats')}
        >
          <span className="btn-icon">📊</span>
          통계
        </button>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔊</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🃏</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
          </div>
        </div>
      </div>

      <div className="week-preview">
        <h2 className="section-title"></h2>
        <div className="week-preview-grid">
          {availableWeeks.slice(0, 4).map(week => (
            <div 
              key={week} 
              className="week-preview-card"
              onClick={() => onNavigate(`study-week-${week}`)}
            >
              <div className="week-icon">📖</div>
              <h3>{week}</h3>
            </div>
          ))}
        </div>
        {availableWeeks.length > 4 && (
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('weeks')}
          >
            더보기
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
