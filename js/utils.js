// ===== SOKRAT STUDY — UTILITIES =====

// ── TINTA NA PUNOJ ISPUNI (MREŽA C2; doseljeno ovamo pri učitavanju po ruti) ──
//
// Koja tinta ide NA plohu u boji iz podatka — računato, ne pogođeno. Do 2026-08-15 je glif
// pločice nosio `--color-on-brand` (token izračunat za boju MARKE) koji na 11 boja predmeta
// nitko nikad nije izmjerio: bijela na `#f59e0b` daje **2.15**. Vraća 'dark' | 'light' → CSS
// bira token; NE vraća boju (proizvoljna boja u `style` = `check:palette` gubi pregled), pa
// ni `data-ink` nije dinamički sastavljen (ADR-028).
//
// ⚠️ ZAŠTO U `utils.js`, a ne više u `js/blocks-renderer.js`: tintu traže TRI različita
// svijeta — vitrina i pretraživanje na LANDINGU (`navigation.js`), study-kartice, i editorov
// pretpregled. Otkad se renderer učitava tek s lekcijom (paket `study`), landing bi zbog
// jedne čiste funkcije morao vući cijeli renderer prije prvog kadra. `utils.js` je jedina
// datoteka koju učitavaju i `index.html` i `editor.html`, pa je jedino mjesto gdje ova
// definicija smije stajati SAMA. `SokratBlocks.inkForTint` ostaje kao prečac (isti kod).
//
// SJECIŠTE dviju tinti: luminancija na kojoj su `--color-on-tint-dark` i `-light` jednako
// čitljivi. IZVEDENO iz same definicije WCAG kontrasta, nije pogođeno:
//     (L*+0.05)² = (L_dark+0.05)(L_light+0.05)  →  L* = √((L_d+0.05)(L_l+0.05)) − 0.05
// Za današnje tokene (#000000 / #ffffff) daje 0.1791.
// ⚠️ Prva verzija je imala 0.1833 — napisano napamet, i krivo. Zato ovaj broj od 2026-08-15
// NE stoji sam: `npm run check:contrast` ga preračuna iz `css/tokens.css` i padne ako se
// raziđu. Promijeniš li tokene, gate ti kaže novu vrijednost.
// ⚠️ 2026-09-01: tamna tinta je s #14161a otišla na ČISTU CRNU — par (#14161a, bijela) je na
// svom sjecištu davao 4.26, ISPOD AA, i violet-500 (#8b5cf6, L=0.198) je tu rupu stvarno
// pogodio (axe na fill kartici: 4.27). S crnom je najgori slučaj 4.58.
const TINT_INK_CROSSOVER = 0.1791;

/** @param {string} boja hex iz podatka @returns {'dark'|'light'} */
function inkForTint(boja) {
    const m = String(boja || '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m) return 'light';                       // nepoznat oblik → stari izgled, bez iznenađenja
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const kanal = [0, 2, 4].map((i) => {
        const v = parseInt(h.slice(i, i + 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
    return L > TINT_INK_CROSSOVER ? 'dark' : 'light';
}

// ── IKONA (Font Awesome) — BUG-025; definicija je OVDJE iz istog razloga kao tinta gore ──
// Ikona ne ide u TEKST nego u `class`, gdje escape nije dovoljan: i escapan navodnik preglednik
// pročita kao razdjelnik imena klasa, pa bi autor mogao pridružiti bilo koju klasu. Zato se
// ikona ne escapa nego PROVJERAVA oblikom, a sve izvan oblika pada na siguran default.
// Izmjereno: svih 137 ikona u katalogu već odgovara ovom obliku → za katalog je promjena no-op.
// ⚠️ Zašto ne u `blocks-renderer.js` (gdje je bila do učitavanja po ruti): pravilo BUG-025 traži
// da KROZ NJU prođe svatko tko piše ikonu u `innerHTML` — a to uključuje i `profile.js`, koji
// renderer ne učitava. Ondje je stajala grana `? SokratBlocks.safeIcon(icon) : 'fa-book'`, pa bi
// odlazak renderera u paket tiho pretvorio sve ikone predmeta u knjigu. Provjera koja postoji
// samo kad je slučajno prisutna nije provjera. `SokratBlocks.safeIcon` ostaje kao prečac.
function safeIcon(icon, fallback) {
    const fb = fallback || 'fa-book';
    const s = String(icon == null ? '' : icon).trim();
    return /^fa-[a-z0-9-]+$/.test(s) ? s : fb;
}

// Obje su i bez ovoga globalne (deklaracija funkcije u klasičnoj skripti), ali `blocks-renderer.js`
// ih doseže IZ SVOG IIFE-a preko `window.` — pa je ovo ŠAV, ne ukras: piše se izričito da se
// vidi na čemu prečaci u rendereru stoje (i da ga testovi u pješčaniku mogu složiti isto).
window.inkForTint = inkForTint;
window.safeIcon = safeIcon;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let toastTimeout = null;

// F2 2D.1: prikaz toasta vodi Web Component <sokrat-toast> (js/components/sokrat-toast.js).
// showToast() je sada TANKI delegat — svih ~13 pozivatelja ostaje nepromijenjeno.
// FALLBACK ispod čuva staro ponašanje ako custom element nije upgrade-an (stari preglednik /
// skripta nije stigla) → 0 regresije. Logika fallbacka = doslovno prijašnji showToast().
// F3 3A.3: opcionalni `opts` ({duration, onClick}) prolazi u komponentu; fallback-put ga ignorira
// (bez custom elementa nema akcije — toast tada samo pokaže poruku, ništa se ne ruši).
function showToast(message, opts) {
    const toast = document.getElementById('toast');

    // Sretan put: element je upgrade-an u <sokrat-toast> → delegiraj (komponenta posjeduje logiku).
    if (toast && typeof (/** @type {any} */ (toast).show) === 'function') {
        (/** @type {any} */ (toast)).show(message, opts);
        return;
    }

    // Fallback (nije Web Component): klasičan DOM put — identičan izvornom ponašanju.
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toast.classList.remove('show');
    void toast.offsetWidth; // force reflow
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toastTimeout = null;
    }, 2500);
}
