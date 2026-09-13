-- =====================================================
-- SOKRAT STUDY — F2/2: PROFILNA SLIKA + NASLOVNA (RASPORED §F2, cigla 1 = baza)
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- Preduvjet: f2-profile-identity.sql (stupci `avatar_path`/`cover_path` već postoje).
-- NE dira `profiles`, `nodes`, `node-images`, `lesson-images`, `publish_document` ni katalog.
--
-- ── ZAŠTO JAVAN BUCKET, A NE PRIVATAN KAO `node-images` (Leon, 2026-09-09) ──────────────
-- Avatar postoji da bi ga se VIDJELO: F7 (objava) ga otvara svima, a potpisani URL bi tražio
-- krug prema bazi prije svakog crtanja i ne bi se kesirao na CDN-u. Cijena je izgovorena i
-- prihvaćena: tko ima URL, vidi sliku i bez prijave. Zato:
--   • ime datoteke nosi UUID → stara slika se nakon zamjene NE DA POGODITI, a klijent je
--     briše čim nova sjedne (delete-politika ispod);
--   • JAVNO je samo ČITANJE po točnom URL-u — LISTANJE tuđeg prefiksa i dalje traži
--     SELECT-politiku, koje za tuđe nema. Bucket ne odaje što u njemu ima.
--
-- ── ZAŠTO ZASEBAN BUCKET, A NE MAPA U `node-images` ─────────────────────────────────────
-- `public` je svojstvo BUCKETA, ne mape. Da su slike profila u `node-images`, ili bi cijelo
-- osobno gradivo postalo javno (ruši ADR-024), ili bi avatar tražio potpis (v. gore).
--
-- ── SIGURNOSNI MODEL (isti kalup kao f4-node-images + f2-profile-identity) ───────────────
--   • Vlasništvo = PRVI SEGMENT PUTANJE: `<auth.uid()>/<vrsta>/<uuid>.<ext>`, vrsta ∈ {avatar, cover}.
--     Sve 4 politike traže `(storage.foldername(name))[1] = auth.uid()::text` (u InitPlan obliku,
--     c3-rls-initplan) → korisnik piše, lista i briše SAMO svoj prefiks.
--   • `anon` NEMA NIJEDNU politiku: odjavljen ne može ni uploadati ni listati. Javno čitanje po
--     URL-u ne ide kroz RLS nego kroz `public = true` — to je jedino što je „javno".
--   • Putanja ulazi u `profile_identity` ISKLJUČIVO kroz `set_profile_image` RPC, koji
--     STRUKTURNO odbija tuđi prefiks i nepostojeći objekt. Bez toga bi korisnik mogao u svoj
--     red upisati tuđu putanju — javno vidljivu, ali ne njegovu — pa bi brisanje „svoje" stare
--     slike ciljalo tuđi objekt (RLS bi ga odbio, ali zašto uopće dopustiti taj oblik).
--   • RPC NIKAD ne dira `display_name`/`bio` (ne prepisuje ih pri upsertu) ni `profiles.role`
--     (druga tablica koju ne spominje) — isti razlog kao u f2-profile-identity.sql.
--
-- ── ŠTO RPC NAMJERNO NE RADI ─────────────────────────────────────────────────────────────
-- Ne briše STARI objekt iz Storagea. `delete from storage.objects` skida samo redak; datoteka
-- u S3 ostaje kao siroče (Supabase to izričito ne preporučuje). Brisanje ide kroz Storage API
-- iz klijenta (delete-politika), a `delete-account` Edge Function čisti cijeli prefiks
-- prije brisanja računa — inače Supabase odbija obrisati vlasnika objekata u Storageu.
--
-- Server-side ograničenja: 5 MB + samo rasterski image MIME. Klijent smanjuje u pregledniku
-- (avatar ~512 px, naslovna ~1500 px, WebP), pa je 5 MB ZID, ne očekivana veličina.
-- GIF namjerno nije na popisu (avatar se ne miče), SVG nikad (može nositi skripte).
--
-- Status: primijenjeno na STAGING (czljmvigkgiajzjxtndq) 2026-09-13.
--         PROD (naxjubnedhrbhsuasayu) = TEK uz Leonov IZRIČIT OK.

-- =====================================================
-- 1) Bucket: JAVAN, s limitom veličine i dopuštenim MIME-tipovima (idempotentno)
-- =====================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'profile-images',
    'profile-images',
    true,                                                -- JAVAN: čitanje po točnom URL-u bez prijave
    5242880,                                             -- 5 MB — zid, ne cilj (klijent smanjuje)
    array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
    public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- =====================================================
-- 2) RLS na storage.objects za bucket 'profile-images' — samo vlastiti prefiks, samo prijavljeni
-- =====================================================
-- Listanje vlastitog prefiksa (čišćenje starih slika). Tuđe = 0 redaka, ne 403.
drop policy if exists "profile-images owner read" on storage.objects;
create policy "profile-images owner read"
    on storage.objects for select
    to authenticated
    using (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "profile-images owner insert" on storage.objects;
create policy "profile-images owner insert"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "profile-images owner update" on storage.objects;
create policy "profile-images owner update"
    on storage.objects for update
    to authenticated
    using (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    )
    with check (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "profile-images owner delete" on storage.objects;
create policy "profile-images owner delete"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

-- =====================================================
-- 3) RPC — jedini put kojim putanja ulazi u profile_identity
-- =====================================================
-- `p_kind` ∈ {'avatar','cover'} bira stupac; `p_path` NULL = makni sliku.
-- Vraća upisani red (isti oblik kao set_profile_identity) da klijent ne ide u drugi krug.
create or replace function public.set_profile_image(p_kind text, p_path text)
returns public.profile_identity
language plpgsql security definer set search_path = public, pg_temp as $$
declare
    v_uid  uuid := auth.uid();
    v_path text;
    r      public.profile_identity;
begin
    if v_uid is null then raise exception 'auth_required'; end if;
    if p_kind is distinct from 'avatar' and p_kind is distinct from 'cover' then
        raise exception 'image_kind_invalid: vrsta smije biti avatar ili cover';
    end if;

    v_path := nullif(btrim(coalesce(p_path, '')), '');

    if v_path is not null then
        -- ① Putanja mora biti U VLASTITOM prefiksu i u mapi te vrste: `<uid>/<kind>/<datoteka>`.
        --    Ovo je sigurnosni uvjet — tuđa putanja ne ulazi u moj red ni kad je javno vidljiva.
        if (storage.foldername(v_path))[1] is distinct from v_uid::text
           or (storage.foldername(v_path))[2] is distinct from p_kind
           or array_length(storage.foldername(v_path), 1) <> 2 then
            raise exception 'image_not_owned: putanja nije u vlastitom prefiksu %/%', v_uid, p_kind;
        end if;
        -- ② Objekt mora POSTOJATI u bucketu — inače bi zid crtao polomljenu sliku, a klijent bi
        --    mogao „rezervirati" ime koje nikad nije uploadao. (Funkcija je SECURITY DEFINER u
        --    vlasništvu `postgres` s bypassrls, pa vidi storage.objects; vlasništvo je već
        --    presuđeno u ①, ovo je samo provjera postojanja.)
        if not exists (select 1 from storage.objects
                        where bucket_id = 'profile-images' and name = v_path) then
            raise exception 'image_not_found: objekt % ne postoji u profile-images', v_path;
        end if;
    end if;

    -- Upsert koji dira SAMO traženi stupac: ime i opis ostaju kakvi jesu (i NULL kad red tek
    -- nastaje — klijent za ime ima rezervni put preko user_metadata).
    insert into public.profile_identity (user_id, avatar_path, cover_path)
    values (v_uid,
            case when p_kind = 'avatar' then v_path else null end,
            case when p_kind = 'cover'  then v_path else null end)
    on conflict (user_id) do update
        set avatar_path = case when p_kind = 'avatar' then v_path else public.profile_identity.avatar_path end,
            cover_path  = case when p_kind = 'cover'  then v_path else public.profile_identity.cover_path  end
    returning * into r;

    return r;
end;
$$;

-- =====================================================
-- 4) Grantovi — RPC samo prijavljenima; tablica ostaje kakva jest (SELECT kroz RLS, bez upisa)
-- =====================================================
revoke execute on function public.set_profile_image(text, text) from public, anon;
grant  execute on function public.set_profile_image(text, text) to   authenticated;

-- =====================================================
-- Provjera (ručno):
--   select id, public, file_size_limit, allowed_mime_types from storage.buckets where id='profile-images';
--   select policyname, cmd, roles from pg_policies where schemaname='storage' and tablename='objects'
--     and policyname like 'profile-images%';
--   -- Očekivano: public = true · 4 politike, SVE `{authenticated}`, NIJEDNA `{public}`/`{anon}`.
--   select proname, prosecdef from pg_proc where proname = 'set_profile_image';  -- prosecdef = t
-- =====================================================
