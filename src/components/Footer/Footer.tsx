import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <h3 className="footer-title">JapanGo</h3>
            <p className="footer-description">
              체계적인 일본어 단어 학습 플랫폼
            </p>
            <p className="footer-copyright">
              © {currentYear} JapanGo. All rights reserved.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">학습 기능</h4>
            <ul className="footer-list">
              <li>주차별 체계적 학습</li>
              <li>음성 재생 지원</li>
              <li>다양한 테스트 모드</li>
              <li>학습 통계 제공</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">학습 팁</h4>
            <ul className="footer-list">
              <li>매일 꾸준히 학습하기</li>
              <li>틀린 문제 반복 복습</li>
              <li>음성과 함께 암기하기</li>
              <li>목표 점수 설정하기</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">문의</h4>
            <p className="footer-contact">
              학습에 대한 문의나 제안사항이 있으시면<br />
              언제든지 연락주세요.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-10 5L2 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>Made with ❤️ for Japanese learners</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
