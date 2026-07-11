// Fixture (U2.5): VALJAN katalog s placement dual-modeom — verify-catalog gate mora dati exit 0.
// Koristi se kroz `CATALOG_PATH=tests/fixtures/catalog-placement-valid.js node scripts/verify-catalog.js`
// (vidi tests/unit/catalog-placement.test.js). content pokazuje na PRAVU te2 datoteku da
// prođu provjere postojanja skripti i deklariranih window-varijabli.

const CONTENT = { scripts: ['data/te2/midterm-1.js'], resolve: { 'first-midterm': 'te2M1' } };
const LESSONS = [{ id: 'first-midterm', name: 'K1', description: 'test' }];
const BASE = { shortName: 'T', icon: 'fa-flask', color: '#000', description: 'fixture', lessons: LESSONS, content: CONTENT };

const SOKRAT_CATALOG = {
  faculties: [
    {
      id: 'fmtu',
      name: 'FMTU (fixture)',
      programs: [
        { id: 'muh', name: 'MUH' },
        { id: 'mut', name: 'MUT' },
        { id: 'mor', name: 'MOR' }
      ]
    }
  ],
  subjects: [
    // dijeljeni "vezni" predmet: JEDAN sadržaj, 3 placement-koordinate, prefiks fakulteta u id-u
    {
      ...BASE,
      id: 'fmtu-matematika-hr',
      name: 'Matematika (dijeljena)',
      storageKey: 'fmtu-matematika-hr-progress',
      placement: [
        { faculty: 'fmtu', program: 'muh', year: 1, semester: 1 },
        { faculty: 'fmtu', program: 'mut', year: 1, semester: 1 },
        { faculty: 'fmtu', program: 'mor', year: 1, semester: 1 }
      ]
    },
    // legacy predmet u ISTOM katalogu (dual-mode: oba načina koegzistiraju)
    {
      ...BASE,
      id: 'legacy-predmet',
      name: 'Legacy predmet',
      storageKey: 'legacy-predmet-progress',
      programId: 'muh', year: 1, semester: 2
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOKRAT_CATALOG };
}
