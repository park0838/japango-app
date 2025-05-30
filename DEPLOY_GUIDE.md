# JapanGo 실행 가이드

## 프로젝트 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## Vercel 배포

1. Vercel CLI 설치 (선택사항)
```bash
npm i -g vercel
```

2. 빌드 후 배포
```bash
npm run build
vercel --prod
```

또는 GitHub와 연동하여 자동 배포 설정 가능

## 주요 변경사항

### 1. 구조 개선
- 모든 컴포넌트를 별도 파일로 분리
- 컴포넌트별 CSS 파일 분리
- 커스텀 훅 사용 (useVocabulary)
- 타입 정의 개선

### 2. 기능 개선
- PWA 지원 추가
- 로컬스토리지 활용한 진행 상황 저장
- 오디오 재생 기능 개선
- 키보드 단축키 지원
- 모바일 반응형 디자인

### 3. 성능 최적화
- 코드 스플리팅
- 지연 로딩
- 캐싱 전략 개선

### 4. UI/UX 개선
- 현대적인 디자인
- 애니메이션 추가
- 다크모드 지원 가능
- 접근성 개선

## 폴더 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
├── hooks/           # 커스텀 훅
├── services/        # 외부 서비스 연동
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── vocabulary/      # 단어 데이터 (JSON)
```

## 문제 해결

### npm install 오류 시
```bash
rm -rf node_modules package-lock.json
npm install
```

### 빌드 오류 시
```bash
npm run lint
npm run build
```

## 추가 개발 가이드

### 새로운 주차 추가
1. `src/vocabulary/week7.json` 파일 생성
2. 90개 단어 데이터 추가
3. `useVocabulary` 훅에서 자동으로 인식

### 스타일 수정
- 전역 스타일: `src/index.css`
- 컴포넌트별 스타일: 각 컴포넌트 폴더의 `.css` 파일