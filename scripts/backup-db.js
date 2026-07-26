#!/usr/bin/env node
/* eslint-disable no-console */
// ===== SOKRAT STUDY — DB BACKUP (risk-sprint #3) =====
//
// Snima vremenski-označen snapshot SVIH redova baze u gzip-JSON datoteke pod backups/.
// Zakrpava JEDINU rupu u backupu: korisnički + audit podaci (profiles, progress,
// content_versions) postoje SAMO u bazi — shema je u git-u (supabase/*.sql), a sadržaj
// je u git-u (data/*.js, data/json/). Ovo hvata ono čega nema nigdje drugdje.
//
// SIGURNOST / ADR-016: koristi SUPABASE_SERVICE_KEY iz .env — ISTA "lokalna skripta"
// kategorija kao scripts/migrate-content.js (ADR-016 zabranjuje service_role samo u
// DEPLOYANIM sustavima / Vercel; lokalne skripte iz .env su izričito dopuštene). Ključ
// se NIKAD ne ispisuje i NIKAD ne napušta ovaj stroj. backups/ je gitignored.
// Backup + verify = 100% READ-ONLY (samo GET) → siguran protiv PROD-a (kao load-probe).
//
// Uporaba:
//   node scripts/backup-db.js                 # snimi snapshot (default; cilj = SUPABASE_URL)
//   node scripts/backup-db.js --verify [dir]  # provjeri integritet snapshota (default: zadnji)
//   node scripts/backup-db.js --list          # popiši postojeće snapshote
// Env: SUPABASE_URL + SUPABASE_SERVICE_KEY (.env). Override URL za staging po potrebi.
//
// Graceful-skip kad baza spava (free-tier ~7 dana): exit 0, bez snapshota (kao check:final).

'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');

// Tablice koje NISU u git-u (redoslijed: prvo "rupa", sadržaj-zrcalo zadnje).
// content_versions/profiles/progress = jedini nezamjenjivi podaci; subject_content = zrcalo
// (u git-u kao data/), ali jeftino i korisno za snapshot verzija + materijaliziranog final-a.
const TABLES = ['profiles', 'progress', 'content_versions', 'subject_content'];

// on_conflict ključ po tablici za restore (upsert = merge-duplicates po PK-u).
// content_versions NIJE ovdje: PK je `id generated always as identity` (append-only audit) →
// REST upsert ne može umetati eksplicitan id; obnova te tablice = ručni SQL (rijedak DR-scenarij).
const RESTORE_CONFLICT = {
    profiles: 'user_id',
    progress: 'user_id,key',
    subject_content: 'subject_id,var_name'
};

const PAGE = 1000; // PostgREST Range stranica

// --- .env loader (isti obrazac kao migrate-content.js, bez ovisnosti) ------------
function loadEnv() {
    const p = path.join(ROOT, '.env');
    if (!fs.existsSync(p)) return;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
}
loadEnv();

// Stabilan checksum: sortiraj retke po JSON-u (server-poredak nije zajamčen) pa hashiraj.
function hashRows(rows) {
    const sorted = rows.map((r) => JSON.stringify(r)).sort();
    return crypto.createHash('sha256').update(sorted.join('\n')).digest('hex');
}

function ts() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

// Dohvati SVE retke tablice, stranica po stranica (Range) — service_role zaobilazi RLS.
async function fetchAll(base, key, table) {
    const rows = [];
    for (let from = 0; ; from += PAGE) {
        const to = from + PAGE - 1;
        const res = await fetch(`${base}/rest/v1/${table}?select=*`, {
            headers: {
                apikey: key,
                Authorization: 'Bearer ' + key,
                'Range-Unit': 'items',
                Range: `${from}-${to}`,
                Prefer: 'count=exact'
            }
        });
        if (res.status === 404) throw new Error(`tablica "${table}" ne postoji (404)`);
        if (!res.ok && res.status !== 206 && res.status !== 200) {
            throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
        }
        const page = await res.json();
        if (!Array.isArray(page)) throw new Error(`${table}: neočekivan odgovor`);
        rows.push(...page);
        // Content-Range: "0-999/1234" — total nakon "/"
        const cr = res.headers.get('content-range') || '';
        const total = parseInt((cr.split('/')[1] || ''), 10);
        if (page.length < PAGE || (Number.isFinite(total) && rows.length >= total)) break;
    }
    return rows;
}

// Nježno prepoznaj "baza spava" (mreža/timeout) → graceful skip.
function looksAsleep(err) {
    const m = String(err && err.message || err).toLowerCase();
    return /fetch failed|timeout|econn|enotfound|network|getaddrinfo|socket/.test(m);
}

async function doBackup() {
    const base = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!base || !key) { console.error('Nedostaje SUPABASE_URL ili SUPABASE_SERVICE_KEY u .env'); process.exit(1); }

    const ref = (base.match(/https?:\/\/([^.]+)\./) || [])[1] || base;
    console.log(`Backup baze (projekt ${ref}) → backups/…`);

    const started = Date.now();
    const dir = path.join(BACKUP_DIR, ts());
    const manifest = { created_at: new Date().toISOString(), project: ref, tables: {}, script: 'backup-db.js v1' };
    let rowsTotal = 0;

    // Snimi u tmp-mapu; preimenuj tek na uspjeh (atomično — bez pola-snapshota).
    const tmp = dir + '.partial';
    fs.mkdirSync(tmp, { recursive: true });
    try {
        for (const table of TABLES) {
            let rows;
            try {
                rows = await fetchAll(base, key, table);
            } catch (err) {
                if (looksAsleep(err)) {
                    console.log(`⚠️  Baza nedostupna (vjerojatno spava) → ${err.message}. Preskačem (exit 0).`);
                    fs.rmSync(tmp, { recursive: true, force: true });
                    process.exit(0);
                }
                throw err;
            }
            const buf = zlib.gzipSync(JSON.stringify(rows));
            fs.writeFileSync(path.join(tmp, `${table}.json.gz`), buf);
            manifest.tables[table] = { rows: rows.length, bytes_gz: buf.length, sha256: hashRows(rows) };
            rowsTotal += rows.length;
            console.log(`  ✓ ${table.padEnd(18)} ${String(rows.length).padStart(6)} redova · ${(buf.length / 1024).toFixed(1)} KB gz`);
        }
        manifest.rows_total = rowsTotal;
        fs.writeFileSync(path.join(tmp, '_manifest.json'), JSON.stringify(manifest, null, 2));
        fs.renameSync(tmp, dir);
    } catch (err) {
        fs.rmSync(tmp, { recursive: true, force: true });
        throw err;
    }

    console.log(`\n✅ Snapshot: backups/${path.basename(dir)}/  (${rowsTotal} redova, ${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

function listSnapshots() {
    if (!fs.existsSync(BACKUP_DIR)) return [];
    return fs.readdirSync(BACKUP_DIR)
        .filter((d) => fs.existsSync(path.join(BACKUP_DIR, d, '_manifest.json')))
        .sort();
}

function doList() {
    const snaps = listSnapshots();
    if (!snaps.length) { console.log('Nema snapshota u backups/.'); return; }
    console.log(`${snaps.length} snapshot(a):`);
    for (const s of snaps) {
        const m = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, s, '_manifest.json'), 'utf8'));
        console.log(`  ${s}  · ${m.rows_total} redova · projekt ${m.project} · ${m.created_at}`);
    }
}

// Verify = integritet snapshota NA DISKU (gunzip→parse→re-hash vs manifest). Bez mreže.
function doVerify(arg) {
    const snaps = listSnapshots();
    const name = arg && !arg.startsWith('--') ? path.basename(arg) : snaps[snaps.length - 1];
    if (!name) { console.error('Nema snapshota za provjeru.'); process.exit(1); }
    const dir = path.join(BACKUP_DIR, name);
    const mPath = path.join(dir, '_manifest.json');
    if (!fs.existsSync(mPath)) { console.error(`Snapshot "${name}" nema _manifest.json`); process.exit(1); }
    const manifest = JSON.parse(fs.readFileSync(mPath, 'utf8'));
    console.log(`Provjera integriteta: backups/${name}/`);

    let bad = 0;
    for (const [table, meta] of Object.entries(manifest.tables)) {
        const f = path.join(dir, `${table}.json.gz`);
        if (!fs.existsSync(f)) { console.log(`  ✗ ${table} — datoteka nedostaje`); bad++; continue; }
        let rows;
        try {
            rows = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)).toString());
        } catch (e) {
            console.log(`  ✗ ${table} — dekompresija/parse pao: ${e.message}`); bad++; continue;
        }
        const h = hashRows(rows);
        const ok = rows.length === meta.rows && h === meta.sha256;
        console.log(`  ${ok ? '✓' : '✗'} ${table.padEnd(18)} ${String(rows.length).padStart(6)} redova · sha256 ${ok ? 'OK' : 'NE ODGOVARA'}`);
        if (!ok) bad++;
    }
    if (bad) { console.error(`\n❌ ${bad} tablica ne prolazi — snapshot je oštećen.`); process.exit(1); }
    console.log(`\n✅ Snapshot cjelovit i vjeran (${manifest.rows_total} redova, ${Object.keys(manifest.tables).length} tablica).`);
}

// Restore = upsert (merge-duplicates) redova iz snapshota natrag u bazu.
// SIGURNOST: dry-run po defaultu (bez mreže); --confirm da stvarno piše; --force-prod
// obavezan ako cilj (SUPABASE_URL) NIJE staging (spriječi slučajni prod-overwrite).
async function doRestore(dir, table, opts) {
    if (!dir || !table) { console.error('Uporaba: --restore <dir> <table> [--confirm] [--force-prod]'); process.exit(1); }
    const conflict = RESTORE_CONFLICT[table];
    if (!conflict) { console.error(`Restore tablice "${table}" nije podržan preko REST-a (v. RESTORE_CONFLICT).`); process.exit(1); }

    const snapDir = path.join(BACKUP_DIR, path.basename(dir));
    const f = path.join(snapDir, `${table}.json.gz`);
    if (!fs.existsSync(f)) { console.error(`Snapshot nema ${table}.json.gz: ${snapDir}`); process.exit(1); }
    const rows = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)).toString());

    const base = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!base || !key) { console.error('Nedostaje SUPABASE_URL ili SUPABASE_SERVICE_KEY u .env'); process.exit(1); }
    const isProd = !/staging|czljmvig/i.test(base) && !(process.env.STAGING_SUPABASE_URL && base === process.env.STAGING_SUPABASE_URL.replace(/\/$/, ''));

    console.log(`Restore: ${rows.length} redova → ${table} (on_conflict=${conflict}) · cilj ${base.replace(/https?:\/\//, '')}`);
    if (!opts.confirm) {
        console.log(`  [DRY-RUN] ništa nije zapisano. Ključevi 1. reda: ${Object.keys(rows[0] || {}).join(', ')}`);
        console.log('  Za stvarni upis dodaj --confirm' + (isProd ? ' --force-prod' : ''));
        return;
    }
    if (isProd && !opts.forceProd) {
        console.error('  ⛔ Cilj je PROD. Za pisanje u prod dodaj i --force-prod (namjerno).'); process.exit(2);
    }

    const BATCH = 20;
    for (let i = 0; i < rows.length; i += BATCH) {
        const chunk = rows.slice(i, i + BATCH);
        const res = await fetch(`${base}/rest/v1/${table}?on_conflict=${conflict}`, {
            method: 'POST',
            headers: {
                apikey: key, Authorization: 'Bearer ' + key,
                'content-type': 'application/json',
                Prefer: 'resolution=merge-duplicates,return=minimal'
            },
            body: JSON.stringify(chunk)
        });
        if (!res.ok) throw new Error(`restore ${table}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
        console.log(`  ✓ upsert ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
    }
    console.log(`✅ Restore ${table} gotov (${rows.length} redova).`);
}

(async function main() {
    const args = process.argv.slice(2);
    try {
        if (args.includes('--list')) return doList();
        if (args.includes('--verify')) {
            const i = args.indexOf('--verify');
            return doVerify(args[i + 1]);
        }
        if (args.includes('--restore')) {
            const i = args.indexOf('--restore');
            const rest = args.slice(i + 1).filter((a) => !a.startsWith('--'));
            return doRestore(rest[0], rest[1], { confirm: args.includes('--confirm'), forceProd: args.includes('--force-prod') });
        }
        await doBackup();
    } catch (err) {
        console.error('ERR: ' + (err && err.message || err));
        process.exit(1);
    }
})();
