import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allCountries } from "../../data/countryLoader";
import { getSimilarFlags } from "../../utils/colorUtils";
import { Shuffle, CheckCircle, XCircle, Share2 } from "lucide-react";
import { useSound } from "../../hooks/useSound";
import { useQuestionPool } from "../../hooks/useQuestionPool";
import { useHighScore } from "../../hooks/useHighScore";
import { useMastery } from "../../hooks/useMastery";

function QuizBandeira() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("médio");
  const [loading, setLoading] = useState(true);

  const { getNextCountry } = useQuestionPool();
  const { highScore, updateHighScore } = useHighScore('bandeira');
  const { incrementMastery } = useMastery();
  const playSound = useSound();

  const loadNewQuestion = async () => {
    setLoading(true);
    setFeedback("");
    const random = getNextCountry();
    setCurrentCountry(random);

    // número de opções erradas varia com a dificuldade
    const n = 3;
    const similar = await getSimilarFlags(random, allCountries, n, difficulty);

    const answers = [...similar, random].sort(() => Math.random() - 0.5);
    setOptions(answers);
    setLoading(false);
  };

  const handleSelect = (selected) => {
    if (!currentCountry) return;
    if (selected.code === currentCountry.code) {
      playSound('correct');
      const newScore = score + 1;
      setScore(newScore);
      updateHighScore(newScore);
      incrementMastery(currentCountry.code); // Track mastery
      setFeedback("Correto! 🎉");
      setTimeout(loadNewQuestion, 1200);
    } else {
      playSound('wrong');
      setFeedback(`❌ Errado! Era ${currentCountry.name}.`);
      setScore(0); // Reset score on wrong answer for infinite mode
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, [difficulty]);

  if (loading || !currentCountry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 dark:text-gray-300">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 min-h-screen overflow-hidden transition-colors">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Qual é a bandeira de <span className="text-amber-500">{currentCountry.name}</span>?
        </h2>

        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">Recorde</p>
            <p className="text-xl font-bold text-amber-500">{highScore}</p>
          </div>
          
          <div className="text-right">
             <p className="text-sm text-gray-500 dark:text-gray-400">Pontuação</p>
             <p className="text-xl font-bold text-gray-800 dark:text-white">{score}</p>
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="ml-4 p-2 rounded-md border-2 border-amber-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <option value="fácil">Fácil</option>
            <option value="médio">Médio</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCountry.code}
            className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-6 justify-items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt.code}
                onClick={() => handleSelect(opt)}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img
                  src={`/flags/${opt.code}.svg`}
                  alt={opt.name}
                  className="w-36 h-auto rounded-md border dark:border-gray-700"
                />
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {feedback && (
          <motion.p
            key={feedback}
            className={`mt-6 text-lg font-semibold ${
              feedback.includes("Correto")
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {feedback}
          </motion.p>
        )}

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={loadNewQuestion}
            className="px-5 py-2 bg-amber-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-amber-600 transition-colors"
          >
            <Shuffle className="w-5 h-5" /> Pular
          </button>
          
          <button
            onClick={() => {
              const text = `Acertei ${score} bandeiras no Quiz Bandeiras do Mundo! 🌍\nVocê consegue me superar? Jogue agora: https://bandeirasdomundo.com`;
              if (navigator.share) {
                navigator.share({
                  title: 'Bandeiras do Mundo',
                  text: text,
                  url: 'https://bandeirasdomundo.com',
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(text);
                alert("Link copiado para a área de transferência!");
              }
            }}
            className="px-5 py-2 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <Share2 className="w-5 h-5" /> Compartilhar
          </button>
        </div>


        {/* Seção Educativa para SEO e Valor do Usuário */}
        <div className="mt-12 max-w-3xl text-left space-y-8 border-t border-gray-100 dark:border-gray-800 pt-8">
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-3">
              Por que aprender as bandeiras?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              As bandeiras são muito mais do que pedaços de tecido colorido; elas são a representação visual da história, cultura e valores de uma nação. 
              Ao memorizar as bandeiras do mundo, você não apenas exercita sua memória visual, mas também desenvolve uma compreensão mais profunda da geografia global e das relações internacionais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Como Jogar
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Observe a bandeira apresentada e escolha o país correto entre as opções. Quanto mais rápido você responder, mais você treina seu cérebro para reconhecimento instantâneo.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Sistema de Pontuação
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mantenha sua sequência de acertos para bater seu recorde pessoal. Cada acerto contribui para o seu nível de domínio daquele país específico.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default QuizBandeira;
