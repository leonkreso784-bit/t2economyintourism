# Predmeti — stanje sadržaja (autoritativna tablica)

> **Ovo je trajni dom za "koji predmet ima što".** Izvor: CLAUDE.md povijest (pred-reorg 2026-07-08) + docs/PROGRESS.
> Brojevi = **finalna lekcija** (hibrid K1+K2+examPractice). Ažuriraj OVDJE kad se predmet mijenja.

## Invarijante (vrijede za sve predmete)
- Svaki predmet = **3 lekcije**: `first-midterm` / `second-midterm` / `final` (final = `Object.assign(M1, M2, {examPractice})`, učitava se **ZADNJI**).
- **JSON dual-read**: study sadržaj se čita DB → `data/json/<id>/*.json` → `.js` fallback. Datoteke = izvor istine do F4.6 flipa. ⚠️ **Pokrivenost se ne prepisuje ovamo** — drži ju gate `npm run export:json -- --check` (u preflightu): JSON postoji za **svaki** migrirani predmet ili CI pada. *(Ovdje je do 2026-08-29 stajalo „18/18", a na disku ih je bilo 24.)*
- **Vježbe = JS moduli** (`data/<id>/exercises.js` + lib), NIKAD u bazu/JSON (BUG-012); učitavaju se preko `content.codeScripts`.
- Baza `subject_content`: **svi EN predmeti × 3 lekcije**; **HR klon-program NIJE u bazi** (ide s JSON/datoteka dok program ne bude potpun — ADR-012/022).
  ⚠️ **ISPRAVLJENO 2026-08-29:** ovdje je stajalo *„accounting nije u bazi"*. **Neistina** — provjereno upitom, `accounting` ima svoja tri reda kao i svi ostali. Tvrdnja je bila zapisana prije njegove migracije i nikad povučena, a slala je na krivi trag pri svakom debugiranju read-patha. Živu brojku daje `select count(*) from subject_content`, ne ova proza.
- Kvantitativni predmeti = **KaTeX** (ADR-009; currency-safe delimiteri `\( \)` / `\[ \]` / `$$ $$`, NIKAD jedan `$`).

## 2. godina HM — 8/8 KOMPLETNO i LIVE

| Predmet | ID | Sem | Final: kat/fc/quiz/fill | Vježbe | Napomene |
|---|---|---|---|---|---|
| Tourism Economics 2 | `te2` | 1 | 11 / 135 / 94 / 66 | — | REBUILD iz 10 PDF predavanja (stari je bio tanak); LIVE 2026-06-12 `ca06158` |
| Entrepreneurship & Innovation | `entrepreneurship` | 1 | 15 / 175 / 134 / 80 | — | split + 4 nove kat (~95 fc); LIVE 2026-06-13 `8a37404` |
| Accounting | `accounting` | 1 | 15 kat | **41** (6 tipova) | prvi s Exercises sustavom; plan [ACCOUNTING_PLAN.md](./ACCOUNTING_PLAN.md); LIVE 2026-06-12 `a6b6fb0` |
| E-Business | `ebusiness` | 1 | 15 / 152 / 124 / 75 | — | stari bio VJERAN predavanjima → split + obogaćen (+23 fc); LIVE 2026-06-13 `51e4e7b` |
| Economics in Hospitality | `econ-hospitality` | 2 | 11 / 162 / 106 / 84 | — | K1 rebuild iz izvora (30→73 fc) + K2 hotelski KPI; LIVE 2026-06-09 `24f2b6f` |
| Marketing | `marketing` | 2 | 13 / 113 / 66 / 56 | — | K1 (T1–T8) + K2 (T9–T13) + hibrid; LIVE 2026-06-06 `822d788` |
| Tourism Geography | `geography` | 2 | 13 / 128 / 127 / 84 | — | + **slijepa karta** (blind-map, WebP); K1 obogaćen, K2 kontinenti; LIVE 2026-06-10 `a8e7371` |
| Food & Nutrition | `food-nutrition` | 2 | 15 / 174 / 182 / 122 | — | Beer premješten K1→K2 po silabusu (ključ isti → napredak očuvan); LIVE 2026-06-10 `05cb0af` |

## 1. godina HM — 9/9 KOMPLETNO i LIVE (⛔ Intro to Hospitality BLOKIRAN — nema PDF-ova)

| Predmet | ID | Sem | Final: kat/fc/quiz/fill | Vježbe | Napomene |
|---|---|---|---|---|---|
| Business Informatics | `business-informatics` | 1 | 11 kat / ~86 fc | — | prvi 1.god predmet (pilot mapa-po-predmetu) |
| Microeconomics | `microeconomics` | 1 | 15 / 164 / 148 / 118 | — | **prvi kvantitativni (KaTeX)**; K1=Ch1–7, K2=Ch8–18 iz silabusa; LIVE 2026-06-14 `236e303` |
| Statistics | `statistics` | 1 | 10 / 108 / 102 / 80 | **56** + `stat-lib` | KaTeX; Learn obogaćen (Track A); plan [STATISTICS_PLAN.md](./STATISTICS_PLAN.md); LIVE 2026-06-16 `d97ee0b` |
| Macroeconomics | `macroeconomics` | 1 | — (study) | **~81** (B1–B12) | KaTeX; open-economy + BoP vježbe; LIVE `58cc37c` + `28fcb7e` |
| Academic Writing | `academic-writing` | 1 | 24 / 336 / 286 / 240 | **17** (uklj. 2 `cite`) | **prvi GENERATOR-pilot** (~$2.27); Chicago style težište; LIVE 2026-06-23 |
| Mathematics | `math` | 1 | 10 / 79 / 79 / 64 | **39** + `math-lib` | KaTeX; ZADNJI 1.god predmet; K1 learn obogaćen + Gauss/Gauss-Jordan; plan [MATH_PLAN.md](./MATH_PLAN.md); LIVE 2026-06-27 |
| Special Interest Tourism | `sit` | 2 | 13 / 94 / 83 / 65 | — | ⚠ nautical kat. iz općeg znanja (slikovni slajd); Event+Outdoor nepokriveni; LIVE 2026-06-14 `e0e9ca7` |
| Management | `management` | 2 | 11 / 89 / 84 / 55 | — | Lussier 9e; teme 2/3/6/13/15 bez decka → neobrađene; LIVE 2026-06-14 `06c96a8` |
| Traffic in Tourism | `traffic` | 2 | 27 / 189 / 186 / 188 | — | ručno (NE generator); CONNECTOR+PRODUCT obrazac; plan [TRAFFIC_PLAN.md](./TRAFFIC_PLAN.md); LIVE 2026-06-25 `62a4119` |

## HR program „Menadžment u Hotelijerstvu" (klon, ADR-012) — STATUSNA PLOČA

> ### ⚰️ HR-STAZA JE OD 2026-09-04 BEZ VLASNIKA
>
> **💡 Leon, 2026-09-06 (KASNIJE, nije cigla):** *„još jedan bot koji radi lokalno posao koji je Saša radio — dodaje predmete iz hrvatskog"*.
> Što već postoji: generator-cjevovod (`pdf-text` → `build-topics` → `generate-subject` → `assemble-subject` → gate) i recenzent
> `content-review` (`.claude/agents/`). Što fali: **autor-agent** (kalup kroz `agent-builder`), **izvor** po predmetu (HR skripte/PDF u
> `_materials/` = autoritet, ADR-020 — bez izvora agent izmišlja), **`verify-subject.js`** (dvo-ključni verifier točnosti) i Leonova presuda
> po predmetu. Nedostaje 10 HR predmeta (tablica dolje): 5 S3 + `accounting-hr` (study) + 4 kvantitativna (S4/S5 → po anketi 2026-09-06
> **čekaju F5 recepte**). Kad dođe na red: prvo `verify-subject.js`, pa autor-agent, pa jedan pilot-predmet iz HR skripte.
> Content-suradnik je **otkazan** (Leon, 2026-09-04) → ploču od danas vodimo mi, a ne on.
> Model rada koji je uz njega postojao je povijest: [archive/TEAM.md](../archive/TEAM.md), odluka
> [ADR-023](../records/DECISIONS.md) (označena otkazanom).
>
> ⚠️ **Otkazana je SURADNJA, ne GRADIVO.** Sedam HR predmeta u tablici ispod je **živo i na
> produkciji** — `npm run verify` ih broji među 24. Ništa se ne briše i ne prepisuje.
>
> 🎯 **NIČIJI ZADATAK (bio je Leonov nalog 2026-07-28):** 4 kvantitativna predmeta s vježbama →
> **`macroeconomics-hr` · `statistics-hr` · `math-hr` · `accounting-hr`** (study + **vježbe = SAMO
> string-polja**; `generate/answer/type` nedirljivi, `test:unit` zelen). Razlog je i dalje valjan:
> **vježbe moraju biti na hrvatskom.** Ako se radi, radimo ga mi. *(`microeconomics-hr` nije bio u
> toj rundi.)*
>
> <details><summary>Kako je ploča vođena dok je suradnik postojao</summary>
>
> **Aktivno od 2026-07-09** (ADR-023): suradnik prevodi/gradi HR program do pune 2 godine. Tok po predmetu = [TEAM.md](../archive/TEAM.md) §5
> (prijevod alatom → **HR materijali = autoritet** → gate → PR). Faza = S-cigla iz TEAM.md §4. Suradnik ažurira SAMO ovu tablicu
> (svoj redak, direktno u PR-u — **normalno pravilo vraćeno 2026-07-13**, docs su na main-u).
>
> 🛑 **STOP-NALOG JE ISPUNJEN (2026-08-15).** Obje preostale grane (`entrepreneurship-hr`, `ebusiness-hr`) su mergeane u `main` — **ne od njega nego s naše strane**, jer su bile 88 commita iza i rebase je nakon C1 nosio modify/delete na obrisanom `styles.css`. Time je stavljen na stanku dok frontend redizajn ne bude gotov (TEAM.md §9); stanka je 2026-09-04 prerasla u otkazivanje.
> </details>

| Predmet (EN izvor) | HR ID | Faza | Status | PR / napomena |
|---|---|---|---|---|
| Business Informatics | `business-informatics-hr` | pilot (prije S-staze) | ✅ LIVE 2026-06-28 | 11 kat/86 fc; ~$0.66 |
| Management | `management-hr` | **S2 PILOT** | ✅ LIVE 2026-07-15 · ✅ **rebalans kartica (PR #2) OBJAVLJEN 2026-07-17** (`08dd383`; file-served, nije u Supabase) | **13 kat / 122 fc / 108 quiz / 73 fill** (HR ≠ EN — svjesno, po skripti). **📇 REBALANS KARTICA (Leon 2026-07-15 „razgranaj velike definicije iz kartica na learn"):** svih 122 kartica skraćeno na **≤200 znak** (bilo 92% >200, prosjek 359), sav detalj preseljen u BOGAT `learn`; `foundations` = Leonova demo verzija; quiz/fill netaknuti (osim fix niže); soft-validator 0 upozorenja; ćirilica-sken `[Ѐ-ӿ]` 0. **+ FIX:** examPractice quiz#0 + fill#0 još imali „4 funkcije" → 5 (Weihrich&Koontz). Prijevod ✓ + catalog/JSON/bump ✓ + gateovi ✓ + živa provjera ✓ · **§5.2 uz SVE HR materijale ✓** (učinkovitost/djelotvornost → **efikasnost/efektivnost**) · **OPCIJA B KOMPLETNA (Leon, 2026-07-14) — sadržaj usklađen s HR skriptom kolegija:** (a) definicija + **Weihrich&Koontz 5 funkcija (+kadroviranje)** umjesto Lussierove 4; (b) NOVA kat. **`managementHistory`** — povijest po skripti (Prapočeci/Konvencionalni/Nekonvencionalni/Suvremeni; Taylor·Fayol 14 načela·McGregor X/Y·Drucker·7S·Crosby·TQM·BPR·učeća org.) umjesto Lussierove klasična/bihevioralna/integrativna; (c) NOVA kat. **`hotelEnterprise`** — „Osnove pristupa hotelskom poduzeću i poduzetništvu" (EN je uopće nema): ZTD-oblici, Drucker/poduzetnik, tipovi Pionir/Maher/Strateg/Trener, životni ciklus, okolina, standardizacija/kategorizacija, hotelski lanci, etika/bonton. **🐛 ISPRAVLJENA ČINJENIČNA GREŠKA:** „otac modernog menadžmenta" = **Drucker** (bilo pogrešno „Fayol"; skripta + ispitno pitanje 36); Fayol = operacijski, Taylor = znanstveni. ⚠️ `data/management-hr/*.js` sad RUČNO usklađen → **NE pokretati `translate-subject.js` nad njim** (zaglavlje upozorava). Objavljen mergeom PR #1 → main. |
| Special Interest Tourism | `sit-hr` | **S3** | ✅ **LIVE 2026-07-22** (PR #3, `ac2dc7e`; file-served, nije u Supabase) | **14 kat / 76 fc / 87 quiz / 56 fill** (HR ≠ EN — svjesno). **AUTORSKI IZ HR SOT SKRIPTE** (prof. Gračan), NE prijevod EN SIT-a — HR kolegij bitno drukčiji (EN dark/film turizam nema; HR ima teorijski K1 + eko/religijski). Kartice ≤200 + bogat learn od početka (Leonov model); K1 quiz-bogat (53), K2 lakši (29) po težini kolokvija. §5.2: sadržaj + terminologija iz skripte K1/K2 + ispitnih pitanja; ćirilica-sken 0; samoprovjera činjenica (fix: Thomas Cook 570 osoba). ⚠️ RUČNO autorirano → NE `translate-subject.js`. |
| Traffic in Tourism | `traffic-hr` | S3 | ✅ **LIVE 2026-07-22** (PR #4, `ac2dc7e`; file-served, nije u Supabase) | **13 kat / 91 fc / 89 quiz / 91 fill** (+ examPractice → final 14/98/97/97). **Metoda: prijevod EN `traffic` + §5.2 usklađivanje uz HR skriptu** — EN i HR izvor su ISTI (Mrnjavac / prof. Kovačić), struktura se poklapa pa je prijevod legitiman (za razliku od `sit-hr`, gdje skripta odstupa → autorski rad). Prijevod alatom `translate-subject.js` (~$1.34; ključevi identični EN-u). **📇 Model sadržaja (Leon 2026-07-15):** SVE kartice ≤200 znak. (M1 max 183 · M2 max 183 · examPractice max 189), sav detalj preseljen u bogat `learn`; soft-validator **0 upozorenja**. **§5.2 terminologija uz skriptu:** `čarter` → **`charter`** (14×; skripta koristi engleski oblik 21×, „čarter" 0×). **🐛 Ćirilica-sken `[Ѐ-ӿ]`:** popravljen `najbržи` → `najbrži` (sada 0). Podjela kviza prati stvarne kolokvije po silabusu (K1 = tjedni 1–6 / 6 kat. / 42 pit.; K2 = tjedni 7–15 / 7 kat. / 47 pit.; završni = oba + 7 međutematskih). catalog/JSON/bump ✓ · gateovi ✓ · Playwright ✓. ⚠️ `data/traffic-hr/*.js` ručno usklađen → **NE pokretati `translate-subject.js` nad njim** (zaglavlje upozorava). |
| Tourism Economics 2 | `te2-hr` | S3 | 🟢 **LIVE (mergean na PROD 2026-07-26, `7fb2d61`)** | **14 kat / 94 fc / 85 quiz / 71 fill** (+ examPractice → final 15/102/95/77). **Metoda: AUTORSKI iz HR skripte + DOGRADNJA iz EN (Leonov fazni tok 2026-07-24)** — faza 1 gradnja iz HR skripte, faza 2 usporedba HR↔EN, faza 3 dogradnja onoga što fali. Dograđeno iz EN (prevedeno, integrirano u learn + kartice): **nova K2 kat. „Turizam, okoliš i održivi razvoj"** (tržišni neuspjeh, eksternalije, podjela dobara, tragedija zajedničkog dobra, opteretni kapacitet, 3 stupa održivosti, SDG, „onečišćivač plaća"); + `demand` (zakon potražnje, Bandwagon/Snob/Veblen, unakrsna+marketinška elastičnost); + `marketSupply` (čimbenici proizvodnje, kratki/dugi rok, ekonomija razmjera, tržišne strukture); + `conceptTourist` (5 A's turizma, nematerijalnost/nema prijenosa vlasništva); + `tsa` (karakteristični vs povezani proizvodi, Globalni etički kodeks); + `economicFunctions` (5 tipova multiplikatora, veličina 1,5–2,5). Kao `sit-hr` — HR „Ekonomika turizma" (FMTU, 2. god) je **deskriptivno-institucionalni** kolegij (definicije turista, vrste turizma, ponuda/potražnja kao pojmovi, resursi, posrednici, ekonomske/društvene funkcije, TSA), a EN `te2` je **kvantitativni anglosaksonski** (elastičnost s krivuljama, forecasting modeli, cost curves, tržišne strukture) → struktura se NE poklapa pa prijevod nije bio prikladan. Po opciji B skripta je autoritet; detalji posuđeni iz EN-a gdje skripta zašuti. Izvori: glavna skripta K1+K2, završni ispit, 3 seta ispitnih pitanja (docx→tekst). **📇 Model (Leon 2026-07-15):** SVE kartice ≤200 znak. (M1 max 192 · M2 max 195 · examPractice max 175), detalj u bogat `learn`; soft-validator **0 upozorenja**. **🐛 Ćirilica-sken `[Ѐ-ӿ]`: 0.** 186 jedinstvenih ID-jeva. examPractice = međutematska pitanja iz stvarnih ispitnih setova. Struktura K1 (7 kat.) + K2 (6 kat.). **⚠️ Prvi predmet 2. godine u HR programu** — otkrio je da `browse.spec.js` broji year-2 predmete kroz sve programe; **Leon popravio (`388e3c5`)** prije mergea. catalog/JSON/bump ✓ · gateovi ✓ · Playwright ✓. **Deploy: Opus lead-review** (scope/CI/model/struktura zeleno; činjenice=Sašina domena) + Leonovo dopuštenje → local `--no-ff` merge; **Vercel Production SUCCESS. File-served** (nije u Supabase). ⚠️ `data/te2-hr/*.js` autorski → **NE pokretati `translate-subject.js`** (zaglavlja upozoravaju). |
| Entrepreneurship & Innovation | `entrepreneurship-hr` | S3 | 🟢 **MERGEAN u `main` 2026-08-15** (PR #6 · merge `e8f6c59`; file-served, nije u Supabase) | **12 kat / 83 fc / 74 quiz / 62 fill** (+ examPractice → final 13/91/84/68). **Metoda: AUTORSKI iz HR skripte + DOGRADNJA iz EN (Leonov fazni tok)** — HR kolegij „Poduzetnički menadžment i inovacije" (FMTU) ima svoj redoslijed i T&U fokus. Napomena: „Poduzetništvo" i „Poduzetnički menadžment i inovacije" datoteke = ISTI kolegij (Antea = ispitna Q&A verzija). **K1 (6 kat.):** teorije/teoretičari, poduzetnik i oblici, poduzetnički menadžment u T&U, funkcije, vrste/oblici, pravni oblici+ideja. **K2 (6 kat.):** poslovni plan, financiranje, strateško poduzetništvo/inovacije, financijski pokazatelji, EU+održivost, **+ NOVA (dopuna EN) „Suvremeni alati i učenje iz neuspjeha"** (BMC, studija izvedivosti, pitch deck, growth/fixed mindset, prilika, neuspjeh kao proces). Faza 3 dopune iz EN (prevedeno, integrirano u learn+kartice): psihologija poduzetnika (lokus kontrole, nAch), invencija/inovacija + Druckerovih 7 izvora + 6 tipova + inkrementalna/radikalna/otvorena, bootstrapping/crowdfunding/rizični kapital, franšiza formati. Model ≤200 + bogat learn; ćirilica 0; 178 uniq id. catalog/JSON/bump ✓. ⚠️ RUČNO autorirano → NE `translate-subject.js`. |
| E-Business | `ebusiness-hr` | S3 | 🟢 **MERGEAN u `main` 2026-08-15** (PR #7 · merge `1cbc82b`; file-served, nije u Supabase) | **12 kat / 88 fc / 72 quiz / 60 fill** (+ examPractice → final 13/96/82/66). **Metoda: AUTORSKI iz HR materijala + DOGRADNJA iz EN (Leonov fazni tok).** ⚠️ **Napomena o izvorima:** HR docx-i su Q&A ispitni setovi (Antea) i **puni su SLIKA** — 555 KB/2,4 MB/1,4 MB datoteka dalo je samo 3,7/12/14 K teksta, pa je dio gradiva dostupan samo kroz tekstualne odgovore (ne i slikovna pitanja). Kolegij se u materijalima naziva i „ICT". **K1 (6 kat.):** temelji e-poslovanja (ESPRIT definicija, mikro/makro, razine informacije), modeli i e-infrastruktura (B2B/B2C/C2G, e-potpis/e-račun/eIDAS, IoT), Internet i web servisi (HTTP/FTP/SMTP/POP3/IMAP, DNS, URI, CARNET), razvoj weba (Web 1.0→4.0, generacije komunikacije), ICT u hotelijerstvu (10 trendova, IN HOUSE ICT, NY sindrom, booking proces, PMS, CENTRIX), **+ NOVA (dopuna EN) „Distribucija u turizmu"** (GDS/Amadeus-Sabre-Travelport, PMS/CRS, booking engine, channel manager, meta-tražilice, switch tvrtke, wholesaleri; komunikacijski kanali NISU distribucija). **K2 (6 kat.):** kvaliteta sitea i SEO (SERP, organski, Panda/Venice/Pigeon, sitemap vs XML Sitemap, CTA, 3 klika, copy-paste), Google alati (Analytics/Trends/Ads vs AdSense/My Business, SaaS), online oglašavanje i društveni mediji, računalna grafika (RGB=ekran/CMYK=tisak, vektor vs raster, 300 dpi, Sans Serif), sigurnost (phishing ~91%, modification, 65 mlrd USD), **+ NOVA (dopuna EN) „Poslovni modeli i platform ekonomija"** (merchant vs agent model s konkretnim tokovima novca 50/80/100+10%, voucher, posrednik vs infoposrednik, mrežni učinci, ekonomija razmjera na strani potražnje). **🐛 Ispravljena greška u samom materijalu:** zagrade „RGB(ŠTAMPA)/CMYK(DIGITALNA OBJAVA)" su obrnute → ispravno RGB=ekran, CMYK=tisak (što ista rečenica u nastavku i kaže). Model ≤200 + bogat learn (M1 max 199 · M2 173 · exam 149); ćirilica 0; 174 uniq id. ⚠️ RUČNO autorirano → NE `translate-subject.js`. |
| Economics in Hospitality | `econ-hospitality-hr` | S3 | ⬜ | |
| Marketing | `marketing-hr` | S3 | ⬜ | |
| Tourism Geography | `geography-hr` | S3 | ⬜ | + blind-map (geografija-only) |
| Food & Nutrition | `food-nutrition-hr` | S3 | ⬜ | |
| Academic Writing | `academic-writing-hr` | S3 (study) + S5 (vježbe) | ⬜ | Chicago primjeri = jezično osjetljivi |
| Microeconomics | `microeconomics-hr` | S4 (KaTeX) | ⬜ | |
| Macroeconomics | `macroeconomics-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Statistics | `statistics-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Mathematics | `math-hr` | S4 (KaTeX) + S5 | ⬜ | |
| Accounting | `accounting-hr` | S3 (study) + S5 (vježbe) | ⬜ | |

**S6 (examPractice iz ispitnih pitanja)**: usput, po dostupnosti Word materijala. **S7 (MUT/MOR)**: čeka U2.5 (ADR-022).

## Detaljni planovi (u ovoj mapi)
- [ACCOUNTING_PLAN.md](./ACCOUNTING_PLAN.md) — analiza izvora + katalog vježbi (✅ done)
- [STATISTICS_PLAN.md](./STATISTICS_PLAN.md) — Learn Track A + vježbe Track B (✅ done)
- [TRAFFIC_PLAN.md](./TRAFFIC_PLAN.md) — plan + master-obrazac (✅ done)
- [MATH_PLAN.md](./MATH_PLAN.md) — KaTeX + worked problems (✅ done)

## Pouke za budući sadržajni rad (iz CLAUDE.md povijesti, 2026-06)
- **Provjeri stari sadržaj PROTIV predavanja:** rebuild ako je tanak (te2; djelomično Entrepreneurship), split+obogaćivanje ako je vjeran (E-Business).
- **Learn sekcije moraju biti BOGATE** (definicija+intuicija+radni primjeri+interpretacija+zamke), ne „formule nabacane" — uzor: Statistics Track A / Math K1 obogaćivanje. [[learn-sections-must-be-rich]]
- **Korisnik ZASIĆEN računovodstvom** — na Accounting se NE vraćati osim izričito.
- **Masovni unos novog programa** → generator ([../content/CONTENT_GENERATOR.md](../workflow/CONTENT_GENERATOR.md)) + razmotriti dodatne uštede usagea (korisnik: „kombinacije uštede kasnije").
- **KaTeX predmeti:** currency-safe delimiteri (ADR-009; jedan `$` NIKAD); `final` se učitava **ZADNJI**; sadržajna točnost = dvo-ključni verifier (ADR-020) kad se vratimo sadržaju.

> Alati za autorstvo: [../content/](../content/) (SCHEMA · GUIDE · INTAKE · GENERATOR · EXERCISES_ENGINE).
