// Računovodstvo (HR) — Final (završni ispit)
// Spaja HR M1 + M2 + examPractice. AUTORSKI IZ HR MATERIJALA kolegija (gradivo nositelja kolegija,
// studentske skripte i prikupljena ispitna pitanja s Drivea). MORA se učitati POSLIJE midterm-1/2.
// MODEL: kartice <200 znak, detalj u learn. Vjezbe (exercises) NISU dio ovih datoteka.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!

const accountingHrFinalExamPractice = {
  "name": "Vježba za ispit (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#f59e0b",
  "flashcards": [
    {
      "question": "ZAMKA: je li izdana mjenica imovina?",
      "answer": "Ne – izdana mjenica je obveza (pasiva). Primljena mjenica i primljeni ček su imovina.",
      "explanation": "Isto: izdani ček, izdane obveznice = obveze."
    },
    {
      "question": "ZAMKA: jesu li izdane dionice obveza?",
      "answer": "Ne – izdane dionice su kapital (upisani kapital). Kupljene dionice drugog društva su financijska imovina.",
      "explanation": "Izdane obveznice su dugoročna obveza."
    },
    {
      "question": "ZAMKA: je li sitni inventar stalna imovina?",
      "answer": "Ne – iako traje dulje od godine, zbog male pojedinačne vrijednosti iskazuje se među zalihama tekuće imovine.",
      "explanation": "Primjer: posteljina, pribor za jelo, uniforme."
    },
    {
      "question": "ZAMKA: je li primljeni predujam imovina?",
      "answer": "Ne – primljeni predujam je kratkoročna obveza. Dani predujam (za stroj, koncesiju) je aktiva.",
      "explanation": "Obveza da pružimo plaćenu uslugu."
    },
    {
      "question": "ZAMKA: ulazi li PDV u prihod?",
      "answer": "Ne – u RDG ulazi samo osnovica; PDV iz izlaznog računa je obveza (280), iz ulaznog potraživanje (180).",
      "explanation": "U novčanom toku PDV JEST dio primitka."
    },
    {
      "question": "ZAMKA: je li naplata potraživanja prihod?",
      "answer": "Ne – prihod je nastao prodajom; naplata je samo primitak i koncentrična promjena (A+A−).",
      "explanation": "Kupci P / žiro račun D."
    },
    {
      "question": "ZAMKA: mijenja li periferijska promjena zbroj bilance?",
      "answer": "Ne – mijenja samo strukturu pasive. Zbroj mijenjaju samo centripetalna i centrifugalna promjena.",
      "explanation": "Isto vrijedi za koncentričnu promjenu."
    },
    {
      "question": "ZAMKA: ima li konto rashoda početni saldo?",
      "answer": "Ne – konta uspjeha nemaju početni saldo; salda se na kraju razdoblja prenose na obračun rezultata.",
      "explanation": "Rashod duguje, prihod potražuje."
    },
    {
      "question": "ZAMKA: knjiži li se amortizacija na potražnu stranu konta zgrade?",
      "answer": "Ne – zgrada fizički ostaje u uporabi, pa se amortizacija knjiži na konto ispravka vrijednosti (029 P) uz trošak (431 D).",
      "explanation": "Nesamostalni (korektivni) konto."
    },
    {
      "question": "ZAMKA: je li kupnja opreme poslovni izdatak?",
      "answer": "Ne – kupnja opreme je izdatak iz investicijskih aktivnosti. Poslovni izdaci su plaće, dobavljači materijala, PDV.",
      "explanation": "Emisija dionica = financijski primitak."
    },
    {
      "question": "Koji par načela primjenjuje bilanca u RH?",
      "answer": "Aktiva po rastućoj likvidnosti (novac na kraju), pasiva po padajućoj ročnosti (kapital na početku).",
      "explanation": "SAD: padajuća likvidnost i rastuća ročnost."
    },
    {
      "question": "Kako se računa kapital, a kako ukupna pasiva?",
      "answer": "Kapital = imovina − obveze; ukupna pasiva = ukupna aktiva (obveze + kapital).",
      "explanation": "U zadacima pazi što se traži."
    },
    {
      "question": "Koja pravila vrijede za konto aktive i za konto pasive?",
      "answer": "Aktiva: PS i povećanje duguje, smanjenje i ZS potražuje. Pasiva: PS i povećanje potražuje, smanjenje i ZS duguje.",
      "explanation": "Rashodi kao aktiva, prihodi kao pasiva."
    },
    {
      "question": "Što obvezno navesti pri knjiženju u kolokviju?",
      "answer": "Broj i naziv konta, stranu (D ili P), iznos i vrstu bilančne promjene.",
      "explanation": "Npr. 310 Zaliha materijala D 12.000 / 220 Dobavljači P 12.000, A+P+."
    },
    {
      "question": "Utjecaj na RDG vs utjecaj na novčani tok – razlika u iznosu?",
      "answer": "Na RDG se navodi iznos bez PDV-a (prihod, rashod, trošak); na novčani tok iznos s PDV-om (primitak, izdatak).",
      "explanation": "Uz broj i naziv konta i dio izvještaja."
    },
    {
      "question": "Koje metode kalkulacije ne dijele troškove na direktne i opće?",
      "answer": "Djelidbene (divizijske) – ukupni trošak dijeli se količinom.",
      "explanation": "Dodatne (sumarna, elektivna) raspoređuju opće troškove ključem."
    },
    {
      "question": "Tko je Luca Pacioli i zašto je važan?",
      "answer": "Talijanski matematičar koji je 1494. u djelu Summa de arithmetica opisao dvojno knjigovodstvo.",
      "explanation": "Otac dvojnog knjigovodstva."
    },
    {
      "question": "Koje su najčešće pogreške u studentskim bilješkama?",
      "answer": "Povećanje pasive na dugovnoj strani, oba konta na istoj strani, LIFO opisan kao FIFO, zamijenjene metode otpisa sitnog inventara.",
      "explanation": "Popis ispravaka u learnu ove kategorije."
    }
  ],
  "quiz": [
    {
      "question": "Hotel je nabavio namirnice 4.000 + PDV 25 % na odgodu plaćanja. Koja je tvrdnja točna?",
      "options": [
        "Konto 310 Zaliha namirnica duguje 5.000",
        "Konto 220 Dobavljači potražuje 5.000",
        "Konto 280 Obveze za PDV potražuje 1.000",
        "Prihod iznosi 4.000"
      ],
      "correct": 1
    },
    {
      "question": "Hotelu je banka odobrila dugoročni kredit 50.000 na žiro račun. Knjiženje i promjena:",
      "options": [
        "952 Kredit kod banke D / 100 Žiro račun P – centrifugalna",
        "100 Žiro račun D / 252 Kratkoročni kredit P – periferijska",
        "100 Žiro račun D / 952 Kredit kod banke P – centripetalna",
        "952 Kredit kod banke D / 252 Kratkoročni kredit P – periferijska"
      ],
      "correct": 2
    },
    {
      "question": "Obveza prema dobavljaču 8.000 podmirena je novim dugoročnim kreditom. Koja se stavka NE mijenja?",
      "options": [
        "Konto 220 Dobavljači",
        "Konto 952 Kredit kod banke",
        "Struktura pasive",
        "Ukupni zbroj bilance"
      ],
      "correct": 3
    },
    {
      "question": "Konto 180 Potraživanja za PDV je:",
      "options": [
        "Konto stanja – aktive (razred 1)",
        "Konto stanja – pasive (razred 2)",
        "Konto uspjeha – prihoda (razred 7)",
        "Konto troška (razred 4)"
      ],
      "correct": 0
    },
    {
      "question": "Kupcima je fakturiran polupansion 20.000 + PDV 13 %. Iznos na dugovnoj strani konta 120 Kupci:",
      "options": [
        "20.000",
        "22.600",
        "25.000",
        "2.600"
      ],
      "correct": 1
    },
    {
      "question": "Isti primjer (polupansion 20.000 + PDV 13 %). Utjecaj na RDG:",
      "options": [
        "Poslovni prihod 22.600 (751), povećava rezultat",
        "Obveza 2.600 (280), smanjuje rezultat",
        "Poslovni prihod 20.000 (751), povećava rezultat",
        "Primitak 22.600 (100), povećava novčani tok"
      ],
      "correct": 2
    },
    {
      "question": "Kupci su kasnije platili tu fakturu (22.600) na žiro račun. Utjecaj na novčani tok:",
      "options": [
        "Primitak 20.000 iz financijskih aktivnosti",
        "Prihod 20.000 u RDG-u",
        "Nema utjecaja na novčani tok",
        "Primitak 22.600 iz poslovnih aktivnosti"
      ],
      "correct": 3
    },
    {
      "question": "Amortizacija opreme 60.000 po stopi 10 % godišnje – mjesečni iznos:",
      "options": [
        "500",
        "6.000",
        "600",
        "5.000"
      ],
      "correct": 0
    },
    {
      "question": "Oprema nabavne vrijednosti 60.000 amortizira se linearno 10 % godišnje. Sadašnja vrijednost nakon 4 godine:",
      "options": [
        "24.000",
        "36.000",
        "54.000",
        "40.000"
      ],
      "correct": 1
    },
    {
      "question": "Koji par konta sudjeluje u knjiženju obračunate amortizacije?",
      "options": [
        "431 Trošak amortizacije i 100 Žiro račun",
        "029 Ispravak vrijednosti i 220 Dobavljači",
        "431 Trošak amortizacije i 029 Ispravak vrijednosti",
        "400 Trošak materijala i 021 Oprema"
      ],
      "correct": 2
    },
    {
      "question": "Obračunate kamate na dani dugoročni kredit u RDG-u su:",
      "options": [
        "Poslovni prihod",
        "Financijski rashod",
        "Izvanredni prihod",
        "Financijski prihod"
      ],
      "correct": 3
    },
    {
      "question": "Na kontu 310 PS je 5.000, nabavljeno je 3.000, utrošeno 6.000. Zaključni saldo i strana na koju se upisuje:",
      "options": [
        "2.000 na potražnoj strani",
        "2.000 na dugovnoj strani",
        "8.000 na potražnoj strani",
        "14.000 na dugovnoj strani"
      ],
      "correct": 0
    },
    {
      "question": "Na kontu 220 Dobavljači PS je 12.000, nove obveze 9.000, plaćeno 15.000. Zaključni saldo:",
      "options": [
        "6.000, upisan na potražnu stranu",
        "6.000, upisan na dugovnu stranu",
        "36.000, upisan na dugovnu stranu",
        "18.000, upisan na potražnu stranu"
      ],
      "correct": 1
    },
    {
      "question": "Koja promjena mijenja i bilancu i račun dobiti i gubitka?",
      "options": [
        "Naplata potraživanja od kupaca",
        "Plaćanje dobavljaču sa žiro računa",
        "Utrošak materijala u kuhinji",
        "Pretvaranje kratkoročnog kredita u dugoročni"
      ],
      "correct": 2
    },
    {
      "question": "Koja promjena NE utječe na račun dobiti i gubitka?",
      "options": [
        "Obračun amortizacije",
        "Obračun kamate na kredit",
        "Fakturiranje usluge smještaja",
        "Isplata neto plaća sa žiro računa"
      ],
      "correct": 3
    },
    {
      "question": "Aktiva po padajućoj likvidnosti – točan redoslijed:",
      "options": [
        "Žiro račun, kupci, zalihe, oprema",
        "Oprema, zalihe, kupci, žiro račun",
        "Kupci, žiro račun, oprema, zalihe",
        "Zalihe, oprema, žiro račun, kupci"
      ],
      "correct": 0
    },
    {
      "question": "Imovina 500.000, kratkoročne obveze 60.000, dugoročne obveze 140.000. Kapital iznosi:",
      "options": [
        "360.000",
        "300.000",
        "200.000",
        "440.000"
      ],
      "correct": 1
    },
    {
      "question": "Zalihe: 50 kom po 10, pa nabava 50 kom po 14; izdano 60 kom. Utrošak po FIFO:",
      "options": [
        "720",
        "600",
        "640",
        "680"
      ],
      "correct": 2
    },
    {
      "question": "Isti podaci (50 × 10, 50 × 14, izdano 60). Utrošak po metodi prosječnih cijena:",
      "options": [
        "640",
        "680",
        "840",
        "720"
      ],
      "correct": 3
    },
    {
      "question": "Donacija hotela humanitarnoj udruzi 3.000 isplaćena sa žiro računa. Koja je tvrdnja točna?",
      "options": [
        "Izvanredni rashod 3.000 i izdatak 3.000",
        "Poslovni rashod 3.000 i primitak 3.000",
        "Financijski rashod 3.000, bez izdatka",
        "Nema utjecaja na rezultat"
      ],
      "correct": 0
    },
    {
      "question": "Najamnina poslovnog prostora 8.000 + PDV 25 % naplaćena je odmah. Koja je tvrdnja točna?",
      "options": [
        "Prihod 10.000, primitak 10.000, obveza za PDV 2.000",
        "Prihod 8.000, primitak 10.000, obveza za PDV 2.000",
        "Prihod 8.000, primitak 8.000, pretporez 2.000",
        "Prihod 10.000, primitak 8.000, obveza za PDV 2.000"
      ],
      "correct": 1
    },
    {
      "question": "Koja od tvrdnji o kontnom planu je točna?",
      "options": [
        "Troškovi po prirodnim vrstama su u razredu 7",
        "Kapital i dugoročne obveze su u razredu 2",
        "Konta aktive su u razredima 0, 1, 3 i 6",
        "Zalihe materijala su u razredu 6"
      ],
      "correct": 2
    }
  ],
  "fillBlanks": [
    {
      "sentence": "Izdani ček je _______ (imovina ili obveza?).",
      "answer": "obveza",
      "hint": "Primljeni ček je imovina."
    },
    {
      "sentence": "Periferijska promjena mijenja samo strukturu _______.",
      "answer": "pasive",
      "hint": "Zbroj ostaje isti."
    },
    {
      "sentence": "Koncentrična promjena mijenja samo strukturu _______.",
      "answer": "aktive",
      "hint": "Zbroj ostaje isti."
    },
    {
      "sentence": "Amortizacija se ne knjiži na konto imovine, nego na konto _______ vrijednosti.",
      "answer": "ispravka",
      "hint": "Konto 029."
    },
    {
      "sentence": "Prihod se u računu dobiti i gubitka iskazuje u visini _______ računa (iznos bez PDV-a).",
      "answer": "osnovice",
      "hint": "PDV je obveza prema državi."
    },
    {
      "sentence": "Kupnja opreme je izdatak iz _______ aktivnosti.",
      "answer": "investicijskih",
      "hint": "Ne poslovnih."
    },
    {
      "sentence": "Prva stavka pasive bilance u RH je _______.",
      "answer": "kapital",
      "hint": "Padajuća ročnost."
    },
    {
      "sentence": "Otac dvojnog knjigovodstva je Luca _______.",
      "answer": "Pacioli",
      "hint": "Summa de arithmetica, 1494."
    }
  ],
  "learn": {
    "title": "Međutematski pregled, zamke i ispravci izvora",
    "content":
      "<h3>Kako se povezuju teme</h3>" +
      "<table><tr><th>Poslovna promjena</th><th>Knjiženje</th><th>Bilanca</th><th>RDG</th><th>Novčani tok</th></tr>" +
      "<tr><td>Nabava namirnica 4.000 + PDV 1.000 na odgodu</td><td>310 D 4.000 · 180 D 1.000 · 220 P 5.000</td><td>A+P+ (5.000)</td><td>—</td><td>—</td></tr>" +
      "<tr><td>Utrošak namirnica u kuhinji 3.000</td><td>400 D / 310 P</td><td>A−P− uslijed rashoda</td><td>trošak → poslovni rashod</td><td>—</td></tr>" +
      "<tr><td>Fakturiran polupansion 20.000 + PDV 13 %</td><td>120 D 22.600 · 751 P 20.000 · 280 P 2.600</td><td>A+P+ uslijed prihoda</td><td>poslovni prihod 20.000</td><td>—</td></tr>" +
      "<tr><td>Kupci platili 22.600</td><td>100 D / 120 P</td><td>A+A−</td><td>—</td><td>poslovni primitak 22.600</td></tr>" +
      "<tr><td>Plaćeno dobavljaču 5.000</td><td>220 D / 100 P</td><td>A−P−</td><td>—</td><td>poslovni izdatak 5.000</td></tr>" +
      "<tr><td>Amortizacija 6.000</td><td>431 D / 029 P</td><td>A−P− uslijed rashoda</td><td>trošak → poslovni rashod</td><td>— (trošak bez izdatka)</td></tr>" +
      "<tr><td>Kupljena oprema 30.000 sa žiro računa</td><td>021 D / 100 P</td><td>A+A−</td><td>—</td><td>investicijski izdatak</td></tr>" +
      "<tr><td>Kamata na kredit 1.000</td><td>724 D / 952 P</td><td>P+P− uslijed rashoda</td><td>financijski rashod</td><td>— (dok se ne plati)</td></tr>" +
      "<tr><td>Emisija dionica 100.000 za novac</td><td>100 D / kapital P</td><td>A+P+</td><td>—</td><td>financijski primitak</td></tr>" +
      "<tr><td>Donacija 3.000 sa žiro računa</td><td>730 D / 100 P</td><td>A−P− uslijed rashoda</td><td>izvanredni rashod</td><td>izdatak 3.000</td></tr>" +
      "</table>" +
      "<div class=\"example-box\"><strong>Brzi izračuni iz kviza:</strong><br> • Kapital = 500.000 − (60.000 + 140.000) = <strong>300.000</strong>.<br> • Oprema 60.000, 10 % godišnje → 6.000 godišnje, <strong>500</strong> mjesečno; nakon 4 godine sadašnja vrijednost = 60.000 − 24.000 = <strong>36.000</strong>.<br> • Konto 310: 5.000 + 3.000 − 6.000 = <strong>2.000</strong> (ZS na potražnoj strani). Konto 220: 12.000 + 9.000 − 15.000 = <strong>6.000</strong> (ZS na dugovnoj strani).<br> • Zalihe 50 × 10 i 50 × 14, izdano 60: FIFO = 500 + 10 × 14 = <strong>640</strong>; prosjek = (500 + 700) / 100 = 12 → 60 × 12 = <strong>720</strong>.<br> • Najamnina 8.000 + 25 % = 10.000 naplaćeno → prihod 8.000, primitak 10.000, obveza za PDV 2.000.</div>" +
      "<h3>Najčešće zamke</h3>" +
      "<ul><li><strong>Izdano = obveza, primljeno = imovina</strong> (ček, mjenica); izdane dionice = kapital; kupljene dionice/obveznice = financijska imovina.</li><li><strong>Sitni inventar</strong> je zaliha (tekuća imovina), iako traje dulje od godine.</li><li><strong>Primljeni predujam</strong> je obveza; dani predujam je imovina.</li><li><strong>PDV</strong> nije prihod ni rashod: RDG bez PDV-a, novčani tok s PDV-om.</li><li><strong>Prihod ≠ primitak</strong>, <strong>trošak ≠ izdatak</strong>, <strong>trošak ≠ rashod</strong> (rashod je tržišno priznati trošak).</li><li><strong>Konta uspjeha nemaju početni saldo</strong>; zaključni saldo konta aktive upisuje se na potražnu, a konta pasive na dugovnu stranu.</li><li><strong>Ukupna pasiva = ukupna aktiva</strong> – nije isto što i kapital.</li><li><strong>Kupnja opreme</strong> je investicijski, a ne poslovni izdatak; <strong>emisija dionica i krediti</strong> su financijski primici.</li></ul>" +
      "<div class=\"warning-box\"><strong>Ispravci studentskih izvora (sažetak)</strong> – u ovom su predmetu napisani stručno ispravno: <ul><li>Na kontima pasive <strong>povećanje</strong> se knjiži na <strong>potražnu</strong> stranu; zaključni saldo dobavljača je na <strong>dugovnoj</strong> strani (skripta TC5).</li><li>Obračun kamate 4.000: 724 <strong>duguje</strong>, 952 potražuje (skripta TC7 navodi obje strane „potražuje”); povrat kredita 4.000: 952 <strong>duguje</strong>, 100 potražuje.</li><li>Ako se proda svih 20 obroka (CK 10), rashod = trošak = <strong>200</strong>, ne 400.</li><li>„Obveze po izdanim dionicama” nisu dugoročne obveze – izdane dionice su <strong>kapital</strong>; dugoročna obveza su izdane <strong>obveznice</strong>.</li><li>Primljeni predujam je <strong>obveza</strong>, ne tekuća imovina.</li><li>Sitni inventar je <strong>zaliha tekuće imovine</strong> (u gradivu je jednom omaškom napisano „stalne”).</li><li>Ukupna pasiva u zadatku „blagajna 20.000, dionice 50.000, zgrade 400.000…” je <strong>470.000</strong> (250.000 je kapital).</li><li>NT iz poslovnih aktivnosti u zadatku „primici 70.000, izdaci 46.500” je <strong>23.500</strong>, ne 27.500.</li><li>Primitak od naplate smještaja 10.000 + PDV 13 % je <strong>11.300</strong> (12.500 odgovara stopi 25 %).</li><li><strong>LIFO</strong> izlaz vrednuje po <strong>posljednjoj</strong> ulaznoj cijeni; metode otpisa sitnog inventara (100 % i 50 %) u bilješkama su zamijenjene.</li><li><strong>Progresivna</strong> amortizacija ne otpisuje imovinu prije isteka vijeka – brži početni otpis daje degresivna.</li><li>Umanjenje vrijednosti imovine <strong>tereti rashode</strong>, ne prihode; premija na dionice je <strong>uloženi</strong>, a ne zarađeni kapital.</li><li>Zastarjeli podaci: porez na dobit 35 % (danas 10 %/18 %), prag sitnog inventara 1.000 kn (danas 464,53 € za dugotrajnu imovinu), rokovi čuvanja 5/3/2 godine, doprinos za zapošljavanje i prirez; Direktiva o nefinancijskom izvještavanju je <strong>2014/95/EU</strong>.</li></ul>" +
      "</div>" +
      "<div class=\"warning-box\"><strong>Sporno u ispitnom ključu – zadržano uz napomenu:</strong> prodaja robe ili gotovih proizvoda kupcima u ključu je <strong>koncentrična</strong> promjena (roba → potraživanje); kad se prodaja knjiži preko prihoda i rashoda, riječ je o centripetalnoj promjeni uslijed prihoda i centrifugalnoj uslijed rashoda. Faktura za komunalne usluge s PDV-om u ključu je periferijska uslijed rashoda (za dio PDV-a strogo gledano centripetalna). Najstariji oblik konta: gradivo kolegija – <strong>po foliu</strong>; bilješke – stepenasti.</div>"
  }
};

const accountingHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.accountingHrM1) ? window.accountingHrM1 : {},
    (typeof window !== 'undefined' && window.accountingHrM2) ? window.accountingHrM2 : {},
    { examPractice: accountingHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.accountingHrFinal = accountingHrFinal; }
