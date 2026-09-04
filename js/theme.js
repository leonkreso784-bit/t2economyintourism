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
// ⚠️⚠️ POPIS TEMA I PRIMJENA VIŠE NISU OVDJE — sele u `js/boot.js` (2026-09-04).
// Razlog nije urednost nego MJERA: ova je datoteka na DNU stranice i temu je primjenjivala
// tek na `DOMContentLoaded`, iza 42 skripte koje blokiraju parser. Za `chalk`/`mint` (tamne)
// to je značilo 119–232 ms svijetle stranice na svakom ulasku — Leonov nalaz, potvrđen
// `scripts/fouc-probe.js` i snimkom kadrova. Odluka prije prvog crtanja MORA u `boot.js`,
// jedinu sinkronu skriptu. Ovdje ostaje samo ono što se događa na KLIK.
// ⚠️ Nema rezervne kopije popisa: rezerva bi bila druga istina koja se tiho razilazi, a
// razlaz bi se opet vidio kao bljesak. `boot.js` je uvjet, i to provjerava
// `tests/unit/theme-boot-order.test.js` (u preflightu), ne komentar.
// ⚠️ NEMA `const SOKRAT_THEMES` — `boot.js` ga postavlja NA WINDOW, pa je golo ime
// (`SOKRAT_THEMES` u `init.js`) i dalje vidljivo. Leksička deklaracija istog imena ovdje
// bila bi samo sjena preko iste vrijednosti, uz rizik od sudara s globalnim svojstvom.
function initTheme() {
    // `boot.js` je isto ovo napravio prije prvog crtanja; ovdje se samo NORMALIZIRA ZAPIS.
    const theme = window.__sokratPrimijeniTemu();
    /* ⚠️ Normalizira se SAMO BRISANJEM — nikad upisom primijenjene teme. Do F1/3 se ovdje
       upisivalo `setItem('sokrat-theme', theme)`, i to je bio kvar koji nitko nije vidio jer
       nije imao posljedicu: svaki posjet je automatski ishod pretvarao u „izabrano". S
       praćenjem uređaja bi posljedica bila da „Automatski" traje točno jedno učitavanje.
       Zapis koji NIJE izbor (`dark`, `paper`, stari `academic` bez biljega) se makne, da
       birač pokaže „Automatski" i da se pravilo migracije ne izvodi na svakom ulasku. */
    try {
        if (localStorage.getItem('sokrat-theme') !== null && !window.__sokratIzborTeme()) {
            localStorage.removeItem('sokrat-theme');
            localStorage.removeItem('sokrat-theme-chosen');
        }
    } catch (e) { /* privatni način */ }
    return theme;
}

function setTheme(name) {
    try {
        if (name === 'auto') {
            localStorage.removeItem('sokrat-theme');
            localStorage.removeItem('sokrat-theme-chosen');
        } else {
            if (window.SOKRAT_THEMES.indexOf(name) < 0) return false;
            localStorage.setItem('sokrat-theme', name);
            localStorage.setItem('sokrat-theme-chosen', '1');   // biljeg izbora — v. boot.js
        }
    } catch (e) { /* privatni način: bez zapisa NEMA ni izbora — pada na uređaj (do F1/3 je padao na zadanu) */ }
    initTheme();
    return true;
}

/* Što birač pokazuje kao aktivno: IZBOR, ne primijenjenu temu. Uz „Automatski" te dvije
   stvari više nisu isto — na tamnom uređaju je primijenjeno `carbon`, a izabrano je ništa. */
function getThemeChoice() {
    return window.__sokratIzborTeme() || 'auto';
}
window.setTheme = setTheme;
window.getThemeChoice = getThemeChoice;

/* Uređaj se mijenja i dok je stranica otvorena (iOS/Android „automatski" pri zalasku).
   Mail to prati besplatno (media-upit u CSS-u); mi moramo izričito — i SAMO dok je izbor
   „Automatski", jer se korisnikov izbor ne gazi. */
try {
    const uredjaj = window.matchMedia('(prefers-color-scheme: dark)');
    const prati = () => { if (!window.__sokratIzborTeme()) initTheme(); };
    if (uredjaj.addEventListener) uredjaj.addEventListener('change', prati);
    else if (uredjaj.addListener) uredjaj.addListener(prati);
} catch (e) { /* bez matchMedia nema ni praćenja — boot.js je već pao na svijetlu */ }

// Tema je već na ekranu (boot.js); ovdje se samo normalizira zapis u localStorageu, pa
// smije čekati `DOMContentLoaded`. Ono što se VIDI ne čeka ništa.
document.addEventListener('DOMContentLoaded', initTheme);
