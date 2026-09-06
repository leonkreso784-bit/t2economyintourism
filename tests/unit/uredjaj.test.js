/* eslint-disable no-console */
// ===== PLATFORMA ZNA UREĐAJ — JEDNO MJESTO (F1/12 ⓪): boot.js u pješčaniku · ugovor nad js/** i css/** · redoslijed · špil · pragovi =====
// Pokreni: node tests/unit/uredjaj.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-06): „Platforma mora znati na kakvom je uređaju korisnik." Do F1/12 ⓪
// se to pitalo na četiri mjesta na četiri načina — CSS `@media (pointer: coarse)` (F1/9, F1/10) i
// `(hover: hover)` (F1/8), JS `GestureEvent` (no-zoom.js), `prefers-color-scheme` (boot.js) — a je li
// aplikacija INSTALIRANA nije znao nitko, iako Leon testira baš instaliranu. Sad `js/boot.js` jednom,
// PRIJE prvog crtanja, upiše `<html data-uredjaj="dodir hover hibrid telefon|tablet|stolno ios pwa">`
// (odsutna sposobnost = nema tokena) i zamrznut `window.SokratUredjaj` s istim poljima.
// UGOVOR: CSS pita `:root[data-uredjaj~="dodir"]`, JS pita `SokratUredjaj.dodir` — i nitko drugi.
//
// ⚠️ RAZLIKA KOJA ODLUČUJE što ide u atribut, a što ostaje `@media` (piše i u boot.js):
//   • ODLUKA O SUČELJU (špil kartica na dodiru, red gumba, tipke, tutorial) → atribut / objekt;
//   • SPOSOBNOST PREGLEDNIKA (iOS zumira polje < 16 px → `(pointer: coarse)` u variables.css, F1/10;
//     `:hover` samo gdje hover postoji → `(hover: hover)` omoti iz `scripts/hover-css.js`, F1/8) → medij,
//     jer to nije naša odluka nego činjenica o motoru. Osnovica dolje IMENUJE svaku takvu iznimku s razlogom.
//
// Ovo je NOVI ugovor i ništa postojeće ga ne čuva; pet načina da tiho umre, svaki ovdje:
//   ① boot krivo računa (dodir bez hovera = telefon · miš = stolno · oboje = hibrid · standalone = pwa ·
//      GestureEvent = ios · pragovi ±1), ne osvježi kad tablet dobije miš, ili objekt nije zamrznut;
//   ② netko u `js/**` opet zove `matchMedia('(pointer…)')` ili njuška `GestureEvent` — druga istina;
//      u `css/**` netko napiše novi `@media (pointer…|hover…)` izvan imenovane osnovice;
//   ③ `no-zoom.js` (čita `SokratUredjaj.os`) dođe PRIJE `boot.js` ili boot dobije `defer` →
//      štipanje na iPhoneu tiho radi opet;
//   ④ špil kartica (F1/9) se vrati pod medij, ili bundle ne nosi selektor (build:css nije pokrenut);
//   ⑤ pragovi razreda u boot.js se raziđu s pragovima koje CSS stvarno koristi.
// Pješčanik je `vm` s lažnim `matchMedia` PO UPITU (kalup: theme-device.test.js) — bez preglednika.
// Iscrtano mjeri `tests/uredjaj.spec.js` (4 iPhone profila + stolni kontekst, promjena prozora uživo).
// Brana ispisuje KOLIKO je toga dotaknula (datoteka, poziva, pravila) — mjerač koji šuti na nuli je kvar.
// Obrnuto (2026-09-06, `git worktree` na 900f142 = stablo prije cigle): vidi zapis cigle u RASPORED-u.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const citaj = (...r) => fs.readFileSync(path.join(KORIJEN, ...r), 'utf8');
const BOOT = citaj('js', 'boot.js');

let pao = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime, detalj) => {
    ukupno++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  →  ' + JSON.stringify(detalj) : '')); }
};
const isto = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Pragovi razreda — čitaju se IZ boot.js (jedno mjesto), nikad ne prepisuju ovamo. */
const PRAG = (() => {
    const m = /var PRAGOVI = \{\s*tablet:\s*(\d+),\s*stolno:\s*(\d+)\s*\}/.exec(BOOT);
    return m ? { tablet: Number(m[1]), stolno: Number(m[2]) } : null;
})();
/* Bez PRAGOVA (stablo prije cigle) brana mora OSTATI BROJAČ, ne srušiti se na prvoj tvrdnji — obrnuta
   provjera kroz `git worktree` broji crvene; ovaj par služi SAMO tome (tvrdnja o PRAGOVIMA već pada). */
const P = PRAG || { tablet: 768, stolno: 1024 };

/** Rekurzivan popis datoteka s nastavkom pod mapom (relativno na korijen, s `/`). */
function hodaj(dir, ext) {
    const out = [];
    const rek = (d) => {
        for (const f of fs.readdirSync(path.join(KORIJEN, d), { withFileTypes: true })) {
            const p = d + '/' + f.name;
            if (f.isDirectory()) rek(p);
            else if (f.name.endsWith(ext)) out.push(p);
        }
    };
    rek(dir);
    return out.sort();
}
/** Bez komentara: zaglavlja OBJAŠNJAVAJU zabranjeno („ne zovi matchMedia za pointer") i ne smiju biti pogodak. */
const bezKomentaraJs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
const bezKomentaraCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ');

console.log('\n=== platforma zna uređaj — jedno mjesto (F1/12 ⓪) ===\n');

// ── ① boot.js u pješčaniku ───────────────────────────────────────────────────
/* Lažni svijet: `matchMedia` odgovara PO UPITU (`upiti`), `min-width` po `sirina`; `postavi`/`sirina`
   mijenjaju stanje i jave `change` točno onim slušačima koji su se na taj upit prijavili — kao motor. */
function svijet(o) {
    o = o || {};
    const stanje = Object.assign({
        '(prefers-color-scheme: dark)': false, '(pointer: coarse)': false, '(hover: hover)': false,
        '(any-pointer: coarse)': false, '(display-mode: standalone)': false,
    }, o.upiti || {});
    let sirina = o.sirina === undefined ? 393 : o.sirina;
    const slusaci = {};
    const attrs = { 'data-theme': 'academic' };
    let upisa = 0;
    const html = {
        getAttribute: (k) => (k in attrs ? attrs[k] : null),
        setAttribute: (k, v) => { attrs[k] = String(v); if (k === 'data-uredjaj') upisa++; },
        style: {},
    };
    const document = { documentElement: html, body: { classList: { remove() {} } }, querySelectorAll: () => [], addEventListener() {} };
    const ctx = { document, console, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, location: { hash: '', search: '' } };
    ctx.window = ctx;
    if (o.innerWidth !== undefined) ctx.innerWidth = o.innerWidth;
    if (o.gesture) ctx.GestureEvent = function GestureEvent() {};
    const vidjeni = [];
    const odgovori = (q) => {
        const m = /^\(min-width:\s*(\d+)px\)$/.exec(q);
        if (m) return sirina >= Number(m[1]);
        if (!(q in stanje)) throw new Error('boot.js pita upit koji pješčanik ne poznaje: ' + q);
        return stanje[q];
    };
    if (o.matchMediaBaca) ctx.matchMedia = () => { throw new Error('matchMedia nedostupan'); };
    else if (!o.bezMatchMedia) {
        ctx.matchMedia = (q) => {
            vidjeni.push(q);
            const mql = { get matches() { return odgovori(q); } };
            const prijavi = (fn) => { (slusaci[q] = slusaci[q] || []).push(fn); };
            if (o.stariMql) mql.addListener = prijavi;                 // Safari < 14
            else mql.addEventListener = (ev, fn) => { if (ev === 'change') prijavi(fn); };
            return mql;
        };
    }
    vm.createContext(ctx);
    vm.runInContext(BOOT, ctx, { filename: 'boot.js' });
    const javi = (q) => (slusaci[q] || []).forEach((f) => f({ matches: odgovori(q) }));
    return {
        ctx, attrs, vidjeni, slusaci,
        atribut: () => attrs['data-uredjaj'],
        objekt: () => ctx.SokratUredjaj,
        upisa: () => upisa,
        postavi: (q, v) => { stanje[q] = v; javi(q); },
        sirina: (w) => { sirina = w; Object.keys(slusaci).filter((q) => /min-width/.test(q)).forEach(javi); },
    };
}
const tokeni = (s) => (s.atribut() || '').split(' ');
/** Objekt ili prazan — na stablu bez cigle `SokratUredjaj` ne postoji, a tvrdnje moraju pasti, ne baciti. */
const ob = (s) => s.objekt() || {};

console.log('① boot.js: svaka kombinacija → točan atribut i točan objekt');
tvrdi(PRAG && PRAG.tablet < PRAG.stolno, 'boot.js imenuje PRAGOVI { tablet, stolno } i tablet < stolno', PRAG);
{
    const s = svijet({ upiti: { '(pointer: coarse)': true }, sirina: 393, gesture: true });
    tvrdi(s.atribut() === 'dodir telefon ios', 'iPhone (dodir · bez hovera · 393 · GestureEvent) → data-uredjaj="dodir telefon ios"', s.atribut());
    const u = ob(s);
    tvrdi(isto(u, { dodir: true, hover: false, hibrid: false, razred: 'telefon', os: 'ios', pwa: false }), '… SokratUredjaj ima ista polja (dodir · hover · hibrid · razred · os · pwa)', u);
    tvrdi(Object.isFrozen(u), '… objekt je zamrznut (Object.isFrozen)');
    let bacio = false; try { u.dodir = false; } catch (e) { bacio = true; }
    tvrdi(u.dodir === true, '… upis u polje ne prolazi' + (bacio ? ' (strict: baca)' : ' (tiho odbijen)'));
    tvrdi(s.objekt() && s.ctx.window.SokratUredjaj === u && s.ctx.SokratUredjaj === u, '… `window.SokratUredjaj` i goli `SokratUredjaj` su ISTI objekt');
    tvrdi(s.upisa() === 1, '… atribut upisan točno jednom pri bootu', s.upisa());
    tvrdi(s.attrs['data-theme'] === 'academic' && s.ctx.SOKRAT_THEMES, '… tema je i dalje odlučena PRIJE uređaja (uređaj-blok ne ruši temu)');
    tvrdi(tokeni(s).indexOf('drugo') < 0 && tokeni(s).indexOf('hover') < 0 && tokeni(s).indexOf('pwa') < 0, '… odsutna sposobnost = NEMA tokena (ni „drugo", ni „hover", ni „pwa")', s.atribut());
}
{
    const s = svijet({ upiti: { '(pointer: coarse)': true, '(display-mode: standalone)': true }, sirina: 393, gesture: true });
    tvrdi(s.atribut() === 'dodir telefon ios pwa' && ob(s).pwa === true, 'instalirana PWA (display-mode: standalone) → + token `pwa`, `pwa: true`', s.atribut());
}
{
    const s = svijet({ upiti: { '(pointer: coarse)': true, '(any-pointer: coarse)': true }, sirina: 412 });
    tvrdi(s.atribut() === 'dodir telefon' && ob(s).os === 'drugo', 'Android telefon (bez GestureEvent) → "dodir telefon", os = drugo, bez `ios`', s.atribut());
    tvrdi(ob(s).hibrid === false, '… any-pointer: coarse BEZ hovera nije hibrid (to je običan dodir)', ob(s));
}
{
    const s = svijet({ upiti: { '(hover: hover)': true }, sirina: 1280 });
    tvrdi(s.atribut() === 'hover stolno', 'stolno računalo s mišem (hover · 1280) → "hover stolno"', s.atribut());
    tvrdi(isto(ob(s), { dodir: false, hover: true, hibrid: false, razred: 'stolno', os: 'drugo', pwa: false }), '… objekt: dodir false · hover true · hibrid false · stolno · drugo · pwa false', ob(s));
}
{
    const s = svijet({ upiti: { '(hover: hover)': true, '(any-pointer: coarse)': true }, sirina: 1366 });
    tvrdi(s.atribut() === 'hover hibrid stolno' && ob(s).hibrid === true, 'laptop s dodirnim ekranom (hover + any-pointer: coarse) → "hover hibrid stolno"', s.atribut());
}
{
    const s = svijet({ upiti: { '(pointer: coarse)': true }, sirina: 820, gesture: true });
    tvrdi(s.atribut() === 'dodir tablet ios', 'tablet na dodir (820, GestureEvent) → "dodir tablet ios"', s.atribut());
}
console.log('  · pragovi ±1 (isti kao CSS: ' + P.tablet + ' / ' + P.stolno + ')');
for (const [w, r] of [[P.tablet - 1, 'telefon'], [P.tablet, 'tablet'], [P.stolno - 1, 'tablet'], [P.stolno, 'stolno'], [320, 'telefon'], [2560, 'stolno']]) {
    const s = svijet({ sirina: w });
    tvrdi(ob(s).razred === r && tokeni(s).indexOf(r) >= 0, '  širina ' + w + ' → ' + r, s.atribut());
}
{
    const s = svijet({ sirina: 393 });
    const raz = tokeni(s).filter((t) => ['telefon', 'tablet', 'stolno'].indexOf(t) >= 0);
    tvrdi(raz.length === 1, 'razred je uvijek TOČNO jedan token', s.atribut());
}

console.log('① promjena medija osvježava (tablet dobije miš · prozor prijeđe prag · PWA)');
{
    const s = svijet({ upiti: { '(pointer: coarse)': true }, sirina: 820, gesture: true });
    const upita = Object.keys(s.slusaci).sort();
    tvrdi(upita.length === 6 && upita.indexOf('(min-width: ' + P.tablet + 'px)') >= 0 && upita.indexOf('(min-width: ' + P.stolno + 'px)') >= 0
        && ['(pointer: coarse)', '(hover: hover)', '(any-pointer: coarse)', '(display-mode: standalone)'].every((q) => upita.indexOf(q) >= 0),
        'boot se prijavio na `change` svih ŠEST upita (4 sposobnosti + 2 praga)', upita);
    const staro = ob(s);
    s.postavi('(hover: hover)', true);
    s.postavi('(any-pointer: coarse)', true);
    tvrdi(s.atribut() === 'dodir hover hibrid tablet ios', 'tablet dobije miš (hover + any-pointer) → atribut osvježen: "dodir hover hibrid tablet ios"', s.atribut());
    tvrdi(s.objekt() && s.objekt() !== staro && staro.hover === false && ob(s).hover === true, '… NOVI zamrznut objekt; stara referenca ostaje stara (zato se čita svaki put)', [staro, ob(s)]);
    tvrdi(s.objekt() && Object.isFrozen(s.objekt()), '… i novi objekt je zamrznut');
    s.postavi('(pointer: coarse)', false);
    tvrdi(s.atribut() === 'hover hibrid tablet ios', 'miš postane primarni (pointer: fine) → token `dodir` otpada', s.atribut());
    s.sirina(1280);
    tvrdi(s.atribut() === 'hover hibrid stolno ios' && ob(s).razred === 'stolno', 'prozor prijeđe prag → razred `stolno` (kroz min-width `change`)', s.atribut());
    s.sirina(500);
    tvrdi(ob(s).razred === 'telefon', 'prozor se suzi ispod praga → `telefon`', s.atribut());
    s.postavi('(display-mode: standalone)', true);
    tvrdi(tokeni(s).indexOf('pwa') >= 0 && ob(s).pwa === true, 'aplikacija se otvori kao PWA → token `pwa`', s.atribut());
    const prije = s.upisa();
    s.postavi('(hover: hover)', true);
    tvrdi(s.upisa() === prije, '`change` bez stvarne promjene NE prepisuje atribut istom vrijednošću', [prije, s.upisa()]);
}
{
    const s = svijet({ upiti: { '(pointer: coarse)': true }, sirina: 820, stariMql: true });
    tvrdi(Object.keys(s.slusaci).length === 6, 'stari MQL bez `addEventListener` (Safari < 14): prijava kroz `addListener`', Object.keys(s.slusaci));
    s.postavi('(hover: hover)', true);
    tvrdi(ob(s).hover === true, '… i osvježenje kroz njega radi', s.atribut());
}

console.log('① rubovi okruženja: bez matchMedia se ne ruši, razred iz innerWidth');
{
    const s = svijet({ bezMatchMedia: true, innerWidth: 1300 });
    tvrdi(s.atribut() === 'stolno' && ob(s).dodir === false, 'bez matchMedia + innerWidth 1300 → "stolno" (sposobnosti nepoznate = nema tokena)', s.atribut());
    tvrdi(s.attrs['data-theme'] === 'academic', '… tema i dalje odlučena');
}
{
    const s = svijet({ bezMatchMedia: true });
    tvrdi(s.atribut() === 'telefon', 'bez matchMedia i bez innerWidth → "telefon" (najuži razred, ne rušenje)', s.atribut());
}
{
    let ok = true, s;
    try { s = svijet({ matchMediaBaca: true, innerWidth: 900 }); } catch (e) { ok = false; }
    tvrdi(ok && s.atribut() === 'tablet', 'matchMedia BACA → ne ruši boot, razred iz innerWidth (900 → tablet)', ok ? s.atribut() : 'bacio');
}

// ── ② UGOVOR — statička brana nad js/** i css/** ─────────────────────────────
console.log('② ugovor: samo boot.js pita motor za pointer / hover / display-mode / GestureEvent');
{
    const JS = hodaj('js', '.js');
    const UPIT_RE = /matchMedia\s*\(\s*(['"`])([^'"`]*)\1/g;
    // boot.js upite šalje kroz pomoćnik (`istina('(pointer: coarse)')`), pa se ondje broje LITERALI upita.
    const UPITI_BOOTA = ["'(pointer: coarse)'", "'(hover: hover)'", "'(any-pointer: coarse)'", "'(display-mode: standalone)'", "'(min-width: '"];
    let pozivi = 0;
    const prekrsaji = [];
    for (const f of JS) {
        const src = bezKomentaraJs(citaj(...f.split('/')));
        const golih = (src.match(/matchMedia\s*\(/g) || []).length;
        pozivi += golih;
        if (f === 'js/boot.js') continue;   // jedino mjesto koje SMIJE pitati motor — sadržaj mu provjerava ③
        let m, literala = 0;
        UPIT_RE.lastIndex = 0;
        while ((m = UPIT_RE.exec(src))) {
            literala++;
            if (/pointer|hover|display-mode/i.test(m[2])) prekrsaji.push(f + ': matchMedia(' + m[2] + ')');
        }
        if (golih !== literala) prekrsaji.push(f + ': matchMedia s NEČITLJIVIM upitom (' + (golih - literala) + ')');
        if (/GestureEvent/.test(src)) prekrsaji.push(f + ': njuška `GestureEvent` (os zna boot.js → SokratUredjaj.os)');
    }
    const uBootu = UPITI_BOOTA.filter((q) => bezKomentaraJs(BOOT).indexOf(q) >= 0);
    console.log('  · doseg: ' + JS.length + ' datoteka u js/**, ' + pozivi + ' matchMedia poziva, ' + uBootu.length + '/' + UPITI_BOOTA.length + ' upita uređaja u boot.js');
    tvrdi(JS.length >= 20 && pozivi >= 3, 'brana je nešto dotaknula (≥ 20 datoteka, ≥ 3 poziva)', [JS.length, pozivi]);
    tvrdi(uBootu.length === UPITI_BOOTA.length, 'boot.js pita sva četiri upita sposobnosti + `min-width` pragove', uBootu);
    tvrdi(prekrsaji.length === 0, 'js/**: NITKO osim boot.js ne zove matchMedia za pointer/hover/display-mode niti njuška GestureEvent' + (prekrsaji.length ? ' — ' + prekrsaji.join(' | ') : ''));
}
{
    /* Osnovica IMENUJE svaki `@media` s pointer/hover koji smije ostati, s razlogom. Dvije vrste:
       SPOSOBNOST (ostaje zauvijek) i NASLIJEĐE (odluka o sučelju u obliku medija — seli na atribut u F4/3,
       gdje `css:diff` mjeri nulu razlika). Novi unos izvan osnovice = pad; unos koji više ne postoji = pad
       (osnovica koja laže ne čuva ništa — isti obrazac kao `check:tokens`). */
    const OSNOVICA = [
        { d: 'css/variables.css', p: '(pointer: coarse)', zasto: 'SPOSOBNOST: iOS zumira polje < 16 px pri fokusu (F1/10) — mjeri touch-zoom.test.js ② i phone-gate ⑨' },
        { d: 'css/flashcards-section.css', p: '(hover: none)', zasto: 'NASLIJEĐE responsive/03 (`:active` odziv) → F4/3 na atribut' },
        { d: 'css/flashcards-section.css', p: '(max-width: 767px) and (hover: none) and (pointer: coarse)', zasto: 'NASLIJEĐE responsive/06 + BUG-037 (min-height 280) → F4/3' },
        { d: 'css/quiz-section.css', p: '(hover: none)', zasto: 'NASLIJEĐE responsive/03 (`:active` odziv) → F4/3' },
        { d: 'css/quiz-section.css', p: '(max-width: 767px) and (hover: none) and (pointer: coarse)', zasto: 'NASLIJEĐE responsive/06 (48 px meta) → F4/3' },
        { d: 'css/policies.css', p: '(hover: none)', zasto: 'NASLIJEĐE (hover reset + `:active`) → F4/3' },
        { d: 'css/policies.css', p: '(max-width: 767px) and (hover: none) and (pointer: coarse)', zasto: 'NASLIJEĐE 06 (48 px meta) → F4/3' },
    ];
    // Omot `:hover` pravila = SPOSOBNOST (F1/8 ①; gradi ga hover-css.js, ručno u legal/consent, `and (pointer: fine)` u policies) — dopušten svugdje.
    const OMOT_HOVER = /^\(hover: hover\)( and \(pointer: fine\))?$/;
    const norm = (s) => s.replace(/\s+/g, ' ').replace(/\s*:\s*/g, ': ').trim().toLowerCase();
    const CSS = hodaj('css', '.css');
    let media = 0, sMotorom = 0, omota = 0;
    const iskoristeno = new Set();
    const prekrsaji = [];
    for (const f of CSS) {
        const src = bezKomentaraCss(citaj(...f.split('/')));
        const re = /@media\s*([^{]+?)\s*\{/g;
        let m;
        while ((m = re.exec(src))) {
            media++;
            const p = norm(m[1]);
            if (!/pointer|hover|display-mode/.test(p)) continue;
            sMotorom++;
            if (OMOT_HOVER.test(p)) { omota++; continue; }
            const i = OSNOVICA.findIndex((o) => o.d === f && norm(o.p) === p);
            if (i >= 0) iskoristeno.add(i);
            else prekrsaji.push(f + ': @media ' + p);
        }
    }
    const ostarjelo = OSNOVICA.map((o, i) => (iskoristeno.has(i) ? null : o.d + ': @media ' + o.p)).filter(Boolean);
    console.log('  · doseg: ' + CSS.length + ' datoteka u css/**, ' + media + ' @media blokova, ' + sMotorom + ' s pointer/hover (' + omota + ' omota `:hover`, ' + iskoristeno.size + '/' + OSNOVICA.length + ' iz osnovice)');
    tvrdi(CSS.length >= 20 && media >= 50 && sMotorom >= 8, 'brana je nešto dotaknula (≥ 20 datoteka, ≥ 50 @media, ≥ 8 s pointer/hover)', [CSS.length, media, sMotorom]);
    tvrdi(omota >= 4, 'omoti `(hover: hover)` postoje (legal · consent · policies) i prolaze kao SPOSOBNOST', omota);
    tvrdi(prekrsaji.length === 0, 'css/**: nijedan `@media (pointer…|hover…)` izvan imenovane osnovice — odluka o sučelju pita `:root[data-uredjaj~=…]`' + (prekrsaji.length ? ' — ' + prekrsaji.join(' | ') : ''));
    tvrdi(ostarjelo.length === 0, 'osnovica nije ostarjela (svaki imenovani blok još postoji)' + (ostarjelo.length ? ' — makni: ' + ostarjelo.join(' | ') : ''));
    tvrdi(OSNOVICA.every((o) => /SPOSOBNOST|NASLIJEĐE/.test(o.zasto)), 'svaki unos osnovice kaže JE LI sposobnost ili naslijeđe (i kamo seli)');
}

// ── ③ REDOSLIJED — boot.js sinkron PRIJE no-zoom.js na svih 6 stranica ────────
console.log('③ redoslijed: boot.js (sinkron) prije no-zoom.js (defer) na svakoj stranici; no-zoom samo čita');
{
    const stranice = fs.readdirSync(KORIJEN).filter((f) => f.endsWith('.html'));
    tvrdi(stranice.length === 6, 'šest HTML stranica u korijenu: ' + stranice.join(', '), stranice.length);
    for (const ime of stranice) {
        const html = citaj(ime);
        const b = html.search(/<script[^>]+js\/boot\.js/);
        const n = html.search(/<script[^>]+js\/no-zoom\.js/);
        const tagB = b >= 0 ? html.slice(b, html.indexOf('>', b) + 1) : '';
        const tagN = n >= 0 ? html.slice(n, html.indexOf('>', n) + 1) : '';
        // Jamstvo je IZVRŠNI redoslijed, ne mjesto u dokumentu: sinkrona skripta se izvrši dok parser
        // dođe do nje, `defer` tek kad je cijeli dokument parsiran — dakle poslije SVAKE sinkrone, ma gdje
        // stajala (na pravnim stranicama no-zoom stoji u <head>, boot na vrhu <body>). `async` to jamstvo
        // NEMA (izvrši se čim stigne, može i prije boota) — zato se traži baš `defer`.
        tvrdi(b >= 0 && n >= 0, ime + ': učitava i boot.js i no-zoom.js', [b, n]);
        tvrdi(tagB && !/\b(defer|async)\b/.test(tagB), ime + ': boot.js je sinkron (bez defer/async) — izvrši se tijekom parsiranja');
        tvrdi(/\bdefer\b/.test(tagN) && !/\basync\b/.test(tagN), ime + ': no-zoom.js je `defer` (ne async) → izvrši se poslije boota ma gdje stajao' + (n < b ? ' (ovdje stoji PRIJE u dokumentu, i to je u redu)' : ''));
    }
    const nz = bezKomentaraJs(citaj('js', 'no-zoom.js'));
    tvrdi(/window\.SokratUredjaj/.test(nz) && /\.os\s*!==\s*'ios'/.test(nz), 'no-zoom.js čita `window.SokratUredjaj.os` (ne njuška motor sam)');
    const bt = bezKomentaraJs(BOOT);
    tvrdi(/typeof window\.GestureEvent/.test(bt), 'boot.js prepoznaje iOS kroz `GestureEvent` (isti test koji je do F1/12 ⓪ stajao u no-zoom.js)');
    tvrdi(/setAttribute\(\s*'data-uredjaj'/.test(bt) && /window\.SokratUredjaj\s*=/.test(bt) && /Object\.freeze\(/.test(bt), 'boot.js piše `data-uredjaj` i zamrznut `window.SokratUredjaj`');
    tvrdi(/addEventListener\(\s*'change'/.test(bt) && /addListener\(/.test(bt), 'boot.js se prijavljuje na `change` (i `addListener` za stare motore)');
    tvrdi(/matchMedia\s*\(\s*'\(prefers-color-scheme: dark\)'/.test(bt), 'tema (F1/3) i dalje pita `prefers-color-scheme` u boot.js — uređaj-blok ju nije pojeo');
}

// ── ④ ŠPIL — CSS pita atribut, bundle ga nosi ─────────────────────────────────
console.log('④ špil kartica (F1/9) pita `:root[data-uredjaj~="dodir"]`, ne medij; bundle nosi selektor');
{
    const css = bezKomentaraCss(citaj('css', 'flashcards-section.css'));
    const bundle = citaj('styles.bundle.css');
    const DODIR = ':root[data-uredjaj~="dodir"]';
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    tvrdi(new RegExp(esc(DODIR) + ' \\.flashcard-ghost\\s*\\{[^}]*display:\\s*block').test(css), 'flashcards-section.css: sjene špila pod `' + DODIR + ' .flashcard-ghost`');
    tvrdi(new RegExp(esc(DODIR) + ' \\.flashcard-ghost\\[hidden\\]\\s*\\{\\s*display:\\s*none').test(css), '… `[hidden]` vraća `display: none` pod istim atributom');
    tvrdi(!/@media\s*\(pointer:\s*coarse\)/.test(css), '… nula `@media (pointer: coarse)` u flashcards-section.css');
    const uBundleu = (bundle.match(/\[data-uredjaj~="dodir"\]/g) || []).length;
    tvrdi(uBundleu >= 1, 'styles.bundle.css nosi `[data-uredjaj~="dodir"]` (build:css je pokrenut), pojava: ' + uBundleu, uBundleu);
    // Izvadak tokena za pravne stranice vadi `:root…{` blokove — pravilo SUČELJA `:root[data-uredjaj] .x` NIJE token
    // (prva verzija izvatka ga je pokupila i pravne stranice dobile špil kartica; build-css.js sad to odbija).
    tvrdi(citaj('css', 'tokens.static.css').indexOf('data-uredjaj') < 0, 'css/tokens.static.css (izvadak tokena) NE nosi pravila sučelja s `data-uredjaj`');
}

// ── ⑤ PRAGOVI — boot.js == pragovi koje CSS stvarno koristi ───────────────────
console.log('⑤ pragovi razreda u boot.js == dva najčešća praga širine u css/**');
{
    const brojac = new Map();
    let pojava = 0;
    for (const f of hodaj('css', '.css')) {
        const src = bezKomentaraCss(citaj(...f.split('/')));
        const re = /\((min|max)-width:\s*(\d+(?:\.\d+)?)(px|rem|em)\)/g;
        let m;
        while ((m = re.exec(src))) {
            pojava++;
            let px = Number(m[2]) * (m[3] === 'px' ? 1 : 16);
            if (m[1] === 'max') px += 1;               // (max-width: 767px) je isti prag kao (min-width: 768px)
            brojac.set(px, (brojac.get(px) || 0) + 1);
        }
    }
    const top = Array.from(brojac.entries()).sort((a, b) => b[1] - a[1]);
    console.log('  · doseg: ' + pojava + ' upita širine; najčešći: ' + top.slice(0, 5).map(([px, n]) => px + 'px×' + n).join(' · '));
    tvrdi(pojava >= 50, 'brana je nešto dotaknula (≥ 50 upita širine)', pojava);
    const dva = top.slice(0, 2).map(([px]) => px).sort((a, b) => a - b);
    tvrdi(PRAG && isto(dva, [P.tablet, P.stolno]), 'PRAGOVI ' + P.tablet + '/' + P.stolno + ' == dva najčešća praga u css/** (' + dva.join('/') + ')', top.slice(0, 4));
}

console.log('\n' + (pao ? '❌ palo: ' + pao + ' od ' + ukupno : '✅ sve prošlo (' + ukupno + ' tvrdnji)') + '\n');
process.exit(pao ? 1 : 0);
