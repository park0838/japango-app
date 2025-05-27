// 일본어 발음을 재생하는 서비스
export const playPronunciation = (text: string): void => {
  if ('speechSynthesis' in window) {
    // 기존 음성 중지
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 일본어로 설정
    utterance.rate = 0.8; // 조금 느리게
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // 일본어 음성 찾기 (사용 가능한 경우)
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice => voice.lang.includes('ja'));
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
};

// 음성 중지
export const stopPronunciation = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};