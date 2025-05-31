import { useState, useEffect, useCallback, useMemo } from 'react';
import { VocabWord, WeekData } from '../../types';
import { useVocabulary } from '../../hooks/useVocabulary';
import { saveToStorage, loadFromStorage } from '../../utils/storage';
import { speakJapanese } from '../../services/audioService';
import type { WrongAnswer } from '../WrongAnswers/WrongAnswersPage';
import './TestMode.css';

interface TestModeProps {
  week: number;
  onNavigate: (page: string) => void;
}

type QuestionType = 'kanji-to-korean' | 'korean-to-kanji' | 'reading-to-korean';

interface TestQuestion {
  word: VocabWord;
  type: QuestionType;
  choices: string[];
  correctAnswer: string;
}



export const TestMode: React.FC<TestModeProps> = ({ week, onNavigate }) => {
  const { loadWeekData } = useVocabulary();
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'kanji-to-korean',
    'korean-to-kanji',
    'reading-to-korean'
  ]);
  const [testSettings, setTestSettings] = useState({
    questionCount: 20,
    randomOrder: true
  });
  const [testCompleted, setTestCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 주차 데이터 로드 및 문제 생성
  useEffect(() => {
    const loadAndSetupTest = async () => {
      setIsLoading(true);
      const data = await loadWeekData(week);
      
      if (data) {
        setWeekData(data);
        generateQuestions(data.words);
      }
      
      setIsLoading(false);
    };
    
    loadAndSetupTest();
  }, [week, loadWeekData]);

  // 문제 생성
  const generateQuestions = (words: VocabWord[]) => {
    if (selectedTypes.length === 0) {
      setQuestions([]);
      return;
    }

    // 단어 섞기
    const shuffledWords = testSettings.randomOrder 
      ? [...words].sort(() => Math.random() - 0.5)
      : [...words];
    
    const generatedQuestions: TestQuestion[] = [];
    const questionsToGenerate = Math.min(testSettings.questionCount, shuffledWords.length);
    
    for (let i = 0; i < questionsToGenerate; i++) {
      const word = shuffledWords[i];
      // 문제 유형 선택
      const type = selectedTypes[i % selectedTypes.length];
      const question = generateQuestion(word, words, type);
      generatedQuestions.push(question);
    }
    
    setQuestions(generatedQuestions);
  };

  // 개별 문제 생성
  const generateQuestion = (
    word: VocabWord,
    allWords: VocabWord[],
    type: QuestionType
  ): TestQuestion => {
    let correctAnswer = '';
    let wrongAnswerPool: string[] = [];
    
    switch (type) {
      case 'kanji-to-korean':
        correctAnswer = word.korean;
        wrongAnswerPool = allWords
          .filter(w => w.korean !== correctAnswer)
          .map(w => w.korean);
        break;
        
      case 'korean-to-kanji':
        correctAnswer = word.kanji;
        wrongAnswerPool = allWords
          .filter(w => w.kanji !== correctAnswer)
          .map(w => w.kanji);
        break;
        
      case 'reading-to-korean':
        correctAnswer = word.korean;
        wrongAnswerPool = allWords
          .filter(w => w.korean !== correctAnswer)
          .map(w => w.korean);
        break;
    }
    
    // 오답 3개 선택
    const wrongAnswers = wrongAnswerPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // 보기 섞기
    const choices = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);
    
    return {
      word,
      type,
      choices,
      correctAnswer
    };
  };

  // 답안 선택
  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      // 틀린 답안 저장
      saveWrongAnswer(currentQuestion.word, answer, currentQuestion.correctAnswer);
    }
  };

  // 틀린 답안 저장
  const saveWrongAnswer = (word: VocabWord, userAnswer: string, correctAnswer: string) => {
    const wrongAnswers = loadFromStorage('wrong_answers', []);
    const wrongAnswer: WrongAnswer = {
      word,
      userAnswer,
      correctAnswer,
      week,
      timestamp: Date.now()
    };
    
    // 중복 제거
    const filteredAnswers = wrongAnswers.filter((ans: WrongAnswer) => 
      !(ans.word.id === word.id && ans.week === week)
    );
    
    const updatedAnswers = [wrongAnswer, ...filteredAnswers].slice(0, 200);
    saveToStorage('wrong_answers', updatedAnswers);
  };

  // 다음 문제
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // 테스트 완료
      completeTest();
    }
  };

  // 테스트 완료 처리
  const completeTest = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    // 최고 점수 업데이트
    const bestScore = loadFromStorage(`test_best_score_week${week}`, 0);
    if (percentage > bestScore) {
      saveToStorage(`test_best_score_week${week}`, percentage);
    }
    
    // 테스트 결과 저장
    const results = loadFromStorage(`test_results_week${week}`, []);
    const newResult = {
      date: new Date().toISOString(),
      score,
      total: questions.length,
      percentage,
      questionTypes: selectedTypes
    };
    
    const updatedResults = [newResult, ...results].slice(0, 10);
    saveToStorage(`test_results_week${week}`, updatedResults);
    
    setTestCompleted(true);
  };

  // 테스트 재시작
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTestCompleted(false);
    
    if (weekData) {
      generateQuestions(weekData.words);
    }
  };

  // 키보드 단축키
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (showResult && e.key === 'Enter') {
      handleNext();
    } else if (!showResult && e.key >= '1' && e.key <= '4') {
      const index = parseInt(e.key) - 1;
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && index < currentQuestion.choices.length) {
        handleAnswerSelect(currentQuestion.choices[index]);
      }
    }
  }, [showResult, currentQuestionIndex, questions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>테스트를 준비하는 중...</p>
      </div>
    );
  }

  if (!weekData || questions.length === 0) {
    return (
      <div className="error-container">
        <div className="error-icon">😔</div>
        <h2 className="error-title">테스트를 불러올 수 없습니다</h2>
        <p className="error-message">
          {!weekData ? '단어 데이터를 불러오는데 실패했습니다.' : '테스트 문제를 생성할 수 없습니다.'}
        </p>
        <div className="error-actions">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            페이지 새로고침
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('weeks')}>
            주차 선택으로
          </button>
        </div>
      </div>
    );
  }

  // 테스트 완료 화면
  if (testCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="test-complete">
        <div className="complete-content">
          <div className="complete-icon">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😅'}
          </div>
          
          <h1>{week}주차 테스트 완료!</h1>
          
          <div className="score-display">
            <div className="score-number">{score} / {questions.length}</div>
            <div className="score-percentage">{percentage}%</div>
          </div>
          
          <div className="score-message">
            {percentage >= 80 && <p className="message-success">훌륭해요! 완벽하게 마스터했습니다!</p>}
            {percentage >= 60 && percentage < 80 && <p className="message-warning">잘했어요! 조금만 더 연습하면 완벽해질 거예요!</p>}
            {percentage < 60 && <p className="message-error">더 연습이 필요해요! 암기 모드에서 복습해보세요!</p>}
          </div>
          
          <div className="complete-actions">
            <button className="btn btn-primary btn-lg" onClick={resetTest}>
              🔄 다시 테스트
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate(`study-week-${week}`)}>
              📚 암기 모드로
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('weeks')}>
              📋 주차 선택으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="test-mode">
      <div className="test-header">
        <button className="back-button" onClick={() => onNavigate('weeks')}>
          ← 주차 선택
        </button>
        
        <div className="test-info">
          <h1>{week}주차 테스트</h1>
          <div className="test-stats">
            <span>문제 {currentQuestionIndex + 1} / {questions.length}</span>
            <span className="separator">•</span>
            <span>점수: {score}</span>
          </div>
        </div>

        <div className="test-type-badge">
          {currentQuestion.type === 'kanji-to-korean' && '한자 → 뜻'}
          {currentQuestion.type === 'korean-to-kanji' && '뜻 → 한자'}
          {currentQuestion.type === 'reading-to-korean' && '읽기 → 뜻'}
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

      <div className="test-content">
        <div className="question-section">
          <div className="question">
            {currentQuestion.type === 'kanji-to-korean' && currentQuestion.word.kanji}
            {currentQuestion.type === 'korean-to-kanji' && currentQuestion.word.korean}
            {currentQuestion.type === 'reading-to-korean' && currentQuestion.word.hiragana}
          </div>
          
          {currentQuestion.type === 'kanji-to-korean' && (
            <div className="question-sub">{currentQuestion.word.hiragana}</div>
          )}
          
          <h3 className="question-prompt">
            {currentQuestion.type === 'kanji-to-korean' && '이 단어의 뜻은 무엇인가요?'}
            {currentQuestion.type === 'korean-to-kanji' && '이 뜻의 한자는 무엇인가요?'}
            {currentQuestion.type === 'reading-to-korean' && '이 읽기의 뜻은 무엇인가요?'}
          </h3>
        </div>

        <div className="choices-section">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              className={`choice-btn ${
                showResult && choice === currentQuestion.correctAnswer ? 'correct' : ''
              } ${
                showResult && choice === selectedAnswer && choice !== currentQuestion.correctAnswer ? 'incorrect' : ''
              }`}
              onClick={() => handleAnswerSelect(choice)}
              disabled={showResult}
            >
              <span className="choice-number">{index + 1}</span>
              <span className="choice-text">
                {choice}
              </span>
              {showResult && choice === currentQuestion.correctAnswer && (
                <span className="choice-icon">✓</span>
              )}
              {showResult && choice === selectedAnswer && choice !== currentQuestion.correctAnswer && (
                <span className="choice-icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result-section">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="result-message success">
                <span className="result-icon">🎉</span>
                정답입니다!
              </p>
            ) : (
              <p className="result-message error">
                <span className="result-icon">❌</span>
                틀렸습니다. 정답은 "{currentQuestion.correctAnswer}" 입니다.
              </p>
            )}
            
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleNext}
            >
              {currentQuestionIndex === questions.length - 1 ? '결과 보기' : '다음 문제 →'}
            </button>
          </div>
        )}

        {currentQuestion.type === 'kanji-to-korean' && !showResult && (
          <div className="audio-hint">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={async () => {
                try {
                  await speakJapanese(currentQuestion.word.hiragana);
                } catch (error) {
                  console.warn('음성 재생에 실패했습니다:', error);
                }
              }}
            >
              🔊 발음 듣기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestMode;
