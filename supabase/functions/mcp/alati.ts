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
