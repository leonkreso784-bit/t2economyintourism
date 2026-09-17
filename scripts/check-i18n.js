#!/usr/bin/env node
/**
 * check:i18n — nijedan tekst vidljiv korisniku ne smije biti zakucan mimo `js/i18n.js`.
 *
 * ── ZAŠTO OVA BRANA POSTOJI (backlog 2026-08-24, MREŽA B5) ─────────────────────────────
 * Zakucani engleski nije bio JEDNA traka nego RAZRED. T4 je našao cookie-traku bez ključeva
 * i zapisao pouku — ali kao anegdotu o toj traci („bila je jedina površina sa zakucanim
 * engleskim"). Ta rečenica je bila NEISTINITA U TRENUTKU PISANJA: pet dana kasnije cigla
 * `about` je našla cijelu stranicu s nula `data-i18n`, a mjerenje pri gradnji ove brane
 * još četiri stranice s nulom (contact/faq/privacy/terms — ne učitavaju ni `js/i18n.js`).
 * Nitko nije prebrojao, jer je anegdota zvučala kao zaključak. Ova brana je to brojanje,
 * trajno: K5 (editor dvojezično) je svoju brojku dobio RUČNIM prebrojavanjem — s ovom
 * branom bi ispao iz ispisa.
 *
 * ── ŠTO SE MJERI ───────────────────────────────────────────────────────────────────────
 *  ① HTML (korijenske `*.html`, samo `<body>`): tekstni čvor sa slovom čiji vlasnik nema
 *     `data-i18n` (za `<textarea>` vrijedi i `data-i18n-value`); atributi `placeholder` /
 *     `aria-label` / `alt` / `title` sa slovom bez `data-i18n-placeholder` / `-aria` /
 *     `-title` mehanizma (za alt mehanizam još ne postoji — nalaz svejedno stoji: tekst je
 *     korisniku izgovoren ili pokazan, a prevesti se ne može).
 *  ② JS (`js/**`, BEZ `js/i18n.js` — on JE rječnik): string/template literali koji nose
 *     HTML → parsiraju se kao fragment i sude ISTOM presudom kao ① (`${…}` se neutralizira,
 *     pa tekst koji dolazi kroz `t()` prirodno prolazi); plus poimence nabrojeni sinkovi:
 *     `.textContent/.innerText/.placeholder/.title =`, `setAttribute('aria-label'|
 *     'placeholder'|'title'|'alt', …)`, `showToast(`, `toast(`, `askConfirm(`.
 *  ③ KLJUČ BEZ RJEČNIKA: svaki literalni ključ u `t('x.y')`/`mt(`/`_adminT(` pozivu i
 *     svaki `data-i18n*="x.y"` atribut mora POSTOJATI u DICT-u `js/i18n.js`. Bez ovoga
 *     „ima ključ" ništa ne znači: `t()` za nepoznat ključ vrati SAM KLJUČ na ekran, a
 *     helperi s fallbackom vrate engleski — točno K5 nalaz (28 od 48 `studio.*` ključeva
 *     nije postojalo, a izbrojano je RUČNO; s ovom presudom ispada iz ispisa).
 *  ④ JEZIČNI BLOKOVI (F3/1, Leon 16.09.): pravne stranice nose OBA jezika u stranici —
 *     `<div class="jezik" lang="en">…</div><div class="jezik" lang="hr">…</div>`, a koji se
 *     vidi odluči `boot.js` prije crtanja. Tekst u bloku (i podebljanja i poveznice usred
 *     rečenice, zbog kojih `data-i18n` ondje ne radi) je preveden SAMO ako uz blok stoji
 *     SUSJEDNI blok drugog jezika istog OBLIKA (redoslijed naslova, odlomaka, stavki,
 *     poveznica) i nije doslovna kopija. Inače bi „omotaj engleski u lang=en" bio put da
 *     neprevedeni tekst prođe branu — zato blok bez para i blok krivog oblika prijavljuju
 *     SVE nositelje teksta izvornog (engleskog) bloka, ne jedan zbirni nalaz.
 *
 * Iznimke su KRATKE I IZRIČITE (uzor: `tests/about.spec.js` tvrdnja ③): tekst bez slova,
 * e-adrese, URL-ovi i vlastita imena s popisa `VLASTITA_IMENA`. Popis se ne smije
 * pretvoriti u kantu — svako novo ime traži da je stvarno neprevodivo.
 *
 * ── ŠTO SVJESNO NIJE UNUTRA (granice mjere — mjerač mora reći svoje granice) ───────────
 *  · `<head>` (`<title>`, meta, og:) — to je domena `check:seo` („jedna priča, jedan
 *    tekst"); hoće li se head prevoditi je proizvodna odluka, ne dug.
 *  · sadržaj `data/**` — gradivo je JEDNOJEZIČNO PO PROGRAMU po dizajnu (ADR-012).
 *  · inline `<script>` u HTML-u — sadržaj mu preskačemo kao i parser; seli van u D1 (CSP).
 *  · stringovi sastavljeni iz varijabli u JS-u — statička analiza ih ne vidi; vidi ih
 *    tek DOM, a živi DOM-sud ima lažno-pozitivan razred (tekst kroz `t()` bez atributa).
 *    Isto vrijedi za DINAMIČKE ključeve (`t('nav.' + mode)`) — presuda ③ sudi literale.
 *  · engleski FALLBACK uz POSTOJEĆI ključ (`t('x', 'Text')` gdje `x` jest u DICT-u) —
 *    mrtav tekst koji se nikad ne prikaže; brojati ga bi značilo kažnjavati opreznost.
 *  · poruke u `throw`/`console` — nisu korisnikov ekran.
 *  · u `setAttribute(atribut, …)` uvjetni izraz se sudi SAMO kad su OBJE grane literali
 *    (`uvjet ? 'A' : 'B'`, F3/2 cigla 4a). Grana koja je poziv — `window.t ? t('k') : 'X'`,
 *    `tr('k', 'X')` — je rezerva uz ključ, a broji li se ona, presuda je o fallbacku
 *    (u `askConfirm` se danas broji, u predlošcima ne); mjereno 16.09.: 5 takvih mjesta.
 *
 * ── ČEGRTALJKA (obrazac `check:palette`, po izričitom zahtjevu backloga) ───────────────
 * Osnovica `scripts/i18n-baseline.json` drži BROJ nalaza PO DATOTECI. Rast broja u
 * datoteci = PAD (ispisuju se svi njezini nalazi). Datoteka koje nema u osnovici, a ima
 * nalaze = PAD — točno `about`-razred: nova stranica s nulom ključeva ne smije ući tiho.
 * Pad broja = GLASNI „RIJEŠENO" + savjet `--update`. Nedostajuća osnovica RUŠI (exit 2):
 * brana koja o svom kvaru šuti nije stroža nego pokvarena. `--update` spušta (i diže —
 * dizanje je svjesna radnja s obrazloženjem u commitu). `--list` ispisuje sve nalaze:
 * to je mjerni izvještaj na kojem se jednog dana presuđuje prevoditi-ili-gasiti.
 *
 * Očekivano stanje pri uvođenju: nalaza je PUNO (četiri cijele stranice + editorski JS).
 * Osnovica ih drži da suita ne stoji crvena; brana čuva da ih ne bude VIŠE.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const KORIJEN = process.cwd();
const OSNOVICA_PUT = path.join(KORIJEN, 'scripts', 'i18n-baseline.json');
const ZA_UPDATE = process.argv.includes('--update');
const ISPISI_SVE = process.argv.includes('--list');

// ── Iznimke ────────────────────────────────────────────────────────────────────────────
// Vlastita imena se NE prevode — jedini ispravan izuzetak (uzor: about ③). Kratko i izričito.
const VLASTITA_IMENA = [
  'Sokrat Study', 'Sokrat', 'sokratstudy.com', 'Leon Kreso',
  'FontAwesome', 'KaTeX', 'GitHub', 'Google Analytics', 'Sentry', 'Supabase', 'Vercel',
];

/** Makni sve što se legitimno NE prevodi; ako i dalje ostane slovo — tekst je nalaz. */
function ocisti(s) {
  let t = String(s);
  t = t.replace(/\u0000/g, ' ');                                  // neutralizirani `${…}`
  t = t.replace(/&[a-zA-Z]+;|&#x?[0-9a-fA-F]+;/g, ' ');           // HTML entiteti
  t = t.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, ' ');              // e-adrese
  t = t.replace(/https?:\/\/\S+|\bwww\.\S+/g, ' ');               // URL-ovi
  for (const ime of VLASTITA_IMENA) t = t.split(ime).join(' ');
  return t;
}
const imaSlovo = (s) => /[A-Za-zÀ-ž]/.test(ocisti(s));

// ── Rječnik (za presudu ③: ključ mora postojati) ───────────────────────────────────────
// Ključevi su konvencijom TOČKASTI ('nav.home') — samo takvi se i sude; vrijednost s
// interpolacijom (`data-i18n="${k}"`) je dinamički ključ i izvan je dosega (granica gore).
const OBLIK_KLJUCA = /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/;
const DICT_PUT = path.join(KORIJEN, 'js', 'i18n.js');
let DICT = null;
if (fs.existsSync(DICT_PUT)) {
  DICT = new Set();
  const src = fs.readFileSync(DICT_PUT, 'utf8');
  const re = /'([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)'\s*:\s*\{/g;
  let m;
  while ((m = re.exec(src)) !== null) DICT.add(m[1]);
} else {
  console.log('[check:i18n] ⚠️ js/i18n.js ne postoji — presuda „ključ bez rječnika" preskočena.');
}

function sudiKljuc(kljuc, datoteka, redak, gdje, prijavi) {
  if (DICT && OBLIK_KLJUCA.test(kljuc) && !DICT.has(kljuc)) {
    prijavi({ datoteka, redak, vrsta: 'ključ bez rječnika (' + gdje + ')', tekst: kljuc });
  }
}

// ── HTML skener (ručni tokenizator, kućni stil: nula ovisnosti kao check:cascade) ──────
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr']);
const SIROVI = new Set(['script', 'style', 'noscript', 'title']); // sadržaj se preskače

// Atribut → mehanizam kojim ga i18n sloj zna prevesti (null = mehanizam ne postoji,
// nalaz stoji svejedno jer je tekst korisniku vidljiv/izgovoren). `title` ga ima od F3/2
// (gumb za jezik u traci); `alt` još nema — ondje je dosad uvijek išlo vlastito ime.
const ATRIBUTI = {
  placeholder: 'data-i18n-placeholder',
  'aria-label': 'data-i18n-aria',
  alt: null,
  title: 'data-i18n-title',
};

function nadjiKrajTaga(html, od) {
  let i = od + 1;
  while (i < html.length) {
    const c = html[i];
    if (c === '"' || c === "'") {
      const kraj = html.indexOf(c, i + 1);
      i = kraj < 0 ? html.length : kraj + 1;
      continue;
    }
    if (c === '>') return i;
    i += 1;
  }
  return html.length - 1;
}

function vrijednostAtributa(tag, ime) {
  const m = tag.match(new RegExp('\\b' + ime.replace('-', '[-]') + '\\s*=\\s*("([^"]*)"|\'([^\']*)\')'));
  return m ? (m[2] != null ? m[2] : m[3]) : null;
}

/** Sudi atribute jednog (i djelomičnog) taga — koristi ga i HTML skener i JS skener
 *  za KONKATENIRANE literale koji počinju usred taga (`'" title="Povuci…">…'`).
 *  `prijaviTekst` prima nalaze o TEKSTU atributa (u jezičnom bloku se odgađaju do sparivanja);
 *  nalazi o ključu bez rječnika idu uvijek ravno u `prijavi`. */
function sudiAtributeTaga(tag, datoteka, redak, prijavi, prijaviTekst) {
  const tekstNalaz = prijaviTekst || prijavi;
  for (const [atr, mehanizam] of Object.entries(ATRIBUTI)) {
    const v = vrijednostAtributa(tag, atr);
    if (v != null && imaSlovo(v)
      && !(mehanizam && new RegExp('\\b' + mehanizam + '\\s*=').test(tag))) {
      tekstNalaz({ datoteka, redak, vrsta: 'atribut ' + atr, tekst: v.trim().slice(0, 60) });
    }
  }
  // presuda ③: ključ na koji se element poziva mora postojati u rječniku —
  // `t()` za nepoznat ključ vrati SAM KLJUČ, pa korisnik na ekranu vidi 'landing.x'.
  for (const atr of ['data-i18n', 'data-i18n-placeholder', 'data-i18n-value', 'data-i18n-aria', 'data-i18n-title']) {
    const v = vrijednostAtributa(tag, atr);
    if (v != null) sudiKljuc(v, datoteka, redak, atr, prijavi);
  }
}

/**
 * Prođi HTML i prijavi nositelje teksta bez ključa.
 * @param {string} izvor
 * @param {string} datoteka  ime za nalaz
 * @param {number} bazniRedak  redak na kojem izvor počinje (za JS literale)
 * @param {boolean} jeFragment  fragment iz JS-a = cijeli je „body"
 * @param {(n: {datoteka: string, redak: number, vrsta: string, tekst: string}) => void} prijavi
 */
function skenirajHtml(izvor, datoteka, bazniRedak, jeFragment, prijavi) {
  const redak = (poz) => bazniRedak + izvor.slice(0, poz).split('\n').length - 1;
  const stog = [];
  const blokovi = [];   // presuda ④, redom kojim su otvoreni
  const blokOko = () => {
    for (let s = stog.length - 1; s >= 0; s -= 1) if (stog[s].blok) return stog[s].blok;
    return null;
  };
  let uBody = jeFragment;
  let i = 0;
  while (i < izvor.length) {
    if (izvor.startsWith('<!--', i)) {
      const k = izvor.indexOf('-->', i);
      i = k < 0 ? izvor.length : k + 3;
      continue;
    }
    if (izvor[i] === '<') {
      const k = nadjiKrajTaga(izvor, i);
      const tag = izvor.slice(i, k + 1);
      const m = tag.match(/^<\s*(\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!m) { i += 1; continue; } // golo `<` u tekstu (npr. „< 5")
      const zatvara = m[1] === '/';
      const ime = m[2].toLowerCase();
      if (zatvara) {
        if (ime === 'body') uBody = false;
        for (let s = stog.length - 1; s >= 0; s -= 1) {
          if (stog[s].ime === ime) { stog.length = s; break; }
        }
      } else {
        if (ime === 'body') uBody = true;
        const oko = blokOko();
        if (oko && OBLIK_TAGOVI.has(ime)) oko.oblik.push(ime);
        if (uBody && ime !== 'body') {
          sudiAtributeTaga(tag, datoteka, redak(i), prijavi, oko ? oko.odgodi : prijavi);
        }
        if (SIROVI.has(ime)) {
          const kraj = izvor.toLowerCase().indexOf('</' + ime, k + 1);
          i = kraj < 0 ? izvor.length : kraj;
          continue;
        }
        if (!/\/>$/.test(tag) && !VOID.has(ime)) {
          const lang = (uBody && !oko) ? jezikBloka(tag) : null;   // blok u bloku nije blok
          let blok;
          if (lang) {
            const nalazi = [];
            blok = { lang, redak: redak(i), oblik: [], tekst: [], nalazi, odgodi: (n) => nalazi.push(n) };
            blokovi.push(blok);
          }
          stog.push({ ime, tag, blok });
        }
      }
      i = k + 1;
      continue;
    }
    const k2 = izvor.indexOf('<', i + 1);
    const kraj = k2 < 0 ? izvor.length : k2;
    const tekst = izvor.slice(i, kraj);
    if (uBody && imaSlovo(tekst)) {
      const vlasnik = stog[stog.length - 1];
      const kljuc = vlasnik && /\bdata-i18n\s*=/.test(vlasnik.tag);
      const textareaValue = vlasnik && vlasnik.ime === 'textarea'
        && /\bdata-i18n-value\s*=/.test(vlasnik.tag);
      const oko = blokOko();
      if (oko) oko.tekst.push(ocisti(tekst).replace(/\s+/g, ' ').trim());
      if (!kljuc && !textareaValue) {
        (oko ? oko.odgodi : prijavi)({
          datoteka,
          redak: redak(i),
          vrsta: 'tekst u <' + (vlasnik ? vlasnik.ime : '?') + '>',
          tekst: tekst.trim().replace(/\s+/g, ' ').slice(0, 60),
        });
      }
    }
    i = kraj;
  }
  spariBlokove(blokovi, datoteka, prijavi);
}

// ── Presuda ④: jezični blokovi ─────────────────────────────────────────────────────────
const JEZICI_BLOKA = new Set(['en', 'hr']);
// OBLIK = ono što prijevod NE smije izgubiti ni dodati: strukturu i poveznice. Inline
// naglasci (`strong`/`em`/`br`/`span`) su izvan — hrvatska rečenica smije naglasiti drugu riječ.
const OBLIK_TAGOVI = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'dl', 'dt', 'dd', 'section', 'button']);

/** `lang` jezičnog bloka ili null. Blok = klasa `jezik` + `lang` iz popisa; sam `lang` (citat) nije blok. */
function jezikBloka(tag) {
  const klasa = vrijednostAtributa(tag, 'class');
  if (klasa == null || !/(^|\s)jezik(\s|$)/.test(klasa)) return null;
  const m = tag.match(/\slang\s*=\s*["']([a-z-]+)["']/i);
  return m && JEZICI_BLOKA.has(m[1].toLowerCase()) ? m[1].toLowerCase() : null;
}

function spariBlokove(blokovi, datoteka, prijavi) {
  const neprevedeno = (b, zasto) => {
    b.nalazi.forEach((n) => prijavi(Object.assign({}, n, { vrsta: 'jezični blok ' + zasto + ' · ' + n.vrsta })));
    if (!b.nalazi.length) prijavi({ datoteka, redak: b.redak, vrsta: 'jezični blok ' + zasto, tekst: 'lang=' + b.lang });
  };
  for (let b = 0; b < blokovi.length; b += 1) {
    const a = blokovi[b];
    const c = blokovi[b + 1];
    if (!c || c.lang === a.lang) { neprevedeno(a, 'bez para (lang=' + a.lang + ')'); continue; }
    b += 1;   // par je potrošen
    const izvor = a.lang === 'en' ? a : c;
    const prijevod = izvor === a ? c : a;
    if (izvor.oblik.join(' ') !== prijevod.oblik.join(' ')) {
      let x = 0;
      while (x < izvor.oblik.length && izvor.oblik[x] === prijevod.oblik[x]) x += 1;
      prijavi({
        datoteka, redak: prijevod.redak, vrsta: 'jezični blok: oblik se razlikuje',
        tekst: 'element #' + (x + 1) + ': en=' + (izvor.oblik[x] || '—') + ' · ' + prijevod.lang + '='
          + (prijevod.oblik[x] || '—') + ' (en ' + izvor.oblik.length + ', ' + prijevod.lang + ' '
          + prijevod.oblik.length + ')',
      });
      neprevedeno(izvor, 'krivog oblika');
    } else if (izvor.tekst.join(' ') === prijevod.tekst.join(' ') && izvor.nalazi.length) {
      neprevedeno(izvor, 'je doslovna kopija (' + prijevod.lang + ' = en)');
    }
  }
}

// ── JS skener ──────────────────────────────────────────────────────────────────────────
/**
 * Jedan prolaz kroz JS: vrati (a) izvor s komentarima ZAMIJENJENIM prazninom (stringovi
 * netaknuti — po njemu se traže sinkovi, da komentar ne bude lažni pogodak) i (b) popis
 * literala { tekst, redak } sa `${…}` neutraliziranim u \u0000.
 * Regex-literali se prepoznaju heuristikom „`/` nakon operatora" — bez nje bi
 * `/[&<>"']/g` iz esc-helpera pojeo pola datoteke kao „string".
 */
function prodjiJs(js) {
  const literali = [];
  let bezKom = '';
  let redak = 1;
  let zadnjiBitan = ''; // zadnji ne-razmak znak izvan stringova/komentara
  let i = 0;
  const REGEX_PRIJE = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', ';', '<', '>', '+', '-', '*', '%', '~', '^', '']);
  while (i < js.length) {
    const c = js[i];
    if (c === '\n') { redak += 1; bezKom += c; i += 1; continue; }
    if (c === '/' && js[i + 1] === '/') {
      const k = js.indexOf('\n', i);
      const kraj = k < 0 ? js.length : k;
      bezKom += ' '.repeat(kraj - i);
      i = kraj;
      continue;
    }
    if (c === '/' && js[i + 1] === '*') {
      const k = js.indexOf('*/', i + 2);
      const kraj = k < 0 ? js.length : k + 2;
      const blok = js.slice(i, kraj);
      redak += (blok.match(/\n/g) || []).length;
      bezKom += blok.replace(/[^\n]/g, ' ');
      i = kraj;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const pocetak = redak;
      let sadrzaj = '';
      let j = i + 1;
      while (j < js.length) {
        const d = js[j];
        if (d === '\\') { sadrzaj += '  '; j += 2; continue; }
        if (d === c) break;
        if (c === '`' && d === '$' && js[j + 1] === '{') {
          // preskoči interpolaciju (balansirane vitičaste; stringovi unutra se preskaču)
          let dubina = 1;
          let u = j + 2;
          while (u < js.length && dubina > 0) {
            const e = js[u];
            if (e === "'" || e === '"' || e === '`') {
              u += 1;
              while (u < js.length && js[u] !== e) { if (js[u] === '\\') u += 1; u += 1; }
            } else if (e === '{') dubina += 1;
            else if (e === '}') dubina -= 1;
            if (e === '\n') redak += 1;
            u += 1;
          }
          sadrzaj += '\u0000';
          j = u;
          continue;
        }
        if (d === '\n') redak += 1;
        sadrzaj += d;
        j += 1;
      }
      literali.push({ tekst: sadrzaj, redak: pocetak });
      bezKom += js.slice(i, Math.min(j + 1, js.length)).replace(/\n/g, '\n'); // stringovi ostaju
      zadnjiBitan = c;
      i = j + 1;
      continue;
    }
    if (c === '/' && REGEX_PRIJE.has(zadnjiBitan)) {
      // regex literal: do neescapiranog `/` izvan [...] klase
      let j = i + 1;
      let uKlasi = false;
      while (j < js.length) {
        const d = js[j];
        if (d === '\\') { j += 2; continue; }
        if (d === '[') uKlasi = true;
        else if (d === ']') uKlasi = false;
        else if (d === '/' && !uKlasi) break;
        else if (d === '\n') break; // nije bio regex — odustani
        j += 1;
      }
      bezKom += js.slice(i, j + 1);
      zadnjiBitan = '/';
      i = j + 1;
      continue;
    }
    if (!/\s/.test(c)) {
      // `return` prije `/` također najavljuje regex — pamti se kao prazan „operator"
      zadnjiBitan = c;
      if (/[a-zA-Z]/.test(c)) {
        const m = js.slice(Math.max(0, i - 6), i + 1);
        if (/\breturn$/.test(m) || /\btypeof$/.test(m)) zadnjiBitan = '';
      }
    }
    bezKom += c;
    i += 1;
  }
  return { bezKom, literali };
}

/** Pročitaj string/template literal koji počinje na poziciji `od` (navodnik) u `src`. */
function procitajLiteral(src, od) {
  const c = src[od];
  let sadrzaj = '';
  let j = od + 1;
  while (j < src.length) {
    const d = src[j];
    if (d === '\\') { sadrzaj += ' '; j += 2; continue; }
    if (d === c) break;
    if (c === '`' && d === '$' && src[j + 1] === '{') {
      let dubina = 1;
      let u = j + 2;
      while (u < src.length && dubina > 0) {
        if (src[u] === '{') dubina += 1;
        else if (src[u] === '}') dubina -= 1;
        u += 1;
      }
      sadrzaj += '\u0000';
      j = u;
      continue;
    }
    sadrzaj += d;
    j += 1;
  }
  return sadrzaj;
}

function redakNa(src, poz) { return src.slice(0, poz).split('\n').length; }

function skenirajJs(izvor, datoteka, prijavi) {
  const { bezKom, literali } = prodjiJs(izvor);

  // ② literali koji nose HTML — sude se istom presudom kao statički HTML.
  // Konkatenirani string zna POČETI usred taga (`'" title="Povuci…" aria-…>…'`) —
  // taj ostatak taga se sudi kao ATRIBUTI, ne kao tekstni čvor.
  for (const lit of literali) {
    if (/<[a-zA-Z/]/.test(lit.tekst)) {
      let frag = lit.tekst;
      const a = frag.indexOf('<');
      const b = frag.indexOf('>');
      if (b >= 0 && (a < 0 || b < a) && /=\s*["']/.test(frag.slice(0, b))) {
        sudiAtributeTaga(frag.slice(0, b + 1), datoteka, lit.redak, prijavi);
        frag = frag.slice(b + 1);
      }
      skenirajHtml(frag, datoteka, lit.redak, true, prijavi);
    }
  }

  // ② sinkovi — poimence nabrojeni (granica mjere: što nije ovdje, ne sudi se)
  const SINK = /(?:\.(?:textContent|innerText|placeholder|title)\s*=|\.setAttribute\(\s*['"](?:aria-label|placeholder|title|alt)['"]\s*,|\b(?:showToast|toast)\()\s*(['"`])/g;
  let m;
  while ((m = SINK.exec(bezKom)) !== null) {
    const pozLiterala = m.index + m[0].length - 1;
    const tekst = procitajLiteral(bezKom, pozLiterala);
    if (imaSlovo(tekst) && !/<[a-zA-Z]/.test(tekst)) { // HTML-literal je već suđen gore
      prijavi({
        datoteka, redak: redakNa(bezKom, m.index),
        vrsta: 'sink ' + m[0].trim().replace(/\s+/g, ' ').slice(0, 24),
        tekst: tekst.trim().slice(0, 60),
      });
    }
  }

  // ③ ključ bez rječnika u t-pozivima — kućni helperi ključ+fallback: `t` · `mt`
  // (my-materials, mail-admin) · `tt` · `_adminT` · `pt` (profile.js) · `at` (auth.js).
  // `pt` i `at` su ušli tek u F3/2 cigli 4a: do tada je ključ bez rječnika u profilu ili
  // prozoru za prijavu tiho pokazivao engleski fallback, a presuda ga nije vidjela.
  const TPOZIV = /\b(?:t|mt|tt|pt|at|_adminT)\(\s*(['"])([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)\1/g;
  while ((m = TPOZIV.exec(bezKom)) !== null) {
    sudiKljuc(m[2], datoteka, redakNa(bezKom, m.index), 't-poziv', prijavi);
  }

  // ② setAttribute(atribut, uvjet ? 'A' : 'B') — SINK gore hvata samo literal ODMAH iza
  // zareza, pa je uvjetni izraz s tekstom u obje grane prolazio: gumb za prijavu („My
  // profile"/„Sign in") i oko lozinke („Hide/Show password") govorili su engleski na
  // hrvatskom sučelju (F3/2 cigla 4a). Oblik je NAMJERNO uzak — v. zaglavlje, granice mjere.
  const SET = /\.setAttribute\(\s*(['"])(?:aria-label|placeholder|title|alt)\1\s*,/g;
  while ((m = SET.exec(bezKom)) !== null) {
    const tok = tokeniArgumenta(bezKom, m.index + m[0].length);
    for (let k = 0; k + 3 < tok.length; k += 1) {
      if (tok[k].znak !== '?' || tok[k + 1].lit == null || tok[k + 2].znak !== ':' || tok[k + 3].lit == null) continue;
      for (const grana of [tok[k + 1], tok[k + 3]]) {
        if (imaSlovo(grana.lit) && !/<[a-zA-Z]/.test(grana.lit)) {
          prijavi({
            datoteka, redak: redakNa(bezKom, grana.poz), vrsta: 'sink setAttribute uvjet',
            tekst: grana.lit.trim().slice(0, 60),
          });
        }
      }
    }
  }

  // ② askConfirm(...) — string-vrijednosti unutar poziva (naslov/poruka/gumbi su ekran)
  const AC = /\baskConfirm\(/g;
  while ((m = AC.exec(bezKom)) !== null) {
    let dubina = 1;
    let j = m.index + m[0].length;
    while (j < bezKom.length && dubina > 0) {
      const d = bezKom[j];
      if (d === "'" || d === '"' || d === '`') {
        const tekst = procitajLiteral(bezKom, j);
        // Ključ kao argument `t('admin.x', …)` / `_adminT(…)` NIJE zakucan tekst — on je
        // upravo suprotno: put u rječnik. FALLBACK (drugi argument, iza zareza) OSTAJE
        // nalaz: to je tekst koji živi izvan `js/i18n.js` (K5 razred). `.replace('{x}',…)`
        // prima uzorak za zamjenu, ne tekst.
        const prije = bezKom.slice(Math.max(0, j - 40), j);
        const poziv = prije.match(/([A-Za-z_$][A-Za-z0-9_$]*)\(\s*$/);
        const preskoci = poziv && ['t', '_adminT', 'replace'].includes(poziv[1]);
        if (!preskoci && imaSlovo(tekst) && !/<[a-zA-Z]/.test(tekst)) {
          prijavi({
            datoteka, redak: redakNa(bezKom, j), vrsta: 'askConfirm',
            tekst: tekst.trim().slice(0, 60),
          });
        }
        j += tekst.length + 2;
        continue;
      }
      if (d === '(') dubina += 1;
      else if (d === ')') dubina -= 1;
      j += 1;
    }
  }
}

/** Indeks IZA zatvarajućeg navodnika literala koji počinje na `od` (i s `${…}` u kojem su stringovi). */
function krajLiterala(src, od) {
  const c = src[od];
  let j = od + 1;
  while (j < src.length) {
    const d = src[j];
    if (d === '\\') { j += 2; continue; }
    if (d === c) return j + 1;
    if (c === '`' && d === '$' && src[j + 1] === '{') {
      let dubina = 1;
      j += 2;
      while (j < src.length && dubina > 0) {
        const e = src[j];
        if (e === "'" || e === '"' || e === '`') { j = krajLiterala(src, j); continue; }
        if (e === '{') dubina += 1;
        else if (e === '}') dubina -= 1;
        j += 1;
      }
      continue;
    }
    j += 1;
  }
  return src.length;
}

/**
 * Tokeni argumenata poziva od `od` do zagrade koja ga zatvara (dubina počinje s 1):
 * `{ lit, poz }` za string-literal, `{ znak, poz }` za svaki drugi ne-razmak znak.
 */
function tokeniArgumenta(src, od) {
  const tok = [];
  let dubina = 1;
  let j = od;
  while (j < src.length) {
    const d = src[j];
    if (d === "'" || d === '"' || d === '`') {
      tok.push({ lit: procitajLiteral(src, j), poz: j });
      j = krajLiterala(src, j);
      continue;
    }
    if (d === '(') dubina += 1;
    else if (d === ')') { dubina -= 1; if (dubina === 0) break; }
    if (!/\s/.test(d)) tok.push({ znak: d, poz: j });
    j += 1;
  }
  return tok;
}

// ── Prikupi datoteke ───────────────────────────────────────────────────────────────────
function jsDatoteke(mapa) {
  const rez = [];
  if (!fs.existsSync(mapa)) return rez;
  for (const ime of fs.readdirSync(mapa)) {
    const p = path.join(mapa, ime);
    if (fs.statSync(p).isDirectory()) rez.push(...jsDatoteke(p));
    else if (ime.endsWith('.js')) rez.push(p);
  }
  return rez;
}

const htmlPutanje = fs.readdirSync(KORIJEN).filter((f) => f.endsWith('.html'));
const jsPutanje = jsDatoteke(path.join(KORIJEN, 'js'))
  .map((p) => path.relative(KORIJEN, p).replace(/\\/g, '/'))
  .filter((p) => p !== 'js/i18n.js'); // rječnik sam sebe ne sudi

/** @type {Array<{datoteka: string, redak: number, vrsta: string, tekst: string}>} */
const nalazi = [];
// NUL (`\u0000`) je interna oznaka neutraliziranog `${…}` — u ispisu postaje vidljiv „⟨⟩",
// inače grep/terminal tretiraju izlaz kao binarni.
const prijavi = (n) => nalazi.push({ ...n, tekst: n.tekst.replace(/\u0000/g, '⟨⟩') });
let literalaUkupno = 0;

for (const f of htmlPutanje) {
  skenirajHtml(fs.readFileSync(path.join(KORIJEN, f), 'utf8'), f, 1, false, prijavi);
}
for (const f of jsPutanje) {
  const izvor = fs.readFileSync(path.join(KORIJEN, f), 'utf8');
  literalaUkupno += prodjiJs(izvor).literali.length;
  skenirajJs(izvor, f, prijavi);
}

// ── Presuda čegrtaljkom ────────────────────────────────────────────────────────────────
const poDatoteci = {};
for (const n of nalazi) poDatoteci[n.datoteka] = (poDatoteci[n.datoteka] || 0) + 1;

console.log('[check:i18n] dotaknuto: ' + htmlPutanje.length + ' html · ' + jsPutanje.length
  + ' js datoteka · ' + literalaUkupno + ' JS literala → ' + nalazi.length
  + ' nositelja teksta bez ključa u ' + Object.keys(poDatoteci).length + ' datoteka');

if (ISPISI_SVE) {
  for (const n of nalazi) {
    console.log('  ' + n.datoteka + ':' + n.redak + '  [' + n.vrsta + ']  "' + n.tekst + '"');
  }
}

if (ZA_UPDATE) {
  const sortirano = {};
  for (const k of Object.keys(poDatoteci).sort()) sortirano[k] = poDatoteci[k];
  fs.writeFileSync(OSNOVICA_PUT, JSON.stringify({
    _zasto: 'Broj nositelja teksta bez i18n kljuca PO DATOTECI (mjeri scripts/check-i18n.js).'
      + ' Rast = pad brane; pad = --update. Ovo je IZMJERENI dug, ne dopustenje: presuda'
      + ' prevoditi-ili-gasiti dvojezicnost donosi se nad `--list` ispisom, ne ovdje.',
    datoteke: sortirano,
  }, null, 2) + '\n');
  console.log('[check:i18n] osnovica zapisana: ' + Object.keys(sortirano).length + ' datoteka.');
  process.exit(0);
}

if (!fs.existsSync(OSNOVICA_PUT)) {
  console.error('[check:i18n] ✗ osnovica ne postoji: scripts/i18n-baseline.json — pokreni'
    + ' `node scripts/check-i18n.js --update` i commitaj je. Brana bez osnovice RUŠI,'
    + ' jer bi tiho „sve prolazi" bilo gore od pada.');
  process.exit(2);
}
const osnovica = JSON.parse(fs.readFileSync(OSNOVICA_PUT, 'utf8')).datoteke || {};

let pao = false;
let rijeseno = 0;
const sveDatoteke = new Set([...Object.keys(poDatoteci), ...Object.keys(osnovica)]);
for (const f of [...sveDatoteke].sort()) {
  const sad = poDatoteci[f] || 0;
  const bilo = osnovica[f] || 0;
  if (sad > bilo) {
    pao = true;
    console.error('\n[check:i18n] ✗ ' + f + ': ' + sad + ' nalaza, osnovica dopušta ' + bilo
      + (bilo === 0 ? ' (datoteka NIJE u osnovici — točno `about`-razred: nova površina bez ključeva)' : ''));
    for (const n of nalazi.filter((x) => x.datoteka === f).slice(0, 15)) {
      console.error('    :' + n.redak + '  [' + n.vrsta + ']  "' + n.tekst + '"');
    }
    if (sad > 15) console.error('    … (' + (sad - 15) + ' više — `node scripts/check-i18n.js --list`)');
  } else if (sad < bilo) {
    rijeseno += 1;
    console.log('[check:i18n] ⚠️ RIJEŠENO: ' + f + ' ' + bilo + ' → ' + sad
      + ' — spusti osnovicu (`node scripts/check-i18n.js --update`).');
  }
}

if (pao) {
  console.error('\n[check:i18n] Popravak NIJE dizanje osnovice nego ključ: tekst ide u DICT'
    + ' (`js/i18n.js`) i na element kroz `data-i18n`/`t()`. Dizanje osnovice je svjesna'
    + ' radnja s obrazloženjem u commitu.');
  process.exit(1);
}
console.log('[check:i18n] ✅ nijedna datoteka nije iznad osnovice'
  + (rijeseno ? ' (' + rijeseno + ' čeka spuštanje)' : '') + '.');
