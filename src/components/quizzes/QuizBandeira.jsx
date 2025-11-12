import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allCountries } from "../../data/countryLoader";
import { getSimilarFlags } from "../../utils/colorUtils";
import { Shuffle, CheckCircle, XCircle } from "lucide-react";

function QuizBandeira() {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("médio");
  const [loading, setLoading] = useState(true);

  const loadNewQuestion = async () => {
    setLoading(true);
    setFeedback("");
    const random = allCountries[Math.floor(Math.random() * allCountries.length)];
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
      setScore((s) => s + 1);
      setFeedback("Correto! 🎉");
      setTimeout(loadNewQuestion, 1200);
    } else {
      setFeedback(`❌ Errado! Era ${currentCountry.name}.`);
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
          <p className="text-gray-700 dark:text-gray-300">Pontuação: {score}</p>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded-md border-2 border-amber-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
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

        <button
          onClick={loadNewQuestion}
          className="mt-6 px-5 py-2 bg-amber-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-amber-600 transition-colors"
        >
          <Shuffle className="w-5 h-5" /> Próxima
        </button>
      </div>
    </main>
  );
}

export default QuizBandeira;
