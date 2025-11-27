import { useState, useEffect, useCallback } from 'react';

const MASTERY_THRESHOLD = 3; // Number of correct answers to master a country

export function useMastery() {
  // State to trigger re-renders when mastery updates
  const [masteryMap, setMasteryMap] = useState({});

  // Load mastery data on mount
  useEffect(() => {
    const stored = localStorage.getItem('country_mastery');
    if (stored) {
      setMasteryMap(JSON.parse(stored));
    }
  }, []);

  const incrementMastery = useCallback((countryCode) => {
    if (!countryCode) return;
    
    setMasteryMap((prev) => {
      const currentCount = prev[countryCode] || 0;
      const newCount = currentCount + 1;
      
      const newMap = { ...prev, [countryCode]: newCount };
      localStorage.setItem('country_mastery', JSON.stringify(newMap));
      return newMap;
    });
  }, []);

  const isMastered = useCallback((countryCode) => {
    return (masteryMap[countryCode] || 0) >= MASTERY_THRESHOLD;
  }, [masteryMap]);

  const getMasteryLevel = useCallback((countryCode) => {
    return masteryMap[countryCode] || 0;
  }, [masteryMap]);

  const getTotalMastered = useCallback(() => {
    return Object.values(masteryMap).filter(count => count >= MASTERY_THRESHOLD).length;
  }, [masteryMap]);

  return { incrementMastery, isMastered, getMasteryLevel, getTotalMastered, MASTERY_THRESHOLD };
}
