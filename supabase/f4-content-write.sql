-- =====================================================
-- SOKRAT STUDY — F4 Admin CRUD, cigla F4.2: WRITE-PATH + VERZIONIRANJE
-- =====================================================
-- Pokreni JEDNOM u Supabase dashboardu (ili preko MCP-a): idempotentno, additivno.
-- Preduvjet: f4-admin.sql (treba is_admin()).
--
-- Model (ADR-021):
--   • Admin (i samo admin) smije pisati u subject_content — direktno iz preglednika pod svojim JWT-om
--     (RLS is_admin() je čuvar; nema server-koda, ADR-016).
--   • SVAKI write (update/delete) automatski snapshota STARI red u content_versions PRIJE prepisa
--     → undo + audit „tko/kad/što" od prve izmjene (4E.1+4E.2). Trigger je SECURITY DEFINER →
--     verzija se UVIJEK zapiše (audit se ne može zaobići čak i da RLS na content_versions zafali).

-- -----------------------------------------------------
-- 1) content_versions: append-only povijest. 1 red = jedan snapshot STAROG payloada.
-- -----------------------------------------------------
create table if not exists public.content_versions (
    id         bigint generated always as identity primary key,
    subject_id text        not null,
    var_name   text        not null,
    payload    jsonb       not null,                                   -- payload PRIJE ove izmjene (za rollback)
    op         text        not null,                                   -- 'UPDATE' | 'DELETE'
    edited_by  uuid        references auth.users (id) on delete set null,  -- tko je napravio izmjenu (auth.uid u trenutku writea)
    edited_at  timestamptz not null default now()
);

-- Brzi „zadnja verzija za predmet/var" lookup (rollback, dry-run diff).
create index if not exists content_versions_lookup_idx
    on public.content_versions (subject_id, var_name, edited_at desc);

-- -----------------------------------------------------
-- 2) Snapshot trigger: PRIJE svakog UPDATE/DELETE spremi STARI red u content_versions.
--    SECURITY DEFINER → upis u povijest ne ovisi o RLS-u (audit-integritet: write bez verzije nemoguć).
-- -----------------------------------------------------
create or replace function public.snapshot_content_version()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    insert into public.content_versions (subject_id, var_name, payload, op, edited_by)
    values (old.subject_id, old.var_name, old.payload, tg_op, auth.uid());
    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

drop trigger if exists subject_content_snapshot on public.subject_content;
create trigger subject_content_snapshot
    before update or delete on public.subject_content
    for each row execute function public.snapshot_content_version();

-- -----------------------------------------------------
-- 3) RLS content_versions: samo admin ČITA povijest. Upis ide ISKLJUČIVO kroz trigger
--    (SECURITY DEFINER, owner=postgres → zaobilazi RLS) → nema client insert policya
--    (klijent ne može krivotvoriti povijest).
-- -----------------------------------------------------
alter table public.content_versions enable row level security;

drop policy if exists "content_versions_admin_read" on public.content_versions;
create policy "content_versions_admin_read" on public.content_versions
    for select using (public.is_admin());

-- -----------------------------------------------------
-- 4) subject_content write policyji: SAMO admin smije insert/update/delete.
--    Postojeći "subject_content_public_read" (select using true) OSTAJE — čitanje je javno.
--    (RLS policyji se OR-aju; ne-admin nema nijedan write policy → write odbijen.)
-- -----------------------------------------------------
drop policy if exists "subject_content_admin_insert" on public.subject_content;
create policy "subject_content_admin_insert" on public.subject_content
    for insert with check (public.is_admin());

drop policy if exists "subject_content_admin_update" on public.subject_content;
create policy "subject_content_admin_update" on public.subject_content
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "subject_content_admin_delete" on public.subject_content;
create policy "subject_content_admin_delete" on public.subject_content
    for delete using (public.is_admin());
