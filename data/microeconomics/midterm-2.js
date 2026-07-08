// ===== MICROECONOMICS — 2. KOLOKVIJ (K2) =====
// Pindyck & Rubinfeld, Microeconomics, 9th ed. — Chapters 8, 9, 10, 12, 13, 14, 18
// (deck teaching units TU7–TU13).
// K1/K2 granica iz službenog DINP rasporeda predavanja: K1 = Ch 1–7, K2 = Ch 8,9,10,12,13,14,18.
//
// ⚠ KVANTITATIVNI PREDMET — koristi KaTeX (ADR-009). Konvencija (docs/content/CONTENT_SCHEMA.md):
//   inline  \( ... \)   (u JS stringu: "\\( ... \\)")
//   display \[ ... \] / $$ ... $$
//   Jedan `$` se NE koristi (valuta → "USD"). LaTeX backslash u stringu = "\\".

const microeconomicsM2 = {
  profitMaximization: {
    name: 'Profit Maximization & Competitive Supply',
    icon: 'fa-bullseye',
    color: '#0ea5e9',

    flashcards: [
      {
        question: 'How is profit defined, and what does a firm maximize?',
        answer: 'Profit is total revenue minus total cost:\n\\( \\pi = TR - TC \\)\nThe firm chooses the output level that makes this difference as large as possible.'
      },
      {
        question: 'State the profit-maximizing rule for any firm.',
        answer: 'Produce the output where marginal revenue equals marginal cost:\n\\( MR = MC \\)\nIf \\(MR > MC\\), producing more adds to profit; if \\(MR < MC\\), cutting output raises profit.'
      },
      {
        question: 'Why is a perfectly competitive firm a "price taker", and what does that imply for MR?',
        answer: 'It is one of many sellers of a homogeneous product, so it cannot influence the market price — it faces a horizontal (infinitely elastic) demand curve at the market price. Therefore price equals average and marginal revenue:\n\\( P = AR = MR \\)\nso the profit-max condition becomes \\( P = MR = MC \\).'
      },
      {
        question: 'List the four market structures.',
        answer: '1. Perfect competition — many firms, homogeneous product\n2. Monopoly — a single seller\n3. Monopolistic competition — many firms, DIFFERENTIATED products, free entry\n4. Oligopoly — a few firms, entry possible but not easy'
      },
      {
        question: 'What are the defining characteristics of perfect competition?',
        answer: '• A great number of buyers and sellers\n• A homogeneous (identical) product\n• Perfect mobility of resources\n• Perfect knowledge of present and future prices, costs and opportunities\nEach firm is a price taker.'
      },
      {
        question: 'What is the short-run shut-down rule?',
        answer: 'A competitive firm keeps producing as long as price covers average variable cost (\\(P \\ge AVC\\)). If \\(P < AVC\\) it shuts down, because it would lose less by producing nothing (it still pays fixed cost either way).'
      },
      {
        question: 'What is the short-run supply curve of a competitive firm?',
        answer: 'The rising portion of its marginal cost curve that lies ABOVE the average variable cost curve. Below the minimum of AVC the firm supplies zero (shut-down).'
      },
      {
        question: 'Distinguish producer surplus from profit.',
        answer: 'Producer surplus is the sum, over all units, of the difference between price and marginal cost (price minus variable cost) — it is revenue minus VARIABLE cost. Profit is revenue minus TOTAL cost. They differ by fixed cost: producer surplus exceeds profit by the amount of fixed cost.'
      },
      {
        question: 'What conditions hold in long-run competitive equilibrium?',
        answer: '1. Every firm maximizes profit (\\(P = MR = MC\\)).\n2. No firm has an incentive to enter or exit — economic profit is ZERO.\n3. The price clears the market (quantity supplied = quantity demanded).\nFirms produce at the lowest point of their long-run average cost curve: \\( P = MR = LMC = \\min(LAC) \\).'
      },
      {
        question: 'Why is long-run economic profit zero in perfect competition?',
        answer: 'Free entry: if firms earn positive economic profit, new firms enter, supply rises and price falls until profit is competed away to zero. Losses cause exit, raising price back to break-even. Zero ECONOMIC profit still means a normal return on resources.'
      },
      {
        question: 'What is economic rent?',
        answer: 'The amount firms are willing to pay for an input ABOVE the minimum amount needed to obtain it (its opportunity cost). It arises for inputs in fixed/limited supply (e.g. especially productive land).'
      }
    ],

    quiz: [
      {
        question: 'Every profit-maximizing firm produces where:',
        options: ['\\(P = AVC\\)', '\\(MR = MC\\)', '\\(TR = TC\\)', '\\(AFC = 0\\)'],
        correct: 1
      },
      {
        question: 'For a perfectly competitive firm, marginal revenue equals:',
        options: ['Marginal cost only', 'The market price', 'Average fixed cost', 'Total revenue'],
        correct: 1
      },
      {
        question: 'A competitive firm is best described as a:',
        options: ['Price maker', 'Price taker', 'Quantity taker only', 'Monopolist'],
        correct: 1
      },
      {
        question: 'In the short run a competitive firm shuts down when:',
        options: ['\\(P < AVC\\)', '\\(P < ATC\\)', 'Profit is zero', '\\(MR = MC\\)'],
        correct: 0
      },
      {
        question: 'The short-run supply curve of a competitive firm is the MC curve above:',
        options: ['ATC', 'AVC', 'AFC', 'MR'],
        correct: 1
      },
      {
        question: 'A homogeneous product and a great many sellers are features of:',
        options: ['Monopoly', 'Perfect competition', 'Oligopoly', 'Monopsony'],
        correct: 1
      },
      {
        question: 'In long-run competitive equilibrium, economic profit is:',
        options: ['Maximized and large', 'Zero', 'Negative', 'Equal to fixed cost'],
        correct: 1
      },
      {
        question: 'Producer surplus exceeds profit by the amount of:',
        options: ['Variable cost', 'Fixed cost', 'Marginal cost', 'Consumer surplus'],
        correct: 1
      },
      {
        question: 'In the long run a competitive firm produces at the:',
        options: ['Lowest point of its LAC curve', 'Highest point of its demand curve', 'Shut-down point', 'Point where \\(MR > MC\\)'],
        correct: 0
      },
      {
        question: 'Payment to an input above the minimum needed to obtain it is called:',
        options: ['Marginal cost', 'Economic rent', 'Producer surplus', 'A sunk cost'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'Profit equals total revenue minus total _______.',
        answer: 'cost'
      },
      {
        sentence: 'Every firm maximizes profit where marginal revenue equals marginal _______.',
        answer: 'cost'
      },
      {
        sentence: 'For a competitive firm price equals marginal revenue, so it produces where P equals _______.',
        answer: 'MC',
        hint: '\\(P = MR = MC\\).'
      },
      {
        sentence: 'A competitive firm is a price _______.',
        answer: 'taker'
      },
      {
        sentence: 'In the short run a firm shuts down if price is below average _______ cost.',
        answer: 'variable'
      },
      {
        sentence: 'In long-run competitive equilibrium economic profit is _______.',
        answer: 'zero'
      },
      {
        sentence: 'The firm’s short-run supply curve is its MC curve above the _______ curve.',
        answer: 'AVC'
      },
      {
        sentence: 'Payment to an input above its opportunity cost is economic _______.',
        answer: 'rent'
      }
    ],

    learn: {
      content:
        '<h3>Profit Maximization &amp; Competitive Supply</h3>' +
        '<p>A firm maximizes <strong>profit</strong>, the gap between revenue and cost:</p>' +
        '<div class="formula-box">\\[ \\pi = TR - TC \\]</div>' +
        '<p>Profit is largest at the output where the last unit just pays for itself — where <strong>marginal revenue equals marginal cost</strong>:</p>' +
        '<div class="formula-box">\\[ MR = MC \\]</div>' +

        '<h4>The competitive firm is a price taker</h4>' +
        '<p>Under perfect competition there are many sellers of a homogeneous product, so a single firm cannot move the price. It faces a horizontal demand curve at the market price, which makes price, average revenue and marginal revenue all equal:</p>' +
        '<div class="formula-box">\\[ P = AR = MR \\quad\\Longrightarrow\\quad P = MR = MC \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — choosing output</h4>' +
        '<p>The market price is \\(P = 20\\) (USD) and the firm’s marginal cost is \\(MC = 2Q\\).</p>' +
        '<div class="formula-box">\\[ P = MC \\;\\Rightarrow\\; 20 = 2Q \\;\\Rightarrow\\; Q = 10 \\]</div>' +
        '<p>The firm supplies 10 units. If the price rose to 30, it would produce where \\(30 = 2Q\\), i.e. \\(Q = 15\\) — tracing out its supply curve along MC.</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Shut-down rule &amp; the supply curve</h4>' +
        '<p>In the short run the firm produces only if price covers average variable cost (\\(P \\ge AVC\\)); otherwise it shuts down and loses just its fixed cost. Its <strong>short-run supply curve</strong> is therefore the part of MC lying above minimum AVC.</p>' +
        '</div>' +

        '<h4>The long run: zero economic profit</h4>' +
        '<p>With free entry and exit, positive profit attracts new firms (raising supply, lowering price) and losses drive firms out, until profit is competed away. In equilibrium every firm sits at the bottom of its long-run average cost curve:</p>' +
        '<div class="formula-box">\\[ P = MR = LMC = \\min(LAC), \\qquad \\pi = 0 \\]</div>' +
        '<p class="highlight">Zero economic profit still means a normal (competitive) return; inputs in fixed supply earn economic rent — payment above their opportunity cost.</p>',
      image: null
    }
  },

  competitiveMarkets: {
    name: 'Analysis of Competitive Markets',
    icon: 'fa-scale-balanced',
    color: '#14b8a6',

    flashcards: [
      {
        question: 'What are consumer surplus and producer surplus?',
        answer: 'Consumer surplus is the difference between what consumers are willing to pay and what they actually pay (area under the demand curve, above the price). Producer surplus is the difference between the price received and the minimum suppliers would accept (area above the supply curve, below the price).'
      },
      {
        question: 'What is deadweight loss?',
        answer: 'The net loss of total surplus (consumer + producer) caused by a market distortion — such as a price control, tax, quota or monopoly — that moves output away from the competitive equilibrium quantity. It represents mutually beneficial trades that no longer happen.'
      },
      {
        question: 'What does a price ceiling (below equilibrium) do?',
        answer: 'A binding price ceiling holds price BELOW the market-clearing level → quantity demanded exceeds quantity supplied (a SHORTAGE). Consumers who still buy gain, but the reduced quantity creates a deadweight loss.'
      },
      {
        question: 'What does a price floor / price support (above equilibrium) do?',
        answer: 'A binding price floor holds price ABOVE the market-clearing level → quantity supplied exceeds quantity demanded (a SURPLUS). A minimum wage and agricultural price supports are examples; they also create deadweight loss (and, with supports, a government purchase cost).'
      },
      {
        question: 'When is a competitive market economically efficient, and what is market failure?',
        answer: 'A competitive market maximizes the sum of consumer and producer surplus, so it is efficient. MARKET FAILURE occurs when unregulated markets are inefficient — chiefly because of externalities or a lack of information.'
      },
      {
        question: 'What is a specific tax, and who bears its burden (tax incidence)?',
        answer: 'A specific tax is a fixed amount of money per unit sold. The INCIDENCE (who actually bears it) does not depend on who legally pays it — it falls more heavily on the side of the market that is LESS elastic (more inelastic). The tax also creates a deadweight loss.'
      },
      {
        question: 'How does relative elasticity determine who bears a tax?',
        answer: 'The more INELASTIC side bears the larger share. If demand is more inelastic than supply, buyers pay most of the tax (price rises a lot); if supply is more inelastic, sellers absorb most of it.'
      },
      {
        question: 'What is the effect of a production quota or import quota?',
        answer: 'A quota restricts the quantity that may be produced or imported, pushing price up. Consumers lose surplus; domestic producers (or quota/license holders) gain; the restriction on quantity creates a deadweight loss.'
      },
      {
        question: 'What is the effect of a subsidy?',
        answer: 'A subsidy is a negative tax — a payment per unit that lowers the price buyers pay and raises the price sellers receive, increasing the quantity traded ABOVE the efficient level. It too generates a deadweight loss (and a government cost) because output exceeds the efficient amount.'
      },
      {
        question: 'What is an import tariff?',
        answer: 'A tax on imported goods. It raises the domestic price toward (or above) the world-price-plus-tariff, reducing imports. Domestic producers and the government (tariff revenue) gain, consumers lose more, and there is a deadweight loss.'
      }
    ],

    quiz: [
      {
        question: 'The area under the demand curve and above the price is:',
        options: ['Producer surplus', 'Consumer surplus', 'Deadweight loss', 'Total revenue'],
        correct: 1
      },
      {
        question: 'A binding price ceiling set below equilibrium causes a:',
        options: ['Surplus', 'Shortage', 'Higher equilibrium price', 'Tax'],
        correct: 1
      },
      {
        question: 'A minimum wage above the equilibrium wage tends to cause:',
        options: ['A labor shortage', 'A labor surplus (unemployment)', 'No effect', 'Higher demand for labor'],
        correct: 1
      },
      {
        question: 'A specific tax is levied as:',
        options: ['A percentage of price', 'A fixed amount per unit', 'A lump sum on firms only', 'A subsidy to buyers'],
        correct: 1
      },
      {
        question: 'The burden of a tax falls mainly on the side of the market that is more:',
        options: ['Elastic', 'Inelastic', 'Profitable', 'Competitive'],
        correct: 1
      },
      {
        question: 'The net loss of total surplus from a distortion is called:',
        options: ['Consumer surplus', 'Deadweight loss', 'Economic rent', 'Producer surplus'],
        correct: 1
      },
      {
        question: 'A subsidy increases the quantity traded to a level that is:',
        options: ['Below the efficient quantity', 'Above the efficient quantity', 'Exactly efficient', 'Zero'],
        correct: 1
      },
      {
        question: 'Externalities and lack of information are examples of:',
        options: ['Market efficiency', 'Market failure', 'Consumer surplus', 'Price taking'],
        correct: 1
      },
      {
        question: 'A binding price support for farmers (above equilibrium) produces a:',
        options: ['Shortage', 'Surplus the government may have to buy', 'Lower market price', 'Deadweight gain'],
        correct: 1
      },
      {
        question: 'An import tariff is essentially a tax on:',
        options: ['Exports', 'Imported goods', 'Domestic labor', 'Consumer surplus'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'The benefit buyers get above what they pay is consumer _______.',
        answer: 'surplus'
      },
      {
        sentence: 'The net welfare loss from a market distortion is the _______ loss.',
        answer: 'deadweight'
      },
      {
        sentence: 'A binding price ceiling below equilibrium creates a _______.',
        answer: 'shortage'
      },
      {
        sentence: 'A binding price floor above equilibrium creates a _______.',
        answer: 'surplus'
      },
      {
        sentence: 'A tax burden falls mainly on the more _______ side of the market.',
        answer: 'inelastic'
      },
      {
        sentence: 'A fixed amount of tax per unit sold is a _______ tax.',
        answer: 'specific'
      },
      {
        sentence: 'A subsidy is in effect a negative _______.',
        answer: 'tax'
      },
      {
        sentence: 'A tax on imported goods is an import _______.',
        answer: 'tariff'
      }
    ],

    learn: {
      content:
        '<h3>The Analysis of Competitive Markets</h3>' +
        '<p>We measure the well-being of a market with <strong>consumer surplus</strong> (value to buyers above the price they pay) and <strong>producer surplus</strong> (price received above the seller’s minimum). A competitive equilibrium maximizes their sum, so it is <strong>efficient</strong>.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — consumer surplus</h4>' +
        '<p>Demand is \\(P = 100 - Q\\) and the equilibrium price is \\(P = 40\\), so quantity is \\(Q = 60\\). Consumer surplus is the triangle between the demand curve and the price:</p>' +
        '<div class="formula-box">\\[ CS = \\tfrac{1}{2}\\,(100 - 40)\\times 60 = \\tfrac{1}{2}\\times 60 \\times 60 = 1800 \\]</div>' +
        '<p>(in USD). Anything that pushes quantity below 60 sacrifices some of this surplus.</p>' +
        '</div>' +

        '<h4>Price controls</h4>' +
        '<p>A binding <strong>price ceiling</strong> (below equilibrium) causes a <strong>shortage</strong>; a binding <strong>price floor</strong> (above equilibrium, e.g. a minimum wage or farm price support) causes a <strong>surplus</strong>. Either way the quantity traded falls below the efficient level, producing a <strong>deadweight loss</strong>.</p>' +

        '<div class="tip-box">' +
        '<h4>Tax incidence depends on elasticity</h4>' +
        '<p>A specific tax (a fixed amount per unit) raises the price buyers pay and lowers the price sellers receive. Who really bears it does not depend on who writes the cheque — the <strong>more inelastic</strong> side of the market bears the larger share. A subsidy works in reverse, pushing output ABOVE the efficient level.</p>' +
        '</div>' +

        '<p class="highlight">Quotas, tariffs, supports, taxes and subsidies all move quantity away from the competitive equilibrium and so create deadweight loss — they redistribute surplus at a cost to total welfare. Markets fail on their own mainly because of externalities and missing information.</p>',
      image: null
    }
  },

  monopolyMonopsony: {
    name: 'Market Power: Monopoly & Monopsony',
    icon: 'fa-chess-king',
    color: '#8b5cf6',

    flashcards: [
      {
        question: 'What is a monopoly, and why is its marginal revenue below price?',
        answer: 'A monopoly is the single seller of a product with no close substitutes; it faces the entire downward-sloping market demand curve. To sell one more unit it must lower the price on ALL units, so marginal revenue is less than price:\n\\( MR < P \\).'
      },
      {
        question: 'For a linear demand curve, how does the MR curve relate to the demand curve?',
        answer: 'The marginal revenue curve has the same intercept but is TWICE as steep. If demand is \\(P = a - bQ\\), then\n\\( MR = a - 2bQ \\)\n(the absolute slope of MR is double that of demand).'
      },
      {
        question: 'How does a monopolist choose output and price?',
        answer: 'It sets output where \\(MR = MC\\), then charges the highest price the demand curve allows for that quantity. Because \\(MR < P\\), the monopoly produces LESS and charges MORE than a competitive industry would.'
      },
      {
        question: 'What is the Lerner index of monopoly power?',
        answer: 'A measure of markup over marginal cost:\n\\( L = \\dfrac{P - MC}{P} = -\\dfrac{1}{E_d} \\)\nIt ranges from 0 (price taker) toward 1; the more inelastic the demand the firm faces, the greater its monopoly power.'
      },
      {
        question: 'What are the sources of monopoly power?',
        answer: '1. The elasticity of market demand (less elastic → more power)\n2. The number of firms in the market (fewer → more power; barriers to entry)\n3. The interaction among firms (more rivalrous → less power)'
      },
      {
        question: 'What are the social costs of monopoly power?',
        answer: 'A monopoly restricts output below the efficient level, creating a DEADWEIGHT LOSS (lost consumer and producer surplus). Firms may also spend resources to gain or keep monopoly power — RENT SEEKING — which wastes resources. Price regulation can reduce the loss.'
      },
      {
        question: 'What is a natural monopoly, and how is it often regulated?',
        answer: 'A natural monopoly has economies of scale so large that one firm can serve the whole market at lower cost than several could (e.g. water, electricity grids). It is often regulated by setting a price (e.g. rate-of-return regulation) closer to average or marginal cost.'
      },
      {
        question: 'What is monopsony (and monopsony power)?',
        answer: 'Monopsony is a market with a single BUYER (oligopsony = a few buyers). Monopsony power is a buyer’s ability to affect the price it pays. The buyer faces an upward-sloping supply curve, so its marginal expenditure exceeds the average expenditure (price).'
      },
      {
        question: 'What is the monopsonist’s purchasing rule?',
        answer: 'It buys up to the point where the marginal VALUE of the input equals the marginal EXPENDITURE:\n\\( MV = ME \\)\nBecause \\(ME > \\) price, the monopsonist buys LESS and pays a LOWER price than a competitive buyer would.'
      },
      {
        question: 'What are the sources of monopsony power?',
        answer: '1. The elasticity of market supply (less elastic → more power)\n2. The number of buyers (fewer → more power)\n3. The interaction among buyers'
      },
      {
        question: 'How do antitrust laws limit market power?',
        answer: 'They prohibit anticompetitive behavior — e.g. agreements to fix prices or restrict output (parallel conduct / collusion) and predatory pricing aimed at driving out rivals — and restrict mergers that would create excessive market power.'
      }
    ],

    quiz: [
      {
        question: 'For a monopoly, marginal revenue is:',
        options: ['Equal to price', 'Greater than price', 'Less than price', 'Always zero'],
        correct: 2
      },
      {
        question: 'If demand is \\(P = a - bQ\\), marginal revenue is:',
        options: ['\\(a - bQ\\)', '\\(a - 2bQ\\)', '\\(2a - bQ\\)', '\\(a - \\tfrac{1}{2}bQ\\)'],
        correct: 1
      },
      {
        question: 'A monopoly maximizes profit by producing where:',
        options: ['\\(P = MC\\)', '\\(MR = MC\\)', '\\(P = AVC\\)', '\\(MR = 0\\) always'],
        correct: 1
      },
      {
        question: 'Compared with perfect competition, a monopoly produces:',
        options: ['More output at a lower price', 'Less output at a higher price', 'The same output', 'Output where \\(P = MC\\)'],
        correct: 1
      },
      {
        question: 'The Lerner index equals:',
        options: ['\\(P - MC\\)', '\\((P - MC)/P\\)', '\\(MC/P\\)', '\\(P\\times Q\\)'],
        correct: 1
      },
      {
        question: 'A market with a single BUYER is a:',
        options: ['Monopoly', 'Monopsony', 'Oligopoly', 'Duopoly'],
        correct: 1
      },
      {
        question: 'A monopsonist buys where:',
        options: ['\\(MV = ME\\)', '\\(P = MV\\)', '\\(MR = MC\\)', 'price equals marginal value'],
        correct: 0
      },
      {
        question: 'A single firm that serves the whole market at lowest cost due to economies of scale is a:',
        options: ['Cartel', 'Natural monopoly', 'Price taker', 'Monopsony'],
        correct: 1
      },
      {
        question: 'Resources spent to acquire or protect monopoly power are:',
        options: ['Producer surplus', 'Rent seeking', 'Economies of scope', 'Marginal cost'],
        correct: 1
      },
      {
        question: 'Monopoly power is greater when the firm’s demand is more:',
        options: ['Elastic', 'Inelastic', 'Horizontal', 'Competitive'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A monopolist faces the whole downward-sloping market _______ curve.',
        answer: 'demand'
      },
      {
        sentence: 'For a monopoly, marginal revenue is _______ than price.',
        answer: 'less'
      },
      {
        sentence: 'With linear demand, the MR curve is twice as _______ as the demand curve.',
        answer: 'steep'
      },
      {
        sentence: 'A monopoly produces where marginal revenue equals marginal _______.',
        answer: 'cost'
      },
      {
        sentence: 'The Lerner index measures the markup of price over marginal _______ relative to price.',
        answer: 'cost'
      },
      {
        sentence: 'A market with a single buyer is a _______.',
        answer: 'monopsony'
      },
      {
        sentence: 'A monopsonist buys until marginal value equals marginal _______.',
        answer: 'expenditure'
      },
      {
        sentence: 'A single firm serving the whole market at lowest cost is a natural _______.',
        answer: 'monopoly'
      }
    ],

    learn: {
      content:
        '<h3>Market Power: Monopoly &amp; Monopsony</h3>' +
        '<p>A <strong>monopoly</strong> is the only seller, so it faces the whole downward-sloping demand curve. To sell one more unit it must cut the price on every unit, which is why <strong>marginal revenue lies below price</strong>. For a linear demand the MR curve shares the intercept but is twice as steep:</p>' +
        '<div class="formula-box">\\[ P = a - bQ \\quad\\Longrightarrow\\quad MR = a - 2bQ \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — monopoly output and price</h4>' +
        '<p>Demand: \\(P = 100 - Q\\); marginal cost: \\(MC = 20\\) (USD). Then \\(MR = 100 - 2Q\\). Set \\(MR = MC\\):</p>' +
        '<div class="formula-box">\\[ 100 - 2Q = 20 \\;\\Rightarrow\\; Q = 40, \\qquad P = 100 - 40 = 60 \\]</div>' +
        '<p>A competitive industry would set \\(P = MC = 20\\) and \\(Q = 80\\). The monopoly produces half as much at three times the price — the gap is deadweight loss. Its markup gives a Lerner index \\(L = (60-20)/60 \\approx 0.67\\).</p>' +
        '</div>' +

        '<h4>Measuring and sourcing market power</h4>' +
        '<p>The <strong>Lerner index</strong> ties the markup to the elasticity of demand the firm faces:</p>' +
        '<div class="formula-box">\\[ L = \\frac{P - MC}{P} = -\\frac{1}{E_d} \\]</div>' +
        '<p>Power grows with inelastic demand, few firms (barriers to entry) and less aggressive rivalry.</p>' +

        '<div class="tip-box">' +
        '<h4>Monopsony — power on the buying side</h4>' +
        '<p>A <strong>monopsony</strong> is a single buyer facing an upward-sloping supply curve, so its <strong>marginal expenditure exceeds the price</strong>. It buys where \\(MV = ME\\), purchasing less and paying less than a competitive buyer. Antitrust laws limit both monopoly and monopsony power by banning price fixing, predatory pricing and anticompetitive mergers.</p>' +
        '</div>' +

        '<p class="highlight">Because a monopoly sets \\(MR = MC\\) while the efficient rule is \\(P = MC\\), it restricts output and creates a deadweight loss; natural monopolies (huge economies of scale) are usually price-regulated instead of broken up.</p>',
      image: null
    }
  },

  monopolisticOligopoly: {
    name: 'Monopolistic Competition & Oligopoly',
    icon: 'fa-people-group',
    color: '#ec4899',

    flashcards: [
      {
        question: 'What defines monopolistic competition?',
        answer: 'Many firms selling DIFFERENTIATED products, with free entry and exit. Each firm has a little market power over its own variety (so it faces a downward-sloping demand and sets price), but free entry drives long-run economic profit to zero.'
      },
      {
        question: 'What can a monopolistically competitive firm choose?',
        answer: 'The characteristics of its product, its selling/advertising expenses, and the price and quantity of its product — because product differentiation gives it some pricing discretion.'
      },
      {
        question: 'Why is monopolistic competition not fully efficient in the long run?',
        answer: 'In long-run equilibrium price equals average cost (zero profit), but production occurs where \\(P > MC\\) and NOT at the minimum of average cost. The firm operates with EXCESS CAPACITY, so there is a small efficiency loss — the price of product variety.'
      },
      {
        question: 'What defines an oligopoly?',
        answer: 'A few firms account for most or all production; the product may or may not be differentiated; there are barriers to entry, so firms can earn long-run profit. Each firm’s best action depends on what rivals do — they are INTERDEPENDENT.'
      },
      {
        question: 'What is a Nash equilibrium?',
        answer: 'A set of strategies (one per firm) in which each firm is doing the best it can GIVEN what its competitors are doing — so no firm wants to change its choice unilaterally.'
      },
      {
        question: 'What is the Cournot model?',
        answer: 'An oligopoly model where firms compete by choosing QUANTITIES simultaneously, each taking the other’s output as given. Each firm’s reaction curve shows its best output given the rival’s; the Cournot equilibrium is where the reaction curves intersect (a Nash equilibrium in quantities).'
      },
      {
        question: 'What is the Stackelberg model?',
        answer: 'A quantity-setting oligopoly where one firm moves FIRST (the leader) and the other responds (the follower). The leader gains a first-mover advantage, producing more and earning more than the follower.'
      },
      {
        question: 'What is the Bertrand model?',
        answer: 'An oligopoly model where firms compete by setting PRICES (rather than quantities). With identical products, price competition drives price down to marginal cost — even with only two firms — so profits are competed away.'
      },
      {
        question: 'What is the prisoners’ dilemma, and how does it apply to oligopoly?',
        answer: 'A non-cooperative game in which each player’s dominant strategy leads to an outcome that is worse for BOTH than if they had cooperated. In oligopoly, firms would jointly profit by keeping prices high, but each has an incentive to undercut — so they often end up in a low-price (competitive-like) outcome.'
      },
      {
        question: 'What are kinked demand and price leadership?',
        answer: 'The KINKED demand curve model explains price RIGIDITY: rivals match price cuts but not price rises, so demand is more elastic above the current price than below it, discouraging changes. PRICE LEADERSHIP (e.g. a dominant firm) is a way firms coordinate prices without explicit collusion.'
      },
      {
        question: 'What is a cartel?',
        answer: 'A group of producers that EXPLICITLY agree to cooperate in setting prices and output (acting like a monopoly). Examples: OPEC (oil), CIPEC (copper). Cartels are unstable because each member is tempted to cheat by producing more.'
      }
    ],

    quiz: [
      {
        question: 'Many firms selling differentiated products with free entry describes:',
        options: ['Perfect competition', 'Monopolistic competition', 'Monopoly', 'Monopsony'],
        correct: 1
      },
      {
        question: 'In long-run monopolistic competition, economic profit is:',
        options: ['Large and positive', 'Zero', 'Always negative', 'Equal to fixed cost'],
        correct: 1
      },
      {
        question: 'A monopolistically competitive firm in the long run produces with:',
        options: ['Minimum average cost', 'Excess capacity', 'Zero output', '\\(P = MC\\)'],
        correct: 1
      },
      {
        question: 'A market dominated by a few interdependent firms is a(n):',
        options: ['Monopoly', 'Oligopoly', 'Perfect competition', 'Monopsony'],
        correct: 1
      },
      {
        question: 'Each firm doing the best it can given rivals’ choices defines:',
        options: ['A cartel', 'A Nash equilibrium', 'Perfect competition', 'A price ceiling'],
        correct: 1
      },
      {
        question: 'In the Cournot model, firms compete by choosing:',
        options: ['Prices', 'Quantities', 'Advertising only', 'Product location only'],
        correct: 1
      },
      {
        question: 'In the Bertrand model with identical products, price is driven down to:',
        options: ['The monopoly price', 'Marginal cost', 'Average fixed cost', 'Zero output'],
        correct: 1
      },
      {
        question: 'The Stackelberg model gives an advantage to the firm that:',
        options: ['Moves second', 'Moves first', 'Advertises least', 'Has the highest cost'],
        correct: 1
      },
      {
        question: 'A group of firms that explicitly agree to fix price and output is a:',
        options: ['Cartel', 'Duopoly', 'Natural monopoly', 'Price taker'],
        correct: 0
      },
      {
        question: 'The kinked demand curve model is used to explain price:',
        options: ['Discrimination', 'Rigidity', 'Elasticity', 'Ceilings'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'Monopolistic competition has many firms selling _______ products.',
        answer: 'differentiated'
      },
      {
        sentence: 'In the long run monopolistically competitive firms earn _______ economic profit.',
        answer: 'zero'
      },
      {
        sentence: 'A monopolistically competitive firm operates with excess _______.',
        answer: 'capacity'
      },
      {
        sentence: 'A market with only a few interdependent firms is an _______.',
        answer: 'oligopoly'
      },
      {
        sentence: 'In a _______ equilibrium each firm does the best it can given its rivals.',
        answer: 'Nash'
      },
      {
        sentence: 'In the Cournot model firms compete by choosing _______.',
        answer: 'quantities'
      },
      {
        sentence: 'In the Bertrand model firms compete by choosing _______.',
        answer: 'prices'
      },
      {
        sentence: 'Firms that explicitly agree to fix prices and output form a _______.',
        answer: 'cartel'
      }
    ],

    learn: {
      content:
        '<h3>Monopolistic Competition &amp; Oligopoly</h3>' +
        '<p><strong>Monopolistic competition</strong> mixes both worlds: many firms, but each sells a <strong>differentiated</strong> product, giving it a downward-sloping demand and some pricing power. Free entry still drives long-run profit to zero — yet the firm ends up producing where \\(P > MC\\) and not at minimum average cost, leaving <strong>excess capacity</strong>. That small inefficiency is the price we pay for product variety.</p>' +

        '<h4>Oligopoly: a few interdependent firms</h4>' +
        '<p>In an <strong>oligopoly</strong> a handful of firms supply the market, protected by barriers to entry. Because each firm’s best move depends on its rivals’, we use game theory. The key solution concept is the <strong>Nash equilibrium</strong>: a set of strategies where no firm can do better by changing its own choice alone.</p>' +

        '<div class="tip-box">' +
        '<h4>Quantity vs. price competition</h4>' +
        '<p>• <strong>Cournot</strong>: firms choose QUANTITIES simultaneously; equilibrium is where their reaction curves cross.<br>' +
        '• <strong>Stackelberg</strong>: one firm chooses quantity FIRST and gains a first-mover advantage.<br>' +
        '• <strong>Bertrand</strong>: firms choose PRICES; with identical products price is driven down to marginal cost.</p>' +
        '</div>' +

        '<div class="example-box">' +
        '<h4>The prisoners’ dilemma</h4>' +
        '<p>Two firms each choose a HIGH or LOW price. Both would earn more if both kept prices high, but each has a dominant incentive to undercut. Acting in self-interest, both cut → the <strong>(Low, Low)</strong> outcome, worse for both than cooperation. This is why cartels (OPEC, CIPEC) are unstable: every member is tempted to cheat.</p>' +
        '</div>' +

        '<p class="highlight">Without explicit collusion, firms may still coordinate through price leadership or the kinked demand curve, which keeps prices rigid because rivals match cuts but not increases.</p>',
      image: null
    }
  },

  gameTheory: {
    name: 'Game Theory & Competitive Strategy',
    icon: 'fa-chess',
    color: '#f59e0b',

    flashcards: [
      {
        question: 'What is a "game" in game theory, and what are payoffs and strategies?',
        answer: 'A game is any situation in which players make strategic decisions that take account of one another’s actions. PAYOFFS are the outcomes (rewards) that result; a STRATEGY is a rule or plan of action for playing the game; an OPTIMAL strategy maximizes a player’s expected payoff.'
      },
      {
        question: 'Cooperative vs. non-cooperative games — what is the difference?',
        answer: 'In a COOPERATIVE game players can negotiate binding contracts that let them plan joint strategies. In a NON-COOPERATIVE game binding agreements are not possible, so each player acts in its own interest. Most strategic interaction in markets is non-cooperative.'
      },
      {
        question: 'What is a dominant strategy?',
        answer: 'A strategy that is optimal NO MATTER what the opponent does. When every player has a dominant strategy, the outcome is an equilibrium in dominant strategies — a particularly strong prediction.'
      },
      {
        question: 'What is a Nash equilibrium (in game-theory terms)?',
        answer: 'A set of strategies in which each player chooses the best response to the others’ strategies, so no player can improve by changing its own strategy alone. Every dominant-strategy equilibrium is a Nash equilibrium, but not vice versa.'
      },
      {
        question: 'What is a maximin strategy?',
        answer: 'A cautious (risk-averse) strategy that maximizes the player’s MINIMUM possible payoff — it guards against the worst case rather than maximizing the expected payoff. Useful when a player is uncertain or doubts the rationality of the rival.'
      },
      {
        question: 'What is a mixed strategy?',
        answer: 'A strategy in which a player makes a random choice among two or more possible actions, according to set probabilities. Some games have no pure-strategy Nash equilibrium but do have one in mixed strategies.'
      },
      {
        question: 'What is a repeated game, and what is tit-for-tat?',
        answer: 'A repeated game is one in which actions are taken and payoffs received over and over. TIT-FOR-TAT is a strategy of cooperating first, then doing whatever the opponent did last period. In infinitely (or indefinitely) repeated games, tit-for-tat can sustain cooperation that a one-shot game cannot.'
      },
      {
        question: 'What is a sequential game and the advantage of moving first?',
        answer: 'A sequential game is one in which players move in TURN, responding to each other’s actions (drawn in EXTENSIVE form, a tree). Moving first can be an advantage: a credible commitment by the first mover can shape the rival’s best response in its favor.'
      },
      {
        question: 'Why must threats and commitments be credible?',
        answer: 'An EMPTY threat — one it would not be in the player’s interest to carry out — does not influence rivals. To matter, a threat or commitment must be CREDIBLE; building a reputation, or making an irreversible commitment, makes it so.'
      },
      {
        question: 'What is entry deterrence?',
        answer: 'Actions by an incumbent that convince a potential competitor that entering would be unprofitable — e.g. a credible commitment to expand capacity or fight a price war. The threat must be credible (backed by a real commitment) to deter entry.'
      },
      {
        question: 'What is the winner’s curse in auctions?',
        answer: 'In a common-value auction (the item is worth roughly the same to all bidders but its value is uncertain), the winner tends to be the one who most OVERESTIMATED the value — so winning often means having overpaid. Rational bidders shade their bids to avoid this.'
      }
    ],

    quiz: [
      {
        question: 'A strategy that is best no matter what the opponent does is a:',
        options: ['Mixed strategy', 'Dominant strategy', 'Maximin strategy', 'Tit-for-tat strategy'],
        correct: 1
      },
      {
        question: 'A set of strategies where each player best-responds to the others is a:',
        options: ['Cartel', 'Nash equilibrium', 'Cooperative game', 'Dominant outcome'],
        correct: 1
      },
      {
        question: 'Maximizing your minimum possible payoff is a:',
        options: ['Maximin strategy', 'Mixed strategy', 'Dominant strategy', 'Sequential strategy'],
        correct: 0
      },
      {
        question: 'Randomizing over actions with set probabilities is a:',
        options: ['Pure strategy', 'Mixed strategy', 'Dominant strategy', 'Maximin strategy'],
        correct: 1
      },
      {
        question: 'Cooperating, then copying the rival’s last move, is:',
        options: ['Predatory pricing', 'Tit-for-tat', 'A mixed strategy', 'Entry deterrence'],
        correct: 1
      },
      {
        question: 'In a sequential game, players:',
        options: ['Move simultaneously', 'Move in turn', 'Cannot observe each other', 'Always cooperate'],
        correct: 1
      },
      {
        question: 'A threat a player would not actually want to carry out is:',
        options: ['Credible', 'An empty threat', 'A commitment', 'A dominant strategy'],
        correct: 1
      },
      {
        question: 'In a common-value auction, overpaying because you most overestimated value is the:',
        options: ['Winner’s curse', 'Nash equilibrium', 'Reservation price', 'Maximin'],
        correct: 0
      },
      {
        question: 'Cooperation is easiest to sustain in a game that is:',
        options: ['Played once', 'Repeated indefinitely', 'Sequential and short', 'Zero-sum'],
        correct: 1
      },
      {
        question: 'Convincing a rival that entry would be unprofitable is:',
        options: ['Price discrimination', 'Entry deterrence', 'A mixed strategy', 'A cartel'],
        correct: 1
      }
    ],

    fillBlanks: [
      {
        sentence: 'A strategy that is best regardless of what the rival does is a _______ strategy.',
        answer: 'dominant'
      },
      {
        sentence: 'At a _______ equilibrium no player can do better by changing strategy alone.',
        answer: 'Nash'
      },
      {
        sentence: 'A strategy that maximizes the worst-case payoff is a _______ strategy.',
        answer: 'maximin'
      },
      {
        sentence: 'Randomizing among actions with probabilities is a _______ strategy.',
        answer: 'mixed'
      },
      {
        sentence: 'In a repeated game, copying the rival’s last move is the _______ strategy.',
        answer: 'tit-for-tat'
      },
      {
        sentence: 'In a sequential game players move in _______.',
        answer: 'turn'
      },
      {
        sentence: 'A threat a player would not carry out is an _______ threat.',
        answer: 'empty'
      },
      {
        sentence: 'Overpaying in a common-value auction is the winner’s _______.',
        answer: 'curse'
      }
    ],

    learn: {
      content:
        '<h3>Game Theory &amp; Competitive Strategy</h3>' +
        '<p>A <strong>game</strong> is any situation in which players make strategic decisions, anticipating one another. Each player has <strong>strategies</strong> (plans of action) leading to <strong>payoffs</strong>; an optimal strategy maximizes a player’s expected payoff. In <strong>non-cooperative</strong> games binding agreements are impossible, so each acts in self-interest.</p>' +

        '<h4>Solution concepts</h4>' +
        '<p>• A <strong>dominant strategy</strong> is best no matter what the rival does.<br>' +
        '• A <strong>Nash equilibrium</strong> is a set of strategies where each player best-responds to the others — no one wants to deviate alone.<br>' +
        '• A <strong>maximin</strong> strategy maximizes the worst-case payoff (cautious play).<br>' +
        '• A <strong>mixed</strong> strategy randomizes over actions when no pure equilibrium exists.</p>' +

        '<div class="example-box">' +
        '<h4>Worked example — dominant strategy</h4>' +
        '<p>Two firms set price High or Low. Profits (Firm 1, Firm 2):</p>' +
        '<p>(High, High) = (10, 10) &nbsp;·&nbsp; (High, Low) = (2, 14)<br>' +
        '(Low, High) = (14, 2) &nbsp;·&nbsp; (Low, Low) = (5, 5)</p>' +
        '<p>Whatever the rival does, each firm earns more by choosing <strong>Low</strong> (14 &gt; 10, 5 &gt; 2). Low is a dominant strategy, so the Nash equilibrium is <strong>(Low, Low) = (5, 5)</strong> — worse for both than (High, High). That is the prisoners’ dilemma.</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Repetition, sequence and credibility</h4>' +
        '<p>In <strong>repeated</strong> games, <em>tit-for-tat</em> can sustain cooperation that a one-shot game cannot. In <strong>sequential</strong> games (extensive form) moving first can pay — but only a <strong>credible</strong> threat or commitment (backed by reputation or an irreversible move) changes a rival’s behavior; an empty threat is ignored.</p>' +
        '</div>' +

        '<p class="highlight">Applications include entry deterrence, bargaining, and auctions — where the winner’s curse warns bidders in common-value auctions to shade their bids.</p>',
      image: null
    }
  },

  factorMarkets: {
    name: 'Markets for Factor Inputs',
    icon: 'fa-briefcase',
    color: '#10b981',

    flashcards: [
      {
        question: 'What does it mean that the demand for a factor of production is a "derived" demand?',
        answer: 'Demand for an input (labor, capital, land) is DERIVED from the demand for the output it helps produce. A firm hires an input not for its own sake but because it contributes to producing a good that can be sold.'
      },
      {
        question: 'What is the marginal revenue product of labor (MRP_L)?',
        answer: 'The extra revenue from hiring one more unit of labor:\n\\( MRP_L = MR \\times MP_L \\)\nIn a competitive OUTPUT market \\(MR = P\\), so\n\\( MRP_L = P \\times MP_L \\).'
      },
      {
        question: 'How much labor does a firm in a competitive factor market hire?',
        answer: 'It hires up to the point where the marginal revenue product equals the wage (the price of labor):\n\\( MRP_L = w \\)\nHiring more would cost more than it adds; hiring less would forgo profitable output.'
      },
      {
        question: 'What are average expenditure and marginal expenditure on an input?',
        answer: 'Average expenditure is the price paid per unit of the input (the input supply curve). Marginal expenditure is the extra cost of buying one more unit. For a COMPETITIVE buyer they are equal (the input price); for a MONOPSONIST, marginal expenditure EXCEEDS average expenditure.'
      },
      {
        question: 'What is the backward-bending supply curve of labor?',
        answer: 'At low wages, a wage rise increases hours worked (substitution effect dominates — leisure is more expensive). At high wages, the income effect can dominate: workers feel richer and "buy" more leisure, so hours worked FALL — the supply curve bends backward.'
      },
      {
        question: 'Explain the substitution and income effects of a wage increase.',
        answer: 'SUBSTITUTION effect: a higher wage makes leisure more expensive, so the worker substitutes toward work (more hours). INCOME effect: the higher wage makes the worker richer, encouraging more leisure (fewer hours). The net effect determines the slope of labor supply.'
      },
      {
        question: 'What is economic rent in a factor market?',
        answer: 'The payment to a factor above the minimum needed to keep it in its current use (above its opportunity cost / supply price). LAND RENT is the classic case: land is in fixed supply, so all payment to it is economic rent.'
      },
      {
        question: 'How does a monopsony buy a factor input, and what is the rule?',
        answer: 'A monopsonist faces an upward-sloping input supply curve, so its marginal expenditure exceeds the price. It maximizes net benefit by buying up to where marginal value equals marginal expenditure (\\(MV = ME\\)); since \\(MV = MRP\\) for a firm, the rule is \\(ME = MRP\\). It hires LESS and pays a LOWER wage than a competitive buyer.'
      },
      {
        question: 'How does monopoly power in a factor market (e.g. a union) affect wages?',
        answer: 'A seller of labor with monopoly power (such as a labor union) can raise the wage above the competitive level, but at the cost of fewer jobs (lower quantity of labor employed) — a trade-off between the wage rate and the number employed.'
      },
      {
        question: 'What is equilibrium in a competitive factor market?',
        answer: 'It occurs where the market demand for the input (the sum of firms’ MRP curves) equals the market supply of the input. There the input price (e.g. the wage) and the quantity employed are determined, and every firm hires until \\(MRP = \\) input price.'
      }
    ],

    quiz: [
      {
        question: 'The demand for labor is described as a _______ demand.',
        options: ['Final', 'Derived', 'Fixed', 'Joint'],
        correct: 1
      },
      {
        question: 'The marginal revenue product of labor equals:',
        options: ['\\(MR \\times MP_L\\)', '\\(P / MP_L\\)', '\\(w \\times Q\\)', '\\(AFC \\times L\\)'],
        correct: 0
      },
      {
        question: 'A firm in a competitive factor market hires labor until:',
        options: ['\\(MRP_L = w\\)', '\\(MP_L = 0\\)', '\\(P = MC\\)', '\\(w = 0\\)'],
        correct: 0
      },
      {
        question: 'For a competitive buyer of an input, marginal expenditure equals:',
        options: ['Twice the price', 'The input price', 'Zero', 'Marginal revenue product'],
        correct: 1
      },
      {
        question: 'For a monopsonist, marginal expenditure is _______ the input price.',
        options: ['Equal to', 'Greater than', 'Less than', 'Unrelated to'],
        correct: 1
      },
      {
        question: 'A monopsonist buys an input up to where:',
        options: ['\\(MV = ME\\)', 'price equals marginal value', '\\(MP_L = 0\\)', '\\(MR = P\\)'],
        correct: 0
      },
      {
        question: 'When the income effect outweighs the substitution effect, labor supply:',
        options: ['Is horizontal', 'Bends backward', 'Is perfectly elastic', 'Shifts right'],
        correct: 1
      },
      {
        question: 'Payment to a factor above its opportunity cost is economic:',
        options: ['Profit', 'Rent', 'Surplus tax', 'Depreciation'],
        correct: 1
      },
      {
        question: 'A labor union with monopoly power can raise wages but typically reduces:',
        options: ['The price of output', 'The number of jobs', 'Marginal product', 'Fixed cost'],
        correct: 1
      },
      {
        question: 'In a competitive output market, MRP_L simplifies to:',
        options: ['\\(P \\times MP_L\\)', '\\(MR / P\\)', '\\(w / MP_L\\)', '\\(MC \\times Q\\)'],
        correct: 0
      }
    ],

    fillBlanks: [
      {
        sentence: 'Demand for an input is _______ from the demand for the output it makes.',
        answer: 'derived'
      },
      {
        sentence: 'Marginal revenue product equals marginal revenue times marginal _______.',
        answer: 'product'
      },
      {
        sentence: 'A competitive firm hires labor until MRP equals the _______.',
        answer: 'wage'
      },
      {
        sentence: 'For a monopsonist, marginal expenditure exceeds the input _______.',
        answer: 'price'
      },
      {
        sentence: 'A monopsonist buys until marginal value equals marginal _______.',
        answer: 'expenditure'
      },
      {
        sentence: 'When the income effect dominates, the labor supply curve bends _______.',
        answer: 'backward'
      },
      {
        sentence: 'Payment to land, which is in fixed supply, is entirely economic _______.',
        answer: 'rent'
      },
      {
        sentence: 'A union can raise wages but usually lowers the number of _______.',
        answer: 'jobs'
      }
    ],

    learn: {
      content:
        '<h3>Markets for Factor Inputs</h3>' +
        '<p>Firms buy inputs — labor, capital, land — so the demand for a factor is a <strong>derived demand</strong>: it comes from the demand for the output the factor helps produce. The value of one more worker is the <strong>marginal revenue product</strong>:</p>' +
        '<div class="formula-box">\\[ MRP_L = MR \\times MP_L \\quad\\xrightarrow{\\text{competitive output}}\\quad MRP_L = P \\times MP_L \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — the hiring rule</h4>' +
        '<p>Output sells at \\(P = 10\\) (USD) and the next worker’s marginal product is \\(MP_L = 5\\) units. Then</p>' +
        '<div class="formula-box">\\[ MRP_L = 10 \\times 5 = 50 \\]</div>' +
        '<p>A competitive firm hires until \\(MRP_L = w\\). If the wage is \\(w = 50\\) it is worth hiring this worker; if the wage were 60 it would not.</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Average vs. marginal expenditure</h4>' +
        '<p>A <strong>competitive</strong> buyer pays the same price for every unit, so marginal expenditure equals the price. A <strong>monopsonist</strong> faces an upward-sloping supply curve — buying more raises the price on all units — so its marginal expenditure EXCEEDS the price. It buys where \\(MV = ME\\) (i.e. \\(ME = MRP\\)), hiring less and paying less than a competitive buyer.</p>' +
        '</div>' +

        '<h4>Labor supply and rent</h4>' +
        '<p>A wage rise has two effects: the <strong>substitution effect</strong> (work more, leisure is dearer) and the <strong>income effect</strong> (work less, you feel richer). When income wins at high wages the labor supply curve <strong>bends backward</strong>.</p>' +
        '<p class="highlight">Payment to a factor above its opportunity cost is economic rent — and because land is fixed in supply, all payment to land is rent. Unions (monopoly power in selling labor) can raise wages, but usually at the cost of fewer jobs.</p>',
      image: null
    }
  },

  externalitiesPublicGoods: {
    name: 'Externalities & Public Goods',
    icon: 'fa-smog',
    color: '#f97316',

    flashcards: [
      {
        question: 'What is an externality?',
        answer: 'A cost or benefit of an activity that falls on a THIRD party not involved in the transaction, and is not reflected in the market price. It can be NEGATIVE (e.g. pollution) or POSITIVE (e.g. a neighbor’s nice garden, or education).'
      },
      {
        question: 'Why do negative externalities cause inefficiency?',
        answer: 'The producer ignores the external cost, so the private marginal cost is below the marginal SOCIAL cost. The market therefore produces TOO MUCH of the good (output beyond the efficient level), creating a deadweight loss.'
      },
      {
        question: 'Define marginal external cost and marginal social cost.',
        answer: 'Marginal external cost (MEC) is the cost imposed on third parties by one more unit. Marginal social cost is the private marginal cost plus that external cost:\n\\( MSC = MC + MEC \\)\nThe efficient output is where \\(MSC = MSB\\) (marginal social benefit).'
      },
      {
        question: 'Why do positive externalities also cause inefficiency?',
        answer: 'When an activity confers external BENEFITS, the marginal social benefit exceeds the private benefit, so the market produces TOO LITTLE of the good (output below the efficient level). A subsidy can correct it.'
      },
      {
        question: 'What is an emissions fee (a Pigouvian tax)?',
        answer: 'A charge per unit of pollution emitted, set equal to the marginal external cost at the efficient level. It makes firms internalize the external cost (private cost rises to social cost), so they cut output/emissions to the efficient amount.'
      },
      {
        question: 'Compare an emissions standard with an emissions fee.',
        answer: 'A STANDARD sets a legal limit on emissions (a quantity); a FEE charges per unit emitted (a price). With uncertainty about firms’ abatement costs, the two are NOT equivalent — fees are usually cheaper when abatement costs vary across firms because they let low-cost abaters cut the most.'
      },
      {
        question: 'What are tradeable emissions permits?',
        answer: 'A system in which the government issues a fixed number of permits (a cap) that firms can BUY and SELL. Firms that can cut emissions cheaply sell permits to those for whom cutting is costly, so the total reduction is achieved at the LOWEST overall cost (cap-and-trade).'
      },
      {
        question: 'What is the Coase theorem?',
        answer: 'If property rights are clearly defined and bargaining is costless, private parties can negotiate an EFFICIENT outcome to an externality on their own, regardless of who holds the rights. In practice high transaction costs (and many parties) often prevent this.'
      },
      {
        question: 'What is the common property resource problem?',
        answer: 'A common property resource is one to which everyone has FREE access (e.g. ocean fisheries, common grazing land). Because no one owns it, each user ignores the cost imposed on others, so it is OVERUSED and depleted — the "tragedy of the commons".'
      },
      {
        question: 'What defines a public good?',
        answer: 'A good that is NONRIVAL (one person’s use does not reduce the amount available to others) and NONEXCLUSIVE (you cannot prevent non-payers from consuming it), e.g. national defense or clean air. These features lead to the FREE-RIDER problem.'
      },
      {
        question: 'What is the free-rider problem?',
        answer: 'Because a public good is nonexclusive, people can enjoy it without paying — so each has an incentive to "free ride" on others. As a result the private market under-provides public goods, which is why government often supplies them.'
      }
    ],

    quiz: [
      {
        question: 'A cost imposed on third parties not reflected in price is a:',
        options: ['Sunk cost', 'Negative externality', 'Fixed cost', 'Producer surplus'],
        correct: 1
      },
      {
        question: 'A market with a negative externality produces:',
        options: ['Too little output', 'Too much output', 'The efficient output', 'Zero output'],
        correct: 1
      },
      {
        question: 'Marginal social cost equals private marginal cost plus marginal external:',
        options: ['Benefit', 'Cost', 'Revenue', 'Product'],
        correct: 1
      },
      {
        question: 'A market with a positive externality produces:',
        options: ['Too much output', 'Too little output', 'The efficient output', 'Only public goods'],
        correct: 1
      },
      {
        question: 'A per-unit charge on pollution equal to the external cost is a(n):',
        options: ['Emissions standard', 'Emissions fee (Pigouvian tax)', 'Quota', 'Subsidy'],
        correct: 1
      },
      {
        question: 'A cap with permits firms can buy and sell is:',
        options: ['An emissions standard', 'Tradeable emissions permits', 'A price ceiling', 'A tariff'],
        correct: 1
      },
      {
        question: 'Clear property rights + costless bargaining → efficient outcome describes the:',
        options: ['Lerner index', 'Coase theorem', 'Nash equilibrium', 'Laffer curve'],
        correct: 1
      },
      {
        question: 'A resource everyone can access freely tends to be:',
        options: ['Underused', 'Overused (depleted)', 'Efficiently used', 'A public good'],
        correct: 1
      },
      {
        question: 'A good that is nonrival and nonexclusive is a:',
        options: ['Private good', 'Public good', 'Inferior good', 'Giffen good'],
        correct: 1
      },
      {
        question: 'Enjoying a public good without paying for it is the _______ problem.',
        options: ['Free-rider', 'Winner’s curse', 'Principal-agent', 'Adverse selection'],
        correct: 0
      }
    ],

    fillBlanks: [
      {
        sentence: 'A cost or benefit falling on a third party is an _______.',
        answer: 'externality'
      },
      {
        sentence: 'A market with a negative externality produces too _______ output.',
        answer: 'much'
      },
      {
        sentence: 'Marginal social cost equals private marginal cost plus marginal external _______.',
        answer: 'cost'
      },
      {
        sentence: 'A per-unit charge on pollution is an emissions _______.',
        answer: 'fee'
      },
      {
        sentence: 'A cap with permits firms can trade is known as cap-and-_______.',
        answer: 'trade'
      },
      {
        sentence: 'With clear property rights and costless bargaining, the _______ theorem predicts an efficient outcome.',
        answer: 'Coase'
      },
      {
        sentence: 'A good that is nonrival and nonexclusive is a _______ good.',
        answer: 'public'
      },
      {
        sentence: 'Enjoying a public good without paying is the _______ problem.',
        answer: 'free-rider'
      }
    ],

    learn: {
      content:
        '<h3>Externalities &amp; Public Goods</h3>' +
        '<p>An <strong>externality</strong> is a cost or benefit that spills onto a third party and is not in the price. With a <strong>negative</strong> externality (pollution) the firm ignores the harm, so private cost understates the true social cost and the market <strong>overproduces</strong>. The efficient rule compares full social cost and benefit:</p>' +
        '<div class="formula-box">\\[ MSC = MC + MEC, \\qquad \\text{efficient where } MSC = MSB \\]</div>' +

        '<div class="example-box">' +
        '<h4>Worked example — pricing the externality</h4>' +
        '<p>A factory’s private marginal cost is \\(MC = 10\\) and each unit imposes a marginal external cost \\(MEC = 4\\) (USD). Then</p>' +
        '<div class="formula-box">\\[ MSC = 10 + 4 = 14 \\]</div>' +
        '<p>A <strong>Pigouvian fee</strong> of 4 per unit makes the firm face the full cost of 14, so it cuts output back to the efficient level where \\(MSC = MSB\\). A positive externality is corrected the opposite way — with a subsidy, because the market otherwise <strong>underproduces</strong>.</p>' +
        '</div>' +

        '<div class="tip-box">' +
        '<h4>Standards, fees and permits</h4>' +
        '<p>Government can set an <strong>emissions standard</strong> (a quantity limit), an <strong>emissions fee</strong> (a price per unit), or issue <strong>tradeable permits</strong> (cap-and-trade). Permits and fees reach a target at lowest cost because low-cost abaters cut the most. By the <strong>Coase theorem</strong>, clear property rights plus costless bargaining can fix an externality privately — but high transaction costs usually get in the way.</p>' +
        '</div>' +

        '<h4>Common resources and public goods</h4>' +
        '<p><strong>Common property resources</strong> (open-access fisheries, grazing land) are overused — the tragedy of the commons. <strong>Public goods</strong> are <em>nonrival</em> and <em>nonexclusive</em> (national defense, clean air); their nonexcludability creates the <strong>free-rider</strong> problem.</p>' +
        '<p class="highlight">Because free riders will not pay, private markets under-provide public goods — a key reason government finances them.</p>',
      image: null
    }
  }
};

// Izloži na window — IME mora odgovarati data/catalog.js -> content.resolve
if (typeof window !== 'undefined') { window.microeconomicsM2 = microeconomicsM2; }
if (typeof module !== 'undefined' && module.exports) { module.exports = microeconomicsM2; }
