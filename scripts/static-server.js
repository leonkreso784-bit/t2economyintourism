// Minimalni statički server za lokalni razvoj i Playwright testove.
// Pokreni: `node scripts/static-server.js` (port 5050, ili PORT env).
const http = require('http');
const fs = require('fs');
const path = require('path');

// `SERVE_ROOT` posluzuje DRUGO stablo istim serverom -- treba ga `css-diff.js`, koji
// referentnu verziju vadi u `git worktree`. Vazno je da obje strane vrti ISTI server:
// server je alat, ne predmet mjerenja, pa bi izmjena u njemu inace postala lazna razlika.
const ROOT = path.resolve(process.env.SERVE_ROOT || path.join(__dirname, '..'));
const PORT = process.env.PORT || 5050;
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    // `Content-Length` NIJE kozmetika: bez njega Node odgovara u komadima (chunked), a
    // kod koji pita „koliko ovo zauzima" (P1, `js/offline-store.js`) dobiva prazno
    // zaglavlje. Produkcija (Vercel) ga šalje — provjereno HEAD-om — pa bi ga izostavljanje
    // ovdje pretvorilo u razliku između probne i prave okoline, a to je najgora vrsta rupe.
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': Buffer.byteLength(data)
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('static server on http://localhost:' + PORT));
