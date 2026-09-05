/* eslint-disable no-console */
// ===== HOVER SE NAORUŽA TEK PRVIM POMAKOM MIŠA (F1/8 ②) — JS u pješčaniku + CSS-modul na uzorku =====
// Pokreni: node tests/unit/hover-arm.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-05): „gumb koji je stajao na mjestu starog gumba isto svijetli po
// rubovima a nije ga se diralo". Na mišu to radi preglednik sam — hover se računa po POLOŽAJU
// pokazivača, ne po pokretu (`scripts/hover-probe.js --profil=prelaz`: ljepljivo 2/2 prije ②).
// Popravak ima dvije polovice koje se moraju slagati, a nijedna druga brana ne vidi njihov šav:
//
//   ① JS (`js/utils.js`): `pauzirajHover()` stavi `data-hover-paused` na `<html>`, prvi `pointermove`
//      ga skine. Okidač MORA biti `pointermove`, ne `mousemove` — dodir uz klik šalje `mousemove`, a
//      `pointermove` bez pomaka ne šalje (izmjereno 2026-09-05, WebKit + Chromium); slušač je `once`
//      + `passive`, i drugi poziv prije pomaka NE veže drugi slušač.
//   ② CSS (`scripts/hover-css.js`): svaki hover-selektor nosi prefiks `:where(:root:not([data-hover-paused]))`
//      — i na pravilima koja VEĆ stoje pod hover-medijem; prolaz je idempotentan; selektor koji prefiks
//      ne bi pogodio (`html:hover`, `:root …`, `&`) ruši build umjesto da tiho ostane ljepljiv.
//   ③ ŠAV (`js/navigation.js`): `navigateTo` I `browseNaRazinu` zovu `pauzirajHover()`. Browse-prelazi
//      (fakultet → smjer → godina) NE idu kroz `navigateTo`, a to je Leonov točan scenarij.
//
// Bundle čuva `npm run check:hover` (nula golih, nula nenaoružanih), ekran `hover-probe --profil=prelaz`.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const UTILS = fs.readFileSync(path.join(KORIJEN, 'js', 'utils.js'), 'utf8');
const NAV = fs.readFileSync(path.join(KORIJEN, 'js', 'navigation.js'), 'utf8');
const { PREFIKS, zamotaj, gola } = require(path.join(KORIJEN, 'scripts', 'hover-css'));

let pao = 0;
const tvrdi = (uvjet, ime, detalj) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  → ' + JSON.stringify(detalj) : '')); }
};

/* Lažni svijet: `<html>` s atributima, `document` koji pamti slušače; `pomak()` glumi preglednik
   koji šalje `pointermove` (i, kao preglednik, `once` slušače poslije poziva makne). */
function svijet() {
    const attrs = {};
    const slusaci = [];
    const html = {
        setAttribute: (k, v) => { attrs[k] = String(v); },
        removeAttribute: (k) => { delete attrs[k]; },
        hasAttribute: (k) => k in attrs,
    };
    const document = {
        documentElement: html,
        addEventListener: (tip, fn, opts) => { slusaci.push({ tip, fn, opts }); },
        getElementById: () => null,
    };
    const ctx = { document, console };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(UTILS, ctx, { filename: 'utils.js' });
    const posalji = (tip) => {
        const sad = slusaci.filter((s) => s.tip === tip);
        sad.forEach((s) => { if (s.opts && s.opts.once) slusaci.splice(slusaci.indexOf(s), 1); s.fn({ type: tip }); });
        return sad.length;
    };
    return { ctx, slusaci, posalji, pauzirano: () => 'data-hover-paused' in attrs };
}

console.log('\n=== hover se naoruža tek prvim pomakom (F1/8 ②) ===\n');

// ── ① JS: `pauzirajHover` u pješčaniku ─────────────────────────────────────────
{
    const s = svijet();
    tvrdi(typeof s.ctx.pauzirajHover === 'function' && s.ctx.window.pauzirajHover === s.ctx.pauzirajHover,
        '`pauzirajHover` je goli global i na `window` (navigation.js ga zove golo)');
    tvrdi(!s.pauzirano() && s.slusaci.length === 0, 'učitavanje samo ne pauzira ništa i ne veže slušače');

    s.ctx.pauzirajHover();
    tvrdi(s.pauzirano(), 'poziv stavi `data-hover-paused` na <html>');
    const l = s.slusaci[0];
    tvrdi(s.slusaci.length === 1 && l.tip === 'pointermove', 'veže TOČNO jedan slušač, i to `pointermove` (ne `mousemove` — dodir ga šalje)', s.slusaci.map((x) => x.tip));
    tvrdi(!!l.opts && l.opts.once === true && l.opts.passive === true, 'slušač je `once` + `passive`', l.opts);

    s.ctx.pauzirajHover();
    tvrdi(s.pauzirano() && s.slusaci.length === 1, 'drugi poziv prije pomaka: i dalje pauzirano, i dalje JEDAN slušač (idempotentno)', s.slusaci.length);

    tvrdi(s.posalji('mousemove') === 0 && s.pauzirano(), '`mousemove` (dodir ga šalje) NE naoružava hover');
    tvrdi(s.posalji('pointermove') === 1 && !s.pauzirano(), 'prvi `pointermove` skida atribut');
    tvrdi(s.slusaci.length === 0 && s.posalji('pointermove') === 0 && !s.pauzirano(), 'poslije toga nema slušača — sljedeći pomak ne radi ništa');

    s.ctx.pauzirajHover();
    tvrdi(s.pauzirano() && s.slusaci.length === 1, 'sljedeći prelazak opet pauzira i opet veže jedan slušač');
}

// ── ③ ŠAV: tko zove pauzu u navigation.js ─────────────────────────────────────
{
    const bezKomentara = NAV.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const tijelo = (ime) => {
        const m = bezKomentara.match(new RegExp('\\nfunction ' + ime + '\\([^)]*\\) \\{([\\s\\S]*?)\\n\\}'));
        return m ? m[1] : null;
    };
    const nav = tijelo('navigateTo');
    const razina = tijelo('browseNaRazinu');
    tvrdi(nav !== null && nav.includes('pauzirajHover()'), '`navigateTo` zove `pauzirajHover()` (stranica se mijenja pod mišem)');
    tvrdi(razina !== null && razina.includes('pauzirajHover()'), '`browseNaRazinu` zove `pauzirajHover()` (kartice nove razine dolaze na mjesto starih, NE kroz navigateTo)');
    tvrdi(razina !== null && razina.indexOf('pauzirajHover()') < razina.indexOf('renderBrowse()'), 'u `browseNaRazinu` pauza dolazi PRIJE crtanja nove razine');
}

// ── ② CSS-modul na uzorku ──────────────────────────────────────────────────────
{
    tvrdi(/^:where\(/.test(PREFIKS) && PREFIKS.includes(':root:not([data-hover-paused])'),
        'prefiks je `:where(…)` — nula specifičnosti, kaskada ostaje ista (cascade.authed mjeri na ekranu)');

    const UZORAK = [
        '.a:hover, .b:focus-visible { color: red; }',
        '@media (hover: hover) {',
        '  .c:hover { color: blue; }',
        '}',
        '@media (hover: hover) {',
        '  ' + PREFIKS + ' .d:hover { color: green; }',
        '}',
        '.e:hover .f { color: pink; }',
        '',
    ].join('\n');
    const broj = (s, x) => s.split(x).length - 1;

    const r = zamotaj(UZORAK, 'uzorak.css');
    tvrdi(r.zamotano === 2 && r.naoruzano === 3, 'uzorak: 2 gola pravila zamotana, 3 selektora dobila prefiks (d ga je već imao)', { zamotano: r.zamotano, naoruzano: r.naoruzano });
    tvrdi(r.css.includes('.b:focus-visible { color: red; }') && !r.css.includes(PREFIKS + ' .b:focus-visible'),
        'fokus-selektor iz iste liste ostaje vani i BEZ prefiksa');
    tvrdi(r.css.includes(PREFIKS + ' .a:hover { color: red; }'), 'goli hover-selektor: zamotan I prefiksiran');
    tvrdi(r.css.includes('  ' + PREFIKS + ' .c:hover { color: blue; }'), 'pravilo već pod hover-medijem: prefiks na mjestu, tijelo netaknuto');
    tvrdi(broj(r.css, PREFIKS) === 4 && broj(r.css, PREFIKS + ' ' + PREFIKS) === 0, 'točno 4 prefiksa, nijedan dvostruki', broj(r.css, PREFIKS));
    tvrdi(r.poslije.golihSelektora === 0 && r.poslije.naoruzanihSelektora === 4 && r.poslije.hoverSelektora === 4,
        'obrnuta provjera izlaza: 0 golih, 4/4 naoružana', r.poslije);

    const r2 = zamotaj(r.css, 'uzorak.css');
    tvrdi(r2.css === r.css && r2.zamotano === 0 && r2.naoruzano === 0, 'idempotentno: drugi prolaz ne mijenja ništa');

    const g = gola(UZORAK, 'uzorak.css');
    tvrdi(g.gola.length === 2 && g.nenaoruzana.length === 3, 'brana na uzorku: 2 gola pravila, 3 nenaoružana', { gola: g.gola.length, nenaoruzana: g.nenaoruzana.length });
    const g2 = gola(r.css, 'uzorak.css');
    tvrdi(g2.gola.length === 0 && g2.nenaoruzana.length === 0, 'brana na izlazu: 0 i 0');

    const bez = zamotaj(UZORAK, 'uzorak.css', { naoruzaj: false });
    tvrdi(bez.zamotano === 2 && bez.naoruzano === 0 && broj(bez.css, PREFIKS) === 1, '`naoruzaj: false` (pravne stranice bez rutera): samo omot, prefiks ostaje samo gdje je bio');

    const baca = (css, re, ime) => {
        let poruka = '';
        try { zamotaj(css, 'rub.css'); } catch (e) { poruka = e.message; }
        tvrdi(re.test(poruka), ime, poruka.split('\n')[0]);
    };
    baca('html:hover { color: red; }', /html|:root/, '`html:hover` ruši build (prefiks ga nikad ne bi pogodio)');
    baca(':root .x:hover { color: red; }', /html|:root/, '`:root .x:hover` ruši build (isto)');
    baca('.p { &:hover { color: red; } }', /nesting|&/, 'ugniježđeni `&:hover` ruši build (prefiks bi promijenio značenje)');
    baca('.q:not(:hover) { color: red; }', /:not\(\)/, '`:not(:hover)` i dalje ruši build (rub iz ①)');
}

console.log('\n' + (pao ? '❌ hover-arm: ' + pao + ' tvrdnja/e pale' : '✅ hover-arm: sve tvrdnje prošle') + '\n');
process.exit(pao ? 1 : 0);
