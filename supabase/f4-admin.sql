-- =====================================================
-- SOKRAT STUDY — F4 Admin CRUD, cigla F4.1: ADMIN IDENTITET (profiles + is_admin() + RLS)
-- =====================================================
-- Pokreni JEDNOM u Supabase dashboardu: SQL Editor → New query → paste → Run.
-- Idempotentno (if not exists / or replace / drop-then-create) — sigurno pokrenuti više puta.
-- Additivno na schema.sql (ne dira postojeće progress/subject_content).
--
-- Model (ADR-021): baza zna „tko je admin". Klijent to smije PROČITATI (za gate UI-ja),
-- ali NE promijeniti — `role` se mijenja SAMO preko dashboarda/service_role (nema client
-- insert/update/delete policya na profiles). is_admin() je reusable u budućim RLS policyjima
-- (F4.2: admin-write na subject_content).

-- -----------------------------------------------------
-- 1) profiles: jedan red po korisniku, nosi ulogu.
-- -----------------------------------------------------
create table if not exists public.profiles (
    user_id    uuid        primary key references auth.users (id) on delete cascade,
    role       text        not null default 'user',   -- 'user' | 'admin'
    created_at timestamptz not null default now()
);

-- -----------------------------------------------------
-- 2) Auto-provisioning: svaki novi auth.users dobije profiles red (role='user').
--    SECURITY DEFINER (trigger piše u profiles neovisno o RLS-u pozivatelja).
-- -----------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    insert into public.profiles (user_id) values (new.id)
    on conflict (user_id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Backfill: postojeći korisnici (napravljeni prije triggera) dobiju profil.
insert into public.profiles (user_id)
    select id from auth.users
    on conflict (user_id) do nothing;

-- -----------------------------------------------------
-- 3) is_admin(): reusable provjera za RLS policyje (F4.2+).
--    SECURITY DEFINER → čita profiles neovisno o RLS-u (inače bi self-ref u policyju curio/petljao).
--    STABLE → planer smije keširati unutar upita.
-- -----------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
    select exists (
        select 1 from public.profiles
        where user_id = auth.uid() and role = 'admin'
    );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- -----------------------------------------------------
-- 4) RLS: korisnik smije ČITATI samo svoj profil. Nema client write policya →
--    role je immutable iz klijenta (admin se ne može sam promaknuti).
-- -----------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = user_id);

-- -----------------------------------------------------
-- 5) SEED admina (Leon). Pokreni RUČNO nakon gornjeg (ili odkomentiraj):
--    update public.profiles set role = 'admin'
--    where user_id = (select id from auth.users where email = 'leonkreso784@gmail.com');
-- -----------------------------------------------------
