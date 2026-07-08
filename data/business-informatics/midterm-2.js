// ===== Business Informatics — Midterm 2 (Chapters 7–11) =====
// Izvor: profesorske prezentacije (Tomislav Car, FMTU Opatija, 2024/25).
// Oblik po docs/content/CONTENT_SCHEMA.md. Pokreni `npm run verify` nakon izmjena.

const businessInformaticsM2 = {
  // ---- Chapter 7: E-Business (U7) ----
  eBusiness: {
    name: 'E-Business',
    icon: 'fa-cart-shopping',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is e-business?',
        answer: 'The use of the Web, Internet, intranets or extranets to conduct business. It goes beyond simple online buying/selling to include wider business processes such as supply chain management, electronic order processing and customer relationship management (CRM).',
        explanation: 'E-business runs the whole business electronically, not just sales.'
      },
      {
        question: 'How does e-business differ from e-commerce?',
        answer: 'E-commerce is the trading activity (buying and selling) carried out through electronic devices. E-business is broader — running the entire business through the internet (including SCM, CRM, ERP, order processing).',
        explanation: 'E-commerce ⊂ e-business.'
      },
      {
        question: 'What are the main components/areas of e-business?',
        answer: 'Key areas: E-Procurement, Online Stores, Online Marketplace, Online Communities, Online Companies.\n(Plus BI, CRM, ERP, SCM, collaboration and electronic transactions.)',
        explanation: 'These cover sourcing, selling, connecting and cooperating online.'
      },
      {
        question: 'What is e-procurement?',
        answer: 'Also called "supplier exchange" — sourcing products or services electronically (B2B, B2G, B2C) to reduce a company’s costs and effort.',
        explanation: 'Buying side of e-business.'
      },
      {
        question: 'What is the difference between an online store and an online marketplace?',
        answer: 'An online store (e-shop, web-store, m-commerce) sells its OWN products/services via a website or app. An online marketplace connects buyers and suppliers — the operator only presents other people’s inventory and provides the transaction facility.',
        explanation: 'Store = own goods; marketplace = others’ goods.'
      },
      {
        question: 'What are online communities in e-business?',
        answer: 'Groups of people with the same interests or purposes who use the internet to communicate, helping individuals and organizations make transaction decisions.',
        explanation: 'Communities influence buying decisions.'
      },
      {
        question: 'Who are the three market participants in e-business?',
        answer: 'Business (B), Consumer/citizen (C) and Administration (A). Each can be a buyer or a provider, giving 9 possible relationship combinations.',
        explanation: 'B, C and A combine into models like B2C, B2B, etc.'
      },
      {
        question: 'Which relationships belong to e-commerce vs e-government?',
        answer: 'B2C and B2B belong to e-commerce. A2B (administration-to-business) and A2A (administration-to-administration) belong to e-government — both are part of e-business.',
        explanation: 'E-government is the public-administration side of e-business.'
      }
    ],

    quiz: [
      { question: 'E-business is best described as:', options: ['Only buying and selling online', 'Using the Web/Internet to conduct the whole business', 'A type of network', 'A web browser'], correct: 1 },
      { question: 'Which goes BEYOND e-commerce to include SCM, CRM and order processing?', options: ['E-commerce', 'E-business', 'E-mail', 'E-procurement'], correct: 1 },
      { question: 'Sourcing products/services electronically to cut costs is called:', options: ['Online store', 'E-procurement', 'Online community', 'B2C'], correct: 1 },
      { question: 'The three market participants in e-business are:', options: ['Buyer, Seller, Bank', 'Business, Consumer, Administration', 'Client, Server, Router', 'B2B, B2C, C2C'], correct: 1 },
      { question: 'B2C and B2B belong to ___, while A2B and A2A belong to e-government:', options: ['E-procurement', 'E-commerce', 'E-mail', 'E-learning'], correct: 1 }
    ],

    fillBlanks: [
      { sentence: '_______ is the use of the Web and Internet to run the whole business, beyond simple buying and selling.', answer: 'e-business', hint: 'Broader than e-commerce.' },
      { sentence: '_______ means sourcing products or services electronically to reduce costs.', answer: 'e-procurement', hint: 'Supplier exchange.' },
      { sentence: 'An online _______ connects buyers and suppliers, presenting other people’s inventory.', answer: 'marketplace', hint: 'Not a single store.' },
      { sentence: 'The three e-business participants are Business, Consumer and _______.', answer: 'administration', hint: 'The "A" in the models.' }
    ],

    learn: {
      content: `
        <h3>E-Business</h3>
        <p><strong>E-business</strong> is the use of the Web, Internet, intranets and extranets to
        conduct business. Unlike <strong>e-commerce</strong> (just buying/selling online), it covers the
        whole business: supply chain management, order processing, CRM and more.</p>
        <h4>Main components</h4>
        <ul>
          <li><strong>E-Procurement</strong> — sourcing goods/services electronically to cut costs.</li>
          <li><strong>Online Store</strong> — sells its own products (e-shop, m-commerce).</li>
          <li><strong>Online Marketplace</strong> — connects buyers &amp; suppliers (others’ inventory).</li>
          <li><strong>Online Communities</strong> — interest groups that shape transaction decisions.</li>
          <li><strong>Online Companies</strong> — companies cooperating as a virtual business.</li>
        </ul>
        <h4>Market participants</h4>
        <p><strong>Business (B)</strong>, <strong>Consumer (C)</strong>, <strong>Administration (A)</strong>
        — 9 combinations. B2C &amp; B2B = e-commerce; A2B &amp; A2A = e-government.</p>
      `,
      image: null
    }
  },

  // ---- Chapter 8: IT trends & innovations in modern business (U8) ----
  itTrends: {
    name: 'IT Trends & Innovations',
    icon: 'fa-robot',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is digital transformation?',
        answer: 'A change in the way an organization operates — its systems, processes, workflow and culture. It brings data together across areas and uses automation and AI/ML to connect the customer journey.',
        explanation: '"Digital or die" — it affects every level of the organization.'
      },
      {
        question: 'Name the key digital technologies driving modern business.',
        answer: '• Mobile technology (AR/VR)\n• Cloud computing\n• Social media\n• Big Data & real-time analytics\n• Sensors & IoT (Internet of Things)\n• Artificial Intelligence (AI)',
        explanation: 'These technologies enable digital transformation.'
      },
      {
        question: 'What is the difference between ANI and AGI?',
        answer: 'ANI (narrow AI) is programmed for a single task and is what is available today (e.g. Siri, Google Translate). AGI (general AI) can perform as well as or better than humans across a wide range of cognitive tasks.',
        explanation: 'Today’s AI is narrow (ANI); AGI is still aspirational.'
      },
      {
        question: 'How is recognition technology used in hotels?',
        answer: 'Retina and fingerprint scanning to unlock hotel rooms (no key card to lose). In future, facial biometrics could automatically authorise payments or check guests out, reducing queues.',
        explanation: 'Improves guest experience and security.'
      },
      {
        question: 'How are robots used in tourism and travel?',
        answer: 'To perform intelligent tasks — from customer service to data processing. Example: the Amadeus 1A-TA robot (powered by deep learning) acts as a digital assistant, analysing preferences and recommending destinations.',
        explanation: 'Robots augment staff and personalise service.'
      },
      {
        question: 'What is mobile integration in hospitality?',
        answer: 'Using a hotel app for room bookings, restaurant/spa reservations and room service; beacon technology to send location-based promotions; and combining with IoT so guests control room appliances from their phone.',
        explanation: 'The phone becomes the guest’s control centre.'
      },
      {
        question: 'What is the Internet of Things (IoT)?',
        answer: 'A network of sensors and connected devices. In hotels it lets guests control room appliances and enables data collection, often combined with mobile apps.',
        explanation: 'Physical devices connected to the internet.'
      },
      {
        question: 'Why is digital transformation important ("digital or die")?',
        answer: 'It lets companies operate more effectively, connect the customer journey across data, and stay competitive — affecting every level of the organization.',
        explanation: 'Falling behind digitally threatens the business.'
      }
    ],

    quiz: [
      { question: 'Digital transformation changes an organization’s:', options: ['Only its logo', 'Systems, processes, workflow and culture', 'Only its hardware', 'Nothing'], correct: 1 },
      { question: 'Narrow AI designed for a single task (e.g. Siri) is called:', options: ['AGI', 'ANI', 'IoT', 'AR'], correct: 1 },
      { question: 'Which AI can perform across a wide range of cognitive tasks like a human?', options: ['ANI', 'AGI', 'DNS', 'CRM'], correct: 1 },
      { question: 'Retina and fingerprint scanning to unlock hotel rooms is an example of:', options: ['Robots', 'Recognition technology', 'Cloud computing', 'FTP'], correct: 1 },
      { question: 'Letting guests control room appliances from their phone uses:', options: ['IoT', 'FTP', 'BIOS', 'LAN'], correct: 0 }
    ],

    fillBlanks: [
      { sentence: '_______ transformation changes an organization’s systems, processes, workflow and culture.', answer: 'digital', hint: '"___ or die".' },
      { sentence: '_______ (narrow AI) is designed for a single task, like Siri or Google Translate.', answer: 'ANI', hint: 'Artificial Narrow Intelligence.' },
      { sentence: '_______ technology uses retina or fingerprint scanning to unlock hotel rooms.', answer: 'recognition', hint: 'Biometrics.' },
      { sentence: 'The Internet of _______ (IoT) lets guests control room appliances from their phone.', answer: 'things', hint: 'Connected devices.' }
    ],

    learn: {
      content: `
        <h3>IT Trends &amp; Innovations in Modern Business</h3>
        <p><strong>Digital transformation</strong> changes how an organization operates — systems,
        processes, workflow and culture — bringing data together and using automation + AI/ML to connect
        the customer journey ("digital or die").</p>
        <h4>Key digital technologies</h4>
        <p>Mobile (AR/VR), Cloud computing, Social media, Big Data &amp; analytics, Sensors &amp; IoT,
        and Artificial Intelligence.</p>
        <h4>AI: ANI vs AGI</h4>
        <p><strong>ANI</strong> (narrow) does a single task (Siri, Google Translate). <strong>AGI</strong>
        (general) could match or beat humans across many cognitive tasks.</p>
        <h4>Trends in tourism &amp; travel</h4>
        <ul>
          <li><strong>Recognition technology</strong> — retina/fingerprint to unlock rooms; facial biometrics for payments/check-out.</li>
          <li><strong>Robots</strong> — customer service &amp; data processing (e.g. Amadeus 1A-TA digital assistant).</li>
          <li><strong>Mobile integration + IoT</strong> — app bookings, beacons, and controlling room appliances from a phone.</li>
        </ul>
      `,
      image: null
    }
  },

  // ---- Chapter 9: Management Support Systems (U9) ----
  managementSupport: {
    name: 'Management Support Systems',
    icon: 'fa-chart-line',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What are the three types of decisions in an organization?',
        answer: '• Structured — well-defined standard procedure, can be automated ("programmable tasks")\n• Semistructured — has a structured aspect that benefits from analytical models and IS technology\n• Unstructured — one-time, no standard procedure; relies on the decision maker’s intuition (IT offers less support)',
        explanation: 'Semistructured & unstructured involve multiple, often conflicting criteria.'
      },
      {
        question: 'What is a Management Support System (MSS)?',
        answer: 'Different types of information systems developed to support certain aspects and types of decisions — each designed with unique goals and objectives.',
        explanation: 'MSS = umbrella for decision-supporting systems.'
      },
      {
        question: 'What are the four phases of decision making?',
        answer: '1. Intelligence — scan the environment, collect & process data\n2. Design — define criteria and generate alternatives\n3. Choice — select the best feasible alternative\n4. Implementation — carry out the choice and assess performance',
        explanation: 'Intelligence → Design → Choice → Implementation.'
      },
      {
        question: 'What happens in the Intelligence phase?',
        answer: 'The decision maker examines the organization’s environment for conditions that need decisions; data is collected from various sources and processed to discover ways to approach the problem.',
        explanation: 'Finding the problem.'
      },
      {
        question: 'What happens in the Design phase (and does IT support it)?',
        answer: 'Defines criteria, generates alternatives and the associations between criteria and alternatives. Information technology does NOT support this phase.',
        explanation: 'Creative phase — least IT support.'
      },
      {
        question: 'What is a Decision Support System (DSS)?',
        answer: 'A system that helps sort through possible solutions to choose the best one for the organization; it includes tools for calculating cost-benefit ratios and does follow-up assessment of how a solution performs.',
        explanation: 'Supports the Choice and Implementation phases.'
      },
      {
        question: 'Give a hospitality example of the decision-making phases (Marriott).',
        answer: 'Intelligence: analyse guest feedback/market trends (reviews, surveys, social media). Design: develop initiatives (e.g. "Serve 360" sustainability, digital keys). Choice: evaluate costs/benefits/ROI (global vs per-hotel strategy). Implementation: roll out and assess.',
        explanation: 'Each phase maps to a real management action.'
      }
    ],

    quiz: [
      { question: 'A decision with a well-defined procedure that can be automated is:', options: ['Structured', 'Semistructured', 'Unstructured', 'Intuitive'], correct: 0 },
      { question: 'A one-time decision with no standard procedure, relying on intuition, is:', options: ['Structured', 'Semistructured', 'Unstructured', 'Programmable'], correct: 2 },
      { question: 'The four phases of decision making are Intelligence, Design, Choice and:', options: ['Implementation', 'Evaluation', 'Coding', 'Storage'], correct: 0 },
      { question: 'Which system helps managers choose the best solution and calculate cost-benefit ratios?', options: ['DSS', 'NIC', 'BIOS', 'LAN'], correct: 0 },
      { question: 'In which phase does the decision maker scan the environment and collect data?', options: ['Intelligence', 'Design', 'Choice', 'Implementation'], correct: 0 }
    ],

    fillBlanks: [
      { sentence: 'A _______ decision has a well-defined procedure and can be automated.', answer: 'structured', hint: 'Programmable.' },
      { sentence: 'A _______ decision is one-time with no standard procedure and relies on intuition.', answer: 'unstructured', hint: 'Opposite of structured.' },
      { sentence: 'A Decision _______ System (DSS) helps choose the best solution using cost-benefit tools.', answer: 'support', hint: 'The middle word of DSS.' },
      { sentence: 'The four decision phases are Intelligence, Design, _______ and Implementation.', answer: 'choice', hint: 'Selecting the best option.' }
    ],

    learn: {
      content: `
        <h3>Management Support Systems</h3>
        <h4>Types of decisions</h4>
        <ul>
          <li><strong>Structured</strong> — clear procedure, can be automated.</li>
          <li><strong>Semistructured</strong> — partly structured; benefits from analytical models.</li>
          <li><strong>Unstructured</strong> — one-time, no procedure; relies on intuition.</li>
        </ul>
        <h4>Four phases of decision making</h4>
        <p><strong>Intelligence</strong> (find the problem, gather data) → <strong>Design</strong>
        (criteria + alternatives; IT does not support this) → <strong>Choice</strong> (pick the best;
        a <strong>DSS</strong> helps with cost-benefit) → <strong>Implementation</strong> (carry out + assess).</p>
        <div class="tip-box"><strong>DSS</strong> = Decision Support System: sorts solutions and computes cost-benefit ratios.</div>
      `,
      image: null
    }
  },

  // ---- Chapter 10: Knowledge-Based & Expert Systems (U10) ----
  expertSystems: {
    name: 'Knowledge-Based & Expert Systems',
    icon: 'fa-brain',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is an expert system?',
        answer: 'A computer system that emulates (acts in all respects with) the decision-making capabilities of a human expert (Prof. Edward Feigenbaum, Stanford).',
        explanation: 'A branch of artificial intelligence.'
      },
      {
        question: 'What are the two main components of an expert system?',
        answer: '• Knowledge base — facts obtained from books, magazines, knowledgeable persons, etc.\n• Inference engine — draws conclusions from the knowledge base',
        explanation: 'Knowledge base = what it knows; inference engine = how it reasons.'
      },
      {
        question: 'What does the inference engine do?',
        answer: 'It draws conclusions from the knowledge base — applying the stored knowledge to reach decisions.',
        explanation: 'The reasoning part of the system.'
      },
      {
        question: 'What is the difference between problem domain and knowledge domain?',
        answer: 'An expert’s knowledge is specific to one problem domain (medicine, finance, engineering…). The knowledge about solving specific problems is the knowledge domain. The problem domain is always a superset of the knowledge domain.',
        explanation: 'Knowledge domain ⊂ problem domain.'
      },
      {
        question: 'What are the advantages of expert systems?',
        answer: '• Increased availability\n• Reduced cost\n• Reduced danger\n• Performance\n• Multiple expertise\n• Increased reliability',
        explanation: 'They make expert knowledge widely and cheaply available.'
      },
      {
        question: 'What technology may an expert system include?',
        answer: 'Special expert-system languages (e.g. CLIPS), programs, and hardware designed to facilitate their implementation.',
        explanation: 'CLIPS is a classic expert-system language.'
      }
    ],

    quiz: [
      { question: 'An expert system is a computer system that:', options: ['Stores files', 'Emulates the decision-making of a human expert', 'Connects networks', 'Sends email'], correct: 1 },
      { question: 'The two main components of an expert system are the knowledge base and the:', options: ['CPU', 'Inference engine', 'Firewall', 'Browser'], correct: 1 },
      { question: 'The part that draws conclusions from the knowledge base is the:', options: ['Knowledge base', 'Inference engine', 'Hard drive', 'NIC'], correct: 1 },
      { question: 'An expert’s knowledge about solving specific problems is called the:', options: ['Problem domain', 'Knowledge domain', 'Data domain', 'Public domain'], correct: 1 },
      { question: 'Which is an advantage of expert systems?', options: ['Increased danger', 'Reduced cost', 'Single expertise', 'Lower reliability'], correct: 1 }
    ],

    fillBlanks: [
      { sentence: 'An expert system emulates the decision-making capabilities of a human _______.', answer: 'expert', hint: 'The system "acts like" this person.' },
      { sentence: 'The _______ engine draws conclusions from the knowledge base.', answer: 'inference', hint: 'The reasoning part.' },
      { sentence: 'An expert system stores facts in its knowledge _______.', answer: 'base', hint: 'Knowledge ____.' },
      { sentence: 'The problem domain is always a _______ of the knowledge domain.', answer: 'superset', hint: 'The bigger set.' }
    ],

    learn: {
      content: `
        <h3>Knowledge-Based &amp; Expert Systems</h3>
        <p>An <strong>expert system</strong> is a computer system that emulates the decision-making
        capabilities of a human expert (Edward Feigenbaum). It is a branch of artificial intelligence.</p>
        <h4>Main components</h4>
        <ul>
          <li><strong>Knowledge base</strong> — facts from books, experts, etc.</li>
          <li><strong>Inference engine</strong> — draws conclusions from the knowledge base.</li>
        </ul>
        <h4>Domains &amp; advantages</h4>
        <p>An expert’s knowledge is specific to one <strong>problem domain</strong> (medicine, finance…);
        the <strong>knowledge domain</strong> is a subset of it. Advantages: increased availability,
        reduced cost, reduced danger, performance, multiple expertise, increased reliability.</p>
      `,
      image: null
    }
  },

  // ---- Chapter 11: Information Systems Security (U11) ----
  security: {
    name: 'Information Systems Security',
    icon: 'fa-shield-halved',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is information systems security?',
        answer: 'The protection of information systems against unauthorized access to or modification of information (in storage, processing or transit), and against denial of service to authorized users — including measures to detect, document and counter such threats. (NIST)',
        explanation: 'Protects confidentiality, integrity and availability.'
      },
      {
        question: 'What is malware?',
        answer: 'Malicious software — any program or code created to harm a computer, network or server. It is the most common type of cyberattack and includes ransomware, trojans, spyware, viruses, worms, keyloggers, bots and cryptojacking.',
        explanation: 'Umbrella term for malicious code.'
      },
      {
        question: 'What is ransomware?',
        answer: 'Malware that denies legitimate users access to their system and demands a payment (ransom) — often in untraceable cryptocurrency. It blocks the hard drive or encrypts files; victims may not regain access even after paying.',
        explanation: 'Exploits vulnerabilities to lock/encrypt data.'
      },
      {
        question: 'What is a DoS / DDoS attack?',
        answer: 'A Denial-of-Service attack floods a network with false requests to disrupt business operations, so users cannot perform routine tasks (email, websites, accounts). It costs time, money and resources to restore operations.',
        explanation: 'Goal is disruption, not usually data theft.'
      },
      {
        question: 'What is phishing?',
        answer: 'A cyberattack that uses email, SMS, phone, social media and social-engineering techniques to entice a victim into sharing sensitive information such as passwords or account numbers.',
        explanation: 'Relies on tricking the human, not the machine.'
      },
      {
        question: 'How can an organization protect against cyber attacks?',
        answer: '• Train staff\n• Keep software and systems up to date\n• Ensure endpoint protection\n• Install a firewall\n• Back up data\n• Control access to systems\n• Secure the Wi-Fi',
        explanation: 'Layered defence: people + technology + process.'
      }
    ],

    quiz: [
      { question: 'Information systems security protects against unauthorized access, modification and:', options: ['Marketing', 'Denial of service to authorized users', 'Data entry', 'Software updates'], correct: 1 },
      { question: 'Malware that locks/encrypts files and demands payment is:', options: ['Phishing', 'Ransomware', 'DoS', 'Firewall'], correct: 1 },
      { question: 'An attack that floods a network with false requests to disrupt operations is a:', options: ['Phishing', 'DoS / DDoS', 'Ransomware', 'Trojan'], correct: 1 },
      { question: 'Tricking a victim via fake email/SMS into sharing passwords is:', options: ['Phishing', 'Malware', 'DoS', 'Encryption'], correct: 0 },
      { question: 'Which is the most common type of cyberattack (umbrella term)?', options: ['Malware', 'Firewall', 'Backup', 'VPN'], correct: 0 }
    ],

    fillBlanks: [
      { sentence: '_______ is malware that blocks access or encrypts files and demands a ransom.', answer: 'ransomware', hint: 'Pay to regain access.' },
      { sentence: 'A _______ attack floods a network with false requests to disrupt operations.', answer: 'DoS', hint: 'Denial of Service.' },
      { sentence: '_______ uses fake emails or SMS and social engineering to steal passwords.', answer: 'phishing', hint: 'Tricks the human.' },
      { sentence: '_______ is the umbrella term for any malicious software (viruses, worms, trojans…).', answer: 'malware', hint: 'Malicious software.' }
    ],

    learn: {
      content: `
        <h3>Information Systems Security</h3>
        <p><strong>Information systems security</strong> is protecting information systems against
        unauthorized access or modification (in storage, processing or transit) and against denial of
        service to authorized users — including detecting, documenting and countering threats (NIST).</p>
        <h4>Most common cyber attacks</h4>
        <ul>
          <li><strong>Malware</strong> — any malicious code (most common); includes the others below.</li>
          <li><strong>Ransomware</strong> — locks/encrypts data and demands a ransom (crypto).</li>
          <li><strong>DoS / DDoS</strong> — floods a network with false requests to disrupt operations.</li>
          <li><strong>Phishing</strong> — fake email/SMS + social engineering to steal credentials.</li>
        </ul>
        <div class="warning-box"><strong>Protect:</strong> train staff, update software, endpoint protection, firewall, backups, access control, secure Wi-Fi.</div>
      `,
      image: null
    }
  }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== 'undefined') { window.businessInformaticsM2 = businessInformaticsM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = businessInformaticsM2; }
