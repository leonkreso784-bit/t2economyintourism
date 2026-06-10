// ===== ACCOUNTING — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski + jezični podaci za interaktivne vježbe.
// Engine (js/exercises*.js, css/exercises.css) ne sadrži ništa odavde. Dodavanje vježbi
// za drugi predmet/jezik = nova ovakva datoteka + catalog unos, NULA izmjena enginea.
// Schema i tipovi: docs/EXERCISES_ENGINE.md §2. Brojevi su čisti Number (vidi §3).
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* immutable).
//
// B0.7: skeleton (prazna lista). Sadržaj se autorira u FAZI 3 (po poglavlju, K1 prvo).

const accountingExercises = {
    meta: { lang: 'en', currency: '$', version: 1 },
    exercises: [
        // Primjer omotnice (vidi docs/EXERCISES_ENGINE.md §2):
        // { id:'k1-classify-ch6-1', lesson:'first-midterm', chapter:6, type:'classify',
        //   title:'…', prompt:'…', difficulty:1, solution:[…], /* payload po tipu */ }

        // --- B1.1 demo: choice (True/False + Multiple Choice) ---
        {
            id: 'k1-choice-intro-1',
            lesson: 'accounting-fundamentals',
            chapter: 1,
            type: 'choice',
            title: 'Accounting Basics — True/False & Multiple Choice',
            prompt: 'Answer each statement.',
            difficulty: 1,
            items: [
                { q: 'A prepaid expense is recorded as an asset until it is used up.', kind: 'tf', answer: true },
                { q: 'In the accounting equation, Assets = Liabilities + Owners’ Equity.', kind: 'tf', answer: true },
                { q: 'Paying a cash dividend increases owners’ equity.', kind: 'tf', answer: false },
                {
                    q: 'Which financial statement reports a company’s financial position at a single point in time?',
                    kind: 'mc',
                    options: ['Income statement', 'Balance sheet', 'Statement of cash flows', 'Statement of retained earnings'],
                    answer: 1
                },
                {
                    q: 'Under double-entry accounting, each transaction affects at least how many accounts?',
                    kind: 'mc',
                    options: ['One', 'Two', 'Three', 'Four'],
                    answer: 1
                }
            ],
            solution: [
                'The accounting equation is Assets = Liabilities + Owners’ Equity.',
                'A prepaid expense is a future benefit, so it is an asset until consumed.',
                'A dividend distributes equity to owners, so it DECREASES owners’ equity.',
                'The balance sheet is a point-in-time snapshot; the other statements cover a period.',
                'Double-entry means every transaction touches at least two accounts (one debit, one credit).'
            ]
        },

        // --- B1.2 demo: numeric (retained earnings & owners’ equity) ---
        {
            id: 'k1-numeric-equity-1',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'numeric',
            title: 'Retained Earnings & Owners’ Equity',
            prompt: 'Sunrise Hotel began the year with $80,000 of retained earnings, earned $35,000 of net income, '
                + 'and paid $12,000 of dividends. Common stock issued is $50,000.',
            difficulty: 1,
            fields: [
                { key: 'endRE', label: 'Ending retained earnings', answer: 103000, tol: 0.005, unit: '$', hint: 'Beginning RE + Net income − Dividends' },
                { key: 'endEquity', label: 'Total owners’ equity', answer: 153000, tol: 0.005, unit: '$', hint: 'Common stock + Ending retained earnings' }
            ],
            solution: [
                'Ending RE = 80,000 + 35,000 − 12,000 = 103,000.',
                'Total owners’ equity = Common stock 50,000 + Ending RE 103,000 = 153,000.'
            ]
        },

        // --- B1.3 demo: ratio (restaurant operating ratios) ---
        {
            id: 'k2-ratio-restaurant-1',
            lesson: 'accounting-fundamentals',
            chapter: 9,
            type: 'ratio',
            title: 'Restaurant Ratios — Average Check & Seat Turnover',
            prompt: 'Using the lunch-service data below, compute the operating ratios.',
            difficulty: 2,
            givens: [
                { label: 'Lunch covers served', value: 34200 },
                { label: 'Seats available', value: 60 },
                { label: 'Days open', value: 300 },
                { label: 'Total lunch food sales', value: 513000 }
            ],
            fields: [
                { key: 'avgCheck', label: 'Average check', answer: 15.00, tol: 0.01, unit: '$', hint: 'Total food sales ÷ covers' },
                { key: 'seatTurnover', label: 'Average daily seat turnover', answer: 1.9, tol: 0.05, hint: 'Covers ÷ (seats × days open)' }
            ],
            solution: [
                'Average check = 513,000 ÷ 34,200 = $15.00.',
                'Seat turnover = 34,200 ÷ (60 × 300) = 34,200 ÷ 18,000 = 1.9 times per day.'
            ]
        },

        // --- B1.4 demo: statement (balance sheet build, common stock = balancing figure) ---
        {
            id: 'k1-statement-bs-1',
            lesson: 'accounting-fundamentals',
            chapter: 4,
            type: 'statement',
            title: 'Build the Balance Sheet',
            prompt: 'Enter each amount and the totals. Common stock issued is the balancing figure '
                + '(Total assets − Total liabilities − Retained earnings).',
            difficulty: 2,
            sections: [
                {
                    key: 'assets', label: 'Assets',
                    lines: [
                        { key: 'cash', label: 'Cash', answer: 120000 },
                        { key: 'ar', label: 'Accounts receivable', answer: 10200 },
                        { key: 'equip', label: 'Equipment', answer: 61000 }
                    ]
                },
                {
                    key: 'liab', label: 'Liabilities',
                    lines: [
                        { key: 'ap', label: 'Accounts payable', answer: 15200 },
                        { key: 'np', label: 'Notes payable', answer: 41000 }
                    ]
                },
                {
                    key: 'equity', label: 'Owners’ Equity',
                    lines: [
                        { key: 're', label: 'Retained earnings', answer: 80000 }
                    ]
                }
            ],
            totals: [
                { key: 'totalAssets', label: 'Total assets', answer: 191200 },
                { key: 'totalLiab', label: 'Total liabilities', answer: 56200 },
                { key: 'commonStock', label: 'Common stock issued (balancing figure)', answer: 55000, derived: true },
                { key: 'totalEquity', label: 'Total owners’ equity', answer: 135000 }
            ],
            solution: [
                'Total assets = 120,000 + 10,200 + 61,000 = 191,200.',
                'Total liabilities = 15,200 + 41,000 = 56,200.',
                'Common stock (balancing) = 191,200 − 56,200 − 80,000 = 55,000.',
                'Total owners’ equity = Retained earnings 80,000 + Common stock 55,000 = 135,000.'
            ]
        },

        // --- B1.5 demo: classify (effect on account classification, Ch6) ---
        {
            id: 'k1-classify-ch6-1',
            lesson: 'accounting-fundamentals',
            chapter: 6,
            type: 'classify',
            title: 'Classify Accounts & Effects',
            prompt: 'For each transaction, choose the account classification and whether each account increases or decreases.',
            difficulty: 2,
            classes: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
            effects: ['Increase', 'Decrease'],
            rows: [
                {
                    text: 'Owners invest $50,000 cash into the business in exchange for common stock.',
                    entries: [
                        { account: 'Cash', cls: 'Asset', effect: 'Increase' },
                        { account: 'Common Stock', cls: 'Equity', effect: 'Increase' }
                    ]
                },
                {
                    text: 'Borrowed $15,000 from the bank, signing a note payable.',
                    entries: [
                        { account: 'Cash', cls: 'Asset', effect: 'Increase' },
                        { account: 'Note Payable', cls: 'Liability', effect: 'Increase' }
                    ]
                },
                {
                    text: 'Paid $4,000 cash to buy kitchen equipment.',
                    entries: [
                        { account: 'Equipment', cls: 'Asset', effect: 'Increase' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' }
                    ]
                }
            ],
            solution: [
                'Investing cash for stock: Cash (Asset) increases; Common Stock (Equity) increases.',
                'Borrowing: Cash (Asset) increases; Note Payable (Liability) increases.',
                'Buying equipment with cash: Equipment (Asset) increases; Cash (Asset) decreases.'
            ]
        },

        // --- B1.7 demo: numeric RANDOMIZED (straight-line depreciation) ---
        {
            id: 'k2-numeric-depreciation-1',
            lesson: 'accounting-fundamentals',
            chapter: 11,
            type: 'numeric',
            title: 'Straight-Line Depreciation (randomized)',
            difficulty: 2,
            // Parametri se biraju deterministički po seedu (pickParams) → "New numbers" = novi seed.
            params: {
                cost: { min: 12000, max: 60000, step: 1000 },
                salvage: { min: 0, max: 6000, step: 500 },
                life: { choices: [3, 4, 5, 8, 10] }
            },
            generate: function (p) {
                var annual = (p.cost - p.salvage) / p.life;
                var money = function (n) { return n.toLocaleString('en-US'); };
                return {
                    prompt: 'An asset costs $' + money(p.cost) + ', has a salvage value of $' + money(p.salvage)
                        + ', and a useful life of ' + p.life + ' years. Compute the annual straight-line depreciation.',
                    fields: [
                        { key: 'dep', label: 'Annual straight-line depreciation', answer: annual, tol: 0.01, unit: '$', hint: '(Cost − Salvage) ÷ Useful life' }
                    ]
                };
            },
            solution: [
                'Straight-line depreciation = (Cost − Salvage value) ÷ Useful life.',
                'Subtract salvage from cost, then divide by the number of years.'
            ]
        }
    ]
};

if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
