import { useEffect, useState } from 'react';
import { useVocabulary } from '../../hooks/useVocabulary';
import { loadFromStorage } from '../../utils/storage';
import './WeekSelectionPage.css';

interface WeekSelectionPageProps {
  onNavigate: (page: string) => void;
}

interface WeekProgress {
  study: number;
  testScore: number;
  lastStudied?: string;
}

export const WeekSelectionPage: React.FC<WeekSelectionPageProps> = ({ onNavigate }) => {
  const { availableWeeks, isLoading, error } = useVocabulary();
  const [weekProgress, setWeekProgress] = useState<Record<number, WeekProgress>>({});

  useEffect(() => {
    const progress: Record<number, WeekProgress> = {};
    
    availableWeeks.forEach(week => {
      progress[week] = {
        study: loadFromStorage(`study_progress_week${week}`, 0),
        testScore: loadFromStorage(`test_best_score_week${week}`, 0),
        lastStudied: loadFromStorage(`last_studied_week${week}`, undefined),
      };
    });
    
    setWeekProgress(progress);
  }, [availableWeeks]);

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  const formatLastStudied = (dateString?: string): string => {
    if (!dateString) return '아직 학습하지 않음';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>주차 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="week-selection-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
        >
          ← 홈으로
        </button>
        <h1>주차별 학습</h1>
        <p className="page-subtitle">학습할 주차를 선택하세요</p>
      </div>

      <div className="week-grid">
        {availableWeeks.map(week => {
          const progress = weekProgress[week] || { study: 0, testScore: 0 };
          const studyProgress = Math.round((progress.study / 90) * 100);
          const progressClass = getProgressColor(studyProgress);
          
          return (
            <div key={week} className="week-card">
              <div className="week-header">
                <h2>{week}주차</h2>
                <span className="word-count">90개 단어</span>
              </div>
              
              <div className="progress-section">
                <div className="progress-info">
                  <span>학습 진행률</span>
                  <span className={`progress-percent ${progressClass}`}>
                    {studyProgress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${progressClass}`}
                    style={{ width: `${studyProgress}%` }}
                  />
                </div>
              </div>
              
              {progress.testScore > 0 && (
                <div className="test-score">
                  <span className="score-label">최고 점수</span>
                  <span className={`score-value ${getProgressColor(progress.testScore)}`}>
                    {progress.testScore}%
                  </span>
                </div>
              )}
              
              <div className="last-studied">
                {formatLastStudied(progress.lastStudied)}
              </div>
              
              <div className="week-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => onNavigate(`study-week-${week}`)}
                >
                  <span className="btn-icon">📚</span>
                  암기 모드
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => onNavigate(`test-week-${week}`)}
                >
                  <span className="btn-icon">📝</span>
                  테스트
                </button>
              </div>
              
              {studyProgress === 100 && (
                <div className="completion-badge">
                  <span>✨ 완료</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="summary-section">
        <h2>학습 팁</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <p>매일 조금씩 꾸준히 학습하는 것이 가장 효과적입니다.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <p>테스트에서 80% 이상 획득을 목표로 해보세요.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔄</span>
            <p>틀린 문제는 반드시 복습하여 완벽하게 익히세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekSelectionPage;
