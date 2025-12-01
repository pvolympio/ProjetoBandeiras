import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Globe, Info, Play, Star, Share2 } from 'lucide-react';
import { allCountries } from '../data/countryLoader';
import { useMastery } from '../hooks/useMastery';
import { countryDetails } from '../data/countryDetails';
import { generateCountryDescription } from '../utils/textGenerator';

function PaisDetalhes() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isMastered, getMasteryLevel } = useMastery();

  const country = useMemo(() => {
    return allCountries.find(c => c.code === code);
  }, [code]);

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">País não encontrado 😕</h1>
        <Link to="/" className="text-amber-500 hover:underline">Voltar para o início</Link>
      </div>
    );
  }

  const extraData = countryDetails[country.code] || {};
  const mastered = isMastered(country.code);
  const masteryLevel = getMasteryLevel(country.code);

  const handleShare = async () => {
    const shareData = {
      title: `Bandeira do ${country.name}`,
      text: `Você sabia? ${extraData.funFact || `A capital do ${country.name} é ${country.capital}.`} Aprenda mais no Bandeiras do Mundo!`,
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
      <Helmet>
        <title>Bandeira do {country.name} - Significado, História e Curiosidades</title>
        <meta name="description" content={generateCountryDescription(country, extraData).intro.substring(0, 160) + "..."} />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header com Bandeira */}
          <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={`/flags/${country.code}.svg`}
              alt={`Bandeira do ${country.name}`}
              className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-6 border border-gray-100 dark:border-gray-700"
            />
            
            <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-3">
              {country.name}
              {mastered && <Star className="w-8 h-8 text-amber-500 fill-current" title="País Dominado!" />}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">{country.officialName || country.name}</p>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium"
            >
              <Share2 className="w-4 h-4" />
              Desafiar Amigos
            </button>
          </div>

          {/* Informações Principais (Grid) */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-700">
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
                <Info className="w-6 h-6 text-amber-500" /> Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Capital</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{country.capital || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">População</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {country.population ? country.population.toLocaleString('pt-BR') : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Continente</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{country.continent}</p>
                  </div>
                </div>

                {extraData.currency && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                      <span className="text-xl font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Moeda</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{extraData.currency}</p>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* Seção de Conteúdo Gerado (SEO + Informação) */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-700 space-y-6 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-amber-500" /> Sobre o {country.name}
              </h2>
              
              {(() => {
                const { intro, details, trivia } = generateCountryDescription(country, extraData);
                return (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    <p>{intro}</p>
                    <p>{details}</p>
                    <p>{trivia}</p>
                  </div>
                );
              })()}
            </div>

            {/* Curiosidades Específicas */}
            {(extraData.meaning || extraData.funFact) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {extraData.meaning && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">Significado da Bandeira</h3>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{extraData.meaning}"</p>
                  </div>
                )}

                {extraData.funFact && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">Você Sabia?</h3>
                    <p className="text-gray-700 dark:text-gray-300">{extraData.funFact}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seção Pratique */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
              <Play className="w-6 h-6 text-amber-500" /> Pratique
            </h2>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                  Teste seus conhecimentos!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Você já acertou este país <strong>{masteryLevel}</strong> vezes.
                  {mastered ? " Você é um mestre! 🌟" : " Continue jogando para dominar."}
                </p>
              </div>
              <Link 
                to="/quiz/bandeira" 
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Jogar Agora
              </Link>
            </div>
          </div>

          {/* Seção Veja Também */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Veja Também ({country.continent})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {useMemo(() => {
                const related = allCountries
                  .filter(c => c.continent === country.continent && c.code !== country.code)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 3);

                return related.map(rel => (
                  <Link 
                    key={rel.code} 
                    to={`/pais/${rel.code}`}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700"
                  >
                    <img 
                      src={`/flags/${rel.code}.svg`} 
                      alt={rel.name} 
                      className="w-12 h-8 object-cover rounded shadow-sm"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{rel.name}</span>
                  </Link>
                ));
              }, [country])}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaisDetalhes;
