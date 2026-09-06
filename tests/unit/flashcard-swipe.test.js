/* eslint-disable no-console */
// ===== PALAC LISTA, GUMBI SUDE (F1/13) — gesta u pješčaniku · TABLICA akcija · JEDAN put upisa · CSS/markup =====
// Pokreni: node tests/unit/flashcard-swipe.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: Leon (2026-09-06, s previewom F1/9 u ruci): „Ako se povuče lijevo vraća se na
// prijašnju, desno ide na sljedeću. Kada se okrene daje odgovor. Know i don't know stoje dolje kao
// što Tinder ima lajk i ✕." Gesta time prestaje biti SUD i postaje LISTANJE, a sud seli na gumbe —
// mehanika F1/9 (pointer-put samo za dodir, `pointerup`-okretanje, `gen`, rezervni timer) ostaje ista.
//
// Najskuplji mogući kvar je i dalje tihi DRUGI put upisa (kartica upisana dvaput, upisana bez
// `saveProgress`, ili upisana u špil koji je u međuvremenu zamijenjen) — ekran to ne pokazuje, brojka
// izgleda točno. Od F1/13 mu se pridružuje drugi, jednako tih: **gesta koja i dalje sudi**. Zato:
//
//   ① gesta u pješčaniku (`vm`): miš ne pokreće ništa · desno = SLJEDEĆA bez ijednog upisa · lijevo =
//      PRETHODNA · prva kartica + lijevo = ODSKOK · kratko povlačenje se vraća · dodir bez pomaka
//      okreće na `pointerup` · okomit pomak je preglednikov · `pointercancel` ne upisuje · rep-klik ne
//      okreće · novi špil usred leta poništava let · `prefers-reduced-motion` = bez leta;
//   ② SUD: ✓ / ✕ (gumb ili tipka Z / X) lete NAPRIJED s pečatom i tek po slijetanju zovu
//      `markKnown` / `markUnknown` — pečat se vidi SAMO u tom letu, nikad pod prstom;
//   ③ TABLICA `AKCIJE` = jedini izvor (ADR-027): svaki `gumb` postoji u markupu i obrnuto, svaki
//      `i18n` ključ postoji u rječniku, nijedna tipka se ne ponavlja i nijedna nije s modifikatorom;
//   ④ izvor: `cards.known.push` / `cards.unknown.push` postoje TOČNO jednom, a sud ih zove po referenci;
//   ⑤ CSS i markup: `touch-action: pan-y` na kartici I na skrolerima (F1/9 nalaz ①), sjene špila samo
//      pod `:root[data-uredjaj~="dodir"]` i s pomakom UDESNO (F1/13), pečat vezan uz `is-sud`.
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
        id, hidden: false, disabled: false, offsetWidth: 300, textContent: '',
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
        focus: () => { attrs.fokus = (attrs.fokus || 0) + 1; },
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
    /** Slijetanje do kraja: `transitionend` + dva kadra (klasa ulaska živi jedan kadar). */
    const sleti = () => { fc.posalji('transitionend'); kadar(); kadar(); };
    return { ctx, els, fc, brojac, kadar, odbroji, zivihTimera, stanje, prst, klik, tipka, sleti, docSlusaci };
}

console.log('\n=== palac LISTA, gumbi SUDE (F1/13): gesta · tablica · jedan put upisa · CSS/markup ===\n');

// ── ① GESTA LISTA (ne sudi) ───────────────────────────────────────────────────
console.log('── ① GESTA: desno = sljedeća · lijevo = prethodna · dodir = okreni ────────');
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

    // dodir usred povlačenja: klasa i DVIJE brojke — `--swipe-p` više NIJE nagib nego SUD (F1/13)
    s.prst({ dx: 50, koraci: 1, kraj: 'none' });
    const usred = s.stanje();
    // Bez eksplicitnog `setPointerCapture`: dodir ima implicitni capture na cilju pointerdown-a; izmjereno
    // (CDP-sonda 2026-09-06) da let i upis rade bez njega.
    tvrdi(isto(usred.klase, ['is-dragging']) && s.fc.attrs.capture === undefined, 'dodir: prvi vodoravni pomak > SLOP → `is-dragging`, BEZ setPointerCapture', usred);
    tvrdi(usred.stil['--swipe-x'] === '50px' && /deg$/.test(usred.stil['--swipe-rot']) && usred.stil['--swipe-p'] === undefined,
        'JS pod prstom piše SAMO pomak i nagib — `--swipe-p` (sud) se NE piše, jer gesta ne sudi', usred.stil);

    // ...i puštanje iznad praga: let, LISTANJE tek po slijetanju
    s.fc.posalji('pointermove', { pointerId: 7, pointerType: 'touch', clientX: 300, clientY: 200 });
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: 300, clientY: 200 });
    const let1 = s.stanje();
    tvrdi(isto(let1.klase, ['is-flying']) && parseFloat(let1.stil['--swipe-x']) > 393 && let1.index === 0,
        'desno iznad praga: `is-flying`, kartica leti izvan ekrana, kartica se JOŠ nije promijenila', let1);
    tvrdi(let1.stil['--swipe-p'] === undefined, 'let listanja NEMA `--swipe-p` (bez suda nema pečata)', let1.stil);
    tvrdi(s.zivihTimera() === 1, 'let ima rezervno odbrojavanje (1 živ timer)');
    s.fc.posalji('transitionend');
    const sleti1 = s.stanje();
    tvrdi(isto(sleti1.klase, ['is-entering']) && isto(sleti1.stil, {}) && sleti1.index === 1,
        '`transitionend` → slijetanje: SLJEDEĆA kartica (index 1), varijable obrisane, `is-entering` na jedan kadar', sleti1);
    tvrdi(isto(sleti1.known, []) && isto(sleti1.unknown, []) && s.brojac.saveProgress === 0 && s.brojac.track === 0,
        '⚠️ DESNO NE UPISUJE NIŠTA: known/unknown prazni, `saveProgress` 0, `trackFlashcardReview` 0 (listanje ≠ sud)', s.brojac);
    tvrdi(s.zivihTimera() === 0, 'rezervno odbrojavanje je ugašeno kad je `transitionend` stigao prvi');
    s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().klase, []), 'dva kadra poslije: bez klasa (prijelazi opet rade)');
    tvrdi(s.klik() === 1 && !s.stanje().flipped, 'rep-klik geste NE okreće karticu');
    s.klik();
    tvrdi(s.stanje().flipped, '…a idući klik okreće (zastavica se troši jednom)');
    s.klik();

    // lijevo = PRETHODNA, i ulazi S LIJEVA
    s.prst({ dx: -200, kraj: 'none' });
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: -100, clientY: 200 });
    tvrdi(isto(s.stanje().klase, ['is-flying']) && parseFloat(s.stanje().stil['--swipe-x']) < -393,
        'lijevo iznad praga: let na LIJEVU stranu', s.stanje());
    s.fc.posalji('transitionend');
    const natrag = s.stanje();
    tvrdi(natrag.index === 0 && isto(natrag.klase, ['is-entering', 'is-slijeva']),
        'lijevo → PRETHODNA kartica (index 0) i ulazak S LIJEVA (`is-slijeva`)', natrag);
    tvrdi(isto(natrag.known, []) && isto(natrag.unknown, []) && s.brojac.saveProgress === 0,
        'ni lijevo ne upisuje ništa', s.brojac);
    s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().klase, []), '`is-slijeva` se skida istim kadrom kao `is-entering`');

    // PRVA KARTICA + LIJEVO = ODSKOK (prije prve nema ničega)
    s.prst({ dx: -200 });
    const odskok = s.stanje();
    tvrdi(isto(odskok.klase, []) && isto(odskok.stil, {}) && odskok.index === 0,
        'prva kartica + lijevo = ODSKOK: bez leta, bez klasa, index ostaje 0', odskok);
    tvrdi(s.zivihTimera() === 0, 'odskok ne pokreće nikakav timer (nije let)');

    // kratko: povratak bez ičega
    s.prst({ dx: 40, koraci: 2, kraj: 'none' });
    tvrdi(isto(s.stanje().klase, ['is-dragging']), 'kratko povlačenje: usred = `is-dragging`');
    s.fc.posalji('pointerup', { pointerId: 7, pointerType: 'touch', clientX: 140, clientY: 200 });
    const kratko = s.stanje();
    tvrdi(isto(kratko.klase, []) && isto(kratko.stil, {}) && kratko.index === 0,
        'ispod praga → povratak: bez klasa, bez varijabli, ista kartica', kratko);
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
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 0, '…ni kasniji vodoravni pomak iste geste je ne oživi');
    s.klik();
    tvrdi(s.stanje().flipped, 'klik poslije okomitog pomaka okreće (ništa nije progutano)');
    s.klik();

    // pointercancel usred povlačenja
    s.prst({ dx: 150, kraj: 'cancel' });
    const otkaz = s.stanje();
    tvrdi(isto(otkaz.klase, []) && isto(otkaz.stil, {}) && otkaz.index === 0,
        '`pointercancel` usred povlačenja: povratak bez listanja (preglednik je uzeo pokazivač)', otkaz);

    // rezervno odbrojavanje umjesto transitionend — i kasni transitionend ne lista drugi put
    s.prst({ dx: 200 });
    s.odbroji();
    const rez = s.stanje();
    tvrdi(rez.index === 1 && isto(rez.klase, ['is-entering']), 'bez `transitionend`: odbrojavanje slijeće i lista', rez);
    s.fc.posalji('transitionend');
    tvrdi(s.stanje().index === 1, 'kasni `transitionend` NE lista drugi put', s.stanje());
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
    tvrdi(isto(s.stanje().klase, ['is-flying']) && s.stanje().index === 1, 'dodir TIJEKOM leta se ignorira', s.stanje());
    s.ctx.initFlashcards();
    const nov = s.stanje();
    tvrdi(isto(nov.klase, []) && isto(nov.stil, {}) && nov.index === 0 && isto(nov.known, []), 'initFlashcards usred leta: let poništen, špil čist', nov);
    s.fc.posalji('transitionend');
    s.odbroji();
    tvrdi(s.stanje().index === 0, 'zakašnjeli `transitionend`/timer starog leta NE lista u novom špilu', s.stanje());
    tvrdi(s.els.flashcardGhost1.hidden === false, 'sjene opet vidljive za novi špil');

    // zadnja kartica: sjene se skrivaju
    s.ctx.AppState.cards.index = 4;
    s.ctx.updateFlashcard();
    tvrdi(s.els.flashcardGhost1.hidden && s.els.flashcardGhost2.hidden, 'zadnja kartica: obje sjene skrivene');
    s.ctx.AppState.cards.index = 3;
    s.ctx.updateFlashcard();
    tvrdi(!s.els.flashcardGhost1.hidden && s.els.flashcardGhost2.hidden, 'pretposljednja: jedna sjena');
}

// prefers-reduced-motion: bez leta, listanje odmah
{
    const s = svijet({ bezPokreta: true });
    s.ctx.initFlashcards();
    s.prst({ dx: 200 });
    const st = s.stanje();
    tvrdi(st.index === 1 && isto(st.klase, ['is-entering']) && s.zivihTimera() === 0,
        'reduced-motion: nema `is-flying` ni timera — sljedeća kartica odmah', st);
    s.kadar(); s.kadar();
    tvrdi(isto(s.stanje().klase, []), 'reduced-motion: klasa ulaska nestaje za dva kadra');
    s.els.btnCorrect.posalji('click', {});
    const sud = s.stanje();
    tvrdi(isto(sud.known, [1]) && sud.index === 2 && s.brojac.saveProgress === 1,
        'reduced-motion: ✓ upisuje odmah, bez leta i bez pečata', sud);
}

// ── ② SUD: GUMBI ✓ / ✕ (i tipke Z / X) ────────────────────────────────────────
console.log('\n── ② SUD: ✓ / ✕ lete NAPRIJED s pečatom, upisuju po slijetanju ───────────');
{
    const s = svijet();
    s.ctx.initFlashcards();
    s.els.btnCorrect.posalji('click', {});
    const letZnam = s.stanje();
    tvrdi(isto(letZnam.klase, ['is-flying', 'is-sud']) && letZnam.stil['--swipe-p'] === '1'
        && parseFloat(letZnam.stil['--swipe-x']) > 0,
        '✓ = let NAPRIJED (`--swipe-x` > 0) s klasom `is-sud` i sudom `--swipe-p` = 1', letZnam);
    tvrdi(isto(letZnam.known, []) && s.brojac.saveProgress === 0, '…upis JOŠ nije (čeka slijetanje)', letZnam);
    s.sleti();
    const znam = s.stanje();
    tvrdi(isto(znam.known, [0]) && znam.index === 1 && isto(znam.klase, []) && isto(znam.stil, {}),
        '…slijetanje: known [0], sljedeća kartica, klase i varijable očišćene (i `is-sud`)', znam);
    tvrdi(s.brojac.saveProgress === 1 && s.brojac.track === 1, 'upis je prošao kroz markKnown (saveProgress 1 · trackFlashcardReview 1)', s.brojac);
    tvrdi(s.els.knownCount.textContent === 1 && s.els.unknownCount.textContent === 0,
        'značke na gumbima pokazuju 1 / 0 (`updateFlashcardStats` je jedini pisac)', [s.els.knownCount.textContent, s.els.unknownCount.textContent]);

    s.els.btnWrong.posalji('click', {});
    const letNe = s.stanje();
    tvrdi(isto(letNe.klase, ['is-flying', 'is-sud']) && letNe.stil['--swipe-p'] === '-1'
        && parseFloat(letNe.stil['--swipe-x']) > 0,
        '✕ leti ISTO NAPRIJED (i ono ide na sljedeću), a sud je −1 → drugi pečat', letNe);
    s.sleti();
    const neznam = s.stanje();
    tvrdi(isto(neznam.unknown, [1]) && neznam.index === 2 && isto(neznam.known, [0]) && s.brojac.saveProgress === 1,
        '✕ → markUnknown: unknown [1], sljedeća kartica, BEZ saveProgress (kao i dosad)', neznam);

    // drugi klik tijekom leta se ignorira — jedan upis po letu
    s.els.btnCorrect.posalji('click', {});
    s.els.btnWrong.posalji('click', {});
    tvrdi(isto(s.stanje().klase, ['is-flying', 'is-sud']) && s.stanje().stil['--swipe-p'] === '1',
        'drugi sud TIJEKOM leta se ignorira (straža `swipe.leti` = jedan upis po letu)', s.stanje());
    s.sleti();
    tvrdi(isto(s.stanje().known, [0, 2]) && isto(s.stanje().unknown, [1]) && s.stanje().index === 3, '…let upisuje jednom', s.stanje());

    // ✓ na kartici koja je već „ne znam" — swap logika ostaje netaknuta
    s.ctx.AppState.cards.index = 1;
    s.els.btnCorrect.posalji('click', {});
    s.sleti();
    tvrdi(isto(s.stanje().known, [0, 2, 1]) && isto(s.stanje().unknown, []),
        '✓ nad karticom iz „ne znam" ju PREMJEŠTA (swap), ne duplicira', s.stanje());

    // ← / → (gumbi) listaju ODMAH, bez leta: kroz špil se ide brzo
    const prije = s.stanje().index;
    s.els.btnNext.posalji('click', {});
    tvrdi(s.stanje().index === prije + 1 && isto(s.stanje().klase, []),
        'gumb → lista ODMAH (bez leta): sljedeća kartica u istom pozivu', s.stanje());
    s.els.btnPrev.posalji('click', {});
    s.els.btnPrev.posalji('click', {});
    tvrdi(s.stanje().index === prije - 1 && isto(s.stanje().klase, []),
        'gumb ← lista odmah i dva puta zaredom (let bi drugi klik pojeo)', s.stanje());
}

// ── ③ TIPKE IZ TABLICE (stolno = sve tipkama) ─────────────────────────────────
console.log('\n── ③ TIPKE: ← → · razmak/Enter · X · Z ───────────────────────────────────');
{
    const s = svijet();
    s.ctx.initFlashcards();
    tvrdi((s.docSlusaci.keydown || []).length === 1, 'initFlashcards veže TOČNO jedan `keydown` na document');
    s.tipka('ArrowRight');
    tvrdi(s.stanje().index === 1 && isto(s.stanje().klase, []) && s.brojac.preventDefault === 1,
        '→ = sljedeća, odmah (preventDefault: stranica se ne skrola)', s.stanje());
    s.tipka('ArrowLeft');
    tvrdi(s.stanje().index === 0 && isto(s.stanje().known, []) && s.brojac.saveProgress === 0,
        '← = prethodna, i ništa se ne upisuje', s.stanje());
    s.tipka('ArrowLeft');
    tvrdi(s.stanje().index === 0, '← na prvoj kartici ne radi ništa (nema ispred čega)');
    s.tipka(' ');
    tvrdi(s.stanje().flipped, 'razmak okreće');
    s.tipka('Enter');
    tvrdi(!s.stanje().flipped, 'Enter okreće natrag');

    s.tipka('z');
    tvrdi(isto(s.stanje().klase, ['is-flying', 'is-sud']) && s.stanje().stil['--swipe-p'] === '1', 'Z = ZNAM: isti let s pečatom kao gumb ✓', s.stanje());
    s.sleti();
    tvrdi(isto(s.stanje().known, [0]) && s.stanje().index === 1 && s.brojac.saveProgress === 1, '…Z upisuje kroz markKnown', s.stanje());
    s.tipka('X');
    tvrdi(s.stanje().stil['--swipe-p'] === '-1', 'X = NE ZNAM, i veliko slovo radi isto (Shift ne mijenja radnju)', s.stanje());
    s.sleti();
    tvrdi(isto(s.stanje().unknown, [1]) && s.stanje().index === 2, '…X upisuje kroz markUnknown', s.stanje());

    const prije = JSON.stringify(s.stanje());
    s.tipka('ArrowRight', { ctrlKey: true });
    s.tipka('z', { metaKey: true });
    s.tipka('x', { altKey: true });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'modifikator (Ctrl/⌘/Alt) → ništa (prečaci preglednika)');
    s.tipka('ArrowRight', { target: { closest: (sel) => (/input/.test(sel) ? {} : null) } });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'fokus u polju za unos → ništa');
    s.tipka('z', { target: { closest: (sel) => (/button/.test(sel) ? {} : null) } });
    tvrdi(JSON.stringify(s.stanje()) === prije, 'fokus na gumbu → ništa (gumb ima svoje tipke)');
    s.ctx.AppState.nav.section = 'quiz';
    s.tipka('ArrowRight');
    tvrdi(JSON.stringify(s.stanje()) === prije, 'drugi mod (kviz) → ništa');
    s.ctx.AppState.nav.section = 'flashcards';
    s.ctx.AppState.nav.page = 'landing';
    s.tipka('ArrowRight');
    tvrdi(JSON.stringify(s.stanje()) === prije, 'druga stranica → ništa');
    s.ctx.AppState.nav.page = 'study';
    const pdPrije = s.brojac.preventDefault;
    s.tipka('q');
    tvrdi(JSON.stringify(s.stanje()) === prije && s.brojac.preventDefault === pdPrije, 'tipka izvan tablice → ništa, i bez preventDefault', s.brojac.preventDefault);
}
{
    const s = svijet({ modal: {} });
    s.ctx.initFlashcards();
    s.tipka('ArrowRight');
    s.tipka('z');
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 0, 'otvoren modal (upit vrati element) → tipke ne diraju kartice');
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
    tvrdi(isto(s.stanje().klase, []) && s.stanje().index === 0, '`body.modal-open` bez elementa → tipke ne diraju kartice');
}

// ── ④ TABLICA AKCIJA = JEDINI IZVOR (ADR-027) ────────────────────────────────
console.log('\n── ④ TABLICA AKCIJA: gumb · gesta · tipke · i18n ─────────────────────────');
{
    const s = svijet();
    s.ctx.initFlashcards();
    const A = s.ctx.window.SokratFlashcards && s.ctx.window.SokratFlashcards.AKCIJE;
    const html = citaj('index.html');
    const i18n = citaj('js', 'i18n.js');
    tvrdi(!!A && Object.isFrozen(A), 'tablica je izložena read-only na `window.SokratFlashcards.AKCIJE` (F1/14 čita odavde)');
    const id = A ? Object.keys(A).sort() : [];
    console.log('  · doseg: ' + id.length + ' radnji — ' + id.join(' · '));
    tvrdi(isto(id, ['neznam', 'okreni', 'prethodna', 'sljedeca', 'znam']),
        'pet radnji: prethodna · sljedeca · okreni · znam · neznam', id);

    const gumbi = id.map((k) => A[k].gumb).filter(Boolean).sort();
    tvrdi(isto(gumbi, ['btnCorrect', 'btnNext', 'btnPrev', 'btnWrong']), 'četiri radnje imaju gumb (okretanje ga nema — kartica JE gumb)', gumbi);
    const nemaUMarkupu = gumbi.filter((g) => html.indexOf('id="' + g + '"') < 0);
    tvrdi(nemaUMarkupu.length === 0, 'svaki `gumb` iz tablice POSTOJI u markupu', nemaUMarkupu);
    // …i obrnuto: nijedan gumb reda kontrola nije ostao izvan tablice (inače bi imao tihi drugi put)
    const RED = /<div class="flashcard-controls">([\s\S]*?)<\/div>\s*<\/div>/.exec(html);
    const uMarkupu = RED ? (RED[1].match(/id="(btn[A-Za-z]+)"/g) || []).map((x) => x.slice(4, -1)).sort() : [];
    tvrdi(isto(uMarkupu, gumbi), 'i obrnuto: svaki gumb iz reda kontrola stoji u tablici', [uMarkupu, gumbi]);

    const bezKljuca = id.filter((k) => i18n.indexOf("'" + A[k].i18n + "':") < 0);
    tvrdi(bezKljuca.length === 0, 'svaki `i18n` ključ iz tablice postoji u js/i18n.js', bezKljuca.map((k) => A[k].i18n));

    const sveTipke = id.reduce((n, k) => n.concat(A[k].tipke.slice()), []);
    tvrdi(sveTipke.length === new Set(sveTipke).size, 'nijedna tipka se ne ponavlja u dvije radnje', sveTipke);
    const sModifikatorom = sveTipke.filter((t) => /\+|Control|Meta|Alt|Shift/.test(t));
    tvrdi(sModifikatorom.length === 0, 'nijedna tipka nije s modifikatorom (⌘/Ctrl/Alt su prečaci preglednika)', sModifikatorom);
    tvrdi(sveTipke.filter((t) => t.length === 1).every((t) => t === t.toLowerCase()),
        'jednoslovne tipke su zapisane MALIM slovom (normalizacija je u kodu, ne u tablici)', sveTipke);
    const geste = id.map((k) => A[k].gesta).filter(Boolean).sort();
    tvrdi(isto(geste, ['desno', 'dodir', 'lijevo']), 'tri geste: desno = sljedeća · lijevo = prethodna · dodir = okreni (sud NEMA gestu)', geste);
    tvrdi(A && A.znam.gesta === null && A.neznam.gesta === null,
        '⚠️ ni „znam" ni „ne znam" nemaju gestu — od F1/13 se sudi ISKLJUČIVO gumbom ili tipkom');
    tvrdi(id.every((k) => typeof A[k].radnja === 'function' && Object.isFrozen(A[k])), 'svaki redak je zamrznut i nosi izvršnu `radnja`');
}

// ── ⑤ IZVOR: JEDAN PUT UPISA ──────────────────────────────────────────────────
console.log('\n── ⑤ IZVOR: jedan put upisa, jedan put do novog špila ────────────────────');
{
    const bez = FC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const n = (re) => (bez.match(re) || []).length;
    tvrdi(n(/cards\.known\.push\(/g) === 1, '`cards.known.push` postoji TOČNO jednom (markKnown)', n(/cards\.known\.push\(/g));
    tvrdi(n(/cards\.unknown\.push\(/g) === 1, '`cards.unknown.push` postoji TOČNO jednom (markUnknown)', n(/cards\.unknown\.push\(/g));
    tvrdi(n(/(?<!function )saveFlashcardProgress\(\)/g) === 1, '`saveFlashcardProgress()` se zove s jednog mjesta (markKnown)', n(/(?<!function )saveFlashcardProgress\(\)/g));
    tvrdi(/sud > 0 \? markKnown : markUnknown/.test(bez), 'sud bira `markKnown`/`markUnknown` po referenci — ne kopira upis');
    tvrdi(!/style\.transform\s*=/.test(bez), 'JS ne piše `transform` — samo CSS-varijable (crtanje je u CSS-u)');
    tvrdi(!/setPointerCapture/.test(bez), 'nema `setPointerCapture` (implicitni capture dodira je dovoljan — izmjereno)');
    tvrdi(n(/cards\.deck = /g) === 1 && /function postaviSpil\(/.test(bez),
        'špil se postavlja s JEDNOG mjesta (`postaviSpil`) — ulazak u mod i izbornik kraja idu istim putem', n(/cards\.deck = /g));
    tvrdi(/function resetSwipe\(\)[\s\S]*?swipe\.gen\+\+/.test(bez), '`resetSwipe` diže naraštaj (`gen`) — zakašnjeli let ne upisuje u novi špil');
    tvrdi(/'is-dragging', 'is-flying', 'is-entering', 'is-sud', 'is-slijeva'/.test(bez),
        '`resetSwipe` briše SVIH pet klasa geste (nove `is-sud`/`is-slijeva` uključene)');
}

// ── ⑥ CSS + MARKUP ────────────────────────────────────────────────────────────
console.log('\n── ⑥ CSS + MARKUP: pan-y · špil desno · pečat samo u sudu ────────────────');
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

    // F1/13: špil viri UDESNO, i to `transform-origin`-om — inače „koliko viri" ovisi o širini kartice
    tvrdi(new RegExp(esc(DODIR) + ' \\.flashcard-ghost\\s*\\{\\s*transform-origin:\\s*right center').test(css),
        'sjene imaju `transform-origin: right center` — skaliranje ne miče desni rub, pa je peek točan broj px');
    const g1 = /\.flashcard-ghost--1 \{ transform: translateX\((\d+)px\) scale\(([\d.]+)\)/.exec(css);
    const g2 = /\.flashcard-ghost--2 \{ transform: translateX\((\d+)px\) scale\(([\d.]+)\)/.exec(css);
    tvrdi(!!g1 && !!g2 && Number(g1[1]) > 0 && Number(g2[1]) > Number(g1[1]),
        'sjene vire UDESNO, i druga dalje od prve (F1/13: odozdo se na visokoj kartici više ne vide)', [g1 && g1[1], g2 && g2[1]]);
    tvrdi(!!g2 && Number(g2[1]) <= 12,
        'najdalja sjena viri najviše 12 px = bočni razmak sadržaja u kadru → nikad ne dođe do sigurnog ruba (phone-gate ⑦)', g2 && g2[1]);
    tvrdi(!/translateY\(8px\) scale\(0\.96\)/.test(css), 'stari pomak sjena PREMA DOLJE je maknut (na kartici od 578 px ne viri ništa)');

    // pečat: samo u letu koji nosi sud
    tvrdi(/\.swipe-stamp\s*\{[^}]*visibility:\s*hidden/.test(css), 'pečati: `visibility: hidden` u mirovanju (ne ulaze u mjere kontrasta)');
    tvrdi(/\.flashcard\.is-sud \.swipe-stamp\s*\{\s*visibility:\s*visible/.test(css), 'pečat je vidljiv SAMO pod `is-sud` (let s gumba ✓ / ✕)');
    tvrdi(!/is-dragging \.swipe-stamp/.test(css), '⚠️ pečata VIŠE NEMA pod prstom (`is-dragging`) — gesta lista, ne sudi');
    tvrdi(!/\.flashcard\.is-flying \.swipe-stamp\s*\{/.test(css), '…ni u svakom letu (`is-flying`) — let listanja je bez pečata');
    tvrdi(/\.swipe-stamp--know\s*\{[^}]*var\(--color-ok\)[^}]*var\(--color-on-ok\)/.test(css) && /\.swipe-stamp--dont\s*\{[^}]*var\(--color-danger\)[^}]*var\(--color-on-danger\)/.test(css),
        'pečati = puna ispuna + tinta po temi (ADR-032): ok/on-ok · danger/on-danger');
    tvrdi(/\.flashcard\.is-entering \{ transform-origin: right center/.test(css)
        && /\.flashcard\.is-entering\.is-slijeva \{ transform-origin: left center/.test(css),
        'ulazak ima smjer: naprijed iz špila (desno), natrag s lijeva (`is-slijeva`)');

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

console.log('\n' + (pao ? '❌ ' + pao + ' od ' + ukupno + ' palo' : '✅ svih ' + ukupno + ' prošlo') + '\n');
process.exit(pao ? 1 : 0);
