// Backup data for Episode Library and Notable Signals
window.backupData = window.backupData || {};
window.backupData.priorityBriefings = {
    items: [
        {
            id: 'briefing-1',
            priority: 'critical',
            priorityLabel: 'Market Alert',
            podcast: 'All-In',
            time: '3h ago',
            duration: '94 min',
            influence: 'High (97)',
            title: 'AI\'s Two-Speed Market: Infrastructure Soars While Apps Crash',
            guest: 'Marc Andreessen',
            conversationSummary: 'Marc opens by challenging the "apps are dead" narrative, arguing infrastructure plays are actually enabling a new class of applications we couldn\'t build before. Chamath pushes back hard, pointing to Jasper\'s 90% revenue decline as proof of commoditization. The debate gets heated when Friedberg brings up unit economics - Marc insists the math works at scale while Sacks questions whether any AI app has defensible moats. They find common ground on vertical AI with proprietary data being the only sustainable play. The conversation shifts when Marc reveals a16z is going all-in on infrastructure precisely because it enables their portfolio companies to build differentiated products cheaper.',
            keyInsights: [
                'Q2 data confirms: 70% of AI funding to infrastructure, only 30% to applications',
                'Application layer seeing rapid commoditization - margins compressing to sub-20%',
                'a16z announcing $20B AI fund focused exclusively on US infrastructure plays'
            ],
            signals: [
                { type: 'thesis', text: '✓ Infrastructure Thesis: Your focus on intelligence layer perfectly timed' },
                { type: 'market', text: '⚠ Competitive Alert: Expect flood of infrastructure pivots next quarter' }
            ],
            patternRecognition: {
                metric1: { value: '4th', label: 'Major fund confirming infrastructure > apps thesis' },
                metric2: { value: '87%', label: 'Of this week\'s episodes mentioned infrastructure dominance' },
                metric3: { value: '15', label: 'Portfolio companies pivoting from apps to infrastructure' },
                metric4: { value: '2nd', label: 'Time Marc Andreessen has made this infrastructure argument' }
            }
        },
        {
            id: 'briefing-2',
            priority: 'opportunity',
            priorityLabel: 'Funding Intel',
            podcast: 'The Twenty Minute VC',
            time: '8h ago',
            duration: '82 min',
            influence: 'High (93)',
            title: 'Inside the Series A Bloodbath: Why 40% Can\'t Raise',
            guest: 'Sarah Tavel',
            conversationSummary: 'Sarah doesn\'t sugarcoat it - "This is the hardest Series A environment I\'ve seen in 15 years." Harry probes on specific metrics, and Sarah reveals Benchmark\'s new internal bar has quietly moved from $1M to $3M ARR. The conversation turns fascinating when she shares how even their own portfolio companies are struggling to hit these numbers. Sarah admits they\'re now recommending 24-month runways as standard, up from 18. When Harry asks about AI companies, she\'s blunt: "Unless you\'re infrastructure, you need $5M minimum - the multiples just don\'t work otherwise." The real bombshell comes when she mentions 40% of companies that should be raising Series A simply can\'t in this environment.',
            keyInsights: [
                'New Series A bar: $3M ARR minimum, $5M for AI plays outside infrastructure',
                'Seed extensions now average 9 months - plan for 24-month runway minimum',
                'Quality flight: Top 20% of startups getting 80% of capital'
            ],
            signals: [
                { type: 'market', text: '◆ Fundraising Window: Series A bar rising monthly - move fast' },
                { type: 'strategic', text: '🎯 Revenue Target: Need $3M ARR by Q1 2026 for credible raise' }
            ],
            patternRecognition: {
                metric1: { value: '12th', label: 'Fund confirming $3M ARR as new Series A minimum' },
                metric2: { value: '40%', label: 'Of 2023 seeds still seeking Series A funding' },
                metric3: { value: '24', label: 'Months runway now required vs 18 previously' },
                metric4: { value: '5x', label: 'Revenue multiple compression from 2021 highs' }
            }
        },
        {
            id: 'briefing-3',
            priority: 'elevated',
            priorityLabel: 'LP Movement',
            podcast: 'Capital Allocators',
            time: '14h ago',
            duration: '71 min',
            influence: 'High (89)',
            title: 'CalPERS Goes All-In: The $21B Venture Bet',
            guest: 'Nicole Musicco',
            conversationSummary: 'Ted opens with the shocking stat - CalPERS is 10x-ing their venture allocation. Nicole explains the three-year journey to convince the board, including heated debates about venture\'s J-curve and liquidity issues. The turning point came when she presented data showing their venture portfolio outperformed public markets by 500bps over 20 years. Ted challenges her on concentration risk, but Nicole stands firm: "We\'d rather back 10 exceptional specialist funds than 50 generalists." The conversation gets tactical when she reveals they now require GPs to show clear DPI paths - no more "patient capital" narratives. She specifically calls out sector-focused funds as outperformers, citing Lux (deep tech) and Foresite (healthcare) as models.',
            keyInsights: [
                'Largest pension fund moving from 1.4% to 10% venture allocation over 3 years',
                'Explicit preference for specialist funds over generalists - "depth beats breadth"',
                'New requirement: Clear path to DPI within 5-7 years, not just paper markups'
            ],
            signals: [
                { type: 'lp', text: '◇ LP Opportunity: Institutional capital flooding in - good for ecosystem' },
                { type: 'strategic', text: '💡 Positioning: Specialist angle (VC intelligence) attractive to LPs' }
            ],
            patternRecognition: {
                metric1: { value: '6th', label: 'Major pension fund increasing venture allocation' },
                metric2: { value: '$21B', label: 'CalPERS commitment driving LP confidence' },
                metric3: { value: '10%', label: 'New allocation vs 1.4% historical average' },
                metric4: { value: '3rd', label: 'Time Nicole Musicco discussed specialist funds preference' }
            }
        },
        {
            id: 'briefing-4',
            priority: 'critical',
            priorityLabel: 'Infrastructure Deep Dive',
            podcast: 'Acquired',
            time: '1d ago',
            duration: '142 min',
            influence: 'High (94)',
            title: 'The NVIDIA Moment: Why Every AI Company Needs Infrastructure',
            guest: 'Jensen Huang, Roelof Botha',
            conversationSummary: 'Ben and David start by asking Jensen the trillion-dollar question: "Is this sustainable?" Jensen\'s response is emphatic - "We\'re in inning two of a nine-inning game." Roelof jumps in with Sequoia\'s data showing every successful AI company spending 4x on infrastructure versus revenue. The conversation heats up when they debate the democratization thesis - Jensen argues costs will drop 90% annually, but Roelof counters that demand is growing even faster. The real insight comes when Jensen breaks down NVIDIA\'s roadmap: "Every company will need their own AI infrastructure like they needed websites in 1995." David connects the dots to the VC ecosystem, noting how every fund is now hiring ML engineers just to evaluate deals.',
            keyInsights: [
                'GPU costs dropped 90% but demand growing 10x - infrastructure still bottleneck',
                'Every $1 in AI app revenue requires $4 in infrastructure investment',
                'Next 18 months will see $500B+ infrastructure buildout globally'
            ],
            signals: [
                { type: 'thesis', text: '✓ Thesis Match: Intelligence infrastructure critical for AI ecosystem' },
                { type: 'market', text: '◆ Timing: Infrastructure gold rush just beginning' }
            ],
            patternRecognition: {
                metric1: { value: '4x', label: 'Infrastructure spend per $1 of AI revenue' },
                metric2: { value: '90%', label: 'GPU cost drop annually per Jensen\'s roadmap' },
                metric3: { value: '$500B', label: 'Global infrastructure buildout next 18 months' },
                metric4: { value: '2nd', label: 'Inning of 9-inning game per Jensen Huang' }
            }
        },
        {
            id: 'briefing-5',
            priority: 'opportunity',
            priorityLabel: 'Defense Thesis',
            podcast: 'The Tim Ferriss Show',
            time: '1d ago',
            duration: '118 min',
            influence: 'High (91)',
            title: 'Palmer Luckey: Defense Tech\'s $1 Trillion Opportunity',
            guest: 'Palmer Luckey',
            conversationSummary: 'Palmer doesn\'t hold back - "Silicon Valley\'s ESG obsession left a trillion dollars on the table." Tim pushes on the ethics, but Palmer reframes brilliantly: "Democracies need technological superiority to survive." The conversation turns when Palmer reveals Anduril\'s valuation journey from "uninvestable" to $14B in five years. He shares how Peter Thiel was the only major VC who initially got it, while others worried about "reputational risk." The money quote comes midway: "We\'re replacing soldiers with software - that\'s more humane, not less." Tim asks about competition, and Palmer laughs: "The defense primes are bringing tanks to a drone fight." He predicts 50% of defense spending will shift to autonomous systems within a decade.',
            keyInsights: [
                'Anduril at $14B proves defense tech can achieve venture-scale returns',
                'US + allies spending $2T annually - software eating only 2% currently',
                'Autonomous systems replacing 50% of defense personnel within decade'
            ],
            signals: [
                { type: 'market', text: '◆ Market Signal: Defense tech mainstream despite ESG concerns' },
                { type: 'thesis', text: '✓ Dual-Use: Commercial AI tech finding defense applications' }
            ],
            patternRecognition: {
                metric1: { value: '3', label: 'Defense tech deals in top 10 Q2 rounds' },
                metric2: { value: '$14B', label: 'Anduril valuation proving sector viability' },
                metric3: { value: '50%', label: 'Defense spending shifting to autonomous systems' },
                metric4: { value: '5th', label: 'Major fund overcoming ESG concerns this quarter' }
            }
        },
        {
            id: 'briefing-6',
            priority: 'elevated',
            priorityLabel: 'Developer Tools',
            podcast: 'Changelog',
            time: '2d ago',
            duration: '96 min',
            influence: 'Medium (82)',
            title: 'GitHub Copilot\'s $500M Run Rate Changes Everything',
            guest: 'Thomas Dohmke',
            conversationSummary: 'Thomas starts with a bold claim: "We\'re seeing the biggest productivity gain since the invention of high-level languages." The hosts are skeptical - Adam asks about accuracy concerns. Thomas shares internal data: developers using Copilot ship 55% more code with 40% fewer bugs. The conversation pivots when they discuss Cursor\'s $2.5B valuation. Thomas is surprisingly gracious: "Competition validates the market - there\'s room for multiple winners." The discussion gets spicy when they debate AI replacing developers. Thomas firmly disagrees: "We\'re augmenting, not replacing. The demand for software is infinite." He reveals GitHub\'s roadmap includes specialized models for different languages and frameworks, essentially becoming an AI platform, not just a tool.',
            keyInsights: [
                'Every developer will have AI pair programmer by 2026 - market inevitability',
                'Cursor at $2.5B shows appetite for specialized dev tools beyond Copilot',
                'Enterprise spending on dev productivity tools growing 200% YoY'
            ],
            signals: [
                { type: 'market', text: '◆ Dev Tools Explosion: Still early innings' },
                { type: 'competitive', text: '⚡ Consolidation Coming: Major acquisitions expected Q4' }
            ],
            patternRecognition: {
                metric1: { value: '55%', label: 'More code shipped by Copilot users' },
                metric2: { value: '$500M', label: 'GitHub Copilot run rate milestone' },
                metric3: { value: '200%', label: 'YoY enterprise spending on dev tools' },
                metric4: { value: '2026', label: 'When every developer will have AI pair programmer' }
            }
        },
        {
            id: 'briefing-7',
            priority: 'elevated',
            priorityLabel: 'Exit Analysis',
            podcast: 'This Week in Startups',
            time: '2d ago',
            duration: '103 min',
            influence: 'High (86)',
            title: 'M&A is Eating IPOs: The New Exit Playbook',
            guest: 'Frank Slootman, Ruth Porat, Dan Dees',
            conversationSummary: 'Jason sets the stage: "27 IPOs in six months - that\'s a disaster." Frank Slootman doesn\'t mince words: "The IPO window isn\'t closed, it\'s boarded up." Ruth Porat provides the strategic buyer perspective, revealing Google has $100B earmarked for acquisitions through 2026. The conversation gets interesting when Dan Dees shares actual data - strategic acquirers are paying 40-60% premiums because "they\'re buying time, not technology." Frank drops a bombshell: "Every founder should be building relationships with potential acquirers from day one." Ruth agrees, adding that Google now has a team dedicated to tracking Series A companies. The panel consensus: M&A is the new IPO, and it\'s not temporary.',
            keyInsights: [
                'Only 27 IPOs in H1 2025 - lowest since 2009 financial crisis',
                'Strategic acquirers paying 40-60% premiums over last private rounds',
                'Every major tech co has $10B+ allocated for AI acquisitions'
            ],
            signals: [
                { type: 'market', text: '◆ Exit Strategy: Build for strategic acquisition, not IPO' },
                { type: 'lp', text: '◇ LP Intel: M&A providing liquidity lifeline' }
            ],
            patternRecognition: {
                metric1: { value: '27', label: 'IPOs in H1 2025 vs 183 in 2021' },
                metric2: { value: '40-60%', label: 'M&A premiums over last private rounds' },
                metric3: { value: '$100B', label: 'Google\'s acquisition war chest through 2026' },
                metric4: { value: '3rd', label: 'Quarter of sustained IPO drought' }
            }
        },
        {
            id: 'briefing-8',
            priority: 'opportunity',
            priorityLabel: 'Vertical AI',
            podcast: 'The Knowledge Project',
            time: '3d ago',
            duration: '91 min',
            influence: 'High (88)',
            title: 'Why Every Industry Needs Its Own Harvey',
            guest: 'Daphne Koller, Will Marshall, Josh Kushner',
            conversationSummary: 'Shane starts by asking why Harvey hit a $5B valuation so fast. Josh Kushner explains: "Lawyers bill by the hour - AI that saves time has instant ROI." Daphne builds on this, sharing how Insitro is doing the same for drug discovery. The conversation gets philosophical when Will Marshall asks, "Why didn\'t horizontal AI win?" Daphne\'s answer is illuminating: "Every industry has decades of specialized knowledge that general models can\'t capture." Josh reveals Thrive\'s thesis: they\'re betting on 20-30 vertical AI winners across industries. The group debates which verticals are next. Will suggests logistics, Daphne says education, but Josh makes a compelling case for financial services: "Any industry with complex compliance and high-value knowledge work is ripe for disruption."',
            keyInsights: [
                'Legal (Harvey $5B), Healthcare (Abridge $5.3B) proving vertical playbook',
                'Next winners: Financial services, real estate, logistics, education',
                'Vertical AI companies seeing 3-5x revenue multiples vs horizontal'
            ],
            signals: [
                { type: 'thesis', text: '✓ Vertical Opportunity: VC industry prime for AI transformation' },
                { type: 'market', text: '◆ First-Mover: No dominant VC intelligence platform yet' }
            ],
            patternRecognition: {
                metric1: { value: '2', label: '$5B+ vertical AI winners (Harvey, Abridge)' },
                metric2: { value: '20-30', label: 'Vertical AI champions predicted by Thrive' },
                metric3: { value: '3-5x', label: 'Revenue multiple premium for vertical AI' },
                metric4: { value: '4th', label: 'Major vertical reaching AI inflection point' }
            }
        },
        {
            id: 'briefing-9',
            priority: 'opportunity',
            priorityLabel: 'Fund Strategy',
            podcast: 'BG2Pod',
            time: '3d ago',
            duration: '124 min',
            influence: 'High (90)',
            title: 'Power Law Changes: Why Funds Need New Math',
            guest: 'Reid Hoffman, Elad Gil',
            conversationSummary: 'Brad opens with a provocative question: "Is the power law dead or just different?" Reid\'s response surprises everyone: "It\'s more extreme than ever - we\'re seeing 1000x outcomes." Elad provides the data: his fund\'s infrastructure bets are already at 500x on paper. Bill Gurley chimes in with caution: "Paper multiples in private markets mean nothing without liquidity." The debate intensifies when Reid argues concentrated portfolios are the only way to capture these outliers. Elad disagrees: "You still need 30-40 bets to find the one." Brad shares Altimeter\'s approach - they\'re doing fewer, larger bets with heavy reserves for winners. The conversation concludes with Reid\'s warning: "The biggest risk isn\'t losing money, it\'s missing the next NVIDIA because your check was too small."',
            keyInsights: [
                'AI creating 100x outcomes where 10x was previous ceiling',
                'Seed funds seeing 500x returns on infrastructure plays',
                'Warning: Late-stage valuations disconnecting from fundamentals'
            ],
            signals: [
                { type: 'lp', text: '◇ Fund Dynamics: Concentrated bets beating diversification' },
                { type: 'market', text: '◆ Valuation Alert: Infrastructure premiums may compress' }
            ],
            patternRecognition: {
                metric1: { value: '1000x', label: 'New outcome ceiling vs traditional 10x' },
                metric2: { value: '500x', label: 'Current paper returns on infrastructure bets' },
                metric3: { value: '30-40', label: 'Bets still needed to find the outlier' },
                metric4: { value: '2nd', label: 'Time Reid Hoffman warned about missing NVIDIA' }
            }
        }
    ]
};

// Add other data sections to backup
window.backupData.intelligenceBrief = {
      summary: {
          hoursAnalyzed: 1426,
          lastUpdated: '38 mins ago',
          collapsed: 'AI infrastructure dominates with 70% of funding [8 sources]. Series A bar at $3M ARR [confirmed by Emergence, First Round, Bessemer]. Exit drought: 27 IPOs H1 vs 183 in 2021. Defense tech surging: 3 of top 10 Q2 deals. Blindspot: Europe deep tech arbitrage opportunity.',
          expanded: {
              consensus: [
                  {
                      title: 'Infrastructure beats applications 4:1',
                      sources: 'All-In, BG2Pod, a16z podcast, Index Ventures aligned',
                      detail: 'Scale AI ($14.3B), Anysphere ($2.5B) prove infrastructure premium sustainable'
                  },
                  {
                      title: 'Enterprise agents hit production',
                      sources: '42 mentions this week across enterprise pods',
                      detail: '70% of Fortune 500s moved from pilots to production deployments'
                  },
                  {
                      title: 'Series A requires $3M+ ARR',
                      sources: 'Confirmed by 15+ funds including Benchmark, First Round',
                      detail: 'Up from $1.5M in 2023. AI plays need $5M+ outside infrastructure'
                  },
                  {
                      title: 'Defense tech goes mainstream',
                      sources: 'Anduril $14B, significant Q2 deal flow',
                      detail: 'Geopolitical tensions overriding ESG concerns for most funds'
                  }
              ],
              contrarian: [
                  {
                      title: 'Defense tech defying critics',
                      sources: 'Anduril $14B valuation, Hadrian $260M Series C',
                      detail: 'Geopolitical tensions overriding ESG concerns at major funds'
                  },
                  {
                      title: 'M&A is the new IPO',
                      sources: 'Google\'s $32B Wiz deal, only 27 H1 IPOs',
                      detail: 'Strategic buyers paying 40% premiums over last private rounds'
                  },
                  {
                      title: 'Vertical AI > Horizontal consensus building',
                      sources: 'Harvey, Abridge valuations proving thesis',
                      detail: 'Every vertical racing to find its $5B+ AI champion'
                  }
              ],
              blindspots: [
                  {
                      title: 'Europe deep tech significantly undervalued',
                      sources: 'Limited US coverage despite 44% of global deep tech funding',
                      detail: 'Arbitrage opportunity in quantum, robotics, advanced materials'
                  },
                  {
                      title: 'Developer tools consolidation wave',
                      sources: 'GitHub Copilot dominance barely discussed',
                      detail: 'Winner-take-all dynamics emerging, M&A wave incoming'
                  },
                  {
                      title: 'Climate tech quiet resurgence',
                      sources: 'Industrial applications gaining traction',
                      detail: 'Moving from hype to profitability, limited coverage'
                  }
              ]
          }
      },
      metrics: {
          velocityTracking: [
              { theme: 'Enterprise Agents', change: '+25%', direction: 'positive' },
              { theme: 'Defense Tech', change: '+33%', direction: 'positive' },
              { theme: 'AI Infrastructure', change: '+17%', direction: 'positive' },
              { theme: 'Exit Strategies', change: '+50%', direction: 'positive' },
              { theme: 'Vertical AI', change: '+34%', direction: 'positive' },
              { theme: 'Climate Tech', change: '+113%', direction: 'positive' },
              { theme: 'Traditional SaaS', change: '-15%', direction: 'negative' }
          ],
          influenceMetrics: [
              { name: 'All-In Podcast', score: 'High (97)' },
              { name: '20VC', score: 'High (93)' },
              { name: 'BG2Pod', score: 'High (91)' },
              { name: 'Invest Like Best', score: 'High (86)' },
              { name: 'Acquired', score: 'High (94)' },
              { name: 'Tim Ferriss', score: 'High (91)' },
              { name: 'Knowledge Project', score: 'High (88)' }
          ],
          consensusMonitor: [
              { topic: 'Infrastructure > Apps', level: 'Strong (>85% agreement)' },
              { topic: 'Enterprise AI Adoption', level: 'Strong (>80% agreement)' },
              { topic: 'Series A Bar Rising', level: 'Building (70% agreement)' },
              { topic: 'Defense Tech Value', level: 'Mixed (55% agreement)' },
              { topic: 'Vertical AI Premium', level: 'Building (70% agreement)' },
              { topic: 'Exit Environment', level: 'Building (65% agreement)' },
              { topic: 'Traditional SaaS', level: 'Weak (<25% agreement)' }
          ],
          topicCorrelations: [
              { topics: 'AI + Infrastructure', percentage: 82 },
              { topics: 'Enterprise + Production', percentage: 73 },
              { topics: 'Exit Drought + M&A', percentage: 79 },
              { topics: 'Vertical AI + Valuations', percentage: 68 },
              { topics: 'Defense + Geopolitics', percentage: 71 },
              { topics: 'Climate + Industrial', percentage: 58 }
          ]
      }
  };

  // ============================================
  // WEEKLY BRIEF CONTENT (FOR PDF GENERATION)
  // ============================================
  window.backupData.weeklyBrief = {
      executive: {
          summary: [
              {
                  type: 'consensus',
                  text: 'AI infrastructure reaches 70% of funding',
                  details: '[287 mentions across 46 episodes] with Scale AI at $14.3B proving "picks and shovels" thesis.'
              },
              {
                  type: 'growth',
                  text: 'Enterprise agents explode +107% w/w',
                  details: '[234 mentions] as 70% of Fortune 500s move from pilots to production deployments.'
              },
              {
                  type: 'contrarian',
                  text: 'Defense tech defies critics',
                  details: 'Anduril at $14B and 3 of top 10 Q2 deals validate sector despite ESG concerns.'
              },
              {
                  type: 'warning',
                  text: 'Exit drought deepens:',
                  details: 'Only 27 IPOs in H1 2025. M&A becomes primary path with 40% premiums.'
              }
          ]
      },
      keyMetrics: [
          {
              label: 'Velocity Leader',
              value: '+107%',
              context: 'Enterprise Agents',
              change: '↑ w/w',
              changeType: 'up'
          },
          {
              label: 'Peak Consensus',
              value: 'Strong',
              context: 'AI Infrastructure Funding',
              change: '46 episodes',
              changeType: 'neutral'
          },
          {
              label: 'Exit Alert',
              value: '27 IPOs',
              context: 'H1 2025 Total',
              change: '↓ 85% YoY',
              changeType: 'down'
          },
          {
              label: 'Series A Bar',
              value: '$3M ARR',
              context: 'New Minimum',
              change: '↑ 75% vs 2021',
              changeType: 'up'
          }
      ],
      topicMomentum: [
          {
              topic: 'Enterprise Agents',
              change: '+107% w/w',
              momentum: 52,
              mentions: 234,
              context: 'production deployments accelerating',
              direction: 'positive'
          },
          {
              topic: 'Defense Tech',
              change: '+111% w/w',
              momentum: 41,
              mentions: 178,
              context: 'geopolitics driving mainstream adoption',
              direction: 'positive'
          },
          {
              topic: 'AI Infrastructure',
              change: '+64% w/w',
              momentum: 38,
              mentions: 287,
              context: 'capturing 70% of all AI funding',
              direction: 'positive'
          },
          {
              topic: 'Vertical AI',
              change: '+60% w/w',
              momentum: 31,
              mentions: 167,
              context: 'Harvey and Abridge prove $5B+ potential',
              direction: 'positive'
          },
          {
              topic: 'Exit Strategies',
              change: '+50% w/w',
              momentum: 29,
              mentions: 156,
              context: 'M&A replacing IPO as primary path',
              direction: 'positive'
          },
          {
              topic: 'Climate Tech',
              change: '+113% w/w',
              momentum: 26,
              mentions: 89,
              context: 'industrial applications drive profitability',
              direction: 'positive'
          },
          {
              topic: 'Traditional SaaS',
              change: '-58% w/w',
              momentum: 18,
              mentions: 52,
              context: 'AI-native solutions obsoleting legacy playbooks',
              direction: 'negative'
          }
      ],
      consensusForming: [
          {
              title: 'Infrastructure > Applications clear winner',
              sources: '[8 tier-1 sources aligned: All-In, BG2Pod, Index, a16z]',
              insight: '4x revenue multiples prove picks-and-shovels thesis'
          },
          {
              title: 'Enterprise AI hits production inflection',
              sources: '[42 mentions across CTO panels and enterprise pods]',
              insight: 'Moving from pilots to real workflow automation at scale'
          },
          {
              title: 'Series A bar permanently higher',
              sources: '[15+ funds confirm: Benchmark, First Round, Emergence]',
              insight: '$3M ARR minimum, no return to 2021 standards'
          }
      ],
      contrarian: [
          {
              title: 'Traditional SaaS accelerating decline',
              description: '-58% while all AI categories surge',
              context: 'AI-native solutions making legacy obsolete'
          },
          {
              title: 'Europe deep tech arbitrage ignored',
              description: '44% of global deep tech funding',
              context: 'US VCs missing significant opportunity'
          }
      ],
      blindspots: [
          {
              title: 'Developer tools consolidation wave',
              description: 'GitHub Copilot dominance underdiscussed',
              context: 'M&A wave coming Q4 2025'
          },
          {
              title: 'Climate tech profitability turn',
              description: 'Industrial applications working quietly',
              context: 'First profitable exits changing narrative'
          }
      ],
      actionItems: {
          thisWeek: [
              'Position as AI infrastructure play for fundraising',
              'Prepare for $3M ARR Series A requirement',
              'Consider M&A as primary exit strategy'
          ],
          monitor: [
              'CalPERS $21B allocation impact on ecosystem',
              'Defense tech momentum for portfolio opportunities',
              'Developer tools M&A activity Q4'
          ]
      },
      portfolioImpact: {
          portfolio: [
              // Uncomment to test empty state:
              // 
              {
                  company: "OpenAI",
                  mentions: 12,
                  trend: "up",
                  sentiment: {
                      score: 4.5,
                      label: "Mixed"
                  },
                  insights: [
                      {
                          text: "GPT-5 release imminent - 'within weeks' say multiple sources",
                          tag: "Signal"
                      },
                      {
                          text: "Competition intensifying as rivals close capability gap",
                          tag: "Monitor"
                      },
                      {
                          text: "Board governance concerns resurfacing amid reports of new internal tensions",
                          tag: null
                      }
                  ]
              },
              {
                  company: "Anthropic",
                  mentions: 7,
                  trend: "up",
                  sentiment: {
                      score: 8.5,
                      label: "Positive"
                  },
                  insights: [
                      {
                          text: "Multiple VCs cite Anthropic as the gold standard for AI safety approach",
                          tag: "Signal"
                      },
                      {
                          text: "Growing consensus that Claude's enterprise adoption is accelerating faster than expected",
                          tag: null
                      },
                      {
                          text: "Series E rumors at $30B+ valuation gaining credibility",
                          tag: null
                      }
                  ]
              }
          ],
          watchlist: [
              // Uncomment to test empty state:
              // 
              {
                  company: "Perplexity",
                  mentions: 7,
                  trend: "up",
                  sentiment: {
                      score: 7.8,
                      label: "Building"
                  },
                  insights: [
                      {
                          text: "Search disruption thesis gaining momentum among consumer-focused VCs",
                          tag: "Signal"
                      },
                      {
                          text: "Multiple funds preparing term sheets for upcoming Series C",
                          tag: null
                      },
                      {
                          text: "Questions about sustainable differentiation vs. Google's AI search improvements",
                          tag: null
                      }
                  ]
              }
          ]
      }
  };

  // ============================================
  // PORTFOLIO DATA (PLACEHOLDER)
  // ============================================
  window.backupData.portfolio = {
      companies: [],
      watchlist: [],
      mentions: {
          new: 5,
          total: 31
      }
  };

// Make backup data available for components that need it
console.log('Backup data loaded for Episode Library and Notable Signals');
