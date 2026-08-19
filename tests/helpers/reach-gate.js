// K3 · DOHVATLJIVOST — zajednička mjera za odjavljenu i prijavljenu branu.
//
// ── ZAŠTO POSTOJI, I ZAŠTO BAŠ OVAKO MJERI ───────────────────────────────────────
// Kriterij faze glasi da je iz svake stranice dohvatljiva bar jedna druga u jednom
// kliku. Napisan tako, mjeri **POSTOJANJE** izlaza — a oba kvara koja su fazu i
// pokrenula (BUG-026, BUG-027) izlaz su IMALA: vodio je na slomljenu stranicu i u
// petlju. Zato ovdje ništa ne provjerava `querySelector`.
//
// Tri cigle zaredom isporučile su isti razred kvara kroz TRI različita mehanizma:
//
//   K2b      `.st-chip` ODREZAN     `overflow:hidden` na fiksnoj ljusci   → nema skrola
//   BUG-028  izbornik PREKRIVEN     fiksni banner, `z-index: 2147483000`  → vidi se, ne klika
//   BUG-029  „Predmeti" PREKLOPLJENI `flex-shrink` do širine 0            → nema ni prelijeva
//
// Nijedan detektor prelijeva ne vidi nijedan od ta tri. Jedno mjerenje vidi sva tri:
// **pogodi li klik na sredinu kontrole baš tu kontrolu.** To je i jedino što korisnika
// zanima — ne je li gumb u DOM-u, nego dogodi li se ono što je htio.
//
// ⚠️ RAČUNA SE VIDLJIVI PRAVOKUTNIK, NE `getBoundingClientRect()`. Mrvica živi u
// `.crumbs` s `overflow-x:auto`: kad se odskrola, njezin se rect i dalje proteže ispod
// susjeda iako je korisnik ondje ne vidi. Bez presjeka s pretcima koji režu, brana bi
// prijavljivala sudare kojih nema — a to je gore od rupe, jer se gate tad isključuje.
'use strict';

/** Sve interaktivno u kromu. Separatori mrvice (`.crumb-sep`) su `<span>` — nisu ovdje. */
const SELEKTOR_KROMA = '.topbar button, .topbar a[href], .pathbar button, .pathbar a[href]';

/** Širine na kojima se mjeri. 320 je DONJA GRANICA IZ KRITERIJA PRIHVAĆANJA (spec §2),
 *  a do K3 je postojala u točno jednom testu — najuži Playwright profil je 375 px, pa
 *  je BUG-029 živio ispod svih brana. 360 je najčešća Android širina. */
const SIRINE = [320, 360, 393, 430];

/** Devet stranica; `lessons`/`study` traže predmet, pa ih `idiNa` zna iz KATALOGA. */
const STRANICE_JAVNE = ['landing', 'browse', 'lessons', 'study', 'about', 'materials'];
const STRANICE_PRIJAVLJENE = ['materials', 'profile', 'admin', 'editor'];

/** Aplikacija je spremna kad su i stanje i katalog na mjestu. */
const spreman = (page) =>
    page.waitForFunction(() => window.AppState && window.SOKRAT_CATALOG && typeof window.navigateTo === 'function');

/**
 * Otiđi na stranicu. Predmet i lekcija se uzimaju IZ KATALOGA, nikad zakucani — inače
 * suita pada kad se sadržaj promijeni, a to nije kvar navigacije.
 */
async function idiNa(page, ime) {
    await page.evaluate((p) => {
        if (p === 'lessons' || p === 'study') {
            const s = Object.keys(subjectDataMap)[0];
            const x = SokratCatalog.getSubject(s);
            const l = (x && x.lessons && x.lessons[0]) ? x.lessons[0].id : null;
            if (p === 'lessons' || !l) navigateTo('lessons', { subject: s });
            else navigateTo('study', { subject: s, lesson: l });
            return;
        }
        navigateTo(p);
    }, ime);
    await page.waitForTimeout(250);
}

/**
 * Izmjeri kromo na TRENUTNOJ stranici i širini.
 * Vraća `{ stranica, promasaji[], preklopi[], vidljivih, nevidljivi[] }`.
 */
function mjeriKromo(page, selektor = SELEKTOR_KROMA) {
    return page.evaluate((sel) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const ime = (el) => el.id
            || (typeof el.className === 'string' && el.className ? el.className.split(' ')[0] : '')
            || el.tagName.toLowerCase();

        /** Rect ∩ svaki predak koji reže ∩ ekran = ono što korisnik STVARNO vidi.
         *  ⚠️ Predak s `overflow-y:auto` reže i po X — druga os po specifikaciji
         *  postaje `auto`. Ista zamka je u K3 već jednom dala lažan nalaz u
         *  `layout.authed` (izuzeće čija premisa ne vrijedi). */
        function vidljivRect(el) {
            const r = el.getBoundingClientRect();
            const box = { l: r.left, t: r.top, r: r.right, b: r.bottom };
            let p = el.parentElement;
            while (p && p !== document.documentElement) {
                const cs = getComputedStyle(p);
                if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
                    const pr = p.getBoundingClientRect();
                    box.l = Math.max(box.l, pr.left);
                    box.t = Math.max(box.t, pr.top);
                    box.r = Math.min(box.r, pr.right);
                    box.b = Math.min(box.b, pr.bottom);
                }
                p = p.parentElement;
            }
            box.l = Math.max(box.l, 0);
            box.t = Math.max(box.t, 0);
            box.r = Math.min(box.r, vw);
            box.b = Math.min(box.b, vh);
            return box;
        }

        const kandidati = Array.prototype.slice.call(document.querySelectorAll(sel))
            .filter((el) => !el.disabled && !el.hasAttribute('hidden'))
            .filter((el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed');

        const vidljive = [];
        const nevidljivi = [];
        kandidati.forEach((el) => {
            const b = vidljivRect(el);
            if (b.r - b.l < 1 || b.b - b.t < 1) { nevidljivi.push(ime(el)); return; }
            vidljive.push({ el: el, b: b });
        });

        // ① POGODAK — klik na sredinu vidljivog dijela mora završiti na toj kontroli.
        const promasaji = [];
        vidljive.forEach((k) => {
            const cx = k.b.l + (k.b.r - k.b.l) / 2;
            const cy = k.b.t + (k.b.b - k.b.t) / 2;
            const meta = document.elementFromPoint(cx, cy);
            const dobar = !!meta && (meta === k.el || k.el.contains(meta));
            if (!dobar) {
                promasaji.push(ime(k.el) + ' [' + Math.round(k.b.l) + '…' + Math.round(k.b.r) + ']'
                    + ' → pogodio ' + (meta ? ime(meta) : 'ništa'));
            }
        });

        // ② NEPREKLAPANJE — provjera središta sama PODCJENJUJE kvar: na 344 px su se
        // „Predmeti" i prekidač jezika preklapali 5 px, a središte je svejedno pogodilo.
        // Rub gumba je i dalje bio tuđi. Zato se mjeri i sudar pravokutnika.
        const preklopi = [];
        for (let i = 0; i < vidljive.length; i++) {
            for (let j = i + 1; j < vidljive.length; j++) {
                const a = vidljive[i], c = vidljive[j];
                if (a.el.contains(c.el) || c.el.contains(a.el)) continue;   // ugniježđeno nije sudar
                const ox = Math.min(a.b.r, c.b.r) - Math.max(a.b.l, c.b.l);
                const oy = Math.min(a.b.b, c.b.b) - Math.max(a.b.t, c.b.t);
                if (ox > 0.5 && oy > 0.5) {
                    preklopi.push(ime(a.el) + ' × ' + ime(c.el) + ' (' + Math.round(ox) + '×' + Math.round(oy) + ' px)');
                }
            }
        }

        return {
            stranica: AppState.nav.page,
            vidljivih: vidljive.length,
            nevidljivi: nevidljivi,
            promasaji: promasaji,
            preklopi: preklopi
        };
    }, selektor);
}

/**
 * Uzastopni „natrag" s trenutne stranice. Vraća lanac oznaka (`browse:programs` i sl.).
 *
 * ⚠️ Zove se nakon HLADNOG dolaska na stranicu, pa je ovo tvrdnja o HIJERARHIJI, ne o
 * povijesti: korisnik koji je sam prošao landing → browse → landing legitimno vidi
 * ponavljanje, a penjanje gore ga ne smije imati.
 */
async function lanacNatrag(page, maxKoraka = 8) {
    const oznaka = () => page.evaluate(() => AppState.nav.page
        + (AppState.nav.page === 'browse' && typeof browseState !== 'undefined' && browseState.level
            ? ':' + browseState.level : ''));

    const lanac = [await oznaka()];
    for (let i = 0; i < maxKoraka; i++) {
        const kliknuo = await page.evaluate(() => {
            const b = document.getElementById('pathbarBack');
            if (!b || b.offsetParent === null) return false;
            b.click();
            return true;
        });
        if (!kliknuo) { lanac.push('(nema izlaza)'); break; }
        await page.waitForTimeout(280);
        const p = await oznaka();
        lanac.push(p);
        if (p === 'landing') break;
    }
    return lanac;
}

module.exports = {
    SELEKTOR_KROMA, SIRINE, STRANICE_JAVNE, STRANICE_PRIJAVLJENE,
    spreman, idiNa, mjeriKromo, lanacNatrag
};
