import { useMemo, useState } from 'react';
import countries from '../data/countries';

function FuncaoBandeiras() {
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1) SNAPSHOT IMUTÁVEL do countries para evitar mutações externas ---
  // pegamos uma cópia ao montar o componente e usamos sempre essa cópia
  const baseCountries = useMemo(() => {
    // Garantimos que cada item tem code e name
    return Array.isArray(countries) ? countries.map(c => ({ ...c })) : [];
  }, []);

  // --- 2) Importa dinamicamente bandeiras (uma vez) e cria um mapa {code: url} ---
  const flagMap = useMemo(() => {
    const flags = import.meta.glob('../assets/flags/*.svg', {
      eager: true,
      query: '?url',
      import: 'default',
    });

    const map = {};
    for (const path in flags) {
      const file = path.split('/').pop(); // ex: 'nl.svg'
      if (!file) continue;
      const code = file.replace('.svg', '').toLowerCase();
      map[code] = flags[path];
    }
    return map;
  }, []); // roda apenas uma vez

  // --- 3) Filtragem em useMemo para estabilidade ---
  const filteredAndUnique = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered =
      term === ''
        ? baseCountries
        : baseCountries.filter(({ name = '', code = '' }) => {
            return (
              name.toLowerCase().includes(term) ||
              code.toLowerCase().includes(term)
            );
          });

    // --- 4) ELIMINA DUPLICATAS por código (mantendo a primeira ocorrência) ---
    const uniqueByCode = [];
    const seen = new Set();
    for (const c of filtered) {
      const key = (c.code || '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueByCode.push(c);
      } else {
        // opcional: log para depuração
        // console.warn('duplicated country filtered out:', c);
      }
    }

    return uniqueByCode;
  }, [searchTerm, baseCountries]);

  // --- DEBUG: detectar se baseCountries já contêm duplicatas ao montar ---
  // (descomente se quiser inspecionar)
  // useEffect(() => {
  //   const dups = baseCountries.reduce((acc, cur) => {
  //     const k = (cur.code || '').toLowerCase();
  //     acc[k] = (acc[k] || 0) + 1;
  //     return acc;
  //   }, {});
  //   Object.entries(dups).forEach(([k, v]) => {
  //     if (v > 1) console.warn(`Duplicated in source countries: ${k} appears ${v} times`);
  //   });
  // }, [baseCountries]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Campo de pesquisa */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Pesquisar por nome ou código (ex: br, us)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full max-w-md p-3 rounded-lg border-2 border-amber-500
            text-gray-800 dark:text-gray-100
            bg-gray-50 dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-amber-400
            placeholder-gray-500 dark:placeholder-gray-400
            shadow-sm
          "
        />
      </div>

      {/* Grid de bandeiras */}
      <div
        className="
          grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
          gap-5 p-5
        "
        role="list"
      >
        {filteredAndUnique.length > 0 ? (
          filteredAndUnique.map(({ code, name }) => {
            const lower = (code || '').toLowerCase();
            const src = flagMap[lower] || ''; // evita undefined
            return (
              <div
                key={lower || name} // chave única e estável
                className="
                  border-2 border-amber-500 rounded-lg p-4 text-center
                  transition-all duration-200 ease-in-out
                  hover:scale-105 hover:shadow-lg
                  dark:hover:bg-gray-800
                "
                role="listitem"
              >
                <img
                  src={src}
                  alt={name}
                  width="80"
                  height="80"
                  loading="lazy"
                  className="w-20 h-auto rounded-lg inline-block shadow-sm"
                />
                <p
                  className="
                    mt-2 text-sm font-medium
                    text-gray-700 dark:text-gray-200
                  "
                >
                  {name}
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
            Nenhum país encontrado 😕
          </p>
        )}
      </div>
    </div>
  );
}

export default FuncaoBandeiras;
