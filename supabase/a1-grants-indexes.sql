-- =====================================================================================
-- a1-grants-indexes.sql — okidaci se skidaju s javnog API-ja + audit dobiva indekse
-- =====================================================================================
--
-- POVOD (revizija 2026-08-31, faza MREZA, cigla A1): Supabaseov *security* advisor javlja
-- da anon i authenticated smiju izvrsiti dvije SECURITY DEFINER funkcije preko
-- /rest/v1/rpc/... — handle_new_user i snapshot_content_version. Obje su OKIDACI:
-- vracaju `trigger` i postoje samo da ih Postgres pozove sam.
--
-- ⚠️ STO JE MJERENJE POKAZALO PRIJE POPRAVKA (obrnuta provjera, 2026-08-31):
-- poziv obiju funkcija kao `anon` vraca **HTTP 404 / PGRST202** — i na produkciji i na
-- stagingu. PostgREST funkcije koje vracaju `trigger` uopce ne drzi u schema cacheu, pa
-- ruta koju advisor spominje nikad nije ni postojala. Dakle:
--
--     REVOKE ovdje gasi UPOZORENJE, ne rupu. To je izmjereno, ne pretpostavljeno.
--
-- ZASTO SE SVEJEDNO RADI: grant koji nikome ne treba je grant koji cuva tudju odluku
-- (PostgREST-ovu) kao nasu zastitu. Ako se ponasanje schema cachea ikad promijeni, mi
-- smo vec zatvoreni. Uz to advisor prestaje sumiti, pa preostalih 11 upozorenja postaje
-- popis koji se DA procitati — svih 11 je namjerno (ADR-024: svaki upis ide kroz
-- SECURITY DEFINER RPC s owner-checkom).
--
-- ⚠️⚠️ NAJVAZNIJE — `FROM anon, authenticated` SAMO PO SEBI NE BI UCINILO NISTA.
-- Zateceni ACL je glasio:
--     {=X/postgres, postgres=X/postgres, anon=X/postgres, authenticated=X/postgres, ...}
-- Onaj prvi clan bez imena role je **PUBLIC**. Obje role izvrsavanje nasljeduju i preko
-- njega, pa bi revoke bez `FROM PUBLIC` ostavio pravo netaknuto — a plan bi izgledao
-- ispunjeno. Zato `from public, anon, authenticated`.
--
-- ⛔ `is_admin()` SE NE DIRA — zovu ga RLS politike kao POZIVATELJ; bez granta
-- authenticated-u politike prestaju raditi. Njegova dva upozorenja ostaju NAMJERNO.
--
-- DOKAZ DA OKIDACI NASTAVLJAJU RADITI (staging, POSLIJE revokea): stvoren je korisnik
-- preko admin API-ja i redak u `public.profiles` je nastao. Okidac se izvrsava kao
-- vlasnik tablice i ne prolazi kroz EXECUTE-grant — sad i izmjereno, ne samo procitano.
--
-- INDEKSI: `content_versions.edited_by` i `node_content_versions.edited_by` su strani
-- kljucevi bez pokrivajuceg indeksa. Audit-tablice su append-only i samo rastu, pa cijena
-- raste s njima; brisanje korisnika mora provjeriti te FK-ove. Tablice su danas male
-- (138 / 10 redaka) → obican CREATE INDEX je trenutacan i CONCURRENTLY ne treba.
--
-- REDOSLIJED PRIMJENE: staging → `npm run test:authed` + `npm run test:storage` zeleni →
-- Leonov IZRICIT OK → produkcija. Ide zajedno s `c3-rls-initplan.sql`.
-- =====================================================================================

begin;

create index if not exists content_versions_edited_by_idx
  on public.content_versions (edited_by);

create index if not exists node_content_versions_edited_by_idx
  on public.node_content_versions (edited_by);

revoke execute on function public.handle_new_user()
  from public, anon, authenticated;

revoke execute on function public.snapshot_content_version()
  from public, anon, authenticated;

commit;

-- =====================================================================================
-- STO OSTAJE POSLIJE OVOGA (security advisor: 15 → 11 WARN):
--   • is_admin — 2 upozorenja, NAMJERNO (gore)
--   • 8 node/publish RPC-ova — NAMJERNO (ADR-024)
--   • set_updated_at ima promjenjiv search_path — JEDINO preostalo koje nije ni namjerno
--     ni pokriveno ovom ciglom. Nije SECURITY DEFINER (prosecdef = false), pa je domet
--     manji; nije ovdje popravljeno da se opseg cigle ne siri bez odluke.
-- =====================================================================================
