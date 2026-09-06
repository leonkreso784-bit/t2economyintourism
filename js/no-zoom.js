/* ===== Sokrat Study — no-zoom: stranica se NE zumira ni kad korisnik pokuša (ADR-034, F1/11 ②) =====
 *
 * ZAŠTO POSTOJI: Leon (2026-09-05, na iPhoneu, poslije F1/11 ①): „ja bi da maknemo mogućnost
 * zumiranja kompletno, da se ne može zumirat ni kada korisnik pokuša — sa dva prsta." Dodir u polje
 * i dvostruki dodir su već bili ugašeni (F1/10 + F1/11 ①: polja 16 px, `touch-action: pan-x pan-y`,
 * meta `user-scalable=no, maximum-scale=1`) — i on je to na uređaju potvrdio. ŠTIPANJE nije:
 * Safari na iOS-u od verzije 10 metu za štipanje IGNORIRA, a `touch-action` ga na njegovu iPhoneu
 * nije zaustavio. Ostaje jedini sloj koji WebKit sluša: nestandardni `gesturestart` / `gesturechange`
 * (šalje ih samo WebKit) + `touchmove` sa `scale !== 1`, oba otkazana `preventDefault()`-om uz
 * `passive: false` — pasivan slušač ne smije otkazati ništa, pa bi bez toga ovo bilo ukras.
 *
 * ZAŠTO SAMO NA iOS-u: Chrome/Android metu slušaju i `GestureEvent` nemaju; nepasivan `touchmove` na
 * `document` bi im badava usporio skrol (preglednik mora čekati slušača prije svakog pomaka). Jedan
 * prst (skrol) ima `scale === 1` → ne dira se; dva prsta = štipanje.
 *
 * MOTOR SE OD F1/12 ⓪ NE NJUŠKA OVDJE: platforma zna uređaj na JEDNOM mjestu — `js/boot.js` jednom
 * izračuna `SokratUredjaj.os` (`ios` = `GestureEvent` postoji, isti test koji je do tada stajao ovdje),
 * a ovdje se samo ČITA. `boot.js` je sinkron na vrhu `<body>` svih ŠEST stranica, ovo je `defer`, pa
 * objekt uvijek već postoji; taj redoslijed čuva `tests/unit/uredjaj.test.js`. Bez objekta (boot nije
 * prošao) se ne veže ništa — bolje štipanje koje radi nego nepasivan `touchmove` na motoru koji ne
 * poznajemo, a drugi test motora ovdje bi bio druga istina (ADR-027).
 *
 * ZAŠTO VLASTITA DATOTEKA, NE `boot.js`: boot je „odluke PRIJE prvog crtanja" i blokira parser —
 * svaki bajt ondje plaća prvi kadar; gesta stiže tek poslije učitavanja, pa joj `defer` ne košta ništa.
 * (Do F1/5 je razlog bio i to što pravne stranice boot nisu imale; od F1/5 ga imaju.)
 *
 * NEMJERLJIVO U HEADLESSU (BUG-043: gestu izvodi Safarijev UI-proces) — oblik čuva
 * `tests/unit/touch-zoom.test.js` ③ (vm sandbox, boot + no-zoom istim redom: veže se samo uz
 * `GestureEvent`, `passive: false`, `scale 2` otkazan, `scale 1` ne), presudu daje Leon na iPhoneu.
 */
(function () {
    'use strict';
    var u = window.SokratUredjaj;
    if (!u || u.os !== 'ios') return;

    var otkazi = function (e) { e.preventDefault(); };
    document.addEventListener('gesturestart', otkazi, { passive: false });
    document.addEventListener('gesturechange', otkazi, { passive: false });
    document.addEventListener('touchmove', function (e) {
        if (typeof e.scale === 'number' && e.scale !== 1) e.preventDefault();
    }, { passive: false });
})();
