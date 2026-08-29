// Statistika (HR) — M1 (1. kolokvij)
// Autorski sadržaj iz HR materijala (Statistika, FMTU). Model: kartice <=200, detalj u learn.
// KaTeX: \( \) / \[ \] delimiteri — NIKAD goli dolar-znak (ADR-009).
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom (ručno autorski usklađeno).

const statisticsHrM1 = {
  "basics": {
    "name": "Osnovni pojmovi statistike",
    "icon": "fa-chart-simple",
    "color": "#6366f1",
    "flashcards": [
      {
        "question": "Što je populacija (osnovni skup), a što uzorak?",
        "answer": "Populacija je skup SVIH jedinica koje su predmet istraživanja. Uzorak je njezin DIO — podskup jedinica pomoću kojega se istražuje osnovni skup.",
        "explanation": "Uzorak nikad nije skup jedinica izvan istraživanja."
      },
      {
        "question": "Što je okvir uzorka?",
        "answer": "Lista na kojoj su popisane sve jedinice POPULACIJE (ne uzorka) — iz nje se bira uzorak.",
        "explanation": "Česta ispitna zamka: okvir popisuje populaciju."
      },
      {
        "question": "Što je statističko obilježje i kako se dijeli?",
        "answer": "Svojstvo po kojem se jedinice razlikuju. Dijeli se na kvalitativna (atributivna, geografska) i kvantitativna (numerička).",
        "explanation": "Numerička mogu biti diskretna ili kontinuirana."
      },
      {
        "question": "Koje mjerne ljestvice postoje?",
        "answer": "Nominalna (imena), ordinalna (rang), intervalna (razmaci, bez prave nule) i omjerna (prava nula).",
        "explanation": "Ljestvica određuje koje mjere smijemo računati."
      },
      {
        "question": "Što je statistički niz?",
        "answer": "Uređeni skup podataka o jedinicama promatranja. Numerički niz može biti negrupiran ili grupiran (u razrede).",
        "explanation": "Za grupirani niz računamo iz razrednih sredina."
      },
      {
        "question": "Što je distribucija frekvencija?",
        "answer": "Raspored podataka po vrijednostima ili razredima s pripadajućim frekvencijama (apsolutnim ili relativnim).",
        "explanation": "Prikazuje se histogramom ili poligonom."
      }
    ],
    "quiz": [
      {
        "question": "Uzorak je:",
        "options": [
          "skup svih elemenata koji nisu predmet istraživanja",
          "dio (podskup) osnovnog skupa",
          "isto što i populacija",
          "lista svih jedinica"
        ],
        "correct": 1,
        "id": "inorvx"
      },
      {
        "question": "Okvir uzorka je lista svih jedinica:",
        "options": [
          "uzorka",
          "populacije",
          "razreda",
          "obilježja"
        ],
        "correct": 1,
        "id": "47rpje"
      },
      {
        "question": "Ljestvica koja ima pravu nulu je:",
        "options": [
          "nominalna",
          "ordinalna",
          "intervalna",
          "omjerna"
        ],
        "correct": 3,
        "id": "7z4a7s"
      },
      {
        "question": "Rang-poredak (npr. 1., 2., 3. mjesto) mjeri se ljestvicom:",
        "options": [
          "nominalnom",
          "ordinalnom",
          "intervalnom",
          "omjernom"
        ],
        "correct": 1,
        "id": "72su2f"
      },
      {
        "question": "Grupirani numerički niz podatke prikazuje po:",
        "options": [
          "pojedinačnim vrijednostima",
          "razredima",
          "imenima",
          "rangovima"
        ],
        "correct": 1,
        "id": "am6iw9"
      },
      {
        "question": "Broj djece u obitelji je obilježje:",
        "options": [
          "kvalitativno",
          "numeričko diskretno",
          "numeričko kontinuirano",
          "geografsko"
        ],
        "correct": 1,
        "id": "avzs12"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "_______ je dio osnovnog skupa pomoću kojeg se istražuje populacija.",
        "answer": "Uzorak",
        "hint": "podskup",
        "id": "eoeego"
      },
      {
        "sentence": "Okvir uzorka popisuje sve jedinice _______.",
        "answer": "populacije",
        "hint": "ne uzorka",
        "id": "vra0bd"
      },
      {
        "sentence": "_______ ljestvica ima pravu nulu i dopušta sve računske operacije.",
        "answer": "Omjerna",
        "hint": "najjača ljestvica",
        "id": "der4f7"
      },
      {
        "sentence": "Grupirani niz razvrstava podatke u _______.",
        "answer": "razrede",
        "hint": "intervali vrijednosti",
        "id": "htcam7"
      },
      {
        "sentence": "Raspored podataka s pripadajućim frekvencijama je _______ frekvencija.",
        "answer": "distribucija",
        "hint": "raspored",
        "id": "in9mqn"
      }
    ],
    "learn": {
      "title": "Osnovni pojmovi statistike",
      "content": "\n                <h3>Populacija i uzorak</h3>\n                <p><strong>Populacija (osnovni skup)</strong> je skup <em>svih</em> jedinica koje su predmet istraživanja. <strong>Uzorak</strong> je njezin <strong>dio</strong> — podskup jedinica pomoću kojega se istražuje osnovni skup.</p>\n                <p><strong>Okvir uzorka</strong> je lista na kojoj su popisane sve jedinice <strong>populacije</strong> (ne uzorka) — iz nje se bira uzorak.</p>\n\n                <h4>Obilježja i ljestvice</h4>\n                <p><strong>Statističko obilježje</strong> je svojstvo po kojem se jedinice razlikuju:</p>\n                <ul>\n                    <li><strong>Kvalitativna</strong> — atributivna (spol, boja) i geografska (mjesto).</li>\n                    <li><strong>Kvantitativna (numerička)</strong> — diskretna (broj djece) i kontinuirana (visina, težina).</li>\n                </ul>\n                <div class=\"formula-box\">\n                    NOMINALNA — samo imena/kategorije (bez redoslijeda)<br>\n                    ORDINALNA — rang, redoslijed (bez jednakih razmaka)<br>\n                    INTERVALNA — jednaki razmaci, ALI bez prave nule<br>\n                    OMJERNA — prava nula → dopušta sve operacije\n                </div>\n\n                <h4>Statistički nizovi i distribucija</h4>\n                <p><strong>Statistički niz</strong> je uređeni skup podataka. Numerički niz može biti <strong>negrupiran</strong> (pojedinačne vrijednosti) ili <strong>grupiran</strong> (razvrstan u razrede).</p>\n                <p><strong>Distribucija frekvencija</strong> prikazuje raspored podataka po vrijednostima ili razredima s pripadajućim frekvencijama — apsolutnim (\\( f_i \\)) ili relativnim. Grafički: histogram, poligon frekvencija, kumulanta.</p>\n            ",
      "id": "r073xm"
    },
    "id": "xoxw39"
  },
  "averages": {
    "name": "Srednje vrijednosti",
    "icon": "fa-equals",
    "color": "#14b8a6",
    "flashcards": [
      {
        "question": "Kako se dijele srednje vrijednosti?",
        "answer": "Na POTPUNE (računaju se iz svih podataka: aritmetička, geometrijska, harmonijska sredina) i POLOŽAJNE (određene položajem: mod, medijan, kvartili).",
        "explanation": "Klasično ispitno pitanje."
      },
      {
        "question": "Što je aritmetička sredina?",
        "answer": "Prosječna srednja vrijednost — zbroj svih vrijednosti podijeljen njihovim brojem: \\( \\bar{x} = \\frac{\\sum x_i}{N} \\).",
        "explanation": "Za grupirani niz: \\( \\bar{x} = \\frac{\\sum x_i f_i}{\\sum f_i} \\)."
      },
      {
        "question": "Što je mod?",
        "answer": "Najčešća vrijednost u nizu — vrijednost s najvećom frekvencijom. Položajna je srednja vrijednost.",
        "explanation": "Npr. ako je najčešća ocjena 3, mod je 3."
      },
      {
        "question": "Što je medijan?",
        "answer": "Srednja vrijednost koja niz uređen po veličini dijeli na DVA jednaka dijela. Ako je broj podataka neparan, medijan je središnji član.",
        "explanation": "Za parni broj: prosjek dvaju središnjih članova."
      },
      {
        "question": "Što su kvartili?",
        "answer": "Vrijednosti koje uređeni niz dijele na četiri jednaka dijela: Q1 (donji), Q2 (= medijan) i Q3 (gornji kvartil).",
        "explanation": "25%, 50% i 75% podataka."
      },
      {
        "question": "Kad se koristi geometrijska, a kad harmonijska sredina?",
        "answer": "Geometrijska za prosječne stope rasta i relativne promjene; harmonijska kad su podaci izraženi kao omjeri (npr. brzine, cijene po jedinici).",
        "explanation": "Obje su potpune srednje vrijednosti."
      }
    ],
    "quiz": [
      {
        "question": "Najčešća vrijednost u nizu naziva se:",
        "options": [
          "medijan",
          "mod",
          "aritmetička sredina",
          "kvartil"
        ],
        "correct": 1,
        "id": "3a8yw0"
      },
      {
        "question": "Srednja vrijednost koja niz dijeli na dva jednaka dijela je:",
        "options": [
          "mod",
          "medijan",
          "geometrijska sredina",
          "raspon"
        ],
        "correct": 1,
        "id": "8hdfj2"
      },
      {
        "question": "Srednje vrijednosti dijele se na:",
        "options": [
          "velike i male",
          "potpune i položajne",
          "apsolutne i relativne",
          "diskretne i kontinuirane"
        ],
        "correct": 1,
        "id": "hsvcug"
      },
      {
        "question": "U nizu 2, 4, 6, 8, 10 medijan iznosi:",
        "options": [
          "4",
          "6",
          "8",
          "5"
        ],
        "correct": 1,
        "id": "ie6ih8"
      },
      {
        "question": "U nizu 2, 3, 3, 3, 4, 5, 6 mod iznosi:",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "correct": 1,
        "id": "n8yook"
      },
      {
        "question": "Za prosječnu stopu rasta koristi se:",
        "options": [
          "aritmetička sredina",
          "geometrijska sredina",
          "mod",
          "medijan"
        ],
        "correct": 1,
        "id": "4vk3f7"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "_______ je najčešća vrijednost u nizu.",
        "answer": "Mod",
        "hint": "najveća frekvencija",
        "id": "pbx60s"
      },
      {
        "sentence": "_______ dijeli uređeni niz na dva jednaka dijela.",
        "answer": "Medijan",
        "hint": "sredina po položaju",
        "id": "2dy8xx"
      },
      {
        "sentence": "Srednje vrijednosti dijele se na potpune i _______.",
        "answer": "položajne",
        "hint": "mod, medijan, kvartili",
        "id": "ykmvdr"
      },
      {
        "sentence": "Ako je broj podataka neparan, medijan je _______ član.",
        "answer": "središnji",
        "hint": "onaj u sredini",
        "id": "90ku6b"
      },
      {
        "sentence": "Za prosječne stope rasta koristi se _______ sredina.",
        "answer": "geometrijska",
        "hint": "n-ti korijen umnoška",
        "id": "xovn64"
      }
    ],
    "learn": {
      "title": "Srednje vrijednosti",
      "content": "\n                <h3>Podjela</h3>\n                <div class=\"formula-box\">\n                    POTPUNE (iz svih podataka): aritmetička · geometrijska · harmonijska<br>\n                    POLOŽAJNE (određene položajem): MOD · MEDIJAN · KVARTILI\n                </div>\n\n                <h4>Potpune srednje vrijednosti</h4>\n                <div class=\"formula-box\">\n                    \\[ \\bar{x} = \\frac{\\sum x_i}{N} \\qquad \\bar{x} = \\frac{\\sum x_i f_i}{\\sum f_i} \\ \\text{(grupirani niz)} \\]\n                </div>\n                <ul>\n                    <li><strong>Aritmetička sredina</strong> — prosječna srednja vrijednost; najčešće korištena.</li>\n                    <li><strong>Geometrijska sredina</strong> — za prosječne <em>stope rasta</em> i relativne promjene.</li>\n                    <li><strong>Harmonijska sredina</strong> — kad su podaci omjeri (brzine, cijene po jedinici).</li>\n                </ul>\n\n                <h4>Položajne srednje vrijednosti</h4>\n                <ul>\n                    <li><strong>Mod (Mo)</strong> — najčešća vrijednost (najveća frekvencija).</li>\n                    <li><strong>Medijan (Me)</strong> — dijeli uređeni niz na <strong>dva jednaka dijela</strong>. Neparan broj podataka → <em>središnji član</em>; paran → prosjek dvaju središnjih.</li>\n                    <li><strong>Kvartili</strong> — dijele niz na četiri dijela: \\( Q_1 \\) (donji, 25 %), \\( Q_2 \\) (= medijan, 50 %), \\( Q_3 \\) (gornji, 75 %).</li>\n                </ul>\n                <p><em>Primjeri:</em> u nizu 2, 3, 3, 3, 4, 5, 6 → Mo = 3, Me = 3, \\( Q_1 \\) = 3. U nizu 2, 4, 6, 8, 10 → Me = 6. U nizu 1, 2, 3, 4, 5 → \\( \\bar{x} \\) = 3.</p>\n            ",
      "id": "ji596b"
    },
    "id": "w102pf"
  },
  "dispersion": {
    "name": "Mjere disperzije",
    "icon": "fa-arrows-left-right",
    "color": "#f59e0b",
    "flashcards": [
      {
        "question": "Što mjere mjere disperzije?",
        "answer": "Raspršenost (varijabilnost) podataka oko srednje vrijednosti — koliko se podaci međusobno razlikuju.",
        "explanation": "Srednja vrijednost bez disperzije ne opisuje niz potpuno."
      },
      {
        "question": "Što je raspon, a što interkvartil?",
        "answer": "Raspon je razlika najveće i najmanje vrijednosti. Interkvartil je razlika GORNJEG i DONJEG kvartila: \\( I_q = Q_3 - Q_1 \\).",
        "explanation": "Interkvartil obuhvaća srednjih 50% podataka."
      },
      {
        "question": "Što je varijanca?",
        "answer": "Prosječno KVADRATNO odstupanje od aritmetičke sredine: \\( \\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{N} \\).",
        "explanation": "Jednaka je drugom momentu oko sredine."
      },
      {
        "question": "Što je standardna devijacija?",
        "answer": "Drugi korijen iz varijance: \\( \\sigma = \\sqrt{\\sigma^2} \\) — prosječno odstupanje od sredine u istim mjernim jedinicama kao podaci.",
        "explanation": "Zato je čitljivija od varijance."
      },
      {
        "question": "Što je koeficijent varijacije?",
        "answer": "Relativna mjera disperzije — omjer standardne devijacije i aritmetičke sredine: \\( V = \\frac{\\sigma}{\\bar{x}} \\times 100 \\).",
        "explanation": "Bez mjerne jedinice → uspoređuje nizove različitih veličina."
      },
      {
        "question": "Zašto je koeficijent varijacije koristan?",
        "answer": "Jer je relativan (u postotku) pa omogućuje usporedbu raspršenosti nizova s različitim jedinicama ili različitim redom veličine.",
        "explanation": "Apsolutne mjere to ne mogu."
      }
    ],
    "quiz": [
      {
        "question": "Razlika između gornjeg i donjeg kvartila naziva se:",
        "options": [
          "raspon",
          "interkvartil",
          "varijanca",
          "standardna devijacija"
        ],
        "correct": 1,
        "id": "ahgg06"
      },
      {
        "question": "Prosječno kvadratno odstupanje od aritmetičke sredine je:",
        "options": [
          "raspon",
          "varijanca",
          "mod",
          "koeficijent asimetrije"
        ],
        "correct": 1,
        "id": "7zfnq7"
      },
      {
        "question": "Omjer standardne devijacije i aritmetičke sredine je:",
        "options": [
          "interkvartil",
          "koeficijent varijacije",
          "varijanca",
          "medijan"
        ],
        "correct": 1,
        "id": "znydwm"
      },
      {
        "question": "Standardna devijacija je:",
        "options": [
          "kvadrat varijance",
          "drugi korijen iz varijance",
          "razlika kvartila",
          "najčešća vrijednost"
        ],
        "correct": 1,
        "id": "3njuv5"
      },
      {
        "question": "Ako drugi moment oko sredine iznosi 9, varijanca je:",
        "options": [
          "3",
          "9",
          "81",
          "18"
        ],
        "correct": 1,
        "id": "cqjrmf"
      },
      {
        "question": "Koja mjera dopušta usporedbu nizova u različitim jedinicama?",
        "options": [
          "varijanca",
          "raspon",
          "koeficijent varijacije",
          "standardna devijacija"
        ],
        "correct": 2,
        "id": "khi7sq"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "_______ je razlika između gornjeg i donjeg kvartila.",
        "answer": "Interkvartil",
        "hint": "Q3 − Q1",
        "id": "olf54g"
      },
      {
        "sentence": "_______ je prosječno kvadratno odstupanje od aritmetičke sredine.",
        "answer": "Varijanca",
        "hint": "drugi moment oko sredine",
        "id": "7wbi04"
      },
      {
        "sentence": "Standardna devijacija je drugi _______ iz varijance.",
        "answer": "korijen",
        "hint": "kvadratni korijen",
        "id": "9e1lw8"
      },
      {
        "sentence": "Koeficijent _______ je omjer standardne devijacije i aritmetičke sredine.",
        "answer": "varijacije",
        "hint": "relativna mjera",
        "id": "23wq1r"
      },
      {
        "sentence": "Mjere disperzije mjere _______ podataka oko srednje vrijednosti.",
        "answer": "raspršenost",
        "hint": "varijabilnost",
        "id": "w111co"
      }
    ],
    "learn": {
      "title": "Mjere disperzije",
      "content": "\n                <h3>Zašto disperzija</h3>\n                <p>Srednja vrijednost sama ne opisuje niz — dva niza s istom sredinom mogu biti potpuno različito raspršena. <strong>Mjere disperzije</strong> mjere raspršenost (varijabilnost) podataka oko srednje vrijednosti.</p>\n\n                <h4>Apsolutne mjere</h4>\n                <div class=\"formula-box\">\n                    \\[ \\text{raspon} = x_{max} - x_{min} \\qquad I_q = Q_3 - Q_1 \\]\n                    \\[ \\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{N} \\qquad \\sigma = \\sqrt{\\sigma^2} \\]\n                </div>\n                <ul>\n                    <li><strong>Raspon</strong> — razlika najveće i najmanje vrijednosti; ovisi samo o dva podatka.</li>\n                    <li><strong>Interkvartil</strong> — razlika gornjeg i donjeg kvartila; obuhvaća <em>srednjih 50 %</em> podataka, pa je otporan na ekstreme.</li>\n                    <li><strong>Varijanca</strong> — prosječno <strong>kvadratno</strong> odstupanje od aritmetičke sredine; jednaka je <em>drugom momentu oko sredine</em>.</li>\n                    <li><strong>Standardna devijacija</strong> — drugi korijen iz varijance; u istim je jedinicama kao podaci, pa je čitljivija.</li>\n                </ul>\n\n                <h4>Relativna mjera — koeficijent varijacije</h4>\n                <div class=\"formula-box\">\n                    \\[ V = \\frac{\\sigma}{\\bar{x}} \\times 100 \\ (\\%) \\]\n                </div>\n                <p>Jedina mjera <strong>bez mjerne jedinice</strong> — zato omogućuje usporedbu raspršenosti nizova izraženih u različitim jedinicama ili različitog reda veličine. Što je veći, to je niz relativno raspršeniji.</p>\n            ",
      "id": "o7r6bi"
    },
    "id": "ksvbu5"
  },
  "moments": {
    "name": "Momenti, asimetrija i zaobljenost",
    "icon": "fa-wave-square",
    "color": "#8b5cf6",
    "flashcards": [
      {
        "question": "Što su momenti u statistici?",
        "answer": "Prosjeci potencija odstupanja od sredine. Drugi moment oko sredine jednak je VARIJANCI; treći mjeri asimetriju, četvrti zaobljenost.",
        "explanation": "Iz njih se izvode mjere oblika distribucije."
      },
      {
        "question": "Što mjeri koeficijent asimetrije?",
        "answer": "Nagnutost distribucije — je li rep duži ulijevo ili udesno. Simetrična distribucija ima koeficijent 0.",
        "explanation": "Pozitivan = desna asimetrija, negativan = lijeva."
      },
      {
        "question": "Koje vrijednosti može poprimiti Pearsonova mjera asimetrije?",
        "answer": "Vrijednosti u intervalu od −3 do +3.",
        "explanation": "Nula znači savršenu simetriju."
      },
      {
        "question": "Kako se računa koeficijent zaobljenosti?",
        "answer": "Kao omjer ČETVRTOG momenta oko sredine i standardne devijacije na četvrtu potenciju: \\( \\alpha_4 = \\frac{\\mu_4}{\\sigma^4} \\).",
        "explanation": "Mjeri „šiljatost\" distribucije."
      },
      {
        "question": "Što znači koeficijent zaobljenosti 1,8?",
        "answer": "Distribuciju PRAVOKUTNOG oblika — spljoštenu, bez izraženog vrha.",
        "explanation": "Normalna distribucija ima vrijednost 3."
      },
      {
        "question": "Kako se odnose mod, medijan i sredina u asimetričnoj distribuciji?",
        "answer": "Kod simetrične su jednaki. Kod desne asimetrije: Mo < Me < sredina; kod lijeve obrnuto.",
        "explanation": "Sredinu najviše vuku ekstremne vrijednosti."
      }
    ],
    "quiz": [
      {
        "question": "Drugi moment oko sredine jednak je:",
        "options": [
          "modu",
          "varijanci",
          "medijanu",
          "rasponu"
        ],
        "correct": 1,
        "id": "ka389s"
      },
      {
        "question": "Pearsonova mjera asimetrije poprima vrijednosti:",
        "options": [
          "0 do 1",
          "−1 do +1",
          "−3 do +3",
          "0 do 100"
        ],
        "correct": 2,
        "id": "tudzoq"
      },
      {
        "question": "Omjer četvrtog momenta i standardne devijacije na četvrtu potenciju je:",
        "options": [
          "koeficijent varijacije",
          "koeficijent zaobljenosti",
          "koeficijent asimetrije",
          "interkvartil"
        ],
        "correct": 1,
        "id": "f21pk9"
      },
      {
        "question": "Koeficijent zaobljenosti 1,8 označava distribuciju:",
        "options": [
          "normalnu",
          "pravokutnog oblika",
          "šiljatu",
          "asimetričnu"
        ],
        "correct": 1,
        "id": "2rlyxr"
      },
      {
        "question": "Simetrična distribucija ima koeficijent asimetrije:",
        "options": [
          "1",
          "0",
          "−1",
          "3"
        ],
        "correct": 1,
        "id": "483l0a"
      },
      {
        "question": "Kod desne (pozitivne) asimetrije vrijedi:",
        "options": [
          "Mo > Me > sredina",
          "Mo < Me < sredina",
          "svi su jednaki",
          "Me > sredina > Mo"
        ],
        "correct": 1,
        "id": "j9iwul"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Drugi moment oko sredine jednak je _______.",
        "answer": "varijanci",
        "hint": "kvadratno odstupanje",
        "id": "5o7e1h"
      },
      {
        "sentence": "Pearsonova mjera asimetrije kreće se od −3 do _______.",
        "answer": "+3",
        "hint": "gornja granica",
        "id": "x9mno2"
      },
      {
        "sentence": "Koeficijent _______ mjeri šiljatost distribucije.",
        "answer": "zaobljenosti",
        "hint": "četvrti moment",
        "id": "n4rfch"
      },
      {
        "sentence": "Koeficijent zaobljenosti _______ označava distribuciju pravokutnog oblika.",
        "answer": "1,8",
        "hint": "broj s decimalom",
        "id": "1dym2x"
      },
      {
        "sentence": "Simetrična distribucija ima koeficijent asimetrije _______.",
        "answer": "0",
        "hint": "nula",
        "id": "25mt7f"
      }
    ],
    "learn": {
      "title": "Momenti, asimetrija i zaobljenost",
      "content": "\n                <h3>Momenti</h3>\n                <p><strong>Momenti</strong> su prosjeci potencija odstupanja od sredine. Iz njih se izvode mjere <em>oblika</em> distribucije:</p>\n                <div class=\"formula-box\">\n                    \\[ \\mu_r = \\frac{\\sum (x_i - \\bar{x})^r}{N} \\]\n                    2. moment = VARIJANCA · 3. moment → ASIMETRIJA · 4. moment → ZAOBLJENOST\n                </div>\n\n                <h4>Asimetrija</h4>\n                <p><strong>Koeficijent asimetrije</strong> mjeri nagnutost distribucije — je li rep duži ulijevo ili udesno.</p>\n                <ul>\n                    <li><strong>0</strong> — savršeno simetrična distribucija (Mo = Me = \\( \\bar{x} \\)).</li>\n                    <li><strong>Pozitivan</strong> — desna (pozitivna) asimetrija: \\( Mo &lt; Me &lt; \\bar{x} \\).</li>\n                    <li><strong>Negativan</strong> — lijeva asimetrija: obrnuti redoslijed.</li>\n                </ul>\n                <p><strong>Pearsonova mjera asimetrije</strong> poprima vrijednosti u intervalu <strong>od −3 do +3</strong>.</p>\n\n                <h4>Zaobljenost (kurtozis)</h4>\n                <div class=\"formula-box\">\n                    \\[ \\alpha_4 = \\frac{\\mu_4}{\\sigma^4} \\]\n                </div>\n                <p>Mjeri „šiljatost\" distribucije — koliko je vrh izražen:</p>\n                <ul>\n                    <li><strong>3</strong> — normalna (zvonolika) distribucija.</li>\n                    <li><strong>1,8</strong> — distribucija <strong>pravokutnog oblika</strong> (spljoštena, bez izraženog vrha).</li>\n                    <li>Veće od 3 — šiljatija; manje od 3 — spljoštenija od normalne.</li>\n                </ul>\n            ",
      "id": "jglveo"
    },
    "id": "cj6f49"
  }
};

if (typeof window !== 'undefined') { window.statisticsHrM1 = statisticsHrM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = statisticsHrM1; }
