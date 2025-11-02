// src/utils/normalizeString.js

export function normalizeString(str) {
  if (!str) return '';
  
  return str
    .toLowerCase() // 1. Converte para minúsculas
    .normalize("NFD") // 2. Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // 3. Remove os acentos
    .trim(); // 4. Remove espaços extras no início e fim
}