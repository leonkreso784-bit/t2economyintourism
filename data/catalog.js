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
      description: 'Pricing, TSA, Expenditure, Environment, Sustainability',
      storageKey: 'te2-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'exam-prep', name: 'Exam Preparation', description: 'Complete study material for the exam' },
        { id: 'final-test-prep', name: 'Final Test Preparation', description: 'Comprehensive review for the final examination' }
      ],
      content: {
        scripts: ['data-te2.js', 'data-te2-final.js'],
        resolve: { '*': 'studyData', 'final-test-prep': 'te2FinalData' }
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
      description: 'Planning, Innovation, Social Entrepreneurship, Tourism, Final Exam Prep',
      storageKey: 'entrepreneurship-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'second-exam-prep', name: 'Second Exam Preparation', description: 'Core concepts: Planning, Failure, Economy, Social Entrepreneurship, Trends' },
        { id: 'final-exam-prep', name: 'Final Exam Preparation', description: 'Complete review: History, Psychology, Innovation, Franchising, Tourism, Value Measurement' }
      ],
      content: {
        scripts: ['data-entrepreneurship.js'],
        resolve: { '*': 'entrepreneurshipData' }
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
      description: 'Cash Control, Budgeting, SEC Reports, Financial Analysis',
      storageKey: 'accounting-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'accounting-fundamentals', name: 'Accounting Fundamentals', description: 'Complete accounting theory for hospitality' }
      ],
      content: {
        // index.js mora biti ZADNJI — kombinira ostale module u accountingData
        scripts: [
          'data/accounting/cash-control.js',
          'data/accounting/budgeting.js',
          'data/accounting/sec-reports.js',
          'data/accounting/accounting-cycle.js',
          'data/accounting/hotel-statements.js',
          'data/accounting/financial-analysis.js',
          'data/accounting/final-practice.js',
          'data/accounting/index.js'
        ],
        resolve: { '*': 'accountingData' }
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
        { id: 'final-exam-prep', name: 'Final Exam Preparation', description: 'Complete E-Business theory covering all 15 units' }
      ],
      content: {
        scripts: ['data-ebusiness.js'],
        resolve: { '*': 'ebusinessData' }
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
