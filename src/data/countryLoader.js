import worldCountries from 'world-countries';
import localCountries from './countries';

const allCountriesRaw = worldCountries;

// Criar um mapa para busca rápida dos dados locais
const localDataMap = localCountries.reduce((acc, curr) => {
  acc[curr.code] = curr;
  return acc;
}, {});

const formattedCountries = allCountriesRaw
  .map((country) => {
    const code = country.cca2 ? country.cca2.toLowerCase() : null;
    if (!code) return null;

    // Tenta encontrar dados no nosso arquivo local
    const localData = localDataMap[code];

    const namePt = country.translations?.por?.common || country.name.common;
    const officialPt = country.translations?.por?.official || country.name.official;

    return {
      name: localData ? localData.name : namePt, // Prefere o nome do nosso arquivo
      officialName: officialPt,
      code,
      capital: localData ? localData.capital : (country.capital ? country.capital[0] : '—'),
      continent: localData ? localData.continent : (
                 country.region === 'Americas' ? 'Américas' :
                 country.region === 'Europe' ? 'Europa' :
                 country.region === 'Africa' ? 'África' :
                 country.region === 'Asia' ? 'Ásia' :
                 country.region === 'Oceania' ? 'Oceania' : country.region),
      subregion: country.subregion || '—',
      population: localData ? localData.population : country.population, // Prefere nossa população
      area: country.area,
    };
  })
  .filter((c) => c !== null && (localDataMap[c.code] || c.population > 0)); // Filtra apenas se tiver dados ou população válida

export const allCountries = formattedCountries;
