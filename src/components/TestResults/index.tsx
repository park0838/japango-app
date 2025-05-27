import React from 'react';
import { TestResult, TestModeType } from '../../types';
import './styles.css';

interface TestResultsProps {
  results: TestResult[];
  onRetry: () => void;
  onGoHome: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onRetry, onGoHome }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.length - correctCount;
  const percentage = Math.round((correctCount / results.length) * 100);

  return (
    <div className="test-results-container">
      <div className="test-results-header">
        <h2>테스트 결과</h2>
        
        <div className="test-score">
          <div className="score-item score-correct">
            <div className="score-number">{correctCount}</div>
            <div className="score-label">정답</div>
          </div>
          <div className="score-item score-wrong">
            <div className="score-number">{wrongCount}</div>
            <div className="score-label">오답</div>
          </div>
          <div className="score-item score-percentage">
            <div className="score-number">{percentage}%</div>
            <div className="score-label">정답률</div>
          </div>
        </div>
      </div>

      <div className="test-results-list">
        <table className="results-table">
          <thead>
            <tr>
              <th>단어</th>
              <th>정답</th>
              <th>입력한 답</th>
              <th>결과</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const correctAnswer = result.testMode === TestModeType.READING 
                ? result.vocabItem.reading || ''
                : result.vocabItem.meaning;
              
              return (
                <tr 
                  key={`${result.vocabItem.word}-${index}`} 
                  className={`result-row ${result.isCorrect ? 'correct' : 'wrong'}`}
                >
                  <td className="result-word">{result.vocabItem.word}</td>
                  <td className="result-correct-answer">{correctAnswer}</td>
                  <td className={`result-user-answer ${!result.isCorrect ? 'wrong' : ''}`}>
                    {result.userAnswer || '(답변 없음)'}
                  </td>
                  <td className={`result-status ${result.isCorrect ? 'correct' : 'wrong'}`}>
                    {result.isCorrect ? '✓' : '✗'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="test-results-actions">
        <button 
          className="results-button primary"
          onClick={onRetry}
        >
          다시 테스트
        </button>
        <button 
          className="results-button secondary"
          onClick={onGoHome}
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default TestResults;