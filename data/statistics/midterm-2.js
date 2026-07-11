// ===== STATISTICS — 2. KOLOKVIJ (K2) =====
// Newbold/Carlson/Thorne, Statistics for Business & Economics — Tutorials T7–T9.
// K1/K2 granica iz službenih midterm-materijala (DINP 2024/25): K1 = T1–T6, K2 = T7–T9.
//   K2: confidence interval estimation (one population) · hypothesis testing (single population) ·
//       regression analysis
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX (ADR-009). Inline "\\( ... \\)", display "\\[ ... \\]";
//   jedan `$` se NE koristi (valuta). LaTeX backslash u stringu = "\\".

const statisticsM2 = {
  confidenceIntervals: {
    id: "b9sflx",
    name: 'Confidence Interval Estimation',
    icon: 'fa-ruler-horizontal',
    color: '#0ea5e9',

    flashcards: [
      {
        id: "chjkfo",
        question: 'Distinguish an estimator from an estimate, and a point estimate from an interval estimate.',
        answer: 'An estimator is a random variable (a rule) based on sample data; a specific computed value of it is an estimate.\nA point estimate is a single number (e.g. \\(\\bar{x}\\)); an interval estimate (confidence interval) gives a RANGE that reflects sampling variability.'
      },
      {
        id: "nkcz6m",
        question: 'What is the general structure of every confidence interval?',
        answer: '\\[ \\text{Point estimate} \\pm (\\text{Reliability factor})\\times(\\text{Standard error}) \\]\nThe reliability factor (a \\(z\\) or \\(t\\) value) depends on the chosen confidence level.'
      },
      {
        id: "4d7zq3",
        question: 'How is a 95% confidence level interpreted?',
        answer: 'In repeated sampling, about 95% of all the intervals constructed this way would contain the true parameter. A single specific interval either does or does not contain it — there is no probability attached to one realized interval. You can never be 100% confident.'
      },
      {
        id: "t8ro4l",
        question: 'Write the confidence interval for μ when σ is KNOWN.',
        answer: '\\[ \\bar{x} \\pm z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt{n}} \\]\nValid when the population is normal (or \\(n\\) is large). The margin of error is \\( ME = z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}} \\).'
      },
      {
        id: "wrns7g",
        question: 'Give the z reliability factors for 90%, 95% and 99% confidence.',
        answer: '• 90% → \\( z_{\\alpha/2} = 1.645 \\)\n• 95% → \\( z_{\\alpha/2} = 1.96 \\)\n• 99% → \\( z_{\\alpha/2} = 2.58 \\)'
      },
      {
        id: "rkyhs4",
        question: 'Write the confidence interval for μ when σ is UNKNOWN.',
        answer: '\\[ \\bar{x} \\pm t_{n-1,\\,\\alpha/2}\\,\\frac{s}{\\sqrt{n}} \\]\nWe replace \\(\\sigma\\) with the sample SD \\(s\\) and use the Student’s \\(t\\) distribution.'
      },
      {
        id: "e8u5pe",
        question: 'What is the Student’s t distribution and its degrees of freedom?',
        answer: 'A family of bell-shaped distributions, slightly wider than the normal, used when \\(\\sigma\\) is unknown. It has \\( df = n-1 \\) degrees of freedom; as \\(n\\) grows, \\(t\\) approaches the standard normal.'
      },
      {
        id: "lk2sxf",
        question: 'Why use the t distribution instead of z when σ is unknown?',
        answer: 'Replacing \\(\\sigma\\) with the sample \\(s\\) adds extra uncertainty (because \\(s\\) varies from sample to sample). The \\(t\\) distribution has heavier tails to account for it, giving a correctly wider interval.'
      },
      {
        id: "2orx6z",
        question: 'Write the confidence interval for a population proportion.',
        answer: '\\[ \\hat{p} \\pm z_{\\alpha/2}\\,\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}} \\]\nwhere \\( \\hat{p}=x/n \\). It uses the normal approximation, valid for large \\(n\\).'
      },
      {
        id: "ow3qlj",
        question: 'What is the margin of error, and how does it relate to interval width?',
        answer: 'The margin of error is the half-width: \\( ME = (\\text{reliability factor})\\times(\\text{standard error}) \\). The full interval width is \\( w = 2\\,ME \\).'
      },
      {
        id: "dqmdvw",
        question: 'What happens to the width of a confidence interval as n increases or confidence rises?',
        answer: 'Larger \\(n\\) → smaller standard error → NARROWER interval (more precise). Higher confidence level → larger reliability factor → WIDER interval. There is a trade-off between precision and confidence.'
      },
      {
        id: "3mkg21",
        question: 'What three things widen a confidence interval?',
        answer: '1. A higher confidence level (bigger \\(z\\) or \\(t\\)).\n2. A larger standard deviation / variability.\n3. A smaller sample size \\(n\\).'
      }
    ],

    quiz: [
      {
        id: "vm4aoe",
        question: 'A single-number estimate of a parameter is a:',
        options: ['Interval estimate', 'Point estimate', 'Confidence level', 'Reliability factor'],
        correct: 1
      },
      {
        id: "3kjlfu",
        question: 'Every confidence interval equals the point estimate plus or minus:',
        options: ['The variance', '(Reliability factor)(Standard error)', 'The sample size', 'The mean'],
        correct: 1
      },
      {
        id: "0pjkx5",
        question: 'For a 95% confidence interval (σ known), the z value is:',
        options: ['1.645', '1.96', '2.33', '2.58'],
        correct: 1
      },
      {
        id: "0jvu1c",
        question: 'When σ is unknown, the confidence interval for μ uses the:',
        options: ['z distribution', 'Student’s t distribution', 'Binomial distribution', 'Poisson distribution'],
        correct: 1
      },
      {
        id: "1aefqi",
        question: 'The degrees of freedom for a one-sample t interval are:',
        options: ['\\(n\\)', '\\(n-1\\)', '\\(n-2\\)', '\\(2n\\)'],
        correct: 1
      },
      {
        id: "ooujfa",
        question: 'The margin of error is the _______ of the confidence interval.',
        options: ['Full width', 'Half-width', 'Center', 'Standard deviation'],
        correct: 1
      },
      {
        id: "rgh3v8",
        question: 'As the sample size increases, a confidence interval becomes:',
        options: ['Wider', 'Narrower', 'Unchanged', 'Skewed'],
        correct: 1
      },
      {
        id: "15t107",
        question: 'Raising the confidence level from 90% to 99% makes the interval:',
        options: ['Narrower', 'Wider', 'Unchanged', 'Negative'],
        correct: 1
      },
      {
        id: "j3far8",
        question: 'The confidence interval for a proportion uses the standard error:',
        options: ['\\(\\sqrt{\\hat{p}(1-\\hat{p})/n}\\)', '\\(\\sigma/\\sqrt{n}\\)', '\\(s/\\sqrt{n}\\)', '\\(\\hat{p}/n\\)'],
        correct: 0
      },
      {
        id: "g2r96y",
        question: 'The width of a confidence interval equals:',
        options: ['\\(ME\\)', '\\(2\\,ME\\)', '\\(ME/2\\)', '\\(ME^2\\)'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        id: "qk713d",
        sentence: 'A single number estimating a parameter is a _______ estimate.',
        answer: 'point'
      },
      {
        id: "micpht",
        sentence: 'A confidence interval = point estimate ± reliability factor × standard _______.',
        answer: 'error'
      },
      {
        id: "i8h2m1",
        sentence: 'For 95% confidence with σ known, the z value is _______.',
        answer: '1.96'
      },
      {
        id: "0x5hxc",
        sentence: 'When the population σ is unknown, we use the Student’s _______ distribution.',
        answer: 't'
      },
      {
        id: "wo3zl9",
        sentence: 'The t distribution has n minus _______ degrees of freedom.',
        answer: '1'
      },
      {
        id: "jykhq4",
        sentence: 'The half-width of a confidence interval is the margin of _______.',
        answer: 'error'
      },
      {
        id: "fhtixm",
        sentence: 'Increasing the sample size makes the interval _______.',
        answer: 'narrower'
      },
      {
        id: "6wkd1u",
        sentence: 'A higher confidence level makes the interval _______.',
        answer: 'wider'
      }
    ],

    learn: {
      id: "gz8pfq",
      content:
        '<h3>Confidence Interval Estimation</h3>' +
        '<p>K1 ended with the sampling distribution — the realisation that one sample’s \\(\\bar{x}\\) is just one draw from a distribution centred on \\(\\mu\\). Confidence intervals turn that insight into a practical tool: instead of reporting a single guess, we report a <strong>range</strong> that honestly admits sampling uncertainty. This is <strong>estimation</strong>, the first half of inference.</p>' +

        '<h4>Point vs. interval estimate</h4>' +
        '<p>A <strong>point estimate</strong> like \\(\\bar{x}\\) is a single best guess for \\(\\mu\\) — simple, but it is almost certainly a little off, and it says nothing about <em>how</em> off it might be. A <strong>confidence interval</strong> surrounds the point estimate with a margin, and every interval ever built has the same three-part shape:</p>' +
        '<div class="formula-box">\\[ \\text{Point estimate} \\pm \\underbrace{(\\text{reliability factor})}_{z \\text{ or } t}\\times\\underbrace{(\\text{standard error})}_{\\text{sampling variability}} \\]</div>' +
        '<p>The <strong>reliability factor</strong> (a \\(z\\) or \\(t\\) value) is set by how confident you want to be; the <strong>standard error</strong> is the sampling variability from K1. Together they form the <strong>margin of error</strong> — the half-width of the interval.</p>' +

        '<h4>Interval for the mean: z when σ known, t when unknown</h4>' +
        '<div class="formula-box">\\[ \\sigma \\text{ known:}\\quad \\bar{x} \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}, \\qquad \\sigma \\text{ unknown:}\\quad \\bar{x} \\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt{n}} \\]</div>' +
        '<p>In practice we almost never know the population \\(\\sigma\\), so we estimate it with the sample \\(s\\) — and that substitution adds extra uncertainty, because \\(s\\) itself wobbles from sample to sample. The <strong>Student’s t</strong> distribution (\\(df=n-1\\)) absorbs that with slightly <strong>heavier tails</strong>, giving a correctly wider interval; as \\(n\\) grows, \\(t\\) converges to \\(z\\). Common z factors: 90% → 1.645, 95% → 1.96, 99% → 2.58.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — 95% interval for μ (σ known)</h4>' +
        '<p>\\( \\bar{x}=75 \\) minutes, \\( \\sigma=20 \\), \\( n=64 \\). The standard error is \\( 20/\\sqrt{64}=2.5 \\):</p>' +
        '<div class="formula-box">\\[ ME = 1.96\\times 2.5 = 4.9 \\;\\Rightarrow\\; 75 \\pm 4.9 = (70.1,\\ 79.9) \\]</div>' +
        '<p>With 95% confidence, the true mean shopping time lies between 70.1 and 79.9 minutes.</p>' +
        '</div>' +

        '<h4>Precision vs. confidence — the central trade-off</h4>' +
        '<p>The interval <strong>width</strong> is \\( w = 2\\,ME \\), and three forces widen it: a <strong>higher confidence level</strong> (bigger \\(z\\)/\\(t\\)), <strong>more variability</strong> (bigger \\(\\sigma\\)/\\(s\\)), and a <strong>smaller sample</strong> (\\(\\sqrt{n}\\) in the denominator). You cannot have it all: demanding 99% confidence buys certainty at the cost of a vaguer (wider) interval. The only way to be both more confident <em>and</em> more precise is to collect more data.</p>' +

        '<div class="tip-box">' +
        '<h4>Interval for a proportion</h4>' +
        '<p>For a population proportion, the point estimate is \\( \\hat{p}=x/n \\) and the standard error uses \\(\\hat{p}\\) itself:</p>' +
        '<div class="formula-box">\\[ \\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}} \\]</div>' +
        '<p>It relies on the normal approximation, so it needs a reasonably large \\(n\\).</p>' +
        '</div>' +

        '<div class="warning-box">' +
        '<h4><i class="fas fa-exclamation-triangle"></i> What 95% confidence does and doesn’t mean</h4>' +
        '<p>It means that <strong>over many repeated samples, about 95% of the intervals</strong> built this way would capture the true parameter. It does <strong>not</strong> mean a single realised interval has a 95% probability of containing \\(\\mu\\) — that interval either does or doesn’t; the randomness was in the sampling, not in the fixed parameter. And you can never be 100% confident without measuring the whole population.</p>' +
        '</div>' +

        '<p class="highlight">Confidence interval = best guess ± (how sure you want to be) × (how noisy the data are). Narrow it by collecting more data, not by lowering your confidence.</p>',
      image: null
    }
  },

  hypothesisTesting: {
    id: "gys9a3",
    name: 'Hypothesis Testing (Single Population)',
    icon: 'fa-scale-balanced',
    color: '#8b5cf6',

    flashcards: [
      {
        id: "4a54o8",
        question: 'What is a statistical hypothesis, and what are H0 and H1?',
        answer: 'A hypothesis is a claim about a population parameter. The NULL hypothesis \\(H_0\\) is the status quo (always contains \\(=,\\ \\le,\\ \\ge\\)); the ALTERNATIVE \\(H_1\\) is its opposite (\\(\\ne,\\ <,\\ >\\)) and is what the researcher tries to support.'
      },
      {
        id: "gfhm94",
        question: 'How do we treat the null hypothesis (the logic of testing)?',
        answer: 'We assume \\(H_0\\) is true and look for evidence against it — “innocent until proven guilty”. We either REJECT \\(H_0\\) (strong evidence for \\(H_1\\)) or FAIL TO REJECT it (insufficient evidence); we never “prove” \\(H_0\\).'
      },
      {
        id: "hbaw7b",
        question: 'Define the level of significance α.',
        answer: 'The probability of rejecting a true null hypothesis — the size of the rejection region. It is chosen in advance (typically 0.01, 0.05 or 0.10) and supplies the critical value(s).'
      },
      {
        id: "kblbg9",
        question: 'Define Type I and Type II errors.',
        answer: '• Type I error: rejecting a TRUE \\(H_0\\); its probability is \\(\\alpha\\) (considered serious).\n• Type II error: failing to reject a FALSE \\(H_0\\); its probability is \\(\\beta\\).\nThe power of a test is \\(1-\\beta\\).'
      },
      {
        id: "d6ls92",
        question: 'Write the test statistic for a mean when σ is known.',
        answer: '\\[ z = \\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}} \\]\nReject \\(H_0\\) if \\(z\\) falls in the rejection region defined by the critical value(s).'
      },
      {
        id: "najvre",
        question: 'Write the test statistic for a mean when σ is unknown.',
        answer: '\\[ t = \\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}} \\quad (df=n-1) \\]\nUse the Student’s t distribution with the sample standard deviation \\(s\\).'
      },
      {
        id: "dx575c",
        question: 'How do one-tailed and two-tailed tests differ?',
        answer: 'A two-tailed test (\\(H_1:\\mu\\ne\\mu_0\\)) splits \\(\\alpha\\) into both tails. A one-tailed test puts all of \\(\\alpha\\) in one tail: right tail for \\(H_1:\\mu>\\mu_0\\), left tail for \\(H_1:\\mu<\\mu_0\\).'
      },
      {
        id: "11vrtm",
        question: 'What is the p-value, and the decision rule based on it?',
        answer: 'The p-value is the probability of a test statistic at least as extreme as the observed one, ASSUMING \\(H_0\\) is true (the smallest \\(\\alpha\\) at which \\(H_0\\) is rejected). Rule: if \\( p < \\alpha \\) reject \\(H_0\\); if \\( p \\ge \\alpha \\) do not reject.'
      },
      {
        id: "ziw9eb",
        question: 'Write the test statistic for a population proportion.',
        answer: '\\[ z = \\frac{\\hat{p}-P_0}{\\sqrt{P_0(1-P_0)/n}} \\]\nwhere \\( \\hat{p}=x/n \\). Valid for large samples (normal approximation).'
      },
      {
        id: "b33t04",
        question: 'What are the two equivalent decision rules in hypothesis testing?',
        answer: '1. Critical-value rule: reject \\(H_0\\) if the test statistic falls beyond the critical value.\n2. p-value rule: reject \\(H_0\\) if \\( p < \\alpha \\).\nBoth always lead to the same conclusion.'
      },
      {
        id: "kvndoo",
        question: 'Which error does decreasing α reduce, and at what cost?',
        answer: 'A smaller \\(\\alpha\\) reduces the chance of a Type I error (rejecting a true \\(H_0\\)), but — holding \\(n\\) fixed — it raises \\(\\beta\\), the chance of a Type II error, lowering the power \\(1-\\beta\\).'
      }
    ],

    quiz: [
      {
        id: "5jbb6t",
        question: 'The null hypothesis H0 always contains:',
        options: ['Only \\(\\ne\\)', 'An equality (\\(=,\\le,\\ge\\))', 'Only \\(<\\)', 'No parameter'],
        correct: 1
      },
      {
        id: "v255g7",
        question: 'Rejecting a TRUE null hypothesis is a:',
        options: ['Type II error', 'Type I error', 'Correct decision', 'p-value'],
        correct: 1
      },
      {
        id: "gops8u",
        question: 'The probability of a Type I error equals:',
        options: ['\\(\\beta\\)', '\\(\\alpha\\)', '\\(1-\\beta\\)', 'the p-value'],
        correct: 1
      },
      {
        id: "xnueav",
        question: 'Failing to reject a FALSE null hypothesis is a:',
        options: ['Type I error', 'Type II error', 'Correct decision', 'Critical value'],
        correct: 1
      },
      {
        id: "h5n0db",
        question: 'The power of a test equals:',
        options: ['\\(\\alpha\\)', '\\(\\beta\\)', '\\(1-\\beta\\)', '\\(1-\\alpha\\)'],
        correct: 2
      },
      {
        id: "ikgmbb",
        question: 'When σ is unknown, the test statistic for a mean follows the:',
        options: ['z distribution', 't distribution', 'binomial distribution', 'F distribution'],
        correct: 1
      },
      {
        id: "xy7jh9",
        question: 'Using the p-value, we reject H0 when:',
        options: ['\\(p \\ge \\alpha\\)', '\\(p < \\alpha\\)', '\\(p = 1\\)', '\\(p > 0.5\\)'],
        correct: 1
      },
      {
        id: "x8kny1",
        question: 'A test of \\(H_1:\\mu \\ne \\mu_0\\) is:',
        options: ['Right-tailed', 'Left-tailed', 'Two-tailed', 'Not a valid test'],
        correct: 2
      },
      {
        id: "901pp4",
        question: 'The test statistic \\(z=(\\bar{x}-\\mu_0)/(\\sigma/\\sqrt{n})\\) is used when σ is:',
        options: ['Unknown', 'Known', 'Zero', 'Negative'],
        correct: 1
      },
      {
        id: "ws1ejz",
        question: 'The significance level α is chosen:',
        options: ['After seeing the data', 'In advance by the researcher', 'Always 0.5', 'By the sample size'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        id: "blx2ez",
        sentence: 'The status-quo claim being tested is the _______ hypothesis.',
        answer: 'null'
      },
      {
        id: "mlrzqw",
        sentence: 'The probability of a Type I error is denoted by _______.',
        answer: 'alpha',
        hint: 'The Greek letter \\(\\alpha\\).'
      },
      {
        id: "xjotrp",
        sentence: 'Rejecting a true null hypothesis is a Type _______ error.',
        answer: 'I'
      },
      {
        id: "m8bl3d",
        sentence: 'Failing to reject a false null hypothesis is a Type _______ error.',
        answer: 'II'
      },
      {
        id: "txu7bl",
        sentence: 'The power of a test equals 1 minus _______.',
        answer: 'beta',
        hint: 'The Greek letter \\(\\beta\\).'
      },
      {
        id: "gv7k57",
        sentence: 'When σ is unknown, the test of a mean uses the _______ distribution.',
        answer: 't'
      },
      {
        id: "cu81no",
        sentence: 'Using the p-value, reject H0 when p is less than _______.',
        answer: 'alpha'
      },
      {
        id: "ojmki3",
        sentence: 'A test with H1 using “≠” is a _______-tailed test.',
        answer: 'two'
      }
    ],

    learn: {
      id: "njykia",
      content:
        '<h3>Hypothesis Testing (Single Population)</h3>' +
        '<p>Confidence intervals <em>estimate</em> a parameter; hypothesis tests <strong>decide</strong> between two competing claims about it. This is the second half of inference, and the engine is identical — the same standard error from K1 — but now the question is yes/no: is there enough evidence to overturn the status quo?</p>' +

        '<h4>The two hypotheses</h4>' +
        '<p>Every test pits two statements against each other:</p>' +
        '<ul>' +
        '<li>The <strong>null hypothesis</strong> \\(H_0\\) is the status quo / “no effect” claim. It always contains an equality (\\(=,\\le,\\ge\\)) and is the statement we put on trial.</li>' +
        '<li>The <strong>alternative</strong> \\(H_1\\) is its opposite (\\(\\ne,<,>\\)) — usually what the researcher actually hopes to show.</li>' +
        '</ul>' +
        '<p>The logic is a courtroom: <strong>“innocent until proven guilty.”</strong> We <em>assume</em> \\(H_0\\) is true and ask whether the data are too unlikely under that assumption to believe. So we only ever <strong>reject \\(H_0\\)</strong> (strong evidence for \\(H_1\\)) or <strong>fail to reject</strong> it (insufficient evidence) — we never “accept” or “prove” \\(H_0\\), just as a verdict of “not guilty” is not “proven innocent.”</p>' +

        '<h4>Two ways to be wrong</h4>' +
        '<ul>' +
        '<li><strong>Type I error</strong> — rejecting a <em>true</em> \\(H_0\\) (a false alarm). Its probability is the <strong>significance level \\(\\alpha\\)</strong>, chosen in advance (typically 0.01, 0.05, 0.10).</li>' +
        '<li><strong>Type II error</strong> — failing to reject a <em>false</em> \\(H_0\\) (a missed detection). Its probability is \\(\\beta\\); the test’s <strong>power</strong> is \\(1-\\beta\\).</li>' +
        '</ul>' +
        '<p>The two trade off: shrinking \\(\\alpha\\) (fewer false alarms) raises \\(\\beta\\) (more misses) for a fixed \\(n\\). The only way to lower both at once is a larger sample.</p>' +

        '<h4>Test statistic — how many standard errors from H₀?</h4>' +
        '<p>The test statistic measures how far the observed \\(\\bar{x}\\) sits from the hypothesised \\(\\mu_0\\), in standard-error units (exactly a Z-score built around the null):</p>' +
        '<div class="formula-box">\\[ \\sigma \\text{ known:}\\quad z=\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}, \\qquad \\sigma \\text{ unknown:}\\quad t=\\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}\\ (df=n-1) \\]</div>' +
        '<p>The <strong>tail</strong> follows the question: “different” → two-tailed (split \\(\\alpha\\) both sides); “greater/increased” → right tail; “less/decreased” → left tail.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — right-tailed z test</h4>' +
        '<p>\\(H_0:\\mu\\le 25\\) vs. \\(H_1:\\mu>25\\); \\(\\bar{x}=26.4\\), \\(\\sigma=6\\), \\(n=40\\), \\(\\alpha=0.01\\).</p>' +
        '<div class="formula-box">\\[ z=\\frac{26.4-25}{6/\\sqrt{40}}=\\frac{1.4}{0.949}=1.48 \\]</div>' +
        '<p>The critical value is \\(z_{0.01}=2.33\\). Since \\(1.48<2.33\\) (and \\(p=0.069>0.01\\)), we <strong>fail to reject</strong> \\(H_0\\): not enough evidence that \\(\\mu>25\\).</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Two equivalent decision rules</h4>' +
        '<p><strong>Critical-value rule:</strong> reject \\(H_0\\) if the test statistic falls beyond the critical value. <strong>p-value rule:</strong> reject if \\( p<\\alpha \\), where the <strong>p-value</strong> is the probability of a result at least as extreme as observed <em>assuming \\(H_0\\) is true</em>. They always agree. For a proportion the statistic is \\( z=\\dfrac{\\hat{p}-P_0}{\\sqrt{P_0(1-P_0)/n}} \\) (note the standard error uses the <em>hypothesised</em> \\(P_0\\)).</p>' +
        '</div>' +

        '<div class="warning-box">' +
        '<h4><i class="fas fa-exclamation-triangle"></i> Common pitfalls</h4>' +
        '<p>• “Fail to reject \\(H_0\\)” is <strong>not</strong> “\\(H_0\\) is true” — only that evidence was insufficient.</p>' +
        '<p>• A small <strong>p-value</strong> is evidence against \\(H_0\\); it is <strong>not</strong> the probability that \\(H_0\\) is true.</p>' +
        '<p>• Decide the <strong>tail and \\(\\alpha\\) before</strong> seeing the data — choosing them afterwards to get significance invalidates the test.</p>' +
        '</div>' +

        '<p class="highlight">A hypothesis test asks one question: are the data too surprising to keep believing \\(H_0\\)? If \\(p<\\alpha\\) (or the statistic beats the critical value), yes — reject.</p>',
      image: null
    }
  },

  regression: {
    id: "8gbplh",
    name: 'Regression Analysis',
    icon: 'fa-chart-line',
    color: '#10b981',

    flashcards: [
      {
        id: "niewgh",
        question: 'What is the purpose of regression analysis?',
        answer: 'To model the relationship between variables — to PREDICT a dependent variable \\(Y\\) from one or more independent variables \\(X\\), and to EXPLAIN how changes in \\(X\\) affect \\(Y\\).'
      },
      {
        id: "ibdn8q",
        question: 'Write the population and estimated simple linear regression models.',
        answer: 'Population: \\( Y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i \\) (with random error \\(\\varepsilon\\)).\nEstimated: \\( \\hat{y}_i = b_0 + b_1 x_i \\), where \\(b_0,b_1\\) estimate \\(\\beta_0,\\beta_1\\).'
      },
      {
        id: "utkow4",
        question: 'Which variable is dependent and which is independent?',
        answer: 'The DEPENDENT variable \\(Y\\) is the one we explain/predict (endogenous). The INDEPENDENT variable \\(X\\) is the explanatory one (exogenous). Changes in \\(Y\\) are assumed to be caused by changes in \\(X\\).'
      },
      {
        id: "ka2fvy",
        question: 'What does the method of least squares do?',
        answer: 'It chooses \\(b_0\\) and \\(b_1\\) to MINIMIZE the sum of squared residuals (errors):\n\\[ \\min \\sum (y_i-\\hat{y}_i)^2 = \\min \\;SSE \\]'
      },
      {
        id: "zujpzf",
        question: 'Write the least-squares slope and intercept.',
        answer: '\\[ b_1 = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sum (x_i-\\bar{x})^2}, \\qquad b_0 = \\bar{y} - b_1\\bar{x} \\]\nThe line always passes through the point \\((\\bar{x},\\bar{y})\\).'
      },
      {
        id: "5o1p4n",
        question: 'How do you interpret the slope b1 and intercept b0?',
        answer: '\\(b_1\\): the estimated change in the average value of \\(Y\\) for a one-unit increase in \\(X\\).\n\\(b_0\\): the estimated average value of \\(Y\\) when \\(X=0\\) (meaningful only if \\(X=0\\) is within the data range).'
      },
      {
        id: "wlnvkj",
        question: 'Decompose total variation: write SST, SSR and SSE.',
        answer: '\\[ SST = SSR + SSE \\]\n\\( SST=\\sum(y_i-\\bar{y})^2 \\) (total), \\( SSR=\\sum(\\hat{y}_i-\\bar{y})^2 \\) (explained), \\( SSE=\\sum(y_i-\\hat{y}_i)^2 \\) (unexplained / error).'
      },
      {
        id: "kfzg3v",
        question: 'Define the coefficient of determination R².',
        answer: '\\[ R^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST}, \\qquad 0 \\le R^2 \\le 1 \\]\nIt is the proportion of the variation in \\(Y\\) explained by \\(X\\) (and equals \\(r^2\\) in simple regression).'
      },
      {
        id: "8b208h",
        question: 'How do you estimate the model error variance?',
        answer: '\\[ s_e^2 = \\frac{SSE}{n-2} \\]\nWe divide by \\(n-2\\) because two parameters (\\(b_0\\) and \\(b_1\\)) were estimated. \\(s_e\\) is the standard error of the estimate.'
      },
      {
        id: "4jeypi",
        question: 'How do you test whether a linear relationship exists (slope test)?',
        answer: 'Test \\(H_0:\\beta_1=0\\) (no linear relationship) vs. \\(H_1:\\beta_1\\ne 0\\) using\n\\[ t=\\frac{b_1-\\beta_1}{s_{b_1}} \\quad (df=n-2) \\]\nReject \\(H_0\\) if \\(|t|\\) exceeds the critical value — then the relationship is significant.'
      },
      {
        id: "pll57j",
        question: 'What is the relationship between the t and F statistics in simple regression?',
        answer: 'For simple (one-predictor) regression the F statistic equals the square of the slope t statistic: \\( F = t^2 \\). Both test the same hypothesis \\( \\beta_1=0 \\) and give the same conclusion.'
      },
      {
        id: "xma2bw",
        question: 'What are the key assumptions of the linear regression model?',
        answer: 'Linearity (Y is linear in X plus error); errors independent of X; errors have mean 0 and constant variance \\(\\sigma^2\\) (homoscedasticity); and errors are uncorrelated with each other.'
      }
    ],

    quiz: [
      {
        id: "sm2d9q",
        question: 'In regression, the variable we predict is the:',
        options: ['Independent variable', 'Dependent variable', 'Residual', 'Slope'],
        correct: 1
      },
      {
        id: "xe1dhx",
        question: 'The least-squares method minimizes:',
        options: ['\\(SSR\\)', '\\(\\sum (y_i-\\hat{y}_i)^2\\) (SSE)', '\\(R^2\\)', 'the slope'],
        correct: 1
      },
      {
        id: "rum4p8",
        question: 'The slope b1 measures the change in average Y for a one-unit change in:',
        options: ['Y', 'X', 'the residual', 'SST'],
        correct: 1
      },
      {
        id: "wwxeao",
        question: 'The regression line always passes through:',
        options: ['The origin', '\\((\\bar{x},\\bar{y})\\)', '\\((0,1)\\)', 'the largest point'],
        correct: 1
      },
      {
        id: "tfovc6",
        question: 'Total variation decomposes as:',
        options: ['\\(SST=SSR-SSE\\)', '\\(SST=SSR+SSE\\)', '\\(SSE=SSR+SST\\)', '\\(SSR=SST\\times SSE\\)'],
        correct: 1
      },
      {
        id: "fp9nfy",
        question: 'The coefficient of determination R² equals:',
        options: ['\\(SSE/SST\\)', '\\(SSR/SST\\)', '\\(SST/SSR\\)', '\\(1+SSE/SST\\)'],
        correct: 1
      },
      {
        id: "u870or",
        question: 'R² of 0.77 means that 77% of the variation in Y is:',
        options: ['Unexplained', 'Explained by X', 'Due to error', 'Random'],
        correct: 1
      },
      {
        id: "tacak6",
        question: 'The model error variance is estimated by dividing SSE by:',
        options: ['\\(n\\)', '\\(n-1\\)', '\\(n-2\\)', '\\(n+2\\)'],
        correct: 2
      },
      {
        id: "0aq8ou",
        question: 'The slope t test has null hypothesis:',
        options: ['\\(\\beta_1=0\\)', '\\(\\beta_1>0\\)', '\\(b_1=1\\)', '\\(R^2=0.5\\)'],
        correct: 0
      },
      {
        id: "sdl3i6",
        question: 'In simple regression, the F statistic equals:',
        options: ['\\(t\\)', '\\(t^2\\)', '\\(\\sqrt{t}\\)', '\\(R^2\\)'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        id: "ksptjs",
        sentence: 'The variable we try to explain is the _______ variable.',
        answer: 'dependent'
      },
      {
        id: "l6aa2n",
        sentence: 'Least squares minimizes the sum of squared _______.',
        answer: 'residuals'
      },
      {
        id: "nxlhgi",
        sentence: 'The slope b1 is the change in average Y per one-unit change in _______.',
        answer: 'X'
      },
      {
        id: "r2ovq2",
        sentence: 'The regression line passes through the point (x-bar, _______).',
        answer: 'y-bar'
      },
      {
        id: "a4ls9x",
        sentence: 'Total sum of squares equals SSR plus _______.',
        answer: 'SSE'
      },
      {
        id: "7mpiaj",
        sentence: 'The coefficient of determination equals SSR divided by _______.',
        answer: 'SST'
      },
      {
        id: "enfkv0",
        sentence: 'The model error variance divides SSE by n minus _______.',
        answer: '2'
      },
      {
        id: "w5t3ad",
        sentence: 'The slope test has null hypothesis beta-1 equals _______.',
        answer: '0'
      }
    ],

    learn: {
      id: "f28627",
      content:
        '<h3>Regression Analysis</h3>' +
        '<p>Everything so far described <em>one</em> variable. Regression studies how <strong>two</strong> variables move together — and, crucially, lets us <strong>predict</strong> one from the other. Does advertising spend drive sales? How does room price affect occupancy? Regression fits a line that both summarises the relationship and produces forecasts.</p>' +

        '<h4>The model: dependent vs. independent</h4>' +
        '<p>The <strong>dependent</strong> variable \\(Y\\) is what we explain or predict; the <strong>independent</strong> variable \\(X\\) is the explanatory driver. The true population relationship includes a random error \\(\\varepsilon\\) (no real data sit exactly on a line); from a sample we estimate the line that strips the error away:</p>' +
        '<div class="formula-box">\\[ Y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i \\quad\\xrightarrow{\\text{estimate}}\\quad \\hat{y}_i = b_0 + b_1 x_i \\]</div>' +

        '<h4>Least squares — fitting the best line</h4>' +
        '<p>Of all possible lines, <strong>least squares</strong> picks the one that minimises the sum of squared <strong>residuals</strong> (vertical gaps between actual \\(y_i\\) and fitted \\(\\hat{y}_i\\)). We square the residuals so positives and negatives don’t cancel and large misses are penalised more. The solution:</p>' +
        '<div class="formula-box">\\[ b_1 = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sum (x_i-\\bar{x})^2}, \\qquad b_0 = \\bar{y}-b_1\\bar{x} \\]</div>' +
        '<p><strong>Interpretation is everything:</strong> \\(b_1\\) (the slope) is the estimated change in <em>average</em> \\(Y\\) for a one-unit rise in \\(X\\) — the headline number. \\(b_0\\) (the intercept) is the average \\(Y\\) when \\(X=0\\), meaningful only if \\(X=0\\) is realistic. The fitted line always passes through \\((\\bar{x},\\bar{y})\\).</p>' +

        '<h4>Goodness of fit: how good is the line?</h4>' +
        '<p>Total variation in \\(Y\\) splits into the part the line <strong>explains</strong> and the part it leaves as <strong>error</strong>:</p>' +
        '<div class="formula-box">\\[ \\underbrace{SST}_{\\text{total}} = \\underbrace{SSR}_{\\text{explained}} + \\underbrace{SSE}_{\\text{unexplained}}, \\qquad R^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST}, \\qquad s_e^2 = \\frac{SSE}{n-2} \\]</div>' +
        '<p>The <strong>coefficient of determination</strong> \\(R^2\\) (between 0 and 1) is the share of \\(Y\\)’s variation explained by \\(X\\) — the single most quoted fit measure. We divide \\(SSE\\) by \\(n-2\\) for the error variance because <em>two</em> parameters (\\(b_0,b_1\\)) were estimated.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — slope, intercept and R²</h4>' +
        '<p>From \\(n=10\\): \\(\\bar{x}=40,\\ \\bar{y}=12\\), \\(\\sum(x-\\bar{x})(y-\\bar{y})=-720\\), \\(\\sum(x-\\bar{x})^2=1800\\), \\(SST=500\\).</p>' +
        '<div class="formula-box">\\[ b_1=\\frac{-720}{1800}=-0.4, \\qquad b_0=12-(-0.4)(40)=28 \\]</div>' +
        '<div class="formula-box">\\[ SSR=b_1^2\\sum(x-\\bar{x})^2=(0.4)^2(1800)=288, \\qquad R^2=\\frac{288}{500}=0.576 \\]</div>' +
        '<p>So \\( \\hat{y}=28-0.4x \\): each one-unit rise in \\(X\\) lowers predicted \\(Y\\) by 0.4, and 57.6% of the variation in \\(Y\\) is explained by \\(X\\).</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Is the relationship significant?</h4>' +
        '<p>A slope estimated from a sample could be non-zero by chance. Test \\(H_0:\\beta_1=0\\) (no linear relationship) with \\( t=\\dfrac{b_1-\\beta_1}{s_{b_1}} \\) (\\(df=n-2\\)); reject if \\(|t|\\) beats the critical value. In simple regression the equivalent F test satisfies \\( F=t^2 \\) — both reach the same verdict.</p>' +
        '</div>' +

        '<div class="warning-box">' +
        '<h4><i class="fas fa-exclamation-triangle"></i> Common pitfalls</h4>' +
        '<p>• <strong>Correlation is not causation:</strong> a high \\(R^2\\) shows a strong linear fit, never that \\(X\\) <em>causes</em> \\(Y\\).</p>' +
        '<p>• <strong>Don’t extrapolate</strong> far outside the observed \\(X\\) range — the linear pattern may not hold there, and \\(b_0\\) is often meaningless.</p>' +
        '<p>• \\(R^2\\) measures <em>linear</em> fit only; a curved relationship can have low \\(R^2\\) yet be strong.</p>' +
        '</div>' +

        '<p class="highlight">Slope \\(b_1\\) = how much \\(Y\\) moves per unit of \\(X\\); \\(R^2\\) = how much of \\(Y\\) the line explains. Both describe the fit — neither proves causation.</p>',
      image: null
    }
  }
};

// Izloži na window — IME mora odgovarati data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.statisticsM2 = statisticsM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = statisticsM2; }
