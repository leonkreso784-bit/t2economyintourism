// ===== STATISTIKA (HR) — VJEŽBE (content pack) =====
//
// HR verzija: prevedena su ISKLJUČIVO string-polja (title/prompt/q/options/solution/label/hint)
// + meta.lang. `generate()`, `params`, `answer`, `type`, `tol`, `difficulty` i sva logika su
// NEDIRNUTI — matematika je bit-identična engleskom izvorniku (pravilo S5, TEAM.md §9).
// `stat-lib.js` (normalCdf i ostale funkcije) se NE dira i dijeli se s engleskom verzijom.
// ⚠️ POSLJEDICA: 23 randomizirane vježbe imaju tekst UNUTAR generate() (prompt/label/hint/
// solution koji se sastavljaju iz brojeva) — taj dio OSTAJE NA ENGLESKOM jer generate() se ne dira.
// Naslov, uvodni prompt i statički solution tih vježbi JESU prevedeni.
//
// ===== izvorni engleski zapis slijedi =====
// ===== STATISTICS — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski podaci za interaktivne, auto-ocjenjive vježbe
// statistike. Generički engine (js/exercises-core.js, js/exercises.js, css/exercises.css)
// ne sadrži NIŠTA odavde — vidi docs/architecture/EXERCISES_ENGINE.md §2 (schema/tipovi) + §3 (konvencije)
// i docs/subjects/STATISTICS_PLAN.md (cigla-po-cigla plan, TRACK B).
//
// Tipovi koje koristi statistika: numeric / choice / ratio (NE journal/classify/statement).
// Matematika za rješenja (normalCdf, z/t tablice) doći će u data/statistics/stat-lib.js
// (B1) i učitavat će se PRIJE ove datoteke. Elementarna aritmetika ide inline u solve().
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* je immutable).
//
// B0 (žica): SKELETON — prazna lista. Tab "Exercises" se pojavi (prazno stanje); sadržaj
//            se autorira po temi u FAZI B2 (T1–T9). meta.currency='' (statistika nije novac).

// Pristup stat-lib matematici iz solve()/generate(): u pregledniku je window.StatLib
// (učitan PRIJE ove datoteke preko content.scripts); u nodeu (testovi) require relativno.
var SL = (typeof window !== 'undefined' && window.StatLib) ? window.StatLib
  : (typeof require !== 'undefined' ? require('./stat-lib.js') : null);

const statisticsHrExercises = {
  meta: { lang: 'hr', currency: '', version: 1 },
  exercises: [
    // ============================================================================
    // B2.1 — T1–T2 DESCRIPTIVE STATISTICS (first-midterm)
    //   Data types & graphs (T1) + central tendency / variation (T2).
    //   Concepts (choice) + computation (numeric/ratio) + 4 randomized drills.
    //   Numbers: clean or exact; answers cross-checked by hand. chapter 1 = describing
    //   data (graphical), chapter 2 = describing data (numerical).
    // ============================================================================

    // --- T1–T2 concepts (TF + MC) ---------------------------------------------
    {
      id: 't1-2-concepts',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Opisivanje podataka — Pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Nominalni podaci razvrstavaju se u kategorije bez prirodnog poretka.', kind: 'tf', answer: true },
        { q: 'Broj rezerviranih soba u hotelu diskretna je numerička varijabla.', kind: 'tf', answer: true },
        { q: 'Temperatura u °C mjeri se na intervalnoj ljestvici.', kind: 'tf', answer: false },
        { q: 'Histogram je odgovarajući grafikon za kategorijske podatke.', kind: 'tf', answer: false },
        { q: 'Medijan je otporniji na ekstremne vrijednosti od aritmetičke sredine.', kind: 'tf', answer: true },
        { q: 'Za podatke zvonastog oblika, empirijsko pravilo kaže da oko 95% vrijednosti leži unutar ±2 standardne devijacije.', kind: 'tf', answer: true },
        { q: 'Čebiševljev teorem zahtijeva da podaci budu zvonastog oblika.', kind: 'tf', answer: false },
        { q: 'Koeficijent varijacije je bez mjernih jedinica, pa uspoređuje varijabilnost na različitim ljestvicama.', kind: 'tf', answer: true },
        { q: 'Koja mjera središnje tendencije predstavlja najčešće prisutnu vrijednost?', kind: 'mc', options: ['Aritmetička sredina', 'Medijan', 'Mod', 'Raspon'], answer: 2 },
        { q: 'Ocjena zadovoljstva od 1 (nisko) do 5 (visoko) mjeri se na kojoj ljestvici?', kind: 'mc', options: ['Nominalnoj', 'Ordinalnoj', 'Intervalnoj', 'Omjernoj'], answer: 1 }
      ],
      solution: [
        'Temperatura u °C je intervalna, a ne omjerna ljestvica — 0 °C ne znači „nema temperature", pa omjeri nemaju smisla.',
        'Histogrami su za numeričke podatke; kategorijski podaci koriste stupčaste, kružne ili Paretove grafikone.',
        'Empirijsko pravilo (68–95–99,7) zahtijeva zvonasti oblik; Čebiševljev teorem vrijedi za BILO KOJI oblik.'
      ]
    },

    // --- Central tendency & range (numeric, fixed data) -----------------------
    {
      id: 't2-center-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Aritmetička sredina, medijan, mod i raspon',
      prompt: 'Za uzorak 12, 7, 9, 7, 15 izračunajte aritmetičku sredinu, medijan, mod i raspon.',
      difficulty: 1,
      fields: [
        { key: 'mean', label: 'Aritmetička sredina', answer: 10, tol: 0.01, unit: '', hint: 'Zbroj ÷ n = 50 ÷ 5' },
        { key: 'median', label: 'Medijan', answer: 9, tol: 0.01, unit: '', hint: 'Srednja vrijednost uređenih podataka: 7, 7, 9, 12, 15' },
        { key: 'mode', label: 'Mod', answer: 7, tol: 0.01, unit: '', hint: 'Najčešća vrijednost' },
        { key: 'range', label: 'Raspon', answer: 8, tol: 0.01, unit: '', hint: 'Max − Min = 15 − 7' }
      ],
      solution: [
        'Aritmetička sredina = (12 + 7 + 9 + 7 + 15) ÷ 5 = 50 ÷ 5 = 10.',
        'Uređeno: 7, 7, 9, 12, 15 → medijan = 9 (srednja, 3. vrijednost).',
        'Mod = 7 (pojavljuje se dvaput). Raspon = 15 − 7 = 8.'
      ]
    },

    // --- Variance, SD & CV (numeric, fixed data — the learn worked example) ---
    {
      id: 't2-spread-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Varijanca, standardna devijacija i koeficijent varijacije',
      prompt: 'Za uzorak 5, 9, 10, 2, 7, 9, 14 (aritmetička sredina = 8), izračunaj varijancu uzorka, standardnu'
        + 'deviation and the coefficient of variation (%). Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'var', label: 'Varijanca uzorka s²', answer: 14.6667, tol: 0.05, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = 88 ÷ 6' },
        { key: 'sd', label: 'Standardna devijacija uzorka s', answer: 3.8297, tol: 0.05, unit: '', hint: '√(s²) = √14.67' },
        { key: 'cv', label: 'Koeficijent varijacije', answer: 47.871, tol: 0.05, unit: '%', hint: '(s ÷ x̄) × 100 = (3.83 ÷ 8) × 100' }
      ],
      solution: [
        'Odstupanja od 8: −3, 1, 2, −6, −1, 1, 6 → kvadrati: 9, 1, 4, 36, 1, 1, 36; zbroj = 88.',
        's² = 88 ÷ (7 − 1) = 88 ÷ 6 = 14.67.',
        's = √14.67 = 3.83.   CV = (3.83 ÷ 8) × 100 = 47.87%.'
      ]
    },

    // --- IQR & range from quartiles (ratio, given values) ---------------------
    {
      id: 't2-iqr-1',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'ratio',
      title: 'Interkvartil i raspon',
      prompt: 'Uz pomoć petobrojnog sažetka u nastavku, izračunaj interkvartil (IQR) i raspon.',
      difficulty: 1,
      givens: [
        { label: 'Minimum', value: 12 },
        { label: 'Prvi kvartil Q₁', value: 24 },
        { label: 'Treći kvartil Q₃', value: 39 },
        { label: 'Maksimum', value: 58 }
      ],
      fields: [
        { key: 'iqr', label: 'Interkvartil', answer: 15, tol: 0.01, unit: '', hint: 'Q₃ − Q₁ = 39 − 24' },
        { key: 'range', label: 'Raspon', answer: 46, tol: 0.01, unit: '', hint: 'Max − Min = 58 − 12' }
      ],
      solution: [
        'IQR = Q₃ − Q₁ = 39 − 24 = 15 (raspon srednje 50% podataka).',
        'Raspon = Max − Min = 58 − 12 = 46.'
      ]
    },

    // --- RANDOMIZED: standard deviation of a small sample ---------------------
    {
      id: 't2-sd-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Standardna devijacija — vježba',
      prompt: 'Izračunajte aritmetičku sredinu, varijancu uzorka i standardnu devijaciju uzorka za skup podataka ispod.',
      difficulty: 2,
      params: {
        a: { min: 2, max: 18, step: 1 },
        b: { min: 2, max: 18, step: 1 },
        c: { min: 2, max: 18, step: 1 },
        d: { min: 2, max: 18, step: 1 },
        e: { min: 2, max: 18, step: 1 }
      },
      generate(p) {
        const xs = [p.a, p.b, p.c, p.d, p.e];
        const n = xs.length;
        const mean = xs.reduce((s, x) => s + x, 0) / n;
        const ss = xs.reduce((s, x) => s + (x - mean) * (x - mean), 0);
        const variance = ss / (n - 1);
        const sd = Math.sqrt(variance);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'For the sample ' + xs.join(', ') + ', compute the mean, the sample variance s² and the sample '
            + 'standard deviation s (divide by n − 1). Round to 1 decimal place.',
          fields: [
            { key: 'mean', label: 'Mean x̄', answer: mean, tol: 0.05, unit: '', hint: 'Sum ÷ 5' },
            { key: 'var', label: 'Sample variance s²', answer: variance, tol: 0.05, unit: '', hint: 'Σ(x − x̄)² ÷ (n − 1) = Σ(x − x̄)² ÷ 4' },
            { key: 'sd', label: 'Sample standard deviation s', answer: sd, tol: 0.05, unit: '', hint: '√(s²)' }
          ],
          solution: [
            'Mean = (' + xs.join(' + ') + ') ÷ 5 = ' + r2(mean) + '.',
            'Sum of squared deviations from the mean = ' + r2(ss) + '.',
            's² = ' + r2(ss) + ' ÷ 4 = ' + r2(variance) + ';   s = √' + r2(variance) + ' = ' + r2(sd) + '.'
          ]
        };
      },
      solution: ['Pritisnite "New numbers" za novi uzorak. Aritmetička sredina = Σx ÷ n; s² = Σ(x − x̄)² ÷ (n − 1); s = √(s²).']
    },

    // --- RANDOMIZED: coefficient of variation from mean & SD ------------------
    {
      id: 't2-cv-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Koeficijent varijacije — vježba',
      prompt: 'Izračunajte koeficijent varijacije iz aritmetičke sredine i standardne devijacije ispod.',
      difficulty: 1,
      params: {
        mean: { min: 40, max: 200, step: 5 },
        sd: { min: 4, max: 40, step: 2 }
      },
      generate(p) {
        const cv = (p.sd / p.mean) * 100;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A data set has mean ' + p.mean + ' and standard deviation ' + p.sd + '. Compute the coefficient '
            + 'of variation (%). Round to 1 decimal place.',
          fields: [
            { key: 'cv', label: 'Coefficient of variation', answer: cv, tol: 0.05, unit: '%', hint: '(s ÷ x̄) × 100' }
          ],
          solution: ['CV = (s ÷ x̄) × 100 = (' + p.sd + ' ÷ ' + p.mean + ') × 100 = ' + r2(cv) + '%.']
        };
      },
      solution: ['Pritisnite "New numbers" za nove vrijednosti. KV = (standardna devijacija ÷ aritmetička sredina) × 100, izraženo kao postotak.']
    },

    // --- RANDOMIZED: Chebyshev minimum fraction within k SD -------------------
    {
      id: 't2-chebyshev-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Čebiševljev teorem — vježba',
      prompt: 'Pomoću Čebiševljevog teorema pronađite minimalni postotak podataka unutar k standardnih devijacija.',
      difficulty: 2,
      params: { k: { choices: [2, 3, 4, 5] } },
      generate(p) {
        const pct = (1 - 1 / (p.k * p.k)) * 100;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'By Chebyshev’s theorem, at least what percentage of ANY data set lies within k = ' + p.k
            + ' standard deviations of the mean? Round to 1 decimal place.',
          fields: [
            { key: 'pct', label: 'Minimum percentage within k SD', answer: pct, tol: 0.05, unit: '%', hint: '(1 − 1 ÷ k²) × 100' }
          ],
          solution: ['At least (1 − 1 ÷ k²) × 100 = (1 − 1 ÷ ' + p.k + '²) × 100 = ' + r2(pct) + '%.']
        };
      },
      solution: ['Pritisnite "New numbers" za novi k. Čebišev: najmanje (1 − 1 ÷ k²) podataka leži unutar k SD od aritmetičke sredine (k > 1).']
    },

    // --- RANDOMIZED: class width for a frequency distribution -----------------
    {
      id: 't1-classwidth-random',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'numeric',
      title: 'Širina razreda — vježba',
      prompt: 'Izračunajte širinu razreda za distribuciju frekvencija.',
      difficulty: 1,
      params: {
        minV: { min: 0, max: 40, step: 5 },
        span: { min: 40, max: 120, step: 5 },
        k: { choices: [5, 6, 8] }
      },
      generate(p) {
        const maxV = p.minV + p.span;
        const width = Math.ceil(p.span / p.k);
        return {
          prompt: 'The data range from ' + p.minV + ' to ' + maxV + '. Using ' + p.k + ' classes, compute the class '
            + 'width (round UP to a whole number).',
          fields: [
            { key: 'width', label: 'Class width', answer: width, tol: 0, unit: '', hint: '⌈(Max − Min) ÷ k⌉ = ⌈' + p.span + ' ÷ ' + p.k + '⌉' }
          ],
          solution: ['Width = (Max − Min) ÷ k = (' + maxV + ' − ' + p.minV + ') ÷ ' + p.k + ' = ' + (p.span / p.k).toFixed(2) + ' → round up to ' + width + '.']
        };
      },
      solution: ['Pritisnite "New numbers" za novi raspon. Širina razreda = (Max − Min) ÷ broj razreda, uvijek zaokruženo GORE na cijeli broj.']
    },

    // ============================================================================
    // B2.2 — T3 PROBABILITY METHODS (first-midterm)
    //   Addition rule, complement, conditional probability, independence, combinations.
    //   Probabilities entered as decimals (0–1), rounded to 2 places (tol 0.01);
    //   combination counts are exact integers (tol 0). chapter 3.
    // ============================================================================

    // --- T3 concepts (TF + MC) ------------------------------------------------
    {
      id: 't3-concepts',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'choice',
      title: 'Vjerojatnost — pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, a zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Prostor uzoraka je skup SVIH mogućih ishoda slučajnog pokusa.', kind: 'tf', answer: true },
        { q: 'Ako su dva događaja međusobno isključiva, tada je P(A i B) = 0.', kind: 'tf', answer: true },
        { q: 'Međusobno isključivi događaji uvijek su nezavisni.', kind: 'tf', answer: false },
        { q: 'Za svaki događaj A vrijedi P(A) + P(ne A) = 1.', kind: 'tf', answer: true },
        { q: 'Ako su A i B nezavisni, tada je P(A i B) = P(A) × P(B).', kind: 'tf', answer: true },
        { q: 'Vjerojatnost može biti veća od 1 kada je neki događaj vrlo vjerojatan.', kind: 'tf', answer: false },
        { q: 'Vjerojatnost da se dogodi BAREM JEDAN od dva događaja izračunava se pomoću:', kind: 'mc', options: ['Pravila množenja', 'Pravila zbrajanja', 'Samo komplementa', 'Nezavisnosti'], answer: 1 },
        { q: 'Odabir 3 osobe od 10 gdje redoslijed NIJE važan broji se pomoću:', kind: 'mc', options: ['Permutacija', 'Kombinacija', 'Pravila zbrajanja', 'Komplementa'], answer: 1 },
        { q: 'Ako je P(A | B) = P(A), tada su događaji A i B:', kind: 'mc', options: ['Međusobno isključivi', 'Nezavisni', 'Komplementarni', 'Skupno iscrpni'], answer: 1 }
      ],
      solution: [
        'Međusobno isključivi ≠ nezavisni: isključivi događaji ne mogu se oba dogoditi, pa su visoko zavisni.',
        'P(A ili B) koristi pravilo zbrajanja P(A) + P(B) − P(A i B); nezavisnost znači P(A | B) = P(A).'
      ]
    },

    // --- Addition rule, complement, conditional (numeric, fixed) --------------
    {
      id: 't3-addition-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Pravilo zbrajanja, komplement i uvjetna vjerojatnost',
      prompt: 'U trgovini, P(traži pomoć) = 0.30, P(obavlja kupnju) = 0.20, i P(oboje) = 0.15. Izračunaj'
        + 'following probabilities as decimals, rounded to 2 places.',
      difficulty: 2,
      fields: [
        { key: 'union', label: 'P(traži pomoć ILI obavlja kupnju)', answer: 0.35, tol: 0.01, unit: '', hint: 'P(A) + P(B) − P(A i B) = 0.30 + 0.20 − 0.15' },
        { key: 'notHelp', label: 'P(NE traži pomoć)', answer: 0.70, tol: 0.01, unit: '', hint: 'Komplement: 1 − P(A)' },
        { key: 'purchGivenHelp', label: 'P(kupnja | tražio pomoć)', answer: 0.50, tol: 0.01, unit: '', hint: 'P(A i B) ÷ P(A) = 0.15 ÷ 0.30' }
      ],
      solution: [
        'P(A ili B) = 0.30 + 0.20 − 0.15 = 0.35.',
        'P(ne A) = 1 − 0.30 = 0.70.',
        'P(B | A) = P(A i B) ÷ P(A) = 0.15 ÷ 0.30 = 0.50.',
        'Provjera nezavisnosti: P(A)·P(B) = 0.30 × 0.20 = 0.06 ≠ 0.15, dakle događaji NISU nezavisni.'
      ]
    },

    // --- Combinations (numeric, fixed) ----------------------------------------
    {
      id: 't3-combinations-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Brojanje kombinacijama',
      prompt: 'Izračunaj broj neuređenih načina odabira elemenata. Koristi C(n, k) = n! ÷ [k!(n − k)!].',
      difficulty: 2,
      fields: [
        { key: 'c103', label: 'C(10, 3)', answer: 120, tol: 0, unit: '', hint: '(10 × 9 × 8) ÷ (3 × 2 × 1)' },
        { key: 'c62', label: 'C(6, 2)', answer: 15, tol: 0, unit: '', hint: '(6 × 5) ÷ (2 × 1)' },
        { key: 'c80', label: 'C(8, 0)', answer: 1, tol: 0, unit: '', hint: 'Odabir nijednog: točno 1 način (0! = 1)' }
      ],
      solution: [
        'C(10, 3) = (10 × 9 × 8) ÷ (3 × 2 × 1) = 720 ÷ 6 = 120.',
        'C(6, 2) = (6 × 5) ÷ (2 × 1) = 30 ÷ 2 = 15.',
        'C(8, 0) = 1 (postoji točno jedan način odabira ničega).'
      ]
    },

    // --- Contingency table → marginal/joint/conditional (ratio, fixed) --------
    {
      id: 't3-crosstable-1',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'ratio',
      title: 'Vjerojatnosti iz kontingencijske tablice',
      prompt: 'Anketa o 100 gostiju razvrstava ih prema tome jesu li Članovi (A) i jesu li Rezervirali online (B),'
        + 'as shown. Compute the probabilities as decimals, rounded to 2 places.',
      difficulty: 2,
      givens: [
        { label: 'Član & Rezervirao online', value: 30 },
        { label: 'Član & NIJE rezervirao online', value: 10 },
        { label: 'Nečlan & Rezervirao online', value: 20 },
        { label: 'Nečlan & NIJE rezervirao online', value: 40 },
        { label: 'Ukupno gostiju', value: 100 }
      ],
      fields: [
        { key: 'pA', label: 'P(Član)', answer: 0.40, tol: 0.01, unit: '', hint: '(30 + 10) ÷ 100' },
        { key: 'pAandB', label: 'P(Član I Rezervirao online)', answer: 0.30, tol: 0.01, unit: '', hint: '30 ÷ 100' },
        { key: 'pAgivenB', label: 'P(Član | Rezervirao online)', answer: 0.60, tol: 0.01, unit: '', hint: '30 ÷ (30 + 20) = 30 ÷ 50' }
      ],
      solution: [
        'P(Član) = (30 + 10) ÷ 100 = 0.40.',
        'P(Član i Rezervirao) = 30 ÷ 100 = 0.30.',
        'P(Član | Rezervirao) = 30 ÷ 50 = 0.60 (ograničeno na 50 koji su rezervirali online).'
      ]
    },

    // --- RANDOMIZED: addition rule + conditional ------------------------------
    {
      id: 't3-addition-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Pravilo zbrajanja — Vježba',
      prompt: 'Izračunajte P(A ili B) i P(A | B) iz vjerojatnosti navedenih ispod.',
      difficulty: 2,
      params: {
        a: { choices: [20, 30, 40, 50] },
        b: { choices: [20, 30, 40, 50] },
        ov: { choices: [5, 10, 15] }
      },
      generate(p) {
        const pAB = Math.min(p.ov, p.a, p.b); // overlap ≤ each marginal (always = ov here)
        const union = (p.a + p.b - pAB) / 100;
        const aGivenB = pAB / p.b;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'For two events, P(A) = ' + (p.a / 100).toFixed(2) + ', P(B) = ' + (p.b / 100).toFixed(2)
            + ', and P(A and B) = ' + (pAB / 100).toFixed(2) + '. Compute P(A or B) and P(A | B) as decimals, '
            + 'rounded to 2 places.',
          fields: [
            { key: 'union', label: 'P(A or B)', answer: union, tol: 0.01, unit: '', hint: 'P(A) + P(B) − P(A and B)' },
            { key: 'aGivenB', label: 'P(A | B)', answer: aGivenB, tol: 0.01, unit: '', hint: 'P(A and B) ÷ P(B)' }
          ],
          solution: [
            'P(A or B) = ' + (p.a / 100).toFixed(2) + ' + ' + (p.b / 100).toFixed(2) + ' − ' + (pAB / 100).toFixed(2) + ' = ' + r2(union) + '.',
            'P(A | B) = P(A and B) ÷ P(B) = ' + (pAB / 100).toFixed(2) + ' ÷ ' + (p.b / 100).toFixed(2) + ' = ' + r2(aGivenB) + '.'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vjerojatnosti. P(A ili B) = P(A) + P(B) − P(A i B); P(A | B) = P(A i B) ÷ P(B).']
    },

    // --- RANDOMIZED: combinations ---------------------------------------------
    {
      id: 't3-combinations-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Kombinacije — Vježba',
      prompt: 'Izračunajte kombinaciju navedenu ispod.',
      difficulty: 2,
      params: {
        n: { choices: [5, 6, 7, 8, 9, 10] },
        k: { choices: [2, 3] }
      },
      generate(p) {
        const c = SL ? SL.combinations(p.n, p.k) : 0;
        return {
          prompt: 'In how many unordered ways can you choose ' + p.k + ' items from ' + p.n + '? Compute C(' + p.n + ', ' + p.k + ').',
          fields: [
            { key: 'c', label: 'C(' + p.n + ', ' + p.k + ')', answer: c, tol: 0, unit: '', hint: 'n! ÷ [k!(n − k)!]' }
          ],
          solution: ['C(' + p.n + ', ' + p.k + ') = ' + p.n + '! ÷ [' + p.k + '!(' + p.n + ' − ' + p.k + ')!] = ' + c + '.']
        };
      },
      solution: ['Pritisnite „Novi brojevi" za novu kombinaciju. C(n, k) = n! ÷ [k!(n − k)!] broji neuređene odabire.']
    },

    // ============================================================================
    // B2.3 — T4 DISCRETE RANDOM VARIABLES (first-midterm)
    //   Expected value & variance of a distribution; binomial P(x), μ=nP, σ²=nP(1−P);
    //   Poisson P(x)=e^(−λ)λ^x/x!, μ=σ²=λ. Probabilities → 2 dp (tol 0.01); E(X)/μ/σ²/σ
    //   are descriptive numbers → 1 dp (tol 0.05). Binomial reuses SL.combinations;
    //   Poisson uses Math.exp + a tiny inline factorial (elementary → inline). chapter 4.
    // ============================================================================

    // --- T4 concepts (TF + MC) ------------------------------------------------
    {
      id: 't4-concepts',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'Diskretne slučajne varijable — Pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, a zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Diskretna slučajna varijabla može poprimiti samo prebrojiv broj vrijednosti.', kind: 'tf', answer: true },
        { q: 'Za diskretnu distribuciju vjerojatnosti, vjerojatnosti P(x) moraju se zbrajati u 1.', kind: 'tf', answer: true },
        { q: 'Očekivana vrijednost E(X) uvijek je jedna od mogućih vrijednosti od X.', kind: 'tf', answer: false },
        { q: 'U binomnom eksperimentu, vjerojatnost uspjeha P ostaje konstantna u svim pokušajima.', kind: 'tf', answer: true },
        { q: 'Binomna distribucija zahtijeva da pokušaji budu zavisni.', kind: 'tf', answer: false },
        { q: 'Za Poissonovu distribuciju, aritmetička sredina i varijanca su jednake.', kind: 'tf', answer: true },
        { q: 'Varijanca binomne distribucije iznosi nP.', kind: 'tf', answer: false },
        { q: 'Aritmetička sredina binomne distribucije iznosi:', kind: 'mc', options: ['nP(1 − P)', 'nP', 'λ', 'P / n'], answer: 1 },
        { q: 'Broj dolazaka na recepciju hotela po satu najbolje se modelira:', kind: 'mc', options: ['Binomnom distribucijom', 'Poissonovom distribucijom', 'Normalnom distribucijom', 'Uniformnom distribucijom'], answer: 1 },
        { q: 'Očekivana vrijednost od X računa se kao:', kind: 'mc', options: ['Σ x', 'Σ P(x)', 'Σ x·P(x)', '√λ'], answer: 2 }
      ],
      solution: [
        'E(X) je vjerojatnosno ponderiran prosjek, pa NE mora biti jednaka nijednoj pojedinoj mogućoj vrijednosti (npr. prosječno 1,7 djece).',
        'Binomna: fiksan n, dva ishoda, KONSTANTAN P, NEZAVISNI pokusi; njezina varijanca je nP(1 − P), a ne nP.',
        'Poissonova distribucija modelira broj događaja u fiksnom intervalu i vrijedi μ = σ² = λ.'
      ]
    },

    // --- Expected value, variance & SD from a distribution table (numeric) ----
    {
      id: 't4-expected-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Očekivana vrijednost, varijanca i standardna devijacija',
      prompt: 'Hotel bilježi broj prodanih apartmana po danu, X, s distribucijom'
        + 'P(0) = 0.10, P(1) = 0.30, P(2) = 0.40, P(3) = 0.20. Compute E(X), the variance σ² and the standard '
        + 'deviation σ. Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'ex', label: 'Očekivana vrijednost E(X)', answer: 1.7, tol: 0.05, unit: '', hint: 'Σ x·P(x) = 0(0,10) + 1(0,30) + 2(0,40) + 3(0,20)' },
        { key: 'var', label: 'Varijanca σ²', answer: 0.81, tol: 0.05, unit: '', hint: 'Σ (x − μ)²·P(x), uz μ = 1,7' },
        { key: 'sd', label: 'Standardna devijacija σ', answer: 0.9, tol: 0.05, unit: '', hint: '√(σ²)' }
      ],
      solution: [
        'E(X) = 0(0,10) + 1(0,30) + 2(0,40) + 3(0,20) = 0 + 0,30 + 0,80 + 0,60 = 1,7.',
        'σ² = (0−1,7)²(0,10) + (1−1,7)²(0,30) + (2−1,7)²(0,40) + (3−1,7)²(0,20) = 0,289 + 0,147 + 0,036 + 0,338 = 0,81.',
        'σ = √0,81 = 0,9.'
      ]
    },

    // --- Binomial: P(x), mean, variance (numeric, fixed) ----------------------
    {
      id: 't4-binomial-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Binomna distribucija',
      prompt: 'Svaki gost otkazuje s vjerojatnošću P = 0.30, neovisno. Za n = 6 gostiju, neka je X broj'
        + 'cancellations. Compute P(X = 2) (2 decimals), the mean μ and the variance σ² (1 decimal).',
      difficulty: 2,
      fields: [
        { key: 'p2', label: 'P(X = 2)', answer: 0.324135, tol: 0.01, unit: '', hint: 'C(6,2)·0.30²·0.70⁴ = 15 · 0.09 · 0.2401' },
        { key: 'mean', label: 'Aritmetička sredina μ', answer: 1.8, tol: 0.05, unit: '', hint: 'μ = nP = 6 × 0.30' },
        { key: 'var', label: 'Varijanca σ²', answer: 1.26, tol: 0.05, unit: '', hint: 'σ² = nP(1 − P) = 6 × 0.30 × 0.70' }
      ],
      solution: [
        'P(X = 2) = C(6, 2)·0.30²·0.70⁴ = 15 × 0.09 × 0.2401 = 0.3241 ≈ 0.32.',
        'μ = nP = 6 × 0.30 = 1.8.',
        'σ² = nP(1 − P) = 6 × 0.30 × 0.70 = 1.26 ≈ 1.3.'
      ]
    },

    // --- Poisson: P(x) and SD (numeric, fixed) --------------------------------
    {
      id: 't4-poisson-1',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Poissonova distribucija',
      prompt: 'Pozivi pristižu na recepciju prosječnom stopom λ = 2 po minuti (Poisson). Izračunajte P(X = 0) i'
        + 'P(X = 1) as decimals (2 places), and the standard deviation σ (1 decimal). Use e ≈ 2.71828.',
      difficulty: 2,
      fields: [
        { key: 'p0', label: 'P(X = 0)', answer: Math.exp(-2), tol: 0.01, unit: '', hint: 'e^(−2)·2⁰ ÷ 0! = e^(−2)' },
        { key: 'p1', label: 'P(X = 1)', answer: 2 * Math.exp(-2), tol: 0.01, unit: '', hint: 'e^(−2)·2¹ ÷ 1! = 2·e^(−2)' },
        { key: 'sd', label: 'Standardna devijacija σ', answer: Math.sqrt(2), tol: 0.05, unit: '', hint: 'σ = √λ = √2' }
      ],
      solution: [
        'P(X = 0) = e^(−2)·2⁰ ÷ 0! = e^(−2) = 0.1353 ≈ 0.14.',
        'P(X = 1) = e^(−2)·2¹ ÷ 1! = 2 × 0.1353 = 0.2707 ≈ 0.27.',
        'Za Poissonovu distribuciju, σ² = λ = 2, pa je σ = √2 = 1.41 ≈ 1.4.'
      ]
    },

    // --- RANDOMIZED: expected value & variance of a 3-value distribution ------
    {
      id: 't4-expected-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Očekivana vrijednost — vježba',
      prompt: 'Izračunajte očekivanu vrijednost, varijancu i standardnu devijaciju dane distribucije.',
      difficulty: 2,
      params: {
        a: { choices: [0, 1, 2] },
        b: { choices: [3, 4, 5] },
        c: { choices: [6, 7, 8] }
      },
      generate(p) {
        const xs = [p.a, p.b, p.c];
        const ps = [0.2, 0.5, 0.3];
        const mean = xs.reduce((s, x, i) => s + x * ps[i], 0);
        const variance = xs.reduce((s, x, i) => s + (x - mean) * (x - mean) * ps[i], 0);
        const sd = Math.sqrt(variance);
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'A discrete random variable X has P(' + p.a + ') = 0.2, P(' + p.b + ') = 0.5, P(' + p.c + ') = 0.3. '
            + 'Compute E(X), the variance σ² and the standard deviation σ. Round to 1 decimal place.',
          fields: [
            { key: 'ex', label: 'Expected value E(X)', answer: mean, tol: 0.05, unit: '', hint: 'Σ x·P(x)' },
            { key: 'var', label: 'Variance σ²', answer: variance, tol: 0.05, unit: '', hint: 'Σ (x − μ)²·P(x)' },
            { key: 'sd', label: 'Standard deviation σ', answer: sd, tol: 0.05, unit: '', hint: '√(σ²)' }
          ],
          solution: [
            'E(X) = ' + p.a + '(0.2) + ' + p.b + '(0.5) + ' + p.c + '(0.3) = ' + r2(mean) + '.',
            'σ² = Σ (x − μ)²·P(x) = ' + r2(variance) + ';   σ = √' + r2(variance) + ' = ' + r2(sd) + '.'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za novu distribuciju. E(X) = Σ x·P(x); σ² = Σ (x − μ)²·P(x); σ = √(σ²).']
    },

    // --- RANDOMIZED: binomial P(x), mean, variance ----------------------------
    {
      id: 't4-binomial-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Binomna distribucija — vježba',
      prompt: 'Izračunajte binomnu vjerojatnost zajedno s aritmetičkom sredinom i varijancom.',
      difficulty: 3,
      params: {
        n: { choices: [5, 6, 7, 8] },
        Pp: { choices: [20, 30, 40, 50] }, // success probability in % (kept integer for clean prompts)
        x: { choices: [1, 2, 3] }
      },
      generate(p) {
        const P = p.Pp / 100;
        const n = p.n, x = p.x;
        const cnx = SL ? SL.combinations(n, x) : 0;
        const prob = cnx * Math.pow(P, x) * Math.pow(1 - P, n - x);
        const mean = n * P;
        const variance = n * P * (1 - P);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'In a binomial experiment with n = ' + n + ' trials and success probability P = ' + P.toFixed(2)
            + ', compute P(X = ' + x + ') (2 decimals), the mean μ and the variance σ² (1 decimal).',
          fields: [
            { key: 'px', label: 'P(X = ' + x + ')', answer: prob, tol: 0.01, unit: '', hint: 'C(' + n + ',' + x + ')·P^' + x + '·(1−P)^' + (n - x) },
            { key: 'mean', label: 'Mean μ', answer: mean, tol: 0.05, unit: '', hint: 'μ = nP' },
            { key: 'var', label: 'Variance σ²', answer: variance, tol: 0.05, unit: '', hint: 'σ² = nP(1 − P)' }
          ],
          solution: [
            'P(X = ' + x + ') = C(' + n + ', ' + x + ')·' + P.toFixed(2) + '^' + x + '·' + (1 - P).toFixed(2) + '^' + (n - x) + ' = ' + cnx + ' × ' + r2(Math.pow(P, x)) + ' × ' + r2(Math.pow(1 - P, n - x)) + ' = ' + r2(prob) + '.',
            'μ = nP = ' + n + ' × ' + P.toFixed(2) + ' = ' + r2(mean) + ';   σ² = nP(1 − P) = ' + r2(variance) + '.'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. P(x) = C(n, x)·Pˣ·(1 − P)ⁿ⁻ˣ;   μ = nP;   σ² = nP(1 − P).']
    },

    // --- RANDOMIZED: Poisson P(x) and SD --------------------------------------
    {
      id: 't4-poisson-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Poissonova distribucija — vježba',
      prompt: 'Izračunajte Poissonovu vjerojatnost i standardnu devijaciju.',
      difficulty: 3,
      params: {
        lam: { choices: [1, 2, 3, 4] },
        x: { choices: [0, 1, 2] }
      },
      generate(p) {
        const lam = p.lam, x = p.x;
        let fact = 1;
        for (let i = 2; i <= x; i++) fact *= i; // x ≤ 2 → 0!=1!=1, 2!=2
        const prob = Math.exp(-lam) * Math.pow(lam, x) / fact;
        const sd = Math.sqrt(lam);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Events occur at an average rate of λ = ' + lam + ' (Poisson). Compute P(X = ' + x + ') as a decimal '
            + '(2 places) and the standard deviation σ (1 decimal). Use e ≈ 2.71828.',
          fields: [
            { key: 'px', label: 'P(X = ' + x + ')', answer: prob, tol: 0.01, unit: '', hint: 'e^(−λ)·λ^' + x + ' ÷ ' + x + '!' },
            { key: 'sd', label: 'Standard deviation σ', answer: sd, tol: 0.05, unit: '', hint: 'σ = √λ' }
          ],
          solution: [
            'P(X = ' + x + ') = e^(−' + lam + ')·' + lam + '^' + x + ' ÷ ' + x + '! = ' + r2(prob) + '.',
            'σ = √λ = √' + lam + ' = ' + r2(sd) + ' (Poisson: μ = σ² = λ).'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. P(x) = e^(−λ)·λˣ ÷ x!;   za Poissonovu distribuciju μ = σ² = λ, pa je σ = √λ.']
    },

    // ============================================================================
    // B2.4 — T5 CONTINUOUS RANDOM VARIABLES / NORMAL (first-midterm)
    //   Standardizing z = (x − μ)/σ; normal probabilities via the z-table
    //   (SL.normalCdf / normalSf / normalBetween); inverse "find x" via SL.zUpper.
    //   Probabilities & z-scores → 2 dp (tol 0.01); the inverse value x is in the
    //   variable's units → 1 dp (tol 0.05). z-values kept clean (±0.5/1/1.5/2) so a
    //   z-table lookup works. chapter 5.
    // ============================================================================

    // --- T5 concepts (TF + MC) ------------------------------------------------
    {
      id: 't5-concepts',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'Kontinuirane varijable i normalna distribucija — Pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Za kontinuiranu slučajnu varijablu, vjerojatnost bilo koje pojedine točne vrijednosti iznosi 0.', kind: 'tf', answer: true },
        { q: 'Vjerojatnost za kontinuiranu varijablu je POVRŠINA ispod krivulje gustoće.', kind: 'tf', answer: true },
        { q: 'Ukupna površina ispod funkcije gustoće vjerojatnosti iznosi 1.', kind: 'tf', answer: true },
        { q: 'U normalnoj distribuciji aritmetička sredina, medijan i mod su jednaki.', kind: 'tf', answer: true },
        { q: 'Standardna normalna distribucija ima aritmetičku sredinu 0 i standardnu devijaciju 1.', kind: 'tf', answer: true },
        { q: 'Negativna z-vrijednost znači da je vrijednost iznad aritmetičke sredine.', kind: 'tf', answer: false },
        { q: 'Prema empirijskom pravilu, oko 95% vrijednosti leži unutar ±1 standardne devijacije od aritmetičke sredine.', kind: 'tf', answer: false },
        { q: 'z-vrijednost od x računa se kao:', kind: 'mc', options: ['xμ', '(x − μ)/σ', 'σ/μ', 'x − σ'], answer: 1 },
        { q: 'Ako tablica z-vrijednosti daje P(Z < z), tada P(Z > z) iznosi:', kind: 'mc', options: ['P(Z < z)', '1 − P(Z < z)', '2·P(Z < z)', 'z'], answer: 1 },
        { q: 'Za X ~ N(80, 100) (varijanca 100), standardna devijacija iznosi:', kind: 'mc', options: ['100', '10', '80', '1'], answer: 1 }
      ],
      solution: [
        'Negativna z-vrijednost znači ISPOD aritmetičke sredine; empirijsko pravilo glasi: 68% unutar ±1σ, 95% unutar ±2σ, 99,7% unutar ±3σ.',
        'Standardizacija se provodi pomoću z = (x − μ)/σ; tablica daje lijevu rep-vjerojatnost P(Z < z), pa je desna rep-vjerojatnost njezin komplement.',
        'Varijanca 100 → σ = √100 = 10.'
      ]
    },

    // --- z-score and tail probabilities (numeric, fixed) ----------------------
    {
      id: 't5-zscore-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Standardizacija i vjerojatnosti repova',
      prompt: 'Potrošnja gostiju normalno je distribuirana s aritmetičkom sredinom μ = 70 i standardnom devijacijom σ = 10. Za X = 85,'
        + 'compute the z-score, P(X < 85) and P(X > 85). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'z', label: 'z-vrijednost', answer: 1.5, tol: 0.01, unit: '', hint: 'z = (85 − 70) ÷ 10' },
        { key: 'pLess', label: 'P(X < 85)', answer: SL.normalCdf(1.5), tol: 0.01, unit: '', hint: 'P(Z < 1.5) iz z-tablice ≈ 0.9332' },
        { key: 'pMore', label: 'P(X > 85)', answer: SL.normalSf(1.5), tol: 0.01, unit: '', hint: '1 − P(Z < 1.5)' }
      ],
      solution: [
        'z = (85 − 70) ÷ 10 = 1.5.',
        'P(X < 85) = P(Z < 1.5) = 0.9332 ≈ 0.93.',
        'P(X > 85) = 1 − 0.9332 = 0.0668 ≈ 0.07.'
      ]
    },

    // --- Probability between two values (numeric, fixed) ----------------------
    {
      id: 't5-between-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Vjerojatnost između dvije vrijednosti',
      prompt: 'Neki proces ima izlaz X ~ N(μ = 500, σ = 100). Izračunajte P(400 < X < 650) pomoću z-tablice.'
        + 'Give probabilities to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'zLow', label: 'z za 400', answer: -1.0, tol: 0.01, unit: '', hint: '(400 − 500) ÷ 100' },
        { key: 'zHigh', label: 'z za 650', answer: 1.5, tol: 0.01, unit: '', hint: '(650 − 500) ÷ 100' },
        { key: 'prob', label: 'P(400 < X < 650)', answer: SL.normalBetween(-1.0, 1.5), tol: 0.01, unit: '', hint: 'P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587' }
      ],
      solution: [
        'z₁ = (400 − 500) ÷ 100 = −1.0;   z₂ = (650 − 500) ÷ 100 = 1.5.',
        'P(400 < X < 650) = P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587 = 0.7745 ≈ 0.77.'
      ]
    },

    // --- Empirical rule bounds (numeric, fixed) -------------------------------
    {
      id: 't5-empirical-1',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Empirijsko pravilo (68–95–99,7)',
      prompt: 'Rezultati IQ-testa normalno su distribuirani s μ = 100 i σ = 15. Primjenom empirijskog pravila pronađite interval μ ± 2σ i'
        + 'approximate percentage of values inside it.',
      difficulty: 1,
      fields: [
        { key: 'lower', label: 'Donja granica (μ − 2σ)', answer: 70, tol: 0, unit: '', hint: '100 − 2 × 15' },
        { key: 'upper', label: 'Gornja granica (μ + 2σ)', answer: 130, tol: 0, unit: '', hint: '100 + 2 × 15' },
        { key: 'pct', label: 'Približni % unutar μ ± 2σ', answer: 95, tol: 0, unit: '%', hint: 'Empirijsko pravilo: ≈ 95% unutar ±2 standardne devijacije' }
      ],
      solution: [
        'μ − 2σ = 100 − 30 = 70;   μ + 2σ = 100 + 30 = 130.',
        'Prema empirijskom pravilu, oko 95% vrijednosti nalazi se unutar ±2 standardne devijacije od aritmetičke sredine.'
      ]
    },

    // --- RANDOMIZED: z-score + tail probabilities -----------------------------
    {
      id: 't5-zscore-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Standardizacija — vježba',
      prompt: 'Standardizirajte vrijednost i pronađite vjerojatnosti u oba repa distribucije.',
      difficulty: 2,
      params: {
        mu: { choices: [50, 60, 80, 100] },
        sigma: { choices: [10, 20] },
        zc: { choices: [-1.5, -1, 0.5, 1, 1.5, 2] }
      },
      generate(p) {
        const x = p.mu + p.zc * p.sigma; // chosen so z is exactly zc (clean for the table)
        const pLess = SL ? SL.normalCdf(p.zc) : 0;
        const pMore = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A variable is X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '). For X = ' + x + ', compute the z-score, '
            + 'P(X < ' + x + ') and P(X > ' + x + '). Use a z-table; give probabilities to 2 decimals.',
          fields: [
            { key: 'z', label: 'z-score', answer: p.zc, tol: 0.01, unit: '', hint: 'z = (x − μ) ÷ σ = (' + x + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'pLess', label: 'P(X < ' + x + ')', answer: pLess, tol: 0.01, unit: '', hint: 'P(Z < ' + p.zc + ') from the z-table' },
            { key: 'pMore', label: 'P(X > ' + x + ')', answer: pMore, tol: 0.01, unit: '', hint: '1 − P(Z < ' + p.zc + ')' }
          ],
          solution: [
            'z = (' + x + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.zc + '.',
            'P(X < ' + x + ') = P(Z < ' + p.zc + ') = ' + r2(pLess) + ';   P(X > ' + x + ') = 1 − ' + r2(pLess) + ' = ' + r2(pMore) + '.'
          ]
        };
      },
      solution: ['Pritisnite "New numbers" za nove vrijednosti. z = (x − μ) ÷ σ; z-tablica daje P(Z < z); gornji rep je 1 − P(Z < z).']
    },

    // --- RANDOMIZED: probability between two values ---------------------------
    {
      id: 't5-between-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Vjerojatnost između — Vježba',
      prompt: 'Pronađite vjerojatnost da X pada između dviju zadanih vrijednosti.',
      difficulty: 3,
      params: {
        mu: { choices: [50, 60, 80, 100] },
        sigma: { choices: [10, 20] },
        z1: { choices: [-2, -1.5, -1] },
        z2: { choices: [0.5, 1, 1.5, 2] }
      },
      generate(p) {
        const a = p.mu + p.z1 * p.sigma;
        const b = p.mu + p.z2 * p.sigma;
        const prob = SL ? SL.normalBetween(p.z1, p.z2) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'For X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '), compute the z-scores of ' + a + ' and ' + b
            + ', then P(' + a + ' < X < ' + b + '). Use a z-table; give probabilities to 2 decimals.',
          fields: [
            { key: 'zLow', label: 'z for ' + a, answer: p.z1, tol: 0.01, unit: '', hint: '(' + a + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'zHigh', label: 'z for ' + b, answer: p.z2, tol: 0.01, unit: '', hint: '(' + b + ' − ' + p.mu + ') ÷ ' + p.sigma },
            { key: 'prob', label: 'P(' + a + ' < X < ' + b + ')', answer: prob, tol: 0.01, unit: '', hint: 'P(Z < ' + p.z2 + ') − P(Z < ' + p.z1 + ')' }
          ],
          solution: [
            'z₁ = (' + a + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.z1 + ';   z₂ = (' + b + ' − ' + p.mu + ') ÷ ' + p.sigma + ' = ' + p.z2 + '.',
            'P(' + a + ' < X < ' + b + ') = P(Z < ' + p.z2 + ') − P(Z < ' + p.z1 + ') = ' + r2(prob) + '.'
          ]
        };
      },
      solution: ['Pritisnite "New numbers" za nove vrijednosti. Standardizirajte oba kraja, zatim P(a < X < b) = P(Z < z₂) − P(Z < z₁).']
    },

    // --- RANDOMIZED: inverse — find x for a given upper-tail area --------------
    {
      id: 't5-inverse-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Inverzna normalna distribucija — Vježba',
      prompt: 'Pronađite vrijednost x iznad koje leži zadani udio distribucije.',
      difficulty: 3,
      params: {
        mu: { choices: [400, 500, 600] },
        sigma: { choices: [10, 15, 20] },
        alpha: { choices: [0.10, 0.05, 0.025, 0.01] }
      },
      generate(p) {
        const z = SL ? SL.zUpper(p.alpha) : 0;
        const x = p.mu + z * p.sigma;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Scores are X ~ N(μ = ' + p.mu + ', σ = ' + p.sigma + '). Find the score c such that '
            + 'P(X > c) = ' + p.alpha.toFixed(3) + '. Use the upper-tail critical value z = ' + z + '. Round to 1 decimal place.',
          fields: [
            { key: 'c', label: 'Score c', answer: x, tol: 0.05, unit: '', hint: 'c = μ + z·σ = ' + p.mu + ' + ' + z + ' × ' + p.sigma }
          ],
          solution: ['c = μ + z·σ = ' + p.mu + ' + ' + z + ' × ' + p.sigma + ' = ' + r2(x) + ' (' + (p.alpha * 100) + '% of scores exceed it).']
        };
      },
      solution: ['Pritisnite "New numbers" za nove vrijednosti. Za pronalazak granične vrijednosti za površinu gornjeg repa α: c = μ + z_α·σ, gdje je z_α kritična z-vrijednost.']
    },

    // ============================================================================
    // B2.5 — T6 SAMPLING DISTRIBUTIONS (first-midterm)
    //   Standard error of the mean σ_x̄ = σ/√n; z for x̄ = (x̄ − μ)/(σ/√n); standard
    //   error of a proportion σ_p̂ = √(P(1−P)/n); z for p̂ = (p̂ − P)/σ_p̂. Probabilities
    //   via SL.normalCdf/normalSf (engine untouched). Numbers chosen so SE is clean
    //   (n = perfect square; P ∈ {0.2, 0.5}) → z is exact, no rounding ambiguity.
    //   Probabilities & z → 2 dp (tol 0.01); SE → descriptive, 2 dp (tol 0.05). chapter 6.
    // ============================================================================

    // --- T6 concepts (TF + MC) ------------------------------------------------
    {
      id: 't6-concepts',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Distribucije uzorka — Pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Standardna pogreška aritmetičke sredine jednaka je σ ÷ √n.', kind: 'tf', answer: true },
        { q: 'Kako se veličina uzorka povećava, standardna pogreška aritmetičke sredine se smanjuje.', kind: 'tf', answer: true },
        { q: 'Centralni granični teorem zahtijeva da sama populacija bude normalno distribuirana.', kind: 'tf', answer: false },
        { q: 'Aritmetička sredina distribucije uzorka od x̄ jednaka je aritmetičkoj sredini populacije μ.', kind: 'tf', answer: true },
        { q: 'Standardna pogreška proporcije uzorka je √[P(1 − P) ÷ n].', kind: 'tf', answer: true },
        { q: 'Za normalnu populaciju, x̄ je normalno distribuiran za bilo koju veličinu uzorka n.', kind: 'tf', answer: true },
        { q: 'Distribucija uzorka od x̄ postaje ŠIRA kako n raste.', kind: 'tf', answer: false },
        { q: 'Koja se veličina koristi u nazivniku z-vrijednosti za aritmetičku sredinu uzorka?', kind: 'mc', options: ['σ', 'σ ÷ √n', 'n', 's²'], answer: 1 },
        { q: 'Uobičajeno pravilo palca za primjenu CLT-a jest:', kind: 'mc', options: ['n > 5', 'n > 25 (često n ≥ 30)', 'n > 500', 'n = 1'], answer: 1 },
        { q: 'Očekivana vrijednost proporcije uzorka p̂ je:', kind: 'mc', options: ['P', '0', 'n', '1 − P'], answer: 0 }
      ],
      solution: [
        'CLT čini x̄ približno normalnom za veliko n čak i ako POPULACIJA nije normalna.',
        'Veći n smanjuje standardnu pogrešku σ/√n, pa distribucija uzorka postaje UŽA (preciznija).',
        'E(p̂) = P; standardiziraj x̄ s σ/√n u nazivniku.'
      ]
    },

    // --- Standard error of the mean (numeric, fixed) --------------------------
    {
      id: 't6-se-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Standardna pogreška aritmetičke sredine',
      prompt: 'Populacija ima standardnu devijaciju σ = 20. Uzet je slučajni uzorak od n = 25. Izračunaj standardnu'
        + 'error of the sample mean. Round to 2 decimals.',
      difficulty: 1,
      fields: [
        { key: 'se', label: 'Standardna pogreška σ_x̄', answer: 4, tol: 0.05, unit: '', hint: 'σ ÷ √n = 20 ÷ √25 = 20 ÷ 5' }
      ],
      solution: ['σ_x̄ = σ ÷ √n = 20 ÷ √25 = 20 ÷ 5 = 4,00.']
    },

    // --- SE + z + tail probability for the mean (numeric, fixed) --------------
    {
      id: 't6-zmean-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Distribucija uzorka aritmetičke sredine',
      prompt: 'Populacija ima μ = 100 i σ = 15. Za uzorak od n = 9, izračunaj standardnu pogrešku, z-vrijednost za'
        + 'x̄ = 105, and P(x̄ > 105). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'se', label: 'Standardna pogreška σ_x̄', answer: 5, tol: 0.05, unit: '', hint: '15 ÷ √9 = 15 ÷ 3' },
        { key: 'z', label: 'z-vrijednost za x̄ = 105', answer: 1.0, tol: 0.01, unit: '', hint: '(105 − 100) ÷ 5' },
        { key: 'pMore', label: 'P(x̄ > 105)', answer: SL.normalSf(1.0), tol: 0.01, unit: '', hint: '1 − P(Z < 1,0) = 1 − 0,8413' }
      ],
      solution: [
        'σ_x̄ = 15 ÷ √9 = 15 ÷ 3 = 5.',
        'z = (105 − 100) ÷ 5 = 1,0.',
        'P(x̄ > 105) = 1 − P(Z < 1,0) = 1 − 0,8413 = 0,1587 ≈ 0,16.'
      ]
    },

    // --- SE + z + tail probability for a proportion (numeric, fixed) ----------
    {
      id: 't6-proportion-1',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Distribucija uzorka proporcije',
      prompt: 'Proporcija populacije iznosi P = 0,50. Za uzorak od n = 100, izračunaj standardnu pogrešku od p̂,'
        + 'z-value for p̂ = 0.60, and P(p̂ > 0.60). Use a z-table; give probabilities to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'se', label: 'Standardna pogreška σ_p̂', answer: 0.05, tol: 0.01, unit: '', hint: '√[P(1 − P) ÷ n] = √(0,25 ÷ 100)' },
        { key: 'z', label: 'z-vrijednost za p̂ = 0,60', answer: 2.0, tol: 0.01, unit: '', hint: '(0,60 − 0,50) ÷ 0,05' },
        { key: 'pMore', label: 'P(p̂ > 0,60)', answer: SL.normalSf(2.0), tol: 0.01, unit: '', hint: '1 − P(Z < 2,0) = 1 − 0,9772' }
      ],
      solution: [
        'σ_p̂ = √[0,50 × 0,50 ÷ 100] = √(0,0025) = 0,05.',
        'z = (0,60 − 0,50) ÷ 0,05 = 2,0.',
        'P(p̂ > 0.60) = 1 − P(Z < 2.0) = 1 − 0.9772 = 0.0228 ≈ 0.02.'
      ]
    },

    // --- RANDOMIZED: standard error of the mean -------------------------------
    {
      id: 't6-se-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Standardna pogreška — Vježba',
      prompt: 'Izračunajte standardnu pogrešku aritmetičke sredine uzorka.',
      difficulty: 1,
      params: {
        sigma: { choices: [10, 15, 20, 25, 30] },
        n: { choices: [9, 16, 25, 100] }
      },
      generate(p) {
        const se = p.sigma / Math.sqrt(p.n);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A population has standard deviation σ = ' + p.sigma + '. For a sample of n = ' + p.n + ', compute the '
            + 'standard error of the sample mean. Round to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_x̄', answer: se, tol: 0.05, unit: '', hint: 'σ ÷ √n = ' + p.sigma + ' ÷ √' + p.n }
          ],
          solution: ['σ_x̄ = σ ÷ √n = ' + p.sigma + ' ÷ ' + Math.sqrt(p.n) + ' = ' + r2(se) + '.']
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. Standardna pogreška aritmetičke sredine je σ ÷ √n; smanjuje se kako n raste.']
    },

    // --- RANDOMIZED: SE + z + probability for the mean ------------------------
    {
      id: 't6-zmean-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Distribucija uzorka aritmetičke sredine — Vježba',
      prompt: 'Izračunajte standardnu pogrešku, z-vrijednost aritmetičke sredine uzorka i vjerojatnost repa.',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 15, n: 9 }, { s: 20, n: 25 }, { s: 30, n: 9 }, { s: 10, n: 25 }, { s: 24, n: 16 }, { s: 40, n: 100 }] },
        mu: { choices: [50, 100, 200] },
        zc: { choices: [-1.5, -1, 1, 1.5, 2] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);     // clean integer by construction
        const xbar = p.mu + p.zc * se;       // so the z-value is exactly zc
        const pLess = SL ? SL.normalCdf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A population has μ = ' + p.mu + ' and σ = ' + sigma + '. For a sample of n = ' + n + ', compute the '
            + 'standard error, the z-value for x̄ = ' + xbar + ', and P(x̄ < ' + xbar + '). Probabilities to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_x̄', answer: se, tol: 0.05, unit: '', hint: '' + sigma + ' ÷ √' + n },
            { key: 'z', label: 'z-value for x̄ = ' + xbar, answer: p.zc, tol: 0.01, unit: '', hint: '(' + xbar + ' − ' + p.mu + ') ÷ ' + se },
            { key: 'pLess', label: 'P(x̄ < ' + xbar + ')', answer: pLess, tol: 0.01, unit: '', hint: 'P(Z < ' + p.zc + ') from the z-table' }
          ],
          solution: [
            'σ_x̄ = ' + sigma + ' ÷ √' + n + ' = ' + se + '.',
            'z = (' + xbar + ' − ' + p.mu + ') ÷ ' + se + ' = ' + p.zc + ';   P(x̄ < ' + xbar + ') = P(Z < ' + p.zc + ') = ' + r2(pLess) + '.'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. σ_x̄ = σ ÷ √n; z = (x̄ − μ) ÷ σ_x̄; zatim očitajte P(Z < z) iz z-tablice.']
    },

    // --- RANDOMIZED: SE + z + probability for a proportion --------------------
    {
      id: 't6-proportion-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Distribucija uzorka proporcije — Vježba',
      prompt: 'Izračunajte standardnu pogrešku od p̂, njezinu z-vrijednost i vjerojatnost repa.',
      difficulty: 3,
      params: {
        P: { choices: [0.2, 0.5] },
        n: { choices: [25, 100, 400] },
        zc: { choices: [1, 1.5, 2] }
      },
      generate(p) {
        const se = Math.sqrt(p.P * (1 - p.P) / p.n); // clean (√(P(1−P)) ÷ √n) by construction
        const phat = p.P + p.zc * se;                // so the z-value is exactly zc
        const pMore = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        const r4 = (v) => Math.round(v * 10000) / 10000;
        return {
          prompt: 'A population proportion is P = ' + p.P.toFixed(2) + '. For a sample of n = ' + p.n + ', compute the '
            + 'standard error of p̂, the z-value for p̂ = ' + r4(phat) + ', and P(p̂ > ' + r4(phat) + '). '
            + 'Probabilities to 2 decimals.',
          fields: [
            { key: 'se', label: 'Standard error σ_p̂', answer: se, tol: 0.01, unit: '', hint: '√[P(1 − P) ÷ n] = √(' + r4(p.P * (1 - p.P)) + ' ÷ ' + p.n + ')' },
            { key: 'z', label: 'z-value', answer: p.zc, tol: 0.01, unit: '', hint: '(p̂ − P) ÷ σ_p̂' },
            { key: 'pMore', label: 'P(p̂ > ' + r4(phat) + ')', answer: pMore, tol: 0.01, unit: '', hint: '1 − P(Z < ' + p.zc + ')' }
          ],
          solution: [
            'σ_p̂ = √[' + p.P.toFixed(2) + ' × ' + (1 - p.P).toFixed(2) + ' ÷ ' + p.n + '] = ' + r2(se) + '.',
            'z = (' + r4(phat) + ' − ' + p.P.toFixed(2) + ') ÷ ' + r2(se) + ' = ' + p.zc + ';   P(p̂ > ' + r4(phat) + ') = 1 − P(Z < ' + p.zc + ') = ' + r2(pMore) + '.'
          ]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. σ_p̂ = √[P(1 − P) ÷ n]; z = (p̂ − P) ÷ σ_p̂; zatim koristite z-tablicu.']
    },

    // ============================================================================
    // B2.6 — T7 CONFIDENCE INTERVALS (second-midterm)
    //   Point estimate ± (reliability factor)·(standard error). CI for μ (σ known, z
    //   via SL.zCritical), CI for μ (σ unknown, t via SL.tCritical(df, α/2)), CI for a
    //   proportion. ME = factor·SE; width = 2·ME. The reliability factor (z or t) is
    //   STATED in the prompt (no z/t-table widget) → exercise tests the CI mechanics,
    //   not the lookup. SE kept clean. Means: bounds/ME/width 2 dp (tol 0.05);
    //   proportions: 3 dp (tol 0.01). chapter 7. FIRST K2 (second-midterm) exercise.
    // ============================================================================

    // --- T7 concepts (TF + MC) ------------------------------------------------
    {
      id: 't7-concepts',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Intervali pouzdanosti — Koncepti',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, a zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Točkasta procjena je jedan broj; interval pouzdanosti daje raspon.', kind: 'tf', answer: true },
        { q: 'Svaki interval pouzdanosti ima oblik: točkasta procjena ± (faktor pouzdanosti)(standardna pogreška).', kind: 'tf', answer: true },
        { q: '95% interval pouzdanosti znači da postoji 95% vjerojatnost da OVAJ određeni interval sadrži μ.', kind: 'tf', answer: false },
        { q: 'Kada je σ nepoznat, interval pouzdanosti za μ koristi Studentovu t-distribuciju s n − 1 stupnjeva slobode.', kind: 'tf', answer: true },
        { q: 'Povećanje razine pouzdanosti čini interval užim.', kind: 'tf', answer: false },
        { q: 'Veći uzorak daje uži interval pouzdanosti.', kind: 'tf', answer: true },
        { q: 'Margina pogreške je UKUPNA širina intervala pouzdanosti.', kind: 'tf', answer: false },
        { q: 'Za 95% interval pouzdanosti s poznatim σ, z-faktor pouzdanosti je:', kind: 'mc', options: ['1.645', '1.96', '2.33', '2.58'], answer: 1 },
        { q: 'Širina intervala pouzdanosti jednaka je:', kind: 'mc', options: ['ME', '2·ME', 'ME ÷ 2', 'ME²'], answer: 1 },
        { q: 'Interval pouzdanosti za proporciju koristi standardnu pogrešku:', kind: 'mc', options: ['√[p̂(1 − p̂) ÷ n]', 'σ ÷ √n', 's ÷ √n', 'p̂ ÷ n'], answer: 0 }
      ],
      solution: [
        'Realizirani interval pouzdanosti od 95% ili sadrži μ ili ne; 95% se odnosi na dugoročnu uspješnost METODE, a ne na jedan interval.',
        'Viša razina pouzdanosti → veći z/t → ŠIRI interval; veći n → manja standardna pogreška → UŽI interval.',
        'Margina pogreške je POLA širine; ukupna širina iznosi 2·ME.'
      ]
    },

    // --- CI for μ, σ known (numeric, fixed) -----------------------------------
    {
      id: 't7-ci-mean-known-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za aritmetičku sredinu (σ poznat)',
      prompt: 'Uzorak veličine n = 25 daje x̄ = 50; populacijska standardna devijacija σ = 10 je poznata. Izgradi interval pouzdanosti od 95% za μ.'
        + '(use z = 1.96). Compute the margin of error, the lower and upper limits, and the width. Round to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'me', label: 'Margina pogreške', answer: 3.92, tol: 0.05, unit: '', hint: 'z·σ/√n = 1.96 × (10 ÷ 5)' },
        { key: 'lower', label: 'Donja granica', answer: 46.08, tol: 0.05, unit: '', hint: 'x̄ − ME = 50 − 3.92' },
        { key: 'upper', label: 'Gornja granica', answer: 53.92, tol: 0.05, unit: '', hint: 'x̄ + ME = 50 + 3.92' },
        { key: 'width', label: 'Širina', answer: 7.84, tol: 0.05, unit: '', hint: '2·ME' }
      ],
      solution: [
        'SE = σ/√n = 10 ÷ 5 = 2.   ME = 1.96 × 2 = 3.92.',
        'CI = 50 ± 3.92 = (46.08, 53.92).   Širina = 2 × 3.92 = 7.84.'
      ]
    },

    // --- CI for μ, σ unknown (t) (numeric, fixed) -----------------------------
    {
      id: 't7-ci-mean-unknown-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za aritmetičku sredinu (σ nepoznat, t)',
      prompt: 'Uzorak veličine n = 9 daje x̄ = 100 i standardnu devijaciju uzorka s = 12. Izgradi interval pouzdanosti od 95% za μ koristeći Studentovu t-distribuciju.'
        + 'distribution (df = 8, t = 2.306). Compute the margin of error and the lower and upper limits. Round to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'me', label: 'Margina pogreške', answer: 2.306 * 4, tol: 0.05, unit: '', hint: 't·s/√n = 2.306 × (12 ÷ 3)' },
        { key: 'lower', label: 'Donja granica', answer: 100 - 2.306 * 4, tol: 0.05, unit: '', hint: 'x̄ − ME' },
        { key: 'upper', label: 'Gornja granica', answer: 100 + 2.306 * 4, tol: 0.05, unit: '', hint: 'x̄ + ME' }
      ],
      solution: [
        'SE = s/√n = 12 ÷ 3 = 4.   ME = t·SE = 2.306 × 4 = 9.22.',
        'CI = 100 ± 9.22 = (90.78, 109.22). Vrijednost t je veća od z jer σ nije poznata.'
      ]
    },

    // --- CI for a proportion (numeric, fixed) ---------------------------------
    {
      id: 't7-ci-proportion-1',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za proporciju',
      prompt: 'U uzorku od n = 100, udio uzorka iznosi p̂ = 0,50. Izgradi 95% interval pouzdanosti za'
        + 'population proportion (use z = 1.96). Compute the margin of error and the lower and upper limits. Round to 3 decimals.',
      difficulty: 2,
      fields: [
        { key: 'me', label: 'Margina pogreške', answer: 1.96 * 0.05, tol: 0.01, unit: '', hint: 'z·√[p̂(1 − p̂)/n] = 1,96 × 0,05' },
        { key: 'lower', label: 'Donja granica', answer: 0.5 - 1.96 * 0.05, tol: 0.01, unit: '', hint: 'p̂ − ME' },
        { key: 'upper', label: 'Gornja granica', answer: 0.5 + 1.96 * 0.05, tol: 0.01, unit: '', hint: 'p̂ + ME' }
      ],
      solution: [
        'SE = √[0,50 × 0,50 ÷ 100] = √0,0025 = 0,05.   ME = 1,96 × 0,05 = 0,098.',
        'CI = 0,50 ± 0,098 = (0,402, 0,598).'
      ]
    },

    // --- RANDOMIZED: CI for μ, σ known ----------------------------------------
    {
      id: 't7-ci-mean-known-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za aritmetičku sredinu (σ poznata) — Vježba',
      prompt: 'Izgradi interval pouzdanosti za μ kada je σ poznata.',
      difficulty: 2,
      params: {
        pair: { choices: [{ s: 20, n: 16 }, { s: 30, n: 9 }, { s: 12, n: 9 }, { s: 20, n: 25 }, { s: 15, n: 9 }, { s: 24, n: 16 }] },
        xbar: { choices: [50, 100, 200] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);          // clean integer by construction
        const z = SL ? SL.zCritical(p.conf) : 0;
        const me = z * se;
        const lower = p.xbar - me, upper = p.xbar + me, width = 2 * me;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A sample of n = ' + n + ' gives x̄ = ' + p.xbar + '; the population σ = ' + sigma + ' is known. Build a '
            + p.conf + '% confidence interval for μ (use z = ' + z + '). Compute the margin of error, the lower and '
            + 'upper limits, and the width. Round to 2 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.05, unit: '', hint: 'z·σ/√n = ' + z + ' × (' + sigma + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.05, unit: '', hint: 'x̄ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.05, unit: '', hint: 'x̄ + ME' },
            { key: 'width', label: 'Width', answer: width, tol: 0.05, unit: '', hint: '2·ME' }
          ],
          solution: [
            'SE = ' + sigma + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   ME = ' + z + ' × ' + se + ' = ' + r2(me) + '.',
            'CI = ' + p.xbar + ' ± ' + r2(me) + ' = (' + r2(lower) + ', ' + r2(upper) + ');   width = ' + r2(width) + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. CI = x̄ ± z·(σ/√n); ME = z·σ/√n; širina = 2·ME.']
    },

    // --- RANDOMIZED: CI for μ, σ unknown (t) ----------------------------------
    {
      id: 't7-ci-mean-unknown-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za aritmetičku sredinu (σ nepoznata, t) — Vježba',
      prompt: 'Izgradi interval pouzdanosti za μ koristeći Studentovu t-distribuciju (σ nepoznata).',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 6, n: 9, df: 8 }, { s: 12, n: 9, df: 8 }, { s: 8, n: 16, df: 15 }, { s: 10, n: 25, df: 24 }, { s: 15, n: 25, df: 24 }] },
        xbar: { choices: [50, 100, 200] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const s = p.pair.s, n = p.pair.n, df = p.pair.df;
        const se = s / Math.sqrt(n);              // clean integer by construction
        // α/2 upper-tail area as EXACT table keys (avoid float drift like 0.0499…).
        const AREA = { 90: 0.05, 95: 0.025, 99: 0.005 };
        const area = AREA[p.conf];
        const t = SL ? SL.tCritical(df, area) : 0;
        const me = t * se;
        const lower = p.xbar - me, upper = p.xbar + me;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A sample of n = ' + n + ' gives x̄ = ' + p.xbar + ' and sample SD s = ' + s + '. Build a ' + p.conf
            + '% confidence interval for μ using the t distribution (df = ' + df + ', t = ' + t + '). Compute the margin '
            + 'of error and the lower and upper limits. Round to 2 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.05, unit: '', hint: 't·s/√n = ' + t + ' × (' + s + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.05, unit: '', hint: 'x̄ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.05, unit: '', hint: 'x̄ + ME' }
          ],
          solution: [
            'SE = ' + s + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   ME = ' + t + ' × ' + se + ' = ' + r2(me) + '.',
            'CI = ' + p.xbar + ' ± ' + r2(me) + ' = (' + r2(lower) + ', ' + r2(upper) + ').'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Kada je σ nepoznata: CI = x̄ ± t·(s/√n), df = n − 1; ME = t·s/√n.']
    },

    // --- RANDOMIZED: CI for a proportion --------------------------------------
    {
      id: 't7-ci-proportion-random',
      lesson: 'second-midterm',
      chapter: 7,
      type: 'numeric',
      title: 'Interval pouzdanosti za udio — Vježba',
      prompt: 'Izgradi interval pouzdanosti za udio populacije.',
      difficulty: 3,
      params: {
        phat: { choices: [0.2, 0.5] },
        n: { choices: [100, 400] },
        conf: { choices: [90, 95, 99] }
      },
      generate(p) {
        const se = Math.sqrt(p.phat * (1 - p.phat) / p.n); // clean by construction
        const z = SL ? SL.zCritical(p.conf) : 0;
        const me = z * se;
        const lower = p.phat - me, upper = p.phat + me;
        const r3 = (v) => Math.round(v * 1000) / 1000;
        return {
          prompt: 'In a sample of n = ' + p.n + ', the sample proportion is p̂ = ' + p.phat.toFixed(2) + '. Build a '
            + p.conf + '% confidence interval for the population proportion (use z = ' + z + '). Compute the margin of '
            + 'error and the lower and upper limits. Round to 3 decimals.',
          fields: [
            { key: 'me', label: 'Margin of error', answer: me, tol: 0.01, unit: '', hint: 'z·√[p̂(1 − p̂)/n] = ' + z + ' × ' + r3(se) },
            { key: 'lower', label: 'Lower limit', answer: lower, tol: 0.01, unit: '', hint: 'p̂ − ME' },
            { key: 'upper', label: 'Upper limit', answer: upper, tol: 0.01, unit: '', hint: 'p̂ + ME' }
          ],
          solution: [
            'SE = √[' + p.phat.toFixed(2) + ' × ' + (1 - p.phat).toFixed(2) + ' ÷ ' + p.n + '] = ' + r3(se) + ';   ME = ' + z + ' × ' + r3(se) + ' = ' + r3(me) + '.',
            'CI = ' + p.phat.toFixed(2) + ' ± ' + r3(me) + ' = (' + r3(lower) + ', ' + r3(upper) + ').'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. CI = p̂ ± z·√[p̂(1 − p̂)/n]; ME = z·SE.']
    },

    // ============================================================================
    // B2.7 — T8 HYPOTHESIS TESTING (single population) (second-midterm)
    //   z test for a mean (σ known) z=(x̄−μ₀)/(σ/√n); t test (σ unknown) t=(x̄−μ₀)/(s/√n),
    //   df=n−1; z test for a proportion z=(p̂−P₀)/√(P₀(1−P₀)/n). p-value via SL.normalSf
    //   (two-tailed = 2·P(Z>|z|)); decision by comparing to the critical value. Test
    //   statistics & p-values → 2 dp (tol 0.01). SE kept clean → z exact. Decisions are
    //   `choice` (reject / fail to reject). chapter 8.
    // ============================================================================

    // --- T8 concepts (TF + MC) ------------------------------------------------
    {
      id: 't8-concepts',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Testiranje hipoteza — Pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Nulta hipoteza H₀ sadrži znak jednakosti (=, ≤, ≥).', kind: 'tf', answer: true },
        { q: 'Neznačajan test DOKAZUJE da je H₀ istinita.', kind: 'tf', answer: false },
        { q: 'Vjerojatnost pogreške prve vrste iznosi α.', kind: 'tf', answer: true },
        { q: 'Snaga testa iznosi 1 − β.', kind: 'tf', answer: true },
        { q: 'Dvostrani test dijeli α između oba repa distribucije.', kind: 'tf', answer: true },
        { q: 'Kada je σ nepoznata, testna veličina za aritmetičku sredinu koristi Studentovu t-distribuciju.', kind: 'tf', answer: true },
        { q: 'Ne odbaciti LAŽNU H₀ pogreška je druge vrste.', kind: 'tf', answer: true },
        { q: 'Odbacivanje ISTINITE H₀ jest:', kind: 'mc', options: ['Pogreška prve vrste', 'Pogreška druge vrste', 'Ispravna odluka', 'p-vrijednost'], answer: 0 },
        { q: 'Koristeći p-vrijednost, odbacujemo H₀ kada:', kind: 'mc', options: ['p ≥ α', 'p < α', 'p = 1', 'p > 0,5'], answer: 1 },
        { q: 'Razina značajnosti α se odabire:', kind: 'mc', options: ['Nakon uvida u podatke', 'Unaprijed od strane istraživača', 'Uvijek 0,5', 'Prema veličini uzorka'], answer: 1 }
      ],
      solution: [
        'Nikada ne „dokazujemo" H₀; mi je ili odbacujemo ili ne odbacujemo („nevin dok se ne dokaže krivnja").',
        'Pogreška tipa I = odbacivanje istinite H₀ (vjerojatnost α); pogreška tipa II = ne odbacivanje lažne H₀ (vjerojatnost β); snaga testa = 1 − β.',
        'Pravilo p-vrijednosti: odbaci H₀ kada je p < α.'
      ]
    },

    // --- Decisions from a test statistic / p-value (choice) -------------------
    {
      id: 't8-decision',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Donošenje odluke',
      prompt: 'Za svaki scenarij odlučite što učiniti s H₀.',
      difficulty: 2,
      items: [
        { q: 'Testna veličina koja prelazi kritičnu vrijednost dovodi do odbacivanja H₀.', kind: 'tf', answer: true },
        { q: 'Ako je p-vrijednost veća od α, ne odbacujemo H₀.', kind: 'tf', answer: true },
        { q: 'Dvostrani test: z = 2,50, kritične vrijednosti ±1,96. Odluka?', kind: 'mc', options: ['Odbaciti H₀', 'Ne odbaciti H₀'], answer: 0 },
        { q: 'p-vrijednost = 0,08, α = 0,05. Odluka?', kind: 'mc', options: ['Odbaciti H₀', 'Ne odbaciti H₀'], answer: 1 },
        { q: 'Desnostrani test: z = 1,20, kritična vrijednost 1,645. Odluka?', kind: 'mc', options: ['Odbaciti H₀', 'Ne odbaciti H₀'], answer: 1 },
        { q: 'Lijevostrani test: z = −2,10, kritična vrijednost −1,645. Odluka?', kind: 'mc', options: ['Odbaciti H₀', 'Ne odbaciti H₀'], answer: 0 },
        { q: 'p-vrijednost = 0.003, α = 0.01. Odluka?', kind: 'mc', options: ['Odbaciti H₀', 'Ne odbaciti H₀'], answer: 0 }
      ],
      solution: [
        'Pravilo kritične vrijednosti: odbaci H₀ kada testna veličina pada u područje odbacivanja (izvan kritične vrijednosti).',
        'Pravilo p-vrijednosti: odbaci H₀ kada je p < α. z = 2.50 > 1.96 → odbaci; z = 1.20 < 1.645 → ne odbaci; z = −2.10 < −1.645 → odbaci.'
      ]
    },

    // --- z test for a mean, two-tailed (numeric, fixed) -----------------------
    {
      id: 't8-ztest-mean-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z-test za aritmetičku sredinu (σ poznata)',
      prompt: 'Testiraj H₀: μ = 50 nasuprot H₁: μ ≠ 50 (dvostrani test) pri α = 0.05. Uzorak veličine n = 25 daje x̄ = 58; populacija'
        + 'σ = 20 is known. Compute the test statistic z and the two-tailed p-value (2 decimals).',
      difficulty: 3,
      fields: [
        { key: 'z', label: 'Testna veličina z', answer: 2.0, tol: 0.01, unit: '', hint: '(x̄ − μ₀) ÷ (σ/√n) = (58 − 50) ÷ (20 ÷ 5)' },
        { key: 'p', label: 'Dvostrana p-vrijednost', answer: 2 * SL.normalSf(2.0), tol: 0.01, unit: '', hint: '2 × P(Z > |z|) = 2 × (1 − 0.9772)' }
      ],
      solution: [
        'SE = 20 ÷ 5 = 4;   z = (58 − 50) ÷ 4 = 2.0.',
        'p = 2 × P(Z > 2.0) = 2 × 0.0228 = 0.0456 ≈ 0.05. Budući da je p < 0.05 (jedva), odbaci H₀.'
      ]
    },

    // --- t test for a mean (numeric, fixed) -----------------------------------
    {
      id: 't8-ttest-mean-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 't-test za aritmetičku sredinu (σ nepoznata)',
      prompt: 'Testiraj H₀: μ = 50 nasuprot H₁: μ ≠ 50 (dvostrani test) pri α = 0.05. Uzorak veličine n = 16 daje x̄ = 53 i standardnu devijaciju uzorka'
        + 's = 8. The critical value is t = ±2.131 (df = 15). Compute the degrees of freedom and the test statistic t.',
      difficulty: 3,
      fields: [
        { key: 'df', label: 'Stupnjevi slobode', answer: 15, tol: 0, unit: '', hint: 'n − 1 = 16 − 1' },
        { key: 't', label: 'Testna veličina t', answer: 1.5, tol: 0.01, unit: '', hint: '(x̄ − μ₀) ÷ (s/√n) = (53 − 50) ÷ (8 ÷ 4)' }
      ],
      solution: [
        'df = n − 1 = 15;   SE = 8 ÷ 4 = 2;   t = (53 − 50) ÷ 2 = 1.5.',
        '|t| = 1.5 < 2.131, pa testna veličina NIJE u području odbacivanja → ne odbaci H₀.'
      ]
    },

    // --- z test for a proportion, right-tailed (numeric, fixed) ---------------
    {
      id: 't8-ztest-prop-1',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z-test za proporciju',
      prompt: 'Testiraj H₀: P = 0.50 nasuprot H₁: P > 0.50 (desnostrani test) pri α = 0.05. Uzorak veličine n = 100 daje p̂ = 0.60.'
        + 'Compute the test statistic z and the one-tailed p-value (2 decimals).',
      difficulty: 3,
      fields: [
        { key: 'z', label: 'Testna veličina z', answer: 2.0, tol: 0.01, unit: '', hint: '(p̂ − P₀) ÷ √[P₀(1 − P₀)/n] = (0.60 − 0.50) ÷ 0.05' },
        { key: 'p', label: 'Jednostrana p-vrijednost', answer: SL.normalSf(2.0), tol: 0.01, unit: '', hint: 'P(Z > z) = 1 − 0.9772' }
      ],
      solution: [
        'SE = √[0.50 × 0.50 ÷ 100] = 0.05;   z = (0.60 − 0.50) ÷ 0.05 = 2.0.',
        'p = P(Z > 2.0) = 0.0228 ≈ 0.02. Budući da je p < 0.05, odbaci H₀.'
      ]
    },

    // --- RANDOMIZED: z test for a mean, two-tailed ----------------------------
    {
      id: 't8-ztest-mean-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z-test za aritmetičku sredinu — vježba',
      prompt: 'Izračunaj testnu veličinu i dvostrani p-vrijednost.',
      difficulty: 3,
      params: {
        pair: { choices: [{ s: 15, n: 9 }, { s: 20, n: 25 }, { s: 30, n: 9 }, { s: 12, n: 9 }, { s: 20, n: 16 }] },
        mu0: { choices: [50, 100, 200] },
        zc: { choices: [-2.5, -2, -1.5, 1.5, 2, 2.5] }
      },
      generate(p) {
        const sigma = p.pair.s, n = p.pair.n;
        const se = sigma / Math.sqrt(n);     // clean integer by construction
        const xbar = p.mu0 + p.zc * se;      // so the test statistic is exactly zc
        const pval = SL ? 2 * SL.normalSf(Math.abs(p.zc)) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'Test H₀: μ = ' + p.mu0 + ' vs H₁: μ ≠ ' + p.mu0 + ' (two-tailed). A sample of n = ' + n + ' gives '
            + 'x̄ = ' + xbar + '; the population σ = ' + sigma + ' is known. Compute the test statistic z and the '
            + 'two-tailed p-value (2 decimals).',
          fields: [
            { key: 'z', label: 'Test statistic z', answer: p.zc, tol: 0.01, unit: '', hint: '(' + xbar + ' − ' + p.mu0 + ') ÷ (' + sigma + ' ÷ ' + Math.sqrt(n) + ')' },
            { key: 'p', label: 'Two-tailed p-value', answer: pval, tol: 0.01, unit: '', hint: '2 × P(Z > |z|)' }
          ],
          solution: [
            'SE = ' + sigma + ' ÷ ' + Math.sqrt(n) + ' = ' + se + ';   z = (' + xbar + ' − ' + p.mu0 + ') ÷ ' + se + ' = ' + p.zc + '.',
            'p = 2 × P(Z > ' + Math.abs(p.zc) + ') = ' + r2(pval) + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. z = (x̄ − μ₀) ÷ (σ/√n); dvostrani p = 2 × P(Z > |z|); odbaci H₀ ako je p < α.']
    },

    // --- RANDOMIZED: z test for a proportion, right-tailed --------------------
    {
      id: 't8-ztest-prop-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'z-test za proporciju — vježba',
      prompt: 'Izračunaj testnu veličinu i jednostrani p-vrijednost.',
      difficulty: 3,
      params: {
        P0: { choices: [0.2, 0.5] },
        n: { choices: [100, 400] },
        zc: { choices: [1.5, 2, 2.5] }
      },
      generate(p) {
        const se = Math.sqrt(p.P0 * (1 - p.P0) / p.n); // clean by construction
        const phat = p.P0 + p.zc * se;                 // so the test statistic is exactly zc
        const pval = SL ? SL.normalSf(p.zc) : 0;
        const r2 = (v) => Math.round(v * 100) / 100;
        const r4 = (v) => Math.round(v * 10000) / 10000;
        return {
          prompt: 'Test H₀: P = ' + p.P0.toFixed(2) + ' vs H₁: P > ' + p.P0.toFixed(2) + ' (right-tailed). A sample of '
            + 'n = ' + p.n + ' gives p̂ = ' + r4(phat) + '. Compute the test statistic z and the one-tailed p-value (2 decimals).',
          fields: [
            { key: 'z', label: 'Test statistic z', answer: p.zc, tol: 0.01, unit: '', hint: '(p̂ − P₀) ÷ √[P₀(1 − P₀)/n]' },
            { key: 'p', label: 'One-tailed p-value', answer: pval, tol: 0.01, unit: '', hint: 'P(Z > z)' }
          ],
          solution: [
            'SE = √[' + p.P0.toFixed(2) + ' × ' + (1 - p.P0).toFixed(2) + ' ÷ ' + p.n + '] = ' + r2(se) + ';   z = (' + r4(phat) + ' − ' + p.P0.toFixed(2) + ') ÷ ' + r2(se) + ' = ' + p.zc + '.',
            'p = P(Z > ' + p.zc + ') = ' + r2(pval) + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. z = (p̂ − P₀) ÷ √[P₀(1 − P₀)/n]; jednostrani p = P(Z > z); odbaci H₀ ako je p < α.']
    },

    // ============================================================================
    // B2.8 — T9 REGRESSION ANALYSIS (second-midterm)
    //   Least-squares slope b₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² and intercept b₀ = ȳ − b₁x̄;
    //   prediction ŷ = b₀ + b₁x; variation SST = SSR + SSE; R² = SSR/SST; error variance
    //   s²ₑ = SSE/(n−2). All elementary inline (no stat-lib needed). Randomized slope uses
    //   hand-verified clean data sets (object-valued param choices). Coefficients/predictions
    //   2 dp (tol 0.05); R² is a proportion → 2 dp (tol 0.01); SSR integer (tol 0). chapter 9.
    // ============================================================================

    // --- T9 concepts (TF + MC) ------------------------------------------------
    {
      id: 't9-concepts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Regresija — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'U regresiji, Y je zavisna varijabla koju predviđamo.', kind: 'tf', answer: true },
        { q: 'Metoda najmanjih kvadrata minimizira sumu kvadrata reziduala (SSE).', kind: 'tf', answer: true },
        { q: 'Regresijski pravac uvijek prolazi kroz točku (x̄, ȳ).', kind: 'tf', answer: true },
        { q: 'Ukupna varijacija se rastavlja kao SST = SSR + SSE.', kind: 'tf', answer: true },
        { q: 'R² može biti veći od 1 za vrlo jaku vezu.', kind: 'tf', answer: false },
        { q: 'Varijanca pogreške modela dijeli SSE s n − 1.', kind: 'tf', answer: false },
        { q: 't-test nagiba ima nultu hipotezu H₀: β₁ = 0.', kind: 'tf', answer: true },
        { q: 'Koeficijent determinacije R² jednak je:', kind: 'mc', options: ['SSE ÷ SST', 'SSR ÷ SST', 'SST ÷ SSR', '1 + SSE ÷ SST'], answer: 1 },
        { q: 'Nagib b₁ mjeri promjenu prosječnog Y za jediničnu promjenu u:', kind: 'mc', options: ['Y', 'X', 'rezidual', 'SST'], answer: 1 },
        { q: 'U jednostavnoj regresiji, F-statistika jednaka je:', kind: 'mc', options: ['t', 't²', '√t', 'R²'], answer: 1 }
      ],
      solution: [
        '0 ≤ R² ≤ 1; varijanca pogreške dijeli SSE s n − 2 (procijenjena su dva parametra b₀, b₁).',
        'R² = SSR/SST je udio varijacije od Y objašnjen s X; pravac prolazi kroz (x̄, ȳ).',
        'Za jedan prediktor vrijedi F = t² i oba testiraju β₁ = 0.'
      ]
    },

    // --- Least-squares line from a small data set (numeric, fixed) ------------
    {
      id: 't9-slope-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Pravac najmanjih kvadrata',
      prompt: 'Za podatke (1, 2), (2, 4), (3, 5), (4, 4), (5, 5), pronađi nagib b₁ i odsječak b₀ metodom najmanjih kvadrata.'
        + 'then predict ŷ at x = 6. (x̄ = 3, ȳ = 4.) Round to 2 decimals.',
      difficulty: 3,
      fields: [
        { key: 'b1', label: 'Nagib b₁', answer: 0.6, tol: 0.05, unit: '', hint: 'Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² = 6 ÷ 10' },
        { key: 'b0', label: 'Odsječak b₀', answer: 2.2, tol: 0.05, unit: '', hint: 'ȳ − b₁x̄ = 4 − 0.6 × 3' },
        { key: 'yhat', label: 'Prognoza ŷ za x = 6', answer: 5.8, tol: 0.05, unit: '', hint: 'b₀ + b₁ × 6' }
      ],
      solution: [
        'Σ(x − x̄)(y − ȳ) = 6;  Σ(x − x̄)² = 10  →  b₁ = 6 ÷ 10 = 0.6.',
        'b₀ = ȳ − b₁x̄ = 4 − 0.6 × 3 = 2.2.   ŷ(6) = 2.2 + 0.6 × 6 = 5.8.'
      ]
    },

    // --- Variation decomposition & R² (numeric, fixed) ------------------------
    {
      id: 't9-rsquared-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'R² i varijanca pogreške',
      prompt: 'Regresija na n = 12 opažanja daje SST = 200 i SSE = 50. Izračunaj objašnjenu varijaciju SSR,'
        + 'the coefficient of determination R², and the estimated error variance s²ₑ. Round R² to 2 decimals.',
      difficulty: 2,
      fields: [
        { key: 'ssr', label: 'Objašnjena varijacija SSR', answer: 150, tol: 0, unit: '', hint: 'SST − SSE = 200 − 50' },
        { key: 'r2', label: 'Koeficijent determinacije R²', answer: 0.75, tol: 0.01, unit: '', hint: 'SSR ÷ SST = 150 ÷ 200' },
        { key: 'se2', label: 'Varijanca pogreške s²ₑ', answer: 5, tol: 0.05, unit: '', hint: 'SSE ÷ (n − 2) = 50 ÷ 10' }
      ],
      solution: [
        'SSR = SST − SSE = 200 − 50 = 150.',
        'R² = SSR ÷ SST = 150 ÷ 200 = 0.75 (75% varijacije od Y je objašnjeno).',
        's²ₑ = SSE ÷ (n − 2) = 50 ÷ 10 = 5.'
      ]
    },

    // --- Prediction & slope interpretation (numeric, fixed) -------------------
    {
      id: 't9-predict-1',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Prognoza iz procijenjenog pravca',
      prompt: 'Procijenjeni regresijski pravac je ŷ = 10 + 2.5x. Prognoziraj ŷ za x = 8, prognoziraj ŷ za x = 4 i navedi promjenu'
        + 'in average Y for a one-unit increase in X. Round to 2 decimals.',
      difficulty: 1,
      fields: [
        { key: 'y8', label: 'Prognoza ŷ za x = 8', answer: 30, tol: 0.05, unit: '', hint: '10 + 2.5 × 8' },
        { key: 'y4', label: 'Prognoza ŷ za x = 4', answer: 20, tol: 0.05, unit: '', hint: '10 + 2.5 × 4' },
        { key: 'change', label: 'Promjena Y po +1 u X', answer: 2.5, tol: 0.05, unit: '', hint: 'Nagib b₁' }
      ],
      solution: [
        'ŷ(8) = 10 + 2.5 × 8 = 30;   ŷ(4) = 10 + 2.5 × 4 = 20.',
        'Nagib b₁ = 2.5 predstavlja promjenu aritmetičke sredine Y za svako povećanje X za jednu jedinicu.'
      ]
    },

    // --- RANDOMIZED: least-squares line from a data set -----------------------
    {
      id: 't9-slope-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Pravac najmanjih kvadrata — Vježba',
      prompt: 'Pronađi pravac najmanjih kvadrata za skup podataka i upotrijebi ga za predikciju.',
      difficulty: 3,
      params: {
        ds: { choices: [
          { pts: [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]], xn: 6 },
          { pts: [[0, 1], [1, 1], [2, 3], [3, 3], [4, 5]], xn: 5 },
          { pts: [[2, 3], [4, 7], [6, 8], [8, 12], [10, 15]], xn: 12 },
          { pts: [[1, 5], [2, 4], [3, 4], [4, 2], [5, 1]], xn: 6 }
        ] }
      },
      generate(p) {
        const pts = p.ds.pts, xn = p.ds.xn, n = pts.length;
        const xbar = pts.reduce((s, q) => s + q[0], 0) / n;
        const ybar = pts.reduce((s, q) => s + q[1], 0) / n;
        const sxy = pts.reduce((s, q) => s + (q[0] - xbar) * (q[1] - ybar), 0);
        const sxx = pts.reduce((s, q) => s + (q[0] - xbar) * (q[0] - xbar), 0);
        const b1 = sxy / sxx;
        const b0 = ybar - b1 * xbar;
        const yhat = b0 + b1 * xn;
        const r2 = (v) => Math.round(v * 100) / 100;
        const ptsStr = pts.map((q) => '(' + q[0] + ', ' + q[1] + ')').join(', ');
        return {
          prompt: 'For the data ' + ptsStr + ', find the least-squares slope b₁ and intercept b₀, then predict ŷ at '
            + 'x = ' + xn + '. (x̄ = ' + r2(xbar) + ', ȳ = ' + r2(ybar) + '.) Round to 2 decimals.',
          fields: [
            { key: 'b1', label: 'Slope b₁', answer: b1, tol: 0.05, unit: '', hint: 'Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)² = ' + r2(sxy) + ' ÷ ' + r2(sxx) },
            { key: 'b0', label: 'Intercept b₀', answer: b0, tol: 0.05, unit: '', hint: 'ȳ − b₁x̄' },
            { key: 'yhat', label: 'Prediction ŷ at x = ' + xn, answer: yhat, tol: 0.05, unit: '', hint: 'b₀ + b₁ × ' + xn }
          ],
          solution: [
            'b₁ = ' + r2(sxy) + ' ÷ ' + r2(sxx) + ' = ' + r2(b1) + ';   b₀ = ' + r2(ybar) + ' − ' + r2(b1) + ' × ' + r2(xbar) + ' = ' + r2(b0) + '.',
            'ŷ(' + xn + ') = ' + r2(b0) + ' + ' + r2(b1) + ' × ' + xn + ' = ' + r2(yhat) + '.'
          ]
        };
      },
      solution: ['Pritisni „New numbers" za novi skup podataka. b₁ = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²; b₀ = ȳ − b₁x̄; ŷ = b₀ + b₁x.']
    },

    // --- RANDOMIZED: SSR, R² and error variance -------------------------------
    {
      id: 't9-rsquared-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'R² i varijanca pogreške — Vježba',
      prompt: 'Na temelju ukupnih varijacija izračunaj SSR, R² i varijancu pogreške.',
      difficulty: 2,
      params: {
        ss: { choices: [{ sst: 400, sse: 100 }, { sst: 500, sse: 100 }, { sst: 200, sse: 50 }, { sst: 400, sse: 40 }, { sst: 300, sse: 120 }, { sst: 500, sse: 200 }] },
        n: { choices: [12, 22, 52] }
      },
      generate(p) {
        const sst = p.ss.sst, sse = p.ss.sse;
        const ssr = sst - sse;
        const r2v = ssr / sst;
        const se2 = sse / (p.n - 2);
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A regression on n = ' + p.n + ' observations gives SST = ' + sst + ' and SSE = ' + sse + '. Compute '
            + 'the explained variation SSR, the coefficient of determination R², and the estimated error variance s²ₑ. '
            + 'Round R² to 2 decimals.',
          fields: [
            { key: 'ssr', label: 'Explained variation SSR', answer: ssr, tol: 0, unit: '', hint: 'SST − SSE = ' + sst + ' − ' + sse },
            { key: 'r2', label: 'Coefficient of determination R²', answer: r2v, tol: 0.01, unit: '', hint: 'SSR ÷ SST' },
            { key: 'se2', label: 'Error variance s²ₑ', answer: se2, tol: 0.05, unit: '', hint: 'SSE ÷ (n − 2) = ' + sse + ' ÷ ' + (p.n - 2) }
          ],
          solution: [
            'SSR = ' + sst + ' − ' + sse + ' = ' + ssr + ';   R² = ' + ssr + ' ÷ ' + sst + ' = ' + r2(r2v) + '.',
            's²ₑ = ' + sse + ' ÷ ' + (p.n - 2) + ' = ' + r2(se2) + '.'
          ]
        };
      },
      solution: ['Pritisni „New numbers" za nove ukupne vrijednosti. SSR = SST − SSE; R² = SSR ÷ SST; s²ₑ = SSE ÷ (n − 2).']
    },

    // --- RANDOMIZED: prediction from a fitted line ----------------------------
    {
      id: 't9-predict-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'numeric',
      title: 'Predikcija — Vježba',
      prompt: 'Upotrijebi procijenjeni pravac regresije za predikciju i interpretaciju.',
      difficulty: 1,
      params: {
        b0: { choices: [2, 5, 10] },
        b1: { choices: [0.5, 1.5, 2.5, 3] },
        x: { choices: [4, 6, 10] }
      },
      generate(p) {
        const yhat = p.b0 + p.b1 * p.x;
        const r2 = (v) => Math.round(v * 100) / 100;
        return {
          prompt: 'A fitted regression line is ŷ = ' + p.b0 + ' + ' + p.b1 + 'x. Predict ŷ at x = ' + p.x + ', and state '
            + 'the change in average Y for a one-unit increase in X. Round to 2 decimals.',
          fields: [
            { key: 'yhat', label: 'Prediction ŷ at x = ' + p.x, answer: yhat, tol: 0.05, unit: '', hint: '' + p.b0 + ' + ' + p.b1 + ' × ' + p.x },
            { key: 'change', label: 'Change in Y per +1 in X', answer: p.b1, tol: 0.05, unit: '', hint: 'The slope b₁' }
          ],
          solution: [
            'ŷ(' + p.x + ') = ' + p.b0 + ' + ' + p.b1 + ' × ' + p.x + ' = ' + r2(yhat) + '.',
            'The slope b₁ = ' + p.b1 + ' is the change in average Y per one-unit increase in X.'
          ]
        };
      },
      solution: ['Pritisni „New numbers" za nove vrijednosti. ŷ = b₀ + b₁x; nagib b₁ predstavlja promjenu aritmetičke sredine Y po povećanju X za jednu jedinicu.']
    }
  ]
};

if (typeof window !== 'undefined') window.statisticsHrExercises = statisticsHrExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = statisticsHrExercises;
