// ===== Business Informatics — Midterm 1 (Chapters 1–6) =====
// Izvor: profesorske prezentacije (Tomislav Car, FMTU Opatija, 2024/25).
// Oblik po docs/CONTENT_SCHEMA.md. Pokreni `npm run verify` nakon izmjena.

const businessInformaticsM1 = {
  // ---- Chapter 1: System approach and informatics (U1) ----
  systemApproach: {
    name: 'System Approach & Informatics',
    icon: 'fa-sitemap',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is the systems approach?',
        answer: 'A view based on the idea that everything is inter-related and interdependent.\nA system is composed of related and dependent elements which, when in interaction, form a unitary whole — an assemblage or combination of parts forming a complex whole.',
        explanation: 'The whole is understood through the relationships between its parts.'
      },
      {
        question: 'What are the major concepts of the systems approach (Dinesh Thakur)?',
        answer: '• Holism\n• Specialization\n• Non-summational\n• Grouping\n• Coordination\n• Emergent properties',
        explanation: 'These six concepts define how a system behaves as a whole.'
      },
      {
        question: 'What does "holism" mean in the systems approach?',
        answer: 'A change in any part/component of a system affects the whole system, directly or indirectly.',
        explanation: 'You cannot change one part in isolation.'
      },
      {
        question: 'What does "non-summational" mean?',
        answer: 'Every component (subsystem) is important to the whole, so you must understand the actions of each component to get the holistic perspective. The whole is not simply the sum of its parts.',
        explanation: 'Understanding parts individually is not enough.'
      },
      {
        question: 'What are "emergent properties"?',
        answer: 'A group of interrelated components has properties as a group that are not present in any individual component.\nExample: multicellular organisms show characteristics not present in individual cells.',
        explanation: 'This is the essence of the holistic view.'
      },
      {
        question: 'What are the four key components of a system in the hospitality industry?',
        answer: '• Inputs — resources: labour, equipment, raw materials (e.g. food ingredients)\n• Processes — activities that convert inputs to outputs (cooking, cleaning, guest service)\n• Outputs — services/products delivered (dining experience, accommodation)\n• Feedback — information from customers/staff used to improve future operations',
        explanation: 'Inputs → Processes → Outputs, with Feedback closing the loop.'
      },
      {
        question: 'What characterizes a system in hospitality?',
        answer: '• Interdependence — all parts depend on each other (a kitchen problem affects food service)\n• Holistic view — decisions in one area affect the whole organization\n• Synergy — when parts work together, overall performance exceeds the sum of individual parts',
        explanation: 'Synergy is the practical payoff of the systems approach.'
      },
      {
        question: 'What is systems thinking, and who founded it?',
        answer: 'A holistic way to investigate factors and interactions that could contribute to an outcome — a mindset more than a prescribed practice.\nFounded in 1956 by MIT professor Jay Forrester.',
        explanation: 'It helps see the big picture and how structure influences performance.'
      },
      {
        question: 'How does systems thinking differ from traditional analysis?',
        answer: 'Traditional analysis breaks what is studied into separate, individual parts.\nSystems thinking instead focuses on how the parts interrelate and on the whole.',
        explanation: '"Analysis" literally means breaking into constituent parts; systems thinking does the opposite.'
      }
    ],

    quiz: [
      {
        question: 'The systems approach is based on the idea that elements are:',
        options: ['Independent and separate', 'Inter-related and interdependent', 'Always identical', 'Unrelated'],
        correct: 1
      },
      {
        question: 'Which is NOT a major concept of the systems approach?',
        options: ['Holism', 'Specialization', 'Emergent properties', 'Randomization'],
        correct: 3
      },
      {
        question: 'In a hospitality system, cooking, cleaning and guest service are examples of:',
        options: ['Inputs', 'Processes', 'Outputs', 'Feedback'],
        correct: 1
      },
      {
        question: 'Systems thinking was founded in 1956 by:',
        options: ['Albert Einstein', 'Jay Forrester', 'Dinesh Thakur', 'Marie Morganelli'],
        correct: 1
      },
      {
        question: '"The performance of the whole is greater than the sum of its parts" describes:',
        options: ['Interdependence', 'Synergy', 'Specialization', 'Feedback'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A system is composed of related and dependent elements which, in interaction, form a _______ whole.',
        answer: 'unitary',
        hint: 'Single / unified.'
      },
      {
        sentence: 'In the systems approach, _______ means that a change in one part affects the whole system.',
        answer: 'holism',
        hint: 'The "whole" concept.'
      },
      {
        sentence: 'In hospitality, resources such as labour, equipment and food ingredients are the system’s _______.',
        answer: 'inputs',
        hint: 'What enters the process.'
      },
      {
        sentence: '_______ thinking is a holistic way to investigate factors and interactions that contribute to an outcome.',
        answer: 'systems',
        hint: 'Founded by Jay Forrester.'
      }
    ],

    learn: {
      content: `
        <h3>System Approach &amp; Informatics</h3>
        <p>The <strong>systems approach</strong> is based on the generalization that everything is
        inter-related and interdependent. A <em>system</em> is a combination of related, dependent
        elements which, in interaction, form a unitary whole.</p>

        <h4>Major concepts (Dinesh Thakur)</h4>
        <ul>
          <li><strong>Holism</strong> — a change in any part affects the whole.</li>
          <li><strong>Specialization</strong> — the whole is divided into smaller components, each with a specialized role.</li>
          <li><strong>Non-summational</strong> — every component matters; the whole is not just the sum of its parts.</li>
          <li><strong>Grouping</strong> — related components are grouped to manage complexity.</li>
          <li><strong>Coordination</strong> — grouped components must be coordinated to avoid chaos.</li>
          <li><strong>Emergent properties</strong> — the group has properties no single component has.</li>
        </ul>

        <h4>The system in the hospitality industry</h4>
        <p>A hospitality organization is a unified whole where each department is interdependent:</p>
        <ul>
          <li><strong>Inputs</strong> — labour, equipment, raw materials (e.g. food ingredients).</li>
          <li><strong>Processes</strong> — cooking, cleaning, guest service.</li>
          <li><strong>Outputs</strong> — dining experience, accommodation.</li>
          <li><strong>Feedback</strong> — information from customers/staff to improve operations.</li>
        </ul>
        <p>Key characteristics: <strong>interdependence</strong>, a <strong>holistic view</strong>, and
        <strong>synergy</strong> (the whole performs better than the sum of its parts).</p>

        <h4>Systems thinking</h4>
        <p><strong>Systems thinking</strong> is a holistic way to investigate factors and interactions
        that contribute to an outcome — a mindset more than a practice. It was founded in 1956 by MIT
        professor <strong>Jay Forrester</strong>. It is used to examine how we create our own problems,
        to see the big picture, and to understand how structure influences performance.</p>
        <p>Unlike <em>traditional analysis</em> (which breaks things into separate parts), systems
        thinking focuses on how the parts <strong>interrelate</strong>.</p>
      `,
      image: null
    }
  },

  // ---- Chapter 2: Data, Information & Knowledge (U2) ----
  dataInfoKnowledge: {
    name: 'Data, Information & Knowledge',
    icon: 'fa-database',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is data?',
        answer: 'Raw facts and figures that on their own have no meaning. Data can be any alphanumeric characters — text, numbers or symbols.\nExample: "15012002", "23", "English" mean nothing without context.',
        explanation: 'Data has no meaning until it is given a context and processed.'
      },
      {
        question: 'What is information?',
        answer: 'Data that has been processed within a context to give it meaning, presented in a useful format.\nExample: "Maja’s date of birth is 15/01/02" or "The computer costs $1066".',
        explanation: 'Context + processing turns data into information.'
      },
      {
        question: 'What is knowledge?',
        answer: 'The ability to interpret information and apply it to solve problems or make decisions — the understanding of the rules needed to interpret information.',
        explanation: 'Debbie Jones: understanding the relationship between pieces of information and what to do with it.'
      },
      {
        question: 'How does data become information?',
        answer: 'Data must be processed within a context to give it meaning, then presented in its most useful format.',
        explanation: 'Without context, data stays meaningless.'
      },
      {
        question: 'Give hotel-industry examples of DATA.',
        answer: '• 100 guests checked in yesterday\n• The average room rate is $150\n• The restaurant sold 250 steaks last week',
        explanation: 'Raw numbers/facts, not yet interpreted.'
      },
      {
        question: 'Give hotel-industry examples of INFORMATION.',
        answer: '• The most popular room type is the deluxe suite\n• The busiest day of the week is Friday\n• July occupancy rate was 85%',
        explanation: 'Processed and organized data.'
      },
      {
        question: 'Give hotel-industry examples of KNOWLEDGE.',
        answer: '• Predicting high room demand in summer from occupancy rates\n• Scheduling extra staff on the busiest day\n• Using guest preferences to improve the guest experience',
        explanation: 'Interpreting information to make decisions.'
      },
      {
        question: 'What is the relationship Data → Information → Knowledge?',
        answer: 'Data (raw facts) → processed within a context → Information (meaningful) → interpreted and applied → Knowledge (decisions, problem-solving).',
        explanation: 'Each stage adds meaning and usefulness.'
      }
    ],

    quiz: [
      { question: 'Raw facts and figures that have no meaning on their own are:', options: ['Information', 'Data', 'Knowledge', 'Wisdom'], correct: 1 },
      { question: '"The hotel’s July occupancy rate was 85%" is an example of:', options: ['Data', 'Information', 'Knowledge', 'Noise'], correct: 1 },
      { question: 'The ability to interpret information and apply it to make decisions is:', options: ['Data', 'Information', 'Knowledge', 'Input'], correct: 2 },
      { question: 'Data becomes information when it is:', options: ['Deleted', 'Processed within a context', 'Stored on disk', 'Encrypted'], correct: 1 },
      { question: '"Predicting high demand for rooms in summer from occupancy rates" is an example of:', options: ['Data', 'Information', 'Knowledge', 'Feedback'], correct: 2 }
    ],

    fillBlanks: [
      { sentence: '_______ are raw facts and figures that on their own have no meaning.', answer: 'data', hint: 'Raw facts and numbers.' },
      { sentence: 'Information is data that has been processed within a _______ to give it meaning.', answer: 'context', hint: 'The situation that gives meaning.' },
      { sentence: '_______ is the ability to interpret information and apply it to solve problems.', answer: 'knowledge', hint: 'Comes after information.' },
      { sentence: '"100 guests checked in yesterday" is an example of _______ in the hotel industry.', answer: 'data', hint: 'A raw fact.' }
    ],

    learn: {
      content: `
        <h3>Data, Information &amp; Knowledge</h3>
        <h4>Data</h4>
        <p><strong>Data</strong> are raw facts and figures (text, numbers, symbols) that on their own
        have <em>no meaning</em> — e.g. <code>15012002</code>, <code>23</code>, "English".</p>
        <h4>Information</h4>
        <p><strong>Information</strong> is data processed within a <strong>context</strong> to give it
        meaning, presented usefully — e.g. "Maja’s date of birth is 15/01/02".</p>
        <h4>Knowledge</h4>
        <p><strong>Knowledge</strong> is the ability to interpret information and apply it to solve
        problems or make decisions (understanding the rules needed to interpret information).</p>
        <h4>Hotel industry example</h4>
        <ul>
          <li><strong>Data:</strong> 100 guests checked in yesterday; average room rate $150.</li>
          <li><strong>Information:</strong> busiest day is Friday; July occupancy was 85%.</li>
          <li><strong>Knowledge:</strong> expect high demand in summer → schedule more staff.</li>
        </ul>
        <div class="tip-box"><strong>Chain:</strong> Data → (context + processing) → Information → (interpretation) → Knowledge.</div>
      `,
      image: null
    }
  },

  // ---- Chapter 3: Hardware (U3) ----
  hardware: {
    name: 'Hardware',
    icon: 'fa-microchip',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is computer hardware?',
        answer: 'The physical devices that make up a computer. A computer is a system composed of several components that all work together.',
        explanation: 'Tangible parts, as opposed to software (the instructions).'
      },
      {
        question: 'What are the typical major components of a computer?',
        answer: '• Central Processing Unit (CPU)\n• Main memory (RAM)\n• Secondary storage devices\n• Input and output devices',
        explanation: 'These work together as one system.'
      },
      {
        question: 'What is the CPU and why is it important?',
        answer: 'The part of the computer that actually runs programs — the most important component; without it you cannot run software. CPUs on small chips are called microprocessors.',
        explanation: 'It executes instructions and controls data flow.'
      },
      {
        question: 'What is RAM (main memory)?',
        answer: 'Where the computer stores a program while it runs and the data it uses; the CPU accesses it quickly. RAM is volatile — its contents are erased when the computer is turned off (temporary storage).',
        explanation: 'Volatile = lost without power.'
      },
      {
        question: 'What is secondary storage, and what is it for?',
        answer: 'Storage that holds data for long periods. Programs are normally stored here and then loaded into main memory when needed.',
        explanation: 'Permanent storage, unlike RAM.'
      },
      {
        question: 'Name the types of secondary storage.',
        answer: '• Disk drive (HDD) — magnetic spinning disk\n• Solid State Drive (SSD) — faster, no moving parts\n• Flash memory — portable, e.g. USB drive\n• Optical devices — CD, DVD, Blu-ray',
        explanation: 'SSD is faster than a mechanical disk drive.'
      },
      {
        question: 'What are input devices?',
        answer: 'Components that collect data from people or other devices — e.g. keyboard, mouse, touchscreen, scanner, camera. Disk drives can act as input (they load programs into main memory).',
        explanation: 'Input = data the computer collects.'
      },
      {
        question: 'What are output devices?',
        answer: 'Components that format and present output (text, image, audio) — e.g. video display, printer. Disk and USB drives can act as output because data is sent to them to be saved.',
        explanation: 'Output = data produced by the computer.'
      },
      {
        question: 'How do hardware and software relate?',
        answer: 'They are complementary: a computing device works efficiently and produces useful output only when both hardware and software work together.',
        explanation: 'Neither is useful alone.'
      }
    ],

    quiz: [
      { question: 'The most important component, which actually runs programs, is the:', options: ['RAM', 'CPU', 'SSD', 'Monitor'], correct: 1 },
      { question: 'RAM is described as ____ memory (its contents are erased when power is off):', options: ['Permanent', 'Volatile', 'Optical', 'Secondary'], correct: 1 },
      { question: 'Which of these is an example of secondary storage?', options: ['CPU', 'RAM', 'SSD', 'Keyboard'], correct: 2 },
      { question: 'A keyboard is an example of a(n):', options: ['Output device', 'Input device', 'Storage device', 'Processor'], correct: 1 },
      { question: 'Which secondary storage has no moving parts and is faster than a disk drive?', options: ['HDD', 'SSD', 'CD', 'Floppy disk'], correct: 1 }
    ],

    fillBlanks: [
      { sentence: 'The _______ is the component that actually runs programs and is the most important part of the computer.', answer: 'CPU', hint: 'Central Processing Unit.' },
      { sentence: 'RAM is _______ memory, so its contents are erased when the computer is turned off.', answer: 'volatile', hint: 'Lost without power.' },
      { sentence: 'An _______ device collects data from people, e.g. a keyboard or mouse.', answer: 'input', hint: 'Opposite of output.' },
      { sentence: 'An _______ (no moving parts) is faster than a magnetic disk drive.', answer: 'SSD', hint: 'Solid State Drive.' }
    ],

    learn: {
      content: `
        <h3>Hardware</h3>
        <p><strong>Hardware</strong> is the physical devices that make up a computer. A computer is a
        system of components that work together.</p>
        <h4>Major components</h4>
        <ul>
          <li><strong>CPU</strong> — runs programs; the most important component (a microprocessor on a chip).</li>
          <li><strong>Main memory (RAM)</strong> — fast, temporary storage for running programs/data; <em>volatile</em> (erased when off).</li>
          <li><strong>Secondary storage</strong> — long-term: HDD (magnetic), SSD (fast, no moving parts), flash/USB, optical (CD/DVD/Blu-ray).</li>
          <li><strong>Input / Output devices</strong> — input: keyboard, mouse, scanner; output: display, printer.</li>
        </ul>
        <p>Hardware and software are <strong>complementary</strong> — a device is useful only when both work together.</p>
      `,
      image: null
    }
  },

  // ---- Chapter 4: Software (U4) ----
  software: {
    name: 'Software',
    icon: 'fa-code',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is software?',
        answer: 'A set of instructions, data, or programs used to operate a computer and execute specific tasks — software tells a computer how to function. It is a generic term for applications, scripts and programs.',
        explanation: 'Without software, most computers would be useless.'
      },
      {
        question: 'What are the two main types of software?',
        answer: '1. System software\n2. Application software',
        explanation: 'System software runs the machine; application software serves the user.'
      },
      {
        question: 'What is application software?',
        answer: 'Software that helps an end user complete tasks (research, notes, graphics, accounting). It sits above system software, is designed for the end user and is specific in functionality (sometimes called "non-essential" software).',
        explanation: 'Installed and used based on the user’s needs.'
      },
      {
        question: 'Give types/examples of application software.',
        answer: '• Word processors — MS Word, Google Docs\n• Spreadsheets — Excel, Google Sheets\n• Database (DBMS) — MySQL, FileMaker\n• Multimedia — Adobe Photoshop\n• Application suites — Microsoft Office\n• Browsers — Chrome\n• Email — Outlook, Gmail',
        explanation: 'Each targets a specific end-user task.'
      },
      {
        question: 'What is system software?',
        answer: 'Software that helps the user, hardware and application software interact — a mediator/middle layer between the user and the hardware. It manages the whole system, is loaded first at startup, and runs in the background (not used directly by end users).',
        explanation: 'Essential, unlike "non-essential" application software.'
      },
      {
        question: 'What is an operating system (OS)?',
        answer: 'System software that serves as the interface between other applications and the hardware, managing all other programs in the computer.',
        explanation: 'The best-known example of system software.'
      },
      {
        question: 'Give examples of system software (besides the OS).',
        answer: '• BIOS — built-in firmware: what a computer can do without disk programs\n• Boot — loads the OS into RAM\n• Assembler — converts basic instructions into bits the processor uses\n• Device driver — controls a device (e.g. keyboard, mouse)',
        explanation: 'All run in the background to manage the system.'
      },
      {
        question: 'How do software and hardware differ?',
        answer: 'Software is logical (instructions that enable interaction); hardware is physical (devices that store and run software). Software failure is systematic and it does not wear out (though bugs arise); hardware failure is random and hardware wears out over time.',
        explanation: 'They are complementary but different in nature.'
      }
    ],

    quiz: [
      { question: 'Software is best described as:', options: ['Physical devices', 'A set of instructions that tell a computer what to do', 'A type of CPU', 'A network'], correct: 1 },
      { question: 'The two main types of software are:', options: ['Input & output', 'System & application', 'RAM & ROM', 'LAN & WAN'], correct: 1 },
      { question: 'Microsoft Excel and Google Docs are examples of:', options: ['System software', 'Application software', 'Firmware', 'Device drivers'], correct: 1 },
      { question: 'Which acts as the interface between applications and the hardware?', options: ['Spreadsheet', 'Operating system', 'Browser', 'NIC'], correct: 1 },
      { question: 'Which is an example of system software?', options: ['Adobe Photoshop', 'Operating system', 'Microsoft Word', 'Google Chrome'], correct: 1 }
    ],

    fillBlanks: [
      { sentence: '_______ is a set of instructions that tells a computer how to function.', answer: 'software', hint: 'Opposite of hardware.' },
      { sentence: '_______ software helps the end user complete tasks like writing documents or editing photos.', answer: 'application', hint: 'Sits above system software.' },
      { sentence: 'The _______ system is system software that manages all programs and interfaces with the hardware.', answer: 'operating', hint: 'OS.' },
      { sentence: '_______ is built-in firmware that sets what a computer can do without accessing programs from a disk.', answer: 'BIOS', hint: 'Basic Input/Output System.' }
    ],

    learn: {
      content: `
        <h3>Software</h3>
        <p><strong>Software</strong> is a set of instructions, data or programs used to operate a
        computer and execute tasks — it tells the computer how to function. There are two main types:</p>
        <h4>Application software</h4>
        <p>Helps the <strong>end user</strong> complete tasks; sits above system software. Examples:
        word processors (Word), spreadsheets (Excel), databases (MySQL), multimedia (Photoshop),
        suites (MS Office), browsers (Chrome), email (Outlook).</p>
        <h4>System software</h4>
        <p>A <strong>middle layer</strong> between the user and the hardware; manages the whole system
        and runs in the background. Examples: <strong>OS</strong> (interface to hardware), BIOS, Boot,
        Assembler, Device drivers.</p>
        <h4>Software vs hardware</h4>
        <ul>
          <li>Software is <strong>logical</strong> (instructions); hardware is <strong>physical</strong> (devices).</li>
          <li>Software failure is systematic and it doesn’t wear out; hardware failure is random and it wears out.</li>
        </ul>
      `,
      image: null
    }
  },

  // ---- Chapter 5: Computer Networks (U5) ----
  networks: {
    name: 'Computer Networks',
    icon: 'fa-network-wired',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is a computer network?',
        answer: 'Two or more computers connected so they can share their data, resources and applications.',
        explanation: 'Networks are classified by size and function.'
      },
      {
        question: 'What are the main types of network by size?',
        answer: '• LAN — Local Area Network\n• PAN — Personal Area Network\n• MAN — Metropolitan Area Network\n• WAN — Wide Area Network\n• GAN — Global Area Network',
        explanation: 'They differ by geographic range.'
      },
      {
        question: 'What is a LAN?',
        answer: 'A Local Area Network — computers linked over a limited range (apartment, office) via communication devices such as cables, routers and switches.',
        explanation: 'Smallest common business network.'
      },
      {
        question: 'What is a PAN?',
        answer: 'A Personal Area Network — very short range (~10–30 m) for personal devices: laptop, smartphone, game stations, gadgets. Can be wired or wireless.',
        explanation: 'Centered on one person.'
      },
      {
        question: 'What is a MAN?',
        answer: 'A Metropolitan Area Network — covers a large geographical area (e.g. a city) by interconnecting several LANs, often via telephone communication technology.',
        explanation: 'Bigger than LAN, smaller than WAN.'
      },
      {
        question: 'What is a WAN, and what is a GAN?',
        answer: 'WAN (Wide Area Network) covers a huge geographic range (e.g. a whole city/region), often using mobile-operator infrastructure.\nGAN (Global Area Network) covers a country or the entire world — a "network of networks" (satellite/wireless).',
        explanation: 'WAN = wide; GAN = global.'
      },
      {
        question: 'Name the main networking devices (nodes).',
        answer: 'NIC, Repeater, Hub, Switch, Bridge, Router, Gateway, Firewall.',
        explanation: 'Each plays a role in moving/controlling data.'
      },
      {
        question: 'What is a NIC, and what is a MAC address?',
        answer: 'A Network Interface Card (NIC) physically connects a host to the network media (a circuit board / network adapter). Each NIC has a unique Media Access Control (MAC) address used to control data communication for that host.',
        explanation: 'MAC = unique hardware identifier.'
      },
      {
        question: 'How does a switch differ from a hub, and what does a router add?',
        answer: 'A hub passively concentrates connections (all hosts seen as one unit). A switch is more intelligent — it sends data only to the connection that needs it. A router has all capabilities and can connect to a WAN, linking LANs separated by great distances.',
        explanation: 'Hub → Switch → Router: increasing intelligence.'
      }
    ],

    quiz: [
      { question: 'A computer network lets connected computers share:', options: ['Only electricity', 'Data, resources and applications', 'Nothing', 'Only printers'], correct: 1 },
      { question: 'A network limited to an office or apartment is a:', options: ['WAN', 'LAN', 'GAN', 'MAN'], correct: 1 },
      { question: 'A network covering a whole city by connecting several LANs is a:', options: ['PAN', 'LAN', 'MAN', 'NIC'], correct: 2 },
      { question: 'The unique hardware address of a NIC is called the ___ address:', options: ['IP', 'MAC', 'URL', 'DNS'], correct: 1 },
      { question: 'Which device has all capabilities and can connect LANs over great distances via a WAN?', options: ['Hub', 'Repeater', 'Router', 'Bridge'], correct: 2 }
    ],

    fillBlanks: [
      { sentence: 'A computer _______ is two or more computers connected to share data and resources.', answer: 'network', hint: 'The topic of this chapter.' },
      { sentence: 'A _______ (Local Area Network) connects computers within a limited area like an office.', answer: 'LAN', hint: 'Smallest type.' },
      { sentence: 'Each NIC is identified by a unique _______ address.', answer: 'MAC', hint: 'Media Access Control.' },
      { sentence: 'A _______ can connect to a WAN and link LANs separated by great distances.', answer: 'router', hint: 'Most capable node.' }
    ],

    learn: {
      content: `
        <h3>Computer Networks</h3>
        <p>A <strong>computer network</strong> is two or more computers connected so they can share
        data, resources and applications.</p>
        <h4>Types by size</h4>
        <ul>
          <li><strong>LAN</strong> — Local Area Network (office/apartment).</li>
          <li><strong>PAN</strong> — Personal Area Network (~10–30 m, personal devices).</li>
          <li><strong>MAN</strong> — Metropolitan Area Network (city; connects LANs).</li>
          <li><strong>WAN</strong> — Wide Area Network (region/city, mobile infrastructure).</li>
          <li><strong>GAN</strong> — Global Area Network (country/world; network of networks).</li>
        </ul>
        <h4>Networking devices (nodes)</h4>
        <p><strong>NIC</strong> (with a unique <strong>MAC</strong> address), Repeater, Hub, Bridge,
        Switch, Router, Gateway, Firewall. Intelligence increases from a passive <em>hub</em> → a
        <em>switch</em> (sends data only where needed) → a <em>router</em> (connects LANs across a WAN).</p>
      `,
      image: null
    }
  },

  // ---- Chapter 6: World Wide Web (U6) ----
  www: {
    name: 'World Wide Web',
    icon: 'fa-globe',
    color: '#2563eb',

    flashcards: [
      {
        question: 'What is the Internet?',
        answer: 'An enormous network of networks — the massive computer network that connects devices using copper wires, wireless networks or fibre-optic cables.',
        explanation: 'It is the infrastructure; the Web is a service on top of it.'
      },
      {
        question: 'What is the World Wide Web (WWW)?',
        answer: 'A way of accessing information over the Internet — one of its major services. It is a large collection of web pages (text, graphics, sound, video) linked by hyperlinks, delivered via the HTTP protocol and viewed in browsers.',
        explanation: 'The Web is content; the Internet is the network.'
      },
      {
        question: 'What is the difference between the Internet and the WWW?',
        answer: 'The Internet is the enormous network of networks (infrastructure connecting devices via cables/wireless/fibre).\nThe WWW is a large collection of web pages linked by hyperlinks — a service provided by the Internet.',
        explanation: 'Often used interchangeably, but the Web is just one service of the Internet.'
      },
      {
        question: 'How does the WWW work (clients and servers)?',
        answer: 'Clients are users’ internet-connected devices plus a web browser. Servers are computers that store web pages/sites/apps. When a client requests a page, a copy is downloaded from the server and displayed in the browser.',
        explanation: 'Request → download copy → display.'
      },
      {
        question: 'What is a web browser, and what is a search engine?',
        answer: 'A web browser is software that lets a user locate, access and display web pages (e.g. Chrome, Firefox, Safari).\nA search engine is a service that lets users search for content via the WWW.',
        explanation: 'Browser = view pages; search engine = find pages.'
      },
      {
        question: 'What is DNS (Domain Name System)?',
        answer: 'A system that maps memorable domain names (e.g. example.com) to numeric IP addresses (e.g. 93.184.216.34), so humans use names while computers use IP addresses.',
        explanation: 'A "phone book" of the Internet.'
      },
      {
        question: 'What is the client/server model on the web?',
        answer: 'The client (a web browser) requests a service; the server (a web server) fulfils the request and transmits the results back over the network, following agreed protocols.',
        explanation: 'Client requests, server responds.'
      },
      {
        question: 'Name key Internet protocols and their roles.',
        answer: '• HTTP — transfers web pages\n• FTP — transfers files between computers\n• SMTP — sends email\n• POP / IMAP — receive email\n• TCP/IP — official Internet protocol: TCP breaks data into packets & ensures integrity, IP routes packets to the destination',
        explanation: 'Protocols are the rules of communication.'
      }
    ],

    quiz: [
      { question: 'The Internet is best described as:', options: ['A collection of web pages', 'An enormous network of networks', 'A web browser', 'A search engine'], correct: 1 },
      { question: 'The World Wide Web is:', options: ['Exactly the same as the Internet', 'A service provided by the Internet (linked web pages)', 'A type of cable', 'A type of CPU'], correct: 1 },
      { question: 'DNS maps domain names to:', options: ['MAC addresses', 'IP addresses', 'Web browsers', 'Packets'], correct: 1 },
      { question: 'Which protocol is used to transfer web pages?', options: ['FTP', 'HTTP', 'SMTP', 'POP'], correct: 1 },
      { question: 'In the web client/server model, the client is usually the:', options: ['Web server', 'Web browser', 'DNS server', 'Router'], correct: 1 }
    ],

    fillBlanks: [
      { sentence: 'The _______ is an enormous network of networks connecting devices via cables, wireless and fibre.', answer: 'Internet', hint: 'The infrastructure.' },
      { sentence: 'The World Wide Web is a collection of web pages linked by _______.', answer: 'hyperlinks', hint: 'Clickable links.' },
      { sentence: '_______ maps memorable domain names to numeric IP addresses.', answer: 'DNS', hint: 'Domain Name System.' },
      { sentence: 'The Web uses the _______ protocol to transmit web pages.', answer: 'HTTP', hint: 'HyperText Transfer Protocol.' }
    ],

    learn: {
      content: `
        <h3>World Wide Web</h3>
        <h4>Internet vs WWW</h4>
        <p>The <strong>Internet</strong> is an enormous network of networks (devices connected via
        cables, wireless, fibre). The <strong>WWW</strong> is a large collection of web pages linked by
        <strong>hyperlinks</strong> — a <em>service provided by</em> the Internet, delivered over HTTP
        and viewed in browsers.</p>
        <h4>How it works</h4>
        <p><strong>Clients</strong> (your device + browser) request pages; <strong>servers</strong>
        store them and send a copy back to display. Tools: <strong>web browser</strong> (view pages),
        <strong>search engine</strong> (find content), <strong>DNS</strong> (maps domain names ↔ IP addresses).</p>
        <h4>Key protocols</h4>
        <ul>
          <li><strong>HTTP</strong> — web pages; <strong>FTP</strong> — files.</li>
          <li><strong>SMTP</strong> — send email; <strong>POP/IMAP</strong> — receive email.</li>
          <li><strong>TCP/IP</strong> — the Internet’s official protocol (TCP packets + integrity, IP routing).</li>
        </ul>
      `,
      image: null
    }
  }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== 'undefined') { window.businessInformaticsM1 = businessInformaticsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = businessInformaticsM1; }
