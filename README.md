# JapanGo - 일본어 단어 암기 앱

체계적이고 현대적인 일본어 단어 학습 플랫폼입니다. 주차별로 구성된 90개 단어를 효과적으로 학습할 수 있습니다.

## 🌟 주요 기능

- **주차별 학습 시스템**: 6주차, 총 540개 단어 학습
- **암기 모드**: 플래시카드 방식으로 단어 암기
- **테스트 모드**: 다양한 유형의 문제로 실력 확인
- **틀린 문제 복습**: 틀린 단어만 모아서 집중 학습
- **학습 통계**: 진행률, 점수, 연속 학습일 등 확인
- **PWA 지원**: 오프라인 학습 가능
- **다크 모드**: 눈이 편안한 야간 학습
- **음성 지원**: 일본어 발음 듣기 기능

## 🚀 시작하기

### 필요 환경
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/japango/japango-app.git
cd japango-app

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 배포
```bash
# Vercel 배포
npm run deploy
```

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: CSS Modules, CSS Variables
- **Build Tool**: Vite
- **PWA**: Workbox, Service Worker
- **Deployment**: Vercel
- **Code Quality**: ESLint, Prettier, Husky

## 📁 프로젝트 구조

```
japango-app/
├── public/
│   ├── manifest.json    # PWA 설정
│   ├── sw.js           # Service Worker
│   └── vocabulary/     # 단어 데이터 (빌드시 생성)
├── src/
│   ├── components/     # React 컴포넌트
│   │   ├── Home/
│   │   ├── StudyMode/
│   │   ├── TestMode/
│   │   ├── WrongAnswers/
│   │   └── Stats/
│   ├── hooks/          # Custom Hooks
│   ├── services/       # 서비스 로직
│   ├── types/          # TypeScript 타입 정의
│   ├── utils/          # 유틸리티 함수
│   └── vocabulary/     # 단어 데이터 소스
└── scripts/
    └── sync-vocabulary.cjs  # 단어 데이터 동기화
```

## 🎯 사용법

1. **홈 화면**: 학습 메뉴 선택
2. **주차 선택**: 학습할 주차 선택 (1-6주차)
3. **암기 모드**: 
   - 카드를 클릭하여 뜻 확인
   - 좌우 화살표로 이동
   - 자동 재생 기능
4. **테스트 모드**:
   - 4지선다 문제
   - 한자→뜻, 뜻→한자, 읽기→뜻
   - 즉시 정답 확인
5. **틀린 문제**: 
   - 틀린 문제만 복습
   - 카드/퀴즈 모드 선택
6. **통계**: 
   - 학습 진행률
   - 테스트 점수
   - 연속 학습일

## 🎨 커스터마이징

### 단어 데이터 수정
`src/vocabulary/week*.json` 파일을 수정하여 단어를 변경할 수 있습니다.

```json
{
  "week": 1,
  "totalWords": 90,
  "words": [
    {
      "id": 1,
      "kanji": "幼い",
      "korean": "어리다, 미숙하다",
      "hiragana": "おさない"
    }
  ]
}
```

### 테마 색상 변경
`src/styles/design-system.css`에서 CSS 변수를 수정하여 테마를 변경할 수 있습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 글

- 일본어 학습자들의 피드백
- 오픈소스 커뮤니티
- 모든 기여자들

---

Made with ❤️ by JapanGo Team
