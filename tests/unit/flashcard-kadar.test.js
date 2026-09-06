/* eslint-disable no-console */
// ===== TINDER-KADAR (F1/12): statički ugovor kadra — doseg selektora · ljuska · mjerena rezerva · markup =====
// Pokreni: node tests/unit/flashcard-kadar.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-06, s previewom F1/9): „Treba kartica biti veća i trebamo promijeniti
// veličinu kartica da budu kao na Tinderu." i „Know i don't know stoje dolje kao što Tinder ima lajk i
// ✕ … strelica treba biti desno a ✕ lijevo." Kadar se u pikselima mjeri u pregledniku (tvrdnja ⑩ u
// `tests/phone.spec.js`), ali tri načina da tiho umre piksel NE VIDI, jer se na zelenoj brani ne
// razlikuju od ispravnog stanja:
//
//   ① DOSEG — netko doda pravilo kadra bez prefiksa `:root[data-uredjaj~="dodir"]` i ono pobjegne na
//      STOLNO. Tvrdnja ⑩ mjeri samo iPhone profile, pa bi to ostalo zeleno; `css:diff` bi vidio razliku
//      tek ako ju netko pokrene na pravoj ruti i s klikom u mod kartica.
//   ② LJUSKA BEZ `.active` — `#flashcards` zadržava klasu `.active` i kad se ode sa stranice učenja, pa
//      `.study-page:has(#flashcards.active)` pogađa i SKRIVENU stranicu; `display: flex` iz
//      `variables.css` („Hide all pages by default") bio bi preglašen i stranica učenja bi se pojavila
//      preko landinga. Kadar bi na svojoj ruti bio savršen.
//   ③ REZERVA U DVA PRIMJERKA — visina donje trake je ZBROJ triju činjenica u `study-chrome.css`.
//      Napiše li je netko kao `calc()` pored mjerene, kadar i dalje izgleda točno, a stranica skrola
//      za razliku (izmjereno u cigli: 149 px footera + 81 px tijela + 24 px dvostruke rezerve).
//
// Uz to čuva ono što je cigla NASLIJEDILA i smjela pokvariti: grid-stack naličja (BUG-013),
// `touch-action: pan-y` na kartici I na skrolerima (F1/9 nalaz ①) i id-eve koje JS jedini piše.
//
// Obrnuta provjera (2026-09-06, `git worktree` na `a9e10c1` = stablo prije cigle): zapis u RASPORED-u.

const fs = require('fs');
const path = require('path');

const KORIJEN = path.join(__dirname, '..', '..');
const citaj = (...r) => fs.readFileSync(path.join(KORIJEN, ...r), 'utf8');
const postoji = (...r) => fs.existsSync(path.join(KORIJEN, ...r));

let pao = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime, detalj) => {
    ukupno++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  →  ' + JSON.stringify(detalj) : '')); }
};

const bezKomentara = (css) => css.replace(/\/\*[\s\S]*?\*\//g, ' ');

/** Selektori pravila u komadu CSS-a — bez `@media`/`@keyframes` zaglavlja i bez tijela. */
function selektori(css) {
    const out = [];
    const re = /(^|\})\s*([^{}@][^{}]*)\{/g;
    let m;
    while ((m = re.exec(css))) {
        m[2].split(',').forEach((s) => { const t = s.trim(); if (t) out.push(t); });
    }
    return out;
}

const FC_CSS = citaj('css', 'flashcards-section.css');
const PAGES_CSS = citaj('css', 'pages.css');
const FC_JS = citaj('js', 'flashcards.js');
const HTML = citaj('index.html');
const I18N = citaj('js', 'i18n.js');
const BUNDLE = postoji('styles.bundle.css') ? citaj('styles.bundle.css') : '';

const PREFIKS = ':root[data-uredjaj~="dodir"]';
const BILJEG = '── F1/12 ① — TINDER-KADAR NA DODIRU';

console.log('\n── ① DOSEG: kadar ne izlazi izvan dodira ─────────────────────────────────');
const biljeg = FC_CSS.indexOf(BILJEG);
// ⚠️ Rez ide od OTVARANJA komentara, ne od biljega u njemu: rez usred `/* … */` ostavlja komentar
// bez početka, pa ga čistač propusti i pola proze uđe u popis selektora (uhvaćeno prvim pokretanjem).
const i = biljeg < 0 ? -1 : FC_CSS.lastIndexOf('/*', biljeg);
const BLOK = i < 0 ? '' : bezKomentara(FC_CSS.slice(i));
const SEL = selektori(BLOK);
console.log('  · doseg: blok F1/12 ' + (i < 0 ? 'NIJE NAĐEN' : 'na ' + i + '. znaku') + ' · ' + SEL.length + ' selektora · '
    + BLOK.length + ' znakova');
tvrdi(i >= 0, 'blok „F1/12 ① — TINDER-KADAR" postoji u css/flashcards-section.css');
tvrdi(SEL.length >= 15, 'brana je nešto dotaknula (≥ 15 selektora u bloku)', SEL.length);
const bezPrefiksa = SEL.filter((s) => s.indexOf(PREFIKS) !== 0);
tvrdi(bezPrefiksa.length === 0, 'SVAKI selektor kadra počinje s ' + PREFIKS + ' — stolno ostaje netaknuto', bezPrefiksa);

console.log('\n── ② LJUSKA: kadar pogađa samo OTVORENU stranicu učenja ──────────────────');
const ljuska = SEL.filter((s) => s.indexOf('.study-page') >= 0);
tvrdi(ljuska.length > 0, 'kadar uopće dira ljusku stranice učenja', ljuska.length);
const bezActive = ljuska.filter((s) => s.indexOf('.study-page.active') < 0);
tvrdi(bezActive.length === 0, 'svako pravilo nad ljuskom traži `.study-page.active` (inače se skrivena stranica pojavi preko landinga)', bezActive);
tvrdi(/\.study-page\.active:has\(#flashcards\.active\)\s*\{[^}]*height:\s*calc\(100dvh - var\(--chrome-h\)\)/.test(BLOK),
    'visina ljuske = `calc(100dvh - var(--chrome-h))` — gornji kromo se ČITA IZ TOKENA, ne mjeri');
tvrdi(!/@media[^{]*\((pointer|hover|any-pointer|any-hover)\s*:/.test(BLOK),
    'kadar ne pita medij za pointer/hover — to je ugovor F1/12 ⓪ (atribut, ne `@media`)');

console.log('\n── ③ REZERVA ZA DONJU TRAKU: jedna, i to MJERENA ─────────────────────────');
tvrdi(/padding-bottom:\s*var\(--kartica-dolje,\s*var\(--safe-bottom\)\)/.test(BLOK),
    'ljuska rezervira `var(--kartica-dolje, var(--safe-bottom))` — bez trake vrijedi sigurni rub');
tvrdi(/setProperty\('--kartica-dolje'/.test(FC_JS) && /removeProperty\('--kartica-dolje'/.test(FC_JS),
    '`--kartica-dolje` se u js/flashcards.js i PIŠE i BRIŠE (brisanje vraća CSS-ov fallback, nula bi lagala)');
const drugdje = ['js', 'css'].flatMap((dir) => fs.readdirSync(path.join(KORIJEN, dir))
    .filter((f) => /\.(js|css)$/.test(f)).map((f) => dir + '/' + f))
    .filter((rel) => rel !== 'js/flashcards.js' && rel !== 'css/flashcards-section.css')
    .filter((rel) => citaj(...rel.split('/')).indexOf('--kartica-dolje') >= 0);
tvrdi(drugdje.length === 0, '`--kartica-dolje` postoji točno na dva mjesta: mjerač (js) i kadar (css)', drugdje);
tvrdi(!/calc\([^)]*(58px|60px|65px|80px)[^)]*\)/.test(BLOK),
    'kadar NE prepisuje visine donje trake kao broj — mjeri se pravi element (ADR-027)');
tvrdi(/body:has\(\.study-page\.active #flashcards\.active\)[^{]*\{[^}]*padding-bottom:\s*0/.test(bezKomentara(FC_CSS)),
    'tijelo u ovom modu nema svoju rezervu za istu traku (polegnuti telefon: 81 px)');
tvrdi(/body:has\(\.study-page\.active #flashcards\.active\)[^{]*\{[^}]*transition-property:/.test(bezKomentara(FC_CSS)),
    'ta se rezerva NE ANIMIRA — `body` nosi `transition: all`, a animirana visina je stvaran skrol dok traje');

console.log('\n── ④ FOOTER: ispod kartice koja je ekran ne stoji ništa ───────────────────');
const footerBlok = bezKomentara(PAGES_CSS);
tvrdi(new RegExp(PREFIKS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' body:has\\(\\.study-page\\.active #flashcards\\.active\\) \\.footer').test(footerBlok),
    'globalni footer se u modu kartica na dodiru skriva — i to ONDJE gdje stoji popis svih takvih mjesta (pages.css)');
tvrdi(/body:has\(\.landing-page\.active\) \.footer/.test(footerBlok),
    'zatečena dva slučaja (landing, browse) su netaknuta — cigla dodaje treći, ne prepisuje popis');

console.log('\n── ⑤ MJERAČ: kad se mjeri i kad se NE mjeri ──────────────────────────────');
const initFc = /function initFlashcards\(\)[\s\S]*?\n\}/.exec(FC_JS);
tvrdi(!!initFc && /osvjeziKadar\(\);/.test(initFc[0]),
    '`initFlashcards` mjeri rezervu prije prvog crtanja kartice');
tvrdi(!!initFc && /if \(!flashcardListenersInitialized\)[\s\S]*initKadar\(\);/.test(initFc[0]),
    '`initKadar` se veže SAMO jednom (unutar `flashcardListenersInitialized`)');
tvrdi(/addEventListener\('resize', zakaziKadar\)/.test(FC_JS) && /addEventListener\('orientationchange', zakaziKadar\)/.test(FC_JS),
    'mjeri se na `resize` i `orientationchange` (pragovi trake se mijenjaju s okretanjem)');
tvrdi(/new ResizeObserver\(zakaziKadar\)/.test(FC_JS),
    'mjeri se i kad se promijeni SAMA traka — sigurni rub stigne poslije prve slike');
tvrdi(!/addEventListener\('scroll',\s*zakaziKadar/.test(FC_JS),
    'NE mjeri se na `scroll` — skrol ne mijenja nijednu od ovih visina');
tvrdi(/requestAnimationFrame/.test(/function zakaziKadar\(\)[\s\S]*?\n\}/.exec(FC_JS)[0]),
    'mjerenje je prigušeno na kadar (rafal `resize`/`ResizeObserver` ne mjeri raspored deset puta)');

console.log('\n── ⑥ MARKUP: što kadar sakriva, JS mora i dalje imati ────────────────────');
tvrdi(/<section id="flashcards"[^>]*data-i18n-aria="fc\.title"/.test(HTML),
    'sekcija kartica ima ime kroz i18n (`data-i18n-aria="fc.title"`) — na dodiru joj `h1` otpada');
tvrdi(/'fc\.title':\s*\{/.test(I18N), 'ključ `fc.title` postoji u rječniku');
tvrdi(/<section id="flashcards"[^>]*aria-label="/.test(HTML),
    'ime stoji i u markupu (statički fallback prije nego i18n prođe)');
tvrdi(/<div class="flashcard-container[^>]*>\s*(<!--[\s\S]*?-->\s*)*<h1/.test(HTML),
    '`h1` OSTAJE u markupu — na dodiru ga skriva CSS pod atributom, stolno ga i dalje vidi');
tvrdi(new RegExp(PREFIKS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' #flashcards\\.active \\.flashcard-container > h1 \\{ display: none').test(BLOK),
    '`h1` se skriva SAMO pod atributom uređaja');
const brojID = (id) => (HTML.match(new RegExp('id="' + id + '"', 'g')) || []).length;
tvrdi(brojID('knownCount') === 1 && brojID('unknownCount') === 1,
    '`#knownCount` i `#unknownCount` postoje TOČNO jednom — `updateFlashcardStats` je jedini pisac',
    [brojID('knownCount'), brojID('unknownCount')]);
tvrdi(/getElementById\('knownCount'\)/.test(FC_JS) && /getElementById\('unknownCount'\)/.test(FC_JS),
    'JS i dalje piše u te id-eve (kadar ih smije premjestiti, ne izgubiti)');

console.log('\n── ⑦ NASLIJEĐENO: što kadar nije smio pokvariti ──────────────────────────');
const fcBezKom = bezKomentara(FC_CSS);
tvrdi(/\.flashcard,\s*\.flashcard-front,\s*\.flashcard-back\s*\{\s*touch-action:\s*pan-y/.test(fcBezKom),
    'F1/9 nalaz ①: `touch-action: pan-y` stoji na kartici I na oba skrolera (inače gesta dobije `pointercancel`)');
tvrdi(/\.flashcard-inner\s*\{[^}]*display:\s*grid/.test(fcBezKom),
    'BUG-013: grid-stack naličja je netaknut');
tvrdi(/grid-template-rows:\s*minmax\(0,\s*1fr\)/.test(BLOK),
    'kadar redu daje STROP (`minmax(0, 1fr)`) — inače kartica naraste do sadržaja umjesto da naličje skrola u sebi');
tvrdi(/justify-content:\s*safe center/.test(BLOK),
    '`safe center` na skrolerima — centriran preljev bi gornji dio ostavio nedohvatljivim');

console.log('\n── ⑧ BUNDLE: `npm run build:css` je pokrenut ─────────────────────────────');
tvrdi(BUNDLE.indexOf('.study-page.active:has(#flashcards.active)') >= 0,
    'styles.bundle.css nosi kadar (bez `build:css` bi preglednik crtao staro, a testovi zeleno)');

console.log('\n' + (pao ? '❌ palo: ' + pao + ' od ' + ukupno : '✅ sve prošlo (' + ukupno + ' tvrdnji)') + '\n');
process.exit(pao ? 1 : 0);
