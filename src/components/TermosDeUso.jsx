import React from 'react';

function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-amber-600 dark:text-amber-500">Termos de Uso</h1>
        
        <p className="mb-4">Ao acessar o site <strong>Bandeiras do Mundo</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>

        <h2 className="text-xl font-bold mt-6 mb-3">1. Licença de Uso</h2>
        <p className="mb-4 text-sm">
          É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Bandeiras do Mundo, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm space-y-2">
          <li>Modificar ou copiar os materiais;</li>
          <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
          <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Bandeiras do Mundo;</li>
          <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
          <li>Transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">2. Isenção de responsabilidade</h2>
        <p className="mb-4 text-sm">
          Os materiais no site da Bandeiras do Mundo são fornecidos 'como estão'. Bandeiras do Mundo não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">3. Limitações</h2>
        <p className="mb-4 text-sm">
          Em nenhum caso o Bandeiras do Mundo ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Bandeiras do Mundo.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">4. Precisão dos materiais</h2>
        <p className="mb-4 text-sm">
          Os materiais exibidos no site da Bandeiras do Mundo podem incluir erros técnicos, tipográficos ou fotográficos. Bandeiras do Mundo não garante que qualquer material em seu site seja preciso, completo ou atual. Bandeiras do Mundo pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
        </p>

        <p className="mt-8 text-xs text-gray-500 border-t pt-4 dark:border-gray-600">
          Estes termos são efetivos a partir de <strong>{new Date().getFullYear()}</strong>.
        </p>
      </div>
    </div>
  );
}

export default TermosDeUso;
