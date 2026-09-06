/* eslint-disable no-console */
// ===== KARTICE KAO TINDER-ŠPIL NA DODIRU (F1/9) — gesta u pješčaniku · JEDAN put upisa · CSS/markup =====
// Pokreni: node tests/unit/flashcard-swipe.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-05): „na mobitelu bi napravio za kartice kao tinder način otvaranja i
// gledanja". Gesta je NOVI ulaz u postojeće stanje (`AppState.cards.known/unknown` → statistika →
// `saveFlashcardProgress` → cloud-sync), pa je najskuplji mogući kvar tihi DRUGI put upisa: kartica
// upisana dvaput, ili upisana bez `saveProgress`, ili upisana u špil koji je u međuvremenu zamijenjen.
// Ekran to ne pokazuje (brojka izgleda točno), zato se ovdje BROJI:
//
//   ① gesta u pješčaniku (`vm`): miš ne pokreće ništa · dodir ispod praga se vraća bez upisa · dodir
//      iznad praga leti pa upiše TOČNO JEDNOM (stigao `transitionend` ili odbrojavanje, ma koji prvi) ·
//      okomit pomak se prepušta pregledniku · `pointercancel` ne upisuje · rep-klik geste ne okreće
//      karticu, a klik koji nikad ne stigne ne guta idući dodir · novi špil usred leta poništava let ·
//      `prefers-reduced-motion` = upis odmah, bez leta;
//   ② izvor: `cards.known.push` / `cards.unknown.push` postoje TOČNO jednom (u `markKnown` /
//      `markUnknown`), a gesta ih zove po referenci — ne kopira;
//   ③ CSS i markup: `touch-action: pan-y` na kartici (jedino odstupanje od reseta `pan-x pan-y`, F1/11),
//      sjene špila samo pod `:root[data-uredjaj~="dodir"]` (F1/12 ⓪, ne medij) i skrivene bez sljedeće kartice, pečati skriveni
//      `visibility`-jem dok gesta ne traje, oba i18n ključa postoje.
//
// Pravi dodir (CDP `Input.dispatchTouchEvent`, Chromium s `hasTouch`) mjeri `tests/flashcard-swipe.spec.js`.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const KORIJEN = path.join(__dirname, '..', '..');
const citaj = (...r) => fs.readFileSync(path.join(KORIJEN, ...r), 'utf8');
const FC = citaj('js', 'flashcards.js');

let pao = 0;
let ukupno = 0;
const tvrdi = (uvjet, ime, detalj) => {
    ukupno++;
    if (uvjet) console.log('  ✅ ' + ime);
    else { pao++; console.log('  ❌ ' + ime + (detalj !== undefined ? '  →  ' + JSON.stringify(detalj) : '')); }
};
const isto = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Lažni element: klase, inline-stil (samo custom-svojstva), slušači, atributi — točno ono što gesta dira. */
function element(id) {
    const klase = new Set();
    const stil = {};
    const slusaci = {};
    const attrs = {};
    const el = {
        id, hidden: false, offsetWidth: 300, textContent: '',
        classList: {
            add: (...k) => k.forEach((x) => klase.add(x)),
            remove: (...k) => k.forEach((x) => klase.delete(x)),
            toggle: (k) => (klase.has(k) ? (klase.delete(k), false) : (klase.add(k), true)),
            contains: (k) => klase.has(k),
        },
        style: {
            setProperty: (k, v) => { stil[k] = String(v); },
            removeProperty: (k) => { delete stil[k]; },
            width: '',
        },
        addEventListener: (t, fn) => { (slusaci[t] = slusaci[t] || []).push(fn); },
        removeEventListener: (t, fn) => { slusaci[t] = (slusaci[t] || []).filter((f) => f !== fn); },
        setPointerCapture: (pid) => { attrs.capture = pid; },
        setAttribute: (k, v) => { attrs[k] = String(v); },
        removeAttribute: (k) => { delete attrs[k]; },
        klase, stil, slusaci, attrs,
        posalji(t, ev) {
            const s = (slusaci[t] || []).slice();
            s.forEach((fn) => fn(Object.assign({ type: t, target: el }, ev || {})));
            return s.length;
        },
        klaseNiz: () => Array.from(klase).sort(),
    };
    return el;
}

/** Lažni svijet oko `js/flashcards.js`: 5 kartica u 2 sekcije, bez miješanja, rAF i timeri ručno. */
function svijet(opts) {
    opts = opts || {};
    const els = {};
    ['flashcard', 'btnPrev', 'btnNext', 'btnCorrect', 'btnWrong', 'cardCategory', 'cardQuestion', 'cardAnswer',
        'cardExplanation', 'cardProgress', 'cardProgressBar', 'knownCount', 'unknownCount',
        'flashcardGhost1', 'flashcardGhost2'].forEach((id) => { els[id] = element(id); });
    const rafs = [];
    const timers = [];
    const docSlusaci = {};
    const brojac = { saveProgress: 0, track: 0, accent: [], preventDefault: 0 };
    const sadrzaj = {
        a: { name: 'A', color: '#112233', flashcards: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3', color: '#445566' }] },
        b: { name: 'B', flashcards: [{ question: 'q4', answer: 'a4' }, { question: 'q5', answer: 'a5' }] },
    };
    const ctx = {
        console,
        document: {
            getElementById: (id) => els[id] || null,
            addEventListener: (t, fn) => { (docSlusaci[t] = docSlusaci[t] || []).push(fn); },
            querySelector: () => opts.modal || null,
        },
        AppState: { cards: {}, nav: { data: sadrzaj, page: 'study', section: 'flashcards' } },
        getCategories: (c) => Object.keys(c),
        shuffleArray: () => {},
        progress: { flashcardsLearned: [] },
        saveProgress: () => { brojac.saveProgress++; },
        trackFlashcardReview: () => { brojac.track++; },
        t: (k) => k,
        matchMedia: (q) => ({ matches: !!opts.bezPokreta && /reduced-motion/.test(q) }),
        requestAnimationFrame: (fn) => { rafs.push(fn); return rafs.length; },
        setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
        clearTimeout: (id) => { if (timers[id - 1]) timers[id - 1].fn = null; },
        innerWidth: 393,
    };
    ctx.window = ctx;
    ctx.SokratBlocks = {
        applyAccent: (el, v) => {
            const acc = (v || []).find(Boolean);
            brojac.accent.push([el.id, acc || null]);
            if (acc) { el.setAttribute('data-ink', 'dark'); el.style.setProperty('--item-acc', acc); }
            else { el.removeAttribute('data-ink'); el.style.removeProperty('--item-acc'); }
        },
    };
    vm.createContext(ctx);
    vm.runInContext(FC, ctx, { filename: 'flashcards.js' });
    const fc = els.flashcard;
    const kadar = () => { rafs.splice(0).forEach((fn) => fn()); };
    const odbroji = () => { timers.splice(0).forEach((x) => x.fn && x.fn()); };
    const zivihTimera = () => timers.filter((x) => x.fn).length;
    const stanje = () => ({
        index: ctx.AppState.cards.index,
        known: ctx.AppState.cards.known.slice(),
        unknown: ctx.AppState.cards.unknown.slice(),
        klase: fc.klaseNiz(),
        // samo ono što gesta piše — `--item-acc` (boja kartice, M3b) je tuđe i legitimno stoji
        stil: Object.fromEntries(Object.entries(fc.stil).filter(([k]) => k.indexOf('--swipe-') === 0)),
        flipped: fc.klase.has('flipped'),
    });
    /** Prst: down → `koraci` pomaka do (dx, dy) → up | cancel | ništa. */
    const prst = (o) => {
        const id = o.id || 7;
        const tip = o.tip || 'touch';
        const ev = (x, y) => ({ pointerId: id, pointerType: tip, clientX: 100 + x, clientY: 200 + y, isPrimary: true });
        fc.posalji('pointerdown', ev(0, 0));
        const n = o.koraci || 4;
        for (let i = 1; i <= n; i++) fc.posalji('pointermove', ev(o.dx * i / n, (o.dy || 0) * i / n));
        if (o.kraj === 'cancel') fc.posalji('pointercancel', ev(o.dx, o.dy || 0));
        else if (o.kraj !== 'none') fc.posalji('pointerup', ev(o.dx, o.dy || 0));
    };
    const klik = () => fc.posalji('click', {});
    /** Tipka na `document` (meta = element pod fokusom; zadano `body` bez `closest`-pogotka). */
    const tipka = (key, extra) => {
        const ev = Object.assign({ key, target: { closest: () => null }, preventDefault: () => { brojac.preventDefault++; } }, extra || {});
        (docSlusaci.keydown || []).forEach((fn) => fn(ev));
    };
    return { ctx, els, fc, brojac, kadar, odbroji, zivihTimera, stanje, prst, klik, tipka, docSlusaci };
}

console.log('\n=== kartice kao Tinder-špil (F1/9): gesta · jedan put upisa · CSS/markup ===\n');

// ── ① GESTA U PJEŠČANIKU ──────────────────────────────────────────────────────
{
    const s = svijet();
    s.ctx.initFlashcards();
    const tipovi = Object.keys(s.fc.slusaci).sort();
    tvrdi(isto(tipovi, ['click', 'pointercancel', 'pointerdown', 'pointermove', 'pointerup']),
        'initFlashcards veže click + četiri pointer-slušača na #flashcard', tipovi);
    tvrdi(isto(s.stanje(), { index: 0, known: [], unknown: [], klase: [], stil: {}, flipped: false }), 'početno: kartica 0, bez klasa i varijabli');
    tvrdi(!s.els.flashcardGhost1.hidden && !s.els.flashcardGhost2.hidden, 'špil: dvije sjene vidljive kad slijede dvije kartice');
    const g1 = s.brojac.accent.find((a) => a[0] === 'flashcardGhost1');
    const g2 = s.brojac.accent.find((a) => a[0] === 'flashcardGhost2');
    tvrdi(g1 && g1[1] === '#112233' && g2 && g2[1] === '#445566',
        'sjene nose boju SVOJE kartice (q2 → boja sekcije A, q3 → vlastita boja)', [g1, g2]);

    // miš: ništa
    s.prst({ tip: 'mouse', dx: 200 });
    tvrdi(isto(s.stanje(), { index: 0, known: [], unknown: [], klase: [], stil: {}, flipped: false }) && s.fc.attrs.capture === undefined,
        'miš: povlačenje NE pokreće gestu (stolno = kao danas)', s.stanje());

    // dodir usred povlačenja: klasa, capture, tri varijable
    s.prst({ dx: 50, koraci: 1, kraj: 'none' });
    const usred = s.stanje();
    // Bez eksplicitnog `setPointerCapture`: dodir ima implicitni capture na cilju pointerdown-a; izmjereno
    // (CDP-sonda 2026-09-06) da let i upis rade bez njega.
    tvrdi(isto(usred.klase, ['is-dragging']) && s.fc.attrs.capture === undefined, 'dodir: prvi vodoravni pomak > SLOP → `is-dragging`, BEZ setPointerCapture', usred);
    tvrdi(usred.stil['--swipe-x'] === '50px' && usred.stil['--swipe-p'] === '0.500' && /deg$/.test(usred.stil['--swipe-rot']),
        'JS piše tri brojke: `--swipe-x` 50px · `--swipe-p` 0.500 (prag 100 = širina/3) · `--swipe-rot` u deg', usred.stil);
    // ...i puštanje iznad praga: let, upis TEK po slijetanju (put nosi ZADNJI pomak, ne koordinata `pointerup`-a)
    s.fc.posalji('pointermove', { pointerId: 7, pointerType: 'touch', clientX: 300, clientY: 200 });
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: 300, clientY: 200 });
    const let1 = s.stanje();
    tvrdi(isto(let1.klase, ['is-flying']) && parseFloat(let1.stil['--swipe-x']) > 393 && let1.known.length === 0 && let1.index === 0,
        'desno iznad praga: `is-flying`, kartica leti izvan ekrana, upis JOŠ nije (čeka slijetanje)', let1);
    tvrdi(s.zivihTimera() === 1, 'let ima rezervno odbrojavanje (1 živ timer)');
    s.fc.posalji('transitionend');
    const sleti = s.stanje();
    tvrdi(isto(sleti.klase, ['is-entering']) && isto(sleti.stil, {}) && isto(sleti.known, [0]) && sleti.index === 1,
        '`transitionend` → slijetanje: known [0], kartica 1, varijable obrisane, `is-entering` na jedan kadar', sleti);
    tvrdi(s.brojac.saveProgress === 1 && s.brojac.track === 1, 'upis je prošao kroz markKnown (saveProgress 1 · trackFlashcardReview 1)', s.brojac);
    tvrdi(s.zivihTimera() === 0, 'rezervno odbrojavanje je ugašeno kad je `transitionend` stigao prvi');
    s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().klase, []), 'dva kadra poslije: bez klasa (prijelazi opet rade)');
    tvrdi(s.klik() === 1 && !s.stanje().flipped, 'rep-klik geste NE okreće karticu');
    s.klik();
    tvrdi(s.stanje().flipped, '…a idući klik okreće (zastavica se troši jednom)');
    s.klik();

    // lijevo
    s.prst({ dx: -200 });
    s.fc.posalji('transitionend');
    s.kadar(); s.kadar();
    const lijevo = s.stanje();
    tvrdi(isto(lijevo.unknown, [1]) && lijevo.index === 2 && isto(lijevo.known, [0]) && s.brojac.saveProgress === 1,
        'lijevo iznad praga → markUnknown: unknown [1], kartica 2 (bez saveProgress — kao gumb „Ne znam")', lijevo);

    // kratko: povratak bez upisa
    s.prst({ dx: 40, koraci: 2, kraj: 'none' });
    tvrdi(isto(s.stanje().klase, ['is-dragging']), 'kratko povlačenje: usred = `is-dragging`');
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: 140, clientY: 200 });
    const kratko = s.stanje();
    tvrdi(isto(kratko.klase, []) && isto(kratko.stil, {}) && kratko.index === 2 && isto(kratko.known, [0]) && isto(kratko.unknown, [1]),
        'ispod praga → povratak: bez klasa, bez varijabli, bez upisa', kratko);
    s.klik();
    tvrdi(!s.stanje().flipped, 'rep-klik kratkog povlačenja također ne okreće');
    s.klik();
    tvrdi(s.stanje().flipped, '…idući okreće');
    s.klik();

    // okomito: prepusti pregledniku
    s.prst({ dx: 8, dy: 60, koraci: 2, kraj: 'none' });
    tvrdi(isto(s.stanje().klase, []), 'pretežno okomit pomak: gesta se NE pokreće (skrol je preglednikov)');
    s.fc.posalji('pointermove', { pointerId: 7, pointerType: 'touch', clientX: 250, clientY: 260 });
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: 250, clientY: 260 });
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 2, '…ni kasniji vodoravni pomak iste geste je ne oživi');
    s.klik();
    tvrdi(s.stanje().flipped, 'klik poslije okomitog pomaka okreće (ništa nije progutano)');
    s.klik();

    // pointercancel usred povlačenja
    s.prst({ dx: 150, kraj: 'cancel' });
    const otkaz = s.stanje();
    tvrdi(isto(otkaz.klase, []) && isto(otkaz.stil, {}) && otkaz.index === 2 && isto(otkaz.known, [0]) && isto(otkaz.unknown, [1]),
        '`pointercancel` usred povlačenja: povratak bez upisa (preglednik je uzeo pokazivač)', otkaz);

    // rezervno odbrojavanje umjesto transitionend — i kasni transitionend ne upisuje drugi put
    s.prst({ dx: 200 });
    s.odbroji();
    const rez = s.stanje();
    tvrdi(isto(rez.known, [0, 2]) && rez.index === 3 && isto(rez.klase, ['is-entering']), 'bez `transitionend`: odbrojavanje slijeće i upisuje', rez);
    s.fc.posalji('transitionend');
    tvrdi(isto(s.stanje().known, [0, 2]) && s.stanje().index === 3 && s.brojac.saveProgress === 2, 'kasni `transitionend` NE upisuje drugi put', s.stanje());
    s.kadar(); s.kadar();

    // dodir bez pomaka okreće na `pointerup` (Chromium poslije brzog zamaha POTISNE click sljedećeg dodira —
    // izmjereno na goloj stranici); klik koji ipak stigne je rep i ne okreće drugi put
    s.prst({ dx: 0 });
    tvrdi(s.stanje().flipped, 'dodir bez pomaka: okreće se već na `pointerup` (ne čeka `click`)', s.stanje());
    s.klik();
    tvrdi(s.stanje().flipped, '…rep-klik istog dodira ne okreće natrag');
    s.klik();
    tvrdi(!s.stanje().flipped, '…a idući klik (miš) okreće — zastavica se troši jednom');
    s.prst({ dx: 0 });
    tvrdi(s.stanje().flipped, 'drugi dodir odmah poslije prvog (klik koji nikad nije stigao): novi `pointerdown` briše zastavicu, okreće');
    s.prst({ dx: 0 });

    // dodir tijekom leta se ignorira; novi špil usred leta poništava let
    s.prst({ dx: 200 });
    s.prst({ dx: -200, id: 9 });
    tvrdi(isto(s.stanje().klase, ['is-flying']) && s.stanje().index === 3, 'dodir TIJEKOM leta se ignorira', s.stanje());
    s.ctx.initFlashcards();
    const nov = s.stanje();
    tvrdi(isto(nov.klase, []) && isto(nov.stil, {}) && nov.index === 0 && isto(nov.known, []), 'initFlashcards usred leta: let poništen, špil čist', nov);
    s.fc.posalji('transitionend');
    s.odbroji();
    tvrdi(isto(s.stanje().known, []) && s.stanje().index === 0, 'zakašnjeli `transitionend`/timer starog leta NE upisuje u novi špil', s.stanje());
    tvrdi(s.els.flashcardGhost1.hidden === false, 'sjene opet vidljive za novi špil');

    // zadnja kartica: sjene se skrivaju
    s.ctx.AppState.cards.index = 4;
    s.ctx.updateFlashcard();
    tvrdi(s.els.flashcardGhost1.hidden && s.els.flashcardGhost2.hidden, 'zadnja kartica: obje sjene skrivene');
    s.ctx.AppState.cards.index = 3;
    s.ctx.updateFlashcard();
    tvrdi(!s.els.flashcardGhost1.hidden && s.els.flashcardGhost2.hidden, 'pretposljednja: jedna sjena');
}

// prefers-reduced-motion: bez leta, upis odmah
{
    const s = svijet({ bezPokreta: true });
    s.ctx.initFlashcards();
    s.prst({ dx: 200 });
    const st = s.stanje();
    tvrdi(isto(st.known, [0]) && st.index === 1 && isto(st.klase, ['is-entering']) && s.zivihTimera() === 0,
        'reduced-motion: nema `is-flying` ni timera — upis odmah, kartica zamijenjena', st);
    s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().klase, []), 'reduced-motion: klasa ulaska nestaje za dva kadra');
}

// ── ①b STRELICE = STOLNI PANDAN PALCU (F1/9 ②) ────────────────────────────────
{
    const s = svijet();
    s.ctx.initFlashcards();
    tvrdi((s.docSlusaci.keydown || []).length === 1, 'initFlashcards veže TOČNO jedan `keydown` na document');
    s.tipka('ArrowRight');
    tvrdi(isto(s.stanje().klase, ['is-flying']) && s.brojac.preventDefault === 1, '→ pokreće isti let kao palac (preventDefault: stranica se ne skrola)', s.stanje());
    s.fc.posalji('transitionend'); s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().known, [0]) && s.stanje().index === 1 && s.brojac.saveProgress === 1, '→ = znam kroz markKnown', s.stanje());
    s.tipka('ArrowLeft');
    s.fc.posalji('transitionend'); s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().unknown, [1]) && s.stanje().index === 2, '← = ne znam kroz markUnknown', s.stanje());
    s.tipka(' ');
    tvrdi(s.stanje().flipped, 'razmak okreće');
    s.tipka('Enter');
    tvrdi(!s.stanje().flipped, 'Enter okreće natrag');
    s.tipka('ArrowRight');
    s.tipka('ArrowRight');
    tvrdi(isto(s.stanje().klase, ['is-flying']) && s.stanje().index === 2, 'druga strelica TIJEKOM leta se ignorira (jedan upis po letu)', s.stanje());
    s.fc.posalji('transitionend'); s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().known, [0, 2]) && s.stanje().index === 3, '…let upisuje jednom', s.stanje());

    const prije = JSON.stringify(s.stanje());
    s.tipka('ArrowRight', { ctrlKey: true });
    s.tipka('ArrowRight', { metaKey: true });
    s.tipka('ArrowRight', { altKey: true });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'modifikator (Ctrl/⌘/Alt) → ništa (prečaci preglednika)');
    s.tipka('ArrowRight', { target: { closest: (sel) => (/input/.test(sel) ? {} : null) } });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'fokus u polju za unos → ništa');
    s.tipka('ArrowRight', { target: { closest: (sel) => (/button/.test(sel) ? {} : null) } });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'fokus na gumbu → ništa (gumb ima svoje tipke)');
    s.ctx.AppState.nav.section = 'quiz';
    s.tipka('ArrowRight');
    tvrdi(JSON.stringify(s.stanje()) === prije, 'drugi mod (kviz) → ništa');
    s.ctx.AppState.nav.section = 'flashcards';
    s.ctx.AppState.nav.page = 'landing';
    s.tipka('ArrowRight');
    tvrdi(JSON.stringify(s.stanje()) === prije, 'druga stranica → ništa');
    s.ctx.AppState.nav.page = 'study';
    s.tipka('x');
    tvrdi(JSON.stringify(s.stanje()) === prije && s.brojac.preventDefault === 5, 'druga tipka → ništa, i bez preventDefault', s.brojac.preventDefault);
}
{
    const s = svijet({ modal: {} });
    s.ctx.initFlashcards();
    s.tipka('ArrowRight');
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 0, 'otvoren modal (upit vrati element) → strelice ne diraju kartice');
    // Zatvoren `<sokrat-modal>` ostaje u DOM-u s `aria-hidden="true"` i `visibility:hidden` — geometrija ga
    // ne razlikuje od otvorenog (i dalje ima pravokutnik), atribut da. Zato upit MORA isključiti aria-hidden.
    tvrdi(/querySelector\('\[aria-modal="true"\]:not\(\[aria-hidden="true"\]\)'\)/.test(FC),
        'upit za modal isključuje `aria-hidden="true"` (zatvoren modal ostaje u DOM-u, F1/9 ② prvi put pao baš na tome)');
    tvrdi(/classList\.contains\('modal-open'\)/.test(FC), '…i pita `body.modal-open` (isti biljeg koji `sokrat-modal.open()` postavlja)');
}
{
    const s = svijet();
    s.ctx.document.body = { classList: { contains: (k) => k === 'modal-open' } };
    s.ctx.initFlashcards();
    s.tipka('ArrowRight');
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 0, '`body.modal-open` bez elementa → strelice ne diraju kartice');
}

// ── ② IZVOR: JEDAN PUT UPISA ──────────────────────────────────────────────────
{
    const bez = FC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const n = (re) => (bez.match(re) || []).length;
    tvrdi(n(/cards\.known\.push\(/g) === 1, '`cards.known.push` postoji TOČNO jednom (markKnown)', n(/cards\.known\.push\(/g));
    tvrdi(n(/cards\.unknown\.push\(/g) === 1, '`cards.unknown.push` postoji TOČNO jednom (markUnknown)', n(/cards\.unknown\.push\(/g));
    tvrdi(n(/(?<!function )saveFlashcardProgress\(\)/g) === 1, '`saveFlashcardProgress()` se zove s jednog mjesta (markKnown)', n(/(?<!function )saveFlashcardProgress\(\)/g));
    tvrdi(/smjer > 0 \? markKnown : markUnknown/.test(bez), 'gesta bira `markKnown`/`markUnknown` po referenci — ne kopira upis');
    tvrdi(!/style\.transform\s*=/.test(bez), 'JS ne piše `transform` — samo CSS-varijable (crtanje je u CSS-u)');
    tvrdi(!/setPointerCapture/.test(bez), 'nema `setPointerCapture` (implicitni capture dodira je dovoljan — izmjereno)');
}

// ── ③ CSS + MARKUP ────────────────────────────────────────────────────────────
{
    const css = citaj('css', 'flashcards-section.css').replace(/\/\*[\s\S]*?\*\//g, '');
    const bundle = citaj('styles.bundle.css').replace(/\/\*[\s\S]*?\*\//g, '');
    const html = citaj('index.html');
    const i18n = citaj('js', 'i18n.js');
    // `touch-action` se čita od dodirnutog elementa do PRVOG skrolera — lice i naličje su skroleri
    // (`overflow-y: auto`), pa pravilo samo na `.flashcard` nikad ne dođe na red (sonda, 2026-09-06).
    tvrdi(/\.flashcard,\s*\.flashcard-front,\s*\.flashcard-back\s*\{\s*touch-action:\s*pan-y\s*;?\s*\}/.test(css),
        'flashcards-section.css: `touch-action: pan-y` na `.flashcard` I na skrolerima `.flashcard-front`/`.flashcard-back`');
    tvrdi(/touch-action:\s*pan-y\s*[;}]/.test(bundle), 'bundle nosi `touch-action: pan-y` (build:css je pokrenut)');
    tvrdi(/\.flashcard-ghost\s*\{\s*display:\s*none;?\s*\}/.test(css), 'sjene su `display: none` izvan dodira');
    // F1/12 ⓪: špil je odluka o SUČELJU → pita platformu (`data-uredjaj`, boot.js), ne medij `(pointer: coarse)`.
    const DODIR = ':root[data-uredjaj~="dodir"]';
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    tvrdi(new RegExp(esc(DODIR) + ' \\.flashcard-ghost\\s*\\{[^}]*display:\\s*block').test(css), 'sjene se crtaju pod `' + DODIR + ' .flashcard-ghost` (platforma zna uređaj, F1/12 ⓪)');
    tvrdi(new RegExp(esc(DODIR) + ' \\.flashcard-ghost\\[hidden\\]\\s*\\{\\s*display:\\s*none').test(css), 'sjene bez sljedeće kartice: `[hidden]` vraća `display: none` (UA pravilo bi bilo pregaženo)');
    tvrdi(!/@media\s*\(pointer:\s*coarse\)/.test(css), 'flashcards-section.css: F1/9 blok više NE pita `@media (pointer: coarse)` — odluka o sučelju, ne sposobnost motora');
    tvrdi(/\.swipe-stamp\s*\{[^}]*visibility:\s*hidden/.test(css), 'pečati: `visibility: hidden` u mirovanju (ne ulaze u mjere kontrasta)');
    tvrdi(/is-dragging \.swipe-stamp,\s*\.flashcard\.is-flying \.swipe-stamp\s*\{\s*visibility:\s*visible/.test(css), 'pečati vidljivi samo pod `is-dragging`/`is-flying`');
    tvrdi(/\.swipe-stamp--know\s*\{[^}]*var\(--color-ok\)[^}]*var\(--color-on-ok\)/.test(css) && /\.swipe-stamp--dont\s*\{[^}]*var\(--color-danger\)[^}]*var\(--color-on-danger\)/.test(css),
        'pečati = puna ispuna + tinta po temi (ADR-032): ok/on-ok · danger/on-danger');
    tvrdi(/prefers-reduced-motion/.test(bez_(css)) === false, 'CSS ne nosi vlastiti reduced-motion blok (politika je jedna, u policies.css; JS gasi let)');
    for (const g of ['flashcardGhost1', 'flashcardGhost2']) {
        const tag = html.match(new RegExp('<div[^>]*id="' + g + '"[^>]*>')) || [''];
        tvrdi(/aria-hidden="true"/.test(tag[0]) && /\bhidden\b/.test(tag[0]) && /flashcard-ghost--[12]/.test(tag[0]), 'index.html: #' + g + ' = sjena, aria-hidden + hidden', tag[0]);
    }
    tvrdi(html.indexOf('id="flashcardGhost2"') < html.indexOf('id="flashcardGhost1"') && html.indexOf('id="flashcardGhost1"') < html.indexOf('id="flashcard"'),
        'sjene stoje PRIJE kartice u DOM-u (ispod nje po z-osi)');
    const znam = html.match(/<span[^>]*swipe-stamp--know[^>]*>/) || [''];
    const neznam = html.match(/<span[^>]*swipe-stamp--dont[^>]*>/) || [''];
    tvrdi(/data-i18n="fc\.know"/.test(znam[0]) && /aria-hidden="true"/.test(znam[0]), 'pečat „znam" ide kroz i18n ključ `fc.know` i aria-hidden', znam[0]);
    tvrdi(/data-i18n="fc\.dontKnow"/.test(neznam[0]) && /aria-hidden="true"/.test(neznam[0]), 'pečat „ne znam" ide kroz `fc.dontKnow` i aria-hidden', neznam[0]);
    tvrdi(/'fc\.know':/.test(i18n) && /'fc\.dontKnow':/.test(i18n), 'oba ključa postoje u js/i18n.js');
    const unutar = html.slice(html.indexOf('id="flashcard"'), html.indexOf('class="flashcard-inner"'));
    tvrdi(unutar.indexOf('swipe-stamp--know') >= 0 && unutar.indexOf('swipe-stamp--dont') >= 0, 'pečati su unutar #flashcard, a IZVAN .flashcard-inner (ne okreću se s karticom)');
}
function bez_(css) { return css; }

console.log('\n' + (pao ? '❌ ' + pao + ' od ' + ukupno + ' palo' : '✅ svih ' + ukupno + ' prošlo') + '\n');
process.exit(pao ? 1 : 0);
