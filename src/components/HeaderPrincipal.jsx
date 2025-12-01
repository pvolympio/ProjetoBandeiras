import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Volume2, VolumeX, Download } from "lucide-react";
import logoBandeiras from "/src/assets/logo.png";
import { useDarkMode } from "../hooks/useDarkMode";
import { useSoundSettings } from "../contexts/SoundContext";
import { Link } from "react-router-dom";

function HeaderPrincipal() {
  const [, toggleTheme] = useDarkMode();
  const { isMuted, toggleSound } = useSoundSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO + título */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoBandeiras}
              alt="Logo Bandeiras"
              className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700"
            />
            <span className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              Bandeiras do Mundo
            </span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Início
            </Link>
            <Link
              to="/quiz"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Quiz
            </Link>
            <Link
              to="/curiosidades"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Curiosidades
            </Link>
            <Link
              to="/rankings"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Rankings
            </Link>
            <Link
              to="/perfil"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-bold text-amber-600 dark:text-amber-400"
            >
              Meu Perfil
            </Link>
          </nav>

          {/* Botões: modo escuro + menu mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Alternar modo escuro"
            >
              <Sun className="w-5 h-5 text-gray-700 dark:hidden" />
              <Moon className="w-5 h-5 text-gray-300 hidden dark:block" />
            </button>

            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition text-sm font-medium shadow-sm animate-pulse"
                title="Instalar App"
              >
                <Download className="w-4 h-4" />
                Instalar App
              </button>
            )}

            <button
              onClick={toggleSound}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </button>

            {/* Botão hambúrguer */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile (aparece quando menuOpen = true) */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3">
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition"
            >
              Início
            </Link>
            <Link
              to="/quiz"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition"
            >
              Quiz
            </Link>
            <Link
              to="/curiosidades"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition"
            >
              Curiosidades
            </Link>
            <Link
              to="/rankings"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition"
            >
              Rankings
            </Link>
            <Link
              to="/perfil"
              onClick={() => setMenuOpen(false)}
              className="text-amber-600 dark:text-amber-400 font-bold hover:text-green-500 transition"
            >
              Meu Perfil
            </Link>
            {deferredPrompt && (
              <button
                onClick={() => {
                  handleInstallClick();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition w-full justify-center"
              >
                <Download className="w-5 h-5" />
                Instalar App
              </button>
            )}
          </div>
        </div>
      )}

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
