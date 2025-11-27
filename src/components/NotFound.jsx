import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 text-center">
      <Map className="w-24 h-24 text-amber-500 mb-6 opacity-80" />
      <h1 className="text-6xl font-bold mb-4 text-amber-600">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Parece que você se perdeu no mapa! A página que você está procurando não existe ou foi movida.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors shadow-lg"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}

export default NotFound;
