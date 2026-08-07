// ===== ACADEMIC WRITING — EXERCISES (content pack) =====
//
// CONTENT PACK (NE engine): domenski podaci za interaktivne vježbe. Engine
// (js/exercises*.js, css/exercises.css) je NEDIRNUT. Schema/tipovi: docs/architecture/EXERCISES_ENGINE.md §2.
//
// Fokus = CITIRANJE (Chicago Manual of Style) — korisnikov izričit zahtjev („jako puno na testu").
// Uz to par foundational setova (metode spoznaje, znanstvene metode, struktura rada, baze/pretraga).
// Sve činjenice verificirane protiv predavanja (prof. Bogdan, Essentials of Academic Writing).
//
// Tipovi: 'choice' (kind 'mc' = jedan točan indeks; 'tf' = bool) i 'classify' (account → cls).
// chapter = približan tjedan predavanja (engine grupira u "Chapter N", filtrira po lesson-u).
//
// ⚠ CACHE: pri izmjeni bumpaj CONTENT_VERSION u js/content-loader.js (data/* immutable).

const academicWritingExercises = {
  meta: { lang: 'en', version: 1 },
  exercises: [

    // ====================== FIRST MIDTERM (weeks 1–6) ======================

    // --- Methods of acquiring knowledge (week 2) ---
    {
      id: 'k1-knowledge-methods',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'classify',
      title: 'Methods of Acquiring Knowledge',
      prompt: 'Classify each situation by the method of acquiring knowledge it illustrates (Kerlinger’s four non-scientific methods plus empiricism).',
      difficulty: 2,
      classes: [
        { v: 'tenacity', label: 'Tenacity' },
        { v: 'intuition', label: 'Intuition' },
        { v: 'authority', label: 'Authority' },
        { v: 'rationalism', label: 'Rationalism' },
        { v: 'empiricism', label: 'Empiricism' }
      ],
      rows: [
        { entries: [{ account: 'Accepting a superstition simply because it has always been believed since childhood.', cls: 'tenacity' }] },
        { entries: [{ account: 'A famous athlete on TV tells you which sneakers to buy, and you accept it.', cls: 'authority' }] },
        { entries: [{ account: 'Drawing a conclusion from premises using the rules of logic, without new observation.', cls: 'rationalism' }] },
        { entries: [{ account: 'Answering a question by relying on a hunch or a feeling that something is right.', cls: 'intuition' }] },
        { entries: [{ account: 'Learning a fact by directly observing or measuring the world around you.', cls: 'empiricism' }] },
        { entries: [{ account: 'Believing a Nobel laureate’s claim about vitamin C purely because he is an expert.', cls: 'authority' }] }
      ],
      solution: [
        'Tenacity = accepted because “always believed”; Authority = relies on an expert/figure (method of faith is a variant).',
        'Rationalism = logical reasoning without direct evidence; Empiricism = direct sensory observation/measurement; Intuition = hunch/“feels right”.'
      ]
    },

    // --- Science & research fundamentals (week 2) ---
    {
      id: 'k1-fundamentals',
      lesson: 'first-midterm',
      chapter: 2,
      type: 'choice',
      title: 'Science & Research — Fundamentals',
      prompt: 'Choose the best answer.',
      difficulty: 1,
      items: [
        { q: 'Which method of acquiring knowledge is described as the MOST reliable?', kind: 'mc', options: ['Tenacity', 'Authority', 'The scientific method', 'Intuition'], answer: 2 },
        { q: 'Knowledge known independently of experience (e.g. most mathematical equations) is called:', kind: 'mc', options: ['A posteriori', 'A priori', 'Empirical', 'Inductive'], answer: 1 },
        { q: 'Which is one of the three core principles of the scientific method?', kind: 'mc', options: ['Science is private', 'Science is subjective', 'Science is public (replicable & open to evaluation)', 'Science is static'], answer: 2 },
        { q: 'Implicit knowledge refers to:', kind: 'mc', options: ['Practical skills such as riding a bike or swimming', 'Theoretical understanding from a manual', 'Facts memorised from a textbook', 'Knowledge known a priori'], answer: 0 },
        { q: 'Bias in research occurs when:', kind: 'mc', options: ['Results are replicated by others', 'Results are influenced by the researcher’s expectations or personal beliefs', 'Observations are systematic', 'The study is published openly'], answer: 1 }
      ],
      solution: [
        'The scientific method combines observation, measurement, verification and evaluation — the most reliable.',
        'A priori = independent of experience (deductive); a posteriori = known only through experience (inductive).',
        'Three principles: science is empirical, public, and objective.'
      ]
    },

    // --- Means & methods of scientific research (week 4) ---
    {
      id: 'k1-research-methods',
      lesson: 'first-midterm',
      chapter: 4,
      type: 'choice',
      title: 'Methods of Scientific Research',
      prompt: 'Identify the theoretical method described.',
      difficulty: 2,
      items: [
        { q: 'Decomposing a studied object into parts to identify its attributes and qualities:', kind: 'mc', options: ['Synthesis', 'Analysis', 'Generalization', 'Idealization'], answer: 1 },
        { q: 'Uniting different elements of an object into a whole system:', kind: 'mc', options: ['Analysis', 'Abstracting', 'Synthesis', 'Deduction'], answer: 2 },
        { q: 'Inference from particular observations to a general conclusion:', kind: 'mc', options: ['Deduction', 'Induction', 'Formalization', 'Concretizing'], answer: 1 },
        { q: 'Inference from the general to the particular:', kind: 'mc', options: ['Induction', 'Analogy', 'Deduction', 'Modeling'], answer: 2 },
        { q: 'A structured thought experiment used to explore a concept without performing a physical experiment:', kind: 'mc', options: ['Imagination', 'Gedanken (thought) experiment', 'Idealization', 'Synthesis'], answer: 1 },
        { q: 'Which is one of the FIVE means (not methods) of scientific research?', kind: 'mc', options: ['Analysis', 'Mathematical means', 'Deduction', 'Generalization'], answer: 1 }
      ],
      solution: [
        'Analysis decomposes; synthesis unites (they are opposite but inseparable).',
        'Induction: particular → general. Deduction: general → particular.',
        'The five means: material, informational, mathematical, logical, linguistic.'
      ]
    },

    // --- Structure of a thesis + abbreviations (week 5) ---
    {
      id: 'k1-thesis-structure',
      lesson: 'first-midterm',
      chapter: 5,
      type: 'choice',
      title: 'Thesis Structure & Abbreviations',
      prompt: 'Choose the best answer.',
      difficulty: 1,
      items: [
        { q: 'In the USA, the research report submitted for a Master’s degree is called a:', kind: 'mc', options: ['Dissertation', 'Thesis', 'Monograph', 'Treatise'], answer: 1 },
        { q: 'The IMRAD structure of the subject proper stands for:', kind: 'mc', options: ['Introduction, Methods, Results, and Discussion', 'Intro, Materials, References, and Data', 'Introduction, Motivation, Results, and Design', 'Index, Methods, Review, and Discussion'], answer: 0 },
        { q: 'An abbreviation pronounced as a single word (e.g. radar, laser, AIDS) is a(n):', kind: 'mc', options: ['Initialism', 'Acronym', 'Contraction', 'Symbol'], answer: 1 },
        { q: 'An abbreviation pronounced as separate letters (e.g. FBI, ICAR) is a(n):', kind: 'mc', options: ['Acronym', 'Initialism', 'Contraction', 'Eponym'], answer: 1 },
        { q: 'When an abbreviation is first used in a document it should be:', kind: 'mc', options: ['Left unexplained', 'Written in full, followed immediately by the abbreviated form in parentheses', 'Always written in lower case', 'Avoided entirely'], answer: 1 }
      ],
      solution: [
        'USA: Master’s → thesis, PhD → dissertation (British usage differs).',
        'Acronyms are pronounced as words (radar/laser → now common nouns); initialisms are pronounced letter-by-letter.'
      ]
    },

    // --- Bibliographic databases & search (week 5/6) ---
    {
      id: 'k1-databases-search',
      lesson: 'first-midterm',
      chapter: 6,
      type: 'choice',
      title: 'Databases & Search Techniques',
      prompt: 'Choose the best answer about databases and search strategy.',
      difficulty: 1,
      items: [
        { q: 'Which Boolean operator NARROWS a search (both terms must appear)?', kind: 'mc', options: ['OR', 'AND', 'NOT', 'NEAR'], answer: 1 },
        { q: 'Which Boolean operator WIDENS a search and captures synonyms?', kind: 'mc', options: ['AND', 'NOT', 'OR', 'AND NOT'], answer: 2 },
        { q: 'The wildcard that replaces ONE single letter (e.g. wom?n → woman/women) is:', kind: 'mc', options: ['Asterisk *', 'Question mark ?', 'Quotation marks " "', 'Brackets ( )'], answer: 1 },
        { q: 'To search for an EXACT phrase such as sustainable development you use:', kind: 'mc', options: ['Brackets ( )', 'Asterisk *', 'Quotation marks " "', 'Question mark ?'], answer: 2 },
        { q: 'The asterisk * in *manag* is used to:', kind: 'mc', options: ['Replace exactly one letter', 'Truncate — catch management, manager, manage, etc.', 'Force an exact phrase', 'Exclude a term'], answer: 1 },
        { q: 'Which is the largest scientific database (since 1997, 33,000+ journals)?', kind: 'mc', options: ['Scopus', 'Web of Science', 'Google Scholar', 'JSTOR'], answer: 1 }
      ],
      solution: [
        'AND narrows; OR widens (synonyms); NOT excludes.',
        '* = truncation (many letters / singular & plural); ? = one letter; " " = exact phrase; ( ) = group terms.',
        'Web of Science (1997) is the largest; Scopus (2004) is second-largest with more European journals.'
      ]
    },

    // ====================== SECOND MIDTERM (weeks 8–14) ======================

    // --- Types of publications (week 8) ---
    {
      id: 'k2-types-publications',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'classify',
      title: 'Primary, Secondary or Tertiary Source?',
      prompt: 'Classify each publication by where it sits in the publication cycle.',
      difficulty: 2,
      classes: [
        { v: 'P', label: 'Primary' },
        { v: 'S', label: 'Secondary' },
        { v: 'T', label: 'Tertiary' }
      ],
      rows: [
        { entries: [{ account: 'Primary research journal article (original findings)', cls: 'P' }] },
        { entries: [{ account: 'Patent', cls: 'P' }] },
        { entries: [{ account: 'Conference proceedings', cls: 'P' }] },
        { entries: [{ account: 'Textbook', cls: 'S' }] },
        { entries: [{ account: 'Handbook', cls: 'S' }] },
        { entries: [{ account: 'Review article', cls: 'S' }] },
        { entries: [{ account: 'Encyclopaedia', cls: 'T' }] },
        { entries: [{ account: 'Almanac', cls: 'T' }] },
        { entries: [{ account: 'Guide to the literature', cls: 'T' }] }
      ],
      solution: [
        'Primary = original works (journals, theses, patents, reports, proceedings).',
        'Secondary = syntheses of primary (textbooks, handbooks, monographs, reviews).',
        'Tertiary = distilled/factual, last in the cycle (encyclopaedias, almanacs, manuals, guides).'
      ]
    },
    {
      id: 'k2-publications-mc',
      lesson: 'second-midterm',
      chapter: 8,
      type: 'choice',
      title: 'Types of Publications',
      prompt: 'Choose the best answer.',
      difficulty: 1,
      items: [
        { q: 'Non-conventional, non-book literature not available through normal trade channels (theses, working papers, reports) is called:', kind: 'mc', options: ['Grey literature', 'Primary literature', 'Ephemeral literature', 'Tertiary literature'], answer: 0 },
        { q: 'In the Dewey Decimal Classification, class 300 covers:', kind: 'mc', options: ['Natural sciences & Mathematics', 'Social sciences', 'Technology', 'Philosophy & Psychology'], answer: 1 },
        { q: 'Publications relevant only for a brief period (newspapers, press releases, weather reports) are classified as:', kind: 'mc', options: ['Enduring', 'Primary', 'Ephemeral', 'Scientific'], answer: 2 },
        { q: 'Before a paper is accepted in a primary journal it goes through a rigorous quality-evaluation process called:', kind: 'mc', options: ['Indexing', 'Peer reviewing', 'Cataloguing', 'Abstracting'], answer: 1 }
      ],
      solution: [
        'Grey literature = non-traditional, non-book; DDC 300 = Social sciences, 500 = Natural sciences & Mathematics.',
        'Ephemeral = short-lived; peer review = quality check before journal publication.'
      ]
    },

    // --- Chicago: the two systems + books, authors (weeks 9–10) ---
    {
      id: 'k2-cite-systems',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Chicago — The Two Citation Systems',
      prompt: 'Choose the best answer about the Chicago Manual of Style.',
      difficulty: 1,
      items: [
        { q: 'Which Chicago system uses parentheses in the text plus a reference list?', kind: 'mc', options: ['Notes and Bibliography', 'Author-Date', 'Vancouver', 'MLA'], answer: 1 },
        { q: 'Which Chicago system uses numbered footnotes or endnotes plus a bibliography?', kind: 'mc', options: ['Author-Date', 'Notes and Bibliography', 'APA', 'Harvard'], answer: 1 },
        { q: 'The Notes and Bibliography method is preferred by authors in the field of:', kind: 'mc', options: ['Natural sciences', 'Social sciences', 'The humanities', 'Medicine'], answer: 2 },
        { q: 'In what year was the first edition of the Chicago Manual of Style published?', kind: 'mc', options: ['1886', '1906', '1916', '2003'], answer: 1 },
        { q: 'When choosing a citation style, the overriding principle is:', kind: 'mc', options: ['Combine several styles for richness', 'Consistency — do not mix styles in one paper', 'Always use the newest style', 'Use whatever the printer prefers'], answer: 1 }
      ],
      solution: [
        'Author-Date → parentheses + reference list (natural/social sciences). Notes & Bibliography → footnotes/endnotes + bibliography (humanities).',
        'CMS first edition: 1906. Key rule: be consistent; never mix styles in one paper.'
      ]
    },
    {
      id: 'k2-cite-authors',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Chicago — Author Rules',
      prompt: 'Choose the correct rule for naming authors in Chicago style.',
      difficulty: 2,
      items: [
        { q: 'In the reference list (R), a single author’s name is written as:', kind: 'mc', options: ['Firstname Surname', 'Surname, Firstname', 'Surname only', 'Initials only'], answer: 1 },
        { q: 'An in-text citation (t) begins with:', kind: 'mc', options: ['The author’s full name', 'The author’s surname only', 'The title', 'The publisher'], answer: 1 },
        { q: 'For a work with four to ten authors, the IN-TEXT citation (t) uses:', kind: 'mc', options: ['All surnames', 'First author’s surname + et al.', 'First two surnames + et al.', 'First author’s surname + and others'], answer: 1 },
        { q: 'For four to ten authors, the SHORT NOTE (n) uses:', kind: 'mc', options: ['First surname + et al.', 'First surname + and others', 'All full names', 'Surname only'], answer: 1 },
        { q: 'For a work with 11 or more authors, the reference list (R) lists:', kind: 'mc', options: ['All authors', 'The first 3, then et al.', 'The first 7, then et al.', 'Only the first author'], answer: 2 },
        { q: 'A second work by the same author in the bibliography is shown by replacing the name with:', kind: 'mc', options: ['Ditto marks', 'Three connected em-dashes (———) and a period', 'Ibid.', 'The word Idem'], answer: 1 },
        { q: 'When the author is unknown, the entry uses:', kind: 'mc', options: ['N.A.', 'Anon. / Anonymous', 'Various', 'The publisher’s name'], answer: 1 }
      ],
      solution: [
        'R/B begin with Surname, Firstname; t/n begin with surname only.',
        '4–10 authors: in-text → first surname + “et al.”; short note → first surname + “and others”. 11+ → first 7 + et al. in R.',
        'Repeated author → three em-dashes (———). Unknown author → Anon.'
      ]
    },

    // --- Chicago: identify the correct format / classify t-R-n-B (week 10) ---
    {
      id: 'k2-cite-trnb',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'classify',
      title: 'Identify the Citation Element (t / R / n / B)',
      prompt: 'For the book Dawkins & Kinloch, "African American Golfers During the Jim Crow Era" (Westport, CT: Praeger, 2000), classify each line by which element it is.',
      difficulty: 3,
      classes: [
        { v: 't', label: 'In-text citation (t)' },
        { v: 'R', label: 'Reference (author-date) (R)' },
        { v: 'n', label: 'Short note (n)' },
        { v: 'B', label: 'Bibliography (B)' }
      ],
      rows: [
        { entries: [{ account: '(Dawkins and Kinloch 2000, 97)', cls: 't' }] },
        { entries: [{ account: 'Dawkins, Marvin P., and Graham C. Kinloch. 2000. African American Golfers During the Jim Crow Era. Westport, CT: Praeger.', cls: 'R' }] },
        { entries: [{ account: '1 Dawkins and Kinloch, African American Golfers During the Jim Crow Era, 97.', cls: 'n' }] },
        { entries: [{ account: 'Dawkins, Marvin P., and Graham C. Kinloch. African American Golfers During the Jim Crow Era. Westport, CT: Praeger, 2000.', cls: 'B' }] }
      ],
      solution: [
        't = parenthetical (Surname Year, page). R = author-date reference: Surname, First. Year. Title. Place: Publisher.',
        'n = short footnote: ¹ Surname, Short Title, page. B = bibliography: Surname, First. Title. Place: Publisher, Year.'
      ]
    },
    {
      id: 'k2-cite-format',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'choice',
      title: 'Chicago — Pick the Correct Format',
      prompt: 'Choose the correctly formatted Chicago citation.',
      difficulty: 2,
      items: [
        { q: 'Author-date in-text citation for Smith (2010), page 12:', kind: 'mc', options: ['(Smith, 2010, p.12)', '(Smith 2010, 12)', 'Smith 2010: 12', '[Smith 2010] 12'], answer: 1 },
        { q: 'Two books by the same author published in the same year are distinguished as:', kind: 'mc', options: ['(Smith 2010-1) / (Smith 2010-2)', '(Smith 2010a) / (Smith 2010b)', '(Smith 2010.1) / (Smith 2010.2)', '(Smith I) / (Smith II)'], answer: 1 },
        { q: 'A book title in the bibliography is written in:', kind: 'mc', options: ['Quotation marks', 'Italics', 'Bold', 'ALL CAPS'], answer: 1 },
        { q: 'In the author-date system with no known publication date, you write:', kind: 'mc', options: ['n.p.', 'n.d.', 'forthcoming only', 'TBD'], answer: 1 }
      ],
      solution: [
        'Author-date in-text = (Surname Year, page) with no comma after the surname and no “p.”.',
        'Same author + same year → add a, b after the year. Book titles are italicised. No date → n.d.'
      ]
    },

    // --- Chicago: journals & other sources (weeks 11–12) ---
    {
      id: 'k2-cite-journal',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'choice',
      title: 'Chicago — Citing Journals',
      prompt: 'Choose the correct rule for citing journal articles.',
      difficulty: 2,
      items: [
        { q: 'The NAME of the journal is formatted in:', kind: 'mc', options: ['Quotation marks', 'Italics', 'Bold', 'Plain, no formatting'], answer: 1 },
        { q: 'In notes and bibliography, the article’s title and subtitle are given in:', kind: 'mc', options: ['Italics', 'Quotation marks', 'Bold', 'Square brackets'], answer: 1 },
        { q: 'In the reference list (R), the article title is:', kind: 'mc', options: ['In quotation marks', 'Not placed in quotation marks', 'In italics', 'In square brackets'], answer: 1 },
        { q: 'The issue number of a journal is preceded by the abbreviation:', kind: 'mc', options: ['vol.', 'iss.', 'no.', 'ed.'], answer: 2 },
        { q: 'For an article accepted but not yet published you indicate:', kind: 'mc', options: ['in press', 'forthcoming', 'n.d.', 'reprint'], answer: 1 },
        { q: 'The volume number follows the journal name with:', kind: 'mc', options: ['A comma before it', 'A colon before it', 'No punctuation mark before it', 'A semicolon before it'], answer: 2 }
      ],
      solution: [
        'Journal name = italics. Article title = quotation marks in notes/bibliography, but NOT in the author-date reference list.',
        'Issue number → preceded by “no.”. Forthcoming = accepted not yet published. Volume number has no punctuation before it.'
      ]
    },
    {
      id: 'k2-cite-other',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'choice',
      title: 'Chicago — Other Sources',
      prompt: 'Choose the best answer for citing other source types.',
      difficulty: 2,
      items: [
        { q: 'A doctoral dissertation is abbreviated in the citation as:', kind: 'mc', options: ['Diss. Doc.', 'PhD diss.', 'D.Phil.', 'Doc. thesis'], answer: 1 },
        { q: 'Recognised encyclopedias and dictionaries are cited:', kind: 'mc', options: ['In the reference list only', 'Only as abbreviated citations in the notes, not in the bibliography', 'In both notes and bibliography', 'Never cited'], answer: 1 },
        { q: 'The Latin abbreviation s.v. used for encyclopedia/dictionary entries means:', kind: 'mc', options: ['See volume', 'Sub verbo — “under the word/title”', 'Special version', 'Source verified'], answer: 1 },
        { q: 'For a newspaper article it is best to:', kind: 'mc', options: ['Always include page numbers', 'Omit page numbers (editions move articles)', 'Omit the date', 'Omit the author'], answer: 1 },
        { q: 'An online source with no page number uses, instead of a page:', kind: 'mc', options: ['A random number', 'A descriptive locator (e.g. under "The Science")', 'The word "online"', 'Nothing at all'], answer: 1 },
        { q: 'When citing PowerPoint slides in the bibliography you should:', kind: 'mc', options: ['Treat them as a journal', 'Note that they are PowerPoint slides and add the URL', 'Omit them entirely', 'Cite them as a book'], answer: 1 }
      ],
      solution: [
        'PhD diss. for dissertations; encyclopedias/dictionaries appear only in notes (s.v. = sub verbo), not the bibliography.',
        'Newspapers → omit page numbers; no-page online sources → descriptive locator; PowerPoint → note the type + URL.'
      ]
    },

    // --- WRITE the citation: books (free text, smart-tolerant grading) ---
    {
      id: 'k2-write-books',
      lesson: 'second-midterm',
      chapter: 9,
      type: 'cite',
      title: 'Write the Citation — Books (author-date)',
      prompt: 'Write the Chicago AUTHOR-DATE reference-list entry (R) for each book. Order: Surname, First. Year. Title. Place: Publisher. (Don’t worry about italics — type the title normally. Capitalisation/spacing/quotes are forgiven, but commas, periods and colons must be right.)',
      difficulty: 3,
      items: [
        {
          given: 'Author: William H. Rehnquist · Book: The Supreme Court: A History · Place: New York · Publisher: Knopf · Year: 2001',
          answer: 'Rehnquist, William H. 2001. The Supreme Court: A History. New York: Knopf.',
          hint: 'Single author. Year comes right after the name; place and publisher are separated by a colon.'
        },
        {
          given: 'Authors: Marvin P. Dawkins and Graham C. Kinloch · Book: African American Golfers During the Jim Crow Era · Place: Westport, CT · Publisher: Praeger · Year: 2000',
          answer: 'Dawkins, Marvin P., and Graham C. Kinloch. 2000. African American Golfers During the Jim Crow Era. Westport, CT: Praeger.',
          hint: 'Two authors: only the FIRST is inverted (Surname, First); the second stays First Last, joined with “and”.'
        },
        {
          given: 'Same book (Dawkins & Kinloch, 2000) — write the IN-TEXT citation for a quote on page 97.',
          answer: '(Dawkins and Kinloch 2000, 97)',
          accept: ['(Dawkins and Kinloch 2000, 97).'],
          hint: 'In-text = (Surnames Year, page). No comma after the surnames; no “p.”.'
        }
      ],
      solution: [
        'R = Surname, First. Year. Title. Place: Publisher.  (e.g. Rehnquist, William H. 2001. The Supreme Court: A History. New York: Knopf.)',
        'Only the first author is inverted; in-text is (Surname Year, page).'
      ]
    },

    // --- WRITE the citation: journals & other sources (free text) ---
    {
      id: 'k2-write-journals',
      lesson: 'second-midterm',
      chapter: 11,
      type: 'cite',
      title: 'Write the Citation — Journals & Other Sources (author-date)',
      prompt: 'Write the Chicago AUTHOR-DATE entry (R) for each source. Capitalisation, spacing, straight/curly quotes and hyphen vs dash are forgiven — but commas, periods, colons and order must be correct.',
      difficulty: 3,
      items: [
        {
          given: 'Author: Daniel A. Dombrowski · Article: Objective Morality and Perfect Being Theology: Three Views · Journal: American Journal of Theology and Philosophy · Volume: 29 · Issue: 2 · Year: 2008 · Pages: 205–221',
          answer: 'Dombrowski, Daniel A. 2008. Objective Morality and Perfect Being Theology: Three Views. American Journal of Theology and Philosophy 29 (2): 205-221.',
          hint: 'Journal R: … Journal Name Volume (Issue): pages.  The volume has no punctuation before it; the issue is in parentheses, then a colon and the page range.'
        },
        {
          given: 'Same article (Dombrowski 2008) — write the IN-TEXT citation for page 210.',
          answer: '(Dombrowski 2008, 210)',
          accept: ['(Dombrowski 2008, 210).'],
          hint: 'In-text = (Surname Year, page).'
        },
        {
          given: 'Author: Charles Mandel · Article: Ocean expedition reveals bizarre creatures of the deep · Newspaper: Calgary Herald · Date: August 1 · Year: 2007',
          answer: 'Mandel, Charles. 2007. Ocean expedition reveals bizarre creatures of the deep, Calgary Herald, August 1.',
          hint: 'Newspaper: after the year and article title, a comma leads into the paper name and date. Omit page numbers.'
        },
        {
          given: 'PhD dissertation · Author: Richard E. Remedios · Title: Defining my Process: My Journey Through the MFA Acting Program at the University of South Carolina · University: University of South Carolina, Columbia · Year: 2007',
          answer: 'Remedios, Richard E. 2007. Defining my Process: My Journey Through the MFA Acting Program at the University of South Carolina. PhD diss., University of South Carolina, Columbia.',
          hint: 'An unpublished dissertation uses the abbreviation “PhD diss.,” before the university and city.'
        }
      ],
      solution: [
        'Journal R: Surname, First. Year. Article Title. Journal Name Volume (Issue): pages.',
        'Newspaper R omits page numbers; a dissertation uses “PhD diss., University, City.”.'
      ]
    },

    // --- Ethics & Latin abbreviations (week 14) ---
    {
      id: 'k2-latin-abbrev',
      lesson: 'second-midterm',
      chapter: 14,
      type: 'classify',
      title: 'Latin Abbreviations — Match the Meaning',
      prompt: 'Match each Latin abbreviation used in academic writing to its meaning.',
      difficulty: 2,
      classes: [
        { v: 'same', label: 'In the same work (just cited)' },
        { v: 'workcited', label: 'In the work cited (earlier)' },
        { v: 'placecited', label: 'In the place cited (same page)' },
        { v: 'thatis', label: 'That is' },
        { v: 'forexample', label: 'For example' },
        { v: 'namely', label: 'Namely' },
        { v: 'compare', label: 'Compare' }
      ],
      rows: [
        { entries: [{ account: 'ibid.', cls: 'same' }] },
        { entries: [{ account: 'op. cit.', cls: 'workcited' }] },
        { entries: [{ account: 'loc. cit.', cls: 'placecited' }] },
        { entries: [{ account: 'i.e. (id est)', cls: 'thatis' }] },
        { entries: [{ account: 'e.g. (exempli gratia)', cls: 'forexample' }] },
        { entries: [{ account: 'viz.', cls: 'namely' }] },
        { entries: [{ account: 'cf.', cls: 'compare' }] }
      ],
      solution: [
        'ibid. = same work as immediately preceding; op. cit. = in the work cited earlier; loc. cit. = in the place (same page) cited.',
        'i.e. = that is; e.g. = for example; viz. = namely; cf. = compare. In technical writing the English equivalents are increasingly preferred.'
      ]
    },
    {
      id: 'k2-ethics',
      lesson: 'second-midterm',
      chapter: 14,
      type: 'choice',
      title: 'Research Ethics & Plagiarism',
      prompt: 'Mark each statement true or false.',
      difficulty: 1,
      items: [
        { q: 'Research ethics apply basic ethical principles to scientific research.', kind: 'tf', answer: true },
        { q: 'Fraudulent authorship and duplication of papers are forms of research misconduct.', kind: 'tf', answer: true },
        { q: 'Repeatability means that, run again the same way, a study should yield the same results.', kind: 'tf', answer: true },
        { q: 'It is acceptable to combine the principles of different citation styles within the same paper.', kind: 'tf', answer: false },
        { q: 'Refereeing (peer review) normally preserves anonymity and confidentiality.', kind: 'tf', answer: true },
        { q: 'Writing "and etc." is correct usage.', kind: 'tf', answer: false }
      ],
      solution: [
        'Misconduct includes fraudulent authorship, paper duplication, and manipulation of research.',
        'Be consistent — never mix citation styles. “and etc.” is incorrect (the “and” is redundant).'
      ]
    }

  ]
};

if (typeof window !== 'undefined') window.academicWritingExercises = academicWritingExercises;
if (typeof module !== 'undefined' && module.exports) module.exports = academicWritingExercises;
