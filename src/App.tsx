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
const Header = () => {
  const [activeTab, setActiveTab] = useState('study');

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <a href="/">🇯🇵 JapanGo</a>
        </h1>
        
        <div className="header-actions">
          <ThemeToggle />
          
          <nav className="app-nav">
            <ul>
              <li>
                <a 
                  href="#study" 
                  className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
                  onClick={() => setActiveTab('study')}
                >
                  암기 모드
                </a>
              </li>
              <li>
                <a 
                  href="#test" 
                  className={`nav-link ${activeTab === 'test' ? 'active' : ''}`}
                  onClick={() => setActiveTab('test')}
                >
                  테스트 모드
                </a>
              </li>
              <li>
                <a 
                  href="#srs" 
                  className={`nav-link ${activeTab === 'srs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('srs')}
                >
                  간격 학습
                </a>
              </li>
              <li>
                <a 
                  href="#radicals" 
                  className={`nav-link ${activeTab === 'radicals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('radicals')}
                >
                  부수 학습
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
  { kanji: '楽しい', reading: 'たのしい', meaning: '즐겁다', level: 'N5' }
];

// 메인 컨텐츠 컴포넌트
const MainContent = () => {
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
            <button className="btn btn-primary btn-lg">
              🚀 학습 시작하기
            </button>
            <button className="btn btn-outline btn-lg">
              📊 내 통계 보기
            </button>
          </div>
        </div>
      </div>

      {/* 학습 모드 카드들 */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>학습 모드</h2>
        <div className="grid grid-2">
          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>암기 모드</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              단어카드를 보며 천천히 학습하세요. 자신의 속도에 맞춰 반복 학습이 가능합니다.
            </p>
            <button className="btn btn-primary">시작하기</button>
          </div>

          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>테스트 모드</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              학습한 단어들을 테스트해보세요. 실력을 확인하고 부족한 부분을 파악할 수 있습니다.
            </p>
            <button className="btn btn-outline">시작하기</button>
          </div>

          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ color: 'var(--info)', marginBottom: '1rem' }}>간격 학습</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              과학적인 간격 반복 시스템으로 효율적인 장기 기억을 만들어보세요.
            </p>
            <button className="btn btn-outline">시작하기</button>
          </div>

          <div className="card fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>㉿</div>
            <h3 style={{ color: 'var(--warning)', marginBottom: '1rem' }}>부수 학습</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              한자의 부수를 학습하여 한자 이해도를 높이고 암기 효율을 개선하세요.
            </p>
            <button className="btn btn-outline">시작하기</button>
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
              150
            </div>
            <h4>학습한 단어</h4>
            <p style={{ color: 'var(--font-color-muted)', fontSize: '0.9rem' }}>
              오늘 새로 학습한 단어
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }}>
              89%
            </div>
            <h4>정답률</h4>
            <p style={{ color: 'var(--font-color-muted)', fontSize: '0.9rem' }}>
              최근 테스트 평균 정답률
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
            🎯 현재 상태: 데모 버전
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            WeGoJapan 디자인 시스템을 적용한 JapanGo 앱입니다.
          </p>
          <p style={{ 
            color: 'var(--font-color-muted)', 
            fontSize: '0.9rem',
            marginBottom: '0'
          }}>
            📅 업데이트: {new Date().toLocaleDateString('ko-KR')} | 
            ✨ 디자인: WeGoJapan 스타일 적용 완료
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <MainContent />
      </main>
      <Footer />
    </div>
  );
}

export default App;