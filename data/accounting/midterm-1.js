// ===== ACCOUNTING — Midterm 1 (K1, Chapters 1–6) =====
// Izvor: Cote, "Hotel and Restaurant Accounting" (7th ed., AHLEI), Ch 1–6 + silabus FMTU.
// Oblik po docs/CONTENT_SCHEMA.md. Pokreni `npm run verify` nakon izmjena.
// NAPOMENA: ovo je NOVI K1 teorijski sadržaj (prije restrukture predmet je imao samo ~K2).
// Kategorije (Ch1–6): intro · businessFormation · financialStatements · balanceSheet · incomeStatement · bookkeeping.

const accountingM1 = {

    // ============================= CHAPTER 1 — INTRODUCTION TO ACCOUNTING =============================
    intro: {
        name: "Introduction to Accounting",
        icon: "fa-book-open",
        color: "#059669",

        flashcards: [
            {
                question: "What is accounting?",
                answer: "Accounting is the process of recording, classifying, summarizing, and reporting an organization's financial transactions so users can make informed economic decisions.",
                explanation: "Often called the \"language of business.\""
            },
            {
                question: "What is the difference between financial and managerial accounting?",
                answer: "• Financial accounting — prepares general-purpose statements for EXTERNAL users (owners, lenders, tax authorities); follows GAAP.\n• Managerial accounting — prepares detailed reports for INTERNAL management (budgets, forecasts, cost analysis); not bound by GAAP.",
                explanation: "External vs internal users is the key distinction."
            },
            {
                question: "What is the accounting equation?",
                answer: "Assets = Liabilities + Owners' Equity (A = L + E).\nIt must ALWAYS stay in balance after every transaction.",
                explanation: "The foundation of double-entry accounting."
            },
            {
                question: "What are the five account classifications?",
                answer: "1. Assets — what the business owns\n2. Liabilities — what the business owes\n3. Owners' Equity — owners' claim on assets\n4. Revenue — income earned from operations\n5. Expenses — costs incurred to earn revenue",
                explanation: "Every account belongs to one of these five categories."
            },
            {
                question: "What is double-entry accounting?",
                answer: "A system in which every transaction affects at least two accounts, and total debits always equal total credits, keeping the accounting equation in balance.",
                explanation: "Debits = Credits for every entry."
            },
            {
                question: "What does GAAP stand for and why does it matter?",
                answer: "GAAP = Generally Accepted Accounting Principles.\nThey are the common rules, standards, and conventions that make financial statements consistent, comparable, and reliable across companies.",
                explanation: "Standardization lets users compare different businesses."
            },
            {
                question: "What is the business entity assumption?",
                answer: "The business is treated as a separate economic unit, distinct from its owner(s). The owner's personal transactions are kept separate from the business's records.",
                explanation: "Owner and business are accounted for separately."
            },
            {
                question: "What is the going concern assumption?",
                answer: "Accountants assume the business will continue operating into the foreseeable future and is not about to be liquidated. This justifies recording assets at cost rather than liquidation value.",
                explanation: "Supports the cost principle."
            },
            {
                question: "What is the cost (historical cost) principle?",
                answer: "Assets are recorded at their original purchase price (cost), not at current market value, because cost is objective and verifiable.",
                explanation: "Reliability over current market estimates."
            },
            {
                question: "What is the matching principle?",
                answer: "Expenses are recorded in the same period as the revenues they help generate, so net income reflects the true result of operations for that period.",
                explanation: "Match expenses to the revenue they produce."
            },
            {
                question: "What is the monetary unit assumption?",
                answer: "Only transactions that can be expressed in money (a stable currency, e.g. US dollars) are recorded. It also assumes the currency's purchasing power is reasonably stable.",
                explanation: "Money is the common measuring unit."
            },
            {
                question: "What is the conservatism principle?",
                answer: "When uncertain, accountants choose the method least likely to overstate assets or income — anticipate possible losses, but not possible gains.",
                explanation: "Don't overstate the rosy picture."
            },
            {
                question: "What is the difference between accounting income and taxable income?",
                answer: "Accounting income is net income computed under GAAP for financial reporting. Taxable income is computed under tax law (IRS rules) to determine income tax owed. The two often differ (e.g., different depreciation methods).",
                explanation: "GAAP rules ≠ tax rules."
            },
            {
                question: "What is a CPA?",
                answer: "A Certified Public Accountant — an accountant licensed by a state after passing the uniform CPA exam and meeting education/experience requirements. CPAs can audit financial statements and express an independent opinion.",
                explanation: "Licensed professionals who can audit."
            },
            {
                question: "What do the bodies SEC, IRS, FASB and AICPA do?",
                answer: "• SEC — Securities and Exchange Commission: regulates public companies and securities markets.\n• IRS — Internal Revenue Service: administers federal tax law.\n• FASB — Financial Accounting Standards Board: sets GAAP.\n• AICPA — American Institute of CPAs: professional body for CPAs.",
                explanation: "Regulators and standard-setters."
            },
            {
                question: "What are HFTP, AH&LA and NRA?",
                answer: "Hospitality-industry organizations:\n• HFTP — Hospitality Financial and Technology Professionals\n• AH&LA — American Hotel & Lodging Association\n• NRA — National Restaurant Association\nThey support uniform systems of accounts (e.g., USALI) for the industry.",
                explanation: "Industry bodies behind the uniform systems of accounts."
            }
        ],

        quiz: [
            {
                question: "Accounting is often called the:",
                options: ["Language of business", "Science of money", "Art of selling", "Theory of value"],
                correct: 0
            },
            {
                question: "The accounting equation is:",
                options: ["Assets = Revenue − Expenses", "Assets = Liabilities + Owners' Equity", "Equity = Assets + Liabilities", "Liabilities = Assets + Equity"],
                correct: 1
            },
            {
                question: "Which is NOT one of the five account classifications?",
                options: ["Assets", "Liabilities", "Dividends", "Revenue"],
                correct: 2
            },
            {
                question: "Financial accounting is prepared primarily for:",
                options: ["Internal managers", "External users", "Employees only", "The marketing team"],
                correct: 1
            },
            {
                question: "GAAP stands for:",
                options: ["General Accounting and Auditing Procedures", "Generally Accepted Accounting Principles", "Global Accounting Application Policy", "Government Approved Accounting Practices"],
                correct: 1
            },
            {
                question: "Treating the business as separate from its owner is the:",
                options: ["Going concern assumption", "Matching principle", "Business entity assumption", "Conservatism principle"],
                correct: 2
            },
            {
                question: "Recording assets at their purchase price reflects the:",
                options: ["Cost principle", "Market principle", "Revenue principle", "Full disclosure principle"],
                correct: 0
            },
            {
                question: "Matching expenses to the revenues they generate is the:",
                options: ["Monetary unit assumption", "Matching principle", "Going concern assumption", "Materiality principle"],
                correct: 1
            },
            {
                question: "Under double-entry accounting, each transaction affects at least:",
                options: ["One account", "Two accounts", "Three accounts", "Five accounts"],
                correct: 1
            },
            {
                question: "Which body sets GAAP in the United States?",
                options: ["IRS", "SEC", "FASB", "NRA"],
                correct: 2
            },
            {
                question: "The going concern assumption states that the business:",
                options: ["Will be sold soon", "Will continue operating into the foreseeable future", "Reports only in cash", "Has no liabilities"],
                correct: 1
            },
            {
                question: "Accounting income and taxable income:",
                options: ["Are always identical", "Often differ because GAAP and tax rules differ", "Cannot both be calculated", "Are set by the marketing department"],
                correct: 1
            },
            {
                question: "A CPA is authorized to:",
                options: ["Set tax rates", "Audit financial statements and give an independent opinion", "Print currency", "Approve loans for any bank"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "The accounting equation is Assets = Liabilities + Owners' _______.", answer: "Equity", hint: "Owners' claim on assets" },
            { sentence: "_______ accounting prepares reports for external users following GAAP.", answer: "Financial", hint: "External, not internal" },
            { sentence: "_______ accounting serves internal management with budgets and forecasts.", answer: "Managerial", hint: "Internal decision-making" },
            { sentence: "GAAP stands for Generally Accepted Accounting _______.", answer: "Principles", hint: "The common rules" },
            { sentence: "The _______ entity assumption keeps the owner's personal affairs separate from the business.", answer: "business", hint: "Separate economic unit" },
            { sentence: "The _______ principle records assets at their original purchase price.", answer: "cost", hint: "Historical, not market" },
            { sentence: "The _______ principle records expenses in the same period as the revenue they generate.", answer: "matching", hint: "Pair cost with revenue" },
            { sentence: "Under double-entry accounting, total debits must equal total _______.", answer: "credits", hint: "Other side of the entry" },
            { sentence: "The _______ board (FASB) sets GAAP in the United States.", answer: "Financial Accounting Standards", hint: "F-A-S-B" },
            { sentence: "The _______ concern assumption presumes the business will keep operating.", answer: "going", hint: "Not about to be liquidated" }
        ],

        learn: {
            title: "Introduction to Accounting",
            content: `
                <h3>📚 Chapter 1: Introduction to Accounting</h3>
                <p>Accounting is the <strong>language of business</strong>. It is the process of <strong>recording, classifying, summarizing, and reporting</strong> financial transactions so that owners, managers, lenders, and tax authorities can make informed decisions.</p>

                <hr>

                <h4>👥 Financial vs Managerial Accounting</h4>
                <ul>
                    <li><strong>Financial accounting</strong> — general-purpose statements for <strong>external</strong> users (owners, banks, investors, IRS). Must follow <strong>GAAP</strong>.</li>
                    <li><strong>Managerial accounting</strong> — detailed reports for <strong>internal</strong> management (budgets, forecasts, cost control). Not bound by GAAP.</li>
                </ul>

                <hr>

                <h4>⚖️ The Accounting Equation</h4>
                <div class="formula-box">
                    <strong>Assets = Liabilities + Owners' Equity</strong><br><br>
                    • <strong>Assets</strong> — what the business owns<br>
                    • <strong>Liabilities</strong> — what the business owes<br>
                    • <strong>Owners' Equity</strong> — owners' residual claim on the assets
                </div>
                <p>The equation must stay in balance after <em>every</em> transaction. This is enforced by <strong>double-entry accounting</strong>: every transaction touches at least two accounts and total <strong>debits = credits</strong>.</p>

                <h5>The Five Account Classifications</h5>
                <p>Every account is one of: <strong>Assets, Liabilities, Owners' Equity, Revenue, Expenses</strong>. Revenue and Expenses ultimately flow into equity through net income.</p>

                <hr>

                <h4>🏛️ GAAP — Generally Accepted Accounting Principles</h4>
                <p>GAAP are the common rules that make statements <strong>consistent, comparable, and reliable</strong>. Key assumptions and principles:</p>
                <div class="formula-box">
                    <strong>Business Entity</strong> — business is separate from its owner.<br>
                    <strong>Going Concern</strong> — business will keep operating into the future.<br>
                    <strong>Monetary Unit</strong> — only money-measurable items are recorded (stable currency).<br>
                    <strong>Cost Principle</strong> — assets recorded at original cost, not market value.<br>
                    <strong>Accrual / Matching</strong> — record revenue when earned and match expenses to it.<br>
                    <strong>Full Disclosure</strong> — report anything that would affect a user's decision.<br>
                    <strong>Conservatism</strong> — when unsure, don't overstate assets or income.
                </div>

                <hr>

                <h4>🏢 Who Regulates Accounting?</h4>
                <ul>
                    <li><strong>SEC</strong> — Securities and Exchange Commission (regulates public companies).</li>
                    <li><strong>FASB</strong> — Financial Accounting Standards Board (sets GAAP).</li>
                    <li><strong>IRS</strong> — Internal Revenue Service (tax law).</li>
                    <li><strong>AICPA</strong> — American Institute of CPAs (professional body).</li>
                </ul>
                <p>Hospitality-specific bodies — <strong>HFTP, AH&amp;LA, NRA</strong> — support the industry's <em>uniform systems of accounts</em> (e.g., USALI for lodging).</p>

                <div class="example-box">
                    <h4>📝 Accounting Income vs Taxable Income</h4>
                    <p>Net income on the income statement (GAAP) often differs from <strong>taxable income</strong> (IRS rules) — for example, the two can use different depreciation methods. Both are legitimate; they simply serve different purposes.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Accounting = record, classify, summarize, report financial information.</li>
                        <li>A = L + E must always balance (double-entry: debits = credits).</li>
                        <li>Five classifications: Assets, Liabilities, Equity, Revenue, Expenses.</li>
                        <li>GAAP (set by FASB) makes statements comparable and reliable.</li>
                        <li>Accounting income (GAAP) ≠ taxable income (tax law).</li>
                    </ul>
                </div>
            `
        }
    },

    // ============================= CHAPTER 2 — BUSINESS FORMATION =============================
    businessFormation: {
        name: "Business Formation",
        icon: "fa-building",
        color: "#0ea5e9",

        flashcards: [
            {
                question: "What is a feasibility study?",
                answer: "An analysis performed BEFORE starting a business to determine whether the proposed venture is practical and likely to succeed — examining the market, location, costs, financing, and projected profitability.",
                explanation: "Done before committing capital to a new venture."
            },
            {
                question: "What are the main forms of business organization?",
                answer: "1. Sole proprietorship — one owner\n2. Partnership — two or more owners\n3. Corporation — separate legal entity owned by stockholders\n4. LLC (Limited Liability Company) — hybrid of partnership and corporation",
                explanation: "Each differs in liability, taxation, and ability to raise capital."
            },
            {
                question: "What is a sole proprietorship?",
                answer: "A business owned by one person. It is easy and inexpensive to form, but the owner has UNLIMITED personal liability for business debts, and the business is not a separate legal entity from the owner.",
                explanation: "Simplest form; owner and business are legally one."
            },
            {
                question: "What is unlimited liability?",
                answer: "The owner is personally responsible for all debts of the business. Creditors can pursue the owner's personal assets (home, savings) if the business cannot pay.",
                explanation: "Applies to proprietorships and general partners."
            },
            {
                question: "What is a partnership and what is mutual agency?",
                answer: "A partnership is a business owned by two or more people under a partnership agreement. Mutual agency means each partner can bind the partnership to contracts, and partners share unlimited liability.",
                explanation: "Each partner acts as an agent of the partnership."
            },
            {
                question: "What is a corporation?",
                answer: "A separate legal entity, created under state law, owned by stockholders. It can own property, sue and be sued, and continue indefinitely (perpetual life), independent of its owners.",
                explanation: "A 'legal person' distinct from its owners."
            },
            {
                question: "What is limited liability?",
                answer: "Stockholders of a corporation can lose only the amount they invested; their personal assets are protected from the corporation's debts.",
                explanation: "A major advantage of the corporate form."
            },
            {
                question: "What is double taxation of corporations?",
                answer: "Corporate profits are taxed twice: first the corporation pays income tax on its profits, then stockholders pay personal income tax on the dividends they receive.",
                explanation: "A key disadvantage of the corporate form."
            },
            {
                question: "What is a Limited Liability Company (LLC)?",
                answer: "A hybrid form that gives owners the LIMITED LIABILITY of a corporation while keeping the PASS-THROUGH taxation of a partnership (profits taxed only once, on the owners' returns).",
                explanation: "Best of both worlds: protection + single taxation."
            },
            {
                question: "What is the difference between authorized, issued, and outstanding shares?",
                answer: "• Authorized — maximum shares the charter permits the corporation to issue.\n• Issued — shares actually sold to investors.\n• Outstanding — issued shares still held by investors (issued minus treasury stock).\nAuthorized ≥ Issued ≥ Outstanding.",
                explanation: "Treasury stock is the gap between issued and outstanding."
            },
            {
                question: "What is par value?",
                answer: "A nominal, arbitrary value assigned to each share in the corporate charter. It is a legal/accounting amount and usually has little relation to the stock's market value.",
                explanation: "Par is set in the charter; market price floats."
            },
            {
                question: "What is Additional Paid-In Capital (APIC)?",
                answer: "The amount investors pay for stock ABOVE its par value. If a $1-par share sells for $11, then $1 goes to Common Stock and $10 goes to Additional Paid-In Capital.",
                explanation: "The premium over par."
            },
            {
                question: "What is the difference between common and preferred stock?",
                answer: "• Common stock — basic ownership; carries voting rights; dividends not guaranteed.\n• Preferred stock — priority over common for dividends and in liquidation; usually fixed dividend and no voting rights.",
                explanation: "Preferred gets paid first; common usually votes."
            },
            {
                question: "What is treasury stock?",
                answer: "A corporation's own shares that it has issued and later reacquired (bought back) but not retired. Treasury stock has no voting rights and earns no dividends.",
                explanation: "Reduces outstanding shares and total equity."
            },
            {
                question: "What is a franchise?",
                answer: "A contractual arrangement in which a franchisor grants a franchisee the right to use its brand name, products, and operating system. The franchisee typically pays an initial franchise fee plus ongoing royalties.",
                explanation: "Common in hospitality (hotel and restaurant chains)."
            }
        ],

        quiz: [
            {
                question: "A study done before starting a business to assess its viability is a:",
                options: ["Bank reconciliation", "Feasibility study", "Trial balance", "Tax return"],
                correct: 1
            },
            {
                question: "Which form has a single owner with unlimited liability?",
                options: ["Corporation", "LLC", "Sole proprietorship", "Cooperative"],
                correct: 2
            },
            {
                question: "A separate legal entity owned by stockholders is a:",
                options: ["Partnership", "Corporation", "Sole proprietorship", "Franchise"],
                correct: 1
            },
            {
                question: "The main advantage of the corporate form is:",
                options: ["No taxes", "Limited liability for stockholders", "No regulation", "One owner only"],
                correct: 1
            },
            {
                question: "Double taxation means corporate profits are taxed:",
                options: ["Once, on the owner", "Twice — at the corporation and again as dividends", "Never", "Only by the state"],
                correct: 1
            },
            {
                question: "An LLC combines limited liability with:",
                options: ["Double taxation", "Pass-through (single) taxation", "No liability protection", "Unlimited shares"],
                correct: 1
            },
            {
                question: "The maximum number of shares a corporation may issue is the number of shares that are:",
                options: ["Outstanding", "Issued", "Authorized", "Treasury"],
                correct: 2
            },
            {
                question: "Outstanding shares equal issued shares minus:",
                options: ["Authorized shares", "Treasury shares", "Preferred shares", "Par value"],
                correct: 1
            },
            {
                question: "The arbitrary nominal value assigned to a share in the charter is its:",
                options: ["Market value", "Book value", "Par value", "Fair value"],
                correct: 2
            },
            {
                question: "Amounts paid for stock above par value are recorded as:",
                options: ["Retained earnings", "Additional Paid-In Capital", "Treasury stock", "Revenue"],
                correct: 1
            },
            {
                question: "Which stock usually has priority for dividends but no voting rights?",
                options: ["Common stock", "Preferred stock", "Treasury stock", "Authorized stock"],
                correct: 1
            },
            {
                question: "A franchisee typically pays the franchisor:",
                options: ["Only taxes", "An initial fee plus ongoing royalties", "Nothing", "A one-time dividend"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "A _______ study is performed before starting a business to assess its viability.", answer: "feasibility", hint: "Is it practical / will it succeed?" },
            { sentence: "A sole proprietor has _______ liability for the debts of the business.", answer: "unlimited", hint: "Personal assets at risk" },
            { sentence: "A _______ is a separate legal entity owned by stockholders.", answer: "corporation", hint: "A 'legal person'" },
            { sentence: "Stockholders enjoy _______ liability, risking only what they invested.", answer: "limited", hint: "Opposite of unlimited" },
            { sentence: "Corporate profits face _______ taxation — at the corporation and again as dividends.", answer: "double", hint: "Taxed twice" },
            { sentence: "An _______ combines limited liability with pass-through taxation.", answer: "LLC", hint: "Limited Liability Company" },
            { sentence: "Authorized ≥ Issued ≥ _______ shares.", answer: "Outstanding", hint: "Still held by investors" },
            { sentence: "The nominal amount assigned to a share in the charter is its _______ value.", answer: "par", hint: "Not market value" },
            { sentence: "Amounts received above par are recorded as Additional _______ Capital.", answer: "Paid-In", hint: "APIC" },
            { sentence: "_______ stock is a company's own shares that it has bought back.", answer: "Treasury", hint: "Reacquired shares" }
        ],

        learn: {
            title: "Business Formation",
            content: `
                <h3>🏢 Chapter 2: Business Formation</h3>
                <p>Before opening, an entrepreneur performs a <strong>feasibility study</strong> — analyzing market demand, location, start-up costs, financing, and projected profit to decide whether the venture is worth pursuing.</p>

                <hr>

                <h4>📋 Forms of Business Organization</h4>
                <div class="formula-box">
                    <strong>Sole Proprietorship</strong> — one owner; easy &amp; cheap to form; <strong>unlimited liability</strong>; not a separate legal entity; taxed on the owner's personal return.<br><br>
                    <strong>Partnership</strong> — two or more owners under an agreement; <strong>mutual agency</strong>; unlimited liability for general partners; pass-through taxation.<br><br>
                    <strong>Corporation</strong> — separate legal entity owned by stockholders; <strong>limited liability</strong>; perpetual life; can raise capital by selling stock; <strong>double taxation</strong>; more regulation.<br><br>
                    <strong>LLC</strong> — hybrid: limited liability of a corporation + pass-through (single) taxation of a partnership.
                </div>

                <div class="example-box">
                    <h4>📝 Liability in Plain English</h4>
                    <p><strong>Unlimited liability</strong>: if the business can't pay, creditors can take the owner's personal home and savings.<br>
                    <strong>Limited liability</strong>: stockholders can lose only what they invested — personal assets are protected.</p>
                </div>

                <hr>

                <h4>📈 Corporate Stock</h4>
                <p>A corporation raises capital by issuing <strong>shares of stock</strong>. Three share counts matter:</p>
                <div class="formula-box">
                    <strong>Authorized</strong> ≥ <strong>Issued</strong> ≥ <strong>Outstanding</strong><br><br>
                    • <strong>Authorized</strong> — maximum the charter allows.<br>
                    • <strong>Issued</strong> — actually sold to investors.<br>
                    • <strong>Outstanding</strong> — issued shares still in investors' hands (Issued − Treasury).
                </div>

                <h5>Par Value and APIC</h5>
                <p><strong>Par value</strong> is an arbitrary amount in the charter, unrelated to market price. When stock sells above par, the excess is <strong>Additional Paid-In Capital (APIC)</strong>.</p>
                <div class="example-box">
                    <h4>📝 Example</h4>
                    <p>1,000 shares of $1-par common stock sell for $11 each ($11,000 total):</p>
                    <p>• Common Stock = 1,000 × $1 = <strong>$1,000</strong><br>
                    • Additional Paid-In Capital = 1,000 × $10 = <strong>$10,000</strong></p>
                </div>

                <h5>Common vs Preferred Stock</h5>
                <ul>
                    <li><strong>Common stock</strong> — basic ownership, voting rights, dividends not guaranteed.</li>
                    <li><strong>Preferred stock</strong> — priority for dividends and in liquidation; usually a fixed dividend and no vote.</li>
                    <li><strong>Treasury stock</strong> — the company's own reacquired shares (no vote, no dividend).</li>
                </ul>

                <hr>

                <h4>🍔 Franchising in Hospitality</h4>
                <p>A <strong>franchise</strong> lets a <em>franchisee</em> use a <em>franchisor's</em> brand and operating system in exchange for an initial <strong>franchise fee</strong> plus ongoing <strong>royalties</strong>. It is extremely common among hotel and restaurant chains.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Forms: proprietorship, partnership, corporation, LLC — differ in liability &amp; taxation.</li>
                        <li>Corporation = limited liability + double taxation; LLC = limited liability + single taxation.</li>
                        <li>Authorized ≥ Issued ≥ Outstanding; Treasury = issued shares bought back.</li>
                        <li>Par value is arbitrary; amounts above par = Additional Paid-In Capital.</li>
                        <li>Preferred stock gets dividends first; common stock usually votes.</li>
                    </ul>
                </div>
            `
        }
    },

    // ===================== CHAPTER 3 — SURVEY OF FINANCIAL STATEMENTS =====================
    financialStatements: {
        name: "Survey of Financial Statements",
        icon: "fa-file-invoice-dollar",
        color: "#6366f1",

        flashcards: [
            {
                question: "What are the four basic financial statements?",
                answer: "1. Income Statement — revenues and expenses over a period\n2. Statement of Owners' (Retained) Earnings — changes in equity\n3. Balance Sheet — assets, liabilities, equity at a point in time\n4. Statement of Cash Flows — cash inflows and outflows",
                explanation: "Together they describe performance and financial position."
            },
            {
                question: "In what order are the financial statements prepared?",
                answer: "1. Income Statement (compute net income)\n2. Statement of Retained Earnings (uses net income)\n3. Balance Sheet (uses ending retained earnings)\n4. Statement of Cash Flows",
                explanation: "Each statement feeds the next — this is called articulation."
            },
            {
                question: "What does the income statement report?",
                answer: "It reports REVENUES earned and EXPENSES incurred over a PERIOD of time, and the resulting net income (or net loss). Also called the profit and loss (P&L) statement.",
                explanation: "Performance over a period."
            },
            {
                question: "What does the balance sheet report?",
                answer: "It reports a company's ASSETS, LIABILITIES, and OWNERS' EQUITY at a single POINT in time, and must satisfy A = L + E.",
                explanation: "A snapshot of financial position."
            },
            {
                question: "Which statements cover a period of time and which a point in time?",
                answer: "• Period of time — Income Statement, Statement of Retained Earnings, Statement of Cash Flows.\n• Point in time — Balance Sheet (a snapshot on a specific date).",
                explanation: "Only the balance sheet is a single-date snapshot."
            },
            {
                question: "What is the basic structure of a hospitality income statement?",
                answer: "Revenue (Sales)\n− Cost of Sales\n= Gross Profit\n− Operating Expenses\n= Operating Income\n− Fixed Charges (rent, depreciation, interest, taxes)\n= Net Income",
                explanation: "Revenue minus successive layers of cost."
            },
            {
                question: "What is gross profit?",
                answer: "Gross Profit = Revenue − Cost of Sales (cost of goods/food sold). It is profit before operating expenses and fixed charges.",
                explanation: "The first profit subtotal on the income statement."
            },
            {
                question: "What are fixed charges (capital costs)?",
                answer: "Costs that do not vary with sales volume — typically rent, depreciation, interest, insurance, property taxes. They are subtracted after operating income to reach net income.",
                explanation: "Also called occupancy or capital costs."
            },
            {
                question: "What is net income?",
                answer: "Net Income = Total Revenues − Total Expenses for the period. It is the 'bottom line' that flows into retained earnings.",
                explanation: "A negative result is a net loss."
            },
            {
                question: "What does the statement of retained earnings show?",
                answer: "Beginning Retained Earnings + Net Income − Dividends = Ending Retained Earnings. It links the income statement to the balance sheet.",
                explanation: "For a proprietorship, the equivalent uses owner's capital and withdrawals."
            },
            {
                question: "What are retained earnings?",
                answer: "The cumulative net income a corporation has earned and kept (not distributed as dividends) since it began operating.",
                explanation: "Earnings 'retained' in the business."
            },
            {
                question: "What does the statement of cash flows report?",
                answer: "It reports cash inflows and outflows during the period, grouped into three activities: OPERATING, INVESTING, and FINANCING.",
                explanation: "Explains how the cash balance changed."
            },
            {
                question: "What is the difference between a fiscal year and a calendar year?",
                answer: "A calendar year ends December 31. A fiscal year is any 12-month accounting period a business chooses (e.g., July 1–June 30), often ending in a slow season.",
                explanation: "Many hospitality firms pick a fiscal year off their peak season."
            },
            {
                question: "What are interim financial statements?",
                answer: "Statements prepared for periods shorter than a year (monthly or quarterly) to give managers and owners timely information between annual reports.",
                explanation: "More frequent than the annual statements."
            }
        ],

        quiz: [
            {
                question: "Which statement reports financial position at a single point in time?",
                options: ["Income statement", "Balance sheet", "Statement of cash flows", "Statement of retained earnings"],
                correct: 1
            },
            {
                question: "Which statement is prepared FIRST?",
                options: ["Balance sheet", "Statement of cash flows", "Income statement", "Statement of retained earnings"],
                correct: 2
            },
            {
                question: "Gross profit equals:",
                options: ["Revenue − Operating expenses", "Revenue − Cost of sales", "Revenue − Net income", "Assets − Liabilities"],
                correct: 1
            },
            {
                question: "Net income is computed as:",
                options: ["Assets − Liabilities", "Total revenues − Total expenses", "Cash in − Cash out", "Revenue − Cost of sales"],
                correct: 1
            },
            {
                question: "Ending retained earnings =",
                options: ["Beginning RE + Net income − Dividends", "Beginning RE − Net income + Dividends", "Assets − Liabilities", "Revenue − Expenses"],
                correct: 0
            },
            {
                question: "Rent, depreciation, and interest are examples of:",
                options: ["Cost of sales", "Revenue", "Fixed charges", "Current assets"],
                correct: 2
            },
            {
                question: "The statement of cash flows groups cash into which three activities?",
                options: ["Sales, Costs, Profit", "Operating, Investing, Financing", "Assets, Liabilities, Equity", "Past, Present, Future"],
                correct: 1
            },
            {
                question: "A 12-month period ending other than December 31 is a:",
                options: ["Calendar year", "Fiscal year", "Interim period", "Tax day"],
                correct: 1
            },
            {
                question: "Monthly or quarterly statements are called:",
                options: ["Annual statements", "Interim statements", "Pro forma statements", "Closing statements"],
                correct: 1
            },
            {
                question: "The income statement is also known as the:",
                options: ["Balance sheet", "Profit and loss (P&L) statement", "Trial balance", "Cash book"],
                correct: 1
            },
            {
                question: "Retained earnings represent:",
                options: ["Cash on hand", "Cumulative net income kept in the business", "Total assets", "Unpaid bills"],
                correct: 1
            },
            {
                question: "Net income from the income statement flows into:",
                options: ["Cost of sales", "Retained earnings", "Accounts payable", "Inventory"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "The _______ sheet reports assets, liabilities, and equity at a point in time.", answer: "balance", hint: "A = L + E snapshot" },
            { sentence: "The income statement reports revenues and expenses over a _______ of time.", answer: "period", hint: "Not a single date" },
            { sentence: "Revenue − Cost of Sales = _______ Profit.", answer: "Gross", hint: "First profit subtotal" },
            { sentence: "Net Income = Total Revenues − Total _______.", answer: "Expenses", hint: "The bottom line" },
            { sentence: "Beginning RE + Net Income − Dividends = Ending Retained _______.", answer: "Earnings", hint: "What's kept in the business" },
            { sentence: "Rent, depreciation, and interest are examples of _______ charges.", answer: "fixed", hint: "Don't vary with sales" },
            { sentence: "The statement of cash flows is split into operating, investing, and _______ activities.", answer: "financing", hint: "Loans, stock, dividends" },
            { sentence: "A _______ year is any 12-month accounting period a business chooses.", answer: "fiscal", hint: "Need not end Dec 31" },
            { sentence: "_______ statements are prepared monthly or quarterly.", answer: "Interim", hint: "Shorter than a year" }
        ],

        learn: {
            title: "Survey of Financial Statements",
            content: `
                <h3>📑 Chapter 3: Survey of Financial Statements</h3>
                <p>Four financial statements work together to describe a business's performance and position.</p>

                <div class="formula-box">
                    <strong>1. Income Statement</strong> — revenues − expenses over a <em>period</em> = net income.<br>
                    <strong>2. Statement of Retained Earnings</strong> — how equity changed during the period.<br>
                    <strong>3. Balance Sheet</strong> — assets, liabilities, equity at a <em>point in time</em> (A = L + E).<br>
                    <strong>4. Statement of Cash Flows</strong> — cash in and out (operating, investing, financing).
                </div>

                <hr>

                <h4>🔗 Order of Preparation (Articulation)</h4>
                <p>The statements link together, so they are prepared in order:</p>
                <div class="example-box">
                    <p>1. <strong>Income Statement</strong> → gives <strong>net income</strong><br>
                    2. <strong>Statement of Retained Earnings</strong> → uses net income to update equity<br>
                    3. <strong>Balance Sheet</strong> → uses ending retained earnings<br>
                    4. <strong>Statement of Cash Flows</strong> → explains the change in cash</p>
                </div>

                <hr>

                <h4>💵 Hospitality Income Statement Structure</h4>
                <div class="formula-box">
                    Revenue (Sales)<br>
                    − Cost of Sales<br>
                    = <strong>Gross Profit</strong><br>
                    − Operating Expenses<br>
                    = <strong>Operating Income</strong><br>
                    − Fixed Charges (rent, depreciation, interest, taxes)<br>
                    = <strong>Net Income</strong>
                </div>
                <p>Each subtotal strips away another layer of cost — from total revenue down to the bottom-line net income.</p>

                <hr>

                <h4>📈 Retained Earnings Bridge</h4>
                <div class="formula-box">
                    Beginning Retained Earnings<br>
                    + Net Income (from the income statement)<br>
                    − Dividends<br>
                    = <strong>Ending Retained Earnings</strong> (carried to the balance sheet)
                </div>

                <hr>

                <h4>📅 Time Periods</h4>
                <ul>
                    <li><strong>Calendar year</strong> ends December 31.</li>
                    <li><strong>Fiscal year</strong> is any 12-month period the firm chooses (often ending in a slow season).</li>
                    <li><strong>Interim statements</strong> cover shorter periods (monthly, quarterly) for timely information.</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Four statements: income, retained earnings, balance sheet, cash flows.</li>
                        <li>Only the balance sheet is a point-in-time snapshot.</li>
                        <li>Income statement: Revenue − Cost of Sales = Gross Profit; minus expenses &amp; fixed charges = Net Income.</li>
                        <li>Net income → retained earnings → balance sheet equity (articulation).</li>
                        <li>Fiscal year ≠ calendar year; interim = monthly/quarterly.</li>
                    </ul>
                </div>
            `
        }
    },

    // ============================= CHAPTER 4 — BALANCE SHEET =============================
    balanceSheet: {
        name: "The Balance Sheet",
        icon: "fa-scale-balanced",
        color: "#10b981",

        flashcards: [
            {
                question: "What is a balance sheet?",
                answer: "A financial statement that lists a company's assets, liabilities, and owners' equity at a specific point in time, structured so that Assets = Liabilities + Owners' Equity.",
                explanation: "A snapshot of what a business owns and owes."
            },
            {
                question: "What is a classified balance sheet?",
                answer: "A balance sheet that groups items into categories — current vs noncurrent assets, current vs long-term liabilities, and the components of equity — to make it more useful for analysis.",
                explanation: "Classification helps assess liquidity and solvency."
            },
            {
                question: "What are current assets?",
                answer: "Assets expected to be converted to cash or used up within one year (or one operating cycle), listed in order of liquidity: cash, short-term investments, accounts receivable, inventories, and prepaid expenses.",
                explanation: "The most liquid section, listed first."
            },
            {
                question: "What are prepaid expenses and why are they assets?",
                answer: "Prepaid expenses are costs paid in advance (e.g., prepaid rent or insurance) that provide a future benefit. They are current assets until the benefit is used up, when they become expenses.",
                explanation: "Future benefit = asset now, expense later."
            },
            {
                question: "What are noncurrent (long-term) assets?",
                answer: "Assets held for more than one year: long-term investments, property &amp; equipment (land, building, furniture, equipment), and other assets such as intangibles. Property &amp; equipment is reported net of accumulated depreciation.",
                explanation: "Used over many periods, not quickly converted to cash."
            },
            {
                question: "What are current liabilities?",
                answer: "Obligations due within one year: accounts payable, sales tax payable, income tax payable, accrued expenses, advance deposits, and the current portion of long-term debt.",
                explanation: "Short-term debts the business must soon pay."
            },
            {
                question: "What are advance deposits and why are they liabilities?",
                answer: "Advance deposits are amounts guests pay before their stay or event. Because the business owes the service (or a refund), the deposit is an unearned-revenue liability until the service is provided.",
                explanation: "Cash received, but service still owed."
            },
            {
                question: "What are long-term liabilities?",
                answer: "Obligations due beyond one year, such as notes payable, mortgage payable, and bonds payable. Only the portion due within the next year is reclassified as a current liability.",
                explanation: "The non-current part of debt."
            },
            {
                question: "What makes up the owners' equity section of a corporation's balance sheet?",
                answer: "• Capital stock (common and preferred)\n• Additional Paid-In Capital\n• Retained Earnings\n− Treasury Stock (a reduction of equity)",
                explanation: "Contributed capital + earned capital, less treasury stock."
            },
            {
                question: "Why is the balance sheet a 'point in time' statement?",
                answer: "It reports balances as of one specific date (e.g., December 31), like a photograph of the business's financial position on that day.",
                explanation: "Contrast with the income statement, which covers a period."
            },
            {
                question: "What is working capital?",
                answer: "Working Capital = Current Assets − Current Liabilities. It measures the short-term liquidity available to run day-to-day operations.",
                explanation: "Positive working capital means current assets cover current debts."
            },
            {
                question: "On a balance sheet, in what order are current assets listed?",
                answer: "In order of liquidity (how quickly they become cash): Cash → Short-term investments → Accounts receivable → Inventories → Prepaid expenses.",
                explanation: "Most liquid first."
            },
            {
                question: "How is property and equipment shown on the balance sheet?",
                answer: "At cost minus accumulated depreciation, giving its 'book value' (net carrying amount). Land is not depreciated.",
                explanation: "Cost − Accumulated Depreciation = Book Value."
            },
            {
                question: "If total assets are $191,200, total liabilities $56,200, and retained earnings $80,000, what is contributed capital (common stock)?",
                answer: "Equity = Assets − Liabilities = 191,200 − 56,200 = 135,000.\nCommon stock = Equity − Retained Earnings = 135,000 − 80,000 = $55,000.",
                explanation: "The balancing figure that makes A = L + E hold."
            }
        ],

        quiz: [
            {
                question: "The balance sheet reports financial position:",
                options: ["Over a period of time", "At a specific point in time", "For the next year", "Only in cash terms"],
                correct: 1
            },
            {
                question: "Which is a current asset?",
                options: ["Building", "Land", "Accounts receivable", "Mortgage payable"],
                correct: 2
            },
            {
                question: "Prepaid rent is classified as a:",
                options: ["Liability", "Current asset", "Revenue", "Expense on the balance sheet"],
                correct: 1
            },
            {
                question: "Which is a current liability?",
                options: ["Bonds payable (due in 10 years)", "Accounts payable", "Common stock", "Land"],
                correct: 1
            },
            {
                question: "Guest advance deposits are reported as a:",
                options: ["Current asset", "Liability (unearned revenue)", "Revenue", "Component of equity"],
                correct: 1
            },
            {
                question: "Current assets are listed in order of:",
                options: ["Size", "Alphabet", "Liquidity", "Age"],
                correct: 2
            },
            {
                question: "Working capital equals:",
                options: ["Assets − Liabilities", "Current assets − Current liabilities", "Revenue − Expenses", "Cash + Inventory"],
                correct: 1
            },
            {
                question: "Property and equipment is reported at:",
                options: ["Market value", "Cost minus accumulated depreciation", "Replacement cost", "Par value"],
                correct: 1
            },
            {
                question: "Which is NOT part of corporate owners' equity?",
                options: ["Common stock", "Retained earnings", "Accounts payable", "Additional paid-in capital"],
                correct: 2
            },
            {
                question: "The current portion of long-term debt is classified as a:",
                options: ["Long-term liability", "Current liability", "Asset", "Equity item"],
                correct: 1
            },
            {
                question: "Treasury stock in the equity section:",
                options: ["Increases equity", "Reduces equity", "Is a liability", "Is revenue"],
                correct: 1
            },
            {
                question: "If assets = $250,000 and liabilities = $90,000, owners' equity =",
                options: ["$340,000", "$160,000", "$90,000", "$250,000"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "The balance sheet satisfies Assets = Liabilities + Owners' _______.", answer: "Equity", hint: "Third element of the equation" },
            { sentence: "Assets expected to become cash within a year are _______ assets.", answer: "current", hint: "Short-term" },
            { sentence: "Prepaid rent and prepaid insurance are _______ expenses (an asset).", answer: "prepaid", hint: "Paid in advance" },
            { sentence: "Accounts payable and accrued expenses are _______ liabilities.", answer: "current", hint: "Due within a year" },
            { sentence: "Guest _______ deposits are an unearned-revenue liability.", answer: "advance", hint: "Paid before the stay" },
            { sentence: "Working capital = current assets − current _______.", answer: "liabilities", hint: "Short-term obligations" },
            { sentence: "Property and equipment is shown at cost minus accumulated _______.", answer: "depreciation", hint: "Used-up portion of cost" },
            { sentence: "Current assets are listed in order of _______.", answer: "liquidity", hint: "How fast they become cash" },
            { sentence: "_______ stock reduces total owners' equity.", answer: "Treasury", hint: "Reacquired shares" }
        ],

        learn: {
            title: "The Balance Sheet",
            content: `
                <h3>⚖️ Chapter 4: The Balance Sheet</h3>
                <p>The balance sheet is a <strong>snapshot</strong> of a business on a specific date, organized around the accounting equation:</p>
                <div class="formula-box">
                    <strong>Assets = Liabilities + Owners' Equity</strong>
                </div>

                <hr>

                <h4>🏦 Assets</h4>
                <p>A <strong>classified</strong> balance sheet splits assets into two groups:</p>
                <div class="formula-box">
                    <strong>Current Assets</strong> (within 1 year, in order of liquidity):<br>
                    Cash → Short-term investments → Accounts receivable → Inventories → Prepaid expenses<br><br>
                    <strong>Noncurrent Assets</strong> (over 1 year):<br>
                    Long-term investments · Property &amp; Equipment (net of accumulated depreciation) · Other/Intangible assets
                </div>
                <div class="example-box">
                    <h4>📝 Why are prepaid expenses assets?</h4>
                    <p>Prepaid rent is a <strong>future benefit</strong> you've already paid for — so it is an asset until it is used up, at which point it becomes an expense.</p>
                </div>

                <hr>

                <h4>💳 Liabilities</h4>
                <div class="formula-box">
                    <strong>Current Liabilities</strong> (within 1 year):<br>
                    Accounts payable · Sales tax payable · Income tax payable · Accrued expenses · Advance deposits · Current portion of long-term debt<br><br>
                    <strong>Long-Term Liabilities</strong> (over 1 year):<br>
                    Notes payable · Mortgage payable · Bonds payable
                </div>
                <p><strong>Advance deposits</strong> (guest pre-payments) are liabilities because the business still owes the service or a refund.</p>

                <hr>

                <h4>👔 Owners' Equity (Corporation)</h4>
                <div class="formula-box">
                    Capital Stock (common + preferred)<br>
                    + Additional Paid-In Capital<br>
                    + Retained Earnings<br>
                    − Treasury Stock<br>
                    = <strong>Total Owners' Equity</strong>
                </div>

                <hr>

                <h4>🧮 Working Capital</h4>
                <div class="formula-box">
                    <strong>Working Capital = Current Assets − Current Liabilities</strong>
                </div>
                <p>It shows whether short-term assets are enough to cover short-term debts.</p>

                <div class="example-box">
                    <h4>📝 The Balancing Figure</h4>
                    <p>If Total Assets = $191,200, Total Liabilities = $56,200 and Retained Earnings = $80,000, then:</p>
                    <p>Equity = 191,200 − 56,200 = <strong>135,000</strong><br>
                    Common Stock = 135,000 − 80,000 = <strong>$55,000</strong> (the figure that balances A = L + E).</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Balance sheet = point-in-time snapshot; A = L + E.</li>
                        <li>Current = within one year; noncurrent = beyond one year.</li>
                        <li>Current assets listed in order of liquidity (cash first).</li>
                        <li>Property &amp; equipment shown at cost − accumulated depreciation.</li>
                        <li>Working capital = current assets − current liabilities.</li>
                    </ul>
                </div>
            `
        }
    },

    // ============================= CHAPTER 5 — INCOME STATEMENT =============================
    incomeStatement: {
        name: "The Income Statement",
        icon: "fa-chart-line",
        color: "#f59e0b",

        flashcards: [
            {
                question: "What does the income statement measure?",
                answer: "It measures the results of operations over a period — total Revenues minus total Expenses = Net Income (or Net Loss).",
                explanation: "Performance over a period of time."
            },
            {
                question: "What is the revenue recognition principle?",
                answer: "Revenue is recorded when it is EARNED (the goods are delivered or the service is provided), not necessarily when the cash is received.",
                explanation: "Earned, not collected, drives recognition."
            },
            {
                question: "Why is sales tax collected from customers NOT revenue?",
                answer: "Sales tax is collected on behalf of the government. The business owes it to the tax authority, so it is recorded as a liability (Sales Tax Payable), never as revenue.",
                explanation: "The business is just a collection agent."
            },
            {
                question: "How are tips treated by a restaurant?",
                answer: "Tips belong to employees, not the restaurant. Tips collected for staff are a liability until paid out and are not part of the restaurant's revenue.",
                explanation: "A pass-through to employees, not sales."
            },
            {
                question: "What is cost of sales (cost of goods sold)?",
                answer: "The cost of the food and beverages actually sold during the period. Revenue − Cost of Sales = Gross Profit.",
                explanation: "In restaurants, this is mainly food and beverage cost."
            },
            {
                question: "What is the difference between perpetual and periodic inventory systems?",
                answer: "• Perpetual — inventory and cost of sales are updated continuously with every purchase and sale.\n• Periodic — inventory is counted at period end; Cost of Sales = Beginning Inventory + Purchases − Ending Inventory.",
                explanation: "Perpetual = real-time; periodic = count at the end."
            },
            {
                question: "How do you compute cost of food used (periodic)?",
                answer: "Beginning Inventory + Purchases (+ transfers in − transfers out) − cost of employee/officer meals − Ending Inventory = Cost of Food Used.",
                explanation: "Adjust for transfers and meals not sold to guests."
            },
            {
                question: "Compute cost of food available and used: Beginning 8,000 + Purchases 27,445; Ending 10,060.",
                answer: "Cost of Food Available = 8,000 + 27,445 = 35,445.\nCost of Food Used = 35,445 − 10,060 = 25,385.",
                explanation: "Available minus ending inventory = used."
            },
            {
                question: "What is the difference between operating expenses and fixed charges?",
                answer: "• Operating expenses vary with and are controllable by operations (payroll, supplies, utilities, marketing).\n• Fixed charges (capital costs) do not vary with sales — rent, depreciation, interest, insurance, property tax.",
                explanation: "Controllable vs non-controllable / capital costs."
            },
            {
                question: "What is depreciation expense?",
                answer: "The portion of a long-lived asset's cost allocated to the current period as an expense on the income statement, reflecting the asset being 'used up.'",
                explanation: "Spreads an asset's cost over its useful life."
            },
            {
                question: "What is the difference between depreciation expense and accumulated depreciation?",
                answer: "• Depreciation expense — this period's depreciation, shown on the income statement.\n• Accumulated depreciation — the running total of all depreciation to date, a contra-asset that reduces property &amp; equipment on the balance sheet.",
                explanation: "One is a period flow; the other is a cumulative balance."
            },
            {
                question: "What is gross profit and how is it used in restaurants?",
                answer: "Gross Profit = Revenue − Cost of Sales. Managers watch food and beverage cost percentages (Cost of Sales ÷ Revenue) closely to protect gross profit.",
                explanation: "Cost % control is central to restaurant profitability."
            },
            {
                question: "If food sales are $100,000 and cost of food sold is $33,000, what is the food cost percentage?",
                answer: "Food Cost % = 33,000 ÷ 100,000 = 33%.",
                explanation: "Cost of sales as a percent of revenue."
            }
        ],

        quiz: [
            {
                question: "Revenue should be recorded when it is:",
                options: ["Collected in cash", "Earned", "Budgeted", "Taxed"],
                correct: 1
            },
            {
                question: "Sales tax collected from customers is recorded as:",
                options: ["Revenue", "A liability", "An expense", "An asset"],
                correct: 1
            },
            {
                question: "Tips collected for employees are:",
                options: ["Restaurant revenue", "A liability until paid to staff", "An expense", "Owners' equity"],
                correct: 1
            },
            {
                question: "Gross profit equals revenue minus:",
                options: ["Operating expenses", "Cost of sales", "Fixed charges", "Net income"],
                correct: 1
            },
            {
                question: "In a periodic system, cost of sales =",
                options: ["Beginning + Purchases − Ending inventory", "Ending − Beginning inventory", "Purchases only", "Revenue − Net income"],
                correct: 0
            },
            {
                question: "Which system updates inventory continuously with every sale?",
                options: ["Periodic", "Perpetual", "Annual", "Manual"],
                correct: 1
            },
            {
                question: "Rent, depreciation, and interest are:",
                options: ["Operating expenses", "Cost of sales", "Fixed charges", "Revenues"],
                correct: 2
            },
            {
                question: "Depreciation expense appears on the:",
                options: ["Balance sheet only", "Income statement", "Statement of cash receipts", "Tax form only"],
                correct: 1
            },
            {
                question: "Accumulated depreciation is:",
                options: ["A revenue", "A contra-asset on the balance sheet", "An expense each period", "A liability"],
                correct: 1
            },
            {
                question: "Beginning inventory 8,000 + purchases 27,445 = cost of food available of:",
                options: ["19,445", "35,445", "27,445", "10,060"],
                correct: 1
            },
            {
                question: "If food sales are $100,000 and food cost is $33,000, the food cost % is:",
                options: ["33%", "3.3%", "67%", "30%"],
                correct: 0
            },
            {
                question: "Operating expenses differ from fixed charges because they:",
                options: ["Never change", "Vary with and are controllable by operations", "Are always larger", "Are not on the income statement"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "Revenue is recognized when it is _______, not when cash is received.", answer: "earned", hint: "Service provided / goods delivered" },
            { sentence: "Sales tax collected from guests is a _______, not revenue.", answer: "liability", hint: "Owed to the government" },
            { sentence: "Tips collected for staff are a liability until _______ to employees.", answer: "paid", hint: "Handed over to staff" },
            { sentence: "Revenue − Cost of Sales = _______ Profit.", answer: "Gross", hint: "First profit subtotal" },
            { sentence: "In a _______ system, inventory updates continuously with each sale.", answer: "perpetual", hint: "Real-time" },
            { sentence: "In a periodic system, Cost of Sales = Beginning + Purchases − _______ inventory.", answer: "Ending", hint: "Counted at period end" },
            { sentence: "_______ expense allocates an asset's cost to the current period.", answer: "Depreciation", hint: "Using up a long-lived asset" },
            { sentence: "Accumulated depreciation is a _______-asset that reduces property and equipment.", answer: "contra", hint: "Offsets an asset" },
            { sentence: "Food cost percentage = cost of food sold ÷ food _______.", answer: "sales", hint: "Revenue from food" }
        ],

        learn: {
            title: "The Income Statement",
            content: `
                <h3>📈 Chapter 5: The Income Statement</h3>
                <p>The income statement reports <strong>revenues − expenses = net income</strong> over a period. Two recognition rules are central.</p>

                <hr>

                <h4>🧾 Recognizing Revenue Correctly</h4>
                <ul>
                    <li><strong>Revenue recognition</strong> — record revenue when it is <strong>earned</strong> (the meal is served, the room is occupied), not when cash arrives.</li>
                    <li><strong>Sales tax</strong> — collected for the government, so it is a <strong>liability</strong> (Sales Tax Payable), never revenue.</li>
                    <li><strong>Tips</strong> — belong to employees; a <strong>liability</strong> until paid out, not restaurant sales.</li>
                </ul>

                <hr>

                <h4>🍽️ Cost of Sales &amp; Inventory Systems</h4>
                <div class="formula-box">
                    <strong>Perpetual</strong> — inventory and cost of sales update with <em>every</em> transaction (real-time).<br><br>
                    <strong>Periodic</strong> — count inventory at period end:<br>
                    Cost of Sales = Beginning Inventory + Purchases − Ending Inventory
                </div>
                <div class="example-box">
                    <h4>📝 Cost of Food Used</h4>
                    <p>Beginning 8,000 + Purchases 27,445 = <strong>Cost of Food Available 35,445</strong>.<br>
                    35,445 − Ending 10,060 = <strong>Cost of Food Used 25,385</strong>.</p>
                    <p>(Adjust for transfers in/out and employee/officer meals where applicable.)</p>
                </div>

                <hr>

                <h4>💸 Operating Expenses vs Fixed Charges</h4>
                <ul>
                    <li><strong>Operating expenses</strong> — vary with and are controllable by operations: payroll, supplies, utilities, marketing.</li>
                    <li><strong>Fixed charges (capital costs)</strong> — do not vary with sales: rent, depreciation, interest, insurance, property tax.</li>
                </ul>

                <hr>

                <h4>🏚️ Depreciation: Expense vs Accumulated</h4>
                <div class="formula-box">
                    <strong>Depreciation expense</strong> — this period's amount → <em>income statement</em>.<br>
                    <strong>Accumulated depreciation</strong> — running total to date → <em>balance sheet</em> (a contra-asset reducing property &amp; equipment).
                </div>

                <div class="example-box">
                    <h4>📝 Food Cost Percentage</h4>
                    <p>Food sales $100,000, cost of food sold $33,000 → Food Cost % = 33,000 ÷ 100,000 = <strong>33%</strong>. Managers track this percentage to protect gross profit.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Recognize revenue when earned; sales tax and tips are liabilities, not revenue.</li>
                        <li>Perpetual = continuous; periodic = Beginning + Purchases − Ending.</li>
                        <li>Operating expenses vary; fixed charges (rent, depreciation, interest) don't.</li>
                        <li>Depreciation expense (income statement) vs accumulated depreciation (balance sheet contra-asset).</li>
                        <li>Food cost % = cost of food sold ÷ food sales.</li>
                    </ul>
                </div>
            `
        }
    },

    // ============================= CHAPTER 6 — THE BOOKKEEPING PROCESS =============================
    bookkeeping: {
        name: "The Bookkeeping Process",
        icon: "fa-pen-to-square",
        color: "#8b5cf6",

        flashcards: [
            {
                question: "What is double-entry bookkeeping?",
                answer: "A system in which every transaction is recorded with equal debits and credits in at least two accounts, keeping the accounting equation (A = L + E) in balance.",
                explanation: "Total debits always equal total credits."
            },
            {
                question: "What is a journal and what is a ledger?",
                answer: "• Journal — the book of original entry where transactions are first recorded in date order.\n• Ledger — the collection of accounts where journal entries are posted to update each account's balance.",
                explanation: "Journalize first, then post to the ledger."
            },
            {
                question: "What is a T-account?",
                answer: "A simple representation of a ledger account shaped like a 'T', with debits on the LEFT and credits on the RIGHT.",
                explanation: "Left = debit, right = credit — always."
            },
            {
                question: "Which accounts are increased by a DEBIT?",
                answer: "Debits increase ASSETS and EXPENSES (and withdrawals/dividends).",
                explanation: "Debit = left side increases assets and expenses."
            },
            {
                question: "Which accounts are increased by a CREDIT?",
                answer: "Credits increase LIABILITIES, OWNERS' EQUITY, and REVENUE.",
                explanation: "Credit = right side increases liabilities, equity, revenue."
            },
            {
                question: "What is a 'normal balance'?",
                answer: "The side on which an account normally has its balance — the side that increases it.\n• Assets, Expenses → normal DEBIT balance.\n• Liabilities, Equity, Revenue → normal CREDIT balance.",
                explanation: "The increasing side is the normal-balance side."
            },
            {
                question: "What three questions are asked to analyze a transaction?",
                answer: "1. Which accounts are affected?\n2. Does each account increase or decrease?\n3. Which account is debited and which is credited?",
                explanation: "Answer all three before journalizing."
            },
            {
                question: "What is the rule of equality in double-entry accounting?",
                answer: "For every transaction (and for the books as a whole), total debits must equal total credits. If they don't, an error exists.",
                explanation: "Σ Debits = Σ Credits."
            },
            {
                question: "What is a contra account?",
                answer: "An account with a normal balance OPPOSITE to the account it relates to, used to reduce that account's reported value (e.g., Accumulated Depreciation reduces Property &amp; Equipment).",
                explanation: "It offsets a related account."
            },
            {
                question: "Give examples of contra accounts.",
                answer: "• Allowance for Doubtful Accounts (contra to Accounts Receivable)\n• Accumulated Depreciation (contra to Property &amp; Equipment)\n• Treasury Stock (contra to Equity)\n• Owner's Withdrawals/Drawing (contra to Capital)\n• Sales Returns &amp; Allowances (contra to Revenue)",
                explanation: "Each reduces a specific related account."
            },
            {
                question: "How would you journalize: Owners invest $50,000 cash for common stock?",
                answer: "Debit Cash 50,000 (asset increases)\nCredit Common Stock 50,000 (equity increases).",
                explanation: "Asset up = debit; equity up = credit."
            },
            {
                question: "How would you journalize: Buy equipment for $12,000 on account?",
                answer: "Debit Equipment 12,000 (asset increases)\nCredit Accounts Payable 12,000 (liability increases).",
                explanation: "'On account' means a payable, not cash."
            },
            {
                question: "What is the trial balance?",
                answer: "A list of all ledger accounts and their balances at a point in time, used to check that total debits equal total credits before preparing financial statements.",
                explanation: "An equality check, not a guarantee of no errors."
            },
            {
                question: "Why is accumulated depreciation a credit-balance account?",
                answer: "It is a contra-asset: it grows on the CREDIT side to offset the debit-balance asset it relates to, reducing the asset's net book value.",
                explanation: "Opposite normal balance to the asset."
            },
            {
                question: "In K1, which account types are used for journal entries?",
                answer: "Only Assets, Liabilities, and Equity (A/L/E). Revenue and expense entries are introduced in Midterm 2 (K2).",
                explanation: "K1 bookkeeping = ALE transactions only."
            }
        ],

        quiz: [
            {
                question: "Debits increase which accounts?",
                options: ["Liabilities and revenue", "Assets and expenses", "Equity and revenue", "Liabilities and equity"],
                correct: 1
            },
            {
                question: "Credits increase which accounts?",
                options: ["Assets and expenses", "Liabilities, equity, and revenue", "Assets and liabilities", "Expenses only"],
                correct: 1
            },
            {
                question: "On a T-account, debits are on the:",
                options: ["Right", "Left", "Bottom", "Top"],
                correct: 1
            },
            {
                question: "The normal balance of an asset account is a:",
                options: ["Credit", "Debit", "Zero", "Either side"],
                correct: 1
            },
            {
                question: "The normal balance of a liability account is a:",
                options: ["Debit", "Credit", "Zero", "Either side"],
                correct: 1
            },
            {
                question: "The book of original entry is the:",
                options: ["Ledger", "Journal", "Trial balance", "Balance sheet"],
                correct: 1
            },
            {
                question: "Transferring journal entries to ledger accounts is called:",
                options: ["Closing", "Posting", "Auditing", "Reconciling"],
                correct: 1
            },
            {
                question: "Accumulated depreciation is a:",
                options: ["Liability", "Contra-asset (credit balance)", "Revenue", "Normal-debit asset"],
                correct: 1
            },
            {
                question: "Investing cash for common stock is recorded as:",
                options: ["Debit Common Stock, Credit Cash", "Debit Cash, Credit Common Stock", "Debit Cash, Credit Equipment", "Debit Equipment, Credit Cash"],
                correct: 1
            },
            {
                question: "Buying equipment 'on account' credits:",
                options: ["Cash", "Accounts Payable", "Common Stock", "Revenue"],
                correct: 1
            },
            {
                question: "A list checking that total debits equal total credits is the:",
                options: ["Income statement", "Trial balance", "Cash flow statement", "Journal"],
                correct: 1
            },
            {
                question: "Which is a contra-revenue account?",
                options: ["Accumulated depreciation", "Sales returns and allowances", "Accounts payable", "Prepaid rent"],
                correct: 1
            },
            {
                question: "For every transaction, total debits must equal total:",
                options: ["Assets", "Credits", "Expenses", "Revenues"],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "In double-entry accounting, total debits must equal total _______.", answer: "credits", hint: "The other side" },
            { sentence: "Debits increase assets and _______.", answer: "expenses", hint: "Costs of operating" },
            { sentence: "Credits increase liabilities, equity, and _______.", answer: "revenue", hint: "Income earned" },
            { sentence: "On a T-account, debits go on the _______ side.", answer: "left", hint: "Opposite of right" },
            { sentence: "The normal balance of an asset is a _______.", answer: "debit", hint: "Increasing side of an asset" },
            { sentence: "The _______ is the book of original entry; the ledger holds the accounts.", answer: "journal", hint: "Recorded in date order" },
            { sentence: "Transferring journal entries to the ledger is called _______.", answer: "posting", hint: "Journal → ledger" },
            { sentence: "A _______ account has a normal balance opposite to the account it offsets.", answer: "contra", hint: "E.g. accumulated depreciation" },
            { sentence: "The _______ balance lists all accounts to check that debits equal credits.", answer: "trial", hint: "Pre-statement check" },
            { sentence: "In K1, journal entries use only Assets, Liabilities, and _______.", answer: "Equity", hint: "A / L / E" }
        ],

        learn: {
            title: "The Bookkeeping Process",
            content: `
                <h3>✍️ Chapter 6: The Bookkeeping Process</h3>
                <p>Bookkeeping turns transactions into recorded entries. The engine of it all is <strong>double-entry</strong>: every transaction has equal <strong>debits</strong> and <strong>credits</strong>.</p>

                <hr>

                <h4>🔁 Journal → Ledger → Trial Balance</h4>
                <ul>
                    <li><strong>Journal</strong> — book of original entry; transactions recorded in date order.</li>
                    <li><strong>Posting</strong> — transferring journal entries into the <strong>ledger</strong> accounts.</li>
                    <li><strong>Trial balance</strong> — a list of all account balances to verify total debits = total credits.</li>
                </ul>

                <hr>

                <h4>⬅️➡️ Debit and Credit Rules</h4>
                <div class="formula-box">
                    <strong>DEBIT (left) increases:</strong> Assets · Expenses · (Withdrawals/Dividends)<br>
                    <strong>CREDIT (right) increases:</strong> Liabilities · Owners' Equity · Revenue
                </div>
                <p>The side that <em>increases</em> an account is its <strong>normal balance</strong>. So assets and expenses normally carry debit balances; liabilities, equity, and revenue normally carry credit balances.</p>

                <div class="example-box">
                    <h4>📝 Three Questions for Every Transaction</h4>
                    <p>1. Which accounts are affected?<br>
                    2. Does each increase or decrease?<br>
                    3. Which is debited and which is credited?</p>
                </div>

                <hr>

                <h4>🧮 Worked Entries (ALE only — K1)</h4>
                <div class="formula-box">
                    <strong>Owners invest $50,000 cash for stock:</strong><br>
                    Debit Cash 50,000 · Credit Common Stock 50,000<br><br>
                    <strong>Buy equipment $12,000 on account:</strong><br>
                    Debit Equipment 12,000 · Credit Accounts Payable 12,000<br><br>
                    <strong>Borrow $15,000 cash on a note:</strong><br>
                    Debit Cash 15,000 · Credit Note Payable 15,000
                </div>
                <p>In Midterm 1, journal entries use only <strong>Assets, Liabilities, and Equity</strong>. Revenue and expense entries come in Midterm 2.</p>

                <hr>

                <h4>↩️ Contra Accounts</h4>
                <p>A <strong>contra account</strong> has a normal balance opposite to the account it offsets, reducing that account's reported value:</p>
                <div class="formula-box">
                    Allowance for Doubtful Accounts → contra to Accounts Receivable<br>
                    Accumulated Depreciation → contra to Property &amp; Equipment<br>
                    Treasury Stock → contra to Equity<br>
                    Owner's Withdrawals → contra to Capital<br>
                    Sales Returns &amp; Allowances → contra to Revenue
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                    <ul>
                        <li>Every transaction: debits = credits (keeps A = L + E balanced).</li>
                        <li>Debits ↑ assets &amp; expenses; credits ↑ liabilities, equity &amp; revenue.</li>
                        <li>Normal balance = the increasing side of the account.</li>
                        <li>Journalize → post to ledger → trial balance.</li>
                        <li>Contra accounts (e.g. accumulated depreciation) carry the opposite normal balance.</li>
                    </ul>
                </div>
            `
        }
    }

};

// Make available globally (browser) + module (node verify/tests).
if (typeof window !== 'undefined') { window.accountingM1 = accountingM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = accountingM1; }
