import { useState, useEffect, useCallback } from 'react';
import './App.css';

// 타입 정의
interface VocabWord {
  id: number;
  kanji: string;
  korean: string;
  hiragana: string;
}

interface WeekData {
  week: number;
  totalWords: number;
  words: VocabWord[];
}

interface WrongAnswer {
  word: VocabWord;
  userAnswer: string;
  correctAnswer: string;
  week: number;
  timestamp: number;
}

// 음성 재생 함수
const speakJapanese = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

// 간단한 테마 토글 컴포넌트
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    } else if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      setIsDark(false);
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
        setIsDark(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="btn btn-secondary btn-sm"
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

// 헤더 컴포넌트
const Header = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <a href="#home" onClick={() => setActiveTab('home')}>🇯🇵 JapanGo</a>
        </h1>
        
        <div className="header-actions">
          <ThemeToggle />
          
          <nav className="app-nav">
            <ul>
              <li>
                <a 
                  href="#weeks" 
                  className={`nav-link ${activeTab === 'weeks' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('weeks');
                  }}
                >
                  주차별 학습
                </a>
              </li>
              <li>
                <a 
                  href="#wrong-answers" 
                  className={`nav-link ${activeTab === 'wrong-answers' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('wrong-answers');
                  }}
                >
                  틀린 문제
                </a>
              </li>
              <li>
                <a 
                  href="#stats" 
                  className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('stats');
                  }}
                >
                  내 통계
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

// 푸터 컴포넌트
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="copyright">© {currentYear} JapanGo - JLPT 일본어 단어 학습</p>
        <p className="footer-note">
          주차별 체계적 학습 시스템으로 일본어 마스터하기
        </p>
      </div>
    </footer>
  );
};

// localStorage 유틸리티 함수들
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save error:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Storage load error:', error);
    return defaultValue;
  }
};

// 주차 데이터 로드 함수
const loadWeekData = async (week: number): Promise<WeekData | null> => {
  try {
    const response = await fetch(`/vocabulary/week${week}.json`);
    if (!response.ok) throw new Error(`Week ${week} not found`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading week ${week}:`, error);
    return null;
  }
};

// 틀린 답안 저장 함수
const saveWrongAnswer = (word: VocabWord, userAnswer: string, correctAnswer: string, week: number) => {
  const wrongAnswers = loadFromStorage('wrong_answers', []);
  const wrongAnswer: WrongAnswer = {
    word,
    userAnswer,
    correctAnswer,
    week,
    timestamp: Date.now()
  };
  
  // 중복 제거 (같은 단어의 기존 틀린 답안 제거)
  const filteredAnswers = wrongAnswers.filter((ans: WrongAnswer) => 
    ans.word.id !== word.id || ans.week !== week
  );
  
  const updatedAnswers = [wrongAnswer, ...filteredAnswers].slice(0, 200); // 최대 200개
  saveToStorage('wrong_answers', updatedAnswers);
};

// 틀린 답안 제거 함수
const removeWrongAnswer = (wordId: number, week: number) => {
  const wrongAnswers = loadFromStorage('wrong_answers', []);
  const filteredAnswers = wrongAnswers.filter((ans: WrongAnswer) => 
    !(ans.word.id === wordId && ans.week === week)
  );
  saveToStorage('wrong_answers', filteredAnswers);
};

// 홈 화면 컴포넌트
const HomePage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  
  useEffect(() => {
    // 사용 가능한 주차 확인
    const checkAvailableWeeks = async () => {
      const weeks = [];
      let totalCount = 0;
      
      for (let i = 1; i <= 10; i++) { // 최대 10주차까지 확인
        const data = await loadWeekData(i);
        if (data) {
          weeks.push(i);
          totalCount += data.totalWords;
        }
      }
      
      setAvailableWeeks(weeks);
      setTotalWords(totalCount);
      
      // 틀린 답안 개수 확인
      const wrongAnswers = loadFromStorage('wrong_answers', []);
      setWrongAnswersCount(wrongAnswers.length);
    };
    
    checkAvailableWeeks();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* 웰컴 섹션 */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="card text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            🇯🇵 JapanGo에 오신 것을 환영합니다!
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            주차별 체계적 일본어 단어 학습 플랫폼
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
              <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>{availableWeeks.length}주차</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>학습 가능한 주차</p>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
              <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{totalWords}개</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>총 단어 수</p>
            </div>
            {wrongAnswersCount > 0 && (
              <div className="card" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{wrongAnswersCount}개</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>틀린 문제</p>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('weeks')}
            >
              🚀 주차별 학습 시작
            </button>
            {wrongAnswersCount > 0 && (
              <button 
                className="btn btn-outline btn-lg"
                onClick={() => setActiveTab('wrong-answers')}
              >
                🔄 틀린 문제 복습
              </button>
            )}
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => setActiveTab('stats')}
            >
              📊 내 통계 보기
            </button>
          </div>
        </div>
      </div>

      {/* 학습 방법 안내 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="text-center" style={{ marginBottom: '2rem' }}>향상된 학습 기능</h2>
        <div className="grid grid-3">
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔊</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>음성 재생</h3>
            <p style={{ marginBottom: '0', color: 'var(--text-secondary)' }}>
              일본어 단어의 정확한 발음을 들어보세요
            </p>
          </div>

          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>카드 학습</h3>
            <p style={{ marginBottom: '0', color: 'var(--text-secondary)' }}>
              뒤집기, 힌트 보기 등 다양한 학습 모드
            </p>
          </div>

          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: 'var(--info)', marginBottom: '1rem' }}>다양한 테스트</h3>
            <p style={{ marginBottom: '0', color: 'var(--text-secondary)' }}>
              한자→뜻, 뜻→한자, 읽기→뜻 등 다양한 문제 유형
            </p>
          </div>
        </div>
      </div>

      {/* 사용 가능한 주차 미리보기 */}
      {availableWeeks.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="text-center" style={{ marginBottom: '2rem' }}>사용 가능한 주차</h2>
          <div className="grid grid-4">
            {availableWeeks.map(week => (
              <div key={week} className="card text-center" style={{ cursor: 'pointer' }}
                   onClick={() => setActiveTab(`week-${week}`)}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{week}주차</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  90개 단어
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 주차별 학습 선택 화면
const WeekSelectionPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);
  const [weekProgress, setWeekProgress] = useState<Record<number, { study: number; testScore: number }>>({});
  
  useEffect(() => {
    const checkAvailableWeeks = async () => {
      const weeks = [];
      const progress: Record<number, { study: number; testScore: number }> = {};
      
      for (let i = 1; i <= 10; i++) {
        const data = await loadWeekData(i);
        if (data) {
          weeks.push(i);
          progress[i] = {
            study: loadFromStorage(`study_progress_week${i}`, 0),
            testScore: loadFromStorage(`test_best_score_week${i}`, 0)
          };
        }
      }
      
      setAvailableWeeks(weeks);
      setWeekProgress(progress);
    };
    
    checkAvailableWeeks();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="text-center" style={{ marginBottom: '3rem' }}>📚 주차별 학습</h1>
      
      <div className="grid grid-2">
        {availableWeeks.map(week => {
          const progress = weekProgress[week] || { study: 0, testScore: 0 };
          const studyProgress = Math.round((progress.study / 90) * 100);
          
          return (
            <div key={week} className="card">
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{week}주차</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>90개 단어</p>
              
              {/* 진행률 표시 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>학습 진행률</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{studyProgress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${studyProgress}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              
              {/* 최고 점수 */}
              {progress.testScore > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                    최고 테스트 점수: <strong style={{ color: 'var(--success)' }}>{progress.testScore}%</strong>
                  </p>
                </div>
              )}
              
              {/* 버튼들 */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveTab(`study-week-${week}`)}
                  style={{ flex: 1 }}
                >
                  📚 암기 모드
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setActiveTab(`test-week-${week}`)}
                  style={{ flex: 1 }}
                >
                  📝 테스트 모드
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 틀린 문제 복습 화면
const WrongAnswersPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [groupedAnswers, setGroupedAnswers] = useState<Record<number, WrongAnswer[]>>({});
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
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
  }, []);

  const handleCorrectAnswer = (wordId: number, week: number) => {
    removeWrongAnswer(wordId, week);
    // 상태 업데이트
    const answers = loadFromStorage('wrong_answers', []);
    setWrongAnswers(answers);
    
    const grouped = answers.reduce((acc: Record<number, WrongAnswer[]>, answer: WrongAnswer) => {
      if (!acc[answer.week]) {
        acc[answer.week] = [];
      }
      acc[answer.week].push(answer);
      return acc;
    }, {});
    setGroupedAnswers(grouped);
  };

  if (wrongAnswers.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎉</div>
        <h1 style={{ color: 'var(--success)', marginBottom: '2rem' }}>완벽합니다!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          현재 틀린 문제가 없습니다. 계속 학습하여 실력을 유지하세요!
        </p>
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => setActiveTab('weeks')}
        >
          주차별 학습으로 돌아가기
        </button>
      </div>
    );
  }

  if (selectedWeek !== null) {
    return (
      <WrongAnswerStudy 
        week={selectedWeek} 
        wrongAnswers={groupedAnswers[selectedWeek] || []}
        onBack={() => setSelectedWeek(null)}
        onCorrectAnswer={handleCorrectAnswer}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="text-center" style={{ marginBottom: '3rem' }}>🔄 틀린 문제 복습</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <div className="card text-center">
          <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>총 {wrongAnswers.length}개의 틀린 문제</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            주차별로 정리된 틀린 문제들을 다시 학습해보세요.
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        {Object.entries(groupedAnswers).map(([week, answers]) => (
          <div key={week} className="card" style={{ cursor: 'pointer' }}
               onClick={() => setSelectedWeek(parseInt(week))}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{week}주차</h3>
            <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {answers.length}개 문제
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              {answers.slice(0, 3).map((answer, index) => (
                <p key={index} style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)', 
                  margin: '0.2rem 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {answer.word.kanji} - {answer.word.korean}
                </p>
              ))}
              {answers.length > 3 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                  ...그 외 {answers.length - 3}개
                </p>
              )}
            </div>
            <button className="btn btn-outline w-full">복습하기</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 틀린 문제 학습 컴포넌트
const WrongAnswerStudy = ({ 
  week, 
  wrongAnswers, 
  onBack, 
  onCorrectAnswer 
}: { 
  week: number; 
  wrongAnswers: WrongAnswer[]; 
  onBack: () => void;
  onCorrectAnswer: (wordId: number, week: number) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'card' | 'quiz'>('card');
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const currentWrongAnswer = wrongAnswers[currentIndex];

  useEffect(() => {
    if (studyMode === 'quiz') {
      generateQuizChoices();
    }
    setShowAnswer(false);
    setSelectedAnswer('');
    setShowResult(false);
  }, [currentIndex, studyMode]);

  const generateQuizChoices = () => {
    const correctAnswer = currentWrongAnswer.word.korean;
    // 다른 틀린 답안들에서 오답 생성
    const otherAnswers = wrongAnswers
      .filter(ans => ans.word.korean !== correctAnswer)
      .map(ans => ans.word.korean);
    
    // 부족하면 무작위 답안 추가 (간단한 예시)
    const wrongChoices = otherAnswers.slice(0, 3);
    while (wrongChoices.length < 3) {
      wrongChoices.push(`오답 ${wrongChoices.length + 1}`);
    }
    
    const allChoices = [correctAnswer, ...wrongChoices].sort(() => Math.random() - 0.5);
    setQuizChoices(allChoices);
  };

  const handleNext = () => {
    if (currentIndex < wrongAnswers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // 순환
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(wrongAnswers.length - 1); // 순환
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentWrongAnswer.word.korean) {
      // 정답을 맞췄으므로 틀린 문제 목록에서 제거
      setTimeout(() => {
        onCorrectAnswer(currentWrongAnswer.word.id, week);
      }, 1500);
    }
  };

  const handleMarkAsLearned = () => {
    onCorrectAnswer(currentWrongAnswer.word.id, week);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <button 
        className="btn btn-outline"
        onClick={onBack}
        style={{ marginBottom: '1rem' }}
      >
        ← 틀린 문제 목록으로
      </button>
      
      <h1 className="text-center" style={{ marginBottom: '2rem' }}>
        🔄 {week}주차 틀린 문제 복습
      </h1>

      {/* 모드 선택 */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button 
          className={`btn ${studyMode === 'card' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStudyMode('card')}
        >
          🃏 카드 모드
        </button>
        <button 
          className={`btn ${studyMode === 'quiz' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStudyMode('quiz')}
        >
          📝 퀴즈 모드
        </button>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        {/* 진행률 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {currentIndex + 1} / {wrongAnswers.length}
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentIndex + 1) / wrongAnswers.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--error)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* 틀린 답안 정보 */}
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--error)', margin: '0 0 0.5rem 0' }}>
            이전 답안: "{currentWrongAnswer.userAnswer}" → 정답: "{currentWrongAnswer.correctAnswer}"
          </p>
        </div>

        {studyMode === 'card' ? (
          <>
            {/* 카드 모드 */}
            <div style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP, serif',
              color: 'var(--text-primary)'
            }}>
              {currentWrongAnswer.word.kanji}
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => speakJapanese(currentWrongAnswer.word.hiragana)}
              style={{ marginBottom: '2rem' }}
            >
              🔊 발음 듣기
            </button>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button 
                className={`btn ${showAnswer ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowAnswer(!showAnswer)}
              >
                답안 {showAnswer ? '숨기기' : '보기'}
              </button>
            </div>

            {showAnswer && (
              <div className="scale-in" style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--primary)', 
                  marginBottom: '1rem',
                  fontFamily: 'Noto Sans JP'
                }}>
                  {currentWrongAnswer.word.hiragana}
                </div>
                <div style={{ 
                  fontSize: '1.3rem', 
                  color: 'var(--text-primary)', 
                  marginBottom: '1rem'
                }}>
                  {currentWrongAnswer.word.korean}
                </div>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={handleMarkAsLearned}
                >
                  ✅ 학습 완료로 표시
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 퀴즈 모드 */}
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP, serif',
              color: 'var(--text-primary)'
            }}>
              {currentWrongAnswer.word.kanji}
            </div>
            
            <div style={{ 
              fontSize: '1.2rem', 
              color: 'var(--primary)', 
              marginBottom: '2rem',
              fontFamily: 'Noto Sans JP'
            }}>
              {currentWrongAnswer.word.hiragana}
            </div>

            <h3 style={{ marginBottom: '2rem' }}>이 단어의 뜻은 무엇인가요?</h3>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {quizChoices.map((choice, index) => (
                <button
                  key={index}
                  className={`btn ${
                    !showResult 
                      ? 'btn-outline'
                      : choice === currentWrongAnswer.word.korean
                        ? 'btn-primary'
                        : selectedAnswer === choice
                          ? 'btn-secondary'
                          : 'btn-outline'
                  }`}
                  style={{
                    padding: '1rem',
                    fontSize: '1.1rem',
                    backgroundColor: showResult && choice === currentWrongAnswer.word.korean 
                      ? 'var(--success)' 
                      : showResult && selectedAnswer === choice && choice !== currentWrongAnswer.word.korean
                        ? 'var(--error)'
                        : undefined,
                    color: showResult && (choice === currentWrongAnswer.word.korean || selectedAnswer === choice) 
                      ? 'white' 
                      : undefined
                  }}
                  onClick={() => handleQuizAnswer(choice)}
                  disabled={showResult}
                >
                  {choice}
                  {showResult && choice === currentWrongAnswer.word.korean && ' ✓'}
                  {showResult && selectedAnswer === choice && choice !== currentWrongAnswer.word.korean && ' ✗'}
                </button>
              ))}
            </div>

            {showResult && (
              <div style={{ marginBottom: '2rem' }}>
                {selectedAnswer === currentWrongAnswer.word.korean ? (
                  <p style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
                    🎉 정답입니다! 틀린 문제 목록에서 제거됩니다.
                  </p>
                ) : (
                  <p style={{ color: 'var(--error)', fontSize: '1.2rem' }}>
                    ❌ 틀렸습니다. 다시 복습해보세요.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* 네비게이션 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={handlePrev}>
            ← 이전
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

// 향상된 암기 모드 (기존 코드에 음성 재생과 카드 뒤집기 추가)
const WeekStudyMode = ({ week, setActiveTab }: { week: number; setActiveTab: (tab: string) => void }) => {
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showReading, setShowReading] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [studiedToday, setStudiedToday] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      const data = await loadWeekData(week);
      if (data) {
        setWeekData(data);
        const savedProgress = loadFromStorage(`study_progress_week${week}`, 0);
        setCurrentWordIndex(savedProgress);
        setStudiedToday(loadFromStorage(`studied_today_week${week}`, 0));
      }
    };
    
    loadData();
  }, [week]);

  useEffect(() => {
    if (weekData) {
      saveToStorage(`study_progress_week${week}`, currentWordIndex);
    }
  }, [currentWordIndex, week, weekData]);

  useEffect(() => {
    saveToStorage(`studied_today_week${week}`, studiedToday);
  }, [studiedToday, week]);

  useEffect(() => {
    if (isAutoPlay && weekData) {
      const interval = setInterval(() => {
        nextWord();
      }, 4000); // 음성 재생 시간 고려하여 4초로 증가
      
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, weekData]);

  const nextWord = () => {
    if (!weekData) return;
    setCurrentWordIndex((prev) => (prev + 1) % weekData.words.length);
    resetCardState();
    setStudiedToday(prev => prev + 1);
  };

  const prevWord = () => {
    if (!weekData) return;
    setCurrentWordIndex((prev) => (prev - 1 + weekData.words.length) % weekData.words.length);
    resetCardState();
  };

  const resetCardState = () => {
    setShowReading(false);
    setShowMeaning(false);
    setCardFlipped(false);
    setShowHint(false);
  };

  const handleCardFlip = () => {
    setCardFlipped(!cardFlipped);
    if (!cardFlipped) {
      setShowReading(true);
      setShowMeaning(true);
    } else {
      setShowReading(false);
      setShowMeaning(false);
    }
  };

  if (!weekData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>단어장을 불러오는 중...</p>
      </div>
    );
  }

  const currentWord = weekData.words[currentWordIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <button 
        className="btn btn-outline"
        onClick={() => setActiveTab('weeks')}
        style={{ marginBottom: '1rem' }}
      >
        ← 주차 선택으로 돌아가기
      </button>
      
      <h1 className="text-center" style={{ marginBottom: '2rem' }}>📚 {week}주차 암기 모드</h1>
      
      <div className="card" style={{ textAlign: 'center' }}>
        {/* 진행률 표시 */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentWordIndex + 1) / weekData.words.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {currentWordIndex + 1} / {weekData.words.length} | 오늘: {studiedToday}개
          </p>
        </div>

        {/* 카드 영역 */}
        <div 
          className="word-card"
          style={{
            minHeight: '300px',
            padding: '2rem',
            backgroundColor: cardFlipped ? 'var(--primary-light)' : 'transparent',
            borderRadius: 'var(--radius-xl)',
            border: cardFlipped ? '2px solid var(--primary)' : '2px dashed var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '2rem'
          }}
          onClick={handleCardFlip}
        >
          {/* 한자 표시 */}
          <div style={{ 
            fontSize: '5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            fontFamily: 'Noto Sans JP, serif',
            color: 'var(--text-primary)'
          }}>
            {currentWord.kanji}
          </div>

          {cardFlipped ? (
            <div className="scale-in">
              <div style={{ 
                fontSize: '2rem', 
                color: 'var(--primary)', 
                marginBottom: '1rem',
                fontFamily: 'Noto Sans JP'
              }}>
                {currentWord.hiragana}
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                color: 'var(--text-primary)', 
                marginBottom: '1rem'
              }}>
                {currentWord.korean}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              카드를 클릭하여 뒤집어보세요
            </p>
          )}
        </div>

        {/* 음성 재생 버튼 */}
        <button 
          className="btn btn-secondary"
          onClick={() => speakJapanese(currentWord.hiragana)}
          style={{ marginBottom: '2rem' }}
        >
          🔊 발음 듣기
        </button>

        {/* 컨트롤 버튼들 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${showReading ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowReading(!showReading)}
          >
            🗣️ 읽기 {showReading ? '숨기기' : '보기'}
          </button>
          <button 
            className={`btn ${showMeaning ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMeaning(!showMeaning)}
          >
            💭 의미 {showMeaning ? '숨기기' : '보기'}
          </button>
          <button 
            className={`btn ${showHint ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowHint(!showHint)}
          >
            💡 힌트 {showHint ? '숨기기' : '보기'}
          </button>
          <button 
            className={`btn ${isAutoPlay ? 'btn-outline' : 'btn-secondary'}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            style={{ backgroundColor: isAutoPlay ? 'var(--warning)' : undefined }}
          >
            {isAutoPlay ? '⏸️ 정지' : '▶️ 자동재생'}
          </button>
        </div>

        {/* 정보 표시 영역 */}
        <div style={{ minHeight: '100px', marginBottom: '2rem' }}>
          {showReading && !cardFlipped && (
            <div className="scale-in" style={{ 
              fontSize: '2rem', 
              color: 'var(--primary)', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP'
            }}>
              {currentWord.hiragana}
            </div>
          )}

          {showMeaning && !cardFlipped && (
            <div className="scale-in" style={{ 
              fontSize: '1.5rem', 
              color: 'var(--text-primary)', 
              marginBottom: '1rem'
            }}>
              {currentWord.korean}
            </div>
          )}

          {showHint && (
            <div className="scale-in" style={{
              padding: '1rem',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--warning)',
              color: 'var(--warning)',
              fontSize: '0.9rem'
            }}>
              💡 힌트: "{currentWord.korean.slice(0, 1)}..."로 시작하는 단어입니다
            </div>
          )}
        </div>

        {/* 네비게이션 버튼 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline btn-lg" onClick={prevWord}>
            ← 이전
          </button>
          <button className="btn btn-primary btn-lg" onClick={nextWord}>
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

// 향상된 테스트 모드 (다양한 문제 유형 추가)
const WeekTestMode = ({ week, setActiveTab }: { week: number; setActiveTab: (tab: string) => void }) => {
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<VocabWord[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [questionType, setQuestionType] = useState<'kanji-to-korean' | 'korean-to-kanji' | 'reading-to-korean'>('kanji-to-korean');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['kanji-to-korean', 'korean-to-kanji', 'reading-to-korean']);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadWeekData(week);
      if (data) {
        setWeekData(data);
        startNewTest(data);
      }
    };
    
    loadData();
  }, [week]);

  const startNewTest = (data: WeekData) => {
    // 단어 순서 섞기
    const shuffled = [...data.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions(0);
    generateQuestion(shuffled, 0);
  };

  const generateQuestion = (words: VocabWord[], index: number) => {
    if (words.length === 0) return;
    
    // 문제 유형 랜덤 선택
    const randomType = selectedQuestionTypes[Math.floor(Math.random() * selectedQuestionTypes.length)] as typeof questionType;
    setQuestionType(randomType);
    
    const currentWord = words[index];
    let correctAnswer = '';
    let wrongAnswerPool: string[] = [];
    
    switch (randomType) {
      case 'kanji-to-korean':
        correctAnswer = currentWord.korean;
        wrongAnswerPool = words.filter(w => w.korean !== correctAnswer).map(w => w.korean);
        break;
      case 'korean-to-kanji':
        correctAnswer = currentWord.kanji;
        wrongAnswerPool = words.filter(w => w.kanji !== correctAnswer).map(w => w.kanji);
        break;
      case 'reading-to-korean':
        correctAnswer = currentWord.korean;
        wrongAnswerPool = words.filter(w => w.korean !== correctAnswer).map(w => w.korean);
        break;
    }
    
    const wrongAnswers = wrongAnswerPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allChoices = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setChoices(allChoices);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const getQuestionText = () => {
    const currentWord = shuffledWords[currentQuestionIndex];
    switch (questionType) {
      case 'kanji-to-korean':
        return {
          question: currentWord.kanji,
          subtext: currentWord.hiragana,
          prompt: '이 단어의 뜻은 무엇인가요?'
        };
      case 'korean-to-kanji':
        return {
          question: currentWord.korean,
          subtext: currentWord.hiragana,
          prompt: '이 뜻의 한자는 무엇인가요?'
        };
      case 'reading-to-korean':
        return {
          question: currentWord.hiragana,
          subtext: '',
          prompt: '이 읽기의 뜻은 무엇인가요?'
        };
      default:
        return { question: '', subtext: '', prompt: '' };
    }
  };

  const getCorrectAnswer = () => {
    const currentWord = shuffledWords[currentQuestionIndex];
    switch (questionType) {
      case 'kanji-to-korean':
      case 'reading-to-korean':
        return currentWord.korean;
      case 'korean-to-kanji':
        return currentWord.kanji;
      default:
        return '';
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(prev => prev + 1);
    
    const correctAnswer = getCorrectAnswer();
    if (answer === correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      // 틀린 답안 저장
      saveWrongAnswer(shuffledWords[currentQuestionIndex], answer, correctAnswer, week);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledWords.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      generateQuestion(shuffledWords, nextIndex);
    }
  };

  const resetTest = () => {
    if (weekData) {
      startNewTest(weekData);
    }
  };

  // 테스트 결과 저장
  const saveTestResult = (finalScore: number, totalQuestions: number) => {
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const bestScore = loadFromStorage(`test_best_score_week${week}`, 0);
    
    if (percentage > bestScore) {
      saveToStorage(`test_best_score_week${week}`, percentage);
    }
    
    const results = loadFromStorage(`test_results_week${week}`, []);
    const newResult = {
      date: new Date().toISOString().split('T')[0],
      score: finalScore,
      total: totalQuestions,
      percentage,
      questionTypes: selectedQuestionTypes
    };
    
    const updatedResults = [newResult, ...results].slice(0, 5);
    saveToStorage(`test_results_week${week}`, updatedResults);
  };

  if (!weekData || shuffledWords.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>테스트를 준비하는 중...</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === getCorrectAnswer();
  const isTestCompleted = answeredQuestions > 0 && currentQuestionIndex === shuffledWords.length - 1 && showResult;

  if (isTestCompleted) {
    const percentage = Math.round((score / answeredQuestions) * 100);
    saveTestResult(score, answeredQuestions);

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 뒤로가기 버튼 */}
        <button 
          className="btn btn-outline"
          onClick={() => setActiveTab('weeks')}
          style={{ marginBottom: '1rem' }}
        >
          ← 주차 선택으로 돌아가기
        </button>
        
        <div className="card text-center">
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😅'}
          </div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{week}주차 테스트 완료!</h1>
          
          <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            {score} / {answeredQuestions}
          </div>
          <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
            정답률: {percentage}%
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            {percentage >= 80 && <p style={{ color: 'var(--success)' }}>🌟 훌륭해요! {week}주차를 완전히 마스터했습니다!</p>}
            {percentage >= 60 && percentage < 80 && <p style={{ color: 'var(--warning)' }}>👍 잘했어요! 조금만 더 연습하면 완벽해질 거예요!</p>}
            {percentage < 60 && <p style={{ color: 'var(--error)' }}>💪 더 연습이 필요해요! {week}주차 암기 모드에서 복습해보세요!</p>}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={resetTest}>
              🔄 다시 테스트
            </button>
            <button 
              className="btn btn-outline btn-lg" 
              onClick={() => setActiveTab(`study-week-${week}`)}
            >
              📚 암기 모드로
            </button>
            <button 
              className="btn btn-secondary btn-lg" 
              onClick={() => setActiveTab('weeks')}
            >
              📋 주차 선택으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionData = getQuestionText();

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <button 
        className="btn btn-outline"
        onClick={() => setActiveTab('weeks')}
        style={{ marginBottom: '1rem' }}
      >
        ← 주차 선택으로 돌아가기
      </button>
      
      <h1 className="text-center" style={{ marginBottom: '2rem' }}>📝 {week}주차 테스트 모드</h1>

      {/* 문제 유형 선택 */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>문제 유형 선택</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={selectedQuestionTypes.includes('kanji-to-korean')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedQuestionTypes(prev => [...prev, 'kanji-to-korean']);
                } else {
                  setSelectedQuestionTypes(prev => prev.filter(t => t !== 'kanji-to-korean'));
                }
              }}
            />
            한자→뜻
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={selectedQuestionTypes.includes('korean-to-kanji')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedQuestionTypes(prev => [...prev, 'korean-to-kanji']);
                } else {
                  setSelectedQuestionTypes(prev => prev.filter(t => t !== 'korean-to-kanji'));
                }
              }}
            />
            뜻→한자
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={selectedQuestionTypes.includes('reading-to-korean')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedQuestionTypes(prev => [...prev, 'reading-to-korean']);
                } else {
                  setSelectedQuestionTypes(prev => prev.filter(t => t !== 'reading-to-korean'));
                }
              }}
            />
            읽기→뜻
          </label>
        </div>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        {/* 점수 및 진행률 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>점수: {score} / {answeredQuestions}</div>
          <div>문제: {currentQuestionIndex + 1} / {shuffledWords.length}</div>
        </div>

        {/* 현재 문제 유형 표시 */}
        <div style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--info)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.8rem',
          marginBottom: '2rem'
        }}>
          {questionType === 'kanji-to-korean' && '한자 → 뜻'}
          {questionType === 'korean-to-kanji' && '뜻 → 한자'}
          {questionType === 'reading-to-korean' && '읽기 → 뜻'}
        </div>

        {/* 진행률 바 */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentQuestionIndex + 1) / shuffledWords.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* 문제 */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: questionType === 'korean-to-kanji' ? '2.5rem' : '4rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            fontFamily: questionType === 'korean-to-kanji' ? 'inherit' : 'Noto Sans JP, serif',
            color: 'var(--text-primary)'
          }}>
            {questionData.question}
          </div>
          {questionData.subtext && (
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'var(--primary)', 
              marginBottom: '2rem',
              fontFamily: 'Noto Sans JP'
            }}>
              {questionData.subtext}
            </div>
          )}
          <h3>{questionData.prompt}</h3>
        </div>

        {/* 선택지 */}
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {choices.map((choice, index) => (
            <button
              key={index}
              className={`btn ${
                !showResult 
                  ? 'btn-outline'
                  : choice === getCorrectAnswer()
                    ? 'btn-primary'
                    : selectedAnswer === choice
                      ? 'btn-secondary'
                      : 'btn-outline'
              }`}
              style={{
                padding: '1rem',
                fontSize: '1.1rem',
                fontFamily: questionType === 'korean-to-kanji' ? 'Noto Sans JP, serif' : 'inherit',
                backgroundColor: showResult && choice === getCorrectAnswer() 
                  ? 'var(--success)' 
                  : showResult && selectedAnswer === choice && choice !== getCorrectAnswer()
                    ? 'var(--error)'
                    : undefined,
                color: showResult && (choice === getCorrectAnswer() || selectedAnswer === choice) 
                  ? 'white' 
                  : undefined
              }}
              onClick={() => handleAnswerSelect(choice)}
              disabled={showResult}
            >
              {choice}
              {showResult && choice === getCorrectAnswer() && ' ✓'}
              {showResult && selectedAnswer === choice && choice !== getCorrectAnswer() && ' ✗'}
            </button>
          ))}
        </div>

        {/* 결과 표시 */}
        {showResult && (
          <div style={{ marginBottom: '2rem' }}>
            {isCorrect ? (
              <p style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
                🎉 정답입니다!
              </p>
            ) : (
              <p style={{ color: 'var(--error)', fontSize: '1.2rem' }}>
                ❌ 틀렸습니다. 정답은 "{getCorrectAnswer()}" 입니다.
              </p>
            )}
          </div>
        )}

        {/* 다음 버튼 */}
        {showResult && (
          <button 
            className="btn btn-primary btn-lg" 
            onClick={nextQuestion}
            disabled={currentQuestionIndex === shuffledWords.length - 1}
          >
            {currentQuestionIndex === shuffledWords.length - 1 ? '테스트 완료' : '다음 문제 →'}
          </button>
        )}
      </div>
    </div>
  );
};

// 통계 페이지 컴포넌트 (기존과 동일)
const StatsPage = () => {
  const [weekStats, setWeekStats] = useState<Record<number, any>>({});
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const weeks = [];
      const stats: Record<number, any> = {};
      
      for (let i = 1; i <= 10; i++) {
        const data = await loadWeekData(i);
        if (data) {
          weeks.push(i);
          stats[i] = {
            studyProgress: loadFromStorage(`study_progress_week${i}`, 0),
            studiedToday: loadFromStorage(`studied_today_week${i}`, 0),
            bestScore: loadFromStorage(`test_best_score_week${i}`, 0),
            testResults: loadFromStorage(`test_results_week${i}`, [])
          };
        }
      }
      
      setAvailableWeeks(weeks);
      setWeekStats(stats);
      
      // 틀린 답안 개수
      const wrongAnswers = loadFromStorage('wrong_answers', []);
      setWrongAnswersCount(wrongAnswers.length);
    };
    
    loadStats();
  }, []);

  const totalStudied = availableWeeks.reduce((sum, week) => {
    return sum + (weekStats[week]?.studiedToday || 0);
  }, 0);

  const averageScore = availableWeeks.length > 0 
    ? Math.round(availableWeeks.reduce((sum, week) => {
        return sum + (weekStats[week]?.bestScore || 0);
      }, 0) / availableWeeks.length)
    : 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="text-center" style={{ marginBottom: '3rem' }}>📊 내 통계</h1>

      {/* 전체 통계 */}
      <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
        <div className="card text-center">
          <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            {totalStudied}
          </div>
          <h3>오늘 학습한 단어</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            전체 주차 합계
          </p>
        </div>

        <div className="card text-center">
          <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }}>
            {averageScore}%
          </div>
          <h3>평균 최고 점수</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {availableWeeks.length}개 주차 평균
          </p>
        </div>

        <div className="card text-center">
          <div style={{ fontSize: '3rem', color: 'var(--info)', marginBottom: '1rem' }}>
            {availableWeeks.length}
          </div>
          <h3>사용 가능한 주차</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            총 {availableWeeks.length * 90}개 단어
          </p>
        </div>

        <div className="card text-center">
          <div style={{ fontSize: '3rem', color: 'var(--error)', marginBottom: '1rem' }}>
            {wrongAnswersCount}
          </div>
          <h3>틀린 문제</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            복습이 필요한 단어
          </p>
        </div>
      </div>

      {/* 주차별 통계 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>주차별 상세 통계</h2>
        <div className="grid grid-2">
          {availableWeeks.map(week => {
            const stats = weekStats[week] || {};
            const studyProgress = Math.round((stats.studyProgress / 90) * 100);
            
            return (
              <div key={week} className="card">
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{week}주차</h3>
                
                {/* 학습 진행률 */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>학습 진행률</span>
                    <span>{studyProgress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${studyProgress}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                {/* 통계 정보 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                      {stats.bestScore || 0}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>최고 점수</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--info)' }}>
                      {stats.studiedToday || 0}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>오늘 학습</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 데이터 리셋 */}
      <div className="card text-center">
        <h3 style={{ marginBottom: '1rem' }}>데이터 관리</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          모든 학습 데이터를 초기화하려면 아래 버튼을 클릭하세요.
        </p>
        <button 
          className="btn btn-outline"
          onClick={() => {
            if (confirm('정말로 모든 데이터를 삭제하시겠습니까?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          🗑️ 데이터 초기화
        </button>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    if (activeTab.startsWith('study-week-')) {
      const week = parseInt(activeTab.replace('study-week-', ''));
      return <WeekStudyMode week={week} setActiveTab={setActiveTab} />;
    }
    
    if (activeTab.startsWith('test-week-')) {
      const week = parseInt(activeTab.replace('test-week-', ''));
      return <WeekTestMode week={week} setActiveTab={setActiveTab} />;
    }
    
    switch (activeTab) {
      case 'weeks':
        return <WeekSelectionPage setActiveTab={setActiveTab} />;
      case 'wrong-answers':
        return <WrongAnswersPage setActiveTab={setActiveTab} />;
      case 'stats':
        return <StatsPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;