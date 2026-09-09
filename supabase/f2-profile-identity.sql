-- =====================================================
-- SOKRAT STUDY — F2/3b: SPREMIŠTE JAVNOG IDENTITETA (RASPORED §F2)
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- NE dira `profiles`, `nodes`, `subject_content`, `publish_document` ni katalog.
--
-- ── ZAŠTO ZASEBNA TABLICA, A NE STUPCI U `profiles` ─────────────────────────────────
-- `profiles` je danas točno `user_id · role · created_at`, i iz nje čita `is_admin()`,
-- kojeg zovu RLS-politike kao pozivatelja. Da ime i opis odu ondje, dvoje bi se pokvarilo:
--
--   ① Korisnik mora smjeti PISATI svoje ime → traži UPDATE-politiku nad `profiles`.
--      Izmjereno 2026-09-09 na stagingu: `profiles` danas ima **jednu jedinu politiku**,
--      `profiles_select_own` (SELECT). **Nijedna write-politika ne postoji** — dakle
--      nitko ne može ni pokušati upisati `role`. Otvoriti UPDATE zbog imena značilo bi
--      sam sebi dopustiti `role = 'admin'` osim ako se to izričito zabrani stupčano.
--      Ovako se to pitanje NE POSTAVLJA: ime nije u istoj tablici.
--   ② F7 (javni profili, ADR-035/036) traži JAVNO čitanje profila. Javna SELECT-politika
--      nad `profiles` odala bi **tko su administratori**. Nad ovom tablicom ne odaje ništa.
--
-- Sigurnosni model (isti kao F1 osobni graditelj, ADR-024):
--   • anon nema NIŠTA · authenticated ima SAMO SELECT (RLS ga filtrira na vlastiti red)
--   • SVAKI upis ide kroz SECURITY DEFINER RPC s `auth.uid()` — nema write-politike
--   • RPC strukturno NE MOŽE dirati `role`: ta je kolona u drugoj tablici koju ne spominje
--
-- Status: primijenjeno na STAGING (czljmvigkgiajzjxtndq) 2026-09-09.
--         PROD (naxjubnedhrbhsuasayu) = TEK uz Leonov IZRIČIT OK.

-- =====================================================
-- 1) Tablica
-- =====================================================
-- `avatar_path` i `cover_path` stoje ovdje od prvog dana iako ih F2/3b NE KORISTI:
-- puni ih F2/2 (slike), a druga migracija nad produkcijom košta više nego dva prazna
-- stupca. ⚠️ U njima stoji PUTANJA u Storageu, nikad sama slika i nikad potpisani URL —
-- potpis istječe, pa bi zapisan URL istrunuo (ista pouka kao `node-img:` u F4).
create table if not exists public.profile_identity (
    user_id      uuid primary key references auth.users(id) on delete cascade,
    display_name text null check (char_length(coalesce(display_name, '')) <= 60),
    bio          text null check (char_length(coalesce(bio, '')) <= 280),
    avatar_path  text null,
    cover_path   text null,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create or replace function public.touch_profile_identity()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
    new.updated_at = now();
    return new;
end;
$$;
drop trigger if exists profile_identity_touch on public.profile_identity;
create trigger profile_identity_touch before update on public.profile_identity
    for each row execute function public.touch_profile_identity();

-- =====================================================
-- 2) RLS — čitanje samo svoje; upisa nema nijednog
-- =====================================================
alter table public.profile_identity enable row level security;

-- ⚠️ SAMO vlastiti red. Javni pogled na tuđi profil dolazi TEK u F7 i tada se ovdje
-- dodaje DRUGA politika — nad ovom tablicom, nikad nad `profiles`.
drop policy if exists "identity owner read" on public.profile_identity;
create policy "identity owner read"
    on public.profile_identity for select
    to authenticated
    using ((select auth.uid()) = user_id);

-- Namjerno NEMA insert/update/delete politike: jedini put upisa je RPC ispod.

-- =====================================================
-- 3) RPC — jedini put upisa
-- =====================================================
-- Vraća upisani red da klijent ne mora u drugi krug po ono što je upravo poslao.
create or replace function public.set_profile_identity(p_display_name text, p_bio text)
returns public.profile_identity
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_name text; v_bio text; r public.profile_identity;
begin
    if auth.uid() is null then raise exception 'auth_required'; end if;

    -- Prazan niz i niz od samih razmaka su ISTO što i „nema ga" — inače bi zid crtao
    -- prazan naslov umjesto da padne na e-adresu.
    v_name := nullif(btrim(coalesce(p_display_name, '')), '');
    v_bio  := nullif(btrim(coalesce(p_bio, '')), '');

    -- Granice se provode OVDJE, ne samo `maxlength` atributom u formi: atribut je
    -- prijedlog pregledniku, a ovo je pravilo. Ista brojka kao u `js/profile.js`.
    if char_length(coalesce(v_name, '')) > 60  then raise exception 'identity_name_too_long: ime smije imati najviše 60 znakova'; end if;
    if char_length(coalesce(v_bio,  '')) > 280 then raise exception 'identity_bio_too_long: opis smije imati najviše 280 znakova';  end if;

    insert into public.profile_identity (user_id, display_name, bio)
    values ((select auth.uid()), v_name, v_bio)
    on conflict (user_id) do update
        set display_name = excluded.display_name,
            bio          = excluded.bio
    returning * into r;

    return r;
end;
$$;

-- =====================================================
-- 4) Grantovi — čitanje kroz RLS, upis samo kroz RPC
-- =====================================================
revoke all    on public.profile_identity from anon, authenticated;
grant  select on public.profile_identity to   authenticated;

revoke execute on function public.touch_profile_identity()             from public, anon, authenticated;
revoke execute on function public.set_profile_identity(text, text)     from public, anon;
grant  execute on function public.set_profile_identity(text, text)     to   authenticated;

-- =====================================================
-- 5) Prijenos zatečenih imena (jednokratno, idempotentno)
-- =====================================================
-- Registracija od R1 piše ime u `user_metadata.display_name`, a OAuth u `full_name`/`name`.
-- Bez ovoga bi tablica postojećim računima bila prazna, pa bi klijent zauvijek visio na
-- rezervnom putu. ⚠️ Rezervni put SVEJEDNO ostaje u `js/profile.js` — novi račun i dalje
-- dobiva ime kroz `signUp`, a PROD ovu tablicu (još) nema.
insert into public.profile_identity (user_id, display_name)
select u.id,
       left(btrim(coalesce(u.raw_user_meta_data->>'display_name',
                           u.raw_user_meta_data->>'full_name',
                           u.raw_user_meta_data->>'name', '')), 60)
  from auth.users u
 where nullif(btrim(coalesce(u.raw_user_meta_data->>'display_name',
                             u.raw_user_meta_data->>'full_name',
                             u.raw_user_meta_data->>'name', '')), '') is not null
on conflict (user_id) do nothing;
