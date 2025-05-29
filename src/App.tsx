import { useState, useEffect } from 'react';
import './App.css';

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
      className="btn btn-secondary"
      style={{ padding: '8px' }}
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
                  href="#study" 
                  className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('study');
                  }}
                >
                  암기 모드
                </a>
              </li>
              <li>
                <a 
                  href="#test" 
                  className={`nav-link ${activeTab === 'test' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('test');
                  }}
                >
                  테스트 모드
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
          학습 목적으로 개발된 애플리케이션입니다.
        </p>
      </div>
    </footer>
  );
};

// 샘플 단어 데이터
const sampleWords = [
  { kanji: '幼い', reading: 'おさない', meaning: '어리다', level: 'N3' },
  { kanji: '美しい', reading: 'うつくしい', meaning: '아름답다', level: 'N4' },
  { kanji: '強い', reading: 'つよい', meaning: '강하다', level: 'N5' },
  { kanji: '新しい', reading: 'あたらしい', meaning: '새롭다', level: 'N5' },
  { kanji: '難しい', reading: 'むずかしい', meaning: '어렵다', level: 'N5' },
  { kanji: '楽しい', reading: 'たのしい', meaning: '즐겁다', level: 'N5' },
  { kanji: '大きい', reading: 'おおきい', meaning: '크다', level: 'N5' },
  { kanji: '小さい', reading: 'ちいさい', meaning: '작다', level: 'N5' },
  { kanji: '古い', reading: 'ふるい', meaning: '오래되다', level: 'N5' },
  { kanji: '若い', reading: 'わかい', meaning: '젊다', level: 'N4' }
];

// 홈 화면 컴포넌트
const HomePage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showReading, setShowReading] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  const currentWord = sampleWords[currentWordIndex];

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % sampleWords.length);
    setShowReading(false);
    setShowMeaning(false);
  };

  const prevWord = () => {
    setCurrentWordIndex((prev) => (prev - 1 + sampleWords.length) % sampleWords.length);
    setShowReading(false);
    setShowMeaning(false);
  };

  return (
    <div className="container">
      {/* 웰컴 섹션 */}
      <div className="section slide-up">
        <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            🇯🇵 JapanGo에 오신 것을 환영합니다!
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--font-color-muted)', marginBottom: '2rem' }}>
            JLPT 일본어 단어 학습을 위한 전문 플랫폼
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('study')}
            >
              🚀 학습 시작하기
            </button>
            <button className="btn btn-outline btn-lg">
              📊 내 통계 보기
            </button>
          </div>
        </div>
      </div>

      {/* 학습 모드 카드들 - 2개만 */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>학습 모드</h2>
        <div className="grid grid-2">
          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>암기 모드</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              단어카드를 보며 천천히 학습하세요. 자신의 속도에 맞춰 반복 학습이 가능합니다.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('study')}
            >
              시작하기
            </button>
          </div>

          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>테스트 모드</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              학습한 단어들을 테스트해보세요. 실력을 확인하고 부족한 부분을 파악할 수 있습니다.
            </p>
            <button 
              className="btn btn-outline"
              onClick={() => setActiveTab('test')}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>

      {/* 단어 학습 데모 섹션 */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>단어 학습 체험</h2>
        <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}>
            JLPT {currentWord.level}
          </div>

          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            fontFamily: 'Noto Sans JP, serif'
          }}>
            {currentWord.kanji}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <button 
              className={`btn ${showReading ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowReading(!showReading)}
            >
              읽기 {showReading ? '숨기기' : '보기'}
            </button>
            <button 
              className={`btn ${showMeaning ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowMeaning(!showMeaning)}
            >
              의미 {showMeaning ? '숨기기' : '보기'}
            </button>
          </div>

          {showReading && (
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'var(--primary)', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP'
            }}>
              {currentWord.reading}
            </div>
          )}

          {showMeaning && (
            <div style={{ 
              fontSize: '1.3rem', 
              color: 'var(--font-color)', 
              marginBottom: '2rem' 
            }}>
              {currentWord.meaning}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={prevWord}>
              ← 이전
            </button>
            <button className="btn btn-primary" onClick={nextWord}>
              다음 →
            </button>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            color: 'var(--font-color-muted)', 
            fontSize: '0.9rem' 
          }}>
            {currentWordIndex + 1} / {sampleWords.length}
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>학습 현황</h2>
        <div className="grid grid-3">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              {sampleWords.length}
            </div>
            <h4>등록된 단어</h4>
            <p style={{ color: 'var(--font-color-muted)', fontSize: '0.9rem' }}>
              현재 학습 가능한 단어 수
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }}>
              89%
            </div>
            <h4>정답률</h4>
            <p style={{ color: 'var(--font-color-muted)', fontSize: '0.9rem' }}>
              평균 테스트 정답률
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--warning)', marginBottom: '1rem' }}>
              7
            </div>
            <h4>연속 학습일</h4>
            <p style={{ color: 'var(--font-color-muted)', fontSize: '0.9rem' }}>
              꾸준한 학습을 이어가고 있어요!
            </p>
          </div>
        </div>
      </div>

      {/* 공지사항 */}
      <div className="section">
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-light) 100%)',
          border: '1px solid var(--primary)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            🎯 현재 상태: 베타 버전
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            암기 모드와 테스트 모드를 체험해보세요!
          </p>
          <p style={{ 
            color: 'var(--font-color-muted)', 
            fontSize: '0.9rem',
            marginBottom: '0'
          }}>
            📅 업데이트: {new Date().toLocaleDateString('ko-KR')} | 
            ✨ 기능: 암기/테스트 모드 구현 완료
          </p>
        </div>
      </div>
    </div>
  );
};

// 암기 모드 컴포넌트
const StudyMode = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showReading, setShowReading] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const currentWord = sampleWords[currentWordIndex];

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % sampleWords.length);
        setShowReading(false);
        setShowMeaning(false);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % sampleWords.length);
    setShowReading(false);
    setShowMeaning(false);
  };

  const prevWord = () => {
    setCurrentWordIndex((prev) => (prev - 1 + sampleWords.length) % sampleWords.length);
    setShowReading(false);
    setShowMeaning(false);
  };

  return (
    <div className="container">
      <div className="section">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📚 암기 모드</h1>
        
        <div className="card" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {/* 진행률 표시 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--neutral-200)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentWordIndex + 1) / sampleWords.length) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--font-color-muted)' }}>
              {currentWordIndex + 1} / {sampleWords.length}
            </p>
          </div>

          {/* JLPT 레벨 배지 */}
          <div style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}>
            JLPT {currentWord.level}
          </div>

          {/* 한자 표시 */}
          <div style={{ 
            fontSize: '5rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            fontFamily: 'Noto Sans JP, serif',
            color: 'var(--font-color)'
          }}>
            {currentWord.kanji}
          </div>

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
              className={`btn ${isAutoPlay ? 'btn-warning' : 'btn-outline'}`}
              onClick={() => setIsAutoPlay(!isAutoPlay)}
            >
              {isAutoPlay ? '⏸️ 정지' : '▶️ 자동재생'}
            </button>
          </div>

          {/* 읽기 표시 */}
          {showReading && (
            <div style={{ 
              fontSize: '2rem', 
              color: 'var(--primary)', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP',
              animation: 'fadeIn 0.3s ease'
            }}>
              {currentWord.reading}
            </div>
          )}

          {/* 의미 표시 */}
          {showMeaning && (
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'var(--font-color)', 
              marginBottom: '2rem',
              animation: 'fadeIn 0.3s ease'
            }}>
              {currentWord.meaning}
            </div>
          )}

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
    </div>
  );
};

// 테스트 모드 컴포넌트
const TestMode = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const currentQuestion = sampleWords[currentQuestionIndex];
  
  // 선택지 생성 (정답 + 오답 3개)
  const generateChoices = () => {
    const correctAnswer = currentQuestion.meaning;
    const wrongAnswers = sampleWords
      .filter(word => word.meaning !== correctAnswer)
      .map(word => word.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  };

  const [choices] = useState(generateChoices());

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(prev => prev + 1);
    
    if (answer === currentQuestion.meaning) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleWords.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(0);
  };

  const isCorrect = selectedAnswer === currentQuestion.meaning;
  const isTestCompleted = answeredQuestions > 0 && currentQuestionIndex === sampleWords.length - 1 && showResult;

  if (isTestCompleted) {
    const percentage = Math.round((score / answeredQuestions) * 100);
    return (
      <div className="container">
        <div className="section">
          <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😅'}
            </div>
            <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>테스트 완료!</h1>
            
            <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              {score} / {answeredQuestions}
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--font-color)', marginBottom: '2rem' }}>
              정답률: {percentage}%
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              {percentage >= 80 && <p style={{ color: 'var(--success)' }}>🌟 훌륭해요! 계속 이런 식으로 해보세요!</p>}
              {percentage >= 60 && percentage < 80 && <p style={{ color: 'var(--warning)' }}>👍 잘했어요! 조금만 더 연습하면 완벽해질 거예요!</p>}
              {percentage < 60 && <p style={{ color: 'var(--error)' }}>💪 더 연습이 필요해요! 암기 모드에서 복습해보세요!</p>}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={resetTest}>
                🔄 다시 테스트
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => window.location.reload()}>
                🏠 홈으로
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📝 테스트 모드</h1>
        
        <div className="card" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {/* 점수 및 진행률 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>점수: {score} / {answeredQuestions}</div>
            <div>문제: {currentQuestionIndex + 1} / {Math.min(sampleWords.length, 5)}</div>
          </div>

          {/* 진행률 바 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--neutral-200)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentQuestionIndex + 1) / Math.min(sampleWords.length, 5)) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* 문제 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              fontFamily: 'Noto Sans JP, serif'
            }}>
              {currentQuestion.kanji}
            </div>
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'var(--primary)', 
              marginBottom: '2rem',
              fontFamily: 'Noto Sans JP'
            }}>
              {currentQuestion.reading}
            </div>
            <h3>이 단어의 뜻은 무엇인가요?</h3>
          </div>

          {/* 선택지 */}
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {choices.map((choice, index) => (
              <button
                key={index}
                className={`btn ${
                  !showResult 
                    ? 'btn-outline'
                    : choice === currentQuestion.meaning
                      ? 'btn-primary'
                      : selectedAnswer === choice
                        ? 'btn-secondary'
                        : 'btn-outline'
                }`}
                style={{
                  padding: '1rem',
                  fontSize: '1.1rem',
                  backgroundColor: showResult && choice === currentQuestion.meaning 
                    ? 'var(--success)' 
                    : showResult && selectedAnswer === choice && choice !== currentQuestion.meaning
                      ? 'var(--error)'
                      : undefined,
                  color: showResult && (choice === currentQuestion.meaning || selectedAnswer === choice) 
                    ? 'white' 
                    : undefined
                }}
                onClick={() => handleAnswerSelect(choice)}
                disabled={showResult}
              >
                {choice}
                {showResult && choice === currentQuestion.meaning && ' ✓'}
                {showResult && selectedAnswer === choice && choice !== currentQuestion.meaning && ' ✗'}
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
                  ❌ 틀렸습니다. 정답은 "{currentQuestion.meaning}" 입니다.
                </p>
              )}
            </div>
          )}

          {/* 다음 버튼 */}
          {showResult && (
            <button 
              className="btn btn-primary btn-lg" 
              onClick={nextQuestion}
              disabled={currentQuestionIndex === sampleWords.length - 1}
            >
              {currentQuestionIndex === sampleWords.length - 1 ? '테스트 완료' : '다음 문제 →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'study':
        return <StudyMode />;
      case 'test':
        return <TestMode />;
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