// ===== ACCOUNTING — Final Exam (Chapters 1–16) =====
// Završni = oba kolokvija zajedno + dodatne ispitne vježbe (examPractice ← bivši finalPractice).
// MORA se učitati POSLIJE midterm-1.js, midterm-2.js i final-practice.js (vidi catalog scripts).
// CROSS-ENV: browser čita globale; node require-a module.

const accountingFinal = (function () {
    const isNode = (typeof module !== 'undefined' && module.exports);
    const m1 = isNode ? require('./midterm-1.js')      : (typeof window !== 'undefined' && window.accountingM1 ? window.accountingM1 : {});
    const m2 = isNode ? require('./midterm-2.js')      : (typeof window !== 'undefined' && window.accountingM2 ? window.accountingM2 : {});
    const examPractice = isNode ? require('./final-practice.js') : finalPracticeData;
    return Object.assign({}, m1, m2, { examPractice: examPractice });
})();

// Make available globally (browser) + module (node verify/tests).
if (typeof window !== 'undefined') { window.accountingFinal = accountingFinal; }
if (typeof module !== 'undefined' && module.exports) { module.exports = accountingFinal; }
