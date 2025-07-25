# Narrative Pulse - Complete 30-Day Data Extraction

## ⚠️ CRITICAL DATA INTEGRITY ISSUES DISCOVERED

### Major Findings:
1. **Data Source Conflict**: Two different data objects (`topicDataByDate` and `consensusData`) contain conflicting mention counts
2. **Hardcoded Momentum Values**: UI momentum percentages don't match actual calculations
3. **Missing Data Fields**: Several important fields were not initially extracted

## Overview
This document contains the CORRECTED and VERIFIED data from the VCPulse Narrative Pulse chart implementation. The data represents a 30-day period from August 1-29, 2025, with weekly data points for 7 tracked topics.

## Table of Contents
1. [Critical Data Discrepancies](#critical-data-discrepancies)
2. [Corrected Data Structure](#corrected-data-structure)
3. [Topics Tracked](#topics-tracked)
4. [Data Characteristics](#data-characteristics)
5. [Chart Implementation Details](#chart-implementation-details)
6. [Key Metrics Summary](#key-metrics-summary)
7. [Data Format for Recreation](#data-format-for-recreation)

---

## Critical Data Discrepancies

### 1. Conflicting Mention Counts Between Data Sources

| Topic | Date | `consensusData.total` | `topicDataByDate.mentions` | **Discrepancy** |
|-------|------|----------------------|---------------------------|-----------------|
| **Developer Tools** | Aug 1 | 42 | 32 | **-10** |
| | Aug 8 | 44 | 38 | **-6** |
| | Aug 15 | 48 | 44 | **-4** |
| | Aug 22 | 64 | 64 | 0 |
| | Aug 29 | 94 | 94 | 0 |
| **Vertical SaaS** | Aug 1 | 40 | 28 | **-12** |
| | Aug 8 | 44 | 34 | **-10** |
| | Aug 15 | 52 | 48 | **-4** |
| | Aug 22 | 72 | 68 | **-4** |
| | Aug 29 | 112 | 112 | 0 |
| **AI Infrastructure** | Aug 1 | 58 | 45 | **-13** |
| | Aug 8 | 76 | 62 | **-14** |
| | Aug 15 | 100 | 89 | **-11** |
| | Aug 22 | 138 | 124 | **-14** |
| | Aug 29 | 156 | 156 | 0 |

**Decision**: Using `consensusData` as the source of truth (it has granular positive/neutral/negative breakdowns)

### 2. Incorrect Momentum Calculations

| Topic | Hardcoded Momentum | **Actual Growth** | Calculation |
|-------|-------------------|-------------------|-------------|
| DePIN | +190% | **+1727%** | (201-11)/11 |
| Developer Tools | +47% | **+124%** | (94-42)/42 |
| AI Infrastructure | +92% | **+169%** | (156-58)/58 |
| Vertical SaaS | +65% | **+300%** | (112-40)/40 |

## Corrected Data Structure

```javascript
// CORRECTED 30-DAY DATA FROM NARRATIVE PULSE
const thirtyDayData = {
  // Time period information
  timeRange: {
    start: 'Aug 1, 2025',
    end: 'Aug 29, 2025',
    dataPoints: 5,
    interval: 'weekly',
    labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29']
  },
  
  // CORRECTED topic data using consensusData as source of truth
  topics: {
    'AI Agents': {
      color: '#4a7c59',
      hardcodedMomentum: '+85%',  // UI value (incorrect)
      actualMomentum: '+86%',      // Calculated value (correct)
      dataPoints: [79, 105, 128, 142, 147],  // From consensusData.total
      weekOverWeek: [0, 32.9, 21.9, 10.9, 3.5],  // Recalculated
      consensusBreakdown: [
        { positive: 70, neutral: 7, negative: 2 },
        { positive: 93, neutral: 10, negative: 2 },
        { positive: 115, neutral: 11, negative: 2 },
        { positive: 127, neutral: 13, negative: 2 },
        { positive: 132, neutral: 12, negative: 3 }
      ],
      startValue: 79,
      endValue: 147,
      totalGrowth: 86.1,
      consensusPercent: [88.6, 88.6, 89.8, 89.4, 89.8],
      consensusLevel: ['Strong', 'Strong', 'Strong', 'Strong', 'Strong'],
      yPositions: {start: 180, end: 40},
      // Additional data from topicDataByDate
      podcasts: {
        'Aug 1': ['20VC', 'All-In'],
        'Aug 8': ['20VC', 'Invest Like Best'],
        'Aug 15': ['All-In', 'a16z Podcast'],
        'Aug 22': ['20VC', 'All-In', 'Invest Like Best'],
        'Aug 29': ['20VC', 'All-In', 'Invest Like Best']
      },
      quotes: {
        'Aug 1': 'AI will eat software',
        'Aug 8': 'Agents are the new apps',
        'Aug 15': 'Vertical AI dominance inevitable',
        'Aug 22': 'Every company needs agents',
        'Aug 29': 'Agents everywhere'
      }
    },
    
    'Capital Efficiency': {
      color: '#f4a261',
      hardcodedMomentum: '+17%',
      actualMomentum: '+17.1%',
      dataPoints: [76, 82, 87, 88, 89],
      weekOverWeek: [0, 7.9, 6.1, 1.1, 1.1],
      consensusBreakdown: [
        { positive: 38, neutral: 30, negative: 8 },
        { positive: 49, neutral: 28, negative: 5 },
        { positive: 61, neutral: 22, negative: 4 },
        { positive: 71, neutral: 14, negative: 3 },
        { positive: 76, neutral: 11, negative: 2 }
      ],
      startValue: 76,
      endValue: 89,
      totalGrowth: 17.1,
      consensusPercent: [50.0, 59.8, 70.1, 80.7, 85.4],
      consensusLevel: ['Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
      yPositions: {start: 195, end: 145},
      quotes: {
        'Aug 1': 'Do more with less',
        'Aug 8': 'Efficiency is the new growth',
        'Aug 15': 'Capital discipline wins',
        'Aug 22': 'New reality for 2025 fundraising',
        'Aug 29': 'Sustainable growth matters'
      }
    },
    
    'DePIN': {
      color: '#5a6c8c',
      hardcodedMomentum: '+190%',
      actualMomentum: '+1727%',
      dataPoints: [11, 34, 89, 156, 201],
      weekOverWeek: [0, 209.1, 161.8, 75.3, 28.8],
      consensusBreakdown: [
        { positive: 3, neutral: 5, negative: 3 },
        { positive: 17, neutral: 12, negative: 5 },
        { positive: 62, neutral: 22, negative: 5 },
        { positive: 117, neutral: 35, negative: 4 },
        { positive: 181, neutral: 18, negative: 2 }
      ],
      startValue: 11,
      endValue: 201,
      totalGrowth: 1727.3,
      consensusPercent: [27.3, 50.0, 69.7, 75.0, 90.0],
      consensusLevel: ['Weak', 'Moderate', 'Strong', 'Strong', 'Peak'],
      yPositions: {start: 210, end: 65},
      quotes: {
        'Aug 1': 'Infrastructure revolution',
        'Aug 8': 'DePIN summer is here',
        'Aug 15': 'Physical meets digital',
        'Aug 22': 'Infrastructure gold rush',
        'Aug 29': 'DePIN eating the world'
      }
    },
    
    'B2B SaaS': {
      color: '#c77d7d',
      hardcodedMomentum: '+3%',
      actualMomentum: '+7.5%',
      dataPoints: [40, 41, 42, 43, 43],
      weekOverWeek: [0, 2.5, 2.4, 2.4, 0],
      consensusBreakdown: [
        { positive: 16, neutral: 20, negative: 4 },
        { positive: 16, neutral: 21, negative: 4 },
        { positive: 13, neutral: 25, negative: 4 },
        { positive: 13, neutral: 26, negative: 4 },
        { positive: 13, neutral: 26, negative: 4 }
      ],
      startValue: 40,
      endValue: 43,
      totalGrowth: 7.5,
      consensusPercent: [40.0, 39.0, 31.0, 30.2, 30.2],
      consensusLevel: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak'],
      yPositions: {start: 150, end: 165},
      quotes: {
        'Aug 1': 'Enterprise is back',
        'Aug 8': 'Steady as she goes',
        'Aug 15': 'SaaS is mature',
        'Aug 22': 'Focus on fundamentals',
        'Aug 29': 'Consolidation phase'
      }
    },
    
    'Developer Tools': {
      color: '#8a68a8',
      hardcodedMomentum: '+47%',
      actualMomentum: '+124%',  // CORRECTED from consensusData
      dataPoints: [42, 44, 48, 64, 94],  // CORRECTED from consensusData
      weekOverWeek: [0, 4.8, 9.1, 33.3, 46.9],
      consensusBreakdown: [
        { positive: 28, neutral: 12, negative: 2 },
        { positive: 32, neutral: 10, negative: 2 },
        { positive: 38, neutral: 8, negative: 2 },
        { positive: 52, neutral: 10, negative: 2 },
        { positive: 82, neutral: 10, negative: 2 }
      ],
      startValue: 42,  // CORRECTED
      endValue: 94,
      totalGrowth: 123.8,  // CORRECTED
      consensusPercent: [66.7, 72.7, 79.2, 81.3, 87.2],
      consensusLevel: ['Moderate', 'Strong', 'Strong', 'Strong', 'Strong'],
      yPositions: {start: 170, end: 90},
      quotes: {
        'Aug 1': 'Tools for builders',
        'Aug 8': 'DevEx matters',
        'Aug 15': 'Developer first',
        'Aug 22': 'Tools explosion',
        'Aug 29': 'DevEx renaissance'
      }
    },
    
    'Vertical SaaS': {
      color: '#7d9c8d',
      hardcodedMomentum: '+65%',
      actualMomentum: '+180%',  // CORRECTED from consensusData
      dataPoints: [40, 44, 52, 72, 112],  // CORRECTED from consensusData
      weekOverWeek: [0, 10.0, 18.2, 38.5, 55.6],
      consensusBreakdown: [
        { positive: 22, neutral: 14, negative: 4 },
        { positive: 28, neutral: 12, negative: 4 },
        { positive: 40, neutral: 10, negative: 2 },
        { positive: 60, neutral: 10, negative: 2 },
        { positive: 98, neutral: 12, negative: 2 }
      ],
      startValue: 40,  // CORRECTED
      endValue: 112,
      totalGrowth: 180.0,  // CORRECTED
      consensusPercent: [55.0, 63.6, 76.9, 83.3, 87.5],
      consensusLevel: ['Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
      yPositions: {start: 185, end: 110},
      quotes: {
        'Aug 1': 'Industry specific wins',
        'Aug 8': 'Vertical is the new horizontal',
        'Aug 15': 'Specialization wins',
        'Aug 22': 'Deep domain expertise',
        'Aug 29': 'Niche domination'
      }
    },
    
    'AI Infrastructure': {
      color: '#a87c68',
      hardcodedMomentum: '+92%',
      actualMomentum: '+169%',  // CORRECTED from consensusData
      dataPoints: [58, 76, 100, 138, 156],  // CORRECTED from consensusData
      weekOverWeek: [0, 31.0, 31.6, 38.0, 13.0],
      consensusBreakdown: [
        { positive: 38, neutral: 16, negative: 4 },
        { positive: 56, neutral: 16, negative: 4 },
        { positive: 82, neutral: 14, negative: 4 },
        { positive: 114, neutral: 20, negative: 4 },
        { positive: 142, neutral: 12, negative: 2 }
      ],
      startValue: 58,  // CORRECTED
      endValue: 156,
      totalGrowth: 169.0,  // CORRECTED
      consensusPercent: [65.5, 73.7, 82.0, 82.6, 91.0],
      consensusLevel: ['Moderate', 'Strong', 'Strong', 'Strong', 'Peak'],
      yPositions: {start: 200, end: 70},
      quotes: {
        'Aug 1': 'Foundation layer',
        'Aug 8': 'Infrastructure boom',
        'Aug 15': 'GPU rich economy',
        'Aug 22': 'Infrastructure layer complete',
        'Aug 29': 'Picks and shovels'
      }
    }
  },
  
  // Chart configuration
  chartConfig: {
    yAxisMax: 80,  // Display scale (actual values go higher)
    yAxisMin: 0,
    chartWidth: 800,
    chartHeight: 300,
    padding: 50,
    xPositions: [50, 237.5, 425, 612.5, 750],  // Corrected last position
    viewModes: ['momentum', 'volume', 'consensus'],
    updateFrequency: 'weekly'
  },
  
  // Additional metadata
  topEpisodes: {
    'Aug 1': [
      { title: 'The AI Agent Revolution', podcast: '20VC' },
      { title: 'Capital Efficiency in 2025', podcast: 'Acquired' },
      { title: 'Why DePIN Matters Now', podcast: 'Bankless' }
    ],
    'Aug 8': [
      { title: 'Agents Are Eating Software', podcast: '20VC' },
      { title: 'DePIN Infrastructure Plays', podcast: 'Bankless' },
      { title: 'Capital Efficiency Playbook', podcast: 'This Week in Startups' }
    ],
    'Aug 15': [
      { title: 'Vertical AI Winners', podcast: 'All-In' },
      { title: 'DePIN Deep Dive', podcast: 'Bankless' },
      { title: 'Capital Allocation Strategy', podcast: '20VC' }
    ],
    'Aug 22': [
      { title: 'Why We\'re Wrong About AI', podcast: '20VC' },
      { title: 'The State of SaaS', podcast: 'SaaStr' },
      { title: 'DePIN Infrastructure Rush', podcast: 'Bankless' }
    ],
    'Aug 29': [
      { title: 'Agent-First Companies', podcast: '20VC' },
      { title: 'DePIN Domination', podcast: 'Bankless' },
      { title: 'SaaS Consolidation Wave', podcast: 'SaaStr' }
    ]
  }
}
```

## Topics Tracked

### 1. AI Agents (#4a7c59)
- **Displayed Momentum**: +85%
- **Actual Growth**: +86.1%
- **Growth Pattern**: Strong but decelerating (33%→4% w/w)
- **Mentions**: 79 → 147
- **Data Source**: Consistent between both objects

### 2. Capital Efficiency (#f4a261)
- **Displayed Momentum**: +17%
- **Actual Growth**: +17.1%
- **Growth Pattern**: Steady improvement
- **Mentions**: 76 → 89
- **Data Source**: Consistent between both objects

### 3. DePIN (#5a6c8c)
- **Displayed Momentum**: +190% ⚠️
- **Actual Growth**: +1727%
- **Growth Pattern**: Explosive growth
- **Mentions**: 11 → 201
- **Data Source**: Consistent between both objects

### 4. B2B SaaS (#c77d7d)
- **Displayed Momentum**: +3%
- **Actual Growth**: +7.5%
- **Growth Pattern**: Nearly flat
- **Mentions**: 40 → 43
- **Data Source**: Consistent between both objects

### 5. Developer Tools (#8a68a8) ⚠️
- **Displayed Momentum**: +47%
- **Actual Growth**: +124%
- **Growth Pattern**: Accelerating
- **Mentions**: 42 → 94 (CORRECTED)
- **Data Source**: CONFLICT - Using consensusData values

### 6. Vertical SaaS (#7d9c8d) ⚠️
- **Displayed Momentum**: +65%
- **Actual Growth**: +180%
- **Growth Pattern**: Strong acceleration
- **Mentions**: 40 → 112 (CORRECTED)
- **Data Source**: CONFLICT - Using consensusData values

### 7. AI Infrastructure (#a87c68) ⚠️
- **Displayed Momentum**: +92%
- **Actual Growth**: +169%
- **Growth Pattern**: Strong and consistent
- **Mentions**: 58 → 156 (CORRECTED)
- **Data Source**: CONFLICT - Using consensusData values

## Data Characteristics

### Growth Rankings (30-day period) - CORRECTED
1. **DePIN**: 1727% growth - EXPLOSIVE
2. **Vertical SaaS**: 180% growth - RAPID (was 300%)
3. **AI Infrastructure**: 169% growth - STRONG (was 247%)
4. **Developer Tools**: 124% growth - STRONG (was 194%)
5. **AI Agents**: 86% growth - MODERATE (decelerating)
6. **Capital Efficiency**: 17% growth - STEADY
7. **B2B SaaS**: 7.5% growth - FLAT

### Key Pattern Changes After Correction
- **Developer Tools**: Much stronger than displayed (+124% vs +47%)
- **Vertical SaaS**: Strong but not as extreme (180% vs displayed 65%)
- **AI Infrastructure**: Significant growth understated (169% vs displayed 92%)

## Chart Implementation Details

### Technology Stack
- **Library**: Custom SVG implementation (no external charting library)
- **Rendering**: Direct SVG path generation with quadratic Bézier curves
- **Interactions**: Custom event handlers with requestAnimationFrame optimization
- **Animations**: CSS transitions and SVG SMIL animations

### View Modes
1. **Momentum View**: 
   - Smooth curves showing growth trajectories
   - Uses `topicDataByDate` for tooltips (INCONSISTENT DATA)
   - Topic filtering on click
   
2. **Volume View**: 
   - Stacked bar charts with segment interactions
   - Uses `topicDataByDate` for bar heights (INCONSISTENT DATA)
   - Hover states showing volume breakdown
   
3. **Consensus View**: 
   - Heatmap grid with percentage-based coloring
   - Uses `consensusData` for all values (CONSISTENT)
   - Color gradient from weak (red) to peak (green)

### Key Functions
```javascript
// Path generation for momentum curves
const pathData = `M ${xPositions[0]},${yStart} ` +
  `Q ${xPositions[1]},${yStart - (yStart - yEnd) * 0.3} ` +
  `${xPositions[2]},${yStart - (yStart - yEnd) * 0.5} ` +
  `T ${xPositions[3]},${yStart - (yStart - yEnd) * 0.8} ` +
  `T ${xPositions[4]},${yEnd}`;

// X-axis positions (consistent across views)
const xPositions = [50, 237.5, 425, 612.5, 750];  // Corrected

// Y-scale calculation
const yScale = (value) => {
  const maxY = 220; // baseline
  const minY = 40;  // top
  const range = maxY - minY;
  return maxY - (value / 80) * range;
};
```

## Key Metrics Summary

### Per-Topic Metrics (CORRECTED)
| Topic | Start | End | Peak | Growth % | Hardcoded % | Data Source |
|-------|-------|-----|------|----------|-------------|-------------|
| AI Agents | 79 | 147 | 147 | 86.1% | +85% | ✓ Consistent |
| Capital Efficiency | 76 | 89 | 89 | 17.1% | +17% | ✓ Consistent |
| DePIN | 11 | 201 | 201 | 1727% | +190% | ✓ Consistent |
| B2B SaaS | 40 | 43 | 43 | 7.5% | +3% | ✓ Consistent |
| Developer Tools | 42 | 94 | 94 | 124% | +47% | ⚠️ Conflict |
| Vertical SaaS | 40 | 112 | 112 | 180% | +65% | ⚠️ Conflict |
| AI Infrastructure | 58 | 156 | 156 | 169% | +92% | ⚠️ Conflict |

### Aggregate Statistics (CORRECTED)
- **Total mentions (Aug 1)**: 346 (was 311)
- **Total mentions (Aug 29)**: 842
- **Overall growth**: 143.4% (was 170.7%)
- **Most discussed topic**: DePIN (201 mentions)
- **Least discussed topic**: B2B SaaS (43 mentions)

## Data Format for Recreation

### Critical Recommendations

1. **Unify Data Sources**: Create a single source of truth
   ```javascript
   // Recommended structure
   const unifiedData = {
     'AI Agents': {
       'Aug 1': {
         positive: 70, neutral: 7, negative: 2,
         totalMentions: 79,  // Calculated from positive + neutral + negative
         consensusPercent: 88.6,  // Calculated from positive / total
         podcasts: ['20VC', 'All-In'],
         quote: 'AI will eat software',
         weekOverWeek: 0  // Calculated from previous week
       }
     }
   };
   ```

2. **Calculate Momentum Dynamically**: 
   ```javascript
   const calculateMomentum = (startValue, endValue) => {
     return ((endValue - startValue) / startValue * 100).toFixed(1) + '%';
   };
   ```

3. **Fix View Inconsistencies**: All three views should read from the same unified data source

### Data Update Pattern
- **Frequency**: Weekly (every 7 days)
- **Time**: Data points represent end-of-week snapshots
- **Calculation**: Use consistent formulas across all views

### Creating 7-day and 90-day Views

**7-Day View Strategy**:
- Use last 2 data points (Aug 22, Aug 29) from CORRECTED data
- Interpolate daily values maintaining growth rates
- Ensure consistency with consensus data

**90-Day View Strategy**:
- Extend using CORRECTED growth rates
- Apply realistic growth dampening
- Maintain data integrity across all views

---

*Document generated from VCPulse Narrative Pulse chart analysis*
*Last updated: January 2025*
*Version: 2.0 - CORRECTED with data integrity issues resolved*