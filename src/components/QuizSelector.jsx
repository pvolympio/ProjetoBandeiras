import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flag, MapPin, Globe, Video, Zap, Users, Map } from "lucide-react";

function QuizSelector() {
  const navigate = useNavigate();

  const quizzes = [
    {
      title: "Nome do País",
      description: "Adivinhe o país pela bandeira 🇧🇷",
      path: "/quiz/nome-pais",
      icon: <Globe className="w-8 h-8 text-amber-400" />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Capital",
      description: "Descubra qual é a capital 🏙️",
      path: "/quiz/capital",
      icon: <MapPin className="w-8 h-8 text-amber-400" />,
      gradient: "from-sky-500 to-blue-600",
    },
    {
      title: "Bandeira",
      description: "Escolha a bandeira correta 🚩",
      path: "/quiz/bandeira",
      icon: <Flag className="w-8 h-8 text-amber-400" />,
      gradient: "from-rose-500 to-pink-600",
    },
    {
      title: "Quiz Relâmpago",
      description: "60 segundos para acertar o máximo! ⚡",
      path: "/quiz/relampago",
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      title: "População",
      description: "Qual país tem mais gente? 👥",
      path: "/quiz/populacao",
      icon: <Users className="w-8 h-8 text-amber-400" />,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      title: "Continente",
      description: "Onde fica este país? 🗺️",
      path: "/quiz/continente",
      icon: <Map className="w-8 h-8 text-amber-400" />,
      gradient: "from-teal-500 to-cyan-600",
    },/*
    {
      title: "Modo TikTok",
      description: "Versão vertical para gravar vídeos 🎥",
      path: "/quiz/tiktok",
      icon: <Video className="w-8 h-8 text-amber-400" />,
      gradient: "from-purple-500 to-indigo-600",
    },/*
    {
      title: "Modo Youtube",
      description: "Versão horizontal para gravar vídeos 🎥",
      path: "/quiz-youtube",
      icon: <Video className="w-8 h-8 text-amber-400" />,
      gradient: "from-purple-500 to-indigo-600",
    },*/
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-6">
      <motion.h1
        className="text-4xl font-bold mb-10 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌍 Selecione seu Quiz
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz.path}
            className={`
              p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700 
              bg-gradient-to-br ${quiz.gradient} text-white transition-transform hover:scale-105
              flex flex-col items-center justify-center
            `}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(quiz.path)}
          >
            <div className="mb-3">{quiz.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-sm opacity-90">{quiz.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.footer
        className="mt-12 text-gray-500 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Desenvolvido por <span className="text-amber-500 font-semibold">@quizdebandeiras</span>
      </motion.footer>
    </main>
  );
}

export default QuizSelector;
