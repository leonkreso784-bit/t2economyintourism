#!/usr/bin/env node
// ===== SOKRAT STUDY — LOAD PROBE (risk-sprint #7) =====
//
// Mjeri drži li Supabase free-tier "razred" studenata koji istovremeno otvaraju sadržaj.
// Simulira N paralelnih anon content-readova (točan upit koji student radi kroz
// js/content-loader.js: SELECT var_name,payload FROM subject_content WHERE subject_id=eq.X).
//
// SIGURNO: 100% READ-ONLY anon (ista granica kao scripts/check-final-drift.js i rls-check.js);
// NE piše ništa; anon-key je javan po dizajnu (RLS štiti bazu). Skromni burst (default 30×3)
// = manje prometa nego jedan student koji par puta osvježi. NIJE u preflight (mrežno).
//
// Uporaba:  node scripts/load-probe.js [N] [ROUNDS]
//   N       = broj paralelnih "studenata" po rundi (default 30)
//   ROUNDS  = broj rundi (default 3)
// Env override (npr. za staging):  SUPABASE_URL, SUPABASE_ANON
//
// Nalaz (2026-07-24, PROD): 30×3 = 90/90 OK · 50×1 = 50/50 OK · 0 grešaka/throttlinga.
// Zaključak: propusnost NIJE rizik (free-tier lako drži razred); pravi rizik dostupnosti
// = SLEEP (free-tier zaspi ~7 dana neaktivnosti) → rješava keep-alive (sprint #4).

'use strict';

const URL = process.env.SUPABASE_URL || 'https://naxjubnedhrbhsuasayu.supabase.co';
const ANON = process.env.SUPABASE_ANON || 'sb_publishable_KatBQDLB8GRohKEyb3eDSQ_ToXJuL7L';
const H = { apikey: ANON, Authorization: 'Bearer ' + ANON };

const N = parseInt(process.argv[2], 10) || 30;
const ROUNDS = parseInt(process.argv[3], 10) || 3;

function pctl(arr, p) {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

// Jedan "student": pročitaj sadržaj nasumičnog predmeta (isti upit kao content-loader).
async function oneStudent(subjectIds) {
    const sid = subjectIds[Math.floor(Math.random() * subjectIds.length)];
    const t = Date.now();
    try {
        const r = await fetch(
            `${URL}/rest/v1/subject_content?select=var_name,payload&subject_id=eq.${encodeURIComponent(sid)}`,
            { headers: H }
        );
        const body = await r.json();
        const ok = r.status === 200 && Array.isArray(body) && body.length > 0;
        return { ok, ms: Date.now() - t, status: r.status };
    } catch (e) {
        return { ok: false, ms: Date.now() - t, status: 'ERR:' + e.message };
    }
}

(async function main() {
    // 1) Dohvati listu predmeta u bazi (i warm-up latencija).
    let subjectIds;
    try {
        const t0 = Date.now();
        const res = await fetch(`${URL}/rest/v1/subject_content?select=subject_id`, { headers: H });
        const rows = await res.json();
        if (!Array.isArray(rows)) {
            console.log('⚠️ Baza ne odgovara očekivano (možda spava). Odgovor:', JSON.stringify(rows).slice(0, 200));
            process.exit(0); // graceful (kao check-final-drift na sleep)
        }
        subjectIds = [...new Set(rows.map((r) => r.subject_id))].sort();
        console.log(`Baza OK · ${rows.length} redova · ${subjectIds.length} predmeta · warm-up ${Date.now() - t0}ms`);
    } catch (e) {
        console.log('⚠️ Mreža/baza nedostupna →', e.message, '(graceful skip)');
        process.exit(0);
    }
    if (!subjectIds.length) { console.log('Nema sadržaja u bazi — preskačem.'); process.exit(0); }

    // 2) Burst rundi.
    let totalOk = 0, totalReq = 0;
    for (let round = 1; round <= ROUNDS; round++) {
        const t0 = Date.now();
        const results = await Promise.all(Array.from({ length: N }, () => oneStudent(subjectIds)));
        const wall = Date.now() - t0;
        const lat = results.map((r) => r.ms);
        const okN = results.filter((r) => r.ok).length;
        const errs = results.filter((r) => !r.ok).map((r) => r.status);
        totalOk += okN; totalReq += N;
        console.log(
            `Runda ${round}: ${okN}/${N} OK · wall ${wall}ms · p50 ${pctl(lat, 50)}ms · ` +
            `p95 ${pctl(lat, 95)}ms · max ${Math.max(...lat)}ms` + (errs.length ? ` · GREŠKE: ${errs.join(',')}` : '')
        );
    }

    console.log(`\nUkupno: ${totalOk}/${totalReq} OK (N=${N} paralelnih × ${ROUNDS} rundi, read-only anon).`);
    process.exit(totalOk === totalReq ? 0 : 1);
})();
