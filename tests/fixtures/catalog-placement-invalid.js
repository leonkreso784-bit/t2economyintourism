// Fixture (U2.5): katalog s NAMJERNIM prekršajima ADR-022 invarijanti — verify-catalog
// gate mora dati exit 1 i prijaviti SVAKI prekršaj (vidi tests/unit/catalog-placement.test.js):
//   1. legacy + placement istovremeno       → "dozvoljen je točno jedan način"
//   2. placement-id bez prefiksa fakulteta  → "prefiks fakulteta"
//   3. duplicirana placement koordinata     → "duplicirana placement koordinata"
//   4. program ne postoji u fakultetu       → "ne postoji u fakultetu"
//   5. dva unosa dijele storageKey          → "storageKey"

const CONTENT = { scripts: ['data/te2/midterm-1.js'], resolve: { 'first-midterm': 'te2M1' } };
const LESSONS = [{ id: 'first-midterm', name: 'K1', description: 'test' }];
const BASE = { shortName: 'T', icon: 'fa-flask', color: '#000', description: 'fixture', lessons: LESSONS, content: CONTENT };

const SOKRAT_CATALOG = {
  faculties: [
    { id: 'fmtu', name: 'FMTU (fixture)', programs: [{ id: 'muh', name: 'MUH' }] }
  ],
  subjects: [
    // prekršaj 1: I legacy I placement
    {
      ...BASE,
      id: 'fmtu-mixed-hr', name: 'Miješani smještaj', storageKey: 'mixed-progress',
      programId: 'muh', year: 1, semester: 1,
      placement: [{ faculty: 'fmtu', program: 'muh', year: 1, semester: 1 }]
    },
    // prekršaji 2+3+4: bez prefiksa fakulteta + dup koordinata + nepostojeći program
    {
      ...BASE,
      id: 'bezprefiksa-hr', name: 'Bez prefiksa', storageKey: 'bezprefiksa-progress',
      placement: [
        { faculty: 'fmtu', program: 'muh', year: 1, semester: 1 },
        { faculty: 'fmtu', program: 'muh', year: 1, semester: 1 },
        { faculty: 'fmtu', program: 'ghost', year: 1, semester: 1 }
      ]
    },
    // prekršaj 5: "lažno dijeljenje" — dva unosa s istim storageKey
    { ...BASE, id: 'dup-a', name: 'Dup A', storageKey: 'dup-progress', programId: 'muh', year: 1, semester: 1 },
    { ...BASE, id: 'dup-b', name: 'Dup B', storageKey: 'dup-progress', programId: 'muh', year: 1, semester: 2 }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOKRAT_CATALOG };
}
