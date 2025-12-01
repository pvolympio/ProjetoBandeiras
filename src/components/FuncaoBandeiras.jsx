import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../data/countryLoader';
import { Star } from 'lucide-react';
import { useMastery } from '../hooks/useMastery';
import { Link } from 'react-router-dom';

// Função auxiliar para normalizar texto na busca
function normalizeForSearch(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim();
}

function FuncaoBandeiras() {
  const [searchTerm, setSearchTerm] = useState('');
  const [continentFilter, setContinentFilter] = useState('todos');
  const { isMastered } = useMastery();

  // Lista base de países, ordenada em português
  const baseCountries = useMemo(() => {
    if (!Array.isArray(allCountries)) return [];
    return [...allCountries].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR')
    );
  }, []);

  // Lista de continentes únicos
  const continents = useMemo(() => {
    const setCont = new Set();
    for (const c of baseCountries) {
      if (c.continent) setCont.add(c.continent);
    }
    return ['todos', ...Array.from(setCont).sort((a, b) => a.localeCompare(b, 'pt-BR'))];
  }, [baseCountries]);

  // Filtro combinado (busca + continente)
  const filteredAndUnique = useMemo(() => {
    const termNorm = normalizeForSearch(searchTerm);

    const filtered = baseCountries.filter((country) => {
      if (continentFilter !== 'todos' && country.continent !== continentFilter)
        return false;

      if (!termNorm) return true;

      const nameNorm = normalizeForSearch(country.name || '');
      const codeNorm = normalizeForSearch(country.code || '');
      const capitalNorm = normalizeForSearch(country.capital || '');

      return (
        nameNorm.includes(termNorm) ||
        codeNorm.includes(termNorm) ||
        capitalNorm.includes(termNorm)
      );
    });

    const unique = [];
    const seen = new Set();
    for (const c of filtered) {
      const key = String(c.code || '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
    }

    return unique;
  }, [searchTerm, continentFilter, baseCountries]);

  // Variantes de animação
  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  };
  const flagVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setContinentFilter('todos');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Introdução e SEO Content */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-amber-600 dark:text-amber-500 mb-4">
          Explore as Bandeiras de Todos os Países
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Bem-vindo ao <strong>Bandeiras do Mundo</strong>, sua enciclopédia interativa definitiva sobre vexilologia e geografia. 
          Navegue por nossa coleção completa de bandeiras, aprenda sobre capitais, populações e continentes. 
          Prepare-se para nossos quizzes desafiadores e torne-se um mestre da geografia global!
        </p>
      </div>

      {/* Header com busca + dropdown + botão limpar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome, código ou capital (ex: br, brasil, paris)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          className="
            w-full max-w-md p-3 rounded-lg border-2 border-amber-500
            text-gray-800 dark:text-gray-100
            bg-gray-50 dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-amber-400
            placeholder-gray-500 dark:placeholder-gray-400
            shadow-sm
          "
        />

        <select
          value={continentFilter}
          onChange={(e) => setContinentFilter(e.target.value)}
          className="
            p-3 rounded-lg border-2 border-amber-500
            bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
            focus:outline-none focus:ring-2 focus:ring-amber-400
          "
        >
          {continents.map((cont) => (
            <option key={cont} value={cont}>
              {cont === 'todos' ? 'Todos os continentes' : cont}
            </option>
          ))}
        </select>

        <button
          onClick={handleClearFilters}
          className="
            px-4 py-3 rounded-lg bg-amber-500 text-white font-medium
            hover:bg-amber-600 transition-colors shadow-sm
          "
        >
          Limpar filtros
        </button>
      </div>

      {/* Grid de bandeiras */}
      <motion.div
        key={`${searchTerm}-${continentFilter}`} // 👈 força reanimação
        className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-5 p-5"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredAndUnique.length > 0 ? (
          filteredAndUnique.map((country) => {
            const src = `/flags/${(country.code || '').toLowerCase()}.svg`;
            return (
              <Link
                to={`/pais/${country.code}`}
                key={country.code}
              >
                <motion.div
                  variants={flagVariants}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    cursor-pointer border-2 border-amber-500 rounded-lg p-4 text-center
                    transition-all duration-200 ease-in-out dark:hover:bg-gray-800 relative
                  "
                >
                  {isMastered(country.code) && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 shadow-md" title="Dominado!">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  <img
                    src={src}
                    alt={country.name}
                    width="80"
                    height="80"
                    loading="lazy"
                    className="w-20 h-auto rounded-lg inline-block shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/flags/placeholder.svg';
                    }}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {country.name}
                  </p>
                  {country.continent && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {country.continent}
                    </p>
                  )}
                </motion.div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
            Nenhum país encontrado 😕
          </p>
        )}
      </motion.div>

      {/* Seção de Destaque / Curiosidade Aleatória para SEO */}
      <div className="max-w-4xl mx-auto mt-12 mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            <Star className="w-8 h-8 text-amber-500" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Você sabia?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Existem 193 países membros das Nações Unidas, mas se contarmos territórios dependentes e estados com reconhecimento limitado, o número de bandeiras para aprender passa de 250! 
              Cada bandeira conta uma história única sobre a geografia, política e cultura de seu povo.
            </p>
            <Link 
              to="/curiosidades" 
              className="inline-block mt-4 text-amber-600 dark:text-amber-400 font-medium hover:underline"
            >
              Ler mais curiosidades →
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
}

export default FuncaoBandeiras;
