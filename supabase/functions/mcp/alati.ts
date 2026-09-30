// ===== SOKRAT STUDY — MCP alati: ČISTA jezgra (F6 ①/1, ADR-030/031/038) =====
//
// Zašto zaseban modul: `index.ts` je samo omot (prijava + MCP prijenos) i ne da se testirati bez
// Denoa i mreže. Sve što alat ODLUČUJE — koje stupce čita, kako slaže stablo, što vraća AI-ju —
// živi ovdje, bez ijednog Deno- ili npm-uvoza, pa ga Node 24 učita izravno
// (`tests/unit/mcp-alati.test.js`, kalup `_shared/mail-core.ts`).
//
// ─── DOSEG (ADR-026/031, tvrdo) ─────────────────────────────────────────────────────────────────
//   • Čita se SAMO kroz klijent koji je `withSupabase({ auth: 'user' })` vezao na korisnikov token
//     → RLS (`nodes_select_own`) vraća isključivo njegove čvorove. Ovaj modul NIKAD ne dobiva
//     admin-klijent i ne zna za javni katalog (ni čitanje).
//   • ①/1 je SAMO ČITANJE. Upis ide tek kroz nacrt (`node_drafts`, ②/1) — nikad u žive tablice.

/** Upute koje AI dobiva pri spajanju (MCP `instructions`). Kvalitetu držimo branama, ne promptom. */
export const UPUTE = [
  'Sokrat Study is a study platform. This connector works ONLY with the signed-in user\'s own study materials.',
  'Materials live on shelves (folders). Right now you can only read the list of shelves and materials.',
  'Reply to the user in the language they write in.'
].join('\n');

export const POSLUZITELJ = { name: 'sokrat-study', version: '0.1.0' } as const;

/** Stupci koje alat čita — izričito, nikad `*` (novi stupac ne smije tiho procuriti AI-ju). */
export const STUPCI_CVORA = 'id,parent_id,kind,name,position,updated_at';

export interface Cvor {
  id: string;
  parent_id: string | null;
  kind: 'folder' | 'study';
  name: string;
  position: number;
  updated_at: string;
}

export interface Stavka {
  id: string;
  vrsta: 'polica' | 'materijal';
  naziv: string;
  djeca?: Stavka[];
}

/** Minimalni oblik supabase-js klijenta koji alat koristi — test ga podmeće. */
export interface CitacCvorova {
  from(tablica: 'nodes'): {
    select(stupci: string): {
      is(stupac: 'deleted_at', vrijednost: null): {
        order(stupac: 'position', opcije: { ascending: boolean }): PromiseLike<{ data: Cvor[] | null; error: { message: string } | null }>;
      };
    };
  };
}

/** Složi ravan popis čvorova u stablo polica → materijala, redom `position`. */
export function slozStablo(cvorovi: Cvor[]): Stavka[] {
  const poRoditelju = new Map<string | null, Cvor[]>();
  for (const c of cvorovi) {
    const k = c.parent_id ?? null;
    if (!poRoditelju.has(k)) poRoditelju.set(k, []);
    poRoditelju.get(k)!.push(c);
  }
  const ids = new Set(cvorovi.map((c) => c.id));
  const grana = (roditelj: string | null, put: Set<string>): Stavka[] =>
    (poRoditelju.get(roditelj) ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .filter((c) => !put.has(c.id))
      .map((c) => {
        const s: Stavka = { id: c.id, vrsta: c.kind === 'folder' ? 'polica' : 'materijal', naziv: c.name };
        if (c.kind === 'folder') s.djeca = grana(c.id, new Set(put).add(c.id));
        return s;
      });
  // Čvor čiji roditelj nije u popisu (roditelj obrisan, dijete nije) ne smije NESTATI iz odgovora:
  // stavi ga u korijen, da AI ne tvrdi korisniku da materijal ne postoji.
  const siroce = cvorovi.filter((c) => c.parent_id !== null && !ids.has(c.parent_id)).map((c) => c.parent_id);
  const korijen = grana(null, new Set());
  for (const p of new Set(siroce)) korijen.push(...grana(p, new Set()));
  return korijen;
}

function brojiMaterijale(stablo: Stavka[]): number {
  return stablo.reduce((n, s) => n + (s.vrsta === 'materijal' ? 1 : 0) + brojiMaterijale(s.djeca ?? []), 0);
}

/** Alat `procitaj_materijale`: vlastite police i materijali prijavljenog korisnika. */
export async function procitajMaterijale(klijent: CitacCvorova): Promise<{ tekst: string; stablo: Stavka[]; materijala: number }> {
  const { data, error } = await klijent.from('nodes').select(STUPCI_CVORA).is('deleted_at', null).order('position', { ascending: true });
  if (error) throw new Error('read_failed: ' + error.message);
  const stablo = slozStablo(data ?? []);
  const materijala = brojiMaterijale(stablo);
  const tekst = stablo.length === 0
    ? 'The user has no shelves or materials yet.'
    : JSON.stringify({ materijala, stablo }, null, 2);
  return { tekst, stablo, materijala };
}

// ─── ②/1b (N9): imenovano odbijanje iz baze → poruka koju AI može ISKORISTITI ─────────────────────
// PostgREST kvotu i „već predan" vraća kao HTTP 500, pa AI ne razlikuje „pokušaj kasnije" od kvara.
// Baza svako odbijanje imenuje (`<ime>: …`); ovdje se ime prevodi u VRSTU (što AI treba učiniti) i
// poruku. Popis se ne pamti: unit ga izvodi iz `f6-nacrt.sql` + validatora i pada na novom imenu
// bez prijevoda ili na mrtvom prijevodu. Nepoznato = „kvar", bez unutarnjih detalja.
export type VrstaOdbijanja = 'ispravi' | 'ponovno' | 'korisnik' | 'stop' | 'kvar';
export const ODBIJANJA: Record<string, { vrsta: VrstaOdbijanja; poruka: string }> = {
  sadrzaj_neispravan: { vrsta: 'ispravi', poruka: 'The content breaks a Sokrat content rule. Fix exactly this and send it again:' },
  nacrt_prevelik: { vrsta: 'ispravi', poruka: 'The draft is larger than 1 MB. Split the material into several drafts.' },
  nacrt_los_oblik: { vrsta: 'ispravi', poruka: 'The draft content must be a JSON object (lessons keyed by id).' },
  nacrt_los_kljuc: { vrsta: 'ispravi', poruka: 'The repeat key is required: 1–100 characters from A-Z a-z 0-9 _ . : -' },
  nacrt_bez_verzije: { vrsta: 'ispravi', poruka: 'Send the draft version you started from (read the draft first).' },
  nacrt_prazan: { vrsta: 'ispravi', poruka: 'An empty draft cannot be submitted. Write at least one lesson first.' },
  nacrt_sukob: { vrsta: 'ponovno', poruka: 'The draft changed since you read it. Read it again, merge your change, and write with the new version.' },
  nacrt_ne_postoji: { vrsta: 'stop', poruka: 'This draft does not exist (or it expired after 7 days untouched). Start a new draft.' },
  nacrt_predan: { vrsta: 'stop', poruka: 'This draft is already submitted and frozen. The user must accept or discard it; start a new draft for more changes.' },
  nacrt_kvota_u_izradi: { vrsta: 'korisnik', poruka: 'The user already has 3 drafts in progress. Submit one of them before starting another.' },
  nacrt_kvota_nepregledano: { vrsta: 'korisnik', poruka: '10 drafts are waiting for the user\'s review. Ask the user to accept or discard some in Sokrat.' },
  nacrt_samo_ai: { vrsta: 'stop', poruka: 'Drafts can only be written through a connected AI.' },
  nacrt_bez_identiteta: { vrsta: 'stop', poruka: 'The connection has no signed-in user. Ask the user to reconnect Sokrat.' }
};

/** Greška iz supabase-js (`{ message }`) → `{ kod, vrsta, poruka }`. Razlog se zadržava samo za
 *  `sadrzaj_neispravan` (govori o korisnikovom vlastitom sadržaju i AI ga mora znati da ispravi). */
export function prevediOdbijanje(greska: { message?: string } | null | undefined): { kod: string; vrsta: VrstaOdbijanja; poruka: string } {
  const tekst = String((greska && greska.message) || '');
  const kod = (tekst.match(/^([a-z_]+)(?::|$)/) || [])[1] || '';
  const znano = kod ? ODBIJANJA[kod] : undefined;
  if (!znano) return { kod: '', vrsta: 'kvar', poruka: 'Sokrat could not complete this request. Try once more; if it fails again, tell the user.' };
  const razlog = kod === 'sadrzaj_neispravan' ? ' ' + tekst.slice(kod.length + 1).trim().slice(0, 300) : '';
  return { kod, vrsta: znano.vrsta, poruka: znano.poruka + razlog };
}
