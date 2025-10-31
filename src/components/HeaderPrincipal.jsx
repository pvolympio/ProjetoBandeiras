import React from 'react';

function HeaderPrincipal() {
  return (
    // Container principal. Adicionei 'bg-white' que estava faltando
    // para o modo claro. 'min-h-screen' é opcional, mas ajuda se
    // for o fundo de toda a página. Vou remover por enquanto
    // e focar só no header.
    <div className="bg-white dark:bg-gray-900 shadow-sm">
      
      {/* O <header> é para o "cabeçalho do site", como a barra de navegação.
        A barra verde se encaixa perfeitamente aqui.
      */}
      <header className="bg-green-600">
        {/* 1. Usamos 'flex' para centralizar o conteúdo.
          2. 'items-center' centraliza verticalmente.
          3. 'justify-center' centraliza horizontalmente.
          4. 'h-12' (48px) dá mais espaço que 'h-8' (32px).
        */}
        <div className="flex items-center justify-center h-12">
          {/*
            Semanticamente, "Bandeiras" é a marca/logo do site.
            Não é um 'h2' (subtítulo). Usar 'p' (parágrafo) ou
            'div' com estilo é mais apropriado.
          */}
          <p className="text-xl font-extrabold text-amber-400">
            Bandeiras
          </p>
        </div>
      </header>

      {/* Este <h1> é o "título da página", e está correto.
        Ele deve vir *depois* do <header> do site.
        1. Removi os 'bg-' redundantes, pois ele vai herdar do 'div' pai.
        2. 'py-6' (padding) dá mais espaço e "ar" ao redor do título.
        3. 'text-2xl' (24px) ou 'text-3xl' (30px) é um tamanho melhor para h1.
      */}
      <h1 className="
        py-6 
        text-center text-3xl font-extrabold 
        text-gray-800 dark:text-gray-200
      ">
        Página para melhorar o conhecimento de bandeiras
      </h1>
      
      {/* A <section> vazia foi removida. */}
      
    </div>
  );
}

export default HeaderPrincipal;