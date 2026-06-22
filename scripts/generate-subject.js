/* eslint-disable no-console */
// ===== Generate subject — korak 3 generatora predmeta =====
// Usage:
//   node scripts/generate-subject.js <subjectId> [--topic <id>] [--limit N] [--math] [--dry]
//
// Čita tmp/<subjectId>/topics.json (iz build-topics.js) i za SVAKU temu zove Anthropic
// API (model iz .env GENERATOR_MODEL, default claude-sonnet-4-6) sa strogim schema-promptom
// + few-shot primjerom. Model vraća SAMO sadržaj (flashcards/quiz/fillBlanks/learn); skripta
// deterministički dodaje name/icon/color i sprema tmp/<subjectId>/draft.json.
//
//   --topic <id>  generiraj samo jednu temu (jeftin test)
//   --limit N     prvih N tema
//   --math        ubaci KaTeX upute (kvantitativni predmeti)
//   --dry         složi prompt i ispiši ga, BEZ poziva na API (0 troška)
//
// Bulk drafting ovdje ide na JEFTIN model (ne Opus). Izlaz se NE commita (tmp/ gitignored);
// brick 4 (assemble-subject.js) ga pretvara u data/<subjectId>/*.js, a brick 1
// (validate-content.js) je završni zaštitar.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// --- .env loader (bez ovisnosti) -------------------------------------------------
function loadEnv() {
  const p = path.join(ROOT, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

// --- icon/color paleta (deterministički po indeksu kategorije) -------------------
const PALETTE = [
  ['fa-book-open', '#3b82f6'], ['fa-lightbulb', '#f59e0b'], ['fa-chart-line', '#10b981'],
  ['fa-compass', '#14b8a6'], ['fa-cubes', '#8b5cf6'], ['fa-gears', '#ef4444'],
  ['fa-flask', '#ec4899'], ['fa-globe', '#0ea5e9'], ['fa-scale-balanced', '#6366f1'],
  ['fa-layer-group', '#f43f5e'], ['fa-seedling', '#22c55e'], ['fa-bullseye', '#eab308'],
];

const SCHEMA_SPEC = `Return a SINGLE JSON object with EXACTLY these keys (no others):
{
  "flashcards": [ { "question": string, "answer": string, "explanation"?: string } ],
  "quiz":       [ { "question": string, "options": [2..6 strings], "correct": integer (0-based index into options) } ],
  "fillBlanks": [ { "sentence": string (MUST contain the literal blank "_______"), "answer": string, "hint"?: string } ],
  "learn":      { "content": string (HTML) }
}`;

const FEWSHOT = JSON.stringify({
  flashcards: [
    { question: 'What is price elasticity of demand?', answer: 'The responsiveness of quantity demanded to a change in price.', explanation: 'Elastic if >1, inelastic if <1.' }
  ],
  quiz: [
    { question: 'Demand is called "elastic" when the elasticity is:', options: ['Less than 1', 'Greater than 1', 'Exactly 0', 'Negative infinity'], correct: 1 }
  ],
  fillBlanks: [
    { sentence: 'When demand is _______, a price rise lowers total revenue.', answer: 'elastic', hint: 'Elasticity greater than 1.' }
  ],
  learn: { content: '<h3>Price Elasticity</h3><p>Elasticity measures how strongly quantity responds to price...</p><ul><li><strong>Elastic:</strong> elasticity &gt; 1.</li></ul>' }
});

function buildPrompt(topic, math) {
  const mathRules = math
    ? 'This is a QUANTITATIVE subject. For math use KaTeX delimiters: inline \\( ... \\) and display \\[ ... \\]. '
      + 'NEVER use a single $ as a math delimiter. Write currency as "EUR 25" (not "$25"). Show worked steps in learn.content.'
    : 'Write currency as "EUR 25"; do NOT use a single $ as a math delimiter.';
  return [
    `Topic title: "${topic.title}"`,
    `This content belongs to the "${topic.lesson}" lesson.`,
    '',
    SCHEMA_SPEC,
    '',
    'Requirements:',
    '- Base EVERY fact ONLY on the SOURCE TEXT below. Do NOT invent facts not supported by it.',
    '- Produce 10–14 flashcards, 8–12 quiz questions, 6–10 fillBlanks.',
    '- learn.content is rich textbook-style HTML (<h3>,<p>,<ul>,<li>,<strong>,<em>): definition, intuition, key points, and common pitfalls.',
    '- quiz: "correct" is the 0-based INDEX of the correct option; distractors must be plausible.',
    '- EVERY fillBlank "sentence" MUST contain the literal blank "_______".',
    '- Language: English.',
    '- ' + mathRules,
    '- Output STRICT JSON only — no markdown fences, no commentary.',
    '',
    'Example of the exact JSON shape (content is illustrative):',
    FEWSHOT,
    '',
    'SOURCE TEXT:',
    '"""',
    topic.text,
    '"""'
  ].join('\n');
}

async function callModel(prompt, model, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: 'You are a meticulous study-content author for a flashcards/quiz/fill/learn platform '
        + '(FMTU Opatija, Hospitality Management). You output STRICT JSON only, following the schema exactly, '
        + 'grounded strictly in the provided source text.',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error('API ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  const text = (data.content || []).map((b) => b.text || '').join('');
  return { text, usage: data.usage || {} };
}

function parseJson(raw) {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, ''); // skini fence ako ga ima
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a > 0 || b < s.length - 1) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

// Laka strukturna provjera (kanonski validator je validate-content.js u brick 4)
function sanity(key, cat) {
  const problems = [];
  for (const k of ['flashcards', 'quiz', 'fillBlanks', 'learn']) if (!(k in cat)) problems.push('nedostaje ' + k);
  if (Array.isArray(cat.quiz)) cat.quiz.forEach((q, i) => {
    if (!Array.isArray(q.options) || q.options.length < 2) problems.push(`quiz[${i}] options`);
    else if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) problems.push(`quiz[${i}] correct OOB`);
  });
  if (Array.isArray(cat.fillBlanks)) cat.fillBlanks.forEach((b, i) => { if (!String(b.sentence || '').includes('_______')) problems.push(`fillBlank[${i}] nema _______`); });
  if (!cat.learn || !cat.learn.content) problems.push('learn.content prazno');
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const subjectId = args[0];
  if (!subjectId || subjectId.startsWith('--')) { console.error('Usage: node scripts/generate-subject.js <subjectId> [--topic id] [--limit N] [--math] [--dry]'); process.exit(1); }
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] || true) : null; };
  const onlyTopic = opt('--topic');
  const limit = opt('--limit') ? Number(opt('--limit')) : 0;
  const math = args.includes('--math');
  const dry = args.includes('--dry');

  const topicsFile = path.join(ROOT, 'tmp', subjectId, 'topics.json');
  if (!fs.existsSync(topicsFile)) { console.error('Nema ' + path.relative(ROOT, topicsFile) + ' — pokreni build-topics.js prvo.'); process.exit(1); }
  const { topics } = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));

  let work = topics;
  if (onlyTopic && typeof onlyTopic === 'string') work = topics.filter((t) => t.id === onlyTopic);
  if (limit) work = work.slice(0, limit);
  if (!work.length) { console.error('Nema tema za generirati (provjeri --topic/--limit).'); process.exit(1); }

  const model = process.env.GENERATOR_MODEL || 'claude-sonnet-4-6';
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!dry && !apiKey) { console.error('Nema ANTHROPIC_API_KEY u .env'); process.exit(1); }

  if (dry) {
    console.log('=== DRY: prompt za "' + work[0].id + '" (' + (math ? 'math' : 'text') + ') ===\n');
    console.log(buildPrompt(work[0], math));
    return;
  }

  const draftFile = path.join(ROOT, 'tmp', subjectId, 'draft.json');
  const draft = fs.existsSync(draftFile) ? JSON.parse(fs.readFileSync(draftFile, 'utf8')) : { subjectId, model, generatedAt: new Date().toISOString(), lessons: {} };
  let totalIn = 0, totalOut = 0, totalProblems = 0;

  for (let i = 0; i < work.length; i++) {
    const topic = work[i];
    process.stdout.write(`[${i + 1}/${work.length}] ${topic.id} (${topic.lesson}) … `);
    let cat;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const prompt = buildPrompt(topic, math) + (attempt === 2 ? '\n\nIMPORTANT: your previous output was not valid JSON. Return ONLY the JSON object.' : '');
        const { text, usage } = await callModel(prompt, model, apiKey);
        totalIn += usage.input_tokens || 0; totalOut += usage.output_tokens || 0;
        cat = parseJson(text);
        break;
      } catch (e) {
        if (attempt === 2) { console.log('✗ ' + e.message); cat = null; }
      }
    }
    if (!cat) { totalProblems++; continue; }

    const [icon, color] = PALETTE[i % PALETTE.length];
    const full = { name: topic.title, icon, color, flashcards: cat.flashcards || [], quiz: cat.quiz || [], fillBlanks: cat.fillBlanks || [], learn: cat.learn || { content: '' } };
    const problems = sanity(topic.id, full);
    draft.lessons[topic.lesson] = draft.lessons[topic.lesson] || {};
    draft.lessons[topic.lesson][topic.id] = full;
    console.log(`fc=${full.flashcards.length} quiz=${full.quiz.length} fill=${full.fillBlanks.length}` + (problems.length ? ' ⚠ ' + problems.join('; ') : ' ✓'));
    if (problems.length) totalProblems++;
  }

  fs.writeFileSync(draftFile, JSON.stringify(draft, null, 2));
  const cost = (totalIn / 1e6) * 3 + (totalOut / 1e6) * 15; // Sonnet ~$3/$15 po M tokena (gruba procjena)
  console.log(`\nTokeni: in=${totalIn} out=${totalOut} (~$${cost.toFixed(3)}). Problema: ${totalProblems}.`);
  console.log('✅ Draft: ' + path.relative(ROOT, draftFile));
  if (totalProblems) process.exit(1);
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
