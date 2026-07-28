-- =====================================================
-- SOKRAT STUDY — U8.7: STORAGE BUCKET za slike lekcija (EDITOR_PLAN §12.2, F2/EDITOR_FEEDBACK)
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- Preduvjeti: f4-admin.sql (public.is_admin()).
--
-- Model (po ADR-011 / ADR-016):
--   • Autor (admin) upload-a sliku IZRAVNO iz preglednika: SokratAuth klijent (user JWT) →
--     storage.from('lesson-images').upload(...) → getPublicUrl → URL u block.src. BEZ /api,
--     BEZ Edge Functiona, BEZ service_role (isti direktni-klijent+RLS obrazac kao read-path).
--   • Bucket = JAVAN (public read) → student vidi <img src> bez logina (slike = javan sadržaj);
--     UPIS/izmjena/brisanje = SAMO admin (RLS `is_admin()` na storage.objects za ovaj bucket).
--   • Server-side ograničenja na bucketu: max 5 MB + samo rasterski image MIME (png/jpeg/webp/gif).
--     Renderer NEPROMIJENJEN — `safeUrl` već pušta https i data:image (bez SVG-a: SVG može nositi skripte).

-- -----------------------------------------------------
-- 1) Bucket: javan, s limitom veličine i dopuštenim MIME-tipovima (idempotentno).
-- -----------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'lesson-images',
    'lesson-images',
    true,
    5242880,                                             -- 5 MB
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
    public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------
-- 2) RLS policyji na storage.objects za bucket 'lesson-images'.
--    RLS je na storage.objects već uključen (Supabase default) — dodajemo SAMO politike.
--    Idempotentno: drop-if-exists pa create.
-- -----------------------------------------------------

-- Javno čitanje (bilo tko; slike su javan sadržaj). Public bucket serve-a i preko public URL-a,
-- ali eksplicitni SELECT pokriva i list/API pristup.
drop policy if exists "lesson-images public read" on storage.objects;
create policy "lesson-images public read"
    on storage.objects for select
    to public
    using (bucket_id = 'lesson-images');

-- Upload = samo admin (authenticated + is_admin()).
drop policy if exists "lesson-images admin insert" on storage.objects;
create policy "lesson-images admin insert"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'lesson-images' and public.is_admin());

-- Izmjena (npr. overwrite) = samo admin.
drop policy if exists "lesson-images admin update" on storage.objects;
create policy "lesson-images admin update"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'lesson-images' and public.is_admin())
    with check (bucket_id = 'lesson-images' and public.is_admin());

-- Brisanje = samo admin.
drop policy if exists "lesson-images admin delete" on storage.objects;
create policy "lesson-images admin delete"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'lesson-images' and public.is_admin());

-- -----------------------------------------------------
-- Provjera (ručno):
--   select id, public, file_size_limit, allowed_mime_types from storage.buckets where id='lesson-images';
--   select policyname, cmd, roles from pg_policies where schemaname='storage' and tablename='objects'
--     and policyname like 'lesson-images%';
-- -----------------------------------------------------
