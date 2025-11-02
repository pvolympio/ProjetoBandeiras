// src/components/Quiz.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import countries from '../data/countries';
import { normalizeString } from '../utils/normalizeString';
import { Pointer } from 'lucide-react';

const allCountries = countries;

function Quiz() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const inputRef = useRef(null); // 👈 referência para o campo de resposta

  const selectNewCountry = () => {
    const randomIndex = Math.floor(Math.random() * allCountries.length);
    const newCountry = allCountries[randomIndex];
    setCurrentCountry(newCountry);
    setInputValue('');
    setFeedback('');

    // 👇 Garante que o input receba foco sempre que mudar de país
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    selectNewCountry();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const respostaCorreta = normalizeString(currentCountry.name);
    const respostaJogador = normalizeString(inputValue);

    if (respostaCorreta === respostaJogador) {
      setScore((prev) => prev + 1);
      setFeedback('Correto! Próxima bandeira...');

      setTimeout(() => {
        selectNewCountry();
      }, 1500);
    } else {
      setFeedback('Incorreto. Tente novamente!');
      document.getElementById('quiz-input')?.classList.add('animate-shake');
      setTimeout(() => {
        document.getElementById('quiz-input')?.classList.remove('animate-shake');
      }, 500);
      inputRef.current?.focus(); // 👈 volta o foco após erro
    }
  };

  const handleSkip = () => {
    setFeedback('A resposta era: ' + currentCountry.name);
    setTimeout(() => {
      selectNewCountry();
    }, 1500);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!currentCountry) {
    return <div className="text-center p-10 dark:text-white">Carregando...</div>;
  }

  const feedbackColor = feedback.startsWith('Correto')
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <main className="flex flex-col items-center p-6 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Pontuação: {score}
        </h2>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 h-48 flex items-center justify-center">
          <img
            src={`/flags/${currentCountry.code}.svg`}
            alt="Bandeira para adivinhar"
            className="w-48 h-auto object-contain border border-gray-300 dark:border-gray-700"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef} // 👈 adiciona o ref aqui
            id="quiz-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite o nome do país..."
            disabled={feedback.startsWith('Correto')}
            className="
              w-full p-3 rounded-lg border-2 border-amber-500
              text-gray-800 dark:text-gray-100
              bg-gray-50 dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-amber-400
              placeholder-gray-500 dark:placeholder-gray-400
              shadow-sm mb-4
            "
          />
          <button
            type="submit"
            disabled={feedback.startsWith('Correto')}
            className="
              w-full p-3 rounded-lg bg-green-600 text-white font-bold
              hover:bg-green-700 transition-colors
              disabled:bg-gray-400
            "
          >
            Verificar
          </button>
        </form>

        <button
          onClick={handleSkip}
          disabled={feedback.startsWith('Correto')}
          className="
            w-full p-2 mt-2 rounded-lg bg-gray-200 text-gray-700
            dark:bg-gray-700 dark:text-gray-200
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-colors
          "
        >
          Pular
        </button>

        {feedback && (
          <p className={`mt-4 text-lg font-semibold ${feedbackColor}`}>
            {feedback}
          </p>
        )}
      </div>
    </main>
  );
}

export default Quiz;
