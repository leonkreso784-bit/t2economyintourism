// ===== MANAGEMENT — 2nd MIDTERM (K2) =====
// Source: lecture decks TU8–TU11 (Prof. Vanja Vitezić PhD, FMTU Opatija, 1st year HM).
// Textbook: Lussier, Management Fundamentals, 9th ed.
// K2 covers the textbook's Part IV LEADING + Part V CONTROLLING — the last two management functions:
//   1. Organizational Behavior (TU8)   2. Motivating for High Performance (TU9)
//   3. Leading With Influence (TU10)    4. Managing Control Systems, Finances & People (TU11)

const managementM2 = {

    // ========== CATEGORY 1: ORGANIZATIONAL BEHAVIOR ==========
    organizationalBehavior: {
        id: "w3td8l",
        name: "Organizational Behavior",
        icon: "fa-brain",
        color: "#a855f7",

        flashcards: [
            {
                id: "991ifk",
                question: "What is ORGANIZATIONAL BEHAVIOR (OB) and its GOAL?",
                answer: "BEHAVIOR = simply the things people do and say (our actions).\nOB = the study of ACTIONS that affect performance in the workplace.\n\nThe goal of OB theorists is to UNDERSTAND, EXPLAIN, PREDICT and INFLUENCE behavior to improve performance.",
                explanation: "OB is about 'reading people'; interpersonal skills are key to success."
            },
            {
                id: "fdsw9q",
                question: "What are the FOUNDATIONS of individual behavior?",
                answer: "Our thoughts, self-confidence, self-esteem, personality, perception, and attitudes.\n\nThese foundations are NOT observable — you can only observe actions and try to explain/predict behavior from your understanding of the foundations.",
                explanation: "It's about reading people; OB skills help build and maintain good relationships."
            },
            {
                id: "vt6364",
                question: "SELF-ESTEEM vs SELF-CONFIDENCE vs SELF-DOUBT?",
                answer: "• SELF-ESTEEM — your overall view of yourself (like/dislike yourself). Not innate; shaped by experience and thoughts.\n• SELF-CONFIDENCE — believing you can do a SPECIFIC task (also called self-efficacy/self-concept); an 'I can do this' attitude.\n• SELF-DOUBT — negative thoughts that hold us back; leads to fear of rejection/failure/risk.",
                explanation: "Improve them through positive SELF-TALK and visualizing success."
            },
            {
                id: "z7ijhg",
                question: "How do THOUGHTS, optimism and gratitude affect behavior?",
                answer: "Thoughts cause our feelings, behavior and performance ('what you think is what you get').\n• OPTIMISM — believing things will go well; less stress, happier, higher performance than pessimists.\n• GRATITUDE — grateful people are happier, healthier, less stressed.\n• SELF-TALK — comments/reminders/advice you give yourself ('no stinking thinking').",
                explanation: "As Henry Ford said: whether you think you'll succeed or fail, you're right."
            },
            {
                id: "18fxg7",
                question: "What is PERSONALITY, and the LOCUS OF CONTROL trait?",
                answer: "PERSONALITY = a combination of behavioral, mental and emotional traits that define an individual; a primary influence on how we behave.\n\nLOCUS OF CONTROL lies on a continuum:\n• EXTERNALIZERS — believe they have no control over their fate.\n• INTERNALIZERS — believe they control their fate; their behavior directly affects performance → higher self-esteem, self-confidence, and performance.",
                explanation: "Internalizers have been shown to have higher levels of performance."
            },
            {
                id: "jklgxx",
                question: "RISK PROPENSITY, entrepreneurial types and MACHIAVELLIANISM?",
                answer: "• RISK PROPENSITY — continuum from risk taking to risk avoiding; entrepreneurs are risk takers.\n• ENTREPRENEURIAL TYPES — hustlers, innovators, machines, prodigies, visionaries.\n• MACHIAVELLIANISM — a trait based on the belief that the ends justify the means and power should be used to reach desired ends. Also called NARCISSIST — manipulate others for selfish gain; lack empathy.",
                explanation: "Risk-avoiding managers often go out of business by not keeping up with change."
            },
            {
                id: "mhggn7",
                question: "What are the BIG FIVE personality dimensions (OCEAN)?",
                answer: "The Five-Factor Model — abbreviated OCEAN:\n• OPENNESS — willing to try new things (good for creative jobs).\n• CONSCIENTIOUSNESS — responsible, dependable, hardworking (overall best predictor of job success).\n• EXTRAVERSION — social, talkative, assertive (good for sales/leadership); middle = 'ambivert'.\n• AGREEABLENESS — cooperative, easy to work with (good for teamwork).\n• NEUROTICISM / EMOTIONALISM — continuum of emotional stability vs instability.",
                explanation: "Emotional intelligence (EI) describes people with good interpersonal skills."
            }
        ],

        quiz: [
            {
                id: "3rsdeb",
                question: "The goal of OB is to understand, explain, predict and ____ behavior.",
                options: ["Ignore", "Influence", "Punish", "Record"],
                correct: 1
            },
            {
                id: "x1hrmu",
                question: "Believing you can do a specific task is:",
                options: ["Self-esteem", "Self-confidence (self-efficacy)", "Self-doubt", "Self-talk"],
                correct: 1
            },
            {
                id: "tmgb5o",
                question: "Someone who believes they control their own fate is an:",
                options: ["Externalizer", "Internalizer", "Optimist", "Extrovert"],
                correct: 1
            },
            {
                id: "i3v6yy",
                question: "The belief that 'the ends justify the means' describes:",
                options: ["Optimism", "Conscientiousness", "Machiavellianism", "Agreeableness"],
                correct: 2
            },
            {
                id: "cdulcx",
                question: "The Big Five are abbreviated as:",
                options: ["SMART", "OCEAN", "SWOT", "ERG"],
                correct: 1
            },
            {
                id: "ytq485",
                question: "Which Big Five dimension is the overall best predictor of job success?",
                options: ["Openness", "Conscientiousness", "Neuroticism", "Agreeableness"],
                correct: 1
            },
            {
                id: "uxf6n9",
                question: "A person in the middle of the extrovert–introvert continuum is an:",
                options: ["Ambivert", "Externalizer", "Optimist", "Internalizer"],
                correct: 0
            }
        ],

        fillBlanks: [
            {
                id: "6gxbxu",
                sentence: "OB is the study of actions that affect _______ in the workplace.",
                answer: "performance",
                hint: "Results at work..."
            },
            {
                id: "6o8wlh",
                sentence: "Believing you can do a specific task is self-_______ (or self-efficacy).",
                answer: "confidence",
                hint: "'I can do this'..."
            },
            {
                id: "5iuq2n",
                sentence: "People who believe they control their fate are _______.",
                answer: "internalizers",
                hint: "Opposite of externalizers..."
            },
            {
                id: "tvys42",
                sentence: "The Big Five model is abbreviated _______.",
                answer: "OCEAN",
                hint: "Openness, conscientiousness, extraversion, agreeableness, neuroticism"
            },
            {
                id: "1ggbv0",
                sentence: "_______ is responsible, dependable and the best overall predictor of job success.",
                answer: "Conscientiousness",
                hint: "The 'C' in OCEAN..."
            }
        ],

        learn: {
            id: "8eghtt",
            title: "Organizational Behavior",
            content: `
                <h3>What is OB?</h3>
                <p>The study of <strong>actions that affect performance</strong> at work. Goal:
                <strong>understand → explain → predict → influence</strong> behavior.</p>

                <h4>Foundations of behavior</h4>
                <ul>
                    <li>Self-esteem (overall view) · self-confidence/self-efficacy (a task) · self-doubt</li>
                    <li>Thoughts · optimism · gratitude · positive self-talk + visualization</li>
                </ul>

                <h4>Personality</h4>
                <div class="tip-box">
                    <ul>
                        <li><strong>Locus of control:</strong> internalizers (control fate, higher performance) vs externalizers</li>
                        <li><strong>Risk propensity</strong> · entrepreneurial types · Machiavellianism (narcissism)</li>
                        <li><strong>Big Five (OCEAN):</strong> Openness · Conscientiousness · Extraversion · Agreeableness · Neuroticism</li>
                    </ul>
                </div>
            `
        }
    },

    // ========== CATEGORY 2: MOTIVATING FOR HIGH PERFORMANCE ==========
    motivation: {
        id: "pvxse9",
        name: "Motivating for High Performance",
        icon: "fa-bolt",
        color: "#f97316",

        flashcards: [
            {
                id: "plpq32",
                question: "What is MOTIVATION, and the PERFORMANCE FORMULA?",
                answer: "MOTIVATION = the willingness to achieve organizational objectives or to go above and beyond (organizational citizenship behavior, OCB; 'employee engagement').\n\nPERFORMANCE FORMULA: performance = ability × motivation × resources.\n\nFor maximum performance, ALL THREE factors must be high (it's multiplicative — a zero in any factor kills performance).",
                explanation: "Effort has three parts: initiation, direction, and persistence."
            },
            {
                id: "et5xra",
                question: "What is the MOTIVATION PROCESS?",
                answer: "Employees go from NEED → MOTIVE → BEHAVIOR → CONSEQUENCE → SATISFACTION or DISSATISFACTION.\n\nExample: thirsty (need) → desire a drink (motive) → get a drink (behavior) → quench thirst (consequence/satisfaction). Satisfaction is short-lived, so it's a FEEDBACK LOOP.",
                explanation: "You can't observe motives, only behavior — infer motive via the attribution process."
            },
            {
                id: "fumrt2",
                question: "Compare the three CLASSES of motivation theories.",
                answer: "1. CONTENT theories — identify and understand employees' NEEDS (what motivates).\n2. PROCESS theories — explain HOW and WHY employees choose behaviors to satisfy needs.\n3. REINFORCEMENT theory — uses CONSEQUENCES of behavior; no need to identify needs.",
                explanation: "There is no single universally accepted theory of how to motivate people."
            },
            {
                id: "ikhirm",
                question: "What are the four CONTENT motivation theories?",
                answer: "1. MASLOW's HIERARCHY OF NEEDS — 5 levels: physiological → safety → social → esteem → self-actualization.\n2. ALDERFER's ERG — simplifies to 3: Existence, Relatedness, Growth (more than one can be active).\n3. HERZBERG's TWO-FACTOR — MAINTENANCE factors (extrinsic; prevent dissatisfaction) vs MOTIVATORS (intrinsic; create satisfaction).\n4. McCLELLAND's ACQUIRED NEEDS — achievement, power, affiliation (learned; one is dominant).",
                explanation: "Managers tend to have high need for Power, then Achievement, and low Affiliation."
            },
            {
                id: "4adtxn",
                question: "Explain HERZBERG'S two-factor theory.",
                answer: "Employees are motivated by MOTIVATORS, not maintenance factors.\n• MAINTENANCE (hygiene) factors — extrinsic (pay, conditions, security). Continuum: 'not dissatisfied ↔ dissatisfied'. Fixing them removes dissatisfaction but doesn't motivate.\n• MOTIVATORS — intrinsic, from the work itself (achievement, recognition, growth). Continuum: 'satisfied ↔ not satisfied'.",
                explanation: "Example: a pay raise stops dissatisfaction, but soon the cycle repeats — pay is a maintenance factor."
            },
            {
                id: "nsufbt",
                question: "What are the three PROCESS motivation theories?",
                answer: "1. EQUITY theory (J. S. Adams) — motivated when perceived INPUTS = OUTPUTS compared to relevant others; perceived unfairness changes behavior.\n2. GOAL-SETTING theory — achievable but DIFFICULT, specific goals motivate ('stretch goals').\n3. EXPECTANCY theory (Vroom) — motivation = expectancy × instrumentality × valence.",
                explanation: "Expectancy = can I do it?; instrumentality = will performance lead to the reward?; valence = do I value the reward?"
            },
            {
                id: "rgo9t9",
                question: "What is REINFORCEMENT theory and its 4 types?",
                answer: "Consequences of behavior motivate employees to behave in predetermined ways. Four types:\n1. POSITIVE — offer an attractive consequence (reward) → encourages behavior.\n2. AVOIDANCE (negative reinforcement) — behavior prevents a negative consequence.\n3. PUNISHMENT — apply a negative consequence to DECREASE undesirable behavior.\n4. EXTINCTION — WITHHOLD reinforcement to reduce/eliminate a behavior.",
                explanation: "Positive (reward) & avoidance encourage desired behavior; positive reinforcement generally works better than punishment."
            }
        ],

        quiz: [
            {
                id: "4ls3m3",
                question: "The performance formula is performance = ability × motivation × ____.",
                options: ["Reward", "Resources", "Risk", "Rules"],
                correct: 1
            },
            {
                id: "6b6n3d",
                question: "The motivation process is need → motive → behavior → consequence → ____.",
                options: [
                    "Promotion",
                    "Satisfaction/dissatisfaction",
                    "Termination",
                    "Recruitment"
                ],
                correct: 1
            },
            {
                id: "kgu454",
                question: "Maslow's highest-level need is:",
                options: ["Safety", "Esteem", "Social", "Self-actualization"],
                correct: 3
            },
            {
                id: "pj53pn",
                question: "In Herzberg's theory, pay and working conditions are:",
                options: [
                    "Motivators",
                    "Maintenance (hygiene) factors",
                    "Acquired needs",
                    "Reinforcers"
                ],
                correct: 1
            },
            {
                id: "zrd5dn",
                question: "Vroom's expectancy theory: motivation = expectancy × instrumentality × ____.",
                options: ["Valence", "Variance", "Velocity", "Validity"],
                correct: 0
            },
            {
                id: "05n72w",
                question: "Equity theory says employees are motivated when perceived inputs equal:",
                options: ["Efforts", "Outputs", "Goals", "Needs"],
                correct: 1
            },
            {
                id: "h8em8h",
                question: "Withholding reinforcement to reduce a behavior is:",
                options: ["Punishment", "Avoidance", "Extinction", "Positive reinforcement"],
                correct: 2
            }
        ],

        fillBlanks: [
            {
                id: "y29ai3",
                sentence: "Performance = ability × motivation × _______.",
                answer: "resources",
                hint: "The third factor..."
            },
            {
                id: "hdqrjg",
                sentence: "Maslow's five levels run from physiological up to self-_______.",
                answer: "actualization",
                hint: "Develop your full potential..."
            },
            {
                id: "kbznvq",
                sentence: "Herzberg said true motivation comes from _______, not maintenance factors.",
                answer: "motivators",
                hint: "Intrinsic, from the work itself..."
            },
            {
                id: "3hxsx9",
                sentence: "McClelland's three acquired needs are achievement, power and _______.",
                answer: "affiliation",
                hint: "Wanting close relationships..."
            },
            {
                id: "ogg17r",
                sentence: "Applying a negative consequence to decrease behavior is _______.",
                answer: "punishment",
                hint: "Not extinction..."
            }
        ],

        learn: {
            id: "u01f64",
            title: "Motivating for High Performance",
            content: `
                <h3>The basics</h3>
                <div class="formula-box">
                    performance = ability × motivation × resources &nbsp;(all three must be high)<br>
                    process: NEED → MOTIVE → BEHAVIOR → CONSEQUENCE → (dis)SATISFACTION
                </div>

                <h4>Three classes of theory</h4>
                <ul>
                    <li><strong>Content</strong> (needs): Maslow hierarchy · Alderfer ERG · Herzberg two-factor · McClelland acquired needs</li>
                    <li><strong>Process</strong> (how/why): equity · goal-setting (stretch goals) · expectancy (E × I × V)</li>
                    <li><strong>Reinforcement</strong> (consequences): positive · avoidance · punishment · extinction</li>
                </ul>

                <div class="tip-box">
                    <p><strong>Herzberg:</strong> maintenance factors only stop dissatisfaction; motivators (the work
                    itself) create real motivation. <strong>Expectancy:</strong> can I do it? × will it pay off? × do I value it?</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 3: LEADING WITH INFLUENCE ==========
    leadership: {
        id: "cthkyn",
        name: "Leading With Influence",
        icon: "fa-compass-drafting",
        color: "#0ea5e9",

        flashcards: [
            {
                id: "c2w71p",
                question: "What is LEADERSHIP, and why does TRUST matter?",
                answer: "LEADERSHIP = the process of INFLUENCING employees to work toward achieving objectives.\n\nGood relationships are based on TRUST. A survey found 74% of ENGAGED employees trust their manager, while only 14% don't trust their boss. People won't go 'above and beyond' for a boss they don't trust — and managers must also be able to trust employees.",
                explanation: "Trustworthiness is based on (at least) four dimensions."
            },
            {
                id: "me611o",
                question: "How do LEADERS differ from MANAGERS?",
                answer: "Management gives POSITION power and is broader in scope; leadership is the ability to INFLUENCE others.\n\n• A manager can hold the position WITHOUT being a true leader (no trust/influence).\n• There are good leaders who are NOT managers (informal/peer leaders).\n\nSo leadership doesn't require a title — you can be an informal leader (e.g. Steve Jobs = great leader but not a great manager; Tim Cook = both).",
                explanation: "Leadership is critical to management success."
            },
            {
                id: "41agzu",
                question: "What are the FOUR classifications of leadership THEORIES?",
                answer: "All have the same goal (what makes an effective leader), but different focus:\n1. TRAIT theory — leaders' characteristics/traits.\n2. BEHAVIORAL theory — leaders' styles/behavior.\n3. SITUATIONAL (contingency) theory — matching style to the situation.\n4. CONTEMPORARY/integrative — visionary, charismatic, transformational, etc.",
                explanation: "Trait theory began with the assumption that leaders are born, not made."
            },
            {
                id: "0iqsmn",
                question: "What are the BEHAVIORAL leadership styles (Lewin's three)?",
                answer: "Kurt Lewin (University of Iowa) identified three basic styles:\n• AUTOCRATIC (≈ Theory X) — leader makes decisions, tells employees what to do.\n• DEMOCRATIC (≈ Theory Y) — leader includes employees in decisions.\n• LAISSEZ-FAIRE — a 'leave-employees-alone' hands-off approach.",
                explanation: "Two-dimensional styles combine STRUCTURING (task) and CONSIDERATION (relationships)."
            },
            {
                id: "tc01qi",
                question: "What is the LEADERSHIP GRID and its 5 styles?",
                answer: "Measures concern for PRODUCTION and concern for PEOPLE on a 1–9 scale. Five styles:\n• (1,1) IMPOVERISHED — low concern for both.\n• (9,1) AUTHORITY-COMPLIANCE — high production, low people.\n• (1,9) COUNTRY CLUB — high people, low production.\n• (5,5) MIDDLE-OF-THE-ROAD — balanced medium concern.\n• (9,9) TEAM — high concern for both (the ideal).",
                explanation: "The ideal style incorporates high concern for both production and people."
            },
            {
                id: "j187qz",
                question: "What is SITUATIONAL (contingency) leadership?",
                answer: "Attempts to determine the appropriate leadership style for a PARTICULAR situation — how leaders behave is CONTINGENT on the situation. No single style fits all situations.\n\nThe LEADERSHIP CONTINUUM MODEL (Tannenbaum & Schmidt) chooses among 7 styles from AUTOCRATIC (boss-centered) to PARTICIPATIVE (employee-centered), considering: the leader's preferred style, the followers' preferred style, and the situation.",
                explanation: "Also called contingency theory because behavior is contingent on the situation."
            },
            {
                id: "5x0uhn",
                question: "Name the CONTEMPORARY leadership styles.",
                answer: "• VISIONARY — creates an image of the organization's FUTURE (e.g. Musk → Mars).\n• CHARISMATIC — inspires loyalty, enthusiasm via confident personal traits.\n• TRANSFORMATIONAL — brings continuous learning, innovation and CHANGE; gets followers to transcend self-interest (e.g. Bezos).\n• TRANSACTIONAL — based on social EXCHANGE ('do this work and I'll reward you'); promotes stability.\n• AUTHENTIC — open, honest, trusting relationships; leads by example.",
                explanation: "Transformational leaders are especially needed in growth firms in dynamic environments."
            }
        ],

        quiz: [
            {
                id: "2cb9iz",
                question: "Leadership is the process of ____ employees toward objectives.",
                options: ["Paying", "Influencing", "Hiring", "Evaluating"],
                correct: 1
            },
            {
                id: "bg2jgg",
                question: "Which is TRUE about leaders and managers?",
                options: [
                    "All managers are leaders",
                    "A manager can hold the position without being a true leader",
                    "Leaders must have a title",
                    "Leadership equals position power"
                ],
                correct: 1
            },
            {
                id: "5m5puy",
                question: "Lewin's hands-off 'leave-employees-alone' style is:",
                options: ["Autocratic", "Democratic", "Laissez-faire", "Charismatic"],
                correct: 2
            },
            {
                id: "jryiw2",
                question: "On the Leadership Grid, (9,9) is the ____ style.",
                options: ["Impoverished", "Country club", "Team", "Middle-of-the-road"],
                correct: 2
            },
            {
                id: "lwfntn",
                question: "Situational leadership theory is also called:",
                options: [
                    "Trait theory",
                    "Contingency theory",
                    "Behavioral theory",
                    "Charismatic theory"
                ],
                correct: 1
            },
            {
                id: "pt3j9w",
                question: "A leader based on social exchange ('do this and I'll reward you') is:",
                options: [
                    "Transformational",
                    "Transactional",
                    "Visionary",
                    "Authentic"
                ],
                correct: 1
            },
            {
                id: "1n6tod",
                question: "A leader who brings continuous learning, innovation and change is:",
                options: [
                    "Transactional",
                    "Transformational",
                    "Autocratic",
                    "Impoverished"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "85nq3p",
                sentence: "Leadership is the process of _______ employees to achieve objectives.",
                answer: "influencing",
                hint: "Getting them to act..."
            },
            {
                id: "eiq88k",
                sentence: "Good leadership relationships are based on _______.",
                answer: "trust",
                hint: "74% of engaged employees have it in their manager..."
            },
            {
                id: "5j3h57",
                sentence: "Lewin's three styles are autocratic, democratic and _______.",
                answer: "laissez-faire",
                hint: "Hands-off..."
            },
            {
                id: "8noram",
                sentence: "On the Leadership Grid the ideal (9,9) is the _______ style.",
                answer: "team",
                hint: "High concern for both people and production..."
            },
            {
                id: "owmeob",
                sentence: "A _______ leader creates an image of the organization's future.",
                answer: "visionary",
                hint: "Musk and Mars..."
            }
        ],

        learn: {
            id: "elin68",
            title: "Leading With Influence",
            content: `
                <h3>Leadership = influence</h3>
                <p>The process of <strong>influencing</strong> employees toward objectives. Built on
                <strong>trust</strong>. A manager can hold the position without being a true leader; leaders
                can exist without a title.</p>

                <h4>Four theory classifications</h4>
                <ol>
                    <li><strong>Trait</strong> — born vs made</li>
                    <li><strong>Behavioral</strong> — Lewin (autocratic/democratic/laissez-faire); two-dimensional (structuring × consideration); Leadership Grid (1,1 / 9,1 / 1,9 / 5,5 / <strong>9,9 team</strong>)</li>
                    <li><strong>Situational/contingency</strong> — Tannenbaum & Schmidt continuum (7 styles, boss → employee centered)</li>
                    <li><strong>Contemporary</strong> — visionary · charismatic · transformational · transactional · authentic</li>
                </ol>

                <div class="tip-box">
                    <p><strong>Transformational</strong> (change, transcend self-interest) vs <strong>transactional</strong>
                    (exchange, stability). <strong>Visionary</strong> shapes the future; <strong>authentic</strong> leads by example.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 4: MANAGING CONTROL SYSTEMS, FINANCES & PEOPLE ==========
    controlSystems: {
        id: "wabw8s",
        name: "Control Systems, Finances & People",
        icon: "fa-gauge-high",
        color: "#14b8a6",

        flashcards: [
            {
                id: "rco386",
                question: "What is CONTROLLING, and the types of ORGANIZATIONAL SYSTEMS control?",
                answer: "CONTROLLING = monitoring progress and taking corrective action to ensure objectives are achieved ('you can't manage what you don't measure').\n\nControls in the systems process:\n• PRELIMINARY (feedforward) — anticipate & PREVENT problems (inputs).\n• CONCURRENT — ensure standards are met DURING transformation.\n• REWORK — fix a faulty OUTPUT.\n• DAMAGE control — minimize negative impact on customers (e.g. warranties).\n• FEEDBACK — use customer input for continuous improvement.",
                explanation: "Preliminary control = planning & organizing; it's better to prevent than to fix."
            },
            {
                id: "2wsv8h",
                question: "What are the 4 STEPS of the CONTROL SYSTEMS PROCESS?",
                answer: "1. SET objectives and standards.\n2. MEASURE performance.\n3. COMPARE performance to standards (a performance/variance report).\n4. CORRECT or REINFORCE (fix it if off; reinforce if on track).\n\nFollowed at both organizational and functional-area levels.",
                explanation: "When variances are significant, they must be explained."
            },
            {
                id: "uu469r",
                question: "What 5 AREAS must complete STANDARDS cover?",
                answer: "Standards measure performance in:\n1. QUANTITY (how many?)\n2. QUALITY (how well?)\n3. TIME (when / how fast?)\n4. COST (how much should it cost?)\n5. BEHAVIOR (what to do / not do; ethics)\n\nIncomplete standards make employees 'game' the system (e.g. quantity-only → ignore quality).",
                explanation: "Critical success factors (CSFs) = the few most important areas to control."
            },
            {
                id: "mr10lp",
                question: "What are the 3 frequencies and 10 METHODS of control?",
                answer: "• CONSTANT (continuous): self-control, clan control, standing plans.\n• PERIODIC (regular/fixed): regular meetings & reports, budgets, audits.\n• OCCASIONAL (sporadic): observation, the exception principle, special reports, project controls.",
                explanation: "Clan control relies on culture/norms and peer pressure; the exception principle leaves control to employees unless a problem occurs."
            },
            {
                id: "08v6d3",
                question: "What is the MASTER BUDGETING process (3 steps)?",
                answer: "A BUDGET = a planned quantitative allocation of resources (not just money). Steps:\n1. OPERATING budgets — REVENUE budget (forecast income) + EXPENSE budget (forecast spending).\n2. CAPITAL EXPENDITURES budget — all planned major ASSET investments (land, buildings, equipment).\n3. FINANCIAL budgets — budgeted (pro forma) income statement, balance sheet, cash flow.",
                explanation: "Budgeting needs PLANNING skills, not math/accounting skills; a feedback loop allows revisions."
            },
            {
                id: "rj8vcn",
                question: "What are the THREE primary FINANCIAL STATEMENTS?",
                answer: "1. INCOME STATEMENT — presents revenue, expenses and the PROFIT or LOSS for a period.\n2. BALANCE SHEET — presents ASSETS = LIABILITIES + owners'/stockholders' EQUITY (it must balance at a point in time).\n3. CASH FLOW STATEMENT — cash receipts and payments (operating + financial activities).\n\nPROFIT MARGIN = net profit ÷ revenue. Pro forma = projected; actual statements report the past.",
                explanation: "You can have high revenues yet low/no profit — watch the profit margin."
            },
            {
                id: "cb16a6",
                question: "BONDS vs STOCK for raising money?",
                answer: "Both raise capital but differ as DEBT vs EQUITY:\n• BONDS (debt) — the firm must REPAY bondholders + interest; no ownership given away; lower risk, lower return.\n• STOCK (equity) — the firm NEVER repays; stockholders become PART OWNERS; the firm only gets money at the initial public offering (IPO). Give away too much and you can lose control.",
                explanation: "Selling bonds/stock doesn't affect the income statement, but it does affect the balance sheet & cash flow."
            },
            {
                id: "f338mq",
                question: "What are COACHING, COUNSELING and DISCIPLINE?",
                answer: "• COACHING — giving MOTIVATIONAL feedback to maintain/improve performance.\n• MANAGEMENT COUNSELING — giving feedback so employees realize a problem affects their job, then referring them to the employee assistance program (NOT psychotherapy).\n• DISCIPLINE — corrective action to get employees to meet standards/standing plans; objective is to CHANGE behavior (deviance = negative voluntary behavior).",
                explanation: "Coaching/counseling come first; discipline follows if an employee won't change or breaks a rule."
            }
        ],

        quiz: [
            {
                id: "loen6f",
                question: "Control designed to anticipate and PREVENT problems (inputs) is:",
                options: [
                    "Concurrent control",
                    "Preliminary (feedforward) control",
                    "Rework control",
                    "Damage control"
                ],
                correct: 1
            },
            {
                id: "ona25h",
                question: "Which is the correct order of the control systems process?",
                options: [
                    "Measure → correct → set standards → compare",
                    "Set standards → measure → compare → correct/reinforce",
                    "Compare → set standards → correct → measure",
                    "Correct → measure → compare → set standards"
                ],
                correct: 1
            },
            {
                id: "g2xv4e",
                question: "Which is NOT one of the five areas of complete standards?",
                options: ["Quantity", "Quality", "Location", "Cost"],
                correct: 2
            },
            {
                id: "qgqfy6",
                question: "Budgets and audits are examples of ____ controls.",
                options: ["Constant", "Periodic", "Occasional", "Preliminary"],
                correct: 1
            },
            {
                id: "t3l4ky",
                question: "The statement showing assets = liabilities + owners' equity is the:",
                options: [
                    "Income statement",
                    "Balance sheet",
                    "Cash flow statement",
                    "Budget"
                ],
                correct: 1
            },
            {
                id: "10jc8x",
                question: "If a company sells STOCK, it:",
                options: [
                    "Must repay the buyers with interest",
                    "Gives away ownership and never repays",
                    "Increases its liabilities only",
                    "Affects the income statement"
                ],
                correct: 1
            },
            {
                id: "hxu14b",
                question: "Giving motivational feedback to improve performance is:",
                options: ["Discipline", "Coaching", "Auditing", "Reworking"],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                id: "1vwxis",
                sentence: "Controlling is monitoring progress and taking _______ action.",
                answer: "corrective",
                hint: "To get back on track..."
            },
            {
                id: "67urpq",
                sentence: "Preliminary control is also called _______ control.",
                answer: "feedforward",
                hint: "Anticipate and prevent..."
            },
            {
                id: "dmi4pt",
                sentence: "Complete standards cover quantity, quality, time, cost and _______.",
                answer: "behavior",
                hint: "What to do and not do; ethics..."
            },
            {
                id: "779fb9",
                sentence: "The balance sheet shows assets = liabilities + owners' _______.",
                answer: "equity",
                hint: "The owners' share of assets..."
            },
            {
                id: "2jgvx7",
                sentence: "Selling _______ is debt that must be repaid with interest; stock is equity.",
                answer: "bonds",
                hint: "Lower risk, lower return..."
            }
        ],

        learn: {
            id: "kmevdc",
            title: "Managing Control Systems, Finances & People",
            content: `
                <h3>Controlling = monitor + correct</h3>
                <div class="formula-box">
                    SYSTEMS CONTROLS: preliminary (inputs) → concurrent (process) → rework (outputs) → damage → feedback<br>
                    PROCESS: set standards → measure → compare → correct/reinforce
                </div>

                <h4>Standards & frequency</h4>
                <ul>
                    <li><strong>5 standard areas:</strong> quantity · quality · time · cost · behavior (+ critical success factors)</li>
                    <li><strong>Constant:</strong> self · clan · standing plans · <strong>Periodic:</strong> meetings · budgets · audits · <strong>Occasional:</strong> observation · exception principle · special reports · project</li>
                </ul>

                <h4>Finances & people</h4>
                <div class="tip-box">
                    <ul>
                        <li><strong>Master budget:</strong> operating (revenue + expense) → capital expenditures → financial (pro forma)</li>
                        <li><strong>Statements:</strong> income statement · balance sheet (A = L + E) · cash flow; profit margin = net profit ÷ revenue</li>
                        <li><strong>Raising money:</strong> bonds (debt, repay + interest) vs stock (equity, ownership, IPO)</li>
                        <li><strong>People:</strong> coaching → counseling → discipline (change behavior); handling complaints</li>
                    </ul>
                </div>
            `
        }
    }

};

// Expose for the catalog loader (and Node for the structural validator).
if (typeof window !== "undefined") { window.managementM2 = managementM2; }
if (typeof module !== "undefined" && module.exports) { module.exports = managementM2; }
