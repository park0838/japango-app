import { useState, useEffect } from 'react';
import { VocabWord } from '../../types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { speakJapanese } from '../../services/audioService';
import './WrongAnswersPage.css';

interface WrongAnswersPageProps {
  onNavigate: (page: string) => void;
}

export interface WrongAnswer {
  word: VocabWord;
  userAnswer: string;
  correctAnswer: string;
  week: number;
  timestamp: number;
}

export const WrongAnswersPage: React.FC<WrongAnswersPageProps> = ({ onNavigate }) => {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [groupedAnswers, setGroupedAnswers] = useState<Record<number, WrongAnswer[]>>({});
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'card' | 'quiz'>('card');
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [showQuizResult, setShowQuizResult] = useState(false);

  // 틀린 답안 로드
  useEffect(() => {
    loadWrongAnswers();
  }, []);

  const loadWrongAnswers = () => {
    const answers = loadFromStorage('wrong_answers', []);
    setWrongAnswers(answers);
    
    // 주차별로 그룹화
    const grouped = answers.reduce((acc: Record<number, WrongAnswer[]>, answer: WrongAnswer) => {
      if (!acc[answer.week]) {
        acc[answer.week] = [];
      }
      acc[answer.week].push(answer);
      return acc;
    }, {});
    
    setGroupedAnswers(grouped);
  };

  // 틀린 답안 제거
  const removeWrongAnswer = (wordId: number, week: number) => {
    const answers = loadFromStorage('wrong_answers', []);
    const filtered = answers.filter((ans: WrongAnswer) => 
      !(ans.word.id === wordId && ans.week === week)
    );
    saveToStorage('wrong_answers', filtered);
    loadWrongAnswers();
    
    // 현재 학습 중인 주차의 단어가 모두 제거되었는지 확인
    if (selectedWeek && filtered.filter((ans: WrongAnswer) => ans.week === selectedWeek).length === 0) {
      setSelectedWeek(null);
    } else if (selectedWeek && currentIndex >= filtered.filter((ans: WrongAnswer) => ans.week === selectedWeek).length) {
      // 현재 인덱스가 범위를 벗어나면 마지막 요소로 이동
      setCurrentIndex(Math.max(0, filtered.filter((ans: WrongAnswer) => ans.week === selectedWeek).length - 1));
    }
  };

  // 전체 틀린 답안 초기화
  const clearAllWrongAnswers = () => {
    if (confirm('정말로 모든 틀린 문제를 삭제하시겠습니까?')) {
      saveToStorage('wrong_answers', []);
      loadWrongAnswers();
      setSelectedWeek(null);
    }
  };

  // 주차 선택 화면
  if (selectedWeek === null) {
    if (wrongAnswers.length === 0) {
      return (
        <div className="wrong-answers-page">
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h1>완벽합니다!</h1>
            <p>현재 틀린 문제가 없습니다.</p>
            <p className="empty-subtitle">계속 학습하여 실력을 유지하세요!</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('weeks')}
            >
              주차별 학습으로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="wrong-answers-page">
        <div className="page-header">
          <button className="back-button" onClick={() => onNavigate('home')}>
            ← 홈으로
          </button>
          <h1>틀린 문제 복습</h1>
          <p className="page-subtitle">총 {wrongAnswers.length}개의 틀린 문제가 있습니다</p>
        </div>

        <div className="week-grid">
          {Object.entries(groupedAnswers).map(([week, answers]) => (
            <div 
              key={week} 
              className="week-card clickable"
              onClick={() => setSelectedWeek(parseInt(week))}
            >
              <div className="week-header">
                <h2>{week}주차</h2>
                <span className="error-count">{answers.length}개</span>
              </div>
              
              <div className="preview-list">
                {answers.slice(0, 3).map((answer, index) => (
                  <div key={index} className="preview-item">
                    <span className="preview-kanji">{answer.word.kanji}</span>
                    <span className="preview-meaning">{answer.word.korean}</span>
                  </div>
                ))}
                {answers.length > 3 && (
                  <p className="preview-more">...그 외 {answers.length - 3}개</p>
                )}
              </div>
              
              <button className="btn btn-primary w-full">
                복습 시작
              </button>
            </div>
          ))}
        </div>

        <div className="actions-section">
          <button 
            className="btn btn-outline"
            onClick={clearAllWrongAnswers}
          >
            🗑️ 모든 틀린 문제 삭제
          </button>
        </div>
      </div>
    );
  }

  // 주차별 학습 화면
  const weekAnswers = groupedAnswers[selectedWeek] || [];
  const currentAnswer = weekAnswers[currentIndex];

  if (!currentAnswer) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < weekAnswers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setShowAnswer(false);
    setQuizAnswer('');
    setShowQuizResult(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(weekAnswers.length - 1);
    }
    setShowAnswer(false);
    setQuizAnswer('');
    setShowQuizResult(false);
  };

  const handleQuizSubmit = () => {
    setShowQuizResult(true);
    if (quizAnswer.trim() === currentAnswer.word.korean) {
      setTimeout(() => {
        removeWrongAnswer(currentAnswer.word.id, selectedWeek);
        if (weekAnswers.length > 1) {
          handleNext();
        }
      }, 1500);
    }
  };

  return (
    <div className="wrong-answers-study">
      <div className="study-header">
        <button className="back-button" onClick={() => setSelectedWeek(null)}>
          ← 틀린 문제 목록
        </button>
        
        <div className="study-info">
          <h1>{selectedWeek}주차 틀린 문제 복습</h1>
          <div className="study-stats">
            <span>{currentIndex + 1} / {weekAnswers.length}</span>
          </div>
        </div>

        <div className="mode-toggle">
          <button 
            className={`btn btn-sm ${studyMode === 'card' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStudyMode('card')}
          >
            🃏 카드
          </button>
          <button 
            className={`btn btn-sm ${studyMode === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStudyMode('quiz')}
          >
            📝 퀴즈
          </button>
        </div>
      </div>

      <div className="wrong-info">
        <div className="wrong-info-content">
          <span className="wrong-label">이전 답안:</span>
          <span className="wrong-answer">"{currentAnswer.userAnswer}"</span>
          <span className="arrow">→</span>
          <span className="correct-answer">"{currentAnswer.correctAnswer}"</span>
        </div>
      </div>

      {studyMode === 'card' ? (
        <div className="card-mode">
          <div className={`study-card ${showAnswer ? 'flipped' : ''}`}>
            <div className="card-content">
              <div className="kanji">{currentAnswer.word.kanji}</div>
              
              {showAnswer && (
                <div className="answer-section">
                  <div className="reading">{currentAnswer.word.hiragana}</div>
                  <div className="meaning">{currentAnswer.word.korean}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => speakJapanese(currentAnswer.word.hiragana)}
            >
              🔊 발음 듣기
            </button>
            <button 
              className={`btn ${showAnswer ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? '답안 숨기기' : '답안 보기'}
            </button>
            {showAnswer && (
              <button 
                className="btn btn-success"
                onClick={() => removeWrongAnswer(currentAnswer.word.id, selectedWeek)}
              >
                ✅ 학습 완료
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="quiz-mode">
          <div className="quiz-card">
            <div className="kanji">{currentAnswer.word.kanji}</div>
            <div className="reading">{currentAnswer.word.hiragana}</div>
            
            <div className="quiz-input-section">
              <input
                type="text"
                className="quiz-input"
                placeholder="뜻을 입력하세요..."
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuizSubmit()}
                disabled={showQuizResult}
              />
              <button 
                className="btn btn-primary"
                onClick={handleQuizSubmit}
                disabled={!quizAnswer.trim() || showQuizResult}
              >
                확인
              </button>
            </div>

            {showQuizResult && (
              <div className={`quiz-result ${quizAnswer.trim() === currentAnswer.word.korean ? 'correct' : 'incorrect'}`}>
                {quizAnswer.trim() === currentAnswer.word.korean ? (
                  <p>
                    <span className="result-icon">🎉</span>
                    정답입니다! 틀린 문제 목록에서 제거됩니다.
                  </p>
                ) : (
                  <p>
                    <span className="result-icon">❌</span>
                    틀렸습니다. 정답은 "{currentAnswer.word.korean}" 입니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="navigation-buttons">
        <button className="btn btn-outline btn-lg" onClick={handlePrev}>
          ← 이전
        </button>
        <button className="btn btn-primary btn-lg" onClick={handleNext}>
          다음 →
        </button>
      </div>
    </div>
  );
};

export default WrongAnswersPage;
