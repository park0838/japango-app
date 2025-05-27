import { VocabItem, WeekData } from '../types';

// JSON 파일들을 import (Vite에서 JSON import 지원)
import week1Data from '../vocabulary/week1.json';
import week2Data from '../vocabulary/week2.json';
import week3Data from '../vocabulary/week3.json';
import week4Data from '../vocabulary/week4.json';
import week5Data from '../vocabulary/week5.json';
import week6Data from '../vocabulary/week6.json';

// 주차별 데이터 매핑
const weekDataMap: Record<number, WeekData> = {
  1: week1Data as WeekData,
  2: week2Data as WeekData,
  3: week3Data as WeekData,
  4: week4Data as WeekData,
  5: week5Data as WeekData,
  6: week6Data as WeekData,
};

// 모든 단어를 하나의 배열로 합치면서 week 정보 추가
export const vocabData: VocabItem[] = Object.entries(weekDataMap).flatMap(([weekNum, data]) =>
  data.words.map(word => ({
    ...word,
    week: parseInt(weekNum)
  }))
);

// 주차별로 단어 가져오기
export const getVocabByWeek = (week: number): VocabItem[] => {
  const weekData = weekDataMap[week];
  if (!weekData) return [];
  
  return weekData.words.map(word => ({
    ...word,
    week: week
  }));
};

// 모든 주차 목록 가져오기
export const getAllWeeks = (): number[] => {
  return Object.keys(weekDataMap).map(Number).sort((a, b) => a - b);
};

// 주차별 데이터 전체 가져오기
export const getWeekData = (week: number): WeekData | null => {
  return weekDataMap[week] || null;
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