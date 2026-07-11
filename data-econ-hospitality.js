// ===== ECONOMICS IN HOSPITALITY - FIRST MIDTERM =====
// Source: Units 1-5 (2025) lecture presentations = course topics T2-T6.
// Course: "Economics of Hospitality Businesses" (FTHM Opatija, K. Mikinac, PhD).
// 1st midterm (T7) covers T2 Basics, T3 Business economics, T4 Hospitality business,
// T5 Means of reproduction (assets), T6 Theory of costs. (T1 = intro; seminars are separate.)

const economicsHospitalityData = {
    unit1HospitalityBasics: {
        id: "og4upr",
        name: "Unit 1: Basics of Hospitality",
        icon: "fa-concierge-bell",
        color: "#0ea5e9",

        flashcards: [
            {
                id: "v7hr7v",
                question: "What is the difference between service and hospitality?",
                answer: "Service is transactional, standardized, reactive and step-following; hospitality is personal, emotional, proactive and anticipates needs. Service is an expectation; hospitality is what makes a brand unforgettable.",
                explanation: "From the 'Service & Hospitality' slide — the core distinction of Unit 1."
            },
            {
                id: "jesl0m",
                question: "Why is hospitality regarded as a skill?",
                answer: "Because it relies on a distinct set of soft skills, attitudes and approaches centred on the customer. Its foundation is customer service, and this customer focus can be transferred to other business fields and to life in general.",
                explanation: "Hospitality skills are valuable across sectors and can be developed through targeted training."
            },
            {
                id: "higa1q",
                question: "What is the Customer View of hospitality?",
                answer: "Hospitality delights with enjoyment, relaxation and a chance to build trust. Earning that trust makes customers more willing to pay and satisfy their expectations; it lives in the customer–business relationship.",
                explanation: "One of the two 'Ways to View Hospitality' from the slides."
            },
            {
                id: "pl9mb3",
                question: "What is the Management View of hospitality?",
                answer: "Hospitality brings responsibility: the business must deliver service that brings guests back and 'treat' each guest without a snare or snag in the hospitality experience.",
                explanation: "The second view — hospitality quality must be deliberately managed, not left to chance."
            },
            {
                id: "dz3uri",
                question: "What is 'local export' in hospitality?",
                answer: "By selling its services to foreign tourists, the hospitality industry carries out a specific form of export of goods and services without shipping them abroad — the so-called 'local export', important for the whole economy.",
                explanation: "From the 'Type of activity' slide."
            },
            {
                id: "uksyz8",
                question: "Why is hospitality a 'mixed producing and service activity'?",
                answer: "Because it combines production and service jobs in one process: production is mainly made to order and the goods produced are sold immediately to the customer.",
                explanation: "Nature of jobs in hospitality."
            },
            {
                id: "m51i4i",
                question: "What is a 'service' in the hospitality context?",
                answer: "An activity or benefit of an invisible (intangible) nature offered by one party to another, where the result is not a new product but a modification of existing products or a completely new service.",
                explanation: "Basic characteristic of hospitality services."
            },
            {
                id: "9yu9ta",
                question: "How are hospitality services divided, with examples?",
                answer: "Basic (accommodation, food, beverage services), Supplementary (reception/departure, messages, post, safekeeping guests' belongings) and Additional (maintenance, laundry, garage/car repair, cleaning, sales, sport/entertainment/animation).",
                explanation: "BASIC – SUPPLEMENTARY – ADDITIONAL services slide."
            },
            {
                id: "erxifu",
                question: "What are the four specialities (special features) of hospitality services?",
                answer: "Intangibility (cannot be tried before consumption), Heterogeneity (every service is special/unique), Simultaneous production and consumption (cannot be stored — exist only at the time of production), and Indivisibility (provider and user must both be present).",
                explanation: "The 'Specialities of hospitality services' slide — frequent exam item."
            },
            {
                id: "6rpv6o",
                question: "What does 'the complexity of hospitality services' mean?",
                answer: "Hospitality combines many job families: jobs of a production, organisational, service, commercial, leisure and health-related character — all coordinated within one operation.",
                explanation: "The complexity slide lists these job characters."
            },
            {
                id: "ocgfto",
                question: "How do guest stay length and seasonality affect a hotel?",
                answer: "The longer a guest stays, the better the occupancy rate. Operations depend on tourist flow, visits and overnight stays; seasonality of demand leads to low occupancy and weaker business results.",
                explanation: "'Guest stay and seasonal nature of the business' slide."
            },
            {
                id: "bnsh7e",
                question: "How are hospitality and tourism linked?",
                answer: "Hospitality is the material basis of the tourism industry, its infrastructural prerequisite and its receptive basis. While travelling, tourists satisfy existential needs (accommodation, food, drink) through hospitality.",
                explanation: "'The link between hospitality and tourism' slide."
            }
        ],

        quiz: [
            {
                id: "vmoh0q",
                question: "Hospitality (vs. service) is best described as:",
                options: ["Only standardized procedures", "A personal and proactive approach that anticipates needs", "Only technical efficiency", "Only food production"],
                correct: 1
            },
            {
                id: "c707sq",
                question: "Service is reactive, while hospitality is:",
                options: ["Passive", "Proactive", "Random", "Automated"],
                correct: 1
            },
            {
                id: "5jlif5",
                question: "Selling hospitality services to foreign tourists is a specific form of:",
                options: ["Import", "Neutral exchange", "Local export", "Barter"],
                correct: 2
            },
            {
                id: "2zm6sw",
                question: "Which trait means a service cannot be tested before consumption?",
                options: ["Heterogeneity", "Intangibility", "Indivisibility", "Simultaneity"],
                correct: 1
            },
            {
                id: "5nyfdv",
                question: "Which is NOT one of the four specialities of hospitality services?",
                options: ["Intangibility", "Heterogeneity", "Durability (storability)", "Indivisibility"],
                correct: 2
            },
            {
                id: "tfp7f8",
                question: "Accommodation, food and beverage services belong to which group?",
                options: ["Basic services", "Supplementary services", "Additional services", "Neutral services"],
                correct: 0
            },
            {
                id: "l6tlpg",
                question: "By the nature of its jobs, hospitality is characterised as a:",
                options: ["Pure service activity", "Pure production activity", "Mixed producing and service activity", "Purely financial activity"],
                correct: 2
            },
            {
                id: "6rq4qq",
                question: "In relation to tourism, hospitality is its:",
                options: ["Optional add-on", "Material basis and receptive prerequisite", "Marketing channel only", "Legal framework"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "cwl4bt",
                sentence: "Service is transactional; hospitality is _______.",
                answer: "personal",
                hint: "Human-centred word..."
            },
            {
                id: "pcw5pp",
                sentence: "Hospitality is _______ in anticipating needs, not reactive.",
                answer: "proactive",
                hint: "Starts with 'pro'..."
            },
            {
                id: "cuz15r",
                sentence: "Selling services to foreign tourists is a form of local _______.",
                answer: "export",
                hint: "Opposite of import..."
            },
            {
                id: "2xo6l2",
                sentence: "A service that cannot be tried out before consumption shows _______.",
                answer: "intangibility",
                hint: "Invisible nature..."
            },
            {
                id: "shnt4h",
                sentence: "Accommodation, food and beverage are classed as _______ services.",
                answer: "basic",
                hint: "Core / primary group..."
            },
            {
                id: "2u0lgd",
                sentence: "Seasonality of demand leads to low hotel _______ and weaker results.",
                answer: "occupancy",
                hint: "How full the hotel is..."
            }
        ],

        learn: {
            id: "qmy4al",
            title: "Unit 1 — Basics of the Hospitality Industry",
            content: `
                <h3>1) Service vs Hospitality</h3>
                <div class="formula-box">
                    <p><strong>Service:</strong> transactional · standardized · reactive · following steps · an expectation</p>
                    <p><strong>Hospitality:</strong> personal · emotional · proactive · anticipates needs · makes a brand unforgettable</p>
                </div>

                <h3>2) Hospitality as a Skill</h3>
                <ul>
                    <li>A set of soft skills, attitudes and approaches centred on the customer</li>
                    <li>Its foundation is customer service — a powerful, trainable skill</li>
                    <li>Transferable to other industries, business fields and life in general</li>
                    <li>Requires leadership focused on people's wellbeing + targeted training</li>
                </ul>

                <h3>3) Two Ways to View Hospitality</h3>
                <h4>Customer view</h4>
                <ul>
                    <li>Enjoyment, relaxation, and an opportunity to build trust</li>
                    <li>Trust → greater willingness to pay and satisfied expectations</li>
                </ul>
                <h4>Management view</h4>
                <ul>
                    <li>Responsibility to deliver service that brings guests back</li>
                    <li>No "snare or snag" allowed in the hospitality experience</li>
                </ul>

                <h3>4) Economic Specifics of the Activity</h3>
                <div class="example-box">
                    <p><strong>Local export:</strong> selling services to foreign tourists is a specific export of goods and services, important to the whole economy — without shipping anything abroad.</p>
                </div>
                <ul>
                    <li>Mixed <strong>producing + service</strong> activity</li>
                    <li>Production is mainly made to order and sold immediately to the customer</li>
                </ul>

                <h3>5) Hospitality Services: Structure</h3>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Basic</strong></td><td>Accommodation, food and beverage services</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Supplementary</strong></td><td>Reception/departure of guests, announcing messages, receiving/sending post, safekeeping of belongings</td></tr>
                    <tr><td><strong>Additional</strong></td><td>Facility maintenance, laundry/ironing, garage & car repair, cleaning, sales of goods, sport/entertainment/animation</td></tr>
                </table>
                <p><strong>Complexity:</strong> jobs of production, organisational, service, commercial, leisure and health-related character all coexist.</p>

                <h3>6) Four Specialities of Hospitality Services</h3>
                <ul>
                    <li><strong>Intangibility</strong> — cannot be tried before consumption; success rests on staff performance</li>
                    <li><strong>Heterogeneity</strong> — every service is unique to provider behaviour and customer need</li>
                    <li><strong>Simultaneous production & consumption</strong> — cannot be produced/stored in advance</li>
                    <li><strong>Indivisibility</strong> — provider and user must both be present at the place of use</li>
                </ul>

                <h3>7) Guest Stay, Seasonality & the Tourism Link</h3>
                <ul>
                    <li>Longer guest stay → better occupancy rate</li>
                    <li>Seasonality of demand → low occupancy and weaker business results</li>
                    <li>Hospitality = material basis, infrastructural prerequisite and receptive basis of tourism</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 1 Exam Focus</h4>
                    <p>Be ready to explain <strong>service vs hospitality</strong>, the <strong>4 specialities</strong>, <strong>local export</strong>, the <strong>basic/supplementary/additional</strong> split, and the <strong>hospitality–tourism link</strong>.</p>
                </div>
            `
        }
    },

    unit2BusinessEconomics: {
        id: "pqb4c3",
        name: "Unit 2: Business Economics",
        icon: "fa-chart-line",
        color: "#14b8a6",

        flashcards: [
            {
                id: "mptrhc",
                question: "What is the fundamental aim of economics as a science?",
                answer: "To investigate how to rationally use limited resources in order to satisfy largely unlimited needs in the best possible way; it studies how society produces and distributes goods and services.",
                explanation: "Scarcity and allocation are the central economic problem."
            },
            {
                id: "llmehp",
                question: "How does economics split into macro and microeconomics?",
                answer: "Macroeconomics (Greek makro = large) studies the economy as a whole — growth, inflation, unemployment. Microeconomics (mikro = small) studies consumers, households and companies, with demand, supply and prices.",
                explanation: "From the 'Department of Economics' slide."
            },
            {
                id: "9z0v7l",
                question: "How is business economics defined as a science?",
                answer: "One of the most important microeconomic sciences; it analyses management at company level (the basic unit of the economy), the factors influencing company success, and the rules whose application improves business.",
                explanation: "Aim: better ways to achieve company goals — improve production and sale of goods/services."
            },
            {
                id: "y672zb",
                question: "What is the task of business economics as a teaching subject?",
                answer: "To teach future business experts and entrepreneurs how the business management system works — passing on established, indisputable scientific findings to people who work (or will work) in companies.",
                explanation: "Education translates validated science into managerial capability."
            },
            {
                id: "flxx12",
                question: "How is business economics a theoretical AND practical discipline?",
                answer: "Theory and practice interact: practice supplies existing economic problems and verifies assumptions/knowledge; this expands existing knowledge and yields new insights that feed back into theory.",
                explanation: "Theory ↔ practice feedback loop slide."
            },
            {
                id: "h0oijp",
                question: "What is the difference between general and special business economics?",
                answer: "General economics deals with problems common to all companies regardless of type; special (specialised) economics deals with problems of particular activity, ownership form, or business function.",
                explanation: "Division of the business economy."
            },
            {
                id: "gia6o4",
                question: "Give examples of 'special economics of companies'.",
                answer: "By activity: industrial, trading, transport, hotel, banking. By ownership: public vs private companies. By business function: production, procurement, sales, transport economics.",
                explanation: "Hospitality economics is a special business economics by activity."
            },
            {
                id: "rql9wm",
                question: "What were the early roots of business economics (Concepts up to 1675)?",
                answer: "Ancient traces: Code of Hammurabi (interest), Old Testament (condemns usury), Solon (debt/mortgage reform), Plato (first theory of money in the Republic), Aristotle (utility & market value). Pegolotti & Meder wrote early bookkeeping techniques (14th c.).",
                explanation: "Historical development — period before systematic economics."
            },
            {
                id: "z7b77c",
                question: "Which works/authors mark systematic economics (1675–1890)?",
                answer: "Jacques Savary — 'The Perfect Merchant' (1675, first systematic work); Richard Cantillon (risk & uncertainty of the entrepreneur); the Physiocrats (wealth lies in production); Adam Smith — 'The Wealth of Nations' (1776, competition & the 'invisible hand'); Karl Marx (goods, capital, profit, surplus value).",
                explanation: "Origin and development of systematic economics."
            },
            {
                id: "k9n6me",
                question: "What factors made business economics an independent discipline (~1900)?",
                answer: "(1) Marshall's synthesis of macro- and microeconomics; (2) foundation of the first colleges; (3) publication of the first journal in the field; (4) emergence of the scientific organisation of work.",
                explanation: "Four enabling factors from the slides."
            },
            {
                id: "qvo1ws",
                question: "Who is Alfred Marshall and why is he important here?",
                answer: "Cambridge professor (1842–1924), leading neoclassicist, author of 'Principles of Economics'. He replaced 'political economy' with 'economics' as pure & applied science, applied microeconomic analysis, and completed cost theory using marginal costs.",
                explanation: "Key figure in the independence of the discipline."
            },
            {
                id: "17gbn1",
                question: "Name milestones: first business schools, first journal, scientific organisation of work.",
                answer: "First higher trade school in Leipzig and the Exportakademie in Vienna (1898); first journal founded 1906 by Eugen Schmalenbach; scientific organisation of work credited mainly to Taylor, Ford and Fayol.",
                explanation: "Institutional milestones (~1898–1906)."
            },
            {
                id: "c7jeeq",
                question: "What happened with socialist business economics?",
                answer: "With the first state socialist companies in Soviet Russia (1918) the subject was extended to socialist companies (different ownership/management). They had no financial independence (income to the state budget), so material interest and efficiency lagged behind capitalist competitors. Lenin evaluated Taylor's system (1918).",
                explanation: "Emergence and retreat of socialist business economics."
            }
        ],

        quiz: [
            {
                id: "qcoec0",
                question: "Business economics is primarily classified as a:",
                options: ["Macroeconomic science", "Microeconomic science", "Branch of finance only", "Branch of accounting only"],
                correct: 1
            },
            {
                id: "92qq2h",
                question: "Macroeconomics studies topics such as:",
                options: ["Individual consumer choice only", "Economic growth, inflation, unemployment", "Menu engineering only", "Room-cleaning standards"],
                correct: 1
            },
            {
                id: "2zlpux",
                question: "General business economics studies:",
                options: ["Only banks", "Only hotels", "Problems common to all companies", "Only public enterprises"],
                correct: 2
            },
            {
                id: "m1ttg5",
                question: "'The Wealth of Nations' (1776), dealing with competition and the 'invisible hand', was written by:",
                options: ["Richard Cantillon", "Adam Smith", "Alfred Marshall", "Karl Marx"],
                correct: 1
            },
            {
                id: "zgsr8w",
                question: "The first systematic economic work, 'The Perfect Merchant' (1675), was written by:",
                options: ["Eugen Schmalenbach", "Jacques Savary", "Aristotle", "Henri Fayol"],
                correct: 1
            },
            {
                id: "n5mnj6",
                question: "The first journal in business economics (1906) was founded by:",
                options: ["Alfred Marshall", "Frederick Taylor", "Eugen Schmalenbach", "Adam Smith"],
                correct: 2
            },
            {
                id: "m2k98i",
                question: "The scientific organisation of work is credited mainly to:",
                options: ["Plato, Aristotle, Solon", "Taylor, Ford, Fayol", "Smith, Marx, Cantillon", "Keynes, Pigou, Robinson"],
                correct: 1
            },
            {
                id: "5qc5ot",
                question: "Hospitality economics is an example of:",
                options: ["General business economics", "Macroeconomics", "Special business economics (by activity)", "Public finance"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "tf5x5y",
                sentence: "Business economics is one of the most important _______ sciences.",
                answer: "microeconomic",
                hint: "Company / small-level scope..."
            },
            {
                id: "9h8jgw",
                sentence: "Macroeconomics deals with the economy as a _______.",
                answer: "whole",
                hint: "Total system..."
            },
            {
                id: "kcsu33",
                sentence: "Adam Smith's 1776 work was 'The Wealth of _______'.",
                answer: "Nations",
                hint: "Countries / states..."
            },
            {
                id: "emecqf",
                sentence: "Alfred _______ synthesised macro- and microeconomics and refined cost theory.",
                answer: "Marshall",
                hint: "Cambridge neoclassicist..."
            },
            {
                id: "90npe2",
                sentence: "The first business-economics journal (1906) was founded by Eugen _______.",
                answer: "Schmalenbach",
                hint: "German economist..."
            },
            {
                id: "ylzs8p",
                sentence: "_______ economics deals with problems common to all companies.",
                answer: "General",
                hint: "Opposite of 'special'..."
            }
        ],

        learn: {
            id: "ol4kzx",
            title: "Unit 2 — Business Economics as a Scientific & Teaching Discipline",
            content: `
                <h3>1) Economics & the Place of Business Economics</h3>
                <p>Economics studies the rational use of <strong>limited resources</strong> to satisfy largely <strong>unlimited needs</strong>.</p>
                <ul>
                    <li><strong>Macroeconomics</strong> — economy as a whole (growth, inflation, unemployment)</li>
                    <li><strong>Microeconomics</strong> — consumers, households, companies; demand, supply, prices</li>
                    <li><strong>Business economics</strong> — applied microeconomics at <em>company level</em></li>
                </ul>

                <h3>2) Science vs Teaching Subject</h3>
                <div class="formula-box">
                    <p><strong>As science:</strong> analyses factors of company success; defines rules to improve business</p>
                    <p><strong>As teaching subject:</strong> teaches future experts/entrepreneurs how the business system works</p>
                </div>

                <h3>3) Theory ↔ Practice</h3>
                <ul>
                    <li>Practice supplies <strong>existing economic problems</strong></li>
                    <li>It verifies assumptions and knowledge</li>
                    <li>This expands knowledge and yields <strong>new insights</strong> that feed theory</li>
                </ul>

                <h3>4) General vs Special Business Economics</h3>
                <ul>
                    <li><strong>General:</strong> problems common to all companies</li>
                    <li><strong>Special — by activity:</strong> industrial, trading, transport, <em>hotel</em>, banking</li>
                    <li><strong>Special — by ownership:</strong> public vs private companies</li>
                    <li><strong>Special — by function:</strong> production, procurement, sales, transport</li>
                </ul>

                <h3>5) Historical Development</h3>
                <h4>Concepts up to 1675</h4>
                <ul>
                    <li>Code of Hammurabi (interest); Old Testament condemns usury</li>
                    <li>Solon (debt reform); Plato (first theory of money); Aristotle (utility & market value)</li>
                    <li>Pegolotti & Meder — early bookkeeping techniques (14th c.)</li>
                </ul>
                <h4>Systematic economics 1675–1890</h4>
                <ul>
                    <li><strong>Jacques Savary</strong> — 'The Perfect Merchant' (1675)</li>
                    <li><strong>Richard Cantillon</strong> — risk & uncertainty of the entrepreneur</li>
                    <li><strong>Physiocrats</strong> — true wealth lies in production, not trade</li>
                    <li><strong>Adam Smith</strong> — 'The Wealth of Nations' (1776): competition & the 'invisible hand'</li>
                    <li><strong>Karl Marx</strong> — goods, capital, profit, rent, surplus value</li>
                </ul>
                <h4>Independence (~1900) and after</h4>
                <ul>
                    <li>Enabled by: Marshall's synthesis, first colleges, first journal, scientific organisation of work</li>
                    <li><strong>Alfred Marshall</strong> (1842–1924) — 'Principles of Economics'; marginal costs</li>
                    <li>First schools: Leipzig & Vienna Exportakademie (1898); first journal: Schmalenbach (1906)</li>
                    <li>Scientific organisation of work: <strong>Taylor, Ford, Fayol</strong></li>
                    <li>Socialist business economics: Soviet Russia (1918) — no financial independence → lower efficiency</li>
                </ul>

                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Common Mistake</h4>
                    <p>Don't mix macro and micro scope. In this course most questions are at the <strong>firm level</strong> (micro/business economics).</p>
                </div>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 2 Exam Focus</h4>
                    <p>Know the hierarchy <strong>economics → macro/micro → business economics → hospitality economics</strong>, the <strong>general/special</strong> split, and the key historical names (<strong>Savary, Smith, Marshall, Schmalenbach, Taylor/Ford/Fayol</strong>).</p>
                </div>
            `
        }
    },

    unit3HospitalityBusinesses: {
        id: "4wi8yg",
        name: "Unit 3: Hospitality Businesses",
        icon: "fa-hotel",
        color: "#6366f1",

        flashcards: [
            {
                id: "y0l7z0",
                question: "How is a modern hospitality business conceptually defined?",
                answer: "An independent, complex economic, legal, technical and social system that produces hospitality products and services for the hospitality market — using work equipment, objects and human potential — in order to generate profit and achieve set goals.",
                explanation: "Core conceptual definition from Unit 3."
            },
            {
                id: "912pab",
                question: "Which four systems describe the hospitality business as a complex system?",
                answer: "Technological (transforms inputs into outputs), Economic (an economic unit providing services), Legal (acquires rights and obligations) and Sociological (a community of people who work in it).",
                explanation: "The business functions, develops and disappears depending on goal achievement."
            },
            {
                id: "av6e6y",
                question: "What are the three essential components of a business?",
                answer: "Objective component (buildings, machines, materials, products, money), Subjective component (people, knowledge, creative ideas) and Organizational component (the way resources and work are combined into one unit).",
                explanation: "A business is a 'living organism' carrying out economic activity."
            },
            {
                id: "mgnhng",
                question: "Who is an entrepreneur, and what statuses can they hold?",
                answer: "A person with business acumen and management skills, willing to take risk based on innovation and continuous development, who sees opportunities others miss. Status: an owner/co-owner of capital, or a professional manager working for salary who still drives development.",
                explanation: "Entrepreneur traits: motivation, mental ability, communication, decision-making, ability to realise ideas."
            },
            {
                id: "jztyvg",
                question: "What is entrepreneurship and its five main activities?",
                answer: "The activity of entrepreneurs aimed at creating, organising and renewing businesses to create a new market. Five activities: relations with raw materials & capital, organization, innovation, relations with employees, relations with the state & society.",
                explanation: "A key driver of business development."
            },
            {
                id: "neucfx",
                question: "What is the difference between entrepreneurship and management?",
                answer: "Entrepreneurship initiates changes/innovation in production and business and exploits opportunities for profit; management is the ongoing coordination of the production process and the utilisation of existing resources.",
                explanation: "Both are needed but have different missions."
            },
            {
                id: "km31hn",
                question: "By which criteria are hospitality businesses classified?",
                answer: "By business subject (accommodation+F&B / only F&B / preparing food for consumption elsewhere), size, ownership (private/public/mixed) and legal form.",
                explanation: "Four classification criteria."
            },
            {
                id: "dm6d07",
                question: "What legal forms of hospitality business exist?",
                answer: "Companies of individuals — public company (unlimited joint liability) and limited partnership (general partners unlimited, limited partners up to invested capital); and Corporations — limited liability company (d.o.o.) and public limited company / joint-stock company (d.d., funded by issuing shares).",
                explanation: "Liability differs by legal form."
            },
            {
                id: "mtrbbr",
                question: "What is the synergy effect of merging hospitality businesses?",
                answer: "Combined businesses achieve more together than the sum of their separate effects — symbolically '2 + 2 = 5'. They use their potential more rationally and create better conditions for development.",
                explanation: "From the 'synergy effect' slide (Greek synergia = cooperation)."
            },
            {
                id: "fac67f",
                question: "What are the main motives for merging hospitality businesses?",
                answer: "Reduce competition / increase market share; increase capacity (lower costs); rationalization (fewer employees, managers, office space); diversification of production (reduce risk); and sharing business & financial risks.",
                explanation: "Five merger motives."
            },
            {
                id: "dwih9l",
                question: "Distinguish cooperation, consortium and cartel.",
                answer: "Cooperation is a milder merger where businesses keep full independence and work together. A consortium is occasional association for a joint large investment using joint capital. A cartel is consensual association of competitors to restrict/exclude market competition — the business loses economic independence but keeps legal autonomy.",
                explanation: "Cooperation forms vs cartels (slides 25–28)."
            },
            {
                id: "9ei3mv",
                question: "What is concentration, and what are conglomerate/holding/trust?",
                answer: "Concentration is a stronger merger where businesses lose economic and legal independence. Conglomerate: several legally independent businesses under one management (horizontal/vertical/diagonal). Holding: a company controlling others via majority shares (parent–subsidiaries). Trust: one large company formed by merger, losing economic & legal independence.",
                explanation: "Typical concentration forms."
            },
            {
                id: "g8cvjb",
                question: "What are the three basic business principles?",
                answer: "(1) The business principle (good business practice, legal compliance, realistic prices, no unfair competition/monopoly abuse, on-time quality fulfilment, reputation); (2) the principle of economic efficiency; (3) the principle of maintaining the continuity of the business.",
                explanation: "Rules applied to achieve economic goals rationally."
            },
            {
                id: "u7v8d5",
                question: "Which principles make up economic efficiency?",
                answer: "Productivity (of labour), Economy (economical use), and Profitability — pursued by most companies. Rationality means efficiency + economy: investing only necessary, justified resources.",
                explanation: "The three economic-efficiency principles."
            },
            {
                id: "fd5wlh",
                question: "What is business policy and how is it divided?",
                answer: "The entirety of decisions defining the business's objectives (economic = development & success; social = meeting people's needs) and the solutions to achieve them. Divided by period (long/medium/short-term) and by content (general / specific corporate policy).",
                explanation: "Cycle: set goals → plan → organize → monitor → redefine goals."
            },
            {
                id: "vxdjb9",
                question: "How are plans classified (time and content)?",
                answer: "By time: long-term (>5 years, strategic), medium-term (1–5 years), short-term (1 year, plus operational quarterly/monthly/daily). By content: quantitative (natural) plans and value (financial) plans. Policy↔planning: strategic, tactical, operational planning.",
                explanation: "Plans are management instruments."
            }
        ],

        quiz: [
            {
                id: "4m8hpf",
                question: "A hospitality business is best viewed as:",
                options: ["Only a legal entity", "Only a technical facility", "A complex economic–legal–technical–social system", "Only kitchens and rooms"],
                correct: 2
            },
            {
                id: "o95cmf",
                question: "The objective component of a business includes:",
                options: ["Knowledge and creative ideas", "Buildings, machines, materials, money", "The way work is combined", "Customer relationships"],
                correct: 1
            },
            {
                id: "s3178l",
                question: "Entrepreneurship (vs management) primarily emphasises:",
                options: ["Routine coordination", "Innovation and exploiting opportunities", "Only reporting", "Only compliance"],
                correct: 1
            },
            {
                id: "ihu87q",
                question: "The synergy effect of a merger is symbolically expressed as:",
                options: ["2 + 2 = 4", "2 + 2 = 5", "2 + 2 = 3", "2 × 2 = 2"],
                correct: 1
            },
            {
                id: "zb63sd",
                question: "A cartel is an association in which the business:",
                options: ["Keeps both economic and legal independence", "Loses economic independence but keeps legal autonomy", "Loses both economic and legal independence", "Becomes a sole proprietorship"],
                correct: 1
            },
            {
                id: "6ur8k6",
                question: "A company that controls others by holding the majority of their shares is a:",
                options: ["Cartel", "Consortium", "Holding company", "Trust"],
                correct: 2
            },
            {
                id: "lhkah1",
                question: "Which is NOT one of the three economic-efficiency principles?",
                options: ["Productivity", "Economy", "Profitability", "Liquidity"],
                correct: 3
            },
            {
                id: "a3zzyo",
                question: "Long-term plans typically cover a period of:",
                options: ["Less than 1 year", "1–5 years", "More than 5 years (strategic)", "Exactly 3 months"],
                correct: 2
            },
            {
                id: "4ik9js",
                question: "In a limited liability company (d.o.o.), shareholders are liable:",
                options: ["With all personal assets", "Up to the amount of invested capital", "Jointly and without limit", "Only the manager is liable"],
                correct: 1
            },
            {
                id: "mt8ujy",
                question: "By content, plans are divided into:",
                options: ["Long- and short-term plans", "Quantitative (natural) and value (financial) plans", "General and specific plans", "Strategic and tactical plans"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "376wzb",
                sentence: "A hospitality business is an independent, complex economic, legal, technical and social _______.",
                answer: "system",
                hint: "Interconnected structure..."
            },
            {
                id: "0n5hzf",
                sentence: "Entrepreneurship initiates change and innovation, while management coordinates the ongoing _______ process.",
                answer: "production",
                hint: "Making goods/services..."
            },
            {
                id: "am6lac",
                sentence: "The synergy effect is symbolically written as 2 + 2 = _______.",
                answer: "5",
                hint: "More than the sum..."
            },
            {
                id: "wwwcqy",
                sentence: "A _______ is association of competitors to restrict or exclude market competition.",
                answer: "cartel",
                hint: "Price/market agreement..."
            },
            {
                id: "6kdihn",
                sentence: "Economic efficiency rests on productivity, economy and _______.",
                answer: "profitability",
                hint: "Return / rentability..."
            },
            {
                id: "i8pk0g",
                sentence: "By content, plans are quantitative (natural) and _______ (financial).",
                answer: "value",
                hint: "Expressed in money..."
            },
            {
                id: "7d4spa",
                sentence: "A holding company controls others by holding the majority of their _______.",
                answer: "shares",
                hint: "Ownership stakes..."
            },
            {
                id: "acofrz",
                sentence: "The principle of maintaining _______ requires the firm to survive and keep developing.",
                answer: "continuity",
                hint: "Ongoing survival..."
            }
        ],

        learn: {
            id: "plgw2y",
            title: "Unit 3 — The Hospitality Business as a System",
            content: `
                <h3>1) Conceptual Definition</h3>
                <p>A modern hospitality business is an <strong>independent, complex economic, legal, technical and social system</strong> that produces hospitality products and services for the market — using equipment, objects and human potential — to generate profit and achieve set goals.</p>

                <h3>2) Four Sub-systems</h3>
                <ul>
                    <li><strong>Technological</strong> — transforms inputs into outputs</li>
                    <li><strong>Economic</strong> — an economic unit providing services</li>
                    <li><strong>Legal</strong> — acquires rights, assumes obligations</li>
                    <li><strong>Sociological</strong> — a community of working people</li>
                </ul>

                <h3>3) Essential Components</h3>
                <div class="formula-box">
                    <p><strong>Objective:</strong> buildings, machines, materials, products, money</p>
                    <p><strong>Subjective:</strong> people, knowledge, creative ideas</p>
                    <p><strong>Organizational:</strong> the way resources + work are combined into one unit</p>
                </div>

                <h3>4) Entrepreneur, Entrepreneurship & Management</h3>
                <ul>
                    <li><strong>Entrepreneur:</strong> business acumen, risk-taking, innovation; status = owner/co-owner OR professional manager</li>
                    <li><strong>Entrepreneurship:</strong> creating/organising/renewing businesses; 5 activities — raw materials & capital, organization, innovation, employees, state & society</li>
                    <li><strong>Entrepreneurship vs management:</strong> initiating change & opportunity vs ongoing coordination of existing resources</li>
                </ul>

                <h3>5) Classification of Hospitality Businesses</h3>
                <ul>
                    <li><strong>Business subject:</strong> accommodation + F&B / only F&B / preparing food for consumption elsewhere</li>
                    <li><strong>Size:</strong> EU Commission criteria; optimal size = maximum profit at a given utilization</li>
                    <li><strong>Ownership:</strong> private / public (social + state) / mixed</li>
                    <li><strong>Legal form:</strong> companies of individuals (public company, limited partnership) and corporations (d.o.o., d.d.)</li>
                </ul>

                <h3>6) Association & Concentration of Businesses</h3>
                <p><strong>Synergy effect:</strong> combined businesses achieve more than the sum of their parts — "2 + 2 = 5".</p>
                <p><strong>Merger motives:</strong> reduce competition / market share; capacity (lower cost); rationalization; diversification; risk sharing.</p>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Cooperation</strong></td><td>Mild — full independence retained (consortium, cartels)</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Consortium</strong></td><td>Occasional association for a joint large investment</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Cartel</strong></td><td>Restricts competition; loses economic independence, keeps legal autonomy</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Conglomerate</strong></td><td>Several firms under one management (horizontal / vertical / diagonal)</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Holding</strong></td><td>Controls others via majority shares (parent + subsidiaries)</td></tr>
                    <tr><td><strong>Trust</strong></td><td>One large company from a merger; loses economic & legal independence</td></tr>
                </table>

                <h3>7) Business Principles</h3>
                <ul>
                    <li><strong>Business principle</strong> — good practice, legal compliance, realistic prices, on-time quality, no unfair competition/monopoly abuse, reputation</li>
                    <li><strong>Economic efficiency</strong> — productivity + economy + profitability (rationality)</li>
                    <li><strong>Continuity</strong> — survival + permanent development (reproduction principle)</li>
                </ul>

                <h3>8) Business Policy & Planning</h3>
                <ul>
                    <li><strong>Objectives:</strong> economic (development & success) + social (meeting needs)</li>
                    <li><strong>Cycle:</strong> set goals → plan → organize → monitor → redefine goals</li>
                    <li><strong>By period:</strong> long (>5 yrs, strategic) / medium (1–5 yrs, tactical) / short (1 yr, operational)</li>
                    <li><strong>By content:</strong> quantitative (natural) and value (financial) plans</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 3 Exam Focus</h4>
                    <p>This is the biggest unit. Master: the <strong>4 sub-systems</strong>, <strong>3 components</strong>, <strong>entrepreneurship vs management</strong>, <strong>legal forms</strong>, the <strong>association forms</strong> (synergy "2+2=5", cartel, holding, trust) and the <strong>three business principles</strong>.</p>
                </div>
            `
        }
    },

    unit4AssetsInHospitality: {
        id: "431ts6",
        name: "Unit 4: Assets of Reproduction",
        icon: "fa-warehouse",
        color: "#f59e0b",

        flashcards: [
            {
                id: "0bq58o",
                question: "In what forms can the assets of a hospitality company appear?",
                answer: "As money (or securities), as property (things), and as rights.",
                explanation: "Concept and distribution of assets (by appearance)."
            },
            {
                id: "d18q0n",
                question: "How are assets divided by involvement in the business process?",
                answer: "Into fixed assets ('fixed' / long-term assets) and short-term assets ('current' / working assets).",
                explanation: "The central planning/control division."
            },
            {
                id: "zjypp0",
                question: "What is the key difference between fixed and short-term assets?",
                answer: "Fixed assets are used in unchanged form for more than one year and gradually transfer their value; short-term assets are used once within less than a year and transfer their value in full to new products/services.",
                explanation: "Behaviour determines accounting treatment."
            },
            {
                id: "nxcq0a",
                question: "What does the 'good management' principle require for assets?",
                answer: "Rational, expedient use (income > costs); adequate storage and preservation of every asset; current and investment maintenance; and insuring assets against risks (breakage, damage, fire, flood, theft).",
                explanation: "Type-of-use-of-assets slide."
            },
            {
                id: "4n8bdf",
                question: "How are fixed assets allocated (by appearance)?",
                answer: "Intangible assets, tangible assets, financial assets and (long-term) receivables.",
                explanation: "Four categories of fixed assets."
            },
            {
                id: "1qrbh7",
                question: "Give examples of intangible and tangible fixed assets.",
                answer: "Intangible: start-up capital/investments, expenditure on tourism-market research, concessions, trademarks, goodwill. Tangible: land, buildings (accommodation, F&B, auxiliary, sport/wellness), equipment & installations, tools, furniture, transport.",
                explanation: "Land + buildings are core tangible assets."
            },
            {
                id: "nmm8t9",
                question: "In what forms do short-term (current) assets arise?",
                answer: "Inventories; receivables due within one year; financial assets redeemable within one year; and money in the bank and cash register.",
                explanation: "Inventories of food & beverages are a large share in hospitality."
            },
            {
                id: "9xw5tc",
                question: "What is the turnover ratio and where is it lowest?",
                answer: "An indicator of how efficiently a company uses its assets — how often a type of asset 'turns over' in a period. The higher the rate, the faster funds turn over. It is lowest in hospitality businesses in tourist destinations (long wait to collect receivables).",
                explanation: "A short production cycle is desirable."
            },
            {
                id: "oiu8en",
                question: "What is liquidity and what must the liquidity ratio be?",
                answer: "The ability to always have enough cash to meet obligations. It is measured by the liquidity ratio comparing assets and current liabilities, which must be greater than 1.",
                explanation: "Liquidity ratio > 1."
            },
            {
                id: "w7sw6l",
                question: "What is solvency, and what happens with insolvency?",
                answer: "Solvency is the ability to settle due obligations in full and on the due date (cash, account balances, foreign currency, redeemable securities). Insolvency → suppliers stop deliveries, default interest & legal enforcement, blocked accounts and rising costs.",
                explanation: "A hospitality company is expected to be solvent every day."
            },
            {
                id: "yxdau9",
                question: "What is amortization (depreciation)?",
                answer: "The value expression of the consumption of fixed assets — the total technical and economic wear-and-tear of fixed-asset elements in a business process, transferred into the price of services. Caused by physical wear and economic obsolescence.",
                explanation: "Links long-term asset use with period costs."
            },
            {
                id: "wdlpx9",
                question: "Which assets are excluded from amortization, and what is revaluation?",
                answer: "Land (indefinite useful life), works of art/archive material, financial assets, start-up & research costs (expensed), and assets under preparation are not depreciated. Revaluation adjusts book value to market prices so amortization stays realistic.",
                explanation: "Calculation-of-amortization rules."
            },
            {
                id: "mptb86",
                question: "What amortization periods does Croatian law set for asset groups?",
                answer: "20 years — buildings/vessels >1,000 GRT; 10 years — other unspecified assets; 5 years — basic herd, passenger cars; 4 years — intangibles, equipment, vehicles & machinery (except passenger cars); 2 years — computers, IT equipment & programs, cell phones, network equipment.",
                explanation: "From the Croatian Depreciation Act."
            },
            {
                id: "nluajq",
                question: "What are the two amortization systems and the time-system methods?",
                answer: "Time amortization system and functional amortization system. Time methods: straight-line (linear), progressive, and degressive. The linear annual rate a% = 100 / t (t = useful life).",
                explanation: "Functional method depends on output, not time."
            },
            {
                id: "2doj9v",
                question: "Compare straight-line, progressive and degressive methods.",
                answer: "Straight-line: equal amounts each year (a% = 100/t; A = N·a%/100 = N/t). Progressive: lower amounts at first, rising later. Degressive (declining balance): higher amounts in early years, then lower (rate on the remaining undepreciated value).",
                explanation: "N = acquisition value, A = annual amortization amount."
            },
            {
                id: "e8ryni",
                question: "What two types of maintenance are applied to fixed assets?",
                answer: "Current (routine) maintenance — daily (minor breakdowns, prevention, cleaning) and periodic (inspection/replacement of worn parts); and Investment maintenance — roof, façade, painting, installations (electrical, sanitary, gas, heating), boiler rooms, elevators.",
                explanation: "Good maintenance extends service life."
            }
        ],

        quiz: [
            {
                id: "30slhy",
                question: "Assets used in unchanged form for more than one year are:",
                options: ["Current assets", "Fixed assets", "Liabilities", "Receivables only"],
                correct: 1
            },
            {
                id: "ovuaby",
                question: "Short-term (current) assets transfer their value:",
                options: ["Gradually over many years", "Only when the firm closes", "In full within one cycle (under a year)", "Never"],
                correct: 2
            },
            {
                id: "tqrpn9",
                question: "The liquidity ratio must be:",
                options: ["Less than 1", "Exactly 0", "Greater than 1", "Equal to the turnover ratio"],
                correct: 2
            },
            {
                id: "tr7m6u",
                question: "Which asset is excluded from amortization?",
                options: ["Hotel building", "Kitchen equipment", "Land", "Company vehicle"],
                correct: 2
            },
            {
                id: "6h6au1",
                question: "Under Croatian law, computers and IT equipment are amortized over:",
                options: ["20 years", "10 years", "5 years", "2 years"],
                correct: 3
            },
            {
                id: "a48hbw",
                question: "The straight-line annual amortization rate is calculated as:",
                options: ["a% = t / 100", "a% = 100 / t", "a% = N × t", "a% = N / 100"],
                correct: 1
            },
            {
                id: "6pds4l",
                question: "The turnover ratio is LOWEST in hospitality businesses that:",
                options: ["Operate year-round in cities", "Are located on roads (transit)", "Are in tourist destinations (slow receivable collection)", "Sell only for cash"],
                correct: 2
            },
            {
                id: "ruepre",
                question: "Solvency is the ability to:",
                options: ["Avoid all costs", "Settle due obligations in full and on the due date", "Maximise market share", "Depreciate land"],
                correct: 1
            },
            {
                id: "cgetiu",
                question: "Which is an example of an intangible fixed asset?",
                options: ["Hotel building", "Goodwill / trademark", "Cash register balance", "Food inventory"],
                correct: 1
            },
            {
                id: "jh7tqo",
                question: "Buildings (and vessels >1,000 GRT) are amortized under Croatian law over:",
                options: ["2 years", "4 years", "10 years", "20 years"],
                correct: 3
            }
        ],

        fillBlanks: [
            {
                id: "5iy2ei",
                sentence: "Assets used in unchanged form for more than one year are _______ assets.",
                answer: "fixed",
                hint: "Long-term class..."
            },
            {
                id: "bowfa8",
                sentence: "Short-term (current) assets transfer their value in _______.",
                answer: "full",
                hint: "Not gradually..."
            },
            {
                id: "ex6v52",
                sentence: "The liquidity ratio must be greater than _______.",
                answer: "1",
                hint: "Single digit..."
            },
            {
                id: "0jian1",
                sentence: "_______ is excluded from amortization because it has an indefinite useful life.",
                answer: "Land",
                hint: "Ground / plot..."
            },
            {
                id: "ym1bd8",
                sentence: "The straight-line annual amortization rate is a% = 100 / _______.",
                answer: "t",
                hint: "Useful life in years..."
            },
            {
                id: "v82q2u",
                sentence: "Computers and IT equipment are amortized over _______ years under Croatian law.",
                answer: "2",
                hint: "Single digit..."
            },
            {
                id: "w77s8z",
                sentence: "Adjusting book value to market prices for realistic amortization is called _______.",
                answer: "revaluation",
                hint: "Re-stating value..."
            },
            {
                id: "3fque5",
                sentence: "The two maintenance types are current (routine) and _______ maintenance.",
                answer: "investment",
                hint: "Bigger renewal works..."
            }
        ],

        learn: {
            id: "v5jgqv",
            title: "Unit 4 — The Assets of Reproduction",
            content: `
                <h3>1) Concept & Distribution of Assets</h3>
                <p>By appearance, assets may be <strong>money/securities</strong>, <strong>property</strong>, or <strong>rights</strong>. By involvement in the business process:</p>
                <div class="formula-box">
                    <p><strong>Fixed assets:</strong> used &gt; 1 year in unchanged form; value transferred gradually</p>
                    <p><strong>Short-term (current) assets:</strong> used once &lt; 1 year; value transferred in full</p>
                </div>

                <h3>2) 'Good Management' of Assets</h3>
                <ul>
                    <li>Rational, expedient use (income &gt; costs)</li>
                    <li>Adequate storage and preservation of every asset</li>
                    <li>Current and investment maintenance</li>
                    <li>Insurance against risks (breakage, damage, fire, flood, theft)</li>
                </ul>

                <h3>3) Fixed Assets</h3>
                <ul>
                    <li><strong>Intangible:</strong> start-up capital, market research, concessions, trademarks, goodwill</li>
                    <li><strong>Tangible:</strong> land, buildings (accommodation, F&B, auxiliary, sport/wellness), equipment & installations, tools, furniture, transport</li>
                    <li><strong>Financial assets</strong> and <strong>long-term receivables</strong> (&gt; 1 year)</li>
                </ul>

                <h3>4) Short-term Assets & Indicators</h3>
                <ul>
                    <li>Forms: inventories, receivables (≤1 yr), financial assets (≤1 yr), cash/bank</li>
                    <li><strong>Turnover ratio:</strong> how often assets turn over — lowest in destination hotels (slow receivables)</li>
                    <li><strong>Liquidity:</strong> always enough cash; liquidity ratio &gt; 1</li>
                    <li><strong>Solvency:</strong> settle due obligations on the due date — expected <em>every day</em></li>
                </ul>
                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Insolvency consequences</h4>
                    <p>Suppliers stop deliveries; default interest & legal enforcement; blocked accounts and confiscation; rising costs.</p>
                </div>

                <h3>5) Amortization (Depreciation)</h3>
                <p>The value expression of fixed-asset consumption — total technical + economic wear transferred into service prices. Caused by <strong>physical wear</strong> and <strong>economic obsolescence</strong>.</p>
                <ul>
                    <li><strong>Excluded:</strong> land, works of art/archives, financial assets, start-up/research costs, assets under preparation</li>
                    <li><strong>Revaluation:</strong> adjust book value to market prices for realistic amortization</li>
                </ul>
                <h4>Croatian amortization periods</h4>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td>Buildings, vessels &gt;1,000 GRT</td><td>20 years</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td>Other (unspecified) assets</td><td>10 years</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td>Basic herd, passenger cars</td><td>5 years</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td>Intangibles, equipment, vehicles & machinery (not passenger cars)</td><td>4 years</td></tr>
                    <tr><td>Computers, IT equipment & programs, cell phones, network equipment</td><td>2 years</td></tr>
                </table>

                <h3>6) Amortization Methods</h3>
                <div class="formula-box">
                    <p><strong>Linear rate:</strong> a% = 100 / t &nbsp;(t = useful life in years)</p>
                    <p><strong>Annual amount:</strong> A = N · a% / 100 = N / t &nbsp;(N = acquisition value)</p>
                </div>
                <ul>
                    <li><strong>Time system:</strong> straight-line (equal), progressive (rising), degressive (declining balance — higher early)</li>
                    <li><strong>Functional system:</strong> based on output/operating hours, ignoring time</li>
                </ul>

                <h3>7) Maintenance</h3>
                <ul>
                    <li><strong>Current (routine):</strong> daily (minor faults, prevention, cleaning) + periodic (inspect/replace worn parts)</li>
                    <li><strong>Investment:</strong> roof, façade, painting, electrical/sanitary/gas/heating installations, boiler rooms, elevators</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 4 Exam Focus</h4>
                    <p>Separate <strong>fixed vs current</strong> assets, know <strong>liquidity (&gt;1) vs solvency</strong>, the <strong>Croatian amortization periods</strong> (20/10/5/4/2), and the <strong>linear rate a% = 100/t</strong>.</p>
                </div>
            `
        }
    },

    unit5CostTheory: {
        id: "xixojd",
        name: "Unit 5: Theory of Costs",
        icon: "fa-calculator",
        color: "#ef4444",

        flashcards: [
            {
                id: "dna1vv",
                question: "What does cost theory examine?",
                answer: "The origin, characteristics and behaviour of costs in business processes — the nature and types of costs, their allocation to cost units, their dependence on capacity utilization, and the relationship between costs, prices, revenue and business results.",
                explanation: "Knowing costs is essential for managing profitability."
            },
            {
                id: "a316gm",
                question: "How are costs defined?",
                answer: "Value-expressed consumption of the elements of the work process (and taxes/duties), caused by the realization of the business performance — i.e. resources sacrificed to achieve effects in line with the firm's purpose.",
                explanation: "Costs are tied to purposeful business activity."
            },
            {
                id: "h26ylx",
                question: "What is the difference between cost and expenditure?",
                answer: "Cost = the (physical) use/consumption of material values, labour and services in producing effects (often in physical units). Expenditure = any outflow of money from the business, regardless of nature or purpose.",
                explanation: "Cost vs expenditure is a frequent exam item."
            },
            {
                id: "u2ywdr",
                question: "How can cost and expenditure relate in time?",
                answer: "Cost may precede expenditure (electricity used, paid later); they may coincide (paying for a service when performed); or cost may follow expenditure (materials bought first, consumed later).",
                explanation: "Economic vs cash timing are not always synchronized."
            },
            {
                id: "0nbk2q",
                question: "When are cost and expenditure NOT economically linked?",
                answer: "Expenditure without cost: buying land for tennis courts (no depreciation on land). Cost without expenditure: a cleaning machine received as a gift (no purchase outflow), but its depreciation is a cost.",
                explanation: "Classic two examples from the slides."
            },
            {
                id: "5a66fa",
                question: "What are the 'natural types' of costs?",
                answer: "Costs of resources for work (materials), cost of the subject of work, labour costs (gross wages), service costs, and taxes & duties (independent of the business result). A clearer split is: material costs, service costs, amortization, gross wages, taxes & contributions.",
                explanation: "Natural cost types follow the production process."
            },
            {
                id: "hi20zk",
                question: "What are cost centers (places) and cost bearers (units)?",
                answer: "Cost centers are spatially/functionally rounded parts of the company where costs are incurred (reception, F&B, housekeeping, maintenance). Cost bearers (cost units/objects) are the effects causing costs — products or services — split into internal and external cost units.",
                explanation: "Recording by center enables profitability analysis."
            },
            {
                id: "0apmga",
                question: "What is the difference between direct and indirect costs?",
                answer: "Direct costs are allocated directly to a cost center/unit on the basis of standards (e.g. food & beverages). Indirect costs (operational overheads, general administration & distribution) cannot be assigned directly and are transferred via a key or calculation sheet.",
                explanation: "Indirect = common to all cost bearers."
            },
            {
                id: "s5sp3t",
                question: "What are active and passive cost centers?",
                answer: "Active cost centers cover their costs with their own income; passive cost centers have expenses greater than revenue (or no revenue), e.g. the promotion department — yet each contributes to the business.",
                explanation: "Benefit may appear immediately (active) or later (passive)."
            },
            {
                id: "gsf9y5",
                question: "Distinguish variable and fixed costs (and the fixed-cost share).",
                answer: "Variable costs rise/fall in total with utilization but stay constant per unit (all direct costs are variable). Fixed costs ('period costs' / 'costs of installed capacity') stay unchanged regardless of volume. In hotels, fixed costs are 60–80% of total operating costs; much lower in restaurants.",
                explanation: "Fixed-cost share is a frequent exam number."
            },
            {
                id: "eeepwf",
                question: "What are the three cost zones by capacity utilization?",
                answer: "Degression zone (costs grow slower than utilization → falling average cost), proportionality zone (lowest average costs — the optimal zone), and progressivity zone (rising average costs at high utilization).",
                explanation: "Finding the proportionality zone is key for rational business."
            },
            {
                id: "8ss9ci",
                question: "What is the difference between relatively fixed and absolutely fixed costs?",
                answer: "Relatively fixed (mixed) costs contain both variable and fixed components — seasonal wages, ongoing maintenance, energy/water/fuel, advertising. Absolutely fixed costs stay constant — permanent staff salaries, amortization, loan interest, insurance, calculated investment maintenance.",
                explanation: "Mixed costs can be progressive or degressive."
            },
            {
                id: "v4ka7l",
                question: "What is the cost reactivity coefficient (h) and its values?",
                answer: "h = T% / Q% (cost-increase intensity ÷ utilization-increase intensity). h = 0 → only fixed costs; h = 1 → proportional; h > 1 → progressive costs; h < 1 → degressive costs.",
                explanation: "Measures sensitivity of costs to capacity utilization."
            },
            {
                id: "9sl5hh",
                question: "What does the cost plan include, and the material-cost model %?",
                answer: "The total cost plan covers the material cost plan, personnel cost plan and the plan of other direct costs. A material-cost calculation model: 35% for food, 22% for beverages, 50% for other services.",
                explanation: "Cost planning is part of overall corporate planning (built on sales planning)."
            },
            {
                id: "hxt3pv",
                question: "What is the break-even point (cost recovery point)?",
                answer: "The level of effects (quantity of products/services) where revenue equals costs — no profit, no loss. Below it the company makes a loss; above it, a profit.",
                explanation: "Closely linked to costs–revenue–utilization analysis."
            },
            {
                id: "t6j6wc",
                question: "What is functional value analysis of hospitality services?",
                answer: "Breaking a service's functions into components and examining the function–cost relationship to identify and eliminate unnecessary costs while keeping quality — finding the optimum between number of functions and price.",
                explanation: "Aim: maximum rationalization of the service process."
            }
        ],

        quiz: [
            {
                id: "36gdab",
                question: "Cost theory primarily studies:",
                options: ["Only taxes", "Only wages", "The origin, characteristics and behaviour of costs", "Only asset valuation"],
                correct: 2
            },
            {
                id: "7dohja",
                question: "Expenditure is best described as:",
                options: ["Any outflow of money from the business", "Only profitable spending", "Only payroll", "Only variable cost"],
                correct: 0
            },
            {
                id: "aa1e3m",
                question: "Buying land (no depreciation) is an example of:",
                options: ["Cost without expenditure", "Expenditure without cost", "Cost and expenditure coinciding", "Neither cost nor expenditure"],
                correct: 1
            },
            {
                id: "7ebf0h",
                question: "All direct costs have the character of:",
                options: ["Fixed costs", "Variable costs", "Period costs", "Sunk costs"],
                correct: 1
            },
            {
                id: "0aeco3",
                question: "In hotels, fixed costs are approximately what share of total operating costs?",
                options: ["10–20%", "30–40%", "60–80%", "Over 95%"],
                correct: 2
            },
            {
                id: "2rzz4b",
                question: "The cost zone with the LOWEST average costs is the:",
                options: ["Degression zone", "Proportionality zone", "Progressivity zone", "Recovery zone"],
                correct: 1
            },
            {
                id: "xqcqh3",
                question: "The reactivity coefficient is calculated as:",
                options: ["h = Q% / T%", "h = T% / Q%", "h = T% × Q%", "h = 100 / Q%"],
                correct: 1
            },
            {
                id: "7hkzp4",
                question: "A reactivity coefficient h = 1 means costs are:",
                options: ["Only fixed", "Proportional", "Progressive", "Degressive"],
                correct: 1
            },
            {
                id: "ymdaua",
                question: "At the break-even point, the company has:",
                options: ["Maximum profit", "Maximum loss", "Neither profit nor loss", "Only fixed costs"],
                correct: 2
            },
            {
                id: "r2j1o2",
                question: "In the material-cost calculation model, the share for food is:",
                options: ["22%", "35%", "50%", "60%"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "2snm1b",
                sentence: "Costs are the value-expressed _______ of the elements of the work process.",
                answer: "consumption",
                hint: "Using up of resources..."
            },
            {
                id: "lph9fb",
                sentence: "Expenditure is any outflow of _______ from the business system.",
                answer: "money",
                hint: "Cash leaving the firm..."
            },
            {
                id: "b0yayy",
                sentence: "Buying land creates an expenditure but no _______ (no depreciation).",
                answer: "cost",
                hint: "The other key term..."
            },
            {
                id: "9bn6z8",
                sentence: "In hotels, fixed costs are about 60–_______% of total operating costs.",
                answer: "80",
                hint: "Upper bound, two digits..."
            },
            {
                id: "l7ds37",
                sentence: "The cost zone with the lowest average costs is the _______ zone.",
                answer: "proportionality",
                hint: "Between degression and progressivity..."
            },
            {
                id: "rsbig6",
                sentence: "The reactivity coefficient is h = T% / _______.",
                answer: "Q%",
                hint: "Utilization-increase intensity..."
            },
            {
                id: "40pybo",
                sentence: "At the _______ point, revenue equals costs (no profit, no loss).",
                answer: "break-even",
                hint: "Cost-recovery point..."
            },
            {
                id: "3xctsw",
                sentence: "In the material-cost model, beverages are calculated at _______%.",
                answer: "22",
                hint: "Between food 35% and other 50%..."
            }
        ],

        learn: {
            id: "b34io0",
            title: "Unit 5 — Theory of Costs in Hospitality",
            content: `
                <h3>1) Why Cost Theory Matters</h3>
                <p>It examines the <strong>origin, characteristics and behaviour</strong> of costs — types, allocation to cost units, dependence on capacity utilization, and the link to prices, revenue and results.</p>

                <h3>2) Cost vs Expenditure</h3>
                <div class="formula-box">
                    <p><strong>Cost:</strong> value-expressed consumption of work elements/labour/services to create effects</p>
                    <p><strong>Expenditure:</strong> any outflow of money from the business, regardless of purpose</p>
                </div>
                <h4>Timing relationships</h4>
                <ul>
                    <li>Cost <em>before</em> expenditure (electricity used, paid later)</li>
                    <li>Cost <em>with</em> expenditure (paying for a service when performed)</li>
                    <li>Cost <em>after</em> expenditure (materials bought first, consumed later)</li>
                </ul>
                <div class="warning-box">
                    <h4><i class="fas fa-exclamation-triangle"></i> Not always linked</h4>
                    <p><strong>Expenditure without cost:</strong> buying land (no depreciation). <strong>Cost without expenditure:</strong> a machine received as a gift (no outflow, but depreciation is a cost).</p>
                </div>

                <h3>3) Classifying Costs</h3>
                <ul>
                    <li><strong>Natural types:</strong> material costs, service costs, amortization, gross wages, taxes & contributions</li>
                    <li><strong>Cost centers (places):</strong> reception, F&B, housekeeping, maintenance — by spatial or functional principle</li>
                    <li><strong>Cost bearers (units):</strong> internal vs external cost units (the effects causing costs)</li>
                    <li><strong>Direct vs indirect:</strong> direct allocated straight to units; indirect (overheads, admin) via a key</li>
                    <li><strong>Active vs passive centers:</strong> cover their own costs vs not (e.g. promotion department)</li>
                </ul>

                <h3>4) Cost Behaviour by Capacity Utilization</h3>
                <ul>
                    <li><strong>Variable costs:</strong> change in total with utilization, constant per unit (all direct costs are variable)</li>
                    <li><strong>Fixed costs:</strong> unchanged regardless of volume ('period costs' / 'installed-capacity costs') — <strong>60–80% of hotel operating costs</strong></li>
                    <li><strong>Relatively fixed (mixed):</strong> seasonal wages, energy, advertising; <strong>absolutely fixed:</strong> permanent salaries, amortization, interest, insurance</li>
                </ul>
                <h4>Three cost zones</h4>
                <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Degression</strong></td><td>Costs grow slower than utilization → falling average cost</td></tr>
                    <tr style="border-bottom:1px solid var(--border-color);"><td><strong>Proportionality</strong></td><td>Lowest average costs — the optimal zone</td></tr>
                    <tr><td><strong>Progressivity</strong></td><td>Rising average costs at high utilization</td></tr>
                </table>

                <h3>5) Reactivity Coefficient</h3>
                <div class="formula-box">
                    <p><strong>h = T% / Q%</strong> &nbsp;(cost-increase intensity ÷ utilization-increase intensity)</p>
                    <p>h = 0 → only fixed · h = 1 → proportional · h &gt; 1 → progressive · h &lt; 1 → degressive</p>
                </div>

                <h3>6) Cost Planning, Analysis & Break-even</h3>
                <ul>
                    <li><strong>Cost plan:</strong> material + personnel + other direct costs (built on sales planning)</li>
                    <li><strong>Material-cost model:</strong> 35% food · 22% beverages · 50% other services</li>
                    <li><strong>Analysis</strong> by cost type, function, center and bearer; then ways to reduce costs</li>
                    <li><strong>Break-even point:</strong> revenue = costs (no profit/loss); below → loss, above → profit</li>
                    <li><strong>Functional value analysis:</strong> eliminate unnecessary costs while keeping quality</li>
                </ul>

                <div class="tip-box">
                    <h4><i class="fas fa-lightbulb"></i> Unit 5 Exam Focus</h4>
                    <p>Nail <strong>cost vs expenditure</strong> (with the land/gift examples), <strong>fixed vs variable</strong> (60–80% in hotels), the <strong>three cost zones</strong>, the <strong>reactivity coefficient h = T%/Q%</strong>, and the <strong>break-even point</strong>.</p>
                </div>
            `
        }
    }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.economicsHospitalityData = economicsHospitalityData; }
