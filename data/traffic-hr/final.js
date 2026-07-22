// Promet u turizmu (HR) — Final
// Spaja HR M1 + M2 + examPractice. Prijevod EN `traffic` + §5.2 uz HR skriptu; kartice <=200, detalj u learn.
// MORA se učitati POSLIJE midterm-1/2. ⚠️ NE pokretati translate-subject.js (ručno usklađeno)!

const trafficHrFinalExamPractice = {
  "id": "54btuk",
  "name": "Vježba za ispit (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#f59e0b",
  "flashcards": [
    {
      "question": "Koje teme čine dva dijela kolegija koje završni ispit objedinjuje?",
      "answer": "K1: teorijske osnove · međuovisnost prometa i turizma · mobilnost · cestovni promet · željeznica. K2: željeznički proizvod · zračni · vodeni · kvaliteta · sigurnost · ekologija · budućnost.",
      "explanation": "K1 = osnove i kopneni promet; K2 = ostale grane + presječne teme."
    },
    {
      "question": "MEĐUTEMATSKI: koji se dvoulični model primjenjuje na SVAKI oblik prometa?",
      "answer": "Svaki oblik promatra se (1) kao KONEKTOR između tržišta potražnje i destinacije (dostupnost) i (2) kao DIO TURISTIČKOG PROIZVODA (kada je putovanje samo doživljaj).",
      "explanation": "To je master-obrazac cijelog kolegija."
    },
    {
      "question": "PONAVLJANJE: rangirajte grane po brzini, trošku, sigurnosti i elastičnosti.",
      "answer": "Brzina: zračni > željeznica (VVB) > cestovni > vodeni. Trošak: vodeni/željeznica nizak, zračni visok. Sigurnost: željeznica najviša, cestovni najniža. Elastičnost: cestovni najveća.",
      "explanation": "Usporedna tablica → sekcija Uči."
    },
    {
      "question": "MEĐUTEMATSKI: gdje se javlja NEELASTIČNOST i zašto nameće multimodalnost?",
      "answer": "Željeznički, zračni i vodeni promet vezani su uz pruge, luke i vozne redove pa ne nude prijevoz „od vrata do vrata” — zato im treba cestovni nastavak.",
      "explanation": "Otud multimodalnost, MaaS i integrirane karte."
    },
    {
      "question": "PRIPREMA: kako se SIGURNOST i EKOLOGIJA vežu uz kvalitetu i prometnu politiku?",
      "answer": "Sigurnost (aktivna + pasivna) dimenzija je kvalitete i najniža je u cestovnom prometu. Ekologija: promet ≈25% emisija EU-a, cestovni ≈72% toga.",
      "explanation": "Oboje su temelj mjera prometne politike (poticanje željeznice, standardi CO2)."
    },
    {
      "question": "MEĐUTEMATSKI: pratite nit ODRŽIVOSTI kroz kolegij.",
      "answer": "Svakodnevna mobilnost (dominacija automobila) → građani bi prešli na zeleno ako je pristupačno, dostupno i ne sporije → EU strategija (održivo, pametno, otporno) i prekretnice 2030./2050.",
      "explanation": "Detalj → sekcija Uči."
    },
    {
      "question": "PRIPREMA: povežite turistički proizvod s odgovarajućom prometnom granom.",
      "answer": "Krstarenje i nautički turizam → vodeni. Charter i svemirski turizam → zračni. Željeznički turizam i uspinjače → željeznica. Rent-a-car i autobusni izleti → cestovni.",
      "explanation": "Česta ispitna veza proizvod ↔ grana."
    }
  ],
  "quiz": [
    {
      "id": "3yv5ml",
      "question": "Koji se model primjenjuje u kolegiju na SVAKI oblik prijevoza?",
      "options": [
        "Samo jeftino nasuprot skupom",
        "Poveznica (tržište↔destinacija) I dio turističkog proizvoda",
        "Samo ljetni nasuprot samo zimskom",
        "Samo javni nasuprot samo privatnom"
      ],
      "correct": 1
    },
    {
      "id": "3bn8rp",
      "question": "Najbrži oblik prijevoza na dugim/interkontinentalnim relacijama jest:",
      "options": [
        "Željeznica",
        "Zrak",
        "Cesta",
        "Voda"
      ],
      "correct": 1
    },
    {
      "id": "9yjqa0",
      "question": "Najzeleniji motorizirani oblik prijevoza (i cilj EU-ove preraspodjele prometnih tokova) jest:",
      "options": [
        "Zrak",
        "Cesta (osobni automobili)",
        "Željeznica",
        "None"
      ],
      "correct": 2
    },
    {
      "id": "1rle86",
      "question": "Turistički prijevoz tipično je multimodalan jer neelastični oblici prijevoza trebaju ____ za dovršetak putovanja:",
      "options": [
        "zračni",
        "cestovni (od vrata do vrata)",
        "željeznički",
        "pomorski"
      ],
      "correct": 1
    },
    {
      "id": "6tveg4",
      "question": "Sigurnosni pojasevi i zračni jastuci predstavljaju ____ sigurnost; kočnice i upravljač predstavljaju ____ sigurnost:",
      "options": [
        "aktivna / pasivna",
        "pasivna / aktivna",
        "oboje aktivna",
        "oboje pasivna"
      ],
      "correct": 1
    },
    {
      "id": "suotfi",
      "question": "Za otprilike koji udio emisija stakleničkih plinova u EU-u odgovoran je promet?",
      "options": [
        "~5%",
        "~25%",
        "~50%",
        "~90%"
      ],
      "correct": 1
    },
    {
      "id": "1jhwih",
      "question": "'Vremenski charter' u zračnom prometu podrazumijeva:",
      "options": [
        "Jedan jedini let",
        "Isključivo korištenje zrakoplova tijekom cijele sezone (najekonomičnije)",
        "Podjela kapaciteta između agencija",
        "Redovni let niskotarifnog prijevoznika"
      ],
      "correct": 1
    },
    {
      "id": "tbp98b",
      "question": "Strategija EU-a za održivu i pametnu mobilnost predviđa smanjenje emisija u prometu za:",
      "options": [
        "10% do 2050. godine",
        "90% do 2050. godine",
        "25% do 2030. godine",
        "Ne postavlja nikakav cilj"
      ],
      "correct": 1
    }
  ],
  "fillBlanks": [
    {
      "id": "tva157",
      "sentence": "Svaki se oblik prijevoza proučava kao poveznica I kao dio turističkog _______.",
      "answer": "proizvoda",
      "hint": "kada je putovanje samo po sebi atrakcija"
    },
    {
      "id": "m32cqv",
      "sentence": "Neelastični oblici prijevoza (željeznica/zrakoplovstvo/vodeni promet) oslanjaju se na _______ promet za dio od vrata do vrata.",
      "answer": "cestovni",
      "hint": "elastični oblik prijevoza"
    },
    {
      "id": "zva6q1",
      "sentence": "Kombiniranje najmanje dviju prometnih grana u jednom putovanju naziva se _______ (kombinirano) putovanje.",
      "answer": "multimodalno",
      "hint": "više oblika prijevoza"
    },
    {
      "id": "j93yax",
      "sentence": "Ekološki najprihvatljiviji motorizirani oblik prijevoza, kojemu daje prednost politika EU-a o prelasku na ekološki prihvatljivije oblike prijevoza, jest _______.",
      "answer": "željeznica",
      "hint": "električni vlakovi"
    },
    {
      "id": "q7ni3z",
      "sentence": "Promet uzrokuje oko _______ emisija stakleničkih plinova u EU-u.",
      "answer": "četvrtinu",
      "hint": "~25%"
    },
    {
      "id": "09tzar",
      "sentence": "Strategija EU-a ima za cilj smanjiti emisije iz prometa za _______ % do 2050. godine.",
      "answer": "90",
      "hint": "devet-nula"
    }
  ],
  "learn": {
    "id": "cvj8d3",
    "title": "Final Exam Practice — How to Use",
    "content": "\n            <h3>Što je ova kategorija?</h3>\n            <p>Skup zadataka za vježbu koji obuhvaća sve teme kolegija — upravo onako kako ih kombinira završni ispit. Koristite ga NAKON što ponovite oba dijela međuispita.</p>\n\n            <h4>Kolegij na jednoj karti</h4>\n            <div class=\"formula-box\">\n                K1 (tjedni 1–6): teorija · međuovisnost · obrasci mobilnosti · cestovni promet (konektor + proizvod) · željeznica (konektor)<br>\n                K2 (tjedni 7–15): željezničarski proizvod (+uspinjača) · zračni · vodeni · vrijednost &amp; kvaliteta · sigurnost · ekologija · budućnost\n            </div>\n\n            <div class=\"tip-box\">\n                <h4><i class=\"fas fa-lightbulb\"></i> Omiljene međutematske poveznice</h4>\n                <ul>\n                    <li>Svaki vid prometa = KONEKTOR + TURISTIČKI PROIZVOD (temeljni obrazac)</li>\n                    <li>Rangiranje vidova prometa: brzina · cijena · sigurnost · ekologija · elastičnost</li>\n                    <li>Neelastičnost → multimodalnost (cestovni promet povezuje neelastične vidove s polazištem/odredištem)</li>\n                    <li>Sigurnost: aktivna (sprječavanje) vs. pasivna (zaštita); najniža u cestovnom &amp; zračnom prometu</li>\n                    <li>Ekologija: promet ≈25% emisija EU-a; željeznica najzelenija; „onečišćivač plaća\"</li>\n                    <li>Budućnost: 3 stupa · MaaS &amp; integrirano ticketing · −90% do 2050.</li>\n                </ul>\n            </div>\n                <h4>Dopuna — usporedna tablica grana</h4>\n                <div class=\"formula-box\">\n                    BRZINA: zračni ≫ željeznica (VVB) &gt; cestovni &gt; vodeni<br>\n                    TROŠAK po putniku: vodeni/željeznica nizak · cestovni srednji · zračni visok<br>\n                    SIGURNOST: željeznica najviša · vodeni visoka · cestovni i zračni niža<br>\n                    EKOLOGIJA: željeznica najbolja · zračni i cestovni najlošiji<br>\n                    ELASTIČNOST: cestovni najveća · željeznica/zrak/voda neelastični\n                </div>\n                <p><strong>Proizvod ↔ grana:</strong> krstarenje i nautički turizam → vodeni · charter i svemirski turizam → zračni · željeznički turizam, panoramske i planinske željeznice, uspinjače → željeznica · autobusni izleti, rent-a-car i cikloturizam → cestovni.</p>\n            "
  }
};

const trafficHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.trafficHrM1) ? window.trafficHrM1 : {},
    (typeof window !== 'undefined' && window.trafficHrM2) ? window.trafficHrM2 : {},
    { examPractice: trafficHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.trafficHrFinal = trafficHrFinal; }
