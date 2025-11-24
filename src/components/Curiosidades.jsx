import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { allCountries } from '../data/countryLoader';
import { 
  Trophy, 
  Users, 
  Map as MapIcon, 
  Palette, 
  AlertTriangle, 
  Maximize2, 
  Minimize2,
  HelpCircle 
} from 'lucide-react';

function Curiosidades() {
  // --- CÁLCULO DE ESTATÍSTICAS (Robustecido) ---
  const stats = useMemo(() => {
    // 1. Se a lista estiver vazia, não há nada a fazer
    if (!allCountries || allCountries.length === 0) return null;

    // 2. Sanitização: Converte valores para número e filtra inválidos
    const validData = allCountries.map(c => ({
      ...c,
      population: Number(c.population) || 0, // Força conversão para número
      area: Number(c.area) || 0              // Força conversão para número
    }));

    // 3. Filtrar apenas quem tem dados positivos
    const withPop = validData.filter(c => c.population > 0);
    const withArea = validData.filter(c => c.area > 0);

    // Se não sobrar nenhum país válido após o filtro, retorna null
    if (withPop.length === 0 || withArea.length === 0) return null;

    // 4. Ordenação e seleção
    const mostPopulous = [...withPop].sort((a, b) => b.population - a.population)[0];
    const leastPopulous = [...withPop].sort((a, b) => a.population - b.population)[0];
    const largestArea = [...withArea].sort((a, b) => b.area - a.area)[0];
    const smallestArea = [...withArea].sort((a, b) => a.area - b.area)[0];

    return { mostPopulous, leastPopulous, largestArea, smallestArea };
  }, []);

  // --- CURIOSIDADES ESTÁTICAS ---
  const triviaFacts = [
    {
      id: 1,
      title: "A Única Não-Retangular",
      text: "A bandeira do Nepal 🇳🇵 é a única no mundo que não possui o formato retangular ou quadrado. Ela é formada por dois triângulos sobrepostos.",
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      color: "border-amber-500"
    },
    {
      id: 2,
      title: "As Mais Coloridas",
      text: "A bandeira de Belize 🇧🇿 possui 12 cores diferentes, tornando-a uma das mais complexas do mundo!",
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      color: "border-purple-500"
    },
    {
      id: 3,
      title: "A Mais Antiga",
      text: "A Dinamarca 🇩🇰 possui a bandeira nacional mais antiga em uso contínuo, conhecida como 'Dannebrog', adotada oficialmente em 1219.",
      icon: <Trophy className="w-6 h-6 text-red-500" />,
      color: "border-red-500"
    },
    {
      id: 4,
      title: "Bandeiras Quadradas",
      text: "Apenas dois países soberanos têm bandeiras perfeitamente quadradas: a Suíça 🇨🇭 e o Vaticano 🇻🇦.",
      icon: <Maximize2 className="w-6 h-6 text-blue-500" />,
      color: "border-blue-500"
    },
    {
      id: 5,
      title: "Roxo é Raro",
      text: "Historicamente, a cor roxa era muito cara de produzir (extraída de caracóis marinhos). Por isso, apenas duas bandeiras nacionais a usam: Dominica 🇩🇲 e Nicarágua 🇳🇮.",
      icon: <HelpCircle className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-500"
    },
    {
      id: 6,
      title: "Armas na Bandeira",
      text: "Moçambique 🇲🇿 é o único país cuja bandeira apresenta a imagem de um fuzil moderno (AK-47), simbolizando a defesa e a vigilância.",
      icon: <AlertTriangle className="w-6 h-6 text-green-600" />,
      color: "border-green-600"
    }
  ];

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
            Curiosidades Globais 🌍
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubra fatos fascinantes sobre as bandeiras e recordes dos países ao redor do mundo.
          </p>
        </motion.div>

        {/* SEÇÃO DE RECORDES */}
        {stats ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            <StatsCard 
              label="Maior População" 
              country={stats.mostPopulous} 
              value={`${(stats.mostPopulous.population / 1000000).toFixed(1)} mi`} 
              subLabel="habitantes"
              icon={<Users className="w-6 h-6 text-blue-500" />}
            />
            <StatsCard 
              label="Menor População" 
              country={stats.leastPopulous} 
              value={stats.leastPopulous.population.toLocaleString('pt-BR')} 
              subLabel="habitantes"
              icon={<Minimize2 className="w-6 h-6 text-cyan-500" />}
            />
            <StatsCard 
              label="Maior Área" 
              country={stats.largestArea} 
              value={stats.largestArea.area.toLocaleString('pt-BR')} 
              subLabel="km²"
              icon={<MapIcon className="w-6 h-6 text-green-500" />}
            />
            <StatsCard 
              label="Menor Área" 
              country={stats.smallestArea} 
              value={stats.smallestArea.area.toLocaleString('pt-BR')} 
              subLabel="km²"
              icon={<Minimize2 className="w-6 h-6 text-red-500" />}
            />
          </motion.div>
        ) : (
          // Se não houver dados (stats === null), mostramos um aviso discreto ou nada
          <div className="text-center py-4 mb-10 opacity-60 text-sm">
            {/* Opcional: <p>Dados estatísticos indisponíveis no momento.</p> */}
          </div>
        )}

        {/* SEÇÃO DE TRIVIA (Sempre visível) */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-500" />
          Você Sabia?
        </h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {triviaFacts.map((fact) => (
            <motion.div
              key={fact.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`
                bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${fact.color}
                hover:shadow-xl transition-all duration-300 relative overflow-hidden group
              `}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                {fact.icon}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {fact.icon}
                </div>
                <h3 className="font-bold text-lg">{fact.title}</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {fact.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

// Card individual de estatística
function StatsCard({ label, country, value, subLabel, icon }) {
  // Fallback de segurança caso country seja undefined
  if (!country) return null;

  return (
    <motion.div 
      variants={{
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
      }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-100 dark:border-gray-700"
    >
      <img 
        src={`/flags/${country.code}.svg`} 
        alt={country.name} 
        className="w-16 h-16 object-contain rounded-md shadow-sm bg-gray-50 dark:bg-gray-700"
        onError={(e) => { e.target.style.display = 'none'; }} // Esconde img se falhar
      />
      <div>
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {icon} {label}
        </div>
        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1" title={country.name}>
          {country.name}
        </h3>
        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
          {value} <span className="text-gray-400 text-xs">{subLabel}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default Curiosidades;