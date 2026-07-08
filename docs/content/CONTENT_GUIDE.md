# Content Guide — kako dodati predmet ili lekciju

> Praktični playbook. Oblik podataka je u [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).
> Trenutni način rada (Faza 0, prije backenda): predmeti se dodaju kroz `data/catalog.js`
> + `data-*.js` datoteku. Kad dođe admin (korak B10), isto će se raditi kroz su čelje.

> **⚠️ JSON dual-read (F2 2A, LIVE od 2026-07-02; accounting dovršen 2026-07-03 → 18/18):** svih 18 predmeta ima
> `content.dataFormat:'json'` u catalogu → study se čita iz `data/json/<id>/<var>.json`. **Nakon SVAKE
> izmjene `data/*.js` takvog predmeta pokreni `npm run export:json <subjectId>`** (regenerira JSON) —
> inače CI pada na drift-gateu. Ako je predmet i u Supabase bazi, dodatno `node scripts/migrate-content.js <id>`.
> Vježbe (`exercises.js`) se ne exportaju (BUG-012). NOVI predmet radi i bez flaga (`.js` put) — flag +
> export dodaj kad želiš (opcionalno, 2 min).

## A) Dodati novu LEKCIJU postojećem predmetu (npr. "second-midterm")

1. **Sadržaj:** dodaj kategorije u postojeću ili novu globalnu varijablu predmeta
   (npr. nova varijabla `marketingSecondData` u novoj datoteci `data-marketing-2.js`).
2. **Catalog** (`data/catalog.js`) — u tom predmetu:
   - dodaj/uredi unos u `lessons[]`: `{ id, name, description }`.
   - u `content.scripts[]` dodaj putanju nove datoteke (ako je nova).
   - u `content.resolve` mapiraj `lessonId → imeVarijable`.
3. **Test:** otvori predmet → lekcija se pojavi i učita sadržaj.

> Napomena: lekcije s `id: 'second-midterm'` trenutno se u UI-ju prikazuju kao
> "coming soon" (vidi `js/navigation.js`). Kad dodaš pravi sadržaj, to ćemo otključati.

## B) Dodati potpuno NOVI predmet

### Standardna struktura (preporučeno za nove predmete)
```
data/<subject-id>/
   midterm-1.js   -> window.<subjectVar>M1
   midterm-2.js   -> window.<subjectVar>M2
   final.js       -> window.<subjectVar>Final
```
Jedna datoteka po lekciji (k1 / k2 / završni). Čisto za pisanje, čisto za kasniju
migraciju u bazu. Template: [`data/_template/lesson.template.js`](../data/_template/lesson.template.js).

### Najbrže: scaffold
```bash
npm run scaffold -- <subject-id> "<Naziv>" <godina> <semestar>
# npr: npm run scaffold -- micro-economics "Microeconomics" 1 1
```
Kreira mapu + 3 lekcije iz templatea i ispiše GOTOV unos za `data/catalog.js`
(+ privremene `<script>` linije za index.html, dok ne stigne lazy-load seam).
Zatim: popuni sadržaj → zalijepi catalog unos → `npm run verify` → testovi.

### Ručno (alternativa / stari jedno-datotečni način)

1. **Napravi datoteku** `data-<predmet>.js` s globalnom varijablom:
   ```js
   const mySubjectData = {
     temaA: { name, icon, color, flashcards:[], quiz:[], fillBlanks:[], learn:{content} },
     temaB: { ... }
   };
   if (typeof window !== 'undefined') window.mySubjectData = mySubjectData;
   ```
   > Obavezno: `window.mySubjectData = ...` na kraju (catalog razrješava podatke po imenu).
2. **Dodaj unos u `data/catalog.js` → `subjects[]`:**
   ```js
   {
     id: 'my-subject', programId: 'hospitality-management',
     year: 2, semester: 1,
     name: 'My Subject', shortName: 'MS', icon: 'fa-book', color: '#6366f1',
     iconGradient: ['#6366f1', '#818cf8'],   // boje ikone u sidebaru
     description: '...', storageKey: 'my-subject-progress',
     features: { blindMap: false },
     lessons: [ { id: 'midterm-1', name: 'Midterm 1', description: '...' } ],
     content: { scripts: ['data-my-subject.js'], resolve: { '*': 'mySubjectData' } }
   }
   ```
   > Sidebar se renderira automatski iz catalog-a (`renderSubjectsSidebar()`), pa NE
   > treba ručno dodavati HTML u `index.html` — dovoljan je ovaj unos.
3. **(Privremeno, do koraka A4 lazy-load)** uključi datoteku u `index.html` `<script>`
   blok. Nakon koraka A4 ovo više neće trebati — učitavat će se automatski.
4. **Test** (vidi [TESTING.md](../TESTING.md)) i **ažuriraj docs** (PROGRESS, CHANGELOG, ROADMAP).

## C) Iz PPT/PDF profesora → predmet (GENERATOR, automatizirano) ✅
Puni plan i detalji: **[CONTENT_GENERATOR.md](CONTENT_GENERATOR.md)**. Generator-jezgra (bricks 1–4) je gotova;
bulk drafting ide na **jeftin model (Sonnet) preko tvog API ključa** (`.env` → `ANTHROPIC_API_KEY`), a točnost
nose deterministički zaštitari + tvoj/Opus činjenični spot-check. Tok:

```bash
# 0. Posloži materijale: _materials/.../<subject>/{midterm-1,midterm-2}/NN_*.pdf  (mapa = kolokvij)
# 1. Materijali → topics.json (PDF/TXT, jedan fajl = jedna tema)
node scripts/build-topics.js <subjectId> "<materialsDir>"
# 2. Draft po temi (Sonnet); --math za kvantitativne, --dry za besplatni pregled prompta
node scripts/generate-subject.js <subjectId> [--math]
# 3. draft.json → data/<subjectId>/{midterm-1,2,final}.js  + ISPIS catalog unosa
node scripts/assemble-subject.js <subjectId> --name "Naziv" --short XYZ --icon fa-... --color "#..." --year N --sem N --desc "..."
# 4. GATE (ručno, uz provjeru):
#    a) zalijepi ispisani catalog unos u data/catalog.js (final.js MORA biti zadnji u scripts)
#    b) npm run bump   (F3 3C.1 — bumpa SVE ?v= tokene + CONTENT_VERSION + SW_VERSION odjednom; kraj ručnog bumpanja)
npm run validate:content <subjectId>   # sadržajni zaštitar (shema + KaTeX currency-safe)
npm run verify                          # catalog integritet
npm run test:responsive                 # Playwright render
#    c) Opus/ti: činjenični spot-check protiv predavanja (POUKA: stari/tanak sadržaj rebuild)
```

> Generator NE dira `catalog.js` ni `CONTENT_VERSION` sam (najosjetljivije = svjesno, uz verify).
> `tmp/` (topics.json + draft.json) je gitignored (zaštićeni izvorni tekst). examPractice za finalni
> se ne generira automatski — doda se ručno po želji. Limit: validator jamči da je quiz `correct` u
> rasponu, NE i da je stvarno točan → to hvata spot-check.

### Ručni put (alternativa, za male dorade)
Pročitaj materijal → po temama napiši flashcards/quiz/fill/learn prema schemi izravno u `data/<subject>/*.js`.

## Konvencije
- `id`/`slug`: kebab-case, jedinstven (`tourism-economics`, ne "Tourism Economics").
- Ključ kategorije: camelCase, **stabilan nakon objave** (veže napredak korisnika).
- Ikone: Font Awesome 6 (`fa-...`). Boje: hex.
- Sadržaj na engleskom (smjer je na engleskom).
