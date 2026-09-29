-- ===== SOKRAT STUDY — H1: brisanje računa ne smije pucati na povijesti materijala =====
--
-- KVAR (izmjereno 2026-09-29 na stagingu, F6 sigurnosna analiza, nalaz N10):
--   `node_content_versions.edited_by references auth.users(id)` nije imao `on delete`, a okidač
--   `snapshot_node_content` ga puni pri SVAKOJ objavi. Brisanje korisnika koji je ikad objavio
--   materijal zato puca („Database error deleting user", FK
--   `node_content_versions_edited_by_fkey`) — i to POSLIJE nego što `delete-account` obriše
--   slike, pa ostaje poluobrisan račun. Kaskada preko `node_id` ne stigne na vrijeme: provjera
--   ovog FK-a okine se u istoj naredbi, prije nego kaskada preko čvora ukloni retke.
--
-- POPRAVAK: `on delete set null` — isti obrazac kao `content_versions.edited_by` (povijest može
--   preživjeti, autor nestane). Za vlastite materijale redak ionako nestaje kaskadom preko
--   `node_id`; `set null` samo znači da FK više ne može blokirati brisanje.
--
-- PRODUKCIJA 29.09. (SELECT): isti FK, pogođen samo administrator (1 od 8) → nitko nije
--   poluobrisan. Primjena: staging, pa PROD u SQL Editoru uz Leonov izričit OK.
--   Idempotentno: može se pustiti više puta.

alter table public.node_content_versions
  drop constraint if exists node_content_versions_edited_by_fkey;

alter table public.node_content_versions
  add constraint node_content_versions_edited_by_fkey
  foreign key (edited_by) references auth.users(id) on delete set null;

-- Provjera (mora vratiti „... ON DELETE SET NULL"):
-- select pg_get_constraintdef(oid) from pg_constraint where conname = 'node_content_versions_edited_by_fkey';
