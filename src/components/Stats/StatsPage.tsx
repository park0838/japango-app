import { useState, useEffect } from 'react';
import { useVocabulary } from '../../hooks/useVocabulary';
import { loadFromStorage, getStorageKeysByPattern } from '../../utils/storage';
import './StatsPage.css';

interface StatsPageProps {
  onNavigate: (page: string) => void;
}

interface WeekStats {
  studyProgress: number;
  studiedToday: number;
  bestScore: number;
  testResults: TestResult[];
  lastStudied?: string;
}

interface TestResult {
  date: string;
  score: number;
  total: number;
  percentage: number;
  questionTypes: string[];
}

export const StatsPage: React.FC<StatsPageProps> = ({ onNavigate }) => {
  const { availableWeeks } = useVocabulary();
  const [weekStats, setWeekStats] = useState<Record<number, WeekStats>>({});
  const [totalStats, setTotalStats] = useState({
    totalStudied: 0,
    averageScore: 0,
    totalTests: 0,
    studyStreak: 0,
    wrongAnswersCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, [availableWeeks]);

  const loadStats = () => {
    const stats: Record<number, WeekStats> = {};
    let totalStudied = 0;
    let totalScoreSum = 0;
    let totalTestCount = 0;
    let scoreCount = 0;

    // 주차별 통계 수집
    availableWeeks.forEach(week => {
      const studyProgress = loadFromStorage(`study_progress_week${week}`, 0);
      const studiedToday = loadFromStorage(`studied_today_week${week}`, 0);
      const bestScore = loadFromStorage(`test_best_score_week${week}`, 0);
      const testResults = loadFromStorage(`test_results_week${week}`, []);
      const lastStudied = loadFromStorage(`last_studied_week${week}`, undefined);

      stats[week] = {
        studyProgress,
        studiedToday,
        bestScore,
        testResults,
        lastStudied,
      };

      totalStudied += studiedToday;
      totalTestCount += testResults.length;
      
      if (bestScore > 0) {
        totalScoreSum += bestScore;
        scoreCount++;
      }
    });

    // 틀린 답안 개수
    const wrongAnswers = loadFromStorage('wrong_answers', []);
    
    // 학습 연속일 계산
    const studyStreak = calculateStudyStreak();

    setWeekStats(stats);
    setTotalStats({
      totalStudied,
      averageScore: scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0,
      totalTests: totalTestCount,
      studyStreak,
      wrongAnswersCount: wrongAnswers.length,
    });
  };

  const calculateStudyStreak = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      let studiedOnDate = false;
      
      // 모든 주차의 학습 기록 확인
      for (const week of availableWeeks) {
        const lastStudied: string = loadFromStorage(`last_studied_week${week}`, '');
        if (lastStudied && lastStudied.startsWith(dateStr)) {
          studiedOnDate = true;
          break;
        }
      }
      
      if (studiedOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleResetData = () => {
    if (confirm('정말로 모든 학습 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      if (confirm('한 번 더 확인합니다. 정말로 초기화하시겠습니까?')) {
        // 모든 학습 관련 데이터 삭제
        const keysToDelete = [
          ...getStorageKeysByPattern(/^study_progress_week/),
          ...getStorageKeysByPattern(/^studied_today_week/),
          ...getStorageKeysByPattern(/^test_best_score_week/),
          ...getStorageKeysByPattern(/^test_results_week/),
          ...getStorageKeysByPattern(/^last_studied_week/),
          'wrong_answers',
        ];
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        
        // 페이지 새로고침
        window.location.reload();
      }
    }
  };

  return (
    <div className="stats-page">
      <div className="page-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← 홈으로
        </button>
        <h1>내 학습 통계</h1>
        <p className="page-subtitle">학습 진행 상황을 한눈에 확인하세요</p>
      </div>

      {/* 전체 통계 */}
      <div className="total-stats">
        <div className="stat-card primary">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{totalStats.totalStudied}</div>
          <div className="stat-label">오늘 학습한 단어</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{totalStats.averageScore}%</div>
          <div className="stat-label">평균 최고 점수</div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{totalStats.totalTests}</div>
          <div className="stat-label">완료한 테스트</div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{totalStats.studyStreak}일</div>
          <div className="stat-label">연속 학습</div>
        </div>
        
        {totalStats.wrongAnswersCount > 0 && (
          <div className="stat-card error">
            <div className="stat-icon">❌</div>
            <div className="stat-value">{totalStats.wrongAnswersCount}</div>
            <div className="stat-label">틀린 문제</div>
          </div>
        )}
      </div>

      {/* 주차별 상세 통계 */}
      <div className="week-stats-section">
        <h2>주차별 상세 통계</h2>
        <div className="week-stats-grid">
          {availableWeeks.map(week => {
            const stats = weekStats[week];
            if (!stats) return null;
            
            const studyProgress = Math.round((stats.studyProgress / 90) * 100);
            const progressClass = getProgressColor(studyProgress);
            
            return (
              <div key={week} className="week-stat-card">
                <div className="week-stat-header">
                  <h3>{week}주차</h3>
                  {studyProgress === 100 && (
                    <span className="completion-badge">✨ 완료</span>
                  )}
                </div>
                
                <div className="progress-section">
                  <div className="progress-info">
                    <span>학습 진행률</span>
                    <span className={`progress-value ${progressClass}`}>
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
                
                <div className="week-stat-details">
                  <div className="detail-item">
                    <span className="detail-label">최고 점수</span>
                    <span className={`detail-value ${getProgressColor(stats.bestScore)}`}>
                      {stats.bestScore}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">오늘 학습</span>
                    <span className="detail-value">{stats.studiedToday}개</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">테스트 횟수</span>
                    <span className="detail-value">{stats.testResults.length}회</span>
                  </div>
                </div>
                
                {stats.testResults.length > 0 && (
                  <div className="recent-tests">
                    <h4>최근 테스트 결과</h4>
                    {stats.testResults.slice(0, 3).map((result, index) => (
                      <div key={index} className="test-result-item">
                        <span className="test-date">{formatDate(result.date)}</span>
                        <span className={`test-score ${getProgressColor(result.percentage)}`}>
                          {result.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="week-actions">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => onNavigate(`study-week-${week}`)}
                  >
                    학습하기
                  </button>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => onNavigate(`test-week-${week}`)}
                  >
                    테스트
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 학습 팁 */}
      <div className="tips-section">
        <h2>학습 성과 향상 팁</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h3>목표 설정</h3>
            <p>매일 최소 10개 이상의 단어를 학습하는 목표를 세워보세요.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📅</div>
            <h3>규칙적인 학습</h3>
            <p>매일 같은 시간에 학습하면 습관을 만들기 쉬워집니다.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h3>반복 학습</h3>
            <p>틀린 문제는 반드시 복습하여 완벽하게 익히세요.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📈</div>
            <h3>점진적 향상</h3>
            <p>테스트 점수가 조금씩 오르는 것을 목표로 하세요.</p>
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="data-management">
        <h2>데이터 관리</h2>
        <div className="management-card">
          <p>모든 학습 데이터를 초기화하면 처음부터 다시 시작할 수 있습니다.</p>
          <p className="warning-text">⚠️ 이 작업은 되돌릴 수 없습니다.</p>
          <button 
            className="btn btn-outline btn-danger"
            onClick={handleResetData}
          >
            🗑️ 모든 데이터 초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
