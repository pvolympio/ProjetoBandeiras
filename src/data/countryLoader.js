import worldCountries from 'world-countries';

const allCountriesRaw = worldCountries;

const formattedCountries = allCountriesRaw
  .map((country) => {
    const code = country.cca2 ? country.cca2.toLowerCase() : null;
    if (!code) return null;

    const namePt = country.translations?.por?.common || country.name.common;
    const officialPt = country.translations?.por?.official || country.name.official;

    return {
      name: namePt,
      officialName: officialPt,
      code,
      capital: country.capital ? country.capital[0] : '—',
      continent: country.region === 'Americas' ? 'Américas' :
                 country.region === 'Europe' ? 'Europa' :
                 country.region === 'Africa' ? 'África' :
                 country.region === 'Asia' ? 'Ásia' :
                 country.region === 'Oceania' ? 'Oceania' : country.region,
      subregion: country.subregion || '—',
      population: country.population,
      area: country.area,
    };
  })
  .filter((c) => c !== null);

export const allCountries = formattedCountries;
