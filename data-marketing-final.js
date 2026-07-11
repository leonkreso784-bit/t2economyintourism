// ===== MARKETING - FINAL EXAM (T1-T13) =====
// Zavrsni ispit = oba kolokvija zajedno (Object.assign marketingData + marketingM2Data)
// PLUS kurirana "Exam Practice" kategorija koja integrira sve teme (cross-topic).
// MORA se ucitati POSLIJE data-marketing.js i data-marketing-m2.js (vidi catalog scripts).

// --- Kurirana capstone kategorija: integrira T1-T13 (nova pitanja, za ponavljanje) ---
const marketingExamPractice = {
    id: "7oeol9",
    name: "Exam Practice (All Topics)",
    icon: "fa-graduation-cap",
    color: "#ec4899",

    flashcards: [
        {
            id: "v0w3m5",
            question: "What are the elements of the marketing mix (4Ps), and which extra Ps apply to services?",
            answer: "The 4Ps: Product, Price, Distribution (Place), and Promotion. Services add three more Ps: People, Physical evidence, and Processes.",
            explanation: "Product is the element on which the others are built."
        },
        {
            id: "21waqs",
            question: "Summarize the evolution of business concepts.",
            answer: "Production concept -> selling concept -> marketing concept -> relationship/holistic marketing, shifting from output focus to customer and value focus.",
            explanation: "The marketing concept starts from customer needs."
        },
        {
            id: "64cj7u",
            question: "What is the STP sequence and why does it matter?",
            answer: "Segmentation -> Targeting -> Positioning: divide a heterogeneous market into homogeneous segments, select target segment(s), and design a distinct position in the consumer's mind.",
            explanation: "STP precedes marketing-mix decisions."
        },
        {
            id: "gw9f9d",
            question: "How do the macro and micro marketing environments differ?",
            answer: "Macro = indirect, less controllable factors (PESTLE: political, economic, social, technological, legal, environmental). Micro = direct actors close to the firm (consumers, competitors, suppliers, distributors).",
            explanation: "Monitor the macro; manage the micro."
        },
        {
            id: "9s2314",
            question: "What are market discrepancies, and how does marketing address them?",
            answer: "Gaps between producers and consumers in space, time, information, value perception, ownership, and quantity/assortment. Marketing functions reduce them and create form, place, time and possession utility.",
            explanation: "Exchange reconciles producer and buyer logic."
        },
        {
            id: "xgcan9",
            question: "Connect the product life cycle to pricing and promotion.",
            answer: "Introduction (inform, low or high price), growth (differentiate, build loyalty), maturity (defend share, flexible price, remind), decline (cut costs, keep loyal buyers). Pricing and promotion shift in each phase.",
            explanation: "Marketing responses change across the PLC."
        },
        {
            id: "ty11xb",
            question: "Distinguish the four pricing strategies from the three method groups.",
            answer: "Strategies: penetration (low), skimming (high), psychological, value-based. Method groups: cost-based (average cost, mark-up, break-even), demand-based, and competitor-based.",
            explanation: "Strategy = intent; method = how the number is calculated."
        },
        {
            id: "dzi7hs",
            question: "How do push and pull strategies link promotion and distribution?",
            answer: "Push promotes to the next channel member (personal selling, sales promotion) along the product flow. Pull promotes directly to consumers (advertising, PR, publicity) to draw demand back through the channel. A combination is most common.",
            explanation: "They coordinate the promotional mix with the channel."
        },
        {
            id: "48dlun",
            question: "Compare the promotional-mix elements by payment and control.",
            answer: "Advertising (paid, mass media), personal selling (paid, direct), sales promotion (paid, short-term), public relations (managed, unpaid), publicity (unpaid, not managed by the firm).",
            explanation: "PR is managed; publicity is not."
        },
        {
            id: "1a1fmy",
            question: "What are the three distribution intensities, and how do they match products?",
            answer: "Intensive (as many outlets as possible - convenience goods), selective (limited points - shopping goods), exclusive (a single distributor - specialty goods). They tie to channel decisions: direct vs indirect, length, number of channels.",
            explanation: "Intensity matches product type and target coverage."
        },
        {
            id: "5xvrvb",
            question: "How do planning, organizing and controlling form the marketing management cycle?",
            answer: "Plan (mission, SWOT, objectives, Ansoff strategy) -> organize (by function/market/product/matrix, allocate resources) -> control (annual, profitability, efficiency, strategic; set standards, compare, correct).",
            explanation: "Control feeds corrections back into planning."
        },
        {
            id: "nrm5fj",
            question: "Why are new digital trends important for promotion?",
            answer: "Internet/Intranet/Extranet, Web pages with SEO, e-mail, blogs, newsletters, webinars, social networks and mobile devices make advertising and PR widely accessible, interactive, measurable and lower-cost.",
            explanation: "Technology reshapes integrated marketing communication."
        }
    ],

    quiz: [
        {
            id: "zbetz8",
            question: "The marketing mix consists of:",
            options: ["Segmentation, targeting, positioning", "Product, price, distribution, promotion", "Strengths, weaknesses, opportunities, threats", "Plan, organize, control"],
            correct: 1
        },
        {
            id: "y4svmv",
            question: "Which is the correct strategic order?",
            options: ["Positioning -> targeting -> segmentation", "Segmentation -> targeting -> positioning", "Targeting -> positioning -> segmentation", "Segmentation -> positioning -> targeting"],
            correct: 1
        },
        {
            id: "cdfwhg",
            question: "PESTLE factors belong to the:",
            options: ["Micro environment", "Macro environment", "Marketing mix", "Promotional mix"],
            correct: 1
        },
        {
            id: "0kj8vw",
            question: "'Defend market share with flexible pricing' fits which life-cycle phase?",
            options: ["Introduction", "Growth", "Maturity", "Decline"],
            correct: 2
        },
        {
            id: "acdbwy",
            question: "The break-even point is a _____ pricing method:",
            options: ["Demand-based", "Competitor-based", "Cost-based", "Psychological"],
            correct: 2
        },
        {
            id: "7zdmgz",
            question: "Promoting directly to consumers to draw demand through the channel is:",
            options: ["Push", "Pull", "Skimming", "Penetration"],
            correct: 1
        },
        {
            id: "ri0em9",
            question: "Selling specialty goods through a single distributor is _____ distribution:",
            options: ["Intensive", "Selective", "Exclusive", "Direct"],
            correct: 2
        },
        {
            id: "fvda8t",
            question: "Entering a new market with a new product (Ansoff matrix) is:",
            options: ["Market penetration", "Market development", "Product development", "Diversification"],
            correct: 3
        },
        {
            id: "1nbe7g",
            question: "A matrix marketing organization suits a firm with:",
            options: ["One market, one product", "Many markets, many products", "No products", "Only online sales"],
            correct: 1
        },
        {
            id: "ccgteh",
            question: "Publicity differs from public relations because publicity is:",
            options: ["Paid and managed", "Unpaid and not managed by the firm", "Used only in B2B", "A pricing method"],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            id: "1q2nw8",
            sentence: "The marketing mix is product, price, distribution and _______.",
            answer: "promotion",
            hint: "The fourth P..."
        },
        {
            id: "sl46ud",
            sentence: "Services add three extra Ps: people, physical evidence and _______.",
            answer: "processes",
            hint: "How the service is delivered..."
        },
        {
            id: "a9x5tp",
            sentence: "_______ analysis examines internal strengths/weaknesses and external opportunities/threats.",
            answer: "SWOT",
            hint: "S-W-O-T..."
        },
        {
            id: "19d92l",
            sentence: "Penetration pricing uses a _______ initial price to win price-sensitive buyers.",
            answer: "low",
            hint: "Opposite of skimming..."
        },
        {
            id: "qty4lv",
            sentence: "A _______ strategy promotes the product to the next member of the distribution channel.",
            answer: "push",
            hint: "Along the product flow..."
        },
        {
            id: "alak2g",
            sentence: "Intensive, selective and _______ are the three intensities of distribution.",
            answer: "exclusive",
            hint: "A single distributor..."
        },
        {
            id: "mcu3yd",
            sentence: "The marketing management cycle is plan, organize and _______.",
            answer: "control",
            hint: "Monitor and correct..."
        },
        {
            id: "29574u",
            sentence: "Macro environmental factors are summarized by the acronym _______.",
            answer: "PESTLE",
            hint: "Political, Economic, Social, Technological, Legal, Environmental..."
        }
    ],

    learn: {
        id: "ciuyup",
        title: "Final Exam Roadmap - Topics 1 to 13",
        content: `
            <h3>How the Course Fits Together</h3>
            <p>The final exam covers all thirteen topics. Use this roadmap to connect them rather than memorize them in isolation - examiners reward links between concepts.</p>

            <h3>1) Foundations (T1-T6)</h3>
            <ul>
                <li><strong>T1 Marketing concept:</strong> production -> selling -> marketing -> holistic; start from customer needs.</li>
                <li><strong>T2 Environment:</strong> micro (controllable actors) vs macro (PESTLE).</li>
                <li><strong>T3 Market &amp; value exchange:</strong> conditions for exchange; discrepancies (space, time, information, value, ownership, quantity); utility creation.</li>
                <li><strong>T5 Segmentation &amp; positioning:</strong> STP; segmentation variables (geographic, demographic, psychographic, behavioral); undifferentiated/differentiated/concentrated.</li>
                <li><strong>T6 Consumer behaviour &amp; research:</strong> B2C vs B2B; 5-step buying process; market research stages.</li>
            </ul>

            <h3>2) The Marketing Mix (T7-T10)</h3>
            <div class="formula-box">
                <p><strong>4Ps:</strong> Product + Price + Distribution (Place) + Promotion. <strong>Services add 3 Ps:</strong> People, Physical evidence, Processes.</p>
            </div>
            <ul>
                <li><strong>T7 Product:</strong> total product concept, classification, product programme, brand, NPD process, life cycle, services.</li>
                <li><strong>T8 Price:</strong> internal/external factors, strategies (penetration, skimming, psychological, value-based), methods (cost/demand/competitor-based).</li>
                <li><strong>T9 Distribution:</strong> channels (direct/indirect), three functions, three intensities, wholesalers/retailers, physical distribution.</li>
                <li><strong>T10 Promotion (IMC):</strong> communication process, push vs pull, promotional mix (advertising, personal selling, sales promotion, PR, publicity).</li>
            </ul>

            <h3>3) Digital and Management (T11-T13)</h3>
            <ul>
                <li><strong>T11 New trends in promotion:</strong> Internet/Intranet/Extranet, SEO, Web tools, e-mail, blog, newsletter, webinar, social networks, mobile.</li>
                <li><strong>T12 Planning:</strong> mission -> situation analysis (SWOT) -> objectives -> strategy (Ansoff matrix).</li>
                <li><strong>T13 Organizing &amp; controlling:</strong> organize by function/market/product/matrix; four control types (annual, profitability, efficiency, strategic); control process.</li>
            </ul>

            <h3>Key Cross-Topic Links</h3>
            <table>
                <tr><th>Link</th><th>Why it matters</th></tr>
                <tr><td>PLC -> price + promotion</td><td>Strategy changes by phase (introduction to decline)</td></tr>
                <tr><td>Push/pull -> promotion + distribution</td><td>The promotional mix is coordinated with the channel</td></tr>
                <tr><td>STP -> whole marketing mix</td><td>Target and position before setting the 4Ps</td></tr>
                <tr><td>Plan -> organize -> control</td><td>The management cycle; control feeds back to planning</td></tr>
            </table>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Final Exam Strategy</h4>
                <p>This "Exam Practice" set mixes all topics. Work the individual topic categories first, then use this category to test whether you can connect them. Be ready to give one practical hospitality example per concept.</p>
            </div>
        `
    }
};

// --- Final = K1 (marketingData) + K2 (marketingM2Data) + Exam Practice ---
const marketingFinalData = Object.assign(
    {},
    (typeof window !== 'undefined' && window.marketingData) ? window.marketingData : {},
    (typeof window !== 'undefined' && window.marketingM2Data) ? window.marketingM2Data : {},
    { examPractice: marketingExamPractice }
);

if (typeof window !== 'undefined') { window.marketingFinalData = marketingFinalData; }
if (typeof module !== 'undefined' && module.exports) { module.exports = marketingFinalData; }
