import React, { createContext, useState, useContext, useEffect } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('sound_muted');
    return stored === 'true';
  });

  const toggleSound = () => {
    setIsMuted(prev => {
      const newState = !prev;
      localStorage.setItem('sound_muted', newState);
      return newState;
    });
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  return useContext(SoundContext);
}
