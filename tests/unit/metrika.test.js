/* eslint-disable no-console */
// ===== MJERENJE AKTIVACIJE I POVRATKA — PONAŠANJE js/consent.js, BEZ PREGLEDNIKA =====
// Pokreni: node tests/unit/metrika.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: do 2026-09-07 se mjerio samo dolazak (pregled stranice), pa se nije moglo
// razlikovati posjetitelja koji je otišao od onoga koji je počeo učiti. Dodana su dva
// događaja — `ucenje` (aktivacija) i `povratak` (koji je ovo različit dan). Tri stvari se
// ovdje mogu tiho slomiti, a nijedna postojeća brana ih ne bi vidjela:
//
//   ① CURENJE KROZ GATE: `SokratMetrika.dogadaj()` smije poslati SAMO uz pristanak. Padne li
//      taj uvjet, šaljemo mjerenje posjetitelju koji ga je izričito odbio — to nije bug u
//      brojci nego prekršaj privole, i cijena mu nije naša nego Leonova.
//   ② ZAPIS BEZ PRISTANKA: brojač dana u localStorageu je trag kroz vrijeme, dakle isto što i
//      kolačić. Odbijeni posjetitelj ne smije dobiti NI ZAPIS, ne samo ni događaj.
//   ③ BROJANJE DANA: `dan` mora rasti po RAZLIČITOM danu, a ne po učitavanju stranice.
//      Broji li se svako učitavanje, „povratnik" postaje svatko tko dvaput osvježi stranicu i
//      brojka je gora od nikakve — izgleda točno, a laže u smjeru koji nam godi.
//
// Uz to ④: kuka u `switchSection()` je JEDINA točka aktivacije; nestane li iz koda, sve
// ostalo i dalje prolazi zeleno a mjerenja nema. Zato se traži staticki, u izvoru.
//
// Skripta se vrti u `vm` sandboxu s lažnim `document`/`localStorage`/`window`, pa test ne
// treba ni preglednik ni poslužitelj. Datumi se NE glume — umjesto lažnog sata se u zapis
// posije jučerašnji datum, dakle isti put kojim bi prošao stvarni povratnik.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const CONSENT = fs.readFileSync(path.join(KORIJEN, 'js', 'consent.js'), 'utf8');
const NAVIGACIJA = fs.readFileSync(path.join(KORIJEN, 'js', 'navigation.js'), 'utf8');

let pao = 0;
const tvrdi = (uvjet, ime, detalj) => {
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  → ' + JSON.stringify(detalj) : '')); }
};

/** Datum u obliku koji piše `danas()` u consent.js, pomaknut za `pomak` dana. */
function dan(pomak) {
    const d = new Date();
    d.setDate(d.getDate() + (pomak || 0));
    const m = d.getMonth() + 1, x = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x;
}

function element(tag, svi) {
    const el = {
        tagName: String(tag).toUpperCase(),
        id: '', className: '', href: '', type: '', textContent: '',
        style: { setProperty() {} },
        djeca: [], slusaci: {}, atributi: {},
        parentNode: null, uklonjen: false,
        setAttribute(k, v) { this.atributi[k] = String(v); },
        getAttribute(k) { return (k in this.atributi) ? this.atributi[k] : null; },
        appendChild(c) { this.djeca.push(c); if (c) { c.parentNode = this; c.uklonjen = false; } return c; },
        removeChild(c) {
            const i = this.djeca.indexOf(c);
            if (i >= 0) this.djeca.splice(i, 1);
            if (c) c.uklonjen = true;
            return c;
        },
        addEventListener(ev, fn) { (this.slusaci[ev] = this.slusaci[ev] || []).push(fn); },
        getBoundingClientRect() { return { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 }; },
        klik() { (this.slusaci.click || []).forEach((fn) => fn({})); },
    };
    svi.push(el);
    return el;
}

/**
 * Lažni svijet oko `consent.js`. `spremljeno` je početni localStorage (dakle: je li
 * posjetitelj već birao i ima li zapisane dane); `storageBaca` glumi privatni način.
 */
function svijet(o) {
    o = o || {};
    const store = Object.assign({}, o.spremljeno || {});
    const svi = [];
    const baci = () => { throw new Error('SecurityError: localStorage nedostupan'); };
    const localStorage = o.storageBaca
        ? { getItem: baci, setItem: baci, removeItem: baci }
        : {
            getItem: (k) => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; },
        };

    const document = {
        readyState: 'complete',
        documentElement: { style: { setProperty() {} } },
        head: element('head', svi),
        body: element('body', svi),
        createElement: (t) => element(t, svi),
        createTextNode: (t) => ({ nodeValue: String(t) }),
        getElementById: (id) => svi.find((e) => e.id === id && !e.uklonjen) || null,
        querySelectorAll: () => [],
        addEventListener() {},
    };

    const window = {
        innerHeight: 800, innerWidth: 393,
        addEventListener() {}, removeEventListener() {},
        getComputedStyle: () => ({ position: 'static', visibility: 'visible', display: 'block' }),
    };
    window.window = window;

    const ctx = { window, document, localStorage, console, Element: function () {} };
    vm.createContext(ctx);
    vm.runInContext(CONSENT, ctx, { filename: 'js/consent.js' });

    return {
        ctx, store, svi,
        metrika: () => window.SokratMetrika,
        /** Svi GA4 događaji koji su STVARNO otišli u dataLayer, redom. */
        dogadaji: () => (window.dataLayer || [])
            .filter((a) => a[0] === 'event')
            .map((a) => ({ ime: a[1], p: a[2] })),
        traka: () => document.getElementById('cookieBanner'),
        prihvati: () => document.getElementById('cookieAccept').klik(),
        odbij: () => document.getElementById('cookieReject').klik(),
    };
}

const DANI = 'sokrat-dani';
const IZBOR = 'sokrat-cookie-consent';

console.log('\n① Gate pristanka — bez „da" ne izlazi NIŠTA');
{
    const s = svijet({ spremljeno: { [IZBOR]: 'denied' } });
    const poslano = s.metrika().dogadaj('ucenje', { nacin: 'flashcards' });
    tvrdi(poslano === false, 'odbijen pristanak → dogadaj() vraća false');
    tvrdi(s.dogadaji().length === 0, 'odbijen pristanak → nula događaja u dataLayeru', s.dogadaji());
    tvrdi(!(DANI in s.store), 'odbijen pristanak → NIJEDAN zapis dana u localStorage', Object.keys(s.store));
}
{
    // Posjetitelj koji još nije birao: traka stoji, a mjerenje mora šutjeti sve dok ne klikne.
    const s = svijet({});
    tvrdi(!!s.traka(), 'bez izbora → traka je prikazana');
    tvrdi(s.metrika().dogadaj('ucenje', {}) === false, 'bez izbora → dogadaj() ne šalje');
    tvrdi(!(DANI in s.store), 'bez izbora → nema zapisa dana');
    s.prihvati();
    tvrdi(s.metrika().dogadaj('ucenje', { nacin: 'learn' }) === true, 'nakon „Prihvati" → događaj prolazi');
    tvrdi(s.store[DANI] !== undefined, 'nakon „Prihvati" → dan je zapisan');
}
{
    const s = svijet({});
    s.odbij();
    tvrdi(s.metrika().dogadaj('ucenje', {}) === false, 'nakon „Odbij" → događaj ne prolazi');
    tvrdi(!(DANI in s.store), 'nakon „Odbij" → nema zapisa dana');
}

console.log('\n② Aktivacija — događaj `ucenje` nosi način i predmet');
{
    const s = svijet({ spremljeno: { [IZBOR]: 'granted' } });
    s.metrika().dogadaj('ucenje', { nacin: 'flashcards', predmet: 'marketing' });
    const u = s.dogadaji().filter((e) => e.ime === 'ucenje');
    tvrdi(u.length === 1, 'poslan točno jedan `ucenje`', s.dogadaji());
    tvrdi(u[0] && u[0].p.nacin === 'flashcards' && u[0].p.predmet === 'marketing', 'nosi način i predmet', u[0]);
    tvrdi(s.metrika().dogadaj('') === false, 'prazno ime se ne šalje');
}

console.log('\n③ Povratak — `dan` raste po RAZLIČITOM danu, ne po učitavanju');
{
    const s = svijet({ spremljeno: { [IZBOR]: 'granted' } });
    const p = s.dogadaji().filter((e) => e.ime === 'povratak');
    tvrdi(p.length === 1 && p[0].p.dan === 1, 'prvi posjet → dan 1', p);
    tvrdi(p[0] && p[0].p.od_prvog === 0, 'prvi posjet → od_prvog 0', p[0]);
}
{
    // Isti dan, drugo učitavanje: zapis već postoji i `zadnji` je današnji.
    const zapis = JSON.stringify({ prvi: dan(-3), zadnji: dan(0), broj: 2 });
    const s = svijet({ spremljeno: { [IZBOR]: 'granted', [DANI]: zapis } });
    const p = s.dogadaji().filter((e) => e.ime === 'povratak')[0];
    tvrdi(p && p.p.dan === 2, 'isto učitavanje istog dana NE poveća dan', p);
    tvrdi(p && p.p.od_prvog === 3, 'od_prvog broji od prvog pristanka', p);
    tvrdi(JSON.parse(s.store[DANI]).broj === 2, 'zapis ostaje na 2', s.store[DANI]);
}
{
    // Pravi povratnik: zadnji put viđen jučer.
    const zapis = JSON.stringify({ prvi: dan(-5), zadnji: dan(-1), broj: 2 });
    const s = svijet({ spremljeno: { [IZBOR]: 'granted', [DANI]: zapis } });
    const p = s.dogadaji().filter((e) => e.ime === 'povratak')[0];
    tvrdi(p && p.p.dan === 3, 'novi dan → dan 3', p);
    tvrdi(p && p.p.od_prvog === 5, 'od_prvog 5', p);
    tvrdi(JSON.parse(s.store[DANI]).zadnji === dan(0), 'zapis pomaknut na danas', s.store[DANI]);
}
{
    const s = svijet({ spremljeno: { [IZBOR]: 'granted', [DANI]: 'nije-json' } });
    const p = s.dogadaji().filter((e) => e.ime === 'povratak')[0];
    tvrdi(p && p.p.dan === 1, 'pokvaren zapis → broji se kao prvi dan, ne puca', p);
}
{
    // Privatni način: svaki dodir localStoragea baca. Skripta se mora izvršiti do kraja.
    let puklo = null;
    let s = null;
    try { s = svijet({ storageBaca: true }); } catch (e) { puklo = String(e && e.message); }
    tvrdi(puklo === null, 'privatni način → consent.js se izvrši bez iznimke', puklo);
    if (s) {
        s.prihvati();
        const p = s.dogadaji().filter((e) => e.ime === 'povratak')[0];
        tvrdi(p && p.p.dan === 1, 'privatni način → događaj i dalje ide, dan 1', p);
    }
}

console.log('\n④ Kuka u switchSection() — jedina točka aktivacije');
{
    const i = NAVIGACIJA.indexOf('function switchSection(section)');
    const kraj = NAVIGACIJA.indexOf('\n}', i);
    const tijelo = i >= 0 && kraj > i ? NAVIGACIJA.slice(i, kraj) : '';
    tvrdi(i >= 0, 'switchSection() postoji u js/navigation.js');
    tvrdi(/SokratMetrika[\s\S]{0,80}dogadaj\(\s*'ucenje'/.test(tijelo),
        'switchSection() zove SokratMetrika.dogadaj(\'ucenje\')');
    tvrdi(/window\.SokratMetrika/.test(tijelo),
        'poziv je čuvan provjerom postojanja (pravne stranice nemaju consent.js kroz app)');
}

console.log('');
if (pao) { console.log('❌ ' + pao + ' tvrdnji palo\n'); process.exit(1); }
console.log('✅ mjerenje aktivacije i povratka — sve tvrdnje prošle\n');
