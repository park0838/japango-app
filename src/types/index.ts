// 단어 타입 정의
export interface VocabWord {
  id: number;
  kanji: string;
  korean: string;
  hiragana: string;
}

// 주차 데이터 타입
export interface WeekData {
  week: number;
  totalWords: number;
  words: VocabWord[];
}

// 테스트 결과 타입
export interface TestResult {
  date: string;
  score: number;
  total: number;
  percentage: number;
  questionTypes: string[];
}

// 틀린 답안 타입
export interface WrongAnswer {
  word: VocabWord;
  userAnswer: string;
  correctAnswer: string;
  week: number;
  timestamp: number;
}

// 학습 진행률 타입
export interface StudyProgress {
  week: number;
  studiedWords: number;
  totalWords: number;
  lastStudied: string;
}

// 통계 타입
export interface WeekStats {
  studyProgress: number;
  studiedToday: number;
  bestScore: number;
  testResults: TestResult[];
  lastStudied?: string;
}

// 전체 통계 타입
export interface TotalStats {
  totalStudied: number;
  averageScore: number;
  totalTests: number;
  studyStreak: number;
  wrongAnswersCount: number;
}
