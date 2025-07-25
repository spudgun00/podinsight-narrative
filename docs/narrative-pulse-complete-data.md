# Narrative Pulse - Complete Synchronized Data (7, 30, 90 Day Views)

## Overview
This document contains synchronized data for the VCPulse Narrative Pulse chart across three time ranges:
- **7-Day View**: Daily granularity, last 7 days of August 2025
- **30-Day View**: Weekly granularity, August 1-29, 2025 (existing data)
- **90-Day View**: Weekly granularity, June 3 - August 29, 2025

All data is internally consistent, with the 7-day being a zoom-in of the last week of the 30-day view, and the 90-day containing the full 30-day period.

## Critical Data Synchronization
- **90-Day Data Points 9-13** = Exact 30-day weekly values [Aug 1, 8, 15, 22, 29]
- **7-Day Daily Values** = Interpolated between Aug 22 and Aug 29 from 30-day data
- **All Views End at Same Value** = Aug 29, 2025 values are identical across all views

## Data Integrity Principles
1. **Endpoint Consistency**: All views end at the same values (Aug 29, 2025)
2. **Realistic Growth**: Growth rates are believable for VC market intelligence
3. **Narrative Coherence**: Each topic tells a clear story across timeframes
4. **Display vs Actual**: Some extreme values are capped for UI display

## 7-Day Data (Daily Granularity)

```javascript
const sevenDayData = {
  timeRange: {
    start: 'Aug 23, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 7,
    interval: 'daily',
    labels: ['Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+3.5%',  // 7-day growth
      actualMomentum: '+3.5%',
      dataPoints: [142, 143, 144, 145, 145, 146, 147],  // Interpolated from Aug 22 (142) to Aug 29 (147)
      startValue: 142,
      endValue: 147,
      totalGrowth: 3.5,
      consensusLevel: 'Strong',
      yPositions: {start: 180, end: 40},
      quotes: {
        'Aug 23': 'AI agents reaching inflection point',
        'Aug 24': 'Every startup needs an agent strategy',
        'Aug 25': 'Agents are the new SaaS',
        'Aug 26': 'Infrastructure layer maturing',
        'Aug 27': 'Enterprise adoption accelerating',
        'Aug 28': 'Agent-first architecture emerging',
        'Aug 29': 'Agents everywhere'
      }
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '+1.1%',
      actualMomentum: '+1.1%',
      dataPoints: [88, 88, 88, 89, 89, 89, 89],  // Interpolated from Aug 22 (88) to Aug 29 (89)
      startValue: 88,
      endValue: 89,
      totalGrowth: 1.1,
      consensusLevel: 'Strong',
      yPositions: {start: 195, end: 145},
      quotes: {
        'Aug 23': 'Burn rates under scrutiny',
        'Aug 24': 'Path to profitability matters',
        'Aug 25': 'Efficiency is the new growth',
        'Aug 26': 'Capital discipline rewarded',
        'Aug 27': 'Sustainable unit economics',
        'Aug 28': 'Do more with less',
        'Aug 29': 'Sustainable growth matters'
      }
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '+28.8%',
      actualMomentum: '+28.8%',
      dataPoints: [156, 165, 172, 180, 187, 194, 201],  // Interpolated from Aug 22 (156) to Aug 29 (201)
      startValue: 156,
      endValue: 201,
      totalGrowth: 28.8,
      consensusLevel: 'Peak',
      yPositions: {start: 210, end: 65},
      quotes: {
        'Aug 23': 'Physical infrastructure tokenization',
        'Aug 24': 'DePIN summer accelerating',
        'Aug 25': 'Infrastructure ownership revolution',
        'Aug 26': 'Decentralized networks scaling',
        'Aug 27': 'Real world assets on-chain',
        'Aug 28': 'DePIN infrastructure plays',
        'Aug 29': 'DePIN eating the world'
      }
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '+0%',
      actualMomentum: '+0%',
      dataPoints: [43, 43, 43, 43, 43, 43, 43],  // Interpolated from Aug 22 (43) to Aug 29 (43)
      startValue: 43,
      endValue: 43,
      totalGrowth: 0,
      consensusLevel: 'Weak',
      yPositions: {start: 150, end: 165},
      quotes: {
        'Aug 23': 'Market consolidation continues',
        'Aug 24': 'Focus on fundamentals',
        'Aug 25': 'Mature market dynamics',
        'Aug 26': 'M&A activity increasing',
        'Aug 27': 'Enterprise budgets tightening',
        'Aug 28': 'Steady state growth',
        'Aug 29': 'Consolidation phase'
      }
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+46.9%',
      actualMomentum: '+46.9%',
      dataPoints: [64, 71, 77, 83, 88, 91, 94],  // Interpolated from Aug 22 (64) to Aug 29 (94)
      startValue: 64,
      endValue: 94,
      totalGrowth: 46.9,
      consensusLevel: 'Strong',
      yPositions: {start: 170, end: 90},
      quotes: {
        'Aug 23': 'Developer experience renaissance',
        'Aug 24': 'AI-powered dev tools surge',
        'Aug 25': 'Productivity gains realized',
        'Aug 26': 'Tool consolidation happening',
        'Aug 27': 'DevEx investment priority',
        'Aug 28': 'Next-gen tooling emerges',
        'Aug 29': 'DevEx renaissance'
      }
    },

    'Vertical SaaS': {
      color: '#7d9c8d',
      displayMomentum: '+55.6%',
      actualMomentum: '+55.6%',
      dataPoints: [72, 80, 88, 95, 102, 107, 112],  // Interpolated from Aug 22 (72) to Aug 29 (112)
      startValue: 72,
      endValue: 112,
      totalGrowth: 55.6,
      consensusLevel: 'Strong',
      yPositions: {start: 185, end: 110},
      quotes: {
        'Aug 23': 'Industry-specific solutions win',
        'Aug 24': 'Deep domain expertise valued',
        'Aug 25': 'Vertical integration accelerates',
        'Aug 26': 'Niche markets expanding',
        'Aug 27': 'Specialization beats generalization',
        'Aug 28': 'Vertical AI applications',
        'Aug 29': 'Niche domination'
      }
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+13%',
      actualMomentum: '+13%',
      dataPoints: [138, 142, 145, 148, 151, 154, 156],  // Interpolated from Aug 22 (138) to Aug 29 (156)
      startValue: 138,
      endValue: 156,
      totalGrowth: 13.0,
      consensusLevel: 'Peak',
      yPositions: {start: 200, end: 70},
      quotes: {
        'Aug 23': 'GPU economics driving decisions',
        'Aug 24': 'Infrastructure layer critical',
        'Aug 25': 'Compute scarcity narrative',
        'Aug 26': 'Model serving at scale',
        'Aug 27': 'Infrastructure moats emerging',
        'Aug 28': 'Full stack AI platforms',
        'Aug 29': 'Picks and shovels'
      }
    }
  }
};
```

## 30-Day Data (Weekly Granularity)
*Note: This is the existing corrected data from the previous document*

```javascript
const thirtyDayData = {
  timeRange: {
    start: 'Aug 1, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 5,
    interval: 'weekly',
    labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+85%',
      actualMomentum: '+86.1%',
      dataPoints: [79, 105, 128, 142, 147],
      consensusBreakdown: [
        { positive: 70, neutral: 7, negative: 2 },
        { positive: 93, neutral: 10, negative: 2 },
        { positive: 115, neutral: 11, negative: 2 },
        { positive: 127, neutral: 13, negative: 2 },
        { positive: 132, neutral: 12, negative: 3 }
      ],
      startValue: 79,
      endValue: 147,
      totalGrowth: 86.1
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '+17%',
      actualMomentum: '+17.1%',
      dataPoints: [76, 82, 87, 88, 89],
      consensusBreakdown: [
        { positive: 38, neutral: 30, negative: 8 },
        { positive: 49, neutral: 28, negative: 5 },
        { positive: 61, neutral: 22, negative: 4 },
        { positive: 71, neutral: 14, negative: 3 },
        { positive: 76, neutral: 11, negative: 2 }
      ],
      startValue: 76,
      endValue: 89,
      totalGrowth: 17.1
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '+190%',  // Capped for UI
      actualMomentum: '+1727%',
      dataPoints: [11, 34, 89, 156, 201],
      consensusBreakdown: [
        { positive: 3, neutral: 5, negative: 3 },
        { positive: 17, neutral: 12, negative: 5 },
        { positive: 62, neutral: 22, negative: 5 },
        { positive: 117, neutral: 35, negative: 4 },
        { positive: 181, neutral: 18, negative: 2 }
      ],
      startValue: 11,
      endValue: 201,
      totalGrowth: 1727.3
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '+3%',
      actualMomentum: '+7.5%',
      dataPoints: [40, 41, 42, 43, 43],
      consensusBreakdown: [
        { positive: 16, neutral: 20, negative: 4 },
        { positive: 16, neutral: 21, negative: 4 },
        { positive: 13, neutral: 25, negative: 4 },
        { positive: 13, neutral: 26, negative: 4 },
        { positive: 13, neutral: 26, negative: 4 }
      ],
      startValue: 40,
      endValue: 43,
      totalGrowth: 7.5
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+47%',
      actualMomentum: '+124%',
      dataPoints: [42, 44, 48, 64, 94],
      consensusBreakdown: [
        { positive: 28, neutral: 12, negative: 2 },
        { positive: 32, neutral: 10, negative: 2 },
        { positive: 38, neutral: 8, negative: 2 },
        { positive: 52, neutral: 10, negative: 2 },
        { positive: 82, neutral: 10, negative: 2 }
      ],
      startValue: 42,
      endValue: 94,
      totalGrowth: 123.8
    },

    'Vertical SaaS': {
      color: '#7d9c8d',
      displayMomentum: '+65%',
      actualMomentum: '+180%',
      dataPoints: [40, 44, 52, 72, 112],
      consensusBreakdown: [
        { positive: 22, neutral: 14, negative: 4 },
        { positive: 28, neutral: 12, negative: 4 },
        { positive: 40, neutral: 10, negative: 2 },
        { positive: 60, neutral: 10, negative: 2 },
        { positive: 98, neutral: 12, negative: 2 }
      ],
      startValue: 40,
      endValue: 112,
      totalGrowth: 180.0
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+92%',
      actualMomentum: '+169%',
      dataPoints: [58, 76, 100, 138, 156],
      consensusBreakdown: [
        { positive: 38, neutral: 16, negative: 4 },
        { positive: 56, neutral: 16, negative: 4 },
        { positive: 82, neutral: 14, negative: 4 },
        { positive: 114, neutral: 20, negative: 4 },
        { positive: 142, neutral: 12, negative: 2 }
      ],
      startValue: 58,
      endValue: 156,
      totalGrowth: 169.0
    }
  }
};
```

## 90-Day Data (Weekly Granularity)

```javascript
const ninetyDayData = {
  timeRange: {
    start: 'Jun 3, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 13,
    interval: 'weekly',
    labels: ['Jun 3', 'Jun 10', 'Jun 17', 'Jun 24', 'Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 5', 'Aug 12', 'Aug 19', 'Aug 26']
  },

  topics: {
    'AI Agents': {
      color: '#4a7c59',
      displayMomentum: '+268%',
      actualMomentum: '+267.5%',
      dataPoints: [40, 48, 55, 62, 70, 74, 76, 78, 79, 105, 128, 142, 147],  // Last 5 match 30-day exactly
      startValue: 40,
      endValue: 147,
      totalGrowth: 267.5,
      consensusProgression: ['Building', 'Building', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong'],
      narrative: 'Steady growth throughout the quarter, accelerating in August',
      quotes: {
        'Jun 3': 'AI automation potential emerging',
        'Jun 10': 'Early agent experiments',
        'Jun 17': 'Agent frameworks maturing',
        'Jun 24': 'Enterprise interest growing',
        'Jul 1': 'Agent use cases expanding',
        'Jul 8': 'Infrastructure challenges',
        'Jul 15': 'Breakthrough in capabilities',
        'Jul 22': 'Market education phase',
        'Jul 29': 'Tipping point approaching',
        'Aug 5': 'Agents are the new apps',
        'Aug 12': 'Vertical AI dominance',
        'Aug 19': 'Every company needs agents',
        'Aug 26': 'Agent-first architecture'
      }
    },

    'Capital Efficiency': {
      color: '#f4a261',
      displayMomentum: '-1%',  // Shows recovery story
      actualMomentum: '-1.1%',
      dataPoints: [90, 85, 75, 68, 62, 65, 70, 74, 76, 82, 87, 88, 89],  // Last 5 match 30-day exactly
      startValue: 90,
      endValue: 89,
      totalGrowth: -1.1,
      consensusProgression: ['Strong', 'Strong', 'Moderate', 'Moderate', 'Weak', 'Weak', 'Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
      narrative: 'Dipped in early July during market uncertainty, now recovering strongly',
      quotes: {
        'Jun 3': 'Growth at all costs ending',
        'Jun 10': 'Profitability timelines scrutinized',
        'Jun 17': 'Burn rate concerns rising',
        'Jun 24': 'Market correction fears',
        'Jul 1': 'Efficiency mandates everywhere',
        'Jul 8': 'Survival mode activated',
        'Jul 15': 'Signs of stabilization',
        'Jul 22': 'New playbook emerging',
        'Jul 29': 'Efficiency drives valuation',
        'Aug 5': 'Efficiency is the new growth',
        'Aug 12': 'Capital discipline wins',
        'Aug 19': 'Sustainable growth focus',
        'Aug 26': 'New reality accepted'
      }
    },

    'DePIN': {
      color: '#5a6c8c',
      displayMomentum: '>+500%',  // Capped for UI sanity
      actualMomentum: '+10050%',  // From 2 to 201
      dataPoints: [2, 3, 3, 4, 5, 6, 8, 10, 11, 34, 89, 156, 201],  // Last 5 match 30-day exactly
      startValue: 2,
      endValue: 201,
      totalGrowth: 10050.0,
      consensusProgression: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Building', 'Building', 'Moderate', 'Strong', 'Peak', 'Peak'],
      narrative: 'Emerged from obscurity in June, explosive growth in August',
      quotes: {
        'Jun 3': 'Niche infrastructure play',
        'Jun 10': 'Early experiments',
        'Jun 17': 'Technical challenges',
        'Jun 24': 'Use cases emerging',
        'Jul 1': 'Community forming',
        'Jul 8': 'First success stories',
        'Jul 15': 'Infrastructure potential seen',
        'Jul 22': 'Investor interest sparked',
        'Jul 29': 'DePIN thesis forming',
        'Aug 5': 'DePIN summer begins',
        'Aug 12': 'Physical meets digital',
        'Aug 19': 'Infrastructure gold rush',
        'Aug 26': 'DePIN everywhere'
      }
    },

    'B2B SaaS': {
      color: '#c77d7d',
      displayMomentum: '+2%',
      actualMomentum: '+2.4%',
      dataPoints: [42, 41, 40, 41, 42, 40, 41, 40, 40, 41, 42, 43, 43],  // Last 5 match 30-day exactly
      startValue: 42,
      endValue: 43,
      totalGrowth: 2.4,
      consensusProgression: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak'],
      narrative: 'Mature market with minimal growth, slight uptick in late August',
      quotes: {
        'Jun 3': 'Market saturation concerns',
        'Jun 10': 'Consolidation wave begins',
        'Jun 17': 'Growth challenges persist',
        'Jun 24': 'M&A activity increasing',
        'Jul 1': 'Focus on profitability',
        'Jul 8': 'Market maturity evident',
        'Jul 15': 'Innovation slowing',
        'Jul 22': 'Incumbents dominate',
        'Jul 29': 'Steady state reached',
        'Aug 5': 'Slight recovery signs',
        'Aug 12': 'Enterprise demand stable',
        'Aug 19': 'Fundamentals matter',
        'Aug 26': 'Consolidation continues'
      }
    },

    'Developer Tools': {
      color: '#8a68a8',
      displayMomentum: '+213%',
      actualMomentum: '+213.3%',
      dataPoints: [30, 32, 34, 36, 38, 39, 40, 41, 42, 44, 48, 64, 94],  // Last 5 match 30-day exactly
      startValue: 30,
      endValue: 94,
      totalGrowth: 213.3,
      consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong'],
      narrative: 'Steady growth accelerating with AI-powered developer tools',
      quotes: {
        'Jun 3': 'Developer productivity focus',
        'Jun 10': 'AI coding assistants emerge',
        'Jun 17': 'Tool consolidation trends',
        'Jun 24': 'DevEx investment priority',
        'Jul 1': 'Next-gen tools launched',
        'Jul 8': 'Adoption accelerating',
        'Jul 15': 'Productivity gains proven',
        'Jul 22': 'Enterprise adoption begins',
        'Jul 29': 'Tools for builders',
        'Aug 5': 'AI-powered surge',
        'Aug 12': 'Developer first approach',
        'Aug 19': 'Tools explosion',
        'Aug 26': 'DevEx renaissance'
      }
    },

    'Vertical SaaS': {
      color: '#7d9c8d',
      displayMomentum: '+280%',
      actualMomentum: '+280.0%',
      dataPoints: [30, 32, 34, 36, 37, 38, 39, 40, 40, 44, 52, 72, 112],  // Last 5 match 30-day exactly
      startValue: 30,
      endValue: 112,
      totalGrowth: 280.0,
      consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong'],
      narrative: 'Slow start, explosive growth as AI enables industry-specific solutions',
      quotes: {
        'Jun 3': 'Niche markets identified',
        'Jun 10': 'Domain expertise valued',
        'Jun 17': 'Early vertical plays',
        'Jun 24': 'Industry-specific needs',
        'Jul 1': 'Specialization thesis',
        'Jul 8': 'First success stories',
        'Jul 15': 'Vertical AI potential',
        'Jul 22': 'Market education phase',
        'Jul 29': 'Industry specific wins',
        'Aug 5': 'Vertical explosion begins',
        'Aug 12': 'Specialization wins',
        'Aug 19': 'Deep domain expertise',
        'Aug 26': 'Niche domination'
      }
    },

    'AI Infrastructure': {
      color: '#a87c68',
      displayMomentum: '+247%',
      actualMomentum: '+247.3%',
      dataPoints: [45, 50, 52, 54, 56, 57, 58, 58, 58, 76, 100, 138, 156],  // Last 5 match 30-day exactly
      startValue: 45,
      endValue: 156,
      totalGrowth: 247.3,
      consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Peak', 'Peak'],
      narrative: 'Foundation layer investment accelerating with AI boom',
      quotes: {
        'Jun 3': 'Infrastructure needs emerging',
        'Jun 10': 'GPU shortage discussions',
        'Jun 17': 'Compute economics focus',
        'Jun 24': 'Infrastructure plays forming',
        'Jul 1': 'Investment thesis strengthens',
        'Jul 8': 'Major funding rounds',
        'Jul 15': 'Platform plays emerge',
        'Jul 22': 'Full stack solutions',
        'Jul 29': 'Foundation layer critical',
        'Aug 5': 'Infrastructure boom begins',
        'Aug 12': 'GPU rich economy',
        'Aug 19': 'Infrastructure complete',
        'Aug 26': 'Picks and shovels win'
      }
    }
  }
};
```

## Key Insights & Usage Notes

### 1. Data Consistency Rules
- **7-day end values** = 30-day Aug 29 values = 90-day final values
- **30-day data** is embedded within the 90-day data (weeks 9-13)
- **7-day data** zooms into the final week with daily granularity

### 2. Momentum Calculations
- **7-day momentum**: (End - Start) / Start for 7-day period
- **30-day momentum**: (End - Start) / Start for 30-day period  
- **90-day momentum**: (End - Start) / Start for 90-day period
- **Display momentum**: UI-friendly capped values for extreme growth

### 3. Narrative Themes by Topic

**AI Agents**: Steady growth story, mainstream adoption
- 90-day: Building from experimentation to mainstream
- 30-day: Acceleration phase
- 7-day: Continued strong momentum

**Capital Efficiency**: Recovery narrative
- 90-day: U-shaped recovery from July lows
- 30-day: Steady improvement
- 7-day: Stabilizing at higher levels

**DePIN**: Explosive emergence
- 90-day: From obscurity to hottest topic
- 30-day: Parabolic growth
- 7-day: Still accelerating (39% weekly!)

**B2B SaaS**: Mature market
- 90-day: Flat throughout
- 30-day: Minimal movement
- 7-day: Slight uptick

**Developer Tools**: AI-driven renaissance
- 90-day: Steady growth accelerating
- 30-day: Strong momentum
- 7-day: Consistent gains

**Vertical SaaS**: Specialization wins
- 90-day: Slow start, then explosion
- 30-day: Rapid acceleration
- 7-day: Strong continued growth

**AI Infrastructure**: Foundation layer boom
- 90-day: Steady build to explosion
- 30-day: Strong consistent growth
- 7-day: Peak momentum

### 4. Implementation Recommendations

1. **Chart Scaling**: Use logarithmic scale for 90-day view due to extreme growth ranges
2. **UI Considerations**: Cap display values for DePIN to prevent UI distortion
3. **Interactivity**: Allow seamless transitions between timeframes
4. **Tooltips**: Show both actual and display momentum values
5. **Color Coding**: Maintain consistent colors across all views

### 5. Demo Talking Points

For customer demos, emphasize:
- **Pattern Recognition**: How different timeframes reveal different insights
- **Narrative Intelligence**: Each topic tells a story, not just data points
- **Actionable Insights**: What VCs should do based on these trends
- **Weekly Updates**: Fresh intelligence for Monday partner meetings

---

*Document Version: 1.0*
*Created: January 2025*
*Purpose: VCPulse Demo Data Repository*