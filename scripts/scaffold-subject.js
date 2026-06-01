/* eslint-disable no-console */
// ===== Scaffold za novi predmet =====
// Usage:
//   node scripts/scaffold-subject.js <subject-id> "<Naziv>" [godina] [semestar]
// Primjer:
//   node scripts/scaffold-subject.js micro-economics "Microeconomics" 1 1
//
// Napravi data/<subject-id>/{midterm-1,midterm-2,final}.js iz templatea i ispiše
// gotov unos za data/catalog.js + (privremeno) <script> linije za index.html.
// NE dira catalog/index.html automatski — copy/paste je svjestan korak.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const [, , id, nameArg, yearArg, semArg] = process.argv;

if (!id || !nameArg) {
  console.error('Usage: node scripts/scaffold-subject.js <subject-id> "<Naziv>" [godina] [semestar]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(id)) {
  console.error('subject-id mora biti kebab-case (a-z, 0-9, -). Npr. micro-economics');
  process.exit(1);
}

const name = nameArg;
const year = Number(yearArg) || 1;
const semester = Number(semArg) || 1;
const color = '#6366f1';
const gradient = ['#6366f1', '#818cf8'];

// kebab -> camelCase varijabla
const camel = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const shortName = name.length > 10 ? name.slice(0, 10) : name;

const LESSONS = [
  { lid: 'midterm-1', title: 'Midterm 1', varName: camel + 'M1', file: 'midterm-1.js' },
  { lid: 'midterm-2', title: 'Midterm 2', varName: camel + 'M2', file: 'midterm-2.js' },
  { lid: 'final', title: 'Final Exam', varName: camel + 'Final', file: 'final.js' },
];

const dir = path.join(ROOT, 'data', id);
if (fs.existsSync(dir)) {
  console.error(`Mapa data/${id} već postoji — prekidam da ne pregazim sadržaj.`);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });

const fileBody = (title, varName) => `// ===== ${name} — ${title} =====
// Popuni po docs/CONTENT_SCHEMA.md. Pokreni \`npm run verify\` nakon izmjena.

const ${varName} = {
  intro: {
    name: '${title} — Topic 1',
    icon: 'fa-book',
    color: '${color}',
    flashcards: [],
    quiz: [],
    fillBlanks: [],
    learn: { content: '<p>TODO</p>', image: null }
  }
};

if (typeof window !== 'undefined') window.${varName} = ${varName};
if (typeof module !== 'undefined' && module.exports) module.exports = ${varName};
`;

LESSONS.forEach((l) => fs.writeFileSync(path.join(dir, l.file), fileBody(l.title, l.varName)));

const scripts = LESSONS.map((l) => `'data/${id}/${l.file}'`).join(', ');
const resolve = LESSONS.map((l) => `'${l.lid}': '${l.varName}'`).join(', ');

const catalogEntry = `    {
      id: '${id}',
      programId: 'hospitality-management',
      year: ${year}, semester: ${semester},
      name: '${name}',
      shortName: '${shortName}',
      icon: 'fa-book',
      color: '${color}',
      iconGradient: ['${gradient[0]}', '${gradient[1]}'],
      description: 'TODO',
      storageKey: '${id}-progress',
      features: { blindMap: false },
      lessons: [
        { id: 'midterm-1', name: 'Midterm 1', description: 'TODO' },
        { id: 'midterm-2', name: 'Midterm 2', description: 'TODO', status: 'coming-soon' },
        { id: 'final', name: 'Final Exam', description: 'TODO', status: 'coming-soon' }
      ],
      content: {
        scripts: [${scripts}],
        resolve: { ${resolve} }
      }
    },`;

console.log(`\n✅ Kreirano: data/${id}/ (${LESSONS.map((l) => l.file).join(', ')})\n`);
console.log('1) Zalijepi u data/catalog.js -> SOKRAT_CATALOG.subjects:\n');
console.log(catalogEntry);
console.log('\n2) (Do lazy-load seama) dodaj u index.html prije js/config.js, s ?v= tokenom:\n');
LESSONS.forEach((l) => console.log(`    <script src="data/${id}/${l.file}?v=YYYYMMDD"></script>`));
console.log('\n3) Popuni sadržaj, pa: npm run verify  (catalog + sadržaj) i npm run test:responsive\n');
