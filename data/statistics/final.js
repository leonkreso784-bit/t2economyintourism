// ===== STATISTICS — Final Exam (hybrid) =====
// Same pattern as the other subjects' finals: the final lesson MERGES both midterms and adds
// one curated cross-topic "Exam Practice" category.
//   statisticsFinal = Object.assign({}, statisticsM1 (K1, T1–T6),
//                                   statisticsM2 (K2, T7–T9),
//                                   { examPractice })
// This file MUST load LAST (after midterm-1.js + midterm-2.js) because it reads
// window.statisticsM1 and window.statisticsM2 at module-load time.
//
// K1 (6 cats) + K2 (3 cats) have no key collisions → 9 topic categories + examPractice = 10.
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX (ADR-009). Inline "\\( ... \\)", display "\\[ ... \\]";
//   jedan `$` se NE koristi (valuta). LaTeX backslash u stringu = "\\".

const statisticsExamPractice = {
  id: "chm0xj",
  name: 'Exam Practice (All Tutorials)',
  icon: 'fa-graduation-cap',
  color: '#6366f1',

  flashcards: [
    {
      id: "ket15c",
      question: 'What is the overall arc of an introductory statistics course?',
      answer: 'Describe data (graphs + summary numbers) → quantify uncertainty (probability + distributions) → infer about a population from a sample (estimation + hypothesis testing) → model relationships between variables (regression). Each step builds on the previous one.'
    },
    {
      id: "e78hra",
      question: 'Descriptive vs. inferential statistics — restate the divide.',
      answer: 'Descriptive: summarize the data in hand (mean, SD, histograms). Inferential: use a sample to draw conclusions about the population (confidence intervals, hypothesis tests, regression) — always with a stated level of uncertainty.'
    },
    {
      id: "r2qo9e",
      question: 'What single quantity links sampling distributions, confidence intervals and hypothesis tests?',
      answer: 'The STANDARD ERROR. For a mean it is \\( \\sigma_{\\bar{x}}=\\dfrac{\\sigma}{\\sqrt{n}} \\): it sets the spread of the sampling distribution, the width of a confidence interval, and the denominator of a test statistic.'
    },
    {
      id: "ih5wpu",
      question: 'Summarize the key formulas for center and spread.',
      answer: '\\[ \\bar{x}=\\frac{\\sum x_i}{n}, \\quad s^2=\\frac{\\sum (x_i-\\bar{x})^2}{n-1}, \\quad CV=\\frac{s}{\\bar{x}}\\times 100\\% \\]'
    },
    {
      id: "ky3qmo",
      question: 'When do you use the binomial, the Poisson, and the normal distribution?',
      answer: '• Binomial: a fixed number \\(n\\) of independent success/failure trials.\n• Poisson: counts of events in a continuous interval at rate \\(\\lambda\\).\n• Normal: a continuous, bell-shaped variable — and the distribution of sample means by the CLT.'
    },
    {
      id: "k2klly",
      question: 'State the Central Limit Theorem and why it matters.',
      answer: 'For a large enough \\(n\\), the sample mean is approximately normal regardless of the population shape, with mean \\(\\mu\\) and standard error \\(\\sigma/\\sqrt{n}\\). It justifies using the normal/t machinery for inference about means.'
    },
    {
      id: "vv2k7k",
      question: 'How do you choose between z and t for a mean?',
      answer: 'If the population standard deviation \\(\\sigma\\) is KNOWN, use \\(z\\). If \\(\\sigma\\) is UNKNOWN (the usual case), use the sample \\(s\\) and the Student’s \\(t\\) distribution with \\(df=n-1\\).'
    },
    {
      id: "ok4xzt",
      question: 'Write the confidence interval and the test statistic for a mean (σ unknown).',
      answer: '\\[ \\text{CI:}\\quad \\bar{x}\\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt{n}}, \\qquad \\text{test:}\\quad t=\\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}} \\]\nThe two are mirror images — a value rejected by the test lies outside the corresponding interval.'
    },
    {
      id: "gsspeq",
      question: 'Contrast Type I and Type II errors and the role of α.',
      answer: 'Type I: reject a true \\(H_0\\) (probability \\(\\alpha\\), set in advance). Type II: fail to reject a false \\(H_0\\) (probability \\(\\beta\\); power \\(=1-\\beta\\)). Lowering \\(\\alpha\\) reduces Type I errors but, for fixed \\(n\\), raises \\(\\beta\\).'
    },
    {
      id: "yncmsd",
      question: 'Summarize simple linear regression: equation, fit, and inference.',
      answer: '\\[ \\hat{y}=b_0+b_1x, \\quad b_1=\\frac{\\sum(x-\\bar{x})(y-\\bar{y})}{\\sum(x-\\bar{x})^2}, \\quad R^2=\\frac{SSR}{SST} \\]\nTest \\(H_0:\\beta_1=0\\) with \\( t=\\dfrac{b_1}{s_{b_1}} \\) (\\(df=n-2\\)) to check for a significant linear relationship.'
    },
    {
      id: "txc1gh",
      question: 'How are confidence intervals and two-tailed tests two sides of one coin?',
      answer: 'A value \\(\\mu_0\\) lies INSIDE the \\((1-\\alpha)\\) confidence interval exactly when a two-tailed test at level \\(\\alpha\\) does NOT reject \\(H_0:\\mu=\\mu_0\\). Both rest on the same point estimate ± reliability factor × standard error.'
    },
    {
      id: "yuhnu3",
      question: 'What does R² tell you, and what does it NOT tell you?',
      answer: '\\(R^2=SSR/SST\\) is the proportion of variation in \\(Y\\) explained by \\(X\\) (0 to 1). It measures the strength of the linear fit but does NOT prove causation, nor that the model is correct outside the observed range.'
    }
  ],

  quiz: [
    {
      id: "xclgo7",
      question: 'Using a sample to draw conclusions about a population is:',
      options: ['Descriptive statistics', 'Inferential statistics', 'A census', 'A frequency table'],
      correct: 1
    },
    {
      id: "ypgyxj",
      question: 'The standard error of the mean is:',
      options: ['\\(\\sigma\\)', '\\(\\sigma/\\sqrt{n}\\)', '\\(s^2\\)', '\\(n\\sigma\\)'],
      correct: 1
    },
    {
      id: "hce51m",
      question: 'Counts of arrivals per minute are modeled with the:',
      options: ['Binomial', 'Poisson', 'Normal', 'Uniform'],
      correct: 1
    },
    {
      id: "puvfyl",
      question: 'The Central Limit Theorem makes the sample mean approximately:',
      options: ['Skewed', 'Normal', 'Binomial', 'Uniform'],
      correct: 1
    },
    {
      id: "9vbemj",
      question: 'When σ is unknown, inference about a mean uses the:',
      options: ['z distribution', 't distribution', 'F distribution', 'Poisson distribution'],
      correct: 1
    },
    {
      id: "2m1r7h",
      question: 'Rejecting a true null hypothesis is a:',
      options: ['Type II error', 'Type I error', 'Correct decision', 'p-value'],
      correct: 1
    },
    {
      id: "7vi4nq",
      question: 'A 95% confidence interval and a two-tailed test at α = 0.05 are:',
      options: ['Unrelated', 'Equivalent decisions', 'Both one-tailed', 'Always different'],
      correct: 1
    },
    {
      id: "omohsc",
      question: 'In regression, R² equals:',
      options: ['\\(SSE/SST\\)', '\\(SSR/SST\\)', '\\(SST/SSE\\)', '\\(n-2\\)'],
      correct: 1
    },
    {
      id: "6i5yhy",
      question: 'The least-squares regression line always passes through:',
      options: ['The origin', '\\((\\bar{x},\\bar{y})\\)', 'The maximum point', '\\((1,1)\\)'],
      correct: 1
    },
    {
      id: "bc18pp",
      question: 'Which is a measure of relative dispersion comparable across units?',
      options: ['Range', 'Coefficient of variation', 'IQR', 'Mode'],
      correct: 1
    },
    {
      id: "ifx4p5",
      question: 'The slope test in regression has null hypothesis:',
      options: ['\\(\\beta_1=0\\)', '\\(R^2=1\\)', '\\(b_0=0\\)', '\\(\\mu=0\\)'],
      correct: 0
    },
    {
      id: "kaql8c",
      question: 'Increasing the sample size makes a confidence interval:',
      options: ['Wider', 'Narrower', 'Unchanged', 'Skewed'],
      correct: 1
    }
  ],

  fillBlanks: [
    {
      id: "kssgri",
      sentence: 'Drawing conclusions about a population from a sample is _______ statistics.',
      answer: 'inferential'
    },
    {
      id: "s4au0y",
      sentence: 'The standard error of the mean is sigma over the square root of _______.',
      answer: 'n'
    },
    {
      id: "q6q569",
      sentence: 'The Central Limit Theorem makes the sample mean approximately _______.',
      answer: 'normal'
    },
    {
      id: "fcwww8",
      sentence: 'When the population σ is unknown, inference about a mean uses the _______ distribution.',
      answer: 't'
    },
    {
      id: "ynalhj",
      sentence: 'Rejecting a true null hypothesis is a Type _______ error.',
      answer: 'I'
    },
    {
      id: "cft6kd",
      sentence: 'The coefficient of determination R² equals SSR divided by _______.',
      answer: 'SST'
    },
    {
      id: "yobcji",
      sentence: 'The regression slope test has null hypothesis beta-1 equals _______.',
      answer: '0'
    },
    {
      id: "0editv",
      sentence: 'A larger sample makes a confidence interval _______.',
      answer: 'narrower'
    }
  ],

  learn: {
    id: "lc88a1",
    content:
      '<h3>Final Exam Roadmap — all nine tutorials</h3>' +
      '<p>Statistics tells one connected story: <strong>describe</strong> data, <strong>quantify</strong> uncertainty, <strong>infer</strong> about a population, and <strong>model</strong> relationships. Drill the per-tutorial categories in this lesson, then use this set to link them.</p>' +

      '<div class="formula-box">\\[ \\begin{aligned}' +
      '\\text{Center \\& spread:}\\quad & \\bar{x}=\\frac{\\sum x_i}{n},\\quad s^2=\\frac{\\sum (x_i-\\bar{x})^2}{n-1}\\\\[2pt]' +
      '\\text{Standardize:}\\quad & Z=\\frac{X-\\mu}{\\sigma}\\\\[2pt]' +
      '\\text{Standard error:}\\quad & \\sigma_{\\bar{x}}=\\frac{\\sigma}{\\sqrt{n}}\\\\[2pt]' +
      '\\text{CI for a mean:}\\quad & \\bar{x}\\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt{n}}\\\\[2pt]' +
      '\\text{Test for a mean:}\\quad & t=\\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}\\\\[2pt]' +
      '\\text{Regression:}\\quad & \\hat{y}=b_0+b_1x,\\quad R^2=\\frac{SSR}{SST}' +
      '\\end{aligned} \\]</div>' +

      '<h4>First midterm (T1–T6)</h4>' +
      '<ul>' +
      '<li><strong>Describing data:</strong> data types &amp; graphs; mean/median/mode, variance, SD, CV, IQR; empirical rule &amp; Chebyshev.</li>' +
      '<li><strong>Probability:</strong> sample space, unions/intersections, \\(P(A\\cup B)=P(A)+P(B)-P(A\\cap B)\\), conditional probability, independence.</li>' +
      '<li><strong>Random variables:</strong> \\(E(X)=\\sum xP(x)\\); binomial (\\(\\mu=nP\\)), Poisson (\\(\\mu=\\sigma^2=\\lambda\\)); the normal distribution and Z-scores.</li>' +
      '<li><strong>Sampling distributions:</strong> standard error \\(\\sigma/\\sqrt{n}\\) and the Central Limit Theorem.</li>' +
      '</ul>' +

      '<h4>Second midterm (T7–T9)</h4>' +
      '<ul>' +
      '<li><strong>Confidence intervals:</strong> point estimate ± reliability × standard error; z (σ known) or t (σ unknown, \\(df=n-1\\)); proportions.</li>' +
      '<li><strong>Hypothesis testing:</strong> \\(H_0\\) vs \\(H_1\\); Type I (\\(\\alpha\\)) and Type II (\\(\\beta\\)) errors; z/t test statistics; p-value rule \\(p<\\alpha\\).</li>' +
      '<li><strong>Regression:</strong> least-squares \\(b_0,b_1\\); \\(SST=SSR+SSE\\); \\(R^2\\); slope test \\(t=b_1/s_{b_1}\\) (\\(df=n-2\\)).</li>' +
      '</ul>' +

      '<div class="tip-box">' +
      '<h4>Exam strategy</h4>' +
      '<p>Closed questions reward exact <strong>formulas and definitions</strong> (standard error, the empirical rule, \\(R^2=SSR/SST\\), Type I vs II). Open/numeric questions reward a clear <strong>method</strong>: write the formula, plug in, compute, then interpret in context (“with 95% confidence …”, “reject \\(H_0\\) because …”). Watch one/two-tailed wording and z-vs-t choice.</p>' +
      '</div>' +

      '<div class="warning-box">' +
      '<h4><i class="fas fa-exclamation-triangle"></i> Cross-topic traps that cost marks</h4>' +
      '<p>• <strong>Standard error vs. standard deviation:</strong> use \\(\\sigma/\\sqrt{n}\\) for a sample mean, plain \\(\\sigma\\) for a single observation.</p>' +
      '<p>• <strong>z vs. t:</strong> \\(\\sigma\\) known → z; \\(\\sigma\\) unknown (use \\(s\\)) → t with \\(df=n-1\\) (or \\(n-2\\) in regression).</p>' +
      '<p>• <strong>Variance vs. SD</strong> in \\(N(\\mu,\\sigma^2)\\): take the square root before standardising.</p>' +
      '<p>• <strong>One- vs. two-tailed:</strong> decide from the wording and split \\(\\alpha\\) only for “≠”; never read significance off causation.</p>' +
      '</div>' +

      '<p class="highlight">The whole second half is one idea applied twice — point estimate ± reliability × standard error — once to build intervals and once (rearranged) to test hypotheses; regression then extends inference to the slope between two variables.</p>',
    image: null
  }
};

// Merge both midterms (read from window at load time) + the exam-practice category.
// No key collisions between K1 (6) and K2 (3) → 9 topic categories + examPractice = 10.
const statisticsFinal = Object.assign(
  {},
  (typeof window !== 'undefined' && window.statisticsM1) ? window.statisticsM1 : {},
  (typeof window !== 'undefined' && window.statisticsM2) ? window.statisticsM2 : {},
  { examPractice: statisticsExamPractice }
);

if (typeof window !== 'undefined') { window.statisticsFinal = statisticsFinal; }
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Object.assign(
    {},
    require('./midterm-1.js'),
    require('./midterm-2.js'),
    { examPractice: statisticsExamPractice }
  );
}
