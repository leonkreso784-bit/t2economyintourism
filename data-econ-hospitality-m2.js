// ===== ECONOMICS IN HOSPITALITY - SECOND MIDTERM =====
// Source: Units 6-10 (2025) lecture presentations (+ "add" supplements) = course topics T8-T12.
// Course: "Economics of Hospitality Businesses" (FTHM Opatija, K. Mikinac, PhD).
// 2nd midterm (T13) covers: U6 Business result, U7 Success & economic indicators (KPIs),
// U8 Price policy, U9 Principles of sales, U10 Profitability of investments.

const economicsHospitalityM2Data = {
    unit6BusinessResult: {
        name: "Unit 6: Business Result",
        icon: "fa-file-invoice-dollar",
        color: "#6366f1",

        flashcards: [
            {
                question: "How is the business result of a hospitality company expressed?",
                answer: "Physically — as the product or service delivered (overnight stays, meals); and in value — as the difference between total revenue and total expenditure in the accounting period (usually the fiscal year). A positive result is profit, a negative one is loss.",
                explanation: "Determined by the Profit & Loss statement at year-end."
            },
            {
                question: "What are the basic financial reports?",
                answer: "Balance sheet, Profit and Loss statement (P&L), Report on retained earnings, and Cash flow statement. Together they show the 'health' of the company.",
                explanation: "All reports are interlinked."
            },
            {
                question: "What is the difference between a static and a dynamic report?",
                answer: "A static report shows the situation at a specific point in time (the balance sheet); a dynamic report shows changes/performance over a period (the profit and loss statement).",
                explanation: "Balance sheet = snapshot; P&L = period flow."
            },
            {
                question: "Which accounting standards are used in Croatia?",
                answer: "IFRS (International Financial Reporting Standards) for large/public companies, and Croatian Accounting Standards (published 2008) for small and medium enterprises (to simplify reporting and reduce costs).",
                explanation: "International standards harmonised reporting (EU decision 2002, IFRS from 2003)."
            },
            {
                question: "What is USALI?",
                answer: "The Uniform System of Accounts for the Lodging Industry — a globally recognised hotel-industry reporting standard for internal reporting, benchmarking and decision-making. Created in 1926 by the Hotel Association of New York (now in its 12th edition).",
                explanation: "Increasingly used in Croatia too."
            },
            {
                question: "What is a balance sheet and its key equation?",
                answer: "A static report showing assets and their sources (capital + liabilities) on a specific date. Key principle: Assets = Liabilities + Equity (the value of assets always equals the value of liabilities).",
                explanation: "Basis for analysing the financial position."
            },
            {
                question: "What is the difference between a budgetary and an invoicing balance sheet?",
                answer: "Budgetary (planned/earlier) records the values the company plans to dispose of on the balance-sheet date; invoicing (actual/retrospective) records the values it actually has on that date.",
                explanation: "By date of preparation."
            },
            {
                question: "How are sources of assets divided?",
                answer: "By ownership: own funds (capital) and borrowed funds (liabilities). By maturity: short-term sources (current liabilities), long-term sources (long-term liabilities), and permanent sources (capital/equity).",
                explanation: "Equity = total assets − all liabilities."
            },
            {
                question: "What does the Profit and Loss statement show, and its elements?",
                answer: "It expresses the degree of business success over a period. Elements: Income, Expenditure, Profit (or loss) before tax, Income tax, and Profit after tax (or loss) — the operating result.",
                explanation: "Balance sheet = state at a point; P&L = success over a period."
            },
            {
                question: "What types of revenue and expenditure appear in the P&L?",
                answer: "Revenue: operating (core activity), financial (interest, dividends), and other (grants, sale of fixed assets, write-offs). Expenditure: operating, financial (interest on external funds), and other. Only expenditures incurred to create effects count as costs.",
                explanation: "Income raises capital; expenditure reduces it."
            },
            {
                question: "How is the business (financial) result calculated?",
                answer: "Income − Expenditure = financial result. If Income > Expenditure → Profit (successful); if Expenditure > Income → Loss (unsuccessful).",
                explanation: "Always expressed in value, via the P&L at period end."
            },
            {
                question: "Which principles govern business accounting?",
                answer: "Continuity (comparability — no unjustified change of method), realisation (revenue linked to turnover, not collection), causality (link income & expenditure by accounting period), and prudence (recognise not only realised but also incurred losses).",
                explanation: "Ensure reliable, comparable statements."
            },
            {
                question: "How can the business result be improved?",
                answer: "By raising income with unchanged expenditure; by cutting expenditure with unchanged income; by a greater rise in income than in expenditure; or by a greater cut in expenditure than the fall in income.",
                explanation: "Four basic improvement paths."
            },
            {
                question: "What are the five basic concepts of company value?",
                answer: "Accounting value, reproduction (replacement) value, liquidation value, market value, and economic value.",
                explanation: "Each defined differently by the valuation approach."
            },
            {
                question: "Compare accounting, liquidation and reproduction value (with formulas).",
                answer: "Accounting value Vk = Ik − Ok (assets − liabilities, balance-sheet based). Liquidation value Vl = Il − Ol (value in a forced sale − liabilities) = the minimum value. Reproduction (replacement) value Vr = Ir − Or (cost to rebuild the same company − liabilities).",
                explanation: "Static, asset-based methods."
            },
            {
                question: "What is the difference between static and dynamic valuation methods?",
                answer: "Static methods estimate value from the assets on a given day (balance-sheet data). Dynamic methods estimate value from future business success/profit (P&L data) — e.g. Price/Earnings (P/E) method, dividend method, and cash-flow analysis method.",
                explanation: "Static = present assets; dynamic = future earnings."
            }
        ],

        quiz: [
            {
                question: "The business result in value terms is:",
                options: ["Total revenue only", "Total assets minus liabilities", "Total revenue minus total expenditure", "Equity plus liabilities"],
                correct: 2
            },
            {
                question: "Which report is STATIC (a snapshot at a point in time)?",
                options: ["Profit and loss statement", "Balance sheet", "Cash flow statement", "Report on retained earnings"],
                correct: 1
            },
            {
                question: "The fundamental balance-sheet equation is:",
                options: ["Assets = Revenue − Costs", "Assets = Liabilities + Equity", "Profit = Income + Expenditure", "Equity = Assets + Liabilities"],
                correct: 1
            },
            {
                question: "USALI was created in 1926 by the:",
                options: ["EU Commission", "Hotel Association of New York", "IFRS Foundation", "Croatian Chamber of Economy"],
                correct: 1
            },
            {
                question: "In Croatia, large/public companies report under:",
                options: ["Croatian Accounting Standards only", "USALI only", "IFRS", "No standard"],
                correct: 2
            },
            {
                question: "Equity is mathematically equal to:",
                options: ["Total assets", "Total assets minus all liabilities", "Total liabilities", "Revenue minus expenditure"],
                correct: 1
            },
            {
                question: "The accounting principle requiring revenue to be linked to turnover (not collection) is the:",
                options: ["Prudence principle", "Continuity principle", "Realisation principle", "Causality principle"],
                correct: 2
            },
            {
                question: "The liquidation value of a company represents the:",
                options: ["Maximum market value", "Minimum value realisable in a forced sale", "Cost to rebuild the company", "Present value of future dividends"],
                correct: 1
            },
            {
                question: "Dynamic valuation methods (P/E, dividend, cash flow) are based on:",
                options: ["Balance-sheet assets on a given day", "Future business success / profit", "Liquidation proceeds", "Reproduction cost"],
                correct: 1
            },
            {
                question: "Which is NOT one of the five concepts of company value?",
                options: ["Accounting value", "Liquidation value", "Reproduction value", "Seasonal value"],
                correct: 3
            }
        ],

        fillBlanks: [
            {
                sentence: "Income − Expenditure = the business (financial) _______.",
                answer: "result",
                hint: "Profit or loss..."
            },
            {
                sentence: "The balance sheet is a _______ report (a snapshot at a point in time).",
                answer: "static",
                hint: "Opposite of dynamic..."
            },
            {
                sentence: "Assets = Liabilities + _______.",
                answer: "Equity",
                hint: "Owners' capital..."
            },
            {
                sentence: "_______ is the global hotel reporting standard created in 1926 in New York.",
                answer: "USALI",
                hint: "Uniform System of Accounts for the Lodging Industry..."
            },
            {
                sentence: "If expenditure exceeds income, the company makes a _______.",
                answer: "loss",
                hint: "Negative result..."
            },
            {
                sentence: "The accounting value of a company is Vk = Ik − _______.",
                answer: "Ok",
                hint: "Accounting value of liabilities..."
            },
            {
                sentence: "Static valuation uses balance-sheet data; _______ valuation uses future profit.",
                answer: "dynamic",
                hint: "P/E, dividend, cash-flow methods..."
            },
            {
                sentence: "Large and public companies in Croatia report under _______ standards.",
                answer: "IFRS",
                hint: "International Financial Reporting Standards..."
            }
        ],

        learn: {
            title: "Unit 6 — The Business Result of the Hospitality Company",
            content: `
                <h3>1) The Business Result</h3>
                <div class="formula-box">
                    <p><strong>Physical:</strong> the product/service delivered (overnight stays, meals)</p>
                    <p><strong>Value:</strong> Income − Expenditure → Profit (&gt;0) or Loss (&lt;0)</p>
                </div>

                <h3>2) Financial Reports</h3>
                <ul>
                    <li><strong>Balance sheet</strong> — static (position at a point in time)</li>
                    <li><strong>Profit and Loss (P&L)</strong> — dynamic (performance over a period)</li>
                    <li><strong>Report on retained earnings</strong> and <strong>Cash flow statement</strong></li>
                </ul>
                <p><strong>Standards:</strong> IFRS (large/public) · Croatian Accounting Standards 2008 (SMEs) · <strong>USALI</strong> (hotel benchmarking, created 1926, Hotel Association of New York).</p>

                <h3>3) Balance Sheet</h3>
                <div class="formula-box">
                    <p><strong>Assets = Liabilities + Equity</strong> &nbsp;(Equity = Assets − Liabilities)</p>
                </div>
                <ul>
                    <li>By date: budgetary (planned) vs invoicing (actual)</li>
                    <li>Sources of assets — by ownership (own / borrowed); by maturity (short / long / permanent)</li>
                    <li>Off-balance-sheet assets/liabilities = others' assets temporarily used</li>
                </ul>

                <h3>4) Profit & Loss Statement</h3>
                <p>Elements: Income → Expenditure → Profit/Loss before tax → Income tax → <strong>Profit after tax (operating result)</strong>.</p>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Revenue</strong></td><td>Operating (core) · Financial (interest, dividends) · Other (grants, asset sales)</td></tr>
                    <tr><td><strong>Expenditure</strong></td><td>Operating · Financial (interest) · Other (unplanned, losses)</td></tr>
                </table>
                <p><strong>Accounting principles:</strong> continuity (comparability), realisation, causality, prudence.</p>

                <h3>5) Improving the Result</h3>
                <ul>
                    <li>↑ income (unchanged expenditure) or ↓ expenditure (unchanged income)</li>
                    <li>income rising faster than expenditure, or expenditure falling faster than income</li>
                    <li>Profit → reinvested, distributed to owners, or used to repay debt</li>
                </ul>

                <h3>6) Company Valuation</h3>
                <div class="formula-box">
                    <p><strong>Accounting:</strong> Vk = Ik − Ok &nbsp;|&nbsp; <strong>Liquidation:</strong> Vl = Il − Ol &nbsp;|&nbsp; <strong>Reproduction:</strong> Vr = Ir − Or</p>
                </div>
                <ul>
                    <li><strong>Static methods</strong> (assets on a given day): accounting, liquidation value</li>
                    <li><strong>Dynamic methods</strong> (future profit): P/E method, dividend method, cash-flow analysis</li>
                    <li>Non-financial factors: concessions, licenses, goodwill, brand, expected tourism growth</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 6 Exam Focus</h4>
                    <p>Know <strong>Assets = Liabilities + Equity</strong>, static vs dynamic reports/methods, the five value concepts (Vk/Vl/Vr formulas), and <strong>USALI</strong> (1926, NY).</p>
                </div>
            `
        }
    },

    unit7SuccessIndicators: {
        name: "Unit 7: Success & KPIs",
        icon: "fa-gauge-high",
        color: "#14b8a6",

        flashcards: [
            {
                question: "How is the business success of a hospitality company understood?",
                answer: "As a complex result of the interaction of internal and external factors. It is defined relative to the company's economic objectives (it is not just technical/architectural quality).",
                explanation: "Success = quality of the 'economy' relative to economic goals."
            },
            {
                question: "What are the three economic benchmarks of business success?",
                answer: "Labour productivity, Economy (frugality), and Profitability.",
                explanation: "The classic trio of economic-efficiency measures."
            },
            {
                question: "What three types of indicator comparison exist?",
                answer: "Planned comparison (realised vs planned), comparison over time (vs a baseline/previous period), and spatial comparison (one location vs another).",
                explanation: "Used to reliably assess activity."
            },
            {
                question: "What is labour productivity and how is it measured in hotels?",
                answer: "The effort to achieve the greatest output/turnover with the least human labour. Measured by e.g. realised nights per employee or beds (rooms) per employee. The optimum is about 3.5–5 beds per employee.",
                explanation: "Higher productivity → lower cost price, higher competitiveness."
            },
            {
                question: "What is economy (frugality) and its coefficient values?",
                answer: "The degree of economy in achieving effects = ratio of effects achieved to elements consumed (value: total realisation ÷ total costs). E > 1 = economical; E = 1 = at the limit; E < 1 = uneconomical.",
                explanation: "Raised by cutting input/prices or raising output/sales prices."
            },
            {
                question: "What is profitability?",
                answer: "An economic measure of success showing the return on invested capital in a period — the ratio between the business result (profit) and the invested capital.",
                explanation: "Profit relative to capital."
            },
            {
                question: "How do productivity, economy and profitability interrelate?",
                answer: "They can move together or in opposite directions. E.g. replacing labour with expensive machines can raise productivity but lower economy; higher labour productivity usually raises profitability (less labour per unit).",
                explanation: "Not always aligned."
            },
            {
                question: "Which factors determine a hospitality company's success?",
                answer: "Natural, human, organisational, social and technical factors. Profitability is additionally affected by the turnover rate, utilisation of fixed assets, credit/tax policy, and the level of financial/extraordinary income and expenditure.",
                explanation: "Internal + external factors interact."
            },
            {
                question: "What is ADR and how is it calculated?",
                answer: "Average Daily Rate — the daily average revenue per sold room. ADR = Room Revenue / Sold Rooms. (e.g. €10,000 / 50 = €200.)",
                explanation: "A core hotel KPI."
            },
            {
                question: "What is ARR (Average Room Rate)?",
                answer: "The longer-term average rate per occupied room. ARR = Total Room Revenue / Total Occupied Rooms.",
                explanation: "Similar to ADR but over a longer term."
            },
            {
                question: "What is RevPAR and how is it calculated?",
                answer: "Revenue Per Available Room — measures revenue-generation efficiency. RevPAR = Room Revenue / Available Rooms. (e.g. €10,000 / 100 = €100.) It reflects both rate and occupancy.",
                explanation: "Uses available (not just sold) rooms."
            },
            {
                question: "What is TRevPAR?",
                answer: "Total Revenue Per Available Room — broader than RevPAR. TRevPAR = Total Revenue / Available Rooms (includes F&B, wellness, etc.).",
                explanation: "Captures all revenue, not only rooms."
            },
            {
                question: "What is GOP and GOPPAR?",
                answer: "GOP (Gross Operating Profit) = Gross Operating Revenue − Gross Operating Expenses. GOPPAR (GOP per Available Room) = GOP / Available Rooms — combines profitability with room inventory.",
                explanation: "Profitability KPIs."
            },
            {
                question: "What are NOP and EBITDA?",
                answer: "NOP (Net Operating Profit) = Total Revenue − Operating Costs. EBITDA = Earnings Before Interest, Taxes, Depreciation and Amortization = Revenue − Expenses (excluding interest, taxes, depreciation).",
                explanation: "'What gets measured, gets managed.'"
            },
            {
                question: "On which system are hospitality KPIs based?",
                answer: "On the Uniform System of Accounts for the Lodging Industry (USALI) — enabling benchmarking against competitors and real-time performance tracking.",
                explanation: "KPIs = quantifiable financial/operational metrics."
            }
        ],

        quiz: [
            {
                question: "The three economic benchmarks of business success are:",
                options: ["Liquidity, solvency, turnover", "Labour productivity, economy, profitability", "ADR, RevPAR, GOP", "Income, expenditure, profit"],
                correct: 1
            },
            {
                question: "A company is economical when its economy coefficient is:",
                options: ["E < 1", "E = 0", "E > 1", "E = 0.5"],
                correct: 2
            },
            {
                question: "ADR (Average Daily Rate) is calculated as:",
                options: ["Room Revenue / Available Rooms", "Room Revenue / Sold Rooms", "Total Revenue / Available Rooms", "GOP / Available Rooms"],
                correct: 1
            },
            {
                question: "RevPAR is calculated as:",
                options: ["Room Revenue / Sold Rooms", "Total Revenue / Sold Rooms", "Room Revenue / Available Rooms", "GOP / Sold Rooms"],
                correct: 2
            },
            {
                question: "TRevPAR differs from RevPAR because it uses:",
                options: ["Only room revenue", "Total revenue (all departments)", "Only sold rooms", "Gross operating profit"],
                correct: 1
            },
            {
                question: "GOP (Gross Operating Profit) equals:",
                options: ["Revenue / Available Rooms", "Gross Operating Revenue − Gross Operating Expenses", "Revenue − Interest − Taxes", "Total Revenue / Sold Rooms"],
                correct: 1
            },
            {
                question: "The optimal number of beds per employee in hotels is about:",
                options: ["1–2", "3.5–5", "8–10", "15–20"],
                correct: 1
            },
            {
                question: "Profitability measures:",
                options: ["Output per worker", "Effects ÷ elements consumed", "Return on invested capital", "Rooms sold per day"],
                correct: 2
            },
            {
                question: "EBITDA excludes:",
                options: ["Revenue", "Operating wages", "Interest, taxes, depreciation & amortization", "Food costs"],
                correct: 2
            },
            {
                question: "GOPPAR is calculated as:",
                options: ["GOP / Available Rooms", "GOP / Sold Rooms", "Revenue / GOP", "Total Revenue / Available Rooms"],
                correct: 0
            }
        ],

        fillBlanks: [
            {
                sentence: "The three economic benchmarks are labour productivity, economy and _______.",
                answer: "profitability",
                hint: "Return on capital..."
            },
            {
                sentence: "A company is economical when the economy coefficient E is greater than _______.",
                answer: "1",
                hint: "Single digit..."
            },
            {
                sentence: "ADR = Room Revenue / _______ Rooms.",
                answer: "Sold",
                hint: "Rooms actually occupied..."
            },
            {
                sentence: "RevPAR = Room Revenue / _______ Rooms.",
                answer: "Available",
                hint: "All rooms, sold or not..."
            },
            {
                sentence: "GOP = Gross Operating Revenue − Gross Operating _______.",
                answer: "Expenses",
                hint: "Costs of operating..."
            },
            {
                sentence: "_______ Revenue Per Available Room (TRevPAR) includes all departments.",
                answer: "Total",
                hint: "Broader than RevPAR..."
            },
            {
                sentence: "The optimum is roughly 3.5 to _______ beds per employee.",
                answer: "5",
                hint: "Single digit..."
            },
            {
                sentence: "EBITDA = earnings before interest, taxes, depreciation and _______.",
                answer: "amortization",
                hint: "Writing off intangibles..."
            }
        ],

        learn: {
            title: "Unit 7 — Success & Economic Indicators (KPIs)",
            content: `
                <h3>1) Business Success</h3>
                <p>A complex result of <strong>internal and external factors</strong>, judged against the company's <strong>economic objectives</strong> (continuity, profitability, serving stakeholders, expansion).</p>

                <h3>2) The Three Economic Benchmarks</h3>
                <div class="formula-box">
                    <p><strong>Labour productivity</strong> — max output with min labour (nights or beds per employee; optimum 3.5–5 beds/employee)</p>
                    <p><strong>Economy</strong> = effects ÷ elements consumed → E&gt;1 economical · E=1 limit · E&lt;1 uneconomical</p>
                    <p><strong>Profitability</strong> = business result (profit) ÷ invested capital</p>
                </div>
                <p>Comparison types: <strong>planned</strong>, <strong>over time</strong>, <strong>spatial</strong>. They can move together or diverge (e.g. machines raise productivity but may lower economy).</p>

                <h3>3) Hotel KPIs (based on USALI)</h3>
                <p><em>"What gets measured, gets managed."</em></p>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>ARR</strong></td><td>Total Room Revenue / Total Occupied Rooms</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>ADR</strong></td><td>Room Revenue / Sold Rooms</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>RevPAR</strong></td><td>Room Revenue / Available Rooms</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>TRevPAR</strong></td><td>Total Revenue / Available Rooms</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>GOP</strong></td><td>Gross Operating Revenue − Gross Operating Expenses</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>GOPPAR</strong></td><td>GOP / Available Rooms</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>NOP</strong></td><td>Total Revenue − Operating Costs</td></tr>
                    <tr><td><strong>EBITDA</strong></td><td>Revenue − Expenses (excl. interest, taxes, depreciation)</td></tr>
                </table>

                <h3>4) Success Factors</h3>
                <p>Natural · human · organisational · social · technical. Profitability is also driven by turnover rate, fixed-asset utilisation, credit/tax policy, and financial/extraordinary income & expenditure.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 7 Exam Focus</h4>
                    <p>Memorise the <strong>KPI formulas</strong> — especially the difference between <strong>ADR</strong> (÷ sold rooms) and <strong>RevPAR</strong> (÷ available rooms), and <strong>RevPAR vs TRevPAR</strong>. Know <strong>E&gt;1/=1/&lt;1</strong> and the 3.5–5 beds/employee optimum.</p>
                </div>
            `
        }
    },

    unit8PricePolicy: {
        name: "Unit 8: Price Policy",
        icon: "fa-tag",
        color: "#f59e0b",

        flashcards: [
            {
                question: "Why is price important in hospitality?",
                answer: "Price completes the hospitality product (without it the product is undefined), reflects its value, and is a constitutive element of the tourism market that directly affects demand.",
                explanation: "Price is a key positioning tool."
            },
            {
                question: "What are the basic objectives of pricing policy?",
                answer: "Ensuring uniformity of pricing within units, influencing customer behaviour, and controlling behaviour / harmonising prices with legal regulations.",
                explanation: "Pricing policy = the process of pricing decisions."
            },
            {
                question: "How are hospitality prices grouped?",
                answer: "Accommodation prices (board, half board, overnight stays, day rentals, mobile homes, household accommodation) and prices for other services (F&B, wellness, events). Accommodation prices position the hotel on the foreign market.",
                explanation: "Two basic groups."
            },
            {
                question: "How does pricing differ between hotel types?",
                answer: "Business-centre (urban) hotels operate year-round with fairly consistent occupancy and prices; tourist-destination hotels operate seasonally — in the 2–3 month high season prices are raised to the competitive maximum to cover fixed costs and earn a reasonable profit.",
                explanation: "Seasonality drives price differentiation."
            },
            {
                question: "What criteria are used for price differentiation?",
                answer: "Intensity of tourist demand (season), time of purchase, category of tourist (individuals/families/groups), number of bookings (group/long-stay discounts), position in the sales channel (agency commission), and utilisation/geographical criteria (domestic vs foreign guests).",
                explanation: "Many criteria beyond just season."
            },
            {
                question: "What are the three groups of pricing methods?",
                answer: "Cost-oriented ('cost-plus' — costs + desired profit, ignores supply/demand), market-oriented (demand-oriented and lowest-price methods), and competition-oriented (responding to rivals to grow sales/market share).",
                explanation: "Three method families."
            },
            {
                question: "How do costs and demand set price limits?",
                answer: "Costs determine the lower limit (below which the business makes a loss), while the actual selling price is determined by tourist demand. Demand has the dominant influence on the price of the hospitality product.",
                explanation: "Cost = floor; demand = actual price."
            },
            {
                question: "What internal and external factors influence selling prices?",
                answer: "External: market development, product life cycle, product differentiation, consumer buying behaviour, price elasticity, competition. Internal: costs and working conditions (which affect, but don't dominate, price formation).",
                explanation: "External factors dominate."
            },
            {
                question: "Which product life-cycle phases matter most for pricing?",
                answer: "The introduction phase (price reflects invested resources), the decline phase (price-reduction policy to hold market position), and the revitalisation phase (modernising and enriching the offer).",
                explanation: "Phase shapes pricing strategy."
            },
            {
                question: "What is price elasticity of demand?",
                answer: "The sensitivity of demand to price changes — in practice, falling traffic when prices rise, or rising traffic when prices fall.",
                explanation: "Key for stimulating pricing policy."
            },
            {
                question: "What is calculation (costing) and its purpose?",
                answer: "From Latin 'calculus' (counting stone) — the method used to calculate prices: to include and distribute costs and check whether the price covers the elements used. It supports standard/prime-cost calculation, analysis, planning and comparison.",
                explanation: "Costing underpins pricing."
            },
            {
                question: "What are the elements of the classic sales-price calculation?",
                answer: "Direct material costs + amortisation + gross wages + other direct costs + general production costs + general administrative costs = I. Cost price; + profit/loss = II. sales price without tax; + sales tax = III. sales price.",
                explanation: "Selling price = cost price + margin + VAT."
            },
            {
                question: "What is the difference between prior and post calculation?",
                answer: "Prior (planned) calculation is done before the period, based on consumption/labour standards, to set prices in advance. Post (accounting) calculation is done at period end to determine actual costs and check the prior calculation (identify deviations).",
                explanation: "Planned vs actual."
            },
            {
                question: "What is the margin (marža) and what must it cover?",
                answer: "The margin must cover all indirect business costs and accumulation (planned profit) — i.e. indirect material costs, services, advertising, depreciation, gross personnel costs, etc. It can be raised/lowered without changing the selling price.",
                explanation: "Margin varies by product type and place."
            },
            {
                question: "What is the division method vs the additional (markup) method?",
                answer: "The division method is used under complete homogeneity of assortment (limited use in hospitality). The additional method is used for a heterogeneous assortment — especially food and beverage — to calculate prices.",
                explanation: "Cost-price calculation methods."
            }
        ],

        quiz: [
            {
                question: "Costs in pricing primarily determine the:",
                options: ["Actual selling price", "Lower price limit (below which there is a loss)", "Upper price limit", "Agency commission"],
                correct: 1
            },
            {
                question: "A 'cost-plus' approach is a:",
                options: ["Market-oriented method", "Competition-oriented method", "Cost-oriented method", "Demand-oriented method"],
                correct: 2
            },
            {
                question: "The dominant influence on the price of a hospitality product is:",
                options: ["Cost", "Tourist demand", "Staff wages", "Depreciation"],
                correct: 1
            },
            {
                question: "The selling price is built as:",
                options: ["Cost price + margin + VAT", "Cost price − margin", "Margin + depreciation only", "Revenue − expenditure"],
                correct: 0
            },
            {
                question: "The additional (markup) method is mainly used for:",
                options: ["A fully homogeneous assortment", "A heterogeneous assortment (e.g. F&B)", "Only accommodation", "Only wellness services"],
                correct: 1
            },
            {
                question: "Prior (planned) calculation is carried out:",
                options: ["At the end of the period", "Before the period, based on standards", "Only for foreign markets", "Only after a loss"],
                correct: 1
            },
            {
                question: "Which is an EXTERNAL factor of price formation?",
                options: ["Working conditions", "Internal costs", "Price elasticity / competition", "Staff relationships"],
                correct: 2
            },
            {
                question: "In a tourist-destination hotel, high-season prices are raised to:",
                options: ["The legal minimum", "The competitive maximum (to cover fixed costs + profit)", "Match the low season", "Zero margin"],
                correct: 1
            },
            {
                question: "The margin must cover indirect costs and:",
                options: ["Only VAT", "Accumulation (planned profit)", "Direct material only", "Agency commission only"],
                correct: 1
            },
            {
                question: "Price elasticity of demand measures:",
                options: ["Cost per room", "Sensitivity of demand to price changes", "Fixed-cost share", "Number of sold rooms"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Costs set the _______ limit, below which the business makes a loss.",
                answer: "lower",
                hint: "Floor of the price..."
            },
            {
                sentence: "The dominant influence on the hospitality price is tourist _______.",
                answer: "demand",
                hint: "How much the market wants..."
            },
            {
                sentence: "Selling price = cost price + margin + _______.",
                answer: "VAT",
                hint: "Sales tax..."
            },
            {
                sentence: "'Cost-plus' is a _______-oriented pricing method.",
                answer: "cost",
                hint: "Based on expenses..."
            },
            {
                sentence: "The _______ method is used for a heterogeneous assortment (e.g. F&B).",
                answer: "additional",
                hint: "Markup-based..."
            },
            {
                sentence: "_______ (planned) calculation is done before the period using standards.",
                answer: "Prior",
                hint: "Opposite of post/accounting..."
            },
            {
                sentence: "Price _______ of demand is the sensitivity of demand to price changes.",
                answer: "elasticity",
                hint: "Responsiveness..."
            },
            {
                sentence: "The margin must cover indirect costs and _______ (planned profit).",
                answer: "accumulation",
                hint: "The profit component..."
            }
        ],

        learn: {
            title: "Unit 8 — Price Policy in Hospitality",
            content: `
                <h3>1) Why Price Matters</h3>
                <p>Price <strong>completes the product</strong>, reflects its value, and is a constitutive element of the tourism market that directly affects demand.</p>
                <p><strong>Objectives:</strong> uniformity within units · influencing customer behaviour · legal compliance.</p>

                <h3>2) Types of Prices & Differentiation</h3>
                <ul>
                    <li><strong>Accommodation prices</strong> (board, half-board, overnight, day rentals) vs <strong>other services</strong> (F&B, wellness)</li>
                    <li>Business-centre hotels: year-round, consistent · Destination hotels: seasonal (high-season → competitive maximum)</li>
                    <li><strong>Differentiation criteria:</strong> demand intensity, time of purchase, tourist category, number of bookings (discounts), channel position (agency commission), geography</li>
                </ul>

                <h3>3) Pricing Methods</h3>
                <div class="formula-box">
                    <p><strong>Cost-oriented</strong> ('cost-plus') · <strong>Market-oriented</strong> (demand / lowest-price) · <strong>Competition-oriented</strong></p>
                </div>
                <p><strong>Costs = lower limit</strong> (loss below it); <strong>demand = actual price</strong> (dominant).</p>
                <ul>
                    <li><strong>External factors:</strong> market development, life cycle, differentiation, consumer behaviour, elasticity, competition</li>
                    <li><strong>Internal factors:</strong> costs, working conditions (secondary)</li>
                    <li>Life-cycle phases: introduction · decline · revitalisation</li>
                </ul>

                <h3>4) Calculation (Costing)</h3>
                <p>From Latin <em>calculus</em>. Classic sales-price calculation:</p>
                <div class="formula-box">
                    <p>direct materials + amortisation + gross wages + other direct + general production + general admin = <strong>I. Cost price</strong></p>
                    <p>+ profit/loss = <strong>II. sales price (no tax)</strong> &nbsp;+ sales tax = <strong>III. sales price</strong></p>
                </div>
                <ul>
                    <li><strong>By time:</strong> prior (planned) vs post (accounting)</li>
                    <li><strong>Methods:</strong> division (homogeneous) vs additional/markup (heterogeneous — F&B)</li>
                    <li><strong>Margin</strong> covers indirect costs + accumulation (profit); varies by product/place</li>
                    <li><strong>Production calculation:</strong> only variable + relatively fixed costs in the product</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 8 Exam Focus</h4>
                    <p>Remember <strong>costs = floor, demand = actual price</strong>, the three pricing-method families, the <strong>cost price → sales price + VAT</strong> chain, and what the <strong>margin</strong> covers.</p>
                </div>
            `
        }
    },

    unit9SalesPrinciples: {
        name: "Unit 9: Principles of Sales",
        icon: "fa-handshake",
        color: "#ec4899",

        flashcards: [
            {
                question: "Why is sales central to a hospitality company?",
                answer: "Realised turnover is one of the most important indicators of business success. Sales generate revenue (from F&B and accommodation) and directly influence costs and profit — the most important means of achieving business objectives.",
                explanation: "Sales connect product with demand."
            },
            {
                question: "What does the marketing concept require?",
                answer: "Determining the needs and desires of target markets and satisfying them more successfully and effectively than the competition. Marketing connects products with demand profitably and systematically.",
                explanation: "Customer-need orientation (Kotler; UK CIM)."
            },
            {
                question: "What is the marketing mix (4P + 3P)?",
                answer: "The 4Ps: Product, Price, Place (placement), Promotion. Booms & Bitner (1981) added 3 for services: People, Process, Physical evidence (= the 7P services mix).",
                explanation: "Extended mix for services."
            },
            {
                question: "What is interactive marketing?",
                answer: "Ensuring quality through two-way communication between the parties; using an information network and connected devices for interaction between organisations and consumers (Varadarajan & Yadav, 2009).",
                explanation: "Changes pricing, selling, communication."
            },
            {
                question: "What is 'placement' in hospitality sales?",
                answer: "All efforts and measures undertaken to ensure the hospitality product reaches the tourism market and finds a customer. The product becomes a true commodity only when its utility value is confirmed on the market.",
                explanation: "Sales = a basic marketing function."
            },
            {
                question: "What makes selling hospitality services special?",
                answer: "The product cannot be presented to the market before the actual purchase, and sales (especially of accommodation) often occur many months in advance — separating sales from consumption and raising the importance of intermediaries.",
                explanation: "Drives the role of agencies/tour operators."
            },
            {
                question: "What is the goal of sales and the sales policy?",
                answer: "To sell as many products/services as possible at the most favourable financial result. Sales policy controls sales activities to achieve business policy — formulating sales objectives, principles, and the means to reach targets. It links 'production' with market demand.",
                explanation: "Sales policy = bridge to demand."
            },
            {
                question: "Which factors determine sales policy?",
                answer: "Marketing philosophy, market research, and sales pricing policy (closed offers to achieve goals: survival, maximising current profit, market-share leadership, product-quality leadership), plus promotion, sales channels and product policy.",
                explanation: "Pricing-policy goals are a frequent exam list."
            },
            {
                question: "What are the two basic sales channels?",
                answer: "Direct distribution (tourist buys directly from the producer, e.g. at hotel reception) and indirect distribution (via an intermediary — travel agency, tour operator).",
                explanation: "Direct vs indirect."
            },
            {
                question: "What does direct sale include?",
                answer: "Sales in the hotel's own sales department / reception, via the own network of outlets, by mail/order, and via video technology and the company's own reservation system (and own website).",
                explanation: "No intermediary → lower distribution costs."
            },
            {
                question: "What is a reservation (booking) and its required elements?",
                answer: "Securing a service in advance (room, meal, etc.). Made in writing, it includes: guest name, dates (arrival/first service, departure/last service), type of service & number of persons, and price & terms of payment.",
                explanation: "Can depend on a deposit; 'last minute' sells unsold capacity."
            },
            {
                question: "What does indirect sale include, and what are tour operators known for?",
                answer: "Sale via tour operators, travel agencies, or transport organisations. Tour operators use the 'law of large numbers', renting large capacities in advance — securing occupancy for providers.",
                explanation: "Intermediaries cover the vast market."
            },
            {
                question: "What commissions do agencies receive, and how much capacity is given to them?",
                answer: "Domestic agencies receive about 3% of revenue; foreign agencies about 11%. A hospitality company usually makes about 50% of its capacity available to agencies and sells the rest directly.",
                explanation: "Agencies bring occupancy certainty and longer stays."
            },
            {
                question: "Which contracts underpin indirect sales?",
                answer: "Allotment contract (hotelier reserves capacity for a tour operator for a period/season/year), capacity-rental contract (hotel rents part of capacity with staff/inventory for an agreed fee), and a contract based on a reservation (confirmed booking).",
                explanation: "Three contract types."
            },
            {
                question: "How has the Internet changed hospitality sales?",
                answer: "It enabled rapid information dissemination, direct booking platforms (e.g. Booking.com) and lower distribution costs, giving global market access and changing classic business methods (communication, transactions, distribution).",
                explanation: "A global megatrend."
            }
        ],

        quiz: [
            {
                question: "The classic marketing mix (4Ps) consists of:",
                options: ["People, Process, Physical evidence, Price", "Product, Price, Place, Promotion", "Product, People, Profit, Promotion", "Price, Place, Process, People"],
                correct: 1
            },
            {
                question: "Booms & Bitner (1981) added which 3 elements for services?",
                options: ["Profit, Process, People", "People, Process, Physical evidence", "Place, Promotion, Price", "People, Profit, Placement"],
                correct: 1
            },
            {
                question: "Selling directly at hotel reception is an example of:",
                options: ["Indirect distribution", "Direct distribution", "Allotment", "Tour operating"],
                correct: 1
            },
            {
                question: "Tour operators are known for using the:",
                options: ["Law of diminishing returns", "Law of large numbers (renting capacity in advance)", "Cost-plus method", "Break-even rule"],
                correct: 1
            },
            {
                question: "Foreign travel agencies typically receive a commission of about:",
                options: ["3%", "5%", "11%", "25%"],
                correct: 2
            },
            {
                question: "A hospitality company usually makes about what share of capacity available to agencies?",
                options: ["10%", "30%", "50%", "90%"],
                correct: 2
            },
            {
                question: "A contract where the hotelier reserves capacity for a tour operator for a season is a(n):",
                options: ["Allotment contract", "Employment contract", "Insurance contract", "Lease of land"],
                correct: 0
            },
            {
                question: "A special challenge of selling hospitality services is that:",
                options: ["Prices never change", "The product cannot be presented before purchase", "There are no intermediaries", "Demand is always constant"],
                correct: 1
            },
            {
                question: "Which is a sales-pricing-policy goal?",
                options: ["Reducing room count", "Market-share leadership", "Avoiding all promotion", "Eliminating reservations"],
                correct: 1
            },
            {
                question: "A required element of a written reservation is:",
                options: ["The competitor's price", "Guest name, dates, service type, price & payment terms", "The hotel's tax return", "The agency's profit margin"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The 4Ps of the marketing mix are product, price, place and _______.",
                answer: "promotion",
                hint: "Communicating the offer..."
            },
            {
                sentence: "Booms & Bitner added people, process and physical _______.",
                answer: "evidence",
                hint: "The service environment..."
            },
            {
                sentence: "Selling without an intermediary is _______ distribution.",
                answer: "direct",
                hint: "Straight to the tourist..."
            },
            {
                sentence: "Tour operators apply the law of large _______ to rent capacity in advance.",
                answer: "numbers",
                hint: "Quantities..."
            },
            {
                sentence: "Foreign agencies receive a commission of about _______%.",
                answer: "11",
                hint: "Two digits (domestic is 3%)..."
            },
            {
                sentence: "A hotel usually makes about _______% of its capacity available to agencies.",
                answer: "50",
                hint: "Half..."
            },
            {
                sentence: "An _______ contract reserves capacity for a tour operator for a period/season.",
                answer: "allotment",
                hint: "Capacity set aside..."
            },
            {
                sentence: "Online platforms such as _______ lowered distribution costs and widened reach.",
                answer: "Booking.com",
                hint: "Major OTA..."
            }
        ],

        learn: {
            title: "Unit 9 — Principles of Sales in Hospitality",
            content: `
                <h3>1) Importance of Sales</h3>
                <p>Realised turnover is a key success indicator; sales generate revenue and shape costs and profit. Sales connect the product with demand.</p>

                <h3>2) Marketing & the Mix</h3>
                <div class="formula-box">
                    <p><strong>4P:</strong> Product · Price · Place · Promotion</p>
                    <p><strong>+3P (Booms & Bitner, 1981):</strong> People · Process · Physical evidence</p>
                </div>
                <p><strong>Interactive marketing</strong> (Varadarajan & Yadav, 2009) = quality via two-way communication over information networks.</p>

                <h3>3) Selling Hospitality Services</h3>
                <ul>
                    <li><strong>Placement</strong> = all measures to get the product to market and find a customer</li>
                    <li>Special difficulty: the product can't be shown before purchase; sales often months in advance</li>
                    <li>→ raises the importance of <strong>intermediaries</strong></li>
                </ul>

                <h3>4) Sales Policy & Pricing Goals</h3>
                <p>Sales policy links 'production' with demand. Sales-pricing-policy goals: <strong>survival, maximising current profit, market-share leadership, product-quality leadership</strong>.</p>

                <h3>5) Sales Channels</h3>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Direct</strong></td><td>Own reception/department, own network, mail/order, own reservation system & website</td></tr>
                    <tr><td><strong>Indirect</strong></td><td>Tour operators, travel agencies, transport organisations</td></tr>
                </table>
                <ul>
                    <li><strong>Reservation:</strong> written — guest name, dates, service type & persons, price & payment terms</li>
                    <li>Tour operators use the <strong>'law of large numbers'</strong>; "last minute" sells unsold capacity</li>
                    <li><strong>Commissions:</strong> domestic agencies ~3%, foreign ~11%; ~50% of capacity given to agencies</li>
                    <li><strong>Contracts:</strong> allotment · capacity rental · reservation-based</li>
                    <li><strong>Internet</strong> (Booking.com): global reach, lower distribution costs</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 9 Exam Focus</h4>
                    <p>Know the <strong>4P + 3P</strong>, <strong>direct vs indirect</strong> channels, the three <strong>contracts</strong> (allotment/rental/reservation), and the numbers: <strong>3% / 11% commission, ~50% capacity</strong>.</p>
                </div>
            `
        }
    },

    unit10InvestmentProfitability: {
        name: "Unit 10: Investment Profitability",
        icon: "fa-money-bill-trend-up",
        color: "#10b981",

        flashcards: [
            {
                question: "What do investments include in hospitality?",
                answer: "Investments in both material assets (buildings, equipment) and non-material assets (education, science, human capital). They aim to enhance service quality, capacity and competitiveness.",
                explanation: "Broad scope of investment."
            },
            {
                question: "What are the three components of an investment?",
                answer: "The success component (contribute to future success), the liquidity component (strengthen liquidity/solvency), and the risk component (planned values, tasks and returns under risk).",
                explanation: "Every investment balances these."
            },
            {
                question: "What are the motives for investing?",
                answer: "Modernising equipment/service, expanding capacity, innovation and scientific development, and increasing short- and long-term assets. Motives split into social needs and the company's own investment needs.",
                explanation: "Needs drive investment objectives."
            },
            {
                question: "What are gross, net and new investments?",
                answer: "Gross = total investments from all sources. Net = gross minus depreciation. New = net investments increased by investments financed from the free part of depreciation/amortisation.",
                explanation: "By source of financing."
            },
            {
                question: "What are the investment types by effect on the process?",
                answer: "Replacement investments (replace worn equipment), rationalisation/modernisation investments (raise efficiency, cut costs, improve quality), and expansion investments (new facilities/services to grow output).",
                explanation: "By purpose in the process."
            },
            {
                question: "How is investment structured?",
                answer: "Investments in fixed assets (raise production/service capacity) and investments in working capital (enable normal-capacity operation), plus intangible investments (staff training, studies, research).",
                explanation: "Fixed vs working capital."
            },
            {
                question: "What is the technical structure of fixed-asset investment?",
                answer: "Land and infrastructure; building facilities (accommodation + F&B); equipment (transport, HVAC, laundry, kitchen machines); and other investments (studies, projects, staff training).",
                explanation: "Where the capital goes physically."
            },
            {
                question: "What are the development-policy principles for investment?",
                answer: "Liquidity (convert assets to cash to meet obligations), Security (achieve objectives under risk without jeopardising survival), and Profitability (highest possible profit relative to capital invested).",
                explanation: "Guide the investment process."
            },
            {
                question: "What phases does an investment decision pass through?",
                answer: "Emergence of the idea/need; determining possible/acceptable solutions; choosing judgement methods to evaluate acceptability; and the final investment decision (based on investment documentation).",
                explanation: "A multi-phase business decision."
            },
            {
                question: "What are the three phases of planning the investment process?",
                answer: "Preparation phase, evaluation phase, and implementation phase. Studies: pre-investment study, investment study, and performance study.",
                explanation: "Phased project planning."
            },
            {
                question: "Which analyses are done when preparing an investment project?",
                answer: "Market analysis, procurement-market analysis, technical-technological analysis, location analysis, and economic-financial analysis.",
                explanation: "Location is critical ('location, location, location' — Hilton)."
            },
            {
                question: "When is an investment project solvent?",
                answer: "When its net cash flow is equal to or greater than zero; it is insolvent if the net cash flow is negative. Insolvency can be resolved by reducing planned investment and/or increasing financing.",
                explanation: "Solvency of the project."
            },
            {
                question: "Which methods evaluate the profitability of an investment project?",
                answer: "The rate-of-return method, the annuity method, the present-value (NPV) method, and the return-on-invested-capital (payback) method. The annuity method is the most commonly used in hospitality.",
                explanation: "Annuity = amount used to repay a loan over time."
            },
            {
                question: "What methods plan the realisation of an investment project?",
                answer: "Linear programming (developed by American mathematician George Dantzig) and network planning (visualising activities and their interdependencies in a network diagram).",
                explanation: "Implementation = construction prep, construction, service prep."
            }
        ],

        quiz: [
            {
                question: "Net investment is calculated as:",
                options: ["Gross investment + depreciation", "Gross investment − depreciation", "Working capital + fixed assets", "Revenue − costs"],
                correct: 1
            },
            {
                question: "An investment aimed at replacing worn-out equipment is a(n):",
                options: ["Expansion investment", "Rationalisation investment", "Replacement investment", "New investment"],
                correct: 2
            },
            {
                question: "The three development-policy principles for investment are:",
                options: ["Liquidity, security, profitability", "Product, price, promotion", "ADR, RevPAR, GOP", "Gross, net, new"],
                correct: 0
            },
            {
                question: "The method most commonly used to assess investment profitability in hospitality is the:",
                options: ["Rate-of-return method", "Annuity method", "Present-value method", "Payback method"],
                correct: 1
            },
            {
                question: "An investment project is solvent when its net cash flow is:",
                options: ["Negative", "Equal to or greater than zero", "Always zero", "Less than the investment"],
                correct: 1
            },
            {
                question: "Investments in working capital primarily enable the company to:",
                options: ["Increase production capacity", "Operate at normal capacity", "Replace the building", "Pay dividends"],
                correct: 1
            },
            {
                question: "The famous 'location, location, location' answer is attributed to the founder of:",
                options: ["Booking.com", "Hilton hotels", "Marriott", "USALI"],
                correct: 1
            },
            {
                question: "Linear programming as a realisation-planning method was developed by:",
                options: ["Philip Kotler", "George Dantzig", "Eugen Schmalenbach", "Alfred Marshall"],
                correct: 1
            },
            {
                question: "Which is NOT a phase of planning the investment process?",
                options: ["Preparation", "Evaluation", "Implementation", "Liquidation"],
                correct: 3
            },
            {
                question: "New investments are net investments increased by funds from:",
                options: ["Loans only", "The free part of depreciation/amortisation", "Share issues only", "Government grants only"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Net investment = gross investment − _______.",
                answer: "depreciation",
                hint: "Amortisation deducted..."
            },
            {
                sentence: "Investments aimed at replacing worn equipment are _______ investments.",
                answer: "replacement",
                hint: "Swap old for new..."
            },
            {
                sentence: "The development principles are liquidity, security and _______.",
                answer: "profitability",
                hint: "Return on capital..."
            },
            {
                sentence: "The _______ method is the most common for assessing investment profitability in hospitality.",
                answer: "annuity",
                hint: "Loan-repayment amount over time..."
            },
            {
                sentence: "A project is solvent if its net cash flow is equal to or greater than _______.",
                answer: "zero",
                hint: "The break point..."
            },
            {
                sentence: "Investments in _______ capital enable operation at normal capacity.",
                answer: "working",
                hint: "Day-to-day funds..."
            },
            {
                sentence: "Location analysis is vital — recall the Hilton founder: 'location, location, _______'.",
                answer: "location",
                hint: "Same word three times..."
            },
            {
                sentence: "Linear programming was developed by George _______.",
                answer: "Dantzig",
                hint: "American mathematician..."
            }
        ],

        learn: {
            title: "Unit 10 — Profitability of Investments in Hospitality",
            content: `
                <h3>1) Scope & Motives</h3>
                <p>Investments cover <strong>material</strong> (buildings, equipment) and <strong>non-material</strong> assets (education, science, human capital), aiming to enhance quality, capacity and competitiveness.</p>
                <p><strong>Components:</strong> success · liquidity · risk. <strong>Motives:</strong> modernisation, capacity expansion, innovation, asset growth (social needs + company needs).</p>

                <h3>2) Types of Investment</h3>
                <ul>
                    <li><strong>By source:</strong> gross · net (gross − depreciation) · new (net + free depreciation)</li>
                    <li><strong>By effect:</strong> replacement · rationalisation (modernisation) · expansion</li>
                    <li><strong>By structure:</strong> fixed assets (capacity) · working capital (operation) · intangible (training, studies)</li>
                </ul>

                <h3>3) Development Principles</h3>
                <div class="formula-box">
                    <p><strong>Liquidity</strong> · <strong>Security</strong> · <strong>Profitability</strong></p>
                </div>

                <h3>4) Investment Decision & Project</h3>
                <ul>
                    <li><strong>Decision phases:</strong> idea/need → alternatives → evaluation methods → final decision (on documentation)</li>
                    <li><strong>Planning phases:</strong> preparation → evaluation → implementation</li>
                    <li><strong>Studies:</strong> pre-investment · investment · performance</li>
                    <li><strong>Analyses:</strong> market, procurement, technical-technological, location ("location, location, location" — Hilton), economic-financial</li>
                </ul>

                <h3>5) Evaluating Profitability</h3>
                <ul>
                    <li>Methods: rate-of-return · <strong>annuity (most common in hospitality)</strong> · present value (NPV) · return on invested capital (payback)</li>
                    <li><strong>Solvency:</strong> project is solvent if net cash flow ≥ 0 (insolvent if negative)</li>
                    <li><strong>Realisation planning:</strong> linear programming (George Dantzig) · network planning</li>
                    <li><strong>Implementation:</strong> construction preparation → construction → preparation of services</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 10 Exam Focus</h4>
                    <p>Know <strong>gross/net/new</strong> and <strong>replacement/rationalisation/expansion</strong> investments, the three <strong>development principles</strong>, the <strong>evaluation methods</strong> (annuity = most common), and project <strong>solvency (NCF ≥ 0)</strong>.</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.economicsHospitalityM2Data = economicsHospitalityM2Data; }
