// ===== MAKROEKONOMIJA (HR) — VJEŽBE (content pack) =====
//
// CONTENT PACK (NE engine): interaktivne, auto-ocjenjive vježbe za `macroeconomics-hr`.
// Generički engine (js/exercises-core.js, js/exercises.js) ne sadrži NIŠTA odavde — vidi
// docs/architecture/EXERCISES_ENGINE.md §2 (tipovi) + §3 (konvencije brojeva).
//
// IZVORI (_materials/macroeconomics-hr/, FMTU Opatija, ljetni sem. 2025/26) — zadaci su nalik
// kolokvijskim i aktivnostima („Aktivnost 1/2”, računski zadaci uz kolokvije):
//   „Seminar - vježba 1” · „Predavanje 1” (primjeri 1, 6, 7, zad. 4) · „Predavanje1 … VJEŽBA” (tablice HR/DE/PL) ·
//   „Priprema za esej.xlsx” · „M1_BASICS_PRACTICAS EXAMPLES” · „ppt - vjezba 2 Nacionalno računovodstvo” ·
//   „Predavanje 2” (zad. 4–7) · „M2_GDP_NATIONAL_ACCOUNTING” · „ppt - vjezba 3” · „ppt - vjezba 4” · „Predavanje 4”
//   (sadašnja vrijednost) · „Predavanje 5” · „Priprema za 1.kolokvij” (primjeri 1–24) · „ppt - vjezba 5” ·
//   „Fiskalna politika” (2. dio predavanja, primjeri 1–3) · „Priprema 2.kolokvij” (pit. 1–32, Aktivnost 2 zad. 1–5) ·
//   „Chapter 6 Labor Market” (uklj. „Aktivnost tržište rada”) · „vjezba Monetarna makroekonomija” (Vježba 8) ·
//   „Monetarna politika” (novčani/kreditni multiplikator) · „Vjezba 9 - ravnoteža na robno-novčanom tržištu” ·
//   „predavanje_otvorena_2024” (zad. 1, funkcija uvoza).
// Notacija = teorija predmeta (data/macroeconomics-hr/midterm-1.js, midterm-2.js): BDP = C + I + G + E − U (NX = E − U),
//   C = α + β·Y (β = granična sklonost potrošnji, 1 − β = granična sklonost štednji), Yd = Y − T + TR, T = Ta + t·Y,
//   multiplikatori 1/(1 − β) · 1/(1 − β(1 − t)) · −β/(1 − β(1 − t)) · β/(1 − β(1 − t)) · 1/(1 − β(1 − t) + m),
//   realni BDP = nominalni · CPI(baza)/CPI(n), S − I = (G + TR − T) + NX, IS: Y = C + I(r), LM: M/P = k(Y) + l(r).
//
// KONVENCIJE:
//   - Tipovi: choice / numeric / ratio (tablica podataka ide u `givens`). `lesson` = kolokvij (first-midterm =
//     Predavanja 1–5, second-midterm = Predavanja 6–11); `chapter` = broj predavanja (tržište rada i podaci za esej
//     su seminar uz Predavanje 6 → chapter 6); `category` = ključ kategorije teorije (engine ga ignorira).
//   - Brojevi u prikazu s DECIMALNIM ZAREZOM; KaTeX samo \( \) / \[ \] — nikad jedan dolar.
//   - ⚠ parseAmount čita broj s TOČNO 3 znamenke iza jednog separatora kao grupiranje tisuća („1,234” → 1234)
//     → nijedan očekivani odgovor nema točno 3 decimale (zaokružuje se na 2; omjeri < 1 smiju 4) i uputa to traži.
//   - ⚠ unicode minus „−” se pri upisu ne prepoznaje → odgovori su POZITIVNI: pad, deficit i smanjenje traže se kao
//     IZNOS, a smjer (pad / deficit / smanjiti) objašnjava rješenje i pripadna choice-vježba.
//   - %-polja se upisuju kao broj (35, ne 0,35).
//   - Gdje izvor računa sa zaokruženim multiplikatorom (npr. 1,89 umjesto 1,8919), tolerancija je RELATIVNA
//     (tolR) — prihvaća i nezaokruženi i „izvorni” put.
//   - Sve pomoćne funkcije su unutar IIFE-a → jedini globalni naziv je `macroeconomicsHrExercises`.
//
// ⚠ Vježbe su KÔD (generate) → učitavaju se uvijek iz .js preko content.codeScripts (BUG-012).

const macroeconomicsHrExercises = (function () {
  'use strict';

  // ---------- pomoćne funkcije (formatiranje i zaokruživanje) ----------
  function rnd(x, d) {
    const m = Math.pow(10, d);
    return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * m) / m;
  }
  function r2(x) { return rnd(x, 2); }
  function grp(s, sep) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
  // Običan tekst: decimalni zarez, razmak za tisuće, fiksno d decimala.
  function fmt(x, d) {
    if (d == null) d = 2;
    const r = rnd(Math.abs(x), d);
    const neg = x < 0 && r !== 0;
    const parts = r.toFixed(d).split('.');
    return (neg ? '−' : '') + grp(parts[0], ' ') + (parts[1] ? ',' + parts[1] : '');
  }
  // Kao fmt, ali bez nula na kraju (12,50 → 12,5; 12,00 → 12).
  function num(x, d) {
    let s = fmt(x, d == null ? 2 : d);
    if (s.indexOf(',') >= 0) s = s.replace(/,?0+$/, '');
    return s;
  }
  // Relativna tolerancija (najmanje 0,01).
  function tolR(ans, rel) { return Math.max(0.01, rnd(Math.abs(ans) * rel, 4)); }
  // ⚠ parseAmount-zamka: TOČAN odgovor ≥ 1 s točno 3 decimale (npr. 30,625) student prirodno upiše,
  // a engine ga čita kao tisuće. ok3(...) = nijedna vrijednost nije takva; generatori koji bi to
  // mogli dati deterministički pomiču parametar (petlja s gornjom granicom) dok ok3 ne prođe.
  function ndec(x) { const t = String(Math.round(Math.abs(x) * 1e9) / 1e9); const i = t.indexOf('.'); return i < 0 ? 0 : t.length - i - 1; }
  function ok3() { for (let i = 0; i < arguments.length; i++) { const x = arguments[i]; if (Math.abs(x) >= 1 && ndec(x) === 3) return false; } return true; }

  const exercises = [
    // =====================================================================
    // PREDAVANJE 1 — TEMELJNI POJMOVI, BDP, CIJENE, NEZAPOSLENOST (first-midterm)
    // =====================================================================
    {
      id: 'k1-ciljevi-politike',
      lesson: 'first-midterm', chapter: 1, category: 'm1MacroBasics',
      type: 'choice',
      title: 'Ciljevi, varijable i ekonomske politike',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima (Seminar – vježba 1, Priprema za 1. kolokvij).',
      difficulty: 1,
      items: [
        { q: 'Četiri temeljne makroekonomske varijable su BDP, stopa nezaposlenosti, stopa inflacije i kamatnjak.', kind: 'tf', answer: true },
        { q: 'Povećanje javne potrošnje G i smanjenje poreza ekspanzivne su mjere fiskalne politike.', kind: 'tf', answer: true },
        { q: 'Povećanje kamatnjaka ekspanzivna je mjera monetarne politike.', kind: 'tf', answer: false },
        { q: 'Kontrola nadnica i kontrola cijena instrumenti su politike dohodaka.', kind: 'tf', answer: true },
        { q: 'Carine i kvote instrumenti su monetarne politike.', kind: 'tf', answer: false },
        { q: 'Deprecijacija i devalvacija nacionalne valute potiču izvoz i rast BDP-a.', kind: 'tf', answer: true },
        { q: 'Deflacija je trajni rast opće razine cijena.', kind: 'tf', answer: false },
        { q: 'Optimalna godišnja stopa inflacije prema vježbi 1 iznosi otprilike:', kind: 'mc', options: ['0 %', 'oko 2 % (raspon 1–4 %)', 'oko 8 %', 'više od 10 %'], answer: 1 },
        { q: 'Okunov zakon (kako ga navodi kolegij): pad nacionalnog proizvoda za 2 % u odnosu na potencijalni proizvod…', kind: 'mc', options: ['povećava nezaposlenost za 1 %', 'smanjuje nezaposlenost za 1 %', 'povećava inflaciju za 2 %', 'povećava nezaposlenost za 2 %'], answer: 0 },
        { q: 'Phillipsova krivulja opisuje:', kind: 'mc', options: ['inverzni odnos stope nezaposlenosti i stope inflacije', 'odnos BDP-a i kamatnjaka', 'odnos izvoza i uvoza', 'odnos potrošnje i dohotka'], answer: 0 }
      ],
      solution: [
        'Ciljevi: visoka i rastuća proizvodnja, visoka zaposlenost, stabilnost cijena, unutarnja i vanjska ravnoteža. Varijable: BDP, nezaposlenost, inflacija, kamatnjak.',
        'Ekspanzivno = više G, manji porezi, više transfera, više novca, niži kamatnjak, deprecijacija. Restriktivno = obrnuto.',
        'Carine, kvote i tečaj su politika međunarodnih ekonomskih odnosa; nadnice i cijene politika dohodaka.',
        'Deflacija je trajni PAD razine cijena (negativna stopa inflacije).'
      ]
    },

    {
      id: 'k1-tvrdnje-osnove',
      lesson: 'first-midterm', chapter: 1, category: 'm1MacroBasics',
      type: 'choice',
      title: 'Točno ili netočno — osnove makroekonomije',
      prompt: 'Tvrdnje iz „M1 Basics – cases and problems” (zad. 1) i Predavanja 1. Označite točne.',
      difficulty: 1,
      items: [
        { q: 'Stopa nezaposlenosti obično pada tijekom ekspanzija, a raste tijekom recesija.', kind: 'tf', answer: true },
        { q: 'Ako je CPI u Japanu 108, a u SAD-u 104, stopa inflacije u Japanu nužno je viša nego u SAD-u.', kind: 'tf', answer: false },
        { q: 'Kad je rast proizvodnje niži od uobičajenog, stopa nezaposlenosti ima tendenciju rasta (Okunov zakon).', kind: 'tf', answer: true },
        { q: 'Kad gospodarstvo normalno funkcionira, stopa nezaposlenosti jednaka je nuli.', kind: 'tf', answer: false },
        { q: 'Središnja banka snižava kamatnjak kad želi izbjeći recesiju, a podiže ga kad želi usporiti rast.', kind: 'tf', answer: true },
        { q: 'Proizvodnja po stanovniku vrlo se razlikuje između europodručja, SAD-a i Kine.', kind: 'tf', answer: true },
        { q: 'O recesiji se govori kad gospodarstvo najmanje dva uzastopna tromjesečja ostvari negativne stope rasta.', kind: 'tf', answer: true },
        { q: 'Rast nominalnog BDP-a uvijek znači i rast realnog BDP-a.', kind: 'tf', answer: false }
      ],
      solution: [
        'CPI 108 i 104 su RAZINE indeksa (uz možda različite bazne godine) — o stopi inflacije govori tek promjena indeksa od godine do godine.',
        'I u normalnom stanju postoji nezaposlenost (prirodna stopa: frikcijska, strukturna).',
        'Nominalni BDP može rasti samo zbog rasta cijena; realni BDP tada stoji ili pada.'
      ]
    },

    {
      id: 'k1-realni-bdp-seminar',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Realni BDP i stopa rasta (Seminar 1, zad. 1–3)',
      prompt: 'a) BDP zemlje A iznosio je 250 mlrd EUR u 2000. i 350 mlrd EUR u 2015. godini; cijene su u razdoblju porasle 8 %. '
        + 'b) BDP je iznosio 125 mlrd EUR u 2010. i 185 mlrd EUR u 2018.; cijene su porasle 4,5 %. '
        + 'Izračunajte realni BDP završne godine i stopu rasta realnog BDP-a (bazna godina = početna). Zaokružite na 2 decimale.',
      difficulty: 1,
      fields: [
        { key: 'ra', label: 'a) Realni BDP 2015. (mlrd EUR)', answer: r2(350 * 100 / 108), tol: 0.01, unit: '', hint: '350 · (100 / 108)' },
        { key: 'ga', label: 'a) Stopa rasta realnog BDP-a 2000.–2015.', answer: r2((350 * 100 / 108 - 250) / 250 * 100), tol: 0.02, unit: '%', hint: '(realni 2015 − 250) / 250 · 100' },
        { key: 'rb', label: 'b) Realni BDP 2018. (mlrd EUR)', answer: r2(185 * 100 / 104.5), tol: 0.01, unit: '', hint: '185 · (100 / 104,5)' },
        { key: 'gb', label: 'b) Stopa rasta realnog BDP-a 2010.–2018.', answer: r2((185 * 100 / 104.5 - 125) / 125 * 100), tol: 0.02, unit: '%', hint: 'realni BDP bazne godine = nominalni (125)' }
      ],
      solution: [
        'Formula: \\( \\text{realni BDP}_n = \\text{nominalni BDP}_n \\cdot \\frac{CPI_{baza}}{CPI_n} \\); „cijene porasle 8 %” → CPI = 108.',
        'a) Realni BDP 2015. = 350 · 100/108 = 324,07 mlrd EUR; u baznoj 2000. realni = nominalni = 250. Rast = (324,07 − 250)/250 · 100 = 29,63 %.',
        'b) Realni BDP 2018. = 185 · 100/104,5 = 177,03 mlrd EUR; rast = (177,03 − 125)/125 · 100 = 41,63 % (izvor: 41,62 — zaokruživanje).',
        'Realni rast manji je od nominalnog jer dio nominalnog rasta „pojede” rast cijena.'
      ]
    },

    {
      id: 'k1-realni-bdp-pad',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Pad realnog BDP-a (Seminar 1, zad. 6–7)',
      prompt: 'a) 2020. BDP u tržišnim cijenama iznosi 445 mlrd USD, a prethodne godine 470 mlrd USD; cijene su porasle 5 %. '
        + 'b) 2020. BDP iznosi 300 mlrd USD, a prethodne godine 350 mlrd USD; cijene su se SMANJILE 3,5 %. '
        + 'Izračunajte realni BDP 2020. i stopu PADA realnog BDP-a (upišite iznos pada kao pozitivan broj). 2 decimale.',
      difficulty: 2,
      fields: [
        { key: 'ra', label: 'a) Realni BDP 2020. (mlrd USD)', answer: r2(445 * 100 / 105), tol: 0.01, unit: '', hint: '445 · (100 / 105)' },
        { key: 'pa', label: 'a) Stopa pada realnog BDP-a', answer: r2((470 - 445 * 100 / 105) / 470 * 100), tol: 0.02, unit: '%', hint: '(470 − realni 2020) / 470 · 100' },
        { key: 'rb', label: 'b) Realni BDP 2020. (mlrd USD)', answer: r2(300 * 100 / 96.5), tol: 0.01, unit: '', hint: 'pad cijena 3,5 % → CPI = 96,5' },
        { key: 'pb', label: 'b) Stopa pada realnog BDP-a', answer: r2((350 - 300 * 100 / 96.5) / 350 * 100), tol: 0.02, unit: '%', hint: '(350 − realni 2020) / 350 · 100' }
      ],
      solution: [
        'a) CPI 2020. = 105 → realni BDP = 445 · 100/105 = 423,81 mlrd USD. Stopa promjene = (423,81 − 470)/470 · 100 = −9,83 % → PAD od 9,83 %.',
        '⚠ Izvor (Seminar 1, zad. 6) navodi 425,81 i −9,40 % — to je računska greška; 445/1,05 = 423,81.',
        'b) Cijene pale 3,5 % → CPI = 96,5 → realni BDP = 300 · 100/96,5 = 310,88 mlrd USD — VEĆI od nominalnog jer su cijene pale. Promjena = (310,88 − 350)/350 · 100 = −11,18 % → pad 11,18 %.',
        'U oba slučaja realna proizvodnja pada → nepovoljna situacija, pad kupovne moći.'
      ]
    },

    {
      id: 'k1-nominalni-iz-realnog',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Nominalni BDP iz realnog (Seminar 1, zad. 4–5; M1 zad. 3)',
      prompt: 'Realni BDP zemlje A u 2015. iznosio je 300 mlrd USD, a u 2018. 290 mlrd USD. Cijene su u 2018. porasle 1,5 % u odnosu na 2015. '
        + 'Izračunajte nominalni BDP 2018., stopu PADA realnog BDP-a i stopu PADA nominalnog BDP-a 2015.–2018. (padove upišite kao pozitivan broj; 2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'defl', label: 'Indeks cijena 2018. (2015 = 100)', answer: 101.5, tol: 0.01, unit: '', hint: '100 + 1,5 → deflator = 101,5/100' },
        { key: 'n18', label: 'Nominalni BDP 2018. (mlrd USD)', answer: r2(290 * 1.015), tol: 0.01, unit: '', hint: 'realni · deflator' },
        { key: 'pr', label: 'Stopa pada realnog BDP-a', answer: r2((300 - 290) / 300 * 100), tol: 0.01, unit: '%', hint: '(300 − 290) / 300 · 100' },
        { key: 'pn', label: 'Stopa pada nominalnog BDP-a', answer: r2((300 - 290 * 1.015) / 300 * 100), tol: 0.02, unit: '%', hint: 'u baznoj 2015. nominalni = realni = 300' }
      ],
      solution: [
        '\\( \\text{Nominalni BDP} = \\text{realni BDP} \\cdot \\text{deflator} \\), deflator = 101,5/100 = 1,015.',
        'Nominalni BDP 2018. = 290 · 1,015 = 294,35 mlrd USD.',
        'Realni BDP: (290 − 300)/300 · 100 = −3,33 % → pad 3,33 %. Nominalni: (294,35 − 300)/300 · 100 = −1,88 % → pad 1,88 %.',
        '⚠ Izvor (Seminar 1, zad. 4) usput tvrdi da je „nominalni BDP 2015. isti kao nominalni BDP 2018.” — nije: 300 prema 294,35. U baznoj godini jednaki su NOMINALNI i REALNI BDP iste godine.'
      ]
    },

    {
      id: 'k1-deflator-primjeri',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Realni i nominalni rast (Predavanje 1, primjeri 6 i 7)',
      prompt: 'Primjer 6: BDP je iznosio 260 mlrd USD u 1980. (bazna godina, CPI = 100) i 325 mlrd USD u 1990.; CPI 1990. = 130. '
        + 'Primjer 7: BDP je iznosio 450 mlrd EUR u 1990. i 680 mlrd EUR u 2000.; cijene su porasle 15 %. '
        + 'Izračunajte tražene veličine (2 decimale; pad upišite kao pozitivan broj).',
      difficulty: 2,
      fields: [
        { key: 'r90', label: 'Pr. 6: realni BDP 1990. (mlrd USD)', answer: 250, tol: 0.01, unit: '', hint: '325 · 100/130' },
        { key: 'pr6', label: 'Pr. 6: stopa PADA realnog BDP-a', answer: r2((260 - 250) / 260 * 100), tol: 0.01, unit: '%', hint: '(260 − 250)/260 · 100' },
        { key: 'gn6', label: 'Pr. 6: stopa rasta nominalnog BDP-a', answer: 25, tol: 0.01, unit: '%', hint: '(325 − 260)/260 · 100' },
        { key: 'r00', label: 'Pr. 7: realni BDP 2000. (mlrd EUR)', answer: r2(680 / 1.15), tol: 0.01, unit: '', hint: '680 · 100/115' },
        { key: 'gr7', label: 'Pr. 7: stopa rasta realnog BDP-a', answer: r2((680 / 1.15 - 450) / 450 * 100), tol: 0.02, unit: '%', hint: '(realni 2000 − 450)/450 · 100' }
      ],
      solution: [
        'Pr. 6: realni BDP 1990. = 325 · 100/130 = 250 < 260 → realni pad 3,85 %, iako je nominalni BDP porastao 25 %. Kupovna moć se SMANJILA — rast je došao od cijena, ne od količine.',
        'Pr. 7: realni BDP 2000. = 680 · 100/115 = 591,30 mlrd EUR; realni rast = (591,30 − 450)/450 · 100 = 31,40 % → kupovna moć raste, rast je iz količine proizvodnje (povoljno).'
      ]
    },

    {
      id: 'k1-realni-bdp-random',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Realni BDP — vježba s novim brojevima',
      prompt: 'Iz nominalnog BDP-a dviju godina i rasta cijena izračunajte realni BDP i stope rasta.',
      difficulty: 1,
      params: {
        y0: { min: 200, max: 600, step: 10 },
        d: { min: 30, max: 200, step: 10 },
        p: { choices: [2, 3.5, 4, 4.5, 5, 6, 8, 10, 12] },
        yrs: { choices: [[2019, 2024], [2015, 2020], [2010, 2018], [2020, 2025], [2000, 2010]] }
      },
      generate(p) {
        const y0 = p.y0;
        let y1 = p.y0 + p.d;
        if ((y1 - y0) / y0 * 100 <= p.p + 2) y1 = Math.ceil(y0 * (1 + (p.p + 6) / 100) / 10) * 10;
        for (let i = 0; i < 60; i++) {
          const rr = y1 * 100 / (100 + p.p);
          if (ok3(rr, (y1 - y0) / y0 * 100, (rr - y0) / y0 * 100)) break;
          y1 += 10;
        }
        const cpi = 100 + p.p;
        const real = y1 * 100 / cpi;
        const gn = (y1 - y0) / y0 * 100;
        const gr = (real - y0) / y0 * 100;
        const a = p.yrs[0], b = p.yrs[1];
        return {
          prompt: 'BDP zemlje X u ' + a + '. iznosio je ' + y0 + ' mlrd EUR, a u ' + b + '. ' + y1 + ' mlrd EUR. Cijene su u razdoblju porasle '
            + num(p.p, 1) + ' %. Izračunajte CPI ' + b + '. (' + a + ' = 100), realni BDP ' + b + '., stopu rasta nominalnog i stopu rasta realnog BDP-a. 2 decimale.',
          fields: [
            { key: 'cpi', label: 'CPI ' + b + '. (' + a + ' = 100)', answer: cpi, tol: 0.01, unit: '', hint: '100 + rast cijena u %' },
            { key: 'real', label: 'Realni BDP ' + b + '. (mlrd EUR)', answer: r2(real), tol: 0.01, unit: '', hint: y1 + ' · (100 / ' + num(cpi, 1) + ')' },
            { key: 'gn', label: 'Stopa rasta nominalnog BDP-a', answer: r2(gn), tol: 0.01, unit: '%', hint: '(' + y1 + ' − ' + y0 + ') / ' + y0 + ' · 100' },
            { key: 'gr', label: 'Stopa rasta realnog BDP-a', answer: r2(gr), tol: 0.02, unit: '%', hint: '(realni − ' + y0 + ') / ' + y0 + ' · 100 — bazna godina: realni = nominalni' }
          ],
          solution: [
            'CPI ' + b + '. = 100 + ' + num(p.p, 1) + ' = ' + num(cpi, 1) + '.',
            'Realni BDP ' + b + '. = ' + y1 + ' · 100/' + num(cpi, 1) + ' = ' + fmt(real) + ' mlrd EUR (u ' + a + '. realni = nominalni = ' + y0 + ').',
            'Nominalni rast = (' + y1 + ' − ' + y0 + ')/' + y0 + ' · 100 = ' + fmt(gn) + ' %; realni rast = (' + fmt(real) + ' − ' + y0 + ')/' + y0 + ' · 100 = ' + fmt(gr) + ' %.',
            'Razlika između nominalnog i realnog rasta posljedica je rasta cijena; realni rast pokazuje stvarni rast količine proizvodnje.'
          ]
        };
      },
      solution: ['Pritisnite „New numbers” za nove brojeve. Realni BDP = nominalni · 100/CPI; stopa rasta = (Yt − Y0)/Y0 · 100.']
    },

    {
      id: 'k1-nominalni-random',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Nominalni BDP iz realnog — vježba',
      prompt: 'Iz realnog BDP-a i rasta cijena izračunajte nominalni BDP i stope rasta.',
      difficulty: 1,
      params: {
        r0: { choices: [200, 250, 400, 500] },
        dr: { min: 10, max: 60, step: 10 },
        p: { choices: [1.5, 2, 2.5, 3, 4, 5, 6] }
      },
      generate(p) {
        const r0 = p.r0;
        let r1 = p.r0 + p.dr;
        for (let i = 0; i < 60; i++) {
          const nn = r1 * (100 + p.p) / 100;
          if (ok3(nn, (r1 - r0) / r0 * 100, (nn - r0) / r0 * 100)) break;
          r1 += 10;
        }
        const defl = (100 + p.p) / 100;
        const n1 = r1 * defl;
        const gr = (r1 - r0) / r0 * 100;
        const gn = (n1 - r0) / r0 * 100;
        return {
          prompt: 'Realni BDP zemlje B u 2020. (bazna godina) iznosio je ' + r0 + ' mlrd EUR, a u 2024. ' + r1 + ' mlrd EUR. Cijene su 2024. porasle '
            + num(p.p, 1) + ' % u odnosu na 2020. Izračunajte indeks cijena 2024. (2020 = 100), nominalni BDP 2024. i stope rasta realnog i nominalnog BDP-a (2 decimale).',
          fields: [
            { key: 'defl', label: 'Indeks cijena 2024. (2020 = 100)', answer: rnd(100 + p.p, 2), tol: 0.01, unit: '', hint: '100 + ' + num(p.p, 1) + ' (deflator = indeks / 100)' },
            { key: 'n1', label: 'Nominalni BDP 2024. (mlrd EUR)', answer: r2(n1), tol: 0.01, unit: '', hint: r1 + ' · ' + num(defl, 4) },
            { key: 'gr', label: 'Stopa rasta realnog BDP-a', answer: r2(gr), tol: 0.01, unit: '%', hint: '(' + r1 + ' − ' + r0 + ') / ' + r0 + ' · 100' },
            { key: 'gn', label: 'Stopa rasta nominalnog BDP-a', answer: r2(gn), tol: 0.02, unit: '%', hint: 'nominalni 2020. = realni 2020. = ' + r0 }
          ],
          solution: [
            'Deflator = CPI 2024./CPI 2020. = ' + num(100 + p.p, 1) + '/100 = ' + num(defl, 4) + '.',
            'Nominalni BDP 2024. = ' + r1 + ' · ' + num(defl, 4) + ' = ' + fmt(n1) + ' mlrd EUR.',
            'Realni rast = ' + fmt(gr) + ' %; nominalni rast = (' + fmt(n1) + ' − ' + r0 + ')/' + r0 + ' · 100 = ' + fmt(gn) + ' % — nominalni je veći jer uključuje i rast cijena.'
          ]
        };
      },
      solution: ['Nominalni BDP = realni BDP · deflator; deflator = CPI(n)/CPI(baza).']
    },

    {
      id: 'k1-kosarica',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'ratio',
      title: 'Nominalni i realni BDP iz košarice (M1, zad. 4)',
      prompt: 'Gospodarstvo proizvodi automobile, računala i naranče (tablica). Izračunajte nominalni BDP, realni BDP uz cijene 2005. i uz cijene 2006. te stope rasta. 2 decimale.',
      difficulty: 2,
      givens: [
        { label: 'Automobili: količina / cijena 2005.', value: '10 / 2 000 USD' },
        { label: 'Automobili: količina / cijena 2006.', value: '12 / 3 000 USD' },
        { label: 'Računala: količina / cijena 2005.', value: '4 / 1 000 USD' },
        { label: 'Računala: količina / cijena 2006.', value: '6 / 500 USD' },
        { label: 'Naranče: količina / cijena 2005. i 2006.', value: '1 000 / 1 USD' }
      ],
      fields: [
        { key: 'n05', label: 'Nominalni BDP 2005. (USD)', answer: 25000, tol: 0, unit: '', hint: '10·2 000 + 4·1 000 + 1 000·1' },
        { key: 'n06', label: 'Nominalni BDP 2006. (USD)', answer: 40000, tol: 0, unit: '', hint: '12·3 000 + 6·500 + 1 000·1' },
        { key: 'gn', label: 'Rast nominalnog BDP-a', answer: 60, tol: 0.01, unit: '%', hint: '(40 000 − 25 000) / 25 000 · 100' },
        { key: 'r06a', label: 'Realni BDP 2006. u cijenama 2005. (USD)', answer: 31000, tol: 0, unit: '', hint: '12·2 000 + 6·1 000 + 1 000' },
        { key: 'gra', label: 'Realni rast uz cijene 2005.', answer: 24, tol: 0.01, unit: '%', hint: '(31 000 − 25 000) / 25 000 · 100' },
        { key: 'r05b', label: 'Realni BDP 2005. u cijenama 2006. (USD)', answer: 33000, tol: 0, unit: '', hint: '10·3 000 + 4·500 + 1 000' },
        { key: 'grb', label: 'Realni rast uz cijene 2006.', answer: r2((40000 / 33000 - 1) * 100), tol: 0.01, unit: '%', hint: '(40 000 − 33 000) / 33 000 · 100' }
      ],
      solution: [
        'Nominalni BDP = Σ(Q_t · P_t): 2005. = 25 000 USD, 2006. = 40 000 USD → rast 60 %.',
        'Uz cijene 2005.: realni 2005. = 25 000, realni 2006. = 31 000 → realni rast 24 %.',
        'Uz cijene 2006.: realni 2005. = 33 000, realni 2006. = 40 000 → realni rast 21,21 %.',
        'Stope se razlikuju jer se relativne cijene mijenjaju (automobili poskupljuju, računala pojeftinjuju) — nijedna nije „jedina točna”; zato se u praksi koriste ulančani (verižni) indeksi. Deflator 2006. (baza 2005.) = 40 000/31 000 = 1,2903.'
      ]
    },

    {
      id: 'k1-realna-primanja',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Realna vrijednost dohotka (Predavanje 1, primjer 1 i zad. 4)',
      prompt: 'a) Neto prihod je 5 000 EUR mjesečno. Kolika su realna primanja (u cijenama prve godine) ako su cijene druge godine porasle 10 %, a ako su treće godine (u odnosu na prvu) pale 5 %? '
        + 'b) Zemlja X: proizvodnja 2023. = 105 mlrd EUR, 2024. = 120 mlrd EUR; cijene su 2024. porasle 5,5 %. Izračunajte realni BDP 2024. i realnu i nominalnu stopu rasta. 2 decimale.',
      difficulty: 1,
      fields: [
        { key: 'a1', label: 'a) Realna primanja uz rast cijena 10 % (EUR)', answer: r2(5000 / 1.1), tol: 0.01, unit: '€', hint: '5 000 · 100/110' },
        { key: 'a2', label: 'a) Realna primanja uz pad cijena 5 % (EUR)', answer: r2(5000 / 0.95), tol: 0.01, unit: '€', hint: '5 000 · 100/95' },
        { key: 'b1', label: 'b) Realni BDP 2024. (mlrd EUR)', answer: r2(120 / 1.055), tol: 0.01, unit: '', hint: '120 · 100/105,5' },
        { key: 'b2', label: 'b) Realna stopa rasta', answer: r2((120 / 1.055 - 105) / 105 * 100), tol: 0.02, unit: '%', hint: '(realni 2024 − 105)/105 · 100' },
        { key: 'b3', label: 'b) Nominalna stopa rasta', answer: r2((120 - 105) / 105 * 100), tol: 0.01, unit: '%', hint: '(120 − 105)/105 · 100' }
      ],
      solution: [
        'a) Rast cijena 10 %: realno 5 000 · 100/110 = 4 545,45 EUR — kupovna moć PADA. Pad cijena 5 %: 5 000 · 100/95 = 5 263,16 EUR — kupovna moć raste (za potrošače povoljnije, ali makroekonomski deflacija nije povoljna).',
        'b) Realni BDP 2024. = 120 · 100/105,5 = 113,74 mlrd EUR; realni rast = 8,33 %, nominalni rast = 14,29 %. Proizvodnja realno raste — povoljna situacija, iako dio nominalnog rasta čine cijene.'
      ]
    },

    {
      id: 'k1-inflacija-tablica',
      lesson: 'first-midterm', chapter: 1, category: 'm1PricesLabour',
      type: 'ratio',
      title: 'Stopa inflacije iz CPI tablice (HR, DE, PL)',
      prompt: 'Tablica CPI (2019 = 100) iz vježbe uz Predavanje 1. Izračunajte stope inflacije (2 decimale). Formula: (CPI_t − CPI_t−1)/CPI_t−1 · 100.',
      difficulty: 1,
      givens: [
        { label: 'Hrvatska CPI 2021. / 2022. / 2023. / 2024.', value: '102,7 / 113,7 / 123 / 127,9' },
        { label: 'Njemačka CPI 2021. / 2022.', value: '103,8 / 111,9' },
        { label: 'Poljska CPI 2021. / 2022.', value: '109 / 124,6' },
        { label: 'Primjer iz predavanja: CPI 2024. / 2025.', value: '105 / 110' }
      ],
      fields: [
        { key: 'hr22', label: 'Hrvatska — inflacija 2022.', answer: r2((113.7 - 102.7) / 102.7 * 100), tol: 0.01, unit: '%', hint: '(113,7 − 102,7)/102,7 · 100' },
        { key: 'hr23', label: 'Hrvatska — inflacija 2023.', answer: r2((123 - 113.7) / 113.7 * 100), tol: 0.01, unit: '%', hint: '(123 − 113,7)/113,7 · 100' },
        { key: 'hr24', label: 'Hrvatska — inflacija 2024.', answer: r2((127.9 - 123) / 123 * 100), tol: 0.01, unit: '%', hint: '(127,9 − 123)/123 · 100' },
        { key: 'de22', label: 'Njemačka — inflacija 2022.', answer: r2((111.9 - 103.8) / 103.8 * 100), tol: 0.01, unit: '%', hint: '(111,9 − 103,8)/103,8 · 100' },
        { key: 'pl22', label: 'Poljska — inflacija 2022.', answer: r2((124.6 - 109) / 109 * 100), tol: 0.01, unit: '%', hint: '(124,6 − 109)/109 · 100' },
        { key: 'hrcum', label: 'Hrvatska — rast cijena 2022. u odnosu na 2019.', answer: 13.7, tol: 0.01, unit: '%', hint: 'CPI 2022 − 100 (baza 2019 = 100)' },
        { key: 'pr', label: 'Primjer: inflacija 2025.', answer: r2((110 - 105) / 105 * 100), tol: 0.01, unit: '%', hint: '(110 − 105)/105 · 100' }
      ],
      solution: [
        'Hrvatska: 2022. = 10,71 %, 2023. = 8,18 %, 2024. = 3,98 % — vrhunac post-covid inflacije 2022., zatim usporavanje.',
        'Njemačka 2022. = 7,80 %, Poljska 2022. = 14,31 % — Poljska ima najjači rast cijena.',
        'Indeks 113,7 prema bazi 100 znači da su cijene 2022. za 13,7 % više nego 2019. (to NIJE godišnja stopa — godišnja se računa prema prethodnoj godini).',
        'Primjer: (110 − 105)/105 · 100 = 4,76 %.'
      ]
    },

    {
      id: 'k1-inflacija-random',
      lesson: 'first-midterm', chapter: 1, category: 'm1PricesLabour',
      type: 'numeric',
      title: 'Stopa inflacije — vježba',
      prompt: 'Iz dvaju uzastopnih CPI indeksa izračunajte stopu inflacije.',
      difficulty: 1,
      params: {
        c0: { min: 100, max: 130, step: 0.5 },
        d: { min: 1, max: 12, step: 0.5 },
        y: { choices: [2021, 2022, 2023, 2024, 2025] }
      },
      generate(p) {
        const c0 = p.c0, c1 = rnd(p.c0 + p.d, 1);
        const inf = (c1 - c0) / c0 * 100;
        return {
          prompt: 'CPI (2019 = 100) u ' + (p.y - 1) + '. iznosi ' + num(c0, 1) + ', a u ' + p.y + '. ' + num(c1, 1)
            + '. Izračunajte stopu inflacije u ' + p.y + '. i za koliko su cijene u ' + p.y + '. više od bazne 2019. (2 decimale).',
          fields: [
            { key: 'inf', label: 'Stopa inflacije ' + p.y + '.', answer: r2(inf), tol: 0.01, unit: '%', hint: '(' + num(c1, 1) + ' − ' + num(c0, 1) + ') / ' + num(c0, 1) + ' · 100' },
            { key: 'cum', label: 'Rast cijena ' + p.y + '. u odnosu na 2019.', answer: r2(c1 - 100), tol: 0.01, unit: '%', hint: 'CPI − 100' }
          ],
          solution: [
            'Stopa inflacije = (' + num(c1, 1) + ' − ' + num(c0, 1) + ')/' + num(c0, 1) + ' · 100 = ' + fmt(inf) + ' %.',
            'U odnosu na baznu 2019. cijene su više za ' + num(c1, 1) + ' − 100 = ' + fmt(c1 - 100) + ' % (to je bazni indeks, ne godišnja stopa).',
            inf > 5 ? 'Stopa iznad 5 % → prema kolegiju opasnost inflacije.' : 'Umjeren rast cijena (do oko 5 %) kolegij ocjenjuje prihvatljivim.'
          ]
        };
      },
      solution: ['Stopa inflacije = (CPI_t − CPI_t−1)/CPI_t−1 · 100.']
    },

    {
      id: 'k1-cpi-tumacenje',
      lesson: 'first-midterm', chapter: 1, category: 'm1PricesLabour',
      type: 'choice',
      title: 'Čitanje CPI-a i realnog BDP-a',
      prompt: 'Priprema za 1. kolokvij (primjeri 2–4) i zadatak s podacima Statističkog ljetopisa. Točno ili netočno?',
      difficulty: 1,
      items: [
        { q: 'BDP je 2015. iznosio 50 000, a 2018. 55 000 mlrd EUR; cijene su porasle 15 %. Realni BDP 2018. niži je od 55 000 mlrd EUR.', kind: 'tf', answer: true },
        { q: 'U istom primjeru realni BDP 2018. manji je čak i od BDP-a 2015. (50 000).', kind: 'tf', answer: true },
        { q: 'U istom primjeru rast cijena realno je povećao životni standard.', kind: 'tf', answer: false },
        { q: 'Indeks cijena 2015. iznosi 95 (2014. = 100). Realni BDP 2015. veći je od nominalnog BDP-a te godine.', kind: 'tf', answer: true },
        { q: 'CPI 95,5 (baza = 100) znači da su se cijene smanjile za 4,5 % — došlo je do deflacije.', kind: 'tf', answer: true },
        { q: 'CPI 95,5 znači da su cijene porasle za 95,5 %.', kind: 'tf', answer: false },
        { q: 'Indeks 102,4 (prethodna godina = 100) znači da su cijene porasle za 2,4 %.', kind: 'tf', answer: true },
        { q: 'Indeks 92,7 znači da su cijene pale za 92,7 %.', kind: 'tf', answer: false },
        { q: 'Nominalni BDP porastao je 20 %, a cijene također 20 %. Realni BDP je:', kind: 'mc', options: ['porastao 20 %', 'ostao isti', 'pao 20 %', 'porastao 40 %'], answer: 1 }
      ],
      solution: [
        '55 000 · 100/115 = 47 826 mlrd EUR < 50 000 → realni pad; životni standard se smanjio.',
        'Uz indeks cijena ispod 100 (pad cijena) realni BDP je VEĆI od nominalnog.',
        'Indeks − 100 = postotna promjena: 95,5 → −4,5 %; 102,4 → +2,4 %; 92,7 → −7,3 %.',
        '1,20/1,20 = 1 → realni BDP nepromijenjen.'
      ]
    },

    {
      id: 'k1-bdp-jaz-politike',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'choice',
      title: 'BDP i BDP jaz — kolokvijska pitanja',
      prompt: 'Priprema za 1. kolokvij, primjeri 1, 5, 6 i 7 (u originalu „odaberite N točnih”). Za svaku tvrdnju odlučite je li točna.',
      difficulty: 2,
      items: [
        { q: 'BDP označava ukupnu vrijednost FINALNE proizvodnje roba i usluga zemlje u određenom razdoblju.', kind: 'tf', answer: true },
        { q: 'BDP uključuje i vrijednost intermedijarne (međufazne) proizvodnje.', kind: 'tf', answer: false },
        { q: 'BDP se definira u količinama.', kind: 'tf', answer: false },
        { q: 'Ravnotežni BDP 2 000 000, potencijalni 3 000 000: prisutan je recesijski BDP jaz od 1 000 000.', kind: 'tf', answer: true },
        { q: 'U tom slučaju treba provoditi restriktivne mjere ekonomske politike.', kind: 'tf', answer: false },
        { q: 'Ravnotežni 2 000 000, potencijalni 2 500 000: pozitivno je provoditi ekspanzivnu monetarnu politiku.', kind: 'tf', answer: true },
        { q: 'U istom slučaju pozitivno je provoditi politiku smanjenja plaća.', kind: 'tf', answer: false },
        { q: 'U istom slučaju negativno je povećati uvoz i negativno je smanjiti izvoz.', kind: 'tf', answer: true },
        { q: 'Ravnotežni 2 000 000, potencijalni 1 500 000: pozitivno je povećati kamatnjak.', kind: 'tf', answer: true },
        { q: 'U tom (inflacijskom) slučaju pozitivno je povećati javnu potrošnju.', kind: 'tf', answer: false }
      ],
      solution: [
        'Recesijski jaz: ravnotežni < potencijalni → neiskorišteni resursi → EKSPANZIVNE mjere (više G, niži porezi, niži kamatnjak, veći izvoz, veće plaće).',
        'Inflacijski jaz: ravnotežni > potencijalni → RESTRIKTIVNE mjere (viši kamatnjak, manja G, viši porezi).',
        'BDP broji samo finalne proizvode (inače dvostruko brojanje) i iskazuje se u novcu.'
      ]
    },

    {
      id: 'k1-usporedba-zemalja',
      lesson: 'first-midterm', chapter: 1, category: 'm1DataAnalysis',
      type: 'ratio',
      title: 'Usporedba zemalja: HR, DE, PL',
      prompt: 'Podaci iz vježbe uz Predavanje 1 (nominalni BDP u milijunima EUR; stanovništvo u milijunima). Izračunajte omjere, BDP po stanovniku i rast. 2 decimale.',
      difficulty: 2,
      givens: [
        { label: 'BDP 2024.: Hrvatska / Njemačka / Poljska (mil. EUR)', value: '85 905 / 4 328 970 / 848 000' },
        { label: 'BDP 2019.: Hrvatska (mil. EUR)', value: '54 906' },
        { label: 'Stanovništvo 2024.: Hrvatska (mil.)', value: '3,866' },
        { label: 'Stanovništvo 2019.: Hrvatska (mil.)', value: '3,949' }
      ],
      fields: [
        { key: 'depl', label: 'Koliko je puta BDP Njemačke veći od Poljske (2024.)', answer: r2(4328970 / 848000), tol: 0.01, unit: '×', hint: '4 328 970 / 848 000' },
        { key: 'dehr', label: 'Koliko je puta BDP Njemačke veći od Hrvatske (2024.)', answer: r2(4328970 / 85905), tol: 0.01, unit: '×', hint: '4 328 970 / 85 905' },
        { key: 'pc24', label: 'BDP po stanovniku Hrvatske 2024. (EUR)', answer: r2(85905 / 3.866), tol: 0.05, unit: '€', hint: 'mil. EUR / mil. stanovnika = EUR po stanovniku' },
        { key: 'pc19', label: 'BDP po stanovniku Hrvatske 2019. (EUR)', answer: r2(54906 / 3.949), tol: 0.05, unit: '€', hint: '54 906 / 3,949' },
        { key: 'g', label: 'Rast nominalnog BDP-a Hrvatske 2019.–2024.', answer: r2((85905 - 54906) / 54906 * 100), tol: 0.01, unit: '%', hint: '(85 905 − 54 906)/54 906 · 100' }
      ],
      solution: [
        'Njemačka/Poljska = 5,10; Njemačka/Hrvatska = 50,39 (2019. je bilo 64,42 → položaj Hrvatske se popravlja).',
        'BDP po stanovniku = BDP / broj stanovnika: 2024. = 85 905/3,866 = 22 220,64 EUR; 2019. = 13 903,77 EUR.',
        'Nominalni rast 2019.–2024. = 56,46 % — dio je rast cijena (CPI HR 2024. = 127,9), pa bi realni rast bio znatno manji.',
        '⚠ Izvor u odgovoru 1 čita BDP 2021. kao „58 353” — u tablici piše 58 343 mil. EUR.'
      ]
    },

    {
      id: 'k1-verizni-indeksi',
      lesson: 'first-midterm', chapter: 1, category: 'm1DataAnalysis',
      type: 'ratio',
      title: 'Verižni i bazni indeksi (Priprema za esej)',
      prompt: 'Zemlja X (tablica). Izračunajte verižne indekse BDP-a, bazni indeks 2024. (2020 = 100), BDP po stanovniku i realni BDP 2024. (u cijenama 2020.). 2 decimale.',
      difficulty: 2,
      givens: [
        { label: 'BDP (mil. EUR) 2020. / 2021. / 2022. / 2023. / 2024.', value: '54 300 / 59 200 / 63 100 / 67 400 / 71 500' },
        { label: 'Stanovništvo (mil.) 2020. / 2024.', value: '4,03 / 3,99' },
        { label: 'CPI (2020 = 100) 2024.', value: '106' }
      ],
      fields: [
        { key: 'v21', label: 'Verižni indeks 2021.', answer: r2(59200 / 54300 * 100), tol: 0.01, unit: '', hint: '59 200/54 300 · 100' },
        { key: 'v22', label: 'Verižni indeks 2022.', answer: r2(63100 / 59200 * 100), tol: 0.01, unit: '', hint: '63 100/59 200 · 100' },
        { key: 'v24', label: 'Verižni indeks 2024.', answer: r2(71500 / 67400 * 100), tol: 0.01, unit: '', hint: '71 500/67 400 · 100' },
        { key: 'b24', label: 'Bazni indeks 2024. (2020 = 100)', answer: r2(71500 / 54300 * 100), tol: 0.01, unit: '', hint: '71 500/54 300 · 100' },
        { key: 'pc24', label: 'BDP po stanovniku 2024. (EUR)', answer: r2(71500 / 3.99), tol: 0.05, unit: '€', hint: '71 500 / 3,99' },
        { key: 'real', label: 'Realni BDP 2024. (mil. EUR, cijene 2020.)', answer: r2(71500 * 100 / 106), tol: 0.01, unit: '', hint: '71 500 · 100/106' }
      ],
      solution: [
        'Verižni indeks = BDP_t/BDP_t−1 · 100: 2021. = 109,02 (+9,02 %), 2022. = 106,59, 2023. = 106,81, 2024. = 106,08 — stabilan pozitivan trend.',
        'Bazni indeks 2024. = 131,68 → BDP je 31,68 % veći nego 2020. (to je UKUPNA, ne prosječna godišnja stopa).',
        'BDP po stanovniku 2024. = 71 500/3,99 = 17 919,80 EUR (⚠ izvor piše „17 920 (17,91)” — zaokruženo je 17,92 tis.). Realni BDP 2024. = 67 452,83 mil. EUR.'
      ]
    },

    {
      id: 'k1-nezaposlenost-random',
      lesson: 'first-midterm', chapter: 1, category: 'm1PricesLabour',
      type: 'numeric',
      title: 'Radna snaga i stopa nezaposlenosti — vježba',
      prompt: 'Iz broja zaposlenih, nezaposlenih i osoba izvan radne snage izračunajte radnu snagu i stope.',
      difficulty: 1,
      params: {
        s: { choices: [
          { E: 1500, U: 120, N: 880 }, { E: 1650, U: 150, N: 1200 }, { E: 380, U: 20, N: 100 },
          { E: 2300, U: 200, N: 1500 }, { E: 1710, U: 90, N: 1200 }, { E: 900, U: 100, N: 600 },
          { E: 1426, U: 74, N: 1000 }, { E: 3680, U: 320, N: 2000 }
        ] }
      },
      generate(p) {
        const E = p.s.E, U = p.s.U, N = p.s.N;
        const L = E + U, W = L + N;
        const u = U / L * 100, e = E / W * 100, part = L / W * 100;
        return {
          prompt: 'U zemlji je ' + fmt(E, 0) + ' tisuća zaposlenih, ' + fmt(U, 0) + ' tisuća nezaposlenih i ' + fmt(N, 0)
            + ' tisuća radno sposobnih osoba izvan radne snage (učenici, kućanice, umirovljenici…). Izračunajte radnu snagu, stopu nezaposlenosti, stopu zaposlenosti i stopu participacije (2 decimale).',
          fields: [
            { key: 'L', label: 'Radna snaga L (tisuće)', answer: L, tol: 0, unit: '', hint: 'L = E + U' },
            { key: 'u', label: 'Stopa nezaposlenosti', answer: r2(u), tol: 0.01, unit: '%', hint: 'U / L · 100' },
            { key: 'e', label: 'Stopa zaposlenosti', answer: r2(e), tol: 0.01, unit: '%', hint: 'E / radno sposobno stanovništvo · 100' },
            { key: 'p', label: 'Stopa participacije', answer: r2(part), tol: 0.01, unit: '%', hint: 'L / radno sposobno stanovništvo · 100' }
          ],
          solution: [
            'Radna snaga L = E + U = ' + fmt(E, 0) + ' + ' + fmt(U, 0) + ' = ' + fmt(L, 0) + ' tisuća; radno sposobno stanovništvo = L + izvan radne snage = ' + fmt(W, 0) + ' tisuća.',
            'Stopa nezaposlenosti = ' + fmt(U, 0) + '/' + fmt(L, 0) + ' · 100 = ' + fmt(u) + ' %.',
            'Stopa zaposlenosti = ' + fmt(E, 0) + '/' + fmt(W, 0) + ' · 100 = ' + fmt(e) + ' %; stopa participacije = ' + fmt(L, 0) + '/' + fmt(W, 0) + ' · 100 = ' + fmt(part) + ' %.',
            'Osobe izvan radne snage NISU nezaposlene — ne ulaze u L.'
          ]
        };
      },
      solution: ['L = E + U; u = U/L · 100; stopa zaposlenosti = E/radno sposobni · 100; participacija = L/radno sposobni · 100.']
    },

    {
      id: 'k1-okun-random',
      lesson: 'first-midterm', chapter: 1, category: 'm1PricesLabour',
      type: 'numeric',
      title: 'Okunov zakon — vježba',
      prompt: 'Primijenite Okunov zakon u obliku iz kolegija: pad proizvodnje 2 % ispod potencijalne povećava nezaposlenost za 1 postotni bod.',
      difficulty: 2,
      params: {
        yp: { min: 400, max: 1000, step: 50 },
        gap: { choices: [2, 3, 4, 5, 6, 8] },
        un: { choices: [4, 5, 6, 7] }
      },
      generate(p) {
        const y = p.yp * (1 - p.gap / 100);
        const du = p.gap / 2;
        return {
          prompt: 'Potencijalni BDP iznosi ' + p.yp + ' mlrd EUR, a stvarni ' + num(y, 2) + ' mlrd EUR. Prirodna stopa nezaposlenosti je '
            + p.un + ' %. Koliki je BDP jaz (u mlrd EUR i u % potencijalnog), za koliko postotnih bodova raste nezaposlenost i kolika je stopa nezaposlenosti?',
          fields: [
            { key: 'gapA', label: 'BDP jaz (mlrd EUR)', answer: r2(p.yp - y), tol: 0.01, unit: '', hint: 'potencijalni − stvarni' },
            { key: 'gapP', label: 'Jaz u % potencijalnog BDP-a', answer: p.gap, tol: 0.01, unit: '%', hint: 'jaz / potencijalni · 100' },
            { key: 'du', label: 'Porast nezaposlenosti (postotni bodovi)', answer: du, tol: 0.01, unit: 'p.b.', hint: 'jaz u % / 2' },
            { key: 'u', label: 'Stopa nezaposlenosti', answer: p.un + du, tol: 0.01, unit: '%', hint: 'prirodna stopa + porast' }
          ],
          solution: [
            'Jaz = ' + p.yp + ' − ' + num(y, 2) + ' = ' + num(p.yp - y, 2) + ' mlrd EUR = ' + p.gap + ' % potencijalnog BDP-a → RECESIJSKI jaz.',
            'Okunov zakon (kolegij): svaka 2 % pada ispod potencijalnog → +1 p.b. nezaposlenosti → ' + p.gap + '/2 = ' + num(du, 1) + ' p.b.',
            'Stopa nezaposlenosti ≈ ' + p.un + ' + ' + num(du, 1) + ' = ' + num(p.un + du, 1) + ' %. Rješenje: ekspanzivne mjere.'
          ]
        };
      },
      solution: ['Okun (kolegij): Δu = (jaz u % potencijalnog) / 2.']
    },

    {
      id: 'k1-sustizanje-kine',
      lesson: 'first-midterm', chapter: 1, category: 'm1GdpReal',
      type: 'numeric',
      title: 'Kada Kina sustiže SAD? (M1, zad. 5)',
      prompt: 'Output SAD-a 2018. iznosio je 20,5 bil. USD, a Kine 2017. 13,5 bil. USD. Kina od 2017. raste 7,9 % godišnje, SAD od 2018. 2,2 % godišnje. '
        + 'Izračunajte output obiju zemalja 2025. (bil. USD, 2 decimale) i godinu u kojoj Kina prvi put dostiže/nadmašuje SAD.',
      difficulty: 3,
      fields: [
        { key: 'cn', label: 'Output Kine 2025. (bil. USD)', answer: r2(13.5 * Math.pow(1.079, 8)), tol: 0.02, unit: '', hint: '13,5 · 1,079^8' },
        { key: 'us', label: 'Output SAD-a 2025. (bil. USD)', answer: r2(20.5 * Math.pow(1.022, 7)), tol: 0.02, unit: '', hint: '20,5 · 1,022^7' },
        { key: 'yr', label: 'Godina sustizanja', answer: 2025, tol: 0, unit: '', hint: 'provjerite 2024.: 22,99 < 23,36' }
      ],
      solution: [
        'Kina: 13,5 · 1,079^(t − 2017); SAD: 20,5 · 1,022^(t − 2018).',
        '2024.: Kina 13,5 · 1,079^7 = 22,99, SAD 20,5 · 1,022^6 = 23,36 → još ne. 2025.: Kina 24,80, SAD 23,87 → Kina je prestigla SAD 2025.',
        'Isti ukupni output ≠ isti životni standard: Kina ima oko 4 puta više stanovnika, pa je BDP po stanovniku i dalje mnogo niži (dio B zadatka).'
      ]
    },

    // =====================================================================
    // PREDAVANJE 2 — NACIONALNO RAČUNOVODSTVO (first-midterm)
    // =====================================================================
    {
      id: 'k1-bdp-rashodni-vj2',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'BDP rashodnom metodom (Vježba 2, zad. 1; Predavanje 2, zad. 4–5)',
      prompt: 'a) Osobna potrošnja 700, javna potrošnja 450, izvoz 100, uvoz 250 mlrd EUR; BDP = 1 200 mlrd EUR. Kolike su investicije? '
        + 'b) C = 150, G = 30, BDP = 300 mlrd USD uz vanjskotrgovinski SUFICIT 100. Kolike su investicije i njihov udio u BDP-u? '
        + 'c) G = 30, I = 80, BDP = 350 mlrd USD uz vanjskotrgovinski DEFICIT 100. Kolika je osobna potrošnja i njezin udio? (2 decimale)',
      difficulty: 1,
      fields: [
        { key: 'Ia', label: 'a) Investicije I (mlrd EUR)', answer: 200, tol: 0.01, unit: '', hint: '1 200 = 700 + I + 450 + 100 − 250' },
        { key: 'Ib', label: 'b) Investicije I (mlrd USD)', answer: 20, tol: 0.01, unit: '', hint: '300 = 150 + I + 30 + 100' },
        { key: 'Ish', label: 'b) Udio investicija u BDP-u', answer: r2(20 / 300 * 100), tol: 0.01, unit: '%', hint: 'I/BDP · 100' },
        { key: 'Cc', label: 'c) Osobna potrošnja C (mlrd USD)', answer: 340, tol: 0.01, unit: '', hint: 'NX = −100!' },
        { key: 'Csh', label: 'c) Udio osobne potrošnje u BDP-u', answer: r2(340 / 350 * 100), tol: 0.01, unit: '%', hint: 'C/BDP · 100' }
      ],
      solution: [
        '\\( BDP = C + I + G + E - U \\).',
        'a) 1 200 = 700 + I + 450 + 100 − 250 → I = 200 mlrd EUR.',
        'b) 300 = 150 + I + 30 + 100 → I = 20; udio 20/300 = 6,67 %.',
        'c) Deficit znači NX = −100: 350 = C + 80 + 30 − 100 → C = 340; udio 340/350 = 97,14 %.'
      ]
    },

    {
      id: 'k1-identitet-vj2',
      lesson: 'first-midterm', chapter: 2, category: 'm1CircularFlow',
      type: 'numeric',
      title: 'Identitet S − I = (G + TR − TA) + NX (Vježba 2, zad. 2, 3, 5, 6)',
      prompt: 'a) Štednja 750, budžetski deficit 150, trgovinski suficit 50 → investicije? '
        + 'b) Investicije 450, budžetski SUFICIT 80, trgovinski DEFICIT 75 → štednja? '
        + 'c) Štednja 300, budžetski deficit 150, trgovinski deficit 50 → investicije? '
        + 'd) Investicije 700, budžetski suficit 250, izvoz veći od uvoza za 100 → štednja?',
      difficulty: 2,
      fields: [
        { key: 'a', label: 'a) Investicije I', answer: 550, tol: 0.01, unit: '', hint: '750 − I = 150 + 50' },
        { key: 'b', label: 'b) Štednja S', answer: 295, tol: 0.01, unit: '', hint: 'S − 450 = (−80) + (−75)' },
        { key: 'c', label: 'c) Investicije I', answer: 200, tol: 0.01, unit: '', hint: '300 − I = 150 + (−50)' },
        { key: 'd', label: 'd) Štednja S', answer: 550, tol: 0.01, unit: '', hint: 'S − 700 = (−250) + 100' }
      ],
      solution: [
        '\\( S - I = (G + TR - TA) + NX \\); deficit proračuna → (G + TR − TA) > 0, SUFICIT → negativan; trgovinski deficit → NX < 0.',
        'a) 750 − I = 150 + 50 → I = 550. b) S − 450 = −80 − 75 → S = 295.',
        'c) 300 − I = 150 − 50 → I = 200. d) S − 700 = −250 + 100 → S = 550.'
      ]
    },

    {
      id: 'k1-bdp-iz-stednje',
      lesson: 'first-midterm', chapter: 2, category: 'm1CircularFlow',
      type: 'numeric',
      title: 'BDP iz štednje i proračuna (Vježba 2, zad. 4)',
      prompt: 'Osobna potrošnja je 800, štednja 500, investicije 300, državna potrošnja 200, a budžetski deficit 100. Izračunajte neto izvoz i BDP.',
      difficulty: 2,
      fields: [
        { key: 'nx', label: 'Neto izvoz NX', answer: 100, tol: 0.01, unit: '', hint: '500 − 300 = 100 + NX' },
        { key: 'y', label: 'BDP', answer: 1400, tol: 0.01, unit: '', hint: 'C + I + G + NX' }
      ],
      solution: [
        'Iz identiteta: S − I = (G + TR − TA) + NX → 500 − 300 = 100 + NX → NX = 100 (trgovinski suficit).',
        'BDP = C + I + G + NX = 800 + 300 + 200 + 100 = 1 400.'
      ]
    },

    {
      id: 'k1-bdp-rashodni-random',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'Rashodni pristup — vježba',
      prompt: 'Iz poznatih komponenti izračunajte nepoznatu komponentu BDP-a i udjele.',
      difficulty: 1,
      params: {
        C: { min: 400, max: 900, step: 10 },
        I: { min: 80, max: 300, step: 10 },
        G: { min: 150, max: 400, step: 10 },
        E: { min: 100, max: 400, step: 10 },
        U: { min: 100, max: 400, step: 10 }
      },
      generate(p) {
        p = Object.assign({}, p);
        for (let i = 0; i < 60; i++) {
          const yy = p.C + p.I + p.G + p.E - p.U;
          if (ok3(p.I / yy * 100, p.C / yy * 100)) break;
          p.C += 10;
        }
        const nx = p.E - p.U;
        const Y = p.C + p.I + p.G + nx;
        return {
          prompt: 'Osobna potrošnja iznosi ' + p.C + ', javna potrošnja ' + p.G + ', izvoz ' + p.E + ', a uvoz ' + p.U + ' mlrd EUR. BDP iznosi '
            + Y + ' mlrd EUR. Izračunajte investicije, udio investicija i udio osobne potrošnje u BDP-u (2 decimale) te iznos vanjskotrgovinskog salda.',
          fields: [
            { key: 'I', label: 'Investicije I (mlrd EUR)', answer: p.I, tol: 0.01, unit: '', hint: 'I = BDP − C − G − (E − U)' },
            { key: 'Ish', label: 'Udio investicija u BDP-u', answer: r2(p.I / Y * 100), tol: 0.01, unit: '%', hint: 'I / BDP · 100' },
            { key: 'Csh', label: 'Udio osobne potrošnje u BDP-u', answer: r2(p.C / Y * 100), tol: 0.01, unit: '%', hint: 'C / BDP · 100' },
            { key: 'nx', label: 'Iznos vanjskotrgovinskog salda |E − U|', answer: Math.abs(nx), tol: 0.01, unit: '', hint: 'upišite iznos (bez predznaka)' }
          ],
          solution: [
            'I = ' + Y + ' − ' + p.C + ' − ' + p.G + ' − (' + p.E + ' − ' + p.U + ') = ' + p.I + ' mlrd EUR.',
            'Udio I = ' + fmt(p.I / Y * 100) + ' %; udio C = ' + fmt(p.C / Y * 100) + ' %.',
            nx > 0 ? 'E − U = ' + nx + ' > 0 → trgovinski SUFICIT.' : (nx < 0 ? 'E − U = ' + fmt(nx, 0) + ' < 0 → trgovinski DEFICIT od ' + Math.abs(nx) + '.' : 'E = U → uravnotežena vanjskotrgovinska bilanca.')
          ]
        };
      },
      solution: ['BDP = C + I + G + E − U.']
    },

    {
      id: 'k1-identitet-random',
      lesson: 'first-midterm', chapter: 2, category: 'm1CircularFlow',
      type: 'numeric',
      title: 'Štednja, investicije, proračun i NX — vježba',
      prompt: 'Primijenite identitet otvorenog gospodarstva S − I = (G + TR − TA) + NX.',
      difficulty: 2,
      params: {
        S: { min: 400, max: 900, step: 50 },
        bd: { min: -200, max: 200, step: 25 },
        nx: { min: -150, max: 150, step: 25 }
      },
      generate(p) {
        const I = p.S - p.bd - p.nx;
        const bdTxt = p.bd > 0 ? 'budžetski deficit ' + p.bd : (p.bd < 0 ? 'budžetski suficit ' + (-p.bd) : 'uravnotežen proračun');
        const nxTxt = p.nx > 0 ? 'trgovinski suficit ' + p.nx : (p.nx < 0 ? 'trgovinski deficit ' + (-p.nx) : 'izvoz jednak uvozu');
        return {
          prompt: 'U otvorenoj ekonomiji štednja iznosi ' + p.S + ' mlrd EUR, uz ' + bdTxt + ' i ' + nxTxt + ' mlrd EUR. Koliko iznose investicije?',
          fields: [
            { key: 'I', label: 'Investicije I (mlrd EUR)', answer: I, tol: 0.01, unit: '', hint: 'deficit → (G + TR − TA) > 0; suficit → < 0' }
          ],
          solution: [
            'G + TR − TA = ' + fmt(p.bd, 0) + ' (' + (p.bd > 0 ? 'deficit' : p.bd < 0 ? 'suficit' : 'ravnoteža') + '), NX = ' + fmt(p.nx, 0) + '.',
            p.S + ' − I = ' + fmt(p.bd, 0) + ' + (' + fmt(p.nx, 0) + ') → I = ' + I + ' mlrd EUR.',
            'Proračunski deficit i trgovinski suficit „troše” domaću štednju; suficit proračuna i trgovinski deficit oslobađaju je za investicije.'
          ]
        };
      },
      solution: ['S − I = (G + TR − TA) + NX.']
    },

    {
      id: 'k1-tri-pristupa',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'Tri pristupa BDP-u (Predavanje 2, zad. 6–7)',
      prompt: 'Zad. 6 (mil. €): C = 500, I = 150, G = 200, izvoz 120, uvoz 100; plaće 520, profiti 250, rente i kamate 80, porezi na proizvodnju 40, subvencije 20. '
        + 'Zad. 7 (mil. €): proizvodnja / međufazna potrošnja — industrija 300/150, trgovina 500/250, usluge 800/450; porezi na proizvode 120, subvencije 20.',
      difficulty: 1,
      fields: [
        { key: 'rash', label: 'Zad. 6: BDP rashodnim pristupom', answer: 870, tol: 0.01, unit: 'mil. €', hint: 'C + I + G + (E − U)' },
        { key: 'doh', label: 'Zad. 6: BDP dohodovnim pristupom', answer: 870, tol: 0.01, unit: 'mil. €', hint: 'plaće + profiti + rente i kamate + (porezi − subvencije)' },
        { key: 'dv', label: 'Zad. 7: zbroj bruto dodanih vrijednosti', answer: 750, tol: 0.01, unit: 'mil. €', hint: '(300−150) + (500−250) + (800−450)' },
        { key: 'proiz', label: 'Zad. 7: BDP proizvodnim pristupom', answer: 850, tol: 0.01, unit: 'mil. €', hint: 'dodana vrijednost + porezi − subvencije' }
      ],
      solution: [
        'Rashodni: 500 + 150 + 200 + (120 − 100) = 870. Dohodovni: 520 + 250 + 80 + (40 − 20) = 870 — isti rezultat.',
        'Proizvodni: dodana vrijednost = 150 + 250 + 350 = 750; BDP = 750 + 120 − 20 = 850.',
        'Sva tri pristupa za isto gospodarstvo daju isti BDP (ukupna proizvodnja = ukupna potrošnja = ukupni dohodak).'
      ]
    },

    {
      id: 'k1-proizvodni-random',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'Proizvodni pristup — vježba',
      prompt: 'BDP = Σ(proizvodnja − međufazna potrošnja) + porezi na proizvode − subvencije.',
      difficulty: 1,
      params: {
        o1: { min: 200, max: 600, step: 50 }, s1: { choices: [0.4, 0.5, 0.6] },
        o2: { min: 300, max: 800, step: 50 }, s2: { choices: [0.4, 0.5, 0.6] },
        o3: { min: 400, max: 1000, step: 50 }, s3: { choices: [0.3, 0.4, 0.5] },
        tx: { min: 60, max: 200, step: 10 }, sb: { min: 10, max: 50, step: 5 }
      },
      generate(p) {
        p = Object.assign({}, p);
        for (let i = 0; i < 60; i++) {
          const v3 = p.o3 - Math.round(p.o3 * p.s3);
          const all = (p.o1 - Math.round(p.o1 * p.s1)) + (p.o2 - Math.round(p.o2 * p.s2)) + v3;
          if (ok3(v3 / all * 100)) break;
          p.o1 += 50;
        }
        const m1 = Math.round(p.o1 * p.s1), m2 = Math.round(p.o2 * p.s2), m3 = Math.round(p.o3 * p.s3);
        const dv = (p.o1 - m1) + (p.o2 - m2) + (p.o3 - m3);
        const Y = dv + p.tx - p.sb;
        return {
          prompt: 'Podaci (mil. €), proizvodnja / međufazna potrošnja: industrija ' + p.o1 + '/' + m1 + ', trgovina ' + p.o2 + '/' + m2 + ', usluge '
            + p.o3 + '/' + m3 + '. Porezi na proizvode ' + p.tx + ', subvencije ' + p.sb + '. Izračunajte ukupnu bruto dodanu vrijednost, BDP i udio usluga u dodanoj vrijednosti (2 decimale).',
          fields: [
            { key: 'dv', label: 'Bruto dodana vrijednost (mil. €)', answer: dv, tol: 0.01, unit: '', hint: 'Σ (proizvodnja − međufazna)' },
            { key: 'y', label: 'BDP (mil. €)', answer: Y, tol: 0.01, unit: '', hint: 'BDV + porezi − subvencije' },
            { key: 'sh', label: 'Udio usluga u BDV', answer: r2((p.o3 - m3) / dv * 100), tol: 0.01, unit: '%', hint: 'dio/cjelina · 100' }
          ],
          solution: [
            'Dodane vrijednosti: ' + (p.o1 - m1) + ' + ' + (p.o2 - m2) + ' + ' + (p.o3 - m3) + ' = ' + dv + ' mil. €.',
            'BDP = ' + dv + ' + ' + p.tx + ' − ' + p.sb + ' = ' + Y + ' mil. €.',
            'Udio usluga = ' + (p.o3 - m3) + '/' + dv + ' · 100 = ' + fmt((p.o3 - m3) / dv * 100) + ' %. Međufazna potrošnja se oduzima da se izbjegne dvostruko brojanje.'
          ]
        };
      },
      solution: ['BDP (proizvodni) = bruto vrijednost proizvodnje − međufazna potrošnja + porezi na proizvode − subvencije.']
    },

    {
      id: 'k1-dodana-vrijednost',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'Finalni proizvodi, dodana vrijednost, dohodak (M2, zad. 2)',
      prompt: 'Tvornica plaća radnicima 10 mil. EUR za sklapanje 5 000 automobila i prodaje ih trgovini za 12 mil. EUR. Trgovina plaća prodavačima 1 mil. EUR i prodaje automobile potrošačima za 15 mil. EUR. '
        + 'Izračunajte BDP metodom finalnih proizvoda, dodanu vrijednost po fazama, ukupne plaće i profite (mil. EUR).',
      difficulty: 2,
      fields: [
        { key: 'fin', label: 'BDP — metoda finalnih proizvoda', answer: 15, tol: 0.01, unit: '', hint: 'samo prodaja krajnjim potrošačima' },
        { key: 'dv1', label: 'Dodana vrijednost tvornice', answer: 12, tol: 0.01, unit: '', hint: 'nema međuproizvoda → cijela prodaja' },
        { key: 'dv2', label: 'Dodana vrijednost trgovine', answer: 3, tol: 0.01, unit: '', hint: '15 − 12' },
        { key: 'w', label: 'Ukupne plaće', answer: 11, tol: 0.01, unit: '', hint: '10 + 1' },
        { key: 'pr', label: 'Ukupni profiti', answer: 4, tol: 0.01, unit: '', hint: '(12 − 10) + (15 − 12 − 1)' }
      ],
      solution: [
        'Finalni proizvod: automobili prodani potrošačima → BDP = 15.',
        'Dodana vrijednost: tvornica 12 − 0 = 12; trgovina 15 − 12 = 3 → ukupno 15.',
        'Dohodovno: plaće 10 + 1 = 11; profiti tvornice 12 − 10 = 2, trgovine 15 − 12 − 1 = 2 → profiti 4; BDP = 11 + 4 = 15. Sva tri pristupa daju isto.'
      ]
    },

    {
      id: 'k1-bdp-transakcije',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'choice',
      title: 'Što ulazi u BDP? (M2, zad. 1)',
      prompt: 'Mjerite godišnji BDP SAD-a zbrajanjem vrijednosti FINALNIH dobara i usluga. Kako svaka transakcija utječe na BDP SAD-a?',
      difficulty: 2,
      items: [
        { q: 'Restoran kupuje ribu od ribara za 100 USD.', kind: 'mc', options: ['BDP raste za 100 USD', 'ne ulazi izravno — riba je međuproizvod (ulazi kroz cijenu večere)', 'BDP pada za 100 USD'], answer: 1 },
        { q: 'Obitelj plati 100 USD za riblju večeru u restoranu.', kind: 'mc', options: ['BDP raste za 100 USD (osobna potrošnja C)', 'ne utječe na BDP', 'BDP raste za 200 USD'], answer: 0 },
        { q: 'China Airlines kupi zrakoplov C919 proizveden u Kini za 9,5 mlrd USD.', kind: 'mc', options: ['BDP SAD-a raste za 9,5 mlrd USD', 'ne utječe na BDP SAD-a', 'BDP SAD-a pada za 9,5 mlrd USD'], answer: 1 },
        { q: 'Američki avioprijevoznik kupi novi Boeing proizveden u SAD-u za 200 mil. USD.', kind: 'mc', options: ['BDP raste za 200 mil. USD (investicije I)', 'ne utječe na BDP', 'BDP pada za 200 mil. USD'], answer: 0 },
        { q: 'Europski prijevoznik proda jedan svoj (rabljeni) Airbus američkoj privatnoj tvrtki za 100 mil. EUR.', kind: 'mc', options: ['BDP SAD-a raste za 100 mil. EUR', 'ne utječe na BDP SAD-a — nije nova proizvodnja', 'BDP SAD-a pada za 100 mil. EUR'], answer: 1 },
        { q: 'Proizvodi koji su proizvedeni, a nisu prodani (zalihe) ulaze u BDP.', kind: 'tf', answer: true },
        { q: 'Turizam je zasebna djelatnost u Nacionalnoj klasifikaciji djelatnosti (NKD).', kind: 'tf', answer: false }
      ],
      solution: [
        'Međuproizvodi se ne zbrajaju zasebno (dvostruko brojanje) — vrijednost ribe sadržana je u cijeni večere.',
        'Kineski zrakoplov je kineska proizvodnja; rabljeni zrakoplov nije nova proizvodnja ove godine (kupnja postojeće imovine).',
        'Neprodane zalihe računaju se kao investicije u zalihe. Turizam nema svoju djelatnost u NKD-u — prisutan je u nizu djelatnosti (najviše I: smještaj i hrana).'
      ]
    },

    {
      id: 'k1-agregati-pojmovi',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'choice',
      title: 'BDP, BNP, NDP i proračun — kolokvijska pitanja',
      prompt: 'Priprema za 1. kolokvij, primjeri 8–13. Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'BDP prema potrošnoj metodi je zbroj svih izdataka za robe i usluge svih sektora potrošnje.', kind: 'tf', answer: true },
        { q: 'Ako se (uz ostalo nepromijenjeno) poveća uvoz, BDP prema potrošnoj metodi se smanjuje.', kind: 'tf', answer: true },
        { q: 'Ako se poveća potrošnja države, BDP prema potrošnoj metodi se smanjuje.', kind: 'tf', answer: false },
        { q: 'Uz recesijski BDP jaz poželjni su veća potrošnja države, veća potrošnja stanovništva i vanjskotrgovinski suficit.', kind: 'tf', answer: true },
        { q: 'BNP je BDP uvećan za primitke naših građana i tvrtki iz inozemstva i umanjen za isplate stranim građanima i tvrtkama.', kind: 'tf', answer: true },
        { q: 'Zemlja s velikim udjelom inozemnih ulaganja (dohodci odlaze strancima) može očekivati da je BNP manji od BDP-a.', kind: 'tf', answer: true },
        { q: 'Profiti korporacija dio su BDP-a po PROIZVODNOJ metodi.', kind: 'tf', answer: false },
        { q: 'Kad je T − (G + TR) pozitivno, proračun je u suficitu.', kind: 'tf', answer: true },
        { q: 'Porezi i transferi su proračunski prihodi.', kind: 'tf', answer: false },
        { q: 'Model makroekonomske ravnoteže uvijek glasi S = I.', kind: 'tf', answer: false },
        { q: 'Odnos BDP-a i NDP-a:', kind: 'mc', options: ['BDP je veći od NDP-a (NDP = BDP − amortizacija)', 'BDP je manji od NDP-a', 'BDP i NDP su uvijek jednaki'], answer: 0 }
      ],
      solution: [
        'Profiti su DOHODAK → dohodovna metoda. Transferi su proračunski RASHODI (zato G + TR).',
        'S = I vrijedi samo u dvosektorskom modelu; u trosektorskom S − I = G + TR − T, u četverosektorskom S − I = (G + TR − T) + NX.',
        'NDP = BDP − amortizacija → BDP je uvijek veći od NDP-a.'
      ]
    },

    {
      id: 'k1-agregati-random',
      lesson: 'first-midterm', chapter: 2, category: 'm1NationalAccounts',
      type: 'numeric',
      title: 'Od BDP-a do nacionalnog dohotka — vježba',
      prompt: 'BNP = BDP + primici − isplate faktorskih dohodaka; NDP = BDP − amortizacija; NNP = BNP − amortizacija; NI = NNP − neizravni poslovni porezi.',
      difficulty: 2,
      params: {
        Y: { min: 1000, max: 3000, step: 50 },
        pr: { min: 20, max: 150, step: 5 },
        is: { min: 20, max: 150, step: 5 },
        am: { min: 80, max: 300, step: 10 },
        np: { min: 60, max: 250, step: 10 }
      },
      generate(p) {
        const bnp = p.Y + p.pr - p.is, ndp = p.Y - p.am, nnp = bnp - p.am, ni = nnp - p.np;
        return {
          prompt: 'BDP iznosi ' + fmt(p.Y, 0) + ' mlrd EUR. Primici faktorskih dohodaka iz inozemstva ' + p.pr + ', isplate faktorskih dohodaka inozemstvu '
            + p.is + ', amortizacija ' + p.am + ', neizravni poslovni porezi (npr. PDV) ' + p.np + ' mlrd EUR. Izračunajte BNP, NDP, NNP i nacionalni dohodak NI.',
          fields: [
            { key: 'bnp', label: 'BNP', answer: bnp, tol: 0.01, unit: '', hint: 'BDP + primici − isplate' },
            { key: 'ndp', label: 'NDP', answer: ndp, tol: 0.01, unit: '', hint: 'BDP − amortizacija' },
            { key: 'nnp', label: 'NNP', answer: nnp, tol: 0.01, unit: '', hint: 'BNP − amortizacija' },
            { key: 'ni', label: 'Nacionalni dohodak NI', answer: ni, tol: 0.01, unit: '', hint: 'NNP − neizravni poslovni porezi' }
          ],
          solution: [
            'BNP = ' + fmt(p.Y, 0) + ' + ' + p.pr + ' − ' + p.is + ' = ' + fmt(bnp, 0) + (p.pr > p.is ? ' (> BDP: više primamo iz inozemstva nego isplaćujemo).' : (p.pr < p.is ? ' (< BDP: više dohodaka odlazi u inozemstvo).' : ' (= BDP).')),
            'NDP = ' + fmt(p.Y, 0) + ' − ' + p.am + ' = ' + fmt(ndp, 0) + '; NNP = ' + fmt(bnp, 0) + ' − ' + p.am + ' = ' + fmt(nnp, 0) + '.',
            'NI = ' + fmt(nnp, 0) + ' − ' + p.np + ' = ' + fmt(ni, 0) + '. (Obrnuto: NI + neizravni porezi = NNP; NNP + amortizacija = BNP.)'
          ]
        };
      },
      solution: ['BNP = BDP + neto faktorski dohodak iz inozemstva; „neto” agregati = bruto − amortizacija.']
    },

    {
      id: 'k1-curenja-ubrizgavanja',
      lesson: 'first-midterm', chapter: 2, category: 'm1CircularFlow',
      type: 'numeric',
      title: 'Curenja = ubrizgavanja (četverosektorski model)',
      prompt: 'Ravnoteža otvorenog gospodarstva (Priprema za 1. kolokvij): S + T + U = I + G + TR + E.',
      difficulty: 2,
      params: {
        S: { min: 200, max: 500, step: 10 },
        T: { min: 250, max: 500, step: 10 },
        U: { min: 150, max: 400, step: 10 },
        I: { min: 150, max: 350, step: 10 },
        G: { min: 150, max: 350, step: 10 },
        TR: { min: 20, max: 100, step: 10 }
      },
      generate(p) {
        let S = p.S;
        let E = S + p.T + p.U - p.I - p.G - p.TR;
        if (E < 50) { S = S + (50 - E) + 50; E = S + p.T + p.U - p.I - p.G - p.TR; }
        const leak = S + p.T + p.U;
        return {
          prompt: 'Štednja iznosi ' + S + ', porezi ' + p.T + ', uvoz ' + p.U + ', investicije ' + p.I + ', javna potrošnja ' + p.G + ', transferi ' + p.TR
            + ' mlrd EUR. Uz makroekonomsku ravnotežu izračunajte ukupna curenja i izvoz.',
          fields: [
            { key: 'leak', label: 'Ukupna curenja S + T + U', answer: leak, tol: 0.01, unit: '', hint: 'gubici iz toka' },
            { key: 'E', label: 'Izvoz E', answer: E, tol: 0.01, unit: '', hint: 'E = S + T + U − I − G − TR' }
          ],
          solution: [
            'Curenja (gubici iz toka): S + T + U = ' + S + ' + ' + p.T + ' + ' + p.U + ' = ' + leak + '.',
            'Ubrizgavanja (dodaci toku): I + G + TR + E. U ravnoteži su jednaki → E = ' + leak + ' − ' + p.I + ' − ' + p.G + ' − ' + p.TR + ' = ' + E + ' mlrd EUR.'
          ]
        };
      },
      solution: ['S + T + U = I + G + TR + E (curenja = ubrizgavanja).']
    },

    // =====================================================================
    // PREDAVANJE 3 — AGREGATNA POTRAŽNJA I PONUDA, AD–AS MODEL (first-midterm)
    // =====================================================================
    {
      id: 'k1-adas-vj3-a',
      lesson: 'first-midterm', chapter: 3, category: 'm1AdAs',
      type: 'choice',
      title: 'AD–AS model: pomaci (Vježba 3, pit. 1–5)',
      prompt: 'Odaberite točan odgovor. Tri dijela AS krivulje: keynesov (vodoravan, savršeno elastičan), neoklasični (rastući) i klasični (okomit, savršeno neelastičan).',
      difficulty: 2,
      items: [
        { q: '1. Sjecište AD i AS u KLASIČNOM dijelu AS; kako djeluje povećanje osobne potrošnje?', kind: 'mc', options: ['AD se pomiče udesno i opća razina cijena raste', 'AD se pomiče ulijevo i opća razina cijena pada', 'AD se pomiče udesno, rastu i proizvodnja i cijene', 'AS se pomiče ulijevo, rastu proizvodnja i cijene'], answer: 0 },
        { q: '2. Sjecište u NEOKLASIČNOM dijelu AS; kako djeluje smanjenje investicija?', kind: 'mc', options: ['AD se pomiče udesno i razina cijena raste', 'AD se pomiče ulijevo, padaju i proizvodnja i cijene', 'AD se pomiče udesno, rastu proizvodnja i cijene', 'AD se pomiče ulijevo, proizvodnja pada, a cijene rastu'], answer: 1 },
        { q: '3. Sjecište u KEYNESOVOM dijelu AS; kako djeluje povećanje izvoza?', kind: 'mc', options: ['AD se pomiče udesno i razina cijena raste', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i razina proizvodnje raste (cijene iste)', 'AD se pomiče ulijevo i proizvodnja pada'], answer: 2 },
        { q: '4. Sjecište u KEYNESOVOM dijelu AS; kako djeluje restriktivna monetarna politika?', kind: 'mc', options: ['AD se pomiče udesno i razina cijena raste', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i proizvodnja raste', 'AD se pomiče ulijevo i razina proizvodnje pada (cijene iste)'], answer: 3 },
        { q: '5. Sjecište u KLASIČNOM dijelu AS; kako djeluje povećanje količine novca?', kind: 'mc', options: ['AD se pomiče udesno, cijene rastu, proizvodnja pada', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i opća razina cijena raste (Y isti)', 'AD se pomiče ulijevo i opća razina cijena pada'], answer: 2 }
      ],
      solution: [
        'Klasični (okomiti) dio: puna zaposlenost → pomak AD mijenja SAMO cijene, Y ostaje isti.',
        'Keynesov (vodoravni) dio: neiskorišteni resursi → pomak AD mijenja SAMO proizvodnju, cijene ostaju iste.',
        'Neoklasični (rastući) dio: pomak AD mijenja i proizvodnju i cijene u istom smjeru.'
      ]
    },

    {
      id: 'k1-adas-vj3-b',
      lesson: 'first-midterm', chapter: 3, category: 'm1AdAs',
      type: 'choice',
      title: 'AD–AS model: pomaci (Vježba 3, pit. 6–9)',
      prompt: 'Odaberite točan odgovor.',
      difficulty: 2,
      items: [
        { q: '6. Sjecište u KEYNESOVOM dijelu AS; kako djeluje povećanje dohodaka?', kind: 'mc', options: ['AD se pomiče udesno i razina cijena raste', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i razina proizvodnje raste', 'AD se pomiče ulijevo i proizvodnja pada'], answer: 2 },
        { q: '7. Sjecište u KLASIČNOM dijelu AS; kako djeluje deprecijacija tečaja domaće valute?', kind: 'mc', options: ['AD se pomiče udesno, cijene rastu, proizvodnja pada', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i opća razina cijena raste', 'AD se pomiče ulijevo i opća razina cijena pada'], answer: 2 },
        { q: '8. Sjecište u NEELASTIČNOM dijelu AS; kako djeluje aprecijacija tečaja domaće valute?', kind: 'mc', options: ['AD se pomiče udesno, cijene rastu, proizvodnja pada', 'AD se pomiče ulijevo, padaju proizvodnja i cijene', 'AD se pomiče udesno i proizvodnja raste', 'AD se pomiče ulijevo, opća razina cijena pada, proizvodnja ostaje ista'], answer: 3 },
        { q: '9. Sjecište u RASTUĆEM dijelu AS; kako djeluje povećanje kamatne stope?', kind: 'mc', options: ['AD se pomiče udesno i razina cijena raste', 'AD se pomiče ulijevo, padaju i proizvodnja i cijene', 'AD se pomiče udesno i opća razina cijena raste', 'AD se pomiče ulijevo, cijene padaju, proizvodnja ista'], answer: 1 },
        { q: 'Povećanje cijene energije u AD–AS modelu primarno:', kind: 'mc', options: ['pomiče AD udesno', 'pomiče AS udesno', 'pomiče AS ulijevo i smanjuje BDP i blagostanje', 'pomiče AD ulijevo'], answer: 2 }
      ],
      solution: [
        'Deprecijacija potiče izvoz → AD udesno; aprecijacija potiče uvoz → AD ulijevo. U okomitom dijelu mijenjaju se samo cijene.',
        'Viši kamatnjak smanjuje investicije → AD ulijevo → u rastućem dijelu padaju i Y i P.',
        'Skuplja energija = viši troškovi → AS ulijevo (Priprema 1, primjer 17-1).'
      ]
    },

    {
      id: 'k1-ad-pomaci',
      lesson: 'first-midterm', chapter: 3, category: 'm1AdAs',
      type: 'choice',
      title: 'Što pomiče krivulju AD?',
      prompt: 'Vježba 3 (tablica mjera) i Priprema za 1. kolokvij, primjeri 14–15. Točno ili netočno?',
      difficulty: 1,
      items: [
        { q: 'Promjena domaćih cijena uzrokuje kretanje DUŽ krivulje AD, a ne njezin pomak.', kind: 'tf', answer: true },
        { q: 'Smanjenje realne novčane mase M/P pomiče AD ulijevo.', kind: 'tf', answer: true },
        { q: 'Smanjenje realne novčane mase pozitivna je odluka ako je u privredi inflacijski BDP jaz.', kind: 'tf', answer: true },
        { q: 'Ekspanzivna fiskalna politika pomiče AD ulijevo.', kind: 'tf', answer: false },
        { q: 'Ekspanzivna fiskalna politika pozitivna je odluka ako je u privredi recesijski BDP jaz.', kind: 'tf', answer: true },
        { q: 'Deprecijacija domaće valute povećava izvoz i pomiče AD udesno.', kind: 'tf', answer: true },
        { q: 'Aprecijacija (revalvacija) domaće valute ekspanzivna je vanjskotrgovinska mjera.', kind: 'tf', answer: false },
        { q: 'Očekivanje rasta cijena kratkoročno povećava AD.', kind: 'tf', answer: true },
        { q: 'Krivulja AD je opadajuća jer:', kind: 'mc', options: ['uz niže cijene raste realna novčana masa, pada kamatnjak i raste potražnja (i izvoz)', 'uz niže cijene poduzeća proizvode više', 'tako propisuje država', 'uz niže cijene rastu porezi'], answer: 0 }
      ],
      solution: [
        'Pomak AD: G, T, M/P, kamatnjak, tečaj, odnos domaćih i inozemnih cijena, očekivanja. Promjena opće razine domaćih cijena = kretanje duž krivulje.',
        '⚠ Vježba 3 (sl. 4) navodi „ekspanzivna vanjskotrgovinska politika = rast tečaja R” — u konvenciji kolegija rast tečaja = aprecijacija, koja je RESTRIKTIVNA; ekspanzivna je deprecijacija (pad tečaja), kako piše i ostatak iste stranice.'
      ]
    },

    {
      id: 'k1-as-oblici',
      lesson: 'first-midterm', chapter: 3, category: 'm1AdAs',
      type: 'choice',
      title: 'Tri oblika krivulje AS',
      prompt: 'Vježba 3 (sl. 5–6) i Priprema za 1. kolokvij, primjeri 16–17. Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'Klasična (okomita) AS je savršeno neelastična — uz promjenu cijena BDP ostaje isti (puna zaposlenost).', kind: 'tf', answer: true },
        { q: 'Keynesova (vodoravna) AS je savršeno elastična i karakteristična za nerazvijene ekonomije s neiskorištenim resursima.', kind: 'tf', answer: true },
        { q: 'Neoklasična AS je rastuća i vrijedi za najveći broj gospodarstava.', kind: 'tf', answer: true },
        { q: 'Rast troškova proizvodnje pomiče AS udesno.', kind: 'tf', answer: false },
        { q: 'Ravnoteža u savršeno elastičnom dijelu AS: povećanje AD povećava BDP uz iste cijene.', kind: 'tf', answer: true },
        { q: 'Ravnoteža u savršeno elastičnom dijelu AS: povećanje AD je neefikasna ekonomska politika.', kind: 'tf', answer: false },
        { q: 'Ravnoteža u savršeno neelastičnom dijelu AS: povećanje kamatne stope smanjuje AD i cijene, a BDP ostaje isti.', kind: 'tf', answer: true },
        { q: 'Ravnoteža u savršeno neelastičnom dijelu AS: povećanje kamatne stope smanjuje BDP.', kind: 'tf', answer: false },
        { q: 'Kako izgleda krivulja AS kod elastičnosti E = 0?', kind: 'mc', options: ['okomita (klasična)', 'vodoravna (keynesova)', 'rastuća (neoklasična)', 'opadajuća'], answer: 0 }
      ],
      solution: [
        'E = ∞: vodoravna AS — i mali rast cijena snažno povećava ponudu. E > 0: rastuća AS. E = 0: okomita AS — proizvodnja fiksna na punoj zaposlenosti.',
        'Rast troškova → AS ulijevo (restriktivno, pad BDP-a).'
      ]
    },

    // =====================================================================
    // PREDAVANJE 4 — POTROŠNJA, ŠTEDNJA I INVESTICIJE (first-midterm)
    // =====================================================================
    {
      id: 'k1-potrosnja-vj4-z1',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Funkcija potrošnje i štednje (Vježba 4, zad. 1)',
      prompt: 'Zadana je funkcija potrošnje C = 60 + 0,80·Y u modelu Y = C + I. Izračunajte graničnu sklonost potrošnji i štednji, nagib i slobodni član funkcije štednje te prosječnu sklonost štednji uz Y = 300 i Y = 500 (slobodni član upišite kao iznos, bez predznaka).',
      difficulty: 1,
      fields: [
        { key: 'b', label: 'Granična sklonost potrošnji β', answer: 0.8, tol: 0.001, unit: '', hint: 'koeficijent uz Y' },
        { key: 's', label: 'Granična sklonost štednji 1 − β', answer: 0.2, tol: 0.001, unit: '', hint: '1 − 0,8' },
        { key: 'a', label: 'Iznos slobodnog člana funkcije štednje |−α|', answer: 60, tol: 0.01, unit: '', hint: 'S = Y − C = −60 + 0,2Y' },
        { key: 'aps300', label: 'Prosječna sklonost štednji uz Y = 300', answer: 0, tol: 0.001, unit: '', hint: '(0,2·300 − 60)/300' },
        { key: 'aps500', label: 'Prosječna sklonost štednji uz Y = 500', answer: 0.08, tol: 0.001, unit: '', hint: '(0,2·500 − 60)/500' }
      ],
      solution: [
        'β = 0,80 → 80 % dodatne jedinice dohotka se potroši; 1 − β = 0,20 → 20 % se uštedi.',
        'U modelu Y = C + I vrijedi S = I i S = Y − C = Y − 60 − 0,8Y → S = 0,2Y − 60.',
        'S/Y uz Y = 300: (60 − 60)/300 = 0; uz Y = 500: (100 − 60)/500 = 0,08.'
      ]
    },

    {
      id: 'k1-reducirani-oblik-vj4-z2',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Reducirani oblik i inflacijski jaz (Vježba 4, zad. 2)',
      prompt: 'C = 80 + 0,8·Y u modelu Y = C + I. Izrazite Y i C u reduciranom obliku (Y = a + m·I, C = c + n·I), izračunajte multiplikator, Y i C uz I = 500 te potrebnu promjenu investicija ako je potencijalni proizvod 900.',
      difficulty: 2,
      fields: [
        { key: 'ya', label: 'Slobodni član u Y = a + m·I', answer: 400, tol: 0.01, unit: '', hint: '0,2Y = 80 + I' },
        { key: 'm', label: 'Investicijski multiplikator', answer: 5, tol: 0.001, unit: '', hint: '1/(1 − 0,8)' },
        { key: 'cn', label: 'Koeficijent uz I u C = c + n·I', answer: 4, tol: 0.001, unit: '', hint: 'C = 80 + 0,8(400 + 5I)' },
        { key: 'Y', label: 'Y uz I = 500', answer: 2900, tol: 0.01, unit: '', hint: '400 + 5·500' },
        { key: 'C', label: 'C uz I = 500', answer: 2400, tol: 0.01, unit: '', hint: '400 + 4·500' },
        { key: 'dI', label: 'Za koliko treba SMANJITI investicije (iznos)', answer: 400, tol: 0.01, unit: '', hint: '(2 900 − 900)/5' }
      ],
      solution: [
        'Y = 80 + 0,8Y + I → 0,2Y = 80 + I → Y = 400 + 5I; C = 80 + 0,8(400 + 5I) = 400 + 4I.',
        'Multiplikator 1/(1 − β) = 5: jedinično povećanje I povećava Y za 5 jedinica.',
        'Uz I = 500: Y = 2 900, C = 2 400. Potencijalni 900 < ravnotežni 2 900 → INFLACIJSKI jaz 2 000 → ΔI = 2 000/5 = 400 → investicije SMANJITI za 400.'
      ]
    },

    {
      id: 'k1-potrosnja-vj4-z3',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Pokazatelji potrošnje i štednje (Vježba 4, zad. 3)',
      prompt: 'Model Y = C + I, C = 10 + 0,9·Y. Uz dohodak 1 000 izračunajte prosječnu sklonost potrošnji, elastičnost potrošnje, prosječnu sklonost štednji i elastičnost štednje (2 decimale); zatim multiplikator, Y uz I = 500 i potrebnu promjenu I uz potencijalni proizvod 5 500.',
      difficulty: 2,
      fields: [
        { key: 'apc', label: 'Prosječna sklonost potrošnji C/Y', answer: 0.91, tol: 0.001, unit: '', hint: '(10 + 900)/1 000' },
        { key: 'ec', label: 'Elastičnost potrošnje na dohodak', answer: r2(0.9 / 0.91), tol: 0.01, unit: '', hint: 'β/(C/Y)' },
        { key: 'aps', label: 'Prosječna sklonost štednji S/Y', answer: 0.09, tol: 0.001, unit: '', hint: '(0,1·1 000 − 10)/1 000' },
        { key: 'es', label: 'Elastičnost štednje na dohodak', answer: r2(0.1 / 0.09), tol: 0.01, unit: '', hint: '(1 − β)/(S/Y)' },
        { key: 'm', label: 'Multiplikator', answer: 10, tol: 0.001, unit: '', hint: '1/(1 − 0,9)' },
        { key: 'Y', label: 'Ravnotežni Y uz I = 500', answer: 5100, tol: 0.01, unit: '', hint: 'Y = 100 + 10·I' },
        { key: 'dI', label: 'Za koliko treba POVEĆATI investicije', answer: 40, tol: 0.01, unit: '', hint: '(5 500 − 5 100)/10' }
      ],
      solution: [
        'C/Y = 0,91; ε(C,Y) = 0,9/0,91 = 0,99 < 1 → neelastično: rast dohotka 1 % povećava potrošnju ≈ 0,99 %.',
        'S = −10 + 0,1Y; S/Y = 0,09; ε(S,Y) = 0,1/0,09 = 1,11.',
        'Multiplikator 10; Y = 100 + 10I = 5 100. Potencijalni 5 500 > 5 100 → RECESIJSKI jaz 400 → povećati I za 400/10 = 40.'
      ]
    },

    {
      id: 'k1-potrosnja-vj4-vjezba',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Zadatak za vježbu (Vježba 4 — nije riješen u izvoru)',
      prompt: 'Model s osobnom i investicijskom potrošnjom: autonomna potrošnja 130, granična sklonost potrošnji 0,80. Izračunajte: C uz Y = 1 200, elastičnost potrošnje uz Y = 1 200, prosječnu sklonost štednji uz Y = 1 000, ravnotežni Y uz I = 300, multiplikator i promjenu I uz potencijalni proizvod 1 500 (2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'c', label: 'C uz Y = 1 200', answer: 1090, tol: 0.01, unit: '', hint: '130 + 0,8·1 200' },
        { key: 'ec', label: 'Elastičnost potrošnje uz Y = 1 200', answer: r2(0.8 / (1090 / 1200)), tol: 0.01, unit: '', hint: '0,8/(1 090/1 200)' },
        { key: 'aps', label: 'S/Y uz Y = 1 000', answer: 0.07, tol: 0.001, unit: '', hint: 'S = −130 + 0,2Y' },
        { key: 'Y', label: 'Ravnotežni Y uz I = 300', answer: 2150, tol: 0.01, unit: '', hint: '(130 + 300)/0,2' },
        { key: 'm', label: 'Multiplikator investicija', answer: 5, tol: 0.001, unit: '', hint: '1/(1 − 0,8)' },
        { key: 'dI', label: 'Za koliko treba SMANJITI investicije', answer: 130, tol: 0.01, unit: '', hint: '(2 150 − 1 500)/5' }
      ],
      solution: [
        'C = 130 + 0,8Y → uz Y = 1 200: C = 1 090; C/Y = 0,9083; ε = 0,8/0,9083 = 0,88 (neelastično).',
        'S = −130 + 0,2Y; uz Y = 1 000: S = 70 → S/Y = 0,07.',
        'Y = (130 + I)/0,2 = 5·(130 + 300) = 2 150; multiplikator 5.',
        'Potencijalni 1 500 < 2 150 → INFLACIJSKI jaz 650 → investicije smanjiti za 650/5 = 130.'
      ]
    },

    {
      id: 'k1-potrosnja-random',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Pokazatelji potrošnje i štednje — vježba',
      prompt: 'Iz funkcije potrošnje C = α + β·Y izračunajte pokazatelje uz zadani dohodak.',
      difficulty: 2,
      params: {
        a: { choices: [20, 40, 50, 60, 80, 100, 120] },
        b: { choices: [0.6, 0.7, 0.75, 0.8, 0.9] },
        Y: { choices: [400, 500, 800, 1000, 1200, 1600, 2000] }
      },
      generate(p) {
        const a = p.a, b = p.b;
        let Y = p.Y;
        while ((1 - b) * Y <= 1.25 * a) Y += 400;
        for (let i = 0; i < 60; i++) {
          const cc = a + b * Y, ss = Y - cc;
          if (ok3(cc, ss, b * Y / cc, (1 - b) * Y / ss)) break;
          Y += 400;
        }
        const C = a + b * Y, S = Y - C;
        const apc = C / Y, aps = S / Y;
        const ec = b / apc, es = (1 - b) / aps;
        return {
          prompt: 'Funkcija potrošnje: C = ' + a + ' + ' + num(b, 2) + '·Y. Uz dohodak Y = ' + fmt(Y, 0) + ' izračunajte C, S, prosječne sklonosti (4 decimale) i elastičnosti potrošnje i štednje (2 decimale; računajte s nezaokruženim prosječnim sklonostima).',
          fields: [
            { key: 'C', label: 'Potrošnja C', answer: r2(C), tol: 0.01, unit: '', hint: a + ' + ' + num(b, 2) + '·' + Y },
            { key: 'S', label: 'Štednja S', answer: r2(S), tol: 0.01, unit: '', hint: 'S = Y − C' },
            { key: 'apc', label: 'Prosječna sklonost potrošnji C/Y', answer: rnd(apc, 4), tol: 0.0006, unit: '', hint: 'C / Y' },
            { key: 'aps', label: 'Prosječna sklonost štednji S/Y', answer: rnd(aps, 4), tol: 0.0006, unit: '', hint: 'S / Y (= 1 − C/Y)' },
            { key: 'ec', label: 'Elastičnost potrošnje na dohodak', answer: r2(ec), tol: 0.01, unit: '', hint: 'β / (C/Y)' },
            { key: 'es', label: 'Elastičnost štednje na dohodak', answer: r2(es), tol: 0.02, unit: '', hint: '(1 − β) / (S/Y)' }
          ],
          solution: [
            'C = ' + a + ' + ' + num(b, 2) + '·' + fmt(Y, 0) + ' = ' + fmt(C) + '; S = Y − C = ' + fmt(S) + ' (funkcija štednje S = −' + a + ' + ' + num(1 - b, 2) + '·Y).',
            'C/Y = ' + num(apc, 4) + '; S/Y = ' + num(aps, 4) + ' (zbroj = 1).',
            'ε(C,Y) = ' + num(b, 2) + '/' + num(apc, 4) + ' = ' + fmt(ec) + (ec < 1 ? ' < 1 → potrošnja neelastična.' : ' ≥ 1 → potrošnja elastična.'),
            'ε(S,Y) = ' + num(1 - b, 2) + '/' + num(aps, 4) + ' = ' + fmt(es) + (es > 1 ? ' > 1 → štednja raste brže od dohotka.' : '.')
          ]
        };
      },
      solution: ['C/Y, S/Y = 1 − C/Y; ε(C,Y) = β/(C/Y); ε(S,Y) = (1 − β)/(S/Y).']
    },

    {
      id: 'k1-ravnoteza-jaz-random',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Ravnotežni proizvod i BDP jaz — vježba',
      prompt: 'Dvosektorski model Y = C + I, C = α + β·Y.',
      difficulty: 2,
      params: {
        a: { min: 40, max: 200, step: 10 },
        b: { choices: [0.6, 0.75, 0.8, 0.9] },
        I: { min: 100, max: 500, step: 50 },
        dI: { min: 10, max: 100, step: 5 },
        dir: { choices: [1, -1] }
      },
      generate(p) {
        const m = 1 / (1 - p.b);
        const Y = (p.a + p.I) * m;
        const C = p.a + p.b * Y;
        const gap = p.dI * m;
        const Yp = Y + p.dir * gap;
        const rec = p.dir > 0;
        return {
          prompt: 'Autonomna potrošnja iznosi ' + p.a + ', granična sklonost potrošnji ' + num(p.b, 2) + ', investicije ' + p.I + ' jedinica. Potencijalni proizvod je '
            + num(Yp, 2) + '. Izračunajte multiplikator, ravnotežni Y, potrošnju C, iznos BDP jaza i za koliko treba promijeniti investicije (iznos).',
          fields: [
            { key: 'm', label: 'Multiplikator 1/(1 − β)', answer: r2(m), tol: 0.01, unit: '', hint: '1/(1 − ' + num(p.b, 2) + ')' },
            { key: 'Y', label: 'Ravnotežni Y', answer: r2(Y), tol: 0.01, unit: '', hint: '(α + I) · multiplikator' },
            { key: 'C', label: 'Potrošnja C', answer: r2(C), tol: 0.01, unit: '', hint: 'α + β·Y (ili Y − I)' },
            { key: 'gap', label: 'Iznos BDP jaza |Ypot − Y|', answer: r2(gap), tol: 0.01, unit: '', hint: 'razlika potencijalnog i ravnotežnog' },
            { key: 'dI', label: 'Potrebna promjena investicija (iznos)', answer: p.dI, tol: 0.01, unit: '', hint: 'jaz / multiplikator' }
          ],
          solution: [
            'Multiplikator = 1/(1 − ' + num(p.b, 2) + ') = ' + num(m, 2) + '; Y = (' + p.a + ' + ' + p.I + ') · ' + num(m, 2) + ' = ' + fmt(Y) + '; C = Y − I = ' + fmt(C) + '.',
            rec ? 'Ypot = ' + num(Yp, 2) + ' > Y → RECESIJSKI jaz ' + fmt(gap) + ' → investicije POVEĆATI za ' + fmt(gap) + '/' + num(m, 2) + ' = ' + p.dI + '.'
              : 'Ypot = ' + num(Yp, 2) + ' < Y → INFLACIJSKI jaz ' + fmt(gap) + ' → investicije SMANJITI za ' + fmt(gap) + '/' + num(m, 2) + ' = ' + p.dI + '.',
            'Cilj je izjednačiti ravnotežni i potencijalni proizvod (ΔY = multiplikator · ΔI).'
          ]
        };
      },
      solution: ['Y = (α + I)/(1 − β); ΔI = jaz/multiplikator; Ypot > Y recesijski, Ypot < Y inflacijski jaz.']
    },

    {
      id: 'k1-mpc-iz-promjena',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'numeric',
      title: 'Granična sklonost iz promjena — vježba',
      prompt: 'Granična sklonost potrošnji = ΔC/ΔY: koliko se od dodatne jedinice dohotka potroši.',
      difficulty: 1,
      params: {
        Y0: { min: 800, max: 2000, step: 100 },
        dY: { choices: [100, 200, 250, 400, 500] },
        b: { choices: [0.6, 0.7, 0.75, 0.8, 0.9] },
        a: { min: 20, max: 150, step: 10 },
        dI: { min: 10, max: 60, step: 10 }
      },
      generate(p) {
        const C0 = p.a + p.b * p.Y0, Y1 = p.Y0 + p.dY, C1 = p.a + p.b * Y1;
        const m = 1 / (1 - p.b);
        return {
          prompt: 'Kad dohodak poraste s ' + fmt(p.Y0, 0) + ' na ' + fmt(Y1, 0) + ', potrošnja poraste s ' + num(C0, 2) + ' na ' + num(C1, 2)
            + '. Izračunajte graničnu sklonost potrošnji, graničnu sklonost štednji, multiplikator i porast BDP-a ako investicije porastu za ' + p.dI + '.',
          fields: [
            { key: 'b', label: 'Granična sklonost potrošnji β', answer: p.b, tol: 0.001, unit: '', hint: 'ΔC / ΔY' },
            { key: 's', label: 'Granična sklonost štednji 1 − β', answer: r2(1 - p.b), tol: 0.001, unit: '', hint: '1 − β' },
            { key: 'm', label: 'Multiplikator', answer: r2(m), tol: 0.01, unit: '', hint: '1/(1 − β)' },
            { key: 'dY', label: 'Porast BDP-a', answer: r2(m * p.dI), tol: 0.02, unit: '', hint: 'multiplikator · ΔI' }
          ],
          solution: [
            'β = ΔC/ΔY = ' + num(p.b * p.dY, 2) + '/' + p.dY + ' = ' + num(p.b, 2) + '; 1 − β = ' + num(1 - p.b, 2) + '.',
            'Multiplikator = 1/' + num(1 - p.b, 2) + ' = ' + num(m, 2) + ' → ΔY = ' + num(m, 2) + ' · ' + p.dI + ' = ' + fmt(m * p.dI) + '.',
            'Veća granična sklonost potrošnji → veći multiplikator (poželjno kolegiju).'
          ]
        };
      },
      solution: ['β = ΔC/ΔY; multiplikator = 1/(1 − β); ΔY = multiplikator · ΔI.']
    },

    {
      id: 'k1-multiplikator-pojmovi',
      lesson: 'first-midterm', chapter: 4, category: 'm1ConsumptionSaving',
      type: 'choice',
      title: 'Sklonosti, elastičnost i multiplikator — kolokvijska pitanja',
      prompt: 'Priprema za 1. kolokvij, primjeri 18–21. Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'Uz graničnu sklonost potrošnji 0,75 povećanje dohotka za 1 jedinicu povećava potrošnju za 0,75 jedinica.', kind: 'tf', answer: true },
        { q: 'Uz graničnu sklonost potrošnji 0,75 povećanje dohotka za 1 jedinicu povećava štednju za 0,75 jedinica.', kind: 'tf', answer: false },
        { q: 'Za rast BDP-a povoljnije je da granična sklonost potrošnji iznosi 0,9 nego 0,6.', kind: 'tf', answer: true },
        { q: 'Elastičnost potrošnje na dohodak 2,5 znači da uz rast dohotka 1 % potrošnja raste 2,5 % — odnos je elastičan.', kind: 'tf', answer: true },
        { q: 'Zbroj granične sklonosti potrošnji i granične sklonosti štednji iznosi 0,5.', kind: 'tf', answer: false },
        { q: 'Pozitivno je imati bržu stopu rasta štednje od potrošnje.', kind: 'tf', answer: false },
        { q: 'Što je granična sklonost štednji manja, to je multiplikator veći.', kind: 'tf', answer: true },
        { q: 'Uz multiplikator 5 povećanje investicija za 10 jedinica povećava BDP za 60 jedinica.', kind: 'tf', answer: false },
        { q: 'Uz multiplikator 5 smanjenje investicija za 1 jedinicu smanjuje BDP za 5 jedinica.', kind: 'tf', answer: true },
        { q: 'Uz recesijski BDP jaz pozitivno je da je multiplikator što veći.', kind: 'tf', answer: true },
        { q: 'Uz inflacijski BDP jaz pozitivno je da je multiplikator što manji.', kind: 'tf', answer: true },
        { q: 'Paradoks štednje (u tumačenju kolegija):', kind: 'mc', options: ['veća granična sklonost štednji smanjuje multiplikator, pa iste investicije daju manji dohodak — i u konačnici ne i veću štednju', 'veća štednja uvijek povećava BDP', 'štednja ne ovisi o dohotku', 'veća štednja povećava multiplikator'], answer: 0 }
      ],
      solution: [
        'β + (1 − β) = 1. Multiplikator 1/(1 − β) raste kad β raste, odnosno kad granična sklonost štednji pada.',
        'Multiplikator 5: ΔY = 5 · 10 = 50, ne 60; djeluje u oba smjera.',
        'Kod recesijskog jaza veći multiplikator znači jači učinak ekspanzivnih mjera; kod inflacijskog manji multiplikator ublažava pregrijavanje.'
      ]
    },

    {
      id: 'k1-sadasnja-vrijednost',
      lesson: 'first-midterm', chapter: 4, category: 'm1Investment',
      type: 'numeric',
      title: 'Metoda sadašnje vrijednosti (Predavanje 4)',
      prompt: 'Troškovi investicijskog projekta su 100 000 EUR. Prinosi: nulta godina 10 000, prva 20 000, druga 40 000, treća 50 000 EUR. Kamatna stopa na tržištu je 3,5 %. '
        + 'Izračunajte sadašnju vrijednost prinosa i SV projekta (2 decimale, EUR).',
      difficulty: 2,
      fields: [
        { key: 'pv', label: 'Sadašnja vrijednost prinosa', answer: r2(10000 + 20000 / 1.035 + 40000 / Math.pow(1.035, 2) + 50000 / Math.pow(1.035, 3)), tol: 2, unit: '€', hint: '10 000 + 20 000/1,035 + 40 000/1,035² + 50 000/1,035³' },
        { key: 'sv', label: 'SV projekta (prinosi − troškovi)', answer: r2(10000 + 20000 / 1.035 + 40000 / Math.pow(1.035, 2) + 50000 / Math.pow(1.035, 3) - 100000), tol: 2, unit: '€', hint: '− 100 000' }
      ],
      solution: [
        '\\( SV = R_0 + \\frac{R_1}{1+r} + \\frac{R_2}{(1+r)^2} + \\frac{R_3}{(1+r)^3} - T \\).',
        'SV prinosa = 10 000 + 19 323,67 + 37 340,43 + 45 097,13 = 111 761,23 EUR; SV = 11 761,23 EUR > 0 → projekt je isplativ.',
        '⚠ Izvor navodi 111 762,2 i 11 762 — razlika ≈ 1 EUR zbog zaokruživanja diskontnih faktora (tolerancija 2 EUR prihvaća oba).'
      ]
    },

    {
      id: 'k1-sadasnja-vrijednost-random',
      lesson: 'first-midterm', chapter: 4, category: 'm1Investment',
      type: 'numeric',
      title: 'Sadašnja vrijednost projekta — vježba',
      prompt: 'Procijenite isplativost projekta metodom sadašnje vrijednosti.',
      difficulty: 2,
      params: {
        T: { min: 60000, max: 150000, step: 10000 },
        R0: { choices: [0, 5000, 10000] },
        R1: { min: 10000, max: 50000, step: 5000 },
        R2: { min: 20000, max: 60000, step: 5000 },
        R3: { min: 20000, max: 70000, step: 5000 },
        r: { choices: [2, 3, 3.5, 4, 5, 6] }
      },
      generate(p) {
        const q = 1 + p.r / 100;
        const d1 = p.R1 / q, d2 = p.R2 / (q * q), d3 = p.R3 / (q * q * q);
        const pv = p.R0 + d1 + d2 + d3;
        const sv = pv - p.T;
        return {
          prompt: 'Troškovi projekta: ' + fmt(p.T, 0) + ' EUR. Prinosi: 0. godina ' + fmt(p.R0, 0) + ', 1. godina ' + fmt(p.R1, 0) + ', 2. godina ' + fmt(p.R2, 0)
            + ', 3. godina ' + fmt(p.R3, 0) + ' EUR. Kamatna stopa ' + num(p.r, 1) + ' %. Izračunajte sadašnju vrijednost prinosa i iznos SV projekta (|prinosi − troškovi|), 2 decimale.',
          fields: [
            { key: 'pv', label: 'Sadašnja vrijednost prinosa (EUR)', answer: r2(pv), tol: 2, unit: '€', hint: 'Σ Rᵢ/(1 + r)ⁱ' },
            { key: 'sv', label: 'Iznos SV projekta |SV| (EUR)', answer: r2(Math.abs(sv)), tol: 2, unit: '€', hint: 'SV = SV prinosa − troškovi' }
          ],
          solution: [
            'Diskontirani prinosi: ' + fmt(p.R0) + ' + ' + fmt(d1) + ' + ' + fmt(d2) + ' + ' + fmt(d3) + ' = ' + fmt(pv) + ' EUR.',
            'SV = ' + fmt(pv) + ' − ' + fmt(p.T, 0) + ' = ' + fmt(sv) + ' EUR → ' + (sv > 0 ? 'SV > 0, projekt je ekonomski opravdan.' : 'SV < 0, projekt NIJE isplativ uz tu kamatnu stopu.')
          ]
        };
      },
      solution: ['SV = R₀ + R₁/(1+r) + R₂/(1+r)² + R₃/(1+r)³ − T; SV > 0 → isplativo.']
    },

    {
      id: 'k1-investicije-pojmovi',
      lesson: 'first-midterm', chapter: 4, category: 'm1Investment',
      type: 'choice',
      title: 'Investicije i teorije potrošnje',
      prompt: 'Priprema za 1. kolokvij (primjer 22 i „još bitno teorijsko gradivo”), Vježba 4 i Predavanje 4. Odaberite točno.',
      difficulty: 2,
      items: [
        { q: 'Uz tržišni kamatnjak 4 % treba odabrati projekte čija je interna stopa rentabilnosti veća od 4 %.', kind: 'tf', answer: true },
        { q: 'Bolje je uložiti u projekte čija je sadašnja vrijednost negativna.', kind: 'tf', answer: false },
        { q: 'Granična učinkovitost investicija opadajuća je funkcija kamatnjaka.', kind: 'tf', answer: true },
        { q: 'Ako kamatnjak padne s 4 % na 3 %, tržište je manje propulzivno i BDP se smanjuje.', kind: 'tf', answer: false },
        { q: 'Ako se rangiranje po sadašnjoj vrijednosti i po internoj stopi razlikuje, prednost ima kriterij sadašnje vrijednosti.', kind: 'tf', answer: true },
        { q: 'Investicije djeluju na proizvodnju u kratkom roku preko agregatne potražnje, a u dugom preko agregatne ponude.', kind: 'tf', answer: true },
        { q: 'Teorija relativnog dohotka (Duesenberry) ističe:', kind: 'mc', options: ['demonstracijski efekt — potrošnja ovisi o odnosu vlastitog dohotka i dohotka drugih', 'da potrošnja ovisi samo o tekućem dohotku', 'da je potrošnja stalna kroz cijeli život', 'da potrošnja ovisi o kamatnjaku'], answer: 0 },
        { q: 'Prema teoriji permanentnog dohotka (Friedman) potrošnja u dugom roku ovisi o:', kind: 'mc', options: ['tekućem dohotku', 'permanentnom (očekivanom prosječnom) dohotku', 'dohotku susjeda', 'kamatnjaku'], answer: 1 },
        { q: 'Prema teoriji životnog ciklusa tipičan potrošač:', kind: 'mc', options: ['troši sav tekući dohodak', 'štedi u radnim godinama i troši ušteđeno u mirovini', 'nikada ne štedi', 'troši više kad susjedi troše više'], answer: 1 }
      ],
      solution: [
        'Projekt je opravdan ako je SV > 0, odnosno ako je interna stopa rentabilnosti (granična efikasnost investicija) veća od tržišnog kamatnjaka.',
        'Niži kamatnjak → više investicija → veći BDP.',
        'Četiri teorije potrošnje: apsolutnog dohotka (Keynes), relativnog (Duesenberry), permanentnog (Friedman), životnog ciklusa (Ando i Modigliani).'
      ]
    },

    // =====================================================================
    // PREDAVANJE 5 — UVOD U FISKALNU POLITIKU (first-midterm)
    // =====================================================================
    {
      id: 'k1-porezi-random',
      lesson: 'first-midterm', chapter: 5, category: 'm1FiscalIntro',
      type: 'numeric',
      title: 'Funkcija poreza i raspoloživi dohodak — vježba',
      prompt: 'T = Ta + t·Y; prosječna porezna stopa T/Y; elastičnost poreza E(T,Y) = t/(T/Y); Yd = Y − T + TR.',
      difficulty: 2,
      params: {
        Ta: { min: 10, max: 60, step: 5 },
        t: { choices: [0.1, 0.15, 0.2, 0.25, 0.3] },
        Y: { min: 500, max: 2000, step: 100 },
        TR: { min: 10, max: 60, step: 10 }
      },
      generate(p) {
        p = Object.assign({}, p);
        for (let i = 0; i < 60; i++) {
          const tt = p.Ta + p.t * p.Y;
          if (ok3(tt, tt / p.Y * 100, p.Y - tt + p.TR)) break;
          p.Y += 100;
        }
        const T = p.Ta + p.t * p.Y;
        const avg = T / p.Y;
        const el = p.t / avg;
        const Yd = p.Y - T + p.TR;
        return {
          prompt: 'Autonomni porezi Ta = ' + p.Ta + ', porezna stopa t = ' + num(p.t * 100, 0) + ' %, transferi TR = ' + p.TR + ', domaći proizvod Y = ' + fmt(p.Y, 0)
            + '. Izračunajte ukupne poreze, prosječnu poreznu stopu (u %, 2 decimale), elastičnost poreza na dohodak (4 decimale) i raspoloživi dohodak.',
          fields: [
            { key: 'T', label: 'Ukupni porezi T', answer: r2(T), tol: 0.01, unit: '', hint: 'Ta + t·Y' },
            { key: 'avg', label: 'Prosječna porezna stopa T/Y', answer: r2(avg * 100), tol: 0.01, unit: '%', hint: 'T / Y · 100' },
            { key: 'el', label: 'Elastičnost poreza E(T,Y)', answer: rnd(el, 4), tol: 0.0006, unit: '', hint: 't / (T/Y)' },
            { key: 'Yd', label: 'Raspoloživi dohodak Yd', answer: r2(Yd), tol: 0.01, unit: '', hint: 'Y − T + TR' }
          ],
          solution: [
            'T = ' + p.Ta + ' + ' + num(p.t, 2) + '·' + fmt(p.Y, 0) + ' = ' + fmt(T) + '; T/Y = ' + fmt(avg * 100) + ' %.',
            'E(T,Y) = ' + num(p.t, 2) + '/' + num(avg, 4) + ' = ' + num(el, 4) + ' < 1 — uz Ta > 0 granična stopa manja je od prosječne (porezi rastu sporije od dohotka).',
            'Yd = ' + fmt(p.Y, 0) + ' − ' + fmt(T) + ' + ' + p.TR + ' = ' + fmt(Yd) + ' — raspoloživi dohodak manji je od Y.'
          ]
        };
      },
      solution: ['T = Ta + tY; Yd = Y − T + TR; E(T,Y) = t/(T/Y).']
    },

    {
      id: 'k1-proracun-random',
      lesson: 'first-midterm', chapter: 5, category: 'm1FiscalIntro',
      type: 'numeric',
      title: 'Saldo državnog proračuna — vježba',
      prompt: 'Proračun B = T − (G + TR): T > G + TR suficit, T < G + TR deficit.',
      difficulty: 1,
      params: {
        Ta: { min: 0, max: 50, step: 10 },
        t: { choices: [0.1, 0.15, 0.2, 0.25] },
        Y: { min: 800, max: 2000, step: 100 },
        G: { min: 100, max: 400, step: 10 },
        TR: { min: 10, max: 80, step: 10 }
      },
      generate(p) {
        const T = p.Ta + p.t * p.Y;
        let G = p.G;
        if (Math.abs(T - (G + p.TR)) < 1) G += 20;
        const out = G + p.TR;
        const B = T - out;
        return {
          prompt: 'Uz Y = ' + fmt(p.Y, 0) + ', autonomne poreze ' + p.Ta + ', poreznu stopu ' + num(p.t * 100, 0) + ' %, javnu potrošnju ' + G + ' i transfere ' + p.TR
            + ' izračunajte proračunske prihode, rashode i iznos salda. Je li proračun u suficitu ili deficitu?',
          fields: [
            { key: 'T', label: 'Prihodi proračuna T', answer: r2(T), tol: 0.01, unit: '', hint: 'Ta + t·Y' },
            { key: 'R', label: 'Rashodi proračuna G + TR', answer: out, tol: 0.01, unit: '', hint: 'transferi su rashod' },
            { key: 'B', label: 'Iznos salda |T − (G + TR)|', answer: r2(Math.abs(B)), tol: 0.01, unit: '', hint: 'upišite iznos bez predznaka' }
          ],
          solution: [
            'T = ' + fmt(T) + '; G + TR = ' + out + '.',
            'B = ' + fmt(T) + ' − ' + out + ' = ' + fmt(B) + ' → ' + (B > 0 ? 'budžetski SUFICIT (prihodi veći od rashoda).' : 'budžetski DEFICIT (pokriva se zaduživanjem).')
          ]
        };
      },
      solution: ['B = T − (G + TR).']
    },

    {
      id: 'k1-multiplikator-porez-random',
      lesson: 'first-midterm', chapter: 5, category: 'm1FiscalIntro',
      type: 'numeric',
      title: 'Multiplikator s porezima — vježba',
      prompt: 'U modelu Y = C + I + G s porezima multiplikator iznosi 1/(1 − β(1 − t)) — manji je nego bez poreza.',
      difficulty: 2,
      params: {
        b: { choices: [0.6, 0.7, 0.75, 0.8, 0.9] },
        t: { choices: [0.05, 0.1, 0.15, 0.2, 0.25] },
        dG: { min: 10, max: 100, step: 10 }
      },
      generate(p) {
        p = Object.assign({}, p);
        if (p.b === 0.8 && p.t === 0.15) p.t = 0.2; // 1/0,32 = 3,125 → tri decimale
        for (let i = 0; i < 60; i++) {
          if (ok3(p.dG / (1 - p.b * (1 - p.t)))) break;
          p.dG += 10;
        }
        const m0 = 1 / (1 - p.b), m1 = 1 / (1 - p.b * (1 - p.t));
        return {
          prompt: 'Granična sklonost potrošnji je ' + num(p.b, 2) + ', porezna stopa ' + num(p.t * 100, 0) + ' %. Izračunajte graničnu sklonost potrošnji iz dohotka β(1 − t), multiplikator bez poreza, multiplikator s porezom i porast BDP-a ako javna potrošnja poraste za ' + p.dG + ' (2 decimale).',
          fields: [
            { key: 'bt', label: 'β(1 − t)', answer: rnd(p.b * (1 - p.t), 4), tol: 0.0006, unit: '', hint: num(p.b, 2) + '·(1 − ' + num(p.t, 2) + ')' },
            { key: 'm0', label: 'Multiplikator bez poreza', answer: r2(m0), tol: 0.01, unit: '', hint: '1/(1 − β)' },
            { key: 'm1', label: 'Multiplikator s porezom', answer: r2(m1), tol: 0.01, unit: '', hint: '1/(1 − β(1 − t))' },
            { key: 'dY', label: 'Porast BDP-a', answer: r2(m1 * p.dG), tol: tolR(m1 * p.dG, 0.003), unit: '', hint: 'multiplikator · ΔG' }
          ],
          solution: [
            'β(1 − t) = ' + num(p.b * (1 - p.t), 4) + '. Bez poreza: 1/(1 − ' + num(p.b, 2) + ') = ' + fmt(m0) + '; s porezom: 1/(1 − ' + num(p.b * (1 - p.t), 4) + ') = ' + fmt(m1) + '.',
            'ΔY = ' + fmt(m1) + ' · ' + p.dG + ' = ' + fmt(m1 * p.dG) + '. Porezi „odvlače” dio svakog kruga potrošnje → multiplikator je manji; što je t veći, to je multiplikator manji.'
          ]
        };
      },
      solution: ['Multiplikator s porezom = 1/(1 − β(1 − t)).']
    },

    {
      id: 'k1-fiskalna-pojmovi',
      lesson: 'first-midterm', chapter: 5, category: 'm1FiscalIntro',
      type: 'choice',
      title: 'Fiskalna politika uz recesijski jaz — kolokvijska pitanja',
      prompt: 'Priprema za 1. kolokvij, primjeri 23 i 24 (u privredi je RECESIJSKI BDP jaz). Je li mjera/stanje ispravno sa stajališta fiskalne politike?',
      difficulty: 2,
      items: [
        { q: 'Smanjiti autonomne poreze.', kind: 'tf', answer: true },
        { q: 'Povećati transfere.', kind: 'tf', answer: true },
        { q: 'Smanjiti javnu potrošnju.', kind: 'tf', answer: false },
        { q: 'Imati budžetski suficit.', kind: 'tf', answer: false },
        { q: 'Imati budžetski deficit.', kind: 'tf', answer: true },
        { q: 'Imati poreznu stopu 5 % umjesto 10 %.', kind: 'tf', answer: true },
        { q: 'Imati autonomne poreze 10 umjesto 5.', kind: 'tf', answer: false },
        { q: 'Imati graničnu sklonost štednji 0,2 umjesto 0,25.', kind: 'tf', answer: true },
        { q: 'Imati mogućnost zaduživanja uz 3 % umjesto 2 %.', kind: 'tf', answer: false },
        { q: 'Imati multiplikator 5 umjesto 4.', kind: 'tf', answer: true },
        { q: 'Raspoloživi dohodak Yd u načelu je manji od domaćeg proizvoda Y.', kind: 'tf', answer: true },
        { q: 'U trosektorskom modelu ravnoteža glasi:', kind: 'mc', options: ['S = I', 'S − I = G + TR − T', 'S = G', 'S − I = NX'], answer: 1 }
      ],
      solution: [
        'Recesijski jaz → ekspanzivno: više G i TR, manji Ta i t, prihvatljiv deficit, veći multiplikator (veći β, manja granična sklonost štednji).',
        'Skuplje zaduživanje (3 % umjesto 2 %) poskupljuje financiranje deficita — nepovoljno.'
      ]
    },

    // =====================================================================
    // PREDAVANJE 6 — FISKALNA POLITIKA: MODELI I MULTIPLIKATORI (second-midterm)
    // =====================================================================
    {
      id: 'k2-vj5-zadatak1',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Trosektorski model (Vježba 5, zad. 1)',
      prompt: 'C = 100 + 0,9·Yd u modelu Y = C + I + G; transferi TR = 10, porezna stopa t = 10 %, autonomni porezi Ta = 5, G = 100, I = 100. '
        + 'Izračunajte funkciju potrošnje u ovisnosti o Y (slobodni član i nagib), ravnotežni Y, raspoloživi dohodak, osobnu potrošnju te multiplikatore s porezom i bez njega (2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'c0', label: 'Slobodni član u C = c₀ + c₁·Y', answer: 104.5, tol: 0.01, unit: '', hint: '100 + 0,9·(10 − 5)' },
        { key: 'c1', label: 'Nagib c₁ = β(1 − t)', answer: 0.81, tol: 0.001, unit: '', hint: '0,9·0,9' },
        { key: 'Y', label: 'Ravnotežni Y', answer: r2(304.5 / 0.19), tol: 0.05, unit: '', hint: '0,19·Y = 104,5 + 100 + 100' },
        { key: 'Yd', label: 'Raspoloživi dohodak Yd', answer: r2(0.9 * 304.5 / 0.19 + 5), tol: 0.05, unit: '', hint: 'Y − (Ta + t·Y) + TR' },
        { key: 'C', label: 'Osobna potrošnja C', answer: r2(104.5 + 0.81 * 304.5 / 0.19), tol: 0.05, unit: '', hint: '104,5 + 0,81·Y (ili Y − I − G)' },
        { key: 'mG', label: 'Multiplikator javne potrošnje', answer: r2(1 / 0.19), tol: 0.01, unit: '', hint: '1/(1 − 0,9·0,9)' },
        { key: 'm0', label: 'Multiplikator bez fiskalne politike', answer: 10, tol: 0.01, unit: '', hint: '1/(1 − 0,9)' }
      ],
      solution: [
        '\\( C = \\alpha + \\beta\\,(Y - (T_a + tY) + TR) = 100 + 0{,}9\\,(0{,}9Y + 5) = 104{,}5 + 0{,}81Y \\).',
        'Y = 104,5 + 0,81Y + 100 + 100 → 0,19Y = 304,5 → Y = 1 602,63.',
        'Yd = 1 602,63 − (5 + 160,26) + 10 = 1 447,37; C = 1 602,63 − 200 = 1 402,63. (Izvor: Y = 1 602,6 i Yd = 1 447,34 — zaokruživanje Y prije uvrštavanja; tolerancija prihvaća oba.)',
        'Multiplikator G = 1/(1 − 0,81) = 5,26 < 10 (bez poreza): porezi smanjuju multiplikativni učinak.'
      ]
    },

    {
      id: 'k2-aktivnost2-zad1',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Proračun i transferi (Aktivnost 2 zad. 1; Vježba 5, vježba 1)',
      prompt: 'Isti model: α = 100, β = 0,9, TR = 10, t = 10 %, Ta = 5, I = G = 100 (ravnotežni Y = 1 602,63). '
        + 'Izračunajte saldo proračuna, multiplikator transfera, potrebno povećanje transfera uz recesijski jaz 500 te uz potencijalni proizvod 2 000 (2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'B', label: 'Saldo proračuna T − (G + TR) (iznos)', answer: r2(5 + 0.1 * 304.5 / 0.19 - 110), tol: 0.02, unit: '', hint: '(5 + 0,1·Y) − (100 + 10)' },
        { key: 'mTR', label: 'Multiplikator transfera', answer: r2(0.9 / 0.19), tol: 0.01, unit: '', hint: 'β/(1 − β(1 − t))' },
        { key: 'dTR500', label: 'Povećanje transfera uz jaz 500', answer: r2(500 / (0.9 / 0.19)), tol: tolR(500 / (0.9 / 0.19), 0.003), unit: '', hint: '500 / multiplikator transfera' },
        { key: 'gap', label: 'Jaz uz potencijalni proizvod 2 000', answer: r2(2000 - 304.5 / 0.19), tol: 0.05, unit: '', hint: '2 000 − 1 602,63' },
        { key: 'dTR', label: 'Povećanje transfera uz potencijalni 2 000', answer: r2((2000 - 304.5 / 0.19) / (0.9 / 0.19)), tol: tolR((2000 - 304.5 / 0.19) / (0.9 / 0.19), 0.003), unit: '', hint: 'jaz / multiplikator transfera' }
      ],
      solution: [
        'T = 5 + 0,1 · 1 602,63 = 165,26; G + TR = 110 → B = +55,26 → budžetski SUFICIT.',
        'Multiplikator transfera = 0,9/0,19 = 4,74 (manji od multiplikatora G = 5,26 — dio transfera se uštedi).',
        'Jaz 500 → ΔTR = 500/4,74 = 105,56. Uz Ypot = 2 000: recesijski jaz 397,37 → ΔTR = 83,89 (ponuđeni odgovor a) u vježbi 5: „povećati za 83,9”).'
      ]
    },

    {
      id: 'k2-vj5-jaz',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Otklanjanje jaza investicijama i transferima (Vježba 5, zad. 2–3)',
      prompt: 'Potencijalni proizvod je 1 600, ravnotežni 1 456,25, multiplikator (G, odnosno I) 3,125, multiplikator transfera 2,5. Izračunajte jaz i potrebne promjene investicija, javne potrošnje, transfera i autonomnih poreza (iznosi).',
      difficulty: 2,
      fields: [
        { key: 'gap', label: 'Recesijski jaz', answer: 143.75, tol: 0.01, unit: '', hint: '1 600 − 1 456,25' },
        { key: 'dI', label: 'Povećanje investicija', answer: 46, tol: 0.01, unit: '', hint: '143,75 / 3,125' },
        { key: 'dG', label: 'Povećanje javne potrošnje', answer: 46, tol: 0.01, unit: '', hint: 'multiplikator G = multiplikator I' },
        { key: 'dTR', label: 'Povećanje transfera', answer: 57.5, tol: 0.01, unit: '', hint: '143,75 / 2,5' },
        { key: 'dTa', label: 'Smanjenje autonomnih poreza', answer: 57.5, tol: 0.01, unit: '', hint: '|multiplikator Ta| = β/(1 − β(1 − t)) = 2,5' }
      ],
      solution: [
        'Recesijski jaz = 1 600 − 1 456,25 = 143,75 → treba POVEĆATI Y.',
        'ΔI = ΔG = 143,75/3,125 = 46.',
        'Multiplikator transfera 2,5 (β/(1 − β(1 − t)), drukčiji od multiplikatora G!) → ΔTR = 57,5. Multiplikator Ta ima isti iznos, suprotan predznak → Ta SMANJITI za 57,5.',
        'Iz 3,125 = 1/0,32 i 2,5 = β/0,32 slijedi β = 0,8 i t = 0,15.'
      ]
    },

    {
      id: 'k2-vj5-vjezba2',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Zadatak za vježbu 2 (Vježba 5 — nije riješen u izvoru)',
      prompt: 'C = 0,8·Yd + 120; Y = C + I + G; TR = 30, t = 15 %, Ta = 10, I = 150, G = 100. Izračunajte ravnotežni Y, raspoloživi dohodak, nazivnik multiplikatora 1 − β(1 − t), C uz Y = 1 000 te, uz potencijalni proizvod 2 000, potrebne promjene TR, Ta, G i I (iznosi, 2 decimale).',
      difficulty: 3,
      fields: [
        { key: 'Y', label: 'Ravnotežni Y', answer: 1206.25, tol: 0.05, unit: '', hint: '(120 + 0,8·(30 − 10) + 250)/0,32' },
        { key: 'Yd', label: 'Raspoloživi dohodak Yd', answer: r2(0.85 * 1206.25 + 20), tol: 0.05, unit: '', hint: '0,85·Y + 20' },
        { key: 'den', label: 'Nazivnik multiplikatora 1 − β(1 − t)', answer: 0.32, tol: 0.001, unit: '', hint: '1 − 0,8·0,85 (multiplikator = 1/nazivnik)' },
        { key: 'C', label: 'C uz Y = 1 000', answer: 816, tol: 0.01, unit: '', hint: '120 + 0,8·(1 000 − 160 + 30)' },
        { key: 'dTR', label: 'Povećanje transfera', answer: 317.5, tol: tolR(317.5, 0.003), unit: '', hint: 'jaz 793,75 / 2,5' },
        { key: 'dTa', label: 'Smanjenje autonomnih poreza', answer: 317.5, tol: tolR(317.5, 0.003), unit: '', hint: 'jaz / |multiplikator Ta|' },
        { key: 'dG', label: 'Povećanje javne potrošnje (ili investicija)', answer: 254, tol: tolR(254, 0.003), unit: '', hint: 'jaz / 3,125' }
      ],
      solution: [
        'C = 120 + 0,8(Y − 10 − 0,15Y + 30) = 136 + 0,68Y → Y = 136 + 0,68Y + 250 → 0,32Y = 386 → Y = 1 206,25.',
        'Yd = 1 206,25 − (10 + 180,94) + 30 = 1 045,31. Multiplikator = 1/0,32 = 3,125 (bez poreza bio bi 5).',
        'C uz Y = 1 000: 120 + 0,8 · 870 = 816.',
        'Ypot 2 000 > 1 206,25 → RECESIJA, jaz 793,75: TR povećati 793,75/2,5 = 317,5; Ta smanjiti 317,5; G ili I povećati 793,75/3,125 = 254.'
      ]
    },

    {
      id: 'k2-fiskalni-kratki',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Kratki fiskalni zadaci (Vježba 5; Priprema 2, zad. 2 i 9)',
      prompt: 'a) Ta = 50, t = 5 %, TR = 150, Y = 1 000 → raspoloživi dohodak? b) Y = 1 500, Ypot = 2 000, β = 0,8, t = 15 % → za koliko smanjiti autonomne poreze? '
        + 'c) I = 500, S = 700, G = 400, T = 600 → transferi? d) Y = 1 000, t = 10 %, Ta = 10, TR = 20 → raspoloživi dohodak? '
        + 'e) α = 200, β = 0,9, Ta = 10, TR = 20, t = 10 % → reducirani oblik Y = a + m·(I + G): koliki su a i m?',
      difficulty: 2,
      fields: [
        { key: 'a', label: 'a) Yd', answer: 1050, tol: 0.01, unit: '', hint: '1 000 − (50 + 50) + 150' },
        { key: 'b', label: 'b) Smanjenje Ta', answer: 200, tol: tolR(200, 0.003), unit: '', hint: '500 / (0,8/0,32)' },
        { key: 'c', label: 'c) Transferi TR', answer: 400, tol: 0.01, unit: '', hint: 'S − I = G + TR − T' },
        { key: 'd', label: 'd) Yd', answer: 910, tol: 0.01, unit: '', hint: '1 000 − (10 + 100) + 20' },
        { key: 'ea', label: 'e) Slobodni član a', answer: 1100, tol: 0.5, unit: '', hint: '(200 + 0,9·(20 − 10))/0,19' },
        { key: 'em', label: 'e) Multiplikator m', answer: r2(1 / 0.19), tol: 0.01, unit: '', hint: '1/(1 − 0,9·0,9)' }
      ],
      solution: [
        'a) T = 50 + 0,05 · 1 000 = 100 → Yd = 1 000 − 100 + 150 = 1 050.',
        'b) Recesijski jaz 500; multiplikator Ta = −0,8/(1 − 0,8 · 0,85) = −2,5 → Ta SMANJITI za 500/2,5 = 200.',
        'c) 700 − 500 = 400 + TR − 600 → TR = 400.  d) Yd = 1 000 − 110 + 20 = 910.',
        'e) Izvor ne zadaje I ni G → rješenje u reduciranom obliku: Y = (209 + I + G)/0,19 = 1 100 + 5,26·(I + G).'
      ]
    },

    {
      id: 'k2-fiskalna-predavanje-p1',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Model s porezima i transferima (Fiskalna politika, primjer 1)',
      prompt: 'α = 120, β = 0,8, TR = 10, t = 10 % (Ta = 0), I + G = 200 (G = 100). Izračunajte ravnotežni Y, Yd, C, multiplikator, saldo proračuna i potrebnu promjenu investicija uz potencijalni BDP 1 500 (2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'Y', label: 'Ravnotežni Y', answer: r2(328 / 0.28), tol: 0.05, unit: '', hint: '0,28·Y = 128 + 200' },
        { key: 'Yd', label: 'Raspoloživi Yd', answer: r2(0.9 * 328 / 0.28 + 10), tol: 0.05, unit: '', hint: '0,9·Y + 10' },
        { key: 'C', label: 'Osobna potrošnja C', answer: r2(128 + 0.72 * 328 / 0.28), tol: 0.05, unit: '', hint: '128 + 0,72·Y' },
        { key: 'm', label: 'Multiplikator s porezom', answer: r2(1 / 0.28), tol: 0.01, unit: '', hint: '1/(1 − 0,8·0,9)' },
        { key: 'B', label: 'Saldo proračuna (iznos)', answer: r2(0.1 * 328 / 0.28 - 110), tol: 0.02, unit: '', hint: 't·Y − (G + TR)' },
        { key: 'dI', label: 'Povećanje investicija', answer: 92, tol: tolR(92, 0.003), unit: '', hint: '(1 500 − Y)/multiplikator' }
      ],
      solution: [
        'Yd = Y − 0,1Y + 10 = 0,9Y + 10; C = 120 + 0,8(0,9Y + 10) = 128 + 0,72Y.',
        'Y = 128 + 0,72Y + 200 → Y = 328/0,28 = 1 171,43; Yd = 1 064,29; C = 971,43 (izvor: Yd 1 064,28 — zaokruživanje).',
        'Multiplikator 3,57 (bez poreza 5). Proračun: 117,14 − 110 = 7,14 → SUFICIT.',
        'Recesijski jaz 328,57 → ΔI = 328,57/3,5714 = 92 (izvor dijeli sa zaokruženim 3,57 → 92,04).'
      ]
    },

    {
      id: 'k2-fiskalna-predavanje-p23',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Autonomni porezi i transferi (Fiskalna politika, primjeri 2–3)',
      prompt: 'Primjer 2: ravnotežni Y = 1 000, potencijalni 1 200, β = 0,7, t = 10 % — što učiniti s autonomnim porezima? '
        + 'Primjer 3: ravnotežni 1 500, potencijalni 1 800, β = 0,8, t = 5 % — što učiniti s transferima? (iznosi, 2 decimale)',
      difficulty: 2,
      fields: [
        { key: 'mTa', label: 'Pr. 2: |multiplikator Ta|', answer: r2(0.7 / 0.37), tol: 0.01, unit: '', hint: '0,7/(1 − 0,7·0,9)' },
        { key: 'dTa', label: 'Pr. 2: smanjenje autonomnih poreza', answer: r2(200 / (0.7 / 0.37)), tol: tolR(200 / (0.7 / 0.37), 0.004), unit: '', hint: '200 / 1,8919' },
        { key: 'mTR', label: 'Pr. 3: multiplikator transfera', answer: r2(0.8 / 0.24), tol: 0.01, unit: '', hint: '0,8/(1 − 0,8·0,95)' },
        { key: 'dTR', label: 'Pr. 3: povećanje transfera', answer: 90, tol: tolR(90, 0.004), unit: '', hint: '300 / 3,3333' }
      ],
      solution: [
        'Pr. 2: multiplikator Ta = −0,7/0,37 = −1,89; recesijski jaz 200 → Ta SMANJITI za 200/1,8919 = 105,71 (izvor 105,82 jer dijeli zaokruženim 1,89).',
        'Pr. 3: multiplikator TR = 0,8/0,24 = 3,33; jaz 300 → TR POVEĆATI za 300/3,3333 = 90 (izvor 90,09 zbog zaokruženog 3,33).',
        'Oba su multiplikatora po iznosu SLABIJA od multiplikatora javne potrošnje 1/(1 − β(1 − t)).'
      ]
    },

    {
      id: 'k2-fiskalni-model-random',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Ravnoteža trosektorskog modela — vježba',
      prompt: 'Y = C + I + G, C = α + β·Yd, Yd = Y − T + TR, T = Ta + t·Y.',
      difficulty: 3,
      params: {
        bt: { choices: [[0.8, 0.25], [0.75, 0.2], [0.9, 0.1], [0.8, 0.1], [0.6, 0.25], [0.9, 0.2], [0.75, 0.1]] },
        a: { min: 50, max: 200, step: 10 },
        Ta: { min: 0, max: 50, step: 5 },
        TR: { min: 0, max: 60, step: 10 },
        I: { min: 50, max: 300, step: 25 },
        G: { min: 50, max: 300, step: 25 }
      },
      generate(p) {
        p = Object.assign({}, p);
        const b = p.bt[0], t = p.bt[1];
        const den = 1 - b * (1 - t);
        const Ta0 = p.Ta, G0 = p.G;
        search: for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 4; j++) {
            p.Ta = Ta0 + 5 * i; p.G = G0 + 25 * j;
            const yy = (p.a + b * (p.TR - p.Ta) + p.I + p.G) / den;
            const tt = p.Ta + t * yy;
            if (ok3(yy, tt, yy - tt + p.TR, yy - p.I - p.G)) break search;
          }
        }
        const A = p.a + b * (p.TR - p.Ta) + p.I + p.G;
        const Y = A / den;
        const T = p.Ta + t * Y;
        const Yd = Y - T + p.TR;
        const C = p.a + b * Yd;
        return {
          prompt: 'α = ' + p.a + ', β = ' + num(b, 2) + ', Ta = ' + p.Ta + ', t = ' + num(t * 100, 0) + ' %, TR = ' + p.TR + ', I = ' + p.I + ', G = ' + p.G
            + '. Izračunajte ravnotežni Y, poreze T, raspoloživi dohodak Yd, osobnu potrošnju C i multiplikator javne potrošnje (2 decimale; dijelite s nezaokruženim 1 − β(1 − t)).',
          fields: [
            { key: 'Y', label: 'Ravnotežni Y', answer: r2(Y), tol: 0.05, unit: '', hint: '[α + β(TR − Ta) + I + G] / (1 − β(1 − t))' },
            { key: 'T', label: 'Porezi T', answer: r2(T), tol: 0.05, unit: '', hint: 'Ta + t·Y' },
            { key: 'Yd', label: 'Raspoloživi dohodak Yd', answer: r2(Yd), tol: 0.05, unit: '', hint: 'Y − T + TR' },
            { key: 'C', label: 'Osobna potrošnja C', answer: r2(C), tol: 0.05, unit: '', hint: 'α + β·Yd (provjera: Y − I − G)' },
            { key: 'mG', label: 'Multiplikator javne potrošnje', answer: r2(1 / den), tol: 0.01, unit: '', hint: '1/(1 − β(1 − t))' }
          ],
          solution: [
            'C = ' + p.a + ' + ' + num(b, 2) + '(Y − ' + p.Ta + ' − ' + num(t, 2) + 'Y + ' + p.TR + ') = ' + num(p.a + b * (p.TR - p.Ta), 2) + ' + ' + num(b * (1 - t), 4) + 'Y.',
            'Y = ' + num(A, 2) + '/' + num(den, 4) + ' = ' + fmt(Y) + '.',
            'T = ' + fmt(T) + '; Yd = ' + fmt(Yd) + '; C = ' + fmt(C) + ' (provjera: Y − I − G = ' + fmt(Y - p.I - p.G) + ').',
            'Multiplikator G = 1/' + num(den, 4) + ' = ' + fmt(1 / den) + '; saldo proračuna T − (G + TR) = ' + fmt(T - p.G - p.TR) + (T - p.G - p.TR >= 0 ? ' (suficit).' : ' (deficit).')
          ]
        };
      },
      solution: ['Y = [α + β(TR − Ta) + I + G]/(1 − β(1 − t)).']
    },

    {
      id: 'k2-multiplikatori-jaz-random',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'numeric',
      title: 'Četiri instrumenta za isti jaz — vježba',
      prompt: 'Multiplikatori: G → 1/(1 − β(1 − t)); Ta → −β/(1 − β(1 − t)); TR → β/(1 − β(1 − t)).',
      difficulty: 3,
      params: {
        bt: { choices: [[0.8, 0.25], [0.9, 0.1], [0.8, 0.1], [0.7, 0.1], [0.8, 0.05], [0.6, 0.2], [0.9, 0.2], [0.75, 0.1]] },
        Y: { min: 800, max: 2000, step: 50 },
        gap: { min: 100, max: 500, step: 25 },
        dir: { choices: [1, 1, -1] }
      },
      generate(p) {
        const b = p.bt[0], t = p.bt[1];
        const den = 1 - b * (1 - t);
        const mG = 1 / den, mTa = b / den;
        p = Object.assign({}, p);
        for (let i = 0; i < 60; i++) {
          if (ok3(p.gap * den, p.gap * den / b)) break;
          p.gap += 25;
        }
        const Yp = p.Y + p.dir * p.gap;
        const rec = p.dir > 0;
        const dG = p.gap / mG, dTa = p.gap / mTa;
        return {
          prompt: 'Ravnotežni domaći proizvod je ' + fmt(p.Y, 0) + ', potencijalni ' + fmt(Yp, 0) + '. β = ' + num(b, 2) + ', t = ' + num(t * 100, 0)
            + ' %. Izračunajte multiplikatore i za koliko treba promijeniti G, Ta ili TR (svaki instrument zasebno) da se jaz otkloni (iznosi, 2 decimale).',
          fields: [
            { key: 'mG', label: 'Multiplikator G', answer: r2(mG), tol: 0.01, unit: '', hint: '1/(1 − β(1 − t))' },
            { key: 'mTa', label: '|Multiplikator Ta| = multiplikator TR', answer: r2(mTa), tol: 0.01, unit: '', hint: 'β/(1 − β(1 − t))' },
            { key: 'dG', label: 'Promjena G (iznos)', answer: r2(dG), tol: tolR(dG, 0.004), unit: '', hint: 'jaz / multiplikator G' },
            { key: 'dTa', label: 'Promjena Ta (iznos)', answer: r2(dTa), tol: tolR(dTa, 0.004), unit: '', hint: 'jaz / |multiplikator Ta|' },
            { key: 'dTR', label: 'Promjena TR (iznos)', answer: r2(dTa), tol: tolR(dTa, 0.004), unit: '', hint: 'jaz / multiplikator TR' }
          ],
          solution: [
            'Jaz = ' + p.gap + ' → ' + (rec ? 'RECESIJSKI (Ypot > Y): ekspanzija.' : 'INFLACIJSKI (Ypot < Y): restrikcija.'),
            '1 − β(1 − t) = ' + num(den, 4) + '; multiplikator G = ' + fmt(mG) + '; multiplikator Ta = −' + fmt(mTa) + '; multiplikator TR = ' + fmt(mTa) + '.',
            rec ? 'G POVEĆATI za ' + fmt(dG) + '; Ta SMANJITI za ' + fmt(dTa) + '; TR POVEĆATI za ' + fmt(dTa) + '.'
              : 'G SMANJITI za ' + fmt(dG) + '; Ta POVEĆATI za ' + fmt(dTa) + '; TR SMANJITI za ' + fmt(dTa) + '.',
            'Javna potrošnja djeluje najjače (najmanja potrebna promjena) jer cijeli iznos ulazi u AD, dok se dio poreza/transfera prelije u štednju.'
          ]
        };
      },
      solution: ['ΔX = jaz / multiplikator instrumenta X.']
    },

    {
      id: 'k2-vj5-izbor',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'choice',
      title: 'Zadatak za vježbu 1 (Vježba 5 — ponuđeni odgovori)',
      prompt: 'Model: α = 100, β = 0,9, TR = 10, t = 10 %, Ta = 5, I = G = 100. Odaberite točan odgovor.',
      difficulty: 2,
      items: [
        { q: '1.A Ravnotežni domaći proizvod iznosi:', kind: 'mc', options: ['1 508,8', '1 602,6', '1 448,7', '1 325,5'], answer: 1 },
        { q: '1.B Raspoloživi dohodak iznosi (zaokruženo):', kind: 'mc', options: ['1 356,35', '1 225,40', '1 447,37', '1 505,28'], answer: 2 },
        { q: '2.A Multiplikator javne potrošnje govori:', kind: 'mc', options: ['ako se investicije povećaju za 1, proizvodnja raste za 5,27', 'ako se javna potrošnja poveća za 1, proizvodnja raste za 5,26', 'ako se javna potrošnja poveća za 1, proizvodnja raste za 6,26', 'ako se Y poveća za 1, javna potrošnja raste za 3,125'], answer: 1 },
        { q: '2.B Potencijalni proizvod je 2 000. Što vrijedi?', kind: 'mc', options: ['recesijski jaz — transfere povećati za 83,9', 'recesijski jaz — transfere povećati za 115,6', 'inflacijski jaz — transfere smanjiti za 83,9', 'inflacijski jaz — transfere smanjiti za 115,6'], answer: 0 }
      ],
      solution: [
        'Y = 304,5/0,19 = 1 602,63; Yd = 1 447,37 (izvor: 1 447,34).',
        'Multiplikator G = 5,26; multiplikator TR = 4,74; jaz 2 000 − 1 602,63 = 397,37 → ΔTR = 83,9.'
      ]
    },

    {
      id: 'k2-fiskalna-pojmovi',
      lesson: 'second-midterm', chapter: 6, category: 'm2FiscalModels',
      type: 'choice',
      title: 'Fiskalni multiplikatori — kolokvijska pitanja',
      prompt: 'Priprema za 2. kolokvij, pitanja 1 i 3–10 (u originalu „odaberite točne odgovore”). Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'Povećanje autonomnih poreza smanjuje zaposlenost i BDP.', kind: 'tf', answer: true },
        { q: 'Povećanje autonomnih poreza povećava ukupne poreze i smanjuje budžetski deficit.', kind: 'tf', answer: true },
        { q: 'Povećanje autonomnih poreza pomaže smanjiti recesijski BDP jaz.', kind: 'tf', answer: false },
        { q: 'Elastičnost poreza na dohodak 1,5 upućuje na progresivne poreze.', kind: 'tf', answer: true },
        { q: 'Uvođenje poreza smanjuje multiplikativne učinke i osobnu potrošnju.', kind: 'tf', answer: true },
        { q: 'Pozitivno je povećati poreze u uvjetima inflacijskog BDP jaza.', kind: 'tf', answer: true },
        { q: 'Multiplikator javne potrošnje i multiplikator autonomnih poreza istog su predznaka.', kind: 'tf', answer: false },
        { q: 'Multiplikator javne potrošnje po iznosu je veći od multiplikatora autonomnih poreza.', kind: 'tf', answer: true },
        { q: 'Investicijski multiplikator u dvosektorskom modelu veći je nego u trosektorskom.', kind: 'tf', answer: true },
        { q: 'Ravnotežni 1 000, potencijalni 1 200: treba smanjiti poreznu stopu da se otkloni recesijski jaz od 200.', kind: 'tf', answer: true },
        { q: 'Uz multiplikator javne potrošnje 3 smanjenje G za 100 smanjuje BDP za 300.', kind: 'tf', answer: true },
        { q: 'Multiplikator transfera 5 znači: povećanje transfera za 1 jedinicu povećava BDP za 5 jedinica.', kind: 'tf', answer: true }
      ],
      solution: [
        'Multiplikator G: 1/(1 − β(1 − t)) > 0; multiplikator Ta: −β/(1 − β(1 − t)) < 0 i po iznosu manji (β < 1).',
        'Porezi smanjuju graničnu sklonost potrošnji iz dohotka na β(1 − t) → manji multiplikator nego 1/(1 − β) u dvosektorskom modelu.',
        'Elastičnost poreza > 1: porezi rastu brže od dohotka (progresivno).'
      ]
    },

    // ----- Tržište rada (Blanchard pogl. 6) — seminar uz Predavanje 6 -----
    {
      id: 'k2-trziste-rada-sad',
      lesson: 'second-midterm', chapter: 6, category: 'm2LaborMarket',
      type: 'ratio',
      title: 'Stope tržišta rada (Poglavlje 6, primjer SAD 2018.)',
      prompt: 'Izračunajte stope tržišta rada (2 decimale).',
      difficulty: 1,
      givens: [
        { label: 'Neinstitucionalizirano civilno (radno sposobno) stanovništvo', value: '257,7 mil.' },
        { label: 'Zaposleni', value: '155,7 mil.' },
        { label: 'Nezaposleni', value: '6,3 mil.' }
      ],
      fields: [
        { key: 'L', label: 'Radna snaga (mil.)', answer: 162, tol: 0.01, unit: '', hint: 'zaposleni + nezaposleni' },
        { key: 'out', label: 'Izvan radne snage (mil.)', answer: 95.7, tol: 0.01, unit: '', hint: '257,7 − 162' },
        { key: 'u', label: 'Stopa nezaposlenosti', answer: r2(6.3 / 162 * 100), tol: 0.01, unit: '%', hint: '6,3/162 · 100' },
        { key: 'e', label: 'Stopa zaposlenosti', answer: r2(155.7 / 257.7 * 100), tol: 0.01, unit: '%', hint: '155,7/257,7 · 100' },
        { key: 'p', label: 'Stopa participacije', answer: r2(162 / 257.7 * 100), tol: 0.01, unit: '%', hint: '162/257,7 · 100' }
      ],
      solution: [
        'Radna snaga = 155,7 + 6,3 = 162; izvan radne snage 95,7 mil.',
        'Stopa nezaposlenosti = 3,89 % (HR 2023.: 6,9 %); stopa zaposlenosti = 60,42 %; participacija = 62,86 % (HR 2023.: 52 %).'
      ]
    },

    {
      id: 'k2-tokovi-radnika',
      lesson: 'second-midterm', chapter: 6, category: 'm2LaborMarket',
      type: 'numeric',
      title: 'Tokovi radnika (Aktivnost tržište rada)',
      prompt: 'Mjesečni tokovi (mil.): 1,8 · 2,1 · 3,3 · 3,6 su ulasci i izlasci iz skupine zaposlenih; zaposleno 132,4, nezaposleno 8,4 mil. Iz nezaposlenosti mjesečno 2,1 mil. nađe posao, a 1,9 mil. napusti radnu snagu. Izračunajte (2 decimale):',
      difficulty: 2,
      fields: [
        { key: 'f', label: 'Udio zaposlenih koji mjesečno ulaze i izlaze iz zaposlenosti', answer: r2(10.8 / 132.4 * 100), tol: 0.01, unit: '%', hint: '(1,8 + 2,1 + 3,3 + 3,6)/132,4 · 100' },
        { key: 'ue', label: 'Udio nezaposlenih koji mjesečno prelaze u zaposlene', answer: 25, tol: 0.01, unit: '%', hint: '2,1/8,4 · 100' },
        { key: 'o', label: 'Udio nezaposlenih koji mjesečno izlaze iz nezaposlenosti', answer: r2(4 / 8.4 * 100), tol: 0.01, unit: '%', hint: '(2,1 + 1,9)/8,4 · 100' },
        { key: 'd', label: 'Prosječno trajanje nezaposlenosti (mjeseci)', answer: 2.1, tol: 0.01, unit: 'mj.', hint: '1 / udio izlaska' },
        { key: 'lf', label: 'Tokovi u odnosu na ukupnu radnu snagu', answer: r2(10.8 / 140.8 * 100), tol: 0.01, unit: '%', hint: '10,8/(132,4 + 8,4) · 100' }
      ],
      solution: [
        'Tokovi zaposlenih: 10,8/132,4 = 8,16 % mjesečno (izvor 8,2 %).',
        'Iz nezaposlenosti u zaposlenost: 2,1/8,4 = 25 %; ukupni izlazak: 4/8,4 = 47,62 % → prosječno trajanje nezaposlenosti 1/0,4762 = 2,1 mjesec.',
        'U odnosu na radnu snagu: 10,8/140,8 = 7,67 %. Tokovi su veliki u odnosu na stanje — tržište rada je vrlo dinamično.'
      ]
    },

    {
      id: 'k2-prirodna-stopa-random',
      lesson: 'second-midterm', chapter: 6, category: 'm2LaborMarket',
      type: 'numeric',
      title: 'Prirodna stopa nezaposlenosti (WS–PS) — vježba',
      prompt: 'Relacija određivanja nadnica W = P·(1 − u); relacija određivanja cijena P = (1 + μ)·W.',
      difficulty: 2,
      params: {
        mu: { choices: [4, 5, 8, 10, 15, 20, 25] },
        mu2: { choices: [5, 10, 15] }
      },
      generate(p) {
        const m1 = p.mu / 100;
        const m2 = m1 + p.mu2 / 100;
        const wp = 1 / (1 + m1), un = 1 - wp;
        const wp2 = 1 / (1 + m2), un2 = 1 - wp2;
        return {
          prompt: 'Marža poduzeća iznosi μ = ' + p.mu + ' %, a funkcija nadnica W = P·(1 − u). Izračunajte realnu nadnicu prema relaciji određivanja cijena (4 decimale), prirodnu stopu nezaposlenosti (%, 2 decimale) te prirodnu stopu ako marža poraste na ' + num(m2 * 100, 0) + ' %.',
          fields: [
            { key: 'wp', label: 'Realna nadnica W/P (PS)', answer: rnd(wp, 4), tol: 0.001, unit: '', hint: '1/(1 + μ)' },
            { key: 'un', label: 'Prirodna stopa nezaposlenosti', answer: r2(un * 100), tol: 0.05, unit: '%', hint: 'u = 1 − W/P' },
            { key: 'un2', label: 'Prirodna stopa uz veću maržu', answer: r2(un2 * 100), tol: 0.05, unit: '%', hint: '1 − 1/(1 + μ novi)' }
          ],
          solution: [
            'PS: W/P = 1/(1 + ' + num(m1, 2) + ') = ' + num(wp, 4) + '.',
            'WS uz W = P(1 − u): W/P = 1 − u → u_n = 1 − ' + num(wp, 4) + ' = ' + fmt(un * 100) + ' %.',
            'Marža ' + num(m2 * 100, 0) + ' %: W/P = ' + num(wp2, 4) + ' → u_n = ' + fmt(un2 * 100) + ' %. Veća marža smanjuje realnu nadnicu, pa nezaposlenost mora porasti da bi radnici prihvatili nižu realnu nadnicu → prirodna stopa raste.'
          ]
        };
      },
      solution: ['W/P = 1/(1 + μ); uz W = P(1 − u): u_n = 1 − 1/(1 + μ) = μ/(1 + μ).']
    },

    {
      id: 'k2-prirodna-zaposlenost-random',
      lesson: 'second-midterm', chapter: 6, category: 'm2LaborMarket',
      type: 'numeric',
      title: 'Prirodna razina zaposlenosti i proizvodnje — vježba',
      prompt: 'N_n = L·(1 − u_n); uz proizvodnu funkciju Y = N vrijedi Y_n = N_n.',
      difficulty: 1,
      params: {
        L: { min: 100, max: 300, step: 10 },
        un: { choices: [4, 5, 6, 7.5, 8, 10] }
      },
      generate(p) {
        const Nn = p.L * (1 - p.un / 100);
        const Un = p.L * p.un / 100;
        return {
          prompt: 'Radna snaga iznosi ' + p.L + ' milijuna, a prirodna stopa nezaposlenosti ' + num(p.un, 1) + ' %. Izračunajte prirodnu razinu zaposlenosti, broj nezaposlenih pri prirodnoj stopi i prirodnu razinu proizvodnje (uz Y = N).',
          fields: [
            { key: 'Nn', label: 'Prirodna razina zaposlenosti N_n (mil.)', answer: r2(Nn), tol: 0.01, unit: '', hint: 'L·(1 − u_n)' },
            { key: 'Un', label: 'Nezaposleni pri prirodnoj stopi (mil.)', answer: r2(Un), tol: 0.01, unit: '', hint: 'L · u_n' },
            { key: 'Yn', label: 'Prirodna razina proizvodnje Y_n', answer: r2(Nn), tol: 0.01, unit: '', hint: 'Y_n = N_n' }
          ],
          solution: [
            'N_n = ' + p.L + ' · (1 − ' + num(p.un, 1) + ' %) = ' + fmt(Nn) + ' mil.; nezaposleni = ' + fmt(Un) + ' mil.',
            'Y = N → Y_n = ' + fmt(Nn) + '. (Primjer iz poglavlja: L = 150, u_n = 5 % → N_n = 142,5.)'
          ]
        };
      },
      solution: ['N_n = L(1 − u_n); Y_n = N_n.']
    },

    {
      id: 'k2-trziste-rada-pojmovi',
      lesson: 'second-midterm', chapter: 6, category: 'm2LaborMarket',
      type: 'choice',
      title: 'Tržište rada — točno ili netočno (Aktivnost)',
      prompt: '„Aktivnost tržište rada” (tvrdnje 1–5) i relacije WS/PS iz Poglavlja 6.',
      difficulty: 2,
      items: [
        { q: 'Stopa nezaposlenosti ima tendenciju rasta tijekom recesije i pada tijekom ekspanzije.', kind: 'tf', answer: true },
        { q: 'Većina radnika prima upravo uvjetnu nadnicu (reservation wage).', kind: 'tf', answer: false },
        { q: 'Radnici izvan sindikata nemaju nikakvu pregovaračku moć.', kind: 'tf', answer: false },
        { q: 'Moguće je da je u interesu poslodavaca isplaćivati nadnice više od uvjetnih.', kind: 'tf', answer: true },
        { q: 'Na prirodnu stopu nezaposlenosti ne utječu promjene ekonomske politike.', kind: 'tf', answer: false },
        { q: 'WS krivulja je opadajuća: što je stopa nezaposlenosti viša, realna nadnica je niža.', kind: 'tf', answer: true },
        { q: 'Povećanje naknada za nezaposlene (z) povećava prirodnu stopu nezaposlenosti.', kind: 'tf', answer: true },
        { q: 'Povećanje marže μ povećava realnu nadnicu određenu cijenama (PS).', kind: 'tf', answer: false },
        { q: 'Stopa zaposlenosti = zaposleni / radno sposobno stanovništvo.', kind: 'tf', answer: true },
        { q: 'U srednjem roku proizvodnja teži:', kind: 'mc', options: ['svojoj prirodnoj razini (ključno je tržište rada)', 'razini koju određuje isključivo fiskalna politika', 'razini uz nultu nezaposlenost', 'razini uz najvišu inflaciju'], answer: 0 }
      ],
      solution: [
        'Radnici su obično plaćeni IZNAD uvjetne nadnice; i bez sindikata imaju određenu pregovaračku moć (npr. teško zamjenjive vještine); poslodavcu viša nadnica može smanjiti fluktuaciju i povećati trud.',
        'Politike (naknade za nezaposlene z, minimalne nadnice, antimonopolska politika → μ) mijenjaju prirodnu stopu.',
        '⚠ Poglavlje 6 (sl. 11) piše „što je viša stopa nezaposlenosti više su nadnice” — obrnuto: viša nezaposlenost SNIŽAVA nadnice (negativan predznak uz u).'
      ]
    },

    // ----- Esej i Aktivnost 2: podaci za zemlju X (seminar uz Predavanje 6) -----
    {
      id: 'k2-zemlja-x-a',
      lesson: 'second-midterm', chapter: 6, category: 'm2EssayData',
      type: 'ratio',
      title: 'Zemlja X: BDP po stanovniku i udio izvoza (Priprema 2, zad. 4)',
      prompt: 'Podaci za zemlju X (10,5 mil. stanovnika). Izračunajte (2 decimale).',
      difficulty: 2,
      givens: [
        { label: 'BDP (mlrd EUR) 2014. / 2015. / 2018. / 2019.', value: '654 / 850 / 910 / 980' },
        { label: 'Izvoz (mlrd EUR) 2014. / 2018.', value: '78 / 99' },
        { label: 'Broj stanovnika', value: '10,5 mil.' }
      ],
      fields: [
        { key: 'pc15', label: 'BDP po stanovniku 2015. (EUR)', answer: r2(850e3 / 10.5), tol: 0.05, unit: '€', hint: '850 mlrd / 10,5 mil. = 850 000/10,5' },
        { key: 'pc19', label: 'BDP po stanovniku 2019. (EUR)', answer: r2(980e3 / 10.5), tol: 0.05, unit: '€', hint: '980 000/10,5' },
        { key: 'g', label: 'Rast BDP-a po stanovniku 2015.–2019.', answer: r2((980 / 850 - 1) * 100), tol: 0.01, unit: '%', hint: '(pc 2019 − pc 2015)/pc 2015 · 100' },
        { key: 'e14', label: 'Udio izvoza u BDP-u 2014.', answer: r2(78 / 654 * 100), tol: 0.01, unit: '%', hint: '78/654 · 100' },
        { key: 'e18', label: 'Udio izvoza u BDP-u 2018.', answer: r2(99 / 910 * 100), tol: 0.01, unit: '%', hint: '99/910 · 100' }
      ],
      solution: [
        'BDP pc 2015. = 850 · 10⁹/(10,5 · 10⁶) = 80 952,38 EUR; 2019. = 93 333,33 EUR → rast 15,29 % u 4 godine (pozitivan trend).',
        '⚠ Izvor zaokružuje na „15 %” i dijeli s 4 → „3,75 % godišnje”; to je prosjek jednostavnim dijeljenjem — geometrijski prosjek bio bi 3,62 % godišnje.',
        'Udio izvoza: 2014. = 11,93 %, 2018. = 10,88 % — udio pada, trend nije optimalan (izvoz raste sporije od BDP-a).'
      ]
    },

    {
      id: 'k2-zemlja-x-b',
      lesson: 'second-midterm', chapter: 6, category: 'm2EssayData',
      type: 'ratio',
      title: 'Zemlja X: rast, cijene i realne vrijednosti (Priprema 2, zad. 4)',
      prompt: 'Iz tablice zemlje X izračunajte stope rasta, stope inflacije i realne vrijednosti (CPI 2015 = 100; 2 decimale).',
      difficulty: 2,
      givens: [
        { label: 'BDP (mlrd EUR) 2010. / 2018. / 2019.', value: '504 / 910 / 980' },
        { label: 'Izvoz (mlrd EUR) 2011. / 2012. / 2016. / 2017. / 2018.', value: '72 / 83 / 82 / 92 / 99' },
        { label: 'CPI 2011. / 2012. / 2016. / 2017. / 2018.', value: '95 / 103 / 97 / 103 / 105' }
      ],
      fields: [
        { key: 'g', label: 'Relativni rast BDP-a 2010.–2019.', answer: r2((980 - 504) / 504 * 100), tol: 0.01, unit: '%', hint: '(980 − 504)/504 · 100' },
        { key: 'x12', label: 'Rast izvoza 2012./2011.', answer: r2((83 / 72 - 1) * 100), tol: 0.01, unit: '%', hint: '83/72 · 100 − 100' },
        { key: 'x17', label: 'Rast izvoza 2017./2016.', answer: r2((92 / 82 - 1) * 100), tol: 0.01, unit: '%', hint: '92/82 · 100 − 100' },
        { key: 'i12', label: 'Stopa inflacije 2012.', answer: r2((103 - 95) / 95 * 100), tol: 0.01, unit: '%', hint: '(103 − 95)/95 · 100' },
        { key: 'i17', label: 'Stopa inflacije 2017.', answer: r2((103 - 97) / 97 * 100), tol: 0.01, unit: '%', hint: '(103 − 97)/97 · 100' },
        { key: 'r18', label: 'Realni BDP 2018. (mlrd EUR, cijene 2015.)', answer: r2(910 * 100 / 105), tol: 0.01, unit: '', hint: '910 · 100/105' },
        { key: 'rx18', label: 'Realni izvoz 2018. (mlrd EUR)', answer: r2(99 * 100 / 105), tol: 0.01, unit: '', hint: '99 · 100/105' }
      ],
      solution: [
        'Apsolutni rast BDP-a = 476 mlrd EUR; relativni = 94,44 %.',
        'Izvoz 2012./2011. = +15,28 % (izvor 15,3 %); 2017./2016. = +12,20 %.',
        'CPI 103 u 2012. i 2017. = cijene 3 % iznad bazne 2015.; godišnja inflacija 2012. = 8,42 % (visoka!), 2017. = 6,19 %.',
        'Realni BDP 2018. = 866,67 mlrd EUR; realni izvoz 2018. = 94,29 mlrd EUR (izvor 94,3).'
      ]
    },

    // =====================================================================
    // PREDAVANJE 7 — MONETARNA MAKROEKONOMIJA (second-midterm)
    // =====================================================================
    {
      id: 'k2-novac-pojmovi',
      lesson: 'second-midterm', chapter: 7, category: 'm2Money',
      type: 'choice',
      title: 'Novac i potražnja za novcem',
      prompt: 'Vježba 8 i Priprema za 2. kolokvij (pitanja 12–14). Točno ili netočno?',
      difficulty: 1,
      items: [
        { q: 'Funkcije novca su: sredstvo plaćanja, mjerilo vrijednosti i pričuva vrijednosti.', kind: 'tf', answer: true },
        { q: 'M1 = efektivni (gotov) novac + depoziti po viđenju.', kind: 'tf', answer: true },
        { q: 'Štedni i oročeni depoziti dio su M1.', kind: 'tf', answer: false },
        { q: 'L1 (transakcijska potražnja) rastuća je funkcija dohotka.', kind: 'tf', answer: true },
        { q: 'L1 je funkcija špekulativne potražnje za novcem.', kind: 'tf', answer: false },
        { q: 'L2 (špekulativna potražnja) opadajuća je funkcija kamatnjaka.', kind: 'tf', answer: true },
        { q: 'L2 je rastuća funkcija stope inflacije.', kind: 'tf', answer: true },
        { q: 'Povećanje opće razine cijena povećava potražnju za novcem (M1).', kind: 'tf', answer: true },
        { q: 'Povećanje kamatne stope povećava potražnju za novcem.', kind: 'tf', answer: false },
        { q: 'U Cambridge jednadžbi M = k·P·y koeficijent k jednak je:', kind: 'mc', options: ['1/V — obrnuto brzini optjecaja novca', 'V — brzini optjecaja', 'kamatnjaku', 'stopi obvezne rezerve'], answer: 0 }
      ],
      solution: [
        'M1 = gotovina + depoziti po viđenju (transakcijska funkcija); M2 = M1 + štedni i oročeni depoziti (pričuva vrijednosti).',
        'L = L1 + L2: L1 = k(Y) raste s dohotkom; L2 = l(r, p) pada s kamatnjakom, raste s inflacijom. Viši kamatnjak = veći oportunitetni trošak držanja novca.'
      ]
    },

    {
      id: 'k2-monetarna-pojmovi',
      lesson: 'second-midterm', chapter: 7, category: 'm2MonetaryPolicy',
      type: 'choice',
      title: 'Monetarna politika i središnja banka — kolokvijska pitanja',
      prompt: 'Priprema za 2. kolokvij, pitanja 11, 16–19 i 32. Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'Ekspanzivna monetarna politika: veća ponuda novca, niža kamatna stopa, niža obvezna rezerva.', kind: 'tf', answer: true },
        { q: 'Pri ekspanzivnoj politici središnja banka prodaje dužničke vrijednosne papire poslovnim bankama.', kind: 'tf', answer: false },
        { q: 'Kupnja i prodaja vrijednosnih papira središnje banke su operacije na otvorenom tržištu.', kind: 'tf', answer: true },
        { q: 'Uz inflacijski jaz treba povećati diskontnu stopu.', kind: 'tf', answer: true },
        { q: 'Uz inflacijski jaz treba smanjiti stopu obveznih rezervi poslovnih banaka.', kind: 'tf', answer: false },
        { q: 'Uz inflacijski jaz središnja banka prodaje obveznice, snižava im cijenu i povećava kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Novčani multiplikator (1/φ) uvijek je veći od kreditnog (1/φ − 1).', kind: 'tf', answer: true },
        { q: 'Za ekspanziju gospodarstva stopa obveznih rezervi se povećava.', kind: 'tf', answer: false },
        { q: 'Povećanje kamatnjaka u zemlji izaziva:', kind: 'mc', options: ['pogoršanje vanjskotrgovinske bilance (restriktivna monetarna politika)', 'poboljšanje vanjskotrgovinske bilance', 'ekspanzivnu monetarnu politiku', 'nema utjecaja na gospodarstvo'], answer: 0 }
      ],
      solution: [
        'Ekspanzija: kupnja obveznica (novac ulazi u sustav), niža diskontna stopa, niže obvezne rezerve → veći multiplikator.',
        'Restrikcija (inflacijski jaz): prodaja obveznica, viša diskontna stopa, više obvezne rezerve.',
        'Viši kamatnjak privlači kapital → jača domaća valuta → izvoz slabi, uvoz raste → VT bilanca se pogoršava.'
      ]
    },

    {
      id: 'k2-novcani-multiplikator',
      lesson: 'second-midterm', chapter: 7, category: 'm2MonetaryPolicy',
      type: 'numeric',
      title: 'Stvaranje novca u bankama (Monetarna politika, primjer)',
      prompt: 'Poslovne banke prime depozit od 1 000 kn; stopa obvezne rezerve φ = 20 %. Izračunajte obveznu rezervu i kredit prve banke, novi novac koji stvara druga banka, ukupni novac u sustavu, novčani i kreditni multiplikator te najveći iznos kredita.',
      difficulty: 1,
      fields: [
        { key: 'res', label: 'Obvezna rezerva prve banke', answer: 200, tol: 0.01, unit: 'kn', hint: '20 % od 1 000' },
        { key: 'kr1', label: 'Kredit prve banke', answer: 800, tol: 0.01, unit: 'kn', hint: '1 000 − 200' },
        { key: 'kr2', label: 'Novi novac druge banke', answer: 640, tol: 0.01, unit: 'kn', hint: '800 · (1 − 0,2)' },
        { key: 'tot', label: 'Ukupni novac u sustavu', answer: 5000, tol: 0.01, unit: 'kn', hint: '1 000 / 0,2' },
        { key: 'mm', label: 'Novčani multiplikator 1/φ', answer: 5, tol: 0.001, unit: '', hint: '1/0,2' },
        { key: 'km', label: 'Kreditni multiplikator 1/φ − 1', answer: 4, tol: 0.001, unit: '', hint: '5 − 1' },
        { key: 'kmax', label: 'Najveći ukupni iznos kredita', answer: 4000, tol: 0.01, unit: 'kn', hint: '1 000 · 4' }
      ],
      solution: [
        'Prva banka drži 200 kn rezerve, 800 kn plasira kao kredit; kad ih druga banka primi kao depozit, stvara 640 kn novog novca itd.',
        'Ukupno: 1 000/0,2 = 5 000 kn → novčani multiplikator 5; kreditni multiplikator 5 − 1 = 4 (krediti 4 000 kn) — uvijek manji od novčanog.',
        'Niža stopa obvezne rezerve → veći multiplikatori → ekspanzija.'
      ]
    },

    {
      id: 'k2-novcani-multiplikator-random',
      lesson: 'second-midterm', chapter: 7, category: 'm2MonetaryPolicy',
      type: 'numeric',
      title: 'Novčani i kreditni multiplikator — vježba',
      prompt: 'Novčani multiplikator 1/φ; kreditni multiplikator 1/φ − 1.',
      difficulty: 1,
      params: {
        phi: { choices: [5, 10, 20, 25, 40, 50] },
        D: { min: 500, max: 5000, step: 500 }
      },
      generate(p) {
        const f = p.phi / 100;
        const mm = 1 / f, km = mm - 1;
        return {
          prompt: 'Stopa obvezne rezerve iznosi ' + p.phi + ' %, a u banke je uplaćen novi depozit od ' + fmt(p.D, 0) + ' EUR. Izračunajte multiplikatore, kredit koji može odobriti prva banka te najveći ukupni novac i kredite koje bankarski sustav može stvoriti.',
          fields: [
            { key: 'mm', label: 'Novčani multiplikator', answer: r2(mm), tol: 0.01, unit: '', hint: '1/φ' },
            { key: 'km', label: 'Kreditni multiplikator', answer: r2(km), tol: 0.01, unit: '', hint: '1/φ − 1' },
            { key: 'k1', label: 'Kredit prve banke (EUR)', answer: r2(p.D * (1 - f)), tol: 0.01, unit: '€', hint: 'D · (1 − φ)' },
            { key: 'M', label: 'Najveći ukupni novac (EUR)', answer: r2(p.D * mm), tol: 0.01, unit: '€', hint: 'D / φ' },
            { key: 'K', label: 'Najveći ukupni krediti (EUR)', answer: r2(p.D * km), tol: 0.01, unit: '€', hint: 'D · (1/φ − 1)' }
          ],
          solution: [
            'Novčani multiplikator = 1/' + num(f, 2) + ' = ' + num(mm, 2) + '; kreditni = ' + num(km, 2) + '.',
            'Prva banka: rezerva ' + fmt(p.D * f) + ', kredit ' + fmt(p.D * (1 - f)) + ' EUR.',
            'Sustav: novac do ' + fmt(p.D * mm) + ' EUR, krediti do ' + fmt(p.D * km) + ' EUR.'
          ]
        };
      },
      solution: ['ΔM = D/φ; ΔK = D(1/φ − 1).']
    },

    {
      id: 'k2-kvantitativna-random',
      lesson: 'second-midterm', chapter: 7, category: 'm2Money',
      type: 'numeric',
      title: 'Kvantitativna teorija novca — vježba',
      prompt: 'Verzija dohotka: M·V = P·Y; Cambridge: M = k·P·Y, k = 1/V.',
      difficulty: 1,
      params: {
        V: { choices: [2, 4, 5, 10] },
        P: { choices: [1, 1.2, 1.5, 2] },
        Y: { min: 100, max: 1000, step: 50 },
        g: { choices: [10, 20, 50] }
      },
      generate(p) {
        const M = p.P * p.Y / p.V, k = 1 / p.V;
        const M2 = M * (1 + p.g / 100);
        return {
          prompt: 'Realni dohodak Y = ' + p.Y + ' mlrd, razina cijena P = ' + num(p.P, 1) + ', brzina optjecaja novca V = ' + p.V
            + '. Izračunajte potrebnu količinu novca, Cambridge koeficijent k i razinu cijena ako se količina novca poveća ' + p.g + ' % (V i Y nepromijenjeni; 2 decimale).',
          fields: [
            { key: 'M', label: 'Količina novca M (mlrd)', answer: r2(M), tol: 0.01, unit: '', hint: 'P·Y / V' },
            { key: 'k', label: 'Koeficijent k', answer: r2(k), tol: 0.001, unit: '', hint: '1/V' },
            { key: 'P2', label: 'Nova razina cijena', answer: r2(p.P * (1 + p.g / 100)), tol: 0.01, unit: '', hint: 'P = M·V / Y' }
          ],
          solution: [
            'M = ' + num(p.P, 1) + ' · ' + p.Y + '/' + p.V + ' = ' + fmt(M) + '; k = 1/' + p.V + ' = ' + num(k, 2) + '.',
            'M raste ' + p.g + ' % na ' + fmt(M2) + ' → P = M·V/Y = ' + fmt(M2 * p.V / p.Y) + ': uz stalne V i Y cijene rastu proporcionalno količini novca (kvantitativna teorija).'
          ]
        };
      },
      solution: ['M = P·Y/V; k = 1/V.']
    },

    // =====================================================================
    // PREDAVANJE 8 — RAVNOTEŽA NA ROBNOM I NOVČANOM TRŽIŠTU: IS-LM (second-midterm)
    // =====================================================================
    {
      id: 'k2-is-lm-vj9',
      lesson: 'second-midterm', chapter: 8, category: 'm2IsLm',
      type: 'numeric',
      title: 'Izvođenje IS i LM krivulje i ravnoteža (Vježba 9)',
      prompt: 'Robno tržište: C = 50 + 0,8·Y, I = 100 − 10·r. Novčano tržište: M/P = 125, L1 = 0,5·Y, L2 = 100 − 25·r (r u postocima). '
        + 'IS zapišite kao Y = a − b·r, a LM kao Y = c + d·r. Izračunajte koeficijente, Y na IS i LM uz r = 4 % te ravnotežu.',
      difficulty: 2,
      fields: [
        { key: 'a', label: 'IS: slobodni član a', answer: 750, tol: 0.01, unit: '', hint: '0,2Y = 150 − 10r' },
        { key: 'b', label: 'IS: koeficijent b (iznos uz r)', answer: 50, tol: 0.01, unit: '', hint: '10/0,2' },
        { key: 'is4', label: 'Y na IS uz r = 4 %', answer: 550, tol: 0.01, unit: '', hint: '750 − 50·4' },
        { key: 'c', label: 'LM: slobodni član c', answer: 50, tol: 0.01, unit: '', hint: '125 = 0,5Y + 100 − 25r' },
        { key: 'd', label: 'LM: koeficijent d', answer: 50, tol: 0.01, unit: '', hint: '25/0,5' },
        { key: 'lm4', label: 'Y na LM uz r = 4 %', answer: 250, tol: 0.01, unit: '', hint: '50 + 50·4' },
        { key: 'r', label: 'Ravnotežni kamatnjak r*', answer: 7, tol: 0.01, unit: '%', hint: '750 − 50r = 50 + 50r' },
        { key: 'Y', label: 'Ravnotežni Y*', answer: 400, tol: 0.01, unit: '', hint: 'uvrstite r* u IS ili LM' }
      ],
      solution: [
        'IS: Y = 50 + 0,8Y + 100 − 10r → 0,2Y = 150 − 10r → Y = 750 − 50r (opadajuća: viši r → manje investicija → manji Y; uz r = 6 % Y = 450).',
        'LM: 125 = 0,5Y + 100 − 25r → Y = 50 + 50r (rastuća: uz r = 6 % Y = 350).',
        'Ravnoteža: 750 − 50r = 50 + 50r → r* = 7 %, Y* = 400 (provjera: IS 750 − 350 = 400, LM 50 + 350 = 400).',
        '⚠ Brojevi su doslovno iz Vježbe 9. U točki ravnoteže špekulativna potražnja ispada L2 = 100 − 25 · 7 = −75 < 0, što ekonomski nije moguće — primjer služi samo za tehniku izvođenja IS/LM i računanja sjecišta.'
      ]
    },

    {
      id: 'k2-is-random',
      lesson: 'second-midterm', chapter: 8, category: 'm2GoodsMarketIS',
      type: 'numeric',
      title: 'Funkcija ravnoteže na robnom tržištu (IS) — vježba',
      prompt: 'Y = C + I, C = α + β·Y, I = I₀ − b·r → Y = (α + I₀)/(1 − β) − b/(1 − β)·r.',
      difficulty: 2,
      params: {
        a: { min: 40, max: 200, step: 20 },
        b: { choices: [0.75, 0.8, 0.9] },
        I0: { min: 100, max: 300, step: 20 },
        h: { choices: [5, 10, 20] },
        r: { min: 2, max: 8, step: 1 }
      },
      generate(p) {
        const m = 1 / (1 - p.b);
        const A = (p.a + p.I0) * m, B = p.h * m;
        // r ograničen tako da je Y > 0 i da su investicije u točki računa pozitivne (I = I₀ − b·r > 0)
        const r = Math.max(1, Math.min(p.r, Math.floor(0.7 * A / B), Math.floor(0.8 * p.I0 / p.h)));
        const Y = A - B * r;
        return {
          prompt: 'Autonomna potrošnja ' + p.a + ', granična sklonost potrošnji ' + num(p.b, 2) + ', funkcija investicija I = ' + p.I0 + ' − ' + p.h
            + 'r. Kako glasi IS (Y = a − b·r) i koliki je domaći proizvod uz kamatnjak ' + r + ' %?',
          fields: [
            { key: 'A', label: 'IS: slobodni član a', answer: r2(A), tol: 0.01, unit: '', hint: '(α + I₀)/(1 − β)' },
            { key: 'B', label: 'IS: koeficijent b (iznos uz r)', answer: r2(B), tol: 0.01, unit: '', hint: 'koeficijent investicija/(1 − β)' },
            { key: 'Y', label: 'Y uz r = ' + r + ' %', answer: r2(Y), tol: 0.01, unit: '', hint: 'a − b·r' }
          ],
          solution: [
            'Y = ' + p.a + ' + ' + num(p.b, 2) + 'Y + ' + p.I0 + ' − ' + p.h + 'r → ' + num(1 - p.b, 2) + 'Y = ' + (p.a + p.I0) + ' − ' + p.h + 'r.',
            'IS: Y = ' + fmt(A, 0) + ' − ' + fmt(B, 0) + 'r; uz r = ' + r + ' %: Y = ' + fmt(Y) + '.',
            'Viši kamatnjak smanjuje investicije i proizvod — IS je opadajuća.'
          ]
        };
      },
      solution: ['IS: Y = (α + I₀)/(1 − β) − b/(1 − β)·r.']
    },

    {
      id: 'k2-lm-random',
      lesson: 'second-midterm', chapter: 8, category: 'm2MoneyMarketLM',
      type: 'numeric',
      title: 'Funkcija ravnoteže na novčanom tržištu (LM) — vježba',
      prompt: 'M/P = k·Y + (l₀ − h·r) → Y = (M/P − l₀)/k + (h/k)·r.',
      difficulty: 2,
      params: {
        k: { choices: [0.1, 0.2, 0.25, 0.4, 0.5] },
        l0: { min: 50, max: 150, step: 10 },
        h: { choices: [5, 10, 20, 25] },
        ex: { min: 20, max: 200, step: 10 },
        r: { min: 2, max: 8, step: 1 }
      },
      generate(p) {
        const M = p.l0 + p.ex;
        // r ograničen tako da je špekulativna potražnja u točki računa pozitivna (L2 = l₀ − h·r > 0)
        const r = Math.max(1, Math.min(p.r, Math.floor(0.8 * p.l0 / p.h)));
        const C0 = p.ex / p.k, D = p.h / p.k;
        const Y = C0 + D * r;
        return {
          prompt: 'Transakcijska potražnja za novcem k(Y) = ' + num(p.k, 2) + 'Y, špekulativna l(r) = ' + p.l0 + ' − ' + p.h + 'r, ponuda novca M/P = ' + M
            + '. Kako glasi LM (Y = c + d·r) i koliki je domaći proizvod uz kamatnjak ' + r + ' %?',
          fields: [
            { key: 'c', label: 'LM: slobodni član c', answer: r2(C0), tol: 0.01, unit: '', hint: '(M/P − l₀)/k' },
            { key: 'd', label: 'LM: koeficijent d', answer: r2(D), tol: 0.01, unit: '', hint: 'h/k' },
            { key: 'Y', label: 'Y uz r = ' + r + ' %', answer: r2(Y), tol: 0.01, unit: '', hint: 'c + d·r' }
          ],
          solution: [
            M + ' = ' + num(p.k, 2) + 'Y + ' + p.l0 + ' − ' + p.h + 'r → ' + num(p.k, 2) + 'Y = ' + p.ex + ' + ' + p.h + 'r.',
            'LM: Y = ' + fmt(C0) + ' + ' + fmt(D) + 'r; uz r = ' + r + ' %: Y = ' + fmt(Y) + '.',
            'Viši dohodak traži više transakcijskog novca; uz fiksnu ponudu to je moguće samo uz viši kamatnjak (manje L2) — LM je rastuća.'
          ]
        };
      },
      solution: ['LM: Y = (M/P − l₀)/k + (h/k)·r.']
    },

    {
      id: 'k2-islm-ravnoteza-random',
      lesson: 'second-midterm', chapter: 8, category: 'm2IsLm',
      type: 'numeric',
      title: 'IS-LM ravnoteža — vježba',
      prompt: 'Izvedite IS i LM te izračunajte ravnotežni kamatnjak i domaći proizvod.',
      difficulty: 3,
      params: {
        s: { choices: [
          // svaki scenarij: u ravnoteži I = I₀ − h·r > 0 i L2 = l₀ − h_L·r > 0
          { a: 80, b: 0.6, I0: 200, h: 10, k: 0.1, l0: 100, hl: 5, M: 140 },
          { a: 140, b: 0.6, I0: 120, h: 10, k: 0.4, l0: 100, hl: 10, M: 220 },
          { a: 40, b: 0.75, I0: 120, h: 5, k: 0.25, l0: 100, hl: 5, M: 180 },
          { a: 140, b: 0.75, I0: 120, h: 5, k: 0.1, l0: 100, hl: 4, M: 180 },
          { a: 40, b: 0.8, I0: 120, h: 20, k: 0.25, l0: 100, hl: 5, M: 180 },
          { a: 80, b: 0.8, I0: 120, h: 10, k: 0.2, l0: 100, hl: 10, M: 160 },
          { a: 40, b: 0.9, I0: 120, h: 15, k: 0.2, l0: 100, hl: 10, M: 180 }
        ] }
      },
      generate(p) {
        const s = p.s;
        const A = (s.a + s.I0) / (1 - s.b), B = s.h / (1 - s.b);
        const C0 = (s.M - s.l0) / s.k, D = s.hl / s.k;
        const r = (A - C0) / (B + D);
        const Y = A - B * r;
        return {
          prompt: 'C = ' + s.a + ' + ' + num(s.b, 2) + 'Y, I = ' + s.I0 + ' − ' + s.h + 'r; k(Y) = ' + num(s.k, 2) + 'Y, l(r) = ' + s.l0 + ' − ' + s.hl + 'r, M/P = ' + s.M
            + ' (r u postocima). Izračunajte ravnotežni kamatnjak i ravnotežni domaći proizvod (2 decimale).',
          fields: [
            { key: 'r', label: 'Ravnotežni kamatnjak r*', answer: r2(r), tol: 0.01, unit: '%', hint: 'IS = LM' },
            { key: 'Y', label: 'Ravnotežni Y*', answer: r2(Y), tol: tolR(Y, 0.001), unit: '', hint: 'uvrstite r* u IS' }
          ],
          solution: [
            'IS: Y = ' + fmt(A, 0) + ' − ' + fmt(B, 0) + 'r;  LM: Y = ' + fmt(C0, 0) + ' + ' + fmt(D, 0) + 'r.',
            fmt(A, 0) + ' − ' + fmt(B, 0) + 'r = ' + fmt(C0, 0) + ' + ' + fmt(D, 0) + 'r → r* = ' + fmt(A - C0, 0) + '/' + fmt(B + D, 0) + ' = ' + fmt(r) + ' %.',
            'Y* = ' + fmt(A, 0) + ' − ' + fmt(B, 0) + ' · ' + fmt(r) + ' = ' + fmt(Y) + ' (u toj su točki istodobno u ravnoteži robno i novčano tržište).'
          ]
        };
      },
      solution: ['Izjednačite IS i LM: a − b·r = c + d·r → r* = (a − c)/(b + d).']
    },

    {
      id: 'k2-vj9-izbor',
      lesson: 'second-midterm', chapter: 8, category: 'm2IsLm',
      type: 'choice',
      title: 'Vježba 9 — ponuđeni odgovori',
      prompt: 'Odaberite točan odgovor.',
      difficulty: 2,
      items: [
        { q: '1. Autonomna potrošnja 140, granična sklonost potrošnji 0,8, investicije 200 − 40r. Funkcija ravnoteže na robnom tržištu:', kind: 'mc', options: ['Y = 1 400 − 50r', 'Y = 1 700 − 200r', 'Y = 1 300 − 150r', 'Y = 1 000 + 20r'], answer: 1 },
        { q: '2. Ako je kamatnjak 5 %, domaći proizvod iznosi:', kind: 'mc', options: ['1 000', '800', '700', '500'], answer: 2 },
        { q: '3. k(Y) = 0,4Y, l(r) = 120 − 20r, M/P = 160. Funkcija ravnoteže na novčanom tržištu:', kind: 'mc', options: ['Y = 200 + 10r', 'Y = 133 + 67r', 'Y = 100 + 50r', 'Y = 300 + 20r'], answer: 2 },
        { q: '4. Ako je kamatnjak 3 %, domaći proizvod iznosi:', kind: 'mc', options: ['167', '200', '250', '150'], answer: 2 }
      ],
      solution: [
        '1. 0,2Y = 340 − 40r → Y = 1 700 − 200r; 2. Y = 1 700 − 1 000 = 700.',
        '3. 160 = 0,4Y + 120 − 20r → Y = 100 + 50r; 4. Y = 100 + 150 = 250.'
      ]
    },

    {
      id: 'k2-is-lm-pomaci',
      lesson: 'second-midterm', chapter: 8, category: 'm2IsLm',
      type: 'choice',
      title: 'Što pomiče IS, a što LM?',
      prompt: 'Priprema za 2. kolokvij, pitanja 20–24, i Vježba 9. Točno ili netočno?',
      difficulty: 2,
      items: [
        { q: 'Veličina autonomnih investicija utječe na IS krivulju.', kind: 'tf', answer: true },
        { q: 'Promjena ponude novca utječe na IS krivulju.', kind: 'tf', answer: false },
        { q: 'Promjena granične sklonosti štednji utječe na IS krivulju.', kind: 'tf', answer: true },
        { q: 'Promjena javne potrošnje utječe na LM krivulju.', kind: 'tf', answer: false },
        { q: 'Promjena cijena (realne novčane ponude M/P) utječe na LM krivulju.', kind: 'tf', answer: true },
        { q: 'Promjena transakcijske potražnje za novcem utječe na LM krivulju.', kind: 'tf', answer: true },
        { q: 'Ekspanzivna monetarna politika pomiče LM udesno.', kind: 'tf', answer: true },
        { q: 'Povećanje autonomne špekulativne potražnje za novcem pomiče LM ulijevo (restriktivno).', kind: 'tf', answer: true },
        { q: 'Porast cijena pomiče LM udesno.', kind: 'tf', answer: false },
        { q: 'Povećanje granične sklonosti štednji pomiče IS ulijevo.', kind: 'tf', answer: true },
        { q: 'Uvođenjem javne potrošnje i poreza ravnoteža robnog tržišta glasi I + G + TR = S + T.', kind: 'tf', answer: true }
      ],
      solution: [
        'IS (robno tržište): fiskalne varijable, autonomne investicije i njihova osjetljivost na r, granična sklonost štednji/potrošnji.',
        'LM (novčano tržište): ponuda novca, cijene (M/P), transakcijska (k, brzina optjecaja) i špekulativna potražnja.',
        'Porast cijena smanjuje realnu ponudu novca M/P → LM ulijevo.'
      ]
    },

    {
      id: 'k2-is-lm-politike',
      lesson: 'second-midterm', chapter: 8, category: 'm2IsLm',
      type: 'choice',
      title: 'Učinci politika u IS-LM modelu',
      prompt: 'Priprema za 2. kolokvij, pitanja 25–29 (grafički prikaz i efikasnost odluka). Odaberite točan opis.',
      difficulty: 3,
      items: [
        { q: 'Povećanje javne potrošnje:', kind: 'mc', options: ['IS udesno — Y raste, r raste (dio investicija se istiskuje)', 'IS udesno — Y raste, r pada', 'LM udesno — Y raste, r pada', 'IS ulijevo — Y pada'], answer: 0 },
        { q: 'Povećanje ponude novca:', kind: 'mc', options: ['LM udesno — Y raste, r pada, investicije rastu', 'LM ulijevo — Y pada, r raste', 'IS udesno — r raste', 'nema učinka na Y'], answer: 0 },
        { q: 'Smanjenje granične sklonosti štednji:', kind: 'mc', options: ['IS udesno — rastu Y i r', 'IS ulijevo — padaju Y i r', 'LM udesno', 'LM ulijevo'], answer: 0 },
        { q: 'Povećanje brzine optjecaja novca (manji koeficijent k u L1 = kY):', kind: 'mc', options: ['LM udesno — Y raste, r pada', 'LM ulijevo — Y pada, r raste', 'IS udesno', 'IS ulijevo'], answer: 0 },
        { q: 'Funkcija investicija promijeni se s I = 100 − 10r na I = 100 − 20r (veća osjetljivost na kamatnjak):', kind: 'mc', options: ['IS se pomiče ulijevo — restriktivna mjera, Y pada', 'IS se pomiče udesno — ekspanzivna mjera', 'LM se pomiče udesno', 'nema promjene'], answer: 0 },
        { q: 'Monetarna ekspanzija povećava BDP uz niži kamatnjak, pa se investicije ne istiskuju nego rastu.', kind: 'tf', answer: true }
      ],
      solution: [
        'Fiskalna ekspanzija: veći Y povećava transakcijsku potražnju za novcem → viši r → dio investicija se istiskuje (preraspodjela u korist G).',
        'Monetarna ekspanzija: veća M/P → niži r → više investicija → veći Y.',
        'Veći koeficijent uz r u funkciji investicija (−20 umjesto −10) uz isti r daje manje investicija → IS ulijevo (Vježba 9).'
      ]
    },

    // =====================================================================
    // PREDAVANJE 9 — OTVORENO GOSPODARSTVO I PLATNA BILANCA (second-midterm)
    // =====================================================================
    {
      id: 'k2-uvoz-vtb',
      lesson: 'second-midterm', chapter: 9, category: 'm2OpenEconomy',
      type: 'numeric',
      title: 'Funkcija uvoza i vanjskotrgovinska bilanca (Aktivnost 2, zad. 2)',
      prompt: 'Autonomni uvoz U₀ = 100, granična sklonost uvozu m = 0,1, izvoz E = 500, proizvodnja Y = 1 000. Izračunajte uvoz, saldo VTB, prosječnu sklonost uvozu, elastičnost uvoza prema Y i pokrivenost uvoza izvozom.',
      difficulty: 1,
      fields: [
        { key: 'U', label: 'Uvoz U', answer: 200, tol: 0.01, unit: '', hint: '100 + 0,1·1 000' },
        { key: 'vtb', label: 'VTB = E − U', answer: 300, tol: 0.01, unit: '', hint: '500 − 200' },
        { key: 'apm', label: 'Prosječna sklonost uvozu U/Y', answer: 0.2, tol: 0.001, unit: '', hint: '200/1 000' },
        { key: 'el', label: 'Elastičnost uvoza prema Y', answer: 0.5, tol: 0.001, unit: '', hint: 'm/(U/Y)' },
        { key: 'cov', label: 'Pokrivenost uvoza izvozom E/U', answer: 250, tol: 0.01, unit: '%', hint: '500/200 · 100' }
      ],
      solution: [
        'U = U₀ + m·Y = 100 + 0,1 · 1 000 = 200; VTB = 500 − 200 = 300 → vanjskotrgovinski SUFICIT (zemlja više izvozi nego uvozi; pozitivna VTB potiče rast BDP-a).',
        'U/Y = 0,2; elastičnost = 0,1/0,2 = 0,5 < 1 (jer je U₀ > 0); pokrivenost 250 %.'
      ]
    },

    {
      id: 'k2-vtb-random',
      lesson: 'second-midterm', chapter: 9, category: 'm2OpenEconomy',
      type: 'numeric',
      title: 'Uvoz, VTB i pokazatelji otvorenosti — vježba',
      prompt: 'U = U₀ + m·Y; VTB = E − U; pokazatelji E/BDP, U/BDP, E/U.',
      difficulty: 2,
      params: {
        U0: { min: 20, max: 150, step: 10 },
        m: { choices: [0.05, 0.1, 0.15, 0.2, 0.25] },
        Y: { min: 500, max: 2000, step: 100 },
        s: { min: 20, max: 200, step: 20 }
      },
      generate(p) {
        p = Object.assign({}, p);
        for (let i = 0; i < 80; i++) {
          const uu = p.U0 + p.m * p.Y, ee = uu + p.s;
          if (!ok3(uu, uu / p.Y * 100, p.m * p.Y / uu)) { p.U0 += 10; continue; }
          if (ok3(ee, ee / p.Y * 100, ee / uu * 100)) break;
          p.s += 20;
        }
        const U = p.U0 + p.m * p.Y;
        const E = U + p.s;
        const el = p.m / (U / p.Y);
        return {
          prompt: 'Autonomni uvoz ' + p.U0 + ', granična sklonost uvozu ' + num(p.m, 2) + ', domaći proizvod ' + fmt(p.Y, 0) + ', izvoz ' + num(E, 2)
            + ' mlrd EUR. Izračunajte uvoz, saldo VTB, udio izvoza i uvoza u BDP-u (%), pokrivenost uvoza izvozom (%) i elastičnost uvoza (2 decimale).',
          fields: [
            { key: 'U', label: 'Uvoz U', answer: r2(U), tol: 0.01, unit: '', hint: 'U₀ + m·Y' },
            { key: 'vtb', label: 'VTB = E − U', answer: r2(E - U), tol: 0.01, unit: '', hint: 'izvoz − uvoz' },
            { key: 'eY', label: 'Udio izvoza E/BDP', answer: r2(E / p.Y * 100), tol: 0.01, unit: '%', hint: 'E/Y · 100' },
            { key: 'uY', label: 'Udio uvoza U/BDP', answer: r2(U / p.Y * 100), tol: 0.01, unit: '%', hint: 'U/Y · 100' },
            { key: 'cov', label: 'Pokrivenost uvoza izvozom', answer: r2(E / U * 100), tol: 0.01, unit: '%', hint: 'E/U · 100' },
            { key: 'el', label: 'Elastičnost uvoza prema Y', answer: r2(el), tol: 0.01, unit: '', hint: 'm / (U/Y)' }
          ],
          solution: [
            'U = ' + p.U0 + ' + ' + num(p.m, 2) + ' · ' + fmt(p.Y, 0) + ' = ' + fmt(U) + '; VTB = ' + fmt(E - U) + ' → suficit.',
            'E/BDP = ' + fmt(E / p.Y * 100) + ' % (poželjno što veći), U/BDP = ' + fmt(U / p.Y * 100) + ' % (poželjno što manji), pokrivenost = ' + fmt(E / U * 100) + ' %.',
            'Elastičnost uvoza = ' + num(p.m, 2) + '/' + num(U / p.Y, 4) + ' = ' + fmt(el) + ' < 1 (U₀ > 0).'
          ]
        };
      },
      solution: ['U = U₀ + mY; elastičnost uvoza = m/(U/Y).']
    },

    {
      id: 'k2-otvoreni-multiplikator',
      lesson: 'second-midterm', chapter: 9, category: 'm2OpenEconomy',
      type: 'numeric',
      title: 'Multiplikator otvorenog gospodarstva (Otvorena ekonomija, zad. 1)',
      prompt: 'Četverosektorski model: C = 0,8·Yd + 120, T = 0,1·Y, U = 0,12·Y, I = G = E = 100. Izračunajte multiplikator bez uvoza, s uvozom, ravnotežni Y, uvoz i iznos salda VTB (2 decimale).',
      difficulty: 3,
      fields: [
        { key: 'm1', label: 'Multiplikator bez uvoza', answer: r2(1 / 0.28), tol: 0.01, unit: '', hint: '1/(1 − 0,8·0,9)' },
        { key: 'm2', label: 'Multiplikator s uvozom', answer: 2.5, tol: 0.01, unit: '', hint: '1/(1 − 0,8·0,9 + 0,12)' },
        { key: 'Y', label: 'Ravnotežni Y', answer: 1050, tol: 0.05, unit: '', hint: '(120 + 300)/0,4' },
        { key: 'U', label: 'Uvoz U', answer: 126, tol: 0.05, unit: '', hint: '0,12·Y' },
        { key: 'vtb', label: 'Iznos salda VTB |E − U|', answer: 26, tol: 0.05, unit: '', hint: '100 − 126' }
      ],
      solution: [
        'Bez uvoza: 1/(1 − 0,72) = 3,57; s uvozom: 1/(1 − 0,72 + 0,12) = 1/0,4 = 2,5 — uvoz SMANJUJE multiplikator (curenje iz kruga potrošnje).',
        'Y = 120 + 0,72Y + 300 − 0,12Y → 0,4Y = 420 → Y = 1 050; U = 126; E − U = 100 − 126 = −26 → vanjskotrgovinski DEFICIT od 26.'
      ]
    },

    {
      id: 'k2-otvoreni-multiplikator-random',
      lesson: 'second-midterm', chapter: 9, category: 'm2OpenEconomy',
      type: 'numeric',
      title: 'Multiplikator otvorenog gospodarstva — vježba',
      prompt: 'Zatvoreno: 1/(1 − β(1 − t)); otvoreno: 1/(1 − β(1 − t) + m).',
      difficulty: 2,
      params: {
        b: { choices: [0.75, 0.8, 0.9] },
        t: { choices: [0.1, 0.2, 0.25] },
        m: { choices: [0.05, 0.1, 0.12, 0.2] },
        dE: { min: 10, max: 100, step: 10 }
      },
      generate(p) {
        const d0 = 1 - p.b * (1 - p.t), d1 = d0 + p.m;
        const m0 = 1 / d0, m1 = 1 / d1;
        return {
          prompt: 'β = ' + num(p.b, 2) + ', t = ' + num(p.t * 100, 0) + ' %, granična sklonost uvozu m = ' + num(p.m, 2) + '. Izračunajte multiplikator bez uvoza, s uvozom i porast BDP-a ako izvoz poraste za ' + p.dE + ' (2 decimale).',
          fields: [
            { key: 'm0', label: 'Multiplikator bez uvoza', answer: r2(m0), tol: 0.01, unit: '', hint: '1/(1 − β(1 − t))' },
            { key: 'm1', label: 'Multiplikator s uvozom', answer: r2(m1), tol: 0.01, unit: '', hint: '1/(1 − β(1 − t) + m)' },
            { key: 'dY', label: 'Porast BDP-a zbog izvoza', answer: r2(m1 * p.dE), tol: tolR(m1 * p.dE, 0.003), unit: '', hint: 'multiplikator s uvozom · ΔE' }
          ],
          solution: [
            '1 − β(1 − t) = ' + num(d0, 4) + ' → multiplikator ' + fmt(m0) + '; uz uvoz nazivnik ' + num(d1, 4) + ' → ' + fmt(m1) + '.',
            'ΔY = ' + fmt(m1) + ' · ' + p.dE + ' = ' + fmt(m1 * p.dE) + '. Izvoz ima multiplikativne učinke, a uvoz ih smanjuje — što je m manji, multiplikator je veći.'
          ]
        };
      },
      solution: ['Multiplikator otvorenog gospodarstva = 1/(1 − β(1 − t) + m).']
    },

    {
      id: 'k2-platna-bilanca',
      lesson: 'second-midterm', chapter: 9, category: 'm2BalanceOfPayments',
      type: 'numeric',
      title: 'Bilance tekućeg računa (Priprema 2, zad. 5)',
      prompt: 'Robni izvoz 250, robni uvoz 320 mlrd USD. Prijevoz: izvoz usluga 120, uvoz 80. Putovanja: domaći turisti u inozemstvu potrošili 100, strani turisti u zemlji 200. Ostale usluge: suficit 50. '
        + 'Izračunajte bilance (iznose), pokrivenost robnog uvoza izvozom kao omjer (4 decimale) i pokrivenost kod prijevoza i putovanja u % (2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'rob', label: 'Robna bilanca — iznos DEFICITA', answer: 70, tol: 0.01, unit: '', hint: '250 − 320' },
        { key: 'put', label: 'Bilanca putovanja (turistička)', answer: 100, tol: 0.01, unit: '', hint: '200 − 100' },
        { key: 'usl', label: 'Bilanca usluga', answer: 190, tol: 0.01, unit: '', hint: '(120 − 80) + 100 + 50' },
        { key: 'tek', label: 'Bilanca robe i usluga (tekući dio)', answer: 120, tol: 0.01, unit: '', hint: '−70 + 190' },
        { key: 'pr', label: 'Pokrivenost robnog uvoza izvozom — omjer E/U (4 decimale)', answer: 250 / 320, tol: 0.0006, unit: '', hint: '250/320 (· 100 = postotak)' },
        { key: 'pu', label: 'Pokrivenost kod prijevoza i putovanja', answer: r2(320 / 180 * 100), tol: 0.01, unit: '%', hint: '(120 + 200)/(80 + 100) · 100' }
      ],
      solution: [
        'Robna bilanca = 250 − 320 = −70 → deficit 70. Bilanca putovanja = +100 (turizam = „nevidljivi izvoz”).',
        'Bilanca usluga = 40 + 100 + 50 = 190; robe i usluge = −70 + 190 = +120 → suficit; usluge (osobito turizam) pokrivaju robni deficit.',
        'Pokrivenost robnog uvoza izvozom 250/320 = 0,7813 (78,13 %), a kod prijevoza i putovanja 177,78 % (za ostale usluge zadan je samo saldo, pa njihov izvoz i uvoz nisu poznati).',
        'Napomena: puna bilanca tekućih transakcija uključuje i primarni i sekundarni dohodak — ovdje nisu zadani.'
      ]
    },

    {
      id: 'k2-otvoreno-pojmovi',
      lesson: 'second-midterm', chapter: 9, category: 'm2OpenEconomy',
      type: 'choice',
      title: 'Otvoreno gospodarstvo i platna bilanca',
      prompt: 'Predavanje „Otvorena ekonomija” i Priprema za 2. kolokvij. Točno ili netočno?',
      difficulty: 1,
      items: [
        { q: 'Otvorenost privrede mjeri se udjelom vanjske trgovine u BDP-u (E/BDP, U/BDP).', kind: 'tf', answer: true },
        { q: 'Poželjno je da pokazatelj U/BDP bude što veći.', kind: 'tf', answer: false },
        { q: 'Poželjno je da pokrivenost uvoza izvozom (E/U · 100) bude što veća i raste.', kind: 'tf', answer: true },
        { q: 'Uvoz ima multiplikativne učinke na domaći proizvod jednako kao izvoz.', kind: 'tf', answer: false },
        { q: 'Što je granična sklonost uvozu m manja, to je multiplikator veći.', kind: 'tf', answer: true },
        { q: 'Turizam je „nevidljivi izvoz”.', kind: 'tf', answer: true },
        { q: 'Bilanca putovanja (turistička bilanca) dio je bilance usluga.', kind: 'tf', answer: true },
        { q: 'Ako je autonomni uvoz U₀ > 0, elastičnost uvoza prema BDP-u manja je od 1.', kind: 'tf', answer: true },
        { q: 'Tekući račun platne bilance (od 2014.) čine:', kind: 'mc', options: ['robna razmjena, usluge te primarni i sekundarni dohodak', 'samo robna razmjena', 'kapitalni i financijski račun', 'samo turizam'], answer: 0 }
      ],
      solution: [
        'E/BDP poželjno veći, U/BDP manji, E − U suficit, pokrivenost veća.',
        'Uvoz „curi” iz domaćeg kruga potrošnje → smanjuje multiplikator: 1/(1 − β(1 − t) + m).',
        'U₀ > 0 → granična sklonost uvozu manja od prosječne → elastičnost < 1.'
      ]
    }
  ];

  return { meta: { lang: 'hr', currency: '', version: 1 }, exercises: exercises };
})();

if (typeof window !== 'undefined') window.macroeconomicsHrExercises = macroeconomicsHrExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = macroeconomicsHrExercises;
