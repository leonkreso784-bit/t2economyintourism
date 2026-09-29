// Statistika (HR) — Final (završni ispit)
// Spaja HR M1 + M2 + examPractice. AUTORSKI IZ HR MATERIJALA (predavanja/seminari FMTU, Merlin 2025/26)
// + stvarna ispitna pitanja (Drive: PITANJA ZI, STAT ZAVRŠNI, STATISTIKA ZAVRŠNI). MORA se učitati POSLIJE midterm-1/2.
// MODEL: kartice <200 znak, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX: inline "\\( … \\)", blok "\\[ … \\]"; NIKAD jedan dolar.

const statisticsHrFinalExamPractice = {
  "name": "Vježba za ispit (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#f59e0b",
  "flashcards": [
    {
      "question": "Koje srednje vrijednosti smijemo koristiti za koju vrstu niza?",
      "answer": "Nominalni niz: samo mod. Redoslijedni: mod i medijan. Numerički: sve (AS, HS, GS, Mo, Me).",
      "explanation": "Za „spol” ima smisla samo mod, za ocjene i medijan."
    },
    {
      "question": "PONAVLJANJE: intervali vrijednosti pokazatelja?",
      "answer": "r i rₛ: −1 do +1 · α₃: ±2 · Pearson Sk: ±3 · Bowley SkQ: ±1 · VQ: 0 do 1 · α₄ = 3 normalna, 1,8 pravokutna.",
      "explanation": "Česta ispitna pitanja tipa „koja mjera poprima vrijednosti od … do …”."
    },
    {
      "question": "PONAVLJANJE: što mjeri koji moment oko sredine?",
      "answer": "μ₂ = varijanca (disperzija); μ₃ je temelj koeficijenta asimetrije α₃; μ₄ je temelj koeficijenta zaobljenosti α₄.",
      "explanation": "μ₀ = 1, μ₁ = 0."
    },
    {
      "question": "PONAVLJANJE: koji grafikon za koji niz?",
      "answer": "Numerički: histogram, poligon frekvencija. Geografski: kartogrami (piktogram, statistička i dijagramska karta). Vremenski: linijski. RBK: Varzarov znak. Postoci: razdijeljeni stupci.",
      "explanation": "Trenutačni vremenski niz: samo linijski grafikon."
    },
    {
      "question": "PONAVLJANJE: bazni, verižni indeks i stopa promjene?",
      "answer": "Bazni: Yₜ/Y_b · 100 (prema baznom). Verižni: Yₜ/Yₜ₋₁ · 100 (prema prethodnom). Stopa promjene: indeks − 100.",
      "explanation": "Verižni 90 = pad od 10 %."
    },
    {
      "question": "PONAVLJANJE: koji interval procjene?",
      "answer": "„Prosječni” (prihod, potrošnja, broj zaposlenih) → aritmetička sredina. „Ukupni” → total. „Postotak / koliko ih je …” → proporcija.",
      "explanation": "Primjer: nezadovoljni gosti hotela → proporcija."
    },
    {
      "question": "PONAVLJANJE: koeficijent pouzdanosti t?",
      "answer": "Veliki uzorak (n > 30): 1,96 uz 95 %, 2,58 uz 99 %. Mali uzorak: k = n − 1 i tablica Studentove razdiobe.",
      "explanation": "t ovisi o veličini uzorka i postotku pouzdanosti."
    },
    {
      "question": "PONAVLJANJE: što su a i b u regresiji i trendu?",
      "answer": "a = konstantni član (vrijednost Y kada je x = 0). b = regresijski koeficijent (koeficijent trenda): prosječna promjena Y za jedinično povećanje x.",
      "explanation": "Jednadžba: Yc = a + bx."
    },
    {
      "question": "ZAMKA: je li mod najveća frekvencija?",
      "answer": "Ne — mod je vrijednost obilježja kojoj pripada najveća frekvencija.",
      "explanation": "Ocjena 2 kod 23 studenta → Mo = 2."
    },
    {
      "question": "ZAMKA: koja sredina za prosječnu stopu promjene?",
      "answer": "Geometrijska sredina (verižnih indeksa). Harmonijska služi za prosječno vrijeme po jedinici i relativne brojeve istih brojnika.",
      "explanation": "Neke studentske bilješke ovdje pogrešno navode harmonijsku."
    },
    {
      "question": "ZAMKA: ubraja li se koeficijent asimetrije u mjere disperzije?",
      "answer": "Ne. Mjere disperzije su R, IQ, σ², σ, V i VQ. Koeficijent asimetrije mjeri oblik distribucije.",
      "explanation": "Relativne mjere disperzije: V i VQ."
    },
    {
      "question": "Kako napisati ZAKLJUČAK računskog zadatka?",
      "answer": "Rezultat s mjernom jedinicom + tumačenje u kontekstu (npr. „uz 95 % pouzdanosti prosječna potrošnja gosta je između 57,06 i 62,94 €”).",
      "explanation": "Na predavanjima i seminarima svaki zadatak završava zaključkom."
    },
    {
      "question": "Kako se određuju kvartili negrupiranog niza?",
      "answer": "Položaj N/4 (Q1) i 3N/4 (Q3): necijeli broj → prvi sljedeći cijeli položaj; cijeli broj → poluzbroj dvaju susjednih članova.",
      "explanation": "Niz prvo uredi po veličini."
    }
  ],
  "quiz": [
    {
      "question": "Koliko iznosi aritmetička sredina niza xᵢ: 1, 2, 4, 5, 18?",
      "options": ["4", "5", "6", "7,5"],
      "correct": 2
    },
    {
      "question": "Koliko iznosi medijan niza xᵢ: 1, 11, 6, 2, 4?",
      "options": ["6", "4", "4,8", "2"],
      "correct": 1
    },
    {
      "question": "Za niz xᵢ: 2, 2, 4, 12 aritmetička sredina, medijan i mod iznose:",
      "options": ["AS = 5, Me = 3, Mo = 2", "AS = 5, Me = 4, Mo = 2", "AS = 4, Me = 3, Mo = 12", "AS = 5, Me = 3, Mo ne postoji"],
      "correct": 0
    },
    {
      "question": "Koliko iznosi mod niza xᵢ: 1, 2, 2, 2, 3, 4, 4, 6?",
      "options": ["2", "3", "4", "Mod ne postoji"],
      "correct": 0
    },
    {
      "question": "Četvrti moment oko sredine iznosi 18, a standardna devijacija na četvrtu potenciju 9. Koeficijent zaobljenosti je 2, pa je distribucija:",
      "options": ["Šiljastija od normalne", "Plosnatija od normalne", "Pravokutna", "U-distribucija"],
      "correct": 1
    },
    {
      "question": "U mjere disperzije ubrajamo:",
      "options": ["Koeficijent varijacije i koeficijent asimetrije", "Koeficijent varijacije i koeficijent kvartilne devijacije", "Mod i medijan", "Koeficijent asimetrije i koeficijent zaobljenosti"],
      "correct": 1
    },
    {
      "question": "Ako je r = 2,34, korelacija je:",
      "options": ["Potpuna i pozitivna", "Jaka i pozitivna", "Nemoguća — r ne može biti veći od 1", "Srednje jaka i pozitivna"],
      "correct": 2
    },
    {
      "question": "Verižni indeksi noćenja su 110 i 90. Koliki je bazni indeks treće godine (prva godina = 100) i koja je sredina prikladna za prosječni indeks?",
      "options": ["99; geometrijska sredina", "100; aritmetička sredina", "99; harmonijska sredina", "100; geometrijska sredina"],
      "correct": 0
    },
    {
      "question": "Ako standardna devijacija iznosi 3, drugi moment oko sredine (varijanca) iznosi:",
      "options": ["3", "6", "9", "1,73"],
      "correct": 2
    },
    {
      "question": "Ljestvica mjerenja kojoj pripada temperatura u °C je:",
      "options": ["Nominalna", "Ordinalna", "Intervalna", "Omjerna"],
      "correct": 2
    },
    {
      "question": "N = 1 100, n = 66. Treba li standardnu grešku korigirati faktorom korekcije?",
      "options": ["Ne, jer je f = 0,06 < 0,05", "Da, jer je f = 0,06 > 0,05", "Ne, jer je n > 30", "Da, jer je n > 50"],
      "correct": 1
    },
    {
      "question": "Kako se zove tablica koja sadrži dio uređenih podataka izdvojen za određenu analizu?",
      "options": ["Izvještajna", "Analitička", "Kombinirana", "Jednostavna"],
      "correct": 1
    },
    {
      "question": "Studentova (t) distribucija u odnosu na normalnu distribuciju je:",
      "options": ["Vrhom šiljastija", "Vrhom sploštenija", "Asimetrična udesno", "Jednaka normalnoj za svaki n"],
      "correct": 1
    },
    {
      "question": "Niz xᵢ: 2, 3, 4, 5, 6, 6, 6, 7. Mod i medijan su:",
      "options": ["Mo = 6, Me = 5", "Mo = 6, Me = 5,5", "Mo = 6, Me = 6", "Mo = 3, Me = 4,5"],
      "correct": 1
    },
    {
      "question": "Trend u jednadžbi Yc = 5 191,4 − 596,2x (posjetitelji kina, 2018. – 2022., u 000) pokazuje da se broj posjetitelja:",
      "options": ["Povećavao prosječno za 596,2 tisuće godišnje", "Smanjivao prosječno za 596,2 tisuće godišnje", "Smanjivao prosječno za 5 191,4 tisuće godišnje", "Nije mijenjao"],
      "correct": 1
    },
    {
      "question": "Zadano je AS = 8, Mo = 2, σ = 2. Pearsonova mjera asimetrije Sk1 iznosi 3, što znači:",
      "options": ["Snažnu pozitivnu asimetriju (na granici uobičajenog intervala)", "Simetričnu distribuciju", "Negativnu asimetriju", "Pravokutnu distribuciju"],
      "correct": 0
    }
  ],
  "fillBlanks": [
    {
      "sentence": "Mjera disperzije koja je omjer standardne devijacije i aritmetičke sredine pomnožen sa 100 zove se koeficijent _______.",
      "answer": "varijacije",
      "hint": "V."
    },
    {
      "sentence": "Za procjenu postotka elemenata s traženim obilježjem koristi se interval procjene _______.",
      "answer": "proporcije",
      "hint": "p = m / n."
    },
    {
      "sentence": "Mod dijeli distribuciju na rastuću i _______ stranu.",
      "answer": "padajuću",
      "hint": "Suprotno od rastuće."
    },
    {
      "sentence": "Interkvartil obuhvaća središnjih _______ posto elemenata niza.",
      "answer": "50",
      "hint": "Broj."
    },
    {
      "sentence": "Razlika između rezultata uzorka i populacije naziva se _______ uzorka.",
      "answer": "pogreška",
      "hint": "Iz ispitnih pitanja (nadopunite izjavu)."
    },
    {
      "sentence": "Kvartili dijele uređeni niz na _______ jednaka dijela.",
      "answer": "četiri",
      "hint": "Riječima."
    },
    {
      "sentence": "Koeficijent pouzdanosti ovisi o veličini uzorka i postotku _______.",
      "answer": "pouzdanosti",
      "hint": "Određuje ga istraživač."
    },
    {
      "sentence": "Potpune srednje vrijednosti su aritmetička, harmonijska i _______ sredina.",
      "answer": "geometrijska",
      "hint": "Koristi se za prosječnu stopu promjene."
    },
    {
      "sentence": "Dijagram koji prikazuje najmanju vrijednost, Q1, medijan, Q3 i najveću vrijednost zove se _______ dijagram.",
      "answer": "pravokutni",
      "hint": "Box-plot."
    },
    {
      "sentence": "Za distribuciju s razredima raspon varijacije jednak je razlici gornje granice posljednjeg i donje granice _______ razreda.",
      "answer": "prvog",
      "hint": "Redni broj razreda."
    }
  ],
  "learn": {
    "title": "Vježba za ispit — strategija i pregled formula",
    "content":
      '<h3>Kako izgleda ispit</h3>' +
      '<p>Prema prikupljenim ispitnim pitanjima (Drive), ispit kombinira: (1) pitanja s <strong>jednim točnim odgovorom</strong> od 4–6 ponuđenih — često uz opciju „ništa od navedenog”; (2) tvrdnje <strong>točno / netočno</strong>; (3) <strong>nadopunjavanje</strong> izjave; (4) kratke <strong>računske zadatke</strong> (AS, Mo, Me, kvartili, momenti, mjere asimetrije, indeksi, intervali procjene, regresija, trend). 1. kolokvij pokriva predavanja 1–6, 2. kolokvij predavanja 7–9, a završni ispit sve.</p>' +
      '<div class="tip-box"><strong>„Ništa od navedenog” zna biti točno:</strong> npr. r = +0,22 je <em>slaba</em> pozitivna veza — ako ponuđeni odgovori nude samo „srednje jaka”, „potpuna” i „odsustvo veze”, točno je „ništa od navedenog”. Isto: niz 2, 3, 4, 5, 6, 6, 6, 7 ima Mo = 6 i Me = 5,5 — provjeri nudi li lista baš tu kombinaciju.</div>' +

      '<h4>Pregled formula — 1. dio (predavanja 1–6)</h4>' +
      '<table>' +
      '<tr><th>Pokazatelj</th><th>Formula</th></tr>' +
      '<tr><td>Postotak</td><td>\\( P_i = \\frac{f_i}{N} \\cdot 100\\,\\% \\)</td></tr>' +
      '<tr><td>Bazni indeks (kvalitativni niz)</td><td>\\( I_i = \\frac{f_i}{B} \\cdot 100 \\)</td></tr>' +
      '<tr><td>Aritmetička sredina</td><td>\\( \\bar{x} = \\frac{\\sum x_i}{N} \\), \\( \\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} \\)</td></tr>' +
      '<tr><td>Harmonijska / geometrijska</td><td>\\( H = \\frac{N}{\\sum 1/x_i} \\), \\( G = \\sqrt[N]{x_1 \\cdots x_N} \\)</td></tr>' +
      '<tr><td>Mod (razredi)</td><td>\\( M_o = L_1 + \\frac{b-a}{(b-a)+(b-c)} \\cdot i \\), \\( f_c = f_i / i \\)</td></tr>' +
      '<tr><td>Medijan (razredi)</td><td>\\( M_e = L_1 + \\frac{N/2 - \\sum f_1}{f_{med}} \\cdot i \\)</td></tr>' +
      '<tr><td>Kvartili (razredi)</td><td>\\( Q_1 = L_1 + \\frac{N/4 - \\sum f_1}{f_{Q_1}} \\cdot i \\), \\( Q_3 = L_1 + \\frac{3N/4 - \\sum f_1}{f_{Q_3}} \\cdot i \\)</td></tr>' +
      '<tr><td>Raspon, interkvartil, VQ</td><td>\\( R = x_{max} - x_{min} \\), \\( I_Q = Q_3 - Q_1 \\), \\( V_Q = \\frac{Q_3 - Q_1}{Q_3 + Q_1} \\)</td></tr>' +
      '<tr><td>Varijanca, σ, V</td><td>\\( \\sigma^2 = \\mu_2 = \\frac{\\sum f_i (x_i - \\bar{x})^2}{\\sum f_i} \\), \\( \\sigma = \\sqrt{\\sigma^2} \\), \\( V = \\frac{\\sigma}{\\bar{x}} \\cdot 100 \\)</td></tr>' +
      '<tr><td>Asimetrija</td><td>\\( \\alpha_3 = \\frac{\\mu_3}{\\sigma^3} \\), \\( S_{k1} = \\frac{\\bar{x} - M_o}{\\sigma} \\), \\( S_{k2} = \\frac{3(\\bar{x} - M_e)}{\\sigma} \\), \\( S_{kQ} = \\frac{Q_1 + Q_3 - 2M_e}{Q_3 - Q_1} \\)</td></tr>' +
      '<tr><td>Zaobljenost</td><td>\\( \\alpha_4 = \\frac{\\mu_4}{\\sigma^4} \\)</td></tr>' +
      '</table>' +

      '<h4>Pregled formula — 2. dio (predavanja 7–9)</h4>' +
      '<table>' +
      '<tr><th>Pokazatelj</th><th>Formula</th></tr>' +
      '<tr><td>Frakcija izbora, faktor korekcije</td><td>\\( f = \\frac{n}{N} \\), \\( \\sqrt{\\frac{N-n}{N-1}} \\) (ako je f > 0,05)</td></tr>' +
      '<tr><td>Interval AS</td><td>\\( \\bar{x} \\pm t \\cdot s_{\\bar{x}} \\); \\( s_{\\bar{x}} = s/\\sqrt{n} \\) (n > 30) ili \\( s/\\sqrt{n-1} \\) (n ≤ 30)</td></tr>' +
      '<tr><td>Interval totala</td><td>\\( N\\bar{x} \\pm t \\cdot N s_{\\bar{x}} \\)</td></tr>' +
      '<tr><td>Interval proporcije</td><td>\\( p \\pm t \\cdot s_p \\), \\( p = m/n \\), \\( s_p = \\sqrt{pq/n} \\) (n > 30)</td></tr>' +
      '<tr><td>Regresija</td><td>\\( Y_c = a + bx \\), \\( b = \\frac{\\sum xy - n\\bar{x}\\bar{y}}{\\sum x^2 - n\\bar{x}^2} \\), \\( a = \\bar{y} - b\\bar{x} \\)</td></tr>' +
      '<tr><td>Korelacija</td><td>\\( r = \\sqrt{b b^{\\prime}} \\), \\( r_s = 1 - \\frac{6\\sum d^2}{n^3 - n} \\), \\( r^2 \\) = koeficijent determinacije</td></tr>' +
      '<tr><td>Indeksi vremenskog niza</td><td>\\( V_t = \\frac{Y_t}{Y_{t-1}} \\cdot 100 \\), \\( I_t = \\frac{Y_t}{Y_b} \\cdot 100 \\), \\( s_t = V_t - 100 \\)</td></tr>' +
      '<tr><td>Linearni trend (ishodište u sredini)</td><td>\\( a = \\frac{\\sum Y}{N} \\), \\( b = \\frac{\\sum xY}{\\sum x^2} \\)</td></tr>' +
      '</table>' +

      '<h4>Brzi računski primjeri s ispita</h4>' +
      '<div class="example-box">' +
      '• xᵢ: 1, 1, 1, 2, 3, 4 → AS = 12/6 = 2 · xᵢ: 1, 2, 4, 5, 18 → AS = 6 · xᵢ: 2, 2, 4, 12 → AS = 5, Me = 3, Mo = 2<br>' +
      '• xᵢ: 2, 3, 3, 3, 4, 5, 6 → Mo = 3, Me = 3, Q1 = 3 (7/4 = 1,75 → položaj 2)<br>' +
      '• σ = 2, AS = 8 → V = 25 % · σ = 2 → μ₂ = 4 · μ₂ = 9 → σ² = 9<br>' +
      '• Q1 = 6, Q3 = 19, Me = 6 → \\( S_{kQ} = \\frac{6 + 19 - 12}{13} = 1 \\) · AS = 8, Mo = 2, σ = 2 → Sk1 = 3<br>' +
      '• verižni indeks uz pad od 10 % → 90 · r = 0,55 → srednje jaka pozitivna · r = −0,12 → slaba negativna<br>' +
      '• n = 35 ili 53, 95 % → t = 1,96 · 99 % i n > 30 → t = 2,58 · n = 22, 95 % → k = 21 → t = 2,080' +
      '</div>' +

      '<h4>Tvrdnje točno / netočno (iz ispitnih pitanja)</h4>' +
      '<ul>' +
      '<li>„Uzorak je skup svih elemenata koji nisu predmet istraživanja.” — <strong>netočno</strong> (uzorak je dio osnovnog skupa kojim se istražuje osnovni skup).</li>' +
      '<li>„Okvir uzorka je popis svih jedinica uzorka.” — <strong>netočno</strong> (popis svih jedinica populacije).</li>' +
      '<li>„Na temelju koeficijenta korelacije nije moguće zaključivati o uzročno-posljedičnom odnosu.” — <strong>točno</strong>.</li>' +
      '<li>„Nezavisna varijabla označava se simbolom Y.” — <strong>netočno</strong> (nezavisna X, zavisna Y).</li>' +
      '<li>„Višestruka regresija promatra utjecaj više nezavisnih varijabli na zavisnu.” — <strong>točno</strong>.</li>' +
      '<li>„Indeksni broj manji od 100 nije moguć.” — <strong>netočno</strong> (može biti veći, jednak ili manji od 100).</li>' +
      '<li>„Individualni indeksi prate razvoj samo jedne pojave.” — <strong>točno</strong>.</li>' +
      '<li>„Kod namjernih uzoraka moguće je brojčano izraziti pogrešku uzorka.” — <strong>netočno</strong>.</li>' +
      '</ul>' +
      '<div class="warning-box"><strong>Studentske bilješke s greškama — što vrijedi prema predavanjima:</strong> prosječna stopa promjene → <em>geometrijska</em> (ne harmonijska) sredina; koeficijent asimetrije <em>nije</em> mjera disperzije; α₃ uobičajeno ±2, Pearson ±3 (ne obrnuto); indeksi prema baznom razdoblju su <em>bazni</em> (ne verižni); r izvan intervala [−1, 1] ne postoji; parametar a je konstantni član; mod nije „N/2” niti najveća frekvencija; medijan nije „N kroz 2” nego vrijednost na tom položaju.</div>'
  }
};

const statisticsHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.statisticsHrM1) ? window.statisticsHrM1 : {},
    (typeof window !== 'undefined' && window.statisticsHrM2) ? window.statisticsHrM2 : {},
    { examPractice: statisticsHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.statisticsHrFinal = statisticsHrFinal; }
