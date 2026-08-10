/* eslint-disable no-console */
// ===== Diff: BAZA vs datoteke (READ-ONLY) =====
// Usage: node scripts/diff-db-vs-files.js [subjectId]      (npm run diff:db [id])
//
// ZAŠTO POSTOJI: `migrate-content.js` radi **upsert** — piše preko postojećeg reda. Datoteke jesu
// izvor istine (do F4.6 flipa), ali admin kroz Studio smije uređivati ŽIVI sadržaj i to se povremeno
// događa (v. back-port `entrepreneurship` edita, CHANGELOG 2026-07-14). Re-sync bez prethodne
// usporedbe zato može tiho pojesti tuđu izmjenu — a `content_versions` je append-only audit, ne undo.
//
// Ovaj skript NE PIŠE ništa: dohvati red iz baze (ANON — sadržaj je javno čitljiv, najmanja prava),
// izgradi isti payload iz datoteka i ispiše SVAKU razliku s putanjom do polja.
// Prazan izlaz = re-sync je siguran. Izlazni kod: 0 = nema razlika, 1 = ima (ili greška).
//
// Ne-ASCII znakovi se ispisuju s KODNOM TOČKOM: ćirilično veliko ES (U+0421) i latinično C (U+0043)
// izgledaju identično, pa se razlika inače ne vidi golim okom (povod: nalaz od 2026-08-09).
// (Sam znak se ovdje NE piše doslovno — `check:docs` s pravom odbija ćirilicu u kodu.)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadEnv() {
  const p = path.join(ROOT, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

const { SOKRAT_CATALOG, SokratCatalog } = require(path.join(ROOT, 'data', 'catalog.js'));

/** Anon ključ iz `js/auth.js` — javan po dizajnu; čitanje ide s najmanjim mogućim pravima. */
function anonKey() {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
  const m = src.match(/(sb_publishable_[A-Za-z0-9_-]+)|(eyJ[A-Za-z0-9_.-]{40,})/);
  return m ? (m[1] || m[2]) : null;
}

function loadWindowVars(scripts) {
  const sandbox = { window: {}, console, Math, Object, Array, JSON, String, Number, Boolean, Date };
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const rel of scripts) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
  }
  return sandbox.window;
}

/** Rekurzivni diff s putanjom do polja. Vraća niz `{path, db, file, why?}`. */
function diff(a, b, p, out) {
  out = out || [];
  p = p || '';
  if (a === b) return out;
  const t = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
  const ta = t(a);
  const tb = t(b);
  if (ta !== tb) { out.push({ path: p, db: a, file: b, why: 'tip: ' + ta + ' vs ' + tb }); return out; }
  if (ta === 'array') {
    if (a.length !== b.length) out.push({ path: p, db: a.length, file: b.length, why: 'duljina niza' });
    for (let i = 0; i < Math.max(a.length, b.length); i++) diff(a[i], b[i], p + '[' + i + ']', out);
    return out;
  }
  if (ta === 'object') {
    for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])]) {
      diff(a[k], b[k], p ? p + '.' + k : k, out);
    }
    return out;
  }
  out.push({ path: p, db: a, file: b });
  return out;
}

function cp(c) {
  return c === undefined
    ? '(kraj niza)'
    : JSON.stringify(c) + ' U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Prikaz razlike DVA stringa — centriran na PRVI znak koji se razlikuje.
 * Rezanje „prvih N znakova" ovdje ne valja: razlika je često duboko u tekstu, a upravo je
 * homoglif (isti izgled, druga kodna točka) ono zbog čega ovaj alat postoji. Prvi je pokušaj
 * rezao na 200 znakova i uredno sakrio jedini znak koji je bio bitan.
 */
function showStringPair(a, b, pad) {
  let i = 0;
  while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
  const from = Math.max(0, i - 35);
  const win = (s) => (from > 0 ? '…' : '') + s.slice(from, i + 35) + (i + 35 < s.length ? '…' : '');
  const n = [...a].filter((c, k) => c !== b[k]).length;
  return pad + `prva razlika na indeksu ${i} (duljine: baza ${a.length}, datoteka ${b.length}` +
    `, različitih znakova: ${n})\n` +
    pad + `baza     : ${cp(a[i])}   ${JSON.stringify(win(a))}\n` +
    pad + `datoteka : ${cp(b[i])}   ${JSON.stringify(win(b))}`;
}

/** Prikaz jedne vrijednosti (ne-string ili nedostajuća strana). */
function show(v) {
  const s = (typeof v === 'string') ? v : JSON.stringify(v);
  if (typeof s !== 'string') return String(v);
  const cut = s.length > 200 ? s.slice(0, 200) + '…' : s;
  const odd = [...new Set(cut.match(/[^\x00-\x7F]/g) || [])].map(cp);
  return JSON.stringify(cut) + (odd.length ? '   [ne-ASCII: ' + odd.join(' ') + ']' : '');
}

async function fetchRow(url, key, subjectId, varName) {
  const q = `${url}/rest/v1/subject_content?subject_id=eq.${encodeURIComponent(subjectId)}`
    + `&var_name=eq.${encodeURIComponent(varName)}&select=payload`;
  const res = await fetch(q, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await res.text()).slice(0, 120));
  const rows = await res.json();
  return rows.length ? rows[0].payload : null;
}

(async () => {
  const only = process.argv[2];
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = anonKey();
  if (!url) { console.error('❌ Nedostaje SUPABASE_URL u .env'); process.exit(1); }
  if (!key) { console.error('❌ Anon ključ nije nađen u js/auth.js'); process.exit(1); }

  const subjects = SOKRAT_CATALOG.subjects.filter(
    (s) => (!only || s.id === only) && s.content && Array.isArray(s.content.scripts) && s.content.scripts.length
  );
  if (!subjects.length) { console.error('❌ Nema takvog predmeta sa `content.scripts`: ' + (only || '(svi)')); process.exit(1); }

  console.log('\n=== diff: baza vs datoteke ===');
  console.log('   baza: ' + url + '   predmeta: ' + subjects.length + '\n');

  let totalDiffs = 0;
  let compared = 0;
  let missing = 0;

  for (const s of subjects) {
    let win;
    try { win = loadWindowVars(s.content.scripts); } catch (e) {
      console.log(`  ⊘ ${s.id} — datoteke se ne učitavaju: ${e.message}`);
      continue;
    }
    const varNames = new Set();
    for (const lesson of (s.lessons || [])) {
      const v = SokratCatalog.resolveDataVar(s.id, lesson.id);
      if (v) varNames.add(v);
    }

    for (const varName of varNames) {
      const filePayload = win[varName];
      if (!filePayload) { console.log(`  ⊘ ${s.id}/${varName} — nema u datotekama`); continue; }

      let dbPayload;
      try { dbPayload = await fetchRow(url, key, s.id, varName); } catch (e) {
        console.log(`  ⊘ ${s.id}/${varName} — baza nedostupna: ${e.message}`);
        continue;
      }
      if (dbPayload === null) { missing++; console.log(`  ○ ${s.id}/${varName} — NIJE migriran (samo datoteka)`); continue; }

      compared++;
      const d = diff(dbPayload, JSON.parse(JSON.stringify(filePayload)), '', []);
      if (!d.length) { console.log(`  ✓ ${s.id}/${varName} — identično`); continue; }

      totalDiffs += d.length;
      console.log(`  ✗ ${s.id}/${varName} — ${d.length} razlika:`);
      d.slice(0, 20).forEach((x) => {
        console.log(`      ${x.path}${x.why ? '   (' + x.why + ')' : ''}`);
        if (typeof x.db === 'string' && typeof x.file === 'string') {
          console.log(showStringPair(x.db, x.file, '         '));
        } else {
          console.log(`         baza     : ${show(x.db)}`);
          console.log(`         datoteka : ${show(x.file)}`);
        }
      });
      if (d.length > 20) console.log(`      … i još ${d.length - 20}`);
    }
  }

  console.log('\n' + (totalDiffs === 0
    ? `✅ Nema razlika (usporedeno ${compared}, nemigrirano ${missing}) — re-sync je siguran.`
    : `⚠️  ${totalDiffs} razlika (usporedeno ${compared}). PROČITAJ ih prije re-synca — upsert piše preko baze.`));
  process.exit(totalDiffs === 0 ? 0 : 1);
})();
