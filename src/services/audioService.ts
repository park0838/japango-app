// 음성 재생 서비스 (개선된 버전)

// 음성 재생 가능 여부 확인
let speechSupported: boolean | null = null;

const checkSpeechSupport = (): boolean => {
  if (speechSupported === null) {
    speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }
  return speechSupported;
};

// 사용 가능한 음성 목록 가져오기
const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!checkSpeechSupport()) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // 타임아웃 설정 (5초 후 빈 배열 반환)
      const timeout = setTimeout(() => {
        resolve([]);
      }, 5000);

      window.speechSynthesis.addEventListener('voiceschanged', () => {
        clearTimeout(timeout);
        resolve(window.speechSynthesis.getVoices());
      }, { once: true });
    }
  });
};

export const speakJapanese = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!checkSpeechSupport()) {
      console.warn('음성 합성이 지원되지 않는 브라우저입니다.');
      resolve(false);
      return;
    }

    if (!text || text.trim() === '') {
      console.warn('재생할 텍스트가 없습니다.');
      resolve(false);
      return;
    }

    try {
      // 이전 음성 중지
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      
      // 일본어 설정
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // 속도 조절 (0.1 ~ 10)
      utterance.pitch = 1; // 음높이 (0 ~ 2)
      utterance.volume = 1; // 볼륨 (0 ~ 1)

      // 음성 재생 완료 이벤트
      utterance.onend = () => resolve(true);
      utterance.onerror = (error) => {
        console.error('음성 재생 오류:', error);
        resolve(false);
      };

      // 일본어 음성 찾기
      const getJapaneseVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoices = voices.filter(voice => 
          voice.lang.startsWith('ja') || voice.lang === 'ja-JP'
        );
        
        // 선호하는 음성 순서
        const preferredVoices = ['Google 日本語', 'Microsoft Haruka', 'Kyoko', 'Otoya', 'Google'];
        
        for (const preferred of preferredVoices) {
          const voice = japaneseVoices.find(v => v.name.includes(preferred));
          if (voice) return voice;
        }
        
        // 선호하는 음성이 없으면 첫 번째 일본어 음성 반환
        return japaneseVoices[0] || null;
      };

      // 음성 목록이 로드되었는지 확인
      if (window.speechSynthesis.getVoices().length > 0) {
        const voice = getJapaneseVoice();
        if (voice) {
          utterance.voice = voice;
        }
        window.speechSynthesis.speak(utterance);
      } else {
        // 음성 목록이 아직 로드되지 않은 경우
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          const voice = getJapaneseVoice();
          if (voice) {
            utterance.voice = voice;
          }
          window.speechSynthesis.speak(utterance);
        }, { once: true });
      }
    } catch (error) {
      console.error('음성 재생 중 오류 발생:', error);
      resolve(false);
    }
  });
};

// 한국어 음성 재생 (필요시 사용)
export const speakKorean = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!checkSpeechSupport()) {
      console.warn('음성 합성이 지원되지 않는 브라우저입니다.');
      resolve(false);
      return;
    }

    if (!text || text.trim() === '') {
      console.warn('재생할 텍스트가 없습니다.');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve(true);
      utterance.onerror = (error) => {
        console.error('음성 재생 오류:', error);
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('음성 재생 중 오류 발생:', error);
      resolve(false);
    }
  });
};

// 음성 재생 중지
export const stopSpeaking = (): void => {
  if (checkSpeechSupport()) {
    window.speechSynthesis.cancel();
  }
};

// 일본어 음성 사용 가능 여부 확인
export const checkJapaneseVoiceSupport = async (): Promise<boolean> => {
  const voices = await getAvailableVoices();
  return voices.some(voice => voice.lang.startsWith('ja'));
};
