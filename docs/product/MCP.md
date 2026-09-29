# MCP — „Spoji svoj AI": definicija i kriteriji prihvaćanja

> **Što:** korisnik spoji vlastiti AI (Claude, ChatGPT) sa Sokratom, da AI materijal iz chata pretvori u
> **nacrt** lekcija, kartica i pitanja. Korisnik nacrt pregleda i tek tada on postaje gradivo.
> Zašto je to glavni put stvaranja: ADR-030 · ADR-031 · [ADR-038](../records/DECISIONS.md#adr-038).
> Kako se gradi: [plan/MCP.md](../plan/MCP.md) · sigurnost: [architecture/MCP_SECURITY.md](../architecture/MCP_SECURITY.md).

## Invarijante proizvoda

- **AI je korisnikov.** Mi ne plaćamo tokene i ne vidimo njegov razgovor; kvalitetu drže brane, ne upute.
- **Datoteku nikad ne vidimo.** Materijal ulazi u chat; do nas stiže samo ono što AI napiše kroz alate.
- **Sve ide u nacrt.** AI ne objavljuje, ne briše i ne mijenja postojeće gradivo.
- **Doseg je samo vlastito gradivo** — ni tuđe, ni javni katalog, ni čitanje kataloga.
- **Vježbe nisu dio MCP-a** (ADR-018).

## Kriteriji prihvaćanja

| mogućnost | gotovo kad korisnik može… |
|---|---|
| spajanje | …u Claudeu ili ChatGPT-u dodati Sokrat kao konektor, prijaviti se svojim računom i vidjeti **koja** aplikacija traži pristup prije nego pristane |
| pregled veza | …u profilu vidjeti popis spojenih AI-jeva s datumom i **prekinuti** svaku vezu, uz jasno rečeno koliko dugo već izdan pristup još vrijedi |
| čitanje vlastitog | …pitati svoj AI što ima na policama i dobiti točan popis svojih materijala — i ništa tuđe |
| nacrt | …dati AI-ju svoj materijal kroz chat i u Sokratu zateći **nacrt** s lekcijama (svaka svoje boje), karticama i pitanjima, a da se nijedan postojeći materijal nije promijenio |
| redoslijed | …računati na to da nacrt ima Learn prije kartica i kartice prije pitanja, i da svaka kartica ima barem jedno pitanje |
| pregled | …otvoriti nacrt i vidjeti ga točno onako kako će izgledati pri učenju, bez ičega što se izvršava ili vodi izvan stranice bez njegova klika |
| prihvat | …jednim potezom prihvatiti nacrt u policu koju sam izabere, ili ga odbaciti — i nijedan AI to ne može napraviti umjesto njega |
| sukob | …biti siguran da prihvat ne pregazi izmjenu koju je u međuvremenu napravio sam; u sukobu dobiva poruku, ne tihi gubitak |
| prekid | …nakon prekinute veze u chatu ili ponovljenog zahtjeva zateći **jedan** nacrt, ne dva |
| granice | …znati koliko nacrta smije čekati i dobiti razumljivu poruku kad je granica dosegnuta |
| brisanje računa | …obrisati račun i znati da su nestali i nacrti i veze s AI-jevima |

## Ne-ciljevi

- AI koji objavljuje ili dijeli materijal.
- AI koji mijenja postojeći materijal izravno (izmjena ide kroz novi nacrt).
- Uvoz datoteka na naš poslužitelj.
- Vježbe i formule kroz MCP.
- Plaćeni AI s naše strane.
