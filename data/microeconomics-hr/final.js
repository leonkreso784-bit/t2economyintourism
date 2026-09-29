// Mikroekonomija (HR) — Final (završni ispit / ispitni rokovi)
// AUTORSKI IZ HR MATERIJALA (studentske skripte FMTU + Pindyck kao dopuna) — NE doslovan prijevod EN microeconomics.
// MODEL: kartice <200 znak, detalj u learn.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!
//
// Spaja HR M1 + M2 + examPractice. MORA se učitati POSLIJE midterm-1.js i midterm-2.js.
// Ispitni rok = gradivo oba kolokvija (Pindyck 1–14 i 18), isti LC format (10 pitanja, 2 runde).
// KaTeX: \\( \\) inline, \\[ \\] blok; postotak u formuli = \\%; NIKAD jedan dolar-znak.

const microeconomicsHrFinalExamPractice = {
  name: 'Vježba za ispit (sve teme)',
  icon: 'fa-graduation-cap',
  color: '#f59e0b',
  flashcards: [
    {
      question: 'Kako izgleda kolokvij ili ispitni rok iz Mikroekonomije?',
      answer: '10 pitanja u Learning Catalyticsu: individualna runda (40 min, 60 %) pa timska runda s istim pitanjima (20 min, 40 %, dva pokušaja).',
      explanation: 'Dopuštene su knjiga, skripta i prezentacije — pitanja zato traže primjenu, ne definiciju napamet.'
    },
    {
      question: 'Što pokriva koji kolokvij?',
      answer: 'K1: Pindyck poglavlja 1–7 (uvod do troškova). K2: poglavlja 8–14 i 18 (konkurencija do eksternalija). Ispitni rok: sve.',
      explanation: 'Svaki kolokvij nosi 24 % ocjene.'
    },
    {
      question: 'PONAVLJANJE: MRS ili MRTS?',
      answer: 'MRS = nagib krivulje indiferencije (potrošač, \\(MU_X/MU_Y\\)). MRTS = nagib izokvante (proizvođač, \\(MP_L/MP_K\\)).',
      explanation: 'Isti oblik logike: odricanje od jednog radi drugog uz nepromijenjen ishod.'
    },
    {
      question: 'PONAVLJANJE: budžetska crta ili izotroškovna crta?',
      answer: 'Budžetska: \\(P_X X + P_Y Y = I\\), nagib \\(-P_X/P_Y\\). Izotroškovna: \\(wL + rK = C\\), nagib \\(-w/r\\).',
      explanation: 'Optimum u oba slučaja: tangenta na krivulju indiferencije odnosno izokvantu.'
    },
    {
      question: 'PONAVLJANJE: univerzalno pravilo maksimalizacije profita?',
      answer: '\\(MR = MC\\). U savršenoj konkurenciji \\(MR = P\\), pa \\(P = MC\\); monopolist ima \\(MR < P\\).',
      explanation: 'Monopsonist analogno: \\(ME = MV\\); zapošljavanje: \\(MRP_L = w\\).'
    },
    {
      question: 'PONAVLJANJE: četiri tržišne strukture u jednom redu?',
      answer: 'Savršena konkurencija (mnogo, homogeno), monopolistička konkurencija (mnogo, diferencirano), oligopol (nekoliko, ograničen ulaz), monopol (jedan).',
      explanation: 'Dugoročni ekonomski profit je nula tamo gdje je ulazak slobodan.'
    },
    {
      question: 'PONAVLJANJE: predznaci elastičnosti?',
      answer: 'Cjenovna potražnje obično negativna; dohodovna: + normalno, − inferiorno; unakrsna: + supstituti, − komplementi; ponude obično pozitivna.',
      explanation: 'Česta pitanja „koje je dobro…” rješavaju se samo predznakom.'
    },
    {
      question: 'PONAVLJANJE: probitak potrošača ili probitak proizvođača?',
      answer: 'Potrošača: površina ispod potražnje iznad cijene. Proizvođača: površina iznad ponude ispod cijene (= prihod − varijabilni trošak).',
      explanation: 'Njihov zbroj mjeri blagostanje; gubitak probitka = mrtvi teret.'
    },
    {
      question: 'PONAVLJANJE: zatvoriti pogon ili izaći iz industrije?',
      answer: 'Kratki rok: zatvara pogon ako \\(P < AVC\\). Dugi rok: izlazi ako \\(P < ATC\\).',
      explanation: 'Fiksni trošak u kratkom roku plaća se u svakom slučaju.'
    },
    {
      question: 'PONAVLJANJE: efekt supstitucije i efekt dohotka — gdje se sve pojavljuju?',
      answer: 'Kod potrošača (pad cijene dobra; Giffenovo dobro) i kod ponude rada (porast nadnice; unazad savinuta krivulja).',
      explanation: 'Uvijek: supstitucija = relativna cijena, dohodak = kupovna moć.'
    },
    {
      question: 'PONAVLJANJE: ekonomske ili računovodstvene veličine?',
      answer: 'Ekonomski trošak uključuje oportunitetni trošak; zato je ekonomski profit manji od računovodstvenog. Nulti ekonomski profit = normalni prinos.',
      explanation: 'Nepovratni trošak ne ulazi u odluke.'
    },
    {
      question: 'Najčešće greške u studentskim skriptama?',
      answer: 'Vodoravna potražnja = savršeno ELASTIČNA; komplementi imaju NEGATIVNU unakrsnu elastičnost; kratki rok = barem jedan input se NE može mijenjati; MC = trošak dodatne jedinice ISTOG dobra.',
      explanation: 'Provjeri definiciju u knjizi kad skripta zvuči čudno.'
    }
  ],
  quiz: [
    {
      question: 'Tvrdnja „Država bi trebala oporezovati sokove sa šećerom” je:',
      options: ['Pozitivna', 'Normativna', 'Makroekonomska prognoza', 'Činjenična'],
      correct: 1
    },
    {
      question: 'Cijena poraste 8 %, a \\(|E_P| = 2{,}5\\). Tražena količina se promijeni za:',
      options: ['−3,2 %', '−20 %', '−10,5 %', '+20 %'],
      correct: 1
    },
    {
      question: 'Dohodak 60 €, \\(P_X = 3\\) €, \\(P_Y = 4\\) €. Najveća moguća količina dobra Y je:',
      options: ['20', '15', '12', '240'],
      correct: 1
    },
    {
      question: 'Koja tvrdnja je TOČNA?',
      options: ['Svako inferiorno dobro je Giffenovo', 'Svako Giffenovo dobro je inferiorno', 'Giffenovo dobro ima negativan nagib potražnje', 'Kod normalnog dobra efekt dohotka je negativan'],
      correct: 1
    },
    {
      question: 'Lutrija: 20 % šanse za 500 €, 80 % za 0 €. Očekivana vrijednost je:',
      options: ['80 €', '100 €', '400 €', '500 €'],
      correct: 1
    },
    {
      question: '8 radnika tjedno proizvede 320 ležaljki. Uz konstantan APL, koliko DODATNIH radnika treba za 480 ležaljki?',
      options: ['2', '4', '12', '40'],
      correct: 1
    },
    {
      question: 'FC = 200 €, VC pri q = 10 iznosi 300 €. Prosječni ukupni trošak je:',
      options: ['20 €', '30 €', '50 €', '500 €'],
      correct: 2
    },
    {
      question: 'Konkurentna tvrtka: P = 12 €, AVC = 10 €, ATC = 15 €. U kratkom roku ona:',
      options: ['Zatvara pogon', 'Proizvodi uz gubitak manji od fiksnog troška', 'Ostvaruje profit', 'Odmah izlazi iz industrije'],
      correct: 1
    },
    {
      question: 'Monopolist prodaje po 50 €, a MC mu je 30 €. Lernerov indeks je:',
      options: ['0,4', '0,6', '1,67', '20'],
      correct: 0
    },
    {
      question: 'Hotel prodaje noćenje, polupansion i wellness i pojedinačno i zajedno po povoljnijoj cijeni. To je:',
      options: ['Čista prodaja u paketu', 'Mješovita prodaja u paketu', 'Vezivanje', 'Diskriminacija prvog stupnja'],
      correct: 1
    },
    {
      question: 'Porez po jedinici na dobro s vrlo neelastičnom potražnjom većim dijelom snose:',
      options: ['Proizvođači', 'Potrošači', 'Država', 'Podjednako, uvijek'],
      correct: 1
    },
    {
      question: 'Cjenovna elastičnost potražnje je \\(-0{,}2\\), a elastičnost ponude \\(0{,}8\\). Koji udio poreza po jedinici snose kupci?',
      options: ['20 %', '80 %', '50 %', '25 %'],
      correct: 1
    },
    {
      question: 'Što je zajedničko Cournotovoj ravnoteži i ishodu dileme zatvorenika?',
      options: ['Obje su Nashove ravnoteže', 'Obje daju najveći zajednički profit', 'Obje traže obvezujući ugovor', 'Obje vrijede samo za monopol'],
      correct: 0
    },
    {
      question: 'Što je zajedničko javnom dobru i pozitivnoj eksternaliji na slobodnom tržištu?',
      options: ['Tržište ih nudi premalo', 'Tržište ih nudi previše', 'Oba su prirodni monopoli', 'Cijena im je uvijek nula'],
      correct: 0
    },
    {
      question: 'Efikasan porez na zagađivača (po jedinici) jednak je:',
      options: ['Privatnom graničnom trošku', 'Graničnom eksternom trošku u efikasnoj točki', 'Cijeni proizvoda', 'Prosječnom trošku'],
      correct: 1
    },
    {
      question: 'Razdoblje u kojem se svi inputi mogu mijenjati zove se:',
      options: ['Kratki rok', 'Dugi rok', 'Tržišni rok', 'Obračunsko razdoblje'],
      correct: 1
    }
  ],
  fillBlanks: [
    {
      sentence: 'Pravilo maksimalizacije profita za svaku tržišnu strukturu glasi: granični prihod = granični _______.',
      answer: 'trošak',
      hint: '\\(MR = MC\\).'
    },
    {
      sentence: 'Ako je \\(|E_P| = 2{,}5\\) i cijena poraste 8 %, tražena količina padne za _______ posto.',
      answer: '20',
      hint: '\\(2{,}5 \\cdot 8\\).'
    },
    {
      sentence: 'Dohodak 60 €, cijena dobra X 3 €: najviše se može kupiti _______ jedinica X.',
      answer: '20',
      hint: '\\(I/P_X\\).'
    },
    {
      sentence: 'Nagib izokvante mjeri granična stopa _______ supstitucije.',
      answer: 'tehničke',
      hint: 'MRTS.'
    },
    {
      sentence: 'Uz FC = 200 € i q = 10 prosječni fiksni trošak iznosi _______ €.',
      answer: '20',
      hint: '\\(FC/q\\).'
    },
    {
      sentence: 'Lernerov indeks uz P = 50 € i MC = 30 € iznosi _______ posto.',
      answer: '40',
      hint: '\\((P - MC)/P\\).'
    },
    {
      sentence: 'Ono što je krivulja indiferencije za potrošača, to je _______ za proizvođača.',
      answer: 'izokvanta',
      hint: 'Kombinacije inputa uz isti output.'
    },
    {
      sentence: 'Monopol, porez po jedinici i plafonska cijena imaju istu posljedicu: razmijenjena količina je _______ od efikasne.',
      answer: 'manja',
      hint: 'Zato nastaje mrtvi teret.'
    },
    {
      sentence: 'Tvrtka: FC = 200 €, VC = 300 € pri q = 10, cijena 45 €. Njezin gubitak iznosi _______ €.',
      answer: '50',
      hint: '\\(TR - TC = 450 - 500\\).'
    },
    {
      sentence: 'Lutrija s 20 % šanse za 500 € ima očekivanu vrijednost _______ €.',
      answer: '100',
      hint: '\\(0{,}2 \\cdot 500\\).'
    }
  ],
  learn: {
    title: 'Vježba za ispit (sve teme)',
    content:
      '<h3>Format ispita</h3>' +
      '<p>Kolokviji i ispitni rokovi pišu se u sustavu <strong>Learning Catalytics</strong> (prema uputama kolegija 2025./26.):</p>' +
      '<table><thead><tr><th></th><th>Individualna runda</th><th>Timska runda</th></tr></thead><tbody>' +
      '<tr><td>Trajanje</td><td>40 min</td><td>20 min</td></tr>' +
      '<tr><td>Udio</td><td>60 %</td><td>40 %</td></tr>' +
      '<tr><td>Bodovi po pitanju</td><td>10</td><td>10 iz prvog, 5 iz drugog pokušaja</td></tr>' +
      '<tr><td>Pitanja</td><td colspan="2">10 istih pitanja u obje runde</td></tr></tbody></table>' +
      '<p>Rezultat u postocima množi se s 0,24 (kolokvij nosi najviše 24 boda). Primjer: 60 bodova individualno i 85 timski → \\(0{,}6 \\cdot 60 + 0{,}4 \\cdot 85 = 70\\) → \\(70 \\cdot 0{,}24 = 16{,}8\\) bodova. Dopuštene su knjiga, skripta i prezentacije, pa pitanja traže <strong>primjenu</strong>: računanje, čitanje grafa, prepoznavanje slučaja.</p>' +
      '<h4>Karta kolegija</h4>' +
      '<table><thead><tr><th>K1 (pogl. 1–7)</th><th>K2 (pogl. 8–14, 18)</th></tr></thead><tbody>' +
      '<tr><td>Uvod: mikro/makro, pozitivno/normativno, realne cijene</td><td>Maksimalizacija profita, konkurentna ponuda</td></tr>' +
      '<tr><td>Ponuda i potražnja, ravnoteža, kontrola cijena</td><td>Analiza konkurentnih tržišta (probitci, porezi)</td></tr>' +
      '<tr><td>Elastičnosti</td><td>Monopol i monopson</td></tr>' +
      '<tr><td>Ponašanje potrošača (krivulje indiferencije, budžet)</td><td>Određivanje cijena uz tržišnu moć</td></tr>' +
      '<tr><td>Pojedinačna i tržišna potražnja</td><td>Monopolistička konkurencija i oligopol</td></tr>' +
      '<tr><td>Nesigurnost i rizik</td><td>Teorija igara</td></tr>' +
      '<tr><td>Proizvodnja</td><td>Tržišta faktora</td></tr>' +
      '<tr><td>Troškovi</td><td>Eksternalije i javna dobra</td></tr></tbody></table>' +
      '<h4>Formule na jednom mjestu</h4>' +
      '<table><thead><tr><th>Pojam</th><th>Formula</th></tr></thead><tbody>' +
      '<tr><td>Cjenovna elastičnost</td><td>\\(E_P = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{P}{Q}\\cdot\\frac{\\Delta Q}{\\Delta P}\\)</td></tr>' +
      '<tr><td>Optimum potrošača</td><td>\\(MRS = \\frac{P_X}{P_Y}\\), \\(\\frac{MU_X}{P_X} = \\frac{MU_Y}{P_Y}\\)</td></tr>' +
      '<tr><td>Očekivana vrijednost</td><td>\\(E(X) = \\sum p_i X_i\\)</td></tr>' +
      '<tr><td>Proizvodnja</td><td>\\(AP_L = q/L\\), \\(MP_L = \\Delta q/\\Delta L\\), \\(MRTS = MP_L/MP_K\\)</td></tr>' +
      '<tr><td>Troškovi</td><td>\\(TC = FC + VC\\), \\(MC = \\Delta TC/\\Delta q\\), \\(ATC = TC/q\\)</td></tr>' +
      '<tr><td>Minimalni trošak</td><td>\\(MP_L/w = MP_K/r\\)</td></tr>' +
      '<tr><td>Profit</td><td>\\(MR = MC\\); konkurencija \\(P = MC\\)</td></tr>' +
      '<tr><td>Monopolska moć</td><td>\\(L = \\frac{P - MC}{P} = -\\frac{1}{E_D}\\)</td></tr>' +
      '<tr><td>Porezni teret kupaca</td><td>\\(\\frac{E_S}{E_S - E_D}\\)</td></tr>' +
      '<tr><td>Zapošljavanje</td><td>\\(MRP_L = MP_L \\cdot MR = w\\)</td></tr>' +
      '<tr><td>Eksternalija</td><td>\\(MSC = MC + MEC\\); javno dobro \\(\\sum MB_i = MC\\)</td></tr></tbody></table>' +
      '<div class="example-box"><h4>Riješeni primjer — pitanje koje spaja K1 i K2</h4>' +
      '<p>Tvrtka ima \\(FC = 200\\) € i \\(VC = 300\\) € pri \\(q = 10\\); tržišna cijena je 45 €, a granični trošak pri q = 10 također 45 €.</p>' +
      '<p><strong>K1 dio:</strong> \\(AFC = 20\\), \\(AVC = 30\\), \\(ATC = 50\\).</p>' +
      '<p><strong>K2 dio:</strong> \\(P = MC\\) → q = 10 je optimum. Profit \\(= 450 - 500 = -50\\) €. Budući da je \\(P = 45 &gt; AVC = 30\\), tvrtka u kratkom roku <strong>proizvodi</strong> (zatvaranjem bi izgubila 200 €), a u dugom roku, ako cijena ostane ispod ATC, izlazi iz industrije.</p></div>' +
      '<div class="tip-box"><h4>Strategija za LC</h4><ul>' +
      '<li>U individualnoj rundi riješi sve brzo pa se vrati na računske zadatke — 40 min za 10 pitanja.</li>' +
      '<li>U timskoj rundi drugi pokušaj još nosi 5 bodova: kad tim nije siguran, uzmite najvjerojatniji odgovor pa ga po potrebi popravite.</li>' +
      '<li>Na grafovima prvo pitaj: pomiče li se krivulja ili se krećem uzduž nje?</li>' +
      '<li>Kod postotnih promjena pazi na predznak: pad količine je negativna promjena.</li>' +
      '</ul></div>',
    image: null
  }
};

const microeconomicsHrFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.microeconomicsHrM1) ? window.microeconomicsHrM1
    : (typeof microeconomicsHrM1 !== 'undefined' ? microeconomicsHrM1 : {}),
  (typeof window !== 'undefined' && window.microeconomicsHrM2) ? window.microeconomicsHrM2
    : (typeof microeconomicsHrM2 !== 'undefined' ? microeconomicsHrM2 : {}),
  { examPractice: microeconomicsHrFinalExamPractice }
);

if (typeof window !== 'undefined') { window.microeconomicsHrFinal = microeconomicsHrFinal; }
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(
    {},
    require('./midterm-1.js'),
    require('./midterm-2.js'),
    { examPractice: microeconomicsHrFinalExamPractice }
  );
}
