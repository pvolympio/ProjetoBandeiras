import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // AQUI ESTÁ A CORREÇÃO:
    // Nós passamos a configuração diretamente para o plugin
    tailwindcss({
      config: {
        // Informa ao Tailwind onde encontrar suas classes
        content: [
          "./index.html",
          "./src/**/*.{js,jsx,ts,tsx}",
        ],

        // A linha mágica que estávamos tentando configurar!
        darkMode: 'class', 
      }
    }),
  ],
})