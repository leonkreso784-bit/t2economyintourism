# EXERCISES_DB_FIX_PLAN.md — kako popraviti BUG-012 (randomizirane vježbe iz baze)

> **✅ GOTOVO — Opcija A izvedena i LIVE (2026-06-27).** Cigle: (1) catalog `codeScripts` + (2) loader `filesToLoad` +
> (4) verify-čuvar → commiti `b7a6b7f`/`801d9a6`, pushano `7176194..801d9a6`. (3) baza očišćena (4 reda vježbi) +
> (5) Math gradivo migrirano → **51 red / 17 predmeta / 0 redova vježbi**. Cache `20260690`. Detalji: [BUGS.md](../records/BUGS.md) §BUG-012 (riješen).

> Vidi [BUGS.md](../records/BUGS.md) §BUG-012 za pun nalaz i dokaze. Sažetak: randomizirane vježbe
> (`generate(p)` funkcija na objektu) **ne prežive `JSON.stringify` u Supabase**, a loader u
> DB-modu **ne učita `content.scripts`** → vježbe razbijene. Pogođeno živo: Statistics 23,
> Macro 25, Accounting 8. Math (29) još nije u bazi — zato ga ne migriramo dok ovo ne riješimo.

## Temeljni princip (vrijedi za sve opcije)
**Vježbe su KOD, ne podaci.** `data/<subj>/exercises.js` sadrži funkcije (`generate(p)`) i ovisi
o `*-lib.js` (`StatLib`/`MathLib`). Takav sadržaj **nije JSON-migracijski**. Bazni read-path (ADR-011)
smije nositi samo **čisto-podatkovne** window-varove: `M1`/`M2`/`Final` (flashcards/quiz/fill/learn).
Sve opcije dolje poštuju ovo; razlikuju se po tome KAKO vježbe stignu do preglednika.

---

## Zajednički koraci (potrebni u SVAKOJ opciji)
Bez obzira na odabir, ovo se mora napraviti:

- **Z1 — `migrate-content.js` ne sprema vježbe.** Izbaci `content.exercises` iz `rowsForSubject()`
  (linija ~57). Baza tako nikad više ne dobije lossy funkcijski paket.
- **Z2 — Očisti živu bazu.** Obriši pokvarene retke:
  `delete from public.subject_content where var_name in ('statisticsExercises','macroeconomicsExercises','accountingExercises');`
  (Academic Writing NE — `academicWritingExercises` je 0 randomiziranih, čist podatak, smije ostati ili otići; svejedno.)
- **Z3 — Test koji bi ovo uhvatio.** Playwright: u DB-modu otvori **randomiziranu** vježbu i potvrdi da
  ima generirana polja/odgovor (ne prazno). Bez ovog testa, regres se može vratiti.
- **Z4 — Gate + cache bump** (`CONTENT_VERSION` + `?v=` za promijenjeni `js/*`), docovi, korisnikov pregled.

Razlika među opcijama = **A2/B2/C2**: kako loader nabavi vježbe u DB-modu.

---

## Opcija A — Loader uvijek učita exercises+lib skriptu iz datoteke  ⭐ preporuka
**Ideja:** study sadržaj (M1/M2/Final) iz baze; **vježbeni paket + lib UVIJEK iz datoteke**, neovisno o DB-modu.

- **A2 — `content-loader.js`:** kad `fromDb===true`, NE vrati odmah — nego **i dalje učitaj iz datoteke one
  skripte koje daju kod** (exercises + lib), preskačući one koje je baza već dala (M1/M2/Final).
  Detekcija „koja je skripta kod": skripta čiji se rezultat NE nalazi među DB var-ovima. Najčišće: u catalogu
  označiti koje su skripte „code" (vidi A-var dolje), ili heuristika po imenu (`exercises.js` + `*-lib.js`).
- **Kako razlikovati skripte (pod-odluka A-i vs A-ii):**
  - **A-i (eksplicitno, čisto):** dodaj `content.codeScripts: ['data/math/math-lib.js','data/math/exercises.js']`
    u catalog (uz postojeći `scripts`). Loader: u DB-modu učita SAMO `codeScripts`. Mali catalog dodatak na 4
    predmeta; nula heuristike. **Najpredvidljivije.**
  - **A-ii (heuristika, 0 catalog izmjena):** loader u DB-modu učita skripte čiji path sadrži `exercises` ili `-lib`.
    Manje koda, ali implicitno (lomi se ako netko preimenuje datoteku).
- **Plus:** study sadržaj i dalje ide iz baze (Blok B vrijednost očuvana); vježbe rade točno (kod iz fajla, kao i sad
  na file-fallbacku — već dokazano brute-force verificirano).
- **Minus:** loader logika malo složenija (dvije grane skripti).
- **Rizik:** nizak. Vježbeni put ostaje identičan današnjem file-putu (0 promjene ponašanja vježbi).

---

## Opcija B — Exercise-predmeti idu CIJELI iz datoteke (preskoči bazu za njih)
**Ideja:** ako predmet ima vježbe, loader za NJEGA uopće ne čita iz baze — učita sve `content.scripts` iz datoteke.

- **B2 — `content-loader.js`:** na ulazu, ako `subject.content.exercises` (ili `features.exercises`) postoji →
  preskoči `_loadSubjectFromSupabase`, idi ravno na file-chain (staro ponašanje).
- **Plus:** najjednostavnija izmjena (jedan `if`), najmanji rizik, vježbe + study uvijek iz istog izvora (konzistentno).
- **Minus:** 4 predmeta (Accounting/Statistics/Macro/Math) **ne koriste bazni read-path** za study sadržaj —
  gube prednost Bloka B (njihovih ~12 study-varova ostaje na datotekama). Za sada beznačajno (datoteke su ionako
  izvor istine), ali kad dođe admin CRUD (B10), ti predmeti trebaju poseban tretman.
- **Rizik:** vrlo nizak.

---

## Opcija C — Spremi `generate` kao STRING + `new Function()` u pregledniku
**Ideja:** zadrži vježbe u bazi, ali serijaliziraj funkcije kao tekst i rekonstruiraj ih na klijentu.

- **C2 —** migracija pretvori `generate` u izvorni string; loader nakon DB-čitanja radi `new Function('p', body)`.
  Lib (`StatLib`/`MathLib`) i dalje treba učitati (isti problem kao A) → ne rješava ovisnost o libu.
- **Plus:** vježbe ostaju „u bazi".
- **Minus:** **`new Function`/eval = sigurnosni i CSP rizik**, krhko (escaping tijela funkcije, closure nad libom puca),
  protiv „čistog" duha projekta. Lib problem i dalje otvoren.
- **Rizik:** visok. **Ne preporučujem.**

---

## Preporuka i redoslijed (mali koraci)
**Opcija A (pod-odluka A-i, eksplicitni `codeScripts`)** — najčišća, čuva Blok B vrijednost, predvidljiva.
Ako želiš apsolutno minimalan zahvat i ne smeta da 4 predmeta zaobiđu bazu → **Opcija B**.

Predloženi koraci (cigla-po-cigla, stani-pregledaj-nastavi):
1. **Z2** — očisti bazu (3 retka) → **odmah gasi živi bug** (ti predmeti padnu na file-fallback koji RADI).
2. **A2/B2** — loader fix (po odabranoj opciji) + **Z1** (migrate ne sprema vježbe).
3. **Z3** — Playwright test za randomiziranu vježbu u DB-modu.
4. **Z4** — gate (validate/verify/test:unit/Playwright) + cache bump + docovi + tvoj pregled.
5. **TEK ONDA** migracija Math study-varova (`mathM1/M2/Final`, bez `mathExercises`) → Math 100% iz baze, vježbe iz fajla.

> Napomena: korak 1 (čišćenje baze) je **siguran i reverzibilan** sam za sebe (file-fallback pokriva) i može se
> napraviti odmah, prije ostatka — trenutno zaustavlja regres na produkciji.
