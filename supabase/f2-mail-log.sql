-- =====================================================
-- SOKRAT STUDY — ZAPIS POSLANIH OBAVIJESTI (F2/4 mail-obavijesti; Leon 15.09.: „možeš krenuti")
-- =====================================================
-- Pokreni JEDNOM po projektu (staging pa produkcija): idempotentno, additivno.
-- NE dira `profiles`, `nodes`, katalog, `publish_document` ni postojeće RPC-ove.
--
-- ── ZAŠTO ─────────────────────────────────────────────────────────────────────────────
-- Mail je NEPOVRATNA radnja prema van: poslan je poslan. `content_versions` je već pravilo za
-- sadržaj („svaki upis ima trag"); ovo je isto pravilo za slanje. Jedan red po SLANJU (ne po
-- primatelju): tko je poslao, što, kojem segmentu i koliko je primatelja bilo — dovoljno da se
-- zna što je izašlo, a da tablica ne postane drugi popis adresa (adrese žive samo u `auth.users`).
--
-- Upis i čitanje SAMO `service_role` (Edge Function `send-notification`, ADR-016): tablica ima RLS
-- i NIJEDNU politiku, a `anon`/`authenticated` nemaju ni grant. Brisanje = audit, samo uz OK.
--
-- Status: STAGING (czljmvigkgiajzjxtndq) — vidi PROGRESS. PROD = TEK uz Leonov IZRIČIT OK,
--         PRIJE deploya funkcije (funkcija upisuje ovamo; bez tablice slanje javlja grešku zapisa).

create table if not exists public.mail_log (
    id          bigint generated always as identity primary key,
    sent_by     uuid        not null,                 -- admin (bez FK: zapis nadživi brisanje računa)
    subject     text        not null check (char_length(subject) between 1 and 120),
    segment     text        not null check (segment in ('fmtu', 'all')),
    recipients  int         not null check (recipients >= 0),
    test        boolean     not null default false,   -- „Pošalji probu meni": jedan primatelj, sam admin
    created_at  timestamptz not null default now()
);

alter table public.mail_log enable row level security;
revoke all on public.mail_log from anon, authenticated;

comment on table public.mail_log is
    'F2/4: jedan red po slanju obavijesti (bez adresa). Upis/čitanje samo service_role (Edge Function). Append-only audit.';
