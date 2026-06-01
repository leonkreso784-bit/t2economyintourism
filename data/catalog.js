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
      year: 2, semester: 2,
      name: 'Business Entrepreneurship',
      shortName: 'Entrep',
      icon: 'fa-rocket',
      color: '#8b5cf6',
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
      description: 'Economic analysis of Croatian hospitality industry, seasonality, productivity, and policy responses',
      storageKey: 'econ-hospitality-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Seminar-based preparation: macro importance, seasonality, case studies, competitiveness' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
      ],
      content: {
        scripts: ['data-econ-hospitality.js'],
        resolve: { 'first-midterm': 'economicsHospitalityData' }  // second-midterm = prazno
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
      description: 'Marketing concept, environment, market exchange, segmentation, consumer behaviour, and market research',
      storageKey: 'marketing-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Comprehensive preparation from 6 presentations' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
      ],
      content: {
        scripts: ['data-marketing.js'],
        resolve: { 'first-midterm': 'marketingData' }
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
      description: 'Croatia tourist geography, blind map drills, protected areas, UNESCO and image-based city recognition',
      storageKey: 'geography-progress',
      features: { blindMap: true },               // posebna "Map" sekcija
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: 'Blind map + Croatia geography + image questions from lecture materials' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
      ],
      content: {
        scripts: ['data-geography.js'],
        resolve: { 'first-midterm': 'geographyData' }
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
      description: 'Food quality, nutrients, preservation, cereals, fruits & vegetables, coffee/tea/cocoa, wine, beer',
      storageKey: 'food-nutrition-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'first-midterm', name: 'First Midterm', description: '8 lectures: Food Quality, Components, Preservation, Cereals, Fruits & Veg, Coffee/Tea/Cocoa, Wine, Beer' },
        { id: 'second-midterm', name: 'Second Midterm', description: 'Coming soon' }
      ],
      content: {
        scripts: ['data-food-nutrition.js'],
        resolve: { 'first-midterm': 'foodNutritionData' }
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
