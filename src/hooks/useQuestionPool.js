import { useRef } from 'react';
import { allCountries } from '../data/countryLoader';

export function useQuestionPool() {
  const poolRef = useRef([...allCountries]);

  const getNextCountry = () => {
    if (poolRef.current.length === 0) {
      poolRef.current = [...allCountries]; // Reseta quando acaba
    }

    const randomIndex = Math.floor(Math.random() * poolRef.current.length);
    const selected = poolRef.current[randomIndex];

    // Remove do pool
    poolRef.current.splice(randomIndex, 1);

    return selected;
  };

  const resetPool = () => {
    poolRef.current = [...allCountries];
  };

  return { getNextCountry, resetPool };
}
