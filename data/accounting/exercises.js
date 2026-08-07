// ===== ACCOUNTING — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): svi domenski + jezični podaci za interaktivne vježbe.
// Engine (js/exercises*.js, css/exercises.css) ne sadrži ništa odavde. Dodavanje vježbi
// za drugi predmet/jezik = nova ovakva datoteka + catalog unos, NULA izmjena enginea.
// Schema i tipovi: docs/architecture/EXERCISES_ENGINE.md §2. Brojevi su čisti Number (vidi §3).
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* immutable).
//
// B0.7: skeleton (prazna lista). Sadržaj se autorira u FAZI 3 (po poglavlju, K1 prvo).

const accountingExercises = {
    meta: { lang: 'en', currency: '$', version: 1 },
    exercises: [
        // Primjer omotnice (vidi docs/architecture/EXERCISES_ENGINE.md §2):
        // { id:'k1-classify-ch6-1', lesson:'first-midterm', chapter:6, type:'classify',
        //   title:'…', prompt:'…', difficulty:1, solution:[…], /* payload po tipu */ }

        // --- Ch4 Balance Sheet — build (statement); common stock = balancing figure ---
        {
            id: 'k1-statement-bs-1',
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
            lesson: 'first-midterm',
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
        },

        // ========================= CHAPTER 11 — DEPRECIATION & AMORTIZATION (K2) =========================
        // Source: Cote, Hotel & Restaurant Accounting, Ch. 11 workbook (Assignment 11-1):
        //   #1 straight-line schedule (cost 31,000 / salvage 3,000 / life 4 → 7,000/yr),
        //   #2 double-declining-balance schedule (rate 50%, never below salvage → year 4 expense = 875).
        // Concepts align with the Midterm 2 `depreciation` study category (SL/DDB/MACRS/amortization/depletion).

        // --- B3.6: Ch11 depreciation concepts & methods (TF + MC) ---
        {
            id: 'k2-ch11-concepts',
            lesson: 'second-midterm',
            chapter: 11,
            type: 'choice',
            title: 'Depreciation — Concepts & Methods',
            prompt: 'Answer each statement about depreciation methods, book value, and related cost allocations.',
            difficulty: 2,
            items: [
                { q: 'Depreciation allocates the cost of a tangible long-lived asset over its useful life.', kind: 'tf', answer: true },
                { q: 'Book value equals cost minus accumulated depreciation.', kind: 'tf', answer: true },
                { q: 'The depreciable base is cost minus salvage (residual) value.', kind: 'tf', answer: true },
                { q: 'Straight-line depreciation records a larger expense in the early years than in the later years.', kind: 'tf', answer: false },
                { q: 'Double-declining-balance is an accelerated method that ignores salvage value in the rate calculation.', kind: 'tf', answer: true },
                { q: 'Under any method, an asset may be depreciated below its salvage value.', kind: 'tf', answer: false },
                { q: 'Accumulated depreciation is a contra-asset account.', kind: 'tf', answer: true },
                { q: 'MACRS is the depreciation system required for U.S. financial-statement (GAAP) reporting.', kind: 'tf', answer: false },
                {
                    q: 'Straight-line depreciation per year =',
                    kind: 'mc',
                    options: ['Cost ÷ Useful life', '(Cost − Salvage) ÷ Useful life', 'Cost × DDB rate', 'Cost − Salvage'],
                    answer: 1
                },
                {
                    q: 'The double-declining-balance rate for an asset with a 5-year life is:',
                    kind: 'mc',
                    options: ['10%', '20%', '40%', '50%'],
                    answer: 2
                },
                {
                    q: 'Allocating the cost of an intangible asset (e.g., a franchise) over its life is called:',
                    kind: 'mc',
                    options: ['Depreciation', 'Amortization', 'Depletion', 'Accrual'],
                    answer: 1
                },
                {
                    q: 'Allocating the cost of a natural resource (e.g., a mine) as it is used up is called:',
                    kind: 'mc',
                    options: ['Depreciation', 'Amortization', 'Depletion', 'Recognition'],
                    answer: 2
                }
            ],
            solution: [
                'Depreciation (tangible assets), amortization (intangible assets) and depletion (natural resources) all allocate cost over time.',
                'Book value = cost − accumulated depreciation; depreciable base = cost − salvage.',
                'Straight-line is even each year; DDB is accelerated (more in early years). DDB rate = 2 × (1 ÷ life), e.g. 2 ÷ 5 = 40%.',
                'No method depreciates below salvage value. MACRS is for U.S. TAX, not GAAP statements. Accumulated depreciation is a contra-asset.'
            ]
        },

        // --- B3.6: Ch11 straight-line schedule (Assignment 11-1, #1 — exact textbook figures) ---
        {
            id: 'k2-ch11-sl-schedule',
            lesson: 'second-midterm',
            chapter: 11,
            type: 'numeric',
            title: 'Straight-Line Depreciation Schedule',
            prompt: 'An asset costs $31,000, has a $3,000 salvage value, and a 4-year useful life. Complete the '
                + 'straight-line depreciation schedule: for each year give the depreciation expense, the accumulated '
                + 'depreciation, and the ending book value.',
            difficulty: 2,
            fields: [
                { key: 'y1exp', label: 'Year 1 — Depreciation expense', answer: 7000, tol: 0.005, unit: '$', hint: '(31,000 − 3,000) ÷ 4 = 7,000 each year' },
                { key: 'y1acc', label: 'Year 1 — Accumulated depreciation', answer: 7000, tol: 0.005, unit: '$' },
                { key: 'y1bv', label: 'Year 1 — Ending book value', answer: 24000, tol: 0.005, unit: '$', hint: 'Cost − accumulated depreciation' },
                { key: 'y2exp', label: 'Year 2 — Depreciation expense', answer: 7000, tol: 0.005, unit: '$' },
                { key: 'y2acc', label: 'Year 2 — Accumulated depreciation', answer: 14000, tol: 0.005, unit: '$' },
                { key: 'y2bv', label: 'Year 2 — Ending book value', answer: 17000, tol: 0.005, unit: '$' },
                { key: 'y3exp', label: 'Year 3 — Depreciation expense', answer: 7000, tol: 0.005, unit: '$' },
                { key: 'y3acc', label: 'Year 3 — Accumulated depreciation', answer: 21000, tol: 0.005, unit: '$' },
                { key: 'y3bv', label: 'Year 3 — Ending book value', answer: 10000, tol: 0.005, unit: '$' },
                { key: 'y4exp', label: 'Year 4 — Depreciation expense', answer: 7000, tol: 0.005, unit: '$' },
                { key: 'y4acc', label: 'Year 4 — Accumulated depreciation', answer: 28000, tol: 0.005, unit: '$' },
                { key: 'y4bv', label: 'Year 4 — Ending book value', answer: 3000, tol: 0.005, unit: '$', hint: 'Ends at the salvage value' }
            ],
            solution: [
                'Annual straight-line depreciation = (31,000 − 3,000) ÷ 4 = 7,000 each year.',
                'Accumulated depreciation grows 7,000 → 14,000 → 21,000 → 28,000.',
                'Book value = cost − accumulated: 24,000 → 17,000 → 10,000 → 3,000.',
                'After 4 years the book value equals the 3,000 salvage value.'
            ]
        },

        // --- B3.6: Ch11 double-declining-balance schedule (Assignment 11-1, #2 — salvage floor in year 4) ---
        {
            id: 'k2-ch11-ddb-schedule',
            lesson: 'second-midterm',
            chapter: 11,
            type: 'numeric',
            title: 'Double-Declining-Balance Schedule',
            prompt: 'Use the same asset (cost $31,000, salvage $3,000, 4-year life). Apply the double-declining-balance '
                + 'method (round the DDB rate to a whole percentage). Give the DDB rate, then each year’s depreciation '
                + 'expense and ending book value. Remember: the asset is never depreciated below its salvage value.',
            difficulty: 3,
            fields: [
                { key: 'rate', label: 'DDB rate (%)', answer: 50, tol: 0.5, unit: '%', hint: '2 × straight-line rate = 2 × (1 ÷ 4) = 50%' },
                { key: 'y1exp', label: 'Year 1 — Depreciation expense', answer: 15500, tol: 0.005, unit: '$', hint: '50% × 31,000' },
                { key: 'y1bv', label: 'Year 1 — Ending book value', answer: 15500, tol: 0.005, unit: '$' },
                { key: 'y2exp', label: 'Year 2 — Depreciation expense', answer: 7750, tol: 0.005, unit: '$', hint: '50% × 15,500' },
                { key: 'y2bv', label: 'Year 2 — Ending book value', answer: 7750, tol: 0.005, unit: '$' },
                { key: 'y3exp', label: 'Year 3 — Depreciation expense', answer: 3875, tol: 0.005, unit: '$', hint: '50% × 7,750' },
                { key: 'y3bv', label: 'Year 3 — Ending book value', answer: 3875, tol: 0.005, unit: '$' },
                { key: 'y4exp', label: 'Year 4 — Depreciation expense', answer: 875, tol: 0.005, unit: '$', hint: '50% × 3,875 = 1,938 would drop below salvage, so expense only 3,875 − 3,000 = 875' },
                { key: 'y4bv', label: 'Year 4 — Ending book value', answer: 3000, tol: 0.005, unit: '$', hint: 'Floored at the salvage value' }
            ],
            solution: [
                'DDB rate = 2 × straight-line rate = 2 × (1 ÷ 4) = 50%.',
                'Year 1: 50% × 31,000 = 15,500 → book value 15,500.',
                'Year 2: 50% × 15,500 = 7,750 → book value 7,750.',
                'Year 3: 50% × 7,750 = 3,875 → book value 3,875.',
                'Year 4: 50% × 3,875 = 1,938 would fall below the 3,000 salvage value, so depreciate only 875 (3,875 − 3,000); book value ends at 3,000.'
            ]
        },

        // --- B3.6: Ch11 straight-line drill (randomized — "New numbers") ---
        {
            id: 'k2-ch11-sl-random',
            lesson: 'second-midterm',
            chapter: 11,
            type: 'numeric',
            title: 'Straight-Line Depreciation — Drill',
            prompt: 'Compute straight-line depreciation for the asset below.',
            difficulty: 2,
            params: {
                cost: { min: 20000, max: 60000, step: 1000 },
                salvage: { min: 2000, max: 8000, step: 500 },
                life: { choices: [4, 5, 10] }
            },
            generate(p) {
                const annual = (p.cost - p.salvage) / p.life;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                return {
                    prompt: 'An asset is purchased for ' + fmt(p.cost) + '. It has an estimated salvage (residual) value of '
                        + fmt(p.salvage) + ' and a useful life of ' + p.life + ' years. Using the straight-line method, '
                        + 'compute the annual depreciation expense and the book value at the end of years 1 and 2.',
                    fields: [
                        { key: 'annual', label: 'Annual depreciation expense', answer: annual, tol: 0.005, unit: '$', hint: '(Cost − Salvage) ÷ Useful life' },
                        { key: 'bv1', label: 'Book value, end of year 1', answer: p.cost - annual, tol: 0.005, unit: '$', hint: 'Cost − one year of depreciation' },
                        { key: 'bv2', label: 'Book value, end of year 2', answer: p.cost - 2 * annual, tol: 0.005, unit: '$', hint: 'Cost − two years of depreciation' }
                    ],
                    solution: [
                        'Annual depreciation = (Cost − Salvage) ÷ Life = (' + fmt(p.cost) + ' − ' + fmt(p.salvage) + ') ÷ ' + p.life + ' = ' + fmt(annual) + '.',
                        'Book value, end of year 1 = ' + fmt(p.cost) + ' − ' + fmt(annual) + ' = ' + fmt(p.cost - annual) + '.',
                        'Book value, end of year 2 = ' + fmt(p.cost) + ' − 2 × ' + fmt(annual) + ' = ' + fmt(p.cost - 2 * annual) + '.'
                    ]
                };
            },
            solution: ['Press “New numbers” for a fresh asset. Annual SL depreciation = (Cost − Salvage) ÷ Useful life; book value = cost − accumulated depreciation.']
        },

        // --- B3.6: Ch11 double-declining-balance drill (randomized — "New numbers") ---
        {
            id: 'k2-ch11-ddb-random',
            lesson: 'second-midterm',
            chapter: 11,
            type: 'numeric',
            title: 'Double-Declining-Balance — Drill',
            prompt: 'Compute the DDB rate and the first two years of depreciation.',
            difficulty: 3,
            params: {
                cost: { min: 20000, max: 60000, step: 1000 },
                life: { choices: [4, 5, 10] }
            },
            generate(p) {
                const rate = 2 / p.life;
                const ratePct = rate * 100;
                const y1 = p.cost * rate;
                const y2 = (p.cost - y1) * rate;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                return {
                    prompt: 'An asset is purchased for ' + fmt(p.cost) + ' with a useful life of ' + p.life + ' years. Using the '
                        + 'double-declining-balance (DDB) method, give the DDB rate and the depreciation expense for years 1 and 2. '
                        + '(Salvage value is ignored in the DDB rate calculation.)',
                    fields: [
                        { key: 'rate', label: 'DDB rate (%)', answer: ratePct, tol: 0.5, unit: '%', hint: '2 × straight-line rate = 2 × (1 ÷ Life)' },
                        { key: 'y1', label: 'Year 1 depreciation expense', answer: y1, tol: 0.005, unit: '$', hint: 'DDB rate × beginning book value (= cost in year 1)' },
                        { key: 'y2', label: 'Year 2 depreciation expense', answer: y2, tol: 0.005, unit: '$', hint: 'DDB rate × book value at the start of year 2' }
                    ],
                    solution: [
                        'DDB rate = 2 × (1 ÷ ' + p.life + ') = ' + ratePct + '%.',
                        'Year 1 = ' + ratePct + '% × ' + fmt(p.cost) + ' = ' + fmt(y1) + '.',
                        'Year 2 = ' + ratePct + '% × (' + fmt(p.cost) + ' − ' + fmt(y1) + ') = ' + ratePct + '% × ' + fmt(p.cost - y1) + ' = ' + fmt(y2) + '.'
                    ]
                };
            },
            solution: ['Press “New numbers” for a fresh asset. DDB rate = 2 × (1 ÷ life); each year’s expense = rate × beginning book value.']
        },

        // ===================== INVENTORY VALUATION — FIFO / LIFO / AVERAGE (K2) =====================
        // Source: course "Inventory accounting presentation" (FIFO / LIFO / Weighted average).
        // Universal, well-defined cost-flow methods → exact, self-checking numbers (COGS + Ending = Goods available).
        // Not a numbered Cote chapter → no `chapter` field (groups under "Other" on the Midterm 2 list).

        // --- B3.7: inventory cost-flow concepts (TF + MC) ---
        {
            id: 'k2-inv-concepts',
            lesson: 'second-midterm',
            type: 'choice',
            title: 'Inventory Valuation — Concepts',
            prompt: 'Answer each statement about the FIFO, LIFO and weighted-average cost-flow methods. '
                + '(Assume unit costs are rising over time, unless stated otherwise.)',
            difficulty: 2,
            items: [
                { q: 'Cost of goods sold = Beginning inventory + Purchases − Ending inventory.', kind: 'tf', answer: true },
                { q: 'FIFO assumes the first (oldest) units purchased are the first ones sold.', kind: 'tf', answer: true },
                { q: 'LIFO assumes the most recently purchased units are the first ones sold.', kind: 'tf', answer: true },
                { q: 'Goods available for sale = beginning inventory + net purchases.', kind: 'tf', answer: true },
                { q: 'Under FIFO, ending inventory is valued at the most recent (newest) purchase costs.', kind: 'tf', answer: true },
                { q: 'When unit costs are rising, FIFO produces a higher cost of goods sold than LIFO.', kind: 'tf', answer: false },
                { q: 'When unit costs are rising, LIFO produces a lower ending inventory than FIFO.', kind: 'tf', answer: true },
                { q: 'The weighted-average method assigns the same average unit cost to the units sold and the units remaining.', kind: 'tf', answer: true },
                {
                    q: 'When unit costs are rising, which method reports the HIGHEST ending inventory?',
                    kind: 'mc',
                    options: ['FIFO', 'LIFO', 'Weighted average', 'All three are equal'],
                    answer: 0
                },
                {
                    q: 'When unit costs are rising, which method reports the HIGHEST cost of goods sold (and thus the lowest net income)?',
                    kind: 'mc',
                    options: ['FIFO', 'LIFO', 'Weighted average', 'None of these'],
                    answer: 1
                },
                {
                    q: 'The weighted-average unit cost equals:',
                    kind: 'mc',
                    options: ['Cost of goods available ÷ Units available', 'Ending inventory ÷ Units sold', 'Purchases ÷ Beginning units', 'Cost of goods sold ÷ Units available'],
                    answer: 0
                }
            ],
            solution: [
                'COGS = Beginning inventory + Purchases − Ending inventory; goods available = beginning + purchases.',
                'FIFO: oldest costs flow to COGS, so ending inventory holds the newest (highest, when rising) costs → highest ending inventory, lowest COGS.',
                'LIFO: newest costs flow to COGS → highest COGS, lowest ending inventory and lowest net income when costs rise.',
                'Weighted-average unit cost = cost of goods available ÷ units available, applied to both units sold and units on hand.'
            ]
        },

        // --- B3.7: cost-of-goods-sold formula drill (randomized) ---
        {
            id: 'k2-inv-cogs-formula',
            lesson: 'second-midterm',
            type: 'numeric',
            title: 'Cost of Goods Sold — Formula',
            prompt: 'Compute goods available for sale and cost of goods sold.',
            difficulty: 1,
            params: {
                bi: { min: 5000, max: 20000, step: 500 },
                purch: { min: 20000, max: 60000, step: 500 },
                ei: { min: 4000, max: 15000, step: 500 }
            },
            generate(p) {
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                const ga = p.bi + p.purch;
                const cogs = ga - p.ei;
                return {
                    prompt: 'A restaurant’s food inventory records show beginning inventory ' + fmt(p.bi) + ', purchases during the period '
                        + fmt(p.purch) + ', and ending inventory ' + fmt(p.ei) + '. Compute the cost of goods available for sale and '
                        + 'the cost of goods sold.',
                    fields: [
                        { key: 'ga', label: 'Cost of goods available for sale', answer: ga, tol: 0.005, unit: '$', hint: 'Beginning inventory + Purchases' },
                        { key: 'cogs', label: 'Cost of goods sold', answer: cogs, tol: 0.005, unit: '$', hint: 'Goods available − Ending inventory' }
                    ],
                    solution: [
                        'Goods available for sale = ' + fmt(p.bi) + ' + ' + fmt(p.purch) + ' = ' + fmt(ga) + '.',
                        'Cost of goods sold = ' + fmt(ga) + ' − ' + fmt(p.ei) + ' = ' + fmt(cogs) + '.'
                    ]
                };
            },
            solution: ['Press “New numbers” for fresh figures. Goods available = Beginning + Purchases; COGS = Goods available − Ending inventory.']
        },

        // --- B3.7: FIFO / LIFO / weighted-average comparison (fixed worked example, clean figures) ---
        {
            id: 'k2-inv-methods',
            lesson: 'second-midterm',
            type: 'numeric',
            title: 'FIFO vs LIFO vs Weighted Average',
            prompt: 'Periodic inventory. Beginning inventory: 100 units @ $10. Purchase 1: 100 units @ $12. '
                + 'Purchase 2: 200 units @ $13. During the period 250 units were sold (150 units remain on hand). '
                + 'Compute the cost of goods sold and the ending inventory under each method. '
                + '(Goods available for sale = 400 units, $4,800.)',
            difficulty: 3,
            fields: [
                { key: 'gaUnits', label: 'Goods available for sale (units)', answer: 400, tol: 0.005, unit: 'units', hint: '100 + 100 + 200' },
                { key: 'gaCost', label: 'Goods available for sale (cost)', answer: 4800, tol: 0.005, unit: '$', hint: '1,000 + 1,200 + 2,600' },
                { key: 'fifoCogs', label: 'FIFO — Cost of goods sold', answer: 2850, tol: 0.005, unit: '$', hint: 'Oldest first: 100@10 + 100@12 + 50@13' },
                { key: 'fifoEnd', label: 'FIFO — Ending inventory', answer: 1950, tol: 0.005, unit: '$', hint: '150 newest units @ $13' },
                { key: 'lifoCogs', label: 'LIFO — Cost of goods sold', answer: 3200, tol: 0.005, unit: '$', hint: 'Newest first: 200@13 + 50@12' },
                { key: 'lifoEnd', label: 'LIFO — Ending inventory', answer: 1600, tol: 0.005, unit: '$', hint: '100@10 + 50@12 (oldest units remain)' },
                { key: 'avgUnit', label: 'Weighted-average unit cost', answer: 12, tol: 0.005, unit: '$', hint: '$4,800 ÷ 400 units' },
                { key: 'avgCogs', label: 'Average — Cost of goods sold', answer: 3000, tol: 0.005, unit: '$', hint: '250 units × average unit cost' },
                { key: 'avgEnd', label: 'Average — Ending inventory', answer: 1800, tol: 0.005, unit: '$', hint: '150 units × average unit cost' }
            ],
            solution: [
                'Goods available for sale = 400 units costing $4,800; in every method COGS + ending inventory = $4,800.',
                'FIFO (oldest to COGS): 100@10 + 100@12 + 50@13 = 2,850; ending 150@13 = 1,950.',
                'LIFO (newest to COGS): 200@13 + 50@12 = 3,200; ending 100@10 + 50@12 = 1,600.',
                'Weighted average: 4,800 ÷ 400 = $12.00/unit → COGS 250 × 12 = 3,000; ending 150 × 12 = 1,800.'
            ]
        },

        // --- B3.7: FIFO / LIFO drill (randomized, 2 inventory layers → integer answers) ---
        {
            id: 'k2-inv-fifo-lifo-random',
            lesson: 'second-midterm',
            type: 'numeric',
            title: 'FIFO & LIFO — Drill',
            prompt: 'Compute cost of goods sold and ending inventory under FIFO and LIFO.',
            difficulty: 3,
            params: {
                begUnits: { min: 60, max: 140, step: 10 },
                begPrice: { min: 8, max: 12, step: 1 },
                purchUnits: { min: 100, max: 200, step: 10 },
                purchPrice: { min: 13, max: 18, step: 1 }
            },
            generate(p) {
                const total = p.begUnits + p.purchUnits;
                const sold = p.purchUnits + p.begUnits / 2;   // > purchUnits and < total → crosses both layers
                const endUnits = total - sold;                 // = begUnits / 2 (whole, since step 10)
                const fifoCogs = p.begUnits * p.begPrice + (sold - p.begUnits) * p.purchPrice; // oldest first
                const fifoEnd = endUnits * p.purchPrice;       // remaining units are the newest (purchase)
                const lifoCogs = p.purchUnits * p.purchPrice + (sold - p.purchUnits) * p.begPrice; // newest first
                const lifoEnd = endUnits * p.begPrice;         // remaining units are the oldest (beginning)
                const u = (n) => n.toLocaleString('en-US');
                const m = (n) => '$' + n.toLocaleString('en-US');
                return {
                    prompt: 'Periodic inventory. Beginning inventory: ' + u(p.begUnits) + ' units @ $' + p.begPrice + '. '
                        + 'Purchased: ' + u(p.purchUnits) + ' units @ $' + p.purchPrice + '. ' + u(sold) + ' units were sold '
                        + '(' + u(endUnits) + ' units remain). Compute cost of goods sold and ending inventory under FIFO and LIFO.',
                    fields: [
                        { key: 'fifoCogs', label: 'FIFO — Cost of goods sold', answer: fifoCogs, tol: 0.005, unit: '$', hint: 'Oldest units first: all beginning units, then the rest from the purchase' },
                        { key: 'fifoEnd', label: 'FIFO — Ending inventory', answer: fifoEnd, tol: 0.005, unit: '$', hint: 'Remaining units are the newest (purchase price)' },
                        { key: 'lifoCogs', label: 'LIFO — Cost of goods sold', answer: lifoCogs, tol: 0.005, unit: '$', hint: 'Newest units first: all purchase units, then the rest from beginning' },
                        { key: 'lifoEnd', label: 'LIFO — Ending inventory', answer: lifoEnd, tol: 0.005, unit: '$', hint: 'Remaining units are the oldest (beginning price)' }
                    ],
                    solution: [
                        'FIFO COGS = ' + u(p.begUnits) + '×$' + p.begPrice + ' + ' + u(sold - p.begUnits) + '×$' + p.purchPrice + ' = ' + m(fifoCogs) + '; FIFO ending = ' + u(endUnits) + '×$' + p.purchPrice + ' = ' + m(fifoEnd) + '.',
                        'LIFO COGS = ' + u(p.purchUnits) + '×$' + p.purchPrice + ' + ' + u(sold - p.purchUnits) + '×$' + p.begPrice + ' = ' + m(lifoCogs) + '; LIFO ending = ' + u(endUnits) + '×$' + p.begPrice + ' = ' + m(lifoEnd) + '.',
                        'Check: under each method COGS + ending inventory = cost of goods available (' + m(p.begUnits * p.begPrice + p.purchUnits * p.purchPrice) + ').'
                    ]
                };
            },
            solution: ['Press “New numbers” for a fresh problem. FIFO sends the oldest costs to COGS; LIFO sends the newest costs to COGS.']
        },

        // ===================== CHAPTER 9 — RESTAURANT OPERATING RATIOS (K2) =====================
        // Universal restaurant KPIs (USAR context): average check, seat turnover, food/labor cost %.
        // Exact, self-checking formulas. (Workbook Assignment 9-1 is USAR expense/sales CLASSIFICATION —
        // deferred until an official answer key is available; the ambiguous items risk wrong auto-grading.)

        // --- B3.8: Ch9 restaurant ratios (fixed, clean figures) ---
        {
            id: 'k2-ch9-restaurant-ratios',
            lesson: 'second-midterm',
            chapter: 9,
            type: 'ratio',
            title: 'Restaurant Operating Ratios',
            prompt: 'A restaurant with 120 seats operated 300 days. Using the annual figures below, compute the '
                + 'average check, the daily seat turnover, the food cost percentage and the labor cost percentage.',
            difficulty: 2,
            givens: [
                { label: 'Food sales', value: 864000 },
                { label: 'Covers (guests served)', value: 54000 },
                { label: 'Seats', value: 120 },
                { label: 'Operating days', value: 300 },
                { label: 'Cost of food sold', value: 302400 },
                { label: 'Labor (payroll) cost', value: 259200 }
            ],
            fields: [
                { key: 'avgCheck', label: 'Average check', answer: 16, tol: 0.005, unit: '$', hint: 'Food sales ÷ covers' },
                { key: 'seatTurn', label: 'Seat turnover (per day)', answer: 1.5, tol: 0.005, unit: '×/day', hint: 'Covers ÷ (seats × operating days)' },
                { key: 'foodPct', label: 'Food cost %', answer: 35, tol: 0.05, unit: '%', hint: 'Cost of food sold ÷ food sales × 100' },
                { key: 'laborPct', label: 'Labor cost %', answer: 30, tol: 0.05, unit: '%', hint: 'Labor cost ÷ food sales × 100' }
            ],
            solution: [
                'Average check = 864,000 ÷ 54,000 = $16.00.',
                'Seat turnover per day = 54,000 ÷ (120 × 300) = 54,000 ÷ 36,000 = 1.5 turns/day.',
                'Food cost % = 302,400 ÷ 864,000 = 35.0%.',
                'Labor cost % = 259,200 ÷ 864,000 = 30.0%.'
            ]
        },

        // --- B3.8: Ch9 restaurant ratios drill (randomized) ---
        {
            id: 'k2-ch9-restaurant-random',
            lesson: 'second-midterm',
            chapter: 9,
            type: 'ratio',
            title: 'Restaurant Ratios — Drill',
            prompt: 'Compute the average check and the food cost percentage.',
            difficulty: 2,
            params: {
                covers: { min: 20000, max: 50000, step: 5000 },
                avgCheck: { choices: [12, 15, 16, 18, 20] },
                foodCostPct: { choices: [28, 30, 32, 35] }
            },
            generate(p) {
                const foodSales = p.covers * p.avgCheck;
                const costOfFood = foodSales * p.foodCostPct / 100;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                const u = (n) => n.toLocaleString('en-US');
                return {
                    prompt: 'A restaurant served ' + u(p.covers) + ' covers and recorded food sales of ' + fmt(foodSales) + '. '
                        + 'The cost of food sold was ' + fmt(costOfFood) + '. Compute the average check and the food cost percentage.',
                    givens: [
                        { label: 'Food sales', value: foodSales },
                        { label: 'Covers (guests served)', value: p.covers },
                        { label: 'Cost of food sold', value: costOfFood }
                    ],
                    fields: [
                        { key: 'avgCheck', label: 'Average check', answer: p.avgCheck, tol: 0.005, unit: '$', hint: 'Food sales ÷ covers' },
                        { key: 'foodPct', label: 'Food cost %', answer: p.foodCostPct, tol: 0.05, unit: '%', hint: 'Cost of food sold ÷ food sales × 100' }
                    ],
                    solution: [
                        'Average check = ' + fmt(foodSales) + ' ÷ ' + u(p.covers) + ' = $' + p.avgCheck + '.00.',
                        'Food cost % = ' + fmt(costOfFood) + ' ÷ ' + fmt(foodSales) + ' = ' + p.foodCostPct + '%.'
                    ]
                };
            },
            solution: ['Press “New numbers” for fresh figures. Average check = food sales ÷ covers; food cost % = cost of food sold ÷ food sales × 100.']
        },

        // ===================== CHAPTER 10 — HOTEL ROOMS RATIOS (K2) =====================
        // Universal lodging KPIs (USALI context): occupancy %, ADR, RevPAR. Exact, self-checking
        // (RevPAR = ADR × occupancy = rooms revenue ÷ rooms available). (Assignment 10-1 USALI
        // department classification deferred — needs an official answer key.)

        // --- B3.8: Ch10 hotel rooms ratios (fixed, clean figures) ---
        {
            id: 'k2-ch10-hotel-ratios',
            lesson: 'second-midterm',
            chapter: 10,
            type: 'ratio',
            title: 'Hotel Rooms Ratios (Occupancy, ADR, RevPAR)',
            prompt: 'A 200-room hotel was open all 365 days (rooms available = 200 × 365 = 73,000). Using the annual '
                + 'rooms figures below, compute the occupancy percentage, the average daily rate (ADR) and RevPAR.',
            difficulty: 2,
            givens: [
                { label: 'Rooms available', value: 73000 },
                { label: 'Rooms sold (occupied)', value: 54750 },
                { label: 'Rooms revenue', value: 6570000 }
            ],
            fields: [
                { key: 'occ', label: 'Occupancy %', answer: 75, tol: 0.05, unit: '%', hint: 'Rooms sold ÷ rooms available × 100' },
                { key: 'adr', label: 'Average daily rate (ADR)', answer: 120, tol: 0.005, unit: '$', hint: 'Rooms revenue ÷ rooms sold' },
                { key: 'revpar', label: 'RevPAR', answer: 90, tol: 0.005, unit: '$', hint: 'Rooms revenue ÷ rooms available (= ADR × occupancy)' }
            ],
            solution: [
                'Occupancy % = 54,750 ÷ 73,000 = 75.0%.',
                'ADR = 6,570,000 ÷ 54,750 = $120.00.',
                'RevPAR = 6,570,000 ÷ 73,000 = $90.00 (= ADR 120 × occupancy 0.75).'
            ]
        },

        // --- B3.8: Ch10 hotel rooms ratios drill (randomized) ---
        {
            id: 'k2-ch10-hotel-random',
            lesson: 'second-midterm',
            chapter: 10,
            type: 'ratio',
            title: 'Hotel Ratios — Drill',
            prompt: 'Compute the occupancy %, the ADR and RevPAR.',
            difficulty: 2,
            params: {
                roomsAvailable: { choices: [10000, 12000, 15000, 20000] },
                occupancyPct: { choices: [60, 70, 75, 80] },
                adr: { choices: [100, 120, 140, 160] }
            },
            generate(p) {
                const roomsSold = p.roomsAvailable * p.occupancyPct / 100;
                const roomsRevenue = roomsSold * p.adr;
                const revpar = roomsRevenue / p.roomsAvailable;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                const u = (n) => n.toLocaleString('en-US');
                return {
                    prompt: 'A hotel had ' + u(p.roomsAvailable) + ' available room-nights, sold ' + u(roomsSold) + ' of them, and '
                        + 'earned rooms revenue of ' + fmt(roomsRevenue) + '. Compute the occupancy %, the ADR and RevPAR.',
                    givens: [
                        { label: 'Rooms available', value: p.roomsAvailable },
                        { label: 'Rooms sold (occupied)', value: roomsSold },
                        { label: 'Rooms revenue', value: roomsRevenue }
                    ],
                    fields: [
                        { key: 'occ', label: 'Occupancy %', answer: p.occupancyPct, tol: 0.05, unit: '%', hint: 'Rooms sold ÷ rooms available × 100' },
                        { key: 'adr', label: 'Average daily rate (ADR)', answer: p.adr, tol: 0.005, unit: '$', hint: 'Rooms revenue ÷ rooms sold' },
                        { key: 'revpar', label: 'RevPAR', answer: revpar, tol: 0.005, unit: '$', hint: 'Rooms revenue ÷ rooms available (= ADR × occupancy)' }
                    ],
                    solution: [
                        'Occupancy % = ' + u(roomsSold) + ' ÷ ' + u(p.roomsAvailable) + ' = ' + p.occupancyPct + '%.',
                        'ADR = ' + fmt(roomsRevenue) + ' ÷ ' + u(roomsSold) + ' = $' + p.adr + '.00.',
                        'RevPAR = ' + fmt(roomsRevenue) + ' ÷ ' + u(p.roomsAvailable) + ' = ' + fmt(revpar) + ' (= ADR × occupancy).'
                    ]
                };
            },
            solution: ['Press “New numbers” for a fresh hotel. Occupancy = rooms sold ÷ rooms available; ADR = revenue ÷ rooms sold; RevPAR = revenue ÷ rooms available.']
        },

        // ===================== CHAPTER 12 — ANALYZING FINANCIAL STATEMENTS (K2) =====================
        // Concepts: Cote workbook Assignment 12-1 ("Terminology and Concepts", True/False) — kept the items
        // that are universal accounting facts (dropped a couple of textbook-specific/ambiguous ones, e.g.
        // audit-vs-fraud). Ratios + vertical (common-size) + horizontal analysis = universal, exact formulas.
        // Ratio definitions match the Midterm 2 `financialAnalysis` study category.

        // --- B3.9: Ch12 terminology & concepts (True/False) ---
        {
            id: 'k2-ch12-concepts',
            lesson: 'second-midterm',
            chapter: 12,
            type: 'choice',
            title: 'Analyzing Financial Statements — Terminology',
            prompt: 'Mark each statement true or false.',
            difficulty: 2,
            items: [
                { q: 'The accountant’s letter (engagement report) attached to the financial statements explains the level of service performed.', kind: 'tf', answer: true },
                { q: 'A review is a lower level of service (assurance) than a compilation.', kind: 'tf', answer: false },
                { q: 'The income statement shows the cash net income for the period.', kind: 'tf', answer: false },
                { q: 'Under the accrual system, sales and expenses are recorded only when cash is received or paid.', kind: 'tf', answer: false },
                { q: 'A common-size analysis produces relative (percentage) values.', kind: 'tf', answer: true },
                { q: 'The balance sheet reports the results of operations for a period of time.', kind: 'tf', answer: false },
                { q: 'Sales less operating expenses equals gross profit.', kind: 'tf', answer: false },
                { q: 'The profit margin ratio measures gross profit on sales.', kind: 'tf', answer: false },
                { q: 'The statement of cash flows reports assets, liabilities, and equity as of a certain date.', kind: 'tf', answer: false },
                { q: 'Property and equipment are long-lived intangible assets.', kind: 'tf', answer: false },
                { q: 'Prepaid expenses appear on the income statement.', kind: 'tf', answer: false },
                { q: 'Treasury stock is a short-term investment appearing under current assets on the balance sheet.', kind: 'tf', answer: false },
                { q: 'A common-size analysis is also called horizontal analysis.', kind: 'tf', answer: false },
                { q: 'The acid-test (quick) ratio is a tougher measure of liquidity than the current ratio.', kind: 'tf', answer: true },
                { q: 'The statement of cash flows contains three activity sections: operating, investing, and financing.', kind: 'tf', answer: true },
                { q: 'A food cost percentage of 33% can be interpreted as 33 cents of each sales dollar being the cost of food served to customers.', kind: 'tf', answer: true }
            ],
            solution: [
                'Assurance levels (low → high): compilation < review < audit; the accountant’s report states which was performed.',
                'The income statement is accrual-based (revenue when earned, expenses when incurred), not cash; gross profit = sales − cost of sales.',
                'The balance sheet (and the statement of cash flows’ ending position) is at a date; the income statement and cash-flow activity cover a period.',
                'Common-size = vertical analysis (relative %); horizontal = trend/comparative. Profit margin = net income ÷ sales; the acid-test excludes inventory.',
                'Property & equipment are tangible; prepaid expenses and treasury stock are balance-sheet items (asset; contra-equity).'
            ]
        },

        // --- B3.9: Ch12 liquidity & profitability ratios (fixed, clean figures) ---
        {
            id: 'k2-ch12-ratios',
            lesson: 'second-midterm',
            chapter: 12,
            type: 'ratio',
            title: 'Current Ratio, Quick Ratio & Profit Margin',
            prompt: 'Using the balances below, compute the current ratio, the quick (acid-test) ratio, and the profit '
                + 'margin. The quick ratio excludes inventory and prepaid expenses.',
            difficulty: 2,
            givens: [
                { label: 'Cash', value: 25000 },
                { label: 'Marketable securities', value: 5000 },
                { label: 'Accounts receivable', value: 20000 },
                { label: 'Inventory', value: 40000 },
                { label: 'Prepaid expenses', value: 10000 },
                { label: 'Total current assets', value: 100000 },
                { label: 'Current liabilities', value: 40000 },
                { label: 'Net income', value: 60000 },
                { label: 'Net sales (revenue)', value: 600000 }
            ],
            fields: [
                { key: 'current', label: 'Current ratio', answer: 2.5, tol: 0.005, unit: ': 1', hint: 'Total current assets ÷ current liabilities' },
                { key: 'quick', label: 'Quick (acid-test) ratio', answer: 1.25, tol: 0.005, unit: ': 1', hint: '(Cash + securities + receivables) ÷ current liabilities' },
                { key: 'margin', label: 'Profit margin %', answer: 10, tol: 0.05, unit: '%', hint: 'Net income ÷ net sales × 100' }
            ],
            solution: [
                'Current ratio = 100,000 ÷ 40,000 = 2.5 : 1.',
                'Quick ratio = (25,000 + 5,000 + 20,000) ÷ 40,000 = 50,000 ÷ 40,000 = 1.25 : 1 (inventory 40,000 and prepaid 10,000 excluded).',
                'Profit margin = 60,000 ÷ 600,000 = 10.0%.'
            ]
        },

        // --- B3.9: Ch12 liquidity ratios drill (randomized) ---
        {
            id: 'k2-ch12-ratios-random',
            lesson: 'second-midterm',
            chapter: 12,
            type: 'ratio',
            title: 'Current & Quick Ratios — Drill',
            prompt: 'Compute the current ratio and the quick (acid-test) ratio.',
            difficulty: 2,
            params: {
                cash: { choices: [20000, 25000, 30000] },
                securities: { choices: [0, 5000, 10000] },
                ar: { choices: [15000, 20000, 25000] },
                inventory: { choices: [30000, 40000, 50000] },
                curLiab: { choices: [20000, 25000, 50000] }
            },
            generate(p) {
                const quickNum = p.cash + p.securities + p.ar;
                const tca = quickNum + p.inventory;
                const current = tca / p.curLiab;
                const quick = quickNum / p.curLiab;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                return {
                    prompt: 'A business reports cash ' + fmt(p.cash) + ', marketable securities ' + fmt(p.securities) + ', accounts '
                        + 'receivable ' + fmt(p.ar) + ', inventory ' + fmt(p.inventory) + ', and current liabilities ' + fmt(p.curLiab)
                        + '. Compute the current ratio and the quick (acid-test) ratio.',
                    givens: [
                        { label: 'Cash', value: p.cash },
                        { label: 'Marketable securities', value: p.securities },
                        { label: 'Accounts receivable', value: p.ar },
                        { label: 'Inventory', value: p.inventory },
                        { label: 'Total current assets', value: tca },
                        { label: 'Current liabilities', value: p.curLiab }
                    ],
                    fields: [
                        { key: 'current', label: 'Current ratio', answer: current, tol: 0.005, unit: ': 1', hint: 'Total current assets ÷ current liabilities' },
                        { key: 'quick', label: 'Quick (acid-test) ratio', answer: quick, tol: 0.005, unit: ': 1', hint: '(Cash + securities + receivables) ÷ current liabilities' }
                    ],
                    solution: [
                        'Current ratio = ' + fmt(tca) + ' ÷ ' + fmt(p.curLiab) + ' = ' + current + ' : 1.',
                        'Quick ratio = ' + fmt(quickNum) + ' ÷ ' + fmt(p.curLiab) + ' = ' + quick + ' : 1 (inventory excluded).'
                    ]
                };
            },
            solution: ['Press “New numbers” for fresh balances. Current ratio = total current assets ÷ current liabilities; quick ratio excludes inventory.']
        },

        // --- B3.9: Ch12 vertical (common-size) analysis of the income statement ---
        {
            id: 'k2-ch12-vertical',
            lesson: 'second-midterm',
            chapter: 12,
            type: 'ratio',
            title: 'Vertical (Common-Size) Analysis',
            prompt: 'Perform a vertical (common-size) analysis of the income statement: express each item as a '
                + 'percentage of net sales (the base = 100%).',
            difficulty: 2,
            givens: [
                { label: 'Net sales', value: 600000 },
                { label: 'Cost of sales', value: 210000 },
                { label: 'Gross profit', value: 390000 },
                { label: 'Operating expenses', value: 270000 },
                { label: 'Net income', value: 120000 }
            ],
            fields: [
                { key: 'cosPct', label: 'Cost of sales (% of net sales)', answer: 35, tol: 0.05, unit: '%', hint: '210,000 ÷ 600,000 × 100' },
                { key: 'gpPct', label: 'Gross profit (% of net sales)', answer: 65, tol: 0.05, unit: '%', hint: '390,000 ÷ 600,000 × 100' },
                { key: 'opexPct', label: 'Operating expenses (% of net sales)', answer: 45, tol: 0.05, unit: '%', hint: '270,000 ÷ 600,000 × 100' },
                { key: 'niPct', label: 'Net income (% of net sales)', answer: 20, tol: 0.05, unit: '%', hint: '120,000 ÷ 600,000 × 100' }
            ],
            solution: [
                'Vertical analysis expresses each line as a % of the base (net sales = 100%).',
                'Cost of sales 210,000 ÷ 600,000 = 35%; gross profit 390,000 ÷ 600,000 = 65%.',
                'Operating expenses 270,000 ÷ 600,000 = 45%; net income 120,000 ÷ 600,000 = 20%.'
            ]
        },

        // --- B3.9: Ch12 horizontal analysis (dollar & percent change) ---
        {
            id: 'k2-ch12-horizontal',
            lesson: 'second-midterm',
            chapter: 12,
            type: 'ratio',
            title: 'Horizontal Analysis (Change Over Time)',
            prompt: 'Perform a horizontal analysis: compute the dollar change and the percent change from Year 1 '
                + '(base year) to Year 2 for each item.',
            difficulty: 2,
            givens: [
                { label: 'Net sales — Year 1', value: 500000 },
                { label: 'Net sales — Year 2', value: 600000 },
                { label: 'Net income — Year 1', value: 80000 },
                { label: 'Net income — Year 2', value: 120000 }
            ],
            fields: [
                { key: 'salesChg', label: 'Net sales — dollar change', answer: 100000, tol: 0.005, unit: '$', hint: 'Year 2 − Year 1' },
                { key: 'salesPct', label: 'Net sales — percent change', answer: 20, tol: 0.05, unit: '%', hint: 'Dollar change ÷ Year 1 × 100' },
                { key: 'niChg', label: 'Net income — dollar change', answer: 40000, tol: 0.005, unit: '$', hint: 'Year 2 − Year 1' },
                { key: 'niPct', label: 'Net income — percent change', answer: 50, tol: 0.05, unit: '%', hint: 'Dollar change ÷ Year 1 × 100' }
            ],
            solution: [
                'Net sales change = 600,000 − 500,000 = 100,000; % change = 100,000 ÷ 500,000 = 20%.',
                'Net income change = 120,000 − 80,000 = 40,000; % change = 40,000 ÷ 80,000 = 50%.',
                'Horizontal analysis always divides the change by the base-year (Year 1) amount.'
            ]
        },

        // ===================== K2 JOURNAL — REVENUE, EXPENSE & RETAINED EARNINGS =====================
        // Extends the K1 bookkeeping (assets/liabilities/equity) to revenue, expense and the depreciation
        // adjusting entry, then ties the period result into retained earnings and the ending balance sheet.
        // Guided journal grades per transaction (balanced + correct accounts/amounts). Not a single numbered
        // chapter → no `chapter` field (groups under "Other").

        // --- B3.10: guided journal — record revenue & expense transactions ---
        {
            id: 'k2-journal-operations',
            lesson: 'second-midterm',
            type: 'journal',
            title: 'Record Revenue & Expense Transactions',
            prompt: 'Record each transaction with the correct debit and credit. The perpetual inventory system is used. '
                + 'Use the chart of accounts shown in the dropdowns.',
            difficulty: 3,
            chartOfAccounts: [
                { name: 'Cash', normal: 'D', section: 'asset' },
                { name: 'Accounts Receivable', normal: 'D', section: 'asset' },
                { name: 'Food Inventory', normal: 'D', section: 'asset' },
                { name: 'Accumulated Depreciation', normal: 'C', section: 'asset' },
                { name: 'Accounts Payable', normal: 'C', section: 'liability' },
                { name: 'Food Sales', normal: 'C', section: 'revenue' },
                { name: 'Cost of Sales', normal: 'D', section: 'expense' },
                { name: 'Wages Expense', normal: 'D', section: 'expense' },
                { name: 'Depreciation Expense', normal: 'D', section: 'expense' }
            ],
            transactions: [
                {
                    text: 'Guests pay cash for food, $8,000.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 8000 },
                        { account: 'Food Sales', side: 'C', amount: 8000 }
                    ]
                },
                {
                    text: 'Food is sold to a hotel guest on an in-house account (open account), $3,000.',
                    entries: [
                        { account: 'Accounts Receivable', side: 'D', amount: 3000 },
                        { account: 'Food Sales', side: 'C', amount: 3000 }
                    ]
                },
                {
                    text: 'The perpetual system shows $4,400 of food provisions used during the period (cost of food sold).',
                    entries: [
                        { account: 'Cost of Sales', side: 'D', amount: 4400 },
                        { account: 'Food Inventory', side: 'C', amount: 4400 }
                    ]
                },
                {
                    text: 'The restaurant pays $5,000 cash for staff wages.',
                    entries: [
                        { account: 'Wages Expense', side: 'D', amount: 5000 },
                        { account: 'Cash', side: 'C', amount: 5000 }
                    ]
                },
                {
                    text: 'Record $1,200 of depreciation on the kitchen equipment for the period.',
                    entries: [
                        { account: 'Depreciation Expense', side: 'D', amount: 1200 },
                        { account: 'Accumulated Depreciation', side: 'C', amount: 1200 }
                    ]
                },
                {
                    text: 'A guest pays $2,000 of their account receivable in cash.',
                    entries: [
                        { account: 'Cash', side: 'D', amount: 2000 },
                        { account: 'Accounts Receivable', side: 'C', amount: 2000 }
                    ]
                }
            ],
            solution: [
                'Cash sale: debit Cash 8,000; credit Food Sales 8,000 (revenue).',
                'Sale on account: debit Accounts Receivable 3,000; credit Food Sales 3,000.',
                'Cost of food used (perpetual): debit Cost of Sales 4,400; credit Food Inventory 4,400.',
                'Pay wages: debit Wages Expense 5,000; credit Cash 5,000.',
                'Depreciation adjusting entry: debit Depreciation Expense 1,200; credit Accumulated Depreciation 1,200 (a contra-asset).',
                'Collect a receivable: debit Cash 2,000; credit Accounts Receivable 2,000.'
            ]
        },

        // --- B3.10: net income → ending retained earnings → ending balance sheet (numeric, fixed) ---
        {
            id: 'k2-net-income-re',
            lesson: 'second-midterm',
            type: 'numeric',
            title: 'Net Income, Retained Earnings & the Balance Sheet',
            prompt: 'For the year a restaurant reported total revenue of $600,000 and total expenses of $540,000. '
                + 'Beginning retained earnings were $200,000 and $20,000 of dividends were declared. Common stock issued '
                + 'is $260,000 and total liabilities are $300,000. Compute net income, ending retained earnings, total '
                + 'stockholders’ equity, and total assets (= liabilities + equity).',
            difficulty: 2,
            fields: [
                { key: 'netIncome', label: 'Net income', answer: 60000, tol: 0.005, unit: '$', hint: 'Total revenue − total expenses' },
                { key: 'endRE', label: 'Ending retained earnings', answer: 240000, tol: 0.005, unit: '$', hint: 'Beginning RE + net income − dividends' },
                { key: 'totalEquity', label: 'Total stockholders’ equity', answer: 500000, tol: 0.005, unit: '$', hint: 'Common stock + ending retained earnings' },
                { key: 'totalAssets', label: 'Total assets', answer: 800000, tol: 0.005, unit: '$', hint: 'Total liabilities + total stockholders’ equity' }
            ],
            solution: [
                'Net income = 600,000 − 540,000 = 60,000.',
                'Ending retained earnings = 200,000 + 60,000 − 20,000 = 240,000.',
                'Total stockholders’ equity = common stock 260,000 + retained earnings 240,000 = 500,000.',
                'Total assets = liabilities 300,000 + equity 500,000 = 800,000 (the balance sheet balances).'
            ]
        },

        // --- B3.10: net income & retained earnings drill (randomized) ---
        {
            id: 'k2-net-income-random',
            lesson: 'second-midterm',
            type: 'numeric',
            title: 'Net Income & Retained Earnings — Drill',
            prompt: 'Compute net income and ending retained earnings.',
            difficulty: 2,
            params: {
                revenue: { min: 500000, max: 800000, step: 50000 },
                expenses: { min: 300000, max: 480000, step: 20000 },
                begRE: { choices: [100000, 150000, 200000] },
                dividends: { choices: [0, 10000, 20000] }
            },
            generate(p) {
                const ni = p.revenue - p.expenses;
                const endRE = p.begRE + ni - p.dividends;
                const fmt = (n) => '$' + n.toLocaleString('en-US');
                return {
                    prompt: 'A business reports total revenue of ' + fmt(p.revenue) + ' and total expenses of ' + fmt(p.expenses) + '. '
                        + 'Beginning retained earnings were ' + fmt(p.begRE) + ' and dividends of ' + fmt(p.dividends) + ' were declared. '
                        + 'Compute net income and ending retained earnings.',
                    fields: [
                        { key: 'netIncome', label: 'Net income', answer: ni, tol: 0.005, unit: '$', hint: 'Total revenue − total expenses' },
                        { key: 'endRE', label: 'Ending retained earnings', answer: endRE, tol: 0.005, unit: '$', hint: 'Beginning RE + net income − dividends' }
                    ],
                    solution: [
                        'Net income = ' + fmt(p.revenue) + ' − ' + fmt(p.expenses) + ' = ' + fmt(ni) + '.',
                        'Ending retained earnings = ' + fmt(p.begRE) + ' + ' + fmt(ni) + ' − ' + fmt(p.dividends) + ' = ' + fmt(endRE) + '.'
                    ]
                };
            },
            solution: ['Press “New numbers” for fresh figures. Net income = revenue − expenses; ending RE = beginning RE + net income − dividends.']
        },

        // ===================== CHAPTER 13 — ANNUAL REPORTS, SEC & SARBANES-OXLEY (K2) =====================
        // Source: Cote workbook Assignment 13-1 (terminology). Reframed fill-ins as multiple choice; all are
        // universal facts (SOX, SEC, Form 10-K, audit opinion types, consolidated statements).

        // --- B3.11: Ch13 annual reports / SOX / SEC / audit opinions (MC) ---
        {
            id: 'k2-ch13-annual-reports',
            lesson: 'second-midterm',
            chapter: 13,
            type: 'choice',
            title: 'Annual Reports, the SEC & Sarbanes-Oxley',
            prompt: 'Choose the best answer for each statement about annual reports, regulation, and the auditor’s report.',
            difficulty: 2,
            items: [
                { q: 'Which law improved financial reporting by public companies and added criminal provisions for management and the public accounting firm?', kind: 'mc', options: ['Securities Act of 1933', 'Sarbanes-Oxley Act', 'Dodd-Frank Act', 'Internal Revenue Code'], answer: 1 },
                { q: 'Which government agency protects investors and maintains the integrity of the securities markets?', kind: 'mc', options: ['FASB', 'IRS', 'SEC', 'FDIC'], answer: 2 },
                { q: 'Which form is the official annual report filed with the SEC?', kind: 'mc', options: ['Form 1040', 'Form 10-K', 'Form W-2', 'Form 8-K'], answer: 1 },
                { q: 'An auditor’s report on statements that conform to GAAP with no exceptions gives which opinion?', kind: 'mc', options: ['Qualified', 'Unqualified (clean)', 'Adverse', 'Disclaimer'], answer: 1 },
                { q: 'When the statements conform to GAAP but the report contains an “except for” clause, the opinion is:', kind: 'mc', options: ['Unqualified', 'Qualified', 'Adverse', 'Disclaimer'], answer: 1 },
                { q: 'When the auditor’s work has been impeded by management or staff (a scope limitation), the result is a(n):', kind: 'mc', options: ['Unqualified opinion', 'Qualified opinion', 'Adverse opinion', 'Disclaimer of opinion'], answer: 3 },
                { q: 'Statements that combine the financial data of a corporation and its controlled companies into a single entity are called:', kind: 'mc', options: ['Comparative statements', 'Consolidated statements', 'Common-size statements', 'Interim statements'], answer: 1 },
                { q: 'Section 404 of the Sarbanes-Oxley Act requires an assessment of the company’s:', kind: 'mc', options: ['dividend policy', 'internal control system', 'marketing plan', 'inventory method'], answer: 1 }
            ],
            solution: [
                'Sarbanes-Oxley (2002) tightened public-company reporting and added criminal provisions; the SEC regulates the securities markets.',
                'The Form 10-K is the official annual report filed with the SEC.',
                'Audit opinions: unqualified (clean), qualified (“except for”), adverse (not fairly stated), disclaimer (scope impeded).',
                'Consolidated statements combine a parent and its controlled subsidiaries; SOX §404 covers internal control.'
            ]
        },

        // ===================== CHAPTER 14 — COMPUTERISED ACCOUNTING, POS & CARDS (K2) =====================
        // Source: Cote workbook Assignment 14-1 (multiple choice) — verbatim items/answers.

        // --- B3.11: Ch14 computerised accounting / POS / credit cards (MC) ---
        {
            id: 'k2-ch14-computerised',
            lesson: 'second-midterm',
            chapter: 14,
            type: 'choice',
            title: 'Computerised Accounting, POS & Credit Cards',
            prompt: 'Choose the best answer.',
            difficulty: 1,
            items: [
                { q: 'A very important person in a hospitality business is the:', kind: 'mc', options: ['customer', 'computer expert', 'chef', 'menu designer'], answer: 0 },
                { q: 'A merchant account provider may be a(n):', kind: 'mc', options: ['bank', 'independent sales organization', 'vendor', 'any of the above'], answer: 3 },
                { q: 'A merchant account is a:', kind: 'mc', options: ['bank account', 'loan account', 'special account to process credit cards', 'special account to pay bills'], answer: 2 },
                { q: 'Credit card fraud entails more risk on the Internet because:', kind: 'mc', options: ['transactions are “card not present” transactions', 'transactions are processed quickly', 'chargebacks occur', 'there is no software to flag fraudulent transactions'], answer: 0 },
                { q: 'A point-of-sale (POS) system may have the capability to:', kind: 'mc', options: ['process credit cards', 'provide check guarantee services', 'process order entries', 'all of the above'], answer: 3 },
                { q: 'Which of the following is a component of a point-of-sale system?', kind: 'mc', options: ['check reader', 'card swipe terminal', 'pole display device', 'all of the above'], answer: 3 }
            ],
            solution: [
                'The customer is the most important person in a hospitality business.',
                'A merchant account (provided by a bank, ISO, or vendor) is a special account used to process credit cards.',
                'Internet card fraud is higher because transactions are “card not present.”',
                'A POS system can process cards, guarantee checks, and handle order entry; its components include check readers, card-swipe terminals, and pole displays.'
            ]
        },

        // ===================== CHAPTER 15 — COST BEHAVIOUR & BREAK-EVEN (K2) =====================
        // Source: Cote workbook Assignment 15-1 (multiple choice). Item 6 reworded to a single clear answer.

        // --- B3.11: Ch15 cost behaviour & break-even (MC) ---
        {
            id: 'k2-ch15-breakeven',
            lesson: 'second-midterm',
            chapter: 15,
            type: 'choice',
            title: 'Cost Behaviour & Break-Even',
            prompt: 'Choose the best answer about cost behaviour, forecasting, and the break-even point.',
            difficulty: 2,
            items: [
                { q: 'Which of the following should be analyzed when forecasting sales for a new or existing restaurant?', kind: 'mc', options: ['customer profile', 'competitors’ profiles', 'menu mix and menu pricing', 'all of the above'], answer: 3 },
                { q: 'Which of the following formulas is INCORRECT?', kind: 'mc', options: ['Rooms × occupancy % × average room rate × days open = rooms sales', 'Seats × turnover × average food check × days open = food sales', 'Total cost = fixed cost + variable cost', 'Break-even point = fixed costs ÷ variable cost %'], answer: 3 },
                { q: 'A variable expense:', kind: 'mc', options: ['is an incremental expense', 'has a percentage relationship to sales that remains constant', 'is zero if volume is zero', 'all of the above'], answer: 3 },
                { q: 'A fixed expense:', kind: 'mc', options: ['is an incremental expense', 'has a percentage relationship to sales that remains constant', 'is zero if volume is zero', 'none of the above'], answer: 3 },
                { q: 'A semi-variable expense:', kind: 'mc', options: ['does not have a predictable relationship to sales', 'consists of a fixed component and a variable component', 'has a percentage relationship to sales that is meaningless', 'all of the above'], answer: 1 },
                { q: 'The break-even point is the level of sales at which:', kind: 'mc', options: ['net income is zero', 'a profit target is reached', 'fixed costs are zero', 'variable costs are zero'], answer: 0 }
            ],
            solution: [
                'Forecasting sales considers the customer profile, competitors, and the menu mix/pricing.',
                'Break-even = fixed costs ÷ contribution-margin % (1 − variable-cost %), NOT ÷ variable-cost % — so that formula is incorrect.',
                'A variable expense is incremental, keeps a constant % of sales, and is zero at zero volume; a fixed expense is none of these.',
                'A semi-variable expense has both a fixed and a variable component; break-even is where net income is zero.'
            ]
        },

        // ===================== CHAPTER 16 — INTERNAL CONTROL OF CASH (K2) =====================
        // Source: Cote workbook Assignment 16-1 (True/False). Kept the items with clear, universal answers
        // (dropped a couple of ambiguously worded ones).

        // --- B3.11: Ch16 internal control of cash (TF) ---
        {
            id: 'k2-ch16-internal-control',
            lesson: 'second-midterm',
            chapter: 16,
            type: 'choice',
            title: 'Internal Control of Cash',
            prompt: 'Mark each statement true or false.',
            difficulty: 2,
            items: [
                { q: 'Internal control includes safeguarding and maintaining the company’s assets.', kind: 'tf', answer: true },
                { q: 'Collusion occurs when two or more employees conspire to commit a dishonest act.', kind: 'tf', answer: true },
                { q: 'Bonding employees (theft insurance) will stop collusion.', kind: 'tf', answer: false },
                { q: 'Customer checks received by mail should go directly to the accounts receivable clerk for immediate processing.', kind: 'tf', answer: false },
                { q: 'House banks should be kept on the imprest (fixed-amount) system.', kind: 'tf', answer: true },
                { q: 'The daily cashier’s report reconciles the register readings with the cash in the drawer.', kind: 'tf', answer: true },
                { q: 'The person who issues checks should also prepare the bank reconciliation.', kind: 'tf', answer: false },
                { q: 'A deposit in transit has been recorded by the company but not yet processed by the bank.', kind: 'tf', answer: true },
                { q: 'Internal control is concerned only with cash receipts and cash disbursements.', kind: 'tf', answer: false },
                { q: 'House funds should be subject to surprise audits (counts).', kind: 'tf', answer: true },
                { q: 'A bank reconciliation is an internal control document.', kind: 'tf', answer: true },
                { q: 'On a bank reconciliation, an unrecorded NSF check is added to the balance per books.', kind: 'tf', answer: false }
            ],
            solution: [
                'Internal control safeguards all assets (not just cash) and relies on segregation of duties.',
                'Collusion = two or more people conspiring; bonding is insurance and does not prevent it.',
                'Segregation of duties: the person handling/recording receipts or issuing checks should not also reconcile the bank.',
                'A deposit in transit is on the books but not yet at the bank; an NSF check is SUBTRACTED from the balance per books.'
            ]
        }
    ]
};

if (typeof window !== 'undefined') window.accountingExercises = accountingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = accountingExercises;
