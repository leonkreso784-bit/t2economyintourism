# Demo modela kartica — `management-hr` (arhiva)

**Status:** 📦 ARHIVA · zabilježeno 2026-08-31, cigla **A2** faze MREŽA
**Izvor:** grana `content/model-demo-management-hr`, zadnji commit `92a2498` (2026-07-15)

---

## Zašto je ovo sačuvano, a grana obrisana

Grana je bila **1 commit naprijed i 309 iza** `main`-a. Od dvanaest datoteka koje je
dirala, **jedanaest su bili samo `?v=` cache-tokeni** — dakle šum od `npm run bump`.
Sadržaja je bilo u **jednoj** datoteci.

Taj sadržaj **nije nedovršen posao nego izveden primjer**: pokazuje
[kartica-standard](../subjects/README.md) na stvarnom gradivu — kartica nosi **kratku
definiciju**, a detalj seli u `learn`. To je isti standard koji `js/card-limits.js`
danas provodi u editoru (M5a) i koji cigla **E2** faze MREŽA tek treba dovršiti nad
zatečenim gradivom (25 kartica preko 500 znakova).

Grana se **ne mergea**: temelji se na stanju od 15. srpnja, prije C0–C5b, i mergeanje bi
značilo vraćanje 309 commita unatrag na jedanaest datoteka koje s demonstracijom nemaju
veze. Ono što vrijedi je **model**, a model se čita, ne mergea.

## Što demonstracija konkretno radi

| prije | poslije |
|---|---|
| `answer` nosi cijelu definiciju + numeriranu listu (do ~600 znakova) | `answer` nosi jednu rečenicu + nabrajanje pojmova |
| `explanation` nosi dopunsku prozu | `explanation` nosi pointer: *„Opis svakog → sekcija Uči"* |
| `learn` je sažetak od nekoliko odlomaka | `learn` nosi **cijelu skriptu** — pet funkcija, resursi, vještine, uloge, razine |

Smjer je dakle: **kartica pita i kratko odgovara, `learn` objašnjava.** Karticu se uči
napamet; skriptu se čita.

## Puni diff (jedina datoteka sa sadržajem)

```diff
diff --git a/data/management-hr/midterm-1.js b/data/management-hr/midterm-1.js
index d9f41b1..b495899 100644
--- a/data/management-hr/midterm-1.js
+++ b/data/management-hr/midterm-1.js
@@ -11,43 +11,43 @@ const managementHrM1 = {
     "flashcards": [
       {
         "question": "Što je MENADŽMENT i kojih je PET FUNKCIJA menadžmenta (Weihrich i Koontz)?",
-        "answer": "Menadžment = proces oblikovanja, usmjeravanja i usklađivanja svih čimbenika proizvodno-uslužnog procesa u kojem pojedinci, radeći zajedno u poduzeću, efikasno ostvaruju odabrane ciljeve.\n\nWeihrich i Koontz definiraju menadžment kroz PET FUNKCIJA:\n1. PLANIRANJE — postavljanje ciljeva i unaprijedno odlučivanje o načinu njihova ostvarivanja\n2. ORGANIZIRANJE — delegiranje i koordinacija zadataka te raspodjela resursa\n3. KADROVIRANJE — popunjavanje radnih mjesta i briga o ljudima (pravi ljudi na pravim mjestima)\n4. VOĐENJE — utjecanje na zaposlenike kako bi radili prema postavljenim ciljevima\n5. KONTROLIRANJE — praćenje napretka i poduzimanje korektivnih mjera",
-        "explanation": "Riječ potječe od latinskog 'manus' (ruka) + 'agere' (djelovati). KLJUČNI ASPEKTI menadžment procesa: rad s i putem drugih · ravnoteža efektivnosti i efikasnosti · racionalno korištenje ograničenih resursa · utjecaj promjenjive okoline — sve radi ostvarivanja ciljeva poduzeća. Funkcije su međusobno različite, ali isprepletene — obavljaju se istovremeno, a ne kao linearni slijed koraka."
+        "answer": "Proces usmjeravanja ljudi i resursa radi efikasnog ostvarenja ciljeva poduzeća. Pet funkcija (Weihrich i Koontz): planiranje, organiziranje, kadroviranje, vođenje, kontroliranje.",
+        "explanation": "Funkcije su međusobno povezane i obavljaju se istovremeno, ne kao linearni slijed. Detaljan opis svake → sekcija Uči."
       },
       {
         "question": "Koja je razlika između EFIKASNOSTI i EFEKTIVNOSTI?",
-        "answer": "• EFIKASAN = raditi stvari NA PRAVI NAČIN, kako bi se maksimalno iskoristili resursi (uz minimalno rasipanje).\n• EFEKTIVAN = raditi PRAVU STVAR radi ostvarivanja cilja.\n\nVisoka uspješnost = odabir pravih resursa (efektivnost) I njihova dobra upotreba (efikasnost).",
-        "explanation": "Menadžer ostvaruje ciljeve efikasnom I efektivnom upotrebom resursa."
+        "answer": "Efikasan = raditi stvari NA PRAVI NAČIN (minimalno rasipanje resursa). Efektivan = raditi PRAVU STVAR (ostvariti cilj).",
+        "explanation": "Uspješnost = odabir pravih resursa (efektivnost) + njihova dobra upotreba (efikasnost)."
       },
       {
         "question": "Koja su ČETIRI organizacijska RESURSA kojima menadžeri upravljaju?",
-        "answer": "1. LJUDSKI resursi — zaposlenici ('ljudski kapital'), najvrjednija imovina\n2. FINANCIJSKI resursi — novac/proračun potreban za poslovanje\n3. FIZIČKI resursi — proizvodi, oprema, materijali, zalihe\n4. INFORMACIJSKI resursi — informacije/znanje za postavljanje ciljeva i donošenje odluka",
-        "explanation": "Uspješnost ovisi o tome koliko dobro menadžeri pribavljaju i koriste ova četiri resursa."
+        "answer": "Ljudski, financijski, fizički i informacijski.",
+        "explanation": "Ljudski resursi ('ljudski kapital') = najvrjednija imovina. Opis svakog → sekcija Uči."
       },
       {
         "question": "Koje su TRI VJEŠTINE menadžmenta?",
-        "answer": "1. TEHNIČKE vještine ('tvrde vještine') — sposobnost primjene metoda/tehnika pri obavljanju zadatka; važnije za nemenadžerske uloge.\n2. INTERPERSONALNE vještine ('socijalne/meke vještine') — sposobnost razumijevanja, komunikacije i uspješne suradnje s drugima; sve važnije, postaju najznačajnije.\n3. Vještine ODLUČIVANJA — sposobnost konceptualizacije situacija i odabira alternativa radi rješavanja problema / iskorištavanja prilika.",
-        "explanation": "Tehničke vještine važnije su na nižim razinama; vještine donošenja odluka važnije su na vrhu (npr. Reed Hastings u Netflix-u)."
+        "answer": "Tehničke (tvrde), interpersonalne (meke) i odlučivačke (konceptualne).",
+        "explanation": "Tehničke važnije na nižim razinama, odlučivačke na vrhu. Opis → sekcija Uči."
       },
       {
         "question": "Kojih je 10 MENADŽERSKIH ULOGA prema Mintzbergu, razvrstanih u 3 kategorije?",
-        "answer": "ULOGA = skup očekivanja o tome kako će se netko ponašati. Henry Mintzberg razvrstao je 10 uloga u 3 kategorije:\n\n1. INTERPERSONALNE — figurativni poglavar, vođa, posrednik\n2. INFORMACIJSKE — promatrač, distributer informacija, glasnogovornik\n3. ODLUČIVAČKE — poduzetnik, rješavatelj poremećaja, raspoređivač resursa, pregovarač",
-        "explanation": "Menadžeri koriste interpersonalne, informacijske i konceptualne/odlučivačke vještine dok obavljaju te uloge."
+        "answer": "10 uloga u 3 skupine: interpersonalne, informacijske i odlučivačke.",
+        "explanation": "Uloga = skup očekivanja o ponašanju (Henry Mintzberg). Pojedine uloge → sekcija Uči."
       },
       {
         "question": "Koje su TRI RAZINE menadžmenta (uz voditelja tima i operativne zaposlenike)?",
-        "answer": "1. VRHUNSKI menadžeri (CEO, predsjednik, potpredsjednik) — upravljaju cjelokupnom organizacijom; određuju svrhu, ciljeve i strategiju.\n2. SREDNJI menadžeri (voditelj prodaje/poslovnice, voditelj odjela) — provode strategiju vrhovnog menadžmenta putem kratkoročnih operativnih planova.\n3. MENADŽERI PRVE LINIJE (nadzornik, voditelj smjene) — provode operativne planove; nadziru OPERATIVNE zaposlenike (ne druge menadžere).\n\n+ VODITELJ TIMA (nepermanentan, timski ustroj) i NERUKOVODEĆI OPERATIVNI zaposlenici (obavljaju stvarni posao).",
-        "explanation": "Vrste prema razini: generalni menadžeri, funkcionalni menadžeri, projektni menadžeri."
+        "answer": "Vrhovni, srednji i menadžeri prve linije.",
+        "explanation": "+ voditelj tima i nerukovodeći operativni djelatnici. Opis razina → sekcija Uči."
       },
       {
         "question": "Na koja se DVA OSNOVNA PRISTUPA dijeli razvoj znanosti o menadžmentu?",
-        "answer": "1. VIŠEDISCIPLINSKI (multidisciplinarni) — pristupa znanosti o menadžmentu s aspekata matematike, sociologije, psihologije, kliničkog iskustva, teorije odlučivanja i teorije sustava\n2. POVIJESNO-KRONOLOŠKI — slijedi razvoj misli kroz povijest/vrijeme",
-        "explanation": "Povijesno-kronološki pristup obrađen je zasebno (Prapočeci → Konvencionalni → Nekonvencionalni → Suvremeni)."
+        "answer": "Višedisciplinski (multidisciplinarni) i povijesno-kronološki.",
+        "explanation": "Povijesno-kronološki pristup obrađuje zasebna kategorija „Povijest menadžmenta“ (Prapočeci → Suvremeni)."
       },
       {
         "question": "Koje su KLJUČNE KOMPONENTE efektivnog menadžera?",
-        "answer": "• Aktivan VOĐA\n• Osigurava POTICAJ za ostvarenje visokih rezultata\n• Osigurava MOGUĆNOST ostvarenja visokih rezultata\n• Kreira POZITIVNU RADNU OKOLINU",
-        "explanation": "S pojmom „menadžer\" mogu se izjednačiti: supervisor, leader, organiser, director, administrator, governer, controller, boss."
+        "answer": "Aktivan vođa · osigurava poticaj I mogućnost za visoke rezultate · kreira pozitivnu radnu okolinu.",
+        "explanation": "Sinonimi za „menadžer\": supervisor, leader, organiser, director, administrator, boss."
       }
     ],
     "quiz": [
@@ -120,8 +120,8 @@ const managementHrM1 = {
       }
     ],
     "learn": {
-      "title": "Management & Its History",
-      "content": "\n                <h3>Što je menadžment?</h3>\n                <p><strong>Menadžment</strong> = proces oblikovanja, usmjeravanja i usklađivanja svih čimbenika proizvodno-uslužnog procesa u kojem pojedinci, radeći zajedno u poduzeću, <strong>efikasno ostvaruju odabrane ciljeve</strong> — kroz pet funkcija (Weihrich i Koontz). Ključni aspekti: rad s i putem drugih · ravnoteža efektivnosti i efikasnosti · racionalno korištenje ograničenih resursa · utjecaj promjenjive okoline.</p>\n                <div class=\"formula-box\">\n                    EFIKASNOST = raditi stvari ISPRAVNO (najmanji otpad) &nbsp;·&nbsp; EFEKTIVNOST = raditi ISPRAVNE stvari<br>\n                    PLANIRANJE → ORGANIZIRANJE → KADROVIRANJE → VOĐENJE → KONTROLIRANJE (zasebne, ali međusobno povezane)\n                </div>\n\n                <h4>Vještine, uloge i razine</h4>\n                <ul>\n                    <li><strong>Vještine:</strong> tehničke (tvrde) · interpersonalne (meke) · odlučivačke (konceptualne)</li>\n                    <li><strong>Mintzbergovih 10 uloga</strong> → interpersonalne · informacijske · odlučivačke</li>\n                    <li><strong>Razine:</strong> vrhovna · srednja · prva linija (+ vođa tima, operativni djelatnici)</li>\n                </ul>\n            "
+      "title": "Uvod u menadžment — osnove",
+      "content": "\n                <h3>Što je menadžment?</h3>\n                <p><strong>Menadžment</strong> = proces oblikovanja, usmjeravanja i usklađivanja svih čimbenika proizvodno-uslužnog procesa u kojem pojedinci, radeći zajedno u poduzeću, <strong>efikasno ostvaruju odabrane ciljeve</strong>. Riječ potječe od latinskog <em>manus</em> (ruka) + <em>agere</em> (djelovati). Ključni aspekti procesa: rad s drugima i putem drugih · ravnoteža efektivnosti i efikasnosti · racionalno korištenje ograničenih resursa · prilagodba promjenjivoj okolini — sve radi ostvarivanja ciljeva poduzeća.</p>\n                <div class=\"formula-box\">\n                    EFIKASNOST = raditi stvari ISPRAVNO (najmanji otpad resursa) &nbsp;·&nbsp; EFEKTIVNOST = raditi ISPRAVNE stvari (postići cilj)<br>\n                    Visoka uspješnost = odabir pravih resursa (efektivnost) I njihova dobra upotreba (efikasnost)\n                </div>\n\n                <h4>Pet funkcija menadžmenta (Weihrich i Koontz)</h4>\n                <p>Funkcije su međusobno različite, ali isprepletene — obavljaju se <strong>istovremeno</strong>, a ne kao linearni slijed koraka.</p>\n                <ul>\n                    <li><strong>1. Planiranje</strong> — postavljanje ciljeva i unaprijedno odlučivanje o načinu njihova ostvarivanja.</li>\n                    <li><strong>2. Organiziranje</strong> — delegiranje i koordinacija zadataka te raspodjela resursa.</li>\n                    <li><strong>3. Kadroviranje</strong> — popunjavanje radnih mjesta i briga o ljudima (pravi ljudi na pravim mjestima).</li>\n                    <li><strong>4. Vođenje</strong> — utjecanje na zaposlenike kako bi radili prema postavljenim ciljevima.</li>\n                    <li><strong>5. Kontroliranje</strong> — praćenje napretka i poduzimanje korektivnih mjera.</li>\n                </ul>\n\n                <h4>Resursi kojima menadžer upravlja</h4>\n                <ul>\n                    <li><strong>Ljudski</strong> — zaposlenici („ljudski kapital“), najvrjednija imovina.</li>\n                    <li><strong>Financijski</strong> — novac/proračun potreban za poslovanje.</li>\n                    <li><strong>Fizički</strong> — proizvodi, oprema, materijali, zalihe.</li>\n                    <li><strong>Informacijski</strong> — informacije i znanje za postavljanje ciljeva i donošenje odluka.</li>\n                </ul>\n\n                <h4>Vještine menadžmenta</h4>\n                <ul>\n                    <li><strong>Tehničke</strong> („tvrde“) — primjena metoda i tehnika pri obavljanju zadatka; važnije na nižim razinama.</li>\n                    <li><strong>Interpersonalne</strong> („meke/socijalne“) — razumijevanje, komunikacija i suradnja s drugima; sve značajnije.</li>\n                    <li><strong>Odlučivačke</strong> („konceptualne“) — konceptualizacija situacija i odabir alternativa; najvažnije na vrhu.</li>\n                </ul>\n\n                <h4>Menadžerske uloge — 10 uloga (Henry Mintzberg)</h4>\n                <p><strong>Uloga</strong> = skup očekivanja o tome kako će se netko ponašati. Mintzberg ih razvrstava u tri skupine:</p>\n                <ul>\n                    <li><strong>Interpersonalne</strong> — figurativni poglavar, vođa, posrednik.</li>\n                    <li><strong>Informacijske</strong> — promatrač, distributer informacija, glasnogovornik.</li>\n                    <li><strong>Odlučivačke</strong> — poduzetnik, rješavatelj poremećaja, raspoređivač resursa, pregovarač.</li>\n                </ul>\n\n                <h4>Razine menadžmenta</h4>\n                <ul>\n                    <li><strong>Vrhovni</strong> (CEO, predsjednik) — upravljaju cjelokupnom organizacijom; određuju svrhu, ciljeve i strategiju.</li>\n                    <li><strong>Srednji</strong> (voditelj odjela/poslovnice) — provode strategiju kroz kratkoročne operativne planove.</li>\n                    <li><strong>Prva linija</strong> (nadzornik, voditelj smjene) — provode operativne planove; nadziru operativne djelatnike.</li>\n                    <li>+ <strong>voditelj tima</strong> (nepermanentan) i <strong>nerukovodeći operativni</strong> djelatnici (obavljaju stvarni posao).</li>\n                </ul>\n\n                <h4>Razvoj znanosti o menadžmentu</h4>\n                <p>Dva osnovna pristupa: <strong>višedisciplinski</strong> (matematika, sociologija, psihologija, teorija odlučivanja, teorija sustava) i <strong>povijesno-kronološki</strong> (razvoj misli kroz vrijeme — obrađen u kategoriji „Povijest menadžmenta“: Prapočeci → Konvencionalni → Nekonvencionalni → Suvremeni).</p>\n\n                <h4>Ključne komponente efektivnog menadžera</h4>\n                <ul>\n                    <li>Aktivan <strong>vođa</strong>.</li>\n                    <li>Osigurava <strong>poticaj</strong> za ostvarenje visokih rezultata.</li>\n                    <li>Osigurava <strong>mogućnost</strong> ostvarenja visokih rezultata.</li>\n                    <li>Kreira <strong>pozitivnu radnu okolinu</strong>.</li>\n                </ul>\n            "
     }
   },
   "managementHistory": {
```

---

**Poveznice:** [BACKLOG](../records/BACKLOG.md) · [stanje predmeta](../subjects/README.md) ·
[aktivni spec MREŽA](../archive/RJESAVANJE-PROBLEMA-9MJ.md) (cigla E2 = zatezanje kartica)
