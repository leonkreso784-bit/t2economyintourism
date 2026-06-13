// ===== E-BUSINESS — Final Exam (hybrid) =====
// Pattern identical to te2/Marketing/Economics/Geography/Food&Nutrition finals: the final lesson
// MERGES both midterms and adds one curated cross-topic "Exam Practice" category.
//   ebusinessFinal = Object.assign({}, ebusinessM1 (K1, units 1–7), ebusinessM2 (K2, units 8–15), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.ebusinessM1 and window.ebusinessM2 at module-load time.

const ebusinessExamPractice = {
    name: "Exam Practice (All Units)",
    icon: "fa-graduation-cap",
    color: "#f59e0b",

    flashcards: [
        {
            question: "Which units make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (Units 1–7): the context of modern e-commerce, tourism distribution chain, internet/www as business platform, relationships & cash flows (merchant/agent models), computer graphics, and platform economy.\n2nd midterm (Units 8–15): visual design & identity, digital marketing, social media, Google Analytics & Trends, SEO/SEM/SERP, hotel PMS, e-business security, and challenges & trends.",
            explanation: "The course follows the 14 lecture decks; the final covers everything."
        },
        {
            question: "Trace one hotel room from supplier to client through BOTH distribution models.",
            answer: "MERCHANT: hotel gives a NET RATE (e.g. 50) with blocked rooms (allotment) → tour operator adds MARK-UP and sells at 80 → client pays the TO and receives a VOUCHER (no price shown) → hotel invoices the TO for 50; TO keeps 30.\nAGENT: hotel sets the FINAL price (e.g. 100) → agent sells at that price → hotel pays the agent a negotiated COMMISSION (e.g. 10) → client gets a booking confirmation WITH the price.",
            explanation: "The single most important exam skill from Units 4–5."
        },
        {
            question: "How do the platform economy and the tourism distribution chain connect?",
            answer: "OTAs (Booking.com, Expedia — B2C), bedbanks (Hotelbeds — B2B), GDS (Amadeus, Sabre — B2B) and review sites (TripAdvisor — C2C) are all PLATFORMS inside the distribution chain. They eliminate gatekeepers, connect suppliers and consumers, don't produce value themselves but govern value creation, and grow through network effects (demand-side economies of scale).",
            explanation: "Units 2 + 7 always pair well in cross-topic questions."
        },
        {
            question: "Connect SEO, SEM, PPC, SERP and Google Analytics into one picture.",
            answer: "The SERP shows ORGANIC results (won via SEO: on-page, off-page, technical + user interaction signals) and PAID results (PPC ads, bought via bidding; Quality Score lowers your cost per click). SEM is the umbrella = SEO + PPC. Google Analytics then measures what happens after the click on YOUR site (audience, behavior, conversions), while Google Trends measures overall MARKET search interest.",
            explanation: "Units 11 + 12 as one funnel: visibility → click → measurement."
        },
        {
            question: "Which PMS modules are mandatory, and which hotel KPIs do PMS reports track?",
            answer: "Mandatory modules: RESERVATION SYSTEM and FRONT-DESK OPERATIONS (others: customer data/CRM, revenue management, reports & analytics, POS, back-office).\nKey KPIs in reports: OCCUPANCY RATE, ADR (room revenue / rooms sold) and RevPAR (room revenue / ALL available rooms = ADR × occupancy).",
            explanation: "Unit 13 — the two 'must' modules plus the metric trio."
        },
        {
            question: "Summarise the 4 security principles and the biggest e-business challenges in hospitality.",
            answer: "Security principles (Unit 14): PRIVACY (authorized access only), INTEGRITY (data unchanged), AUTHENTICATION (both parties real), NON-REPUDIATION (no denying transactions — digital signatures).\nChallenges (Unit 15): technology implementation costs, legacy system integration, rising customer expectations, mobile optimization, overloading guests with tech / loss of human touch, and data security & GDPR compliance.",
            explanation: "The defensive half of the course in one card."
        }
    ],

    quiz: [
        {
            question: "In the merchant model the client receives a voucher. What does it NOT contain?",
            options: [
                "The guest name",
                "The hotel name",
                "The price",
                "The dates"
            ],
            correct: 2
        },
        {
            question: "Hotel net rate 60, tour operator sells at 85. The TO's margin is:",
            options: [
                "15",
                "25",
                "35",
                "60"
            ],
            correct: 1
        },
        {
            question: "Which sequence orders the web correctly from oldest to newest?",
            options: [
                "Social → Read-only → Semantic",
                "Read-only → Social → Semantic → Symbiotic",
                "Semantic → Social → Read-only",
                "Symbiotic → Semantic → Social"
            ],
            correct: 1
        },
        {
            question: "Amadeus and Sabre are examples of:",
            options: [
                "OTAs",
                "Global Distribution Systems (GDS)",
                "Meta-search engines",
                "Bedbanks"
            ],
            correct: 1
        },
        {
            question: "RevPAR equals:",
            options: [
                "Room revenue / rooms sold",
                "ADR × occupancy rate",
                "Total revenue / employees",
                "ADR + occupancy"
            ],
            correct: 1
        },
        {
            question: "SEM is best described as:",
            options: [
                "A type of SEO",
                "SEO + PPC (umbrella term)",
                "Only paid ads",
                "Social media marketing"
            ],
            correct: 1
        },
        {
            question: "Which is a USER INTERACTION ranking signal?",
            options: [
                "Server location",
                "Bounce rate and dwell time",
                "Number of employees",
                "Domain price"
            ],
            correct: 1
        },
        {
            question: "Non-repudiation in e-commerce security is ensured by:",
            options: [
                "Strong passwords",
                "Digital signatures",
                "Fast websites",
                "Cookies"
            ],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            sentence: "In the merchant model intermediaries buy at _______ rates and add a mark-up.",
            answer: "net",
            hint: "The non-public wholesale price..."
        },
        {
            sentence: "Platforms grow because each new user increases value for all — the _______ effect.",
            answer: "network",
            hint: "Demand-side economies of scale..."
        },
        {
            sentence: "RevPAR = ADR × _______ rate.",
            answer: "occupancy",
            hint: "Share of rooms filled..."
        },
        {
            sentence: "The page of organic and paid results is called the _______.",
            answer: "SERP",
            hint: "Search Engine Results Page..."
        },
        {
            sentence: "PCI-DSS is the data security standard of the payment _______ industry.",
            answer: "card",
            hint: "Credit and debit..."
        }
    ],

    learn: {
        title: "Final Exam Practice — How to Use",
        content: `
            <h3>What is this category?</h3>
            <p>A cross-topic practice set that combines all 15 units — exactly how the final mixes them.
            Use it AFTER reviewing the two midterm halves.</p>

            <h4>The course in one map</h4>
            <div class="formula-box">
                COMMERCE (Units 1–5): e-commerce models → distribution chain → internet platform → merchant/agent cash flows<br>
                DESIGN (Units 6, 8): computer graphics → visual design & identity<br>
                MARKETING (Units 9–12): digital marketing → social media → analytics → SEO/SEM<br>
                OPERATIONS & TRUST (Units 7, 13–15): platforms → PMS → security → challenges & trends
            </div>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Cross-topic favourites</h4>
                <ul>
                    <li>Merchant vs Agent model — with a numeric cash-flow example</li>
                    <li>OTA / GDS / bedbank / meta-search — who is what in the chain</li>
                    <li>SEO subcategories (FOUR, incl. user interaction signals) vs SEM/PPC</li>
                    <li>ADR / RevPAR / occupancy — formulas and meaning</li>
                    <li>4 security principles + GDPR-era challenges</li>
                </ul>
            </div>
        `
    }
};

const ebusinessFinal = Object.assign(
    {},
    (typeof window !== "undefined" && window.ebusinessM1) ? window.ebusinessM1 : {},
    (typeof window !== "undefined" && window.ebusinessM2) ? window.ebusinessM2 : {},
    { examPractice: ebusinessExamPractice }
);

if (typeof window !== "undefined") { window.ebusinessFinal = ebusinessFinal; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: ebusinessExamPractice });
}
