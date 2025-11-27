import React from 'react';
import { motion } from 'framer-motion';
import { useMastery } from '../hooks/useMastery';
import { useHighScore } from '../hooks/useHighScore';
import { Trophy, Star, Medal, Crown, Map, Flag, Zap, Users, Type, MapPin, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Perfil() {
  const { getTotalMastered } = useMastery();
  const totalStars = getTotalMastered();

  // Níveis baseados em estrelas
  const getLevel = (stars) => {
    if (stars >= 150) return { title: "Lenda da Geografia", color: "text-purple-500", icon: <Crown className="w-8 h-8" /> };
    if (stars >= 100) return { title: "Mestre das Bandeiras", color: "text-red-500", icon: <Medal className="w-8 h-8" /> };
    if (stars >= 50) return { title: "Aventureiro Global", color: "text-amber-500", icon: <Trophy className="w-8 h-8" /> };
    if (stars >= 10) return { title: "Explorador Curioso", color: "text-blue-500", icon: <Map className="w-8 h-8" /> };
    return { title: "Viajante Iniciante", color: "text-gray-500", icon: <Flag className="w-8 h-8" /> };
  };

  const level = getLevel(totalStars);

  // Helper para pegar high scores (já que o hook é por id)
  const getScore = (id) => localStorage.getItem(`highscore_${id}`) || 0;

  const stats = [
    { id: 'bandeira', label: 'Bandeiras', icon: <Flag className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { id: 'capital', label: 'Capitais', icon: <MapPin className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { id: 'nome-pais', label: 'Nomes', icon: <Type className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600' },
    { id: 'relampago', label: 'Relâmpago', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'populacao', label: 'População', icon: <Users className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'continente', label: 'Continentes', icon: <Map className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600' },
  ];

  const handleShare = async () => {
    const shareData = {
      title: `Meu Progresso no Bandeiras do Mundo`,
      text: `Eu já dominei ${totalStars} bandeiras e sou um ${level.title}! Tente me superar no Bandeiras do Mundo!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho do Perfil */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 text-center"
        >
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👤
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Seu Perfil</h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className={`${level.color} flex items-center gap-2 font-bold text-xl`}>
              {level.icon} {level.title}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Países Dominados</p>
              <p className="text-3xl font-black text-amber-500 flex items-center justify-center gap-2">
                {totalStars} <Star className="w-6 h-6 fill-current" />
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Próximo Nível</p>
              <p className="text-xl font-bold text-blue-500 mt-1">
                {totalStars < 10 ? 10 - totalStars : 
                 totalStars < 50 ? 50 - totalStars : 
                 totalStars < 100 ? 100 - totalStars : 
                 totalStars < 150 ? 150 - totalStars : 'Máximo!'} 
                 <span className="text-sm font-normal text-gray-400 ml-1">estrelas</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-bold shadow-lg transform hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar Progresso
          </button>
        </motion.div>

        {/* Recordes */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Seus Recordes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{getScore(stat.id)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/quiz" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition shadow-lg">
            Continuar Jogando
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Perfil;
