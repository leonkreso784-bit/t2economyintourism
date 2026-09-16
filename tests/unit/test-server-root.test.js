/* eslint-disable no-console */
// ===== PLAYWRIGHT NE SMIJE MJERITI TUĐE STABLO =====
// Pokreni: node tests/unit/test-server-root.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI (2026-09-16, stablo `sokratstudy.f3`): `playwright.config.js` ima
// `reuseExistingServer: true` na fiksnom portu 5050. Na Leonovu računalu stoji više radnih
// stabala (`.dev`, `.f21`, `.f3`…), i poslužitelj koji je dan ranije pokrenulo DRUGO stablo
// ostao je živ. Playwright ga je tiho preuzeo: cijela sesija „zelenih" specova (13/13, 24/24)
// mjerila je tuđe datoteke. Otkrilo se tek kad je novi test tražio element koji postoji samo
// u ovom stablu. `reuseExistingServer` gleda samo ODGOVARA LI adresa, ne ČIJE datoteke daje.
//
// Popravak: `static-server.js` šalje `X-Sokrat-Root` (koje stablo poslužuje), a
// `tests/global-setup.js` prije ijednog testa usporedi to s ovim stablom i glasno padne.
// Mjeri se na pravim poslužiteljima (spawn), ne na lažnjaku: obrnuto, tuđe stablo MORA pasti.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const KORIJEN = path.join(__dirname, '..', '..');
const globalSetup = require(path.join(KORIJEN, 'tests', 'global-setup.js'));

let pao = 0;
const tvrdi = (uvjet, ime, detalj) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  → ' + detalj : '')); }
};

const config = (port) => ({ projects: [{ use: { baseURL: 'http://localhost:' + port } }] });

function posluzitelj(port, root) {
    const env = Object.assign({}, process.env, { PORT: String(port) });
    if (root) env.SERVE_ROOT = root; else delete env.SERVE_ROOT;
    const p = spawn(process.execPath, [path.join(KORIJEN, 'scripts', 'static-server.js')], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('poslužitelj se nije javio')), 10000);
        p.stdout.on('data', (d) => { if (String(d).includes('static server')) { clearTimeout(t); resolve(p); } });
        p.on('error', reject);
    });
}

async function ishod(port) {
    try { await globalSetup(config(port)); return null; } catch (e) { return e; }
}

(async () => {
    console.log('\n=== Playwright ne smije mjeriti tuđe stablo (global-setup) ===\n');

    const tude = fs.mkdtempSync(path.join(os.tmpdir(), 'tude-stablo-'));
    fs.writeFileSync(path.join(tude, 'index.html'), '<!doctype html><title>tuđe</title>');

    const a = await posluzitelj(5987, tude);
    try {
        const e = await ishod(5987);
        tvrdi(e !== null, 'poslužitelj DRUGOG stabla na portu → pad prije ijednog testa');
        tvrdi(e && e.message.includes(tude), '… poruka imenuje stablo koje stvarno poslužuje', e && e.message);
        tvrdi(e && e.message.includes('SOKRAT_TEST_PORT'), '… i kaže kako dalje (drugi port)', e && e.message);
    } finally { a.kill(); }

    const b = await posluzitelj(5988, null);
    try {
        tvrdi((await ishod(5988)) === null, 'poslužitelj OVOG stabla → prolazi');
    } finally { b.kill(); }

    tvrdi((await ishod(5989)) === null, 'nitko ne sluša na portu → prolazi (Playwright pokreće svoj)');

    if (pao) { console.log('\n❌ ' + pao + ' pad(ova)\n'); process.exit(1); }
    console.log('\n✅ sve prolazi\n');
})().catch((e) => { console.log('❌ ' + e.stack); process.exit(1); });
