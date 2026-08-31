#!/usr/bin/env node
/**
 * check:cascade — tko koga gasi u `css/responsive/*`.
 *
 * ── ZAŠTO OVA BRANA POSTOJI (MREŽA B4, 2026-08-31) ───────────────────────────
 * BUG-039 i BUG-037 su ČETIRI pojave istog mehanizma: medijski upit NE nosi
 * specifičnost, pa kad dva pravila imaju isti selektor i isto svojstvo, presuđuje
 * REDOSLIJED datoteka — ne to koji je upit „precizniji". `responsive/06` je zadnja
 * u nizu, pa je njezin `@media (min-width:768px) { max-width:650px }` gasio četiri
 * uža upita iz `05` (kviz na monitoru od 1920 px širok 650 px umjesto 900);
 * `02 @max-767` je gasio `01 @max-374` (mali telefoni bez svojih razmjera);
 * `06 @hover:none` je gasio landscape-pravila iz `04`/`05` (BUG-037, kartica od
 * 280 px u pojasu od 205); a kod `.progress-overview` su pragovi bili ISTI pa je
 * presudio isključivo redoslijed. Leonova presuda: sam IZGLED se ne dira prije C7
 * („nije toliki problem") — ali bug time smije postojati samo kao IZMJEREN POPIS,
 * ne kao „postoji negdje". Ova brana taj popis drži i pada na svakoj NOVOJ pojavi.
 *
 * ── ŠTO SE SMATRA GAŠENJEM ───────────────────────────────────────────────────
 * Isti selektor (nakon cijepanja zareza) + isto svojstvo + RAZLIČITA vrijednost,
 * u dvjema RAZLIČITIM `responsive/*` datotekama čiji se medijski uvjeti PREKLAPAJU
 * (širina/visina se sijeku, orijentacija/hover/pointer… nisu kontradiktorni) —
 * tada kasnija datoteka (redoslijed čita iz manifesta `css/app.css`, ne abecedno!)
 * pobjeđuje u cijelom presjeku. `!important` na ranijem pravilu obrće ishod pa se
 * takav par NE prijavljuje (raniji tada stvarno pobjeđuje); ista vrijednost se ne
 * prijavljuje (redundancija bez vidljive posljedice).
 *
 * ── GRANICE MJERE (svaki mjerač mora reći svoje) ─────────────────────────────
 *   • Doseg su SAMO `css/responsive/*` datoteke — spec B4 lovi razred iz BUG-039/037.
 *     Gašenje između responsivea i komponentnih datoteka postoji kao mehanizam, ali
 *     je dijelom NAMJERNO (app.css: „learn i editor POSLIJE responsivea, da nadglasaju
 *     njegove konflikte") pa bi mjera bez tog konteksta prijavljivala dizajn kao kvar.
 *   • Uspoređuju se DOSLOVNI selektori; `.a .b` vs `.b` s višom specifičnošću nije u
 *     dosegu (tamo ne presuđuje redoslijed nego specifičnost — drugi razred).
 *   • `@supports` s različitim uvjetima tretira se kao disjunktan (može promašiti
 *     gašenje, ne može lažno prijaviti); nepoznata diskretna značajka: ista vrijednost
 *     = preklop, različita = disjunktno, prisutna samo s jedne strane = preklop.
 *   • Duljine u medijskim upitima: px i rem/em (×16). Druge jedinice ne postoje ovdje.
 *
 * ── ČEGRTALJKA S IMENOVANOM OSNOVICOM ────────────────────────────────────────
 * Zatečene pojave IMENUJE `scripts/cascade-baseline.json` — odluka o izgledu ostaje
 * C7, s punim podacima. Nova pojava = pad (exit 1). Upis bez nalaza = uputa da se
 * osnovica spusti (`--update` ju prepisuje). Nedostajuća osnovica = exit 2.
 *
 * RABLJENJE:  node scripts/check-cascade.js [--update]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OSNOVICA = path.join(__dirname, 'cascade-baseline.json');

/* ── redoslijed datoteka iz manifesta (jedini izvor istine o redoslijedu) ── */
function redoslijedIzManifesta() {
  const manifest = fs.readFileSync(path.join(ROOT, 'css', 'app.css'), 'utf8');
  const out = [];
  const re = /@import\s+"\.\/(responsive\/[^"]+\.css)"/g;
  let m;
  while ((m = re.exec(manifest)) !== null) out.push(m[1]);
  if (!out.length) {
    console.error('check:cascade — manifest css/app.css ne uvozi nijednu responsive/* datoteku; mjera nema što mjeriti i to NIJE zeleno.');
    process.exit(2);
  }
  return out;
}

/* ── mikro-parser: komentari van, pa šetnja vitičastima ── */
function bezKomentara(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (s) => s.replace(/[^\n]/g, ' '));
}

/**
 * Vrati listu { uvjeti: [medijski uvjeti od korijena], selektor, deklaracije: {prop: {val, important}} }.
 * `@keyframes`/`@font-face` se preskaču; `@media`/`@supports` se rekurzivno ulazi (uvjeti se gomilaju).
 */
function parsiraj(css) {
  const out = [];
  hodaj(bezKomentara(css), []);
  return out;

  function hodaj(tekst, uvjeti) {
    let i = 0;
    while (i < tekst.length) {
      const otv = tekst.indexOf('{', i);
      if (otv === -1) break;
      const glava = tekst.slice(i, otv).trim();
      const kraj = parBrace(tekst, otv);
      const tijelo = tekst.slice(otv + 1, kraj);
      if (glava.startsWith('@media') || glava.startsWith('@supports')) {
        hodaj(tijelo, uvjeti.concat([glava]));
      } else if (glava.startsWith('@')) {
        /* @keyframes, @font-face… — nisu kaskadna pravila po selektoru */
      } else if (glava) {
        const deklaracije = {};
        for (const dio of tijelo.split(';')) {
          const dv = dio.indexOf(':');
          if (dv === -1) continue;
          const prop = dio.slice(0, dv).trim().toLowerCase();
          let val = dio.slice(dv + 1).trim();
          if (!prop || prop.startsWith('--')) continue; // custom-props: drugi razred (check:tokens)
          const important = /!important\s*$/i.test(val);
          val = val.replace(/!important\s*$/i, '').trim().replace(/\s+/g, ' ');
          deklaracije[prop] = { val, important };
        }
        for (const sel of glava.split(',')) {
          const s = sel.trim().replace(/\s+/g, ' ');
          if (s) out.push({ uvjeti, selektor: s, deklaracije });
        }
      }
      i = kraj + 1;
    }
  }

  function parBrace(tekst, otv) {
    let dubina = 0;
    for (let j = otv; j < tekst.length; j++) {
      if (tekst[j] === '{') dubina++;
      else if (tekst[j] === '}' && --dubina === 0) return j;
    }
    return tekst.length; // neuravnoteženo — uzmi do kraja, parser ne smije puknuti
  }
}

/* ── model medijskog uvjeta: lista OR-alternativa; alternativa = ograničenja ── */
function px(v) {
  const m = /^([\d.]+)(px|rem|em)$/.exec(v.trim());
  if (!m) return null;
  return parseFloat(m[1]) * (m[2] === 'px' ? 1 : 16);
}

function alternativa(str) {
  const a = { minW: 0, maxW: Infinity, minH: 0, maxH: Infinity, tip: null, diskretno: {} };
  const t = str.replace(/^@(media|supports)/, '').trim();
  if (/^@?supports/.test(str)) { a.diskretno['@supports'] = t; return a; }
  const tip = /(?:^|\s)(only\s+)?(screen|print|all|speech)(?:\s|$)/.exec(t);
  if (tip) a.tip = tip[2];
  const re = /\(\s*([a-z-]+)\s*:\s*([^)]+)\)/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    const ime = m[1];
    const val = m[2].trim();
    const broj = px(val);
    if (ime === 'min-width' && broj !== null) a.minW = Math.max(a.minW, broj);
    else if (ime === 'max-width' && broj !== null) a.maxW = Math.min(a.maxW, broj);
    else if (ime === 'min-height' && broj !== null) a.minH = Math.max(a.minH, broj);
    else if (ime === 'max-height' && broj !== null) a.maxH = Math.min(a.maxH, broj);
    else a.diskretno[ime] = val;
  }
  return a;
}

function uvjetUAlternative(uvjeti) {
  // Gomila od korijena: svaki @media/@supports sloj je AND; zarezi unutar sloja su OR.
  // Kartezijev produkt OR-alternativa svih slojeva, svaka spojena AND-om.
  let alts = [alternativa('')];
  for (const sloj of uvjeti) {
    const dijelovi = sloj.startsWith('@supports') ? [sloj] : sloj.split(',').map((d) => d.trim());
    const nove = [];
    for (const postojeca of alts) {
      for (const dio of dijelovi) {
        const b = alternativa(dio.startsWith('@') ? dio : '@media ' + dio);
        nove.push(spoji(postojeca, b));
      }
    }
    alts = nove;
  }
  return alts;

  function spoji(x, y) {
    const s = {
      minW: Math.max(x.minW, y.minW), maxW: Math.min(x.maxW, y.maxW),
      minH: Math.max(x.minH, y.minH), maxH: Math.min(x.maxH, y.maxH),
      tip: y.tip || x.tip, diskretno: Object.assign({}, x.diskretno, y.diskretno)
    };
    return s;
  }
}

function seSijeku(a, b) {
  if (a.tip && b.tip && a.tip !== 'all' && b.tip !== 'all' && a.tip !== b.tip) return false;
  if (Math.max(a.minW, b.minW) > Math.min(a.maxW, b.maxW)) return false;
  if (Math.max(a.minH, b.minH) > Math.min(a.maxH, b.maxH)) return false;
  for (const ime of Object.keys(a.diskretno)) {
    if (ime in b.diskretno && a.diskretno[ime] !== b.diskretno[ime]) return false;
  }
  return true;
}

function preklapajuSe(uvjetiA, uvjetiB) {
  for (const x of uvjetUAlternative(uvjetiA)) {
    for (const y of uvjetUAlternative(uvjetiB)) {
      if (seSijeku(x, y)) return true;
    }
  }
  return false;
}

/* ── mjera ── */
function opisUvjeta(uvjeti) {
  return uvjeti.length ? uvjeti.map((u) => u.replace(/\s+/g, ' ')).join(' && ') : '(bez upita)';
}

function izmjeri() {
  const datoteke = redoslijedIzManifesta();
  let pravila = 0;
  let deklaracija = 0;
  const poDatoteci = [];
  for (const rel of datoteke) {
    const p = path.join(ROOT, 'css', rel.split('/').join(path.sep));
    const lista = parsiraj(fs.readFileSync(p, 'utf8'));
    pravila += lista.length;
    for (const r of lista) deklaracija += Object.keys(r.deklaracije).length;
    poDatoteci.push({ ime: rel, lista });
  }

  // indeks: selektor → [{datoteka, redni, pravilo}]
  const poSelektoru = new Map();
  poDatoteci.forEach(({ ime, lista }, redni) => {
    for (const r of lista) {
      if (!poSelektoru.has(r.selektor)) poSelektoru.set(r.selektor, []);
      poSelektoru.get(r.selektor).push({ ime, redni, r });
    }
  });

  const nalazi = new Map(); // ključ → opis
  let parova = 0;
  for (const pojave of poSelektoru.values()) {
    for (let i = 0; i < pojave.length; i++) {
      for (let j = i + 1; j < pojave.length; j++) {
        const [rano, kasno] = pojave[i].redni <= pojave[j].redni ? [pojave[i], pojave[j]] : [pojave[j], pojave[i]];
        if (rano.redni === kasno.redni) continue; // ista datoteka — izvan dosega (v. zaglavlje)
        for (const prop of Object.keys(rano.r.deklaracije)) {
          if (!(prop in kasno.r.deklaracije)) continue;
          parova++;
          const dR = rano.r.deklaracije[prop];
          const dK = kasno.r.deklaracije[prop];
          if (dR.val === dK.val) continue;               // ista vrijednost — bez posljedice
          if (dR.important && !dK.important) continue;    // raniji !important stvarno pobjeđuje
          if (!preklapajuSe(rano.r.uvjeti, kasno.r.uvjeti)) continue;
          const kljuc = rano.r.selektor + ' | ' + prop + ' | ' +
            rano.ime + '@' + opisUvjeta(rano.r.uvjeti) + ' -> ' +
            kasno.ime + '@' + opisUvjeta(kasno.r.uvjeti);
          nalazi.set(kljuc, dK.val + ' gasi ' + dR.val); // kasnija vrijednost gasi raniju
        }
      }
    }
  }

  return { datoteke: datoteke.length, pravila, deklaracija, parova, nalazi };
}

/* ── presuda protiv osnovice ── */
function main() {
  const update = process.argv.includes('--update');
  const m = izmjeri();
  console.log('check:cascade — dotaknuto: ' + m.datoteke + ' datoteka · ' + m.pravila +
    ' pravila · ' + m.deklaracija + ' deklaracija · ' + m.parova + ' kandidat-parova → ' +
    m.nalazi.size + ' gašenja');

  if (update) {
    const obj = {};
    for (const k of [...m.nalazi.keys()].sort()) obj[k] = m.nalazi.get(k);
    fs.writeFileSync(OSNOVICA, JSON.stringify({
      _zasto: 'Zatecena gasenja u responsive/* (MREZA B4): kasnija datoteka gasi raniju jer medijski upit ne nosi specificnost (BUG-039/037). Odluka o IZGLEDU je C7 -- dotad brana pada samo na NOVOM gasenju. Spusta se s --update. Vidi scripts/check-cascade.js.',
      tolerirano: obj
    }, null, 2) + '\n');
    console.log('check:cascade — osnovica prepisana (' + m.nalazi.size + ' imenovanih).');
    return 0;
  }

  let base;
  try { base = JSON.parse(fs.readFileSync(OSNOVICA, 'utf8')); } catch (e) {
    console.error('check:cascade — osnovica ne postoji/ne parsira (' + OSNOVICA + '). Struktura je ugovor; stvori je s --update. ' + e.message);
    return 2;
  }
  const tol = base.tolerirano || {};

  const novi = [...m.nalazi.keys()].filter((k) => !(k in tol));
  const rijeseni = Object.keys(tol).filter((k) => !m.nalazi.has(k));

  for (const k of Object.keys(tol)) {
    if (m.nalazi.has(k)) console.log('  tolerirano: ' + k);
  }
  for (const k of rijeseni) {
    console.log('  ⚠️ RIJEŠENO: "' + k + '" više nema — spusti osnovicu (--update).');
  }
  if (novi.length) {
    console.error('\n❌ check:cascade — ' + novi.length + ' NOVO gašenje (kasnija responsive/* datoteka gasi raniju):');
    for (const k of novi) console.error('  • ' + k + '  (' + m.nalazi.get(k) + ')');
    console.error('\nPopravak NIJE dodati upis u osnovicu nego napisati ljestvu NA JEDNOM MJESTU (uz komponentu), gdje redoslijed datoteka ne presuđuje umjesto autora (BUG-039 §Rješenje).');
    return 1;
  }
  console.log('✅ check:cascade — nema novih gašenja (' + Object.keys(tol).length + ' imenovanih u osnovici).');
  return 0;
}

process.exit(main());
