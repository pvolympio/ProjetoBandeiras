import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { allCountries } from '../data/countryLoader';
import { Trophy, Users, Map as MapIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

function Rankings() {
  const rankings = useMemo(() => {
    if (!allCountries) return null;

    const validCountries = allCountries.map(c => ({
      ...c,
      population: Number(c.population) || 0,
      area: Number(c.area) || 0
    })).filter(c => c.population > 0 && c.area > 0);

    const mostPopulous = [...validCountries]
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);

    const largestArea = [...validCountries]
      .sort((a, b) => b.area - a.area)
      .slice(0, 10);

    const smallestArea = [...validCountries]
      .sort((a, b) => a.area - b.area)
      .slice(0, 10);

    return { mostPopulous, largestArea, smallestArea };
  }, []);

  if (!rankings) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
            Rankings Globais 🏆
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Descubra os gigantes e os pequenos notáveis do nosso planeta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mais Populosos */}
          <RankingList 
            title="Mais Populosos" 
            icon={<Users className="w-6 h-6 text-blue-500" />}
            data={rankings.mostPopulous}
            valueKey="population"
            formatter={(val) => val.toLocaleString('pt-BR')}
            suffix="hab."
            color="blue"
          />

          {/* Maiores em Área */}
          <RankingList 
            title="Maiores em Área" 
            icon={<MapIcon className="w-6 h-6 text-green-500" />}
            data={rankings.largestArea}
            valueKey="area"
            formatter={(val) => val.toLocaleString('pt-BR')}
            suffix="km²"
            color="green"
          />

          {/* Menores em Área */}
          <RankingList 
            title="Menores em Área" 
            icon={<ArrowDown className="w-6 h-6 text-purple-500" />}
            data={rankings.smallestArea}
            valueKey="area"
            formatter={(val) => val.toLocaleString('pt-BR')}
            suffix="km²"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

function RankingList({ title, icon, data, valueKey, formatter, suffix, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 ${colors[color]} shadow-sm`}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        {icon} {title}
      </h2>
      <ul className="space-y-4">
        {data.map((country, index) => (
          <li key={country.code} className="flex items-center gap-3">
            <span className="font-bold text-gray-400 w-6 text-right">#{index + 1}</span>
            <Link to={`/pais/${country.code}`} className="flex items-center gap-3 flex-1 hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition">
              <img 
                src={`/flags/${country.code}.svg`} 
                alt={country.name} 
                className="w-8 h-6 object-cover rounded shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{country.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatter(country[valueKey])} {suffix}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default Rankings;
