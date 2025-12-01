/**
 * Gera uma descrição dinâmica e rica para um país com base em seus dados.
 * @param {Object} country - Objeto com dados do país (name, capital, population, continent, etc).
 * @param {Object} extraData - Dados extras do countryDetails.js (funFact, meaning, etc).
 * @returns {string} Descrição em texto corrido.
 */
export function generateCountryDescription(country, extraData = {}) {
  if (!country) return "";

  const { name, capital, population, continent, area } = country;
  const { funFact, meaning, currency, neighbors } = extraData;

  // Formata números
  const popFormatted = population ? population.toLocaleString('pt-BR') : "uma população não especificada";
  const areaFormatted = area ? `${area.toLocaleString('pt-BR')} km²` : null;

  // Parágrafo 1: Introdução Geográfica e Básica
  let intro = `O **${name}** é uma nação soberana localizada no continente **${continent}**. `;
  if (capital) {
    intro += `Sua capital e centro administrativo é a cidade de **${capital}**, que desempenha um papel central na política e cultura do país. `;
  }
  intro += `Com uma população estimada em cerca de **${popFormatted}** habitantes, o país possui uma identidade única na região.`;

  // Parágrafo 2: Detalhes Específicos (Moeda, Vizinhos, Área)
  let details = "";
  if (currency) {
    details += `A moeda oficial utilizada nas transações locais é o **${currency}**. `;
  }
  if (areaFormatted) {
    details += `O território nacional abrange uma área total de aproximadamente **${areaFormatted}**. `;
  }
  if (neighbors && neighbors.length > 0) {
    const neighborsStr = neighbors.join(", ");
    details += `Geograficamente, o país faz fronteira com: ${neighborsStr}, o que influencia suas relações diplomáticas e comerciais. `;
  }

  // Parágrafo 3: Curiosidades e Bandeira (se houver dados extras)
  let trivia = "";
  if (meaning) {
    trivia += `A bandeira nacional carrega um simbolismo profundo: ${meaning} `;
  }
  if (funFact) {
    trivia += `Um fato interessante sobre o ${name} é que: ${funFact} `;
  }
  
  // Se não houver curiosidades específicas, adiciona um texto genérico educativo
  if (!meaning && !funFact) {
    trivia += `A bandeira do ${name} é um símbolo de orgulho nacional e reflete a história e os valores de seu povo. Estudar a vexilologia deste país nos ajuda a compreender melhor a diversidade cultural do continente ${continent}.`;
  }

  return {
    intro,
    details,
    trivia
  };
}
