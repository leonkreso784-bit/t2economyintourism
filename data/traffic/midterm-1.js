// ===== TRAFFIC IN TOURISM — 1st MIDTERM (K1) =====
// Source: lecture decks of Assoc. Prof. Nataša Kovačić, PhD (FMTU Opatija, 1st year HM, summer term).
// Core textbook: Mrnjavac, Edna. 2006. Promet u turizmu. Opatija: FTHM.
// K1 boundary is AUTHORITATIVE from the official syllabus (DINP) + INTRO deck: the 1st mid-term is in
// week 7, so K1 = weeks 1–6:
//   1. Theoretical Basis of Traffic (week 1)
//   2. Interdependence of Traffic & Tourism (week 2)
//   3. Mobility & Travel Patterns (week 3, deck "TJ 3 patterns" — EU mobility survey)
//   4. Road Transport between the demand market & the destination (week 4, deck "TJ 4 and 5")
//   5. Road Transport in the form of a tourism product (week 5, deck "TJ 4 and 5")
//   6. Rail Transport between the demand market & the destination (week 6, deck "Rail transport")
// NOTE: weeks 1–2 have no dedicated lecture deck (INTRO.pdf is administrative only) → authored from the
// syllabus's stated theoretical notions + standard transport-economics theory.

const trafficM1 = {

    // ========== CATEGORY 1: THEORETICAL BASIS OF TRAFFIC ==========
    theoreticalBasis: {
        name: "Theoretical Basis of Traffic",
        icon: "fa-diagram-project",
        color: "#f59e0b",

        flashcards: [
            {
                question: "What is TRAFFIC (transport) and what is a TRAFFIC (transport) SYSTEM?",
                answer: "• TRAFFIC / TRANSPORT = the purposeful movement of people, goods and information (messages) from one place to another, overcoming spatial distance.\n• TRAFFIC SYSTEM = the organised whole of all elements that make transport possible: the transport infrastructure, the means of transport (vehicles), and the people and rules that operate them — across all transport branches (road, rail, water, air).",
                explanation: "Transport exists to bridge the gap between where a need arises and where it can be satisfied — in tourism, between the emitting (demand) market and the receptive destination."
            },
            {
                question: "What is a TRAFFIC (transport) MODE / BRANCH? List the basic ones.",
                answer: "A transport mode (branch/sector) is a distinct technical-technological system of transport defined by the medium it uses and its means of transport.\n\nThe basic modes:\n• ROAD (land)\n• RAIL (land)\n• WATER — maritime + inland waterway (river-lake-canal)\n• AIR\n(+ special: pipeline, cable/funicular, etc.)",
                explanation: "Each mode has its own infrastructure, vehicles and cost structure, giving it specific advantages and limitations for tourism."
            },
            {
                question: "What is a TRAFFIC (transport) SERVICE, and why is it intangible?",
                answer: "A transport service is the act of moving passengers (or goods) — the 'product' the transport sector sells.\n\nLike all services it is:\n• INTANGIBLE — cannot be touched/stored,\n• produced and consumed SIMULTANEOUSLY (you 'consume' the trip as it happens),\n• cannot be stocked — an empty seat on a departed vehicle is lost forever (perishability).",
                explanation: "Because capacity cannot be stored, achieving high capacity occupancy on every departure is the central economic problem of every carrier."
            },
            {
                question: "Distinguish traffic (transport) DEMAND from traffic (transport) SUPPLY (offer).",
                answer: "• TRANSPORT DEMAND = the need for movement — the quantity of transport services users want, where, when and at what price. It is largely a DERIVED demand (people travel to satisfy another need: work, holiday, business).\n• TRANSPORT SUPPLY (offer) = the capacity carriers put on the market: routes, frequencies, vehicle capacity, quality and price.",
                explanation: "Tourist transport demand is highly SEASONAL and directional, which makes balancing it with a relatively fixed supply difficult and expensive."
            },
            {
                question: "What is meant by the TRAFFIC EFFECT(S) of transport?",
                answer: "Traffic effects = the wider consequences transport produces beyond moving a person from A to B:\n• ECONOMIC — connects markets, enables trade and tourism, creates jobs and GDP;\n• SPATIAL — opens up and develops regions, shapes destinations;\n• SOCIAL — mobility, access, quality of life;\n• NEGATIVE (external) effects — emissions, noise, congestion, accidents, land use.",
                explanation: "In tourism the positive effect (accessibility of destinations) is decisive — but the negative external effects (pollution, congestion) are exactly what transport policy now tries to reduce."
            },
            {
                question: "What is TRAFFIC (transport) POLICY?",
                answer: "Transport policy = the set of goals, measures and instruments by which the state (or the EU) steers the development and operation of the transport system — e.g. building infrastructure, regulating safety, taxes and subsidies, environmental standards, modal-shift incentives.\n\nIt is a component of overall economic/development policy; the transport (development) STRATEGY is its long-term plan.",
                explanation: "EU transport policy today pushes a modal shift from road/air toward rail and sustainable modes (Green Deal) — see K2 'Future of transport'."
            },
            {
                question: "Why is transport INFRASTRUCTURE economically special (common features of all branches)?",
                answer: "Transport infrastructure (roads, rails, ports, airports) typically requires:\n• very LARGE investment,\n• a LONG construction period,\n• a LONG service life,\n• accurate capacity sizing with reserve for peaks,\n• as a rule it is built/financed by the STATE (public good), and a one-off user fee rarely covers real costs.",
                explanation: "These features explain why infrastructure decisions are strategic, state-led and slow to change — and why capacity bottlenecks persist."
            },
            {
                question: "What does INELASTICITY of a transport branch mean?",
                answer: "Inelasticity = the transport process is tied (functionally bound) to a fixed infrastructure and a line/public organisation, so it cannot freely adapt to an individual user's wishes.\n\nRail, air and water are relatively INELASTIC (bound to lines, ports, airports, schedules); ROAD transport is the most ELASTIC (door-to-door, individual, flexible).",
                explanation: "Inelastic modes usually need another (road) mode to complete the 'door-to-door' chain — a key reason transport in tourism is typically MULTIMODAL."
            }
        ],

        quiz: [
            {
                question: "Transport demand in tourism is best described as:",
                options: [
                    "An autonomous demand, wanted for its own sake",
                    "A DERIVED demand — people travel to satisfy another (tourism) need",
                    "A demand that is perfectly stable across the year",
                    "Independent of price and season"
                ],
                correct: 1
            },
            {
                question: "Which property makes an empty seat on a departed vehicle a permanent loss?",
                options: [
                    "Tangibility",
                    "Storability",
                    "Perishability of the transport service (it cannot be stocked)",
                    "Elasticity"
                ],
                correct: 2
            },
            {
                question: "Which transport mode is the MOST elastic (flexible, door-to-door, individual)?",
                options: ["Rail", "Air", "Road", "Maritime"],
                correct: 2
            },
            {
                question: "A common economic feature of ALL transport infrastructure is that it:",
                options: [
                    "Is cheap and quick to build",
                    "Requires large investment, long construction and is usually state-financed",
                    "Is always fully covered by one-off user fees",
                    "Has a very short service life"
                ],
                correct: 1
            },
            {
                question: "'Traffic policy' (transport policy) is:",
                options: [
                    "A timetable of departures",
                    "The set of goals, measures and instruments by which the state steers the transport system",
                    "A type of insurance for vehicles",
                    "The price of a single ticket"
                ],
                correct: 1
            },
            {
                question: "Which list correctly gives the basic transport MODES?",
                options: [
                    "Road, rail, water, air",
                    "Cars, buses, trains, ships",
                    "Demand, supply, price, effect",
                    "Local, national, international, global"
                ],
                correct: 0
            },
            {
                question: "Inelasticity of a transport branch mainly results from:",
                options: [
                    "Being tied to fixed infrastructure and a line/public organisation",
                    "Having too many vehicles",
                    "Low fuel prices",
                    "The absence of any timetable"
                ],
                correct: 0
            }
        ],

        fillBlanks: [
            { sentence: "Transport in tourism is usually _______, meaning it relies on more than one transport branch to complete the door-to-door chain.", answer: "multimodal", hint: "multi-…" },
            { sentence: "Tourist transport demand is a _______ demand, because people travel in order to satisfy another need.", answer: "derived", hint: "not autonomous" },
            { sentence: "A transport service cannot be stored; this property is called _______.", answer: "perishability", hint: "an empty seat is lost" },
            { sentence: "The organised whole of infrastructure, vehicles and rules that make transport possible is the transport _______.", answer: "system", hint: "the whole" },
            { sentence: "Of all branches, _______ transport is the most elastic and the only true door-to-door mode.", answer: "road", hint: "cars/buses" },
            { sentence: "Transport _______ is the long-term plan through which the state guides the development of the transport system.", answer: "strategy", hint: "part of transport policy" },
            { sentence: "Emissions, noise, congestion and accidents are the negative (external) _______ of transport.", answer: "effects", hint: "consequences" }
        ],

        learn: {
            title: "Theoretical Basis of Traffic",
            content: `
                <h3>What transport is — and why it matters for tourism</h3>
                <p><strong>Transport (traffic)</strong> is the purposeful movement of people, goods and information across
                space. In tourism it performs the decisive job of connecting the <strong>emitting (demand) market</strong>
                with the <strong>receptive destination</strong>: without accessible, affordable transport there is no
                tourism at the destination.</p>

                <div class="formula-box">
                    Transport SYSTEM = infrastructure + means of transport (vehicles) + people &amp; rules<br>
                    Basic MODES: ROAD · RAIL · WATER (maritime + inland) · AIR
                </div>

                <h4>Key theoretical notions</h4>
                <ul>
                    <li><strong>Transport service</strong> — intangible, produced &amp; consumed simultaneously,
                    <strong>perishable</strong> (an empty seat on a departed vehicle is lost forever).</li>
                    <li><strong>Transport demand</strong> — a <strong>derived</strong>, highly <strong>seasonal</strong>
                    and directional need for movement.</li>
                    <li><strong>Transport supply (offer)</strong> — routes, frequencies, capacity, quality and price the
                    carriers put on the market.</li>
                    <li><strong>Traffic effects</strong> — economic, spatial and social benefits, but also negative
                    external effects (emissions, noise, congestion, accidents).</li>
                    <li><strong>Transport policy</strong> — how the state/EU steers the system (infrastructure, safety,
                    taxes/subsidies, environmental standards, modal shift).</li>
                </ul>

                <h4>Elastic vs inelastic modes</h4>
                <div class="tip-box">
                    <p><strong>Road</strong> transport is the most <strong>elastic</strong> (individual, flexible,
                    door-to-door). <strong>Rail, air and water</strong> are relatively <strong>inelastic</strong> — tied to
                    lines, ports and airports and to public/line organisation — so they usually need road transport to
                    finish the "door-to-door" journey. This is why tourist transport is typically <strong>multimodal</strong>.</p>
                </div>

                <h4>Why infrastructure is special</h4>
                <p>All transport infrastructure shares the same economics: <strong>large investment, long construction,
                long service life, careful capacity sizing</strong>, and as a rule it is built and financed by the
                <strong>state</strong>, because a single user fee rarely covers its true cost. That is why infrastructure
                is a strategic, slow-moving, policy-driven matter.</p>
            `
        }
    },

    // ========== CATEGORY 2: INTERDEPENDENCE OF TRAFFIC & TOURISM ==========
    trafficTourismInterdependence: {
        name: "Interdependence of Traffic & Tourism",
        icon: "fa-arrows-left-right",
        color: "#0ea5e9",

        flashcards: [
            {
                question: "In what TWO basic roles does transport appear in tourism?",
                answer: "1. As a CONNECTOR between the demand (emitting) market and the destination — it makes the destination accessible (the precondition for tourism).\n2. As a PART OF THE TOURISM PRODUCT itself — when the trip/ride is the attraction (cruises, panoramic trains, scenic bus tours, nautical tourism).",
                explanation: "These two roles structure the whole course: weeks 4–9 always treat each mode 'between markets' (connector) AND 'as a tourism product'."
            },
            {
                question: "Why is the relationship between transport and tourism called INTERDEPENDENCE (two-way)?",
                answer: "Because each drives the other:\n• Transport ENABLES tourism — new/cheaper transport (railways, low-cost air) opens new destinations and grows tourist flows.\n• Tourism STIMULATES transport — strong tourist demand justifies new routes, capacity, airports, marinas and investment.",
                explanation: "Historically, every leap in transport (rail in the 19th c., mass air/charter in the 20th c., low-cost carriers today) triggered a leap in tourism."
            },
            {
                question: "How does transport ACCESSIBILITY shape a destination's tourism?",
                answer: "Accessibility (how easily, quickly and cheaply a destination can be reached) is a core component of a destination's competitiveness:\n• good accessibility → larger catchment of potential tourists, longer/again visits;\n• poor accessibility → the destination stays outside the main tourist flows, regardless of its attractions.",
                explanation: "Low-cost carriers choosing a small regional airport can literally 'put a destination on the map' (see Air transport, K2)."
            },
            {
                question: "What is the role of transport COST in the price of the tourism product?",
                answer: "The cost of the transport service is built into the final price the tourist pays for the tourism product. Transport is often a LARGE share of total trip cost, so:\n• changes in transport price (fuel, fares, tolls) directly move tourism demand;\n• cheaper transport (low-cost air) expands the market of people who can afford to travel.",
                explanation: "This is exactly learning outcome 3 of the syllabus — recognising the transport cost inside the tourism-product price (developed in week 10, K2)."
            },
            {
                question: "Why is tourist transport demand a PROBLEM for carriers (seasonality & direction)?",
                answer: "Tourist demand is:\n• strongly SEASONAL (peaks in summer/holidays, troughs off-season), and\n• DIRECTIONAL (full toward the destination at the start of a holiday, empty back — and vice-versa).\nCapacity must be sized for the peak, leaving expensive vehicles and infrastructure under-used the rest of the time.",
                explanation: "Carriers fight this with charter contracts, dynamic pricing and combining tourist with non-tourist flows."
            },
            {
                question: "Why is it hard to measure exactly how many tourists use a given line?",
                answer: "Because tourist flows MIX with non-tourist flows (commuters, business, residents) on the same roads, trains, ships and flights. The same vehicle carries tourists and non-tourists together, so 'tourist transport' cannot be cleanly separated in the statistics.",
                explanation: "Stated explicitly for rail in the lectures — it applies to all public/line transport."
            },
            {
                question: "Give the historical chain: which transport innovations triggered tourism growth?",
                answer: "• 19th c. RAILWAYS → first mass leisure travel, seaside/spa resorts.\n• 20th c. the CAR/road network → individual mass tourism, motels, road trips.\n• Post-1950s mass AIR + CHARTER flights → intercontinental & package mass tourism.\n• Today LOW-COST carriers → city breaks, new regional destinations; and CRUISES as an 'industry'.",
                explanation: "Each step shows interdependence: a transport breakthrough unlocked a new tourism form."
            }
        ],

        quiz: [
            {
                question: "The two basic roles of transport in tourism are:",
                options: [
                    "Connector between market & destination, and part of the tourism product itself",
                    "Only carrying luggage and only carrying food",
                    "Building hotels and selling tickets",
                    "Marketing and accounting"
                ],
                correct: 0
            },
            {
                question: "'Interdependence' of transport and tourism means that:",
                options: [
                    "Only transport affects tourism",
                    "Only tourism affects transport",
                    "Each one drives the other (two-way relationship)",
                    "They are completely unrelated"
                ],
                correct: 2
            },
            {
                question: "A destination with excellent attractions but very POOR accessibility will most likely:",
                options: [
                    "Automatically attract mass tourism",
                    "Remain outside the main tourist flows",
                    "Have the cheapest transport",
                    "Need no transport policy"
                ],
                correct: 1
            },
            {
                question: "Tourist transport demand is difficult for carriers mainly because it is:",
                options: [
                    "Constant and evenly spread all year",
                    "Strongly seasonal and directional",
                    "Completely independent of price",
                    "Always declining"
                ],
                correct: 1
            },
            {
                question: "The cost of the transport service, within the tourism product, is:",
                options: [
                    "Never paid by the tourist",
                    "Built into the final price the tourist pays",
                    "Always zero for package holidays",
                    "Unrelated to demand"
                ],
                correct: 1
            },
            {
                question: "It is hard to count tourists on a public line because:",
                options: [
                    "Tourists never use public transport",
                    "Tourist flows mix with non-tourist flows on the same vehicles",
                    "Tickets are never sold",
                    "There are no statistics at all"
                ],
                correct: 1
            },
            {
                question: "Which innovation is correctly paired with the tourism it unlocked?",
                options: [
                    "Railways → intercontinental package tourism",
                    "Low-cost carriers → 19th-century spa resorts",
                    "Mass air/charter flights → intercontinental & package mass tourism",
                    "Cruise ships → the first commuter railways"
                ],
                correct: 2
            }
        ],

        fillBlanks: [
            { sentence: "Transport connects the _______ market with the receptive destination.", answer: "emitting", hint: "demand-generating / sending" },
            { sentence: "When the ride itself is the attraction (a cruise, a scenic train), transport is part of the tourism _______.", answer: "product", hint: "the thing sold" },
            { sentence: "The two-way relationship in which transport and tourism each drive the other is called _______.", answer: "interdependence", hint: "inter-…" },
            { sentence: "How easily a destination can be reached is its transport _______, a key part of competitiveness.", answer: "accessibility", hint: "reachability" },
            { sentence: "Tourist transport demand is hard to serve because it is highly _______, peaking in summer/holidays.", answer: "seasonal", hint: "varies by season" },
            { sentence: "The cost of the transport service is built into the final _______ of the tourism product.", answer: "price", hint: "what the tourist pays" },
            { sentence: "Low-_______ carriers expanded tourism by bringing air travel to people who previously could not afford it.", answer: "cost", hint: "budget airlines" }
        ],

        learn: {
            title: "Interdependence of Traffic & Tourism",
            content: `
                <h3>A two-way relationship</h3>
                <p>Transport and tourism are <strong>interdependent</strong>: transport <em>enables</em> tourism (it makes
                destinations accessible and is sometimes the attraction itself), while tourism <em>stimulates</em> transport
                (strong tourist demand justifies new routes, capacity and infrastructure).</p>

                <div class="formula-box">
                    Transport in tourism plays TWO roles:<br>
                    (1) CONNECTOR — emitting market → destination (accessibility)<br>
                    (2) PART OF THE TOURISM PRODUCT — the journey is the attraction
                </div>

                <h4>Accessibility &amp; price</h4>
                <ul>
                    <li><strong>Accessibility</strong> — how easily, quickly and cheaply a destination is reached — is a
                    core part of its <strong>competitiveness</strong>. Poor accessibility keeps even attractive places
                    outside the main flows.</li>
                    <li>The <strong>cost of the transport service</strong> is built into the <strong>price</strong> of the
                    tourism product; cheaper transport (low-cost air) enlarges the market of people who can travel.</li>
                </ul>

                <h4>Why tourist demand is hard to serve</h4>
                <div class="tip-box">
                    <p>Tourist transport demand is strongly <strong>seasonal</strong> and <strong>directional</strong>, and
                    it <strong>mixes</strong> with non-tourist flows on the same vehicles — so capacity must be sized for the
                    peak and it is hard to measure tourism's exact share. Carriers respond with charter contracts, dynamic
                    pricing and by combining tourist with everyday flows.</p>
                </div>

                <h4>The historical chain</h4>
                <p>Every transport breakthrough unlocked a new tourism form: <strong>railways</strong> (19th c.) → first mass
                leisure travel; the <strong>car</strong> → individual mass tourism; <strong>mass air &amp; charter</strong>
                → package/intercontinental tourism; <strong>low-cost carriers &amp; cruises</strong> → today's city breaks,
                new regional destinations and cruising "industry".</p>
            `
        }
    },

    // ========== CATEGORY 3: MOBILITY & TRAVEL PATTERNS ==========
    mobilityTravelPatterns: {
        name: "Mobility & Travel Patterns",
        icon: "fa-route",
        color: "#10b981",

        flashcards: [
            {
                question: "What is the dominant PRIMARY form of daily mobility in the EU, and how dominant is it?",
                answer: "The PASSENGER CAR is the dominant primary (1st-choice) form of daily mobility in the EU, followed by walking, public city transport, and (much less) bicycle/scooter.\n\nThe car dominates daily mobility in 22 of 28 surveyed countries — highest in Cyprus (~89%), Slovenia (~71%), Iceland (~68%); lowest in Romania, Hungary, Bulgaria (~35–36%). Car share is higher in RURAL areas.",
                explanation: "Source: EU Eurobarometer-type mobility survey used in the lecture. The car's dominance is the central fact of EU daily mobility — and the main target of sustainability policy."
            },
            {
                question: "What fuels dominate daily-mobility cars, and how small are the sustainable alternatives?",
                answer: "Daily mobility relies overwhelmingly on conventionally (fossil) fuelled, privately owned cars:\n• ~89% of cars are PRIVATELY owned (car-sharing ≤4%, carpooling ≤2%);\n• alternative fuels are tiny: gas ~5%, fully electric ~1%, hybrids ~3%.",
                explanation: "This gap between fossil dominance and tiny alternative-fuel shares is exactly what the EU Green Deal & Sustainable Mobility Strategy target (see K2)."
            },
            {
                question: "What are the MAIN REASONS people choose their primary mode of daily mobility?",
                answer: "Top reasons: COMFORT and SPEED (reduction of travel time), then LACK OF ALTERNATIVE, reliability and satisfaction.\n\nThe biggest CHALLENGES of daily mobility are the COST of transport and traffic CONGESTION (congestion is worse in big cities than rural areas).",
                explanation: "Lack of alternative is the primary reason mainly in Romania, Bulgaria and Cyprus, and is stronger in rural areas."
            },
            {
                question: "For LONG-DISTANCE travel (>300 km), which modes do EU citizens use most, and who travels more?",
                answer: "Most used for long-distance: PASSENGER CAR, then AIRPLANE, then TRAIN. (>60% of Europeans made a >300 km trip in the prior year; ~40% made none.)\n\nMore likely to make such trips: men, under-55s, more educated, employed, those without payment problems, big-city residents, and daily car users.",
                explanation: "In Croatia trains are used very little (~1%); the Croatian order of priority is car, bus, plane."
            },
            {
                question: "Are EU citizens willing to switch to MORE SUSTAINABLE transport — and under what conditions?",
                answer: "Yes — in most movements, the majority would switch IF the more sustainable alternative is:\n• NOT more expensive than now (price is the #1 prerequisite in 23 countries),\n• AVAILABLE/accessible, and\n• not slower.\nIn 24 of 28 states at least half of citizens are ready for such change.",
                explanation: "Willingness varies by country (highest in Luxembourg/Netherlands, lowest in Poland/Bulgaria) and is higher among the young, educated, students and city-dwellers."
            },
            {
                question: "Why is mobility behaviour (travel patterns) studied at all in this course?",
                answer: "Because transport DEMAND in tourism is built on everyday mobility patterns: knowing WHO travels, HOW, WHY and WHAT WOULD MAKE THEM SWITCH lets destinations and carriers plan capacity, design offers and steer demand toward sustainable modes.\n\n(The course research assignment has students survey citizens' real mobility patterns.)",
                explanation: "The lecture's data come from a large EU mobility survey; the student research task replicates it on a small scale."
            },
            {
                question: "What single innovation do EU citizens consider most useful for the FUTURE of personal mobility?",
                answer: "A SINGLE TICKET valid for all forms of mobility/transport in cities (integrated ticketing) — ranked the most useful, ahead of a digital driving licence valid across Europe, and real-time direct payment of tolls/parking/transport costs.",
                explanation: "This anticipates the EU 'Mobility as a Service' (MaaS) and integrated-ticketing goals in the Sustainable & Smart Mobility Strategy (K2)."
            }
        ],

        quiz: [
            {
                question: "The dominant primary form of daily mobility in the EU is:",
                options: ["The bicycle", "Walking", "The passenger car", "Public city transport"],
                correct: 2
            },
            {
                question: "Roughly what share of daily-mobility cars run on conventional (fossil) fuels?",
                options: ["About half", "The overwhelming majority (alternatives only a few %)", "None", "Exactly one third"],
                correct: 1
            },
            {
                question: "The MAIN reasons for choosing one's primary daily mode are:",
                options: [
                    "Comfort and speed (time saving)",
                    "Colour and brand of the vehicle",
                    "Weather only",
                    "The number of passengers only"
                ],
                correct: 0
            },
            {
                question: "The biggest CHALLENGES of daily mobility reported by EU citizens are:",
                options: [
                    "Cost of transport and traffic congestion",
                    "Too many bicycles",
                    "Lack of airports",
                    "Excessive public transport"
                ],
                correct: 0
            },
            {
                question: "For long-distance (>300 km) trips, the most used mode is the:",
                options: ["Train", "Passenger car", "Ship", "Bicycle"],
                correct: 1
            },
            {
                question: "The #1 prerequisite for citizens to switch to a more sustainable mode is that it is:",
                options: [
                    "Slower but prettier",
                    "Not more expensive than the current mode",
                    "Only available at night",
                    "Operated by the state only"
                ],
                correct: 1
            },
            {
                question: "Which future innovation do EU citizens rate most useful for personal mobility?",
                options: [
                    "A single ticket for all urban transport modes",
                    "Banning all cars immediately",
                    "Removing all public transport",
                    "Free parking only"
                ],
                correct: 0
            }
        ],

        fillBlanks: [
            { sentence: "The _______ car is the dominant primary form of daily mobility in the EU.", answer: "passenger", hint: "private four-wheeler" },
            { sentence: "Car use as a share of daily mobility is generally higher in _______ areas than in big cities.", answer: "rural", hint: "countryside" },
            { sentence: "The two top reasons for choosing a daily mode are comfort and _______ (time saving).", answer: "speed", hint: "how fast" },
            { sentence: "The biggest challenges of daily mobility are the cost of transport and traffic _______.", answer: "congestion", hint: "traffic jams" },
            { sentence: "For trips longer than 300 km, after the car the next most-used mode is the _______.", answer: "airplane", hint: "by air" },
            { sentence: "The #1 condition for switching to a sustainable mode is that it must not be more _______ than the current one.", answer: "expensive", hint: "about price" },
            { sentence: "Citizens rate a single _______ valid for all urban transport modes as the most useful future innovation.", answer: "ticket", hint: "integrated fare" }
        ],

        learn: {
            title: "Mobility & Travel Patterns",
            content: `
                <h3>How Europeans actually move</h3>
                <p>Transport demand in tourism grows out of everyday <strong>mobility patterns</strong>. A large EU survey
                (used in this lecture) shows what people choose, why, and what would make them switch.</p>

                <div class="formula-box">
                    Daily mobility (1st choice): CAR ≫ walking &gt; public transport &gt; bike/scooter<br>
                    Car dominates in 22/28 countries · highest Cyprus ~89% · higher in RURAL areas
                </div>

                <h4>What drives the choice</h4>
                <ul>
                    <li><strong>Reasons to choose a mode:</strong> comfort &amp; speed (time), then lack of alternative,
                    reliability, satisfaction.</li>
                    <li><strong>Biggest challenges:</strong> cost of transport &amp; congestion (congestion worse in big
                    cities).</li>
                    <li><strong>Fuel reality:</strong> ~89% of cars privately owned, overwhelmingly fossil-fuelled;
                    alternatives tiny (electric ~1%, hybrid ~3%, gas ~5%; car-sharing ≤4%).</li>
                </ul>

                <h4>Long-distance &amp; tourist travel (&gt;300 km)</h4>
                <p>Over 60% of Europeans took a &gt;300 km trip in the previous year; the order is <strong>car → airplane →
                train</strong>. Such trips are more common among men, under-55s, the more educated, the employed, big-city
                residents and daily car users. In <strong>Croatia</strong> trains are barely used (~1%); the order is car,
                bus, plane.</p>

                <h4>Readiness to go sustainable</h4>
                <div class="tip-box">
                    <p>In 24 of 28 states at least half of citizens are ready to switch to greener transport — <strong>if</strong>
                    the alternative is not more expensive (the #1 condition in 23 countries), is available, and is not slower.
                    The most-wanted future innovation is a <strong>single ticket</strong> for all urban modes (integrated
                    ticketing → "Mobility as a Service").</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 4: ROAD TRANSPORT — BETWEEN MARKET & DESTINATION ==========
    roadTransportConnecting: {
        name: "Road Transport ↔ Destination",
        icon: "fa-car",
        color: "#ef4444",

        flashcards: [
            {
                question: "What are the BENEFITS and LIMITATIONS of road transport for tourism?",
                answer: "BENEFITS: relatively comfortable, cheap and fast; often NO transfer needed (true door-to-door); tourist experiences possible during the trip; greatest flexibility.\n\nLIMITATIONS: lower safety than rail/air, congestion, environmental impact (emissions, noise), parking/space demands, dependence on road quality.",
                explanation: "Road transport is the most elastic mode — its door-to-door flexibility is its decisive advantage in tourism."
            },
            {
                question: "What THREE roles do road vehicles play in tourism, and what are the organisational forms of road traffic?",
                answer: "ROLES: (1) enablers connecting emitting & receptive areas; (2) an integral part of the tourist product (the travel itself); (3) supplying/servicing the destination.\n\nORGANISATIONAL FORMS (by character): OWN transport · LINE (public) transport · SPECIAL-PURPOSE transport.",
                explanation: "The same three-fold scheme (connector / product / supply) reappears for every mode."
            },
            {
                question: "Why is the CAR the central road vehicle in tourism, and which car features matter for travel?",
                answer: "The car is the most numerous road vehicle in tourism — it gives individual, flexible, door-to-door travel between sending and receiving markets.\n\nKey features for travel: efficiency, fuel consumption, SAFETY (active + passive), comfort, speed and emissions.",
                explanation: "Active safety prevents accidents; passive safety reduces their consequences (detailed in K2 Safety)."
            },
            {
                question: "Describe TOURIST BUSES and their organisational forms.",
                answer: "Tourist buses = comfort, rich equipment, MASS transport. Two basic types: high-floor and double-decker.\n\nORGANISATION: line transport (intercity), OCCASIONAL transport (agency-organised tourist trips) and SPECIAL transport (closed groups).\n\nFeatures: large glass surfaces, aerodynamic shape, economical low-emission engines, reinforced cabin (active+passive safety), air-con, AV, toilet (double-deckers: tables, even beds).",
                explanation: "City/suburban bus service used by tourists at the destination is a DIFFERENT service from the tourist-bus service."
            },
            {
                question: "What is the difference between CARAVANS and MOTORHOMES (campervans)?",
                answer: "• CARAVAN — has NO own drive; it is equipped for multi-day stay and is functionally ATTACHED to (towed by) a car.\n• MOTORHOME (campervan) — has its own drive part + cabin + living space; a self-propelled vehicle for longer journeys with stops, overnight stays, food preparation and tourist facilities.",
                explanation: "Both serve camping/touring tourism, letting tourists carry their accommodation with them."
            },
            {
                question: "Compare MOTORCYCLES and BICYCLES as road vehicles in tourism.",
                answer: "• MOTORCYCLE — motor drive on fossil fuel; uses existing infrastructure; smaller parking area than a car.\n• BICYCLE — powered by own (human) power; an ecological alternative; needs customised infrastructure; favourable effect on user health and on city quality of life; saves space.",
                explanation: "The bicycle is the prime 'active mobility' mode the EU wants to expand (safe bike lanes)."
            },
            {
                question: "List the main elements of ROAD TRANSPORT INFRASTRUCTURE.",
                answer: "1. Roads & streets;\n2. Bridges, tunnels, underpasses, overpasses;\n3. Terminals for passenger & cargo traffic;\n4. Spaces for resting road vehicles — garages & parking lots;\n5. Accompanying service facilities along highways;\n6. Devices for signalling, monitoring & traffic management (traffic lights, signs, control systems).",
                explanation: "Passenger terminals and highway service facilities are exactly the points where tourists are present, so they are also tourism-service locations."
            },
            {
                question: "What are the characteristic features of ROAD infrastructure (and how is it financed)?",
                answer: "Big investment, long service life, multi-year construction; method varies by facility type; accurate capacity sizing with reserve; accessibility to all on equal terms; it influences demand on other branches' infrastructure.\n\nFINANCING: as a rule a one-time fee (toll) does NOT cover the real cost → largely state-financed.",
                explanation: "These are the general infrastructure features (Category 1) applied to roads specifically."
            }
        ],

        quiz: [
            {
                question: "The decisive advantage of road transport in tourism is:",
                options: [
                    "Its very high speed over oceans",
                    "Door-to-door flexibility, often with no transfer needed",
                    "Zero emissions",
                    "Being the safest of all modes"
                ],
                correct: 1
            },
            {
                question: "The organisational forms of road traffic 'by character' are:",
                options: [
                    "Own, line (public) and special-purpose transport",
                    "Air, rail and sea",
                    "Cheap, medium and luxury",
                    "Local, national and global"
                ],
                correct: 0
            },
            {
                question: "A CARAVAN differs from a motorhome because it:",
                options: [
                    "Has its own engine",
                    "Has NO own drive and is towed by a car",
                    "Can fly",
                    "Is only used in cities"
                ],
                correct: 1
            },
            {
                question: "Which is powered by the user's own (human) power and needs customised infrastructure?",
                options: ["Motorcycle", "Tourist bus", "Bicycle", "Caravan"],
                correct: 2
            },
            {
                question: "Occasional bus transport in tourism refers to:",
                options: [
                    "Scheduled intercity lines only",
                    "Agency-organised tourist trips",
                    "City buses used by residents",
                    "Empty buses in depots"
                ],
                correct: 1
            },
            {
                question: "Which is NOT an element of road transport infrastructure?",
                options: ["Bridges and tunnels", "Parking lots and garages", "Airport runways", "Traffic signalling and control systems"],
                correct: 2
            },
            {
                question: "Road infrastructure is largely state-financed because:",
                options: [
                    "Tolls always over-cover the cost",
                    "A one-time user fee usually does NOT cover the real cost",
                    "It is cheap to build",
                    "It has a very short life"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "Road transport is the only true _______-to-door mode, often needing no transfer.", answer: "door", hint: "door-to-door" },
            { sentence: "Road traffic appears in three organisational forms: own, line (public) and _______-purpose transport.", answer: "special", hint: "for closed groups etc." },
            { sentence: "A _______ has no own drive and is functionally attached to a car.", answer: "caravan", hint: "towed trailer-home" },
            { sentence: "A motorhome (campervan) has its own drive part, a cabin and a _______ space.", answer: "living", hint: "where you sleep/cook" },
            { sentence: "Agency-organised tourist trips by bus are the _______ form of bus transport.", answer: "occasional", hint: "not scheduled line" },
            { sentence: "The _______ is the most numerous road vehicle in tourism.", answer: "car", hint: "individual vehicle" },
            { sentence: "A one-time road fee usually does not cover the real cost, so road infrastructure is largely _______-financed.", answer: "state", hint: "public" }
        ],

        learn: {
            title: "Road Transport between the Demand Market & the Destination",
            content: `
                <h3>The most flexible mode</h3>
                <p>Road transport connects the emitting market with the destination with unmatched flexibility — it is
                relatively cheap, comfortable and fast, and is the only true <strong>door-to-door</strong> mode (often with
                no transfer). Its limitations are lower safety, congestion and environmental impact.</p>

                <div class="formula-box">
                    Road vehicles in tourism: (1) connect emitting ↔ receptive areas · (2) are part of the trip itself ·
                    (3) supply the destination<br>
                    Organisation by character: OWN · LINE (public) · SPECIAL-PURPOSE
                </div>

                <h4>The vehicles</h4>
                <ul>
                    <li><strong>Car</strong> — the most numerous; individual door-to-door travel. Key features: efficiency,
                    fuel consumption, <strong>safety</strong> (active + passive), comfort, speed, emissions.</li>
                    <li><strong>Tourist buses</strong> — comfort, rich equipment, mass transport; high-floor &amp;
                    double-decker; organised as line, <strong>occasional</strong> (agency tours) and special (closed groups).</li>
                    <li><strong>Caravans</strong> (no own drive, towed) vs <strong>motorhomes</strong> (self-propelled,
                    living space) — camping/touring tourism.</li>
                    <li><strong>Motorcycle</strong> (fossil-fuel, existing infrastructure) vs <strong>bicycle</strong>
                    (human power, ecological, needs custom infrastructure, health benefits).</li>
                </ul>

                <h4>Infrastructure</h4>
                <div class="tip-box">
                    <p>Roads &amp; streets · bridges/tunnels/over- &amp; underpasses · passenger &amp; cargo terminals ·
                    parking &amp; garages · highway service facilities · signalling, monitoring &amp; control. Like all
                    transport infrastructure it needs <strong>big investment, long construction</strong> and is largely
                    <strong>state-financed</strong> (a single toll rarely covers the real cost). Terminals and service
                    facilities double as tourism-service points.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 5: ROAD TRANSPORT — AS A TOURISM PRODUCT ==========
    roadTransportProduct: {
        name: "Road Transport as a Tourism Product",
        icon: "fa-bus",
        color: "#8b5cf6",

        flashcards: [
            {
                question: "List the tourism PRODUCTS based on road traffic.",
                answer: "1. Bus excursions (one-day tours);\n2. Multi-day bus trips;\n3. Panoramic & other transport by buses/special vehicles in the destination;\n4. Local tourist lines;\n5. Rental of road vehicles in the destination;\n6. Cycling tourism.",
                explanation: "Here the road service is the BACKBONE of a tourism product, not just a way to reach the destination."
            },
            {
                question: "What characterises BUS EXCURSIONS and MULTI-DAY bus trips?",
                answer: "• BUS EXCURSIONS — offer spread worldwide; the bus overcomes distance; relatively LOW price; short duration; flexibility in choosing motives; can target the open market or closed groups.\n• MULTI-DAY BUS TRIPS — rich, diverse tourist content even during transport; value for money; tourist buses built for longer stays on board; organised by travel agencies; tourist content + transport function combined.",
                explanation: "Both turn the bus ride itself into the holiday experience."
            },
            {
                question: "What is PANORAMIC bus transport in the destination, and what else are destination buses used for?",
                answer: "PANORAMIC transport = round-trip sightseeing of natural & cultural sights at the destination; buses with high mobility, manoeuvrability, safety and large glass surfaces; multilingual info during the drive.\n\nDestination buses are also used for TRANSFERS (airport↔hotel, port↔city) and SHUTTLE services (e.g. cruise passengers from port to city, hotel guests to centre) — often part of COMBINED (multimodal) trips.",
                explanation: "Combined trips use at least two branches: bus + boat, bus + plane, bus + train."
            },
            {
                question: "What are LOCAL TOURIST LINES and who organises them?",
                answer: "Regular transport within tourist destinations using modest-comfort, low-speed, high-capacity buses.\n\nOrganisers: local government, travel agencies, transport companies, hotels.\nPurpose: an economical, efficient solution that AVOIDS car use and relieves road infrastructure.\nTypes: SKI BUS (winter destinations), BEACH BUS (coastal destinations).",
                explanation: "Local lines are a sustainability tool at destination level — fewer private cars, less congestion."
            },
            {
                question: "How is RENTAL of road vehicles ('rent-a-car') in the destination organised and charged?",
                answer: "Rental of cars, mopeds/scooters, ATVs (quads) and bicycles via rent-a-car or travel agencies under a RENTAL AGREEMENT.\n\nPayment is either:\n• according to DISTANCE travelled, or\n• according to DURATION of the lease.\n\nIt gives tourists the benefits of car flexibility at the destination without bringing their own car.",
                explanation: "Rent-a-car restores door-to-door flexibility to tourists who arrived by an inelastic mode (plane, train, ship)."
            },
            {
                question: "Define CYCLING TOURISM and sketch the cycling tourist's profile.",
                answer: "CYCLING TOURISM = leisure travel (day trips or trips with overnight stay, outside the residence) where cycling is the primary/significant part. Forms: one-day, holiday, and active cycling tourism.\n\nPROFILE (ADFC 2020): avg age ~53; earns above-average (~79%); ~50% university degree; mostly without children; 40–60 km/day; ~9-day holiday; 'point-to-point' with accommodation changes; ~29% use e-bikes; focused on quality & experience.",
                explanation: "The bicycle is ecological, space-saving and health-positive — a flagship of EU 'active mobility'."
            },
            {
                question: "What does the EU coach (bus) satisfaction survey reveal about WHY people travel by coach?",
                answer: "Most coach trips are domestic (~35% travel to other places in their own country; only ~18% abroad) and infrequent.\n\nMain PURPOSES: visiting family/friends (~34%), holiday (~27%), other leisure (~24%).\nMain REASONS: LOW PRICES (~33%) and NOT HAVING A CAR (~27%); then reliability, comfort/cleanliness.\nOverall ~64% rate national coach services as 'good'.",
                explanation: "Low price and 'no car' dominate — coach is the budget/captive-market mode, very relevant for student & budget tourism."
            }
        ],

        quiz: [
            {
                question: "Which is a tourism PRODUCT based on road traffic?",
                options: ["A high-speed train line", "A multi-day bus trip", "An international cruise", "A charter flight"],
                correct: 1
            },
            {
                question: "Panoramic transport in the destination is essentially:",
                options: [
                    "Round-trip sightseeing of natural & cultural sights",
                    "Long-haul intercontinental transport",
                    "Freight delivery",
                    "Commuting to work"
                ],
                correct: 0
            },
            {
                question: "A 'ski bus' or 'beach bus' is an example of:",
                options: ["A charter flight", "A local tourist line", "A caravan", "A cruise excursion"],
                correct: 1
            },
            {
                question: "Rent-a-car services are charged according to:",
                options: [
                    "Passenger weight",
                    "Distance travelled OR duration of the lease",
                    "Number of fuel stations passed",
                    "The colour of the car"
                ],
                correct: 1
            },
            {
                question: "Local tourist lines mainly help a destination by:",
                options: [
                    "Increasing private car use",
                    "Avoiding car use and relieving road infrastructure",
                    "Replacing all air transport",
                    "Removing all buses"
                ],
                correct: 1
            },
            {
                question: "In the EU coach survey, the TWO main reasons for travelling by coach are:",
                options: [
                    "Luxury and speed",
                    "Low prices and not having a car",
                    "Free food and free WiFi",
                    "Status and comfort"
                ],
                correct: 1
            },
            {
                question: "The typical cycling tourist (ADFC profile) is best described as:",
                options: [
                    "Young, low-income, with small children",
                    "Older (~53), above-average income, often university-educated, quality-focused",
                    "A daily commuter who never holidays",
                    "Exclusively a professional athlete"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            { sentence: "A one-day organised road tour is a bus _______.", answer: "excursion", hint: "short trip" },
            { sentence: "Sightseeing round-trips of a destination's sights by bus are _______ transport.", answer: "panoramic", hint: "scenic viewing" },
            { sentence: "Transport from airport to hotel or port to city, often combined with other modes, is a _______.", answer: "transfer", hint: "connecting leg" },
            { sentence: "A ski bus or beach bus is a type of local tourist _______.", answer: "line", hint: "regular route" },
            { sentence: "Rent-a-car payment can be based on distance travelled or on the _______ of the lease.", answer: "duration", hint: "how long" },
            { sentence: "Leisure travel where cycling is the primary part is called cycling _______.", answer: "tourism", hint: "the activity-based form" },
            { sentence: "In the EU survey, low prices and not having a _______ are the top reasons to travel by coach.", answer: "car", hint: "own vehicle" }
        ],

        learn: {
            title: "Road Transport in the Form of a Tourism Product",
            content: `
                <h3>When the road service IS the product</h3>
                <p>Beyond simply reaching the destination, road transport becomes the <strong>backbone of tourism
                products</strong> in which the ride itself delivers the experience.</p>

                <div class="formula-box">
                    Road-based tourism products: bus excursions · multi-day bus trips · panoramic/destination transport ·
                    local tourist lines · vehicle rental (rent-a-car) · cycling tourism
                </div>

                <h4>Bus-based products</h4>
                <ul>
                    <li><strong>Excursions</strong> (one-day) &amp; <strong>multi-day trips</strong> — low-priced, flexible,
                    rich on-board tourist content; organised by agencies.</li>
                    <li><strong>Panoramic</strong> sightseeing + <strong>transfers</strong> (airport↔hotel, port↔city) and
                    <strong>shuttles</strong> — often part of <strong>combined (multimodal)</strong> trips (bus+boat,
                    bus+plane, bus+train).</li>
                    <li><strong>Local tourist lines</strong> (ski bus, beach bus) — economical destination transport that
                    <strong>avoids car use</strong> and relieves infrastructure (a sustainability tool).</li>
                </ul>

                <h4>Rental &amp; cycling tourism</h4>
                <div class="tip-box">
                    <p><strong>Rent-a-car</strong> (cars, scooters, quads, bikes) restores door-to-door flexibility to
                    tourists who arrived by plane/train/ship; charged by distance or duration.
                    <strong>Cycling tourism</strong> — ecological, health-positive; the typical cyclist is ~53, above-average
                    income, university-educated, doing 40–60 km/day on quality-focused trips (~29% on e-bikes).</p>
                    <p>EU coach survey: most coach trips are domestic and chosen for <strong>low price</strong> and
                    <strong>not having a car</strong>; ~64% rate services 'good'.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 6: RAIL TRANSPORT — BETWEEN MARKET & DESTINATION ==========
    railTransportConnecting: {
        name: "Rail Transport ↔ Destination",
        icon: "fa-train",
        color: "#0891b2",

        flashcards: [
            {
                question: "What are the CHARACTERISTICS (advantages & disadvantages) of rail traffic?",
                answer: "ADVANTAGES: very large one-time passenger capacity (more than road/air); low exploitation costs; very favourable SAFETY and ENVIRONMENTAL indicators (electric drive, little land use).\n\nDISADVANTAGES: INELASTICITY (line & public organisation; infrastructure-bound); impossibility of door-to-door transport; low commercial speed.",
                explanation: "Rail's green & safe profile is exactly why EU policy stimulates a modal shift TO rail (Green Deal, K2)."
            },
            {
                question: "Why does the EU strongly promote rail over road, environmentally?",
                answer: "Because of its DRIVE TYPE (electric on main lines) and the much smaller LAND/space it needs versus roads, rail has a far less aggressive effect on nature. EU transport policy therefore stimulates rail so it can compete with road and slow road's excessive growth.",
                explanation: "Rail is central to the EU's Green Deal goal of a climate-neutral Europe by 2050."
            },
            {
                question: "How are passenger CARRIAGES classified by COMFORT and by PURPOSE?",
                answer: "By COMFORT — into classes (level of comfort proportional to distance).\n\nBy PURPOSE:\n• LOCAL — up to ~50 km, less comfort, large capacity, modest equipment, lower speed (like city/suburban buses);\n• MAINLINE — greater comfort, speed, equipment; longer distances;\n• INTERNATIONAL — greatest comfort, speed, equipment + many additional services (sleeping/dining cars).",
                explanation: "On a train the LOCOMOTIVE (drive) is separate from the wagons — they can be freely combined, allowing intensive use of locomotives."
            },
            {
                question: "How is rail transport divided by the CHARACTERISTICS of the transport service?",
                answer: "• URBAN rail — suburban & city transport;\n• INTERCITY rail — international, domestic, regional, and high-speed-train transport;\n• INTERMODAL — combined transport: rail + tram, rail + road vehicles, etc.",
                explanation: "Intermodal/combined transport is how inelastic rail solves the 'door-to-door' last mile."
            },
            {
                question: "What is special about RAILWAY infrastructure compared with road infrastructure?",
                answer: "Unlike roads (built in stages/sections), a RAILWAY CANNOT be built in sections — train movement depends entirely on signalling & safety devices, so the line must be built as a WHOLE. Investor is usually the STATE; the plan derives from the national transport strategy and must fit international corridors.\n\nRoad needs only locational compliance at borders; rail needs TECHNICAL, TECHNOLOGICAL and ORGANISATIONAL compliance.",
                explanation: "This 'all-or-nothing' nature makes rail investment huge, slow and strongly state-led."
            },
            {
                question: "What are HIGH-SPEED TRAINS (HST), and how energy-efficient is HSR?",
                answer: "HST combine speed (>300 km/h) and efficiency; they reshaped transport by offering a greener alternative to aviation on shorter routes, cutting travel time and promoting economic growth.\n\nPer UIC data, high-speed rail is more than 4× as energy-efficient as driving and nearly 9× more efficient than flying.\nMaglev (magnetic levitation) pushes speeds even higher (Shanghai Maglev ~460 km/h).",
                explanation: "France pioneered European HSR (Paris–Lyon, 1981, TGV); Germany ICE (1991); Eurostar via the Channel Tunnel (1994)."
            },
            {
                question: "What is the function of a railway PASSENGER TERMINAL, and its zones?",
                answer: "A passenger terminal receives & dispatches passengers (and their luggage/post/small cargo), and handles train operations.\n\nZones of a classic terminal: (1) passenger & baggage reception area; (2) station building; (3) train acceptance zone. Goal: integrate the transport process so distances, waiting and luggage transfer between branches are minimal.",
                explanation: "Like road service points, station space is used by tourists → a place to present/promote the destination's offer."
            }
        ],

        quiz: [
            {
                question: "A KEY advantage of rail traffic is:",
                options: [
                    "True door-to-door delivery",
                    "Very favourable safety AND environmental indicators",
                    "The highest commercial speed of all modes",
                    "Total independence from infrastructure"
                ],
                correct: 1
            },
            {
                question: "Rail is described as INELASTIC mainly because:",
                options: [
                    "It is too fast",
                    "It is bound to fixed lines and a public/line organisation, and cannot do door-to-door",
                    "It uses no infrastructure",
                    "It carries very few passengers"
                ],
                correct: 1
            },
            {
                question: "By PURPOSE, which carriage type serves trips up to ~50 km with modest equipment?",
                options: ["International", "Mainline", "Local", "High-speed"],
                correct: 2
            },
            {
                question: "Unlike a road, a railway line must be built:",
                options: [
                    "In small independent sections",
                    "As a whole, because train movement depends on signalling & safety devices",
                    "Only by private firms",
                    "Without any plan"
                ],
                correct: 1
            },
            {
                question: "According to UIC data, high-speed rail compared with flying is roughly:",
                options: [
                    "Equally energy-efficient",
                    "Half as efficient",
                    "Nearly 9× more energy-efficient",
                    "Twice as polluting"
                ],
                correct: 2
            },
            {
                question: "The EU promotes a modal shift TO rail mainly because rail:",
                options: [
                    "Is the cheapest luxury option",
                    "Has a far smaller environmental footprint (electric drive, little land use)",
                    "Needs no investment",
                    "Is fully door-to-door"
                ],
                correct: 1
            },
            {
                question: "Which European country pioneered high-speed rail (Paris–Lyon, 1981)?",
                options: ["Germany", "Italy", "France", "Spain"],
                correct: 2
            }
        ],

        fillBlanks: [
            { sentence: "Rail's biggest advantages are large capacity, low costs and favourable safety and _______ indicators.", answer: "environmental", hint: "eco / nature" },
            { sentence: "Because it is bound to fixed lines and cannot do door-to-door, rail is relatively _______.", answer: "inelastic", hint: "not flexible" },
            { sentence: "On a train the locomotive (drive) is separate from the _______, which can be freely combined.", answer: "wagons", hint: "carriages/cars" },
            { sentence: "Carriages for trips up to ~50 km, with modest equipment, are _______ carriages.", answer: "local", hint: "short distance" },
            { sentence: "Combined transport such as rail + road vehicles is called _______ transport.", answer: "intermodal", hint: "across modes" },
            { sentence: "Unlike a road, a railway must be built as a _______, because of signalling and safety dependence.", answer: "whole", hint: "not in sections" },
            { sentence: "High-speed rail is nearly nine times more energy-efficient than _______.", answer: "flying", hint: "air travel" }
        ],

        learn: {
            title: "Rail Transport between the Demand Market & the Destination",
            content: `
                <h3>The green, high-capacity mode</h3>
                <p>Rail offers very large capacity, low operating costs and excellent <strong>safety</strong> and
                <strong>environmental</strong> indicators (electric drive, little land use). Its price is
                <strong>inelasticity</strong> — it is bound to fixed lines and public/line organisation, cannot do
                door-to-door, and has low commercial speed.</p>

                <div class="formula-box">
                    Rail = large capacity + low cost + safe + GREEN &nbsp;BUT&nbsp; inelastic + no door-to-door + slow<br>
                    HSR is &gt;4× more energy-efficient than driving and ~9× more than flying (UIC)
                </div>

                <h4>Carriages &amp; service types</h4>
                <ul>
                    <li><strong>By comfort:</strong> classes (comfort rises with distance). <strong>By purpose:</strong>
                    local (≤50 km) · mainline · international (most comfort + sleeping/dining cars).</li>
                    <li><strong>By service:</strong> urban (city/suburban) · intercity (incl. high-speed) ·
                    <strong>intermodal</strong> (rail + tram/road — solving the last-mile door-to-door problem).</li>
                    <li>Locomotive is <strong>separate</strong> from wagons → free combination &amp; intensive locomotive
                    use.</li>
                </ul>

                <h4>Infrastructure, HST &amp; terminals</h4>
                <div class="tip-box">
                    <p>A railway must be built <strong>as a whole</strong> (signalling/safety dependence), is hugely
                    expensive and <strong>state-led</strong>, and must fit international corridors (technical + technological
                    + organisational compliance). <strong>High-speed trains</strong> (&gt;300 km/h; Maglev faster still)
                    rival aviation on short routes; France pioneered European HSR (TGV, 1981). <strong>Passenger
                    terminals</strong> (reception · station building · train zone) are also tourism-service points.</p>
                </div>
            `
        }
    }

};

// Expose for the catalog loader (and Node for the structural validator).
if (typeof window !== "undefined") { window.trafficM1 = trafficM1; }
if (typeof module !== "undefined" && module.exports) { module.exports = trafficM1; }
