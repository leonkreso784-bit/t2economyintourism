// ===== TOURISM ECONOMICS (te2) — Midterm 2 (Units 7–12) =====
// Granica kolokvija po slajdu "IMPORTANT DATES" (silabus 2025/26): 2. test = jedinice 7.–12.
// K2 pokriva: 7) Strategic pricing, 8) Economic impacts & tourist expenditure,
//   9) Economic contribution, 10) Measuring contribution (TSA), 11) Tourism & the environment,
//   12) Sustainable tourism development.
// Oblik po docs/CONTENT_SCHEMA.md. Pri izmjeni bumpaj CONTENT_VERSION (js/content-loader.js).

const te2M2 = {

    // ========== UNIT 7: PRICING STRATEGIES ==========
    pricing: {
        name: "Pricing Strategies",
        icon: "fa-tags",
        color: "#8b5cf6",

        flashcards: [
            {
                question: "Is price the most critical variable for a tourism firm?",
                answer: "NO - Price is NOT the most critical variable",
                explanation: "Many other factors influence tourism firm success."
            },
            {
                question: "What are the 7 determinants of tourism prices?",
                answer: "1. Firm's objective\n2. Ownership characteristics\n3. Market structure\n4. Distribution method\n5. Market position\n6. Degree of competition\n7. Cost structure",
                explanation: "Seven factors that determine how prices are set."
            },
            {
                question: "What are the 3 pricing strategies?",
                answer: "1. COST-BASED (costs + margin)\n2. MARKET-BASED (market conditions)\n3. COMPETITION-BASED (competitor prices)",
                explanation: "Three main approaches to setting prices."
            },
            {
                question: "What happens with ELASTIC demand and higher prices?",
                answer: "Fewer buyers and smaller potential revenue",
                explanation: "Elastic = price sensitive. Higher price = less demand."
            },
            {
                question: "What happens with INELASTIC demand and lower prices?",
                answer: "More buyers, but smaller revenue potential",
                explanation: "Inelastic = not price sensitive. Lower price just reduces revenue."
            }
        ],

        quiz: [
            {
                question: "Price is the most critical variable for a tourism firm:",
                options: ["True", "False"],
                correct: 1
            },
            {
                question: "How many determinants of tourism prices are there?",
                options: ["3", "5", "7", "9"],
                correct: 2
            },
            {
                question: "Cost-based pricing means:",
                options: ["Based on competitors", "Based on costs + margin", "Based on market", "Based on demand"],
                correct: 1
            },
            {
                question: "With elastic demand and higher prices, you get:",
                options: ["More buyers", "Fewer buyers", "Same buyers", "No change"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The 3 pricing strategies are: Cost-based, Market-based, and _______-based.",
                answer: "Competition",
                hint: "Based on what rivals charge..."
            }
        ],

        learn: {
            title: "Pricing Strategies",
            content: `
                <h3>Key Pricing Concepts</h3>
                <p><span class="highlight">Price is NOT the most critical variable</span> for a tourism firm!</p>

                <h4>7 Determinants of Tourism Prices:</h4>
                <ol>
                    <li>Firm's objective</li>
                    <li>Ownership characteristics</li>
                    <li>Market structure</li>
                    <li>Distribution method</li>
                    <li>Market position</li>
                    <li>Degree of competition</li>
                    <li>Cost structure</li>
                </ol>

                <div class="formula-box">
                    <h4><i class="fas fa-tag"></i> 3 Pricing Strategies</h4>
                    <p><strong>COST-BASED:</strong> Costs + margin<br>
                    <strong>MARKET-BASED:</strong> Current market conditions<br>
                    <strong>COMPETITION-BASED:</strong> Competitor prices</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Elasticity Effects</h4>
                    <p><strong>Elastic demand + ↑ price</strong> = fewer buyers<br>
                    <strong>Inelastic demand + ↓ price</strong> = small revenue</p>
                </div>
            `
        }
    },

    // ========== UNIT 8: EXPENDITURE & MULTIPLIERS ==========
    expenditure: {
        name: "Expenditure & Multipliers",
        icon: "fa-money-bill-wave",
        color: "#059669",

        flashcards: [
            {
                question: "What is Direct Expenditure?",
                answer: "Suppliers who sell goods and services DIRECTLY to tourists",
                explanation: "Hotels, restaurants, attractions - tourists pay them directly."
            },
            {
                question: "What is Indirect Expenditure?",
                answer: "When firms receiving tourist expenditure purchase inputs from other firms",
                explanation: "Hotel buys linens, restaurant buys food from suppliers."
            },
            {
                question: "What is Induced Expenditure?",
                answer: "When managers, workers and families spend their incomes 'downstream' (supermarkets, bookstores...)",
                explanation: "Wages earned from tourism spent in local economy."
            },
            {
                question: "What is the Multiplier formula?",
                answer: "Multiplier = Total Impact / Direct Expenditure",
                explanation: "Shows how initial spending 'multiplies' through economy."
            },
            {
                question: "What is Total Effect?",
                answer: "Total Effect = Direct + Indirect + Induced effects",
                explanation: "The sum of all expenditure effects."
            },
            {
                question: "What are the 5 types of multipliers?",
                answer: "1. Sales multiplier\n2. Output multiplier\n3. Income multiplier\n4. Value-added multiplier\n5. Employment multiplier",
                explanation: "Five ways to measure the multiplier effect."
            },
            {
                question: "What are the 7 effects of increased tourist expenditure?",
                answer: "1. Increased local production\n2. Creates new business/employment\n3. Foreign exchange earnings\n4. New investment opportunities\n5. Government revenue\n6. Regional development\n7. Reduces poverty",
                explanation: "Seven positive effects of tourism spending."
            }
        ],

        quiz: [
            {
                question: "Direct expenditure involves selling:",
                options: ["To other businesses", "Directly to tourists", "To government", "To employees"],
                correct: 1
            },
            {
                question: "The Multiplier formula is:",
                options: ["Direct / Total", "Total Impact / Direct Expenditure", "Indirect × Induced", "GDP / Tourism"],
                correct: 1
            },
            {
                question: "Induced expenditure occurs when:",
                options: ["Tourists buy souvenirs", "Hotels buy supplies", "Workers spend their wages", "Government invests"],
                correct: 2
            },
            {
                question: "How many types of multipliers are there?",
                options: ["3", "5", "7", "9"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Multiplier = Total Impact / _______ Expenditure.",
                answer: "Direct",
                hint: "The initial spending..."
            },
            {
                sentence: "Total Effect = Direct + Indirect + _______ effects.",
                answer: "Induced",
                hint: "When workers spend their wages..."
            }
        ],

        learn: {
            title: "Expenditure and Multipliers",
            content: `
                <h3>Types of Expenditure</h3>
                <ul>
                    <li><strong>Direct:</strong> Selling directly to tourists</li>
                    <li><strong>Indirect:</strong> Firms buy from other firms</li>
                    <li><strong>Induced:</strong> Workers spend wages locally</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-calculator"></i> Key Formulas</h4>
                    <p><strong>Multiplier</strong> = Total Impact / Direct Expenditure<br>
                    <strong>Total Effect</strong> = Direct + Indirect + Induced</p>
                </div>

                <h4>5 Types of Multipliers:</h4>
                <ol>
                    <li>Sales multiplier</li>
                    <li>Output multiplier</li>
                    <li>Income multiplier</li>
                    <li>Value-added multiplier</li>
                    <li>Employment multiplier</li>
                </ol>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> 7 Effects of Tourist Spending</h4>
                    <p>↑ Local production • New jobs • Foreign exchange • Investment • Government revenue • Regional development • ↓ Poverty</p>
                </div>
            `
        }
    },

    // ========== UNITS 9–10: TOURISM SATELLITE ACCOUNTS (CONTRIBUTION & MEASUREMENT) ==========
    tsa: {
        name: "TSA & Economic Contribution",
        icon: "fa-chart-bar",
        color: "#ec4899",

        flashcards: [
            {
                question: "What is TSA?",
                answer: "Tourism Satellite Accounts - a standard statistical framework and main tool for economic measurement of tourism",
                explanation: "TSA solves the problem that tourism isn't a distinct sector in national accounts."
            },
            {
                question: "What are the key measures in TSA?",
                answer: "• Tourism expenditure\n• Tourism consumption\n• Tourism output\n• TGVA (Gross Value Added)\n• TGDP\n• TOGP\n• Tourism employment\n• Tourism exports/imports",
                explanation: "Key economic measures captured by TSA."
            },
            {
                question: "What is the difference between Economic Contribution and Economic Impact?",
                answer: "Contribution: Tourism spending's effect on key economic variables\nImpact: Changes in contribution from specific events/activities",
                explanation: "Contribution is ongoing, Impact is from specific changes."
            },
            {
                question: "Why is measuring tourism's economic significance difficult?",
                answer: "Because 'tourism' does not exist as a distinct sector in any system of economic statistics or national accounts",
                explanation: "Tourism cuts across many traditional economic sectors."
            }
        ],

        quiz: [
            {
                question: "TSA stands for:",
                options: ["Tourism Standard Analysis", "Tourism Satellite Accounts", "Travel Statistics Agency", "Tourism Spending Assessment"],
                correct: 1
            },
            {
                question: "Economic contribution refers to:",
                options: ["Specific event changes", "Ongoing spending effects", "Government grants", "Foreign investment"],
                correct: 1
            },
            {
                question: "Why is tourism hard to measure economically?",
                options: ["Too small", "Not in national accounts as distinct sector", "Too many tourists", "No data available"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "TSA = Tourism _______ Accounts.",
                answer: "Satellite",
                hint: "Like a satellite orbiting the main system..."
            }
        ],

        learn: {
            title: "Tourism Satellite Accounts",
            content: `
                <h3>What is TSA?</h3>
                <p><strong>Tourism Satellite Accounts (TSA)</strong> = Standard statistical framework for measuring tourism economically.</p>

                <h4>The Problem:</h4>
                <p>Tourism doesn't exist as a distinct sector in national accounts - it cuts across many industries.</p>

                <h4>Key TSA Measures:</h4>
                <ul>
                    <li>Tourism expenditure</li>
                    <li>Tourism consumption</li>
                    <li>Tourism output</li>
                    <li>TGVA (Tourism Gross Value Added)</li>
                    <li>TGDP (Tourism GDP)</li>
                    <li>Tourism employment</li>
                    <li>Tourism exports/imports</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Contribution vs Impact</h4>
                    <p><strong>Contribution:</strong> Ongoing effect on economy<br>
                    <strong>Impact:</strong> Changes from specific events</p>
                </div>
            `
        }
    },

    // ========== UNIT 11: ENVIRONMENT & MARKET FAILURE ==========
    environment: {
        name: "Environment & Market Failure",
        icon: "fa-leaf",
        color: "#22c55e",

        flashcards: [
            {
                question: "Through what does tourism affect the environment?",
                answer: "• Natural resources\n• Human resources\n• Built resources",
                explanation: "Tourism interacts with three types of resources."
            },
            {
                question: "What are the 3 major sources of market failure?",
                answer: "1. Lack of property rights to environmental resources\n2. Externalities\n3. Public goods",
                explanation: "Three reasons markets fail to protect the environment."
            },
            {
                question: "What is Tourism Carrying Capacity?",
                answer: "The maximum number of people that may visit a tourist destination at the same time",
                explanation: "Beyond this number, damage occurs to environment/experience."
            },
            {
                question: "What are Economic Instruments for environment?",
                answer: "Controls imposed on environmentally damaging activity",
                explanation: "Taxes, fees, tradable permits - using economic incentives."
            },
            {
                question: "What are 3 strategies for pollution control?",
                answer: "1. Voluntary agreements\n2. Merger\n3. Tax on output and pollution",
                explanation: "Three approaches to reducing environmental damage."
            }
        ],

        quiz: [
            {
                question: "Tourism Carrying Capacity is:",
                options: ["Maximum profit", "Maximum visitors at same time", "Maximum rooms", "Maximum flights"],
                correct: 1
            },
            {
                question: "Which is NOT a source of market failure?",
                options: ["Externalities", "Public goods", "High prices", "Lack of property rights"],
                correct: 2
            },
            {
                question: "Economic instruments for environment are:",
                options: ["Advertising", "Controls on damaging activity", "More tourism", "Building hotels"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Tourism _______ Capacity = maximum visitors at same time.",
                answer: "Carrying",
                hint: "How much can be carried..."
            }
        ],

        learn: {
            title: "Environment & Market Failure",
            content: `
                <h3>Tourism's Environmental Impact</h3>
                <p>Tourism affects environment through:</p>
                <ul>
                    <li>Natural resources</li>
                    <li>Human resources</li>
                    <li>Built resources</li>
                </ul>

                <h4>3 Sources of Market Failure:</h4>
                <ol>
                    <li>Lack of property rights to environmental resources</li>
                    <li>Externalities</li>
                    <li>Public goods</li>
                </ol>

                <div class="formula-box">
                    <h4><i class="fas fa-users"></i> Carrying Capacity</h4>
                    <p>Maximum visitors that can be at a destination at the same time without damage.</p>
                </div>

                <h4>Pollution Control Strategies:</h4>
                <ul>
                    <li>Voluntary agreements</li>
                    <li>Merger</li>
                    <li>Tax on output and pollution</li>
                </ul>
            `
        }
    },

    // ========== UNIT 12: SUSTAINABILITY & GROWTH ==========
    sustainability: {
        name: "Sustainability & Growth",
        icon: "fa-seedling",
        color: "#14b8a6",

        flashcards: [
            {
                question: "What are the potential benefits of tourism growth?",
                answer: "• Economic benefits\n• Socio-cultural benefits\n• Environmental benefits",
                explanation: "Three categories of positive impacts from tourism."
            },
            {
                question: "What are the costs of tourism growth?",
                answer: "Economic: Increased prices, cost of living\nSocio-cultural: Hectic lifestyle, loss of authenticity\nEnvironmental: Water quality, coastal erosion",
                explanation: "Three categories of negative impacts from tourism."
            },
            {
                question: "What is a Green Economy?",
                answer: "One that results in improved human well-being",
                explanation: "Focus on sustainability and quality of life."
            },
            {
                question: "What are the 4 pillars of Sustainable Tourism?",
                answer: "1. Viable long-term economic operations\n2. Respect for host communities\n3. Fairly distributed benefits\n4. Optimal use of environmental resources",
                explanation: "Four key requirements for sustainability."
            },
            {
                question: "What is Sustainable Development?",
                answer: "Social + Economic + Environmental sustainability combined",
                explanation: "Three pillars must work together."
            },
            {
                question: "What does Growth Management achieve?",
                answer: "• Economic sustainability\n• Socio-cultural sustainability\n• Environmental sustainability",
                explanation: "Three goals of proper tourism management."
            },
            {
                question: "What is Regenerative Tourism?",
                answer: "Seeks to not only minimize negative impact but actively contribute to REGENERATION of ecosystems, economies and cultures",
                explanation: "Leave destination BETTER than found - beyond sustainability."
            },
            {
                question: "What is the difference between Sustainable and Regenerative tourism?",
                answer: "Sustainable: Lessen the harm done by tourism\nRegenerative: Actively improve and restore the destination",
                explanation: "Sustainable = do less harm. Regenerative = do more good."
            }
        ],

        quiz: [
            {
                question: "Sustainable Development combines:",
                options: ["Social + Economic only", "Economic + Environmental only", "Social + Economic + Environmental", "Social + Environmental only"],
                correct: 2
            },
            {
                question: "Regenerative tourism aims to:",
                options: ["Minimize harm", "Leave destination better", "Increase profits", "Attract more tourists"],
                correct: 1
            },
            {
                question: "Which is an economic COST of tourism?",
                options: ["More jobs", "Foreign exchange", "Increased prices", "Investment"],
                correct: 2
            },
            {
                question: "A Green Economy results in:",
                options: ["More pollution", "Improved human well-being", "Higher prices", "Less tourism"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Sustainable Development = Social + Economic + _______.",
                answer: "Environmental",
                hint: "Nature, resources..."
            },
            {
                sentence: "_______ tourism seeks to leave destinations BETTER than found.",
                answer: "Regenerative",
                hint: "To regenerate means to renew..."
            }
        ],

        learn: {
            title: "Sustainability & Growth",
            content: `
                <h3>Benefits and Costs of Tourism</h3>

                <div class="tip-box">
                    <h4><i class="fas fa-plus-circle"></i> Benefits</h4>
                    <p>Economic • Socio-cultural • Environmental</p>
                </div>

                <div class="warning-box">
                    <h4><i class="fas fa-minus-circle"></i> Costs</h4>
                    <p><strong>Economic:</strong> ↑ Prices, cost of living<br>
                    <strong>Social:</strong> Hectic lifestyle, lost authenticity<br>
                    <strong>Environmental:</strong> Water, coastal erosion</p>
                </div>

                <h4>Sustainable Development:</h4>
                <div class="formula-box">
                    <p><strong>Sustainable = Social + Economic + Environmental</strong></p>
                </div>

                <h4>4 Pillars of Sustainable Tourism:</h4>
                <ol>
                    <li>Viable long-term economics</li>
                    <li>Respect for communities</li>
                    <li>Fair benefit distribution</li>
                    <li>Optimal environmental use</li>
                </ol>

                <h4>Sustainable vs Regenerative:</h4>
                <ul>
                    <li><strong>Sustainable:</strong> Lessen harm</li>
                    <li><strong>Regenerative:</strong> Actively improve and restore</li>
                </ul>

                <div class="example-box">
                    <h4><i class="fas fa-leaf"></i> Regenerative Tourism</h4>
                    <p>Goal: Leave destination BETTER than you found it!</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.te2M2 = te2M2; }
if (typeof module !== "undefined" && module.exports) { module.exports = te2M2; }
