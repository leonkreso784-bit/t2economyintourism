# Testing — ručna QA checklista

> Nemamo automatske testove (zasad), pa je ovo naša zaštita od regresija.
> Prođi relevantni dio prije svakog deploya. Nađeš li bug → upiši ga u [BUGS.md](BUGS.md).

## Automatske provjere (uvijek prvo)
- [ ] `npm run verify` → 0 grešaka (mapiranje, datoteke, window-izvoz). *(alias: `verify:catalog`)*
- [ ] `npm run test:responsive` → pokreće Playwright (4 iPhone profila):
  - `responsive.spec.js` — Learn sekcija, 0 horizontalnog overflowa (screenshotovi u
    `test-results/learn-shots/`).
  - `smoke.spec.js` — SVE sekcije × svih 9 predmeta: renderiranje, protok podataka
    kroz catalog, 0 JS grešaka, 0 overflowa.
  - `browse.spec.js` — drill-down navigacija (Fakultet→Smjer→Godina→Predmet) + overflow guard.
  - `landing.spec.js` — landing nav, subjects showcase (= broj predmeta iz catalog-a),
    navigacija CTA-ova, overflow guard.
  - `lazy-load.spec.js` — sadržaj predmeta se NE učita na startu, nego tek na otvaranje (A4).
  - `sidebar.spec.js` — legacy sidebar render iz catalog-a.
  - `auth.spec.js` — Sign-in gumb + email+lozinka modal: tabovi Sign in / Create account
    (polja, minlength=8), gumb-oko (type password↔text), Forgot password tok (forma + back),
    otvaranje/zatvaranje, bez overflowa;
    **skip ako je supabase-js CDN nedostupan** (auth se tada tiho gasi — željeno ponašanje).
    + Profile stranica: sign-in prompt za odjavljene, back na landing, NE sprema se u last-position.
    **`beforeEach` pred-postavlja `sokrat-cookie-consent='denied'`** da fiksni cookie-banner (na dnu) ne presreće
    klikove na donje kontrole modala na niskom landscape ekranu (kao posjetitelj koji se vraća).
  - `legal.spec.js` — statične stranice privacy/terms/faq/contact (200, h1, footer nav, mailto,
    bez overflowa) + landing footer linkovi na njih.
  - (Prvi put: `npm install` + `npx playwright install chromium`.)

## Smoke test (uvijek, ~2 min)
- [ ] Stranica se učita bez greške u konzoli (F12 → Console).
- [ ] Landing → "Start Studying" otvara **drill-down browse** (Fakultet→Smjer→Godina→Predmet).
- [ ] Showcase predmeta na landingu: klik na predmet otvara njegove lekcije.
- [ ] Otvori jedan predmet → lekcija → Home sekcija se prikaže.
- [ ] Prebaci kroz: Learn, Flashcards, Quiz, Fill, Progress — svaka se otvori.

## Po predmetu (nakon izmjene catalog-a / sadržaja)
Za **svaki** pogođeni predmet:
- [ ] Predmet se pojavljuje u sidebaru ( ispravan naziv, ikona, boja).
- [ ] Sve lekcije se prikazuju; "coming soon" lekcije se ponašaju kako treba.
- [ ] **Learn:** sve kategorije prikazane, slike se otvaraju u modalu.
- [ ] **Flashcards:** okreću se, Know/Don't Know broji, navigacija radi.
- [ ] **Quiz:** start radi, opcije se prikažu, točno/netočno se boji, rezultat na kraju.
- [ ] **Fill:** praznina prikazana, provjera odgovora radi, hint radi.
- [ ] **Progress:** brojevi i trake se ažuriraju nakon aktivnosti.
- [ ] (Geografija) **Blind Map** se prikaže i prima klikove.

## Regresija nakon refaktora (A2–A5)
- [ ] Svih 9 predmeta radi **identično** kao prije refaktora.
- [ ] Napredak spremljen prije refaktora i dalje se učita (storageKey nepromijenjen).
- [ ] Nema novih grešaka u konzoli.

## Performanse (nakon lazy loadinga, A4)
- [ ] Prvo učitavanje ne povlači sve `data-*.js` (provjeri Network tab).
- [ ] Sadržaj predmeta se učita tek na otvaranje, bez vidljivog zastoja.

## Mobitel / responzivnost
- [ ] Testirano na uskom ekranu (DevTools ~375px): donja navigacija radi.
- [ ] Nema horizontalnog scrolla; tekst čitljiv.

## Nakon deploya
- [ ] Otvori live (sokratstudy.com), ponovi Smoke test.
- [ ] Hard refresh (Ctrl+F5) — provjeri da nova verzija fajlova dolazi (cache busting `?v=`).
