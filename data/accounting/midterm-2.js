// ===== ACCOUNTING — Midterm 2 (K2, Chapters 7–16) =====
// Realign postojećih kategorija (cash-control / budgeting / sec-reports / accounting-cycle /
// hotel-statements / financial-analysis) u lekciju "second-midterm" + 2 NOVE kategorije
// (restaurantAccounting Ch9, depreciation Ch11). Oblik po docs/architecture/CONTENT_SCHEMA.md.
//
// CROSS-ENV: u pregledniku su *Data globali već definirani (category skripte učitane PRIJE ove,
// vidi catalog scripts order). U node-u (verify/testovi) ih require-amo. Ternar ne evaluira
// neuzetu granu → identifikator se u node-u nikad ne dotakne (nema ReferenceError).

const accountingM2 = (function () {
    const isNode = (typeof module !== 'undefined' && module.exports);
    const cashControl       = isNode ? require('./cash-control.js')       : cashControlData;
    const budgeting         = isNode ? require('./budgeting.js')          : budgetingData;
    const secReports        = isNode ? require('./sec-reports.js')        : secReportsData;
    const accountingCycle   = isNode ? require('./accounting-cycle.js')   : accountingCycleData;
    const hotelStatements   = isNode ? require('./hotel-statements.js')   : hotelStatementsData;
    const financialAnalysis = isNode ? require('./financial-analysis.js') : financialAnalysisData;

    return {
        // ---- Ch 7–8: Accounting cycle (cash vs accrual, adjusting/closing, trial balance) ----
        accountingCycle: accountingCycle,

        // ---- Ch 9: Restaurant accounting & analysis (NEW) ----
        restaurantAccounting: {
            name: "Restaurant Accounting",
            icon: "fa-utensils",
            color: "#ef4444",

            flashcards: [
                {
                    question: "What is the USAR?",
                    answer: "The Uniform System of Accounts for Restaurants — a standardized chart of accounts and reporting format so restaurants of all sizes can record and compare results consistently.",
                    explanation: "The restaurant equivalent of USALI for hotels."
                },
                {
                    question: "What are 'covers' in restaurant accounting?",
                    answer: "Covers are the number of guests served (meals sold) during a period. They drive most restaurant performance ratios.",
                    explanation: "One cover = one guest served."
                },
                {
                    question: "How is average check calculated?",
                    answer: "Average Check = Total Sales ÷ Number of Covers. It shows the average amount each guest spends.",
                    explanation: "Total revenue spread over guests served."
                },
                {
                    question: "Compute average check: total food sales $513,000, covers 34,200.",
                    answer: "Average Check = 513,000 ÷ 34,200 = $15.00.",
                    explanation: "Sales divided by covers."
                },
                {
                    question: "What is seat turnover?",
                    answer: "Seat Turnover = Covers ÷ Available Seats (for a period). It measures how many times each seat is used — i.e., how efficiently seating capacity is used.",
                    explanation: "Higher turnover = seats reused more often."
                },
                {
                    question: "Compute seat turnover: 34,200 covers, 60 seats, 300 days.",
                    answer: "Seat Turnover = 34,200 ÷ (60 × 300) = 34,200 ÷ 18,000 = 1.9 times per day.",
                    explanation: "Covers divided by total seat-days."
                },
                {
                    question: "What is food cost percentage?",
                    answer: "Food Cost % = Cost of Food Sold ÷ Food Sales. It is the key cost-control ratio in a restaurant.",
                    explanation: "Lower is better, within quality limits."
                },
                {
                    question: "What is beverage cost percentage?",
                    answer: "Beverage Cost % = Cost of Beverage Sold ÷ Beverage Sales. Tracked separately from food because margins differ.",
                    explanation: "Beverages usually have lower cost % than food."
                },
                {
                    question: "What is labor cost percentage?",
                    answer: "Labor Cost % = Total Labor Cost ÷ Total Sales. A major controllable cost in restaurants.",
                    explanation: "Payroll plus benefits over sales."
                },
                {
                    question: "What is prime cost in a restaurant?",
                    answer: "Prime Cost = Cost of Sales (food + beverage) + Total Labor Cost. It captures the two largest controllable costs combined.",
                    explanation: "Often targeted at roughly 60–65% of sales."
                },
                {
                    question: "Why are food and beverage revenues reported separately?",
                    answer: "Because they have different cost structures and margins; separating them lets managers control food and beverage cost percentages independently.",
                    explanation: "Different margins → separate tracking."
                },
                {
                    question: "What is the contribution margin of a menu item?",
                    answer: "Contribution Margin = Selling Price − Variable (food) Cost. It is the amount each sale contributes toward covering fixed costs and profit.",
                    explanation: "Used in menu engineering."
                }
            ],

            quiz: [
                {
                    question: "USAR stands for the Uniform System of Accounts for:",
                    options: ["Resorts", "Restaurants", "Rentals", "Retailers"],
                    correct: 1
                },
                {
                    question: "'Covers' refers to:",
                    options: ["Table linens", "Number of guests served", "Menu pages", "Cash drawers"],
                    correct: 1
                },
                {
                    question: "Average check equals:",
                    options: ["Covers ÷ Sales", "Total sales ÷ Covers", "Sales ÷ Seats", "Seats ÷ Covers"],
                    correct: 1
                },
                {
                    question: "Total food sales $513,000 over 34,200 covers gives an average check of:",
                    options: ["$13.50", "$15.00", "$17.10", "$1.90"],
                    correct: 1
                },
                {
                    question: "Seat turnover measures:",
                    options: ["Sales per server", "How many times seats are used", "Food cost", "Labor hours"],
                    correct: 1
                },
                {
                    question: "34,200 covers ÷ (60 seats × 300 days) =",
                    options: ["1.9", "5.7", "0.5", "19"],
                    correct: 0
                },
                {
                    question: "Food cost percentage equals:",
                    options: ["Food sales ÷ Cost of food", "Cost of food sold ÷ Food sales", "Labor ÷ Sales", "Covers ÷ Sales"],
                    correct: 1
                },
                {
                    question: "Prime cost is the sum of:",
                    options: ["Rent + utilities", "Cost of sales + labor cost", "Food + beverage sales", "Fixed + variable rent"],
                    correct: 1
                },
                {
                    question: "Labor cost percentage equals labor cost divided by:",
                    options: ["Covers", "Total sales", "Seats", "Food cost"],
                    correct: 1
                },
                {
                    question: "Food and beverage revenues are reported separately because they have different:",
                    options: ["Tax rates", "Cost structures and margins", "Colors", "Owners"],
                    correct: 1
                },
                {
                    question: "Contribution margin of a menu item equals selling price minus:",
                    options: ["Labor cost", "Variable (food) cost", "Rent", "Sales tax"],
                    correct: 1
                }
            ],

            fillBlanks: [
                { sentence: "The Uniform System of Accounts for Restaurants is abbreviated _______.", answer: "USAR", hint: "Restaurant standard" },
                { sentence: "_______ are the number of guests served during a period.", answer: "Covers", hint: "One per guest" },
                { sentence: "Average check = total sales ÷ _______.", answer: "covers", hint: "Guests served" },
                { sentence: "_______ turnover = covers ÷ available seats.", answer: "Seat", hint: "How often seats are reused" },
                { sentence: "Food cost % = cost of food sold ÷ food _______.", answer: "sales", hint: "Food revenue" },
                { sentence: "_______ cost = cost of sales + labor cost.", answer: "Prime", hint: "Two biggest controllable costs" },
                { sentence: "Labor cost % = labor cost ÷ total _______.", answer: "sales", hint: "Denominator is revenue" },
                { sentence: "Contribution margin = selling price − variable _______ cost.", answer: "food", hint: "The item's cost" },
                { sentence: "Beverage cost % is tracked separately because beverage _______ differ from food.", answer: "margins", hint: "Profitability per dollar" }
            ],

            learn: {
                title: "Restaurant Accounting & Analysis",
                content: `
                    <h3>🍽️ Chapter 9: Restaurant Accounting</h3>
                    <p>Restaurants use the <strong>Uniform System of Accounts for Restaurants (USAR)</strong> so results can be recorded and compared consistently. Performance is driven by a handful of operating ratios.</p>

                    <hr>

                    <h4>📊 Key Operating Ratios</h4>
                    <div class="formula-box">
                        <strong>Average Check</strong> = Total Sales ÷ Covers<br>
                        <strong>Seat Turnover</strong> = Covers ÷ Available Seats<br>
                        <strong>Food Cost %</strong> = Cost of Food Sold ÷ Food Sales<br>
                        <strong>Beverage Cost %</strong> = Cost of Beverage Sold ÷ Beverage Sales<br>
                        <strong>Labor Cost %</strong> = Total Labor Cost ÷ Total Sales<br>
                        <strong>Prime Cost</strong> = Cost of Sales + Labor Cost
                    </div>
                    <p><em>Covers</em> = guests served. Food and beverage revenues are tracked <strong>separately</strong> because their margins differ.</p>

                    <div class="example-box">
                        <h4>📝 Worked Example</h4>
                        <p>Food sales $513,000, covers 34,200, seats 60, days open 300:</p>
                        <p>• Average Check = 513,000 ÷ 34,200 = <strong>$15.00</strong><br>
                        • Seat Turnover = 34,200 ÷ (60 × 300) = <strong>1.9</strong> times/day</p>
                    </div>

                    <hr>

                    <h4>🧮 Cost Control</h4>
                    <p><strong>Prime cost</strong> (cost of sales + labor) captures the two largest controllable costs and is the number managers watch most closely. <strong>Contribution margin</strong> (selling price − variable food cost) drives menu-engineering decisions.</p>

                    <div class="tip-box">
                        <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                        <ul>
                            <li>USAR standardizes restaurant reporting.</li>
                            <li>Average check = sales ÷ covers; seat turnover = covers ÷ seats.</li>
                            <li>Food/beverage/labor cost % each = cost ÷ relevant sales.</li>
                            <li>Prime cost = cost of sales + labor cost.</li>
                            <li>Contribution margin = price − variable cost (menu engineering).</li>
                        </ul>
                    </div>
                `
            }
        },

        // ---- Ch 10: Hotel income statements & USALI ----
        hotelStatements: hotelStatements,

        // ---- Ch 11: Depreciation & amortization (NEW) ----
        depreciation: {
            name: "Depreciation & Amortization",
            icon: "fa-arrow-trend-down",
            color: "#f97316",

            flashcards: [
                {
                    question: "What is depreciation?",
                    answer: "The systematic allocation of the cost of a long-lived TANGIBLE asset (building, equipment, furniture) over its useful life, matching the expense to the periods that benefit from the asset.",
                    explanation: "Spreading a fixed asset's cost over time."
                },
                {
                    question: "What is salvage (residual) value?",
                    answer: "The estimated amount expected to be recovered at the end of an asset's useful life. It is subtracted from cost to find the depreciable base.",
                    explanation: "What the asset is worth when retired."
                },
                {
                    question: "What is the depreciable base?",
                    answer: "Depreciable Base = Cost − Salvage Value. It is the total amount that will be depreciated over the asset's life.",
                    explanation: "The portion of cost that gets expensed."
                },
                {
                    question: "What is book value (carrying value)?",
                    answer: "Book Value = Cost − Accumulated Depreciation. It is the asset's net amount reported on the balance sheet.",
                    explanation: "Declines as depreciation accumulates."
                },
                {
                    question: "What is the straight-line depreciation formula?",
                    answer: "Annual Depreciation = (Cost − Salvage Value) ÷ Useful Life. The same amount is expensed each year.",
                    explanation: "Most common and simplest method."
                },
                {
                    question: "Compute straight-line depreciation: cost $50,000, salvage $5,000, life 9 years.",
                    answer: "(50,000 − 5,000) ÷ 9 = 45,000 ÷ 9 = $5,000 per year.",
                    explanation: "Equal expense every year."
                },
                {
                    question: "What is the units-of-production method?",
                    answer: "Depreciation = ((Cost − Salvage) ÷ Total Estimated Units) × Units Produced this period. Expense varies with actual usage.",
                    explanation: "Ties depreciation to output, not time."
                },
                {
                    question: "What is the double-declining-balance (DDB) method?",
                    answer: "An accelerated method: Depreciation = 2 × Straight-Line Rate × Beginning Book Value. Salvage is ignored in the calculation, but the asset is not depreciated below salvage value.",
                    explanation: "More expense early, less later."
                },
                {
                    question: "What is MACRS?",
                    answer: "The Modified Accelerated Cost Recovery System — the depreciation method required by U.S. tax law, using set recovery periods and rates (differs from GAAP depreciation).",
                    explanation: "Tax depreciation, not financial-statement depreciation."
                },
                {
                    question: "What is the difference between depreciation, amortization, and depletion?",
                    answer: "• Depreciation — tangible fixed assets (equipment, buildings).\n• Amortization — intangible assets (franchises, patents, goodwill).\n• Depletion — natural resources (mines, timber).",
                    explanation: "Same idea, different asset types."
                },
                {
                    question: "Why is land not depreciated?",
                    answer: "Land has an unlimited useful life — it does not wear out or get used up — so its cost is not allocated to expense.",
                    explanation: "The one fixed asset that isn't depreciated."
                },
                {
                    question: "How does accumulated depreciation appear on the balance sheet?",
                    answer: "As a contra-asset (credit balance) subtracted from the related property &amp; equipment, reducing it to book value.",
                    explanation: "Cost − Accumulated Depreciation = Book Value."
                }
            ],

            quiz: [
                {
                    question: "Depreciation allocates the cost of a long-lived asset over its:",
                    options: ["Purchase month", "Useful life", "Warranty period", "First year"],
                    correct: 1
                },
                {
                    question: "Depreciable base equals cost minus:",
                    options: ["Accumulated depreciation", "Salvage value", "Book value", "Market value"],
                    correct: 1
                },
                {
                    question: "Straight-line depreciation per year =",
                    options: ["Cost ÷ Life", "(Cost − Salvage) ÷ Useful life", "Cost × Rate", "Cost − Salvage"],
                    correct: 1
                },
                {
                    question: "Cost $50,000, salvage $5,000, life 9 years → annual straight-line depreciation =",
                    options: ["$5,556", "$5,000", "$4,500", "$45,000"],
                    correct: 1
                },
                {
                    question: "Book value equals cost minus:",
                    options: ["Salvage value", "Accumulated depreciation", "Depreciable base", "Useful life"],
                    correct: 1
                },
                {
                    question: "Which method is accelerated?",
                    options: ["Straight-line", "Double-declining-balance", "Units-of-production (steady)", "Average cost"],
                    correct: 1
                },
                {
                    question: "MACRS is used for:",
                    options: ["GAAP financial statements", "U.S. tax depreciation", "Inventory", "Payroll"],
                    correct: 1
                },
                {
                    question: "Allocating the cost of an intangible asset is called:",
                    options: ["Depreciation", "Amortization", "Depletion", "Accrual"],
                    correct: 1
                },
                {
                    question: "Allocating the cost of natural resources is called:",
                    options: ["Amortization", "Depletion", "Depreciation", "Recognition"],
                    correct: 1
                },
                {
                    question: "Which asset is NOT depreciated?",
                    options: ["Building", "Equipment", "Land", "Furniture"],
                    correct: 2
                },
                {
                    question: "Under DDB, salvage value is:",
                    options: ["Subtracted first", "Ignored in the formula, but not depreciated below", "Added to cost", "Equal to book value"],
                    correct: 1
                },
                {
                    question: "Accumulated depreciation is reported as a:",
                    options: ["Liability", "Contra-asset", "Revenue", "Expense on the balance sheet"],
                    correct: 1
                }
            ],

            fillBlanks: [
                { sentence: "Depreciation allocates a tangible asset's cost over its useful _______.", answer: "life", hint: "How long it's used" },
                { sentence: "Depreciable base = cost − _______ value.", answer: "salvage", hint: "Residual at end of life" },
                { sentence: "Book value = cost − accumulated _______.", answer: "depreciation", hint: "Total expensed to date" },
                { sentence: "Straight-line depreciation = (cost − salvage) ÷ useful _______.", answer: "life", hint: "Years of use" },
                { sentence: "The double-_______-balance method is accelerated.", answer: "declining", hint: "More expense early" },
                { sentence: "_______ is used for U.S. tax depreciation.", answer: "MACRS", hint: "Modified Accelerated Cost Recovery System" },
                { sentence: "_______ allocates the cost of intangible assets.", answer: "Amortization", hint: "Patents, franchises, goodwill" },
                { sentence: "Depletion allocates the cost of natural _______.", answer: "resources", hint: "Mines, timber" },
                { sentence: "_______ is the one fixed asset that is not depreciated.", answer: "Land", hint: "Unlimited useful life" }
            ],

            learn: {
                title: "Depreciation & Amortization",
                content: `
                    <h3>📉 Chapter 11: Depreciation &amp; Amortization</h3>
                    <p><strong>Depreciation</strong> spreads the cost of a long-lived tangible asset across the periods that benefit from it (the matching principle).</p>

                    <hr>

                    <h4>🔑 Key Terms</h4>
                    <div class="formula-box">
                        <strong>Depreciable Base</strong> = Cost − Salvage Value<br>
                        <strong>Book Value</strong> = Cost − Accumulated Depreciation
                    </div>

                    <hr>

                    <h4>🧮 Methods</h4>
                    <div class="formula-box">
                        <strong>Straight-Line</strong> = (Cost − Salvage) ÷ Useful Life — equal each year.<br><br>
                        <strong>Units of Production</strong> = ((Cost − Salvage) ÷ Total Units) × Units this period.<br><br>
                        <strong>Double-Declining-Balance (DDB)</strong> = 2 × Straight-Line Rate × Beginning Book Value — accelerated; ignores salvage in the formula but never depreciates below it.<br><br>
                        <strong>MACRS</strong> = required for U.S. tax (different from GAAP).
                    </div>
                    <div class="example-box">
                        <h4>📝 Straight-Line Example</h4>
                        <p>Cost $50,000, salvage $5,000, life 9 years → (50,000 − 5,000) ÷ 9 = <strong>$5,000 per year</strong>.</p>
                    </div>

                    <hr>

                    <h4>🗂️ Depreciation vs Amortization vs Depletion</h4>
                    <ul>
                        <li><strong>Depreciation</strong> — tangible fixed assets (equipment, buildings).</li>
                        <li><strong>Amortization</strong> — intangibles (franchises, patents, goodwill).</li>
                        <li><strong>Depletion</strong> — natural resources (mines, timber).</li>
                    </ul>
                    <p><strong>Land is never depreciated</strong> — its useful life is unlimited.</p>

                    <div class="tip-box">
                        <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                        <ul>
                            <li>Depreciable base = cost − salvage; book value = cost − accumulated depreciation.</li>
                            <li>Straight-line = (cost − salvage) ÷ life (equal each year).</li>
                            <li>DDB is accelerated; MACRS is for taxes.</li>
                            <li>Amortization = intangibles; depletion = natural resources.</li>
                            <li>Land is not depreciated.</li>
                        </ul>
                    </div>
                `
            }
        },

        // ---- Ch 12: Analyzing financial statements (ratios, horizontal/vertical) ----
        financialAnalysis: financialAnalysis,

        // ---- Ch 13: Annual reports (SEC, Sarbanes-Oxley, 10-K) — bivši "secReports" ----
        annualReports: secReports,

        // ---- Ch 14: Budgeting & cost analysis (+ credit/debit cards) ----
        budgeting: budgeting,

        // ---- Ch 15–16: Internal control of cash ----
        cashControl: cashControl
    };
})();

// Make available globally (browser) + module (node verify/tests).
if (typeof window !== 'undefined') { window.accountingM2 = accountingM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = accountingM2; }
