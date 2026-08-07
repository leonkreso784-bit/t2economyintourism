// ===== E-BUSINESS — First Midterm (K1) =====
// Rebuilt 2026-06-13 from the 14 lecture PDFs (course "E-Business in Hospitality").
// K1 = Units 1-7: e-commerce context, tourism distribution chain, internet/www as business platform, relationships & cash flows (merchant/agent), computer graphics, platform economy.
// Schema: docs/architecture/CONTENT_SCHEMA.md (flashcards / quiz(correct=index) / fillBlanks / learn).

const ebusinessM1 = {

    // ========== CATEGORY 1: E-COMMERCE CONTEXT (Unit 1) ==========
    ecommerceContext: {
        id: "vj1lj8",
        name: "E-Commerce Context",
        icon: "fa-shopping-cart",
        color: "#f59e0b",
        
        flashcards: [
            {
                id: "hyt91z",
                question: "What is E-Commerce?",
                answer: "E-commerce refers to the buying and selling of goods or services via the internet, including the transfer of money and data needed to complete transactions.\n\n• Takes place online\n• Involves products, services, payments, and data\n• Also called electronic commerce or internet commerce",
                explanation: "The foundation of modern digital business."
            },
            {
                id: "81e613",
                question: "How has E-Commerce transformed the Hospitality Industry?",
                answer: "Main transformation areas:\n\n• Online platforms replaced phone/in-person bookings\n• Customer interaction moved to digital channels\n• Services became faster, more personalized, and global\n• Hotels and travel companies now depend on digital systems",
                explanation: "Traditionally, hospitality relied on face-to-face interaction."
            },
            {
                id: "xa9atw",
                question: "What are the benefits of Online Booking Systems?",
                answer: "Benefits for businesses:\n\n• Better booking management\n• Higher occupancy rates\n• Reduced manual work\n• Customers can reserve rooms anytime from anywhere",
                explanation: "Digital transformation in hospitality starts with booking systems."
            },
            {
                id: "22iooe",
                question: "What is Dynamic Pricing?",
                answer: "Prices change in real time depending on:\n\n• Demand\n• Seasonality\n• Competitor prices\n\nThis allows businesses to maximize revenue based on market conditions.",
                explanation: "AI and algorithms enable real-time price optimization."
            },
            {
                id: "ncq7l2",
                question: "How do Virtual Tours and AR enhance customer engagement?",
                answer: "Customers can explore hotels digitally before booking.\n\nExample: The Ritz-Carlton Bali offers a 360-degree virtual tour of rooms and facilities.\n\nBenefits:\n• Reduces uncertainty\n• Increases booking confidence",
                explanation: "Virtual reality creates immersive preview experiences."
            },
            {
                id: "milr8b",
                question: "What is the difference between Hotel E-Commerce and General E-Commerce?",
                answer: "HOTEL E-COMMERCE:\n• Focus: Accommodation and hospitality\n• Products: Hotel rooms, spa, restaurants\n• Platforms: Agoda, Expedia\n\nGENERAL E-COMMERCE:\n• Focus: Selling goods across many industries\n• Products: Electronics, clothing, groceries\n• Platforms: Amazon, eBay, Walmart\n\nKey difference: Hotel e-commerce is specialized, general is broad.",
                explanation: "Understanding the specialization of hotel digital commerce."
            },
            {
                id: "gr6kfl",
                question: "What are the 4 pillars of the Digital Future of Hospitality?",
                answer: "1. INNOVATION - Constant technological improvement\n2. CUSTOMER FOCUS - Personalized and seamless experiences\n3. GLOBAL EXPANSION - Borderless business opportunities\n4. SUSTAINABILITY - Eco-conscious solutions",
                explanation: "The main directions for hospitality digital transformation."
            },
            {
                id: "jjcwif",
                question: "What is B2C (Business to Consumer)?",
                answer: "B2C = Business sells directly to consumers\n\nExamples:\n• Amazon\n• Walmart\n• Online retail stores",
                explanation: "The most common e-commerce model."
            },
            {
                id: "btyhxy",
                question: "What is B2B (Business to Business)?",
                answer: "B2B = Businesses sell to other businesses\n\nExamples:\n• Manufacturers to wholesalers\n• Software providers to companies\n• Wholesale platforms",
                explanation: "Business-to-business transactions."
            },
            {
                id: "aois46",
                question: "What is D2C (Direct to Consumer)?",
                answer: "D2C = Brands sell directly to customers WITHOUT intermediaries\n\n• No retailer or wholesaler involved\n• Often supported by social media\n• Brand-owned websites\n\nExample: Nike selling directly through nike.com",
                explanation: "Cutting out the middleman."
            },
            {
                id: "8lvgci",
                question: "What is C2C (Consumer to Consumer)?",
                answer: "C2C = Consumers sell to other consumers\n\nExamples:\n• eBay\n• Etsy\n• Facebook Marketplace\n• Craigslist",
                explanation: "Peer-to-peer marketplace model."
            },
            {
                id: "gqm4bq",
                question: "What is C2B (Consumer to Business)?",
                answer: "C2B = Individuals offer products or services to companies\n\nExamples:\n• Influencers\n• Photographers\n• Freelancers\n• Stock photo contributors",
                explanation: "Reverse of traditional business model."
            },
            {
                id: "xovgo0",
                question: "What are B2G and C2G e-commerce models?",
                answer: "B2G (Business to Government), also called B2A:\n• Businesses sell goods/services to government entities\n• Example: contractors cleaning and maintaining public parks\n\nC2G (Consumer to Government), also called C2A:\n• Consumers provide feedback or transact with public agencies\n• Example: paying an electricity bill or taxes through a government website",
                explanation: "The two government-related models — completing all 7 business models from Unit 1."
            },
            {
                id: "bbj7ba",
                question: "What are Physical Goods, Digital Goods, and Services in E-Commerce?",
                answer: "PHYSICAL GOODS:\n• Tangible products with physical form\n• Need shipping\n\nDIGITAL GOODS:\n• Intangible products delivered electronically\n• E-books, software, music\n\nSERVICES:\n• Activities that deliver value\n• Consulting, design, bookings",
                explanation: "Three types of products sold online."
            }
        ],
        
        quiz: [
            {
                id: "c75hqa",
                question: "E-commerce involves all EXCEPT:",
                options: [
                    "Buying and selling online",
                    "Transfer of money and data",
                    "Physical store visits only",
                    "Internet transactions"
                ],
                correct: 2
            },
            {
                id: "u2z137",
                question: "Dynamic pricing depends on:",
                options: [
                    "Fixed government rates",
                    "Demand, seasonality, and competitor prices",
                    "Employee preferences",
                    "Random selection"
                ],
                correct: 1
            },
            {
                id: "l15cmz",
                question: "Which is an example of B2C e-commerce?",
                options: [
                    "Manufacturer to wholesaler",
                    "Amazon selling to consumers",
                    "Freelancer to company",
                    "Government to citizens"
                ],
                correct: 1
            },
            {
                id: "y3cdpw",
                question: "D2C (Direct to Consumer) means:",
                options: [
                    "Selling through retailers",
                    "Brands sell directly without intermediaries",
                    "Digital to consumer",
                    "Discount to consumer"
                ],
                correct: 1
            },
            {
                id: "chyl4t",
                question: "Virtual tours in hotels help to:",
                options: [
                    "Replace actual visits permanently",
                    "Reduce uncertainty and increase booking confidence",
                    "Decrease hotel revenue",
                    "Eliminate the need for websites"
                ],
                correct: 1
            },
            {
                id: "jajn3k",
                question: "C2C e-commerce examples include:",
                options: [
                    "Amazon and Walmart",
                    "eBay and Etsy",
                    "B2B platforms",
                    "Government services"
                ],
                correct: 1
            },
            {
                id: "22mrrw",
                question: "Paying taxes through a government website is an example of:",
                options: [
                    "B2C",
                    "C2G (Consumer to Government)",
                    "B2B",
                    "D2C"
                ],
                correct: 1
            },
            {
                id: "artxlk",
                question: "Which is NOT a pillar of digital future of hospitality?",
                options: [
                    "Innovation",
                    "Customer Focus",
                    "Manual Processing",
                    "Sustainability"
                ],
                correct: 2
            },
            {
                id: "869lm1",
                question: "Digital goods are:",
                options: [
                    "Physical products",
                    "Intangible products delivered electronically",
                    "Only physical books",
                    "Services"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                id: "uaek59",
                sentence: "E-commerce refers to buying and selling via the _______.",
                answer: "internet",
                hint: "Online network..."
            },
            {
                id: "isxbdq",
                sentence: "_______ pricing changes in real time based on demand.",
                answer: "Dynamic",
                hint: "Opposite of static..."
            },
            {
                id: "uwz41i",
                sentence: "B2C stands for Business to _______.",
                answer: "Consumer",
                hint: "End customer..."
            },
            {
                id: "sd5afn",
                sentence: "D2C means brands sell _______ to customers without intermediaries.",
                answer: "directly",
                hint: "Without middlemen..."
            },
            {
                id: "3wdbum",
                sentence: "The 4 pillars of hospitality's digital future include Innovation, Customer Focus, Global Expansion, and _______.",
                answer: "Sustainability",
                hint: "Eco-friendly..."
            }
        ],
        
        learn: {
            id: "96ohe4",
            title: "The Context of Modern E-Commerce",
            content: `
                <h3>What is E-Commerce?</h3>
                <div class="formula-box">
                    <strong>E-Commerce =</strong> Buying and selling goods/services via the internet<br>
                    Includes: Products + Services + Payments + Data
                </div>
                
                <h4>Digital Transformation in Hospitality</h4>
                <ul>
                    <li><strong>Online Booking:</strong> Reserve rooms anytime, anywhere</li>
                    <li><strong>Personalization:</strong> Customized experiences using data</li>
                    <li><strong>Dynamic Pricing:</strong> Real-time price changes</li>
                    <li><strong>Virtual Tours:</strong> 360° previews before booking</li>
                </ul>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> E-Commerce Business Models</h4>
                    <ul>
                        <li><strong>B2C:</strong> Business → Consumer (Amazon)</li>
                        <li><strong>B2B:</strong> Business → Business (Wholesale)</li>
                        <li><strong>C2C:</strong> Consumer → Consumer (eBay)</li>
                        <li><strong>D2C:</strong> Direct to Consumer (Brand websites)</li>
                        <li><strong>C2B:</strong> Consumer → Business (Freelancers)</li>
                    </ul>
                </div>
                
                <h4>4 Pillars of Digital Hospitality Future</h4>
                <div class="example-box">
                    <p>🚀 <strong>Innovation</strong> - Technology improvement</p>
                    <p>👤 <strong>Customer Focus</strong> - Personalized experiences</p>
                    <p>🌍 <strong>Global Expansion</strong> - Borderless business</p>
                    <p>🌱 <strong>Sustainability</strong> - Eco-conscious solutions</p>
                </div>
            `
        }
    },
    
    // ========== CATEGORY 2: TOURISM DISTRIBUTION CHAIN (Unit 2) ==========
    distributionChain: {
        id: "qsp48f",
        name: "Distribution Chain",
        icon: "fa-link",
        color: "#10b981",
        
        flashcards: [
            {
                id: "8j01zr",
                question: "What is the Tourism Distribution System?",
                answer: "The tourism distribution system explains how tourism products reach the customer.\n\nIt connects:\n• Primary suppliers\n• Intermediaries\n• Digital platforms\n• Final customers\n\nE-business platforms make this process faster, global, and automated.",
                explanation: "The pathway from supplier to traveler."
            },
            {
                id: "nz3xoq",
                question: "What is the difference between Tour Operator and Travel Agent?",
                answer: "TOUR OPERATOR:\n• Creates its own tourism product\n• Combines services into package trips\n• Acts as organizer or wholesaler\n\nTRAVEL AGENT:\n• Does NOT create products\n• Sells products created by others\n• Acts only as intermediary\n• Earns income through commission",
                explanation: "Tour operators produce, agents sell."
            },
            {
                id: "1pzi7j",
                question: "Who are the Primary Suppliers in tourism?",
                answer: "Primary suppliers create the core tourism product:\n\n• Accommodation providers (hotels)\n• Airlines\n• Transport companies\n• Cruise companies\n• Attractions and activities",
                explanation: "The original producers of tourism services."
            },
            {
                id: "suv2sg",
                question: "What are Wholesalers or Bedbanks?",
                answer: "Wholesalers/Bedbanks:\n\n• Buy services in bulk\n• Work with net rates\n• Focus on B2B relationships\n• Rarely sell directly to individuals\n• Platforms are often password-protected",
                explanation: "Bulk buyers in the tourism chain."
            },
            {
                id: "7jbfk3",
                question: "What is a Global Distribution System (GDS)?",
                answer: "A GDS is:\n• A global network\n• Connecting travel suppliers with travel agencies\n• Enabling automated bookings\n\nMain users:\n• Airlines\n• Hotels\n• Car rental companies\n\nExamples: Amadeus, Sabre, Travelport",
                explanation: "The backbone of travel bookings."
            },
            {
                id: "6nqae7",
                question: "What is a Property Management System (PMS)?",
                answer: "PMS or CRS (Central Reservation System):\n\n• Internal systems used by suppliers\n• Manage reservations, availability, and operations\n• Do NOT sell directly to customers\n• Connect to other platforms for distribution",
                explanation: "Hotel's internal operational software."
            },
            {
                id: "f2ghxq",
                question: "What is a Booking Engine?",
                answer: "A booking engine:\n\n• Allows online booking on the supplier's own website\n• Supports direct sales\n• Connects directly with PMS\n• Enables real-time availability",
                explanation: "The 'Book Now' functionality on websites."
            },
            {
                id: "uc76bm",
                question: "What is a Channel Manager?",
                answer: "A Channel Manager:\n\n• Manages room rates and availability\n• Synchronizes ALL sales channels in real time\n• Reduces overbooking risk\n• Modern versions often use AI",
                explanation: "Keeps all booking channels in sync."
            },
            {
                id: "z6jd8v",
                question: "What are Meta-Search Engines?",
                answer: "Meta-search engines:\n\n• Compare offers from multiple OTAs and supplier websites\n• Show prices side-by-side\n• Simplify customer decision-making\n\nExamples: Google Hotels, Trivago, Kayak",
                explanation: "Price comparison tools."
            },
            {
                id: "y7r2ri",
                question: "Are communication channels part of the distribution system?",
                answer: "NO! Communication channels are NOT part of the distribution system.\n\nThey include:\n• Media and social media\n• Blogs and forums\n• Email and telephone\n\nThey are:\n• Marketing tools\n• Promotional channels\n\nWhen primary suppliers use them directly = direct sales",
                explanation: "Important exam distinction!"
            },
            {
                id: "tjquuu",
                question: "What are Switch companies?",
                answer: "Switch companies provide the ELECTRONIC LINK between systems:\n\n• Created when a need surfaced to connect all the disparate CRS systems with the GDS\n• They sit between supplier-side software and global distribution\n\nThey belong to the supplier-side software companies (with PMS/CRS, booking engine, channel manager).",
                explanation: "The 'translators' between hotel systems and the GDS."
            },
            {
                id: "ip2pc7",
                question: "How does the online environment change the tourism business?",
                answer: "Key principle from the lecture:\n\n\"The online environment DOES NOT change the business itself, but only the way it is done.\"\n\nContext:\n• Tourism generates up to 10% of the world's GDP (often more in small nations)\n• The industry is globalized, with multinational and global companies\n• OTAs do the same job as traditional travel agents — only the environment differs",
                explanation: "Same business, different way of doing it — a favourite exam quote."
            }
        ],
        
        quiz: [
            {
                id: "regrkv",
                question: "A Tour Operator:",
                options: [
                    "Only sells products created by others",
                    "Creates its own tourism product",
                    "Works only online",
                    "Never deals with hotels"
                ],
                correct: 1
            },
            {
                id: "j2v40b",
                question: "A Travel Agent earns money mainly through:",
                options: [
                    "Creating products",
                    "Commission",
                    "Manufacturing",
                    "Government subsidies"
                ],
                correct: 1
            },
            {
                id: "oyo08b",
                question: "GDS stands for:",
                options: [
                    "General Data System",
                    "Global Distribution System",
                    "Guest Data Service",
                    "Government Digital Service"
                ],
                correct: 1
            },
            {
                id: "eip2kd",
                question: "A Channel Manager's main function is to:",
                options: [
                    "Create hotel rooms",
                    "Synchronize rates and availability across channels",
                    "Handle guest complaints",
                    "Design websites"
                ],
                correct: 1
            },
            {
                id: "cktdhv",
                question: "Meta-search engines like Trivago:",
                options: [
                    "Sell rooms directly",
                    "Compare prices from multiple sources",
                    "Create hotel packages",
                    "Manage hotel operations"
                ],
                correct: 1
            },
            {
                id: "gxp0su",
                question: "Communication channels are:",
                options: [
                    "Part of distribution system",
                    "Marketing and promotional tools",
                    "Primary suppliers",
                    "Tour operators"
                ],
                correct: 1
            },
            {
                id: "vrr9bx",
                question: "Primary suppliers in tourism include all EXCEPT:",
                options: [
                    "Hotels",
                    "Airlines",
                    "Travel agents",
                    "Attractions"
                ],
                correct: 2
            },
            {
                id: "yyg3u0",
                question: "Bedbanks focus mainly on:",
                options: [
                    "Individual travelers",
                    "B2B relationships",
                    "Social media",
                    "Government services"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                id: "kf7d81",
                sentence: "A _______ creates its own tourism product and combines services into packages.",
                answer: "Tour Operator",
                hint: "Organizer of trips..."
            },
            {
                id: "77bsox",
                sentence: "GDS stands for Global _______ System.",
                answer: "Distribution",
                hint: "Sharing across networks..."
            },
            {
                id: "4ump5m",
                sentence: "A Channel _______ synchronizes rates across all booking platforms.",
                answer: "Manager",
                hint: "One who manages..."
            },
            {
                id: "j7816e",
                sentence: "Travel agents earn income mainly through _______.",
                answer: "commission",
                hint: "Percentage of sales..."
            },
            {
                id: "jnchfu",
                sentence: "Communication channels are NOT part of the _______ system.",
                answer: "distribution",
                hint: "How products reach customers..."
            }
        ],
        
        learn: {
            id: "qnvh45",
            title: "Tourism Distribution Chain",
            content: `
                <h3>The Distribution System</h3>
                <div class="formula-box">
                    Primary Suppliers → Intermediaries → Digital Platforms → Customer
                </div>
                
                <h4>Tour Operator vs Travel Agent</h4>
                <div class="tip-box">
                    <h4><i class="fas fa-plane"></i> Key Difference</h4>
                    <p><strong>Tour Operator:</strong> CREATES products (packages)</p>
                    <p><strong>Travel Agent:</strong> SELLS products (earns commission)</p>
                </div>
                
                <h4>Key Systems</h4>
                <ul>
                    <li><strong>GDS:</strong> Global network connecting suppliers with agencies</li>
                    <li><strong>PMS:</strong> Internal hotel management system</li>
                    <li><strong>Channel Manager:</strong> Syncs availability across channels</li>
                    <li><strong>Meta-Search:</strong> Compares prices (Trivago, Kayak)</li>
                </ul>
                
                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Exam Alert!</h4>
                    <p>Communication channels (social media, email) are NOT part of the distribution system - they are marketing tools!</p>
                </div>
            `
        }
    },
    
    // ========== CATEGORY 3: INTERNET AS BUSINESS PLATFORM (Unit 3) ==========
    internetBusiness: {
        id: "bkob8o",
        name: "Internet & Business",
        icon: "fa-globe",
        color: "#6366f1",
        
        flashcards: [
            {
                id: "mfx992",
                question: "What are the key benefits of the Internet for businesses?",
                answer: "• Faster and cheaper communication\n• Easy access to information\n• Cost reduction in operations\n• Higher efficiency and productivity\n• Discovery of new business opportunities\n• Closer relationships with customers and suppliers",
                explanation: "The Internet transformed business operations."
            },
            {
                id: "7pacyd",
                question: "How did the Web revolutionize business activities?",
                answer: "1. E-COMMERCE - Online buying and selling\n2. DIGITAL MARKETING - Measurable, targeted promotion\n3. REMOTE WORK - Location-independent employment\n4. DATA ANALYTICS - Data-driven decision-making\n5. IMPROVED COMMUNICATION - Real-time global interaction",
                explanation: "Five key business transformations."
            },
            {
                id: "knvuye",
                question: "What is Web 1.0 (The Read-Only Web)?",
                answer: "Characteristics:\n• Static pages\n• No user interaction\n• Content created only by website owners\n\nUsers were PASSIVE readers.",
                explanation: "The first generation of the web."
            },
            {
                id: "va75or",
                question: "What is Web 2.0 (The Social Web)?",
                answer: "Characteristics:\n• User-generated content\n• Social media\n• Blogs, comments, tagging\n\nUsers became CONTENT CREATORS.",
                explanation: "The participatory web."
            },
            {
                id: "li5buj",
                question: "What is Web 3.0 (The Semantic Web)?",
                answer: "Characteristics:\n• Machine-readable data\n• Artificial intelligence and machine learning\n• Internet of Things\n• 3D graphics and virtual environments\n\nThe web starts to UNDERSTAND users.",
                explanation: "The intelligent web."
            },
            {
                id: "o4zkoz",
                question: "What is Web 4.0 (The Symbiotic Web)?",
                answer: "Characteristics:\n• Human-machine interaction\n• Advanced personalization\n• AI-driven experiences\n\nStill under development, no fixed definition.",
                explanation: "The future of the web."
            },
            {
                id: "ft0y58",
                question: "What is Web 5.0?",
                answer: "Web 5.0 = the (hypothetical) EMOTIONAL web:\n\n• Emotional understanding and empathetic interactions\n• Powered by Emotional AI\n• Accelerated future: VR, AI, blockchain and more\n\nEvolution summary: 1.0 read-only → 2.0 read-write/social → 3.0 machine-readable/semantic → 4.0 physical-digital fusion (IoT, AI) → 5.0 emotional understanding.",
                explanation: "The last column of the Web 1.0–5.0 comparison table from the lecture."
            },
            {
                id: "grm1ay",
                question: "What is HTTP?",
                answer: "HTTP = HyperText Transfer Protocol\n\nRules that computers use to communicate over the Internet for web pages.",
                explanation: "The protocol for web communication."
            },
            {
                id: "4c07ee",
                question: "What is DNS (Domain Name System)?",
                answer: "DNS translates domain names into IP addresses.\n\nExample:\n• You type: google.com\n• DNS translates to: 142.250.190.78\n• Your browser connects to that IP",
                explanation: "The internet's phonebook."
            },
            {
                id: "tgxepl",
                question: "What is the difference between .com and .edu domains?",
                answer: ".com = Commercial organizations\n.edu = Educational institutions\n\nOther examples:\n.org = Non-profit organizations\n.gov = Government\n.net = Network providers",
                explanation: "Domain extensions indicate organization type."
            }
        ],
        
        quiz: [
            {
                id: "23y9ke",
                question: "Web 1.0 is characterized by:",
                options: [
                    "User-generated content",
                    "Static pages with no interaction",
                    "AI and machine learning",
                    "Social media"
                ],
                correct: 1
            },
            {
                id: "wv95yc",
                question: "Web 2.0 is also called:",
                options: [
                    "The Read-Only Web",
                    "The Social Web",
                    "The Semantic Web",
                    "The Symbiotic Web"
                ],
                correct: 1
            },
            {
                id: "3bznwv",
                question: "Web 3.0 features include:",
                options: [
                    "Static pages only",
                    "No user interaction",
                    "AI, machine learning, and IoT",
                    "Only email communication"
                ],
                correct: 2
            },
            {
                id: "5vzlds",
                question: "DNS translates:",
                options: [
                    "Images to text",
                    "Domain names to IP addresses",
                    "Audio to video",
                    "Passwords to codes"
                ],
                correct: 1
            },
            {
                id: "jydtvs",
                question: "Which is NOT a benefit of Internet for business?",
                options: [
                    "Faster communication",
                    "Cost reduction",
                    "Guaranteed profit",
                    "Global reach"
                ],
                correct: 2
            },
            {
                id: "ftf0fn",
                question: ".edu domain is used for:",
                options: [
                    "Commercial companies",
                    "Educational institutions",
                    "Entertainment",
                    "E-commerce"
                ],
                correct: 1
            },
            {
                id: "jc9c8k",
                question: "In Web 2.0, users became:",
                options: [
                    "Passive readers only",
                    "Content creators",
                    "Website owners only",
                    "IT professionals"
                ],
                correct: 1
            },
            {
                id: "auc58d",
                question: "HTTP stands for:",
                options: [
                    "HyperText Transfer Protocol",
                    "High Tech Transfer Program",
                    "Hotel Transport Protocol",
                    "Hybrid Text Processing"
                ],
                correct: 0
            }
        ],
        
        fillBlanks: [
            {
                id: "igsdct",
                sentence: "Web 1.0 is called the _______-Only Web.",
                answer: "Read",
                hint: "Passive consumption..."
            },
            {
                id: "2r14dl",
                sentence: "Web 2.0 is known as the _______ Web because of user-generated content.",
                answer: "Social",
                hint: "Community and sharing..."
            },
            {
                id: "qfprf9",
                sentence: "Web 3.0 features machine learning and is called the _______ Web.",
                answer: "Semantic",
                hint: "Meaning and understanding..."
            },
            {
                id: "ff57fp",
                sentence: "DNS translates domain names into _______ addresses.",
                answer: "IP",
                hint: "Internet Protocol..."
            },
            {
                id: "xuqejl",
                sentence: "The .com domain is for _______ organizations.",
                answer: "commercial",
                hint: "Business-related..."
            }
        ],
        
        learn: {
            id: "q453k0",
            title: "Internet & WWW as Business Platform",
            content: `
                <h3>Benefits of Internet for Business</h3>
                <ul>
                    <li>Faster and cheaper communication</li>
                    <li>Easy access to information</li>
                    <li>Cost reduction in operations</li>
                    <li>Higher efficiency and productivity</li>
                    <li>Global reach and new opportunities</li>
                </ul>
                
                <h4>Evolution of the Web</h4>
                <div class="formula-box">
                    <strong>Web 1.0</strong> = Read-Only (Static, passive)<br>
                    <strong>Web 2.0</strong> = Social (User-generated content)<br>
                    <strong>Web 3.0</strong> = Semantic (AI, IoT, machine learning)<br>
                    <strong>Web 4.0</strong> = Symbiotic (Human-machine fusion)
                </div>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Key Terms</h4>
                    <ul>
                        <li><strong>HTTP:</strong> Protocol for web communication</li>
                        <li><strong>DNS:</strong> Translates domains to IP addresses</li>
                        <li><strong>.com:</strong> Commercial</li>
                        <li><strong>.edu:</strong> Educational</li>
                    </ul>
                </div>
            `
        }
    },
    
    // ========== CATEGORY 4: CASH FLOWS & BUSINESS MODELS (Unit 4-5) ==========
    cashFlows: {
        id: "jqtb5q",
        name: "Cash Flows & Models",
        icon: "fa-money-bill-wave",
        color: "#ef4444",
        
        flashcards: [
            {
                id: "vaeh1n",
                question: "What is the Merchant Model in tourism distribution?",
                answer: "In the Merchant Model:\n\n• Suppliers negotiate NET RATES with intermediaries\n• Contracts include blocked rooms (allotment)\n• Intermediaries apply a MARK-UP (margin)\n• Clients pay the INTERMEDIARY, not supplier\n• Client receives a VOUCHER (no price shown)",
                explanation: "Tour operators typically use this model."
            },
            {
                id: "pdc09l",
                question: "What are the advantages of Merchant Model for SUPPLIERS?",
                answer: "Advantages:\n• Guaranteed room occupancy in advance\n• Predictable net revenues\n• Easier price list planning\n\nDisadvantages:\n• Lower bargaining power\n• Lower revenues (net rates)\n• Difficult rate parity control\n• Delayed payments (after guest departure)",
                explanation: "Trade-off between security and revenue."
            },
            {
                id: "o14vpl",
                question: "What is the Agent Model in tourism distribution?",
                answer: "In the Agent Model:\n\n• Suppliers set the FINAL selling price\n• Agents sell at the supplier's price\n• Suppliers pay COMMISSION to the agent\n• Commission is usually a percentage\n• Client gets booking confirmation WITH full price",
                explanation: "OTAs typically use this model."
            },
            {
                id: "u1lpex",
                question: "What are advantages of Agent Model for SUPPLIERS?",
                answer: "Advantages:\n• Higher revenues\n• Control over pricing\n• Easier rate parity management\n• Diversified intermediary network\n\nDisadvantages:\n• Complex management of many intermediaries",
                explanation: "More control, more complexity."
            },
            {
                id: "nelgdt",
                question: "What is a Voucher?",
                answer: "A voucher is a document that:\n\n• Confirms prepaid services\n• Does NOT show the price\n• Is used in the Merchant Model\n• Guest presents it at the hotel",
                explanation: "Proof of prepayment without price disclosure."
            },
            {
                id: "zy39ug",
                question: "How does AI support the Merchant Model?",
                answer: "AI in Merchant Model:\n\n• Demand and inventory forecasting\n• Automated contract analysis (NLP)\n• Dynamic pricing and margin optimization\n• Intelligent dynamic packaging\n\nAI predicts demand months ahead and adjusts automatically.",
                explanation: "AI enhances but doesn't replace the model."
            },
            {
                id: "u8uyxz",
                question: "How does AI support the Agent Model?",
                answer: "AI in Agent Model (used by OTAs):\n\n• Personalized recommendation systems\n• Sentiment analysis of reviews\n• AI chatbots and virtual assistants\n• Predictive analytics for commission optimization\n\nAI improves conversion rates.",
                explanation: "AI makes OTAs smarter."
            },
            {
                id: "fvewcl",
                question: "What is the difference between Intermediaries and Infomediaries?",
                answer: "INTERMEDIARIES:\n• Participate directly in distribution\n• Influence pricing and payments\n• Handle transactions\n\nINFOMEDIARIES:\n• Provide information only\n• Do NOT handle payments\n• Support decision-making\n• Example: Review sites, comparison sites",
                explanation: "Information vs transaction handling."
            },
            {
                id: "d8phaj",
                question: "When is the Merchant Model typically used?",
                answer: "Merchant model is typically used by:\n\n• Tour operators\n• B2B platforms\n• Package trip organizers\n\nAgent model is typically used by:\n• Online Travel Agencies (OTAs)\n• Booking.com, Expedia\n\nNote: some OTAs (e.g. Expedia) act as merchant OR agent, depending on whether the client prefers to pay in advance.",
                explanation: "Different models for different business types."
            },
            {
                id: "exzzto",
                question: "Cash flow example: a client books through a TOUR OPERATOR. Hotel net rate = 50, TO sells at 80. Who pays whom?",
                answer: "Flow of money and documents:\n\n• Client pays 80 to the TOUR OPERATOR and receives a VOUCHER (no price shown)\n• Hotel invoices the TO for the net rate: Invoice = 50\n• TO pays 50 to the hotel\n• TO keeps the MARK-UP: 80 − 50 = 30\n\nThe client never pays the hotel directly in the merchant model.",
                explanation: "Classic merchant-model cash flow from the lecture (Hotel 50 / TO 80 / margin 30)."
            },
            {
                id: "dfflsy",
                question: "Cash flow example: a client books DIRECTLY or through a TRAVEL AGENT. How does the money move?",
                answer: "DIRECT booking:\n• Client pays 100 to the hotel, receives Invoice/Receipt = 100\n\nThrough a TRAVEL AGENT (agent model, 10% commission):\n• Client pays the full price 100\n• Hotel receives the payment and pays the agent commission = 10 (agent invoices the hotel for 10)\n• Hotel keeps 90\n\nThe agent never owns the product — it earns only the commission.",
                explanation: "Direct sale vs agent-model cash flow (100 / commission 10 / hotel nets 90)."
            }
        ],
        
        quiz: [
            {
                id: "dbdz0t",
                question: "In the Merchant Model, who sets the final price?",
                options: [
                    "The supplier",
                    "The intermediary",
                    "The government",
                    "The customer"
                ],
                correct: 1
            },
            {
                id: "u8kay5",
                question: "A voucher does NOT show:",
                options: [
                    "Guest name",
                    "Hotel name",
                    "The price",
                    "Dates"
                ],
                correct: 2
            },
            {
                id: "x5dwvy",
                question: "In the Agent Model, agents earn through:",
                options: [
                    "Mark-up on net rates",
                    "Commission from supplier",
                    "Government subsidies",
                    "Creating packages"
                ],
                correct: 1
            },
            {
                id: "4qx4lc",
                question: "OTAs typically use which model?",
                options: [
                    "Merchant Model",
                    "Agent Model",
                    "Government Model",
                    "Hybrid only"
                ],
                correct: 1
            },
            {
                id: "z0gs5z",
                question: "Infomediaries:",
                options: [
                    "Handle payments",
                    "Provide information only",
                    "Create products",
                    "Set prices"
                ],
                correct: 1
            },
            {
                id: "f3gxfo",
                question: "AI in Merchant Model helps with:",
                options: [
                    "Only customer complaints",
                    "Demand forecasting and dynamic pricing",
                    "Building hotels",
                    "Nothing"
                ],
                correct: 1
            },
            {
                id: "j5hqad",
                question: "Net rates are used in which model?",
                options: [
                    "Agent Model",
                    "Merchant Model",
                    "Customer Model",
                    "None"
                ],
                correct: 1
            },
            {
                id: "72c934",
                question: "In Agent Model, suppliers have:",
                options: [
                    "No control over pricing",
                    "Control over pricing",
                    "No revenues",
                    "No intermediaries"
                ],
                correct: 1
            },
            {
                id: "jzrmx3",
                question: "Hotel net rate is 50 and the tour operator sells the room at 80. The TO's mark-up is:",
                options: [
                    "20",
                    "30",
                    "50",
                    "80"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                id: "v8b6a3",
                sentence: "In the Merchant Model, clients receive a _______ that doesn't show the price.",
                answer: "voucher",
                hint: "Proof of booking..."
            },
            {
                id: "mxz7br",
                sentence: "Agents earn _______ from suppliers for selling their products.",
                answer: "commission",
                hint: "Percentage of sales..."
            },
            {
                id: "9hauml",
                sentence: "_______ provide information only and don't handle payments.",
                answer: "Infomediaries",
                hint: "Information + intermediaries..."
            },
            {
                id: "uzzak5",
                sentence: "In Merchant Model, intermediaries apply a _______-up on net rates.",
                answer: "mark",
                hint: "Adding profit margin..."
            },
            {
                id: "89dcpj",
                sentence: "OTAs typically use the _______ Model.",
                answer: "Agent",
                hint: "Earning commission..."
            }
        ],
        
        learn: {
            id: "nvpe57",
            title: "Cash Flows & Business Models",
            content: `
                <h3>Two Core Distribution Models</h3>
                
                <div class="formula-box">
                    <strong>MERCHANT MODEL</strong><br>
                    Supplier → Net Rate → Intermediary adds Mark-up → Client pays Intermediary<br>
                    Client gets: VOUCHER (no price shown)
                </div>
                
                <div class="formula-box">
                    <strong>AGENT MODEL</strong><br>
                    Supplier sets Final Price → Agent sells at that price → Earns Commission<br>
                    Client gets: Booking confirmation (price visible)
                </div>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Who Uses What?</h4>
                    <p><strong>Merchant:</strong> Tour operators, B2B platforms</p>
                    <p><strong>Agent:</strong> OTAs (Booking.com, Expedia)</p>
                </div>
                
                <h4>Intermediaries vs Infomediaries</h4>
                <ul>
                    <li><strong>Intermediaries:</strong> Handle transactions, influence pricing</li>
                    <li><strong>Infomediaries:</strong> Provide info only (reviews, comparisons)</li>
                </ul>
            `
        }
    },
    
    // ========== CATEGORY 5: COMPUTER GRAPHICS (Unit 6) ==========
    computerGraphics: {
        id: "8wy4gc",
        name: "Computer Graphics",
        icon: "fa-palette",
        color: "#ec4899",
        
        flashcards: [
            {
                id: "5v79zx",
                question: "What is Visual Thinking?",
                answer: "Visual thinking means thinking with images and visualizations.\n\nPeople process information through two channels:\n• Verbal\n• Visual\n\nExamples: Road signs, charts, icons, infographics\n\nText + Image works better than text alone.",
                explanation: "How we process visual information."
            },
            {
                id: "79r7al",
                question: "What is Computer Graphics and what are its 3 most common classifications?",
                answer: "GRAPHICS = representation of information with images, where the basic carriers are shapes and colors.\n\nCOMPUTER GRAPHICS = graphics where a computer is used to generate, store, process and present image content.\n\nThree most common classifications:\n1. INTERACTIVE vs NON-INTERACTIVE (user actively modifies the image vs static display)\n2. VECTOR vs RASTER graphics\n3. 2D vs 3D graphics",
                explanation: "The definition + classification framework of Unit 6."
            },
            {
                id: "0nzz65",
                question: "What are the 7 Elements of Graphic Design?",
                answer: "The core elements are:\n\n1. LINE - Direction and connection\n2. COLOR - Emotions and importance\n3. SHAPE - Two-dimensional form\n4. TEXTURE - Surface quality\n5. SPACE - Positive and negative areas\n6. VALUE - Lightness or darkness\n7. FORM - 3D appearance",
                explanation: "The building blocks of design."
            },
            {
                id: "suln94",
                question: "What is the difference between Warm and Cold Colors?",
                answer: "WARM COLORS:\n• Red, orange, yellow, pink, brown\n• Energy, warmth, movement\n• Dominate and attract attention\n\nCOLD COLORS:\n• Green, blue, some purples\n• Calming and stable\n• Suitable for backgrounds",
                explanation: "Color psychology in design."
            },
            {
                id: "gat01k",
                question: "What is the difference between Vector and Raster Graphics?",
                answer: "VECTOR GRAPHICS:\n• Based on mathematical formulas\n• Scalable without quality loss\n• Small file size\n• Not suitable for detailed photos\n\nRASTER GRAPHICS:\n• Based on pixels\n• Realistic color transitions\n• Large file size\n• Quality loss when resized",
                explanation: "Two fundamental types of digital images."
            },
            {
                id: "3sp7pr",
                question: "What is Resolution?",
                answer: "Resolution describes image clarity/sharpness.\n\nMeasured as:\n• Pixels (for screens)\n• DPI - Dots Per Inch (for print)\n\nTypical values:\n• 72-75 DPI - digital display\n• 300 DPI - print\n\nHigher resolution = higher detail",
                explanation: "Image quality measurement."
            },
            {
                id: "4clxps",
                question: "What is the difference between RGB and CMYK color models?",
                answer: "RGB:\n• Red, Green, Blue\n• Used for SCREENS and digital displays\n• Additive color model\n\nCMYK:\n• Cyan, Magenta, Yellow, Black\n• Used for PRINTING\n• Subtractive color model",
                explanation: "Screen vs print colors."
            },
            {
                id: "dwekqq",
                question: "What is the minimum color contrast ratio for accessibility?",
                answer: "Accessibility guidelines:\n\n• Normal text: minimum 4.5:1 contrast ratio\n• Large or bold text: minimum 3:1 contrast ratio\n\nThis ensures text is readable for people with visual impairments.",
                explanation: "WCAG accessibility standards."
            },
            {
                id: "1r7oiz",
                question: "What is the difference between 2D and 3D Graphics?",
                answer: "2D GRAPHICS:\n• Flat images\n• Simulate depth using color and shadow\n\n3D GRAPHICS:\n• Store full spatial information\n• Objects can be viewed from any angle\n• Use the concept of 'world' or 'space'",
                explanation: "Flat vs spatial graphics."
            },
            {
                id: "d1q90q",
                question: "What is Positive and Negative Space?",
                answer: "POSITIVE SPACE:\n• Area occupied by objects\n• The main subject\n\nNEGATIVE SPACE:\n• Empty area around or between objects\n• White space\n\nGood use of space improves readability and focus.",
                explanation: "Space in design composition."
            }
        ],
        
        quiz: [
            {
                id: "oth825",
                question: "Vector graphics are based on:",
                options: [
                    "Pixels",
                    "Mathematical formulas",
                    "Photographs only",
                    "Audio files"
                ],
                correct: 1
            },
            {
                id: "tcdw9k",
                question: "RGB is used for:",
                options: [
                    "Printing",
                    "Screens and digital displays",
                    "Audio",
                    "Documents only"
                ],
                correct: 1
            },
            {
                id: "1ymz92",
                question: "The recommended print resolution is:",
                options: [
                    "72 DPI",
                    "100 DPI",
                    "300 DPI",
                    "50 DPI"
                ],
                correct: 2
            },
            {
                id: "xuil4b",
                question: "Warm colors include:",
                options: [
                    "Blue and green",
                    "Red, orange, and yellow",
                    "Only black and white",
                    "Purple only"
                ],
                correct: 1
            },
            {
                id: "34ugbt",
                question: "CMYK is used for:",
                options: [
                    "Screen displays",
                    "Printing",
                    "Video games",
                    "Audio editing"
                ],
                correct: 1
            },
            {
                id: "qj7ail",
                question: "How many core elements of graphic design are there?",
                options: [
                    "5",
                    "6",
                    "7",
                    "10"
                ],
                correct: 2
            },
            {
                id: "64ioq2",
                question: "Minimum contrast ratio for normal text accessibility is:",
                options: [
                    "2:1",
                    "3:1",
                    "4.5:1",
                    "10:1"
                ],
                correct: 2
            },
            {
                id: "51laju",
                question: "Raster graphics quality loss occurs when:",
                options: [
                    "Viewing on screen",
                    "Resizing or compressing",
                    "Saving the file",
                    "Never"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                id: "ryqbog",
                sentence: "_______ graphics are based on mathematical formulas and scale without quality loss.",
                answer: "Vector",
                hint: "Opposite of raster..."
            },
            {
                id: "3iwfti",
                sentence: "RGB stands for Red, Green, and _______.",
                answer: "Blue",
                hint: "Primary color..."
            },
            {
                id: "msito9",
                sentence: "The recommended resolution for print is _______ DPI.",
                answer: "300",
                hint: "Higher than screen..."
            },
            {
                id: "xmtey3",
                sentence: "_______ colors like blue and green are calming and suitable for backgrounds.",
                answer: "Cold",
                hint: "Opposite of warm..."
            },
            {
                id: "3lpdg7",
                sentence: "CMYK is used for _______ rather than screens.",
                answer: "printing",
                hint: "Physical output..."
            }
        ],
        
        learn: {
            id: "21ht6n",
            title: "Computer Graphics",
            content: `
                <h3>7 Elements of Graphic Design</h3>
                <div class="formula-box">
                    Line • Color • Shape • Texture • Space • Value • Form
                </div>
                
                <h4>Vector vs Raster</h4>
                <div class="tip-box">
                    <h4><i class="fas fa-vector-square"></i> Comparison</h4>
                    <p><strong>Vector:</strong> Math-based, scalable, small files (logos)</p>
                    <p><strong>Raster:</strong> Pixel-based, realistic, large files (photos)</p>
                </div>
                
                <h4>Color Models</h4>
                <ul>
                    <li><strong>RGB:</strong> Screens (Red, Green, Blue)</li>
                    <li><strong>CMYK:</strong> Print (Cyan, Magenta, Yellow, Black)</li>
                </ul>
                
                <h4>Resolution</h4>
                <div class="example-box">
                    <p>📱 Screen: 72-75 DPI</p>
                    <p>🖨️ Print: 300 DPI</p>
                </div>
                
                <h4>Accessibility</h4>
                <p>Minimum contrast: 4.5:1 (normal text) | 3:1 (large text)</p>
            `
        }
    },
    
    // ========== CATEGORY 6: PLATFORM ECONOMY (Unit 7) ==========
    platformEconomy: {
        id: "7vejge",
        name: "Platform Economy",
        icon: "fa-network-wired",
        color: "#8b5cf6",
        
        flashcards: [
            {
                id: "ndkuhb",
                question: "What is the Platform Economy?",
                answer: "The platform economy refers to economic activities enabled by digital platforms that:\n\n• Connect different groups of users\n• Facilitate interactions and transactions\n• Operate through digital technologies and algorithms\n\nIt includes: Sharing economy, Gig economy, Creative economy",
                explanation: "The dominant form of digital business."
            },
            {
                id: "w4u8du",
                question: "What are the key features of Digital Platforms?",
                answer: "Platforms typically:\n\n• Eliminate traditional gatekeepers\n• Bring together suppliers and consumers\n• Provide infrastructure for transactions\n• Govern value creation (don't produce it)\n• Operate as complex ecosystems\n• Use algorithms and data processing",
                explanation: "How platforms function differently."
            },
            {
                id: "swjun3",
                question: "How do platforms create value?",
                answer: "Platform value creation is INDIRECT:\n\n• Facilitate interactions\n• Enable transactions\n• Act mainly as third parties\n\nValue emerges from:\n• Gathering many users in one digital space\n• Enabling new forms of consumer behavior\n• Reconfiguring how value is exchanged",
                explanation: "Platforms don't produce, they enable."
            },
            {
                id: "6koxx4",
                question: "What are Network Effects?",
                answer: "Network Effects mean:\n\nEach new user increases the value of the platform for existing users.\n\nMore users → More connections → More value → Even more users\n\nThis explains rapid platform growth.",
                explanation: "Why platforms grow exponentially."
            },
            {
                id: "s27tx4",
                question: "What economic concept underlies the positive network effect?",
                answer: "DEMAND-SIDE ECONOMIES OF SCALE (Parker et al., 2016):\n\n• Additional value comes from the DEMAND side (more consumers), not from production costs\n• Multiple consumers gathered at one virtual place provide large scalability\n• This enables faster interactions and transactions aimed at value creation and exchange",
                explanation: "The formal term behind the 'positive network effect'."
            },
            {
                id: "caze4o",
                question: "What are examples of platforms in different industries?",
                answer: "Platform examples:\n\n• Retail/Marketplaces: Amazon, Alibaba, eBay\n• Accommodation: Airbnb\n• Transportation: Uber, BlaBlaCar\n• OTAs: Booking.com, Expedia\n• Education: Coursera, edX\n• Media: YouTube, Netflix\n• Freelancing: Fiverr, TaskRabbit",
                explanation: "Platforms across industries."
            },
            {
                id: "vekzb2",
                question: "How does AI transform tourism platforms?",
                answer: "AI in tourism platforms:\n\n• Personalized recommendations based on user data\n• Dynamic pricing and revenue optimization\n• 24/7 automated customer support (chatbots)\n\nAdvanced functions:\n• Conversational search\n• Automatic translations\n• Fraud and fake review detection\n• Inventory and rate management",
                explanation: "AI enhances platform performance."
            },
            {
                id: "tcsvsk",
                question: "What are the challenges of the Platform Economy?",
                answer: "Current challenges:\n\n• Unclear and evolving definitions\n• Complex role switching between users\n• Ethical, social, and environmental impacts\n• Regulation and market dominance issues\n\nFuture research focuses on:\n• Access-based vs asset-controlled models\n• Platform governance\n• Sustainability of ecosystems",
                explanation: "Ongoing issues with platforms."
            }
        ],
        
        quiz: [
            {
                id: "onvd5a",
                question: "Network effects mean:",
                options: [
                    "Internet speed increases",
                    "Each new user increases value for all users",
                    "Networks become smaller",
                    "Platforms lose users"
                ],
                correct: 1
            },
            {
                id: "hlbf4b",
                question: "Platforms create value by:",
                options: [
                    "Manufacturing products",
                    "Facilitating interactions and transactions",
                    "Hiring many employees",
                    "Building physical stores"
                ],
                correct: 1
            },
            {
                id: "7nwin2",
                question: "Which is an accommodation platform?",
                options: [
                    "Amazon",
                    "Uber",
                    "Airbnb",
                    "Coursera"
                ],
                correct: 2
            },
            {
                id: "4zkxgp",
                question: "AI on platforms helps with:",
                options: [
                    "Nothing",
                    "Personalized recommendations and dynamic pricing",
                    "Building hotels",
                    "Reducing internet speed"
                ],
                correct: 1
            },
            {
                id: "f9nfeq",
                question: "The platform economy includes:",
                options: [
                    "Only e-commerce",
                    "Sharing, gig, and creative economies",
                    "Only physical stores",
                    "Government services only"
                ],
                correct: 1
            },
            {
                id: "m8vu8t",
                question: "Which is a freelancing platform?",
                options: [
                    "Netflix",
                    "Fiverr",
                    "Booking.com",
                    "YouTube"
                ],
                correct: 1
            },
            {
                id: "ppxebw",
                question: "Platforms typically:",
                options: [
                    "Produce goods directly",
                    "Eliminate traditional gatekeepers",
                    "Avoid using data",
                    "Have no users"
                ],
                correct: 1
            },
            {
                id: "u43p8o",
                question: "Platform challenges include all EXCEPT:",
                options: [
                    "Regulation issues",
                    "Market dominance concerns",
                    "Perfect definitions",
                    "Ethical impacts"
                ],
                correct: 2
            }
        ],
        
        fillBlanks: [
            {
                id: "1oprz8",
                sentence: "_______ effects mean more users increase value for everyone.",
                answer: "Network",
                hint: "Connections growing..."
            },
            {
                id: "rcp738",
                sentence: "_______ is an accommodation sharing platform.",
                answer: "Airbnb",
                hint: "Alternative to hotels..."
            },
            {
                id: "j1p996",
                sentence: "Platforms facilitate interactions and _______ between users.",
                answer: "transactions",
                hint: "Exchanges of value..."
            },
            {
                id: "y8r90l",
                sentence: "AI helps platforms with personalized _______ for users.",
                answer: "recommendations",
                hint: "Suggestions..."
            },
            {
                id: "jn3ygr",
                sentence: "The platform economy includes sharing, gig, and _______ economies.",
                answer: "creative",
                hint: "Artists and content creators..."
            }
        ],
        
        learn: {
            id: "5a05wg",
            title: "Platform Economy",
            content: `
                <h3>What is Platform Economy?</h3>
                <div class="formula-box">
                    Digital Platforms = Technology + Algorithms + User Connections<br>
                    Includes: Sharing Economy + Gig Economy + Creative Economy
                </div>
                
                <h4>Network Effects</h4>
                <div class="tip-box">
                    <h4><i class="fas fa-users"></i> The Growth Formula</h4>
                    <p>More Users → More Connections → More Value → Even More Users</p>
                    <p>This explains why successful platforms grow exponentially!</p>
                </div>
                
                <h4>Platform Examples</h4>
                <ul>
                    <li>🛒 <strong>Retail:</strong> Amazon, eBay</li>
                    <li>🏠 <strong>Accommodation:</strong> Airbnb</li>
                    <li>🚗 <strong>Transport:</strong> Uber</li>
                    <li>✈️ <strong>Travel:</strong> Booking.com</li>
                    <li>🎬 <strong>Media:</strong> YouTube, Netflix</li>
                    <li>💼 <strong>Freelance:</strong> Fiverr</li>
                </ul>
                
                <h4>AI on Platforms</h4>
                <p>Personalization, dynamic pricing, chatbots, fraud detection</p>
            `
        }
    },
};

if (typeof window !== 'undefined') { window.ebusinessM1 = ebusinessM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = ebusinessM1; }
