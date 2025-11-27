import { useCallback } from 'react';

export function useSound() {
  const playSound = useCallback((soundName) => {
    const audio = new Audio(`/audio/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  return playSound;
}
