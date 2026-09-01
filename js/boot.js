/* ===== Sokrat Study — boot: odluke PRIJE prvog crtanja =====
 * JEDINA sinkrona skripta na stranici (bez `defer`), umetnuta na sam vrh <body>.
 * Postoji jer CSP (blok D) zabranjuje inline <script> i on* atribute, a ove dvije
 * stvari ne smiju čekati `defer`: sinkrona vanjska skripta blokira parser, pa se
 * izvrši prije prvog crtanja — isto jamstvo koje je davao inline blok.
 */
(function () {
    'use strict';

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
