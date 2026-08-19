// Makroekonomija (HR) — M2 (2. kolokvij)
// Autorski sadržaj iz HR skripte (Makroekonomija, FMTU). Model: kartice <=200, detalj u learn.
// KaTeX: \( \) / \[ \] delimiteri — NIKAD goli dolar-znak (ADR-009).
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom (ručno autorski usklađeno sa skriptom).

const macroeconomicsHrM2 = {
  "fiscal": {
    "name": "Fiskalna politika i multiplikatori",
    "icon": "fa-landmark",
    "color": "#6366f1",
    "flashcards": [
      {
        "question": "Što je fiskalna politika?",
        "answer": "Upravljanje fiskalnim prihodima i rashodima radi ostvarivanja makroekonomskih ciljeva. Prihodi su porezi; rashodi su državna potrošnja i transferi.",
        "explanation": "Država cilja uravnotežen budžet ili deficit koji potiče rast."
      },
      {
        "question": "Koji su instrumenti fiskalne politike?",
        "answer": "Javna potrošnja G, autonomni porezi Ta, porezna stopa t i transferi TR. Svi djeluju na BDP preko multiplikatora, svaki s različitom veličinom.",
        "explanation": "Četiri poluge upravljanja BDP-om."
      },
      {
        "question": "Što je cilj ekspanzivne fiskalne politike?",
        "answer": "Smanjiti autonomne poreze i smanjiti poreznu stopu t (te povećati javnu potrošnju i transfere) kako bi se povećala agregatna potražnja.",
        "explanation": "Suprotno: restriktivna politika smanjuje potražnju."
      },
      {
        "question": "Kako se računa raspoloživi dohodak?",
        "answer": "\\( Y_d = Y - T + TR = Y - (T_a + tY) + TR \\). Uvijek je manji od BDP-a jer je umanjen za poreze, a uvećan za transfere.",
        "explanation": "Ta = autonomni porezi, t = porezna stopa."
      },
      {
        "question": "Koliki je multiplikator javne potrošnje?",
        "answer": "\\( \\frac{1}{1 - \\beta(1-t)} \\) — povećanje G preko njega povećava BDP i smanjuje BDP jaz.",
        "explanation": "Najjači od svih fiskalnih multiplikatora."
      },
      {
        "question": "Koliki je multiplikator autonomnih poreza?",
        "answer": "\\( \\frac{-\\beta}{1 - \\beta(1-t)} \\) — negativnog je predznaka i slabiji od multiplikatora javne potrošnje.",
        "explanation": "Povećanje poreza smanjuje BDP."
      },
      {
        "question": "Koliki je multiplikator transfera?",
        "answer": "\\( \\frac{\\beta}{1 - \\beta(1-t)} \\) — pozitivnog je predznaka, ali slabiji od multiplikatora javne potrošnje.",
        "explanation": "Transferi povećavaju BDP i smanjuju jaz."
      },
      {
        "question": "Kako glasi funkcija štednje u modelu s državom?",
        "answer": "\\( S - I = G + TR - T \\). Višak u budžetu služi kao dodatni izvor financiranja investicija; ako je G veći od T, dio štednje odlazi na financiranje države.",
        "explanation": "Veza budžeta i investicija."
      }
    ],
    "quiz": [
      {
        "question": "Fiskalni prihodi su:",
        "options": [
          "transferi",
          "porezi",
          "državna potrošnja",
          "investicije"
        ],
        "correct": 1,
        "id": "zgcslj"
      },
      {
        "question": "Multiplikator javne potrošnje iznosi:",
        "options": [
          "−β/(1−β(1−t))",
          "1/(1−β(1−t))",
          "β/(1−β(1−t))",
          "1/β"
        ],
        "correct": 1,
        "id": "wweilh"
      },
      {
        "question": "Multiplikator autonomnih poreza je:",
        "options": [
          "pozitivan i najjači",
          "negativan i slabiji od multiplikatora javne potrošnje",
          "uvijek jednak nuli",
          "pozitivan i slabiji"
        ],
        "correct": 1,
        "id": "xot0l6"
      },
      {
        "question": "Raspoloživi dohodak je od BDP-a:",
        "options": [
          "uvijek veći",
          "uvijek manji",
          "jednak",
          "nepovezan"
        ],
        "correct": 1,
        "id": "a4e7p4"
      },
      {
        "question": "Cilj ekspanzivne fiskalne politike je:",
        "options": [
          "povećati poreznu stopu",
          "smanjiti autonomne poreze i poreznu stopu",
          "smanjiti transfere",
          "smanjiti javnu potrošnju"
        ],
        "correct": 1,
        "id": "n04bp2"
      },
      {
        "question": "Što NIJE instrument fiskalne politike?",
        "options": [
          "javna potrošnja G",
          "porezna stopa t",
          "transferi TR",
          "količina novca u optjecaju"
        ],
        "correct": 3,
        "id": "1jigj4"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Fiskalni prihodi su _______, a rashodi državna potrošnja i transferi.",
        "answer": "porezi",
        "hint": "davanja državi",
        "id": "qhkiod"
      },
      {
        "sentence": "Multiplikator _______ poreza je negativnog predznaka.",
        "answer": "autonomnih",
        "hint": "oznaka Ta",
        "id": "stkljl"
      },
      {
        "sentence": "Raspoloživi dohodak je uvijek _______ od ravnotežnog domaćeg proizvoda.",
        "answer": "manji",
        "hint": "umanjen za poreze",
        "id": "gsqfrh"
      },
      {
        "sentence": "Multiplikator javne potrošnje je 1/(1−β(1−_______)).",
        "answer": "t",
        "hint": "porezna stopa",
        "id": "k2pz2b"
      },
      {
        "sentence": "Funkcija štednje u modelu s državom: S − I = G + TR − _______.",
        "answer": "T",
        "hint": "porezi",
        "id": "td4m2e"
      }
    ],
    "learn": {
      "title": "Fiskalna politika i multiplikatori",
      "content": "\n                <h3>Što je fiskalna politika</h3>\n                <p><strong>Fiskalna politika</strong> je upravljanje fiskalnim prihodima i rashodima radi ostvarivanja makroekonomskih ciljeva.</p>\n                <div class=\"formula-box\">\n                    FISKALNI PRIHODI = porezi<br>\n                    FISKALNI RASHODI = državna potrošnja (G) + transferi (TR)\n                </div>\n                <p>Država nastoji imati uravnotežen budžet ili budžetski deficit jer to poticajno djeluje na ekonomski rast. Porezi su <strong>rastuća funkcija</strong> dohotka (BDP-a): povećanje poreza smanjuje BDP i agregatnu potražnju.</p>\n                <p><strong>Cilj ekspanzivne fiskalne politike:</strong> smanjiti autonomne poreze i smanjiti poreznu stopu \\( t \\).</p>\n                <p><em>Pokazatelji poreza:</em> prosječni porezi \\( T/Y \\), granični porezi \\( t \\), elastičnost poreza na dohodak.</p>\n\n                <h4>Raspoloživi dohodak i potrošnja</h4>\n                <div class=\"formula-box\">\n                    \\[ Y_d = Y - T + TR = Y - (T_a + tY) + TR \\]\n                </div>\n                <p>Raspoloživi dohodak je <strong>uvijek manji</strong> od ravnotežnog domaćeg proizvoda jer je umanjen za poreze i uvećan za transfere. U modelu \\( Y = C + I + G \\) osobna je potrošnja funkcija raspoloživog dohotka i <em>niža</em> je nego u modelu \\( Y = C + I \\), jer se dio sredstava „gubi\" na poreze.</p>\n\n                <h4>Instrumenti i njihovi multiplikatori</h4>\n                <p>Instrumenti su <strong>G, T<sub>a</sub>, t i TR</strong>; svi djeluju na BDP <em>preko multiplikatora</em>, a svaki ima različitu veličinu:</p>\n                <div class=\"formula-box\">\n                    \\[ \\text{javna potrošnja: } \\frac{1}{1-\\beta(1-t)} \\qquad \\text{(najjači, pozitivan)} \\]\n                    \\[ \\text{autonomni porezi: } \\frac{-\\beta}{1-\\beta(1-t)} \\qquad \\text{(negativan, slabiji)} \\]\n                    \\[ \\text{transferi: } \\frac{\\beta}{1-\\beta(1-t)} \\qquad \\text{(pozitivan, slabiji)} \\]\n                </div>\n                <p>gdje je \\( \\beta \\) granična sklonost potrošnji, a \\( t \\) granična porezna stopa. Multiplikator potrošnje u modelu s državom <strong>manji</strong> je nego u modelu \\( Y = C + I \\) — pozitivan učinak potrošnje na rast BDP-a se smanjuje.</p>\n\n                <h4>Štednja, investicije i budžet</h4>\n                <div class=\"formula-box\">\n                    \\[ S - I = G + TR - T \\]\n                </div>\n                <p>Eventualni višak u budžetu služi kao dodatni izvor financiranja investicija; obrnuto, ako je \\( G > T \\), investicije bi trebale biti manje od štednje jer se dio štednje troši na financiranje države.</p>\n            ",
      "id": "oxoud6"
    },
    "id": "k5qd9q"
  },
  "taxes": {
    "name": "Porezi i njihovi učinci",
    "icon": "fa-file-invoice-dollar",
    "color": "#ef4444",
    "flashcards": [
      {
        "question": "Koja je razlika između neizravnih i izravnih poreza?",
        "answer": "Neizravni: porez na promet (PDV), porez na potrošnju, trošarine (oporezivanje luksuza). Izravni: porez na dohodak i porez na dobit.",
        "explanation": "Neizravni se plaćaju kroz cijenu, izravni na dohodak/dobit."
      },
      {
        "question": "Kako su porezi povezani s ekonomskim rastom?",
        "answer": "Smatra se da su negativno korelirani — veći porezi donose niže stope rasta gospodarstva jer oporezivanje uvodi neefikasnost.",
        "explanation": "Porezi mijenjaju poticaje i ponašanje ljudi."
      },
      {
        "question": "Što se događa na tržištu nakon uvođenja poreza?",
        "answer": "Ravnoteža se uspostavlja na nižoj razini outputa i višoj razini cijena; razmjenjuje se manje dobara pa se tržište „suzilo\".",
        "explanation": "Gube i potrošači i proizvođači."
      },
      {
        "question": "Kako porez djeluje na cijene za potrošača i proizvođača?",
        "answer": "Cijena koju nakon poreza plaća potrošač je VIŠA, a cijena koju ostvaruje proizvođač NIŽA od cijene prije poreza.",
        "explanation": "Razlika odlazi državi kao porezni prihod."
      },
      {
        "question": "Što je mrtvi teret oporezivanja?",
        "answer": "Blagostanje koje je zauvijek izgubljeno — neefikasnost koju porez unosi na tržište. Smanjenje blagostanja NADILAZI porezni prihod države.",
        "explanation": "Zato porez nije samo prijenos, nego i gubitak."
      },
      {
        "question": "O čemu ovisi veličina mrtvog tereta?",
        "answer": "O nagibu krivulja AD i AS, tj. o njihovoj cjenovnoj elastičnosti — što su krivulje elastičnije, to je neefikasnost veća.",
        "explanation": "Elastičnije tržište → veći gubitak."
      }
    ],
    "quiz": [
      {
        "question": "PDV je primjer:",
        "options": [
          "izravnog poreza",
          "neizravnog poreza",
          "transfera",
          "trošarine na dohodak"
        ],
        "correct": 1,
        "id": "5m020k"
      },
      {
        "question": "Porez na dobit je:",
        "options": [
          "neizravan porez",
          "izravan porez",
          "trošarina",
          "transfer"
        ],
        "correct": 1,
        "id": "xei2b4"
      },
      {
        "question": "Nakon uvođenja poreza ravnoteža se uspostavlja na:",
        "options": [
          "višem outputu i nižim cijenama",
          "nižem outputu i višim cijenama",
          "istom outputu",
          "nižem outputu i nižim cijenama"
        ],
        "correct": 1,
        "id": "57apd4"
      },
      {
        "question": "Mrtvi teret oporezivanja je:",
        "options": [
          "porezni prihod države",
          "zauvijek izgubljeno blagostanje",
          "transfer potrošačima",
          "iznos subvencije"
        ],
        "correct": 1,
        "id": "fnk1p3"
      },
      {
        "question": "Što su krivulje AD i AS elastičnije, neefikasnost poreza je:",
        "options": [
          "manja",
          "veća",
          "nepromijenjena",
          "nula"
        ],
        "correct": 1,
        "id": "npom8b"
      },
      {
        "question": "Nakon poreza, cijena koju plaća potrošač je:",
        "options": [
          "niža nego prije",
          "viša nego prije",
          "jednaka",
          "nula"
        ],
        "correct": 1,
        "id": "7r5vuk"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "PDV i trošarine su _______ porezi.",
        "answer": "neizravni",
        "hint": "plaćaju se kroz cijenu",
        "id": "645h56"
      },
      {
        "sentence": "Porez na dohodak i porez na dobit su _______ porezi.",
        "answer": "izravni",
        "hint": "na dohodak/dobit",
        "id": "kdlq8l"
      },
      {
        "sentence": "_______ teret oporezivanja je zauvijek izgubljeno blagostanje.",
        "answer": "Mrtvi",
        "hint": "deadweight loss",
        "id": "j5z0zr"
      },
      {
        "sentence": "Nakon poreza cijena koju ostvaruje proizvođač je _______ nego prije.",
        "answer": "niža",
        "hint": "manja",
        "id": "sulhww"
      },
      {
        "sentence": "Veći porezi u pravilu donose _______ stope gospodarskog rasta.",
        "answer": "niže",
        "hint": "manje",
        "id": "pcpvxo"
      }
    ],
    "learn": {
      "title": "Porezi i njihovi učinci",
      "content": "\n                <h3>Vrste poreza</h3>\n                <div class=\"formula-box\">\n                    NEIZRAVNI — porez na promet (PDV) · porez na potrošnju · trošarine (oporezivanje luksuza)<br>\n                    IZRAVNI — porez na dohodak · porez na dobit\n                </div>\n\n                <h4>Porezi i gospodarski rast</h4>\n                <p>Smatra se da su porezi <strong>negativno korelirani</strong> s ekonomskim rastom: veći porezi donose niže stope rasta jer oporezivanje uvodi <strong>neefikasnost</strong> u gospodarstvo. Porezi stvaraju poticaje da ljudi promijene ponašanje (rade više ili manje, mijenjaju potrošnju).</p>\n\n                <h4>Što se događa kad se uvede porez</h4>\n                <ul>\n                    <li>Porez smanjuje ponudu, izaziva porast cijena i smanjenje ponuđenih količina.</li>\n                    <li>Ravnoteža se uspostavlja na <strong>nižoj razini outputa</strong> i <strong>višoj razini cijena</strong>.</li>\n                    <li>Cijena koju nakon poreza <em>plaća potrošač</em> je <strong>viša</strong>, a cijena koju <em>ostvaruje proizvođač</em> <strong>niža</strong> od cijene prije poreza.</li>\n                    <li>Tržište se „suzilo\" — razmjenjuje se manje dobara; u lošijem su položaju i potrošači i proizvođači.</li>\n                </ul>\n\n                <h4>Mrtvi teret oporezivanja</h4>\n                <p>Dio smanjenja blagostanja potrošača i proizvođača pretvara se u <strong>porezni prihod države</strong> — ali <em>ukupno smanjenje blagostanja NADILAZI taj prihod</em>. Razlika je <strong>mrtvi teret</strong> (engl. <em>deadweight loss</em>): blagostanje koje je zauvijek izgubljeno.</p>\n                <p>Veličina mrtvog tereta određena je <strong>nagibom krivulja AD i AS</strong>, tj. njihovom cjenovnom elastičnošću — <em>što su krivulje elastičnije, to je neefikasnost koju porezi unose veća</em>.</p>\n            ",
      "id": "vfmrvb"
    },
    "id": "6j89wk"
  },
  "monetary": {
    "name": "Monetarna makroekonomija i novac",
    "icon": "fa-coins",
    "color": "#10b981",
    "flashcards": [
      {
        "question": "Što nastoji objasniti monetarna analiza?",
        "answer": "Međuovisnost realnih i monetarnih makroekonomskih varijabli te razinu i promjene agregatne potražnje promjenama veličine i strukture novčane ponude.",
        "explanation": "Analiza objašnjava; politika djeluje."
      },
      {
        "question": "Što nastoji postići monetarna politika?",
        "answer": "Željene promjene agregatne potražnje pomoću promjena novčane ponude, tj. monetarnih varijabli pod kontrolom monetarne vlasti.",
        "explanation": "Središnja banka je nositelj."
      },
      {
        "question": "Što je trampa i koji su joj nedostaci?",
        "answer": "Razmjena robe za robu — polazni oblik razmjene u kojem obje strane imaju velike troškove vremena i energije, tj. transakcijske troškove.",
        "explanation": "Novac te troškove smanjuje."
      },
      {
        "question": "Što je devalvacija, a što revalvacija?",
        "answer": "Devalvacija = smanjivanje mjerila cijena (vrijednosti novca). Revalvacija = povećavanje mjerila cijena.",
        "explanation": "Time monetarna vlast utječe na cijene u zemlji."
      },
      {
        "question": "Što je zlatno-devizni standard?",
        "answer": "Sustav u kojem se vrijednost novčanica jamči zlatnim pokrićem u obliku zlatnih poluga (jednim dijelom) i devizama u središnjoj banci (drugim dijelom).",
        "explanation": "Prvo mjerilo cijena: 1 USD = 0,89 g zlata."
      },
      {
        "question": "Koja su svojstva novca?",
        "answer": "Prihvatljivost, rijetkost, prepoznatljivost, djeljivost, stabilnost, homogenost, prenosivost i trajnost.",
        "explanation": "Osam svojstava dobrog novca."
      },
      {
        "question": "Koje su funkcije novca?",
        "answer": "Sredstvo plaćanja (posrednik u razmjeni), mjerilo vrijednosti i pričuva (čuvar) vrijednosti.",
        "explanation": "Za mjerilo vrijednosti novac mora biti stabilan."
      },
      {
        "question": "Što je bankovni novac?",
        "answer": "Čekovi i kreditne kartice koji se izdaju na temelju depozita u banci ili drugoj financijskoj instituciji.",
        "explanation": "Nije gotovina, ali služi plaćanju."
      }
    ],
    "quiz": [
      {
        "question": "Razmjena robe za robu naziva se:",
        "options": [
          "devalvacija",
          "trampa",
          "revalvacija",
          "depozit"
        ],
        "correct": 1,
        "id": "uqqfc1"
      },
      {
        "question": "Smanjivanje mjerila cijena naziva se:",
        "options": [
          "revalvacija",
          "devalvacija",
          "inflacija",
          "deflacija"
        ],
        "correct": 1,
        "id": "2jr9ru"
      },
      {
        "question": "Što NIJE svojstvo novca?",
        "options": [
          "djeljivost",
          "trajnost",
          "kvarljivost",
          "prenosivost"
        ],
        "correct": 2,
        "id": "wiwh6f"
      },
      {
        "question": "Čekovi i kreditne kartice na temelju depozita su:",
        "options": [
          "robni novac",
          "bankovni novac",
          "zlatne poluge",
          "devize"
        ],
        "correct": 1,
        "id": "7h9njp"
      },
      {
        "question": "Da bi novac služio kao mjerilo vrijednosti, mora biti:",
        "options": [
          "rijedak",
          "stabilan",
          "težak",
          "zlatan"
        ],
        "correct": 1,
        "id": "5auf5n"
      },
      {
        "question": "Monetarna politika djeluje na agregatnu potražnju preko:",
        "options": [
          "poreznih stopa",
          "novčane ponude",
          "transfera",
          "carina"
        ],
        "correct": 1,
        "id": "x91iqx"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "_______ je razmjena robe za robu.",
        "answer": "Trampa",
        "hint": "bez novca",
        "id": "vkrh2k"
      },
      {
        "sentence": "Smanjivanje mjerila cijena naziva se _______.",
        "answer": "devalvacija",
        "hint": "suprotno od revalvacije",
        "id": "2g8n07"
      },
      {
        "sentence": "Čekovi i kreditne kartice čine _______ novac.",
        "answer": "bankovni",
        "hint": "na temelju depozita",
        "id": "850cuu"
      },
      {
        "sentence": "Monetarna politika utječe na agregatnu potražnju preko novčane _______.",
        "answer": "ponude",
        "hint": "količine novca",
        "id": "nnk91x"
      },
      {
        "sentence": "Da bi bio mjerilo vrijednosti, novac mora biti _______.",
        "answer": "stabilan",
        "hint": "nepromjenjive vrijednosti",
        "id": "r19t4g"
      }
    ],
    "learn": {
      "title": "Monetarna makroekonomija i novac",
      "content": "\n                <h3>Analiza i politika</h3>\n                <ul>\n                    <li><strong>Monetarna analiza</strong> nastoji objasniti međuovisnost realnih i monetarnih makroekonomskih varijabli te razinu i promjene <em>agregatne potražnje</em> promjenama veličine i strukture <em>novčane ponude</em>.</li>\n                    <li><strong>Monetarna politika</strong> nastoji <em>postići</em> željene promjene agregatne potražnje pomoću promjena novčane ponude — dakle varijabli pod kontrolom monetarne vlasti.</li>\n                </ul>\n\n                <h4>Razvoj novca</h4>\n                <ul>\n                    <li><strong>Trampa</strong> — razmjena robe za robu; obje strane imaju velike <strong>transakcijske troškove</strong> (vrijeme i energija).</li>\n                    <li><strong>Razdoblje robnog novca</strong> — različita roba duže ili kraće služila je kao sredstvo razmjene.</li>\n                    <li>U početku banka za sve izdane novčanice ima <strong>zlatno pokriće</strong>; prvo mjerilo cijena: <em>1 USD = 0,89 g zlata</em>.</li>\n                    <li><strong>Zlatno-devizni standard</strong> — vrijednost novčanica jamči se zlatnim polugama (jednim dijelom) i devizama u središnjoj banci (drugim dijelom).</li>\n                    <li><strong>Bankovni novac</strong> — čekovi i kreditne kartice na temelju depozita u banci.</li>\n                </ul>\n                <div class=\"formula-box\">\n                    DEVALVACIJA = smanjivanje mjerila cijena (vrijednosti novca)<br>\n                    REVALVACIJA = povećavanje mjerila cijena\n                </div>\n                <p>Promjenom mjerila cijena monetarna vlast (država) smanjuje ili povećava vrijednost novca i tako utječe na cijene u zemlji.</p>\n\n                <h4>Svojstva novca</h4>\n                <div class=\"formula-box\">\n                    PRIHVATLJIVOST · RIJETKOST · PREPOZNATLJIVOST · DJELJIVOST<br>\n                    STABILNOST · HOMOGENOST · PRENOSIVOST · TRAJNOST\n                </div>\n\n                <h4>Funkcije novca</h4>\n                <ol>\n                    <li><strong>Sredstvo plaćanja</strong> — novac je posrednik u razmjeni ostalih dobara; zamjenjuje trampu i uklanja njezine transakcijske troškove.</li>\n                    <li><strong>Mjerilo vrijednosti</strong> — razmjena se razdvaja na dva koraka (roba → opće sredstvo razmjene → željena roba), čime se ubrzava i pojeftinjuje. Za ovu funkciju novac mora biti <em>stabilan</em>.</li>\n                    <li><strong>Pričuva vrijednosti</strong> — novac čuva kupovnu moć kroz vrijeme.</li>\n                </ol>\n            ",
      "id": "5xj0rs"
    },
    "id": "ym2mcc"
  },
  "openEconomy": {
    "name": "Otvorena ekonomija i platna bilanca",
    "icon": "fa-earth-europe",
    "color": "#14b8a6",
    "flashcards": [
      {
        "question": "Koji su modeli privrede po složenosti?",
        "answer": "\\( Y = C \\); \\( Y = C + I \\); \\( Y = C + I + G \\); \\( Y = C + I + G + E \\) — svaki dodaje jedan sektor.",
        "explanation": "E = sektor inozemstvo (otvorena privreda)."
      },
      {
        "question": "Što donosi uvođenje sektora inozemstvo?",
        "answer": "Domaći proizvod više ne mora biti jednak finalnoj uporabi domaćih rezidenata (zbroju osobne, investicijske i budžetske potrošnje).",
        "explanation": "Zapošljavaju se i domaći i inozemni proizvodni faktori."
      },
      {
        "question": "Čime se mjeri vrijednost proizvodnje u otvorenoj privredi?",
        "answer": "Domaćim (bruto) proizvodom — BDP-om, a NE nacionalnim dohotkom.",
        "explanation": "Teritorijalni kriterij ima prednost."
      },
      {
        "question": "Iz kojih se dijelova sastoji platna bilanca?",
        "answer": "Tekući račun, financijski račun i promjena rezervi. Vrijedi: saldo TR + saldo FR + promjena rezervi = 0.",
        "explanation": "Bilanca se uvijek zatvara u nulu."
      },
      {
        "question": "Što obuhvaća tekući račun?",
        "answer": "Transakcije roba (izvoz/uvoz), transakcije usluga, primarni dohodak i sekundarni dohodak.",
        "explanation": "Od 2014. iskazuje se u tri bilance."
      },
      {
        "question": "Što obuhvaća financijski račun?",
        "answer": "Izravna ulaganja, portfeljna ulaganja, ostala ulaganja i financijske derivate — svako kroz imovinu i obveze.",
        "explanation": "Četiri stavke financijskog računa."
      },
      {
        "question": "Što je primarni, a što sekundarni dohodak?",
        "answer": "Primarni: naknade zaposlenima i dohodak od ulaganja (izravnih, portfeljnih, ostalih). Sekundarni: tekući transferi bez protučinidbe.",
        "explanation": "Oba su dio tekućeg računa."
      },
      {
        "question": "U koje se tri bilance od 2014. iskazuje bilanca tekućih transakcija?",
        "answer": "Bilanca robne razmjene, bilanca usluga te bilanca primarnih i sekundarnih dohodaka.",
        "explanation": "Usklađeno s metodologijom BPM6."
      }
    ],
    "quiz": [
      {
        "question": "Model otvorene privrede glasi:",
        "options": [
          "Y = C",
          "Y = C + I",
          "Y = C + I + G",
          "Y = C + I + G + E"
        ],
        "correct": 3,
        "id": "cg46wl"
      },
      {
        "question": "Zbroj salda tekućeg računa, financijskog računa i promjene rezervi jednak je:",
        "options": [
          "BDP-u",
          "nuli",
          "izvozu",
          "uvozu"
        ],
        "correct": 1,
        "id": "9tixyr"
      },
      {
        "question": "Portfeljna ulaganja dio su:",
        "options": [
          "tekućeg računa",
          "financijskog računa",
          "primarnog dohotka",
          "sekundarnog dohotka"
        ],
        "correct": 1,
        "id": "atj898"
      },
      {
        "question": "Transakcije usluga (izvoz/uvoz) dio su:",
        "options": [
          "financijskog računa",
          "tekućeg računa",
          "promjene rezervi",
          "derivata"
        ],
        "correct": 1,
        "id": "351p2h"
      },
      {
        "question": "U otvorenoj privredi vrijednost proizvodnje mjeri se:",
        "options": [
          "nacionalnim dohotkom",
          "domaćim (bruto) proizvodom",
          "brojem zaposlenih",
          "deviznim rezervama"
        ],
        "correct": 1,
        "id": "e8nl7n"
      },
      {
        "question": "Naknade zaposlenima i dohodak od ulaganja pripadaju:",
        "options": [
          "sekundarnom dohotku",
          "primarnom dohotku",
          "financijskim derivatima",
          "robnoj razmjeni"
        ],
        "correct": 1,
        "id": "bvwkwt"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Model otvorene privrede glasi Y = C + I + G + _______.",
        "answer": "E",
        "hint": "sektor inozemstvo",
        "id": "i2g9x8"
      },
      {
        "sentence": "Saldo TR + saldo FR + promjena rezervi = _______.",
        "answer": "0",
        "hint": "broj",
        "id": "tml09d"
      },
      {
        "sentence": "Izravna i _______ ulaganja dio su financijskog računa.",
        "answer": "portfeljna",
        "hint": "vrijednosnice",
        "id": "crt4bl"
      },
      {
        "sentence": "U otvorenoj privredi proizvodnja se mjeri domaćim _______ proizvodom.",
        "answer": "bruto",
        "hint": "BDP",
        "id": "jp3px4"
      },
      {
        "sentence": "Primarni dohodak obuhvaća naknade zaposlenima i dohodak od _______.",
        "answer": "ulaganja",
        "hint": "investicija",
        "id": "swvsic"
      }
    ],
    "learn": {
      "title": "Otvorena ekonomija i platna bilanca",
      "content": "\n                <h3>Modeli privrede</h3>\n                <div class=\"formula-box\">\n                    \\[ Y = C \\quad\\rightarrow\\quad Y = C + I \\quad\\rightarrow\\quad Y = C + I + G \\quad\\rightarrow\\quad Y = C + I + G + E \\]\n                </div>\n                <p>Uvođenje <strong>sektora inozemstvo (E)</strong> kao četvrtog sektora omogućuje da domaći proizvod <em>ne mora</em> biti jednak finalnoj uporabi domaćih rezidenata (zbroju osobne, investicijske i budžetske potrošnje).</p>\n                <ul>\n                    <li>U otvorenoj privredi vrijednost proizvodnje mjeri se <strong>domaćim (bruto) proizvodom</strong>, a ne nacionalnim dohotkom.</li>\n                    <li>Zapošljavaju se <strong>domaći i inozemni</strong> proizvodni faktori.</li>\n                </ul>\n\n                <h3>Platna bilanca</h3>\n                <p>Od 2014. bilanca tekućih transakcija iskazuje se u <strong>tri bilance</strong> (metodologija BPM6): bilanca robne razmjene · bilanca usluga · bilanca primarnih i sekundarnih dohodaka.</p>\n                <div class=\"formula-box\">\n                    TEKUĆI RAČUN (TR)&nbsp;&nbsp;|&nbsp;&nbsp;FINANCIJSKI RAČUN (FR)<br>\n                    transakcije roba (izvoz/uvoz)&nbsp;&nbsp;|&nbsp;&nbsp;1. izravna ulaganja<br>\n                    transakcije usluga (izvoz/uvoz)&nbsp;&nbsp;|&nbsp;&nbsp;2. portfeljna ulaganja<br>\n                    primarni dohodak (primici/izdaci)&nbsp;&nbsp;|&nbsp;&nbsp;3. ostala ulaganja<br>\n                    sekundarni dohodak (primici/izdaci)&nbsp;&nbsp;|&nbsp;&nbsp;4. financijski derivati\n                </div>\n                <div class=\"formula-box\">\n                    \\[ \\text{SALDO}_{TR} + \\text{SALDO}_{FR} + \\Delta\\text{REZERVI} = 0 \\]\n                </div>\n                <p>Svaka stavka financijskog računa vodi se kroz <strong>imovinu (+)</strong> i <strong>obveze (−)</strong>.</p>\n\n                <h4>Primarni i sekundarni dohodak</h4>\n                <ul>\n                    <li><strong>Primarni dohodak</strong> — naknade zaposlenima (prema inozemstvu i iz inozemstva) te dohodak od izravnih, portfeljnih i ostalih ulaganja.</li>\n                    <li><strong>Sekundarni dohodak</strong> — tekući transferi bez protučinidbe (npr. doznake, pomoći).</li>\n                </ul>\n                <p>Zbroj bilance robe i usluga daje <strong>bilancu vanjske trgovine robom i uslugama</strong>.</p>\n            ",
      "id": "w6wyqy"
    },
    "id": "3rcjfi"
  },
  "openModel": {
    "name": "Model otvorene privrede",
    "icon": "fa-arrow-right-arrow-left",
    "color": "#8b5cf6",
    "flashcards": [
      {
        "question": "Kako izvoz i uvoz ulaze u model otvorene privrede?",
        "answer": "Kroz neto izvoz \\( NX = X - M \\): izvoz X povećava agregatnu potražnju, a uvoz M je odljev jer je potražnja za inozemnom proizvodnjom.",
        "explanation": "Zato model glasi Y = C + I + G + (X − M)."
      },
      {
        "question": "Zašto uvoz smanjuje domaći multiplikator?",
        "answer": "Jer dio svakog dodatnog dohotka odlazi na uvoz (granična sklonost uvozu) i time izlazi iz domaćeg kružnog toka.",
        "explanation": "Otvoreni multiplikator je manji od zatvorenog."
      },
      {
        "question": "Što je granična sklonost uvozu?",
        "answer": "Dio svake dodatne jedinice dohotka koji se potroši na uvozna dobra; što je veća, to je multiplikator manji.",
        "explanation": "Oznaka najčešće m."
      },
      {
        "question": "Kako se u otvorenoj privredi mijenja djelovanje fiskalne politike?",
        "answer": "Slabije je nego u zatvorenoj — dio poticaja „iscuri\" u inozemstvo kroz uvoz, pa je učinak na domaći BDP manji.",
        "explanation": "Isti razlog kao i kod manjeg multiplikatora."
      },
      {
        "question": "Što znači suficit, a što deficit tekućeg računa?",
        "answer": "Suficit: zemlja više izvozi nego uvozi (neto priljev). Deficit: više uvozi nego izvozi, pa se razlika financira iz financijskog računa ili rezervi.",
        "explanation": "Bilanca se uvijek zatvara u nulu."
      }
    ],
    "quiz": [
      {
        "question": "Neto izvoz definira se kao:",
        "options": [
          "X + M",
          "X − M",
          "M − X",
          "X × M"
        ],
        "correct": 1,
        "id": "kxsvcx"
      },
      {
        "question": "Uvoz u modelu otvorene privrede predstavlja:",
        "options": [
          "priljev domaće potražnje",
          "odljev iz domaćeg kružnog toka",
          "dio državne potrošnje",
          "dio investicija"
        ],
        "correct": 1,
        "id": "69h3g0"
      },
      {
        "question": "Multiplikator u otvorenoj privredi je u odnosu na zatvorenu:",
        "options": [
          "veći",
          "manji",
          "jednak",
          "uvijek nula"
        ],
        "correct": 1,
        "id": "n4cshz"
      },
      {
        "question": "Veća granična sklonost uvozu znači:",
        "options": [
          "veći multiplikator",
          "manji multiplikator",
          "nema utjecaja",
          "veći izvoz"
        ],
        "correct": 1,
        "id": "e8aqtr"
      },
      {
        "question": "Deficit tekućeg računa znači da zemlja:",
        "options": [
          "više izvozi nego uvozi",
          "više uvozi nego izvozi",
          "nema vanjsku trgovinu",
          "ima uravnotežen budžet"
        ],
        "correct": 1,
        "id": "fkkbbv"
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Neto izvoz računa se kao X _______ M.",
        "answer": "−",
        "hint": "oduzimanje",
        "id": "j6c6l8"
      },
      {
        "sentence": "Uvoz je _______ iz domaćeg kružnog toka.",
        "answer": "odljev",
        "hint": "curenje",
        "id": "39w1if"
      },
      {
        "sentence": "Multiplikator u otvorenoj privredi je _______ nego u zatvorenoj.",
        "answer": "manji",
        "hint": "slabiji učinak",
        "id": "7vh0w4"
      },
      {
        "sentence": "Granična sklonost _______ pokazuje koliko dodatnog dohotka odlazi na uvozna dobra.",
        "answer": "uvozu",
        "hint": "import",
        "id": "qlktuc"
      },
      {
        "sentence": "_______ tekućeg računa znači da zemlja više uvozi nego izvozi.",
        "answer": "Deficit",
        "hint": "manjak",
        "id": "1vg13b"
      }
    ],
    "learn": {
      "title": "Model otvorene privrede",
      "content": "\n                <h3>Od zatvorene do otvorene privrede</h3>\n                <p>Otvaranjem privrede model dobiva sektor inozemstva, pa agregatna potražnja uključuje i <strong>neto izvoz</strong>:</p>\n                <div class=\"formula-box\">\n                    \\[ Y = C + I + G + NX \\qquad NX = X - M \\]\n                </div>\n                <ul>\n                    <li><strong>Izvoz (X)</strong> — inozemna potražnja za domaćom proizvodnjom → <em>povećava</em> agregatnu potražnju.</li>\n                    <li><strong>Uvoz (M)</strong> — domaća potražnja za inozemnom proizvodnjom → <em>odljev</em> iz domaćeg kružnog toka.</li>\n                </ul>\n\n                <h4>Zašto je multiplikator manji</h4>\n                <p>U otvorenoj privredi dio svakog dodatnog dohotka odlazi na uvoz — to je <strong>granična sklonost uvozu</strong>. Taj dio izlazi iz domaćeg kružnog toka, pa je <strong>multiplikator manji</strong> nego u zatvorenoj privredi.</p>\n                <p>Posljedica: <strong>fiskalna politika djeluje slabije</strong> — dio poticaja „iscuri\" u inozemstvo kroz uvoz, pa je učinak na domaći BDP manji nego što bi bio u zatvorenom modelu.</p>\n\n                <h4>Saldo tekućeg računa</h4>\n                <div class=\"formula-box\">\n                    SUFICIT — izvoz &gt; uvoz (neto priljev iz inozemstva)<br>\n                    DEFICIT — uvoz &gt; izvoz (razlika se financira financijskim računom ili rezervama)\n                </div>\n                <p>Budući da se platna bilanca uvijek zatvara u nulu, deficit tekućeg računa nužno ima protutežu u financijskom računu ili u promjeni deviznih rezervi.</p>\n            ",
      "id": "xyr4du"
    },
    "id": "yor340"
  }
};

if (typeof window !== 'undefined') { window.macroeconomicsHrM2 = macroeconomicsHrM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = macroeconomicsHrM2; }
