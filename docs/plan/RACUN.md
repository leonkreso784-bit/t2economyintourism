# RAČUN — prijava, identitet i doseg do korisnika

**Status:** 🟩 AKTIVAN (otvoren 2026-09-01, deployem redizajna) — **prva cigla kreće na Leonovu
izričitu riječ**; dotad ovaj spec samo drži odgovor na „što sada".
**Izvor želja:** Leon, 2026-09-01 (doslovno u [BACKLOG.md §RAČUN](../records/BACKLOG.md)).
**Preduvjeti pali:** frontend redizajn ✅ na produkciji 2026-09-01 · seoba otkazana (Supabase Pro
ostaje) → OAuth/redirect-URI ništa više ne čeka.

---

## 1 · Zašto ovim redom

`#authModal` je građen za jedan put — svaka mogućnost koja ga dira zasebno znači novi prepravak
cijelog dijaloga. Zato **prva cigla nosi SVE TROJE odjednom** (prepravak dijaloga + upitnik +
Google), inače se dijalog prepravlja treći put.

## 2 · Cigle — redom

| # | cigla | gotovo kad korisnik može… |
|---|---|---|
| **R1** | **A0 prepravak `#authModal` + UPITNIK pri registraciji + Google-prijava** (jedan zahvat) | …se registrirati Googleom ili e-mailom kroz ISTI dijalog, pri registraciji reći tko je (student/škola + faks; FMTU se prepoznaje) i dati/uskratiti mail-pristanak — a postojeći korisnici se i dalje prijavljuju bez ikakve promjene |
| **R2** | **Profil** — slika (bucket po `node-images` obrascu: vlasnički prefiks + RLS), uređivanje podataka i izgleda profila | …staviti profilnu sliku, promijeniti ime i vidjeti svoj profil onako kako će ga vidjeti drugi |
| **R3** | **Mail-obavijesti** — provider + Edge Function (ADR-016), pristanak iz upitnika; prvi segment = FMTU (obavijest o novim predmetima) | …primiti mail o novom predmetu SAMO ako je pristao, i odjaviti se jednim klikom iz samog maila |
| — | **Facebook-prijava = UVJETNO** (Metin app-review; tek ako je korisnici zatraže) | — |

## 3 · Tvrde granice (ne popuštaju ni ovdje)

- Identitet **isključivo iz JWT-a** (`getUser()`); `user_id` iz body-ja = eskalacija privilegija
  (naučeno na `delete-account`).
- `service_role` samo u Edge Functions (ADR-016) · RLS i `publish_document` **nedirnuti** ·
  osobni graditelj ostaje zaseban otok (ADR-024).
- Upitnik = **podaci uz pristanak** (GDPR: brisanje računa nosi i njih); mail ide SAMO uz
  izričit pristanak iz upitnika.
- Min. lozinka 8 + leaked-password ostaju (server-side, Pro) + klijentski dvojnik (D4).
- Svaki deploy = Leonov izričit OK (pravilo #2); cache bump (pravilo #1); preflight prije pusha.

## 4 · Što svjesno NIJE ovdje

MCP konektor (ADR-030/031 — traži OAuth pa dolazi IZA R1, ali je zaseban posao) · recepti za
vježbe · birač tema (backlog, Leonova odluka) · „Sign in with ChatGPT" (nepotvrđen, ne obećava se).
