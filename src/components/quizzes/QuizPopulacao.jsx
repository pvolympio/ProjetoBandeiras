import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../../data/countryLoader';
import { ArrowUp, ArrowDown, Users, Share2 } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useQuestionPool } from '../../hooks/useQuestionPool';
import { useHighScore } from '../../hooks/useHighScore';

function QuizPopulacao() {
  const [countryA, setCountryA] = useState(null);
  const [countryB, setCountryB] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [reveal, setReveal] = useState(false);
  const playSound = useSound();
  const { getNextCountry } = useQuestionPool();
  const { highScore, updateHighScore } = useHighScore('populacao');

  // Formatar número
  const formatPop = (num) => new Intl.NumberFormat('pt-BR').format(num);

  // Iniciar jogo
  const startGame = () => {
    const randomA = getNextCountry();
    let randomB = getNextCountry();
    
    // Garante que não são o mesmo país
    while (randomA.code === randomB.code) {
      randomB = getNextCountry();
    }
    
    setCountryA(randomA);
    setCountryB(randomB);
    setScore(0);
    setGameOver(false);
    setReveal(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  // Próxima rodada
  const nextRound = () => {
    setCountryA(countryB);
    let randomB = getNextCountry();
    while (randomB.code === countryB.code) {
      randomB = getNextCountry();
    }
    setCountryB(randomB);
    setReveal(false);
  };

  const handleGuess = (guess) => {
    if (reveal) return;
    setReveal(true);

    const isHigher = countryB.population > countryA.population;
    const isCorrect = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);

    if (isCorrect) {
      playSound('correct');
      const newScore = score + 1;
      setScore(newScore);
      updateHighScore(newScore);
      setTimeout(nextRound, 2000);
    } else {
      playSound('wrong');
      setTimeout(() => setGameOver(true), 2000);
    }
  };

  if (!countryA || !countryB) return <div>Carregando...</div>;

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Fim de Jogo!</h1>
        <p className="text-xl mb-2">Você acertou {score} seguidas.</p>
        <p className="text-amber-500 font-bold mb-6 text-lg">
            Recorde: {highScore}
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button onClick={startGame} className="py-3 bg-amber-500 rounded-lg font-bold hover:bg-amber-600 transition">
            Tentar Novamente
          </button>
          <button
            onClick={() => {
              const text = `Acertei ${score} seguidas no Quiz População! 👥\nVocê sabe quem tem mais gente? Jogue agora: https://bandeirasdomundo.com`;
              if (navigator.share) {
                navigator.share({ title: 'Quiz População', text, url: 'https://bandeirasdomundo.com' });
              } else {
                navigator.clipboard.writeText(text);
                alert("Copiado!");
              }
            }}
            className="py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Desafiar Amigos
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white overflow-hidden">
      {/* País A */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-800 relative border-b-4 md:border-b-0 md:border-r-4 border-gray-900">
        <img src={`/flags/${countryA.code}.svg`} alt={countryA.name} className="w-48 mb-4 rounded shadow-lg" />
        <h2 className="text-3xl font-bold mb-2 text-center">{countryA.name}</h2>
        <p className="text-lg text-gray-400">tem uma população de</p>
        <p className="text-4xl font-black text-amber-400 mt-2">{formatPop(countryA.population)}</p>
      </div>

      {/* VS Badge */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shadow-xl border-4 border-gray-900">
        VS
      </div>

      {/* País B */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-800 relative">
        <img src={`/flags/${countryB.code}.svg`} alt={countryB.name} className="w-48 mb-4 rounded shadow-lg" />
        <h2 className="text-3xl font-bold mb-2 text-center">{countryB.name}</h2>
        <p className="text-lg text-gray-400">tem uma população...</p>
        
        {!reveal ? (
          <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
            <button
              onClick={() => handleGuess('higher')}
              className="py-4 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <ArrowUp className="w-6 h-6" /> MAIOR
            </button>
            <button
              onClick={() => handleGuess('lower')}
              className="py-4 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <ArrowDown className="w-6 h-6" /> MENOR
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center"
          >
            <p className={`text-4xl font-black ${countryB.population > countryA.population ? 'text-green-400' : 'text-red-400'}`}>
              {formatPop(countryB.population)}
            </p>
          </motion.div>
        )}
        
        <p className="mt-4 text-sm text-gray-500">que {countryA.name}</p>
      </div>
      
      <div className="absolute bottom-4 right-4 text-xl font-bold bg-black/50 px-4 py-2 rounded-lg">
        Pontos: {score}
      </div>
    </main>
  );
}

export default QuizPopulacao;