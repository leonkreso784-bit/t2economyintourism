// ===== FOOD & NUTRITION — FINAL EXAM (hybrid) =====
// Pattern identical to Marketing/Economics/Geography/BI finals: the final lesson MERGES
// both midterms and adds one curated cross-topic "Exam Practice" category.
//   foodNutritionFinalData = Object.assign({}, foodNutritionData (K1), foodNutritionM2Data (K2), { examPractice })
// This file MUST load LAST (after data-food-nutrition.js + data-food-nutrition-m2.js) because
// it reads window.foodNutritionData and window.foodNutritionM2Data at module-load time.
//
// Course note (syllabus, FAN Introduction): the final exam is worth 30% (minimum 15% to pass),
// is OBLIGATORY, and the prerequisite to take it is at least 35% from coursework. It has 16
// questions: 12 short/suggested-answer questions (1.5% each) + 4 essay questions (max 3% each),
// and covers ALL material — Topics 1–14 (food quality → healthy diet).

const foodNutritionExamPractice = {
    id: "fcv6xu",
    name: "Exam Practice (All Topics)",
    icon: "fa-graduation-cap",
    color: "#16a34a",

    flashcards: [
        {
            id: "1nz500",
            question: "What is the structure and weight of the Food & Nutrition final exam?",
            answer: "The final exam is worth 30% (minimum 15% to pass) and is obligatory. It has 16 questions: 12 with short/suggested answers (1.5% each) + 4 essay-type questions (max 3% each). It covers all material, Topics 1–14.",
            explanation: "The prerequisite to take the final is at least 35% from coursework (midterms, seminars, activities)."
        },
        {
            id: "zrl54u",
            question: "Which topics make up the two midterm 'halves' that the final combines?",
            answer: "1st midterm = Topics 1–7: Food Quality, Food Components, Food Preservation, Cereals & Bakery, Fruits & Vegetables, Coffee/Tea/Cocoa, and Wine.\n2nd midterm = Topics 8–14: Beer, Distilled Spirits & Liqueurs, Meat, Fish, Milk & Dairy, Eggs, and Healthy Diet.",
            explanation: "Per the syllabus, Beer (Topic 8) belongs to the 2nd midterm, not the 1st."
        },
        {
            id: "swfqq8",
            question: "What are the energy values of the three energy-yielding macronutrients?",
            answer: "Proteins: 4 kcal/g (≈17 kJ/g)\nCarbohydrates: 4 kcal/g (≈17 kJ/g)\nFats: 9 kcal/g (≈39 kJ/g)\n(1 kcal ≈ 4.187 kJ). Vitamins, minerals, bioactive compounds, and water provide NO energy.",
            explanation: "Fat provides more than double the energy per gram of protein or carbohydrate — a recurring exam number."
        },
        {
            id: "pjsicg",
            question: "Distinguish complete and incomplete proteins and give a hospitality example of combining them.",
            answer: "Complete proteins contain all essential amino acids and come from animal origin (meat, milk, eggs, fish). Incomplete proteins (plant origin) have a limiting amino acid. Combining legumes + cereals (≈35:65) creates a complete amino-acid profile.",
            explanation: "This 'protein complementation' is the basis of balanced vegetarian menus."
        },
        {
            id: "w5zwlw",
            question: "Compare the key preservation principles and their critical temperatures.",
            answer: "ABIOSIS = destroy/remove microorganisms (sterilization >100°C). ANABIOSIS = inhibit them (cooling, freezing, drying, fermentation). Key temps: pasteurization <100°C, sterilization >100°C, blanching 75-95°C, frozen storage -18°C, lyophilization freezes at -50°C.",
            explanation: "ABIOSIS eliminates microbes; ANABIOSIS just creates unfavourable conditions for them."
        },
        {
            id: "72beu3",
            question: "Rank the alcoholic beverages by minimum alcohol content and state the common reaction.",
            answer: "Beer: standard 3.5-5.5% vol. → Wine: ≥8.5% vol. → Distilled spirits & liqueurs: ≥15% vol. (distilled spirits 30-50%; liqueurs also need ≥100 g/L sugar). All rely on alcoholic fermentation: C₆H₁₂O₆ + yeast → 2 C₂H₅OH + 2 CO₂.",
            explanation: "Saccharomyces yeast drives fermentation in bread, beer, wine and spirits alike; distillation then concentrates the spirit's alcohol."
        },
        {
            id: "enzdqy",
            question: "Name the characteristic stimulant compound of coffee, tea, and cocoa.",
            answer: "Coffee → caffeine (stimulates the central nervous and respiratory systems). Tea → theophylline. Cocoa → theobromine (named after Theobroma cacao). Theobromine and theophylline have a milder, relaxing effect.",
            explanation: "All three are bioactive alkaloids acting on the central nervous system."
        },
        {
            id: "z51mxw",
            question: "Summarise the nutritional 'signature' of each animal-origin food group.",
            answer: "Meat: 15-20% protein, the best heme-iron source, B12. Fish: omega-3 PUFA (EPA + DHA), low cholesterol. Milk: protein biological value higher than meat/fish, calcium (Ca:P ≈ 1.2-1.4:1). Eggs: egg-white protein has biological value 94 (one of the highest).",
            explanation: "Animal foods are complete-protein sources; fish adds heart-protective omega-3s."
        },
        {
            id: "qnqi4z",
            question: "How does fermentation appear across the whole course?",
            answer: "Alcoholic fermentation (yeast → alcohol + CO₂): bread, beer, wine, spirits. Lactic-acid fermentation: dairy (yogurt, kefir — kefir is also alcoholic), pickled vegetables (sauerkraut), fermented sausages. Biological preservation of food relies on these microbial processes.",
            explanation: "Recognising the type of fermentation per product is a strong cross-topic exam skill."
        },
        {
            id: "d8yjcd",
            question: "Match each food group with its main freshness/quality indicator.",
            answer: "Meat: colour from myoglobin (red/white), elastic surface. Fish: clear full eyes, bright-red moist gills, firm flesh; spoilage smell = TMA (trimethylamine). Eggs: densitometry (12% salt solution) and candling (ovoscope). Milk: heat treatment (pasteurization 72°C / UHT 135-140°C).",
            explanation: "Each group has its own sensory and instrumental quality tests."
        },
        {
            id: "p4a01m",
            question: "List the core WHO healthy-diet recommendations.",
            answer: "Total fat ≤30% of energy; saturated fat <10%; cholesterol <300 mg/day; carbohydrates 55-75%; added sugars <10% (≈50 g); protein 10-15%; salt <5 g/day; fruit & vegetables ≥400 g/day; dietary fibre ≥25 g/day.",
            explanation: "These are the headline numbers from the Healthy Diet topic (Topic 14)."
        },
        {
            id: "6x5rk2",
            question: "Explain BMI classification and the components of energy expenditure.",
            answer: "BMI: <18.5 malnutrition, 18.5-24.9 normal, 25-29.9 overweight, ≥30 obesity (grades 1/2/3). Energy expenditure = basal metabolic rate (60-75%) + thermic effect of food (~10%) + physical activity (10-35%, the most variable).",
            explanation: "BMR is the largest, most stable component of daily energy use."
        },
        {
            id: "jjz10y",
            question: "Compare the four nutrition models for health promotion.",
            answer: "Mediterranean: whole grains, olive oil, fish, legumes, moderate red wine with meals. DASH: stops hypertension; sodium <2300 mg/day. MIND: Mediterranean + DASH for brain health (greens, berries, nuts, fish). Nordic: Nordic foods, berries, oats/barley (β-glucan), canola oil.",
            explanation: "All four emphasise plants, whole grains and healthy fats while limiting red meat."
        },
        {
            id: "jgsjns",
            question: "What are the main food-safety hazards across the animal-origin foods?",
            answer: "Meat: putrefaction → toxic biogenic amines. Fish: histamine (histidine→histamine by bacteria) and the Anisakis parasite (raw fish/sushi). Eggs: Salmonella and Campylobacter. Overarching principle: traceability — 'one step forward, one step back' / 'from farm to fork'.",
            explanation: "Food safety is a prerequisite for food quality — a key Topic 1 concept that recurs throughout."
        }
    ],

    quiz: [
        {
            id: "htymzm",
            question: "The Food & Nutrition final exam consists of:",
            options: ["10 questions (5 closed + 5 open)", "16 questions (12 short + 4 essay)", "20 multiple-choice questions", "1 essay only"],
            correct: 1
        },
        {
            id: "x39ta0",
            question: "Which nutrient provides the most energy per gram?",
            options: ["Protein (4 kcal/g)", "Carbohydrate (4 kcal/g)", "Fat (9 kcal/g)", "Alcohol (2 kcal/g)"],
            correct: 2
        },
        {
            id: "8z29sd",
            question: "Sterilization destroys spores because it occurs:",
            options: ["Below 100°C", "Above 100°C", "At 75-95°C", "At -18°C"],
            correct: 1
        },
        {
            id: "m05bjc",
            question: "Which beverage requires the highest minimum alcohol content?",
            options: ["Standard beer (3.5-5.5%)", "Wine (≥8.5%)", "Distilled spirits & liqueurs (≥15%)", "They are all equal"],
            correct: 2
        },
        {
            id: "r9v0az",
            question: "The characteristic bioactive compound of cocoa is:",
            options: ["Caffeine", "Theophylline", "Theobromine", "Catechin"],
            correct: 2
        },
        {
            id: "f128n6",
            question: "The best dietary source of heme-iron is:",
            options: ["Red meat", "Milk", "Fruit", "White bread"],
            correct: 0
        },
        {
            id: "ok2kg7",
            question: "EPA and DHA — the omega-3 fatty acids — are characteristic of:",
            options: ["Cereals", "Fish", "Cheese", "Eggs"],
            correct: 1
        },
        {
            id: "7ls2y4",
            question: "Egg white protein has a biological value of:",
            options: ["50", "75", "94", "120"],
            correct: 2
        },
        {
            id: "wg2qua",
            question: "The WHO recommends a daily salt intake of less than:",
            options: ["2 g", "5 g", "10 g", "15 g"],
            correct: 1
        },
        {
            id: "b5l3uu",
            question: "Basal metabolic rate accounts for what share of energy expenditure?",
            options: ["10%", "30%", "60-75%", "90%"],
            correct: 2
        },
        {
            id: "qo32w2",
            question: "Which fermentation produces yogurt and kefir?",
            options: ["Alcoholic only", "Lactic-acid (kefir also alcoholic)", "Acetic-acid", "No fermentation"],
            correct: 1
        },
        {
            id: "cm0x2c",
            question: "The DASH diet was specifically designed to:",
            options: ["Build muscle mass", "Lower blood pressure (stop hypertension)", "Increase alcohol tolerance", "Promote weight gain"],
            correct: 1
        }
    ],

    fillBlanks: [
        {
            id: "zhhs96",
            sentence: "The final exam is worth _______% of the grade (minimum 15% to pass).",
            answer: "30",
            hint: "Thirty..."
        },
        {
            id: "yah3a5",
            sentence: "Fats provide _______ kcal per gram — more than double protein or carbohydrate.",
            answer: "9",
            hint: "Nine..."
        },
        {
            id: "p4jqh2",
            sentence: "ABIOSIS destroys microorganisms, while _______ only inhibits them.",
            answer: "anabiosis",
            hint: "Cooling, freezing, drying..."
        },
        {
            id: "r9h9w1",
            sentence: "Wine must have at least _______% vol alcohol, while distilled spirits need ≥15%.",
            answer: "8.5",
            hint: "Eight and a half..."
        },
        {
            id: "9ki25d",
            sentence: "The stimulant in coffee is _______.",
            answer: "caffeine",
            hint: "Acts on the central nervous system..."
        },
        {
            id: "7whhov",
            sentence: "The 'fishy smell' of less-fresh fish comes from the compound _______ (TMA).",
            answer: "trimethylamine",
            hint: "Abbreviated TMA..."
        },
        {
            id: "okietq",
            sentence: "The WHO recommends a fruit and vegetable intake of at least _______ g per day.",
            answer: "400",
            hint: "Four hundred..."
        },
        {
            id: "ylcsk6",
            sentence: "Food safety is described by the principle 'from farm to _______'.",
            answer: "fork",
            hint: "Where food is eaten..."
        }
    ],

    learn: {
        id: "y3n6en",
        title: "Final Exam Roadmap (Topics 1–14)",
        content: `
            <h3>📋 What the Final Covers</h3>
            <p>The final exam is <strong>worth 30%</strong> (minimum <strong>15%</strong> to pass) and is <strong>obligatory</strong>; the prerequisite to sit it is at least <strong>35%</strong> from coursework. It has <strong>16 questions</strong>: 12 short/suggested-answer (1.5% each) + 4 essay-type (max 3% each), covering <strong>all 14 topics</strong>.</p>
            <p>Use this category to drill <strong>across topics</strong>; the 14 per-topic categories remain available in this same lesson for deep revision.</p>

            <h3>🍽️ First Midterm Half — Topics 1–7</h3>
            <table><tr><th>Topic</th><th>Must-know anchor</th></tr>
            <tr><td>1. Food Quality</td><td>Energy 4/4/9 kcal/g; objective vs subjective methods; "farm to fork"</td></tr>
            <tr><td>2. Food Components</td><td>Complete vs incomplete proteins; GI &lt;55/56-69/&gt;70; fat- vs water-soluble vitamins</td></tr>
            <tr><td>3. Food Preservation</td><td>ABIOSIS vs ANABIOSIS; pasteurization &lt;100°C / sterilization &gt;100°C; -18°C</td></tr>
            <tr><td>4. Cereals & Bakery</td><td>Gluten = gliadin + glutelin; flour type = ash × 1000; celiac disease</td></tr>
            <tr><td>5. Fruits & Vegetables</td><td>Pulses 18-35% protein; lycopene = red; jam 35g / extra jam 45g; ≥400 g/day</td></tr>
            <tr><td>6. Coffee/Tea/Cocoa</td><td>Arabica 70% / Robusta 30%; caffeine/theophylline/theobromine; conching</td></tr>
            <tr><td>7. Wine</td><td>≥8.5% vol; anthocyanins; malolactic fermentation; Champagne vs Charmat</td></tr></table>

            <h3>🍺 Second Midterm Half — Topics 8–14</h3>
            <table><tr><th>Topic</th><th>Must-know anchor</th></tr>
            <tr><td>8. Beer</td><td>Malt + water + yeast + hops; lager (bottom) vs ale (top); EBC; ~45 kcal/100ml</td></tr>
            <tr><td>9. Distilled Spirits & Liqueurs</td><td>≥15% vol; fermentation creates + distillation concentrates; liqueurs ≥100 g/L sugar</td></tr>
            <tr><td>10. Meat</td><td>Water 65-75%; heme-iron; putrefaction → biogenic amines; freeze -18°C</td></tr>
            <tr><td>11. Fish</td><td>Lean &lt;3% / fatty &gt;8% fat; EPA + DHA (omega-3); TMA = spoilage; 2 servings/week</td></tr>
            <tr><td>12. Milk & Dairy</td><td>Water 87%; lactose = glucose + galactose; pasteurization 72°C / UHT 135-140°C</td></tr>
            <tr><td>13. Eggs</td><td>Shell = CaCO₃; white BV = 94; avidin; codes 0-3; Salmonella</td></tr>
            <tr><td>14. Healthy Diet</td><td>WHO: fat ≤30%, salt &lt;5g, fibre ≥25g; BMI; BMR 60-75%; Mediterranean/DASH/MIND</td></tr></table>

            <h3>🔗 Cross-Topic Threads</h3>
            <ul>
            <li><strong>Fermentation everywhere:</strong> alcoholic (bread, beer, wine, spirits) vs lactic-acid (yogurt, kefir, sauerkraut, sausages).</li>
            <li><strong>Alcohol ladder:</strong> beer 3.5-5.5% → wine ≥8.5% → spirits/liqueurs ≥15% (distilled 30-50%).</li>
            <li><strong>Food safety:</strong> putrefaction (meat), histamine + Anisakis (fish), Salmonella (eggs); traceability "one step forward, one step back".</li>
            <li><strong>Protein quality:</strong> animal = complete; combine legumes + cereals for a complete plant profile.</li>
            </ul>

            <h3>💡 Exam Strategy</h3>
            <p>Short questions reward <strong>exact numbers and definitions</strong> (energy values, temperatures, percentages, alcohol minimums). Essay questions reward a <strong>concept + an example</strong> (e.g. "ANABIOSIS → refrigerating fish at &lt;4°C slows microbial growth", or "complete protein → combine beans with rice"). Revise one strong anchor per topic, then practise linking topics.</p>
        `
    }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// No key collisions between K1 (7 topic cats) and K2 (7 topic cats), so this yields all
// 14 topic categories + examPractice = 15 categories.
const foodNutritionFinalData = Object.assign(
    {},
    (typeof window !== "undefined" && window.foodNutritionData) ? window.foodNutritionData : {},
    (typeof window !== "undefined" && window.foodNutritionM2Data) ? window.foodNutritionM2Data : {},
    { examPractice: foodNutritionExamPractice }
);

if (typeof window !== "undefined") { window.foodNutritionFinalData = foodNutritionFinalData; }
if (typeof module !== "undefined" && module.exports) { module.exports = foodNutritionFinalData; }
