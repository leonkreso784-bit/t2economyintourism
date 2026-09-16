// ===== Playwright globalSetup: poslužitelj na baseURL-u mora posluživati OVO stablo =====
//
// ZAŠTO: `reuseExistingServer: true` preuzme bilo što što odgovara na portu. S više radnih
// stabala na istom računalu to je bio poslužitelj DRUGOG stabla, pa su specovi cijelu sesiju
// mjerili tuđe datoteke i prolazili (2026-09-16). `scripts/static-server.js` zato šalje
// `X-Sokrat-Root`, a ovdje se to uspoređuje s ovim stablom prije ijednog testa.
// Nitko ne sluša → u redu (Playwright pokreće svoj). Čuva `tests/unit/test-server-root.test.js`.
const path = require('path');

const OVO_STABLO = path.resolve(__dirname, '..');
const isti = (a, b) => (process.platform === 'win32'
    ? path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase()
    : path.resolve(a) === path.resolve(b));

module.exports = async function globalSetup(config) {
    const projekt = (config.projects || []).find((p) => p.use && p.use.baseURL);
    if (!projekt) return;
    const baza = projekt.use.baseURL;
    let odgovor;
    try {
        odgovor = await fetch(baza + '/', { method: 'HEAD' });
    } catch (e) {
        return; // nitko ne sluša — webServer će pokrenuti poslužitelj ovog stabla
    }
    const zaglavlje = odgovor.headers.get('x-sokrat-root');
    const stablo = zaglavlje ? decodeURIComponent(zaglavlje) : null;
    if (stablo && isti(stablo, OVO_STABLO)) return;
    throw new Error(
        'Na ' + baza + ' odgovara poslužitelj koji NE poslužuje ovo stablo.\n'
        + '  ovo stablo:  ' + OVO_STABLO + '\n'
        + '  poslužuje:   ' + (stablo || '(nepoznato — stari static-server bez X-Sokrat-Root)') + '\n'
        + 'Testovi bi mjerili tuđe datoteke. Ugasi taj poslužitelj ili pokreni na drugom portu:\n'
        + '  SOKRAT_TEST_PORT=5051 npx playwright test …'
    );
};
