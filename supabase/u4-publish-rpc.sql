-- =====================================================
-- SOKRAT STUDY — U4: PUBLISH-RPC (EDITOR_PLAN §4.2)
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- Preduvjeti: schema.sql (subject_content) · f4-admin.sql (is_admin) · f4-content-write.sql (snapshot trigger).
--
-- Model:
--   • publish_document() = JEDINA klijentska točka pisanja sadržaja: autorizacija (is_admin) +
--     base_version optimistic concurrency + validacija + upis SVIH redova lekcije (primarni +
--     sestrinski/final) u JEDNOJ transakciji — konflikt ili nevaljan payload = NIŠTA nije upisano.
--   • subject_content.version (bigint, default 1) = monotona verzija PO REDU; bumpa je trigger na
--     SVAKI update (i mimo RPC-a: migrate-content.js, dashboard) → base_version je uvijek istinit.
--   • Postojeći snapshot-trigger (f4-content-write.sql) dalje okida na svaki UPDATE → audit/undo
--     netaknuti. RLS write-policyji (admin) OSTAJU kao druga linija obrane; klijent od U4 piše
--     isključivo kroz ovaj RPC.

-- -----------------------------------------------------
-- 1) Verzijski stupac: postojeći redovi dobivaju 1.
-- -----------------------------------------------------
alter table public.subject_content
    add column if not exists version bigint not null default 1;

-- -----------------------------------------------------
-- 2) touch trigger: updated_at + version zajedno (zamjenjuje set_updated_at NA OVOJ tablici;
--    progress zadržava svoj postojeći set_updated_at trigger).
-- -----------------------------------------------------
create or replace function public.touch_subject_content()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
    new.updated_at = now();
    new.version = old.version + 1;
    return new;
end;
$$;

drop trigger if exists subject_content_set_updated_at on public.subject_content;
drop trigger if exists subject_content_touch on public.subject_content;
create trigger subject_content_touch
    before update on public.subject_content
    for each row execute function public.touch_subject_content();

-- -----------------------------------------------------
-- 3) publish_document(subject, writes): atomična objava.
--    p_writes = [{ "var_name": "...", "payload": {...}, "base_version": N }, ...]
--    Vraća { var_name: nova_verzija, ... } (klijent re-baselinea draft).
-- -----------------------------------------------------
create or replace function public.publish_document(p_subject_id text, p_writes jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    w         jsonb;
    v_var     text;
    v_payload jsonb;
    v_base    bigint;
    v_cur     bigint;
    v_new     bigint;
    v_result  jsonb := '{}'::jsonb;
begin
    -- Autorizacija: samo admin (SECURITY DEFINER zaobilazi RLS, pa funkcija presuđuje sama).
    if not public.is_admin() then
        raise exception 'publish_denied: samo admin smije objavljivati';
    end if;

    if p_subject_id is null or p_subject_id = ''
       or jsonb_typeof(p_writes) is distinct from 'array' or jsonb_array_length(p_writes) = 0 then
        raise exception 'publish_bad_input: treba subject_id i ne-prazan p_writes array';
    end if;

    for w in select value from jsonb_array_elements(p_writes)
    loop
        v_var     := w->>'var_name';
        v_payload := w->'payload';
        v_base    := (w->>'base_version')::bigint;

        if v_var is null or v_var = '' or v_base is null then
            raise exception 'publish_bad_input: svaki write treba var_name i base_version';
        end if;

        -- Validacija payloada: ne-prazan objekt čije su sve top-level vrijednosti objekti
        -- (kategorije lekcije). Dublja shema-validacija ostaje klijentski ajv (validate:schema).
        if jsonb_typeof(v_payload) is distinct from 'object' or v_payload = '{}'::jsonb then
            raise exception 'publish_bad_payload: % — payload mora biti ne-prazan objekt', v_var;
        end if;
        if exists (select 1 from jsonb_each(v_payload) where jsonb_typeof(value) <> 'object') then
            raise exception 'publish_bad_payload: % — sve top-level vrijednosti moraju biti objekti', v_var;
        end if;

        -- Lock reda + optimistic concurrency: tuđa izmjena nakon ulaska u draft = odbij SVE.
        select version into v_cur from public.subject_content
         where subject_id = p_subject_id and var_name = v_var
         for update;
        if not found then
            raise exception 'publish_missing_row: %/%', p_subject_id, v_var;
        end if;
        if v_cur is distinct from v_base then
            raise exception 'publish_version_conflict: % (base %, u bazi %)', v_var, v_base, v_cur;
        end if;

        -- Upis: snapshot-trigger sprema STARO stanje (audit/undo), touch-trigger bumpa verziju.
        update public.subject_content
           set payload = v_payload
         where subject_id = p_subject_id and var_name = v_var
         returning version into v_new;

        v_result := v_result || jsonb_build_object(v_var, v_new);
    end loop;

    return v_result;
end;
$$;

-- -----------------------------------------------------
-- 4) Izvršne ovlasti: anon/public NE (advisor higijena od 1. dana) — samo prijavljeni;
--    is_admin() unutra presuđuje. service_role ima ovlasti implicitno (bypass).
-- -----------------------------------------------------
revoke execute on function public.publish_document(text, jsonb) from public;
revoke execute on function public.publish_document(text, jsonb) from anon;
grant execute on function public.publish_document(text, jsonb) to authenticated;
