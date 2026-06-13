// ===== MANAGEMENT — Final Exam (hybrid) =====
// Pattern identical to the other subjects' finals: the final lesson MERGES both midterms
// and adds one curated cross-topic "Exam Practice" category.
//   managementFinal = Object.assign({}, managementM1 (K1, TU2–TU7), managementM2 (K2, TU8–TU11), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.managementM1 and window.managementM2 at module-load time.

const managementExamPractice = {
    name: "Exam Practice (All Topics)",
    icon: "fa-graduation-cap",
    color: "#f59e0b",

    flashcards: [
        {
            question: "Which topics make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (TU2–TU7): Management & its history · Problem solving & decision making · Strategic & operational planning · Organizing & delegating · Managing teamwork · Human resource management.\n\n2nd midterm (TU8–TU11): Organizational behavior · Motivating for high performance · Leading with influence · Managing control systems, finances & people.",
            explanation: "K1 = environment + planning + organizing; K2 = leading + controlling."
        },
        {
            question: "EXAM REVIEW: name the FOUR management functions and link each to its main chapter.",
            answer: "1. PLANNING — decision making + strategic/operational planning.\n2. ORGANIZING — organizing & delegating work (+ HRM staffing, teamwork).\n3. LEADING — organizational behavior, motivation, leadership.\n4. CONTROLLING — control systems, finances & people.\n\nThey are distinct yet interrelated, performed simultaneously — NOT linear steps.",
            explanation: "The whole course is structured around the four functions."
        },
        {
            question: "Cross-topic: the word 'CONTINGENCY' appears in several chapters — where?",
            answer: "• HISTORY — contingency theory: the best management approach depends on the situation (stable→mechanistic, innovative→organic).\n• PLANNING — contingency plans: backup plans for uncontrollable events.\n• LEADERSHIP — situational leadership is also called contingency theory (style depends on the situation).",
            explanation: "'It depends on the situation' is a recurring management idea."
        },
        {
            question: "EXAM REVIEW: contrast MECHANISTIC vs ORGANIC across the course.",
            answer: "• STRUCTURE — mechanistic = bureaucratic, centralized, specialized; organic = flexible, decentralized, broad jobs.\n• ENVIRONMENT — mechanistic fits stable; organic fits dynamic.\n• TEAMS — mechanistic firms use management-directed groups; organic firms use self-directed teams.\n• APPRAISAL — mechanistic = manager evaluates; organic = peers (360-degree).",
            explanation: "The mechanistic–organic continuum ties together organizing, teamwork and HRM."
        },
        {
            question: "Cross-topic: which decision-making STEPS and control STEPS overlap?",
            answer: "Both end in PLANNING, IMPLEMENTING and CONTROLLING.\n• Decision-making model step 5–6 = plan/implement + control.\n• Control systems process = set standards → measure → compare → correct.\n\nObjectives are the common starting point: 'objectives are the ends; plans are the means.'",
            explanation: "Planning and controlling are two sides of the same coin (you can't control without objectives)."
        },
        {
            question: "EXAM REVIEW: match the theorist to the idea — Taylor, Maslow, Herzberg, Vroom, Mintzberg, Tuckman.",
            answer: "• TAYLOR — scientific management (job efficiency).\n• MASLOW — hierarchy of needs (5 levels).\n• HERZBERG — two-factor theory (maintenance vs motivators).\n• VROOM — expectancy theory (E × I × V).\n• MINTZBERG — 10 management roles (3 categories).\n• TUCKMAN — 5 stages of group development.",
            explanation: "Knowing the name behind each model is a common exam question."
        },
        {
            question: "Cross-topic: how does MOTIVATION connect content, process and reinforcement theories?",
            answer: "• CONTENT (Maslow, ERG, Herzberg, McClelland) = WHAT needs motivate.\n• PROCESS (equity, goal-setting, expectancy) = HOW/WHY we choose behaviors.\n• REINFORCEMENT (positive, avoidance, punishment, extinction) = consequences shape behavior.\n\nAll feed the performance formula: performance = ability × motivation × resources.",
            explanation: "Three complementary lenses on the single question 'how do I motivate people?'"
        }
    ],

    quiz: [
        {
            question: "The four management functions are:",
            options: [
                "Plan, hire, sell, report",
                "Plan, organize, lead, control",
                "Analyze, decide, act, review",
                "Mission, vision, values, goals"
            ],
            correct: 1
        },
        {
            question: "'The best approach depends on the situation' is the core idea of:",
            options: [
                "Scientific management",
                "Contingency theory",
                "Bureaucracy",
                "Equity theory"
            ],
            correct: 1
        },
        {
            question: "Which pairing is correct?",
            options: [
                "Maslow – two-factor theory",
                "Herzberg – hierarchy of needs",
                "Vroom – expectancy theory",
                "Tuckman – acquired needs"
            ],
            correct: 2
        },
        {
            question: "A self-directed team appears at which Tuckman stage?",
            options: ["Forming", "Storming", "Norming", "Performing"],
            correct: 3
        },
        {
            question: "On the Leadership Grid, the ideal style is:",
            options: ["(1,1)", "(9,1)", "(1,9)", "(9,9)"],
            correct: 3
        },
        {
            question: "Which is an EQUITY/EQUITY-financing instrument the firm never repays?",
            options: ["Bonds", "Stock", "Loans", "Budgets"],
            correct: 1
        },
        {
            question: "Selling products closer to the final customer (e.g. Apple Stores) is:",
            options: [
                "Backward integration",
                "Forward integration",
                "Diversification",
                "Concentration"
            ],
            correct: 1
        },
        {
            question: "Which control anticipates and PREVENTS problems at the input stage?",
            options: [
                "Concurrent",
                "Rework",
                "Preliminary (feedforward)",
                "Damage"
            ],
            correct: 2
        }
    ],

    fillBlanks: [
        {
            sentence: "The four management functions are planning, organizing, leading and _______.",
            answer: "controlling",
            hint: "Monitor and correct..."
        },
        {
            sentence: "Performance = ability × _______ × resources.",
            answer: "motivation",
            hint: "Willingness to achieve objectives..."
        },
        {
            sentence: "The best management approach depends on the situation — this is _______ theory.",
            answer: "contingency",
            hint: "'It depends'..."
        },
        {
            sentence: "Vroom's expectancy formula is expectancy × instrumentality × _______.",
            answer: "valence",
            hint: "The value of the reward..."
        },
        {
            sentence: "On the balance sheet, assets = liabilities + owners' _______.",
            answer: "equity",
            hint: "The owners' share..."
        }
    ],

    learn: {
        title: "Final Exam Practice — How to Use",
        content: `
            <h3>What is this category?</h3>
            <p>A cross-topic practice set combining all course topics — exactly how the final mixes them.
            Use it AFTER reviewing the two midterm halves.</p>

            <h4>The course in one map</h4>
            <div class="formula-box">
                K1 (TU2–TU7): history · decision making · strategic planning · organizing · teamwork · HRM<br>
                K2 (TU8–TU11): organizational behavior · motivation · leadership · control systems
            </div>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Cross-topic favourites</h4>
                <ul>
                    <li>The four functions: planning · organizing · leading · controlling</li>
                    <li>Theorist → idea: Taylor, Fayol, Maslow, Herzberg, McClelland, Vroom, Mintzberg, Tuckman</li>
                    <li>Mechanistic vs organic (structure · environment · teams · appraisal)</li>
                    <li>"Contingency" across history, planning and leadership</li>
                    <li>Motivation: content (needs) · process (how/why) · reinforcement (consequences)</li>
                    <li>Finances: master budget · the three financial statements · bonds vs stock</li>
                </ul>
            </div>
        `
    }
};

const managementFinal = Object.assign(
    {},
    (typeof window !== "undefined" && window.managementM1) ? window.managementM1 : {},
    (typeof window !== "undefined" && window.managementM2) ? window.managementM2 : {},
    { examPractice: managementExamPractice }
);

if (typeof window !== "undefined") { window.managementFinal = managementFinal; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: managementExamPractice });
}
