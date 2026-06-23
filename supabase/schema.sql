-- =====================================================
-- SOKRAT STUDY — Supabase schema (Backend, staza B: Auth + cloud napredak)
-- =====================================================
-- Pokreni JEDNOM u Supabase dashboardu: SQL Editor → New query → paste → Run.
-- Idempotentno (if not exists / or replace) — sigurno pokrenuti i više puta.
--
-- Model: jedna tablica `progress`. Jedan red = jedan localStorage ključ
-- jednog korisnika (npr. 'marketing-progress', 'marketing-progress-analytics',
-- 'accounting-exercises-progress', 'sokrat-last-position').
-- Sadržaj predmeta NIJE u bazi — ostaje u data/* fajlovima (staza A, kasnije).

create table if not exists public.progress (
    user_id    uuid        not null references auth.users (id) on delete cascade,
    key        text        not null,
    data       jsonb       not null,
    updated_at timestamptz not null default now(),
    primary key (user_id, key)
);

-- updated_at se osvježava automatski na svaki UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists progress_set_updated_at on public.progress;
create trigger progress_set_updated_at
    before update on public.progress
    for each row execute function public.set_updated_at();

-- =====================================================
-- Row Level Security: svaki korisnik vidi i mijenja SAMO svoje retke.
-- Zbog ovoga je frontend smije koristiti publishable (anon) key —
-- bez važeće Auth sesije tablica je nedostupna.
-- =====================================================

alter table public.progress enable row level security;

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
    for select using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
    for insert with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own" on public.progress
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own" on public.progress
    for delete using (auth.uid() = user_id);


-- =====================================================
-- SADRŽAJ PREDMETA (Blok B, read-path) — JAVAN, čita se direktno preko anon keya.
-- =====================================================
-- Model: jedan red = jedan "content script" objekt jednog predmeta (window var).
-- Npr. academic-writing → 4 reda: academicWritingM1 / …M2 / …Final / …Exercises.
-- payload = TOČNO ono što data/<subject>/*.js izlaže na window (RAZRIJEŠENO — final je
-- već Object.assign-an u migraciji, pa frontend samo radi window[var_name] = payload).
--
-- Datoteke ostaju IZVOR ISTINE (staza A); ova tablica je ZRCALO koje puni
-- scripts/migrate-content.js. loadSubjectContent() proba bazu pa padne na datoteke.
--
-- Pokreni JEDNOM u Supabase SQL editoru (idempotentno).

create table if not exists public.subject_content (
    subject_id text        not null,   -- catalog subject id (npr. 'academic-writing')
    var_name   text        not null,   -- window var (npr. 'academicWritingM1')
    payload    jsonb       not null,   -- razriješeni objekt kategorija (flashcards/quiz/fill/learn) ili exercises
    updated_at timestamptz not null default now(),
    primary key (subject_id, var_name)
);

create index if not exists subject_content_subject_idx
    on public.subject_content (subject_id);

drop trigger if exists subject_content_set_updated_at on public.subject_content;
create trigger subject_content_set_updated_at
    before update on public.subject_content
    for each row execute function public.set_updated_at();

-- RLS: SADRŽAJ JE JAVAN → svatko (anon i prijavljeni) smije SELECT.
-- Pisanje NE preko anon keya — samo service_role (migracijska skripta) / dashboard.
alter table public.subject_content enable row level security;

drop policy if exists "subject_content_public_read" on public.subject_content;
create policy "subject_content_public_read" on public.subject_content
    for select using (true);
