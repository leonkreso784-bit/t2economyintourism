// ===== BUSINESS ENTREPRENEURSHIP - QUESTION DATABASE =====
// All content organized by categories

const entrepreneurshipData = {
    
    // ========== CATEGORY 1: PLANNING & TOOLS ==========
    planning: {
        name: "Planning & Tools",
        icon: "fa-clipboard-list",
        color: "#8b5cf6",
        
        flashcards: [
            {
                question: "What is the difference between PLANNING and a PLAN?",
                answer: "PLANNING is a verb (implies action) - the process of envisioning the future.\nA PLAN is a written description of the future you envision for your business.",
                explanation: "Planning is the action, a plan is the document."
            },
            {
                question: "What is the TRIM framework?",
                answer: "TRIM = Team, Resources, Idea, Market\n\nA planning tool that identifies:\n• Types of people needed for the team\n• Resources available and needed\n• Details of the idea\n• Potential market for the product/service",
                explanation: "TRIM helps structure early-stage planning."
            },
            {
                question: "What is the 'Back of a Napkin' technique?",
                answer: "A quick, informal planning method where entrepreneurs jot down spontaneous ideas on whatever is at hand (like a napkin in a cafe).\n\nNot formal enough for investors, but effective for gaining clarity on the business idea.",
                explanation: "Simple, spontaneous idea capture technique."
            },
            {
                question: "What is the Business Model Canvas (BMC)?",
                answer: "A visual plan that depicts the entire business on ONE PAGE with 9 blocks:\n1. Key Partners\n2. Key Activities\n3. Value Proposition\n4. Customer Relationships\n5. Customer Segments\n6. Key Resources\n7. Channels\n8. Cost Structure\n9. Revenue Streams",
                explanation: "BMC helps identify gaps and integrate business components."
            },
            {
                question: "What is a Business Brief?",
                answer: "A 2-3 page document outlining:\n• Company overview\n• Value proposition\n• Customer profile\n• Milestones\n\nGives stakeholders an at-a-glance understanding of who you are and the business potential.",
                explanation: "More detailed than BMC but shorter than a full business plan."
            },
            {
                question: "What is a Feasibility Study?",
                answer: "An essential planning tool that tests whether an initial idea is worth pursuing.\n\nFocuses on:\n• Market size\n• Suppliers & distributors\n• Skills of the entrepreneur\n\nDetermines if the idea is workable and profitable.",
                explanation: "Requires action, testing, information gathering, and analysis."
            },
            {
                question: "What is a Pitch Deck?",
                answer: "A brief presentation highlighting essential elements from feasibility study and business plan.\n\nUsed for:\n• Collegiate competitions\n• Accelerator/incubator applications\n• Angel and VC funding\n\nGoal: Get interest and secure the next meeting!",
                explanation: "The purpose is to describe and generate interest."
            },
            {
                question: "What are the 4 parts of a Business Plan?",
                answer: "1. BUSINESS CONCEPT - industry, structure, products, success strategy\n2. MARKET SECTION - customers, competitors\n3. IMPLEMENTATION - design, development, operations, management\n4. FINANCIAL SECTION - income, cash flow, balance sheets, projections",
                explanation: "A formal document outlining goals and how to reach them."
            }
        ],
        
        quiz: [
            {
                question: "TRIM framework stands for:",
                options: [
                    "Time, Revenue, Investment, Market",
                    "Team, Resources, Idea, Market",
                    "Technology, Research, Innovation, Management",
                    "Target, Results, Income, Money"
                ],
                correct: 1
            },
            {
                question: "How many blocks does the Business Model Canvas have?",
                options: ["5", "7", "9", "12"],
                correct: 2
            },
            {
                question: "A Feasibility Study determines:",
                options: [
                    "Only the market size",
                    "If the idea is workable and profitable",
                    "Employee salaries",
                    "Company logo design"
                ],
                correct: 1
            },
            {
                question: "What is the main goal of a Pitch Deck?",
                options: [
                    "To replace the business plan",
                    "To get interest and secure the next meeting",
                    "To hire employees",
                    "To calculate taxes"
                ],
                correct: 1
            },
            {
                question: "A Business Brief is typically:",
                options: [
                    "50+ pages",
                    "2-3 pages",
                    "1 sentence",
                    "100 slides"
                ],
                correct: 1
            },
            {
                question: "Which is NOT a block in the Business Model Canvas?",
                options: [
                    "Key Partners",
                    "Value Proposition",
                    "Employee Happiness",
                    "Revenue Streams"
                ],
                correct: 2
            }
        ],
        
        fillBlanks: [
            {
                sentence: "TRIM stands for Team, Resources, Idea, and _______.",
                answer: "Market",
                hint: "Where you sell..."
            },
            {
                sentence: "The Business Model Canvas has _______ blocks.",
                answer: "nine",
                hint: "9..."
            },
            {
                sentence: "A _______ Study tests if an idea is workable and profitable.",
                answer: "Feasibility",
                hint: "Is it feasible?"
            },
            {
                sentence: "Planning is a verb, a _______ is a written document.",
                answer: "plan",
                hint: "The noun form..."
            }
        ],
        
        learn: {
            title: "Planning Tools for Entrepreneurs",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
            content: `
                <h4>Types of Plans (Simple to Complex):</h4>
                <ul>
                    <li><strong>Back of Napkin</strong> - Quick, informal ideas</li>
                    <li><strong>Sketches on Page</strong> - How product works</li>
                    <li><strong>Business Model Canvas</strong> - 9 blocks, one page</li>
                    <li><strong>Business Brief</strong> - 2-3 pages for stakeholders</li>
                    <li><strong>Feasibility Study</strong> - Test if idea is viable</li>
                    <li><strong>Pitch Deck</strong> - Presentation for investors</li>
                    <li><strong>Business Plan</strong> - Full formal document</li>
                </ul>
                
                <div class="formula-box">
                    <strong>TRIM Framework</strong><br>
                    Team + Resources + Idea + Market
                </div>
                
                <h4>Business Model Canvas - 9 Blocks:</h4>
                <ul>
                    <li>Key Partners</li>
                    <li>Key Activities</li>
                    <li>Value Proposition</li>
                    <li>Customer Relationships</li>
                    <li>Customer Segments</li>
                    <li>Key Resources</li>
                    <li>Channels</li>
                    <li>Cost Structure</li>
                    <li>Revenue Streams</li>
                </ul>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Remember!</h4>
                    <p>Planning = Action (verb)<br>
                    Plan = Document (noun)</p>
                </div>
            `
        }
    },
    
    // ========== CATEGORY 2: FAILURE & LEARNING ==========
    failure: {
        name: "Failure & Learning",
        icon: "fa-exclamation-triangle",
        color: "#ef4444",
        
        flashcards: [
            {
                question: "What are the 2 main categories of reasons why firms fail?",
                answer: "1. EXOGENOUS FACTORS - external forces, 'survival of the fittest', hostile jolts\n\n2. INTERNAL FACTORS - leadership, management, poor decision-making, strategic errors",
                explanation: "Failure can come from outside or inside the company."
            },
            {
                question: "What are the consequences of business failure?",
                answer: "• Loss of jobs\n• Emotional and psychological burden\n• Feelings of grief, loss of self-esteem\n• Stigmatization (personal and societal)\n• BUT: Knowledge spillovers - lessons learned",
                explanation: "Society is shifting to accept that failure arises from risk rather than sin."
            },
            {
                question: "What is INACTION as a warning sign?",
                answer: "Entrepreneurs fail to take corrective actions because of:\n• Negation of reality\n• Being absorbed by need for achievement\n• Being 'blinded' by love for the innovation\n• Losing sight of reality",
                explanation: "Inaction is often caused by denial."
            },
            {
                question: "What are examples of FAULTY or INSUFFICIENT ACTION?",
                answer: "• Approaching private investors too late\n• Last-minute incorporation of missing skills\n• Downsizing, flexible structures\n• Desperate corrective actions:\n  - Last minute personal investments\n  - Last-minute search for partners\n  - Selling the innovation to others",
                explanation: "Poor decisions made in desperation."
            },
            {
                question: "How does FEAR OF FAILURE affect entrepreneurs?",
                answer: "Fear of failure:\n• Disables entrepreneurial learning\n• Impedes investment\n• Blocks opportunity recognition\n• Hinders risk assessment\n\nFailure is linked to grief, anger, guilt, self-blame, distress, and anxiety.",
                explanation: "Crucial to success is overcoming or managing fear of failure."
            },
            {
                question: "What is the positive view of failure?",
                answer: "Knowledge spillovers - 'What if nothing is a failure but rather a lesson pointing to a better idea?'\n\nSociety has gradually shifted to accept that failure might arise from risk rather than sin.",
                explanation: "Failure can be a learning opportunity."
            }
        ],
        
        quiz: [
            {
                question: "Exogenous factors in business failure refer to:",
                options: [
                    "Internal management issues",
                    "External forces and hostile jolts",
                    "Employee mistakes",
                    "Accounting errors"
                ],
                correct: 1
            },
            {
                question: "INACTION as a warning sign is caused by:",
                options: [
                    "Too much planning",
                    "Negation of reality and being blinded by love for the innovation",
                    "Too many employees",
                    "High profits"
                ],
                correct: 1
            },
            {
                question: "Which is a consequence of business failure?",
                options: [
                    "Increased self-esteem",
                    "Knowledge spillovers (lessons learned)",
                    "Automatic success next time",
                    "Government rewards"
                ],
                correct: 1
            },
            {
                question: "Fear of failure does NOT:",
                options: [
                    "Disable entrepreneurial learning",
                    "Impede investment",
                    "Encourage risk-taking",
                    "Block opportunity recognition"
                ],
                correct: 2
            },
            {
                question: "Society's view of failure has shifted to:",
                options: [
                    "Failure is always a sin",
                    "Failure might arise from risk rather than sin",
                    "Failure should be punished",
                    "Failure is impossible"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                sentence: "_______ factors are external forces that cause business failure.",
                answer: "Exogenous",
                hint: "External..."
            },
            {
                sentence: "Entrepreneurs often fail due to _______ - not taking corrective actions.",
                answer: "inaction",
                hint: "Not acting..."
            },
            {
                sentence: "Fear of failure disables entrepreneurial _______.",
                answer: "learning",
                hint: "Gaining knowledge..."
            }
        ],
        
        learn: {
            title: "Understanding Business Failure",
            image: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400",
            content: `
                <h4>Why Do Firms Fail?</h4>
                <ul>
                    <li><strong>Exogenous</strong> - External factors, hostile jolts</li>
                    <li><strong>Internal</strong> - Leadership, poor decisions, strategic errors</li>
                </ul>
                
                <h4>Consequences of Failure:</h4>
                <ul>
                    <li>Loss of jobs</li>
                    <li>Emotional burden (grief, loss of self-esteem)</li>
                    <li>Stigmatization</li>
                    <li>BUT: Knowledge spillovers!</li>
                </ul>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Warning Signs</h4>
                    <p><strong>Inaction</strong> - denial, being blinded by love for the idea<br>
                    <strong>Faulty Action</strong> - desperate last-minute decisions</p>
                </div>
                
                <h4>Fear of Failure:</h4>
                <p>Disables learning, impedes investment, blocks opportunity recognition.</p>
                
                <div class="formula-box">
                    <strong>New Perspective:</strong><br>
                    "What if nothing is a failure but rather a lesson pointing to a better idea?"
                </div>
            `
        }
    },
    
    // ========== CATEGORY 3: ENTREPRENEURSHIP & ECONOMY ==========
    economy: {
        name: "Entrepreneurship & Economy",
        icon: "fa-chart-line",
        color: "#10b981",
        
        flashcards: [
            {
                question: "What are the MACROECONOMIC effects of entrepreneurship?",
                answer: "• Capital Formation\n• Employment growth\n• Technological progress\n• Knowledge-based development",
                explanation: "Effects on the overall economy."
            },
            {
                question: "What are the MICROECONOMIC effects of entrepreneurship?",
                answer: "• Establishment of new economic entities\n• Creation of new jobs\n• Production of new goods and services\n• Creation of niche markets",
                explanation: "Effects on individual businesses and markets."
            },
            {
                question: "According to R. Cantillon, what is an entrepreneur?",
                answer: "An entrepreneur is a RISK-TAKER who bears uncertainty and makes decisions in an uncertain economic context.",
                explanation: "Cantillon's definition emphasizes risk and uncertainty."
            },
            {
                question: "According to J.A. Schumpeter, what is an entrepreneur?",
                answer: "An entrepreneur is the economic individual who realizes new 'PRODUCTIVE COMBINATIONS'.\n\nTypical opportunities:\n1. New good or new quality\n2. New production method\n3. New market\n4. New source of supply\n5. New organization of industry",
                explanation: "Schumpeter emphasizes innovation and creative destruction."
            },
            {
                question: "What is Marshall's classification of entrepreneurs?",
                answer: "ACTIVE entrepreneurs - those who find NEW ways\nPASSIVE entrepreneurs - those who follow EXISTING roads\n\nEntrepreneur functions:\n• Collect economic information\n• Make economic calculations\n• Assign goods to production\n• Supervise execution",
                explanation: "Marshall saw entrepreneurs as risk-takers and administrators."
            },
            {
                question: "What is the difference between Entrepreneurship and Management?",
                answer: "ENTREPRENEURSHIP - dynamic process, taking own risk, introducing new ideas and projects\n\nMANAGEMENT - responsible for actions that maximize individual contributions to group tasks, applies to all organizations",
                explanation: "Entrepreneurship is about innovation, management is about optimization."
            },
            {
                question: "What is Entrepreneurial Management?",
                answer: "The unification of entrepreneurial and managerial functions within a business organization.\n\nBased on:\n• Constant innovation\n• Focused achievement of business goals\n• Growth and development of the company",
                explanation: "Combines both entrepreneurial and managerial approaches."
            },
            {
                question: "What are the two types of innovation?",
                answer: "1. INCREMENTAL - gradual, small-scale improvements\n\n2. RADICAL - disruptive, game-changing innovations",
                explanation: "Innovation can be evolutionary or revolutionary."
            }
        ],
        
        quiz: [
            {
                question: "Capital formation is a:",
                options: [
                    "Microeconomic effect",
                    "Macroeconomic effect",
                    "Social effect",
                    "Environmental effect"
                ],
                correct: 1
            },
            {
                question: "According to Cantillon, an entrepreneur is primarily a:",
                options: [
                    "Manager",
                    "Risk-taker who bears uncertainty",
                    "Government official",
                    "Investor"
                ],
                correct: 1
            },
            {
                question: "Schumpeter's entrepreneur realizes new:",
                options: [
                    "Taxes",
                    "Productive combinations",
                    "Regulations",
                    "Bureaucracy"
                ],
                correct: 1
            },
            {
                question: "Marshall's PASSIVE entrepreneurs:",
                options: [
                    "Find new ways",
                    "Follow existing roads",
                    "Never work",
                    "Only invest money"
                ],
                correct: 1
            },
            {
                question: "RADICAL innovation is:",
                options: [
                    "Gradual and small-scale",
                    "Disruptive and game-changing",
                    "Never successful",
                    "Only in technology"
                ],
                correct: 1
            },
            {
                question: "Entrepreneurial Management combines:",
                options: [
                    "Art and music",
                    "Entrepreneurial and managerial functions",
                    "Sales and marketing only",
                    "HR and accounting"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                sentence: "According to Cantillon, an entrepreneur is a _______-taker.",
                answer: "risk",
                hint: "Taking chances..."
            },
            {
                sentence: "Schumpeter says entrepreneurs realize new productive _______.",
                answer: "combinations",
                hint: "Mixing things together..."
            },
            {
                sentence: "_______ innovation is gradual and small-scale.",
                answer: "Incremental",
                hint: "Step by step..."
            },
            {
                sentence: "_______ innovation is disruptive and game-changing.",
                answer: "Radical",
                hint: "Revolutionary..."
            }
        ],
        
        learn: {
            title: "Entrepreneurship and the Economy",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
            content: `
                <h4>Economic Effects of Entrepreneurship:</h4>
                
                <p><strong>MACRO:</strong> Capital formation, Employment growth, Tech progress, Knowledge development</p>
                <p><strong>MICRO:</strong> New entities, New jobs, New goods/services, Niche markets</p>
                
                <h4>Key Theorists:</h4>
                <ul>
                    <li><strong>Cantillon</strong> - Entrepreneur = Risk-taker in uncertainty</li>
                    <li><strong>Schumpeter</strong> - Entrepreneur = Creator of new productive combinations</li>
                    <li><strong>Marshall</strong> - Active (new ways) vs Passive (existing roads)</li>
                </ul>
                
                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Schumpeter's 5 Opportunities</h4>
                    <p>1. New good/quality<br>
                    2. New production method<br>
                    3. New market<br>
                    4. New source of supply<br>
                    5. New organization of industry</p>
                </div>
                
                <div class="formula-box">
                    <strong>Types of Innovation:</strong><br>
                    INCREMENTAL = gradual, small-scale<br>
                    RADICAL = disruptive, game-changing
                </div>
            `
        }
    },
    
    // ========== CATEGORY 4: SOCIAL ENTREPRENEURSHIP ==========
    social: {
        name: "Social Entrepreneurship",
        icon: "fa-hands-helping",
        color: "#0ea5e9",
        
        flashcards: [
            {
                question: "What is Social Entrepreneurship?",
                answer: "The organization of a business around specific SOCIAL and/or ENVIRONMENTAL causes.\n\nNot-for-profit initiatives seeking alternative funding to create social value and catalyze social transformation.",
                explanation: "Business with a social mission."
            },
            {
                question: "What is the SOCIAL element in social entrepreneurship?",
                answer: "• Altruism\n• Ethical motives, moral responsibility\n• Combining resources to address social problems\n• Altering existing social structures\n• Catalyzing social transformation\n• Value creation focused on SOCIAL value",
                explanation: "The 'why' - creating positive social impact."
            },
            {
                question: "What is the ENTREPRENEURIAL element in social entrepreneurship?",
                answer: "• For profit vs Not for profit debate\n• Nature of social needs addressed\n• Amount of resources needed\n• Scope of raising capital\n• Ability to capture economic value\n• Priority given to social wealth creation",
                explanation: "The 'how' - business skills for social good."
            },
            {
                question: "What is a COMMUNITY Social Entrepreneur?",
                answer: "• Addresses LOCAL, ISOLATED social problems\n• Serves social needs within a SMALL geographical area\n• Focus on immediate community impact",
                explanation: "Local focus, small scale."
            },
            {
                question: "What is a NON-PROFIT Social Entrepreneur?",
                answer: "• Prioritizes social well-being over traditional business needs\n• Uses their power for SOCIAL GOOD\n• Usually business-savvy entrepreneurs wanting to create change\n• Results take longer but can be LARGER SCALE",
                explanation: "Business skills applied for social benefit."
            },
            {
                question: "What is a TRANSFORMATIONAL Social Entrepreneur?",
                answer: "• Meets social needs that governments and businesses AREN'T meeting\n• What non-profits evolve to with sufficient time and growth\n• LARGER organizations with rules and regulations\n• Usually recruit and foster talent in-house",
                explanation: "Filling gaps left by government and business."
            },
            {
                question: "What is a GLOBAL Social Entrepreneur?",
                answer: "• Seeks to completely CHANGE SOCIAL SYSTEMS\n• Addresses major social needs GLOBALLY\n• Often where big companies end up when they realize social responsibility\n• Tied to a particular cause\n• Works with other social entrepreneurs",
                explanation: "Worldwide systemic change."
            }
        ],
        
        quiz: [
            {
                question: "Social entrepreneurship focuses on:",
                options: [
                    "Maximum profit only",
                    "Social and/or environmental causes",
                    "Stock prices",
                    "Real estate"
                ],
                correct: 1
            },
            {
                question: "A COMMUNITY social entrepreneur serves:",
                options: [
                    "Global markets",
                    "A small geographical area",
                    "Only wealthy clients",
                    "Government agencies"
                ],
                correct: 1
            },
            {
                question: "TRANSFORMATIONAL social entrepreneurs:",
                options: [
                    "Only work locally",
                    "Meet needs governments and businesses aren't meeting",
                    "Focus on profit only",
                    "Never grow"
                ],
                correct: 1
            },
            {
                question: "GLOBAL social entrepreneurs seek to:",
                options: [
                    "Stay small",
                    "Change social systems globally",
                    "Avoid partnerships",
                    "Focus on one neighborhood"
                ],
                correct: 1
            },
            {
                question: "The SOCIAL element includes:",
                options: [
                    "Profit maximization",
                    "Altruism and ethical motives",
                    "Stock trading",
                    "Tax avoidance"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                sentence: "Social entrepreneurship creates _______ value, not just economic value.",
                answer: "social",
                hint: "Helping society..."
            },
            {
                sentence: "_______ social entrepreneurs serve small geographical areas.",
                answer: "Community",
                hint: "Local neighborhood..."
            },
            {
                sentence: "_______ social entrepreneurs seek to change systems globally.",
                answer: "Global",
                hint: "Worldwide..."
            }
        ],
        
        learn: {
            title: "Social Entrepreneurship",
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
            content: `
                <p><span class="highlight">Social Entrepreneurship</span> = Business organized around social/environmental causes</p>
                
                <h4>Two Key Elements:</h4>
                <ul>
                    <li><strong>SOCIAL</strong> - Altruism, ethics, social transformation</li>
                    <li><strong>ENTREPRENEURIAL</strong> - Business skills, capital, sustainability</li>
                </ul>
                
                <h4>4 Types of Social Entrepreneurs:</h4>
                
                <div class="tip-box">
                    <h4><i class="fas fa-users"></i> Types (Small → Large)</h4>
                    <p>1. <strong>COMMUNITY</strong> - Local, small area<br>
                    2. <strong>NON-PROFIT</strong> - Business-savvy, social good<br>
                    3. <strong>TRANSFORMATIONAL</strong> - Fill gaps, larger orgs<br>
                    4. <strong>GLOBAL</strong> - Change systems worldwide</p>
                </div>
                
                <div class="formula-box">
                    <strong>Value Focus:</strong><br>
                    Social Value > Economic Value<br>
                    (Economic value ensures financial viability)
                </div>
            `
        }
    },
    
    // ========== CATEGORY 5: TRENDS & GENDER ==========
    trends: {
        name: "Trends & Gender Gap",
        icon: "fa-globe",
        color: "#f59e0b",
        
        flashcards: [
            {
                question: "What is the gender gap in entrepreneurship?",
                answer: "• Men outnumber women 3 to 1 in business ownership (World Bank)\n• Only 2.3% of venture capital goes to women entrepreneurs\n• Only 2% of women-owned startups generate $1 million\n• Men are 3.5x more likely to achieve $1 million",
                explanation: "Significant disparity exists in entrepreneurship."
            },
            {
                question: "What challenges do female entrepreneurs face?",
                answer: "• Lack of access to financing\n• Legal inequalities\n• Funding challenges compared to men\n• Higher unemployment rates (post-pandemic)\n• Venture capital bias",
                explanation: "Multiple barriers to female entrepreneurship."
            },
            {
                question: "What is an Entrepreneurial Ecosystem?",
                answer: "A framework that includes:\n• Policy\n• Regional clusters\n• Innovation systems\n• Context\n• Institutional frameworks\n\nAll working together to promote and support entrepreneurship.",
                explanation: "The environment that enables entrepreneurship."
            },
            {
                question: "What are the NEW TRENDS in Economy?",
                answer: "• Creative Economy\n• FinTech - Open banking\n• NFTs (Non-Fungible Tokens)",
                explanation: "Economic trends shaping entrepreneurship."
            },
            {
                question: "What are the NEW TRENDS in Society?",
                answer: "• Ageing society\n• Diversity and inclusion in workplaces\n• Well-being focus",
                explanation: "Social trends affecting business."
            },
            {
                question: "What are the NEW TRENDS in Environment?",
                answer: "• Net zero (carbon neutrality)\n• ESG (Environmental, Social, Governance)",
                explanation: "Environmental considerations in business."
            },
            {
                question: "What are the NEW TRENDS in Technology?",
                answer: "• Metaverse\n• Big data\n• SaaS / PaaS / DaaS\n• Content creators",
                explanation: "Tech trends shaping entrepreneurship."
            },
            {
                question: "Can an Influencer be an Entrepreneur?",
                answer: "YES! Characteristics:\n• Lower start-up costs than traditional businesses\n• Branding = their personality\n• Profit from ads, sponsored posts, own products\n• Use social media as their platform",
                explanation: "New form of entrepreneurship."
            },
            {
                question: "What are PUSH factors in entrepreneurial migration?",
                answer: "• War\n• Poverty\n• Famine\n• Entrepreneurial traits\n• Previous entrepreneurial skills\n• Available financial and social capital",
                explanation: "Factors that push people to migrate and start businesses."
            },
            {
                question: "What are PULL factors in entrepreneurial migration?",
                answer: "• Safety\n• Pro-entrepreneurship policy\n• Economic opportunity\n• Language accessibility",
                explanation: "Factors that attract entrepreneurs to new locations."
            }
        ],
        
        quiz: [
            {
                question: "According to World Bank, men outnumber women in business ownership:",
                options: [
                    "2 to 1",
                    "3 to 1",
                    "5 to 1",
                    "Equal"
                ],
                correct: 1
            },
            {
                question: "What percentage of VC goes to women entrepreneurs?",
                options: [
                    "About 2.3%",
                    "About 25%",
                    "About 50%",
                    "About 75%"
                ],
                correct: 0
            },
            {
                question: "ESG stands for:",
                options: [
                    "Economic, Social, Growth",
                    "Environmental, Social, Governance",
                    "Entrepreneurial, Strategic, Global",
                    "Equity, Sales, Gross"
                ],
                correct: 1
            },
            {
                question: "Which is a PUSH factor for entrepreneurial migration?",
                options: [
                    "Pro-entrepreneurship policy",
                    "Economic opportunity",
                    "War and poverty",
                    "Safety"
                ],
                correct: 2
            },
            {
                question: "Which is a PULL factor for entrepreneurial migration?",
                options: [
                    "Famine",
                    "War",
                    "Safety and economic opportunity",
                    "Poverty"
                ],
                correct: 2
            },
            {
                question: "An influencer's branding is based on:",
                options: [
                    "Company logo",
                    "Their personality",
                    "Office location",
                    "Employee count"
                ],
                correct: 1
            }
        ],
        
        fillBlanks: [
            {
                sentence: "Men outnumber women _______ to 1 in business ownership.",
                answer: "3",
                hint: "Three..."
            },
            {
                sentence: "ESG stands for Environmental, Social, and _______.",
                answer: "Governance",
                hint: "How company is governed..."
            },
            {
                sentence: "War and poverty are _______ factors in entrepreneurial migration.",
                answer: "push",
                hint: "Forces people away..."
            },
            {
                sentence: "Safety and economic opportunity are _______ factors.",
                answer: "pull",
                hint: "Attracts people..."
            }
        ],
        
        learn: {
            title: "Trends and Gender Gap in Entrepreneurship",
            image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
            content: `
                <h4>Gender Gap in Entrepreneurship:</h4>
                <ul>
                    <li>Men outnumber women <strong>3 to 1</strong> in ownership</li>
                    <li>Only <strong>2.3%</strong> of VC goes to women</li>
                    <li>Only <strong>2%</strong> of women startups reach $1M</li>
                </ul>
                
                <h4>New Trends by Category:</h4>
                <div class="tip-box">
                    <p><strong>Economy:</strong> Creative Economy, FinTech, NFTs<br>
                    <strong>Society:</strong> Ageing, Diversity, Well-being<br>
                    <strong>Environment:</strong> Net zero, ESG<br>
                    <strong>Technology:</strong> Metaverse, Big Data, SaaS, Content creators</p>
                </div>
                
                <h4>Entrepreneurial Migration:</h4>
                <div class="formula-box">
                    <strong>PUSH:</strong> War, Poverty, Famine<br>
                    <strong>PULL:</strong> Safety, Policy, Opportunity
                </div>
                
                <h4>Influencer = Entrepreneur?</h4>
                <p>Yes! Lower costs, personality branding, profit from ads/sponsors/products.</p>
            `
        }
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = entrepreneurshipData;
}
