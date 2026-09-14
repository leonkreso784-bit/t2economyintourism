-- =====================================================
-- SOKRAT STUDY — TEMELJ MREŽE (BACKLOG §🌐 A1–A3; Leon 14.09.: „može, ovo je super")
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- Nadograđuje `f2-profile-identity.sql` + `f2-profile-images.sql`; NE dira `profiles`, `nodes`,
-- katalog, `publish_document` ni postojeće RPC-ove.
--
-- ── ZAŠTO SAD, A NE UZ F7 ─────────────────────────────────────────────────────────────
-- Ovo je ono što je „jeftino sad, skupo poslije": svaka objava i javni profil (F7, ADR-035/036)
-- PRETPOSTAVLJAJU adresu (`@handle`), stupanj vidljivosti i granicu hostinga. Dodani poslije
-- prvog vala korisnika, znače migraciju postojećih računa i odluku „svi javni ili nitko".
--
-- ① `handle` — korisničko ime za adresu profila. 3–20 znakova, [a-z0-9_], jedinstveno.
--    Upis SAMO kroz `set_profile_handle` (SECURITY DEFINER; nema write-politike, kao i dosad).
--    Promjena najviše 1× u 30 dana (prvo postavljanje je slobodno); postavljeno se ne briše,
--    samo zamjenjuje — oslobođeno ime inače odmah preuzme netko drugi.
-- ② `visibility` — private | link | public, zadano private. BEZ sučelja i BEZ javne politike:
--    javnog pogleda nema do F7, pa bi prekidač obećavao nešto što ne radi. F7 ovdje dodaje
--    JEDNU SELECT-politiku filtriranu ovim stupcem (nikad nad `profiles`, v. f2-profile-identity.sql).
-- ③ Kvota: najviše 20 objekata u vlastitom prefiksu `profile-images`. Javan bucket bez granice
--    = besplatan hosting za svakog s računom. Zamjena slike briše staru, pa normalan korisnik
--    ima ≤ 2 — granica dira samo zlouporabu. Meka je (dva usporedna uploada na 19 mogu dati 21),
--    i to je svjesno: posao joj je zaustaviti skriptu, ne brojati točno.
--
-- Status: STAGING (czljmvigkgiajzjxtndq) — vidi PROGRESS. PROD = TEK uz Leonov IZRIČIT OK,
--         i to PRIJE klijenta (klijent čita `handle`; bez stupca pada na rezervni put).

-- =====================================================
-- 1) Stupci
-- =====================================================
alter table public.profile_identity add column if not exists handle            text        null;
alter table public.profile_identity add column if not exists handle_changed_at timestamptz null;
alter table public.profile_identity add column if not exists visibility        text        not null default 'private';

-- Ograničenja idempotentno (Postgres nema ADD CONSTRAINT IF NOT EXISTS).
-- Oblik se provjerava i OVDJE, ne samo u RPC-u: RPC je jedini upisivač danas, ali tablica
-- ne smije vjerovati da će to zauvijek tako ostati.
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'profile_identity_handle_format'
                   and conrelid = 'public.profile_identity'::regclass) then
        alter table public.profile_identity add constraint profile_identity_handle_format
            check (handle is null or handle ~ '^[a-z0-9_]{3,20}$');
    end if;
    -- Jedinstvenost: NULL-ovi se ne sudaraju (račun bez imena je normalno stanje).
    -- Pravilo oblika već drži sva slova malima, pa je obični unique dovoljan (bez citext-a).
    if not exists (select 1 from pg_constraint where conname = 'profile_identity_handle_key'
                   and conrelid = 'public.profile_identity'::regclass) then
        alter table public.profile_identity add constraint profile_identity_handle_key unique (handle);
    end if;
    if not exists (select 1 from pg_constraint where conname = 'profile_identity_visibility_check'
                   and conrelid = 'public.profile_identity'::regclass) then
        alter table public.profile_identity add constraint profile_identity_visibility_check
            check (visibility in ('private', 'link', 'public'));
    end if;
end $$;

-- =====================================================
-- 2) Rezervirana imena — popis koji nitko ne čita izravno
-- =====================================================
-- Tablica, a ne niz u funkciji: popis raste (nova ruta, nova marka) bez nove verzije RPC-a.
-- RLS uključen i BEZ ijedne politike + bez grantova → anon/authenticated ne vide ništa;
-- čita ju samo `set_profile_handle` (SECURITY DEFINER).
create table if not exists public.reserved_handles (
    handle text primary key check (handle ~ '^[a-z0-9_]{1,20}$')
);
alter table public.reserved_handles enable row level security;
revoke all on public.reserved_handles from anon, authenticated;

insert into public.reserved_handles (handle) values
    -- uloge i marka
    ('admin'), ('administrator'), ('root'), ('superuser'), ('moderator'), ('mod'), ('staff'),
    ('official'), ('team'), ('support'), ('help'), ('security'), ('system'),
    ('sokrat'), ('sokratstudy'), ('sokrat_study'), ('sokrat_ai'),
    -- rute i pojmovi aplikacije (buduće adrese ne smiju pripasti korisniku)
    ('api'), ('auth'), ('login'), ('logout'), ('signin'), ('signup'), ('register'), ('oauth'),
    ('profile'), ('profil'), ('settings'), ('account'), ('racun'), ('me'), ('user'), ('users'),
    ('about'), ('contact'), ('faq'), ('privacy'), ('terms'), ('legal'), ('blog'), ('news'),
    ('docs'), ('app'), ('www'), ('mail'), ('email'), ('static'), ('assets'), ('cdn'),
    ('catalog'), ('katalog'), ('subjects'), ('predmeti'), ('materials'), ('materijali'),
    ('editor'), ('studio'), ('explore'), ('search'), ('trazi'), ('feed'), ('home'),
    ('null'), ('undefined'), ('anonymous'), ('anon')
on conflict (handle) do nothing;

-- =====================================================
-- 3) RPC — jedini put upisa korisničkog imena
-- =====================================================
-- Kodovi grešaka (klijent ih prevodi, `js/profile.js`): handle_invalid · handle_reserved ·
-- handle_taken · handle_cooldown. Tekst iza dvotočke je za ljude u logu, ne za sučelje.
create or replace function public.set_profile_handle(p_handle text)
returns public.profile_identity
language plpgsql security definer set search_path = public, pg_temp as $$
declare
    v_uid uuid := auth.uid();
    v     text;
    cur   public.profile_identity;
    r     public.profile_identity;
begin
    if v_uid is null then raise exception 'auth_required'; end if;

    -- Normalizacija PRIJE provjere: „ Leon_1 " i „leon_1" su isto ime, pa se ne smiju oba dodijeliti.
    v := lower(btrim(coalesce(p_handle, '')));
    if v !~ '^[a-z0-9_]{3,20}$' then
        raise exception 'handle_invalid: 3–20 znakova, samo a–z, 0–9 i _';
    end if;
    if exists (select 1 from public.reserved_handles where handle = v) then
        raise exception 'handle_reserved: ime % je rezervirano', v;
    end if;

    -- `for update`: dva usporedna poziva istog korisnika ne smiju oba proći pokraj pravila 30 dana.
    select * into cur from public.profile_identity where user_id = v_uid for update;
    if found and cur.handle = v then
        return cur;                                   -- isto ime: ništa se ne mijenja, sat ne kreće iznova
    end if;
    if found and cur.handle is not null
       and cur.handle_changed_at is not null
       and cur.handle_changed_at > now() - interval '30 days' then
        raise exception 'handle_cooldown: ime se smije mijenjati jednom u 30 dana (sljedeće: %)',
            (cur.handle_changed_at + interval '30 days')::date;
    end if;

    begin
        insert into public.profile_identity (user_id, handle, handle_changed_at)
        values (v_uid, v, now())
        on conflict (user_id) do update
            set handle = excluded.handle,
                handle_changed_at = excluded.handle_changed_at
        returning * into r;
    exception when unique_violation then
        raise exception 'handle_taken: ime % je zauzeto', v;
    end;

    return r;
end;
$$;

revoke execute on function public.set_profile_handle(text) from public, anon;
grant  execute on function public.set_profile_handle(text) to   authenticated;

-- =====================================================
-- 4) Kvota slika — INSERT-politika `profile-images` dobiva granicu od 20 objekata
-- =====================================================
-- ⚠️ Brojanje NE SMIJE biti podupit nad storage.objects unutar politike nad storage.objects.
--    Prva verzija je to radila i na stagingu IZMJERENO srušila SVAKI upload u bucket (ne samo 21.):
--    `42P17 infinite recursion detected in policy for relation "objects"`, a Storage API to javlja
--    kao „The database schema is invalid or incompatible." Postgres politiku koja čita vlastitu
--    tablicu odbija bez obzira na to što SELECT-politike ne čitaju INSERT-politike.
--    → Broji SECURITY DEFINER funkcija (vlasnik `postgres` zaobilazi RLS, kao `set_profile_image`).
--    Ne prima argument: broji ISKLJUČIVO pozivateljev prefiks (`auth.uid()`), pa ništa tuđe ne
--    može otkriti. EXECUTE MORA ostati `authenticated`-u — politiku izvršava pozivatelj (isti
--    razlog zbog kojeg se `is_admin()` ne revokea).
create or replace function public.profile_images_count_mine()
returns integer
language sql stable security definer set search_path = '' as $$
    select count(*)::integer
      from storage.objects o
     where o.bucket_id = 'profile-images'
       and (storage.foldername(o.name))[1] = (select auth.uid())::text;
$$;
revoke execute on function public.profile_images_count_mine() from public, anon;
grant  execute on function public.profile_images_count_mine() to   authenticated;

drop policy if exists "profile-images owner insert" on storage.objects;
create policy "profile-images owner insert"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'profile-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
        and (select public.profile_images_count_mine()) < 20
    );

-- =====================================================
-- Provjera (ručno):
--   select column_name, is_nullable, column_default from information_schema.columns
--    where table_schema='public' and table_name='profile_identity';   -- + handle, handle_changed_at, visibility
--   select conname from pg_constraint where conrelid='public.profile_identity'::regclass;
--   select count(*) from public.reserved_handles;                     -- > 0
--   select with_check from pg_policies where policyname='profile-images owner insert';  -- sadrži "< 20"
-- =====================================================
