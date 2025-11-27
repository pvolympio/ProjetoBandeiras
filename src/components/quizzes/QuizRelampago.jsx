import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../../data/countryLoader';
import { getSimilarFlags } from '../../utils/colorUtils';
import { Timer, Share2, Play, RotateCcw } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useQuestionPool } from '../../hooks/useQuestionPool';

function QuizRelampago() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const playSound = useSound();
  const { getNextCountry, resetPool } = useQuestionPool();

  // Iniciar o jogo
  const startGame = () => {
    resetPool(); // Garante que começa com todos os países disponíveis
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    loadNewQuestion();
  };

  // Carregar nova pergunta
  const loadNewQuestion = async () => {
    const random = getNextCountry();
    setCurrentCountry(random);
    
    // 3 opções erradas + 1 certa
    const similar = await getSimilarFlags(random, allCountries, 3, 'médio');
    const answers = [...similar, random].sort(() => Math.random() - 0.5);
    setOptions(answers);
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
      playSound('wrong'); // Som de fim de jogo
    }
  }, [gameState, timeLeft, playSound]);

  // Verificar resposta
  const handleSelect = (selected) => {
    if (selected.code === currentCountry.code) {
      playSound('correct');
      setScore((s) => s + 1);
      loadNewQuestion();
    } else {
      playSound('wrong');
      // Penalidade de tempo? Opcional. Vamos apenas pular para a próxima.
      loadNewQuestion();
    }
  };

  // Tela de Menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <Timer className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Relâmpago ⚡</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Quantas bandeiras você consegue acertar em 60 segundos?
          </p>
          <button
            onClick={startGame}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Play className="w-6 h-6" /> Começar Agora
          </button>
        </motion.div>
      </div>
    );
  }

  // Tela de Fim de Jogo
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Tempo Esgotado! ⏰</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Sua pontuação final:</p>
          <div className="text-6xl font-black text-amber-500 mb-8">{score}</div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={startGame}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Jogar Novamente
            </button>
            
            <button
              onClick={() => {
                const text = `Fiz ${score} pontos em 60s no Quiz Relâmpago! ⚡\nVocê consegue me vencer? Jogue agora: https://bandeirasdomundo.com`;
                if (navigator.share) {
                  navigator.share({ title: 'Quiz Relâmpago', text, url: 'https://bandeirasdomundo.com' });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("Copiado!");
                }
              }}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" /> Desafiar Amigos
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Tela de Jogo
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header do Jogo */}
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
            <span className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="text-xl font-bold text-amber-500">
            Pontos: {score}
          </div>
        </div>

        {/* Pergunta */}
        {currentCountry && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Qual é a bandeira de <span className="text-amber-500">{currentCountry.name}</span>?
            </h2>

            <div className="grid grid-cols-2 gap-4 w-full">
              <AnimatePresence mode="popLayout">
                {options.map((opt) => (
                  <motion.button
                    key={opt.code}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(opt)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center aspect-video"
                  >
                    <img
                      src={`/flags/${opt.code}.svg`}
                      alt="Bandeira"
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default QuizRelampago;