import { useState } from 'react';
import { getAllWeeks, getVocabByWeek, vocabData } from '../data/vocabData';
import { TestModeType, TestResult } from '../types';
import TestMode from '../components/TestMode';
import TestResults from '../components/TestResults';

const TestPage: React.FC = () => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [testMode, setTestMode] = useState<TestModeType>(TestModeType.MEANING);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  const weeks = getAllWeeks();

  // 선택된 주차들의 단어 가져오기
  const getSelectedVocab = () => {
    if (selectedWeeks.length === 0) {
      return vocabData; // 전체 단어
    }
    return selectedWeeks.flatMap(week => getVocabByWeek(week));
  };

  const handleWeekToggle = (week: number) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleSelectAll = () => {
    setSelectedWeeks(selectedWeeks.length === weeks.length ? [] : [...weeks]);
  };

  const handleStartTest = () => {
    const selectedVocab = getSelectedVocab();
    if (selectedVocab.length === 0) {
      alert('테스트할 단어가 없습니다.');
      return;
    }
    setIsTestStarted(true);
  };

  const handleTestComplete = (results: TestResult[]) => {
    setTestResults(results);
    setIsTestStarted(false);
  };

  const handleTestCancel = () => {
    setIsTestStarted(false);
  };

  const handleRetryTest = () => {
    setTestResults(null);
    setIsTestStarted(true);
  };

  const handleGoHome = () => {
    setTestResults(null);
    setIsTestStarted(false);
  };

  // 테스트 결과 화면
  if (testResults) {
    return (
      <div className="test-page">
        <TestResults
          results={testResults}
          onRetry={handleRetryTest}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }

  // 테스트 진행 화면
  if (isTestStarted) {
    return (
      <div className="test-page">
        <TestMode
          vocabList={getSelectedVocab()}
          onComplete={handleTestComplete}
          onCancel={handleTestCancel}
          questionCount={questionCount}
          testMode={testMode}
        />
      </div>
    );
  }

  // 테스트 설정 화면
  return (
    <div className="test-page">
      <div className="page-container">
        <h1>테스트 모드</h1>
        <p>테스트 설정을 선택하고 시작하세요</p>
        
        <div className="test-settings">
          {/* 테스트 모드 선택 */}
          <div className="setting-group">
            <h3>테스트 종류</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="testMode"
                  value={TestModeType.MEANING}
                  checked={testMode === TestModeType.MEANING}
                  onChange={(e) => setTestMode(e.target.value as TestModeType)}
                />
                의미 테스트 (단어 → 의미)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="testMode"
                  value={TestModeType.READING}
                  checked={testMode === TestModeType.READING}
                  onChange={(e) => setTestMode(e.target.value as TestModeType)}
                />
                읽기 테스트 (단어 → 히라가나)
              </label>
            </div>
          </div>

          {/* 문제 개수 선택 */}
          <div className="setting-group">
            <h3>문제 개수</h3>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="select-input"
            >
              <option value={5}>5문제</option>
              <option value={10}>10문제</option>
              <option value={15}>15문제</option>
              <option value={20}>20문제</option>
              <option value={30}>30문제</option>
            </select>
          </div>

          {/* 주차 선택 */}
          <div className="setting-group">
            <h3>주차 선택</h3>
            <div className="week-selection">
              <button
                className="select-all-button"
                onClick={handleSelectAll}
              >
                {selectedWeeks.length === weeks.length ? '전체 해제' : '전체 선택'}
              </button>
              <div className="week-checkboxes">
                {weeks.map(week => (
                  <label key={week} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedWeeks.includes(week)}
                      onChange={() => handleWeekToggle(week)}
                    />
                    {week}주차 ({getVocabByWeek(week).length}개)
                  </label>
                ))}
              </div>
            </div>
            <p className="selected-info">
              {selectedWeeks.length === 0 
                ? `전체 ${vocabData.length}개 단어` 
                : `선택된 ${getSelectedVocab().length}개 단어`}
            </p>
          </div>

          <button
            className="start-test-button"
            onClick={handleStartTest}
          >
            테스트 시작
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .test-page {
          min-height: calc(100vh - 80px);
          padding: var(--spacing-6);
          background-color: var(--background);
        }
        
        .page-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        
        .page-container h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--font-color);
          margin-bottom: var(--spacing-4);
        }
        
        .page-container p {
          font-size: 1.2rem;
          color: var(--font-color-muted);
          margin-bottom: var(--spacing-8);
        }
        
        .test-settings {
          background-color: var(--card-bg);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-6);
          box-shadow: var(--shadow-lg);
          text-align: left;
        }
        
        .setting-group {
          margin-bottom: var(--spacing-6);
        }
        
        .setting-group h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--font-color);
          margin-bottom: var(--spacing-3);
        }
        
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }
        
        .radio-label, .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: 1rem;
          color: var(--font-color);
          cursor: pointer;
        }
        
        .radio-label input, .checkbox-label input {
          margin: 0;
        }
        
        .select-input {
          padding: var(--spacing-3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--card-bg);
          color: var(--font-color);
          font-size: 1rem;
          width: 100%;
        }
        
        .week-selection {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }
        
        .select-all-button {
          padding: var(--spacing-2) var(--spacing-4);
          background-color: var(--neutral-200);
          color: var(--font-color);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-size: 0.9rem;
          align-self: flex-start;
        }
        
        .select-all-button:hover {
          background-color: var(--neutral-300);
        }
        
        .week-checkboxes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-2);
        }
        
        .selected-info {
          font-size: 0.9rem;
          color: var(--font-color-muted);
          margin-top: var(--spacing-2);
        }
        
        .start-test-button {
          width: 100%;
          padding: var(--spacing-4);
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-top: var(--spacing-4);
        }
        
        .start-test-button:hover {
          background-color: var(--primary-hover);
        }
        
        @media (max-width: 768px) {
          .test-page {
            padding: var(--spacing-4);
          }
          
          .page-container h1 {
            font-size: 2rem;
          }
          
          .week-checkboxes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TestPage;