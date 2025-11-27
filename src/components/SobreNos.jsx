import React from 'react';
import { Flag, Globe, Heart } from 'lucide-react';

function SobreNos() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        
        <h1 className="text-4xl font-extrabold mb-6 text-amber-600 dark:text-amber-500">Sobre o Projeto</h1>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold">Nossa Missão</h2>
          </div>
          <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            O <strong>Bandeiras do Mundo</strong> nasceu de uma paixão genuína pela vexilologia (o estudo das bandeiras) e pela geografia global. Acreditamos que conhecer as bandeiras não é apenas um jogo de memória, mas uma porta de entrada para entender a cultura, a história e a identidade de cada nação. 
            Nosso objetivo é criar a maior e mais acessível plataforma de aprendizado geográfico em língua portuguesa, oferecendo dados precisos e atualizados sobre todos os países reconhecidos.
          </p>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flag className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold">O que oferecemos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Desenvolvemos quizzes interativos, desafios de tempo e curiosidades detalhadas para tornar o aprendizado geográfico acessível, divertido e gratuito para estudantes e entusiastas de todas as idades.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold">Gratuito para todos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Este projeto é mantido de forma independente. Acreditamos que a educação geográfica deve ser livre de barreiras.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-gray-500 dark:text-gray-400">
          Dúvidas ou sugestões? Entre em contato conosco.
        </p>
      </div>
    </div>
  );
}

export default SobreNos;