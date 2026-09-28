// Hrana i prehrana (HR) — M2 (2. kolokvij)
// AUTORSKI IZ HR MATERIJALA kolegija (studentska skripta „Hrana i prehrana” + prikupljena ispitna
// pitanja 2. kolokvija s Drivea); EN predmet food-nutrition samo kao dopuna dubine — NE prijevod.
// MODEL: kartice <200 znak, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// M2 = pivo · jaka alkoholna pića i likeri · meso i mesni proizvodi · ribe i riblji proizvodi ·
//      mlijeko i mliječni proizvodi · jaja · sigurnost hrane i HACCP · uravnotežena prehrana
// Napomena: jedan skup ispitnih pitanja 1. kolokvija sadrži i pitanja o pivu i jakim pićima —
// ovdje su po većini izvora (i EN podjeli kolegija) svrstani u 2. kolokvij.
// HACCP/sigurnost hrane: studentska skripta tu temu nema — napisano prema ispitnim pitanjima
// i propisima EU o higijeni hrane.

const foodNutritionHrM2 = {
  "beer": {
    "name": "Pivo",
    "icon": "fa-beer-mug-empty",
    "color": "#ca8a04",
    "flashcards": [
      {
        "question": "Što je PIVO?",
        "answer": "Proizvod dobiven alkoholnom fermentacijom pivske sladovine pomoću pivskih kvasaca roda Saccharomyces.",
        "explanation": "Jedno od najstarijih pića: Sumerani i Egipćani prije više od 5000 godina."
      },
      {
        "question": "Koje su osnovne sirovine za pivo?",
        "answer": "Slad, voda, hmelj i kvasac.",
        "explanation": "U nekim se podjelama hmelj navodi kao dodatna sirovina („začin” piva)."
      },
      {
        "question": "Što je SLAD?",
        "answer": "Proklijali i osušeni ječam. Slad sušen na nižoj temperaturi daje svijetla, a na višoj tamna piva.",
        "explanation": "Klijanjem se aktiviraju enzimi koji razgrađuju škrob."
      },
      {
        "question": "Kakva je uloga VODE u pivu?",
        "answer": "Čini oko 90 % piva i bitno utječe na kvalitetu; tvrdoća vode (soli kalcija i magnezija) utječe na okus.",
        "explanation": "Pilsner je nastao na vrlo mekoj vodi."
      },
      {
        "question": "Kakva je uloga HMELJA?",
        "answer": "Daje gorčinu i aromu, djeluje antiseptički i pridonosi stabilnosti pjene. Koriste se ženski cvjetovi (šišarice) biljke Humulus lupulus.",
        "explanation": "Kuhanje sladovine s hmeljem = hmeljenje."
      },
      {
        "question": "Što je LUPULIN?",
        "answer": "Žuti prah iz žlijezda hmeljevih šišarica; nosi gorke smole i eterična ulja.",
        "explanation": "Hmelj sadrži lupulin."
      },
      {
        "question": "Koja je uloga KVASCA?",
        "answer": "Pretvara šećere u alkohol i CO₂ te utječe na okus i aromu piva.",
        "explanation": "Pivski kvasci: Saccharomyces cerevisiae (ale) i S. uvarum (lager)."
      },
      {
        "question": "Koje su faze proizvodnje piva?",
        "answer": "Proizvodnja slada, proizvodnja sladovine (ukomljavanje i kuhanje s hmeljem), vrenje te dozrijevanje, dorada i punjenje.",
        "explanation": "U proizvodnji piva NEMA destilacije."
      },
      {
        "question": "Što je SLAĐENJE?",
        "answer": "Pretvaranje ječma u slad močenjem, klijanjem i sušenjem.",
        "explanation": "Temperatura sušenja određuje boju slada."
      },
      {
        "question": "Što je UKOMLJAVANJE?",
        "answer": "Miješanje mljevenog slada s vodom; enzimi pretvaraju netopljive sastojke (škrob) u topljive, fermentabilne šećere.",
        "explanation": "Naziva se i komljenje; nastaje komina, a nakon cijeđenja sladovina."
      },
      {
        "question": "Infuzija vs dekokcija?",
        "answer": "Infuzija: postupno zagrijavanje cijele komine – više fermentabilnih šećera (ale). Dekokcija: dio komine se kuha i vraća – više neprevrelog ekstrakta (lager).",
        "explanation": "Oba su postupci ukomljavanja."
      },
      {
        "question": "Što daje GLAVNO VRENJE?",
        "answer": "Kvasac pretvara šećere u alkohol i CO₂; nakon oko 4–5 dana nastaje mlado pivo.",
        "explanation": "Slijedi naknadno vrenje i dozrijevanje (odležavanje)."
      },
      {
        "question": "Što je LAGER?",
        "answer": "Pivo donjeg vrenja: kvasac Saccharomyces uvarum, hladno vrenje, dozrijevanje oko 0 °C nekoliko tjedana. Najraširenije u Europi i Hrvatskoj.",
        "explanation": "Puniji okus, izraženija gorčina, gusta i postojana pjena."
      },
      {
        "question": "Što je ALE?",
        "answer": "Pivo gornjeg vrenja: Saccharomyces cerevisiae, toplo vrenje (10–25 °C), kvasac izlazi na površinu, kraće dozrijevanje.",
        "explanation": "Najčešće u Velikoj Britaniji i SAD-u; blaži okus, manje stabilna pjena."
      },
      {
        "question": "Koji su koraci dorade piva?",
        "answer": "Bistrenje, stabilizacija, pasterizacija i punjenje bez gubitka CO₂ i ulaska zraka.",
        "explanation": "Nefiltrirano pivo zadržava prirodnu mutnoću."
      },
      {
        "question": "Kako se pivo dijeli prema alkoholu?",
        "answer": "Bezalkoholno do 0,5 %, standardno 3,5–5,5 %, jako iznad 5,5 %, ječmeno vino iznad 10 %.",
        "explanation": "Pšenično pivo ima najmanje 30 % pšeničnog slada."
      },
      {
        "question": "Kako se pivo dijeli prema boji?",
        "answer": "Svijetlo do 15 EBC, tamno 16–40 EBC, crno iznad 40 EBC.",
        "explanation": "EBC = europska ljestvica boje piva."
      },
      {
        "question": "Kakav je sastav i energetska vrijednost piva?",
        "answer": "Oko 92,9 % vode, 3,9 % alkohola i 2,5 % ugljikohidrata; oko 45 kcal na 100 ml. Sadrži B vitamine i kalij.",
        "explanation": "Preporuka: najviše 2–3 jedinice alkohola dnevno, za žene upola manje."
      }
    ],
    "quiz": [
      {
        "question": "U proizvodnji piva NE provodi se:",
        "options": ["Slađenje", "Destilacija", "Hmeljenje", "Kuhanje sladovine"],
        "correct": 1
      },
      {
        "question": "Slad se dobiva od:",
        "options": ["Prženih zrna kukuruza", "Fermentiranog grožđa", "Proklijalog i osušenog ječma", "Sušenih hmeljevih cvjetova"],
        "correct": 2
      },
      {
        "question": "Glavno vrenje piva daje:",
        "options": ["Sladovinu", "Kominu", "Slad", "Mlado pivo"],
        "correct": 3
      },
      {
        "question": "Infuzija i dekokcija su postupci:",
        "options": ["Proizvodnje sladovine", "Destilacije rakije", "Njege i dozrijevanja vina", "Klijanja ječma"],
        "correct": 0
      },
      {
        "question": "Lupulin se nalazi u:",
        "options": ["Sladu", "Hmelju", "Kvascu", "Ječmenom zrnu"],
        "correct": 1
      },
      {
        "question": "Lager se proizvodi pomoću kvasca:",
        "options": ["Acetobacter aceti", "Lactobacillus bulgaricus", "Saccharomyces uvarum", "Bacillus subtilis"],
        "correct": 2
      },
      {
        "question": "Pivo gornjeg vrenja je:",
        "options": ["Lager", "Pilsner", "Bezalkoholno pivo", "Ale"],
        "correct": 3
      },
      {
        "question": "Bezalkoholno pivo sadrži najviše:",
        "options": ["0,5 % alkohola", "1,5 % alkohola", "2,5 % alkohola", "3,5 % alkohola"],
        "correct": 0
      },
      {
        "question": "Hmelj u pivu:",
        "options": ["Izvor je fermentabilnih šećera", "Daje gorčinu i aromu", "Pretvara šećer u alkohol", "Čini oko 90 % piva"],
        "correct": 1
      },
      {
        "question": "Tvrdoću vode za pivo određuju soli:",
        "options": ["Natrija i kalija", "Željeza i bakra", "Kalcija i magnezija", "Cinka i selena"],
        "correct": 2
      },
      {
        "question": "Dekokcija se u pravilu koristi za pivo:",
        "options": ["Gornjeg vrenja (ale)", "Spontanog vrenja", "Bez alkohola", "Donjeg vrenja (lager)"],
        "correct": 3
      },
      {
        "question": "Energetska vrijednost piva je oko:",
        "options": ["45 kcal/100 ml", "150 kcal/100 ml", "5 kcal/100 ml", "90 kcal/100 ml"],
        "correct": 0
      },
      {
        "question": "Pivo s bojom iznad 40 EBC je:",
        "options": ["Svijetlo", "Crno", "Tamno", "Pšenično"],
        "correct": 1
      },
      {
        "question": "Standardno pivo sadrži:",
        "options": ["0,5–1 % alkohola", "8–10 % alkohola", "3,5–5,5 % alkohola", "12–15 % alkohola"],
        "correct": 2
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Slad se dobiva od proklijalog i osušenog _______.",
        "answer": "ječma",
        "hint": "Žitarica."
      },
      {
        "sentence": "Glavnim vrenjem nastaje _______ pivo.",
        "answer": "mlado",
        "hint": "Suprotno od staro."
      },
      {
        "sentence": "Pivo donjeg vrenja zove se _______.",
        "answer": "lager",
        "hint": "Najraširenije u Europi."
      },
      {
        "sentence": "Žuti prah iz hmeljevih šišarica zove se _______.",
        "answer": "lupulin",
        "hint": "Od Humulus lupulus."
      },
      {
        "sentence": "Voda čini oko _______ % piva.",
        "answer": "90",
        "hint": "Broj."
      },
      {
        "sentence": "Postupak ukomljavanja u kojem se dio komine kuha i vraća zove se _______.",
        "answer": "dekokcija",
        "hint": "Suprotno od infuzije."
      },
      {
        "sentence": "Pšenično pivo sadrži najmanje _______ % pšeničnog slada.",
        "answer": "30",
        "hint": "Broj."
      }
    ],
    "learn": {
      "title": "Pivo",
      "content":
        '<h3>Povijest i definicija</h3>' +
        '<p>Pivo je jedno od najstarijih alkoholnih pića — napitke slične pivu proizvodili su Sumerani i Egipćani prije više od 5000 godina, a industrijska proizvodnja razvija se krajem 19. stoljeća. Danas je jedno od najčešće konzumiranih pića u svijetu.</p>' +
        '<p><strong>Pivo</strong> je proizvod dobiven <strong>alkoholnom fermentacijom pivske sladovine</strong> pomoću pivskih kvasaca roda <em>Saccharomyces</em>.</p>' +

        '<h3>Sirovine</h3>' +
        '<table>' +
        '<tr><th>Sirovina</th><th>Uloga</th></tr>' +
        '<tr><td><strong>Slad</strong></td><td>proklijali i osušeni <strong>ječam</strong>; izvor fermentabilnih šećera. Niža temperatura sušenja → svijetla piva, viša → tamna</td></tr>' +
        '<tr><td><strong>Voda</strong></td><td>oko <strong>90 %</strong> piva; <strong>tvrdoća vode</strong> (soli kalcija i magnezija) utječe na okus</td></tr>' +
        '<tr><td><strong>Hmelj</strong></td><td>ženski cvjetovi (šišarice) biljke <em>Humulus lupulus</em>: <strong>gorčina, aroma, antiseptičko djelovanje</strong>, stabilnost pjene. Sadrži <strong>lupulin</strong> — žuti prah s gorkim smolama i eteričnim uljima</td></tr>' +
        '<tr><td><strong>Kvasac</strong></td><td>pretvara šećere u alkohol i CO₂; utječe na okus i aromu</td></tr>' +
        '</table>' +
        '<div class="tip-box">Skripta navodi četiri osnovne sirovine. U nekim se ispitnim pitanjima hmelj ne ubraja u osnovne sirovine nego se opisuje kao dodatak koji daje gorčinu i aromu i djeluje antiseptički — oba opisa odnose se na istu ulogu hmelja.</div>' +

        '<h3>Proizvodnja piva — četiri faze</h3>' +
        '<h4>1. Proizvodnja slada (slađenje)</h4>' +
        '<p>Ječam se <strong>moči, klija i suši</strong>. Klijanjem se aktiviraju enzimi koji će razgraditi škrob.</p>' +
        '<h4>2. Proizvodnja sladovine</h4>' +
        '<ul>' +
        '<li><strong>Ukomljavanje (komljenje)</strong> — miješanje mljevenog slada i vode; enzimi pretvaraju netopljive sastojke u topljive (škrob → fermentabilni šećeri).</li>' +
        '<li><strong>Infuzija</strong> — postupno zagrijavanje cijele komine; više fermentabilnih šećera; za piva <strong>gornjeg</strong> vrenja.</li>' +
        '<li><strong>Dekokcija</strong> — dio komine se odvaja, kuha i vraća; više neprevrelog ekstrakta; za piva <strong>donjeg</strong> vrenja.</li>' +
        '<li><strong>Hmeljenje</strong> — kuhanje sladovine s hmeljem (gorčina, aroma, stabilnost).</li>' +
        '</ul>' +
        '<h4>3. Alkoholno vrenje</h4>' +
        '<p><strong>Glavno vrenje</strong> (oko 4–5 dana): kvasac pretvara šećere u alkohol i CO₂ → nastaje <strong>mlado pivo</strong>.</p>' +
        '<table>' +
        '<tr><th></th><th>Lager — donje vrenje</th><th>Ale — gornje vrenje</th></tr>' +
        '<tr><td>Kvasac</td><td><em>Saccharomyces uvarum</em></td><td><em>Saccharomyces cerevisiae</em></td></tr>' +
        '<tr><td>Vrenje</td><td>hladno — niže temperature (prema predavanjima 9–18 °C)</td><td>toplo — više temperature (10–25 °C); kvasac izlazi na površinu</td></tr>' +
        '<tr><td>Dozrijevanje</td><td>oko 0 °C, nekoliko tjedana</td><td>kraće</td></tr>' +
        '<tr><td>Karakter</td><td>puniji okus, izraženija gorčina i aroma hmelja, gusta postojana pjena</td><td>blaži okus, manje gorčine, manje stabilna pjena</td></tr>' +
        '<tr><td>Zastupljenost</td><td>najraširenije u Europi i Hrvatskoj</td><td>Velika Britanija, SAD</td></tr>' +
        '</table>' +
        '<h4>4. Dozrijevanje, dorada i punjenje</h4>' +
        '<p>Tijekom <strong>odležavanja</strong> razvijaju se aroma, okus, CO₂ i bistroća. <strong>Dorada:</strong> bistrenje (uklanjanje kvasca i čestica), stabilizacija, pasterizacija; <strong>punjenje</strong> bez gubitka CO₂ i ulaska zraka.</p>' +
        '<div class="warning-box"><strong>Zamka:</strong> u proizvodnji piva <strong>ne provodi se destilacija</strong> — destilacija je postupak za jaka alkoholna pića.</div>' +

        '<h3>Senzorska svojstva</h3>' +
        '<p><strong>Miris</strong> ugodan i svojstven vrsti · <strong>okus</strong> ovisi o sirovinama, vrenju i dozrijevanju · <strong>boja</strong> ovisi o sladu i tehnologiji · <strong>bistroća</strong> (osim nefiltriranih piva) · <strong>pjena</strong> — procjenjuju se visina i postojanost.</p>' +

        '<h3>Vrste piva</h3>' +
        '<table>' +
        '<tr><th>Podjela</th><th>Vrste</th></tr>' +
        '<tr><td>Posebnosti proizvodnje</td><td>bezalkoholno (najviše 0,5 %), pšenično (najmanje 30 % pšeničnog slada), nefiltrirano (prirodna mutnoća)</td></tr>' +
        '<tr><td>Boja</td><td>svijetlo do 15 EBC · tamno 16–40 EBC · crno iznad 40 EBC</td></tr>' +
        '<tr><td>Alkohol</td><td>bezalkoholno do 0,5 % · standardno 3,5–5,5 % · jako iznad 5,5 % · ječmeno vino iznad 10 %</td></tr>' +
        '</table>' +

        '<h3>Prehrambena vrijednost</h3>' +
        '<p>Prosječno <strong>92,9 % vode, 3,9 % alkohola, 2,5 % ugljikohidrata</strong>; oko <strong>45 kcal na 100 ml</strong>. Sadrži vitamine B skupine te kalij, fosfor, magnezij i kalcij. Umjerena konzumacija može potaknuti probavu, djelovati diuretički i nadoknaditi elektrolite. <strong>Preporuka:</strong> ne više od 2–3 jedinice alkohola dnevno, za žene približno upola manje.</p>'
    }
  },

  "spirits": {
    "name": "Jaka alkoholna pića i likeri",
    "icon": "fa-whiskey-glass",
    "color": "#b45309",
    "flashcards": [
      {
        "question": "Što su JAKA ALKOHOLNA PIĆA?",
        "answer": "Pića čiji je glavni sastojak etilni alkohol, s najmanje 15 % vol.; dobivaju se destilacijom, maceracijom bilja u alkoholu ili dodavanjem aroma i sladila.",
        "explanation": "Većina rakija i whiskyja na tržištu ima oko 37,5–45 % vol."
      },
      {
        "question": "Što je DESTILACIJA?",
        "answer": "Odvajanje hlapivih od nehlapivih tvari zagrijavanjem i naknadnim hlađenjem para. Uvijek slijedi nakon fermentacije.",
        "explanation": "Alkohol vrije pri nižoj temperaturi od vode pa prvi isparava."
      },
      {
        "question": "Koji je cilj destilacije?",
        "answer": "Povećati koncentraciju alkohola i izdvojiti poželjne aromatske spojeve uz uklanjanje nepoželjnih primjesa.",
        "explanation": "Prvi dio destilata (prvijenac) sadrži nepoželjne spojeve."
      },
      {
        "question": "Redestilacija vs rektifikacija?",
        "answer": "Redestilacija: ponovna destilacija za jači destilat – daje prepečenicu. Rektifikacija: višestruko pročišćavanje alkohola u kolonama.",
        "explanation": "Dvostruka destilacija uvedena je u 17., rektifikacija u 19. st."
      },
      {
        "question": "Što je DOZRIJEVANJE jakih pića?",
        "answer": "Oplemenjivanje destilata u posudama, najčešće hrastovim bačvama: mijenjaju se boja, aroma i okus. Traje od nekoliko dana do više od 10 godina.",
        "explanation": "Boja whiskyja i konjaka dolazi iz bačve."
      },
      {
        "question": "Kako se proizvode RAKIJE?",
        "answer": "Destilacijom prevrelog soka, masulja ili komine voća, grožđa, žitarica ili drugih sirovina. Ne smiju se dodavati alkohol, šećer ni arome.",
        "explanation": "Rakije od voća, vina i komine: najmanje 37,5 % alkohola."
      },
      {
        "question": "Kako se proizvodi RAKIJA OD VINA?",
        "answer": "Isključivo od vinskog destilata, dobivenog destilacijom vina na manje od 86 % vol.; gotov proizvod ima najmanje 37,5 % alkohola.",
        "explanation": "Brandy, vinjak, cognac, armagnac."
      },
      {
        "question": "Što je VINJAK?",
        "answer": "Hrvatska vinska rakija (brandy): dozrijeva najmanje godinu dana u hrastovim spremnicima ili šest mjeseci u hrastovim bačvama.",
        "explanation": "Stari vinjak: najmanje tri godine u hrastovim bačvama."
      },
      {
        "question": "Cognac vs Armagnac?",
        "answer": "Cognac: samo iz pokrajine Charente; dvostruka destilacija vina, dozrijevanje u hrastu. Armagnac: pokrajina Gaskonja, destilira se samo jednom.",
        "explanation": "Metaxa: grčki brandy, kvaliteta označena zvjezdicama."
      },
      {
        "question": "Komovica, droždenka i loza?",
        "answer": "Komovica: od fermentirane grožđane komine. Droždenka: od vinskog taloga. Loza: od prevrelog grožđanog masulja.",
        "explanation": "Sve tri su rakije od grožđa."
      },
      {
        "question": "Biska, ruta, medica i travarica?",
        "answer": "Biska: istarska, s imelom. Ruta: aromatizirana rutom. Medica: s dodanim medom. Travarica: aromatizirana raznim aromatičnim biljem.",
        "explanation": "Aromatizirane (specijalne) rakije."
      },
      {
        "question": "Kako se proizvode RAKIJE OD VOĆA?",
        "answer": "Fermentacijom i destilacijom voća, bez aromatiziranja; najmanje 37,5 % alkohola. Npr. šljivovica, kruškovača, marelica, višnja.",
        "explanation": "Slavonska šljivovica odležava najmanje 18 mjeseci."
      },
      {
        "question": "Što je CALVADOS?",
        "answer": "Francuska rakija od jabuka (jabučni brandy iz Normandije); dozrijeva najmanje dvije godine u hrastovim bačvama.",
        "explanation": "Applejack: američka rakija od jabuka."
      },
      {
        "question": "Što je RUM?",
        "answer": "Šećerna rakija dobivena fermentacijom i destilacijom melase ili sirupa šećerne trske.",
        "explanation": "Domaći „room” je aromatizirani etilni alkohol, a ne pravi rum."
      },
      {
        "question": "Što je TEQUILA?",
        "answer": "Meksičko jako piće dobiveno destilacijom fermentiranog soka agave; zaštićena oznaka izvornosti.",
        "explanation": "Agava sazrijeva više godina prije berbe."
      },
      {
        "question": "Kako se proizvodi WHISKY?",
        "answer": "Destilacijom prevrele komine žitnog slada; dozrijeva najmanje 3 godine u hrastovim bačvama; najmanje 40 % alkohola.",
        "explanation": "Škrob se prije vrenja mora pretvoriti u šećere (slad ili enzimi)."
      },
      {
        "question": "Vrste whiskyja?",
        "answer": "Scotch (treset, hrast), irski (trostruka destilacija, blaži), bourbon (najmanje 51 % kukuruza, paljeni američki hrast), kanadski (najčešće od raži).",
        "explanation": "Whisky/whiskey – dva pravopisa."
      },
      {
        "question": "Gin i vodka?",
        "answer": "Gin: žitna rakija aromatizirana bobicama borovice. Vodka: bistra rakija neutralnog okusa od žitarica ili krumpira, višestruko destilirana i rektificirana.",
        "explanation": "London gin aromatizira se tijekom redestilacije."
      },
      {
        "question": "Što su LIKERI?",
        "answer": "Jaka alkoholna pića s najmanje 15 % alkohola i 70–100 g/L šećera; dobivaju se maceracijom voća, bilja ili začina u alkoholu.",
        "explanation": "Obojena otopina dobivena maceracijom = macerat."
      },
      {
        "question": "Koji su likeri s anisom?",
        "answer": "Pastis (FR, zamućuje se s vodom), ouzo (GR), sambuca (IT, zvjezdasti anis) i absint (pelin, anis, komorač; vrlo jak).",
        "explanation": "Anisovi likeri spadaju u likere od bilja i začina."
      },
      {
        "question": "Voćni i krem likeri?",
        "answer": "Voćni: višnjevac, orahovac, limoncello. Krem likeri: najmanje 250 g/L šećera i 15 % alkohola, s mlijekom, vrhnjem, jajima, kavom ili čokoladom.",
        "explanation": "Orahovac se radi od zelenih oraha."
      },
      {
        "question": "Koja su poznata hrvatska jaka pića?",
        "answer": "Šljivovica (stara ≥ 12 mj., slavonska ≥ 18 mj.), loza, travarica, biska, pelinkovac (pelin) i zadarski maraschino (višnja maraska, ≥ 32 %).",
        "explanation": "Maraschino je liker."
      },
      {
        "question": "Što je PUNČ?",
        "answer": "Topli miješani napitak od jakog alkoholnog pića (najčešće ruma), vode ili čaja, šećera, limuna i začina.",
        "explanation": "Grog = rum razrijeđen vrućom vodom."
      },
      {
        "question": "Po čemu se ocjenjuje kvaliteta jakih pića?",
        "answer": "Jačina (alkohol), finoća (arome – pokazatelj kakvoće i starosti), punoća (ekstrakt, šećer, kiseline) i harmonija (sklad svega).",
        "explanation": "Nedostaci: kiselost, pljesnivost, sumporovodik, okus na košticu, metal, prvijenac, užeglost, pretamna boja."
      }
    ],
    "quiz": [
      {
        "question": "Droždenka je rakija od:",
        "options": ["Grožđane komine", "Šljiva", "Melase", "Vinskog taloga"],
        "correct": 3
      },
      {
        "question": "Rum je:",
        "options": ["Šećerna rakija", "Voćna rakija", "Žitna rakija", "Vinska rakija"],
        "correct": 0
      },
      {
        "question": "Calvados je:",
        "options": ["Šećerna rakija", "Jabučna rakija", "Žitna rakija", "Liker od anisa"],
        "correct": 1
      },
      {
        "question": "Tequila se dobiva destilacijom fermentiranog soka:",
        "options": ["Šećerne trske", "Kukuruza", "Agave", "Grožđa"],
        "correct": 2
      },
      {
        "question": "Koje je od navedenih pića voćni liker?",
        "options": ["Cognac", "Calvados", "Šljivovica", "Višnjevac"],
        "correct": 3
      },
      {
        "question": "Cognac se proizvodi isključivo u francuskoj pokrajini:",
        "options": ["Charente", "Gaskonja", "Normandija", "Jerez"],
        "correct": 0
      },
      {
        "question": "Armagnac se razlikuje po tome što se:",
        "options": ["Proizvodi od jabuka", "Destilira samo jednom", "Ne čuva u bačvama", "Aromatizira imelom"],
        "correct": 1
      },
      {
        "question": "Whisky mora dozrijevati u hrastovim bačvama najmanje:",
        "options": ["6 mjeseci", "1 godinu", "3 godine", "10 godina"],
        "correct": 2
      },
      {
        "question": "Gin se aromatizira:",
        "options": ["Zvjezdastim anisom", "Korom limuna", "Pelinom", "Bobicama borovice"],
        "correct": 3
      },
      {
        "question": "Destilacija je:",
        "options": ["Odvajanje hlapivih od nehlapivih tvari", "Pretvaranje šećera u alkohol kvascem", "Potapanje bilja i voća u alkohol", "Miješanje destilata različite starosti"],
        "correct": 0
      },
      {
        "question": "Biska je istarska rakija s dodatkom:",
        "options": ["Rute", "Imele", "Meda", "Pelina"],
        "correct": 1
      },
      {
        "question": "Likeri sadrže najmanje:",
        "options": ["40 % alkohola i nimalo šećera", "5 % alkohola i 10 g/L šećera", "15 % alkohola i 70–100 g/L šećera", "37,5 % alkohola i 250 g/L šećera"],
        "correct": 2
      },
      {
        "question": "Zadarski maraschino proizvodi se od:",
        "options": ["Šljive bistrice", "Grožđa maraštine", "Kruške viljamovke", "Višnje maraske"],
        "correct": 3
      },
      {
        "question": "Rakije od vina proizvode se destilacijom vina na manje od:",
        "options": ["86 % vol.", "37,5 % vol.", "60 % vol.", "96 % vol."],
        "correct": 0
      },
      {
        "question": "Vinjak je:",
        "options": ["Rakija od komine", "Vinska rakija", "Liker od višanja", "Rakija od šljiva"],
        "correct": 1
      },
      {
        "question": "Ponovna destilacija radi jačeg destilata daje:",
        "options": ["Komovicu", "Macerat", "Prepečenicu", "Mošt"],
        "correct": 2
      },
      {
        "question": "Bourbon mora sadržavati najmanje:",
        "options": ["51 % raži", "100 % ječmenog slada", "30 % pšenice", "51 % kukuruza"],
        "correct": 3
      },
      {
        "question": "Travarica je:",
        "options": ["Rakija aromatizirana biljem", "Liker od pelina", "Rakija od vinskog taloga", "Šećerna rakija"],
        "correct": 0
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Calvados je francuska rakija od _______.",
        "answer": "jabuka",
        "hint": "Normandija; voće (genitiv množine)."
      },
      {
        "sentence": "Rum se dobiva od melase ili sirupa šećerne _______.",
        "answer": "trske",
        "hint": "Tropska biljka."
      },
      {
        "sentence": "Gin se aromatizira bobicama _______.",
        "answer": "borovice",
        "hint": "Juniperus."
      },
      {
        "sentence": "Potapanje voća ili bilja u alkohol radi izdvajanja aroma zove se _______.",
        "answer": "maceracija",
        "hint": "Postupak u proizvodnji likera."
      },
      {
        "sentence": "Obojena otopina dobivena maceracijom zove se _______.",
        "answer": "macerat",
        "hint": "Izvedenica od maceracije."
      },
      {
        "sentence": "Whisky sadrži najmanje _______ % alkohola.",
        "answer": "40",
        "hint": "Broj."
      },
      {
        "sentence": "Rakija dobivena destilacijom vinskog taloga zove se _______.",
        "answer": "droždenka",
        "hint": "Talog = drožđe."
      }
    ],
    "learn": {
      "title": "Jaka alkoholna pića i likeri",
      "content":
        '<h3>Definicija i povijest</h3>' +
        '<p><strong>Jaka alkoholna pića</strong> su pića čiji je glavni sastojak etilni alkohol, s <strong>najmanje 15 % vol.</strong> Proizvode se:</p>' +
        '<ul>' +
        '<li><strong>destilacijom</strong> prevrelih sirovina poljoprivrednog podrijetla (rakije, whisky, rum…),</li>' +
        '<li><strong>maceracijom</strong> bilja u alkoholu,</li>' +
        '<li><strong>dodavanjem aroma i sladila</strong> alkoholu (likeri).</li>' +
        '</ul>' +
        '<p>Većina destiliranih pića na tržištu ima oko <strong>28–45 % vol.</strong> (rakije od voća i vina najmanje 37,5 %, whisky najmanje 40 %), a likeri od 15 % naviše.</p>' +
        '<p><strong>Povijest:</strong> Arapi su u 8. i 9. st. destilirali aromatsko i ljekovito bilje; u 11. st. razvija se destilacija alkohola; od 13. st. proizvode se alkoholni destilati u Europi i Kini; u 17. st. uvodi se dvostruka destilacija, u 19. st. rektifikacija.</p>' +

        '<h3>Destilacija i dozrijevanje</h3>' +
        '<p><strong>Destilacija</strong> je odvajanje <strong>hlapivih od nehlapivih tvari</strong> zagrijavanjem i naknadnim hlađenjem para. Destilat je uglavnom alkohol i voda uz manje količine drugih spojeva. <strong>Destilacija uvijek slijedi nakon fermentacije</strong> — sav alkohol nastaje vrenjem, destilacija ga samo koncentrira.</p>' +
        '<p><strong>Cilj:</strong> povećati koncentraciju alkohola i izdvojiti poželjne aromatske spojeve, a ukloniti nepoželjne (prvijenac, patoka).</p>' +
        '<ul>' +
        '<li><strong>Redestilacija</strong> — ponovna destilacija za jači destilat; takva rakija zove se <strong>prepečenica</strong>.</li>' +
        '<li><strong>Rektifikacija</strong> — višestruko pročišćavanje alkohola u kolonama (vodka, neutralni alkohol).</li>' +
        '<li><strong>Dozrijevanje</strong> — oplemenjivanje destilata, najčešće u <strong>hrastovim bačvama</strong>; mijenjaju se boja, aroma i okus. Traje od nekoliko dana do više od 10 godina.</li>' +
        '</ul>' +

        '<h3>Rakije</h3>' +
        '<p>Dobivaju se destilacijom prevrelog soka, masulja ili komine voća, grožđa, žitarica ili drugih sirovina. <strong>Ne smiju se dodavati alkohol, šećer ni arome.</strong></p>' +
        '<h4>Rakije od vina (brandy)</h4>' +
        '<p>Isključivo od <strong>vinskog destilata</strong> (destilacija vina na <strong>manje od 86 % vol.</strong>); gotov proizvod najmanje <strong>37,5 %</strong>.</p>' +
        '<table>' +
        '<tr><th>Piće</th><th>Obilježja</th></tr>' +
        '<tr><td><strong>Vinjak</strong></td><td>hrvatska vinska rakija („hrvatski konjak”): najmanje 1 godinu u hrastovim spremnicima ili 6 mjeseci u hrastovim bačvama</td></tr>' +
        '<tr><td><strong>Stari vinjak</strong></td><td>najmanje 3 godine u hrastovim bačvama</td></tr>' +
        '<tr><td><strong>Cognac</strong></td><td>isključivo francuska pokrajina <strong>Charente</strong>; vino se destilira <strong>dvaput</strong> u bakrenim kotlovima i dozrijeva u hrastovim bačvama</td></tr>' +
        '<tr><td><strong>Armagnac</strong></td><td>pokrajina <strong>Gaskonja</strong>; destilira se <strong>samo jednom</strong></td></tr>' +
        '<tr><td><strong>Sherry brandy</strong></td><td>španjolska pokrajina Jerez</td></tr>' +
        '<tr><td><strong>Metaxa</strong></td><td>grčki brandy; kvaliteta označena zvjezdicama</td></tr>' +
        '</table>' +
        '<h4>Rakije od grožđa i komine</h4>' +
        '<ul>' +
        '<li><strong>Loza (lozovača)</strong> — destilacija prevrelog grožđanog <strong>masulja</strong>.</li>' +
        '<li><strong>Komovica</strong> — destilacija fermentirane grožđane <strong>komine</strong>; najmanje 37,5 %.</li>' +
        '<li><strong>Droždenka</strong> — destilacija <strong>vinskog taloga</strong>.</li>' +
        '<li><strong>Biska</strong> (istarska, s <strong>imelom</strong>), <strong>ruta</strong> (s rutom), <strong>medica</strong> (s dodanim <strong>medom</strong>), <strong>travarica</strong> (aromatizirana raznim aromatičnim biljem) — aromatizirane, „specijalne” rakije.</li>' +
        '</ul>' +
        '<h4>Rakije od voća</h4>' +
        '<p>Fermentacijom i destilacijom voća, <strong>bez aromatiziranja</strong>; najmanje 37,5 %. Šljivovica, rakija od kruške, jabuke, marelice, smokve, trešnje, višnje.</p>' +
        '<ul>' +
        '<li><strong>Calvados</strong> — francuska rakija od <strong>jabuka</strong> (Normandija), najmanje 2 godine u hrastovim bačvama.</li>' +
        '<li><strong>Applejack</strong> — američka rakija od jabuka, dozrijeva oko 5 godina.</li>' +
        '<li><strong>Stara šljivovica</strong> — najmanje 12 mjeseci u slavonskoj hrastovini; <strong>slavonska šljivovica</strong> — najmanje 18 mjeseci.</li>' +
        '</ul>' +
        '<h4>Šećerne rakije i tequila</h4>' +
        '<ul>' +
        '<li><strong>Rum</strong> — fermentacija i destilacija <strong>melase ili sirupa šećerne trske</strong>; vrste: tamni, zlatni, premium, svijetli, aromatizirani. <strong>Domaći rum („room”)</strong> je aromatizirani etilni alkohol, tradicionalna zamjena.</li>' +
        '<li><strong>Tequila</strong> — meksičko piće od fermentiranog soka <strong>agave</strong>; zaštićena oznaka izvornosti.</li>' +
        '</ul>' +
        '<h4>Žitne rakije</h4>' +
        '<p>Destilacija prevrele žitne komine; škrob se prije vrenja mora pretvoriti u fermentabilne šećere (sladom ili enzimima).</p>' +
        '<table>' +
        '<tr><th>Piće</th><th>Obilježja</th></tr>' +
        '<tr><td><strong>Whisky / whiskey</strong></td><td>od žitnog slada; <strong>najmanje 3 godine</strong> u hrastovim bačvama; najmanje <strong>40 %</strong></td></tr>' +
        '<tr><td>Scotch</td><td>škotski; aroma treseta i hrastovih bačava</td></tr>' +
        '<tr><td>Irski whiskey</td><td>blaži; trostruka destilacija</td></tr>' +
        '<tr><td>Bourbon</td><td>američki; najmanje <strong>51 % kukuruza</strong>; bačve od paljenog američkog hrasta</td></tr>' +
        '<tr><td>Kanadski whisky</td><td>najčešće od raži; najmanje 3 godine</td></tr>' +
        '<tr><td><strong>Gin</strong></td><td>žitna rakija aromatizirana <strong>bobicama borovice</strong>; London gin se aromatizira tijekom redestilacije</td></tr>' +
        '<tr><td><strong>Vodka</strong></td><td>bistra, neutralnog okusa i mirisa; od žitarica ili krumpira, višestruka destilacija i rektifikacija; najčešće 40–55 %</td></tr>' +
        '</table>' +

        '<h3>Likeri</h3>' +
        '<p><strong>Likeri</strong> sadrže <strong>najmanje 15 % alkohola i 70–100 g/L šećera</strong>. <strong>Maceracija</strong> = potapanje voća, bilja ili začina u alkohol radi izdvajanja aroma, boje i drugih spojeva; dobivena obojena otopina je <strong>macerat</strong>.</p>' +
        '<table>' +
        '<tr><th>Skupina</th><th>Primjeri</th></tr>' +
        '<tr><td>Od bilja i začina (anis)</td><td><strong>pastis</strong> (FR, zamućuje se s vodom), <strong>ouzo</strong> (GR, nacionalno piće), <strong>sambuca</strong> (IT, zvjezdasti anis), <strong>absint</strong> (pelin, anis, komorač; vrlo visoka jakost)</td></tr>' +
        '<tr><td>Voćni</td><td><strong>višnjevac</strong> (maceracija višanja uz šećer), <strong>orahovac</strong> (zeleni orasi, slatkasto-gorak), <strong>limoncello</strong> (kora limuna)</td></tr>' +
        '<tr><td>Krem likeri</td><td>najmanje <strong>250 g/L šećera</strong> i 15 % alkohola; s mlijekom, vrhnjem, jajima, kavom, čokoladom ili lješnjakom</td></tr>' +
        '</table>' +
        '<h4>Hrvatska jaka alkoholna pića</h4>' +
        '<p>Stara i slavonska šljivovica · loza · travarica · biska · <strong>pelinkovac</strong> (biljni liker u kojem dominira pelin) · <strong>zadarski maraschino</strong> (liker od višnje maraske, najmanje 32 %).</p>' +
        '<p><strong>Punč</strong> — topli miješani napitak od jakog pića (najčešće ruma), vode ili čaja, šećera, limuna i začina.</p>' +
        '<div class="warning-box"><strong>Oprez s ispitnim ključem:</strong> u jednom studentskom sažetku kao „voćni liker” stoji medica. Medica je rakija ili liker s dodanim <strong>medom</strong>, a ne voćni liker; tipični voćni likeri su višnjevac, orahovac i limoncello. Među odgovorima cognac, calvados, pelinkovac i absint jedino medica nije ni rakija od vina/voća ni biljni liker — zato je bila označena kao točna.</div>' +

        '<h3>Kvaliteta i nedostaci</h3>' +
        '<ul>' +
        '<li><strong>Jačina</strong> — alkoholna jakost.</li>' +
        '<li><strong>Finoća</strong> — ovisi o aromatskim tvarima; pokazatelj kakvoće i starosti.</li>' +
        '<li><strong>Punoća</strong> — ovisi o ekstraktu, šećeru i kiselinama.</li>' +
        '<li><strong>Harmonija</strong> — sklad alkohola, aroma, ekstrakta i kiselina.</li>' +
        '</ul>' +
        '<p><strong>Nedostaci:</strong> kiselost, pljesnivost, miris na sumporovodik, okus na košticu, zagorjelost, metal, prvijenac, užeglost, pretamna boja — najčešće zbog nepravilne fermentacije, destilacije ili čuvanja.</p>'
    }
  },

  "meat": {
    "name": "Meso i mesni proizvodi",
    "icon": "fa-drumstick-bite",
    "color": "#dc2626",
    "flashcards": [
      {
        "question": "Što je MESO?",
        "answer": "Mišićno tkivo sa ili bez kože, jestive iznutrice, masno tkivo i krv; izvori su stoka, perad i divljač.",
        "explanation": "Najviše se proizvode meso peradi i svinjetina."
      },
      {
        "question": "Koja tkiva čine meso?",
        "answer": "Mišićno (glavni jestivi dio), masno (okus, sočnost, mramoriranost), vezivno (žilavost) te koštano i hrskavično (juhe, temeljci).",
        "explanation": "Iznutrice su po sastavu slične mesu i imaju malo masti."
      },
      {
        "question": "Crveno vs bijelo meso?",
        "answer": "Crveno: govedina, teletina, svinjetina, ovčetina, janjetina, kozletina, konjetina. Bijelo: perad – piletina, puretina, pačetina, guščetina.",
        "explanation": "Pačetina je bijelo meso (perad)."
      },
      {
        "question": "Koji su postupci primarne obrade (klanja)?",
        "answer": "Omamljivanje, iskrvarenje, uklanjanje kože ili perja, vađenje organa i rasijecanje trupova – u klaonici pod veterinarskim nadzorom.",
        "explanation": "Klaonice su pod veterinarsko-sanitarnim nadzorom."
      },
      {
        "question": "Što je RIGOR MORTIS?",
        "answer": "Mrtvačka ukočenost 2–8 sati nakon klanja: mišići se ukoče i gube elastičnost, a pH mesa pada s oko 7,0 na oko 5,5.",
        "explanation": "Meso u ukočenosti je tvrdo – ne priprema se."
      },
      {
        "question": "Zašto pH mesa pada nakon klanja?",
        "answer": "Zbog glikolize: bez kisika se glikogen u mišiću razgrađuje u mliječnu kiselinu.",
        "explanation": "Pad pH usporava bakterije i omogućuje zrenje."
      },
      {
        "question": "Što je ZRENJE mesa?",
        "answer": "Skup promjena nakon ukočenosti koje poboljšavaju okus, aromu, mekoću i probavljivost; meso se prije prodaje obično hladi oko šest dana.",
        "explanation": "Enzimi razgrađuju mišićne bjelančevine."
      },
      {
        "question": "Najvrjedniji dijelovi govedine?",
        "answer": "Biftek (pisanica) – najmekši i najskuplji dio; zatim slabina i but (mekan, s malo masnoće).",
        "explanation": "Ovčetina: najvrjedniji je but."
      },
      {
        "question": "Najvažniji dijelovi svinjetine?",
        "answer": "File (pisana pečenica) – najcjenjeniji; but – najveći, sirovina za pršut i šunku; potrbušina – najmasnija (carsko meso).",
        "explanation": "Od potrbušine se radi panceta."
      },
      {
        "question": "Prsa vs batak peradi?",
        "answer": "Prsa: bogata bjelančevinama, siromašna mastima. Batak i zabatak: tamnije, ukusnije i aromatičnije meso.",
        "explanation": "Patka ima više masti, željeza i selena od ostale peradi."
      },
      {
        "question": "Kakav je kemijski sastav mesa?",
        "answer": "Voda 65–75 %, bjelančevine 15–20 %, masti 3–30 %, ugljikohidrati 0,05–0,9 % (glikogen); B vitamini, željezo, cink, selen, fosfor.",
        "explanation": "Masti najviše variraju."
      },
      {
        "question": "Prehrambene posebnosti vrsta mesa?",
        "answer": "Govedina: manje masti, više željeza i B12. Svinjetina: više masti, tiamina. Janjetina: najbolja probavljivost. Perad: više bjelančevina, manje zasićenih masti.",
        "explanation": "Svinjetina je bogata vitaminom B1 (tiamin)."
      },
      {
        "question": "Kako se ocjenjuje svježina mesa?",
        "answer": "Površina suha, umjereno masna i elastična; boja ovisi o mioglobinu; mekoća o vezivnom tkivu i zrenju; okus i miris svojstveni vrsti.",
        "explanation": "Perad je svjetlija, govedina i janjetina tamnije."
      },
      {
        "question": "Koji su oblici kvarenja mesa?",
        "answer": "Gnjilenje (najopasnije – otrovni spojevi, miris truleži), sluzavost, pljesnivost i smrdljivo zrenje.",
        "explanation": "Uzroci: mikroorganizmi i fizikalno-kemijski čimbenici."
      },
      {
        "question": "Kako se meso hladi i zamrzava?",
        "answer": "Hlađeno se skladišti na −1 do +2 °C. Zamrzava se ispod −12 °C; na −18 °C čuva se do 12 mjeseci. Odmrzava se polako, u hladnjaku.",
        "explanation": "Dubina trupa: govedina/svinjetina/ovčetina ispod 7 °C, perad ispod 4 °C."
      },
      {
        "question": "Brzo vs sporo zamrzavanje mesa?",
        "answer": "Brzo: sitni kristali leda, manje oštećenje tkiva. Sporo: veliki kristali, veći kalo (gubitak soka) pri odmrzavanju, jača denaturacija bjelančevina.",
        "explanation": "Kalo = gubitak mase."
      },
      {
        "question": "Soljenje vs salamurenje?",
        "answer": "Soljenje: obrada kuhinjskom soli. Salamurenje: obrada smjesom soli, nitrata i nitrita.",
        "explanation": "Nitriti daju stabilnu crvenu boju i štite od bakterija."
      },
      {
        "question": "Toplinski obrađeni vs neobrađeni mesni proizvodi?",
        "answer": "Obrađeni: soljenje/salamurenje + pasterizacija ili sterilizacija, ± dimljenje (šunka, hrenovke, pašteta). Neobrađeni: sušenje, zrenje, fermentacija (pršut, kulen).",
        "explanation": "Fermentacija: šećer → mliječna kiselina, pH pada."
      },
      {
        "question": "Koji su trajni suhomesnati proizvodi?",
        "answer": "Pršut, suha šunka, suha lopatica, buđola, suha pečenica, suha slanina i panceta.",
        "explanation": "Panceta je od svinjske potrbušine."
      },
      {
        "question": "Trajne vs obarene kobasice?",
        "answer": "Trajne: fermentirane i sušene, bez toplinske obrade (kulen, zimska salama, čajna, srijemska). Obarene: toplinski obrađene vrućom vodom ili parom (hrenovke).",
        "explanation": "Polutrajne (polusuhe) kobasice kraće se suše i često dime."
      },
      {
        "question": "Što je MESNI PRIPRAVAK?",
        "answer": "Svježe usitnjeno meso s dodacima (sol, začini), bez toplinske obrade i sušenja – npr. pljeskavica i ćevapi.",
        "explanation": "Kratkotrajan proizvod; peče se prije konzumacije."
      }
    ],
    "quiz": [
      {
        "question": "Bijelo meso je:",
        "options": ["Kozletina", "Pačetina", "Svinjetina", "Konjetina"],
        "correct": 1
      },
      {
        "question": "Crveno meso NE uključuje:",
        "options": ["Govedinu", "Janjetinu", "Pačetinu", "Kozletinu"],
        "correct": 2
      },
      {
        "question": "Rigor mortis nastupa nakon klanja za:",
        "options": ["2–8 dana", "2–8 tjedana", "10–15 minuta", "2–8 sati"],
        "correct": 3
      },
      {
        "question": "pH mesa nakon klanja:",
        "options": ["Pada s oko 7,0 na oko 5,5", "Raste s oko 5,5 na oko 7,0", "Ostaje stalan", "Pada ispod 3,0"],
        "correct": 0
      },
      {
        "question": "Pad pH mesa nakon klanja posljedica je:",
        "options": ["Butrifikacije", "Glikolize", "Destilacije", "Karamelizacije"],
        "correct": 1
      },
      {
        "question": "Najmekši i najskuplji dio govedine je:",
        "options": ["Potrbušina", "Vrat", "Biftek (pisanica)", "Koljenica"],
        "correct": 2
      },
      {
        "question": "Panceta je trajni suhomesnati proizvod od:",
        "options": ["Svinjskog buta", "Goveđeg buta", "Svinjskog vrata", "Svinjske potrbušine"],
        "correct": 3
      },
      {
        "question": "Brzim zamrzavanjem mesa nastaju:",
        "options": ["Sitni kristali leda", "Veliki kristali leda", "Oštećene stanične membrane", "Veći gubitci soka"],
        "correct": 0
      },
      {
        "question": "Što NIJE učinak sporog zamrzavanja mesa?",
        "options": ["Veći kalo odmrzavanja", "Nastanak sitnih kristala", "Jača denaturacija bjelančevina", "Veće oštećenje tkiva"],
        "correct": 1
      },
      {
        "question": "Salamurenje je obrada mesa:",
        "options": ["Samo kuhinjskom soli", "Dimom bukova drva", "Solju, nitratima i nitritima", "Octom i začinima"],
        "correct": 2
      },
      {
        "question": "Hrenovke su primjer:",
        "options": ["Trajnih kobasica", "Trajnih suhomesnatih proizvoda", "Mesnih pripravaka", "Obarenih kobasica"],
        "correct": 3
      },
      {
        "question": "Pljeskavica je:",
        "options": ["Mesni pripravak", "Trajna kobasica", "Obarena kobasica", "Mesna konzerva"],
        "correct": 0
      },
      {
        "question": "Kulen je:",
        "options": ["Obarena kobasica", "Trajna kobasica", "Mesni pripravak", "Kuhani mesni proizvod"],
        "correct": 1
      },
      {
        "question": "Najopasniji oblik kvarenja mesa je:",
        "options": ["Pljesnivost", "Sluzavost", "Gnjilenje", "Smrdljivo zrenje"],
        "correct": 2
      },
      {
        "question": "Ohlađeno meso optimalno se skladišti na:",
        "options": ["+8 do +12 °C", "−18 °C", "+15 °C", "−1 do +2 °C"],
        "correct": 3
      },
      {
        "question": "Boja mesa ovisi o količini:",
        "options": ["Mioglobina", "Kolagena", "Glikogena", "Kazeina"],
        "correct": 0
      },
      {
        "question": "Udio bjelančevina u mesu je oko:",
        "options": ["2–5 %", "15–20 %", "40–50 %", "65–75 %"],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Mrtvačka ukočenost mesa zove se rigor _______.",
        "answer": "mortis",
        "hint": "Latinski."
      },
      {
        "sentence": "Salamurenje je obrada mesa smjesom soli, nitrata i _______.",
        "answer": "nitrita",
        "hint": "Slično nitratima."
      },
      {
        "sentence": "Smrznuto meso može se na −18 °C čuvati do _______ mjeseci.",
        "answer": "12",
        "hint": "Broj."
      },
      {
        "sentence": "Najcjenjeniji dio svinjetine je file ili pisana _______.",
        "answer": "pečenica",
        "hint": "Od nje se radi i suhi proizvod istog imena."
      },
      {
        "sentence": "Najmasniji dio svinjskog trupa, potrbušina, zove se i _______ meso.",
        "answer": "carsko",
        "hint": "Plemićka titula."
      },
      {
        "sentence": "Boja mesa ovisi o količini _______.",
        "answer": "mioglobina",
        "hint": "Pigment mišića."
      },
      {
        "sentence": "Nakon klanja glikogen se razgrađuje u _______ kiselinu.",
        "answer": "mliječnu",
        "hint": "Ista kiselina kao u jogurtu."
      }
    ],
    "learn": {
      "title": "Meso i mesni proizvodi",
      "content":
        '<h3>Proizvodnja, definicija i građa</h3>' +
        '<p>Proizvodnja i potrošnja mesa u svijetu kontinuirano rastu; najviše se proizvode <strong>meso peradi i svinjetina</strong>. Potrošnja je najveća u razvijenim zemljama, a Hrvatska je među zemljama s relativno visokom potrošnjom.</p>' +
        '<p><strong>Meso</strong> obuhvaća mišićno tkivo sa ili bez kože, jestive iznutrice, masna tkiva i krv. <strong>Izvori:</strong> stoka, perad i divljač.</p>' +
        '<table>' +
        '<tr><th>Tkivo</th><th>Značaj</th></tr>' +
        '<tr><td>Mišićno</td><td>glavni jestivi dio; mišićna vlakna</td></tr>' +
        '<tr><td>Masno</td><td>okus, sočnost, mekoća; <strong>mramorirano meso</strong> ima mast unutar mišića</td></tr>' +
        '<tr><td>Vezivno</td><td>povećava žilavost, smanjuje prehrambenu vrijednost</td></tr>' +
        '<tr><td>Koštano i hrskavično</td><td>manja prehrambena važnost; juhe i temeljci</td></tr>' +
        '<tr><td>Iznutrice</td><td>po sastavu slične mesu, malo masti</td></tr>' +
        '</table>' +
        '<table>' +
        '<tr><th>Crveno meso</th><th>Bijelo meso</th></tr>' +
        '<tr><td>govedina, teletina, svinjetina, ovčetina, janjetina, kozletina, konjetina</td><td>perad: piletina, puretina, <strong>pačetina</strong>, guščetina</td></tr>' +
        '</table>' +

        '<h3>Klanje, ukočenost i zrenje</h3>' +
        '<p><strong>Klaonice</strong> su objekti u kojima se životinje kolju pod veterinarsko-sanitarnim nadzorom. Postupci: omamljivanje → iskrvarenje → uklanjanje kože ili perja → vađenje organa → rasijecanje trupova.</p>' +
        '<ul>' +
        '<li><strong>Glikoliza post mortem</strong> — nakon klanja nema dotoka kisika, pa se glikogen u mišićima razgrađuje u <strong>mliječnu kiselinu</strong>; pH pada.</li>' +
        '<li><strong>Rigor mortis</strong> (mrtvačka ukočenost) — nastupa <strong>2–8 sati</strong> nakon klanja; mišići postaju tvrdi i gube elastičnost, a <strong>pH pada s oko 7,0 na oko 5,5</strong>.</li>' +
        '<li><strong>Zrenje</strong> — promjene koje poboljšavaju okus, aromu, mekoću i probavljivost; zato se meso prije prodaje obično hladi oko <strong>šest dana</strong>.</li>' +
        '</ul>' +

        '<h3>Meso na tržištu</h3>' +
        '<table>' +
        '<tr><th>Vrsta</th><th>Najvrjedniji dijelovi</th></tr>' +
        '<tr><td>Govedina</td><td><strong>biftek (pisanica)</strong> — najmekši i najskuplji; slabina; but (mekan, vrlo malo masnoće)</td></tr>' +
        '<tr><td>Svinjetina</td><td><strong>file (pisana pečenica)</strong> — najcjenjeniji; <strong>but</strong> — najveći dio, sirovina za pršut i šunku; <strong>potrbušina</strong> — najmasnija, „carsko meso”</td></tr>' +
        '<tr><td>Ovčetina</td><td><strong>but</strong> — mekoća i sočnost; leđa i slabine bogati mišićima i mastima</td></tr>' +
        '<tr><td>Perad</td><td><strong>prsa</strong> — puno bjelančevina, malo masti; <strong>batak i zabatak</strong> — tamnije, ukusnije, aromatičnije meso</td></tr>' +
        '</table>' +

        '<h3>Kemijski sastav i prehrambena vrijednost</h3>' +
        '<p>Voda <strong>65–75 %</strong> · bjelančevine <strong>15–20 %</strong> · masti <strong>3–30 %</strong> · ugljikohidrati 0,05–0,9 % (glikogen) · vitamini B skupine · minerali: željezo, cink, selen, fosfor.</p>' +
        '<ul>' +
        '<li><strong>Govedina</strong> — manje masti, više željeza, selena i vitamina B12.</li>' +
        '<li><strong>Svinjetina</strong> — više masti, tiamina (B1) i biotina.</li>' +
        '<li><strong>Janjetina</strong> — najbolja probavljivost; bogata B12 i fosforom.</li>' +
        '<li><strong>Piletina i puretina</strong> — više bjelančevina, manje zasićenih masnih kiselina od crvenog mesa.</li>' +
        '<li><strong>Patka</strong> — više masti, željeza i selena od ostale peradi.</li>' +
        '</ul>' +

        '<h3>Kvaliteta, svježina i kvarenje</h3>' +
        '<p><strong>Svježe meso:</strong> površina suha, umjereno masna i elastična; <strong>boja</strong> ovisi o količini <strong>mioglobina</strong> (perad svjetlija, govedina i janjetina tamnije); mekoća ovisi o vezivnom tkivu i zrenju; okus i miris svojstveni vrsti.</p>' +
        '<ul>' +
        '<li><strong>Gnjilenje</strong> — najopasnije kvarenje: razgradnja bjelančevina uz otrovne spojeve i miris truleži.</li>' +
        '<li><strong>Sluzavost</strong> — bakterije i kvasci pri povišenoj temperaturi i vlazi.</li>' +
        '<li><strong>Pljesnivost</strong> — površinsko kvarenje plijesnima.</li>' +
        '<li><strong>Smrdljivo zrenje</strong> — promjena boje, neugodan miris, omekšavanje.</li>' +
        '</ul>' +

        '<h3>Hlađenje i zamrzavanje</h3>' +
        '<ul>' +
        '<li><strong>Hlađenje</strong> — trupovi se hlade u dubini ispod 7 °C (govedina, svinjetina, ovčetina), perad ispod 4 °C; skladištenje na <strong>−1 do +2 °C</strong>.</li>' +
        '<li><strong>Zamrzavanje</strong> — ispod <strong>−12 °C</strong>; na <strong>−18 °C</strong> meso se čuva do <strong>12 mjeseci</strong>.</li>' +
        '<li><strong>Odmrzavanje</strong> — polako, u hladnjaku.</li>' +
        '</ul>' +
        '<table>' +
        '<tr><th>Brzo zamrzavanje</th><th>Sporo zamrzavanje</th></tr>' +
        '<tr><td><strong>sitni kristali leda</strong></td><td>veliki kristali leda</td></tr>' +
        '<tr><td>manje oštećenje stanica</td><td>veće oštećenje mišićnog tkiva i staničnih membrana</td></tr>' +
        '<tr><td>mali gubitak soka</td><td>veći <strong>kalo</strong> (gubitak soka) pri odmrzavanju, intenzivnija denaturacija bjelančevina</td></tr>' +
        '</table>' +

        '<h3>Mesni proizvodi</h3>' +
        '<p><strong>Soljenje</strong> = obrada kuhinjskom soli; <strong>salamurenje</strong> = obrada smjesom <strong>soli, nitrata i nitrita</strong>.</p>' +
        '<table>' +
        '<tr><th>Toplinski obrađeni</th><th>Toplinski neobrađeni</th></tr>' +
        '<tr><td>soljenje ili salamurenje + <strong>pasterizacija</strong> (do 100 °C) ili <strong>sterilizacija</strong> (iznad 100 °C), može i dimljenje</td><td>soljenje ili salamurenje + <strong>sušenje, zrenje i fermentacija</strong>, bez toplinske obrade</td></tr>' +
        '<tr><td>dimljena šunka, vratina i slanina, kuhana šunka, mesni doručak, pašteta, <strong>hrenovke</strong>, šunka u ovitku</td><td>trajni suhomesnati proizvodi i trajne kobasice</td></tr>' +
        '</table>' +
        '<ul>' +
        '<li><strong>Zrenje</strong> poboljšava senzorska svojstva; <strong>fermentacija</strong> — mikroorganizmi pretvaraju šećere u mliječnu kiselinu, pH pada.</li>' +
        '<li><strong>Trajni suhomesnati proizvodi</strong>: pršut, suha šunka, suha lopatica, buđola, suha pečenica, suha slanina, <strong>panceta</strong> (od svinjske potrbušine).</li>' +
        '<li><strong>Trajne kobasice</strong>: <strong>kulen</strong>, zimska salama, čajna kobasica, srijemska kobasica.</li>' +
        '<li><strong>Fermentirane polusuhe (polutrajne) kobasice</strong>: fermentacija, kraće sušenje i zrenje, često dimljenje.</li>' +
        '<li><strong>Obarene kobasice</strong>: nadjev od fino usitnjenog mesa, toplinski obrađen vrućom vodom ili parom — npr. <strong>hrenovke</strong>.</li>' +
        '<li><strong>Mesni pripravci</strong>: svježe usitnjeno meso sa soli i začinima, bez toplinske obrade — npr. <strong>pljeskavica</strong>, ćevapi.</li>' +
        '</ul>' +
        '<div class="tip-box"><strong>Tradicionalni hrvatski mesni proizvodi</strong> zaštićeni na razini EU uključuju npr. istarski, krčki, dalmatinski i drniški pršut te slavonski i baranjski kulen.</div>'
    }
  },

  "fish": {
    "name": "Ribe i riblji proizvodi",
    "icon": "fa-fish",
    "color": "#0284c7",
    "flashcards": [
      {
        "question": "Što je RIBARSTVO?",
        "answer": "Gospodarska grana koja obuhvaća uzgoj i ulov riba i drugih vodenih organizama; dijeli se na morsko i slatkovodno.",
        "explanation": "Akvakultura = uzgoj; marikultura = uzgoj morskih organizama."
      },
      {
        "question": "Koja je riba PLAVA?",
        "answer": "Sitna: srdela, inćun, skuša, lokarda, papalina. Krupna: tuna, palamida.",
        "explanation": "Bakalar NIJE plava riba."
      },
      {
        "question": "Koja je riba BIJELA?",
        "answer": "Oslić, bakalar, list, lubin, škarpina, gof.",
        "explanation": "Uzgojni lubin = brancin."
      },
      {
        "question": "Hrskavičnjače, mekušci i rakovi?",
        "answer": "Hrskavičnjače: morski pas, raža, mačka. Mekušci: glavonošci (lignja, sipa, hobotnica) i školjkaši (dagnja, kamenica). Rakovi: jastog, hlap, škamp, kozica.",
        "explanation": "Slatkovodne ribe: pastrva, som, smuđ, štuka."
      },
      {
        "question": "Kakva je hranjiva vrijednost ribe?",
        "answer": "Voda 60–80 %, bjelančevine 12–24 % (visoke biološke vrijednosti, lako probavljive), masti 0,7–20 %; vitamini A, D, E i B; jod, selen, cink, fosfor.",
        "explanation": "Riba je važan izvor joda."
      },
      {
        "question": "Kako se ribe dijele po masnoći?",
        "answer": "Nemasne: oslić, bakalar, škarpina. Srednje masne: srdela, orada, brancin. Masne: skuša, tuna, losos, haringa.",
        "explanation": "Masne ribe najbogatije su omega-3."
      },
      {
        "question": "Koje su omega-3 masne kiseline iz ribe?",
        "answer": "EPA i DHA – najvažnije višestruko nezasićene masne kiseline u ribi.",
        "explanation": "Štite srce i krvne žile."
      },
      {
        "question": "Kako prepoznati svježu ribu?",
        "answer": "Bistre, izbočene oči, crvene škrge, vlažna i sjajna koža, rijetka prozirna sluz te čvrsto i elastično meso.",
        "explanation": "Gusta, mutna sluz NIJE znak svježine."
      },
      {
        "question": "Koje promjene nastaju nakon izlova?",
        "answer": "Pojačano lučenje sluzi → rigor mortis (posmrtna ukočenost) → zrenje → kvarenje.",
        "explanation": "Riba se kvari brže od mesa."
      },
      {
        "question": "Što je TRIMETILAMIN (TMA)?",
        "answer": "Spoj odgovoran za karakterističan „riblji” miris tijekom zrenja i kvarenja ribe.",
        "explanation": "Više TMA = manje svježa riba."
      },
      {
        "question": "Kako se riba hladi i zamrzava?",
        "answer": "Hladi se odmah nakon izlova, najčešće ledom (poleđivanje), i čuva do 7 dana ispod 4 °C. Zamrznuta: −18 °C u dubini, čuva se do godinu dana.",
        "explanation": "Smrznuti proizvodi (npr. panirani) čuvaju se ispod −18 °C."
      },
      {
        "question": "Riblje konzerve vs polukonzerve?",
        "answer": "Konzerve: sterilizirane u hermetičkoj ambalaži, trajnost oko 3 godine (sardine, tuna). Polukonzerve: pasterizirane ili ne, do 18 mjeseci (marinade, slani inćuni, kavijar).",
        "explanation": "Marinada je polukonzerva."
      },
      {
        "question": "Što je KAVIJAR?",
        "answer": "Soljena ikra jesetre; „crveni kavijar” je ikra lososa ili pastrve.",
        "explanation": "Ubraja se u riblje polukonzerve."
      },
      {
        "question": "Soljena, sušena i dimljena riba?",
        "answer": "Soljenje: jedna od najstarijih metoda, za morsku i slatkovodnu ribu. Sušenje: na zraku ili u kontroliranim uvjetima. Dimljenje: toplo ili hladno (losos, haringa).",
        "explanation": "Soljenje NE konzervira isključivo morsku ribu."
      },
      {
        "question": "Kolika je preporuka unosa ribe?",
        "answer": "Dvije porcije ribe tjedno (oko 240 g), od čega jedna porcija masne ribe.",
        "explanation": "Manji rizik od srčanih bolesti, pretilosti, metaboličkog sindroma i depresije."
      },
      {
        "question": "Koji su rizici konzumacije ribe?",
        "answer": "Histamin (masne ribe), paraziti (Anisakis), živa i drugi teški metali te mikroplastika.",
        "explanation": "Anisakis: rizik kod sirove ribe (sushi)."
      }
    ],
    "quiz": [
      {
        "question": "Koja riba NIJE plava riba?",
        "options": ["Lokarda", "Palamida", "Bakalar", "Skuša"],
        "correct": 2
      },
      {
        "question": "Bijela riba je:",
        "options": ["Inćun", "Tuna", "Palamida", "Oslić"],
        "correct": 3
      },
      {
        "question": "List se svrstava u:",
        "options": ["Bijelu ribu", "Plavu ribu", "Hrskavičnjače", "Glavonošce"],
        "correct": 0
      },
      {
        "question": "Marinada se svrstava u:",
        "options": ["Riblje konzerve", "Polukonzerve od ribe", "Smrznute proizvode", "Sušenu ribu"],
        "correct": 1
      },
      {
        "question": "Što NIJE znak svježe ribe?",
        "options": ["Crvene škrge", "Bistre oči", "Gusta, mutna sluz", "Čvrsto elastično meso"],
        "correct": 2
      },
      {
        "question": "Preporučuje se jesti ribu:",
        "options": ["Jednom mjesečno", "Svaki dan po 500 g", "Samo zimi", "Dvaput tjedno"],
        "correct": 3
      },
      {
        "question": "Temperatura u dubini zamrznute ribe mora biti:",
        "options": ["−18 °C", "−4 °C", "0 °C", "−8 °C"],
        "correct": 0
      },
      {
        "question": "Karakterističan riblji miris daje:",
        "options": ["Histamin", "Trimetilamin", "Lecitin", "Mioglobin"],
        "correct": 1
      },
      {
        "question": "Soljenjem se konzervira:",
        "options": ["Isključivo morska riba", "Isključivo slatkovodna riba", "Morska i slatkovodna riba", "Isključivo plava riba"],
        "correct": 2
      },
      {
        "question": "Trajnost ribljih konzervi je oko:",
        "options": ["3 mjeseca", "3 tjedna", "10 godina", "3 godine"],
        "correct": 3
      },
      {
        "question": "Najvažnije omega-3 masne kiseline u ribi su:",
        "options": ["EPA i DHA", "Oleinska i stearinska", "Linolna i palmitinska", "LDL i HDL"],
        "correct": 0
      },
      {
        "question": "Parazit koji se može naći u sirovoj ribi je:",
        "options": ["Salmonella", "Anisakis", "Campylobacter", "Listeria"],
        "correct": 1
      },
      {
        "question": "Skuša, tuna i losos su:",
        "options": ["Nemasne ribe", "Hrskavičnjače", "Masne ribe", "Srednje masne ribe"],
        "correct": 2
      },
      {
        "question": "Uzgoj morskih organizama naziva se:",
        "options": ["Slatkovodno ribarstvo", "Ribolov", "Poleđivanje", "Marikultura"],
        "correct": 3
      },
      {
        "question": "Riblje polukonzerve imaju trajnost do:",
        "options": ["18 mjeseci", "3 godine", "7 dana", "5 godina"],
        "correct": 0
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Uzgoj proizvoda ribarstva zove se _______.",
        "answer": "akvakultura",
        "hint": "Aqua = voda."
      },
      {
        "sentence": "Riblje _______ imaju trajnost do 18 mjeseci.",
        "answer": "polukonzerve",
        "hint": "Marinade, slani inćuni, kavijar."
      },
      {
        "sentence": "Najvažnije omega-3 masne kiseline u ribi su EPA i _______.",
        "answer": "DHA",
        "hint": "Kratica od tri slova."
      },
      {
        "sentence": "Hlađenje ribe ledom naziva se _______.",
        "answer": "poleđivanje",
        "hint": "Od riječi led."
      },
      {
        "sentence": "Svježa riba ima crvene _______.",
        "answer": "škrge",
        "hint": "Dišni organ ribe."
      },
      {
        "sentence": "Spoj odgovoran za riblji miris označava se kraticom _______.",
        "answer": "TMA",
        "hint": "Trimetilamin."
      }
    ],
    "learn": {
      "title": "Ribe i prerađeni proizvodi ribarstva",
      "content":
        '<h3>Ribarstvo</h3>' +
        '<p><strong>Ribarstvo</strong> je gospodarska grana koja obuhvaća uzgoj i ulov riba i drugih vodenih organizama; dijeli se na <strong>morsko i slatkovodno</strong>. <strong>Akvakultura</strong> = uzgoj proizvoda ribarstva; <strong>marikultura</strong> = uzgoj morskih organizama, uglavnom riba i školjkaša.</p>' +

        '<h3>Podjela morskih organizama</h3>' +
        '<table>' +
        '<tr><th>Skupina</th><th>Primjeri</th></tr>' +
        '<tr><td><strong>Plava riba</strong></td><td>sitna: srdela, inćun, skuša, lokarda, papalina · krupna: tuna, palamida</td></tr>' +
        '<tr><td><strong>Bijela riba</strong></td><td>oslić, bakalar, <strong>list</strong>, lubin, škarpina, gof</td></tr>' +
        '<tr><td>Hrskavičnjače</td><td>morski pas, raža, morska mačka</td></tr>' +
        '<tr><td>Mekušci</td><td>glavonošci (lignja, sipa, hobotnica) · školjkaši (dagnja, kamenica, prstac)</td></tr>' +
        '<tr><td>Rakovi</td><td>jastog, hlap, škamp, kozica</td></tr>' +
        '</table>' +
        '<p><strong>Slatkovodno ribarstvo:</strong> pastrva, som, smuđ, štuka; riječni i močvarni rakovi.</p>' +
        '<div class="warning-box"><strong>Zamke:</strong> bakalar NIJE plava riba (bijela je); inćun, tuna, palamida i lokarda NISU bijela riba (plave su); raža je hrskavičnjača.</div>' +

        '<h3>Hranjiva vrijednost</h3>' +
        '<p>Voda <strong>60–80 %</strong> · bjelančevine <strong>12–24 %</strong> (vrlo dobre probavljivosti i visoke biološke vrijednosti) · masti <strong>0,7–20 %</strong> · vitamini B skupine te A, D i E · minerali: jod, cink, selen, fosfor, kalij, kalcij.</p>' +
        '<table>' +
        '<tr><th>Masnoća</th><th>Primjeri</th></tr>' +
        '<tr><td>Nemasne</td><td>oslić, bakalar, škarpina</td></tr>' +
        '<tr><td>Srednje masne</td><td>srdela, orada, brancin</td></tr>' +
        '<tr><td>Masne</td><td>skuša, tuna, losos, haringa</td></tr>' +
        '</table>' +
        '<p><strong>Omega-3 masne kiseline EPA i DHA</strong> najvažnije su masne kiseline u ribi.</p>' +

        '<h3>Kakvoća ribe</h3>' +
        '<p><strong>Svježa riba:</strong> bistre oči, crvene škrge, vlažna i sjajna koža, rijetka i prozirna sluz, čvrsto i elastično meso. <strong>Gusta, mutna sluz nije znak svježine.</strong></p>' +
        '<p><strong>Promjene nakon izlova:</strong> pojačano lučenje sluzi → <strong>rigor mortis</strong> (posmrtna ukočenost) → zrenje → kvarenje. <strong>Trimetilamin (TMA)</strong> daje karakterističan „riblji” miris.</p>' +

        '<h3>Konzerviranje ribe</h3>' +
        '<ul>' +
        '<li><strong>Hlađenje</strong> — odmah nakon izlova, najčešće <strong>poleđivanjem</strong>; čuva se do <strong>7 dana ispod 4 °C</strong>.</li>' +
        '<li><strong>Zamrzavanje</strong> — temperatura u dubini ribe mora biti <strong>−18 °C</strong>; čuva se do godinu dana na −18 °C.</li>' +
        '<li><strong>Riblje konzerve</strong> — sterilizacija u hermetički zatvorenoj ambalaži (sardine, papaline, inćuni, tuna); trajnost oko <strong>3 godine</strong>.</li>' +
        '<li><strong>Riblje polukonzerve</strong> — pasterizirane ili nepasterizirane, trajnost do <strong>18 mjeseci</strong>: <strong>marinade</strong>, slani inćuni, <strong>kavijar</strong> (soljena ikra jesetre) i riblja ikra.</li>' +
        '<li><strong>Smrznuti proizvodi</strong> — smrznuta i panirana riba, čuvaju se ispod −18 °C.</li>' +
        '<li><strong>Soljena riba</strong> — jedna od najstarijih metoda konzerviranja; soli se i morska i slatkovodna riba.</li>' +
        '<li><strong>Sušena riba</strong> — na zraku ili u kontroliranim uvjetima.</li>' +
        '<li><strong>Dimljena riba</strong> — najčešće losos i haringa, <strong>toplim ili hladnim</strong> dimljenjem.</li>' +
        '</ul>' +

        '<h3>Utjecaj na zdravlje</h3>' +
        '<p><strong>Pozitivno:</strong> redovita konzumacija povezuje se s manjim rizikom od kardiovaskularnih bolesti, pretilosti, metaboličkog sindroma i depresije.</p>' +
        '<p><strong>Preporuka:</strong> <strong>dvije porcije (jedinice serviranja) ribe tjedno</strong>, oko 240 g, od čega jedna porcija masne ribe.</p>' +
        '<p><strong>Rizici:</strong> histamin, paraziti (<strong>Anisakis</strong>), živa i drugi teški metali, mikroplastika.</p>'
    }
  },

  "milkDairy": {
    "name": "Mlijeko i mliječni proizvodi",
    "icon": "fa-cheese",
    "color": "#a855f7",
    "flashcards": [
      {
        "question": "Što je MLIJEKO?",
        "answer": "Prirodni sekret mliječnih žlijezda sisavaca dobiven mužnjom, kojem ništa nije dodano ni oduzeto.",
        "explanation": "Kravlje mlijeko čini više od 96 % proizvodnje."
      },
      {
        "question": "Kakav je sastav kravljeg mlijeka?",
        "answer": "Voda ~87 %, laktoza ~4,6 %, mliječna mast ~4 %, bjelančevine ~3,3 %, mineralne tvari ~0,7 %.",
        "explanation": "Mliječna mast: trigliceridi, fosfolipidi, kolesterol."
      },
      {
        "question": "Što je LAKTOZA?",
        "answer": "Glavni ugljikohidrat mlijeka (najveći udio); disaharid od glukoze i galaktoze.",
        "explanation": "Neke osobe ne podnose laktozu (intolerancija)."
      },
      {
        "question": "Koje su bjelančevine mlijeka?",
        "answer": "Kazein (najvažniji) i proteini sirutke; visoke su biološke vrijednosti i sadrže esencijalne aminokiseline.",
        "explanation": "Kazein koagulira pri izradi sira."
      },
      {
        "question": "Zašto je mlijeko dobar izvor kalcija?",
        "answer": "Kalcij je u povoljnom omjeru s fosforom pa se dobro iskorištava u organizmu.",
        "explanation": "Vitamini mlijeka: B2, B12, A, D, E, K."
      },
      {
        "question": "Koje su vrste konzumnog mlijeka?",
        "answer": "Sirovo (nije zagrijano iznad 40 °C), punomasno (≥ 3,5 % masti), djelomično obrano (1,5–1,8 %) i obrano (≤ 0,5 %).",
        "explanation": "Konzumno mlijeko ide potrošaču bez daljnje prerade."
      },
      {
        "question": "Što je STANDARDIZACIJA mlijeka?",
        "answer": "Podešavanje udjela mliječne masti na propisanu vrijednost; tako se dobiva standardizirano mlijeko.",
        "explanation": "Dio primarne obrade mlijeka."
      },
      {
        "question": "Što je HOMOGENIZACIJA?",
        "answer": "Usitnjavanje globula mliječne masti: sprječava izdvajanje vrhnja i poboljšava (ujednačuje) viskoznost mlijeka.",
        "explanation": "Primarna obrada: filtriranje, standardizacija, homogenizacija, toplinska obrada."
      },
      {
        "question": "Pasterizirano vs UHT mlijeko?",
        "answer": "Pasterizacija: 72 °C, 15–20 s → 8–14 dana u hladnjaku. UHT sterilizacija: 135–140 °C nekoliko sekundi → najmanje 3–4 mjeseca na sobnoj temperaturi.",
        "explanation": "UHT = ultra visoka temperatura."
      },
      {
        "question": "Što je fermentacija mlijeka?",
        "answer": "Mikroorganizmi (bakterije mliječne kiseline, kvasci, plijesni) pretvaraju laktozu u mliječnu kiselinu.",
        "explanation": "Mliječno-kiselo: jogurt, kiselo mlijeko. Alkoholno + mliječno: kefir."
      },
      {
        "question": "Koje bakterije proizvode JOGURT?",
        "answer": "Streptococcus thermophilus i Lactobacillus delbrueckii subsp. bulgaricus.",
        "explanation": "Grčki jogurt ima više suhe tvari i masti (7–10 %); skyr ~10–11 g bjelančevina/100 g."
      },
      {
        "question": "Čvrsti vs tekući jogurt?",
        "answer": "Čvrsti: fermentira u ambalaži, gruš ostaje cijel. Tekući: fermentira u tanku, gruš se razbije miješanjem pa se puni.",
        "explanation": "Zamrznuti jogurt: zamrzavanje gotovog tekućeg jogurta."
      },
      {
        "question": "Što je KEFIR?",
        "answer": "Proizvod kefirnih zrnaca (bakterije mliječne kiseline + kvasci): mliječno-kiselo i alkoholno vrenje uz nastanak CO₂.",
        "explanation": "Kiselo mlijeko: mezofilne bakterije, 10–18 sati."
      },
      {
        "question": "Što je MLAĆENICA (stepka)?",
        "answer": "Nusproizvod proizvodnje maslaca koji se naknadno fermentira bakterijama mliječne kiseline.",
        "explanation": "Ostaje nakon izdvajanja zrna maslaca."
      },
      {
        "question": "Što je SIR?",
        "answer": "Proizvod dobiven odvajanjem sirutke nakon koagulacije (zgrušavanja) mlijeka, vrhnja ili sirutke.",
        "explanation": "Prema masti: ekstra masni, punomasni, masni, polumasni, posni."
      },
      {
        "question": "Koje su faze proizvodnje sira?",
        "answer": "Obrada i pasterizacija mlijeka, dodavanje kultura i sirila, sirenje (gruš), obrada gruša, oblikovanje, prešanje, soljenje i zrenje.",
        "explanation": "Soljenje zaustavlja fermentaciju i daje okus i trajnost."
      },
      {
        "question": "Vrste sira po tvrdoći?",
        "answer": "Ekstra tvrdi (parmezan, paški), tvrdi (ementaler, cheddar), polutvrdi (gauda, edamer, trapist), meki (brie, camembert, gorgonzola).",
        "explanation": "Još: sirevi u salamuri (feta) i svježi sirevi (mascarpone)."
      },
      {
        "question": "Što su ALBUMINSKI sirevi?",
        "answer": "Sirevi dobiveni toplinskom koagulacijom proteina sirutke, npr. skuta, urda i ricotta.",
        "explanation": "Sirutka je nusproizvod proizvodnje sira."
      },
      {
        "question": "Koji su tradicionalni hrvatski sirevi?",
        "answer": "Paški, krčki i istarski (ovčji), tounjski (dimljeni kravlji) i škripavac (kravlji, ne zrije).",
        "explanation": "Feta NIJE hrvatski sir."
      },
      {
        "question": "Kako se proizvodi MASLAC?",
        "answer": "Iz posebno pripremljenog vrhnja butrifikacijom – mehaničkom obradom nastaju zrna maslaca i mlaćenica.",
        "explanation": "Čuva se na 4–5 °C do mjesec dana."
      },
      {
        "question": "Što je SLADOLED?",
        "answer": "Djelomično ili potpuno zamrznuti mliječni proizvod; smjesa se zamrzava uz upuhivanje zraka.",
        "explanation": "Čuva se na najmanje −15 °C, godinu dana ili dulje."
      }
    ],
    "quiz": [
      {
        "question": "Ugljikohidrat s najvećim udjelom u mlijeku je:",
        "options": ["Saharoza", "Laktoza", "Maltoza", "Škrob"],
        "correct": 1
      },
      {
        "question": "Najvažnija bjelančevina mlijeka je:",
        "options": ["Gluten", "Avidin", "Kazein", "Mioglobin"],
        "correct": 2
      },
      {
        "question": "Homogenizacija mlijeka:",
        "options": ["Uništava sve mikroorganizme i spore", "Povećava udio laktoze u mlijeku", "Odvaja kazein od sirutke", "Usitnjava globule mliječne masti"],
        "correct": 3
      },
      {
        "question": "Punomasno mlijeko sadrži najmanje:",
        "options": ["3,5 % mliječne masti", "0,5 % mliječne masti", "1,5 % mliječne masti", "10 % mliječne masti"],
        "correct": 0
      },
      {
        "question": "UHT mlijeko zagrijava se na:",
        "options": ["72 °C 15–20 sekundi", "135–140 °C nekoliko sekundi", "40 °C 30 minuta", "100 °C jedan sat"],
        "correct": 1
      },
      {
        "question": "Kod kefira uz mliječnu kiselinu nastaju i:",
        "options": ["Octena kiselina i voda", "Kazein i laktoza", "Alkohol i CO₂", "Nitriti i nitrati"],
        "correct": 2
      },
      {
        "question": "Stepka (mlaćenica) je nusproizvod proizvodnje:",
        "options": ["Sira", "Sladoleda", "Jogurta", "Maslaca"],
        "correct": 3
      },
      {
        "question": "Koji sir NE spada u tradicionalne hrvatske sireve?",
        "options": ["Feta", "Paški sir", "Tounjski sir", "Škripavac"],
        "correct": 0
      },
      {
        "question": "Paški sir je:",
        "options": ["Kravlji svježi sir", "Ovčji ekstra tvrdi sir", "Kozji sir u salamuri", "Dimljeni kravlji sir"],
        "correct": 1
      },
      {
        "question": "Albuminski sirevi dobivaju se iz:",
        "options": ["Punomasnog vrhnja", "Maslaca", "Sirutke", "Kiselog mlijeka"],
        "correct": 2
      },
      {
        "question": "Sladoled je:",
        "options": ["Fermentirani mliječni napitak", "Proizvod butrifikacije vrhnja", "Nusproizvod proizvodnje sira", "Zamrznuti mliječni proizvod"],
        "correct": 3
      },
      {
        "question": "Butrifikacija je postupak u proizvodnji:",
        "options": ["Maslaca", "Jogurta", "Sira", "Sladoleda"],
        "correct": 0
      },
      {
        "question": "Jogurt nastaje djelovanjem bakterija:",
        "options": ["Acetobacter i Gluconobacter", "S. thermophilus i L. bulgaricus", "Bacillus subtilis i B. cereus", "Salmonella i Campylobacter"],
        "correct": 1
      },
      {
        "question": "Sirovo mlijeko nije zagrijavano iznad:",
        "options": ["72 °C", "100 °C", "40 °C", "135 °C"],
        "correct": 2
      },
      {
        "question": "Pasterizirano mlijeko u hladnjaku traje:",
        "options": ["3–4 mjeseca", "1–2 dana", "Godinu dana", "8–14 dana"],
        "correct": 3
      },
      {
        "question": "Gouda, edamer i trapist su:",
        "options": ["Polutvrdi sirevi", "Ekstra tvrdi sirevi", "Sirevi u salamuri", "Svježi sirevi"],
        "correct": 0
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Glavna bjelančevina mlijeka je _______.",
        "answer": "kazein",
        "hint": "Koagulira pri sirenju."
      },
      {
        "sentence": "Kravlje mlijeko sadrži oko _______ % vode.",
        "answer": "87",
        "hint": "Broj."
      },
      {
        "sentence": "Nastanak zrna maslaca tijekom obrade vrhnja zove se _______.",
        "answer": "butrifikacija",
        "hint": "Butter."
      },
      {
        "sentence": "Sir se dobiva odvajanjem _______ nakon koagulacije mlijeka.",
        "answer": "sirutke",
        "hint": "Tekući ostatak pri sirenju."
      },
      {
        "sentence": "Obrano mlijeko sadrži najviše 0,5 % mliječne _______.",
        "answer": "masti",
        "hint": "Sastojak koji se obiranjem uklanja."
      },
      {
        "sentence": "Fermentirani napitak koji nastaje pomoću kefirnih zrnaca zove se _______.",
        "answer": "kefir",
        "hint": "Mliječno-kiselo i alkoholno vrenje."
      },
      {
        "sentence": "Kravlji sir gumaste konzistencije koji ne zrije zove se _______.",
        "answer": "škripavac",
        "hint": "Škripi pod zubima."
      }
    ],
    "learn": {
      "title": "Mlijeko i mliječni proizvodi",
      "content":
        '<h3>Mlijeko</h3>' +
        '<p><strong>Mlijeko</strong> je prirodni sekret mliječnih žlijezda sisavaca dobiven mužnjom, kojem ništa nije dodano ni oduzeto; bijele do žućkasto-bijele boje, karakterističnog okusa i mirisa. <strong>Kravlje mlijeko</strong> čini više od 96 % proizvodnje; koriste se i ovčje, kozje, bivolje i magareće.</p>' +
        '<table>' +
        '<tr><th>Sastojak</th><th>Udio</th><th>Napomena</th></tr>' +
        '<tr><td>Voda</td><td>~87 %</td><td></td></tr>' +
        '<tr><td>Laktoza</td><td>~4,6 %</td><td>glavni ugljikohidrat; disaharid glukoza + galaktoza; kod nekih intolerancija</td></tr>' +
        '<tr><td>Mliječna mast</td><td>~4 %</td><td>trigliceridi, fosfolipidi, kolesterol</td></tr>' +
        '<tr><td>Bjelančevine</td><td>~3,3 %</td><td><strong>kazein</strong> (najvažniji) i proteini sirutke; visoka biološka vrijednost</td></tr>' +
        '<tr><td>Mineralne tvari</td><td>~0,7 %</td><td>kalcij, fosfor, kalij, klor</td></tr>' +
        '</table>' +
        '<p><strong>Kalcij</strong> je u povoljnom omjeru s fosforom pa se dobro iskorištava. <strong>Vitamini:</strong> B2, B12, A, D, E i K.</p>' +

        '<h3>Konzumno mlijeko i obrada</h3>' +
        '<p><strong>Konzumno mlijeko</strong> namijenjeno je krajnjem potrošaču bez daljnje prerade.</p>' +
        '<table>' +
        '<tr><th>Vrsta</th><th>Obilježje</th></tr>' +
        '<tr><td>Sirovo</td><td>nije zagrijavano iznad <strong>40 °C</strong> niti obrađeno postupkom istog učinka</td></tr>' +
        '<tr><td>Punomasno</td><td>najmanje <strong>3,5 %</strong> mliječne masti</td></tr>' +
        '<tr><td>Djelomično obrano</td><td>1,5–1,8 % mliječne masti</td></tr>' +
        '<tr><td>Obrano</td><td>najviše <strong>0,5 %</strong> mliječne masti</td></tr>' +
        '</table>' +
        '<p><strong>Primarna obrada:</strong> filtriranje · <strong>standardizacija</strong> (podešavanje udjela masti → standardizirano mlijeko) · <strong>homogenizacija</strong> (usitnjavanje globula masti; sprječava izdvajanje vrhnja i ujednačuje viskoznost) · uklanjanje mikroorganizama · toplinska obrada.</p>' +
        '<table>' +
        '<tr><th></th><th>Pasterizacija</th><th>Sterilizacija (UHT)</th></tr>' +
        '<tr><td>Uvjeti</td><td>72 °C, 15–20 sekundi</td><td>135–140 °C, nekoliko sekundi</td></tr>' +
        '<tr><td>Trajnost</td><td>8–14 dana u hladnjaku</td><td>najmanje 3–4 mjeseca na sobnoj temperaturi</td></tr>' +
        '</table>' +

        '<h3>Fermentirani mliječni proizvodi</h3>' +
        '<p><strong>Fermentacija</strong>: mikroorganizmi (najčešće bakterije mliječne kiseline, uz njih kvasci i plijesni) pretvaraju <strong>laktozu u mliječnu kiselinu</strong>.</p>' +
        '<ul>' +
        '<li><strong>Mliječno-kisela fermentacija</strong>: jogurt, kiselo mlijeko, mlaćenica.</li>' +
        '<li><strong>Alkoholna (+ mliječna) fermentacija</strong>: nastaju i alkohol i CO₂ — <strong>kefir</strong>.</li>' +
        '</ul>' +
        '<table>' +
        '<tr><th>Proizvod</th><th>Obilježja</th></tr>' +
        '<tr><td><strong>Jogurt</strong></td><td><em>Streptococcus thermophilus</em> + <em>Lactobacillus delbrueckii</em> subsp. <em>bulgaricus</em>. <strong>Čvrsti</strong> fermentira u ambalaži (gruš ostaje cijel); <strong>tekući</strong> fermentira u tanku, gruš se razbije miješanjem pa se puni</td></tr>' +
        '<tr><td>Grčki jogurt</td><td>više suhe tvari i mliječne masti (7–10 %)</td></tr>' +
        '<tr><td>Skyr</td><td>islandski; vrlo visok udio bjelančevina (10–11 g/100 g)</td></tr>' +
        '<tr><td>Zamrznuti jogurt</td><td>zamrzavanje prethodno proizvedenog tekućeg jogurta</td></tr>' +
        '<tr><td><strong>Kefir</strong></td><td>kefirna zrnca (bakterije mliječne kiseline + kvasci); mliječno-kiselo i alkoholno vrenje, CO₂</td></tr>' +
        '<tr><td>Kiselo mlijeko</td><td>fermentacija mezofilnim bakterijama 10–18 sati</td></tr>' +
        '<tr><td><strong>Mlaćenica (stepka)</strong></td><td>nusproizvod proizvodnje maslaca, naknadno fermentiran</td></tr>' +
        '</table>' +

        '<h3>Sir</h3>' +
        '<p><strong>Sir</strong> je proizvod dobiven <strong>odvajanjem sirutke</strong> nakon koagulacije mlijeka, vrhnja ili sirutke. Prema udjelu masti: ekstra masni, punomasni, masni, polumasni i posni.</p>' +
        '<p><strong>Proizvodnja:</strong> primarna obrada mlijeka → pasterizacija → dodavanje kultura i <strong>sirila</strong> → <strong>sirenje</strong> (nastaje sirni gruš) → obrada gruša → oblikovanje → <strong>prešanje</strong> (povezivanje sirnih zrna) → <strong>soljenje</strong> (zaustavlja fermentaciju, okus, trajnost) → <strong>zrenje</strong> (okus, aroma, tekstura).</p>' +
        '<table>' +
        '<tr><th>Vrsta</th><th>Primjeri</th></tr>' +
        '<tr><td>Ekstra tvrdi</td><td>parmezan, paški sir</td></tr>' +
        '<tr><td>Tvrdi</td><td>ementaler, cheddar</td></tr>' +
        '<tr><td>Polutvrdi</td><td>gauda, edamer, trapist</td></tr>' +
        '<tr><td>Polumeki i meki</td><td>brie, camembert, gorgonzola</td></tr>' +
        '<tr><td>U salamuri</td><td>feta, travnički sir, bijeli sir u kriškama</td></tr>' +
        '<tr><td>Svježi</td><td>svježi sir, kremasti sir, mascarpone, cottage cheese</td></tr>' +
        '<tr><td><strong>Albuminski</strong></td><td>od <strong>sirutke</strong> — toplinska koagulacija proteina sirutke: skuta, urda, ricotta</td></tr>' +
        '</table>' +
        '<h4>Tradicionalni hrvatski sirevi</h4>' +
        '<ul>' +
        '<li><strong>Paški sir</strong> — ovčji, intenzivne arome, zrije 2–5 mjeseci.</li>' +
        '<li><strong>Krčki sir</strong> — punomasni ovčji, blagog okusa.</li>' +
        '<li><strong>Istarski sir</strong> — punomasni ovčji, blago pikantan.</li>' +
        '<li><strong>Tounjski sir</strong> — dimljeni kravlji sir oblika pogače.</li>' +
        '<li><strong>Škripavac</strong> — kravlji sir gumaste, škripave konzistencije, ne zrije.</li>' +
        '</ul>' +
        '<div class="warning-box"><strong>Zamka:</strong> feta NIJE tradicionalni hrvatski sir (grčki je, u salamuri).</div>' +

        '<h3>Maslac i sladoled</h3>' +
        '<p><strong>Maslac</strong> se proizvodi iz posebno pripremljenog vrhnja postupkom <strong>butrifikacije</strong> — mehaničkom obradom vrhnja nastaju zrna maslaca, a ostaje <strong>mlaćenica (stepka)</strong>. Čuva se u hladnjaku na 4–5 °C do mjesec dana.</p>' +
        '<p><strong>Sladoled</strong> je djelomično ili potpuno zamrznuta namirnica od mlijeka ili mliječnih proizvoda uz arome, boje i stabilizatore. Vrste: krem sladoled, mliječni sladoled, sladoled, smrznuti voćni desert, smrznuti aromatizirani desert. Proizvodnja: priprema smjese i zamrzavanje uz <strong>upuhivanje zraka</strong>. Čuva se na najmanje <strong>−15 °C</strong>, godinu dana ili dulje.</p>'
    }
  },

  "eggs": {
    "name": "Jaja",
    "icon": "fa-egg",
    "color": "#eab308",
    "flashcards": [
      {
        "question": "Što je JAJE?",
        "answer": "Složena reproduktivna stanica čija je građa povezana s održavanjem života – „organizam u malom”.",
        "explanation": "Najčešće kokošja; koriste se i guščja, pureća, pačja, prepeličja i nojeva."
      },
      {
        "question": "Kolika je proizvodnja i potrošnja jaja?",
        "answer": "Svjetska proizvodnja veća je od 83 milijuna tona godišnje (najviše Azija); potrošnja u Europi oko 13 kg, u Hrvatskoj oko 10,8 kg po stanovniku.",
        "explanation": "Jaja su ključna namirnica hotelskog doručka."
      },
      {
        "question": "Koji su dijelovi jajeta?",
        "answer": "Ljuska (kalcijev karbonat, porozna), pokožica, dvije opne sa zračnom komorom, bjelanjak (dva sloja), halaze i žumanjak sa žumanjčanom opnom.",
        "explanation": "Pokožica sprječava prodor bakterija."
      },
      {
        "question": "Što su HALAZE?",
        "answer": "Uvijene niti bjelanjka koje drže žumanjak u središtu jajeta.",
        "explanation": "Zračna komora je prostor između dviju opni."
      },
      {
        "question": "Koliki je udio pojedinih dijelova jajeta?",
        "answer": "Bjelanjak ~61,5 %, žumanjak ~29 %, ljuska ~9 %, opne ~0,4 % mase.",
        "explanation": "Najveći dio mase je bjelanjak."
      },
      {
        "question": "Kakav je kemijski sastav jajeta?",
        "answer": "Voda 72–75 %, bjelančevine 12,5–13,3 %, masti 10,7–11,6 %, ugljikohidrati ~0,7 %, minerali ~1 %.",
        "explanation": "Jaje sadrži sve vitamine osim vitamina C."
      },
      {
        "question": "Što sadrži ŽUMANJAK?",
        "answer": "Najviše masti; fosfolipidi čine ~31 % masti (najpoznatiji lecitin), kolesterol ~4 %; željezo, fosfor i karotenoidi (boja, antioksidansi).",
        "explanation": "Lecitin je prirodni emulgator (majoneza)."
      },
      {
        "question": "Što sadrži BJELANJAK?",
        "answer": "Biološki punovrijedne, vrlo probavljive bjelančevine (biološka vrijednost ~94) i antinutritivni faktor avidin.",
        "explanation": "Minerali: kalij, fosfor, željezo, jod, magnezij, cink, kalcij."
      },
      {
        "question": "Kako se ocjenjuje svježina jaja?",
        "answer": "Denzitometrija: potapanje u 12 %-tnu otopinu soli (svježe jaje tone). Prosvjetljivanje (ovoskopiranje): pregled unutrašnjosti svjetlom.",
        "explanation": "Starenjem se zračna komora povećava."
      },
      {
        "question": "Klase jaja po kakvoći?",
        "answer": "A klasa: svježa i ekstra svježa jaja za potrošače. B klasa: jaja za industrijsku preradu.",
        "explanation": "Ekstra svježa: zračna komora do 4 mm."
      },
      {
        "question": "Razredi jaja po veličini?",
        "answer": "S manje od 53 g, M 53–63 g, L 63–73 g, XL 73 g i više.",
        "explanation": "Razred se označava na pakiranju."
      },
      {
        "question": "Što znače oznake uzgoja 0, 1, 2 i 3?",
        "answer": "0 – ekološki, 1 – slobodni, 2 – štalski (podni), 3 – kavezni (baterijski) uzgoj.",
        "explanation": "Oznaka je prva znamenka koda na ljusci."
      },
      {
        "question": "Koji je rok prodaje i čuvanja jaja?",
        "answer": "Rok prodaje najviše 21 dan od nesenja. Čuvanje: ljeti do 10, zimi do 21 dana; ne uz jako mirisne namirnice jer upijaju mirise.",
        "explanation": "Pakiranje: originalno, otvoreno ili transportno."
      },
      {
        "question": "Koji su proizvodi od jaja?",
        "answer": "Tekući ohlađeni, zamrznuti tekući, sušeni i kuhani proizvodi od jaja te kuhana svježa jaja u ljusci.",
        "explanation": "Pasterizirana tekuća jaja smanjuju rizik od salmonele u kuhinji."
      },
      {
        "question": "Koje su prednosti i rizici konzumacije jaja?",
        "answer": "Prednosti: velika nutritivna gustoća, kvalitetni proteini, antioksidativno i protuupalno djelovanje. Rizik: Salmonella i Campylobacter.",
        "explanation": "Kontaminacija preko ljuske ili nakon nesenja."
      }
    ],
    "quiz": [
      {
        "question": "Oznakom „0” označavaju se jaja iz:",
        "options": ["Kaveznog uzgoja", "Ekološkog uzgoja", "Podnog uzgoja", "Slobodnog uzgoja"],
        "correct": 1
      },
      {
        "question": "Jaja iz podnog (štalskog) uzgoja nose oznaku:",
        "options": ["0", "1", "2", "3"],
        "correct": 2
      },
      {
        "question": "Jaje mase 65 g razvrstava se u razred:",
        "options": ["M", "S", "XL", "L"],
        "correct": 3
      },
      {
        "question": "Rok prodaje jaja ne smije biti dulji od:",
        "options": ["21 dan od nesenja", "7 dana od nesenja", "60 dana od nesenja", "6 mjeseci od nesenja"],
        "correct": 0
      },
      {
        "question": "Prosvjetljivanje ovoskopom je metoda:",
        "options": ["Razvrstavanja jaja po masi", "Provjere svježine jaja", "Pasterizacije jaja", "Bojenja ljuske"],
        "correct": 1
      },
      {
        "question": "Denzitometrija svježine jaja provodi se potapanjem u otopinu soli od:",
        "options": ["2 %", "30 %", "12 %", "50 %"],
        "correct": 2
      },
      {
        "question": "Antinutritivni faktor u bjelanjku je:",
        "options": ["Lecitin", "Kazein", "Karoten", "Avidin"],
        "correct": 3
      },
      {
        "question": "Najpoznatiji fosfolipid žumanjka je:",
        "options": ["Lecitin", "Avidin", "Kolagen", "Hemoglobin"],
        "correct": 0
      },
      {
        "question": "Koji vitamin jaje NE sadrži?",
        "options": ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
        "correct": 1
      },
      {
        "question": "Najveći udio mase jajeta čini:",
        "options": ["Žumanjak", "Ljuska", "Bjelanjak", "Zračna komora"],
        "correct": 2
      },
      {
        "question": "Ljuska jajeta građena je pretežno od:",
        "options": ["Natrijeva klorida", "Keratina", "Kolagena", "Kalcijeva karbonata"],
        "correct": 3
      },
      {
        "question": "Jaja B klase namijenjena su:",
        "options": ["Industrijskoj preradi", "Prodaji potrošačima", "Izvozu u treće zemlje", "Ekološkom tržištu"],
        "correct": 0
      },
      {
        "question": "Žumanjak u središtu jajeta drže:",
        "options": ["Opne", "Halaze", "Pokožica", "Zračna komora"],
        "correct": 1
      },
      {
        "question": "Glavni mikrobiološki rizik povezan s jajima je:",
        "options": ["Bacillus subtilis", "Acetobacter", "Salmonella", "Anisakis"],
        "correct": 2
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Jaja iz kaveznog uzgoja označavaju se brojem _______.",
        "answer": "3",
        "hint": "Najveća oznaka."
      },
      {
        "sentence": "Uvijene niti koje drže žumanjak u središtu jajeta zovu se _______.",
        "answer": "halaze",
        "hint": "Dio bjelanjka."
      },
      {
        "sentence": "Biološka vrijednost bjelančevina bjelanjka iznosi oko _______.",
        "answer": "94",
        "hint": "Broj."
      },
      {
        "sentence": "Pregled unutrašnjosti jajeta pomoću svjetla zove se prosvjetljivanje ili _______.",
        "answer": "ovoskopiranje",
        "hint": "Ovo = jaje."
      },
      {
        "sentence": "Jaja razreda XL teže _______ g ili više.",
        "answer": "73",
        "hint": "Broj."
      },
      {
        "sentence": "Najpoznatiji fosfolipid žumanjka je _______.",
        "answer": "lecitin",
        "hint": "Emulgator."
      }
    ],
    "learn": {
      "title": "Jaja",
      "content":
        '<h3>Jaje</h3>' +
        '<p><strong>Jaje</strong> je složena reproduktivna stanica čija su građa i sastav povezani s održavanjem života — zato se naziva <strong>„organizmom u malom”</strong>. Najčešće se koriste kokošja jaja, a i guščja, pureća, pačja, prepeličja i nojeva.</p>' +
        '<p><strong>Proizvodnja i potrošnja:</strong> svjetska proizvodnja veća je od 83 milijuna tona godišnje (najveći proizvođač Azija); potrošnja u Europi oko 13 kg, u Hrvatskoj oko 10,8 kg po stanovniku godišnje.</p>' +

        '<h3>Građa jajeta</h3>' +
        '<table>' +
        '<tr><th>Dio</th><th>Obilježje</th><th>Udio mase</th></tr>' +
        '<tr><td>Ljuska</td><td>porozna, pretežno <strong>kalcijev karbonat</strong></td><td>~9 %</td></tr>' +
        '<tr><td>Pokožica</td><td>zaštitni sloj na ljusci; sprječava prodor bakterija</td><td></td></tr>' +
        '<tr><td>Opne i zračna komora</td><td>zračna komora je prostor između dviju opni (povećava se starenjem)</td><td>opne ~0,4 %</td></tr>' +
        '<tr><td>Bjelanjak</td><td>dva sloja različite gustoće</td><td><strong>~61,5 %</strong></td></tr>' +
        '<tr><td>Halaze</td><td>drže žumanjak u središtu</td><td></td></tr>' +
        '<tr><td>Žumanjak</td><td>središnji dio, okružen žumanjčanom opnom</td><td>~29 %</td></tr>' +
        '</table>' +

        '<h3>Kemijski sastav</h3>' +
        '<p><strong>Cijelo jaje:</strong> voda 72–75 % · bjelančevine 12,5–13,3 % · masti 10,7–11,6 % · ugljikohidrati ~0,7 % · minerali ~1 %. Jaje sadrži <strong>sve vitamine osim vitamina C</strong>.</p>' +
        '<table>' +
        '<tr><th>Žumanjak</th><th>Bjelanjak</th></tr>' +
        '<tr><td>masti su najzastupljenija sastavnica (jednostruko nezasićene, zasićene, višestruko nezasićene)</td><td>biološki punovrijedne, vrlo probavljive bjelančevine; <strong>biološka vrijednost ~94</strong></td></tr>' +
        '<tr><td>fosfolipidi ~31 % masti — najpoznatiji <strong>lecitin</strong> (emulgator)</td><td><strong>avidin</strong> — antinutritivni faktor</td></tr>' +
        '<tr><td>kolesterol ~4 %; željezo i fosfor</td><td>minerali: kalij, fosfor, željezo, jod, magnezij, cink, kalcij</td></tr>' +
        '<tr><td><strong>karotenoidi</strong> — boja žumanjka, antioksidansi</td><td></td></tr>' +
        '</table>' +

        '<h3>Ocjena svježine</h3>' +
        '<ul>' +
        '<li><strong>Denzitometrija</strong> — potapanje jaja u <strong>12 %-tnu otopinu soli</strong>: svježe jaje tone, staro (veća zračna komora) pluta.</li>' +
        '<li><strong>Prosvjetljivanje (ovoskopiranje)</strong> — pregled unutrašnjosti jajeta ovoskopskim svjetlom (zračna komora, žumanjak, mrlje, pukotine).</li>' +
        '</ul>' +

        '<h3>Jaja na tržištu</h3>' +
        '<table>' +
        '<tr><th>Kakvoća</th><th>Veličina</th><th>Način uzgoja (oznaka)</th></tr>' +
        '<tr><td><strong>A klasa</strong> — svježa i ekstra svježa, za potrošače<br><strong>B klasa</strong> — za industrijsku preradu</td><td><strong>S</strong> &lt; 53 g<br><strong>M</strong> 53–63 g<br><strong>L</strong> 63–73 g<br><strong>XL</strong> ≥ 73 g</td><td><strong>0</strong> ekološki<br><strong>1</strong> slobodni<br><strong>2</strong> štalski (podni)<br><strong>3</strong> kavezni (baterijski)</td></tr>' +
        '</table>' +
        '<ul>' +
        '<li><strong>Rok prodaje</strong> — ne smije biti dulji od <strong>21 dan od nesenja</strong>.</li>' +
        '<li><strong>Čuvanje</strong> — ljeti do 10 dana, zimi do 21 dan; ne uz namirnice jakog mirisa (jaja upijaju mirise).</li>' +
        '<li><strong>Pakiranje</strong> — originalno, otvoreno ili transportno.</li>' +
        '</ul>' +
        '<p><strong>Proizvodi od jaja:</strong> tekući ohlađeni, zamrznuti tekući, sušeni i kuhani proizvodi od jaja; kuhana svježa jaja u ljusci.</p>' +

        '<h3>Zdravstveni učinci</h3>' +
        '<p><strong>Prednosti (prema predavanjima):</strong> velika nutritivna gustoća i visokokvalitetni proteini · mogu pridonijeti sniženju krvnog tlaka · protuupalno i antioksidativno djelovanje · bolja bioraspoloživost pojedinih minerala.</p>' +
        '<p><strong>Rizici:</strong> kontaminacija bakterijama <strong>Salmonella</strong> i <strong>Campylobacter</strong> — preko ljuske ili nakon nesenja.</p>' +
        '<div class="warning-box"><strong>Proturječje u izvorima:</strong> skripta i predavanja navode da jaja <em>mogu pridonijeti sniženju krvnog tlaka</em>, a jedan studentski sažetak ispitnih pitanja tvrdi suprotno („konzumacija jaja ne snizuje krvni tlak”). Uči prema predavanjima, a na ispitu pažljivo pročitaj koje su prednosti ponuđene.</div>'
    }
  },

  "foodSafety": {
    "name": "Sigurnost hrane i HACCP",
    "icon": "fa-shield-halved",
    "color": "#0f766e",
    "flashcards": [
      {
        "question": "Što je LANAC HRANE?",
        "answer": "Slijed djelatnosti od primarne proizvodnje, preko prerade, skladištenja i distribucije, do potrošnje („od polja do stola”).",
        "explanation": "Sigurnost se osigurava u svakoj karici lanca."
      },
      {
        "question": "Tko je odgovoran za sigurnost hrane?",
        "answer": "Primarnu odgovornost ima subjekt u poslovanju s hranom (proizvođač, prerađivač, trgovac, ugostitelj); nadležna tijela provode službene kontrole.",
        "explanation": "Hotel ili restoran također je subjekt u poslovanju s hranom."
      },
      {
        "question": "Opasnost vs rizik?",
        "answer": "Opasnost: biološki, kemijski ili fizikalni agens u hrani koji može štetiti zdravlju. Rizik: vjerojatnost štetnog učinka i njegova težina.",
        "explanation": "Salmonella je opasnost; rizik ovisi o tome koliko je vjerojatno da će izazvati bolest."
      },
      {
        "question": "Koje su vrste opasnosti u hrani?",
        "answer": "Biološke (bakterije, virusi, paraziti, plijesni), kemijske (pesticidi, teški metali, toksini, sredstva za čišćenje, alergeni) i fizikalne (staklo, metal, kamenčići).",
        "explanation": "Paraziti su BIOLOŠKA, a ne kemijska opasnost."
      },
      {
        "question": "Što je HACCP?",
        "answer": "Sustav analize opasnosti i kritičnih kontrolnih točaka: preventivno prepoznaje, procjenjuje i nadzire opasnosti bitne za sigurnost hrane.",
        "explanation": "Hazard Analysis and Critical Control Points; u EU obvezan za subjekte u poslovanju s hranom, osim u primarnoj proizvodnji."
      },
      {
        "question": "Kojih je sedam načela HACCP-a?",
        "answer": "1. analiza opasnosti, 2. određivanje KKT, 3. kritične granice, 4. monitoring, 5. korektivne mjere, 6. verifikacija, 7. dokumentacija i evidencija.",
        "explanation": "Redoslijed je bitan: prvo se analiziraju opasnosti."
      },
      {
        "question": "Što je KRITIČNA KONTROLNA TOČKA (KKT)?",
        "answer": "Korak u procesu u kojem se kontrola može primijeniti i ključna je za sprečavanje, uklanjanje ili smanjenje opasnosti na prihvatljivu razinu.",
        "explanation": "Npr. kuhanje, hlađenje, pasterizacija."
      },
      {
        "question": "Što je KRITIČNA GRANICA?",
        "answer": "Mjerljivi kriterij (temperatura, vrijeme, pH…) koji na KKT odvaja prihvatljivo od neprihvatljivog.",
        "explanation": "Npr. temperatura jezgre pri kuhanju najmanje 72 °C."
      },
      {
        "question": "Što je MONITORING?",
        "answer": "Planirani slijed promatranja ili mjerenja kontrolnih parametara kojim se procjenjuje je li KKT pod kontrolom.",
        "explanation": "Npr. mjerenje temperature hladnjaka dvaput dnevno."
      },
      {
        "question": "Što su KOREKTIVNE MJERE?",
        "answer": "Mjere koje se provode kad monitoring pokaže da je kritična granica prekoračena, odnosno da KKT nije pod kontrolom.",
        "explanation": "Npr. dodatno kuhanje ili odbacivanje proizvoda."
      },
      {
        "question": "Što je VERIFIKACIJA?",
        "answer": "Provjera djeluje li HACCP sustav učinkovito (pregled evidencija, analize, audit). Ne uključuje propisivanje korektivnih mjera.",
        "explanation": "Verifikacija ≠ monitoring ≠ korektivne mjere."
      },
      {
        "question": "Što su PREDUVJETNI programi?",
        "answer": "Dobra higijenska i proizvođačka praksa (čišćenje, dezinfekcija, kontrola štetnika, osobna higijena, ispravna voda) – temelj na kojem se gradi HACCP.",
        "explanation": "HACCP bez higijenskog temelja ne funkcionira."
      },
      {
        "question": "Povlačenje vs opoziv hrane?",
        "answer": "Povlačenje: uklanjanje nesigurne hrane dok je još u distribucijskom lancu. Opoziv: vraćanje hrane koja je već stigla do potrošača.",
        "explanation": "Oboje ovisi o dobroj sljedivosti."
      },
      {
        "question": "Kako sljedivost pomaže sigurnosti hrane?",
        "answer": "Svaki subjekt zna od koga je primio i kome je isporučio hranu („korak naprijed – korak natrag”), pa se nesigurna serija brzo pronađe i povuče.",
        "explanation": "Zato su na proizvodima serija i datum."
      }
    ],
    "quiz": [
      {
        "question": "Kritična kontrolna točka je:",
        "options": ["Dokument s popisom svih dobavljača", "Najviša dopuštena temperatura skladišta", "Laboratorijska analiza gotovog proizvoda", "Korak procesa ključan za kontrolu opasnosti"],
        "correct": 3
      },
      {
        "question": "Verifikacija u HACCP sustavu NE uključuje:",
        "options": ["Propisivanje korektivnih mjera", "Provjeru učinkovitosti sustava", "Pregled evidencija", "Dodatne analize uzoraka"],
        "correct": 0
      },
      {
        "question": "Korektivne mjere provode se kada:",
        "options": ["Stigne nova pošiljka sirovina", "Je prekoračena kritična granica", "Završi radna smjena", "Proizvod dobije novu etiketu"],
        "correct": 1
      },
      {
        "question": "Monitoring u HACCP sustavu je:",
        "options": ["Uklanjanje hrane s tržišta", "Vraćanje hrane od potrošača", "Planirano promatranje ili mjerenje na KKT", "Godišnji pregled cijelog sustava"],
        "correct": 2
      },
      {
        "question": "Povlačenje hrane provodi se:",
        "options": ["Nakon što je hrana stigla do potrošača", "Isključivo nakon inspekcijskog nadzora", "Isključivo za hranu iz uvoza", "Dok je hrana još u distribucijskom lancu"],
        "correct": 3
      },
      {
        "question": "Kemijske opasnosti u hrani NE uključuju:",
        "options": ["Parazite", "Ostatke pesticida", "Teške metale", "Ostatke sredstava za čišćenje"],
        "correct": 0
      },
      {
        "question": "Komadić stakla u hrani je:",
        "options": ["Kemijska opasnost", "Fizikalna opasnost", "Biološka opasnost", "Kritična granica"],
        "correct": 1
      },
      {
        "question": "Lanac hrane je:",
        "options": ["Popis svih sastojaka na deklaraciji proizvoda", "Isključivo hladni lanac zamrznute hrane", "Slijed djelatnosti od primarne proizvodnje do potrošnje", "Mreža trgovina istog vlasnika u regiji"],
        "correct": 2
      },
      {
        "question": "Prvo načelo HACCP-a je:",
        "options": ["Verifikacija", "Korektivne mjere", "Dokumentacija", "Analiza opasnosti"],
        "correct": 3
      },
      {
        "question": "Salmonella u jajima je:",
        "options": ["Biološka opasnost", "Kemijska opasnost", "Fizikalna opasnost", "Korektivna mjera"],
        "correct": 0
      },
      {
        "question": "Primarnu odgovornost za sigurnost hrane ima:",
        "options": ["Potrošač", "Subjekt u poslovanju s hranom", "Isključivo inspekcija", "Isključivo dobavljač ambalaže"],
        "correct": 1
      },
      {
        "question": "Temperatura jezgre od najmanje 72 °C pri kuhanju u HACCP planu primjer je:",
        "options": ["Korektivne mjere", "Verifikacije", "Kritične granice", "Opoziva"],
        "correct": 2
      },
      {
        "question": "Vraćanje nesigurne hrane koja je već kod potrošača zove se:",
        "options": ["Povlačenje", "Verifikacija", "Monitoring", "Opoziv"],
        "correct": 3
      }
    ],
    "fillBlanks": [
      {
        "sentence": "Kratica KKT znači kritična _______ točka.",
        "answer": "kontrolna",
        "hint": "HACCP = … Critical Control Points."
      },
      {
        "sentence": "Uklanjanje nesigurne hrane dok je još u distribucijskom lancu zove se _______.",
        "answer": "povlačenje",
        "hint": "Nije opoziv."
      },
      {
        "sentence": "Vraćanje nesigurne hrane koja je već stigla do potrošača zove se _______.",
        "answer": "opoziv",
        "hint": "Nije povlačenje."
      },
      {
        "sentence": "Paraziti su _______ opasnost u hrani.",
        "answer": "biološka",
        "hint": "Živi organizmi."
      },
      {
        "sentence": "Vrijednost koja na KKT odvaja prihvatljivo od neprihvatljivog zove se kritična _______.",
        "answer": "granica",
        "hint": "Npr. 72 °C."
      },
      {
        "sentence": "Planirano promatranje ili mjerenje parametara na KKT zove se _______.",
        "answer": "monitoring",
        "hint": "Četvrto načelo HACCP-a."
      }
    ],
    "learn": {
      "title": "Sigurnost hrane i HACCP",
      "content":
        '<div class="tip-box">Studentska skripta ovu temu nema, a pitanja 2. kolokvija je redovito sadrže (lanac hrane, povlačenje, opasnosti, KKT, monitoring, korektivne mjere, verifikacija). Sekcija je napisana prema ispitnim pitanjima i propisima EU o sigurnosti i higijeni hrane.</div>' +

        '<h3>Temeljni pojmovi</h3>' +
        '<ul>' +
        '<li><strong>Sigurnost hrane</strong> — jamstvo da hrana neće štetiti zdravlju ako se konzumira na predviđeni način.</li>' +
        '<li><strong>Lanac hrane</strong> — slijed djelatnosti <strong>od primarne proizvodnje do potrošnje</strong>: primarna proizvodnja → prerada → skladištenje i distribucija → trgovina i ugostiteljstvo → potrošač („od polja do stola”).</li>' +
        '<li><strong>Subjekt u poslovanju s hranom</strong> (proizvođač, prerađivač, trgovac, hotel, restoran) ima <strong>primarnu odgovornost</strong> za sigurnost hrane; nadležna tijela provode službene kontrole.</li>' +
        '<li><strong>Opasnost</strong> — biološki, kemijski ili fizikalni agens u hrani (ili stanje hrane) koji može štetno djelovati na zdravlje.</li>' +
        '<li><strong>Rizik</strong> — vjerojatnost štetnog učinka na zdravlje i težina tog učinka kao posljedica opasnosti.</li>' +
        '</ul>' +

        '<h3>Opasnosti u hrani</h3>' +
        '<table>' +
        '<tr><th>Vrsta</th><th>Primjeri</th></tr>' +
        '<tr><td><strong>Biološke</strong></td><td>bakterije (Salmonella, Campylobacter, Listeria), virusi, <strong>paraziti</strong> (Anisakis u ribi, Trichinella u mesu), plijesni i njihovi toksini</td></tr>' +
        '<tr><td><strong>Kemijske</strong></td><td>ostaci pesticida i veterinarskih lijekova, teški metali (živa, olovo), prirodni toksini (histamin), ostaci sredstava za čišćenje i dezinfekciju, nedopušteni aditivi; alergeni</td></tr>' +
        '<tr><td><strong>Fizikalne</strong></td><td>staklo, metal, kamenčići, komadići kosti, plastika, drvo</td></tr>' +
        '</table>' +
        '<div class="warning-box"><strong>Zamka:</strong> kemijske opasnosti NE uključuju parazite — paraziti su živi organizmi, dakle <strong>biološka</strong> opasnost.</div>' +

        '<h3>HACCP</h3>' +
        '<p><strong>HACCP</strong> (engl. <em>Hazard Analysis and Critical Control Points</em>) — sustav analize opasnosti i kritičnih kontrolnih točaka. To je <strong>preventivan</strong> pristup: umjesto da se kontrolira samo gotov proizvod, opasnosti se prepoznaju i nadziru na mjestima u procesu gdje ih je moguće spriječiti. U EU je obvezan za sve subjekte u poslovanju s hranom (osim primarne proizvodnje).</p>' +
        '<p>Temelj HACCP-a su <strong>preduvjetni programi</strong> — dobra higijenska i dobra proizvođačka praksa: čišćenje i dezinfekcija, kontrola štetnika, osobna higijena i zdravlje osoblja, ispravna voda, održavanje opreme, kontrola dobavljača, sljedivost.</p>' +
        '<h4>Sedam načela HACCP-a</h4>' +
        '<ol>' +
        '<li><strong>Analiza opasnosti</strong> — prepoznati sve biološke, kemijske i fizikalne opasnosti u svakom koraku i procijeniti njihov rizik.</li>' +
        '<li><strong>Određivanje kritičnih kontrolnih točaka (KKT)</strong> — koraka u procesu u kojima se kontrola može primijeniti i ključna je za sprečavanje, uklanjanje ili smanjenje opasnosti na prihvatljivu razinu (npr. kuhanje, hlađenje, pasterizacija, detektor metala).</li>' +
        '<li><strong>Utvrđivanje kritičnih granica</strong> — mjerljivih kriterija koji odvajaju prihvatljivo od neprihvatljivog (npr. temperatura jezgre najmanje 72 °C, hladnjak do +4 °C, pH).</li>' +
        '<li><strong>Monitoring</strong> — planirani slijed promatranja ili mjerenja kojim se provjerava je li KKT pod kontrolom (tko, što, kada, kako mjeri).</li>' +
        '<li><strong>Korektivne mjere</strong> — provode se kad monitoring pokaže da je <strong>kritična granica prekoračena</strong> (npr. dodatno kuhanje, prilagodba hladnjaka, odbacivanje proizvoda).</li>' +
        '<li><strong>Verifikacija</strong> — provjera <strong>djeluje li sustav učinkovito</strong>: pregled evidencija, dodatne analize, interni audit, kalibracija uređaja. Verifikacija NE uključuje propisivanje korektivnih mjera.</li>' +
        '<li><strong>Dokumentacija i evidencija</strong> — pisani HACCP plan i zapisi o monitoringu, korektivnim mjerama i verifikaciji.</li>' +
        '</ol>' +
        '<table>' +
        '<tr><th>Pojam</th><th>Pitanje na koje odgovara</th></tr>' +
        '<tr><td>Monitoring</td><td>Je li KKT upravo sada pod kontrolom?</td></tr>' +
        '<tr><td>Korektivna mjera</td><td>Što činimo kad granica nije zadovoljena?</td></tr>' +
        '<tr><td>Verifikacija</td><td>Radi li cijeli sustav kako treba?</td></tr>' +
        '</table>' +

        '<h3>Sljedivost, povlačenje i opoziv</h3>' +
        '<p><strong>Sljedivost</strong> — svaki subjekt mora znati od koga je primio i kome je isporučio hranu (<strong>„korak naprijed – korak natrag”</strong>). Zahvaljujući oznaci serije i datuma, nesigurna serija može se brzo pronaći.</p>' +
        '<table>' +
        '<tr><th>Povlačenje</th><th>Opoziv</th></tr>' +
        '<tr><td>uklanjanje nesigurne hrane dok je još <strong>u distribucijskom lancu</strong> (skladište, veletrgovina, trgovina)</td><td>vraćanje hrane koja je <strong>već stigla do potrošača</strong>; potrošači se obavještavaju</td></tr>' +
        '</table>'
    }
  },

  "healthyDiet": {
    "name": "Uravnotežena prehrana",
    "icon": "fa-heart-pulse",
    "color": "#10b981",
    "flashcards": [
      {
        "question": "Što je URAVNOTEŽENA PREHRANA?",
        "answer": "Unos odgovarajuće količine i omjera makronutrijenata za energetske i fiziološke potrebe, uz dovoljan unos mikronutrijenata i tekućine.",
        "explanation": "Temelj očuvanja zdravlja i sprečavanja kroničnih bolesti."
      },
      {
        "question": "Koja su načela uravnotežene prehrane?",
        "answer": "Raznolikost (kombiniranje skupina hrane), umjerenost (masti, šećer, sol, alkohol, energija) i ravnoteža (oko 85 % kvalitetne hrane i 15 % diskrecijskih kalorija).",
        "explanation": "Diskrecijske kalorije = „slobodne” kalorije za slatko i slično."
      },
      {
        "question": "Preporuke WHO-a za masti, šećer i sol?",
        "answer": "Masti najviše 30 % energije, zasićene najviše 10 %, kolesterol do 300 mg, dodani šećeri najviše 10 % (oko 50 g), sol najviše 5 g dnevno.",
        "explanation": "WHO = Svjetska zdravstvena organizacija."
      },
      {
        "question": "Preporuke WHO-a za UH, bjelančevine, vlakna, voće i povrće?",
        "answer": "Ugljikohidrati 55–75 % energije, bjelančevine 10–15 %, vlakna najmanje 25 g, voće i povrće najmanje 400 g dnevno.",
        "explanation": "Rasponi WHO-a razlikuju se od rasponā za odraslu osobu na 2000 kcal."
      },
      {
        "question": "Preporučeni rasponi makronutrijenata (2000 kcal)?",
        "answer": "Bjelančevine 10–35 % (oko 50 g), ugljikohidrati 45–65 % (oko 300 g), masti 20–35 % (oko 67 g).",
        "explanation": "To su prihvatljivi rasponi, a WHO daje uže ciljeve."
      },
      {
        "question": "Što utječe na energetske potrebe?",
        "answer": "Dob, spol, tjelesna masa, sastav tijela, tjelesna aktivnost te posebna stanja poput trudnoće i dojenja.",
        "explanation": "Energetski unos treba biti u ravnoteži s potrošnjom."
      },
      {
        "question": "Što je INDEKS TJELESNE MASE (ITM)?",
        "answer": "Tjelesna masa (kg) podijeljena kvadratom tjelesne visine (m²); služi za procjenu uhranjenosti.",
        "explanation": "70 kg i 1,75 m → ITM ≈ 22,9."
      },
      {
        "question": "Kako se tumači ITM?",
        "answer": "< 18,5 pothranjenost; 18,5–24,9 normalno; 25–29,9 prekomjerna masa; 30–34,9, 35–39,9 i ≥ 40 pretilost 1., 2. i 3. stupnja.",
        "explanation": "ITM ne razlikuje mišiće od masti."
      },
      {
        "question": "Koje su komponente energetske potrošnje?",
        "answer": "Energija bazalnog metabolizma (60–75 %), termički efekt hrane (~10 %) i termički efekt tjelesne aktivnosti (najpromjenjiviji).",
        "explanation": "Kratice: EBM, TEH, TETA."
      },
      {
        "question": "Što je ENERGIJA BAZALNOG METABOLIZMA?",
        "answer": "Minimalna količina energije potrebna za održavanje života (u mirovanju); oko 60–75 % ukupne potrošnje.",
        "explanation": "Termički efekt hrane: energija za probavu, apsorpciju i metabolizam hrane."
      },
      {
        "question": "Što su prehrambene smjernice?",
        "answer": "Preporuke kako zadovoljiti prehrambene potrebe, održati poželjnu masu i smanjiti rizik kroničnih bolesti; znanstveno utemeljene, jednostavne, za široku populaciju.",
        "explanation": "Prehrambene potrebe ovise o dobi, spolu, aktivnosti i stanju."
      },
      {
        "question": "Kako su se mijenjali modeli pravilne prehrane?",
        "answer": "Piramida (1992) → Moja piramida (2005, „one size doesn’t fit all”) → Moj tanjur (2011).",
        "explanation": "Moja piramida uvela je osobni pristup i tjelesnu aktivnost."
      },
      {
        "question": "Kako izgleda piramida prehrane iz 1992.?",
        "answer": "Temelj: kruh, žitarice, riža, tjestenina. Sredina: voće i povrće. Viši dio: mlijeko, meso, riba, jaja, mahunarke. Vrh: masti, ulja i šećeri – ograničeno.",
        "explanation": "Što je više u piramidi, to se manje jede."
      },
      {
        "question": "Što je MOJ TANJUR (2011)?",
        "answer": "Tanjur podijeljen na voće, povrće, žitarice i bjelančevine, uz mliječne proizvode kao dodatnu skupinu.",
        "explanation": "Poruke: manje porcije, voda umjesto zaslađenih pića, manje soli."
      },
      {
        "question": "Prehrambena vs zdravstvena tvrdnja?",
        "answer": "Prehrambena: hrana ima posebna prehrambena svojstva zbog energije ili nutrijenata (npr. „bogato vlaknima”). Zdravstvena: povezuje hranu i zdravlje.",
        "explanation": "Primjer zdravstvene: „kalcij je potreban za održavanje normalnih kostiju”."
      },
      {
        "question": "Što je FOPL oznaka?",
        "answer": "Pojednostavljena nutritivna oznaka na prednjoj strani ambalaže (npr. semafor, Nutri-Score); nije obavezna.",
        "explanation": "Front of Package Label."
      },
      {
        "question": "Što obilježava MEDITERANSKU prehranu?",
        "answer": "Osnova: cjelovite žitarice, voće, povrće, mahunarke, maslinovo ulje, orašasti plodovi. Umjereno: mliječni proizvodi, jaja, perad. Rijetko: crveno meso.",
        "explanation": "Uz to: tjelesna aktivnost, druženje, lokalna i sezonska hrana."
      },
      {
        "question": "Što je DASH prehrana?",
        "answer": "Prehrana za snižavanje i kontrolu krvnog tlaka: povrće, voće, cjelovite žitarice, malomasni mliječni proizvodi; ograničava šećer, zasićene masti, natrij i alkohol.",
        "explanation": "DASH = Dietary Approaches to Stop Hypertension."
      },
      {
        "question": "Što je MIND prehrana?",
        "answer": "Prehrana za zdravlje mozga: zeleno lisnato povrće, bobičasto voće, orašasti plodovi, cjelovite žitarice, riba, maslinovo ulje; izbjegava crveno meso, maslac, margarin, prženo.",
        "explanation": "Cilj: manji rizik neurodegenerativnih bolesti."
      },
      {
        "question": "Što obilježava NORDIJSKU prehranu?",
        "answer": "Povrće, voće (bobičasto), riba, plodovi mora, cjelovite žitarice (ječam, raž, zob – β-glukan), bademi; glavna masnoća je repičino ulje.",
        "explanation": "Rijetko: crveno meso i životinjske masti."
      }
    ],
    "quiz": [
      {
        "question": "Tri načela uravnotežene prehrane su:",
        "options": ["Raznolikost, umjerenost i ravnoteža", "Post, detoksikacija i suplementi", "Brojanje kalorija, vaganje i post", "Visok unos bjelančevina, masti i soli"],
        "correct": 0
      },
      {
        "question": "Prema WHO-u unos soli trebao bi biti najviše:",
        "options": ["15 g dnevno", "5 g dnevno", "25 g dnevno", "1 g tjedno"],
        "correct": 1
      },
      {
        "question": "ITM od 27 označava:",
        "options": ["Normalnu uhranjenost", "Pothranjenost", "Prekomjernu tjelesnu masu", "Pretilost 2. stupnja"],
        "correct": 2
      },
      {
        "question": "Najpromjenjivija komponenta energetske potrošnje je:",
        "options": ["Energija bazalnog metabolizma", "Termički efekt probave hrane", "Energija za rast kose i noktiju", "Termički efekt tjelesne aktivnosti"],
        "correct": 3
      },
      {
        "question": "Energija bazalnog metabolizma čini:",
        "options": ["60–75 % potrošnje", "5–10 % potrošnje", "25–30 % potrošnje", "90–100 % potrošnje"],
        "correct": 0
      },
      {
        "question": "DASH prehrana namijenjena je:",
        "options": ["Očuvanju zdravlja mozga", "Snižavanju krvnog tlaka", "Povećanju mišićne mase", "Liječenju celijakije"],
        "correct": 1
      },
      {
        "question": "MIND prehrana usmjerena je na:",
        "options": ["Snižavanje krvnog tlaka", "Mršavljenje postom", "Zdravlje mozga", "Sportsku izvedbu"],
        "correct": 2
      },
      {
        "question": "Glavna masnoća nordijske prehrane je:",
        "options": ["Maslinovo ulje", "Maslac", "Svinjska mast", "Repičino ulje"],
        "correct": 3
      },
      {
        "question": "Temelj piramide prehrane iz 1992. čine:",
        "options": ["Kruh, žitarice, riža i tjestenina", "Voće i povrće", "Meso, riba i jaja", "Masti, ulja i šećeri"],
        "correct": 0
      },
      {
        "question": "Oznaka FOPL na prednjoj strani ambalaže je:",
        "options": ["Obavezna za svu hranu", "Dobrovoljna", "Obavezna samo za alkohol", "Zabranjena u EU"],
        "correct": 1
      },
      {
        "question": "Natpis „bogato vlaknima” primjer je:",
        "options": ["Zdravstvene tvrdnje", "Nutritivne deklaracije", "Prehrambene tvrdnje", "Oznake podrijetla"],
        "correct": 2
      },
      {
        "question": "Dodani šećeri prema WHO-u trebaju činiti najviše:",
        "options": ["30 % energije (≈ 150 g)", "1 % energije (≈ 5 g)", "50 % energije (≈ 250 g)", "10 % energije (≈ 50 g)"],
        "correct": 3
      },
      {
        "question": "Termički efekt hrane iznosi oko:",
        "options": ["10 % energetskog unosa", "50 % energetskog unosa", "1 % energetskog unosa", "75 % energetskog unosa"],
        "correct": 0
      },
      {
        "question": "ITM se računa kao:",
        "options": ["Visina (cm) − 100", "Masa (kg) / visina² (m²)", "Masa (kg) × visina (m)", "Opseg struka / opseg bokova"],
        "correct": 1
      }
    ],
    "fillBlanks": [
      {
        "sentence": "ITM se računa kao omjer tjelesne mase i kvadrata tjelesne _______.",
        "answer": "visine",
        "hint": "Mjeri se u metrima."
      },
      {
        "sentence": "Model „Moj tanjur” uveden je _______. godine.",
        "answer": "2011",
        "hint": "Godina."
      },
      {
        "sentence": "DASH prehrana služi za snižavanje krvnog _______.",
        "answer": "tlaka",
        "hint": "Hipertenzija."
      },
      {
        "sentence": "Prema WHO-u dnevno treba unijeti najmanje _______ g prehrambenih vlakana.",
        "answer": "25",
        "hint": "Broj."
      },
      {
        "sentence": "Glavna masnoća nordijske prehrane je _______ ulje.",
        "answer": "repičino",
        "hint": "Uljana repica."
      },
      {
        "sentence": "Minimalna energija potrebna za održavanje života zove se energija _______ metabolizma.",
        "answer": "bazalnog",
        "hint": "EBM."
      }
    ],
    "learn": {
      "title": "Uravnotežena prehrana",
      "content":
        '<h3>Uravnotežena prehrana</h3>' +
        '<p><strong>Uravnotežena prehrana</strong> podrazumijeva unos odgovarajuće količine i omjera makronutrijenata koji zadovoljavaju energetske i fiziološke potrebe organizma, uz dovoljan unos mikronutrijenata i tekućine.</p>' +
        '<ul>' +
        '<li><strong>Raznolikost</strong> — kombiniranje različitih skupina hrane radi bolje iskoristivosti hranjivih tvari (npr. mahunarke + žitarice; biljno željezo + vitamin C).</li>' +
        '<li><strong>Umjerenost</strong> — ograničavanje masti, šećera, soli, alkohola i ukupne energije.</li>' +
        '<li><strong>Ravnoteža</strong> — približno <strong>85 % kvalitetne hrane i 15 % diskrecijskih kalorija</strong>.</li>' +
        '</ul>' +

        '<h3>Preporuke Svjetske zdravstvene organizacije (WHO)</h3>' +
        '<table>' +
        '<tr><th>Sastojak</th><th>Preporuka</th></tr>' +
        '<tr><td>Masti</td><td>najviše 30 % dnevnog energetskog unosa</td></tr>' +
        '<tr><td>Zasićene masne kiseline</td><td>najviše 10 %</td></tr>' +
        '<tr><td>Kolesterol</td><td>do 300 mg dnevno</td></tr>' +
        '<tr><td>Ugljikohidrati</td><td>55–75 %</td></tr>' +
        '<tr><td>Dodani šećeri</td><td>najviše 10 % (oko 50 g)</td></tr>' +
        '<tr><td>Bjelančevine</td><td>10–15 %</td></tr>' +
        '<tr><td>Sol</td><td>najviše 5 g dnevno</td></tr>' +
        '<tr><td>Voće i povrće</td><td>najmanje 400 g dnevno</td></tr>' +
        '<tr><td>Prehrambena vlakna</td><td>najmanje 25 g dnevno</td></tr>' +
        '</table>' +

        '<h3>Energetske potrebe</h3>' +
        '<p><strong>Energetske potrebe</strong> su količina energije potrebna za održavanje tjelesnih funkcija i aktivnosti; unos treba biti u ravnoteži s potrošnjom. Na njih utječu dob, spol, tjelesna masa, sastav tijela, tjelesna aktivnost te trudnoća i dojenje.</p>' +
        '<p><strong>Indeks tjelesne mase (ITM)</strong> = tjelesna masa (kg) / tjelesna visina² (m²) — procjena uhranjenosti.</p>' +
        '<table>' +
        '<tr><th>ITM</th><th>Kategorija</th></tr>' +
        '<tr><td>&lt; 18,5</td><td>pothranjenost</td></tr>' +
        '<tr><td>18,5–24,9</td><td>normalna uhranjenost</td></tr>' +
        '<tr><td>25,0–29,9</td><td>prekomjerna tjelesna masa</td></tr>' +
        '<tr><td>30,0–34,9</td><td>pretilost 1. stupnja</td></tr>' +
        '<tr><td>35,0–39,9</td><td>pretilost 2. stupnja</td></tr>' +
        '<tr><td>≥ 40</td><td>pretilost 3. stupnja</td></tr>' +
        '</table>' +
        '<div class="example-box"><strong>Primjer:</strong> 70 kg, 1,75 m → ITM = 70 / 1,75² = 70 / 3,06 ≈ 22,9 → normalna uhranjenost.</div>' +
        '<h4>Komponente energetske potrošnje</h4>' +
        '<table>' +
        '<tr><th>Komponenta</th><th>Udio</th><th>Opis</th></tr>' +
        '<tr><td><strong>EBM</strong> — energija bazalnog metabolizma</td><td>60–75 %</td><td>minimalna energija za održavanje života</td></tr>' +
        '<tr><td><strong>TEH</strong> — termički efekt hrane</td><td>~10 %</td><td>energija za probavu, apsorpciju i metabolizam hrane</td></tr>' +
        '<tr><td><strong>TETA</strong> — termički efekt tjelesne aktivnosti</td><td>promjenjivo</td><td><strong>najpromjenjivija</strong> komponenta</td></tr>' +
        '</table>' +

        '<h3>Prehrambene potrebe</h3>' +
        '<p>Količina hranjivih tvari potrebna pojedincu ovisno o dobi, spolu, aktivnosti i fiziološkom stanju. <strong>Preporučeni rasponi za odraslu osobu (2000 kcal):</strong></p>' +
        '<table>' +
        '<tr><th>Makronutrijent</th><th>Udio energije</th><th>Približno</th></tr>' +
        '<tr><td>Bjelančevine</td><td>10–35 %</td><td>oko 50 g</td></tr>' +
        '<tr><td>Ugljikohidrati</td><td>45–65 %</td><td>oko 300 g</td></tr>' +
        '<tr><td>Masti</td><td>20–35 %</td><td>oko 67 g</td></tr>' +
        '</table>' +
        '<div class="warning-box"><strong>Ne miješaj dvije tablice:</strong> WHO daje uže ciljeve (UH 55–75 %, bjelančevine 10–15 %, masti do 30 %), a tablica „2000 kcal” daje šire prihvatljive raspone (UH 45–65 %, bjelančevine 10–35 %, masti 20–35 %). Na ispitu pazi koja se preporuka traži.</div>' +

        '<h3>Prehrambene smjernice i modeli</h3>' +
        '<p><strong>Prehrambene smjernice</strong> su preporuke koje pomažu zadovoljiti prehrambene potrebe, održati poželjnu tjelesnu masu i smanjiti rizik od kroničnih bolesti; temelje se na znanstvenim istraživanjima, jednostavne su i namijenjene širokoj populaciji.</p>' +
        '<table>' +
        '<tr><th>Model</th><th>Obilježja</th></tr>' +
        '<tr><td><strong>Piramida uravnotežene prehrane (1992)</strong></td><td>temelj: kruh, žitarice, riža, tjestenina · sredina: voće i povrće · viši dio: mlijeko, mliječni proizvodi, meso, riba, jaja, mahunarke · vrh: masti, ulja i šećeri (ograničeno)</td></tr>' +
        '<tr><td><strong>Moja piramida (2005)</strong></td><td>personalizirani pristup — „one size doesn’t fit all”; uključuje tjelesnu aktivnost</td></tr>' +
        '<tr><td><strong>Moj tanjur (2011)</strong></td><td>tanjur: voće, povrće, žitarice, bjelančevine + mliječni proizvodi sa strane; poruke: manje porcije, voda umjesto zaslađenih pića, manje soli</td></tr>' +
        '</table>' +

        '<h3>Oznake na hrani</h3>' +
        '<ul>' +
        '<li><strong>Nutritivna deklaracija</strong> — energija, masti, zasićene masne kiseline, ugljikohidrati, šećeri, bjelančevine i sol.</li>' +
        '<li><strong>Prehrambena tvrdnja</strong> — hrana ima određena prehrambena svojstva zbog energije ili hranjivih tvari (npr. „bogato vlaknima”, „smanjen udio masti”).</li>' +
        '<li><strong>Zdravstvena tvrdnja</strong> — povezuje hranu ili njezin sastojak sa zdravljem.</li>' +
        '<li><strong>FOPL</strong> (<em>Front of Package Label</em>) — pojednostavljena oznaka na prednjoj strani ambalaže; <strong>nije obavezna</strong>.</li>' +
        '</ul>' +

        '<h3>Modeli prehrane za unapređenje zdravlja</h3>' +
        '<table>' +
        '<tr><th>Model</th><th>Cilj i naglasak</th><th>Ograničava</th></tr>' +
        '<tr><td><strong>Mediteranska</strong></td><td>osnova: cjelovite žitarice, voće, povrće, mahunarke, <strong>maslinovo ulje</strong>, orašasti plodovi; umjereno mliječni proizvodi, jaja, perad; uz tjelesnu aktivnost, druženje, lokalnu i sezonsku hranu</td><td>crveno meso (rijetko)</td></tr>' +
        '<tr><td><strong>DASH</strong></td><td><strong>snižavanje i kontrola krvnog tlaka</strong>; povrće, voće, cjelovite žitarice, malomasni mliječni proizvodi, kvalitetne bjelančevine</td><td>dodani šećer, zasićene masti, natrij, alkohol</td></tr>' +
        '<tr><td><strong>MIND</strong></td><td><strong>zdravlje mozga</strong>, manji rizik neurodegenerativnih bolesti; zeleno lisnato povrće, bobičasto voće, orašasti plodovi, cjelovite žitarice, riba, maslinovo ulje</td><td>crveno meso, maslac, margarin, pržena hrana</td></tr>' +
        '<tr><td><strong>Nordijska</strong></td><td>povrće, voće (bobičasto), riba i plodovi mora, cjelovite žitarice (ječam, raž, zob — β-glukan), bademi; glavna masnoća <strong>repičino ulje</strong></td><td>crveno meso, životinjske masti</td></tr>' +
        '</table>'
    }
  }
};

if (typeof window !== 'undefined') { window.foodNutritionHrM2 = foodNutritionHrM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = foodNutritionHrM2; }
