// ===== RAČUNOVODSTVO (HR) — VJEŽBE (content pack) =====
//
// CONTENT PACK (NE engine): interaktivne, auto-ocjenjive vježbe za `accounting-hr`.
// Generički engine (js/exercises-core.js, js/exercises.js) ne sadrži NIŠTA odavde — vidi
// docs/architecture/EXERCISES_ENGINE.md §2 (tipovi) + §3 (konvencije brojeva).
//
// IZVORI (tipovi zadataka): ispitna pitanja i riješeni zadaci kolegija (1. kolokvij, „Primjeri
// pitanja za 1. kolokvij”, zbirka „pitanja i odgovori” za 2. kolokvij i završni ispit, obrazac
// domaće zadaće). Brojevi konta, pravila knjiženja, nazivi bilančnih promjena i ispravci izvora
// = teorija predmeta (data/accounting-hr/midterm-1.js §kontniPlan/§bilancnePromjene, midterm-2.js).
//
// KONVENCIJE:
//   - Tipovi: choice / numeric / ratio / statement / classify / journal (SAMO postojeći).
//   - `chapter` = tematska cjelina (1–4 = 1. kolokvij, 5–11 = 2. kolokvij); engine po njemu grupira.
//   - Konta u knjiženju biraju se iz padajućeg izbornika kao TEKST („029 Ispravak vrijednosti…”),
//     pa vodeća nula nije problem (engine uspoređuje nazive, ne brojeve).
//   - Brojevi u prikazu: točka za tisuće, zarez za decimale (12.000; 4,50). Tablice podataka
//     (`givens`) dobivaju već oblikovan tekst — engineov formatAmount bi pisao 12,000.
//   - Odgovori: NIKAD točno 3 decimale (parseAmount „1,125” čita kao 1125) i NIKAD negativni
//     (Unicode minus se ne prepoznaje) — gubitak/povrat se traže kao pozitivan iznos u svom polju.
//   - KaTeX samo \( \) / \[ \] — nikad jedan dolar. Valuta: €.
//   - Randomizacija: `params:{ s }` + vlastiti deterministički PRNG u generate(p) → isti seed = isti
//     zadatak. Svi pomoćnici su unutar IIFE-a → jedini globalni naziv je `accountingHrExercises`.
//
// ⚠ Vježbe su KÔD (generate) → učitavaju se uvijek iz .js preko content.codeScripts (BUG-012).

const accountingHrExercises = (function () {
  'use strict';

  // ---------- PRNG i pomoćnici ----------
  function mulberry(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function R(seed) {
    const f = mulberry(seed);
    const api = {
      f: f,
      int(lo, hi, step) {
        step = step || 1;
        const n = Math.floor((hi - lo) / step + 1e-9) + 1;
        return lo + Math.floor(f() * n) * step;
      },
      pick(arr) { return arr[Math.floor(f() * arr.length)]; },
      shuffle(arr) {
        const c = arr.slice();
        for (let i = c.length - 1; i > 0; i--) {
          const j = Math.floor(f() * (i + 1));
          const t = c[i]; c[i] = c[j]; c[j] = t;
        }
        return c;
      },
      sample(arr, k) { return api.shuffle(arr).slice(0, k); }
    };
    return api;
  }
  const SEED = { s: { min: 1, max: 999999 } };
  function r2(x) { return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100; }
  function sum(a) { return a.reduce((s, v) => s + v, 0); }
  // HR zapis: točka za tisuće, zarez za decimale; cijeli brojevi bez decimala, ostalo 2 decimale.
  function fmt(x) {
    const v = r2(Math.abs(x));
    const isInt = Math.abs(v - Math.round(v)) < 1e-9;
    const s = isInt ? String(Math.round(v)) : v.toFixed(2);
    const parts = s.split('.');
    const i = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 && v !== 0 ? '−' : '') + i + (parts[1] ? ',' + parts[1] : '');
  }
  function eur(x) { return fmt(x) + ' €'; }
  function pct(x) { return fmt(x) + ' %'; }

  const UPUTA_BROJ = 'Iznose upiši u eurima; decimale odvoji zarezom (najviše 2 decimale), tisuće smiješ odvojiti točkom (12.000).';
  const UPUTA_KNJ = 'Za svaku promjenu odaberi konto (broj i naziv), stranu (Debit = duguje, Credit = potražuje) i upiši iznos u eurima. Redoslijed redaka nije bitan.';

  // ---------- Kontni plan kolegija (nazivi u padajućem izborniku) ----------
  const K = {
    '021': '021 Postrojenja i oprema',
    '029': '029 Ispravak vrijednosti (zgrade, opreme)',
    '041': '041 Dani dugoročni kredit',
    '100': '100 Žiro račun',
    '102': '102 Blagajna',
    '120': '120 Kupci',
    '180': '180 Potraživanja za PDV',
    '220': '220 Dobavljači',
    '252': '252 Kratkoročni kredit',
    '280': '280 Obveze za PDV',
    '310': '310 Zaliha materijala / namirnica',
    '400': '400 Trošak materijala',
    '411': '411 Trošak poštarine',
    '418': '418 Komunalne usluge',
    '422': '422 Odvjetničke usluge',
    '431': '431 Trošak amortizacije',
    '440': '440 Dnevnice',
    '724': '724 Rashod od kamata',
    '730': '730 Izvanredni rashodi',
    '751': '751 Prihod od prodaje proizvoda i usluga',
    '757': '757 Prihod od najma',
    '773': '773 Prihod od kamata',
    '782': '782 Prihod od otpisa obveza',
    '783': '783 Prihod od viškova',
    '952': '952 Kredit kod banke',
    KAP: 'Kapital',
    ZGR: 'Zgrade',
    PZ: 'Potraživanja od zaposlenih',
    PC: 'Primljeni čekovi',
    IC: 'Izdani čekovi',
    ONP: 'Obveze za neto plaće'
  };
  // normal: strana povećanja (D/C); section: engineov kernel ga koristi samo u slobodnom načinu.
  const KSEC = {
    '021': ['D', 'asset'], '029': ['C', 'asset'], '041': ['D', 'asset'], '100': ['D', 'asset'], '102': ['D', 'asset'],
    '120': ['D', 'asset'], '180': ['D', 'asset'], '220': ['C', 'liability'], '252': ['C', 'liability'], '280': ['C', 'liability'],
    '310': ['D', 'asset'], '400': ['D', 'expense'], '411': ['D', 'expense'], '418': ['D', 'expense'], '422': ['D', 'expense'],
    '431': ['D', 'expense'], '440': ['D', 'expense'], '724': ['D', 'expense'], '730': ['D', 'expense'], '751': ['C', 'revenue'],
    '757': ['C', 'revenue'], '773': ['C', 'revenue'], '782': ['C', 'revenue'], '783': ['C', 'revenue'], '952': ['C', 'liability'],
    KAP: ['C', 'equity'], ZGR: ['D', 'asset'], PZ: ['D', 'asset'], PC: ['D', 'asset'], IC: ['C', 'liability'], ONP: ['C', 'liability']
  };
  function chart(codes) {
    return codes.map((c) => ({ name: K[c], normal: KSEC[c][0], section: KSEC[c][1] }));
  }
  const CHART_K1 = chart(['021', '100', '102', '120', '220', '252', '310', '952', 'KAP', 'ZGR', 'PZ', 'PC', 'IC']);
  const CHART_K2 = chart(['021', '029', '041', '100', '102', '120', '180', '220', '252', '280', '310', '400', '411', '418',
    '422', '431', '440', '724', '730', '751', '757', '773', '782', '783', '952', 'KAP', 'PZ', 'ONP']);

  // ---------- Bilančne promjene: nazivi ----------
  const VRSTA = {
    cp: 'Centripetalna (A+ P+)',
    cf: 'Centrifugalna (A− P−)',
    ko: 'Koncentrična (A+ A−)',
    pe: 'Periferijska (P+ P−)',
    'cp-p': 'Centripetalna uslijed prihoda (A+ P+)',
    'cf-r': 'Centrifugalna uslijed rashoda (A− P−)',
    'pe-r': 'Periferijska uslijed rashoda (P+ P−)',
    'pe-p': 'Periferijska uslijed prihoda (P− P+)'
  };
  const UTJECAJ = [
    'Povećava aktivu i pasivu za isti iznos',
    'Povećava jedan a smanjuje drugi konto pasive, pa ne utječe na iznos aktive i pasive u bilanci',
    'Povećava jedan a smanjuje drugi konto aktive, pa ne utječe na iznos aktive i pasive u bilanci',
    'Povećava iznos aktive i smanjuje iznos pasive u bilanci',
    'Smanjuje aktivu i pasivu za isti iznos'
  ];
  const UTJECAJ_OF = { cp: 0, pe: 1, ko: 2, cf: 4 };

  // Pretvori predložak u transakciju za `journal` + tekst rješenja.
  function toTx(t) {
    return { text: t.text, entries: t.e.map((x) => ({ account: K[x[0]], side: x[1], amount: r2(x[2]) })) };
  }
  function txSolution(t, i) {
    const d = t.e.filter((x) => x[1] === 'D').map((x) => K[x[0]] + ' duguje ' + eur(x[2])).join(' + ');
    const c = t.e.filter((x) => x[1] === 'C').map((x) => K[x[0]] + ' potražuje ' + eur(x[2])).join(' + ');
    return '(' + (i + 1) + ') ' + d + ' · ' + c + (t.vrsta ? ' → ' + VRSTA[t.vrsta] : '') + (t.note ? ' — ' + t.note : '');
  }

  // ---------- 1. kolokvij: predlošci bilančnih promjena ----------
  // e: [konto, strana, iznos]; vrsta: cp/cf/ko/pe. U ciklusu bilance (`cyc`) samo promjene
  // čija konta postoje u početnoj bilanci.
  const K1T = [
    (r) => { const a = r.int(2000, 40000, 500); return { id: 'mat', cyc: true, text: 'Od dobavljača je nabavljeno materijala u vrijednosti ' + eur(a) + '.', e: [['310', 'D', a], ['220', 'C', a]], vrsta: 'cp' }; },
    (r) => { const a = r.int(5000, 60000, 1000); return { id: 'stroj', cyc: true, text: 'Od dobavljača je nabavljen stroj u vrijednosti ' + eur(a) + '.', e: [['021', 'D', a], ['220', 'C', a]], vrsta: 'cp' }; },
    (r) => { const a = r.int(5000, 50000, 1000); return { id: 'kkred', cyc: true, text: 'Banka nam je odobrila kratkoročni kredit od ' + eur(a) + ' (uplaćen na žiro račun).', e: [['100', 'D', a], ['252', 'C', a]], vrsta: 'cp' }; },
    (r) => { const a = r.int(1000, 20000, 500); const ps = a + r.int(500, 10000, 500); return { id: 'kupci', cyc: true, text: 'Kupci (PS ' + eur(ps) + ') su na žiro račun podmirili potraživanje od ' + eur(a) + '.', e: [['100', 'D', a], ['120', 'C', a]], vrsta: 'ko' }; },
    (r) => { const a = r.int(500, 10000, 500); return { id: 'blag', text: 'Iz blagajne je na žiro račun položeno ' + eur(a) + '.', e: [['100', 'D', a], ['102', 'C', a]], vrsta: 'ko' }; },
    (r) => { const a = r.int(1000, 15000, 500); return { id: 'cek', text: 'Primljeni ček (PS ' + eur(a) + ') je naplaćen na žiro račun.', e: [['100', 'D', a], ['PC', 'C', a]], vrsta: 'ko' }; },
    (r) => { const a = r.int(200, 3000, 100); return { id: 'akont', text: 'Djelatniku je iz blagajne isplaćena akontacija za službeni put od ' + eur(a) + '.', e: [['PZ', 'D', a], ['102', 'C', a]], vrsta: 'ko' }; },
    (r) => { const a = r.int(100, 2000, 100); const ps = a + r.int(2000, 20000, 1000); return { id: 'manjak', text: 'Na zalihi materijala (PS ' + eur(ps) + ') utvrđen je manjak od ' + eur(a) + ' za koji se tereti skladištar.', e: [['PZ', 'D', a], ['310', 'C', a]], vrsta: 'ko' }; },
    (r) => { const a = r.int(2000, 30000, 1000); return { id: 'dobzr', cyc: true, text: 'Dobavljaču je sa žiro računa plaćena faktura od ' + eur(a) + '.', e: [['220', 'D', a], ['100', 'C', a]], vrsta: 'cf' }; },
    (r) => { const a = r.int(1000, 20000, 1000); const ps = a + r.int(10, 80, 5) * 1000; return { id: 'dkred', cyc: true, text: 'Banci je sa žiro računa vraćen dio dugoročnog kredita od ' + eur(a) + ' (PS kredit kod banke ' + eur(ps) + ').', e: [['952', 'D', a], ['100', 'C', a]], vrsta: 'cf' }; },
    (r) => { const a = r.int(1000, 10000, 500); return { id: 'kkredpov', cyc: true, text: 'Sa žiro računa vraćen je dio kratkoročnog kredita od ' + eur(a) + '.', e: [['252', 'D', a], ['100', 'C', a]], vrsta: 'cf' }; },
    (r) => { const a = r.int(2000, 20000, 1000); const ps = a + r.int(0, 10000, 1000); return { id: 'dobkred', cyc: true, text: 'Dobavljaču (PS ' + eur(ps) + ') je dug od ' + eur(a) + ' plaćen iz kratkoročnog kredita.', e: [['220', 'D', a], ['252', 'C', a]], vrsta: 'pe' }; },
    (r) => { const a = r.int(1000, 15000, 500); return { id: 'dobcek', text: 'Dobavljaču je dug od ' + eur(a) + ' plaćen izdanim čekom.', e: [['220', 'D', a], ['IC', 'C', a]], vrsta: 'pe' }; },
    (r) => { const a = r.int(5000, 30000, 1000); return { id: 'pretvor', cyc: true, text: 'Kratkoročni kredit od ' + eur(a) + ' sporazumom s bankom pretvoren je u dugoročni kredit.', e: [['252', 'D', a], ['952', 'C', a]], vrsta: 'pe' }; },
    (r) => { const a = r.int(5000, 50000, 1000); return { id: 'namj', cyc: true, text: 'Od dobavljača je nabavljen namještaj za hotelske sobe u vrijednosti ' + eur(a) + '.', e: [['021', 'D', a], ['220', 'C', a]], vrsta: 'cp' }; },
    (r) => { const a = r.int(10000, 80000, 5000); return { id: 'ulog', text: 'Vlasnik je na žiro račun uplatio dodatni ulog u kapital od ' + eur(a) + '.', e: [['100', 'D', a], ['KAP', 'C', a]], vrsta: 'cp' }; },
    (r) => { const a = r.int(500, 5000, 100); return { id: 'blagdob', text: 'Iz blagajne je dobavljaču plaćeno ' + eur(a) + '.', e: [['220', 'D', a], ['102', 'C', a]], vrsta: 'cf' }; }
  ];

  // ---------- 2. kolokvij: predlošci promjena (uspjeh, PDV, novčani tok) ----------
  // rdg: [kategorija, iznos] ili null (nema utjecaja); nt: [kategorija, iznos] ili null;
  // nt === undefined → razvrstavanje u novčanom toku nije jednoznačno u gradivu (ne koristi se ondje).
  const RDG = ['Poslovni prihod', 'Financijski prihod', 'Izvanredni prihod', 'Poslovni rashod', 'Financijski rashod', 'Izvanredni rashod', 'Nema utjecaja na RDG'];
  const NT = ['Poslovne aktivnosti – primitak', 'Poslovne aktivnosti – izdatak', 'Investicijske aktivnosti – primitak', 'Investicijske aktivnosti – izdatak',
    'Financijske aktivnosti – primitak', 'Financijske aktivnosti – izdatak', 'Nema utjecaja na novčani tok'];
  const K2T = [
    (r) => { const a = r.int(1000, 15000, 500); const ps = a + r.int(5000, 30000, 1000); return { id: 'utrosak', text: 'U kuhinju je utrošeno materijala u vrijednosti ' + eur(a) + ' (PS zaliha materijala ' + eur(ps) + ').', e: [['400', 'D', a], ['310', 'C', a]], vrsta: 'cf-r', rdg: [RDG[3], a], nt: null }; },
    (r) => { const ps = r.int(50000, 400000, 10000); const k = r.pick([1, 2, 3, 4, 5]); const a = ps * k / 100; return { id: 'kamata', text: 'Banka je obračunala kamatu od ' + pct(k) + ' na dugoročni kredit (PS kredit kod banke ' + eur(ps) + ').', e: [['724', 'D', a], ['952', 'C', a]], vrsta: 'pe-r', rdg: [RDG[4], a], nt: null }; },
    (r) => { const a = r.int(1000, 10000, 500); const ps = r.int(50, 300, 10) * 1000; return { id: 'kamdani', text: 'Obračunate su kamate na dani dugoročni kredit od ' + eur(a) + ' (PS dani dugoročni kredit ' + eur(ps) + ').', e: [['041', 'D', a], ['773', 'C', a]], vrsta: 'cp-p', rdg: [RDG[1], a], nt: null }; },
    (r) => { const a = r.int(200, 3000, 100); return { id: 'visak', text: 'Inventurom je utvrđen višak materijala u vrijednosti ' + eur(a) + '.', e: [['310', 'D', a], ['783', 'C', a]], vrsta: 'cp-p', rdg: [RDG[2], a], nt: null }; },
    (r) => { const a = r.int(2000, 20000, 1000); return { id: 'steta', text: 'Poplava je uništila neosigurani stroj vrijednosti ' + eur(a) + '.', e: [['730', 'D', a], ['021', 'C', a]], vrsta: 'cf-r', rdg: [RDG[5], a], nt: null }; },
    (r) => { const a = r.int(1000, 10000, 500); return { id: 'otpis', text: 'Banka je otpisala dio duga po dugoročnom kreditu od ' + eur(a) + '.', e: [['952', 'D', a], ['782', 'C', a]], vrsta: 'pe-p', rdg: [RDG[2], a], nt: null }; },
    (r) => { const ps = r.int(4, 18, 1) * 50000; const k = r.pick([2, 2.5, 4, 5]); const a = ps * k / 100; return { id: 'amort', text: 'Obračunata je godišnja amortizacija zgrade po stopi od ' + pct(k) + ' (nabavna vrijednost zgrade ' + eur(ps) + ').', e: [['431', 'D', a], ['029', 'C', a]], vrsta: 'cf-r', rdg: [RDG[3], a], nt: null }; },
    (r) => { const a = r.int(20, 400, 5) * 100; const v = a * 0.13; return { id: 'smjestaj', pdv: true, text: 'Kupcima je ispostavljena faktura za usluge smještaja od ' + eur(a) + ' + PDV 13 %.', e: [['120', 'D', a + v], ['751', 'C', a], ['280', 'C', v]], vrsta: 'cp-p', rdg: [RDG[0], a], nt: null }; },
    (r) => { const a = r.int(10, 200, 5) * 100; const v = a * 0.25; return { id: 'najam', pdv: true, text: 'Na žiro račun naplaćena je najamnina poslovnog prostora od ' + eur(a) + ' + PDV 25 %.', e: [['100', 'D', a + v], ['757', 'C', a], ['280', 'C', v]], vrsta: 'cp-p', rdg: [RDG[0], a], nt: [NT[0], a + v] }; },
    (r) => { const a = r.int(4, 80, 1) * 100; const v = a * 0.25; return { id: 'komunal', pdv: true, text: 'Primljena je faktura komunalnog društva za komunalne usluge od ' + eur(a) + ' + PDV 25 %.', e: [['418', 'D', a], ['180', 'D', v], ['220', 'C', a + v]], vrsta: null, rdg: [RDG[3], a], nt: null, note: 'trošak ide u RDG bez PDV-a' }; },
    (r) => { const a = r.int(2, 40, 1) * 100; const v = a * 0.25; return { id: 'postarina', pdv: true, text: 'Iz blagajne je plaćena faktura za poštarinu od ' + eur(a) + ' + PDV 25 %.', e: [['411', 'D', a], ['180', 'D', v], ['102', 'C', a + v]], vrsta: null, rdg: [RDG[3], a], nt: [NT[1], a + v] }; },
    (r) => { const a = r.int(10, 100, 1) * 100; const v = a * 0.25; return { id: 'odvjet', pdv: true, text: 'Primljena je faktura za odvjetničke usluge od ' + eur(a) + ' + PDV 25 %.', e: [['422', 'D', a], ['180', 'D', v], ['220', 'C', a + v]], vrsta: null, rdg: [RDG[3], a], nt: null }; },
    (r) => { const a = r.int(200, 1500, 50); const ps = a + r.int(0, 10, 1) * 100; return { id: 'dnevnice', text: 'Djelatniku je po povratku sa službenog puta obračunat putni nalog – dnevnice ' + eur(a) + ' (PS potraživanja od zaposlenih ' + eur(ps) + ').', e: [['440', 'D', a], ['PZ', 'C', a]], vrsta: 'cf-r', rdg: [RDG[3], a], nt: null }; },
    (r) => { const a = r.int(500, 8000, 500); return { id: 'donacija', text: 'Sa žiro računa isplaćena je donacija nogometnom klubu od ' + eur(a) + '.', e: [['730', 'D', a], ['100', 'C', a]], vrsta: 'cf-r', rdg: [RDG[5], a], nt: undefined }; },
    (r) => { const a = r.int(4, 120, 1) * 100; const v = a * 0.25; return { id: 'matpdv', pdv: true, text: 'Primljena je faktura dobavljača za materijal od ' + eur(a) + ' + PDV 25 %.', e: [['310', 'D', a], ['180', 'D', v], ['220', 'C', a + v]], vrsta: 'cp', rdg: null, nt: null }; },
    (r) => { const a = r.int(10, 200, 5) * 100; const v = a * 0.25; return { id: 'catering', pdv: true, text: 'Kupcima je fakturirana usluga cateringa od ' + eur(a) + ' + PDV 25 % (stopa zadana u zadatku).', e: [['120', 'D', a + v], ['751', 'C', a], ['280', 'C', v]], vrsta: 'cp-p', rdg: [RDG[0], a], nt: null }; },
    (r) => { const a = r.int(20, 400, 5) * 100; const t = a * 1.13; return { id: 'naplata', text: 'Kupci su na žiro račun platili ranije proknjiženu fakturu za smještaj od ' + eur(a) + ' + PDV 13 %.', e: [['100', 'D', t], ['120', 'C', t]], vrsta: 'ko', rdg: null, nt: [NT[0], t], note: 'prihod je priznat već pri ispostavljanju fakture' }; },
    (r) => { const a = r.int(1000, 20000, 500); return { id: 'uplpdv', text: 'Sa žiro računa plaćena je obveza za PDV od ' + eur(a) + '.', e: [['280', 'D', a], ['100', 'C', a]], vrsta: 'cf', rdg: null, nt: [NT[1], a] }; },
    (r) => { const a = r.int(5000, 40000, 1000); return { id: 'place', text: 'Sa žiro računa radnicima su isplaćene obračunate neto plaće od ' + eur(a) + '.', e: [['ONP', 'D', a], ['100', 'C', a]], vrsta: 'cf', rdg: null, nt: [NT[1], a] }; },
    (r) => { const a = r.int(5000, 60000, 1000); return { id: 'oprema', text: 'Kupljena je oprema od ' + eur(a) + ' i odmah plaćena sa žiro računa (bez PDV-a).', e: [['021', 'D', a], ['100', 'C', a]], vrsta: 'ko', rdg: null, nt: [NT[3], a] }; },
    (r) => { const a = r.int(20, 200, 10) * 1000; return { id: 'primkred', text: 'Banka je odobrila dugoročni kredit od ' + eur(a) + ' i uplatila ga na žiro račun.', e: [['100', 'D', a], ['952', 'C', a]], vrsta: 'cp', rdg: null, nt: [NT[4], a] }; },
    (r) => { const a = r.int(2000, 30000, 1000); return { id: 'otplata', text: 'Sa žiro računa otplaćena je glavnica dugoročnog kredita od ' + eur(a) + '.', e: [['952', 'D', a], ['100', 'C', a]], vrsta: 'cf', rdg: null, nt: [NT[5], a] }; },
    (r) => { const a = r.int(10, 150, 10) * 1000; return { id: 'emisija', text: 'Izdane su nove dionice i na žiro račun uplaćeno je ' + eur(a) + '.', e: [['100', 'D', a], ['KAP', 'C', a]], vrsta: 'cp', rdg: null, nt: [NT[4], a] }; }
  ];

  // Generator skupa različitih predložaka (bez ponavljanja istog id-a).
  function drawTemplates(r, pool, k, filter) {
    const cand = pool.filter((fn, i) => !filter || filter(fn(R(i + 1))));
    return r.sample(cand, k).map((fn) => fn(r));
  }
  // Višestruki izbor s determinističkim miješanjem; vraća { options, answer }.
  function mc(r, correct, distractors) {
    const opts = r.shuffle([correct].concat(distractors));
    return { options: opts, answer: opts.indexOf(correct) };
  }

  // ---------- Pool stavki bilance (1. kolokvij) ----------
  // sk: DMI dugotrajna materijalna · DNI nematerijalna · DFI dugotrajna financijska · ZAL zalihe ·
  //     POT kratkoročna potraživanja · KFI kratkotrajna financijska · NOV novac · KAP kapital ·
  //     KO kratkoročne obveze · DO dugoročne obveze
  const STAVKE = [
    ['Zemljište', 'DMI'], ['Zgrada hotela', 'DMI'], ['Oprema', 'DMI'], ['Stroj', 'DMI'], ['Postrojenje', 'DMI'],
    ['Namještaj u sobama', 'DMI'], ['Kuhinjska oprema', 'DMI'], ['TV uređaji u sobama', 'DMI'], ['Klima-uređaji', 'DMI'],
    ['Računala', 'DMI'], ['Predujam za opremu', 'DMI'],
    ['Koncesija na plažu', 'DNI'], ['Licenca', 'DNI'], ['Patent', 'DNI'], ['Zaštitni znak i žig', 'DNI'], ['Goodwill', 'DNI'],
    ['Softver', 'DNI'], ['Izdaci za istraživanje', 'DNI'], ['Predujam za koncesiju', 'DNI'],
    ['Kupljene dionice', 'DFI'], ['Kupljene obveznice', 'DFI'], ['Dani dugoročni kredit', 'DFI'], ['Dani dugoročni depozit', 'DFI'],
    ['Zaliha materijala', 'ZAL'], ['Zaliha namirnica', 'ZAL'], ['Sitni inventar', 'ZAL'], ['Trgovačka roba (suveniri)', 'ZAL'],
    ['Gotovi proizvodi (kolači u vitrini)', 'ZAL'],
    ['Kupci', 'POT'], ['Potraživanja od zaposlenih', 'POT'], ['Potraživanja za PDV', 'POT'], ['Potraživanja od državnih institucija', 'POT'],
    ['Dani kratkoročni kredit', 'KFI'], ['Primljeni ček', 'KFI'],
    ['Žiro račun', 'NOV'], ['Blagajna', 'NOV'], ['Devizni račun', 'NOV'], ['Akreditiv u stranoj valuti', 'NOV'],
    ['Izdane dionice (upisani kapital)', 'KAP'], ['Zadržana dobit', 'KAP'], ['Zakonske rezerve', 'KAP'], ['Rezerve revalorizacije', 'KAP'],
    ['Dobit tekuće godine', 'KAP'],
    ['Dobavljači', 'KO'], ['Kratkoročni kredit', 'KO'], ['Obveze za PDV', 'KO'], ['Obveze za neto plaće', 'KO'], ['Izdani ček', 'KO'],
    ['Izdana mjenica', 'KO'], ['Primljeni predujam', 'KO'], ['Obveze za turističke članarine', 'KO'], ['Obveze za porez na dobit', 'KO'],
    ['Kredit kod banke (dugoročni)', 'DO'], ['Izdane obveznice', 'DO'], ['Hipotekarni kredit', 'DO'], ['Obveze za mirovine zaposlenika', 'DO']
  ];
  const isStalna = (sk) => sk === 'DMI' || sk === 'DNI' || sk === 'DFI';
  const isTekuca = (sk) => sk === 'ZAL' || sk === 'POT' || sk === 'KFI' || sk === 'NOV';
  const isAktiva = (sk) => isStalna(sk) || isTekuca(sk);
  const isObveza = (sk) => sk === 'KO' || sk === 'DO';

  // Izvuci stavke aktive i obveza s iznosima tako da je kapital pozitivan.
  function balanceItems(r, nA, nO, opts) {
    opts = opts || {};
    const aPool = STAVKE.filter((s) => isAktiva(s[1]) && (!opts.aFilter || opts.aFilter(s[1])));
    let assets = r.sample(aPool, nA).map((s) => [s[0], s[1], isStalna(s[1]) ? r.int(10, 400, 5) * 1000 : r.int(2, 60, 1) * 1000]);
    if (opts.needBoth) {
      // barem jedna stalna i jedna tekuća
      if (!assets.some((x) => isStalna(x[1]))) { const s = r.pick(STAVKE.filter((x) => x[1] === 'DMI')); assets[0] = [s[0], s[1], r.int(50, 400, 5) * 1000]; }
      if (!assets.some((x) => isTekuca(x[1]))) { const s = r.pick(STAVKE.filter((x) => x[1] === 'NOV')); assets[assets.length - 1] = [s[0], s[1], r.int(5, 60, 1) * 1000]; }
    }
    const A = sum(assets.map((x) => x[2]));
    const oPool = STAVKE.filter((s) => isObveza(s[1]));
    let obv = r.sample(oPool, nO);
    if (opts.needBoth && !obv.some((x) => x[1] === 'KO')) obv[0] = r.pick(oPool.filter((x) => x[1] === 'KO'));
    if (opts.needBoth && !obv.some((x) => x[1] === 'DO')) obv[obv.length - 1] = r.pick(oPool.filter((x) => x[1] === 'DO'));
    const cap = Math.max(1, Math.floor(A * 0.7 / nO / 1000));
    obv = obv.map((s) => [s[0], s[1], r.int(1, Math.max(1, cap), 1) * 1000]);
    return { assets: assets, obv: obv };
  }

  const exercises = [];

  // =====================================================================
  // 1. KOLOKVIJ — Ch1: imovina, obveze i kapital (izračuni)
  // =====================================================================
  exercises.push({
    id: 'k1-izr-izvor', lesson: 'first-midterm', chapter: 1, type: 'numeric', difficulty: 1,
    title: 'Izračuni iz ispitnih pitanja (kapital, imovina, pasiva)',
    prompt: 'Riješi izračune iz oglednih i kolokvijskih pitanja. Najprije svaku stavku razvrstaj (imovina ili obveza), zatim zbroji. Ukupna pasiva uvijek je jednaka ukupnoj aktivi. ' + UPUTA_BROJ,
    fields: [
      { key: 'a', label: 'a) Kapital: tekuća imovina 80.000, kratkoročne obveze 40.000, stalna imovina 400.000, dugoročne obveze 150.000', answer: 290000, unit: '€', hint: 'Kapital = aktiva − obveze' },
      { key: 'b', label: 'b) Kapital: izdana mjenica 7.000, oprema 60.000, obveze za PDV 12.000, licenca 10.000, zgrade 100.000, zaliha materijala 5.000, kredit 40.000', answer: 116000, unit: '€', hint: 'Izdana mjenica je obveza.' },
      { key: 'c', label: 'c) Ukupna imovina: dani kredit 40.000, dobavljači 10.000, dionice 20.000, zgrade 200.000, izdane obveznice 30.000, primljeni predujmovi 5.000, zaliha sitnog inventara 4.000', answer: 264000, unit: '€', hint: 'Primljeni predujam je obveza; kupljene dionice su imovina.' },
      { key: 'd', label: 'd) Ukupna pasiva: devizni račun 20.000, oprema 300.000, zemljište 400.000, kupci 20.000, kredit kod banke 200.000, kapital ?', answer: 740000, unit: '€' },
      { key: 'e', label: 'e) Ukupna pasiva: potraživanja od kupaca 30.000, postrojenje 100.000, koncesija 10.000, izdani ček 10.000, kratkoročni kredit 30.000, kapital ?', answer: 140000, unit: '€' },
      { key: 'f', label: 'f) Ukupna aktiva: žiro račun 10.000, dani kredit 30.000, zgrade 200.000, dobavljači 10.000, izdane obveznice 100.000, kapital ?', answer: 240000, unit: '€' },
      { key: 'g', label: 'g) Stalna imovina: potraživanja od kupaca 30.000, postrojenje 200.000, koncesija 10.000, izdani ček 10.000, kratkoročni kredit 30.000, kapital ?', answer: 210000, unit: '€', hint: 'Stalna: postrojenje + koncesija.' }
    ],
    solution: [
      'a) Aktiva = 80.000 + 400.000 = 480.000; obveze = 40.000 + 150.000 = 190.000; kapital = 290.000.',
      'b) Imovina = 60.000 + 10.000 + 100.000 + 5.000 = 175.000; obveze = 7.000 + 12.000 + 40.000 = 59.000; kapital = 116.000.',
      'c) Imovina = 40.000 + 20.000 + 200.000 + 4.000 = 264.000 (dobavljači, izdane obveznice i primljeni predujmovi su obveze).',
      'd) Aktiva = 20.000 + 300.000 + 400.000 + 20.000 = 740.000 = ukupna pasiva (kapital = 540.000).',
      'e) Aktiva = 30.000 + 100.000 + 10.000 = 140.000 = ukupna pasiva (kapital = 100.000).',
      'f) Aktiva = 10.000 + 30.000 + 200.000 = 240.000 (kapital = 240.000 − 110.000 = 130.000).',
      'g) Stalna imovina = postrojenje 200.000 + koncesija 10.000 = 210.000.'
    ]
  });

  exercises.push({
    id: 'k1-izr-kapital', lesson: 'first-midterm', chapter: 1, type: 'ratio', difficulty: 2,
    title: 'Kapital iz popisa stavki bilance',
    prompt: 'Stavke su navedene izmiješano. Razvrstaj ih na imovinu i obveze pa izračunaj tražene iznose. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const b = balanceItems(r, 4, 3);
      const items = r.shuffle(b.assets.concat(b.obv));
      const A = sum(b.assets.map((x) => x[2]));
      const O = sum(b.obv.map((x) => x[2]));
      return {
        givens: items.map((x) => ({ label: x[0], value: eur(x[2]) })),
        fields: [
          { key: 'a', label: 'Ukupna imovina (aktiva)', answer: A, unit: '€' },
          { key: 'o', label: 'Ukupne obveze', answer: O, unit: '€' },
          { key: 'k', label: 'Kapital', answer: A - O, unit: '€', hint: 'Kapital = imovina − obveze' },
          { key: 'p', label: 'Ukupna pasiva', answer: A, unit: '€', hint: 'Pasiva = obveze + kapital = aktiva' }
        ],
        solution: [
          'Imovina: ' + b.assets.map((x) => x[0] + ' ' + fmt(x[2])).join(' + ') + ' = ' + eur(A) + '.',
          'Obveze: ' + b.obv.map((x) => x[0] + ' ' + fmt(x[2])).join(' + ') + ' = ' + eur(O) + '.',
          'Kapital = ' + fmt(A) + ' − ' + fmt(O) + ' = ' + eur(A - O) + '; ukupna pasiva = ' + fmt(O) + ' + ' + fmt(A - O) + ' = ' + eur(A) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-izr-struktura', lesson: 'first-midterm', chapter: 1, type: 'ratio', difficulty: 2,
    title: 'Struktura bilance: stalna i tekuća imovina, kratkoročne i dugoročne obveze',
    prompt: 'Iz popisa stavki izračunaj skupine imovine i obveza te kapital. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const b = balanceItems(r, 5, 3, { needBoth: true });
      const items = r.shuffle(b.assets.concat(b.obv));
      const SI = sum(b.assets.filter((x) => isStalna(x[1])).map((x) => x[2]));
      const TI = sum(b.assets.filter((x) => isTekuca(x[1])).map((x) => x[2]));
      const KO = sum(b.obv.filter((x) => x[1] === 'KO').map((x) => x[2]));
      const DO = sum(b.obv.filter((x) => x[1] === 'DO').map((x) => x[2]));
      const list = (arr) => arr.map((x) => x[0] + ' ' + fmt(x[2])).join(' + ');
      return {
        givens: items.map((x) => ({ label: x[0], value: eur(x[2]) })),
        fields: [
          { key: 'si', label: 'Stalna (dugotrajna) imovina', answer: SI, unit: '€' },
          { key: 'ti', label: 'Tekuća (kratkotrajna) imovina', answer: TI, unit: '€' },
          { key: 'ko', label: 'Kratkoročne obveze', answer: KO, unit: '€' },
          { key: 'do', label: 'Dugoročne obveze', answer: DO, unit: '€' },
          { key: 'k', label: 'Kapital', answer: SI + TI - KO - DO, unit: '€' }
        ],
        solution: [
          'Stalna imovina: ' + list(b.assets.filter((x) => isStalna(x[1]))) + ' = ' + eur(SI) + '.',
          'Tekuća imovina: ' + list(b.assets.filter((x) => isTekuca(x[1]))) + ' = ' + eur(TI) + '.',
          'Kratkoročne obveze: ' + list(b.obv.filter((x) => x[1] === 'KO')) + ' = ' + eur(KO) + '; dugoročne: ' + list(b.obv.filter((x) => x[1] === 'DO')) + ' = ' + eur(DO) + '.',
          'Kapital = (' + fmt(SI) + ' + ' + fmt(TI) + ') − (' + fmt(KO) + ' + ' + fmt(DO) + ') = ' + eur(SI + TI - KO - DO) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-izr-skupine', lesson: 'first-midterm', chapter: 1, type: 'numeric', difficulty: 1,
    title: 'Kapital iz skupina imovine i obveza',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const ti = r.int(20, 200, 5) * 1000, si = r.int(200, 900, 10) * 1000;
      const ko = r.int(10, 120, 5) * 1000;
      const dob = r.int(50, Math.max(50, Math.floor((si + ti - ko) * 0.8 / 10000) * 10), 10) * 1000;
      return {
        prompt: 'Tekuća imovina iznosi ' + eur(ti) + ', kratkoročne obveze ' + eur(ko) + ', stalna imovina ' + eur(si) + ', a dugoročne obveze ' + eur(dob) + '. ' + UPUTA_BROJ,
        fields: [
          { key: 'a', label: 'Ukupna aktiva', answer: ti + si, unit: '€' },
          { key: 'o', label: 'Ukupne obveze', answer: ko + dob, unit: '€' },
          { key: 'k', label: 'Kapital', answer: ti + si - ko - dob, unit: '€' }
        ],
        solution: [
          'Aktiva = ' + fmt(ti) + ' + ' + fmt(si) + ' = ' + eur(ti + si) + '.',
          'Obveze = ' + fmt(ko) + ' + ' + fmt(dob) + ' = ' + eur(ko + dob) + '.',
          'Kapital = aktiva − obveze = ' + eur(ti + si - ko - dob) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-izr-pasiva-mc', lesson: 'first-midterm', chapter: 1, type: 'choice', difficulty: 2,
    title: 'Ukupna aktiva / pasiva / kapital – odaberi točan iznos',
    prompt: 'U svakom pitanju kapital nije zadan („kapital ?”). Odaberi točan iznos (kao u kolokviju).',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const items = [], sol = [];
      const asks = ['pasiva', 'aktiva', 'kapital'];
      asks.forEach((ask, i) => {
        let b, A, O, tries = 0;
        do {
          b = balanceItems(r, 3, 2);
          A = sum(b.assets.map((x) => x[2])); O = sum(b.obv.map((x) => x[2]));
          tries++;
        } while ((new Set([A, O, A + O, A - O])).size < 4 && tries < 50);
        const list = r.shuffle(b.assets.concat(b.obv)).map((x) => x[0].toLowerCase() + ' ' + fmt(x[2])).join(', ') + ', kapital ?';
        const correct = ask === 'kapital' ? A - O : A;
        const pool = [A, O, A + O, A - O].filter((v) => v !== correct).map(eur);
        const m = mc(r, eur(correct), pool.slice(0, 3).concat(['Vrijednost nije moguće izračunati']));
        items.push({ kind: 'mc', q: 'Izračunajte vrijednost ' + (ask === 'pasiva' ? 'UKUPNE PASIVE' : ask === 'aktiva' ? 'UKUPNE AKTIVE' : 'KAPITALA') + ': ' + list + '.', options: m.options, answer: m.answer });
        sol.push((i + 1) + '. Aktiva = ' + eur(A) + ', obveze = ' + eur(O) + ', kapital = ' + eur(A - O) + ' → ' + (ask === 'kapital' ? 'kapital ' + eur(A - O) : 'ukupna ' + ask + ' = ' + eur(A)) + '.');
      });
      return { items: items, solution: sol };
    }
  });

  // =====================================================================
  // Ch2: razvrstavanje stavki
  // =====================================================================
  exercises.push({
    id: 'k1-razvrstaj-ap', lesson: 'first-midterm', chapter: 2, type: 'classify', difficulty: 1,
    title: 'Aktiva ili pasiva?',
    prompt: 'Za svaku stavku odaberi pripada li aktivi (imovina) ili pasivi (kapital i obveze).',
    classes: ['Aktiva', 'Pasiva'],
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const a = r.sample(STAVKE.filter((s) => isAktiva(s[1])), 6);
      const ps = r.sample(STAVKE.filter((s) => !isAktiva(s[1])), 5);
      const rows = r.shuffle(a.concat(ps)).map((s) => ({ entries: [{ account: s[0], cls: isAktiva(s[1]) ? 'Aktiva' : 'Pasiva' }] }));
      return {
        rows: rows,
        solution: [
          'Aktiva: ' + a.map((s) => s[0]).join(', ') + '.',
          'Pasiva: ' + ps.map((s) => s[0]).join(', ') + '.',
          'Pravilo: primljeni/kupljeni vrijednosni papiri su aktiva; izdani čekovi, mjenice i obveznice su obveze, izdane dionice su kapital.'
        ]
      };
    }
  });

  const PODVRSTE = { DMI: 'Dugotrajna materijalna', DNI: 'Dugotrajna nematerijalna', DFI: 'Dugotrajna financijska', ZAL: 'Zalihe', POT: 'Kratkoročna potraživanja', KFI: 'Kratkotrajna financijska', NOV: 'Novac' };
  exercises.push({
    id: 'k1-razvrstaj-podvrste', lesson: 'first-midterm', chapter: 2, type: 'classify', difficulty: 2,
    title: 'Oblici imovine: materijalna, nematerijalna, financijska, zalihe…',
    prompt: 'Svaku stavku imovine razvrstaj u odgovarajuću skupinu.',
    classes: Object.keys(PODVRSTE).map((k) => PODVRSTE[k]),
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const keys = r.shuffle(Object.keys(PODVRSTE));
      const chosen = [];
      keys.forEach((k) => { chosen.push(r.pick(STAVKE.filter((s) => s[1] === k))); });
      const extra = r.sample(STAVKE.filter((s) => isAktiva(s[1]) && chosen.indexOf(s) < 0), 3);
      const all = r.shuffle(chosen.concat(extra));
      return {
        rows: all.map((s) => ({ entries: [{ account: s[0], cls: PODVRSTE[s[1]] }] })),
        solution: all.map((s) => s[0] + ' → ' + PODVRSTE[s[1]])
      };
    }
  });

  exercises.push({
    id: 'k1-razvrstaj-izvor', lesson: 'first-midterm', chapter: 2, type: 'classify', difficulty: 2,
    title: 'Razvrstavanje stavki iz kolokvija',
    prompt: 'Stavke iz kolokvijskih zadataka razvrstaj u skupine bilance.',
    classes: ['Dugotrajna imovina', 'Kratkotrajna imovina', 'Kapital', 'Kratkoročne obveze', 'Dugoročne obveze'],
    rows: [
      ['Zemljište', 'Dugotrajna imovina'], ['Dani kratkoročni zajam', 'Kratkotrajna imovina'], ['Predujmovi za patent', 'Dugotrajna imovina'],
      ['Kupljene dionice', 'Dugotrajna imovina'], ['Potraživanja od zaposlenih', 'Kratkotrajna imovina'], ['Goodwill', 'Dugotrajna imovina'],
      ['Novac na žiro računu', 'Kratkotrajna imovina'], ['Kuhinjska oprema', 'Dugotrajna imovina'], ['Koncesija', 'Dugotrajna imovina'],
      ['Zaliha materijala', 'Kratkotrajna imovina'], ['Zgrada hotela', 'Dugotrajna imovina'], ['Predujam za koncesiju', 'Dugotrajna imovina'],
      ['Dani dugoročni kredit', 'Dugotrajna imovina'], ['Dobavljači', 'Kratkoročne obveze'], ['Izdane dionice', 'Kapital'],
      ['Izdane obveznice', 'Dugoročne obveze'], ['Predujam za licencu', 'Dugotrajna imovina'], ['Kredit kod banke (dugoročni)', 'Dugoročne obveze'],
      ['TV uređaj u sobama', 'Dugotrajna imovina'], ['Obveze za turističke članarine', 'Kratkoročne obveze'], ['Obveze za neto plaće', 'Kratkoročne obveze'],
      ['Kratkoročni kredit', 'Kratkoročne obveze'], ['Primljeni predujam', 'Kratkoročne obveze'], ['Primljeni ček', 'Kratkotrajna imovina'],
      ['Potraživanja za PDV', 'Kratkotrajna imovina']
    ].map((x) => ({ entries: [{ account: x[0], cls: x[1] }] })),
    solution: [
      'Dugotrajna imovina: zemljište, predujmovi za patent, koncesiju i licencu, kupljene dionice, goodwill, kuhinjska oprema, koncesija, zgrada hotela, dani dugoročni kredit, TV uređaj u sobama.',
      'Kratkotrajna imovina: dani kratkoročni zajam, potraživanja od zaposlenih, novac na žiro računu, zaliha materijala, primljeni ček, potraživanja za PDV.',
      'Kapital: izdane dionice. Dugoročne obveze: izdane obveznice, kredit kod banke.',
      'Kratkoročne obveze: dobavljači, turističke članarine, neto plaće, kratkoročni kredit, primljeni predujam.',
      'Pazi: u jednom studentskom rješenju primljeni predujam je netočno razvrstan kao tekuća imovina — to je kratkoročna obveza (primili smo novac za uslugu koju tek moramo pružiti).'
    ]
  });

  const ULJEZ = [
    [['predujam za opremu', 'stroj', 'materijal', 'mašina za robu', 'zemljište'], 2, 'jedini je tekuća imovina (zaliha); ostalo je stalna materijalna imovina'],
    [['primljeni ček', 'dani kredit', 'dionica', 'obveznica', 'izdana mjenica', 'žiro račun'], 4, 'izdana mjenica je obveza; ostalo je aktiva'],
    [['predujam za postrojenje', 'goodwill', 'kompjuterska oprema', 'dani dugoročni zajam', 'kupci'], 4, 'kupci su tekuća imovina; ostalo je dugotrajna'],
    [['kredit', 'rezerve revalorizacije', 'izdane dionice', 'zadržana dobit'], 0, 'kredit je obveza; ostalo je kapital'],
    [['dobavljači', 'obveze za PDV', 'primljeni predujam', 'dani kratkoročni kredit', 'izdani ček'], 3, 'dani kratkoročni kredit je aktiva; ostalo su kratkoročne obveze'],
    [['stroj', 'materijal na zalihi', 'potraživanja za PDV', 'žiro račun', 'primljena mjenica'], 0, 'stroj je stalna imovina; ostalo je tekuća'],
    [['izdaci za istraživanje', 'dani dugoročni kredit', 'goodwill', 'predujam za koncesije'], 1, 'dani dugoročni kredit je financijska imovina; ostalo je nematerijalna'],
    [['žiro račun', 'blagajna', 'akreditiv u stranoj valuti', 'dani kratkoročni kredit'], 3, 'dani kratkoročni kredit je financijska imovina; ostalo je novac'],
    [['izdane dionice', 'potraživanja od državnih institucija', 'izdane obveznice', 'dobavljači', 'obveze prema zaposlenicima'], 1, 'potraživanja su aktiva; ostalo je pasiva'],
    [['zaliha materijala', 'obveznice', 'trgovačka roba', 'dani kratkoročni kredit', 'primljeni ček', 'potraživanja od djelatnika'], 1, '(kupljene) obveznice su dugotrajna financijska imovina; ostalo je tekuća imovina'],
    [['potraživanja od kupaca', 'primljeni ček', 'koncesije', 'žiro račun', 'dani kratkoročni kredit'], 2, 'koncesije su stalna nematerijalna imovina; ostalo je tekuća']
  ];
  exercises.push({
    id: 'k1-uljez', lesson: 'first-midterm', chapter: 2, type: 'choice', difficulty: 1,
    title: 'Pronađi uljeza',
    prompt: 'U svakoj skupini pronađi stavku koja ne pripada ostalima (ogledni primjeri za 1. kolokvij).',
    items: ULJEZ.map((u) => ({ kind: 'mc', q: 'U skupini pronađite uljeza:', options: u[0], answer: u[1] })),
    solution: ULJEZ.map((u, i) => (i + 1) + '. ' + u[0][u[1]] + ' — ' + u[2] + '.')
  });

  // =====================================================================
  // Ch3: konta i pravila knjiženja
  // =====================================================================
  const KONTA_STANJA = [
    ['Potraživanja od kupaca', 'A'], ['Zaliha sitnog inventara', 'A'], ['Goodwill', 'A'], ['Pravo na zaštitni znak i žig', 'A'],
    ['Potraživanja od djelatnika', 'A'], ['Primljeni čekovi', 'A'], ['Žiro račun', 'A'], ['Blagajna', 'A'], ['Zgrade', 'A'],
    ['Predujmovi za strojeve', 'A'], ['Dani kratkoročni kredit', 'A'], ['Potraživanja za PDV', 'A'], ['Zaliha materijala', 'A'],
    ['Kapital', 'P'], ['Dobit tekuće godine', 'P'], ['Izdane dionice', 'P'], ['Kredit od banke', 'P'], ['Izdane obveznice', 'P'],
    ['Kratkoročni kredit', 'P'], ['Izdani ček', 'P'], ['Obveze za PDV', 'P'], ['Obveze za porez na dobit', 'P'], ['Dobavljači', 'P'],
    ['Primljeni predujam', 'P'], ['Zadržana dobit', 'P']
  ];
  exercises.push({
    id: 'k1-konta-vrsta', lesson: 'first-midterm', chapter: 3, type: 'classify', difficulty: 1,
    title: 'Vrsta konta i strana povećanja',
    prompt: 'Za svako konto odredi je li konto aktive ili pasive i na kojoj se strani knjiži povećanje.',
    classes: ['Konto aktive', 'Konto pasive'],
    effects: ['Povećanje – duguje', 'Povećanje – potražuje'],
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const a = r.sample(KONTA_STANJA.filter((x) => x[1] === 'A'), 4);
      const ps = r.sample(KONTA_STANJA.filter((x) => x[1] === 'P'), 4);
      const all = r.shuffle(a.concat(ps));
      return {
        rows: all.map((x) => ({ entries: [{ account: x[0], cls: x[1] === 'A' ? 'Konto aktive' : 'Konto pasive', effect: x[1] === 'A' ? 'Povećanje – duguje' : 'Povećanje – potražuje' }] })),
        solution: [
          'Konto se povećava na strani na kojoj stoji u bilanci: aktiva lijevo → duguje; pasiva desno → potražuje.',
          'Konta aktive: ' + a.map((x) => x[0]).join(', ') + '.',
          'Konta pasive: ' + ps.map((x) => x[0]).join(', ') + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-konta-pravila', lesson: 'first-midterm', chapter: 3, type: 'classify', difficulty: 2,
    title: 'Pravila knjiženja: početni saldo, povećanje, smanjenje, zaključni saldo',
    prompt: 'Za svako konto odredi na koju se stranu knjiži početni saldo (PS), povećanje, smanjenje i zaključni saldo (ZS).',
    classes: ['Duguje', 'Potražuje'],
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const pickA = r.pick(KONTA_STANJA.filter((x) => x[1] === 'A'));
      const pickP = r.pick(KONTA_STANJA.filter((x) => x[1] === 'P'));
      const third = r.pick(KONTA_STANJA.filter((x) => x !== pickA && x !== pickP));
      const accs = r.shuffle([pickA, pickP, third]);
      const rows = accs.map((x) => {
        const D = 'Duguje', P = 'Potražuje';
        const s = x[1] === 'A' ? [D, D, P, P] : [P, P, D, D];
        return {
          text: 'Konto: ' + x[0] + ' (konto ' + (x[1] === 'A' ? 'aktive' : 'pasive') + ')',
          entries: [
            { account: 'Početni saldo', cls: s[0] }, { account: 'Povećanje', cls: s[1] },
            { account: 'Smanjenje', cls: s[2] }, { account: 'Zaključni saldo', cls: s[3] }
          ]
        };
      });
      return {
        rows: rows,
        solution: [
          'Konta aktive: PS i povećanje duguje; smanjenje i ZS potražuje.',
          'Konta pasive: PS i povećanje potražuje; smanjenje i ZS duguje.',
          'ZS se upisuje na manju stranu radi izravnanja, ali pripada većoj strani.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-tkonto', lesson: 'first-midterm', chapter: 3, type: 'ratio', difficulty: 2,
    title: 'T-konto: promet i zaključni saldo',
    prompt: 'U tablici su početni saldi (PS) i promjene na kontima 100 Žiro račun (aktiva) i 220 Dobavljači (pasiva). Izračunaj promete i zaključne salde. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      // Plaćanje dobavljaču sa žiro računa JE JEDNA promjena → isti iznos na oba konta.
      // Rasponi jamče nenegativne salde: PS ≥ 20.000 ≥ najveći zbroj smanjenja (10.000 + 10.000 odn. 10.000 + 8.000).
      const pay = r.int(1, 10, 1) * 1000;
      const psZ = r.int(20, 60, 1) * 1000;
      const zPlus = [r.int(1, 15, 1) * 1000, r.int(1, 15, 1) * 1000];
      const zMinus = [pay, r.int(1, 10, 1) * 1000];
      const psD = r.int(20, 40, 1) * 1000;
      const dPlus = [r.int(1, 12, 1) * 1000, r.int(1, 12, 1) * 1000];
      const dMinus = [pay, r.int(1, 8, 1) * 1000];
      const zsZ = psZ + sum(zPlus) - sum(zMinus);
      const zsD = psD + sum(dPlus) - sum(dMinus);
      return {
        givens: [
          { label: '100 Žiro račun – PS', value: eur(psZ) },
          { label: '100 Žiro račun – uplata kupca', value: eur(zPlus[0]) },
          { label: '100 Žiro račun – odobren kratkoročni kredit', value: eur(zPlus[1]) },
          { label: '100 Žiro račun – plaćeno dobavljaču (ista promjena kao na kontu 220)', value: eur(zMinus[0]) },
          { label: '100 Žiro račun – vraćen dio kredita', value: eur(zMinus[1]) },
          { label: '220 Dobavljači – PS', value: eur(psD) },
          { label: '220 Dobavljači – nabavljene namirnice', value: eur(dPlus[0]) },
          { label: '220 Dobavljači – nabavljena oprema', value: eur(dPlus[1]) },
          { label: '220 Dobavljači – plaćeno sa žiro računa (ista promjena kao na kontu 100)', value: eur(dMinus[0]) },
          { label: '220 Dobavljači – plaćeno iz kratkoročnog kredita', value: eur(dMinus[1]) }
        ],
        fields: [
          { key: 'zd', label: 'Žiro račun: zbroj dugovne strane bez ZS (PS + povećanja)', answer: psZ + sum(zPlus), unit: '€' },
          { key: 'zs', label: 'Žiro račun: zaključni saldo', answer: zsZ, unit: '€' },
          { key: 'dp', label: 'Dobavljači: zbroj potražne strane bez ZS (PS + povećanja)', answer: psD + sum(dPlus), unit: '€' },
          { key: 'ds', label: 'Dobavljači: zaključni saldo', answer: zsD, unit: '€' }
        ],
        solution: [
          'Žiro račun (aktiva): duguje = PS ' + fmt(psZ) + ' + ' + fmt(zPlus[0]) + ' + ' + fmt(zPlus[1]) + ' = ' + eur(psZ + sum(zPlus)) + '; potražuje (smanjenja) = ' + eur(sum(zMinus)) + '.',
          'ZS žiro računa = ' + fmt(psZ + sum(zPlus)) + ' − ' + fmt(sum(zMinus)) + ' = ' + eur(zsZ) + ' (upisuje se na potražnu stranu).',
          'Dobavljači (pasiva): potražuje = PS ' + fmt(psD) + ' + ' + fmt(dPlus[0]) + ' + ' + fmt(dPlus[1]) + ' = ' + eur(psD + sum(dPlus)) + '; duguje (smanjenja) = ' + eur(sum(dMinus)) + '.',
          'ZS dobavljača = ' + eur(zsD) + ' (upisuje se na dugovnu stranu).'
        ]
      };
    }
  });

  exercises.push({
    id: 'k1-konta-tf', lesson: 'first-midterm', chapter: 3, type: 'choice', difficulty: 1,
    title: 'Konta i kontni plan – provjera pravila',
    prompt: 'Odluči je li tvrdnja točna ili netočna, odnosno odaberi točan odgovor.',
    items: [
      { kind: 'tf', q: 'Na kontu Kratkoročni kredit početni saldo i povećanje bilježe se na potražnoj strani.', answer: true },
      { kind: 'tf', q: 'Na kontima aktive smanjenje se knjiži na dugovnu stranu.', answer: false },
      { kind: 'tf', q: 'Zaključni saldo konta Dobavljači upisuje se na dugovnu stranu.', answer: true },
      { kind: 'tf', q: 'Konta rashoda imaju početni saldo na dugovnoj strani.', answer: false },
      { kind: 'tf', q: 'Konto Obveze za PDV je sintetički konto, konto stanja i konto pasive.', answer: true },
      { kind: 'tf', q: 'Konto Izdane dionice je konto aktive jer se radi o vrijednosnim papirima.', answer: false },
      { kind: 'tf', q: 'Ispravak vrijednosti opreme je nesamostalni (korektivni) konto.', answer: true },
      { kind: 'tf', q: 'Zbroj salda analitičkih konta jednak je saldu pripadajućeg sintetičkog konta.', answer: true },
      { kind: 'tf', q: 'Sintetička konta vode se u pomoćnim knjigama.', answer: false },
      { kind: 'mc', q: 'Nabavna vrijednost zgrade je 120.000 €, a ispravak vrijednosti 1.200 €. Sadašnja (neotpisana) vrijednost je:', options: ['121.200 €', '118.800 €', '120.000 €', '1.200 €'], answer: 1 },
      { kind: 'mc', q: 'Konto 220 Dobavljači pripada razredu:', options: ['1', '2', '3', '9'], answer: 1 },
      { kind: 'mc', q: 'Konto 952 Kredit kod banke pripada razredu:', options: ['0', '2', '7', '9'], answer: 3 },
      { kind: 'mc', q: 'Koji su razredi kontnog plana konta aktive?', options: ['0, 1, 3 i 6', '2 i 9', '4 i 5', '7 i 8'], answer: 0 }
    ],
    solution: [
      'Aktiva: PS i povećanje duguje, smanjenje i ZS potražuje. Pasiva obrnuto. Konta uspjeha nemaju početni saldo.',
      'Izdane dionice su kapital (pasiva); samo primljeni i kupljeni vrijednosni papiri su aktiva.',
      'Sintetička konta vode se u glavnoj knjizi, analitička u pomoćnim knjigama.',
      'Sadašnja vrijednost = 120.000 − 1.200 = 118.800 €.',
      'Razredi: aktiva 0, 1, 3, 6 · pasiva 2 (kratkoročne obveze), 9 (kapital, dugoročne obveze) · troškovi 4, 5 · rashodi i prihodi 7 · rezultat 8.'
    ]
  });

  // =====================================================================
  // Ch4: bilančne promjene
  // =====================================================================
  exercises.push({
    id: 'k1-promjene-knjizi', lesson: 'first-midterm', chapter: 4, type: 'journal', difficulty: 2,
    title: 'Proknjiži bilančne promjene',
    prompt: 'Proknjiži poslovne promjene na konta glavne knjige. ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K1,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const ts = r.sample(K1T, 5).map((fn) => fn(r));
      return { transactions: ts.map(toTx), solution: ts.map(txSolution) };
    }
  });

  exercises.push({
    id: 'k1-promjene-vrsta', lesson: 'first-midterm', chapter: 4, type: 'choice', difficulty: 2,
    title: 'Koja je to bilančna promjena?',
    prompt: 'Za svaku poslovnu promjenu odaberi vrstu bilančne promjene (Pape): centripetalna, centrifugalna, koncentrična ili periferijska.',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const ts = r.sample(K1T, 6).map((fn) => fn(r));
      const opts = [VRSTA.cp, VRSTA.cf, VRSTA.ko, VRSTA.pe];
      return {
        items: ts.map((t) => ({ kind: 'mc', q: t.text, options: opts, answer: opts.indexOf(VRSTA[t.vrsta]) })),
        solution: ts.map(txSolution)
      };
    }
  });

  exercises.push({
    id: 'k1-promjene-utjecaj', lesson: 'first-midterm', chapter: 4, type: 'choice', difficulty: 2,
    title: 'Kakav je utjecaj promjene na bilancu?',
    prompt: 'Odaberi kako navedena poslovna promjena utječe na bilancu.',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const ts = r.sample(K1T, 5).map((fn) => fn(r));
      return {
        items: ts.map((t) => ({ kind: 'mc', q: 'Promjena glasi: ' + t.text, options: UTJECAJ, answer: UTJECAJ_OF[t.vrsta] })),
        solution: ts.map((t, i) => txSolution(t, i) + ' ⇒ ' + UTJECAJ[UTJECAJ_OF[t.vrsta]].toLowerCase() + '.').concat([
          'Opcija „povećava aktivu i smanjuje pasivu” nikad nije točna: bilanca je uvijek u ravnoteži.'
        ])
      };
    }
  });

  exercises.push({
    id: 'k1-promjene-izvor', lesson: 'first-midterm', chapter: 4, type: 'journal', difficulty: 1,
    title: 'Knjiženja iz oglednih primjera za 1. kolokvij',
    prompt: 'Zadaci iz oglednih primjera i kolokvija (izvorni iznosi, ovdje u eurima). ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K1,
    transactions: [
      { text: 'Vraćen je dio kredita od banke (PS 50.000 €) u visini 4.000 €.', entries: [{ account: K['952'], side: 'D', amount: 4000 }, { account: K['100'], side: 'C', amount: 4000 }] },
      { text: 'Primljeni ček (PS 5.000 €) je naplaćen.', entries: [{ account: K['100'], side: 'D', amount: 5000 }, { account: K.PC, side: 'C', amount: 5000 }] },
      { text: 'Dobavljaču (PS 10.000 €) je dugovanje plaćeno iz kratkoročnog kredita 10.000 €.', entries: [{ account: K['220'], side: 'D', amount: 10000 }, { account: K['252'], side: 'C', amount: 10000 }] },
      { text: 'Na zalihi materijala (PS 8.000 €) utvrđen je manjak od 400 € za koji se tereti skladištar.', entries: [{ account: K.PZ, side: 'D', amount: 400 }, { account: K['310'], side: 'C', amount: 400 }] },
      { text: 'Banka nam je odobrila kratkoročni kredit u vrijednosti 10.000 €.', entries: [{ account: K['100'], side: 'D', amount: 10000 }, { account: K['252'], side: 'C', amount: 10000 }] },
      { text: 'Od dobavljača je nabavljen stroj (na kredit) u vrijednosti 20.000 €.', entries: [{ account: K['021'], side: 'D', amount: 20000 }, { account: K['220'], side: 'C', amount: 20000 }] },
      { text: 'Kupci (PS 4.500 €) su nam podmirili potraživanje u iznosu od 3.000 €.', entries: [{ account: K['100'], side: 'D', amount: 3000 }, { account: K['120'], side: 'C', amount: 3000 }] },
      { text: 'Kratkoročni kredit (PS 20.000 €) sporazumom s bankom pretvoren je u dugoročni kredit.', entries: [{ account: K['252'], side: 'D', amount: 20000 }, { account: K['952'], side: 'C', amount: 20000 }] }
    ],
    solution: [
      '(1) 952 D 4.000 / 100 P 4.000 → A− P− centrifugalna.',
      '(2) 100 D 5.000 / Primljeni čekovi P 5.000 → A+ A− koncentrična.',
      '(3) 220 D 10.000 / 252 P 10.000 → P+ P− periferijska.',
      '(4) Potraživanja od zaposlenih D 400 / 310 P 400 → A+ A− koncentrična.',
      '(5) 100 D 10.000 / 252 P 10.000 → A+ P+ centripetalna.',
      '(6) 021 D 20.000 / 220 P 20.000 → A+ P+ centripetalna.',
      '(7) 100 D 3.000 / 120 P 3.000 → A+ A− koncentrična.',
      '(8) 252 D 20.000 / 952 P 20.000 → P+ P− periferijska.',
      'Ispravak izvora: u jednom studentskom rješenju kod povrata kredita oba konta stoje na potražnoj strani — točno je 952 duguje, 100 potražuje.'
    ]
  });

  // Ciklus: početna bilanca → promjene → zaključna bilanca (statement).
  exercises.push({
    id: 'k1-bilanca-ciklus', lesson: 'first-midterm', chapter: 4, type: 'statement', difficulty: 3,
    title: 'Od početne do zaključne bilance',
    prompt: 'Tablica sadrži početnu bilancu (PS) i poslovne promjene tijekom godine. Kapital u početnoj bilanci nije zadan – izračunaj ga kao razliku aktive i obveza (promjene ga ne mijenjaju). Sastavi zaključnu bilancu. Konto bez salda upiši kao 0. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const acc = ['ZGR', '021', '310', '120', '100', 'KAP', '952', '220', '252'];
      let bal, ts, tries = 0, ok;
      do {
        bal = { ZGR: r.int(80, 200, 10) * 1000, '021': r.int(15, 60, 1) * 1000, '310': r.int(3, 12, 1) * 1000, '120': r.int(3, 15, 1) * 1000,
          '100': r.int(10, 40, 1) * 1000, '952': r.int(30, 90, 5) * 1000, '220': r.int(8, 25, 1) * 1000, '252': r.int(5, 20, 1) * 1000 };
        bal.KAP = bal.ZGR + bal['021'] + bal['310'] + bal['120'] + bal['100'] - bal['952'] - bal['220'] - bal['252'];
        const cyc = K1T.filter((fn, i) => fn(R(i + 7)).cyc);
        ts = r.sample(cyc, 6).map((fn) => fn(r));
        const end = Object.assign({}, bal);
        ts.forEach((t) => t.e.forEach((x) => {
          const debitNormal = KSEC[x[0]][0] === 'D';
          end[x[0]] += (x[1] === 'D') === debitNormal ? x[2] : -x[2];
        }));
        ok = bal.KAP > 0 && acc.every((c) => end[c] >= 0);
        if (ok) bal.END = end;
        tries++;
      } while (!ok && tries < 200);
      const E = bal.END;
      const lbl = { ZGR: 'Zgrade', '021': K['021'], '310': K['310'], '120': K['120'], '100': K['100'], KAP: 'Kapital', '952': K['952'], '220': K['220'], '252': K['252'] };
      const givens = ['ZGR', '021', '310', '120', '100', '952', '220', '252'].map((c) => ({ label: 'PS ' + lbl[c], value: eur(bal[c]) }))
        .concat([{ label: 'PS Kapital', value: '?' }])
        .concat(ts.map((t, i) => ({ label: '(' + (i + 1) + ') ' + t.text.replace(/ \(PS [^)]*\)/, ''), value: eur(t.e[0][2]) })));
      const TA = E.ZGR + E['021'] + E['310'] + E['120'] + E['100'];
      const TP = E.KAP + E['952'] + E['220'] + E['252'];
      return {
        givens: givens,
        sections: [
          { key: 'akt', label: 'AKTIVA (31. 12.)', lines: ['ZGR', '021', '310', '120', '100'].map((c) => ({ key: 'a' + c, label: lbl[c], answer: E[c] })) },
          { key: 'pas', label: 'PASIVA (31. 12.)', lines: ['KAP', '952', '220', '252'].map((c) => ({ key: 'p' + c, label: lbl[c], answer: E[c] })) }
        ],
        totals: [
          { key: 'ta', label: 'Ukupna aktiva', answer: TA },
          { key: 'tp', label: 'Ukupna pasiva', answer: TP }
        ],
        solution: [
          'Početni kapital = aktiva − obveze = ' + eur(bal.KAP) + '.'
        ].concat(ts.map(txSolution)).concat([
          'Zaključni saldi: ' + ['ZGR', '021', '310', '120', '100', 'KAP', '952', '220', '252'].map((c) => lbl[c] + ' ' + fmt(E[c])).join(' · ') + '.',
          'Ukupna aktiva = ukupna pasiva = ' + eur(TA) + '.'
        ])
      };
    }
  });

  exercises.push({
    id: 'k1-bilanca-zbroj', lesson: 'first-midterm', chapter: 4, type: 'numeric', difficulty: 2,
    title: 'Kako se mijenja zbroj bilance?',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let ts, tries = 0;
      do { ts = r.sample(K1T, 5).map((fn) => fn(r)); tries++; }
      while (!(ts.some((t) => t.vrsta === 'cp') && ts.some((t) => t.vrsta === 'cf')) && tries < 100);
      const z0 = r.int(150, 600, 10) * 1000;
      const inc = sum(ts.filter((t) => t.vrsta === 'cp').map((t) => t.e[0][2]));
      const dec = sum(ts.filter((t) => t.vrsta === 'cf').map((t) => t.e[0][2]));
      return {
        prompt: 'Zbroj početne bilance (ukupna aktiva = ukupna pasiva) iznosi ' + eur(z0) + '. Promjene: ' + ts.map((t, i) => '(' + (i + 1) + ') ' + t.text).join(' ') + ' ' + UPUTA_BROJ,
        fields: [
          { key: 'inc', label: 'Za koliko su centripetalne promjene povećale zbroj bilance', answer: inc, unit: '€' },
          { key: 'dec', label: 'Za koliko su centrifugalne promjene smanjile zbroj bilance', answer: dec, unit: '€' },
          { key: 'z1', label: 'Zbroj bilance nakon promjena', answer: z0 + inc - dec, unit: '€', hint: 'Koncentrične i periferijske promjene ne mijenjaju zbroj.' }
        ],
        solution: ts.map(txSolution).concat([
          'Zbroj = ' + fmt(z0) + ' + ' + fmt(inc) + ' − ' + fmt(dec) + ' = ' + eur(z0 + inc - dec) + '.'
        ])
      };
    }
  });

  // =====================================================================
  // 2. KOLOKVIJ — Ch5: konta uspjeha i knjiženja s kontnim planom
  // =====================================================================
  exercises.push({
    id: 'k2-knjizi', lesson: 'second-midterm', chapter: 5, type: 'journal', difficulty: 2,
    title: 'Knjiženja s brojevima konta (prihodi, rashodi, PDV)',
    prompt: 'Proknjiži poslovne promjene na konta glavne knjige prema kontnom planu kolegija. Kod računa s PDV-om izračunaj PDV i ukupni iznos. ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K2,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let ts, tries = 0;
      do { ts = r.sample(K2T, 5).map((fn) => fn(r)); tries++; }
      while (ts.filter((t) => t.pdv).length > 2 && tries < 100);
      return { transactions: ts.map(toTx), solution: ts.map(txSolution) };
    }
  });

  exercises.push({
    id: 'k2-knjizi-izvor', lesson: 'second-midterm', chapter: 5, type: 'journal', difficulty: 2,
    title: 'Knjiženja iz ispitnih zadataka 2. kolokvija',
    prompt: 'Riješeni ispitni zadaci (izvorni iznosi, ovdje u eurima). ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K2,
    transactions: [
      { text: 'U proizvodnju je utrošeno materijala u vrijednosti 6.000 € (PS materijal na zalihi 25.000 €).', entries: [{ account: K['400'], side: 'D', amount: 6000 }, { account: K['310'], side: 'C', amount: 6000 }] },
      { text: 'Obračunata je kamata od 2 % na kredit od banke (PS 50.000 €).', entries: [{ account: K['724'], side: 'D', amount: 1000 }, { account: K['952'], side: 'C', amount: 1000 }] },
      { text: 'Obračunate su kamate na dani dugoročni kredit u vrijednosti 5.000 € (PS dani dugoročni kredit 200.000 €).', entries: [{ account: K['041'], side: 'D', amount: 5000 }, { account: K['773'], side: 'C', amount: 5000 }] },
      { text: 'Inventurom je utvrđen višak materijala u vrijednosti 1.000 €.', entries: [{ account: K['310'], side: 'D', amount: 1000 }, { account: K['783'], side: 'C', amount: 1000 }] },
      { text: 'Poplava je uništila neosigurani stroj vrijednosti 10.000 €.', entries: [{ account: K['730'], side: 'D', amount: 10000 }, { account: K['021'], side: 'C', amount: 10000 }] },
      { text: 'Banka je otpisala dio duga po kreditu u iznosu od 2.000 €.', entries: [{ account: K['952'], side: 'D', amount: 2000 }, { account: K['782'], side: 'C', amount: 2000 }] },
      { text: 'Obračunata je amortizacija na zgrade po stopi od 2 % (PS zgrade 600.000 €).', entries: [{ account: K['431'], side: 'D', amount: 12000 }, { account: K['029'], side: 'C', amount: 12000 }] },
      { text: 'Primljena je faktura komunalnog društva za komunalne usluge u visini 2.000 € + PDV 25 % (500 €).', entries: [{ account: K['418'], side: 'D', amount: 2000 }, { account: K['180'], side: 'D', amount: 500 }, { account: K['220'], side: 'C', amount: 2500 }] }
    ],
    solution: [
      '(1) 400 D 6.000 / 310 P 6.000 → centrifugalna uslijed rashoda.',
      '(2) 50.000 × 2 % = 1.000: 724 D / 952 P → periferijska uslijed rashoda.',
      '(3) 041 D 5.000 / 773 P 5.000 → centripetalna uslijed prihoda.',
      '(4) 310 D 1.000 / 783 P 1.000 → centripetalna uslijed prihoda.',
      '(5) 730 D 10.000 / 021 P 10.000 → centrifugalna uslijed rashoda.',
      '(6) 952 D 2.000 / 782 P 2.000 → periferijska uslijed prihoda.',
      '(7) 600.000 × 2 % = 12.000: 431 D / 029 P → centrifugalna uslijed rashoda (konto Zgrade se ne dira).',
      '(8) 418 D 2.000 + 180 D 500 / 220 P 2.500 (ključ: periferijska uslijed rashoda).',
      'Ispravak izvora: studentska skripta kod obračuna kamate navodi da i 724 i 952 „potražuju” — točno je 724 duguje, 952 potražuje.'
    ]
  });

  exercises.push({
    id: 'k2-vrsta', lesson: 'second-midterm', chapter: 5, type: 'choice', difficulty: 2,
    title: 'Bilančne promjene uslijed prihoda i rashoda',
    prompt: 'Za svaku promjenu odaberi vrstu bilančne promjene. Prihod djeluje kao P+ (povećava kapital), rashod kao P− (smanjuje kapital).',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let ts, tries = 0;
      do { ts = drawTemplates(r, K2T, 6, (t) => t.vrsta); tries++; }
      while (ts.filter((t) => t.vrsta.indexOf('-') > 0).length < 4 && tries < 100);
      const all = Object.keys(VRSTA);
      return {
        items: ts.map((t) => {
          // Ne nudi istu obitelj s istim predznacima (npr. „Centripetalna” uz „Centripetalna uslijed prihoda”).
          const fam = t.vrsta.split('-')[0];
          const m = mc(r, VRSTA[t.vrsta], r.sample(all.filter((k) => k.split('-')[0] !== fam), 3).map((k) => VRSTA[k]));
          return { kind: 'mc', q: t.text, options: m.options, answer: m.answer };
        }),
        solution: ts.map(txSolution)
      };
    }
  });

  const KONTA_K2 = [
    ['021', 'Aktiva'], ['041', 'Aktiva'], ['100', 'Aktiva'], ['102', 'Aktiva'], ['120', 'Aktiva'], ['180', 'Aktiva'], ['310', 'Aktiva'],
    ['220', 'Pasiva'], ['252', 'Pasiva'], ['280', 'Pasiva'], ['952', 'Pasiva'],
    ['400', 'Trošak (razred 4)'], ['411', 'Trošak (razred 4)'], ['418', 'Trošak (razred 4)'], ['422', 'Trošak (razred 4)'], ['431', 'Trošak (razred 4)'], ['440', 'Trošak (razred 4)'],
    ['724', 'Rashod'], ['730', 'Rashod'],
    ['751', 'Prihod'], ['757', 'Prihod'], ['773', 'Prihod'], ['782', 'Prihod'], ['783', 'Prihod']
  ];
  exercises.push({
    id: 'k2-konta-vrsta', lesson: 'second-midterm', chapter: 5, type: 'classify', difficulty: 2,
    title: 'Konta stanja i konta uspjeha: vrsta i strana povećanja',
    prompt: 'Za svako konto iz kontnog plana kolegija odredi vrstu i stranu na kojoj se knjiži povećanje (nastanak). Pravilo: R = A, P = P.',
    classes: ['Aktiva', 'Pasiva', 'Trošak (razred 4)', 'Rashod', 'Prihod'],
    effects: ['Povećanje – duguje', 'Povećanje – potražuje'],
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const groups = ['Aktiva', 'Pasiva', 'Trošak (razred 4)', 'Rashod', 'Prihod'];
      let chosen = groups.map((g) => r.pick(KONTA_K2.filter((x) => x[1] === g)));
      chosen = chosen.concat(r.sample(KONTA_K2.filter((x) => chosen.indexOf(x) < 0), 4));
      chosen = r.shuffle(chosen);
      const up = (g) => (g === 'Pasiva' || g === 'Prihod') ? 'Povećanje – potražuje' : 'Povećanje – duguje';
      return {
        rows: chosen.map((x) => ({ entries: [{ account: K[x[0]], cls: x[1], effect: up(x[1]) }] })),
        solution: [
          'Aktiva (razredi 0, 1, 3) i troškovi (razred 4) te rashodi (70–74) povećavaju se na dugovnoj strani.',
          'Pasiva (razredi 2, 9) i prihodi (75–78) povećavaju se na potražnoj strani.',
          'Konta troškova, rashoda i prihoda nemaju početni saldo; salda se na kraju razdoblja prenose na obračun rezultata.'
        ]
      };
    }
  });

  const RDG_STAVKE = [
    ['Tržišno priznati troškovi usluga', 3], ['Troškovi sirovina sadržani u prodanim proizvodima', 3], ['Tržišno priznati troškovi osoblja (plaće)', 3],
    ['Rashod od prodane trgovačke robe', 3], ['Negativne tečajne razlike', 4], ['Rashod od kamata na kredit od banke', 4],
    ['Prihod od usluga smještaja', 0], ['Prihod od najamnine poslovnog prostora', 0], ['Prihod od prodaje suvenira', 0], ['Prihod od cateringa', 0],
    ['Prihod od kamata na dani kredit', 1], ['Pozitivne tečajne razlike', 1], ['Primljene dividende', 1],
    ['Inventurni višak', 2], ['Otpis obveze prema banci', 2], ['Primljena donacija', 2], ['Naplata ranije otpisanog potraživanja', 2],
    ['Isplaćena donacija', 5], ['Kazne i penali', 5], ['Inventurni manjak', 5], ['Neosigurana šteta od poplave', 5],
    ['Zaliha materijala', 6], ['Emitirane dionice', 6], ['Kupnja opreme', 6], ['Primljeni kredit od banke', 6], ['Naplata od kupaca za ranije proknjiženu fakturu', 6]
  ];
  exercises.push({
    id: 'k2-rdg-dio', lesson: 'second-midterm', chapter: 5, type: 'classify', difficulty: 2,
    title: 'U koji dio računa dobiti i gubitka?',
    prompt: 'Razvrstaj stavke prema dijelu računa dobiti i gubitka (RDG). Bilančne stavke i novčani tokovi ne ulaze u RDG.',
    classes: RDG,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let chosen = [0, 1, 2, 3, 4, 5, 6].map((g) => r.pick(RDG_STAVKE.filter((x) => x[1] === g)));
      chosen = r.shuffle(chosen.concat(r.sample(RDG_STAVKE.filter((x) => chosen.indexOf(x) < 0), 2)));
      return {
        rows: chosen.map((x) => ({ entries: [{ account: x[0], cls: RDG[x[1]] }] })),
        solution: chosen.map((x) => x[0] + ' → ' + RDG[x[1]])
      };
    }
  });

  exercises.push({
    id: 'k2-konta-uspjeha-tf', lesson: 'second-midterm', chapter: 5, type: 'choice', difficulty: 1,
    title: 'Pravila na kontima prihoda i rashoda',
    prompt: 'Odluči je li tvrdnja točna ili netočna, odnosno odaberi točan odgovor.',
    items: [
      { kind: 'tf', q: 'Na kontu 724 Rashod od kamata nastanak rashoda knjiži se na dugovnu stranu.', answer: true },
      { kind: 'tf', q: 'Rashod od kamata prikazuje se u računu dobiti i gubitka kao poslovni rashod.', answer: false },
      { kind: 'tf', q: 'Konta prihoda nemaju početni saldo.', answer: true },
      { kind: 'tf', q: 'Prihod od najamnine poslovnog prostora knjiži se na potražnu stranu i povećava rezultat.', answer: true },
      { kind: 'tf', q: 'PDV iz izlaznog računa ulazi u prihode poduzeća.', answer: false },
      { kind: 'tf', q: 'Rashod od prodane trgovačke robe je poslovni rashod.', answer: true },
      { kind: 'tf', q: 'Negativne tečajne razlike su izvanredni rashod.', answer: false },
      { kind: 'tf', q: 'Inventurni višak je izvanredni prihod.', answer: true },
      { kind: 'tf', q: 'Troškovi osiguranja, marketinga i odvjetničkih usluga proknjiženi u razredu 4 su troškovi po prirodnim vrstama.', answer: true },
      { kind: 'mc', q: 'Banka nam je obračunala kamatu na dugoročni kredit od 2.000 €. To se evidentira kao:', options: ['Poslovni rashod', 'Financijski rashod', 'Izvanredni rashod', 'Izdatak iz financijskih aktivnosti'], answer: 1 },
      { kind: 'mc', q: 'Isplaćena je donacija nogometnom klubu od 4.000 €. Preko kojeg konta se vidi utjecaj na RDG?', options: ['724 Rashod od kamata', '730 Izvanredni rashodi', '440 Dnevnice', '751 Prihod od prodaje proizvoda i usluga'], answer: 1 }
    ],
    solution: [
      'Konta rashoda knjiže se kao aktiva (nastanak duguje), konta prihoda kao pasiva (nastanak potražuje); ni jedna nema početni saldo.',
      'Kamate i tečajne razlike su financijski prihodi/rashodi; viškovi, manjkovi, donacije i otpisi su izvanredni.',
      'PDV nikad ne ulazi u prihode ni rashode: pretporez je potraživanje (180), obveza za PDV je obveza (280).'
    ]
  });

  // =====================================================================
  // Ch6: PDV
  // =====================================================================
  exercises.push({
    id: 'k2-pdv-izracun', lesson: 'second-midterm', chapter: 6, type: 'numeric', difficulty: 1,
    title: 'PDV: osnovica, porez i ukupni iznos',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const s1 = r.pick([25, 13]); const o1 = r.int(100, 20000, 10);
      const s2 = r.pick([25, 13, 5]); const o2 = r.int(40, 5000, 10);
      const s3 = r.pick([25, 13, 5]); const o3 = r.int(100, 9000, 20);
      const t2 = r2(o2 * (1 + s2 / 100));
      return {
        prompt: 'a) Osnovica ' + eur(o1) + ', PDV ' + s1 + ' %. b) Ukupan iznos računa s PDV-om je ' + eur(t2) + ', stopa PDV-a ' + s2 + ' %. c) Osnovica ' + eur(o3) + ', PDV ' + s3 + ' %. ' + UPUTA_BROJ,
        fields: [
          { key: 'v1', label: 'a) Iznos PDV-a', answer: r2(o1 * s1 / 100), unit: '€' },
          { key: 't1', label: 'a) Ukupno s PDV-om', answer: r2(o1 * (1 + s1 / 100)), unit: '€' },
          { key: 'o2', label: 'b) Osnovica (bez PDV-a)', answer: o2, unit: '€', hint: 'Osnovica = ukupno ÷ (1 + stopa)' },
          { key: 'v2', label: 'b) Iznos PDV-a', answer: r2(t2 - o2), unit: '€' },
          { key: 't3', label: 'c) Ukupno s PDV-om', answer: r2(o3 * (1 + s3 / 100)), unit: '€' }
        ],
        solution: [
          'a) PDV = ' + fmt(o1) + ' × ' + s1 + ' % = ' + eur(o1 * s1 / 100) + '; ukupno = ' + eur(o1 * (1 + s1 / 100)) + '.',
          'b) Osnovica = ' + fmt(t2) + ' ÷ ' + fmt(1 + s2 / 100) + ' = ' + eur(o2) + '; PDV = ' + fmt(t2) + ' − ' + fmt(o2) + ' = ' + eur(t2 - o2) + '.',
          'c) Ukupno = ' + fmt(o3) + ' + ' + fmt(o3 * s3 / 100) + ' = ' + eur(o3 * (1 + s3 / 100)) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-pdv-knjizi', lesson: 'second-midterm', chapter: 6, type: 'journal', difficulty: 2,
    title: 'Knjiženje ulaznih i izlaznih računa s PDV-om',
    prompt: 'Ulazni račun: osnovica na trošak ili imovinu (D), PDV na 180 (D), ukupno na 220 ili novac (P). Izlazni račun: ukupno na 120 ili novac (D), osnovica na prihod (P), PDV na 280 (P). ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K2,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let ts, tries = 0;
      do { ts = drawTemplates(r, K2T, 4, (t) => t.pdv); tries++; }
      while (!(ts.some((t) => t.e.some((x) => x[0] === '180')) && ts.some((t) => t.e.some((x) => x[0] === '280'))) && tries < 100);
      return { transactions: ts.map(toTx), solution: ts.map(txSolution) };
    }
  });

  const PDV_OPISI = [
    ['Stigla je faktura za nabavljeni materijal', '180'], ['Primljena je faktura za električnu energiju', '180'],
    ['Primljena je faktura komunalnog društva', '180'], ['Iz blagajne je plaćen račun za poštarinu', '180'],
    ['Primljena je faktura odvjetnika', '180'], ['Od dobavljača je nabavljena oprema', '180'], ['Primljen je račun trgovine za namirnice', '180'],
    ['Kupcima su fakturirane usluge polupansiona', '280'], ['Naplaćena je najamnina poslovnog prostora', '280'],
    ['U hotelskoj prodavaonici prodani su suveniri', '280'], ['Kupcima je fakturiran catering', '280'],
    ['Fakturiran je najam kongresne dvorane', '280'], ['Gostima su fakturirane usluge smještaja', '280']
  ];
  exercises.push({
    id: 'k2-pdv-prepoznaj', lesson: 'second-midterm', chapter: 6, type: 'classify', difficulty: 1,
    title: 'Pretporez ili obveza za PDV?',
    prompt: 'Svaka promjena uključuje PDV. Odredi na koje konto se knjiži PDV.',
    classes: [K['180'], K['280']],
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const a = r.sample(PDV_OPISI.filter((x) => x[1] === '180'), 4);
      const b = r.sample(PDV_OPISI.filter((x) => x[1] === '280'), 4);
      const all = r.shuffle(a.concat(b)).map((x) => [x[0] + ' (osnovica ' + eur(r.int(5, 200, 5) * 100) + ' + PDV)', x[1]]);
      return {
        rows: all.map((x) => ({ entries: [{ account: x[0], cls: K[x[1]] }] })),
        solution: [
          '„Primljena / stigla faktura, nabavljeno, plaćen račun” = ulazni račun → 180 Potraživanja za PDV (pretporez).',
          '„Fakturirano kupcima, naplaćena najamnina, prodano” = izlazni račun → 280 Obveze za PDV.'
        ]
      };
    }
  });

  const PDV_IZLAZ = [['Izlazni račun – usluge smještaja', 13], ['Izlazni račun – catering (usluga pripremanja hrane)', 13], ['Izlazni račun – najamnina poslovnog prostora', 25], ['Izlazni račun – usluge polupansiona', 13]];
  const PDV_ULAZ = [['Ulazni račun – materijal', 25], ['Ulazni račun – komunalne usluge', 25], ['Ulazni račun – odvjetničke usluge', 25], ['Ulazni račun – namirnice', 5], ['Ulazni račun – oprema', 25]];
  exercises.push({
    id: 'k2-pdv-obracun', lesson: 'second-midterm', chapter: 6, type: 'ratio', difficulty: 2,
    title: 'Obračun PDV-a za razdoblje',
    prompt: 'U tablici su osnovice računa za mjesec (stopa PDV-a navedena je uz račun). Izračunaj pretporez, obvezu za PDV i iznos koji se uplaćuje državi. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let izl, ul, V, P, tries = 0;
      do {
        izl = r.sample(PDV_IZLAZ, 2).map((x) => [x[0], x[1], r.int(20, 300, 5) * 100]);
        ul = r.sample(PDV_ULAZ, 3).map((x) => [x[0], x[1], r.int(5, 100, 5) * 100]);
        V = sum(izl.map((x) => x[2] * x[1] / 100)); P = sum(ul.map((x) => x[2] * x[1] / 100));
        tries++;
      } while (V <= P && tries < 100);
      const all = r.shuffle(izl.concat(ul));
      return {
        givens: all.map((x) => ({ label: x[0] + ' (PDV ' + x[1] + ' %)', value: eur(x[2]) })),
        fields: [
          { key: 'p', label: 'Ukupni pretporez (180 Potraživanja za PDV)', answer: r2(P), unit: '€' },
          { key: 'v', label: 'Ukupna obveza za PDV (280 Obveze za PDV)', answer: r2(V), unit: '€' },
          { key: 'u', label: 'Za uplatu državi', answer: r2(V - P), unit: '€', hint: 'Obveza − pretporez' }
        ],
        solution: [
          'Pretporez: ' + ul.map((x) => fmt(x[2]) + ' × ' + x[1] + ' % = ' + fmt(x[2] * x[1] / 100)).join('; ') + ' → ' + eur(P) + '.',
          'Obveza: ' + izl.map((x) => fmt(x[2]) + ' × ' + x[1] + ' % = ' + fmt(x[2] * x[1] / 100)).join('; ') + ' → ' + eur(V) + '.',
          'Obveza > pretporez → uplaćuje se razlika ' + eur(V - P) + ' (da je pretporez veći, tražio bi se povrat).'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-pdv-obracun-knjizi', lesson: 'second-midterm', chapter: 6, type: 'journal', difficulty: 2,
    title: 'Knjiženje obračuna PDV-a',
    prompt: 'Na kraju mjeseca proknjiži prijeboj pretporeza s obvezom i uplatu razlike državi sa žiro računa. ' + UPUTA_KNJ,
    chartOfAccounts: CHART_K2,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const V = r.int(20, 200, 1) * 50;
      const P = r.int(4, Math.floor(V / 50) - 2, 1) * 50;
      return {
        transactions: [
          { text: 'Konto 280 Obveze za PDV ima potražni saldo ' + eur(V) + ', a konto 180 Potraživanja za PDV dugovni saldo ' + eur(P) + '. Proknjiži prijeboj pretporeza s obvezom.', entries: [{ account: K['280'], side: 'D', amount: P }, { account: K['180'], side: 'C', amount: P }] },
          { text: 'Sa žiro računa uplaćena je državi preostala obveza za PDV.', entries: [{ account: K['280'], side: 'D', amount: V - P }, { account: K['100'], side: 'C', amount: V - P }] }
        ],
        solution: [
          '(1) Prijeboj: 280 Obveze za PDV duguje ' + eur(P) + ' · 180 Potraživanja za PDV potražuje ' + eur(P) + '.',
          '(2) Uplata razlike ' + fmt(V) + ' − ' + fmt(P) + ' = ' + eur(V - P) + ': 280 duguje · 100 Žiro račun potražuje.',
          'Uplata PDV-a je izdatak iz poslovnih aktivnosti u izvještaju o novčanom toku.'
        ]
      };
    }
  });

  // Samo poslovne stavke s jednoznačnom stopom (bez reprezentacije — ondje se pretporez ne priznaje;
  // bez poštarine — univerzalna poštanska usluga oslobođena je PDV-a).
  const DZ_IMOVINA = [['Pekarnica (kruh)', 5, 'nam'], ['Mesnica (svježe meso)', 5, 'nam'], ['Trgovina namirnicama (jaja i jestivo ulje)', 5, 'nam'],
    ['Trgovina pićem (vino za restoran)', 25, 'nam']];
  const DZ_TROSAK = [['Opskrbljivač električne energije', 13, 'tr'], ['Vodovod (isporuka vode)', 13, 'tr'],
    ['Drogerija (sredstva za čišćenje)', 25, 'tr'], ['Papirnica (uredski materijal)', 25, 'tr'], ['Željezarija (sitni potrošni materijal)', 25, 'tr']];
  exercises.push({
    id: 'k2-domaca-zadaca', lesson: 'second-midterm', chapter: 6, type: 'ratio', difficulty: 2,
    title: 'Domaća zadaća: šest računa i tablica na dnu obrasca',
    prompt: 'Po uzoru na obrazac domaće zadaće: tri računa za namirnice (knjiže se na 310, uz pretporez na 180 i obvezu prema dobavljaču na 220) i tri računa za troškove. U tablici su osnovice; stopa PDV-a navedena je uz račun. Izračunaj vrijednosti za tablicu na dnu obrasca. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const im = r.sample(DZ_IMOVINA, 3).map((x) => [x[0], x[1], x[2], r.int(10, 150, 1)]);
      const tr = r.sample(DZ_TROSAK, 3).map((x) => [x[0], x[1], x[2], r.int(5, 250, 1)]);
      const all = r.shuffle(im.concat(tr));
      const pdv = (x) => r2(x[3] * x[1] / 100);
      const T = sum(tr.map((x) => x[3])), Z = sum(im.map((x) => x[3]));
      const PP = r2(sum(all.map(pdv)));
      return {
        givens: all.map((x, i) => ({ label: 'Račun ' + (i + 1) + ' – ' + x[0] + ' (PDV ' + x[1] + ' %)', value: eur(x[3]) })),
        fields: [
          { key: 't', label: 'Ukupni troškovi (osnovice računa za troškove)', answer: T, unit: '€' },
          { key: 'z', label: 'Zalihe namirnica (310)', answer: Z, unit: '€' },
          { key: 'p', label: 'Ukupni pretporez (180)', answer: PP, unit: '€' },
          { key: 'd', label: 'Ukupno dobavljači (220) – svi računi s PDV-om', answer: r2(T + Z + PP), unit: '€' }
        ],
        solution: all.map((x, i) => 'Račun ' + (i + 1) + ': osnovica ' + fmt(x[3]) + ' + PDV ' + fmt(pdv(x)) + ' = ' + fmt(x[3] + pdv(x)) + (x[2] === 'nam' ? ' → 310 Zaliha namirnica' : ' → trošak (razred 4)') + '.').concat([
          'Troškovi = ' + eur(T) + '; zalihe namirnica = ' + eur(Z) + '; pretporez = ' + eur(PP) + '; dobavljači = ' + eur(T + Z + PP) + '.'
        ])
      };
    }
  });

  // =====================================================================
  // Ch7: račun dobiti i gubitka i novčani tok
  // =====================================================================
  exercises.push({
    id: 'k2-utjecaj-rdg-nt', lesson: 'second-midterm', chapter: 7, type: 'numeric', difficulty: 2,
    title: 'Utjecaj promjene na RDG i na novčani tok',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let ts, tries = 0;
      do { ts = drawTemplates(r, K2T, 3, (t) => t.nt !== undefined); tries++; }
      while (!(ts.some((t) => t.rdg) && ts.some((t) => t.nt)) && tries < 100);
      const fields = [];
      ts.forEach((t, i) => {
        fields.push({ key: 'r' + i, label: '(' + (i + 1) + ') iznos utjecaja na RDG (prihod/rashod, bez PDV-a)', answer: t.rdg ? r2(t.rdg[1]) : 0, unit: '€' });
        fields.push({ key: 'n' + i, label: '(' + (i + 1) + ') iznos utjecaja na novčani tok (primitak/izdatak, s PDV-om)', answer: t.nt ? r2(t.nt[1]) : 0, unit: '€' });
      });
      return {
        prompt: 'Promjene: ' + ts.map((t, i) => '(' + (i + 1) + ') ' + t.text).join(' ') + ' Upiši 0 ako promjena ne utječe na izvještaj. ' + UPUTA_BROJ,
        fields: fields,
        solution: ts.map((t, i) => '(' + (i + 1) + ') RDG: ' + (t.rdg ? t.rdg[0].toLowerCase() + ' ' + eur(t.rdg[1]) : 'nema utjecaja') + ' · novčani tok: ' + (t.nt ? t.nt[0].toLowerCase() + ' ' + eur(t.nt[1]) : 'nema utjecaja') + (t.note ? ' (' + t.note + ')' : '') + '.').concat([
          'U RDG uvijek ide samo osnovica (PDV nije prihod ni rashod); u novčani tok ide puni iznos koji je prošao kroz žiro račun ili blagajnu.'
        ])
      };
    }
  });

  const NT_STAVKE = [
    ['Kupci su platili fakturu za smještaj', 0], ['Prodana hrana i piće uz naplatu u gotovini', 0], ['Primljene kamate na žiro račun', 0],
    ['Plaćena faktura dobavljaču za materijal', 1], ['Isplaćene plaće', 1], ['Uplaćen PDV državi', 1], ['Plaćena premija osiguranja', 1],
    ['Prodan stari stroj, iznos naplaćen', 2], ['Vraćen nam je dani dugoročni kredit', 2],
    ['Kupljena oprema i odmah plaćena', 3], ['Kupljene dionice drugog društva (ulaganje)', 3],
    ['Emitirane dionice, iznos uplaćen', 4], ['Primljen kredit od banke na žiro račun', 4],
    ['Otplaćena glavnica kredita', 5], ['Isplaćene dividende dioničarima', 5], ['Otkupljene vlastite dionice', 5],
    ['Obračunata amortizacija', 6], ['Kupcima ispostavljena faktura (nije naplaćena)', 6], ['Banka obračunala kamatu (nije plaćena)', 6], ['Utrošen materijal u kuhinji', 6]
  ];
  exercises.push({
    id: 'k2-nt-aktivnost', lesson: 'second-midterm', chapter: 7, type: 'classify', difficulty: 2,
    title: 'Novčani tok: poslovne, investicijske ili financijske aktivnosti?',
    prompt: 'Razvrstaj svaku promjenu u izvještaju o novčanom toku (aktivnost i primitak/izdatak).',
    classes: NT,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let chosen = [0, 1, 2, 3, 4, 5, 6].map((g) => r.pick(NT_STAVKE.filter((x) => x[1] === g)));
      chosen = r.shuffle(chosen.concat(r.sample(NT_STAVKE.filter((x) => chosen.indexOf(x) < 0), 2)));
      return {
        rows: chosen.map((x) => ({ entries: [{ account: x[0], cls: NT[x[1]] }] })),
        solution: chosen.map((x) => x[0] + ' → ' + NT[x[1]]).concat([
          'Amortizacija je trošak bez izdatka; nenaplaćena faktura je prihod bez primitka.'
        ])
      };
    }
  });

  exercises.push({
    id: 'k2-rdg-izracun', lesson: 'second-midterm', chapter: 7, type: 'ratio', difficulty: 3,
    title: 'Račun dobiti i gubitka iz skupa podataka',
    prompt: 'Iz podataka izračunaj stavke računa dobiti i gubitka. Pazi: dio stavki su bilančne stavke ili novčani tokovi i ne ulaze u RDG. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const PP = r.sample([['Prihodi od smještaja', 0], ['Prihodi od najma', 0], ['Prihodi od prodaje hrane i pića', 0], ['Prihodi od cateringa', 0]], 2);
      const FP = r.sample([['Prihod od kamata', 1], ['Pozitivne tečajne razlike', 1]], 1);
      const IP = r.f() < 0.5 ? [['Prihod od inventurnih viškova', 2]] : [];
      const PR = r.sample([['Trošak amortizacije', 3], ['Trošak električne energije', 3], ['Trošak materijala', 3], ['Troškovi osoblja', 3]], 2);
      const FR = r.sample([['Negativne tečajne razlike', 4], ['Rashod od kamata', 4]], 1);
      const TR = r.sample([['Zaliha materijala', 6], ['Zgrade', 6], ['Kupci', 6], ['Izdane dionice', 6], ['Primljeni kredit', 6]], 2);
      const val = (x) => {
        if (x[1] === 0) return r.int(40, 200, 5) * 1000;
        if (x[1] === 1 || x[1] === 2) return r.int(1, 10, 1) * 1000;
        if (x[1] === 3) return r.int(5, 30, 1) * 1000;
        if (x[1] === 4) return r.int(1, 8, 1) * 1000;
        return r.int(5, 60, 1) * 1000;
      };
      const all = PP.concat(FP, IP, PR, FR, TR).map((x) => [x[0], x[1], val(x)]);
      const s = (g) => sum(all.filter((x) => g.indexOf(x[1]) >= 0).map((x) => x[2]));
      const posl = s([0]), prih = s([0, 1, 2]), rash = s([3, 4]);
      const bruto = prih - rash;
      const stopa = r.pick([10, 18, 20]);
      const porez = r2(bruto * stopa / 100);
      const list = r.shuffle(all);
      return {
        givens: list.map((x) => ({ label: x[0], value: eur(x[2]) })).concat([{ label: 'Stopa poreza na dobit', value: stopa + ' %' }]),
        fields: [
          { key: 'pp', label: 'Poslovni prihodi', answer: posl, unit: '€' },
          { key: 'up', label: 'Ukupni prihodi', answer: prih, unit: '€' },
          { key: 'ur', label: 'Ukupni rashodi', answer: rash, unit: '€' },
          { key: 'bd', label: 'Bruto dobit (dobit prije oporezivanja)', answer: bruto, unit: '€' },
          { key: 'pd', label: 'Porez na dobit', answer: porez, unit: '€' },
          { key: 'nd', label: 'Neto dobit', answer: r2(bruto - porez), unit: '€' }
        ],
        solution: [
          'Poslovni prihodi = ' + eur(posl) + '; ukupni prihodi (poslovni + financijski' + (IP.length ? ' + izvanredni' : '') + ') = ' + eur(prih) + '.',
          'Ukupni rashodi = ' + all.filter((x) => x[1] === 3 || x[1] === 4).map((x) => fmt(x[2])).join(' + ') + ' = ' + eur(rash) + '.',
          'Ne ulaze u RDG: ' + TR.map((x) => x[0]).join(', ') + ' (bilančne stavke).',
          'Bruto dobit = ' + fmt(prih) + ' − ' + fmt(rash) + ' = ' + eur(bruto) + '; porez ' + stopa + ' % = ' + eur(porez) + '; neto dobit = ' + eur(bruto - porez) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-nt-izracun', lesson: 'second-midterm', chapter: 7, type: 'ratio', difficulty: 3,
    title: 'Izvještaj o novčanom toku iz skupa podataka',
    prompt: 'Iz podataka izračunaj novčane tokove. Pazi: prihodi bez naplate, obračunske stavke i zalihe nisu primici ni izdaci. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      let all, pp, pi, ii, fp, fi, tries = 0;
      do {
        const P1 = [['Kupci su uplatili fakturu za smještaj', 'pp', r.int(40, 150, 5) * 1000]];
        if (r.f() < 0.5) P1.push(['Naplaćena prodaja hrane i pića u gotovini', 'pp', r.int(5, 40, 1) * 1000]);
        const I1 = r.sample([['Isplata plaća', 'pi'], ['Plaćanje fakture za materijal', 'pi'], ['Plaćanje PDV-a', 'pi'], ['Plaćena premija osiguranja', 'pi']], 3)
          .map((x) => [x[0], x[1], r.int(2, 30, 1) * 1000 + r.pick([0, 500])]);
        const INV = [['Kupnja opreme', 'ii', r.int(10, 80, 5) * 1000]];
        const F = r.sample([['Izdavanje dionica (uplaćeno)', 'fp'], ['Primljen dugoročni kredit', 'fp']], 1).map((x) => [x[0], x[1], r.int(20, 150, 10) * 1000]);
        const FI = r.f() < 0.5 ? [['Otplata glavnice kredita', 'fi', r.int(2, 15, 1) * 1000]] : [];
        const TRAP = r.sample([['Prihodi od prodaje hrane i pića', 'x'], ['Zaliha trgovačke robe', 'x'], ['Obračunata amortizacija', 'x'], ['Kupcima ispostavljena faktura za polupansion', 'x']], 2)
          .map((x) => [x[0], x[1], r.int(10, 200, 5) * 1000]);
        all = P1.concat(I1, INV, F, FI, TRAP);
        const s = (k) => sum(all.filter((x) => x[1] === k).map((x) => x[2]));
        pp = s('pp'); pi = s('pi'); ii = s('ii'); fp = s('fp'); fi = s('fi');
        tries++;
      } while ((pp - pi <= 0 || fp - fi <= 0 || pp - pi - ii + fp - fi <= 0) && tries < 200);
      const list = r.shuffle(all);
      return {
        givens: list.map((x) => ({ label: x[0], value: eur(x[2]) })),
        fields: [
          { key: 'pp', label: 'Primici iz poslovnih aktivnosti', answer: pp, unit: '€' },
          { key: 'pi', label: 'Izdaci iz poslovnih aktivnosti', answer: pi, unit: '€' },
          { key: 'np', label: 'Novčani tok poslovnih aktivnosti', answer: pp - pi, unit: '€' },
          { key: 'ii', label: 'Izdaci iz investicijskih aktivnosti', answer: ii, unit: '€' },
          { key: 'nf', label: 'Novčani tok financijskih aktivnosti', answer: fp - fi, unit: '€' },
          { key: 'cn', label: 'Čisti novčani tok', answer: pp - pi - ii + fp - fi, unit: '€' }
        ],
        solution: [
          'Poslovni: primici ' + eur(pp) + ' − izdaci ' + eur(pi) + ' = ' + eur(pp - pi) + '.',
          'Investicijski: izdatak za opremu ' + eur(ii) + ' (NT investicijskih aktivnosti je negativan).',
          'Financijski: primici ' + eur(fp) + ' − izdaci ' + eur(fi) + ' = ' + eur(fp - fi) + '.',
          'Čisti novčani tok = ' + fmt(pp - pi) + ' − ' + fmt(ii) + ' + ' + fmt(fp - fi) + ' = ' + eur(pp - pi - ii + fp - fi) + '.',
          'Ne ulaze: ' + all.filter((x) => x[1] === 'x').map((x) => x[0]).join(', ') + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-rdg-izvor', lesson: 'second-midterm', chapter: 7, type: 'ratio', difficulty: 2,
    title: 'Ispitni zadatak: račun dobiti i gubitka',
    prompt: 'Ispitni zadatak (porez na dobit 20 %). Izračunaj sve varijante pitanja. ' + UPUTA_BROJ,
    givens: [
      { label: 'Prihodi od smještaja', value: '100.000 €' }, { label: 'Prihodi od najma', value: '50.000 €' },
      { label: 'Troškovi amortizacije', value: '20.000 €' }, { label: 'Trošak električne energije', value: '5.000 €' },
      { label: 'Zaliha materijala', value: '5.000 €' }, { label: 'Negativna tečajna razlika', value: '2.000 €' },
      { label: 'Prihod od kamata', value: '3.000 €' }, { label: 'Zgrade', value: '24.000 €' }
    ],
    fields: [
      { key: 'bd', label: 'Bruto dobit (dobit prije oporezivanja)', answer: 126000, unit: '€' },
      { key: 'pd', label: 'Porez na dobit', answer: 25200, unit: '€' },
      { key: 'nd', label: 'Neto dobit', answer: 100800, unit: '€' },
      { key: 'pp', label: 'Poslovni prihodi', answer: 150000, unit: '€' },
      { key: 'up', label: 'Ukupni prihodi', answer: 153000, unit: '€' },
      { key: 'ur', label: 'Ukupni rashodi', answer: 27000, unit: '€' }
    ],
    solution: [
      'Poslovni prihodi = 100.000 + 50.000 = 150.000; ukupni prihodi = 150.000 + 3.000 = 153.000.',
      'Ukupni rashodi = 20.000 + 5.000 + 2.000 = 27.000 (zaliha materijala i zgrade su bilančne stavke).',
      'Bruto dobit = 153.000 − 27.000 = 126.000; porez = 126.000 × 20 % = 25.200; neto dobit = 100.800.'
    ]
  });

  exercises.push({
    id: 'k2-nt-izvor', lesson: 'second-midterm', chapter: 7, type: 'ratio', difficulty: 2,
    title: 'Ispitni zadatak: novčani tok',
    prompt: 'Ispitni zadatak. Izračunaj sve varijante pitanja. ' + UPUTA_BROJ,
    givens: [
      { label: 'Prihodi od prodaje hrane i pića', value: '200.000 €' }, { label: 'Isplata plaća', value: '30.000 €' },
      { label: 'Plaćanje fakture za materijal', value: '12.500 €' }, { label: 'Kupovina opreme', value: '50.000 €' },
      { label: 'Izdavanje dionica', value: '100.000 €' }, { label: 'Plaćanje PDV-a', value: '4.000 €' },
      { label: 'Kupci su uplatili fakturu za smještaj', value: '70.000 €' }, { label: 'Zaliha trgovačke robe', value: '30.000 €' }
    ],
    fields: [
      { key: 'pp', label: 'Primici iz poslovnih aktivnosti', answer: 70000, unit: '€' },
      { key: 'pi', label: 'Izdaci iz poslovnih aktivnosti', answer: 46500, unit: '€' },
      { key: 'np', label: 'Novčani tok iz poslovnih aktivnosti', answer: 23500, unit: '€' },
      { key: 'fp', label: 'Primici iz financijskih aktivnosti', answer: 100000, unit: '€' },
      { key: 'ii', label: 'Izdaci iz investicijskih aktivnosti', answer: 50000, unit: '€' },
      { key: 'cn', label: 'Čisti novčani tok', answer: 73500, unit: '€' }
    ],
    solution: [
      'Primici iz poslovnih aktivnosti = uplata kupaca 70.000 („prihodi od prodaje hrane i pića” su prihod, a ne primitak — nije rečeno da je naplaćeno).',
      'Izdaci iz poslovnih aktivnosti = 30.000 + 12.500 + 4.000 = 46.500 → NT poslovnih aktivnosti = 23.500.',
      'Ispravak izvora: u zbirci pitanja kao rješenje stoji 27.500 — točno je 70.000 − 46.500 = 23.500.',
      'Čisti novčani tok = 23.500 − 50.000 + 100.000 = 73.500.'
    ]
  });

  exercises.push({
    id: 'k2-rdg-nt-tvrdnje', lesson: 'second-midterm', chapter: 7, type: 'choice', difficulty: 2,
    title: 'Označite točne tvrdnje (RDG i novčani tok)',
    prompt: 'Podaci: prihod od prodaje gotovih proizvoda 20.000, prihod od usluga smještaja u polupansionu 80.000, rashodi od pruženih usluga 20.000, izdatak iz poslovnih aktivnosti 30.000, primitak iz poslovnih aktivnosti 40.000, zaliha sirovina 10.000, rashod od kamata 10.000. Odluči za svaku tvrdnju je li točna.',
    items: [
      { kind: 'tf', q: 'Poslovni prihodi iznose 100.000.', answer: true },
      { kind: 'tf', q: 'Čisti novčani tok iz poslovnih aktivnosti iznosi 10.000.', answer: true },
      { kind: 'tf', q: 'Rezultat razdoblja prije oporezivanja iznosi 70.000.', answer: true },
      { kind: 'tf', q: 'Ukupni prihodi iznose 110.000 jer i zaliha sirovina ulazi u prihode.', answer: false },
      { kind: 'tf', q: 'Rezultat prije oporezivanja iznosi 80.000.', answer: false },
      { kind: 'tf', q: 'Rashod od kamata je financijski rashod.', answer: true },
      { kind: 'mc', q: 'Sa zalihe je prodano 40 kolača (cijena koštanja 10 po komadu, prodajna cijena 15). Kolači još nisu naplaćeni. Koliko iznose primici od prodaje?', options: ['600', '400', '200', '0'], answer: 3 },
      { kind: 'mc', q: 'Sa žiro računa radnicima su isplaćene obračunate plaće od 24.000. To je:', options: ['Poslovni rashod', 'Poslovni izdatak', 'Financijski izdatak', 'Investicijski izdatak'], answer: 1 }
    ],
    solution: [
      'Poslovni prihodi = 20.000 + 80.000 = 100.000; rezultat = 100.000 − 20.000 − 10.000 = 70.000.',
      'NT poslovnih aktivnosti = 40.000 − 30.000 = 10.000. Zaliha sirovina je bilančna stavka.',
      'Kolači: prihod 40 × 15 = 600, rashod 40 × 10 = 400, primitak 0 (nije naplaćeno).',
      'Isplata već obračunatih plaća je izdatak iz poslovnih aktivnosti (trošak je nastao pri obračunu).'
    ]
  });

  exercises.push({
    id: 'k2-kolaci', lesson: 'second-midterm', chapter: 7, type: 'numeric', difficulty: 1,
    title: 'Prodaja sa zalihe: prihod, rashod, primitak',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const n = r.int(20, 200, 5), ck = r.int(4, 20, 1), pc = ck + r.int(2, 15, 1);
      const nap = r.f() < 0.5;
      return {
        prompt: 'Sa zalihe gotovih proizvoda prodano je ' + n + ' kolača. Cijena koštanja jednog kolača je ' + eur(ck) + ', a prodajna cijena ' + eur(pc) + ' (bez PDV-a). Kolači ' + (nap ? 'su odmah naplaćeni u gotovini.' : 'još nisu naplaćeni.') + ' ' + UPUTA_BROJ,
        fields: [
          { key: 'p', label: 'Prihodi od prodaje', answer: n * pc, unit: '€' },
          { key: 'r', label: 'Rashodi (vrijednost prodanih kolača)', answer: n * ck, unit: '€' },
          { key: 'd', label: 'Rezultat (dobit) od prodaje', answer: n * (pc - ck), unit: '€' },
          { key: 'm', label: 'Primici od prodaje', answer: nap ? n * pc : 0, unit: '€', hint: 'Primitak postoji samo ako je naplaćeno.' }
        ],
        solution: [
          'Prihod = ' + n + ' × ' + fmt(pc) + ' = ' + eur(n * pc) + '; rashod = ' + n + ' × ' + fmt(ck) + ' = ' + eur(n * ck) + '.',
          'Dobit = ' + eur(n * (pc - ck)) + '.',
          nap ? 'Naplaćeno → primitak = ' + eur(n * pc) + '.' : 'Nije naplaćeno → primitak = 0 (prihod bez primitka).'
        ]
      };
    }
  });

  // =====================================================================
  // Ch8: dugotrajna imovina, amortizacija, sitni inventar
  // =====================================================================
  exercises.push({
    id: 'k2-amort-linearna', lesson: 'second-midterm', chapter: 8, type: 'numeric', difficulty: 1,
    title: 'Linearna amortizacija',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const v = r.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]);
      const N = r.int(10, 200, 1) * 1000;
      const k = r.int(1, v - 1, 1);
      const god = N / v;
      const naziv = r.pick(['Kuhinjska oprema', 'Računalna oprema', 'Hotelsko dizalo', 'Klima-uređaji', 'Oprema praonice']);
      return {
        prompt: naziv + ' nabavne vrijednosti ' + eur(N) + ' ima korisni vijek ' + v + ' godina. Obračunaj linearnu amortizaciju i stanje nakon ' + k + '. godine. ' + UPUTA_BROJ,
        fields: [
          { key: 's', label: 'Godišnja stopa amortizacije', answer: r2(100 / v), unit: '%' },
          { key: 'a', label: 'Godišnja amortizacija', answer: god, unit: '€' },
          { key: 'i', label: 'Ispravak vrijednosti nakon ' + k + '. godine', answer: god * k, unit: '€' },
          { key: 'sv', label: 'Sadašnja vrijednost nakon ' + k + '. godine', answer: N - god * k, unit: '€' }
        ],
        solution: [
          'Stopa = 100 % ÷ ' + v + ' = ' + pct(100 / v) + '.',
          'Godišnja amortizacija = ' + fmt(N) + ' × ' + pct(100 / v) + ' = ' + eur(god) + '.',
          'Ispravak nakon ' + k + '. god. = ' + k + ' × ' + fmt(god) + ' = ' + eur(god * k) + '; sadašnja vrijednost = ' + fmt(N) + ' − ' + fmt(god * k) + ' = ' + eur(N - god * k) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-amort-degresivna', lesson: 'second-midterm', chapter: 8, type: 'numeric', difficulty: 2,
    title: 'Degresivna amortizacija (stopa na neotpisanu vrijednost)',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const s = r.pick([20, 40, 50]);
      const N = r.int(10, 150, 1) * 1000;
      const a1 = N * s / 100, a2 = (N - a1) * s / 100, a3 = (N - a1 - a2) * s / 100;
      return {
        prompt: 'Oprema nabavne vrijednosti ' + eur(N) + ' amortizira se degresivno po stopi ' + s + ' % na neotpisanu vrijednost. ' + UPUTA_BROJ,
        fields: [
          { key: 'a1', label: 'Amortizacija 1. godine', answer: r2(a1), unit: '€' },
          { key: 'a2', label: 'Amortizacija 2. godine', answer: r2(a2), unit: '€' },
          { key: 'a3', label: 'Amortizacija 3. godine', answer: r2(a3), unit: '€' },
          { key: 'n3', label: 'Neotpisana vrijednost na kraju 3. godine', answer: r2(N - a1 - a2 - a3), unit: '€' }
        ],
        solution: [
          '1. god.: ' + fmt(N) + ' × ' + s + ' % = ' + eur(a1) + ' → neotpisano ' + eur(N - a1) + '.',
          '2. god.: ' + fmt(N - a1) + ' × ' + s + ' % = ' + eur(a2) + ' → neotpisano ' + eur(N - a1 - a2) + '.',
          '3. god.: ' + fmt(N - a1 - a2) + ' × ' + s + ' % = ' + eur(a3) + ' → neotpisano ' + eur(N - a1 - a2 - a3) + '.',
          'Iznos amortizacije pada iz godine u godinu (brži otpis na početku).'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-amort-funkcionalna', lesson: 'second-midterm', chapter: 8, type: 'numeric', difficulty: 2,
    title: 'Funkcionalna amortizacija (po radnom satu)',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const rate = r.pick([0.5, 1, 1.5, 2, 2.5, 4, 5]);
      const Kap = r.int(10, 100, 5) * 1000;
      const N = Kap * rate;
      const h1 = r.int(2, Math.floor(Kap / 3000), 1) * 500, h2 = r.int(2, Math.floor(Kap / 3000), 1) * 500;
      return {
        prompt: 'Stroj nabavne vrijednosti ' + eur(N) + ' ima predviđeni kapacitet ' + fmt(Kap) + ' radnih sati. U 1. godini radio je ' + fmt(h1) + ' sati, a u 2. godini ' + fmt(h2) + ' sati. ' + UPUTA_BROJ,
        fields: [
          { key: 'h', label: 'Amortizacija po radnom satu', answer: rate, unit: '€' },
          { key: 'a1', label: 'Amortizacija 1. godine', answer: r2(h1 * rate), unit: '€' },
          { key: 'a2', label: 'Amortizacija 2. godine', answer: r2(h2 * rate), unit: '€' },
          { key: 'sv', label: 'Sadašnja vrijednost nakon 2. godine', answer: r2(N - (h1 + h2) * rate), unit: '€' }
        ],
        solution: [
          'Po satu = ' + fmt(N) + ' ÷ ' + fmt(Kap) + ' = ' + eur(rate) + '.',
          '1. god.: ' + fmt(h1) + ' × ' + fmt(rate) + ' = ' + eur(h1 * rate) + '; 2. god.: ' + fmt(h2) + ' × ' + fmt(rate) + ' = ' + eur(h2 * rate) + '.',
          'Sadašnja vrijednost = ' + fmt(N) + ' − ' + fmt((h1 + h2) * rate) + ' = ' + eur(N - (h1 + h2) * rate) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-amort-prodaja', lesson: 'second-midterm', chapter: 8, type: 'numeric', difficulty: 2,
    title: 'Prodaja dugotrajne imovine: dobitak ili gubitak',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const N = r.int(20, 120, 2) * 1000;
      const I = r.int(2, N / 1000 - 4, 1) * 1000;
      const nv = N - I;
      const dob = r.f() < 0.5;
      const P = dob ? nv + r.int(1, 10, 1) * 500 : Math.max(500, nv - r.int(1, Math.min(10, nv / 500 - 1), 1) * 500);
      return {
        prompt: 'Prodana je oprema nabavne vrijednosti ' + eur(N) + ' i ispravka vrijednosti ' + eur(I) + ' po cijeni ' + eur(P) + '. Upiši 0 u polje koje se ne odnosi na ovu prodaju. ' + UPUTA_BROJ,
        fields: [
          { key: 'nv', label: 'Neotpisana (sadašnja) vrijednost', answer: nv, unit: '€' },
          { key: 'd', label: 'Dobitak od prodaje (izvanredni prihod)', answer: P > nv ? P - nv : 0, unit: '€' },
          { key: 'g', label: 'Gubitak od prodaje (izvanredni rashod)', answer: P < nv ? nv - P : 0, unit: '€' }
        ],
        solution: [
          'Neotpisana vrijednost = ' + fmt(N) + ' − ' + fmt(I) + ' = ' + eur(nv) + '.',
          P > nv ? 'Prodajna cijena veća je od neotpisane → dobitak ' + eur(P - nv) + ' (izvanredni prihod).' : 'Prodajna cijena manja je od neotpisane → gubitak ' + eur(nv - P) + ' (izvanredni rashod).'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-sitni-inventar', lesson: 'second-midterm', chapter: 8, type: 'numeric', difficulty: 1,
    title: 'Otpis sitnog inventara',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const S = r.int(5, 100, 1) * 100;
      const v = r.pick([2, 4, 5]);
      const naziv = r.pick(['posteljina', 'pribor za jelo', 'ručnici', 'radne uniforme', 'stolno staklo']);
      return {
        prompt: 'Hotel je u uporabu stavio sitni inventar (' + naziv + ') nabavne vrijednosti ' + eur(S) + '. Izračunaj otpis po svakoj metodi (kalkulativni otpis: vijek ' + v + ' godine/a). ' + UPUTA_BROJ,
        fields: [
          { key: 'j', label: 'Jednokratni (100 %) otpis – trošak pri stavljanju u uporabu', answer: S, unit: '€' },
          { key: 'p1', label: 'Otpis 50 % – trošak pri stavljanju u uporabu', answer: S / 2, unit: '€' },
          { key: 'p2', label: 'Otpis 50 % – trošak pri rashodovanju', answer: S / 2, unit: '€' },
          { key: 'k', label: 'Kalkulativni otpis – godišnji iznos', answer: S / v, unit: '€' }
        ],
        solution: [
          'Jednokratni otpis: cijela vrijednost ' + eur(S) + ' odmah na teret troškova.',
          'Metoda 50 %: ' + eur(S / 2) + ' pri stavljanju u uporabu i ' + eur(S / 2) + ' pri rashodovanju.',
          'Kalkulativni: ' + fmt(S) + ' ÷ ' + v + ' = ' + eur(S / v) + ' godišnje (kao amortizacija).',
          'Pazi: u „miksu kolokvija” opisi metoda 50 % i 100 % su zamijenjeni.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-amort-tf', lesson: 'second-midterm', chapter: 8, type: 'choice', difficulty: 1,
    title: 'Amortizacija i sitni inventar – provjera pojmova',
    prompt: 'Odluči je li tvrdnja točna ili netočna, odnosno odaberi točan odgovor.',
    items: [
      { kind: 'tf', q: 'Zemljište se ne amortizira.', answer: true },
      { kind: 'tf', q: 'Kod degresivne metode iznos amortizacije raste iz godine u godinu.', answer: false },
      { kind: 'tf', q: 'Amortizacija je trošak bez izdatka.', answer: true },
      { kind: 'tf', q: 'Pri knjiženju amortizacije zgrade potražuje se konto Zgrade.', answer: false },
      { kind: 'tf', q: 'Kod funkcionalne metode amortizacija se obračunava po proizvedenoj jedinici ili radnom satu.', answer: true },
      { kind: 'tf', q: 'Povratni PDV (pretporez) ulazi u trošak nabave dugotrajne imovine.', answer: false },
      { kind: 'tf', q: 'Degresivna metoda primjerena je inflaciji i brzom tehnološkom napretku.', answer: true },
      { kind: 'tf', q: 'Sitni inventar iskazuje se među zalihama (razred 3) iako traje dulje od godine.', answer: true },
      { kind: 'mc', q: 'Knjiženje obračunate amortizacije zgrade:', options: ['431 duguje / 029 potražuje', '029 duguje / 431 potražuje', '431 duguje / Zgrade potražuje', 'Zgrade duguje / 029 potražuje'], answer: 0 },
      { kind: 'mc', q: 'Obračun amortizacije je bilančna promjena:', options: ['Centrifugalna uslijed rashoda', 'Periferijska uslijed rashoda', 'Koncentrična', 'Centripetalna uslijed prihoda'], answer: 0 }
    ],
    solution: [
      'Ne amortiziraju se zemljište, prirodna bogatstva, umjetničke vrijednosti i spomenička baština.',
      'Degresivna: iznos pada (stopa na neotpisanu vrijednost); progresivna: iznos raste.',
      'Amortizacija: 431 Trošak amortizacije D / 029 Ispravak vrijednosti P — konto imovine se ne dira; neto vrijednost pada, kapital pada kroz trošak (centrifugalna uslijed rashoda).',
      'Povratni PDV je potraživanje (180), a ne dio troška nabave.'
    ]
  });

  // =====================================================================
  // Ch9: zalihe
  // =====================================================================
  function zaliheCombo(r) {
    // Traži čiste brojeve: prosječna cijena i utrošak s najviše 2 decimale.
    for (let t = 0; t < 400; t++) {
      const q0 = r.int(50, 300, 10), q1 = r.int(100, 400, 10);
      const c0 = r.int(4, 30, 1), c1 = c0 + r.pick([-2, -1, 1, 2, 3, 4, 5]);
      if (c1 <= 0) continue;
      const q2 = r.int(q0 + 10, q0 + q1 - 10, 10);
      const avg = (q0 * c0 + q1 * c1) / (q0 + q1);
      if (Math.abs(avg * 100 - Math.round(avg * 100)) > 1e-7) continue;
      return { q0: q0, c0: c0, q1: q1, c1: c1, q2: q2, avg: r2(avg) };
    }
    return { q0: 100, c0: 20, q1: 200, c1: 23, q2: 250, avg: 22 };
  }
  exercises.push({
    id: 'k2-zalihe-metode', lesson: 'second-midterm', chapter: 9, type: 'numeric', difficulty: 3,
    title: 'Utrošak zaliha: FIFO, prosječne cijene, LIFO',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const z = zaliheCombo(r);
      const art = r.pick(['brašna', 'šećera', 'riže', 'ulja', 'deterdženta']);
      const fifo = z.q2 <= z.q0 ? z.q2 * z.c0 : z.q0 * z.c0 + (z.q2 - z.q0) * z.c1;
      const lifo = z.q2 <= z.q1 ? z.q2 * z.c1 : z.q1 * z.c1 + (z.q2 - z.q1) * z.c0;
      const total = z.q0 * z.c0 + z.q1 * z.c1;
      const avgU = r2(z.q2 * z.avg);
      return {
        prompt: 'Početna zaliha ' + art + ' je ' + z.q0 + ' kg po ' + eur(z.c0) + '/kg; nabavljeno je ' + z.q1 + ' kg po ' + eur(z.c1) + '/kg; u kuhinju je izdano ' + z.q2 + ' kg. Izračunaj utrošak i završnu zalihu. (LIFO je gradivo kolegija — MRS 2 i HSFI 10 ga ne dopuštaju u financijskom izvještavanju.) ' + UPUTA_BROJ,
        fields: [
          { key: 'fu', label: 'FIFO – utrošak', answer: fifo, unit: '€' },
          { key: 'fz', label: 'FIFO – završna zaliha', answer: total - fifo, unit: '€' },
          { key: 'pc', label: 'Prosječna cijena po kg', answer: z.avg, unit: '€' },
          { key: 'pu', label: 'Prosječne cijene – utrošak', answer: avgU, unit: '€' },
          { key: 'pz', label: 'Prosječne cijene – završna zaliha', answer: r2(total - avgU), unit: '€' },
          { key: 'lu', label: 'LIFO – utrošak', answer: lifo, unit: '€' },
          { key: 'lz', label: 'LIFO – završna zaliha', answer: total - lifo, unit: '€' }
        ],
        solution: [
          'Raspoloživo: ' + (z.q0 + z.q1) + ' kg u vrijednosti ' + fmt(z.q0 * z.c0) + ' + ' + fmt(z.q1 * z.c1) + ' = ' + eur(total) + '.',
          'FIFO: ' + (z.q2 <= z.q0 ? z.q2 + ' × ' + fmt(z.c0) : z.q0 + ' × ' + fmt(z.c0) + ' + ' + (z.q2 - z.q0) + ' × ' + fmt(z.c1)) + ' = ' + eur(fifo) + '; završna = ' + eur(total - fifo) + '.',
          'Prosjek: ' + fmt(total) + ' ÷ ' + (z.q0 + z.q1) + ' = ' + eur(z.avg) + '/kg → utrošak ' + z.q2 + ' × ' + fmt(z.avg) + ' = ' + eur(avgU) + '; završna = ' + eur(total - avgU) + '.',
          'LIFO: ' + (z.q2 <= z.q1 ? z.q2 + ' × ' + fmt(z.c1) : z.q1 + ' × ' + fmt(z.c1) + ' + ' + (z.q2 - z.q1) + ' × ' + fmt(z.c0)) + ' = ' + eur(lifo) + '; završna = ' + eur(total - lifo) + '.',
          'Kontrola: utrošak + završna zaliha = ' + eur(total) + ' za svaku metodu.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-zalihe-izvor', lesson: 'second-midterm', chapter: 9, type: 'numeric', difficulty: 2,
    title: 'Riješeni primjer: brašno (FIFO, prosjek, LIFO)',
    prompt: 'Početna zaliha brašna 100 kg po 20 €; nabavljeno 200 kg po 23 €; u kuhinju izdano 250 kg. ' + UPUTA_BROJ,
    fields: [
      { key: 'fu', label: 'FIFO – utrošak', answer: 5450, unit: '€' },
      { key: 'fz', label: 'FIFO – završna zaliha (50 kg)', answer: 1150, unit: '€' },
      { key: 'pu', label: 'Prosječne cijene – utrošak', answer: 5500, unit: '€' },
      { key: 'pz', label: 'Prosječne cijene – završna zaliha', answer: 1100, unit: '€' },
      { key: 'lu', label: 'LIFO – utrošak', answer: 5600, unit: '€' },
      { key: 'lz', label: 'LIFO – završna zaliha', answer: 1000, unit: '€' }
    ],
    solution: [
      'FIFO: 100 × 20 + 150 × 23 = 2.000 + 3.450 = 5.450; završna 50 × 23 = 1.150.',
      'Prosjek: (2.000 + 4.600) ÷ 300 = 22 → 250 × 22 = 5.500; završna 50 × 22 = 1.100.',
      'LIFO: 200 × 23 + 50 × 20 = 5.600; završna 50 × 20 = 1.000.',
      'Kad cijene rastu, FIFO daje najmanji trošak (veći rezultat), a LIFO najveći.'
    ]
  });

  exercises.push({
    id: 'k2-zalihe-trosak-nabave', lesson: 'second-midterm', chapter: 9, type: 'ratio', difficulty: 2,
    title: 'Trošak nabave materijala',
    prompt: 'Iz podataka o nabavi izračunaj trošak nabave (kupovna cijena + zavisni troškovi + carina; povratni PDV ne ulazi). ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const q = r.pick([100, 200, 250, 500]);
      const kc = r.int(100, 800, 1) * 10, pr = r.int(5, 60, 1) * 10, os = r.int(1, 20, 1) * 10, ut = r.int(1, 15, 1) * 10;
      const car = r.f() < 0.5 ? r.int(5, 50, 1) * 10 : 0;
      const T = kc + pr + os + ut + car;
      const givens = [
        { label: 'Količina (kg)', value: fmt(q) },
        { label: 'Kupovna cijena dobavljača (ukupno)', value: eur(kc) },
        { label: 'PDV na fakturi dobavljača (25 %, povratni)', value: eur(kc * 0.25) },
        { label: 'Prijevoz', value: eur(pr) },
        { label: 'Osiguranje u transportu', value: eur(os) },
        { label: 'Utovar i istovar', value: eur(ut) }
      ];
      if (car) givens.push({ label: 'Carina i uvozne pristojbe', value: eur(car) });
      return {
        givens: givens,
        fields: [
          { key: 't', label: 'Trošak nabave (ukupno)', answer: T, unit: '€' },
          { key: 'j', label: 'Trošak nabave po kg', answer: r2(T / q), unit: '€' }
        ],
        solution: [
          'Trošak nabave = ' + [kc, pr, os, ut].concat(car ? [car] : []).map(fmt).join(' + ') + ' = ' + eur(T) + '.',
          'PDV od ' + eur(kc * 0.25) + ' je pretporez (180) i ne ulazi u trošak nabave.',
          'Po kg = ' + fmt(T) + ' ÷ ' + q + ' = ' + eur(T / q) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-zalihe-tf', lesson: 'second-midterm', chapter: 9, type: 'choice', difficulty: 1,
    title: 'Zalihe – metode i dokumenti',
    prompt: 'Odluči je li tvrdnja točna ili netočna, odnosno odaberi točan odgovor.',
    items: [
      { kind: 'tf', q: 'FIFO: izdaje se po cijeni najstarije nabave dok se ne iscrpi.', answer: true },
      { kind: 'tf', q: 'LIFO izlaz obračunava po prvoj ulaznoj cijeni.', answer: false },
      { kind: 'tf', q: 'Kad cijene rastu, FIFO daje najmanji trošak utroška.', answer: true },
      { kind: 'tf', q: 'MRS 2 i HSFI 10 dopuštaju metodu LIFO u financijskom izvještavanju.', answer: false },
      { kind: 'tf', q: 'NIFO se ne može koristiti jer se temelji na cijenama koje još nisu nastale.', answer: true },
      { kind: 'tf', q: 'Zalihe se vrednuju po trošku nabave ili neto utrživoj vrijednosti – nižoj od njih.', answer: true },
      { kind: 'mc', q: 'Izdavanje materijala u kuhinju dokumentira se:', options: ['Primkom', 'Izdatnicom', 'Otpremnicom', 'Predatnicom'], answer: 1 },
      { kind: 'mc', q: 'Nabava i ulaz materijala u skladište dokumentira se:', options: ['Primkom', 'Izdatnicom', 'Otpremnicom', 'Inventurnom listom'], answer: 0 },
      { kind: 'mc', q: 'Što NE ulazi u trošak nabave materijala?', options: ['Prijevoz', 'Carina', 'Povratni PDV (pretporez)', 'Osiguranje u transportu'], answer: 2 }
    ],
    solution: [
      'FIFO = prva ulazna cijena – prva izlazna; LIFO = zadnja ulazna – prva izlazna (u „miksu kolokvija” LIFO je pogrešno opisan kao FIFO).',
      'Dokumenti: primka (ulaz), izdatnica (izdavanje u proizvodnju/kuhinju), otpremnica (prodaja), inventurne liste (viškovi i manjkovi).'
    ]
  });

  // =====================================================================
  // Ch10: kalkulacije
  // =====================================================================
  exercises.push({
    id: 'k2-kalk-djelidbene', lesson: 'second-midterm', chapter: 10, type: 'numeric', difficulty: 2,
    title: 'Djelidbene kalkulacije: čista, višefazna, vezani proizvodi',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const q1 = r.int(10, 200, 10), u1 = r.int(4, 30, 1) + r.pick([0, 0.5]);
      const q2 = r.pick([200, 250, 400, 500, 1000]), f1 = r.int(2, 12, 1), f2 = r.int(1, 8, 1);
      const q3 = r.pick([100, 200, 250, 400, 500, 800, 900]), u3 = r.int(5, 20, 1), nus = r.int(1, 20, 1) * 100;
      const T1 = q1 * u1, T2a = q2 * f1, T2b = q2 * f2, T3 = q3 * u3 + nus;
      return {
        prompt: 'a) Čista djelidbena: ukupni trošak ' + q1 + ' istovrsnih obroka iznosi ' + eur(T1) + '. b) Višefazna: u 1. fazi trošak ' + eur(T2a) + ' za ' + fmt(q2) + ' kom poluproizvoda, u 2. fazi dodatni trošak ' + eur(T2b) + ' za ' + fmt(q2) + ' gotovih kom. c) Vezani proizvodi: ukupni trošak ' + eur(T3) + '; uz ' + q3 + ' kg glavnog proizvoda nastaje nusproizvod procijenjene vrijednosti ' + eur(nus) + '. ' + UPUTA_BROJ,
        fields: [
          { key: 'a', label: 'a) Trošak po obroku', answer: u1, unit: '€' },
          { key: 'b1', label: 'b) Trošak po kom poluproizvoda (1. faza)', answer: f1, unit: '€' },
          { key: 'b2', label: 'b) Cijena koštanja gotovog proizvoda', answer: f1 + f2, unit: '€' },
          { key: 'c', label: 'c) Cijena koštanja glavnog proizvoda po kg', answer: u3, unit: '€' }
        ],
        solution: [
          'a) ' + fmt(T1) + ' ÷ ' + q1 + ' = ' + eur(u1) + '.',
          'b) 1. faza: ' + fmt(T2a) + ' ÷ ' + fmt(q2) + ' = ' + eur(f1) + '; cijena koštanja = (' + fmt(T2a) + ' + ' + fmt(T2b) + ') ÷ ' + fmt(q2) + ' = ' + eur(f1 + f2) + '.',
          'c) (' + fmt(T3) + ' − ' + fmt(nus) + ') ÷ ' + q3 + ' = ' + eur(u3) + '.'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-kalk-ekvivalentni', lesson: 'second-midterm', chapter: 10, type: 'ratio', difficulty: 2,
    title: 'Kalkulacija ekvivalentnim brojevima (hotelska praonica)',
    prompt: 'Hotelska praonica: rasporedi ukupni trošak na vrste pranja pomoću ekvivalentnih brojeva. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const q1 = r.int(5, 20, 1) * 100, q2 = r.int(2, 10, 1) * 100;
      const e2 = r.pick([1.5, 2, 3]);
      const c = r.pick([2, 2.5, 3, 4, 4.5, 5]);
      const U = q1 + q2 * e2;
      const T = r2(U * c);
      return {
        givens: [
          { label: 'Ukupni trošak praonice', value: eur(T) },
          { label: 'Posteljina (kg), ekvivalentni broj 1', value: fmt(q1) },
          { label: 'Stolnjaci (kg), ekvivalentni broj ' + fmt(e2), value: fmt(q2) }
        ],
        fields: [
          { key: 'u', label: 'Ukupno uvjetnih jedinica', answer: U },
          { key: 'c', label: 'Trošak po uvjetnoj jedinici', answer: c, unit: '€' },
          { key: 'p', label: 'Trošak po kg posteljine', answer: c, unit: '€' },
          { key: 's', label: 'Trošak po kg stolnjaka', answer: r2(c * e2), unit: '€' },
          { key: 'ts', label: 'Ukupni trošak pranja stolnjaka', answer: r2(q2 * e2 * c), unit: '€' }
        ],
        solution: [
          'Uvjetne jedinice = ' + fmt(q1) + ' × 1 + ' + fmt(q2) + ' × ' + fmt(e2) + ' = ' + fmt(U) + '.',
          'Po uvjetnoj jedinici = ' + fmt(T) + ' ÷ ' + fmt(U) + ' = ' + eur(c) + ' → posteljina ' + eur(c) + '/kg, stolnjaci ' + fmt(c) + ' × ' + fmt(e2) + ' = ' + eur(c * e2) + '/kg.',
          'Stolnjaci ukupno = ' + fmt(q2) + ' × ' + fmt(c * e2) + ' = ' + eur(q2 * e2 * c) + '; posteljina = ' + eur(q1 * c) + ' (zbroj = ' + eur(T) + ').'
        ]
      };
    }
  });

  exercises.push({
    id: 'k2-kalk-sumarna-izvor', lesson: 'second-midterm', chapter: 10, type: 'ratio', difficulty: 3,
    title: 'Ispitni zadatak: sumarna dodatna kalkulacija (Restoran)',
    prompt: 'Centar odgovornosti Restoran primjenjuje sumarnu dodatnu kalkulaciju. Pripremljeno je 250 mesnih jela (A), za koja je utrošeno MI 8.000 i PI 14.000; razlika do ukupnih troškova odnosi se na 200 ribljih jela (B). OTUP se raspoređuje na bazi PI, a OTI na bazi MI. Postotke i cijene koštanja upiši na 2 decimale. ' + UPUTA_BROJ,
    givens: [
      { label: 'Materijal izrade (MI) ukupno', value: '18.000 €' }, { label: 'Plaće izrade (PI) ukupno', value: '30.000 €' },
      { label: 'Opći troškovi uprave i prodaje (OTUP)', value: '36.000 €' }, { label: 'Opći troškovi izrade (OTI)', value: '30.000 €' }
    ],
    fields: [
      { key: 'poti', label: 'Postotak dodatka OTI na MI', answer: 166.67, tol: 0.01, unit: '%' },
      { key: 'potup', label: 'Postotak dodatka OTUP na PI', answer: 120, tol: 0.01, unit: '%' },
      { key: 'fa', label: 'Puni trošak jela A', answer: 52133.33, tol: 0.5, unit: '€' },
      { key: 'fb', label: 'Puni trošak jela B', answer: 61866.67, tol: 0.5, unit: '€' },
      { key: 'cka', label: 'Cijena koštanja jela A', answer: 208.53, tol: 0.01, unit: '€' },
      { key: 'ckb', label: 'Cijena koštanja jela B', answer: 309.33, tol: 0.01, unit: '€' }
    ],
    solution: [
      'Direktni troškovi B: MI = 18.000 − 8.000 = 10.000; PI = 30.000 − 14.000 = 16.000.',
      'OTI na MI = 30.000 ÷ 18.000 × 100 = 166,67 %; OTUP na PI = 36.000 ÷ 30.000 × 100 = 120 %.',
      'A: 8.000 + 14.000 + 13.333,33 + 16.800 = 52.133,33 → ÷ 250 = 208,53.',
      'B: 10.000 + 16.000 + 16.666,67 + 19.200 = 61.866,67 → ÷ 200 = 309,33.',
      'Kontrola: 52.133,33 + 61.866,67 = 114.000 = 18.000 + 30.000 + 30.000 + 36.000.'
    ]
  });

  exercises.push({
    id: 'k2-kalk-sumarna', lesson: 'second-midterm', chapter: 10, type: 'ratio', difficulty: 3,
    title: 'Sumarna dodatna kalkulacija – nove brojke',
    prompt: 'Restoran priprema jela A i B. Za jela A zadani su direktni troškovi; ostatak direktnih troškova pripada jelima B. OTI se raspoređuje na bazi MI, a OTUP na bazi PI. Cijene koštanja upiši na 2 decimale. ' + UPUTA_BROJ,
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const pO = r.pick([50, 75, 80, 100, 120, 125, 150, 200]), pU = r.pick([50, 75, 80, 100, 120, 125, 150, 200]);
      const miA = r.int(4, 20, 1) * 1000, miB = r.int(4, 20, 1) * 1000, piA = r.int(6, 30, 1) * 1000, piB = r.int(6, 30, 1) * 1000;
      const qA = r.pick([100, 125, 150, 200, 250, 300]), qB = r.pick([100, 120, 150, 200, 250, 400]);
      const MI = miA + miB, PI = piA + piB, OTI = MI * pO / 100, OTUP = PI * pU / 100;
      const fA = miA + piA + miA * pO / 100 + piA * pU / 100, fB = miB + piB + miB * pO / 100 + piB * pU / 100;
      return {
        givens: [
          { label: 'MI ukupno', value: eur(MI) }, { label: 'PI ukupno', value: eur(PI) },
          { label: 'OTI ukupno', value: eur(OTI) }, { label: 'OTUP ukupno', value: eur(OTUP) },
          { label: 'Jela A – MI', value: eur(miA) }, { label: 'Jela A – PI', value: eur(piA) },
          { label: 'Količina jela A', value: fmt(qA) }, { label: 'Količina jela B', value: fmt(qB) }
        ],
        fields: [
          { key: 'po', label: 'Postotak dodatka OTI na MI', answer: pO, tol: 0.01, unit: '%' },
          { key: 'pu', label: 'Postotak dodatka OTUP na PI', answer: pU, tol: 0.01, unit: '%' },
          { key: 'fa', label: 'Puni trošak jela A', answer: r2(fA), unit: '€' },
          { key: 'fb', label: 'Puni trošak jela B', answer: r2(fB), unit: '€' },
          { key: 'ca', label: 'Cijena koštanja jela A', answer: r2(fA / qA), tol: 0.01, unit: '€' },
          { key: 'cb', label: 'Cijena koštanja jela B', answer: r2(fB / qB), tol: 0.01, unit: '€' }
        ],
        solution: [
          'Direktni troškovi B: MI = ' + fmt(MI) + ' − ' + fmt(miA) + ' = ' + eur(miB) + '; PI = ' + fmt(PI) + ' − ' + fmt(piA) + ' = ' + eur(piB) + '.',
          'OTI na MI = ' + fmt(OTI) + ' ÷ ' + fmt(MI) + ' × 100 = ' + pct(pO) + '; OTUP na PI = ' + fmt(OTUP) + ' ÷ ' + fmt(PI) + ' × 100 = ' + pct(pU) + '.',
          'A: ' + fmt(miA) + ' + ' + fmt(piA) + ' + ' + fmt(miA * pO / 100) + ' + ' + fmt(piA * pU / 100) + ' = ' + eur(fA) + ' → ÷ ' + qA + ' = ' + eur(fA / qA) + '.',
          'B: ' + fmt(miB) + ' + ' + fmt(piB) + ' + ' + fmt(miB * pO / 100) + ' + ' + fmt(piB * pU / 100) + ' = ' + eur(fB) + ' → ÷ ' + qB + ' = ' + eur(fB / qB) + '.',
          'Kontrola: ' + fmt(fA) + ' + ' + fmt(fB) + ' = ' + eur(fA + fB) + ' = MI + PI + OTI + OTUP.'
        ]
      };
    }
  });

  // =====================================================================
  // Ch11: kapital
  // =====================================================================
  exercises.push({
    id: 'k2-kapital-dionice', lesson: 'second-midterm', chapter: 11, type: 'numeric', difficulty: 1,
    title: 'Emisija dionica iznad nominalne vrijednosti',
    params: SEED,
    generate(p) {
      const r = R(p.s);
      const n = r.int(1, 50, 1) * 100, nv = r.pick([10, 20, 50, 100]), pc = nv + r.int(1, 10, 1) * (nv / 10);
      return {
        prompt: 'Hotelsko d.d. izdalo je ' + fmt(n) + ' dionica nominalne vrijednosti ' + eur(nv) + ' i prodalo ih po ' + eur(pc) + ' po dionici; iznos je uplaćen na žiro račun. ' + UPUTA_BROJ,
        fields: [
          { key: 'u', label: 'Upisani (temeljni) kapital', answer: n * nv, unit: '€' },
          { key: 'p', label: 'Premija na emitirane dionice (kapitalne rezerve)', answer: n * (pc - nv), unit: '€' },
          { key: 't', label: 'Ukupno uplaćeno (primitak iz financijskih aktivnosti)', answer: n * pc, unit: '€' }
        ],
        solution: [
          'Upisani kapital = ' + fmt(n) + ' × ' + fmt(nv) + ' = ' + eur(n * nv) + '.',
          'Premija = ' + fmt(n) + ' × (' + fmt(pc) + ' − ' + fmt(nv) + ') = ' + eur(n * (pc - nv)) + '.',
          'Uplaćeno = ' + eur(n * pc) + ' — primitak iz financijskih aktivnosti; emisija dionica nije prihod.'
        ]
      };
    }
  });

  return { meta: { lang: 'hr', currency: '€', version: 1 }, exercises: exercises };
})();

if (typeof window !== 'undefined') window.accountingHrExercises = accountingHrExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingHrExercises;
