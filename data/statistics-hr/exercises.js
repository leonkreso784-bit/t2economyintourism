// ===== STATISTIKA (HR) — VJEŽBE (content pack) =====
//
// CONTENT PACK (NE engine): interaktivne, auto-ocjenjive vježbe za `statistics-hr`.
// Generički engine (js/exercises-core.js, js/exercises.js) ne sadrži NIŠTA odavde — vidi
// docs/architecture/EXERCISES_ENGINE.md §2 (tipovi) + §3 (konvencije brojeva).
//
// IZVORI: seminari i predavanja FMTU 2025/26 (S_SEMINAR 3–7, SEMINAR 8–9, izvanredni seminari,
// RZ1 pregled formula, Statističke tablice). Notacija i pravila = teorija predmeta
// (data/statistics-hr/midterm-1.js, midterm-2.js) — osobito FMTU zapis metode uzorka:
//   s = σ (n > 50) · s = σ·√(n/(n−1)) (n ≤ 50) · s_x̄ = s/√n (n > 30) · s_x̄ = s/√(n−1) (n ≤ 30)
//   · faktor korekcije √((N−n)/(N−1)) samo kad je f = n/N > 0,05 · mali uzorak: t iz tablice, k = n − 1.
//
// KONVENCIJE:
//   - Tipovi: choice / numeric / ratio (tablica podataka ide u `givens`).
//   - `chapter` = broj predavanja (3 relativni brojevi … 9 vremenski nizovi); `category` = ključ
//     kategorije teorije (engine ga ignorira, služi sljedivosti).
//   - Brojevi u prikazu s DECIMALNIM ZAREZOM; KaTeX samo \( \) / \[ \] — nikad jedan dolar.
//   - Odgovori se traže na NAJVIŠE 2 decimale kad je cijeli dio ≠ 0: engineov parseAmount čita
//     „2,927” kao grupiranje tisuća (2927), a „0,937” ispravno kao decimalni broj.
//   - %-polja se upisuju kao broj (35, ne 0,35).
//   - Sve pomoćne funkcije su unutar IIFE-a → jedini globalni naziv je `statisticsHrExercises`
//     (EN pack istovremeno drži `statisticsExercises` i `var SL`; ovdje nema sudara).
//
// ⚠ Vježbe su KÔD (generate) → učitavaju se uvijek iz .js preko content.codeScripts (BUG-012).

const statisticsHrExercises = (function () {
  'use strict';

  // ---------- pomoćne funkcije (formatiranje i mala matematika) ----------
  function rnd(x, d) {
    const m = Math.pow(10, d);
    return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * m) / m;
  }
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
  // KaTeX inačice: {,} za decimalni zarez, \, za tisuće, obični minus.
  function toK(s) { return s.replace(',', '{,}').replace(/ /g, '\\,').replace('−', '-'); }
  function kf(x, d) { return toK(fmt(x, d)); }
  function kn(x, d) { return toK(num(x, d)); }
  function sum(a) { return a.reduce((s, v) => s + v, 0); }

  // Studentova razdioba — TABLICA 6 iz „Statističke tablice” (FMTU), stupci 0,05 (95 %) i 0,01 (99 %).
  const T95 = [null, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228,
    2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086,
    2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
  const T99 = [null, 63.657, 9.925, 5.841, 4.604, 4.032, 3.707, 3.499, 3.355, 3.250, 3.169,
    3.106, 3.055, 3.012, 2.977, 2.947, 2.921, 2.898, 2.878, 2.861, 2.845,
    2.831, 2.819, 2.807, 2.797, 2.787, 2.779, 2.771, 2.763, 2.756, 2.750];
  function tSmall(k, conf) { return conf === 99 ? T99[k] : T95[k]; }
  function tLarge(conf) { return conf === 99 ? 2.58 : 1.96; }

  // Ostaci ortogonalni na konstantu i na x = 0,1,2,3,4 → pravac najmanjih kvadrata je TOČNO
  // a + b·x (čisti a i b), a r < 1 jer točke ne leže na pravcu.
  const RES5 = [[1, -2, 0, 2, -1], [-1, 2, 0, -2, 1], [2, -1, -2, -1, 2], [-2, 1, 2, 1, -2], [0, 1, -2, 1, 0]];

  // Kvartil negrupiranog niza po FMTU pravilu (položaj r = N/4 ili 3N/4; necijeli → sljedeći
  // cijeli položaj; cijeli → poluzbroj x_r i x_(r+1)). `s` je uređen niz.
  function quartile(s, which) {
    const pos = which * s.length / 4;
    if (Math.abs(pos - Math.round(pos)) < 1e-9) {
      const r = Math.round(pos);
      return (s[r - 1] + s[r]) / 2;
    }
    return s[Math.ceil(pos) - 1];
  }
  function median(s) {
    const n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }

  const exercises = [
    // =====================================================================
    // PREDAVANJE 3 — RELATIVNI BROJEVI (first-midterm, relativeNumbers)
    // =====================================================================
    {
      id: 'hr3-koncepti',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'choice',
      title: 'Relativni brojevi — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Postoci i promili su relativni brojevi strukture.', kind: 'tf', answer: true },
        { q: 'Broj noćenja po turistu je relativni broj koordinacije.', kind: 'tf', answer: true },
        { q: 'Varzarov znak služi za grafički prikaz postotaka.', kind: 'tf', answer: false },
        { q: 'Indeks manji od 100 znači da je pojava manja od baze.', kind: 'tf', answer: true },
        { q: 'Stopa promjene jednaka je samom indeksu.', kind: 'tf', answer: false },
        { q: 'Zbroj relativnih frekvencija uvijek iznosi 1.', kind: 'tf', answer: true },
        { q: 'Indeks iznosi 67,12. Kolika je stopa promjene prema bazi?', kind: 'mc', options: ['67,12 %', '−32,88 %', '32,88 %', '−67,12 %'], answer: 1 },
        { q: 'U dvodimenzionalnoj tablici „vodoravno 100” znači da se svaki broj dijeli:', kind: 'mc', options: ['ukupnim brojem N', 'zbrojem svog reda', 'zbrojem svog stupca', 'najvećim brojem u tablici'], answer: 1 },
        { q: 'Kojim se grafikonom najčešće prikazuju relativni brojevi strukture?', kind: 'mc', options: ['Razdijeljenim (strukturnim) stupcima', 'Varzarovim znakom', 'Dijagramom rasipanja', 'Linijskim grafikonom s isprekidanom linijom'], answer: 0 }
      ],
      solution: [
        'Postoci i promili uspoređuju dio s cjelinom → relativni brojevi strukture.',
        'Relativni broj koordinacije (RBK) dijeli dvije srodne veličine (noćenja / turist, stanovnici / km²); prikazuje se jednostavnim stupcima ili Varzarovim znakom.',
        'Stopa promjene = indeks − 100, pa je uz indeks 67,12 stopa −32,88 % (pojava je 32,88 % manja od baze).'
      ]
    },

    {
      id: 'hr3-tablica-kutno-vodoravno-okomito',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'ratio',
      title: 'Kutno, vodoravno i okomito 100',
      prompt: 'Djelatnici poduzeća B prema stručnoj spremi (seminar 3). Izračunajte tražene postotke na 2 decimale.',
      difficulty: 1,
      givens: [
        { label: 'Vozači: VŠS / VSS / SSS / ukupno', value: '1 000 / 300 / 200 / 1 500' },
        { label: 'Nevozači: VŠS / VSS / SSS / ukupno', value: '100 / 100 / 300 / 500' },
        { label: 'Ukupno: VŠS / VSS / SSS / ukupno', value: '1 100 / 400 / 500 / 2 000' }
      ],
      fields: [
        { key: 'kutno', label: 'Kutno 100: nevozači sa SSS u odnosu na sve djelatnike', answer: 15, tol: 0.01, unit: '%', hint: '300 ÷ 2 000 · 100' },
        { key: 'kutnoV', label: 'Kutno 100: svi vozači u odnosu na sve djelatnike', answer: 75, tol: 0.01, unit: '%', hint: '1 500 ÷ 2 000 · 100' },
        { key: 'vodoravno', label: 'Vodoravno 100: udio SSS među nevozačima', answer: 60, tol: 0.01, unit: '%', hint: '300 ÷ 500 · 100 (zbroj reda)' },
        { key: 'okomito', label: 'Okomito 100: udio vozača među djelatnicima s VŠS', answer: 100000 / 1100, tol: 0.01, unit: '%', hint: '1 000 ÷ 1 100 · 100 (zbroj stupca)' }
      ],
      solution: [
        'Kutno 100 — sve prema N = 2 000: \\( \\frac{300}{2\\,000} \\cdot 100 = 15\\,\\% \\), a vozača je \\( \\frac{1\\,500}{2\\,000} \\cdot 100 = 75\\,\\% \\).',
        'Vodoravno 100 — prema zbroju reda: \\( \\frac{300}{500} \\cdot 100 = 60\\,\\% \\) nevozača ima SSS.',
        'Okomito 100 — prema zbroju stupca: \\( \\frac{1\\,000}{1\\,100} \\cdot 100 = 90{,}91\\,\\% \\) djelatnika s VŠS su vozači.',
        'Isti broj daje različite postotke — uvijek napiši od čega je postotak.'
      ]
    },

    {
      id: 'hr3-struktura-random',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'numeric',
      title: 'Struktura gostiju — postoci i promili',
      prompt: 'Izračunajte strukturu gostiju hotela prema zemlji podrijetla.',
      difficulty: 1,
      params: {
        de: { min: 300, max: 900, step: 10 },
        at: { min: 100, max: 500, step: 10 },
        si: { min: 50, max: 300, step: 10 },
        it: { min: 100, max: 400, step: 10 }
      },
      generate(p) {
        const N = p.de + p.at + p.si + p.it;
        const pDe = p.de / N * 100, pIt = p.it / N * 100, prSi = p.si / N * 1000;
        return {
          prompt: 'Hotel je u kolovozu ugostio ' + num(N) + ' gostiju: iz Njemačke ' + num(p.de) + ', Austrije ' + num(p.at)
            + ', Slovenije ' + num(p.si) + ' i Italije ' + num(p.it) + '. Izračunajte tražene relativne brojeve strukture na 2 decimale.',
          fields: [
            { key: 'de', label: 'Udio gostiju iz Njemačke', answer: pDe, tol: 0.01, unit: '%', hint: '\\( P = \\frac{D}{C} \\cdot 100 \\)' },
            { key: 'it', label: 'Udio gostiju iz Italije', answer: pIt, tol: 0.01, unit: '%', hint: 'dio ÷ cjelina · 100' },
            { key: 'si', label: 'Gosti iz Slovenije u promilima', answer: prSi, tol: 0.01, unit: '‰', hint: 'dio ÷ cjelina · 1 000' }
          ],
          solution: [
            'Cjelina: \\( N = ' + kn(p.de) + ' + ' + kn(p.at) + ' + ' + kn(p.si) + ' + ' + kn(p.it) + ' = ' + kn(N) + ' \\).',
            'Njemačka: \\( \\frac{' + kn(p.de) + '}{' + kn(N) + '} \\cdot 100 = ' + kf(pDe) + '\\,\\% \\).',
            'Italija: \\( \\frac{' + kn(p.it) + '}{' + kn(N) + '} \\cdot 100 = ' + kf(pIt) + '\\,\\% \\).',
            'Slovenija: \\( \\frac{' + kn(p.si) + '}{' + kn(N) + '} \\cdot 1\\,000 = ' + kf(prSi) + ' \\) ‰.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Postotak = dio ÷ cjelina · 100; promil = dio ÷ cjelina · 1 000.']
    },

    {
      id: 'hr3-bazni-indeks-random',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'numeric',
      title: 'Individualni bazni indeksi — hoteli lanca',
      prompt: 'Izračunajte indekse noćenja prema odabranom hotelu (baza = 100) i stope promjene.',
      difficulty: 1,
      params: {
        base: { min: 8000, max: 15000, step: 100 },
        a: { min: 4000, max: 24000, step: 100 },
        b: { min: 4000, max: 24000, step: 100 }
      },
      generate(p) {
        const Ia = p.a / p.base * 100, Ib = p.b / p.base * 100;
        return {
          prompt: 'Noćenja u srpnju: Hotel Riva ' + num(p.base) + ', Hotel Lovor ' + num(p.a) + ', Hotel Kvarner ' + num(p.b)
            + '. Uz Hotel Riva = 100 izračunajte indekse i stope promjene na 2 decimale.',
          fields: [
            { key: 'Ia', label: 'Indeks Hotela Lovor', answer: Ia, tol: 0.01, unit: '', hint: '\\( I = \\frac{f_i}{B} \\cdot 100 \\)' },
            { key: 'sa', label: 'Stopa promjene Hotela Lovor prema bazi', answer: Ia - 100, tol: 0.01, unit: '%', hint: 'I − 100' },
            { key: 'Ib', label: 'Indeks Hotela Kvarner', answer: Ib, tol: 0.01, unit: '', hint: 'noćenja Kvarner ÷ noćenja Riva · 100' },
            { key: 'sb', label: 'Stopa promjene Hotela Kvarner prema bazi', answer: Ib - 100, tol: 0.01, unit: '%', hint: 'I − 100' }
          ],
          solution: [
            'Lovor: \\( I = \\frac{' + kn(p.a) + '}{' + kn(p.base) + '} \\cdot 100 = ' + kf(Ia) + ' \\) → stopa \\( ' + kf(Ia - 100) + '\\,\\% \\).',
            'Kvarner: \\( I = \\frac{' + kn(p.b) + '}{' + kn(p.base) + '} \\cdot 100 = ' + kf(Ib) + ' \\) → stopa \\( ' + kf(Ib - 100) + '\\,\\% \\).',
            'Negativna stopa znači manje noćenja nego u baznom hotelu; indeks ispod 100 nije greška.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Indeks = vrijednost ÷ baza · 100; stopa promjene = indeks − 100.']
    },

    {
      id: 'hr3-rbk-random',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'ratio',
      title: 'Relativni brojevi koordinacije — noćenja po turistu',
      prompt: 'Izračunajte broj noćenja po turistu i usporedite ga s prosjekom svih mjesta.',
      difficulty: 2,
      params: {
        t1: { min: 800, max: 1600, step: 10 },
        n1: { min: 5000, max: 9000, step: 10 },
        t2: { min: 200, max: 600, step: 10 },
        n2: { min: 500, max: 1500, step: 10 },
        t3: { min: 300, max: 900, step: 10 },
        n3: { min: 600, max: 2000, step: 10 }
      },
      generate(p) {
        const R1 = p.n1 / p.t1;
        const Rall = (p.n1 + p.n2 + p.n3) / (p.t1 + p.t2 + p.t3);
        const I1 = R1 / Rall * 100;
        // Indeks iz RBK zaokruženih na 2 decimale smije proći jednako kao iz točnih.
        const I1r = rnd(R1, 2) / rnd(Rall, 2) * 100;
        const tolI = Math.max(0.02, Math.ceil((Math.abs(I1r - I1) + 0.01) * 100) / 100);
        return {
          prompt: 'Turisti i noćenja po vrsti mjesta (u tisućama). Izračunajte RBK i indeks na 2 decimale.',
          givens: [
            { label: 'Primorska mjesta — turisti / noćenja (000)', value: num(p.t1) + ' / ' + num(p.n1) },
            { label: 'Planinska mjesta — turisti / noćenja (000)', value: num(p.t2) + ' / ' + num(p.n2) },
            { label: 'Grad Zagreb — turisti / noćenja (000)', value: num(p.t3) + ' / ' + num(p.n3) }
          ],
          fields: [
            { key: 'r1', label: 'Noćenja po turistu u primorskim mjestima (2 decimale)', answer: R1, tol: 0.006, unit: '', hint: '\\( R = \\frac{v}{B} \\) = noćenja ÷ turisti' },
            { key: 'rall', label: 'Noćenja po turistu za sva mjesta ukupno (2 decimale)', answer: Rall, tol: 0.006, unit: '', hint: 'ukupna noćenja ÷ ukupni turisti' },
            { key: 'i1', label: 'Indeks primorskih mjesta prema prosjeku (prosjek = 100)', answer: I1, tol: tolI, unit: '', hint: 'RBK primorska ÷ RBK ukupno · 100 (smiješ uzeti RBK zaokružene na 2 decimale)' }
          ],
          solution: [
            'Primorska: \\( R = \\frac{' + kn(p.n1) + '}{' + kn(p.t1) + '} = ' + kf(R1, 2) + ' \\) noćenja po turistu.',
            'Sva mjesta: \\( R = \\frac{' + kn(p.n1 + p.n2 + p.n3) + '}{' + kn(p.t1 + p.t2 + p.t3) + '} = ' + kf(Rall, 2) + ' \\).',
            'Indeks prema prosjeku: \\( \\frac{' + kf(R1, 2) + '}{' + kf(Rall, 2) + '} \\cdot 100 = ' + kf(I1r) + ' \\) (s nezaokruženim RBK ' + fmt(I1) + '; prihvaća se oboje) — primorska mjesta imaju '
              + fmt(Math.abs(I1 - 100)) + ' % ' + (I1 >= 100 ? 'više' : 'manje') + ' noćenja po turistu od prosjeka.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. RBK = noćenja ÷ turisti; prosjek svih mjesta = ukupna noćenja ÷ ukupni turisti.']
    },

    {
      id: 'hr3-place-prosjek',
      lesson: 'first-midterm', chapter: 3, category: 'relativeNumbers',
      type: 'ratio',
      title: 'Indeksi prema prosjeku — neto plaće po djelatnostima',
      prompt: 'Prosječne neto plaće po radniku u 2013. (izvanredni seminar). Prosjek odabranih djelatnosti B = 5 508,40 kn. Rezultate zaokružite na 2 decimale.',
      difficulty: 1,
      givens: [
        { label: 'Građevinarstvo', value: '4 643 kn' },
        { label: 'Trgovina', value: '4 726 kn' },
        { label: 'Smještaj te priprema i usluživanje hrane', value: '4 819 kn' },
        { label: 'Financijske djelatnosti i osiguranje', value: '7 870 kn' },
        { label: 'Obrazovanje', value: '5 484 kn' }
      ],
      fields: [
        { key: 'iGr', label: 'Indeks građevinarstva (prosjek = 100)', answer: 4643 / 5508.4 * 100, tol: 0.01, unit: '', hint: '4 643 ÷ 5 508,40 · 100' },
        { key: 'sGr', label: 'Stopa promjene građevinarstva prema prosjeku', answer: 4643 / 5508.4 * 100 - 100, tol: 0.01, unit: '%', hint: 'I − 100' },
        { key: 'iFin', label: 'Indeks financijskih djelatnosti (prosjek = 100)', answer: 7870 / 5508.4 * 100, tol: 0.01, unit: '', hint: '7 870 ÷ 5 508,40 · 100' },
        { key: 'iObr', label: 'Indeks obrazovanja uz građevinarstvo = 100', answer: 5484 / 4643 * 100, tol: 0.01, unit: '', hint: 'nova baza: 5 484 ÷ 4 643 · 100' }
      ],
      solution: [
        'Građevinarstvo: \\( \\frac{4\\,643}{5\\,508{,}40} \\cdot 100 = 84{,}29 \\) → stopa \\( -15{,}71\\,\\% \\) (plaća je 15,71 % manja od prosjeka).',
        'Financijske djelatnosti: \\( \\frac{7\\,870}{5\\,508{,}40} \\cdot 100 = 142{,}87 \\) → 42,87 % više od prosjeka.',
        'Uz građevinarstvo = 100: obrazovanje \\( \\frac{5\\,484}{4\\,643} \\cdot 100 = 118{,}11 \\) → 18,11 % više nego u građevinarstvu.'
      ]
    },

    // =====================================================================
    // PREDAVANJE 4 — SREDNJE VRIJEDNOSTI (first-midterm, meanValues)
    // =====================================================================
    {
      id: 'hr4-koncepti',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'choice',
      title: 'Srednje vrijednosti — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Mod se može odrediti i za nominalni niz.', kind: 'tf', answer: true },
        { q: 'Medijan se može odrediti za nominalni niz.', kind: 'tf', answer: false },
        { q: 'Zbroj odstupanja vrijednosti od aritmetičke sredine uvijek je nula.', kind: 'tf', answer: true },
        { q: 'Prije određivanja medijana niz se mora urediti po veličini.', kind: 'tf', answer: true },
        { q: 'Mod je najveća frekvencija u nizu.', kind: 'tf', answer: false },
        { q: 'Ako je AS > Me, distribucija je pozitivno (desnostrano) asimetrična.', kind: 'tf', answer: true },
        { q: 'Koja se srednja vrijednost koristi za prosječnu stopu promjene u vremenskom nizu?', kind: 'mc', options: ['Aritmetička', 'Harmonijska', 'Geometrijska', 'Medijan'], answer: 2 },
        { q: 'Prosječno vrijeme čišćenja sobe kad sve sobarice rade isto radno vrijeme računa se:', kind: 'mc', options: ['aritmetičkom sredinom', 'harmonijskom sredinom', 'geometrijskom sredinom', 'modom'], answer: 1 },
        { q: 'Koje su srednje vrijednosti POLOŽAJNE?', kind: 'mc', options: ['AS i HS', 'Mod i medijan', 'GS i AS', 'Samo medijan'], answer: 1 }
      ],
      solution: [
        'Mod postoji za sve vrste nizova; medijan traži barem redoslijedni niz; AS, HS i GS samo numerički.',
        'Mod je VRIJEDNOST koja se najčešće pojavljuje, a ne sama frekvencija.',
        'Vremena s istim brojnikom (isto radno vrijeme) → harmonijska sredina; prosječna stopa promjene → geometrijska sredina.'
      ]
    },

    {
      id: 'hr4-negrupirani-random',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'numeric',
      title: 'Aritmetička sredina i medijan — negrupirani podaci',
      prompt: 'Izračunajte aritmetičku sredinu i medijan broja gostiju na doručku.',
      difficulty: 1,
      params: {
        a: { min: 40, max: 95, step: 1 }, b: { min: 40, max: 95, step: 1 }, c: { min: 40, max: 95, step: 1 },
        d: { min: 40, max: 95, step: 1 }, e: { min: 40, max: 95, step: 1 }, f: { min: 40, max: 95, step: 1 },
        g: { min: 40, max: 95, step: 1 }
      },
      generate(p) {
        const xs = [p.a, p.b, p.c, p.d, p.e, p.f, p.g];
        const s = xs.slice().sort((u, v) => u - v);
        const mean = sum(xs) / 7, me = s[3];
        return {
          prompt: 'Broj gostiju na doručku kroz 7 dana: ' + xs.join('; ') + '. Izračunajte aritmetičku sredinu (2 decimale) i medijan.',
          fields: [
            { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: mean, tol: 0.01, unit: '', hint: '\\( \\bar{x} = \\frac{\\sum x_i}{N} \\)' },
            { key: 'me', label: 'Medijan Me', answer: me, tol: 0.01, unit: '', hint: 'Uredi niz; N = 7 je neparan → položaj \\( r = \\frac{N+1}{2} = 4 \\)' }
          ],
          solution: [
            '\\( \\bar{x} = \\frac{' + kn(sum(xs)) + '}{7} = ' + kf(mean) + ' \\) gostiju.',
            'Uređeni niz: ' + s.join('; ') + ' → 4. član je Me = ' + me + '.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. AS = zbroj ÷ N; medijan je središnji član uređenog niza.']
    },

    {
      id: 'hr4-paran-niz',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'numeric',
      title: 'Paran broj podataka — AS, medijan i mod',
      prompt: 'Broj dana boravka 12 gostiju: 5, 2, 9, 2, 12, 3, 2, 7, 2, 4, 8, 2. Izračunajte aritmetičku sredinu (2 decimale), medijan i mod.',
      difficulty: 1,
      fields: [
        { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: 58 / 12, tol: 0.01, unit: 'dana', hint: 'Zbroj je 58' },
        { key: 'me', label: 'Medijan Me', answer: 3.5, tol: 0.01, unit: 'dana', hint: 'N = 12 paran → poluzbroj 6. i 7. člana uređenog niza' },
        { key: 'mo', label: 'Mod Mo', answer: 2, tol: 0.01, unit: 'dana', hint: 'Vrijednost koja se najčešće pojavljuje' }
      ],
      solution: [
        '\\( \\bar{x} = \\frac{58}{12} = 4{,}83 \\) dana.',
        'Uređeno: 2 2 2 2 2 3 4 5 7 8 9 12 → \\( M_e = \\frac{3 + 4}{2} = 3{,}5 \\) dana.',
        'Vrijednost 2 pojavljuje se pet puta → Mo = 2 (ne 5!).'
      ]
    },

    {
      id: 'hr4-vagana-random',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'ratio',
      title: 'Grupirani podaci bez razreda — otkazi rezervacija',
      prompt: 'Iz distribucije frekvencija izračunajte vaganu aritmetičku sredinu, medijan i mod.',
      difficulty: 2,
      params: {
        pk: { choices: [1, 2] },
        f0: { min: 2, max: 12, step: 1 }, f1: { min: 2, max: 12, step: 1 }, f2: { min: 2, max: 12, step: 1 },
        f3: { min: 2, max: 12, step: 1 }, f4: { min: 2, max: 12, step: 1 }, f5: { min: 2, max: 12, step: 1 },
        top: { min: 14, max: 20, step: 1 }
      },
      generate(p) {
        const f = [p.f0, p.f1, p.f2, p.f3, p.f4, p.f5];
        f[p.pk] = p.top;
        if (sum(f) % 2 === 0) f[5] += 1; // neparan N → N/2 nije cijeli broj (jednoznačan medijan)
        const N = sum(f);
        const sfx = sum(f.map((fi, x) => fi * x));
        const mean = sfx / N;
        let cum = 0, me = 0;
        for (let x = 0; x < 6; x++) { cum += f[x]; if (cum >= N / 2) { me = x; break; } }
        const cums = []; cum = 0; f.forEach((fi) => { cum += fi; cums.push(cum); });
        return {
          prompt: 'Broj otkazanih rezervacija po letu (xᵢ) i broj letova (fᵢ), ukupno N = ' + N + ' letova. AS izračunajte na 2 decimale.',
          givens: f.map((fi, x) => ({ label: 'xᵢ = ' + x + ' otkaza', value: fi + ' letova' })),
          fields: [
            { key: 'as', label: 'Vagana aritmetička sredina \\( \\bar{x} \\)', answer: mean, tol: 0.01, unit: 'otkaza', hint: '\\( \\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} \\)' },
            { key: 'me', label: 'Medijan Me', answer: me, tol: 0.01, unit: 'otkaza', hint: 'Kumulativ „manje od”: prva vrijednost u kojoj dosegne N/2 = ' + num(N / 2, 1) },
            { key: 'mo', label: 'Mod Mo', answer: p.pk, tol: 0.01, unit: 'otkaza', hint: 'Vrijednost xᵢ s najvećom frekvencijom (ne sama frekvencija!)' }
          ],
          solution: [
            '\\( \\sum f_i x_i = ' + kn(sfx) + ' \\), \\( N = ' + N + ' \\) → \\( \\bar{x} = \\frac{' + kn(sfx) + '}{' + N + '} = ' + kf(mean) + ' \\) otkaza po letu.',
            'Kumulativ: ' + cums.join(', ') + '; N/2 = ' + num(N / 2, 1) + ' prvi put je dosegnut kod xᵢ = ' + me + ' → Me = ' + me + '.',
            'Najveća frekvencija ' + p.top + ' pripada vrijednosti ' + p.pk + ' → Mo = ' + p.pk + '.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. AS = Σfᵢxᵢ ÷ Σfᵢ; medijan iz kumulativa; mod = vrijednost s najvećom frekvencijom.']
    },

    {
      id: 'hr4-razredi-random',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'ratio',
      title: 'Razredi — AS, medijan i mod',
      prompt: 'Iz distribucije s razredima izračunajte AS, medijan i mod na 2 decimale.',
      difficulty: 3,
      params: {
        i: { choices: [10, 20] },
        L0: { choices: [0, 20, 40] },
        pk: { choices: [1, 2, 3] },
        f0: { min: 3, max: 15, step: 1 }, f1: { min: 3, max: 15, step: 1 }, f2: { min: 3, max: 15, step: 1 },
        f3: { min: 3, max: 15, step: 1 }, f4: { min: 3, max: 15, step: 1 },
        top: { min: 18, max: 30, step: 1 }
      },
      generate(p) {
        const f = [p.f0, p.f1, p.f2, p.f3, p.f4];
        f[p.pk] = p.top;
        const N = sum(f);
        const lo = f.map((_, k) => p.L0 + k * p.i);
        const mid = lo.map((l) => l + p.i / 2);
        const sfx = sum(f.map((fi, k) => fi * mid[k]));
        const mean = sfx / N;
        let cum = 0, mk = 0, before = 0;
        for (let k = 0; k < 5; k++) { if (cum + f[k] >= N / 2) { mk = k; before = cum; break; } cum += f[k]; }
        const me = lo[mk] + (N / 2 - before) / f[mk] * p.i;
        const a = p.pk > 0 ? f[p.pk - 1] : 0, b = f[p.pk], c = p.pk < 4 ? f[p.pk + 1] : 0;
        const mo = lo[p.pk] + (b - a) / ((b - a) + (b - c)) * p.i;
        return {
          prompt: 'Dnevna izvanpansionska potrošnja gostiju (€), N = ' + N + ' gostiju. Izračunajte AS, Me i Mo na 2 decimale.',
          givens: f.map((fi, k) => ({ label: lo[k] + '–' + (lo[k] + p.i) + ' €', value: fi + ' gostiju' })),
          fields: [
            { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: mean, tol: 0.01, unit: '€', hint: 'Za xᵢ uzmi razredne sredine: \\( \\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} \\)' },
            { key: 'me', label: 'Medijan Me', answer: me, tol: 0.02, unit: '€', hint: '\\( M_e = L_1 + \\frac{N/2 - \\sum f_1}{f_{med}} \\cdot i \\)' },
            { key: 'mo', label: 'Mod Mo', answer: mo, tol: 0.02, unit: '€', hint: '\\( M_o = L_1 + \\frac{b - a}{(b - a) + (b - c)} \\cdot i \\)' }
          ],
          solution: [
            'Razredne sredine: ' + mid.join('; ') + ' → \\( \\sum f_i x_i = ' + kn(sfx) + ' \\), \\( \\bar{x} = \\frac{' + kn(sfx) + '}{' + N + '} = ' + kf(mean) + ' \\) €.',
            'N/2 = ' + num(N / 2, 1) + ' → medijalni razred ' + lo[mk] + '–' + (lo[mk] + p.i) + ', \\( \\sum f_1 = ' + before + ' \\), \\( f_{med} = ' + f[mk] + ' \\): '
              + '\\( M_e = ' + lo[mk] + ' + \\frac{' + kn(N / 2, 1) + ' - ' + before + '}{' + f[mk] + '} \\cdot ' + p.i + ' = ' + kf(me) + ' \\) €.',
            'Modalni razred ' + lo[p.pk] + '–' + (lo[p.pk] + p.i) + ' (b = ' + b + ', a = ' + a + ', c = ' + c + '): '
              + '\\( M_o = ' + lo[p.pk] + ' + \\frac{' + (b - a) + '}{' + (b - a) + ' + ' + (b - c) + '} \\cdot ' + p.i + ' = ' + kf(mo) + ' \\) €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Kod razreda: AS iz razrednih sredina, Me i Mo iz formula s donjom granicom L₁ i veličinom razreda i.']
    },

    {
      id: 'hr4-harmonijska-random',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'numeric',
      title: 'Harmonijska sredina — sobarice',
      prompt: 'Izračunajte prosječno vrijeme čišćenja jedne sobe.',
      difficulty: 2,
      params: {
        t1: { choices: [15, 16, 20, 24] },
        t2: { choices: [20, 24, 30] },
        t3: { choices: [30, 40, 48] },
        t4: { choices: [40, 48, 60, 80] }
      },
      generate(p) {
        const ts = [p.t1, p.t2, p.t3, p.t4];
        const rooms = ts.map((t) => 480 / t);
        const H = 4 / sum(ts.map((t) => 1 / t));
        return {
          prompt: 'Četiri sobarice rade po 8 sati (480 min). Jednu sobu očiste redom za ' + ts.join(', ') + ' minuta. '
            + 'Koliko soba očiste ukupno i koliko je prosječno vrijeme čišćenja jedne sobe (2 decimale)?',
          fields: [
            { key: 'sobe', label: 'Ukupno očišćenih soba u smjeni', answer: sum(rooms), tol: 0.01, unit: 'soba', hint: 'Svaka: 480 ÷ vrijeme po sobi' },
            { key: 'h', label: 'Prosječno vrijeme po sobi (harmonijska sredina)', answer: H, tol: 0.02, unit: 'min', hint: '\\( H = \\frac{N}{\\sum \\frac{1}{x_i}} \\)' }
          ],
          solution: [
            'Sobe po sobarici: ' + rooms.join(' + ') + ' = ' + sum(rooms) + ' soba.',
            '\\( H = \\frac{4}{' + ts.map((t) => '\\frac{1}{' + t + '}').join(' + ') + '} = ' + kf(H) + ' \\) min.',
            'Provjera: \\( \\frac{4 \\cdot 480}{' + sum(rooms) + '} = ' + kf(H) + ' \\) min. Obična AS (' + fmt(sum(ts) / 4) + ' min) bila bi pogrešna.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nova vremena. Vremena s istim brojnikom (isto radno vrijeme) → harmonijska sredina H = N ÷ Σ(1/xᵢ).']
    },

    {
      id: 'hr4-geometrijska-random',
      lesson: 'first-midterm', chapter: 4, category: 'meanValues',
      type: 'numeric',
      title: 'Geometrijska sredina — prosječna stopa promjene',
      prompt: 'Iz verižnih indeksa izračunajte geometrijsku sredinu i prosječnu godišnju stopu promjene.',
      difficulty: 2,
      params: {
        v1: { choices: [96, 102, 104, 105, 108, 110] },
        v2: { choices: [98, 103.5, 106, 109, 112.5] },
        v3: { choices: [95, 101, 104.5, 107, 110] },
        v4: { choices: [97, 100.5, 103, 106.5, 111] }
      },
      generate(p) {
        const v = [p.v1, p.v2, p.v3, p.v4];
        const G = Math.pow(v.reduce((m, x) => m * x, 1), 1 / 4);
        return {
          prompt: 'Verižni indeksi noćenja u Opatiji 2021.–2024. iznose ' + v.map((x) => num(x)).join('; ')
            + '. Izračunajte geometrijsku sredinu indeksa i prosječnu godišnju stopu promjene (2 decimale).',
          fields: [
            { key: 'g', label: 'Geometrijska sredina G', answer: G, tol: 0.02, unit: '', hint: '\\( G = \\sqrt[N]{x_1 x_2 \\cdots x_N} \\), N = 4' },
            { key: 's', label: 'Prosječna godišnja stopa promjene', answer: G - 100, tol: 0.02, unit: '%', hint: 'G − 100' }
          ],
          solution: [
            '\\( G = \\sqrt[4]{' + v.map((x) => kn(x)).join(' \\cdot ') + '} = ' + kf(G) + ' \\).',
            'Prosječna stopa = \\( ' + kf(G) + ' - 100 = ' + kf(G - 100) + '\\,\\% \\) godišnje.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove indekse. Prosječna stopa promjene = geometrijska sredina verižnih indeksa − 100.']
    },

    // =====================================================================
    // PREDAVANJE 5 — MJERE DISPERZIJE (first-midterm, dispersion)
    // =====================================================================
    {
      id: 'hr5-koncepti',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'choice',
      title: 'Mjere disperzije — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Raspon varijacije ovisi samo o dvije vrijednosti niza.', kind: 'tf', answer: true },
        { q: 'Varijanca je izražena u istim jedinicama kao podaci.', kind: 'tf', answer: false },
        { q: 'Koeficijent varijacije je neimenovan broj pa služi za usporedbu nizova u različitim jedinicama.', kind: 'tf', answer: true },
        { q: 'Koeficijent asimetrije je mjera disperzije.', kind: 'tf', answer: false },
        { q: 'Koeficijent kvartilne devijacije kreće se od 0 do 1.', kind: 'tf', answer: true },
        { q: 'Ako je σ = 2, drugi moment oko sredine iznosi 4.', kind: 'tf', answer: true },
        { q: 'Interkvartil obuhvaća:', kind: 'mc', options: ['središnjih 50 % članova', 'donjih 25 % članova', 'sve članove niza', 'središnjih 75 % članova'], answer: 0 },
        { q: 'Koja je mjera disperzije relativna i POTPUNA (koristi sve podatke)?', kind: 'mc', options: ['Raspon varijacije', 'Interkvartil', 'Koeficijent varijacije', 'Koeficijent kvartilne devijacije'], answer: 2 },
        { q: 'Veći koeficijent varijacije znači:', kind: 'mc', options: ['reprezentativniju AS', 'veću raspršenost i manju reprezentativnost AS', 'simetričnu distribuciju', 'veći medijan'], answer: 1 }
      ],
      solution: [
        'Varijanca je u kvadratnim jedinicama; standardna devijacija je u jedinicama podataka.',
        'Relativne mjere: koeficijent varijacije (potpuna) i koeficijent kvartilne devijacije (nepotpuna).',
        'Koeficijent asimetrije mjeri oblik, ne raspršenost.'
      ]
    },

    {
      id: 'hr5-grijaci',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'numeric',
      title: 'Negrupirani niz — sve mjere disperzije',
      prompt: 'Broj prodanih električnih grijača u 10 poslovnica (seminar 5): 100, 105, 106, 110, 110, 111, 114, 115, 115, 134. '
        + 'Izračunajte mjere disperzije (varijanca s N u nazivniku).',
      difficulty: 2,
      fields: [
        { key: 'r', label: 'Raspon varijacije R', answer: 34, tol: 0.01, unit: '', hint: '\\( x_{max} - x_{min} \\)' },
        { key: 'q1', label: 'Donji kvartil Q₁', answer: 106, tol: 0.01, unit: '', hint: 'N/4 = 2,5 nije cijeli broj → 3. položaj' },
        { key: 'q3', label: 'Gornji kvartil Q₃', answer: 115, tol: 0.01, unit: '', hint: '3N/4 = 7,5 → 8. položaj' },
        { key: 'iq', label: 'Interkvartil \\( I_Q \\)', answer: 9, tol: 0.01, unit: '', hint: 'Q₃ − Q₁' },
        { key: 'vq', label: 'Koeficijent kvartilne devijacije \\( V_Q \\) (2 decimale)', answer: 9 / 221, tol: 0.006, unit: '', hint: '\\( \\frac{Q_3 - Q_1}{Q_3 + Q_1} \\)' },
        { key: 'var', label: 'Varijanca \\( \\sigma^2 \\)', answer: 74.4, tol: 0.02, unit: '', hint: '\\( \\bar{x} = 112 \\); \\( \\sum (x_i - \\bar{x})^2 = 744 \\)' },
        { key: 'sd', label: 'Standardna devijacija σ', answer: Math.sqrt(74.4), tol: 0.02, unit: '', hint: '\\( \\sqrt{\\sigma^2} \\)' },
        { key: 'v', label: 'Koeficijent varijacije V', answer: Math.sqrt(74.4) / 112 * 100, tol: 0.02, unit: '%', hint: '\\( \\frac{\\sigma}{\\bar{x}} \\cdot 100 \\)' }
      ],
      solution: [
        '\\( R = 134 - 100 = 34 \\). Q₁: \\( 10/4 = 2{,}5 \\) → 3. položaj → 106; Q₃: \\( 30/4 = 7{,}5 \\) → 8. položaj → 115.',
        '\\( I_Q = 9 \\); \\( V_Q = \\frac{9}{221} = 0{,}04 \\).',
        '\\( \\bar{x} = 1\\,120/10 = 112 \\); \\( \\sigma^2 = 744/10 = 74{,}4 \\); \\( \\sigma = 8{,}63 \\); \\( V = \\frac{8{,}63}{112} \\cdot 100 = 7{,}70\\,\\% \\) → niz je homogen.'
      ]
    },

    {
      id: 'hr5-kvartili-random',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'numeric',
      title: 'Kvartili negrupiranog niza — drill',
      prompt: 'Uredite niz i izračunajte raspon, kvartile, interkvartil i koeficijent kvartilne devijacije.',
      difficulty: 2,
      params: {
        n: { choices: [8, 9, 10, 11, 12] },
        v1: { min: 10, max: 60 }, v2: { min: 10, max: 60 }, v3: { min: 10, max: 60 }, v4: { min: 10, max: 60 },
        v5: { min: 10, max: 60 }, v6: { min: 10, max: 60 }, v7: { min: 10, max: 60 }, v8: { min: 10, max: 60 },
        v9: { min: 10, max: 60 }, v10: { min: 10, max: 60 }, v11: { min: 10, max: 60 }, v12: { min: 10, max: 60 }
      },
      generate(p) {
        const all = [p.v1, p.v2, p.v3, p.v4, p.v5, p.v6, p.v7, p.v8, p.v9, p.v10, p.v11, p.v12];
        const xs = all.slice(0, p.n);
        const s = xs.slice().sort((u, v) => u - v);
        const q1 = quartile(s, 1), q3 = quartile(s, 3);
        const r1 = p.n / 4, r3 = 3 * p.n / 4;
        const rule = (r) => Number.isInteger(r) ? (num(r) + ' je cijeli broj → poluzbroj ' + r + '. i ' + (r + 1) + '. člana')
          : (num(r) + ' nije cijeli broj → ' + Math.ceil(r) + '. položaj');
        return {
          prompt: 'Broj prijava na recepciji po satu (N = ' + p.n + '): ' + xs.join('; ') + '. Izračunajte tražene mjere; V_Q na 2 decimale.',
          fields: [
            { key: 'r', label: 'Raspon varijacije R', answer: s[p.n - 1] - s[0], tol: 0.01, unit: '', hint: '\\( x_{max} - x_{min} \\)' },
            { key: 'q1', label: 'Donji kvartil Q₁', answer: q1, tol: 0.01, unit: '', hint: 'Položaj N/4: necijeli → sljedeći cijeli položaj; cijeli → poluzbroj x_r i x_(r+1)' },
            { key: 'q3', label: 'Gornji kvartil Q₃', answer: q3, tol: 0.01, unit: '', hint: 'Položaj 3N/4, isto pravilo' },
            { key: 'iq', label: 'Interkvartil \\( I_Q \\)', answer: q3 - q1, tol: 0.01, unit: '', hint: 'Q₃ − Q₁' },
            { key: 'vq', label: 'Koeficijent kvartilne devijacije \\( V_Q \\)', answer: (q3 - q1) / (q3 + q1), tol: 0.006, unit: '', hint: '\\( \\frac{Q_3 - Q_1}{Q_3 + Q_1} \\)' }
          ],
          solution: [
            'Uređeni niz: ' + s.join('; ') + '. R = ' + s[p.n - 1] + ' − ' + s[0] + ' = ' + (s[p.n - 1] - s[0]) + '.',
            'Q₁: N/4 = ' + rule(r1) + ' → Q₁ = ' + num(q1) + '.',
            'Q₃: 3N/4 = ' + rule(r3) + ' → Q₃ = ' + num(q3) + '.',
            '\\( I_Q = ' + kn(q3 - q1) + ' \\); \\( V_Q = \\frac{' + kn(q3 - q1) + '}{' + kn(q3 + q1) + '} = ' + kf((q3 - q1) / (q3 + q1)) + ' \\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi niz. Niz najprije uredi; položaj Q₁ = N/4, Q₃ = 3N/4 (FMTU pravilo za cijeli / necijeli položaj).']
    },

    {
      id: 'hr5-varijanca-random',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'numeric',
      title: 'Varijanca, standardna devijacija i koeficijent varijacije — drill',
      prompt: 'Izračunajte AS, varijancu, standardnu devijaciju i koeficijent varijacije.',
      difficulty: 2,
      params: {
        pat: { choices: [0, 1, 2, 3, 4] },
        m: { min: 20, max: 60 },
        k: { choices: [1, 2] }
      },
      generate(p) {
        const PAT = [[-5, 3, -1, 5, -2, 0], [2, -4, 4, 0, -3, 1], [-6, 4, 0, 2, -1, 1], [1, -3, 4, -1, 2, -3], [4, -2, 0, -2, 2, -2]];
        const xs = PAT[p.pat].map((d) => p.m + p.k * d);
        const N = xs.length, mean = sum(xs) / N;
        const ss = sum(xs.map((x) => (x - mean) * (x - mean)));
        const v = ss / N, sd = Math.sqrt(v), cv = sd / mean * 100;
        return {
          prompt: 'Broj prodanih izleta u turističkoj agenciji kroz 6 dana: ' + xs.join('; ') + '. Izračunajte tražene mjere na 2 decimale (varijanca s N u nazivniku).',
          fields: [
            { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: mean, tol: 0.01, unit: '', hint: 'Σx ÷ N' },
            { key: 'var', label: 'Varijanca \\( \\sigma^2 \\)', answer: v, tol: 0.02, unit: '', hint: '\\( \\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{N} \\)' },
            { key: 'sd', label: 'Standardna devijacija σ', answer: sd, tol: 0.02, unit: '', hint: '\\( \\sqrt{\\sigma^2} \\)' },
            { key: 'cv', label: 'Koeficijent varijacije V', answer: cv, tol: 0.05, unit: '%', hint: '\\( V = \\frac{\\sigma}{\\bar{x}} \\cdot 100 \\)' }
          ],
          solution: [
            '\\( \\bar{x} = \\frac{' + sum(xs) + '}{6} = ' + kn(mean) + ' \\).',
            'Odstupanja: ' + xs.map((x) => num(x - mean)).join('; ') + ' → \\( \\sum (x_i - \\bar{x})^2 = ' + kn(ss) + ' \\).',
            '\\( \\sigma^2 = \\frac{' + kn(ss) + '}{6} = ' + kf(v) + ' \\); \\( \\sigma = ' + kf(sd) + ' \\); \\( V = \\frac{' + kf(sd) + '}{' + kn(mean) + '} \\cdot 100 = ' + kf(cv) + '\\,\\% \\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi niz. σ² = Σ(xᵢ − x̄)² ÷ N; σ = √σ²; V = σ ÷ x̄ · 100.']
    },

    {
      id: 'hr5-razredi-posluzivanje',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'ratio',
      title: 'Razredi — vrijeme posluživanja komitenata',
      prompt: 'Vrijeme posluživanja komitenata u minutama (seminar 5), N = 113. Razredi nisu jednake veličine — za xᵢ uzmi razredne sredine. Rezultate zaokruži na 2 decimale.',
      difficulty: 3,
      givens: [
        { label: '5–10 min', value: '25' },
        { label: '10–15 min', value: '40' },
        { label: '15–20 min', value: '35' },
        { label: '20–30 min', value: '13' }
      ],
      fields: [
        { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: 1625 / 113, tol: 0.01, unit: 'min', hint: 'Razredne sredine 7,5; 12,5; 17,5; 25 → Σfᵢxᵢ = 1 625' },
        { key: 'var', label: 'Varijanca \\( \\sigma^2 \\)', answer: 26500 / 113 - Math.pow(1625 / 113, 2), tol: 0.05, unit: '', hint: '\\( \\frac{\\sum f_i (x_i - \\bar{x})^2}{\\sum f_i} \\)' },
        { key: 'sd', label: 'Standardna devijacija σ', answer: Math.sqrt(26500 / 113 - Math.pow(1625 / 113, 2)), tol: 0.02, unit: 'min', hint: '\\( \\sqrt{\\sigma^2} \\)' },
        { key: 'v', label: 'Koeficijent varijacije V', answer: Math.sqrt(26500 / 113 - Math.pow(1625 / 113, 2)) / (1625 / 113) * 100, tol: 0.05, unit: '%', hint: 'σ ÷ x̄ · 100' },
        { key: 'q1', label: 'Donji kvartil Q₁', answer: 10 + (28.25 - 25) / 40 * 5, tol: 0.01, unit: 'min', hint: 'N/4 = 28,25 → razred 10–15' },
        { key: 'q3', label: 'Gornji kvartil Q₃', answer: 15 + (84.75 - 65) / 35 * 5, tol: 0.01, unit: 'min', hint: '3N/4 = 84,75 → razred 15–20' }
      ],
      solution: [
        '\\( \\bar{x} = \\frac{1\\,625}{113} = 14{,}38 \\) min; \\( \\sum f_i (x_i - \\bar{x})^2 = 3\\,131{,}64 \\) → \\( \\sigma^2 = 27{,}71 \\), \\( \\sigma = 5{,}26 \\) min, \\( V = 36{,}61\\,\\% \\).',
        'Q₁: \\( 10 + \\frac{28{,}25 - 25}{40} \\cdot 5 = 10{,}41 \\) min; Q₃: \\( 15 + \\frac{84{,}75 - 65}{35} \\cdot 5 = 17{,}82 \\) min.',
        'Središnjih 50 % komitenata posluženo je za 10,41 do 17,82 minuta.'
      ]
    },

    {
      id: 'hr5-cv-usporedba-random',
      lesson: 'first-midterm', chapter: 5, category: 'dispersion',
      type: 'numeric',
      title: 'Usporedba raspršenosti — koeficijent varijacije',
      prompt: 'Usporedite raspršenost dviju pojava izraženih u različitim jedinicama.',
      difficulty: 1,
      params: {
        m1: { min: 60, max: 180, step: 5 },
        s1: { min: 6, max: 40, step: 2 },
        m2: { min: 3, max: 9, step: 0.5 },
        s2: { min: 0.5, max: 3, step: 0.25 }
      },
      generate(p) {
        const v1 = p.s1 / p.m1 * 100, v2 = p.s2 / p.m2 * 100;
        return {
          prompt: 'Dnevni prihod po sobi: \\( \\bar{x} = ' + kn(p.m1) + ' \\) €, \\( \\sigma = ' + kn(p.s1) + ' \\) €. Duljina boravka: \\( \\bar{x} = '
            + kn(p.m2) + ' \\) dana, \\( \\sigma = ' + kn(p.s2) + ' \\) dana. Izračunajte oba koeficijenta varijacije na 2 decimale.',
          fields: [
            { key: 'v1', label: 'V — prihod po sobi', answer: v1, tol: 0.01, unit: '%', hint: '\\( V = \\frac{\\sigma}{\\bar{x}} \\cdot 100 \\)' },
            { key: 'v2', label: 'V — duljina boravka', answer: v2, tol: 0.01, unit: '%', hint: '\\( V = \\frac{\\sigma}{\\bar{x}} \\cdot 100 \\)' }
          ],
          solution: [
            'Prihod: \\( V = \\frac{' + kn(p.s1) + '}{' + kn(p.m1) + '} \\cdot 100 = ' + kf(v1) + '\\,\\% \\).',
            'Boravak: \\( V = \\frac{' + kn(p.s2) + '}{' + kn(p.m2) + '} \\cdot 100 = ' + kf(v2) + '\\,\\% \\).',
            (Math.abs(v1 - v2) < 1e-9 ? 'Raspršenost je jednaka.' : ('Veću relativnu raspršenost ima ' + (v1 > v2 ? 'prihod po sobi' : 'duljina boravka') + ' — njegova AS je manje reprezentativna.'))
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Koeficijent varijacije je neimenovan broj pa uspoređuje nizove u različitim jedinicama.']
    },

    // =====================================================================
    // PREDAVANJE 6 — ASIMETRIJA I ZAOBLJENOST (first-midterm, skewnessKurtosis)
    // =====================================================================
    {
      id: 'hr6-koncepti',
      lesson: 'first-midterm', chapter: 6, category: 'skewnessKurtosis',
      type: 'choice',
      title: 'Asimetrija i zaobljenost — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'U simetričnoj distribuciji vrijedi AS = Me = Mo.', kind: 'tf', answer: true },
        { q: 'Bowleyjeva mjera asimetrije temelji se na kvartilima i medijanu.', kind: 'tf', answer: true },
        { q: 'Koeficijent zaobljenosti uspoređuje se s nulom.', kind: 'tf', answer: false },
        { q: 'Pearsonova mjera Sk1 ne postoji ako niz nema mod.', kind: 'tf', answer: true },
        { q: 'α₄ < 3 znači da je distribucija šiljastija od normalne.', kind: 'tf', answer: false },
        { q: 'Uobičajeni interval Bowleyjeve mjere asimetrije je:', kind: 'mc', options: ['±1', '±2', '±3', '0 do 1'], answer: 0 },
        { q: 'Uobičajeni interval koeficijenta asimetrije α₃ je:', kind: 'mc', options: ['±1', '±2', '±3', '0 do 3'], answer: 1 },
        { q: 'α₄ = 1,8 označava:', kind: 'mc', options: ['normalnu krivulju', 'pravokutni oblik', 'U-distribuciju', 'šiljastu distribuciju'], answer: 1 }
      ],
      solution: [
        'Intervali: α₃ ±2, Pearson ±3, Bowley ±1.',
        'α₄ se uspoređuje s 3 (normalna): > 3 šiljastija, < 3 plosnatija, = 1,8 pravokutna, < 1,8 U-distribucija.'
      ]
    },

    {
      id: 'hr6-mjere-iz-zadanog-random',
      lesson: 'first-midterm', chapter: 6, category: 'skewnessKurtosis',
      type: 'numeric',
      title: 'Mjere oblika iz zadanih momenata',
      prompt: 'Iz zadanih vrijednosti izračunajte mjere asimetrije i zaobljenosti.',
      difficulty: 1,
      params: {
        sig: { choices: [2, 3, 4, 5] },
        a3: { choices: [-1, -0.5, 0.25, 0.5, 0.75, 1, 1.25] },
        a4: { choices: [1.8, 2, 2.5, 3, 3.5, 4.2] },
        m: { min: 20, max: 60 },
        dMo: { choices: [-6, -3, -2, 2, 3, 5, 6] },
        dMe: { choices: [-2, -1, 1, 2, 3] }
      },
      generate(p) {
        const mu3 = p.a3 * Math.pow(p.sig, 3), mu4 = p.a4 * Math.pow(p.sig, 4);
        const mo = p.m - p.dMo, me = p.m - p.dMe;
        const sk1 = (p.m - mo) / p.sig, sk2 = 3 * (p.m - me) / p.sig;
        return {
          prompt: 'Za distribuciju noćenja po gostu zadano je: \\( \\bar{x} = ' + p.m + ' \\), \\( M_o = ' + mo + ' \\), \\( M_e = ' + me
            + ' \\), \\( \\sigma = ' + p.sig + ' \\), \\( \\mu_3 = ' + kn(mu3, 3) + ' \\), \\( \\mu_4 = ' + kn(mu4, 3) + ' \\). Izračunajte mjere na 2 decimale.',
          fields: [
            { key: 'a3', label: 'Koeficijent asimetrije α₃', answer: mu3 / Math.pow(p.sig, 3), tol: 0.01, unit: '', hint: '\\( \\alpha_3 = \\frac{\\mu_3}{\\sigma^3} \\)' },
            { key: 'sk1', label: 'Pearsonova mjera Sk1', answer: sk1, tol: 0.01, unit: '', hint: '\\( S_{k1} = \\frac{\\bar{x} - M_o}{\\sigma} \\)' },
            { key: 'sk2', label: 'Pearsonova mjera Sk2', answer: sk2, tol: 0.01, unit: '', hint: '\\( S_{k2} = \\frac{3(\\bar{x} - M_e)}{\\sigma} \\)' },
            { key: 'a4', label: 'Koeficijent zaobljenosti α₄', answer: mu4 / Math.pow(p.sig, 4), tol: 0.01, unit: '', hint: '\\( \\alpha_4 = \\frac{\\mu_4}{\\sigma^4} \\)' }
          ],
          solution: [
            '\\( \\alpha_3 = \\frac{' + kn(mu3, 3) + '}{' + p.sig + '^3} = \\frac{' + kn(mu3, 3) + '}{' + Math.pow(p.sig, 3) + '} = ' + kf(p.a3) + ' \\).',
            '\\( S_{k1} = \\frac{' + p.m + ' - ' + mo + '}{' + p.sig + '} = ' + kf(sk1) + ' \\); \\( S_{k2} = \\frac{3(' + p.m + ' - ' + me + ')}{' + p.sig + '} = ' + kf(sk2) + ' \\).',
            '\\( \\alpha_4 = \\frac{' + kn(mu4, 3) + '}{' + Math.pow(p.sig, 4) + '} = ' + kf(p.a4) + ' \\) → '
              + (p.a4 > 3 ? 'šiljastija od normalne.' : p.a4 === 3 ? 'zaobljenost normalne krivulje.' : p.a4 === 1.8 ? 'pravokutni oblik.' : 'plosnatija od normalne.')
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove vrijednosti. Pazi: ako je zadana σ, prvo je podigni na treću odnosno četvrtu potenciju.']
    },

    {
      id: 'hr6-bowley-random',
      lesson: 'first-midterm', chapter: 6, category: 'skewnessKurtosis',
      type: 'numeric',
      title: 'Bowleyjeva mjera asimetrije',
      prompt: 'Iz kvartila i medijana izračunajte Bowleyjevu mjeru asimetrije.',
      difficulty: 1,
      params: {
        q1: { min: 20, max: 40 },
        d1: { min: 2, max: 12 },
        d2: { min: 2, max: 12 }
      },
      generate(p) {
        const me = p.q1 + p.d1, q3 = me + p.d2;
        const skq = (p.q1 + q3 - 2 * me) / (q3 - p.q1);
        return {
          prompt: 'Dob gostiju wellness centra: \\( Q_1 = ' + p.q1 + ' \\), \\( M_e = ' + me + ' \\), \\( Q_3 = ' + q3 + ' \\) godina. Izračunajte Bowleyjevu mjeru na 2 decimale.',
          fields: [
            { key: 'skq', label: 'Bowleyjeva mjera \\( S_{kQ} \\)', answer: skq, tol: 0.01, unit: '', hint: '\\( S_{kQ} = \\frac{Q_1 + Q_3 - 2M_e}{Q_3 - Q_1} \\)' }
          ],
          solution: [
            '\\( S_{kQ} = \\frac{' + p.q1 + ' + ' + q3 + ' - 2 \\cdot ' + me + '}{' + q3 + ' - ' + p.q1 + '} = \\frac{' + (p.q1 + q3 - 2 * me) + '}{' + (q3 - p.q1) + '} = ' + kf(skq) + ' \\).',
            skq > 0 ? 'Pozitivna → desnostrana asimetrija (Q₃ − Me > Me − Q₁).' : skq < 0 ? 'Negativna → lijevostrana asimetrija.' : 'Nula → simetričan raspored oko medijana.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove kvartile. S_kQ je u intervalu ±1.']
    },

    {
      id: 'hr6-negrupirani-niz',
      lesson: 'first-midterm', chapter: 6, category: 'skewnessKurtosis',
      type: 'numeric',
      title: 'Negrupirani niz — sve mjere oblika',
      prompt: 'Niz iz seminara 6: 2, 2, 2, 3, 4, 5, 7, 8, 12 (N = 9). Izračunajte mjere na 2 decimale (momenti s N u nazivniku).',
      difficulty: 3,
      fields: [
        { key: 'as', label: 'Aritmetička sredina \\( \\bar{x} \\)', answer: 5, tol: 0.01, unit: '', hint: '45 ÷ 9' },
        { key: 'var', label: 'Varijanca \\( \\sigma^2 \\)', answer: 94 / 9, tol: 0.01, unit: '', hint: '\\( \\sum (x_i - \\bar{x})^2 = 94 \\)' },
        { key: 'a3', label: 'Koeficijent asimetrije α₃', answer: 32 / Math.pow(94 / 9, 1.5), tol: 0.02, unit: '', hint: '\\( \\mu_3 = 288/9 = 32 \\); \\( \\alpha_3 = \\mu_3 / \\sigma^3 \\)' },
        { key: 'sk1', label: 'Pearsonova mjera Sk1', answer: 3 / Math.sqrt(94 / 9), tol: 0.02, unit: '', hint: 'Mo = 2' },
        { key: 'sk2', label: 'Pearsonova mjera Sk2', answer: 3 / Math.sqrt(94 / 9), tol: 0.02, unit: '', hint: 'Me = x₅ = 4' },
        { key: 'skq', label: 'Bowleyjeva mjera \\( S_{kQ} \\)', answer: 0.2, tol: 0.01, unit: '', hint: 'Q₁: 9/4 = 2,25 → 3. položaj; Q₃: 27/4 = 6,75 → 7. položaj' },
        { key: 'a4', label: 'Koeficijent zaobljenosti α₄', answer: (2758 / 9) / Math.pow(94 / 9, 2), tol: 0.03, unit: '', hint: '\\( \\sum (x_i - \\bar{x})^4 = 2\\,758 \\)' }
      ],
      solution: [
        'Odstupanja od 5: −3, −3, −3, −2, −1, 0, 2, 3, 7 → \\( \\sigma^2 = 94/9 = 10{,}44 \\), \\( \\sigma = 3{,}23 \\).',
        '\\( \\mu_3 = 288/9 = 32 \\) → \\( \\alpha_3 = 32 / 3{,}23^3 = 0{,}95 \\).',
        '\\( S_{k1} = \\frac{5 - 2}{3{,}23} = 0{,}93 \\); \\( S_{k2} = \\frac{3(5 - 4)}{3{,}23} = 0{,}93 \\); Q₁ = 2, Q₃ = 7 → \\( S_{kQ} = \\frac{2 + 7 - 8}{5} = 0{,}2 \\).',
        '\\( \\mu_4 = 2\\,758/9 = 306{,}44 \\) → \\( \\alpha_4 = 306{,}44 / 10{,}44^2 \\approx 2{,}81 \\) → plosnatija od normalne; sve mjere asimetrije pozitivne → desnostrana asimetrija.'
      ]
    },

    {
      id: 'hr6-alfa-random',
      lesson: 'first-midterm', chapter: 6, category: 'skewnessKurtosis',
      type: 'numeric',
      title: 'Treći i četvrti moment — drill',
      prompt: 'Izračunajte varijancu, treći moment, koeficijent asimetrije i koeficijent zaobljenosti.',
      difficulty: 3,
      params: {
        pat: { choices: [0, 1, 2, 3, 4] },
        m: { min: 10, max: 40 }
      },
      generate(p) {
        const PAT = [[-3, 5, -1, 1, -2], [0, -2, 5, -1, -2], [3, -4, 2, 0, -1], [-1, 2, -5, 3, 1], [4, -3, -1, 1, -1]];
        const xs = PAT[p.pat].map((d) => p.m + d);
        const N = 5, mean = sum(xs) / N;
        const m2 = sum(xs.map((x) => Math.pow(x - mean, 2))) / N;
        const m3 = sum(xs.map((x) => Math.pow(x - mean, 3))) / N;
        const m4 = sum(xs.map((x) => Math.pow(x - mean, 4))) / N;
        const a3 = m3 / Math.pow(m2, 1.5), a4 = m4 / (m2 * m2);
        return {
          prompt: 'Broj otkazanih rezervacija u 5 hotela: ' + xs.join('; ') + '. Izračunajte tražene mjere na 2 decimale (momenti s N u nazivniku).',
          fields: [
            { key: 'var', label: 'Varijanca \\( \\sigma^2 = \\mu_2 \\)', answer: m2, tol: 0.02, unit: '', hint: '\\( \\bar{x} = ' + mean + ' \\)' },
            { key: 'mu3', label: 'Treći moment \\( \\mu_3 \\)', answer: m3, tol: 0.02, unit: '', hint: '\\( \\mu_3 = \\frac{\\sum (x_i - \\bar{x})^3}{N} \\)' },
            { key: 'a3', label: 'Koeficijent asimetrije α₃', answer: a3, tol: 0.02, unit: '', hint: '\\( \\alpha_3 = \\frac{\\mu_3}{\\sigma^3} \\)' },
            { key: 'a4', label: 'Koeficijent zaobljenosti α₄', answer: a4, tol: 0.03, unit: '', hint: '\\( \\alpha_4 = \\frac{\\mu_4}{\\sigma^4} \\)' }
          ],
          solution: [
            '\\( \\bar{x} = ' + mean + ' \\); odstupanja: ' + PAT[p.pat].map((d) => num(d)).join('; ') + '.',
            '\\( \\mu_2 = ' + kf(m2) + ' \\), \\( \\mu_3 = ' + kf(m3) + ' \\), \\( \\mu_4 = ' + kf(m4) + ' \\); \\( \\sigma = ' + kf(Math.sqrt(m2)) + ' \\).',
            '\\( \\alpha_3 = \\frac{' + kf(m3) + '}{' + kf(Math.pow(m2, 1.5)) + '} = ' + kf(a3) + ' \\) → ' + (a3 > 0 ? 'pozitivna (desnostrana)' : 'negativna (lijevostrana)') + ' asimetrija.',
            '\\( \\alpha_4 = \\frac{' + kf(m4) + '}{' + kf(m2 * m2) + '} = ' + kf(a4) + ' \\) → ' + (a4 > 3 ? 'šiljastija' : 'plosnatija') + ' od normalne.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi niz. α₃ = μ₃ ÷ σ³ (usporedi s 0), α₄ = μ₄ ÷ σ⁴ (usporedi s 3).']
    },

    // =====================================================================
    // PREDAVANJE 7 — METODA UZORKA (second-midterm, sampling)
    // =====================================================================
    {
      id: 'hr7-koncepti',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'choice',
      title: 'Metoda uzorka — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 't = 1,96 i t = 2,58 vrijede samo za velike uzorke (n > 30).', kind: 'tf', answer: true },
        { q: 'Faktor korekcije koristi se samo kad je frakcija izbora f > 0,05.', kind: 'tf', answer: true },
        { q: 'Uzorak skupina (klaster) je namjerni uzorak.', kind: 'tf', answer: false },
        { q: 'Veća pouzdanost daje uži (precizniji) interval.', kind: 'tf', answer: false },
        { q: 'Kod malog uzorka stupnjevi slobode su k = n − 1.', kind: 'tf', answer: true },
        { q: 'Pitanje „koliko je posto gostiju zadovoljno” rješava se intervalom procjene:', kind: 'mc', options: ['aritmetičke sredine', 'totala', 'proporcije', 'medijana'], answer: 2 },
        { q: 'Svaki k-ti element s uređenog popisa bira se u:', kind: 'mc', options: ['kvotnom uzorku', 'sistematskom uzorku', 'prigodnom uzorku', 'uzorku gruda snijega'], answer: 1 },
        { q: 'Po FMTU zapisu, za n ≤ 30 standardna greška AS iznosi:', kind: 'mc', options: ['\\( s/\\sqrt{n} \\)', '\\( s/\\sqrt{n-1} \\)', '\\( s \\cdot \\sqrt{n} \\)', '\\( s/(n-1) \\)'], answer: 1 },
        { q: 'Faktor korekcije glasi:', kind: 'mc', options: ['\\( \\sqrt{\\frac{N-n}{N-1}} \\)', '\\( \\sqrt{\\frac{n}{n-1}} \\)', '\\( \\frac{n}{N} \\)', '\\( \\sqrt{\\frac{N-1}{N-n}} \\)'], answer: 0 }
      ],
      solution: [
        'Mali uzorak: k = n − 1 i t iz tablice Studentove razdiobe (stupac 0,05 za 95 %, 0,01 za 99 %).',
        'Faktor korekcije \\( \\sqrt{(N-n)/(N-1)} \\) množi standardnu grešku kada je f = n/N > 0,05; tada je interval uži.',
        'Veća pouzdanost = veći t = širi interval (manja preciznost). Klaster je slučajni uzorak.'
      ]
    },

    {
      id: 'hr7-as-veliki-random',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Interval procjene AS — uzorak veći od 30',
      prompt: 'Procijenite prosječnu dnevnu izvanpansionsku potrošnju svih gostiju.',
      difficulty: 2,
      params: {
        n: { choices: [36, 40, 49, 64, 100, 144, 225] },
        sig: { min: 6, max: 30, step: 2 },
        m: { min: 40, max: 120 },
        conf: { choices: [95, 99] },
        N: { choices: [600, 1200, 3000, 8000, 15000] }
      },
      generate(p) {
        const f = p.n / p.N;
        const t = tLarge(p.conf);
        const s = p.n > 50 ? p.sig : p.sig * Math.sqrt(p.n / (p.n - 1));
        let se = s / Math.sqrt(p.n);
        const corr = f > 0.05;
        const fk = Math.sqrt((p.N - p.n) / (p.N - 1));
        if (corr) se *= fk;
        const lo = p.m - t * se, hi = p.m + t * se;
        return {
          prompt: 'Hotel je u sezoni ugostio N = ' + num(p.N) + ' gostiju. Od n = ' + p.n + ' anketiranih prosječna dnevna izvanpansionska potrošnja iznosi \\( \\bar{x} = '
            + p.m + ' \\) €, a \\( \\sigma = ' + p.sig + ' \\) €. Uz ' + p.conf + ' % pouzdanosti procijenite interval AS osnovnog skupa (2 decimale).',
          fields: [
            { key: 's', label: 'Procijenjena standardna devijacija s', answer: s, tol: 0.02, unit: '€', hint: 's = σ za n > 50; \\( s = \\sigma\\sqrt{\\frac{n}{n-1}} \\) za n ≤ 50' },
            { key: 'se', label: 'Standardna greška \\( s_{\\bar{x}} \\)', answer: se, tol: 0.01, unit: '€', hint: '\\( s/\\sqrt{n} \\) (n > 30); ako je f > 0,05 pomnoži s \\( \\sqrt{\\frac{N-n}{N-1}} \\)' },
            { key: 'lo', label: 'Donja granica intervala', answer: lo, tol: 0.05, unit: '€', hint: '\\( \\bar{x} - t \\cdot s_{\\bar{x}} \\), t = ' + num(t) },
            { key: 'hi', label: 'Gornja granica intervala', answer: hi, tol: 0.05, unit: '€', hint: '\\( \\bar{x} + t \\cdot s_{\\bar{x}} \\)' }
          ],
          solution: [
            'n > 30, ' + p.conf + ' % → t = ' + num(t) + '. Frakcija izbora \\( f = \\frac{' + p.n + '}{' + kn(p.N) + '} = ' + kf(f, 4) + ' \\) ' + (corr ? '> 0,05 → treba faktor korekcije.' : '< 0,05 → bez faktora korekcije.'),
            p.n > 50 ? 'n > 50 → s = σ = ' + num(p.sig) + ' €.' : 'n ≤ 50 → \\( s = ' + p.sig + '\\sqrt{\\frac{' + p.n + '}{' + (p.n - 1) + '}} = ' + kf(s) + ' \\) €.',
            '\\( s_{\\bar{x}} = \\frac{' + kf(s) + '}{\\sqrt{' + p.n + '}}' + (corr ? ' \\cdot \\sqrt{\\frac{' + kn(p.N - p.n) + '}{' + kn(p.N - 1) + '}}' : '') + ' = ' + kf(se) + ' \\) €.',
            '\\( ' + p.m + ' \\pm ' + kn(t) + ' \\cdot ' + kf(se) + ' = ' + p.m + ' \\pm ' + kf(t * se) + ' \\) → \\( ' + kf(lo) + ' < \\bar{X} < ' + kf(hi) + ' \\) €.',
            'Zaključak: uz ' + p.conf + ' % pouzdanosti prosječna potrošnja svih gostiju je između ' + fmt(lo) + ' € i ' + fmt(hi) + ' €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Postupak: t → f → s → s_x̄ (uz faktor korekcije ako je f > 0,05) → interval → zaključak.']
    },

    {
      id: 'hr7-as-mali-random',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Interval procjene AS — mali uzorak (n ≤ 30)',
      prompt: 'Procijenite prosječno vrijeme pripreme jela uz mali uzorak.',
      difficulty: 3,
      params: {
        n: { choices: [10, 12, 15, 16, 17, 20, 21, 25, 26] },
        sig: { min: 4, max: 20 },
        m: { min: 20, max: 60 },
        conf: { choices: [95, 99] },
        N: { choices: [150, 300, 1000, 5000] }
      },
      generate(p) {
        const k = p.n - 1;
        const t = tSmall(k, p.conf);
        const f = p.n / p.N;
        const s = p.sig * Math.sqrt(p.n / (p.n - 1));
        let se = s / Math.sqrt(p.n - 1);
        const corr = f > 0.05;
        if (corr) se *= Math.sqrt((p.N - p.n) / (p.N - 1));
        const lo = p.m - t * se, hi = p.m + t * se;
        return {
          prompt: 'Restoran je u mjesecu pripremio N = ' + num(p.N) + ' jela s menija. U uzorku od n = ' + p.n + ' jela prosječno vrijeme pripreme je \\( \\bar{x} = '
            + p.m + ' \\) min, \\( \\sigma = ' + p.sig + ' \\) min. Uz ' + p.conf + ' % pouzdanosti procijenite interval AS osnovnog skupa (2 decimale).',
          fields: [
            { key: 'k', label: 'Stupnjevi slobode k', answer: k, tol: 0.01, unit: '', hint: 'k = n − 1' },
            { key: 's', label: 'Procijenjena standardna devijacija s', answer: s, tol: 0.02, unit: 'min', hint: '\\( s = \\sigma\\sqrt{\\frac{n}{n-1}} \\) (n ≤ 50)' },
            { key: 'se', label: 'Standardna greška \\( s_{\\bar{x}} \\)', answer: se, tol: 0.01, unit: 'min', hint: '\\( s/\\sqrt{n-1} \\) (n ≤ 30); ako je f > 0,05 pomnoži s faktorom korekcije' },
            { key: 'lo', label: 'Donja granica intervala', answer: lo, tol: 0.05, unit: 'min', hint: 't iz tablice: k = ' + k + ', stupac ' + (p.conf === 99 ? '0,01' : '0,05') },
            { key: 'hi', label: 'Gornja granica intervala', answer: hi, tol: 0.05, unit: 'min', hint: '\\( \\bar{x} + t \\cdot s_{\\bar{x}} \\)' }
          ],
          solution: [
            'Mali uzorak: k = ' + p.n + ' − 1 = ' + k + ' → iz tablice (stupac ' + (p.conf === 99 ? '0,01' : '0,05') + ') t = ' + fmt(t, 3) + '.',
            '\\( f = \\frac{' + p.n + '}{' + kn(p.N) + '} = ' + kf(f, 4) + ' \\) ' + (corr ? '> 0,05 → faktor korekcije.' : '< 0,05 → bez faktora korekcije.'),
            '\\( s = ' + p.sig + '\\sqrt{\\frac{' + p.n + '}{' + k + '}} = ' + kf(s) + ' \\); \\( s_{\\bar{x}} = \\frac{' + kf(s) + '}{\\sqrt{' + k + '}}'
              + (corr ? ' \\cdot \\sqrt{\\frac{' + kn(p.N - p.n) + '}{' + kn(p.N - 1) + '}}' : '') + ' = ' + kf(se) + ' \\).',
            '\\( ' + p.m + ' \\pm ' + kf(t, 3) + ' \\cdot ' + kf(se) + ' \\) → \\( ' + kf(lo) + ' < \\bar{X} < ' + kf(hi) + ' \\) min.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. FMTU zapis za mali uzorak: s = σ√(n/(n−1)), s_x̄ = s/√(n−1), t iz tablice uz k = n − 1.']
    },

    {
      id: 'hr7-faktor-korekcije',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Kada treba faktor korekcije',
      prompt: 'Anketirano je n = 100 gostiju: prosječna dnevna izvanpansionska potrošnja \\( \\bar{x} = 60 \\) €, σ = 15 €. Hotel je u sezoni imao N = 1 500 gostiju. '
        + 'Uz 95 % pouzdanosti procijenite interval AS (seminar 7). Frakciju izbora upišite na 4 decimale, ostalo na 2.',
      difficulty: 2,
      fields: [
        { key: 'f', label: 'Frakcija izbora f', answer: 100 / 1500, tol: 0.0006, unit: '', hint: 'f = n/N' },
        { key: 'se', label: 'Standardna greška \\( s_{\\bar{x}} \\) (s korekcijom)', answer: 1.5 * Math.sqrt(1400 / 1499), tol: 0.01, unit: '€', hint: '\\( \\frac{15}{\\sqrt{100}} \\cdot \\sqrt{\\frac{1\\,400}{1\\,499}} \\)' },
        { key: 'lo', label: 'Donja granica', answer: 60 - 1.96 * 1.5 * Math.sqrt(1400 / 1499), tol: 0.05, unit: '€', hint: '\\( 60 - 1{,}96 \\cdot s_{\\bar{x}} \\)' },
        { key: 'hi', label: 'Gornja granica', answer: 60 + 1.96 * 1.5 * Math.sqrt(1400 / 1499), tol: 0.05, unit: '€', hint: '\\( 60 + 1{,}96 \\cdot s_{\\bar{x}} \\)' }
      ],
      solution: [
        '\\( f = 100/1\\,500 = 0{,}0667 > 0{,}05 \\) → faktor korekcije; n > 50 → s = σ = 15; t = 1,96.',
        '\\( s_{\\bar{x}} = 1{,}5 \\cdot \\sqrt{\\frac{1\\,400}{1\\,499}} = 1{,}5 \\cdot 0{,}966 = 1{,}45 \\) €.',
        '\\( 60 \\pm 1{,}96 \\cdot 1{,}45 = 60 \\pm 2{,}84 \\) → 57,16 € do 62,84 €. (Uz N = 5 000 bilo bi f = 0,02 i interval 57,06 € do 62,94 € — korekcija sužava interval.)'
      ]
    },

    {
      id: 'hr7-total-random',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Interval procjene totala osnovnog skupa',
      prompt: 'Procijenite ukupno vrijeme čišćenja svih soba u sezoni.',
      difficulty: 3,
      params: {
        N: { choices: [2000, 3000, 4000, 5000] },
        n: { choices: [16, 20, 25, 28] },
        m: { min: 20, max: 40, step: 0.5 },
        sig: { min: 3, max: 8, step: 0.5 }
      },
      generate(p) {
        const k = p.n - 1, t = T95[k];
        const s = p.sig * Math.sqrt(p.n / (p.n - 1));
        const se = s / Math.sqrt(p.n - 1);
        const total = p.N * p.m, seT = p.N * se;
        const lo = total - t * seT, hi = total + t * seT;
        const tol = Math.ceil(p.N * t * 0.007);
        return {
          prompt: 'Tijekom sezone očišćeno je N = ' + num(p.N) + ' soba. U uzorku od n = ' + p.n + ' soba prosječno vrijeme čišćenja je \\( \\bar{x} = ' + kn(p.m)
            + ' \\) min, \\( \\sigma = ' + kn(p.sig) + ' \\) min. Uz 95 % pouzdanosti procijenite interval ukupnog vremena čišćenja (2 decimale).',
          fields: [
            { key: 'tot', label: 'Procjena totala \\( \\sum x^{\\prime} = N\\bar{x} \\)', answer: total, tol: 0.5, unit: 'min', hint: 'N · x̄' },
            { key: 'lo', label: 'Donja granica totala', answer: lo, tol: tol, unit: 'min', hint: '\\( s_{\\sum x^{\\prime}} = N \\cdot s_{\\bar{x}} \\); t iz tablice uz k = ' + k },
            { key: 'hi', label: 'Gornja granica totala', answer: hi, tol: tol, unit: 'min', hint: '\\( \\sum x^{\\prime} + t \\cdot s_{\\sum x^{\\prime}} \\)' }
          ],
          solution: [
            '\\( \\sum x^{\\prime} = ' + kn(p.N) + ' \\cdot ' + kn(p.m) + ' = ' + kn(total) + ' \\) min.',
            'k = ' + k + ' → t = ' + fmt(t, 3) + '; f = ' + fmt(p.n / p.N, 4) + ' < 0,05.',
            '\\( s = ' + kn(p.sig) + '\\sqrt{\\frac{' + p.n + '}{' + k + '}} = ' + kf(s) + ' \\); \\( s_{\\bar{x}} = \\frac{' + kf(s) + '}{\\sqrt{' + k + '}} = ' + kf(se) + ' \\); \\( s_{\\sum x^{\\prime}} = ' + kn(p.N) + ' \\cdot ' + kf(se) + ' = ' + kf(seT) + ' \\).',
            '\\( ' + kn(total) + ' \\pm ' + kf(t, 3) + ' \\cdot ' + kf(seT) + ' \\) → \\( ' + kf(lo) + ' < \\sum X < ' + kf(hi) + ' \\) min. (Tolerancija ±' + tol + ' min dopušta zaokruživanje međurezultata.)'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Total = N · x̄; standardna greška totala = N · s_x̄; mali uzorak → t iz tablice.']
    },

    {
      id: 'hr7-proporcija-random',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Interval procjene proporcije — zadovoljstvo gostiju',
      prompt: 'Procijenite postotak svih gostiju koji su zadovoljni uslugom.',
      difficulty: 2,
      params: {
        n: { choices: [100, 200, 300, 400, 500] },
        pct: { choices: [0.15, 0.2, 0.25, 0.3, 0.4, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9] },
        conf: { choices: [95, 99] },
        N: { choices: [1500, 2500, 3500, 12000, 20000] }
      },
      generate(p) {
        const m = Math.round(p.n * p.pct);
        const pp = m / p.n, q = 1 - pp;
        const t = tLarge(p.conf);
        const f = p.n / p.N, corr = f > 0.05;
        let sp = Math.sqrt(pp * q / p.n);
        if (corr) sp *= Math.sqrt((p.N - p.n) / (p.N - 1));
        const lo = (pp - t * sp) * 100, hi = (pp + t * sp) * 100;
        return {
          prompt: 'Hotel je u sezoni ugostio N = ' + num(p.N) + ' gostiju. Od n = ' + p.n + ' anketiranih njih m = ' + m + ' zadovoljno je uslugom. '
            + 'Uz ' + p.conf + ' % pouzdanosti procijenite interval proporcije zadovoljnih gostiju. Granice upišite u postocima na 2 decimale.',
          fields: [
            { key: 'p', label: 'Proporcija uzorka p (u %)', answer: pp * 100, tol: 0.01, unit: '%', hint: 'p = m/n' },
            { key: 'lo', label: 'Donja granica (u %)', answer: lo, tol: 0.05, unit: '%', hint: '\\( s_p = \\sqrt{\\frac{pq}{n}} \\) (n > 30); ako je f > 0,05 — faktor korekcije' },
            { key: 'hi', label: 'Gornja granica (u %)', answer: hi, tol: 0.05, unit: '%', hint: '\\( p + t \\cdot s_p \\), t = ' + num(t) }
          ],
          solution: [
            '\\( p = \\frac{' + m + '}{' + p.n + '} = ' + kf(pp) + ' \\), \\( q = ' + kf(q) + ' \\); n > 30 → t = ' + num(t) + '.',
            '\\( f = ' + kf(f, 4) + ' \\) ' + (corr ? '> 0,05 → faktor korekcije.' : '< 0,05 → bez korekcije.'),
            '\\( s_p = \\sqrt{\\frac{' + kf(pp) + ' \\cdot ' + kf(q) + '}{' + p.n + '}}' + (corr ? ' \\cdot \\sqrt{\\frac{' + kn(p.N - p.n) + '}{' + kn(p.N - 1) + '}}' : '') + ' = ' + kf(sp, 4) + ' \\).',
            '\\( ' + kf(pp) + ' \\pm ' + kn(t) + ' \\cdot ' + kf(sp, 4) + ' \\) → \\( ' + kf(lo / 100, 4) + ' < P < ' + kf(hi / 100, 4) + ' \\), tj. ' + fmt(lo) + ' % do ' + fmt(hi) + ' % svih gostiju.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. p = m/n, q = 1 − p, s_p = √(pq/n) (n > 30), interval p ± t·s_p.']
    },

    {
      id: 'hr7-proporcija-mali-random',
      lesson: 'second-midterm', chapter: 7, category: 'sampling',
      type: 'numeric',
      title: 'Interval procjene proporcije — mali uzorak',
      prompt: 'Procijenite udio gostiju koji bi ponovno rezervirali boravak, uz mali uzorak.',
      difficulty: 3,
      params: {
        n: { choices: [20, 25] },
        share: { min: 0.4, max: 0.8, step: 0.04 },
        conf: { choices: [95, 99] }
      },
      generate(p) {
        const m = Math.round(p.n * p.share);
        const pp = m / p.n, q = 1 - pp, k = p.n - 1;
        const t = tSmall(k, p.conf);
        const sp = Math.sqrt(pp * q / (p.n - 1));
        const lo = (pp - t * sp) * 100, hi = (pp + t * sp) * 100;
        return {
          prompt: 'Od n = ' + p.n + ' anketiranih gostiju butik-hotela njih m = ' + m + ' ponovno bi rezerviralo boravak (osnovni skup je velik, f < 0,05). '
            + 'Uz ' + p.conf + ' % pouzdanosti procijenite interval proporcije. Granice upišite u postocima na 2 decimale.',
          fields: [
            { key: 'k', label: 'Stupnjevi slobode k', answer: k, tol: 0.01, unit: '', hint: 'k = n − 1' },
            { key: 'p', label: 'Proporcija uzorka p (u %)', answer: pp * 100, tol: 0.01, unit: '%', hint: 'p = m/n' },
            { key: 'lo', label: 'Donja granica (u %)', answer: lo, tol: 0.05, unit: '%', hint: '\\( s_p = \\sqrt{\\frac{pq}{n-1}} \\) (n ≤ 30); t iz tablice' },
            { key: 'hi', label: 'Gornja granica (u %)', answer: hi, tol: 0.05, unit: '%', hint: '\\( p + t \\cdot s_p \\)' }
          ],
          solution: [
            '\\( p = \\frac{' + m + '}{' + p.n + '} = ' + kf(pp) + ' \\), \\( q = ' + kf(q) + ' \\); k = ' + k + ' → t = ' + fmt(t, 3) + ' (stupac ' + (p.conf === 99 ? '0,01' : '0,05') + ').',
            '\\( s_p = \\sqrt{\\frac{' + kf(pp) + ' \\cdot ' + kf(q) + '}{' + k + '}} = ' + kf(sp, 4) + ' \\).',
            '\\( ' + kf(pp) + ' \\pm ' + kf(t, 3) + ' \\cdot ' + kf(sp, 4) + ' \\) → ' + fmt(lo) + ' % do ' + fmt(hi) + ' %.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Mali uzorak: s_p = √(pq/(n−1)), t iz tablice uz k = n − 1.']
    },

    // =====================================================================
    // PREDAVANJE 8 — KORELACIJA I REGRESIJA (second-midterm, correlationRegression)
    // =====================================================================
    {
      id: 'hr8-koncepti',
      lesson: 'second-midterm', chapter: 8, category: 'correlationRegression',
      type: 'choice',
      title: 'Korelacija i regresija — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Koeficijent linearne korelacije r uvijek leži između −1 i +1.', kind: 'tf', answer: true },
        { q: 'Iz jake korelacije može se zaključiti da je X uzrok Y.', kind: 'tf', answer: false },
        { q: 'Spearmanov koeficijent koristi se za redoslijedne (rang) varijable.', kind: 'tf', answer: true },
        { q: 'U \\( Y_c = a + bx \\) b je konstantni član.', kind: 'tf', answer: false },
        { q: 'Koeficijent determinacije r² = 0,878 znači da je 87,8 % varijacije Y protumačeno modelom.', kind: 'tf', answer: true },
        { q: 'r = −0,72 označava:', kind: 'mc', options: ['jaku negativnu vezu', 'slabu negativnu vezu', 'srednje jaku pozitivnu vezu', 'potpunu negativnu vezu'], answer: 0 },
        { q: 'r = 0,45 označava:', kind: 'mc', options: ['slabu vezu', 'srednje jaku (umjerenu) pozitivnu vezu', 'jaku pozitivnu vezu', 'odsustvo veze'], answer: 1 },
        { q: 'Oblak točaka od lijevog gornjeg prema desnom donjem kutu upućuje na:', kind: 'mc', options: ['pozitivnu vezu', 'negativnu vezu', 'funkcionalnu vezu', 'odsustvo veze'], answer: 1 },
        { q: 'Regresijski koeficijent b pokazuje:', kind: 'mc', options: ['vrijednost Y kad je X = 0', 'prosječnu promjenu Y kad se X poveća za jedinicu', 'jakost veze', 'udio protumačene varijacije'], answer: 1 }
      ],
      solution: [
        'Granice za r: od −0,3 do +0,3 slaba, ±0,3 do ±0,6 srednje jaka, ±0,6 do ±1 jaka veza.',
        'a = konstantni član (Y kad je X = 0), b = regresijski koeficijent (nagib). Korelacija ne dokazuje uzročnost.'
      ]
    },

    {
      id: 'hr8-regresija-random',
      lesson: 'second-midterm', chapter: 8, category: 'correlationRegression',
      type: 'ratio',
      title: 'Jednostavna linearna regresija — oglašavanje i rezervacije',
      prompt: 'Izračunajte pravac regresije, koeficijent korelacije i determinacije te prognozu.',
      difficulty: 3,
      params: {
        x0: { choices: [1, 2, 5, 10] },
        h: { choices: [1, 2] },
        a0: { choices: [10, 20, 30, 50] },
        b: { choices: [1.5, 2, 2.5, 3, 4, 5] },
        pat: { choices: [0, 1, 2, 3, 4] },
        k: { choices: [1, 2, 3] }
      },
      generate(p) {
        const xs = [0, 1, 2, 3, 4].map((i) => p.x0 + p.h * i);
        const ys = xs.map((x, i) => p.a0 + p.b * x + p.k * RES5[p.pat][i]);
        const n = 5, mx = sum(xs) / n, my = sum(ys) / n;
        const sxy = sum(xs.map((x, i) => x * ys[i])), sxx = sum(xs.map((x) => x * x)), syy = sum(ys.map((y) => y * y));
        const b = (sxy - mx * sum(ys)) / (sxx - mx * sum(xs));
        const a = my - b * mx;
        const r = (sxy - n * mx * my) / Math.sqrt((sxx - n * mx * mx) * (syy - n * my * my));
        const x1 = xs[4] + p.h, yhat = a + b * x1;
        return {
          prompt: 'Mjesečno ulaganje u oglašavanje X (000 €) i broj rezervacija Y (u stotinama) za 5 mjeseci. Izračunajte b i a (2 decimale), r i r² (3 decimale) te prognozu Y za X = ' + x1 + '.',
          givens: xs.map((x, i) => ({ label: (i + 1) + '. mjesec: X / Y', value: num(x) + ' / ' + num(ys[i]) })),
          fields: [
            { key: 'b', label: 'Regresijski koeficijent b', answer: b, tol: 0.01, unit: '', hint: '\\( b = \\frac{\\sum xy - \\bar{x}\\sum y}{\\sum x^2 - \\bar{x}\\sum x} \\)' },
            { key: 'a', label: 'Konstantni član a', answer: a, tol: 0.02, unit: '', hint: '\\( a = \\bar{y} - b\\bar{x} \\)' },
            { key: 'r', label: 'Koeficijent korelacije r', answer: r, tol: 0.01, unit: '', hint: '\\( r = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum (x-\\bar{x})^2 \\sum (y-\\bar{y})^2}} \\)' },
            { key: 'r2', label: 'Koeficijent determinacije r²', answer: r * r, tol: 0.01, unit: '', hint: 'r²' },
            { key: 'yhat', label: 'Prognoza \\( Y_c \\) za X = ' + x1, answer: yhat, tol: 0.05, unit: '', hint: '\\( Y_c = a + b \\cdot ' + x1 + ' \\)' }
          ],
          solution: [
            '\\( \\sum x = ' + kn(sum(xs)) + ' \\), \\( \\sum y = ' + kn(sum(ys)) + ' \\), \\( \\sum xy = ' + kn(sxy) + ' \\), \\( \\sum x^2 = ' + kn(sxx) + ' \\), \\( \\sum y^2 = ' + kn(syy) + ' \\); \\( \\bar{x} = ' + kn(mx) + ' \\), \\( \\bar{y} = ' + kn(my) + ' \\).',
            '\\( b = \\frac{' + kn(sxy) + ' - ' + kn(mx) + ' \\cdot ' + kn(sum(ys)) + '}{' + kn(sxx) + ' - ' + kn(mx) + ' \\cdot ' + kn(sum(xs)) + '} = ' + kf(b) + ' \\); \\( a = ' + kn(my) + ' - ' + kf(b) + ' \\cdot ' + kn(mx) + ' = ' + kf(a) + ' \\).',
            '\\( Y_c = ' + kf(a) + ' + ' + kf(b) + 'x \\): tisuću eura više za oglašavanje donosi u prosjeku ' + fmt(b) + ' stotina rezervacija više.',
            '\\( r = ' + kf(r, 3) + ' \\), \\( r^2 = ' + kf(r * r, 3) + ' \\) → ' + fmt(r * r * 100, 1) + ' % varijacije Y protumačeno je modelom.',
            'Prognoza: \\( Y_c(' + x1 + ') = ' + kf(a) + ' + ' + kf(b) + ' \\cdot ' + x1 + ' = ' + kf(yhat) + ' \\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. b iz suma, a = ȳ − b·x̄, r iz odstupanja (ili r = √(b·b′)), r² = udio protumačene varijacije.']
    },

    {
      id: 'hr8-placa-iskustvo',
      lesson: 'second-midterm', chapter: 8, category: 'correlationRegression',
      type: 'ratio',
      title: 'Radno iskustvo i plaća (seminar 8)',
      prompt: 'Radno iskustvo X (godine) i godišnja plaća Y (u tis.) pet djelatnika. Izračunajte b i a na 2 decimale, r² i r na 3 decimale te prognozu za X = 6.',
      difficulty: 3,
      givens: [
        { label: 'X (godine)', value: '1; 5; 4; 2; 10' },
        { label: 'Y (tis.)', value: '90; 100; 105; 100; 120' }
      ],
      fields: [
        { key: 'b', label: 'Regresijski koeficijent b', answer: 144 / 49.2, tol: 0.01, unit: '', hint: '\\( \\bar{x} = 4{,}4 \\), \\( \\bar{y} = 103 \\), \\( \\sum xy = 2\\,410 \\), \\( \\sum x^2 = 146 \\)' },
        { key: 'a', label: 'Konstantni član a', answer: 103 - 144 / 49.2 * 4.4, tol: 0.02, unit: '', hint: '\\( a = \\bar{y} - b\\bar{x} \\)' },
        { key: 'r2', label: 'Koeficijent determinacije r²', answer: (144 * 144 / 49.2) / 480, tol: 0.01, unit: '', hint: '\\( r^2 = \\frac{\\sum (\\hat{y} - \\bar{y})^2}{\\sum (y - \\bar{y})^2} \\), \\( \\sum (y - \\bar{y})^2 = 480 \\)' },
        { key: 'r', label: 'Koeficijent korelacije r', answer: Math.sqrt((144 * 144 / 49.2) / 480), tol: 0.01, unit: '', hint: '\\( r = \\sqrt{r^2} \\)' },
        { key: 'yhat', label: 'Prognoza plaće za X = 6', answer: 103 - 144 / 49.2 * 4.4 + 144 / 49.2 * 6, tol: 0.05, unit: 'tis.', hint: 'a + b · 6' }
      ],
      solution: [
        '\\( b = \\frac{2\\,410 - 5 \\cdot 4{,}4 \\cdot 103}{146 - 5 \\cdot 4{,}4^2} = \\frac{144}{49{,}2} = 2{,}93 \\); \\( a = 103 - 2{,}93 \\cdot 4{,}4 = 90{,}11 \\) (s nezaokruženim b dobije se 90,12 — prihvaća se oboje).',
        '\\( r^2 = \\frac{421{,}46}{480} = 0{,}878 \\) → 87,8 % varijacije plaće objašnjeno je iskustvom; \\( r = 0{,}937 \\) → jaka pozitivna veza.',
        'Prognoza: \\( 90{,}11 + 2{,}93 \\cdot 6 = 107{,}69 \\) tis. Konstantni član (plaća uz 0 godina iskustva) ovdje nema smisleno tumačenje.'
      ]
    },

    {
      id: 'hr8-spearman-random',
      lesson: 'second-midterm', chapter: 8, category: 'correlationRegression',
      type: 'numeric',
      title: 'Spearmanov koeficijent korelacije ranga',
      prompt: 'Izračunajte Spearmanov koeficijent korelacije ranga za ocjene dvaju ocjenjivača.',
      difficulty: 2,
      params: {
        pa: { choices: [0, 1, 2, 3, 4, 5] },
        pb: { choices: [0, 1, 2, 3, 4, 5, 6, 7] }
      },
      generate(p) {
        const A = [[1, 2, 3, 4, 5, 6], [2, 1, 4, 3, 6, 5], [3, 1, 2, 6, 4, 5], [6, 5, 4, 3, 2, 1], [1, 3, 5, 2, 4, 6], [4, 2, 6, 1, 5, 3]];
        const B = [[1, 2, 3, 4, 5, 6], [2, 3, 1, 5, 6, 4], [6, 5, 4, 3, 2, 1], [3, 1, 4, 2, 6, 5], [1, 4, 2, 6, 3, 5], [5, 6, 3, 4, 1, 2], [2, 1, 3, 6, 5, 4], [4, 3, 6, 1, 2, 5]];
        const ra = A[p.pa], rb = B[p.pb];
        const d = ra.map((r, i) => r - rb[i]);
        const sd2 = sum(d.map((x) => x * x));
        const n = 6, rs = 1 - 6 * sd2 / (n * n * n - n);
        const names = ['Hotel A', 'Hotel B', 'Hotel C', 'Hotel D', 'Hotel E', 'Hotel F'];
        return {
          prompt: 'Dva ocjenjivača rangirala su šest hotela (1 = najbolji). Ocjenjivač 1: ' + names.map((h, i) => h + ' ' + ra[i]).join(', ')
            + '. Ocjenjivač 2: ' + names.map((h, i) => h + ' ' + rb[i]).join(', ') + '. Izračunajte Σd² i Spearmanov koeficijent na 2 decimale.',
          fields: [
            { key: 'sd2', label: 'Zbroj kvadrata razlika rangova \\( \\sum d_i^2 \\)', answer: sd2, tol: 0.01, unit: '', hint: '\\( d_i = r_{x_i} - r_{y_i} \\)' },
            { key: 'rs', label: 'Spearmanov koeficijent \\( r_s \\)', answer: rs, tol: 0.006, unit: '', hint: '\\( r_s = 1 - \\frac{6\\sum d_i^2}{n^3 - n} \\), n = 6 → nazivnik 210' }
          ],
          solution: [
            'Razlike rangova d: ' + d.map((x) => num(x)).join('; ') + ' → \\( \\sum d^2 = ' + sd2 + ' \\).',
            '\\( r_s = 1 - \\frac{6 \\cdot ' + sd2 + '}{216 - 6} = 1 - \\frac{' + (6 * sd2) + '}{210} = ' + kf(rs, 2) + ' \\).',
            (Math.abs(rs) >= 0.6 ? 'Jaka' : Math.abs(rs) >= 0.3 ? 'Srednje jaka' : 'Slaba') + (rs > 0 ? ' pozitivna' : rs < 0 ? ' negativna' : '') + ' povezanost rangova.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove rang-liste. r_s = 1 − 6Σd² ÷ (n³ − n).']
    },

    {
      id: 'hr8-spearman-vezani-rangovi',
      lesson: 'second-midterm', chapter: 8, category: 'correlationRegression',
      type: 'ratio',
      title: 'Spearman s jednakim vrijednostima (predavanje 8)',
      prompt: 'Bodovi šest studenata na I. (X) i II. (Y) kolokviju. Rangiraj od najmanje vrijednosti (rang 1); jednakim vrijednostima daj prosječni rang. Rezultat na 2 decimale.',
      difficulty: 2,
      givens: [
        { label: 'X (I. kolokvij)', value: '88; 62; 55; 96; 78; 49' },
        { label: 'Y (II. kolokvij)', value: '47; 63; 70; 80; 70; 40' }
      ],
      fields: [
        { key: 'sd2', label: 'Zbroj kvadrata razlika rangova \\( \\sum d_i^2 \\)', answer: 15.5, tol: 0.01, unit: '', hint: 'Dva studenta imaju 70 bodova → rangovi 4 i 5 → oba 4,5' },
        { key: 'rs', label: 'Spearmanov koeficijent \\( r_s \\)', answer: 1 - 93 / 210, tol: 0.006, unit: '', hint: '\\( 1 - \\frac{6 \\cdot 15{,}5}{210} \\)' }
      ],
      solution: [
        'Rangovi X: 5, 3, 2, 6, 4, 1; rangovi Y: 2, 3, 4,5, 6, 4,5, 1.',
        'd: 3, 0, −2,5, 0, −0,5, 0 → \\( \\sum d^2 = 9 + 6{,}25 + 0{,}25 = 15{,}5 \\).',
        '\\( r_s = 1 - \\frac{93}{210} = 0{,}56 \\) → srednje jaka pozitivna veza.'
      ]
    },

    // =====================================================================
    // PREDAVANJE 9 — VREMENSKI NIZOVI (second-midterm, timeSeries)
    // =====================================================================
    {
      id: 'hr9-koncepti',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'choice',
      title: 'Vremenski nizovi — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Verižni indeks uspoređuje pojavu s prethodnim razdobljem.', kind: 'tf', answer: true },
        { q: 'Trenutačni niz može se zbrajati i crtati površinskim grafikonom.', kind: 'tf', answer: false },
        { q: 'Broj dolazaka turista po godinama je intervalni niz.', kind: 'tf', answer: true },
        { q: 'Prosječna stopa promjene računa se aritmetičkom sredinom verižnih indeksa.', kind: 'tf', answer: false },
        { q: 'Za linearni trend vrijedi \\( \\sum Y = \\sum Y_c \\).', kind: 'tf', answer: true },
        { q: 'Broj zaposlenih u hotelu na dan 31.12. je:', kind: 'mc', options: ['intervalni niz', 'trenutačni niz', 'skupni indeks', 'relativni broj strukture'], answer: 1 },
        { q: 'Kod ishodišta u sredini i parnog N (x = …, −3, −1, 1, 3, …) godišnja promjena trenda iznosi:', kind: 'mc', options: ['b', '2b', 'b/2', 'a + b'], answer: 1 },
        { q: 'Ako je x = 1 u prvoj godini niza, konstantni član a je trend vrijednost za:', kind: 'mc', options: ['prvu godinu niza', 'godinu prije niza', 'srednju godinu', 'zadnju godinu'], answer: 1 }
      ],
      solution: [
        'Verižni = prema prethodnom razdoblju; bazni = prema baznom razdoblju. Stopa promjene = indeks − 100.',
        'Trenutačni niz (stanje u trenutku) se ne zbraja i crta se samo linijski.',
        'Značenje a ovisi o kodiranju: x = 0 u prvoj godini → a je trend prve godine; x = 1 u prvoj godini → a je trend godine prije niza.'
      ]
    },

    {
      id: 'hr9-nocenja-indeksi',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'ratio',
      title: 'Noćenja turista u RH 2015.–2019. (seminar 9)',
      prompt: 'Broj noćenja turista u RH (u tisućama). Izračunajte indekse i prosječnu stopu promjene na 2 decimale.',
      difficulty: 2,
      givens: [
        { label: '2015.', value: '71 437' },
        { label: '2016.', value: '77 919' },
        { label: '2017.', value: '86 200' },
        { label: '2018.', value: '89 652' },
        { label: '2019.', value: '91 243' }
      ],
      fields: [
        { key: 'v17', label: 'Verižni indeks 2017.', answer: 86200 / 77919 * 100, tol: 0.01, unit: '', hint: '\\( V_t = \\frac{Y_t}{Y_{t-1}} \\cdot 100 \\)' },
        { key: 'v19', label: 'Verižni indeks 2019.', answer: 91243 / 89652 * 100, tol: 0.01, unit: '', hint: '91 243 ÷ 89 652 · 100' },
        { key: 'i19', label: 'Bazni indeks 2019. (2015. = 100)', answer: 91243 / 71437 * 100, tol: 0.01, unit: '', hint: '\\( I_t = \\frac{Y_t}{Y_b} \\cdot 100 \\)' },
        { key: 'g', label: 'Geometrijska sredina verižnih indeksa G', answer: 100 * Math.pow(91243 / 71437, 0.25), tol: 0.02, unit: '', hint: '\\( G = 100\\sqrt[n]{Y_N / Y_1} \\), n = 4' },
        { key: 's', label: 'Prosječna godišnja stopa promjene', answer: 100 * Math.pow(91243 / 71437, 0.25) - 100, tol: 0.02, unit: '%', hint: 'G − 100' }
      ],
      solution: [
        'Verižni indeksi: 109,07 · 110,63 · 104,00 · 101,77 (npr. \\( V_{2017} = \\frac{86\\,200}{77\\,919} \\cdot 100 = 110{,}63 \\)).',
        'Bazni 2019.: \\( \\frac{91\\,243}{71\\,437} \\cdot 100 = 127{,}73 \\) → 27,73 % više noćenja nego 2015.',
        '\\( G = \\sqrt[4]{109{,}07 \\cdot 110{,}63 \\cdot 104{,}00 \\cdot 101{,}77} = 106{,}31 \\) → noćenja su prosječno rasla 6,31 % godišnje.'
      ]
    },

    {
      id: 'hr9-indeksi-random',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'ratio',
      title: 'Verižni i bazni indeksi — promet hotela',
      prompt: 'Izračunajte verižni i bazni indeks te stope promjene.',
      difficulty: 1,
      params: {
        y1: { min: 400, max: 700, step: 5 }, y2: { min: 400, max: 700, step: 5 }, y3: { min: 400, max: 700, step: 5 },
        y4: { min: 400, max: 700, step: 5 }, y5: { min: 400, max: 700, step: 5 },
        bi: { choices: [0, 2] }
      },
      generate(p) {
        const ys = [p.y1, p.y2, p.y3, p.y4, p.y5];
        const yrs = [2020, 2021, 2022, 2023, 2024];
        const V4 = ys[3] / ys[2] * 100;
        const I5 = ys[4] / ys[p.bi] * 100;
        return {
          prompt: 'Godišnji promet hotela (000 €) 2020.–2024. Izračunajte verižni indeks za 2023. i bazni indeks za 2024. uz ' + yrs[p.bi] + '. = 100 (2 decimale).',
          givens: ys.map((y, i) => ({ label: yrs[i] + '.', value: num(y) + ' tis. €' })),
          fields: [
            { key: 'v', label: 'Verižni indeks 2023.', answer: V4, tol: 0.01, unit: '', hint: 'Y₂₀₂₃ ÷ Y₂₀₂₂ · 100' },
            { key: 'sv', label: 'Stopa promjene 2023. prema 2022.', answer: V4 - 100, tol: 0.01, unit: '%', hint: 'V − 100' },
            { key: 'i', label: 'Bazni indeks 2024. (' + yrs[p.bi] + '. = 100)', answer: I5, tol: 0.01, unit: '', hint: 'Y₂₀₂₄ ÷ Y_b · 100' },
            { key: 'si', label: 'Stopa promjene 2024. prema baznoj godini', answer: I5 - 100, tol: 0.01, unit: '%', hint: 'I − 100' }
          ],
          solution: [
            '\\( V_{2023} = \\frac{' + kn(ys[3]) + '}{' + kn(ys[2]) + '} \\cdot 100 = ' + kf(V4) + ' \\) → stopa \\( ' + kf(V4 - 100) + '\\,\\% \\) prema 2022.',
            '\\( I_{2024} = \\frac{' + kn(ys[4]) + '}{' + kn(ys[p.bi]) + '} \\cdot 100 = ' + kf(I5) + ' \\) → stopa \\( ' + kf(I5 - 100) + '\\,\\% \\) prema ' + yrs[p.bi] + '.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Verižni = prema prethodnoj godini; bazni = prema baznoj godini; stopa = indeks − 100.']
    },

    {
      id: 'hr9-verizni-u-bazne-random',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'numeric',
      title: 'Iz verižnih u bazne indekse',
      prompt: 'Iz verižnih indeksa izračunajte bazne indekse (prva godina = 100).',
      difficulty: 2,
      params: {
        v2: { choices: [90, 95, 104, 105, 110, 120] },
        v3: { choices: [96, 102, 106, 108, 115] },
        v4: { choices: [94, 98, 103, 105, 112] }
      },
      generate(p) {
        const I3 = p.v2 * p.v3 / 100, I4 = I3 * p.v4 / 100;
        return {
          prompt: 'Verižni indeksi dolazaka turista: 2022. → ' + num(p.v2) + '; 2023. → ' + num(p.v3) + '; 2024. → ' + num(p.v4)
            + ' (svaki prema prethodnoj godini). Uz 2021. = 100 izračunajte bazne indekse na 2 decimale.',
          fields: [
            { key: 'i3', label: 'Bazni indeks 2023. (2021. = 100)', answer: I3, tol: 0.02, unit: '', hint: '\\( \\frac{V_{2022} \\cdot V_{2023}}{100} \\)' },
            { key: 'i4', label: 'Bazni indeks 2024. (2021. = 100)', answer: I4, tol: 0.02, unit: '', hint: 'I₂₀₂₃ · V₂₀₂₄ ÷ 100' },
            { key: 's4', label: 'Stopa promjene 2024. prema 2021.', answer: I4 - 100, tol: 0.02, unit: '%', hint: 'I − 100' }
          ],
          solution: [
            'Bazni 2022. jednak je verižnom: ' + num(p.v2) + '.',
            '\\( I_{2023} = \\frac{' + kn(p.v2) + ' \\cdot ' + kn(p.v3) + '}{100} = ' + kf(I3) + ' \\).',
            '\\( I_{2024} = \\frac{' + kf(I3) + ' \\cdot ' + kn(p.v4) + '}{100} = ' + kf(I4) + ' \\) → dolasci su 2024. bili ' + fmt(Math.abs(I4 - 100)) + ' % ' + (I4 >= 100 ? 'veći' : 'manji') + ' nego 2021.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove indekse. Bazni indeks = umnožak verižnih (svaki ÷ 100) · 100.']
    },

    {
      id: 'hr9-prosjecna-stopa-random',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'numeric',
      title: 'Prosječna godišnja stopa promjene iz početne i završne vrijednosti',
      prompt: 'Izračunajte prosječnu godišnju stopu promjene dolazaka turista.',
      difficulty: 2,
      params: {
        y1: { min: 200, max: 400, step: 5 },
        g: { min: 0.8, max: 1.8, step: 0.05 },
        n: { choices: [3, 4, 5, 6] }
      },
      generate(p) {
        const yN = Math.round(p.y1 * p.g);
        const G = 100 * Math.pow(yN / p.y1, 1 / p.n);
        return {
          prompt: 'Broj dolazaka turista u destinaciju promijenio se s ' + num(p.y1) + ' tisuća (2018.) na ' + num(yN) + ' tisuća (' + (2018 + p.n) + '.). '
            + 'Izračunajte geometrijsku sredinu verižnih indeksa i prosječnu godišnju stopu promjene na 2 decimale.',
          fields: [
            { key: 'g', label: 'Geometrijska sredina G', answer: G, tol: 0.02, unit: '', hint: '\\( G = 100\\sqrt[n]{Y_N / Y_1} \\), n = broj godišnjih promjena = ' + p.n },
            { key: 's', label: 'Prosječna godišnja stopa promjene', answer: G - 100, tol: 0.02, unit: '%', hint: 'G − 100' }
          ],
          solution: [
            'Od 2018. do ' + (2018 + p.n) + '. ima n = ' + p.n + ' verižnih indeksa.',
            '\\( G = 100\\sqrt[' + p.n + ']{\\frac{' + kn(yN) + '}{' + kn(p.y1) + '}} = ' + kf(G) + ' \\).',
            'Prosječna stopa = \\( ' + kf(G - 100) + '\\,\\% \\) godišnje.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. G = 100·ⁿ√(Y_N / Y_1), gdje je n broj verižnih indeksa (broj godina − 1).']
    },

    {
      id: 'hr9-trend-random',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'ratio',
      title: 'Linearni trend i prognoza',
      prompt: 'Izračunajte linearni trend uz zadano kodiranje vremena i prognozirajte vrijednost.',
      difficulty: 3,
      params: {
        code: { choices: [0, 1, 2] },
        a0: { min: 80, max: 200, step: 5 },
        b: { choices: [-3, -2, 2.5, 3, 4, 5.5, 6, 7.5] },
        pat: { choices: [0, 1, 2, 3, 4] },
        k: { choices: [1, 2, 3] }
      },
      generate(p) {
        const yrs = [2019, 2020, 2021, 2022, 2023];
        const X = [[0, 1, 2, 3, 4], [1, 2, 3, 4, 5], [-2, -1, 0, 1, 2]][p.code];
        const codeTxt = ['ishodište na početku: x = 0 u 2019.', 'x = 1 u 2019. (kao u seminaru 9)', 'ishodište u sredini: x = 0 u 2021.'][p.code];
        const ys = [0, 1, 2, 3, 4].map((i) => p.a0 + p.b * i + p.k * RES5[p.pat][i]);
        const N = 5, mx = sum(X) / N, my = sum(ys) / N;
        const sxy = sum(X.map((x, i) => x * ys[i])), sxx = sum(X.map((x) => x * x));
        const b = (sxy - mx * sum(ys)) / (sxx - mx * sum(X));
        const a = my - b * mx;
        const xf = X[4] + 2, yf = a + b * xf;
        const aYear = yrs[0] - X[0];
        return {
          prompt: 'Noćenja u kampu (000) 2019.–2023. Kodiranje vremena: ' + codeTxt + '. Izračunajte b i a (2 decimale) te prognozu za 2025.',
          givens: ys.map((y, i) => ({ label: yrs[i] + '. (x = ' + X[i] + ')', value: num(y) })),
          fields: [
            { key: 'b', label: 'Nagib trenda b', answer: b, tol: 0.01, unit: '', hint: p.code === 2 ? '\\( b = \\frac{\\sum xY}{\\sum x^2} \\)' : '\\( b = \\frac{\\sum xY - \\bar{x}\\sum Y}{\\sum x^2 - \\bar{x}\\sum x} \\)' },
            { key: 'a', label: 'Konstantni član a', answer: a, tol: 0.02, unit: '', hint: p.code === 2 ? '\\( a = \\frac{\\sum Y}{N} \\)' : '\\( a = \\bar{Y} - b\\bar{x} \\)' },
            { key: 'yf', label: 'Prognoza \\( Y_c \\) za 2025. (x = ' + xf + ')', answer: yf, tol: 0.05, unit: '', hint: '\\( Y_c = a + b \\cdot ' + xf + ' \\)' }
          ],
          solution: [
            '\\( \\sum Y = ' + kn(sum(ys)) + ' \\), \\( \\sum x = ' + sum(X) + ' \\), \\( \\sum xY = ' + kn(sxy) + ' \\), \\( \\sum x^2 = ' + sxx + ' \\).',
            p.code === 2
              ? '\\( b = \\frac{' + kn(sxy) + '}{' + sxx + '} = ' + kf(b) + ' \\); \\( a = \\frac{' + kn(sum(ys)) + '}{5} = ' + kf(a) + ' \\).'
              : '\\( \\bar{x} = ' + kn(mx) + ' \\), \\( \\bar{Y} = ' + kn(my) + ' \\); \\( b = \\frac{' + kn(sxy) + ' - ' + kn(mx) + ' \\cdot ' + kn(sum(ys)) + '}{' + sxx + ' - ' + kn(mx) + ' \\cdot ' + sum(X) + '} = ' + kf(b) + ' \\); \\( a = ' + kn(my) + ' - ' + kf(b) + ' \\cdot ' + kn(mx) + ' = ' + kf(a) + ' \\).',
            '\\( Y_c = ' + kf(a) + (b < 0 ? ' - ' : ' + ') + kf(Math.abs(b)) + 'x \\): noćenja se prosječno ' + (b < 0 ? 'smanjuju' : 'povećavaju') + ' za ' + fmt(Math.abs(b)) + ' tisuća godišnje; a je trend vrijednost za ' + aYear + '.',
            'Prognoza za 2025.: \\( ' + kf(a) + (b < 0 ? ' - ' : ' + ') + kf(Math.abs(b)) + ' \\cdot ' + (xf < 0 ? '(' + xf + ')' : xf) + ' = ' + kf(yf) + ' \\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke i novo kodiranje. Prognoza ovisi samo o tome da se uvrsti x koji pripada traženoj godini.']
    },

    {
      id: 'hr9-trend-place',
      lesson: 'second-midterm', chapter: 9, category: 'timeSeries',
      type: 'ratio',
      title: 'Trend prosječne plaće (seminar 9)',
      prompt: 'Prosječna mjesečna neto plaća (€) 2018.–2022.; x = 1 u 2018. Izračunajte b, a i prognozu za 2025. (x = 8).',
      difficulty: 2,
      givens: [
        { label: '2018. (x = 1)', value: '828' },
        { label: '2019. (x = 2)', value: '857' },
        { label: '2020. (x = 3)', value: '898' },
        { label: '2021. (x = 4)', value: '946' },
        { label: '2022. (x = 5)', value: '1 016' }
      ],
      fields: [
        { key: 'b', label: 'Nagib trenda b', answer: 46.5, tol: 0.01, unit: '€', hint: '\\( \\sum xY = 14\\,100 \\), \\( \\bar{x} = 3 \\), \\( \\bar{Y} = 909 \\)' },
        { key: 'a', label: 'Konstantni član a', answer: 769.5, tol: 0.02, unit: '€', hint: '\\( a = \\bar{Y} - b\\bar{x} \\)' },
        { key: 'yf', label: 'Prognoza za 2025.', answer: 1141.5, tol: 0.05, unit: '€', hint: 'a + b · 8' }
      ],
      solution: [
        '\\( b = \\frac{14\\,100 - 5 \\cdot 3 \\cdot 909}{55 - 5 \\cdot 3^2} = \\frac{465}{10} = 46{,}5 \\) € godišnje.',
        '\\( a = 909 - 46{,}5 \\cdot 3 = 769{,}5 \\) € — trend vrijednost za 2017. (x = 0).',
        'Prognoza 2025.: \\( 769{,}5 + 46{,}5 \\cdot 8 = 1\\,141{,}5 \\) €.'
      ]
    }
  ];

  return { meta: { lang: 'hr', currency: '', version: 1 }, exercises: exercises };
})();

if (typeof window !== 'undefined') window.statisticsHrExercises = statisticsHrExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = statisticsHrExercises;
