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

        // --- Ch4 Balance Sheet — build (statement); common stock = balancing figure ---
        {
            id: 'k1-statement-bs-1',
            lesson: 'accounting-fundamentals',
            chapter: 4,
            type: 'statement',
            title: 'Build the Balance Sheet',
            prompt: 'Using the account balances below, build the balance sheet: place each amount in the correct section and '
                + 'compute the totals. Common stock issued is the balancing figure (Total assets − Total liabilities − Retained earnings).',
            difficulty: 2,
            givens: [
                { label: 'Cash', value: 120000 },
                { label: 'Accounts receivable', value: 10200 },
                { label: 'Equipment', value: 61000 },
                { label: 'Accounts payable', value: 15200 },
                { label: 'Notes payable', value: 41000 },
                { label: 'Retained earnings', value: 80000 }
            ],
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
        },

        // ========================= CHAPTER 5 — INCOME STATEMENT (K1) =========================
        // Source: Cote, Hotel & Restaurant Accounting, Ch. 5 workbook (Assignments 5-1, 5-2).

        // --- B3.2: Ch5 True/False (Assignment 5-1, Part I) ---
        {
            id: 'k1-ch5-tf',
            lesson: 'accounting-fundamentals',
            chapter: 5,
            type: 'choice',
            title: 'Income Statement — True or False',
            prompt: 'Mark each statement true or false.',
            difficulty: 2,
            items: [
                { q: 'The food department has cost of sales.', kind: 'tf', answer: true },
                { q: 'Storeroom purchases in a perpetual system are recorded to the Cost of Sales account.', kind: 'tf', answer: false },
                { q: 'Accumulated Depreciation is a contra-asset account.', kind: 'tf', answer: true },
                { q: 'The rooms department has cost of sales.', kind: 'tf', answer: false },
                { q: 'Direct purchases in a periodic system are recorded to a Cost of Sales account.', kind: 'tf', answer: false },
                { q: 'Expenses represent costs incurred in operating the business and the expired portions of assets.', kind: 'tf', answer: true },
                { q: 'Storeroom issues are recorded at cost to the Cost of Sales account in the periodic system.', kind: 'tf', answer: false },
                { q: 'The periodic system provides better inventory control than the perpetual system.', kind: 'tf', answer: false },
                { q: 'Deliveries that go directly to the storeroom are called Direct Purchases.', kind: 'tf', answer: false },
                { q: 'Operating expenses include all expenses incurred in the day-to-day activities of the business.', kind: 'tf', answer: true }
            ],
            solution: [
                'Rooms have no cost of sales; food and beverage departments do.',
                'Perpetual: storeroom purchases go to Inventory (not COS); issues hit COS.',
                'Periodic: purchases go to a Purchases account; COS is computed at period end.',
                'Perpetual gives better inventory control. “Direct purchases” go straight to production, not the storeroom.'
            ]
        },

        // --- B3.2: Ch5 classify accounts as A/L/EQ/R/EX (Assignment 5-1, Part II) ---
        {
            id: 'k1-ch5-classify',
            lesson: 'accounting-fundamentals',
            chapter: 5,
            type: 'classify',
            title: 'Classify Accounts — Asset / Liability / Equity / Revenue / Expense',
            prompt: 'Classify each account into one of the five account types.',
            difficulty: 2,
            classes: [
                { v: 'A', label: 'Asset' },
                { v: 'L', label: 'Liability' },
                { v: 'EQ', label: 'Equity' },
                { v: 'R', label: 'Revenue' },
                { v: 'EX', label: 'Expense' }
            ],
            // no `effects` → single-axis classification
            rows: [
                { entries: [{ account: 'Accumulated Depreciation', cls: 'A' }] },
                { entries: [{ account: 'Payroll', cls: 'EX' }] },
                { entries: [{ account: 'Rent', cls: 'EX' }] },
                { entries: [{ account: 'Beverage Sales', cls: 'R' }] },
                { entries: [{ account: 'Accounts Payable', cls: 'L' }] },
                { entries: [{ account: 'Depreciation', cls: 'EX' }] },
                { entries: [{ account: 'Cash', cls: 'A' }] },
                { entries: [{ account: 'Sales Tax Payable', cls: 'L' }] },
                { entries: [{ account: 'Accounts Receivable', cls: 'A' }] },
                { entries: [{ account: 'Accrued Payroll', cls: 'L' }] },
                { entries: [{ account: 'Cost of Sales', cls: 'EX' }] },
                { entries: [{ account: 'Purchases (Periodic System)', cls: 'EX' }] },
                { entries: [{ account: 'Prepaid Rent', cls: 'A' }] },
                { entries: [{ account: 'Building', cls: 'A' }] },
                { entries: [{ account: 'Owner’s Capital', cls: 'EQ' }] },
                { entries: [{ account: 'Food Inventory', cls: 'A' }] },
                { entries: [{ account: 'Food Sales', cls: 'R' }] },
                { entries: [{ account: 'Income Taxes', cls: 'EX' }] },
                { entries: [{ account: 'Income Taxes Payable', cls: 'L' }] },
                { entries: [{ account: 'Retained Earnings', cls: 'EQ' }] },
                { entries: [{ account: 'Employee Benefits', cls: 'EX' }] },
                { entries: [{ account: 'Vehicles', cls: 'A' }] },
                { entries: [{ account: 'Common Stock Issued', cls: 'EQ' }] },
                { entries: [{ account: 'Repairs & Maintenance', cls: 'EX' }] },
                { entries: [{ account: 'Equipment', cls: 'A' }] },
                { entries: [{ account: 'Utilities', cls: 'EX' }] },
                { entries: [{ account: 'Supplies', cls: 'EX' }] },
                { entries: [{ account: 'Supplies Inventory', cls: 'A' }] },
                { entries: [{ account: 'Furniture', cls: 'A' }] },
                { entries: [{ account: 'Withdrawals', cls: 'EQ' }] }
            ],
            solution: [
                'Revenue: sales accounts (Food Sales, Beverage Sales).',
                'Expense: payroll, rent, depreciation, cost of sales, purchases, utilities, supplies, taxes, etc.',
                'Asset: cash, receivables, inventories, prepaids, P&E, accumulated depreciation (contra-asset).',
                'Liability: payables, accrued payroll, taxes payable. Equity: capital, retained earnings, stock issued, withdrawals (contra-equity).'
            ]
        },

        // --- B3.2: Ch5 food cost of sales computation (Assignment 5-2, Part II) ---
        {
            id: 'k1-ch5-foodcost',
            lesson: 'accounting-fundamentals',
            chapter: 5,
            type: 'ratio',
            title: 'Food Cost of Sales',
            prompt: 'Using the August figures below, compute the food available for use and the cost of food used.',
            difficulty: 2,
            givens: [
                { label: 'Beginning food inventory (8/1)', value: 7595 },
                { label: 'Direct purchases', value: 450 },
                { label: 'Storeroom purchases', value: 27400 },
                { label: 'Ending food inventory (8/31)', value: 10060 }
            ],
            fields: [
                { key: 'available', label: 'Food available for use', answer: 35445, tol: 0.005, unit: '$', hint: 'Beginning inventory + Direct + Storeroom purchases' },
                { key: 'costUsed', label: 'Cost of food used', answer: 25385, tol: 0.005, unit: '$', hint: 'Food available for use − Ending inventory' }
            ],
            solution: [
                'Food available for use = 7,595 + 450 + 27,400 = 35,445.',
                'Cost of food used = 35,445 − 10,060 = 25,385.'
            ]
        },

        // ========================= CHAPTER 6 — BOOKKEEPING PROCESS (K1) =========================
        // Sources: Cote, Hotel & Restaurant Accounting, Ch. 6 workbook (Assignment 6-2,
        // Increase/Decrease Effect) + professor worked example "Bookkeeping process"
        // (assets/liabilities/equity T-accounts; entries verified against the posted ledger).

        // --- B3.3: Ch6 classify accounts WITH increase/decrease effect (Assignment 6-2) ---
        {
            id: 'k1-ch6-classify',
            lesson: 'accounting-fundamentals',
            chapter: 6,
            type: 'classify',
            title: 'Transactions — Classify Accounts & Effects',
            prompt: 'For each transaction, name the accounts involved, classify each one, and identify whether it increases or decreases. '
                + 'Each business transaction is independent.',
            difficulty: 3,
            classes: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
            effects: ['Increase', 'Decrease'],
            rows: [
                {
                    text: 'On October 2, issued check #101 for $1,500 paying the October rent.',
                    entries: [
                        { account: 'Rent', cls: 'Expense', effect: 'Increase' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' }
                    ]
                },
                {
                    text: 'On June 1, land ($50,000) and a building ($130,000) are purchased with a $45,000 down-payment (check #132) and a $135,000 bank loan.',
                    entries: [
                        { account: 'Land', cls: 'Asset', effect: 'Increase' },
                        { account: 'Building', cls: 'Asset', effect: 'Increase' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' },
                        { account: 'Mortgage Payable', cls: 'Liability', effect: 'Increase' }
                    ]
                },
                {
                    text: 'The perpetual inventory system is used. On March 18, a $750 storeroom food purchase is made on open account.',
                    entries: [
                        { account: 'Food Inventory', cls: 'Asset', effect: 'Increase' },
                        { account: 'Accounts Payable', cls: 'Liability', effect: 'Increase' }
                    ]
                },
                {
                    text: 'The perpetual inventory system is used. A June 30 summary report shows $6,000 of food provisions issued from the storeroom to the kitchen.',
                    entries: [
                        { account: 'Cost of Sales', cls: 'Expense', effect: 'Increase' },
                        { account: 'Food Inventory', cls: 'Asset', effect: 'Decrease' }
                    ]
                },
                {
                    text: 'A July 8 guest tab shows food $60 and sales tax $3.60; the guest pays the tab with cash.',
                    entries: [
                        { account: 'Cash', cls: 'Asset', effect: 'Increase' },
                        { account: 'Food Sales', cls: 'Revenue', effect: 'Increase' },
                        { account: 'Sales Tax Payable', cls: 'Liability', effect: 'Increase' }
                    ]
                },
                {
                    text: 'A July 8 guest tab shows food $60 and sales tax $3.60; the guest pays with an in-house credit card.',
                    entries: [
                        { account: 'Accounts Receivable', cls: 'Asset', effect: 'Increase' },
                        { account: 'Food Sales', cls: 'Revenue', effect: 'Increase' },
                        { account: 'Sales Tax Payable', cls: 'Liability', effect: 'Increase' }
                    ]
                },
                {
                    text: 'On October 11, check #934 pays the currently due monthly mortgage: principal $534 and interest $266.',
                    entries: [
                        { account: 'Mortgage Payable', cls: 'Liability', effect: 'Decrease' },
                        { account: 'Interest', cls: 'Expense', effect: 'Increase' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' }
                    ]
                },
                {
                    text: 'On February 21, the owner of a proprietorship invests $4,000 cash and land with a basis of $15,000 into the business.',
                    entries: [
                        { account: 'Cash', cls: 'Asset', effect: 'Increase' },
                        { account: 'Land', cls: 'Asset', effect: 'Increase' },
                        { account: 'Owner’s Capital', cls: 'Equity', effect: 'Increase' }
                    ]
                },
                {
                    text: 'On April 3, check #877 for $2,000 is issued to the owner of a proprietorship for personal use.',
                    entries: [
                        { account: 'Withdrawals', cls: 'Equity', effect: 'Decrease' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' }
                    ]
                },
                {
                    text: 'On November 30 the Sales Tax Payable balance is $3,682. On December 14, check #412 is issued to the state sales tax department.',
                    entries: [
                        { account: 'Sales Tax Payable', cls: 'Liability', effect: 'Decrease' },
                        { account: 'Cash', cls: 'Asset', effect: 'Decrease' }
                    ]
                }
            ],
            solution: [
                'Paying the current month’s rent: Rent (Expense) increases; Cash (Asset) decreases.',
                'Asset bought with cash + loan: the assets increase, Cash decreases, and the loan (Liability) increases.',
                'Perpetual purchase on account: Food Inventory (Asset) ↑, Accounts Payable (Liability) ↑.',
                'Perpetual issue to kitchen: Cost of Sales (Expense) ↑, Food Inventory (Asset) ↓.',
                'Cash sale: Cash ↑, Food Sales (Revenue) ↑, Sales Tax Payable (Liability) ↑. In-house credit instead of cash → Accounts Receivable ↑.',
                'Mortgage payment splits into principal (reduces the Liability) and interest (an Expense); Cash ↓.',
                'Owner investment increases assets and Owner’s Capital (Equity). A withdrawal decreases Equity and Cash.',
                'Remitting collected sales tax: Sales Tax Payable (Liability) ↓, Cash ↓.'
            ]
        },

        // --- B3.3: Ch6 guided journal — bookkeeping process, ALE only (professor worked example) ---
        {
            id: 'k1-ch6-journal',
            lesson: 'accounting-fundamentals',
            chapter: 6,
            type: 'journal',
            title: 'Record Transactions in the Ledger (Assets, Liabilities, Equity)',
            prompt: 'Continue the hotel’s ledger. Record each transaction with the correct debit and credit. '
                + 'The perpetual inventory system is used.',
            difficulty: 3,
            chartOfAccounts: [
                { name: 'Cash', normal: 'D', section: 'asset' },
                { name: 'Accounts Receivable', normal: 'D', section: 'asset' },
                { name: 'Food Inventory', normal: 'D', section: 'asset' },
                { name: 'Prepaid Rent', normal: 'D', section: 'asset' },
                { name: 'Accounts Payable', normal: 'C', section: 'liability' },
                { name: 'Common Stock Issued', normal: 'C', section: 'equity' },
                { name: 'Additional Paid-In Capital', normal: 'C', section: 'equity' }
            ],
            beginningBalances: {
                Cash: 120000,
                'Accounts Receivable': 10200,
                'Food Inventory': 8000,
                'Accounts Payable': 4200,
                'Common Stock Issued': 158500
            },
            transactions: [
                {
                    text: 'The hotel buys food inventory worth $3,000 for its storeroom on a previously arranged open account (perpetual system).',
                    entries: [
                        { account: 'Food Inventory', side: 'D', amount: 3000 },
                        { account: 'Accounts Payable', side: 'C', amount: 3000 }
                    ]
                },
                {
                    text: 'The hotel pays the supplier $3,000 cash for inventory purchases previously made on open account.',
                    entries: [
                        { account: 'Accounts Payable', side: 'D', amount: 3000 },
                        { account: 'Cash', side: 'C', amount: 3000 }
                    ]
                },
                {
                    text: 'In February the hotel pays $4,000 cash for the March and April rent (monthly rent is $2,000).',
                    entries: [
                        { account: 'Prepaid Rent', side: 'D', amount: 4000 },
                        { account: 'Cash', side: 'C', amount: 4000 }
                    ]
                },
                {
                    text: 'A customer pays the $10,200 beginning-balance receivable with cash.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 10200 },
                        { account: 'Accounts Receivable', side: 'C', amount: 10200 }
                    ]
                },
                {
                    text: 'The hotel buys food inventory worth $5,000 for its storeroom and pays cash on delivery (perpetual system).',
                    entries: [
                        { account: 'Food Inventory', side: 'D', amount: 5000 },
                        { account: 'Cash', side: 'C', amount: 5000 }
                    ]
                },
                {
                    text: 'The stockholders additionally issue 1,000 common shares (par value $20) sold at $30 per share.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 30000 },
                        { account: 'Common Stock Issued', side: 'C', amount: 20000 },
                        { account: 'Additional Paid-In Capital', side: 'C', amount: 10000 }
                    ]
                }
            ],
            expectedEndingBalances: {
                Cash: 148200,
                'Accounts Receivable': 0,
                'Food Inventory': 16000,
                'Prepaid Rent': 4000,
                'Accounts Payable': 4200,
                'Common Stock Issued': 178500,
                'Additional Paid-In Capital': 10000
            },
            solution: [
                'Buy inventory on account: debit Food Inventory 3,000; credit Accounts Payable 3,000.',
                'Pay the supplier: debit Accounts Payable 3,000; credit Cash 3,000.',
                'Prepay two months’ rent: debit Prepaid Rent 4,000; credit Cash 4,000.',
                'Collect a receivable: debit Cash 10,200; credit Accounts Receivable 10,200.',
                'Buy inventory for cash: debit Food Inventory 5,000; credit Cash 5,000.',
                'Issue stock above par: debit Cash 30,000; credit Common Stock Issued 20,000 and Additional Paid-In Capital 10,000.'
            ]
        },

        // ===================== CHAPTER 3 — SURVEY OF FINANCIAL STATEMENTS (K1) =====================
        // Source: Cote, Hotel & Restaurant Accounting, Ch. 3 workbook (Assignments 3-1, 3-2, 3-3).
        // Answers verified against the official solution pages (solutions-chapters-2-5, pp. 2–4).

        // --- B3.4: Ch3 True/False (Assignment 3-1, Part I) ---
        {
            id: 'k1-ch3-tf',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'choice',
            title: 'Financial Statements — True or False',
            prompt: 'Mark each statement true or false.',
            difficulty: 2,
            items: [
                { q: 'Revenue and expenses appear on the income statement to present the results of operations.', kind: 'tf', answer: true },
                { q: 'A business year is also called a fiscal year.', kind: 'tf', answer: true },
                { q: 'The statement of retained earnings is prepared for both a corporation and a proprietorship.', kind: 'tf', answer: false },
                { q: 'The balance sheet and the income statement apply to both a corporation and a proprietorship.', kind: 'tf', answer: true },
                { q: 'Federal income taxes appear on the income statement of a proprietorship.', kind: 'tf', answer: false },
                { q: 'The balance sheet reports financial information as of a specified date, not for a period of time.', kind: 'tf', answer: true },
                { q: 'The income statement reports financial information as of a specified date, not for a period of time.', kind: 'tf', answer: false },
                { q: 'For a corporation, the statement of retained earnings is the connecting link between the income statement and the balance sheet.', kind: 'tf', answer: true },
                { q: 'For a proprietorship, the statement of owner’s equity is the connecting link between the income statement and the balance sheet.', kind: 'tf', answer: true },
                { q: 'Dividends Payable is an equity account.', kind: 'tf', answer: false },
                { q: 'If a $45,000 van is bought with a $5,000 down payment and a note payable for the balance, $45,000 appears in the investing activities section of the statement of cash flows.', kind: 'tf', answer: false },
                { q: 'The proper date heading on the income statement uses the form “For the (period) Ended (date),” e.g., “For the Year Ended May 31, 20XX.”', kind: 'tf', answer: true },
                { q: 'The proper date heading on the balance sheet uses the form “For the (period) Ended (date),” e.g., “For the Year Ended May 31, 20XX.”', kind: 'tf', answer: false },
                { q: 'The full heading on a financial statement is: name of company, then name of the statement, then the time period of the information.', kind: 'tf', answer: true }
            ],
            solution: [
                'Income statement = results of operations over a PERIOD; balance sheet = financial position AT a date.',
                'Statement of retained earnings is for corporations; a proprietorship uses a statement of owner’s equity.',
                'A proprietorship pays no entity-level income tax (the owner is taxed personally); Dividends Payable is a liability.',
                'Investing activities show the CASH flow ($5,000 down payment), not the $45,000 total cost.',
                'Date heading: income statement = “For the … Ended …”; balance sheet = a single date.'
            ]
        },

        // --- B3.4: Ch3 terminology matching as multiple-choice (Assignment 3-1, Part II) ---
        {
            id: 'k1-ch3-terms',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'choice',
            title: 'Financial Statements — Key Terms',
            prompt: 'Choose the term that best fits each description.',
            difficulty: 1,
            items: [
                { q: 'A statement showing where cash came from and how it was spent.', kind: 'mc', options: ['Balance Sheet', 'Income Statement', 'Statement of Cash Flows', 'Statement of Retained Earnings'], answer: 2 },
                { q: 'A term used to represent a business year.', kind: 'mc', options: ['Calendar', 'Fiscal', 'Current', 'Periodic'], answer: 1 },
                { q: 'A statement presenting the results of operations.', kind: 'mc', options: ['Balance Sheet', 'Income Statement', 'Statement of Cash Flows', 'Cash Budget'], answer: 1 },
                { q: 'A statement presenting the financial condition of a business.', kind: 'mc', options: ['Income Statement', 'Balance Sheet', 'Statement of Cash Flows', 'Statement of Retained Earnings'], answer: 1 },
                { q: 'Convertible to cash, or requiring an outlay of cash, within 12 months of the balance-sheet date.', kind: 'mc', options: ['Noncurrent Item', 'Current Item', 'Prepaid Insurance', 'Retained Earnings'], answer: 1 },
                { q: 'Revenue less cost of sales.', kind: 'mc', options: ['Net Income', 'Gross Profit', 'Total Revenue', 'Operating Income'], answer: 1 },
                { q: 'An example of a noncurrent asset.', kind: 'mc', options: ['Cash', 'Accounts Receivable', 'Land', 'Inventory'], answer: 2 },
                { q: 'Shows the expense of food or liquor inventory used in the sales process.', kind: 'mc', options: ['Gross Profit', 'Cost of Sales', 'Food Used', 'Supplies'], answer: 1 },
                { q: 'Depreciation is an example of a(n):', kind: 'mc', options: ['Asset', 'Liability', 'Expense', 'Revenue'], answer: 2 },
                { q: 'Common Stock Issued is part of:', kind: 'mc', options: ['Assets', 'Liabilities', 'Equity', 'Revenue'], answer: 2 }
            ],
            solution: [
                'Statement of Cash Flows = sources/uses of cash; Income Statement = results of operations; Balance Sheet = financial condition.',
                'Fiscal = a business year. A Current Item is convertible to/from cash within 12 months.',
                'Gross Profit = Revenue − Cost of Sales. Land is a noncurrent asset; Depreciation is an expense; Common Stock Issued is equity.'
            ]
        },

        // --- B3.4: Ch3 classify items as Income Statement vs Balance Sheet (Assignment 3-2, #2) ---
        {
            id: 'k1-ch3-isbs',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'classify',
            title: 'Income Statement or Balance Sheet?',
            prompt: 'Decide whether each item appears on the Income Statement or the Balance Sheet.',
            difficulty: 1,
            classes: [
                { v: 'IS', label: 'Income Statement' },
                { v: 'BS', label: 'Balance Sheet' }
            ],
            // no `effects` → single-axis classification
            rows: [
                { entries: [{ account: 'Expenses', cls: 'IS' }] },
                { entries: [{ account: 'Liabilities', cls: 'BS' }] },
                { entries: [{ account: 'Assets', cls: 'BS' }] },
                { entries: [{ account: 'Equity', cls: 'BS' }] },
                { entries: [{ account: 'Sales', cls: 'IS' }] }
            ],
            solution: [
                'Income statement: revenues and expenses (Sales, Expenses).',
                'Balance sheet: assets, liabilities, and equity (financial position at a date).'
            ]
        },

        // --- B3.4: Ch3 owner’s capital roll-forward, with distractor data (Assignment 3-2, #1) ---
        {
            id: 'k1-ch3-capital',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'ratio',
            title: 'Owner’s Capital — End of Year',
            prompt: 'Select only the relevant information and compute the balance in the owner’s capital account at year-end.',
            difficulty: 2,
            givens: [
                { label: 'Capital at start of year', value: 40000 },
                { label: 'Owner’s investments during the year', value: 5000 },
                { label: 'Owner’s withdrawals during the year', value: 14000 },
                { label: 'Net income for the year', value: 20000 },
                { label: 'Accounts payable at end of year', value: 17000 },
                { label: 'Accounts receivable at end of year', value: 8000 }
            ],
            fields: [
                { key: 'endCapital', label: 'Owner’s capital, end of year', answer: 51000, tol: 0.005, unit: '$', hint: 'Start + Investments + Net income − Withdrawals. (Payables and receivables are not part of the capital account.)' }
            ],
            solution: [
                'Owner’s capital roll-forward = 40,000 + 5,000 + 20,000 − 14,000 = 51,000.',
                'Accounts payable (17,000) and accounts receivable (8,000) are balance-sheet items — they do not belong in the capital roll-forward.'
            ]
        },

        // --- B3.4: Ch3 build the Income Statement (Assignment 3-3, Annie’s Restaurant, Inc.) ---
        {
            id: 'k1-ch3-income-statement',
            lesson: 'accounting-fundamentals',
            chapter: 3,
            type: 'statement',
            title: 'Build the Income Statement (Annie’s Restaurant)',
            prompt: 'Using the account balances below, prepare the income statement for the year ended April 30, 20X2: '
                + 'place each amount in the correct section and compute the subtotals and net income.',
            difficulty: 3,
            givens: [
                { label: 'Food sales', value: 510000 },
                { label: 'Beverage sales', value: 100000 },
                { label: 'Cost of food sales', value: 170000 },
                { label: 'Cost of beverage sales', value: 30000 },
                { label: 'Payroll', value: 200000 },
                { label: 'Payroll taxes & employee benefits', value: 30000 },
                { label: 'China, glassware & silverware', value: 1800 },
                { label: 'Laundry & dry cleaning', value: 5100 },
                { label: 'Supplies', value: 12800 },
                { label: 'Advertising', value: 6800 },
                { label: 'Utilities', value: 10800 },
                { label: 'Repairs & maintenance', value: 12000 },
                { label: 'Property taxes', value: 4200 },
                { label: 'Insurance', value: 5000 },
                { label: 'Interest', value: 15000 },
                { label: 'Depreciation', value: 18000 },
                { label: 'Income taxes', value: 31500 }
            ],
            sections: [
                {
                    key: 'rev', label: 'Revenue',
                    lines: [
                        { key: 'foodSales', label: 'Food sales', answer: 510000 },
                        { key: 'bevSales', label: 'Beverage sales', answer: 100000 }
                    ]
                },
                {
                    key: 'cos', label: 'Cost of Sales',
                    lines: [
                        { key: 'cosFood', label: 'Cost of food sales', answer: 170000 },
                        { key: 'cosBev', label: 'Cost of beverage sales', answer: 30000 }
                    ]
                },
                {
                    key: 'opex', label: 'Operating Expenses',
                    lines: [
                        { key: 'payroll', label: 'Payroll', answer: 200000 },
                        { key: 'payrollTax', label: 'Payroll taxes & employee benefits', answer: 30000 },
                        { key: 'cgs', label: 'China, glassware & silverware', answer: 1800 },
                        { key: 'laundry', label: 'Laundry & dry cleaning', answer: 5100 },
                        { key: 'supplies', label: 'Supplies', answer: 12800 },
                        { key: 'advertising', label: 'Advertising', answer: 6800 },
                        { key: 'utilities', label: 'Utilities', answer: 10800 },
                        { key: 'repairs', label: 'Repairs & maintenance', answer: 12000 }
                    ]
                },
                {
                    key: 'fixed', label: 'Fixed Charges',
                    lines: [
                        { key: 'propTax', label: 'Property taxes', answer: 4200 },
                        { key: 'insurance', label: 'Insurance', answer: 5000 },
                        { key: 'interest', label: 'Interest', answer: 15000 },
                        { key: 'depreciation', label: 'Depreciation', answer: 18000 }
                    ]
                }
            ],
            totals: [
                { key: 'totalRevenue', label: 'Total revenue', answer: 610000 },
                { key: 'totalCOS', label: 'Total cost of sales', answer: 200000 },
                { key: 'grossProfit', label: 'Gross profit', answer: 410000 },
                { key: 'totalOpEx', label: 'Total operating expenses', answer: 279300 },
                { key: 'incBeforeFixed', label: 'Income before fixed charges & income taxes', answer: 130700 },
                { key: 'totalFixed', label: 'Total fixed charges', answer: 42200 },
                { key: 'incBeforeTax', label: 'Income before income taxes', answer: 88500 },
                { key: 'incomeTaxes', label: 'Income taxes', answer: 31500 },
                { key: 'netIncome', label: 'Net income', answer: 57000, derived: true }
            ],
            solution: [
                'Total revenue 610,000 − total cost of sales 200,000 = gross profit 410,000.',
                'Gross profit 410,000 − operating expenses 279,300 = income before fixed charges 130,700.',
                '130,700 − fixed charges 42,200 = income before income taxes 88,500.',
                '88,500 − income taxes 31,500 = net income 57,000.'
            ]
        },

        // ================= CHAPTERS 1–2 — INTRODUCTION, GAAP, BUSINESS FORMS & STOCK (K1) =================
        // Conceptual theory (standard GAAP / forms-of-organization / corporate-stock facts), not workbook-numeric.
        // Ch1–2 in Cote are introductory; the workbook has no numeric problem set for them.

        // --- B3.5: Ch1 Introduction to Accounting & GAAP ---
        {
            id: 'k1-ch1-concepts',
            lesson: 'accounting-fundamentals',
            chapter: 1,
            type: 'choice',
            title: 'Introduction to Accounting & GAAP',
            prompt: 'Answer each statement about basic accounting concepts and generally accepted accounting principles.',
            difficulty: 1,
            items: [
                { q: 'The basic accounting equation is Assets = Liabilities + Owners’ Equity.', kind: 'tf', answer: true },
                { q: 'Under the business entity assumption, the owner’s personal transactions are kept separate from the business’s records.', kind: 'tf', answer: true },
                { q: 'The cost principle records assets at their current market value at the end of each period.', kind: 'tf', answer: false },
                { q: 'The going concern assumption presumes the business will continue operating into the foreseeable future.', kind: 'tf', answer: true },
                { q: 'Generally Accepted Accounting Principles (GAAP) are the common standards that guide financial accounting.', kind: 'tf', answer: true },
                { q: 'Under accrual accounting, revenue is recorded only when cash is received.', kind: 'tf', answer: false },
                { q: 'The matching principle records expenses in the same period as the revenues they help to generate.', kind: 'tf', answer: true },
                { q: 'The monetary unit assumption means transactions are recorded in a common monetary measure.', kind: 'tf', answer: true },
                {
                    q: 'Which financial statement reports a business’s financial position at a single point in time?',
                    kind: 'mc',
                    options: ['Income statement', 'Balance sheet', 'Statement of cash flows', 'Statement of retained earnings'],
                    answer: 1
                },
                {
                    q: 'Which principle directs accountants to avoid overstating assets or income when there is uncertainty?',
                    kind: 'mc',
                    options: ['Matching', 'Conservatism', 'Going concern', 'Cost'],
                    answer: 1
                },
                {
                    q: 'The accounting equation can be rearranged so that Owners’ Equity equals:',
                    kind: 'mc',
                    options: ['Assets + Liabilities', 'Assets − Liabilities', 'Liabilities − Assets', 'Revenue − Expenses'],
                    answer: 1
                }
            ],
            solution: [
                'Accounting equation: Assets = Liabilities + Owners’ Equity, so Owners’ Equity = Assets − Liabilities.',
                'Cost principle = historical cost (not market); accrual = revenue when EARNED (not when cash is received).',
                'Business entity, going concern, monetary unit, matching and conservatism are core GAAP assumptions/principles.',
                'The balance sheet is a point-in-time snapshot; the other statements cover a period.'
            ]
        },

        // --- B3.5: Ch2 Forms of Business Organization & Corporate Stock ---
        {
            id: 'k1-ch2-business-forms',
            lesson: 'accounting-fundamentals',
            chapter: 2,
            type: 'choice',
            title: 'Forms of Business Organization & Stock',
            prompt: 'Answer each statement about proprietorships, partnerships, corporations, and corporate stock.',
            difficulty: 2,
            items: [
                { q: 'A sole proprietorship is a separate legal entity from its owner.', kind: 'tf', answer: false },
                { q: 'Owners of a corporation generally have limited liability for the corporation’s debts.', kind: 'tf', answer: true },
                { q: 'A corporation is owned by its stockholders (shareholders).', kind: 'tf', answer: true },
                { q: 'In a sole proprietorship, the owner has unlimited personal liability for the business’s debts.', kind: 'tf', answer: true },
                { q: 'Par value represents the current market value of a share of stock.', kind: 'tf', answer: false },
                { q: 'Treasury stock is stock that a corporation has repurchased from its stockholders.', kind: 'tf', answer: true },
                { q: 'Issued shares can never exceed authorized shares.', kind: 'tf', answer: true },
                { q: 'Outstanding shares equal issued shares minus treasury shares.', kind: 'tf', answer: true },
                { q: 'The equity of a corporation consists of paid-in capital plus retained earnings.', kind: 'tf', answer: true },
                { q: 'A partnership must have at least two owners.', kind: 'tf', answer: true },
                {
                    q: 'When a corporation issues stock for more than its par value, the amount above par is recorded in:',
                    kind: 'mc',
                    options: ['Common Stock Issued', 'Additional Paid-In Capital', 'Retained Earnings', 'Treasury Stock'],
                    answer: 1
                },
                {
                    q: 'The equity account used to record the owner’s investment in a proprietorship is:',
                    kind: 'mc',
                    options: ['Common Stock Issued', 'Owner’s Capital', 'Retained Earnings', 'Additional Paid-In Capital'],
                    answer: 1
                },
                {
                    q: 'Which form of business is itself a separate legal and taxable entity?',
                    kind: 'mc',
                    options: ['Sole proprietorship', 'Partnership', 'Corporation', 'None of these'],
                    answer: 2
                }
            ],
            solution: [
                'Proprietorship: one owner, unlimited liability, NOT a separate legal entity (the owner is taxed personally).',
                'Corporation: a separate legal/taxable entity owned by stockholders, who have limited liability.',
                'Par value is a nominal (legal) amount, not market value; issue price above par goes to Additional Paid-In Capital.',
                'Authorized ≥ issued ≥ outstanding; Outstanding = Issued − Treasury. Corporate equity = paid-in capital + retained earnings.'
            ]
        }
    ]
};

if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
