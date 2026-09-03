# Mail-predlošci (Supabase Auth)

**Kamo idu:** Supabase Dashboard → Authentication → **Emails → Templates** → odaberi predložak
→ zalijepi sadržaj `.html` datoteke → Save. Subject linije su dolje u tablici.

**Zašto su ovdje, a ne samo u dashboardu:** dashboard nema povijest ni pregled izmjena. Ovo je
izvor istine; dashboard je kopija. Mijenjaš li predložak, mijenjaj OVDJE pa prenesi.

| datoteka | Supabase predložak | Subject (HR) |
|---|---|---|
| `confirm-signup.html` | Confirm signup | Dobrodošao na Sokrat — potvrdi svoju adresu |
| `reset-password.html` | Reset password | Promjena lozinke na Sokratu |
| `change-email.html` | Change email address | Potvrdi novu e-adresu |

## Pravila koja drže mail čitljivim svugdje

Mail-klijenti (Gmail, Outlook, iOS Mail) NISU preglednici — vrijede pravila iz 2005:

- **Tablice za raspored**, ne flex/grid. Outlook koristi Wordov engine za renderiranje.
- **Inline stilovi.** `<style>` blok Gmail briše na nekim klijentima; kritični stilovi idu u
  `style=""` atribut. `<style>` ostaje samo za progressive enhancement (dark mode, mobile).
- **Slike se ne smiju podrazumijevati.** Većina klijenata blokira slike dok korisnik ne klikne
  „prikaži" → svaki `<img>` ima `alt`, a poruka mora imati smisla i BEZ slika. Zato je naslov
  tekst, ne slika.
- **Apsolutni URL-ovi** (`https://www.sokratstudy.com/...`) — relativni ne postoje u mailu.
- **Gumb je tablica s ispunom**, ne `<button>` (Outlook ga ne stilizira) — uz to i goli URL
  ispod, jer neki korporativni klijenti gumbe pretvaraju u čisti tekst.
- **Bez JS-a, bez vanjskog CSS-a, bez web-fontova** — sve se ionako filtrira.
- **Širina 600 px** je povijesni standard koji stane u svaki preview-panel.

## Varijable koje Supabase zamjenjuje

`{{ .ConfirmationURL }}` (gotov link s tokenom) · `{{ .Email }}` · `{{ .SiteURL }}` ·
`{{ .Token }}` (6-znamenkasti kod) · `{{ .Data.display_name }}` (iz `user_metadata`).

⚠️ `{{ .Data.* }}` je prazan kad korisnik nije upisao to polje → nikad ga ne stavljaj u
rečenicu koja bez njega ne stoji („Bok , ..." izgleda kao kvar).
