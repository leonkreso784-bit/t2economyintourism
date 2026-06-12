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
            explanation: "The two midterm tests are each worth 24% (Σ48%); the final adds 30%."
        },
        {
            question: "Which units make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm = units 1–6: tourism key concepts & market, demand & elasticity, forecasting demand, supply factors & elasticity, supply production & costs, and market structure.\n2nd midterm = units 7–12: strategic pricing, economic impacts & tourist expenditure, economic contribution, measuring contribution (TSA), tourism & the environment, and sustainable tourism development.",
            explanation: "Per the 2025/26 'Important dates' slide, Strategic Pricing (unit 7) belongs to the 2nd midterm."
        },
        {
            question: "Where does ELASTICITY appear across the course (demand, supply, pricing)?",
            answer: "Demand: Price Elasticity of Demand = %ΔQd / %ΔP (inverse Law of Demand). Supply: supply elasticity measures how output responds to price (often inelastic short-run because capacity is fixed). Pricing: elastic demand + higher price → fewer buyers; inelastic demand + lower price → small revenue.",
            explanation: "Elasticity is the single thread linking demand (unit 2), supply (unit 4) and pricing (unit 7)."
        },
        {
            question: "Explain the three types of tourist expenditure and how they build the multiplier.",
            answer: "Direct (tourists pay hotels/restaurants directly) + Indirect (those firms buy inputs from other firms) + Induced (workers spend their wages downstream) = Total Effect. Multiplier = Total Impact / Direct Expenditure.",
            explanation: "Direct + Indirect + Induced is the chain that makes one euro of tourist spending 'multiply' through the economy."
        },
        {
            question: "What is the difference between tourism's economic CONTRIBUTION and economic IMPACT, and how is contribution measured?",
            answer: "Contribution = the ongoing effect of tourism spending on key economic variables (GDP, employment, value added). Impact = the CHANGE in that contribution caused by a specific event/activity. Contribution is measured with the TSA (Tourism Satellite Accounts) — needed because tourism is not a distinct sector in national accounts.",
            explanation: "Contribution is a 'state', impact is a 'change'; the TSA is the standard measurement tool (units 9–10)."
        },
        {
            question: "Why does tourism cause MARKET FAILURE, and what links this to sustainability?",
            answer: "Three sources of market failure: lack of property rights to environmental resources, externalities, and public goods. Because no one owns/prices the environment, it gets overused (e.g. exceeding carrying capacity) — which is why sustainable & regenerative tourism and economic instruments (taxes on pollution) are needed.",
            explanation: "Market failure (unit 11) is the economic reason sustainability policy (unit 12) is required."
        },
        {
            question: "Compare the 4 market structures from most to least competitive.",
            answer: "1. Perfect competition (many buyers & sellers, identical products). 2. Monopolistic competition (many sellers, differentiated products). 3. Oligopoly (a few firms dominate). 4. Monopoly (one seller). Structure shapes the firm's conduct (decisions) and performance (profit potential).",
            explanation: "Airlines/large hotel chains often behave like an oligopoly; many small B&Bs resemble monopolistic competition."
        },
        {
            question: "List the costs and benefits of tourism across the three dimensions.",
            answer: "Benefits: Economic (jobs, income, investment), Socio-cultural (exchange, heritage), Environmental (protection, awareness). Costs: Economic (↑ prices, cost of living, property taxes), Socio-cultural (hectic community, loss of authenticity), Environmental (water quality, coastal erosion).",
            explanation: "The same three dimensions (economic / socio-cultural / environmental) carry both the upside and the downside of tourism growth."
        },
        {
            question: "What is the difference between SUSTAINABLE and REGENERATIVE tourism?",
            answer: "Sustainable tourism seeks to LESSEN the harm done by tourism (do less damage). Regenerative tourism goes further: it actively contributes to the regeneration of ecosystems, economies and cultures — the goal is to leave a destination BETTER than it was found.",
            explanation: "Sustainable = do less harm; Regenerative = do more good. Sustainable Development = Social + Economic + Environmental."
        },
        {
            question: "What are the 7 determinants of tourism prices?",
            answer: "1. Firm's objective\n2. Ownership characteristics\n3. Market structure\n4. Distribution method\n5. Market position\n6. Degree of competition\n7. Cost structure",
            explanation: "Note that 'market structure' (unit 6) is itself one of the price determinants — the course units interlock."
        },
        {
            question: "Distinguish the special demand effects: Bandwagon, Snob, and Veblen.",
            answer: "Bandwagon: demand MORE because others buy it (fashionable). Snob: demand LESS as more people consume it (exclusivity). Veblen: demand MORE of a 'high-status' good as its PRICE RISES (prestige).",
            explanation: "Snob and Veblen both contradict the simple Law of Demand for status/luxury tourism products."
        },
        {
            question: "Give the core cost formulas for a tourism firm.",
            answer: "TC = FC + VC (Total = Fixed + Variable). AC = TC/Q, AFC = FC/Q, AVC = VC/Q, MC = dTC/dQ. Explicit costs = direct payments to suppliers; Implicit costs = opportunity cost of own resources.",
            explanation: "Fixed vs variable inputs and economies/diseconomies of scale drive a tourism firm's cost curves."
        },
        {
            question: "What are the 5 A's of tourism and the 3 key dimensions that define tourism?",
            answer: "5 A's: Attractions, Access, Amenities, Accommodation, Activities. 3 dimensions of tourism: Movement, Length of stay, Motivation. Visitors = Tourists (>24h) + Day-trippers (<24h).",
            explanation: "The fundamentals (unit 1) frame everything else — what tourism IS before analysing its economics."
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
            options: ["Market structure", "Tourism demand", "Strategic pricing", "Supply & costs"],
            correct: 2
        },
        {
            question: "Price Elasticity of Demand is calculated as:",
            options: ["%ΔPrice / %ΔQuantity", "%ΔQuantity demanded / %ΔPrice", "Total Impact / Direct Expenditure", "TC / Q"],
            correct: 1
        },
        {
            question: "The tourism multiplier equals:",
            options: ["Direct / Total Impact", "Total Impact / Direct Expenditure", "Indirect + Induced", "TGVA / TGDP"],
            correct: 1
        },
        {
            question: "Economic IMPACT (as opposed to contribution) refers to:",
            options: ["Ongoing effect of tourism spending", "Changes in contribution from specific events", "The TSA framework", "Number of tourist arrivals"],
            correct: 1
        },
        {
            question: "Which is NOT a source of market failure in tourism?",
            options: ["Externalities", "Public goods", "Lack of property rights", "Economies of scale"],
            correct: 3
        },
        {
            question: "Which market structure has a few dominant firms?",
            options: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"],
            correct: 2
        },
        {
            question: "Regenerative tourism differs from sustainable tourism because it:",
            options: ["Only lessens harm", "Actively restores and improves the destination", "Maximises arrivals", "Ignores local communities"],
            correct: 1
        },
        {
            question: "The Veblen Effect describes demand that:",
            options: ["Falls as others buy", "Rises because a good is fashionable", "Rises as the price of a status good rises", "Is unaffected by price"],
            correct: 2
        },
        {
            question: "Total Cost is defined as:",
            options: ["FC − VC", "FC + VC", "FC × VC", "VC / Q"],
            correct: 1
        },
        {
            question: "TSA is needed because tourism:",
            options: ["Is too small to measure", "Is not a distinct sector in national accounts", "Has no economic value", "Pays no taxes"],
            correct: 1
        },
        {
            question: "Sustainable Development combines:",
            options: ["Social + Economic only", "Economic + Environmental only", "Social + Economic + Environmental", "Marketing + Sales + Finance"],
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
            hint: "When workers spend their wages downstream..."
        },
        {
            sentence: "Multiplier = Total Impact / _______ Expenditure.",
            answer: "Direct",
            hint: "The initial tourist spending..."
        },
        {
            sentence: "Tourism is measured with the TSA = Tourism _______ Accounts.",
            answer: "Satellite",
            hint: "Orbits the main national accounts..."
        },
        {
            sentence: "The three sources of market failure are externalities, public goods, and lack of _______ rights.",
            answer: "property",
            hint: "Who owns the resource..."
        },
        {
            sentence: "_______ tourism aims to leave a destination BETTER than it was found.",
            answer: "Regenerative",
            hint: "Beyond sustainable..."
        },
        {
            sentence: "Sustainable Development = Social + Economic + _______.",
            answer: "Environmental",
            hint: "Nature, resources..."
        },
        {
            sentence: "Price and tourism demand have an _______ relationship (Law of Demand).",
            answer: "inverse",
            hint: "Opposite of direct..."
        }
    ],

    learn: {
        title: "Final Exam Roadmap (Units 1–12)",
        content: `
            <h3>📋 What the Final Covers</h3>
            <p>The final exam is <strong>worth 30%</strong> (minimum <strong>15 points / 50%</strong> to pass it) and is written form: <strong>10 questions</strong> — 5 close-ended + 5 open-ended — across <strong>all units 1–12</strong>. Prerequisite to sit it: at least <strong>35%</strong> from coursework (the two midterm tests + activities).</p>
            <p>Use this category to drill <strong>across units</strong>; the 9 topic categories remain available in this same lesson for deep revision.</p>

            <h3>📈 First Midterm Half — Units 1–6</h3>
            <table><tr><th>Unit</th><th>Must-know anchor</th></tr>
            <tr><td>1. Fundamentals</td><td>'tour' = Latin tornus; 5 A's; visitors = tourists (&gt;24h) + day-trippers; UNWTO</td></tr>
            <tr><td>2–3. Demand</td><td>Law of Demand (inverse); PED = %ΔQ/%ΔP; Bandwagon / Snob / Veblen; 3 forecasting methods</td></tr>
            <tr><td>4–5. Supply &amp; Costs</td><td>Natural/human/human-made inputs; TC = FC + VC; explicit vs implicit; economies of scale</td></tr>
            <tr><td>6. Market Structure</td><td>Perfect comp → monopolistic → oligopoly → monopoly; 3 competitive strategies</td></tr></table>

            <h3>💶 Second Midterm Half — Units 7–12</h3>
            <table><tr><th>Unit</th><th>Must-know anchor</th></tr>
            <tr><td>7. Pricing</td><td>Price is NOT the most critical variable; 7 determinants; cost/market/competition-based</td></tr>
            <tr><td>8. Expenditure</td><td>Direct + Indirect + Induced = Total Effect; Multiplier = Total Impact / Direct; 5 multiplier types</td></tr>
            <tr><td>9–10. TSA</td><td>Contribution vs Impact; TGVA / TGDP; tourism not a distinct sector → use TSA</td></tr>
            <tr><td>11. Environment</td><td>Market failure: property rights, externalities, public goods; carrying capacity; economic instruments</td></tr>
            <tr><td>12. Sustainability</td><td>Sustainable = lessen harm; Regenerative = restore; Sustainable Dev = Social + Economic + Environmental</td></tr></table>

            <h3>🔗 Cross-Unit Threads</h3>
            <ul>
            <li><strong>Elasticity everywhere:</strong> demand (PED), supply (response to price), and pricing (elastic vs inelastic effect on revenue).</li>
            <li><strong>The expenditure chain:</strong> Direct → Indirect → Induced builds the multiplier and the 7 effects of tourist spending.</li>
            <li><strong>Measurement:</strong> contribution (ongoing) vs impact (change), both captured by the TSA.</li>
            <li><strong>Market failure → policy:</strong> externalities + public goods justify carrying-capacity limits, taxes on pollution, and sustainable/regenerative tourism.</li>
            </ul>

            <h3>💡 Exam Strategy</h3>
            <p>Close-ended questions reward <strong>exact definitions and formulas</strong> (TC = FC + VC, Multiplier = Total Impact / Direct Expenditure, the 7 price determinants). Open-ended questions reward a <strong>concept + an example</strong> (e.g. "externality → a resort's wastewater harms a public beach", or "oligopoly → a few airlines dominate a route"). Learn one strong anchor per unit, then practise linking units.</p>
        `
    }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// K1 (4 topic cats) and K2 (5 topic cats) have no key collisions, so this yields all
// 9 topic categories + examPractice = 10 categories.
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
