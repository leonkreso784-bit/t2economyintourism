// ===== MARKETING - SECOND MIDTERM (T9-T13) =====
// Source basis: 4 presentation files (TJ 9 Distribution, 10 Promotion,
// 11 New trends in promotion, 12_13 Planning/Organizing/Controlling).
// Exposed as window.marketingM2Data (catalog resolve: second-midterm).

const marketingM2Data = {
    distribution: {
        id: "vwsjm9",
        name: "Distribution",
        icon: "fa-truck",
        color: "#06b6d4",

        flashcards: [
            {
                id: "l79ban",
                question: "What is distribution in marketing?",
                answer: "All the activities essential for delivering products from manufacturers to consumers. It includes two elements: marketing (distribution) channels and physical distribution.",
                explanation: "Distribution bridges producer and consumer."
            },
            {
                id: "zmh0q1",
                question: "What is the difference between direct and indirect marketing channels?",
                answer: "Direct channels reach consumers without intermediaries (door-to-door, mail order, the manufacturer's own stores). Indirect channels use intermediaries (wholesalers, retailers, agents, brokers).",
                explanation: "Channel decisions also cover the number of channels and the intensity of distribution."
            },
            {
                id: "zk8v00",
                question: "What is distribution channel length?",
                answer: "The number of levels (intermediaries) a channel covers. Shorter channels suit fewer, concentrated consumers; longer channels suit many consumers dispersed over a wide area.",
                explanation: "Length = number of channel levels."
            },
            {
                id: "tvfher",
                question: "What are the three basic functions of distribution channels?",
                answer: "Transactional (buying, selling, risk bearing through stocking), logistical (assembling, storing, transporting, contacting consumers), and facilitating/supporting (market information, promotion, financing).",
                explanation: "Together they deliver products to consumers."
            },
            {
                id: "ehp1jh",
                question: "What are the three intensities of distribution?",
                answer: "Intensive (as many sales points as possible - e.g. newspapers, soft drinks), selective (a limited number of carefully chosen points - e.g. furniture, appliances), and exclusive (exclusive rights for one distributor - e.g. cars, watches).",
                explanation: "Intensity = number of intermediaries on each channel level."
            },
            {
                id: "2raism",
                question: "What is a wholesaler and what functions does it perform?",
                answer: "A wholesaler sells products to business entities that resell or use them. Functions: unify offers from several manufacturers, store and group products, transport them, plus financing, information and promotion.",
                explanation: "Provides a time advantage and a place advantage."
            },
            {
                id: "69pjfw",
                question: "How are intermediaries grouped by whether they take ownership of products?",
                answer: "Intermediaries that take possession (wholesalers, retailers) and those that do not (agents connect buyers and sellers; brokers are in direct contact with sellers and engaged occasionally). Agents and brokers charge a commission.",
                explanation: "Agents/brokers don't own the goods."
            },
            {
                id: "hhhgg6",
                question: "What are the main functions of retailers?",
                answer: "Procuring products from wholesalers/manufacturers, informing consumers, informing manufacturers about consumer needs, effecting payment, ensuring storage and price marking, and carrying out final transactions with consumers.",
                explanation: "Aim: consumer satisfaction and loyalty."
            },
            {
                id: "w36m4y",
                question: "What is physical distribution and its functions?",
                answer: "Activities that reduce delivery costs and raise consumer satisfaction. Functions: transport, warehousing, and inventory management. Process: define goals, order processing/inventory, organize transport, then control results.",
                explanation: "Transport is usually the largest cost share."
            }
        ],

        quiz: [
            {
                id: "wvoy50",
                question: "Distribution activities include two elements:",
                options: ["Advertising and selling", "Marketing channels and physical distribution", "Wholesaling and retailing", "Agents and brokers"],
                correct: 1
            },
            {
                id: "ph6hcq",
                question: "Selling soft drinks and newspapers through as many outlets as possible is:",
                options: ["Exclusive distribution", "Selective distribution", "Intensive distribution", "Direct distribution"],
                correct: 2
            },
            {
                id: "glzbqq",
                question: "Intermediaries that do NOT take possession of products are:",
                options: ["Wholesalers and retailers", "Agents and brokers", "Manufacturers and consumers", "Distributors"],
                correct: 1
            },
            {
                id: "hwljm9",
                question: "Transport, warehousing and inventory management are functions of:",
                options: ["Promotion", "Physical distribution", "Wholesaling", "Personal selling"],
                correct: 1
            },
            {
                id: "1hy9sz",
                question: "A longer distribution channel is suitable when consumers are:",
                options: ["Few and concentrated", "Many and dispersed over a wide area", "All business buyers", "Located next to the producer"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "vpl5ke",
                sentence: "Distribution channels perform transactional, logistical and _______ functions.",
                answer: "facilitating",
                hint: "Supporting; market information, promotion..."
            },
            {
                id: "lhgm42",
                sentence: "_______ distribution gives exclusive rights to sell to a single distributor.",
                answer: "exclusive",
                hint: "e.g. cars, watches..."
            },
            {
                id: "00ixhj",
                sentence: "A _______ sells products to businesses that resell or use them.",
                answer: "wholesaler",
                hint: "Between manufacturer and retailer..."
            },
            {
                id: "r3mepa",
                sentence: "The number of levels covered by a channel is the channel _______.",
                answer: "length",
                hint: "Short vs long..."
            }
        ],

        learn: {
            id: "emcopp",
            title: "Unit 9 - Distribution",
            content: `
                <h3>1) What Distribution Is</h3>
                <p>Distribution brings together all the activities essential for products to be delivered from manufacturers to consumers. It has two elements:</p>
                <ul>
                    <li><strong>Marketing (distribution) channels</strong></li>
                    <li><strong>Physical distribution</strong></li>
                </ul>
                <p>Channels can be <strong>direct</strong> (no intermediaries: door-to-door, mail order, own stores) or <strong>indirect</strong> (with intermediaries). Key decisions: direct vs indirect, one or more channels, and the <em>intensity</em> of distribution.</p>

                <h3>2) Channel Length and Functions</h3>
                <p><strong>Channel length</strong> = the number of levels a channel covers. Shorter channels suit fewer, concentrated consumers; longer channels suit many, dispersed consumers.</p>
                <div class="formula-box">
                    <p>Channels perform three functions: <strong>transactional</strong> (buy, sell, bear risk) + <strong>logistical</strong> (assemble, store, transport, contact) + <strong>facilitating</strong> (information, promotion, financing).</p>
                </div>

                <h3>3) Intensity of Distribution</h3>
                <table>
                    <tr><th>Intensity</th><th>Meaning</th><th>Examples</th></tr>
                    <tr><td><strong>Intensive</strong></td><td>As many sales points as possible</td><td>Newspapers, soft drinks, water</td></tr>
                    <tr><td><strong>Selective</strong></td><td>Limited, carefully selected points</td><td>Furniture, appliances</td></tr>
                    <tr><td><strong>Exclusive</strong></td><td>Exclusive rights to one distributor</td><td>Cars, watches</td></tr>
                </table>
                <p>When choosing a channel, consider its <strong>efficiency</strong> (least resources), <strong>effectiveness</strong> (satisfy the target market), and <strong>adaptability</strong> (adjust to new conditions).</p>

                <h3>4) Wholesalers and Retailers</h3>
                <ul>
                    <li><strong>Wholesalers</strong> sell to businesses that resell/use products; they unify, store, group, and transport products (time and place advantage). They may be independent (take ownership: full-service or limited-service) or dependent (agents and brokers, who earn a commission).</li>
                    <li><strong>Retailers</strong> sell to end consumers; functions: procure products, inform consumers, inform manufacturers about consumer needs, effect payment, store and price-mark, and carry out final transactions. Types: food retailers, retailers of personal/household goods, and non-store retailers.</li>
                </ul>

                <h3>5) Physical Distribution and Trends</h3>
                <p>Physical distribution reduces delivery costs and raises consumer satisfaction. Functions: <strong>transport</strong>, <strong>warehousing</strong>, <strong>inventory management</strong>. Process: define goals -> order processing/inventory -> organize transport -> control and evaluate results.</p>
                <div class="example-box">
                    <p><strong>Trends:</strong> partnerships among chain members, sophisticated technology (databases, demand analysis), portals, and digital marketplaces.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Know direct vs indirect channels, the three channel functions, the three intensities (with examples), wholesaler vs retailer roles, and physical distribution.</p>
                </div>
            `
        }
    },

    promotion: {
        id: "ogbdhm",
        name: "Promotion (IMC)",
        icon: "fa-bullhorn",
        color: "#f43f5e",

        flashcards: [
            {
                id: "jdbd6l",
                question: "What are the elements of the communication process?",
                answer: "Sender, encoding, message, media, decoding, receiver, and feedback - plus interference (noise). Market communication is a two-way process.",
                explanation: "Feedback is what makes it two-way."
            },
            {
                id: "dx15gx",
                question: "What is Integrated Marketing Communication (IMC)?",
                answer: "Treating all promotional activities as a single entity that sends a unified, consistent message across all media to maximize communication impact (a synergistic effect).",
                explanation: "Non-integrated communication leaves consumers confused."
            },
            {
                id: "nspdds",
                question: "What are the objectives of promotional activities?",
                answer: "Provide information, differentiate the product, increase demand (primary = whole category, or secondary = specific brand), stabilize sales (smooth seasonality), and emphasize the product's value.",
                explanation: "Primary vs secondary demand is a common exam point."
            },
            {
                id: "czd0xh",
                question: "What is the difference between push and pull strategy?",
                answer: "Push promotes the product to the next channel member (personal selling, sales promotion). Pull promotes directly to consumers (advertising, sales promotion, PR, publicity). A combination of both is most common.",
                explanation: "Push goes with product flow; pull pulls demand back through the channel."
            },
            {
                id: "41xeoe",
                question: "What are the elements of the promotional mix?",
                answer: "Advertising, personal selling, sales promotion, public relations, and publicity.",
                explanation: "They differ in payment, personalization, and how much the firm controls them."
            },
            {
                id: "ufmuge",
                question: "What is advertising and what are its three functions?",
                answer: "A paid, non-personal presentation of information to many consumers via mass media. Functions: to inform (introduce a product), to persuade (maturity stage), and to remind (brand advertising).",
                explanation: "Two categories: product advertising and business (organization) advertising."
            },
            {
                id: "ubmdu1",
                question: "What is personal selling?",
                answer: "Direct communication between a salesperson and a potential consumer to identify needs and convey product benefits. It includes order taking, order getting (the creative part), and providing support; most used for B2B products.",
                explanation: "Flexible - allows negotiation during contact."
            },
            {
                id: "qrgrlr",
                question: "What is sales promotion and who are its targets?",
                answer: "Short-term techniques that encourage a positive response. Targets: end consumers (coupons, gifts, samples, cash refunds), the trade/shops (in-store displays, rewards), and other B2B operators (trade fairs).",
                explanation: "A short-term stimulus to buy."
            },
            {
                id: "cgq1eo",
                question: "What is the difference between public relations and publicity?",
                answer: "PR is communication a business directly manages to build a positive image (press conferences, events, donations, creating news). Publicity is unpaid media communication the business only indirectly influences.",
                explanation: "PR is managed; publicity is not."
            }
        ],

        quiz: [
            {
                id: "6hz7yq",
                question: "Treating all promotional activities as one unified, consistent message is:",
                options: ["Push strategy", "Integrated Marketing Communication", "Publicity", "Personal selling"],
                correct: 1
            },
            {
                id: "vhzgly",
                question: "Promoting a product directly to consumers to pull demand back through the channel is:",
                options: ["Push strategy", "Pull strategy", "Sales promotion", "Encoding"],
                correct: 1
            },
            {
                id: "ku8xk0",
                question: "A paid, non-personal presentation through the mass media is:",
                options: ["Personal selling", "Publicity", "Advertising", "Public relations"],
                correct: 2
            },
            {
                id: "fbayhc",
                question: "Coupons, free samples and cash refunds are tools of:",
                options: ["Advertising", "Sales promotion", "Public relations", "Personal selling"],
                correct: 1
            },
            {
                id: "0pdhtn",
                question: "Unpaid media communication a business cannot manage is:",
                options: ["Advertising", "Public relations", "Publicity", "Personal selling"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "hbkf0p",
                sentence: "Market communication is a _______-way process (it includes feedback).",
                answer: "two",
                hint: "Sender and receiver both act..."
            },
            {
                id: "ffufy4",
                sentence: "A _______ strategy promotes the product to the next member of the distribution channel.",
                answer: "push",
                hint: "Opposite of pull..."
            },
            {
                id: "9jqk3o",
                sentence: "The three advertising functions are to inform, to persuade and to _______.",
                answer: "remind",
                hint: "Brand advertising..."
            },
            {
                id: "hqwxos",
                sentence: "Public relations is managed by the business; _______ is not.",
                answer: "publicity",
                hint: "Unpaid media coverage..."
            }
        ],

        learn: {
            id: "vgp7oj",
            title: "Unit 10 - Promotion (Integrated Marketing Communication)",
            content: `
                <h3>1) The Communication Process</h3>
                <p>Success in the market is not possible without communication - the transfer of messages between sellers and consumers. It is a <strong>two-way</strong> process.</p>
                <div class="formula-box">
                    <p><strong>Sender -> encoding -> message -> media -> decoding -> receiver -> feedback</strong> (with possible <em>interference / noise</em>).</p>
                </div>

                <h3>2) Integrated Marketing Communication (IMC)</h3>
                <p>IMC treats all promotional activities as a single entity that sends a <strong>unified, consistent message</strong> regardless of media, to maximize impact (synergy). A successful message captures attention, is understood, and prompts a response.</p>

                <h3>3) Objectives and Strategies</h3>
                <ul>
                    <li><strong>Objectives:</strong> inform, differentiate the product, increase demand (primary = category / secondary = brand), stabilize sales, emphasize value.</li>
                    <li><strong>Push strategy:</strong> promote to the next channel member (personal selling, sales promotion).</li>
                    <li><strong>Pull strategy:</strong> promote directly to consumers (advertising, sales promotion, PR, publicity).</li>
                    <li><strong>Combination</strong> of both is most common.</li>
                </ul>

                <h3>4) The Promotional Mix</h3>
                <table>
                    <tr><th>Element</th><th>What it is</th></tr>
                    <tr><td><strong>Advertising</strong></td><td>Paid, non-personal mass-media communication; functions: inform, persuade, remind</td></tr>
                    <tr><td><strong>Personal selling</strong></td><td>Direct salesperson-consumer communication (order taking, order getting, support); mostly B2B</td></tr>
                    <tr><td><strong>Sales promotion</strong></td><td>Short-term techniques to stimulate buying (coupons, gifts, samples, trade fairs)</td></tr>
                    <tr><td><strong>Public relations</strong></td><td>Managed communication to build a positive image</td></tr>
                    <tr><td><strong>Publicity</strong></td><td>Unpaid media communication the firm cannot manage</td></tr>
                </table>

                <h3>5) PR vs Publicity</h3>
                <div class="example-box">
                    <p><strong>PR</strong> is directly managed by the business (press conferences, events, donations, creating news). <strong>Publicity</strong> is in the media's domain - the business has only indirect influence.</p>
                </div>

                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Common Mistake</h4>
                    <p>Don't confuse PR (managed by the firm) with publicity (unpaid, not managed). Both are unpaid, but only PR is controlled.</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Know the communication-process elements, IMC, push vs pull, the five promotional-mix elements, and the PR vs publicity distinction.</p>
                </div>
            `
        }
    },

    newTrendsPromotion: {
        id: "eyea8h",
        name: "New Trends in Promotion",
        icon: "fa-wifi",
        color: "#a855f7",

        flashcards: [
            {
                id: "dsf23p",
                question: "What technological foundation drives new promotional trends?",
                answer: "The Internet, Internet applications, and mobile communication. The Internet provides two key services: the World Wide Web and e-mail.",
                explanation: "Technology directly reshapes advertising and PR."
            },
            {
                id: "gi8xaw",
                question: "What is the difference between Internet, Intranet and Extranet?",
                answer: "Internet = a global network of interconnected computer networks. Intranet = a private network used only within an organization (same standards as the Internet). Extranet = an Intranet extended to authorized outside parties (consumers, suppliers, distributors).",
                explanation: "Scope widens: internal -> partners -> global."
            },
            {
                id: "pqtdwg",
                question: "What is SEO and why does it matter?",
                answer: "Search Engine Optimization - procedures to improve a website's position in search results (Google, Bing, Yahoo) so it attracts more visitors and potential customers.",
                explanation: "Higher ranking means more traffic."
            },
            {
                id: "jy07a3",
                question: "What are the most common Web-based promotion tools?",
                answer: "Banner ads (popular, often with audio/video, need frequent innovation), sponsorship banners (a link to the sponsor's site), and online coupons (a form of sales promotion).",
                explanation: "A Web page is part of the Internet."
            },
            {
                id: "s9ao5p",
                question: "How is e-mail used in promotion?",
                answer: "As a one-to-one, interactive tool for advertising and PR; it builds closer relationships via discussion/mailing lists. Messages should be original, accurate, interesting and short. Consumers can be reluctant (privacy).",
                explanation: "Risk: being perceived as spam."
            },
            {
                id: "ez6q68",
                question: "What is a blog and how is it used in marketing?",
                answer: "Interactive posts (text and sometimes images, video, audio) by a physical or legal person for a target audience; used in advertising and PR, in direct contact with real and potential consumers.",
                explanation: "Often relates the company's product to current events."
            },
            {
                id: "4mnu47",
                question: "What is a newsletter?",
                answer: "An electronic publication on a specific topic (information, advice, opinions) distributed regularly to subscribers (usually free). Consumers are the most important subscribers; also used internally with employees.",
                explanation: "Receiving it requires a subscription."
            },
            {
                id: "5xqjiz",
                question: "What is a webinar?",
                answer: "An online seminar carried out over the Internet; it removes the need for a direct presentation, can be live or downloaded, lowers costs, and enables two-way communication with active audience participation.",
                explanation: "Interactive: questions and discussion."
            },
            {
                id: "bjewo2",
                question: "How are social networks and mobile devices used in promotion?",
                answer: "Social networks (Facebook, Instagram, YouTube, LinkedIn, TikTok, Pinterest...) exchange multimedia and reach people with similar interests; the right choice depends on the company and audience. Mobile marketing targets a specific public, time, location and frequency, with measurable reach.",
                explanation: "Right network choice = company type + intended audience."
            }
        ],

        quiz: [
            {
                id: "5oqzbk",
                question: "A private network used only within an organization is the:",
                options: ["Internet", "Intranet", "Extranet", "Web page"],
                correct: 1
            },
            {
                id: "mqyv1d",
                question: "Improving a website's ranking in search results is:",
                options: ["SEO", "Banner advertising", "A webinar", "A newsletter"],
                correct: 0
            },
            {
                id: "819efr",
                question: "An online seminar enabling two-way, real-time communication is a:",
                options: ["Blog", "Newsletter", "Webinar", "Banner ad"],
                correct: 2
            },
            {
                id: "ll7l8d",
                question: "An electronic publication sent regularly to subscribers is a:",
                options: ["Webinar", "Newsletter", "Banner ad", "Extranet"],
                correct: 1
            },
            {
                id: "ea6ex4",
                question: "The Internet provides two key services:",
                options: ["Intranet and Extranet", "World Wide Web and e-mail", "SEO and banners", "Blog and newsletter"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "8plx7j",
                sentence: "An _______ is an Intranet extended to authorized outside parties such as suppliers.",
                answer: "extranet",
                hint: "Beyond the internal network..."
            },
            {
                id: "k2lfmh",
                sentence: "_______ improves a website's position in search engine results.",
                answer: "SEO",
                hint: "Search Engine Optimization..."
            },
            {
                id: "v9aiyc",
                sentence: "A _______ is an online seminar carried out over the Internet.",
                answer: "webinar",
                hint: "Web + seminar..."
            },
            {
                id: "ybe3s1",
                sentence: "The Internet's two key services are the World Wide Web and _______.",
                answer: "e-mail",
                hint: "Electronic messages..."
            }
        ],

        learn: {
            id: "mqar4y",
            title: "Unit 11 - New Trends in Promotional Activities",
            content: `
                <h3>1) New Technological Solutions</h3>
                <p>Technology - mainly the <strong>Internet, Internet applications and mobile communication</strong> - directly influences new trends in advertising and PR. The Internet (a global network of networks) provides two key services: the <strong>World Wide Web</strong> and <strong>e-mail</strong>.</p>
                <div class="example-box">
                    <p><strong>Internet</strong> = global, public. <strong>Intranet</strong> = private, internal only. <strong>Extranet</strong> = Intranet extended to authorized partners (consumers, suppliers, distributors).</p>
                </div>

                <h3>2) Web Page and SEO</h3>
                <p>A Web page is part of the Internet; designers place key information where readers look first. <strong>SEO (Search Engine Optimization)</strong> improves a site's position in search results (Google, Bing, Yahoo) to attract more visitors and potential customers.</p>
                <p>Common Web promotion tools:</p>
                <ul>
                    <li><strong>Banner ads</strong> - the most popular form; text + audio/video; need frequent innovation</li>
                    <li><strong>Sponsorship banners</strong> - a link to the sponsor's website</li>
                    <li><strong>Online coupons</strong> - a sales-promotion tool</li>
                </ul>

                <h3>3) E-mail, Blog, Newsletter, Webinar</h3>
                <ul>
                    <li><strong>E-mail:</strong> one-to-one, interactive; for advertising and PR; messages must be original, accurate, interesting, short; consumers may resist (privacy).</li>
                    <li><strong>Blog:</strong> interactive posts (text, image, video, audio) by a person or company; direct contact with consumers.</li>
                    <li><strong>Newsletter:</strong> regular electronic publication for subscribers (usually free).</li>
                    <li><strong>Webinar:</strong> online seminar; live or downloadable; lower cost; two-way participation.</li>
                </ul>

                <h3>4) Social Networks and Mobile Devices</h3>
                <p><strong>Social networks</strong> (Facebook, Instagram, YouTube, LinkedIn, TikTok, Pinterest...) exchange multimedia and reach people with similar interests; the right choice depends on the company and audience. <strong>Mobile marketing</strong> is increasingly important on B2B and B2C markets, targeting a specific public, time, location and frequency, with measurable reach.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Distinguish Internet/Intranet/Extranet, define SEO, and be able to describe Web tools (banners, sponsorship banners, online coupons), e-mail, blog, newsletter, webinar, social networks and mobile devices.</p>
                </div>
            `
        }
    },

    marketingPlanning: {
        id: "tfkxok",
        name: "Marketing Planning",
        icon: "fa-clipboard-list",
        color: "#16a34a",

        flashcards: [
            {
                id: "absx39",
                question: "What does managing marketing activities involve?",
                answer: "Planning, organizing and controlling marketing activities so the organization adjusts to environmental changes, anticipates them, and acts proactively rather than reactively.",
                explanation: "Marketing effort = a basis for proactive action."
            },
            {
                id: "ljhn4d",
                question: "What is marketing planning and its purpose?",
                answer: "The process of identifying opportunities and threats and defining the actions needed to achieve marketing objectives. Its purpose is to identify and create competitive advantages.",
                explanation: "Levels: strategic (long, broad) vs tactical (short, narrow)."
            },
            {
                id: "h2ccbt",
                question: "What is the difference between a strategic and an operational marketing plan?",
                answer: "Strategic: general, long-term goals, more important, adapts to the environment, unique risky problems, needs external information, evaluated long-term, sets mission/goals/strategy. Operational: everyday short-term goals, recurring problems, internal information, evaluated immediately, sets marketing tactics (product, price, promotion, channels, services).",
                explanation: "Strategic = direction; operational = tactics."
            },
            {
                id: "exw32f",
                question: "What are the steps of the marketing planning process?",
                answer: "Develop a mission statement, conduct a situation analysis, identify objectives, and formulate strategies.",
                explanation: "Mission -> situation -> objectives -> strategies."
            },
            {
                id: "2sc9uj",
                question: "What is a mission statement and what must it be?",
                answer: "A statement giving a business a clear purpose and focus, making it unique and consumer-oriented. It must be unique, consumer-oriented, based on competencies, and realistic.",
                explanation: "Research links a clear mission to higher average ROI."
            },
            {
                id: "6hyx0w",
                question: "What is SWOT analysis?",
                answer: "A situation analysis of internal factors (Strengths, Weaknesses) and external factors (Opportunities, Threats). It helps plan to overcome weaknesses, diagnose threats early, and spot opportunities.",
                explanation: "Internal: S/W. External: O/T."
            },
            {
                id: "o6bhdt",
                question: "What is the difference between quantitative and qualitative marketing objectives?",
                answer: "Quantitative are measurable numbers (increase sales, profit, market share, satisfaction; cut costs). Qualitative are non-numeric (innovate the offering, new channels, training, brand image, loyalty). Objectives must be measurable, realistic, consistent and hierarchical.",
                explanation: "Every objective answers: what, in what period, how much."
            },
            {
                id: "org19v",
                question: "What is the Ansoff (market/product) matrix?",
                answer: "A tool to choose a strategy: market penetration (existing market + existing product), market development (new market + existing product), product development (existing market + new product), and diversification (new market + new product = highest risk).",
                explanation: "Diversification carries the most risk."
            },
            {
                id: "sh1frl",
                question: "What target-market approaches are chosen in the tactical stage?",
                answer: "Undifferentiated, concentrated, and differentiated marketing approaches, combined with marketing-mix (4P) decisions.",
                explanation: "Tactics cover target-market and marketing-mix strategies."
            }
        ],

        quiz: [
            {
                id: "j5c0av",
                question: "The purpose of marketing planning is to:",
                options: ["Cut all marketing costs", "Identify and create competitive advantages", "Replace the sales force", "Avoid market research"],
                correct: 1
            },
            {
                id: "vu13js",
                question: "SWOT internal factors are:",
                options: ["Opportunities and Threats", "Strengths and Weaknesses", "Sales and Profit", "Mission and Vision"],
                correct: 1
            },
            {
                id: "yc8j10",
                question: "Entering a NEW market with a NEW product (highest risk) is:",
                options: ["Market penetration", "Market development", "Product development", "Diversification"],
                correct: 3
            },
            {
                id: "2tod98",
                question: "Increasing market share by 6% is an example of a:",
                options: ["Qualitative objective", "Quantitative objective", "Mission statement", "Tactic"],
                correct: 1
            },
            {
                id: "mquol3",
                question: "The first step of the marketing planning process is to:",
                options: ["Formulate strategies", "Develop a mission statement", "Take corrective action", "Organize by product"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "u5ynr7",
                sentence: "_______ analysis examines internal strengths/weaknesses and external opportunities/threats.",
                answer: "SWOT",
                hint: "S-W-O-T..."
            },
            {
                id: "iyfnwi",
                sentence: "In the Ansoff matrix, a new market plus a new product is _______.",
                answer: "diversification",
                hint: "Highest-risk strategy..."
            },
            {
                id: "st5ikv",
                sentence: "A _______ statement gives a business a unique, consumer-oriented purpose.",
                answer: "mission",
                hint: "Start of the planning process..."
            },
            {
                id: "c19uww",
                sentence: "Objectives must be measurable, realistic, consistent and _______.",
                answer: "hierarchical",
                hint: "Ordered by level..."
            }
        ],

        learn: {
            id: "nh8ods",
            title: "Unit 12 - Planning Marketing Activities",
            content: `
                <h3>1) Managing Marketing Activities</h3>
                <p>Managing marketing means <strong>planning, organizing and controlling</strong> so the organization adjusts to and anticipates changes in the environment - acting proactively rather than reactively. It should unite strengths, focus on opportunities, and avoid threats.</p>

                <h3>2) Marketing Planning</h3>
                <p>Planning is the process of identifying opportunities and threats and defining actions to achieve objectives; its purpose is to <strong>identify and create competitive advantages</strong>.</p>
                <table>
                    <tr><th></th><th>Strategic plan</th><th>Operational plan</th></tr>
                    <tr><td>Goals</td><td>General, long-term</td><td>Everyday, short-term</td></tr>
                    <tr><td>Time</td><td>Long-term oriented</td><td>Short-term oriented</td></tr>
                    <tr><td>Information</td><td>Mostly external</td><td>Mostly internal</td></tr>
                    <tr><td>Specifies</td><td>Mission, goals, strategy</td><td>Tactics: product, price, promotion, channels</td></tr>
                </table>

                <h3>3) The Planning Process</h3>
                <ul>
                    <li><strong>Develop a mission statement</strong> - what is the company's position?</li>
                    <li><strong>Situation analysis</strong> - where is the company now?</li>
                    <li><strong>Identify objectives</strong> - what needs to be done?</li>
                    <li><strong>Formulate strategies</strong> - which consumer needs to satisfy?</li>
                </ul>

                <h3>4) Mission, SWOT and Objectives</h3>
                <p>A <strong>mission</strong> must be unique, consumer-oriented, competency-based and realistic. <strong>SWOT</strong> analyses internal Strengths/Weaknesses and external Opportunities/Threats.</p>
                <div class="example-box">
                    <p><strong>Objectives</strong> are quantitative (e.g. +6% market share, +4.5% profit) or qualitative (e.g. new channels, stronger brand image). They must be measurable, realistic, consistent and hierarchical.</p>
                </div>

                <h3>5) Formulating Strategies - the Ansoff Matrix</h3>
                <table>
                    <tr><th></th><th>Existing product</th><th>New product</th></tr>
                    <tr><td><strong>Existing market</strong></td><td>Market penetration</td><td>Product development</td></tr>
                    <tr><td><strong>New market</strong></td><td>Market development</td><td>Diversification (highest risk)</td></tr>
                </table>
                <p>In the tactical stage, choose a target-market approach (undifferentiated, concentrated, differentiated) plus marketing-mix strategies.</p>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Know strategic vs operational plans, the four planning steps, mission requirements, SWOT, quantitative vs qualitative objectives, and the four Ansoff strategies.</p>
                </div>
            `
        }
    },

    organizingControlling: {
        id: "a4wtvs",
        name: "Organizing & Controlling",
        icon: "fa-sitemap",
        color: "#eab308",

        flashcards: [
            {
                id: "0ulr7j",
                question: "What is organizing marketing activities?",
                answer: "Delegating and grouping tasks into specific organizational units and allocating the resources to carry them out, so the business can respond quickly and effectively to threats and opportunities.",
                explanation: "Structure depends on the number of markets and products."
            },
            {
                id: "3p8v8b",
                question: "What are the four ways to organize marketing activities?",
                answer: "By functions, by markets/consumers, by products, and matrix organization.",
                explanation: "The choice depends on how many markets and products the firm has."
            },
            {
                id: "xn82ev",
                question: "When is organizing by FUNCTION appropriate?",
                answer: "When the organization is present in a small number of markets with a small number of products. Activities (research, new product development, distribution, promotion, pricing, services) are assigned to marketing-function employees.",
                explanation: "Few markets, few products."
            },
            {
                id: "72pwj8",
                question: "When is organizing by MARKETS/CONSUMERS appropriate?",
                answer: "When present in many markets with few products and specialization by market is required (consumer attributes differ between markets).",
                explanation: "Many markets, few products."
            },
            {
                id: "q2zgx9",
                question: "When is organizing by PRODUCTS appropriate, and who leads?",
                answer: "When present in a small number of markets with many products, especially with innovation/new products. A product manager handles a product or product group from the development stage to the selling stage.",
                explanation: "Few markets, many products."
            },
            {
                id: "sei3mj",
                question: "When is a MATRIX organization used?",
                answer: "When present in several markets with many products. It builds teams of functional specialists plus product specialists; it can involve many experts and respond more rapidly to market changes.",
                explanation: "Many markets, many products."
            },
            {
                id: "9ijtqc",
                question: "What is marketing control?",
                answer: "A process used to monitor the realization of planned objectives and to identify any deviations before they become destructive.",
                explanation: "Compares planned vs actual performance."
            },
            {
                id: "xbpo7e",
                question: "What are the four types of marketing control?",
                answer: "Annual control (annual plan, by management), profitability control (which operations profit or lose), efficiency control (efficiency of marketing investments and costs), and strategic control (best use of market, product and channel opportunities).",
                explanation: "Four lenses on performance."
            },
            {
                id: "hichmq",
                question: "What are the steps of the marketing control process?",
                answer: "Establish performance standards, compare planned vs actual performance, and take corrective action (modify objectives, standards, the marketing mix, strategies, or the organization).",
                explanation: "Common parameters: sales, profit, marketing costs, positioning, loyalty."
            }
        ],

        quiz: [
            {
                id: "yz69hg",
                question: "Building teams of functional and product specialists for many markets and many products is:",
                options: ["Organizing by function", "Organizing by products", "Matrix organization", "Organizing by markets"],
                correct: 2
            },
            {
                id: "oaljku",
                question: "Organizing by FUNCTION suits a company with:",
                options: ["Many markets and many products", "A small number of markets and products", "New markets only", "No products"],
                correct: 1
            },
            {
                id: "buo9xm",
                question: "Identifying which operations generate profit or loss is:",
                options: ["Annual control", "Profitability control", "Efficiency control", "Strategic control"],
                correct: 1
            },
            {
                id: "n8d6yh",
                question: "The marketing control process begins by:",
                options: ["Taking corrective action", "Establishing performance standards", "Comparing competitors", "Cutting prices"],
                correct: 1
            },
            {
                id: "qopv99",
                question: "A product manager leading a product from development to selling reflects organizing by:",
                options: ["Function", "Markets", "Products", "Geography"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "smcnu1",
                sentence: "Organizing marketing activities means delegating and grouping tasks and allocating _______.",
                answer: "resources",
                hint: "What is needed to carry the tasks out..."
            },
            {
                id: "675v5g",
                sentence: "_______ organization combines functional and product specialists for many markets and products.",
                answer: "matrix",
                hint: "A grid of two dimensions..."
            },
            {
                id: "7fy0sv",
                sentence: "Marketing control identifies _______ before they become destructive.",
                answer: "deviations",
                hint: "Gaps between planned and actual..."
            },
            {
                id: "ancd9d",
                sentence: "The four types of control are annual, profitability, efficiency and _______ control.",
                answer: "strategic",
                hint: "Best use of market/product opportunities..."
            }
        ],

        learn: {
            id: "ifwgnw",
            title: "Unit 13 - Organizing and Controlling Marketing Activities",
            content: `
                <h3>1) Organizing Marketing Activities</h3>
                <p>Organizing means <strong>delegating and grouping tasks</strong> into organizational units and <strong>allocating resources</strong>, so the business can respond quickly to threats and opportunities. The structure depends on how many markets and products the firm has.</p>
                <table>
                    <tr><th>Form</th><th>Best when...</th></tr>
                    <tr><td><strong>By function</strong></td><td>Few markets, few products</td></tr>
                    <tr><td><strong>By markets/consumers</strong></td><td>Many markets, few products</td></tr>
                    <tr><td><strong>By products</strong></td><td>Few markets, many products (product manager leads)</td></tr>
                    <tr><td><strong>Matrix</strong></td><td>Many markets, many products (functional + product specialists)</td></tr>
                </table>

                <h3>2) Marketing Control</h3>
                <p>Marketing control monitors the realization of planned objectives and identifies <strong>deviations before they become destructive</strong>. There are four types:</p>
                <ul>
                    <li><strong>Annual control</strong> - of the annual plan, by management</li>
                    <li><strong>Profitability control</strong> - which operations profit or lose</li>
                    <li><strong>Efficiency control</strong> - efficiency of marketing investments and the impact of costs</li>
                    <li><strong>Strategic control</strong> - best use of market, product and channel opportunities</li>
                </ul>

                <h3>3) The Marketing Control Process</h3>
                <div class="formula-box">
                    <p><strong>Establish performance standards -> compare planned vs actual -> take corrective action.</strong></p>
                </div>
                <ul>
                    <li><strong>Common parameters:</strong> sales, profit, marketing costs, product positioning, consumer loyalty.</li>
                    <li><strong>Comparison with competitors:</strong> sales/cost analysis, profit, market share, new product and channel development.</li>
                    <li><strong>Corrections</strong> modify objectives, performance standards, the marketing mix, strategies, or the organization of marketing activities.</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Midterm Focus</h4>
                    <p>Match each organizing form to its market/product situation, list the four control types, and reproduce the three-step control process.</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.marketingM2Data = marketingM2Data; }
