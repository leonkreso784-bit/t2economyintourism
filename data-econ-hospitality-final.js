// ===== ECONOMICS IN HOSPITALITY - FINAL EXAM =====
// Course final (MODUL 3, written exam = 30% per the syllabus) covers ALL topics T2-T12 = Units 1-10.
// Structure = HYBRID (same pattern as data-marketing-final.js / BI final.js):
//   economicsHospitalityFinalData = Object.assign({}, <1st midterm U1-5>, <2nd midterm U6-10>, { examPractice })
// This file MUST load LAST (after data-econ-hospitality.js and data-econ-hospitality-m2.js),
// because it merges the two window objects they expose. See data/catalog.js (content.scripts order).

// Curated cross-topic set that connects concepts across all 10 units (the kind of integrative
// questions a final exam asks). The 10 unit categories themselves are merged in below.
const economicsHospitalityExamPractice = {
    name: "Exam Practice (All Units)",
    icon: "fa-graduation-cap",
    color: "#0d9488",

    flashcards: [
        {
            question: "How do fixed costs, the break-even point and the business result connect (Units 5–6)?",
            answer: "Fixed costs (60–80% of hotel operating costs) must be covered before profit appears. The break-even point is the output where revenue = costs; below it the business result is a loss, above it a profit. So a high fixed-cost share raises the break-even quantity needed for a positive result.",
            explanation: "Cost behaviour (U5) drives the business result (U6)."
        },
        {
            question: "How do assets, amortization and company valuation connect (Units 4 & 6)?",
            answer: "Fixed assets transfer value gradually via amortization (a%=100/t); land is excluded. The accounting value of the company Vk = Ik − Ok uses the (corrected) book values of those assets minus liabilities — so depreciation policy directly shapes the company's accounting value.",
            explanation: "Assets (U4) feed the balance-sheet-based valuation (U6)."
        },
        {
            question: "How do ADR, RevPAR and pricing/occupancy connect (Units 7 & 8)?",
            answer: "ADR = Room Revenue / Sold Rooms reflects the price level; RevPAR = Room Revenue / Available Rooms blends rate AND occupancy. A pricing decision (U8) that raises ADR but cuts occupancy may leave RevPAR unchanged — so revenue management balances price and fill.",
            explanation: "KPIs (U7) measure the effect of price policy (U8)."
        },
        {
            question: "How does the sales channel affect price differentiation (Units 8 & 9)?",
            answer: "Indirect channels carry an agency commission (domestic ~3%, foreign ~11%), so the position in the sales channel is a price-differentiation criterion: direct sales avoid the commission (lower distribution cost), while agencies bring occupancy certainty for ~50% of capacity.",
            explanation: "Channels (U9) are a differentiation criterion in pricing (U8)."
        },
        {
            question: "What is the difference between cost, expenditure and expense across the course (Units 5 & 6)?",
            answer: "Cost = value of resources consumed to create an effect. Expenditure = any outflow of money. In the P&L only expenditures incurred to create effects count as expenses/costs. Cost and expenditure can differ in timing (e.g. buy land → expenditure, no cost; gift machine → cost via depreciation, no expenditure).",
            explanation: "Cost theory (U5) underpins P&L expenditure (U6)."
        },
        {
            question: "How do the three business principles reappear as success benchmarks (Units 3 & 7)?",
            answer: "Unit 3's economic-efficiency principles — productivity, economy, profitability — are exactly the three benchmarks (U7) used to measure business success: labour productivity (output/labour), economy E (effects/elements; E>1 economical), and profitability (profit/capital).",
            explanation: "Principles (U3) become measurable benchmarks (U7)."
        },
        {
            question: "Where do liquidity and solvency appear across the course (Units 4, 6 & 10)?",
            answer: "Liquidity (ratio > 1) and solvency (settle dues on time) describe short-term financial health of assets (U4), are read from the balance sheet (U6), and reappear as investment-project solvency — a project is solvent if net cash flow ≥ 0 (U10).",
            explanation: "A recurring financial-health thread."
        },
        {
            question: "Why do the specialities of hospitality services shape sales (Units 1 & 9)?",
            answer: "Because services are intangible, perishable (simultaneous production & consumption) and inseparable, the product can't be shown before purchase and is often sold months in advance — which separates sales from consumption and makes intermediaries (tour operators, agencies) essential.",
            explanation: "Service nature (U1) → sales organisation (U9)."
        },
        {
            question: "How does seasonality flow through pricing and costs (Units 1, 5 & 8)?",
            answer: "Seasonality (U1) causes low off-season occupancy. Since fixed costs are 60–80% (U5) and accrue regardless of volume, destination hotels raise high-season prices to the competitive maximum (U8) to cover fixed costs and earn profit in a 2–3 month window.",
            explanation: "Seasonality ties demand, cost behaviour and pricing together."
        },
        {
            question: "How do entrepreneurship, business policy and investment decisions connect (Units 3 & 10)?",
            answer: "Entrepreneurship initiates change/innovation (U3); business policy sets objectives and plans (strategic/tactical/operational); investment decisions (U10) execute that policy through projects evaluated for liquidity, security and profitability.",
            explanation: "Strategy (U3) → capital allocation (U10)."
        },
        {
            question: "Trace the price build-up and its link to economy (Units 7 & 8).",
            answer: "Cost price (direct materials + amortisation + wages + overheads) + margin (covers indirect costs + accumulation) + VAT = sales price (U8). A higher margin or lower input cost improves economy E = realisation/total costs (U7).",
            explanation: "Calculation (U8) drives the economy benchmark (U7)."
        },
        {
            question: "Compare static and dynamic valuation, and where each data source comes from (Unit 6).",
            answer: "Static methods (accounting Vk=Ik−Ok, liquidation Vl=Il−Ol, reproduction Vr=Ir−Or) use balance-sheet assets on a given day. Dynamic methods (P/E, dividend, cash-flow / NPV) use future profit from the P&L. Investment appraisal (U10) uses the same dynamic logic (NPV, annuity, ROI).",
            explanation: "Valuation (U6) and investment appraisal (U10) share dynamic methods."
        },
        {
            question: "Which numeric facts recur most on this course (quick-recall set)?",
            answer: "Fixed costs 60–80% of hotel costs; material-cost model 35% food / 22% beverages / 50% other; amortization periods 20/10/5/4/2 years; ~3.5–5 beds per employee; agency commission 3% domestic / 11% foreign; ~50% capacity to agencies; liquidity ratio > 1.",
            explanation: "High-yield numbers across Units 4–9."
        },
        {
            question: "How is the result improved and the profit then used (Unit 6)?",
            answer: "Improve the result by raising income, cutting expenditure, or moving them in favourable proportions. Profit is first used to settle obligations to the state (profit tax), then reinvested, distributed to owners, or used to repay debt.",
            explanation: "From determining to distributing the result."
        }
    ],

    quiz: [
        {
            question: "If a hotel's fixed costs are 60–80% of total costs, the break-even point will be:",
            options: ["Very low and easy to reach", "Relatively high (more output needed before profit)", "Irrelevant to the result", "Always zero"],
            correct: 1
        },
        {
            question: "A price change that raises ADR but lowers occupancy may leave which KPI roughly unchanged?",
            options: ["GOP", "RevPAR", "EBITDA", "Liquidity ratio"],
            correct: 1
        },
        {
            question: "The accounting value of a company (Vk = Ik − Ok) is most directly affected by:",
            options: ["Agency commission", "Asset book values and amortization", "RevPAR", "Price elasticity"],
            correct: 1
        },
        {
            question: "Buying land is an example of (cost theory):",
            options: ["Cost without expenditure", "Expenditure without cost", "Both at once", "Neither"],
            correct: 1
        },
        {
            question: "The three economic-efficiency principles = the three success benchmarks, namely:",
            options: ["Liquidity, solvency, turnover", "Productivity, economy, profitability", "ADR, RevPAR, GOP", "Gross, net, new"],
            correct: 1
        },
        {
            question: "An investment project is solvent when its net cash flow is:",
            options: ["Negative", "≥ 0", "Below the investment", "Equal to depreciation"],
            correct: 1
        },
        {
            question: "Foreign agency commission and the share of capacity usually given to agencies are about:",
            options: ["3% and 10%", "11% and 50%", "25% and 90%", "5% and 20%"],
            correct: 1
        },
        {
            question: "Selling hospitality services months in advance through intermediaries is driven by the services' :",
            options: ["Tangibility and storability", "Intangibility, perishability and inseparability", "Low fixed costs", "High liquidity"],
            correct: 1
        },
        {
            question: "The sales-price chain is:",
            options: ["VAT + margin − cost price", "Cost price + margin + VAT", "Revenue − expenditure", "GOP − operating costs"],
            correct: 1
        },
        {
            question: "Dynamic methods (used for both company valuation and investment appraisal) are based on:",
            options: ["Balance-sheet assets on a given day", "Future profit / cash flows", "Liquidation proceeds", "Reproduction cost"],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            sentence: "Because hotel fixed costs are high (60–80%), more output is needed to reach the _______ point.",
            answer: "break-even",
            hint: "Where revenue = costs..."
        },
        {
            sentence: "RevPAR blends rate and occupancy: Room Revenue / _______ Rooms.",
            answer: "Available",
            hint: "All rooms, not just sold..."
        },
        {
            sentence: "Accounting value of a company is Vk = Ik − _______.",
            answer: "Ok",
            hint: "Liabilities (book value)..."
        },
        {
            sentence: "The three success benchmarks are productivity, economy and _______.",
            answer: "profitability",
            hint: "Profit ÷ capital..."
        },
        {
            sentence: "An investment project is solvent if its net cash flow is greater than or equal to _______.",
            answer: "zero",
            hint: "The break point..."
        },
        {
            sentence: "The sales price = cost price + margin + _______.",
            answer: "VAT",
            hint: "Tax on the sale..."
        },
        {
            sentence: "Foreign travel agencies receive a commission of about _______%.",
            answer: "11",
            hint: "Domestic is 3%..."
        },
        {
            sentence: "Static valuation uses balance-sheet assets; _______ valuation uses future profit.",
            answer: "dynamic",
            hint: "P/E, dividend, cash-flow / NPV..."
        }
    ],

    learn: {
        title: "Final Exam Roadmap — Economics of Hospitality (Units 1–10)",
        content: `
            <h3>How to Use This Lesson</h3>
            <p>The final (written exam, ~30% of the grade) covers <strong>all 10 units</strong>. This set adds <strong>cross-topic</strong> questions; the 10 unit categories above hold the full detail. Drill the units first, then test the connections here.</p>

            <h3>1st-Midterm Block (Units 1–5)</h3>
            <ul>
                <li><strong>U1 Basics:</strong> service vs hospitality, 4 specialities, local export, basic/supplementary/additional services, seasonality</li>
                <li><strong>U2 Business economics:</strong> macro vs micro, general/special, history (Savary 1675, Smith 1776, Marshall, Schmalenbach 1906, Taylor/Ford/Fayol)</li>
                <li><strong>U3 Hospitality business:</strong> 4 sub-systems, 3 components, entrepreneurship vs management, associations (synergy 2+2=5, cartel, holding, trust), business principles, policy & planning</li>
                <li><strong>U4 Assets:</strong> fixed vs current, liquidity (&gt;1)/solvency, Croatian amortization periods (20/10/5/4/2), methods (a%=100/t)</li>
                <li><strong>U5 Costs:</strong> cost vs expenditure, fixed/variable (60–80% in hotels), cost zones, reactivity h=T%/Q%, break-even</li>
            </ul>

            <h3>2nd-Midterm Block (Units 6–10)</h3>
            <ul>
                <li><strong>U6 Business result:</strong> Assets = Liabilities + Equity, P&L, USALI, valuation (Vk/Vl/Vr; static vs dynamic)</li>
                <li><strong>U7 Success & KPIs:</strong> productivity/economy(E>1)/profitability; ADR, RevPAR, TRevPAR, GOP, GOPPAR, NOP, EBITDA</li>
                <li><strong>U8 Price policy:</strong> cost/market/competition methods, cost price → sales price + VAT, margin, differentiation criteria</li>
                <li><strong>U9 Sales:</strong> 4P+3P, direct vs indirect, contracts (allotment/rental/reservation), 3%/11% commission, ~50% to agencies</li>
                <li><strong>U10 Investments:</strong> gross/net/new, replacement/rationalisation/expansion, NPV/annuity/ROI, solvency (NCF ≥ 0)</li>
            </ul>

            <h3>High-Yield Connections (what finals love)</h3>
            <div class="formula-box">
                <p>Cost behaviour (U5) → break-even & business result (U6) → KPIs (U7)</p>
                <p>Assets + amortization (U4) → company valuation (U6) → investment appraisal (U10)</p>
                <p>Price calculation (U8) ↔ economy benchmark (U7) ↔ sales channels & commission (U9)</p>
            </div>

            <h3>Numbers to Memorise</h3>
            <ul>
                <li>Fixed costs <strong>60–80%</strong> of hotel costs · material model <strong>35/22/50%</strong></li>
                <li>Amortization periods <strong>20/10/5/4/2</strong> years · liquidity ratio <strong>&gt; 1</strong></li>
                <li><strong>3.5–5</strong> beds/employee · commission <strong>3%</strong> domestic / <strong>11%</strong> foreign · <strong>~50%</strong> capacity to agencies</li>
            </ul>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Final Exam Strategy</h4>
                <p>Definitions + formulas win points fast. Then practise <strong>linking</strong> units (cost→result→KPI; assets→valuation→investment). Use this Exam Practice set as a mixed final rehearsal.</p>
            </div>
        `
    }
};

// Merge: 1st midterm (U1-5) + 2nd midterm (U6-10) + the cross-topic Exam Practice set.
const economicsHospitalityFinalData = Object.assign(
    {},
    (typeof window !== "undefined" && window.economicsHospitalityData) ? window.economicsHospitalityData : {},
    (typeof window !== "undefined" && window.economicsHospitalityM2Data) ? window.economicsHospitalityM2Data : {},
    { examPractice: economicsHospitalityExamPractice }
);

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.economicsHospitalityFinalData = economicsHospitalityFinalData; }
if (typeof module !== "undefined" && module.exports) { module.exports = economicsHospitalityFinalData; }
