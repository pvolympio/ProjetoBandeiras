// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react';

export function useDarkMode() {
  // 1. Começa como 'null' para evitar problemas de "hydration mismatch"
  const [theme, setTheme] = useState(null);

  // 2. Efeito para carregar o tema inicial (roda APENAS no cliente, UMA VEZ)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema com base no localStorage ou preferência do sistema
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []); // O array vazio [] garante que isso só rode no 'mount' do cliente

  // 3. Efeito para aplicar mudanças (roda sempre que 'theme' mudar)
  useEffect(() => {
    // Não faz nada se o tema ainda for 'null' (carregamento inicial)
    if (theme === null) {
      return;
    }

    const root = window.document.documentElement; // Tag <html>
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Salva a escolha no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Roda sempre que o estado 'theme' for alterado

  // 4. Função para o botão
  const toggleTheme = () => {
    // Se o tema ainda não foi carregado, não faz nada
    if (theme === null) return; 
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // O seu HeaderPrincipal.jsx não precisa mudar.
  return [theme, toggleTheme];
}