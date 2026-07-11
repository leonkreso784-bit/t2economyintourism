// ===== SPECIAL INTEREST TOURISM — 1st MIDTERM (K1) =====
// Source: lecture slides 1–6 (Prof. B. Pavlakovič Farrell / J. Dorčić, FMTU, 1st year HM).
// K1 boundary from the syllabus schedule: everything taught BEFORE the 1st midterm exam —
// Introduction to tourism, Destination management, From mass/over-tourism to SIT,
// Business tourism, Cultural tourism, Industrial tourism.

const sitM1 = {

    // ========== CATEGORY 1: INTRODUCTION TO TOURISM & SUSTAINABILITY ==========
    intro: {
        id: "f35iqf",
        name: "Introduction to Tourism",
        icon: "fa-earth-americas",
        color: "#3b82f6",

        flashcards: [
            {
                id: "v2hp0s",
                question: "What is the difference between TRAVEL and TOURISM?",
                answer: "TRAVEL = the activity of travellers; a TRAVELLER is anyone moving between geographic locations for ANY purpose and ANY duration.\n\nTOURISM = the activity of VISITORS. Tourism is therefore a SUBSET of travel, and visitors are a subset of travellers.",
                explanation: "Key framing from the UN International Recommendations for Tourism Statistics (2008)."
            },
            {
                id: "9fvbf2",
                question: "What is a VISITOR, and how is a TOURIST different from an EXCURSIONIST?",
                answer: "A VISITOR is a traveller taking a trip to a main destination OUTSIDE their usual environment, for LESS THAN A YEAR, for any purpose other than being employed by a resident entity there.\n\n• TOURIST (overnight visitor) = the trip INCLUDES an overnight stay\n• SAME-DAY VISITOR / EXCURSIONIST = no overnight stay",
                explanation: "Overnight stay is the dividing line between tourist and excursionist."
            },
            {
                id: "c3llyk",
                question: "What are the 3 BASIC FORMS of tourism (by country of reference)?",
                answer: "1. DOMESTIC tourism — resident visitor WITHIN the country of reference\n2. INBOUND tourism — NON-resident visitor within the country of reference\n3. OUTBOUND tourism — resident visitor OUTSIDE the country of reference",
                explanation: "Defined relative to the 'country of reference'."
            },
            {
                id: "hqa2qt",
                question: "How do the 3 basic forms combine into INTERNAL, NATIONAL and INTERNATIONAL tourism?",
                answer: "• INTERNAL = DOMESTIC + INBOUND (all activity within the country)\n• NATIONAL = DOMESTIC + OUTBOUND (all activity of residents)\n• INTERNATIONAL = INBOUND + OUTBOUND (all cross-border activity)",
                explanation: "Three derived forms built from the three basic ones."
            },
            {
                id: "dndq8o",
                question: "What is a TOURISM DESTINATION (UN Tourism)?",
                answer: "A PHYSICAL SPACE (with or without administrative boundaries) in which a visitor can spend an OVERNIGHT.\n\nIt is the cluster (co-location) of products, services, activities and experiences along the tourism value chain, and the basic unit of analysis of tourism. It is also intangible — its IMAGE and IDENTITY influence its market competitiveness.",
                explanation: "A destination can be a country, region, island, town or a self-contained centre."
            },
            {
                id: "ih8v03",
                question: "What is SUSTAINABLE TOURISM?",
                answer: "\"Tourism that takes full account of its current and future ECONOMIC, SOCIAL and ENVIRONMENTAL impacts, addressing the needs of visitors, the industry, the environment and host communities\" (UNWTO, 2005).",
                explanation: "The three pillars: economic, social, environmental."
            },
            {
                id: "oyf6in",
                question: "What is a TOURISM PRODUCT?",
                answer: "A combination of TANGIBLE and INTANGIBLE elements — natural, cultural and man-made resources, attractions, facilities, services and activities — around a specific centre of interest.\n\nIt is the core of the destination marketing mix, creates an overall visitor experience, is priced and sold through distribution channels, and has a LIFE-CYCLE.",
                explanation: "Tangible + intangible around a 'centre of interest'."
            },
            {
                id: "71l866",
                question: "How many SDGs are there, and how does tourism relate to them?",
                answer: "There are 17 interrelated Sustainable Development Goals (169 targets, 231 indicators).\n\nThe 'SDGs Wedding Cake' shows three pillars: ENVIRONMENT (biosphere) as the base, SOCIETY as the middle layer, ECONOMY at the top. Well-managed tourism can advance all 17 SDGs when sustainability is a shared responsibility.",
                explanation: "17 SDGs; tourism cuts across the environment–society–economy pillars."
            },
            {
                id: "038bs1",
                question: "What is the TOURISM VALUE CHAIN?",
                answer: "The sequence of PRIMARY and SUPPORT activities strategically fundamental to the tourism sector's performance.\n\n• PRIMARY: policy & planning, product development & packaging, promotion & marketing, distribution & sales, destination operations & services\n• SUPPORT: transport & infrastructure, HR development, technology & systems, complementary goods/services",
                explanation: "Used to trace income flow and find collaborative value."
            }
        ],

        quiz: [
            {
                id: "cb62m1",
                question: "Tourism is best described as:",
                options: [
                    "A superset of travel",
                    "A subset of travel (the activity of visitors)",
                    "Identical to travel",
                    "Unrelated to travel"
                ],
                correct: 1
            },
            {
                id: "1fd7r7",
                question: "A visitor who does NOT stay overnight is a:",
                options: [
                    "Tourist",
                    "Excursionist (same-day visitor)",
                    "Migrant",
                    "Border worker"
                ],
                correct: 1
            },
            {
                id: "rcedyj",
                question: "A non-resident visiting the country of reference is part of:",
                options: [
                    "Domestic tourism",
                    "Outbound tourism",
                    "Inbound tourism",
                    "National tourism"
                ],
                correct: 2
            },
            {
                id: "ycqvys",
                question: "INTERNAL tourism combines:",
                options: [
                    "Domestic + outbound",
                    "Domestic + inbound",
                    "Inbound + outbound",
                    "Only domestic"
                ],
                correct: 1
            },
            {
                id: "uza32x",
                question: "How many Sustainable Development Goals (SDGs) are there?",
                options: ["10", "15", "17", "21"],
                correct: 2
            },
            {
                id: "20k8co",
                question: "Which is NOT one of the three pillars of sustainable tourism?",
                options: [
                    "Economic",
                    "Social",
                    "Environmental",
                    "Political"
                ],
                correct: 3
            },
            {
                id: "821l40",
                question: "A tourism destination is defined as a physical space where a visitor can:",
                options: [
                    "Only pass through",
                    "Spend an overnight",
                    "Work permanently",
                    "Change residence"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "u1v8lu",
                sentence: "Tourism is the activity of _______ (a subset of travellers).",
                answer: "visitors",
                hint: "Not all travellers..."
            },
            {
                id: "5zvl36",
                sentence: "A visitor who stays overnight is a tourist; one who does not is an _______.",
                answer: "excursionist",
                hint: "Same-day visitor..."
            },
            {
                id: "7e6bal",
                sentence: "The three basic forms of tourism are domestic, inbound and _______.",
                answer: "outbound",
                hint: "Residents leaving the country..."
            },
            {
                id: "ic5vq0",
                sentence: "There are _______ Sustainable Development Goals.",
                answer: "17",
                hint: "Number..."
            },
            {
                id: "46xrjo",
                sentence: "A tourism _______ is a combination of tangible and intangible elements with a life-cycle.",
                answer: "product",
                hint: "Priced and sold..."
            }
        ],

        learn: {
            id: "9dstam",
            title: "Introduction to Tourism and Sustainability",
            content: `
                <h3>Key Definitions (UN, 2010)</h3>
                <div class="formula-box">
                    TRAVEL = activity of travellers (any purpose, any duration)<br>
                    TOURISM = activity of VISITORS → a <strong>subset</strong> of travel<br>
                    TOURIST = overnight visitor · EXCURSIONIST = same-day visitor
                </div>

                <h4>Forms of Tourism</h4>
                <ul>
                    <li><strong>Basic:</strong> Domestic · Inbound · Outbound</li>
                    <li><strong>Derived:</strong> Internal (D+I) · National (D+O) · International (I+O)</li>
                </ul>

                <h4>Destination & Product</h4>
                <p>A <span class="highlight">tourism destination</span> is a physical space where a visitor can spend
                an overnight — a cluster of products and experiences whose image/identity drives competitiveness.
                A <span class="highlight">tourism product</span> combines tangible + intangible elements and has a life-cycle.</p>

                <h4>Sustainability & SDGs</h4>
                <div class="tip-box">
                    <p>Sustainable tourism balances <strong>economic, social and environmental</strong> impacts.
                    The <strong>17 SDGs</strong> ('Wedding Cake': environment → society → economy) can all be
                    advanced by well-managed tourism.</p>
                </div>

                <h4>Tourism Value Chain</h4>
                <p>Primary activities (policy, product, marketing, distribution, operations) + support activities
                (transport, HR, technology) — used to trace income and create collaborative value.</p>
            `
        }
    },

    // ========== CATEGORY 2: DESTINATION MANAGEMENT ==========
    destination: {
        id: "ju8z77",
        name: "Destination Management",
        icon: "fa-map-location-dot",
        color: "#8b5cf6",

        flashcards: [
            {
                id: "ov5u8d",
                question: "What are the 6 ELEMENTS of a tourism destination (WTO, 2007)?",
                answer: "1. ATTRACTIONS (natural or cultural; the main pull motive)\n2. PUBLIC & PRIVATE AMENITIES (infrastructure + private providers)\n3. ACCESSIBILITY (how tourists reach and move around)\n4. HUMAN RESOURCES (trained staff + welcoming local community)\n5. IMAGE & CHARACTER (awareness + matching expectations)\n6. PRICE (costs, exchange rates, profit to reinvest)",
                explanation: "Sometimes remembered as the 6 A's: Attractions, Amenities, Access, ... + HR, Image, Price."
            },
            {
                id: "n28zmi",
                question: "What is DESTINATION MANAGEMENT (WTO, 2007)?",
                answer: "The COORDINATED management of all the elements that make up a destination (attractions, amenities, access, marketing, HR, pricing).\n\nIt takes a STRATEGIC approach to link separate entities, avoids duplication (promotion, visitor services, training) and identifies management gaps.",
                explanation: "'Joined-up' coordinated management of all destination elements."
            },
            {
                id: "kvnwsc",
                question: "What is a DMO?",
                answer: "A DESTINATION MANAGEMENT ORGANISATION — the 'manager' of the destination.\n\nIt plans the development of the destination, promotes it, and acts as the 'GLUE' between all stakeholders. It uses STRATEGIC PLANNING (long-term planning toward strategic goals, a united vision, consistency of action, quality).",
                explanation: "Considers how ENDS (goals) are achieved by MEANS (resources) in a given time."
            },
            {
                id: "18s7zt",
                question: "What are the 4 STEPS of strategic planning in a destination?",
                answer: "1. SITUATION ANALYSIS — assessing the destination's competitiveness\n2. STRATEGIC FRAMEWORK — vision, goals, objectives, core strategies\n3. IMPLEMENTATION — turning visions/goals into actions\n4. MEASURING effects and performance",
                explanation: "Analyse → frame → implement → measure."
            },
            {
                id: "53i6az",
                question: "What are the key TASKS of a DMO?",
                answer: "a) Destination PLANNING & development (infrastructure, zoning, environment, product)\nb) MARKETING & branding (digital/social, events, partnerships, targeted ads)\nc) STAKEHOLDER collaboration & governance\nd) SUSTAINABLE tourism practices\ne) CRISIS & risk management",
                explanation: "Five core task areas of destination management."
            },
            {
                id: "g4aupc",
                question: "What are the main CHALLENGES in destination management?",
                answer: "• OVERTOURISM — overcrowding, environmental degradation, resident dissatisfaction\n• ENVIRONMENTAL concerns — pollution, deforestation, habitat loss\n• ECONOMIC DEPENDENCE on tourism — vulnerability to external shocks (need diversification)\n• POLITICAL & SOCIAL instability — unrest, terrorism, health crises (e.g. COVID-19)",
                explanation: "Four recurring challenges."
            },
            {
                id: "civv4m",
                question: "What are the future TRENDS in destination management?",
                answer: "• SMART destinations & digital innovation (big data, AI, AR/VR, contactless)\n• REGENERATIVE tourism (leave the destination better than before)\n• INCLUSIVE & accessible tourism\n• LOCAL & SLOW tourism (quality over quantity, authentic immersive experiences)",
                explanation: "Smart, regenerative, inclusive, slow."
            }
        ],

        quiz: [
            {
                id: "8dr57j",
                question: "Which is NOT one of the 6 elements of a tourism destination?",
                options: [
                    "Attractions",
                    "Accessibility",
                    "Advertising budget",
                    "Human resources"
                ],
                correct: 2
            },
            {
                id: "ixt6u3",
                question: "A DMO is best described as the destination's:",
                options: [
                    "Only hotel chain",
                    "Coordinating 'glue' between all stakeholders",
                    "National government",
                    "Largest airline"
                ],
                correct: 1
            },
            {
                id: "dewqib",
                question: "The 4 steps of strategic planning begin with:",
                options: [
                    "Implementation",
                    "Situation analysis",
                    "Measuring performance",
                    "Branding"
                ],
                correct: 1
            },
            {
                id: "uw78m5",
                question: "Which is a CHALLENGE in destination management?",
                options: [
                    "Regenerative tourism",
                    "Overtourism",
                    "Smart destinations",
                    "Slow tourism"
                ],
                correct: 1
            },
            {
                id: "poxdfy",
                question: "'Leaving a destination better than before' describes:",
                options: [
                    "Mass tourism",
                    "Regenerative tourism",
                    "Overtourism",
                    "Fordism"
                ],
                correct: 1
            },
            {
                id: "td2z85",
                question: "Attractions in a destination can be classified as:",
                options: [
                    "Cheap or expensive",
                    "Natural or cultural",
                    "Public or private only",
                    "Domestic or inbound"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "b20jg4",
                sentence: "_______ are the main pull motive for tourists to visit a destination.",
                answer: "Attractions",
                hint: "Natural or cultural..."
            },
            {
                id: "uh34h5",
                sentence: "A _______ (DMO) is the 'glue' between all destination stakeholders.",
                answer: "Destination Management Organisation",
                hint: "Three words / abbreviation..."
            },
            {
                id: "y9rbpa",
                sentence: "Strategic planning starts with a situation _______.",
                answer: "analysis",
                hint: "Assessing competitiveness..."
            },
            {
                id: "zq1tp4",
                sentence: "_______ tourism aims to leave a destination better than before.",
                answer: "Regenerative",
                hint: "Beyond merely sustainable..."
            },
            {
                id: "5gp4jl",
                sentence: "Overreliance on tourism creates economic _______ to external shocks.",
                answer: "dependence",
                hint: "Vulnerability..."
            }
        ],

        learn: {
            id: "qn31db",
            title: "Destination Management",
            content: `
                <h3>What Makes a Destination?</h3>
                <div class="formula-box">
                    <strong>6 elements (WTO 2007):</strong> Attractions · Amenities (public & private) ·
                    Accessibility · Human Resources · Image & Character · Price
                </div>

                <h4>Destination Management & the DMO</h4>
                <p>Coordinated management of all destination elements, taking a strategic approach.
                The <span class="highlight">DMO</span> plans, promotes and links stakeholders — the 'glue'.</p>

                <h4>4 Steps of Strategic Planning</h4>
                <div class="tip-box">
                    <p>1. Situation analysis → 2. Strategic framework (vision/goals) →
                    3. Implementation → 4. Measuring performance</p>
                </div>

                <h4>DMO Tasks</h4>
                <ul>
                    <li>Planning & development · Marketing & branding · Stakeholder governance</li>
                    <li>Sustainable practices · Crisis & risk management</li>
                </ul>

                <h4>Challenges vs Future Trends</h4>
                <div class="example-box">
                    <p><strong>Challenges:</strong> overtourism · environment · economic dependence · instability</p>
                    <p><strong>Trends:</strong> smart destinations · regenerative · inclusive/accessible · slow tourism</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 3: FROM MASS & OVERTOURISM TO SIT ==========
    massToSit: {
        id: "77zvqu",
        name: "From Mass Tourism to SIT",
        icon: "fa-people-group",
        color: "#ef4444",

        flashcards: [
            {
                id: "mcf235",
                question: "What is MASS TOURISM?",
                answer: "A QUANTITATIVE notion based on the proportion of the population participating in tourism or the volume of tourist activity (Burkart & Medlik, 1974).\n\nIt means 'extreme concentrations of tourists in one place, resulting in SATURATION'. It can't be tied to fixed numbers — every destination has a different CARRYING CAPACITY.\n\nOrigins: Thomas Cook's first organized group tour (1851); developed in Western societies from the 1950s.",
                explanation: "Mass tourism = volume + saturation relative to carrying capacity."
            },
            {
                id: "4ululc",
                question: "What is FORDISM in tourism?",
                answer: "A stage of 20th-century economic development = the system of MASS PRODUCTION (pioneered by Ford).\n\nIn tourism, Fordist systems secure ECONOMIES OF SCALE through large-scale, STANDARDISED and inflexible products — typified by low-cost INCLUSIVE PACKAGE HOLIDAYS from tour operators, who can dominate the distribution chain and depress prices paid to local hotels.",
                explanation: "Standardised package holidays = the Fordist model of tourism."
            },
            {
                id: "fznymo",
                question: "What are LEAKAGES in tourism?",
                answer: "The part of the price of the holiday paid by tourists that LEAVES or never reaches the destination, due to foreign-based transactions (Mitchell & Page, 2005; Meyer, 2006).\n\nExample: eating at McDonald's, staying at a Hilton, or buying Coke — most of the money goes back to the origin country.",
                explanation: "Income that escapes the local economy."
            },
            {
                id: "ef46j0",
                question: "What is OVERTOURISM?",
                answer: "Term coined by Skift (2016). 'The impact of tourism on a destination that EXCESSIVELY influences the perceived QUALITY OF LIFE of citizens and/or the quality of visitor experiences in a NEGATIVE way.'\n\nIt is a new buzzword for existing concepts of tourism CONGESTION MANAGEMENT and CARRYING CAPACITY (UNWTO 2019).",
                explanation: "The opposite of Responsible Tourism."
            },
            {
                id: "4xrh33",
                question: "What is Doxey's IRRIDEX, and what is 'tourismophobia'?",
                answer: "Doxey's IRRITATION INDEX (Irridex, 1975) describes how residents' attitudes EVOLVE over time in response to tourism (from euphoria → apathy → irritation → antagonism).\n\nTOURISMOPHOBIA ('turistofobia', Delgado 2008) describes the antagonistic relationship and escalating tensions between local hosts and incoming tourists (e.g. 'tourists go home' banners; Barcelona after the 1992 Olympics).",
                explanation: "Irridex tracks the escalation; tourismophobia is the extreme stage."
            },
            {
                id: "a0n1k2",
                question: "What is CARRYING CAPACITY (UNWTO)?",
                answer: "\"The maximum number of people that may visit a tourist destination at the same time, without causing destruction of the physical, economic and socio-cultural environment and an unacceptable decrease in the quality of visitors' satisfaction\" (UNWTO, 2004).",
                explanation: "Key to managing congestion and overtourism."
            },
            {
                id: "et9lt2",
                question: "What is SPECIAL INTEREST TOURISM (SIT)?",
                answer: "Tourism that occurs when the traveller's MOTIVATION and decision-making are primarily determined by a PARTICULAR SPECIAL INTEREST, with a focus on activity/ies and/or destinations/settings (Hall & Weiler, 1992).\n\nTourists seek emotional stimuli and experiences ('buy feelings, not products'). Often used as a synonym for NICHE tourism. It reflects the increasing diversity of interests of the late-modern leisure society.",
                explanation: "Interest/activity drives the decision — not the destination."
            },
            {
                id: "cj5k64",
                question: "What is the decision-making difference between GIT, MIT and SIT?",
                answer: "• GIT (General Interest): 'WHERE would I like to go?' — destination first\n• MIT (Mixed Interest): 'Where do I want to go AND what activities can I pursue there?'\n• SIT (Special Interest): 'WHAT interest/activity do I want to pursue, and WHERE can I do it?' — interest first\n\nFor SITs, the destination is no longer primary — the interest/activity is.",
                explanation: "The shift from destination-led to interest-led decisions."
            },
            {
                id: "o2js58",
                question: "How do General Interest vs Special Interest tourists differ?",
                answer: "GENERAL INTEREST tourist: majority of travellers; lower/lower-middle income; price-sensitive; inexperienced; psychocentric; wants 'fashionable' destinations + high-quality accommodation.\n\nSPECIAL INTEREST tourist: a MINORITY; middle/upper-middle income; LESS price-sensitive; experienced & sophisticated; allocentric/adventurous; high expectations of the activity (not necessarily accommodation); destinations are just contexts for the interest.",
                explanation: "Allocentric/experienced (SIT) vs psychocentric/price-sensitive (GIT)."
            },
            {
                id: "h6cn4t",
                question: "What are Cohen's 4 TOURIST ROLES (1972)?",
                answer: "1. ORGANIZED MASS TOURIST — all-inclusive tour, 'environmental bubble', max familiarity\n2. INDIVIDUAL MASS TOURIST — booked via operator but not bound to a group; slightly more novelty\n3. EXPLORER — arranges own travel, avoids 'the beaten track', some familiarity (comfortable base)\n4. DRIFTER — max novelty, immersed in local culture, shuns the tourist establishment",
                explanation: "From familiarity (mass) to novelty (drifter)."
            },
            {
                id: "wmrcau",
                question: "What are the 4 levels of SIT participant intensity (Brotherton & Himmetoglu, 1997)?",
                answer: "1. BEGINNERS — motivated to pursue a potential interest\n2. ENTHUSIASTS — chose a fitting interest, know its boundaries\n3. EXPERTS — selected and 'claimed' a special interest; wide knowledge\n4. FANATICS — devoted to the field, described by others as 'crazy'",
                explanation: "Increasing depth of knowledge, skill and commitment."
            }
        ],

        quiz: [
            {
                id: "jfph3n",
                question: "Mass tourism is essentially a:",
                options: [
                    "Qualitative notion",
                    "Quantitative notion based on volume/saturation",
                    "Type of luxury tourism",
                    "Government policy"
                ],
                correct: 1
            },
            {
                id: "sgaukc",
                question: "Standardised, inflexible low-cost package holidays are typical of:",
                options: [
                    "Special interest tourism",
                    "The Fordist model",
                    "Regenerative tourism",
                    "Slow tourism"
                ],
                correct: 1
            },
            {
                id: "bnwd6e",
                question: "Money that leaves or never reaches a destination is called:",
                options: [
                    "Carrying capacity",
                    "Leakage",
                    "Multiplier",
                    "Yield"
                ],
                correct: 1
            },
            {
                id: "p2azbs",
                question: "The term 'overtourism' was coined in 2016 by:",
                options: [
                    "UNWTO",
                    "Skift",
                    "Thomas Cook",
                    "Doxey"
                ],
                correct: 1
            },
            {
                id: "3q9ezo",
                question: "Doxey's Irridex describes:",
                options: [
                    "Hotel pricing",
                    "How residents' attitudes to tourism evolve over time",
                    "Carrying capacity formulas",
                    "Tourist spending"
                ],
                correct: 1
            },
            {
                id: "18txi2",
                question: "For a Special Interest Tourist, the primary decision driver is:",
                options: [
                    "The destination",
                    "The price",
                    "The interest/activity",
                    "The accommodation quality"
                ],
                correct: 2
            },
            {
                id: "hk5puz",
                question: "In Cohen's typology, the tourist seeking maximum novelty and immersion is the:",
                options: [
                    "Organized mass tourist",
                    "Individual mass tourist",
                    "Explorer",
                    "Drifter"
                ],
                correct: 3
            },
            {
                id: "wc71to",
                question: "A SIT participant 'devoted to the field and described by others as crazy' is a:",
                options: [
                    "Beginner",
                    "Enthusiast",
                    "Expert",
                    "Fanatic"
                ],
                correct: 3
            }
        ],

        fillBlanks: [
            {
                id: "rm38cs",
                sentence: "Mass tourism results in the _______ of a destination beyond its carrying capacity.",
                answer: "saturation",
                hint: "Overcrowding/overload..."
            },
            {
                id: "dlj3vd",
                sentence: "_______ is the part of the holiday price that never reaches the destination.",
                answer: "Leakage",
                hint: "Money escaping..."
            },
            {
                id: "j8az8p",
                sentence: "The term overtourism was coined by _______ in 2016.",
                answer: "Skift",
                hint: "A travel media company..."
            },
            {
                id: "3cx79d",
                sentence: "Doxey's _______ Index tracks residents' evolving attitudes to tourism.",
                answer: "Irritation",
                hint: "Irridex..."
            },
            {
                id: "gxims5",
                sentence: "For SIT tourists the _______ drives the decision, not the destination.",
                answer: "interest",
                hint: "The special activity..."
            },
            {
                id: "c2hyhj",
                sentence: "Cohen's tourist seeking maximum familiarity on an all-inclusive tour is the organized _______ tourist.",
                answer: "mass",
                hint: "Opposite of drifter..."
            }
        ],

        learn: {
            id: "9gwjd4",
            title: "From Mass & Overtourism to Special Interest Tourism",
            content: `
                <h3>Mass Tourism</h3>
                <div class="formula-box">
                    Quantitative notion → volume + <strong>saturation</strong> vs carrying capacity<br>
                    Origin: Thomas Cook (1851); boom from the 1950s<br>
                    <strong>Fordism:</strong> standardised, inflexible, low-cost package holidays
                </div>

                <h4>The Problems</h4>
                <ul>
                    <li><strong>Leakages</strong> — money that escapes the local economy</li>
                    <li><strong>Overtourism</strong> (Skift, 2016) — excessive negative impact on quality of life</li>
                    <li><strong>Doxey's Irridex</strong> → 'tourismophobia' (e.g. Barcelona)</li>
                    <li><strong>Carrying capacity</strong> — the max visitors without destruction/dissatisfaction</li>
                </ul>

                <h4>Special Interest Tourism (SIT)</h4>
                <div class="tip-box">
                    <p>Motivation driven by a <strong>particular special interest</strong> (≈ niche tourism).
                    Decision logic: GIT 'where?' → MIT 'where + what?' → <strong>SIT 'what interest, then where?'</strong></p>
                </div>

                <h4>Typologies</h4>
                <div class="example-box">
                    <p><strong>Cohen (1972):</strong> organized mass → individual mass → explorer → drifter
                    (familiarity → novelty)</p>
                    <p><strong>Intensity:</strong> beginner → enthusiast → expert → fanatic</p>
                    <p><strong>SIT tourist:</strong> minority, less price-sensitive, experienced, allocentric</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 4: BUSINESS TOURISM (MICE) ==========
    business: {
        id: "f5jvgl",
        name: "Business Tourism (MICE)",
        icon: "fa-briefcase",
        color: "#0ea5e9",

        flashcards: [
            {
                id: "jdt3ak",
                question: "What is BUSINESS TOURISM?",
                answer: "A type of tourism activity in which visitors travel for a specific PROFESSIONAL and/or BUSINESS purpose to a place outside their workplace and residence, to attend a meeting, activity or event (UNWTO, 2019).\n\nKey components: MEETINGS, INCENTIVES, CONFERENCES and EXHIBITIONS. It can be combined with other tourism types on the same trip.",
                explanation: "Travel for a professional/business purpose."
            },
            {
                id: "xpmkpv",
                question: "What does MICE stand for, and what's the problem with the term?",
                answer: "M = MEETINGS, I = INCENTIVES, C = CONFERENCES (or Congresses), E = EXHIBITIONS (or Events).\n\nPROBLEM: there's no universally agreed definition, and almost no one outside the industry understands it — it's even criticised for its association with rodents/vermin. Alternatives: 'the meetings industry' (introduced 2006), 'business events' (Australia/Canada).",
                explanation: "MICE is catchy but poorly understood outside the trade."
            },
            {
                id: "n08bzh",
                question: "How does the SILK ROUTE relate to business travel history?",
                answer: "In the Middle Ages the Silk Route was perhaps the greatest business travel route of all time. It was important in two ways:\n1. It stimulated SUPPORT SYSTEMS for business travellers (accommodation/restaurants — the 'Caravanserai', camel traders, guides).\n2. It moved IDEAS and INVENTIONS (gunpowder, astronomy, medicine) between Asia and Europe, and created major trading cities (e.g. Istanbul).",
                explanation: "Business travel is ancient — it began with trade."
            },
            {
                id: "jofgx6",
                question: "What are the main differences between LEISURE and BUSINESS tourism (demand side)?",
                answer: "• WHO PAYS: leisure = the tourist; business = the employer/association (not the traveller)\n• WHO DECIDES the destination: leisure = the tourist; business = the meeting/event organizer\n• WHEN: leisure = holiday periods & weekends; business = all year, Mon–Fri (July/August avoided)\n• DESTINATIONS: leisure = all kinds; business = mostly towns/cities in industrialized countries",
                explanation: "Different payer, decider, timing and destinations."
            },
            {
                id: "blnqnh",
                question: "Why is business tourism BENEFICIAL for destinations?",
                answer: "• Tends to visit in OFF-PEAK season\n• Relatively HIGH per-head per-day expenditure\n• Business tourists are relatively WELL BEHAVED\n• Brings business to many local suppliers (printers, florists, sign-makers…)\n• Helps fund infrastructure (e.g. airports) and community leisure facilities",
                explanation: "High spend, off-peak, low impact — destinations love it."
            },
            {
                id: "sbjko6",
                question: "Distinguish CONFERENCE, CONVENTION and CONGRESS.",
                answer: "• CONFERENCE — participatory meeting for discussion/problem-solving; no tradition/periodicity required; usually smaller scale, short duration\n• CONVENTION — a general & formal meeting of a body/group to inform, deliberate or set policy; often with a secondary exhibition (US term for large national meetings)\n• CONGRESS — regular coming-together of large groups, often several days with simultaneous sessions; (European term for convention)",
                explanation: "Scale & formality grow: conference < convention/congress."
            },
            {
                id: "1nroz8",
                question: "What is INCENTIVE TRAVEL?",
                answer: "A motivational tool: participants receive a TRIP as a REWARD based on specific achievement levels set by management — mostly to increase sales.\n\nValue for the company: bonding, reinforcing corporate culture, loyalty/retention, motivating non-winners. Value for participants: a more memorable prize than cash, networking, professional development, rest, 'trophy value'.",
                explanation: "A non-cash reward — often more effective than cash bonuses."
            },
            {
                id: "ytngbx",
                question: "What is the difference between a B2B and a B2C EXHIBITION?",
                answer: "EXHIBITION = a temporary market event held regularly to showcase a sector and facilitate buying/selling ('shop window').\n\n• TRADE SHOW / B2B — exhibitors from one industry; visitors buy for their business; often invitation/pre-registration; weekday; international/national reach\n• CONSUMER SHOW / B2C — open to the public (entrance fee); sells directly to end-users; weekends; local/regional reach\n\n(A 'mixed show' opens to trade then public, e.g. the Paris Air Show.)",
                explanation: "B2B = business buyers; B2C = the public."
            },
            {
                id: "qwcvc8",
                question: "What are the ICCA vs UIA criteria for an international association meeting?",
                answer: "ICCA (International Congress & Convention Association): organized by an international/regional association HQ; 50+ participants; held REGULARLY; rotates between at least 3 countries.\n\nUIA (Union of International Associations): minimum 300 participants; lasting at least 3 days; representatives from at least 5 countries.",
                explanation: "ICCA = 50+/3 countries; UIA = 300+/3 days/5 countries."
            }
        ],

        quiz: [
            {
                id: "qq5xvt",
                question: "MICE stands for Meetings, Incentives, Conferences and:",
                options: [
                    "Excursions",
                    "Exhibitions",
                    "Experiences",
                    "Expeditions"
                ],
                correct: 1
            },
            {
                id: "tdhwp6",
                question: "In business tourism, who usually pays for the trip?",
                options: [
                    "The traveller",
                    "The employer or association",
                    "The destination",
                    "The government"
                ],
                correct: 1
            },
            {
                id: "d90u9h",
                question: "A key benefit of business tourism for destinations is that it:",
                options: [
                    "Concentrates in peak summer",
                    "Has high per-head expenditure and visits off-peak",
                    "Brings low-spending crowds",
                    "Causes major disorder"
                ],
                correct: 1
            },
            {
                id: "xn483r",
                question: "Incentive travel is best described as:",
                options: [
                    "A punishment",
                    "A trip given as a reward for achievement",
                    "A type of package holiday",
                    "A government subsidy"
                ],
                correct: 1
            },
            {
                id: "678oxl",
                question: "A trade show open only to industry buyers is a:",
                options: [
                    "B2C exhibition",
                    "B2B exhibition",
                    "Consumer show",
                    "Mixed show"
                ],
                correct: 1
            },
            {
                id: "ygqu3x",
                question: "The UIA criteria for an international meeting include a minimum of:",
                options: [
                    "50 participants",
                    "300 participants and 5 countries",
                    "1,000 participants",
                    "10 countries"
                ],
                correct: 1
            },
            {
                id: "zd2qzy",
                question: "The historical 'greatest business travel route' that built the Caravanserai was the:",
                options: [
                    "Amber Road",
                    "Silk Route",
                    "Trans-Siberian",
                    "Route 66"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "y8cbnv",
                sentence: "MICE = Meetings, Incentives, Conferences and _______.",
                answer: "Exhibitions",
                hint: "The 'E'..."
            },
            {
                id: "1jv1lz",
                sentence: "In business tourism, the destination is usually chosen by the meeting _______.",
                answer: "organizer",
                hint: "Not the traveller..."
            },
            {
                id: "6tb777",
                sentence: "_______ travel is a trip given as a reward for achieving targets.",
                answer: "Incentive",
                hint: "Motivational tool..."
            },
            {
                id: "dkfcsr",
                sentence: "A _______ show (B2B) is restricted to industry buyers.",
                answer: "trade",
                hint: "Not consumer..."
            },
            {
                id: "zmtqsu",
                sentence: "Business tourists tend to visit in the _______-peak season.",
                answer: "off",
                hint: "Not summer..."
            }
        ],

        learn: {
            id: "7eby2h",
            title: "Business Tourism (MICE)",
            content: `
                <h3>What is Business Tourism?</h3>
                <div class="formula-box">
                    Travel for a <strong>professional/business purpose</strong> to attend an event.<br>
                    <strong>MICE</strong> = Meetings · Incentives · Conferences · Exhibitions
                </div>
                <p>Also called 'the meetings industry' (2006) or 'business events' — MICE is catchy but poorly understood
                outside the trade. Business travel is ancient (the Silk Route + Caravanserai).</p>

                <h4>Leisure vs Business (demand side)</h4>
                <div class="tip-box">
                    <p>Who pays? <strong>Employer/association</strong> · Who decides? <strong>The organizer</strong> ·
                    When? <strong>All year, Mon–Fri</strong> · Where? <strong>Cities in industrialized countries</strong></p>
                </div>

                <h4>Why Destinations Want It</h4>
                <p>Off-peak · high per-head spend · well-behaved · supports many local suppliers · funds infrastructure.</p>

                <h4>Key Formats</h4>
                <div class="example-box">
                    <p><strong>Conference</strong> < <strong>Convention/Congress</strong> (scale & formality)</p>
                    <p><strong>Incentive travel</strong> — a trip as a reward (often beats cash)</p>
                    <p><strong>Exhibitions:</strong> B2B (trade, weekday, invite) vs B2C (public, weekend, fee)</p>
                    <p><strong>ICCA</strong> 50+/3 countries · <strong>UIA</strong> 300+/3 days/5 countries</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 5: CULTURAL TOURISM ==========
    cultural: {
        id: "gx34ez",
        name: "Cultural Tourism",
        icon: "fa-landmark",
        color: "#f59e0b",

        flashcards: [
            {
                id: "x3el0q",
                question: "What is CULTURAL TOURISM (UNWTO, 2019)?",
                answer: "A type of tourism where the visitor's essential motivation is to LEARN, DISCOVER, EXPERIENCE and CONSUME the tangible and intangible cultural attractions/products of a destination.\n\nThese relate to a society's material, intellectual, spiritual and emotional features: arts & architecture, historical/cultural heritage, culinary heritage, literature, music, creative industries and living cultures.",
                explanation: "Motivation = to learn/experience culture."
            },
            {
                id: "50n5s0",
                question: "What are the 3 areas included in cultural tourism (UNWTO, 2018)?",
                answer: "1. TANGIBLE heritage — national/world heritage sites, monuments, historic buildings, cultural routes\n2. INTANGIBLE heritage — crafts, gastronomy, festivals, music, oral traditions, religious/spiritual\n3. CONTEMPORARY culture — film, performing arts, design, fashion, new media",
                explanation: "Tangible + intangible + contemporary."
            },
            {
                id: "xoojry",
                question: "What is the difference between HERITAGE and HISTORY (and arts tourism)?",
                answer: "HISTORY = the past itself.\nHERITAGE = the modern-day USE and VALUATION of the past (for tourism, education, etc.) — 'what we inherit from the past and value in the present'.\n\nCultural tourism covers both HERITAGE tourism (artefacts of the past) and ARTS tourism (contemporary cultural production).",
                explanation: "Heritage = the present use of the past."
            },
            {
                id: "jifhg4",
                question: "What are McKercher's 5 TYPES of cultural tourist (2002)?",
                answer: "Based on two dimensions — CENTRALITY (how important culture is to the trip) and DEPTH of experience:\n1. PURPOSEFUL (high centrality / deep)\n2. SIGHTSEEING (high centrality / shallow)\n3. CASUAL (modest centrality / shallow)\n4. INCIDENTAL (low centrality / shallow)\n5. SERENDIPITOUS (low centrality / deep)",
                explanation: "Centrality × depth = 5 cultural-tourist types."
            },
            {
                id: "ysg99o",
                question: "What is the VALUE of tourism for culture, and of culture for tourism?",
                answer: "VALUE OF TOURISM FOR CULTURE: generates resources for conservation, motivates communities to manage cultural assets, raises awareness of local heritage.\n\nVALUE OF CULTURE FOR TOURISM: gives coherence to the destination offer, increases competitiveness, increases length of stay, spending and satisfaction.",
                explanation: "A two-way value relationship."
            },
            {
                id: "xrgkdm",
                question: "What are the main TYPES of heritage attraction (Timothy, 2021)?",
                answer: "• MUSEUMS (local, art, science, sports, music)\n• HISTORIC THEME PARKS / folk-life museums (living museums, e.g. Plimoth Plantation)\n• PERFORMING ARTS (opera houses, theatres — building + performance)\n• ARCHAEOLOGICAL SITES & ancient monuments (Stonehenge, Pyramids, Acropolis)\n• RELIGIOUS sites · LIVING culture / ethnic tourism · LITERARY & FILM locations\n• AGRITOURISM & food tourism · SITES OF DEATH (dark tourism) · HERITAGE FESTIVALS",
                explanation: "A wide range — from museums to dark-tourism sites."
            },
            {
                id: "oclkk8",
                question: "What is the role of pilgrimage and the GRAND TOUR in heritage tourism history?",
                answer: "PILGRIMAGE — one of the EARLIEST forms of heritage tourism: travel for spiritual/religious experiences to burial sites, miracle sites, healing places.\n\nThe GRAND TOUR (1600s–mid 1800s) — young European men of means travelled (with tutors) to classical art cities of Italy, France, etc. to become 'cultured nobility' — among the earliest prepackaged cultural tours.",
                explanation: "Pilgrimage + Grand Tour = historical roots of cultural tourism."
            }
        ],

        quiz: [
            {
                id: "d4tjeo",
                question: "The essential motivation of the cultural tourist is to:",
                options: [
                    "Save money",
                    "Learn, discover and experience culture",
                    "Avoid other tourists",
                    "Attend business meetings"
                ],
                correct: 1
            },
            {
                id: "gclmpt",
                question: "Crafts, gastronomy, festivals and music are examples of:",
                options: [
                    "Tangible heritage",
                    "Intangible heritage",
                    "Contemporary culture",
                    "Natural heritage"
                ],
                correct: 1
            },
            {
                id: "j375bt",
                question: "Heritage is best defined as:",
                options: [
                    "The past itself",
                    "The modern-day use and valuation of the past",
                    "Only ancient ruins",
                    "Future planning"
                ],
                correct: 1
            },
            {
                id: "mzq87v",
                question: "McKercher's cultural tourist with high centrality and a deep experience is the:",
                options: [
                    "Incidental",
                    "Casual",
                    "Purposeful",
                    "Serendipitous"
                ],
                correct: 2
            },
            {
                id: "zesxq9",
                question: "Which is a 'value of culture FOR tourism'?",
                options: [
                    "Funding conservation",
                    "Raising heritage awareness",
                    "Increasing length of stay and competitiveness",
                    "Managing cultural assets"
                ],
                correct: 2
            },
            {
                id: "bbo68k",
                question: "The Grand Tour (1600s–1800s) was an early form of:",
                options: [
                    "Business tourism",
                    "Cultural/heritage tourism",
                    "Mass beach tourism",
                    "Dark tourism"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "ikdd73",
                sentence: "Cultural tourism's essential motivation is to learn, discover and _______ culture.",
                answer: "experience",
                hint: "And consume..."
            },
            {
                id: "14z6km",
                sentence: "Crafts and gastronomy are _______ heritage.",
                answer: "intangible",
                hint: "Not physical objects..."
            },
            {
                id: "s6kn7i",
                sentence: "_______ is the modern-day use and valuation of the past.",
                answer: "Heritage",
                hint: "Not 'history'..."
            },
            {
                id: "ur4e66",
                sentence: "McKercher classifies cultural tourists by centrality and _______ of experience.",
                answer: "depth",
                hint: "Shallow vs deep..."
            },
            {
                id: "v2rnnm",
                sentence: "The earliest form of heritage tourism was _______.",
                answer: "pilgrimage",
                hint: "Religious/spiritual travel..."
            }
        ],

        learn: {
            id: "oahmku",
            title: "Cultural Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Motivation = to <strong>learn, discover, experience and consume</strong> a destination's
                    tangible & intangible cultural attractions (UNWTO, 2019).
                </div>

                <h4>Three Areas (UNWTO 2018)</h4>
                <ul>
                    <li><strong>Tangible</strong> — monuments, heritage sites, historic buildings</li>
                    <li><strong>Intangible</strong> — crafts, gastronomy, festivals, music, oral/spiritual</li>
                    <li><strong>Contemporary</strong> — film, performing arts, design, fashion, new media</li>
                </ul>

                <h4>Heritage vs History</h4>
                <p><span class="highlight">History</span> = the past. <span class="highlight">Heritage</span> = the
                present-day use and valuation of the past. Cultural tourism = heritage tourism + arts tourism.</p>

                <h4>McKercher's 5 Cultural Tourists (centrality × depth)</h4>
                <div class="tip-box">
                    <p>Purposeful · Sightseeing · Casual · Incidental · Serendipitous</p>
                </div>

                <h4>Heritage Attractions & History</h4>
                <div class="example-box">
                    <p>Museums · living museums · performing arts · archaeological sites · religious sites ·
                    living culture · literary/film locations · agritourism · dark-tourism sites · festivals</p>
                    <p>Roots: <strong>pilgrimage</strong> (earliest) and the <strong>Grand Tour</strong> (1600s–1800s)</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 6: INDUSTRIAL TOURISM ==========
    industrial: {
        id: "lh3cyq",
        name: "Industrial Tourism",
        icon: "fa-industry",
        color: "#64748b",

        flashcards: [
            {
                id: "26l3vv",
                question: "What is INDUSTRIAL TOURISM?",
                answer: "A form of tourism that involves visits to modern WORK FACILITIES to view products and services, the PROCESS by which they are created, and the PEOPLE involved (Robinson, in Jafari 2003).\n\nIt is generally considered a form of CULTURAL TOURISM. Visits can be guided tours, observation from galleries, or purpose-built visitor centres (factories, mines, power plants, wineries, theatres).",
                explanation: "Visiting workplaces to see how things are made."
            },
            {
                id: "njqhyh",
                question: "What are the 2 TYPES of industrial tourism?",
                answer: "1. ACTIVE industrial tourism — visits to WORKING companies/organisations, to learn about PRODUCTION PROCESSES in real time.\n\n2. INDUSTRIAL HERITAGE tourism (industrial archaeology) — visits to INACTIVE / abandoned industrial sites, to learn about PAST industrial knowledge, culture and identity.",
                explanation: "Working sites (active) vs abandoned sites (heritage)."
            },
            {
                id: "5g0h1z",
                question: "What roles does industrial tourism play in ORGANISATIONS?",
                answer: "• PUBLIC RELATIONS — building relations with the local community, employees, partners, media; improving reputation & corporate social responsibility; demonstrating 'green'/sustainable operations\n• MARKETING — strengthening BRAND ATTACHMENT and encouraging purchases; factory tours & corporate museums as 'events & experiences' (Kotler & Keller)",
                explanation: "Two key business functions: PR and marketing."
            },
            {
                id: "ezkj13",
                question: "How does industrial tourism connect to the EXPERIENCE ECONOMY?",
                answer: "In the experience economy, the economic value of an offering INCREASES from raw material → product → service → EXPERIENCE (Pine & Gilmore, 1998).\n\nExperiences are built on four dimensions: ENTERTAINMENT, EDUCATIONAL, ESCAPIST and AESTHETIC. Industrial tourism turns work into a memorable, multi-sensory experience — and experiences are the foundation of special interest tourism.",
                explanation: "Work becomes a paid, memorable experience."
            },
            {
                id: "j0qpo1",
                question: "What is the historical origin of industrial tourism?",
                answer: "The first factory tours took place in GREAT BRITAIN in the 18th century. There is evidence tourists visited companies over 150 years ago — French vineyards & chocolate factories, US whiskey distilleries, tobacco factories, mines and stock exchanges.\n\nMacCannell describes it as putting WORK ON DISPLAY — 'musealising' work and making it a tourist attraction.",
                explanation: "18th-century Britain; 'work on display'."
            },
            {
                id: "agajxd",
                question: "What does INDUSTRIAL HERITAGE protect, and why revitalise it?",
                answer: "Industrial heritage = remains of TEXTILE, MINING, STEEL and similar heavy industries (TICCIH protects buildings, machinery, mills, mines, warehouses, power plants, transport, workers' social spaces).\n\nRevitalising former industrial areas for tourism brings ECONOMIC (new jobs/income), SOCIAL (resident engagement) and CULTURAL (new identity, slowing depopulation) benefits — a sustainable way to divert crowds from saturated areas.",
                explanation: "Reusing the industrial past for regional renewal."
            }
        ],

        quiz: [
            {
                id: "oy9529",
                question: "Industrial tourism is generally considered a form of:",
                options: [
                    "Mass tourism",
                    "Cultural tourism",
                    "Business tourism",
                    "Dark tourism"
                ],
                correct: 1
            },
            {
                id: "u9k7dn",
                question: "Visiting a WORKING factory to see production in real time is:",
                options: [
                    "Industrial heritage tourism",
                    "Active industrial tourism",
                    "Dark tourism",
                    "Agritourism"
                ],
                correct: 1
            },
            {
                id: "tqp5hf",
                question: "Visiting abandoned mines and mills is:",
                options: [
                    "Active industrial tourism",
                    "Industrial heritage tourism",
                    "Business tourism",
                    "Mass tourism"
                ],
                correct: 1
            },
            {
                id: "bber83",
                question: "In the experience economy, the highest economic value comes from:",
                options: [
                    "Raw materials",
                    "Products",
                    "Services",
                    "Experiences"
                ],
                correct: 3
            },
            {
                id: "f7a44k",
                question: "Two key organisational roles of industrial tourism are:",
                options: [
                    "Taxation and regulation",
                    "Public relations and marketing",
                    "Logistics and accounting",
                    "Security and catering"
                ],
                correct: 1
            },
            {
                id: "7leo5m",
                question: "The first factory tours took place in the 18th century in:",
                options: [
                    "France",
                    "Great Britain",
                    "USA",
                    "Japan"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "alp63h",
                sentence: "Industrial tourism is generally a form of _______ tourism.",
                answer: "cultural",
                hint: "Not business..."
            },
            {
                id: "hd48ys",
                sentence: "_______ industrial tourism visits working companies to see production.",
                answer: "Active",
                hint: "Opposite of heritage..."
            },
            {
                id: "e2bpep",
                sentence: "Industrial _______ tourism visits abandoned/inactive sites.",
                answer: "heritage",
                hint: "The past..."
            },
            {
                id: "0wd7gt",
                sentence: "In the experience economy, value rises from raw material to product to service to _______.",
                answer: "experience",
                hint: "The top level..."
            },
            {
                id: "hi1dtk",
                sentence: "Two organisational roles of industrial tourism are PR and _______.",
                answer: "marketing",
                hint: "Brand attachment..."
            }
        ],

        learn: {
            id: "tueki1",
            title: "Industrial Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Visits to <strong>work facilities</strong> to see products, the production <strong>process</strong>,
                    and the <strong>people</strong> involved — generally a form of <strong>cultural tourism</strong>.
                </div>

                <h4>Two Types</h4>
                <div class="tip-box">
                    <p><strong>Active</strong> — working companies, learn the production process in real time</p>
                    <p><strong>Industrial heritage</strong> — abandoned/inactive sites (mines, mills), learn the past</p>
                </div>

                <h4>Roles in Organisations</h4>
                <ul>
                    <li><strong>Public relations</strong> — reputation, community/employee/media relations, 'green' image</li>
                    <li><strong>Marketing</strong> — brand attachment, encouraging purchases (factory tours, corporate museums)</li>
                </ul>

                <h4>Experience Economy</h4>
                <p>Value rises: raw material → product → service → <span class="highlight">experience</span>
                (Pine & Gilmore). Four dimensions: entertainment, educational, escapist, aesthetic.
                Experiences are the foundation of special interest tourism.</p>

                <h4>History & Heritage</h4>
                <p>First factory tours: 18th-century Britain; 'work on display' (MacCannell). Industrial heritage
                (textile/mining/steel; protected by TICCIH) revitalises regions — economic, social & cultural renewal.</p>
            `
        }
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sitM1;
}

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.sitM1 = sitM1; }
