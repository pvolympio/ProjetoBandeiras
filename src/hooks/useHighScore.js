import { useState, useEffect } from 'react';

export function useHighScore(quizId) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`highscore_${quizId}`);
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
  }, [quizId]);

  const updateHighScore = (score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`highscore_${quizId}`, score.toString());
      return true; // New high score!
    }
    return false;
  };

  return { highScore, updateHighScore };
}
