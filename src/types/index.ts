export interface VocabItem {
  word: string;          // 일본어 단어 (한자/히라가나)
  reading?: string;      // 읽는 법 (히라가나)
  meaning: string;       // 의미 (한국어)
  week: number;          // 주차 (1, 2, 3, 4...)
}

export enum TestModeType {
  MEANING = 'meaning', // 의미 테스트 (단어 → 의미)
  READING = 'reading', // 발음 테스트 (단어 → 히라가나)
}

export interface TestResult {
  vocabItem: VocabItem;
  isCorrect: boolean;
  userAnswer: string;
  testMode: TestModeType;
}