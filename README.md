# JapanGo - 일본어 단어 학습 앱

간단하고 효과적인 일본어 단어 암기 및 테스트 애플리케이션입니다.

## 주요 기능

### 📚 암기 모드
- 주차별 단어 목록 제공
- 단어, 읽기, 의미를 한눈에 확인
- 발음 재생 기능 (브라우저 TTS 사용)
- 검색 및 필터링 기능

### 📝 테스트 모드
- 의미 테스트: 단어 → 의미
- 읽기 테스트: 단어 → 히라가나
- 주차별 선택 가능
- 문제 개수 설정 (5~30문제)
- 실시간 결과 확인

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS Variables + CSS Modules
- **Audio**: Web Speech API (TTS)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── Header/          # 헤더 컴포넌트
│   ├── VocabularyList/  # 단어 목록 컴포넌트
│   ├── TestMode/        # 테스트 실행 컴포넌트
│   └── TestResults/     # 테스트 결과 컴포넌트
├── pages/               # 페이지 컴포넌트
│   ├── StudyPage.tsx    # 암기 모드 페이지
│   └── TestPage.tsx     # 테스트 모드 페이지
├── data/                # 데이터
│   └── vocabData.ts     # 단어 데이터
├── services/            # 서비스 로직
│   └── audioService.ts  # 음성 재생 서비스
├── types/               # TypeScript 타입 정의
│   └── index.ts
└── styles/              # 전역 스타일
```

## 단어 데이터 추가

`src/data/vocabData.ts` 파일에서 단어를 추가할 수 있습니다:

```typescript
export const vocabData: VocabItem[] = [
  {
    word: '학교',
    reading: 'がっこう', 
    meaning: '학교',
    week: 1
  },
  // 더 많은 단어 추가...
];
```

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

*음성 재생 기능은 브라우저의 TTS 지원에 따라 달라질 수 있습니다.*

## 라이선스

MIT License