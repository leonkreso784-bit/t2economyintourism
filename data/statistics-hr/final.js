// Statistika (HR) — Final (završni ispit)
// Spaja HR M1 + M2 + examPractice. Autorski iz HR materijala; kartice <=200, detalj u learn.
// MORA se učitati POSLIJE midterm-1/2. ⚠️ NE pokretati translate-subject.js!

const statisticsHrFinalExamPractice = {
  "id": "4gy5z1",
  "name": "Ispitna pitanja (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#6366f1",
  "flashcards": [
    {
      "question": "MEĐUTEMA: kojim redom ide statistička analiza?",
      "answer": "Populacija → uzorak → opis (srednje vrijednosti + disperzija + oblik) → povezanost (korelacija) → model (regresija) → dinamika (indeksi, vremenski nizovi).",
      "explanation": "Okosnica cijelog kolegija."
    },
    {
      "question": "PONAVLJANJE: koje su tri skupine mjera u deskriptivnoj statistici?",
      "answer": "Srednje vrijednosti (gdje je centar), mjere disperzije (koliko su podaci raspršeni) i mjere oblika (asimetrija i zaobljenost).",
      "explanation": "Sve tri zajedno opisuju niz."
    },
    {
      "question": "PRIPREMA: koje brojčane granice se traže na ispitu?",
      "answer": "Koeficijent korelacije −1 do +1 · Pearsonova asimetrija −3 do +3 · zaobljenost 1,8 = pravokutna (3 = normalna) · indeks: bazno razdoblje = 100.",
      "explanation": "Najčešće brojke na kolokviju."
    },
    {
      "question": "MEĐUTEMA: zašto korelacija nije uzročnost, a regresija ipak modelira?",
      "answer": "Korelacija samo mjeri jakost veze. Regresija pretpostavlja SMJER (X→Y) na temelju teorije, ne podataka — pa ni ona sama ne dokazuje uzročnost.",
      "explanation": "Smjer dolazi iz struke, ne iz brojeva."
    },
    {
      "question": "PONAVLJANJE: intervalni ili trenutačni niz?",
      "answer": "Intervalni = pojava TIJEKOM razdoblja (smije se zbrajati). Trenutačni = stanje U TRENUTKU (ne zbraja se, traži kritični trenutak).",
      "explanation": "Klasična ispitna zamka."
    },
    {
      "question": "PRIPREMA: koje su najčešće zamke o uzorcima?",
      "answer": "Okvir popisuje POPULACIJU (ne uzorak) · s ponavljanjem se populacija NE smanjuje · podskupine = STRATIFICIRANI (ne sistemski) · kod namjernih uzoraka pogreška se ne da izraziti.",
      "explanation": "Sve četiri dolaze kao točno/netočno."
    },
    {
      "question": "MEĐUTEMA: kada koristiti koeficijent varijacije?",
      "answer": "Kad uspoređujemo raspršenost nizova različitih mjernih jedinica ili reda veličine — jedina je relativna (postotna) mjera disperzije.",
      "explanation": "Apsolutne mjere to ne mogu."
    },
    {
      "question": "PRIPREMA: koje su tri „nemoguće\" tvrdnje koje su zapravo moguće?",
      "answer": "Indeks manji od 100 JEST moguć (pad) · konstantni član NEMA uvijek smisleno značenje · kroz oblak točaka ide SAMO jedan regresijski pravac.",
      "explanation": "Sve tri se pojavljuju kao zamke."
    }
  ],
  "quiz": [
    {
      "id": "0pvvbj",
      "question": "Najčešća vrijednost u nizu je:",
      "options": [
        "medijan",
        "mod",
        "sredina",
        "kvartil"
      ],
      "correct": 1
    },
    {
      "id": "a137ac",
      "question": "Razlika gornjeg i donjeg kvartila je:",
      "options": [
        "raspon",
        "interkvartil",
        "varijanca",
        "devijacija"
      ],
      "correct": 1
    },
    {
      "id": "20ksy5",
      "question": "Koeficijent korelacije kreće se od:",
      "options": [
        "0 do 1",
        "−1 do +1",
        "−3 do +3",
        "0 do 100"
      ],
      "correct": 1
    },
    {
      "id": "fzrw9r",
      "question": "Pearsonova mjera asimetrije poprima vrijednosti:",
      "options": [
        "−1 do +1",
        "−3 do +3",
        "0 do 3",
        "0 do 100"
      ],
      "correct": 1
    },
    {
      "id": "odpixq",
      "question": "Koeficijent zaobljenosti 1,8 znači distribuciju:",
      "options": [
        "normalnu",
        "pravokutnog oblika",
        "šiljatu",
        "asimetričnu"
      ],
      "correct": 1
    },
    {
      "id": "xr2py1",
      "question": "Okvir uzorka popisuje jedinice:",
      "options": [
        "uzorka",
        "populacije",
        "razreda",
        "stratuma"
      ],
      "correct": 1
    },
    {
      "id": "mtsxup",
      "question": "Nezavisna varijabla označava se s:",
      "options": [
        "Y",
        "X",
        "r",
        "R²"
      ],
      "correct": 1
    },
    {
      "id": "e8rwdp",
      "question": "Indeksni broj manji od 100:",
      "options": [
        "nije moguć",
        "moguć je i znači pad",
        "znači rast",
        "znači grešku"
      ],
      "correct": 1
    },
    {
      "id": "cckfjs",
      "question": "Kritični trenutak veže se uz niz:",
      "options": [
        "intervalni",
        "trenutačni",
        "bazni",
        "verižni"
      ],
      "correct": 1
    },
    {
      "id": "ing9tm",
      "question": "Iz korelacije o uzročnosti:",
      "options": [
        "smijemo zaključivati",
        "ne smijemo zaključivati",
        "zaključujemo ako je r > 0,8",
        "uvijek zaključujemo"
      ],
      "correct": 1
    }
  ],
  "fillBlanks": [
    {
      "id": "67b80q",
      "sentence": "_______ dijeli uređeni niz na dva jednaka dijela.",
      "answer": "Medijan",
      "hint": "sredina po položaju"
    },
    {
      "id": "yfpjzo",
      "sentence": "Koeficijent _______ je omjer standardne devijacije i sredine.",
      "answer": "varijacije",
      "hint": "relativna mjera"
    },
    {
      "id": "npjwcl",
      "sentence": "Okvir uzorka popisuje sve jedinice _______.",
      "answer": "populacije",
      "hint": "ne uzorka"
    },
    {
      "id": "of17p3",
      "sentence": "Zavisna varijabla označava se slovom _______.",
      "answer": "Y",
      "hint": "ishod"
    },
    {
      "id": "at5fag",
      "sentence": "Bazno razdoblje ima indeks _______.",
      "answer": "100",
      "hint": "broj"
    },
    {
      "id": "f53ti7",
      "sentence": "Kritični trenutak definira se kod _______ niza.",
      "answer": "trenutačnog",
      "hint": "stanje u trenutku"
    }
  ],
  "learn": {
    "id": "j3mlnf",
    "title": "Ispitna priprema — most kroz obje cjeline",
    "content": "\n                <h3>Kako je ispit posložen</h3>\n                <p>Završni objedinjuje <strong>1. kolokvij</strong> (osnovni pojmovi, srednje vrijednosti, mjere disperzije, momenti/asimetrija/zaobljenost) i <strong>2. kolokvij</strong> (uzorci, korelacija, regresija, indeksni brojevi, vremenski nizovi).</p>\n\n                <h4>Okosnica</h4>\n                <div class=\"formula-box\">\n                    POPULACIJA → UZORAK → OPIS (centar + disperzija + oblik) →<br>\n                    POVEZANOST (korelacija) → MODEL (regresija) → DINAMIKA (indeksi, vremenski nizovi)\n                </div>\n\n                <h4>Brojke koje se traže</h4>\n                <div class=\"formula-box\">\n                    korelacija: −1 … +1 &nbsp;|&nbsp; Pearsonova asimetrija: −3 … +3<br>\n                    zaobljenost: 1,8 = pravokutna · 3 = normalna &nbsp;|&nbsp; indeks: baza = 100\n                </div>\n\n                <h4>Najčešće zamke</h4>\n                <ul>\n                    <li><strong>Okvir uzorka</strong> popisuje POPULACIJU, ne uzorak.</li>\n                    <li><strong>S ponavljanjem</strong> se populacija NE smanjuje (n = konstanta).</li>\n                    <li><strong>Podjela na podskupine</strong> = stratificirani uzorak, NE sistemski.</li>\n                    <li><strong>Korelacija ≠ uzročnost</strong> — smjer dolazi iz teorije, ne iz brojeva.</li>\n                    <li><strong>Pearson</strong> traži intervalnu/omjernu ljestvicu; za ordinalnu ide Spearman.</li>\n                    <li><strong>Istraživač manipulira NEZAVISNOM</strong> (X), ne zavisnom (Y).</li>\n                    <li><strong>Indeks &lt; 100</strong> je moguć i znači pad.</li>\n                    <li><strong>Konstantni član</strong> nema uvijek smisleno značenje.</li>\n                    <li><strong>Kritični trenutak</strong> ide uz TRENUTAČNI niz, ne intervalni.</li>\n                </ul>\n                <p>Detaljna razrada svake teme nalazi se u sekcijama <em>Uči</em> pojedinih kategorija.</p>\n            "
  }
};

const statisticsHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.statisticsHrM1) ? window.statisticsHrM1 : {},
    (typeof window !== 'undefined' && window.statisticsHrM2) ? window.statisticsHrM2 : {},
    { examPractice: statisticsHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.statisticsHrFinal = statisticsHrFinal; }
