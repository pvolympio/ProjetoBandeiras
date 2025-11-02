// src/components/HeaderPrincipal.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import logoBandeiras from '/src/assets/logo.png';
import { useDarkMode } from '../hooks/useDarkMode';
import { Link } from 'react-router-dom'; // 1. Importar o Link

function HeaderPrincipal() {
  const [, toggleTheme] = useDarkMode(); 

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
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

          {/* 2. Mudar de <a> para <Link> */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link
              to="/" // Rota da Home
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Início
            </Link>
            <Link
              to="/quiz" // Rota do Quiz
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Quiz
            </Link>
            <Link
              to="/curiosidades" // Rota de Curiosidades (você pode criar depois)
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Curiosidades
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Alternar modo escuro"
          >
            <Sun className="w-5 h-5 text-gray-700 dark:hidden" />
            <Moon className="w-5 h-5 text-gray-300 hidden dark:block" />
          </button>
        </div>
      </div>
      
      {/* ... o resto do seu header ... */}
      
    </header>
  );
}

export default HeaderPrincipal;