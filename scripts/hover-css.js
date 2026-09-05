'use strict';
/**
 * hover-css.js — `:hover` smije vrijediti SAMO gdje hover postoji (cigla F1/8 ①).
 *
 * ── POVOD (Leon, 2026-09-05, *„od početka"*) ─────────────────────────────────────
 * *„Gumb koji je stajao na mjestu starog gumba isto svijetli po rubovima a nije ga se
 * diralo — jako naporno."* Na telefonu nakon dodira stranica promijeni rutu, a WebKit
 * (= SVAKI preglednik na iPhoneu) zadrži `:hover` na onome što se sad nalazi pod prstom.
 * Izmjereno 2026-09-05 u Playwrightovom WebKitu s dodirom: nova kartica pod nepomičnim
 * prstom odmah ima hover-izgled; `@media (hover: none)` protučinjenično vraća mirni izgled.
 * Presedan u repu: `css/policies.css:12` to već radi za tri gumba.
 *
 * ── ŠTO OVAJ MODUL RADI ──────────────────────────────────────────────────────────
 * Svako style-pravilo čiji selektor sadrži `:hover` završi unutar `@media (hover: hover)`,
 * NA ISTOM MJESTU u kaskadi (medijski upit ne mijenja ni redoslijed ni specifičnost — pa se
 * na mišu ne mijenja NIŠTA, a na dodiru pravilo ne postoji). Lista selektora se CIJEPA:
 * `.a:hover, .b:focus-visible { … }` → `.b:focus-visible { … }` ostaje vani, `.a:hover { … }`
 * ide u medij — fokus s tipkovnice ne smije ovisiti o tome ima li uređaj hover.
 *
 * ── ZAŠTO LIGHTNINGCSS ČITA, A TEKST SE PREPISUJE ────────────────────────────────
 * 148 pravila kroz 20 datoteka ne zamata se rukom (novo pravilo bi sutra opet bilo golo),
 * a regexom se ne parsira CSS (višeredne liste selektora, zarezi u `:is()`, `{` u
 * stringovima). Zato lightningcss — Tailwindov motor, već u `node_modules` — PARSIRA i daje
 * `loc` + pretke svakog pravila. Ali vraćanje cijelog stabla natrag u Rust puca
 * (`Specifier` se ne deserializira), i prepisao bi SVAKI bajt bundlea (`blue` → `#00f`),
 * pa bi `css:diff` mjerio šum. Zato se po `loc` prepisuje TEKST: bundle ostaje bajt-identičan
 * osim zamotanih pravila, a svaka razlika koju `css:diff` nađe je stvarna.
 *
 * ── RUBOVI KOJI PADAJU GLASNO (ADR-027: rub koji prepoznaš dobiva test) ──────────
 * • `:hover` unutar `:not()` / `:is()` / `:where()` / `:has()` — zamatanje bi PROMIJENILO
 *   značenje (`:not(:hover)` je stanje mirovanja i na dodiru mora vrijediti UVIJEK). Danas
 *   ih nema; kad se pojave, modul odbija graditi i kaže gdje.
 * • Pravilo koje već stoji pod medijem koji spominje `hover`/`any-hover` — preskače se
 *   (`policies.css`, `flashcards-section.css`, `quiz-section.css`); dvostruki omot bi
 *   `(hover: none)` pravila ugasio.
 * • Broj hover-selektora PRIJE i POSLIJE mora biti isti — nijedan se ne smije izgubiti.
 *
 * Koriste ga `scripts/build-css.js` (zamotaj) i `scripts/check-hover.js` (brana: nula golih).
 */
const { transform } = require('lightningcss');

const HOVER_ZNACAJKE = new Set(['hover', 'any-hover']);

/** Spominje li medijski uvjet `hover`/`any-hover` (bilo koja vrijednost, bilo koja dubina)? */
function mediaSpominjeHover(cond) {
  if (!cond) return false;
  if (cond.type === 'feature') return HOVER_ZNACAJKE.has(cond.value && cond.value.name);
  if (cond.type === 'not') return mediaSpominjeHover(cond.value);
  if (cond.type === 'operation') return (cond.conditions || []).some(mediaSpominjeHover);
  return false;
}

/** Gdje u selektoru stoji `:hover`: 'nema' · 'pozitivan' (smije se zamotati) · 'slozen' (unutar :not/:is/:where/:has). */
function polozajHovera(sel) {
  let r = 'nema';
  for (const c of sel) {
    if (c.type !== 'pseudo-class') continue;
    if (c.kind === 'hover') { if (r === 'nema') r = 'pozitivan'; continue; }
    if (Array.isArray(c.selectors)) {
      for (const s of c.selectors) if (polozajHovera(s) !== 'nema') return 'slozen';
    }
  }
  return r;
}

/** Gruba serijalizacija selektora — samo za poruke o greškama, ne za izlaz. */
function selektorTekst(sel) {
  return sel.map((c) => {
    switch (c.type) {
      case 'type': return c.name;
      case 'universal': return '*';
      case 'class': return '.' + c.name;
      case 'id': return '#' + c.name;
      case 'attribute': return '[' + c.name + ']';
      case 'combinator': return c.value === 'descendant' ? ' ' : ' ' + ({ child: '>', 'next-sibling': '+', 'later-sibling': '~' }[c.value] || c.value) + ' ';
      case 'pseudo-class': return ':' + c.kind + (Array.isArray(c.selectors) ? '(' + c.selectors.map(selektorTekst).join(', ') + ')' : '');
      case 'pseudo-element': return '::' + c.kind;
      case 'nesting': return '&';
      default: return '<' + c.type + '>';
    }
  }).join('');
}

/**
 * Parsiraj CSS i vrati sva style-pravila s `:hover` + brojeve dosega.
 * `pravila[i]` = { off, line, n, hoverIdx, uHoverMediju, selektori }.
 */
function analiziraj(css, filename) {
  const tekst = css.replace(/\r\n/g, '\n');
  const lineStart = [0];
  for (let i = 0; i < tekst.length; i++) if (tekst[i] === '\n') lineStart.push(i + 1);
  const off = (loc) => lineStart[loc.line] + loc.column - 1;

  let ss = null;
  transform({ filename: filename || 'ulaz.css', code: Buffer.from(tekst), visitor: { StyleSheet(s) { ss = s; } } });
  if (!ss) throw new Error('hover-css: lightningcss nije dao StyleSheet za ' + filename);

  const doseg = { pravila: 0, selektora: 0, hoverSelektora: 0, hoverUMediju: 0, golihPravila: 0, golihSelektora: 0 };
  const pravila = [];
  const slozeni = [];

  function walk(rules, uHoverMediju) {
    for (const r of rules) {
      if (r.type === 'style') {
        const v = r.value;
        doseg.pravila++;
        doseg.selektora += v.selectors.length;
        const poz = v.selectors.map(polozajHovera);
        poz.forEach((p, i) => { if (p === 'slozen') slozeni.push({ line: v.loc.line + 1, selektor: selektorTekst(v.selectors[i]) }); });
        const hoverIdx = poz.map((p, i) => (p === 'pozitivan' ? i : -1)).filter((i) => i >= 0);
        if (hoverIdx.length) {
          doseg.hoverSelektora += hoverIdx.length;
          if (uHoverMediju) doseg.hoverUMediju += hoverIdx.length;
          else { doseg.golihPravila++; doseg.golihSelektora += hoverIdx.length; }
          pravila.push({
            off: off(v.loc), line: v.loc.line + 1, n: v.selectors.length, hoverIdx, uHoverMediju,
            selektori: v.selectors.map(selektorTekst),
          });
        }
        if (Array.isArray(v.rules) && v.rules.length) walk(v.rules, uHoverMediju);
      } else if (r.type === 'media') {
        const hm = uHoverMediju || (r.value.query.mediaQueries || []).some((q) => mediaSpominjeHover(q.condition));
        walk(r.value.rules || [], hm);
      } else if (r.value && Array.isArray(r.value.rules)) {
        walk(r.value.rules, uHoverMediju);
      }
    }
  }
  walk(ss.rules, false);

  if (slozeni.length) {
    throw new Error('hover-css: `:hover` unutar :not()/:is()/:where()/:has() se NE SMIJE slijepo zamotati (mijenja značenje) — '
      + 'riješi ručno pa proširi modul:\n  ' + slozeni.map((s) => filename + ':' + s.line + '  ' + s.selektor).join('\n  '));
  }
  return { tekst, pravila, doseg };
}

/** Kraj bloka koji počinje na `{` na indeksu `b` — svjestan navodnika (u `content:` smije stajati `}`). */
function krajBloka(t, b) {
  let dubina = 0;
  let nav = null;
  for (let i = b; i < t.length; i++) {
    const ch = t[i];
    if (nav) { if (ch === '\\') i++; else if (ch === nav) nav = null; continue; }
    if (ch === '"' || ch === "'") { nav = ch; continue; }
    if (ch === '{') dubina++;
    else if (ch === '}' && --dubina === 0) return i;
  }
  throw new Error('hover-css: nezatvoren blok na indeksu ' + b);
}

/** Podijeli listu selektora na zarezima NULTE dubine (zagrade, uglate, navodnici). */
function podijeliSelektore(prelude) {
  const out = [];
  let dubina = 0, nav = null, start = 0;
  for (let i = 0; i < prelude.length; i++) {
    const ch = prelude[i];
    if (nav) { if (ch === '\\') i++; else if (ch === nav) nav = null; continue; }
    if (ch === '"' || ch === "'") { nav = ch; continue; }
    if (ch === '(' || ch === '[') dubina++;
    else if (ch === ')' || ch === ']') dubina--;
    else if (ch === ',' && dubina === 0) { out.push(prelude.slice(start, i).trim()); start = i + 1; }
  }
  out.push(prelude.slice(start).trim());
  return out;
}

/**
 * Zamotaj sva GOLA hover-pravila u `@media (hover: hover)` na istom mjestu.
 * Vraća { css, doseg, prije, poslije } — `poslije.golihSelektora` je 0 ili se baca.
 */
function zamotaj(css, filename) {
  const { tekst, pravila, doseg } = analiziraj(css, filename);
  let t = tekst;
  const gola = pravila.filter((p) => !p.uHoverMediju).sort((a, b) => b.off - a.off);

  for (const p of gola) {
    const o = p.off;
    const b = t.indexOf('{', o);
    const kraj = krajBloka(t, b);
    const ls = t.lastIndexOf('\n', o) + 1;
    const uvlaka = t.slice(ls, o);
    if (/\S/.test(uvlaka)) throw new Error('hover-css: pravilo ne počinje na svom retku (' + filename + ':' + p.line + ')');
    const dijelovi = podijeliSelektore(t.slice(o, b));
    if (dijelovi.length !== p.n) {
      throw new Error('hover-css: tekst i AST se ne slažu u broju selektora (' + filename + ':' + p.line + ': tekst '
        + dijelovi.length + ', AST ' + p.n + ') — ' + JSON.stringify(t.slice(o, b)));
    }
    const tijelo = t.slice(b, kraj + 1);
    const hover = dijelovi.filter((_, i) => p.hoverIdx.includes(i));
    const ostali = dijelovi.filter((_, i) => !p.hoverIdx.includes(i));
    const tijeloUvuceno = tijelo.split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n');
    const dio = [];
    if (ostali.length) dio.push(ostali.join(', ') + ' ' + tijelo);
    dio.push('@media (hover: hover) {\n' + uvlaka + '  ' + hover.join(', ') + ' ' + tijeloUvuceno + '\n' + uvlaka + '}');
    t = t.slice(0, o) + dio.join('\n' + uvlaka) + t.slice(kraj + 1);
  }

  // Obrnuta provjera vlastitog izlaza: nula golih, nijedan hover-selektor izgubljen.
  const poslije = analiziraj(t, filename).doseg;
  if (poslije.golihSelektora !== 0) {
    throw new Error('hover-css: nakon zamatanja još ' + poslije.golihSelektora + ' golih hover-selektora u ' + filename);
  }
  if (poslije.hoverSelektora !== doseg.hoverSelektora) {
    throw new Error('hover-css: izgubljeni hover-selektori u ' + filename + ' (prije ' + doseg.hoverSelektora + ', poslije ' + poslije.hoverSelektora + ')');
  }
  return { css: t, prije: doseg, poslije, zamotano: gola.length };
}

/** Brana: koja hover-pravila stoje IZVAN medija koji spominje hover. */
function gola(css, filename) {
  const { pravila, doseg } = analiziraj(css, filename);
  return { doseg, gola: pravila.filter((p) => !p.uHoverMediju) };
}

module.exports = { analiziraj, zamotaj, gola, mediaSpominjeHover, polozajHovera, podijeliSelektore };
