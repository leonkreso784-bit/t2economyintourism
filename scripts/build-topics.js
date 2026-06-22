/* eslint-disable no-console */
// ===== Build topics — korak 2 generatora predmeta =====
// Usage: node scripts/build-topics.js <subjectId> <materialsDir>
//
// Skenira mapu materijala (PDF/TXT), jedan fajl = jedna tema (ustaljena konvencija:
// "jedna prezentacija = jedan fajl"), ekstrahira tekst i složi tmp/<subjectId>/topics.json
// koji korak 3 (generate-subject.js) šalje modelu po temi.
//
// Mapa kolokvija iz IMENA PODMAPE (samo TI znaš podjelu iz silabusa):
//   midterm-1 | k1 | kolokvij-1   → lesson "first-midterm"
//   midterm-2 | k2 | kolokvij-2   → lesson "second-midterm"
//   (mapa "final" se PRESKAČE — finalni je hibrid koji slaže assemble-subject.js)
// Ako nema podmapa, svi fajlovi idu u "first-midterm" (uz upozorenje).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function lessonFromDir(name) {
  const n = name.toLowerCase();
  if (/(^|[^0-9])(midterm-?1|k1|kolokvij-?1|prvi)([^0-9]|$)/.test(n)) return 'first-midterm';
  if (/(^|[^0-9])(midterm-?2|k2|kolokvij-?2|drugi)([^0-9]|$)/.test(n)) return 'second-midterm';
  if (/final|zavr/.test(n)) return 'final';
  return null;
}

// "02_demand-and_supply.pdf" → { key:"demandAndSupply", title:"Demand And Supply" }
function deriveNames(filename) {
  const base = filename.replace(/\.[^.]+$/, '');           // makni ekstenziju
  const noPrefix = base.replace(/^[\s_\-0-9.]+/, '');       // makni vodeći "NN_" / brojeve
  const words = noPrefix.split(/[\s_\-.]+/).filter(Boolean);
  if (!words.length) words.push('topic');
  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const key = words.map((w, i) => {
    const lw = w.toLowerCase();
    return i === 0 ? lw : lw.charAt(0).toUpperCase() + lw.slice(1);
  }).join('').replace(/[^a-zA-Z0-9]/g, '');
  return { key, title };
}

async function extractText(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.txt' || ext === '.md') return fs.readFileSync(file, 'utf8').trim();
  if (ext === '.pdf') {
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(file)) });
    const res = await parser.getText();
    let text = res && res.text ? res.text : '';
    if (!text && res && Array.isArray(res.pages)) text = res.pages.map((p) => p.text || '').join('\n\n');
    if (parser.destroy) await parser.destroy();
    return String(text).trim();
  }
  return null; // nepoznata ekstenzija → preskoči
}

// Vrati [{file, lesson}] rekurzivno (do 2 razine: korijen i podmape kolokvija)
function collectFiles(dir) {
  const out = [];
  const rootLesson = lessonFromDir(path.basename(dir)); // ako je sama mapa npr. "k1"
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const lesson = lessonFromDir(entry.name);
      for (const e2 of fs.readdirSync(full, { withFileTypes: true })) {
        if (e2.isFile()) out.push({ file: path.join(full, e2.name), lesson: lesson || rootLesson });
      }
    } else if (entry.isFile()) {
      out.push({ file: full, lesson: rootLesson });
    }
  }
  return out;
}

async function main() {
  const subjectId = process.argv[2];
  const materialsDir = process.argv[3];
  if (!subjectId || !materialsDir) {
    console.error('Usage: node scripts/build-topics.js <subjectId> <materialsDir>');
    process.exit(1);
  }
  if (!fs.existsSync(materialsDir)) { console.error('Mapa ne postoji: ' + materialsDir); process.exit(1); }

  const files = collectFiles(materialsDir)
    .filter((f) => /\.(pdf|txt|md)$/i.test(f.file))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

  if (!files.length) { console.error('Nema PDF/TXT fajlova u ' + materialsDir); process.exit(1); }

  const topics = [];
  const seenKeys = new Set();
  let noLesson = 0;
  for (const { file, lesson } of files) {
    const text = await extractText(file);
    if (text == null) { console.warn('  ! preskačem (nepoznat tip): ' + file); continue; }
    if (!text) { console.warn('  ! prazan tekst: ' + file); }
    let { key, title } = deriveNames(path.basename(file));
    let uniq = key, n = 2;
    while (seenKeys.has(uniq)) uniq = key + n++;
    seenKeys.add(uniq);
    const lessonFinal = lesson || 'first-midterm';
    if (!lesson) noLesson++;
    if (lesson === 'final') { console.log('  · preskačem final-mapu (hibrid): ' + path.basename(file)); continue; }
    topics.push({ id: uniq, title, lesson: lessonFinal, source: path.relative(ROOT, file), chars: text.length, text });
  }

  const outDir = path.join(ROOT, 'tmp', subjectId);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'topics.json');
  fs.writeFileSync(outFile, JSON.stringify({ subjectId, builtAt: new Date().toISOString(), topics }, null, 2));

  console.log('\nTeme (' + topics.length + '):');
  for (const t of topics) console.log('  [' + t.lesson + '] ' + t.id + ' — "' + t.title + '" (' + t.chars + ' znakova)');
  if (noLesson) console.log('\n⚠ ' + noLesson + ' fajl(ova) bez podmape kolokvija → stavljeno u "first-midterm". Preporuka: posloži u midterm-1/ i midterm-2/.');
  console.log('\n✅ Zapisano: ' + path.relative(ROOT, outFile));
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
