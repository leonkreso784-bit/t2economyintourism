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
const fcBezKomAll = bezKomentara(FC_CSS);
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
// ⚠️ F1/13: mjerenje je iz `initFlashcards` preselilo u `postaviSpil`, jer novi špil sad ne pravi
// samo ulazak u mod nego i sve tri radnje izbornika kraja špila. Tvrdnja PRATI činjenicu (jedno
// mjesto), umjesto da traži staru liniju na starom mjestu; oba `exec` su pod stražom (brojač).
const spil = /function postaviSpil\([\s\S]*?\n\}/.exec(FC_JS);
tvrdi(!!initFc && /postaviSpil\(/.test(initFc[0]) && !!spil && /osvjeziKadar\(\);/.test(spil[0]),
    '`initFlashcards` → `postaviSpil` mjeri rezervu prije prvog crtanja kartice');
tvrdi(!!initFc && /if \(!flashcardListenersInitialized\)[\s\S]*initKadar\(\);/.test(initFc[0]),
    '`initKadar` se veže SAMO jednom (unutar `flashcardListenersInitialized`)');
tvrdi(/addEventListener\('resize', zakaziKadar\)/.test(FC_JS) && /addEventListener\('orientationchange', zakaziKadar\)/.test(FC_JS),
    'mjeri se na `resize` i `orientationchange` (pragovi trake se mijenjaju s okretanjem)');
tvrdi(/new ResizeObserver\(zakaziKadar\)/.test(FC_JS),
    'mjeri se i kad se promijeni SAMA traka — sigurni rub stigne poslije prve slike');
tvrdi(!/addEventListener\('scroll',\s*zakaziKadar/.test(FC_JS),
    'NE mjeri se na `scroll` — skrol ne mijenja nijednu od ovih visina');
// ⚠️ `exec(…)[0]` bez straže je RUŠENJE, ne crvena tvrdnja — a brana koja se sruši ne može se
// obrnuto provjeriti (`git worktree` na stablu prije cigle broji crvene, a ondje te funkcije NEMA;
// uhvaćeno upravo tako). Isto je `uredjaj.test.js` već zapisao za PRAGOVE: brana mora ostati BROJAČ.
const zakazi = /function zakaziKadar\(\)[\s\S]*?\n\}/.exec(FC_JS);
tvrdi(!!zakazi && /requestAnimationFrame/.test(zakazi[0]),
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
const fcBezKom = fcBezKomAll;
tvrdi(/\.flashcard,\s*\.flashcard-front,\s*\.flashcard-back\s*\{\s*touch-action:\s*pan-y/.test(fcBezKom),
    'F1/9 nalaz ①: `touch-action: pan-y` stoji na kartici I na oba skrolera (inače gesta dobije `pointercancel`)');
tvrdi(/\.flashcard-inner\s*\{[^}]*display:\s*grid/.test(fcBezKom),
    'BUG-013: grid-stack naličja je netaknut');
tvrdi(/grid-template-rows:\s*minmax\(0,\s*1fr\)/.test(BLOK),
    'kadar redu daje STROP (`minmax(0, 1fr)`) — inače kartica naraste do sadržaja umjesto da naličje skrola u sebi');
tvrdi(/justify-content:\s*safe center/.test(BLOK),
    '`safe center` na skrolerima — centriran preljev bi gornji dio ostavio nedohvatljivim');

console.log('\n── ⑨ RED GUMBA (②): ← ✕ ✓ → ─────────────────────────────────────────────');
const RED = /<div class="flashcard-controls">([\s\S]*?)<\/div>\s*<\/div>/.exec(HTML);
const redoslijed = RED ? (RED[1].match(/id="(btnPrev|btnWrong|btnCorrect|btnNext)"/g) || []).map((x) => x.slice(4, -1)) : [];
console.log('  · doseg: red gumba u markupu = ' + redoslijed.join(' · '));
tvrdi(redoslijed.join(',') === 'btnPrev,btnWrong,btnCorrect,btnNext',
    'redoslijed u MARKUPU je ← ✕ ✓ → (Leon: „strelica treba biti desno a ✕ lijevo")', redoslijed);
tvrdi(RED && /id="btnWrong"[\s\S]*?id="unknownCount"[\s\S]*?<\/button>/.test(RED[1])
    && /id="btnCorrect"[\s\S]*?id="knownCount"[\s\S]*?<\/button>/.test(RED[1]),
    'značke sjede na SVOM gumbu: `#unknownCount` na ✕, `#knownCount` na ✓');
tvrdi(RED && (RED[1].match(/data-i18n-aria="fc\.(prev|next|know|dontKnow)"/g) || []).length === 4,
    'sva četiri gumba imaju ime kroz i18n (`data-i18n-aria`) — ikona nije ime');
tvrdi(RED && (RED[1].match(/<i class="fas[^>]*aria-hidden="true"/g) || []).length === 4,
    'sve četiri ikone su `aria-hidden` — inače bi ligatura ušla u ime gumba');
tvrdi(!/class="flashcard-stats/.test(HTML) && fcBezKomAll.indexOf('.flashcard-stats') < 0,
    'blok statistike je otišao IZ MARKUPA I IZ CSS-a (brojke su sad značke) — nema klase-siročeta');
tvrdi(/\.stat\.correct\s*\{/.test(fcBezKomAll) && /\.stat\.wrong\s*\{/.test(fcBezKomAll),
    '`.stat.correct` / `.stat.wrong` OSTAJU — isti blok nosi ekran dopuna (`.fill-stats`, BUG-038)');

console.log('\n── ⑩ GUMBI NE SMIJU POBJEĆI NA EKRAN DOPUNA ─────────────────────────────');
// `.control-btn` je ZAJEDNIČKA komponenta: `.fill-controls` ima savjet · preskoči · sljedeće,
// a `.next` dijeli i klasu. Pravilo koje mijenja OBLIK, a nije omeđeno `.flashcard-controls`,
// ondje pretvara široke gumbe s natpisom u krugove — i nijedna brana to ne mjeri.
const PRAVILA = [];
{
    const cistiSve = bezKomentara(FC_CSS);
    // ⚠️ BEZ sidra na `}`: prva verzija je glasila `(^|\})\s*(…)` i time pojela zatvarajucu
    // viticu prethodnog pravila, pa je sljedece ostalo bez sidra — brana je citala SVAKO DRUGO
    // pravilo i tvrdila da je `.control-btn.wrong` nema. Selektor ionako ne smije sadrzavati viticu,
    // a ugnijezdena pravila u `@media` ovako izlaze sama (zaglavlje upita nikad ne zatvori viticu).
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = re.exec(cistiSve))) {
        const sel = m[1].trim().replace(/\s+/g, ' ');
        if (sel && sel[0] !== '@') PRAVILA.push({ sel: sel, tijelo: m[2] });
    }
}
const OBLIK = /border-radius:\s*50%|(^|;)\s*(width|height):\s*\d|background:\s*var\(--color-(ok|danger)\)/;
const pobjegli = PRAVILA.filter((r) => /\.control-btn/.test(r.sel) && OBLIK.test(r.tijelo)
    && r.sel.indexOf('.flashcard-controls') < 0);
console.log('  · doseg: ' + PRAVILA.length + ' pravila u datoteci · '
    + PRAVILA.filter((r) => /\.control-btn/.test(r.sel)).length + ' ih dira `.control-btn`');
tvrdi(pobjegli.length === 0, 'svako pravilo koje mijenja OBLIK ili SEMANTIČKU ISPUNU gumba omeđeno je `.flashcard-controls`', pobjegli.map((r) => r.sel));

console.log('\n── ⑪ SEMANTIKA = PUNA ISPUNA, NIKAD OBRUB (ADR-032) ─────────────────────');
const gumb = (klasa) => PRAVILA.find((r) => r.sel === '.flashcard-controls .control-btn.' + klasa);
tvrdi(gumb('wrong') && /background:\s*var\(--color-danger\)/.test(gumb('wrong').tijelo)
    && /color:\s*var\(--color-on-danger\)/.test(gumb('wrong').tijelo),
    '✕ = puna `--color-danger` + tinta `--color-on-danger` (bijelo pada u chalk/mint)');
tvrdi(gumb('correct') && /background:\s*var\(--color-ok\)/.test(gumb('correct').tijelo)
    && /color:\s*var\(--color-on-ok\)/.test(gumb('correct').tijelo),
    '✓ = puna `--color-ok` + tinta `--color-on-ok`');
const obrub = (tijelo) => {
    const m = /(^|;)\s*border:\s*([^;]+)/.exec(tijelo);
    return m ? m[2].trim() : '';
};
const sObrubom = PRAVILA.filter((r) => /\.flashcard-controls/.test(r.sel)
    && obrub(r.tijelo) && !/^(none|0|0px)$/.test(obrub(r.tijelo)));
tvrdi(sObrubom.length === 0, 'nijedan gumb kadra nema obrub (ADR-032: „ne smije biti obruba uopće")', sObrubom.map((r) => r.sel));
const okrugli = PRAVILA.find((r) => r.sel === '.flashcard-controls .control-btn');
tvrdi(okrugli && /border-radius:\s*50%/.test(okrugli.tijelo), 'gumbi su KRUGOVI, ne pravokutnici');
tvrdi(!/color-mix\([^)]*currentColor/.test(BLOK) && !(okrugli && /color-mix/.test(okrugli.tijelo)),
    'značka nema vlastitu plohu — tinta preko ispune je ČETVRTA ploha koju `check:contrast` ne mjeri (pouka C2)');

console.log('\n── ⑫ STRELICE: sklonjene, ali žive (F1/13 ih ne mora vraćati) ───────────');
tvrdi(new RegExp(PREFIKS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' #flashcards\\.active \\.flashcard-controls \\.control-btn\\.prev').test(BLOK)
    && /\.control-btn\.next \{ display: none/.test(BLOK),
    'na dodiru se ← i → skrivaju CSS-om (ne vade iz markupa)');
// ⚠️ F1/13: gumbi se vežu PO TABLICI `AKCIJE` (id u markupu → radnja u tablici), pa uz id više
// ne stoji ime funkcije. Ovdje se i dalje tvrdi ISTO: sva četiri gumba su živa i vezana.
tvrdi(/gumb: 'btnPrev'/.test(FC_JS) && /gumb: 'btnNext'/.test(FC_JS) && /vezeGumbe\(AKCIJE\)/.test(FC_JS),
    'ista dva gumba su i dalje VEZANA u JS-u (kroz tablicu akcija) — skrivena, ne uklonjena');
tvrdi(/gumb: 'btnCorrect'/.test(FC_JS) && /gumb: 'btnWrong'/.test(FC_JS)
    && /sud > 0 \? markKnown : markUnknown/.test(FC_JS),
    'klik na ✓ / ✕ ide kroz POSTOJEĆI put upisa (`markKnown`/`markUnknown`), bez dvojnika');
tvrdi(/function naTipku\(e\)/.test(FC_JS) && /'ArrowRight'/.test(FC_JS),
    'tipke iz F1/9 (→ ← razmak) su netaknute');

console.log('\n── ⑧ BUNDLE: `npm run build:css` je pokrenut ─────────────────────────────');
tvrdi(BUNDLE.indexOf('.study-page.active:has(#flashcards.active)') >= 0,
    'styles.bundle.css nosi kadar (bez `build:css` bi preglednik crtao staro, a testovi zeleno)');

console.log('\n' + (pao ? '❌ palo: ' + pao + ' od ' + ukupno : '✅ sve prošlo (' + ukupno + ' tvrdnji)') + '\n');
process.exit(pao ? 1 : 0);
