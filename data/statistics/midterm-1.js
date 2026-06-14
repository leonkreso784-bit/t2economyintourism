// ===== STATISTICS — 1. KOLOKVIJ (K1) =====
// Newbold/Carlson/Thorne, Statistics for Business & Economics — Tutorials T1–T6.
// K1/K2 granica iz službenih midterm-materijala (DINP 2024/25): K1 = T1–T6, K2 = T7–T9.
//   K1: describing data (graphical) · describing data (numerical) · probability ·
//       discrete random variables · continuous random variables · sampling distributions
//
// ⚠ KVANTITATIVNI PREDMET — KaTeX (ADR-009). Konvencija (docs/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (u JS stringu: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   Jedan `$` se NE koristi (valuta). LaTeX backslash u stringu = "\\".

const statisticsM1 = {
  describingDataGraphical: {
    name: 'Describing Data — Graphical',
    icon: 'fa-chart-pie',
    color: '#0ea5e9',

    flashcards: [
      {
        question: 'Distinguish a population from a sample, and a parameter from a statistic.',
        answer: 'A population is the collection of ALL items of interest (size \\(N\\)); a sample is an observed subset (size \\(n\\)).\nA parameter is a numerical characteristic of a POPULATION; a statistic is a numerical characteristic of a SAMPLE.',
        explanation: 'We use a sample statistic to estimate an unknown population parameter.'
      },
      {
        question: 'Descriptive vs. inferential statistics — what is the difference?',
        answer: 'Descriptive statistics collect, summarize and present data (tables, graphs, averages) to turn data into information.\nInferential statistics use a sample to make estimates, forecasts and decisions about the population (estimation + hypothesis testing).'
      },
      {
        question: 'What is simple random sampling?',
        answer: 'A sampling procedure in which each member of the population is chosen strictly by chance, every member is equally likely to be selected, and every possible sample of \\(n\\) objects is equally likely.'
      },
      {
        question: 'Classify data: categorical vs. numerical, discrete vs. continuous.',
        answer: 'Categorical (qualitative) data fall into categories (eye color, marital status).\nNumerical (quantitative) data are numbers — DISCRETE (counted, e.g. number of children) or CONTINUOUS (measured, e.g. weight, time).'
      },
      {
        question: 'What are the four levels of measurement?',
        answer: 'Qualitative:\n• Nominal — categories with no order (eye color)\n• Ordinal — ordered categories/rankings (satisfaction 1–5)\nQuantitative:\n• Interval — differences meaningful, NO true zero (temperature °C)\n• Ratio — differences meaningful AND a true zero (weight, income)'
      },
      {
        question: 'Which graphs are used for CATEGORICAL data?',
        answer: 'Frequency distribution table, bar chart, pie chart, and the Pareto diagram (bars in descending order of frequency with a cumulative line — separates the “vital few” from the “trivial many”).'
      },
      {
        question: 'Which graphs are used for NUMERICAL data?',
        answer: 'Line chart (time series), frequency distribution, histogram, ogive (cumulative line graph), and the stem-and-leaf display. Scatter diagrams show the relationship between two numerical variables.'
      },
      {
        question: 'How do you choose the class width for a frequency distribution?',
        answer: 'First pick the number of classes \\(k\\) (a quick guide ties \\(k\\) to sample size). Then compute the width and round UP:\n\\( w = \\dfrac{\\text{Largest} - \\text{Smallest}}{k} \\)\nClasses must be equal width, inclusive and non-overlapping.'
      },
      {
        question: 'What does an ogive show?',
        answer: 'An ogive (cumulative line graph) connects points giving the CUMULATIVE percentage (or frequency) of observations below the upper limit of each class — it reads off “what fraction is below value x”.'
      },
      {
        question: 'What is a Pareto diagram used for?',
        answer: 'A bar chart of categorical data with bars in DESCENDING order of frequency plus a cumulative polygon. It highlights the few categories that account for most of the total (the “vital few vs. trivial many”).'
      },
      {
        question: 'What is a cross (contingency) table?',
        answer: 'A table listing the number of observations for every combination of two categorical/ordinal variables. With \\(r\\) row-categories and \\(c\\) column-categories it is an \\(r\\times c\\) cross table.'
      }
    ],

    quiz: [
      {
        question: 'A numerical characteristic of a population is a:',
        options: ['Statistic', 'Parameter', 'Sample', 'Variable'],
        correct: 1
      },
      {
        question: 'Estimating a population mean from a sample mean is an example of:',
        options: ['Descriptive statistics', 'Inferential statistics', 'A census', 'A parameter'],
        correct: 1
      },
      {
        question: 'The number of children in a family is which type of data?',
        options: ['Categorical nominal', 'Numerical discrete', 'Numerical continuous', 'Categorical ordinal'],
        correct: 1
      },
      {
        question: 'A satisfaction rating from 1 (low) to 5 (high) is measured on which scale?',
        options: ['Nominal', 'Ordinal', 'Interval', 'Ratio'],
        correct: 1
      },
      {
        question: 'Which graph is appropriate ONLY for categorical data?',
        options: ['Histogram', 'Pie chart', 'Stem-and-leaf display', 'Ogive'],
        correct: 1
      },
      {
        question: 'A bar chart with categories in descending order plus a cumulative line is a:',
        options: ['Histogram', 'Pareto diagram', 'Ogive', 'Scatter plot'],
        correct: 1
      },
      {
        question: 'The cumulative line graph for numerical data is called a(n):',
        options: ['Ogive', 'Pie chart', 'Pareto diagram', 'Box plot'],
        correct: 0
      },
      {
        question: 'Class width for a frequency distribution is approximately:',
        options: ['\\((\\text{Max}-\\text{Min})/k\\)', '\\(k/n\\)', '\\(\\text{Max}+\\text{Min}\\)', '\\(n/2\\)'],
        correct: 0
      },
      {
        question: 'A scatter diagram is used to display:',
        options: ['One categorical variable', 'The relationship between two numerical variables', 'Cumulative frequency', 'Time only'],
        correct: 1
      },
      {
        question: 'A measurement scale with a true zero point is:',
        options: ['Nominal', 'Ordinal', 'Interval', 'Ratio'],
        correct: 3
      }
    ],

    fillBlanks: [
      {
        sentence: 'A specific numerical characteristic of a population is a _______.',
        answer: 'parameter'
      },
      {
        sentence: 'A characteristic of a sample is a _______.',
        answer: 'statistic'
      },
      {
        sentence: 'Data that fall into unordered categories are nominal _______ data.',
        answer: 'categorical'
      },
      {
        sentence: 'Counted numerical data (e.g. number of cars) are _______.',
        answer: 'discrete'
      },
      {
        sentence: 'Measured numerical data (e.g. weight) are _______.',
        answer: 'continuous'
      },
      {
        sentence: 'A bar chart with categories in descending order is a _______ diagram.',
        answer: 'Pareto'
      },
      {
        sentence: 'A graph of a numerical frequency distribution is a _______.',
        answer: 'histogram'
      },
      {
        sentence: 'Class width equals the range divided by the number of _______.',
        answer: 'classes'
      }
    ],

    learn: {
      content:
        '<h3>Describing Data — Graphical</h3>' +
        '<p>Statistics begins by separating the <strong>population</strong> (all items, size \\(N\\)) from a <strong>sample</strong> (a subset, size \\(n\\)). A <strong>parameter</strong> describes the population; a <strong>statistic</strong> describes the sample. <strong>Descriptive</strong> statistics summarize data; <strong>inferential</strong> statistics generalize from a sample to the population.</p>' +

        '<h4>Types of data</h4>' +
        '<ul>' +
        '<li><strong>Categorical</strong> (qualitative): nominal (no order) or ordinal (ordered).</li>' +
        '<li><strong>Numerical</strong> (quantitative): discrete (counted) or continuous (measured); interval (no true zero) or ratio (true zero).</li>' +
        '</ul>' +

        '<h4>Choosing the right graph</h4>' +
        '<p><strong>Categorical:</strong> frequency table, bar chart, pie chart, Pareto diagram. <strong>Numerical:</strong> histogram, ogive (cumulative line), stem-and-leaf, line chart (time series); scatter diagrams show two numerical variables together.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — building a frequency distribution</h4>' +
        '<p>Data range from 12 to 65 with \\(n = 28\\) observations. The quick guide suggests \\(k = 6\\) classes, so the width is</p>' +
        '<div class="formula-box">\\[ w = \\frac{\\text{Max}-\\text{Min}}{k} = \\frac{65-12}{6} = 8.8 \\;\\rightarrow\\; 10 \\]</div>' +
        '<p>(rounded up). Classes 10–20, 20–30, … must be equal width, inclusive and non-overlapping; a histogram plots their frequencies, an ogive their cumulative percentages.</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>The Pareto idea</h4>' +
        '<p>A Pareto diagram orders categories from most to least frequent and adds a cumulative line — it spotlights the <strong>“vital few”</strong> categories that explain most of the total, the basis of the 80/20 rule.</p>' +
        '</div>' +

        '<p class="highlight">Pick the graph from the data type: never a histogram for categories, never a pie chart for continuous measurements.</p>',
      image: null
    }
  },

  describingDataNumerical: {
    name: 'Describing Data — Numerical',
    icon: 'fa-calculator',
    color: '#14b8a6',

    flashcards: [
      {
        question: 'Define the three measures of central tendency.',
        answer: '• Mean — the arithmetic average: \\( \\bar{x} = \\dfrac{\\sum x_i}{n} \\)\n• Median — the middle value of ordered data (50% above, 50% below)\n• Mode — the most frequently occurring value (may be none or several)'
      },
      {
        question: 'When is the median preferred over the mean?',
        answer: 'When the data contain outliers or are skewed. The mean is pulled toward extreme values, while the median is resistant to them, so it better describes a skewed distribution.'
      },
      {
        question: 'How do you locate the median and the quartiles by position?',
        answer: 'In ascending order:\n• Median is at position \\( \\dfrac{n+1}{2} \\)\n• \\(Q_1\\) at \\( 0.25(n+1) \\), \\(Q_3\\) at \\( 0.75(n+1) \\)\nThe 2nd quartile equals the median.'
      },
      {
        question: 'Define range and interquartile range.',
        answer: 'Range = largest − smallest (simple but very sensitive to outliers).\nInterquartile range \\( IQR = Q_3 - Q_1 \\) — the spread of the middle 50% of the data, which ignores extreme values.'
      },
      {
        question: 'Write the sample variance and sample standard deviation.',
        answer: '\\( s^2 = \\dfrac{\\sum (x_i-\\bar{x})^2}{n-1}, \\qquad s = \\sqrt{s^2} \\)\n(We divide by \\(n-1\\) for a sample; by \\(N\\) for a population variance \\(\\sigma^2\\).)'
      },
      {
        question: 'What is the coefficient of variation, and why use it?',
        answer: 'A relative measure of dispersion, in percent:\n\\( CV = \\dfrac{s}{\\bar{x}}\\times 100\\% \\)\nBecause it is unit-free, it lets you compare the variability of data sets measured in different units or with very different means.'
      },
      {
        question: 'State the empirical rule (for bell-shaped data).',
        answer: 'For an approximately normal distribution, the intervals around the mean contain:\n• \\( \\mu \\pm 1\\sigma \\): about 68%\n• \\( \\mu \\pm 2\\sigma \\): about 95%\n• \\( \\mu \\pm 3\\sigma \\): about 99.7%'
      },
      {
        question: 'State Chebyshev’s theorem.',
        answer: 'For ANY distribution and \\(k>1\\), at least \\( \\left(1-\\dfrac{1}{k^2}\\right) \\) of the values lie within \\(k\\) standard deviations of the mean. E.g. at least 75% within \\(\\pm 2\\sigma\\), at least 89% within \\(\\pm 3\\sigma\\).',
        explanation: 'Chebyshev works for any shape; the empirical rule needs a bell shape.'
      },
      {
        question: 'What is the weighted mean and when is it used?',
        answer: 'A mean where each value carries a weight \\(w_i\\):\n\\( \\bar{x} = \\dfrac{\\sum w_i x_i}{\\sum w_i} \\)\nUsed when observations are grouped or have unequal importance (e.g. grouped data with class midpoints).'
      },
      {
        question: 'How do you read skewness from the mean and median?',
        answer: 'If mean ≈ median → roughly symmetric. If mean < median → skewed LEFT (negatively). If mean > median → skewed RIGHT (positively). Outliers pull the mean toward the long tail.'
      }
    ],

    quiz: [
      {
        question: 'The middle value of an ordered data set is the:',
        options: ['Mean', 'Median', 'Mode', 'Range'],
        correct: 1
      },
      {
        question: 'Sample variance divides the sum of squared deviations by:',
        options: ['\\(n\\)', '\\(n-1\\)', '\\(N\\)', '\\(n+1\\)'],
        correct: 1
      },
      {
        question: 'The interquartile range equals:',
        options: ['\\(Q_3 - Q_1\\)', '\\(\\text{Max}-\\text{Min}\\)', '\\(Q_2 - Q_1\\)', '\\(s^2\\)'],
        correct: 0
      },
      {
        question: 'The coefficient of variation is:',
        options: ['\\(s^2/\\bar{x}\\)', '\\((s/\\bar{x})\\times 100\\%\\)', '\\(\\bar{x}/s\\)', '\\(Q_3-Q_1\\)'],
        correct: 1
      },
      {
        question: 'For bell-shaped data, about 95% of values lie within:',
        options: ['\\(\\mu\\pm 1\\sigma\\)', '\\(\\mu\\pm 2\\sigma\\)', '\\(\\mu\\pm 3\\sigma\\)', '\\(\\mu\\pm 0.5\\sigma\\)'],
        correct: 1
      },
      {
        question: 'Chebyshev’s theorem guarantees at least what fraction within \\(\\pm 2\\sigma\\)?',
        options: ['50%', '68%', '75%', '95%'],
        correct: 2
      },
      {
        question: 'Which measure is LEAST affected by outliers?',
        options: ['Mean', 'Median', 'Range', 'Standard deviation'],
        correct: 1
      },
      {
        question: 'If the mean is greater than the median, the distribution is skewed:',
        options: ['Left (negatively)', 'Right (positively)', 'Not at all', 'Bimodally'],
        correct: 1
      },
      {
        question: 'The most frequently occurring value is the:',
        options: ['Median', 'Mode', 'Mean', 'Midrange'],
        correct: 1
      },
      {
        question: 'A unit-free measure that compares variability across data sets is the:',
        options: ['Range', 'Variance', 'Coefficient of variation', 'IQR'],
        correct: 2
      }
    ],

    fillBlanks: [
      {
        sentence: 'The arithmetic average of the data is the _______.',
        answer: 'mean'
      },
      {
        sentence: 'The value with 50% of observations above and below it is the _______.',
        answer: 'median'
      },
      {
        sentence: 'Sample variance divides the sum of squared deviations by n minus _______.',
        answer: '1'
      },
      {
        sentence: 'The square root of the variance is the standard _______.',
        answer: 'deviation'
      },
      {
        sentence: 'IQR equals Q3 minus _______.',
        answer: 'Q1'
      },
      {
        sentence: 'For bell-shaped data, about 68% of values lie within one _______ of the mean.',
        answer: 'standard deviation',
        hint: '\\(\\mu \\pm 1\\sigma\\).'
      },
      {
        sentence: 'Chebyshev’s theorem applies to data of _______ shape.',
        answer: 'any'
      },
      {
        sentence: 'The coefficient of variation is always expressed as a _______.',
        answer: 'percentage'
      }
    ],

    learn: {
      content:
        '<h3>Describing Data — Numerical</h3>' +
        '<p>Two questions summarize a numerical data set: where is its <strong>center</strong>, and how much does it <strong>spread</strong>?</p>' +

        '<h4>Central tendency</h4>' +
        '<div class="formula-box">\\[ \\bar{x} = \\frac{\\sum x_i}{n} \\qquad \\text{(mean)}, \\qquad \\text{median at position } \\frac{n+1}{2}, \\qquad \\text{mode} = \\text{most frequent} \\]</div>' +
        '<p>The mean uses every value but is pulled by outliers; the median resists them and better describes skewed data.</p>' +

        '<h4>Variation</h4>' +
        '<div class="formula-box">\\[ s^2 = \\frac{\\sum (x_i-\\bar{x})^2}{n-1}, \\qquad s = \\sqrt{s^2}, \\qquad CV = \\frac{s}{\\bar{x}}\\times 100\\%, \\qquad IQR = Q_3 - Q_1 \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — variance &amp; standard deviation</h4>' +
        '<p>Sample: 5, 9, 10, 2, 7, 9, 14. The mean is \\( \\bar{x} = \\dfrac{56}{7} = 8 \\). The squared deviations sum to 88, so</p>' +
        '<div class="formula-box">\\[ s^2 = \\frac{88}{7-1} = 14.67, \\qquad s = \\sqrt{14.67} = 3.83 \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Empirical rule vs. Chebyshev</h4>' +
        '<p>For a <strong>bell-shaped</strong> distribution: about 68% / 95% / 99.7% of values fall within \\(\\mu\\pm 1\\sigma\\) / \\(2\\sigma\\) / \\(3\\sigma\\). For <strong>any</strong> shape, Chebyshev guarantees at least \\(1-\\tfrac{1}{k^2}\\) within \\(k\\) SDs (≥75% within \\(2\\sigma\\), ≥89% within \\(3\\sigma\\)).</p>' +
        '</div>' +

        '<p class="highlight">Compare the mean and median to read skew: mean &gt; median → right-skewed; mean &lt; median → left-skewed.</p>',
      image: null
    }
  },

  probability: {
    name: 'Probability Methods',
    icon: 'fa-dice',
    color: '#8b5cf6',

    flashcards: [
      {
        question: 'Define random experiment, sample space and event.',
        answer: 'A random experiment is a process with two or more possible outcomes, unknown in advance. The sample space \\(S\\) is the set of ALL possible outcomes. An event is any subset of the sample space.'
      },
      {
        question: 'Define the intersection, union and complement of events.',
        answer: '• Intersection \\(A\\cap B\\): outcomes in BOTH A and B.\n• Union \\(A\\cup B\\): outcomes in A OR B (or both).\n• Complement \\(\\bar{A}\\): all outcomes NOT in A, with \\( P(\\bar{A}) = 1 - P(A) \\).'
      },
      {
        question: 'What are mutually exclusive and collectively exhaustive events?',
        answer: 'Mutually exclusive: they cannot occur together, \\( A\\cap B = \\varnothing \\) so \\( P(A\\cap B)=0 \\).\nCollectively exhaustive: together they cover the whole sample space, \\( E_1\\cup E_2\\cup\\dots\\cup E_k = S \\).'
      },
      {
        question: 'What are the three approaches to assessing probability?',
        answer: '1. Classical — equally likely outcomes: \\( P(A)=\\dfrac{N_A}{N} \\).\n2. Relative frequency — long-run proportion of times A occurs.\n3. Subjective — a personal degree of belief.'
      },
      {
        question: 'Write the number of combinations of n things taken k at a time.',
        answer: '\\( \\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!} \\)\nwith \\(0! = 1\\). It counts the unordered ways to choose \\(k\\) items from \\(n\\).'
      },
      {
        question: 'State the addition rule.',
        answer: '\\( P(A\\cup B) = P(A) + P(B) - P(A\\cap B) \\)\nIf A and B are mutually exclusive, \\( P(A\\cap B)=0 \\), so \\( P(A\\cup B)=P(A)+P(B) \\).'
      },
      {
        question: 'Define conditional probability.',
        answer: 'The probability of A given that B has occurred:\n\\( P(A\\mid B) = \\dfrac{P(A\\cap B)}{P(B)} \\), provided \\( P(B) > 0 \\).'
      },
      {
        question: 'State the multiplication rule.',
        answer: '\\( P(A\\cap B) = P(A\\mid B)\\,P(B) = P(B\\mid A)\\,P(A) \\).\nIt rearranges the conditional-probability definition to get the joint probability.'
      },
      {
        question: 'When are two events statistically independent?',
        answer: 'When the occurrence of one does not change the probability of the other:\n\\( P(A\\cap B) = P(A)\\,P(B) \\) — equivalently \\( P(A\\mid B) = P(A) \\).'
      },
      {
        question: 'What is a marginal probability?',
        answer: 'The probability of a single event regardless of the others, found by summing its joint probabilities over a set of mutually exclusive, collectively exhaustive events:\n\\( P(A) = P(A\\cap B_1) + P(A\\cap B_2) + \\dots + P(A\\cap B_k) \\).'
      }
    ],

    quiz: [
      {
        question: 'The set of all possible outcomes of a random experiment is the:',
        options: ['Event', 'Sample space', 'Complement', 'Union'],
        correct: 1
      },
      {
        question: 'Outcomes belonging to BOTH A and B form the:',
        options: ['Union', 'Intersection', 'Complement', 'Sample space'],
        correct: 1
      },
      {
        question: 'If A and B are mutually exclusive, then \\(P(A\\cap B)\\) equals:',
        options: ['1', '0', '\\(P(A)P(B)\\)', '\\(P(A)+P(B)\\)'],
        correct: 1
      },
      {
        question: 'The probability of the union of two events is \\(P(A)+P(B)\\) minus:',
        options: ['\\(P(A\\mid B)\\)', '\\(P(A\\cap B)\\)', '\\(P(\\bar A)\\)', '1'],
        correct: 1
      },
      {
        question: 'Conditional probability \\(P(A\\mid B)\\) equals:',
        options: ['\\(P(A\\cap B)/P(B)\\)', '\\(P(A)P(B)\\)', '\\(P(A)+P(B)\\)', '\\(P(B)/P(A)\\)'],
        correct: 0
      },
      {
        question: 'Two events are independent if:',
        options: ['\\(P(A\\cap B)=0\\)', '\\(P(A\\cap B)=P(A)P(B)\\)', '\\(P(A\\cup B)=1\\)', '\\(P(A)=P(B)\\)'],
        correct: 1
      },
      {
        question: 'The number of unordered ways to choose k from n is:',
        options: ['\\(n^k\\)', '\\(\\dfrac{n!}{k!(n-k)!}\\)', '\\(\\dfrac{n!}{(n-k)!}\\)', '\\(nk\\)'],
        correct: 1
      },
      {
        question: 'Events that together cover the entire sample space are:',
        options: ['Mutually exclusive', 'Collectively exhaustive', 'Independent', 'Complementary only'],
        correct: 1
      },
      {
        question: 'The complement rule says \\(P(\\bar A)\\) equals:',
        options: ['\\(1-P(A)\\)', '\\(P(A)\\)', '\\(1+P(A)\\)', '\\(P(A)^2\\)'],
        correct: 0
      },
      {
        question: 'Assuming all outcomes equally likely is the _______ approach to probability.',
        options: ['Subjective', 'Relative frequency', 'Classical', 'Bayesian'],
        correct: 2
      }
    ],

    fillBlanks: [
      {
        sentence: 'The collection of all possible outcomes is the sample _______.',
        answer: 'space'
      },
      {
        sentence: 'Events that cannot occur together are mutually _______.',
        answer: 'exclusive'
      },
      {
        sentence: 'The probability of A or B is P(A)+P(B) minus P(A and B) — the _______ rule.',
        answer: 'addition'
      },
      {
        sentence: 'The probability of A given B is the _______ probability of A.',
        answer: 'conditional'
      },
      {
        sentence: 'If P(A and B) = P(A)·P(B), the events are _______.',
        answer: 'independent'
      },
      {
        sentence: 'P(complement of A) equals 1 minus _______.',
        answer: 'P(A)'
      },
      {
        sentence: 'Choosing k items from n without order uses the formula for _______.',
        answer: 'combinations'
      },
      {
        sentence: 'A probability is always between 0 and _______.',
        answer: '1'
      }
    ],

    learn: {
      content:
        '<h3>Probability Methods</h3>' +
        '<p>A <strong>random experiment</strong> has uncertain outcomes; the <strong>sample space</strong> \\(S\\) lists them all, and an <strong>event</strong> is any subset. Every probability satisfies \\( 0 \\le P(A) \\le 1 \\) and \\( P(S)=1 \\).</p>' +

        '<h4>Combining events</h4>' +
        '<div class="formula-box">\\[ P(\\bar A) = 1 - P(A), \\qquad P(A\\cup B) = P(A) + P(B) - P(A\\cap B) \\]</div>' +
        '<p>If the events are <strong>mutually exclusive</strong> (\\(A\\cap B=\\varnothing\\)), the last term is zero.</p>' +

        '<h4>Conditioning and independence</h4>' +
        '<div class="formula-box">\\[ P(A\\mid B) = \\frac{P(A\\cap B)}{P(B)} \\;\\Rightarrow\\; P(A\\cap B) = P(A\\mid B)\\,P(B) \\]</div>' +
        '<p>Events are <strong>independent</strong> when \\( P(A\\cap B)=P(A)P(B) \\) — knowing one tells you nothing about the other.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — addition rule</h4>' +
        '<p>30% of customers ask for help, 20% make a purchase, and 15% do both. The chance a customer does at least one is</p>' +
        '<div class="formula-box">\\[ P(A\\cup B) = 0.30 + 0.20 - 0.15 = 0.35 \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Counting with combinations</h4>' +
        '<p>When outcomes are equally likely, \\(P(A)=N_A/N\\); counting the cases often uses combinations \\( \\binom{n}{k}=\\dfrac{n!}{k!(n-k)!} \\).</p>' +
        '</div>' +

        '<p class="highlight">Mutually exclusive ≠ independent: exclusive events cannot happen together, while independent events simply do not influence each other.</p>',
      image: null
    }
  },

  discreteRandomVariables: {
    name: 'Discrete Random Variables',
    icon: 'fa-chart-column',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is a discrete random variable?',
        answer: 'A variable representing a numerical outcome of a random experiment that can take only a COUNTABLE number of values — e.g. the number of defective items, claims, or arrivals.'
      },
      {
        question: 'What two properties must a discrete probability distribution satisfy?',
        answer: '\\( P(x) \\ge 0 \\) for every value \\(x\\), and the probabilities sum to one: \\( \\sum_x P(x) = 1 \\).'
      },
      {
        question: 'Define the expected value of a discrete random variable.',
        answer: 'The probability-weighted average (its mean):\n\\( \\mu = E(X) = \\sum_x x\\,P(x) \\).'
      },
      {
        question: 'Write the variance and standard deviation of a discrete random variable.',
        answer: '\\( \\sigma^2 = E[(X-\\mu)^2] = \\sum_x (x-\\mu)^2 P(x), \\qquad \\sigma = \\sqrt{\\sigma^2} \\).'
      },
      {
        question: 'What conditions define a binomial experiment?',
        answer: 'A fixed number \\(n\\) of trials; each trial has two outcomes (success/failure); the success probability \\(P\\) is constant; and the trials are independent.'
      },
      {
        question: 'Write the binomial probability formula.',
        answer: '\\( P(x) = \\dfrac{n!}{x!\\,(n-x)!}\\,P^{x}(1-P)^{n-x} \\)\nfor \\(x = 0,1,\\dots,n\\) successes.'
      },
      {
        question: 'Give the mean and variance of the binomial distribution.',
        answer: '\\( \\mu = nP, \\qquad \\sigma^2 = nP(1-P), \\qquad \\sigma = \\sqrt{nP(1-P)} \\).'
      },
      {
        question: 'When is the Poisson distribution used, and what is its formula?',
        answer: 'For the number of times an event occurs in a fixed interval (arrivals, breakdowns, defects), with average rate \\(\\lambda\\):\n\\( P(x) = \\dfrac{e^{-\\lambda}\\lambda^{x}}{x!} \\).'
      },
      {
        question: 'What is special about the mean and variance of the Poisson distribution?',
        answer: 'They are EQUAL: \\( \\mu = \\sigma^2 = \\lambda \\) (so \\( \\sigma = \\sqrt{\\lambda} \\)).'
      },
      {
        question: 'What does the cumulative probability function \\(F(x_0)\\) give?',
        answer: 'The probability that X is at most \\(x_0\\): \\( F(x_0) = P(X \\le x_0) = \\sum_{x \\le x_0} P(x) \\). It is handy for “at least / at most / more than” questions.'
      }
    ],

    quiz: [
      {
        question: 'A variable taking only countable values is a _______ random variable.',
        options: ['Continuous', 'Discrete', 'Normal', 'Standardized'],
        correct: 1
      },
      {
        question: 'For any discrete distribution, the probabilities must sum to:',
        options: ['0', '0.5', '1', 'n'],
        correct: 2
      },
      {
        question: 'The expected value of X equals:',
        options: ['\\(\\sum x P(x)\\)', '\\(\\sum P(x)\\)', '\\(nP(1-P)\\)', '\\(\\sqrt{\\lambda}\\)'],
        correct: 0
      },
      {
        question: 'The mean of a binomial distribution is:',
        options: ['\\(nP(1-P)\\)', '\\(nP\\)', '\\(\\lambda\\)', '\\(P/n\\)'],
        correct: 1
      },
      {
        question: 'The variance of a binomial distribution is:',
        options: ['\\(nP\\)', '\\(nP(1-P)\\)', '\\(\\lambda\\)', '\\(\\sqrt{nP}\\)'],
        correct: 1
      },
      {
        question: 'The number of arrivals per hour is best modeled by the:',
        options: ['Binomial distribution', 'Poisson distribution', 'Normal distribution', 'Uniform distribution'],
        correct: 1
      },
      {
        question: 'For the Poisson distribution, the mean and variance are:',
        options: ['Both equal to \\(\\lambda\\)', 'Equal to \\(nP\\)', 'Always 0 and 1', 'Unrelated'],
        correct: 0
      },
      {
        question: 'The binomial requires that trials be:',
        options: ['Dependent', 'Independent with constant P', 'Continuous', 'Infinite'],
        correct: 1
      },
      {
        question: '\\(F(x_0)=P(X\\le x_0)\\) is called the _______ probability function.',
        options: ['Marginal', 'Cumulative', 'Conditional', 'Joint'],
        correct: 1
      },
      {
        question: 'In the Poisson formula, e is approximately:',
        options: ['3.14', '2.72', '1.61', '0.50'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A random variable with a countable set of values is _______.',
        answer: 'discrete'
      },
      {
        sentence: 'The probabilities of a discrete distribution must sum to _______.',
        answer: '1'
      },
      {
        sentence: 'The expected value E(X) is the probability-weighted _______.',
        answer: 'average'
      },
      {
        sentence: 'The mean of a binomial distribution is n times _______.',
        answer: 'P',
        hint: '\\(\\mu = nP\\).'
      },
      {
        sentence: 'The binomial variance is nP(1 minus _______).',
        answer: 'P'
      },
      {
        sentence: 'Counts of events in a fixed interval follow the _______ distribution.',
        answer: 'Poisson'
      },
      {
        sentence: 'For the Poisson distribution, the mean equals the _______.',
        answer: 'variance'
      },
      {
        sentence: 'The cumulative function F(x0) gives P(X ≤ _______).',
        answer: 'x0'
      }
    ],

    learn: {
      content:
        '<h3>Discrete Random Variables</h3>' +
        '<p>A <strong>discrete random variable</strong> takes countable values. Its <strong>probability distribution</strong> assigns \\( P(x)\\ge 0 \\) to each value with \\( \\sum_x P(x)=1 \\). Its center and spread are</p>' +
        '<div class="formula-box">\\[ \\mu = E(X) = \\sum_x x\\,P(x), \\qquad \\sigma^2 = \\sum_x (x-\\mu)^2 P(x) \\]</div>' +

        '<h4>Binomial distribution</h4>' +
        '<p>For \\(n\\) independent success/failure trials with constant success probability \\(P\\):</p>' +
        '<div class="formula-box">\\[ P(x) = \\frac{n!}{x!\\,(n-x)!}\\,P^{x}(1-P)^{n-x}, \\qquad \\mu = nP, \\qquad \\sigma^2 = nP(1-P) \\]</div>' +

        '<h4>Poisson distribution</h4>' +
        '<p>For counts of events in a fixed interval at average rate \\(\\lambda\\):</p>' +
        '<div class="formula-box">\\[ P(x) = \\frac{e^{-\\lambda}\\lambda^{x}}{x!}, \\qquad \\mu = \\sigma^2 = \\lambda \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — expected value</h4>' +
        '<p>Days off: \\(P(0,1,2,3,4,5) = (0.05, 0.30, 0.45, 0.10, 0.07, 0.03)\\).</p>' +
        '<div class="formula-box">\\[ \\mu = \\sum x\\,P(x) = 1.93, \\qquad \\sigma^2 = \\sum (x-\\mu)^2 P(x) = 1.14, \\qquad \\sigma = 1.07 \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Which model?</h4>' +
        '<p>Use the <strong>binomial</strong> for a fixed number of yes/no trials (defective or not in 6 items); use the <strong>Poisson</strong> for counts over a continuous interval (arrivals per minute, breakdowns per day).</p>' +
        '</div>' +

        '<p class="highlight">“At least” / “more than” questions are easiest with the cumulative function: \\( P(X>a)=1-P(X\\le a) \\).</p>',
      image: null
    }
  },

  continuousRandomVariables: {
    name: 'Continuous Random Variables',
    icon: 'fa-chart-area',
    color: '#10b981',

    flashcards: [
      {
        question: 'What is a continuous random variable?',
        answer: 'A variable that can take ANY value within an interval (weight, time, temperature). Because there are infinitely many possible values, the probability of any single exact value is zero.'
      },
      {
        question: 'What are the properties of a probability density function f(x)?',
        answer: '\\( f(x) \\ge 0 \\) for all \\(x\\); the total area under \\(f(x)\\) equals 1; and the probability that X lies between two values is the AREA under the curve between them.'
      },
      {
        question: 'How is probability found for a continuous variable?',
        answer: 'As an area under the density curve: \\( P(a < X < b) = F(b) - F(a) \\), where \\(F\\) is the cumulative distribution function. Single-point probabilities are zero.'
      },
      {
        question: 'What are the key features of the normal distribution?',
        answer: 'It is bell-shaped and symmetric; its mean, median and mode are equal; its location is set by \\(\\mu\\) and its spread by \\(\\sigma\\); and it has an infinite theoretical range.'
      },
      {
        question: 'How do you standardize a normal variable?',
        answer: 'Convert X into a Z-score by subtracting the mean and dividing by the standard deviation:\n\\( Z = \\dfrac{X-\\mu}{\\sigma} \\).'
      },
      {
        question: 'What is the standard normal distribution?',
        answer: 'The normal distribution with mean 0 and variance 1, written \\( Z \\sim N(0,1) \\). Any normal variable can be transformed to it to use the Z-table.'
      },
      {
        question: 'How do you find \\(P(X > c)\\) using the Z-table?',
        answer: 'Standardize: \\( Z = \\dfrac{c-\\mu}{\\sigma} \\). The table gives \\(P(Z<z)\\), so use the complement: \\( P(X>c) = 1 - P(Z < z) \\).'
      },
      {
        question: 'Why is the normal distribution so widely used?',
        answer: 'It approximates many real-world variables; sample means become approximately normal for large \\(n\\) (Central Limit Theorem); its probabilities are easy to compute; and it underlies much of statistical inference.'
      },
      {
        question: 'How do you compute \\(P(a < X < b)\\) for a normal variable?',
        answer: 'Standardize both ends and subtract cumulative probabilities:\n\\( P(a<X<b) = P\\!\\left(Z < \\dfrac{b-\\mu}{\\sigma}\\right) - P\\!\\left(Z < \\dfrac{a-\\mu}{\\sigma}\\right) \\).'
      },
      {
        question: 'What is a standardized random variable’s mean and variance?',
        answer: 'After the transformation \\( Z = (X-\\mu)/\\sigma \\), the new variable has mean 0 and variance 1 — regardless of the original units.'
      }
    ],

    quiz: [
      {
        question: 'For a continuous random variable, the probability of any single exact value is:',
        options: ['1', '0.5', '0', 'Undefined'],
        correct: 2
      },
      {
        question: 'Probability for a continuous variable corresponds to:',
        options: ['A bar height', 'An area under the density curve', 'A single point', 'A frequency count'],
        correct: 1
      },
      {
        question: 'The total area under any probability density function equals:',
        options: ['0', '0.5', '1', 'n'],
        correct: 2
      },
      {
        question: 'In a normal distribution, the mean, median and mode are:',
        options: ['All different', 'Equal', 'Always zero', 'Skewed'],
        correct: 1
      },
      {
        question: 'The standardized normal variable Z equals:',
        options: ['\\((X-\\mu)/\\sigma\\)', '\\(X\\mu\\)', '\\(\\sigma/\\mu\\)', '\\(X-\\sigma\\)'],
        correct: 0
      },
      {
        question: 'The standard normal distribution has mean and variance:',
        options: ['0 and 1', '1 and 0', '\\(\\mu\\) and \\(\\sigma\\)', '0 and 0'],
        correct: 0
      },
      {
        question: 'If the Z-table gives \\(P(Z<z)\\), then \\(P(Z>z)\\) equals:',
        options: ['\\(P(Z<z)\\)', '\\(1-P(Z<z)\\)', '\\(2P(Z<z)\\)', '\\(z\\)'],
        correct: 1
      },
      {
        question: 'The normal distribution is:',
        options: ['Skewed right', 'Bell-shaped and symmetric', 'Discrete', 'Bounded at 0 and 1'],
        correct: 1
      },
      {
        question: 'Standardizing converts X (units) into Z (units of):',
        options: ['Dollars', 'Standard deviations from the mean', 'Counts', 'Percentages'],
        correct: 1
      },
      {
        question: 'For \\(X \\sim N(80,100)\\), the standard deviation is:',
        options: ['100', '10', '80', '1'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A variable that can take any value in an interval is _______.',
        answer: 'continuous'
      },
      {
        sentence: 'For a continuous variable, probability equals the _______ under the density curve.',
        answer: 'area'
      },
      {
        sentence: 'The total area under a density function equals _______.',
        answer: '1'
      },
      {
        sentence: 'The normal distribution is bell-shaped and _______.',
        answer: 'symmetric'
      },
      {
        sentence: 'The Z-score equals (X minus mu) divided by _______.',
        answer: 'sigma',
        hint: '\\(Z=(X-\\mu)/\\sigma\\).'
      },
      {
        sentence: 'The standard normal distribution has mean _______.',
        answer: '0'
      },
      {
        sentence: 'The standard normal distribution has variance _______.',
        answer: '1'
      },
      {
        sentence: 'Converting X to a Z-score is called _______.',
        answer: 'standardizing'
      }
    ],

    learn: {
      content:
        '<h3>Continuous Random Variables</h3>' +
        '<p>A <strong>continuous</strong> random variable can take any value in an interval, so probability is described by a <strong>density function</strong> \\(f(x)\\): the area under the curve between two points is the probability of landing there. The area over all values is 1, and any single point has probability 0.</p>' +
        '<div class="formula-box">\\[ P(a < X < b) = F(b) - F(a) = \\text{area under } f(x) \\text{ from } a \\text{ to } b \\]</div>' +

        '<h4>The normal distribution</h4>' +
        '<p>The most important continuous model: bell-shaped, symmetric, with mean = median = mode. Its location is \\(\\mu\\) and its spread \\(\\sigma\\). Any normal variable is converted to the <strong>standard normal</strong> \\(N(0,1)\\) by a Z-score:</p>' +
        '<div class="formula-box">\\[ Z = \\frac{X-\\mu}{\\sigma} \\sim N(0,1) \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — a normal probability</h4>' +
        '<p>\\( X \\sim N(\\mu=80,\\ \\sigma^2=100) \\), so \\( \\sigma = 10 \\). Find \\(P(X>60)\\):</p>' +
        '<div class="formula-box">\\[ Z = \\frac{60-80}{10} = -2 \\;\\Rightarrow\\; P(X>60) = P(Z>-2) = 1 - P(Z<-2) \\approx 0.977 \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Using the Z-table</h4>' +
        '<p>Tables give the LEFT-tail \\(P(Z<z)\\). For a right tail use \\(1-P(Z<z)\\); for a middle band subtract two cumulative values: \\(P(a<X<b)=P(Z<z_b)-P(Z<z_a)\\).</p>' +
        '</div>' +

        '<p class="highlight">A Z-score measures how many standard deviations a value sits from the mean — that is why it makes any two normal variables directly comparable.</p>',
      image: null
    }
  },

  samplingDistributions: {
    name: 'Sampling Distributions',
    icon: 'fa-vials',
    color: '#ef4444',

    flashcards: [
      {
        question: 'What is a sampling distribution?',
        answer: 'The distribution of all possible values of a statistic (e.g. the sample mean) for a given sample size taken from a population. Different samples give different statistic values, and the sampling distribution describes that variability.'
      },
      {
        question: 'Write the standard error of the mean and explain it.',
        answer: '\\( \\sigma_{\\bar{x}} = \\dfrac{\\sigma}{\\sqrt{n}} \\)\nIt measures how much the sample mean varies from sample to sample. It DECREASES as the sample size \\(n\\) grows — larger samples give more precise means.'
      },
      {
        question: 'If the population is normal, what is the sampling distribution of \\(\\bar{x}\\)?',
        answer: 'Also normal, with the same mean and a smaller spread:\n\\( \\mu_{\\bar{x}} = \\mu, \\qquad \\sigma_{\\bar{x}} = \\dfrac{\\sigma}{\\sqrt{n}} \\).'
      },
      {
        question: 'State the Central Limit Theorem.',
        answer: 'For a large enough sample size, the sampling distribution of the sample mean is approximately NORMAL even if the population is NOT normal — with mean \\(\\mu\\) and standard error \\(\\sigma/\\sqrt{n}\\).'
      },
      {
        question: 'How large is “large enough” for the CLT?',
        answer: 'For most distributions \\( n > 25 \\) (often stated as \\(n \\ge 30\\)) gives a nearly normal sampling distribution. If the population is already normal, \\(\\bar{x}\\) is normal for any \\(n\\).'
      },
      {
        question: 'Write the Z-value for the sampling distribution of the mean.',
        answer: '\\( Z = \\dfrac{\\bar{x}-\\mu}{\\sigma/\\sqrt{n}} \\)\n— standardize the sample mean using the standard error in the denominator.'
      },
      {
        question: 'When do you apply the finite population correction?',
        answer: 'When sampling WITHOUT replacement and the sample is large relative to the population (\\(n\\) more than about 5% of \\(N\\)). Then multiply the standard error by \\( \\sqrt{\\dfrac{N-n}{N-1}} \\).'
      },
      {
        question: 'Define the sample proportion and its sampling distribution.',
        answer: '\\( \\hat{p} = \\dfrac{x}{n} \\) estimates the population proportion \\(P\\). For large \\(n\\) (when \\(nP(1-P)>5\\)) it is approximately normal with\n\\( E(\\hat{p}) = P, \\qquad \\sigma_{\\hat{p}} = \\sqrt{\\dfrac{P(1-P)}{n}} \\).'
      },
      {
        question: 'Write the Z-value for a sample proportion.',
        answer: '\\( Z = \\dfrac{\\hat{p}-P}{\\sqrt{P(1-P)/n}} \\)\n— standardize the sample proportion using its standard error.'
      },
      {
        question: 'Why does a larger sample give a more reliable estimate?',
        answer: 'Because the standard error \\( \\sigma/\\sqrt{n} \\) shrinks as \\(n\\) increases, the sampling distribution becomes narrower, so sample statistics cluster more tightly around the true parameter.'
      }
    ],

    quiz: [
      {
        question: 'The distribution of all possible values of a statistic is a:',
        options: ['Population distribution', 'Sampling distribution', 'Frequency distribution', 'Density function'],
        correct: 1
      },
      {
        question: 'The standard error of the mean equals:',
        options: ['\\(\\sigma\\)', '\\(\\sigma/\\sqrt{n}\\)', '\\(\\sigma^2/n\\)', '\\(\\sqrt{n}\\,\\sigma\\)'],
        correct: 1
      },
      {
        question: 'As the sample size increases, the standard error of the mean:',
        options: ['Increases', 'Decreases', 'Stays the same', 'Becomes 1'],
        correct: 1
      },
      {
        question: 'The Central Limit Theorem says the sampling distribution of the mean is approximately:',
        options: ['Uniform', 'Normal', 'Binomial', 'Skewed'],
        correct: 1
      },
      {
        question: 'The Z-value for a sample mean uses which denominator?',
        options: ['\\(\\sigma\\)', '\\(\\sigma/\\sqrt{n}\\)', '\\(n\\)', '\\(s^2\\)'],
        correct: 1
      },
      {
        question: 'The mean of the sampling distribution of \\(\\bar{x}\\) equals:',
        options: ['\\(\\mu/n\\)', '\\(\\mu\\)', '0', '\\(\\sigma\\)'],
        correct: 1
      },
      {
        question: 'The standard error of a sample proportion is:',
        options: ['\\(\\sqrt{P(1-P)/n}\\)', '\\(P(1-P)\\)', '\\(\\sigma/\\sqrt{n}\\)', '\\(P/n\\)'],
        correct: 0
      },
      {
        question: 'A common rule of thumb for the CLT to apply is:',
        options: ['\\(n>5\\)', '\\(n>25\\) (often \\(n\\ge 30\\))', '\\(n>500\\)', '\\(n=1\\)'],
        correct: 1
      },
      {
        question: 'The finite population correction is used when sampling:',
        options: ['With replacement', 'Without replacement and n > ~5% of N', 'From a normal population only', 'When n = 1'],
        correct: 1
      },
      {
        question: 'The expected value of the sample proportion \\(\\hat p\\) is:',
        options: ['\\(P\\)', '\\(0\\)', '\\(n\\)', '\\(1-P\\)'],
        correct: 0
      }
    ],

    fillBlanks: [
      {
        sentence: 'The distribution of a statistic over all possible samples is a _______ distribution.',
        answer: 'sampling'
      },
      {
        sentence: 'The standard error of the mean is sigma divided by the square root of _______.',
        answer: 'n',
        hint: '\\(\\sigma_{\\bar x}=\\sigma/\\sqrt{n}\\).'
      },
      {
        sentence: 'As n increases, the standard error _______.',
        answer: 'decreases'
      },
      {
        sentence: 'The Central Limit Theorem makes the sample mean approximately _______.',
        answer: 'normal'
      },
      {
        sentence: 'The mean of the sampling distribution of x-bar equals the population _______.',
        answer: 'mean'
      },
      {
        sentence: 'The sample proportion p-hat equals x divided by _______.',
        answer: 'n'
      },
      {
        sentence: 'The CLT applies even when the population is not _______.',
        answer: 'normal'
      },
      {
        sentence: 'A larger sample gives a more _______ estimate of the parameter.',
        answer: 'precise'
      }
    ],

    learn: {
      content:
        '<h3>Sampling Distributions</h3>' +
        '<p>Take many samples of size \\(n\\) and compute a statistic (say the mean) for each — those values form a <strong>sampling distribution</strong>. Its spread is the <strong>standard error</strong>, which shrinks as the sample grows:</p>' +
        '<div class="formula-box">\\[ \\mu_{\\bar{x}} = \\mu, \\qquad \\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} \\]</div>' +

        '<h4>The Central Limit Theorem</h4>' +
        '<p>The key result of inference: for a large enough sample (\\(n>25\\), often \\(n\\ge 30\\)), the sample mean is approximately <strong>normal</strong> — even if the population is not. We then standardize:</p>' +
        '<div class="formula-box">\\[ Z = \\frac{\\bar{x}-\\mu}{\\sigma/\\sqrt{n}} \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — probability for a sample mean</h4>' +
        '<p>Annual raises are \\(N(\\mu=12.2\\%,\\ \\sigma=3.6\\%)\\). For a sample of \\(n=9\\), find \\(P(\\bar{x}>14.4\\%)\\):</p>' +
        '<div class="formula-box">\\[ Z = \\frac{14.4-12.2}{3.6/\\sqrt{9}} = \\frac{2.2}{1.2} = 1.83 \\;\\Rightarrow\\; P(\\bar{x}>14.4) = 1 - P(Z<1.83) \\approx 0.0336 \\]</div>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Proportions</h4>' +
        '<p>The sample proportion \\( \\hat{p}=x/n \\) is also approximately normal (when \\(nP(1-P)>5\\)) with \\( E(\\hat{p})=P \\) and \\( \\sigma_{\\hat{p}}=\\sqrt{\\dfrac{P(1-P)}{n}} \\), standardized by \\( Z=\\dfrac{\\hat{p}-P}{\\sigma_{\\hat{p}}} \\).</p>' +
        '</div>' +

        '<p class="highlight">The standard error \\( \\sigma/\\sqrt{n} \\) is the engine of inference: it is why bigger samples give tighter, more trustworthy estimates — and it sets up confidence intervals and hypothesis tests in K2.</p>',
      image: null
    }
  }
};

// Izloži na window — IME mora odgovarati data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.statisticsM1 = statisticsM1; }
if (typeof module !== 'undefined' && module.exports) { module.exports = statisticsM1; }
