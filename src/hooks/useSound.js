import { useCallback } from 'react';
import { useSoundSettings } from '../contexts/SoundContext';

export function useSound() {
  const { isMuted } = useSoundSettings();

  const playSound = useCallback((soundName) => {
    if (isMuted) return;
    
    const audio = new Audio(`/audio/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, [isMuted]);

  return playSound;
}
