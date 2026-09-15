// ===== MAIL-OBAVIJESTI (F2/4) — čista jezgra za `send-notification` i `mail-unsubscribe` =====
//
// Bez ijednog Deno-uvoza (samo Web Crypto, `URL`, `TextEncoder`) — zato je jedna datoteka dijele
// obje funkcije, a `tests/unit/mail-core.test.js` je vrti izravno u Nodeu 24. Sve što se ovdje
// odlučuje je NEPOVRATNO prema van (poslan mail je poslan), pa je svaka odluka zatvorena:
//   • primatelj = samo IZRIČIT pristanak (`mail_consent === true`) + potvrđena adresa + segment;
//   • odjava = potpis poslužitelja (HMAC) koji ne istječe i vrijedi SAMO za odjavu;
//   • sadržaj admina ide u HTML kroz escape, poveznica samo na naš site (preuzet admin-račun
//     inače šalje phishing s naše verificirane domene).

export type Korisnik = {
  id?: string | null;
  email?: string | null;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export type Poruka = { subject: string; text: string; url: string | null };

export const SEGMENTI = ['fmtu', 'all'];
const DOPUSTENI_HOSTOVI = ['www.sokratstudy.com', 'sokratstudy.com'];
const NASLOV_MAX = 120;
const TEKST_MAX = 5000;
const TAJNA_MIN = 32;

/**
 * Tko smije dobiti mail. `mail_consent` mora biti PRAVI `true` (izričit klik u upitniku ili
 * prekidaču), ne istinita vrijednost; adresa potvrđena; nepoznat segment = NITKO (nikad „svi").
 * Ista adresa se ne ponavlja (velika/mala slova su ista adresa).
 */
export function primatelji(users: Korisnik[] | null | undefined, segment: string | undefined): { id: string; email: string }[] {
  if (!segment || SEGMENTI.indexOf(segment) === -1) return [];
  const vidjeno = new Set<string>();
  const out: { id: string; email: string }[] = [];
  for (const u of users || []) {
    if (!u || !u.id || !u.email || !u.email_confirmed_at) continue;
    const m = u.user_metadata || {};
    if (m.mail_consent !== true) continue;
    if (segment === 'fmtu' && m.is_fmtu !== true) continue;
    const kljuc = String(u.email).trim().toLowerCase();
    if (!kljuc || vidjeno.has(kljuc)) continue;
    vidjeno.add(kljuc);
    out.push({ id: String(u.id), email: String(u.email).trim() });
  }
  return out;
}

/** Provjera poruke iz admin-forme — poslužitelj je istina, klijent samo pomaže. */
export function provjeriPoruku(p: { subject?: unknown; text?: unknown; url?: unknown } | null):
  { ok: true; value: Poruka } | { ok: false; code: string } {
  const subject = typeof p?.subject === 'string' ? p.subject.trim() : '';
  const text = typeof p?.text === 'string' ? p.text.trim() : '';
  const urlUlaz = typeof p?.url === 'string' ? p.url.trim() : '';
  if (!subject || subject.length > NASLOV_MAX) return { ok: false, code: 'mail_bad_subject' };
  if (!text || text.length > TEKST_MAX) return { ok: false, code: 'mail_bad_text' };
  let url: string | null = null;
  if (urlUlaz) {
    let u: URL;
    try { u = new URL(urlUlaz); } catch (_e) { return { ok: false, code: 'mail_bad_url' }; }
    if (u.protocol !== 'https:' || u.username || u.password || DOPUSTENI_HOSTOVI.indexOf(u.hostname) === -1) {
      return { ok: false, code: 'mail_bad_url' };
    }
    url = u.href;
  }
  return { ok: true, value: { subject, text, url } };
}

// ── Potpis odjave ────────────────────────────────────────────────────────────────
function b64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(tajna: string, poruka: string): Promise<string> {
  const enc = new TextEncoder();
  const kljuc = await crypto.subtle.importKey('raw', enc.encode(tajna), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', kljuc, enc.encode('unsub:' + poruka))));
}

/** `<id>.<potpis>` — stabilan (ne istječe) i vrijedi SAMO za odjavu. Bez tajne se ne izdaje. */
export async function tokenOdjave(tajna: string, uid: string): Promise<string> {
  if (!tajna || tajna.length < TAJNA_MIN) throw new Error('mail_no_secret');
  if (!uid) throw new Error('mail_no_user');
  return uid + '.' + await hmac(tajna, uid);
}

/** Id iz tokena ako je potpis naš, inače `null`. Usporedba u stalnom vremenu. */
export async function provjeriToken(tajna: string, token: unknown): Promise<string | null> {
  if (!tajna || tajna.length < TAJNA_MIN || typeof token !== 'string') return null;
  const i = token.lastIndexOf('.');
  if (i <= 0 || i === token.length - 1) return null;
  const uid = token.slice(0, i);
  const sig = token.slice(i + 1);
  const ocekivano = await hmac(tajna, uid);
  if (sig.length !== ocekivano.length) return null;
  let r = 0;
  for (let j = 0; j < sig.length; j++) r |= sig.charCodeAt(j) ^ ocekivano.charCodeAt(j);
  return r === 0 ? uid : null;
}

// ── Sastavljanje maila ───────────────────────────────────────────────────────────
export function esc(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
}

/**
 * HTML + obična inačica. Bez vanjskih slika (blokiraju se i služe praćenju) i bez skripti; stil
 * inline (klijenti maila bacaju `<style>`). Odlomci po praznom retku, prijelomi po retku.
 * Podnožje HR + EN: jezik korisnika poslužitelj ne zna (UI jezik živi u pregledniku).
 */
export function sastaviMail(o: { subject: string; text: string; url: string | null; odjavaUrl: string }):
  { subject: string; html: string; text: string } {
  const odlomci = o.text.split(/\n\s*\n/).map((p) =>
    '<p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#1f2937">' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>');
  const gumb = o.url
    ? '<p style="margin:24px 0"><a href="' + esc(o.url) + '" style="display:inline-block;padding:12px 20px;border-radius:10px;' +
      'background:#4f46e5;color:#ffffff;font-weight:600;text-decoration:none">Otvori u Sokratu</a></p>'
    : '';
  const html =
    '<!doctype html><html><body style="margin:0;padding:24px;background:#f5f6fa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;padding:28px">' +
    '<p style="margin:0 0 20px;font-size:14px;font-weight:700;color:#4f46e5">Sokrat Study</p>' +
    odlomci.join('') + gumb +
    '<hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0 16px">' +
    '<p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280">Ovaj mail dobivaš jer si pristao/la na obavijesti Sokrat Studyja. ' +
    '<a href="' + esc(o.odjavaUrl) + '" style="color:#6b7280">Odjavi se</a>.<br>' +
    'You get this email because you opted in to Sokrat Study updates. Unsubscribe with the link above.</p>' +
    '</div></body></html>';
  const text = o.text + (o.url ? '\n\n' + o.url : '') +
    '\n\n—\nSokrat Study · Odjava / Unsubscribe: ' + o.odjavaUrl + '\n';
  return { subject: o.subject, html, text };
}
