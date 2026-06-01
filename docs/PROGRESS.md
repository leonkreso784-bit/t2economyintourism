# Progress Log

Dnevnik rada. Najnoviji unos na vrhu. Svaka sesija: što je napravljeno, što je
testirano, što slijedi.

---

## 2026-06-02 — Sesija 7: A3 — sidebar iz catalog-a
**Napravljeno**
- Zapamćeno trajno (memorija): CSS/JS cache pravilo (bump `?v=`).
- A3.1: `iconGradient` (2 boje) za svih 8 predmeta u catalog (vizualna parnost).
- A3.2: `renderSubjectsSidebar()` u `navigation.js` (gradi listu iz catalog-a,
  escape HTML-a), pozvan u `init.js` prije vezanja listenera.
- A3.3: uklonjen hardkodirani `.subject-item` HTML iz `index.html` (programski,
  pouzdano) → `#subjectsList` prazan + komentar.
- Bumpani svi `?v=` tokeni (30) na 20260602 (init/navigation/catalog promijenjeni →
  bez bumpa bi keširani stari init.js dao PRAZAN sidebar).

**Testirano**
- `tests/sidebar.spec.js`: 8/8 predmeta, ispravan redoslijed, klik → lekcije, 0 grešaka.
- Puna suite (responsive+smoke+sidebar × 4 profila): **12 passed**, problems=0, errors=0.
- Vizualna potvrda (screenshot iPhone 16): gradijent ikone + layout vjerni originalu.

**Sljedeće**
- Deploy (push) pa A4 (lazy loading sadržaja).

---

## 2026-06-02 — Sesija 6: širi smoke test + deploy
**Napravljeno**
- Potvrđeno (iPhone 16 render + h1 dijagnostika) da je Learn popravak ispravan
  lokalno; korisnikov telefon je pokazivao staru verziju jer popravak nije bio deployan.
  Prazan ljubičasti naslov-box = simptom istog overflowa (naslov centriran u 1176px
  širokom kontejneru → odguran izvan ekrana); popravak overflowa rješava i to.
- Dodan `tests/smoke.spec.js`: sve sekcije × svih 8 predmeta.

**Testirano**
- `npm run test:responsive` (responsive + smoke) → 4/4 profila, subjects=8,
  problems=0, JS errors=0, overflow=0. A2 refaktor potvrđeno ne ruši nijednu sekciju.

**Sljedeće**
- Deploy (push origin main → Vercel) pa nastavak A3.

---

## 2026-06-01 — Sesija 5: Playwright + riješen Learn horizontalni overflow
**Napravljeno**
- Postavljen Playwright (chromium) + `scripts/static-server.js` + `playwright.config.js`
  (iPhone SE/15Pro/ProMax + landscape) + `tests/responsive.spec.js`. ADR-005.
- Probom utvrđen TOČAN uzrok overflowa (BUG-003): `.study-content` (flex-dijete bez
  `min-width:0`) naraste na `max-width:1200` zbog nerazlomljivog sadržaja → stranica
  šira od ekrana. Popravak: `min-width:0` + `width:100%` na `.study-content`, obrambeni
  `min-width:0` na `#learn`/`.learn-container`/`.learn-content`.
- npm skripte: `test:responsive`, `verify:catalog`, `serve:test`.

**Testirano**
- `npm run test:responsive` → **4/4 profila PASS**, svih 8 predmeta, portret (375/393/
  430) i landscape (852): `innerWidth==docScrollW==deviceWidth`, 0 page overflowa.
- `verify-catalog` PASS; brace-balance CSS OK.

**Sljedeće**
- A3: sidebar render iz catalog-a.

---

## 2026-06-01 — Sesija 4: pregled bugova + Learn responzivnost (iPhone)
**Napravljeno**
- Regresija: `verify-catalog.js` → PASS.
- Pregled cijelog CSS-a (responsive.css, learn.css, pages.css, variables.css).
- Nađena i popravljena 2 slomljena CSS pravila u `responsive.css` (BUG-001, BUG-002)
  koja su error-recoveryjem gutala valjana pravila. Zagrade sada 520/520.
- Learn responzivnost (BUG-003): donji padding 90px→24px (uklonjen prazan prostor);
  dodan landscape safe-area L/R za learn-container (notch na modernim iPhonima).
- Uočeno: `responsive.css` ima dosta MRTVOG CSS-a (klase kojih nema u HTML-u:
  `.quiz-section`, `.topic-*`, `.flashcards-section`, ...). Dobro-oblikovana mrtva
  pravila ostavljena; predloženo zasebno čišćenje.

**Testirano**
- Brace-balance svih CSS datoteka → OK (responsive 520/520, learn 124/124).
- ⚠️ Vizualno NIJE potvrđeno u pregledniku (nema browsera u ovom okruženju) —
  čeka screenshot/potvrdu korisnika ili Playwright harness.

**Sljedeće**
- Vizualna potvrda Learn sekcije (iPhone portret + landscape); po potrebi fini tuning.
- Zatim nastavak A3 (sidebar render iz catalog-a).

---

## 2026-06-01 — Sesija 3: A2 refaktor config.js (data-driven) + verifikacija
**Napravljeno**
- Commitan baseline (710ebc5): catalog + docs + README.
- ✅ A2: `js/config.js` — `getSubjectData()` sada razrješava podatke preko
  `SokratCatalog.resolveDataVar()` (catalog), a `subjectDataMap` se gradi iz
  `SOKRAT_CATALOG.subjects`. Uklonjeni hardkodirani if-lanci i ručni literal.
- Standardiziran `window`-izvoz u svih 8 predmeta: dodano `window.X = X` u 6
  data-*.js koji to nisu imali (ebusiness/food/accounting su već imali). Nužno za
  catalog lookup i budući lazy loading (A4).
- `data/catalog.js` uključen u `index.html` prije `js/config.js`.
- Dodan `scripts/verify-catalog.js` (ponovo-iskoristiv checker).

**Testirano**
- `node scripts/verify-catalog.js` → **0 grešaka**: resolveDataVar identičan
  starom getSubjectData za svih 8 predmeta; sve datoteke postoje; sve ciljane
  varijable deklarirane i na window.
- `node --check` na svim izmijenjenim JS datotekama → sintaksa OK.
- Provjereni svi vanjski korisnici `subjectDataMap`/`getSubjectData` (analytics,
  storage, progress, navigation) — koriste samo polja koja i dalje postoje.

**Sljedeće**
- 🟦 A3: renderirati popis predmeta u sidebaru iz catalog-a (ukloniti ručni HTML).

---

## 2026-06-01 — Sesija 2: dokumentacijski set + README
**Napravljeno**
- Dodani docovi: `CONTENT_SCHEMA.md` (kanonski oblik sadržaja), `CONTENT_GUIDE.md`
  (kako dodati predmet/lekciju), `TESTING.md` (ručna QA checklista), `BACKLOG.md`
  (ideje: monetizacija, UGC, funkcionalnosti).
- Ažuriran root `README.md` (zastario — sad opisuje platformu, predmete, docs/).
- Dopunjen `docs/README.md` index.
- Dogovoreno pravilo: **uvijek ažurirati docs nakon svake izmjene.**

**Sljedeće**
- 🟦 A2: refaktor `js/config.js` (subjectDataMap + getSubjectData iz catalog-a) + test.

---

## 2026-06-01 — Sesija 1: postavljanje temelja (M0/A1 + dokumentacija)
**Napravljeno**
- Analiza cijele postojeće arhitekture (HTML, JS moduli, model podataka, hosting).
- Dogovorena arhitektura: Supabase backend, ja kao jedini autor, fazni pristup.
- ✅ A1: kreiran `data/catalog.js` — hijerarhija FMTU Opatija → Hospitality
  Management → 2. godina; svih 8 predmeta s `content.resolve` (generalizira
  postojeći `getSubjectData()`).
- Upisana stvarna raspodjela: 1. semestar = Tourism Economics, E-Business,
  Accounting; 2. semestar = Entrepreneurship, Econ in Hospitality, Marketing,
  Geography, Food & Nutrition.
- Postavljena `docs/` struktura (PRD, ROADMAP, ARCHITECTURE, CHANGELOG, BUGS, DECISIONS).

**Status / sigurnost**
- Sve promjene additivne; `index.html` netaknut → live verzija radi identično.

**Sljedeće**
- 🟦 A2: refaktor `js/config.js` da `subjectDataMap` i `getSubjectData()` čita iz
  catalog-a (uz fallback), pa test da svih 8 predmeta radi isto.
