import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCountries } from '../data/countryLoader';

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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [continentFilter, setContinentFilter] = useState('todos');

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
              <motion.div
                key={country.code}
                variants={flagVariants}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCountry(country)}
                className="
                  cursor-pointer border-2 border-amber-500 rounded-lg p-4 text-center
                  transition-all duration-200 ease-in-out dark:hover:bg-gray-800
                "
              >
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
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
            Nenhum país encontrado 😕
          </p>
        )}
      </motion.div>

      {/* Modal de informações */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setSelectedCountry(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-lg"
                onClick={() => setSelectedCountry(null)}
              >
                ✕
              </button>

              <img
                src={`/flags/${selectedCountry.code}.svg`}
                alt={selectedCountry.name}
                className="w-32 mx-auto rounded-lg mb-4 border dark:border-gray-600"
              />
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                {selectedCountry.name}
              </h2>

              <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1 text-center">
                <p><strong>Nome oficial:</strong> {selectedCountry.officialName}</p>
                <p><strong>Continente:</strong> {selectedCountry.continent}</p>
                <p><strong>Capital:</strong> {selectedCountry.capital || '—'}</p>
                <p>
                  <strong>População:</strong>{' '}
                  {selectedCountry.population
                    ? selectedCountry.population.toLocaleString('pt-BR')
                    : '—'}
                </p>
                <p>
                  <strong>Área:</strong>{' '}
                  {selectedCountry.area
                    ? selectedCountry.area.toLocaleString('pt-BR') + ' km²'
                    : '—'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FuncaoBandeiras;
