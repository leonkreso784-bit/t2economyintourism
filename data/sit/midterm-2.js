// ===== SPECIAL INTEREST TOURISM — 2nd MIDTERM (K2) =====
// Source: lecture slides 8–15 (Prof. B. Pavlakovič Farrell, FMTU, 1st year HM).
// K2 boundary from the syllabus schedule: everything taught AFTER the 1st midterm exam —
// Nautical, (Event), Sports, (Outdoor & wildlife), Luxury, Dark, Health, Film tourism.
// NOTE: the "Nautical tourism" slide deck is image-only (no extractable text), so the
// nautical category below is written from standard, uncontroversial general knowledge and
// should be verified against the professor's slides. Event and Outdoor/Wildlife tourism
// were taught but no lecture files were provided, so they are not yet covered.

const sitM2 = {

    // ========== CATEGORY 1: NAUTICAL TOURISM (general knowledge — verify vs slides) ==========
    nautical: {
        name: "Nautical Tourism",
        icon: "fa-anchor",
        color: "#0891b2",

        flashcards: [
            {
                question: "What is NAUTICAL TOURISM?",
                answer: "A special form of tourism in which the tourist's main motivation is travel and stay ON or BY THE WATER using vessels (boats, yachts, cruise ships) for leisure, sport and recreation.\n\nIt combines navigation/sailing with the use of nautical infrastructure (marinas, ports) and coastal/maritime attractions. It is especially important for Croatia and the wider Mediterranean.\n\n(Note: this category is based on general SIT knowledge — verify against the professor's slides.)",
                explanation: "Tourism centred on the water and vessels."
            },
            {
                question: "What are the main SEGMENTS of nautical tourism?",
                answer: "• CRUISING — large cruise-ship holidays (mass scale; e.g. Mediterranean/Caribbean itineraries)\n• YACHTING / SAILING — private or chartered yachts and sailboats\n• BOATING / CHARTER — renting vessels (bareboat or skippered)\n• NAUTICAL infrastructure services — marinas, berths, repair/maintenance\n\nNautical tourism therefore ranges from mass (cruising) to clearly special-interest (sailing/yachting).",
                explanation: "Cruising, yachting/sailing, charter, marina services."
            },
            {
                question: "What is a MARINA, and why is it the backbone of nautical tourism?",
                answer: "A MARINA is a specially built port for nautical tourism — offering berths (moorings) plus services: water, electricity, fuel, repair, supply, sanitation, reception and hospitality.\n\nMarinas are the basic infrastructure that makes yachting/charter tourism possible. In Croatia, the largest chain of marinas is ACI (Adriatic Croatia International Club).",
                explanation: "Marinas provide berths + services; ACI is Croatia's main chain."
            },
            {
                question: "Why is CROATIA a leading nautical destination?",
                answer: "• A long, indented Adriatic coastline with ~1,200 islands, islets and reefs\n• Clean sea, many sheltered bays and short distances between ports\n• A dense network of MARINAS (e.g. the ACI chain)\n• Favourable sailing climate (good wind, long season)\n\nNautical tourism is one of the highest-yield, more sustainable forms of Croatian tourism.",
                explanation: "Indented coast + islands + marinas = ideal for sailing."
            },
            {
                question: "What are the main CHARACTERISTICS of nautical tourism?",
                answer: "• HIGH per-capita spending (yacht owners/charterers)\n• Strong dependence on natural conditions (sea, coast, weather)\n• Requires significant INFRASTRUCTURE investment (marinas, ports)\n• Seasonal but can extend the season (off-peak sailing)\n• Sensitive to environmental impacts (marine pollution, anchoring damage)",
                explanation: "High-spend, infrastructure-heavy, nature-dependent."
            }
        ],

        quiz: [
            {
                question: "Nautical tourism is centred primarily on:",
                options: [
                    "Mountains and skiing",
                    "Travel and stay on or by the water using vessels",
                    "Factory visits",
                    "Cemeteries"
                ],
                correct: 1
            },
            {
                question: "Which is a segment of nautical tourism?",
                options: [
                    "Cruising",
                    "Dark dungeons",
                    "MICE",
                    "Agritourism"
                ],
                correct: 0
            },
            {
                question: "A marina provides:",
                options: [
                    "Ski slopes",
                    "Berths and services for vessels",
                    "Museum exhibits",
                    "Conference halls"
                ],
                correct: 1
            },
            {
                question: "Croatia's largest chain of marinas is:",
                options: [
                    "ACI (Adriatic Croatia International Club)",
                    "UNWTO",
                    "ICCA",
                    "TICCIH"
                ],
                correct: 0
            },
            {
                question: "A key reason Croatia suits nautical tourism is its:",
                options: [
                    "Flat inland plains",
                    "Indented coastline with many islands and sheltered bays",
                    "Lack of coastline",
                    "Cold northern climate"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Nautical tourism centres on travel and stay on or by the _______ using vessels.",
                answer: "water",
                hint: "Sea, lakes..."
            },
            {
                sentence: "A _______ is a specially built port offering berths and services for vessels.",
                answer: "marina",
                hint: "Where yachts moor..."
            },
            {
                sentence: "Croatia's largest marina chain is _______.",
                answer: "ACI",
                hint: "Adriatic Croatia International..."
            },
            {
                sentence: "Large cruise-ship holidays are the _______ segment of nautical tourism.",
                answer: "cruising",
                hint: "Big ships..."
            }
        ],

        learn: {
            title: "Nautical Tourism",
            content: `
                <div class="warning-box">
                    <p>⚠️ The nautical lecture slide is image-only (no extractable text). This category is built
                    from standard SIT knowledge — <strong>verify against the professor's slides</strong>.</p>
                </div>

                <h3>What is Nautical Tourism?</h3>
                <div class="formula-box">
                    Tourism centred on travel and stay <strong>on or by the water</strong> using vessels —
                    combining sailing/navigation with marina infrastructure and coastal attractions.
                </div>

                <h4>Segments</h4>
                <ul>
                    <li><strong>Cruising</strong> — large cruise-ship holidays (mass scale)</li>
                    <li><strong>Yachting / sailing</strong> — private or chartered yachts (special interest)</li>
                    <li><strong>Charter / boating</strong> — renting vessels (bareboat or skippered)</li>
                    <li><strong>Marina services</strong> — berths + water, fuel, repair, hospitality</li>
                </ul>

                <h4>Croatia</h4>
                <div class="tip-box">
                    <p>Indented Adriatic coast, ~1,200 islands, dense <strong>ACI</strong> marina network, good
                    sailing climate → one of the highest-yield, more sustainable forms of Croatian tourism.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 2: SPORTS TOURISM ==========
    sports: {
        name: "Sports Tourism",
        icon: "fa-medal",
        color: "#16a34a",

        flashcards: [
            {
                question: "What is SPORTS TOURISM (UNWTO, 2019)?",
                answer: "\"A type of tourism activity which refers to the travel experience of the tourist who either OBSERVES as a spectator or actively PARTICIPATES in a sporting event, generally involving commercial and non-commercial activities of a competitive nature.\"\n\nSport and tourism have been linked since ancient Greece and Rome (competitions motivated travel).",
                explanation: "Watching OR taking part in sport away from home."
            },
            {
                question: "Tourism vs sport: what is the core difference (de Villiers)?",
                answer: "TOURISM is an EXPERIENCE-orientated activity (it provides people with experiences).\n\nSPORT is a PERFORMANCE-orientated activity (competitive; rewards grow with the level of competition).\n\nThe famous 'coffee' example (Pine) illustrates the experience economy: a coffee can be a product (1¢), commodity, service, or — in a trendy café — an EXPERIENCE (500¢).",
                explanation: "Experience-orientated (tourism) vs performance-orientated (sport)."
            },
            {
                question: "What is the difference between SPORTS TOURISM and TOURISM SPORT (Gammon & Robinson, 2003)?",
                answer: "SPORTS TOURISM — SPORT is the PRIME motivation to travel (the tourism element reinforces it).\n\nTOURISM SPORT — the HOLIDAY/visit is the prime motivation, and sport is a SECONDARY activity.\n\nEach has a HARD definition (active/passive participation in COMPETITIVE sport) and a SOFT definition (recreational participation, e.g. skiing/walking holidays, or incidental sport).",
                explanation: "Which comes first — the sport or the holiday?"
            },
            {
                question: "What are Gibson's 3 categories of sport tourism (2002)?",
                answer: "1. ACTIVE sport tourism — travelling to PARTICIPATE in sport\n2. EVENT sport tourism — travelling to WATCH/attend a sporting event\n3. NOSTALGIA sport tourism — visiting sport heritage (halls of fame, famous stadia, museums) — linked to worship, heritage, pilgrimage and fanship",
                explanation: "Active · event · nostalgia."
            },
            {
                question: "What are Kurtzman's 5 SUPPLY-SIDE categories of sport tourism?",
                answer: "1. ATTRACTIONS (stadiums, sport museums, halls of fame, sport theme parks)\n2. RESORTS (sport as the primary focus, e.g. ski/golf resorts)\n3. CRUISES (sport-focused cruises with pros on board)\n4. TOURS (visiting multiple sport attractions/events)\n5. EVENTS (sport events attracting spectator-tourists)",
                explanation: "Attractions, resorts, cruises, tours, events."
            },
            {
                question: "How is DEMAND for tourism-sport classified (UNWTO, 7 groups)?",
                answer: "By degree of involvement + importance of the tourism component:\n1. Top-level athletes (the elite, <8% of athletes)\n2. Second-level athletes\n3. Youth groups\n4. Sports enthusiasts & amateurs (the biggest group)\n5. Tourists who want to practise sport when they travel\n6. Tourists who practise sport casually\n7. Spectators",
                explanation: "From elite athletes to casual spectators."
            },
            {
                question: "How can MEGA EVENTS (Olympics, World Cup) benefit a host destination?",
                answer: "• Re-brand / re-image a nation (Sydney 2000 accelerated awareness of Australia by ~10 years; Germany 'softened' its image with the 2006 FIFA World Cup)\n• High media profile → world recognition; an agent of place-image change\n• Long-term tourism boost after the event\n• Benefits can be SPREAD beyond the host city (torch relay, training camps, cultural programmes, multiple venue cities)",
                explanation: "Mega events as nation-branding and 'fast-track' recognition."
            }
        ],

        quiz: [
            {
                question: "In SPORTS TOURISM, the prime motivation to travel is:",
                options: [
                    "The holiday, with sport secondary",
                    "The sport itself",
                    "Business networking",
                    "Medical treatment"
                ],
                correct: 1
            },
            {
                question: "Tourism is experience-orientated, whereas sport is:",
                options: [
                    "Performance-orientated",
                    "Price-orientated",
                    "Location-orientated",
                    "Always free"
                ],
                correct: 0
            },
            {
                question: "Visiting a sports hall of fame or famous stadium is:",
                options: [
                    "Active sport tourism",
                    "Event sport tourism",
                    "Nostalgia sport tourism",
                    "Tourism sport"
                ],
                correct: 2
            },
            {
                question: "Which is one of Kurtzman's 5 supply-side categories of sport tourism?",
                options: [
                    "Resorts",
                    "Pilgrimage",
                    "MICE",
                    "Spas"
                ],
                correct: 0
            },
            {
                question: "In the UNWTO demand classification, the BIGGEST group is:",
                options: [
                    "Top-level athletes",
                    "Sports enthusiasts and amateurs",
                    "Youth groups",
                    "Spectators"
                ],
                correct: 1
            },
            {
                question: "A key tourism benefit of mega sport events is:",
                options: [
                    "Reducing media attention",
                    "Re-branding/re-imaging the host nation",
                    "Lowering visitor numbers",
                    "Avoiding infrastructure investment"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "In sports tourism, _______ is the prime motivation to travel.",
                answer: "sport",
                hint: "Not the holiday..."
            },
            {
                sentence: "Tourism is experience-orientated; sport is _______-orientated.",
                answer: "performance",
                hint: "Competitive..."
            },
            {
                sentence: "Visiting sport heritage and halls of fame is _______ sport tourism.",
                answer: "nostalgia",
                hint: "Looking back..."
            },
            {
                sentence: "The Olympics and World Cup can _______ a nation's image.",
                answer: "re-brand",
                hint: "Change the image..."
            },
            {
                sentence: "Top-level athletes represent less than _______% of all athletes.",
                answer: "8",
                hint: "Single digit..."
            }
        ],

        learn: {
            title: "Sports Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Travel to <strong>observe (spectator)</strong> or <strong>actively participate</strong> in a
                    sporting event (UNWTO, 2019). Tourism = experience-orientated; sport = performance-orientated.
                </div>

                <h4>Sports Tourism vs Tourism Sport (Gammon & Robinson)</h4>
                <div class="tip-box">
                    <p><strong>Sports tourism:</strong> sport is the prime motivation</p>
                    <p><strong>Tourism sport:</strong> the holiday is prime, sport is secondary</p>
                    <p>Each has a HARD (competitive) and SOFT (recreational/incidental) definition.</p>
                </div>

                <h4>Gibson's 3 Categories</h4>
                <p>Active · Event · Nostalgia (sport heritage, halls of fame).</p>

                <h4>Kurtzman's 5 Supply-side Categories</h4>
                <p>Attractions · Resorts · Cruises · Tours · Events.</p>

                <h4>Demand (UNWTO, 7 groups)</h4>
                <p>Top-level athletes (&lt;8%) · second-level · youth · enthusiasts/amateurs (biggest) ·
                tourists who want to practise sport · casual · spectators.</p>

                <h4>Mega Events</h4>
                <div class="example-box">
                    <p>Olympics/World Cup → nation re-branding (Sydney 2000, Germany 2006), world recognition,
                    long-term tourism boost; spread benefits beyond the host city.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 3: LUXURY TOURISM ==========
    luxury: {
        name: "Luxury Tourism",
        icon: "fa-gem",
        color: "#d946ef",

        flashcards: [
            {
                question: "What is LUXURY, and where does the word come from?",
                answer: "Luxury is a MULTIFACETED concept — its definition depends on CONTEXT, GENERATION and NATIONALITY ('what one generation sees as a luxury, the next sees as a necessity').\n\nThe word derives from Latin 'LUX' / 'LUXURIA' = light, shine, excess, extravagance, deviation, lust.\n\nNon-luxury and luxury are two extremes on a CONTINUUM — where ordinary ends and luxury begins is 'in the eyes of the beholder'.",
                explanation: "Context-dependent; from Latin lux/luxuria."
            },
            {
                question: "What are MASSTIGE and the 'democratisation' of luxury?",
                answer: "MASSTIGE = 'MASS' + 'preSTIGE'. A luxury brand REDUCES its price to become affordable to the masses, without compromising quality too much.\n\nThis 'democratisation' of luxury makes luxury reachable to many consumers regardless of income — but risks harming the traditional narrative meaning of luxury (which is based on RARITY).",
                explanation: "Mass prestige = accessible luxury for the masses."
            },
            {
                question: "What is the difference between INACCESSIBLE and ACCESSIBLE luxury (Chang et al., 2016)?",
                answer: "INACCESSIBLE luxury — the extreme level of authenticity, prestige, exclusivity, quality and innovativeness; sought by the UPPER socio-economic class (the traditional understanding of luxury).\n\nACCESSIBLE luxury — non-essential, prestigious, authentic products that are publicly well-known and REASONABLY PRICED; consumed by middle/working classes to express social status.",
                explanation: "Inaccessible (elite) vs accessible (reasonably priced)."
            },
            {
                question: "What are the 4 'lenses' for understanding luxury (Saviolo)?",
                answer: "1. Luxury as a PRODUCT (durable investments vs personal goods; leather goods now dominate)\n2. Luxury as a BUSINESS (4 elements: strong aspirational branding, superior quality + timelessness, high/premium pricing, aesthetics/design)\n3. Luxury as a CULTURE (mainly European; France = 'art de vivre', heritage; Italy = excellence/innovation, 'la dolce vita')\n4. Luxury as a CUSTOMER (heterogeneous; not all rich are luxury buyers; aspirational customers drive growth; Asia is booming)",
                explanation: "Product · Business · Culture · Customer."
            },
            {
                question: "What is luxury NOT?",
                answer: "• NOT just an object (it's objects + brands + business models + stories + service)\n• NOT just expensive (it must give VALUE; high price signals quality but luxury ≠ expensive)\n• NOT completely replicable (limited, made-to-measure, you wait — never a mass series)\n• NOT easy (you need culture to understand it)\n• NOT fast (true luxury needs TIME — unlike fashion)",
                explanation: "Defining luxury by what it is not."
            },
            {
                question: "How do luxury SERVICES differ from luxury GOODS (Hemzo, 2023)?",
                answer: "Luxury services share the general service characteristics — INTANGIBILITY, HETEROGENEITY, INSEPARABILITY, PERISHABILITY — plus:\n• NON-OWNERSHIP (enjoyed for a limited time) but PSYCHOLOGICAL POSSESSION (valuable memories)\n• LOWER conspicuous consumption (no visible logo)\n• LOWER risk of counterfeiting (depend on savoir-faire/skills)\n\nManaged with the 'service' 4 Ps: People, Processes, Panorama, Productivity.",
                explanation: "Services = experiences (intangible, non-owned, memory-based)."
            },
            {
                question: "What is BLUXURY, and what is the scale of luxury travel?",
                answer: "BLUXURY = combining BUSINESS travel with LUXURY leisure travel (cf. 'bleisure' = business + leisure).\n\nThe luxury travel market is projected to reach ~USD $2.7 billion by 2032. Luxury travel is SUBJECTIVE and increasingly about acute PERSONALISATION; the 'hierarchy of luxury travel needs' applies Maslow's pyramid to travel.\n\nThe first 'boutique/designer hotel' was Morgans (New York, 1980s).",
                explanation: "Bluxury = business + luxury; market ~$2.7bn by 2032."
            }
        ],

        quiz: [
            {
                question: "The word 'luxury' derives from the Latin:",
                options: [
                    "Lux / luxuria",
                    "Luxus / lumen",
                    "Lucror",
                    "Locus"
                ],
                correct: 0
            },
            {
                question: "'Masstige' means:",
                options: [
                    "Maximum prestige for the elite only",
                    "Mass prestige — luxury made affordable to the masses",
                    "A counterfeit good",
                    "A type of marina"
                ],
                correct: 1
            },
            {
                question: "Which is NOT one of the 4 'lenses' of luxury (Saviolo)?",
                options: [
                    "Product",
                    "Business",
                    "Culture",
                    "Regulation"
                ],
                correct: 3
            },
            {
                question: "According to the lecture, true luxury is:",
                options: [
                    "Fast and mass-produced",
                    "Limited, timeless and never fast",
                    "Always cheap",
                    "Identical to fashion"
                ],
                correct: 1
            },
            {
                question: "'Bluxury' travel combines business travel with:",
                options: [
                    "Budget travel",
                    "Luxury leisure travel",
                    "Medical travel",
                    "Dark tourism"
                ],
                correct: 1
            },
            {
                question: "Inaccessible luxury is primarily sought by the:",
                options: [
                    "Working class",
                    "Upper socio-economic class",
                    "Students",
                    "Mass market"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "The word luxury comes from the Latin lux and _______.",
                answer: "luxuria",
                hint: "Excess, extravagance..."
            },
            {
                sentence: "_______ means mass prestige — luxury made affordable to the masses.",
                answer: "Masstige",
                hint: "Mass + prestige..."
            },
            {
                sentence: "True luxury is limited, timeless and never _______.",
                answer: "fast",
                hint: "Unlike fashion..."
            },
            {
                sentence: "Combining business travel with luxury leisure travel is called _______.",
                answer: "bluxury",
                hint: "Business + luxury..."
            },
            {
                sentence: "Traditional luxury has always been based on _______.",
                answer: "rarity",
                hint: "Scarcity/exclusivity..."
            }
        ],

        learn: {
            title: "Luxury Tourism",
            content: `
                <h3>What is Luxury?</h3>
                <div class="formula-box">
                    Multifaceted, context/generation/nationality-dependent. From Latin <strong>lux/luxuria</strong>
                    (light, excess). Non-luxury ↔ luxury = a continuum 'in the eyes of the beholder'.
                </div>

                <h4>Democratisation</h4>
                <p><span class="highlight">Masstige</span> (mass + prestige) makes luxury affordable to the masses,
                challenging luxury's traditional basis in <strong>rarity</strong>. Inaccessible (elite) vs accessible
                (reasonably priced) luxury.</p>

                <h4>4 Lenses (Saviolo)</h4>
                <div class="tip-box">
                    <p><strong>Product</strong> · <strong>Business</strong> (branding, quality+timelessness, premium price, aesthetics) ·
                    <strong>Culture</strong> (France 'art de vivre' / Italy excellence) · <strong>Customer</strong> (heterogeneous; Asia booming)</p>
                </div>

                <h4>Luxury is NOT</h4>
                <p>Not just an object · not just expensive · not replicable · not easy · not fast.</p>

                <h4>Luxury Travel</h4>
                <div class="example-box">
                    <p>Services = experiences (intangible, non-owned, memory-based; 'service' 4 Ps: People, Processes,
                    Panorama, Productivity). <strong>Bluxury</strong> = business + luxury. Market ~$2.7bn by 2032;
                    first boutique hotel = Morgans, NYC.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 4: DARK TOURISM ==========
    dark: {
        name: "Dark Tourism",
        icon: "fa-skull",
        color: "#475569",

        flashcards: [
            {
                question: "What is DARK TOURISM?",
                answer: "An UMBRELLA term for any form of tourism associated with DEATH, DISASTER and SUFFERING (Light, 2017).\n\nThe related niche term THANATOURISM (from Greek 'thanatos' = death) is more restrictive — it focuses on one's symbolic or actual encounter with death.\n\nExamples: war memorials, holocaust museums, battlefields, concentration camps (many run by the public sector).",
                explanation: "Tourism linked to death, disaster and suffering."
            },
            {
                question: "What is the central ETHICAL question of dark tourism?",
                answer: "Where is the BOUNDARY between the ACCEPTABLE and UNACCEPTABLE transformation of suffering into a tourist attraction?\n\nDark tourism can be EDUCATIONAL and COMMEMORATIVE (ensuring suffering is not forgotten), but some visitors come for SENSATION / morbid curiosity / 'schadenfreude' — which can harm those emotionally affected. The right tone must be set, especially as many sites are publicly managed.",
                explanation: "Education/commemoration vs sensationalism/voyeurism."
            },
            {
                question: "What are some early HISTORICAL precursors of dark tourism?",
                answer: "Dark tourism is not new:\n• Roman GLADIATORIAL games\n• Public EXECUTIONS (medieval to 19th century) — with grandstands for fee-paying spectators\n• The alleged first guided tour in England (1838) — a railway excursion to see a hanging\n• Victorian MORGUE tours and flogging galleries",
                explanation: "Gladiators, public executions, morgue tours."
            },
            {
                question: "What is Stone's DARK TOURISM SPECTRUM (2006)?",
                answer: "A 'spectrum of supply' from the LIGHTEST to the DARKEST forms of dark tourism, based on spatial, temporal, political and ideological factors that determine the perceived intensity of 'darkness'.\n\nIt identifies SEVEN dark 'suppliers' / products from light → dark.",
                explanation: "A 'darkest–lightest' framework with 7 product types."
            },
            {
                question: "What are Stone's 7 dark tourism 'suppliers' (light → dark)?",
                answer: "1. DARK FUN FACTORIES — entertainment focus (e.g. the Dungeons; haunted houses)\n2. DARK EXHIBITIONS — education/commemoration (e.g. WWII museums)\n3. DARK DUNGEONS — former prisons/courthouses (Alcatraz, Clink Prison)\n4. DARK RESTING PLACES — cemeteries (Père Lachaise, New Orleans)\n5. DARK SHRINES — places of remembrance near the death (e.g. Queen Elizabeth II tributes; George Floyd Square)\n6. DARK CONFLICT SITES — wars/battlefields (Normandy D-Day, the Alamo)\n7. DARK CAMPS OF GENOCIDE — the darkest end (Auschwitz-Birkenau)",
                explanation: "Fun factories → exhibitions → dungeons → resting places → shrines → conflict → genocide."
            },
            {
                question: "Compare ALCATRAZ and ROBBEN ISLAND as dark dungeons.",
                answer: "Both are island prisons that held famous inmates, but their tourist interpretation differs greatly:\n• ALCATRAZ (USA) — associated with ENTERTAINMENT (the 'Hollywood' image, famous criminals & escape attempts); visitors may pose for fun photos in cells.\n• ROBBEN ISLAND (South Africa) — more EDUCATIONAL and CONTEMPLATIVE; guides are former apartheid-era prisoners; visitors come to learn about Nelson Mandela and South Africa's history.\n\nLesson: how a site is INTERPRETED shapes the visitor experience.",
                explanation: "Entertainment (Alcatraz) vs education/contemplation (Robben Island)."
            }
        ],

        quiz: [
            {
                question: "Dark tourism is an umbrella term for tourism associated with:",
                options: [
                    "Luxury and wealth",
                    "Death, disaster and suffering",
                    "Sport and fitness",
                    "Business meetings"
                ],
                correct: 1
            },
            {
                question: "'Thanatourism' derives from the Greek word for:",
                options: [
                    "Light",
                    "Death",
                    "War",
                    "Travel"
                ],
                correct: 1
            },
            {
                question: "Stone's dark tourism spectrum ranges from:",
                options: [
                    "Cheap to expensive",
                    "Lightest to darkest",
                    "Local to global",
                    "Old to new"
                ],
                correct: 1
            },
            {
                question: "At the LIGHTEST (most entertainment-focused) end are:",
                options: [
                    "Dark camps of genocide",
                    "Dark fun factories",
                    "Dark conflict sites",
                    "Dark shrines"
                ],
                correct: 1
            },
            {
                question: "Auschwitz-Birkenau is an example of:",
                options: [
                    "A dark fun factory",
                    "A dark camp of genocide (the darkest end)",
                    "A dark resting place",
                    "A dark dungeon"
                ],
                correct: 1
            },
            {
                question: "Compared with Alcatraz, Robben Island's tone is more:",
                options: [
                    "Entertainment-focused",
                    "Educational and contemplative",
                    "Commercial",
                    "Fictional"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Dark tourism is associated with death, disaster and _______.",
                answer: "suffering",
                hint: "Pain/tragedy..."
            },
            {
                sentence: "_______ (from Greek 'thanatos') focuses on the encounter with death.",
                answer: "Thanatourism",
                hint: "Death tourism..."
            },
            {
                sentence: "Stone's spectrum runs from lightest to _______.",
                answer: "darkest",
                hint: "Most intense..."
            },
            {
                sentence: "Dark fun _______ (e.g. the Dungeons) sit at the lightest end.",
                answer: "factories",
                hint: "Entertainment attractions..."
            },
            {
                sentence: "_______ is an example of the darkest end — a camp of genocide.",
                answer: "Auschwitz",
                hint: "Nazi camp in Poland..."
            }
        ],

        learn: {
            title: "Dark Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Umbrella term for tourism linked to <strong>death, disaster and suffering</strong> (Light, 2017).<br>
                    <strong>Thanatourism</strong> (Greek 'thanatos' = death) = the encounter with death.
                </div>

                <h4>The Ethical Tension</h4>
                <p>Where is the boundary between acceptable (education/commemoration) and unacceptable
                (sensationalism, voyeurism, schadenfreude) use of suffering? Most sites are publicly managed
                and need a careful, respectful tone.</p>

                <h4>Stone's Dark Tourism Spectrum (2006) — 7 suppliers (light → dark)</h4>
                <div class="tip-box">
                    <p>1. Dark fun factories → 2. Dark exhibitions → 3. Dark dungeons → 4. Dark resting places →
                    5. Dark shrines → 6. Dark conflict sites → 7. Dark camps of genocide</p>
                </div>

                <h4>Interpretation Matters</h4>
                <div class="example-box">
                    <p><strong>Alcatraz</strong> = entertainment/'Hollywood' image vs <strong>Robben Island</strong> =
                    educational/contemplative (Mandela). How a site is interpreted shapes the experience.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 5: HEALTH TOURISM ==========
    health: {
        name: "Health Tourism",
        icon: "fa-heart-pulse",
        color: "#e11d48",

        flashcards: [
            {
                question: "What is HEALTH TOURISM (UNWTO, 2019)?",
                answer: "Tourism which has as a PRIMARY MOTIVATION the contribution to PHYSICAL, MENTAL and/or SPIRITUAL health through MEDICAL and WELLNESS-based activities that increase individuals' capacity to satisfy their needs and function better.\n\nHealth tourism is the UMBRELLA TERM for two subtypes: WELLNESS tourism and MEDICAL tourism.",
                explanation: "Umbrella term = wellness tourism + medical tourism."
            },
            {
                question: "What is the difference between WELLNESS and MEDICAL tourism?",
                answer: "WELLNESS tourism — tourist is 'WELL' but wants to improve; PREVENTIVE, PROACTIVE, voluntary, lifestyle-enhancing (fitness, healthy eating, relaxation, pampering). More pleasurable/fun.\n\nMEDICAL tourism — tourist is usually ILL; uses EVIDENCE-BASED medical resources; mainly CURATIVE (diagnosis, treatment, cure, prevention, rehabilitation).\n\nHenderson: travel for WELLNESS (beauty spas) vs travel for ILLNESS (medical interventions).",
                explanation: "Wellness = preventive (well); medical = curative (ill)."
            },
            {
                question: "Who is the 'father' of WELLNESS, and how did he define it?",
                answer: "Halbert DUNN (1961). He described wellness as NOT merely the absence of disease, illness and stress, but the PRESENCE of:\n• Purpose in life\n• Active involvement in satisfying work and play\n• Joyful relationships\n• A healthy body and living environment\n• Happiness",
                explanation: "Dunn: wellness = the PRESENCE of positives, not just absence of illness."
            },
            {
                question: "What are the 3 sub-sets of WELLNESS tourism (UNWTO & ETC, 2018)?",
                answer: "1. HOLISTIC — a whole/global approach to healing (body, mind, emotion, spirit); complementary/alternative therapies, acupuncture, naturopathy (often at purpose-built 'retreat centres')\n2. SPIRITUAL — broader than religion; seeking higher consciousness/meaning (yoga, meditation, Tai Chi)\n3. MEDICAL WELLNESS",
                explanation: "Holistic · spiritual · medical wellness."
            },
            {
                question: "How do cultural understandings of health/wellness DIFFER by region (Smith & Puczkó)?",
                answer: "• CENTRAL/EASTERN Europe & Baltics — physical/medical therapeutic healing (medicinal waters, muds, caves)\n• SOUTHERN Europe — seaside wellness, thalassotherapy, Mediterranean diet, relaxed pace\n• SCANDINAVIA — outdoor recreation, sauna (integral to everyday wellness)\n• GERMANY/AUSTRIA/SWITZERLAND — fitness + healthy eating + spiritual (yoga, meditation)\n• ASIA — yoga, meditation, energy flows (Reiki, Shiatsu, Feng Shui) integrated into daily life",
                explanation: "Health/wellness mean different things in different cultures."
            },
            {
                question: "What is the difference between MEDICAL TOURISM and MEDICAL TRAVEL?",
                answer: "MEDICAL TOURISM — a trip for medical treatment where the patient ALSO uses the destination's TOURIST infrastructure (sightseeing, shopping, cultural activities); recreational prospects in (often exotic) locations.\n\nMEDICAL TRAVEL — travelling for the SOLE purpose of treatment; the traveller may NOT visit tourist attractions. Many authors argue 'medical travel' is the better term, as patients can only tour if well enough.",
                explanation: "Tourism (treatment + sightseeing) vs travel (treatment only)."
            },
            {
                question: "What FACTORS are shaping health tourism (UNWTO & ETC, 2018)?",
                answer: "• More LEISURE TIME + disposable income for health/wellbeing\n• Over-burdened HEALTH-CARE & insurance systems; rising long-term-care costs\n• AGEING populations\n• URBANISATION (over half the world lives in cities) → demand for escapism/natural alternatives\n• LEGAL directives (e.g. EU Directive 2011/24 on cross-border health care)\n• Global financial markets + investment; technology (m-health, wearables); data PRIVACY\n• 'Reverse movement' of health travellers (developing → developed countries)",
                explanation: "Time/income, health-system strain, ageing, urbanisation, law, tech."
            }
        ],

        quiz: [
            {
                question: "Health tourism is the umbrella term for:",
                options: [
                    "Wellness tourism and medical tourism",
                    "Dark tourism and film tourism",
                    "Sports tourism and nautical tourism",
                    "Business tourism and MICE"
                ],
                correct: 0
            },
            {
                question: "Wellness tourism is mainly:",
                options: [
                    "Curative (for the ill)",
                    "Preventive/proactive (for the well)",
                    "Only surgical",
                    "Only spiritual"
                ],
                correct: 1
            },
            {
                question: "The 'father' of the wellness concept is:",
                options: [
                    "Halbert Dunn",
                    "Joseph Pine",
                    "Philip Stone",
                    "Brent Ritchie"
                ],
                correct: 0
            },
            {
                question: "Which is a sub-set of wellness tourism?",
                options: [
                    "Holistic",
                    "Battlefield",
                    "Cruising",
                    "MICE"
                ],
                correct: 0
            },
            {
                question: "Travelling for the SOLE purpose of treatment (no sightseeing) is best called:",
                options: [
                    "Medical tourism",
                    "Medical travel",
                    "Wellness tourism",
                    "Spiritual tourism"
                ],
                correct: 1
            },
            {
                question: "Which factor is shaping the growth of health tourism?",
                options: [
                    "Falling life expectancy",
                    "Ageing populations and over-burdened health systems",
                    "Declining leisure time",
                    "Shrinking cities"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Health tourism is the umbrella term for wellness tourism and _______ tourism.",
                answer: "medical",
                hint: "The curative subtype..."
            },
            {
                sentence: "Wellness tourism is mainly preventive, while medical tourism is mainly _______.",
                answer: "curative",
                hint: "Treating illness..."
            },
            {
                sentence: "Halbert _______ is described as the father of the wellness concept.",
                answer: "Dunn",
                hint: "1961 definition..."
            },
            {
                sentence: "Travelling solely for treatment, with no sightseeing, is medical _______.",
                answer: "travel",
                hint: "Not tourism..."
            },
            {
                sentence: "Healing based on medicinal thermal water is called _______ (balneotherapy).",
                answer: "balneotherapy",
                hint: "Thermal water cures..."
            }
        ],

        learn: {
            title: "Health Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Tourism whose primary motivation is physical, mental and/or spiritual <strong>health</strong>.<br>
                    <strong>Umbrella term</strong> → WELLNESS tourism + MEDICAL tourism.
                </div>

                <h4>Wellness vs Medical</h4>
                <div class="tip-box">
                    <p><strong>Wellness</strong> — tourist is 'well', wants to improve; preventive, proactive, fun</p>
                    <p><strong>Medical</strong> — tourist is usually ill; evidence-based, curative</p>
                    <p>Dunn (1961): wellness = the <strong>presence</strong> of purpose, joy, health, happiness — not just absence of illness.</p>
                </div>

                <h4>Wellness Sub-sets (UNWTO & ETC 2018)</h4>
                <p>Holistic · Spiritual · Medical wellness. Cultural understandings differ by region
                (CEE medicinal waters · Southern Europe thalassotherapy · Scandinavia sauna · Asia yoga/energy).</p>

                <h4>Medical Tourism vs Medical Travel</h4>
                <p>Tourism = treatment + use of tourist infrastructure; Travel = treatment only.</p>

                <h4>Factors Shaping It</h4>
                <div class="example-box">
                    <p>Leisure time + income · strained health systems · ageing · urbanisation · EU cross-border
                    directive · technology (m-health, wearables) · data privacy · 'reverse movement' of travellers.</p>
                </div>
            `
        }
    },

    // ========== CATEGORY 6: FILM TOURISM ==========
    film: {
        name: "Film Tourism",
        icon: "fa-clapperboard",
        color: "#7c3aed",

        flashcards: [
            {
                question: "What is FILM TOURISM (Beeton, 2005)?",
                answer: "Visitation to SITES where movies and TV programmes have been FILMED (and set), as well as tours to production studios, including film-related theme parks.\n\nIt is tourist activity induced by viewing a MOVING IMAGE — film, TV, pre-recorded products (DVD/Blu-Ray) and now digital media.",
                explanation: "Visiting filming locations, studios and film theme parks."
            },
            {
                question: "What is the difference between FILM TOURISM and FILM-INDUCED TOURISM?",
                answer: "FILM TOURISM — visitation to a site associated with filming; the INCIDENTAL experience of tourists at film locations (they may not have been motivated by the film).\n\nFILM-INDUCED TOURISM — tourism that is INFLUENCED/MOTIVATED by film or TV; it specifically MOTIVATES people to travel to a film location.\n\n(The Eiffel Tower is 'film tourism' by definition even for visitors who never saw the films shot there.)",
                explanation: "Incidental (film tourism) vs motivated (film-induced)."
            },
            {
                question: "How are films 'PULL' factors in 'PUSH' locations?",
                answer: "In tourist motivation theory, PULL factors attract the tourist to a destination, while PUSH factors predispose a person to travel.\n\nMovies make destination attractions into PULL factors that are situated in the tourist-GENERATING ('push') location — i.e. the attraction is experienced VICARIOUSLY at home (cinema), with longer exposure than ads and no 'hard sell'.",
                explanation: "Films bring the destination's pull to the viewer's home."
            },
            {
                question: "What are Macionis's 3 types of film tourist (2004)?",
                answer: "By level of interest in film:\n1. SPECIFIC film tourist — actively seeks out places seen in film (highest interest)\n2. GENERAL film tourist — not specifically drawn to a location but joins film-tourism activities while there (moderate)\n3. SERENDIPITOUS film tourist — just happens to be at a destination portrayed in a film (lowest)\n\n(Connell & Meyer added the 'ELITE film tourist' — visiting purely to view the location, no other motive.)",
                explanation: "Specific → general → serendipitous (+ elite)."
            },
            {
                question: "Are most film-site visitors SPECIAL INTEREST film tourists?",
                answer: "NO — in short, NOT MANY. Most are casual/incidental/serendipitous.\n\nEvidence: only 0.3% deemed Lord of the Rings the MAIN reason for visiting New Zealand (+9% one of several reasons); ~one-third of LOTR-tour participants had NEVER watched the film. Visitors are mostly drawn by the LANDSCAPE/scenery the film revealed, rather than the film itself (86% cited scenery for NZ).",
                explanation: "The scenery (not the film per se) usually drives the visit."
            },
            {
                question: "What does the DUBROVNIK / GAME OF THRONES case show?",
                answer: "HBO moved King's Landing filming to Dubrovnik (from Season 1, 2011); the Croatian DMO marketed Dubrovnik as a synonym for King's Landing.\n\nResult (Tkalec et al., 2017): Game of Thrones film-induced tourism produced a ~37.9% increase in tourist arrivals, ~28.5% more overnight stays, and ~37.5% more City Walls tickets — far above the pre-GoT period. Depken et al.: ~59,000 additional overnights per year, with a STRONGER effect in the OFF-SEASON.",
                explanation: "Croatia's flagship film-induced tourism success."
            },
            {
                question: "What are the POSITIVE and NEGATIVE impacts of film tourism on a destination?",
                answer: "POSITIVE: more tourists → more revenue & employment; infrastructure improvement; product diversification; cultural exchange; can fund HERITAGE preservation (admission fees).\n\nNEGATIVE: conflict, COMMODITIZATION, loss of AUTHENTICITY, exploitation of natural/cultural environment; films can also project NEGATIVE images/stereotypes of a destination (e.g. drugs, crime). DMOs cannot control media representations.",
                explanation: "Revenue & heritage funding vs commoditization & stereotypes."
            }
        ],

        quiz: [
            {
                question: "Film tourism (Beeton) is visitation to:",
                options: [
                    "Only beaches",
                    "Sites where movies/TV have been filmed, studios and film theme parks",
                    "Only museums",
                    "Hospitals"
                ],
                correct: 1
            },
            {
                question: "Tourism specifically MOTIVATED by a film is called:",
                options: [
                    "Film tourism",
                    "Film-induced tourism",
                    "Incidental tourism",
                    "Dark tourism"
                ],
                correct: 1
            },
            {
                question: "In motivation theory, films turn a destination into a _______ factor situated in a _______ location:",
                options: [
                    "push / pull",
                    "pull / push",
                    "hard / soft",
                    "active / passive"
                ],
                correct: 1
            },
            {
                question: "Macionis's film tourist with the HIGHEST interest in film is the:",
                options: [
                    "Serendipitous",
                    "General",
                    "Specific",
                    "Casual"
                ],
                correct: 2
            },
            {
                question: "The Dubrovnik / Game of Thrones case is an example of:",
                options: [
                    "Dark tourism",
                    "Film-induced tourism",
                    "Medical tourism",
                    "Business tourism"
                ],
                correct: 1
            },
            {
                question: "A negative impact of film tourism is:",
                options: [
                    "Heritage preservation",
                    "Loss of authenticity / commoditization",
                    "Increased revenue",
                    "Job creation"
                ],
                correct: 1
            }
        ],

        fillBlanks: [
            {
                sentence: "Visiting sites where films/TV were shot is film _______.",
                answer: "tourism",
                hint: "The form of SIT..."
            },
            {
                sentence: "Tourism specifically motivated by a film is film-_______ tourism.",
                answer: "induced",
                hint: "Caused by the film..."
            },
            {
                sentence: "Films turn attractions into _______ factors experienced at home.",
                answer: "pull",
                hint: "Attracting..."
            },
            {
                sentence: "The _______ / Game of Thrones case is Croatia's famous film-induced success.",
                answer: "Dubrovnik",
                hint: "King's Landing..."
            },
            {
                sentence: "Most film-site visitors are drawn more by the _______ than the film itself.",
                answer: "scenery",
                hint: "Landscape..."
            }
        ],

        learn: {
            title: "Film Tourism",
            content: `
                <h3>Definition</h3>
                <div class="formula-box">
                    Visitation to <strong>filming sites</strong>, studios and film theme parks (Beeton, 2005) —
                    tourist activity induced by a <strong>moving image</strong> (film, TV, digital).
                </div>

                <h4>Film vs Film-induced</h4>
                <div class="tip-box">
                    <p><strong>Film tourism</strong> = incidental visitation to film sites</p>
                    <p><strong>Film-induced tourism</strong> = travel specifically motivated by the film</p>
                    <p>Films = <strong>pull</strong> factors situated in <strong>push</strong> (home) locations.</p>
                </div>

                <h4>Types of Film Tourist</h4>
                <p>Macionis: specific → general → serendipitous (+ Connell & Meyer's 'elite'). Most visitors are
                NOT special-interest film tourists — they're drawn by the <strong>scenery</strong> the film revealed.</p>

                <h4>Dubrovnik & Game of Thrones</h4>
                <div class="example-box">
                    <p>King's Landing filmed in Dubrovnik (2011) → ~37.9% more arrivals, ~37.5% more City Walls
                    tickets (Tkalec et al.); ~59,000 extra overnights/year, stronger in the OFF-season.</p>
                </div>

                <h4>Impacts</h4>
                <p><strong>+</strong> revenue, jobs, infrastructure, heritage funding · <strong>−</strong>
                commoditization, loss of authenticity, negative stereotypes (DMOs can't control media).</p>
            `
        }
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sitM2;
}

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== "undefined") { window.sitM2 = sitM2; }
