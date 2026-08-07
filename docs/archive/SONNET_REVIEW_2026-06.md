# Analiza projekta — Claude Sonnet 4.6
> Datum: 2026-06-28. Ovo je moje (Claude Sonnet 4.6) mišljenje o projektu Sokrat Study
> nakon čitanja svih ključnih fajlova: index.html, svih js/*, css/*, data/catalog.js,
> vercel.json, package.json, tests/*, scripts/*, docs/records/BUGS.md, docs/plan/ROADMAP.md i CLAUDE.md.

---

## Opći dojam

Projekt je arhitekturalno čist i dobro dokumentiran za solo-developera vanilla JS projekta ove veličine.
Catalog kao jedini izvor istine, lazy-loading, Supabase fallback, exercises engine sa 7 tipova —
sve to pokazuje zrelost. Dokumentacija (CLAUDE.md, docs/) je iznimna.

---

## 🔴 Ozbiljni problemi

### 1. Nema Service Workera — ali stranica tvrdi „Works offline"
`manifest.json` postoji, ali nema nijednog SW registriranog. Bez SW-a „offline mode" znači samo
što browser sam kešira. Supabase JS CDN i sadržaj iz baze **neće raditi bez mreže**. Fallback na
datoteke radi samo ako supabase-js klijent uopće odgovori `null`, ali i on sam dolazi s CDN-a.
Treba registrirati bar minimalni Workbox/cache-first SW koji kešira `index.html`, sve `js/`, `css/`
i `data/` datoteke.

### 2. Nema `Content-Security-Policy` headera u `vercel.json`
Postoje `X-Frame-Options` i `X-Content-Type-Options` — ali nema CSP-a. Trenutno nema akutnog
rizika jer je sadržaj statički/trustiran, ali:
- Kad dođe UGC (3./4. godina, roadmap §B3), **XSS bez CSP-a je direktna rupa**
- Trebalo bi dodati bar:
  ```
  default-src 'self';
  script-src 'self' cdnjs.cloudflare.com cdn.jsdelivr.net fonts.googleapis.com www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com;
  font-src fonts.gstatic.com cdnjs.cloudflare.com;
  ```

### 3. `X-XSS-Protection: 1; mode=block` je deprecated header
Chrome, Firefox i Edge su **uklonili** XSS auditor. Ovaj header sada ne radi ništa pozitivno,
a u nekim starim browserima može uzrokovati DoS. Treba ga maknuti iz `vercel.json`.

---

## 🟡 Srednje prioritetni problemi

### 4. `lessonCategoryMap` u `config.js` je mrtav kod
```js
const lessonCategoryMap = {
    'entrepreneurship': {
        'second-exam-prep': [...],  // stari ID koji više ne postoji u katalogu
        'final-exam-prep': null
    }
};
```
Entrepreneurship lekcije sada imaju IDs `first-midterm`/`second-midterm`/`final`.
Ovaj objekt nije u upotrebi nigdje u novom kodu — samo zbunjuje. Treba obrisati.

### 5. „400+ Questions" u heroju je zastarjelo za 6×
U `index.html` (3 mjesta) hardkodirano `400+` — ali s 17 predmeta i prosječno 120+ flashcarda
svaki, stvarni broj je **~2000+ flashcards** (s quiz i fill kombiniranim prelazi 3000+).
`subjectCount` se već dinamički računa iz kataloga — `questionCount` se isto može izračunati,
ne mora biti ni egzaktan.

### 6. `innerHTML` s HTML stringovima iz data fajlova
U `js/learn.js` (linija ~37):
```js
card.innerHTML = `...${learnContent}...`  // learnContent je raw HTML string iz data fajla
```
I u `js/fill-blanks.js` (~65): `innerHTML = sentenceWithBlank`.

Trenutno je **sigurno** jer su data fajlovi trustiran autorski sadržaj. Ali `browseEsc()` i `esc()`
(koje se već koriste za navigacijske elemente) nisu primijenjeni na learn sadržaj. Kad dođe UGC —
treba **DOMPurify** ili ekvivalent prije bilo kojeg `innerHTML` s korisničkim inputom.

### 7. Font loading bez `display=swap`
Google Fonts URL-u u `index.html` nedostaje `&display=swap`. Bez toga prikaz teksta kasni dok
se font ne preuzme → loš LCP/FCP na sporim vezama. Treba dodati na kraj URL-a:
```
&display=swap
```

### 8. 23 CSS `@import` u `styles.css`
HTTP/2 multiplexuje ih, ali svaki `@import` je **blokiran** dok prethodni ne završi (CSS spec).
Sa 23 importa, parsiranje styles.css može kasniti FCP na sporim mobilnim uređajima.
Rješenje: konkateniraj sve CSS fajlove u build koraku (`npm run build:css` s `cat` ili `cleancss`).

### 9. `loadProgress()` — JSON.parse bez schema validacije
```js
progress = JSON.parse(saved);  // direktno, bez provjere strukture
```
Ako je localStorage corrupted, ili student ima staru strukturu podataka (stara verzija apke),
app može primiti `undefined` polja i crashati tiho. Treba bar merge s default objektom:
```js
const parsed = JSON.parse(saved);
progress = { ...defaultProgress, ...parsed };
```

### 10. Globalni state bez namespacea
~15 globalnih varijabli (`currentSubject`, `currentLesson`, `currentData`, `flashcards`,
`quizQuestions`...) razbacano po `config.js`. Sve funkcije u 15 fajlova ih direktno čitaju/pišu.
Funkcionira sad, ali kako projekt raste (admin CRUD, AI tutor, UGC), postaje teže debuggati.
Prijedlog: grupirati u jedan `AppState = { current: {}, study: {}, quiz: {} }` objekt.

---

## 🟢 Nice-to-have / dugoročno

### 11. `CONTENT_VERSION` bump je manual u 3 mjesta
`content-loader.js` + `index.html` (`styles.css?v=`) + svaki `css/*.css?v=` u `styles.css`.
Ako se zaboravi → stari cache ostaje živ (BUG-004 pattern). Prijedlog: `scripts/bump-version.js`
koji generira verziju iz git-hasha ili timestamp-a i zamijeni sve `?v=` tokene odjednom.

### 12. `flashcardListenersInitialized` flag se ne resetira
U `flashcards.js` ovaj boolean sprječava duplikate listenera, ali ako se komponenta ikad
remountira (npr. buduća dinamična navigacija), neće se ponovo inicijalizirati. Čišće rješenje:
`removeEventListener` pri cleanup-u ili `{ once: false }` s explicit cleanup-om.

### 13. Streak logika je timezone-osjetljiva
```js
const today = new Date().toDateString();
```
Student koji studira u ponoć može imati streak problem (streak se resetira/inkrementira na kriva
dan). Rješenje: koristiti UTC datum-check ili `toLocaleDateString('hr')` s eksplicitnim timezonom.

### 14. Nema `Referrer-Policy` ni `Permissions-Policy` headera
Preporučeni minimum za GDPR i privatnost. Dodati u `vercel.json`:
```json
{"key": "Referrer-Policy",   "value": "strict-origin-when-cross-origin"},
{"key": "Permissions-Policy","value": "camera=(), microphone=(), geolocation=()"}
```

### 15. PWA manifest — `purpose: "any maskable"` na istoj ikoni nije idealno
Maskable ikone trebaju imati sigurnu zonu (safe zone) od 40% — ako ikona ima sadržaj do ruba,
bit će odrezana na nekim Android launcherima. Idealno: odvojena `maskable` ikona s paddingom,
odvojena `any` ikona bez paddinga.

---

## Što je odlično (da se zna što radi dobro)

| Stvar | Zašto je dobro |
|---|---|
| Catalog arhitektura | Dodavanje novog predmeta/programa = 0 promjena u engineu |
| BUG-012 fix (codeScripts) | Elegantna separacija kod/podatak, rješava JSON-stringify problem |
| `browseEsc()` / `esc()` | Dosljedno korišteni na svim dinamički renderiranim elementima |
| Exercises engine | 7 tipova, randomizacija, 0 promjena za novi sadržaj, node-testiran |
| Cloud sync merge logika | „unija/max" nikad ne briše napredak, offline-first |
| KaTeX currency-safe delimiteri | Riješen netrivijalan problem (`\( \)` umjesto `$`) |
| `content-loader.js` kao šav prema backendu | Zamjena `loadScriptOnce` s `fetch('/api/...')` = jedina promjena |
| GDPR consent (Consent Mode v2) | GA4 se učitava TEK na Accept, default DENIED |
| Dokumentacija | CLAUDE.md + docs/ su iznimni za solo projekt |

---

## Top 3 akcije koje bi odmah napravio

1. **Maknuti `X-XSS-Protection`** + dodati `Referrer-Policy`/`Permissions-Policy` u `vercel.json` (5 min, nema rizika)
2. **Obrisati mrtvi `lessonCategoryMap`** iz `config.js` (čišći kod, nema rizika)
3. **Ažurirati „400+"** u heroju na dinamički izračun iz kataloga — kao što je `subjectCount` (10 min, vidljiv utjecaj na landing)
