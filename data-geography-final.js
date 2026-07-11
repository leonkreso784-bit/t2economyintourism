// ===== GEOGRAPHY (TOURISM GEOGRAPHY) - FINAL EXAM (hybrid) =====
// Pattern identical to Marketing/Economics/BI finals: the final lesson MERGES both
// midterms and adds one curated cross-topic "Exam Practice" category.
//   geographyFinalData = Object.assign({}, geographyData (1st), geographyM2Data (2nd), { examPractice })
// This file MUST load LAST (after data-geography.js + data-geography-m2.js) because it
// reads window.geographyData and window.geographyM2Data at module-load time.
//
// Course note (syllabus, slide 0): the final exam is worth 30 points, has the SAME
// structure as the midterm tests (10 questions: 5 closed + 5 open) and covers ALL
// material — Introduction to Geography + Tourism Geography of Croatia + the World.

const geographyExamPractice = {
    id: "bxtlw9",
    name: "Exam Practice (Croatia + World)",
    icon: "fa-graduation-cap",
    color: "#eab308",

    flashcards: [
        {
            id: "ziweih",
            question: "What is the structure and weight of the geography final exam?",
            answer: "The same structure as the midterm tests — 10 questions: 5 closed-type (e.g. multiple choice) + 5 open-type (short written answers). It is worth 30 points and covers all material (Croatia + the World).",
            explanation: "Across the semester, 35 points is the condition for taking the final exam."
        },
        {
            id: "zx1gzy",
            question: "Which two big 'halves' does the final cover?",
            answer: "(1) Introduction to Geography + Tourism Geography of Croatia (1st midterm); (2) Tourism Geography of the World — Europe, Asia, Africa, Australia & Oceania, and the Americas (2nd midterm).",
            explanation: "Plus the separate blind-map task (Croatia)."
        },
        {
            id: "xcjzq5",
            question: "Define a 'tourist destination' (the course's core concept).",
            answer: "A geographical area whose total tourist product (brand) — the result of natural and/or social tourist factors and attractions — is recognizable on the tourist market.",
            explanation: "This definition applies equally to Opatija and to Rio de Janeiro."
        },
        {
            id: "bvkbek",
            question: "By which three criteria is a geographical region singled out?",
            answer: "Natural characteristics (physical geography), human-made characteristics (human geography), and the interaction of the human and natural environment.",
            explanation: "Regionalization underpins both midterms."
        },
        {
            id: "y9huv7",
            question: "How many protected areas of each type does Croatia have, plus its UNESCO count?",
            answer: "8 national parks + 12 nature parks (Nature Protection Act = 9 categories; ~10.1% of the territory); 10 tangible UNESCO World Heritage sites (+ ~17 intangible).",
            explanation: "Compare: USA 61 NPs / 23 UNESCO; Africa ~45 UNESCO sites; Mexico ~13% protected."
        },
        {
            id: "gzbm5c",
            question: "Compare Croatia's tourism economic weight with the world's biggest market.",
            answer: "Tourism is 20–25% of Croatia's GDP (very high dependence); the USA is the largest single market — ~70 million international arrivals and ~$200 billion in receipts per year.",
            explanation: "Small, tourism-dependent economy vs. a huge diversified one."
        },
        {
            id: "e55k51",
            question: "Rank the continents by area (largest and smallest) and place Europe.",
            answer: "Asia is the largest (44.5 million km²), Australia the smallest (7.7 million km²); Africa is 2nd (30 million km²); Europe (~10.4 million km²) is small but a leading tourism region (most indented continent, rich heritage).",
            explanation: "Size does not equal tourism volume."
        },
        {
            id: "hv20kg",
            question: "Name one signature landmark for each continent.",
            answer: "Europe — Acropolis / Alhambra; Asia — Taj Mahal / Great Wall / Angkor Wat; Africa — Pyramids of Giza / Victoria Falls; Australia & Oceania — Great Dividing Range / Bora Bora; Americas — Yellowstone / Christ the Redeemer / Chichén Itzá.",
            explanation: "Be able to match a landmark to its continent and country."
        },
        {
            id: "zdtwst",
            question: "Which historical trade route and which canal are key tourism themes (Asia and Africa)?",
            answer: "The Silk Road (Mediterranean ↔ East Asia, 2nd c. BC – 18th c. AD) in Asia; the Suez Canal (built 1859–1869, 163 km) in Africa.",
            explanation: "History-to-present links are a recurring exam angle."
        },
        {
            id: "bdmxg9",
            question: "What is the composition of Croatia's blind map (separate 10-point task)?",
            answer: "2 county centres + 2 bigger islands + 1 national park + 1 nature park + 4 top tourist destinations.",
            explanation: "A toponym named but not located on the map is not counted as correct."
        },
        {
            id: "mpb4zs",
            question: "Pair each continent with one defining physical/human fact.",
            answer: "Europe — Gulf Stream warming + ~740 million people; Asia — ~60% of humanity (India + China); Africa — 'gift of the Nile' + young population; Australia — Gondwana origin, sparsely populated; Americas — USA GDP/cap ~$80,000.",
            explanation: "One strong fact per continent is enough to anchor open questions."
        },
        {
            id: "dfig3x",
            question: "Which two 'firsts' should you remember in the Americas?",
            answer: "Yellowstone (1872) is the world's oldest national park (USA); Brasília is a planned city (1960), UNESCO-listed in 1987 as a landmark of modern urbanism (Brazil).",
            explanation: "Classic closed-question facts."
        },
        {
            id: "1nxte5",
            question: "Give the headline numbers for Croatia's labour force in tourism (2025).",
            answer: "170,723 residence & work permits — construction 31% and tourism & hospitality 31%; top source countries: Bosnia & Herzegovina, Nepal, Serbia, Philippines, India.",
            explanation: "Links Croatia's human geography to its tourism labour market."
        },
        {
            id: "jn41v8",
            question: "What is Croatia's coastal-region structure (key for the Croatia half)?",
            answer: "North Croatian Coast (Istria, Kvarner) + Southern Croatian Coast / Dalmatia (Northern, Central, South Dalmatia); plus the Mountainous and Pannonian tourist macro-regions.",
            explanation: "Mirror of how the World half is split by continents."
        }
    ],

    quiz: [
        {
            id: "wro120",
            question: "The geography final exam has the same structure as the midterms:",
            options: ["3 closed + 7 open", "5 closed + 5 open", "10 closed", "all open"],
            correct: 1
        },
        {
            id: "kl0z9b",
            question: "Which is the largest continent by area?",
            options: ["Africa", "Asia", "Europe", "North America"],
            correct: 1
        },
        {
            id: "qqotqo",
            question: "Croatia has how many national parks?",
            options: ["6", "8", "10", "12"],
            correct: 1
        },
        {
            id: "d5uavc",
            question: "The Silk Road historically connected the Mediterranean with:",
            options: ["East Asia", "Southern Africa", "North America", "Australia"],
            correct: 0
        },
        {
            id: "qofns3",
            question: "The world's oldest national park (1872) is:",
            options: ["Plitvice", "Yellowstone", "Kruger", "Banff"],
            correct: 1
        },
        {
            id: "1mumxq",
            question: "Tourism's share of Croatia's GDP is about:",
            options: ["5%", "12%", "20–25%", "40%"],
            correct: 2
        },
        {
            id: "05m8ci",
            question: "The Pyramids of Giza are in:",
            options: ["Morocco", "Egypt", "Tunisia", "Sudan"],
            correct: 1
        },
        {
            id: "9m2st6",
            question: "Christ the Redeemer overlooks which city?",
            options: ["Buenos Aires", "Rio de Janeiro", "Mexico City", "Lisbon"],
            correct: 1
        },
        {
            id: "ow1nbg",
            question: "Which is a UNESCO World Heritage site located in Croatia?",
            options: ["Diocletian's Palace", "Acropolis", "Petra", "Borobudur"],
            correct: 0
        },
        {
            id: "f2p2q2",
            question: "Australia once formed part of which ancient protocontinent?",
            options: ["Pangaea", "Laurasia", "Gondwana", "Rodinia"],
            correct: 2
        }
    ],

    fillBlanks: [
        {
            id: "fnq3ku",
            sentence: "The final exam has 5 closed and 5 _______ questions.",
            answer: "open",
            hint: "Short written answers..."
        },
        {
            id: "er90vm",
            sentence: "Croatia has 8 national parks and _______ nature parks.",
            answer: "12",
            hint: "Two-digit number..."
        },
        {
            id: "7mmuxl",
            sentence: "Asia is the _______ continent and home to about 60% of humanity.",
            answer: "largest",
            hint: "44.5 million km²..."
        },
        {
            id: "u9s6mk",
            sentence: "The Suez _______ (163 km) links the Mediterranean and the Red Sea.",
            answer: "Canal",
            hint: "Opened 1869..."
        },
        {
            id: "ylhpgl",
            sentence: "Yellowstone (1872) is the world's oldest national _______.",
            answer: "park",
            hint: "Protected natural area..."
        },
        {
            id: "w1mlpt",
            sentence: "A tourist _______ is a geographical area whose total tourist product is recognizable on the market.",
            answer: "destination",
            hint: "Core course definition..."
        },
        {
            id: "cxn613",
            sentence: "The Gulf Stream keeps _______'s Atlantic coasts ice-free in winter.",
            answer: "Europe",
            hint: "The continent of the 1st World lecture..."
        },
        {
            id: "8juc80",
            sentence: "Christ the Redeemer stands on Mount _______ above Rio de Janeiro.",
            answer: "Corcovado",
            hint: "704 m high..."
        }
    ],

    learn: {
        id: "10fybr",
        title: "Final Exam Roadmap (Croatia + World)",
        content: `
            <h3>What the Final Covers</h3>
            <div class="formula-box">
                <p><strong>30 points · same format as the midterms:</strong> 10 questions = 5 closed + 5 open. It spans <strong>everything</strong>: Introduction to Geography + Tourism Geography of Croatia (1st midterm) and Tourism Geography of the World (2nd midterm).</p>
            </div>
            <p>Use this category to drill <strong>across topics</strong>; the per-topic categories (Croatia + each continent) remain available in this same lesson for deep revision.</p>

            <h3>Croatia Half — Must-Knows</h3>
            <ul>
                <li><strong>Concepts:</strong> geography branches, human geography (population/economy/settlements), tourist destination, regionalization.</li>
                <li><strong>Physical:</strong> Dinarides/Alpide, 3 karst types, Adriatic 38‰, biogeographic regions.</li>
                <li><strong>Human:</strong> GDP/cap ~23,200 EUR (80% EU), tourism 20–25% of GDP, 170,723 work permits (31%/31%).</li>
                <li><strong>Protected/regions:</strong> 8 NP + 12 PP (~10.1%), 10 UNESCO sites; Coastal/Mountainous/Pannonian regions.</li>
            </ul>

            <h3>World Half — Must-Knows (one anchor per continent)</h3>
            <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="border-bottom: 1px solid var(--border-color);"><td><strong>Europe</strong></td><td>most indented; Gulf Stream; ~740 M; Acropolis/Alhambra</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td><strong>Asia</strong></td><td>largest (44.5 M km²); ~60% of humanity; Silk Road; Taj Mahal</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td><strong>Africa</strong></td><td>2nd largest; Gibraltar/Suez; "gift of the Nile"; safari</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td><strong>Australia/Oceania</strong></td><td>smallest; Gondwana; sparse; Poly/Micro/Melanesia</td></tr>
                <tr><td><strong>Americas</strong></td><td>USA (Yellowstone 1872, 61 NP); Mexico (Maya/Aztec); Brazil (Rio, Brasília)</td></tr>
            </table>

            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Strategy</h4>
                <p>Closed questions reward <strong>exact numbers and country–landmark pairs</strong>; open questions reward a <strong>concept + an example</strong> (e.g. "littoralization → coast crowding in Dalmatia"). Don't forget the separate <strong>blind map</strong> (Croatia).</p>
            </div>
        `
    }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// No key collisions between the two midterms, so this yields all 12 topic categories + examPractice = 13.
const geographyFinalData = Object.assign(
    {},
    (typeof window !== "undefined" && window.geographyData) ? window.geographyData : {},
    (typeof window !== "undefined" && window.geographyM2Data) ? window.geographyM2Data : {},
    { examPractice: geographyExamPractice }
);

if (typeof window !== "undefined") { window.geographyFinalData = geographyFinalData; }
if (typeof module !== "undefined" && module.exports) { module.exports = geographyFinalData; }
