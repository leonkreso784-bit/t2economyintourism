// ===== MARKETING - FIRST MIDTERM =====
// Source basis: 6 presentation files from /Documentos/marketing.

const marketingData = {
    marketingConcept: {
        id: "13q55a",
        name: "Marketing Concept",
        icon: "fa-bullseye",
        color: "#ec4899",

        flashcards: [
            {
                id: "6jq7nz",
                question: "What is the core definition of marketing in a modern business concept?",
                answer: "Marketing is creating and exchanging value by understanding customer needs and delivering offerings that satisfy those needs profitably.",
                explanation: "Modern marketing starts from value, not only selling."
            },
            {
                id: "9vzrcz",
                question: "How did business concepts evolve historically?",
                answer: "From production concept to selling concept, then marketing concept, and finally relationship/holistic marketing.",
                explanation: "Each stage reflects increasing customer orientation."
            },
            {
                id: "1rk6il",
                question: "What is the production concept?",
                answer: "Focus on production efficiency and low costs: make products and expect people to buy them.",
                explanation: "Works when demand exceeds supply."
            },
            {
                id: "j8itbl",
                question: "What is the selling concept?",
                answer: "Focus on aggressive promotion and sales volume: sell what the company already has.",
                explanation: "Product-push approach, not customer-pull."
            },
            {
                id: "79z3p1",
                question: "What is the marketing concept?",
                answer: "Find out what customers need first, then design and deliver the right offering better than competitors.",
                explanation: "Customer needs drive strategy and operations."
            },
            {
                id: "pxy6ey",
                question: "What is holistic marketing?",
                answer: "An integrated perspective connecting relationship marketing, internal marketing, integrated marketing, and performance marketing.",
                explanation: "Everything in business affects marketing outcomes."
            },
            {
                id: "g7514t",
                question: "What is relationship marketing in practical terms?",
                answer: "Building long-term cooperation with consumers, suppliers, distributors, and other market actors to create durable value.",
                explanation: "It goes beyond one-time transactions."
            },
            {
                id: "m12itf",
                question: "Why did modern firms move from mass production logic to marketing logic?",
                answer: "Because markets became competitive, customers became more informed, and value differentiation became more important than simple output volume.",
                explanation: "Competition shifted the source of advantage."
            }
        ],

        quiz: [
            {
                id: "do7dbe",
                question: "The marketing concept starts with:",
                options: ["Production capacity", "Customer needs", "Advertising budget", "Sales quotas"],
                correct: 1
            },
            {
                id: "pwu6zi",
                question: "The selling concept primarily emphasizes:",
                options: ["Relationship building", "Aggressive sales and promotion", "Sustainability first", "Customer co-creation"],
                correct: 1
            },
            {
                id: "vc5arg",
                question: "Holistic marketing includes all EXCEPT:",
                options: ["Integrated marketing", "Internal marketing", "Relationship marketing", "Single-function marketing"],
                correct: 3
            },
            {
                id: "1kh6ic",
                question: "The production concept is strongest when:",
                options: ["Demand is weak and fragmented", "Demand exceeds supply", "Consumers compare many alternatives", "Brand loyalty is high"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "elrd18",
                sentence: "Modern marketing is about creating and exchanging _______.",
                answer: "value",
                hint: "Utility for customers..."
            },
            {
                id: "emuxh6",
                sentence: "The marketing concept begins with understanding customer _______.",
                answer: "needs",
                hint: "Needs and wants..."
            },
            {
                id: "egeeni",
                sentence: "The selling concept focuses on maximizing sales _______.",
                answer: "volume",
                hint: "Quantity sold..."
            },
            {
                id: "hc9z1t",
                sentence: "Holistic marketing implies an _______ perspective across functions.",
                answer: "integrated",
                hint: "Not fragmented..."
            }
        ],

        learn: {
            id: "4pfs2o",
            title: "Unit 1 - Marketing as a Modern Business Concept",
            content: `
                <h3>1) Why Marketing Became a Core Business Logic</h3>
                <p>In modern competition, firms no longer win only with production capacity. They win by understanding who the customer is, what problem they solve, and why the offering is superior to alternatives.</p>

                <h3>2) Evolution of Business Concepts</h3>
                <ul>
                    <li><strong>Production concept:</strong> make efficiently and lower costs</li>
                    <li><strong>Selling concept:</strong> push existing products via promotion</li>
                    <li><strong>Marketing concept:</strong> start from customer needs and wants</li>
                    <li><strong>Relationship/Holistic:</strong> manage networks and integrated value creation</li>
                </ul>

                <div class="formula-box">
                    <p><strong>Marketing concept:</strong> Understand needs -> design value -> deliver better than competition</p>
                </div>

                <h3>3) Strategic Meaning of Marketing Concept</h3>
                <ul>
                    <li>Customer value is defined before product design</li>
                    <li>Competitive advantage comes from better fit, not only lower price</li>
                    <li>Profit is achieved by satisfying target customers efficiently</li>
                </ul>

                <h3>4) Marketing Mix as Execution System</h3>
                <p>Strategy is implemented through the marketing mix: <strong>product, price, distribution, promotion</strong>.</p>
                <ul>
                    <li>Product defines utility and differentiation</li>
                    <li>Price defines value-for-money perception</li>
                    <li>Distribution defines accessibility and convenience</li>
                    <li>Promotion defines communication and persuasion</li>
                </ul>

                <h3>5) Relationship and Holistic Marketing</h3>
                <div class="example-box">
                    <p><strong>Relationship marketing:</strong> include suppliers, distributors, and consumers as partners in value delivery.</p>
                    <p><strong>Holistic marketing:</strong> all business functions influence market outcomes.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Prepare clear differences between production, selling, marketing, and holistic concepts, plus one practical example for each.</p>
                </div>
            `
        }
    },

    marketingEnvironment: {
        id: "ra7tyg",
        name: "Marketing Environment",
        icon: "fa-globe-europe",
        color: "#0ea5e9",

        flashcards: [
            {
                id: "09ii6o",
                question: "What is the difference between macro and micro marketing environment?",
                answer: "Macro factors are indirect and less controllable (PESTLE), while micro factors are direct actors close to the company (consumers, competitors, suppliers, distributors).",
                explanation: "Managers monitor macro and manage micro relationships."
            },
            {
                id: "so6zuv",
                question: "What does PESTLE stand for?",
                answer: "Political, Economic, Social, Technological, Legal, Environmental factors.",
                explanation: "Framework for analyzing indirect environmental influences."
            },
            {
                id: "zx7i30",
                question: "How do economic forces affect marketing decisions?",
                answer: "Business cycle, inflation, unemployment, and income levels affect purchasing power, demand, and pricing strategy.",
                explanation: "Demand is strongly linked to economic context."
            },
            {
                id: "yws3or",
                question: "Why are social and cultural forces important?",
                answer: "Values, lifestyles, social roles, and attitudes influence what people buy, where they buy, and how they evaluate brands.",
                explanation: "Consumer meaning shapes market behavior."
            },
            {
                id: "4lzgdi",
                question: "What is marketing intelligence?",
                answer: "Continuous collection and analysis of market data from external and internal sources to support better decisions.",
                explanation: "Key sources include social media, search trends, internal records, and industry signals."
            },
            {
                id: "lino3u",
                question: "Why must firms react to macroenvironmental factors even if they cannot control them?",
                answer: "Because macro forces shape demand, costs, regulation, and customer behavior. Ignoring them creates strategic risk.",
                explanation: "Adaptation is mandatory when control is impossible."
            },
            {
                id: "wjsh64",
                question: "What is the role of legal and environmental factors in marketing decisions?",
                answer: "They set boundaries for acceptable market behavior, compliance obligations, and sustainability expectations that affect product, communication, and operations.",
                explanation: "Legality and sustainability are strategic constraints and opportunities."
            }
        ],

        quiz: [
            {
                id: "peej08",
                question: "Which is a macroenvironment factor?",
                options: ["Suppliers", "Distributors", "Technological change", "Competitors"],
                correct: 2
            },
            {
                id: "11j2id",
                question: "PESTLE includes all EXCEPT:",
                options: ["Political", "Psychological", "Economic", "Environmental"],
                correct: 1
            },
            {
                id: "ncwpcd",
                question: "Consumers and competitors belong to:",
                options: ["Microenvironment", "Macroeconomics", "Internal accounting", "Financial reporting"],
                correct: 0
            },
            {
                id: "xdjg4s",
                question: "Which statement is true?",
                options: ["Macro factors are directly controllable", "Micro factors are always uncontrollable", "Macro factors require monitoring and strategic response", "PESTLE is a pricing model"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "7ktg4y",
                sentence: "PESTLE analysis is used for _______ environmental factors.",
                answer: "macro",
                hint: "Indirect level..."
            },
            {
                id: "h439b6",
                sentence: "Consumers, suppliers and distributors are part of the _______ environment.",
                answer: "micro",
                hint: "Direct actors..."
            },
            {
                id: "0fo48m",
                sentence: "Marketing _______ helps managers make data-informed decisions.",
                answer: "intelligence",
                hint: "Insight system..."
            },
            {
                id: "2dpuhk",
                sentence: "Political, economic, social, technological, legal and environmental factors are summarized as _______.",
                answer: "PESTLE",
                hint: "Six-letter framework..."
            }
        ],

        learn: {
            id: "03824y",
            title: "Unit 2 - The Marketing Environment",
            content: `
                <h3>1) Marketing Environment as Decision Context</h3>
                <p>Every marketing decision is made inside an environment the firm partly controls (micro) and partly cannot control (macro).</p>

                <h3>2) Macro vs Micro Influences</h3>
                <div class="formula-box">
                    <p><strong>Macro (indirect):</strong> PESTLE</p>
                    <p><strong>Micro (direct):</strong> consumers, competitors, suppliers, distributors</p>
                </div>

                <h4>Why environment analysis matters</h4>
                <ul>
                    <li>Detect opportunities and threats early</li>
                    <li>Adjust marketing mix to external constraints</li>
                    <li>Reduce strategic surprises</li>
                </ul>

                <h3>3) PESTLE in Practice</h3>
                <ul>
                    <li><strong>Political:</strong> policy support, trade measures, institutional stability</li>
                    <li><strong>Economic:</strong> inflation, income, unemployment, cycles</li>
                    <li><strong>Social:</strong> values, lifestyle, demographic shifts</li>
                    <li><strong>Technological:</strong> digital channels, automation, data tools</li>
                    <li><strong>Legal:</strong> compliance, consumer rights, market rules</li>
                    <li><strong>Environmental:</strong> sustainability pressure and regulation</li>
                </ul>

                <h3>4) Economic and Social Pressures</h3>
                <ul>
                    <li>Inflation and lower income reduce demand sensitivity</li>
                    <li>Lifestyle and value shifts change category preferences</li>
                    <li>Technology changes channel expectations and speed</li>
                </ul>

                <h3>5) Marketing Intelligence and Information System</h3>
                <div class="example-box">
                    <p>Good marketing intelligence combines internal records with external data from search, social media, platforms, and industry signals.</p>
                </div>
            `
        }
    },

    marketAndValueExchange: {
        id: "n6snme",
        name: "Market and Value Exchange",
        icon: "fa-exchange-alt",
        color: "#22c55e",

        flashcards: [
            {
                id: "7cfhsn",
                question: "What is a market in economic terms?",
                answer: "A market is an economic space where goods, services, and other transactions are exchanged between participants.",
                explanation: "Markets can be local, national, international, and digital."
            },
            {
                id: "uayv90",
                question: "What is value exchange?",
                answer: "A process where buyers and sellers exchange something of value, typically utility/satisfaction for money/time/commitment.",
                explanation: "Exchange is the core mechanism of marketing."
            },
            {
                id: "74z1ql",
                question: "What are key conditions for exchange?",
                answer: "At least two parties, value for each party, communication and delivery ability, freedom to accept/reject, and perceived benefit.",
                explanation: "Without these conditions, exchange fails."
            },
            {
                id: "flc111",
                question: "What are market discrepancies?",
                answer: "Differences between producers and buyers in space, time, information, value perception, ownership, quantity, and assortment.",
                explanation: "Marketing functions reduce these discrepancies."
            },
            {
                id: "6ywkkd",
                question: "Why are marketing functions necessary?",
                answer: "They bridge producer-consumer gaps and create utility for market participants.",
                explanation: "Utility is created through matching supply and demand conditions."
            },
            {
                id: "rgdx3p",
                question: "What is discrepancy of value in exchange?",
                answer: "Producers value offers through costs and target prices, while consumers value offers through perceived benefits and purchasing power.",
                explanation: "Value is not identical for both sides."
            },
            {
                id: "f94t3r",
                question: "What is discrepancy of ownership?",
                answer: "Producers own products before sale, while consumers seek ownership after purchase. Exchange legally transfers this ownership.",
                explanation: "Ownership transfer is central to market transaction structure."
            }
        ],

        quiz: [
            {
                id: "wdt22z",
                question: "Which is NOT a standard exchange condition?",
                options: ["Two parties", "Ability to communicate", "Mandatory purchase", "Perceived desirability"],
                correct: 2
            },
            {
                id: "8verkq",
                question: "Market discrepancy in information exists when:",
                options: ["Prices are low", "Buyers and sellers lack relevant knowledge about each other", "Demand is stable", "Products are digital"],
                correct: 1
            },
            {
                id: "lafq7y",
                question: "Temporal discrepancy refers to mismatch in:",
                options: ["Location", "Time of production and consumption", "Ownership rights", "Product color"],
                correct: 1
            },
            {
                id: "4yq8bj",
                question: "Quantity discrepancy appears because:",
                options: ["Consumers always buy in bulk", "Producers and consumers need identical quantities", "Production scale and consumer purchase units differ", "Only price differs"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "i9hdoa",
                sentence: "Exchange means getting something of _______ for something else of value.",
                answer: "value",
                hint: "Utility word..."
            },
            {
                id: "hhxste",
                sentence: "Spatial discrepancy is a mismatch in market _______.",
                answer: "location",
                hint: "Where buyers/sellers are..."
            },
            {
                id: "xc4k7t",
                sentence: "Marketing functions reduce market _______.",
                answer: "discrepancies",
                hint: "Gaps/mismatches..."
            },
            {
                id: "tlw0ix",
                sentence: "Temporal discrepancy is a mismatch in _______.",
                answer: "time",
                hint: "When supply and demand happen..."
            }
        ],

        learn: {
            id: "nsbeof",
            title: "Unit 3 - The Market and Market-Oriented Business",
            content: `
                <h3>1) Market as an Exchange Space</h3>
                <p>A market is the space where value exchange occurs through offers, demand, and transactions.</p>

                <h3>2) Value Exchange Logic</h3>
                <p>Markets work when both sides perceive value and can complete exchange under acceptable conditions.</p>

                <h4>Conditions for Exchange</h4>
                <ul>
                    <li>Two or more parties</li>
                    <li>Each side has something of value</li>
                    <li>Communication and delivery are possible</li>
                    <li>Acceptance/rejection is free</li>
                    <li>Exchange is desirable for both parties</li>
                </ul>

                <h3>3) Why Discrepancies Exist</h3>
                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Core Issue</h4>
                    <p>Producer logic and buyer logic often differ. Marketing exists to reconcile these differences.</p>
                </div>

                <h4>Main Discrepancy Types</h4>
                <ul>
                    <li>Spatial</li>
                    <li>Temporal</li>
                    <li>Information</li>
                    <li>Value perception</li>
                    <li>Ownership</li>
                    <li>Quantity and assortment</li>
                </ul>

                <h3>4) Utility Creation for Market Participants</h3>
                <ul>
                    <li><strong>Form utility:</strong> transforming input into useful offer</li>
                    <li><strong>Place utility:</strong> making offer available where needed</li>
                    <li><strong>Time utility:</strong> making offer available when needed</li>
                    <li><strong>Possession utility:</strong> enabling ownership/use transfer</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Be ready to explain each discrepancy with a practical hospitality or retail example.</p>
                </div>
            `
        }
    },

    segmentationTargetingPositioning: {
        id: "s8mbxn",
        name: "Segmentation and Positioning",
        icon: "fa-layer-group",
        color: "#8b5cf6",

        flashcards: [
            {
                id: "1p62hk",
                question: "What is market segmentation?",
                answer: "Strategic division of a heterogeneous market into homogeneous groups with similar needs and wants.",
                explanation: "Segmentation allows tailored value propositions."
            },
            {
                id: "8muaj0",
                question: "What are key segmentation advantages?",
                answer: "Better understanding of needs, more precise targeting, and more efficient use of marketing resources.",
                explanation: "Higher effectiveness and reduced waste."
            },
            {
                id: "5qda9r",
                question: "What are the three major market selection approaches?",
                answer: "Undifferentiated (mass), differentiated, and concentrated marketing.",
                explanation: "Approach depends on resources and strategy."
            },
            {
                id: "2ii44j",
                question: "What are common segmentation variables?",
                answer: "Geographic, demographic, psychographic, and behavioral variables.",
                explanation: "Combining variables gives more useful segments."
            },
            {
                id: "pxndcg",
                question: "What is positioning?",
                answer: "Designing the offer and brand image so the target segment perceives a clear, distinct value in its mind.",
                explanation: "Positioning defines competitive place in customer perception."
            },
            {
                id: "ou2gol",
                question: "What is segment evaluation about?",
                answer: "Assessing segment size, growth, accessibility, profitability, strategic fit, and competitive intensity before choosing targets.",
                explanation: "Not every segment is attractive or feasible."
            },
            {
                id: "bts3tw",
                question: "Why can concentrated marketing be powerful?",
                answer: "Because focused resources can create stronger relevance and differentiation in a chosen niche.",
                explanation: "Focus often beats spread resources in constrained firms."
            }
        ],

        quiz: [
            {
                id: "4eqhxf",
                question: "Segmentation is primarily used to:",
                options: ["Ignore customer differences", "Treat all customers identically", "Identify groups with similar needs", "Eliminate competition"],
                correct: 2
            },
            {
                id: "n7qf8d",
                question: "Concentrated marketing focuses on:",
                options: ["Entire market equally", "One selected segment", "Only price discounts", "Only online channels"],
                correct: 1
            },
            {
                id: "2t8z8o",
                question: "STP stands for:",
                options: ["Sales, Trade, Promotion", "Segmentation, Targeting, Positioning", "Strategy, Tactics, Planning", "Supply, Transport, Pricing"],
                correct: 1
            },
            {
                id: "4vf9de",
                question: "Which segmentation variable refers to loyalty and usage patterns?",
                options: ["Demographic", "Geographic", "Behavioral", "Legal"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "ghxlx3",
                sentence: "Market segmentation identifies market _______ and segment homogeneity.",
                answer: "heterogeneity",
                hint: "Differences across market..."
            },
            {
                id: "r028om",
                sentence: "After segmentation, firms choose a _______ market.",
                answer: "target",
                hint: "Selected segment..."
            },
            {
                id: "6nz3dh",
                sentence: "Positioning shapes consumer _______ of the brand.",
                answer: "perception",
                hint: "How people see it..."
            },
            {
                id: "l2cufx",
                sentence: "STP means segmentation, targeting and _______.",
                answer: "positioning",
                hint: "Third step..."
            }
        ],

        learn: {
            id: "lujl2d",
            title: "Unit 5 - Market Segmentation",
            content: `
                <h3>1) STP as Core Strategic Sequence</h3>
                <div class="formula-box">
                    <p><strong>Segmentation</strong> -> <strong>Targeting</strong> -> <strong>Positioning</strong></p>
                </div>

                <h4>Why segment?</h4>
                <ul>
                    <li>Markets are heterogeneous</li>
                    <li>Needs differ by customer groups</li>
                    <li>One offer cannot optimally satisfy everyone</li>
                </ul>

                <h3>2) Selection Approaches</h3>
                <ul>
                    <li><strong>Undifferentiated:</strong> one mix for broad market</li>
                    <li><strong>Differentiated:</strong> tailored mixes for multiple segments</li>
                    <li><strong>Concentrated:</strong> focus on one key segment</li>
                </ul>

                <h3>3) Segmentation Variables</h3>
                <ul>
                    <li><strong>Geographic:</strong> location, region, urban/rural patterns</li>
                    <li><strong>Demographic:</strong> age, income, education, family status</li>
                    <li><strong>Psychographic:</strong> lifestyle, values, personality</li>
                    <li><strong>Behavioral:</strong> usage, loyalty, benefits sought</li>
                </ul>

                <h3>4) Segment Evaluation and Target Selection</h3>
                <div class="example-box">
                    <p>Attractive segments are measurable, reachable, profitable, and aligned with firm capabilities.</p>
                </div>

                <h3>5) Positioning Discipline</h3>
                <p>Positioning defines what the brand should mean in the target segment's mind and how it differs from competitors.</p>
                <ul>
                    <li>Value proposition must be clear and relevant</li>
                    <li>Messaging must be consistent across channels</li>
                    <li>Operations must deliver the promised position</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Know segmentation variables and be able to justify which strategy fits a given case.</p>
                </div>
            `
        }
    },

    consumerBehaviourAndResearch: {
        id: "hsfn92",
        name: "Consumer Behaviour and Research",
        icon: "fa-user-check",
        color: "#f97316",

        flashcards: [
            {
                id: "k33nw4",
                question: "Who are B2C consumers and B2B consumers?",
                answer: "B2C consumers are individuals/households buying for personal use. B2B consumers buy for resale, production input, or operational use.",
                explanation: "Buying logic differs by market type."
            },
            {
                id: "x5mdtc",
                question: "What external factors influence B2C behaviour?",
                answer: "Economic conditions, culture, social groups, family roles/status, and market information.",
                explanation: "Context shapes purchase decisions."
            },
            {
                id: "p2xvv7",
                question: "What internal factors influence B2C behaviour?",
                answer: "Learning, personality, perception, attitudes, motivation, and beliefs.",
                explanation: "Internal psychology drives interpretation and choice."
            },
            {
                id: "d2hwt3",
                question: "What are the five steps of B2C buying decision process?",
                answer: "Problem recognition, information search, evaluation of alternatives, purchase decision, post-purchase evaluation.",
                explanation: "Standard consumer decision model."
            },
            {
                id: "hysgqx",
                question: "What is the objective of market research?",
                answer: "To gather relevant data about target customers and markets so firms can make better marketing decisions.",
                explanation: "Research reduces uncertainty and improves strategy quality."
            },
            {
                id: "xxfqtf",
                question: "What is the difference between market research and marketing research?",
                answer: "Market research focuses mainly on customers/target market, while marketing research has broader scope including product, price, distribution, promotion, branding, and performance.",
                explanation: "Marketing research is wider in scope."
            },
            {
                id: "qtveis",
                question: "What are core stages of market research process?",
                answer: "Problem definition, research approach, research design, fieldwork, data preparation/analysis, and reporting.",
                explanation: "A structured process prevents weak conclusions."
            },
            {
                id: "wlcr84",
                question: "What are common B2B buying center roles?",
                answer: "Initiator, influencer, buyer, decider, gatekeeper, and user.",
                explanation: "B2B decisions are usually multi-person and role-based."
            },
            {
                id: "8jpdyx",
                question: "What is the practical difference between qualitative and quantitative research?",
                answer: "Qualitative explores meanings, motives, and depth; quantitative measures patterns, frequencies, and statistical relationships.",
                explanation: "Methods answer different question types."
            }
        ],

        quiz: [
            {
                id: "vsbh87",
                question: "The first stage in consumer buying process is:",
                options: ["Purchase", "Problem recognition", "Post-purchase evaluation", "Alternative evaluation"],
                correct: 1
            },
            {
                id: "6k962n",
                question: "B2B buying center may include:",
                options: ["Only final user", "Initiator, influencer, buyer, decider, gatekeeper, users", "Only procurement manager", "Only supplier"],
                correct: 1
            },
            {
                id: "l7ji0v",
                question: "Market research process usually starts with:",
                options: ["Advertising campaign", "Problem definition", "Fieldwork", "Data visualization"],
                correct: 1
            },
            {
                id: "jstqmx",
                question: "Qualitative and quantitative methods are examples of:",
                options: ["Pricing models", "Research approaches", "Distribution channels", "Consumer segments"],
                correct: 1
            },
            {
                id: "53qhq7",
                question: "Which sequence is correct in B2C buying process?",
                options: ["Purchase -> need recognition -> evaluation", "Need recognition -> search -> evaluation -> purchase -> post-purchase", "Evaluation -> search -> purchase -> need", "Search -> post-purchase -> purchase"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "o278zc",
                sentence: "B2C buyers are final _______ consumers.",
                answer: "end",
                hint: "Opposite of business market..."
            },
            {
                id: "9kx3zs",
                sentence: "In B2B, a _______ controls the flow of information in buying center.",
                answer: "gatekeeper",
                hint: "Access controller role..."
            },
            {
                id: "3h0hjm",
                sentence: "Market research can use qualitative, quantitative, or _______ methods.",
                answer: "mixed",
                hint: "Combination approach..."
            },
            {
                id: "s1hzrd",
                sentence: "In B2B buying center, the _______ makes the final purchase decision.",
                answer: "decider",
                hint: "Final authority role..."
            }
        ],

        learn: {
            id: "623hmm",
            title: "Unit 6 + Market Research - Consumer Decisions and Evidence",
            content: `
                <h3>1) B2C vs B2B Consumer Logic</h3>
                <ul>
                    <li><strong>B2C:</strong> personal/household benefit and emotional factors</li>
                    <li><strong>B2B:</strong> organizational criteria, process discipline, multiple decision roles</li>
                </ul>

                <h3>2) B2C Behavioural Factors</h3>
                <ul>
                    <li><strong>External:</strong> economy, culture, social groups, family, offers</li>
                    <li><strong>Internal:</strong> motivation, learning, attitudes, perception, personality</li>
                </ul>

                <h4>B2C buying process</h4>
                <ol>
                    <li>Problem recognition</li>
                    <li>Information search</li>
                    <li>Alternative evaluation</li>
                    <li>Purchase decision</li>
                    <li>Post-purchase reaction</li>
                </ol>

                <h3>3) B2B Buying Process and Roles</h3>
                <ul>
                    <li>Need/problem recognition</li>
                    <li>Specification and supplier search</li>
                    <li>Evaluation of alternatives</li>
                    <li>Selection and purchase</li>
                    <li>Post-purchase evaluation</li>
                </ul>
                <p>Typical roles: initiator, influencer, buyer, decider, gatekeeper, user.</p>

                <h3>4) Market Research Essentials</h3>
                <div class="formula-box">
                    <p><strong>Goal:</strong> better decisions through relevant market evidence</p>
                </div>
                <ul>
                    <li>Clarify objective and problem</li>
                    <li>Choose method and data sources</li>
                    <li>Collect, analyze, and report actionable findings</li>
                </ul>

                <h4>Methodological approaches</h4>
                <ul>
                    <li><strong>Qualitative:</strong> interviews, focus groups, deep understanding</li>
                    <li><strong>Quantitative:</strong> surveys, measurement, statistics</li>
                    <li><strong>Mixed methods:</strong> combine depth and measurement</li>
                </ul>

                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Common Mistake</h4>
                    <p>Jumping to data collection before clearly defining the business problem leads to weak conclusions.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Be able to compare B2C and B2B buying behavior and explain full market research process stages.</p>
                </div>
            `
        }
    },

    product: {
        id: "ftyl2k",
        name: "The Product",
        icon: "fa-box-open",
        color: "#8b5cf6",

        flashcards: [
            {
                id: "y4s3dr",
                question: "What is a product in marketing (total product concept)?",
                answer: "An object of exchange on the market that resolves a problem and provides utility (value) for the consumer. The total product concept is the totality of tangible and intangible attributes a consumer gains by buying it.",
                explanation: "Product is the primary marketing-mix element on which the other elements are built."
            },
            {
                id: "axlvdb",
                question: "What are the two dimensions of product value?",
                answer: "The primary dimension (the core utility that satisfies the need or want) and the auxiliary dimension (design, quality, brand, packaging, repair, warranty, delivery).",
                explanation: "Auxiliary attributes differentiate competing products."
            },
            {
                id: "mcrmhb",
                question: "How are B2C (consumer) products classified?",
                answer: "Convenience products (staple, impulse, emergency), shopping products (bought occasionally, need more information), and specialty products (special characteristics/brands; no substitutes accepted).",
                explanation: "Classification reflects buying effort and frequency."
            },
            {
                id: "51bviz",
                question: "How are B2B (business) products classified?",
                answer: "Raw materials, manufacturing materials and parts, capital goods, accessory equipment, consumable supplies, and services.",
                explanation: "Based on their role in production and their value."
            },
            {
                id: "ux3i6r",
                question: "What four characteristics describe a product programme (mix)?",
                answer: "Width (number of product lines), depth (products within each line), length (total products across all lines), and consistency (how closely related the lines are).",
                explanation: "Describes the breadth of a company's offering."
            },
            {
                id: "iylr6o",
                question: "What are the elements of a product, and how do brand name, brand mark and trademark differ?",
                answer: "Elements: attributes, brand, packaging, label, support. Brand name = the pronounceable part; brand mark = a symbol that cannot be expressed in words; trademark = a brand (or part) that is registered and legally protected.",
                explanation: "Brands can be manufacturer, private, or generic."
            },
            {
                id: "a3vlyo",
                question: "What are the steps of the new product development process?",
                answer: "Idea generation, idea screening, product concept development, business analysis, product development, test marketing, and commercialization.",
                explanation: "Many ideas terminate at the product-development stage."
            },
            {
                id: "ji1oso",
                question: "What are the four product life-cycle phases and the diffusion adopter groups?",
                answer: "Phases: introduction, growth, maturity, decline. Adopters: innovators (2.5%), early adopters (13.5%), early majority (34%), late majority (34%), laggards (16%).",
                explanation: "Marketing responses (product, price, promotion, distribution) change in each phase."
            },
            {
                id: "pxgyqj",
                question: "What is a service and how does it differ from a physical product?",
                answer: "A service is a mainly intangible activity or benefit that does not result in ownership; it is produced and consumed simultaneously, cannot be stored, and the customer participates in delivery. Quality is judged by comparing perception with expectation. Services add 3 Ps: people, physical evidence, processes.",
                explanation: "Service quality: satisfaction = perception - expectation."
            }
        ],

        quiz: [
            {
                id: "0hgebo",
                question: "The primary marketing-mix element upon which the others are built is:",
                options: ["Price", "Promotion", "Product", "Distribution"],
                correct: 2
            },
            {
                id: "v3l6za",
                question: "Staple, impulse and emergency goods are subtypes of:",
                options: ["Specialty products", "Convenience products", "Capital goods", "Shopping products"],
                correct: 1
            },
            {
                id: "6lzn7g",
                question: "The new product development process begins with:",
                options: ["Business analysis", "Idea generation", "Test marketing", "Commercialization"],
                correct: 1
            },
            {
                id: "jl4rw5",
                question: "Which sequence of product life-cycle phases is correct?",
                options: ["Growth -> Introduction -> Maturity -> Decline", "Introduction -> Growth -> Maturity -> Decline", "Introduction -> Maturity -> Growth -> Decline", "Maturity -> Growth -> Introduction -> Decline"],
                correct: 1
            },
            {
                id: "naylqp",
                question: "In the diffusion process, the first 2.5% of adopters are called:",
                options: ["Early adopters", "Laggards", "Innovators", "Early majority"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "y45i8v",
                sentence: "The product is the primary element of the marketing _______ upon which other elements are built.",
                answer: "mix",
                hint: "The 4 Ps..."
            },
            {
                id: "cb3m72",
                sentence: "Convenience products include staple, impulse and _______ products.",
                answer: "emergency",
                hint: "Bought for an urgent need..."
            },
            {
                id: "rmfsjq",
                sentence: "The depth of a product programme is the number of products within each product _______.",
                answer: "line",
                hint: "A group of related products..."
            },
            {
                id: "hg1jzx",
                sentence: "In the product life cycle, the phase that comes after growth is _______.",
                answer: "maturity",
                hint: "Sales peak, many competitors..."
            }
        ],

        learn: {
            id: "vj2b6c",
            title: "Unit 7 - The Product",
            content: `
                <h3>1) Concept and Nature of a Product</h3>
                <p>A product is an <strong>object of exchange</strong> used to resolve a problem and meet a specific need or want. The <strong>total product concept</strong> is the totality of tangible and intangible attributes the consumer gains by buying it (a physical product, a service, or an idea).</p>
                <div class="formula-box">
                    <p><strong>Product value = primary dimension</strong> (core utility) <strong>+ auxiliary dimension</strong> (design, quality, brand, packaging, repair, warranty, delivery)</p>
                </div>

                <h3>2) Product Classification</h3>
                <ul>
                    <li><strong>B2C:</strong> convenience (staple, impulse, emergency), shopping, and specialty products.</li>
                    <li><strong>B2B:</strong> raw materials, manufacturing materials &amp; parts, capital goods, accessory equipment, consumable supplies, and services.</li>
                </ul>

                <h3>3) Product Programme</h3>
                <ul>
                    <li><strong>Width:</strong> number of product lines</li>
                    <li><strong>Depth:</strong> number of products within each line</li>
                    <li><strong>Length:</strong> total number of products across all lines</li>
                    <li><strong>Consistency:</strong> how related the lines are (end use, channels, price ranges)</li>
                </ul>

                <h3>4) Product Elements</h3>
                <ul>
                    <li><strong>Attributes:</strong> physical (size, weight, durability, quality, design) and non-physical (warranty, image, delivery, instructions)</li>
                    <li><strong>Brand:</strong> name, phrase, symbol or design that makes a product distinctive. <em>Brand name</em> = pronounceable part; <em>brand mark</em> = symbol that cannot be spoken; <em>trademark</em> = registered and legally protected.</li>
                    <li><strong>Packaging:</strong> protects the product, communicates messages, supports promotion</li>
                    <li><strong>Label:</strong> informs consumers; regulations require vital information</li>
                    <li><strong>Support:</strong> pre-sales and post-sales services</li>
                </ul>
                <div class="example-box">
                    <p><strong>Brand categories:</strong> manufacturer brand (owned by the producer), private brand (owned by wholesalers/retailers), generic brand (brandless, basic packaging, lower price).</p>
                </div>

                <h3>5) New Product Development Process</h3>
                <ul>
                    <li>Idea generation -> idea screening -> product concept development -> business analysis -> product development -> test marketing -> commercialization</li>
                </ul>
                <p>Many projects <strong>often terminate at the product-development stage</strong>; commercialization is the most difficult phase to finance.</p>

                <h3>6) Diffusion of Innovations</h3>
                <ul>
                    <li>Innovators 2.5% - younger, better educated, financially better off</li>
                    <li>Early adopters 13.5% - careerists, educated, middle class</li>
                    <li>Early majority 34% &middot; Late majority 34% &middot; Laggards 16% - conservative, older, traditional</li>
                </ul>

                <h3>7) Product Life Cycle and Marketing Responses</h3>
                <table>
                    <tr><th>Phase</th><th>Focus of marketing responses</th></tr>
                    <tr><td><strong>Introduction</strong></td><td>Make the product distinctive, encourage trials, recover development costs, build distribution</td></tr>
                    <tr><td><strong>Growth</strong></td><td>Differentiate, ensure repeat buys, expand channels, build brand loyalty</td></tr>
                    <tr><td><strong>Maturity</strong></td><td>Defend market share, modify products, flexible pricing, remind the market</td></tr>
                    <tr><td><strong>Decline</strong></td><td>Cut marketing costs, eliminate unprofitable products, keep loyal consumers, rationalize channels</td></tr>
                </table>

                <h3>8) Services</h3>
                <p>A service is a mainly <strong>intangible</strong> activity or benefit that does not result in ownership. Key differences from physical products:</p>
                <ul>
                    <li>Produced and consumed simultaneously; <strong>cannot be stored</strong></li>
                    <li>The customer <strong>participates</strong> in delivery (a partner in creating the service)</li>
                    <li>Goal is uniqueness, not uniformity; quality = perception vs expectation</li>
                </ul>
                <div class="formula-box">
                    <p><strong>Satisfaction = perception - expectation.</strong> Perception &ge; expectation -> satisfaction, recommendation, loyalty.</p>
                </div>
                <p>Services add <strong>3 extra Ps</strong>: <strong>people</strong>, <strong>physical evidence</strong>, and <strong>processes</strong>.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Know the total product concept, B2C/B2B classification, product programme dimensions, the 7-step NPD process, the 4 life-cycle phases with responses, and the specific characteristics of services.</p>
                </div>
            `
        }
    },

    price: {
        id: "ppmffd",
        name: "The Price",
        icon: "fa-tag",
        color: "#f59e0b",

        flashcards: [
            {
                id: "o69hu2",
                question: "What is price and why is it special in the marketing mix?",
                answer: "Price is the monetary expression that consumers pay for a product. It is the only marketing-mix element that generates revenue (the others create costs).",
                explanation: "It directly determines profit."
            },
            {
                id: "jbi8ur",
                question: "What are the objectives of pricing?",
                answer: "The primary objective is to make a profit; others include winning new markets and developing new products. Marketers may set low (penetration), moderate (competitive), or high prices.",
                explanation: "High prices fit offerings that clearly differ from competitors and are valued by consumers."
            },
            {
                id: "qmiuwb",
                question: "What internal factors influence price?",
                answer: "Business objectives, available resources and costs, and the other marketing-mix elements (e.g., a luxury product with exclusive distribution implies a higher price).",
                explanation: "Internal factors are controllable by the firm."
            },
            {
                id: "4ir0c5",
                question: "What is the difference between fixed and variable costs?",
                answer: "Fixed costs remain the same regardless of the volume of production; variable costs are tied to volume and increase proportionally with output.",
                explanation: "Cost structure sets the price floor."
            },
            {
                id: "jkqxvs",
                question: "What external factors influence price?",
                answer: "Consumers (demand and its elasticity), distribution (channel mark-ups), competition (market structure), and government policies (taxes, regulation, price control, trade agreements).",
                explanation: "External factors are monitored, not controlled."
            },
            {
                id: "avloi4",
                question: "How do distribution mark-ups build the retail price?",
                answer: "Cost price + manufacturer mark-up (10-15%) + wholesaler mark-up (20-40%) + retailer mark-up (40-100%) = retail price.",
                explanation: "Each channel member adds a margin."
            },
            {
                id: "z3sqx4",
                question: "Who sets the price in different market structures?",
                answer: "Perfectly competitive market - the market; oligopoly - agreements between firms; monopoly - the monopolist; limited competitive market - product differentiation.",
                explanation: "Pricing freedom rises with differentiation and market power."
            },
            {
                id: "49dteh",
                question: "What are the main price strategies?",
                answer: "For existing products: keep or modify prices. Consumer-oriented strategies: penetration pricing (low), price skimming (high), psychological pricing (seemingly lower), and value-based pricing (as expected).",
                explanation: "Strategy depends on segment price-sensitivity."
            },
            {
                id: "68ja9x",
                question: "What are the three groups of pricing methods?",
                answer: "Cost-based (average cost, mark-up, break-even point), demand-based (differential prices per segment), and competitor-based (price relative to rivals).",
                explanation: "The break-even point method sets a price that yields a target profit."
            }
        ],

        quiz: [
            {
                id: "i5y944",
                question: "The only marketing-mix element that generates revenue is:",
                options: ["Product", "Promotion", "Price", "Distribution"],
                correct: 2
            },
            {
                id: "salsgt",
                question: "Fixed costs are costs that:",
                options: ["Increase proportionally with output", "Remain the same regardless of production volume", "Occur only in services", "Are set by the government"],
                correct: 1
            },
            {
                id: "1f3mqk",
                question: "Setting a low initial price to quickly win price-sensitive buyers is:",
                options: ["Price skimming", "Penetration pricing", "Psychological pricing", "Value-based pricing"],
                correct: 1
            },
            {
                id: "adbrxo",
                question: "Average cost, mark-up and break-even point are all examples of:",
                options: ["Demand-based methods", "Competitor-based methods", "Cost-based methods", "Price strategies"],
                correct: 2
            },
            {
                id: "6hmbur",
                question: "In a monopoly market, the price is set by:",
                options: ["The market", "Agreements between firms", "The monopolist", "Product differentiation"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "6hulce",
                sentence: "Price is the only marketing-mix element that generates _______.",
                answer: "revenue",
                hint: "Income from sales..."
            },
            {
                id: "xlealb",
                sentence: "_______ costs remain the same regardless of the volume of production.",
                answer: "fixed",
                hint: "Opposite of variable..."
            },
            {
                id: "jh0rx5",
                sentence: "Price _______ sets a high initial price to skim profit from price-insensitive buyers.",
                answer: "skimming",
                hint: "Cream off the top..."
            },
            {
                id: "0alj98",
                sentence: "The break-_______ point method sets a price that enables a certain profit to be made.",
                answer: "even",
                hint: "Total revenue = total costs..."
            }
        ],

        learn: {
            id: "xwk4t1",
            title: "Unit 8 - The Price",
            content: `
                <h3>1) Price Attributes and Objectives</h3>
                <p>Price is the <strong>monetary expression</strong> consumers pay for a product. It is the <strong>only marketing-mix element that generates revenue</strong> - all the others create costs.</p>
                <div class="formula-box">
                    <p><strong>Primary objective: make a profit.</strong> Also: win new markets, develop new products. Marketers set <em>low</em> (penetration), <em>moderate</em> (competitive), or <em>high</em> prices.</p>
                </div>

                <h3>2) Internal Factors</h3>
                <ul>
                    <li><strong>Business objectives</strong> (e.g., social responsibility -> recycled packaging -> higher price)</li>
                    <li><strong>Available resources and costs</strong> - fixed costs (independent of volume) vs variable costs (proportional to volume)</li>
                    <li><strong>Other marketing-mix elements</strong> (e.g., a luxury product -> exclusive distribution -> higher price)</li>
                </ul>

                <h3>3) External Factors</h3>
                <ul>
                    <li><strong>Consumers:</strong> demand and its elasticity (elastic vs inelastic demand; curve shifts)</li>
                    <li><strong>Distribution:</strong> mark-ups along the channel</li>
                    <li><strong>Competition:</strong> market structure</li>
                    <li><strong>Government policies:</strong> anti-monopoly laws, price control, taxes, trade agreements</li>
                </ul>
                <div class="example-box">
                    <p><strong>Channel mark-ups:</strong> cost price + manufacturer 10-15% + wholesaler 20-40% + retailer 40-100% = retail price.</p>
                </div>
                <table>
                    <tr><th>Market structure</th><th>Who sets the price?</th></tr>
                    <tr><td>Perfectly competitive (large, non-differentiated)</td><td>The market</td></tr>
                    <tr><td>Oligopoly (few, differentiated/substitutes)</td><td>Agreements</td></tr>
                    <tr><td>Monopoly (one, no substitutes)</td><td>The monopolist</td></tr>
                    <tr><td>Limited competitive (large, differentiated)</td><td>Product differentiation</td></tr>
                </table>

                <h3>4) Price Strategies</h3>
                <ul>
                    <li><strong>Existing products:</strong> keep existing levels or modify (reduce / increase)</li>
                    <li><strong>Penetration pricing:</strong> price below product value to win price-sensitive buyers quickly</li>
                    <li><strong>Price skimming:</strong> high price to skim profit from the price-insensitive segment</li>
                    <li><strong>Psychological pricing:</strong> price seemingly lower than it is (emotional decision)</li>
                    <li><strong>Value-based pricing:</strong> the highest price acceptable to the broad public</li>
                </ul>

                <h3>5) Pricing Methods</h3>
                <ul>
                    <li><strong>Cost-based:</strong>
                        <ul>
                            <li><em>Average cost method</em> - price from forecast average total cost per unit</li>
                            <li><em>Mark-up method</em> - add a percentage of cost or selling price to average total costs</li>
                            <li><em>Break-even point method</em> - set a price that enables a certain profit (total revenue = total costs)</li>
                        </ul>
                    </li>
                    <li><strong>Demand-based:</strong> differential prices for individual markets/segments</li>
                    <li><strong>Competitor-based:</strong> price relative to rivals (useful when products do not differ much); good for growing sales and market share</li>
                </ul>

                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Common Mistake</h4>
                    <p>Confusing strategies (penetration vs skimming) with methods (cost / demand / competitor-based). Strategy = the pricing intent; method = how the number is calculated.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Explain price attributes and objectives, internal vs external factors, the four price strategies, and the three groups of pricing methods (especially the three cost-based methods).</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.marketingData = marketingData; }
