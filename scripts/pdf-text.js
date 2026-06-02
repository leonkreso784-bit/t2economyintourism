/* eslint-disable no-console */
// Ekstrakcija teksta iz PDF-a (za čitanje profesorskih materijala).
// Usage: node scripts/pdf-text.js "<putanja.pdf>" [maxPages]
const fs = require('fs');

async function main() {
  const file = process.argv[2];
  const max = process.argv[3] ? Number(process.argv[3]) : 0;
  if (!file) {
    console.error('Usage: node scripts/pdf-text.js "<putanja.pdf>" [maxPages]');
    process.exit(1);
  }
  const { PDFParse } = require('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(file)) });
  const res = await parser.getText(max ? { last: max } : undefined);

  let text = res && res.text ? res.text : '';
  if (!text && res && Array.isArray(res.pages)) {
    text = res.pages.map((p) => p.text || '').join('\n\n----\n\n');
  }
  const pages = (res && (res.total || res.numpages)) || (res && res.pages ? res.pages.length : '?');
  console.log('PAGES: ' + pages);
  console.log('===== TEXT =====');
  console.log(String(text).trim());
  if (parser.destroy) await parser.destroy();
}

main().catch((e) => { console.error('ERR: ' + e.message); process.exit(1); });
