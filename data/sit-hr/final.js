// Specifični oblici turizma (HR) — Final
// Spaja HR M1 + M2 + examPractice. AUTORSKI IZ HRVATSKE SKRIPTE. MORA se učitati POSLIJE midterm-1/2.
// ⚠️ NE pokretati translate-subject.js nad ovim predmetom!

const sitHrFinalExamPractice = {
  "name": "Vježba za ispit (sve teme)",
  "icon": "fa-graduation-cap",
  "color": "#f59e0b",
  "flashcards": [
    {
      "question": "Što obuhvaćaju dvije cjeline kolegija koje završni ispit spaja?",
      "answer": "K1 (teorija): pojam i razvoj, vrste i oblici, faktori, funkcije, tržište, destinacija. K2 (specifični oblici): selektivni, zdravstveni, kulturni, sportski, eko, nautički, poslovni.",
      "explanation": "K1 = teorija turizma; K2 = specifični oblici turizma."
    },
    {
      "question": "PONAVLJANJE: koja je razlika između VRSTA i OBLIKA turizma?",
      "answer": "Vrste = statistički kriterij podjele (prostor, trajanje, organizacija). Oblici = dominantni turistički MOTIV (zdravstveni, kulturni, sportski…).",
      "explanation": "Specifični oblici (K2) primjeri su oblika određenih motivom."
    },
    {
      "question": "PONAVLJANJE: poveži oblik turizma s dominantnim MOTIVOM.",
      "answer": "Zdravstveni = zdravlje, kulturni = baština, sportski = sport, eko = priroda, nautički = more/plovila, poslovni = posao.",
      "explanation": "Motiv određuje specifični oblik turizma."
    },
    {
      "question": "PRIPREMA: povežite pojam s autorom/godinom.",
      "answer": "Thomas Cook (1841., moderni turizam), Grand Tour (1547.–1830.), Freyer (4 faze razvoja), Butler (1980., životni ciklus destinacije).",
      "explanation": "Autori i godine česta su ispitna pitanja."
    },
    {
      "question": "PRIPREMA: hrvatske posebnosti iz gradiva?",
      "answer": "3 tipa zdravstvenih destinacija (toplička/primorska/planinska), prvi NP Plitvička jezera i Paklenica (1949.), projekti Turistički i Plavi cvijet (HGK).",
      "explanation": "Primjeri specifični za Hrvatsku."
    }
  ],
  "quiz": [
    {
      "question": "Vrste turizma temelje se na statističkom kriteriju, a oblici na:",
      "options": [
        "Broju noćenja",
        "Dominantnom turističkom motivu",
        "Cijeni",
        "Godišnjem dobu"
      ],
      "correct": 1
    },
    {
      "question": "Model životnog ciklusa destinacije razvio je:",
      "options": [
        "Freyer",
        "Butler",
        "Cicvarić",
        "Cook"
      ],
      "correct": 1
    },
    {
      "question": "Koji NIJE specifični oblik turizma obrađen u 2. kolokviju?",
      "options": [
        "Zdravstveni",
        "Nautički",
        "Industrijski (dark) turizam",
        "Poslovni"
      ],
      "correct": 2
    },
    {
      "question": "Termin „kulturni turizam” pojavljuje se 1969. na kongresu:",
      "options": [
        "UNWTO",
        "ICOMOS",
        "UNESCO",
        "HGK"
      ],
      "correct": 1
    },
    {
      "question": "Najstariji i najjači motiv turističkih kretanja je:",
      "options": [
        "Sport",
        "Posao",
        "Zdravlje",
        "Kultura"
      ],
      "correct": 2
    }
  ],
  "fillBlanks": [
    {
      "sentence": "Oblici turizma temelje se na dominantnom turističkom _______.",
      "answer": "motivu",
      "hint": "Ono što pokreće turista…"
    },
    {
      "sentence": "Model životnog ciklusa destinacije razvio je _______.",
      "answer": "Butler",
      "hint": "1980. godine…"
    },
    {
      "sentence": "Prvi hrvatski nacionalni parkovi (1949.) su Plitvička jezera i _______.",
      "answer": "Paklenica",
      "hint": "Velebitski park…"
    },
    {
      "sentence": "Moderni turizam započinje Thomas _______ 1841. godine.",
      "answer": "Cook",
      "hint": "Prvo masovno putovanje vlakom…"
    }
  ],
  "learn": {
    "title": "Vježba za ispit (sve teme)",
    "content": "\n                <h3>Kolegij na jednoj karti</h3>\n                <p>Završni ispit spaja oba kolokvija (pojednostavljeno). Koristite ovu kategoriju NAKON ponavljanja K1 i K2.</p>\n                <div class=\"formula-box\">\n                    K1 (TEORIJA): pojam i razvoj · vrste i oblici · faktori nastanka · funkcije · tržište · destinacija<br>\n                    K2 (OBLICI): selektivni · zdravstveni · kulturni · sportski · eko · nautički · poslovni\n                </div>\n                <h4>Ključne veze</h4>\n                <div class=\"tip-box\">\n                    <ul>\n                        <li><strong>Vrste vs oblici:</strong> vrste = statistički kriterij (prostor, trajanje, organizacija); oblici = dominantni motiv. Specifični oblici (K2) su primjeri oblika.</li>\n                        <li><strong>Oblik ↔ motiv:</strong> zdravstveni (zdravlje) · kulturni (baština) · sportski (sport) · eko (priroda) · nautički (more) · poslovni (posao).</li>\n                        <li><strong>Autori i godine:</strong> Thomas Cook (1841.) · Grand Tour (1547.–1830.) · Freyer (4 faze) · Butler (1980., životni ciklus) · ICOMOS (1969., „kulturni turizam”) · Yellowstone (1872., prvi NP).</li>\n                        <li><strong>Hrvatske posebnosti:</strong> zdravstvene destinacije (toplička/primorska/planinska) · prvi NP-ovi Plitvička jezera i Paklenica (1949.) · Turistički i Plavi cvijet (HGK).</li>\n                    </ul>\n                </div>\n            "
  }
};

const sitHrFinal = Object.assign(
    {},
    (typeof window !== 'undefined' && window.sitHrM1) ? window.sitHrM1 : {},
    (typeof window !== 'undefined' && window.sitHrM2) ? window.sitHrM2 : {},
    { examPractice: sitHrFinalExamPractice }
  );

if (typeof window !== 'undefined') { window.sitHrFinal = sitHrFinal; }
