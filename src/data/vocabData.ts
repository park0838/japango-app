import { VocabItem } from '../types';

export const vocabData: VocabItem[] = [
  // 1주차 단어들
  { word: '학교', reading: 'がっこう', meaning: '학교', week: 1 },
  { word: '선생님', reading: 'せんせい', meaning: '선생님', week: 1 },
  { word: '학생', reading: 'がくせい', meaning: '학생', week: 1 },
  { word: '교실', reading: 'きょうしつ', meaning: '교실', week: 1 },
  { word: '책', reading: 'ほん', meaning: '책', week: 1 },
  { word: '펜', reading: 'ペン', meaning: '펜', week: 1 },
  { word: '공부', reading: 'べんきょう', meaning: '공부', week: 1 },
  { word: '숙제', reading: 'しゅくだい', meaning: '숙제', week: 1 },
  { word: '시험', reading: 'しけん', meaning: '시험', week: 1 },
  { word: '도서관', reading: 'としょかん', meaning: '도서관', week: 1 },

  // 2주차 단어들
  { word: '가족', reading: 'かぞく', meaning: '가족', week: 2 },
  { word: '아버지', reading: 'ちち', meaning: '아버지', week: 2 },
  { word: '어머니', reading: 'はは', meaning: '어머니', week: 2 },
  { word: '형', reading: 'あに', meaning: '형', week: 2 },
  { word: '언니', reading: 'あね', meaning: '언니', week: 2 },
  { word: '동생', reading: 'おとうと', meaning: '남동생', week: 2 },
  { word: '여동생', reading: 'いもうと', meaning: '여동생', week: 2 },
  { word: '할아버지', reading: 'そふ', meaning: '할아버지', week: 2 },
  { word: '할머니', reading: 'そぼ', meaning: '할머니', week: 2 },
  { word: '집', reading: 'いえ', meaning: '집', week: 2 },

  // 3주차 단어들
  { word: '음식', reading: 'たべもの', meaning: '음식', week: 3 },
  { word: '밥', reading: 'ごはん', meaning: '밥', week: 3 },
  { word: '빵', reading: 'パン', meaning: '빵', week: 3 },
  { word: '물', reading: 'みず', meaning: '물', week: 3 },
  { word: '차', reading: 'ちゃ', meaning: '차', week: 3 },
  { word: '커피', reading: 'コーヒー', meaning: '커피', week: 3 },
  { word: '우유', reading: 'ぎゅうにゅう', meaning: '우유', week: 3 },
  { word: '과일', reading: 'くだもの', meaning: '과일', week: 3 },
  { word: '야채', reading: 'やさい', meaning: '야채', week: 3 },
  { word: '고기', reading: 'にく', meaning: '고기', week: 3 },

  // 4주차 단어들
  { word: '시간', reading: 'じかん', meaning: '시간', week: 4 },
  { word: '아침', reading: 'あさ', meaning: '아침', week: 4 },
  { word: '점심', reading: 'ひる', meaning: '점심', week: 4 },
  { word: '저녁', reading: 'ばん', meaning: '저녁', week: 4 },
  { word: '오늘', reading: 'きょう', meaning: '오늘', week: 4 },
  { word: '어제', reading: 'きのう', meaning: '어제', week: 4 },
  { word: '내일', reading: 'あした', meaning: '내일', week: 4 },
  { word: '주말', reading: 'しゅうまつ', meaning: '주말', week: 4 },
  { word: '월요일', reading: 'げつようび', meaning: '월요일', week: 4 },
  { word: '화요일', reading: 'かようび', meaning: '화요일', week: 4 }
];

// 주차별로 단어 가져오기
export const getVocabByWeek = (week: number): VocabItem[] => {
  return vocabData.filter(item => item.week === week);
};

// 모든 주차 목록 가져오기
export const getAllWeeks = (): number[] => {
  const weeks = new Set(vocabData.map(item => item.week));
  return Array.from(weeks).sort((a, b) => a - b);
};