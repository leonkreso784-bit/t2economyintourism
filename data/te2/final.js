// ===== TOURISM ECONOMICS (te2) — Final Exam (hybrid) =====
// Pattern identical to Marketing/Economics/Geography/Food&Nutrition/BI finals: the final lesson
// MERGES both midterms and adds one curated cross-topic "Exam Practice" category.
//   te2Final = Object.assign({}, te2M1 (K1, units 1–6), te2M2 (K2, units 7–12), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.te2M1 and window.te2M2 at module-load time.
//
// Course note (syllabus "Tourism economics_introduction.pdf", FMTU Opatija 2025/26):
//   Final exam = 30% of grade; minimum 15 points (50%) required to pass it; prerequisite to sit it
//   is at least 35% from coursework (two midterm tests + activities). Written form, 10 questions:
//   5 close-ended + 5 open-ended. Covers ALL material — units 1–12.

const te2ExamPractice = {
    name: "Exam Practice (All Units)",
    icon: "fa-graduation-cap",
    color: "#6366f1",

    flashcards: [
        {
            question: "What is the structure and weight of the Tourism Economics final exam?",
            answer: "The final exam is worth 30% of the grade (minimum 15 points / 50% to pass it). It is written form with 10 questions: 5 close-ended + 5 open-ended, covering all units 1–12. The prerequisite to sit it is at least 35% from coursework (the two midterm tests + activities).",
            explanation: "Each midterm test is worth 24% (Σ48%); the final adds 30%."
        },
        {
            question: "Which units make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (Units 1–6): tourism fundamentals & market, demand & elasticity, forecasting demand, supply & costs, and market structure.\n2nd midterm (Units 7–12): strategic pricing, economic impacts & expenditure, economic contribution & TSA, environment & market failure, and sustainable tourism development.",
            explanation: "Per the 2025/26 'Important dates' slide, Strategic Pricing (unit 7) belongs to the 2nd midterm."
        },
        {
            question: "Where does ELASTICITY appear across the course, and how many forms of demand elasticity are there?",
            answer: "There are FOUR forms of demand elasticity: price, income, cross-price, and marketing (advertising) — each = %ΔQuantity demanded / %Δdriver. Elasticity links demand (unit 2), supply (response to price), and pricing (elastic demand + higher price → fewer buyers; inelastic + lower price → small revenue). Firms differentiate to REDUCE elasticity and raise price/revenue.",
            explanation: "The 'marketing/advertising' elasticity is the fourth form often forgotten."
        },
        {
            question: "Explain the expenditure chain and the realistic size of the tourism multiplier.",
            answer: "Tourist expenditure → Direct (paid to suppliers) + Indirect (upstream supply chain) + Induced (recipients spend incomes) = Total Effect. Multiplier = Total Impact / Direct Expenditure. In reality it is unlikely to EXCEED 2 (when indirect = direct, multiplier = 2), so €100 m of new expenditure adds < €200 m to GDP. Leakages and factor constraints shrink it.",
            explanation: "A key reality check from Dwyer's lectures against inflated multiplier claims."
        },
        {
            question: "Distinguish economic CONTRIBUTION from economic IMPACT, and explain why the TSA is needed.",
            answer: "Contribution = tourism's ongoing economic significance (its effect on GDP, household income, value added, FX, employment). Impact = the CHANGE in contribution from a specific event/policy. The TSA (Tourism Satellite Account, endorsed by the UN Statistical Commission) is needed because tourism is NOT a distinct sector in the national accounts — the TSA extends them to measure it.",
            explanation: "Contribution is a 'state'; impact is a 'change'; the TSA measures the contribution."
        },
        {
            question: "Why does tourism cause MARKET FAILURE, and what are the four types of goods?",
            answer: "Three sources of market failure: lack of property rights, public goods, and externalities. Goods are classified by excludability × rivalry: Private (excl + rival), Common (non-excl + rival, e.g. oceans/forests), Club (excl + non-rival, e.g. Wi-Fi), Public (non-excl + non-rival). Common-pool resources lead to the 'tragedy of the commons'.",
            explanation: "Because the environment is under-priced, it gets over-used — justifying carrying-capacity limits and eco-taxes."
        },
        {
            question: "Compare the 4 market structures and give a tourism example of each.",
            answer: "Perfect competition (many firms, identical products, price-taker → street stalls); Monopolistic competition (many, differentiated → restaurants, hotels, B&Bs, travel agencies); Oligopoly (a few interdependent firms, strong barriers → tour operators, airlines); Monopoly (one seller, no substitute → nationalized railways).",
            explanation: "Structure shapes the firm's conduct and performance (the SCP framework)."
        },
        {
            question: "Summarise the three pricing strategies and a key tactic of each.",
            answer: "Cost-based (e.g. cost-plus, profit max where MR=MC, peak-load); Market-based / customer-oriented (e.g. price discrimination, skimming, penetration, bundling); Competition-based (e.g. price leadership, predatory pricing, transfer pricing). Price is the MOST adjustable variable and signals quality.",
            explanation: "Cost anchors to costs, market to willingness-to-pay, competition to rivals."
        },
        {
            question: "What is the difference between SUSTAINABLE and REGENERATIVE tourism, and what is 'decoupling'?",
            answer: "Sustainable tourism seeks to LESSEN the harm done by tourism; regenerative tourism aims for a NET POSITIVE benefit (restoration & regeneration). Decoupling = separating growth from environmental harm; absolute decoupling (output up while impact falls) has no real-world evidence — the 'decoupling myth'.",
            explanation: "Sustainable = do less harm; regenerative = do more good. Sustainable Development = Economic + Social + Environmental."
        },
        {
            question: "Give the core cost and product formulas for a tourism firm.",
            answer: "TC = FC + VC; AC = TC/Q; AFC = FC/Q; AVC = VC/Q; MC = dTC/dQ. Product: TP (total), AP = TP/Q (per worker), MP = change in TP from one extra unit of the variable factor. Explicit costs = payments to outsiders; implicit costs = opportunity cost of own resources.",
            explanation: "Economies of scale lower long-run average cost (LRAC) as all inputs rise."
        },
        {
            question: "What are the 5 types of multipliers and the 7 major impacts of tourist expenditure?",
            answer: "5 multipliers: sales, output, income, value-added, employment. 7 impacts: increased local production/output, new business & employment, foreign-exchange earnings (international only), new investment, government revenue, regional development, and poverty reduction.",
            explanation: "FX earnings arise only from INTERNATIONAL tourism (an export industry)."
        },
        {
            question: "What are the 5 A's of tourism and the 3 dimensions that define tourism?",
            answer: "5 A's: Attractions, Access, Accommodation, Amenities, Activities. 3 dimensions of tourism: Movement, Length of stay, Motivation. Visitors = Tourists (>24 h, overnight) + Day-trippers (<24 h).",
            explanation: "Unit 1 fundamentals frame the whole course before its economics."
        }
    ],

    quiz: [
        {
            question: "The Tourism Economics final exam consists of:",
            options: ["12 questions (6 closed + 6 open)", "10 questions (5 closed + 5 open)", "20 multiple-choice questions", "1 essay only"],
            correct: 1
        },
        {
            question: "Which unit belongs to the 2nd midterm (units 7–12)?",
            options: ["Market structure", "Forecasting demand", "Strategic pricing", "Tourism demand"],
            correct: 2
        },
        {
            question: "How many forms of tourism demand elasticity are there?",
            options: ["2", "3", "4", "5"],
            correct: 2
        },
        {
            question: "The tourism multiplier is realistically unlikely to exceed:",
            options: ["1", "2", "5", "10"],
            correct: 1
        },
        {
            question: "The TSA is needed because tourism:",
            options: ["Pays no tax", "Is not a distinct sector in the national accounts", "Is too small", "Has no demand"],
            correct: 1
        },
        {
            question: "Oceans and forests (non-excludable but rival) are examples of:",
            options: ["Private goods", "Club goods", "Common goods", "Public goods"],
            correct: 2
        },
        {
            question: "Airlines and tour operators are typical examples of:",
            options: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"],
            correct: 2
        },
        {
            question: "Setting a low initial price to win market share is:",
            options: ["Skimming", "Penetration pricing", "Predatory pricing", "Peak-load pricing"],
            correct: 1
        },
        {
            question: "Regenerative tourism (vs sustainable) aims for:",
            options: ["Only lessening harm", "A net positive benefit / restoration", "Maximum arrivals", "Lower taxes"],
            correct: 1
        },
        {
            question: "Foreign-exchange earnings come from:",
            options: ["Domestic tourism", "International tourism", "Government grants", "Local spending"],
            correct: 1
        },
        {
            question: "Total Cost is:",
            options: ["FC − VC", "FC + VC", "FC × VC", "VC / Q"],
            correct: 1
        },
        {
            question: "Absolute decoupling means output grows while environmental impact:",
            options: ["Grows faster", "Grows more slowly", "Falls in absolute terms", "Is unchanged"],
            correct: 2
        }
    ],

    fillBlanks: [
        {
            sentence: "The final exam is worth _______% of the grade (minimum 15 points to pass it).",
            answer: "30",
            hint: "Thirty..."
        },
        {
            sentence: "Total Effect = Direct + Indirect + _______ expenditure.",
            answer: "Induced",
            hint: "Recipients spending incomes downstream..."
        },
        {
            sentence: "Multiplier = Total Impact / _______ Expenditure.",
            answer: "Direct",
            hint: "The initial tourist spending..."
        },
        {
            sentence: "Tourism is measured with the TSA = Tourism _______ Account.",
            answer: "Satellite",
            hint: "It orbits the national accounts..."
        },
        {
            sentence: "The four demand elasticities are price, income, cross-price and _______.",
            answer: "marketing",
            hint: "Also called advertising elasticity..."
        },
        {
            sentence: "_______ tourism aims to leave a destination BETTER than it was found (net positive).",
            answer: "Regenerative",
            hint: "Beyond sustainable..."
        },
        {
            sentence: "Price is the most _______ of the firm's decision variables.",
            answer: "adjustable",
            hint: "Quick to change..."
        },
        {
            sentence: "Sustainable Development = Economic + Social + _______.",
            answer: "Environmental",
            hint: "Nature, resources..."
        }
    ],

    learn: {
        title: "Final Exam Roadmap (Units 1–12)",
        content: `
            <h3>📋 What the Final Covers</h3>
            <p>The final exam is <strong>worth 30%</strong> (minimum <strong>15 points / 50%</strong> to pass it), written form: <strong>10 questions</strong> — 5 close-ended + 5 open-ended — across <strong>all units 1–12</strong>. Prerequisite: at least <strong>35%</strong> from coursework.</p>
            <p>Use this category to drill <strong>across units</strong>; the per-unit topic categories remain available in this same lesson for deep revision.</p>

            <h3>📈 First Midterm Half — Units 1–6</h3>
            <table><tr><th>Unit</th><th>Must-know anchor</th></tr>
            <tr><td>1. Fundamentals & Market</td><td>'tour' = Latin tornus; 5 A's; visitors = tourists + day-trippers; intangible product</td></tr>
            <tr><td>2. Demand</td><td>Law of Demand (inverse); FOUR elasticities; Bandwagon / Snob / Veblen</td></tr>
            <tr><td>3. Forecasting</td><td>Qualitative / Quantitative / AI; time-series vs causal; regression analysis</td></tr>
            <tr><td>4–5. Supply & Costs</td><td>3 inputs; TC = FC + VC; explicit vs implicit; economies of scale</td></tr>
            <tr><td>6. Market Structure</td><td>Perfect → monopolistic → oligopoly → monopoly; cost leadership / differentiation / focus</td></tr></table>

            <h3>💶 Second Midterm Half — Units 7–12</h3>
            <table><tr><th>Unit</th><th>Must-know anchor</th></tr>
            <tr><td>7. Strategic Pricing</td><td>Price is most adjustable; cost/market/competition-based; skimming vs penetration; price discrimination</td></tr>
            <tr><td>8. Economic Impacts</td><td>Direct + Indirect + Induced; Multiplier = Total/Direct; 5 multiplier types; multiplier ≤ 2; leakages</td></tr>
            <tr><td>9–10. Contribution & TSA</td><td>Contribution vs impact; tourism not a distinct sector → TSA; characteristic vs connected products</td></tr>
            <tr><td>11. Environment</td><td>Market failure (property rights, public goods, externalities); 4 goods; carrying capacity</td></tr>
            <tr><td>12. Sustainability</td><td>3 pillars; growth management vs degrowth; Easterlin Paradox; decoupling myth; regenerative tourism</td></tr></table>

            <h3>🔗 Cross-Unit Threads</h3>
            <ul>
            <li><strong>Elasticity everywhere:</strong> demand (4 elasticities), supply (response to price), pricing (revenue effects).</li>
            <li><strong>The expenditure chain:</strong> Direct → Indirect → Induced builds the multiplier (realistically ≤ 2).</li>
            <li><strong>Measurement:</strong> contribution (ongoing) vs impact (change), both captured by the TSA.</li>
            <li><strong>Market failure → policy:</strong> public goods + externalities justify carrying-capacity limits, eco-taxes, and sustainable/regenerative tourism.</li>
            </ul>

            <h3>💡 Exam Strategy</h3>
            <p>Close-ended questions reward <strong>exact definitions and formulas</strong> (TC = FC + VC, Multiplier = Total Impact / Direct, the 4 elasticities). Open-ended questions reward a <strong>concept + an example</strong> (e.g. "externality → a resort's wastewater harms a public beach"; "oligopoly → a few airlines dominate a route"). Learn one strong anchor per unit, then practise linking units.</p>
        `
    }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// K1 (5 topic cats) and K2 (5 topic cats) have no key collisions, so this yields all
// 10 topic categories + examPractice = 11 categories.
const te2Final = Object.assign(
    {},
    (typeof window !== "undefined" && window.te2M1) ? window.te2M1 : {},
    (typeof window !== "undefined" && window.te2M2) ? window.te2M2 : {},
    { examPractice: te2ExamPractice }
);

if (typeof window !== "undefined") { window.te2Final = te2Final; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: te2ExamPractice });
}
