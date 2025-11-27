import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, MapPin, Globe, Users, Zap, Type, Map } from 'lucide-react';

const quizzes = [
  {
    id: 'bandeira',
    title: "Adivinhe a Bandeira",
    description: "Identifique o país pela sua bandeira nacional 🏳️",
    path: "/quiz/bandeira",
    icon: <Flag className="w-8 h-8 text-amber-400" />,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 'capital',
    title: "Capitais",
    description: "Você sabe qual é a capital deste país? 🏛️",
    path: "/quiz/capital",
    icon: <MapPin className="w-8 h-8 text-amber-400" />,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 'nome-pais',
    title: "Nome do País",
    description: "Como se escreve o nome deste país? ✍️",
    path: "/quiz/nome-pais",
    icon: <Type className="w-8 h-8 text-amber-400" />,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: 'relampago',
    title: "Quiz Relâmpago",
    description: "60 segundos para acertar o máximo! ⚡",
    path: "/quiz/relampago",
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    id: 'populacao',
    title: "População",
    description: "Qual país tem mais gente? 👥",
    path: "/quiz/populacao",
    icon: <Users className="w-8 h-8 text-amber-400" />,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 'continente',
    title: "Continente",
    description: "Onde fica este país? 🗺️",
    path: "/quiz/continente",
    icon: <Map className="w-8 h-8 text-amber-400" />,
    gradient: "from-teal-500 to-cyan-600",
  },
];

function QuizSelector() {
  const getHighScore = (id) => {
    return localStorage.getItem(`highscore_${id}`) || 0;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4">
            Escolha seu <span className="text-amber-500">Desafio</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Teste seus conhecimentos geográficos em diferentes modos de jogo.
            Colecione recordes e aprenda se divertindo!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.path}
              to={quiz.path}
              className={`
                relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                transform hover:-translate-y-1 transition-all duration-300 group
                bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
              `}
            >
              <div className={`
                absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${quiz.gradient}
                opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150
              `} />
              
              <div className="relative z-10">
                <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  {quiz.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[3rem]">
                  {quiz.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recorde: <span className="text-amber-500 font-bold">{getHighScore(quiz.id)}</span>
                  </span>
                  <span className="text-amber-500 font-bold group-hover:translate-x-1 transition-transform">
                    Jogar →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default QuizSelector;
