# Content Guide — kako dodati predmet ili lekciju

> Praktični playbook. Oblik podataka je u [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).
> Trenutni način rada (Faza 0, prije backenda): predmeti se dodaju kroz `data/catalog.js`
> + `data-*.js` datoteku. Kad dođe admin (korak B10), isto će se raditi kroz su čelje.

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

1. **Napravi datoteku** `data-<predmet>.js` s globalnom varijablom:
   ```js
   const mySubjectData = {
     temaA: { name, icon, color, flashcards:[], quiz:[], fillBlanks:[], learn:{content} },
     temaB: { ... }
   };
   if (typeof window !== 'undefined') window.mySubjectData = mySubjectData;
   ```
2. **Dodaj unos u `data/catalog.js` → `subjects[]`:**
   ```js
   {
     id: 'my-subject', programId: 'hospitality-management',
     year: 2, semester: 1,
     name: 'My Subject', shortName: 'MS', icon: 'fa-book', color: '#6366f1',
     description: '...', storageKey: 'my-subject-progress',
     features: { blindMap: false },
     lessons: [ { id: 'midterm-1', name: 'Midterm 1', description: '...' } ],
     content: { scripts: ['data-my-subject.js'], resolve: { '*': 'mySubjectData' } }
   }
   ```
3. **(Privremeno, do koraka A4 lazy-load)** uključi datoteku u `index.html` `<script>`
   blok. Nakon koraka A4 ovo više neće trebati — učitavat će se automatski.
4. **Test** (vidi [TESTING.md](TESTING.md)) i **ažuriraj docs** (PROGRESS, CHANGELOG, ROADMAP).

## C) Iz PPT/PDF profesora → skripta (Faza 1, automatizirano)
Dok ne izgradimo AI pipeline, ručni put: pročitaj materijal → po temama napiši
flashcards/quiz/fill/learn prema schemi. Kasnije Claude generira draft, ti samo
pregledaš i ispraviš.

## Konvencije
- `id`/`slug`: kebab-case, jedinstven (`tourism-economics`, ne "Tourism Economics").
- Ključ kategorije: camelCase, **stabilan nakon objave** (veže napredak korisnika).
- Ikone: Font Awesome 6 (`fa-...`). Boje: hex.
- Sadržaj na engleskom (smjer je na engleskom).
