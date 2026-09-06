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
    var TEME = ['academic', 'chalk', 'mint', 'carbon'];
    var TAMNE = { chalk: 1, mint: 1, carbon: 1 };

    /* F1/3 (Leon, 2026-09-04: „isto kao i email template"): bez spremljenog IZBORA stranica
       prati UREĐAJ, točno kao predlošci maila — `prefers-color-scheme: dark` → `carbon`
       (tamna polovica maila), inače `academic` (svijetla). Prvenstvo, zapisano JEDNOM:
       račun (F2/1) > lokalni izbor > uređaj > academic. Odluka „zadana je SVIJETLA"
       (2026-08-13) stoji: crno dobiva samo tko ga je uređajem već tražio, ne svaki posjetitelj. */
    var ZADANA = { light: 'academic', dark: 'carbon' };

    function temaUredjaja() {
        try {
            return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ? ZADANA.dark : ZADANA.light;
        } catch (e) { return ZADANA.light; }
    }

    /* Spremljeni IZBOR, ili null kad ga nema.
       Nepoznata vrijednost (zaostali `dark`, maknuti `paper`) se ODBACUJE, ne propušta: ne bi
       pogodila nijedan token-blok, ali BI upalila legacy pravila za tamnu temu → bijeli tekst
       na svijetloj podlozi.
       ⚠️ MIGRACIJA, ne urednost: do F1/3 je `theme.js` na SVAKOM učitavanju upisivao
       primijenjenu temu natrag u `sokrat-theme` — pa svaki povratni posjetitelj ima `academic`
       iako nikad nije birao. Da se to čita kao izbor, „prati uređaj" ne bi dobio NITKO tko je
       stranicu već otvorio (ni Leon). Zato izbor od F1/3 nosi i biljeg `sokrat-theme-chosen`:
       `academic` BEZ biljega je stari automatski upis i odbacuje se. `chalk`/`mint`/`carbon`
       bez biljega su sigurno izbor (stari kod je upisivao samo ono što je primijenio, a tamnu
       je primijenio samo tko ju je birao) — pa se ZADRŽAVAJU, inače bi Ploča koju je netko
       birao na telefonu nestala. Isto pravilo čita i `theme.js` (birač), kroz ovu funkciju. */
    function izborTeme() {
        var spremljena = null, biljeg = null;
        try {
            spremljena = localStorage.getItem('sokrat-theme');
            biljeg = localStorage.getItem('sokrat-theme-chosen');
        } catch (e) { /* privatni način */ }
        if (TEME.indexOf(spremljena) < 0) return null;
        if (spremljena === ZADANA.light && !biljeg) return null;
        return spremljena;
    }

    function primijeniTemu() {
        var tema = izborTeme() || temaUredjaja();
        var html = document.documentElement;
        // Postavljamo samo kad se RAZLIKUJE — inače je to badava preračun stila na svakom
        // učitavanju, a i test na bljesak broji upravo stvarne promjene vrijednosti.
        if (html.getAttribute('data-theme') !== tema) html.setAttribute('data-theme', tema);
        html.style.colorScheme = TAMNE[tema] ? 'dark' : 'light';
        return tema;
    }

    window.SOKRAT_THEMES = TEME;
    window.__sokratIzborTeme = izborTeme;
    window.__sokratTemaUredjaja = temaUredjaja;
    window.__sokratPrimijeniTemu = primijeniTemu;
    primijeniTemu();

    /* ===== F1/12 ⓪ · UREĐAJ — platforma ZNA na čemu je, na JEDNOM mjestu (2026-09-06) =====
       Leon: „Platforma mora znati na kakvom je uređaju korisnik." Do ove cigle se to pitalo na četiri
       mjesta na četiri načina — CSS `@media (pointer: coarse)` (F1/9 špil, F1/10 polja), `(hover: hover)`
       (F1/8), JS `GestureEvent` (`no-zoom.js`), `prefers-color-scheme` gore (F1/3) — a je li aplikacija
       INSTALIRANA nije znao nitko, iako Leon testira baš instaliranu.

       UGOVOR: CSS pita `:root[data-uredjaj~="dodir"]`, JS pita `SokratUredjaj.dodir`. Nitko drugi u
       `js/**` ne zove `matchMedia` za pointer / any-pointer / hover / any-hover / display-mode i nitko
       drugi ne njuška `GestureEvent` (brana: `tests/unit/uredjaj.test.js`, statički nad `js/**` i `css/**`).

       ⚠️ ŠTO IDE OVAMO, A ŠTO OSTAJE MEDIJ U CSS-u — razlika koja odlučuje:
       • ODLUKA O SUČELJU (špil kartica na dodiru, red gumba, tipke, tutorial) → atribut / objekt ODAVDE;
       • SPOSOBNOST PREGLEDNIKA — činjenica o motoru, ne naša odluka — OSTAJE `@media`: iOS zumira polje
         ispod 16 px (`(pointer: coarse)` u `variables.css`, F1/10) · `:hover` ima smisla samo gdje hover
         postoji (`(hover: hover)` omoti koje `scripts/hover-css.js` gradi u build-vremenu, F1/8).

       Polja: `dodir` (pointer: coarse) · `hover` (hover: hover) · `hibrid` (laptop s dodirom: any-pointer:
       coarse + hover: hover) · `razred` telefon | tablet | stolno — ISTI pragovi kao CSS (`PRAGOVI`, brana ih
       uspoređuje s `css/**`) · `os` ios | drugo — `ios` = `GestureEvent` postoji, isti i JEDINI test motora
       koji repo ima (F1/11 ②; ⚠️ istinit je i u stolnom Safariju, pa `os` smije voditi samo štipanje, nikad
       izgled — izgled pita `dodir`) · `pwa` (display-mode: standalone). Atribut nosi tokene sposobnosti
       koje JESU (odsutna = nema tokena), razred uvijek, `ios` i `pwa` kad jesu. Objekt je ZAMRZNUT;
       osvježenje na promjenu medija (tablet dobije miš, prozor prijeđe prag) je NOVI zamrznut objekt —
       čitaj `SokratUredjaj.x` svaki put, ne drži referencu. Ovdje, a ne u `defer` skripti: špil se crta iz
       atributa, pa atribut mora stajati PRIJE prvog crtanja. Bez mreže, bez UA-njuškanja. */
    var PRAGOVI = { tablet: 768, stolno: 1024 };

    function medij(upit) {
        try { return window.matchMedia ? window.matchMedia(upit) : null; } catch (e) { return null; }
    }
    function istina(upit) { var m = medij(upit); return !!(m && m.matches); }
    /* Širina kroz ISTI upit koji CSS koristi (`min-width`), pa razred i stilovi ne mogu razići ni na
       zumu ni uz klizač; bez `matchMedia` (nema ga samo prastari motor) pada na `innerWidth`. */
    function sirinaBar(px) {
        var m = medij('(min-width: ' + px + 'px)');
        if (m) return !!m.matches;
        var w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
        return w >= px;
    }
    function izracunajUredjaj() {
        var hover = istina('(hover: hover)');
        return {
            dodir: istina('(pointer: coarse)'),
            hover: hover,
            hibrid: hover && istina('(any-pointer: coarse)'),
            razred: sirinaBar(PRAGOVI.stolno) ? 'stolno' : (sirinaBar(PRAGOVI.tablet) ? 'tablet' : 'telefon'),
            os: typeof window.GestureEvent !== 'undefined' ? 'ios' : 'drugo',
            pwa: istina('(display-mode: standalone)')
        };
    }
    function tokeniUredjaja(u) {
        var t = [];
        if (u.dodir) t.push('dodir');
        if (u.hover) t.push('hover');
        if (u.hibrid) t.push('hibrid');
        t.push(u.razred);
        if (u.os === 'ios') t.push('ios');
        if (u.pwa) t.push('pwa');
        return t.join(' ');
    }
    function primijeniUredjaj() {
        var u = Object.freeze(izracunajUredjaj());
        var html = document.documentElement;
        var tokeni = tokeniUredjaja(u);
        // Samo kad se RAZLIKUJE — isti razlog kao kod teme (badava preračun stila).
        if (html.getAttribute('data-uredjaj') !== tokeni) html.setAttribute('data-uredjaj', tokeni);
        window.SokratUredjaj = u;
        return u;
    }
    primijeniUredjaj();
    /* Svaki upit dobije slušača; promjena preračuna SVE (šest upita, jeftino) — tablet dobije miš,
       prozor prijeđe prag, aplikacija se otvori kao PWA. `addListener` = Safari < 14. */
    var upiti = ['(pointer: coarse)', '(hover: hover)', '(any-pointer: coarse)', '(display-mode: standalone)',
        '(min-width: ' + PRAGOVI.tablet + 'px)', '(min-width: ' + PRAGOVI.stolno + 'px)'];
    for (var k = 0; k < upiti.length; k++) {
        var mq = medij(upiti[k]);
        if (!mq) continue;
        if (mq.addEventListener) mq.addEventListener('change', primijeniUredjaj);
        else if (mq.addListener) mq.addListener(primijeniUredjaj);
    }

    /* F1/7 ② · `?bez=zamucenja,sjena` → `<html data-bez="zamucenja sjena">` PRIJE prvog crtanja.
       Protučinjenični prekidač za mjerenje na PRAVOM uređaju: `css/bez.css` gasi sumnjivca
       (zamućenje · sjene · prijelazi · pozadina landinga), Leon na iPhoneu kaže koji je scenarij
       gladak, tek iz toga popravak — `jank-probe` je Chromium i iPhone ne vidi. Popis imena živi
       SAMO u `css/bez.css`: ovdje prolazi bilo koje ime iz [a-z-], nepoznato ne pogađa nijedno
       pravilo. Ovdje, a ne u `defer` skripti, da PRVI kadar već bude „bez" (inače se mjeri
       prijelaz, ne stanje); atribut nadživi čišćenje adrese (`replaceState` u auth.js) jer je
       SPA — <html> ostaje. Čuva `tests/unit/bez-switch.test.js`. */
    var bez = /[?&]bez=([^&#]*)/.exec(String(location.search || ''));
    if (bez) {
        var imena = [];
        try {
            imena = decodeURIComponent(bez[1]).split(',').filter(function (s) { return /^[a-z-]+$/.test(s); });
        } catch (e) { /* pokvaren URL-encoding: nema prekidača, tema ide dalje */ }
        if (imena.length) document.documentElement.setAttribute('data-bez', imena.join(' '));
    }

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
