// Synthea.ai Unified Data Source - Single Source of Truth
// Version: 2.0.0
// Last Updated: 2025-07-25
// Purpose: Consolidates all data from demo-data.js, master-data.js, and weekly-brief.html

window.unifiedData = {
  // ============================================
  // METADATA
  // ============================================
  meta: {
      version: '2.0.0',
      lastUpdated: '2025-07-25',
      dataWeek: {
          number: 30,
          year: 2025,
          range: 'July 19-25, 2025'
      },
      analysis: {
          episodesAnalyzed: 1547,
          podcastsTracked: 52,
          hoursAnalyzed: 1426,
          lastAnalysis: '38 mins ago'
      }
  },

  // ============================================
  // UI CONFIGURATION
  // ============================================
  ui: {
      header: {
          ticker: [
              { label: 'Enterprise Agents', value: '↑52%' },
              { label: 'Defense Tech', value: '↑41%' },
              { label: 'AI Infrastructure', value: '↑38%' },
              { label: 'Exit Drought', value: '27 IPOs H1' },
              { label: 'Series A Bar', value: '$3M ARR' },
              { label: 'Patterns Tracked', value: '67' },
              { label: 'LP Activity', value: '↑26% allocating' }
          ],
          search: {
              suggestions: [
                  "What's the consensus on AI infrastructure vs applications?",
                  "Series A revenue requirements July 2025",
                  "Defense tech momentum and key players",
                  "Enterprise agent adoption rates",
                  "Exit environment - M&A vs IPO trends",
                  "CalPERS venture allocation impact",
                  "Vertical AI valuations and opportunities"
              ],
              trendingTopics: [
                  { name: 'Enterprise Agents', trend: '↑52% w/w' },
                  { name: 'Defense Tech', trend: '↑41% w/w' },
                  { name: 'AI Infrastructure', trend: '↑38% w/w' },
                  { name: 'Exit Strategies', trend: '↑29% w/w' },
                  { name: 'Vertical AI', trend: '↑31% w/w' }
              ],
              quickFilters: [
                  'Infrastructure Focus',
                  'Contrarian Views',
                  'LP Sentiment',
                  'Deal Analysis',
                  'Market Shifts',
                  'Portfolio Mentions',
                  'Emerging Themes'
              ]
          }
      },
      podcastFilters: [
          'Curated for You',
          'All Episodes',
          '20VC with Harry Stebbings',
          'All-In Podcast',
          'BG2Pod',
          'Invest Like the Best',
          'Acquired',
          'The Tim Ferriss Show',
          'This Week in Startups',
          'The Knowledge Project',
          'Stratechery',
          'Changelog',
          'Enterprise Software Weekly',
          'Capital Allocators',
          'CloudNative Podcast',
          'SaaStr Podcast'
      ]
  },

  // ============================================
  // NARRATIVE PULSE - TOPIC DATA
  // ============================================
  narrativePulse: {
      config: {
          consensusLevels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          consensusLabels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Peak'],
          timeRanges: {
              '7 days': {
                  dateLabels: ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'],
                  dataPoints: 7,
                  interval: 'daily'
              },
              '30 days': {
                  dateLabels: ['Jun 26-Jul 2', 'Jul 3-9', 'Jul 10-16', 'Jul 17-23'],
                  dataPoints: 4,
                  interval: 'weekly'
              },
              '90 days': {
                  dateLabels: ['Apr 27', 'May 4', 'May 11', 'May 18', 'May 25', 'Jun 1', 'Jun 8', 'Jun 15', 'Jun 22', 'Jun 29', 'Jul 6', 'Jul 13', 'Jul 20'],
                  dataPoints: 13,
                  interval: 'weekly'
              }
          }
      },
      topics: {
          'AI Infrastructure': {
              color: '#4a7c59',
              momentum: '+38%',
              weeklyChange: '+38%',
              mentions: 287,
              episodes: 46,
              consensusLevel: 'Strong (>85% agreement)',
              description: '70% of AI funding to infrastructure plays',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [42, 38, 45, 51, 67, 72, 69],
                          dailyAverage: 54.9,
                          peakDay: 'Jul 24'
                      },
                      volume: {
                          dataPoints: [42, 38, 45, 51, 67, 72, 69],
                          total: 384
                      },
                      consensus: {
                          levels: [0.65, 0.68, 0.72, 0.78, 0.82, 0.85, 0.84],
                          label: 'Strong'
                      },
                      quotes: {
                          'Jul 19': 'Infrastructure thesis gaining momentum in early week discussions',
                          'Jul 20': 'Scale AI valuation sparks infrastructure vs apps debate',
                          'Jul 21': 'Weekend deep dives on picks-and-shovels plays',
                          'Jul 22': 'All-In emergency pod on infrastructure dominance',
                          'Jul 23': 'BG2Pod validates 4x multiple differential',
                          'Jul 24': 'Peak mentions as consensus forms across tier-1 VCs',
                          'Jul 25': 'Infrastructure capturing 70% of AI dollars confirmed'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [165, 198, 245, 287],
                          weeklyGrowth: '+74%'
                      },
                      volume: {
                          dataPoints: [165, 198, 245, 287],
                          total: 895
                      },
                      consensus: {
                          levels: [0.5, 0.65, 0.75, 0.85],
                          progression: 'Moderate → Strong'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'Early signals of infrastructure preference emerging',
                          'Jul 3-9': 'Mid-tier VCs beginning to echo tier-1 infrastructure thesis',
                          'Jul 10-16': 'Scale AI deal catalyzes broad consensus formation',
                          'Jul 17-23': 'Peak momentum as 70% funding allocation confirmed'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [45, 48, 52, 58, 67, 78, 95, 112, 134, 165, 198, 245, 287],
                          quarterlyGrowth: '+538%'
                      },
                      volume: {
                          dataPoints: [45, 48, 52, 58, 67, 78, 95, 112, 134, 165, 198, 245, 287],
                          total: 1584
                      },
                      consensus: {
                          progression: ['Weak', 'Weak', 'Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong']
                      },
                      narrative: 'From niche discussion at 45 mentions in late April to mainstream consensus at 287 by late July',
                      keyInflectionPoint: 'Week 11 (Jul 6): Crossed 200 mentions as tier-1 VCs aligned'
                  }
              }
          },
          'Enterprise Agents': {
              color: '#f4a261',
              momentum: '+52%',
              weeklyChange: '+52%',
              mentions: 234,
              episodes: 31,
              consensusLevel: 'Strong (>80% agreement)',
              description: '70% of Fortune 500s in production with AI agents',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [28, 31, 34, 45, 52, 61, 58],
                          dailyAverage: 44.1,
                          peakDay: 'Jul 24'
                      },
                      volume: {
                          dataPoints: [28, 31, 34, 45, 52, 61, 58],
                          total: 309
                      },
                      consensus: {
                          levels: [0.58, 0.62, 0.65, 0.72, 0.78, 0.81, 0.80],
                          label: 'Strong'
                      },
                      quotes: {
                          'Jul 19': 'Early signals of enterprise production deployments',
                          'Jul 20': 'Decagon valuation validates enterprise agent thesis',
                          'Jul 21': 'Weekend coverage of Fortune 500 adoption rates',
                          'Jul 22': 'CTO panels confirm 70% now in production',
                          'Jul 23': 'AWS announces 3x growth in agent infrastructure',
                          'Jul 24': 'Enterprise AI Summit drives peak discussion',
                          'Jul 25': '$2B invested in agent startups H1 2025 confirmed'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [98, 142, 187, 234],
                          weeklyGrowth: '+139%'
                      },
                      volume: {
                          dataPoints: [98, 142, 187, 234],
                          total: 661
                      },
                      consensus: {
                          levels: [0.4, 0.55, 0.7, 0.8],
                          progression: 'Mixed → Strong'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'Pilot programs showing promising early results',
                          'Jul 3-9': 'Fortune 500 moving from pilots to production',
                          'Jul 10-16': 'AWS and Azure reporting explosive growth',
                          'Jul 17-23': 'Enterprise AI inflection point reached'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [22, 25, 28, 34, 42, 51, 65, 78, 89, 98, 142, 187, 234],
                          quarterlyGrowth: '+964%'
                      },
                      volume: {
                          dataPoints: [22, 25, 28, 34, 42, 51, 65, 78, 89, 98, 142, 187, 234],
                          total: 1095
                      },
                      consensus: {
                          progression: ['Weak', 'Weak', 'Weak', 'Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong']
                      },
                      narrative: 'Steady climb from experimental (22 mentions) to essential (234 mentions)',
                      keyInflectionPoint: 'Week 10 (Jun 29): Production deployments hit critical mass'
                  }
              }
          },
          'Defense Tech': {
              color: '#5a6c8c',
              momentum: '+41%',
              weeklyChange: '+41%',
              mentions: 178,
              episodes: 24,
              consensusLevel: 'Mixed (55% agreement)',
              description: '3 of top 10 Q2 deals, Anduril at $14B',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [18, 21, 19, 28, 35, 42, 38],
                          dailyAverage: 28.7,
                          peakDay: 'Jul 24'
                      },
                      volume: {
                          dataPoints: [18, 21, 19, 28, 35, 42, 38],
                          total: 201
                      },
                      consensus: {
                          levels: [0.48, 0.51, 0.50, 0.58, 0.65, 0.68, 0.67],
                          label: 'Mixed'
                      },
                      quotes: {
                          'Jul 19': 'Anduril valuation sets defense tech tone',
                          'Jul 20': 'Geopolitical tensions driving investor interest',
                          'Jul 21': 'Weekend analysis of dual-use opportunities',
                          'Jul 22': 'Palmer Luckey on Tim Ferriss sparks discussion',
                          'Jul 23': '3 of top 10 Q2 deals in defense highlighted',
                          'Jul 24': 'National security pods drive peak coverage',
                          'Jul 25': 'Bipartisan support creating 10-year visibility'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [72, 95, 134, 178],
                          weeklyGrowth: '+147%'
                      },
                      volume: {
                          dataPoints: [72, 95, 134, 178],
                          total: 479
                      },
                      consensus: {
                          levels: [0.3, 0.4, 0.5, 0.55],
                          progression: 'Low → Mixed'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'Anduril rumors spark initial interest',
                          'Jul 3-9': 'Geopolitical events drive urgency',
                          'Jul 10-16': 'Major funding announcements validate thesis',
                          'Jul 17-23': 'Mainstream acceptance despite ESG concerns'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [15, 17, 19, 22, 28, 35, 42, 51, 58, 72, 95, 134, 178],
                          quarterlyGrowth: '+1087%'
                      },
                      volume: {
                          dataPoints: [15, 17, 19, 22, 28, 35, 42, 51, 58, 72, 95, 134, 178],
                          total: 766
                      },
                      consensus: {
                          progression: ['Very Low', 'Very Low', 'Low', 'Low', 'Low', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed']
                      },
                      narrative: 'From fringe topic to mainstream with geopolitical catalysts',
                      keyInflectionPoint: 'Week 12 (Jul 13): Anduril deal legitimized entire sector'
                  }
              }
          },
          'Exit Strategies': {
              color: '#c77d7d',
              momentum: '+29%',
              weeklyChange: '+29%',
              mentions: 156,
              episodes: 28,
              consensusLevel: 'Building (65% agreement)',
              description: 'Only 27 IPOs in H1, M&A becomes primary path',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [22, 19, 24, 31, 28, 35, 33],
                          dailyAverage: 27.4,
                          peakDay: 'Jul 24'
                      },
                      volume: {
                          dataPoints: [22, 19, 24, 31, 28, 35, 33],
                          total: 192
                      },
                      consensus: {
                          levels: [0.45, 0.43, 0.48, 0.55, 0.58, 0.62, 0.60],
                          label: 'Building'
                      },
                      quotes: {
                          'Jul 19': 'Exit drought concerns continue from H1 data',
                          'Jul 20': 'Only 27 IPOs in H1 2025 sparks discussion',
                          'Jul 21': 'Weekend deep dives on M&A as new normal',
                          'Jul 22': 'Google $32B Wiz acquisition changes narrative',
                          'Jul 23': 'Strategic buyers offering 40% premiums noted',
                          'Jul 24': 'Acquired podcast special on exit environment',
                          'Jul 25': 'VCs adjusting underwriting to M&A multiples'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [89, 102, 121, 156],
                          weeklyGrowth: '+75%'
                      },
                      volume: {
                          dataPoints: [89, 102, 121, 156],
                          total: 468
                      },
                      consensus: {
                          levels: [0.4, 0.45, 0.55, 0.65],
                          progression: 'Mixed → Building'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'H1 IPO data reveals severity of drought',
                          'Jul 3-9': 'Strategic acquirers stepping up activity',
                          'Jul 10-16': 'M&A premiums attracting founder attention',
                          'Jul 17-23': 'New exit playbook emerging for 2025'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [38, 41, 45, 52, 58, 65, 72, 78, 82, 89, 102, 121, 156],
                          quarterlyGrowth: '+311%'
                      },
                      volume: {
                          dataPoints: [38, 41, 45, 52, 58, 65, 72, 78, 82, 89, 102, 121, 156],
                          total: 949
                      },
                      consensus: {
                          progression: ['Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Building', 'Building', 'Building', 'Building', 'Building', 'Building', 'Building', 'Building']
                      },
                      narrative: 'Growing concern about exit environment throughout quarter',
                      keyInflectionPoint: 'Week 9 (Jun 22): H1 data confirmed severity of IPO drought'
                  }
              }
          },
          'Vertical AI': {
              color: '#8a68a8',
              momentum: '+31%',
              weeklyChange: '+31%',
              mentions: 167,
              episodes: 29,
              consensusLevel: 'Building (70% agreement)',
              description: 'Harvey ($5B), Abridge ($5.3B) prove vertical thesis',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [15, 18, 22, 28, 31, 29, 24],
                          dailyAverage: 23.9,
                          peakDay: 'Jul 23'
                      },
                      volume: {
                          dataPoints: [15, 18, 22, 28, 31, 29, 24],
                          total: 167
                      },
                      consensus: {
                          levels: [0.6, 0.62, 0.65, 0.68, 0.72, 0.71, 0.7],
                          label: 'Building'
                      },
                      quotes: {
                          'Jul 19': 'Early vertical AI discussions gain traction',
                          'Jul 20': 'Harvey valuation sparks vertical vs horizontal debate',
                          'Jul 21': 'Weekend analysis of domain-specific moats',
                          'Jul 22': 'Multiple funds announce vertical focus',
                          'Jul 23': 'Abridge deal validates healthcare vertical',
                          'Jul 24': 'Every vertical racing for its champion',
                          'Jul 25': 'Vertical-specific funds launching rumors'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [78, 98, 125, 167],
                          weeklyGrowth: '+114%'
                      },
                      volume: {
                          dataPoints: [78, 98, 125, 167],
                          total: 468
                      },
                      consensus: {
                          levels: [0.45, 0.55, 0.65, 0.7],
                          progression: 'Mixed → Building'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'Initial vertical AI success stories emerge',
                          'Jul 3-9': 'Domain expertise + AI thesis gains steam',
                          'Jul 10-16': 'Major valuations prove vertical premium',
                          'Jul 17-23': 'Every major vertical seeking its champion'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [25, 28, 32, 38, 45, 52, 61, 68, 72, 78, 98, 125, 167],
                          quarterlyGrowth: '+568%'
                      },
                      volume: {
                          dataPoints: [25, 28, 32, 38, 45, 52, 61, 68, 72, 78, 98, 125, 167],
                          total: 889
                      },
                      consensus: {
                          progression: ['Low', 'Low', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Building', 'Building', 'Building', 'Building', 'Building', 'Building', 'Building']
                      },
                      narrative: 'From hypothesis to validation with $5B+ exits',
                      keyInflectionPoint: 'Week 11 (Jul 6): Harvey and Abridge deals prove thesis'
                  }
              }
          },
          'Traditional SaaS': {
              color: '#b8c0d0',
              momentum: '-18%',
              weeklyChange: '-18%',
              mentions: 52,
              episodes: 14,
              consensusLevel: 'Weak (<25% agreement)',
              description: 'Legacy playbooks obsolete as AI natives dominate',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [12, 10, 8, 6, 5, 6, 5],
                          dailyAverage: 7.4,
                          peakDay: 'Jul 19'
                      },
                      volume: {
                          dataPoints: [12, 10, 8, 6, 5, 6, 5],
                          total: 52
                      },
                      consensus: {
                          levels: [0.25, 0.22, 0.20, 0.18, 0.15, 0.18, 0.15],
                          label: 'Weak'
                      },
                      quotes: {
                          'Jul 19': 'Traditional SaaS metrics questioned',
                          'Jul 20': 'AI-native startups disrupting incumbents',
                          'Jul 21': 'Weekend: Is SaaS dead? debates',
                          'Jul 22': 'Major fund announces no more SaaS investments',
                          'Jul 23': 'PLG playbook declared obsolete',
                          'Jul 24': 'Sales-led motion returns for enterprise',
                          'Jul 25': 'SaaS consolidation wave predicted'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [85, 72, 61, 52],
                          weeklyGrowth: '-39%'
                      },
                      volume: {
                          dataPoints: [85, 72, 61, 52],
                          total: 270
                      },
                      consensus: {
                          levels: [0.35, 0.30, 0.25, 0.20],
                          progression: 'Low → Weak'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'SaaS multiples compression continues',
                          'Jul 3-9': 'AI-native alternatives gaining share',
                          'Jul 10-16': 'Major funds pivot away from SaaS',
                          'Jul 17-23': 'Legacy playbooks declared obsolete'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [120, 115, 108, 102, 95, 92, 88, 85, 82, 85, 72, 61, 52],
                          quarterlyGrowth: '-57%'
                      },
                      volume: {
                          dataPoints: [120, 115, 108, 102, 95, 92, 88, 85, 82, 85, 72, 61, 52],
                          total: 1157
                      },
                      consensus: {
                          progression: ['Mixed', 'Mixed', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Weak', 'Weak']
                      },
                      narrative: 'Steady decline as AI-native solutions take share',
                      keyInflectionPoint: 'Week 7 (Jun 8): First major fund exits SaaS entirely'
                  }
              }
          },
          'Climate Tech': {
              color: '#68a87c',
              momentum: '+26%',
              weeklyChange: '+15%',
              mentions: 89,
              episodes: 18,
              consensusLevel: 'Building (60% agreement)',
              description: 'Industrial applications driving profitability',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [8, 10, 12, 14, 13, 15, 17],
                          dailyAverage: 12.7,
                          peakDay: 'Jul 25'
                      },
                      volume: {
                          dataPoints: [8, 10, 12, 14, 13, 15, 17],
                          total: 89
                      },
                      consensus: {
                          levels: [0.5, 0.52, 0.55, 0.58, 0.57, 0.6, 0.62],
                          label: 'Building'
                      },
                      quotes: {
                          'Jul 19': 'Climate tech profitability stories emerge',
                          'Jul 20': 'Industrial heat applications gain attention',
                          'Jul 21': 'Weekend: Climate + AI intersection explored',
                          'Jul 22': 'Major industrial partnership announced',
                          'Jul 23': 'First climate unicorn reaches profitability',
                          'Jul 24': 'Khosla announces new climate fund',
                          'Jul 25': 'Defense applications for climate tech'
                      }
                  },
                  '30d': {
                      momentum: {
                          dataPoints: [45, 52, 68, 89],
                          weeklyGrowth: '+98%'
                      },
                      volume: {
                          dataPoints: [45, 52, 68, 89],
                          total: 254
                      },
                      consensus: {
                          levels: [0.4, 0.45, 0.52, 0.6],
                          progression: 'Mixed → Building'
                      },
                      weeklyNarrative: {
                          'Jun 26-Jul 2': 'Quiet accumulation by specialist funds',
                          'Jul 3-9': 'Industrial applications show promise',
                          'Jul 10-16': 'Profitability without subsidies proven',
                          'Jul 17-23': 'Mainstream funds take notice'
                      }
                  },
                  '90d': {
                      momentum: {
                          dataPoints: [35, 38, 41, 42, 44, 45, 46, 45, 44, 45, 52, 68, 89],
                          quarterlyGrowth: '+154%'
                      },
                      volume: {
                          dataPoints: [35, 38, 41, 42, 44, 45, 46, 45, 44, 45, 52, 68, 89],
                          total: 634
                      },
                      consensus: {
                          progression: ['Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Building', 'Building', 'Building']
                      },
                      narrative: 'Steady build from hype to substance',
                      keyInflectionPoint: 'Week 11 (Jul 6): First profitable exits change narrative'
                  }
              }
          }
      }
  },

  // ============================================
  // NARRATIVE FEED
  // ============================================
  narrativeFeed: {
      items: [
          {
              id: 'feed-1',
              time: '2h ago',
              event: 'Infrastructure commanding 4x application layer multiples - consensus forming across 8 sources',
              category: 'consensus',
              expansion: {
                  sources: [
                      {
                          name: 'All-In Podcast - AI Infrastructure Deep Dive',
                          time: '2h ago',
                          quote: 'Scale AI at $14.3B proves the thesis. Every LP wants infrastructure exposure - application layer is getting commoditized at light speed.'
                      },
                      {
                          name: 'BG2Pod with Brad Gerstner',
                          time: '7h ago',
                          quote: 'We\'re seeing 70% of AI dollars flow to infrastructure. The picks-and-shovels play is the only defensible position.'
                      },
                      {
                          name: 'Invest Like the Best',
                          time: '1d ago',
                          quote: 'Foundation model companies need $100M+ just to compete. Infrastructure is where sustainable moats exist.'
                      }
                  ],
                  dissent: {
                      name: 'Contrarian Corner Podcast',
                      time: '3d ago',
                      quote: 'When everyone rushes to infrastructure, the real opportunity might be in overlooked vertical applications.'
                  }
              }
          },
          {
              id: 'feed-2',
              time: '5h ago',
              event: 'Series A bar hits $3M ARR - 40% of 2023 seeds still haven\'t raised',
              category: 'divergence',
              expansion: {
                  contrarian: {
                      name: 'First Round Review Special',
                      time: '5h ago',
                      quote: 'The Series A crunch is real. We won\'t even take meetings below $2.5M ARR unless it\'s AI infrastructure. Extension rounds are the new normal.'
                  },
                  mainstream: [
                      {
                          name: 'Emergence Capital Thesis Update',
                          time: 'This week',
                          quote: 'Quality bar keeps rising. Companies need 18-24 months runway because the next round will be harder.'
                      },
                      {
                          name: 'SaaStr Annual Preview',
                          time: '2d ago',
                          quote: '75% higher revenue requirements than 2021. This is healthy market correction, not a crisis.'
                      }
                  ]
              }
          },
          {
              id: 'feed-3',
              time: '8h ago',
              event: 'Enterprise AI agents moving from pilots to production - mentioned 42 times this week',
              category: 'trend',
              expansion: {
                  pattern: [
                      {
                          name: 'Enterprise Software Weekly',
                          time: '8h ago',
                          quote: '70% of Fortune 500s now in production with AI agents. Decagon\'s $1.5B valuation validates enterprise appetite.'
                      },
                      {
                          name: 'CloudNative Podcast',
                          time: '1d ago',
                          quote: 'AWS reporting 3x growth in agent infrastructure consumption. This isn\'t experimentation anymore.'
                      },
                      {
                          name: 'CTO Confidential',
                          time: '2d ago',
                          quote: 'Every software budget now has AI allocation. 30% of traditional SaaS spend shifting to AI tools.'
                      }
                  ],
                  momentum: '42 mentions this week vs. 11 mentions last week (+281%)'
              }
          },
          {
              id: 'feed-4',
              time: '1d ago',
              event: 'CalPERS announces 10% venture allocation - largest pension shift in decade',
              category: 'lp-intel',
              expansion: {
                  indicators: [
                      {
                          name: 'Capital Allocators Podcast',
                          time: '1d ago',
                          quote: 'CalPERS moving $21B into venture over 3 years. They want specialist funds with clear DPI paths.'
                      },
                      {
                          name: 'LP Roundtable Coverage',
                          time: '2d ago',
                          quote: 'Distribution drought forcing creativity. GP-led secondaries now 46% of all secondary transactions.'
                      }
                  ],
                  impact: 'Specialist funds seeing 2x easier fundraising. Generalists struggling to close.'
              }
          },
          {
              id: 'feed-5',
              time: '1d ago',
              event: 'Vertical AI valuations surge - Harvey and Abridge both exceed $5B',
              category: 'pattern',
              expansion: {
                  validation: [
                      {
                          name: 'Vertical SaaS Summit',
                          time: '1d ago',
                          quote: 'Every major vertical will have its $10B+ AI winner. Healthcare and legal are just the beginning.'
                      },
                      {
                          name: 'Index Ventures Thesis',
                          time: '2d ago',
                          quote: 'Domain expertise plus AI equals defensible moats. Horizontal plays are dead on arrival.'
                      },
                      {
                          name: 'NEA Partner Meeting Leak',
                          time: '3d ago',
                          quote: 'We\'re only backing teams that own the entire workflow in their vertical. No more point solutions.'
                      }
                  ],
                  implications: 'Watch for vertical-specific funds launching Q4. Healthcare AI fund rumors from Bessemer, Greylock.'
              }
          },
          {
              id: 'feed-6',
              time: '2d ago',
              event: 'M&A replacing IPO as primary exit - Google\'s $32B Wiz deal sets tone',
              category: 'pattern',
              expansion: {
                  validation: [
                      {
                          name: 'Acquired Podcast Special',
                          time: '2d ago',
                          quote: 'Only 27 IPOs in H1 2025 - lowest in a decade. Strategic acquirers are the new exit path.'
                      },
                      {
                          name: 'Banker Roundtable',
                          time: '3d ago',
                          quote: 'Tech giants sitting on $500B+ cash. M&A premiums averaging 40% above last private round.'
                      },
                      {
                          name: 'Stratechery Analysis',
                          time: '4d ago',
                          quote: 'IPO window might not truly open until 2026. Founders need to adjust expectations now.'
                      }
                  ],
                  implications: 'VCs increasingly underwriting to strategic exit multiples, not public market comps.'
              }
          }
      ]
  },

  // ============================================
  // NOTABLE SIGNALS
  // ============================================
  notableSignals: {
      counts: {
          marketNarratives: {
              count: 67,
              trending: '↑ 24 from last week',
              label: 'Narrative Shifts'
          },
          thesisValidation: {
              count: 23,
              trending: '↑ 8 reaching consensus',
              label: 'Validated Themes'
          },
          notableDeals: {
              count: 14,
              trending: '6 at $1B+ valuation',
              label: 'Mega Rounds'
          },
          portfolioMentions: {
              count: 31,
              trending: '↑ 5 acquisition signals',
              label: 'Portfolio Activity'
          },
          lpSentiment: {
              count: 12,
              trending: '↓ DPI concerns persist',
              label: 'LP Movements'
          }
      },
      panelData: {
          'market-narratives': [
              {
                  trend: 'Infrastructure capturing 70% of AI dollars',
                  count: 34,
                  source: 'All-In, BG2Pod, multiple LP discussions',
                  insight: 'Application layer commoditizing rapidly. Infrastructure plays seeing 4x revenue multiples.'
              },
              {
                  trend: 'M&A becoming primary exit path',
                  count: 28,
                  source: 'Acquired special, banker panels, Stratechery',
                  insight: 'Only 27 IPOs in H1. Strategic buyers offering 40% premiums to fill innovation gaps.'
              },
              {
                  trend: 'Enterprise agents hit inflection point',
                  count: 26,
                  source: 'CTO interviews, CloudNative, SaaStr',
                  insight: '70% of Fortune 500s in production. $2B invested in agent startups H1 2025.'
              },
              {
                  trend: 'Series A bar keeps rising',
                  count: 19,
                  source: 'First Round, Emergence, seed fund discussions',
                  insight: '$3M ARR new minimum. 40% of 2023 seeds still haven\'t raised.'
              },
              {
                  trend: 'Defense tech mainstream adoption',
                  count: 17,
                  source: 'National security focused pods',
                  insight: '3 of top 10 Q2 deals. Geopolitics driving LP interest despite ESG concerns.'
              },
              {
                  trend: 'Vertical AI commanding premiums',
                  count: 15,
                  source: 'Vertical SaaS Summit, thesis pieces',
                  insight: 'Harvey ($5B), Abridge ($5.3B) prove vertical-specific AI sustainable.'
              }
          ],
          'thesis-validation': [
              {
                  thesis: 'Infrastructure layer owns AI value creation',
                  status: 'VALIDATED',
                  sources: 'Scale AI $14.3B, 70% of funding data confirms',
                  insight: 'Picks-and-shovels beating gold miners by 4x. Apps becoming features.'
              },
              {
                  thesis: 'Enterprise ready for autonomous agents',
                  status: 'VALIDATED',
                  sources: '42 mentions this week, Decagon at $1.5B',
                  insight: 'Moving from pilots to production at scale. Real workflows being automated.'
              },
              {
                  thesis: 'Vertical AI beats horizontal',
                  status: 'GAINING VALIDATION',
                  sources: 'Multiple $5B+ vertical winners emerging',
                  insight: 'Domain expertise + AI = defensible moat. Every vertical needs its champion.'
              },
              {
                  thesis: 'Quality bar permanently higher',
                  status: 'VALIDATED',
                  sources: '$3M ARR Series A standard across 15+ funds',
                  insight: 'No return to 2021 standards. Efficient growth now table stakes.'
              }
          ],
          'notable-deals': [
              {
                  company: 'Thinking Machines Lab',
                  details: '$2B seed at $10B valuation (Mira Murati)',
                  insight: 'Largest seed ever. Top AI talent commands any price.'
              },
              {
                  company: 'Scale AI',
                  details: '$14.3B valuation, infrastructure premium',
                  insight: 'Data infrastructure for AI proving most valuable layer'
              },
              {
                  company: 'Anduril',
                  details: '$14B valuation, defense tech validation',
                  insight: 'Geopolitics driving venture-scale defense opportunities'
              },
              {
                  company: 'Harvey + Abridge',
                  details: 'Both at $5B+, vertical AI winners',
                  insight: 'Every major vertical will have its AI unicorn'
              }
          ],
          'portfolio-mentions': [
              {
                  company: 'VC Intelligence Tools',
                  context: 'Growing discussion about information overload in venture',
                  sentiment: 'POSITIVE',
                  action: 'Perfect timing for your solution'
              },
              {
                  company: 'Competitive landscape',
                  context: 'No dominant player in VC intelligence yet',
                  sentiment: 'POSITIVE',
                  action: 'First-mover advantage still available'
              },
              {
                  company: 'Infrastructure focus',
                  context: 'Your positioning as intelligence infrastructure smart',
                  sentiment: 'POSITIVE',
                  action: 'Emphasize infrastructure angle in pitch'
              }
          ],
          'lp-sentiment': [
              {
                  trend: 'DPI drought reaching crisis levels',
                  source: 'Multiple endowment CIOs, pension discussions',
                  impact: 'Only 11% distributions vs 29% historical. New funds struggling.'
              },
              {
                  trend: 'Specialist funds gaining major favor',
                  source: 'CalPERS explicit, European pensions following',
                  impact: 'Vertical-focused funds raising 2x faster than generalists'
              },
              {
                  trend: 'Co-investment becoming requirement',
                  source: 'Sovereign wealth requirements, family offices',
                  impact: '88% of LPs want co-invest rights. Non-negotiable for many.'
              }
          ]
      }
  },

  // ============================================
  // PRIORITY BRIEFINGS
  // ============================================
  priorityBriefings: {
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
              guest: 'Chamath, Sacks, Friedberg + Marc Andreessen',
              keyInsights: [
                  'Q2 data confirms: 70% of AI funding to infrastructure, only 30% to applications',
                  'Application layer seeing rapid commoditization - margins compressing to sub-20%',
                  'a16z announcing $20B AI fund focused exclusively on US infrastructure plays'
              ],
              signals: [
                  { type: 'thesis', text: '✓ Infrastructure Thesis: Your focus on intelligence layer perfectly timed' },
                  { type: 'market', text: '⚠ Competitive Alert: Expect flood of infrastructure pivots next quarter' }
              ]
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
              guest: 'Benchmark GP Sarah Tavel',
              keyInsights: [
                  'New Series A bar: $3M ARR minimum, $5M for AI plays outside infrastructure',
                  'Seed extensions now average 9 months - plan for 24-month runway minimum',
                  'Quality flight: Top 20% of startups getting 80% of capital'
              ],
              signals: [
                  { type: 'market', text: '◆ Fundraising Window: Series A bar rising monthly - move fast' },
                  { type: 'strategic', text: '🎯 Revenue Target: Need $3M ARR by Q1 2026 for credible raise' }
              ]
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
              guest: 'CalPERS CIO Nicole Musicco',
              keyInsights: [
                  'Largest pension fund moving from 1.4% to 10% venture allocation over 3 years',
                  'Explicit preference for specialist funds over generalists - "depth beats breadth"',
                  'New requirement: Clear path to DPI within 5-7 years, not just paper markups'
              ],
              signals: [
                  { type: 'lp', text: '◇ LP Opportunity: Institutional capital flooding in - good for ecosystem' },
                  { type: 'strategic', text: '💡 Positioning: Specialist angle (VC intelligence) attractive to LPs' }
              ]
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
              guest: 'Jensen Huang + Sequoia Partners',
              keyInsights: [
                  'GPU costs dropped 90% but demand growing 10x - infrastructure still bottleneck',
                  'Every $1 in AI app revenue requires $4 in infrastructure investment',
                  'Next 18 months will see $500B+ infrastructure buildout globally'
              ],
              signals: [
                  { type: 'thesis', text: '✓ Thesis Match: Intelligence infrastructure critical for AI ecosystem' },
                  { type: 'market', text: '◆ Timing: Infrastructure gold rush just beginning' }
              ]
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
              guest: 'Palmer Luckey, Founder of Anduril',
              keyInsights: [
                  'Anduril at $14B proves defense tech can achieve venture-scale returns',
                  'US + allies spending $2T annually - software eating only 2% currently',
                  'Autonomous systems replacing 50% of defense personnel within decade'
              ],
              signals: [
                  { type: 'market', text: '◆ Market Signal: Defense tech mainstream despite ESG concerns' },
                  { type: 'thesis', text: '✓ Dual-Use: Commercial AI tech finding defense applications' }
              ]
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
              guest: 'Thomas Dohmke, CEO of GitHub',
              keyInsights: [
                  'Every developer will have AI pair programmer by 2026 - market inevitability',
                  'Cursor at $2.5B shows appetite for specialized dev tools beyond Copilot',
                  'Enterprise spending on dev productivity tools growing 200% YoY'
              ],
              signals: [
                  { type: 'market', text: '◆ Dev Tools Explosion: Still early innings' },
                  { type: 'competitive', text: '⚡ Consolidation Coming: Major acquisitions expected Q4' }
              ]
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
              guest: 'Frank Slootman + Top Tech Bankers',
              keyInsights: [
                  'Only 27 IPOs in H1 2025 - lowest since 2009 financial crisis',
                  'Strategic acquirers paying 40-60% premiums over last private rounds',
                  'Every major tech co has $10B+ allocated for AI acquisitions'
              ],
              signals: [
                  { type: 'market', text: '◆ Exit Strategy: Build for strategic acquisition, not IPO' },
                  { type: 'lp', text: '◇ LP Intel: M&A providing liquidity lifeline' }
              ]
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
              guest: 'Top Vertical AI Founders Panel',
              keyInsights: [
                  'Legal (Harvey $5B), Healthcare (Abridge $5.3B) proving vertical playbook',
                  'Next winners: Financial services, real estate, logistics, education',
                  'Vertical AI companies seeing 3-5x revenue multiples vs horizontal'
              ],
              signals: [
                  { type: 'thesis', text: '✓ Vertical Opportunity: VC industry prime for AI transformation' },
                  { type: 'market', text: '◆ First-Mover: No dominant VC intelligence platform yet' }
              ]
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
              guest: 'Brad Gerstner & Bill Gurley',
              keyInsights: [
                  'AI creating 100x outcomes where 10x was previous ceiling',
                  'Seed funds seeing 500x returns on infrastructure plays',
                  'Warning: Late-stage valuations disconnecting from fundamentals'
              ],
              signals: [
                  { type: 'lp', text: '◇ Fund Dynamics: Concentrated bets beating diversification' },
                  { type: 'market', text: '◆ Valuation Alert: Infrastructure premiums may compress' }
              ]
          }
      ]
  },

  // ============================================
  // INTELLIGENCE BRIEF (SIDEBAR)
  // ============================================
  intelligenceBrief: {
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
              { theme: 'Enterprise Agents', change: '+52% w/w', direction: 'positive' },
              { theme: 'Defense Tech', change: '+41% w/w', direction: 'positive' },
              { theme: 'AI Infrastructure', change: '+38% w/w', direction: 'positive' },
              { theme: 'Exit Strategies', change: '+29% w/w', direction: 'positive' },
              { theme: 'Vertical AI', change: '+31% w/w', direction: 'positive' },
              { theme: 'Climate Tech', change: '+26% w/w', direction: 'positive' },
              { theme: 'Traditional SaaS', change: '-18% w/w', direction: 'negative' }
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
  },

  // ============================================
  // WEEKLY BRIEF CONTENT (FOR PDF GENERATION)
  // ============================================
  weeklyBrief: {
      executive: {
          summary: [
              {
                  type: 'consensus',
                  text: 'AI infrastructure reaches 70% of funding',
                  details: '[287 mentions across 46 episodes] with Scale AI at $14.3B proving "picks and shovels" thesis.'
              },
              {
                  type: 'growth',
                  text: 'Enterprise agents explode +52% w/w',
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
              value: '+52%',
              context: 'Enterprise Agents',
              change: '↑ w/w',
              changeType: 'up'
          },
          {
              label: 'Peak Consensus',
              value: '70%',
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
              name: 'Enterprise Agents',
              change: '+52% w/w',
              momentum: 52,
              mentions: 234,
              context: 'production deployments accelerating',
              direction: 'positive'
          },
          {
              name: 'Defense Tech',
              change: '+41% w/w',
              momentum: 41,
              mentions: 178,
              context: 'geopolitics driving mainstream adoption',
              direction: 'positive'
          },
          {
              name: 'AI Infrastructure',
              change: '+38% w/w',
              momentum: 38,
              mentions: 287,
              context: 'capturing 70% of all AI funding',
              direction: 'positive'
          },
          {
              name: 'Vertical AI',
              change: '+31% w/w',
              momentum: 31,
              mentions: 167,
              context: 'Harvey and Abridge prove $5B+ potential',
              direction: 'positive'
          },
          {
              name: 'Exit Strategies',
              change: '+29% w/w',
              momentum: 29,
              mentions: 156,
              context: 'M&A replacing IPO as primary path',
              direction: 'positive'
          },
          {
              name: 'Climate Tech',
              change: '+26% w/w',
              momentum: 26,
              mentions: 89,
              context: 'industrial applications drive profitability',
              direction: 'positive'
          },
          {
              name: 'Traditional SaaS',
              change: '-18% w/w',
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
              description: '-18% while all AI categories surge',
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
      }
  },

  // ============================================
  // PORTFOLIO DATA (PLACEHOLDER)
  // ============================================
  portfolio: {
      companies: [],
      watchlist: [],
      mentions: {
          new: 5,
          total: 31
      }
  }
};

// Export for compatibility
window.masterData = window.unifiedData; // Alias for transition period

console.log('Unified data loaded successfully - July 25, 2025');
console.log('Data version:', window.unifiedData.meta.version);
console.log('Total topics:', Object.keys(window.unifiedData.narrativePulse.topics).length);
console.log('Total briefings:', window.unifiedData.priorityBriefings.items.length);
console.log('Total feed items:', window.unifiedData.narrativeFeed.items.length);