// scripts/checkFlags.js
const fs = require('fs');
const path = require('path');

// caminho relativo à raiz do projeto
const flagsDir = path.join(__dirname, '..', 'src', 'assets', 'flags');
const countriesPath = path.join(__dirname, '..', 'src', 'data', 'countries.js');

// 1) lê os arquivos SVG da pasta de bandeiras
if (!fs.existsSync(flagsDir)) {
  console.error(`Pasta de flags não encontrada: ${flagsDir}`);
  process.exit(1);
}

const flagFiles = fs.readdirSync(flagsDir)
  .filter(f => f.toLowerCase().endsWith('.svg'))
  .map(f => f.replace(/\.svg$/i, '').toLowerCase())
  .sort();

// 2) carrega o arquivo countries.js (assume export named `countries`)
if (!fs.existsSync(countriesPath)) {
  console.error(`Arquivo countries.js não encontrado: ${countriesPath}`);
  process.exit(1);
}

// require do arquivo; ele deve exportar "countries"
const countriesModule = require(countriesPath);
const countries = countriesModule.countries || countriesModule.default || [];

const countryCodes = countries.map(c => (c.code || '').toLowerCase()).sort();

// 3) calcula faltantes e extras
const missingFlags = countryCodes.filter(code => !flagFiles.includes(code));
const extraFlagFiles = flagFiles.filter(code => !countryCodes.includes(code));

// 4) imprime relatório
console.log('--- Relatório de flags ---\n');
console.log(`Total countries listados em countries.js: ${countryCodes.length}`);
console.log(`Total SVGs em src/assets/flags: ${flagFiles.length}\n`);

if (missingFlags.length === 0) {
  console.log('Nenhuma flag faltando para os códigos listados em countries.js ✅\n');
} else {
  console.log(`Flags faltando para estes códigos (${missingFlags.length}):`);
  missingFlags.forEach(code => {
    // tenta achar o nome no countries
    const item = countries.find(c => (c.code || '').toLowerCase() === code);
    const name = item ? item.name : '(nome não encontrado)';
    console.log(`  - ${code} -> ${name}`);
  });
  console.log('');
}

if (extraFlagFiles.length === 0) {
  console.log('Nenhum arquivo SVG extra detectado na pasta de flags ✅\n');
} else {
  console.log(`Arquivos SVG na pasta que não aparecem em countries.js (${extraFlagFiles.length}):`);
  extraFlagFiles.forEach(code => console.log(`  - ${code}.svg`));
  console.log('');
}

console.log('Dicas:');
console.log('- Para resolver flags faltando: coloque os .svg em src/assets/flags com o mesmo código (ex: br.svg).');
console.log('- Para resolver arquivos extras: ou apague/renomeie os SVGs ou adicione os códigos em countries.js.');
console.log('- Se você quer eu gere um countries.js novo a partir dos SVGs, eu posso te dar um script pra isso.');
