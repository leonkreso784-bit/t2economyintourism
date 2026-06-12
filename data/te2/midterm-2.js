// ===== TOURISM ECONOMICS (te2) — Midterm 2 (Units 7–12) =====
// REBUILD iz profesorskih predavanja (FMTU Opatija, 2025/26): "Strategic pricing" (U7),
//   "Economic Impacts of Tourism" (Dwyer, U8), "Economic contribution & TSA" (U9–10),
//   "Tourism and the environment" (U11), "Sustainable Tourism Development" (Dwyer, U12).
// Granica kolokvija po silabusu (slajd "Important dates"): 2. test = jedinice 7.–12. (13.01.2026.).
// Kategorije: pricing (U7), expenditure (U8), tsa (U9–10), environment (U11), sustainability (U12).
// Oblik po docs/CONTENT_SCHEMA.md. Pri izmjeni bumpaj CONTENT_VERSION (js/content-loader.js).

const te2M2 = {

    // ========== UNIT 7: STRATEGIC PRICING ==========
    pricing: {
        name: "Strategic Pricing",
        icon: "fa-tags",
        color: "#8b5cf6",

        flashcards: [
            {
                question: "How important is price as a decision variable for a tourism firm?",
                answer: "Price is not the ONLY decision variable, but it is perhaps the MOST CRITICAL — and it is the MOST ADJUSTABLE. Unlike product, distribution and promotion (which take time to change), price can be altered QUICKLY.",
                explanation: "Pricing decisions, good or bad, have serious consequences for the firm."
            },
            {
                question: "Where does price sit in the marketing mix, and what does it signal?",
                answer: "Price is one of the 4 P's of the marketing mix (Product, Place, Price, Promotion) and should complement the others. Price triggers buyer PERCEPTION of the product's quality and its positioning within market segments — attracting or deterring buyers.",
                explanation: "Price is both a revenue lever and a quality/positioning signal."
            },
            {
                question: "Why do tourism firms differentiate their product (relative to pricing)?",
                answer: "To REDUCE the demand elasticity of their product, so they can RAISE its price and total revenue.",
                explanation: "Less elastic (less price-sensitive) demand gives the firm more pricing power."
            },
            {
                question: "List key determinants of tourism prices.",
                answer: "The firm's objective; ownership characteristics; market structure; method of distribution; the firm's market position; degree of competition; cost structure; the seasonal nature of demand; capacity constraints; product quality & brand strength; ease of switching to a substitute; the perishable nature of the product; and government involvement.",
                explanation: "Prices are governed by the interplay of many internal and external factors."
            },
            {
                question: "How does elasticity of demand affect a pricing decision?",
                answer: "Setting HIGHER prices may bring FEWER buyers and smaller revenue if demand is ELASTIC. Setting LOWER prices may bring more buyers but small revenue potential if demand is INELASTIC.",
                explanation: "The effect of a price change on total revenue depends on elasticity."
            },
            {
                question: "What are the 3 types of tourism pricing strategies?",
                answer: "1. COST-BASED — price based on the costs of production (+ a fair return), not external factors.\n2. MARKET-BASED (customer-oriented) — price based on current market conditions / what customers are willing to pay.\n3. COMPETITION-BASED — price based on competitors' strategies, costs, prices and offerings.",
                explanation: "Three broad approaches; firms may combine them."
            },
            {
                question: "Name the COST-BASED pricing sub-strategies.",
                answer: "a) Cost-plus pricing (add a mark-up to average cost).\nb) Pricing for profit maximization (price where Marginal Revenue = Marginal Cost).\nc) Marginal cost pricing (price = just above the extra cost of one more unit, ignoring fixed costs).\nd) Peak-load pricing (higher prices when demand peaks, to regulate demand to supply).",
                explanation: "All anchor the price to the firm's costs."
            },
            {
                question: "What is price discrimination and what 4 conditions must hold?",
                answer: "Charging DIFFERENT prices to different buyers for the same/similar product, based on willingness to pay (value-based pricing). Conditions: (1) the seller has some price-setting power; (2) can identify groups willing to pay different prices; (3) elasticity of demand differs across groups; (4) can prevent resale between groups.",
                explanation: "A market-based strategy that captures different consumers' willingness to pay."
            },
            {
                question: "Distinguish price skimming and penetration pricing.",
                answer: "Price SKIMMING: sell at a HIGH price first to those willing to pay (a firm first into a new market enjoys a temporary monopoly), then lower it for price-sensitive buyers.\nPENETRATION pricing: set a LOW initial entry price (often below market) to attract new, low-loyalty customers and win market share.",
                explanation: "Skimming starts high and comes down; penetration starts low to grab share."
            },
            {
                question: "What are loss-leader, promotional and bundling pricing?",
                answer: "Loss-leader: a product sold at a very low price (even at a loss) to stimulate interest in the business/product line. Promotional pricing: supports promotion (special offers, psychological pricing ending in '9', high-low, premium). Bundling: combine two or more products into one 'package' at a single, lower price than buying separately.",
                explanation: "Market-based tactics that use price to drive volume or perception."
            },
            {
                question: "Name the COMPETITION-BASED pricing sub-strategies.",
                answer: "a) Price leadership — one (usually dominant, lowest-cost) firm sets a price closely followed by competitors.\nb) Predatory pricing — deliberately setting prices so low that competitors cannot compete and are driven from the market.\nc) Transfer pricing — pricing of inputs and outputs between divisions of the SAME firm.",
                explanation: "These anchor price to rivals' behaviour or to internal divisions."
            },
            {
                question: "What are NON-PROFIT goals in pricing?",
                answer: "Firms can pursue goals that are NOT profit-driven: some managers focus on GROWTH and pursue sales at the expense of profit; some businesses are driven by LIFESTYLE choice.",
                explanation: "Not every firm sets price purely to maximise profit."
            }
        ],

        quiz: [
            {
                question: "Compared with product, distribution and promotion, price is:",
                options: ["The slowest to change", "The most adjustable (can be altered quickly)", "Never changed", "Irrelevant"],
                correct: 1
            },
            {
                question: "Price is one of the 4 P's of the marketing mix; the others are:",
                options: ["Product, Place, Promotion", "People, Process, Physical evidence", "Profit, Position, Power", "Product, Profit, Place"],
                correct: 0
            },
            {
                question: "Profit-maximizing price corresponds to the output where:",
                options: ["AC = AR", "Marginal Revenue = Marginal Cost", "Price = 0", "TC = TR"],
                correct: 1
            },
            {
                question: "Charging higher prices during peak demand to regulate it is:",
                options: ["Penetration pricing", "Peak-load pricing", "Loss-leader pricing", "Transfer pricing"],
                correct: 1
            },
            {
                question: "Selling at a high price first (as a temporary monopolist) then lowering it is:",
                options: ["Penetration pricing", "Price skimming", "Predatory pricing", "Bundling"],
                correct: 1
            },
            {
                question: "Charging different buyers different prices based on willingness to pay is:",
                options: ["Cost-plus pricing", "Price discrimination", "Transfer pricing", "Loss-leader pricing"],
                correct: 1
            },
            {
                question: "Setting prices so low that rivals are driven from the market is:",
                options: ["Price leadership", "Predatory pricing", "Penetration pricing", "Promotional pricing"],
                correct: 1
            },
            {
                question: "Firms differentiate their product mainly to:",
                options: [
                    "Increase demand elasticity",
                    "Reduce demand elasticity and raise price/revenue",
                    "Lower their costs",
                    "Avoid competition law"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Price is the most _______ of the firm's decision variables — it can be changed quickly.",
                answer: "adjustable",
                hint: "Easy/quick to alter..."
            },
            {
                sentence: "The three pricing strategies are cost-based, market-based and _______-based.",
                answer: "competition",
                hint: "Based on rivals..."
            },
            {
                sentence: "_______ pricing sets a low initial price to attract new customers and win market share.",
                answer: "Penetration",
                hint: "Break into the market..."
            },
            {
                sentence: "Cost-plus pricing adds a _______ (usually a percentage) to average cost.",
                answer: "mark-up",
                hint: "A margin on top of cost..."
            },
            {
                sentence: "_______ pricing combines two or more products into one package at a single price.",
                answer: "Bundling",
                hint: "Sell them together..."
            },
            {
                sentence: "Firms differentiate to REDUCE the demand _______ of their product.",
                answer: "elasticity",
                hint: "Price sensitivity..."
            }
        ],

        learn: {
            title: "Strategic Pricing in Tourism",
            content: `
                <h3>💲 Why Price Matters</h3>
                <p>Price is not the only decision variable, but it is <span class="highlight">perhaps the most critical</span> — and the <strong>most adjustable</strong>. Unlike product, distribution and promotion (which take time to change), price can be altered QUICKLY. It is one of the <strong>4 P's</strong> (Product, Place, Price, Promotion) and triggers buyer perception of quality and positioning. Firms differentiate their product to <strong>reduce its demand elasticity</strong> and thereby raise price and total revenue.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-balance-scale"></i> Elasticity & Revenue</h4>
                    <p>Higher price + ELASTIC demand → fewer buyers, smaller revenue.<br>
                    Lower price + INELASTIC demand → more buyers but small revenue.</p>
                    <p>Determinants of price include the firm's objective, ownership, market structure, distribution, position, competition, cost structure, seasonality, capacity constraints, brand strength, ease of substitution, perishability and government involvement.</p>
                </div>

                <h3>🏷️ The 3 Pricing Strategies & Their Tactics</h3>
                <table>
                    <tr><th>Strategy</th><th>Anchored to…</th><th>Key tactics</th></tr>
                    <tr><td><strong>Cost-based</strong></td><td>The firm's costs</td><td>Cost-plus (mark-up on avg cost) · Profit max (MR=MC) · Marginal-cost pricing · Peak-load pricing</td></tr>
                    <tr><td><strong>Market-based</strong> (customer-oriented)</td><td>Willingness to pay</td><td>Price discrimination · Two-part tariff · Skimming · Penetration · Loss-leader · Promotional · Bundling</td></tr>
                    <tr><td><strong>Competition-based</strong></td><td>Rivals' prices</td><td>Price leadership · Predatory pricing · Transfer pricing</td></tr>
                </table>

                <h4>Key tactics explained</h4>
                <ul>
                    <li><strong>Skimming:</strong> sell HIGH first (temporary monopoly), then lower for price-sensitive buyers</li>
                    <li><strong>Penetration:</strong> set a LOW initial price to win share from low-loyalty customers</li>
                    <li><strong>Peak-load:</strong> charge more when demand peaks, to keep it within capacity</li>
                    <li><strong>Loss-leader:</strong> sell very cheap (even at a loss) to stimulate overall interest</li>
                    <li><strong>Predatory:</strong> price so low that rivals are driven out · <strong>Transfer:</strong> pricing between divisions of the same firm</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-tags"></i> Price Discrimination — 4 conditions</h4>
                    <p>(1) the seller has some price-setting power · (2) can identify groups with different willingness to pay · (3) elasticity differs across groups · (4) can prevent resale between groups.</p>
                </div>

                <p><strong>Non-profit goals:</strong> some firms chase growth/sales over profit, or are driven by lifestyle choices rather than profit maximization.</p>
            `
        }
    },

    // ========== UNIT 8: ECONOMIC IMPACTS & THE MULTIPLIER ==========
    expenditure: {
        name: "Economic Impacts & Multiplier",
        icon: "fa-money-bill-trend-up",
        color: "#059669",

        flashcards: [
            {
                question: "Where does the economic contribution of tourism start, and what is the basic measure?",
                answer: "It starts with TOURIST EXPENDITURE. The basic measure is expenditure injected by type of visitor, by visitor night, and by length of stay.",
                explanation: "Expenditure data alone is not enough — we then need the economic IMPACTS of that expenditure."
            },
            {
                question: "What are the 7 major impacts of increased tourist expenditure?",
                answer: "1. Increased local production & output\n2. Creates new business & employment\n3. Generates foreign-exchange earnings (international, NOT domestic tourism)\n4. Creates new investment opportunities\n5. Increased government revenue (via taxes)\n6. Assists regional development\n7. Reduces poverty in some locations",
                explanation: "FX earnings come only from INTERNATIONAL tourism (an export industry)."
            },
            {
                question: "Why is tourist expenditure described as an injection of 'new money'?",
                answer: "Expenditure by visitors to a destination is 'new money' entering it, boosting output and employment in local primary, secondary and tertiary industries. The size of the output increase depends on the strength of business links between tourism and other sectors.",
                explanation: "Stronger links to local suppliers = bigger local impact (fewer leakages)."
            },
            {
                question: "On what does the value of foreign-exchange (FX) earnings from inbound tourism depend?",
                answer: "On the number of visitors, the average expenditure per day, the average length of stay, and the exchange rate.",
                explanation: "International tourism is an export industry that can help stabilise total export earnings."
            },
            {
                question: "How does tourism contribute to government revenue (direct vs indirect taxes)?",
                answer: "Direct taxes (paid directly to government): airport departure taxes, noise taxes, visa fees. Indirect taxes (levied on goods/services): sales taxes, fuel taxes, tariffs, accommodation taxes. Companies also pay profit tax and employees pay income tax.",
                explanation: "But governments also SPEND heavily supporting tourism (infrastructure, marketing, ministries)."
            },
            {
                question: "Define direct, indirect and induced expenditure effects.",
                answer: "DIRECT: suppliers who sell goods/services directly to tourists (accommodation, F&B, tours, attractions, entertainment, shopping).\nINDIRECT ('upstream'): firms receiving tourist money buy inputs from other firms, who buy from others, along the supply chain.\nINDUCED ('downstream'): recipients (owners, workers, families) spend their increased incomes on consumption.",
                explanation: "Tourist expenditure (the starting point) generates direct + secondary (indirect + induced) effects."
            },
            {
                question: "What is the multiplier and the total multiplier effect?",
                answer: "Multiplier = Total Impact / Direct Expenditure. The total multiplier effect = the SUM of direct + indirect + induced effects, reflected as overall increases in output, sales, value added, GDP, household income, and employment.",
                explanation: "It shows how the initial spending 'multiplies' through the economy."
            },
            {
                question: "What are the 5 most common types of multipliers?",
                answer: "1. Sales (transactions) multiplier\n2. Output multiplier\n3. Income multiplier\n4. Value-added multiplier\n5. Employment multiplier",
                explanation: "Each relates total economic activity generated to an extra unit of final demand."
            },
            {
                question: "How large is the tourism multiplier in reality?",
                answer: "Not as large as the industry thinks — more sophisticated modelling shows it is unlikely to EXCEED 2. When indirect effects = direct effects, the multiplier value is 2. So €100 million of new tourism expenditure is likely to add LESS than €200 million to household income or GDP.",
                explanation: "A key 'reality check' from Dwyer's lectures against over-stated multiplier claims."
            },
            {
                question: "What are leakages, and name some types of FX leakage.",
                answer: "Leakages are expenditure flowing to agents OUTSIDE the economy, which REDUCE the multiplier. Types of FX leakage: imported goods consumed by visitors (e.g. duty free); imported capital goods (planes, ski lifts, rental cars); imports from increased local consumption (demonstration effect); factor payments abroad (wages, holiday-home rents, foreign tour operators); destination-promotion spent externally.",
                explanation: "The more a destination imports, the smaller the local multiplier."
            },
            {
                question: "Which models are used for economic impact analysis (EIA)?",
                answer: "Input-Output (I-O) models — trace direct/indirect/induced effects through a matrix of inter-industry relationships (but assume fixed production relationships, no supply constraints). Computable General Equilibrium (CGE) models — simulate economy-wide impacts including price and wage adjustments and resource constraints (but need extensive data).",
                explanation: "CGE answers 'if we change X, how does the WHOLE economy adjust?'"
            },
            {
                question: "What factor constraints and conditions limit tourism's economic impact?",
                answer: "Factor supply constraints (land, labour, capital), real exchange-rate appreciation (which reduces other exports and the multiplier), government fiscal stance, import content/leakages, the strength of business linkages, and the size of the shock.",
                explanation: "Tourism booms can bid up land/labour prices and crowd out other industries (deindustrialisation)."
            }
        ],

        quiz: [
            {
                question: "Foreign-exchange earnings are generated by:",
                options: ["Domestic tourism", "International (inbound) tourism", "Government spending", "Local consumption"],
                correct: 1
            },
            {
                question: "Induced effects arise when:",
                options: [
                    "Tourists pay hotels directly",
                    "Firms buy inputs from suppliers",
                    "Workers and owners spend their increased incomes downstream",
                    "Government collects taxes"
                ],
                correct: 2
            },
            {
                question: "The multiplier is calculated as:",
                options: ["Direct / Total Impact", "Total Impact / Direct Expenditure", "Indirect + Induced", "GDP / Arrivals"],
                correct: 1
            },
            {
                question: "When indirect effects equal direct effects, the multiplier value is:",
                options: ["1", "2", "5", "10"],
                correct: 1
            },
            {
                question: "€100 million of new tourism expenditure is likely to add to GDP:",
                options: ["Exactly €100 m", "Less than €200 m", "More than €500 m", "Exactly €1 billion"],
                correct: 1
            },
            {
                question: "Which is a leakage that reduces the multiplier?",
                options: [
                    "Local wages spent locally",
                    "Imported goods consumed by visitors (duty free)",
                    "A locally produced meal",
                    "Domestic investment"
                ],
                correct: 1
            },
            {
                question: "An airport departure tax is an example of a:",
                options: ["Indirect tax", "Direct tax", "Leakage", "Subsidy"],
                correct: 1
            },
            {
                question: "Which model captures economy-wide price and wage adjustments?",
                options: ["Input-Output (I-O)", "Computable General Equilibrium (CGE)", "Time-series", "Regression only"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Total Effect = Direct + Indirect + _______ effects.",
                answer: "Induced",
                hint: "Recipients spending their incomes downstream..."
            },
            {
                sentence: "Multiplier = Total Impact / _______ Expenditure.",
                answer: "Direct",
                hint: "The initial spending..."
            },
            {
                sentence: "More sophisticated modelling shows the tourism multiplier is unlikely to exceed _______.",
                answer: "2",
                hint: "When indirect = direct..."
            },
            {
                sentence: "_______ are flows of expenditure to agents outside the economy that reduce the multiplier.",
                answer: "Leakages",
                hint: "Money 'leaking' out..."
            },
            {
                sentence: "Foreign-exchange earnings come from _______ tourism, not domestic tourism.",
                answer: "international",
                hint: "Across borders (an export industry)..."
            },
            {
                sentence: "The five multiplier types are sales, output, income, value-added and _______.",
                answer: "employment",
                hint: "Jobs..."
            }
        ],

        learn: {
            title: "Economic Impacts & the Multiplier",
            content: `
                <h3>💰 From Expenditure to Impact</h3>
                <p>The economic contribution of tourism starts with <strong>tourist expenditure</strong> (the basic measure: expenditure by type of visitor, by visitor night, by length of stay). This is an injection of <strong>'new money'</strong> that boosts output and employment in local primary, secondary and tertiary industries — and it generates <strong>direct + secondary (indirect + induced)</strong> effects.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-list-ol"></i> 7 Major Impacts of Tourist Expenditure</h4>
                    <p>↑ local production/output · new business & jobs · <strong>foreign-exchange earnings (INTERNATIONAL tourism only)</strong> · new investment · government revenue (taxes) · regional development · ↓ poverty</p>
                    <p>FX earnings depend on visitor numbers, average expenditure/day, length of stay and the exchange rate. Government gets DIRECT taxes (airport departure, visa) and INDIRECT taxes (sales, fuel, accommodation).</p>
                </div>

                <h3>🔗 The Three Effects (the multiplier chain)</h3>
                <table><tr><th>Effect</th><th>What happens</th><th>Example</th></tr>
                <tr><td><strong>Direct</strong></td><td>Tourists pay suppliers directly</td><td>Accommodation, F&B, tours, attractions, shopping</td></tr>
                <tr><td><strong>Indirect</strong> (upstream)</td><td>Those firms buy inputs from other firms, along the supply chain</td><td>Hotel buys linen, food, pool chemicals from suppliers</td></tr>
                <tr><td><strong>Induced</strong> (downstream)</td><td>Recipients spend their increased incomes</td><td>Workers/owners spend wages at shops, theatres, holidays</td></tr></table>

                <div class="formula-box">
                    <h4><i class="fas fa-calculator"></i> The Multiplier</h4>
                    <p><strong>Multiplier = Total Impact / Direct Expenditure</strong></p>
                    <p>Total Effect = Direct + Indirect + Induced → increases in output, sales, value added, GDP, household income and employment.</p>
                    <p><strong>5 types:</strong> sales (transactions) · output · income · value-added · employment.</p>
                </div>

                <div class="warning-box">
                    <h4><i class="fas fa-triangle-exclamation"></i> Reality Check (Dwyer)</h4>
                    <p>The multiplier is <strong>unlikely to exceed 2</strong> — when indirect effects = direct effects, the multiplier value is 2, so €100 m of new expenditure adds <strong>&lt; €200 m</strong> to GDP. It is shrunk by <strong>leakages</strong> (imported goods, capital goods, factor payments abroad, external promotion), <strong>factor constraints</strong> (land, labour, capital), and real <strong>exchange-rate appreciation</strong>. Models used: Input-Output (I-O) and Computable General Equilibrium (CGE).</p>
                </div>
            `
        }
    },

    // ========== UNITS 9–10: ECONOMIC CONTRIBUTION & TSA ==========
    tsa: {
        name: "Economic Contribution & TSA",
        icon: "fa-chart-bar",
        color: "#ec4899",

        flashcards: [
            {
                question: "What is tourism expenditure?",
                answer: "The total consumption expenditure made by a visitor, or on behalf of a visitor, for goods and services during their trip and stay at the destination — including payments made in advance or after the trip for services received during it.",
                explanation: "No economic tourism impact occurs unless visitors actually spend money on tourism products/services."
            },
            {
                question: "Into which three groups can visitor expenditure be divided by timing?",
                answer: "1. Expenses in PREPARATION for the trip.\n2. Expenses DURING the trip (when travelling and at the places visited).\n3. Expenses AFTER the trip (travel-related expenses in the country of origin on return).",
                explanation: "Expenditure spans before, during and after the journey."
            },
            {
                question: "What are the main categories of visitor expenditure?",
                answer: "Package travel (holidays/tours), accommodation, food & drinks, transport, recreation/culture/sporting activities, shopping, and other.",
                explanation: "The standard breakdown of what tourists spend on."
            },
            {
                question: "What are the four indicator categories used to express expenditure levels?",
                answer: "1. Total expenditure for the whole trip\n2. Expenditure per day\n3. Total expenditure per person\n4. Expenditure per person per day",
                explanation: "Different ways of normalising expenditure for comparison (Brida & Scuderi, 2013)."
            },
            {
                question: "What internal and external factors influence tourism expenditure?",
                answer: "Internal: income, property status, size & phase of the family life cycle, educational level, motivation, cultural characteristics/preferences/habits. External: the destination's price positioning on the market, level of tourism-offering development, marketing activities of intermediaries/destinations, quality, and travel safety.",
                explanation: "Internal = the traveller; external = the destination/market."
            },
            {
                question: "What is the economic CONTRIBUTION of tourism?",
                answer: "Tourism's economic significance — the contribution that tourist expenditure makes to key economic variables such as gross domestic (regional) product, household income, value added, foreign-exchange earnings, and employment.",
                explanation: "It captures how much tourism matters to the economy."
            },
            {
                question: "What are the limitations of using tourist EXPENDITURE data alone?",
                answer: "It doesn't show WHAT goods/services are purchased (so it doesn't identify which sectors get the revenue); it is NOT an indicator of profitability (no info on costs of serving each segment); and it doesn't show how the expenditure affects other industries or the wider economy.",
                explanation: "Expenditure tells you the size of spending, not its distribution, profit or knock-on effects."
            },
            {
                question: "Why is it difficult to measure the economic significance of tourism?",
                answer: "Because 'tourism' does NOT exist as a distinct sector in any system of economic statistics or national accounts. Focusing on national accounts alone seriously underestimates total tourist expenditure and tourism's significance.",
                explanation: "Tourism cuts across many sectors, so it needs a special accounting framework."
            },
            {
                question: "What is the TSA (Tourism Satellite Account)?",
                answer: "The standard framework for organising statistical data on tourism, endorsed by the UN Statistical Commission. It is an EXTENSION of the core national accounts that allows estimates of the size and role of tourism activities that are not separately identified in the conventional framework.",
                explanation: "A 'satellite' account that orbits and extends the national accounts."
            },
            {
                question: "What is the difference between tourism CHARACTERISTIC and CONNECTED products?",
                answer: "Characteristic products would cease to exist in meaningful quantity in the ABSENCE of visitors (e.g. accommodation, air transport). Connected products are linked to tourism but less significant for the visitor/producer (e.g. automotive fuel retailing).",
                explanation: "In the TSA, the 'tourism industry' is identified from the consumer (demand) side."
            },
            {
                question: "Name the key measures captured by a TSA.",
                answer: "Tourism expenditure; tourism consumption; tourism output; Tourism Gross Value Added (TGVA = output of tourism products less inputs used); Tourism GDP (TGDP); tourism employment; tourism exports (bought by international visitors); tourism imports (outbound consumption by residents abroad).",
                explanation: "TGVA subtracts intermediate inputs; TGDP is the market value after deducting goods used up in production."
            },
            {
                question: "On what does the impact of tourism on a country's economy depend?",
                answer: "On (1) the content and quality of the direct tourist services (the tourist product), and (2) the extent to which the country's economy can offer products and services that directly or indirectly feed into the tourism consumption sector.",
                explanation: "A locally integrated economy keeps more of the benefit (fewer leakages)."
            },
            {
                question: "What is the Global Code of Ethics for Tourism?",
                answer: "A comprehensive set of principles (10 articles) guiding key players towards responsible and sustainable tourism — maximising benefits while minimising negative impacts on the environment, cultural heritage and societies. Adopted by the UNWTO General Assembly in 1999, acknowledged by the UN in 2021; not legally binding (voluntary).",
                explanation: "It covers the economic, social, cultural and environmental components of tourism."
            }
        ],

        quiz: [
            {
                question: "Tourism expenditure includes payments made:",
                options: ["Only during the trip", "Only in advance", "In advance, during AND after the trip", "Only on accommodation"],
                correct: 2
            },
            {
                question: "Measuring tourism's economic significance is hard because tourism:",
                options: [
                    "Is too small",
                    "Does not exist as a distinct sector in national accounts",
                    "Pays no taxes",
                    "Has no expenditure"
                ],
                correct: 1
            },
            {
                question: "The TSA framework is endorsed by:",
                options: ["The World Bank", "The UN Statistical Commission", "The IMF", "The WTO trade body"],
                correct: 1
            },
            {
                question: "Accommodation and air transport are examples of tourism _______ products.",
                options: ["connected", "characteristic", "imported", "intangible"],
                correct: 1
            },
            {
                question: "TGVA (Tourism Gross Value Added) is:",
                options: [
                    "Total tourist arrivals",
                    "Output of tourism products less the value of inputs used",
                    "Total taxes paid",
                    "Number of tourism jobs"
                ],
                correct: 1
            },
            {
                question: "Which is a LIMITATION of tourist expenditure data?",
                options: [
                    "It shows exact profitability",
                    "It does not indicate which sectors receive the revenue",
                    "It measures all wider-economy effects",
                    "It identifies every product purchased"
                ],
                correct: 1
            },
            {
                question: "'Outbound tourism consumption' by residents abroad is recorded as tourism:",
                options: ["Exports", "Imports", "Output", "Value added"],
                correct: 1
            },
            {
                question: "The Global Code of Ethics for Tourism is:",
                options: ["Legally binding worldwide", "Voluntary, with 10 articles", "A pricing rule", "A tax treaty"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "TSA = Tourism _______ Account, an extension of the national accounts.",
                answer: "Satellite",
                hint: "It orbits the main accounts..."
            },
            {
                sentence: "Products that would cease to exist without visitors are tourism _______ products.",
                answer: "characteristic",
                hint: "e.g. accommodation, air transport..."
            },
            {
                sentence: "Economic contribution is the contribution tourist expenditure makes to key economic _______.",
                answer: "variables",
                hint: "GDP, income, employment..."
            },
            {
                sentence: "Visitor expenditure can be split by timing into before, during and _______ the trip.",
                answer: "after",
                hint: "Once the trip is over..."
            },
            {
                sentence: "Tourism is hard to measure because it is not a distinct _______ in national accounts.",
                answer: "sector",
                hint: "Like agriculture or industry..."
            },
            {
                sentence: "The Global Code of Ethics for Tourism has _______ articles and is voluntary.",
                answer: "10",
                hint: "Ten..."
            }
        ],

        learn: {
            title: "Economic Contribution & Tourism Satellite Account",
            content: `
                <h3>🧾 Tourism Expenditure</h3>
                <p>The total consumption expenditure made by (or on behalf of) a visitor for goods & services during the trip and stay — including advance and after-trip payments. No economic impact occurs unless visitors actually spend.</p>
                <ul>
                    <li><strong>By timing:</strong> before the trip · during the trip · after the trip</li>
                    <li><strong>By category:</strong> package travel, accommodation, food & drinks, transport, recreation/culture/sport, shopping, other</li>
                    <li><strong>Indicators:</strong> total per trip · per day · total per person · per person per day</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-sliders"></i> Factors Influencing Expenditure</h4>
                    <p><strong>Internal:</strong> income, property status, family life-cycle phase, education, motivation, culture.<br>
                    <strong>External:</strong> destination price positioning, offering development, marketing, quality, travel safety.</p>
                </div>

                <h3>📈 Economic Contribution</h3>
                <p>Tourism's economic significance = the contribution of tourist expenditure to key variables: <strong>GDP, household income, value added, foreign-exchange earnings, employment</strong>. But expenditure data alone has limits — it doesn't show <em>which</em> sectors receive the revenue, profitability, or wider effects on other industries.</p>

                <div class="formula-box">
                    <h4><i class="fas fa-chart-bar"></i> The Tourism Satellite Account (TSA)</h4>
                    <p>Because tourism is NOT a distinct sector in the national accounts, the <strong>TSA</strong> (endorsed by the UN Statistical Commission) extends them to measure it from the demand side.</p>
                    <p><strong>Characteristic</strong> products would cease without visitors (accommodation, air transport); <strong>connected</strong> products are linked but minor (fuel retailing).</p>
                </div>

                <h4>Key TSA measures</h4>
                <table><tr><th>Measure</th><th>Meaning</th></tr>
                <tr><td>Expenditure / Consumption</td><td>What visitors pay / total consumption during the trip</td></tr>
                <tr><td>Output</td><td>Goods & services produced for use outside the establishment</td></tr>
                <tr><td><strong>TGVA</strong></td><td>Tourism Gross Value Added = output of tourism products − inputs used</td></tr>
                <tr><td><strong>TGDP</strong></td><td>Tourism GDP = market value of domestically produced goods consumed by visitors</td></tr>
                <tr><td>Employment / Exports / Imports</td><td>Jobs · sales to international visitors · outbound consumption by residents abroad</td></tr></table>
                <p>Impact on the economy depends on the quality of direct tourist services and how well the local economy can feed the tourism sector. The <strong>Global Code of Ethics for Tourism</strong> (adopted 1999; 10 articles; voluntary) guides responsible & sustainable tourism.</p>
            `
        }
    },

    // ========== UNIT 11: TOURISM & THE ENVIRONMENT ==========
    environment: {
        name: "Environment & Market Failure",
        icon: "fa-leaf",
        color: "#22c55e",

        flashcards: [
            {
                question: "Through which resources does tourism interact with the environment?",
                answer: "Natural resources, human resources, and built resources. Remember: NOT all resources are attractions, but ALL attractions are resources.",
                explanation: "Tourism both depends on and affects these three resource types."
            },
            {
                question: "What are the main negative environmental impacts of tourism?",
                answer: "Resource depletion, loss of biodiversity, habitat destruction, pollution and waste, increased greenhouse-gas emissions, and the exploitation of coastal wetlands, rainforests and landscapes.",
                explanation: "Though tourism can raise awareness, its overall environmental effect tends to be negative."
            },
            {
                question: "What is market failure (in an environmental context)?",
                answer: "When there are NO markets for some valuable resources/products, OR markets do NOT function properly, the resulting resource allocation will not be optimal.",
                explanation: "The market fails to price environmental resources correctly."
            },
            {
                question: "What are the 3 major sources of market failure relevant to tourism's environmental impacts?",
                answer: "1. Lack of property rights to environmental resources\n2. Public goods\n3. Externalities",
                explanation: "These three explain why markets under-protect the environment."
            },
            {
                question: "Why does a lack of property rights cause environmental damage?",
                answer: "With well-defined property rights, resources are used efficiently and sustainably. When it is unclear who has the right to use a resource, it is unclear whose rights can be restricted if something goes wrong — so environmentally destructive behaviour occurs because no one takes responsibility for the costs.",
                explanation: "Clear ownership creates an incentive to protect the resource."
            },
            {
                question: "How are the 4 types of goods classified by excludability and rivalry?",
                answer: "Excludable + Rivalrous = PRIVATE goods. Non-excludable + Rivalrous = COMMON goods. Excludable + Non-rivalrous = CLUB goods. Non-excludable + Non-rivalrous = PUBLIC goods.",
                explanation: "Excludable = you can prevent access (e.g. by payment); rivalrous = one person's use prevents another's."
            },
            {
                question: "Give examples of club goods and common goods.",
                answer: "Club goods (high excludability, low rivalry): cable television, cinemas, Wi-Fi. Common goods (non-excludable but rival): lakes, oceans, forests, fresh air, clean water.",
                explanation: "Common goods are especially prone to over-use in tourism."
            },
            {
                question: "What are externalities?",
                answer: "Costs or benefits received by a THIRD PARTY who is not a direct participant in an economic transaction. Positive: more restaurants, events, better traffic infrastructure. Negative: noise, crowded roads and city centres.",
                explanation: "Externalities are 'spillover' effects the market doesn't price."
            },
            {
                question: "What is the 'tragedy of the commons'?",
                answer: "In a shared-resource system (e.g. a wilderness area), individual users acting in their own self-interest behave contrary to the common good by depleting or spoiling the resource through their collective action. Many tourism resources are common-pool / open-access resources.",
                explanation: "A core problem for sustainable tourism development."
            },
            {
                question: "What is Tourism Carrying Capacity (UNWTO definition)?",
                answer: "The maximum number of people that may visit a tourist destination at the same time WITHOUT causing destruction of the physical, economic and socio-cultural environment, and without an unacceptable decrease in the quality of visitors' satisfaction. It can be FIXED or FLUID.",
                explanation: "Beyond carrying capacity, the destination and the visitor experience both degrade."
            },
            {
                question: "What are economic instruments and the strategies for pollution control?",
                answer: "Economic instruments are CONTROLS imposed on environmentally damaging activity to avoid or lessen the damage. Pollution-control strategies: voluntary agreements (to reduce GHGs), merger, subsidies (for cleaner technology), tax on output and on pollution, and others (education, information, codes of conduct).",
                explanation: "They use economic incentives/penalties to change behaviour."
            },
            {
                question: "What is the definition of sustainable tourism development (UNWTO 1995) and Agenda 21?",
                answer: "Sustainable tourism development 'meets the needs of present tourists and host regions while protecting and enhancing opportunity for the future' — managing all resources so economic, social and aesthetic needs are met while maintaining cultural integrity, ecological processes, biodiversity and life-support systems. Agenda 21 = the UN action plan for the future (especially environmental protection) adopted in Rio de Janeiro, 1992.",
                explanation: "The 20th century asked 'sustainable development?' — the 21st-century question is HOW to implement it."
            }
        ],

        quiz: [
            {
                question: "Tourism interacts with the environment through natural, human and ___ resources:",
                options: ["financial", "built", "digital", "imported"],
                correct: 1
            },
            {
                question: "Which is NOT one of the 3 sources of market failure?",
                options: ["Lack of property rights", "Public goods", "Externalities", "High prices"],
                correct: 3
            },
            {
                question: "A good that is non-excludable but rivalrous (e.g. ocean fish stocks) is a:",
                options: ["Private good", "Club good", "Common good", "Public good"],
                correct: 2
            },
            {
                question: "Wi-Fi and cable TV (excludable, low rivalry) are examples of:",
                options: ["Public goods", "Common goods", "Club goods", "Private goods"],
                correct: 2
            },
            {
                question: "A cost imposed on a third party not in the transaction (e.g. noise) is a(n):",
                options: ["Subsidy", "Externality", "Tax", "Tariff"],
                correct: 1
            },
            {
                question: "Carrying capacity is the maximum number of visitors at the same time without:",
                options: [
                    "Making any profit",
                    "Causing destruction or an unacceptable drop in satisfaction",
                    "Building hotels",
                    "Charging fees"
                ],
                correct: 1
            },
            {
                question: "Which is an economic instrument / pollution-control strategy?",
                options: ["Advertising", "Tax on pollution", "More flights", "Lower wages"],
                correct: 1
            },
            {
                question: "Agenda 21 (the UN action plan for the environment) was adopted in:",
                options: ["Kyoto 1997", "Rio de Janeiro 1992", "Paris 2015", "Stockholm 1972"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Not all resources are attractions, but all attractions are _______.",
                answer: "resources",
                hint: "The thing tourism draws on..."
            },
            {
                sentence: "The 3 sources of market failure are externalities, public goods and lack of _______ rights.",
                answer: "property",
                hint: "Who owns the resource..."
            },
            {
                sentence: "A good that is non-excludable and non-rivalrous is a _______ good.",
                answer: "public",
                hint: "Everyone can use it; no one can be excluded..."
            },
            {
                sentence: "The tragedy of the _______ describes over-use of a shared resource by self-interested users.",
                answer: "commons",
                hint: "Common-pool resources..."
            },
            {
                sentence: "Tourism Carrying _______ is the maximum visitors at one time without destruction.",
                answer: "Capacity",
                hint: "How much it can hold..."
            },
            {
                sentence: "Economic instruments include voluntary agreements, subsidies and a _______ on pollution.",
                answer: "tax",
                hint: "A charge on damaging activity..."
            }
        ],

        learn: {
            title: "Tourism & the Environment",
            content: `
                <h3>🌿 Tourism and Resources</h3>
                <p>The environment attracts tourism flows, and conserving valued features helps maintain visitation and tourism's economic contribution. Tourism interacts with <strong>natural, human and built</strong> resources — remember: <em>not all resources are attractions, but all attractions are resources.</em> Yet its overall environmental effect tends to be negative: resource depletion, biodiversity loss, habitat destruction, pollution & waste, and rising greenhouse-gas emissions.</p>

                <div class="warning-box">
                    <h4><i class="fas fa-circle-exclamation"></i> Market Failure</h4>
                    <p>When there are no markets for valuable resources, OR markets don't function properly, resource allocation isn't optimal. <strong>3 sources relevant to tourism:</strong> lack of property rights · public goods · externalities. With clear property rights, resources are used efficiently; when it's unclear who has the right, destructive behaviour occurs because no one bears the cost.</p>
                </div>

                <h3>📦 The 4 Types of Goods</h3>
                <p>Classified by <strong>excludability</strong> (can you prevent access, e.g. by payment?) and <strong>rivalry</strong> (does one person's use prevent another's?):</p>
                <table>
                    <tr><th></th><th>Rivalrous</th><th>Non-rivalrous</th></tr>
                    <tr><td><strong>Excludable</strong></td><td>Private goods</td><td>Club goods (Wi-Fi, cinemas, cable TV)</td></tr>
                    <tr><td><strong>Non-excludable</strong></td><td>Common goods (oceans, forests, fresh air)</td><td>Public goods</td></tr>
                </table>
                <p><strong>Externalities</strong> = costs/benefits to a third party not in the transaction (negative: noise, crowded roads; positive: more restaurants, better infrastructure). The <strong>tragedy of the commons</strong>: self-interested users deplete a shared (common-pool) resource — a core problem because many tourism resources are open-access. Valuing these impacts is hard: some costs/benefits show in market prices, others need <em>proxy prices</em>.</p>

                <div class="formula-box">
                    <h4><i class="fas fa-users"></i> Carrying Capacity (UNWTO)</h4>
                    <p>The maximum number of people that may visit a destination at the same time WITHOUT destroying the physical, economic and socio-cultural environment, and without an unacceptable decrease in visitor satisfaction. It can be <strong>fixed</strong> or <strong>fluid</strong>.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Economic Instruments & Policy</h4>
                    <p>Controls on damaging activity: <strong>voluntary agreements, merger, subsidies for clean technology, taxes on output & pollution, education/codes of conduct</strong>. Sustainable development was set out in <strong>Agenda 21</strong> (UN, Rio de Janeiro, 1992); the 21st-century question is HOW to implement it.</p>
                </div>
            `
        }
    },

    // ========== UNIT 12: SUSTAINABLE TOURISM DEVELOPMENT ==========
    sustainability: {
        name: "Sustainable Tourism Development",
        icon: "fa-seedling",
        color: "#14b8a6",

        flashcards: [
            {
                question: "What is 'tourism growth mania' and why is it criticised?",
                answer: "The implicit assumption that the market requires ever-increasing economic growth, where 'more' (more GDP, income, jobs) is wrongly equated with 'better' and with social progress. It is criticised because GDP does not measure quality of life, well-being or happiness, and tourism's drive for expansion destroys the very environments that attract visitors.",
                explanation: "Growth ≠ progress — a central theme of Dwyer's critique."
            },
            {
                question: "What are the potential BENEFITS of tourism growth (3 dimensions)?",
                answer: "Economic: stimulates local production & employment, raises tax revenues, catalyses development (esp. small local enterprise), develops remote areas.\nSocio-cultural: fosters civic pride & pride in traditions, improves cross-cultural understanding, creates local jobs (avoiding relocation), adds recreation facilities, employs poorer people/women/youth.\nEnvironmental: fosters conservation and community revitalisation/beautification.",
                explanation: "Benefits span the same three pillars as the costs."
            },
            {
                question: "What are the COSTS of tourism growth (3 dimensions)?",
                answer: "Economic: higher prices/cost of living/property taxes, demands on public services, deindustrialisation (crowding out), dependency on one industry, low-quality seasonal employment, leakages.\nSocio-cultural: hectic lifestyle, immigrant-workforce problems, tourist–resident conflict, loss of identity, commodification & loss of authenticity, congestion ('overtourism').\nEnvironmental: water-quality damage, coastal erosion, habitat destruction, biodiversity loss, landscape degradation, rising carbon footprint.",
                explanation: "'Overtourism' is now seen as a challenge facing all destinations."
            },
            {
                question: "What is sustainable tourism, and what are the 3 pillars of sustainability?",
                answer: "Tourism that takes full account of its current and future economic, social and environmental impacts, addressing the needs of all stakeholders. The 3 pillars: ENVIRONMENTAL, SOCIO-CULTURAL, and ECONOMIC sustainability (plus holistic, stakeholder-based planning).",
                explanation: "Sustainable development meets present needs without compromising future generations."
            },
            {
                question: "What does sustainable tourism imply (its requirements)?",
                answer: "Viable, long-term economic operations; respect for host communities; benefits distributed fairly among all stakeholders; and making optimal use of environmental resources. Sustainability is dynamic — preserving/enhancing a destination's stock of capital to transmit well-being over time.",
                explanation: "The four classic requirements of sustainable tourism."
            },
            {
                question: "What are the UN Sustainable Development Goals (SDGs)?",
                answer: "The UN 2030 Agenda with 17 Goals and an initial set of 230 indicators, promoting economic, socio-cultural and environmental sustainability through a global partnership of destinations and stakeholders.",
                explanation: "The headline international sustainability framework."
            },
            {
                question: "What is the 'growth management' approach to sustainability?",
                answer: "The standard approach assuming that tourism's problems can be solved by better, more efficient management of tourism development, supported by improvements in technology. UNWTO: 'growth is not the problem — it's how we manage it.' It is exemplified by green growth and inclusive growth, aiming for economic, socio-cultural and environmental sustainability.",
                explanation: "The mainstream 'business-as-usual' solution to tourism's problems."
            },
            {
                question: "What is the Easterlin Paradox (a countercriticism of growth)?",
                answer: "Increasing GDP is unlikely to improve social well-being once a comfortable standard of living has been reached — higher income doesn't always raise life satisfaction (diminishing returns, adaptation, social comparison). This undercuts the argument for continued tourism growth in developed destinations.",
                explanation: "One of four countercriticisms of the growth-management approach."
            },
            {
                question: "What is decoupling, and what is the 'myth of decoupling'?",
                answer: "Decoupling = separating economic growth from environmental degradation. Relative decoupling: impact grows more slowly than output (GDP +5%, emissions +2%). Absolute decoupling: output grows while impact FALLS (GDP +5%, emissions −3%). The 'myth' is that there is NO evidence absolute decoupling is occurring anywhere — so tourism GDP cannot grow indefinitely without adverse environmental impacts.",
                explanation: "Absolute decoupling is what sustainability needs — but it isn't happening."
            },
            {
                question: "What are rebound effects in tourism?",
                answer: "Efficiency gains can be counter-productive because lower prices raise demand and emissions. Types: Direct (fuel-efficient aircraft → cheaper tickets → more flying); Indirect (savings spent on other consumption); Economy-wide (freed resources boost other sectors); Time-savings (faster travel enables extra/longer trips).",
                explanation: "Rebound effects reduce the effectiveness of green-growth strategies."
            },
            {
                question: "What is the 'heterodox' alternative view, and what is regenerative tourism vs sustainable tourism?",
                answer: "Heterodox approaches reject 'business-as-usual' growth management; they include regenerative tourism, tourism degrowth, and putting human well-being first. Sustainable tourism seeks to LESSEN the harm done by tourism; REGENERATIVE tourism goes further — a commitment to a NET POSITIVE benefit to the environment and communities (restoration & regeneration), further along the continuum.",
                explanation: "Regenerative = leave the destination better than you found it."
            },
            {
                question: "What is tourism degrowth?",
                answer: "If producing more while polluting less is unachievable, the industry should produce LESS to pollute less — a planned, gradual, equitable 'downsizing/rightsizing' of production and consumption. Three goals: reduce environmental impact (less consumption/investment/work-time); redistribute income & wealth (intra- and inter-generationally); promote a transition to a convivial, caring, sharing, participatory society.",
                explanation: "Requires a transformative shift in values away from 'business as usual'."
            },
            {
                question: "What is meant by 'sustainable well-being' rather than 'sustainable development'?",
                answer: "Human well-being is now widely regarded as the primary public-policy objective. Destination managers and researchers should treat sustainable development not as an 'end in itself' but as a STEPPING STONE towards the enhanced well-being of residents — i.e. focus on sustainable well-being.",
                explanation: "Dwyer's 'Beyond GDP' / well-being perspective on tourism."
            }
        ],

        quiz: [
            {
                question: "'Tourism growth mania' wrongly equates more GDP with:",
                options: ["More pollution", "Social progress / 'better'", "Fewer tourists", "Lower prices"],
                correct: 1
            },
            {
                question: "The 3 pillars of sustainability are environmental, socio-cultural and:",
                options: ["Political", "Economic", "Technological", "Legal"],
                correct: 1
            },
            {
                question: "'Overtourism' is primarily an example of a:",
                options: ["Benefit of tourism", "Cost of tourism growth", "Pricing strategy", "Forecasting method"],
                correct: 1
            },
            {
                question: "The growth-management approach assumes problems are solved by:",
                options: [
                    "Stopping all tourism",
                    "Better management + technology",
                    "Raising all prices",
                    "Ignoring the environment"
                ],
                correct: 1
            },
            {
                question: "The Easterlin Paradox states that beyond a comfortable level, higher GDP:",
                options: [
                    "Always raises well-being",
                    "Is unlikely to improve social well-being",
                    "Reduces tourism",
                    "Eliminates emissions"
                ],
                correct: 1
            },
            {
                question: "ABSOLUTE decoupling means economic output grows while environmental impact:",
                options: ["Grows faster", "Grows more slowly", "Falls in absolute terms", "Stays the same"],
                correct: 2
            },
            {
                question: "Regenerative tourism (vs sustainable tourism) aims for:",
                options: [
                    "Only lessening harm",
                    "A net POSITIVE benefit — restoration & regeneration",
                    "Maximum arrivals",
                    "Lower prices"
                ],
                correct: 1
            },
            {
                question: "Tourism degrowth proposes that the industry should:",
                options: [
                    "Produce more to pollute less",
                    "Produce less in order to pollute less",
                    "Grow without limit",
                    "Ignore well-being"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The three pillars of sustainability are environmental, economic and _______.",
                answer: "socio-cultural",
                hint: "People, communities, culture..."
            },
            {
                sentence: "Sustainable tourism seeks to lessen harm; _______ tourism aims for a net positive benefit.",
                answer: "regenerative",
                hint: "Restore and renew..."
            },
            {
                sentence: "The UN 2030 Agenda has _______ Sustainable Development Goals.",
                answer: "17",
                hint: "Seventeen..."
            },
            {
                sentence: "The _______ Paradox: beyond a comfortable level, higher GDP doesn't raise well-being.",
                answer: "Easterlin",
                hint: "Named after economist Richard..."
            },
            {
                sentence: "_______ decoupling (output up, impact down in absolute terms) has no real-world evidence.",
                answer: "Absolute",
                hint: "Opposite of 'relative'..."
            },
            {
                sentence: "Tourism _______ involves a planned, equitable downsizing of production and consumption.",
                answer: "degrowth",
                hint: "Opposite of growth..."
            }
        ],

        learn: {
            title: "Sustainable Tourism Development",
            content: `
                <h3>📈 Growth Mania vs Sustainability</h3>
                <p>Much tourism planning assumes the market requires ever-increasing growth, equating <strong>'more' (GDP, income, jobs) with 'better'</strong> and with social progress. But GDP doesn't measure quality of life or happiness, and tourism's drive for expansion can destroy the very environments that attract visitors.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-scale-balanced"></i> Benefits vs Costs (same 3 dimensions)</h4>
                    <p><strong>Benefits:</strong> Economic (jobs, income, tax revenue, remote-area development) · Socio-cultural (civic & cultural pride, understanding) · Environmental (conservation, revitalisation).<br>
                    <strong>Costs:</strong> Economic (↑ prices/cost of living, deindustrialisation, dependency, leakages) · Socio-cultural (hectic lifestyle, loss of authenticity, overtourism) · Environmental (water/coastal damage, biodiversity loss, carbon footprint).</p>
                </div>

                <h3>♻️ Sustainable Tourism</h3>
                <p>Tourism that takes full account of its current AND future economic, social and environmental impacts, addressing the needs of all stakeholders. <strong>3 pillars:</strong> environmental · socio-cultural · economic (+ holistic, stakeholder-based planning). It requires viable long-term operations, respect for host communities, fairly distributed benefits, and optimal use of environmental resources. Global framework: the UN <strong>17 Sustainable Development Goals</strong> (230 indicators; 2030 Agenda).</p>
                <p>The mainstream <strong>growth-management approach</strong> assumes problems can be solved by better management + technology ("growth is not the problem — it's how we manage it"), via green & inclusive growth.</p>

                <div class="warning-box">
                    <h4><i class="fas fa-triangle-exclamation"></i> Why Growth Management May Fail (4 countercriticisms)</h4>
                    <p>1) Business as usual isn't working (SDGs not being met). 2) Growth may not raise resident well-being — the <strong>Easterlin Paradox</strong>. 3) <strong>Absolute decoupling</strong> (output up while impact falls) isn't happening anywhere — the 'decoupling myth' (vs relative decoupling, where impact just grows more slowly). 4) <strong>Rebound effects</strong> (direct, indirect, economy-wide, time-savings) undo efficiency gains.</p>
                </div>

                <h3>🌱 Heterodox Alternatives</h3>
                <ul>
                    <li><strong>Regenerative tourism:</strong> a commitment to a NET POSITIVE benefit (restoration & regeneration) — further along the continuum than just 'lessening harm'. Sustainable = do less harm; regenerative = do more good.</li>
                    <li><strong>Tourism degrowth:</strong> produce LESS to pollute less — a planned, gradual, equitable 'rightsizing'; reduce impact, redistribute wealth, build a convivial society.</li>
                    <li><strong>Sustainable well-being:</strong> treat sustainable development not as an end in itself but as a stepping stone to enhanced resident well-being.</li>
                </ul>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.te2M2 = te2M2; }
if (typeof module !== "undefined" && module.exports) { module.exports = te2M2; }
