// ===== MATEMATIKA (HR) — VJEŽBE (content pack) =====
//
// CONTENT PACK (NE engine): interaktivne, auto-ocjenjive vježbe za `math-hr` (FMTU Opatija,
// 1. godina). Generički engine (js/exercises-core.js, js/exercises.js) ne sadrži NIŠTA odavde —
// vidi docs/architecture/EXERCISES_ENGINE.md §2 (tipovi) + §3 (konvencije brojeva).
//
// IZVORI (isti kao teorija predmeta, data/math-hr/midterm-1.js · midterm-2.js · final.js):
//   - Drive, 18 fotografija 2023/24: Završni ispit grupa B (7 zadataka), Projektni zadatak 1
//     Redovni Opatija (5 zadataka — na fotografiji se formule ne vide, samo tipovi zadataka),
//     riješeni kolokvij iz bilježnice (domena, derivacija u točki, rast/pad, minimum prosječnih
//     troškova, ekstremi), bilješke „Jednadžbe”/„Domena funkcije”/„Elastičnost”/„Troškovi”,
//     „Formulas for 2. Midterm” 2023/24 s dopisanim formulama.
//   - Merlin: 1. demonstrature (dvije verzije), 2. i 3. demonstrature.
//   - Oblik i dio zadataka: EN pack istog FMTU kolegija (data/math/exercises.js).
//   Zapis = teorija predmeta: T(Q), T̄(Q), M(Q)=T'(Q), P(Q), P̄(Q), D(Q)=P−T; E = (p/q)·dq/dp;
//   S_n (pre) / S_n' (post) buduća, A_n' (pre) / A_n (post) sadašnja vrijednost rente;
//   zajam a_k = R_k + I_k, I_k = C_{k−1}·p/100; otvoreni interval ⟨a, b⟩.
//
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// KONVENCIJE:
//   - Tipovi: choice / numeric. `lesson` = 'first-midterm' | 'second-midterm' (engine filtrira po
//     lekciji; final ostaje bez vlastitih vježbi, kao u ostalim predmetima). `chapter` = redni broj
//     teme (1–7 = M1, 8–12 = M2), `category` = ključ teme u teoriji (engine ga ignorira).
//   - ⚠ parseAmount: engine čita JEDAN separator + TOČNO 3 znamenke kao TISUĆE („2,927” → 2927;
//     „0,927” je ispravno decimalni). Zato je svaki očekivani odgovor zaokružen na NAJVIŠE 2
//     decimale kad je cijeli dio ≠ 0, a tekst zadatka traži zaokruživanje na 2 decimale. Jedina
//     iznimka su odgovori s cijelim dijelom 0 (elastičnost −0,0204 — traži se na 4 decimale).
//   - Tolerancije: cijeli brojevi 0,01 · zaokruženo na 2 decimale 0,01–0,02 · iznosi dobiveni
//     potenciranjem (rente, anuitet) 0,5 € (dopušta r^n nošen na 6 decimala, kako traži teorija).
//   - KaTeX samo \( \) / \[ \] — NIKAD jedan dolar. Decimalni zarez u formuli 3{,}45; iznosi u
//     eurima izvan formule („15 242,07 €”). HTML se ne koristi (engine sve escapea).
//   - MathLib (data/math/math-lib.js) se učitava PRIJE ove datoteke; ovdje se koristi samo
//     preko lokalne reference unutar IIFE-a → jedini globalni naziv je `mathHrExercises`
//     (EN pack istovremeno drži `mathExercises` i `var ML`; nema sudara).
//
// ⚠ Vježbe su KÔD (generate) → učitavaju se uvijek iz .js preko content.codeScripts (BUG-012).

const mathHrExercises = (function () {
  'use strict';

  const ML = (typeof window !== 'undefined' && window.MathLib) ? window.MathLib
    : (typeof require !== 'undefined' ? require('../math/math-lib.js') : null);

  // ---------- pomoćne funkcije (formatiranje i mala matematika) ----------
  function rnd(x, d) {
    const m = Math.pow(10, d == null ? 2 : d);
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
  // KaTeX inačice: {,} za decimalni zarez, \, za tisuće, obični minus.
  function toK(s) { return s.replace(',', '{,}').replace(/ /g, '\\,').replace('−', '-'); }
  function kf(x, d) { return toK(fmt(x, d)); }
  function kn(x, d) { return toK(num(x, d)); }
  // Negativan broj u zagradi (za uvrštavanje): (−3).
  function kp(x, d) { const s = kn(x, d); return x < 0 ? '(' + s + ')' : s; }
  function eur(x) { return fmt(x, 2) + ' €'; }
  function eurN(x) { return num(x, 2) + ' €'; }

  // Član polinoma u KaTeX-u: term(−3, 'x^2', true) → '-3x^2'; term(1, 'x', false) → '+x'.
  function term(c, sym, first) {
    if (c === 0) return '';
    const abs = Math.abs(c);
    const coef = (abs === 1 && sym) ? '' : kn(abs, 4);
    const sign = c < 0 ? '-' : (first ? '' : '+');
    return sign + coef + sym;
  }
  function poly(terms) {
    let out = '';
    terms.forEach(function (t) { out += term(t[0], t[1], out === ''); });
    return out || '0';
  }
  function gcd(a, b) {
    if (ML && ML.gcd) return ML.gcd(a, b);
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = b; b = a % b; a = t; }
    return a || 1;
  }
  function interval(a, b) { return '\\langle ' + a + ',\\ ' + b + '\\rangle'; }
  // Slaganje broja i imenice (akuzativ): 1 godinu · 2–4 godine · 5+ godina (11–14 godina).
  function god(n) {
    const d = n % 10, s = n % 100;
    if (d === 1 && s !== 11) return n + ' godinu';
    if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return n + ' godine';
    return n + ' godina';
  }
  // Koeficijent ispred zagrade: 1 se ne piše.
  function kc(c) { return c === 1 ? '' : (c === -1 ? '-' : kn(c)); }
  // k · izraz: 1 se ne piše, zagrada samo kad izraz ima više članova (3(x+2), 3x, x+2).
  // Izraz u zagradi ako ima više članova ili počinje minusom (za „+(…)” i „·(…)”).
  function par(e) { return (/[+-]/.test(e.slice(1)) || e[0] === '-') ? '(' + e + ')' : e; }
  //   afterMinus: izraz stoji iza minusa → zagrada ostaje i kad je k = 1 (−(x+13)).
  function mul(k, e, afterMinus) {
    const simple = !/[+-]/.test(e.slice(1));
    const paren = !simple && (k !== 1 || afterMinus);
    return (k === 1 ? '' : kn(k)) + (paren ? '(' + e + ')' : e);
  }

  // Otplatna tablica zajma s nominalno jednakim anuitetima (krajem razdoblja, dekurzivno).
  // Svaki redak se zaokružuje na cente; zadnja kvota = preostali dug (kao u teoriji, ZI 2023/24).
  function loanTable(C, p, n) {
    const r = 1 + p / 100, rn = Math.pow(r, n);
    const a = r2(C * rn * (r - 1) / (rn - 1));
    const rows = [];
    let prev = C, sumA = 0, sumI = 0, sumR = 0;
    for (let k = 1; k <= n; k++) {
      const I = r2(prev * p / 100);
      const R = k === n ? prev : r2(a - I);
      const A = k === n ? r2(R + I) : a;
      const rest = r2(prev - R);
      rows.push({ k: k, a: A, I: I, R: R, C: rest });
      sumA += A; sumI += I; sumR += R;
      prev = rest;
    }
    return { a: a, rn: rn, rows: rows, sumA: r2(sumA), sumI: r2(sumI), sumR: r2(sumR) };
  }

  const TOL_POW = 0.5; // iznosi dobiveni iz r^n unutar razlomka (rente, anuitet)

  const exercises = [
    // =====================================================================
    // 1. SKUPOVI BROJEVA, LINEARNE I KVADRATNE JEDNADŽBE (first-midterm, equations)
    // =====================================================================
    {
      id: 'mhr1-pojmovi',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'choice',
      title: 'Skupovi brojeva i kvadratna jednadžba — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna ili netočna, zatim odgovorite na pitanja s ponuđenim odgovorima.',
      difficulty: 1,
      items: [
        { q: 'Svaki prirodni broj je i cijeli broj (\\(\\mathbb{N}\\subset\\mathbb{Z}\\)).', kind: 'tf', answer: true },
        { q: '\\(\\sqrt2\\) je racionalan broj.', kind: 'tf', answer: false },
        { q: 'Ako je \\(D<0\\), kvadratna jednadžba nema realnih rješenja; rješenja su konjugirano kompleksna.', kind: 'tf', answer: true },
        { q: 'Jednadžbu \\(3x^2+21x=0\\) smijemo podijeliti s x.', kind: 'tf', answer: false },
        { q: 'Rješenja jednadžbe \\(x^2-2x+5=0\\) su:', kind: 'mc', options: ['\\(1\\pm2i\\)', '\\(\\pm4i\\)', '\\(1\\pm\\sqrt6\\)', '\\(-1\\pm2i\\)'], answer: 0 },
        { q: 'Diskriminanta jednadžbe \\(9x^2-12x+4=0\\) iznosi:', kind: 'mc', options: ['\\(144\\)', '\\(0\\)', '\\(-144\\)', '\\(288\\)'], answer: 1 },
        { q: '\\(\\sqrt{-16}=\\)', kind: 'mc', options: ['\\(-4\\)', '\\(4i\\)', '\\(\\pm4\\)', 'nije definiran ni u ℂ'], answer: 1 }
      ],
      solution: [
        '\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\subset\\mathbb{C}\\); \\(\\sqrt2\\) ima beskonačan neperiodičan zapis → iracionalan.',
        'Kod \\(3x^2+21x=0\\) izlučujemo: \\(3x(x+7)=0\\). Dijeljenjem s x izgubili bismo rješenje \\(x=0\\).',
        '\\(x^2-2x+5=0\\): \\(D=4-20=-16\\), \\(\\sqrt{-16}=4i\\), \\(x_{1,2}=\\frac{2\\pm4i}{2}=1\\pm2i\\) (u materijalima kruže netočni \\(\\pm4i\\) i \\(1\\pm\\sqrt6\\)).',
        '\\(9x^2-12x+4=0\\): \\(D=144-144=0\\) → jedno dvostruko rješenje \\(x=\\frac23\\).'
      ]
    },

    {
      id: 'mhr1-linearna-zagrade-random',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Linearna jednadžba sa zagradama',
      prompt: 'Oslobodite zagrade, nepoznanice prebacite na jednu stranu i podijelite koeficijentom.',
      difficulty: 1,
      params: {
        a: { choices: [2, 3, 4] },
        b: { choices: [1, 2, 3, 5] },
        u: { min: 1, max: 6, step: 1 },
        v: { min: 1, max: 6, step: 1 },
        s0: { choices: [1, 2, 3, 4] },
        x: { min: -5, max: 9, step: 1 }
      },
      generate(p) {
        const s = (p.a + p.b === p.s0) ? p.s0 + 1 : p.s0;
        const k = p.a + p.b - s;
        const t = p.a * (p.x - p.u) + p.b * (p.x - p.v) - s * p.x;
        const konst = p.a * p.u + p.b * p.v;
        return {
          prompt: 'Riješite jednadžbu \\(' + p.a + '(x-' + p.u + ')+' + kc(p.b) + '(x-' + p.v + ')=' + poly([[s, 'x'], [t, '']]) + '\\).',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'Oslobodi zagrade, nepoznanice lijevo, brojeve desno.' }
          ],
          solution: [
            'Oslobodimo zagrade: \\(' + poly([[p.a + p.b, 'x'], [-konst, '']]) + '=' + poly([[s, 'x'], [t, '']]) + '\\).',
            'Nepoznanice lijevo, brojevi desno: \\(' + poly([[k, 'x']]) + '=' + kn(t + konst) + '\\).',
            'Podijelimo s ' + num(k) + ': \\(x=' + kn(p.x) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. Postupak: zagrade → nepoznanice na jednu stranu → podijeli koeficijentom.']
    },

    {
      id: 'mhr1-linearna-razlomci-random',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Linearna jednadžba s razlomcima',
      prompt: 'Uklonite razlomke množenjem zajedničkim nazivnikom i riješite jednadžbu.',
      difficulty: 2,
      params: {
        m: { choices: [2, 3, 4] },
        n: { choices: [5, 6] },
        x: { min: -6, max: 10, step: 1 },
        k1: { min: -3, max: 4, step: 1 },
        k2: { min: -3, max: 4, step: 1 }
      },
      generate(p) {
        const a = p.m * p.k1 - p.x;
        const b = p.x - p.n * p.k2;
        const c = p.k1 - p.k2;
        const L = p.m * p.n / gcd(p.m, p.n);
        const fm = L / p.m, fn = L / p.n;
        const coefX = fm - fn;
        const rhs = L * c - fm * a - fn * b;
        const num1 = poly([[1, 'x'], [a, '']]);
        const num2 = poly([[1, 'x'], [-b, '']]);
        return {
          prompt: 'Riješite jednadžbu \\(\\frac{' + num1 + '}{' + p.m + '}-\\frac{' + num2 + '}{' + p.n + '}=' + kn(c) + '\\).',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'Najmanji zajednički nazivnik je ' + L + '.' }
          ],
          solution: [
            'Pomnožimo cijelu jednadžbu s ' + L + ': \\(' + mul(fm, num1) + '-' + mul(fn, num2, true) + '=' + kn(L * c) + '\\).',
            'Oslobodimo zagrade: \\(' + poly([[fm, 'x'], [fm * a, '']]) + poly([[-fn, 'x'], [fn * b, '']]) + '=' + kn(L * c) + '\\).',
            coefX === 1 ? 'Sredimo: \\(x=' + kn(p.x) + '\\).'
              : 'Sredimo: \\(' + poly([[coefX, 'x']]) + '=' + kn(rhs) + '\\Rightarrow x=' + kn(p.x) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. Najprije pomnoži najmanjim zajedničkim nazivnikom, pa riješi kao običnu linearnu jednadžbu.']
    },

    {
      id: 'mhr1-kvadratna-random',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Kvadratna jednadžba — diskriminanta i rješenja',
      prompt: 'Formula: \\(x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\).',
      difficulty: 2,
      params: {
        a: { choices: [1, 2, 3] },
        r1: { min: -6, max: 2, step: 1 },
        gap: { min: 1, max: 7, step: 1 }
      },
      generate(p) {
        const x1 = p.r1, x2 = p.r1 + p.gap;
        const b = -p.a * (x1 + x2), c = p.a * x1 * x2;
        const D = b * b - 4 * p.a * c;
        const sD = Math.sqrt(D);
        return {
          prompt: 'Riješite jednadžbu \\(' + poly([[p.a, 'x^2'], [b, 'x'], [c, '']]) + '=0\\). Upišite diskriminantu \\(D=b^2-4ac\\) i rješenja (manje prvo).',
          fields: [
            { key: 'D', label: 'Diskriminanta D', answer: D, tol: 0.01, unit: '', hint: 'a = ' + p.a + ', b = ' + num(b) + ', c = ' + num(c) },
            { key: 'x1', label: 'x₁ (manje rješenje)', answer: x1, tol: 0.01, unit: '', hint: '\\(x=\\frac{-b-\\sqrt D}{2a}\\)' },
            { key: 'x2', label: 'x₂ (veće rješenje)', answer: x2, tol: 0.01, unit: '', hint: '\\(x=\\frac{-b+\\sqrt D}{2a}\\)' }
          ],
          solution: [
            '\\(a=' + p.a + ',\\ b=' + kn(b) + ',\\ c=' + kn(c) + '\\).',
            '\\(D=' + kp(b) + '^2-4\\cdot' + p.a + '\\cdot' + kp(c) + '=' + kn(D) + '\\), \\(\\sqrt D=' + kn(sD) + '\\).',
            '\\(x_{1,2}=\\frac{' + kn(-b) + '\\pm' + kn(sD) + '}{' + (2 * p.a) + '}\\Rightarrow x_1=' + kn(x1) + ',\\ x_2=' + kn(x2) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. \\(D=b^2-4ac\\), \\(x_{1,2}=\\frac{-b\\pm\\sqrt D}{2a}\\).']
    },

    {
      id: 'mhr1-kvadratna-demonstrature',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Kvadratne jednadžbe s demonstratura',
      prompt: 'Riješite obje jednadžbe iz bilježnice/demonstratura: a) \\(16x^2-8x-3=0\\), b) \\(3x^2+11x-4=0\\). Rješenja upišite na 2 decimale.',
      difficulty: 2,
      fields: [
        { key: 'Da', label: 'a) diskriminanta', answer: 256, tol: 0.01, unit: '', hint: '\\(64-4\\cdot16\\cdot(-3)\\)' },
        { key: 'x1a', label: 'a) manje rješenje', answer: -0.25, tol: 0.01, unit: '', hint: '\\(\\frac{8-16}{32}\\)' },
        { key: 'x2a', label: 'a) veće rješenje', answer: 0.75, tol: 0.01, unit: '', hint: '\\(\\frac{8+16}{32}\\)' },
        { key: 'Db', label: 'b) diskriminanta', answer: 169, tol: 0.01, unit: '', hint: '\\(121-4\\cdot3\\cdot(-4)\\)' },
        { key: 'x1b', label: 'b) manje rješenje', answer: -4, tol: 0.01, unit: '', hint: '\\(\\frac{-11-13}{6}\\)' },
        { key: 'x2b', label: 'b) veće rješenje (2 decimale)', answer: 0.33, tol: 0.01, unit: '', hint: '\\(\\frac{-11+13}{6}=\\frac13\\)' }
      ],
      solution: [
        'a) \\(a=16,\\ b=-8,\\ c=-3\\): \\(D=64+192=256\\), \\(x_{1,2}=\\frac{8\\pm16}{32}\\Rightarrow x_1=-\\frac14=-0{,}25,\\ x_2=\\frac34=0{,}75\\).',
        'b) \\(a=3,\\ b=11,\\ c=-4\\): \\(D=121+48=169\\), \\(x_{1,2}=\\frac{-11\\pm13}{6}\\Rightarrow x_1=-4,\\ x_2=\\frac13\\approx0{,}33\\).',
        'Provjera Vièteom za b): \\(-4+\\frac13=-\\frac{11}{3}=-\\frac ba\\) ✓.'
      ]
    },

    {
      id: 'mhr1-nepotpuna-random',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Nepotpune kvadratne jednadžbe (bez formule)',
      prompt: 'Bez formule — izlučivanjem odnosno korjenovanjem:',
      difficulty: 1,
      params: {
        a: { choices: [1, 2, 3, 4] },
        k: { choices: [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7] },
        a2: { choices: [1, 2, 3, 4, 5] },
        r: { min: 2, max: 9, step: 1 }
      },
      generate(p) {
        const b = -p.a * p.k;
        const c = p.a2 * p.r * p.r;
        return {
          prompt: 'a) \\(' + poly([[p.a, 'x^2'], [b, 'x']]) + '=0\\) · b) \\(' + poly([[p.a2, 'x^2'], [-c, '']]) + '=0\\).',
          fields: [
            { key: 'xa', label: 'a) rješenje različito od nule', answer: p.k, tol: 0.01, unit: '', hint: 'Izluči x: x(ax + b) = 0' },
            { key: 'xb', label: 'b) pozitivno rješenje', answer: p.r, tol: 0.01, unit: '', hint: 'x² = c ÷ a, pa x = ±√(c ÷ a)' }
          ],
          solution: [
            'a) \\(x(' + poly([[p.a, 'x'], [b, '']]) + ')=0\\Rightarrow x_1=0,\\ x_2=' + kn(p.k) + '\\). Ne dijelimo s x.',
            'b) \\(' + (p.a2 === 1 ? '' : poly([[p.a2, 'x^2']]) + '=' + c + '\\Rightarrow ') + 'x^2=' + (p.r * p.r) + '\\Rightarrow x_{1,2}=\\pm' + p.r + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove jednadžbe. Bez c: izluči x. Bez b: izrazi x² pa korjenuj (dva predznaka).']
    },

    {
      id: 'mhr1-kompleksna-random',
      lesson: 'first-midterm', chapter: 1, category: 'equations',
      type: 'numeric',
      title: 'Kvadratna jednadžba s kompleksnim rješenjima',
      prompt: 'Diskriminanta je negativna — rješenja tražimo u skupu ℂ u obliku \\(a\\pm bi\\).',
      difficulty: 2,
      params: {
        al: { min: -5, max: 5, step: 1 },
        be: { min: 1, max: 6, step: 1 }
      },
      generate(p) {
        const b = -2 * p.al, c = p.al * p.al + p.be * p.be;
        const D = b * b - 4 * c;
        return {
          prompt: 'Riješite \\(' + poly([[1, 'x^2'], [b, 'x'], [c, '']]) + '=0\\) u skupu ℂ. Upišite diskriminantu, realni dio i (pozitivni) imaginarni dio rješenja \\(x_{1,2}=a\\pm bi\\).',
          fields: [
            { key: 'D', label: 'Diskriminanta D', answer: D, tol: 0.01, unit: '', hint: 'b² − 4ac' },
            { key: 're', label: 'Realni dio a', answer: p.al, tol: 0.01, unit: '', hint: '−b ÷ 2a' },
            { key: 'im', label: 'Imaginarni dio b (> 0)', answer: p.be, tol: 0.01, unit: '', hint: '√|D| ÷ 2a' }
          ],
          solution: [
            '\\(D=' + kp(b) + '^2-4\\cdot1\\cdot' + c + '=' + kn(D) + '\\), \\(\\sqrt{' + kn(D) + '}=' + (2 * p.be) + 'i\\).',
            '\\(x_{1,2}=\\frac{' + kn(-b) + '\\pm' + (2 * p.be) + 'i}{2}=' + kn(p.al) + '\\pm ' + (p.be === 1 ? '' : p.be) + 'i\\) — brojnik se dijeli s 2 u cijelosti.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. \\(\\sqrt{-k}=i\\sqrt k\\); oba dijela brojnika dijele se s 2a.']
    },

    // =====================================================================
    // 2. JEDNADŽBE KOJE SE SVODE NA KVADRATNE (first-midterm, reducibleEquations)
    // =====================================================================
    {
      id: 'mhr2-bikvadratna-random',
      lesson: 'first-midterm', chapter: 2, category: 'reducibleEquations',
      type: 'numeric',
      title: 'Bikvadratna jednadžba (t = x²)',
      prompt: 'Bikvadratna jednadžba — uvedite supstituciju \\(t=x^2\\).',
      difficulty: 2,
      params: {
        t1: { choices: [-9, -4, -1, 1, 4] },
        t2: { choices: [9, 16, 25, 36] }
      },
      generate(p) {
        const B = -(p.t1 + p.t2), Cc = p.t1 * p.t2;
        const nReal = p.t1 > 0 ? 4 : 2;
        const s1 = Math.sqrt(Math.abs(p.t1)), s2 = Math.sqrt(p.t2);
        return {
          prompt: 'Riješite \\(' + poly([[1, 'x^4'], [B, 'x^2'], [Cc, '']]) + '=0\\). Upišite oba rješenja po t (manje prvo), broj REALNIH rješenja po x i najveće realno rješenje.',
          fields: [
            { key: 't1', label: 't₁ (manji)', answer: p.t1, tol: 0.01, unit: '', hint: '\\(t^2' + term(B, 't', false) + term(Cc, '', false) + '=0\\)' },
            { key: 't2', label: 't₂ (veći)', answer: p.t2, tol: 0.01, unit: '', hint: 'Formula za kvadratnu jednadžbu po t' },
            { key: 'n', label: 'Broj realnih rješenja', answer: nReal, tol: 0.01, unit: '', hint: 'Pozitivan t daje dva realna, negativan dva kompleksna' },
            { key: 'max', label: 'Najveće realno rješenje', answer: s2, tol: 0.01, unit: '', hint: '√t₂' }
          ],
          solution: [
            '\\(t=x^2\\): \\(t^2' + term(B, 't', false) + term(Cc, '', false) + '=0\\Rightarrow t_1=' + kn(p.t1) + ',\\ t_2=' + p.t2 + '\\).',
            p.t1 > 0
              ? '\\(x^2=' + p.t1 + '\\Rightarrow x_{1,2}=\\pm' + s1 + '\\); \\(x^2=' + p.t2 + '\\Rightarrow x_{3,4}=\\pm' + s2 + '\\) — četiri realna rješenja.'
              : '\\(x^2=' + kn(p.t1) + '\\Rightarrow x_{1,2}=\\pm ' + (s1 === 1 ? '' : s1) + 'i\\) (kompleksna); \\(x^2=' + p.t2 + '\\Rightarrow x_{3,4}=\\pm' + s2 + '\\) — dva realna rješenja.',
            'Najveće realno rješenje: ' + num(s2) + '.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. Supstitucija \\(t=x^2\\), zatim \\(x=\\pm\\sqrt t\\) za svaki t (negativan t → kompleksna rješenja).']
    },

    {
      id: 'mhr2-iracionalna-random',
      lesson: 'first-midterm', chapter: 2, category: 'reducibleEquations',
      type: 'numeric',
      title: 'Iracionalna jednadžba — pravo i lažno rješenje',
      prompt: 'Kvadriranje može unijeti lažno rješenje — provjera u početnoj jednadžbi je obavezna.',
      difficulty: 3,
      params: {
        d: { choices: [1, 2, 3] },
        k: { min: 1, max: 3, step: 1 },
        m: { min: 0, max: 4, step: 1 }
      },
      generate(p) {
        const x1 = p.k + p.m;            // pravo rješenje (x1 + d > 0)
        const x2 = -p.d - p.k;           // lažno (x2 + d = −k < 0)
        const a = p.d + p.m;             // = 2d + x1 + x2 ≥ 1
        const b = p.d * p.d - x1 * x2;   // > 0
        const lin = poly([[a, 'x'], [b, '']]);
        const qb = 2 * p.d - a, qc = p.d * p.d - b;
        return {
          prompt: 'Riješite jednadžbu \\(\\sqrt{' + lin + '}=x+' + p.d + '\\). Upišite rješenje koje prolazi provjeru i ono koje otpada.',
          fields: [
            { key: 'ok', label: 'Rješenje jednadžbe', answer: x1, tol: 0.01, unit: '', hint: 'Kvadriraj obje strane, pa riješi kvadratnu jednadžbu' },
            { key: 'bad', label: 'Lažno rješenje (otpada nakon provjere)', answer: x2, tol: 0.01, unit: '', hint: 'Korijen je uvijek ≥ 0 — desna strana ne smije biti negativna' }
          ],
          solution: [
            'Kvadriramo: \\(' + lin + '=(x+' + p.d + ')^2=x^2+' + (2 * p.d) + 'x+' + (p.d * p.d) + '\\Rightarrow ' + poly([[1, 'x^2'], [qb, 'x'], [qc, '']]) + '=0\\).',
            'Rješenja: \\(x_1=' + kn(x1) + ',\\ x_2=' + kn(x2) + '\\).',
            'Provjera \\(x_1\\): \\(\\sqrt{' + (a * x1 + b) + '}=' + (x1 + p.d) + '\\) ✓. Provjera \\(x_2\\): \\(\\sqrt{' + (a * x2 + b) + '}=' + Math.abs(x2 + p.d) + '\\neq' + kn(x2 + p.d) + '\\) → otpada.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu jednadžbu. Izoliraj korijen → kvadriraj → riješi → OBAVEZNO provjeri u početnoj jednadžbi.']
    },

    {
      id: 'mhr2-problem-dob-random',
      lesson: 'first-midterm', chapter: 2, category: 'reducibleEquations',
      type: 'numeric',
      title: 'Problemski zadatak — godine',
      prompt: 'Postavite kvadratnu jednadžbu iz teksta i odbacite rješenje bez smisla.',
      difficulty: 2,
      params: {
        b: { min: 3, max: 15, step: 1 },
        k: { min: 2, max: 6, step: 1 }
      },
      generate(p) {
        const s = p.b + p.k, P = s * p.b;
        const D = p.k * p.k + 4 * P, sD = Math.sqrt(D);
        return {
          prompt: 'Sofija je ' + god(p.k) + ' starija od brata, a umnožak njihovih godina je ' + P + '. Koliko godina ima Sofija, a koliko brat?',
          fields: [
            { key: 's', label: 'Sofija (godina)', answer: s, tol: 0.01, unit: '', hint: 'brat = s − ' + p.k + ', pa s(s − ' + p.k + ') = ' + P },
            { key: 'b', label: 'Brat (godina)', answer: p.b, tol: 0.01, unit: '', hint: 's − ' + p.k }
          ],
          solution: [
            '\\(b=s-' + p.k + '\\), \\(s\\cdot b=' + P + '\\Rightarrow s^2-' + p.k + 's-' + P + '=0\\).',
            '\\(D=' + (p.k * p.k) + '+' + (4 * P) + '=' + D + '\\), \\(s_{1,2}=\\frac{' + p.k + '\\pm' + sD + '}{2}\\Rightarrow s_1=' + s + ',\\ s_2=' + kn(-p.b) + '\\).',
            'Negativna dob otpada: Sofija ima ' + s + ', a brat ' + god(p.b) + ' (' + s + ' · ' + p.b + ' = ' + P + ' ✓).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Označi nepoznanicu, prevedi tekst u jednadžbu, odbaci rješenje bez smisla.']
    },

    // =====================================================================
    // 3. FUNKCIJE I PRIRODNA DOMENA (first-midterm, functions)
    // =====================================================================
    {
      id: 'mhr3-domena-pojmovi',
      lesson: 'first-midterm', chapter: 3, category: 'functions',
      type: 'choice',
      title: 'Prirodna domena — pojmovi',
      prompt: 'Odredite prirodnu domenu (nazivnik ≠ 0 · parni korijen ≥ 0 · argument logaritma > 0).',
      difficulty: 1,
      items: [
        { q: 'Domena polinoma \\(f(x)=4x^4-x^2+15x\\) je \\(\\mathbb{R}\\).', kind: 'tf', answer: true },
        { q: 'Za \\(f(x)=e^{\\frac{3x^2-1}{x}}\\) vrijedi \\(D_f=\\mathbb{R}\\).', kind: 'tf', answer: false },
        { q: 'Argument logaritma smije biti jednak nuli.', kind: 'tf', answer: false },
        { q: 'Domena funkcije \\(f(x)=\\frac{x^2-4}{x+2}\\) određuje se iz početne formule, prije skraćivanja.', kind: 'tf', answer: true },
        { q: 'Domena funkcije \\(f(x)=\\frac{3x^6-5x^2-17x^3}{-x+7}\\) je:', kind: 'mc', options: ['\\(\\mathbb{R}\\)', '\\(\\mathbb{R}\\setminus\\{7\\}\\)', '\\(\\mathbb{R}\\setminus\\{-7\\}\\)', '\\(\\langle7,+\\infty\\rangle\\)'], answer: 1 },
        { q: 'Domena funkcije \\(f(x)=\\ln\\frac{x-4}{x+2}\\) je:', kind: 'mc', options: ['\\(\\langle-2,4\\rangle\\)', '\\(\\langle-\\infty,-2\\rangle\\cup\\langle4,+\\infty\\rangle\\)', '\\(\\langle4,+\\infty\\rangle\\)', '\\(\\mathbb{R}\\setminus\\{-2\\}\\)'], answer: 1 },
        { q: 'Domena funkcije \\(f(x)=\\sqrt{4-x}\\) je:', kind: 'mc', options: ['\\(\\langle-\\infty,4]\\)', '\\([4,+\\infty\\rangle\\)', '\\(\\langle-\\infty,4\\rangle\\)', '\\(\\mathbb{R}\\)'], answer: 0 }
      ],
      solution: [
        'Polinom nema ograničenja → \\(\\mathbb{R}\\). Eksponent \\(\\frac{3x^2-1}{x}\\) traži \\(x\\neq0\\) → \\(\\mathbb{R}\\setminus\\{0\\}\\) (u jednoj bilježnici netočno piše ℝ).',
        'Kolokvij: \\(-x+7\\neq0\\Rightarrow D_f=\\mathbb{R}\\setminus\\{7\\}\\); \\(\\frac{x-4}{x+2}>0\\) → tablica predznaka + | − | + → \\(\\langle-\\infty,-2\\rangle\\cup\\langle4,+\\infty\\rangle\\).',
        '\\(4-x\\geq0\\Rightarrow x\\leq4\\): kod korijena je rub uključen, kod logaritma nije.'
      ]
    },

    {
      id: 'mhr3-domena-random',
      lesson: 'first-midterm', chapter: 3, category: 'functions',
      type: 'numeric',
      title: 'Domena logaritma razlomka i korijena',
      prompt: 'Odredite rubove intervala prirodne domene.',
      difficulty: 2,
      params: {
        a: { min: 1, max: 6, step: 1 },
        b: { min: 1, max: 6, step: 1 },
        d: { choices: [1, 2, 3] },
        k: { min: -3, max: 6, step: 1 }
      },
      generate(p) {
        const c = p.d * p.k;
        return {
          prompt: 'a) \\(f(x)=\\ln\\frac{x-' + p.a + '}{x+' + p.b + '}\\): domena je oblika \\(D_f=\\langle-\\infty,A\\rangle\\cup\\langle B,+\\infty\\rangle\\) — upišite A i B. '
            + 'b) \\(g(x)=\\sqrt{' + poly([[c, ''], [-p.d, 'x']]) + '}\\): domena je \\(\\langle-\\infty,G]\\) — upišite G.',
          fields: [
            { key: 'A', label: 'a) A', answer: -p.b, tol: 0.01, unit: '', hint: 'Nultočka nazivnika' },
            { key: 'B', label: 'a) B', answer: p.a, tol: 0.01, unit: '', hint: 'Nultočka brojnika' },
            { key: 'G', label: 'b) G', answer: p.k, tol: 0.01, unit: '', hint: 'Izraz pod korijenom ≥ 0' }
          ],
          solution: [
            'a) Uvjet \\(\\frac{x-' + p.a + '}{x+' + p.b + '}>0\\). Nultočke: \\(x=' + p.a + '\\) (brojnik) i \\(x=' + kn(-p.b) + '\\) (nazivnik).',
            'Tablica predznaka: na \\(' + interval('-\\infty', kn(-p.b)) + '\\) oba faktora negativna (+), na \\(' + interval(kn(-p.b), p.a) + '\\) različitog predznaka (−), na \\(' + interval(p.a, '+\\infty') + '\\) oba pozitivna (+).',
            '\\(D_f=' + interval('-\\infty', kn(-p.b)) + '\\cup' + interval(p.a, '+\\infty') + '\\).',
            'b) \\(' + poly([[c, ''], [-p.d, 'x']]) + '\\geq0\\Rightarrow ' + term(p.d, 'x', true) + '\\leq' + kn(c) + '\\Rightarrow x\\leq' + kn(p.k) + '\\), pa \\(D_g=\\langle-\\infty,' + kn(p.k) + ']\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove funkcije. Logaritam: argument > 0 (tablica predznaka); korijen: izraz ≥ 0 (rub uključen).']
    },

    {
      id: 'mhr3-ekonomske-random',
      lesson: 'first-midterm', chapter: 3, category: 'functions',
      type: 'numeric',
      title: 'Ekonomske funkcije — prosječni troškovi, prihod i dobit',
      prompt: 'Vrijedi \\(\\bar T=\\frac{T}{Q}\\), \\(P=\\bar P\\cdot Q\\), \\(D=P-T\\).',
      difficulty: 1,
      params: {
        a: { choices: [1, 2] },
        b: { min: -12, max: -2, step: 2 },
        c: { choices: [40, 60, 80, 100] },
        k: { choices: [1, 2, 3] },
        m: { choices: [100, 150, 200] },
        Q0: { min: 2, max: 8, step: 1 }
      },
      generate(p) {
        const Tbar = p.a * p.Q0 * p.Q0 + p.b * p.Q0 + p.c;
        const T = Tbar * p.Q0;
        const Pbar = -p.k * p.Q0 + p.m;
        const P = Pbar * p.Q0;
        const D = P - T;
        return {
          prompt: 'Ukupni troškovi su \\(T(Q)=' + poly([[p.a, 'Q^3'], [p.b, 'Q^2'], [p.c, 'Q']]) + '\\), a prosječni prihod \\(\\bar P(Q)=' + poly([[-p.k, 'Q'], [p.m, '']]) + '\\). '
            + 'Za \\(Q=' + p.Q0 + '\\) izračunajte prosječne troškove, ukupni prihod i dobit.',
          fields: [
            { key: 'Tbar', label: 'T̄(' + p.Q0 + ')', answer: Tbar, tol: 0.01, unit: '', hint: '\\(\\bar T(Q)=\\frac{T(Q)}{Q}\\)' },
            { key: 'P', label: 'P(' + p.Q0 + ')', answer: P, tol: 0.01, unit: '', hint: '\\(P(Q)=\\bar P(Q)\\cdot Q\\)' },
            { key: 'D', label: 'D(' + p.Q0 + ')', answer: D, tol: 0.01, unit: '', hint: '\\(D(Q)=P(Q)-T(Q)\\)' }
          ],
          solution: [
            '\\(\\bar T(Q)=\\frac{T(Q)}{Q}=' + poly([[p.a, 'Q^2'], [p.b, 'Q'], [p.c, '']]) + '\\Rightarrow\\bar T(' + p.Q0 + ')=' + kn(Tbar) + '\\).',
            '\\(P(Q)=\\bar P(Q)\\cdot Q=' + poly([[-p.k, 'Q^2'], [p.m, 'Q']]) + '\\Rightarrow P(' + p.Q0 + ')=' + kn(P) + '\\).',
            '\\(T(' + p.Q0 + ')=\\bar T(' + p.Q0 + ')\\cdot' + p.Q0 + '=' + kn(T) + '\\), pa \\(D(' + p.Q0 + ')=' + kn(P) + '-' + kp(T) + '=' + kn(D) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove funkcije. \\(\\bar T=T/Q\\), \\(P=\\bar P\\cdot Q\\), \\(D=P-T\\).']
    },

    // =====================================================================
    // 4. DERIVACIJE (first-midterm, derivatives)
    // =====================================================================
    {
      id: 'mhr4-tablica-pravila',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'choice',
      title: 'Tablica derivacija i pravila',
      prompt: 'Provjerite znate li tablicu derivacija i pravila deriviranja.',
      difficulty: 1,
      items: [
        { q: '\\((e^x)\'=e^x\\).', kind: 'tf', answer: true },
        { q: '\\((\\cos x)\'=\\sin x\\).', kind: 'tf', answer: false },
        { q: 'Derivacija umnoška jednaka je umnošku derivacija.', kind: 'tf', answer: false },
        { q: 'Derivacija konstante (npr. fiksnih troškova 8000) je 0.', kind: 'tf', answer: true },
        { q: '\\((\\ln(3x^2+5))\'=\\)', kind: 'mc', options: ['\\(\\frac{1}{3x^2+5}\\)', '\\(\\frac{6x}{3x^2+5}\\)', '\\(\\frac{6x}{(3x^2+5)^2}\\)', '\\(6x\\ln(3x^2+5)\\)'], answer: 1 },
        { q: '\\(\\left(\\frac fg\\right)\'=\\)', kind: 'mc', options: ['\\(\\frac{f\'g-fg\'}{g^2}\\)', '\\(\\frac{f\'g+fg\'}{g^2}\\)', '\\(\\frac{f\'}{g\'}\\)', '\\(\\frac{fg\'-f\'g}{g^2}\\)'], answer: 0 },
        { q: 'Za \\(y=8x^3e^x\\) vrijedi \\(y\'=\\)', kind: 'mc', options: ['\\(24x^2e^x\\)', '\\(8x^2e^x(3+x)\\)', '\\(24x^2e^{x-1}\\)', '\\(8x^3e^x\\)'], answer: 1 }
      ],
      solution: [
        '\\((\\cos x)\'=-\\sin x\\); \\((fg)\'=f\'g+fg\'\\), a ne \\(f\'g\'\\).',
        'Lančano pravilo: \\((\\ln u)\'=\\frac{u\'}{u}=\\frac{6x}{3x^2+5}\\).',
        '\\((8x^3e^x)\'=24x^2e^x+8x^3e^x=8x^2e^x(3+x)\\).'
      ]
    },

    {
      id: 'mhr4-polinom-random',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'numeric',
      title: 'Derivacija polinoma u točki',
      prompt: 'Derivirajte polinom član po član i uvrstite točku.',
      difficulty: 1,
      params: {
        a: { choices: [-2, -1, 1, 2, 3, 5] },
        b: { min: -4, max: 4, step: 1 },
        c: { min: -5, max: 8, step: 1 },
        d: { min: -6, max: 6, step: 1 },
        x0: { min: -3, max: 3, step: 1 }
      },
      generate(p) {
        const dv = 3 * p.a * p.x0 * p.x0 + 2 * p.b * p.x0 + p.c;
        const der = poly([[3 * p.a, 'x^2'], [2 * p.b, 'x'], [p.c, '']]);
        return {
          prompt: 'Odredite derivaciju funkcije \\(y=' + poly([[p.a, 'x^3'], [p.b, 'x^2'], [p.c, 'x'], [p.d, '']]) + '\\) u točki \\(x=' + kn(p.x0) + '\\).',
          fields: [
            { key: 'd', label: "y'(" + num(p.x0) + ')', answer: dv, tol: 0.01, unit: '', hint: '\\((x^n)\'=nx^{n-1}\\), konstanta daje 0' }
          ],
          solution: [
            '\\(y\'=' + der + '\\).',
            '\\(y\'(' + kn(p.x0) + ')=' + (3 * p.a) + '\\cdot' + kp(p.x0) + '^2' + (2 * p.b >= 0 ? '+' : '') + (2 * p.b) + '\\cdot' + kp(p.x0) + (p.c >= 0 ? '+' : '') + p.c + '=' + kn(dv) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi polinom. Točku uvrštavaš tek nakon deriviranja.']
    },

    {
      id: 'mhr4-umnozak-random',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'numeric',
      title: 'Derivacija umnoška s eˣ',
      prompt: 'Primijenite pravilo za derivaciju umnoška \\((fg)\'=f\'g+fg\'\\). Rezultat zaokružite na 2 decimale.',
      difficulty: 2,
      params: {
        a: { choices: [-2, -1, 1, 2, 3] },
        b: { min: -4, max: 4, step: 1 },
        x0: { choices: [0, 1, 2] }
      },
      generate(p) {
        const inner = p.a * p.x0 + p.a + p.b;
        const exact = Math.exp(p.x0) * inner;
        const ans = r2(exact);
        return {
          prompt: 'Odredite derivaciju funkcije \\(f(x)=' + mul(1, poly([[p.a, 'x'], [p.b, '']]), true) + 'e^x\\) u točki \\(x=' + p.x0 + '\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: ans, tol: Math.max(0.02, Math.abs(ans) * 0.001), unit: '', hint: '\\(u=' + poly([[p.a, 'x'], [p.b, '']]) + ',\\ v=e^x\\)' }
          ],
          solution: [
            '\\(f\'(x)=' + kn(p.a) + '\\cdot e^x+' + par(poly([[p.a, 'x'], [p.b, '']])) + 'e^x=e^x\\cdot ' + par(poly([[p.a, 'x'], [p.a + p.b, '']])) + '\\).',
            '\\(f\'(' + p.x0 + ')=e^{' + p.x0 + '}\\cdot' + kp(inner) + '\\approx' + kf(ans) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu funkciju. \\((fg)\'=f\'g+fg\'\\) i \\((e^x)\'=e^x\\); eˣ se na kraju izluči.']
    },

    {
      id: 'mhr4-kvocijent-random',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'numeric',
      title: 'Derivacija kvocijenta u točki',
      prompt: 'Primijenite pravilo za derivaciju kvocijenta. Rezultat zaokružite na 2 decimale.',
      difficulty: 2,
      // Brojnik derivacije ad − bc bira se iz skupa s |N| ≥ 7, a nazivnik (cx₀ + d)² ≤ 64 →
      // |f′(x₀)| ≥ 7/64 ≈ 0,11: rezultat nikad nije blizu nule (upis „0” ne smije proći).
      params: {
        a: { min: 1, max: 3, step: 1 },
        N: { choices: [-12, -10, -9, -8, -7, 7, 8, 9, 10, 12] },
        c: { choices: [1, 2] },
        d: { min: 1, max: 4, step: 1 },
        x0: { min: 0, max: 2, step: 1 }
      },
      generate(p) {
        // za c = 2 brojnik mora imati istu parnost kao a·d, inače b nije cijeli
        const nume = (p.c === 2 && (p.a * p.d - p.N) % 2 !== 0) ? p.N + Math.sign(p.N) : p.N;
        const b = (p.a * p.d - nume) / p.c;
        const den = p.c * p.x0 + p.d;
        const ans = r2(nume / (den * den));
        const top = poly([[p.a, 'x'], [b, '']]), bot = poly([[p.c, 'x'], [p.d, '']]);
        return {
          prompt: 'Odredite derivaciju funkcije \\(f(x)=\\frac{' + top + '}{' + bot + '}\\) u točki \\(x=' + p.x0 + '\\).',
          fields: [
            { key: 'd', label: "f'(" + p.x0 + ')', answer: ans, tol: 0.01, unit: '', hint: "\\(\\left(\\frac fg\\right)'=\\frac{f'g-fg'}{g^2}\\)" }
          ],
          solution: [
            '\\(f\'(x)=\\frac{' + p.a + '(' + bot + ')-(' + top + ')\\cdot' + p.c + '}{(' + bot + ')^2}=\\frac{' + kn(nume) + '}{(' + bot + ')^2}\\).',
            '\\(f\'(' + p.x0 + ')=\\frac{' + kn(nume) + '}{' + den + '^2}=\\frac{' + kn(nume) + '}{' + (den * den) + '}\\approx' + kf(ans) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu funkciju. U brojniku je minus i redoslijed \\(f\'g-fg\'\\).']
    },

    {
      id: 'mhr4-lancano-random',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'numeric',
      title: 'Lančano pravilo — logaritam i potencija',
      prompt: 'Derivirajte složene funkcije lančanim pravilom \\([f(g(x))]\'=f\'(g(x))\\cdot g\'(x)\\).',
      difficulty: 2,
      params: {
        a: { min: 1, max: 4, step: 1 },
        b: { min: 1, max: 9, step: 1 },
        x0: { min: 1, max: 3, step: 1 },
        u: { choices: [1, 2, 3] },
        v: { min: -3, max: 3, step: 1 },
        n: { choices: [2, 3] },
        x1: { min: 0, max: 2, step: 1 }
      },
      generate(p) {
        const inn = p.a * p.x0 * p.x0 + p.b;
        const ans1 = r2(2 * p.a * p.x0 / inn);
        const base = p.u * p.x1 + p.v;
        const ans2 = p.n * p.u * Math.pow(base, p.n - 1);
        const lin = poly([[p.u, 'x'], [p.v, '']]);
        return {
          prompt: 'a) \\(f(x)=\\ln(' + poly([[p.a, 'x^2'], [p.b, '']]) + ')\\): izračunajte \\(f\'(' + p.x0 + ')\\) na 2 decimale. '
            + 'b) \\(g(x)=(' + lin + ')^' + p.n + '\\): izračunajte \\(g\'(' + p.x1 + ')\\).',
          fields: [
            { key: 'f', label: "a) f'(" + p.x0 + ')', answer: ans1, tol: 0.01, unit: '', hint: "\\((\\ln u)'=\\frac{u'}{u}\\)" },
            { key: 'g', label: "b) g'(" + p.x1 + ')', answer: ans2, tol: 0.01, unit: '', hint: 'Potencija → spusti eksponent, pomnoži derivacijom unutarnje funkcije' }
          ],
          solution: [
            'a) \\(f\'(x)=\\frac{1}{' + poly([[p.a, 'x^2'], [p.b, '']]) + '}\\cdot' + (2 * p.a) + 'x\\Rightarrow f\'(' + p.x0 + ')=\\frac{' + (2 * p.a * p.x0) + '}{' + inn + '}\\approx' + kf(ans1) + '\\).',
            'b) \\(g\'(x)=' + p.n + '(' + lin + ')^{' + (p.n - 1) + '}\\cdot' + p.u + '\\Rightarrow g\'(' + p.x1 + ')=' + (p.n * p.u) + '\\cdot' + kp(base) + '^{' + (p.n - 1) + '}=' + kn(ans2) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove funkcije. Ne zaboravi pomnožiti derivacijom unutarnje funkcije.']
    },

    {
      id: 'mhr4-kolokvij-derivacija',
      lesson: 'first-midterm', chapter: 4, category: 'derivatives',
      type: 'numeric',
      title: 'Kolokvij: derivacija umnoška eksponencijalne i logaritamske funkcije',
      prompt: 'Riješeni kolokvij (2023/24): odredite derivaciju funkcije \\(f(x)=e^{x^3-4}\\ln(4x)\\) u točki \\(x=2\\). Rezultat zaokružite na 2 decimale.',
      difficulty: 3,
      fields: [
        { key: 'd', label: "f'(2)", answer: 1389.70, tol: 0.1, unit: '', hint: 'Umnožak + lančano pravilo za oba faktora' }
      ],
      solution: [
        '\\(f\'(x)=e^{x^3-4}\\cdot3x^2\\cdot\\ln(4x)+e^{x^3-4}\\cdot\\frac{1}{4x}\\cdot4\\).',
        '\\(f\'(2)=e^{4}\\cdot12\\ln8+e^{4}\\cdot\\frac12=e^4\\left(12\\ln8+\\frac12\\right)\\approx1389{,}70\\).'
      ]
    },

    // =====================================================================
    // 5. RAST, PAD I EKSTREMI (first-midterm, extrema)
    // =====================================================================
    {
      id: 'mhr5-rast-pad-random',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'numeric',
      title: 'Intervali rasta i pada, lokalni ekstremi',
      prompt: 'Postupak: domena → stacionarne točke → tablica predznaka derivacije.',
      difficulty: 2,
      params: {
        r1: { min: -4, max: 1, step: 1 },
        gap: { min: 1, max: 5, step: 1 },
        d: { min: -5, max: 5, step: 1 }
      },
      generate(p) {
        const x1 = p.r1, x2 = p.r1 + p.gap;
        const B = -3 * (x1 + x2), Cc = 6 * x1 * x2;
        const f = (x) => 2 * x * x * x + B * x * x + Cc * x + p.d;
        return {
          prompt: 'Za \\(f(x)=' + poly([[2, 'x^3'], [B, 'x^2'], [Cc, 'x'], [p.d, '']]) + '\\) odredite stacionarne točke i vrijednosti funkcije u lokalnom maksimumu i minimumu.',
          fields: [
            { key: 'xM', label: 'x lokalnog maksimuma', answer: x1, tol: 0.01, unit: '', hint: "f'(x) = 0; tablica: + | − | +" },
            { key: 'fM', label: 'f u lokalnom maksimumu', answer: f(x1), tol: 0.01, unit: '', hint: 'Uvrsti u POČETNU funkciju' },
            { key: 'xm', label: 'x lokalnog minimuma', answer: x2, tol: 0.01, unit: '', hint: 'Prijelaz − → +' },
            { key: 'fm', label: 'f u lokalnom minimumu', answer: f(x2), tol: 0.01, unit: '', hint: 'Uvrsti u f, ne u f′' }
          ],
          solution: [
            '\\(D_f=\\mathbb{R}\\); \\(f\'(x)=' + poly([[6, 'x^2'], [2 * B, 'x'], [Cc, '']]) + '=6(' + poly([[1, 'x^2'], [-(x1 + x2), 'x'], [x1 * x2, '']]) + ')=0\\Rightarrow x_1=' + kn(x1) + ',\\ x_2=' + kn(x2) + '\\).',
            'Tablica: na \\(' + interval('-\\infty', kn(x1)) + '\\) f′ > 0 (raste), na \\(' + interval(kn(x1), kn(x2)) + '\\) f′ < 0 (pada), na \\(' + interval(kn(x2), '+\\infty') + '\\) f′ > 0 (raste).',
            'Maksimum \\(M(' + kn(x1) + ',\\ ' + kn(f(x1)) + ')\\), minimum \\(m(' + kn(x2) + ',\\ ' + kn(f(x2)) + ')\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu funkciju. + → − je maksimum, − → + minimum; vrijednost se računa u f.']
    },

    {
      id: 'mhr5-ekstremi-pojmovi',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'choice',
      title: 'Ekstremi — pojmovi i zamke',
      prompt: 'Test prvom i drugom derivacijom.',
      difficulty: 1,
      items: [
        { q: 'Ako je \\(f\'(x_0)=0\\) i \\(f\'\'(x_0)>0\\), u \\(x_0\\) je lokalni minimum.', kind: 'tf', answer: true },
        { q: 'Ako f′ mijenja predznak iz − u +, u toj točki je maksimum.', kind: 'tf', answer: false },
        { q: 'Svaka stacionarna točka je ekstrem.', kind: 'tf', answer: false },
        { q: 'Koordinata y ekstrema računa se uvrštavanjem u početnu funkciju f.', kind: 'tf', answer: true },
        { q: 'Za \\(f(x)=6x^4-8x^3-10\\) točka \\(x=0\\) je:', kind: 'mc', options: ['lokalni maksimum', 'lokalni minimum', 'stacionarna točka bez ekstrema', 'izvan domene'], answer: 2 },
        { q: 'Za \\(f(x)=\\frac{x^2+1}{x}\\) točka \\((1,2)\\) je:', kind: 'mc', options: ['lokalni maksimum', 'lokalni minimum', 'nije ekstrem', 'nultočka'], answer: 1 }
      ],
      solution: [
        '− → + je MINIMUM, + → − MAKSIMUM; bez promjene predznaka nema ekstrema (\\(6x^4-8x^3-10\\): \\(f\'=24x^2(x-1)\\), u 0 predznak ostaje −).',
        '\\(\\frac{x^2+1}{x}\\): \\(f\'\'(x)=\\frac{2}{x^3}\\), \\(f\'\'(1)=2>0\\) → minimum \\((1,2)\\); u studentskom rješenju su min i max zamijenjeni.'
      ]
    },

    {
      id: 'mhr5-zavrsni-rast-pad',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'numeric',
      title: 'Završni ispit 2023/24: intervali rasta i pada',
      prompt: 'Završni ispit, grupa B, zadatak 4: odredite intervale rasta i pada funkcije \\(f(x)=x^3-\\frac72x^2+2x+10\\). Upišite stacionarne točke i vrijednosti funkcije u njima (na 2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'x1', label: 'Manja stacionarna točka x₁', answer: 0.33, tol: 0.01, unit: '', hint: '\\(3x^2-7x+2=0\\)' },
        { key: 'x2', label: 'Veća stacionarna točka x₂', answer: 2, tol: 0.01, unit: '', hint: '\\(x_{1,2}=\\frac{7\\pm5}{6}\\)' },
        { key: 'f1', label: 'f(x₁) — lokalni maksimum', answer: 10.31, tol: 0.01, unit: '', hint: '\\(f(\\frac13)=\\frac1{27}-\\frac7{18}+\\frac23+10\\)' },
        { key: 'f2', label: 'f(x₂) — lokalni minimum', answer: 8, tol: 0.01, unit: '', hint: '\\(8-14+4+10\\)' }
      ],
      solution: [
        '\\(D_f=\\mathbb{R}\\); \\(f\'(x)=3x^2-7x+2=0\\Rightarrow x_{1,2}=\\frac{7\\pm5}{6}\\Rightarrow x_1=\\frac13,\\ x_2=2\\).',
        'Probne točke: \\(f\'(0)=2>0\\), \\(f\'(1)=-2<0\\), \\(f\'(3)=8>0\\).',
        'Raste na \\(\\langle-\\infty,\\frac13\\rangle\\cup\\langle2,+\\infty\\rangle\\), pada na \\(\\langle\\frac13,2\\rangle\\).',
        '\\(f(\\frac13)=\\frac{17}{54}+10\\approx10{,}31\\) (maksimum), \\(f(2)=8\\) (minimum).'
      ]
    },

    {
      id: 'mhr5-zavrsni-ekstrem',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'numeric',
      title: 'Završni ispit 2023/24: lokalni ekstrem racionalne funkcije',
      prompt: 'Završni ispit, grupa B, zadatak 7: odredite lokalne ekstreme funkcije \\(f(x)=\\frac{x^2+2}{x}\\) i je li riječ o maksimumu ili minimumu. Koordinate upišite na 2 decimale.',
      difficulty: 3,
      fields: [
        { key: 'xm', label: 'x lokalnog minimuma', answer: 1.41, tol: 0.01, unit: '', hint: '\\(f(x)=x+\\frac2x\\), \\(f\'=1-\\frac{2}{x^2}\\)' },
        { key: 'fm', label: 'f u lokalnom minimumu', answer: 2.83, tol: 0.01, unit: '', hint: '\\(2\\sqrt2\\)' },
        { key: 'xM', label: 'x lokalnog maksimuma', answer: -1.41, tol: 0.01, unit: '', hint: '\\(-\\sqrt2\\)' },
        { key: 'fM', label: 'f u lokalnom maksimumu', answer: -2.83, tol: 0.01, unit: '', hint: '\\(-2\\sqrt2\\)' }
      ],
      solution: [
        '\\(D_f=\\mathbb{R}\\setminus\\{0\\}\\); \\(f(x)=x+\\frac2x\\Rightarrow f\'(x)=1-\\frac{2}{x^2}=0\\Rightarrow x=\\pm\\sqrt2\\approx\\pm1{,}41\\).',
        '\\(f\'\'(x)=\\frac{4}{x^3}\\): \\(f\'\'(\\sqrt2)>0\\) → minimum \\((\\sqrt2,\\ 2\\sqrt2)\\approx(1{,}41;\\ 2{,}83)\\).',
        '\\(f\'\'(-\\sqrt2)<0\\) → maksimum \\((-\\sqrt2,\\ -2\\sqrt2)\\approx(-1{,}41;\\ -2{,}83)\\). Maksimum je manji od minimuma — to su LOKALNI ekstremi.'
      ]
    },

    {
      id: 'mhr5-kolokvij-ekstremi',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'numeric',
      title: 'Kolokvij: ekstremi dviju funkcija',
      prompt: 'Riješeni kolokvij iz bilježnice: a) \\(f(x)=\\frac{x^2+1}{x}\\) · b) \\(g(x)=x^3-6x^2+9x-1\\). Upišite tražene koordinate ekstrema.',
      difficulty: 2,
      fields: [
        { key: 'fmin', label: 'a) y-koordinata lokalnog minimuma', answer: 2, tol: 0.01, unit: '', hint: "\\(f'=\\frac{x^2-1}{x^2}\\), \\(f''=\\frac{2}{x^3}\\)" },
        { key: 'xmax', label: 'a) x-koordinata lokalnog maksimuma', answer: -1, tol: 0.01, unit: '', hint: "f″ < 0" },
        { key: 'gxmin', label: 'b) x-koordinata lokalnog minimuma', answer: 3, tol: 0.01, unit: '', hint: "\\(g'=3(x-1)(x-3)\\)" },
        { key: 'gmax', label: 'b) g u lokalnom maksimumu', answer: 3, tol: 0.01, unit: '', hint: 'g(1)' }
      ],
      solution: [
        'a) \\(f\'(x)=\\frac{2x\\cdot x-(x^2+1)}{x^2}=\\frac{x^2-1}{x^2}=0\\Rightarrow x=\\pm1\\). Tablica + | − | − | + (0 je izvan domene).',
        'a) Minimum \\((1,2)\\), maksimum \\((-1,-2)\\) — u studentskom rješenju su zamijenjeni.',
        'b) \\(g\'=3x^2-12x+9=3(x-1)(x-3)\\): raste na \\(\\langle-\\infty,1\\rangle\\cup\\langle3,+\\infty\\rangle\\), pada na \\(\\langle1,3\\rangle\\).',
        'b) Maksimum \\((1,\\ g(1))=(1,3)\\), minimum \\((3,\\ g(3))=(3,-1)\\).'
      ]
    },

    {
      id: 'mhr5-racionalna-random',
      lesson: 'first-midterm', chapter: 5, category: 'extrema',
      type: 'numeric',
      title: 'Ekstremi funkcije ax + b/x',
      prompt: 'Odredite lokalne ekstreme (domena bez nule, test drugom derivacijom).',
      difficulty: 2,
      params: {
        a: { min: 1, max: 4, step: 1 },
        k: { min: 1, max: 5, step: 1 }
      },
      generate(p) {
        const b = p.a * p.k * p.k;
        return {
          prompt: 'Odredite lokalne ekstreme funkcije \\(f(x)=' + term(p.a, 'x', true) + '+\\frac{' + b + '}{x}\\).',
          fields: [
            { key: 'xm', label: 'x lokalnog minimuma', answer: p.k, tol: 0.01, unit: '', hint: "\\(f'(x)=" + p.a + '-\\frac{' + b + "}{x^2}=0\\)" },
            { key: 'fm', label: 'f u lokalnom minimumu', answer: 2 * p.a * p.k, tol: 0.01, unit: '', hint: 'f″ > 0 → minimum' },
            { key: 'xM', label: 'x lokalnog maksimuma', answer: -p.k, tol: 0.01, unit: '', hint: 'Negativno rješenje' },
            { key: 'fM', label: 'f u lokalnom maksimumu', answer: -2 * p.a * p.k, tol: 0.01, unit: '', hint: 'f″ < 0 → maksimum' }
          ],
          solution: [
            '\\(D_f=\\mathbb{R}\\setminus\\{0\\}\\); \\(f\'(x)=' + p.a + '-\\frac{' + b + '}{x^2}=0\\Rightarrow x^2=' + (p.k * p.k) + '\\Rightarrow x=\\pm' + p.k + '\\).',
            '\\(f\'\'(x)=\\frac{' + (2 * b) + '}{x^3}\\): \\(f\'\'(' + p.k + ')>0\\) → minimum \\(m(' + p.k + ',\\ ' + (2 * p.a * p.k) + ')\\); \\(f\'\'(-' + p.k + ')<0\\) → maksimum \\(M(-' + p.k + ',\\ -' + (2 * p.a * p.k) + ')\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu funkciju. Nula nije u domeni; vrsta ekstrema iz predznaka f″.']
    },

    // =====================================================================
    // 6. TROŠKOVI, PRIHOD I DOBIT — OPTIMIZACIJA (first-midterm, economicOptimization)
    // =====================================================================
    {
      id: 'mhr6-min-prosjecni-random',
      lesson: 'first-midterm', chapter: 6, category: 'economicOptimization',
      type: 'numeric',
      title: 'Minimum prosječnih troškova (T kvadratna)',
      prompt: 'Koraci s demonstratura: 1. domena · 2. stacionarne točke · 3. druga derivacija.',
      difficulty: 2,
      params: {
        a: { min: 1, max: 5, step: 1 },
        b: { choices: [0, 10, 20, 50, 112] },
        k: { min: 2, max: 10, step: 1 }
      },
      generate(p) {
        const c = p.a * p.k * p.k;
        const Tmin = 2 * p.a * p.k + p.b;
        return {
          prompt: 'Ukupni troškovi su \\(T(Q)=' + poly([[p.a, 'Q^2'], [p.b, 'Q'], [c, '']]) + '\\). Nađite količinu uz koju su prosječni troškovi najmanji, minimalne prosječne troškove i marginalni trošak pri toj količini.',
          fields: [
            { key: 'Q', label: 'Q* (minimum prosječnih troškova)', answer: p.k, tol: 0.01, unit: '', hint: '\\(\\bar T(Q)=' + poly([[p.a, 'Q'], [p.b, '']]) + '+\\frac{' + c + '}{Q}\\)' },
            { key: 'T', label: 'T̄(Q*)', answer: Tmin, tol: 0.01, unit: '', hint: 'Uvrsti Q* u prosječne troškove' },
            { key: 'M', label: 'M(Q*)', answer: Tmin, tol: 0.01, unit: '', hint: 'M(Q) = T′(Q)' }
          ],
          solution: [
            'Domena \\(Q\\in\\langle0,+\\infty\\rangle\\); \\(\\bar T(Q)=\\frac{T(Q)}{Q}=' + poly([[p.a, 'Q'], [p.b, '']]) + '+\\frac{' + c + '}{Q}\\).',
            '\\(\\bar T\'(Q)=' + p.a + '-\\frac{' + c + '}{Q^2}=0\\Rightarrow Q^2=' + (p.k * p.k) + '\\Rightarrow Q=' + p.k + '\\) (\\(-' + p.k + '\\) nije u domeni).',
            '\\(\\bar T\'\'(Q)=\\frac{' + (2 * c) + '}{Q^3}>0\\) → minimum; \\(\\bar T(' + p.k + ')=' + (p.a * p.k) + '+' + p.b + '+' + (p.a * p.k) + '=' + Tmin + '\\).',
            'Provjera: \\(M(Q)=' + poly([[2 * p.a, 'Q'], [p.b, '']]) + '\\), \\(M(' + p.k + ')=' + Tmin + '=\\bar T(' + p.k + ')\\) ✓.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove troškove. U minimumu prosječnih troškova vrijedi \\(\\bar T(Q^*)=M(Q^*)\\).']
    },

    {
      id: 'mhr6-min-prosjecni-kubni-random',
      lesson: 'first-midterm', chapter: 6, category: 'economicOptimization',
      type: 'numeric',
      title: 'Minimum prosječnih troškova (T kubna, kao na kolokviju)',
      prompt: 'Po uzoru na kolokvij: \\(T(Q)=5Q^3-90Q^2+540Q\\Rightarrow m(9,135)\\).',
      difficulty: 2,
      params: {
        a: { min: 1, max: 5, step: 1 },
        Q: { min: 2, max: 10, step: 1 },
        e: { choices: [2, 15, 24, 40, 60, 135] }
      },
      generate(p) {
        const b = -2 * p.a * p.Q;
        const c = p.a * p.Q * p.Q + p.e;
        return {
          prompt: 'Ukupni troškovi su \\(T(Q)=' + poly([[p.a, 'Q^3'], [b, 'Q^2'], [c, 'Q']]) + '\\). Nađite minimum pripadne funkcije prosječnih troškova.',
          fields: [
            { key: 'Q', label: 'Q*', answer: p.Q, tol: 0.01, unit: '', hint: '\\(\\bar T(Q)=' + poly([[p.a, 'Q^2'], [b, 'Q'], [c, '']]) + '\\)' },
            { key: 'T', label: 'T̄(Q*) (minimalni prosječni troškovi)', answer: p.e, tol: 0.01, unit: '', hint: 'Uvrsti Q* u T̄' }
          ],
          solution: [
            '\\(\\bar T(Q)=\\frac{T(Q)}{Q}=' + poly([[p.a, 'Q^2'], [b, 'Q'], [c, '']]) + '\\).',
            '\\(\\bar T\'(Q)=' + poly([[2 * p.a, 'Q'], [b, '']]) + '=0\\Rightarrow Q=' + p.Q + '\\); \\(\\bar T\'\'=' + (2 * p.a) + '>0\\) → minimum.',
            '\\(\\bar T(' + p.Q + ')=' + (p.a * p.Q * p.Q) + '-' + (2 * p.a * p.Q * p.Q) + '+' + c + '=' + p.e + '\\Rightarrow m(' + p.Q + ',\\ ' + p.e + ')\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove troškove. Podijeli T s Q, deriviraj, izjednači s nulom, potvrdi drugom derivacijom.']
    },

    {
      id: 'mhr6-max-prihod-random',
      lesson: 'first-midterm', chapter: 6, category: 'economicOptimization',
      type: 'numeric',
      title: 'Maksimum ukupnog prihoda',
      prompt: 'Zadan je prosječni prihod — najprije ga pomnožite s Q.',
      difficulty: 2,
      params: {
        k: { min: 1, max: 4, step: 1 },
        Q: { min: 10, max: 100, step: 10 }
      },
      generate(p) {
        const m = 2 * p.k * p.Q;
        const Pmax = p.k * p.Q * p.Q;
        return {
          prompt: 'Prosječni prihod je \\(\\bar P(Q)=' + poly([[-p.k, 'Q'], [m, '']]) + '\\). Izračunajte maksimum funkcije ukupnog prihoda.',
          fields: [
            { key: 'Q', label: 'Q* (maksimum prihoda)', answer: p.Q, tol: 0.01, unit: '', hint: "P(Q) = P̄(Q)·Q, pa P′(Q) = 0" },
            { key: 'P', label: 'P(Q*)', answer: Pmax, tol: 0.01, unit: '', hint: 'Uvrsti Q* u P(Q)' },
            { key: 'c', label: 'Cijena P̄(Q*)', answer: p.k * p.Q, tol: 0.01, unit: '', hint: 'Prosječni prihod = cijena po jedinici' }
          ],
          solution: [
            '\\(P(Q)=\\bar P(Q)\\cdot Q=' + poly([[-p.k, 'Q^2'], [m, 'Q']]) + '\\).',
            '\\(P\'(Q)=' + poly([[-2 * p.k, 'Q'], [m, '']]) + '=0\\Rightarrow Q=' + p.Q + '\\); \\(P\'\'=' + (-2 * p.k) + '<0\\) → maksimum.',
            '\\(P(' + p.Q + ')=' + kn(Pmax) + '\\), a cijena \\(\\bar P(' + p.Q + ')=' + (p.k * p.Q) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. \\(P=\\bar P\\cdot Q\\), zatim \\(P\'(Q)=0\\) i \\(P\'\'<0\\).']
    },

    {
      id: 'mhr6-max-dobit-random',
      lesson: 'first-midterm', chapter: 6, category: 'economicOptimization',
      type: 'numeric',
      title: 'Maksimum dobiti',
      prompt: 'Dobit je \\(D(Q)=P(Q)-T(Q)\\). U maksimumu je marginalni prihod jednak marginalnom trošku.',
      difficulty: 3,
      params: {
        k: { min: 1, max: 3, step: 1 },
        a: { min: 1, max: 3, step: 1 },
        b: { choices: [10, 20, 40] },
        Q: { min: 10, max: 30, step: 5 },
        F: { choices: [50, 100, 150] }
      },
      generate(p) {
        const s = p.k + p.a;
        const m = p.b + 2 * s * p.Q;
        const Dmax = s * p.Q * p.Q - p.F;
        const MQ = 2 * p.a * p.Q + p.b;
        return {
          prompt: 'Ukupni troškovi su \\(T(Q)=' + poly([[p.a, 'Q^2'], [p.b, 'Q'], [p.F, '']]) + '\\), a ukupni prihod \\(P(Q)=' + poly([[-p.k, 'Q^2'], [m, 'Q']]) + '\\). Izračunajte maksimum dobiti.',
          fields: [
            { key: 'Q', label: 'Q* (maksimum dobiti)', answer: p.Q, tol: 0.01, unit: '', hint: "D′(Q) = 0" },
            { key: 'D', label: 'D(Q*)', answer: Dmax, tol: 0.01, unit: '', hint: 'Uvrsti Q* u D(Q) = P(Q) − T(Q)' },
            { key: 'M', label: 'Marginalni trošak M(Q*)', answer: MQ, tol: 0.01, unit: '', hint: 'M(Q) = T′(Q); mora biti jednak P′(Q*)' }
          ],
          solution: [
            '\\(D(Q)=' + poly([[-p.k, 'Q^2'], [m, 'Q']]) + '-(' + poly([[p.a, 'Q^2'], [p.b, 'Q'], [p.F, '']]) + ')=' + poly([[-s, 'Q^2'], [m - p.b, 'Q'], [-p.F, '']]) + '\\).',
            '\\(D\'(Q)=' + poly([[-2 * s, 'Q'], [m - p.b, '']]) + '=0\\Rightarrow Q=' + p.Q + '\\); \\(D\'\'=' + (-2 * s) + '<0\\) → maksimum.',
            '\\(D(' + p.Q + ')=' + kn(Dmax) + '\\). Provjera: \\(M(' + p.Q + ')=' + MQ + '=P\'(' + p.Q + ')\\) ✓.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove funkcije. \\(D=P-T\\), \\(D\'(Q)=0\\), \\(D\'\'<0\\); negativna stacionarna točka se odbacuje.']
    },

    {
      id: 'mhr6-marginalni-rast-pad-random',
      lesson: 'first-midterm', chapter: 6, category: 'economicOptimization',
      type: 'numeric',
      title: 'Rast i pad marginalnih troškova',
      prompt: 'Za rast/pad funkcije M(Q) gleda se predznak NJEZINE derivacije \\(M\'(Q)=T\'\'(Q)\\), a ne nultočke od M.',
      difficulty: 2,
      params: {
        a: { min: 1, max: 3, step: 1 },
        Q0: { min: 1, max: 5, step: 1 },
        e: { choices: [1, 4, 10, 25] }
      },
      generate(p) {
        const b = -3 * p.a * p.Q0;
        const c = 3 * p.a * p.Q0 * p.Q0 + p.e;
        return {
          prompt: 'Ukupni troškovi su \\(T(Q)=' + poly([[p.a, 'Q^3'], [b, 'Q^2'], [c, 'Q']]) + '\\). Odredite područje rasta i pada funkcije marginalnih troškova M(Q).',
          fields: [
            { key: 'Q', label: 'Q u kojem M prelazi iz pada u rast', answer: p.Q0, tol: 0.01, unit: '', hint: "M′(Q) = 0" },
            { key: 'M', label: 'Najmanji marginalni trošak M(Q)', answer: p.e, tol: 0.01, unit: '', hint: 'Uvrsti tu količinu u M(Q)' }
          ],
          solution: [
            '\\(M(Q)=T\'(Q)=' + poly([[3 * p.a, 'Q^2'], [2 * b, 'Q'], [c, '']]) + '\\).',
            '\\(M\'(Q)=' + poly([[6 * p.a, 'Q'], [2 * b, '']]) + '=0\\Rightarrow Q=' + p.Q0 + '\\).',
            'M pada na \\(' + interval(0, p.Q0) + '\\), raste na \\(' + interval(p.Q0, '+\\infty') + '\\); \\(M(' + p.Q0 + ')=' + p.e + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove troškove. Deriviraj M (ne traži nultočke od M).']
    },

    // =====================================================================
    // 7. ELASTIČNOST POTRAŽNJE (first-midterm, elasticity)
    // =====================================================================
    {
      id: 'mhr7-elasticnost-tocka-random',
      lesson: 'first-midterm', chapter: 7, category: 'elasticity',
      type: 'numeric',
      title: 'Koeficijent elastičnosti u točki (linearna potražnja)',
      prompt: 'Formula: \\(E_{q,p}=\\frac{p}{q}\\cdot\\frac{dq}{dp}\\); rezultat protumačite.',
      difficulty: 2,
      params: {
        b: { choices: [2, 4, 5, 10, 16, 25] },
        a: { choices: [200, 400, 800, 1000, 1200] },
        f: { choices: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8] } // p₀ = f·a/b; f ≥ 0,2 → |E| ≥ 0,1
      },
      generate(p) {
        const p0 = Math.max(1, Math.round(p.f * p.a / p.b));
        const q0 = p.a - p.b * p0;
        const Ex = -p.b * p0 / q0;
        const E = r2(Ex);
        const absE = Math.abs(Ex);
        const tip = Math.abs(absE - 1) < 1e-9 ? 'jedinična elastičnost'
          : (absE > 1 ? 'elastična potražnja' : 'neelastična potražnja');
        return {
          prompt: 'Funkcija potražnje je \\(q(p)=' + poly([[p.a, ''], [-p.b, 'p']]) + '\\). Izračunajte koeficijent elastičnosti pri cijeni \\(p_0=' + p0 + '\\) (na 2 decimale).',
          fields: [
            { key: 'q', label: 'q(p₀)', answer: q0, tol: 0.01, unit: '', hint: 'Uvrsti p₀ u funkciju potražnje' },
            { key: 'dq', label: 'dq/dp', answer: -p.b, tol: 0.01, unit: '', hint: 'Derivacija po p' },
            { key: 'E', label: 'E (2 decimale)', answer: E, tol: 0.01, unit: '', hint: '\\(E=\\frac{p_0}{q(p_0)}\\cdot\\frac{dq}{dp}\\)' }
          ],
          solution: [
            '\\(q(' + p0 + ')=' + p.a + '-' + p.b + '\\cdot' + p0 + '=' + q0 + '\\), \\(\\frac{dq}{dp}=' + (-p.b) + '\\).',
            '\\(E=\\frac{' + p0 + '}{' + q0 + '}\\cdot(' + (-p.b) + ')\\approx' + kf(E) + '\\).',
            '|E| ' + (absE > 1 + 1e-9 ? '> 1' : (absE < 1 - 1e-9 ? '< 1' : '= 1')) + ' → ' + tip + ': ako cijena poraste za 1 %, potražnja se smanji za približno ' + num(absE, 2) + ' %.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu potražnju. S 1 se uspoređuje |E|; predznak kaže da potražnja pada kad cijena raste.']
    },

    {
      id: 'mhr7-intervali-random',
      lesson: 'first-midterm', chapter: 7, category: 'elasticity',
      type: 'numeric',
      title: 'Intervali elastičnosti i neelastičnosti (Projektni zadatak 1)',
      prompt: 'Tip zadatka 5 iz Projektnog zadatka 1 (2023/24): odredite intervale elastičnosti i neelastičnosti potražnje.',
      difficulty: 3,
      params: {
        b: { choices: [1, 2, 4, 5, 8, 10, 16, 25] },
        k: { choices: [5, 10, 15, 20, 25, 30, 50] }
      },
      generate(p) {
        const a = 2 * p.b * p.k;
        return {
          prompt: 'Funkcija potražnje je \\(q(p)=' + poly([[a, ''], [-p.b, 'p']]) + '\\). Potražnja je neelastična na \\(\\langle0,p_1\\rangle\\) i elastična na \\(\\langle p_1,p_2\\rangle\\). Upišite \\(p_1\\) i \\(p_2\\).',
          fields: [
            { key: 'p1', label: 'p₁ (|E| = 1)', answer: p.k, tol: 0.01, unit: '', hint: '\\(|E(p)|=\\frac{' + term(p.b, 'p', true) + '}{' + poly([[a, ''], [-p.b, 'p']]) + '}=1\\)' },
            { key: 'p2', label: 'p₂ (potražnja pada na 0)', answer: 2 * p.k, tol: 0.01, unit: '', hint: 'q(p) > 0' }
          ],
          solution: [
            'Ekonomsko područje: \\(p>0\\) i \\(q>0\\Rightarrow p\\in' + interval(0, 2 * p.k) + '\\).',
            '\\(E(p)=\\frac{p}{' + poly([[a, ''], [-p.b, 'p']]) + '}\\cdot(' + (-p.b) + ')\\); \\(|E|=1\\Rightarrow ' + term(p.b, 'p', true) + '=' + poly([[a, ''], [-p.b, 'p']]) + '\\Rightarrow p=' + p.k + '\\).',
            'Neelastična na \\(' + interval(0, p.k) + '\\), elastična na \\(' + interval(p.k, 2 * p.k) + '\\) (za linearnu potražnju \\(p_1=\\frac{a}{2b}\\)).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu potražnju. Granica je cijena s |E(p)| = 1; probnom točkom provjeri koja je strana elastična.']
    },

    {
      id: 'mhr7-nelinearna-random',
      lesson: 'first-midterm', chapter: 7, category: 'elasticity',
      type: 'numeric',
      title: 'Elastičnost nelinearne potražnje q = c − p²',
      prompt: 'Elastičnost u točki i granica elastičnog područja. Decimalne rezultate zaokružite na 2 decimale.',
      difficulty: 3,
      params: {
        k: { min: 3, max: 10, step: 1 },
        s: { choices: [-2, -1, 1, 2] }
      },
      generate(p) {
        const c = 3 * p.k * p.k;
        // k = 3, s = −2 dao bi p₀ = 1 i |E| ≈ 0,08 (na 2 decimale pregrubo) → tada p₀ = k + 1
        const p0 = (p.k + p.s < 2) ? p.k + 1 : p.k + p.s;
        const q0 = c - p0 * p0;
        const E = r2(-2 * p0 * p0 / q0);
        const top = r2(Math.sqrt(c));
        return {
          prompt: 'Funkcija potražnje je \\(q(p)=' + c + '-p^2\\). a) Izračunajte E pri \\(p_0=' + p0 + '\\). b) Odredite cijenu \\(p_1\\) s \\(|E|=1\\) i gornju granicu \\(p_2\\) ekonomskog područja (q > 0).',
          fields: [
            { key: 'E', label: 'a) E pri p₀ (2 decimale)', answer: E, tol: 0.01, unit: '', hint: '\\(\\frac{dq}{dp}=-2p\\)' },
            { key: 'p1', label: 'b) p₁ (|E| = 1)', answer: p.k, tol: 0.01, unit: '', hint: '\\(2p^2=' + c + '-p^2\\)' },
            { key: 'p2', label: 'b) p₂ (2 decimale)', answer: top, tol: 0.01, unit: '', hint: '\\(p=\\sqrt{' + c + '}\\)' }
          ],
          solution: [
            'a) \\(q(' + p0 + ')=' + c + '-' + (p0 * p0) + '=' + q0 + '\\), \\(\\frac{dq}{dp}=-2\\cdot' + p0 + '=' + (-2 * p0) + '\\), \\(E=\\frac{' + p0 + '}{' + q0 + '}\\cdot(' + (-2 * p0) + ')\\approx' + kf(E) + '\\).',
            'b) \\(E(p)=\\frac{-2p^2}{' + c + '-p^2}\\); \\(|E|=1\\Rightarrow 3p^2=' + c + '\\Rightarrow p=' + p.k + '\\).',
            'Neelastična na \\(' + interval(0, p.k) + '\\), elastična na \\(\\langle' + p.k + ',\\sqrt{' + c + '}\\rangle\\approx\\langle' + p.k + ';\\ ' + kf(top) + '\\rangle\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novu potražnju. \\(E(p)=\\frac{p}{q}\\cdot q\'(p)\\); granica elastičnosti je \\(|E(p)|=1\\).']
    },

    {
      id: 'mhr7-zavrsni-elasticnost',
      lesson: 'first-midterm', chapter: 7, category: 'elasticity',
      type: 'numeric',
      title: 'Završni ispit 2023/24: koeficijent elastičnosti',
      prompt: 'Završni ispit, grupa B, zadatak 2: zadana je funkcija potražnje \\(q(p)=800-16p\\). Izračunajte koeficijent elastičnosti na nivou cijene \\(p_0=1\\) (na 4 decimale) i cijenu uz jediničnu elastičnost.',
      difficulty: 2,
      fields: [
        { key: 'q', label: 'q(1)', answer: 784, tol: 0.01, unit: '', hint: '800 − 16' },
        { key: 'E', label: 'E (4 decimale)', answer: -0.0204, tol: 0.0002, unit: '', hint: '\\(\\frac{1}{784}\\cdot(-16)\\)' },
        { key: 'p1', label: 'Cijena uz |E| = 1', answer: 25, tol: 0.01, unit: '', hint: '\\(p=\\frac{a}{2b}=\\frac{800}{32}\\)' }
      ],
      solution: [
        '\\(q(1)=784\\), \\(\\frac{dq}{dp}=-16\\), \\(E=\\frac{1}{784}\\cdot(-16)\\approx-0{,}0204\\).',
        '|E| < 1 → potražnja je neelastična: ako cijena poraste za 1 %, potražnja se smanji za približno 0,02 %.',
        'Jedinična elastičnost: \\(16p=800-16p\\Rightarrow p=25\\).'
      ]
    },

    {
      id: 'mhr7-elasticnost-pojmovi',
      lesson: 'first-midterm', chapter: 7, category: 'elasticity',
      type: 'choice',
      title: 'Elastičnost — pojmovi i tumačenje',
      prompt: 'Odlučite je li tvrdnja točna i odaberite ispravno tumačenje.',
      difficulty: 1,
      items: [
        { q: 'Ako je \\(|E|>1\\), potražnja je elastična.', kind: 'tf', answer: true },
        { q: '\\(E=-2\\) znači neelastičnu potražnju jer je \\(E<1\\).', kind: 'tf', answer: false },
        { q: 'Kod neelastične potražnje poskupljenje povećava ukupni prihod.', kind: 'tf', answer: true },
        { q: 'Za \\(q(p)=-2p^2+12\\) pri \\(p_0=4\\) elastičnost ima ekonomskog smisla.', kind: 'tf', answer: false },
        { q: '\\(E=-0{,}25\\) znači da rast cijene od 1 % potražnju:', kind: 'mc', options: ['smanjuje za oko 0,25 %', 'povećava za oko 0,25 %', 'smanjuje za oko 25 %', 'ne mijenja'], answer: 0 },
        { q: 'Formula koeficijenta elastičnosti je:', kind: 'mc', options: ['\\(\\frac{q}{p}\\cdot\\frac{dq}{dp}\\)', '\\(\\frac{p}{q}\\cdot\\frac{dq}{dp}\\)', '\\(\\frac{dq}{dp}\\)', '\\(p\\cdot q\\)'], answer: 1 }
      ],
      solution: [
        'S 1 se uspoređuje \\(|E|\\): \\(E=-2\\Rightarrow|E|=2>1\\) → elastična.',
        'Za \\(q=-2p^2+12\\) pri \\(p_0=4\\) potražnja je \\(q=-20<0\\) — cijena je izvan područja funkcije (primjer iz bilježnice nije ekonomski smislen).',
        'Neelastična potražnja: kupci slabo reagiraju pa poskupljenje diže prihod \\(R=p\\cdot q\\).'
      ]
    },

    // =====================================================================
    // 8. NEODREĐENI INTEGRAL (second-midterm, indefiniteIntegral)
    // =====================================================================
    {
      id: 'mhr8-polinom-random',
      lesson: 'second-midterm', chapter: 8, category: 'indefiniteIntegral',
      type: 'numeric',
      title: 'Integral polinoma',
      prompt: 'Integrirajte član po član: \\(\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\). Upišite koeficijente primitivne funkcije.',
      difficulty: 1,
      params: {
        a: { choices: [-1, 1, 2, 3] },
        b: { min: -3, max: 3, step: 1 },
        c: { min: -4, max: 4, step: 1 },
        e: { choices: [-6, -5, -3, -2, -1, 1, 2, 4, 5, 7] }
      },
      generate(p) {
        const f = poly([[4 * p.a, 'x^3'], [3 * p.b, 'x^2'], [2 * p.c, 'x'], [p.e, '']]);
        const F = poly([[p.a, 'x^4'], [p.b, 'x^3'], [p.c, 'x^2'], [p.e, 'x']]);
        return {
          prompt: 'Izračunajte \\(\\int(' + f + ')\\,dx=Ax^4+Bx^3+Cx^2+Ex+C_0\\). Upišite A, B, C i E.',
          fields: [
            { key: 'A', label: 'A (uz x⁴)', answer: p.a, tol: 0.01, unit: '', hint: '\\(' + (4 * p.a) + '\\cdot\\frac{x^4}{4}\\)' },
            { key: 'B', label: 'B (uz x³)', answer: p.b, tol: 0.01, unit: '', hint: 'Podijeli novim eksponentom 3' },
            { key: 'C', label: 'C (uz x²)', answer: p.c, tol: 0.01, unit: '', hint: 'Podijeli novim eksponentom 2' },
            { key: 'E', label: 'E (uz x)', answer: p.e, tol: 0.01, unit: '', hint: '\\(\\int k\\,dx=kx\\)' }
          ],
          solution: [
            '\\(\\int(' + f + ')\\,dx=' + F + '+C_0\\).',
            'Provjera deriviranjem: \\((' + F + ')\'=' + f + '\\) ✓.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi polinom. Eksponent se povećava za 1 i dijeli NOVIM eksponentom; \\(\\int k\\,dx=kx\\).']
    },

    {
      id: 'mhr8-ukupni-trosak-random',
      lesson: 'second-midterm', chapter: 8, category: 'indefiniteIntegral',
      type: 'numeric',
      title: 'Ukupni trošak iz marginalnog',
      prompt: '\\(T(Q)=\\int M(Q)\\,dQ\\); konstanta integracije su fiksni troškovi \\(T(0)\\).',
      difficulty: 2,
      params: {
        a: { min: 1, max: 3, step: 1 },
        b: { min: 1, max: 10, step: 1 },
        c: { min: 5, max: 50, step: 5 },
        F: { choices: [100, 200, 300, 500, 800] },
        Q0: { min: 1, max: 10, step: 1 }
      },
      generate(p) {
        const T = p.a * Math.pow(p.Q0, 3) + p.b * p.Q0 * p.Q0 + p.c * p.Q0 + p.F;
        return {
          prompt: 'Marginalni trošak je \\(M(Q)=' + poly([[3 * p.a, 'Q^2'], [2 * p.b, 'Q'], [p.c, '']]) + '\\), a fiksni troškovi iznose ' + p.F + '. Odredite ukupne troškove pri \\(Q=' + p.Q0 + '\\) i varijabilni dio \\(T(' + p.Q0 + ')-T(0)\\).',
          fields: [
            { key: 'T', label: 'T(' + p.Q0 + ')', answer: T, tol: 0.01, unit: '', hint: '\\(T(Q)=' + poly([[p.a, 'Q^3'], [p.b, 'Q^2'], [p.c, 'Q']]) + '+C\\)' },
            { key: 'V', label: 'T(' + p.Q0 + ') − T(0)', answer: T - p.F, tol: 0.01, unit: '', hint: 'Oduzmi fiksne troškove' }
          ],
          solution: [
            '\\(T(Q)=\\int(' + poly([[3 * p.a, 'Q^2'], [2 * p.b, 'Q'], [p.c, '']]) + ')\\,dQ=' + poly([[p.a, 'Q^3'], [p.b, 'Q^2'], [p.c, 'Q']]) + '+C\\).',
            'Uvjet \\(T(0)=' + p.F + '\\Rightarrow C=' + p.F + '\\).',
            '\\(T(' + p.Q0 + ')=' + kn(T) + '\\); varijabilni dio \\(' + kn(T - p.F) + '\\).'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove troškove. Integriraj M(Q); C = fiksni troškovi.']
    },

    {
      id: 'mhr8-zavrsni-integral',
      lesson: 'second-midterm', chapter: 8, category: 'indefiniteIntegral',
      type: 'numeric',
      title: 'Završni ispit i bilježnica: ukupni trošak iz marginalnog',
      prompt: 'a) Završni ispit 2023/24, zadatak 5: \\(M(Q)=3Q^4+4Q^3+7Q\\). b) Bilješke „Troškovi”: \\(M(Q)=7Q^5+5Q^4+3Q^2+2Q+1\\). Odredite T(Q) i upišite tražene koeficijente (na 2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'a5', label: 'a) koeficijent uz Q⁵', answer: 0.6, tol: 0.01, unit: '', hint: '\\(\\frac35\\)' },
        { key: 'a4', label: 'a) koeficijent uz Q⁴', answer: 1, tol: 0.01, unit: '', hint: '\\(\\frac44\\)' },
        { key: 'a2', label: 'a) koeficijent uz Q²', answer: 3.5, tol: 0.01, unit: '', hint: '\\(\\frac72\\)' },
        { key: 'b6', label: 'b) koeficijent uz Q⁶', answer: 1.17, tol: 0.01, unit: '', hint: '\\(\\frac76\\)' },
        { key: 'b1', label: 'b) koeficijent uz Q', answer: 1, tol: 0.01, unit: '', hint: '\\(\\int1\\,dQ=Q\\) — ne smije se izgubiti' }
      ],
      solution: [
        'a) \\(T(Q)=\\frac{3Q^5}{5}+\\frac{4Q^4}{4}+\\frac{7Q^2}{2}+C=\\frac35Q^5+Q^4+\\frac72Q^2+C\\), C su fiksni troškovi (nisu zadani).',
        'b) \\(T(Q)=\\frac76Q^6+Q^5+Q^3+Q^2+Q+C\\); \\(\\frac76\\approx1{,}17\\).'
      ]
    },

    {
      id: 'mhr8-integral-pojmovi',
      lesson: 'second-midterm', chapter: 8, category: 'indefiniteIntegral',
      type: 'choice',
      title: 'Neodređeni integral — pojmovi',
      prompt: 'Odlučite je li tvrdnja točna i odaberite ispravan integral.',
      difficulty: 1,
      items: [
        { q: 'Integriranje je obrnuta operacija od deriviranja.', kind: 'tf', answer: true },
        { q: '\\(\\int5\\,dx=0\\).', kind: 'tf', answer: false },
        { q: 'Konstanta integracije u \\(T(Q)=\\int M(Q)\\,dQ\\) su fiksni troškovi.', kind: 'tf', answer: true },
        { q: 'Ako fiksni troškovi nisu zadani, u rješenju ostaje + C.', kind: 'tf', answer: true },
        { q: '\\(\\int\\sqrt x\\,dx=\\)', kind: 'mc', options: ['\\(\\frac{1}{2\\sqrt x}+C\\)', '\\(\\frac23x^{3/2}+C\\)', '\\(\\frac32x^{3/2}+C\\)', '\\(x^{1/2}+C\\)'], answer: 1 },
        { q: '\\(\\int\\frac1x\\,dx=\\)', kind: 'mc', options: ['\\(\\frac{x^0}{0}+C\\)', '\\(-\\frac{1}{x^2}+C\\)', '\\(\\ln|x|+C\\)', '\\(e^x+C\\)'], answer: 2 }
      ],
      solution: [
        '\\(\\int5\\,dx=5x+C\\). \\(\\int x^{1/2}\\,dx=\\frac{x^{3/2}}{3/2}+C=\\frac23x^{3/2}+C\\).',
        '\\(\\int\\frac1x\\,dx=\\ln|x|+C\\) (pravilo za potenciju ne vrijedi za n = −1).'
      ]
    },

    // =====================================================================
    // 9. JEDNOSTAVNI I SLOŽENI KAMATNI RAČUN (second-midterm, interest)
    // =====================================================================
    {
      id: 'mhr9-jednostavni-slozeni-random',
      lesson: 'second-midterm', chapter: 9, category: 'interest',
      type: 'numeric',
      title: 'Jednostavni i složeni kamatni račun',
      prompt: 'Usporedite jednostavni i složeni (dekurzivni, godišnji) obračun. Iznose zaokružite na 2 decimale.',
      difficulty: 1,
      params: {
        C0: { choices: [2000, 5000, 8000, 10000, 12000, 20000] },
        p: { choices: [2, 3, 4, 5, 6, 8] },
        n: { min: 2, max: 8, step: 1 }
      },
      generate(p) {
        const i = p.p / 100, r = 1 + i;
        const K = r2(p.C0 * p.n * i);
        const Cj = r2(p.C0 + K);
        const Cs = r2(p.C0 * Math.pow(r, p.n));
        return {
          prompt: 'Glavnica od ' + eurN(p.C0) + ' uložena je na ' + god(p.n) + ' uz ' + p.p + ' % godišnjih kamata. Izračunajte a) kamate i konačnu vrijednost uz jednostavni obračun, b) konačnu vrijednost i kamate uz složeni obračun.',
          fields: [
            { key: 'Kj', label: 'a) kamate K (jednostavni)', answer: K, tol: 0.01, unit: '€', hint: '\\(K=C_0\\cdot n\\cdot i\\)' },
            { key: 'Cj', label: 'a) Cₙ (jednostavni)', answer: Cj, tol: 0.01, unit: '€', hint: '\\(C_n=C_0(1+n\\cdot i)\\)' },
            { key: 'Cs', label: 'b) Cₙ (složeni)', answer: Cs, tol: 0.05, unit: '€', hint: '\\(C_n=C_0\\,r^n\\), r = ' + num(r, 2) },
            { key: 'Ks', label: 'b) kamate K (složeni)', answer: r2(Cs - p.C0), tol: 0.05, unit: '€', hint: '\\(K=C_n-C_0\\)' }
          ],
          solution: [
            'a) \\(K=' + kn(p.C0) + '\\cdot' + p.n + '\\cdot' + kn(i, 2) + '=' + kf(K) + '\\) €, \\(C_' + p.n + '=' + kf(Cj) + '\\) €.',
            'b) \\(C_' + p.n + '=' + kn(p.C0) + '\\cdot' + kn(r, 2) + '^' + p.n + '\\approx' + kf(Cs) + '\\) €, \\(K\\approx' + kf(Cs - p.C0) + '\\) €.',
            'Razlika ' + eur(Cs - Cj) + ' su kamate na kamate.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Jednostavni: kamate samo na glavnicu; složeni: \\(C_n=C_0(1+i)^n\\).']
    },

    {
      id: 'mhr9-diskontiranje-random',
      lesson: 'second-midterm', chapter: 9, category: 'interest',
      type: 'numeric',
      title: 'Diskontiranje — sadašnja vrijednost',
      prompt: 'Koliko danas vrijedi iznos koji dospijeva u budućnosti? Iznose zaokružite na 2 decimale.',
      difficulty: 1,
      params: {
        Cn: { choices: [5000, 10000, 11000, 15000, 25000, 50000] },
        p: { min: 3, max: 10, step: 1 },
        n: { min: 2, max: 6, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100;
        const C0 = r2(p.Cn / Math.pow(r, p.n));
        return {
          prompt: 'Iznos od ' + eurN(p.Cn) + ' dospijeva za ' + god(p.n) + '. Koliko on danas vrijedi uz ' + p.p + ' % godišnjih kamata (složeni, dekurzivni obračun)? Koliki je diskont (razlika)?',
          fields: [
            { key: 'C0', label: 'C₀', answer: C0, tol: 0.05, unit: '€', hint: '\\(C_0=\\frac{C_n}{r^n}\\), r = ' + num(r, 2) },
            { key: 'K', label: 'Cₙ − C₀', answer: r2(p.Cn - C0), tol: 0.05, unit: '€', hint: 'Kamate koje se „oduzimaju”' }
          ],
          solution: [
            '\\(C_0=\\frac{' + kn(p.Cn) + '}{' + kn(r, 2) + '^' + p.n + '}\\approx' + kf(C0) + '\\) €.',
            '\\(C_n-C_0\\approx' + kf(p.Cn - C0) + '\\) €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Diskontiranje je ukamaćivanje unatrag: \\(C_0=C_n/r^n\\).']
    },

    {
      id: 'mhr9-stopa-vrijeme-random',
      lesson: 'second-midterm', chapter: 9, category: 'interest',
      type: 'numeric',
      title: 'Kamatna stopa i vrijeme ukamaćivanja',
      prompt: 'Formule s popisa za 2. kolokvij: \\(i=\\sqrt[n]{\\frac{C_n}{C_0}}-1\\), \\(n=\\frac{\\log\\frac{C_n}{C_0}}{\\log(1+i)}\\). Rezultate zaokružite na 2 decimale.',
      difficulty: 2,
      params: {
        C0: { choices: [5000, 8000, 10000, 20000] },
        n: { min: 2, max: 6, step: 1 },
        pt: { choices: [3, 4, 5, 6, 7, 8] },
        C0b: { choices: [8000, 10000, 15000] },
        mult: { choices: [1.25, 1.5, 2] },
        pb: { choices: [4, 5, 6, 8] }
      },
      generate(p) {
        const Cn = Math.round(p.C0 * Math.pow(1 + p.pt / 100, p.n));
        const pp = r2((Math.pow(Cn / p.C0, 1 / p.n) - 1) * 100);
        const Cnb = p.C0b * p.mult;
        const nb = r2(Math.log(p.mult) / Math.log(1 + p.pb / 100));
        return {
          prompt: 'a) Glavnica od ' + eurN(p.C0) + ' naraste za ' + god(p.n) + ' na ' + eurN(Cn) + '. Kolika je godišnja kamatna stopa p (u %)? '
            + 'b) Za koliko godina ' + eurN(p.C0b) + ' naraste na ' + eurN(Cnb) + ' uz ' + p.pb + ' % godišnje?',
          fields: [
            { key: 'p', label: 'a) p (%)', answer: pp, tol: 0.01, unit: '%', hint: '\\(i=\\sqrt[' + p.n + ']{\\frac{C_n}{C_0}}-1\\), p = 100·i' },
            { key: 'n', label: 'b) n (godina)', answer: nb, tol: 0.01, unit: '', hint: '\\(n=\\frac{\\log(C_n/C_0)}{\\log(1+i)}\\)' }
          ],
          solution: [
            'a) \\(i=\\sqrt' + (p.n === 2 ? '' : '[' + p.n + ']') + '{\\frac{' + kn(Cn) + '}{' + kn(p.C0) + '}}-1\\approx' + kf(pp / 100, 4) + '\\Rightarrow p\\approx' + kf(pp) + '\\,\\%\\).',
            'b) \\(n=\\frac{\\log' + kn(p.mult) + '}{\\log' + kn(1 + p.pb / 100, 2) + '}\\approx' + kf(nb) + '\\) godina.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Stopu dobivamo korjenovanjem, vrijeme logaritmiranjem.']
    },

    {
      id: 'mhr9-relativni-konformni-random',
      lesson: 'second-midterm', chapter: 9, category: 'interest',
      type: 'numeric',
      title: 'Relativni i konformni kamatnjak',
      prompt: 'Obračun je češći od godišnjeg. Postotke i iznose zaokružite na 2 decimale; konačnu vrijednost uz konformni kamatnjak računajte s nezaokruženim faktorom \\(\\left(1+\\frac{p}{100}\\right)^{1/m}\\) — m takvih obračuna daje točno godišnji faktor \\(1+\\frac{p}{100}\\).',
      difficulty: 3,
      params: {
        C0: { choices: [1000, 2000, 5000, 10000] },
        pm: { choices: [[8, 2], [8, 4], [6, 2], [12, 4], [12, 12], [6, 12], [10, 2], [4, 4]] },
        g: { min: 1, max: 3, step: 1 }
      },
      generate(p) {
        const pa = p.pm[0], m = p.pm[1];
        const naziv = m === 2 ? 'polugodišnji' : (m === 4 ? 'kvartalni' : 'mjesečni');
        const pr = pa / m;
        const n = p.g * m;
        const Crel = r2(p.C0 * Math.pow(1 + pr / 100, n));
        const pk = r2(100 * (Math.pow(1 + pa / 100, 1 / m) - 1));
        const Ckon = r2(p.C0 * Math.pow(1 + pa / 100, p.g));
        return {
          prompt: 'Glavnica od ' + eurN(p.C0) + ' uložena je na ' + god(p.g) + ' uz ' + pa + ' % godišnjih kamata; obračun je složen, dekurzivan i ' + naziv + '. Izračunajte konačnu vrijednost a) uz relativni, b) uz konformni kamatnjak.',
          fields: [
            { key: 'pr', label: 'a) relativni kamatnjak pᵣ (%)', answer: r2(pr), tol: 0.01, unit: '%', hint: '\\(p_r=\\frac pm\\)' },
            { key: 'n', label: 'broj obračunskih razdoblja n', answer: n, tol: 0.01, unit: '', hint: 'godine × m' },
            { key: 'Cr', label: 'a) Cₙ uz relativni kamatnjak', answer: Crel, tol: 0.05, unit: '€', hint: '\\(C_n=C_0(1+\\frac{p_r}{100})^n\\)' },
            { key: 'pk', label: "b) konformni kamatnjak p' (%)", answer: pk, tol: 0.01, unit: '%', hint: "\\(p'=100\\left[(1+\\frac{p}{100})^{1/m}-1\\right]\\)" },
            { key: 'Ck', label: 'b) Cₙ uz konformni kamatnjak', answer: Ckon, tol: 0.05, unit: '€', hint: 'm obračuna s nezaokruženim konformnim faktorom = jedan godišnji: \\(C_0\\left(1+\\frac{p}{100}\\right)^{\\text{br. godina}}\\)' }
          ],
          solution: [
            'a) \\(p_r=\\frac{' + pa + '}{' + m + '}=' + kn(pr, 4) + '\\,\\%\\), \\(n=' + p.g + '\\cdot' + m + '=' + n + '\\), \\(C_{' + n + '}=' + kn(p.C0) + '\\cdot' + kn(1 + pr / 100, 6) + '^{' + n + '}\\approx' + kf(Crel) + '\\) €.',
            'b) \\(p\'=100\\left(' + kn(1 + pa / 100, 2) + '^{1/' + m + '}-1\\right)\\approx' + kf(pk) + '\\,\\%\\); \\((1+\\frac{p\'}{100})^{' + m + '}=' + kn(1 + pa / 100, 2) + '\\), pa je \\(C_{' + n + '}=' + kn(p.C0) + '\\cdot' + kn(1 + pa / 100, 2) + '^{' + p.g + '}\\approx' + kf(Ckon) + '\\) €.',
            'Relativni kamatnjak daje više (' + eur(Crel - Ckon) + ') zbog kamata na kamate unutar godine.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Relativni dijeli stopu, konformni korjenuje; konformni daje isto što i godišnji obračun.']
    },

    {
      id: 'mhr9-zavrsni-relativni',
      lesson: 'second-midterm', chapter: 9, category: 'interest',
      type: 'numeric',
      title: 'Završni ispit 2023/24: relativni kamatnjak',
      prompt: 'Završni ispit, grupa B, zadatak 6: koliko iznosi konačna vrijednost glavnice od 64 666 € nakon 5 godina, ako je kvartalna kamatna stopa 4 %, a obračun kamata složen, dekurzivan i polugodišnji? Zadatak riješite primjenom relativnog kamatnjaka (iznos na 2 decimale).',
      difficulty: 2,
      fields: [
        { key: 'pr', label: 'Polugodišnji relativni kamatnjak (%)', answer: 8, tol: 0.01, unit: '%', hint: 'Polugodište = 2 kvartala' },
        { key: 'n', label: 'Broj obračunskih razdoblja n', answer: 10, tol: 0.01, unit: '', hint: '5 godina × 2' },
        { key: 'C', label: 'C₁₀', answer: 139609.04, tol: 0.05, unit: '€', hint: '\\(64\\,666\\cdot1{,}08^{10}\\)' }
      ],
      solution: [
        'Stopa je zadana po kvartalu, obračun po polugodištu (= 2 kvartala) → \\(p_r=2\\cdot4\\,\\%=8\\,\\%\\).',
        '\\(n=5\\cdot2=10\\) polugodišta; \\(C_{10}=64\\,666\\cdot1{,}08^{10}\\approx139\\,609{,}04\\) €.'
      ]
    },

    // =====================================================================
    // 10. RENTE (second-midterm, annuities)
    // =====================================================================
    {
      id: 'mhr10-buduca-random',
      lesson: 'second-midterm', chapter: 10, category: 'annuities',
      type: 'numeric',
      title: 'Buduća vrijednost rente — postnumerando i prenumerando',
      prompt: 'Formule: \\(S_n\'=R\\cdot\\frac{r^n-1}{r-1}\\) (krajem razdoblja), \\(S_n=R\\cdot r\\cdot\\frac{r^n-1}{r-1}\\) (početkom). Iznose zaokružite na 2 decimale.',
      difficulty: 2,
      params: {
        R: { choices: [500, 1000, 2000, 3000, 5000] },
        p: { choices: [3, 4, 5, 6, 8] },
        n: { min: 3, max: 12, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100, rn = Math.pow(r, p.n);
        const Spost = p.R * (rn - 1) / (r - 1);
        const Spre = r2(Spost * r);
        return {
          prompt: 'Štedi se ' + eurN(p.R) + ' godišnje kroz ' + god(p.n) + ' uz ' + p.p + ' % godišnjih kamata (složeni, dekurzivni obračun). Koliko će se ukupno imati na kraju ako se uplaćuje a) krajem svake godine, b) početkom svake godine?',
          fields: [
            { key: 'post', label: "a) Sₙ' (postnumerando)", answer: r2(Spost), tol: TOL_POW, unit: '€', hint: 'r = ' + num(r, 2) + ', rⁿ ≈ ' + num(rn, 6) },
            { key: 'pre', label: 'b) Sₙ (prenumerando)', answer: Spre, tol: TOL_POW, unit: '€', hint: "Sₙ = r · Sₙ'" }
          ],
          solution: [
            '\\(r=' + kn(r, 2) + '\\), \\(r^{' + p.n + '}\\approx' + kf(rn, 6) + '\\).',
            'a) \\(S_{' + p.n + '}\'=' + kn(p.R) + '\\cdot\\frac{' + kf(rn, 6) + '-1}{' + kn(r - 1, 2) + '}\\approx' + kf(Spost) + '\\) €.',
            'b) \\(S_{' + p.n + '}=' + kn(r, 2) + '\\cdot' + kf(Spost) + '\\approx' + kf(Spre) + '\\) € — uplata s početka ukamaćuje se jedno razdoblje dulje.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Svaka prenumerando vrijednost = postnumerando · r.']
    },

    {
      id: 'mhr10-sadasnja-random',
      lesson: 'second-midterm', chapter: 10, category: 'annuities',
      type: 'numeric',
      title: 'Sadašnja vrijednost rente — koliko danas uložiti',
      prompt: 'Formule: \\(A_n=\\frac{R}{r^n}\\cdot\\frac{r^n-1}{r-1}\\) (isplate krajem), \\(A_n\'=\\frac{R}{r^{n-1}}\\cdot\\frac{r^n-1}{r-1}\\) (isplate početkom). Iznose zaokružite na 2 decimale.',
      difficulty: 2,
      params: {
        R: { choices: [2000, 5000, 10000] },
        p: { choices: [3, 4, 5, 6, 8] },
        n: { min: 3, max: 10, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100, rn = Math.pow(r, p.n);
        const Apost = p.R / rn * (rn - 1) / (r - 1);
        const Apre = Apost * r;
        return {
          prompt: 'Koliko danas treba uložiti da bi se ' + god(p.n) + ' podizalo po ' + eurN(p.R) + ' uz ' + p.p + ' % godišnjih kamata (složeni, dekurzivni obračun), ako se podiže a) krajem svake godine, b) početkom svake godine?',
          fields: [
            { key: 'post', label: 'a) Aₙ (postnumerando)', answer: r2(Apost), tol: TOL_POW, unit: '€', hint: 'r = ' + num(r, 2) + ', rⁿ ≈ ' + num(rn, 6) },
            { key: 'pre', label: "b) Aₙ' (prenumerando)", answer: r2(Apre), tol: TOL_POW, unit: '€', hint: "Aₙ' = r · Aₙ (potencija rⁿ⁻¹)" }
          ],
          solution: [
            '\\(r=' + kn(r, 2) + '\\), \\(r^{' + p.n + '}\\approx' + kf(rn, 6) + '\\).',
            'a) \\(A_{' + p.n + '}=\\frac{' + kn(p.R) + '}{' + kf(rn, 6) + '}\\cdot\\frac{' + kf(rn, 6) + '-1}{' + kn(r - 1, 2) + '}\\approx' + kf(Apost) + '\\) € — manje od ' + p.n + ' · ' + num(p.R) + ' = ' + eurN(p.n * p.R) + ', jer su kasnije isplate diskontirane.',
            'b) \\(A_{' + p.n + '}\'=\\frac{' + kn(p.R) + '}{' + kn(r, 2) + '^{' + (p.n - 1) + '}}\\cdot\\frac{' + kf(rn, 6) + '-1}{' + kn(r - 1, 2) + '}\\approx' + kf(Apre) + '\\) €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. „Koliko danas” je uvijek sadašnja vrijednost; kod prenumeranda je potencija \\(r^{n-1}\\).']
    },

    {
      id: 'mhr10-rata-random',
      lesson: 'second-midterm', chapter: 10, category: 'annuities',
      type: 'numeric',
      title: 'Rata rente iz buduće i sadašnje vrijednosti',
      prompt: 'Izrazite R iz formule rente. Iznose zaokružite na 2 decimale.',
      difficulty: 3,
      params: {
        S: { choices: [20000, 30000, 50000, 100000] },
        p: { choices: [3, 4, 5, 6] },
        n: { min: 5, max: 15, step: 1 },
        A: { choices: [50000, 60000, 100000, 150000] },
        p2: { choices: [4, 5, 6, 7] },
        n2: { min: 5, max: 12, step: 1 }
      },
      generate(p) {
        const r = 1 + p.p / 100, rn = Math.pow(r, p.n);
        const Ra = r2(p.S * (r - 1) / (rn - 1));
        const q = 1 + p.p2 / 100, qn = Math.pow(q, p.n2);
        const Rb = r2(p.A * qn * (q - 1) / (qn - 1));
        return {
          prompt: 'a) Koliko treba uplaćivati krajem svake godine da se za ' + god(p.n) + ' uz ' + p.p + ' % skupi ' + eurN(p.S) + '? '
            + 'b) Danas se uloži ' + eurN(p.A) + ' uz ' + p.p2 + ' %. Koliki se jednaki iznos može podizati krajem svake od idućih ' + p.n2 + ' godina? (Složeni, dekurzivni, godišnji obračun.)',
          fields: [
            { key: 'Ra', label: 'a) R', answer: Ra, tol: TOL_POW, unit: '€', hint: "\\(R=\\frac{S_n'(r-1)}{r^n-1}\\)" },
            { key: 'Rb', label: 'b) R', answer: Rb, tol: TOL_POW, unit: '€', hint: '\\(R=\\frac{A_n\\,r^n(r-1)}{r^n-1}\\)' }
          ],
          solution: [
            'a) Buduća vrijednost, postnumerando: \\(R=\\frac{' + kn(p.S) + '\\cdot' + kn(r - 1, 2) + '}{' + kn(r, 2) + '^{' + p.n + '}-1}\\approx' + kf(Ra) + '\\) €.',
            'b) Sadašnja vrijednost, postnumerando: \\(R=\\frac{' + kn(p.A) + '\\cdot' + kn(q, 2) + '^{' + p.n2 + '}\\cdot' + kn(q - 1, 2) + '}{' + kn(q, 2) + '^{' + p.n2 + '}-1}\\approx' + kf(Rb) + '\\) €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje nove podatke. Prvo odluči: buduća (S) ili sadašnja (A), početkom (pre) ili krajem (post) — pa izrazi R.']
    },

    {
      id: 'mhr10-zavrsni-renta',
      lesson: 'second-midterm', chapter: 10, category: 'annuities',
      type: 'numeric',
      title: 'Završni ispit 2023/24: podizanje iz uloga',
      prompt: 'Završni ispit, grupa B, zadatak 3: neka osoba uloži danas u banku 60 000 €. Koliko iznose nominalno jednaki godišnji iznosi koji se mogu podizati krajem godine u idućih 7 godina? Obračun je složen, godišnji i dekurzivan, uz fiksnu stopu 5 %. Iznose zaokružite na 2 decimale.',
      difficulty: 2,
      fields: [
        { key: 'R', label: 'R', answer: 10369.19, tol: TOL_POW, unit: '€', hint: '„Danas” + „krajem godine” → sadašnja vrijednost postnumerando' },
        { key: 'sum', label: 'Ukupno podignuto 7 · R', answer: 72584.33, tol: 0.5, unit: '€', hint: '7 · R' },
        { key: 'K', label: 'Od toga kamate', answer: 12584.33, tol: 0.5, unit: '€', hint: '7R − 60 000' }
      ],
      solution: [
        '\\(R=\\frac{A_n\\,r^n(r-1)}{r^n-1}=\\frac{60\\,000\\cdot1{,}05^7\\cdot0{,}05}{1{,}05^7-1}\\approx10\\,369{,}19\\) €.',
        'Ukupno se podigne \\(7\\cdot10\\,369{,}19=72\\,584{,}33\\) €, od čega je \\(12\\,584{,}33\\) € kamata.'
      ]
    },

    {
      id: 'mhr10-fin-pojmovi',
      lesson: 'second-midterm', chapter: 10, category: 'annuities',
      type: 'choice',
      title: 'Kamate, rente i zajam — pojmovi',
      prompt: 'Prepoznajte formulu iz teksta zadatka.',
      difficulty: 1,
      items: [
        { q: 'Prenumerando znači uplata na početku razdoblja.', kind: 'tf', answer: true },
        { q: 'Relativni kamatnjak daje isti godišnji učinak kao godišnji obračun.', kind: 'tf', answer: false },
        { q: 'Kod zajma s jednakim anuitetima kamate s vremenom padaju, a otplatne kvote rastu.', kind: 'tf', answer: true },
        { q: 'Kamate k-tog razdoblja zajma računaju se na početni zajam \\(C_0\\).', kind: 'tf', answer: false },
        { q: '„Koliko danas treba uložiti da bi se krajem svake godine podizalo R” traži:', kind: 'mc', options: ['\\(S_n\'\\)', '\\(S_n\\)', '\\(A_n\\)', '\\(A_n\'\\)'], answer: 2 },
        { q: 'Za p = 6 % kamatni faktor je:', kind: 'mc', options: ['\\(0{,}06\\)', '\\(1{,}06\\)', '\\(6\\)', '\\(1{,}6\\)'], answer: 1 },
        { q: 'Ukupne kamate zajma jednake su:', kind: 'mc', options: ['\\(\\sum a_k+C_0\\)', '\\(\\sum a_k-C_0\\)', '\\(C_0\\cdot p\\)', '\\(\\frac{C_0}{n}\\)'], answer: 1 }
      ],
      solution: [
        'Relativni kamatnjak (\\(p/m\\)) daje VIŠE od godišnjeg obračuna; isti učinak daje konformni.',
        '\\(I_k=\\frac{C_{k-1}\\cdot p}{100}\\) — na ostatak duga s kraja prethodnog razdoblja.',
        '„Danas” = sadašnja vrijednost, „krajem” = postnumerando → \\(A_n\\).'
      ]
    },

    // =====================================================================
    // 11. ZAJAM (second-midterm, loans)
    // =====================================================================
    {
      id: 'mhr11-anuiteti-random',
      lesson: 'second-midterm', chapter: 11, category: 'loans',
      type: 'numeric',
      title: 'Zajam s jednakim anuitetima — prva dva retka tablice',
      prompt: 'Nominalno jednaki anuiteti krajem godine, složeni dekurzivni obračun. Svaki iznos zaokružite na 2 decimale (kao u otplatnoj tablici).',
      difficulty: 3,
      params: {
        C: { choices: [20000, 30000, 40000, 60000, 80000, 100000] },
        p: { choices: [4, 5, 6, 7, 8, 10] },
        n: { min: 3, max: 8, step: 1 }
      },
      generate(p) {
        const t = loanTable(p.C, p.p, p.n);
        const w1 = t.rows[0], w2 = t.rows[1];
        const r = 1 + p.p / 100;
        return {
          prompt: 'Zajam od ' + eurN(p.C) + ' odobren je na ' + god(p.n) + ' uz ' + p.p + ' % godišnjih dekurzivnih kamata, uz plaćanje nominalno jednakih anuiteta krajem godine. Izračunajte anuitet te prva dva retka otplatne tablice.',
          fields: [
            { key: 'a', label: 'Anuitet a', answer: t.a, tol: TOL_POW, unit: '€', hint: '\\(a=C\\cdot\\frac{r^n(r-1)}{r^n-1}\\)' },
            { key: 'I1', label: 'Kamate I₁', answer: w1.I, tol: 0.01, unit: '€', hint: '\\(I_1=\\frac{C_0\\cdot p}{100}\\)' },
            { key: 'R1', label: 'Otplatna kvota R₁', answer: w1.R, tol: TOL_POW, unit: '€', hint: 'R₁ = a − I₁' },
            { key: 'C1', label: 'Ostatak duga C₁', answer: w1.C, tol: TOL_POW, unit: '€', hint: 'C₁ = C₀ − R₁' },
            { key: 'I2', label: 'Kamate I₂', answer: w2.I, tol: 0.05, unit: '€', hint: '\\(I_2=\\frac{C_1\\cdot p}{100}\\)' },
            { key: 'R2', label: 'Otplatna kvota R₂', answer: w2.R, tol: TOL_POW, unit: '€', hint: 'R₂ = a − I₂ (≈ R₁ · r)' }
          ],
          solution: [
            '\\(r=' + kn(r, 2) + '\\), \\(r^{' + p.n + '}\\approx' + kf(t.rn, 6) + '\\); \\(a=' + kn(p.C) + '\\cdot\\frac{' + kf(t.rn, 6) + '\\cdot' + kn(r - 1, 2) + '}{' + kf(t.rn - 1, 6) + '}\\approx' + kf(t.a) + '\\) €.',
            '1. redak: \\(I_1=\\frac{' + kn(p.C) + '\\cdot' + p.p + '}{100}=' + kf(w1.I) + '\\), \\(R_1=' + kf(t.a) + '-' + kf(w1.I) + '=' + kf(w1.R) + '\\), \\(C_1=' + kf(w1.C) + '\\).',
            '2. redak: \\(I_2=\\frac{' + kf(w1.C) + '\\cdot' + p.p + '}{100}\\approx' + kf(w2.I) + '\\), \\(R_2=' + kf(w2.R) + '\\), \\(C_2=' + kf(w2.C) + '\\).',
            'Kontrola: \\(R_1\\cdot r=' + kf(w1.R * r) + '\\approx R_2\\) (razlika najviše koji cent zbog zaokruživanja). Ukupne kamate cijelog zajma: ' + eur(t.sumI) + '.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi zajam. Kamate se računaju na ostatak duga s kraja PRETHODNOG razdoblja.']
    },

    (function () {
      const t = loanTable(40000, 7, 3);
      const w = t.rows;
      return {
        id: 'mhr11-zavrsni-zajam',
        lesson: 'second-midterm', chapter: 11, category: 'loans',
        type: 'numeric',
        title: 'Završni ispit 2023/24: otplatna tablica i kontrola',
        prompt: 'Završni ispit, grupa B, zadatak 1: zajam od 40 000 € odobren je firmi na 3 godine uz 7 % godišnjih dekurzivnih kamata i plaćanje nominalno jednakih anuiteta krajem godine. a) Sastavite otplatnu tablicu, b) izvršite kontrolu tablice. Iznose zaokružite na 2 decimale.',
        difficulty: 3,
        fields: [
          { key: 'a', label: 'Anuitet a', answer: t.a, tol: TOL_POW, unit: '€', hint: '\\(a=40\\,000\\cdot\\frac{1{,}07^3\\cdot0{,}07}{1{,}07^3-1}\\)' },
          { key: 'I1', label: 'Kamate I₁', answer: w[0].I, tol: 0.01, unit: '€', hint: '40 000 · 7 / 100' },
          { key: 'C1', label: 'Ostatak duga C₁', answer: w[0].C, tol: TOL_POW, unit: '€', hint: 'C₀ − (a − I₁)' },
          { key: 'I2', label: 'Kamate I₂', answer: w[1].I, tol: 0.05, unit: '€', hint: 'C₁ · 7 / 100' },
          { key: 'C2', label: 'Ostatak duga C₂', answer: w[1].C, tol: TOL_POW, unit: '€', hint: 'C₁ − R₂' },
          { key: 'I3', label: 'Kamate I₃', answer: w[2].I, tol: 0.05, unit: '€', hint: 'C₂ · 7 / 100' },
          { key: 'SI', label: 'Σ kamata', answer: t.sumI, tol: TOL_POW, unit: '€', hint: 'Kontrola: Σ anuiteta − C₀' }
        ],
        solution: [
          '\\(r=1{,}07\\), \\(r^3=1{,}225043\\); \\(a\\approx' + kf(t.a) + '\\) €.',
          '1. godina: \\(I_1=' + kf(w[0].I) + '\\), \\(R_1=' + kf(w[0].R) + '\\), \\(C_1=' + kf(w[0].C) + '\\).',
          '2. godina: \\(I_2=' + kf(w[1].I) + '\\), \\(R_2=' + kf(w[1].R) + '\\), \\(C_2=' + kf(w[1].C) + '\\).',
          '3. godina: \\(I_3=' + kf(w[2].I) + '\\), \\(R_3=C_2=' + kf(w[2].R) + '\\), zadnji anuitet \\(' + kf(w[2].a) + '\\) (korigiran za cent), \\(C_3=0\\).',
          'Kontrole: a) zadnja kvota = ostatak duga nakon 2. godine ✓; b) Σ kvota = ' + eur(t.sumR) + ' ✓; c) ' + eur(40000) + ' + ' + eur(t.sumI) + ' = ' + eur(t.sumA) + ' = Σ anuiteta ✓.'
        ]
      };
    })(),

    {
      id: 'mhr11-kvote-random',
      lesson: 'second-midterm', chapter: 11, category: 'loans',
      type: 'numeric',
      title: 'Zajam s jednakim otplatnim kvotama',
      prompt: 'Formule: \\(R=\\frac Cn\\), \\(I_i=\\frac{C_{i-1}p}{100}\\), \\(a_i=R+I_i\\), \\(C_i=C\\left(1-\\frac in\\right)\\).',
      difficulty: 2,
      params: {
        R: { choices: [5000, 10000, 15000, 20000] },
        n: { min: 3, max: 6, step: 1 },
        p: { choices: [4, 5, 6, 8, 10] }
      },
      generate(p) {
        const C = p.R * p.n;
        const I1 = C * p.p / 100;
        const a1 = p.R + I1;
        const an = r2(p.R + p.R * p.p / 100);
        const sumI = r2(p.p / 100 * p.R * p.n * (p.n + 1) / 2);
        return {
          prompt: 'Zajam od ' + eurN(C) + ' otplaćuje se ' + god(p.n) + ' nominalno jednakim otplatnim kvotama uz ' + p.p + ' % godišnjih kamata. Izračunajte kvotu, prvi i zadnji anuitet te ukupne kamate.',
          fields: [
            { key: 'R', label: 'Otplatna kvota R', answer: p.R, tol: 0.01, unit: '€', hint: 'R = C ÷ n' },
            { key: 'a1', label: 'Prvi anuitet a₁', answer: a1, tol: 0.01, unit: '€', hint: 'a₁ = R + C·p/100' },
            { key: 'an', label: 'Zadnji anuitet aₙ', answer: an, tol: 0.01, unit: '€', hint: 'Prije zadnje otplate duguje se još točno R' },
            { key: 'SI', label: 'Ukupne kamate', answer: sumI, tol: 0.01, unit: '€', hint: 'Zbroj kamata svih redaka' }
          ],
          solution: [
            '\\(R=\\frac{' + kn(C) + '}{' + p.n + '}=' + kn(p.R) + '\\) €; \\(I_1=\\frac{' + kn(C) + '\\cdot' + p.p + '}{100}=' + kn(I1) + '\\), \\(a_1=' + kn(a1) + '\\) €.',
            'Dug pada za R svake godine, pa kamate padaju za \\(\\frac{R\\cdot p}{100}=' + kn(p.R * p.p / 100) + '\\) €; zadnji redak: \\(C_{n-1}=R\\Rightarrow a_n=R+\\frac{R\\cdot p}{100}=' + kn(an) + '\\) €.',
            'Ukupne kamate: \\(\\frac{p}{100}\\cdot R\\cdot(n+(n-1)+\\ldots+1)=' + kn(sumI) + '\\) €.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi zajam. Kvota je stalna, anuiteti padaju jer kamate padaju.']
    },

    // =====================================================================
    // 12. GAUSS-JORDANOVA METODA (second-midterm, gaussJordan)
    // =====================================================================
    {
      id: 'mhr12-gj-3x3-random',
      lesson: 'second-midterm', chapter: 12, category: 'gaussJordan',
      type: 'numeric',
      title: 'Sustav 3 × 3 — Gauss-Jordanova metoda',
      prompt: 'Svedite proširenu matricu na jediničnu (samo transformacije redaka) i pročitajte rješenje.',
      difficulty: 3,
      params: {
        tpl: { choices: [0, 1, 2, 3] },
        x: { min: -3, max: 5, step: 1 },
        y: { min: -3, max: 5, step: 1 },
        z: { min: -3, max: 5, step: 1 }
      },
      generate(p) {
        const T = [
          [[1, 1, 1], [2, -1, 1], [1, 2, -1]],
          [[1, -1, 2], [3, 1, -1], [2, 3, 1]],
          [[2, 1, 1], [1, 3, 2], [1, 0, 1]],
          [[1, 1, 0], [0, 1, 1], [1, 0, 1]]
        ][p.tpl];
        const s = [p.x, p.y, p.z];
        const b = T.map((row) => row[0] * s[0] + row[1] * s[1] + row[2] * s[2]);
        const eq = (row) => poly([[row[0], 'x'], [row[1], 'y'], [row[2], 'z']]);
        const mat = T.map((row, i) => row.map((v) => kn(v)).join('&') + '&' + kn(b[i])).join('\\\\');
        return {
          prompt: 'Riješite sustav: \\(' + eq(T[0]) + '=' + kn(b[0]) + ',\\ ' + eq(T[1]) + '=' + kn(b[1]) + ',\\ ' + eq(T[2]) + '=' + kn(b[2]) + '\\).',
          fields: [
            { key: 'x', label: 'x', answer: p.x, tol: 0.01, unit: '', hint: 'Stupac po stupac: stožer 1, ostale elemente stupca poništi' },
            { key: 'y', label: 'y', answer: p.y, tol: 0.01, unit: '', hint: 'Nepoznanica koja nedostaje upisuje se kao 0' },
            { key: 'z', label: 'z', answer: p.z, tol: 0.01, unit: '', hint: 'Zadnji stupac reducirane matrice' }
          ],
          solution: [
            'Proširena matrica: \\(\\left[\\begin{array}{ccc|c}' + mat + '\\end{array}\\right]\\).',
            'Transformacijama redaka (zamjena, množenje brojem ≠ 0, dodavanje višekratnika) lijevi blok svodimo na jediničnu matricu.',
            '\\(\\left[\\begin{array}{ccc|c}1&0&0&' + kn(p.x) + '\\\\0&1&0&' + kn(p.y) + '\\\\0&0&1&' + kn(p.z) + '\\end{array}\\right]\\Rightarrow x=' + kn(p.x) + ',\\ y=' + kn(p.y) + ',\\ z=' + kn(p.z) + '\\).',
            'Provjera u 1. jednadžbi: \\(' + T[0][0] + '\\cdot' + kp(p.x) + (T[0][1] < 0 ? '' : '+') + T[0][1] + '\\cdot' + kp(p.y) + (T[0][2] < 0 ? '' : '+') + T[0][2] + '\\cdot' + kp(p.z) + '=' + kn(b[0]) + '\\) ✓.'
          ]
        };
      },
      solution: ['Gumb za nove brojeve daje novi sustav. Radi stupac po stupac i uvijek transformiraj CIJELI redak, uključujući desni stupac.']
    },

    {
      id: 'mhr12-gj-pojmovi',
      lesson: 'second-midterm', chapter: 12, category: 'gaussJordan',
      type: 'choice',
      title: 'Gauss-Jordanova metoda — pojmovi',
      prompt: 'Dopuštene transformacije i čitanje reducirane matrice.',
      difficulty: 1,
      items: [
        { q: 'Zamjena dvaju redaka je dopuštena transformacija.', kind: 'tf', answer: true },
        { q: 'Redak se smije pomnožiti nulom.', kind: 'tf', answer: false },
        { q: 'Smiju se transformirati i stupci.', kind: 'tf', answer: false },
        { q: 'Gaussova metoda staje kod gornje trokutaste matrice i nastavlja supstitucijom unatrag.', kind: 'tf', answer: true },
        { q: 'Redak \\([\\,0\\ 0\\ 0\\mid5\\,]\\) znači:', kind: 'mc', options: ['jedinstveno rješenje', 'beskonačno mnogo rješenja', 'nema rješenja', 'z = 5'], answer: 2 },
        { q: 'Redak \\([\\,0\\ 0\\ 0\\mid0\\,]\\) (uz ostale retke bez proturječja) znači:', kind: 'mc', options: ['nema rješenja', 'beskonačno mnogo rješenja', 'jedinstveno rješenje', 'grešku u računu'], answer: 1 }
      ],
      solution: [
        'Dopušteno: zamjena redaka, množenje retka brojem ≠ 0, dodavanje višekratnika retka drugom retku. Stupci se ne diraju.',
        'Nula samo lijevo → proturječje \\(0=k\\), nema rješenja; nula na obje strane → slobodna nepoznanica, beskonačno rješenja.'
      ]
    }
  ];

  // Engine (resolveExercise = Object.assign(ex, generate(p))) statični `prompt` randomizirane
  // vježbe ZAMIJENI generiranim → uputa („zaokružite na 2 decimale”, formule) bi nestala.
  // Zato se statični prompt ovdje, na jednom mjestu, lijepi ispred generiranog.
  exercises.forEach(function (ex) {
    if (typeof ex.generate !== 'function' || !ex.prompt) return;
    const gen = ex.generate, lead = ex.prompt;
    ex.generate = function (p) {
      const out = gen.call(this, p);
      out.prompt = lead + ' ' + out.prompt;
      return out;
    };
  });

  return { meta: { lang: 'hr', currency: '', version: 1 }, exercises: exercises };
})();

if (typeof window !== 'undefined') window.mathHrExercises = mathHrExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = mathHrExercises;
