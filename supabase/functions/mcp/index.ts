// ===== SOKRAT STUDY — Edge Function `mcp` (F6 ①/1 — konektor za KORISNIKOV AI) =====
//
// Udaljeni MCP poslužitelj (Streamable HTTP, bez stanja). Korisnik ga doda u svoj Claude/ChatGPT
// kao konektor; prijava ide kroz Supabase OAuth 2.1 poslužitelj i našu stranicu `odobrenje.html`.
//
// ─── ZAŠTO JE `verify_jwt = false` ──────────────────────────────────────────────────────────────
// MCP klijent prvi zahtjev šalje BEZ tokena i iz odgovora 401 (`WWW-Authenticate: Bearer
// resource_metadata=…`) saznaje gdje je prijava. Gateway s `verify_jwt` bi taj zahtjev odbio prije
// funkcije, pa klijent nikad ne bi našao prijavu. Token zato provjerava `withSupabase` (JWKS, ES256).
//
// ─── ŠTO SE NE SMIJE (ADR-026/030/038) ──────────────────────────────────────────────────────────
//   • nikad `supabaseAdmin`, `service_role` ni tajni ključ — alat radi KAO KORISNIK, pod RLS-om;
//   • nikad javni katalog ni `is_admin()`;
//   • u ovoj cigli NEMA upisa. Brava za token s `client_id` (①/2) dolazi prije ijednog upisa.
// `tests/unit/mcp-alati.test.js` čita ovu datoteku i pada ako se išta od toga pojavi.
//
// ─── ADRESA RESURSA ─────────────────────────────────────────────────────────────────────────────
// Zadaje se izričito: `MCP_RESOURCE_URL` (produkcija: https://www.sokratstudy.com/mcp, ADR-038 ②),
// inače adresa funkcije na projektu. Ne oslanjamo se na to da deploy ubaci `SUPABASE_FUNCTION_SLUG`.
//
// Paketi su pinani TOČNO (pravilo #9) — `@supabase/server` OAuth sloj je alpha, a ugniježđeni oblik
// koji ovdje stoji je jedini koji paket zove stabilnim.

import { createMcpHandler, McpServer } from 'npm:@modelcontextprotocol/server@2.0.0';
import { fromSupabaseUrl, withOAuthProtectedResource, withSupabase } from 'npm:@supabase/server@1.7.0';
import { POSLUZITELJ, UPUTE, procitajMaterijale } from './alati.ts';
import type { CitacCvorova } from './alati.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const RESURS = Deno.env.get('MCP_RESOURCE_URL') ?? `${SUPABASE_URL}/functions/v1/mcp`;

Deno.serve(
  withOAuthProtectedResource(
    { resourceServer: RESURS, authorizationServer: fromSupabaseUrl(SUPABASE_URL) },
    withSupabase({ auth: 'user' }, async (req, { supabase }) => {
      const mcp = createMcpHandler(() => {
        const server = new McpServer(POSLUZITELJ, { instructions: UPUTE });
        server.registerTool(
          'procitaj_materijale',
          {
            title: 'List my study materials',
            description: 'Lists the signed-in user\'s own shelves and study materials (names and ids). Read-only.',
            annotations: { readOnlyHint: true }
          },
          async () => {
            const r = await procitajMaterijale(supabase as unknown as CitacCvorova);
            return { content: [{ type: 'text', text: r.tekst }] };
          }
        );
        return server;
      });
      return mcp.fetch(req);
    })
  )
);
