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
        { id: 'hospitality-management', name: 'Hospitality Management' },
        // HRVATSKI paralelni program (klon, Opcija A — vidi docs/HRV_PLAN.md). Isti predmeti,
        // hrvatski sadržaj (data/<subj>-hr/*.js), vlastiti storageKey. Dostupan kroz Browse.
        { id: 'hospitality-management-hr', name: 'Menadžment u Hotelijerstvu' }
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
        resolve: { 'first-midterm': 'te2M1', 'second-midterm': 'te2M2', 'final': 'te2Final' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/te2/*.json)
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
        resolve: { 'first-midterm': 'entrepreneurshipM1', 'second-midterm': 'entrepreneurshipM2', 'final': 'entrepreneurshipFinal' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/entrepreneurship/*.json)
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
        dataFormat: 'json', // F2 2A.4 (dovršetak → 18/18): study iz data/json/accounting/*.json (dual-read); vježbe UVIJEK iz .js (codeScripts, BUG-012)
        codeScripts: ['data/accounting/exercises.js'], // CODE (generate() funkcije) → uvijek iz datoteke, nikad iz baze (BUG-012)
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
        resolve: { 'first-midterm': 'ebusinessM1', 'second-midterm': 'ebusinessM2', 'final': 'ebusinessFinal' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/ebusiness/*.json)
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
        resolve: { 'first-midterm': 'economicsHospitalityData', 'second-midterm': 'economicsHospitalityM2Data', 'final': 'economicsHospitalityFinalData' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/econ-hospitality/*.json)
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
        resolve: { 'first-midterm': 'marketingData', 'second-midterm': 'marketingM2Data', 'final': 'marketingFinalData' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/marketing/*.json)
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
        resolve: { 'first-midterm': 'geographyData', 'second-midterm': 'geographyM2Data', 'final': 'geographyFinalData' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/geography/*.json)
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
        resolve: { 'first-midterm': 'foodNutritionData', 'second-midterm': 'foodNutritionM2Data', 'final': 'foodNutritionFinalData' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/food-nutrition/*.json)
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
        },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/business-informatics/*.json)
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
        resolve: { 'first-midterm': 'sitM1', 'second-midterm': 'sitM2', 'final': 'sitFinal' },
        // F2 2A.3: prvi migrirani predmet — study se čita iz data/json/sit/*.json (dual-read),
        // s fallbackom na gornje `scripts` ako JSON padne. `scripts` OSTAJU izvor istine + mreža.
        dataFormat: 'json'
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
        resolve: { 'first-midterm': 'managementM1', 'second-midterm': 'managementM2', 'final': 'managementFinal' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/management/*.json)
      }
    },
    {
      id: 'traffic',
      programId: 'hospitality-management',
      year: 1, semester: 2,
      name: 'Traffic in Tourism',
      shortName: 'TRAFFIC',
      icon: 'fa-route',
      color: '#f59e0b',
      iconGradient: ['#f59e0b', '#fbbf24'],
      description: 'Transport in tourism (Mrnjavac; Prof. Kovačić): the theoretical basis of traffic & its interdependence with tourism, mobility & travel patterns, and every transport mode both as a connector and as a tourism product — road, rail (+ funicular/cable car), air and water — plus the value & quality of services, safety, ecological aspects and the future of transport (EU Sustainable & Smart Mobility Strategy).',
      storageKey: 'traffic-progress',
      features: { blindMap: false },
      // K1 (weeks 1–6) + K2 (weeks 7–15, 1st mid-term in week 7) + final (hybrid). Boundary AUTHORITATIVE from the syllabus (DINP).
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Theoretical basis of traffic, interdependence of traffic & tourism, mobility & travel patterns, road transport (connector + tourism product) and rail transport as a connector (weeks 1–6)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Rail as a tourism product (+ funicular/cable car), air & water transport, the value & quality of services, safety, ecological aspects and the future of transport (weeks 7–15)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // data/traffic/final.js MUST load last (Object.assign of trafficM1 + trafficM2 window objects + examPractice)
        scripts: ['data/traffic/midterm-1.js', 'data/traffic/midterm-2.js', 'data/traffic/final.js'],
        resolve: { 'first-midterm': 'trafficM1', 'second-midterm': 'trafficM2', 'final': 'trafficFinal' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/traffic/*.json)
      }
    },
    {
      id: 'math',
      programId: 'hospitality-management',
      year: 1, semester: 1,
      name: 'Mathematics',
      shortName: 'MATH',
      icon: 'fa-square-root-variable',
      color: '#8b5cf6',
      iconGradient: ['#8b5cf6', '#a78bfa'],
      description: 'Mathematics for economists (Mihalinčić & Mrša Haber): the field of real numbers, equations on ℝ, functions (incl. exponential, logarithmic & trigonometric), differentiation and the analysis of increase/decrease & extrema — with worked economic applications (cost, revenue, profit, marginal & average cost). A quantitative subject (KaTeX formulas + interactive exercises).',
      storageKey: 'math-progress',
      features: { blindMap: false, exercises: true },
      // K1 = topics 1–5 (real numbers → extrema), K2 = topics 6–11. Boundary AUTHORITATIVE from the syllabus.
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Field of real numbers, basic equations on ℝ, functions, differentiation, and increase/decrease & extrema (topics 1–5)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'The indefinite integral & elasticity of demand, financial mathematics (rents & loans) and the Gauss-Jordan method (topics 6–11)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms) plus a cross-topic exam practice set' }
      ],
      content: {
        // final.js MUST load LAST (Object.assign of mathM1 + mathM2 window objects + examPractice).
        // math-lib.js (window.MathLib) must load BEFORE exercises.js (its generate() uses it).
        scripts: ['data/math/midterm-1.js', 'data/math/midterm-2.js', 'data/math/final.js', 'data/math/math-lib.js', 'data/math/exercises.js'],
        resolve: { 'first-midterm': 'mathM1', 'second-midterm': 'mathM2', 'final': 'mathFinal' },
        dataFormat: 'json', // F2 2A.4: study iz data/json/math/*.json (dual-read); vježbe UVIJEK iz .js (codeScripts)
        codeScripts: ['data/math/math-lib.js', 'data/math/exercises.js'], // CODE (generate() funkcije + lib) → uvijek iz datoteke, nikad iz baze (BUG-012)
        exercises: 'mathExercises'   // window var with interactive exercises (features.exercises)
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
        resolve: { 'first-midterm': 'microeconomicsM1', 'second-midterm': 'microeconomicsM2', 'final': 'microeconomicsFinal' },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/microeconomics/*.json)
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
        dataFormat: 'json', // F2 2A.4: study iz data/json/statistics/*.json (dual-read); vježbe UVIJEK iz .js (codeScripts)
        codeScripts: ['data/statistics/stat-lib.js', 'data/statistics/exercises.js'], // CODE (generate() funkcije + lib) → uvijek iz datoteke, nikad iz baze (BUG-012)
        exercises: 'statisticsExercises'   // window var s interaktivnim vježbama (features.exercises)
      }
    },
    {
      id: 'academic-writing',
      programId: 'hospitality-management',
      year: 1, semester: 1,
      name: 'Academic Writing',
      shortName: 'AW',
      icon: 'fa-pen-nib',
      color: '#a855f7',
      iconGradient: ['#a855f7', '#c084fc'],
      description: 'The Essentials of Academic Writing (Bogdan): acquiring knowledge & scientific method, the literature review, means & methods of scientific research, thesis structure, bibliographic databases & search, types of publications, research ethics — and the Chicago Manual of Style for citing books, journals and other sources.',
      storageKey: 'academic-writing-progress',
      features: { blindMap: false, exercises: true },
      // K1 (weeks 1–6) + K2 (weeks 8–14, exam at week 7) + final (hybrid). First subject built via the content generator pipeline.
      // Interactive exercises (citation-focused) on the reusable engine — window.academicWritingExercises.
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Fundamentals of research, the literature review, methods of scientific research, thesis structure, bibliographic databases & search (weeks 1–6)' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Types of publications, Chicago Manual of Style (books, journals & other sources), research characteristics & qualities, ethics & Latin abbreviations (weeks 8–14)' },
        { id: 'final', name: 'Final Exam', description: 'All topics (both midterms)' }
      ],
      content: {
        // final.js MUST load LAST (Object.assign of academicWritingM1 + academicWritingM2).
        // exercises.js is independent (window.academicWritingExercises) — loads after final.js.
        scripts: ['data/academic-writing/midterm-1.js', 'data/academic-writing/midterm-2.js', 'data/academic-writing/final.js', 'data/academic-writing/exercises.js'],
        resolve: { 'first-midterm': 'academicWritingM1', 'second-midterm': 'academicWritingM2', 'final': 'academicWritingFinal' },
        dataFormat: 'json', // F2 2A.4b (dual-read; study iz data/json/academic-writing/*.json; vježbe uvijek iz .js)
        codeScripts: ['data/academic-writing/exercises.js'], // CODE-paket vježbi → uvijek iz datoteke, nikad iz baze (BUG-012; ovdje 0 randomiziranih, ali pravilo je jedinstveno)
        exercises: 'academicWritingExercises'   // window var s interaktivnim vježbama (features.exercises)
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
        dataFormat: 'json', // F2 2A.4: study iz data/json/macroeconomics/*.json (dual-read); vježbe UVIJEK iz .js (codeScripts)
        codeScripts: ['data/macroeconomics/exercises.js'], // CODE (generate() funkcije) → uvijek iz datoteke, nikad iz baze (BUG-012)
        exercises: 'macroeconomicsExercises'   // window var s interaktivnim vježbama (features.exercises)
      }
    },

    // ===== HRVATSKI program „Menadžment u Hotelijerstvu" (prijevodi; docs/HRV_PLAN.md) =====
    // Klon EN predmeta: isti icon/color/year/semester, hrvatski sadržaj + vlastiti storageKey.
    // Window varovi = <camelId>Hr{M1,M2,Final}; data u data/<id>-hr/. PILOT: Business Informatics.
    {
      id: 'business-informatics-hr',
      programId: 'hospitality-management-hr',
      year: 1, semester: 1,
      name: 'Poslovna informatika',
      shortName: 'PI',
      icon: 'fa-laptop-code',
      color: '#2563eb',
      iconGradient: ['#2563eb', '#60a5fa'],
      description: 'Sustavski pristup, podaci i informacije, hardver, softver, mreže, WWW, e-poslovanje, sigurnost',
      storageKey: 'business-informatics-hr-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'midterm-1', name: '1. kolokvij', description: 'Poglavlja 1–6: sustavski pristup, podaci, hardver, softver, mreže, WWW' },
        { id: 'midterm-2', name: '2. kolokvij', description: 'Poglavlja 7–11: e-poslovanje, IT trendovi, podrška menadžmentu, ekspertni sustavi, sigurnost' },
        { id: 'final', name: 'Završni ispit', description: 'Sva poglavlja 1–11 (oba kolokvija zajedno)' }
      ],
      content: {
        scripts: [
          'data/business-informatics-hr/midterm-1.js',
          'data/business-informatics-hr/midterm-2.js',
          'data/business-informatics-hr/final.js'
        ],
        resolve: {
          'midterm-1': 'businessInformaticsHrM1',
          'midterm-2': 'businessInformaticsHrM2',
          'final': 'businessInformaticsHrFinal'
        },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/business-informatics-hr/*.json)
      }
    },
    {
      id: 'management-hr',
      programId: 'hospitality-management-hr',
      year: 1, semester: 2,
      name: 'Menadžment',
      shortName: 'MEN',
      icon: 'fa-user-tie',
      color: '#6366f1',
      iconGradient: ['#6366f1', '#818cf8'],
      description: 'Osnove menadžmenta (Lussier): četiri funkcije — planiranje, organiziranje, vođenje i kontroliranje — te odlučivanje, strategija, timski rad, upravljanje ljudskim resursima, motivacija, vođenje i sustavi kontrole',
      storageKey: 'management-hr-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: '1. kolokvij', description: 'Menadžment i povijest, odlučivanje, strateško planiranje, organiziranje, timski rad i upravljanje ljudskim resursima' },
        { id: 'second-midterm', name: '2. kolokvij', description: 'Organizacijsko ponašanje, motivacija, vođenje te sustavi kontrole i financije' },
        { id: 'final', name: 'Završni ispit', description: 'Sve teme (oba kolokvija) plus ispitna pitanja kroz sve teme' }
      ],
      content: {
        scripts: [
          'data/management-hr/midterm-1.js',
          'data/management-hr/midterm-2.js',
          'data/management-hr/final.js'
        ],
        resolve: {
          'first-midterm': 'managementHrM1',
          'second-midterm': 'managementHrM2',
          'final': 'managementHrFinal'
        },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/management-hr/*.json)
      }
    },
    {
      id: 'sit-hr',
      programId: 'hospitality-management-hr',
      year: 1, semester: 2,
      name: 'Specifični oblici turizma',
      shortName: 'SOT',
      icon: 'fa-compass',
      color: '#14b8a6',
      iconGradient: ['#14b8a6', '#2dd4bf'],
      description: 'Pojam i razvoj turizma, vrste i oblici, faktori i funkcije, turističko tržište i destinacija (Butler); specifični oblici: zdravstveni, kulturni, sportski, ekoturizam, nautički i poslovni (MICE)',
      storageKey: 'sit-hr-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: '1. kolokvij', description: 'Pojam i razvoj turizma, vrste i oblici, faktori nastanka, funkcije, turističko tržište i turistička destinacija' },
        { id: 'second-midterm', name: '2. kolokvij', description: 'Specifični (selektivni) oblici: zdravstveni, kulturni, sportski, ekoturizam, nautički i poslovni turizam' },
        { id: 'final', name: 'Završni ispit', description: 'Sve teme (oba kolokvija) plus ponavljanje kroz sve teme' }
      ],
      content: {
        scripts: [
          'data/sit-hr/midterm-1.js',
          'data/sit-hr/midterm-2.js',
          'data/sit-hr/final.js'
        ],
        resolve: {
          'first-midterm': 'sitHrM1',
          'second-midterm': 'sitHrM2',
          'final': 'sitHrFinal'
        },
        dataFormat: 'json' // F2 2A.4b (dual-read; study iz data/json/sit-hr/*.json)
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

  // ---- Placement dual-mode (U2.5, ADR-022 / docs/CATALOG_ARCHITECTURE.md) ----
  // Predmet smjesta se u hijerarhiju na JEDAN od dva načina:
  //   legacy:    programId + year + semester (svi postojeći predmeti — netaknuti)
  //   placement: placement: [{ faculty, program, year, semester }, ...] — dijeljeni
  //              "vezni" predmet prikazan na više koordinata, sadržaj postoji JEDNOM.
  // Placement-predmeti MORAJU nositi prefiks fakulteta u id-u (gate u verify-catalog.js).

  // Normalizirane placement-koordinate predmeta (za legacy se deriviraju iz polja).
  placementsOf(s) {
    if (!s) return [];
    if (Array.isArray(s.placement) && s.placement.length) return s.placement;
    if (s.programId == null) return [];
    const p = this.getProgram(s.programId);
    return [{ faculty: p ? p.facultyId : null, program: s.programId, year: s.year, semester: s.semester }];
  },

  // Je li predmet postavljen u zadani smjer (bilo kojom koordinatom)?
  isInProgram(s, programId) {
    return this.placementsOf(s).some(pl => pl.program === programId);
  },

  // Distinct studijske godine za zadani smjer (sortirano uzlazno).
  yearsOf(programId) {
    const ys = new Set();
    for (const s of SOKRAT_CATALOG.subjects) {
      for (const pl of this.placementsOf(s)) {
        if (pl.program === programId && pl.year != null) ys.add(pl.year);
      }
    }
    return [...ys].sort((a, b) => a - b);
  },

  // Predmeti za (smjer[, godina]). Ako je `year` izostavljen, vraća sve predmete smjera.
  // Legacy predmet se vraća KAKAV JEST (isto ponašanje kao prije U2.5); placement-predmet
  // se vraća kao plitka kopija dekorirana koordinatama pogođenog placementa (year/semester
  // za prikaz kartica) — content/storageKey/lessons ostaju reference na original.
  subjectsOf(programId, year) {
    const out = [];
    for (const s of SOKRAT_CATALOG.subjects) {
      const pl = this.placementsOf(s).find(pl =>
        pl.program === programId && (year == null || pl.year === year));
      if (!pl) continue;
      out.push(Array.isArray(s.placement)
        ? { ...s, programId: pl.program, year: pl.year, semester: pl.semester }
        : s);
    }
    return out;
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
