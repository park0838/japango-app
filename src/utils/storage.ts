// localStorage 유틸리티 함수들

// 스토리지 용량 체크
export const checkStorageSpace = (): { used: number; available: boolean; percentage: number } => {
  try {
    const testKey = '_storage_test_' + Date.now();
    const testValue = 'x'.repeat(1024); // 1KB
    
    // 현재 사용량 계산
    const used = getStorageSize();
    
    // 사용 가능 여부 테스트
    try {
      localStorage.setItem(testKey, testValue);
      localStorage.removeItem(testKey);
      
      // 일반적으로 localStorage는 5-10MB 제한
      const estimatedMax = 5 * 1024 * 1024; // 5MB
      const percentage = Math.round((used / estimatedMax) * 100);
      
      return {
        used,
        available: percentage < 90, // 90% 미만이면 사용 가능
        percentage
      };
    } catch (e) {
      return {
        used,
        available: false,
        percentage: 100
      };
    }
  } catch (error) {
    console.error('Storage check error:', error);
    return {
      used: 0,
      available: true,
      percentage: 0
    };
  }
};

export const saveToStorage = (key: string, data: any): void => {
  try {
    const storageCheck = checkStorageSpace();
    
    if (!storageCheck.available) {
      console.warn('스토리지 공간이 부족합니다. 오래된 데이터를 정리해주세요.');
      // 필요하면 오래된 데이터 자동 정리
      cleanupOldData();
    }
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save error:', error);
    
    // 저장 실패 시 오래된 데이터 정리 후 재시도
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      cleanupOldData();
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryError) {
        console.error('Storage save retry failed:', retryError);
      }
    }
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Storage load error:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Storage clear error:', error);
  }
};

// 특정 패턴의 키들을 모두 가져오기
export const getStorageKeysByPattern = (pattern: RegExp): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && pattern.test(key)) {
      keys.push(key);
    }
  }
  return keys;
};

// 스토리지 사용량 확인
export const getStorageSize = (): number => {
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  return totalSize;
};

// 오래된 데이터 정리
export const cleanupOldData = (): void => {
  try {
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000); // 30일
    
    // 테스트 결과 중 오래된 것 삭제
    const testResultKeys = getStorageKeysByPattern(/^test_results_week/);
    testResultKeys.forEach(key => {
      const results = loadFromStorage(key, []);
      const filtered = results.filter((result: any) => {
        if (result.date) {
          const resultDate = new Date(result.date).getTime();
          return resultDate > oneMonthAgo;
        }
        return true;
      });
      
      if (filtered.length < results.length) {
        saveToStorage(key, filtered.slice(0, 10)); // 최근 10개만 유지
      }
    });
    
    // 틀린 답안 중 오래된 것 삭제
    const wrongAnswers = loadFromStorage('wrong_answers', []);
    const filteredWrongAnswers = wrongAnswers.filter((answer: any) => {
      if (answer.timestamp) {
        return answer.timestamp > oneMonthAgo;
      }
      return true;
    });
    
    if (filteredWrongAnswers.length < wrongAnswers.length) {
      saveToStorage('wrong_answers', filteredWrongAnswers.slice(0, 100)); // 최근 100개만 유지
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};
