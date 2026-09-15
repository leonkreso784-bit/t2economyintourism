/* eslint-disable no-console */
// ===== MAIL-OBAVIJESTI (F2/4) — čista jezgra obje Edge Functions, BEZ mreže =====
// Pokreni: node tests/unit/mail-core.test.js  (uključeno u `npm run test:unit`)
//
// ZAŠTO POSTOJI: mail je NEPOVRATNA radnja prema van — poslan je poslan. Tri stvari se zato
// tvrde prije ijedne funkcije i ijednog ključa:
//   ① PRIMATELJ je samo onaj tko je IZRIČITO pristao (GDPR; upitnik R1 / prekidač u profilu),
//     s potvrđenom adresom, iz traženog segmenta — nikad „svi korisnici" greškom filtra;
//   ② ODJAVA radi samo s potpisom koji je izdao poslužitelj (tuđi id + krivotvoren potpis = ništa),
//     i ne istječe (odjava iz maila od prije godinu dana mora raditi);
//   ③ SADRŽAJ od admina ide u HTML kroz escape, a poveznica smije voditi SAMO na naš site —
//     preuzet admin-račun inače bi slao phishing s naše verificirane domene.
// Jezgra je `.ts` bez ijednog Deno-uvoza (samo Web Crypto) → Node 24 je učita izravno.

const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

const KORIJEN = path.join(__dirname, '..', '..');
let pao = 0;
let proslo = 0;
const test = async (ime, fn) => {
  try { await fn(); proslo++; console.log('  ✓ ' + ime); }
  catch (e) { pao++; console.log('  ✗ ' + ime + '\n      ' + e.message); }
};

(async () => {
  console.log('\n=== mail-core (F2/4) ===\n');
  let M;
  try {
    M = await import(pathToFileURL(path.join(KORIJEN, 'supabase', 'functions', '_shared', 'mail-core.ts')).href);
  } catch (e) {
    console.log('  ✗ jezgra se ne učitava: ' + e.message);
    process.exit(1);
  }

  const potvrden = '2026-09-01T10:00:00Z';
  const k = (id, email, meta, confirmed) => ({ id, email, email_confirmed_at: confirmed === false ? null : potvrden, user_metadata: meta });
  const korisnici = [
    k('u1', 'fmtu@a.hr', { mail_consent: true, is_fmtu: true }),
    k('u2', 'drugi@a.hr', { mail_consent: true, is_fmtu: false }),
    k('u3', 'bez@a.hr', { mail_consent: false, is_fmtu: true }),           // FMTU, ali NIJE pristao
    k('u4', 'nista@a.hr', {}),                                              // bez upitnika
    k('u5', 'nepotvrden@a.hr', { mail_consent: true, is_fmtu: true }, false),
    k('u6', 'FMTU@A.HR', { mail_consent: true, is_fmtu: true }),            // ista adresa, druga slova
    k('u7', null, { mail_consent: true }),                                  // bez adrese
    k('u8', 'string@a.hr', { mail_consent: 'true', is_fmtu: 'true' })       // tekst, ne boolean
  ];

  // ── ① primatelji ──
  await test('primatelji FMTU: samo pristali + FMTU + potvrđeni, bez duplikata adrese', () => {
    assert.deepStrictEqual(M.primatelji(korisnici, 'fmtu').map((x) => x.id), ['u1']);
  });
  await test('primatelji „svi": svi pristali i potvrđeni, i dalje nitko bez pristanka', () => {
    assert.deepStrictEqual(M.primatelji(korisnici, 'all').map((x) => x.id), ['u1', 'u2']);
  });
  await test('pristanak mora biti PRAVI boolean `true` (tekst "true" nije izričit klik)', () => {
    assert.ok(!M.primatelji(korisnici, 'all').some((x) => x.id === 'u8'));
  });
  await test('nepoznat segment → nitko (nikad „svi" greškom)', () => {
    assert.deepStrictEqual(M.primatelji(korisnici, 'sve'), []);
    assert.deepStrictEqual(M.primatelji(korisnici, undefined), []);
  });
  await test('prazan/neispravan ulaz → prazno, ne baca', () => {
    assert.deepStrictEqual(M.primatelji(null, 'all'), []);
    assert.deepStrictEqual(M.primatelji([null, {}], 'all'), []);
  });

  // ── ② potpis odjave ──
  const TAJNA = 'a'.repeat(64);
  await test('token se provjerava i vraća id; drugi id s istim potpisom pada', async () => {
    const t = await M.tokenOdjave(TAJNA, 'u1');
    assert.strictEqual(await M.provjeriToken(TAJNA, t), 'u1');
    const [, sig] = t.split('.');
    assert.strictEqual(await M.provjeriToken(TAJNA, 'u2.' + sig), null);
  });
  await test('druga tajna / krivotvoren / prazan / bez točke → null', async () => {
    const t = await M.tokenOdjave(TAJNA, 'u1');
    assert.strictEqual(await M.provjeriToken('b'.repeat(64), t), null);
    assert.strictEqual(await M.provjeriToken(TAJNA, t.slice(0, -2) + 'xx'), null);
    assert.strictEqual(await M.provjeriToken(TAJNA, ''), null);
    assert.strictEqual(await M.provjeriToken(TAJNA, 'u1'), null);
    assert.strictEqual(await M.provjeriToken(TAJNA, null), null);
  });
  await test('token je stabilan (isti id → isti token; ne istječe) i siguran za URL', async () => {
    const a = await M.tokenOdjave(TAJNA, 'u1');
    assert.strictEqual(a, await M.tokenOdjave(TAJNA, 'u1'));
    assert.match(a, /^[A-Za-z0-9._-]+$/);
  });
  await test('kratka/prazna tajna se odbija (funkcija bez tajne ne smije izdavati tokene)', async () => {
    await assert.rejects(() => M.tokenOdjave('', 'u1'));
    await assert.rejects(() => M.tokenOdjave('kratko', 'u1'));
    assert.strictEqual(await M.provjeriToken('', 'u1.x'), null);
  });

  // ── ③ poruka i mail ──
  await test('provjeriPoruku: naslov i tekst obavezni, s granicama', () => {
    assert.strictEqual(M.provjeriPoruku({ subject: ' ', text: 'x' }).code, 'mail_bad_subject');
    assert.strictEqual(M.provjeriPoruku({ subject: 'x', text: '' }).code, 'mail_bad_text');
    assert.strictEqual(M.provjeriPoruku({ subject: 'x'.repeat(121), text: 'x' }).code, 'mail_bad_subject');
    assert.strictEqual(M.provjeriPoruku({ subject: 'x', text: 'x'.repeat(5001) }).code, 'mail_bad_text');
    const ok = M.provjeriPoruku({ subject: '  Novi predmet  ', text: ' Tekst ' });
    assert.deepStrictEqual(ok, { ok: true, value: { subject: 'Novi predmet', text: 'Tekst', url: null } });
  });
  await test('poveznica samo https na naš site; sve ostalo odbijeno', () => {
    const p = (url) => M.provjeriPoruku({ subject: 's', text: 't', url });
    assert.strictEqual(p('https://www.sokratstudy.com/#/subject/te2').ok, true);
    assert.strictEqual(p('https://sokratstudy.com/').ok, true);
    assert.strictEqual(p('http://www.sokratstudy.com/').code, 'mail_bad_url');
    assert.strictEqual(p('https://sokratstudy.com.evil.io/').code, 'mail_bad_url');
    assert.strictEqual(p('https://evil.io/?sokratstudy.com').code, 'mail_bad_url');
    assert.strictEqual(p('javascript:alert(1)').code, 'mail_bad_url');
    assert.strictEqual(p('').ok, true);                      // prazna = bez poveznice
  });
  await test('sastaviMail: tekst ESCAPAN u HTML-u, odjava i poveznica prisutne, obična inačica postoji', () => {
    const m = M.sastaviMail({
      subject: 'Novo <b>', text: 'Red 1 <img src=x onerror=alert(1)>\nRed 2\n\nOdlomak 2',
      url: 'https://www.sokratstudy.com/#/subject/te2', odjavaUrl: 'https://www.sokratstudy.com/odjava.html?t=u1.sig'
    });
    assert.strictEqual(m.subject, 'Novo <b>');               // naslov je zaglavlje, ne HTML
    assert.ok(!/<img/i.test(m.html), 'sirovi HTML iz teksta je prošao u mail');
    assert.ok(m.html.includes('&lt;img src=x onerror=alert(1)&gt;'));
    assert.ok(m.html.includes('Red 1') && m.html.includes('<br>') && (m.html.match(/<p[ >]/g) || []).length >= 2);
    assert.ok(m.html.includes('href="https://www.sokratstudy.com/#/subject/te2"'));
    assert.ok(m.html.includes('href="https://www.sokratstudy.com/odjava.html?t=u1.sig"'));
    assert.ok(m.text.includes('Red 2') && m.text.includes('odjava.html?t=u1.sig'));
  });
  await test('sastaviMail bez poveznice nema gumba', () => {
    const m = M.sastaviMail({ subject: 's', text: 't', url: null, odjavaUrl: 'https://www.sokratstudy.com/odjava.html?t=a.b' });
    assert.strictEqual((m.html.match(/href=/g) || []).length, 1, 'jedina poveznica smije biti odjava');
  });

  console.log(`\n=== mail-core: ${proslo} prošlo / ${pao} palo ===\n`);
  process.exit(pao ? 1 : 0);
})();
