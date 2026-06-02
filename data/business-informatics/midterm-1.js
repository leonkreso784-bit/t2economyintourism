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
  }
};

// Expose on window for catalog-based loading (see data/catalog.js)
if (typeof window !== 'undefined') { window.businessInformaticsM1 = businessInformaticsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = businessInformaticsM1; }
