// ===== TRAFFIC IN TOURISM — Final Exam (hybrid) =====
// Pattern identical to the other subjects' finals: the final lesson MERGES both midterms
// and adds one curated cross-topic "Exam Practice" category.
//   trafficFinal = Object.assign({}, trafficM1 (K1, weeks 1–6), trafficM2 (K2, weeks 7–15), { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.trafficM1 and window.trafficM2 at module-load time.

const trafficExamPractice = {
    name: "Exam Practice (All Topics)",
    icon: "fa-graduation-cap",
    color: "#f59e0b",

    flashcards: [
        {
            question: "Which topics make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm (weeks 1–6): Theoretical basis of traffic · Interdependence of traffic & tourism · Mobility & travel patterns · Road transport ↔ destination · Road transport as a tourism product · Rail transport ↔ destination.\n\n2nd midterm (weeks 7–15): Rail as a tourism product (+ funicular/cable car) · Air transport · Water transport · Value & quality of services · Safety in traffic · Ecological aspects · The future of transport.",
            explanation: "K1 = theory + road + rail-connector; K2 = the remaining modes + services, safety, ecology & future."
        },
        {
            question: "CROSS-TOPIC: for EVERY mode the lectures use the same two-role scheme — what is it?",
            answer: "Each transport mode is treated (1) BETWEEN the demand market and the destination (its role as a CONNECTOR — accessibility), and (2) IN THE FORM OF A TOURISM PRODUCT (when the journey itself is the attraction).\n\nRoad: connector vs bus tours/cycling. Rail: connector vs railway tourism. Air: connector vs charter/space. Water: connector vs cruises/nautical.",
            explanation: "Spotting this pattern is the single best way to organise the whole course in your head."
        },
        {
            question: "EXAM REVIEW: rank the modes on SPEED, COST, SAFETY, ECOLOGY and ELASTICITY.",
            answer: "• SPEED: air ≫ (HS) rail > road > water.\n• COST per passenger: water/rail low · road medium · air high.\n• SAFETY: rail safest, then maritime; ROAD & AIR least safe (most traffic).\n• ECOLOGY: rail greenest (electric); car & air most carbon-intensive.\n• ELASTICITY: road most elastic (door-to-door); rail/air/water inelastic (line/infrastructure-bound).",
            explanation: "No mode wins on everything — which is exactly why tourist transport is multimodal."
        },
        {
            question: "CROSS-TOPIC: where does 'INELASTICITY' appear, and why does it force MULTIMODALITY?",
            answer: "Rail, air and water are INELASTIC — bound to lines, airports, ports and schedules, and cannot do door-to-door. So they need ROAD transport (transfers, shuttles, rent-a-car, car-carrying trains) to complete the journey → tourist transport is typically MULTIMODAL (combined trips: bus+plane, bus+boat, bus+train).",
            explanation: "Road's elasticity is the glue that connects all the inelastic modes to the door."
        },
        {
            question: "EXAM REVIEW: how do SAFETY (active/passive) and ECOLOGY tie into transport-service QUALITY & policy?",
            answer: "• Safety: ACTIVE (prevent crash) + PASSIVE (reduce damage); safety is a QUALITY dimension and is lowest in road/air.\n• Ecology: transport ≈ 25% of EU emissions (road ≈ 71.7%, cars ≈ 61% of road CO2); the only sector still rising.\n• Both are steered by TRANSPORT POLICY — 'polluter pays' pricing, modal shift to rail, the Green Deal's −90% by 2050.",
            explanation: "Quality, safety, ecology and policy are the 'why it matters' layer over the modes."
        },
        {
            question: "CROSS-TOPIC: trace the SUSTAINABILITY thread from daily mobility to the EU future strategy.",
            answer: "Daily mobility = car-dominated & fossil-fuelled (patterns), but citizens will switch IF a green alternative is affordable, available & not slower → EU pushes a MODAL SHIFT to rail/public/active transport, integrated ticketing (MaaS), zero-emission vehicles & carbon pricing → goal: −90% transport emissions by 2050 (Sustainable & Smart Mobility Strategy).",
            explanation: "The course builds from how people move now to how the EU wants them to move in future."
        },
        {
            question: "EXAM REVIEW: match each tourism product to its mode — cruise, charter, railway tourism, rent-a-car, nautical tourism, funicular.",
            answer: "• CRUISE & NAUTICAL TOURISM → WATER (maritime).\n• CHARTER (and space tourism) → AIR.\n• RAILWAY TOURISM & FUNICULAR/cable car → RAIL.\n• RENT-A-CAR, bus excursions & cycling tourism → ROAD.\n\nIn each, the transport service is the BACKBONE of the tourism product.",
            explanation: "These are the classic 'transport as a tourism product' examples per mode."
        }
    ],

    quiz: [
        {
            question: "Which scheme does the course apply to EVERY transport mode?",
            options: [
                "Cheap vs expensive only",
                "Connector (market↔destination) AND part of the tourism product",
                "Summer vs winter only",
                "Public vs private only"
            ],
            correct: 1
        },
        {
            question: "The fastest mode over long/intercontinental distances is:",
            options: ["Rail", "Air", "Road", "Water"],
            correct: 1
        },
        {
            question: "The greenest motorised mode (and EU's modal-shift target) is:",
            options: ["Air", "Road (cars)", "Rail", "None"],
            correct: 2
        },
        {
            question: "Tourist transport is typically multimodal because inelastic modes need ____ to finish the journey:",
            options: ["air", "road (door-to-door)", "rail", "sea"],
            correct: 1
        },
        {
            question: "Seat belts and airbags are ____ safety; brakes and steering are ____ safety:",
            options: [
                "active / passive",
                "passive / active",
                "both active",
                "both passive"
            ],
            correct: 1
        },
        {
            question: "Transport is responsible for roughly what share of EU greenhouse-gas emissions?",
            options: ["~5%", "~25%", "~50%", "~90%"],
            correct: 1
        },
        {
            question: "A 'time charter' in air transport means:",
            options: [
                "One single flight",
                "Exclusive use of the aircraft for the whole season (most economical)",
                "Splitting capacity among agencies",
                "A scheduled low-cost flight"
            ],
            correct: 1
        },
        {
            question: "The EU Sustainable & Smart Mobility Strategy targets transport emissions to fall by:",
            options: ["10% by 2050", "90% by 2050", "25% by 2030 only", "It sets no target"],
            correct: 1
        }
    ],

    fillBlanks: [
        { sentence: "Each mode is studied as a connector AND as part of the tourism _______.", answer: "product", hint: "when the trip is the attraction" },
        { sentence: "Inelastic modes (rail/air/water) rely on _______ transport for the door-to-door part.", answer: "road", hint: "the elastic mode" },
        { sentence: "Combining at least two transport branches in one trip is a _______ (combined) journey.", answer: "multimodal", hint: "many modes" },
        { sentence: "The greenest motorised mode, favoured by EU modal-shift policy, is _______.", answer: "rail", hint: "electric trains" },
        { sentence: "Transport causes about a _______ of EU greenhouse-gas emissions.", answer: "quarter", hint: "~25%" },
        { sentence: "The EU strategy aims to cut transport emissions by _______ % by 2050.", answer: "90", hint: "nine-zero" }
    ],

    learn: {
        title: "Final Exam Practice — How to Use",
        content: `
            <h3>What is this category?</h3>
            <p>A cross-topic practice set combining all course topics — exactly how the final mixes them. Use it AFTER
            reviewing the two midterm halves.</p>

            <h4>The course in one map</h4>
            <div class="formula-box">
                K1 (weeks 1–6): theory · interdependence · mobility patterns · road (connector + product) · rail (connector)<br>
                K2 (weeks 7–15): rail product (+funicular) · air · water · value &amp; quality · safety · ecology · future
            </div>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Cross-topic favourites</h4>
                <ul>
                    <li>Every mode = CONNECTOR + TOURISM PRODUCT (the master pattern)</li>
                    <li>Mode ranking: speed · cost · safety · ecology · elasticity</li>
                    <li>Inelasticity → multimodality (road glues the inelastic modes to the door)</li>
                    <li>Safety: active (prevent) vs passive (protect); lowest in road &amp; air</li>
                    <li>Ecology: transport ≈25% of EU emissions; rail greenest; 'polluter pays'</li>
                    <li>Future: 3 pillars · MaaS &amp; integrated ticketing · −90% by 2050</li>
                </ul>
            </div>
        `
    }
};

const trafficFinal = Object.assign(
    {},
    (typeof window !== "undefined" && window.trafficM1) ? window.trafficM1 : {},
    (typeof window !== "undefined" && window.trafficM2) ? window.trafficM2 : {},
    { examPractice: trafficExamPractice }
);

if (typeof window !== "undefined") { window.trafficFinal = trafficFinal; }
if (typeof module !== "undefined" && module.exports) {
    module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'), { examPractice: trafficExamPractice });
}
