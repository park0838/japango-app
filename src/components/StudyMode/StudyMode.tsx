import { useState, useEffect, useCallback } from 'react';
import { VocabWord, WeekData } from '../../types';
import { useVocabulary } from '../../hooks/useVocabulary';
import { saveToStorage, loadFromStorage } from '../../utils/storage';
import { speakJapanese } from '../../services/audioService';
import './StudyMode.css';

interface StudyModeProps {
  week: number;
  onNavigate: (page: string) => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ week, onNavigate }) => {
  const { loadWeekData } = useVocabulary();
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [studiedToday, setStudiedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 주차 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await loadWeekData(week);
      if (data) {
        setWeekData(data);
        
        // 저장된 진행도 불러오기
        const savedProgress = loadFromStorage(`study_progress_week${week}`, 0);
        setCurrentIndex(Math.min(savedProgress, data.words.length - 1));
        
        // 오늘 학습한 단어 수 불러오기
        const todayCount = loadFromStorage(`studied_today_week${week}`, 0);
        setStudiedToday(todayCount);
        
        // 마지막 학습 시간 저장
        saveToStorage(`last_studied_week${week}`, new Date().toISOString());
      }
      setIsLoading(false);
    };
    
    loadData();
  }, [week, loadWeekData]);

  // 진행도 저장
  useEffect(() => {
    if (weekData) {
      saveToStorage(`study_progress_week${week}`, currentIndex);
      saveToStorage(`studied_today_week${week}`, studiedToday);
    }
  }, [currentIndex, studiedToday, week, weekData]);

  // 자동 재생
  useEffect(() => {
    if (!isAutoPlay || !weekData) return;
    
    const timer = setTimeout(() => {
      handleNext();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [isAutoPlay, currentIndex, weekData]);

  const handleNext = useCallback(() => {
    if (!weekData) return;
    
    setCurrentIndex(prev => {
      const next = (prev + 1) % weekData.words.length;
      if (next > prev) {
        setStudiedToday(count => count + 1);
      }
      return next;
    });
    resetCardState();
  }, [weekData]);

  const handlePrev = useCallback(() => {
    if (!weekData) return;
    
    setCurrentIndex(prev => (prev - 1 + weekData.words.length) % weekData.words.length);
    resetCardState();
  }, [weekData]);

  const resetCardState = () => {
    setIsCardFlipped(false);
    setShowHint(false);
  };

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
    if (!isCardFlipped && weekData) {
      speakJapanese(weekData.words[currentIndex].hiragana);
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        handleNext();
        break;
      case 'ArrowLeft':
        handlePrev();
        break;
      case ' ':
        e.preventDefault();
        handleCardFlip();
        break;
      case 'h':
        setShowHint(prev => !prev);
        break;
      case 'a':
        setIsAutoPlay(prev => !prev);
        break;
    }
  }, [handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>단어를 불러오는 중...</p>
      </div>
    );
  }

  if (!weekData) {
    return (
      <div className="error-container">
        <p className="error-message">단어를 불러올 수 없습니다.</p>
        <button className="btn btn-primary" onClick={() => onNavigate('weeks')}>
          주차 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const currentWord = weekData.words[currentIndex];
  const progress = ((currentIndex + 1) / weekData.words.length) * 100;

  return (
    <div className="study-mode">
      <div className="study-header">
        <button className="back-button" onClick={() => onNavigate('weeks')}>
          ← 주차 선택
        </button>
        
        <div className="study-info">
          <h1>{week}주차 암기 모드</h1>
          <div className="study-stats">
            <span>{currentIndex + 1} / {weekData.words.length}</span>
            <span className="separator">•</span>
            <span>오늘: {studiedToday}개</span>
          </div>
        </div>

        <div className="study-controls">
          <button 
            className={`btn btn-sm ${showHint ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowHint(!showHint)}
          >
            💡 힌트
          </button>
          <button 
            className={`btn btn-sm ${isAutoPlay ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? '⏸️ 정지' : '▶️ 자동'}
          </button>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="study-content">
        <div 
          className={`word-card ${isCardFlipped ? 'flipped' : ''}`}
          onClick={handleCardFlip}
        >
          <div className="card-front">
            <div className="kanji">{currentWord.kanji}</div>
            <p className="card-hint">카드를 클릭하여 뒤집어보세요</p>
          </div>
          
          <div className="card-back">
            <div className="kanji-small">{currentWord.kanji}</div>
            <div className="reading">{currentWord.hiragana}</div>
            <div className="meaning">{currentWord.korean}</div>
          </div>
        </div>

        {showHint && !isCardFlipped && (
          <div className="hint-box">
            <span className="hint-icon">💡</span>
            <span className="hint-text">
              "{currentWord.korean.slice(0, 1)}..."로 시작하는 단어입니다
            </span>
          </div>
        )}

        <div className="audio-section">
          <button 
            className="btn btn-secondary"
            onClick={() => speakJapanese(currentWord.hiragana)}
          >
            🔊 발음 듣기
          </button>
        </div>

        <div className="navigation-buttons">
          <button 
            className="btn btn-outline btn-lg"
            onClick={handlePrev}
          >
            ← 이전
          </button>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleNext}
          >
            다음 →
          </button>
        </div>
      </div>

      <div className="keyboard-shortcuts">
        <h3>키보드 단축키</h3>
        <div className="shortcuts-grid">
          <div className="shortcut">
            <kbd>←</kbd> / <kbd>→</kbd> : 이전/다음 단어
          </div>
          <div className="shortcut">
            <kbd>Space</kbd> : 카드 뒤집기
          </div>
          <div className="shortcut">
            <kbd>H</kbd> : 힌트 표시
          </div>
          <div className="shortcut">
            <kbd>A</kbd> : 자동 재생
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMode;
