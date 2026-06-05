# Progress Log

Dnevnik rada. Najnoviji unos na vrhu. Svaka sesija: što je napravljeno, što je
testirano, što slijedi.

---

## 2026-06-05 — Sesija 19: razbijanje `responsive.css` (2470 linija → 6 dijelova)
**Kontekst:** `responsive.css` narastao na ~2.4k linija (3 naslagana prolaza) → teško za snalaženje;
djelomično doprinijelo BUG-005 (pravilo zakopano). Odluka korisnika: razbiti PRIJE rada na Marketingu.

**Pristup (siguran):** podjela po **SUSJEDNIM sekcijama (bez premještanja)** — responsive se učitava
ZADNJI i gazi module, pa bi premještanje promijenilo kaskadu. Skripta izrezala 6 dijelova + **3 provjere**:
kontiguitet, identičnost sadržaja (rebuild iz zapisanih fajlova = original), balans `{}` po svakom fajlu.

**Napravljeno**
- `css/responsive/01-up-and-phone-breakpoints` · `02-mobile-core` · `03-modes-a11y-print` ·
  `04-mobile-extra` · `05-device-sizes` · `06-component-improvements` (5.5–10.7 KB).
- `styles.css`: import lanca 01→06 (PRIJE `learn.css`) + upozorenje „ne presložuj"; obrisan `css/responsive.css`.
- Bump `?v=20260607` (styles.css token u index.html + dijelovi).

**Testirano:** Playwright **36/36** (ponašanje 1:1, 4 profila, 0 grešaka/overflowa). 
**Stanje:** refaktor gotov, lokalni commit (NIJE deployano). **Sljedeće:** Marketing — dodati T7/T8 u 1. kolokvij,
pa 2. kolokvij (T9–T13), pa finalni.

---

## 2026-06-03 — Sesija 18: Fix BUG-005 (landing hero bedž pod nav-trakom na mobitelu)
**Kontekst:** Korisnik javio (screenshot s iPhonea) da bedž "Free exam toolkit" stoji ispod
fiksne gornje trake. Dogovorena Opcija B (čisti CSS, jedinstveni izvor visine trake).

**Dijagnoza (Playwright + computed styles):** hero `padding-top` na mobitelu = **24px**,
traka ~63px → bedž na y=24 pod trakom. `--nav-h` definiran, ali `calc()` iz `landing.css`
pregazio `css/responsive.css` (`@media ≤767px .landing-hero { padding-top: 1.5rem }`, učitava se zadnji).
Pravi uzrok ≠ flexbox (hero nije collapsan) → izvorni override iz vremena prije fiksne trake.

**Napravljeno**
- `variables.css`: `--nav-h: 72px` (jedinstveni izvor visine fiksne trake).
- `landing.css`: hero `padding-top` + sekcijski `scroll-margin-top` = `calc(var(--nav-h) + safe + jastuk)`;
  logo `white-space:nowrap`; `@media ≤480px` slim nav (padding/CTA/logo) da traka ostane ≤ --nav-h.
- `responsive.css`: mobilni `.landing-hero` override vezan uz `--nav-h` (bio fiksni 1.5rem = uzrok).
- `landing.spec.js`: regresijski test "hero badge clears the fixed top nav" (`badge.top ≥ nav.bottom`).
- Cache bump `?v=20260606` (variables/landing/responsive css + styles.css token u index.html). BUG-005 zabilježen.

**Testirano:** Puni Playwright suite **36/36** (4 iPhone profila; badge test zelen na svima). verify 0 grešaka.
**Stanje:** Fix gotov i dokazan. **Lokalni commitovi, NIJE deployano** (čeka potvrdu).
**Sljedeće:** deploy fixa (push) → pa Blok B / Tier 2 po dogovoru.

---

## 2026-06-03 — Sesija 17: DEPLOY (M0.5 + landing + lazy-loading idu LIVE)
**Kontekst:** Nakupilo se 13 commitova lokalno (A3 → A4), live je zaostajao na A3.
Pregled + analiza cijelog projekta prije deploya: `git` čisto, `npm run verify` 0 grešaka,
**Playwright 32/32** (4 iPhone profila, problems=0, errors=0). Kod ↔ docovi se slažu.

**Napravljeno**
- `git push origin main` (`f234f68..7c09d19`) → Vercel auto-deploy. Sada LIVE:
  Business Informatics (K1+K2+Final), M0.5 drill-down nav (`#browse-page`) + „čisto i bogato"
  redizajn, landing rebuild + SEO meta, **lazy-loading sadržaja (A4)**.
- Docovi osvježeni (ROADMAP STANJE/Deploy).

**Post-deploy (preporuka korisniku):** hard refresh (Ctrl+F5) na www.sokratstudy.com,
proći Smoke test, provjeriti na pravom iPhoneu (Safari — `color-mix`/`backdrop-filter`),
Network tab: `data-*.js` se NE učitavaju na startu nego tek na otvaranje predmeta.
**Sljedeće:** Blok B (Supabase + Auth + /api) kao temelj vizije, ili Tier 2 (Privacy/FAQ/Contact).

---

## 2026-06-03 — Sesija 16: Lazy loading sadržaja (A4) — ciglu po ciglu
**Cilj:** sadržaj predmeta (~777 KB, 19 datoteka) više se ne učitava na startu, nego tek na
otvaranje predmeta. Ujedno = šav prema backendu (Blok B: `loadSubjectContent` → `/api`).

**Napravljeno (6 cigli, svaka testirana)**
1. `js/content-loader.js` — `loadSubjectContent()` (učita `catalog.content.scripts` predmeta,
   sekvencijalno, keširano; dedup po putanji), `loadScriptOnce`, `isSubjectContentLoaded`, `CONTENT_VERSION`.
2. `initStudyPage` → `async` + `await loadSubjectContent` + loader overlay `#studyLoading` (CSS spinner u pages.css).
3. Maknuti svi statički `data-*.js` `<script>` tagovi iz `index.html` (ostaje `catalog.js` + app moduli).
4. `restoreLastPosition` prosljeđuje spremljenu sekciju kroz `initStudyPage(…, targetSection)` —
   nema više `setTimeout(200)` utrke s async učitavanjem.
5. `tests/lazy-load.spec.js` — dokaz: na startu 0 data-skripti i globalsa; nakon otvaranja predmeta
   global postoji; neotvoreni predmeti i dalje neučitani. (4/4)
6. Docs + commit.

**Testirano**
- Dijagnosticiran i popravljen utjecaj async-init na testove: `responsive.spec.js` i `smoke.spec.js`
  sada čekaju da je sadržaj učitan/renderiran (umjesto fiksnog delaya). (To NIJE bila greška aplikacije.)
- **Puni Playwright suite 32/32 zeleno** (responsive+smoke+sidebar+browse+landing+lazy-load × 4 iPhone profila),
  `subjects=9 problems=0 errors=0`. `npm run verify` 0 grešaka.

**Stanje:** A4 (lazy loading) gotovo i dokazano. Bez deploya (čeka potvrdu).
**Sljedeće:** po dogovoru — Backend (Blok B: Supabase+Auth+/api) kao temelj vizije, ili Tier 2 (Privacy/FAQ/Contact), ili novi predmeti.

---

## 2026-06-03 — Sesija 15: VISION.md + pregled svih docova (priprema za lazy-loading)
**Napravljeno**
- **`docs/VISION.md`** (novo) — dugoročna full-stack vizija zapisana da se ne izgubi:
  5 funkcija (AI tutor, profili, UGC upload→AI, dijeljenje, natjecanje, „donesi svoj ključ"),
  mapirane na Faze 1–4; **mapa ovisnosti** (sve ovisi o Backend+Auth; lazy-loading = šav);
  **6 gating-odluka** (AI trošak, plaćanje/PDV+MoR, autorska prava/moderacija, sigurnost,
  anti-cheat, kapacitet); redoslijed; popis docova koje dodajemo kad faza dođe.
- **Pregled svih `.md`** (na zahtjev): BACKLOG/BACKEND/BUGS aktualni; **TESTING.md osvježen**
  (8→9 predmeta, „Start Studying → drill-down browse" umjesto sidebara, dodani
  `browse.spec.js`/`landing.spec.js`/`sidebar.spec.js`, `npm run verify`).
- VISION uvezan u indekse: `docs/README`, root `README`, `CLAUDE.md`.

**Odluka:** danas radimo preporuku — VISION zapisan + krećemo **lazy-loading** (A4) polako, ciglu po ciglu.
**Sljedeće:** lazy-loading (`loadSubjectContent`) → kasnije Backend (Blok B) kao temelj vizije.

---

## 2026-06-02 — Sesija 14: Landing rebuild („prava stranica") + SEO fix
**Odluka korisnika:** landing ne smije biti „jedan ekran" — treba izgledati kao prava,
kompletna stranica. Tier 1 (struktura/sadržaj) + popravak SEO meta.

**Napravljeno (sve statički, showcase iz catalog-a)**
- **Fixed nav traka:** logo + linkovi (Subjects / How it works / Study modes / About) + „Start studying" CTA;
  na mobitelu se linkovi sklope (logo + Start). Hero offset za fixed nav; `scroll-margin-top` za anchor skok.
- **Hero:** trust red (100% free · No sign-up · Works offline); sekundarni CTA → „Browse subjects".
- **Subjects showcase** (`#subjects`, `renderLandingSubjects()`): grid svih predmeta IZ catalog-a
  (gradijent-ikone, godina + broj lekcija); klik → lekcije. Raste automatski s catalog-om.
- **How it works** (`#how`): 3 koraka. **Study modes** (`#modes`): 5 modova s tintanim ikonama.
- **Završni CTA band** + **strukturiran footer** (brand / Explore / About + copyright). Svi „Start" gumbi (`.start-trigger`) → browse.
- **SEO `<head>`:** točan description/keywords, `canonical`, `og:site_name`, `og:url`/`twitter` → `www.sokratstudy.com`,
  `og:image` → `icon-512.png`, osvježen `<title>`.
- Cache bump `?v=20260605` (landing.css, styles.css, navigation.js, init.js).

**Testirano**
- `tests/landing.spec.js` (novo): nav, showcase = broj predmeta iz catalog-a, 3 koraka, 5 modova, footer,
  klik showcase → lekcije, „Start" → browse, **overflow guard** — 8/8 zeleno.
- Puni Playwright suite (responsive + smoke + sidebar + browse + landing) × 4 iPhone profila: **28/28 zeleno**. verify 0 grešaka.
- Vizualno provjereno (mobile fullPage + desktop): izgleda kao kompletna „prava stranica".

**Stanje:** Landing rebuild gotov (Tier 1 + SEO). Bez deploya (čeka potvrdu).
**Sljedeće (Tier 2):** Privacy Policy + Contact + FAQ (bitno za Google Ads) → ostali predmeti 1. god → Blok B.

---

## 2026-06-02 — Sesija 13: M0.5 — puni drill-down navigacija + „čisto i bogato" redizajn
**Odluka korisnika:** frontend prvo (prije novih predmeta); stil = **„čisto i bogato"
(Brilliant/Quizlet), NE preminimalistički** — „prava stranica". Puni eksplicitni drill-down:
Fakultet → Smjer → Godina → Predmet (sve iz catalog-a, spremno za širenje).

**Napravljeno**
- `SokratCatalog` helperi (data/catalog.js): `faculties()`, `programsOf()`, `yearsOf()`,
  `subjectsOf()`, `semestersOf()`, `isLessonComingSoon()` — hijerarhija izvedena iz catalog-a.
- Nova `#browse-page` (index.html) + `css/browse.css` (bogate kartice, gradijent-ikone,
  breadcrumb, progress bar, coming-soon stanje, responsive grid).
- `js/navigation.js`: `renderBrowse()` (po razinama faculties→programs→years→subjects),
  `initBrowse()` (delegirani click), `browseBack()`, `enterBrowse()`, `renderLandingMeta()`.
  CTA „Start Studying" → browse; back s Lessons → popis predmeta (čuva poziciju).
- `renderLessonsPage()`: coming-soon sada data-driven (`isLessonComingSoon`).
- Landing: dinamičan broj predmeta (`data-meta="subjectCount"` → 9), osvježen copy (Year 1 & 2).
- Sidebar = legacy fallback (markup/kod ostaje, nije primarni ulaz).
- Cache bump `?v=20260604` (catalog.js, navigation.js, init.js, variables.css, styles.css, browse.css).

**Testirano**
- `tests/browse.spec.js` (novo): puni drill-down + Year 1 BI + back + **overflow guard** — 8/8 zeleno.
- Puni Playwright suite (responsive + smoke + sidebar + browse) na 4 iPhone profila: **20/20 zeleno**, subjects=9, problems=0, 0 JS grešaka.
- `npm run verify`: 0 grešaka. Vizualna provjera screenshotovima (landing/faculties/years/subjects) — izgled uglađen.

**Stanje:** M0.5 navigacija + redizajn browse/landing **gotovo** (ADR-007 ✅, A5 ✅). Bez deploya (čeka potvrdu).
**Sljedeće:** ostali predmeti 1. godine (kad stignu materijali) → Blok B (Supabase). Po želji: redizajn unutarnjih study/lessons ekrana.

---

## 2026-06-02 — Sesija 12: CLAUDE.md + sinkronizacija svih docova
**Napravljeno**
- Dodan `CLAUDE.md` (root) — auto-učitava se svaku sesiju (preživljava /compact).
  Objašnjeno: MORA biti u rootu da se auto-učita (pod-mapni se ne učita globalno).
- Sinkronizirani svi docovi sa stvarnim stanjem:
  - ROADMAP: dodan "📍 STANJE" sažetak (done/next); A1–A3 ✅, A4/A5 spojeni u M0.5; BI pilot ✅.
  - PRD: trenutno stanje (data-driven + BI), backend = Vercel Functions + Supabase.
  - ARCHITECTURE: statusi A1–A5, backend hosting, 1. god BI dodan.
  - README (root) + docs/README: CLAUDE.md, BACKEND, CONTENT_INTAKE, 1. god BI.
**Bez koda/deploya** (samo dokumentacija).

---

## 2026-06-03 — Sesija 11: Business Informatics KOMPLETAN (K1 + K2 + Final)
**Napravljeno**
- K1 (Ch1–6) i K2 (Ch7–11) generirani iz PDF-ova, vjerno gradivu:
  - M1: systemApproach, dataInfoKnowledge, hardware, software, networks, www
  - M2: eBusiness, itTrends, managementSupport, expertSystems, security
- `final.js` = Object.assign(M1, M2) → 11 kategorija (završni = oba kolokvija).
- Catalog: 3 lekcije (midterm-1, midterm-2, final) + content.scripts/resolve.
- index.html: m1/m2/final skripte (final POSLIJE m1+m2).

**Testirano**
- verify 0 grešaka; node final-merge = 11 kategorija.
- Browser (iPhone 15Pro): M1=6, M2=5, Final=11 kartica; 0 overflow; 0 pageerrors.
- Smoke subjects=9 problems=0.

**Stanje:** BI gotov (pilot uspješan — content pipeline radi). Bez deploya (lokalni pregled).
**Sljedeće:** redizajn + drill-down nav (M0.5), pa drugi predmeti.

---

## 2026-06-03 — Sesija 10: pilot Business Informatics (CH1 uzorak)
**Napravljeno**
- PDF čitanje preko slika (pdftoppm) nedostupno → riješeno ekstrakcijom teksta:
  `scripts/pdf-text.js` + `pdf-parse` (devDep). Radi za tekstualne PDF-ove.
- Iz introductory utvrđeno: 15 cjelina (U1–U15), 2 kolokvija + završni. Poglavlja
  CH1–11 = teorija (U1–U11); U12–U15 praktične vježbe. **Korisnik potvrdio raspodjelu:**
  K1 = Ch1–6, K2 = Ch7–11, **završni = oba kolokvija zajedno** (merge).
- Kreiran `data/business-informatics/midterm-1.js` s CH1 (System Approach & Informatics):
  9 flashcards, 5 quiz, 4 fill, learn HTML — vjerno PDF-u. Catalog unos (year 1, sem 1),
  index.html wiring (?v=20260603).
- `verify-catalog.js` poopćen (uklonjena stara A2 usporedba) → sad opći validator.

**Testirano**
- `npm run verify` → 0 grešaka (9 predmeta). Smoke (iPhone 15Pro) subjects=9, problems=0.
- Screenshot BI Learn (CH1) → uredno, čitljivo, vjerno gradivu.

**Čeka korisnika:** potvrda stila/dubine CH1 → onda Ch2–6 (K1), pa K2 + final merge.
**Bez deploya** (pilot za lokalni pregled).

---

## 2026-06-02 — Sesija 9: analiza 1. godine + plan M0.5 (hijerarhija + redesign)
**Analiza materijala (samo pregled, ništa dirano):**
- `C:\...\Documentos\1. godina Hospitality Managament`: 11 predmeta, ~168 datoteka
  (100 JPG + 68 PDF). 4 predmeta još prazna. Math je formule/JPG (rizik za točnost).
- Procjena: 1. god. do ~33 lekcije; sa 2. god. = ~19 predmeta za smjer.

**Odluke/plan:**
- Dodan `docs/CONTENT_INTAKE.md` (kako slagati materijale: PDF>JPG, po predmetu/kolokviju,
  Math caveat) + `_materials/` u .gitignore.
- Novi milestone **M0.5** u ROADMAP: hijerarhijska navigacija (Fakultet→Smjer→Godina→
  Predmet) + minimalistički frontend redesign (logo se zadržava), PRIJE masovnog unosa.
- Catalog data-model već podržava hijerarhiju (faculties/programs/year/semester).

**Odlučeno:** navigacija = PUNI drill-down (ADR-007), dark minimalistički, logo ostaje.
**Čeka korisnika:** semestar-mapping za 11 predmeta 1. godine (koji su zimski/ljetni).
**Bez koda ove sesije (planiranje).** Sljedeće: K2 coming-soon → catalog 1.god stubovi → puni drill-down nav → redesign.

---

## 2026-06-02 — Sesija 8: priprema za masovni sadržaj (struktura + template)
**Kontekst:** korisnik uskoro dodaje cijelu 1. godinu (po predmetu k1/k2/završni).
Dogovoreno: autorstvo u datotekama SADA (migracijski sigurno), uz alate za kvalitetu.
Tok rada: korisnik donese PDF materijale → ja generiram gradivo po schemi → pregled.

**Napravljeno (korak 1: struktura + template)**
- `data/_template/lesson.template.js` — kalup lekcije (komentiran, po CONTENT_SCHEMA).
- `scripts/scaffold-subject.js` — `npm run scaffold -- <id> "<Naziv>" <god> <sem>`
  kreira `data/<id>/{midterm-1,midterm-2,final}.js` + ispiše gotov catalog unos.
- npm: `verify` (sad = catalog check; korak 3 proširuje na sadržaj), `scaffold`.
- CONTENT_GUIDE: standardna struktura (mapa/predmet, datoteka/lekcija) + scaffold.
- ADR-006. Postojeći predmeti se NE prepravljaju.

**Testirano**
- Scaffold na probnom predmetu → `node --check` valjan na sve 3 generirane datoteke; obrisano.

**Sljedeće (preporuka prije masovnog sadržaja)**
- Korak 2: "coming-soon" lekcije iz catalog-a (umjesto hardkodiranog 'second-midterm').
- Korak 3: validator sadržaja (`npm run verify` provjerava CONTENT_SCHEMA).
- Korak 4: lazy-load seam (`loadSubjectContent`).

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
