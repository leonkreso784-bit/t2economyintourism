// ===== TOURISM ECONOMICS (te2) — Midterm 1 (Units 1–6) =====
// REBUILD iz profesorskih predavanja (FMTU Opatija, Smolčić Jurdana / Soldić Frleta / Dwyer, 2025/26):
//   "Key concepts and tourism market", "Tourism demand", "Tourism supply: production, costs & supply",
//   "Tourism and market structure". Granica kolokvija po silabusu (slajd "Important dates"):
//   1. test = jedinice 1.–6. (4.11.2025.).
// Kategorije: fundamentals (U1), demand (U2), forecasting (U3), supply (U4–5), marketStructure (U6).
// Oblik po docs/CONTENT_SCHEMA.md. Pri izmjeni bumpaj CONTENT_VERSION (js/content-loader.js).

const te2M1 = {

    // ========== UNIT 1: TOURISM FUNDAMENTALS & THE TOURISM MARKET ==========
    fundamentals: {
        name: "Fundamentals & Tourism Market",
        icon: "fa-globe-americas",
        color: "#6366f1",

        flashcards: [
            {
                question: "What is the origin of the word 'tour'?",
                answer: "From the Latin word 'tornus', meaning 'a tool for making a circle'.",
                explanation: "The etymology reflects the circular nature of travel — leaving home and returning."
            },
            {
                question: "What makes up the PRIMARY tourism industry (basic concepts of tourism)?",
                answer: "Travel trade, transport, accommodation, catering, facilities, and tourist attractions.",
                explanation: "These are the core components that directly deliver the tourism experience."
            },
            {
                question: "What are the 5 A's of tourism?",
                answer: "Attractions, Access, Accommodation, Amenities, Activities.",
                explanation: "The five essential requirements for successful tourism; developing a suitable combination of them is at the heart of tourism planning."
            },
            {
                question: "Who are the key players (stakeholders) in the tourism industry?",
                answer: "Local residents, local companies, media, employees, government, competitors, tourists, business associations, activists, and tourism developers.",
                explanation: "Tourism affects and involves a wide network of stakeholders, not just tourists and firms."
            },
            {
                question: "How are visitors classified?",
                answer: "Visitors = Tourists + Day-trippers.\nTourists travel for more than 24 h and stay overnight (≥1 night). Day-trippers stay less than 24 h and do NOT stay overnight.",
                explanation: "The overnight stay is the dividing line between a tourist and a day-tripper (excursionist)."
            },
            {
                question: "How are tourist holidays sub-divided by length?",
                answer: "Short holidays = 1–3 nights. Long holidays = more than 3 nights.",
                explanation: "A further distinction within the 'tourist' (overnight) category."
            },
            {
                question: "What are the two TYPES of tourism?",
                answer: "1. International tourism — Inbound + Outbound.\n2. Domestic tourism — travel within one's own country.",
                explanation: "Type depends on whether a national border is crossed."
            },
            {
                question: "Distinguish Inbound and Outbound tourism.",
                answer: "Inbound: tourists of OUTSIDE origin entering a particular country (incoming).\nOutbound: tourists travelling FROM their country of origin to another country (going outside).",
                explanation: "The same trip is inbound for the destination country and outbound for the origin country."
            },
            {
                question: "What is Domestic tourism and why is it easier?",
                answer: "Tourism activity of people within their own country. It is easier because it needs no formal travel documents, health checks or foreign-currency exchange, and usually involves no language barriers.",
                explanation: "Fewer formalities and frictions than crossing an international border."
            },
            {
                question: "What are the 4 types of impacts of tourism development?",
                answer: "Economic, Environmental, Social, and Cultural impacts.",
                explanation: "Impacts vary in type, location, and significance — the course studies all four."
            },
            {
                question: "Why are tourists important to a destination?",
                answer: "Tourism boosts the revenue of the economy, creates thousands of jobs, develops a country's infrastructure, and plants cultural exchange between foreigners and citizens.",
                explanation: "Tourism is a major foreign-exchange and employment generator and one of the world's fastest-growing industries."
            },
            {
                question: "What is tourism economics?",
                answer: "An applied branch (discipline) of economics that studies the economic effects of tourism activity: expenditure decisions, investment decisions, the structure & organization of markets (price, quantity, competition), tourism policy & planning, and issues related to international tourism.",
                explanation: "It applies general economic analysis to the specific functioning of the tourism market."
            },
            {
                question: "What does UN Tourism (UNWTO) say about tourism's growth?",
                answer: "Over recent decades tourism has experienced continued growth and diversification to become one of the LARGEST and FASTEST-growing economic sectors in the world.",
                explanation: "International arrivals grew from ~528 mn (1995) to ~1,035 mn (2012), with ~1.8 bn forecast for 2030."
            },
            {
                question: "What does the tourism market INCLUDE?",
                answer: "Tourism demand, intermediaries, and tourism supply.",
                explanation: "Supply and demand meet (through intermediaries) in the receptive tourism destination."
            },
            {
                question: "What are the key FEATURES of the tourism market?",
                answer: "Intangible product, no transfer of ownership, closely interrelated production (and consumption), an assembled product, no movement of the product, unstable demand, and wider coverage.",
                explanation: "These features distinguish the tourism 'product' from ordinary tangible goods."
            },
            {
                question: "Why is the tourism product called 'intangible' with 'no transfer of ownership'?",
                answer: "Tourism relates to service, pleasure and leisure that cannot be visualised in advance; buying/selling means buying a SERVICE, so no ownership of goods is transferred (unlike a tangible product).",
                explanation: "You buy an experience, not a physical item you can store or own."
            },
            {
                question: "What basic characteristic distinguishes tourists in the market?",
                answer: "In a receptive destination, tourists SPEND money instead of earning it, and they must be personally present — consumption of the tourism product is impossible without the tourist's presence.",
                explanation: "Production and consumption happen at the same place and time, with the tourist as an integral part."
            }
        ],

        quiz: [
            {
                question: "The word 'tour' derives from the Latin 'tornus', meaning:",
                options: ["A long journey", "A tool for making a circle", "To rest", "A market"],
                correct: 1
            },
            {
                question: "Which is NOT one of the 5 A's of tourism?",
                options: ["Attractions", "Access", "Advertising", "Amenities"],
                correct: 2
            },
            {
                question: "A visitor who stays less than 24 hours and does not stay overnight is a:",
                options: ["Tourist", "Day-tripper", "Inbound tourist", "Long-holiday tourist"],
                correct: 1
            },
            {
                question: "Tourists entering a country from outside represent:",
                options: ["Outbound tourism", "Domestic tourism", "Inbound tourism", "Excursionism"],
                correct: 2
            },
            {
                question: "Which is one of the four impacts of tourism development?",
                options: ["Technological", "Cultural", "Financial", "Logistical"],
                correct: 1
            },
            {
                question: "Tourism economics is best described as:",
                options: [
                    "A method of accounting for hotels",
                    "An applied branch of economics studying the economic effects of tourism",
                    "The marketing of destinations",
                    "A type of geography"
                ],
                correct: 1
            },
            {
                question: "The tourism market includes demand, supply and:",
                options: ["Governments", "Intermediaries", "Competitors", "Banks"],
                correct: 1
            },
            {
                question: "'No transfer of ownership' in the tourism market means:",
                options: [
                    "Tourists rent everything",
                    "Buying tourism means buying a service, not owning goods",
                    "Hotels are state-owned",
                    "Products are free"
                ],
                correct: 1
            },
            {
                question: "Short holidays are defined as:",
                options: ["Less than 24 hours", "1–3 nights", "4–7 nights", "More than 3 nights"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Visitors = Tourists + _______.",
                answer: "Day-trippers",
                hint: "Those who do not stay overnight..."
            },
            {
                sentence: "The 5 A's are: Attractions, Access, Accommodation, Amenities and _______.",
                answer: "Activities",
                hint: "Things tourists do..."
            },
            {
                sentence: "International tourism is split into inbound and _______ tourism.",
                answer: "outbound",
                hint: "Travelling out of the country of origin..."
            },
            {
                sentence: "Tourists travel for more than _______ hours and stay overnight.",
                answer: "24",
                hint: "A full day..."
            },
            {
                sentence: "The tourism product is _______ — it relates to service and cannot be visualised in advance.",
                answer: "intangible",
                hint: "Opposite of tangible / physical..."
            },
            {
                sentence: "The tourism market includes demand, intermediaries and tourism _______.",
                answer: "supply",
                hint: "The provision side..."
            }
        ],

        learn: {
            title: "Tourism Fundamentals & the Tourism Market",
            content: `
                <h3>What is Tourism?</h3>
                <p>The word <strong>'tour'</strong> comes from the Latin <span class="highlight">tornus</span> — 'a tool for making a circle'. The <strong>primary tourism industry</strong> = travel trade, transport, accommodation, catering, facilities and tourist attractions.</p>

                <div class="formula-box">
                    <h4><i class="fas fa-star"></i> The 5 A's of Tourism</h4>
                    <p>Attractions • Access • Accommodation • Amenities • Activities</p>
                    <p>A suitable combination of these is at the heart of tourism planning.</p>
                </div>

                <h4>Visitors</h4>
                <ul>
                    <li><strong>Tourists:</strong> travel &gt;24 h, stay overnight (short = 1–3 nights, long = &gt;3 nights)</li>
                    <li><strong>Day-trippers:</strong> stay &lt;24 h, no overnight</li>
                </ul>

                <h4>Types of Tourism</h4>
                <ul>
                    <li><strong>International:</strong> Inbound (entering a country) + Outbound (leaving the origin country)</li>
                    <li><strong>Domestic:</strong> within one's own country (no documents, health checks or currency exchange)</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Tourism Economics</h4>
                    <p>An applied branch of economics studying the economic effects of tourism: expenditure & investment decisions, market structure (price, quantity, competition), policy & planning, and international tourism.</p>
                </div>

                <h4>The Tourism Market</h4>
                <p>Includes <strong>demand + intermediaries + supply</strong>. Key features: intangible product, no transfer of ownership, closely interrelated production/consumption, an assembled product, no movement of the product, unstable demand, and wider coverage. Tourists must be present and <strong>spend</strong> money where they travel.</p>
            `
        }
    },

    // ========== UNIT 2: TOURISM DEMAND ==========
    demand: {
        name: "Tourism Demand",
        icon: "fa-chart-line",
        color: "#10b981",

        flashcards: [
            {
                question: "What is tourism demand?",
                answer: "The WILLINGNESS and ABILITY of consumers to buy different amounts of a tourism product at different prices during any period of time.",
                explanation: "Both willingness (desire) and ability (purchasing power) are required — not just one."
            },
            {
                question: "What are the 2 types of tourism demand?",
                answer: "1. Demand for TRAVEL to a destination (e.g. visitor arrivals, overnights, expenditure).\n2. Demand for a PARTICULAR tourism-related product or service (e.g. hotel rooms, restaurant meals).",
                explanation: "Demand can be measured at the destination level or at the individual product level."
            },
            {
                question: "What determines demand for travel to a destination?",
                answer: "Price factors (transport, accommodation, excursions, food & beverage, entertainment) and non-price factors (socio-economic, demographic and qualitative factors).",
                explanation: "Both the cost of the trip and the traveller's characteristics matter."
            },
            {
                question: "What are the most important variables affecting demand for any good/service?",
                answer: "Price, consumer income, the number of consumers in the market, the price of related products, consumer tastes, the level of marketing/promotion expenditure, and other variables.",
                explanation: "Standard demand determinants applied to tourism."
            },
            {
                question: "List key factors influencing tourism demand specifically.",
                answer: "Size of the market (population), income, tastes, advertising & promotion, seasonality, product availability, prices of substitute & complementary products, and the amount of leisure time available.",
                explanation: "Seasonality and leisure time are especially important in tourism."
            },
            {
                question: "What is the Law of Demand?",
                answer: "Price and tourism demand have an INVERSE relationship: as the price of a tourism product falls, the quantity demanded rises (and vice versa).",
                explanation: "The downward-sloping demand curve."
            },
            {
                question: "How do non-price factors affect demand?",
                answer: "Changes in non-price factors shift demand at ANY given price: if non-price factors work in favour of the product, more is demanded at each price (and vice versa).",
                explanation: "Price changes move along the curve; non-price factors shift the whole curve."
            },
            {
                question: "What is the Bandwagon effect?",
                answer: "People demand a product or service BECAUSE others are purchasing it (because it is 'fashionable').",
                explanation: "Following the crowd increases demand."
            },
            {
                question: "What is the Snob effect?",
                answer: "Some consumers seek to be different and exclusive by demanding LESS of a product as MORE people consume it.",
                explanation: "The opposite of the bandwagon effect — exclusivity drives demand down as popularity rises."
            },
            {
                question: "What is the Veblen effect?",
                answer: "Some individuals seek to impress others by demanding MORE of certain 'high-status' products as their PRICE RISES (prestige).",
                explanation: "Higher price signals more prestige, so demand increases — contradicting the Law of Demand for luxury goods."
            },
            {
                question: "What are the FOUR forms of tourism demand elasticity?",
                answer: "1. Price elasticity\n2. Income elasticity\n3. Cross-price elasticity\n4. Marketing (advertising) elasticity",
                explanation: "Note there are FOUR forms — marketing elasticity is the one often forgotten."
            },
            {
                question: "Define price elasticity and income elasticity of demand (with formulas).",
                answer: "Price elasticity = how demand changes due to a change in the product's OWN price = %ΔQuantity demanded / %ΔPrice.\nIncome elasticity = how demand changes due to a change in consumer INCOME = %ΔQuantity demanded / %ΔIncome.",
                explanation: "Each elasticity divides the % change in quantity demanded by the % change in the driver."
            },
            {
                question: "Define cross-price elasticity and marketing elasticity of demand (with formulas).",
                answer: "Cross-price elasticity = how demand changes due to a change in the price of SUBSTITUTE/COMPLEMENTARY goods = %ΔQd of product A / %ΔPrice of product B.\nMarketing (advertising) elasticity = responsiveness of sales to changes in marketing expenditure = %ΔQd / %ΔMarketing expenditure.",
                explanation: "Cross-price links two products; marketing elasticity links sales to promotion spend."
            }
        ],

        quiz: [
            {
                question: "Tourism demand requires consumers to have:",
                options: ["Only the willingness to buy", "Only the ability to pay", "Both willingness AND ability", "A travel agent"],
                correct: 2
            },
            {
                question: "The Law of Demand describes a relationship between price and demand that is:",
                options: ["Direct", "Inverse", "Unrelated", "Always proportional"],
                correct: 1
            },
            {
                question: "How many forms of tourism demand elasticity are there?",
                options: ["2", "3", "4", "5"],
                correct: 2
            },
            {
                question: "Price Elasticity of Demand =",
                options: ["%ΔPrice / %ΔQuantity", "%ΔQuantity demanded / %ΔPrice", "%ΔIncome / %ΔPrice", "%ΔQuantity / %ΔIncome"],
                correct: 1
            },
            {
                question: "The Snob effect means demand:",
                options: ["Rises as others buy", "Falls as more people consume the product", "Rises as price rises", "Is unaffected by others"],
                correct: 1
            },
            {
                question: "The Veblen effect applies to:",
                options: ["Necessities", "Inferior goods", "High-status / prestige goods", "Free goods"],
                correct: 2
            },
            {
                question: "Which is a NON-price factor influencing tourism demand?",
                options: ["Accommodation price", "Transport cost", "Seasonality", "Excursion price"],
                correct: 2
            },
            {
                question: "Demand for 'visitor arrivals, overnights and expenditure' is demand for:",
                options: ["A particular product", "Travel to a destination", "Hotel rooms only", "Restaurant meals"],
                correct: 1
            },
            {
                question: "Cross-price elasticity measures demand changes caused by:",
                options: [
                    "The product's own price",
                    "Consumer income",
                    "The price of substitute/complementary goods",
                    "Marketing spend"
                ],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                sentence: "Tourism demand is the willingness and _______ of consumers to buy a product at different prices.",
                answer: "ability",
                hint: "Purchasing power..."
            },
            {
                sentence: "Price and tourism demand have an _______ relationship (Law of Demand).",
                answer: "inverse",
                hint: "Opposite directions..."
            },
            {
                sentence: "The _______ effect: people demand more of a status good as its price rises.",
                answer: "Veblen",
                hint: "Named after economist Thorstein..."
            },
            {
                sentence: "The four elasticities are price, income, cross-price and _______ elasticity.",
                answer: "marketing",
                hint: "Also called advertising elasticity..."
            },
            {
                sentence: "Price Elasticity of Demand = % change in quantity demanded / % change in _______.",
                answer: "price",
                hint: "The product's own..."
            },
            {
                sentence: "The _______ effect: people buy a product because others are buying it (fashionable).",
                answer: "Bandwagon",
                hint: "Jump on the..."
            }
        ],

        learn: {
            title: "Tourism Demand",
            content: `
                <h3>Definition</h3>
                <p><strong>Tourism demand</strong> = the <span class="highlight">willingness AND ability</span> of consumers to buy different amounts of a tourism product at different prices during any period.</p>

                <h4>Two Types of Demand</h4>
                <ul>
                    <li><strong>Travel to a destination</strong> (arrivals, overnights, expenditure)</li>
                    <li><strong>A particular product/service</strong> (hotel rooms, restaurant meals)</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-balance-scale"></i> Law of Demand</h4>
                    <p>Price ↓ → Quantity demanded ↑ &nbsp; (inverse relationship)</p>
                    <p>Non-price factors SHIFT the demand curve at every price.</p>
                </div>

                <h4>Special Demand Effects</h4>
                <ul>
                    <li><strong>Bandwagon:</strong> buy because others buy (fashion) → demand ↑</li>
                    <li><strong>Snob:</strong> buy less as more people consume (exclusivity)</li>
                    <li><strong>Veblen:</strong> buy more of a status good as price rises (prestige)</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-calculator"></i> Four Elasticities (each = %ΔQd / %Δdriver)</h4>
                    <p><strong>Price</strong> (own price) • <strong>Income</strong> • <strong>Cross-price</strong> (price of A vs B) • <strong>Marketing</strong> (advertising spend)</p>
                </div>
            `
        }
    },

    // ========== UNIT 3: FORECASTING TOURISM DEMAND ==========
    forecasting: {
        name: "Forecasting Tourism Demand",
        icon: "fa-magnifying-glass-chart",
        color: "#06b6d4",

        flashcards: [
            {
                question: "Why is forecasting tourism demand important?",
                answer: "In a changing global environment, reliable short-term and long-term forecasts of tourism activity are essential for both government policy development and business planning.",
                explanation: "Forecasts guide decisions for the public sector, businesses, and planners."
            },
            {
                question: "What are the 3 time horizons in tourism forecasting?",
                answer: "Short run, intermediate run, and long range.",
                explanation: "Different decisions require different forecasting horizons."
            },
            {
                question: "Give some of the 7 reasons forecasting is especially important in tourism.",
                answer: "The tourist product is perishable; tourism behaviour is complex; people are inseparable from the production–consumption process; customer satisfaction depends on complementary products/services; demand is extremely sensitive to natural and human-made disasters; forecasting aids long-term planning; it is fundamental to modern business.",
                explanation: "Perishability and disaster-sensitivity make accurate forecasting vital in tourism."
            },
            {
                question: "What are the 3 broad methods of forecasting?",
                answer: "1. Qualitative forecasting — based on judgment, experience, practical knowledge and intuition.\n2. Quantitative forecasting — uses mathematical techniques to predict variables.\n3. Artificial Intelligence — AI-based systems built to bridge the gap between qualitative and quantitative approaches.",
                explanation: "AI acts as a bridge between human judgment and pure mathematical models."
            },
            {
                question: "When are QUALITATIVE (judgmental) forecasting methods used?",
                answer: "When there are insufficient historical data; the available time series is not reliable/valid; the macro environment is changing rapidly; there are major disturbances (wars, terrorism, strikes, natural disasters, COVID-19); or long-term forecasts are desired.",
                explanation: "Judgment fills in when data are missing or the environment is unstable."
            },
            {
                question: "What are the 3 types of quantitative forecasting models?",
                answer: "1. Time-series models — assume a variable's past course is the key to predicting its future.\n2. Causal (econometric) models — identify causal relationships between the demand variable and its influencing factors.\n3. Mixed models — include both time-series and structural (causal) elements.",
                explanation: "Time-series looks at the past trend; causal models explain the 'why'."
            },
            {
                question: "What is the most common method of estimating demand?",
                answer: "Regression analysis.",
                explanation: "It estimates how independent variables affect the tourism demand variable."
            },
            {
                question: "What are the 4 steps in using regression analysis?",
                answer: "1. Specify the model to be estimated (identify the most important variables affecting demand).\n2. Collect the data for the variables in the model.\n3. Determine the form of the model (most common is the linear model).\n4. Evaluate the regression results.",
                explanation: "A structured procedure for modelling tourism demand."
            },
            {
                question: "In demand regression, what are typical DEPENDENT and INDEPENDENT variables?",
                answer: "Dependent (explained): tourist arrivals, tourist expenditures, length of stay.\nIndependent (explanatory): income, relative prices, transport cost, marketing/promotion expenses, qualitative factors.",
                explanation: "The dependent variable is the demand being predicted; independents are its drivers."
            },
            {
                question: "Who uses demand forecasts and why?",
                answer: "Tourism marketers (set marketing goals, explore potential markets, simulate the impact of future events); business managers (determine operational requirements — staffing, supplies, capacity — and study investment feasibility); planners & public agencies (predict economic, social/cultural and environmental effects of visitors).",
                explanation: "Poor forecasting leads to over/under-budgeting, wasted resources, and degradation."
            }
        ],

        quiz: [
            {
                question: "How many time horizons are used in tourism forecasting?",
                options: ["2", "3", "4", "5"],
                correct: 1
            },
            {
                question: "Which is one of the three broad forecasting methods?",
                options: ["Accounting", "Qualitative", "Marketing", "Sampling"],
                correct: 1
            },
            {
                question: "AI-based forecasting systems are built to:",
                options: [
                    "Replace all managers",
                    "Bridge the gap between qualitative and quantitative approaches",
                    "Only collect data",
                    "Set prices"
                ],
                correct: 1
            },
            {
                question: "Qualitative forecasting is appropriate when:",
                options: [
                    "There are plenty of reliable historical data",
                    "There are insufficient or unreliable data and major disturbances",
                    "The market never changes",
                    "Only short-term forecasts are needed"
                ],
                correct: 1
            },
            {
                question: "Time-series models assume that:",
                options: [
                    "Income drives demand",
                    "A variable's past course is the key to its future",
                    "Prices are fixed",
                    "Marketing has no effect"
                ],
                correct: 1
            },
            {
                question: "The most common method of estimating demand is:",
                options: ["Brainstorming", "Regression analysis", "The Delphi panel", "Random sampling"],
                correct: 1
            },
            {
                question: "Which is a typical DEPENDENT variable in a tourism demand model?",
                options: ["Income", "Transport cost", "Tourist arrivals", "Relative prices"],
                correct: 2
            },
            {
                question: "Causal (econometric) models try to:",
                options: [
                    "Extend the past trend only",
                    "Identify causal relationships between demand and its influencing factors",
                    "Avoid using any data",
                    "Forecast without variables"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The three broad forecasting methods are qualitative, quantitative and _______.",
                answer: "Artificial Intelligence",
                hint: "AI..."
            },
            {
                sentence: "_______ analysis is the most common method of estimating demand.",
                answer: "Regression",
                hint: "Fits a line to data..."
            },
            {
                sentence: "_______-series models assume a variable's past course predicts its future.",
                answer: "Time",
                hint: "Past observations over... "
            },
            {
                sentence: "Qualitative forecasting relies on experience, knowledge and _______.",
                answer: "intuition",
                hint: "Gut judgment..."
            },
            {
                sentence: "Tourist arrivals, expenditures and length of stay are typical _______ variables.",
                answer: "dependent",
                hint: "The thing being explained/predicted..."
            }
        ],

        learn: {
            title: "Forecasting Tourism Demand",
            content: `
                <h3>Why Forecast?</h3>
                <p>Reliable short- and long-term forecasts support <strong>government policy</strong> and <strong>business planning</strong>. Tourism especially needs forecasting because the product is <span class="highlight">perishable</span>, behaviour is complex, production and consumption are inseparable, and demand is highly sensitive to disasters.</p>

                <div class="formula-box">
                    <h4><i class="fas fa-clock"></i> 3 Time Horizons</h4>
                    <p>Short run • Intermediate run • Long range</p>
                </div>

                <h4>3 Broad Methods</h4>
                <ul>
                    <li><strong>Qualitative</strong> — judgment, experience, intuition (used when data are scarce/unreliable or the environment is unstable)</li>
                    <li><strong>Quantitative</strong> — mathematical models</li>
                    <li><strong>Artificial Intelligence</strong> — bridges qualitative & quantitative</li>
                </ul>

                <h4>Quantitative Models</h4>
                <ul>
                    <li><strong>Time-series:</strong> past course predicts the future</li>
                    <li><strong>Causal (econometric):</strong> identify causal relationships</li>
                    <li><strong>Mixed:</strong> time-series + structural elements</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-square-root-variable"></i> Regression Analysis (most common)</h4>
                    <p>4 steps: specify the model → collect data → determine form (usually linear) → evaluate results.<br>
                    Dependent: arrivals, expenditure, length of stay. Independent: income, relative prices, transport cost, marketing, qualitative factors.</p>
                </div>
            `
        }
    },

    // ========== UNITS 4–5: TOURISM SUPPLY, PRODUCTION & COSTS ==========
    supply: {
        name: "Supply, Production & Costs",
        icon: "fa-industry",
        color: "#f59e0b",

        flashcards: [
            {
                question: "What are the 3 basic forms of inputs (factors of production) into tourism supply?",
                answer: "Natural resources, human resources, and human-made resources.",
                explanation: "Production and supply of tourism products are based on these inputs."
            },
            {
                question: "What is the difference between the short run and the long run in production?",
                answer: "Short run: the timeframe in which AT LEAST ONE factor of production is FIXED.\nLong run: ALL factors of production can be varied.",
                explanation: "The defining feature of the short run is the existence of a fixed factor."
            },
            {
                question: "What is the difference between variable and fixed inputs?",
                answer: "Variable inputs can be changed at short notice. Fixed inputs cannot be easily adjusted.",
                explanation: "Inputs into tourism supply are either fixed or variable."
            },
            {
                question: "On what do production costs in tourism depend?",
                answer: "On the quantity, price and productivity of the factors used in the provision of the product.",
                explanation: "More/expensive/less-productive factors raise costs."
            },
            {
                question: "What is the difference between explicit and implicit costs?",
                answer: "Explicit costs are direct payments made by the firm to OUTSIDE suppliers of inputs.\nImplicit costs are the OPPORTUNITY costs the firm faces in using its OWN resources in one task rather than another — no direct payment, and sometimes hard to quantify.",
                explanation: "Explicit = money paid out; implicit = value of foregone alternatives."
            },
            {
                question: "Give the main cost formulas (TC, AC, AFC, AVC, MC).",
                answer: "TC = FC + VC (total cost).\nAC = TC / Q (average / unit cost).\nAFC = FC / Q (average fixed cost).\nAVC = VC / Q (average variable cost).\nMC = dTC / dQ (marginal cost — extra cost of one more unit).",
                explanation: "Average costs divide a total by output; marginal cost is the cost of the next unit."
            },
            {
                question: "What are Total, Average and Marginal PRODUCT?",
                answer: "Total product (TP) = output generated from the factors employed.\nAverage product (AP) = TP / Q (output per unit of the variable factor, e.g. per worker).\nMarginal product (MP) = the change in total product when ONE additional unit of the variable factor is employed (e.g. extra meals from one extra chef).",
                explanation: "In intangible service industries like tourism, 'output' can be hard to measure."
            },
            {
                question: "What is economy of scale?",
                answer: "When a given percentage increase in ALL inputs results in a LARGER percentage increase in the firm's output — reducing unit costs (long-run average costs, LRAC).",
                explanation: "Tourism examples: aircraft manufacture, mega cruise ships, public transport."
            },
            {
                question: "What is diseconomy of scale?",
                answer: "When a given percentage increase in all inputs leads to a SMALLER percentage increase in output (decreasing returns to scale). It can also be caused externally — e.g. tourism growth in a region raising factor costs (land, labour, capital).",
                explanation: "Getting too big (or external cost pressures) reduces efficiency."
            },
            {
                question: "What is a supply chain?",
                answer: "The network of organisations, people, activities, information and resources involved in moving a product or service from a supplier to a customer — transforming natural resources, raw materials and components into a finished product delivered to the ultimate consumer.",
                explanation: "Everything involved in getting the tourism product to the consumer."
            }
        ],

        quiz: [
            {
                question: "Which is NOT one of the three basic inputs into tourism supply?",
                options: ["Natural resources", "Human resources", "Financial resources", "Human-made resources"],
                correct: 2
            },
            {
                question: "In the SHORT run:",
                options: [
                    "All factors are variable",
                    "At least one factor is fixed",
                    "No production occurs",
                    "Only labour is used"
                ],
                correct: 1
            },
            {
                question: "Implicit costs are:",
                options: [
                    "Direct payments to outside suppliers",
                    "Opportunity costs of using the firm's own resources",
                    "Always zero",
                    "The same as fixed costs"
                ],
                correct: 1
            },
            {
                question: "Average variable cost (AVC) is calculated as:",
                options: ["FC / Q", "VC / Q", "TC / Q", "dTC / dQ"],
                correct: 1
            },
            {
                question: "Marginal cost (MC) is:",
                options: [
                    "Total cost divided by output",
                    "The extra cost of producing one more unit (dTC/dQ)",
                    "Fixed cost per unit",
                    "Variable cost only"
                ],
                correct: 1
            },
            {
                question: "Marginal product measures:",
                options: [
                    "Total output",
                    "Output per worker",
                    "The change in total product from one extra unit of the variable factor",
                    "Cost per unit"
                ],
                correct: 2
            },
            {
                question: "Economy of scale means a % increase in all inputs gives a:",
                options: [
                    "Smaller % increase in output",
                    "Larger % increase in output",
                    "Equal % increase in output",
                    "Fall in output"
                ],
                correct: 1
            },
            {
                question: "Total Cost is defined as:",
                options: ["FC − VC", "FC + VC", "FC × VC", "VC / FC"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The three inputs into tourism supply are natural, human and _______ resources.",
                answer: "human-made",
                hint: "Built / man-made..."
            },
            {
                sentence: "In the short run at least one factor of production is _______.",
                answer: "fixed",
                hint: "Cannot be easily adjusted..."
            },
            {
                sentence: "TC = FC + _______.",
                answer: "VC",
                hint: "Variable cost..."
            },
            {
                sentence: "_______ costs are the opportunity costs of using the firm's own resources.",
                answer: "Implicit",
                hint: "Opposite of explicit..."
            },
            {
                sentence: "Economy of scale reduces the firm's long-run _______ costs (LRAC).",
                answer: "average",
                hint: "Cost per unit..."
            },
            {
                sentence: "Marginal cost MC = dTC / _______.",
                answer: "dQ",
                hint: "Change in output (quantity)..."
            }
        ],

        learn: {
            title: "Supply, Production & Costs",
            content: `
                <h3>Production Inputs</h3>
                <ul>
                    <li><strong>Natural</strong>, <strong>Human</strong>, and <strong>Human-made</strong> resources</li>
                    <li><strong>Short run:</strong> ≥1 factor fixed · <strong>Long run:</strong> all factors variable</li>
                    <li><strong>Variable</strong> inputs change at short notice; <strong>fixed</strong> inputs cannot be easily adjusted</li>
                </ul>

                <h4>Explicit vs Implicit Costs</h4>
                <ul>
                    <li><strong>Explicit:</strong> direct payments to outside suppliers</li>
                    <li><strong>Implicit:</strong> opportunity cost of using own resources (no direct payment)</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-calculator"></i> Cost Formulas</h4>
                    <p>TC = FC + VC<br>AC = TC / Q &nbsp;|&nbsp; AFC = FC / Q &nbsp;|&nbsp; AVC = VC / Q<br>MC = dTC / dQ (cost of one more unit)</p>
                </div>

                <div class="formula-box">
                    <h4><i class="fas fa-boxes-stacked"></i> Product</h4>
                    <p>TP = total output · AP = TP / Q (per worker) · MP = change in TP from one extra unit of the variable factor</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Scale Effects</h4>
                    <p><strong>Economy of scale:</strong> inputs ↑% → output ↑ larger % → unit costs ↓ (aircraft, cruise ships, public transport).<br>
                    <strong>Diseconomy of scale:</strong> output rises by a smaller %; can also come from external factor-cost increases.</p>
                </div>
            `
        }
    },

    // ========== UNIT 6: TOURISM & MARKET STRUCTURE ==========
    marketStructure: {
        name: "Market Structure",
        icon: "fa-building",
        color: "#f97316",

        flashcards: [
            {
                question: "What is market structure and what does it affect?",
                answer: "Market structure refers to the NATURE of the market within which a tourism firm operates. It affects the firm's CONDUCT (decision-making processes) and the firm's PERFORMANCE (potential to make profit, gain market share and achieve efficiency).",
                explanation: "This is the basis of the Structure–Conduct–Performance (SCP) framework."
            },
            {
                question: "List the major determinants of market structure.",
                answer: "Number of sellers; number of buyers; nature of goods/services offered; entry & exit barriers; information about market conditions (prices, technology); economy of scale; and the level of product/service differentiation between firms.",
                explanation: "These factors together decide which structure prevails."
            },
            {
                question: "What are the 4 types of market structure?",
                answer: "1. Perfect competition\n2. Monopolistic competition\n3. Oligopoly\n4. Monopoly",
                explanation: "Ordered from most competitive to least competitive."
            },
            {
                question: "Describe PERFECT COMPETITION (and a tourism example).",
                answer: "Very large number of buyers and sellers; perfect information; individual firms' outputs too small to affect price; identical products sold at the market-set price; no barriers to entry/exit. Tourism example: street stalls.",
                explanation: "No single firm has market power — it is a price-taker."
            },
            {
                question: "Describe MONOPOLISTIC COMPETITION (and tourism examples).",
                answer: "Very large number of buyers and sellers; small market power; products are similar but slightly DIFFERENTIATED; no barriers to entry/exit. Tourism examples: restaurants, hotels, B&Bs, travel agencies.",
                explanation: "Differentiation gives each firm a little (limited) price control."
            },
            {
                question: "Describe OLIGOPOLY (and tourism examples).",
                answer: "A SMALL number of firms dominate supply; consumers have imperfect information; firms are mutually interdependent (set output/price with reference to each other); strong barriers to entry/exit. Tourism examples: tour operators, airlines.",
                explanation: "Few large firms watch each other closely when setting price and output."
            },
            {
                question: "Describe MONOPOLY (and a tourism example).",
                answer: "Only ONE seller; consumers have imperfect information; the firm determines market output and price; no direct substitute for the product; very strong barriers to entry/exit. Tourism example: nationalized railways.",
                explanation: "A single firm with strong price control and no close substitutes."
            },
            {
                question: "Which factors determine which structure prevails in a tourism market?",
                answer: "The number of sellers, the extent of product differentiation, diversification, and barriers to entry.",
                explanation: "More sellers + low differentiation + low barriers → more competition."
            },
            {
                question: "What are the 3 broad competitive strategies firms pursue?",
                answer: "1. Cost leadership\n2. Product differentiation\n3. Focus",
                explanation: "Firms pursue one or a combination of these."
            },
            {
                question: "Explain the COST LEADERSHIP strategy.",
                answer: "An integrated set of actions to produce/deliver goods or services at the LOWEST cost — via cheaper inputs, producing a core product, and achieving economies of scale (high volume, volume-purchasing discounts). Good when the market is price-sensitive; low cost can be a barrier to entry. Example: low-cost airlines.",
                explanation: "Compete by being the cheapest producer."
            },
            {
                question: "Explain the PRODUCT DIFFERENTIATION and FOCUS strategies.",
                answer: "Differentiation: better product performance or perception → creates market power, reduces price elasticity, builds repeat business and brand.\nFocus: concentrate on a particular geographical area, customer segment, or single product/line — e.g. 6/7★ hotels focusing on high-income guests with prestige pricing.",
                explanation: "Differentiation competes on uniqueness; focus competes by serving a niche well."
            }
        ],

        quiz: [
            {
                question: "Market structure affects a firm's conduct and its:",
                options: ["Location", "Performance", "Logo", "Staff uniforms"],
                correct: 1
            },
            {
                question: "Which market structure has only ONE seller and no close substitute?",
                options: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"],
                correct: 3
            },
            {
                question: "Restaurants, hotels and B&Bs are typical examples of:",
                options: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"],
                correct: 1
            },
            {
                question: "An oligopoly is characterized by:",
                options: [
                    "Many small firms with identical products",
                    "A few dominant, mutually interdependent firms with strong barriers",
                    "One seller",
                    "No barriers to entry"
                ],
                correct: 1
            },
            {
                question: "In perfect competition, the individual firm is a:",
                options: ["Price-maker", "Price-taker (price set by the market)", "Monopolist", "Cartel leader"],
                correct: 1
            },
            {
                question: "Low-cost airlines are a classic example of which strategy?",
                options: ["Product differentiation", "Focus", "Cost leadership", "Diversification"],
                correct: 2
            },
            {
                question: "A 6/7★ hotel targeting high-income guests with prestige pricing uses a:",
                options: ["Cost leadership strategy", "Focus strategy", "Perfect-competition strategy", "Mass-market strategy"],
                correct: 1
            },
            {
                question: "Which is a determinant of market structure?",
                options: ["Weather", "Number of sellers and barriers to entry", "Hotel star rating only", "Tourist nationality"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Market structure affects a firm's conduct and its _______.",
                answer: "performance",
                hint: "Profit, market share, efficiency..."
            },
            {
                sentence: "The 4 market structures are perfect competition, monopolistic competition, oligopoly and _______.",
                answer: "monopoly",
                hint: "One seller..."
            },
            {
                sentence: "In a(n) _______ a small number of firms dominate and are mutually interdependent.",
                answer: "oligopoly",
                hint: "Few sellers (oligo = few)..."
            },
            {
                sentence: "The three competitive strategies are cost leadership, product differentiation and _______.",
                answer: "focus",
                hint: "Concentrate on a niche/segment..."
            },
            {
                sentence: "_______ competition firms sell identical products at the market-set price.",
                answer: "Perfect",
                hint: "The most competitive structure..."
            }
        ],

        learn: {
            title: "Tourism & Market Structure",
            content: `
                <h3>What is Market Structure?</h3>
                <p>The <strong>nature of the market</strong> a tourism firm operates in. It shapes the firm's <strong>conduct</strong> (decisions) and <strong>performance</strong> (profit, market share, efficiency) — the <span class="highlight">Structure–Conduct–Performance (SCP)</span> framework.</p>

                <h4>4 Market Structures (most → least competitive)</h4>
                <table>
                    <tr><th>Structure</th><th>Key features</th><th>Tourism example</th></tr>
                    <tr><td>Perfect competition</td><td>Many firms, identical products, perfect info, no barriers, price-taker</td><td>Street stalls</td></tr>
                    <tr><td>Monopolistic competition</td><td>Many firms, slightly differentiated products, small price control, no barriers</td><td>Restaurants, hotels, B&Bs, travel agencies</td></tr>
                    <tr><td>Oligopoly</td><td>Few dominant, interdependent firms, strong barriers</td><td>Tour operators, airlines</td></tr>
                    <tr><td>Monopoly</td><td>One seller, no substitute, strong price control, very strong barriers</td><td>Nationalized railways</td></tr>
                </table>

                <div class="tip-box">
                    <h4><i class="fas fa-chess"></i> 3 Competitive Strategies</h4>
                    <p><strong>Cost leadership:</strong> lowest cost (cheaper inputs, economies of scale) → e.g. low-cost airlines<br>
                    <strong>Product differentiation:</strong> better performance/perception → market power, brand, lower price elasticity<br>
                    <strong>Focus:</strong> a niche area/segment/product → e.g. 6/7★ hotels with prestige pricing</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.te2M1 = te2M1; }
if (typeof module !== "undefined" && module.exports) { module.exports = te2M1; }
