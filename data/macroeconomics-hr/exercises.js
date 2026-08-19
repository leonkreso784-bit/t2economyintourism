// ===== MAKROEKONOMIJA (HR) — VJEŽBE (content pack) =====
//
// HR verzija: prevedena su ISKLJUČIVO string-polja (title/prompt/q/options/solution/label/hint)
// + meta.lang. `generate()`, `params`, `answer`, `type`, `tol`, `difficulty` i sva logika su
// NEDIRNUTI — matematika je bit-identična engleskom izvorniku (pravilo S5, TEAM.md §9).
// ⚠️ POSLJEDICA: 24 randomizirane vježbe imaju tekst UNUTAR generate() (prompt/label/hint/
// solution koji se sastavljaju iz brojeva) — taj dio OSTAJE NA ENGLESKOM jer generate() se ne dira.
// Naslov, uvodni prompt i statički solution tih vježbi JESU prevedeni.
//
// ===== izvorni engleski komentar slijedi =====
//
// CONTENT PACK (NOT the engine): all domain data for interactive, auto-graded
// macroeconomics exercises. The generic engine (js/exercises-core.js, js/exercises.js,
// css/exercises.css) contains NOTHING from here — see docs/architecture/EXERCISES_ENGINE.md §2
// (schema/types) + §3 (conventions). Reusable engine proven by Accounting (41) and
// Statistics (56); see [[accounting-exercises-engine]] / [[statistics-exercises-plan]].
//
// Types macro will use: numeric / choice / ratio (NOT journal/classify/statement).
// Macro math is ELEMENTARY ALGEBRA (multipliers, GDP deflator, natural rate, open
// multiplier, Fisher) → computed INLINE in generate(p); no stat-lib-style library is
// expected (unlike Statistics' normalCdf). If a shared/hard helper ever emerges, add a
// data-layer lib (e.g. data/macroeconomics/macro-lib.js) — YAGNI until then.
//
// ⚠ CACHE: on any change bump CONTENT_VERSION in js/content-loader.js (data/* is immutable).
//
// SEAM (this commit): SKELETON — empty list. The "Exercises" tab appears (empty state);
// content is authored later, topic by topic (Track B), with the same verify methodology
// as Statistics: independent recompute + brute-force grade-correct + discrimination.
// meta.currency = '' (macro answers are rates/ratios/indices, not a single currency).

const macroeconomicsHrExercises = {
  meta: { lang: 'hr', currency: '', version: 1 },
  exercises: [
    // ============================================================================
    // B1 — FUNDAMENTALS + UNEMPLOYMENT & INFLATION (first-midterm)
    //   chapter 1 = fundamentals/objectives/policy/horizons; chapter 2 = unemployment,
    //   inflation, real vs nominal interest, Okun/Phillips.
    //   Concepts (choice) + computation (numeric/ratio) + 2 randomized drills.
    //   Conventions: rates entered as PERCENT (e.g. 5 for 5%), 1 dp, tol 0.1; counts tol 0.
    // ============================================================================

    // --- Concepts: fundamentals + unemployment & inflation (TF + MC) ----------
    {
      id: 'b1-concepts',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Osnove i inflacija — Pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Makroekonomija proučava gospodarstvo kao cjelinu (ukupna proizvodnja, zaposlenost, cijene, trgovina).', kind: 'tf', answer: true },
        { q: 'U kratkom roku BDP je uglavnom određen agregatnom potražnjom.', kind: 'tf', answer: true },
        { q: 'Deflacija je trajni rast opće razine cijena.', kind: 'tf', answer: false },
        { q: 'Realna kamatna stopa je približno jednaka nominalnoj stopi umanjenoj za očekivanu inflaciju.', kind: 'tf', answer: true },
        { q: 'Studenti koji studiraju s punim radnim vremenom i ne traže posao ubrajaju se u radnu snagu.', kind: 'tf', answer: false },
        { q: 'Prema Phillipsovoj krivulji, niža nezaposlenost povezana je s višom stopom inflacije.', kind: 'tf', answer: true },
        { q: 'Okunov zakon povezuje stopu inflacije s novčanom ponudom.', kind: 'tf', answer: false },
        { q: 'Koja od sljedećih NIJE jedna od četiri glavne makroekonomske varijable?', kind: 'mc', options: ['BDP', 'Stopa nezaposlenosti', 'Granična sklonost potrošnji', 'Stopa inflacije'], answer: 2 },
        { q: 'Povećanje novčane ponude i snižavanje kamatnih stopa jest:', kind: 'mc', options: ['Restriktivna monetarna politika', 'Ekspanzivna monetarna politika', 'Dohodovna politika', 'Trgovinska politika'], answer: 1 },
        { q: 'Opća razina cijena mjeri se:', kind: 'mc', options: ['BDP-om po stanovniku', 'CPI-jem (indeksom potrošačkih cijena)', 'Stopom nezaposlenosti', 'Tečajem'], answer: 1 }
      ],
      solution: [
        'Deflacija je trajni PAD razine cijena (negativna stopa inflacije); trajni rast je inflacija.',
        'Studenti, kućanstvenici i umirovljenici koji ne traže posao nalaze se IZVAN radne snage (nisu ni zaposleni ni nezaposleni).',
        'Okunov zakon povezuje rast OUTPUTA s NEZAPOSLENOŠĆU; Phillipsova krivulja je ta koja uključuje inflaciju.'
      ]
    },

    // --- Concepts: policy direction + the three horizons (TF + MC) ------------
    {
      id: 'b1-policy-horizons',
      lesson: 'first-midterm',
      chapter: 1,
      type: 'choice',
      title: 'Ekonomska politika i tri vremenska horizonta',
      prompt: 'Razvrstaj svaku tvrdnju o politici i vremenskom horizontu kao točnu ili netočnu, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Povećanje javne potrošnje (G) ekspanzivna je fiskalna mjera.', kind: 'tf', answer: true },
        { q: 'Prodaja obveznica od strane središnje banke ekspanzivna je mjera.', kind: 'tf', answer: false },
        { q: 'Smanjenje poreza ekspanzivna je fiskalna mjera.', kind: 'tf', answer: true },
        { q: 'Podizanje kamatne stope središnje banke restriktivna je mjera.', kind: 'tf', answer: true },
        { q: 'Kontrola plaća i cijena instrument je monetarne politike.', kind: 'tf', answer: false },
        { q: 'U SREDNJEM roku, output je određen uglavnom:', kind: 'mc', options: ['Agregatnom potražnjom', 'Čimbenicima ponude (kapital, tehnologija, radna snaga)', 'Novčanom ponudom', 'Carinama'], answer: 1 },
        { q: 'U DUGOM roku, rast ovisi uglavnom o:', kind: 'mc', options: ['Potražnji', 'Inovacijama, štednji i institucijama', 'Tečaju', 'Stopi inflacije'], answer: 1 },
        { q: 'Istovremeno smanjenje poreza i povećanje potrošnje jest:', kind: 'mc', options: ['Restriktivna fiskalna politika', 'Ekspanzivna fiskalna politika', 'Monetarna politika', 'Dohodovna politika'], answer: 1 }
      ],
      solution: [
        'Ekspanzivne mjere potiču aktivnost: viša G, niža T, više novca, niže stope. Restriktivne mjere čine suprotno.',
        'Prodaja obveznica odlijeva novac iz gospodarstva → kontrakcijska; podizanje stopa također je restriktivno.',
        'Kontrola plaća/cijena DOHODOVNA je politika, a ne monetarna politika.'
      ]
    },

    // --- Unemployment rate from employment & unemployment (numeric, fixed) ----
    {
      id: 'b1-unemp-fixed',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Radna snaga i stopa nezaposlenosti',
      prompt: 'Neka zemlja ima 190 milijuna zaposlenih i 10 milijuna nezaposlenih. Izračunaj radnu snagu (u milijunima),'
        + 'the unemployment rate (%) and the employment rate (%). Round rates to 1 decimal place.',
      difficulty: 1,
      fields: [
        { key: 'L', label: 'Radna snaga (milijuni)', answer: 200, tol: 0, unit: 'm', hint: 'L = E + U = 190 + 10' },
        { key: 'u', label: 'Stopa nezaposlenosti', answer: 5, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100 = (10 ÷ 200) × 100' },
        { key: 'e', label: 'Stopa zaposlenosti', answer: 95, tol: 0.1, unit: '%', hint: '(E ÷ L) × 100 = (190 ÷ 200) × 100' }
      ],
      solution: [
        'Radna snaga L = E + U = 190 + 10 = 200 milijuna.',
        'Stopa nezaposlenosti = (U ÷ L) × 100 = (10 ÷ 200) × 100 = 5,0%.',
        'Stopa zaposlenosti = (E ÷ L) × 100 = (190 ÷ 200) × 100 = 95,0%.'
      ]
    },

    // --- Real interest rate (numeric, fixed) ----------------------------------
    {
      id: 'b1-real-rate-fixed',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Realna kamatna stopa',
      prompt: 'Nominalna kamatna stopa iznosi 8%, a (očekivana) stopa inflacije iznosi 3%. Izračunaj realnu kamatnu stopu (%).',
      difficulty: 1,
      fields: [
        { key: 'r', label: 'Realna kamatna stopa', answer: 5, tol: 0.1, unit: '%', hint: 'realna ≈ nominalna − inflacija = 8 − 3' }
      ],
      solution: [
        'Realna kamatna stopa ≈ nominalna stopa − stopa inflacije = 8% − 3% = 5%.',
        'Interpretacija: novac je porastao 8%, ali su cijene porasle 3%, pa je kupovna moć porasla za oko 5%.'
      ]
    },

    // --- Participation & unemployment rate (ratio, given) ---------------------
    {
      id: 'b1-participation-ratio',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'ratio',
      title: 'Stopa participacije i stopa nezaposlenosti',
      prompt: 'Koristeći podatke o tržištu rada u nastavku (u milijunima), izračunaj radnu snagu, stopu participacije (%)'
        + 'and the unemployment rate (%). Round rates to 1 decimal place.',
      difficulty: 2,
      givens: [
        { label: 'Radno sposobno stanovništvo', value: 375 },
        { label: 'Zaposleni (E)', value: 285 },
        { label: 'Nezaposleni (U)', value: 15 }
      ],
      fields: [
        { key: 'L', label: 'Radna snaga (milijuni)', answer: 300, tol: 0, unit: 'm', hint: 'L = E + U = 285 + 15' },
        { key: 'part', label: 'Stopa participacije', answer: 80, tol: 0.1, unit: '%', hint: '(L ÷ radno sposobno stanovništvo) × 100 = (300 ÷ 375) × 100' },
        { key: 'u', label: 'Stopa nezaposlenosti', answer: 5, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100 = (15 ÷ 300) × 100' }
      ],
      solution: [
        'Radna snaga L = E + U = 285 + 15 = 300 milijuna.',
        'Stopa participacije = (L ÷ radno sposobno stanovništvo) × 100 = (300 ÷ 375) × 100 = 80,0%.',
        'Stopa nezaposlenosti = (U ÷ L) × 100 = (15 ÷ 300) × 100 = 5,0%.'
      ]
    },

    // --- RANDOMIZED: unemployment & employment rate ---------------------------
    {
      id: 'b1-unemp-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Stopa nezaposlenosti — vježba',
      prompt: 'Na temelju broja zaposlenih i nezaposlenih, izračunaj radnu snagu, stopu nezaposlenosti i stopu zaposlenosti.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { E: 190, U: 10 },
          { E: 230, U: 20 },
          { E: 282, U: 18 },
          { E: 144, U: 6 },
          { E: 216, U: 24 }
        ] }
      },
      generate(p) {
        const E = p.pair.E, U = p.pair.U;
        const L = E + U;
        const u = (U / L) * 100;
        const e = (E / L) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A country has ' + E + ' million employed and ' + U + ' million unemployed. Compute the labour force '
            + '(millions), the unemployment rate (%) and the employment rate (%). Round rates to 1 decimal place.',
          fields: [
            { key: 'L', label: 'Labour force (millions)', answer: L, tol: 0, unit: 'm', hint: 'L = E + U = ' + E + ' + ' + U },
            { key: 'u', label: 'Unemployment rate', answer: u, tol: 0.1, unit: '%', hint: '(U ÷ L) × 100' },
            { key: 'e', label: 'Employment rate', answer: e, tol: 0.1, unit: '%', hint: '(E ÷ L) × 100' }
          ],
          solution: [
            'Labour force L = E + U = ' + E + ' + ' + U + ' = ' + L + ' million.',
            'Unemployment rate = (' + U + ' ÷ ' + L + ') × 100 = ' + r1(u) + '%.',
            'Employment rate = (' + E + ' ÷ ' + L + ') × 100 = ' + r1(e) + '%.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove podatke. L = E + U; stopa nezaposlenosti = U ÷ L × 100; stopa zaposlenosti = E ÷ L × 100.']
    },

    // --- RANDOMIZED: real interest rate ---------------------------------------
    {
      id: 'b1-real-rate-random',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'numeric',
      title: 'Realna kamatna stopa — vježba',
      prompt: 'Izračunaj realnu kamatnu stopu na temelju nominalne stope i stope inflacije.',
      difficulty: 1,
      params: {
        i: { choices: [5, 6, 7, 8, 9, 10] },
        pi: { choices: [1, 2, 3, 4] }
      },
      generate(p) {
        const r = p.i - p.pi;
        return {
          prompt: 'The nominal interest rate is ' + p.i + '% and the (expected) inflation rate is ' + p.pi
            + '%. Compute the real interest rate (%).',
          fields: [
            { key: 'r', label: 'Real interest rate', answer: r, tol: 0.1, unit: '%', hint: 'real ≈ nominal − inflation = ' + p.i + ' − ' + p.pi }
          ],
          solution: ['Real interest rate ≈ nominal − inflation = ' + p.i + '% − ' + p.pi + '% = ' + r + '%.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Realna kamatna stopa ≈ nominalna stopa − (očekivana) stopa inflacije.']
    },

    // ============================================================================
    // B2 — GDP MEASUREMENT (first-midterm), chapter 3
    //   Real GDP via deflator, growth rate, GDP per capita, nominal from real.
    //   Conventions: GDP/output 1 dp tol 0.5; growth rate % 1 dp tol 0.1; per capita tol 0.
    // ============================================================================

    // --- Concepts: GDP definitions, nominal/real, gap (TF + MC) ---------------
    {
      id: 'b2-concepts',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'choice',
      title: 'Mjerenje BDP-a — pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'BDP uključuje samo finalna dobra i usluge, a ne intermedijarna.', kind: 'tf', answer: true },
        { q: 'Strano poduzeće koje proizvodi unutar Hrvatske pridonosi hrvatskom BDP-u.', kind: 'tf', answer: true },
        { q: 'Ako cijene rastu tijekom godine, realni BDP je veći od nominalnog BDP-a.', kind: 'tf', answer: false },
        { q: 'Potencijalni BDP je maksimalna proizvodnja koju gospodarstvo može ostvariti uz stabilne cijene.', kind: 'tf', answer: true },
        { q: 'Recesijski BDP jaz znači da gospodarstvo proizvodi više od svog potencijala.', kind: 'tf', answer: false },
        { q: 'Recesija se definira kao najmanje dva uzastopna kvartala negativnog rasta.', kind: 'tf', answer: true },
        { q: 'Realni BDP mjeri se po:', kind: 'mc', options: ['Tekućim cijenama', 'Stalnim cijenama', 'Budućim cijenama', 'Cijenama crnog tržišta'], answer: 1 },
        { q: 'Najbolja mjera prosječnog životnog standarda je:', kind: 'mc', options: ['Nominalni BDP', 'BDP po stanovniku', 'Ukupni izvoz', 'CPI (indeks potrošačkih cijena)'], answer: 1 },
        { q: 'Mjera outputa koja prati VLASNIŠTVO (faktori gdje god se nalazili) je:', kind: 'mc', options: ['BDP', 'BNP', 'CPI (indeks potrošačkih cijena)', 'Neto izvoz'], answer: 1 }
      ],
      solution: [
        'Kada cijene rastu, realni BDP je MANJI od nominalnog BDP-a (rast cijena uvećava nominalni iznos).',
        'Recesijski BDP jaz = proizvodnja MANJA od potencijala (neiskorišteni resursi); inflacijski BDP jaz = više od potencijala.',
        'BDP je geografski (unutar granica); BNP prati vlasništvo nad faktorima proizvodnje.'
      ]
    },

    // --- Real GDP from nominal via the deflator (numeric, fixed) --------------
    {
      id: 'b2-realgdp-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Realni BDP iz nominalnog BDP-a',
      prompt: 'Nominalni BDP iznosi 325 (milijardi EUR), a indeks cijena je 130 (bazna godina = 100). Izračunajte realni BDP (milijarde EUR).',
      difficulty: 1,
      fields: [
        { key: 'real', label: 'Realni BDP (milijarde)', answer: 250, tol: 0.5, unit: '', hint: 'Realni = Nominalni × (CPI_base ÷ CPI_n) = 325 × (100 ÷ 130)' }
      ],
      solution: [
        'Realni BDP = Nominalni BDP × (CPI_base ÷ CPI_n) = 325 × (100 ÷ 130) = 250.',
        'Iako je nominalni output 325, u stalnim cijenama iznosi samo 250 — ostatak je bio porast cijena.'
      ]
    },

    // --- Real GDP growth rate (numeric, fixed) --------------------------------
    {
      id: 'b2-growth-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Stopa rasta realnog BDP-a',
      prompt: 'Realni BDP porastao je s 250 (prošla godina) na 275 (ova godina). Izračunajte stopu rasta (%). Zaokružite na 1 decimalno mjesto.',
      difficulty: 1,
      fields: [
        { key: 'g', label: 'Stopa rasta', answer: 10, tol: 0.1, unit: '%', hint: '(Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100 = (275 − 250) ÷ 250 × 100' }
      ],
      solution: [
        'Stopa rasta = (Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100 = (275 − 250) ÷ 250 × 100 = 10,0%.',
        'Pozitivna stopa rasta = ekspanzija; negativna stopa rasta = kontrakcija (recesija ako traje dva kvartala).'
      ]
    },

    // --- GDP per capita (numeric, fixed) --------------------------------------
    {
      id: 'b2-percapita-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'BDP po stanovniku',
      prompt: 'Zemlja ima realni BDP od 900 milijardi EUR i stanovništvo od 45 milijuna. Izračunajte BDP po stanovniku (EUR).',
      difficulty: 1,
      fields: [
        { key: 'pc', label: 'BDP po stanovniku (EUR)', answer: 20000, tol: 0, unit: 'EUR', hint: 'BDP ÷ stanovništvo = 900 milijardi ÷ 45 milijuna' }
      ],
      solution: [
        'BDP po stanovniku = realni BDP ÷ stanovništvo = 900 milijardi ÷ 45 milijuna = 20.000 EUR.',
        'BDP po stanovniku — a ne ukupni BDP — standardno je mjerilo prosječnog životnog standarda.'
      ]
    },

    // --- Nominal GDP from real (numeric, fixed) -------------------------------
    {
      id: 'b2-nominal-fixed',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Nominalni BDP iz realnog',
      prompt: 'Realni BDP iznosi 250 (milijardi EUR), a BDP deflator (indeks cijena) iznosi 130 (bazna godina = 100).'
        + 'Compute nominal GDP (billion EUR).',
      difficulty: 2,
      fields: [
        { key: 'nom', label: 'Nominalni BDP (milijarde)', answer: 325, tol: 0.5, unit: '', hint: 'Nominalni = Realni × (deflator ÷ 100) = 250 × (130 ÷ 100)' }
      ],
      solution: [
        'Nominalni = Realni × deflator ÷ 100 = 250 × 130 ÷ 100 = 325.',
        'Ovo je samo preuredeni odnos deflatora: Nominalni = Realni × deflator.'
      ]
    },

    // --- RANDOMIZED: real GDP from nominal -------------------------------------
    {
      id: 'b2-realgdp-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Realni BDP — vježba',
      prompt: 'Izračunajte realni BDP iz nominalnog BDP-a i indeksa cijena.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { nom: 325, cpi: 130 },
          { nom: 480, cpi: 120 },
          { nom: 550, cpi: 110 },
          { nom: 360, cpi: 120 },
          { nom: 420, cpi: 105 }
        ] }
      },
      generate(p) {
        const nom = p.pair.nom, cpi = p.pair.cpi;
        const real = nom * 100 / cpi;
        return {
          prompt: 'Nominal GDP is ' + nom + ' (billion EUR) and the price index is ' + cpi
            + ' (base year = 100). Compute real GDP (billion EUR).',
          fields: [
            { key: 'real', label: 'Real GDP (billion)', answer: real, tol: 0.5, unit: '', hint: 'Real = Nominal × (100 ÷ CPI) = ' + nom + ' × (100 ÷ ' + cpi + ')' }
          ],
          solution: ['Real GDP = ' + nom + ' × (100 ÷ ' + cpi + ') = ' + real + '.']
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. Realni BDP = Nominalni BDP × (100 ÷ indeks cijena).']
    },

    // --- RANDOMIZED: GDP growth rate (incl. recessions) -----------------------
    {
      id: 'b2-growth-random',
      lesson: 'first-midterm',
      chapter: 3,
      type: 'numeric',
      title: 'Stopa rasta — vježba',
      prompt: 'Izračunajte stopu rasta realnog BDP-a između dviju godina.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { y1: 200, y2: 220 },
          { y1: 250, y2: 240 },
          { y1: 300, y2: 312 },
          { y1: 400, y2: 380 },
          { y1: 150, y2: 165 }
        ] }
      },
      generate(p) {
        const y1 = p.pair.y1, y2 = p.pair.y2;
        const g = (y2 - y1) / y1 * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Real GDP changed from ' + y1 + ' (last year) to ' + y2 + ' (this year). Compute the growth '
            + 'rate (%). Round to 1 decimal place (a fall is negative).',
          fields: [
            { key: 'g', label: 'Growth rate', answer: g, tol: 0.1, unit: '%', hint: '(' + y2 + ' − ' + y1 + ') ÷ ' + y1 + ' × 100' }
          ],
          solution: ['Growth rate = (' + y2 + ' − ' + y1 + ') ÷ ' + y1 + ' × 100 = ' + r1(g) + '%.'
            + (g < 0 ? ' A negative rate means the economy contracted.' : '')]
        };
      },
      solution: ['Pritisnite „Novi brojevi" za nove vrijednosti. Stopa rasta = (Yₜ − Yₜ₋₁) ÷ Yₜ₋₁ × 100; pad je negativan.']
    },

    // ============================================================================
    // B3 — NATIONAL ACCOUNTS (first-midterm), chapter 4
    //   Expenditure identity Y = C + I + G + (X − IM); missing component; value added.
    //   All answers are integers (tol 0). Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: approaches, identity, value added, sectors (TF + MC) -------
    {
      id: 'b3-concepts',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'Nacionalni računi — pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Proizvodni, rashodovni i dohodovni pristup BDP-u daju jednaku vrijednost.', kind: 'tf', answer: true },
        { q: 'Neto izvoz jednak je izvozu minus uvoz.', kind: 'tf', answer: true },
        { q: 'Dodana vrijednost jednaka je bruto vrijednosti proizvodnje minus intermedijarna potrošnja.', kind: 'tf', answer: true },
        { q: 'Intermedijarna potrošnja izravno se uračunava u BDP.', kind: 'tf', answer: false },
        { q: 'U NACE klasifikaciji, turizam je jedan zasebni sektor.', kind: 'tf', answer: false },
        { q: 'U identitetu S − I = (G + TR − T) + NX, izraz (G + TR − T) predstavlja deficit državnog proračuna.', kind: 'tf', answer: true },
        { q: 'Trosektorski model BDP-a je:', kind: 'mc', options: ['Y = C', 'Y = C + I', 'Y = C + I + G', 'Y = C + I + G + NX'], answer: 2 },
        { q: 'Rashodovni pristup BDP-u je:', kind: 'mc', options: ['Y = C + I + G + (X − IM)', 'Y = plaće + profiti + rente', 'Y = zbroj dodane vrijednosti', 'Y = S + T'], answer: 0 },
        { q: 'U makroekonomskim simbolima, TR označava:', kind: 'mc', options: ['Poreze', 'Transfere', 'Trgovinu', 'Ukupne prihode'], answer: 1 }
      ],
      solution: [
        'Intermedijarna potrošnja NE uračunava se izravno — uzima se samo finalni output (dodana vrijednost izbjegava dvostruko računanje).',
        'Turizam nije zasebna NACE djelatnost/sektor; obuhvaća mnoge djelatnosti (otuda satelitski račun).',
        '(G + TR − T) je deficit proračuna: potrošnja plus transferi minus porezi.'
      ]
    },

    // --- GDP from expenditure components (numeric, fixed) ---------------------
    {
      id: 'b3-gdp-fixed',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'BDP prema rashodovnom pristupu',
      prompt: 'Gospodarstvo ima C = 600, I = 150, G = 200, izvoz X = 80 i uvoz IM = 100. Izračunaj neto izvoz (NX) i BDP (Y).',
      difficulty: 1,
      fields: [
        { key: 'nx', label: 'Neto izvoz (NX)', answer: -20, tol: 0, unit: '', hint: 'NX = X − IM = 80 − 100' },
        { key: 'y', label: 'BDP (Y)', answer: 930, tol: 0, unit: '', hint: 'Y = C + I + G + NX = 600 + 150 + 200 + (−20)' }
      ],
      solution: [
        'NX = X − IM = 80 − 100 = −20 (trgovinski deficit).',
        'Y = C + I + G + NX = 600 + 150 + 200 − 20 = 930.'
      ]
    },

    // --- Missing expenditure component (numeric, fixed) -----------------------
    {
      id: 'b3-missing-fixed',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Pronađi nedostajuću komponentu',
      prompt: 'BDP je Y = 1000 uz C = 600, I = 150 i neto izvoz NX = 50. Izračunaj javnu potrošnju G.',
      difficulty: 2,
      fields: [
        { key: 'g', label: 'Javna potrošnja (G)', answer: 200, tol: 0, unit: '', hint: 'G = Y − C − I − NX = 1000 − 600 − 150 − 50' }
      ],
      solution: [
        'Preuredimo Y = C + I + G + NX → G = Y − C − I − NX = 1000 − 600 − 150 − 50 = 200.'
      ]
    },

    // --- Value added (ratio, given) -------------------------------------------
    {
      id: 'b3-valueadded-ratio',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'ratio',
      title: 'Dodana vrijednost',
      prompt: 'Koristeći podatke o proizvodnji u nastavku, izračunaj dodanu vrijednost.',
      difficulty: 1,
      givens: [
        { label: 'Bruto vrijednost proizvodnje', value: 500 },
        { label: 'Međupotrošnja', value: 180 }
      ],
      fields: [
        { key: 'va', label: 'Dodana vrijednost', answer: 320, tol: 0, unit: '', hint: 'Bruto vrijednost − međupotrošnja = 500 − 180' }
      ],
      solution: [
        'Dodana vrijednost = bruto vrijednost proizvodnje − međupotrošnja = 500 − 180 = 320.',
        'Zbrajanjem dodane vrijednosti svih djelatnosti (uz izbjegavanje dvostrukog brojanja) dobiva se BDP proizvodnom metodom.'
      ]
    },

    // --- RANDOMIZED: GDP from components --------------------------------------
    {
      id: 'b3-gdp-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'BDP rashodnom metodom — vježba',
      prompt: 'Izračunaj neto izvoz i BDP iz rashodnih komponenti.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { C: 600, I: 150, G: 200, X: 80, IM: 100 },
          { C: 500, I: 120, G: 180, X: 120, IM: 90 },
          { C: 700, I: 200, G: 250, X: 150, IM: 160 },
          { C: 550, I: 100, G: 150, X: 100, IM: 70 },
          { C: 640, I: 160, G: 220, X: 90, IM: 110 }
        ] }
      },
      generate(p) {
        const C = p.pair.C, I = p.pair.I, G = p.pair.G, X = p.pair.X, IM = p.pair.IM;
        const nx = X - IM;
        const y = C + I + G + nx;
        return {
          prompt: 'An economy has C = ' + C + ', I = ' + I + ', G = ' + G + ', exports X = ' + X
            + ' and imports IM = ' + IM + '. Compute net exports (NX) and GDP (Y).',
          fields: [
            { key: 'nx', label: 'Net exports (NX)', answer: nx, tol: 0, unit: '', hint: 'NX = X − IM = ' + X + ' − ' + IM },
            { key: 'y', label: 'GDP (Y)', answer: y, tol: 0, unit: '', hint: 'Y = C + I + G + NX' }
          ],
          solution: [
            'NX = X − IM = ' + X + ' − ' + IM + ' = ' + nx + '.',
            'Y = C + I + G + NX = ' + C + ' + ' + I + ' + ' + G + ' + (' + nx + ') = ' + y + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. NX = X − IM; Y = C + I + G + NX.']
    },

    // --- RANDOMIZED: missing component ----------------------------------------
    {
      id: 'b3-missing-random',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'numeric',
      title: 'Nedostajuća komponenta — vježba',
      prompt: 'Na temelju BDP-a i triju komponenti, odredi javnu potrošnju G.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y: 1000, C: 600, I: 150, NX: 50 },
          { Y: 900, C: 550, I: 120, NX: -30 },
          { Y: 1200, C: 700, I: 250, NX: -50 },
          { Y: 850, C: 500, I: 200, NX: 0 },
          { Y: 1100, C: 650, I: 180, NX: 20 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, C = p.pair.C, I = p.pair.I, NX = p.pair.NX;
        const g = Y - C - I - NX;
        return {
          prompt: 'GDP is Y = ' + Y + ' with C = ' + C + ', I = ' + I + ' and net exports NX = ' + NX
            + '. Compute government spending G.',
          fields: [
            { key: 'g', label: 'Government spending (G)', answer: g, tol: 0, unit: '', hint: 'G = Y − C − I − NX' }
          ],
          solution: ['G = Y − C − I − NX = ' + Y + ' − ' + C + ' − ' + I + ' − (' + NX + ') = ' + g + '.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Iz Y = C + I + G + NX slijedi G = Y − C − I − NX.']
    },

    // ============================================================================
    // B4 — THE GOODS MARKET (first-midterm), chapter 5
    //   Multiplier 1/(1−c₁); equilibrium Y = 1/(1−c₁)·[c₀ + I + G − c₁T];
    //   ΔY = multiplier·ΔG; tax multiplier −c₁/(1−c₁), ΔY = (−c₁/(1−c₁))·ΔT.
    //   Clean c₁ ∈ {0.5,0.6,0.75,0.8} → multipliers 2/2.5/4/5 and integer Y.
    //   Conventions: multiplier 2 dp tol 0.05; output Y tol 0.5; ΔY tol 0.5.
    //   Randomized generate() reads p.pair.* (B2 lesson — pickParams stores the chosen object under the key).
    // ============================================================================

    // --- Concepts: equilibrium, multiplier, autonomous spending, taxes (TF + MC)
    {
      id: 'b4-concepts',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'Tržište dobara — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Ravnoteža na tržištu dobara zahtijeva da je proizvodnja Y jednaka potražnji za dobrima Z.', kind: 'tf', answer: true },
        { q: 'Multiplikator 1/(1−c₁) veći je od 1 jer je 0 < c₁ < 1.', kind: 'tf', answer: true },
        { q: 'Viša granična sklonost potrošnji čini multiplikator manjim.', kind: 'tf', answer: false },
        { q: 'Povećanje poreza (T) povećava ravnotežnu proizvodnju.', kind: 'tf', answer: false },
        { q: 'Autonomna potrošnja je dio potražnje koji ne ovisi o tekućem dohotku.', kind: 'tf', answer: true },
        { q: 'Porezni multiplikator po apsolutnoj je vrijednosti manji od multiplikatora javne potrošnje.', kind: 'tf', answer: true },
        { q: 'Ako je c₁ = 0,8, multiplikator 1/(1−c₁) iznosi:', kind: 'mc', options: ['2', '4', '5', '8'], answer: 2 },
        { q: 'Uz multiplikator od 4, povećanje G za 100 povećava ravnotežni output za:', kind: 'mc', options: ['40', '100', '250', '400'], answer: 3 },
        { q: 'U Y = 1/(1−c₁)·[c₀ + I + G − c₁T], izraz u uglatoj zagradi jest:', kind: 'mc', options: ['Multiplikator', 'Autonomna potrošnja', 'Raspoloživi dohodak', 'Neto porezi'], answer: 1 }
      ],
      solution: [
        'VIŠA granična sklonost potrošnji čini multiplikator VEĆIM: veći dio svakoga dodatnog eura se troši, pa 1/(1−c₁) raste.',
        'Viši porezi smanjuju raspoloživi dohodak i potrošnju, pa SMANJUJU ravnotežni output (porezni multiplikator je negativan).',
        'Javna potrošnja djeluje na multiplikator u punom iznosu (1/(1−c₁)); porezi djeluju kroz −c₁/(1−c₁), što je manji učinak jer je c₁ < 1.'
      ]
    },

    // --- Multiplier from the MPC (numeric, fixed) -----------------------------
    {
      id: 'b4-multiplier-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Multiplikator',
      prompt: 'Granična sklonost potrošnji iznosi c₁ = 0.75. Izračunaj multiplikator 1/(1 − c₁). Zaokruži na 2 decimalna mjesta.',
      difficulty: 1,
      fields: [
        { key: 'mult', label: 'Multiplikator', answer: 4, tol: 0.05, unit: '', hint: '1 ÷ (1 − c₁) = 1 ÷ (1 − 0.75) = 1 ÷ 0.25' }
      ],
      solution: [
        'Multiplikator = 1 ÷ (1 − c₁) = 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = 4.',
        'Jednokratni porast autonomne potrošnje za jednu jedinicu u konačnici povećava output za 4 jedinice.'
      ]
    },

    // --- Equilibrium output (numeric, fixed) ----------------------------------
    {
      id: 'b4-equilibrium-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Ravnotežni output',
      prompt: 'Potrošnja je C = 500 + 0.5·Y_D, porezi T = 600, investicije I = 300 i javna potrošnja G = 2000.'
        + 'Compute the multiplier and equilibrium output Y.',
      difficulty: 2,
      fields: [
        { key: 'mult', label: 'Multiplikator', answer: 2, tol: 0.05, unit: '', hint: '1 ÷ (1 − c₁) = 1 ÷ (1 − 0.5)' },
        { key: 'Y', label: 'Ravnotežni output (Y)', answer: 5000, tol: 0.5, unit: '', hint: 'Y = mult × [c₀ + I + G − c₁T] = 2 × [500 + 300 + 2000 − 0.5×600]' }
      ],
      solution: [
        'Multiplikator = 1 ÷ (1 − 0.5) = 2.',
        'Autonomna potrošnja = c₀ + I + G − c₁T = 500 + 300 + 2000 − 0.5×600 = 2800 − 300 = 2500.',
        'Y = multiplikator × autonomna potrošnja = 2 × 2500 = 5000.'
      ]
    },

    // --- Change in output from ΔG (numeric, fixed) ----------------------------
    {
      id: 'b4-deltaY-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Učinak više javne potrošnje',
      prompt: 'Granična sklonost potrošnji iznosi c₁ = 0.75. Javna potrošnja raste za ΔG = 100.'
        + 'Compute the multiplier and the change in equilibrium output ΔY.',
      difficulty: 2,
      fields: [
        { key: 'mult', label: 'Multiplikator', answer: 4, tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.75)' },
        { key: 'dY', label: 'Promjena outputa (ΔY)', answer: 400, tol: 0.5, unit: '', hint: 'ΔY = multiplikator × ΔG = 4 × 100' }
      ],
      solution: [
        'Multiplikator = 1 ÷ (1 − 0.75) = 4.',
        'ΔY = multiplikator × ΔG = 4 × 100 = 400. Potrošnja od 100 povećava output za 400 kroz uzastopne krugove potrošnje.'
      ]
    },

    // --- Tax multiplier (numeric, fixed) --------------------------------------
    {
      id: 'b4-tax-effect-fixed',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Porezni multiplikator',
      prompt: 'Granična sklonost potrošnji iznosi c₁ = 0.75. Porezi rastu za ΔT = 100. Izračunaj porezni multiplikator.'
        + '−c₁/(1 − c₁) and the change in equilibrium output ΔY (a fall is negative).',
      difficulty: 3,
      fields: [
        { key: 'taxmult', label: 'Porezni multiplikator', answer: -3, tol: 0.05, unit: '', hint: '−c₁ ÷ (1 − c₁) = −0.75 ÷ 0.25' },
        { key: 'dY', label: 'Promjena outputa (ΔY)', answer: -300, tol: 0.5, unit: '', hint: 'ΔY = porezni multiplikator × ΔT = −3 × 100' }
      ],
      solution: [
        'Porezni multiplikator = −c₁ ÷ (1 − c₁) = −0.75 ÷ 0.25 = −3.',
        'ΔY = porezni multiplikator × ΔT = −3 × 100 = −300. Viši porezi smanjuju raspoloživi dohodak, potrošnju i output.',
        'Napominjemo da je po apsolutnoj vrijednosti manji od multiplikatora potrošnje (4): porezi djeluju na potražnju isključivo putem potrošnje.'
      ]
    },

    // --- RANDOMIZED: equilibrium output ---------------------------------------
    {
      id: 'b4-equilibrium-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Ravnotežni output — vježba',
      prompt: 'Izračunaj multiplikator i ravnotežni output na temelju funkcije potrošnje i komponenti.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { c1: 0.5, c0: 500, I: 300, G: 2000, T: 600 },
          { c1: 0.6, c0: 400, I: 200, G: 1000, T: 500 },
          { c1: 0.75, c0: 300, I: 400, G: 1200, T: 800 },
          { c1: 0.8, c0: 200, I: 300, G: 900, T: 500 }
        ] }
      },
      generate(p) {
        const c1 = p.pair.c1, c0 = p.pair.c0, I = p.pair.I, G = p.pair.G, T = p.pair.T;
        const mult = 1 / (1 - c1);
        const auto = c0 + I + G - c1 * T;
        const Y = mult * auto;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'Consumption is C = ' + c0 + ' + ' + c1 + '·Y_D, taxes T = ' + T + ', investment I = ' + I
            + ' and government spending G = ' + G + '. Compute the multiplier and equilibrium output Y.',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + c1 + ')' },
            { key: 'Y', label: 'Equilibrium output (Y)', answer: Y, tol: 0.5, unit: '', hint: 'mult × [c₀ + I + G − c₁T]' }
          ],
          solution: [
            'Multiplier = 1 ÷ (1 − ' + c1 + ') = ' + r2(mult) + '.',
            'Autonomous spending = ' + c0 + ' + ' + I + ' + ' + G + ' − ' + c1 + '×' + T + ' = ' + auto + '.',
            'Y = ' + r2(mult) + ' × ' + auto + ' = ' + Y + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Multiplikator = 1/(1−c₁); Y = multiplikator × [c₀ + I + G − c₁T].']
    },

    // --- RANDOMIZED: multiplier and ΔY from ΔG --------------------------------
    {
      id: 'b4-deltaY-random',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'numeric',
      title: 'Učinak multiplikatora — vježba',
      prompt: 'Na temelju granične sklonosti potrošnji i promjene javne potrošnje, izračunaj multiplikator i ΔY.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { c1: 0.5, dG: 100 },
          { c1: 0.6, dG: 200 },
          { c1: 0.75, dG: 100 },
          { c1: 0.8, dG: 50 },
          { c1: 0.75, dG: 200 }
        ] }
      },
      generate(p) {
        const c1 = p.pair.c1, dG = p.pair.dG;
        const mult = 1 / (1 - c1);
        const dY = mult * dG;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'The marginal propensity to consume is c₁ = ' + c1 + '. Government spending rises by ΔG = ' + dG
            + '. Compute the multiplier and the change in equilibrium output ΔY.',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + c1 + ')' },
            { key: 'dY', label: 'Change in output (ΔY)', answer: dY, tol: 0.5, unit: '', hint: 'ΔY = multiplier × ΔG = mult × ' + dG }
          ],
          solution: [
            'Multiplier = 1 ÷ (1 − ' + c1 + ') = ' + r2(mult) + '.',
            'ΔY = multiplier × ΔG = ' + r2(mult) + ' × ' + dG + ' = ' + dY + '.'
          ]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Multiplikator = 1/(1−c₁); ΔY = multiplikator × ΔG.']
    },

    // ============================================================================
    // B5 — FINANCIAL MARKETS (first-midterm), chapter 6
    //   Money demand M = $Y·L(i); equilibrium Mˢ = Mᵈ pins down i; bond yield
    //   i = (100 − P_B)/P_B; open-market operations; income → i (the LM logic).
    //   Linear money demand M = Y(0.4 − i) (i in DECIMAL) → i% = (0.4 − M/Y)·100.
    //   Conventions: interest rate / yield entered as PERCENT, 1 dp, tol 0.1.
    //   Randomized: scalar param P read as p.P; object param read as p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: money demand, equilibrium, bonds (TF + MC) -----------------
    {
      id: 'b5-concepts',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Financijska tržišta — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, a zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Potražnja za novcem raste s nominalnim dohotkom $Y.', kind: 'tf', answer: true },
        { q: 'Potražnja za novcem raste s kamatnom stopom i.', kind: 'tf', answer: false },
        { q: 'Kamatna stopa je oportunitetni trošak držanja novca umjesto obveznica.', kind: 'tf', answer: true },
        { q: 'Cijene obveznica i kamatna stopa kreću se u istom smjeru.', kind: 'tf', answer: false },
        { q: 'Novčanu ponudu određuje središnja banka i ona je neovisna o kamatnoj stopi.', kind: 'tf', answer: true },
        { q: 'Rast dohotka, uz nepromijenjenu novčanu ponudu, povećava ravnotežnu kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Krivulja potražnje za novcem pada prema dolje jer viša kamatna stopa:', kind: 'mc', options: ['Povećava dohodak', 'Povećava oportunitetni trošak držanja novca', 'Povećava novčanu ponudu', 'Trajno snižava cijene obveznica'], answer: 1 },
        { q: 'Za jednogodišnju obveznicu s nominalnom vrijednošću 100, prinos je:', kind: 'mc', options: ['i = P_B / 100', 'i = 100 / P_B', 'i = (100 − P_B) / P_B', 'i = (P_B − 100) / 100'], answer: 2 },
        { q: 'Ravnoteža na tržištu novca postiže se gdje vrijedi:', kind: 'mc', options: ['Mˢ = Mᵈ', 'Y = C + I + G', 'i = inflacija', 'S = I'], answer: 0 }
      ],
      solution: [
        'Potražnja za novcem PADA kad raste i: viša kamatna stopa čini obveznice privlačnijima, pa ljudi drže manje novca.',
        'Cijene obveznica i kamatna stopa kreću se OBRNUTO — viša cijena znači niži prinos (i = (100 − P_B)/P_B).',
        'Viši dohodak povećava potražnju za novcem; uz fiksnu ponudu, ravnotežna kamatna stopa mora porasti (rastuća LM relacija).'
      ]
    },

    // --- Open-market operations: directions (TF + MC) -------------------------
    {
      id: 'b5-directions',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Monetarna politika i operacije na otvorenom tržištu',
      prompt: 'Ocijeni svaku tvrdnju o operacijama središnje banke kao točnu ili netočnu, a zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Kada središnja banka KUPUJE obveznice, cijene obveznica rastu i kamatna stopa pada.', kind: 'tf', answer: true },
        { q: 'Kupnja obveznica povećava novčanu ponudu (ekspanzivna politika).', kind: 'tf', answer: true },
        { q: 'Prodaja obveznica je ekspanzivna monetarna politika.', kind: 'tf', answer: false },
        { q: 'Prodaja obveznica povećava kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Kako bi snizila kamatnu stopu, središnja banka bi trebala:', kind: 'mc', options: ['Prodati obveznice', 'Kupiti obveznice', 'Povećati poreze', 'Smanjiti javnu potrošnju'], answer: 1 },
        { q: 'Restriktivna monetarna politika znači da središnja banka:', kind: 'mc', options: ['Kupuje obveznice i snižava i', 'Prodaje obveznice i podiže i', 'Kupuje obveznice i podiže i', 'Smanjuje poreze'], answer: 1 },
        { q: 'Operacija na otvorenom tržištu KUPNJOM obveznica dovodi do:', kind: 'mc', options: ['Više i, niže Mˢ', 'Niže i, više Mˢ', 'Više i, više Mˢ', 'Nema promjene'], answer: 1 }
      ],
      solution: [
        'Prodaja obveznica odvlači novac iz gospodarstva → restriktivno (cijene obveznica padaju, kamatna stopa raste).',
        'Ekspanzivni lanac: kupnja obveznica → potražnja za obveznicama raste → cijene obveznica rastu → prinos (i) pada → novčana ponuda raste.'
      ]
    },

    // --- Equilibrium interest rate (numeric, fixed) ---------------------------
    {
      id: 'b5-equilibrium-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Ravnotežna kamatna stopa',
      prompt: 'Potražnja za novcem iznosi M = Y(0.4 − i), dohodak Y = 150 i novčana ponuda Mˢ = 50.'
        + 'Compute the equilibrium interest rate i (%). Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'i', label: 'Ravnotežna kamatna stopa', answer: (0.4 - 50 / 150) * 100, tol: 0.1, unit: '%', hint: 'Postavi Mˢ = Mᵈ: 50 = 150(0.4 − i) → i = 0.4 − 50/150, zatim ×100' }
      ],
      solution: [
        'Postavi ponudu = potražnji: 50 = 150 × (0.4 − i).',
        '0.4 − i = 50 ÷ 150 = 0.3333, dakle i = 0.0667 ≈ 6.7%.'
      ]
    },

    // --- Bond yield from price (numeric, fixed) -------------------------------
    {
      id: 'b5-bond-yield-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Prinos obveznice',
      prompt: 'Jednogodišnja obveznica s nominalnom vrijednošću 100 prodaje se po cijeni P_B = 95. Izračunaj njezin prinos i (%).'
        + 'Round to 1 decimal place.',
      difficulty: 1,
      fields: [
        { key: 'i', label: 'Prinos obveznice', answer: (100 - 95) / 95 * 100, tol: 0.1, unit: '%', hint: 'i = (100 − P_B) ÷ P_B = (100 − 95) ÷ 95' }
      ],
      solution: [
        'i = (100 − P_B) ÷ P_B = (100 − 95) ÷ 95 = 5 ÷ 95 = 0.0526 ≈ 5.3%.',
        'Viša cijena značila bi niži prinos — cijene obveznica i kamatna stopa kreću se obrnuto.'
      ]
    },

    // --- Income effect on i (numeric, fixed) ----------------------------------
    {
      id: 'b5-income-effect-fixed',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Dohodak i kamatna stopa',
      prompt: 'Potražnja za novcem iznosi M = Y(0.4 − i), a novčana ponuda fiksirana je na Mˢ = 60.'
        + 'Compute the equilibrium interest rate (%) when income Y = 200 and when Y = 300. Round to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'i1', label: 'Kamatna stopa pri Y = 200', answer: (0.4 - 60 / 200) * 100, tol: 0.1, unit: '%', hint: 'i = (0.4 − 60/200) × 100' },
        { key: 'i2', label: 'Kamatna stopa pri Y = 300', answer: (0.4 - 60 / 300) * 100, tol: 0.1, unit: '%', hint: 'i = (0.4 − 60/300) × 100' }
      ],
      solution: [
        'Pri Y = 200: i = 0.4 − 60/200 = 0.4 − 0.30 = 0.10 → 10.0%.',
        'Pri Y = 300: i = 0.4 − 60/300 = 0.4 − 0.20 = 0.20 → 20.0%.',
        'Viši dohodak povećava potražnju za novcem; uz fiksnu ponudu, ravnotežna kamatna stopa raste (logika LM krivulje).'
      ]
    },

    // --- RANDOMIZED: equilibrium interest rate --------------------------------
    {
      id: 'b5-equilibrium-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Ravnotežna kamatna stopa — vježba',
      prompt: 'Izračunaj ravnotežnu kamatnu stopu iz potražnje za novcem M = Y(0.4 − i), dohotka i novčane ponude.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y: 200, M: 70 },
          { Y: 200, M: 60 },
          { Y: 200, M: 50 },
          { Y: 300, M: 105 },
          { Y: 400, M: 120 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, M = p.pair.M;
        const i = (0.4 - M / Y) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Money demand is M = Y(0.4 − i), income Y = ' + Y + ' and the money supply Mˢ = ' + M
            + '. Compute the equilibrium interest rate i (%). Round to 1 decimal place.',
          fields: [
            { key: 'i', label: 'Equilibrium interest rate', answer: i, tol: 0.1, unit: '%', hint: 'i = (0.4 − ' + M + '/' + Y + ') × 100' }
          ],
          solution: [
            'Set ' + M + ' = ' + Y + '(0.4 − i) → 0.4 − i = ' + M + '/' + Y + ' = ' + r1((M / Y) * 100) / 100 + '.',
            'i = 0.4 − ' + (M / Y) + ' = ' + r1(i) + '%.'
          ]
        };
      },
      solution: ['Pritisni "New numbers" za nove podatke. Iz Mˢ = Y(0.4 − i): i = (0.4 − Mˢ/Y) × 100.']
    },

    // --- RANDOMIZED: bond yield -----------------------------------------------
    {
      id: 'b5-bond-yield-random',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'numeric',
      title: 'Prinos na obveznicu — vježba',
      prompt: 'Izračunaj prinos jednogodišnje obveznice (nominalna vrijednost 100) iz njezine cijene.',
      difficulty: 1,
      params: {
        P: { choices: [95, 90, 80, 96, 98] }
      },
      generate(p) {
        const P = p.P;
        const i = (100 - P) / P * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A one-year bond with a face value of 100 sells for P_B = ' + P + '. Compute its yield i (%). '
            + 'Round to 1 decimal place.',
          fields: [
            { key: 'i', label: 'Bond yield', answer: i, tol: 0.1, unit: '%', hint: 'i = (100 − ' + P + ') ÷ ' + P }
          ],
          solution: ['i = (100 − ' + P + ') ÷ ' + P + ' = ' + (100 - P) + ' ÷ ' + P + ' = ' + r1(i) + '%.']
        };
      },
      solution: ['Pritisni "New numbers" za nove podatke. Prinos na obveznicu i = (100 − P_B) ÷ P_B.']
    },

    // ============================================================================
    // B6 — THE IS-LM MODEL (first-midterm), chapter 7
    //   IS (goods market, downward) + LM (money market, upward); fiscal vs monetary
    //   policy; the policy mix. IS-LM here is QUALITATIVE/comparative-statics (the
    //   Learn gives no closed-form solution), so this brick is choice-based with one
    //   randomized comparative-statics drill (random policy → direction of Y and i).
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: IS / LM curves and their slopes (TF + MC) ------------------
    {
      id: 'b6-concepts',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'IS-LM model — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, a zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'IS krivulja predstavlja ravnotežu na tržištu dobara i pada prema dolje u dijagramu (Y, i).', kind: 'tf', answer: true },
        { q: 'LM krivulja predstavlja ravnotežu na tržištu novca i raste prema gore.', kind: 'tf', answer: true },
        { q: 'IS krivulja pada prema dolje jer viša kamatna stopa smanjuje investicije.', kind: 'tf', answer: true },
        { q: 'LM krivulja raste prema gore jer viši dohodak smanjuje potražnju za novcem.', kind: 'tf', answer: false },
        { q: 'U presjeku IS-LM krivulja, i tržište dobara i tržište novca nalaze se u ravnoteži.', kind: 'tf', answer: true },
        { q: 'IS krivulja predstavlja ravnotežu na:', kind: 'mc', options: ['Tržištu novca', 'Tržištu dobara', 'Tržištu rada', 'Isključivo tržištu obveznica'], answer: 1 },
        { q: 'LM krivulja predstavlja ravnotežu na:', kind: 'mc', options: ['Tržištu dobara', 'Tržištu novca', 'Tržištu rada', 'Deviznom tržištu'], answer: 1 },
        { q: 'IS krivulja pada prema dolje jer viša kamatna stopa:', kind: 'mc', options: ['Povećava investicije', 'Smanjuje investicije, a time i potražnju i output', 'Povećava novčanu ponudu', 'Smanjuje poreze'], answer: 1 }
      ],
      solution: [
        'LM krivulja ima POZITIVAN nagib jer viši dohodak POVEĆAVA potražnju za novcem; uz fiksnu novčanu ponudu, kamatna stopa mora porasti.',
        'IS = ravnoteža na tržištu dobara (negativan nagib); LM = ravnoteža na tržištu novca (pozitivan nagib); njihovo sjecište čisti oba tržišta.'
      ]
    },

    // --- What shifts each curve (TF + MC) -------------------------------------
    {
      id: 'b6-shifts',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Pomicanje IS i LM krivulja',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Povećanje javne potrošnje pomiče IS krivulju udesno.', kind: 'tf', answer: true },
        { q: 'Povećanje poreza pomiče IS krivulju ulijevo.', kind: 'tf', answer: true },
        { q: 'Povećanje novčane ponude pomiče LM krivulju prema dolje (udesno).', kind: 'tf', answer: true },
        { q: 'Pad novčane ponude pomiče LM krivulju prema dolje.', kind: 'tf', answer: false },
        { q: 'Povećanje G pomiče IS krivulju:', kind: 'mc', options: ['Ulijevo', 'Udesno', 'Ne pomiče se', 'Umjesto toga pomiče LM krivulju'], answer: 1 },
        { q: 'Povećanje novčane ponude pomiče LM krivulju:', kind: 'mc', options: ['Gore / ulijevo', 'Dolje / udesno', 'Ne pomiče se', 'Umjesto toga pomiče IS krivulju'], answer: 1 },
        { q: 'Što od navedenog pomiče LM krivulju (a ne IS krivulju)?', kind: 'mc', options: ['Promjena javne potrošnje G', 'Promjena poreza T', 'Promjena novčane ponude', 'Promjena autonomnih investicija'], answer: 2 }
      ],
      solution: [
        'PAD novčane ponude pomiče LM krivulju GORE (ulijevo), podižući kamatnu stopu pri svakoj razini outputa.',
        'Fiskalne varijable (G, T) pomiču IS krivulju; novčana ponuda pomiče LM krivulju.'
      ]
    },

    // --- Fiscal policy effects (TF + MC) --------------------------------------
    {
      id: 'b6-fiscal-effects',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Fiskalna politika u IS-LM modelu',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Fiskalna ekspanzija povećava i output i kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Fiskalna kontrakcija (viši porezi) smanjuje output i snižava kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Smanjenje poreza je kontrakcijsko.', kind: 'tf', answer: false },
        { q: 'Fiskalna ekspanzija (viša G) pomiče gospodarstvo prema:', kind: 'mc', options: ['Višem Y, višoj i', 'Nižem Y, nižoj i', 'Višem Y, nižoj i', 'Bez promjene'], answer: 0 },
        { q: 'Fiskalna kontrakcija (viši T) dovodi do:', kind: 'mc', options: ['Višeg Y i više i', 'Nižeg Y i niže i', 'Nižeg Y, više i', 'Višeg Y, niže i'], answer: 1 },
        { q: 'Viša javna potrošnja podiže kamatnu stopu jer:', kind: 'mc', options: ['Novčana ponuda pada', 'Viši output povećava potražnju za novcem', 'Porezi automatski rastu', 'Cijene padaju'], answer: 1 }
      ],
      solution: [
        'Porezno smanjenje povećava raspoloživi dohodak i potražnju — ono je EKSPANZIVNO (pomiče IS krivulju udesno).',
        'Fiskalna ekspanzija pomiče IS udesno: output raste, a viši output povećava potražnju za novcem, gurajući kamatnu stopu gore.'
      ]
    },

    // --- Monetary policy effects (TF + MC) ------------------------------------
    {
      id: 'b6-monetary-effects',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Monetarna politika u IS-LM',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Monetarna ekspanzija povećava output i snižava kamatnu stopu.', kind: 'tf', answer: true },
        { q: 'Monetarna kontrakcija podiže kamatnu stopu i snižava output.', kind: 'tf', answer: true },
        { q: 'Monetarna ekspanzija podiže kamatnu stopu.', kind: 'tf', answer: false },
        { q: 'Monetarna ekspanzija (viša M) pomiče gospodarstvo prema:', kind: 'mc', options: ['Višem Y, višoj i', 'Višem Y, nižoj i', 'Nižem Y, nižoj i', 'Bez promjene'], answer: 1 },
        { q: 'Monetarna kontrakcija dovodi do:', kind: 'mc', options: ['Višeg Y, niže i', 'Nižeg Y, više i', 'Viši Y, viša i', 'Nema promjene'], answer: 1 },
        { q: 'Niža kamatna stopa povećava output uglavnom podizanjem:', kind: 'mc', options: ['Poreza', 'Investicija', 'Uvoza', 'Potražnje za novcem'], answer: 1 }
      ],
      solution: [
        'Monetarna ekspanzija pomiče LM prema dolje: kamatna stopa PADA (ne raste), što povećava investicije i output.',
        'Monetarna politika djeluje putem kamatne stope: niža i → više investicija → viši output.'
      ]
    },

    // --- The policy mix (TF + MC) ---------------------------------------------
    {
      id: 'b6-policy-mix',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'Mješavina politika',
      prompt: 'Odredite je li svaka tvrdnja točna ili netočna, a zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Mješavina politika je kombinirana primjena fiskalne i monetarne politike.', kind: 'tf', answer: true },
        { q: 'Fiskalna ekspanzija uz monetarnu ekspanziju može povećati output uz sprječavanje rasta kamatne stope.', kind: 'tf', answer: true },
        { q: 'Mješavina politika može biti isključivo restriktivna.', kind: 'tf', answer: false },
        { q: 'Da biste povećali output uz zadržavanje kamatne stope otprilike nepromijenjenom, kombinirajte:', kind: 'mc', options: ['Fiskalnu ekspanziju + monetarnu kontrakciju', 'Fiskalnu ekspanziju + monetarnu ekspanziju', 'Fiskalnu kontrakciju + monetarnu kontrakciju', 'Samo više poreze'], answer: 1 },
        { q: 'Istovremena primjena fiskalne i monetarne politike naziva se:', kind: 'mc', options: ['Multiplikator', 'Mješavina politika', 'Zamka likvidnosti', 'Istiskivanje'], answer: 1 },
        { q: 'Fiskalna ekspanzija sama po sebi podiže i; dodavanje monetarne ekspanzije:', kind: 'mc', options: ['Dodatno podiže i', 'Poništava rast i', 'Snižava output', 'Podiže poreze'], answer: 1 }
      ],
      solution: [
        'Mješavina politika može biti ekspanzivna, restriktivna ili osmišljena tako da istovremeno cilja output i kamatnu stopu.',
        'Fiskalna ekspanzija podiže i; istodobna monetarna ekspanzija spušta i — zajedno mogu povećati output uz malo promjene u i.'
      ]
    },

    // --- RANDOMIZED: comparative statics (policy → Y and i directions) --------
    {
      id: 'b6-comparative-random',
      lesson: 'first-midterm',
      chapter: 7,
      type: 'choice',
      title: 'IS-LM Komparativna statika — Vježba',
      prompt: 'Za zadanu politiku odredi smjer ravnotežnog outputa i kamatne stope.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { policy: 'a fiscal expansion (an increase in government spending G)', dY: 0, di: 0, why: 'IS shifts right: output rises, and higher output raises money demand, so the interest rate rises.' },
          { policy: 'a fiscal contraction (an increase in taxes T)', dY: 1, di: 1, why: 'IS shifts left: output falls, lower output reduces money demand, so the interest rate falls.' },
          { policy: 'a monetary expansion (the central bank increases the money supply)', dY: 0, di: 1, why: 'LM shifts down: the interest rate falls, which raises investment and output.' },
          { policy: 'a monetary contraction (the central bank reduces the money supply)', dY: 1, di: 0, why: 'LM shifts up: the interest rate rises, which lowers investment and output.' },
          { policy: 'a cut in taxes (lower T)', dY: 0, di: 0, why: 'A tax cut is expansionary (IS shifts right): output rises and the interest rate rises.' }
        ] }
      },
      generate(p) {
        const s = p.pair;
        const opts = ['Rises', 'Falls', 'Stays the same'];
        return {
          prompt: 'In the IS-LM model, consider ' + s.policy + '. Determine what happens to equilibrium output and to the interest rate.',
          items: [
            { q: 'What happens to equilibrium output Y?', kind: 'mc', options: opts, answer: s.dY },
            { q: 'What happens to the equilibrium interest rate i?', kind: 'mc', options: opts, answer: s.di }
          ],
          solution: [s.why]
        };
      },
      solution: ['Pritisni „Novi brojevi" za novu politiku. Fiskalna: pomiče IS (Y i i kreću se u istom smjeru). Monetarna: pomiče LM (Y i i kreću se u suprotnim smjerovima).']
    },

    // ============================================================================
    // B7 — THE LABOUR MARKET / NATURAL RATE (second-midterm), chapter 8
    //   Price-setting real wage W/P = 1/(1+μ); wage-setting F = 1 − u + z;
    //   natural rate u_n = 1 − 1/(1+μ) + z; natural output Y_n = L(1 − u_n).
    //   μ and z entered as PERCENT. Conventions: real wage 2–3 dp tol 0.01;
    //   natural rate % 1 dp tol 0.1; output (millions) integer tol 0.
    //   Randomized: scalar p.mu; object p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: WS, PS, natural rate, natural output (TF + MC) -------------
    {
      id: 'b7-concepts',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Tržište rada — Pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'U relaciji postavljanja plaća, viša stopa nezaposlenosti snižava plaću.', kind: 'tf', answer: true },
        { q: 'Relacija postavljanja cijena P = (1 + μ)W implicira realnu plaću od 1/(1 + μ).', kind: 'tf', answer: true },
        { q: 'Viši markup μ podiže prirodnu stopu nezaposlenosti.', kind: 'tf', answer: true },
        { q: 'Izdašnija naknada za nezaposlene (viši z) snižava prirodnu stopu.', kind: 'tf', answer: false },
        { q: 'Prirodna stopa nezaposlenosti određena je agregatnom potražnjom.', kind: 'tf', answer: false },
        { q: 'Pri prirodnoj stopi, realne plaće iz relacije postavljanja plaća i relacije postavljanja cijena su jednake.', kind: 'tf', answer: true },
        { q: 'Relacija postavljanja cijena P = (1 + μ)W implicira realnu plaću od:', kind: 'mc', options: ['1 + μ', '1/(1 + μ)', 'μ', 'W − μ'], answer: 1 },
        { q: 'U srednjem roku, prirodna stopa nezaposlenosti određena je:', kind: 'mc', options: ['Agregatnom potražnjom', 'Strukturom tržišta rada i tržišta proizvoda (z i μ)', 'Novčanom ponudom', 'Neto izvozom'], answer: 1 },
        { q: 'Prirodna razina outputa odgovara:', kind: 'mc', options: ['Nultoj nezaposlenosti', 'Nezaposlenosti jednakoj prirodnoj stopi', 'Nultoj inflaciji', 'Uravnoteženom proračunu'], answer: 1 }
      ],
      solution: [
        'Viši z (izdašnije naknade, jača zaštita) PODIŽE prirodnu stopu — radnici mogu dulje čekati na višu plaću.',
        'Prirodna stopa je STRUKTURNO obilježje (z i μ), a ne nešto što potražnja može trajno promijeniti.',
        'Nalazi se postavljanjem jednakosti između realne plaće iz WS relacije i realne plaće iz PS relacije (uz P^e = P).'
      ]
    },

    // --- Price-setting real wage (numeric, fixed) -----------------------------
    {
      id: 'b7-realwage-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Realna plaća prema postavljanju cijena',
      prompt: 'Poduzeća postavljaju cijene s maržom μ = 5% iznad plaća, dakle P = (1 + μ)W. Izračunaj realnu plaću prema postavljanju cijena W/P.'
        + 'Round to 3 decimal places.',
      difficulty: 1,
      fields: [
        { key: 'wp', label: 'Realna plaća W/P', answer: 1 / 1.05, tol: 0.01, unit: '', hint: 'W/P = 1 ÷ (1 + μ) = 1 ÷ 1.05' }
      ],
      solution: [
        'W/P = 1 ÷ (1 + μ) = 1 ÷ 1.05 = 0.952.',
        'Veća marža znači nižu realnu plaću (veći dio cijene pripada poduzećima).'
      ]
    },

    // --- Natural rate of unemployment (numeric, fixed) ------------------------
    {
      id: 'b7-natural-rate-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Prirodna stopa nezaposlenosti',
      prompt: 'S linearnim oblikom postavljanja plaća F = 1 − u + z, marža iznosi μ = 5% i z = 0.'
        + 'Compute the price-setting real wage W/P and the natural rate of unemployment u_n (%). Round the rate to 1 decimal place.',
      difficulty: 2,
      fields: [
        { key: 'wp', label: 'Realna plaća W/P', answer: 1 / 1.05, tol: 0.01, unit: '', hint: '1 ÷ (1 + 0.05)' },
        { key: 'un', label: 'Prirodna stopa u_n', answer: (1 - 1 / 1.05 + 0) * 100, tol: 0.1, unit: '%', hint: 'u_n = 1 − 1/(1+μ) + z = 1 − 0.952 + 0, zatim ×100' }
      ],
      solution: [
        'W/P = 1 ÷ 1.05 = 0.952.',
        'u_n = 1 − 1/(1+μ) + z = 1 − 0.952 + 0 = 0.048 ≈ 4.8%.'
      ]
    },

    // --- Natural level of output (numeric, fixed) -----------------------------
    {
      id: 'b7-natural-output-fixed',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Prirodna razina proizvodnje',
      prompt: 'Radna snaga iznosi L = 200 (milijuna), a prirodna stopa nezaposlenosti je u_n = 5%.'
        + 'With one unit of output per worker, compute the natural level of output Y_n (millions).',
      difficulty: 1,
      fields: [
        { key: 'yn', label: 'Prirodna proizvodnja Y_n (milijuni)', answer: 200 * (1 - 0.05), tol: 0, unit: 'm', hint: 'Y_n = L(1 − u_n) = 200 × (1 − 0.05)' }
      ],
      solution: [
        'Zaposlenost N = L(1 − u_n) = 200 × 0.95 = 190 milijuna.',
        'Uz jednu jedinicu proizvodnje po radniku, Y_n = N = 190.'
      ]
    },

    // --- RANDOMIZED: price-setting real wage ----------------------------------
    {
      id: 'b7-realwage-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Realna plaća — vježba',
      prompt: 'Izračunaj realnu plaću prema postavljanju cijena na temelju marže.',
      difficulty: 1,
      params: {
        mu: { choices: [5, 10, 20, 25, 50] }
      },
      generate(p) {
        const mu = p.mu;
        const wp = 1 / (1 + mu / 100);
        const r3 = (x) => Math.round(x * 1000) / 1000;
        return {
          prompt: 'Firms set prices with a markup μ = ' + mu + '% over wages (P = (1 + μ)W). Compute the price-setting '
            + 'real wage W/P. Round to 3 decimal places.',
          fields: [
            { key: 'wp', label: 'Real wage W/P', answer: wp, tol: 0.01, unit: '', hint: 'W/P = 1 ÷ (1 + ' + (mu / 100) + ')' }
          ],
          solution: ['W/P = 1 ÷ (1 + ' + (mu / 100) + ') = ' + r3(wp) + '.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za novu maržu. W/P = 1 ÷ (1 + μ).']
    },

    // --- RANDOMIZED: natural rate of unemployment -----------------------------
    {
      id: 'b7-natural-rate-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Prirodna stopa — vježba',
      prompt: 'Izračunaj prirodnu stopu nezaposlenosti na temelju marže i parametra postavljanja plaća z.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { mu: 5, z: 0 },
          { mu: 10, z: 0 },
          { mu: 25, z: 0 },
          { mu: 5, z: 2 },
          { mu: 10, z: 5 }
        ] }
      },
      generate(p) {
        const mu = p.pair.mu, z = p.pair.z;
        const un = (1 - 1 / (1 + mu / 100) + z / 100) * 100;
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'With F = 1 − u + z, the markup is μ = ' + mu + '% and z = ' + z + '%. Compute the natural rate of '
            + 'unemployment u_n (%). Round to 1 decimal place.',
          fields: [
            { key: 'un', label: 'Natural rate u_n', answer: un, tol: 0.1, unit: '%', hint: 'u_n = (1 − 1/(1+' + (mu / 100) + ') + ' + (z / 100) + ') × 100' }
          ],
          solution: ['u_n = 1 − 1/(1+' + (mu / 100) + ') + ' + (z / 100) + ' = ' + r1(un) + '%.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. u_n = 1 − 1/(1+μ) + z (u postocima).']
    },

    // --- RANDOMIZED: natural level of output ----------------------------------
    {
      id: 'b7-natural-output-random',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'numeric',
      title: 'Prirodna razina proizvodnje — vježba',
      prompt: 'Izračunaj prirodnu razinu proizvodnje na temelju radne snage i prirodne stope nezaposlenosti.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { L: 200, un: 5 },
          { L: 150, un: 4 },
          { L: 300, un: 10 },
          { L: 250, un: 8 },
          { L: 400, un: 5 }
        ] }
      },
      generate(p) {
        const L = p.pair.L, un = p.pair.un;
        const yn = L * (1 - un / 100);
        return {
          prompt: 'The labour force is L = ' + L + ' (million) and the natural rate of unemployment is u_n = ' + un
            + '%. With one unit of output per worker, compute the natural level of output Y_n (millions).',
          fields: [
            { key: 'yn', label: 'Natural output Y_n (millions)', answer: yn, tol: 0, unit: 'm', hint: 'Y_n = L(1 − u_n) = ' + L + ' × (1 − ' + (un / 100) + ')' }
          ],
          solution: ['Y_n = L(1 − u_n) = ' + L + ' × ' + (1 - un / 100) + ' = ' + yn + ' million.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove podatke. Y_n = L(1 − u_n).']
    },

    // ============================================================================
    // B8 — THE MEDIUM RUN / AS-AD (second-midterm), chapter 9
    //   AS (from the labour market, upward) + AD (from IS-LM, downward); short-run
    //   vs medium-run; money neutrality; the P^e adjustment process. Like IS-LM this
    //   is QUALITATIVE in the Learn material → choice-based, with one randomized
    //   shock drill (random shock → which curve shifts + short-run output effect).
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: AS/AD derivation, slopes, equilibrium (TF + MC) ------------
    {
      id: 'b8-concepts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Srednji rok (AS-AD) — Pojmovi',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Krivulja AS izvodi se iz tržišta rada i ima pozitivan nagib u dijagramu (Y, P).', kind: 'tf', answer: true },
        { q: 'Krivulja AD izvodi se iz IS-LM modela i ima negativan nagib.', kind: 'tf', answer: true },
        { q: 'U ravnoteži srednjeg roka, P = P^e i proizvodnja je jednaka prirodnoj razini Y_n.', kind: 'tf', answer: true },
        { q: 'Krivulja AD ima negativan nagib jer viša razina cijena povećava realnu novčanu ponudu.', kind: 'tf', answer: false },
        { q: 'U kratkom roku, proizvodnja je određena agregatnom potražnjom.', kind: 'tf', answer: true },
        { q: 'Krivulja AS izvodi se iz ravnoteže na:', kind: 'mc', options: ['Tržištu dobara', 'Tržištu rada', 'Tržištu novca', 'Tržištu obveznica'], answer: 1 },
        { q: 'Krivulja AD ima negativan nagib jer viša razina cijena:', kind: 'mc', options: ['Povećava realnu novčanu ponudu', 'Smanjuje realnu novčanu ponudu (M/P), povećava i i smanjuje proizvodnju', 'Izravno povećava proizvodnju', 'Snižava marku'], answer: 1 },
        { q: 'U ravnoteži srednjeg roka, proizvodnja je jednaka:', kind: 'mc', options: ['Nuli', 'Prirodnoj razini Y_n', 'Samo agregatnoj potražnji', 'Potencijalnoj razini umanjenoj za marku'], answer: 1 }
      ],
      solution: [
        'Viša razina cijena SMANJUJE realnu novčanu ponudu M/P, što povećava kamatnu stopu i smanjuje proizvodnju — zbog toga krivulja AD ima negativan nagib.',
        'AS potječe iz tržišta rada (pozitivan nagib); AD potječe iz IS-LM modela (negativan nagib); ravnoteža srednjeg roka je tamo gdje P = P^e i Y = Y_n.'
      ]
    },

    // --- What shifts AS and AD (TF + MC) --------------------------------------
    {
      id: 'b8-shifts',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Pomaci krivulja AS i AD',
      prompt: 'Odlučite je li svaka tvrdnja točna ili netočna, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'Povećanje novčane ponude pomiče krivulju AD udesno.', kind: 'tf', answer: true },
        { q: 'Porast očekivane razine cijena P^e pomiče krivulju AS prema gore.', kind: 'tf', answer: true },
        { q: 'Fiskalna ekspanzija pomiče krivulju AD ulijevo.', kind: 'tf', answer: false },
        { q: 'Viša marka μ pomiče krivulju AS prema gore (snižavajući prirodnu razinu proizvodnje).', kind: 'tf', answer: true },
        { q: 'Povećanje novčane ponude pomiče krivulju AD:', kind: 'mc', options: ['Ulijevo', 'Udesno', 'Ne pomiče se', 'Umjesto toga pomiče AS'], answer: 1 },
        { q: 'Porast očekivane razine cijena pomiče krivulju AS:', kind: 'mc', options: ['Prema dolje', 'Prema gore', 'Ne pomiče se', 'Umjesto toga pomiče AD'], answer: 1 },
        { q: 'Što od navedenog pomiče krivulju AS (a ne krivulju AD)?', kind: 'mc', options: ['Promjena novčane ponude', 'Promjena javne potrošnje', 'Promjena očekivane razine cijena', 'Promjena autonomnih investicija'], answer: 2 }
      ],
      solution: [
        'Fiskalna ekspanzija (viši G) pomiče krivulju AD UDESNO, a ne ulijevo.',
        'AD pomiču faktori potražnje (novac, fiskalna politika); AS pomiču faktori ponude (P^e, marža μ, z).'
      ]
    },

    // --- Short-run effects of demand shocks (TF + MC) -------------------------
    {
      id: 'b8-shortrun',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Kratki rok',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'U kratkom roku, monetarna ekspanzija podiže output iznad prirodne razine.', kind: 'tf', answer: true },
        { q: 'U kratkom roku, output se može razlikovati od prirodne razine.', kind: 'tf', answer: true },
        { q: 'Kontrakcija potražnje podiže output u kratkom roku.', kind: 'tf', answer: false },
        { q: 'Ako je output iznad prirodne razine (Y > Y_n), tada:', kind: 'mc', options: ['Stopa nezaposlenosti je iznad prirodne stope', 'Stopa nezaposlenosti je ispod prirodne stope', 'Cijene moraju pasti', 'Proračun je uravnotežen'], answer: 1 },
        { q: 'U kratkom roku, fiskalna ekspanzija:', kind: 'mc', options: ['Smanjuje output', 'Podiže output i razinu cijena', 'Nema učinka', 'Snižava samo cijene'], answer: 1 },
        { q: 'U kratkom roku, output je određen s:', kind: 'mc', options: ['Prirodnom razinom Y_n', 'Agregatnom potražnjom', 'Maržom', 'Samo radnom snagom'], answer: 1 }
      ],
      solution: [
        'Stezanje potražnje snižava output u kratkom roku (pomiče AD ulijevo).',
        'Kada je Y > Y_n, stopa nezaposlenosti je ispod prirodne stope — gospodarstvo se pregrije, što stvara pritisak na rast cijena.'
      ]
    },

    // --- Medium-run adjustment & money neutrality (TF + MC) -------------------
    {
      id: 'b8-mediumrun',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Srednji rok i neutralnost novca',
      prompt: 'Odredite je li svaka tvrdnja točna ili netočna, a zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 2,
      items: [
        { q: 'U srednjem roku, output se vraća na prirodnu razinu Y_n.', kind: 'tf', answer: true },
        { q: 'U srednjem roku, monetarna ekspanzija trajno povećava output.', kind: 'tf', answer: false },
        { q: 'U srednjem roku, agregatna potražnja utječe uglavnom na razinu cijena.', kind: 'tf', answer: true },
        { q: 'U srednjem roku, monetarna ekspanzija dovodi do:', kind: 'mc', options: ['Trajno višeg outputa', 'Istog outputa Y_n pri višoj razini cijena', 'Trajno nižih cijena', 'Niže prirodne stope'], answer: 1 },
        { q: 'U srednjem roku, agregatna potražnja utječe uglavnom na:', kind: 'mc', options: ['Prirodnu razinu outputa', 'Razinu cijena', 'Radnu snagu', 'Maržu'], answer: 1 },
        { q: 'Kaže se da je novac NEUTRALAN u srednjem roku jer:', kind: 'mc', options: ['Mijenja prirodnu razinu outputa', 'Utječe samo na nominalne varijable (razinu cijena), a ne na Y_n', 'Snižava maržu', 'Trajno povećava realni output'], answer: 1 }
      ],
      solution: [
        'Monetarna ekspanzija NE povećava output trajno — u srednjem roku output se vraća na Y_n, a jedino razina cijena ostaje trajno viša.',
        'To je neutralnost novca: u srednjem roku, novac utječe na razinu cijena, a ne na realni output.'
      ]
    },

    // --- The adjustment process (TF + MC) -------------------------------------
    {
      id: 'b8-adjustment',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Proces prilagodbe',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 3,
      items: [
        { q: 'Nakon monetarne ekspanzije, kako ljudi revidiraju P^e naviše, krivulja AS pomiče se prema gore.', kind: 'tf', answer: true },
        { q: 'Prilagodba se zaustavlja kada P = P^e i Y = Y_n ponovo.', kind: 'tf', answer: true },
        { q: 'Proces prilagodbe trajno povećava prirodnu razinu proizvodnje.', kind: 'tf', answer: false },
        { q: 'Počevši od Y_n, monetarna ekspanzija u KRATKOM roku daje:', kind: 'mc', options: ['Y ispod Y_n', 'Y iznad Y_n s P iznad P^e', 'Nema promjene', 'Niže cijene'], answer: 1 },
        { q: 'Gospodarstvo se vraća na Y_n jer:', kind: 'mc', options: ['Novčana ponuda pada natrag', 'Očekivanja P^e prilagođavaju se naviše, pomičući AS gore', 'Porezi automatski rastu', 'Neto izvoz se prilagođava'], answer: 1 },
        { q: 'Krajnji rezultat prilagodbe je isti Y_n pri:', kind: 'mc', options: ['Nižoj razini cijena', 'Višoj razini cijena', 'Nižoj marži', 'Višoj prirodnoj stopi'], answer: 1 }
      ],
      solution: [
        'Prirodna razina proizvodnje strukturna je veličina — proces prilagodbe vraća proizvodnju NA Y_n, ali ne mijenja Y_n.',
        'Mehanizam: cijene premašuju očekivanja → P^e revidira se naviše → AS se pomiče gore → proizvodnja pada natrag na Y_n pri višoj razini cijena.'
      ]
    },

    // --- RANDOMIZED: shock → which curve shifts + short-run output ------------
    {
      id: 'b8-comparative-random',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Šokovi AS-AD — vježba',
      prompt: 'Za zadani šok, identificiraj koja se krivulja pomiče i kratkoročni učinak na proizvodnju.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { shock: 'a monetary expansion (an increase in the money supply)', curve: 1, dY: 0, why: 'A monetary expansion shifts the AD curve right → in the short run output rises above Y_n.' },
          { shock: 'a monetary contraction (a fall in the money supply)', curve: 1, dY: 1, why: 'A monetary contraction shifts the AD curve left → in the short run output falls below Y_n.' },
          { shock: 'a fiscal expansion (an increase in government spending)', curve: 1, dY: 0, why: 'A fiscal expansion shifts the AD curve right → in the short run output rises above Y_n.' },
          { shock: 'a rise in the expected price level P^e', curve: 0, dY: 1, why: 'A higher P^e shifts the AS curve up → in the short run output falls below Y_n.' },
          { shock: 'a rise in the markup μ', curve: 0, dY: 1, why: 'A higher markup shifts the AS curve up (and lowers Y_n) → in the short run output falls.' }
        ] }
      },
      generate(p) {
        const s = p.pair;
        return {
          prompt: 'In the AS-AD model, consider ' + s.shock + '. Identify which curve shifts and the short-run effect on output.',
          items: [
            { q: 'Which curve shifts?', kind: 'mc', options: ['The AS curve', 'The AD curve'], answer: s.curve },
            { q: 'In the short run, output:', kind: 'mc', options: ['Rises (above Y_n)', 'Falls (below Y_n)'], answer: s.dY }
          ],
          solution: [s.why]
        };
      },
      solution: ['Pritisni „Novi brojevi" za novi šok. Šokovi potražnje (novčana ponuda, fiskalna politika) pomiču AD; šokovi ponude (P^e, μ, z) pomiču AS.']
    },

    // ============================================================================
    // B9 — THE LONG RUN / GROWTH (second-midterm), chapter 10
    //   Output per worker Y/N; investment from saving I = sY; capital accumulation
    //   K_{t+1} = (1 - δ)K_t + I_t; compound growth Y_n = Y_0(1 + g)^n.
    //   s, δ, g entered as PERCENT. Conventions: per-worker & amounts integer tol 0;
    //   compounded output 1 dp tol 0.5. Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: production function, Solow, growth sources (TF + MC) -------
    {
      id: 'b9-concepts',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'choice',
      title: 'Dugi rok / Rast — Pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Agregatna funkcija proizvodnje Y = F(K, N) ima opadajuće prinose kapitala.', kind: 'tf', answer: true },
        { q: 'Proizvodnja po radniku ovisi o kapitalu po radniku K/N.', kind: 'tf', answer: true },
        { q: 'U Solowljevom modelu, investicije se financiraju štednjom.', kind: 'tf', answer: true },
        { q: 'Viša stopa štednje održava trajno višu stopu rasta outputa po radniku.', kind: 'tf', answer: false },
        { q: 'Održivi dugoročni rast outputa po radniku zahtijeva tehnološki napredak.', kind: 'tf', answer: true },
        { q: 'Konvergencija znači da siromašnije zemlje imaju tendenciju bržeg rasta i nadoknađivanja zaostatka.', kind: 'tf', answer: true },
        { q: 'Proizvodna funkcija Y = F(K, N) pokazuje opadajuće prinose na:', kind: 'mc', options: ['Opseg', 'Kapital (i rad) zasebno', 'Štednju', 'Amortizaciju'], answer: 1 },
        { q: 'Zbog opadajućih prinosa, akumulacija kapitala SAMA po sebi daje dugoročnu stopu rasta Y/N jednaku:', kind: 'mc', options: ['Stopi štednje', 'Nuli', 'Stopi amortizacije', 'Beskonačnosti'], answer: 1 },
        { q: 'Što održava dugoročni rast outputa po radniku?', kind: 'mc', options: ['Samo viša stopa štednje', 'Tehnološki napredak', 'Viša stopa amortizacije', 'Samo više radne snage'], answer: 1 }
      ],
      solution: [
        'Viša stopa štednje podiže RAZINU outputa po radniku (bogatije stacionarno stanje), ali — zbog opadajućih prinosa — ne i njegovu dugoročnu stopu rasta.',
        'Sama akumulacija kapitala nailazi na opadajuće prinose; jedino tehnološki napredak održava rast neograničeno dugo.'
      ]
    },

    // --- Output per worker (numeric, fixed) -----------------------------------
    {
      id: 'b9-perworker-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Output po radniku',
      prompt: 'Gospodarstvo proizvodi output Y = 600 s N = 30 (milijuna) radnika. Izračunaj output po radniku Y/N.',
      difficulty: 1,
      fields: [
        { key: 'yn', label: 'Output po radniku (Y/N)', answer: 600 / 30, tol: 0, unit: '', hint: 'Y ÷ N = 600 ÷ 30' }
      ],
      solution: [
        'Output po radniku = Y ÷ N = 600 ÷ 30 = 20.',
        'Životni standard ovisi o outputu po radniku, koji raste s kapitalom po radniku (K/N) — ali uz opadajuće prinose.'
      ]
    },

    // --- Investment from saving (numeric, fixed) ------------------------------
    {
      id: 'b9-investment-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Investicije iz štednje',
      prompt: 'Stopa štednje iznosi s = 20%, a output je Y = 1000. Uz I = sY, izračunaj investicije I.',
      difficulty: 1,
      fields: [
        { key: 'inv', label: 'Investicije (I)', answer: 0.2 * 1000, tol: 0, unit: '', hint: 'I = sY = 0.20 × 1000' }
      ],
      solution: [
        'I = sY = 0.20 × 1000 = 200.',
        'Štednja financira investicije, koje grade kapitalnu zalihu — pokretač Solowljevog modela.'
      ]
    },

    // --- Capital accumulation (numeric, fixed) --------------------------------
    {
      id: 'b9-capital-accum-fixed',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Akumulacija kapitala',
      prompt: 'Kapitalna zaliha iznosi K = 1000, stopa amortizacije je δ = 10%, a investicije su I = 200.'
        + 'Using K_next = (1 − δ)K + I, compute next period’s capital stock.',
      difficulty: 2,
      fields: [
        { key: 'knext', label: 'Kapital u sljedećem razdoblju', answer: (1 - 0.1) * 1000 + 200, tol: 0, unit: '', hint: 'K_next = (1 − 0.10) × 1000 + 200' }
      ],
      solution: [
        'K_next = (1 − δ)K + I = 0.90 × 1000 + 200 = 900 + 200 = 1100.',
        'Stari kapital se amortizira (δK se gubi), a dodaju se nove investicije (I).'
      ]
    },

    // --- RANDOMIZED: output per worker ----------------------------------------
    {
      id: 'b9-perworker-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Output po radniku — vježba',
      prompt: 'Izračunaj output po radniku iz ukupnog outputa i broja radnika.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { Y: 600, N: 30 },
          { Y: 1200, N: 40 },
          { Y: 1000, N: 25 },
          { Y: 840, N: 42 },
          { Y: 1500, N: 50 }
        ] }
      },
      generate(p) {
        const Y = p.pair.Y, N = p.pair.N;
        const yn = Y / N;
        return {
          prompt: 'An economy produces output Y = ' + Y + ' with N = ' + N + ' (million) workers. '
            + 'Compute output per worker Y/N.',
          fields: [
            { key: 'yn', label: 'Output per worker (Y/N)', answer: yn, tol: 0, unit: '', hint: Y + ' ÷ ' + N }
          ],
          solution: ['Output per worker = ' + Y + ' ÷ ' + N + ' = ' + yn + '.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Output po radniku = Y ÷ N.']
    },

    // --- RANDOMIZED: capital accumulation -------------------------------------
    {
      id: 'b9-capital-accum-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Akumulacija kapitala — vježba',
      prompt: 'Izračunaj kapital u sljedećem razdoblju iz trenutne zalihe, amortizacije i investicija.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { K: 1000, d: 10, I: 200 },
          { K: 800, d: 5, I: 100 },
          { K: 1200, d: 10, I: 300 },
          { K: 1500, d: 20, I: 400 },
          { K: 900, d: 10, I: 150 }
        ] }
      },
      generate(p) {
        const K = p.pair.K, d = p.pair.d, I = p.pair.I;
        const knext = (1 - d / 100) * K + I;
        return {
          prompt: 'The capital stock is K = ' + K + ', the depreciation rate is δ = ' + d + '% and investment is I = ' + I
            + '. Using K_next = (1 − δ)K + I, compute next period’s capital stock.',
          fields: [
            { key: 'knext', label: 'Next-period capital', answer: knext, tol: 0, unit: '', hint: '(1 − ' + (d / 100) + ') × ' + K + ' + ' + I }
          ],
          solution: ['K_next = (1 − ' + (d / 100) + ') × ' + K + ' + ' + I + ' = ' + ((1 - d / 100) * K) + ' + ' + I + ' = ' + knext + '.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. K_next = (1 − δ)K + I.']
    },

    // --- RANDOMIZED: compound growth ------------------------------------------
    {
      id: 'b9-growth-compound-random',
      lesson: 'second-midterm',
      chapter: 10,
      type: 'numeric',
      title: 'Složeni rast — vježba',
      prompt: 'Izračunaj razinu outputa po stanovniku nakon nekoliko godina složenog rasta.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { Y0: 100, g: 2, n: 3 },
          { Y0: 100, g: 3, n: 5 },
          { Y0: 200, g: 5, n: 2 },
          { Y0: 100, g: 10, n: 2 },
          { Y0: 150, g: 4, n: 3 }
        ] }
      },
      generate(p) {
        const Y0 = p.pair.Y0, g = p.pair.g, n = p.pair.n;
        const yn = Y0 * Math.pow(1 + g / 100, n);
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'Output per capita starts at ' + Y0 + ' and grows by ' + g + '% per year for ' + n + ' years. '
            + 'Compute the level after ' + n + ' years. Round to 1 decimal place.',
          fields: [
            { key: 'yn', label: 'Level after ' + n + ' years', answer: yn, tol: 0.5, unit: '', hint: Y0 + ' × (1 + ' + (g / 100) + ')^' + n }
          ],
          solution: ['Level = ' + Y0 + ' × (1 + ' + (g / 100) + ')^' + n + ' = ' + r1(yn) + '. Because growth compounds, even small rates add up over time.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Složena razina = Y₀ × (1 + g)ⁿ.']
    },

    // ============================================================================
    // B10 — EXPECTATIONS (second-midterm), chapter 11
    //   Fisher relation r ≈ i − π^e; expected present discounted value z/(1+r)^n;
    //   a higher r lowers every present value; expectations shift the IS curve.
    //   Rates entered as PERCENT (1 dp, tol 0.1); present values 1 dp tol 0.5.
    //   Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: Fisher, present value, expectations & IS (TF + MC) ---------
    {
      id: 'b10-concepts',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'choice',
      title: 'Očekivanja — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Realna kamatna stopa približno je jednaka nominalnoj stopi umanjenoj za očekivanu inflaciju.', kind: 'tf', answer: true },
        { q: 'Viša kamatna stopa smanjuje sadašnju vrijednost određenog budućeg plaćanja.', kind: 'tf', answer: true },
        { q: 'Realna kamatna stopa ona je koja je važna za odluke o potrošnji i investicijama.', kind: 'tf', answer: true },
        { q: 'Plaćanje primljeno u budućnosti vrijedi manje danas nego isto plaćanje primljeno sada.', kind: 'tf', answer: false },
        { q: 'Optimistična očekivanja o budućnosti pomiču IS krivulju udesno.', kind: 'tf', answer: true },
        { q: 'Realna kamatna stopa približno je jednaka nominalnoj stopi umanjenoj za:', kind: 'mc', options: ['Poreznu stopu', 'Očekivanu inflaciju', 'Stopu rasta', 'Maržu'], answer: 1 },
        { q: 'Očekivana sadašnja diskontirana vrijednost dobiva se ___ budućih plaćanja:', kind: 'mc', options: ['Zbrajanje', 'Diskontiranje', 'Oporezivanje', 'Udvostručavanje'], answer: 1 },
        { q: 'Optimističnija očekivanja o budućnosti imaju tendenciju da:', kind: 'mc', options: ['Smanje trenutnu proizvodnju', 'Povećaju trenutnu potrošnju i investicije', 'Povećaju marku', 'Smanje novčanu ponudu'], answer: 1 },
        { q: 'Monetarna politika utječe na potražnju djelomično kroz očekivanja budućeg kretanja:', kind: 'mc', options: ['Poreza', 'Kamatnih stopa', 'Neto izvoza', 'Marke'], answer: 1 }
      ],
      solution: [
        'Buduće plaćanje danas vrijedi MANJE (diskontira se), jer bi novac danas u međuvremenu mogao zarađivati kamatu.',
        'Potrošnja ovisi o REALNOJ kamatnoj stopi i o očekivanjima budućeg dohotka, profita i stopa — pa optimizam pomiče IS krivulju udesno.'
      ]
    },

    // --- Fisher: real interest rate (numeric, fixed) --------------------------
    {
      id: 'b10-realrate-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Fisherova relacija',
      prompt: 'Nominalna kamatna stopa je i = 4%, a očekivana inflacija je π^e = 2%. Izračunaj realnu kamatnu stopu r (%).',
      difficulty: 1,
      fields: [
        { key: 'r', label: 'Realna kamatna stopa', answer: 4 - 2, tol: 0.1, unit: '%', hint: 'r ≈ i − π^e = 4 − 2' }
      ],
      solution: [
        'r ≈ i − π^e = 4% − 2% = 2%.',
        'Štediša se odriče dobara danas za otprilike 2% više dobara sljedeće godine — realni povrat je ono što oblikuje odluke.'
      ]
    },

    // --- Present value, one year (numeric, fixed) -----------------------------
    {
      id: 'b10-pv-1yr-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Sadašnja vrijednost (jedna godina)',
      prompt: 'Plaćanje od z = 1050 dospijeva za godinu dana, a kamatna stopa je r = 5%.'
        + 'Compute its expected present discounted value.',
      difficulty: 1,
      fields: [
        { key: 'pv', label: 'Sadašnja vrijednost', answer: 1050 / 1.05, tol: 0.5, unit: '', hint: 'PV = z ÷ (1 + r) = 1050 ÷ 1.05' }
      ],
      solution: [
        'PV = z ÷ (1 + r) = 1050 ÷ 1.05 = 1000.',
        'Budućih 1050 danas vrijedi samo 1000 — novac sutra se diskontira.'
      ]
    },

    // --- Present value, two years (numeric, fixed) ----------------------------
    {
      id: 'b10-pv-2yr-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Sadašnja vrijednost (dvije godine)',
      prompt: 'Plaćanje od z = 1210 dospijeva za dvije godine, a kamatna stopa je r = 10%.'
        + 'Compute its expected present discounted value.',
      difficulty: 2,
      fields: [
        { key: 'pv', label: 'Sadašnja vrijednost', answer: 1210 / Math.pow(1.1, 2), tol: 0.5, unit: '', hint: 'PV = z ÷ (1 + r)^2 = 1210 ÷ 1.21' }
      ],
      solution: [
        'PV = z ÷ (1 + r)^2 = 1210 ÷ 1.1^2 = 1210 ÷ 1.21 = 1000.',
        'Plaćanja koja su dalje u budućnosti diskontiraju se jače (dijele se s (1+r) za svaku godinu).'
      ]
    },

    // --- Present value: effect of the interest rate (numeric, fixed) ----------
    {
      id: 'b10-pv-rate-effect-fixed',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Kamatne stope i sadašnja vrijednost',
      prompt: 'Plaćanje z = 1200 dospijeva za godinu dana. Izračunaj njegovu sadašnju vrijednost kada je r = 20% i kada je r = 50%.'
        + 'What this shows: a higher interest rate lowers the present value.',
      difficulty: 2,
      fields: [
        { key: 'pv20', label: 'Sadašnja vrijednost pri r = 20%', answer: 1200 / 1.2, tol: 0.5, unit: '', hint: '1200 ÷ 1.20' },
        { key: 'pv50', label: 'Sadašnja vrijednost pri r = 50%', answer: 1200 / 1.5, tol: 0.5, unit: '', hint: '1200 ÷ 1.50' }
      ],
      solution: [
        'Pri r = 20%: PV = 1200 ÷ 1.20 = 1000.',
        'Pri r = 50%: PV = 1200 ÷ 1.50 = 800.',
        'Viša kamatna stopa jače diskontira budućnost, pa sadašnja vrijednost pada.'
      ]
    },

    // --- RANDOMIZED: Fisher real rate -----------------------------------------
    {
      id: 'b10-realrate-random',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Realna kamatna stopa — vježba',
      prompt: 'Izračunaj realnu kamatnu stopu iz nominalne stope i očekivane inflacije.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { i: 4, pi: 2 },
          { i: 6, pi: 2 },
          { i: 5, pi: 1 },
          { i: 8, pi: 3 },
          { i: 7, pi: 4 }
        ] }
      },
      generate(p) {
        const i = p.pair.i, pi = p.pair.pi;
        const r = i - pi;
        return {
          prompt: 'The nominal interest rate is i = ' + i + '% and expected inflation is π^e = ' + pi
            + '%. Compute the real interest rate r (%).',
          fields: [
            { key: 'r', label: 'Real interest rate', answer: r, tol: 0.1, unit: '%', hint: 'r ≈ i − π^e = ' + i + ' − ' + pi }
          ],
          solution: ['r ≈ i − π^e = ' + i + '% − ' + pi + '% = ' + r + '%.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. Realna stopa ≈ nominalna stopa − očekivana inflacija.']
    },

    // --- RANDOMIZED: present value over n years -------------------------------
    {
      id: 'b10-pv-random',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'numeric',
      title: 'Sadašnja vrijednost — vježba',
      prompt: 'Izračunaj sadašnju vrijednost budućeg plaćanja.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { z: 1050, r: 5, n: 1 },
          { z: 1260, r: 5, n: 1 },
          { z: 1100, r: 10, n: 1 },
          { z: 1210, r: 10, n: 2 },
          { z: 1440, r: 20, n: 2 }
        ] }
      },
      generate(p) {
        const z = p.pair.z, r = p.pair.r, n = p.pair.n;
        const pv = z / Math.pow(1 + r / 100, n);
        const r1 = (x) => Math.round(x * 10) / 10;
        return {
          prompt: 'A payment of z = ' + z + ' is due ' + n + ' year' + (n > 1 ? 's' : '') + ' from now and the interest '
            + 'rate is r = ' + r + '%. Compute its expected present discounted value.',
          fields: [
            { key: 'pv', label: 'Present value', answer: pv, tol: 0.5, unit: '', hint: z + ' ÷ (1 + ' + (r / 100) + ')^' + n }
          ],
          solution: ['PV = ' + z + ' ÷ (1 + ' + (r / 100) + ')^' + n + ' = ' + r1(pv) + '.']
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove vrijednosti. PV = z ÷ (1 + r)ⁿ.']
    },

    // ============================================================================
    // B11 — THE OPEN ECONOMY: GOODS MARKET (second-midterm), chapter 12
    //   Import function IM = IM0 + m·Y; net exports NX = X − IM;
    //   demand for domestic goods Z = C + I + G − IM + X; equilibrium Y = (C+I+G) + NX.
    //   Open-economy multiplier = 1 / (1 − β(1−t) + m) — imports add +m to the
    //   denominator, so they SHRINK the multiplier. β, t, m are decimals here.
    //   Marshall-Lerner: a real depreciation raises NX only if elasticities sum > 1.
    //   Fiscal expansion raises Y → raises imports → NX falls.
    //   Multiplier 2 dp tol 0.05; amounts (IM, NX, Z, ΔY) tol 0; randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: imports, multiplier, NX, real exchange rate, Marshall-Lerner ---
    {
      id: 'b11-concepts',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'choice',
      title: 'Otvoreno gospodarstvo (dobra) — pojmovi',
      prompt: 'Odluči je li svaka tvrdnja točna ili netočna, a zatim odgovori na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Uvoz raste s domaćim outputom: IM = IM0 + m·Y.', kind: 'tf', answer: true },
        { q: 'Uvoz uvodi novi „odljev" u kružni tok potrošnje, čime multiplikator postaje manji.', kind: 'tf', answer: true },
        { q: 'Neto izvoz jednak je izvozu minus uvoz, NX = X − IM.', kind: 'tf', answer: true },
        { q: 'Realna aprecijacija (domaća dobra relativno skuplja) smanjuje neto izvoz.', kind: 'tf', answer: false },
        { q: 'Povećanje javne potrošnje povećava output i stoga ima tendenciju smanjenja neto izvoza.', kind: 'tf', answer: true },
        { q: 'Granična sklonost uvozu m je dodatni uvoz po jedinici dodatnog:', kind: 'mc', options: ['Poreza', 'Outputa', 'Izvoza', 'Javna potrošnja'], answer: 1 },
        { q: 'U multiplikatoru otvorenog gospodarstva 1/(1 − β(1−t) + m), veći m čini multiplikator:', kind: 'mc', options: ['Većim', 'Manjim', 'Nepromijenjenim', 'Negativnim'], answer: 1 },
        { q: 'Potražnja za domaćim dobrima jednaka je C + I + G:', kind: 'mc', options: ['Plus uvoz, minus izvoz', 'Minus uvoz, plus izvoz', 'Minus porezi', 'Plus marža'], answer: 1 },
        { q: 'Pod pretpostavkom da vrijedi Marshall-Lernerov uvjet, neto izvoz raste nakon realne:', kind: 'mc', options: ['Aprecijacije', 'Deprecijacije', 'Poreznog reza', 'Porasta marže'], answer: 1 }
      ],
      solution: [
        'Uvoz je curenje (poput štednje i poreza): dio svakog dodatnog eura dohotka troši se na strana dobra i prestaje cirkulirati u domaćem gospodarstvu, pa je multiplikator 1/(1 − β(1−t) + m) manji od onoga u zatvorenom gospodarstvu.',
        'Realna deprecijacija čini domaća dobra jeftinijima u inozemstvu → izvoz raste, uvoz pada → NX raste, pod uvjetom da vrijedi Marshall-Lernerov uvjet (zbroj cjenovnih elastičnosti > 1).'
      ]
    },

    // --- Open-economy multiplier vs closed (numeric, fixed) -------------------
    {
      id: 'b11-multiplier-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Uvoz smanjuje multiplikator',
      prompt: 'Neka je β = 0.8, t = 0.1 i m = 0.12. Izračunaj multiplikator prvo ZANEMARUJUĆI uvoz (m = 0),'
        + 'then WITH imports. This shows how importing reduces the multiplier.',
      difficulty: 2,
      fields: [
        { key: 'closed', label: 'Multiplikator zatvorenog gospodarstva (m = 0)', answer: 1 / (1 - 0.8 * (1 - 0.1)), tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.8·0.9)' },
        { key: 'open', label: 'Multiplikator otvorenog gospodarstva', answer: 1 / (1 - 0.8 * (1 - 0.1) + 0.12), tol: 0.05, unit: '', hint: '1 ÷ (1 − 0.8·0.9 + 0.12)' }
      ],
      solution: [
        'Zatvoreno: 1 ÷ (1 − 0.8·0.9) = 1 ÷ 0.28 ≈ 3.57.',
        'Otvoreno: 1 ÷ (1 − 0.8·0.9 + 0.12) = 1 ÷ 0.40 = 2.5.',
        'Multiplikator pada s 3.57 na 2.5 — dio svakog dodatnog eura sada se troši na strana dobra, pa istječe iz domaćeg gospodarstva.'
      ]
    },

    // --- Import function (numeric, fixed) -------------------------------------
    {
      id: 'b11-imports-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Funkcija uvoza',
      prompt: 'Autonomni uvoz iznosi IM0 = 100, granična sklonost uvozu je m = 0.1, a output je Y = 2000.'
        + 'Compute total imports IM.',
      difficulty: 1,
      fields: [
        { key: 'im', label: 'Uvoz IM', answer: 100 + 0.1 * 2000, tol: 0, unit: '', hint: 'IM = IM0 + m·Y = 100 + 0.1·2000' }
      ],
      solution: [
        'IM = IM0 + m·Y = 100 + 0.1·2000 = 100 + 200 = 300.',
        'Uvoz raste s dohotkom: bogatiji stanovnici kupuju više iz inozemstva.'
      ]
    },

    // --- Net exports and demand for domestic goods (numeric, fixed) -----------
    {
      id: 'b11-netexports-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Neto izvoz i potražnja za domaćim dobrima',
      prompt: 'Domaća potražnja C + I + G = 1900, izvoz X = 400 i uvoz IM = 300.'
        + 'Compute net exports NX and the demand for domestic goods Z.',
      difficulty: 2,
      fields: [
        { key: 'nx', label: 'Neto izvoz NX', answer: 400 - 300, tol: 0, unit: '', hint: 'NX = X − IM = 400 − 300' },
        { key: 'z', label: 'Potražnja za domaćim dobrima Z', answer: 1900 - 300 + 400, tol: 0, unit: '', hint: 'Z = (C+I+G) − IM + X = 1900 − 300 + 400' }
      ],
      solution: [
        'NX = X − IM = 400 − 300 = 100 (trgovinski suficit).',
        'Z = (C + I + G) − IM + X = 1900 − 300 + 400 = 2000: oduzimamo uvoz sadržan unutar C+I+G, dodajemo izvoz.',
        'Napomena: Z = (C+I+G) + NX = 1900 + 100 = 2000 — oba pristupa daju isti rezultat.'
      ]
    },

    // --- Fiscal expansion: output and net exports (numeric, fixed) ------------
    {
      id: 'b11-fiscal-nx-fixed',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Fiskalna ekspanzija pogoršava trgovinsku bilancu',
      prompt: 'Multiplikator otvorene ekonomije iznosi 2.5, a granična sklonost uvozu je m = 0.12.'
        + 'Government spending rises by ΔG = 100 (exports are unchanged). '
        + 'Compute the rise in output ΔY, the rise in imports ΔIM, and the fall in net exports.',
      difficulty: 3,
      fields: [
        { key: 'dy', label: 'Rast outputa ΔY', answer: 2.5 * 100, tol: 0.5, unit: '', hint: 'ΔY = multiplikator · ΔG = 2.5·100' },
        { key: 'dim', label: 'Rast uvoza ΔIM', answer: 0.12 * (2.5 * 100), tol: 0.5, unit: '', hint: 'ΔIM = m·ΔY = 0.12·250' },
        { key: 'dnx', label: 'Pad neto izvoza', answer: 0.12 * (2.5 * 100), tol: 0.5, unit: '', hint: 'ΔX = 0, pa NX pada za ΔIM' }
      ],
      solution: [
        'ΔY = multiplikator · ΔG = 2.5 · 100 = 250.',
        'ΔIM = m · ΔY = 0.12 · 250 = 30.',
        'Izvoz se ne mijenja, pa NX = X − IM pada za 30: fiskalna ekspanzija djelomično „istječe" u inozemstvo u obliku višeg uvoza.'
      ]
    },

    // --- RANDOMIZED: open-economy multiplier ----------------------------------
    {
      id: 'b11-multiplier-random',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Multiplikator otvorene ekonomije — vježba',
      prompt: 'Izračunaj multiplikator otvorene ekonomije na temelju β, porezne stope t i granične sklonosti uvozu m.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { b: 0.8, t: 0.1, m: 0.12 },
          { b: 0.75, t: 0.2, m: 0.1 },
          { b: 0.9, t: 0, m: 0.15 },
          { b: 0.6, t: 0, m: 0.1 },
          { b: 0.8, t: 0, m: 0.2 }
        ] }
      },
      generate(p) {
        const b = p.pair.b, t = p.pair.t, m = p.pair.m;
        const denom = 1 - b * (1 - t) + m;
        const mult = 1 / denom;
        const r2 = (x) => Math.round(x * 100) / 100;
        return {
          prompt: 'With β = ' + b + ', t = ' + t + ' and m = ' + m + ', compute the open-economy multiplier '
            + '1 ÷ (1 − β(1−t) + m).',
          fields: [
            { key: 'mult', label: 'Multiplier', answer: mult, tol: 0.05, unit: '', hint: '1 ÷ (1 − ' + b + '·' + (1 - t) + ' + ' + m + ')' }
          ],
          solution: [
            'Denominator = 1 − ' + b + '·' + (1 - t) + ' + ' + m + ' = ' + r2(denom) + '.',
            'Multiplier = 1 ÷ ' + r2(denom) + ' = ' + r2(mult) + '.'
          ]
        };
      },
      solution: ['Pritisni „New numbers" za nove vrijednosti. Multiplikator = 1 ÷ (1 − β(1−t) + m); veći m znači manji multiplikator.']
    },

    // --- RANDOMIZED: net exports from the import function ----------------------
    {
      id: 'b11-netexports-random',
      lesson: 'second-midterm',
      chapter: 12,
      type: 'numeric',
      title: 'Neto izvoz — vježba',
      prompt: 'Izračunaj uvoz iz funkcije uvoza, a zatim neto izvoz NX = X − IM.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { X: 400, IM0: 50, m: 0.1, Y: 2000 },
          { X: 500, IM0: 100, m: 0.2, Y: 1500 },
          { X: 300, IM0: 0, m: 0.15, Y: 1000 },
          { X: 600, IM0: 200, m: 0.1, Y: 3000 },
          { X: 450, IM0: 50, m: 0.2, Y: 1000 }
        ] }
      },
      generate(p) {
        const X = p.pair.X, IM0 = p.pair.IM0, m = p.pair.m, Y = p.pair.Y;
        const im = IM0 + m * Y;
        const nx = X - im;
        return {
          prompt: 'Exports X = ' + X + '. Imports are IM = ' + IM0 + ' + ' + m + '·Y with output Y = ' + Y + '. '
            + 'Compute imports IM and net exports NX.',
          fields: [
            { key: 'im', label: 'Imports IM', answer: im, tol: 0, unit: '', hint: 'IM = ' + IM0 + ' + ' + m + '·' + Y },
            { key: 'nx', label: 'Net exports NX', answer: nx, tol: 0, unit: '', hint: 'NX = X − IM = ' + X + ' − IM' }
          ],
          solution: [
            'IM = ' + IM0 + ' + ' + m + '·' + Y + ' = ' + im + '.',
            'NX = X − IM = ' + X + ' − ' + im + ' = ' + nx + (nx >= 0 ? ' (surplus).' : ' (deficit).')
          ]
        };
      },
      solution: ['Pritisni „New numbers" za nove vrijednosti. NX = X − (IM0 + m·Y).']
    },

    // ============================================================================
    // B12 — BALANCE OF PAYMENTS (second-midterm), chapter 13  [LAST macro brick]
    //   BoP = all transactions with the rest of the world over one year, in two
    //   accounts: CURRENT (goods, services, primary & secondary income) and
    //   FINANCIAL/capital. With the change in reserves, the whole BoP sums to ZERO,
    //   so a current-account deficit must be financed by capital inflows.
    //   Travel (tourism) balance = income from foreign tourists − spending of
    //   residents abroad — Croatia's travel surplus offsets its goods deficit.
    //   Net capital export K = f(r), dK/dr < 0 (a higher r attracts capital in →
    //   currency appreciates → NX deteriorates). All items are accounting sums →
    //   integer amounts, tol 0. Randomized generate() reads p.pair.* (B2 lesson).
    // ============================================================================

    // --- Concepts: accounts, sums-to-zero, travel balance, K=f(r) -------------
    {
      id: 'b12-concepts',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'choice',
      title: 'Platna bilanca — pojmovi',
      prompt: 'Odlučite je li svaki iskaz točan ili netočan, zatim odgovorite na pitanja višestrukog izbora.',
      difficulty: 1,
      items: [
        { q: 'Platna bilanca bilježi transakcije neke zemlje s ostatkom svijeta tijekom jedne godine.', kind: 'tf', answer: true },
        { q: 'Uključujući promjenu službenih rezervi, cijela platna bilanca zbraja se na nulu.', kind: 'tf', answer: true },
        { q: 'Turistička bilanca jednaka je prihodima od stranih turista umanjenim za potrošnju rezidenata u inozemstvu.', kind: 'tf', answer: true },
        { q: 'Neto izvoz kapitala K raste kako raste domaća kamatna stopa.', kind: 'tf', answer: false },
        { q: 'Deficit tekućeg računa mora biti financiran priljevom kapitala.', kind: 'tf', answer: true },
        { q: 'Dva glavna računa platne bilance su tekući račun i:', kind: 'mc', options: ['Maržni račun', 'Financijski (kapitalni) račun', 'Državni račun', 'Stopa obvezne rezerve'], answer: 1 },
        { q: 'Potrošnja stranih turista unutar zemlje evidentira se kao:', kind: 'mc', options: ['Uvoz (odljev)', 'Izvoz (priljev)', 'Transfer u inozemstvo', 'Odljev kapitala'], answer: 1 },
        { q: 'Neto izvoz kapitala K je ___ funkcija domaće kamatne stope:', kind: 'mc', options: ['Rastuća', 'Padajuća', 'Konstantna', 'Slučajna'], answer: 1 },
        { q: 'Viša domaća kamatna stopa teži aprecijaciji valute, pa neto izvoz:', kind: 'mc', options: ['Raste', 'Pada', 'Ostaje nepromijenjen', 'Postaje nula'], answer: 1 }
      ],
      solution: [
        'Viši r privlači strani kapital (neto izvoz kapitala PADA): K = f(r) uz dK/dr < 0.',
        'Budući da se računi međusobno zrcale i zbroje na nulu, deficit tekućeg računa protuteža je suficitu financijskog (kapitalnog) računa — zemlja se zadužuje kod ostatka svijeta ili mu prodaje imovinu.'
      ]
    },

    // --- Travel (tourism) balance (numeric, fixed) ----------------------------
    {
      id: 'b12-travel-balance-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Turistička bilanca',
      prompt: 'Strani turisti potroše 12000 u zemlji, dok rezidenti potroše 4000 u inozemstvu.'
        + 'Compute the travel (tourism) balance.',
      difficulty: 1,
      fields: [
        { key: 'tb', label: 'Turistička bilanca', answer: 12000 - 4000, tol: 0, unit: '', hint: 'prihodi od stranih turista − potrošnja domaćih rezidenata u inozemstvu = 12000 − 4000' }
      ],
      solution: [
        'Turistička bilanca = prihodi od stranih turista − potrošnja domaćih rezidenata u inozemstvu = 12000 − 4000 = 8000.',
        'Pozitivna turistička bilanca (suficit) znači da je zemlja turistički receptivna: turizam je neto izvor deviznih prihoda.'
      ]
    },

    // --- Current account from its components (numeric, fixed) -----------------
    {
      id: 'b12-current-account-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Tekući račun',
      prompt: 'Zemlja bilježi: robna bilanca −5000, uslužna bilanca +9000, primarni dohodak −800,'
        + 'secondary income +300. Compute the current-account balance.',
      difficulty: 2,
      fields: [
        { key: 'ca', label: 'Tekući račun', answer: -5000 + 9000 - 800 + 300, tol: 0, unit: '', hint: 'roba + usluge + primarni dohodak + sekundarni dohodak' }
      ],
      solution: [
        'CA = −5000 + 9000 − 800 + 300 = 3500.',
        'Suficit uslužne bilance (koji uključuje turističku bilancu) više nego nadoknađuje robni deficit — suficit tekućeg računa.'
      ]
    },

    // --- Tourism offsets the goods deficit (numeric, fixed) -------------------
    {
      id: 'b12-tourism-offset-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Turizam nadoknađuje robni deficit',
      prompt: 'Malo turističko gospodarstvo bilježi robnu (trgovinsku) bilancu od −6000 (deficit robe), ali'
        + 'travel surplus of +8000. Compute their combined balance, which shows whether tourism covers the goods deficit.',
      difficulty: 2,
      fields: [
        { key: 'comb', label: 'Kombinirana bilanca', answer: -6000 + 8000, tol: 0, unit: '', hint: 'robna bilanca + turistička bilanca = −6000 + 8000' }
      ],
      solution: [
        'Kombinirano = −6000 + 8000 = +2000.',
        'Turistički suficit više nego pokriva robni deficit — upravo kao u hrvatskom slučaju, gdje turizam održava tekući račun pozitivnim.'
      ]
    },

    // --- Financing a current-account deficit (numeric, fixed) -----------------
    {
      id: 'b12-financing-fixed',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Financiranje deficita tekućeg računa',
      prompt: 'Zemlja ima deficit tekućeg računa od 2000 (CA = −2000), a službene rezerve su nepromijenjene.'
        + 'Because the balance of payments sums to zero, what financial-account balance is required, and what is the '
        + 'resulting balance of payments?',
      difficulty: 2,
      fields: [
        { key: 'fa', label: 'Potrebno stanje financijskog računa', answer: 2000, tol: 0, unit: '', hint: 'Mora se poništiti tekući račun: −(−2000)' },
        { key: 'bop', label: 'Platna bilanca', answer: 0, tol: 0, unit: '', hint: 'CA + financijski račun (rezerve nepromijenjene)' }
      ],
      solution: [
        'BoP = 0 uz nepromijenjene rezerve ⇒ financijski račun = −CA = −(−2000) = +2000 (priljev kapitala).',
        'BoP = −2000 + 2000 = 0: deficit tekućeg računa financira se zaduživanjem od / prodajom imovine ostatku svijeta.'
      ]
    },

    // --- RANDOMIZED: travel balance -------------------------------------------
    {
      id: 'b12-travel-balance-random',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Turistička bilanca — vježba',
      prompt: 'Izračunaj turističku bilancu na temelju prihoda od turista i potrošnje rezidenata u inozemstvu.',
      difficulty: 1,
      params: {
        pair: { choices: [
          { inc: 12000, exp: 4000 },
          { inc: 15000, exp: 6000 },
          { inc: 9000, exp: 2500 },
          { inc: 20000, exp: 7000 },
          { inc: 11000, exp: 3000 }
        ] }
      },
      generate(p) {
        const inc = p.pair.inc, exp = p.pair.exp;
        const tb = inc - exp;
        return {
          prompt: 'Foreign tourists spend ' + inc + ' in the country, while residents spend ' + exp + ' abroad. '
            + 'Compute the travel (tourism) balance.',
          fields: [
            { key: 'tb', label: 'Travel balance', answer: tb, tol: 0, unit: '', hint: inc + ' − ' + exp }
          ],
          solution: ['Travel balance = ' + inc + ' − ' + exp + ' = ' + tb + (tb >= 0 ? ' (surplus).' : ' (deficit).')]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove podatke. Turistička bilanca = prihodi od stranih turista − potrošnja domaćih rezidenata u inozemstvu.']
    },

    // --- RANDOMIZED: current account from components ---------------------------
    {
      id: 'b12-current-account-random',
      lesson: 'second-midterm',
      chapter: 13,
      type: 'numeric',
      title: 'Tekući račun — vježba',
      prompt: 'Zbroji četiri komponente kako bi dobio/dobila stanje tekućeg računa.',
      difficulty: 2,
      params: {
        pair: { choices: [
          { g: -5000, s: 9000, pi: -800, si: 300 },
          { g: -6000, s: 11000, pi: -1000, si: 500 },
          { g: -4000, s: 7000, pi: -500, si: 200 },
          { g: -8000, s: 12000, pi: -1200, si: 400 },
          { g: -3000, s: 6000, pi: -600, si: 100 }
        ] }
      },
      generate(p) {
        const g = p.pair.g, s = p.pair.s, pi = p.pair.pi, si = p.pair.si;
        const ca = g + s + pi + si;
        const sgn = (x) => (x >= 0 ? '+' + x : '' + x);
        return {
          prompt: 'A country records: goods balance ' + g + ', services balance ' + sgn(s) + ', primary income '
            + pi + ', secondary income ' + sgn(si) + '. Compute the current-account balance.',
          fields: [
            { key: 'ca', label: 'Current account', answer: ca, tol: 0, unit: '', hint: g + ' + ' + s + ' + (' + pi + ') + ' + si }
          ],
          solution: ['CA = ' + g + ' + ' + s + ' + (' + pi + ') + ' + si + ' = ' + ca + (ca >= 0 ? ' (surplus).' : ' (deficit).')]
        };
      },
      solution: ['Pritisni „Novi brojevi" za nove podatke. Tekući račun = roba + usluge + primarni dohodak + sekundarni dohodak.']
    }
  ]
};

if (typeof window !== 'undefined') { window.macroeconomicsHrExercises = macroeconomicsHrExercises; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsHrExercises; }
