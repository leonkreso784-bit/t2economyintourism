// ===== SOKRAT STUDY — TEMA =====
//
// ⚠️ T6: IZREZANO IZ `js/init.js`, jer `init.js` nije „boot" nego BOOT APLIKACIJE —
// dvanaest inicijalizatora landinga, browsea i rutera. Stranica editora (`editor.html`)
// treba temu, a ne aplikaciju; kopija bi se razišla pri prvoj sljedećoj temi.
//
// ⚠️ POZIV JE OVDJE, NE U POZIVATELJU. Do T6 je `initTheme()` zvao `init.js` u svom
// `DOMContentLoaded`-u; da je tako ostalo, druga stranica bi ga morala zvati sama i
// tema bi ovisila o tome sjeti li se svaka nova stranica. Ovako je tema svojstvo
// UČITANE DATOTEKE. Redoslijed je nepromijenjen: ova skripta stoji prije `init.js`,
// pa njezin listener okine prvi — kao i dosad.

// ========== THEME ==========
// C2: zadana tema je „Akademsko plavo" (svijetla) — v. `css/tokens.css`.
//
// Prije je ovdje stajalo tvrdo `setAttribute('data-theme','dark')` uz `toggleTheme()`
// koji je pisao `light` — temu koja u CSS-u NIJE POSTOJALA. Prekidač je dakle vodio u
// prazno, a `dark` je bio jedini stvarni ishod. Sada su teme prave, pa i ovo mora biti.
//
// ⚠️ Vrijednost se PROVJERAVA prema popisu: nepoznat `data-theme` (npr. zaostali `dark`
// iz localStoragea nekog starog posjetitelja) ne bi pogodio nijedan token-blok, ali BI
// aktivirao 21 legacy pravilo koje selektira `[data-theme="dark"]` → bijeli tekst na
// svijetloj podlozi. Zato se nepoznata vrijednost odbacuje, a ne propušta.
const SOKRAT_THEMES = ['academic', 'paper', 'chalk', 'mint'];
const SOKRAT_THEME_DEFAULT = 'academic';

function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('sokrat-theme'); } catch (e) { /* privatni način */ }
    const theme = SOKRAT_THEMES.indexOf(saved) >= 0 ? saved : SOKRAT_THEME_DEFAULT;
    document.documentElement.setAttribute('data-theme', theme);
    // `color-scheme` javlja pregledniku kakve da crta scrollbarove i zadana polja;
    // bez toga svijetla tema dobiva tamne native kontrole i obrnuto.
    document.documentElement.style.colorScheme = (theme === 'chalk' || theme === 'mint') ? 'dark' : 'light';
    try { localStorage.setItem('sokrat-theme', theme); } catch (e) { /* privatni način */ }
}

function setTheme(name) {
    if (SOKRAT_THEMES.indexOf(name) < 0) return false;
    try { localStorage.setItem('sokrat-theme', name); } catch (e) { /* privatni način */ }
    initTheme();
    return true;
}
window.setTheme = setTheme;
window.SOKRAT_THEMES = SOKRAT_THEMES;

// Tema se primjenjuje čim je dokument spreman — v. bilješku o pozivu u zaglavlju.
document.addEventListener('DOMContentLoaded', initTheme);
