// ===== SOKRAT STUDY — CATALOG (jedinstveni izvor istine za predmete) =====
//
// KORAK 1 (Faza 0, Blok A): ovaj fajl je ZASAD ADDITIVAN.
// Još se nigdje ne koristi — postojeća app logika (js/config.js) radi kao prije.
// U Koraku 2 ćemo js/config.js prepisati da subjectDataMap i getSubjectData()
// izvodi IZ ovog catalog-a, čime nestaju hardkodirani if-lanci.
//
// Hijerarhija (spremna za buduće širenje na cijelo sveučilište):
//   faculties → programs → (year, semester) → subjects → lessons → categories
//
// KONVENCIJA: `year` = studijska godina; `semester` = semestar UNUTAR te godine
// (1 = zimski, 2 = ljetni). Npr. 2. godina, ljetni semestar => year:2, semester:2.

const SOKRAT_CATALOG = {
  // ---- Ustanove / fakulteti / smjerovi -------------------------------------
  faculties: [
    {
      id: 'fmtu',
      name: 'FMTU – Fakultet za menadžment u turizmu i ugostiteljstvu, Opatija',
      programs: [
        { id: 'hospitality-management', name: 'Hospitality Management' }
      ]
    }
  ],

  // ---- Predmeti -------------------------------------------------------------
  // `content` opisuje KAKO se učitava sadržaj (zamjena za getSubjectData()):
  //   scripts[]      — koje data-*.js datoteke treba učitati (redoslijedom)
  //   resolve{}      — lessonId -> ime globalne varijable s podacima
  //                    '*' = default za sve lekcije; ako lekcija nema mapiranje
  //                    i nema '*', sadržaj je prazan (npr. "coming soon").
  subjects: [
    {
      id: 'te2',
      programId: 'hospitality-management',
      year: 2, semester: 1,
      name: 'Tourism Economics',
      shortName: 'TE',
      icon: 'fa-plane',
      color: '#6366f1',
      iconGradient: ['#6366f1', '#818cf8'],
      description: 'Demand, supply & costs, market structure, pricing, expenditure, TSA, environment, sustainability',
      storageKey: 'te2-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Units 1–6: tourism key concepts & market, demand & forecasting, supply & costs, and market structure' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Units 7–12: strategic pricing, economic impacts & expenditure, economic contribution & TSA, environment, and sustainable development' },
        { id: 'final', name: 'Final Exam', description: 'All units 1–12 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/te2/final.js MUST load last (Object.assign of te2M1 + te2M2 window objects + examPractice)
        scripts: ['data/te2/midterm-1.js', 'data/te2/midterm-2.js', 'data/te2/final.js'],
        resolve: { 'first-midterm': 'te2M1', 'second-midterm': 'te2M2', 'final': 'te2Final' }
      }
    },
    {
      id: 'entrepreneurship',
      programId: 'hospitality-management',
      year: 2, semester: 1,
      name: 'Entrepreneurship and Innovation',
      shortName: 'Entrep',
      icon: 'fa-rocket',
      color: '#8b5cf6',
      iconGradient: ['#8b5cf6', '#a78bfa'],
      description: 'Theories, Creativity, Innovation, Financing, Franchising, Planning, Social Entrepreneurship',
      storageKey: 'entrepreneurship-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Weeks 2–7: concepts & theories, the entrepreneur, creativity & business idea, innovation, financing, franchising, planning' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Weeks 9–13: failure & learning, economy, tourism entrepreneurship, social entrepreneurship, measuring value, contemporary issues, developing countries' },
        { id: 'final', name: 'Final Exam', description: 'All weeks 2–13 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/entrepreneurship/final.js MUST load last (Object.assign of entrepreneurshipM1 + entrepreneurshipM2 window objects + examPractice)
        scripts: ['data/entrepreneurship/midterm-1.js', 'data/entrepreneurship/midterm-2.js', 'data/entrepreneurship/final.js'],
        resolve: { 'first-midterm': 'entrepreneurshipM1', 'second-midterm': 'entrepreneurshipM2', 'final': 'entrepreneurshipFinal' }
      }
    },
    {
      id: 'accounting',
      programId: 'hospitality-management',
      year: 2, semester: 1,
      name: 'Accounting Theory',
      shortName: 'Accounting',
      icon: 'fa-coins',
      color: '#059669',
      iconGradient: ['#059669', '#10b981'],
      description: 'Financial statements, bookkeeping, restaurant & hotel accounting, depreciation, analysis',
      storageKey: 'accounting-progress',
      features: { blindMap: false, exercises: true },
      lessons: [
        { id: 'first-midterm', name: 'Midterm 1', description: 'Chapters 1–6: Intro, Business Formation, Financial Statements, Balance Sheet, Income Statement, Bookkeeping' },
        { id: 'second-midterm', name: 'Midterm 2', description: 'Chapters 7–16: Accounting Cycle, Restaurant & Hotel Accounting, Depreciation, Analysis, Annual Reports, Budgeting, Cash Control' },
        { id: 'final', name: 'Final Exam', description: 'Comprehensive review — all chapters 1–16' }
      ],
      content: {
        // Category modules define their *Data globals FIRST; lesson assemblers
        // (midterm-1/2/final) reference those globals, so they load AFTER. final.js loads
        // LAST (it spreads M1+M2). exercises.js is independent (window.accountingExercises).
        scripts: [
          'data/accounting/cash-control.js',
          'data/accounting/budgeting.js',
          'data/accounting/sec-reports.js',
          'data/accounting/accounting-cycle.js',
          'data/accounting/hotel-statements.js',
          'data/accounting/financial-analysis.js',
          'data/accounting/final-practice.js',
          'data/accounting/midterm-1.js',
          'data/accounting/midterm-2.js',
          'data/accounting/final.js',
          'data/accounting/exercises.js'
        ],
        resolve: {
          'first-midterm': 'accountingM1',
          'second-midterm': 'accountingM2',
          'final': 'accountingFinal'
        },
        exercises: 'accountingExercises'   // window var s interaktivnim vježbama (features.exercises)
      }
    },
    {
      id: 'ebusiness',
      programId: 'hospitality-management',
      year: 2, semester: 1,
      name: 'E-Business',
      shortName: 'E-Biz',
      icon: 'fa-globe',
      color: '#f59e0b',
      iconGradient: ['#f59e0b', '#fbbf24'],
      description: 'E-Commerce, Distribution Chain, Digital Marketing, SEO, PMS, Security',
      storageKey: 'ebusiness-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Units 1–7: e-commerce context, distribution chain, internet platform, merchant/agent cash flows, computer graphics, platform economy' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Units 8–15: visual design, digital marketing, social media, Google Analytics, SEO/SEM, hotel PMS, security, challenges & trends' },
        { id: 'final', name: 'Final Exam', description: 'All units 1–15 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/ebusiness/final.js MUST load last (Object.assign of ebusinessM1 + ebusinessM2 window objects + examPractice)
        scripts: ['data/ebusiness/midterm-1.js', 'data/ebusiness/midterm-2.js', 'data/ebusiness/final.js'],
        resolve: { 'first-midterm': 'ebusinessM1', 'second-midterm': 'ebusinessM2', 'final': 'ebusinessFinal' }
      }
    },
    {
      id: 'econ-hospitality',
      programId: 'hospitality-management',
      year: 2, semester: 2,
      name: 'Economics in Hospitality',
      shortName: 'EIH',
      icon: 'fa-hotel',
      color: '#0ea5e9',
      iconGradient: ['#0ea5e9', '#22d3ee'],
      description: 'Economic analysis of Croatian hospitality industry, seasonality, productivity, and policy responses',
      storageKey: 'econ-hospitality-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Units 1-5: hospitality basics, business economics, the hospitality business, assets of reproduction, and cost theory' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Units 6-10: business result, success & economic indicators (KPIs), price policy, sales, and investment profitability' },
        { id: 'final', name: 'Final Exam', description: 'All units 1-10 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data-econ-hospitality-final.js MUST load last (Object.assign of the two midterm window objects)
        scripts: ['data-econ-hospitality.js', 'data-econ-hospitality-m2.js', 'data-econ-hospitality-final.js'],
        resolve: { 'first-midterm': 'economicsHospitalityData', 'second-midterm': 'economicsHospitalityM2Data', 'final': 'economicsHospitalityFinalData' }
      }
    },
    {
      id: 'marketing',
      programId: 'hospitality-management',
      year: 2, semester: 2,
      name: 'Marketing',
      shortName: 'MKT',
      icon: 'fa-bullhorn',
      color: '#ec4899',
      iconGradient: ['#ec4899', '#f472b6'],
      description: 'Marketing concept, environment, market exchange, segmentation, consumer behaviour, market research, product, and price',
      storageKey: 'marketing-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Topics 1-8: concept, environment, market, segmentation, consumer behaviour, product, and price' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Topics 9-13: distribution, promotion, new trends in promotion, planning, organizing & controlling' },
        { id: 'final', name: 'Final Exam', description: 'All topics 1-13 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data-marketing-final.js MUST load last (Object.assign of marketingData + marketingM2Data)
        scripts: ['data-marketing.js', 'data-marketing-m2.js', 'data-marketing-final.js'],
        resolve: { 'first-midterm': 'marketingData', 'second-midterm': 'marketingM2Data', 'final': 'marketingFinalData' }
      }
    },
    {
      id: 'geography',
      programId: 'hospitality-management',
      year: 2, semester: 2,
      name: 'Tourism Geography',
      shortName: 'Geo',
      icon: 'fa-earth-europe',
      color: '#14b8a6',
      iconGradient: ['#14b8a6', '#2dd4bf'],
      description: 'Croatia tourist geography, blind map drills, protected areas, UNESCO and image-based city recognition',
      storageKey: 'geography-progress',
      features: { blindMap: true },               // posebna "Map" sekcija
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Introduction to Geography + Tourism Geography of Croatia (regions, parks, UNESCO) + blind map' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Tourism Geography of the World: Europe, Asia, Africa, Australia & Oceania, and the Americas' },
        { id: 'final', name: 'Final Exam', description: 'All topics — Croatia + the World (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data-geography-final.js MUST load last (Object.assign of the two midterm window objects)
        scripts: ['data-geography.js', 'data-geography-m2.js', 'data-geography-final.js'],
        resolve: { 'first-midterm': 'geographyData', 'second-midterm': 'geographyM2Data', 'final': 'geographyFinalData' }
      }
    },
    {
      id: 'food-nutrition',
      programId: 'hospitality-management',
      year: 2, semester: 2,
      name: 'Food & Nutrition',
      shortName: 'F&N',
      icon: 'fa-utensils',
      color: '#ef4444',
      iconGradient: ['#ef4444', '#f87171'],
      description: 'Food quality, nutrients, preservation, cereals, fruits & vegetables, coffee/tea/cocoa, wine, beer',
      storageKey: 'food-nutrition-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Topics 1–7: Food Quality, Components, Preservation, Cereals, Fruits & Vegetables, Coffee/Tea/Cocoa, and Wine' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Topics 8–14: Beer, Distilled spirits & liqueurs, Meat, Fish, Milk & dairy, Eggs, and Healthy diet' },
        { id: 'final', name: 'Final Exam', description: 'All topics 1–14 (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data-food-nutrition-final.js MUST load last (Object.assign of the two midterm window objects)
        scripts: ['data-food-nutrition.js', 'data-food-nutrition-m2.js', 'data-food-nutrition-final.js'],
        resolve: { 'first-midterm': 'foodNutritionData', 'second-midterm': 'foodNutritionM2Data', 'final': 'foodNutritionFinalData' }
      }
    },
    {
      id: 'business-informatics',
      programId: 'hospitality-management',
      year: 1, semester: 1,
      name: 'Business Informatics',
      shortName: 'BI',
      icon: 'fa-laptop-code',
      color: '#2563eb',
      iconGradient: ['#2563eb', '#60a5fa'],
      description: 'System approach, data & information, hardware, software, networks, WWW, e-business, security',
      storageKey: 'business-informatics-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'midterm-1', name: 'Midterm 1', description: 'Chapters 1–6: system approach, data, hardware, software, networks, WWW' },
        { id: 'midterm-2', name: 'Midterm 2', description: 'Chapters 7–11: e-business, IT trends, management support, expert systems, security' },
        { id: 'final', name: 'Final Exam', description: 'All chapters 1–11 (both midterms combined)' }
      ],
      content: {
        scripts: [
          'data/business-informatics/midterm-1.js',
          'data/business-informatics/midterm-2.js',
          'data/business-informatics/final.js'
        ],
        resolve: {
          'midterm-1': 'businessInformaticsM1',
          'midterm-2': 'businessInformaticsM2',
          'final': 'businessInformaticsFinal'
        }
      }
    },
    {
      id: 'sit',
      programId: 'hospitality-management',
      year: 1, semester: 2,
      name: 'Special Interest Tourism',
      shortName: 'SIT',
      icon: 'fa-compass',
      color: '#14b8a6',
      iconGradient: ['#14b8a6', '#2dd4bf'],
      description: 'Tourism concepts & destination management, mass→SIT, and the special forms: business, cultural, industrial, nautical, sports, luxury, dark, health & film tourism',
      storageKey: 'sit-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Intro to tourism, destination management, mass/over-tourism → SIT, business, cultural & industrial tourism' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'The special forms: nautical, sports, luxury, dark, health & film tourism' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/sit/final.js MUST load last (Object.assign of sitM1 + sitM2 window objects + examPractice)
        scripts: ['data/sit/midterm-1.js', 'data/sit/midterm-2.js', 'data/sit/final.js'],
        resolve: { 'first-midterm': 'sitM1', 'second-midterm': 'sitM2', 'final': 'sitFinal' }
      }
    },
    {
      id: 'management',
      programId: 'hospitality-management',
      year: 1, semester: 2,
      name: 'Management',
      shortName: 'MGMT',
      icon: 'fa-user-tie',
      color: '#6366f1',
      iconGradient: ['#6366f1', '#818cf8'],
      description: 'Management fundamentals (Lussier): the four functions — planning, organizing, leading & controlling — plus decision making, strategy, teamwork, HRM, motivation, leadership & control systems',
      storageKey: 'management-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Management & history, decision making, strategic planning, organizing, teamwork & HRM' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Organizational behavior, motivation, leadership & control systems/finances' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/management/final.js MUST load last (Object.assign of managementM1 + managementM2 window objects + examPractice)
        scripts: ['data/management/midterm-1.js', 'data/management/midterm-2.js', 'data/management/final.js'],
        resolve: { 'first-midterm': 'managementM1', 'second-midterm': 'managementM2', 'final': 'managementFinal' }
      }
    },
    {
      id: 'microeconomics',
      programId: 'hospitality-management',
      year: 1, semester: 1,
      name: 'Microeconomics',
      shortName: 'MICRO',
      icon: 'fa-chart-line',
      color: '#0ea5e9',
      iconGradient: ['#0ea5e9', '#38bdf8'],
      description: 'Microeconomics (Pindyck & Rubinfeld 9e): supply & demand and elasticity, consumer behavior, production & costs, competitive markets, monopoly & oligopoly, game theory, factor markets and externalities — the first quantitative subject (KaTeX formulas & worked problems)',
      storageKey: 'microeconomics-progress',
      features: { blindMap: false },
      // K1 (Ch 1–7) + K2 (Ch 8,9,10,12,13,14,18) + final (hybrid). KaTeX (ADR-009).
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Preliminaries, supply & demand and elasticity, consumer behavior, individual & market demand, uncertainty, production & the cost of production (Ch 1–7)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Profit maximization & competitive supply, competitive markets, monopoly & monopsony, monopolistic competition & oligopoly, game theory, factor inputs, externalities (Ch 8,9,10,12,13,14,18)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // final.js MUST load LAST (Object.assign of microeconomicsM1 + microeconomicsM2 + examPractice).
        scripts: ['data/microeconomics/midterm-1.js', 'data/microeconomics/midterm-2.js', 'data/microeconomics/final.js'],
        resolve: { 'first-midterm': 'microeconomicsM1', 'second-midterm': 'microeconomicsM2', 'final': 'microeconomicsFinal' }
      }
    },
    {
      id: 'statistics',
      programId: 'hospitality-management',
      year: 1, semester: 1,
      name: 'Statistics',
      shortName: 'STAT',
      icon: 'fa-chart-simple',
      color: '#f43f5e',
      iconGradient: ['#f43f5e', '#fb7185'],
      description: 'Statistics for Business & Economics (Newbold): describing data (graphical & numerical), probability, discrete & continuous random variables, sampling distributions, confidence intervals, hypothesis testing and regression — a quantitative subject (KaTeX formulas & worked problems)',
      storageKey: 'statistics-progress',
      features: { blindMap: false, exercises: true },
      // K1 (T1–T6) + K2 (T7–T9) + final (hybrid). KaTeX (ADR-009).
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Describing data (graphical & numerical), probability methods, discrete & continuous random variables, sampling distributions (T1–T6)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Confidence interval estimation, hypothesis testing (single population) and regression analysis (T7–T9)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // final.js MUST load LAST (Object.assign of statisticsM1 + statisticsM2 + examPractice).
        // exercises.js is independent (window.statisticsExercises) — loads after final.js.
        // stat-lib.js (window.StatLib) must load BEFORE exercises.js (its solve() may use it).
        scripts: ['data/statistics/midterm-1.js', 'data/statistics/midterm-2.js', 'data/statistics/final.js', 'data/statistics/stat-lib.js', 'data/statistics/exercises.js'],
        resolve: { 'first-midterm': 'statisticsM1', 'second-midterm': 'statisticsM2', 'final': 'statisticsFinal' },
        exercises: 'statisticsExercises'   // window var s interaktivnim vježbama (features.exercises)
      }
    },
    {
      id: 'macroeconomics',
      programId: 'hospitality-management',
      year: 1, semester: 2,
      name: 'Macroeconomics',
      shortName: 'MACRO',
      icon: 'fa-chart-area',
      color: '#f59e0b',
      iconGradient: ['#f59e0b', '#fbbf24'],
      description: 'Macroeconomics (Blanchard-style): GDP and national accounts, the goods market & multiplier, financial markets, the IS-LM model, the labour market & natural rate, AS-AD, long-run growth, expectations and the open economy — a quantitative subject (KaTeX formulas & worked problems)',
      storageKey: 'macroeconomics-progress',
      features: { blindMap: false, exercises: true },
      // K1 (Intro + L2–L5) + K2 (Ch6 + AS-AD + Long Run + Expectations + Open Economy) + final (hybrid).
      // K1/K2 boundary AUTHORITATIVE from the official Test-1 / Test-2 preparation decks. KaTeX (ADR-009).
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Fundamentals & objectives, unemployment & inflation, GDP (nominal/real/growth), national accounts, the goods market & multiplier, financial markets & money, the IS-LM model (Intro + L2–L5)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'The labour market & natural rate, the medium run (AS-AD), long-run growth, expectations, and the open economy: trade, exchange rates & the balance of payments (Ch6 onward)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // final.js MUST load LAST (Object.assign of macroeconomicsM1 + macroeconomicsM2 + examPractice).
        // exercises.js is independent (window.macroeconomicsExercises) — loads after final.js (features.exercises).
        scripts: ['data/macroeconomics/midterm-1.js', 'data/macroeconomics/midterm-2.js', 'data/macroeconomics/final.js', 'data/macroeconomics/exercises.js'],
        resolve: { 'first-midterm': 'macroeconomicsM1', 'second-midterm': 'macroeconomicsM2', 'final': 'macroeconomicsFinal' },
        exercises: 'macroeconomicsExercises'   // window var s interaktivnim vježbama (features.exercises)
      }
    }
  ]
};

// ---- Mali helperi (koristit će ih Korak 2) ---------------------------------
const SokratCatalog = {
  all() { return SOKRAT_CATALOG.subjects; },
  getSubject(id) { return SOKRAT_CATALOG.subjects.find(s => s.id === id) || null; },
  getProgram(id) {
    for (const f of SOKRAT_CATALOG.faculties) {
      const p = (f.programs || []).find(p => p.id === id);
      if (p) return { ...p, facultyId: f.id, facultyName: f.name };
    }
    return null;
  },
  // Vrati ime globalne varijable koja drži podatke za (subject, lesson)
  resolveDataVar(subjectId, lessonId) {
    const s = this.getSubject(subjectId);
    if (!s || !s.content) return null;
    const r = s.content.resolve || {};
    return r[lessonId] || r['*'] || null;
  },

  // ---- Drill-down hijerarhija (sve izvedeno iz catalog-a) -------------------
  // Fakulteti → Smjerovi → Godine → Predmeti. Dodavanjem novog fakulteta/smjera/
  // godine/predmeta u SOKRAT_CATALOG, navigacija ih AUTOMATSKI prikaže (bez UI izmjena).

  // Svi fakulteti.
  faculties() { return SOKRAT_CATALOG.faculties || []; },

  // Smjerovi (programs) jednog fakulteta.
  programsOf(facultyId) {
    const f = (SOKRAT_CATALOG.faculties || []).find(x => x.id === facultyId);
    return f ? (f.programs || []) : [];
  },

  // Distinct studijske godine za zadani smjer (sortirano uzlazno).
  yearsOf(programId) {
    const ys = new Set();
    for (const s of SOKRAT_CATALOG.subjects) {
      if (s.programId === programId && s.year != null) ys.add(s.year);
    }
    return [...ys].sort((a, b) => a - b);
  },

  // Predmeti za (smjer[, godina]). Ako je `year` izostavljen, vraća sve predmete smjera.
  subjectsOf(programId, year) {
    return SOKRAT_CATALOG.subjects.filter(s =>
      s.programId === programId && (year == null || s.year === year));
  },

  // Distinct semestri za (smjer, godina), sortirano.
  semestersOf(programId, year) {
    const set = new Set();
    for (const s of this.subjectsOf(programId, year)) {
      if (s.semester != null) set.add(s.semester);
    }
    return [...set].sort((a, b) => a - b);
  },

  // Je li lekcija "coming soon"? Data-driven: nema mapiranja u content.resolve
  // (ni eksplicitnog ni '*') ⇒ nema sadržaja ⇒ coming soon.
  isLessonComingSoon(subjectId, lessonId) {
    return this.resolveDataVar(subjectId, lessonId) == null;
  }
};

// Globalno dostupno (konzistentno s ostalim data-*.js datotekama)
if (typeof window !== 'undefined') {
  window.SOKRAT_CATALOG = SOKRAT_CATALOG;
  window.SokratCatalog = SokratCatalog;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOKRAT_CATALOG, SokratCatalog };
}
