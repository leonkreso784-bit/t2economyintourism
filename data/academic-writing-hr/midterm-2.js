// Osnove izrade pisanog djela (HR) — M2 (2. kolokvij)
// AUTORSKI IZ HR MATERIJALA (studentske skripte FMTU) — NE prijevod EN academic-writing.
// MODEL: kartice <200 znak, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// 2. kolokvij = PISANO DJELO: vrste pisanih djela, seminarski rad (stranice, dijelovi),
// dokumentacijska osnova i citat, bibliografske jedinice u Chicago stilu (bibliografski sustav).
// Primjeri bibliografskih jedinica preuzeti su iz ispitnih pitanja u skriptama; gdje su se
// skripte međusobno kosile (zarez ispred „i”), izjednačeno je prema predlošku skripte.

const academicWritingHrM2 = {
  "publicationTypes": {
    "name": "Vrste pisanih djela: znanstvena i stručna",
    "icon": "fa-layer-group",
    "color": "#6366f1",
    "flashcards": [
      {
        "question": "Kako se po namjeni i sadržaju klasificira znanstvena i stručna građa (publikacije)?",
        "answer": "Na primarne i sekundarne.",
        "explanation": "Primarne donose izvorne rezultate; sekundarne obrađuju i upućuju na primarne (npr. bibliografije, pregledi)."
      },
      {
        "question": "Na koje se četiri skupine dijele objavljena i neobjavljena pisana djela?",
        "answer": "Znanstvena, stručna, znanstveno-stručna i djela na visokim učilištima.",
        "explanation": "Ispitna zamka: podjela vrijedi za OBJAVLJENA I NEOBJAVLJENA djela, ne samo objavljena."
      },
      {
        "question": "Što je ZNANSTVENO DJELO?",
        "answer": "Djelo kojim se primjenom znanstvenih metoda otkrivaju i objavljuju dotad nepoznate činjenice i ideje te se prvi put ili na nov način objašnjavaju zakonitosti.",
        "explanation": "Ključno: NOVE činjenice i ideje + znanstvene metode."
      },
      {
        "question": "Koja djela spadaju u ZNANSTVENA djela?",
        "answer": "Monografije, znanstveni članci, izlaganja na znanstvenim skupovima, znanstveni projekti, rasprave i patenti.",
        "explanation": "Šest vrsta. Recenzije i meditacije NISU znanstvena nego stručna djela."
      },
      {
        "question": "Kako se grupiraju znanstveni članci prema znanstvenom doprinosu?",
        "answer": "Na izvorne (znanstvene) članke, prethodna priopćenja i pregledne članke.",
        "explanation": "Kriterij podjele je znanstveni DOPRINOS koji članak donosi."
      },
      {
        "question": "Što je STRUČNO DJELO?",
        "answer": "Djelo koje ne sadrži nova ili originalna znanstvena proučavanja i rezultate, nego obradu poznatih činjenica, pravilnosti, zakonitosti i odnosa.",
        "explanation": "Znanstveno = novo. Stručno = obrada poznatoga."
      },
      {
        "question": "Koja djela spadaju u STRUČNA djela?",
        "answer": "Stručni članci, stručni prikazi, stručni elaborati, stručne ekspertize, stručni izvještaji, meditacije i recenzije.",
        "explanation": "Sedam vrsta. Pet počinje riječju „stručni/stručne”, plus meditacije i recenzije."
      },
      {
        "question": "Koja je glavna razlika između znanstvenog i stručnog djela?",
        "answer": "Znanstveno otkriva i objavljuje dotad nepoznate činjenice i ideje; stručno obrađuje već poznate činjenice, pravilnosti i zakonitosti.",
        "explanation": "Oba koriste literaturu, ali samo znanstveno donosi originalan znanstveni doprinos."
      },
      {
        "question": "Jesu li recenzije znanstvena ili stručna djela?",
        "answer": "Stručna djela.",
        "explanation": "Česta ispitna zamka „izbacite uljeza” među monografijama, raspravama i patentima."
      },
      {
        "question": "Jesu li patenti znanstvena ili stručna djela?",
        "answer": "Znanstvena djela.",
        "explanation": "Patent donosi novo rješenje — zato je u istoj skupini kao monografija i znanstveni članak."
      },
      {
        "question": "Kamo spadaju meditacije?",
        "answer": "U stručna djela.",
        "explanation": "Ne u znanstvena ni u znanstveno-stručna — i to je česta zamka."
      }
    ],
    "quiz": [
      {
        "question": "Znanstvena i stručna građa, odnosno publikacije, po svojoj namjeni i sadržaju klasificiraju se na:",
        "options": [
          "Primarne i sekundarne",
          "Znanstvene i stručne",
          "Bibliografske i recentne",
          "Domaće i strane"
        ],
        "correct": 0
      },
      {
        "question": "Koja se pisana djela mogu podijeliti na znanstvena, stručna, znanstveno-stručna i djela na visokim učilištima?",
        "options": [
          "Objavljena pisana djela",
          "Znanstvena pisana djela",
          "Objavljena i neobjavljena pisana djela",
          "Domaća i strana pisana djela"
        ],
        "correct": 2
      },
      {
        "question": "Djelo kojim se primjenom znanstvenih metoda otkrivaju i objavljuju dotad nepoznate činjenice i ideje može se smatrati:",
        "options": [
          "Stručnim djelom",
          "Meditacijom",
          "Znanstvenim djelom",
          "Djelom na visokim učilištima"
        ],
        "correct": 2
      },
      {
        "question": "U znanstvena djela spadaju (izbacite uljeza):",
        "options": [
          "Monografije",
          "Rasprave",
          "Patenti",
          "Recenzije"
        ],
        "correct": 3
      },
      {
        "question": "Što od navedenog NE spada u znanstvena djela?",
        "options": [
          "Izlaganja na znanstvenim skupovima",
          "Znanstveni članci",
          "Etnografska zbirka",
          "Monografije"
        ],
        "correct": 2
      },
      {
        "question": "Znanstveni članci prema doprinosu koji donose mogu se grupirati u:",
        "options": [
          "Primarne, sekundarne i kombinirane",
          "Enciklopedijske, priručne i leksikografske članke",
          "Eksterne, interne i pregledne članke",
          "Izvorne, prethodna priopćenja i pregledne članke"
        ],
        "correct": 3
      },
      {
        "question": "Koji se članci prema doprinosu koji donose grupiraju u izvorne, prethodna priopćenja i pregledne članke?",
        "options": [
          "Novinski",
          "Enciklopedijski",
          "Znanstveni",
          "Stručni"
        ],
        "correct": 2
      },
      {
        "question": "Što se od navedenog NE ubraja u stručna djela?",
        "options": [
          "Stručni članci",
          "Meditacije",
          "Memoari",
          "Recenzije"
        ],
        "correct": 2
      },
      {
        "question": "Djelo koje ne sadrži nova znanstvena proučavanja, nego obradu poznatih činjenica, pravilnosti i zakonitosti, je:",
        "options": [
          "Znanstveno djelo",
          "Stručno djelo",
          "Patent",
          "Monografija"
        ],
        "correct": 1
      },
      {
        "question": "Stručna ekspertiza spada u:",
        "options": [
          "Znanstvena djela",
          "Stručna djela",
          "Znanstveno-stručna djela",
          "Djela na visokim učilištima"
        ],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Po namjeni i sadržaju znanstvene i stručne publikacije klasificiraju se na primarne i _______.",
        "answer": "sekundarne",
        "hint": "Par od primarnih…"
      },
      {
        "sentence": "Znanstveni članci dijele se na izvorne, prethodna _______ i pregledne članke.",
        "answer": "priopćenja",
        "hint": "Kratka najava rezultata…"
      },
      {
        "sentence": "Znanstvenim djelom otkrivaju se i objavljuju dotad _______ činjenice i ideje.",
        "answer": "nepoznate",
        "hint": "Nove, neotkrivene…"
      },
      {
        "sentence": "Stručno djelo sadrži obradu _______ činjenica, pravilnosti, zakonitosti i odnosa.",
        "answer": "poznatih",
        "hint": "Suprotno od novih…"
      },
      {
        "sentence": "U znanstvena djela spadaju monografije, znanstveni članci, izlaganja, projekti, rasprave i _______.",
        "answer": "patenti",
        "hint": "Zaštita izuma…"
      },
      {
        "sentence": "Recenzije i meditacije ubrajaju se u _______ djela.",
        "answer": "stručna",
        "hint": "Ne znanstvena…"
      },
      {
        "sentence": "Pisana djela dijele se na znanstvena, stručna, znanstveno-stručna i djela na visokim _______.",
        "answer": "učilištima",
        "hint": "Fakulteti, veleučilišta…"
      }
    ],
    "learn": {
      "title": "Vrste pisanih djela: znanstvena i stručna",
      "content": `
<h3>Dvije osnovne podjele</h3>
<div class="formula-box">
1. Po svojoj <strong>namjeni i sadržaju</strong> znanstvena i stručna građa (publikacije) klasificira se na <strong>primarne i sekundarne</strong>.<br>
2. <strong>Objavljena i neobjavljena</strong> pisana djela dijele se na: <strong>znanstvena · stručna · znanstveno-stručna · djela na visokim učilištima</strong>.
</div>
<p>Primarne publikacije donose izvorne rezultate (npr. izvorni znanstveni članak), a sekundarne sređuju i upućuju na primarne (npr. bibliografija, pregled literature). Skripta traži samo nazive te podjele.</p>

<h3>Znanstvena djela</h3>
<div class="formula-box"><strong>Znanstvenim djelom</strong> može se smatrati djelo kojim se, primjenom znanstvenih metoda i postupaka, otkrivaju i objavljuju <strong>dotad nepoznate činjenice i ideje</strong> i kojim se po prvi put ili na novi način objašnjavaju određene zakonitosti među predmetima i pojavama.</div>
<p>U znanstvena djela spadaju (6):</p>
<ul>
<li>monografije</li>
<li>znanstveni članci</li>
<li>izlaganja na znanstvenim skupovima</li>
<li>znanstveni projekti</li>
<li>rasprave</li>
<li>patenti</li>
</ul>
<p><strong>Znanstveni članci</strong> se prema znanstvenom doprinosu grupiraju u: <strong>izvorne članke, prethodna priopćenja i pregledne članke</strong>.</p>
<div class="example-box"><strong>Kako to izgleda u praksi:</strong> u hrvatskim časopisima (npr. na portalu Hrčak) uz svaki članak piše njegova kategorija — „Izvorni znanstveni članak”, „Prethodno priopćenje”, „Pregledni rad”, „Stručni rad”. Kad biraš literaturu za seminarski rad, ta oznaka ti govori koliko je izvor „jak”.</div>

<h3>Stručna djela</h3>
<div class="formula-box"><strong>Stručnim djelom</strong> može se smatrati ono djelo koje <strong>ne sadrži nova ili originalna</strong> znanstvena proučavanja i znanstvene rezultate, nego <strong>obradu poznatih</strong> činjenica, pravilnosti, zakonitosti i odnosa.</div>
<p>U stručna djela spadaju (7):</p>
<ul>
<li>stručni članci</li>
<li>stručni prikazi</li>
<li>stručni elaborati</li>
<li>stručne ekspertize</li>
<li>stručni izvještaji</li>
<li>meditacije</li>
<li>recenzije</li>
</ul>

<table>
<tr><th></th><th>Znanstveno djelo</th><th>Stručno djelo</th></tr>
<tr><td>Doprinos</td><td>dotad nepoznate činjenice i ideje</td><td>obrada poznatih činjenica</td></tr>
<tr><td>Primjeri</td><td>monografija, znanstveni članak, patent</td><td>stručni članak, elaborat, recenzija</td></tr>
</table>

<div class="warning-box"><strong>Zamke tipa „izbacite uljeza”:</strong>
<ul>
<li>Među znanstvenim djelima uljez je obično <strong>recenzija</strong> (stručno djelo) ili nešto izvan kategorija (etnografska zbirka, kratka priča).</li>
<li>Među stručnim djelima uljez je nešto što nije pisano stručno djelo (npr. <strong>memoari</strong>).</li>
<li><strong>Meditacije i recenzije</strong> zvuče „znanstveno”, ali su <strong>stručna</strong> djela.</li>
<li>Podjela na četiri skupine odnosi se na <strong>objavljena i neobjavljena</strong> djela, a ne samo na objavljena.</li>
</ul></div>
`
    }
  },

  "textbooksHandbooks": {
    "name": "Znanstveno-stručna djela: udžbenici, priručnici, knjiga i brošura",
    "icon": "fa-book",
    "color": "#10b981",
    "flashcards": [
      {
        "question": "Što su ZNANSTVENO-STRUČNA djela?",
        "answer": "Djela koja sadrže podjednaku količinu elemenata znanstvenoga i elemenata stručnoga djela.",
        "explanation": "Ključna riječ: PODJEDNAKU."
      },
      {
        "question": "Koja djela spadaju u znanstveno-stručna djela?",
        "answer": "Udžbenici, priručnici, zbornici radova i ostala djela.",
        "explanation": "„Ostala djela” su npr. esej, apologija, interpretacija, polemika."
      },
      {
        "question": "Koje publikacije spadaju u skupinu UDŽBENIKA?",
        "answer": "Knjiga, skripta, hrestomatija, zbirka zadataka i radna bilježnica.",
        "explanation": "Hrestomatija = zbirka odabranih tekstova. Dnevnik (prakse ili osobni) NIJE udžbenik."
      },
      {
        "question": "Što spada u PRIRUČNIKE?",
        "answer": "Enciklopedije, bibliografije, rječnici, leksikoni, praktikumi, godišnjaci i vodiči.",
        "explanation": "Priručnik služi za brzo snalaženje i pronalaženje podataka."
      },
      {
        "question": "Što je KNJIGA (prema skripti)?",
        "answer": "Neperiodična tiskana publikacija s najmanje 49 stranica (bez korica i naslovne stranice), povezanih zajedničkim hrptom.",
        "explanation": "Namijenjena je da kao cjelina služi čitanju ili proučavanju znanstvenog, praktičnog ili literarnog djela."
      },
      {
        "question": "Što je BROŠURA?",
        "answer": "Izdanje manjeg opsega, s najmanje 5, a najviše 48 stranica, odnosno s najviše tri tiskarska arka po 16 stranica.",
        "explanation": "3 arka × 16 stranica = 48 stranica. Knjiga počinje od 49."
      },
      {
        "question": "Koliko stranica najmanje ima knjiga, a koliko najviše brošura?",
        "answer": "Knjiga najmanje 49; brošura najviše 48 (a najmanje 5).",
        "explanation": "Granice se nastavljaju jedna na drugu: 5–48 brošura, 49+ knjiga."
      },
      {
        "question": "Koliko tiskarskih araka i stranica po arku najviše ima brošura?",
        "answer": "Najviše tri tiskarska arka po 16 stranica.",
        "explanation": "Tiskarski arak je list koji se nakon tiska savija u 16 stranica."
      },
      {
        "question": "Što se ne računa u 49 stranica knjige?",
        "answer": "Korice i naslovna stranica.",
        "explanation": "Stranice su povezane zajedničkim hrptom."
      },
      {
        "question": "Što je HRESTOMATIJA?",
        "answer": "Zbirka odabranih tekstova (izvadaka) za nastavu i učenje; spada u skupinu udžbenika.",
        "explanation": "U ispitnim pitanjima piše „hrestomatija (zbirka tekstova)”."
      },
      {
        "question": "Primjeri „ostalih djela” među znanstveno-stručnim djelima?",
        "answer": "Esej, apologija, interpretacija i polemika.",
        "explanation": "Navedeno u ispitnom pitanju uz „ostala djela”."
      }
    ],
    "quiz": [
      {
        "question": "Djela koja sadrže podjednaku količinu elemenata znanstvenog i stručnog djela su:",
        "options": [
          "Znanstvena djela",
          "Stručna djela",
          "Znanstveno-stručna djela",
          "Djela na visokim učilištima"
        ],
        "correct": 2
      },
      {
        "question": "Što od navedenog NE spada u znanstveno-stručna djela?",
        "options": [
          "Udžbenici",
          "Priručnici",
          "Zbornici radova",
          "Meditacije"
        ],
        "correct": 3
      },
      {
        "question": "U grupu udžbenika spadaju publikacije poput (izbaci uljeza):",
        "options": [
          "Knjige",
          "Skripte",
          "Hrestomatije (zbirke tekstova)",
          "Dnevnik prakse"
        ],
        "correct": 3
      },
      {
        "question": "Što je brošura?",
        "options": [
          "Izdanje manjeg opsega, s najmanje 5, a najviše 48 stranica, odnosno s najviše tri tiskarska arka po 16 stranica",
          "Izdanje većeg opsega, s najmanje 10, a najviše 96 stranica, odnosno s najviše tri tiskarska arka po 36 stranica",
          "Izdanje manjeg opsega, s najmanje 5, a najviše 21 stranicom, odnosno s najviše tri tiskarska arka po 7 stranica",
          "Izdanje manjeg opsega, s najmanje 15, a najviše 48 stranica"
        ],
        "correct": 0
      },
      {
        "question": "Knjiga je neperiodična tiskana publikacija s najmanje:",
        "options": [
          "48 stranica",
          "49 stranica",
          "64 stranice",
          "100 stranica"
        ],
        "correct": 1
      },
      {
        "question": "Što od navedenog spada u priručnike?",
        "options": [
          "Leksikon",
          "Monografija",
          "Patent",
          "Seminarski rad"
        ],
        "correct": 0
      },
      {
        "question": "Koji od navedenih NIJE priručnik?",
        "options": [
          "Enciklopedija",
          "Rječnik",
          "Godišnjak",
          "Hrestomatija"
        ],
        "correct": 3
      },
      {
        "question": "Publikacija od 36 stranica bez korica prema skripti je:",
        "options": [
          "Knjiga",
          "Brošura",
          "Monografija",
          "Zbornik"
        ],
        "correct": 1
      },
      {
        "question": "Zbornik radova spada u:",
        "options": [
          "Znanstveno-stručna djela",
          "Stručna djela",
          "Djela na visokim učilištima",
          "Priručnike"
        ],
        "correct": 0
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Knjiga je neperiodična tiskana publikacija s najmanje _______ stranica.",
        "answer": "49",
        "hint": "Jedna više od gornje granice brošure…"
      },
      {
        "sentence": "Brošura ima najmanje 5, a najviše _______ stranica.",
        "answer": "48",
        "hint": "3 arka × 16…"
      },
      {
        "sentence": "Brošura ima najviše tri tiskarska arka po _______ stranica.",
        "answer": "16",
        "hint": "Stranica po arku…"
      },
      {
        "sentence": "U skupinu udžbenika spadaju knjiga, skripta, _______, zbirka zadataka i radna bilježnica.",
        "answer": "hrestomatija",
        "hint": "Zbirka odabranih tekstova…"
      },
      {
        "sentence": "Znanstveno-stručna djela sadrže _______ količinu elemenata znanstvenog i stručnog djela.",
        "answer": "podjednaku",
        "hint": "Otprilike jednaku…"
      },
      {
        "sentence": "Stranice knjige povezane su zajedničkim _______.",
        "answer": "hrptom",
        "hint": "Leđa knjige…"
      },
      {
        "sentence": "U znanstveno-stručna djela spadaju udžbenici, priručnici, _______ radova i ostala djela.",
        "answer": "zbornici",
        "hint": "Zbirka radova sa skupa…"
      }
    ],
    "learn": {
      "title": "Znanstveno-stručna djela: udžbenici, priručnici, knjiga i brošura",
      "content": `
<h3>Znanstveno-stručna djela</h3>
<div class="formula-box"><strong>Znanstveno-stručna djela</strong> su djela koja sadrže <strong>podjednaku</strong> količinu elemenata znanstvenoga djela i elemenata stručnoga djela.</div>
<p>To su:</p>
<ul>
<li><strong>udžbenici</strong></li>
<li><strong>priručnici</strong></li>
<li><strong>zbornici radova</strong></li>
<li><strong>ostala djela</strong> (npr. esej, apologija, interpretacija, polemika)</li>
</ul>

<h3>Udžbenici</h3>
<p>U grupu udžbenika spadaju publikacije kao što su: <strong>knjiga, skripta, hrestomatija, zbirka zadataka i radna bilježnica</strong>.</p>
<div class="example-box"><strong>Hrestomatija</strong> = zbirka odabranih tekstova (izvadaka iz djela različitih autora) za nastavu. Npr. „Hrestomatija iz povijesti turizma”.</div>

<h3>Priručnici</h3>
<p>U priručnike spadaju: <strong>enciklopedije, bibliografije, rječnici, leksikoni, praktikumi, godišnjaci i vodiči</strong>.</p>

<h3>Knjiga i brošura</h3>
<div class="formula-box"><strong>Knjiga</strong> je neperiodična tiskana publikacija s <strong>najmanje 49 stranica</strong>, ne računajući korice i naslovnu stranicu, povezanih zajedničkim hrptom, s tekstom ili s tekstom i ilustracijama, s namjenom da kao cjelina služi čitanju ili proučavanju nekog znanstvenog, praktičnog ili literarnog (umjetničkog) djela.</div>
<div class="formula-box">Izdanje, odnosno edicija manjeg opsega, s <strong>najmanje 5, a najviše 48 stranica</strong>, odnosno s najviše <strong>tri tiskarska arka po 16 stranica</strong>, naziva se <strong>brošurom</strong>.</div>
<table>
<tr><th>Broj stranica</th><th>Vrsta</th></tr>
<tr><td>5 – 48 (najviše 3 arka × 16)</td><td>brošura</td></tr>
<tr><td>49 i više</td><td>knjiga</td></tr>
</table>
<div class="tip-box"><strong>Računica za pamćenje:</strong> 3 × 16 = 48 → brošura završava na 48, knjiga počinje na 49. Neperiodična = ne izlazi u redovitim razmacima (za razliku od časopisa).</div>

<div class="warning-box"><strong>Česte greške:</strong>
<ul>
<li>„Meditacije” među znanstveno-stručnim djelima — netočno, meditacije su <strong>stručna</strong> djela.</li>
<li>„Dnevnik prakse” ili „osobni dnevnik” kao udžbenik — netočno.</li>
<li>Distraktori za brošuru mijenjaju brojke (10–96, 5–21, 15–48, 36 stranica po arku) — zapamti <strong>5, 48, 3, 16</strong>.</li>
<li>Miješati udžbenike (knjiga, skripta, hrestomatija…) i priručnike (enciklopedija, rječnik, leksikon…).</li>
</ul></div>
`
    }
  },

  "universityWorks": {
    "name": "Djela na visokim učilištima i seminarski rad",
    "icon": "fa-building-columns",
    "color": "#0ea5e9",
    "flashcards": [
      {
        "question": "Što su DJELA NA VISOKIM UČILIŠTIMA?",
        "answer": "Pisana djela koja studenti, u skladu sa studijskim programom, izrađuju i brane tijekom studija ili nakon završetka određenog stupnja studija.",
        "explanation": "Četvrta skupina pisanih djela, uz znanstvena, stručna i znanstveno-stručna."
      },
      {
        "question": "Koja djela spadaju u djela na visokim učilištima?",
        "answer": "Programi, referati, seminarski radovi, završni i diplomski radovi, kritički prikazi, magistarski znanstveni radovi, doktorske disertacije i habilitacijski radovi.",
        "explanation": "Devet vrsta, otprilike od najjednostavnijeg prema najzahtjevnijem."
      },
      {
        "question": "Što je SEMINARSKI RAD?",
        "answer": "Samostalno pisano djelo u kojem student pokazuje teorijsko i praktičko znanje te sposobnost da uz domaću i stranu literaturu obradi zadanu ili odabranu stručnu temu.",
        "explanation": "Tema može biti izabrana samostalno, sugerirana ili zadana."
      },
      {
        "question": "Koje znanje student pokazuje u seminarskom radu?",
        "answer": "Praktičko i teorijsko znanje te osposobljenost za samostalno služenje aktualnom domaćom i stranom literaturom.",
        "explanation": "Literatura mora biti AKTUALNA, i domaća i strana."
      },
      {
        "question": "Koji su bitni elementi seminarskog rada?",
        "answer": "Naslov, sadržaj, popis ilustracija, predgovor (nije obvezan), uvod, osnovni tekst, zaključak, literatura i prilozi (ako postoje).",
        "explanation": "Devet elemenata. Neobvezni: predgovor; prilozi samo ako postoje."
      },
      {
        "question": "Koji element seminarskog rada NIJE obvezan?",
        "answer": "Predgovor.",
        "explanation": "Prilozi se stavljaju samo ako postoje."
      },
      {
        "question": "Kakvu stranicu ima seminarski rad na početku?",
        "answer": "Omotnu (vanjsku) i unutarnju stranicu.",
        "explanation": "Raspored podataka na obje stranice je u kategoriji Omotna i unutarnja stranica."
      },
      {
        "question": "Koliko ima bitnih elemenata seminarskog rada?",
        "answer": "Devet.",
        "explanation": "Naslov · sadržaj · popis ilustracija · predgovor · uvod · osnovni tekst · zaključak · literatura · prilozi."
      },
      {
        "question": "Tko bira temu seminarskog rada?",
        "answer": "Student je izabire sam, ili mu je sugerirana, odnosno zadana.",
        "explanation": "Tema je STRUČNA."
      },
      {
        "question": "Koje je najzahtjevnije djelo na visokim učilištima s popisa?",
        "answer": "Habilitacijski rad.",
        "explanation": "Popis završava doktorskom disertacijom i habilitacijskim radom."
      }
    ],
    "quiz": [
      {
        "question": "Programi, referati, seminarski, završni i diplomski radovi, kritički prikazi, magistarski radovi, disertacije i habilitacijski radovi spadaju u:",
        "options": [
          "Djela na visokim učilištima",
          "Znanstveno-stručna djela",
          "Stručna djela",
          "Znanstvena djela"
        ],
        "correct": 0
      },
      {
        "question": "Koji rad predstavlja samostalno pisano djelo u kojem student pokazuje praktičko i teorijsko znanje te uz aktualnu domaću i stranu literaturu obrađuje stručnu temu koju je izabrao sam ili mu je zadana?",
        "options": [
          "Završni rad",
          "Diplomski rad",
          "Seminarski rad",
          "Referat"
        ],
        "correct": 2
      },
      {
        "question": "Koji su svi bitni elementi seminarskog rada?",
        "options": [
          "Naslov, sadržaj, popis ilustracija, predgovor (nije obvezan), uvod, osnovni tekst, zaključak, literatura i prilozi (ako postoje)",
          "Naslov, sadržaj, predgovor (nije obvezan), uvod, osnovni tekst, zaključak, literatura i prilozi (ako postoje)",
          "Naslov, sadržaj, uvod, osnovni tekst, zaključak i literatura",
          "Sadržaj, uvod, osnovni tekst i zaključak"
        ],
        "correct": 0
      },
      {
        "question": "Koji element seminarskog rada nije obvezan?",
        "options": [
          "Uvod",
          "Predgovor",
          "Zaključak",
          "Literatura"
        ],
        "correct": 1
      },
      {
        "question": "Što od navedenog NE spada u djela na visokim učilištima?",
        "options": [
          "Kritički prikaz",
          "Referat",
          "Doktorska disertacija",
          "Stručna ekspertiza"
        ],
        "correct": 3
      },
      {
        "question": "Seminarski rad student obrađuje uz samostalno služenje:",
        "options": [
          "Isključivo domaćom literaturom",
          "Aktualnom domaćom i stranom literaturom",
          "Samo internetskim izvorima",
          "Samo bilješkama s predavanja"
        ],
        "correct": 1
      },
      {
        "question": "Prilozi se u seminarski rad stavljaju:",
        "options": [
          "Uvijek, obvezno",
          "Samo ako postoje",
          "Na početak rada, prije uvoda",
          "Nikada"
        ],
        "correct": 1
      },
      {
        "question": "Koliko stranica ima naslovni dio seminarskog rada?",
        "options": [
          "Samo omotnu stranicu",
          "Omotnu i unutarnju stranicu",
          "Samo unutarnju stranicu",
          "Tri naslovne stranice"
        ],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Seminarski rad je _______ pisano djelo u kojem student pokazuje teorijsko i praktičko znanje.",
        "answer": "samostalno",
        "hint": "Bez tuđe pomoći…"
      },
      {
        "sentence": "U seminarskom radu student se služi aktualnom domaćom i _______ literaturom.",
        "answer": "stranom",
        "hint": "Na drugim jezicima…"
      },
      {
        "sentence": "Predgovor je element seminarskog rada koji nije _______.",
        "answer": "obvezan",
        "hint": "Može se izostaviti…"
      },
      {
        "sentence": "Popis ilustracija sastavlja se ako se u radu nalazi _______ slika, tablica ili drugog grafičko-ilustrativnog materijala.",
        "answer": "više",
        "hint": "Ne samo jedna…"
      },
      {
        "sentence": "Najzahtjevnija djela na visokim učilištima su doktorske disertacije i _______ radovi.",
        "answer": "habilitacijski",
        "hint": "Za izbor u znanstveno-nastavno zvanje…"
      },
      {
        "sentence": "Seminarski rad ima omotnu i _______ stranicu.",
        "answer": "unutarnju",
        "hint": "Druga naslovna stranica…"
      },
      {
        "sentence": "U seminarskom radu student obrađuje _______ temu koju je izabrao sam ili mu je zadana.",
        "answer": "stručnu",
        "hint": "Iz struke…"
      }
    ],
    "learn": {
      "title": "Djela na visokim učilištima i seminarski rad",
      "content": `
<h3>Djela na visokim učilištima</h3>
<p>U skladu sa studijskim programom, tijekom studija ili nakon završetka određenog stupnja sveučilišnog studija, studenti izrađuju i brane razna pisana djela. To su:</p>
<ol>
<li>programi</li>
<li>referati</li>
<li>seminarski radovi</li>
<li>završni radovi</li>
<li>diplomski radovi</li>
<li>kritički prikazi</li>
<li>magistarski znanstveni radovi</li>
<li>doktorske disertacije</li>
<li>habilitacijski radovi</li>
</ol>

<h3>Seminarski rad</h3>
<div class="formula-box"><strong>Seminarski rad</strong> predstavlja <strong>samostalno pisano djelo</strong> u kojem student treba pokazati svoje <strong>praktičko i teorijsko znanje</strong>, te svoju osposobljenost da uz samostalno služenje <strong>aktualnom domaćom i stranom literaturom</strong> obradi stručnu temu koju je izabrao sam ili mu je sugerirana, odnosno zadana.</div>

<h4>Bitni elementi seminarskog rada (9)</h4>
<ol>
<li><strong>naslov</strong></li>
<li><strong>sadržaj</strong></li>
<li><strong>popis ilustracija</strong></li>
<li><strong>predgovor</strong> (nije obvezan)</li>
<li><strong>uvod</strong></li>
<li><strong>osnovni tekst</strong></li>
<li><strong>zaključak</strong></li>
<li><strong>literatura</strong></li>
<li><strong>prilozi</strong> (ako postoje)</li>
</ol>
<p>Rad ima <strong>omotnu i unutarnju stranicu</strong> (vidi sljedeću kategoriju).</p>

<div class="example-box"><strong>Kako izgleda kostur seminarskog rada (primjer, redoslijed po skripti):</strong><br>
Naslov: <em>Utjecaj online recenzija na odabir hotela u Opatiji</em><br>
SADRŽAJ (s brojevima stranica)<br>
POPIS ILUSTRACIJA<br>
PREDGOVOR (ako ga autor želi)<br>
1. UVOD<br>
2. POJAM I ZNAČAJ ONLINE RECENZIJA<br>
&nbsp;&nbsp;2.1. Razvoj platformi za recenzije<br>
&nbsp;&nbsp;2.2. Ponašanje gostiju pri rezervaciji<br>
3. ANALIZA RECENZIJA HOTELA U OPATIJI<br>
4. ZAKLJUČAK<br>
LITERATURA<br>
PRILOZI (ako postoje)<br>
<em>Poglavlja 2 i 3 čine osnovni tekst.</em></div>

<div class="warning-box"><strong>Česte greške na ispitu:</strong>
<ul>
<li>Na pitanje o svim bitnim elementima ponuđeni su i nepotpuni popisi (bez popisa ilustracija, bez osnovnog teksta, samo „uvod, zaključak i literatura”) — točan je <strong>jedini potpuni popis s napomenama „nije obvezan” i „ako postoje”</strong>.</li>
<li>Seminarski rad miješati sa završnim ili diplomskim radom — dugu definiciju s „aktualnom domaćom i stranom literaturom” skripta daje za <strong>seminarski rad</strong>.</li>
<li>Stručnu ekspertizu staviti među djela na visokim učilištima — ona je stručno djelo.</li>
</ul></div>
`
    }
  },

  "titlePages": {
    "name": "Omotna i unutarnja stranica",
    "icon": "fa-file-lines",
    "color": "#f59e0b",
    "flashcards": [
      {
        "question": "Što se nalazi u SREDINI GORNJEG dijela OMOTNE stranice?",
        "answer": "Naziv i sjedište sveučilišta, ispod toga naziv i sjedište odjela ili fakulteta, a u sljedećem retku naziv studija.",
        "explanation": "Ustanova ide gore — od najveće (sveučilište) prema najmanjoj (studij)."
      },
      {
        "question": "Što se nalazi u SREDINI POVIŠENOG SREDNJEG dijela OMOTNE stranice?",
        "answer": "Jedno ispod drugoga: ime i prezime studenta, naslov djela i naznaka da se radi o seminarskom radu.",
        "explanation": "Na omotnoj stranici ime studenta stoji IZNAD naslova, u sredini."
      },
      {
        "question": "Što se nalazi u SREDINI DONJEG dijela OMOTNE stranice?",
        "answer": "Mjesto odjela ili fakulteta i godina izrade rada.",
        "explanation": "Na omotnoj samo GODINA; na unutarnjoj MJESEC i godina."
      },
      {
        "question": "Što se nalazi u SREDINI GORNJEG dijela UNUTARNJE stranice?",
        "answer": "Naziv i sjedište sveučilišta, naziv i sjedište odjela ili fakulteta te naziv i SMJER studija.",
        "explanation": "Razlika od omotne: na unutarnjoj se dodaje SMJER studija."
      },
      {
        "question": "Što se nalazi u SREDINI POVIŠENOG SREDNJEG dijela UNUTARNJE stranice?",
        "answer": "Naslov djela, a ispod toga naznaka da se radi o seminarskom radu.",
        "explanation": "Na unutarnjoj NEMA imena studenta u sredini — ono je dolje desno."
      },
      {
        "question": "Što je u POVIŠENOM DONJEM dijelu S LIJEVE strane unutarnje stranice?",
        "answer": "Jedno ispod drugoga: naziv kolegija (puni naziv) i mentor (ime, prezime, znanstveno-nastavno zvanje i akademski stupanj).",
        "explanation": "Lijevo = kolegij i mentor."
      },
      {
        "question": "Što je u POVIŠENOM DONJEM dijelu S DESNE strane unutarnje stranice?",
        "answer": "Jedno ispod drugoga: student (ime i prezime) i matični broj (broj indeksa).",
        "explanation": "Desno = student i matični broj."
      },
      {
        "question": "Što se nalazi u SREDINI DONJEG dijela UNUTARNJE stranice?",
        "answer": "Mjesto odjela ili fakulteta, mjesec i godina izrade seminarskog rada.",
        "explanation": "Na unutarnjoj se dodaje MJESEC."
      },
      {
        "question": "Koji se podaci navode na UNUTARNJOJ stranici, a nema ih na omotnoj?",
        "answer": "Smjer studija, naziv kolegija, mentor, matični broj studenta i mjesec izrade.",
        "explanation": "Unutarnja stranica je detaljnija."
      },
      {
        "question": "Gdje se na unutarnjoj stranici nalaze ime i prezime studenta te matični broj?",
        "answer": "U povišenom donjem dijelu s desne strane, jedno ispod drugoga.",
        "explanation": "Česta ispitna zamka — ne u sredini kao na omotnoj."
      },
      {
        "question": "Što se o mentoru navodi na unutarnjoj stranici?",
        "answer": "Ime i prezime mentora te njegovo znanstveno-nastavno zvanje i akademski stupanj.",
        "explanation": "Npr. „izv. prof. dr. sc. Ime Prezime”."
      }
    ],
    "quiz": [
      {
        "question": "Što se navodi na omotnoj (vanjskoj) stranici seminarskog rada?",
        "options": [
          "Naziv i sjedište sveučilišta, fakulteta, naziv studija, ime i prezime studenta, naslov djela, naznaka da je seminarski rad, mjesto fakulteta i godina izrade",
          "Isto kao gore, uz naziv smjera te mjesec i godinu izrade rada",
          "Isto kao gore, uz naziv kolegija te ime i prezime mentora",
          "Isto kao gore, uz naziv kolegija, mentora i matični broj studenta"
        ],
        "correct": 0
      },
      {
        "question": "Na omotnoj stranici naziv i sjedište sveučilišta, fakulteta i naziv studija nalaze se:",
        "options": [
          "U sredini gornjeg dijela",
          "U sredini povišenog srednjeg dijela",
          "U sredini donjeg dijela",
          "U povišenom donjem dijelu s desne strane"
        ],
        "correct": 0
      },
      {
        "question": "Na omotnoj stranici ime i prezime studenta, naslov djela i naznaka da se radi o seminarskom radu nalaze se:",
        "options": [
          "U sredini gornjeg dijela",
          "U sredini povišenog srednjeg dijela",
          "U sredini donjeg dijela",
          "U povišenom donjem dijelu s lijeve strane"
        ],
        "correct": 1
      },
      {
        "question": "Na unutarnjoj stranici matični broj te ime i prezime studenta nalaze se:",
        "options": [
          "U sredini gornjeg dijela",
          "U sredini povišenog srednjeg dijela",
          "U povišenom donjem dijelu s lijeve strane",
          "U povišenom donjem dijelu s desne strane"
        ],
        "correct": 3
      },
      {
        "question": "Na unutarnjoj stranici naziv kolegija i mentor nalaze se:",
        "options": [
          "U povišenom donjem dijelu s lijeve strane",
          "U povišenom donjem dijelu s desne strane",
          "U sredini gornjeg dijela",
          "U sredini donjeg dijela"
        ],
        "correct": 0
      },
      {
        "question": "Koji se podatak navodi u sredini donjeg dijela UNUTARNJE, ali ne i OMOTNE stranice?",
        "options": [
          "Mjesto fakulteta",
          "Godina izrade",
          "Mjesec izrade",
          "Naslov djela"
        ],
        "correct": 2
      },
      {
        "question": "Koji se podatak dodaje u gornjem dijelu unutarnje stranice u odnosu na omotnu?",
        "options": [
          "Smjer studija",
          "Ime studenta",
          "Naslov djela",
          "Godina izrade"
        ],
        "correct": 0
      },
      {
        "question": "Koja je tvrdnja o omotnoj stranici ISPRAVNA?",
        "options": [
          "U sredini donjeg dijela je naziv i sjedište sveučilišta",
          "U sredini gornjeg dijela je ime i prezime studenta",
          "U sredini povišenog srednjeg dijela je mjesto fakulteta i godina",
          "U sredini gornjeg dijela je naziv i sjedište sveučilišta, fakulteta i naziv studija"
        ],
        "correct": 3
      },
      {
        "question": "Na kojoj se stranici NE navodi ime studenta u sredini povišenog srednjeg dijela?",
        "options": [
          "Na omotnoj",
          "Na unutarnjoj",
          "Ni na jednoj — uvijek je u sredini",
          "Na obje"
        ],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Na omotnoj stranici u sredini donjeg dijela navodi se mjesto fakulteta i _______ izrade rada.",
        "answer": "godina",
        "hint": "Samo ona, bez mjeseca…"
      },
      {
        "sentence": "Na unutarnjoj stranici u povišenom donjem dijelu s desne strane su student i _______ broj.",
        "answer": "matični",
        "hint": "Broj indeksa…"
      },
      {
        "sentence": "Na unutarnjoj stranici u gornjem dijelu navodi se naziv i _______ studija.",
        "answer": "smjer",
        "hint": "Npr. Hotelijerstvo…"
      },
      {
        "sentence": "Na unutarnjoj stranici s lijeve strane navode se naziv kolegija i _______.",
        "answer": "mentor",
        "hint": "Nastavnik koji vodi rad…"
      },
      {
        "sentence": "Omotna stranica naziva se još i _______ stranica.",
        "answer": "vanjska",
        "hint": "Suprotno od unutarnje…"
      },
      {
        "sentence": "Uz mentora se navodi njegovo znanstveno-nastavno zvanje i akademski _______.",
        "answer": "stupanj",
        "hint": "Npr. dr. sc.…"
      },
      {
        "sentence": "Na unutarnjoj stranici u sredini donjeg dijela navodi se mjesto fakulteta te _______ i godina izrade.",
        "answer": "mjesec",
        "hint": "Npr. siječanj…"
      }
    ],
    "learn": {
      "title": "Omotna i unutarnja stranica",
      "content": `
<p>Seminarski rad ima <strong>omotnu (vanjsku)</strong> i <strong>unutarnju</strong> stranicu. Na ispitu se pita <em>što</em> se nalazi na kojoj stranici i <em>gdje</em> točno. Najlakše je zamisliti stranicu podijeljenu na zone.</p>

<h3>Omotna (vanjska) stranica</h3>
<table>
<tr><th>Položaj</th><th>Sadržaj</th></tr>
<tr><td>u sredini <strong>gornjeg</strong> dijela</td><td>naziv i sjedište sveučilišta<br>naziv i sjedište odjela ili fakulteta<br>naziv studija</td></tr>
<tr><td>u sredini <strong>povišenog srednjeg</strong> dijela, jedno ispod drugoga</td><td>ime i prezime studenta<br>naslov djela<br>naznaka da se radi o seminarskom radu</td></tr>
<tr><td>u sredini <strong>donjeg</strong> dijela</td><td>mjesto odjela ili fakulteta i <strong>godina</strong> izrade rada</td></tr>
</table>

<div class="example-box">
<strong>SVEUČILIŠTE U RIJECI</strong><br>
FAKULTET ZA MENADŽMENT U TURIZMU I UGOSTITELJSTVU, OPATIJA<br>
Sveučilišni prijediplomski studij<br><br><br>
Ime Prezime<br>
<strong>UTJECAJ ONLINE RECENZIJA NA ODABIR HOTELA U OPATIJI</strong><br>
Seminarski rad<br><br><br>
Opatija, 2026.
</div>

<h3>Unutarnja stranica</h3>
<table>
<tr><th>Položaj</th><th>Sadržaj</th></tr>
<tr><td>u sredini <strong>gornjeg</strong> dijela</td><td>naziv i sjedište sveučilišta<br>naziv i sjedište odjela ili fakulteta<br>naziv i <strong>smjer</strong> studija</td></tr>
<tr><td>u sredini <strong>povišenog srednjeg</strong> dijela</td><td>naslov djela<br>naznaka da se radi o seminarskom radu</td></tr>
<tr><td>u <strong>povišenom donjem</strong> dijelu <strong>s lijeve</strong> strane, jedno ispod drugoga</td><td><strong>naziv kolegija</strong> — puni naziv kolegija<br><strong>mentor</strong> — ime i prezime, znanstveno-nastavno zvanje i akademski stupanj</td></tr>
<tr><td>u <strong>povišenom donjem</strong> dijelu <strong>s desne</strong> strane, jedno ispod drugoga</td><td><strong>student</strong> — ime i prezime<br><strong>matični broj</strong> — broj indeksa</td></tr>
<tr><td>u sredini <strong>donjeg</strong> dijela</td><td>mjesto odjela ili fakulteta, <strong>mjesec i godina</strong> izrade seminarskog rada</td></tr>
</table>

<div class="example-box">
<div><strong>SVEUČILIŠTE U RIJECI</strong><br>FAKULTET ZA MENADŽMENT U TURIZMU I UGOSTITELJSTVU, OPATIJA<br>Sveučilišni prijediplomski studij, smjer Menadžment u hotelijerstvu<br><br><strong>UTJECAJ ONLINE RECENZIJA NA ODABIR HOTELA U OPATIJI</strong><br>Seminarski rad</div><br>
<table><tr><td>Kolegij: Osnove izrade pisanog djela<br>Mentor: izv. prof. dr. sc. Ime Prezime</td><td>Student: Ime Prezime<br>Matični broj: 12345</td></tr></table>
<div>Opatija, listopad 2026.</div>
<p><em>Nazivi studija i smjera ovdje su ilustrativni — prepiši točne nazive sa svog indeksa.</em></p>
</div>

<div class="tip-box"><strong>Razlike omotna → unutarnja (zapamti 4):</strong>
<ol>
<li>gore se dodaje <strong>smjer</strong> studija;</li>
<li>ime studenta <strong>seli iz sredine dolje desno</strong> (uz matični broj);</li>
<li>dolje lijevo dolaze <strong>kolegij i mentor</strong>;</li>
<li>uz godinu dolazi i <strong>mjesec</strong> izrade.</li>
</ol>
Mnemonik za dno unutarnje stranice: <strong>lijevo = „tko me vodi”</strong> (kolegij, mentor), <strong>desno = „tko sam ja”</strong> (student, matični broj).</div>

<div class="warning-box"><strong>Česte greške:</strong>
<ul>
<li>Staviti naziv kolegija, mentora ili matični broj na <strong>omotnu</strong> stranicu — oni su samo na unutarnjoj.</li>
<li>Na omotnoj navesti mjesec — na omotnoj je samo <strong>godina</strong>.</li>
<li>Zamijeniti „sredinu povišenog srednjeg dijela” i „sredinu gornjeg dijela”.</li>
</ul></div>
`
    }
  },

  "paperStructure": {
    "name": "Dijelovi rada: od naslova do zaključka",
    "icon": "fa-list-ol",
    "color": "#8b5cf6",
    "flashcards": [
      {
        "question": "Što odražava NASLOV i kakav mora biti?",
        "answer": "Odražava osnovni sadržaj pisanog djela i mora biti sažet, aktualan i privlačan.",
        "explanation": "Tri pridjeva: SAŽET, AKTUALAN, PRIVLAČAN."
      },
      {
        "question": "Koji su dodatni zahtjevi za naslov seminarskog rada?",
        "answer": "Kratak i što potpuniji, bez skraćenica, da reprezentira tekst djela te točno i jasno opisuje sadržaj djela.",
        "explanation": "Npr. ne „Utjecaj OTA na HR hotele”, nego bez kratica."
      },
      {
        "question": "Čemu služi SADRŽAJ (kazalo) rada?",
        "answer": "Ukazuje čitatelju na logičnost izlaganja, strukturu i kompoziciju djela te hijerarhijski odnos dijelova, s naznakom stranica.",
        "explanation": "Sadržaj = kazalo. Obavezno s brojevima stranica."
      },
      {
        "question": "Kada se sastavlja POPIS ILUSTRACIJA?",
        "answer": "Ako se u radu nalazi više slika, tablica ili drugog grafičko-ilustrativnog materijala koji služi kao dopuna, primjer ili objašnjenje uz tekst.",
        "explanation": "Jedna usamljena tablica ne traži popis; više ilustracija da."
      },
      {
        "question": "U kojem se obliku ilustracije najčešće pojavljuju?",
        "answer": "Kao tablice i kao slike.",
        "explanation": "Ispitna zamka: ne „tablice i grafikoni” ni „tablice i fotografije”."
      },
      {
        "question": "Čime se opremaju i obilježavaju ilustracije?",
        "answer": "Naslovom, rednim brojem, legendom, naznakom izvora podataka i eventualno napomenom.",
        "explanation": "Napomena je EVENTUALNA (neobvezna), ne obavezna."
      },
      {
        "question": "Što se radi u UVODU seminarskog rada?",
        "answer": "Precizira se tema, navode se primijenjene znanstvene metode, obrazlaže svrha rada i navodi kompozicija rada (uz eventualni osobni stav).",
        "explanation": "U uvodu se NE ocjenjuju rezultati dosadašnjih istraživanja — to je uljez u ispitnom pitanju."
      },
      {
        "question": "Što je OSNOVNI TEKST i što se u njemu radi?",
        "answer": "Glavni dio rada: iznosi se povijest problema, dosadašnje spoznaje, vlastite i druge spoznaje koje dokazuju hipoteze te prijedlozi mjera.",
        "explanation": "Sve uz primjenu stručnih i/ili znanstvenoistraživačkih metoda."
      },
      {
        "question": "Što se sažeto donosi u ZAKLJUČKU?",
        "answer": "Rezime osnovnih činjenica i rezultata, sinteza zaključaka, prijedlozi i stavovi te otvorena pitanja za daljnja istraživanja.",
        "explanation": "Četiri elementa zaključka."
      },
      {
        "question": "Što se NE smije u zaključku?",
        "answer": "Ne smije biti preopširan i ne smije ponavljati ono što je već izneseno u osnovnom tekstu.",
        "explanation": "Zaključak sažima i sintetizira, ne prepisuje."
      },
      {
        "question": "Gdje se iskazuje LITERATURA?",
        "answer": "U bibliografiji, koja sadrži nazive korištenih dokumentacijskih izvora.",
        "explanation": "Ne u prilozima ni u uputnim napomenama."
      },
      {
        "question": "Kojem dijelu rada pripada „rezime ili sažetak osnovnih činjenica i rezultata istraživanja”?",
        "answer": "Zaključku.",
        "explanation": "To je uljez u pitanju o osnovnom tekstu."
      }
    ],
    "quiz": [
      {
        "question": "Trebao bi biti sažet, aktualan i privlačan, a osim toga odražavati osnovni sadržaj pisanog djela. To je:",
        "options": [
          "Osnovni tekst",
          "Uvod",
          "Sadržaj",
          "Naslov"
        ],
        "correct": 3
      },
      {
        "question": "Koja je tvrdnja o naslovu seminarskog rada ispravna?",
        "options": [
          "Naslov odražava osnovni sadržaj pisanog djela i mora biti sažet, aktualan i privlačan",
          "Naslov treba biti zagonetan kako bi potaknuo čitatelja da sam otkrije što je autor htio reći",
          "Naslov treba imati najviše 5 ključnih riječi i smije sadržavati skraćenice",
          "Naslov je nevažan jer sadržaj ionako prikazuje strukturu rada"
        ],
        "correct": 0
      },
      {
        "question": "Ilustracije se najčešće pojavljuju kao:",
        "options": [
          "Tablice i grafikoni",
          "Tablice i fotografije",
          "Tablice i grafički prikazi",
          "Tablice i slike"
        ],
        "correct": 3
      },
      {
        "question": "Ilustracije se opremaju i obilježavaju:",
        "options": [
          "Naslovom, rednim brojem, legendom, naznakom izvora podataka, eventualno napomenom i opisom podataka",
          "Naslovom, rednim brojem, legendom, naznakom izvora podataka te obavezno napomenom",
          "Naslovom, rednim brojem, legendom, naznakom izvora podataka, eventualno napomenom",
          "Rednim brojem, naznakom vrste ilustracije, opisom podataka te obavezno napomenom"
        ],
        "correct": 2
      },
      {
        "question": "Uvod je početni ili pripremni dio seminarskog rada u kojem se (izbaci uljeza):",
        "options": [
          "Precizira predmet, odnosno tema rada",
          "Obrazlaže svrha rada i navode primijenjene znanstvene metode",
          "Navodi kompozicija s osvrtom na dijelove djela",
          "Ocjenjuju rezultati dosadašnjih istraživanja na navedenu temu"
        ],
        "correct": 3
      },
      {
        "question": "U osnovnom tekstu seminarskog rada (izbaci uljeza):",
        "options": [
          "Temeljito i dokumentirano iznosi se povijest proučavanog problema",
          "Prikazuju se dosadašnje spoznaje i naznačuju mogućnosti daljnjeg istraživanja",
          "Predlažu se konkretne mjere i postupci za rješenje problema",
          "Iznosi se rezime, odnosno sažetak osnovnih činjenica i rezultata istraživanja"
        ],
        "correct": 3
      },
      {
        "question": "Literatura se u seminarskom radu iskazuje u:",
        "options": [
          "Prilozima",
          "Referencama",
          "Bibliografiji",
          "Uputnim napomenama s cjelovitim opisom"
        ],
        "correct": 2
      },
      {
        "question": "Što ukazuje čitatelju na logičnost izlaganja i hijerarhijski odnos dijelova djela, s naznakom stranica?",
        "options": [
          "Uvod",
          "Sadržaj (kazalo)",
          "Popis ilustracija",
          "Bibliografija"
        ],
        "correct": 1
      },
      {
        "question": "Što se od navedenog NE smije u zaključku?",
        "options": [
          "Donijeti sintezu zaključaka",
          "Navesti otvorena pitanja za daljnja istraživanja",
          "Ponavljati ono što je već izneseno u osnovnom tekstu",
          "Iznijeti prijedloge koji proizlaze iz rezultata"
        ],
        "correct": 2
      },
      {
        "question": "Glavni dio seminarskog rada je:",
        "options": [
          "Uvod",
          "Osnovni tekst",
          "Zaključak",
          "Predgovor"
        ],
        "correct": 1
      },
      {
        "question": "Popis ilustracija sastavlja se:",
        "options": [
          "Uvijek, u svakom radu",
          "Ako u radu ima više slika, tablica ili drugog grafičko-ilustrativnog materijala",
          "Samo u doktorskim disertacijama",
          "Samo ako mentor to posebno traži"
        ],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Naslov mora biti sažet, aktualan i _______.",
        "answer": "privlačan",
        "hint": "Da privuče čitatelja…"
      },
      {
        "sentence": "Naslov seminarskog rada piše se bez _______.",
        "answer": "skraćenica",
        "hint": "Kratice…"
      },
      {
        "sentence": "Sadržaj se još naziva _______.",
        "answer": "kazalo",
        "hint": "Popis poglavlja sa stranicama…"
      },
      {
        "sentence": "Ilustracije se najčešće pojavljuju kao tablice i _______.",
        "answer": "slike",
        "hint": "Ne grafikoni, ne fotografije…"
      },
      {
        "sentence": "Ilustracije se obilježavaju naslovom, rednim brojem, legendom, izvorom i eventualno _______.",
        "answer": "napomenom",
        "hint": "Neobvezni dodatak…"
      },
      {
        "sentence": "U uvodu se navode znanstvene _______ primijenjene u obradi teme.",
        "answer": "metode",
        "hint": "Npr. anketiranje, komparativna…"
      },
      {
        "sentence": "Osnovni tekst je _______ dio seminarskog rada.",
        "answer": "glavni",
        "hint": "Najvažniji, najopsežniji…"
      },
      {
        "sentence": "Literatura se iskazuje u _______.",
        "answer": "bibliografiji",
        "hint": "Popis korištenih izvora…"
      },
      {
        "sentence": "Zaključak ne smije biti _______.",
        "answer": "preopširan",
        "hint": "Predug…"
      }
    ],
    "learn": {
      "title": "Dijelovi rada: od naslova do zaključka",
      "content": `
<h3>Naslov</h3>
<div class="formula-box"><strong>Naslov</strong> odražava osnovni sadržaj pisanoga djela i mora biti <strong>sažet, aktualan i privlačan</strong>.</div>
<p>Dodatno, naslov treba biti:</p>
<ul>
<li>kratak i što potpuniji,</li>
<li>bez skraćenica,</li>
<li>reprezentirati tekst djela,</li>
<li>točno i jasno opisati sadržaj djela.</li>
</ul>
<div class="example-box"><strong>Loše:</strong> „Turizam” (preširoko) · „Nešto o OTA kanalima u HR” (kratice, neodređeno) · „Zašto svi idu na booking?” (neprecizno).<br><strong>Dobro:</strong> „Utjecaj online turističkih agencija na prodaju smještaja u hotelima Opatije”.</div>

<h3>Sadržaj (kazalo)</h3>
<div class="formula-box"><strong>Sadržaj (kazalo)</strong> rada ukazuje čitatelju na <strong>logičnost izlaganja</strong>, odnosno na strukturu djela, na kompoziciju i na <strong>hijerarhijski odnos</strong> između pojedinih dijelova djela <strong>s naznakom stranica</strong>.</div>

<h3>Popis ilustracija</h3>
<div class="formula-box"><strong>Popis ilustracija</strong> sastavlja se i ulaže u rad ako se u radu nalazi <strong>više</strong> slika, tablica ili drugog grafičko-ilustrativnog materijala i dokumenata koji služe kao dopuna, primjer ili objašnjenje uz osnovni tekst.</div>
<ul>
<li>Ilustracije se najčešće pojavljuju kao <strong>tablice i slike</strong>.</li>
<li>Opremaju se i obilježavaju <strong>naslovom, rednim brojem, legendom, naznakom izvora podataka i — eventualno — napomenom</strong>.</li>
</ul>
<div class="example-box"><strong>Tablica 1.</strong> Dolasci turista u Opatiju od 2022. do 2025. godine<br>[tablica]<br><em>Izvor:</em> izrada autora prema podacima Državnog zavoda za statistiku<br><em>Napomena:</em> podaci za 2025. su privremeni.<br><br>(redni broj + naslov → sama ilustracija → izvor → eventualno napomena)</div>

<h3>Uvod</h3>
<p><strong>Uvod</strong> je početni ili pripremni dio rada u kojem se:</p>
<ol>
<li>precizira predmet, odnosno tema rada i ističe o čemu se govori u seminarskom radu,</li>
<li>navode znanstvene metode koje su primijenjene u obradi teme,</li>
<li>obrazlaže smisao, odnosno svrha rada,</li>
<li>navodi kompozicija s osvrtom na dijelove i na sadržaj djela, te eventualni osobni stav prema temi.</li>
</ol>
<div class="example-box"><strong>Primjer odlomka uvoda:</strong> „Predmet ovog rada je utjecaj online recenzija na odabir hotela u Opatiji. Svrha rada je utvrditi koliko gosti pri rezervaciji vjeruju recenzijama. U radu su primijenjene metoda anketiranja, statistička i komparativna metoda. Rad je podijeljen na četiri poglavlja: nakon uvoda…”</div>

<h3>Osnovni tekst</h3>
<p><strong>Osnovni tekst</strong> je <strong>glavni dio</strong> seminarskog rada. U njemu se, uz primjenu stručnih i/ili znanstvenoistraživačkih metoda:</p>
<ol>
<li>temeljito i dokumentirano iznosi povijest proučavanoga problema,</li>
<li>prikazuju dosadašnje spoznaje o tome i naznačuju mogućnosti daljnjeg istraživanja,</li>
<li>izlažu najbitnije vlastite i druge znanstvene spoznaje i stavovi kojima se dokazuje ispravnost i istinitost postavljenih radnih hipoteza,</li>
<li>predlažu konkretne mjere i postupci za rješenje problema, odnosno za unaprjeđenje neke praktične aktivnosti.</li>
</ol>

<h3>Zaključak</h3>
<p><strong>Zaključak</strong> je završni dio seminarskog rada u kojem se sažeto i koncizno donose:</p>
<ol>
<li>rezime ili sinteza, odnosno sažetak osnovnih činjenica, postavki i rezultata istraživanja izloženog u radu,</li>
<li>sinteza zaključaka,</li>
<li>prijedlozi i stavovi koji proizlaze iz rezultata istraživanja,</li>
<li>otvorena pitanja koja zaslužuju daljnja istraživanja ili pozornost stručnjaka.</li>
</ol>
<div class="warning-box">Zaključak <strong>ne smije biti preopširan</strong> i u njemu se <strong>ne smije ponavljati</strong> ono što je već izneseno u osnovnom tekstu.</div>

<h3>Literatura</h3>
<p><strong>Literatura</strong> se iskazuje u <strong>bibliografiji</strong> koja sadrži nazive korištenih dokumentacijskih izvora (pravila pisanja → kategorije o Chicago stilu).</p>

<div class="warning-box"><strong>Uljezi s ispita — zapamti gdje što pripada:</strong>
<ul>
<li>„Ocjena rezultata dosadašnjih istraživanja” <strong>nije</strong> dio uvoda.</li>
<li>„Rezime/sažetak osnovnih činjenica i rezultata” pripada <strong>zaključku</strong>, ne osnovnom tekstu.</li>
<li>Ilustracije = <strong>tablice i slike</strong> (ne grafikoni, fotografije ni grafički prikazi).</li>
<li>Napomena uz ilustraciju je <strong>eventualna</strong>, ne obavezna; „opis podataka” se ne navodi.</li>
<li>Literatura se iskazuje u <strong>bibliografiji</strong> (ne u prilozima, referencama ni napomenama).</li>
</ul></div>
`
    }
  },

  "documentation": {
    "name": "Dokumentacijska osnova, citat i bibliografski opis",
    "icon": "fa-quote-left",
    "color": "#ec4899",
    "flashcards": [
      {
        "question": "Što čini DOKUMENTACIJSKU OSNOVU rukopisa?",
        "answer": "Pisani dokazi kojima autor, drugim autoritetom ili podacima, podupire određene tvrdnje.",
        "explanation": "Rad bez dokumentacijske osnove je samo mišljenje autora."
      },
      {
        "question": "Kako se iskazuju dokazi dokumentacijske osnove?",
        "answer": "Kroz prikaz korištene literature i upotrebom napomena i citata.",
        "explanation": "Ne kroz tablice, popis ilustracija ni strukturu rada — to su distraktori."
      },
      {
        "question": "Što je CITAT?",
        "answer": "Izvadak iz već objavljenog teksta drugog autora koji se prenosi doslovno, od riječi do riječi, uz precizno navođenje autora i izvora.",
        "explanation": "Mogu se citirati definicije, zaključci, činjenice, ideje, podaci, stavovi, ilustracije i sl."
      },
      {
        "question": "Kako se citat odvaja od osnovnog teksta?",
        "answer": "Navodnicima.",
        "explanation": "U hrvatskom tekstu: „…”."
      },
      {
        "question": "Što sve mora biti navedeno uz citat?",
        "answer": "Vrlo jasno i precizno od kojeg je autora i iz kojeg je bibliografskog izvora preuzet.",
        "explanation": "Citat bez izvora je plagijat."
      },
      {
        "question": "Koja je razlika između citata i parafraze?",
        "answer": "Citat prenosi tuđi tekst doslovno i u navodnicima; parafraza prenosi tuđu misao vlastitim riječima, bez navodnika, ali i dalje s izvorom.",
        "explanation": "Skripta definira citat; parafraza je dopuna — i ona traži navođenje izvora."
      },
      {
        "question": "Koji su osnovni elementi bibliografskog opisa KNJIGE?",
        "answer": "Autor, naslov i podnaslov, urednik i/ili prevoditelj, broj izdanja, broj volumena, mjesto i naziv nakladnika, godina, stranica, DOI ili URL.",
        "explanation": "Dopunski elementi: knjiga u pripremi ili tisku, reprint izdanje i sl."
      },
      {
        "question": "Koji su osnovni elementi bibliografskog opisa ČLANKA u časopisu?",
        "answer": "Autor, naslov i podnaslov članka, naziv časopisa, broj volumena, broj izdanja, datum, broj stranice te DOI ili URL.",
        "explanation": "Dopunski: mjesto ili naziv nakladnika, članak u pripremi, posebno izdanje, dodatak."
      },
      {
        "question": "Što je BIBLIOGRAFSKA JEDINICA?",
        "answer": "Opis jednog korištenog izvora u bibliografiji (popisu citirane literature), napisan prema pravilima odabranog citatnog stila.",
        "explanation": "U kolegiju: Chicago stil — bibliografski sustav."
      },
      {
        "question": "Koji citatni stil koristi kolegij?",
        "answer": "Chicago stil — bibliografski sustav (bibliografske jedinice u popisu citirane literature).",
        "explanation": "Chicago ima i sustav autor–godina; u jednom radu se stilovi ne miješaju."
      },
      {
        "question": "Što je DOI?",
        "answer": "Trajna digitalna oznaka (identifikator) objavljenog djela, najčešće članka; navodi se na kraju bibliografskog opisa.",
        "explanation": "Ako nema DOI-ja, navodi se URL adresa."
      }
    ],
    "quiz": [
      {
        "question": "Dokumentacijsku osnovu rukopisa čine pisani dokazi kojima autor, drugim autoritetom ili podacima, podupire tvrdnje. Ti se dokazi iskazuju:",
        "options": [
          "Kroz prikaz korištene literature i upotrebom napomena i citata",
          "Kroz prikaz činjeničnih podataka u tabličnim i grafičkim prilozima",
          "Kroz pregled tabličnih i grafičkih priloga u popisu ilustracija",
          "Kroz logično postavljen sustav strukturiranja i kompozicije rada"
        ],
        "correct": 0
      },
      {
        "question": "Izvadak iz već objavljenog teksta drugog autora koji se prenosi doslovno, od riječi do riječi, uz navođenje autora i izvora, je:",
        "options": [
          "Parafraza",
          "Citat",
          "Sažetak",
          "Napomena"
        ],
        "correct": 1
      },
      {
        "question": "Citat se od osnovnog teksta odvaja:",
        "options": [
          "Kurzivom",
          "Podebljanim slovima",
          "Navodnicima",
          "Zagradama"
        ],
        "correct": 2
      },
      {
        "question": "Što od navedenog NIJE osnovni element bibliografskog opisa knjige?",
        "options": [
          "Mjesto nakladnika",
          "Broj izdanja",
          "Cijena knjige",
          "Godina izdanja"
        ],
        "correct": 2
      },
      {
        "question": "Koji je element bibliografskog opisa specifičan za ČLANAK u časopisu, a ne za knjigu?",
        "options": [
          "Naziv časopisa",
          "Prezime i ime autora",
          "DOI ili URL",
          "Naslov i podnaslov"
        ],
        "correct": 0
      },
      {
        "question": "Ako djelo nema DOI oznaku, na kraju bibliografskog opisa navodi se:",
        "options": [
          "ISBN",
          "URL adresa",
          "Ime recenzenta",
          "Broj primjeraka"
        ],
        "correct": 1
      },
      {
        "question": "Što je dopunski (a ne osnovni) element bibliografskog opisa knjige?",
        "options": [
          "Naziv nakladnika",
          "Podatak da je knjiga u tisku ili reprint izdanje",
          "Naslov knjige",
          "Prezime i ime autora"
        ],
        "correct": 1
      },
      {
        "question": "Koja tvrdnja o citatu je TOČNA?",
        "options": [
          "Citat se smije skratiti i prepričati bez oznake",
          "Uz citat nije potrebno navoditi izvor ako je autor poznat",
          "Citat se prenosi doslovno i uz njega se precizno navode autor i izvor",
          "Citirati se smiju samo definicije"
        ],
        "correct": 2
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Citat se od osnovnoga teksta odvaja _______.",
        "answer": "navodnicima",
        "hint": "„ …”"
      },
      {
        "sentence": "U citatu se tuđi tekst prenosi doslovno, od riječi do _______.",
        "answer": "riječi",
        "hint": "Točno kako je napisano…"
      },
      {
        "sentence": "Dokumentacijske dokaze iskazujemo prikazom korištene literature i upotrebom napomena i _______.",
        "answer": "citata",
        "hint": "Doslovni izvadci…"
      },
      {
        "sentence": "Dokumentacijsku osnovu rukopisa čine pisani _______ kojima autor podupire tvrdnje.",
        "answer": "dokazi",
        "hint": "Potvrde tvrdnji…"
      },
      {
        "sentence": "Posljednji element bibliografskog opisa je DOI oznaka ili _______ adresa.",
        "answer": "URL",
        "hint": "Internetska adresa…"
      },
      {
        "sentence": "Kolegij koristi Chicago stil, i to _______ sustav.",
        "answer": "bibliografski",
        "hint": "Popis citirane literature…"
      }
    ],
    "learn": {
      "title": "Dokumentacijska osnova, citat i bibliografski opis",
      "content": `
<h3>Dokumentacijska osnova rukopisa</h3>
<div class="formula-box"><strong>Dokumentacijsku osnovu rukopisa</strong> čine <strong>pisani dokazi</strong> kojima autor, drugim autoritetom ili podacima, podupire određene tvrdnje. Ti se dokazi iskazuju:
<ul><li>kroz <strong>prikaz korištene literature</strong> i</li><li><strong>upotrebom napomena i citata</strong>.</li></ul></div>

<h3>Citat</h3>
<div class="formula-box"><strong>Citat</strong> je izvadak iz već objavljenoga teksta nekoga drugoga autora, u kojem se <strong>od riječi do riječi, doslovno</strong>, prenose njegove definicije, zaključci, znanstvene činjenice, ideje, podaci, stavovi, informacije, ilustracije i sl., uz vrlo jasno i precizno navođenje podataka o tome od kojeg su autora i iz kojeg su bibliografskog izvora preuzeti. Citat se od osnovnoga teksta <strong>odvaja navodnicima</strong>.</div>
<div class="example-box"><strong>Citat:</strong> Prema definiciji iz skripte, seminarski rad je „samostalno pisano djelo u kojem student treba pokazati svoje praktičko i teorijsko znanje”.<sup>1</sup><br><strong>Parafraza (ne citat):</strong> Seminarskim radom student dokazuje da zna samostalno obraditi stručnu temu koristeći literaturu.<sup>2</sup><br><em>Oba primjera trebaju oznaku izvora; samo citat ide u navodnike.</em></div>

<h3>Bibliografija i bibliografska jedinica</h3>
<p>Literatura se iskazuje u <strong>bibliografiji</strong> — popisu citirane literature na kraju rada. Svaki izvor u njoj je jedna <strong>bibliografska jedinica</strong>. Kolegij koristi <strong>Chicago stil — bibliografski sustav</strong>. Chicago stil ima i sustav <em>autor–godina</em>, ali u jednom radu se stilovi i sustavi <strong>ne miješaju</strong> — važi načelo dosljednosti.</p>

<h3>Osnovni elementi bibliografskog opisa</h3>
<table>
<tr><th>Knjiga</th><th>Članak u časopisu</th></tr>
<tr><td>
prezime i ime autora<br>naslov i podnaslov knjige<br>urednik i/ili prevoditelj<br>broj izdanja<br>broj volumena<br>mjesto nakladnika<br>naziv nakladnika<br>godina izdanja<br>broj stranice<br>DOI oznaka ili URL adresa
</td><td>
prezime i ime autora<br>naslov i podnaslov članka<br>naziv časopisa<br>broj volumena<br>broj izdanja<br>datum<br>broj stranice<br>DOI oznaka ili URL adresa
</td></tr>
<tr><td><em>Dopunski:</em> knjiga u pripremi ili tisku, reprint izdanje i sl.</td><td><em>Dopunski:</em> mjesto ili naziv nakladnika, članak u pripremi, posebno izdanje, dodatak i sl.</td></tr>
</table>
<div class="tip-box"><strong>Opće pravilo koje vrijedi za sve jedinice u Chicago bibliografskom sustavu:</strong> prvi autor piše se <strong>prezime, ime</strong>; naslov knjige i naziv časopisa pišu se <strong>kurzivom</strong>; naslov članka ili priloga ide u <strong>navodnike</strong>; između mjesta i nakladnika stoji <strong>dvotočka</strong>, a iza nakladnika <strong>zarez i godina</strong>.</div>

<div class="warning-box"><strong>Česte greške:</strong>
<ul>
<li>Na pitanje kako se iskazuju dokazi dokumentacijske osnove ponuđeni su tablični prilozi, popis ilustracija i struktura rada — točno je samo <strong>literatura + napomene i citati</strong>.</li>
<li>Citat bez navodnika ili bez izvora = plagijat.</li>
<li>Miješati Chicago s drugim stilovima (npr. APA ili Harvard) u istom radu.</li>
</ul></div>
`
    }
  },

  "chicagoBooks": {
    "name": "Chicago stil: knjige",
    "icon": "fa-book-open",
    "color": "#14b8a6",
    "flashcards": [
      {
        "question": "Predložak: KNJIGA S JEDNIM AUTOROM (Chicago, bibliografski sustav)",
        "answer": "Prezime, Ime. Naslov (kurziv). Mjesto izdavača: Ime izdavača, godina.",
        "explanation": "Dika, Mihajlo. Insolvencijsko pravo. Zagreb: Pravni fakultet Zagreb, 1998."
      },
      {
        "question": "Predložak: KNJIGA S DVA AUTORA",
        "answer": "Prezime, Ime, i Ime Prezime. Naslov (kurziv). Mjesto izdavača: Ime izdavača, godina.",
        "explanation": "Triva, Siniša, i Mihajlo Dika. Građansko parnično procesno pravo. Zagreb: Narodne novine, 2004."
      },
      {
        "question": "Predložak: KNJIGA S TRI AUTORA",
        "answer": "Prezime, Ime, Ime Prezime, i Ime Prezime. Naslov (kurziv). Broj izdanja. Mjesto izdavača: Izdavač, godina.",
        "explanation": "Broj izdanja piše se iza naslova knjige (npr. 9. izd.)."
      },
      {
        "question": "Predložak: KNJIGA OD ČETIRI DO ŠEST AUTORA (prema skripti)",
        "answer": "Prezime, Ime, Ime Prezime, Ime Prezime, Ime Prezime, i Ime Prezime. Naslov (kurziv). Broj izdanja. Mjesto: Izdavač, godina.",
        "explanation": "Navode se SVI autori; samo prvi obrnutim redom (prezime, ime)."
      },
      {
        "question": "Predložak: KNJIGA S UREDNIKOM",
        "answer": "Prezime, Ime, ur. Naslov (kurziv). Mjesto izdanja: Ime izdavača, godina.",
        "explanation": "„ur.” = kratica za urednika. Gulin, Danimir, ur. Primjena Hrvatskih standarda financijskog izvještavanja. Zagreb: …, 2008."
      },
      {
        "question": "Kako se piše PRVI, a kako ostali autori u bibliografskoj jedinici?",
        "answer": "Prvi autor: Prezime, Ime. Svi ostali: Ime Prezime (prirodnim redom).",
        "explanation": "Obrnuti red samo kod prvog autora jer se bibliografija slaže abecedno po njegovu prezimenu."
      },
      {
        "question": "Što stoji ispred posljednjeg autora?",
        "answer": "Zarez i veznik „i” (u engleskim primjerima „and”).",
        "explanation": "Triva, Siniša, i Mihajlo Dika — bez zareza ispred „i” je ispitni distraktor."
      },
      {
        "question": "Gdje se piše broj izdanja?",
        "answer": "Iza naslova knjige, prije mjesta izdavanja (npr. „9. izd.”).",
        "explanation": "Vidučić, Ljiljana, … Financijski menadžment. 9. izd. Zagreb: RRiF plus, 2015."
      },
      {
        "question": "Koji je redoslijed i interpunkcija u dijelu „mjesto – izdavač – godina”?",
        "answer": "Mjesto: Izdavač, godina. — dvotočka iza mjesta, zarez iza izdavača, točka na kraju.",
        "explanation": "Zagreb: Narodne novine, 2004. Najčešći distraktori obrću mjesto i izdavača."
      },
      {
        "question": "Kako se navodi knjiga u izdanju ORGANIZACIJE (bez osobnog autora)?",
        "answer": "Organizacija je na mjestu autora: Naziv organizacije. Naslov (kurziv). Izdanje. Mjesto: Izdavač, godina.",
        "explanation": "American Psychological Association. The Publication Manual… 6th ed. Washington, DC: American Psychological Association, 2010."
      },
      {
        "question": "Kako se navodi knjiga BEZ AUTORA (naslov i podnaslov umjesto autora)?",
        "answer": "Jedinica počinje naslovom i podnaslovom (kurziv), zatim izdanje, Mjesto: Izdavač, godina.",
        "explanation": "Standard Definitions: Final Dispositions of Case Codes and Outcome Rates for Surveys. 6th ed. Lenexa, KS: …, 2009."
      },
      {
        "question": "Kako se navodi knjiga na STRANOM JEZIKU s prijevodom naslova?",
        "answer": "Izvorni naslov u kurzivu, a prijevod naslova odmah iza njega u uglatim zagradama [ ].",
        "explanation": "Burgos, Elizabeth, ed. Me llamo Rigoberta Menchú… [My Name is Rigoberta Menchú…]. Mexico City: …, 1987."
      }
    ],
    "quiz": [
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s jednim autorom, primjer Dika)?",
        "options": [
          "Mihajlo. Dika. Insolvencijsko pravo. Pravni fakultet Zagreb: Zagreb, 1998.",
          "Mihajlo Dika. Insolvencijsko pravo, Pravni fakultet Zagreb, Zagreb, 1998.",
          "Dika, Mihajlo. Insolvencijsko pravo. Zagreb: Pravni fakultet Zagreb, 1998.",
          "Dika, Mihajlo: Insolvencijsko pravo. Zagreb: Pravni fakultet, 1998."
        ],
        "correct": 2
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s jednim autorom, primjer Belak)?",
        "options": [
          "Belak, Vinko. Računovodstvo dugotrajne materijalne imovine prema HSFI/MSFI i novi računovodstveni postupci. Zagreb: 2009., Belak Excellens.",
          "Vinko, Belak. Računovodstvo dugotrajne materijalne imovine prema HSFI/MSFI i novi računovodstveni postupci. Zagreb: Belak Excellens, 2009.",
          "Belak, Vinko. Računovodstvo dugotrajne materijalne imovine prema HSFI/MSFI i novi računovodstveni postupci. Zagreb: Belak Excellens, 2009.",
          "Belak, Vinko. Računovodstvo dugotrajne materijalne imovine prema HSFI/MSFI i novi računovodstveni postupci. Belak Excellens, 2009., Zagreb."
        ],
        "correct": 2
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s dva autora)?",
        "options": [
          "Triva Siniša, i Mihajlo Dika. Građansko parnično procesno pravo. Zagreb: Narodne novine, 2004.",
          "Triva, Siniša, i Mihajlo Dika. Građansko parnično procesno pravo. Zagreb: Narodne novine, 2004.",
          "Triva, Siniša i Mihajlo Dika. Građansko parnično procesno pravo. Zagreb: Narodne novine, 2004.",
          "Triva, Siniša, i Mihajlo Dika. Građansko parnično procesno pravo. Narodne novine: Zagreb, 2004."
        ],
        "correct": 1
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s tri autora)?",
        "options": [
          "Vidučić, Ljiljana, Sandra Pepur, i Marija Šimić Šarić. Financijski menadžment. 9. izd. Zagreb: RRiF plus, 2015.",
          "Ljiljana Vidučić, Sandra Pepur i Marija Šimić Šarić. Financijski menadžment. Zagreb 9. izd.: RRiF plus, 2015.",
          "Financijski menadžment. Ljiljana Vidučić, Sandra Pepur, Marija Šimić Šarić. 9. izd. Zagreb: RRiF plus, 2015.",
          "Vidučić Ljiljana, Sandra Pepur i Marija Šimić Šarić. Financijski menadžment. Zagreb: RRiF plus, 9. izd. 2015."
        ],
        "correct": 0
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s urednikom, primjer Tipurić)?",
        "options": [
          "Tipurić, Darko, ur. Konkurentska sposobnost poduzeća: Sinergija: Zagreb, 1999.",
          "Tipurić, Darko, ur. Konkurentska sposobnost poduzeća. Zagreb: Sinergija, 1999.",
          "Darko Tipurić, ur. Konkurentska sposobnost poduzeća. Zagreb: Sinergija, 1999.",
          "Tipurić, Darko, ur. 1999. Konkurentska sposobnost poduzeća: Sinergija, Zagreb."
        ],
        "correct": 1
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (knjiga s urednikom, primjer Gulin)?",
        "options": [
          "Gulin Danimir, ur. Primjena Hrvatskih standarda financijskog izvještavanja Zagreb: Hrvatska zajednica računovođa i financijskih djelatnika, 2008",
          "Gulin, Danimir, ur. Primjena Hrvatskih standarda financijskog izvještavanja. Zagreb: Hrvatska zajednica računovođa i financijskih djelatnika, 2008.",
          "Gulin, Danimir, ur. Primjena Hrvatskih standarda financijskog izvještavanja Zagreb: Hrvatska zajednica računovođa i financijskih djelatnika 2008",
          "Gulin Danimir, ur Primjena Hrvatskih standarda financijskog izvještavanja. Zagreb Hrvatska zajednica računovođa i financijskih djelatnika, 2008."
        ],
        "correct": 1
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (knjiga u izdanju organizacije)?",
        "options": [
          "American Psychological Association, The Publication Manual of the American Psychological Association. 6th ed. Washington, DC: American Psychological Association, 2010.",
          "American Psychological Association. The Publication Manual of the American Psychological Association. 6th ed: Washington, DC: American Psychological Association, 2010.",
          "American Psychological Association. The Publication Manual of the American Psychological Association. 6th ed. Washington, DC: American Psychological Association, 2010.",
          "American Psychological Association. The Publication Manual of the American Psychological Association. 6th ed. Washington, DC; American Psychological Association, 2010."
        ],
        "correct": 2
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (naslov i podnaslov umjesto autora)?",
        "options": [
          "Standard Definitions: Final Dispositions of Case Codes and Outcome Rates for Surveys. 6th ed. Lenexa, KS; American Association for Public Opinion Research, 2009.",
          "Standard Definitions. Final Dispositions of Case Codes and Outcome Rates for Surveys. 6th ed. Lenexa, KS; American Association for Public Opinion Research, 2009.",
          "Standard Definitions: Final Dispositions of Case Codes and Outcome Rates for Surveys; 6th ed. Lenexa, KS; American Association for Public Opinion Research, 2009.",
          "Standard Definitions: Final Dispositions of Case Codes and Outcome Rates for Surveys. 6th ed. Lenexa, KS: American Association for Public Opinion Research, 2009."
        ],
        "correct": 3
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (knjiga s urednikom na stranom jeziku uz prijevod naslova)?",
        "options": [
          "Burgos, Elizabeth, ed. Me llamo Rigoberta Menchú y así me nació la conciencia [My Name is Rigoberta Menchú and This Is How My Consciousness Was Raised]. Mexico City: Siglo Veintiuno, 1987.",
          "Elizabeth Burgos, ed. Me llamo Rigoberta Menchú y así me nació la conciencia [My Name is Rigoberta Menchú and This Is How My Consciousness Was Raised]. Mexico City: Siglo Veintiuno, 1987.",
          "Ed. Elizabeth Burgos. Me llamo Rigoberta Menchú y así me nació la conciencia [My Name is Rigoberta Menchú and This Is How My Consciousness Was Raised], Mexico City: Siglo Veintiuno, 1987.",
          "Burgos, Elizabeth, ed, Me llamo Rigoberta Menchú y así me nació la conciencia [My Name is Rigoberta Menchú and This Is How My Consciousness Was Raised], Mexico City: Siglo Veintiuno, 1987"
        ],
        "correct": 0
      },
      {
        "question": "Gdje se u bibliografskoj jedinici knjige piše broj izdanja (npr. 3. izd.)?",
        "options": [
          "Ispred imena autora",
          "Iza naslova knjige, prije mjesta izdanja",
          "Iza godine izdanja",
          "Između mjesta i izdavača"
        ],
        "correct": 1
      },
      {
        "question": "Što je pogrešno u jedinici „Triva, Siniša i Mihajlo Dika. Građansko parnično procesno pravo. Zagreb: Narodne novine, 2004.”?",
        "options": [
          "Nedostaje zarez ispred „i”",
          "Mjesto i izdavač su zamijenjeni",
          "Drugi autor treba biti napisan „Dika, Mihajlo”",
          "Nedostaje broj izdanja"
        ],
        "correct": 0
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Bibliografska jedinica knjige u Chicago stilu počinje _______ prvog autora.",
        "answer": "prezimenom",
        "hint": "Prezime, Ime…"
      },
      {
        "sentence": "Naslov knjige u bibliografskoj jedinici piše se _______.",
        "answer": "kurzivom",
        "hint": "Italic…"
      },
      {
        "sentence": "Između mjesta izdanja i imena izdavača stoji _______.",
        "answer": "dvotočka",
        "hint": "Zagreb_ Narodne novine…"
      },
      {
        "sentence": "Drugi i svaki sljedeći autor pišu se redoslijedom ime pa _______.",
        "answer": "prezime",
        "hint": "Prirodnim redom…"
      },
      {
        "sentence": "Broj izdanja piše se iza _______ knjige.",
        "answer": "naslova",
        "hint": "… Financijski menadžment. 9. izd. …"
      },
      {
        "sentence": "Prijevod stranog naslova knjige piše se u _______ zagradama.",
        "answer": "uglatim",
        "hint": "[ ]"
      },
      {
        "sentence": "Ispred posljednjeg autora stoji zarez i veznik _______.",
        "answer": "i",
        "hint": "U engleskim primjerima and…"
      },
      {
        "sentence": "Dika, Mihajlo. Insolvencijsko pravo. Zagreb: Pravni fakultet Zagreb, _______.",
        "answer": "1998",
        "hint": "Godina izdanja iz primjera…"
      }
    ],
    "learn": {
      "title": "Chicago stil: knjige",
      "content": `
<p>Na drugom kolokviju i završnom ispitu redovito dolazi pitanje: <em>„Koja je bibliografska jedinica koja se upisuje u Bibliografiju (popis citirane literature u pisanom djelu) ispravno navedena u Chicago stilu – Bibliografski sustav (primjer …)?”</em> Ponuđeno je 4–6 gotovo jednakih jedinica koje se razlikuju u <strong>redoslijedu elemenata</strong> i <strong>interpunkciji</strong>. Zato treba znati predloške <strong>napamet, znak po znak</strong>.</p>

<h3>Opća pravila</h3>
<ul>
<li><strong>Prvi autor</strong>: <em>Prezime, Ime</em>. <strong>Ostali autori</strong>: <em>Ime Prezime</em>.</li>
<li>Ispred posljednjeg autora: <strong>zarez + „i”</strong> (u engleskim primjerima „and”).</li>
<li><strong>Naslov knjige u kurzivu.</strong></li>
<li><strong>Broj izdanja</strong> iza naslova (npr. <em>9. izd.</em>, engl. <em>6th ed.</em>).</li>
<li><strong>Mjesto: Izdavač, godina.</strong> — dvotočka, zarez, točka.</li>
<li>Urednik: iza imena <strong>ur.</strong> (engl. <em>ed.</em>).</li>
</ul>

<h3>Predlošci i primjeri</h3>
<table>
<tr><th>Vrsta</th><th>Predložak i primjer</th></tr>
<tr><td>Knjiga s jednim autorom</td><td>Prezime, Ime. <em>Naslov</em>. Mjesto izdavača: Ime izdavača, godina.<br>Dika, Mihajlo. <em>Insolvencijsko pravo</em>. Zagreb: Pravni fakultet Zagreb, 1998.<br>Belak, Vinko. <em>Računovodstvo dugotrajne materijalne imovine prema HSFI/MSFI i novi računovodstveni postupci</em>. Zagreb: Belak Excellens, 2009.</td></tr>
<tr><td>Knjiga s dva autora</td><td>Prezime, Ime, i Ime Prezime. <em>Naslov</em>. Mjesto izdavača: Ime izdavača, godina.<br>Triva, Siniša, i Mihajlo Dika. <em>Građansko parnično procesno pravo</em>. Zagreb: Narodne novine, 2004.</td></tr>
<tr><td>Knjiga s tri autora</td><td>Prezime, Ime, Ime Prezime, i Ime Prezime. <em>Naslov</em>. Broj izdanja. Mjesto izdavača: Izdavač, godina izdanja.<br>Vidučić, Ljiljana, Sandra Pepur, i Marija Šimić Šarić. <em>Financijski menadžment</em>. 9. izd. Zagreb: RRiF plus, 2015.</td></tr>
<tr><td>Knjiga s četiri i više autora (skripta: 4–6; ispitno pitanje: 4–10)</td><td>Prezime, Ime, Ime Prezime, Ime Prezime, Ime Prezime, i Ime Prezime. <em>Naslov</em>. Broj izdanja. Mjesto izdavača: Izdavač, godina izdavanja.<br>Žager, Katarina, Ivana Mamić Sačer, Sanja Sever Mališ, Ana Ježovita, i Lajoš Žager. <em>Analiza financijskih izvještaja</em>. 3. izd. Zagreb: Masmedia, 2017.</td></tr>
<tr><td>Knjiga s urednikom</td><td>Prezime, Ime, ur. <em>Naslov</em>. Mjesto izdanja: Ime izdavača, godina.<br>Gulin, Danimir, ur. <em>Primjena Hrvatskih standarda financijskog izvještavanja</em>. Zagreb: Hrvatska zajednica računovođa i financijskih djelatnika, 2008.<br>Tipurić, Darko, ur. <em>Konkurentska sposobnost poduzeća</em>. Zagreb: Sinergija, 1999.</td></tr>
<tr><td>Knjiga u izdanju organizacije</td><td>Naziv organizacije. <em>Naslov</em>. Izdanje. Mjesto: Izdavač, godina.<br>American Psychological Association. <em>The Publication Manual of the American Psychological Association</em>. 6th ed. Washington, DC: American Psychological Association, 2010.</td></tr>
<tr><td>Naslov i podnaslov umjesto autora</td><td><em>Naslov: Podnaslov</em>. Izdanje. Mjesto: Izdavač, godina.<br><em>Standard Definitions: Final Dispositions of Case Codes and Outcome Rates for Surveys</em>. 6th ed. Lenexa, KS: American Association for Public Opinion Research, 2009.</td></tr>
<tr><td>Knjiga s urednikom na stranom jeziku uz prijevod</td><td>Prezime, Ime, ed. <em>Izvorni naslov</em> [Prijevod naslova]. Mjesto: Izdavač, godina.<br>Burgos, Elizabeth, ed. <em>Me llamo Rigoberta Menchú y así me nació la conciencia</em> [My Name is Rigoberta Menchú and This Is How My Consciousness Was Raised]. Mexico City: Siglo Veintiuno, 1987.</td></tr>
</table>

<h3>Kako brzo riješiti ispitno pitanje — kontrolna lista</h3>
<ol>
<li>Počinje li jedinica <strong>prezimenom, zarez, imenom</strong> prvog autora? (odbaci „Mihajlo Dika.”, „Vinko, Belak.”, „Ed. Elizabeth Burgos.”)</li>
<li>Jesu li ostali autori <strong>Ime Prezime</strong> i ima li <strong>zarez ispred „i”</strong>?</li>
<li>Je li <strong>naslov odmah iza autora</strong> (a ne godina ili izdavač)?</li>
<li>Je li broj izdanja <strong>iza naslova</strong>?</li>
<li>Je li na kraju točno <strong>Mjesto: Izdavač, godina.</strong> — ni „Izdavač: Mjesto”, ni „Mjesto: godina, Izdavač”, ni točka-zarez umjesto dvotočke?</li>
<li>Postoji li <strong>točka</strong> iza naslova i na samom kraju?</li>
</ol>

<div class="warning-box"><strong>Tipični distraktori:</strong>
<ul>
<li>Točka umjesto zareza između prezimena i imena: „Mihajlo. Dika.”</li>
<li>Zamijenjeni mjesto i izdavač: „Narodne novine: Zagreb, 2004.”</li>
<li>Godina na krivom mjestu: „Zagreb: 2009., Belak Excellens.” ili „Tipurić, Darko, ur. 1999. …”</li>
<li>Dvotočka iza prezimena: „Dika, Mihajlo: Insolvencijsko pravo.”</li>
<li>Točka-zarez umjesto dvotočke: „Washington, DC; American…”</li>
<li>Nedostaje točka iza naslova ili na kraju jedinice.</li>
</ul></div>
`
    }
  },

  "chicagoArticles": {
    "name": "Chicago stil: prilozi, članci i ostali izvori",
    "icon": "fa-newspaper",
    "color": "#ef4444",
    "flashcards": [
      {
        "question": "Predložak: ČLANAK U ČASOPISU — jedan autor",
        "answer": "Prezime, Ime. „Naslov članka.” Naziv časopisa (kurziv) volumen, br. broj (godina): raspon stranica.",
        "explanation": "Elementi redom: autor, naslov članka, časopis, volumen, broj, godina, stranice."
      },
      {
        "question": "Predložak: ČLANAK U ČASOPISU — dva autora",
        "answer": "Prezime, Ime, i Ime Prezime. „Naslov članka.” Naziv časopisa (kurziv) volumen, br. broj (godina): raspon stranica.",
        "explanation": "Autori isto kao kod knjige; ostatak isto kao kod članka s jednim autorom."
      },
      {
        "question": "Kako se piše naslov ČLANKA, a kako naziv ČASOPISA?",
        "answer": "Naslov članka u navodnicima; naziv časopisa u kurzivu.",
        "explanation": "Pravilo: dio (članak, prilog) u navodnike, cjelina (časopis, knjiga) u kurziv."
      },
      {
        "question": "Kako izgleda završetak jedinice članka u časopisu?",
        "answer": "Časopis volumen, br. broj (godina): stranice. — npr. 1, br. 1 (2019): 31–46.",
        "explanation": "Godina u zagradi, iza nje dvotočka i raspon stranica."
      },
      {
        "question": "Predložak: PRILOG AUTORA U KNJIZI GRUPE AUTORA",
        "answer": "Prezime, Ime, i Ime Prezime. „Naslov priloga.” U Naslov knjige (kurziv), raspon stranica. Mjesto izdanja: Izdavač, godina.",
        "explanation": "Ključna riječ „U” ispred naslova knjige (zbornika)."
      },
      {
        "question": "Predložak: PRILOG U KNJIZI GRUPE AUTORA S UREDNIKOM",
        "answer": "Prezime, Ime. „Naslov priloga.” U Naslov knjige (kurziv), uredio Ime Prezime, raspon stranica. Mjesto: Izdavač, godina.",
        "explanation": "Urednik se piše iza naslova knjige: „uredio Ime Prezime”."
      },
      {
        "question": "Predložak: KNJIGA CITIRANA U KNJIZI DRUGOG AUTORA",
        "answer": "Prvo cijeli opis izvorne knjige, zatim „Citirano u” (engl. „Quoted in”) i opis knjige u kojoj je citirana.",
        "explanation": "Smith, Adam. The Wealth of Nations. New York: Random House, 1965. Quoted in Mark Skousen, The Making of Modern Economics…"
      },
      {
        "question": "Predložak: IZVJEŠTAJ",
        "answer": "Naziv institucije (autor izvješća). Naslov izvješća (kurziv). Mjesto izdanja: Naziv izdavača, godina.",
        "explanation": "Institucija je na mjestu autora."
      },
      {
        "question": "Predložak: ONLINE STATISTIČKI GODIŠNJAK",
        "answer": "Naziv institucije. Naslov dokumenta. Mjesto izdanja: Naziv izdavača, godina. Internet izvor (pristupljeno dan. mjesec godina).",
        "explanation": "Za online izvor dodaje se datum pristupa."
      },
      {
        "question": "Kako izgleda primjer „ostale literature” (bilten HNB-a)?",
        "answer": "Hrvatska narodna banka, Bilten 16, br. 161 (srpanj 2010).",
        "explanation": "Redom: institucija, naziv publikacije i volumen, broj, (mjesec i godina)."
      },
      {
        "question": "Što se piše ispred naslova knjige u kojoj se nalazi prilog?",
        "answer": "Riječ „U”.",
        "explanation": "„… postupak.” U Prvi međunarodni interdisciplinarni skup…"
      },
      {
        "question": "Gdje se kod priloga u knjizi navodi raspon stranica?",
        "answer": "Iza naslova knjige (i urednika, ako ga ima), a prije mjesta izdanja.",
        "explanation": "… U International Encyclopedia of Statistical Science, uredio Miodrag Lovric, 1378–1379. New York: Springer, 2014."
      }
    ],
    "quiz": [
      {
        "question": "Koja je bibliografska jedinica ispravno navedena u Chicago stilu – bibliografski sustav (članak u časopisu, tri autora)?",
        "options": [
          "Bogdan, Siniša, Suzana Bareša, i Velimir Hađina. „Testiranje primjenjivosti Altmanovog Z-score modela za predviđanje stečaja u Republici Hrvatskoj.” Notitia – časopis za održivi razvoj 1, br. 1 (2019): 31–46.",
          "Bogdan, Siniša, Suzana Bareša, i Velimir Hađina. Notitia – časopis za održivi razvoj 1, „Testiranje primjenjivosti Altmanovog Z-score modela za predviđanje stečaja u Republici Hrvatskoj.”, br. 1 (2019): 31–46.",
          "„Testiranje primjenjivosti Altmanovog Z-score modela za predviđanje stečaja u Republici Hrvatskoj.” Bogdan, Siniša, Suzana Bareša, i Velimir Hađina. Notitia – časopis za održivi razvoj 1, br. 1 (2019): 31–46.",
          "Notitia – časopis za održivi razvoj 1, br. 1 (2019): 31–46. Bogdan, Siniša, Suzana Bareša, i Velimir Hađina. „Testiranje primjenjivosti Altmanovog Z-score modela za predviđanje stečaja u Republici Hrvatskoj.”"
        ],
        "correct": 0
      },
      {
        "question": "Koji je ispravan redoslijed elemenata jedinice članka u časopisu?",
        "options": [
          "Autor – naslov članka – naziv časopisa – volumen – broj – godina – stranice",
          "Naslov članka – autor – naziv časopisa – godina – stranice",
          "Naziv časopisa – autor – naslov članka – godina – stranice",
          "Autor – naziv časopisa – naslov članka – broj – godina – stranice"
        ],
        "correct": 0
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (prilog autora u knjizi grupe autora s urednikom)?",
        "options": [
          "Sekander, Hayat Khan M. „Standard Deviation.” U International Encyclopedia of Statistical Science, uredio Miodrag Lovric, 1378–1379. New York: Springer, 2014.",
          "New York: Springer, 2014. Sekander, Hayat Khan M. „Standard Deviation.” U International Encyclopedia of Statistical Science, uredio Miodrag Lovric, 1378–1379.",
          "„Standard Deviation.” Sekander, Hayat Khan M. U International Encyclopedia of Statistical Science, uredio Miodrag Lovric, 1378–1379. New York: Springer, 2014.",
          "U International Encyclopedia of Statistical Science, uredio Miodrag Lovric, 1378–1379. New York: Springer, 2014. Sekander, Hayat Khan M. „Standard Deviation.”"
        ],
        "correct": 0
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (prilog autora u knjizi grupe autora)?",
        "options": [
          "Brekalo, Miljenko, i Palić Viktor. „Utjecaj prava zemalja Europske unije na hrvatski stečajni postupak.” U Prvi međunarodni interdisciplinarni skup: Kultura, identitet, društvo – europski realiteti, 789–798. Osijek: Odjel za kulturologiju Sveučilišta Josipa Jurja Strossmayera u Osijeku, 2014.",
          "Brekalo, Miljenko, i Viktor Palić. „Utjecaj prava zemalja Europske unije na hrvatski stečajni postupak.” U Prvi međunarodni interdisciplinarni skup: Kultura, identitet, društvo – europski realiteti, 789–798. Osijek: Odjel za kulturologiju Sveučilišta Josipa Jurja Strossmayera u Osijeku, 2014.",
          "Miljenko Brekalo, i Viktor Palić. „Utjecaj prava zemalja Europske unije na hrvatski stečajni postupak.” U Prvi međunarodni interdisciplinarni skup: Kultura, identitet, društvo – europski realiteti, 789–798. Osijek: Odjel za kulturologiju Sveučilišta Josipa Jurja Strossmayera u Osijeku 2014.",
          "Brekalo, Miljenko, i Viktor Palić. „Utjecaj prava zemalja Europske unije na hrvatski stečajni postupak.” U Prvi međunarodni interdisciplinarni skup: Kultura, identitet, društvo – europski realiteti, 789–798. Odjel za kulturologiju Sveučilišta Josipa Jurja Strossmayera u Osijeku, Osijek, 2014."
        ],
        "correct": 1
      },
      {
        "question": "Koja je bibliografska jedinica ispravno navedena (primjer ostale literature)?",
        "options": [
          "Br. 161, Hrvatska narodna banka, Bilten 16 (srpanj 2010).",
          "(Srpanj 2010), Hrvatska narodna banka, br. 161, Bilten 16.",
          "Hrvatska narodna banka, Bilten 16, br. 161 (srpanj 2010).",
          "Bilten 16, br. 161 (srpanj 2010), Hrvatska narodna banka."
        ],
        "correct": 2
      },
      {
        "question": "Kod knjige citirane u knjizi drugog autora, što povezuje dva opisa knjiga?",
        "options": [
          "Izraz „Citirano u” (engl. „Quoted in”)",
          "Izraz „Vidi također”",
          "Kratica „ur.”",
          "Kratica „et al.”"
        ],
        "correct": 0
      },
      {
        "question": "U jedinici članka u časopisu naslov članka piše se:",
        "options": [
          "Kurzivom",
          "U navodnicima",
          "Velikim tiskanim slovima",
          "U uglatim zagradama"
        ],
        "correct": 1
      },
      {
        "question": "Čime završava jedinica online statističkog godišnjaka?",
        "options": [
          "Imenom recenzenta",
          "Podatkom „Internet izvor (pristupljeno dan. mjesec godina)”",
          "Brojem izdanja",
          "Kraticom „ur.”"
        ],
        "correct": 1
      },
      {
        "question": "Kod priloga u knjizi s urednikom, urednik se navodi:",
        "options": [
          "Na početku jedinice, ispred autora priloga",
          "Iza naslova knjige, riječima „uredio Ime Prezime”",
          "Na kraju jedinice, iza godine",
          "Ne navodi se"
        ],
        "correct": 1
      },
      {
        "question": "U jedinici „Pejić-Bach, Mirjana. „Primjena modela diskriminacijske analize i financijskih pokazatelja u prognoziranju bankrota poduzeća.” Računovodstvo i financije 1, br. 11 (1997): 515–532.” što označava „(1997)”?",
        "options": [
          "Broj volumena",
          "Godinu izdanja",
          "Broj stranica",
          "Broj izdanja"
        ],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Naslov članka piše se u _______, a naziv časopisa kurzivom.",
        "answer": "navodnicima",
        "hint": "„…”"
      },
      {
        "sentence": "Ispred naslova knjige u kojoj se nalazi prilog piše se riječ _______.",
        "answer": "U",
        "hint": "Jedno slovo…"
      },
      {
        "sentence": "Kod priloga s urednikom iza naslova knjige piše se „_______ Ime Prezime”.",
        "answer": "uredio",
        "hint": "Glagol, prošlo vrijeme…"
      },
      {
        "sentence": "Kod knjige citirane u drugoj knjizi opise povezuje izraz „_______ u”.",
        "answer": "Citirano",
        "hint": "Engl. Quoted in…"
      },
      {
        "sentence": "Kod članka u časopisu iza godine u zagradi stoji _______, a zatim raspon stranica.",
        "answer": "dvotočka",
        "hint": "(2019)_ 31–46…"
      },
      {
        "sentence": "Kod izvještaja na mjestu autora stoji naziv _______.",
        "answer": "institucije",
        "hint": "Ustanova koja je autor izvješća…"
      },
      {
        "sentence": "Uz online izvor navodi se datum kad je izvoru _______.",
        "answer": "pristupljeno",
        "hint": "(… dan. mjesec godina)"
      }
    ],
    "learn": {
      "title": "Chicago stil: prilozi, članci i ostali izvori",
      "content": `
<h3>Zlatno pravilo: dio u navodnike, cjelina u kurziv</h3>
<p>Kad izvor ima dvije razine — <strong>članak u časopisu</strong> ili <strong>prilog u knjizi (zborniku)</strong> — manji dio (članak, prilog) piše se <strong>u navodnicima</strong>, a veća cjelina (časopis, knjiga) <strong>kurzivom</strong>.</p>

<h3>Članci u časopisu</h3>
<table>
<tr><th>Vrsta</th><th>Predložak i primjer</th></tr>
<tr><td>Članak — jedan autor</td><td>Prezime, Ime. „Naslov članka.” <em>Naziv časopisa</em> broj volumena, br. broj izdanja (godina): raspon stranica.<br>Pejić-Bach, Mirjana. „Primjena modela diskriminacijske analize i financijskih pokazatelja u prognoziranju bankrota poduzeća.” <em>Računovodstvo i financije</em> 1, br. 11 (1997): 515–532.</td></tr>
<tr><td>Članak — dva autora</td><td>Prezime, Ime, i Ime Prezime. „Naslov članka.” <em>Naziv časopisa</em> broj volumena, br. broj izdanja (godina): raspon stranica.</td></tr>
<tr><td>Članak — tri autora</td><td>Prezime, Ime, Ime Prezime, i Ime Prezime. „Naslov članka.” <em>Naziv časopisa</em> volumen, br. broj (godina): stranice.<br>Bogdan, Siniša, Suzana Bareša, i Velimir Hađina. „Testiranje primjenjivosti Altmanovog Z-score modela za predviđanje stečaja u Republici Hrvatskoj.” <em>Notitia – časopis za održivi razvoj</em> 1, br. 1 (2019): 31–46.</td></tr>
</table>
<div class="example-box"><strong>Rastavimo zadnji dio:</strong> <em>Notitia – časopis za održivi razvoj</em> <strong>1</strong> (volumen), <strong>br. 1</strong> (broj izdanja) <strong>(2019)</strong> (godina) <strong>: 31–46</strong> (raspon stranica na kojima je članak).</div>

<h3>Prilozi u knjigama</h3>
<table>
<tr><th>Vrsta</th><th>Predložak i primjer</th></tr>
<tr><td>Prilog autora u knjizi grupe autora</td><td>Prezime, Ime, i Ime Prezime. „Naslov priloga.” U <em>Naslov knjige grupe autora</em>, raspon stranica. Mjesto izdanja: Naziv izdavača, godina.<br>Brekalo, Miljenko, i Viktor Palić. „Utjecaj prava zemalja Europske unije na hrvatski stečajni postupak.” U <em>Prvi međunarodni interdisciplinarni skup: Kultura, identitet, društvo – europski realiteti</em>, 789–798. Osijek: Odjel za kulturologiju Sveučilišta Josipa Jurja Strossmayera u Osijeku, 2014.</td></tr>
<tr><td>Prilog u knjizi grupe autora s urednikom</td><td>Prezime, Ime Inicijal. „Naslov priloga.” U <em>Naslov knjige</em>, uredio Ime Prezime, raspon stranica. Mjesto izdanja: Naziv izdavača, godina.<br>Sekander, Hayat Khan M. „Standard Deviation.” U <em>International Encyclopedia of Statistical Science</em>, uredio Miodrag Lovric, 1378–1379. New York: Springer, 2014.</td></tr>
<tr><td>Prilog u zborniku konferencije (primjer s ispita)</td><td>Bareša, Suzana. „Financial Stability and Business Performance of Hotel Companies in the Republic of Croatia.” U <em>Proceedings of International Conference on Administration Management and Social Studies (ICAMSS’19): Public Administration Reform, European Union Issues and Challenges, September 13-14, 2019, Sarajevo, Bosnia and Herzegovina</em>, 32–47. Sarajevo: Faculty of Administration, University of Sarajevo, 2019.</td></tr>
<tr><td>Knjiga citirana u knjizi drugog autora</td><td>Prezime, Ime. <em>Naslov</em>. Broj izdanja. Mjesto: Izdavač, godina. Citirano u Ime Prezime, <em>Naslov</em>. Broj izdanja. Mjesto: Izdavač, godina.<br>Smith, Adam. <em>The Wealth of Nations</em>. New York: Random House, 1965. Quoted in Mark Skousen, <em>The Making of Modern Economics: The Lives and the Ideas of the Great Thinkers</em>. Armonk, NY: M. E. Sharpe, 2001.</td></tr>
</table>
<div class="tip-box">Primjer sa Smithom je engleski izvor pa koristi „<em>Quoted in</em>”; u hrvatskom predlošku skripte isto mjesto glasi „<em>Citirano u</em>”. Autor knjige u kojoj je citat (Mark Skousen) piše se <strong>prirodnim redom</strong>: Ime Prezime.</div>

<h3>Ostali izvori</h3>
<table>
<tr><th>Vrsta</th><th>Predložak i primjer</th></tr>
<tr><td>Izvještaj</td><td>Naziv institucije (koja je autor izvješća). <em>Naslov izvješća</em>. Mjesto izdanja: Naziv izdavača (institucija koja je izdala dokument), godina.</td></tr>
<tr><td>Online statistički godišnjak</td><td>Naziv institucije. Naslov dokumenta. Mjesto izdanja: Naziv izdavača, godina. Internet izvor (pristupljeno dan. mjesec godina).</td></tr>
<tr><td>Ostala literatura (bilten)</td><td>Hrvatska narodna banka, <em>Bilten</em> 16, br. 161 (srpanj 2010).</td></tr>
</table>

<div class="warning-box"><strong>Tipični distraktori:</strong>
<ul>
<li>Naslov članka ili naziv časopisa <strong>ispred autora</strong> — autor je uvijek prvi.</li>
<li>Naziv časopisa ispred naslova članka.</li>
<li>Mjesto i izdavač na početku jedinice (npr. „New York: Springer, 2014. Sekander…”).</li>
<li>Drugi autor napisan obrnuto („Palić Viktor”) ili prvi autor prirodnim redom („Miljenko Brekalo”).</li>
<li>Izostavljena točka iza naslova priloga ili na kraju jedinice.</li>
</ul></div>

<div class="tip-box"><strong>Napomena o točki i navodnicima:</strong> u primjerima s ispita točka iza naslova članka stoji <strong>unutar</strong> navodnika („…Hrvatskoj.”), a u općem predlošku skripte zapisana je iza njih. Distraktori se na ispitu razlikuju po redoslijedu elemenata, a ne po tom detalju — ali budi dosljedan u vlastitom radu.</div>
`
    }
  }
};

if (typeof window !== 'undefined') { window.academicWritingHrM2 = academicWritingHrM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = academicWritingHrM2; }
