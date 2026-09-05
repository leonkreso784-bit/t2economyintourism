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
 * ── ② MIŠ: HOVER SE NAORUŽA TEK PRVIM POMAKOM (F1/8 ②) ─────────────────────────
 * Na mišu je isti kvar STANDARDNO ponašanje preglednika: hover se računa po položaju
 * pokazivača, ne po pokretu, pa je nova kartica pod nepomičnim mišem odmah `:hover`
 * (`hover-probe --profil=prelaz`: ljepljivo 2/2 u Chromiumu). `js/utils.js` (`pauzirajHover`)
 * stavi `data-hover-paused` na `<html>` kad se mijenja ono što stoji pod pokazivačem, a prvi
 * `pointermove` ga skine. Ovaj modul svakom hover-selektoru doda prefiks
 * `:where(:root:not([data-hover-paused])) ` — `:where()` je NULA specifičnosti, pa kaskada
 * ostaje ista (usp. `tests/cascade.authed.spec.js`), a potomak-kombinator ne mijenja ništa
 * osim za `<html>` sam. Prefiks dobivaju i pravila koja VEĆ stoje pod hover-medijem
 * (Tailwindov `hover:` varijant, `policies.css`): njima se na mjestu prepisuje samo prelude.
 * Rubovi koji padaju glasno: hover-selektor koji počinje na `html`/`:root` (prefiks ga nikad
 * ne bi pogodio) i `&` (ugniježđeno pravilo — prefiks bi promijenio značenje). Danas 0 i 0.
 *
 * Koriste ga `scripts/build-css.js` (zamotaj) i `scripts/check-hover.js` (brana: nula golih,
 * nula nenaoružanih).
 */
const { transform } = require('lightningcss');

const HOVER_ZNACAJKE = new Set(['hover', 'any-hover']);
/** Prefiks kojim JS (`pauzirajHover`, `js/utils.js`) gasi hover do prvog pomaka miša (F1/8 ②). */
const PREFIKS = ':where(:root:not([data-hover-paused]))';

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

/** Nosi li selektor na početku prefiks `:where(:root:not([data-hover-paused])) ` (potomak-kombinator)? */
function jeNaoruzan(sel) {
  const w = sel[0];
  if (!w || w.type !== 'pseudo-class' || w.kind !== 'where' || !Array.isArray(w.selectors) || w.selectors.length !== 1) return false;
  const u = w.selectors[0];
  if (u.length !== 2 || u[0].type !== 'pseudo-class' || u[0].kind !== 'root') return false;
  const n = u[1];
  if (n.type !== 'pseudo-class' || n.kind !== 'not' || !Array.isArray(n.selectors) || n.selectors.length !== 1) return false;
  const a = n.selectors[0];
  if (a.length !== 1 || a[0].type !== 'attribute' || a[0].name !== 'data-hover-paused' || a[0].operation) return false;
  return !!sel[1] && sel[1].type === 'combinator' && sel[1].value === 'descendant';
}

/** Zašto se selektor NE SMIJE prefiksirati: 'html' (prvi spoj je html/:root) · 'nesting' (`&`) · null = smije. */
function zaprekaPrefiksa(sel) {
  if (sel.some((c) => c.type === 'nesting')) return 'nesting';
  for (const c of sel) {
    if (c.type === 'combinator') break;
    if ((c.type === 'type' && String(c.name).toLowerCase() === 'html') || (c.type === 'pseudo-class' && c.kind === 'root')) return 'html';
  }
  return null;
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
 * `pravila[i]` = { off, line, n, hoverIdx, naoruzanIdx, uHoverMediju, selektori }.
 */
function analiziraj(css, filename) {
  const tekst = css.replace(/\r\n/g, '\n');
  const lineStart = [0];
  for (let i = 0; i < tekst.length; i++) if (tekst[i] === '\n') lineStart.push(i + 1);
  const off = (loc) => lineStart[loc.line] + loc.column - 1;

  let ss = null;
  transform({ filename: filename || 'ulaz.css', code: Buffer.from(tekst), visitor: { StyleSheet(s) { ss = s; } } });
  if (!ss) throw new Error('hover-css: lightningcss nije dao StyleSheet za ' + filename);

  const doseg = { pravila: 0, selektora: 0, hoverSelektora: 0, hoverUMediju: 0, golihPravila: 0, golihSelektora: 0, naoruzanihSelektora: 0 };
  const pravila = [];
  const slozeni = [];
  const zapreke = [];

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
          const naoruzanIdx = hoverIdx.filter((i) => jeNaoruzan(v.selectors[i]));
          doseg.naoruzanihSelektora += naoruzanIdx.length;
          hoverIdx.forEach((i) => {
            const z = !naoruzanIdx.includes(i) && zaprekaPrefiksa(v.selectors[i]);
            if (z) zapreke.push({ line: v.loc.line + 1, selektor: selektorTekst(v.selectors[i]), zasto: z });
          });
          pravila.push({
            off: off(v.loc), line: v.loc.line + 1, n: v.selectors.length, hoverIdx, naoruzanIdx, uHoverMediju,
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
  if (zapreke.length) {
    throw new Error('hover-css: hover-selektor koji prefiks `' + PREFIKS + ' ` ne može pogoditi (html/:root kao prvi spoj) '
      + 'ili ugniježđen (`&`) — na mišu bi ostao ljepljiv; riješi ručno pa proširi modul:\n  '
      + zapreke.map((z) => filename + ':' + z.line + '  ' + z.selektor + '  (' + z.zasto + ')').join('\n  '));
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
 * Zamotaj sva GOLA hover-pravila u `@media (hover: hover)` na istom mjestu (①) i svakom
 * hover-selektoru bez prefiksa dodaj `:where(:root:not([data-hover-paused])) ` (②;
 * `opts.naoruzaj === false` ga preskače — za datoteke bez rutera, gdje se pod mišem ništa ne mijenja).
 * Idempotentno: drugi prolaz po vlastitom izlazu ne mijenja ništa.
 * Vraća { css, prije, poslije, zamotano, naoruzano } — ili baca ako obrnuta provjera ne prođe.
 */
function zamotaj(css, filename, opts) {
  const naoruzaj = !(opts && opts.naoruzaj === false);
  const { tekst, pravila, doseg } = analiziraj(css, filename);
  let t = tekst;
  const trebaPrefiks = (p) => naoruzaj && p.naoruzanIdx.length < p.hoverIdx.length;
  const posao = pravila.filter((p) => !p.uHoverMediju || trebaPrefiks(p)).sort((a, b) => b.off - a.off);
  let zamotano = 0, naoruzano = 0;

  for (const p of posao) {
    const o = p.off;
    const b = t.indexOf('{', o);
    const ls = t.lastIndexOf('\n', o) + 1;
    const uvlaka = t.slice(ls, o);
    if (/\S/.test(uvlaka)) throw new Error('hover-css: pravilo ne počinje na svom retku (' + filename + ':' + p.line + ')');
    const dijelovi = podijeliSelektore(t.slice(o, b));
    if (dijelovi.length !== p.n) {
      throw new Error('hover-css: tekst i AST se ne slažu u broju selektora (' + filename + ':' + p.line + ': tekst '
        + dijelovi.length + ', AST ' + p.n + ') — ' + JSON.stringify(t.slice(o, b)));
    }
    const sel = (i) => {
      if (naoruzaj && p.hoverIdx.includes(i) && !p.naoruzanIdx.includes(i)) { naoruzano++; return PREFIKS + ' ' + dijelovi[i]; }
      return dijelovi[i];
    };
    if (p.uHoverMediju) {
      // Već pod hover-medijem (①): samo prelude na mjestu, tijelo i položaj netaknuti.
      const rep = t.slice(o, b).match(/\s*$/)[0];
      t = t.slice(0, o) + dijelovi.map((_, i) => sel(i)).join(', ') + rep + t.slice(b);
      continue;
    }
    zamotano++;
    const kraj = krajBloka(t, b);
    const tijelo = t.slice(b, kraj + 1);
    const hover = dijelovi.map((_, i) => i).filter((i) => p.hoverIdx.includes(i)).map(sel);
    const ostali = dijelovi.filter((_, i) => !p.hoverIdx.includes(i));
    const tijeloUvuceno = tijelo.split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n');
    const dio = [];
    if (ostali.length) dio.push(ostali.join(', ') + ' ' + tijelo);
    dio.push('@media (hover: hover) {\n' + uvlaka + '  ' + hover.join(', ') + ' ' + tijeloUvuceno + '\n' + uvlaka + '}');
    t = t.slice(0, o) + dio.join('\n' + uvlaka) + t.slice(kraj + 1);
  }

  // Obrnuta provjera vlastitog izlaza: nula golih, nijedan hover-selektor izgubljen, svi naoružani.
  const poslije = analiziraj(t, filename).doseg;
  if (poslije.golihSelektora !== 0) {
    throw new Error('hover-css: nakon zamatanja još ' + poslije.golihSelektora + ' golih hover-selektora u ' + filename);
  }
  if (poslije.hoverSelektora !== doseg.hoverSelektora) {
    throw new Error('hover-css: izgubljeni hover-selektori u ' + filename + ' (prije ' + doseg.hoverSelektora + ', poslije ' + poslije.hoverSelektora + ')');
  }
  if (naoruzaj && poslije.naoruzanihSelektora !== poslije.hoverSelektora) {
    throw new Error('hover-css: ' + (poslije.hoverSelektora - poslije.naoruzanihSelektora) + ' hover-selektora bez prefiksa `' + PREFIKS + '` u ' + filename);
  }
  return { css: t, prije: doseg, poslije, zamotano, naoruzano };
}

/**
 * Brana: koja hover-pravila stoje IZVAN medija koji spominje hover (`gola`) i koja nose bar jedan
 * hover-selektor BEZ prefiksa `:where(:root:not([data-hover-paused]))` (`nenaoruzana`).
 */
function gola(css, filename) {
  const { pravila, doseg } = analiziraj(css, filename);
  return {
    doseg,
    gola: pravila.filter((p) => !p.uHoverMediju),
    nenaoruzana: pravila.filter((p) => p.naoruzanIdx.length < p.hoverIdx.length),
  };
}

module.exports = { PREFIKS, analiziraj, zamotaj, gola, mediaSpominjeHover, polozajHovera, podijeliSelektore, jeNaoruzan, zaprekaPrefiksa };
