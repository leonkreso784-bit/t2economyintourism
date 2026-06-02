// ===== Business Informatics — Final Exam (Chapters 1–11) =====
// Završni ispit = oba kolokvija zajedno. Ova datoteka SPAJA Midterm 1 + Midterm 2.
// MORA se učitati POSLIJE midterm-1.js i midterm-2.js (vidi index.html / catalog scripts).

const businessInformaticsFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.businessInformaticsM1) ? window.businessInformaticsM1 : {},
  (typeof window !== 'undefined' && window.businessInformaticsM2) ? window.businessInformaticsM2 : {}
);

if (typeof window !== 'undefined') { window.businessInformaticsFinal = businessInformaticsFinal; }
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign({}, require('./midterm-1.js'), require('./midterm-2.js'));
}
