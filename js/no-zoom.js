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
 * ZAŠTO SAMO GDJE `GestureEvent` POSTOJI: Chrome/Android metu slušaju i `GestureEvent` nemaju;
 * nepasivan `touchmove` na `document` bi im badava usporio skrol (preglednik mora čekati slušača
 * prije svakog pomaka). Jedan prst (skrol) ima `scale === 1` → ne dira se; dva prsta = štipanje.
 *
 * ZAŠTO VLASTITA DATOTEKA, NE `boot.js`: mora na svih ŠEST stranica, a četiri pravne `boot.js`
 * nemaju (F1/5) — kopija u dva mjesta bi bila ADR-027 propust. `defer` je dovoljan: gesta stiže
 * poslije učitavanja, ne prije prvog crtanja.
 *
 * NEMJERLJIVO U HEADLESSU (BUG-043: gestu izvodi Safarijev UI-proces) — oblik čuva
 * `tests/unit/touch-zoom.test.js` ③ (vm sandbox: veže se samo uz `GestureEvent`, `passive: false`,
 * `scale 2` otkazan, `scale 1` ne), presudu daje Leon na iPhoneu.
 */
(function () {
    'use strict';
    if (typeof window.GestureEvent === 'undefined') return;

    var otkazi = function (e) { e.preventDefault(); };
    document.addEventListener('gesturestart', otkazi, { passive: false });
    document.addEventListener('gesturechange', otkazi, { passive: false });
    document.addEventListener('touchmove', function (e) {
        if (typeof e.scale === 'number' && e.scale !== 1) e.preventDefault();
    }, { passive: false });
})();
