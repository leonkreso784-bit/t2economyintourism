// ===== ENTREPRENEURSHIP AND INNOVATION — Final Exam (hybrid) =====
// Pattern identical to te2/E-Business/Marketing/Economics/Geography/Food&Nutrition finals:
// the final lesson MERGES both midterms and adds one curated cross-topic "Exam Practice" category.
//   entrepreneurshipFinal = Object.assign({}, entrepreneurshipM1 (K1, Weeks 2–7), entrepreneurshipM2 (K2, Weeks 9–13), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.entrepreneurshipM1 and window.entrepreneurshipM2 at module-load time.

const entrepreneurshipExamPractice = {
    id: "5arov9",
    name: "Exam Practice (All Weeks)",
    icon: "fa-graduation-cap",
    color: "#ef4444",

    flashcards: [
        {
            id: "t1bx69",
            question: "Which weeks make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (Weeks 2–7): concepts & theories of entrepreneurship, the entrepreneur (traits & influences), creativity & business idea, innovation, financing the business, franchising, planning.\n\n2nd midterm (Weeks 9–13): failure & entrepreneurial learning, entrepreneurship & the economy, tourism entrepreneurship, social entrepreneurship, measuring value, contemporary issues (gender/diversity/migration), developing countries & social innovation.",
            explanation: "Week 8 = 1st midterm; the final covers everything."
        },
        {
            id: "9u8e34",
            question: "EXAM REVIEW: Match the theorist to the idea — Cantillon, Smith, Say, Mises, Kirzner, Schumpeter, Marshall, Menger.",
            answer: "CANTILLON (1755): risk-taker bearing uncertainty\nSMITH: transforms demand into supply; profit = reward\nSAY: innovator-middleman between scientist and worker; superintendence\nMISES: speculator; born not made\nKIRZNER: alertness; continual discovery\nSCHUMPETER: new 'productive combinations' (5); engine of change\nMARSHALL: risk-taker AND administrator; active vs passive entrepreneurs\nMENGER: heterogeneous individuals; special kind of labour service",
            explanation: "The theorist line-up appears in both halves of the course."
        },
        {
            id: "3bogz4",
            question: "EXAM REVIEW: Critical numbers across the course.",
            answer: "• 1755 — Cantillon coins 'entrepreneur'\n• 5 — Schumpeter's productive combinations\n• 7 — Drucker's sources of opportunity; 7 value-measurement dimensions\n• 9 — Business Model Canvas blocks\n• 4 — types of social entrepreneurs; 4 crowdfunding types; 4 knowledge/skill types\n• 98% — startups starting without formal investment\n• 95% — VC applications rejected; £2M+ VC investments vs £10k–250k angels\n• 5× — franchisee more likely to succeed (10% vs 52% failure)\n• ~90% — long-run startup failure; 70% fail in years 2–5\n• 3:1 — men vs women in business ownership; 2.3% of VC to women\n• 45% — Fortune 500 founded by migrants or their children\n• 7% — social innovation's share of global GDP",
            explanation: "Numbers are the fastest exam points."
        },
        {
            id: "2yfej6",
            question: "Connect CREATIVITY → INNOVATION → ENTREPRENEURSHIP → ECONOMY in one chain.",
            answer: "CREATIVITY produces new ideas (no need required) → ideas that are useful AND valuable become OPPORTUNITIES (finding vs building) → INNOVATION takes them effectively and profitably to satisfied customers (Kanter) → the ENTREPRENEUR acts on the innovation, financing it (bootstrapping → crowdfunding → angels/VC) and planning it (BMC → feasibility → pitch deck → business plan) → at MACRO level this raises capital formation, employment, technological progress; at MICRO level it creates new entities, jobs, goods and niche markets.",
            explanation: "The whole course as one storyline."
        },
        {
            id: "izvylt",
            question: "How do FAILURE and LEARNING connect to fear of failure across cultures?",
            answer: "~90% of startups fail long-run (70% in years 2–5). Failure is a PROCESS (stages of decline), caused by exogenous and internal factors, with warning signs of INACTION and faulty action.\n\nFear of failure DISABLES learning, investment and opportunity recognition — but tolerance differs (Africa & Latin America higher; Asia/Europe lower) and society shifts to 'risk rather than sin'.\n\nPositive view: knowledge spillovers; Edison's '1,000 steps'; the failure resume.",
            explanation: "Failure (W9) is the hinge between the two halves."
        },
        {
            id: "mky9zh",
            question: "Cross-topic: how does SOCIAL entrepreneurship scale from a community café to changing systems?",
            answer: "TYPES (small → large): COMMUNITY (local problem) → NON-PROFIT (business-savvy, social good) → TRANSFORMATIONAL (fills gaps governments/businesses miss) → GLOBAL (changes social systems).\n\nMeasure the value on 7 DIMENSIONS (impact, sustainability, innovation, scalability, community involvement, partnerships, awareness/advocacy) — while avoiding mission drift (Phnom Penh NGO) and dependency (Grootbos).",
            explanation: "Combines W11 types, W11 measurement and W13 case lessons."
        }
    ],

    quiz: [
        {
            id: "tc59vk",
            question: "The term 'entrepreneur' was introduced in 1755 by:",
            options: [
                "Adam Smith",
                "Richard Cantillon",
                "Joseph Schumpeter",
                "Peter Drucker"
            ],
            correct: 1
        },
        {
            id: "rlwsc7",
            question: "Which pairing is WRONG?",
            options: [
                "Mises — speculator, born not made",
                "Kirzner — entrepreneurial alertness",
                "Marshall — risk-taker and administrator",
                "Say — entrepreneurship can be taught to everyone"
            ],
            correct: 3
        },
        {
            id: "qnocfv",
            question: "The single necessary and sufficient condition for a business is:",
            options: [
                "A business plan",
                "A paying customer",
                "Venture capital",
                "A patent"
            ],
            correct: 1
        },
        {
            id: "qw6h30",
            question: "Which financing source typically invests £10,000–£250,000 with informal due diligence?",
            options: [
                "Venture capitalists",
                "Business angels",
                "Banks",
                "Crowdfunding platforms"
            ],
            correct: 1
        },
        {
            id: "dh8q00",
            question: "From entrepreneurship theory, a franchisee is:",
            options: [
                "An entrepreneur",
                "An intrapreneur",
                "A manager",
                "An investor"
            ],
            correct: 1
        },
        {
            id: "suf1pv",
            question: "In the order of planning activities, which comes LAST?",
            options: [
                "Business Model Canvas",
                "Feasibility study",
                "Pitch deck",
                "Business plan"
            ],
            correct: 3
        },
        {
            id: "36gx44",
            question: "70% of start-ups fail during:",
            options: [
                "The first 6 months",
                "Years 2–5",
                "Years 8–10",
                "After year 15"
            ],
            correct: 1
        },
        {
            id: "ryhkkj",
            question: "Which is a MACROECONOMIC effect of entrepreneurship?",
            options: [
                "Creation of niche markets",
                "Capital formation",
                "New economic entities",
                "Production of new goods"
            ],
            correct: 1
        },
        {
            id: "dxvh17",
            question: "The 4 types of social entrepreneurs, from smallest to largest scope:",
            options: [
                "Global → Transformational → Non-profit → Community",
                "Community → Non-profit → Transformational → Global",
                "Non-profit → Community → Global → Transformational",
                "Community → Global → Non-profit → Transformational"
            ],
            correct: 1
        },
        {
            id: "rw7ev7",
            question: "Social innovation accounts for about what share of global GDP?",
            options: ["2%", "7%", "12%", "20%"],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            id: "pbx20q",
            sentence: "Cantillon introduced the term 'entrepreneur' in _______.",
            answer: "1755",
            hint: "18th century..."
        },
        {
            id: "yu9ust",
            sentence: "According to Bill Gross, the single biggest start-up success factor is _______.",
            answer: "timing",
            hint: "Not the idea..."
        },
        {
            id: "8kmvnf",
            sentence: "98% of startups begin without any formal _______.",
            answer: "investment",
            hint: "Outside money..."
        },
        {
            id: "u3meqr",
            sentence: "A franchisee is 5 times more likely to _______ than an independent business.",
            answer: "succeed",
            hint: "Opposite of fail..."
        },
        {
            id: "gafhac",
            sentence: "45% of US Fortune 500 companies were founded by _______ or their children.",
            answer: "migrants",
            hint: "Moved across borders..."
        }
    ],

    learn: {
        id: "fgvnxz",
        title: "Final Exam Practice — How to Use",
        content: `
            <h3>What is this category?</h3>
            <p>A cross-topic practice set combining all course weeks — exactly how the final mixes them.
            Use it AFTER reviewing the two midterm halves.</p>

            <h4>The course in one map</h4>
            <div class="formula-box">
                FOUNDATIONS (W2): origins & theorists → typologies → traits & social influences<br>
                CREATING (W3–W4): idea → creativity → opportunity → innovation (Drucker's 7, journey)<br>
                BUILDING (W5–W7): bootstrapping/crowdfunding/angels/VC → franchising → planning tools<br>
                CONTEXT (W9–W13): failure & learning → economy & tourism → social entrepreneurship &
                value → gender/diversity/migration trends → developing countries & social innovation
            </div>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Cross-topic favourites</h4>
                <ul>
                    <li>Theorist line-up: Cantillon → Smith → Say → Mises → Kirzner → Schumpeter → Marshall → Menger</li>
                    <li>Finding vs building opportunities; growth vs fixed mindset</li>
                    <li>Kickstarter all-or-nothing; angels vs VCs (numbers!)</li>
                    <li>Franchisee = intrapreneur; resource scarcity vs agency theory</li>
                    <li>Planning order: idea → BMC → feasibility → pitch deck → business plan</li>
                    <li>Failure stats (90% / 70% / 1-in-5) + fear-of-failure consequences</li>
                    <li>4 social-entrepreneur types + 7 value dimensions + case lessons (mission drift!)</li>
                </ul>
            </div>
        `
    }
};

const entrepreneurshipFinal = Object.assign(
    {},
    (typeof window !== "undefined" && window.entrepreneurshipM1) ? window.entrepreneurshipM1 : {},
    (typeof window !== "undefined" && window.entrepreneurshipM2) ? window.entrepreneurshipM2 : {},
    { examPractice: entrepreneurshipExamPractice }
);

if (typeof window !== "undefined") { window.entrepreneurshipFinal = entrepreneurshipFinal; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: entrepreneurshipExamPractice });
}
