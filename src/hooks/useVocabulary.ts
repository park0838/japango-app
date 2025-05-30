import { useState, useEffect } from 'react';
import { WeekData, VocabWord } from '../types';

export const useVocabulary = () => {
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 주차 데이터 로드
  const loadWeekData = async (week: number): Promise<WeekData | null> => {
    try {
      const response = await fetch(`/vocabulary/week${week}.json`);
      if (!response.ok) return null;
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading week ${week}:`, error);
      return null;
    }
  };

  // 사용 가능한 주차 확인
  useEffect(() => {
    const checkAvailableWeeks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const weeks: number[] = [];
        let totalCount = 0;
        
        // 최대 10주차까지 확인
        for (let i = 1; i <= 10; i++) {
          const data = await loadWeekData(i);
          if (data) {
            weeks.push(i);
            totalCount += data.totalWords;
          } else {
            // 연속된 주차가 없으면 중단
            break;
          }
        }
        
        setAvailableWeeks(weeks);
        setTotalWords(totalCount);
      } catch (err) {
        setError('단어 데이터를 불러오는데 실패했습니다.');
        console.error('Error checking available weeks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAvailableWeeks();
  }, []);

  // 특정 주차의 단어 가져오기
  const getWeekWords = async (week: number): Promise<VocabWord[]> => {
    const data = await loadWeekData(week);
    return data?.words || [];
  };

  // 여러 주차의 단어 가져오기
  const getMultipleWeeksWords = async (weeks: number[]): Promise<VocabWord[]> => {
    const allWords: VocabWord[] = [];
    
    for (const week of weeks) {
      const words = await getWeekWords(week);
      allWords.push(...words);
    }
    
    return allWords;
  };

  return {
    availableWeeks,
    totalWords,
    isLoading,
    error,
    loadWeekData,
    getWeekWords,
    getMultipleWeeksWords,
  };
};
