import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full shrink-0">
            <Cookie className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Este site utiliza cookies para garantir que você tenha a melhor experiência. 
            Ao continuar navegando, você concorda com nossa <a href="/politica-privacidade" className="text-amber-600 hover:underline font-medium">Política de Privacidade</a>.
          </p>
        </div>
        
        <button
          onClick={handleAccept}
          className="whitespace-nowrap px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          Aceitar e Fechar
        </button>
      </div>
    </div>
  );
}

export default CookieConsent;
