import { useState, useEffect, useRef } from 'react';
import { VocabItem, TestModeType, TestResult } from '../../types';
import { playPronunciation } from '../../services/audioService';
import './styles.css';

interface TestModeProps {
  vocabList: VocabItem[];
  onComplete: (results: TestResult[]) => void;
  onCancel: () => void;
  questionCount?: number;
  testMode?: TestModeType;
}

const TestMode: React.FC<TestModeProps> = ({ 
  vocabList, 
  onComplete, 
  onCancel,
  questionCount = 10,
  testMode = TestModeType.MEANING
}) => {
  const [testItems, setTestItems] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 테스트용 아이템을 준비합니다 (선택된 개수, 랜덤 순서)
  useEffect(() => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    setTestItems(selected);
  }, [vocabList, questionCount]);

  // 문제가 변경될 때마다 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePreviousQuestion();
      } else if (e.key === 'ArrowRight' && userAnswer.trim() && !allCompleted) {
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userAnswer, allCompleted]);

  const currentItem = testItems[currentIndex];
  const isLastItem = currentIndex === testItems.length - 1;

  // 사용자 답변이 정답인지 확인하는 함수
  const checkAnswer = (userInput: string, correctAnswer: string): boolean => {
    const normalizeText = (text: string): string => {
      return text
        .replace(/\s+/g, '')
        .toLowerCase();
    };
    
    const trimmedUserInput = normalizeText(userInput);
    const normalizedCorrect = normalizeText(correctAnswer);
    
    return trimmedUserInput === normalizedCorrect;
  };

  // 이전 문제로 돌아가기
  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = results.find(r => r.vocabItem.word === testItems[currentIndex - 1].word)?.userAnswer || '';
      setUserAnswer(prevAnswer);
    }
  };

  // 답변 제출 처리
  const handleSubmitAnswer = () => {
    if (!currentItem) return;

    const trimmedAnswer = userAnswer.trim();
    
    const existingResultIndex = results.findIndex(
      r => r.vocabItem.kanji === currentItem.kanji
    );
    
    const correctAnswer = testMode === TestModeType.READING 
      ? currentItem.hiragana
      : currentItem.korean;
    
    const isCorrect = checkAnswer(trimmedAnswer, correctAnswer);
    
    const result: TestResult = {
      vocabItem: currentItem,
      isCorrect,
      userAnswer: trimmedAnswer,
      testMode
    };
    
    if (existingResultIndex > -1) {
      const updatedResults = [...results];
      updatedResults[existingResultIndex] = result;
      setResults(updatedResults);
    } else {
      setResults([...results, result]);
    }

    if (isLastItem) {
      setAllCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      const nextIndex = currentIndex + 1;
      const nextResult = results.find(r => r.vocabItem.kanji === testItems[nextIndex].kanji);
      setUserAnswer(nextResult?.userAnswer || '');
    }
  };

  const handlePlayPronunciation = () => {
    if (currentItem) {
      playPronunciation(currentItem.hiragana);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    onComplete(results);
  };

  if (!currentItem && !allCompleted) {
    return <div className="test-loading">테스트를 준비 중입니다...</div>;
  }

  return (
    <div className="test-mode">
      {!allCompleted ? (
        <>
          <div className="test-progress">
            <span>{currentIndex + 1} / {testItems.length}</span>
          </div>
          
          <div className="test-question">
            <h2 className="test-word">{currentItem.kanji}</h2>
            <button 
              className="pronunciation-button"
              onClick={handlePlayPronunciation}
              type="button"
            >
              🔊 발음 듣기
            </button>
          </div>
          
          <div className="test-answer-section">
            <label htmlFor="answer-input">
              {testMode === TestModeType.READING ? '읽기 (히라가나)' : '의미'}
            </label>
            <input
              id="answer-input"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={testMode === TestModeType.READING ? 
                "단어의 읽기를 입력하세요" : 
                "단어의 뜻을 입력하세요"}
              className="test-input"
              onKeyDown={(e) => e.key === 'Enter' && userAnswer.trim() && handleSubmitAnswer()}
              ref={inputRef}
              autoFocus
            />
            
            <div className="test-navigation">
              <button 
                className="test-nav-button"
                onClick={handlePreviousQuestion}
                disabled={currentIndex === 0}
              >
                이전
              </button>
              
              <button 
                className="test-submit-button"
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
              >
                {isLastItem ? '완료' : '다음'}
              </button>
            </div>
            
            <div className="keyboard-hint">
              <span>키보드: <kbd>←</kbd> 이전 | <kbd>→</kbd> 또는 <kbd>Enter</kbd> 다음</span>
            </div>
          </div>
        </>
      ) : (
        <div className="test-complete">
          <h2>테스트 완료!</h2>
          <p>총 {testItems.length}개 중 {results.filter(r => r.isCorrect).length}개 정답</p>
          
          <div className="test-actions">
            <button 
              className="test-submit-button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              결과 확인
            </button>
            <button 
              className="test-cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestMode;