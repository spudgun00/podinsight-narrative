// PRIORITY BRIEFINGS - NEW APPROACH
// ============================================
priorityBriefings: {
  items: [
      // CARD VERSION
      {
          id: 'briefing-1',
          cardView: {
              podcast: 'All-In',
              time: '3h ago',
              duration: '94 min',
              score: 97,
              priorityTag: 'Consensus Forming',
              hashtags: ['#Infrastructure', '#AIFunding', '#DefenseTech'],
              guests: 'Chamath Palihapitiya (Founder, Social Capital) + Jason Calacanis (Launch Fund)',
              title: "AI Infrastructure vs Apps: The $70B Capital Allocation Shift",
              whyCare: "Three major funds announced infrastructure pivots this week - when tier-1s align, the market follows",
              socialProof: "💬 Most shared quote this week",
              watchlistMentions: { 'Anthropic': 2, 'Perplexity': 1 }
          },
          expandedView: {
              conversationSummary: "Chamath opens with stark data - 70% of Q2 AI funding went to infrastructure versus 30% to applications, a complete reversal from 2023. Jason pushes back citing Jasper's decline, but Chamath counters that infrastructure enables entirely new categories. The debate heats up when Friedberg joins, revealing their portfolio's pivot after seeing application layer margins compress to 20% while infrastructure maintains 70%+. Sacks drops the bombshell that defense tech is now considered 'infrastructure' by most funds.",
              keyInsights: [
                  "• 70% of AI funding now flowing to infrastructure, complete reversal from 2023",
                  "• Application layer margins compressing to 20% while infrastructure holds 70%+",
                  "• Defense tech reclassified as 'infrastructure' - opening floodgates for VC investment"
              ],
              notableNumbers: {
                  "$70B": "Q2 2025 infrastructure funding",
                  "20%": "Current AI application gross margins",
                  "3": "Months since the infrastructure thesis went mainstream"
              },
              watchlistMentions: [
                  { company: "Anthropic", count: 2, quotes: [
                      { text: "Anthropic's infrastructure costs hit $2B annually", time: "23:45" },
                      { text: "Even Anthropic is building their own chips now", time: "41:12" }
                  ]},
                  { company: "Perplexity", count: 1, quotes: [
                      { text: "Perplexity burning $50M monthly on compute alone", time: "31:22" }
                  ]}
              ],
              essentialQuote: {
                  text: "Every successful AI company is becoming an infrastructure company. The ones that don't will be eaten by OpenAI or Google.",
                  author: "Chamath Palihapitiya",
                  time: "15:31"
              },
              relatedTopics: ['#GPUEconomics', '#DefenseTech', '#AIMonetization']
          }
      },
      {
          id: 'briefing-2',
          cardView: {
              podcast: '20VC',
              time: '8h ago',
              duration: '82 min',
              score: 92,
              priorityTag: 'New Data',
              hashtags: ['#SeriesA', '#FundingBar', '#RunwayPlanning'],
              guests: 'Bill Gurley (GP, Benchmark) + Harry Stebbings (20VC)',
              title: "The Series A Apocalypse: Why $5M ARR Is The New $1M",
              whyCare: "Benchmark officially raising Series A bar to $5M ARR for AI companies - other tier-1s following",
              socialProof: "🔥 Trending on VC Twitter",
              portfolioMentions: { 'Scale AI': 1 },
              watchlistMentions: { 'OpenAI': 2 }
          },
          expandedView: {
              conversationSummary: "Bill Gurley doesn't mince words - 'This is the most challenging Series A environment since 2008.' Harry probes on specific metrics, and Bill reveals Benchmark's new internal bar: $5M ARR for AI companies, $3M for everything else. The conversation turns when Bill shares that 40% of their 2023 seed portfolio won't hit these numbers. He advocates for 30-month runways, calling the standard 18-month advice 'criminally negligent.' When Harry asks about exceptions, Bill is firm: 'Infrastructure plays only - they have different unit economics.'",
              keyInsights: [
                  "• Series A bar: $5M ARR for AI applications, $3M for traditional SaaS",
                  "• 40% of 2023 vintage seeds won't qualify for Series A at current burn",
                  "• 30-month runway now table stakes - 18 months is 'criminally negligent'"
              ],
              notableNumbers: {
                  "$5M": "New Series A ARR bar for AI companies",
                  "40%": "2023 seeds that won't hit Series A metrics",
                  "30": "Months of runway now required"
              },
              portfolioMentions: [
                  { company: "Scale AI", count: 1, quotes: [
                      { text: "Scale raised at $250K ARR - that's impossible today", time: "45:33" }
                  ]}
              ],
              watchlistMentions: [
                  { company: "OpenAI", count: 2, quotes: [
                      { text: "OpenAI's dominance is crushing application layer economics", time: "12:45" },
                      { text: "Every AI startup competing with OpenAI's next feature", time: "52:10" }
                  ]}
              ],
              essentialQuote: {
                  text: "Founders building with 18-month runways are playing Russian roulette. The Series A that should take 12 months will take 24.",
                  author: "Bill Gurley",
                  time: "28:44"
              },
              relatedTopics: ['#BurnRate', '#SeedExtensions', '#DownRounds']
          }
      },
      {
          id: 'briefing-3',
          cardView: {
              podcast: 'The Information\'s 411',
              time: '14h ago',
              duration: '71 min',
              score: 89,
              priorityTag: 'LP Intel',
              hashtags: ['#LPAllocations', '#VentureReturns', '#DPI'],
              guests: 'Josh Wolfe (Co-founder, Lux Capital) + Jessica Lessin (The Information)',
              title: "The DPI Crisis: Why LPs Are Demanding Cash, Not Markups",
              whyCare: "Major endowments requiring 'DPI roadmaps' for re-ups - paper gains no longer sufficient",
              socialProof: "📊 Data-driven analysis",
              watchlistMentions: { 'Perplexity': 1 }
          },
          expandedView: {
              conversationSummary: "Josh Wolfe starts with a stark admission: 'The entire venture model is broken without exits.' Jessica presses on Lux's returns, and Josh reveals they've returned $2B in actual cash over 24 months through secondaries and one strategic exit. The conversation shifts when Josh explains how LPs are now demanding 'DPI roadmaps' - concrete plans for distributions within 5 years. He shares that MIT's endowment told him: 'Show us the path to cash or we're out.' The discussion gets tactical when Josh outlines their new strategy: taking 20% off the table at Series C for all investments.",
              keyInsights: [
                  "• LPs demanding concrete 'DPI roadmaps' - 5-year paths to distributions",
                  "• Secondaries becoming primary liquidity source - not a temporary fix",
                  "• Top funds now taking 20% off table at Series C as standard practice"
              ],
              notableNumbers: {
                  "$2B": "Lux Capital's cash distributions in 24 months",
                  "5": "Years LPs expect to see DPI",
                  "20%": "Standard secondary take at Series C"
              },
              watchlistMentions: [
                  { company: "Perplexity", count: 1, quotes: [
                      { text: "Perplexity's $3B secondary gave us our first real DPI", time: "34:21" }
                  ]}
              ],
              essentialQuote: {
                  text: "LPs don't eat IRR. They've been fed paper gains for five years while their portfolios are cash-negative. The patience is gone.",
                  author: "Josh Wolfe",
                  time: "19:55"
              },
              relatedTopics: ['#SecondaryMarkets', '#LPLiquidity', '#PortfolioConstruction']
          }
      },
      {
          id: 'briefing-4',
          cardView: {
              podcast: 'Acquired',
              time: '1d ago',
              duration: '142 min',
              score: 94,
              priorityTag: 'Contrarian View',
              hashtags: ['#CloudRepatriation', '#AIEconomics', '#Hyperscalers'],
              guests: 'David Rosenthal + Ben Gilbert + Guest: Dylan Field (CEO, Figma)',
              title: "The Great Cloud Reversal: Why Companies Are Fleeing AWS",
              whyCare: "Figma saved $50M annually by leaving AWS - triggering mass cloud repatriation movement",
              socialProof: "🎧 #1 Tech podcast this week",
              portfolioMentions: { 'Scale AI': 2 }
          },
          expandedView: {
              conversationSummary: "Dylan Field drops a bombshell in the first ten minutes: 'We cut our infrastructure costs by 70% by leaving AWS.' Ben and David are stunned, pushing for details. Dylan explains how Figma built their own bare-metal infrastructure, saving $50M annually. The conversation explodes when Dylan suggests every company over $100M revenue should consider repatriation. David challenges the complexity, but Dylan counters with hard data - 18-month payback on their $30M infrastructure investment. The discussion pivots to AI workloads, where Dylan predicts 'on-prem is the only way to make unit economics work at scale.'",
              keyInsights: [
                  "• Cloud repatriation saving companies 50-70% on infrastructure costs",
                  "• 18-month payback period for on-premise infrastructure investment",
                  "• AI workloads pushing even mid-size companies to reconsider cloud"
              ],
              notableNumbers: {
                  "$50M": "Figma's annual AWS savings",
                  "70%": "Infrastructure cost reduction",
                  "18": "Months to payback on-prem investment"
              },
              portfolioMentions: [
                  { company: "Scale AI", count: 2, quotes: [
                      { text: "Scale spends $100M+ on cloud - they're next to repatriate", time: "67:45" },
                      { text: "Scale's margins would double with on-prem infrastructure", time: "89:33" }
                  ]}
              ],
              essentialQuote: {
                  text: "The dirty secret of cloud computing is that it's a 70% margin business for Amazon. That margin is coming from somewhere - your pockets.",
                  author: "Dylan Field",
                  time: "24:18"
              },
              relatedTopics: ['#InfrastructureArbitrage', '#UnitEconomics', '#TechnicalDebt']
          }
      },
      {
          id: 'briefing-5',
          cardView: {
              podcast: 'Invest Like the Best',
              time: '1d ago',
              duration: '118 min',
              score: 91,
              priorityTag: 'New Data',
              hashtags: ['#AgentEconomics', '#B2BSaaS', '#Productivity'],
              guests: 'Patrick O\'Shaughnessy + Guest: Aaron Levie (CEO, Box)',
              title: "Agents Are Eating SaaS: The $400B Disruption Nobody Sees Coming",
              whyCare: "Box CEO predicts 50% of SaaS companies obsolete by 2027 due to AI agents",
              socialProof: "🚨 Breaking perspective",
              watchlistMentions: { 'Anthropic': 3, 'OpenAI': 2 }
          },
          expandedView: {
              conversationSummary: "Aaron Levie starts with a confession: 'I'm terrified and excited in equal measure.' Patrick asks why, and Aaron explains that AI agents will replace entire categories of SaaS. He shares Box's internal data - their AI features are cannibalizing 30% of traditional usage. The conversation intensifies when Aaron predicts 'vertical SaaS is dead' - agents will handle workflows end-to-end. Patrick challenges him on Box's survival, and Aaron reveals they're pivoting to become an 'agent orchestration platform.' The real bombshell: Aaron estimates $400B of current SaaS market cap will evaporate by 2027.",
              keyInsights: [
                  "• AI agents replacing entire SaaS categories - not just features",
                  "• 30% of Box's traditional usage already cannibalized by AI features",
                  "• $400B of SaaS market cap at risk of evaporation by 2027"
              ],
              notableNumbers: {
                  "$400B": "SaaS market cap at risk",
                  "50%": "SaaS companies facing obsolescence",
                  "30%": "Box usage cannibalized by AI"
              },
              watchlistMentions: [
                  { company: "Anthropic", count: 3, quotes: [
                      { text: "Claude can already do what five SaaS tools did", time: "23:11" },
                      { text: "Anthropic's agent framework makes Zapier look antiquated", time: "45:33" },
                      { text: "Every SaaS company is one Anthropic update from irrelevance", time: "71:28" }
                  ]},
                  { company: "OpenAI", count: 2, quotes: [
                      { text: "OpenAI's enterprise agents replacing entire departments", time: "34:55" },
                      { text: "GPT-5 will be the SaaS extinction event", time: "88:42" }
                  ]}
              ],
              essentialQuote: {
                  text: "We spent 20 years building software to help humans work better. AI agents don't need our help. They need infrastructure and data - everything else is obsolete.",
                  author: "Aaron Levie",
                  time: "56:33"
              },
              relatedTopics: ['#SaaSDisruption', '#AgentOrchestration', '#WorkflowAutomation']
          }
      },
      {
          id: 'briefing-6',
          cardView: {
              podcast: 'The Logan Bartlett Show',
              time: '2d ago',
              duration: '96 min',
              score: 86,
              priorityTag: 'Portfolio Impact',
              hashtags: ['#MAStrategy', '#ExitPlanning', '#StrategicBuyers'],
              guests: 'Logan Bartlett (Redpoint) + Guest: Emilie Choi (President, Coinbase)',
              title: "The M&A Playbook: Why Every Startup Needs Three Strategic Relationships",
              whyCare: "Coinbase President reveals they track 500+ startups for acquisition - most aren't even in crypto",
              socialProof: "💡 Actionable insights",
              portfolioMentions: { 'Scale AI': 1 },
              watchlistMentions: { 'Perplexity': 1 }
          },
          expandedView: {
              conversationSummary: "Emilie Choi starts with surprising transparency: 'We track 500+ companies for potential acquisition, and 60% aren't even crypto-native.' Logan digs into their M&A strategy, and Emilie reveals Coinbase has a dedicated team building relationships with Series A companies - three years before they'd consider buying. The conversation heats up when discussing valuations. Emilie admits they'll pay 2-3x the last private round for strategic assets. She shares their framework: every startup should maintain relationships with at least three potential acquirers from Series A onward. The kicker: 'The best acquisitions are never shopped - they're cultivated over years.'",
              keyInsights: [
                  "• Strategic buyers tracking companies 3+ years before acquisition",
                  "• 2-3x last round premiums for truly strategic assets",
                  "• 60% of Coinbase's M&A targets aren't crypto companies"
              ],
              notableNumbers: {
                  "500+": "Companies on Coinbase M&A tracker",
                  "3": "Years of relationship building before acquisition",
                  "2-3x": "Premium over last private round"
              },
              portfolioMentions: [
                  { company: "Scale AI", count: 1, quotes: [
                      { text: "Scale's data labeling could transform our compliance", time: "45:22" }
                  ]}
              ],
              watchlistMentions: [
                  { company: "Perplexity", count: 1, quotes: [
                      { text: "Perplexity's search could revolutionize crypto discovery", time: "67:18" }
                  ]}
              ],
              essentialQuote: {
                  text: "The biggest mistake founders make is waiting until they need an exit to build acquirer relationships. By then, you have zero leverage.",
                  author: "Emilie Choi",
                  time: "31:44"
              },
              relatedTopics: ['#ExitStrategy', '#CorpDev', '#StrategicPartnerships']
          }
      },
      {
          id: 'briefing-7',
          cardView: {
              podcast: 'Stratechery',
              time: '2d ago',
              duration: '103 min',
              score: 88,
              priorityTag: 'Consensus Forming',
              hashtags: ['#DeveloperTools', '#AIAdoption', '#Productivity'],
              guests: 'Ben Thompson + Guest: Nat Friedman (Former GitHub CEO)',
              title: "Every Developer Will Have an AI Pair Programmer by 2026",
              whyCare: "GitHub Copilot hit $500M ARR in 18 months - fastest enterprise software growth ever",
              socialProof: "📈 Must-listen for dev tools",
              watchlistMentions: { 'Anthropic': 2 }
          },
          expandedView: {
              conversationSummary: "Nat Friedman opens with a bold prediction: 'By 2026, coding without AI will be like coding without an IDE - technically possible but professionally negligent.' Ben pushes on adoption rates, and Nat shares exclusive data - 75% of Fortune 500 developers already use AI daily. The conversation pivots when discussing Cursor's $2.5B valuation. Nat sees it validating the market: 'There's room for 10 billion-dollar companies in AI dev tools.' He reveals the real opportunity isn't in coding assistance but in AI handling entire development workflows - from requirements to deployment.",
              keyInsights: [
                  "• 75% of Fortune 500 developers already using AI tools daily",
                  "• Developer productivity tools growing 200% YoY - fastest enterprise segment",
                  "• Next wave: AI handling entire development workflows, not just code completion"
              ],
              notableNumbers: {
                  "$500M": "GitHub Copilot ARR in 18 months",
                  "75%": "Fortune 500 developers using AI daily",
                  "10": "Billion-dollar opportunities in AI dev tools"
              },
              watchlistMentions: [
                  { company: "Anthropic", count: 2, quotes: [
                      { text: "Claude's coding ability surpassed senior developers", time: "28:33" },
                      { text: "Anthropic's artifacts changed how we think about AI coding", time: "54:27" }
                  ]}
              ],
              essentialQuote: {
                  text: "We're not automating programmers - we're giving every business analyst the power to code. The demand for software will explode 100x.",
                  author: "Nat Friedman",
                  time: "41:55"
              },
              relatedTopics: ['#CodingAssistants', '#DeveloperProductivity', '#SoftwareDemand']
          }
      },
      {
          id: 'briefing-8',
          cardView: {
              podcast: 'Khosla Ventures Podcast',
              time: '3d ago',
              duration: '91 min',
              score: 85,
              priorityTag: 'New Data',
              hashtags: ['#EnergyTech', '#DataCenters', '#Sustainability'],
              guests: 'Vinod Khosla + Guest: Sam Altman (CEO, OpenAI)',
              title: "The Energy Crisis Nobody's Talking About: AI's 500 TWh Problem",
              whyCare: "OpenAI CEO admits energy is the real AI bottleneck - not compute or data",
              socialProof: "⚡ Crucial infrastructure insight",
              watchlistMentions: { 'OpenAI': 4 }
          },
          expandedView: {
              conversationSummary: "Vinod doesn't waste time: 'Forget chips - tell me about power.' Sam Altman's response is sobering: 'Energy is the real constraint to AGI, not compute.' He reveals OpenAI's models already consume as much power as small cities, and GPT-5 training will require dedicated power plants. The conversation turns to solutions when Sam discusses OpenAI's investments in fusion and advanced geothermal. Vinod pushes on timeline, and Sam admits: 'We need 500 TWh of new clean energy by 2030 or AI progress stops.' They agree the biggest opportunity isn't in AI models but in energy infrastructure for AI.",
              keyInsights: [
                  "• AI will consume 500 TWh by 2030 - equivalent to Japan's total usage",
                  "• Energy, not compute, is the real bottleneck to AI progress",
                  "• OpenAI investing directly in fusion and geothermal projects"
              ],
              notableNumbers: {
                  "500 TWh": "AI energy needs by 2030",
                  "10x": "Current data center capacity needed",
                  "$1T": "Energy infrastructure investment required"
              },
              watchlistMentions: [
                  { company: "OpenAI", count: 4, quotes: [
                      { text: "Our energy costs exceed our compute costs already", time: "12:33" },
                      { text: "GPT-5 training requires dedicated power infrastructure", time: "34:21" },
                      { text: "We're funding three fusion startups directly", time: "56:44" },
                      { text: "Without new energy sources, AI progress hits a wall", time: "78:55" }
                  ]}
              ],
              essentialQuote: {
                  text: "Everyone's worried about AI safety and jobs. They should be worried about having enough power to plug it in. Energy is the real AGI bottleneck.",
                  author: "Sam Altman",
                  time: "23:17"
              },
              relatedTopics: ['#EnergyInfrastructure', '#Sustainability', '#DataCenterScaling']
          }
      },
      {
          id: 'briefing-9',
          cardView: {
              podcast: 'Indie Hackers',
              time: '3d ago',
              duration: '124 min',
              score: 82,
              priorityTag: 'Contrarian View',
              hashtags: ['#MicroSaaS', '#Bootstrapping', '#IndieSuccess'],
              guests: 'Courtland Allen + Guest: Pieter Levels (Nomad List, PhotoAI)',
              title: "Why Indie Hackers Are Beating VC-Backed Startups at AI",
              whyCare: "Solo founder hitting $5M ARR with AI products - while VC-backed competitors burn millions",
              socialProof: "🔨 Scrappy success story",
              watchlistMentions: { 'OpenAI': 3, 'Anthropic': 1 }
          },
          expandedView: {
              conversationSummary: "Pieter Levels starts with characteristic bluntness: 'VCs are pouring millions into AI wrappers that I build in a weekend.' Courtland asks for specifics, and Pieter reveals PhotoAI hit $5M ARR with zero employees and $500 in monthly costs. The conversation gets spicy when discussing VC-backed competitors. Pieter shows how ventures burning $2M monthly are building the same features he ships solo. His thesis: AI democratizes building so much that funding becomes a disadvantage - it forces premature scaling. The discussion culminates with Pieter predicting 90% of AI startups will be profitable one-person companies.",
              keyInsights: [
                  "• Solo founders reaching $5M ARR with AI products at 90%+ margins",
                  "• AI tools democratizing development - funding becoming a disadvantage",
                  "• Prediction: 90% of successful AI startups will be bootstrapped"
              ],
              notableNumbers: {
                  "$5M": "PhotoAI ARR with zero employees",
                  "$500": "Monthly operating costs",
                  "90%": "Net margins on AI products"
              },
              watchlistMentions: [
                  { company: "OpenAI", count: 3, quotes: [
                      { text: "GPT-4 costs me $300/month and replaces a dev team", time: "19:44" },
                      { text: "OpenAI's API is the entire backend for three of my apps", time: "41:33" },
                      { text: "When OpenAI raises prices, I just pass it to customers", time: "67:22" }
                  ]},
                  { company: "Anthropic", count: 1, quotes: [
                      { text: "Claude handles all my customer support - better than humans", time: "55:18" }
                  ]}
              ],
              essentialQuote: {
                  text: "VC funding in AI is like bringing a Formula 1 car to a go-kart race. You'll go fast but crash on the first turn. AI rewards staying small and nimble.",
                  author: "Pieter Levels",
                  time: "38:27"
              },
              relatedTopics: ['#BootstrappedAI', '#SoloFounders', '#MicroSaaS']
          }
      }
  ]
}