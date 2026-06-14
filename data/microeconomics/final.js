// ===== MICROECONOMICS — Final Exam (hybrid) =====
// Same pattern as Marketing/Economics/Geography/Food&Nutrition/te2/E-Business finals: the final
// lesson MERGES both midterms and adds one curated cross-topic "Exam Practice" category.
//   microeconomicsFinal = Object.assign({}, microeconomicsM1 (K1, Ch 1–7),
//                                        microeconomicsM2 (K2, Ch 8,9,10,12,13,14,18),
//                                        { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.microeconomicsM1 and window.microeconomicsM2 at module-load time.
//
// K1 (7 topic cats) + K2 (7 topic cats) have no key collisions → 14 topic categories + examPractice = 15.
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX (ADR-009). Inline "\\( ... \\)", display "\\[ ... \\]";
//   jedan `$` se NE koristi (valuta → "USD").

const microeconomicsExamPractice = {
  name: 'Exam Practice (All Chapters)',
  icon: 'fa-graduation-cap',
  color: '#6366f1',

  flashcards: [
    {
      question: 'What single idea unifies almost every optimization in microeconomics?',
      answer: '"Optimize at the margin" — keep doing an activity until its marginal benefit equals its marginal cost. Each topic is one version of that rule:\n\\( MR = MC \\) (profit), \\( MRS = \\dfrac{P_x}{P_y} \\) (consumer), \\( MRTS = \\dfrac{w}{r} \\) (cost-min), \\( MRP_L = w \\) (hiring), \\( MSC = MSB \\) (social efficiency).',
      explanation: 'If MB > MC, do more; if MB < MC, do less. Equality = optimum.'
    },
    {
      question: 'Summarize the four market structures (firms, product, entry, price vs MC, long-run profit).',
      answer: '• Perfect competition: many firms, homogeneous, free entry, \\(P = MC\\), zero LR profit.\n• Monopolistic competition: many firms, differentiated, free entry, \\(P > MC\\), zero LR profit (excess capacity).\n• Oligopoly: a few interdependent firms, barriers, \\(P > MC\\), possible LR profit.\n• Monopoly: one firm, no substitutes, blocked entry, \\(P > MC\\), LR profit persists.'
    },
    {
      question: 'How is the consumer optimum characterized in two equivalent ways?',
      answer: 'At the best affordable basket the indifference curve is tangent to the budget line:\n\\( MRS = \\dfrac{P_x}{P_y} \\)\nequivalently, the marginal utility per dollar is equal across all goods:\n\\( \\dfrac{MU_x}{P_x} = \\dfrac{MU_y}{P_y} \\) (the equal-marginal principle).'
    },
    {
      question: 'Define price elasticity of demand and its link to revenue and monopoly markup.',
      answer: '\\( E_p = \\dfrac{\\%\\,\\Delta Q}{\\%\\,\\Delta P} \\). Demand is elastic if \\(|E_p|>1\\) (a price cut RAISES revenue), inelastic if \\(|E_p|<1\\) (a price cut LOWERS revenue). Monopoly markup is tied to it through the Lerner index: \\( \\dfrac{P-MC}{P} = -\\dfrac{1}{E_d} \\).'
    },
    {
      question: 'Where does deadweight loss appear, and what is the common cause?',
      answer: 'In monopoly, taxes/subsidies, price controls, quotas/tariffs, and externalities. The common cause is always the same: output moves AWAY from the efficient level (where \\(P = MC\\) for private goods, or \\(MSC = MSB\\) with externalities), so mutually beneficial trades are lost.'
    },
    {
      question: 'Contrast diminishing marginal returns with returns to scale.',
      answer: 'Diminishing marginal returns is a SHORT-RUN idea: adding more of ONE variable input (with others fixed) eventually raises output by less and less. Returns to scale is a LONG-RUN idea: scaling ALL inputs by the same factor — output may rise more than (increasing), equal to (constant) or less than (decreasing) proportionally.'
    },
    {
      question: 'State the firm’s short-run produce/shut-down rule and the long-run entry/exit rule.',
      answer: 'Short run: produce where \\(MR = MC\\), but shut down if \\(P < AVC\\) (then lose only fixed cost). Long run: exit if \\(P < ATC\\); under perfect competition free entry/exit drives \\(P\\) to \\(\\min(ATC)\\) and economic profit to zero.'
    },
    {
      question: 'How does a monopoly’s choice differ from a competitive firm’s, and why is it inefficient?',
      answer: 'Both set \\(MR = MC\\), but for a competitive firm \\(P = MR\\), so \\(P = MC\\); for a monopoly \\(MR < P\\), so it stops where \\(P > MC\\). Producing where \\(P>MC\\) means some units worth more than they cost are not made → deadweight loss.'
    },
    {
      question: 'Recap the economics of risk: expected value and attitudes to risk.',
      answer: 'Expected value is the probability-weighted average payoff, \\( E(X) = \\sum p_i x_i \\). A risk-AVERSE person prefers a sure thing to a fair gamble of equal expected value (diminishing marginal utility of wealth); risk-NEUTRAL is indifferent; risk-LOVING prefers the gamble. Risk is reduced by diversification, insurance and more information.'
    },
    {
      question: 'How does a firm decide how much labor to hire, in competition and under monopsony?',
      answer: 'Competitive factor market: hire until \\(MRP_L = w\\), where \\(MRP_L = P \\times MP_L\\). Monopsony (single buyer): the supply curve slopes up so marginal expenditure exceeds the wage — hire until \\(MV = ME\\) (i.e. \\(MRP = ME\\)), employing less and paying less.'
    },
    {
      question: 'List the toolkit for correcting externalities.',
      answer: 'For NEGATIVE externalities (over-production): a Pigouvian fee/tax equal to the marginal external cost, an emissions standard, or tradeable permits (cap-and-trade); private Coasean bargaining if property rights are clear and transaction costs low. For POSITIVE externalities (under-production): a subsidy.'
    },
    {
      question: 'Why do private markets under-provide public goods?',
      answer: 'Public goods are NONRIVAL (one person’s use does not reduce others’) and NONEXCLUSIVE (non-payers cannot be shut out). Nonexclusivity creates the FREE-RIDER problem: each person hopes others will pay, so too little is funded — which is why government often provides them.'
    }
  ],

  quiz: [
    {
      question: 'The general optimization rule across micro is: keep going until:',
      options: ['Total benefit is zero', 'Marginal benefit equals marginal cost', 'Average cost is highest', 'Revenue is maximized'],
      correct: 1
    },
    {
      question: 'A competitive firm in long-run equilibrium earns economic profit of:',
      options: ['A large positive amount', 'Zero', 'A negative amount', 'Exactly its fixed cost'],
      correct: 1
    },
    {
      question: 'The consumer optimum requires the MRS to equal:',
      options: ['The wage–rental ratio', 'The price ratio of the two goods', 'Marginal cost', 'The Lerner index'],
      correct: 1
    },
    {
      question: 'If demand is elastic (|Ep| > 1), a price cut makes total revenue:',
      options: ['Fall', 'Rise', 'Stay constant', 'Become zero'],
      correct: 1
    },
    {
      question: 'A monopoly produces where MR = MC, which leaves price:',
      options: ['Below MC', 'Equal to MC', 'Above MC', 'Equal to AVC'],
      correct: 2
    },
    {
      question: 'A competitive firm shuts down in the short run when price is below:',
      options: ['ATC', 'AVC', 'AFC', 'MR'],
      correct: 1
    },
    {
      question: 'Scaling ALL inputs and getting more-than-proportional output is:',
      options: ['Diminishing marginal returns', 'Increasing returns to scale', 'A sunk cost', 'Economies of scope'],
      correct: 1
    },
    {
      question: 'A competitive firm hires labor until MRP_L equals the:',
      options: ['Price of output', 'Wage', 'Marginal product', 'Average cost'],
      correct: 1
    },
    {
      question: 'A per-unit tax equal to marginal external cost is a:',
      options: ['Price ceiling', 'Pigouvian (corrective) tax', 'Quota', 'Subsidy'],
      correct: 1
    },
    {
      question: 'A good that is nonrival and nonexclusive is a:',
      options: ['Private good', 'Public good', 'Common resource', 'Giffen good'],
      correct: 1
    },
    {
      question: 'A risk-averse person prefers a sure amount to a fair gamble of the same:',
      options: ['Variance', 'Expected value', 'Maximum payoff', 'Probability'],
      correct: 1
    },
    {
      question: 'Deadweight loss arises whenever output moves away from where:',
      options: ['\\(P = MC\\) (or \\(MSC = MSB\\))', '\\(AFC = 0\\)', 'Total revenue is maximized', '\\(MR > MC\\)'],
      correct: 0
    }
  ],

  fillBlanks: [
    {
      sentence: 'The master rule of micro: act until marginal benefit equals marginal _______.',
      answer: 'cost'
    },
    {
      sentence: 'In long-run perfect competition, economic profit is _______.',
      answer: 'zero'
    },
    {
      sentence: 'At the consumer optimum, MRS equals the _______ ratio of the two goods.',
      answer: 'price'
    },
    {
      sentence: 'A monopoly sets MR = MC, leaving price _______ marginal cost.',
      answer: 'above'
    },
    {
      sentence: 'A firm shuts down in the short run if price is below average _______ cost.',
      answer: 'variable'
    },
    {
      sentence: 'A competitive firm hires labor until MRP equals the _______.',
      answer: 'wage'
    },
    {
      sentence: 'A corrective tax on a negative externality is called a _______ tax.',
      answer: 'Pigouvian'
    },
    {
      sentence: 'Because non-payers cannot be excluded, public goods suffer the _______ problem.',
      answer: 'free-rider'
    }
  ],

  learn: {
    content:
      '<h3>Final Exam Roadmap — the whole of micro on one page</h3>' +
      '<p>The course tells one story: scarce resources are allocated by people and firms <strong>optimizing at the margin</strong> and by <strong>prices</strong> coordinating them. Drill the per-chapter categories in this lesson, then use this set to link them.</p>' +

      '<div class="formula-box">\\[ \\begin{aligned}' +
      '\\text{Consumer optimum:}\\quad & MRS = \\frac{P_x}{P_y}\\;\\Leftrightarrow\\;\\frac{MU_x}{P_x}=\\frac{MU_y}{P_y}\\\\[2pt]' +
      '\\text{Cost minimization:}\\quad & MRTS = \\frac{w}{r}\\\\[2pt]' +
      '\\text{Profit maximization:}\\quad & MR = MC\\\\[2pt]' +
      '\\text{Perfect competition:}\\quad & P = MR = MC = \\min(LAC)\\\\[2pt]' +
      '\\text{Monopoly markup:}\\quad & \\frac{P-MC}{P} = -\\frac{1}{E_d}\\\\[2pt]' +
      '\\text{Hiring an input:}\\quad & MRP_L = w \\;\\; (\\text{monopsony: } MV = ME)\\\\[2pt]' +
      '\\text{Social efficiency:}\\quad & MSC = MSB' +
      '\\end{aligned} \\]</div>' +

      '<h4>First midterm (Ch 1–7)</h4>' +
      '<ul>' +
      '<li><strong>Preliminaries &amp; supply–demand:</strong> scarcity, PPF, equilibrium; \\(E_p = \\%\\Delta Q / \\%\\Delta P\\), elastic vs inelastic and revenue.</li>' +
      '<li><strong>Consumer behavior &amp; demand:</strong> preferences, budget line, \\(MRS = P_x/P_y\\); income/substitution effects, consumer surplus.</li>' +
      '<li><strong>Uncertainty:</strong> expected value \\(E(X)=\\sum p_i x_i\\), risk attitudes, diversification/insurance.</li>' +
      '<li><strong>Production &amp; cost:</strong> \\(MP\\), \\(MRTS\\), returns to scale; \\(TC = FC + VC\\), \\(MC = \\Delta TC/\\Delta Q\\), U-shaped ATC/AVC.</li>' +
      '</ul>' +

      '<h4>Second midterm (Ch 8,9,10,12,13,14,18)</h4>' +
      '<ul>' +
      '<li><strong>Competitive supply:</strong> \\(P = MC\\); shut down if \\(P<AVC\\); zero LR profit.</li>' +
      '<li><strong>Competitive markets:</strong> consumer/producer surplus, deadweight loss, tax incidence by elasticity.</li>' +
      '<li><strong>Monopoly &amp; monopsony:</strong> \\(MR<P\\), Lerner index, \\(MV=ME\\); social cost of market power.</li>' +
      '<li><strong>Monopolistic competition &amp; oligopoly:</strong> excess capacity; Nash, Cournot, Stackelberg, Bertrand; cartels.</li>' +
      '<li><strong>Game theory:</strong> dominant strategy, Nash equilibrium, prisoners’ dilemma, credible commitment.</li>' +
      '<li><strong>Factor markets:</strong> derived demand, \\(MRP_L = w\\), backward-bending labor supply, economic rent.</li>' +
      '<li><strong>Externalities &amp; public goods:</strong> \\(MSC = MC + MEC\\), Pigouvian fees, permits, Coase theorem, free-rider problem.</li>' +
      '</ul>' +

      '<div class="tip-box">' +
      '<h4>Exam strategy</h4>' +
      '<p>Closed questions reward exact <strong>conditions and formulas</strong> (\\(MR=MC\\), \\(MRS=P_x/P_y\\), Lerner index, \\(MSC=MSB\\)). Open questions reward <strong>concept + example</strong> (e.g. "negative externality → a factory’s pollution; fix with a Pigouvian fee"). Memorize one anchor per chapter, then connect them through the single margin rule.</p>' +
      '</div>' +

      '<p class="highlight">Every result is a special case of "set marginal benefit equal to marginal cost"; market failures (monopoly, externalities, public goods, missing information) are exactly the cases where private margins differ from social margins.</p>',
    image: null
  }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// No key collisions between K1 and K2 → 14 topic categories + examPractice = 15.
const microeconomicsFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.microeconomicsM1) ? window.microeconomicsM1 : {},
  (typeof window !== 'undefined' && window.microeconomicsM2) ? window.microeconomicsM2 : {},
  { examPractice: microeconomicsExamPractice }
);

if (typeof window !== 'undefined') { window.microeconomicsFinal = microeconomicsFinal; }
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(
    {},
    require('./midterm-1.js'),
    require('./midterm-2.js'),
    { examPractice: microeconomicsExamPractice }
  );
}
