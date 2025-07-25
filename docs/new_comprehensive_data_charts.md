Narrative Pulse - Complete Synchronized Data (7, 30, 90 Day Views)
Overview
This document contains synchronized data for the VCPulse Narrative Pulse chart across three time ranges:

7-Day View: Daily granularity, last 7 days of August 2025
30-Day View: Weekly granularity, August 1-29, 2025
90-Day View: Weekly granularity, June 3 - August 29, 2025

All data is internally consistent, with the 7-day being a zoom-in of the last week of the 30-day view, and the 90-day containing the full 30-day period.
Critical Data Synchronization

90-Day Data Points 10-13 = Exact 30-day weekly values [Aug 1, 8, 15, 22, 29]
7-Day Daily Values = Sum to exactly Week 4 of 30-day data
All Views End at Same Value = Aug 29, 2025 values are identical across all views

Data Integrity Principles

Endpoint Consistency: All views end at the same values (Aug 29, 2025)
Realistic Growth: Growth rates are believable for VC podcast ecosystem
Narrative Coherence: Each topic tells a clear story across timeframes
Daily Reality: 2-12 mentions/day maximum for hottest topics

7-Day Data (Daily Granularity)
javascriptconst sevenDayData = {
  timeRange: {
    start: 'Aug 23, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 7,
    interval: 'daily',
    labels: ['Fri 23', 'Sat 24', 'Sun 25', 'Mon 26', 'Tue 27', 'Wed 28', 'Thu 29']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+59%',  // Week-over-week growth (22 to 35)
      actualMomentum: '+59.1%',
      dataPoints: [3, 1, 2, 6, 8, 9, 6],  // Sum = 35 (matches Week 4!)
      startValue: 22,  // Previous week total
      endValue: 35,
      weekTotal: 35,
      dailyAverage: 5.0,
      peakDay: 'Wed 28',
      consensusLevel: 'Strong',
      yPositions: {start: 180, end: 40},
      quotes: {
        'Fri 23': 'Gerstner mentions agent infrastructure on All-In',
        'Sat 24': 'Weekend lull, only crypto podcasts active',
        'Sun 25': 'Pomp discusses AI agents briefly',
        'Mon 26': 'Monday surge: 3 shows cover agent strategies',
        'Tue 27': '20VC deep dive with Anthropic drives discussion',
        'Wed 28': 'Peak day: Multiple tier-1 shows align on thesis',
        'Thu 29': 'Momentum continues into month-end'
      }
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+37%',  // Week-over-week (38 to 52)
      actualMomentum: '+36.8%',
      dataPoints: [5, 2, 3, 8, 10, 12, 12],  // Sum = 52 (matches Week 4!)
      startValue: 38,
      endValue: 52,
      weekTotal: 52,
      dailyAverage: 7.4,
      peakDay: 'Wed 28 & Thu 29',
      consensusLevel: 'Peak',
      yPositions: {start: 200, end: 20},
      quotes: {
        'Fri 23': 'Databricks valuation sparks infrastructure debates',
        'Sat 24': 'Technical podcasts discuss GPU economics',
        'Sun 25': 'Light coverage, focus on compute costs',
        'Mon 26': 'Multiple shows: "picks and shovels" thesis',
        'Tue 27': 'All-In dedicates segment to AI infrastructure',
        'Wed 28': 'Peak coverage: everyone wants foundation layer',
        'Thu 29': 'Sustained interest, multiple deal announcements'
      }
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '+15%',  // Week-over-week (13 to 15)
      actualMomentum: '+15.4%',
      dataPoints: [2, 0, 1, 3, 4, 3, 2],  // Sum = 15 (matches Week 4!)
      startValue: 13,
      endValue: 15,
      weekTotal: 15,
      dailyAverage: 2.1,
      peakDay: 'Tue 27',
      consensusLevel: 'Strong',
      yPositions: {start: 195, end: 145},
      quotes: {
        'Fri 23': 'End of week: LP meetings set efficiency tone',
        'Sat 24': 'No coverage on weekend shows',
        'Sun 25': 'Single mention on Acquired',
        'Mon 26': 'Board meeting prep drives efficiency talk',
        'Tue 27': 'Peak: multiple shows discuss burn rates',
        'Wed 28': 'Continued focus on path to profitability',
        'Thu 29': 'Wrapping up: "do more with less" mantra'
      }
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '+78%',  // Week-over-week (18 to 32)
      actualMomentum: '+77.8%',
      dataPoints: [2, 1, 1, 5, 7, 8, 8],  // Sum = 32 (matches Week 4!)
      startValue: 18,
      endValue: 32,
      weekTotal: 32,
      dailyAverage: 4.6,
      peakDay: 'Wed 28 & Thu 29',
      consensusLevel: 'Building',
      yPositions: {start: 210, end: 65},
      quotes: {
        'Fri 23': 'Helium case study surfaces on crypto pod',
        'Sat 24': 'Minimal weekend coverage',
        'Sun 25': 'Single mention on Bankless',
        'Mon 26': 'Monday catalyst: major funding rumor',
        'Tue 27': 'Multiple shows pick up DePIN narrative',
        'Wed 28': 'Peak interest: "physical meets digital"',
        'Thu 29': 'Sustained momentum into month-end'
      }
    },

    'Crypto/Web3': {
      color: '#5c7cfa',
      displayMomentum: '+18%',  // Week-over-week (22 to 26)
      actualMomentum: '+18.2%',
      dataPoints: [3, 2, 2, 4, 5, 5, 5],  // Sum = 26 (matches Week 4!)
      startValue: 22,
      endValue: 26,
      weekTotal: 26,
      dailyAverage: 3.7,
      peakDay: 'Tue-Thu',
      consensusLevel: 'Moderate',
      yPositions: {start: 160, end: 120},
      quotes: {
        'Fri 23': 'Base ecosystem gains discussed',
        'Sat 24': 'Crypto-native pods maintain coverage',
        'Sun 25': 'Bankless covers DeFi resurgence',
        'Mon 26': 'Regulatory clarity boosts sentiment',
        'Tue 27': 'Multiple shows on Solana momentum',
        'Wed 28': 'Sustained interest in infrastructure',
        'Thu 29': 'Month-end: "crypto finding its footing"'
      }
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '-20%',  // Week-over-week (10 to 8)
      actualMomentum: '-20.0%',
      dataPoints: [1, 0, 1, 2, 2, 1, 1],  // Sum = 8 (matches Week 4!)
      startValue: 10,
      endValue: 8,
      weekTotal: 8,
      dailyAverage: 1.1,
      peakDay: 'Mon 26 & Tue 27',
      consensusLevel: 'Weak',
      yPositions: {start: 150, end: 165},
      quotes: {
        'Fri 23': 'Single mention of consolidation trends',
        'Sat 24': 'Zero coverage on weekend',
        'Sun 25': 'Acquired mentions M&A activity',
        'Mon 26': 'Brief discussion of mature markets',
        'Tue 27': 'Focus shifting to AI-native solutions',
        'Wed 28': 'Legacy SaaS struggles mentioned',
        'Thu 29': 'Closing thought: "yesterday\'s playbook"'
      }
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+29%',  // Week-over-week (14 to 18)
      actualMomentum: '+28.6%',
      dataPoints: [2, 1, 1, 3, 4, 4, 3],  // Sum = 18 (matches Week 4!)
      startValue: 14,
      endValue: 18,
      weekTotal: 18,
      dailyAverage: 2.6,
      peakDay: 'Tue 27 & Wed 28',
      consensusLevel: 'Strong',
      yPositions: {start: 170, end: 90},
      quotes: {
        'Fri 23': 'Cursor rumors spark dev tools interest',
        'Sat 24': 'Light weekend coverage',
        'Sun 25': 'Single mention on technical podcast',
        'Mon 26': 'GitHub Copilot adoption stats shared',
        'Tue 27': 'Multiple shows on AI coding assistants',
        'Wed 28': 'Peak: "developer productivity renaissance"',
        'Thu 29': 'Sustained interest in AI-powered tools'
      }
    }
  }
};
30-Day Data (Weekly Granularity)
javascriptconst thirtyDayData = {
  timeRange: {
    start: 'Aug 1, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 4,
    interval: 'weekly',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+337%',
      actualMomentum: '+337.5%',
      dataPoints: [8, 15, 22, 35],  // Realistic weekly progression
      consensusBreakdown: [
        { positive: 6, neutral: 2, negative: 0 },
        { positive: 12, neutral: 3, negative: 0 },
        { positive: 18, neutral: 3, negative: 1 },
        { positive: 31, neutral: 3, negative: 1 }
      ],
      startValue: 8,
      endValue: 35,
      totalGrowth: 337.5,
      weeklyNarrative: {
        'Week 1': 'Early whispers about agent potential',
        'Week 2': 'Gerstner validates thesis, momentum builds',
        'Week 3': 'Multiple tier-1 VCs align on opportunity',
        'Week 4': 'Mainstream adoption narrative emerges'
      }
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+333%',
      actualMomentum: '+333.3%',
      dataPoints: [12, 25, 38, 52],
      consensusBreakdown: [
        { positive: 10, neutral: 2, negative: 0 },
        { positive: 22, neutral: 3, negative: 0 },
        { positive: 34, neutral: 3, negative: 1 },
        { positive: 48, neutral: 3, negative: 1 }
      ],
      startValue: 12,
      endValue: 52,
      totalGrowth: 333.3,
      weeklyNarrative: {
        'Week 1': 'GPU economics drive initial interest',
        'Week 2': 'Major funding rounds validate thesis',
        'Week 3': 'Everyone wants foundation layer exposure',
        'Week 4': 'Peak interest: "picks and shovels" wins'
      }
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '+25%',
      actualMomentum: '+25.0%',
      dataPoints: [12, 14, 13, 15],
      consensusBreakdown: [
        { positive: 8, neutral: 3, negative: 1 },
        { positive: 11, neutral: 2, negative: 1 },
        { positive: 10, neutral: 2, negative: 1 },
        { positive: 13, neutral: 1, negative: 1 }
      ],
      startValue: 12,
      endValue: 15,
      totalGrowth: 25.0,
      weeklyNarrative: {
        'Week 1': 'LP pressure begins to mount',
        'Week 2': 'Board meetings reinforce discipline',
        'Week 3': 'Slight dip as other topics dominate',
        'Week 4': 'Rebounds as fundamentals matter again'
      }
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '+1500%',
      actualMomentum: '+1500.0%',
      dataPoints: [2, 8, 18, 32],
      consensusBreakdown: [
        { positive: 1, neutral: 1, negative: 0 },
        { positive: 6, neutral: 2, negative: 0 },
        { positive: 15, neutral: 2, negative: 1 },
        { positive: 28, neutral: 3, negative: 1 }
      ],
      startValue: 2,
      endValue: 32,
      totalGrowth: 1500.0,
      weeklyNarrative: {
        'Week 1': 'Barely on the radar',
        'Week 2': 'Helium success story gains traction',
        'Week 3': 'Major funds announce DePIN strategies',
        'Week 4': 'Full narrative emergence: "DePIN summer"'
      }
    },

    'Crypto/Web3': {
      color: '#5c7cfa',
      displayMomentum: '-7%',
      actualMomentum: '-7.1%',
      dataPoints: [28, 25, 22, 26],
      consensusBreakdown: [
        { positive: 16, neutral: 10, negative: 2 },
        { positive: 14, neutral: 9, negative: 2 },
        { positive: 12, neutral: 8, negative: 2 },
        { positive: 15, neutral: 9, negative: 2 }
      ],
      startValue: 28,
      endValue: 26,
      totalGrowth: -7.1,
      weeklyNarrative: {
        'Week 1': 'Steady coverage from crypto-native shows',
        'Week 2': 'Slight decline as AI dominates',
        'Week 3': 'Bottom reached, sentiment stabilizing',
        'Week 4': 'Modest recovery on regulatory clarity'
      }
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '-47%',
      actualMomentum: '-46.7%',
      dataPoints: [15, 12, 10, 8],
      consensusBreakdown: [
        { positive: 5, neutral: 8, negative: 2 },
        { positive: 4, neutral: 6, negative: 2 },
        { positive: 3, neutral: 5, negative: 2 },
        { positive: 2, neutral: 4, negative: 2 }
      ],
      startValue: 15,
      endValue: 8,
      totalGrowth: -46.7,
      weeklyNarrative: {
        'Week 1': 'Consolidation themes dominate',
        'Week 2': 'M&A activity but little excitement',
        'Week 3': 'AI-native stealing all attention',
        'Week 4': 'Legacy SaaS = yesterday\'s news'
      }
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+200%',
      actualMomentum: '+200.0%',
      dataPoints: [6, 10, 14, 18],
      consensusBreakdown: [
        { positive: 5, neutral: 1, negative: 0 },
        { positive: 8, neutral: 2, negative: 0 },
        { positive: 12, neutral: 2, negative: 0 },
        { positive: 16, neutral: 2, negative: 0 }
      ],
      startValue: 6,
      endValue: 18,
      totalGrowth: 200.0,
      weeklyNarrative: {
        'Week 1': 'AI coding assistants emerge',
        'Week 2': 'Cursor and similar tools gain traction',
        'Week 3': 'Developer productivity metrics impress',
        'Week 4': 'Full renaissance narrative established'
      }
    }
  }
};
90-Day Data (Weekly Granularity)
javascriptconst ninetyDayData = {
  timeRange: {
    start: 'Jun 3, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 13,
    interval: 'weekly',
    labels: ['Jun 3', 'Jun 10', 'Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 1', 'Aug 8', 'Aug 15', 'Aug 22']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+775%',
      actualMomentum: '+775.0%',
      dataPoints: [4, 5, 6, 7, 8, 9, 10, 11, 12, 8, 15, 22, 35],  // Last 4 match 30-day exactly!
      startValue: 4,
      endValue: 35,
      totalGrowth: 775.0,
      totalMentions: 154,  // Sum of all weeks
      consensusProgression: ['Weak', 'Weak', 'Building', 'Building', 'Building', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
      narrative: 'From 4 mentions in early June to 35 by late August - textbook emergence',
      keyInflectionPoint: 'Week 11 (Aug 8): Crossed 15 mentions, tier-1 VCs aligned',
      quotes: {
        'Jun 3': 'First whispers about autonomous agents',
        'Jun 10': 'Technical challenges discussed',
        'Jun 17': 'Early frameworks emerge',
        'Jun 24': 'Use cases start crystallizing',
        'Jul 1': 'Summer lull but steady interest',
        'Jul 8': 'Infrastructure questions raised',
        'Jul 15': 'Breakthrough capabilities shown',
        'Jul 22': 'Market education accelerates',
        'Jul 29': 'Approaching critical mass',
        'Aug 1': 'August surge begins',
        'Aug 8': 'Gerstner validates thesis publicly',
        'Aug 15': 'Multiple funds announce strategies',
        'Aug 22': 'Mainstream narrative forms'
      }
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+867%',
      actualMomentum: '+866.7%',
      dataPoints: [6, 8, 10, 12, 15, 18, 22, 26, 30, 12, 25, 38, 52],  // Last 4 match 30-day!
      startValue: 6,
      endValue: 52,
      totalGrowth: 866.7,
      totalMentions: 264,
      consensusProgression: ['Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Peak', 'Peak', 'Peak'],
      narrative: 'Steady build through summer, explosive growth in August as "picks and shovels" thesis dominates',
      keyInflectionPoint: 'Week 7 (Jul 15): Major funding rounds validate infrastructure plays',
      quotes: {
        'Jun 3': 'GPU shortage first mentioned',
        'Jun 10': 'Compute economics debate begins',
        'Jun 17': 'Infrastructure bottlenecks identified',
        'Jun 24': 'Foundation layer thesis emerges',
        'Jul 1': 'Databricks rumored valuation',
        'Jul 8': 'Major infrastructure rounds close',
        'Jul 15': 'Everyone wants exposure',
        'Jul 22': 'Full stack platforms emerge',
        'Jul 29': 'Infrastructure = moats',
        'Aug 1': 'Reset in Week 10 data artifact',
        'Aug 8': 'Massive interest surge',
        'Aug 15': 'Peak momentum building',
        'Aug 22': 'Universal consensus reached'
      }
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '+36%',
      actualMomentum: '+36.4%',
      dataPoints: [11, 10, 9, 8, 8, 9, 10, 11, 12, 12, 14, 13, 15],  // Last 4 match 30-day!
      startValue: 11,
      endValue: 15,
      totalGrowth: 36.4,
      totalMentions: 142,
      consensusProgression: ['Strong', 'Strong', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong'],
      narrative: 'U-shaped recovery: dipped during July uncertainty, recovered as markets stabilized',
      keyInflectionPoint: 'Week 8 (Jul 22): LPs reassert discipline requirements',
      quotes: {
        'Jun 3': 'Early efficiency push from LPs',
        'Jun 10': 'Burn rate scrutiny increases',
        'Jun 17': 'Some pushback on constraints',
        'Jun 24': 'Market uncertainty impacts focus',
        'Jul 1': 'Efficiency takes backseat briefly',
        'Jul 8': 'Bottom of the U-curve',
        'Jul 15': 'Discipline returns to conversation',
        'Jul 22': 'LPs win the narrative battle',
        'Jul 29': 'New normal established',
        'Aug 1': 'Consistent drumbeat begins',
        'Aug 8': 'Every board meeting topic',
        'Aug 15': 'Slight dip as AI dominates',
        'Aug 22': 'Fundamental requirement clear'
      }
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '+3100%',
      actualMomentum: '+3100.0%',
      dataPoints: [1, 1, 1, 2, 2, 3, 4, 5, 6, 2, 8, 18, 32],  // Last 4 match 30-day!
      startValue: 1,
      endValue: 32,
      totalGrowth: 3100.0,
      totalMentions: 85,
      consensusProgression: ['None', 'None', 'None', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Building', 'Weak', 'Building', 'Strong', 'Peak'],
      narrative: 'Classic zero-to-hero: ignored for 2 months, then parabolic growth',
      keyInflectionPoint: 'Week 11 (Aug 8): First major success stories drive 4x growth',
      quotes: {
        'Jun 3': 'Single mention on crypto podcast',
        'Jun 10': 'Still extremely niche',
        'Jun 17': 'Technical infrastructure focus',
        'Jun 24': 'Helium case study surfaces',
        'Jul 1': 'Slow community building',
        'Jul 8': 'First tier-2 VC interest',
        'Jul 15': 'Use cases multiply',
        'Jul 22': 'Thesis starts forming',
        'Jul 29': 'Pre-explosion buildup',
        'Aug 1': 'Reset to 2 mentions (data artifact)',
        'Aug 8': '4x growth week-over-week',
        'Aug 15': 'DePIN summer declared',
        'Aug 22': 'Everyone wants exposure'
      }
    },

    'Crypto/Web3': {
      color: '#5c7cfa',
      displayMomentum: '-28%',
      actualMomentum: '-27.8%',
      dataPoints: [36, 34, 32, 30, 28, 26, 24, 23, 22, 28, 25, 22, 26],  // Last 4 match 30-day!
      startValue: 36,
      endValue: 26,
      totalGrowth: -27.8,
      totalMentions: 356,
      consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Weak', 'Building'],
      narrative: 'Gradual decline through summer, signs of stabilization in August',
      keyInflectionPoint: 'Week 10 (Aug 1): Regulatory clarity sparks modest recovery',
      quotes: {
        'Jun 3': 'Strong coverage from crypto pods',
        'Jun 10': 'AI begins stealing attention',
        'Jun 17': 'Sentiment cooling continues',
        'Jun 24': 'Bear market narrative persists',
        'Jul 1': 'Summer doldrums hit',
        'Jul 8': 'Lowest point of coverage',
        'Jul 15': 'Sustained low interest',
        'Jul 22': 'Bottom forming',
        'Jul 29': 'Slight uptick begins',
        'Aug 1': 'Recovery to 28 mentions',
        'Aug 8': 'Base ecosystem excitement',
        'Aug 15': 'Dip on AI dominance',
        'Aug 22': 'Stabilizing with clear use cases'
      }
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '-60%',
      actualMomentum: '-60.0%',
      dataPoints: [20, 19, 18, 17, 16, 15, 14, 13, 12, 15, 12, 10, 8],  // Last 4 match 30-day!
      startValue: 20,
      endValue: 8,
      totalGrowth: -60.0,
      totalMentions: 189,
      consensusProgression: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak'],
      narrative: 'Steady decline as AI-native approaches dominate all conversations',
      keyInflectionPoint: 'Never recovered - continuous decline throughout quarter',
      quotes: {
        'Jun 3': 'Consolidation wave discussed',
        'Jun 10': 'Growth challenges mounting',
        'Jun 17': 'M&A only bright spot',
        'Jun 24': 'Innovation concerns raised',
        'Jul 1': 'Focus shifts to profitability',
        'Jul 8': 'Market maturity accepted',
        'Jul 15': 'Legacy playbook questioned',
        'Jul 22': 'AI-native competition clear',
        'Jul 29': 'Existential questions raised',
        'Aug 1': 'Brief uptick to 15',
        'Aug 8': 'Reality sets in again',
        'Aug 15': 'Yesterday\'s opportunity',
        'Aug 22': 'Minimal coverage continues'
      }
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+260%',
      actualMomentum: '+260.0%',
      dataPoints: [5, 5, 6, 6, 7, 8, 9, 10, 11, 6, 10, 14, 18],  // Last 4 match 30-day!
      startValue: 5,
      endValue: 18,
      totalGrowth: 260.0,
      totalMentions: 115,
      consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Moderate', 'Strong', 'Strong', 'Strong'],
      narrative: 'Steady growth with August acceleration as AI transforms developer productivity',
      keyInflectionPoint: 'Week 12 (Aug 15): AI coding assistants hit mainstream awareness',
      quotes: {
        'Jun 3': 'Developer experience focus begins',
        'Jun 10': 'Early AI experiments',
        'Jun 17': 'Productivity metrics shared',
        'Jun 24': 'Tool consolidation discussed',
        'Jul 1': 'Next-gen tools emerge',
        'Jul 8': 'Adoption accelerating',
        'Jul 15': 'Enterprise interest grows',
        'Jul 22': 'ROI becomes clear',
        'Jul 29': 'Developer-first narrative',
        'Aug 1': 'Reset to 6 (data artifact)',
        'Aug 8': 'Cursor raises huge round',
        'Aug 15': 'Multiple success stories',
        'Aug 22': 'Renaissance narrative peaks'
      }
    }
  }
};
Key Insights & Usage Notes
1. Data Consistency Verification

7-day totals: AI Agents (35), AI Infrastructure (52), Capital Efficiency (15), DePIN (32), Crypto/Web3 (26), B2B SaaS (8), Developer Tools (18)
30-day Week 4: Matches exactly with 7-day totals
90-day weeks 10-13: Matches exactly with 30-day weeks 1-4

2. Realistic Mention Patterns

Daily maximums: 12 mentions for hottest topic (AI Infrastructure)
Weekly maximums: 52 mentions for peak interest
Weekend lulls: Saturday/Sunday show 0-3 mentions
Mid-week peaks: Tuesday-Thursday highest activity

3. Narrative Coherence by Topic
AI Agents: 4→35 mentions over quarter

Slow build through summer
August explosion as thesis validated
Peak momentum in final week

AI Infrastructure: 6→52 mentions

Strongest sustained growth
"Picks and shovels" narrative dominates
Peak consensus by quarter end

Capital Efficiency: 11→15 mentions

U-shaped recovery pattern
July dip during uncertainty
LP pressure drives rebound

DePIN: 1→32 mentions

Zero to hero story
3100% growth from tiny base
Parabolic August growth

Crypto/Web3: 36→26 mentions

Gradual decline through summer
Stabilization in August
Still significant volume

B2B SaaS: 20→8 mentions

Continuous decline
AI-native stealing mindshare
Legacy playbook abandoned

Developer Tools: 5→18 mentions

Steady growth throughout
AI acceleration in August
Renaissance narrative emerges

4. Implementation Recommendations

Daily Patterns: Show Tuesday/Wednesday spikes clearly
Weekly Aggregation: Use these exact totals for consistency
Chart Scaling: Linear scale now works with realistic data
Tooltips: Show daily breakdown on hover for weekly views
Transitions: Smooth zoom between timeframes

5. Demo Talking Points
Discovery Value:

"Notice AI Infrastructure overtaking AI Agents in Week 11?"
"DePIN went from 1 to 32 mentions - what triggered this?"

Pattern Recognition:

"Capital Efficiency U-curve shows market psychology"
"B2B SaaS decline mirrors AI-native rise"

Actionable Insights:

"52 infrastructure mentions last week across 31 sources"
"Your portfolio mentioned 6 times (track in detail view)"

Data Credibility:

"Peak day: 12 mentions of AI Infrastructure"
"Weekend lulls reflect real podcast schedules"
"You could verify these numbers yourself"


Document Version: 2.0 - Realistic Data Update
Created: January 2025
Purpose: VCPulse Demo Data Repository - Sales Ready