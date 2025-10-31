import React from 'react';
import { Sun, Moon } from 'lucide-react'; // Ícones elegantes (de lucide-react)
import logoBandeiras from '/src/assets/logo.png';

function HeaderPrincipal() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      {/* Navbar principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo e nome */}
          <div className="flex items-center gap-3">
            <img
              src={logoBandeiras}
              alt="Logo Bandeiras"
              className="h-12 w-12 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700"
            />
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              Bandeiras do Mundo
            </span>
          </div>

          {/* Navegação simples */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a
              href="#inicio"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Início
            </a>
            <a
              href="#quiz"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Quiz
            </a>
            <a
              href="#curiosidades"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Curiosidades
            </a>
          </nav>

          {/* Botão de modo escuro (decorativo) */}
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Alternar modo escuro"
          >
            <Sun className="w-5 h-5 text-gray-700 dark:hidden" />
            <Moon className="w-5 h-5 text-gray-300 hidden dark:block" />
          </button>
        </div>
      </div>

      {/* Título da página */}
      <div className="py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Explore e aprenda sobre as bandeiras do mundo
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Conhecimento global começa por reconhecer as cores de cada nação 🌍
        </p>
      </div>
    </header>
  );
}

export default HeaderPrincipal;
