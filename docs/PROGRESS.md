# Progress Log

Dnevnik rada. Najnoviji unos na vrhu. Svaka sesija: što je napravljeno, što je
testirano, što slijedi.

---

## 2026-06-09 — Sesija 27: Economics in Hospitality 1. kolokvij — pregled + veliki rebuild iz izvora
**Kontekst:** Korisnik dodao prave PDF-ove u `2. godina Hospitaliy Managament/Economics of hospitality`
(intro + Unit 1–10; Unit 6–10 imaju „add"). Zadatak: napravi **samo 1. kolokvij**, pregledaj postojeći i prepravi.

**Analiza izvora:** intro (`1 Introductory information 2026.pdf`) daje silabus — **T7 = 1. midterm**, T13 = 2. →
**1. kolokvij = T2–T6 = Unit 1–5** (Basics · Business economics · Hospitality business · Assets of reproduction ·
Cost theory). Potvrđeno „do 5 / na pola" (10 prezentacija). Ekstrakcija teksta (`scripts/pdf-text.js`) za svih 5 + intro.

**Nalaz:** postojeća struktura (5 jedinica) **se točno poklapa** s T2–T6 i sadržaj je bio **točan, ali pretanak**
(~15–25% pokrivenosti; Unit 3/4/5 = 48–55 slajdova s velikim izostavljenim cjelinama). Catalog opis 1. kolokvija
bio **pogrešan** („seminarski: sezonalnost/konkurentnost" — to je zaseban seminar, ne predavanja).

**Napravljeno**
- **Rebuild `data-econ-hospitality.js`** vjerno slajdovima: **30→73 flashcards · 20→46 quiz · 15→36 fill** + bogat learn.
  Dodano što je falilo: U2 povijesni razvoj (Savary 1675, Smith 1776, Marshall, Schmalenbach 1906, Taylor/Ford/Fayol,
  socijalistička ekonomika); U3 asocijacije/koncentracija (sinergija „2+2=5", konzorcij, kartel, konglomerat, holding,
  trust), poslovna načela (produktivnost/ekonomičnost/rentabilnost + kontinuitet), poslovna politika i planiranje;
  U4 likvidnost (>1)/solventnost, koef. obrtaja, **amortizacijski rokovi po hrv. zakonu** (20/10/5/4/2 god), metode
  (linearna `a%=100/t`, progresivna, degresivna, funkcionalna), tekuće/investicijsko održavanje; U5 mjesta/nositelji
  troška, direktni/indirektni, aktivni/pasivni centri, fiksni 60–80% hotelskih troškova, **zone troškova**,
  **koef. reaktivnosti `h=T%/Q%`**, model materijalnih troškova 35/22/50%, **break-even**, funkcionalna analiza.
- **Catalog opis** 1. kolokvija ispravljen na stvarni (Unit 1–5). Cache: `CONTENT_VERSION` 20260609→**20260613** +
  bump `catalog.js`/`content-loader.js` `?v=20260613` (index.html).

**Testirano:** strukturni node-check (5 kat., 73/46/36, svi `correct` u rasponu = 0 bad); `verify` 0 grešaka;
Playwright (smoke testira PRVU lekciju = econ first-midterm). 2. kolokvij (Unit 6–10) NIJE rađen (po dogovoru).
**Stanje:** lokalni commit (NIJE deployano).

---

## 2026-06-06 — Sesija 26: Ispravak catalog-a — „Entrepreneurship and Innovation" (sem 1)
**Kontekst:** Korisnik javio da je predmet zapravo **„Entrepreneurship and Innovation"** (ne „Business
Entrepreneurship") i da je u **1. semestru** 2. godine (bio krivo upisan kao sem 2).

**Napravljeno (`data/catalog.js`):** `name` → „Entrepreneurship and Innovation", `semester: 2 → 1`.
**`id: 'entrepreneurship'` NIJE diran** → `storageKey`/napredak korisnika i sve reference očuvane; sadržaj
lekcija nepromijenjen. Navigacija (browse, data-driven) ga sad sama prikazuje pod Sem 1. Bump `catalog.js?v=20260612`
(index.html). Usklađeni `README.md`, `package.json`, `docs/ARCHITECTURE.md` (povijesni PROGRESS zapisi se ne diraju).

**Testirano:** `verify` 0 grešaka (ispisuje „Entrepreneurship and Innovation"); **Playwright 36/36**.
**Stanje:** lokalni commit (NIJE deployano) — ide u isti deploy paket kao BUG-008.

---

## 2026-06-06 — Sesija 25: Fix BUG-008 (globalni footer + toast bez baznog CSS-a)
**Kontekst:** Korisnik javio (screenshot) da „© 2026 All Rights Reserved by Leon Kreso" stoji ružno lijevo-dolje
preko sadržaja na svim stranicama (Landing ima i svoj footer → duplikat); tik iznad i toast „ⓘ Message".

**Dijagnoza:** bazni CSS za `.toast` i `.footer` **ne postoji** (u `css/` samo responsive override-i — vjerojatno
izgubljeno u ranijem refaktoru). Bez baze: toast (koji `showToast()` toggla preko `.show`) = stalni goli blok;
globalni `<footer>` (sibling svih stranica) = goli copyright blok na dnu svake stranice.

**Napravljeno (`css/pages.css`):** bazni `.toast` (fiksan, `opacity:0`+`pointer-events:none`, otkriva se `.show`) +
bazni `.footer` (centriran, suptilan, `border-top`); globalni footer **skriven na Landing/Browse** preko
`body:has(.landing-page.active) .footer` / `:has(.browse-page.active)`. Bump `pages.css`/`styles.css` `?v=20260611`.

**Testirano:** verify 0; ciljani temp-test (4 profila, obrisan): footer `display` landing=none/browse=none/**study=block**;
toast `opacity=0`, `position=fixed`, bez `.show`; puni suite **36/36**.
**Stanje:** BUG-008 ✅ riješen, lokalni commit (NIJE deployano — pitati korisnika za deploy).

---

## 2026-06-06 — Sesija 24: Fix BUG-007 (learn filter-bar — rezanje na rubovima + skriven scroll)
**Kontekst:** Nakon BUG-006 (puni nazivi), korisnik javio da bar i dalje reže čipove na rubovima (lijevo pola,
desno „Promotic…") i nema naznake skrola. Odluka (AskUserQuestion): **Opcija B** — zadržati skrol + dodati naznake.

**Uzrok:** (1) `justify-content:center` na skrolabilnom `.learn-filter` (`learn.css`, `@media ≥1024px`) gurao prve
čipove preko lijevog ruba (nedohvatljivo skrolom) → trajni lijevi rez. (2) Skriven scrollbar → nema afordancije.

**Napravljeno**
- `css/learn.css`: tanak **vidljiv scrollbar** (`scrollbar-width:thin` + webkit thumb 6px); **rubni fade**
  preko `mask-image` (klase `.can-scroll-left/right`); `.learn-filter.is-scrollable { justify-content:flex-start }`
  — gazi `center` SAMO kad bar prelazi širinu (kratke liste i dalje centrirane).
- `js/progress.js`: `updateLearnFilterScrollHints()` (postavlja is-scrollable/can-scroll-* iz `scrollLeft`/`scrollWidth`),
  pozvan iz `updateLearnFilters` + vezan na `scroll` i **`ResizeObserver`** (hvata i prijelaz skriveno→vidljivo).
- Cache: bump `learn.css` (@import u styles.css) + `styles.css?v=` + `progress.js?v=` → **20260610**.

**Testirano:** verify 0; ciljani temp-test (obrisan; 4 iPhone profila + **desktop 1280px**): start `can-scroll-right`,
kraj `can-scroll-left`, **prvi čip nije odrezan** (`firstLeftClip=0`), desktop `justify=flex-start`, `pageOverflow=false`;
puni suite **36/36**.
**Stanje:** BUG-007 ✅ riješen, lokalni commit (NIJE deployano) — ide u isti deploy paket.

---

## 2026-06-06 — Sesija 23: Fix BUG-006 (learn filter-bar rezao nazive kategorija)
**Kontekst:** Korisnik prijavio (screenshot, Marketing → Final Exam) da su čipovi u gornjem learn-baru
nečitljivi: „The" (= The Product), „Price" (= The Price), „Segmentati", „Distributi".

**Dijagnoza:** `updateLearnFilters()` (`js/progress.js`) radio „shortName" = prva riječ naziva rezana na
10 znakova (uz 2.-riječ fallback). Latentno otprije (kratki nazivi OK); Marketing finalni (13 kat., „The X"
i višerječni nazivi) razotkrio. **Kozmetički, ne funkcionalni** — `data-filter` = puni ključ, filtriranje radilo.

**Popravak (Opcija A, izbor korisnika):** čip = **puni `data.name`**. Bar je već `overflow-x:auto` + nowrap →
dugi nazivi skrolaju, ne lome layout. Uklonjena `usedNames`/`substring` logika. Bump `progress.js?v=20260609`.
Globalno (svi predmeti dobivaju čitljive čipove).

**Testirano:** verify 0; ciljani temp-test (4 profila): čipovi = puni nazivi, `pageOverflow=false`; puni suite **36/36**.
**Stanje:** lokalni commit (NIJE deployano) — ide u isti deploy paket kao Marketing. BUG-006 zabilježen.

---

## 2026-06-06 — Sesija 22: Marketing FINALNI ispit (T1–T13) — hibrid (spoj + Exam Practice)
**Kontekst:** Nakon K1 (S20) i K2 (S21), korisnik: kreni na finalni. Odluka strukture (AskUserQuestion):
**HIBRID** = spoj svih kategorija K1+K2 **+** dodatna kurirana „Exam Practice" kategorija kroz sve teme.

**Pristup (arhitektura):** novi `data-marketing-final.js` → `window.marketingFinalData` =
`Object.assign({}, window.marketingData, window.marketingM2Data, { examPractice })` (uzor: BI `final.js`).
**MORA se učitati ZADNJI** (čita prethodne dvije varijable) → catalog `scripts` ga stavlja na kraj.

**Napravljeno**
- `data-marketing-final.js`: merge 12 postojećih (PROVJERENIH) kategorija + nova **`examPractice`**
  („Exam Practice (All Topics)") = cross-topic capstone: **12 flashcards · 10 quiz · 8 fill** + learn
  „Final Exam Roadmap" (poveznice: 4P+3P, PLC↔price/promo, push/pull↔promo/distrib, STP↔mix, plan→organize→control).
- `catalog.js`: nova lekcija `final` („Final Exam"); `scripts` += `data-marketing-final.js` (ZADNJI);
  `resolve.final = marketingFinalData`.
- Cache: `CONTENT_VERSION` 20260608 → **20260609**; bump `?v=20260609` (`content-loader.js`, `catalog.js`).

**Testirano:**
- `node --check` OK · `npm run verify` **0 grešaka** (final → `marketingFinalData` deklariran + na window).
- **Strukturni validator** (privremen, obrisan; učitao K1+K2+final redom): **13 kategorija**
  (12 spojenih + examPractice), **113 flashcards · 66 quiz · 56 fill**, svi quiz indeksi valjani,
  svi fill imaju `_______`, learn neprazan → **0 problema**.
- **Ciljani 'final' render-test** (privremen, obrisan; sve sekcije × 4 iPhone profila):
  **0 problema, 0 grešaka, 0 overflowa, quizOptions=14** (All + 13 kat.) → potvrda da runtime-merge radi.
- Puni Playwright suite **36/36**.

**Stanje:** **Marketing KOMPLETAN** — K1 (T1–T8) ✅, K2 (T9–T13) ✅, Finalni ✅ (sve lokalno, NIJE deployano).
**Sljedeće:** spreman **deploy cijelog Marketing paketa** (uz potvrdu korisnika) zajedno s ranijim
lokalnim commitovima (responsive split, KaTeX docovi). Pa dalje sadržaj (1.+2. god) → Blok B.

---

## 2026-06-05 — Sesija 21: Marketing 2. kolokvij (T9–T13) — `second-midterm` popunjen
**Kontekst:** Nakon dopune 1. kolokvija (S20), korisnik: kreni na 2. kolokvij, **finalni NE dirati još**.
2. kolokvij = T9 → kraj (potvrđeno ranije).

**Pristup (arhitektura):** novi **sibling fajl** `data-marketing-m2.js` → `window.marketingM2Data`
(isti obrazac kao te2: `data-te2-final.js`/`te2FinalData`). Catalog `second-midterm` → `marketingM2Data`.
Stari `data-marketing.js` (K1) netaknut.

**Napravljeno (ciglu po ciglu)**
- Ekstrakcija 4 izvora: `TJ 9_The distribution` (27 str.) · `10_The promotion` (33) ·
  `11_New trends in promotional activities` (31) · `12_13_Planning_Organizing_Controlling` (27).
- `data-marketing-m2.js` — **5 kategorija** po `CONTENT_SCHEMA`:
  `distribution` · `promotion` (IMC) · `newTrendsPromotion` · `marketingPlanning` · `organizingControlling`.
  Ukupno **45 flashcards · 25 quiz · 20 fill · 5 learn**. (T12+T13 namjerno razdvojeni na Planning vs
  Organizing&Controlling radi ravnoteže/pedagogije.)
- `catalog.js`: `scripts: ['data-marketing.js','data-marketing-m2.js']`, `resolve.second-midterm = marketingM2Data`,
  opis lekcije (Topics 9–13) — **coming-soon uklonjen**.
- Cache: `CONTENT_VERSION` 20260607 → **20260608**; bump `?v=20260608` (`content-loader.js`, `catalog.js`).

**Testirano:**
- `node --check` OK · `npm run verify` **0 grešaka** (second-midterm → `marketingM2Data` deklariran + na window).
- **Strukturni validator** (privremena skripta, obrisana): 5 kat. / 45 fc / 25 quiz / 20 fill, svi quiz `correct`
  indeksi valjani, svi fill imaju `_______`, learn neprazan → **0 problema**.
- Playwright **36/36** (puni suite). **Napomena:** smoke/responsive testiraju PRVU lekciju s podacima po
  predmetu (za marketing = `first-midterm`), pa K2 ne renderiraju vizualno → dodan **ciljani temp-test**
  baš za `second-midterm` (sve sekcije × 4 iPhone profila): **0 problema, 0 grešaka, 0 overflowa,
  quizOptions=6** (All + 5 kat.); zatim obrisan.

**Stanje:** 2. kolokvij Marketinga **kompletan (T9–T13)**, lokalni commit (NIJE deployano).
**Sljedeće (NE krećem bez naloga):** **Finalni** = spoj K1 (T1–T8) + K2 (T9–T13), NOVA lekcija u catalogu
(uzor: BI `Object.assign`/te2 zaseban final). Korisnik izričito rekao da finalni još NE radim.

---

## 2026-06-05 — Sesija 20: Marketing 1. kolokvij dopunjen (T7 Product + T8 Price)
**Kontekst:** Postojeći `data-marketing.js` imao samo 5 tema (T1,T2,T3,T5,T6); 1. kolokvij = T1–T8 →
**falili T7 (Product) i T8 (Price).** Korisnik: popraviti 1. kolokvij prvo, pa stati prije 2. kolokvija.

**Napravljeno (ciglu po ciglu)**
- Ekstrakcija izvora: `TJ 7_The product` (28 str.) + `TJ 8_The price` (21 str.) preko `scripts/pdf-text.js`.
- Dvije nove kategorije u `data-marketing.js` po `CONTENT_SCHEMA` (1:1 stil postojećih):
  - **`product`** ("The Product"): 9 flashcards · 5 quiz · 4 fill · learn (total product concept, B2C/B2B
    klasifikacija, product programme, elementi/brand, NPD proces, difuzija, životni ciklus + odgovori, usluge + 3P).
  - **`price`** ("The Price"): 9 flashcards · 5 quiz · 4 fill · learn (atributi/ciljevi, interni/eksterni faktori,
    fiksni/varijabilni troškovi, kanal-markupi, tržišne strukture, cjenovne strategije, metode: cost/demand/competitor).
- `catalog.js`: osvježen opis (Marketing sad „Topics 1–8"); subject description proširen (product, price).
- Cache: `CONTENT_VERSION` 20260603 → **20260607** (busta lazy-loadane data-fajlove); bump `?v=20260607`
  za `content-loader.js` + `catalog.js` u `index.html`.

**Testirano:** `node --check` OK · `npm run verify` **0 grešaka** · Playwright **36/36** (smoke testira nove
T7/T8 kroz sve sekcije × 4 profila; marketing `✓ ok`, 0 page-overflowa — tablice/filter skrolaju interno kao
kod postojećih predmeta).
**Stanje:** 1. kolokvij Marketinga **kompletan (T1–T8)**, lokalni commit (NIJE deployano).
**Sljedeće (čeka potvrdu korisnika):** 2. kolokvij = T9–T13 (Distribution, Promotion, New trends, Planning,
Organizing & Controlling) → popunjava `second-midterm`; pa finalni (merge K1+K2).

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
