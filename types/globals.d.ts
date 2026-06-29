// Ambient deklaracije globala (FOUNDATION_PLAN F1, brick 1B — type-safety bez build-a).
// Projekt je vanilla/no-build: skripte komuniciraju preko `window.*` i nekoliko bare globala.
// Ovo NIJE runtime kod — samo tipovi za `tsc --checkJs`. Browser i dalje vrti čisti JS.
//
// Širi se modul-po-modul: kad novi modul uđe u tsconfig `include`, ovdje dodaj globale koje dira.

export {}; // drži ovo modulom radi `declare global` (augmentacija Window)

declare global {
  // Catalog (data/catalog.js) — jedinstveni izvor istine za predmete.
  const SokratCatalog:
    | {
        getSubject(id: string): { programId?: string; [k: string]: unknown } | undefined;
        [k: string]: unknown;
      }
    | undefined;

  interface Window {
    // Autogeneriran landing stat (data/landing-stats.js → npm run stats)
    SOKRAT_STATS?: { questionCount: number; questionCountExact: number; subjectsCounted: number };

    // i18n (js/i18n.js)
    t?: (key: string) => string;
    applyTranslations?: (root?: Document | Element) => void;
    setUiLang?: (lang: string, persist?: boolean) => boolean;
    toggleUiLang?: () => void;
    suggestLangForSubject?: (subjectId?: string) => void;
    setUiLangForSubject?: (subjectId?: string) => void;
    getUiLang?: () => string;

    // Renderi/oslonci koje i18n poziva nakon promjene jezika (definirani u drugim modulima)
    refreshAuthNav?: () => void;
    renderSubjectsSidebar?: () => void;
    renderLandingSubjects?: () => void;
    renderBrowse?: () => void;
    renderProfilePage?: () => void;
  }
}
