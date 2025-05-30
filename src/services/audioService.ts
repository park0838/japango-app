// 음성 재생 서비스

export const speakJapanese = (text: string): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('음성 합성이 지원되지 않는 브라우저입니다.');
    return;
  }

  // 이전 음성 중지
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // 일본어 설정
  utterance.lang = 'ja-JP';
  utterance.rate = 0.8; // 속도 조절 (0.1 ~ 10)
  utterance.pitch = 1; // 음높이 (0 ~ 2)
  utterance.volume = 1; // 볼륨 (0 ~ 1)

  // 일본어 음성 찾기
  const getJapaneseVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoices = voices.filter(voice => voice.lang.startsWith('ja'));
    
    // 선호하는 음성 순서
    const preferredVoices = ['Google 日本語', 'Microsoft Haruka', 'Kyoko'];
    
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
};

// 한국어 음성 재생
export const speakKorean = (text: string): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('음성 합성이 지원되지 않는 브라우저입니다.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

// 음성 지원 확인
export const checkSpeechSynthesisSupport = (): boolean => {
  return 'speechSynthesis' in window;
};

// 사용 가능한 음성 목록 가져오기
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        resolve(window.speechSynthesis.getVoices());
      }, { once: true });
    }
  });
};

// 음성 재생 중인지 확인
export const isSpeaking = (): boolean => {
  return window.speechSynthesis.speaking;
};

// 음성 재생 중지
export const stopSpeaking = (): void => {
  window.speechSynthesis.cancel();
};

// 음성 재생 일시 정지
export const pauseSpeaking = (): void => {
  window.speechSynthesis.pause();
};

// 음성 재생 재개
export const resumeSpeaking = (): void => {
  window.speechSynthesis.resume();
};
