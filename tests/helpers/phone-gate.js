// T0 · MJERAČ TELEFONA — zajednička mjera za odjavljenu i prijavljenu branu.
//
// ── ZAŠTO POSTOJI ────────────────────────────────────────────────────────────────
// Produkcija je na 393 px bila neupotrebljiva, a **svih desetak gateova zeleno**. To
// nije bio previd nego posljedica konstrukcije: axe mjeri na 1280 px, `css:diff`
// uspoređuje nas sa samima sobom (hvata PROMJENU, ne LOŠOĆU — ravnomjerno loše stanje
// mu je savršeno stabilno), a K3/K4a mjere KROMO, ne stranicu. **Telefon kao STRANICA
// nikad nije bio mjerena površina.** Zato faza „TELEFON" počinje mjeračem, ne popravkom.
//
// ── METODA: OTOK SE DA IZMJERITI, IAKO SE `env()` NE DA SIMULIRATI ───────────────
// Chromium ne zna glumiti `env(safe-area-inset-top)`. Ali `--safe-top` je **naša
// varijabla iznad njega** (`css/variables.css`), pa se smije postaviti izravno:
//
//     document.documentElement.style.setProperty('--safe-top', '59px')
//
// **Što se nakon toga ne pomakne, na pravom telefonu stoji ispod otoka.** Inline stil
// na `<html>` tuče `:root` iz stilskog lista, pa je zamjena potpuna. Ovo je jedina
// poznata metoda da se BUG-031 uopće izmjeri.
//
// ── PET TVRDNJI (spec §9.3) ──────────────────────────────────────────────────────
//   ① OTOK        ništa interaktivno u gornjih 59 px
//   ② KROMO       naše trake ≤ 20 % UPOTREBLJIVE visine
//   ③ SUKOB       tekst se ne lomi preko 2 retka dok mu susjed u istom spremniku krati
//   ④ PRVI EKRAN  bar jedna sadržajna kontrola DOHVATLJIVA bez skrola
//   ⑤ ZAGLAVLJE   naslov razine je čitljiv (≤ 1 redak i nije odrezan ispod 60 %)
//
// ── ⚠️ ŠTO OVAJ MJERAČ NE MJERI (piše se da T1 ne pretpostavi pokrivenost) ───────
// Simulira se **samo `--safe-top` i samo portret**. `--safe-bottom` / `--safe-left` /
// `--safe-right` i landscape (gdje izrez ide USTRANU) ostaju nemjereni. To je namjerno
// — T0 postoji da izmjeri kvar koji je Leon vidio — ali je i **poznata rupa, ne previd**.
// Projekt je isti razred greške već platio: *gate koji provjerava NEKE tokene stvara
// tihu pretpostavku da su provjereni SVI* (`check:contrast`, tvrda zabrana #2). Cigla
// T1 („sigurna zona kao pravilo, obje orijentacije") mora proširiti OVU datoteku, a ne
// se osloniti na to da je zelena brana već nešto rekla o donjem rubu.
//
// ⚠️ **Vidljivost se RAČUNA, ne pretpostavlja.** Prva verzija ove mjere prijavila je dva
// nepostojeća kvara i oba su bila pouka: bočna traka `.subjects-sidebar` je
// `position:fixed` preko cijele visine, ali `translateX(100%)` je drži IZVAN ekrana —
// brojala se kao kromo od 100 %; a zatvoren `<sokrat-modal>` je `visibility:hidden`, pa
// je `offsetParent`-provjera (koja fiksne elemente propušta) njegov gumb za zatvaranje
// prijavila kao interaktivan sadržaj u otoku. Oba su kvara postojala samo u mjeri.
// **Gate koji prijavljuje šum se isključi, i tad ne čuva ništa** (ista pouka kao
// `check:tailwind` §šum).
'use strict';

/** Dynamic Island na iPhoneu 14 Pro i novijima. Leonov uređaj je iPhone 16. */
const OTOK = 59;

/** 320 = donja granica iz kriterija prihvaćanja (spec §2) · 393 = Leonov iPhone 16
 *  · 430 = Pro Max. Visine su stvarne logičke visine tih uređaja: kromo se mjeri kao
 *  UDIO ekrana, pa bi zajednička izmišljena visina mjerila krivi postotak. */
const EKRANI = [
    { w: 320, h: 568, ime: 'iPhone SE' },
    { w: 393, h: 852, ime: 'iPhone 16' },
    { w: 430, h: 932, ime: 'iPhone 16 Pro Max' }
];

/** Stranice koje vidi ODJAVLJEN posjetitelj + četiri načina učenja. */
const EKRANI_JAVNI = ['landing', 'browse', 'browse:dubina', 'lessons', 'about'];
const NACINI = ['learn', 'flashcards', 'quiz', 'fill'];

/** Prijavljene stranice — mjeri ih `phone.authed.spec.js`. `admin` je unutra jer kriterij
 *  faze glasi da korisnik *„ne naiđe ni na jedan ekran koji brana ne posjećuje"*, a
 *  admin-CRUD je ekran kao i svaki drugi (isti popis vozi i `reach-gate`). */
const EKRANI_PRIJAVLJENI = ['materials', 'profile', 'admin', 'editor'];

/** Aplikacija je spremna kad su i stanje i katalog na mjestu. */
const spreman = (page) => page.waitForFunction(
    () => window.AppState && window.SOKRAT_CATALOG && typeof window.navigateTo === 'function',
    null, { timeout: 60000 });

/**
 * Postavi otok. Zove se NAKON `goto` (inline stil bi inače nestao s navigacijom) i
 * prije svakog mjerenja — jer `navigateTo` ne dira `<html>`, ali `page.goto` da.
 */
const postaviOtok = (page, px = OTOK) =>
    page.evaluate((v) => document.documentElement.style.setProperty('--safe-top', v + 'px'), px);

/**
 * Otiđi na ekran. Predmet i lekcija se uzimaju IZ KATALOGA, nikad zakucani — inače
 * brana pada kad se sadržaj promijeni, a to nije kvar telefona.
 *
 * ⚠️ **SVE ČEKA STANJE, NE VRIJEME — i to je popravak, ne stil.** Prva verzija je nakon
 * svakog klika čekala fiksnih 300 ms. Mjera je pritom bila savršeno determinističa (tri
 * uzastopna prolaza dala su **bajt-identičnu** osnovicu), ali je brana **treperila**:
 * pod opterećenjem klik ne stigne prerenderati razinu, `browse:dubina` ostane na
 * **plićoj** razini, izmjeri se **drugi ekran** i njegov nalaz nije u osnovici → lažno
 * crveno. *Fiksno čekanje mjeri vrijeme; tvrdnja treba stanje* — isto što je `studio.authed`
 * već platio na drag-testu (K6b, TESTING.md).
 */
async function idiNa(page, ime) {
    if (ime === 'browse:dubina') {
        await page.evaluate(() => navigateTo('browse'));
        await page.waitForFunction(() => typeof browseState !== 'undefined' && !!browseState.level);
        // Spusti se do NAJDUBLJE razine kataloga — ondje su najduži nazivi. Hijerarhija je
        // `faculties → programs → years → subjects`; ⚠️ klik na razini `subjects` **izlazi
        // iz kataloga** na lekcijsku stranicu, pa je `subjects` uvjet zaustavljanja, a ne
        // brojač klikova. (Prva verzija je brojala klikove i time mjerila `lessons` misleći
        // da mjeri katalog.)
        for (let i = 0; i < 5; i++) {
            const prije = await page.evaluate(() => browseState.level);
            if (prije === 'subjects') break;
            const usao = await page.evaluate(() => {
                const k = document.querySelector('#browse-page .browse-card, #browse-page [data-faculty], #browse-page [data-program]');
                if (!k) return false;
                k.click();
                return true;
            });
            if (!usao) break;
            try {
                await page.waitForFunction((p) => browseState.level !== p, prije, { timeout: 5000 });
            } catch (e) { break; }
        }
    } else if (ime === 'lessons' || ime === 'study') {
        await page.evaluate((p) => {
            const s = Object.keys(subjectDataMap)[0];
            const x = SokratCatalog.getSubject(s);
            const l = (x && x.lessons && x.lessons[0]) ? x.lessons[0].id : null;
            if (p === 'lessons' || !l) navigateTo('lessons', { subject: s });
            else navigateTo('study', { subject: s, lesson: l });
        }, ime);
        await page.waitForFunction((p) => AppState.nav.page === p, ime);
        if (ime === 'study') {
            // Sadržaj dolazi lijeno (DB → JSON → .js) iza zastora `#studyLoading` preko
            // cijelog ekrana. Mjeriti prije nego stigne znači izmjeriti zastor.
            // ⚠️ Uvjet NE SMIJE koristiti `offsetParent`: `.study-loading` je
            // `position:fixed`, a fiksnom elementu je `offsetParent` **uvijek `null`** →
            // provjera bi prolazila odmah i brana bi zastor prijavila kao kromo od 100 %.
            // Zastor se gasi atributom (`el.hidden = !on`), pa se to i provjerava — uz
            // tvrdnju da je sadržaj STVARNO nacrtan.
            await page.waitForFunction(() => {
                const l = document.getElementById('studyLoading');
                if (l && !l.hasAttribute('hidden')) return false;
                const s = document.querySelector('#study-page .section.active');
                return !!s && s.getBoundingClientRect().height > 0;
            }, null, { timeout: 30000 });
        }
    } else {
        await page.evaluate((p) => navigateTo(p), ime);
        await page.waitForFunction((p) => AppState.nav.page === p, ime);
    }
    // ⚠️ Smirivanje vrijedi za SVAKI ekran, ne samo za one gdje je treperenje prvo viđeno.
    // Prva verzija je čekala smirivanje samo u načinima učenja — i `admin` je zatim jednom
    // prijavio „nijedna dohvatljiva kontrola", a drugi put ne, jer se puni asinkrono.
    // *Popravak koji nije generaliziran je popravak koji čeka drugu priliku* (BUG-027).
    await smiriPrikaz(page, 'section[id$="-page"].active');
    await postaviOtok(page);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/**
 * Čekaj da se PRIKAZ SMIRI: sadržaj elementa nepromijenjen kroz dvije uzastopne provjere.
 *
 * ⚠️ **Zašto baš ovo, a ne „čekaj da se pojavi kontrola".** Tvrdnja ④ mjeri postoji li
 * upotrebljiva kontrola bez skrola. Da je čekanje uvjetovano pojavom kontrole, ④ **ne bi
 * mogla pasti nikad** — brana bi čekala točno ono što tvrdi da mjeri. *Čekanje ne smije
 * pretpostaviti ishod mjerenja.* Zato se čeka nešto neovisno: da crtanje **prestane**.
 */
async function smiriPrikaz(page, selektor, maxMs = 6000) {
    let prije = null;
    const kraj = Date.now() + maxMs;
    while (Date.now() < kraj) {
        const sad = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (!el) return '';
            return el.innerHTML.length + '/' + el.querySelectorAll('*').length
                + '/' + Math.round(el.getBoundingClientRect().height);
        }, selektor);
        if (sad !== '' && sad === prije) return true;
        prije = sad;
        await page.waitForTimeout(180);
    }
    return false;
}

/** Prebaci način učenja na study-stranici (`learn`/`flashcards`/`quiz`/`fill`). */
async function otvoriNacin(page, nacin) {
    await page.evaluate((s) => {
        const b = document.querySelector('.study-nav-btn[data-section="' + s + '"]');
        if (b) b.click();
    }, nacin);
    // Tvrdnja o STANJU: baš ta sekcija je aktivna, nacrtana i više se ne mijenja.
    await page.waitForFunction((s) => {
        const el = document.getElementById(s);
        return !!el && el.classList.contains('active') && el.getBoundingClientRect().height > 0;
    }, nacin, { timeout: 15000 });
    await smiriPrikaz(page, '#' + nacin);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/**
 * Izmjeri STRANICU na trenutnom ekranu. Vraća sve brojke; tvrdnje su u spec-datoteci —
 * mjera i sud se namjerno ne miješaju (isti rez kao `reach-gate`).
 */
function mjeriStranicu(page, otok = OTOK) {
    return page.evaluate((OTOK) => {
        const vw = window.innerWidth, vh = window.innerHeight;

        const ime = (el) => {
            if (!el) return 'ništa';
            let s = el.tagName.toLowerCase();
            if (el.id) s += '#' + el.id;
            else if (typeof el.className === 'string' && el.className) s += '.' + el.className.trim().split(/\s+/)[0];
            return s;
        };

        /** Rect ∩ svaki predak koji reže ∩ ekran = ono što korisnik STVARNO vidi.
         *  ⚠️ Predak s `overflow-y:auto` reže i po X — druga os po specifikaciji
         *  postaje `auto`. Ista zamka je u C3 već jednom dala lažan nalaz. */
        function vidljivRect(el) {
            const r = el.getBoundingClientRect();
            const box = { l: r.left, t: r.top, r: r.right, b: r.bottom };
            let p = el.parentElement;
            while (p && p !== document.documentElement) {
                const cs = getComputedStyle(p);
                if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
                    const pr = p.getBoundingClientRect();
                    box.l = Math.max(box.l, pr.left); box.t = Math.max(box.t, pr.top);
                    box.r = Math.min(box.r, pr.right); box.b = Math.min(box.b, pr.bottom);
                }
                p = p.parentElement;
            }
            box.l = Math.max(box.l, 0); box.t = Math.max(box.t, 0);
            box.r = Math.min(box.r, vw); box.b = Math.min(box.b, vh);
            return box;
        }

        /** Vidi li korisnik ovo, i može li to dotaknuti? Računa se, ne pretpostavlja:
         *  `visibility` (nasljeđuje se — zatvoren modal je time pokriven), stvarna
         *  neprozirnost kroz pretke (`opacity:0` se NE nasljeđuje u computed style),
         *  `pointer-events`, i neprazan vidljiv pravokutnik unutar ekrana. */
        function stvarnoVidljiv(el) {
            const cs = getComputedStyle(el);
            if (cs.visibility !== 'visible' || cs.display === 'none') return false;
            if (cs.pointerEvents === 'none') return false;
            let p = el;
            while (p && p !== document.documentElement) {
                const s = getComputedStyle(p);
                if (parseFloat(s.opacity) < 0.05) return false;
                p = p.parentElement;
            }
            const b = vidljivRect(el);
            return (b.r - b.l) > 1 && (b.b - b.t) > 1;
        }

        /** Broj redaka teksta = broj različitih linija u kojima leže njegovi pravokutnici.
         *  `getClientRects()` nad rasponom sadržaja daje po jedan rect po liniji; grupira
         *  se s tolerancijom od 60 % visine retka jer superskripti i ikone imaju vlastite. */
        function brojRedaka(el) {
            const r = document.createRange();
            r.selectNodeContents(el);
            const rects = Array.prototype.slice.call(r.getClientRects())
                .filter((x) => x.width > 0.5 && x.height > 0.5);
            if (!rects.length) return 0;
            const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
            const tops = rects.map((x) => x.top).sort((a, b) => a - b);
            let n = 1;
            for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] > lh * 0.6) n++;
            return n;
        }

        const INTERAKTIVNO = 'a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
        const interaktivni = Array.prototype.slice.call(document.querySelectorAll(INTERAKTIVNO))
            .filter((el) => !el.disabled && !el.hasAttribute('hidden'))
            .filter(stvarnoVidljiv)
            .map((el) => ({ el: el, b: vidljivRect(el) }));

        const uKromu = (el) => {
            let p = el;
            while (p && p !== document.body) {
                if (p.classList && (p.classList.contains('topbar') || p.classList.contains('pathbar')
                    || p.id === 'cookieBanner' || p.classList.contains('subjects-sidebar'))) return true;
                p = p.parentElement;
            }
            return false;
        };

        // ── ① OTOK ────────────────────────────────────────────────────────────────
        // Kromo SMIJE crtati podlogu ispod otoka (za to `viewport-fit=cover` i postoji);
        // ne smije ondje staviti ništa što se tapka ili čita.
        const uOtoku = interaktivni
            .filter((k) => k.b.t < OTOK - 0.5)
            .map((k) => ime(k.el) + ' y=' + Math.round(k.b.t) + '…' + Math.round(k.b.b));

        // ── ② KROMO ───────────────────────────────────────────────────────────────
        // Trake usidrene pri VRHU: fiksne ili ljepljive, stvarno vidljive, i široke preko
        // 60 % ekrana NAKON presjeka s ekranom (bez toga se odgurnuta bočna traka broji).
        const trake = [];
        Array.prototype.slice.call(document.querySelectorAll('body *')).forEach((el) => {
            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
            if (!stvarnoVidljiv(el)) return;
            // ⚠️ Fiksno ≠ traka. Studijeva ljuska je `position:fixed; inset:var(--chrome-h) 0 0 0`
            // — dakle SADRŽAJ koji si sam radi spremnik za skrol, a ne kromo. Bez ovog
            // reza mjerač je editoru prijavljivao kromo od 100 % i „nijedna kontrola bez
            // skrola", što su oba bila kvara u mjeri, ne na ekranu. **Traka nikad ne
            // sadrži stranicu** — to je razlika koja se dade provjeriti, za razliku od
            // praga po visini (koji bi baš najgori slučaj sakrio kao „prevelik za traku").
            if (el.matches('section[id$="-page"]') || el.querySelector('section[id$="-page"]')) return;
            const b = vidljivRect(el);
            if ((b.r - b.l) < vw * 0.6) return;      // odgurnuto ustranu = nije traka
            if ((b.b - b.t) < 4) return;
            if (b.t > vh * 0.5) return;              // dno (cookie-banner) je T4, ne ovdje
            trake.push({ ime: ime(el), t: b.t, b: b.b });
        });
        trake.sort((a, b) => a.t - b.t);
        let kromoPx = 0, kraj = 0;
        trake.forEach((x) => {
            const t = Math.max(x.t, kraj);
            if (x.b > t) { kromoPx += x.b - t; kraj = Math.max(kraj, x.b); }
        });
        // Otok nije NAŠ trošak — uređaj ga uzima svakome. Budžet se zato mjeri nad
        // upotrebljivom visinom: koliko od onoga što IMAMO trošimo na trake.
        const nasKromo = Math.max(0, kromoPx - OTOK);
        const upotrebljivaVisina = vh - OTOK;
        const kromoPct = Math.round(nasKromo / upotrebljivaVisina * 100);

        const banner = document.getElementById('cookieBanner');
        const bannerPx = (banner && stvarnoVidljiv(banner)) ? Math.round(banner.getBoundingClientRect().height) : 0;

        // ── ③ KRATI JEDAN, LOMI SE DRUGI (mehanizam BUG-030) ──────────────────────
        // Kad u istom spremniku jedno dijete krati (`nowrap` + `ellipsis`) a drugo se
        // slobodno lomi, ono koje se lomi ODREĐUJE VISINU, a ono koje krati ne određuje
        // ništa — zbije se u „C…". Oba su pravila sama po sebi ispravna; kvar postoji
        // samo u kombinaciji.
        //
        // ⚠️ **Dvije stvari koje je mjerenje ispravilo, i obje mijenjaju mjeru:**
        // ① Sukob NE mora biti u flex-RETKU. Na produkciji `.browse-title` ima
        //    `display:block`, mrvica i naslov su ULOŽENI jedan pod drugim — a naslov je
        //    svejedno 34 px, jer je cijeli stupac 34 px. Prva verzija je tražila samo
        //    flex-redak i zato **nije okinula na stanju koje kvar dokazano ima**.
        // ② Opseg je KROMO I ZAGLAVLJE RAZINE, ne cijela stranica. Kartica sadržaja
        //    smije imati kratki naslov i troredni opis — to je dizajn, ne kvar. Bez tog
        //    reza bi brana prijavljivala šum, a gate koji prijavljuje šum se isključi.
        const spremnici = [];
        Array.prototype.slice.call(document.querySelectorAll('.topbar, .pathbar')).forEach((x) => spremnici.push(x));
        const aktivnaSekcija = document.querySelector('section[id$="-page"].active');
        if (aktivnaSekcija) {
            const h = aktivnaSekcija.querySelector(':scope > header');
            if (h) spremnici.push(h);
        }

        const krati = (c) => {
            const s = getComputedStyle(c);
            if (s.textOverflow === 'ellipsis' && s.whiteSpace.indexOf('nowrap') === 0) return true;
            return Array.prototype.slice.call(c.querySelectorAll('*')).some((d) => {
                const t = getComputedStyle(d);
                return t.textOverflow === 'ellipsis' && t.whiteSpace.indexOf('nowrap') === 0;
            });
        };

        const sudari = [];
        const vidjeniSpremnici = new Set();
        spremnici.forEach((korijen) => {
            const svi = [korijen].concat(Array.prototype.slice.call(korijen.querySelectorAll('*')));
            svi.forEach((box) => {
                if (vidjeniSpremnici.has(box) || !stvarnoVidljiv(box)) return;
                vidjeniSpremnici.add(box);
                const djeca = Array.prototype.slice.call(box.children)
                    .filter((c) => stvarnoVidljiv(c) && c.getBoundingClientRect().height > 0);
                if (djeca.length < 2) return;
                if (!djeca.some(krati)) return;
                djeca.forEach((c) => {
                    if (krati(c)) return;
                    const n = brojRedaka(c);
                    if (n > 2) {
                        sudari.push(ime(box) + ' › ' + ime(c) + ' = ' + n + ' redaka, a susjed krati'
                            + ' · „' + c.innerText.trim().slice(0, 40).replace(/\s+/g, ' ') + '"');
                    }
                });
            });
        });

        // ── ④ PRVI EKRAN ──────────────────────────────────────────────────────────
        // Sadržajna kontrola (ne kromo) koju korisnik može DOTAKNUTI bez skrola. Mjeri
        // se pogotkom (`elementFromPoint`), ne geometrijom: cookie-banner je fiksan i
        // `z-index: 2147483000`, pa gumb ispod njega ima savršen pravokutnik i nikakvu
        // upotrebljivost. Ista mjera kao K3 — postojanje se vidi selektorom,
        // dohvatljivost samo pogotkom.
        const upotrebljivi = interaktivni.filter((k) => {
            if (uKromu(k.el)) return false;
            const cx = k.b.l + (k.b.r - k.b.l) / 2;
            const cy = k.b.t + (k.b.b - k.b.t) / 2;
            if (cy < kromoPx - 1 || cy > vh) return false;
            const meta = document.elementFromPoint(cx, cy);
            return !!meta && (meta === k.el || k.el.contains(meta));
        });

        // ── ⑤ ZAGLAVLJE RAZINE ────────────────────────────────────────────────────
        // Samo zaglavlje AKTIVNE razine + mrvica u traci. Hero-naslov landinga NIJE tu:
        // on smije omotati (to je tipografija, cigla T5), a mrvica ne smije.
        const aktivna = document.querySelector('section[id$="-page"].active');
        const zaglavlja = [];
        const kandidati = [];
        if (aktivna) {
            const hdr = aktivna.querySelector(':scope > header');
            if (hdr) Array.prototype.push.apply(kandidati,
                Array.prototype.slice.call(hdr.querySelectorAll('h1, h2, .breadcrumb, .crumb')));
        }
        Array.prototype.push.apply(kandidati,
            Array.prototype.slice.call(document.querySelectorAll('.pathbar .crumb')));

        kandidati.forEach((el) => {
            if (!stvarnoVidljiv(el)) return;
            const tekst = el.innerText.trim().replace(/\s+/g, ' ');
            if (!tekst) return;
            const n = brojRedaka(el);
            // Odrezano ispod čitljivosti: element KRATI (pa nema prelijeva koji bi itko
            // vidio), ali pokazuje manje od 60 % vlastita teksta. Baš to je na produkciji
            // dalo naslov „C…" — 34 od 187 px.
            //
            // ⚠️ **60 % je ODABRAN prag, ne izveden — i to se piše da se ne bi činio
            // mjerenim.** Broj redaka (drugi krak ove tvrdnje) je objektivan: jedan redak
            // ili više. Kod kraćenja objektivne granice nema, pa je prag kalibriran na
            // raspon koji mora razdvojiti: svi poznati kvarovi leže na **15–52 %**
            // (produkcija 15 · 18 · 25 · 38 · 52, grana 30), a nijedno poznato ISPRAVNO
            // kraćenje nije izmjereno. Dakle prag razdvaja poznato loše od praznog skupa —
            // svaka vrijednost iznad 52 % daje isti ishod danas. Ako T2 ostavi legitimno
            // kraćenje ispod 60 %, prag se pomiče **uz zapis zašto**, ne prešutno.
            const udio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
            if (n > 1) zaglavlja.push(ime(el) + ': ' + n + ' redaka · „' + tekst.slice(0, 46) + '"');
            else if (udio < 0.6 && el.clientWidth > 0) {
                zaglavlja.push(ime(el) + ': odrezan na ' + el.clientWidth + ' od ' + el.scrollWidth
                    + ' px (' + Math.round(udio * 100) + ' %) · „' + tekst.slice(0, 46) + '"');
            }
        });

        return {
            stranica: (window.AppState && AppState.nav && AppState.nav.page) || '?',
            vw: vw, vh: vh,
            kromoPx: Math.round(kromoPx), nasKromo: Math.round(nasKromo), kromoPct: kromoPct,
            trake: trake.map((t) => t.ime + ' ' + Math.round(t.t) + '…' + Math.round(t.b)),
            bannerPx: bannerPx, bannerPct: Math.round(bannerPx / vh * 100),
            uOtoku: uOtoku,
            sudari: sudari,
            upotrebljivih: upotrebljivi.length,
            prviUpotrebljiv: upotrebljivi.length ? ime(upotrebljivi[0].el) : '—',
            zaglavlja: zaglavlja
        };
    }, otok);
}

/** Prag budžeta kroma (spec §9.3, cigla T3). Udio UPOTREBLJIVE visine, ne cijelog ekrana. */
const KROMO_BUDZET_PCT = 20;

// ── ČEGRTALJKA: zašto brana NE traži nulu odmah ──────────────────────────────────
// T0 nalazi kvarove koje plan izričito dodjeljuje ciglama **T1–T5**. Da brana traži
// nulu, `npm run test:responsive` bio bi crven kroz **pet** cigli — a tada „je li suita
// zelena?" prestaje biti upotrebljivo pitanje i **prava regresija u ostalih 400+ testova
// nestane u šumu**. Projekt taj razred problema već ima riješen i zapisan: `check:palette`
// *„ne traži nulu nego samo da broj nikad ne poraste"*.
//
// Zato osnovica (`tests/phone-baseline.json`) drži **poznate** kvarove, imenovane doslovno.
// Brana pada **samo na kvaru kojeg u osnovici nema** — dakle na NOVOM. Kad cigla nešto
// popravi, osnovica se spusti (`PHONE_BASELINE_UPDATE=1 npx playwright test tests/phone…`),
// i to je jedini način da broj padne. **Riješeni upisi se ispisuju glasno**, jer bi
// zastarjela osnovica tiho pokrivala kvar koji se vratio.
const fs = require('fs');
const path = require('path');
const OSNOVICA_PUT = path.join(__dirname, '..', 'phone-baseline.json');

function ucitajOsnovicu() {
    try { return JSON.parse(fs.readFileSync(OSNOVICA_PUT, 'utf8')); } catch (e) { return {}; }
}

/** Vrati `{ novi, rijeseni }` za jednu tvrdnju jedne suite. */
function usporediSOsnovicom(suita, kljuc, nadjeno) {
    const poznati = ((ucitajOsnovicu()[suita] || {})[kljuc]) || [];
    return {
        novi: nadjeno.filter((x) => poznati.indexOf(x) === -1),
        rijeseni: poznati.filter((x) => nadjeno.indexOf(x) === -1)
    };
}

/** Prepiši SVOJ dio osnovice (ostale suite ostaju netaknute). Samo uz izričit env-flag. */
function spremiOsnovicu(suita, nalazi) {
    if (!process.env.PHONE_BASELINE_UPDATE) return false;
    const o = ucitajOsnovicu();
    o._zasto = 'Poznati kvarovi telefona koje T1-T5 tek trebaju pojesti. Brana pada samo na NOVOM '
        + 'kvaru; spusti se s PHONE_BASELINE_UPDATE=1. Vidi tests/helpers/phone-gate.js i spec 9.7.';
    o[suita] = {};
    Object.keys(nalazi).sort().forEach((k) => { o[suita][k] = nalazi[k].slice().sort(); });
    fs.writeFileSync(OSNOVICA_PUT, JSON.stringify(o, null, 2) + '\n');
    return true;
}

module.exports = {
    OTOK, EKRANI, EKRANI_JAVNI, EKRANI_PRIJAVLJENI, NACINI, KROMO_BUDZET_PCT,
    spreman, postaviOtok, idiNa, otvoriNacin, mjeriStranicu,
    usporediSOsnovicom, spremiOsnovicu
};
