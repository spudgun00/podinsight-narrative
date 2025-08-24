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
              { label: 'Enterprise Agents', value: '↑107%' },
              { label: 'Defense Tech', value: '↑111%' },
              { label: 'AI Infrastructure', value: '↑64%' },
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
                  "European vs US Series A requirements July 2025",
                  "Fintech path to profitability in current market",
                  "What VCs are saying about Revolut's trajectory"
              ],
              trendingTopics: [
                  { name: 'Enterprise Agents', trend: '↑107% w/w' },
                  { name: 'Defense Tech', trend: '↑111% w/w' },
                  { name: 'AI Infrastructure', trend: '↑64% w/w' },
                  { name: 'Exit Strategies', trend: '↑50% w/w' },
                  { name: 'Vertical AI', trend: '↑60% w/w' }
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
                  dateLabels: ['May 2', 'May 9', 'May 16', 'May 23', 'May 30', 'Jun 6', 'Jun 13', 'Jun 20', 'Jun 27', 'Jul 4', 'Jul 11', 'Jul 18', 'Jul 25'],
                  dataPoints: 13,
                  interval: 'weekly'
              }
          }
      },
      // Chart-based insights for different timeframes
      chartInsights: {
          '7 days': [
              {
                  type: 'Breakout Narrative',
                  title: 'Climate Tech Hits Escape Velocity',
                  description: 'Climate Tech accelerating +113% with sharp growth in last 72 hours',
                  relatedTopics: ['Climate Tech']
              },
              {
                  type: 'Leadership Change',
                  title: 'Vertical AI Edges Past Exit Strategies',
                  description: 'Vertical AI overtook Exit Strategies on Jul 23, signaling builder focus',
                  relatedTopics: ['Vertical AI', 'Exit Strategies']
              },
              {
                  type: 'Trend Character',
                  title: 'Vertical AI Shows Stable Growth Pattern',
                  description: 'Unlike other fast movers, Vertical AI (+60%) shows low volatility',
                  relatedTopics: ['Vertical AI']
              }
          ],
          '30 days': [
              {
                  type: 'Breakout Narrative',
                  title: 'Defense Tech Accelerating Fastest',
                  description: 'Defense Tech momentum increased 75% in past 2 weeks vs first half',
                  relatedTopics: ['Defense Tech']
              },
              {
                  type: 'Leadership Change',
                  title: 'Enterprise Agents Overtakes AI Infrastructure',
                  description: 'Enterprise Agents crossed above AI Infrastructure on Jul 18',
                  relatedTopics: ['Enterprise Agents', 'AI Infrastructure']
              },
              {
                  type: 'Trend Character',
                  title: 'Exit Strategies Shows Volatile Pattern',
                  description: 'Exit discussion volatility 90% higher than stable Vertical AI growth',
                  relatedTopics: ['Exit Strategies', 'Vertical AI']
              }
          ],
          '90 days': [
              {
                  type: 'Leadership Change',
                  title: 'AI Infrastructure Surpasses Traditional SaaS',
                  description: 'Historic crossover in Week 7 (Jun 8) marks permanent market shift',
                  relatedTopics: ['AI Infrastructure', 'Traditional SaaS']
              },
              {
                  type: 'Trend Character',
                  title: 'Defense Tech Volatile vs AI Steady',
                  description: 'Defense Tech shows event-driven spikes while AI Infrastructure climbs steadily',
                  relatedTopics: ['Defense Tech', 'AI Infrastructure']
              },
              {
                  type: 'Breakout Narrative',
                  title: 'Climate Tech: From Niche to Mainstream',
                  description: 'Q2 saw Climate Tech accelerate from 35 to 89 mentions (+154%)',
                  relatedTopics: ['Climate Tech']
              }
          ]
      },
      topics: {
          'AI Infrastructure': {
              color: '#4a7c59',
              momentum: '+64%',
              weeklyChange: '+64%',
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
              momentum: '+107%',
              weeklyChange: '+107%',
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
              momentum: '+111%',
              weeklyChange: '+111%',
              mentions: 178,
              episodes: 24,
              consensusLevel: 'Mixed (55% agreement)',
              description: '3 of top 10 Q2 deals, Anduril at $14B',
              chartData: {
                  '7d': {
                      momentum: {
                          dataPoints: [28, 32, 35, 33, 35, 42, 38],
                          dailyAverage: 34.7,
                          peakDay: 'Jul 24'
                      },
                      volume: {
                          dataPoints: [28, 32, 35, 33, 35, 42, 38],
                          total: 243
                      },
                      consensus: {
                          levels: [0.48, 0.51, 0.50, 0.58, 0.65, 0.68, 0.67],
                          label: 'Mixed'
                      },
                      quotes: {
                          'Jul 19': 'Defense tech investment thesis gaining traction',
                          'Jul 20': 'Founders Fund doubles down on defense startups',
                          'Jul 21': 'Pentagon modernization creating opportunities',
                          'Jul 22': 'Geopolitical tensions driving investment urgency',
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
              momentum: '+50%',
              weeklyChange: '+50%',
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
                          total: 999
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
              momentum: '+60%',
              weeklyChange: '+60%',
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
              momentum: '-58%',
              weeklyChange: '-58%',
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
              momentum: '+113%',
              weeklyChange: '+113%',
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
                          quote: 'Scale AI at $14.3B proves the thesis. Every LP wants infrastructure exposure - application layer is getting commoditized at light speed. • All-In Ep 167 • 34:12'
                      },
                      {
                          name: 'BG2Pod with Brad Gerstner',
                          time: '7h ago',
                          quote: 'We\'re seeing 70% of AI dollars flow to infrastructure. The picks-and-shovels play is the only defensible position. • 20VC Ep 789 • 55:08'
                      },
                      {
                          name: 'Invest Like the Best',
                          time: '1d ago',
                          quote: 'Foundation model companies need $100M+ just to compete. Infrastructure is where sustainable moats exist. • Invest Like the Best Ep 321 • 28:50'
                      }
                  ],
                  dissent: {
                      name: 'Contrarian Corner Podcast',
                      time: '3d ago',
                      quote: 'When everyone rushes to infrastructure, the real opportunity might be in overlooked vertical applications. • All-In Ep 184 • 61:30'
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
                      quote: 'The Series A crunch is real. We won\'t even take meetings below $2.5M ARR unless it\'s AI infrastructure. Extension rounds are the new normal. • Acquired Ep 203 • 72:15'
                  },
                  mainstream: [
                      {
                          name: 'Emergence Capital Thesis Update',
                          time: 'This week',
                          quote: 'Quality bar keeps rising. Companies need 18-24 months runway because the next round will be harder. • Khosla Ventures Podcast Ep 51 • 40:05'
                      },
                      {
                          name: 'SaaStr Annual Preview',
                          time: '2d ago',
                          quote: '75% higher revenue requirements than 2021. This is healthy market correction, not a crisis. • The Information\'s 411 Ep 1456 • 19:40'
                      }
                  ]
              }
          },
          {
              id: 'feed-euro-1',
              time: '18h ago',
              event: 'European tech momentum accelerating - H1 deployments at record levels',
              category: 'pattern',
              expansion: {
                  sources: [
                      {
                          name: 'The European Founder',
                          time: '18h ago',
                          quote: '€15B deployed in European tech H1 2025, with UK capturing 35% despite macro concerns. Multiple US funds opening London offices.'
                      },
                      {
                          name: '20VC European Special',
                          time: '1d ago',
                          quote: 'The arbitrage opportunity is real - similar quality companies at 40% discount to Bay Area valuations.'
                      }
                  ],
                  implications: 'US LPs increasingly allocating to European funds for value. Cross-Atlantic rounds accelerating.'
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
                          quote: '70% of Fortune 500s now in production with AI agents. Decagon\'s $1.5B valuation validates enterprise appetite. • The Information\'s 411 Ep 1582 • 25:10'
                      },
                      {
                          name: 'CloudNative Podcast',
                          time: '1d ago',
                          quote: 'AWS reporting 3x growth in agent infrastructure consumption. This isn\'t experimentation anymore. • The Information\'s 411 Ep 1320 • 31:22'
                      },
                      {
                          name: 'CTO Confidential',
                          time: '2d ago',
                          quote: 'Every software budget now has AI allocation. 30% of traditional SaaS spend shifting to AI tools. • Indie Hackers Ep 287 • 48:35'
                      }
                  ],
                  momentum: '42 mentions this week vs. 11 mentions last week (+281%)'
              }
          },
          {
              id: 'feed-4',
              time: '1d ago',
              event: 'Thiel: "10% venture allocation is intellectually dishonest - either go to zero or 50%, anything else is bureaucratic cowardice"',
              category: 'divergence',
              expansion: {
                  indicators: [
                      {
                          name: 'Conversations with Tyler',
                          time: '1d ago',
                          quote: 'Pension funds optimize for not getting fired, not returns. A 10% allocation lets them claim innovation while avoiding real risk. True believers should be 50%+ in venture or admit they don\'t understand the future. • Conversations with Tyler Ep 189 • 42:15'
                      },
                      {
                          name: 'Josh Wolfe Counterpoint',
                          time: '2d ago',
                          quote: 'Thiel\'s binary worldview ignores portfolio theory. But he\'s right that most LPs are fighting the last war - optimizing for 2008 when they should prepare for 2030. • The Tim Ferriss Show Ep 712 • 67:40'
                      }
                  ],
                  impact: 'Institutional LPs privately admitting their allocation models are "compliance theater" not return optimization.'
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
                          quote: 'Every major vertical will have its $10B+ AI winner. Healthcare and legal are just the beginning. • The Logan Bartlett Show Ep 92 • 16:00'
                      },
                      {
                          name: 'Index Ventures Thesis',
                          time: '2d ago',
                          quote: 'Domain expertise plus AI equals defensible moats. Horizontal plays are dead on arrival. • 20VC Ep 851 • 68:40'
                      },
                      {
                          name: 'NEA Partner Meeting Leak',
                          time: '3d ago',
                          quote: 'We\'re only backing teams that own the entire workflow in their vertical. No more point solutions. • All-In Ep 195 • 45:00'
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
                          quote: 'Only 27 IPOs in H1 2025 - lowest in a decade. Strategic acquirers are the new exit path. • Acquired Ep 221 • 81:03'
                      },
                      {
                          name: 'Banker Roundtable',
                          time: '3d ago',
                          quote: 'Tech giants sitting on $500B+ cash. M&A premiums averaging 40% above last private round. • Invest Like the Best Ep 298 • 37:25'
                      },
                      {
                          name: 'Stratechery Analysis',
                          time: '4d ago',
                          quote: 'IPO window might not truly open until 2026. Founders need to adjust expectations now. • Stratechery Ep 35 • 14:50'
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
  // PRIORITY BRIEFINGS - Updated structure with cardView/expandedView split
// ============================================
// PRIORITY BRIEFINGS - NEW APPROACH
// ============================================
priorityBriefings: {
  items: [
      // CARD VERSION
      {
          id: 'briefing-1',
          // Backward compatibility fields (mapped from cardView/expandedView)
          priority: 'critical',
          priorityLabel: 'Consensus Forming',
          podcast: 'All-In',
          title: "AI Infrastructure vs Apps: The $70B Capital Allocation Shift",
          guest: 'Chamath Palihapitiya (Founder, Social Capital) + Jason Calacanis (Launch Fund)',
          keyInsights: [
              "• 70% of AI funding now flowing to infrastructure, complete reversal from 2023",
              "• Application layer margins compressing to 20% while infrastructure holds 70%+",
              "• Defense tech reclassified as 'infrastructure' - opening floodgates for VC investment"
          ],
          signals: [
              { type: 'thesis', text: '✓ Infrastructure Thesis: Your focus on intelligence layer perfectly timed' },
              { type: 'market', text: '⚠ Competitive Alert: Expect flood of infrastructure pivots next quarter' }
          ],
          conversationSummary: "Chamath opens with stark data - 70% of Q2 AI funding went to infrastructure versus 30% to applications, a complete reversal from 2023. Jason pushes back citing Jasper's decline, but Chamath counters that infrastructure enables entirely new categories. The debate heats up when Friedberg joins, revealing their portfolio's pivot after seeing application layer margins compress to 20% while infrastructure maintains 70%+. Sacks drops the bombshell that defense tech is now considered 'infrastructure' by most funds.",
          patternRecognition: {
              metric1: { value: '4th', label: 'Major fund confirming infrastructure > apps thesis' },
              metric2: { value: '87%', label: 'Of this week\'s episodes mentioned infrastructure dominance' },
              metric3: { value: '15', label: 'Portfolio companies pivoting from apps to infrastructure' },
              metric4: { value: '2nd', label: 'Time Marc Andreessen has made this infrastructure argument' }
          },
          // Original nested structure preserved
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
          // Backward compatibility fields
          priority: 'opportunity',
          priorityLabel: 'New Data',
          podcast: '20VC',
          title: "The Series A Apocalypse: Why $5M ARR Is The New $1M",
          guest: 'Bill Gurley (GP, Benchmark) + Harry Stebbings (20VC)',
          keyInsights: [
              "• Series A bar: $5M ARR for AI applications, $3M for traditional SaaS",
              "• 40% of 2023 vintage seeds won't qualify for Series A at current burn",
              "• 30-month runway now table stakes - 18 months is 'criminally negligent'"
          ],
          signals: [
              { type: 'market', text: '◆ Fundraising Window: Series A bar rising monthly - move fast' },
              { type: 'strategic', text: '🎯 Revenue Target: Need $3M ARR by Q1 2026 for credible raise' }
          ],
          conversationSummary: "Bill Gurley doesn't mince words - 'This is the most challenging Series A environment since 2008.' Harry probes on specific metrics, and Bill reveals Benchmark's new internal bar: $5M ARR for AI companies, $3M for everything else. The conversation turns when Bill shares that 40% of their 2023 seed portfolio won't hit these numbers. He advocates for 30-month runways, calling the standard 18-month advice 'criminally negligent.' When Harry asks about exceptions, Bill is firm: 'Infrastructure plays only - they have different unit economics.'",
          patternRecognition: {
              metric1: { value: '12th', label: 'Fund confirming $3M ARR as new Series A minimum' },
              metric2: { value: '40%', label: 'Of 2023 seeds still seeking Series A funding' },
              metric3: { value: '24', label: 'Months runway now required vs 18 previously' },
              metric4: { value: '5x', label: 'Revenue multiple compression from 2021 highs' }
          },
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
          // Backward compatibility fields
          priority: 'elevated',
          priorityLabel: 'LP Intel',
          podcast: 'The Information\'s 411',
          title: "The DPI Crisis: Why LPs Are Demanding Cash, Not Markups",
          guest: 'Josh Wolfe (Co-founder, Lux Capital) + Jessica Lessin (The Information)',
          keyInsights: [
              "• LPs demanding concrete 'DPI roadmaps' - 5-year paths to distributions",
              "• Secondaries becoming primary liquidity source - not a temporary fix",
              "• Top funds now taking 20% off table at Series C as standard practice"
          ],
          signals: [
              { type: 'lp', text: '◇ LP Opportunity: Institutional capital flooding in - good for ecosystem' },
              { type: 'strategic', text: '💡 Positioning: Specialist angle (VC intelligence) attractive to LPs' }
          ],
          conversationSummary: "Josh Wolfe starts with a stark admission: 'The entire venture model is broken without exits.' Jessica presses on Lux's returns, and Josh reveals they've returned $2B in actual cash over 24 months through secondaries and one strategic exit. The conversation shifts when Josh explains how LPs are now demanding 'DPI roadmaps' - concrete plans for distributions within 5 years. He shares that MIT's endowment told him: 'Show us the path to cash or we're out.' The discussion gets tactical when Josh outlines their new strategy: taking 20% off the table at Series C for all investments.",
          patternRecognition: {
              metric1: { value: '6th', label: 'Major pension fund increasing venture allocation' },
              metric2: { value: '$21B', label: 'CalPERS commitment driving LP confidence' },
              metric3: { value: '10%', label: 'New allocation vs 1.4% historical average' },
              metric4: { value: '3rd', label: 'Time Nicole Musicco discussed specialist funds preference' }
          },
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
          // Backward compatibility fields
          priority: 'critical',
          priorityLabel: 'Contrarian View',
          podcast: 'Acquired',
          title: "The Great Cloud Reversal: Why Companies Are Fleeing AWS",
          guest: 'David Rosenthal + Ben Gilbert + Guest: Dylan Field (CEO, Figma)',
          keyInsights: [
              "• Cloud repatriation saving companies 50-70% on infrastructure costs",
              "• 18-month payback period for on-premise infrastructure investment",
              "• AI workloads pushing even mid-size companies to reconsider cloud"
          ],
          signals: [
              { type: 'thesis', text: '✓ Thesis Match: Intelligence infrastructure critical for AI ecosystem' },
              { type: 'market', text: '◆ Timing: Infrastructure gold rush just beginning' }
          ],
          conversationSummary: "Dylan Field drops a bombshell in the first ten minutes: 'We cut our infrastructure costs by 70% by leaving AWS.' Ben and David are stunned, pushing for details. Dylan explains how Figma built their own bare-metal infrastructure, saving $50M annually. The conversation explodes when Dylan suggests every company over $100M revenue should consider repatriation. David challenges the complexity, but Dylan counters with hard data - 18-month payback on their $30M infrastructure investment. The discussion pivots to AI workloads, where Dylan predicts 'on-prem is the only way to make unit economics work at scale.'",
          patternRecognition: {
              metric1: { value: '4x', label: 'Infrastructure spend per $1 of AI revenue' },
              metric2: { value: '90%', label: 'GPU cost drop annually per Jensen\'s roadmap' },
              metric3: { value: '$500B', label: 'Global infrastructure buildout next 18 months' },
              metric4: { value: '2nd', label: 'Inning of 9-inning game per Jensen Huang' }
          },
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
          // Backward compatibility fields
          priority: 'opportunity',
          priorityLabel: 'New Data',
          podcast: 'Invest Like the Best',
          title: "Agents Are Eating SaaS: The $400B Disruption Nobody Sees Coming",
          guest: 'Patrick O\'Shaughnessy + Guest: Aaron Levie (CEO, Box)',
          keyInsights: [
              "• AI agents replacing entire SaaS categories - not just features",
              "• 30% of Box's traditional usage already cannibalized by AI features",
              "• $400B of SaaS market cap at risk of evaporation by 2027"
          ],
          signals: [
              { type: 'market', text: '◆ Market Signal: Defense tech mainstream despite ESG concerns' },
              { type: 'thesis', text: '✓ Dual-Use: Commercial AI tech finding defense applications' }
          ],
          conversationSummary: "Aaron Levie starts with a confession: 'I'm terrified and excited in equal measure.' Patrick asks why, and Aaron explains that AI agents will replace entire categories of SaaS. He shares Box's internal data - their AI features are cannibalizing 30% of traditional usage. The conversation intensifies when Aaron predicts 'vertical SaaS is dead' - agents will handle workflows end-to-end. Patrick challenges him on Box's survival, and Aaron reveals they're pivoting to become an 'agent orchestration platform.' The real bombshell: Aaron estimates $400B of current SaaS market cap will evaporate by 2027.",
          patternRecognition: {
              metric1: { value: '3', label: 'Defense tech deals in top 10 Q2 rounds' },
              metric2: { value: '$14B', label: 'Anduril valuation proving sector viability' },
              metric3: { value: '50%', label: 'Defense spending shifting to autonomous systems' },
              metric4: { value: '5th', label: 'Major fund overcoming ESG concerns this quarter' }
          },
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
          // Backward compatibility fields
          priority: 'elevated',
          priorityLabel: 'Portfolio Impact',
          podcast: 'The Logan Bartlett Show',
          title: "The M&A Playbook: Why Every Startup Needs Three Strategic Relationships",
          guest: 'Logan Bartlett (Redpoint) + Guest: Emilie Choi (President, Coinbase)',
          keyInsights: [
              "• Strategic buyers tracking companies 3+ years before acquisition",
              "• 2-3x last round premiums for truly strategic assets",
              "• 60% of Coinbase's M&A targets aren't crypto companies"
          ],
          signals: [
              { type: 'market', text: '◆ Dev Tools Explosion: Still early innings' },
              { type: 'competitive', text: '⚡ Consolidation Coming: Major acquisitions expected Q4' }
          ],
          conversationSummary: "Emilie Choi starts with surprising transparency: 'We track 500+ companies for potential acquisition, and 60% aren't even crypto-native.' Logan digs into their M&A strategy, and Emilie reveals Coinbase has a dedicated team building relationships with Series A companies - three years before they'd consider buying. The conversation heats up when discussing valuations. Emilie admits they'll pay 2-3x the last private round for strategic assets. She shares their framework: every startup should maintain relationships with at least three potential acquirers from Series A onward. The kicker: 'The best acquisitions are never shopped - they're cultivated over years.'",
          patternRecognition: {
              metric1: { value: '55%', label: 'More code shipped by Copilot users' },
              metric2: { value: '$500M', label: 'GitHub Copilot run rate milestone' },
              metric3: { value: '200%', label: 'YoY enterprise spending on dev tools' },
              metric4: { value: '2026', label: 'When every developer will have AI pair programmer' }
          },
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
          // Backward compatibility fields
          priority: 'elevated',
          priorityLabel: 'Consensus Forming',
          podcast: 'Stratechery',
          title: "Every Developer Will Have an AI Pair Programmer by 2026",
          guest: 'Ben Thompson + Guest: Nat Friedman (Former GitHub CEO)',
          keyInsights: [
              "• 75% of Fortune 500 developers already using AI tools daily",
              "• Developer productivity tools growing 200% YoY - fastest enterprise segment",
              "• Next wave: AI handling entire development workflows, not just code completion"
          ],
          signals: [
              { type: 'market', text: '◆ Exit Strategy: Build for strategic acquisition, not IPO' },
              { type: 'lp', text: '◇ LP Intel: M&A providing liquidity lifeline' }
          ],
          conversationSummary: "Nat Friedman opens with a bold prediction: 'By 2026, coding without AI will be like coding without an IDE - technically possible but professionally negligent.' Ben pushes on adoption rates, and Nat shares exclusive data - 75% of Fortune 500 developers already use AI daily. The conversation pivots when discussing Cursor's $2.5B valuation. Nat sees it validating the market: 'There's room for 10 billion-dollar companies in AI dev tools.' He reveals the real opportunity isn't in coding assistance but in AI handling entire development workflows - from requirements to deployment.",
          patternRecognition: {
              metric1: { value: '27', label: 'IPOs in H1 2025 vs 183 in 2021' },
              metric2: { value: '40-60%', label: 'M&A premiums over last private rounds' },
              metric3: { value: '$100B', label: 'Google\'s acquisition war chest through 2026' },
              metric4: { value: '3rd', label: 'Quarter of sustained IPO drought' }
          },
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
          // Backward compatibility fields
          priority: 'opportunity',
          priorityLabel: 'New Data',
          podcast: 'Khosla Ventures Podcast',
          title: "The Energy Crisis Nobody's Talking About: AI's 500 TWh Problem",
          guest: 'Vinod Khosla + Guest: Sam Altman (CEO, OpenAI)',
          keyInsights: [
              "• AI will consume 500 TWh by 2030 - equivalent to Japan's total usage",
              "• Energy, not compute, is the real bottleneck to AI progress",
              "• OpenAI investing directly in fusion and geothermal projects"
          ],
          signals: [
              { type: 'thesis', text: '✓ Vertical Opportunity: VC industry prime for AI transformation' },
              { type: 'market', text: '◆ First-Mover: No dominant VC intelligence platform yet' }
          ],
          conversationSummary: "Vinod doesn't waste time: 'Forget chips - tell me about power.' Sam Altman's response is sobering: 'Energy is the real constraint to AGI, not compute.' He reveals OpenAI's models already consume as much power as small cities, and GPT-5 training will require dedicated power plants. The conversation turns to solutions when Sam discusses OpenAI's investments in fusion and advanced geothermal. Vinod pushes on timeline, and Sam admits: 'We need 500 TWh of new clean energy by 2030 or AI progress stops.' They agree the biggest opportunity isn't in AI models but in energy infrastructure for AI.",
          patternRecognition: {
              metric1: { value: '2', label: '$5B+ vertical AI winners (Harvey, Abridge)' },
              metric2: { value: '20-30', label: 'Vertical AI champions predicted by Thrive' },
              metric3: { value: '3-5x', label: 'Revenue multiple premium for vertical AI' },
              metric4: { value: '4th', label: 'Major vertical reaching AI inflection point' }
          },
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
          // Backward compatibility fields
          priority: 'opportunity',
          priorityLabel: 'Contrarian View',
          podcast: 'Indie Hackers',
          title: "Why Indie Hackers Are Beating VC-Backed Startups at AI",
          guest: 'Courtland Allen + Guest: Pieter Levels (Nomad List, PhotoAI)',
          keyInsights: [
              "• Solo founders reaching $5M ARR with AI products at 90%+ margins",
              "• AI tools democratizing development - funding becoming a disadvantage",
              "• Prediction: 90% of successful AI startups will be bootstrapped"
          ],
          signals: [
              { type: 'lp', text: '◇ Fund Dynamics: Concentrated bets beating diversification' },
              { type: 'market', text: '◆ Valuation Alert: Infrastructure premiums may compress' }
          ],
          conversationSummary: "Pieter Levels starts with characteristic bluntness: 'VCs are pouring millions into AI wrappers that I build in a weekend.' Courtland asks for specifics, and Pieter reveals PhotoAI hit $5M ARR with zero employees and $500 in monthly costs. The conversation gets spicy when discussing VC-backed competitors. Pieter shows how ventures burning $2M monthly are building the same features he ships solo. His thesis: AI democratizes building so much that funding becomes a disadvantage - it forces premature scaling. The discussion culminates with Pieter predicting 90% of AI startups will be profitable one-person companies.",
          patternRecognition: {
              metric1: { value: '1000x', label: 'New outcome ceiling vs traditional 10x' },
              metric2: { value: '500x', label: 'Current paper returns on infrastructure bets' },
              metric3: { value: '30-40', label: 'Bets still needed to find the outlier' },
              metric4: { value: '2nd', label: 'Time Reid Hoffman warned about missing NVIDIA' }
          },
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
},

// ============================================
// INTELLIGENCE BRIEF - SIDEBAR DATA
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
            { name: 'The Logan Bartlett Show', score: 'High (91)' },
            { name: 'Stratechery', score: 'High (88)' }
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
// DRILL-DOWN PANEL EPISODES - DEMO DATA
// ============================================
drilldownEpisodes: {
    'Defense Tech': [
        {
            id: 'dd-defense-1',
            podcast: 'All-In Podcast',
            timeAgo: '2 days ago',
            mentions: 42,
            title: "Anduril's $14B Valuation: Defense Tech Goes Mainstream",
            quote: "This is the SpaceX moment for defense tech. Every LP who ignored this sector is scrambling",
            guest: 'Chamath Palihapitiya',
            priority: 'critical'
        },
        {
            id: 'dd-defense-2',
            podcast: '20VC',
            timeAgo: '3 days ago',
            mentions: 31,
            title: "Why We Led Anduril's Round",
            quote: "Geopolitics gave us a 10-year tailwind. This isn't a trend, it's a generational shift",
            guest: 'Bill Gurley',
            priority: 'opportunity'
        },
        {
            id: 'dd-defense-3',
            podcast: 'Acquired',
            timeAgo: '4 days ago',
            mentions: 28,
            title: "Defense Tech Deep Dive: From Taboo to Table Stakes",
            quote: "Three of the top 10 Q2 deals were defense tech, including cyber-defense plays following market leaders like Darktrace",
            guest: 'Ben Gilbert',
            priority: 'elevated'
        }
    ],
    // Placeholder for other topics
    'AI Infrastructure': [],
    'Enterprise Agents': [],
    'Climate Tech': [],
    'Traditional SaaS': []
},

// ============================================
// WEEKLY BRIEF - FOR PDF GENERATION
// ============================================
weeklyBrief: {
    executive: {
        summary: [
            {
                type: 'consensus',
                text: 'AI infrastructure reaches 70% of funding',
                details: '[287 mentions across 46 episodes] with Scale AI at $14.3B proving "picks and shovels" thesis¹'
            },
            {
                type: 'growth',
                text: 'Enterprise agents explode +107% w/w',
                details: '[234 mentions] as 70% of Fortune 500s move from pilots to production deployments²'
            },
            {
                type: 'contrarian',
                text: 'Defense tech defies critics',
                details: 'Anduril at $14B and 3 of top 10 Q2 deals validate sector despite ESG concerns³'
            },
            {
                type: 'warning',
                text: 'Exit drought deepens',
                details: 'Only 27 IPOs in H1 2025. M&A becomes primary path with 40% premiums⁴'
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
            title: 'Infrastructure > Applications clear winner⁵',
            sources: '[8 tier-1 sources aligned: All-In, BG2Pod, Index, a16z]',
            insight: '4x revenue multiples prove picks-and-shovels thesis'
        },
        {
            title: 'Enterprise AI hits production inflection⁶',
            sources: '[42 mentions across CTO panels and enterprise pods]',
            insight: 'Moving from pilots to real workflow automation at scale'
        },
        {
            title: 'Series A bar permanently higher⁷',
            sources: '[15+ funds confirm: Benchmark, First Round, Emergence]',
            insight: '$3M ARR minimum, no return to 2021 standards'
        }
    ],
    contrarian: [
        {
            title: 'Traditional SaaS accelerating decline⁸',
            description: '-58% while all AI categories surge',
            context: 'AI-native solutions making legacy obsolete'
        },
        {
            title: 'Europe deep tech arbitrage ignored⁹',
            description: '44% of global deep tech funding',
            context: 'US VCs missing significant opportunity'
        }
    ],
    blindspots: [
        {
            title: 'Developer tools consolidation wave¹⁰',
            description: 'GitHub Copilot dominance underdiscussed',
            context: 'M&A wave coming Q4 2025'
        },
        {
            title: 'Climate tech profitability turn¹¹',
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
            {
                company: "OpenAI¹²",
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
                company: "Anthropic¹³",
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
            },
            {
                company: "Revolut",
                mentions: 8,
                trend: "up",
                sentiment: {
                    score: 8.2,
                    label: "Positive"
                },
                insights: [
                    {
                        text: "Q2 profitability milestone driving positive sentiment",
                        tag: "Signal"
                    },
                    {
                        text: "Multiple discussions on Revolut's path as template for European fintech",
                        tag: null
                    },
                    {
                        text: "US expansion strategy cited as model for geographic arbitrage",
                        tag: null
                    }
                ]
            }
        ],
        watchlist: [
            {
                company: "Perplexity¹⁴",
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
    },
    // Add podcastHighlights to satisfy validator
    podcastHighlights: [],
    
    // Footnotes for all citations in the weekly brief
    footnotes: [
        "¹ All-In Ep 184 (61:30), 20VC Ep 789 with Brad Gerstner (55:08), discussing Scale AI's infrastructure thesis",
        "² The Information's 411 Ep 1582 (25:10), Enterprise Software Weekly Ep 67 (12:30), The Logan Bartlett Show Ep 92 (16:00)",
        "³ Acquired Ep 221 (81:03), analyzing Q2 2025 defense tech deals with ESG analysis",
        "⁴ Acquired Ep 203 (72:15), Stratechery Ep 35 (14:50), Invest Like the Best Ep 298 (37:25) on M&A premiums",
        "⁵ All-In Ep 147 with Chamath Palihapitiya (23:45), 20VC Ep 892 with Bill Gurley (1:02:30), BG2Pod Ep 89 (45:12)",
        "⁶ CloudNative Podcast Ep 234 (34:20), CTO Confidential Ep 45 (56:10), The Information's 411 Ep 1320 (31:22)",
        "⁷ First Round Review Ep 45 (15:20), Emergence Capital Podcast Ep 23 (45:10), Benchmark Partners Ep 78 (33:40)",
        "⁸ All-In Ep 195 (45:00), Stratechery Ep 35 (14:50), 20VC Ep 851 (68:40) on SaaS decline",
        "⁹ Khosla Ventures Podcast Ep 68 (22:55), The Information's 411 Ep 1456 (19:40), Index Ventures Europe Ep 12 (38:15)",
        "¹⁰ Indie Hackers Ep 287 (48:35), The Logan Bartlett Show Ep 92 (16:00), GitHub Copilot market share analysis",
        "¹¹ Invest Like the Best Ep 321 (28:50), The Information's 411 Ep 1320 (31:22), climate tech profitability milestones",
        "¹² All-In Ep 167 (34:12), The Information's 411 Ep 1582 (25:10), 20VC Ep 789 (55:08) on OpenAI developments",
        "¹³ 20VC Ep 851 (68:40), Acquired Ep 203 (72:15), The Information's 411 Ep 1456 (19:40) on Anthropic positioning",
        "¹⁴ All-In Ep 184 (61:30), The Logan Bartlett Show Ep 92 (16:00), Invest Like the Best Ep 298 (37:25) on Perplexity disruption"
    ]
},

// ============================================
// SEARCH RESULTS - Single Source of Truth
// ============================================
searchResults: {
    queries: {
        'european': {
            confidence: '91%',
            discussions: {
                '7days': 14,
                '30days': 52,
                '90days': 178
            },
            synthesis: {
                '7days': {
                    title: 'Geographic arbitrage emerging',
                    content: 'Growing divergence in Series A requirements: US firms requiring $5M ARR while European VCs maintaining $2-3M threshold. UK funds particularly active, with 14 discussions noting better entry prices for similar quality. Notable shift: US LPs increasingly looking at European opportunities.'
                },
                '30days': {
                    title: 'Arbitrage window widening rapidly',
                    content: "The US-Europe Series A gap has expanded from 1.5x to 2.5x over the past month. US requirements hardened to $5M ARR minimum (up from $4M in June), while European thresholds remain stable at €2-3M. Key development: Sequoia and Accel opened dedicated European early-stage funds to capitalize on the arbitrage. We're tracking 52 discussions showing US funds deploying 30% of Series A capital in Europe - up from just 12% a month ago. UK startups are the primary beneficiaries, with London capturing 60% of US crossover investments. Critical insight: European founders achieving US valuations at half the revenue threshold by strategically incorporating in Delaware while operating from Europe."
                },
                '90days': {
                    title: 'Geographic decoupling complete',
                    content: "The transatlantic Series A market has fundamentally bifurcated over the past quarter. What began as temporary post-SVB divergence in April - when both markets required $3M ARR - has crystallized into distinct ecosystems. US requirements escalated through three distinct phases: $3M (April) → $4M (May) → $5M (July), while Europe held steady at €2-3M throughout. The catalyst was May's flight to quality in US markets following several high-profile down rounds. Three structural changes emerged: (1) US LPs now allocate 15-20% to European early-stage as a distinct asset class, (2) European startups increasingly bypass US Series A entirely, going straight to US Series B at $10M+ ARR, and (3) A new class of 'arbitrage specialists' - US funds with European partners - captured 40% of European Series A deals. The data is conclusive: geographic diversification is no longer optional for Series A investors. Winners: UK and German startups securing US valuations at European revenue bars. Losers: US-only funds missing 2-3x valuation arbitrage opportunities."
                }
            },
            sources: {
                '7days': [
                    {
                        podcast: '20VC',
                        guest: 'Harry Stebbings',
                        timeAgo: '1 day ago',
                        duration: '45',
                        quote: "European Series A is where US Series A was 18 months ago - that's an opportunity. We're seeing Bay Area funds setting up London offices specifically for the valuation arbitrage."
                    },
                    {
                        podcast: 'The European Founder',
                        guest: 'Andreas Klinger',
                        timeAgo: '2 days ago',
                        duration: '38',
                        quote: "€15B deployed in European tech H1 2025. The quality gap has closed but the valuation gap remains. Smart US LPs are taking notice."
                    }
                ],
                '30days': [
                    {
                        podcast: 'All-In Podcast',
                        guest: 'Jason Calacanis',
                        timeAgo: '2 weeks ago',
                        duration: '56',
                        quote: "We're literally getting the same quality founders in Berlin at 40% of the San Francisco price. This arbitrage won't last - either US valuations come down or European goes up."
                    },
                    {
                        podcast: 'Invest Like the Best',
                        guest: 'Patrick O\'Shaughnessy',
                        timeAgo: '3 weeks ago',
                        duration: '48',
                        quote: "Sequoia Europe just closed their largest fund ever. The smart money is moving - 30% of our Series A allocation is now European. The returns speak for themselves."
                    }
                ],
                '90days': [
                    {
                        podcast: 'The Tim Ferriss Show',
                        guest: 'Matt Clifford',
                        timeAgo: '2 months ago',
                        duration: '72',
                        quote: "In April, we all thought the markets would reconverge. Now it's clear we have two distinct ecosystems. European founders don't even pitch to US VCs for Series A anymore - they wait for B."
                    },
                    {
                        podcast: '20VC',
                        guest: 'Danny Rimer',
                        timeAgo: '6 weeks ago',
                        duration: '65',
                        quote: "The bifurcation is permanent. US LPs treating Europe as a separate asset class with 15-20% allocation is the new normal. We're seeing 2-3x arbitrage on identical business models."
                    }
                ]
            }
        },
        'revolut': {
            confidence: '88%',
            discussions: 8,
            synthesis: {
                title: 'Profitability playbook emerging',
                content: "Consensus forming that fintech winners are hitting profitability without additional capital. Revolut's Q2 2025 numbers mentioned across 8 episodes as the template: £1.9B revenue run rate with 45M users, proving European scale. The narrative has shifted from 'can fintech be profitable?' to 'who can replicate Revolut's playbook?' Key insight: geographic expansion before product depth, monetize the base through premium tiers, and maintain sub-30% cost-to-income ratio. Multiple VCs now screening for 'Revolut DNA' - founders who prioritize unit economics from day one. Notable: US neobanks still burning $50M+ monthly while European fintechs achieve profitability at half the user base."
            },
            sources: [
                {
                    podcast: 'Fintech Insider',
                    guest: 'Simon Taylor',
                    timeAgo: '18 hours ago',
                    duration: '34',
                    quote: "Revolut proved you can hit profitability while still growing 50% YoY. They're the template every European fintech is now following."
                },
                {
                    podcast: '20VC',
                    guest: 'Harry Stebbings',
                    timeAgo: '2 days ago',
                    duration: '42',
                    quote: "The profitability turn changes everything for European fintech. Revolut's path shows you don't need Silicon Valley capital to build a global winner."
                }
            ]
        },
        'contrarian': {
            confidence: '76%',
            discussions: 3,
            synthesis: {
                title: 'Limited contrarian views',
                content: 'While the majority is bullish on AI, Peter Thiel and others question timeline to profitability. "We\'re building infrastructure for use cases that don\'t exist yet."'
            },
            sources: [] // Uses default sources
        },
        'series_a': {
            confidence: '91%',
            discussions: 8,
            synthesis: {
                title: 'Valuation normalization',
                content: 'Series A rounds settling at 20-30x ARR for AI companies, down from 50-100x in 2023. "Reality is setting in," per Benchmark\'s latest.'
            },
            sources: []
        },
        'brad_gerstner': {
            confidence: '94%',
            discussions: 3,
            synthesis: {
                title: "Gerstner's thesis evolution",
                content: 'Shifted focus to AI infrastructure plays and companies with "10x productivity gains". Emphasizing capital efficiency over growth at all costs.'
            },
            sources: []
        },
        'fintech_profitability': {
            // Alias for Revolut search
            confidence: '88%',
            discussions: 8,
            synthesis: {
                title: 'Profitability playbook emerging',
                content: "Consensus forming that fintech winners are hitting profitability without additional capital. Revolut's Q2 2025 numbers mentioned across 8 episodes as the template: £1.9B revenue run rate with 45M users, proving European scale. The narrative has shifted from 'can fintech be profitable?' to 'who can replicate Revolut's playbook?' Key insight: geographic expansion before product depth, monetize the base through premium tiers, and maintain sub-30% cost-to-income ratio. Multiple VCs now screening for 'Revolut DNA' - founders who prioritize unit economics from day one. Notable: US neobanks still burning $50M+ monthly while European fintechs achieve profitability at half the user base."
            },
            sources: [
                {
                    podcast: 'Fintech Insider',
                    guest: 'Simon Taylor',
                    timeAgo: '18 hours ago',
                    duration: '34',
                    quote: "Revolut proved you can hit profitability while still growing 50% YoY. They're the template every European fintech is now following."
                },
                {
                    podcast: '20VC',
                    guest: 'Harry Stebbings',
                    timeAgo: '2 days ago',
                    duration: '42',
                    quote: "The profitability turn changes everything for European fintech. Revolut's path shows you don't need Silicon Valley capital to build a global winner."
                }
            ]
        },
        'vertical_ai': {
            confidence: '94%',
            discussions: {
                '7days': 14,
                '30days': 47,
                '90days': 156
            },
            synthesis: {
                '7days': {
                    title: 'Strong consensus forming',
                    content: 'Vertical AI applications with proprietary data moats are seeing 2-3x better retention than horizontal plays. The narrative has shifted from "AI for everything" to "AI for specific workflows" with deep domain expertise.'
                },
                '30days': {
                    title: 'Pattern shift accelerating',
                    content: "Vertical AI winners are emerging with unprecedented clarity. Over the past month, we've tracked a 139% increase in vertical-specific discussions, with Harvey's legal AI and Abridge's healthcare platform both crossing $5B valuations. The narrative has evolved from 'will vertical work?' to 'which vertical is next?' - with fintech and manufacturing showing early signals. Notably, horizontal AI platforms are pivoting to vertical strategies, validating the thesis that domain expertise plus AI equals defensible moats."
                },
                '90days': {
                    title: 'Fundamental market restructuring complete',
                    content: "The past quarter witnessed the definitive end of horizontal AI euphoria and the rise of vertical specialization. What started as contrarian thinking in late April - with just 45 mentions across all podcasts - has become mainstream consensus at 287 mentions by late July. The inflection point came in Week 7 (early June) when Bessemer and NEA simultaneously announced vertical-focused funds. Three critical learnings have emerged: (1) Workflow ownership trumps technology superiority, (2) Compliance and industry-specific needs create natural moats, and (3) Customers pay 3-5x premiums for vertical solutions over horizontal alternatives. The market has spoken: generalist AI is a feature, specialist AI is a company."
                }
            },
            sources: {
                '7days': [
                    {
                        podcast: '20VC',
                        guest: 'Brad Gerstner',
                        timeAgo: '2 days ago',
                        duration: '45',
                        quote: "The winners in AI won't be the broadest platforms, they'll be the ones who own the workflow. Look at what's happening with Salesforce and ServiceNow - they're embedding AI into existing enterprise workflows where the data already lives. That's the moat."
                    },
                    {
                        podcast: 'Invest Like Best',
                        guest: 'Elad Gil',
                        timeAgo: '4 days ago',
                        duration: '38',
                        quote: "Vertical AI is where we're seeing actual revenue, not just usage. Legal, healthcare, finance - these verticals have specific compliance needs, data requirements, and workflow patterns that horizontal platforms can't address effectively."
                    }
                ],
                '30days': [
                    {
                        podcast: 'All-In Podcast',
                        guest: 'Chamath Palihapitiya',
                        timeAgo: '2 weeks ago',
                        duration: '52',
                        quote: "Harvey hitting $5B changed everything. Every vertical is now racing to find its AI champion. We're seeing a land grab where domain expertise matters more than model performance."
                    },
                    {
                        podcast: 'BG2Pod',
                        guest: 'Bill Gurley',
                        timeAgo: '3 weeks ago',
                        duration: '41',
                        quote: "The pivot from horizontal to vertical happened faster than anyone predicted. Companies that tried to be everything to everyone are now desperately trying to pick a vertical before it's too late."
                    }
                ],
                '90days': [
                    {
                        podcast: 'The Tim Ferriss Show',
                        guest: 'Reid Hoffman',
                        timeAgo: '2 months ago',
                        duration: '67',
                        quote: "In April, vertical AI was contrarian. By July, it's consensus. This is the fastest I've seen a market narrative flip in my entire career. The data is undeniable - vertical solutions have 3-5x better retention."
                    },
                    {
                        podcast: 'Acquired',
                        guest: 'Special Episode',
                        timeAgo: '6 weeks ago',
                        duration: '89',
                        quote: "The June inflection point when Bessemer and NEA announced vertical funds was the moment everyone realized horizontal AI was dead. It's not about the technology anymore, it's about owning the customer workflow."
                    }
                ]
            }
        }
    },
    // Default result for unmatched queries
    default: {
        confidence: '89%',
        discussions: 14,
        synthesis: {
            title: 'Strong consensus forming',
            content: 'Vertical AI applications with proprietary data moats are seeing 2-3x better retention than horizontal plays. The narrative has shifted from "AI for everything" to "AI for specific workflows" with deep domain expertise.'
        },
        sources: [
            {
                podcast: '20VC',
                guest: 'Brad Gerstner',
                timeAgo: '2 days ago',
                duration: '45',
                quote: "The winners in AI won't be the broadest platforms, they'll be the ones who own the workflow. Look at what's happening with Salesforce and ServiceNow - they're embedding AI into existing enterprise workflows where the data already lives. That's the moat."
            },
            {
                podcast: 'Invest Like Best',
                guest: 'Elad Gil',
                timeAgo: '4 days ago',
                duration: '38',
                quote: "Vertical AI is where we're seeing actual revenue, not just usage. Legal, healthcare, finance - these verticals have specific compliance needs, data requirements, and workflow patterns that horizontal platforms can't address effectively."
            }
        ]
    }
},
};

// Export for compatibility
window.masterData = window.unifiedData; // Alias for transition period

console.log('Unified data loaded successfully - July 25, 2025');
console.log('Data version:', window.unifiedData.meta.version);
console.log('Total topics:', Object.keys(window.unifiedData.narrativePulse.topics).length);
console.log('Total briefings:', window.unifiedData.priorityBriefings.items.length);
console.log('Total feed items:', window.unifiedData.narrativeFeed.items.length);
console.log('Intelligence brief loaded:', window.unifiedData.intelligenceBrief ? 'Yes' : 'No');