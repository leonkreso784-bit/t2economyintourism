-- =====================================================================================
-- c3-rls-initplan.sql — `auth.uid()` se računa JEDNOM po upitu, ne po RETKU
-- =====================================================================================
--
-- POVOD (2026-08-14): Supabaseov **performance**-advisor javlja `auth_rls_initplan` na 14 politika.
-- Dotad su svi naši zapisi o advisorima bili o *security*-advisorima; performance nitko nije gledao.
--
-- ŠTO JE PROBLEM: `auth.uid()` je STABLE funkcija, ali kad stoji gola u RLS izrazu, planer je
-- ne može izdvojiti u InitPlan — pa je izvršava **za svaki redak koji politika ispituje**.
-- Omotana u skalarni podupit — `(select auth.uid())` — izračuna se jednom i rezultat se
-- ponovno koristi. Semantika je IDENTIČNA (ista vrijednost kroz cijeli upit); mijenja se
-- isključivo plan izvršavanja.
--
-- ZAŠTO BAŠ SAD: cijena se mjeri **brojem korisnikovih redaka**, a ADR-029 je UGC proglasio
-- glavnim proizvodom. Danas, s malo čvorova po korisniku, razlika je nemjerljiva — korisnik s
-- 500 čvorova plaća 500 evaluacija po upitu. Ovo je jedini nalaz iz revizije koji **poskupljuje
-- čekanjem**, i jedini koji `load-probe` ne bi otkrio, jer probe mjeri prazne račune.
--
-- ⚠️ ZAŠTO `ALTER POLICY`, A NE `DROP` + `CREATE`: drop-and-recreate ostavlja trenutak u kojem
-- politika ne postoji. Unutar transakcije to je nevidljivo izvana, ali `ALTER POLICY` uopće ne
-- stvara takav prozor i ne može se slučajno izvršiti polovično ako netko pusti retke pojedinačno.
-- Ništa se ne briše → nema rizika da zaštita ostane skinuta ako izvršavanje pukne na pola.
--
-- ⚠️ SIGURNOSNI INVARIJANT: nijedan uvjet se NE MIJENJA sadržajno. Svaki `USING`/`WITH CHECK`
-- ispod je doslovno postojeći izraz (očitan iz `pg_policies`) s jedinom izmjenom
-- `auth.uid()` → `(select auth.uid())`. Ako se ovdje promijeni išta drugo, to je greška.
--
-- REDOSLIJED PRIMJENE: prvo `sokrat-staging`, pa tek onda produkcija, i to uz Leonov IZRIČIT OK
-- (pravilo: SQL na prod = njegova odluka, ne posljedica općeg odobrenja).
--
-- PROVJERA NAKON: ① advisor više ne javlja `auth_rls_initplan`; ② `npm run test:authed` zelen
-- (ponašanje politika se ne smije promijeniti — samo plan); ③ `npm run test:storage` zelen.
-- =====================================================================================

-- ✅ PRIMIJENJENO 2026-08-31: staging (sokrat-staging) pa PRODUKCIJA, uz Leonov izričit OK.
--    Datoteka od tada opisuje STANJE, ne namjeru. Ponovno pokretanje je bezopasno
--    (ALTER POLICY je idempotentan, CREATE INDEX ima IF NOT EXISTS, REVOKE je no-op).

begin;

-- ── nodes (vlasništvo izravno na retku) ──────────────────────────────────────────────
alter policy nodes_select_own on public.nodes
  using ((select auth.uid()) = owner_id);

alter policy nodes_insert_own on public.nodes
  with check ((select auth.uid()) = owner_id);

alter policy nodes_update_own on public.nodes
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

alter policy nodes_delete_own on public.nodes
  using ((select auth.uid()) = owner_id);

-- ── node_content (vlasništvo posredno, preko `nodes`) ────────────────────────────────
alter policy node_content_select_own on public.node_content
  using (exists (select 1 from public.nodes n
                 where n.id = node_content.node_id and n.owner_id = (select auth.uid())));

alter policy node_content_insert_own on public.node_content
  with check (exists (select 1 from public.nodes n
                      where n.id = node_content.node_id and n.owner_id = (select auth.uid())));

alter policy node_content_update_own on public.node_content
  using (exists (select 1 from public.nodes n
                 where n.id = node_content.node_id and n.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.nodes n
                      where n.id = node_content.node_id and n.owner_id = (select auth.uid())));

alter policy node_content_delete_own on public.node_content
  using (exists (select 1 from public.nodes n
                 where n.id = node_content.node_id and n.owner_id = (select auth.uid())));

-- ── node_content_versions (append-only audit; samo čitanje vlastitog) ────────────────
alter policy ncv_select_own on public.node_content_versions
  using (exists (select 1 from public.nodes n
                 where n.id = node_content_versions.node_id and n.owner_id = (select auth.uid())));

-- ── progress (napredak učenja) ───────────────────────────────────────────────────────
alter policy progress_select_own on public.progress
  using ((select auth.uid()) = user_id);

alter policy progress_insert_own on public.progress
  with check ((select auth.uid()) = user_id);

alter policy progress_update_own on public.progress
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy progress_delete_own on public.progress
  using ((select auth.uid()) = user_id);

-- ── profiles ─────────────────────────────────────────────────────────────────────────
alter policy profiles_select_own on public.profiles
  using ((select auth.uid()) = user_id);

commit;

-- =====================================================================================
-- SITNI DUG IZ ISTOG ADVISORA — RIJEŠEN 2026-08-31 u `a1-grants-indexes.sql`:
-- dva neindeksirana strana ključa (`content_versions.edited_by`,
-- `node_content_versions.edited_by`). Ostao je u zasebnoj datoteci jer JEST zasebna odluka
-- — indeks usporava pisanje — ali odluka je donesena i indeksi idu uz ovu migraciju.
--
-- ⚠️ BROJKA U ZAGLAVLJU JE BILA KRIVA: do 2026-08-31 je pisalo "13 politika". Advisor i
-- `pg_policies` neovisno daju **14**, a datoteka ih je oduvijek mijenjala svih 14 — dakle
-- pogriješila je PROZA, ne SQL. Točno onaj razred greške zbog kojeg postoji `check:state`,
-- samo što ovu brojku nijedna brana ne gleda.
-- =====================================================================================
