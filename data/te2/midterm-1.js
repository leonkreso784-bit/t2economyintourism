// ===== TOURISM ECONOMICS (te2) — Midterm 1 (Units 1–6) =====
// Izvor: silabus "Tourism economics_introduction.pdf" (Smolčić Jurdana / Soldić Frleta / Dwyer,
//   FMTU Opatija, 2025/26) + prezentacije. Granica kolokvija po slajdu "IMPORTANT DATES":
//   1. test = jedinice 1.–6. (4.11.2025.), 2. test = 7.–12. (13.01.2026.).
// K1 pokriva: 1) Key concepts & tourism market, 2) Demand + elasticity, 3) Forecasting demand,
//   4) Supply factors + elasticity, 5) Supply: production & costs, 6) Market structure.
// Oblik po docs/CONTENT_SCHEMA.md. Pri izmjeni bumpaj CONTENT_VERSION (js/content-loader.js).

const te2M1 = {

    // ========== UNIT 1: TOURISM FUNDAMENTALS ==========
    fundamentals: {
        name: "Tourism Fundamentals",
        icon: "fa-globe-americas",
        color: "#6366f1",

        flashcards: [
            {
                question: "What is the origin of the word 'tour'?",
                answer: "Latin word 'tornus' meaning 'a tool for making a circle'",
                explanation: "The etymology reflects the circular nature of travel - leaving home and returning."
            },
            {
                question: "What are the 3 key dimensions of tourism?",
                answer: "1. Movement\n2. Length of stay\n3. Motivation",
                explanation: "These three dimensions define what makes an activity 'tourism'."
            },
            {
                question: "What are the 5 A's of tourism?",
                answer: "1. Attractions\n2. Access\n3. Amenities\n4. Accommodation\n5. Activities",
                explanation: "The 5 A's framework for understanding tourism destinations."
            },
            {
                question: "What is the difference between tourists and day-trippers?",
                answer: "Tourists: stay more than 24 hours\nDay-trippers: stay less than 24 hours",
                explanation: "Visitors = Tourists + Day-trippers"
            },
            {
                question: "What are the 2 types of tourism?",
                answer: "1. International (outbound + inbound)\n2. Domestic (within same country)",
                explanation: "Outbound = leaving homeland, Inbound = incoming tourists"
            },
            {
                question: "What are the 4 impacts of tourism development?",
                answer: "1. Economic\n2. Environmental\n3. Social\n4. Cultural",
                explanation: "Tourism affects destinations in these four key areas."
            },
            {
                question: "Why are tourists important?",
                answer: "• Boost economy revenue\n• Create thousands of jobs\n• Develop infrastructure\n• Cultural exchange",
                explanation: "Four key benefits of tourism for destinations."
            },
            {
                question: "What is UNWTO?",
                answer: "United Nations World Tourism Organisation",
                explanation: "The main international body for tourism policy and statistics."
            },
            {
                question: "When is World Tourism Day?",
                answer: "September 27th",
                explanation: "Celebrated annually to promote tourism awareness."
            }
        ],

        quiz: [
            {
                question: "The word 'tour' comes from which Latin word?",
                options: ["Tornus", "Turismo", "Travela", "Tourus"],
                correct: 0
            },
            {
                question: "Which is NOT one of the 5 A's of tourism?",
                options: ["Attractions", "Access", "Advertising", "Accommodation"],
                correct: 2
            },
            {
                question: "Visitors who stay less than 24 hours are called:",
                options: ["Tourists", "Day-trippers", "Excursionists", "Travelers"],
                correct: 1
            },
            {
                question: "When is World Tourism Day celebrated?",
                options: ["January 1st", "June 21st", "September 27th", "December 25th"],
                correct: 2
            },
            {
                question: "Which is NOT an impact of tourism development?",
                options: ["Economic", "Environmental", "Technological", "Cultural"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                sentence: "The 5 A's are: Attractions, Access, Amenities, _______ and Activities.",
                answer: "Accommodation",
                hint: "Where tourists sleep..."
            },
            {
                sentence: "Visitors = Tourists + _______.",
                answer: "Day-trippers",
                hint: "Those who stay less than 24 hours..."
            }
        ],

        learn: {
            title: "Tourism Fundamentals",
            content: `
                <h3>Origins of Tourism</h3>
                <p>The word <strong>'tour'</strong> comes from the Latin word <span class="highlight">tornus</span>, meaning 'a tool for making a circle.'</p>

                <h4>3 Key Dimensions of Tourism:</h4>
                <ul>
                    <li>Movement</li>
                    <li>Length of stay</li>
                    <li>Motivation</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-star"></i> The 5 A's</h4>
                    <p>Attractions • Access • Amenities • Accommodation • Activities</p>
                </div>

                <h4>Types of Visitors:</h4>
                <ul>
                    <li><strong>Tourists:</strong> Stay more than 24 hours</li>
                    <li><strong>Day-trippers:</strong> Stay less than 24 hours</li>
                </ul>

                <h4>Types of Tourism:</h4>
                <ul>
                    <li><strong>International:</strong> Outbound (leaving) + Inbound (incoming)</li>
                    <li><strong>Domestic:</strong> Travel within same country</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Remember!</h4>
                    <p>UNWTO = United Nations World Tourism Organisation<br>
                    World Tourism Day = September 27th</p>
                </div>
            `
        }
    },

    // ========== UNITS 2–3: TOURISM DEMAND (+ FORECASTING) ==========
    demand: {
        name: "Tourism Demand",
        icon: "fa-chart-line",
        color: "#10b981",

        flashcards: [
            {
                question: "What is tourism demand?",
                answer: "The ability of consumers to buy different amounts of a product at different prices during any period of time",
                explanation: "Basic economic definition of demand applied to tourism."
            },
            {
                question: "What are the 2 types of tourism demand?",
                answer: "1. Demand for travel to destination (arrivals, overnights, expenditure)\n2. Demand for tourism-related products/services (hotel rooms, meals)",
                explanation: "Demand can be measured at destination level or product level."
            },
            {
                question: "What is the Law of Demand?",
                answer: "Price and tourism demand have an INVERSE relationship",
                explanation: "When price goes up, demand goes down (and vice versa)."
            },
            {
                question: "What is the Bandwagon Effect?",
                answer: "People demand a product because others are purchasing it (because it is 'fashionable')",
                explanation: "Following the crowd - if everyone is going there, I want to go too."
            },
            {
                question: "What is the Snob Effect?",
                answer: "Consumers seek to be different and exclusive by demanding LESS of a product as more people consume it",
                explanation: "Opposite of bandwagon - I don't want to go where everyone else goes."
            },
            {
                question: "What is the Veblen Effect?",
                answer: "Individuals demand MORE of certain 'high status' products as their price RISES",
                explanation: "Luxury goods - higher price = more prestige = more demand."
            },
            {
                question: "What is Price Elasticity of Demand formula?",
                answer: "PED = (% Change in Quantity Demanded) / (% Change in Price)",
                explanation: "Measures how sensitive demand is to price changes."
            },
            {
                question: "What are the 3 forecasting methods?",
                answer: "1. Qualitative (experience, intuition)\n2. Quantitative (mathematical)\n3. Artificial Intelligence (bridge between qual and quant)",
                explanation: "Three approaches to predicting future tourism trends."
            }
        ],

        quiz: [
            {
                question: "The Law of Demand states that price and demand have:",
                options: ["Direct relationship", "Inverse relationship", "No relationship", "Positive correlation"],
                correct: 1
            },
            {
                question: "The Bandwagon Effect means people buy because:",
                options: ["It's cheap", "Others are buying it", "It's exclusive", "Price is rising"],
                correct: 1
            },
            {
                question: "The Veblen Effect applies to which type of goods?",
                options: ["Cheap goods", "Luxury/prestige goods", "Necessities", "Free goods"],
                correct: 1
            },
            {
                question: "Price Elasticity of Demand measures:",
                options: ["Supply sensitivity", "Demand sensitivity to price", "Income changes", "Marketing effectiveness"],
                correct: 1
            },
            {
                question: "Which forecasting method uses intuition and experience?",
                options: ["Quantitative", "Qualitative", "AI-based", "Regression"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The _______ Effect means people demand more when price rises (luxury goods).",
                answer: "Veblen",
                hint: "Named after economist Thorstein..."
            },
            {
                sentence: "Price and tourism demand have an _______ relationship.",
                answer: "inverse",
                hint: "Opposite of direct..."
            }
        ],

        learn: {
            title: "Tourism Demand",
            content: `
                <h3>Understanding Demand</h3>
                <p><strong>Tourism Demand:</strong> The ability of consumers to buy different amounts at different prices.</p>

                <h4>Law of Demand:</h4>
                <div class="formula-box">
                    <p>Price ↑ = Demand ↓<br>Price ↓ = Demand ↑<br>(Inverse relationship)</p>
                </div>

                <h4>Special Demand Effects:</h4>
                <ul>
                    <li><strong>Bandwagon:</strong> Buy because others buy (fashion)</li>
                    <li><strong>Snob:</strong> Buy LESS when others buy (exclusivity)</li>
                    <li><strong>Veblen:</strong> Buy MORE when price rises (prestige)</li>
                </ul>

                <h4>Elasticity Formulas:</h4>
                <div class="formula-box">
                    <p><strong>Price Elasticity:</strong> % Change Qty / % Change Price<br>
                    <strong>Income Elasticity:</strong> % Change Qty / % Change Income<br>
                    <strong>Cross-price:</strong> % Change Qty A / % Change Price B</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Forecasting Methods</h4>
                    <p>1. Qualitative (experience)<br>2. Quantitative (math)<br>3. AI (bridge)</p>
                </div>
            `
        }
    },

    // ========== UNITS 4–5: TOURISM SUPPLY & COSTS ==========
    supply: {
        name: "Tourism Supply & Costs",
        icon: "fa-industry",
        color: "#f59e0b",

        flashcards: [
            {
                question: "What are the 3 basic forms of inputs into tourism supply?",
                answer: "1. Natural resources\n2. Human resources\n3. Human-made resources",
                explanation: "Three categories of production inputs."
            },
            {
                question: "What is the difference between Variable and Fixed inputs?",
                answer: "Variable: Can be changed at short notice\nFixed: Cannot be easily adjusted",
                explanation: "Fixed costs stay the same regardless of output."
            },
            {
                question: "What are Explicit Costs?",
                answer: "Direct payments made by firms to outside suppliers of inputs",
                explanation: "Actual money paid out - wages, rent, materials."
            },
            {
                question: "What are Implicit Costs?",
                answer: "Opportunity costs that firms face in the use of their own resources",
                explanation: "What you give up by using resources one way instead of another."
            },
            {
                question: "What is the Total Cost formula?",
                answer: "TC = FC + VC\n(Total Cost = Fixed Cost + Variable Cost)",
                explanation: "Basic cost equation in economics."
            },
            {
                question: "What is Economy of Scale?",
                answer: "A given percentage increase in all inputs results in a LARGER percentage increase in output",
                explanation: "Producing more = lower cost per unit."
            },
            {
                question: "What is Diseconomy of Scale?",
                answer: "A given percentage increase in all inputs leads to a SMALLER percentage increase in output",
                explanation: "Getting too big = inefficiency."
            },
            {
                question: "What is a Supply Chain?",
                answer: "The network of organisations, people, activities, information and resources involved in moving a product from supplier to customer",
                explanation: "Everything involved in getting products to consumers."
            }
        ],

        quiz: [
            {
                question: "Which is NOT a basic form of tourism supply input?",
                options: ["Natural resources", "Human resources", "Financial resources", "Human-made resources"],
                correct: 2
            },
            {
                question: "Explicit costs are:",
                options: ["Opportunity costs", "Direct payments to suppliers", "Hidden costs", "Future costs"],
                correct: 1
            },
            {
                question: "Total Cost equals:",
                options: ["FC - VC", "FC + VC", "FC × VC", "FC / VC"],
                correct: 1
            },
            {
                question: "Economy of scale means larger inputs result in:",
                options: ["Smaller output increase", "Larger output increase", "Same output", "No change"],
                correct: 1
            },
            {
                question: "Variable inputs can be:",
                options: ["Never changed", "Changed at short notice", "Changed only annually", "Changed by government"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "TC = FC + _______ (Total Cost formula).",
                answer: "VC",
                hint: "Variable..."
            },
            {
                sentence: "_______ costs are direct payments to outside suppliers.",
                answer: "Explicit",
                hint: "Opposite of implicit..."
            }
        ],

        learn: {
            title: "Supply and Costs",
            content: `
                <h3>Tourism Supply Inputs</h3>
                <ul>
                    <li><strong>Natural resources</strong></li>
                    <li><strong>Human resources</strong></li>
                    <li><strong>Human-made resources</strong></li>
                </ul>

                <h4>Types of Inputs:</h4>
                <ul>
                    <li><strong>Variable:</strong> Can change at short notice</li>
                    <li><strong>Fixed:</strong> Cannot be easily adjusted</li>
                </ul>

                <h4>Production Costs:</h4>
                <ul>
                    <li><strong>Explicit:</strong> Direct payments to suppliers</li>
                    <li><strong>Implicit:</strong> Opportunity costs</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-calculator"></i> Cost Formulas</h4>
                    <p>TC = FC + VC<br>
                    AC = TC / Q<br>
                    AFC = FC / Q<br>
                    AVC = VC / Q<br>
                    MC = dTC / dQ</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Scale Effects</h4>
                    <p><strong>Economy of scale:</strong> Bigger = more efficient<br>
                    <strong>Diseconomy of scale:</strong> Too big = inefficient</p>
                </div>
            `
        }
    },

    // ========== UNIT 6: MARKET STRUCTURE ==========
    marketStructure: {
        name: "Market Structure",
        icon: "fa-building",
        color: "#f97316",

        flashcards: [
            {
                question: "What are the 4 types of market structure?",
                answer: "1. Perfect competition (many buyers/sellers)\n2. Monopolistic competition (many, differentiated)\n3. Oligopoly (few firms dominate)\n4. Monopoly (one seller)",
                explanation: "Four market structures from most to least competitive."
            },
            {
                question: "What are the 7 major determinants of market structure?",
                answer: "1. Number of sellers\n2. Number of buyers\n3. Nature of goods/services\n4. Entry/exit barriers\n5. Information about conditions\n6. Economies of scale\n7. Product differentiation",
                explanation: "Seven factors that determine market structure."
            },
            {
                question: "What are the 3 competitive strategies?",
                answer: "1. Cost leadership (lowest costs)\n2. Product differentiation (better product)\n3. Focus (specific segment/area)",
                explanation: "Three ways firms compete in markets."
            },
            {
                question: "What does market structure affect?",
                answer: "• The firm's conduct (decision-making)\n• The firm's performance (profit potential)",
                explanation: "Structure affects how firms behave and perform."
            },
            {
                question: "What are 5 words associated with 'markets'?",
                answer: "Revenue, Costs, Consumer tastes, Technology, Stocks",
                explanation: "Five key concepts related to markets."
            }
        ],

        quiz: [
            {
                question: "An oligopoly is characterized by:",
                options: ["Many sellers", "One seller", "Few dominant firms", "No sellers"],
                correct: 2
            },
            {
                question: "Cost leadership strategy means:",
                options: ["Best quality", "Lowest costs", "Niche market", "Most advertising"],
                correct: 1
            },
            {
                question: "How many major determinants of market structure?",
                options: ["3", "5", "7", "9"],
                correct: 2
            },
            {
                question: "A monopoly has:",
                options: ["Many sellers", "Two sellers", "One seller", "No sellers"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                sentence: "An _______ is when a few firms dominate the market.",
                answer: "oligopoly",
                hint: "Oligo = few..."
            },
            {
                sentence: "The 3 competitive strategies are: Cost leadership, Product differentiation, and _______.",
                answer: "Focus",
                hint: "Concentrate on a specific area..."
            }
        ],

        learn: {
            title: "Market Structure",
            content: `
                <h3>4 Types of Market Structure</h3>
                <ol>
                    <li><strong>Perfect competition:</strong> Many buyers and sellers</li>
                    <li><strong>Monopolistic competition:</strong> Many sellers, differentiated products</li>
                    <li><strong>Oligopoly:</strong> Few firms dominate</li>
                    <li><strong>Monopoly:</strong> One seller only</li>
                </ol>

                <h4>7 Determinants of Structure:</h4>
                <ul>
                    <li>Number of sellers/buyers</li>
                    <li>Nature of goods/services</li>
                    <li>Entry/exit barriers</li>
                    <li>Market information</li>
                    <li>Economies of scale</li>
                    <li>Product differentiation</li>
                </ul>

                <div class="formula-box">
                    <h4><i class="fas fa-chess"></i> 3 Competitive Strategies</h4>
                    <p><strong>Cost leadership:</strong> Lowest costs<br>
                    <strong>Differentiation:</strong> Better product<br>
                    <strong>Focus:</strong> Specific segment</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> 5 Market Words</h4>
                    <p>Revenue • Costs • Consumer tastes • Technology • Stocks</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.te2M1 = te2M1; }
if (typeof module !== "undefined" && module.exports) { module.exports = te2M1; }
