import React from 'react';

function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-amber-600 dark:text-amber-500">Política de Privacidade</h1>
        
        <p className="mb-4">A sua privacidade é importante para nós. É política do <strong>Bandeiras do Mundo</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site.</p>

        <h2 className="text-xl font-bold mt-6 mb-3">1. Anúncios e Google AdSense</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Utilizamos o Google AdSense para veicular anúncios. O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios. Com o cookie DART, o Google pode exibir anúncios com base nas suas visitas a este e a outros sites na Internet.
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm space-y-2">
          <li>Os usuários podem desativar o cookie DART visitando a Política de privacidade da rede de conteúdo e dos anúncios do Google.</li>
          <li>Nós não temos controle sobre os cookies que são utilizados por anunciantes de terceiros.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">2. Cookies</h2>
        <p className="mb-4 text-sm">
          Utilizamos cookies para armazenar informações, tais como as suas preferências pessoais quando visita o nosso website. Você tem a liberdade de recusar os nossos cookies se desejar, sabendo que talvez não possamos fornecer alguns dos serviços desejados.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">3. Dados do Usuário</h2>
        <p className="mb-4 text-sm">
          Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. O nosso site pode ter links para sites externos que não são operados por nós.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">4. Compromisso do Usuário</h2>
        <p className="mb-4 text-sm">
          O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Bandeiras do Mundo oferece no site e com caráter enunciativo, mas não limitativo:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm space-y-1">
          <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
          <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, casas de apostas, jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos.</li>
        </ul>

        <p className="mt-8 text-xs text-gray-500 border-t pt-4 dark:border-gray-600">
          Esta política é efetiva a partir de <strong>{new Date().getFullYear()}</strong>.
        </p>
      </div>
    </div>
  );
}

export default PoliticaPrivacidade;