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
    <div className="home-page fade-in-up force-horizontal">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="emoji">🇯🇵</span>
          JapanGo
        </h1>
        <p className="hero-subtitle">체계적인 일본어 단어 학습 플랫폼</p>
      </div>

      <div className="stats-grid stagger-fade-in">
        <div className="stat-card primary">
          <div className="stat-number">{availableWeeks.length}</div>
          <div className="stat-label">학습 가능한 주차</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{totalWords}</div>
          <div className="stat-label">총 단어 수</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{studiedToday}</div>
          <div className="stat-label">오늘 학습한 단어</div>
        </div>
        {wrongAnswersCount > 0 && (
          <div className="stat-card error">
            <div className="stat-number">{wrongAnswersCount}</div>
            <div className="stat-label">틀린 문제</div>
          </div>
        )}
      </div>

      <div className="action-buttons fade-in-up animate-delay-2">
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate('weeks')}
        >
          <span className="btn-icon">🚀</span>
          주차별 학습 시작
        </button>
        {availableWeeks.length > 1 && (
          <button 
            className="btn btn-warning btn-lg"
            onClick={() => onNavigate('test-all')}
          >
            <span className="btn-icon">🌐</span>
            종합 테스트
          </button>
        )}
        {wrongAnswersCount > 0 && (
          <button 
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('wrong-answers')}
          >
            <span className="btn-icon">🔄</span>
            틀린 문제 복습
          </button>
        )}
        <button 
          className="btn btn-secondary btn-lg"
          onClick={() => onNavigate('stats')}
        >
          <span className="btn-icon">📊</span>
          내 통계 보기
        </button>
      </div>

      <div className="features-section fade-in-up animate-delay-3">
        <h2 className="section-title">학습 기능</h2>
        <div className="features-grid stagger-children">
          <div className="feature-card">
            <div className="feature-icon">🔊</div>
            <h3>음성 재생</h3>
            <p>일본어 단어의 정확한 발음을 들어보세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🃏</div>
            <h3>카드 학습</h3>
            <p>뒤집기, 힌트 보기 등 다양한 학습 모드</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>다양한 테스트</h3>
            <p>한자→뜻, 뜻→한자, 읽기→뜻 등 다양한 문제 유형</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>학습 통계</h3>
            <p>진행률과 성과를 한눈에 확인하세요</p>
          </div>
        </div>
      </div>

      <div className="week-preview fade-in-up animate-delay-4">
        <h2 className="section-title">학습 가능한 주차</h2>
        <div className="week-preview-grid stagger-children">
          {availableWeeks.slice(0, 4).map(week => (
            <div 
              key={week} 
              className="week-preview-card"
              onClick={() => onNavigate(`study-week-${week}`)}
            >
              <div className="week-icon">📖</div>
              <h3>{week}주차</h3>
              <p>90개 단어</p>
            </div>
          ))}
        </div>
        {availableWeeks.length > 4 && (
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('weeks')}
          >
            모든 주차 보기 →
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
