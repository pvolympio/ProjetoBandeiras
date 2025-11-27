import React from 'react';

function Contato() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-amber-600 dark:text-amber-500">Entre em Contato</h1>
        
        <p className="mb-6 text-lg">
          Tem alguma dúvida, sugestão ou encontrou algum erro em nossos quizzes? Adoraríamos ouvir você!
        </p>

        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              📧 Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Para contato geral, parcerias ou suporte:
            </p>
            <a href="mailto:contato@bandeirasdomundo.com" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
              contato@bandeirasdomundo.com
            </a>
            <p className="text-xs text-gray-500 mt-2 italic">
              Responderemos em até 24 horas úteis.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">📱 Redes Sociais</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Siga-nos para novidades e curiosidades diárias!
            </p>
            {/* Adicione seus links de redes sociais aqui se tiver */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;
