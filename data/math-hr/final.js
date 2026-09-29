// Matematika (HR) — Final (završni ispit / ispitni rokovi)
// Temelj: EN math (isti FMTU kolegij) + usklađeno s HR demonstraturama i starim ispitima.
// Spaja HR M1 + M2 + examPractice. MORA se učitati POSLIJE midterm-1.js i midterm-2.js.
//
// examPractice = STVARNI ispitni zadaci s Drivea (2023/24): Završni ispit grupa B (7 zadataka, 30 bodova),
//   Projektni zadatak 1 Redovni Opatija (5 × 2 boda) i riješeni kolokvij iz studentske bilježnice
//   (domena, derivacija u točki, rast/pad, minimum prosječnih troškova, ekstremi).
//   Nijedan od tih zadataka nije ponovljen u kategorijama M1/M2.
// MODEL: kartice < 200 znakova, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
// ⚠ KVANTITATIVNI PREDMET — KaTeX: inline "\\( … \\)", blok "\\[ … \\]"; NIKAD jedan dolar.

const mathHrFinalExamPractice = {
  name: "Vježba za ispit (stvarni ispitni zadaci)",
  icon: "fa-graduation-cap",
  color: "#f59e0b",
  flashcards: [
    {
      question: "Kako je izgledao Projektni zadatak 1 (2023/24, Redovni Opatija)?",
      answer: "5 zadataka po 2 boda (10): derivacija u točki · intervali rasta i pada · prosječni i marginalni troškovi · lokalni ekstremi · intervali elastičnosti potražnje.",
      explanation: "Cijelo gradivo 1. kolokvija u pet tipičnih zadataka."
    },
    {
      question: "Kako je izgledao Završni ispit (2023/24, grupa B)?",
      answer: "7 zadataka, 30 bodova: zajam s otplatnom tablicom i kontrolom · elastičnost · renta · rast i pad · ukupni trošak iz marginalnog · relativni kamatnjak · lokalni ekstrem.",
      explanation: "Otprilike pola financijske matematike, pola derivacija i primjena."
    },
    {
      question: "ZI: Zajam 40 000 €, 3 godine, 7 % godišnjih dekurzivnih kamata, jednaki anuiteti krajem godine. Anuitet?",
      answer: "\\(a=40\\,000\\cdot\\frac{1{,}07^3\\cdot0{,}07}{1{,}07^3-1}\\approx15\\,242{,}07\\) €.",
      explanation: "Kamate: 2800,00 · 1929,06 · 997,14 €; ukupno 5726,20 €."
    },
    {
      question: "ZI: \\(q(p)=800-16p\\). Koeficijent elastičnosti pri \\(p_0=1\\) i tumačenje?",
      answer: "\\(q(1)=784\\), \\(E=\\frac{1}{784}\\cdot(-16)\\approx-0{,}0204\\). Neelastična: rast cijene 1 % smanjuje potražnju za oko 0,02 %.",
      explanation: "Jedinična elastičnost bila bi tek pri p = 25."
    },
    {
      question: "ZI: Uloženo 60 000 €. Koliki se jednaki iznosi mogu podizati krajem svake od 7 godina uz 5 %?",
      answer: "Postnumerando sadašnja vrijednost: \\(R=\\frac{60\\,000\\cdot1{,}05^7\\cdot0{,}05}{1{,}05^7-1}\\approx10\\,369{,}19\\) €.",
      explanation: "Složen, godišnji, dekurzivan obračun."
    },
    {
      question: "ZI: Intervali rasta i pada funkcije \\(f(x)=x^3-\\frac72x^2+2x+10\\)?",
      answer: "\\(f'=3x^2-7x+2=0\\Rightarrow x=\\frac13,\\ x=2\\). Raste na \\(\\langle-\\infty,\\frac13\\rangle\\cup\\langle2,+\\infty\\rangle\\), pada na \\(\\langle\\frac13,2\\rangle\\).",
      explanation: "Tablica: + | − | +."
    },
    {
      question: "ZI: Marginalni trošak \\(M(Q)=3Q^4+4Q^3+7Q\\). Koliki je ukupni trošak?",
      answer: "\\(T(Q)=\\int M(Q)\\,dQ=\\frac35Q^5+Q^4+\\frac72Q^2+C\\), C = fiksni troškovi.",
      explanation: "Provjera: (3/5·Q⁵)' = 3Q⁴ ✓"
    },
    {
      question: "ZI: 64 666 € na 5 godina, kvartalna stopa 4 %, polugodišnji složeni dekurzivni obračun, relativni kamatnjak. Konačna vrijednost?",
      answer: "Polugodišnji relativni kamatnjak 8 %, \\(n=10\\): \\(C_{10}=64\\,666\\cdot1{,}08^{10}\\approx139\\,609{,}04\\) €.",
      explanation: "Polugodište = 2 kvartala → 2 · 4 % = 8 %."
    },
    {
      question: "ZI: Lokalni ekstrem funkcije \\(f(x)=\\frac{x^2+2}{x}\\) — maksimum ili minimum?",
      answer: "\\(f'=1-\\frac{2}{x^2}=0\\Rightarrow x=\\pm\\sqrt2\\). Minimum \\((\\sqrt2,2\\sqrt2)\\), maksimum \\((-\\sqrt2,-2\\sqrt2)\\).",
      explanation: "f''(x) = 4/x³: pozitivna u √2, negativna u −√2."
    },
    {
      question: "Kolokvij: derivacija funkcije \\(f(x)=e^{x^3-4}\\ln(4x)\\) u točki \\(x=2\\)?",
      answer: "\\(f'(x)=3x^2e^{x^3-4}\\ln(4x)+\\frac{e^{x^3-4}}{x}\\); \\(f'(2)=e^4\\left(12\\ln8+\\frac12\\right)\\approx1389{,}70\\).",
      explanation: "Umnožak + lančano pravilo za oba faktora."
    },
    {
      question: "Kolokvij: domena funkcije \\(f(x)=\\ln\\frac{x-4}{x+2}\\)?",
      answer: "\\(\\frac{x-4}{x+2}>0\\) → tablica predznaka: \\(D_f=\\langle-\\infty,-2\\rangle\\cup\\langle4,+\\infty\\rangle\\).",
      explanation: "Isti kolokvij: (3x⁶ − 5x² − 17x³)/(−x + 7) ima D = ℝ \\ {7}."
    },
    {
      question: "Kolokvij: minimum prosječnih troškova za \\(T(Q)=5Q^3-90Q^2+540Q\\)?",
      answer: "\\(\\bar T=5Q^2-90Q+540\\), \\(\\bar T'=10Q-90=0\\Rightarrow Q=9\\); \\(\\bar T''=10>0\\). Minimum \\((9,135)\\).",
      explanation: "T̄(9) = 405 − 810 + 540 = 135."
    },
    {
      question: "Kolokvij: intervali rasta i pada funkcije \\(f(x)=x^3-6x^2+9x-1\\)?",
      answer: "\\(f'=3x^2-12x+9=3(x-1)(x-3)\\). Raste na \\(\\langle-\\infty,1\\rangle\\cup\\langle3,+\\infty\\rangle\\), pada na \\(\\langle1,3\\rangle\\).",
      explanation: "Maksimum (1, 3), minimum (3, −1)."
    },
    {
      question: "Kolokvij: ekstremi funkcije \\(f(x)=\\frac{x^2+1}{x}\\)?",
      answer: "\\(f'=\\frac{x^2-1}{x^2}=0\\Rightarrow x=\\pm1\\). Minimum \\((1,2)\\), maksimum \\((-1,-2)\\).",
      explanation: "U studentskom rješenju su zamijenjeni — provjeri drugom derivacijom f'' = 2/x³."
    }
  ],
  quiz: [
    {
      question: "Zajam od 40 000 € odobren je na 3 godine uz 7 % godišnjih dekurzivnih kamata i jednake anuitete krajem godine. Anuitet iznosi:",
      options: ["13 333,33 €", "15 242,07 €", "16 133,33 €", "14 280,00 €"],
      correct: 1
    },
    {
      question: "Zajam 40 000 €, 3 godine, 7 %, jednaki anuiteti: kamate u prvoj godini iznose:",
      options: ["933,33 €", "2800,00 €", "1066,94 €", "3066,00 €"],
      correct: 1
    },
    {
      question: "Zajam 40 000 €, 3 godine, 7 %, jednaki anuiteti: ostatak duga nakon prve godine iznosi približno:",
      options: ["26 666,67 €", "27 557,93 €", "24 757,93 €", "37 200,00 €"],
      correct: 1
    },
    {
      question: "Zajam 40 000 €, 3 godine, 7 %, jednaki anuiteti: ukupne kamate iznose približno:",
      options: ["8400,00 €", "5726,20 €", "4800,00 €", "2800,00 €"],
      correct: 1
    },
    {
      question: "Funkcija potražnje je \\(q(p)=800-16p\\). Koeficijent elastičnosti pri \\(p_0=1\\) iznosi približno:",
      options: ["\\(-16\\)", "\\(-0{,}0204\\)", "\\(-49\\)", "\\(-0{,}02\\cdot800\\)"],
      correct: 1
    },
    {
      question: "Za potražnju \\(q(p)=800-16p\\) jedinična elastičnost postiže se pri cijeni:",
      options: ["\\(p=50\\)", "\\(p=25\\)", "\\(p=16\\)", "\\(p=1\\)"],
      correct: 1
    },
    {
      question: "Osoba danas uloži 60 000 €. Uz 5 % godišnje (složeno, dekurzivno) koliki se jednaki iznosi mogu podizati krajem svake od idućih 7 godina?",
      options: ["≈ 8571,43 €", "≈ 10 369,19 €", "≈ 9875,42 €", "≈ 12 000,00 €"],
      correct: 1
    },
    {
      question: "Stacionarne točke funkcije \\(f(x)=x^3-\\frac72x^2+2x+10\\) su:",
      options: ["\\(x=\\frac13\\) i \\(x=2\\)", "\\(x=-\\frac13\\) i \\(x=-2\\)", "\\(x=1\\) i \\(x=\\frac23\\)", "\\(x=\\frac72\\)"],
      correct: 0
    },
    {
      question: "Marginalni trošak je \\(M(Q)=3Q^4+4Q^3+7Q\\). Ukupni trošak je:",
      options: ["\\(12Q^3+12Q^2+7\\)", "\\(\\frac35Q^5+Q^4+\\frac72Q^2+C\\)", "\\(3Q^5+4Q^4+7Q^2+C\\)", "\\(\\frac35Q^5+Q^4+7Q+C\\)"],
      correct: 1
    },
    {
      question: "Glavnica od 64 666 € ukamaćuje se 5 godina; kvartalna kamatna stopa je 4 %, obračun je složen, dekurzivan i polugodišnji (relativni kamatnjak). Konačna vrijednost je približno:",
      options: ["≈ 78 676,08 €", "≈ 139 609,04 €", "≈ 95 015,57 €", "≈ 141 691,17 €"],
      correct: 1
    },
    {
      question: "Kvartalna kamatna stopa je 4 %, a obračun je polugodišnji. Relativni polugodišnji kamatnjak je:",
      options: ["2 %", "8 %", "16 %", "4 %"],
      correct: 1
    },
    {
      question: "Lokalni minimum funkcije \\(f(x)=\\frac{x^2+2}{x}\\) je u točki:",
      options: ["\\((\\sqrt2,2\\sqrt2)\\)", "\\((-\\sqrt2,-2\\sqrt2)\\)", "\\((2,3)\\)", "\\((1,3)\\)"],
      correct: 0
    },
    {
      question: "Za \\(f(x)=e^{x^3-4}\\ln(4x)\\) vrijednost \\(f'(2)\\) iznosi približno:",
      options: ["\\(113{,}53\\)", "\\(1389{,}70\\)", "\\(27{,}30\\)", "\\(681{,}37\\)"],
      correct: 1
    },
    {
      question: "Domena funkcije \\(f(x)=\\frac{3x^6-5x^2-17x^3}{-x+7}\\) je:",
      options: ["\\(\\mathbb{R}\\)", "\\(\\mathbb{R}\\setminus\\{7\\}\\)", "\\(\\mathbb{R}\\setminus\\{-7\\}\\)", "\\(\\langle7,+\\infty\\rangle\\)"],
      correct: 1
    },
    {
      question: "Minimum prosječnih troškova za \\(T(Q)=5Q^3-90Q^2+540Q\\) je u točki:",
      options: ["\\((9,135)\\)", "\\((6,180)\\)", "\\((9,1215)\\)", "\\((18,540)\\)"],
      correct: 0
    },
    {
      question: "Funkcija \\(f(x)=x^3-6x^2+9x-1\\) pada na intervalu:",
      options: ["\\(\\langle1,3\\rangle\\)", "\\(\\langle-\\infty,1\\rangle\\)", "\\(\\langle3,+\\infty\\rangle\\)", "\\(\\langle-3,-1\\rangle\\)"],
      correct: 0
    }
  ],
  fillBlanks: [
    { sentence: "Za zajam od 40 000 € na 3 godine uz 7 % kamate u prvoj godini iznose _______ €.", answer: "2800", hint: "40 000 · 7/100" },
    { sentence: "Za potražnju q = 800 − 16p pri cijeni p₀ = 1 potražnja iznosi q = _______.", answer: "784", hint: "800 − 16" },
    { sentence: "Potražnja q = 800 − 16p pri p₀ = 1 je _______ jer je |E| < 1.", answer: "neelastična", hint: "|E| ≈ 0,02" },
    { sentence: "Kvartalna stopa 4 % uz polugodišnji obračun daje relativni polugodišnji kamatnjak od _______ %.", answer: "8", hint: "Polugodište = 2 kvartala" },
    { sentence: "Glavnica se 5 godina ukamaćuje polugodišnje, pa je broj obračunskih razdoblja n = _______.", answer: "10", hint: "5 · 2" },
    { sentence: "Funkcija f(x) = x³ − 6x² + 9x − 1 ima lokalni minimum u x = _______.", answer: "3", hint: "f' mijenja predznak iz − u +" },
    { sentence: "Minimum prosječnih troškova za T(Q) = 5Q³ − 90Q² + 540Q postiže se pri Q = _______.", answer: "9", hint: "10Q − 90 = 0" },
    { sentence: "Za f(x) = (x² + 1)/x točka (1, 2) je lokalni _______.", answer: "minimum", hint: "f''(1) = 2 > 0" },
    { sentence: "Funkcija ln((x − 4)/(x + 2)) definirana je za x < −2 ili x > _______.", answer: "4", hint: "Nultočka brojnika" },
    { sentence: "Funkcija x³ − 7/2·x² + 2x + 10 pada na intervalu ⟨1/3, _______⟩.", answer: "2", hint: "3x² − 7x + 2 = 0" }
  ],
  learn: {
    title: "Vježba za ispit — stvarni ispitni zadaci s rješenjima",
    content:
      '<h3>Kako izgledaju provjere</h3>' +
      '<p>Pregledani materijali (akademska godina 2023/24, prikupljeni od studenata) pokazuju tri vrste provjera. Pravila za tekuću godinu provjeri na Merlinu — ovo je slika prošle generacije.</p>' +
      '<table><thead><tr><th>Provjera</th><th>Oblik</th><th>Teme</th></tr></thead><tbody>' +
      '<tr><td>Projektni zadatak 1</td><td>5 zadataka × 2 boda = 10</td><td>derivacija u točki · rast i pad · prosječni i marginalni troškovi · lokalni ekstremi · intervali elastičnosti</td></tr>' +
      '<tr><td>2. kolokvij</td><td>uz službeni popis formula</td><td>kamatni račun · rente · zajam (jednaki anuiteti i jednake otplatne kvote)</td></tr>' +
      '<tr><td>Završni ispit</td><td>7 zadataka, 30 bodova</td><td>zajam + tablica + kontrola · elastičnost · renta · rast/pad · integral · relativni kamatnjak · ekstrem</td></tr>' +
      '</tbody></table>' +

      '<h3>Završni ispit 2023/24, grupa B — sva rješenja</h3>' +
      '<div class="example-box"><strong>1. (6 bodova)</strong> Zajam od 40 000 € na 3 godine uz 7 % godišnjih dekurzivnih kamata, nominalno jednaki anuiteti krajem godine. a) otplatna tablica, b) kontrola tablice.' +
      '<br>\\(r=1{,}07\\), \\(r^3=1{,}225043\\); \\(a=40\\,000\\cdot\\frac{1{,}225043\\cdot0{,}07}{0{,}225043}\\approx15\\,242{,}07\\) €' +
      '<table><thead><tr><th>k</th><th>anuitet</th><th>kamate</th><th>otplatna kvota</th><th>ostatak duga</th></tr></thead><tbody>' +
      '<tr><td>0</td><td></td><td></td><td></td><td>40 000,00</td></tr>' +
      '<tr><td>1</td><td>15 242,07</td><td>2800,00</td><td>12 442,07</td><td>27 557,93</td></tr>' +
      '<tr><td>2</td><td>15 242,07</td><td>1929,06</td><td>13 313,01</td><td>14 244,92</td></tr>' +
      '<tr><td>3</td><td>15 242,06</td><td>997,14</td><td>14 244,92</td><td>0,00</td></tr>' +
      '<tr><td>Σ</td><td>45 726,20</td><td>5726,20</td><td>40 000,00</td><td></td></tr>' +
      '</tbody></table>' +
      'Kontrole: a) zadnja kvota = ostatak duga nakon 2. godine (14 244,92) ✓; b) zbroj kvota = 40 000,00 ✓; c) 40 000,00 + 5726,20 = 45 726,20 ✓. Zadnji anuitet je za cent manji jer se kvota izjednačava s preostalim dugom.</div>' +
      '<div class="example-box"><strong>2. (5 bodova)</strong> \\(q(p)=800-16p\\), koeficijent elastičnosti pri \\(p_0=1\\) i tumačenje.' +
      '<br>\\(q(1)=784\\), \\(\\frac{dq}{dp}=-16\\)' +
      '<br>\\(E=\\frac{1}{784}\\cdot(-16)\\approx-0{,}0204\\)' +
      '<br>\\(|E|<1\\) → potražnja je <strong>neelastična</strong>: ako cijena poraste za 1 %, potražnja se smanji za približno 0,02 %. (Jedinična elastičnost bila bi pri \\(p=\\frac{800}{32}=25\\).)</div>' +
      '<div class="example-box"><strong>3. (4 boda)</strong> Danas se uloži 60 000 €. Koliki su jednaki iznosi koji se mogu podizati krajem godine idućih 7 godina uz 5 % (složeno, godišnje, dekurzivno)?' +
      '<br>„Danas uložiti” + „krajem godine” → sadašnja vrijednost postnumerando rente, traži se R:' +
      '<br>\\(R=\\frac{A_n\\,r^n(r-1)}{r^n-1}=\\frac{60\\,000\\cdot1{,}05^7\\cdot0{,}05}{1{,}05^7-1}\\approx10\\,369{,}19\\) €</div>' +
      '<div class="example-box"><strong>4. (3 boda)</strong> Intervali rasta i pada \\(f(x)=x^3-\\frac72x^2+2x+10\\).' +
      '<br>\\(D_f=\\mathbb{R}\\); \\(f\'(x)=3x^2-7x+2=0\\Rightarrow x_{1,2}=\\frac{7\\pm5}{6}\\Rightarrow x_1=\\frac13,\\ x_2=2\\)' +
      '<br>Probne točke: \\(f\'(0)=2>0\\), \\(f\'(1)=-2<0\\), \\(f\'(3)=8>0\\)' +
      '<br>Raste na \\(\\langle-\\infty,\\frac13\\rangle\\cup\\langle2,+\\infty\\rangle\\), pada na \\(\\langle\\frac13,2\\rangle\\).</div>' +
      '<div class="example-box"><strong>5. (5 bodova)</strong> \\(M(Q)=3Q^4+4Q^3+7Q\\). Koliki je ukupni trošak?' +
      '<br>\\(T(Q)=\\int(3Q^4+4Q^3+7Q)\\,dQ=\\frac{3Q^5}{5}+\\frac{4Q^4}{4}+\\frac{7Q^2}{2}+C=\\frac35Q^5+Q^4+\\frac72Q^2+C\\)' +
      '<br>C su fiksni troškovi (nisu zadani, pa ostaje C).</div>' +
      '<div class="example-box"><strong>6. (3 boda)</strong> 64 666 € nakon 5 godina; kvartalna kamatna stopa 4 %, obračun složen, dekurzivan i polugodišnji; primjenom relativnog kamatnjaka.' +
      '<br>Stopa je zadana po kvartalu, a obračun je po polugodištu (= 2 kvartala) → relativni polugodišnji kamatnjak \\(p_r=2\\cdot4\\,\\%=8\\,\\%\\).' +
      '<br>\\(n=5\\cdot2=10\\) polugodišta; \\(C_{10}=64\\,666\\cdot1{,}08^{10}\\approx139\\,609{,}04\\) €</div>' +
      '<div class="example-box"><strong>7. (4 boda)</strong> Lokalni ekstrem funkcije \\(f(x)=\\frac{x^2+2}{x}\\) — maksimum ili minimum?' +
      '<br>\\(D_f=\\mathbb{R}\\setminus\\{0\\}\\); \\(f(x)=x+\\frac2x\\Rightarrow f\'(x)=1-\\frac{2}{x^2}=0\\Rightarrow x=\\pm\\sqrt2\\)' +
      '<br>\\(f\'\'(x)=\\frac{4}{x^3}\\): \\(f\'\'(\\sqrt2)>0\\) → <strong>minimum</strong> \\((\\sqrt2,\\ 2\\sqrt2)\\); \\(f\'\'(-\\sqrt2)<0\\) → <strong>maksimum</strong> \\((-\\sqrt2,\\ -2\\sqrt2)\\).</div>' +

      '<h3>Riješeni kolokvij (studentska bilježnica) — zadaci 1. kolokvija</h3>' +
      '<div class="example-box"><strong>Domena.</strong> \\(f(x)=\\frac{3x^6-5x^2-17x^3}{-x+7}\\): \\(-x+7\\neq0\\Rightarrow D_f=\\mathbb{R}\\setminus\\{7\\}\\).' +
      '<br>\\(f(x)=\\ln\\frac{x-4}{x+2}\\): uvjet \\(\\frac{x-4}{x+2}>0\\); nultočke 4 i −2; tablica predznaka + | − | + → \\(D_f=\\langle-\\infty,-2\\rangle\\cup\\langle4,+\\infty\\rangle\\).</div>' +
      '<div class="example-box"><strong>Derivacija u točki.</strong> \\(f(x)=e^{x^3-4}\\ln(4x)\\), \\(x=2\\).' +
      '<br>\\(f\'(x)=e^{x^3-4}\\cdot3x^2\\cdot\\ln(4x)+e^{x^3-4}\\cdot\\frac{1}{4x}\\cdot4\\)' +
      '<br>\\(f\'(2)=e^{4}\\cdot12\\ln8+e^{4}\\cdot\\frac12=e^4\\left(12\\ln8+\\frac12\\right)\\approx1389{,}70\\)</div>' +
      '<div class="example-box"><strong>Rast i pad.</strong> \\(f(x)=x^3-6x^2+9x-1\\): \\(f\'=3x^2-12x+9=0\\ |:3\\Rightarrow x^2-4x+3=0\\Rightarrow x_1=3,\\ x_2=1\\).' +
      '<br>Tablica + | − | + → raste na \\(\\langle-\\infty,1\\rangle\\cup\\langle3,+\\infty\\rangle\\), pada na \\(\\langle1,3\\rangle\\).</div>' +
      '<div class="example-box"><strong>Minimum prosječnih troškova.</strong> \\(T(Q)=5Q^3-90Q^2+540Q\\).' +
      '<br>\\(\\bar T(Q)=5Q^2-90Q+540\\), \\(\\bar T\'(Q)=10Q-90=0\\Rightarrow Q=9\\), \\(\\bar T\'\'=10>0\\)' +
      '<br>\\(\\bar T(9)=405-810+540=135\\) → minimum u točki \\((9,135)\\).</div>' +
      '<div class="example-box"><strong>Ekstremi.</strong> \\(f(x)=\\frac{x^2+1}{x}\\): \\(f\'(x)=\\frac{2x\\cdot x-(x^2+1)}{x^2}=\\frac{x^2-1}{x^2}=0\\Rightarrow x=\\pm1\\) (\\(x\\neq0\\)).' +
      '<br>Tablica: \\(\\langle-\\infty,-1\\rangle\\) +, \\(\\langle-1,0\\rangle\\) −, \\(\\langle0,1\\rangle\\) −, \\(\\langle1,+\\infty\\rangle\\) +.' +
      '<br>Maksimum \\((-1,-2)\\), minimum \\((1,2)\\).</div>' +

      '<div class="warning-box"><strong>Greške u kružećim studentskim materijalima — što je točno:</strong> kod \\(\\frac{x^2+1}{x}\\) bilješka zamjenjuje minimum i maksimum (točno: \\((1,2)\\) minimum, \\((-1,-2)\\) maksimum) · \\(x^2-2x+5=0\\) ima rješenja \\(1\\pm2i\\) (ne \\(\\pm4i\\) ni \\(1\\pm\\sqrt6\\)) · kod rasta/pada marginalnih troškova gleda se predznak \\(M\'(Q)\\), a ne nultočke \\(M(Q)\\) · domena \\(e^{\\frac{3x^2-1}{x}}\\) je \\(\\mathbb{R}\\setminus\\{0\\}\\), ne ℝ · primjer elastičnosti s \\(q(p)=-2p^2+12\\) pri \\(p_0=4\\) daje negativnu potražnju (−20) i nije ekonomski smislen.</div>' +
      '<div class="tip-box"><strong>Strategija za ispit:</strong> financijska matematika nosi oko pola bodova i najviše je „mehanička” — nauči prepoznati formulu iz teksta i nosi dovoljno decimala. Kod zadataka s derivacijama piši sve korake (domena → stacionarne točke → tablica ili druga derivacija → koordinate), jer se boduje postupak.</div>'
  }
};

const mathHrFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.mathHrM1) ? window.mathHrM1
    : (typeof mathHrM1 !== 'undefined' ? mathHrM1 : {}),
  (typeof window !== 'undefined' && window.mathHrM2) ? window.mathHrM2
    : (typeof mathHrM2 !== 'undefined' ? mathHrM2 : {}),
  { examPractice: mathHrFinalExamPractice }
);

if (typeof window !== 'undefined') { window.mathHrFinal = mathHrFinal; }
if (typeof module !== 'undefined' && module.exports) { module.exports = mathHrFinal; }
