/* ===== Sokrat Study — boot: odluke PRIJE prvog crtanja =====
 * JEDINA sinkrona skripta na stranici (bez `defer`), umetnuta na sam vrh <body>.
 * Postoji jer CSP (blok D) zabranjuje inline <script> i on* atribute, a ove dvije
 * stvari ne smiju čekati `defer`: sinkrona vanjska skripta blokira parser, pa se
 * izvrši prije prvog crtanja — isto jamstvo koje je davao inline blok.
 */
(function () {
    'use strict';

    /* ===== TEMA — MORA BITI OVDJE, NE U `theme.js` =====
       `<html data-theme="academic">` stoji u markupu i komentar iznad njega je tvrdio da je
       time bljesak riješen. Bio je — SAMO za posjetitelja koji vrti zadanu temu. `chalk` i
       `mint` su TAMNE, pa je za njih prvi kadar zajamčeno svijetao: `initTheme()` je visio o
       `DOMContentLoaded`, a njega čeka 42 skripte koje blokiraju parser.
       IZMJERENO prije popravka (`scripts/fouc-probe.js`, produkcija, spremljen `chalk`):
       FCP 608 ms → tema 727 ms = **119 ms svijetle stranice** na dobroj vezi, 232 ms na Slow-4G.
       Ovdje se izvršava prije prvog crtanja, pa je razlika 0.
       ⚠️ POPIS TEMA ŽIVI OVDJE (a `theme.js` ga čita s `window`) — jedan popis, jedno mjesto:
       druga kopija bi se razišla pri prvoj sljedećoj temi, a razlaz bi se vidio tek kao bljesak. */
    var TEME = ['academic', 'chalk', 'mint'];
    var ZADANA = 'academic';
    var TAMNE = { chalk: 1, mint: 1 };

    function primijeniTemu() {
        var spremljena = null;
        try { spremljena = localStorage.getItem('sokrat-theme'); } catch (e) { /* privatni način */ }
        /* Nepoznata vrijednost (zaostali `dark`, maknuti `paper`) se ODBACUJE, ne propušta:
           ne bi pogodila nijedan token-blok, ali BI upalila legacy pravila za tamnu temu
           → bijeli tekst na svijetloj podlozi. Ista provjera stoji i u `theme.js`. */
        var tema = TEME.indexOf(spremljena) >= 0 ? spremljena : ZADANA;
        var html = document.documentElement;
        // Postavljamo samo kad se RAZLIKUJE — inače je to badava preračun stila na svakom
        // učitavanju, a i test na bljesak broji upravo stvarne promjene vrijednosti.
        if (html.getAttribute('data-theme') !== tema) html.setAttribute('data-theme', tema);
        html.style.colorScheme = TAMNE[tema] ? 'dark' : 'light';
        return tema;
    }

    window.SOKRAT_THEMES = TEME;
    window.SOKRAT_THEME_DEFAULT = ZADANA;
    window.__sokratPrimijeniTemu = primijeniTemu;
    primijeniTemu();

    /* Dijeljiva ruta (K1) znači da posjetitelj smije ući RAVNO na browse ili lekciju, gdje
       drugi red trake POSTOJI. Odluka se zato mora donijeti prije prvog crtanja, a ne u
       `navigateTo`: `<body class="no-pathbar">` stoji u markupu zbog CLS-a (izmjereno 0.1546
       uz prag 0.10 kad je klasu dodavao tek probuđeni JS), pa ju za duboke rute treba
       skinuti PRIJE nego preglednik išta nacrta. Na stranicama bez te klase (editor) je no-op. */
    if (location.hash.indexOf('#/') === 0 && location.hash !== '#/') {
        document.body.classList.remove('no-pathbar');
    }

    /* KaTeX CSS se učitava asinkrono trikom `media="print"` → `media="all"` po loadu.
       Prebacivanje je živjelo u `onload` atributu; CSP ga zabranjuje, pa link nosi
       `data-media-swap`, a prebacuje se ovdje. `l.sheet` pokriva slučaj da je stylesheet
       (iz cachea) već učitan prije nego što se ova skripta izvršila. */
    var links = document.querySelectorAll('link[data-media-swap]');
    for (var i = 0; i < links.length; i++) {
        (function (l) {
            if (l.sheet) { l.media = 'all'; return; }
            l.addEventListener('load', function () { l.media = 'all'; });
        })(links[i]);
    }
})();
