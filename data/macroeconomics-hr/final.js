// Makroekonomija (HR) — Final (završni ispit)
// Spaja HR M1 + M2 + examPractice. AUTORSKI IZ HR MATERIJALA (predavanja/vježbe FMTU Opatija, Merlin, ljetni sem. 2025/26).
// examPractice = međutematska pitanja u stilu STVARNIH kolokvija iz „Priprema za 1.kolokvij” (T1–T5, primjeri 1–24)
// i „Priprema 2.kolokvij” (pitanja 1–32 + Aktivnost 2 zad. 1–5), uz „ppt - vjezba 5 Fiskalna politika” (zad. 2–3)
// i „Redovni Opatija uvodne informacije” (oblik i bodovanje kolokvija). MORA se učitati POSLIJE midterm-1/2.
// Pitanja s više točnih odgovora iz priprema pretvorena su u pitanja s JEDNIM točnim odgovorom (kviz miješa opcije).
// MODEL: kartice <200 znak, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX: inline "\\( … \\)", blok "\\[ … \\]"; NIKAD jedan dolar.
//   Decimalni zarez u formuli: 3{,}45 · postotak u formuli: \\%.

const macroeconomicsHrFinalExamPractice = {
  "name": "Vježba za kolokvije i ispit (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#f59e0b",
  "flashcards": [
    {
      "question": "Kako izgleda 1. kolokvij?",
      "answer": "Teorija i razumijevanje (24 %) + računski zadaci / Aktivnost 1 (3 %) u ISTOM testu. Oblici: više točnih odgovora (naveden broj), točno/netočno, otvorena pitanja. Kalkulator!",
      "explanation": "Gradivo: Predavanja 1–5 i pripadajuće vježbe."
    },
    {
      "question": "Kako izgleda 2. kolokvij?",
      "answer": "Kolokvij (24 %) + računski zadaci 2 (3 %) + esej (3 %) — pišu se zajedno; ukupno do 30 %.",
      "explanation": "Gradivo: Predavanja 6–11 (fiskalni modeli, monetarna, IS-LM, otvoreno gospodarstvo, tržište rada…)."
    },
    {
      "question": "Kako rješavati „odaberite N točnih odgovora”?",
      "answer": "Svaku tvrdnju provjeri zasebno kao točno/netočno: smjer (raste/pada), krivulja (AD/AS, IS/LM), zona ili jaz, ocjena (efikasno, pozitivno). Broj točnih služi kao kontrola.",
      "explanation": "Tvrdnje se često razlikuju samo jednom riječju („pozitivno” / „negativno”)."
    },
    {
      "question": "Postupak zadatka s BDP jazom (4 koraka)?",
      "answer": "1) izračunaj ravnotežni Y · 2) usporedi s Ymax (jaz, vrsta) · 3) izračunaj multiplikator · 4) potrebna promjena = jaz / multiplikator, uz smjer (povećati/smanjiti).",
      "explanation": "Recesijski → ekspanzivno, inflacijski → restriktivno."
    },
    {
      "question": "Realni BDP iz nominalnog — tri koraka?",
      "answer": "1) CPI kao indeks (rast 15 % → 115) · 2) rBDP = nBDP · 100 / CPI · 3) stopa rasta = (novi − stari) / stari · 100 i komentar kupovne moći.",
      "explanation": "U baznoj godini realni = nominalni."
    },
    {
      "question": "Predznaci u identitetima S − I = (G + TR − T) + NX?",
      "answer": "Budžetski deficit i trgovinski suficit su POZITIVNI; budžetski suficit i trgovinski deficit upisuju se s MINUSOM.",
      "explanation": "Suficit 80 → (G + TR − T) = −80."
    },
    {
      "question": "Ekspanzivne mjere — brzi popis?",
      "answer": "↑ G, ↓ Ta i t, ↑ TR, ↓ kamatnjak, ↑ ponuda novca, ↓ obvezna rezerva, deprecijacija, ↑ izvoz, ↓ uvoz, ↑ plaće i osobna potrošnja, ↑ investicije.",
      "explanation": "Pozitivne kod recesijskog jaza."
    },
    {
      "question": "Rast AD u tri zone krivulje AS?",
      "answer": "Keynesova: ↑ BDP, cijene iste (efikasno). Neoklasična: ↑ BDP i ↑ cijene (efikasno). Klasična: samo ↑ cijene, BDP isti (neefikasno).",
      "explanation": "Pad AD u klasičnoj zoni: padaju samo cijene (efikasno)."
    },
    {
      "question": "Četiri multiplikatora fiskalne politike (trosektorski model)?",
      "answer": "G i I: 1/(1 − β(1 − t)) · Ta: −β/(1 − β(1 − t)) · TR: β/(1 − β(1 − t)) · t: djeluje u smjeru autonomnih poreza.",
      "explanation": "Jedinična promjena G djeluje jače od jednake promjene TR ili Ta."
    },
    {
      "question": "L1 i L2 (potražnja za novcem)?",
      "answer": "L1 — transakcijska (poslovna) potražnja, rastuća funkcija dohotka. L2 — špekulativna, opadajuća funkcija kamatnjaka (rastuća funkcija inflacije). L = L1 + L2.",
      "explanation": "Ravnoteža novčanog tržišta: M/P = L1 + L2."
    },
    {
      "question": "Novčani i kreditni multiplikator?",
      "answer": "Novčani = 1/φ, kreditni = 1/φ − 1 (φ = stopa obvezne rezerve). Uz φ = 20 %: 5 i 4. Kreditni je uvijek manji.",
      "explanation": "Za ekspanziju se stopa obvezne rezerve smanjuje."
    },
    {
      "question": "Ekspanzivna monetarna politika — instrumenti središnje banke?",
      "answer": "Kupnja vrijednosnih papira na otvorenom tržištu, smanjenje diskontne (eskontne) stope i stope obvezne rezerve → više novca, niža kamatna stopa.",
      "explanation": "Restriktivna: prodaja obveznica, viša diskontna stopa i obvezna rezerva."
    },
    {
      "question": "Pomaci IS i LM krivulje?",
      "answer": "Ekspanzivna fiskalna (↑ G, ↓ T, ↑ autonomne investicije) → IS udesno. Ekspanzivna monetarna (↑ ponuda novca) → LM udesno.",
      "explanation": "Restriktivne mjere pomiču krivulje ulijevo."
    },
    {
      "question": "Tri najčešće zamke točno/netočno iz 1. kolokvija?",
      "answer": "„S = I vrijedi uvijek” — netočno · „porezi i transferi su budžetski prihodi” — netočno · „profiti korporacija dio su BDP-a po proizvodnoj metodi” — netočno (dohodovna).",
      "explanation": "„T − (G + TR) > 0 znači suficit” i „E − U > 0 znači suficit” su točne."
    }
  ],
  "quiz": [
    {
      "question": "Koja je tvrdnja o BDP-u točna?",
      "options": ["Što je BDP veći, to je bolja ekonomska situacija u zemlji", "BDP obuhvaća vrijednost finalne i intermedijarne proizvodnje", "BDP se definira u količinama proizvoda", "Što je BDP niži, to je bolja ekonomska situacija"],
      "correct": 0
    },
    {
      "question": "Ravnotežni BDP je 2 000 000, a potencijalni 2 500 000 EUR. Koja je tvrdnja točna?",
      "options": ["Negativno je povećati uvoz", "Potrebno je provoditi restriktivne mjere fiskalne politike", "Pozitivno je provoditi politiku smanjenja plaća", "Pozitivno je provoditi restriktivnu vanjskotrgovinsku politiku"],
      "correct": 0
    },
    {
      "question": "Zemlja ima recesijski BDP jaz. Što je poželjno?",
      "options": ["Imati vanjskotrgovinski suficit", "Imati vanjskotrgovinski deficit", "Smanjiti investicijsku aktivnost", "Smanjiti aktivnost privatnih poduzeća"],
      "correct": 0
    },
    {
      "question": "Smanji se realna novčana masa u zemlji. Koja je tvrdnja točna?",
      "options": ["AD ulijevo — pozitivno uz inflacijski BDP jaz", "AD udesno — pozitivno uz recesijski BDP jaz", "AD ulijevo — pozitivno uz recesijski BDP jaz", "AD udesno — pozitivno uz inflacijski BDP jaz"],
      "correct": 0
    },
    {
      "question": "Vlada provodi ekspanzivnu fiskalnu politiku. Koja je tvrdnja točna?",
      "options": ["AD udesno — pozitivno uz recesijski BDP jaz", "AD ulijevo — pozitivno uz recesijski BDP jaz", "AD udesno — pozitivno uz inflacijski BDP jaz", "AD ulijevo — pozitivno uz inflacijski BDP jaz"],
      "correct": 0
    },
    {
      "question": "Koja je od navedenih tvrdnji TOČNA?",
      "options": ["Kada je T − (G + TR) pozitivno, imamo budžetski suficit", "Model makroekonomske ravnoteže uvijek glasi S = I", "Porezi i transferi su budžetski prihodi", "Profiti korporacija čine dio BDP-a po proizvodnoj metodi"],
      "correct": 0
    },
    {
      "question": "CPI (2015 = 100) je 2017. iznosio 95,5, a nominalni BDP 2017. 400 mlrd EUR. Realni BDP 2017. i ocjena su:",
      "options": ["≈ 418,85 mlrd EUR — cijene pale 4,5 %, realni > nominalni", "382,00 mlrd EUR — cijene porasle 4,5 %, realni < nominalni", "400,00 mlrd EUR — cijene iste, realni = nominalni", "≈ 418,85 mlrd EUR — cijene porasle 4,5 %, realni > nominalni"],
      "correct": 0
    },
    {
      "question": "Stvarni BDP je 3 % ispod potencijalnog. Prema Okunovom pravilu i BDP jazu vrijedi:",
      "options": ["Nezaposlenost viša za oko 1,5 p. b.; recesijski jaz → ekspanzivne mjere", "Nezaposlenost viša za oko 6 p. b.; inflacijski jaz → restriktivne mjere", "Nezaposlenost niža za oko 1,5 p. b.; recesijski jaz → restriktivne mjere", "Nezaposlenost ista; jaz ne utječe na zaposlenost → nisu potrebne mjere"],
      "correct": 0
    },
    {
      "question": "C = 600, I = 150, G = 200, izvoz 300, uvoz 350 (mlrd EUR). BDP i vanjskotrgovinska bilanca su:",
      "options": ["BDP = 900; deficit 50", "BDP = 1 000; suficit 50", "BDP = 1 600; deficit 50", "BDP = 950; suficit 50"],
      "correct": 0
    },
    {
      "question": "Nominalna kamatna stopa na štednju je 5 %, a inflacija 5,5 %. Što se događa s kupovnom moći štednje?",
      "options": ["Realna stopa −0,5 % — kupovna moć se smanjuje", "Realna stopa 10,5 % — kupovna moć se povećava", "Realna stopa +0,5 % — kupovna moć se povećava", "Realna stopa 0,0 % — kupovna moć ostaje ista"],
      "correct": 0
    },
    {
      "question": "Koja je granična sklonost potrošnji povoljnija za rast BDP-a i zašto?",
      "options": ["0,9 — multiplikator je 10 (uz 0,6 samo 2,5)", "0,6 — multiplikator je veći", "0,6 — jer se više štedi", "Svejedno je jer multiplikator ne ovisi o sklonosti potrošnji"],
      "correct": 0
    },
    {
      "question": "Ravnoteža je u klasičnom dijelu AS i poveća se javna potrošnja. Kako to ocjenjujemo?",
      "options": ["AD udesno, rastu samo cijene — neefikasno", "AD udesno, raste BDP uz iste cijene — efikasno", "AD ulijevo, pada BDP uz iste cijene — neefikasno", "AS udesno, cijene padaju, BDP raste — efikasno"],
      "correct": 0
    },
    {
      "question": "β = 0,8, t = 25 %, recesijski jaz 400. Za koliko treba povećati javnu potrošnju?",
      "options": ["160", "400", "80", "1 000"],
      "correct": 0
    },
    {
      "question": "Ravnotežni proizvod 1 456,25, potencijalni 1 600, multiplikator 3,125. Što treba učiniti s investicijama?",
      "options": ["Povećati ih za 46 (recesijski jaz 143,75)", "Smanjiti ih za 46 (inflacijski jaz 143,75)", "Povećati ih za 143,75", "Povećati ih za 449,22"],
      "correct": 0
    },
    {
      "question": "Isti jaz (143,75), β = 0,8, t = 15 % — multiplikator transfera je 2,5. Koliko treba povećati transfere?",
      "options": ["57,5", "46", "143,75", "359,4"],
      "correct": 0
    },
    {
      "question": "Investicije su 300, štednja 450, budžetska potrošnja 250, porezi 380. Transferi u trosektorskom modelu iznose:",
      "options": ["280", "20", "130", "480"],
      "correct": 0
    },
    {
      "question": "β = 0,75, t = 20 %. Kako jedinična promjena pojedinog instrumenta djeluje na BDP?",
      "options": ["G: +2,5 · TR: +1,875 · Ta: −1,875", "G: +1,875 · TR: +2,5 · Ta: −2,5", "G: +2,5 · TR: +2,5 · Ta: −2,5", "G: +4,0 · TR: +3,0 · Ta: −3,0"],
      "correct": 0
    },
    {
      "question": "U modelu Y = C + I uz β = 0,8 multiplikator je 5. Uvede se porez na dohodak t = 25 %. Novi multiplikator je:",
      "options": ["2,5", "5,0", "3,75", "1,25"],
      "correct": 0
    },
    {
      "question": "Y = 2 000, t = 20 %, autonomni porezi 40, transferi 60. Raspoloživi dohodak je:",
      "options": ["1 620", "1 500", "1 660", "1 560"],
      "correct": 0
    },
    {
      "question": "Stopa obvezne rezerve je 12,5 %. Novčani i kreditni multiplikator iznose:",
      "options": ["8 i 7", "7 i 8", "12,5 i 11,5", "0,125 i 0,875"],
      "correct": 0
    },
    {
      "question": "Novi depozit od 2 000 ulazi u bankarski sustav uz obveznu rezervu 10 %. Najviše se može stvoriti:",
      "options": ["20 000 novca, od toga 18 000 kredita", "18 000 novca, od toga 20 000 kredita", "2 200 novca, od toga 200 kredita", "20 000 novca, od toga 2 000 kredita"],
      "correct": 0
    },
    {
      "question": "Recesijski jaz; središnja banka smanji stopu obvezne rezerve. Posljedica u AD–AS modelu (neoklasični dio AS) je:",
      "options": ["Kamatnjak pada, AD udesno — rastu BDP i cijene", "Kamatnjak raste, AD ulijevo — padaju BDP i cijene", "Kamatnjak pada, AS ulijevo — BDP pada, cijene rastu", "Kamatnjak raste, AD udesno — rastu BDP i cijene"],
      "correct": 0
    },
    {
      "question": "Ravnoteža je u klasičnom dijelu AS, a središnja banka povisi diskontnu stopu. Posljedica je:",
      "options": ["AD ulijevo; cijene padaju, BDP isti", "AD ulijevo; BDP pada, cijene iste", "AD udesno; cijene rastu, BDP isti", "AS ulijevo; BDP pada, cijene rastu"],
      "correct": 0
    },
    {
      "question": "Vlada poveća javnu potrošnju. Kako se to prikazuje u IS-LM modelu?",
      "options": ["Pomakom IS krivulje udesno", "Pomakom LM krivulje udesno", "Pomakom IS krivulje ulijevo", "Pomakom LM krivulje ulijevo"],
      "correct": 0
    },
    {
      "question": "Uvoz poraste, a izvoz ostane isti. Što se događa s neto izvozom i agregatnom potražnjom?",
      "options": ["Neto izvoz pada, AD se pomiče ulijevo", "Neto izvoz raste, AD se pomiče udesno", "Neto izvoz pada, AD se pomiče udesno", "Neto izvoz je isti, AD se ne mijenja"],
      "correct": 0
    },
    {
      "question": "Uvoz U = 50 + 0,2Y, izvoz 300, proizvodnja 1 200. Vanjskotrgovinska bilanca je:",
      "options": ["Suficit 10", "Deficit 10", "Suficit 250", "Deficit 240"],
      "correct": 0
    },
    {
      "question": "Autonomna potrošnja 100, granična sklonost potrošnji 0,8, investicije I = 200 − 10r (Y = C + I). Domaći proizvod uz kamatnjak 5 % je:",
      "options": ["1 250", "1 500", "1 000", "1 450"],
      "correct": 0
    },
    {
      "question": "L1 = 0,2Y, L2 = 100 − 25r, M/P = 400. Domaći proizvod na LM krivulji uz kamatnjak 4 % je:",
      "options": ["2 000", "1 500", "1 000", "2 500"],
      "correct": 0
    },
    {
      "question": "Robni izvoz 180, robni uvoz 240; strani turisti potroše 150, domaći u inozemstvu 40; prijevoz 60 / 50 (mlrd). Točno je:",
      "options": ["Robna −60 · putovanja +110 · usluge +120", "Robna +60 · putovanja +110 · usluge +120", "Robna −60 · putovanja −110 · usluge +10", "Robna −60 · putovanja +110 · usluge +170"],
      "correct": 0
    },
    {
      "question": "β = 0,8, t = 25 %. Vlada poveća javnu potrošnju za 50 i financira je zaduživanjem. BDP raste za:",
      "options": ["125", "50", "250", "62,5"],
      "correct": 0
    },
    {
      "question": "Porezi su zadani kao T = 0,25Y (bez autonomnih poreza). Elastičnost poreza na dohodak i vrsta poreza su:",
      "options": ["1 — proporcionalni porezi", "0,25 — degresivni porezi", "4 — progresivni porezi", "1,25 — progresivni porezi"],
      "correct": 0
    },
    {
      "question": "Nominalni BDP zemlje je 1 260 mlrd EUR, a CPI 112 (bazna godina = 100). Realni BDP je:",
      "options": ["1 125 mlrd EUR", "1 411 mlrd EUR", "1 260 mlrd EUR", "1 148 mlrd EUR"],
      "correct": 0
    },
    {
      "question": "Nominalni kamatnjak ostane 6 %, a očekivana inflacija poraste s 4 % na 5 %. Prema predavanju:",
      "options": ["Realni kamatnjak pada na 1 % — investicije rastu", "Realni kamatnjak raste na 11 % — investicije padaju", "Realni kamatnjak pada na 1 % — investicije padaju", "Realni kamatnjak ostaje 2 % — investicije iste"],
      "correct": 0
    },
    {
      "question": "Kako klasičari ocjenjuju ekspanzivnu monetarnu politiku?",
      "options": ["Mijenja samo razinu cijena, a ne output", "Povećava output dok postoje neiskorišteni resursi", "Mijenja samo output, a ne razinu cijena", "Smanjuje i output i razinu cijena"],
      "correct": 0
    },
    {
      "question": "Ekspanzivnom politikom smanji se recesijski jaz. Što prema Okunovu zakonu i Phillipsovoj krivulji slijedi?",
      "options": ["Nezaposlenost pada, a inflacija raste", "Nezaposlenost raste, a inflacija pada", "I nezaposlenost i inflacija padaju", "I nezaposlenost i inflacija rastu"],
      "correct": 0
    },
    {
      "question": "U recesijskom jazu vlada snizi poreznu stopu t. Što se događa s multiplikatorom i budžetskim saldom?",
      "options": ["Multiplikator raste, a budžetski saldo se pogoršava", "Multiplikator pada, a budžetski saldo se popravlja", "Multiplikator raste, a budžetski saldo se popravlja", "Multiplikator pada, a budžetski saldo se pogoršava"],
      "correct": 0
    },
    {
      "question": "Mnogo građana zemlje radi u inozemstvu i šalje zarađeni dohodak kući. Kakav je odnos BNP-a i BDP-a?",
      "options": ["BNP je veći od BDP-a", "BNP je manji od BDP-a", "BNP je jednak BDP-u", "BNP je jednak NDP-u"],
      "correct": 0
    },
    {
      "question": "Središnja banka prodaje obveznice. Kako to djeluje na odabir investicijskih projekata?",
      "options": ["Kamatnjak raste, SV projekata pada — investicije padaju", "Kamatnjak pada, SV projekata raste — investicije rastu", "Kamatnjak raste, SV projekata raste — investicije rastu", "Kamatnjak pada, SV projekata pada — investicije padaju"],
      "correct": 0
    },
    {
      "question": "Budžetski deficit je 100, trgovinski deficit 40, investicije 300. Štednja iznosi:",
      "options": ["360", "440", "240", "160"],
      "correct": 0
    }
  ],
  "fillBlanks": [
    {
      "sentence": "Potrebna promjena investicija za otklanjanje BDP jaza jednaka je jazu podijeljenom s _______.",
      "answer": "multiplikatorom",
      "hint": "ΔI = ΔY / m."
    },
    {
      "sentence": "Ako je G + TR − T negativno, država ima budžetski _______.",
      "answer": "suficit",
      "hint": "T > G + TR."
    },
    {
      "sentence": "U klasičnom dijelu AS rast AD povećava cijene, a BDP ostaje _______.",
      "answer": "isti",
      "hint": "Neefikasno."
    },
    {
      "sentence": "Uz graničnu sklonost potrošnji 0,8 i bez poreza multiplikator autonomne potrošnje iznosi _______.",
      "answer": "5",
      "hint": "1 / (1 − β); upišite cijeli broj."
    },
    {
      "sentence": "Ako realni BDP poraste s 1 000 na 1 050 mil. €, stopa gospodarskog rasta iznosi _______ %.",
      "answer": "5",
      "hint": "(Y₁ − Y₀) / Y₀ · 100; upišite cijeli broj."
    },
    {
      "sentence": "Transakcijska potražnja za novcem L1 je _______ funkcija dohotka.",
      "answer": "rastuća",
      "hint": "Veći dohodak → više transakcija."
    },
    {
      "sentence": "Kupnja obveznica od strane središnje banke dio je operacija na _______ tržištu.",
      "answer": "otvorenom",
      "hint": "Ekspanzivna monetarna politika."
    },
    {
      "sentence": "Ekspanzivna monetarna politika pomiče _______ krivulju udesno.",
      "answer": "LM",
      "hint": "IS-LM model."
    },
    {
      "sentence": "Ako je ravnotežni BDP 1000, a potencijalni 1200, u privredi je _______ jaz od 200.",
      "answer": "recesijski",
      "hint": "Y < Ymax."
    },
    {
      "sentence": "Uz stopu obvezne rezerve 25 % novčani multiplikator iznosi _______.",
      "answer": "4",
      "hint": "1 / 0,25."
    },
    {
      "sentence": "Raspoloživi dohodak uz Y = 1000, t = 10 %, Ta = 10 i TR = 20 iznosi _______.",
      "answer": "910",
      "hint": "Yd = Y − (Ta + tY) + TR."
    },
    {
      "sentence": "Na 1. kolokviju računski zadaci (Aktivnost 1) pišu se zajedno s kolokvijem, pa treba donijeti _______.",
      "answer": "kalkulator",
      "hint": "Priprema za 1. kolokvij, opće informacije."
    }
  ],
  "learn": {
    "title": "Vježba za kolokvije i ispit",
    "content":
      '<h3>Kako izgledaju kolokviji</h3>' +
      '<table><tr><th></th><th>1. kolokvij (01.04.)</th><th>2. kolokvij (20.05.)</th></tr>' +
      '<tr><td>Gradivo</td><td>Predavanja 1–5: temeljni pojmovi, nacionalno računovodstvo, AD–AS, potrošnja/štednja/investicije, uvod u fiskalnu politiku</td><td>Predavanja 6–11: fiskalna politika (modeli), monetarna makroekonomija, IS-LM, otvoreno gospodarstvo, tržište rada, krize, turizam</td></tr>' +
      '<tr><td>Bodovi</td><td>kolokvij 24 % + računski zadaci 1 / Aktivnost 1 3 %</td><td>kolokvij 24 % + računski zadaci 2 3 % + esej 3 % (ukupno do 30 %)</td></tr>' +
      '<tr><td>Napomena</td><td>računski zadaci pišu se u ISTOM testu — donesi kalkulator</td><td>esej traži ekonomsko povezivanje i zaključivanje (podaci RH i EU)</td></tr>' +
      '</table>' +
      '<p>Ukupno tijekom nastave 70 % (uz aktivnosti 9 % i seminarski rad 4 %), završni ispit 30 %. <strong>Oblici pitanja</strong> (moguće manje izmjene): odabir <strong>više točnih odgovora</strong> (naveden je broj točnih) · <strong>točno ili netočno</strong> · <strong>otvorena pitanja</strong> — prikazati pojavu grafikonom, objasniti pojam, navesti podjelu, riješiti izračun. „Za prvi kolokvij treba naučiti s razumijevanjem sav navedeni materijal.”</p>' +
      '<div class="warning-box"><strong>Završni ispit i Predavanje 13:</strong> „Osnove ekonomske misli i makroekonomske teorije” (Predavanje 13, 27.05.) predaje se POSLIJE 2. kolokvija i nije pridruženo nijednom kolokviju — može doći na završni ispit. Zasebnog materijala na Merlinu nema; ponovi odjeljak „Makroekonomske teorije i ravnoteža” u kategoriji „Agregatna potražnja, agregatna ponuda i AD–AS model” (klasičari, Say, Keynes, neoklasična doktrina, racionalna očekivanja, ekonomika ponude, nova keynesijanska ekonomija).</div>' +
      '<div class="tip-box"><strong>Strategija za „odaberite N točnih”:</strong> 1) za svaku tvrdnju odredi <em>smjer</em> (raste/pada), <em>krivulju</em> (AD, AS, IS, LM) i <em>okolnost</em> (vrsta jaza, zona AS); 2) označi T/N neovisno o ostalima; 3) tek na kraju provjeri odgovara li broj traženom. Tvrdnje se često razlikuju samo riječima „pozitivno/negativno”, „povećati/smanjiti”, „recesijski/inflacijski”.</div>' +

      '<h3>1. kolokvij — sve formule na jednom mjestu</h3>' +
      '<table><tr><th>Tema</th><th>Formula</th></tr>' +
      '<tr><td>Realni BDP</td><td>\\( rBDP_n = nBDP_n \\cdot \\frac{CPI_{baza}}{CPI_n} \\); deflator \\( = \\frac{CPI_n}{CPI_{baza}} \\); \\( nBDP = rBDP \\cdot \\text{deflator} \\)</td></tr>' +
      '<tr><td>Stopa rasta / inflacije</td><td>\\( \\frac{Y_t - Y_{t-1}}{Y_{t-1}} \\cdot 100 \\) · \\( \\frac{CPI_t - CPI_{t-1}}{CPI_{t-1}} \\cdot 100 \\)</td></tr>' +
      '<tr><td>BDP pc, udio</td><td>\\( \\frac{\\text{realni BDP}}{\\text{broj stanovnika}} \\) · \\( \\frac{\\text{dio}}{\\text{cjelina}} \\cdot 100 \\)</td></tr>' +
      '<tr><td>Nezaposlenost</td><td>\\( L = E + U \\); stopa \\( U/L \\); Okun: −2 % prema potencijalnom → +1 % nezaposlenosti</td></tr>' +
      '<tr><td>Realna kamata</td><td>\\( i_r = i - r_p \\)</td></tr>' +
      '<tr><td>Nacionalni računi</td><td>\\( Y = C + I + G + (E - U) \\) · BDP = ΣBDV + porezi na proizvode − subvencije · BNP = BDP + primici − isplate · NDP = BDP − amortizacija · NNP = BNP − amortizacija · NI = NNP − neizravni porezi</td></tr>' +
      '<tr><td>Identiteti</td><td>\\( S = I \\) (Y = C + I) · \\( S - I = G + TR - T \\) (Y = C + I + G) · \\( S - I = (G + TR - T) + NX \\) · \\( S + T + U = I + G + E \\)</td></tr>' +
      '<tr><td>Potrošnja i štednja</td><td>\\( C = \\alpha + \\beta Y \\); \\( S = -\\alpha + (1 - \\beta) Y \\); \\( \\varepsilon_{C,Y} = \\frac{\\beta}{C/Y} \\); \\( \\varepsilon_{S,Y} = \\frac{1 - \\beta}{S/Y} \\)</td></tr>' +
      '<tr><td>Multiplikator</td><td>\\( \\frac{1}{1 - \\beta} \\) (Y = C + I) · \\( \\frac{1}{1 - \\beta(1 - t)} \\) (Y = C + I + G) · \\( \\Delta I = \\frac{\\text{jaz}}{\\text{multiplikator}} \\)</td></tr>' +
      '<tr><td>Investicije</td><td>\\( SV = R_0 + \\sum \\frac{R_i}{(1+r)^i} - T \\), opravdano SV &gt; 0 · IRR: SV = 0 uz j; opravdano j &gt; r</td></tr>' +
      '<tr><td>Fiskalna politika</td><td>\\( B = T - (G + TR) \\) · \\( T = T_a + tY \\) · \\( E_{T,Y} = \\frac{t}{T/Y} \\) · \\( Y_d = Y - T + TR \\) · \\( C = \\alpha + \\beta Y_d \\)</td></tr>' +
      '</table>' +

      '<h3>Brzi računski primjeri (stil Aktivnosti 1)</h3>' +
      '<div class="example-box">• BDP 50 000 → 55 000 mlrd EUR, cijene +15 % → realni 2018. = 55 000 / 1,15 = <strong>47 826</strong> → standard realno pao<br>• BDP 25 000, indeks cijena 95 → realni = 25 000 / 0,95 = <strong>26 316</strong> &gt; nominalni<br>• CPI 100 → 95,5 → cijene −4,5 % (deflacija)<br>• Ravnotežni 2 000 000, potencijalni 3 000 000 → <strong>recesijski jaz 1 000 000</strong>, ekspanzivne mjere<br>• C = 150, G = 30, BDP = 300, suficit 100 → <strong>I = 20</strong> (6,67 % BDP-a)<br>• S = 750, budžetski deficit 150, VT suficit 50 → <strong>I = 550</strong><br>• C = 0,75Y + 150, I = 100 → Y = 1000; Ymax = 1500 → ΔI = <strong>+125</strong><br>• C = 10 + 0,9Y, I = 500 → Y = 5100; Ymax = 5500 → ΔI = <strong>+40</strong><br>• β = 0,9, t = 0,1 → multiplikator <strong>5,26</strong> (bez poreza 10)<br>• Y = 1000, t = 10 %, Ta = 10, TR = 20 → Yd = <strong>910</strong><br>• SV: 10 000 + 20 000/1,035 + 40 000/1,035² + 50 000/1,035³ − 100 000 = <strong>11 761 EUR</strong> → isplativo</div>' +

      '<h3>Točno ili netočno — tvrdnje s kolokvija</h3>' +
      '<ul>' +
      '<li>„BNP je BDP uvećan za primitke naših građana i tvrtki iz inozemstva i umanjen za isplate strancima.” — <strong>točno</strong>.</li>' +
      '<li>„Zemlja s velikim udjelom inozemnih ulaganja može očekivati BNP manji od BDP-a.” — <strong>točno</strong>.</li>' +
      '<li>„Profiti korporacija čine dio BDP-a po proizvodnoj metodi.” — <strong>netočno</strong> (dohodovna metoda).</li>' +
      '<li>„T − (G + TR) čini budžet; kad je pozitivno, imamo suficit.” — <strong>točno</strong>.</li>' +
      '<li>„E − U čini vanjskotrgovinsku bilancu; kad je pozitivno, imamo suficit.” — <strong>točno</strong>.</li>' +
      '<li>„Model makroekonomske ravnoteže uvijek glasi S = I.” — <strong>netočno</strong> (samo dvosektorski model).</li>' +
      '<li>„Porezi i transferi su budžetski prihodi.” — <strong>netočno</strong> (transferi su rashod).</li>' +
      '<li>„Promjena cijena na domaćem tržištu pomiče krivulju AD.” — <strong>netočno</strong> (kretanje duž AD).</li>' +
      '<li>„Povećanje cijene energije pomiče AS ulijevo i smanjuje BDP i blagostanje.” — <strong>točno</strong>.</li>' +
      '<li>„Pozitivno je da štednja raste brže od potrošnje.” — <strong>netočno</strong> (prema kolegiju pozitivan je brži rast potrošnje).</li>' +
      '<li>„Ako se kamatna stopa smanji s 4 % na 3 %, tržište je manje propulzivno i BDP se smanjuje.” — <strong>netočno</strong>.</li>' +
      '<li>„U recesijskom jazu ispravno je imati budžetski deficit.” — <strong>točno</strong> (ekspanzivna fiskalna politika).</li>' +
      '</ul>' +
      '<div class="warning-box"><strong>Poznate nedosljednosti u pripremama (ne daj se zbuniti):</strong> Primjer 22 traži 4 točna odgovora, a obranjive su tri tvrdnje; u Primjeru 5 jedan iznos piše „mlrd EUR”, a drugi „EUR” (jaz je svejedno 1 000 000); Priprema kaže da je rast cijena 3–5 % „pozitivan”, a predavanje da je optimalna inflacija 1–4 % (oko 2 %) — na pitanje o optimalnoj stopi odgovori prema predavanju.</div>' +

      '<h3>2. kolokvij — sažetak iz „Priprema 2.kolokvij”</h3>' +
      '<p>Detalji su u kategorijama 2. kolokvija; ovdje su samo pravila koja se najčešće provjeravaju.</p>' +
      '<table><tr><th>Tema</th><th>Pravilo</th></tr>' +
      '<tr><td>Fiskalni multiplikatori</td><td>\\( m_G = m_I = \\frac{1}{1 - \\beta(1 - t)} \\) · \\( m_{T_a} = \\frac{-\\beta}{1 - \\beta(1 - t)} \\) · \\( m_{TR} = \\frac{\\beta}{1 - \\beta(1 - t)} \\); porezna stopa djeluje u smjeru autonomnih poreza. \\( m_G \\) i \\( m_{T_a} \\) su suprotnog predznaka, \\( |m_G| &gt; |m_{T_a}| \\); jedinična promjena G jača je od promjene TR.</td></tr>' +
      '<tr><td>Dvosektorski vs trosektorski</td><td>multiplikator u modelu bez poreza je <strong>veći</strong>; uvođenje poreza smanjuje efikasnost i multiplikativne učinke</td></tr>' +
      '<tr><td>Elastičnost poreza</td><td>&gt; 1 progresivni, &lt; 1 degresivni; prema kolegiju poželjno što niža</td></tr>' +
      '<tr><td>Monetarna politika</td><td>ekspanzivna: veća ponuda novca, niža kamatna stopa, niža diskontna stopa i obvezna rezerva, središnja banka <strong>kupuje</strong> obveznice (operacije na otvorenom tržištu); restriktivna: obrnuto — prodaja obveznica snižava njihovu cijenu i podiže kamatnu stopu</td></tr>' +
      '<tr><td>Potražnja za novcem</td><td>\\( L = L_1 + L_2 \\); L1 transakcijska (rastuća funkcija dohotka), L2 špekulativna (opadajuća funkcija kamatnjaka, rastuća funkcija inflacije); ravnoteža \\( M/P = L_1 + L_2 \\)</td></tr>' +
      '<tr><td>Multiplikatori novca</td><td>novčani \\( 1/\\varphi \\), kreditni \\( 1/\\varphi - 1 \\) — kreditni je uvijek manji; φ = 20 % → 5 i 4 (1 000 depozita → 5 000 novca u sustavu)</td></tr>' +
      '<tr><td>IS-LM</td><td>ekspanzivna fiskalna → IS udesno; ekspanzivna monetarna → LM udesno; uvođenje G i poreza čini IS neelastičnijom (okomitijom); povećanje kamatnjaka = restriktivna monetarna politika</td></tr>' +
      '</table>' +
      '<div class="example-box"><strong>Aktivnost 2 — riješeni zadaci iz Pripreme 2:</strong><br>1) Trosektorski model (α = 100, β = 0,9, TR = 10, t = 10 %, Ta = 5, I = G = 100): Y = 1 602,63 · Yd = 1 447,37 · \\( m_G = 5{,}26 \\) · budžet T − (G + TR) = 165,26 − 110 = <strong>suficit 55,26</strong> · recesijski jaz 500 → transfere povećati za 500 / 4,74 = <strong>105,56</strong>.<br>2) \\( U = 100 + 0{,}1 \\cdot 1000 = 200 \\), E = 500 → \\( E - U = 300 \\) — <strong>suficit</strong>, izvozi se više nego uvozi (ekspanzivno za BDP).<br>3) \\( Y = 200 + 0{,}9Y + 120 - 20r \\) → \\( 0{,}1Y = 320 - 20r \\) → <strong>IS: Y = 3200 − 200r</strong>; uz r = 4: Y = 2 400.<br>4) \\( 260 = 0{,}1Y + 120 - 20r \\) → <strong>LM: Y = 1400 + 200r</strong>; uz r = 6: Y = 2 600.<br>5) Robna bilanca 250 − 320 = <strong>−70</strong> · putovanja 200 − 100 = <strong>+100</strong> · usluge (120 − 80) + 100 + 50 = <strong>+190</strong> · saldo robe i usluga −70 + 190 = <strong>+120</strong> · pokrivenost robnog uvoza izvozom 250/320 = 78,13 %, a usluga (120 + 200)/(80 + 100) = 177,78 % — zemlja deficit u robi pokriva suficitom u uslugama (tipično za turističke zemlje poput Hrvatske).</div>'
  }
};

const macroeconomicsHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.macroeconomicsHrM1) ? window.macroeconomicsHrM1 : {},
    (typeof window !== 'undefined' && window.macroeconomicsHrM2) ? window.macroeconomicsHrM2 : {},
    { examPractice: macroeconomicsHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.macroeconomicsHrFinal = macroeconomicsHrFinal; }
