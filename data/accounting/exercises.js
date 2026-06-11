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
        },

        // --- B2.2 demo: journal (guided, ALE only — assets/liabilities/equity) ---
        {
            id: 'k1-journal-ale-1',
            lesson: 'accounting-fundamentals',
            chapter: 6,
            type: 'journal',
            title: 'Record Transactions (Assets, Liabilities, Equity)',
            prompt: 'Record each transaction with the correct debit and credit. Each transaction has two lines.',
            difficulty: 3,
            chartOfAccounts: [
                { name: 'Cash', normal: 'D', section: 'asset' },
                { name: 'Equipment', normal: 'D', section: 'asset' },
                { name: 'Accounts Payable', normal: 'C', section: 'liability' },
                { name: 'Note Payable', normal: 'C', section: 'liability' },
                { name: 'Common Stock', normal: 'C', section: 'equity' }
            ],
            beginningBalances: {},
            transactions: [
                {
                    text: 'Owners invest $50,000 cash in exchange for common stock.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 50000 },
                        { account: 'Common Stock', side: 'C', amount: 50000 }
                    ]
                },
                {
                    text: 'Purchase equipment for $12,000 on account (no cash paid yet).',
                    entries: [
                        { account: 'Equipment', side: 'D', amount: 12000 },
                        { account: 'Accounts Payable', side: 'C', amount: 12000 }
                    ]
                },
                {
                    text: 'Borrow $15,000 cash from the bank, signing a note payable.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 15000 },
                        { account: 'Note Payable', side: 'C', amount: 15000 }
                    ]
                }
            ],
            expectedEndingBalances: { Cash: 65000, Equipment: 12000, 'Accounts Payable': 12000, 'Note Payable': 15000, 'Common Stock': 50000 },
            solution: [
                'Investing cash for stock: debit Cash 50,000; credit Common Stock 50,000.',
                'Equipment on account: debit Equipment 12,000; credit Accounts Payable 12,000.',
                'Borrowing cash: debit Cash 15,000; credit Note Payable 15,000.',
                'Every entry keeps total debits equal to total credits.'
            ]
        },

        // --- B2.3 demo: journal FREE mode (build the whole ledger; graded by ending balances) ---
        {
            id: 'k1-journal-free-1',
            lesson: 'accounting-fundamentals',
            chapter: 6,
            type: 'journal',
            free: true,
            title: 'Build the Ledger (free entry)',
            prompt: 'Record every transaction as debits and credits using the lines below (add more as needed). '
                + 'Transactions: (1) Owners invest $40,000 cash for common stock. (2) Buy equipment for $9,000 cash. '
                + '(3) Borrow $6,000 cash on a note payable. Your ending balances must match.',
            difficulty: 3,
            chartOfAccounts: [
                { name: 'Cash', normal: 'D', section: 'asset' },
                { name: 'Equipment', normal: 'D', section: 'asset' },
                { name: 'Note Payable', normal: 'C', section: 'liability' },
                { name: 'Common Stock', normal: 'C', section: 'equity' }
            ],
            beginningBalances: {},
            expectedEndingBalances: { Cash: 37000, Equipment: 9000, 'Note Payable': 6000, 'Common Stock': 40000 },
            solution: [
                'Invest: debit Cash 40,000; credit Common Stock 40,000.',
                'Equipment: debit Equipment 9,000; credit Cash 9,000.',
                'Borrow: debit Cash 6,000; credit Note Payable 6,000.',
                'Ending Cash = 40,000 − 9,000 + 6,000 = 37,000; Equipment 9,000; Note Payable 6,000; Common Stock 40,000.'
            ]
        },

        // ========================= CHAPTER 4 — BALANCE SHEET (K1) =========================
        // Source: Cote, Hotel & Restaurant Accounting, Ch. 4 workbook (Assignment 4-1).

        // --- B3.1: Ch4 True/False (Assignment 4-1, Part I) ---
        {
            id: 'k1-ch4-tf',
            lesson: 'accounting-fundamentals',
            chapter: 4,
            type: 'choice',
            title: 'Balance Sheet — True or False',
            prompt: 'Mark each statement true or false.',
            difficulty: 1,
            items: [
                { q: 'A prepaid expense is an asset.', kind: 'tf', answer: true },
                { q: 'VISA and MasterCard credit card vouchers are generally treated as cash.', kind: 'tf', answer: true },
                { q: 'In hospitality, china, glassware, and silverware are classified as Property and Equipment.', kind: 'tf', answer: true },
                { q: 'Accrued expenses payable represent a liability for expenses incurred but not yet paid or recorded to another payables account.', kind: 'tf', answer: true },
                { q: 'The net income of a proprietorship increases owner’s Capital.', kind: 'tf', answer: true },
                { q: 'The net income of a corporation increases Retained Earnings.', kind: 'tf', answer: true },
                { q: 'The declaration of dividends reduces Retained Earnings and creates a liability called Dividends Payable.', kind: 'tf', answer: true },
                { q: 'Prepaid expenses are unexpired costs that will benefit the business in the short term.', kind: 'tf', answer: true },
                { q: 'Property and Equipment are sometimes called Fixed Assets.', kind: 'tf', answer: true },
                { q: 'Amortization allocates the expired cost of intangible assets to expense.', kind: 'tf', answer: true },
                { q: 'Accounts called “Other Assets” are considered to be current assets.', kind: 'tf', answer: false },
                { q: 'A worldwide-recognized trade name should be shown on the balance sheet at an analyst’s estimate (≥ $500,000) regardless of the company’s lower initial cost.', kind: 'tf', answer: false },
                { q: 'Only purchased goodwill may appear on the financial statements.', kind: 'tf', answer: true },
                { q: 'A $50,000, 20-year mortgage requiring monthly payments is reported entirely as $50,000 of long-term debt.', kind: 'tf', answer: false },
                { q: 'The equity accounts for a proprietorship and a corporation are identical.', kind: 'tf', answer: false }
            ],
            solution: [
                'Prepaid expenses and bank credit-card vouchers are assets/cash.',
                '“Other Assets” are noncurrent, not current.',
                'Internally generated goodwill/trade names are not written up — only purchased goodwill is recorded.',
                'The portion of a mortgage due within one year is a current liability; the rest is long-term.',
                'Proprietorship equity = Capital; corporation equity = paid-in capital + retained earnings.'
            ]
        },

        // --- B3.1: Ch4 terminology matching as multiple-choice (Assignment 4-1, Part II) ---
        {
            id: 'k1-ch4-terms',
            lesson: 'accounting-fundamentals',
            chapter: 4,
            type: 'choice',
            title: 'Balance Sheet — Key Terms',
            prompt: 'Choose the term that best fits each description.',
            difficulty: 1,
            items: [
                { q: 'Debts of the business.', kind: 'mc', options: ['Assets', 'Liabilities', 'Equity', 'Retained Earnings'], answer: 1 },
                { q: 'The account used when the owner invests in a proprietorship.', kind: 'mc', options: ['Common Stock', 'Owner’s Capital', 'Retained Earnings', 'Treasury Stock'], answer: 1 },
                { q: 'Resources owned by the business that are expected to provide future benefits.', kind: 'mc', options: ['Assets', 'Liabilities', 'Expenses', 'Equity'], answer: 0 },
                { q: 'The account used when shareholders purchase a new stock issue from the corporation.', kind: 'mc', options: ['Treasury Stock', 'Authorized Stock', 'Stock Issued', 'Retained Earnings'], answer: 2 },
                { q: 'The net result of net income and dividends declared since inception of the business.', kind: 'mc', options: ['Owner’s Capital', 'Retained Earnings', 'Additional Paid-in Capital', 'Common Stock'], answer: 1 },
                { q: 'Claims of owners.', kind: 'mc', options: ['Liabilities', 'Assets', 'Equity', 'Goodwill'], answer: 2 },
                { q: 'A corporation’s repurchase of its previously issued stock.', kind: 'mc', options: ['Authorized Stock', 'Treasury Stock', 'Stock Issued', 'Common Stock'], answer: 1 },
                { q: 'An asset without physical substance that provides certain rights and privileges.', kind: 'mc', options: ['Tangible', 'Intangible', 'Investment', 'Amortization'], answer: 1 }
            ],
            solution: [
                'Liabilities = debts; Equity = owners’ claims; Assets = resources with future benefit.',
                'Owner’s Capital (proprietorship) vs Stock Issued / Treasury Stock (corporation).',
                'Retained Earnings = cumulative net income − dividends; intangible = no physical substance.'
            ]
        },

        // --- B3.1: Ch4 classify accounts into balance-sheet categories (Assignment 4-1, Part III) ---
        {
            id: 'k1-ch4-classify',
            lesson: 'accounting-fundamentals',
            chapter: 4,
            type: 'classify',
            title: 'Classify Accounts on the Balance Sheet',
            prompt: 'Classify each account into its balance sheet category.',
            difficulty: 2,
            classes: [
                { v: 'CA', label: 'Current Asset' },
                { v: 'I', label: 'Investment' },
                { v: 'PE', label: 'Property & Equipment' },
                { v: 'OA', label: 'Other Asset' },
                { v: 'CL', label: 'Current Liability' },
                { v: 'LTL', label: 'Long-term Liability' },
                { v: 'EQ', label: 'Equity' }
            ],
            // no `effects` → single-axis classification (account → category only)
            rows: [
                { entries: [{ account: 'Prepaid Rent', cls: 'CA' }] },
                { entries: [{ account: 'Trademarks', cls: 'OA' }] },
                { entries: [{ account: 'Accounts Payable', cls: 'CL' }] },
                { entries: [{ account: 'Furniture', cls: 'PE' }] },
                { entries: [{ account: 'Owner’s Capital', cls: 'EQ' }] },
                { entries: [{ account: 'Food Inventory', cls: 'CA' }] },
                { entries: [{ account: 'Cash', cls: 'CA' }] },
                { entries: [{ account: 'Security Deposits', cls: 'OA' }] },
                { entries: [{ account: 'Accrued Payroll', cls: 'CL' }] },
                { entries: [{ account: 'Sales Tax Payable', cls: 'CL' }] },
                { entries: [{ account: 'Short-Term Investment', cls: 'CA' }] },
                { entries: [{ account: 'Land', cls: 'PE' }] },
                { entries: [{ account: 'Accounts Receivable', cls: 'CA' }] },
                { entries: [{ account: 'Income Taxes Payable', cls: 'CL' }] },
                { entries: [{ account: 'Common Stock Issued', cls: 'EQ' }] },
                { entries: [{ account: 'China, Glassware, Silver', cls: 'PE' }] },
                { entries: [{ account: 'Preopening Costs', cls: 'OA' }] },
                { entries: [{ account: 'Retained Earnings', cls: 'EQ' }] },
                { entries: [{ account: 'Dividends Payable', cls: 'CL' }] },
                { entries: [{ account: 'Goodwill', cls: 'OA' }] }
            ],
            solution: [
                'Current Assets: cash, receivables, inventories, short-term investments, prepaids.',
                'Property & Equipment: land, furniture, china/glass/silver (capitalized operating equipment).',
                'Other Assets (noncurrent): trademarks, security deposits, preopening costs, goodwill.',
                'Current Liabilities: payables, accrued payroll, taxes payable, dividends payable.',
                'Equity: common stock issued, owner’s capital, retained earnings.'
            ]
        }
    ]
};

if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
