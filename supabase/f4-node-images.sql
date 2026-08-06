-- =====================================================
-- SOKRAT STUDY — F4: STORAGE BUCKET za slike OSOBNOG gradiva (CREATE_BACKEND_SPEC §11 S1+S2)
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- Preduvjeti: f1-nodes.sql (public.nodes). NE dira `lesson-images` ni javni katalog.
--
-- ZAŠTO POSTOJI (dva blokatora nađena u F3, spec §11):
--   • S1 — `lesson-images` traži `is_admin()` za INSERT/UPDATE/DELETE → OBIČAN korisnik NE MOŽE
--          uploadati sliku u svoje osobno gradivo. Značajka bi za prave korisnike bila mrtva.
--   • S2 — `lesson-images` ima `public read` BEZ owner-provjere → slika iz PRIVATNOG čvora bila bi
--          javno čitljiva po URL-u. Privatnost je obećanje ovog otoka (ADR-024).
--
-- Model (Leonova odluka 2026-08-04 — „prava privatnost"):
--   • Bucket je PRIVATAN (`public = false`) → NEMA javnog `/object/public/` puta. Slika se čita
--     isključivo kroz POTPISANI URL koji Storage izda tek nakon SELECT-provjere niže.
--   • Vlasništvo = PRVI SEGMENT PUTANJE: `<auth.uid()>/<node_id>/<uuid>.<ext>`.
--     Sva 4 policyja traže `(storage.foldername(name))[1] = auth.uid()::text` → korisnik vidi i
--     dira SAMO svoj prefiks. Tuđe = 0 redaka (ne 403 — RLS filtrira, pa ni ne odaje postojanje).
--   • `anon` NEMA NIJEDAN policy → odjavljen ne može ni čitati ni listati. (Isti duh kao f1-nodes:
--     anon nema ništa.)
--   • `node_id` segment je ORGANIZACIJSKI, ne sigurnosni — vlasnički prefiks je već presudio.
--     Namjerno NE joinamo `public.nodes` iz storage-policyja: vezali bismo Storage uz shemu
--     kataloga bez sigurnosne dobiti (korisnik ionako može pisati samo pod svoj uid).
--
-- Server-side ograničenja: max 5 MB + samo rasterski image MIME (isto kao `lesson-images`;
-- SVG namjerno izostavljen — može nositi skripte).
--
-- Status: primijenjeno na STAGING (czljmvigkgiajzjxtndq) 2026-08-04.
--         PROD (naxjubnedhrbhsuasayu) = TEK U F5, uz Leonov izričit OK.

-- -----------------------------------------------------
-- 1) Bucket: PRIVATAN, s limitom veličine i dopuštenim MIME-tipovima (idempotentno).
-- -----------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'node-images',
    'node-images',
    false,                                               -- PRIVATAN: nema /object/public/ puta
    5242880,                                             -- 5 MB
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
    public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------
-- 2) RLS policyji na storage.objects za bucket 'node-images'.
--    RLS je na storage.objects već uključen (Supabase default) — dodajemo SAMO politike.
--    Idempotentno: drop-if-exists pa create.
--
--    NAPOMENA: `to authenticated` (nikad `public`) + owner-prefiks u SVAKOM policyju.
--    Potpisivanje URL-a (`createSignedUrl`) prolazi kroz SELECT → tuđu sliku nemoguće potpisati.
-- -----------------------------------------------------

-- Čitanje = samo vlastiti prefiks (ovo je i gate za izdavanje potpisanog URL-a).
drop policy if exists "node-images owner read" on storage.objects;
create policy "node-images owner read"
    on storage.objects for select
    to authenticated
    using (
        bucket_id = 'node-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Upload = samo u vlastiti prefiks.
drop policy if exists "node-images owner insert" on storage.objects;
create policy "node-images owner insert"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'node-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Izmjena (overwrite) = samo vlastiti prefiks, i prije i poslije.
drop policy if exists "node-images owner update" on storage.objects;
create policy "node-images owner update"
    on storage.objects for update
    to authenticated
    using (
        bucket_id = 'node-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
        bucket_id = 'node-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Brisanje = samo vlastiti prefiks.
drop policy if exists "node-images owner delete" on storage.objects;
create policy "node-images owner delete"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'node-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- -----------------------------------------------------
-- Provjera (ručno):
--   select id, public, file_size_limit, allowed_mime_types from storage.buckets where id='node-images';
--   select policyname, cmd, roles from pg_policies where schemaname='storage' and tablename='objects'
--     and policyname like 'node-images%';
--   -- Očekivano: 4 policyja, SVI `{authenticated}`, NIJEDAN `{public}`.
-- -----------------------------------------------------
