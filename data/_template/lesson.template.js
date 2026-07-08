// ===== TEMPLATE LEKCIJE — kopiraj, NE uređuj original =====
//
// Standardna struktura za NOVI predmet (preporučeno):
//   data/<subject-id>/
//     midterm-1.js   -> window.<subjectVar>M1
//     midterm-2.js   -> window.<subjectVar>M2
//     final.js       -> window.<subjectVar>Final
//
// Koraci:
//   1) Kopiraj ovaj fajl u data/<subject-id>/<lesson>.js
//   2) Preimenuj varijablu (npr. microEconomicsM1) i izloži je na window (dolje).
//   3) Popuni kategorije po docs/content/CONTENT_SCHEMA.md.
//   4) Dodaj predmet u data/catalog.js (content.scripts + content.resolve).
//   5) `npm run verify` (provjeri catalog + sadržaj), pa testovi.
//
// Brže: `node scripts/scaffold-subject.js <id> "<Naziv>" <godina> <semestar>`
// napravi mapu + sve tri lekcije iz ovog templatea i ispiše catalog unos.

const LESSON_DATA_TEMPLATE = {
  // Ključ kategorije = camelCase, STABILAN nakon objave (veže napredak korisnika).
  exampleTopic: {
    name: 'Example Topic',           // prikazani naziv
    icon: 'fa-book',                 // Font Awesome 6 (bez "fas")
    color: '#6366f1',                // hex boja teme

    flashcards: [
      {
        question: 'Primjer pitanja?',
        answer: 'Primjer odgovora.\n• može imati bullete\n• i nove redove (\\n)',
        explanation: 'Kratka dopuna (opcionalno).'
      }
    ],

    quiz: [
      {
        question: 'Primjer kviz pitanja?',
        options: ['Opcija A', 'Opcija B', 'Opcija C', 'Opcija D'],
        correct: 1                   // INDEX točne opcije (0-based)
      }
    ],

    fillBlanks: [
      {
        sentence: 'Glavni pojam je _______.',  // _______ = praznina
        answer: 'pojam',                        // provjera ne razlikuje velika/mala slova
        hint: 'Kratka pomoć (opcionalno).'
      }
    ],

    learn: {
      content: '<h3>Naslov</h3><p>HTML sadržaj gradiva...</p>',
      image: null                    // npr. "assets/<subject>/slika.jpg" ili null
    }
  }
};

// Izloži na window — IME mora odgovarati onome u data/catalog.js -> content.resolve
if (typeof window !== 'undefined') window.LESSON_DATA_TEMPLATE = LESSON_DATA_TEMPLATE;
if (typeof module !== 'undefined' && module.exports) module.exports = LESSON_DATA_TEMPLATE;
