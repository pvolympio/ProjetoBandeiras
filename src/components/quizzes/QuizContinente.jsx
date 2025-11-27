import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../../data/countryLoader';
import { Map, Share2, Globe } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useQuestionPool } from '../../hooks/useQuestionPool';
import { useHighScore } from '../../hooks/useHighScore';

const CONTINENTS = ["África", "América do Norte", "América do Sul", "Ásia", "Europa", "Oceania"];

function QuizContinente() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const playSound = useSound();
  const { getNextCountry } = useQuestionPool();
  const { highScore, updateHighScore } = useHighScore('continente');

  const loadNewQuestion = () => {
    const random = getNextCountry();
    setCurrentCountry(random);
    setFeedback("");
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const handleSelect = (selectedContinent) => {
    if (feedback) return; // Evitar duplo clique

    if (selectedContinent === currentCountry.continent) {
      playSound('correct');
      const newScore = score + 1;
      setScore(newScore);
      updateHighScore(newScore);
      setFeedback("Correto! 🎉");
      setTimeout(loadNewQuestion, 1500);
    } else {
      playSound('wrong');
      setFeedback(`❌ Errado! Fica na ${currentCountry.continent}.`);
      setScore(0); // Reset score on wrong answer
    }
  };

  if (!currentCountry) return <div>Carregando...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
             <p className="text-sm text-gray-500 dark:text-gray-400">Recorde</p>
             <p className="text-xl font-bold text-amber-500">{highScore}</p>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pontuação: {score}</h2>
          <Globe className="w-8 h-8 text-amber-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Em qual continente fica <span className="text-amber-500">{currentCountry.name}</span>?
        </h2>

        <motion.div
          key={currentCountry.code}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <img
            src={`/flags/${currentCountry.code}.svg`}
            alt={currentCountry.name}
            className="w-64 h-auto rounded-lg shadow-lg border dark:border-gray-700"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              onClick={() => handleSelect(continent)}
              disabled={!!feedback}
              className={`
                p-4 rounded-xl font-bold text-lg shadow-sm border-2 transition-all
                ${feedback && continent === currentCountry.continent ? 'bg-green-100 border-green-500 text-green-700' : ''}
                ${feedback && continent !== currentCountry.continent ? 'opacity-50' : 'hover:scale-105'}
                ${!feedback ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:text-white' : ''}
              `}
            >
              {continent}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 text-xl font-bold ${feedback.includes('Correto') ? 'text-green-600' : 'text-red-600'}`}
            >
              {feedback}
              
              {!feedback.includes('Correto') && (
                 <button
                 onClick={loadNewQuestion}
                 className="block mx-auto mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
               >
                 Próxima
               </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            const text = `Acertei ${score} continentes no Quiz Bandeiras do Mundo! 🗺️\nVocê sabe geografia? Jogue agora: https://bandeirasdomundo.com`;
            if (navigator.share) {
              navigator.share({ title: 'Quiz Continente', text, url: 'https://bandeirasdomundo.com' });
            } else {
              navigator.clipboard.writeText(text);
              alert("Copiado!");
            }
          }}
          className="mt-12 text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2 hover:underline"
        >
          <Share2 className="w-4 h-4" /> Compartilhar Pontuação
        </button>
      </div>
    </main>
  );
}

export default QuizContinente;