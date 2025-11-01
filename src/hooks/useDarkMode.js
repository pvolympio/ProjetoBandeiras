// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react';

export function useDarkMode() {
  // 1. Define o estado inicial lendo o localStorage ou a preferência do sistema
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      // Se não houver nada salvo, verifica a preferência do sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Padrão
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // 2. Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 3. Efeito que aplica as mudanças quando o 'theme' muda
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Adiciona ou remove a classe 'dark' da tag <html>
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
}