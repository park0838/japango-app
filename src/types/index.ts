export interface VocabItem {
  id: number;            // 단어 ID
  kanji: string;         // 일본어 단어 (한자)
  korean: string;        // 의미 (한국어)
  hiragana: string;      // 읽는 법 (히라가나)
  week?: number;         // 주차 (1, 2, 3, 4...)
}

export interface WeekData {
  week: number;
  totalWords: number;
  words: VocabItem[];
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