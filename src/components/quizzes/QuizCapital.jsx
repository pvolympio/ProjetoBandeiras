import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../../data/countryLoader';
import { normalizeString } from '../../utils/normalizeString';
import { CheckCircle, SkipForward, Eye } from 'lucide-react';

function QuizCapital() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const inputRef = useRef(null);

  // Seleciona um país aleatório que tenha capital válida
  const selectNewCountry = () => {
    const countriesWithCapital = allCountries.filter(c => c.capital);
    const randomIndex = Math.floor(Math.random() * countriesWithCapital.length);
    const newCountry = countriesWithCapital[randomIndex];
    setCurrentCountry(newCountry);
    setInputValue('');
    setFeedback('');
    setShowAnswer(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    selectNewCountry();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCountry) return;

    const respostaCorreta = normalizeString(currentCountry.capital);
    const respostaJogador = normalizeString(inputValue);

    if (respostaCorreta === respostaJogador) {
      setScore((prev) => prev + 1);
      setFeedback('Correto! 🎉 Próxima bandeira...');
      setTimeout(() => selectNewCountry(), 1500);
    } else {
      setFeedback('Incorreto 😕 Tente novamente!');
      const input = document.getElementById('quiz-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      inputRef.current?.focus();
    }
  };

  const handleSkip = () => {
    setFeedback(`A resposta era: ${currentCountry.capital}`);
    setTimeout(() => selectNewCountry(), 2000);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake { animation: shake 0.4s ease-in-out; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!currentCountry) {
    return <div className="text-center p-10 text-gray-700 dark:text-gray-200">Carregando...</div>;
  }

  const feedbackColor = feedback.startsWith('Correto')
    ? 'text-green-600 dark:text-green-400'
    : feedback.startsWith('Incorreto')
    ? 'text-red-600 dark:text-red-400'
    : 'text-amber-600 dark:text-amber-400';

  return (
    <main className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="w-full max-w-md text-center">
        {/* Placar e progresso */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Pontuação: {score}</h2>
          <div className="h-2 flex-1 ml-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all"
              style={{ width: `${(score % 10) * 10}%` }}
            ></div>
          </div>
        </div>

        {/* Bandeira com animação */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCountry.code}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 h-48 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={`/flags/${currentCountry.code}.svg`}
              alt={`Bandeira de ${currentCountry.name}`}
              className="w-48 h-auto object-contain border border-gray-300 dark:border-gray-700 rounded-md"
            />
          </motion.div>
        </AnimatePresence>

        {/* Campo de resposta */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            id="quiz-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite o nome da capital..."
            disabled={feedback.startsWith('Correto')}
            className="
              w-full p-3 rounded-lg border-2 border-blue-500
              text-gray-800 dark:text-gray-100
              bg-gray-50 dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-400
              placeholder-gray-500 dark:placeholder-gray-400
              shadow-sm mb-4 transition
            "
          />
          <button
            type="submit"
            disabled={feedback.startsWith('Correto')}
            className="
              w-full flex justify-center items-center gap-2 p-3 rounded-lg
              bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors
              disabled:bg-gray-400
            "
          >
            <CheckCircle className="w-5 h-5" /> Verificar
          </button>
        </form>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            disabled={feedback.startsWith('Correto')}
            className="
              flex-1 p-2 rounded-lg bg-amber-500 text-white
              hover:bg-amber-600 transition flex items-center justify-center gap-2
            "
          >
            <Eye className="w-4 h-4" /> Mostrar resposta
          </button>

          <button
            onClick={handleSkip}
            disabled={feedback.startsWith('Correto')}
            className="
              flex-1 p-2 rounded-lg bg-gray-300 text-gray-700
              dark:bg-gray-700 dark:text-gray-200
              hover:bg-gray-400 dark:hover:bg-gray-600
              transition flex items-center justify-center gap-2
            "
          >
            <SkipForward className="w-4 h-4" /> Pular
          </button>
        </div>

        {/* Feedback e resposta */}
        <AnimatePresence>
          {feedback && (
            <motion.p
              key={feedback}
              className={`mt-4 text-lg font-semibold ${feedbackColor}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>

        {showAnswer && (
          <motion.p
            className="mt-2 text-gray-700 dark:text-gray-300 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            💡 Dica: {currentCountry.capital}
          </motion.p>
        )}
      </div>
    </main>
  );
}

export default QuizCapital;
