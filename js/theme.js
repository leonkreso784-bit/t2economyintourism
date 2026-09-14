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
    if (name !== 'auto' && window.SOKRAT_THEMES.indexOf(name) < 0) return false;
    zapisiIzborLokalno(name);
    initTheme();
    upisiTemuURacun(name);
    return true;
}

/** Upiše izbor na OVAJ uređaj (prvi kadar sljedećeg ulaska ga čita u `boot.js`). Račun ne dira.
    ⚠️ Stoji IZA `setTheme`, ne između njega i `initTheme`: `theme-boot-order.test.js` u tom
    rasponu traži da nema nijednog `setItem` (upis na učitavanju je zabranjen, F1/3). */
function zapisiIzborLokalno(name) {
    try {
        if (name === 'auto') {
            localStorage.removeItem('sokrat-theme');
            localStorage.removeItem('sokrat-theme-chosen');
        } else {
            localStorage.setItem('sokrat-theme', name);
            localStorage.setItem('sokrat-theme-chosen', '1');   // biljeg izbora — v. boot.js
        }
    } catch (e) { /* privatni način: bez zapisa NEMA ni izbora — pada na uređaj (do F1/3 je padao na zadanu) */ }
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

/* ========== F2/1 · TEMA PRATI RAČUN ==========
   Leon, 2026-09-04: „tema treba pratiti račun" — do sad je živjela samo u `localStorage`, pa
   je neprijavljen posjetitelj zaticao temu zadnjeg prijavljenog. Prvenstvo (`boot.js`):
   račun > lokalni izbor > uređaj > academic.
   ⚠️ `localStorage` OSTAJE prvi kadar: odluka mora pasti prije crtanja, a račun stiže tek
   kad se učita supabase-js. Račun ga zato PREGAZI čim stigne i ne čeka se ništa na ekranu.
   Izbor je u `user_metadata.theme` (JWT, bez nove tablice — Leon, anketa 13.09.); „Automatski"
   se piše izričito kao `auto`, jer ključ koji NEDOSTAJE znači „račun još nema mišljenje" i
   pokreće preuzimanje izbora s uređaja (niže).
   ⚠️ `SokratAuth` je GOLI `const` iz `auth.js` (učitan POSLIJE ove datoteke) — zato se čita
   golo i tek u trenutku poziva, nikad `window.SokratAuth`. Brana: `tests/unit/theme-account.test.js`. */
const TEMA_RACUNA = 'theme';
let _temaNaPutu = null;              // izbor čiji upis u račun još čeka mrežu
const _preuzetoZa = {};              // user.id → preuzimanje izbora s uređaja je već pokrenuto

function valjanaTemaRacuna(v) {
    return v === 'auto' || window.SOKRAT_THEMES.indexOf(v) >= 0;
}

/** Birač u profilu pokazuje IZBOR — kad ga promijeni račun, a ne klik, mora se preoznačiti. */
function oznaciBiracTeme() {
    const izbor = getThemeChoice();
    document.querySelectorAll('[data-theme-pick]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.themePick === izbor ? 'true' : 'false');
    });
}

function primijeniTemuRacuna(tema) {
    if (tema === getThemeChoice()) return;
    zapisiIzborLokalno(tema);
    initTheme();
    oznaciBiracTeme();
}

function upisiTemuURacun(name) {
    if (typeof SokratAuth === 'undefined') return;
    const user = SokratAuth.getUser();
    const client = SokratAuth.getClient();
    if (!user || !client) return;
    if ((user.user_metadata || {})[TEMA_RACUNA] === name) return;
    _temaNaPutu = name;
    const podaci = {};
    podaci[TEMA_RACUNA] = name;
    // Tema je već na ekranu — upis je u pozadini. Ne uspije li (bez mreže), račun ostaje izvor
    // istine: sljedeća prijava vrati ono što on ima. To je svjesna cijena, ne kvar.
    Promise.resolve(client.auth.updateUser({ data: podaci }))
        .then(function (r) { if (r && r.error) throw r.error; })
        .catch(function (e) { console.warn('[tema] upis u račun nije uspio:', (e && e.message) || e); })
        .then(function () { if (_temaNaPutu === name) _temaNaPutu = null; });
}

/* Račun bez teme (svaki račun stariji od F2/1) preuzme izbor koji uređaj već ima — inače bi
   svatko morao birati ispočetka. ⚠️ Tek nakon SVJEŽEG čitanja s poslužitelja: sesija iz
   `localStorage` zna biti starija od izbora napravljenog na drugom uređaju, pa bi slijepo
   preuzimanje pregazilo noviji izbor starijim. Jednom po korisniku (SIGNED_IN se ponavlja). */
function preuzmiIzborUredjaja(user) {
    const izbor = window.__sokratIzborTeme();
    if (!izbor || _preuzetoZa[user.id]) return;
    const client = SokratAuth.getClient();
    if (!client) return;
    _preuzetoZa[user.id] = true;
    Promise.resolve(client.auth.getUser())
        .then(function (r) {
            const svjez = r && r.data && r.data.user;
            if (!svjez) return;
            const tema = (svjez.user_metadata || {})[TEMA_RACUNA];
            if (valjanaTemaRacuna(tema)) primijeniTemuRacuna(tema);
            else upisiTemuURacun(window.__sokratIzborTeme() || 'auto');
        })
        .catch(function (e) { console.warn('[tema] čitanje računa nije uspjelo:', (e && e.message) || e); });
}

function naPromjenuRacuna(user, event) {
    if (!user) {
        // Leon, 2026-09-06: „tuđi izbor ne smije preživjeti odjavu" — račun ga čuva za iduću
        // prijavu. SAMO odjava: neprijavljen posjetitelj (INITIAL_SESSION bez sesije) svoj
        // lokalni izbor zadržava, jer on nikome drugome ne pripada.
        if (event === 'SIGNED_OUT') primijeniTemuRacuna('auto');
        return;
    }
    if (_temaNaPutu !== null) return;   // klik čeka mrežu — staro stanje računa ga ne vraća unatrag
    const tema = (user.user_metadata || {})[TEMA_RACUNA];
    if (valjanaTemaRacuna(tema)) primijeniTemuRacuna(tema);
    // Preuzimanje je MIGRACIJA pri ulasku (prijava / učitana sesija), ne pravilo koje vrijedi
    // stalno: na `USER_UPDATED` bez teme bi prozor odmah ponovno upisao ono što je netko upravo
    // namjerno maknuo (izmjereno na stagingu 14.09. — vraćanje stanja u specu se poništavalo).
    else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') preuzmiIzborUredjaja(user);
}

document.addEventListener('DOMContentLoaded', function () {
    if (typeof SokratAuth === 'undefined' || typeof SokratAuth.onChange !== 'function') return;
    SokratAuth.onChange(naPromjenuRacuna);
    // `auth.js` se inicijalizira na ISTOM događaju i sesiju donosi asinkrono, pa je ovdje
    // obično još nema — ali ako ju je već donio, obradi ju kao zatečenu.
    const zatecen = SokratAuth.getUser();
    if (zatecen) naPromjenuRacuna(zatecen, 'INITIAL_SESSION');
});
