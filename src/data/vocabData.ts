import { VocabItem, WeekData } from '../types';

// 주차별 단어 데이터 (샘플)
const allVocabularyData: Record<number, WeekData> = {
  1: {
    week: 1,
    totalWords: 90,
    words: [
      { id: 1, kanji: "幼い", korean: "어리다, 미숙하다", hiragana: "おさない" },
      { id: 2, kanji: "絞る", korean: "쥐어짜다", hiragana: "しぼる" },
      { id: 3, kanji: "抱える", korean: "(껴)안다", hiragana: "かかえる" },
      { id: 4, kanji: "求人", korean: "구인", hiragana: "きゅうじん" },
      { id: 5, kanji: "柔軟", korean: "유연함", hiragana: "じゅうなん" },
      { id: 6, kanji: "垂直", korean: "수직", hiragana: "すいちょく" },
      { id: 7, kanji: "強火", korean: "강한 불", hiragana: "つよび" },
      { id: 8, kanji: "握る", korean: "쥐다", hiragana: "にぎる" },
      { id: 9, kanji: "乱れる", korean: "흐트러지다, 문란해지다", hiragana: "みだれる" },
      { id: 10, kanji: "密閉", korean: "밀폐", hiragana: "みっぺい" }
    ]
  },
  2: {
    week: 2,
    totalWords: 90,
    words: [
      { id: 1, kanji: "宇宙", korean: "우주", hiragana: "うちゅう" },
      { id: 2, kanji: "腕", korean: "팔", hiragana: "うで" },
      { id: 3, kanji: "雨量", korean: "우량, 강수량", hiragana: "うりょう" },
      { id: 4, kanji: "運送", korean: "운송", hiragana: "うんそう" },
      { id: 5, kanji: "栄養分", korean: "영양분", hiragana: "えいようぶん" },
      { id: 6, kanji: "延期", korean: "연기(미뤄지다)", hiragana: "えんき" },
      { id: 7, kanji: "応援", korean: "응원", hiragana: "おうえん" },
      { id: 8, kanji: "応対", korean: "응대", hiragana: "おうたい" },
      { id: 9, kanji: "欧米", korean: "구미(유럽과 미국)", hiragana: "おうべい" },
      { id: 10, kanji: "お菓子", korean: "과자", hiragana: "おかし" }
    ]
  }
};

// 모든 단어를 하나의 배열로 합치면서 week 정보 추가
export const vocabData: VocabItem[] = Object.entries(allVocabularyData).flatMap(([weekNum, data]) =>
  data.words.map(word => ({
    ...word,
    week: parseInt(weekNum)
  }))
);

// 주차별로 단어 가져오기
export const getVocabByWeek = (week: number): VocabItem[] => {
  const weekData = allVocabularyData[week];
  if (!weekData) return [];
  
  return weekData.words.map(word => ({
    ...word,
    week: week
  }));
};

// 모든 주차 목록 가져오기
export const getAllWeeks = (): number[] => {
  return Object.keys(allVocabularyData).map(Number).sort((a, b) => a - b);
};

// 주차별 데이터 전체 가져오기
export const getWeekData = (week: number): WeekData | null => {
  return allVocabularyData[week] || null;
};

// 전체 통계 정보
export const getVocabStats = () => {
  const totalWeeks = getAllWeeks().length;
  const totalWords = vocabData.length;
  const wordsPerWeek = totalWords / totalWeeks;
  
  return {
    totalWeeks,
    totalWords,
    wordsPerWeek,
    availableWeeks: getAllWeeks()
  };
};