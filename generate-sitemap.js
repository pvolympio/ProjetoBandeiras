import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mocking the countries data since we can't import ES modules easily in a standalone script without package.json "type": "module"
// or we can just read the file. For simplicity, I'll read the countries.js file content.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const countriesPath = path.join(__dirname, 'src/data/countries.js');
const publicPath = path.join(__dirname, 'public/sitemap.xml');

const countriesContent = fs.readFileSync(countriesPath, 'utf-8');
// Extract the array using regex or eval (careful with eval, but this is local trusted code)
// Regex to find all code: "xx"
const codeMatches = [...countriesContent.matchAll(/code:\s*"([a-z]{2})"/g)];

const codes = codeMatches.map(match => match[1]);

const baseUrl = 'https://bandeirasdomundo.com'; // Replace with actual domain

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/quiz</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/curiosidades</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

codes.forEach(code => {
  sitemap += `  <url>
    <loc>${baseUrl}/pais/${code}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
});

sitemap += `</urlset>`;

fs.writeFileSync(publicPath, sitemap);
console.log(`Sitemap generated with ${codes.length} countries at ${publicPath}`);
