import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Bandeiras do Mundo 🌍
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore, jogue e aprenda geografia.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-amber-500 transition-colors">Início</Link>
          <Link to="/sobre" className="hover:text-amber-500 transition-colors">Sobre Nós</Link>
          <Link to="/contato" className="hover:text-amber-500 transition-colors">Contato</Link>
          <Link to="/politica-privacidade" className="hover:text-amber-500 transition-colors">Política de Privacidade</Link>
          <Link to="/termos-de-uso" className="hover:text-amber-500 transition-colors">Termos de Uso</Link>
        </nav>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          © {currentYear} Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;