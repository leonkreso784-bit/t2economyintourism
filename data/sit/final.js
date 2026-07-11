// ===== SPECIAL INTEREST TOURISM — Final Exam (hybrid) =====
// Pattern identical to the other subjects' finals: the final lesson MERGES both midterms
// and adds one curated cross-topic "Exam Practice" category.
//   sitFinal = Object.assign({}, sitM1 (K1, lectures 1–6), sitM2 (K2, lectures 8–15), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.sitM1 and window.sitM2 at module-load time.

const sitExamPractice = {
    id: "d213rl",
    name: "Exam Practice (All Topics)",
    icon: "fa-graduation-cap",
    color: "#f59e0b",

    flashcards: [
        {
            id: "hl46jl",
            question: "Which topics make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (lectures 1–6): Introduction to tourism, Destination management, From mass/over-tourism to SIT, Business tourism, Cultural tourism, Industrial tourism.\n\n2nd midterm (lectures 8–15): Nautical, Sports, Luxury, Dark, Health and Film tourism.",
            explanation: "K1 = foundations + first types; K2 = the specialised SIT types."
        },
        {
            id: "ozts92",
            question: "EXAM REVIEW: What is SPECIAL INTEREST TOURISM, and how does its decision logic differ from GIT?",
            answer: "SIT = tourism where the traveller's motivation is determined by a PARTICULAR SPECIAL INTEREST (≈ niche tourism).\n\nDecision logic: GIT asks 'WHERE shall I go?' (destination-led); SIT asks 'WHAT interest do I want to pursue, and where can I do it?' (interest-led). SIT tourists are a minority — experienced, less price-sensitive, allocentric.",
            explanation: "The interest, not the destination, drives the SIT decision."
        },
        {
            id: "8f0o9u",
            question: "Cross-topic: which SIT types are sub-forms of CULTURAL tourism?",
            answer: "• INDUSTRIAL tourism is generally considered a form of CULTURAL tourism.\n• DARK tourism overlaps with cultural/heritage tourism (sites of death & suffering).\n• FILM tourism emerged as a niche of cultural tourism (alongside heritage, arts, gastronomic, creative).\n\nCultural tourism itself = tangible + intangible + contemporary culture (UNWTO 2018).",
            explanation: "Cultural tourism is the broad umbrella for several SIT types."
        },
        {
            id: "7wrer1",
            question: "Cross-topic: how does the EXPERIENCE ECONOMY (Pine & Gilmore) appear across SIT?",
            answer: "Value rises: raw material → product → service → EXPERIENCE.\n\n• INDUSTRIAL tourism turns work into a memorable multi-sensory experience.\n• SPORTS tourism: tourism is 'experience-orientated' (the coffee example: a $5 Starbucks coffee = an experience).\n• LUXURY tourism: luxury services are experiences (intangible, non-owned, memory-based).\n\nExperiences are the foundation of special interest tourism.",
            explanation: "The experience economy underpins SIT broadly."
        },
        {
            id: "co20bz",
            question: "EXAM REVIEW: Match the typology to its author — cultural tourists, tourist roles, film tourists, dark tourism spectrum.",
            answer: "• McKERCHER (2002) — 5 CULTURAL tourists (centrality × depth): purposeful/sightseeing/casual/incidental/serendipitous\n• COHEN (1972) — 4 TOURIST roles: organized mass / individual mass / explorer / drifter\n• MACIONIS (2004) — 3 FILM tourists: specific / general / serendipitous (+ elite)\n• STONE (2006) — DARK tourism spectrum: 7 suppliers, lightest → darkest",
            explanation: "Four key typologies and their authors."
        },
        {
            id: "xhx0f3",
            question: "Cross-topic: how does CROATIA feature across SIT types?",
            answer: "• NAUTICAL — indented Adriatic coast + ~1,200 islands + ACI marinas → a leading nautical destination\n• MASS/OVERTOURISM — pronounced seasonality; 92.5% of accommodation on the coast\n• FILM — Dubrovnik as 'King's Landing' (Game of Thrones) → ~37.9% more arrivals\n• CULTURAL — Dubrovnik Old Town (UNESCO World Heritage); Croatian National Theatre",
            explanation: "Croatia recurs as a case study across the course."
        }
    ],

    quiz: [
        {
            id: "eux4ew",
            question: "Special Interest Tourism is driven primarily by:",
            options: [
                "The destination",
                "A particular special interest/activity",
                "The lowest price",
                "The accommodation quality"
            ],
            correct: 1
        },
        {
            id: "thb6c6",
            question: "Which is a form of CULTURAL tourism?",
            options: [
                "Industrial tourism",
                "Nautical cruising",
                "Spa wellness",
                "Sailing"
            ],
            correct: 0
        },
        {
            id: "ge8hi5",
            question: "McKercher's 5 types classify which kind of tourist?",
            options: [
                "Film tourists",
                "Cultural tourists",
                "Sport tourists",
                "Dark tourists"
            ],
            correct: 1
        },
        {
            id: "mouwe3",
            question: "Health tourism is the umbrella term for:",
            options: [
                "Wellness + medical tourism",
                "Dark + film tourism",
                "Sports + nautical tourism",
                "Business + luxury tourism"
            ],
            correct: 0
        },
        {
            id: "9ze0a4",
            question: "At the lightest end of Stone's dark tourism spectrum are:",
            options: [
                "Dark camps of genocide",
                "Dark fun factories",
                "Dark conflict sites",
                "Dark shrines"
            ],
            correct: 1
        },
        {
            id: "hr6r5z",
            question: "'Masstige' relates to which SIT type?",
            options: [
                "Dark tourism",
                "Luxury tourism",
                "Sports tourism",
                "Nautical tourism"
            ],
            correct: 1
        },
        {
            id: "ihxlg4",
            question: "The Dubrovnik / Game of Thrones case illustrates:",
            options: [
                "Medical tourism",
                "Film-induced tourism",
                "Industrial tourism",
                "Business tourism"
            ],
            correct: 1
        },
        {
            id: "tp1kf1",
            question: "In sports tourism, when the HOLIDAY is primary and sport secondary, it is:",
            options: [
                "Sports tourism",
                "Tourism sport",
                "Nostalgia sport tourism",
                "Event sport tourism"
            ],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            id: "gd8zwk",
            sentence: "For SIT tourists, the _______ drives the decision, not the destination.",
            answer: "interest",
            hint: "The special activity..."
        },
        {
            id: "c1fftc",
            sentence: "Industrial tourism is generally considered a form of _______ tourism.",
            answer: "cultural",
            hint: "The broad umbrella..."
        },
        {
            id: "6o7inf",
            sentence: "Health tourism = wellness tourism + _______ tourism.",
            answer: "medical",
            hint: "The curative subtype..."
        },
        {
            id: "41gxit",
            sentence: "In the experience economy, value rises from raw material to product to service to _______.",
            answer: "experience",
            hint: "The top level..."
        },
        {
            id: "exybwm",
            sentence: "Dubrovnik was marketed as King's Landing from the series _______.",
            answer: "Game of Thrones",
            hint: "HBO megahit..."
        }
    ],

    learn: {
        id: "xy50mu",
        title: "Final Exam Practice — How to Use",
        content: `
            <h3>What is this category?</h3>
            <p>A cross-topic practice set combining all course topics — exactly how the final mixes them.
            Use it AFTER reviewing the two midterm halves.</p>

            <h4>The course in one map</h4>
            <div class="formula-box">
                FOUNDATIONS (1–3): tourism definitions & SDGs · destination management · mass/over-tourism → SIT<br>
                K1 TYPES (4–6): business (MICE) · cultural · industrial<br>
                K2 TYPES (8–15): nautical · sports · luxury · dark · health · film
            </div>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Cross-topic favourites</h4>
                <ul>
                    <li>GIT vs MIT vs SIT decision logic; the SIT tourist profile</li>
                    <li>Typologies: McKercher (cultural) · Cohen (roles) · Macionis (film) · Stone (dark spectrum)</li>
                    <li>Cultural tourism as the umbrella for industrial / dark / film</li>
                    <li>Experience economy across industrial, sports and luxury</li>
                    <li>Health tourism = wellness (preventive) + medical (curative)</li>
                    <li>Croatia case studies: nautical (ACI), Dubrovnik (GoT), overtourism seasonality</li>
                </ul>
            </div>
        `
    }
};

const sitFinal = Object.assign(
    {},
    (typeof window !== "undefined" && window.sitM1) ? window.sitM1 : {},
    (typeof window !== "undefined" && window.sitM2) ? window.sitM2 : {},
    { examPractice: sitExamPractice }
);

if (typeof window !== "undefined") { window.sitFinal = sitFinal; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: sitExamPractice });
}
