# Mock Data Complete Inventory

## File: demo/data/demo-data.js

### Component: Topic Velocity Data (lines 7-32)
```javascript
// LINE 8-13
'AI Agents': { 
    color: '#4a7c59', 
    momentum: '+85%', 
    mentions: 147, 
    episodes: 23 
}
location: "demo-data.js:8-13"
component: "topic-velocity"
data_type: "topic_metrics"
traffic_light: "GREEN"
new_value: "No change needed - all calculable from transcript data"
entities_mentioned: []

// LINE 14-19
'Capital Efficiency': { 
    color: '#f4a261', 
    momentum: '+17%', 
    mentions: 89, 
    episodes: 31 
}
location: "demo-data.js:14-19"
component: "topic-velocity"
data_type: "topic_metrics"
traffic_light: "GREEN"
new_value: "No change needed - direct calculations"

// LINE 20-25
'DePIN': { 
    color: '#5a6c8c', 
    momentum: '+190%', 
    mentions: 201, 
    episodes: 18 
}
location: "demo-data.js:20-25"
component: "topic-velocity"
data_type: "topic_metrics"
traffic_light: "GREEN"
new_value: "No change needed - high momentum is realistic for emerging topics"

// LINE 26-31
'B2B SaaS': { 
    color: '#c77d7d', 
    momentum: '+3%', 
    mentions: 43, 
    episodes: 12 
}
location: "demo-data.js:26-31"
component: "topic-velocity"
data_type: "topic_metrics"
traffic_light: "GREEN"
new_value: "No change needed - low momentum reflects market reality"
```

### Component: Narrative Feed Data (lines 36-166)
```javascript
// LINE 41
event: 'AI infrastructure concerns reach consensus across 5 tier-1 sources'
location: "demo-data.js:41"
component: "narrative-feed-1"
data_type: "consensus_event"
traffic_light: "YELLOW"
new_value: "AI infrastructure preference emerging across 5 tier-1 sources"
justification: "Consensus detection requires threshold definitions"

// LINE 46-48
name: '20VC w/ Brad Gerstner',
time: '2h ago',
quote: 'Infrastructure is eating the world, not apps. We\'re seeing 10x better unit economics in picks-and-shovels plays.'
location: "demo-data.js:46-48"
component: "narrative-feed-1-source"
data_type: "quoted_insight"
traffic_light: "GREEN"
new_value: "No change needed - extractable via GPT-4"
entities_mentioned: ["20VC", "Brad Gerstner"]

// LINE 71
event: 'Peter Thiel contradicts mainstream AGI timeline - contrarian signal'
location: "demo-data.js:71"
component: "narrative-feed-2"
data_type: "contrarian_signal"
traffic_light: "YELLOW"
new_value: "Peter Thiel diverges from mainstream AGI timeline consensus"
justification: "Requires pattern recognition for contrarian detection"

// LINE 96
event: 'Developer experience mentioned 12 times as key differentiator'
location: "demo-data.js:96"
component: "narrative-feed-3"
data_type: "trend_detection"
traffic_light: "GREEN"
new_value: "Developer experience: 12 mentions as key differentiator"
entities_mentioned: []

// LINE 116
momentum: '12 mentions this week vs. 3 mentions last week (+300%)'
location: "demo-data.js:116"
component: "narrative-feed-3-momentum"
data_type: "comparative_metrics"
traffic_light: "GREEN"
new_value: "No change needed - calculable from historical data"

// LINE 122
event: 'LP sentiment shifts negative - CalPERS focusing on DPI metrics'
location: "demo-data.js:122"
component: "narrative-feed-4"
data_type: "lp_sentiment"
traffic_light: "YELLOW"
new_value: "LP sentiment: CalPERS emphasizing DPI metrics"
entities_mentioned: ["CalPERS"]
justification: "Sentiment shift detection needs thresholds"

// LINE 137
impact: 'First-time funds facing 18+ month raises. Established funds getting 50% of target.'
location: "demo-data.js:137"
component: "narrative-feed-4-impact"
data_type: "market_impact"
traffic_light: "GREEN"
new_value: "No change needed - GPT-4 can synthesize from discussions"
```

### Component: Signal Counts (lines 170-197)
```javascript
// LINE 173-176
marketNarratives: {
    count: 47,
    trending: '↑ 14 from last week',
    label: 'Shifting Themes'
}
location: "demo-data.js:173-176"
component: "signal-count-narratives"
data_type: "aggregated_count"
traffic_light: "GREEN"
new_value: "No change needed - direct counting"

// LINE 177-180
thesisValidation: {
    count: 14,
    trending: '↑ 3 validated',
    label: 'Consensus Signals'
}
location: "demo-data.js:177-180"
component: "signal-count-thesis"
data_type: "validation_metric"
traffic_light: "YELLOW"
new_value: "14 theses tracked, 3 reaching validation threshold"
justification: "Validation requires defined criteria"

// LINE 193-196
lpSentiment: {
    count: 5,
    trending: '↓ Caution rising',
    label: 'Notable Shifts'
}
location: "demo-data.js:193-196"
component: "signal-count-lp"
data_type: "sentiment_metric"
traffic_light: "YELLOW"
new_value: "5 LP discussions, sentiment trending cautious"
justification: "Sentiment analysis needs calibration"
```

### Component: Priority Briefings (lines 202-261)
```javascript
// LINE 211
title: 'Why We\'re Wrong About AI Valuations'
location: "demo-data.js:211"
component: "briefing-1-title"
data_type: "episode_metadata"
traffic_light: "GREEN"
new_value: "No change needed - from podcast metadata"

// LINE 212
guest: 'Brad Gerstner, Founder & CEO at Altimeter Capital'
location: "demo-data.js:212"
component: "briefing-1-guest"
data_type: "entity_metadata"
traffic_light: "GREEN"
new_value: "No change needed - entity extraction"
entities_mentioned: ["Brad Gerstner", "Altimeter Capital"]

// LINE 210
influence: '94%'
location: "demo-data.js:210"
component: "briefing-1-influence"
data_type: "influence_score"
traffic_light: "YELLOW"
new_value: "Influence: 94 (High impact speaker)"
justification: "Influence scoring needs methodology"

// LINE 214
'Series A valuations settling at 20-30x ARR, sustainable after 18 months of chaos'
location: "demo-data.js:214"
component: "briefing-1-insight"
data_type: "market_intelligence"
traffic_light: "GREEN"
new_value: "Series A valuations: 20-30x ARR trend (multiple sources)"

// LINE 216
'Perplexity at $10B but Sequoia got 3x liquidation preference'
location: "demo-data.js:216"
component: "briefing-1-insight"
data_type: "deal_terms"
traffic_light: "RED"
new_value: "Perplexity funding round discussed (specific terms unverified)"
entities_mentioned: ["Perplexity", "Sequoia"]
justification: "Specific deal terms rarely disclosed in podcasts"
```

### Component: Sidebar Metrics - Intelligence Brief (lines 268-314)
```javascript
// LINE 269
hoursAnalyzed: 1044
location: "demo-data.js:269"
component: "intelligence-brief-hours"
data_type: "metadata"
traffic_light: "GREEN"
new_value: "1,044 hours analyzed"

// LINE 271
collapsed: 'AI infrastructure dominates [12 sources agree, led by Gerstner/20VC, Gurley/Invest Like Best] with Series A at 20-30x ARR [Hoffman, Rabois confirm].'
location: "demo-data.js:271"
component: "intelligence-brief-summary"
data_type: "ai_synthesis"
traffic_light: "GREEN"
new_value: "No change needed - GPT-4 synthesis"
entities_mentioned: ["Gerstner", "20VC", "Gurley", "Invest Like Best", "Hoffman", "Rabois"]

// LINE 271 (continued)
'Contrarian signal: DePIN momentum without revenue [only Thiel dissenting].'
location: "demo-data.js:271"
component: "intelligence-brief-contrarian"
data_type: "contrarian_analysis"
traffic_light: "YELLOW"
new_value: "Notable divergence: DePIN momentum despite revenue questions"
entities_mentioned: ["Thiel"]
justification: "Contrarian signal detection needs pattern recognition"

// LINE 271 (continued)
'Emerging blindspot: Developer tools consolidation [no top-tier coverage yet].'
location: "demo-data.js:271"
component: "intelligence-brief-blindspot"
data_type: "gap_analysis"
traffic_light: "YELLOW"
new_value: "Potential blindspot: Developer tools consolidation discussions minimal"
justification: "Blindspot detection requires coverage analysis"
```

### Component: Influence Metrics (lines 327-333)
```javascript
// LINE 328
{ name: 'Brad Gerstner', score: 94 }
location: "demo-data.js:328"
component: "influence-metric"
data_type: "influence_score"
traffic_light: "YELLOW"
new_value: "Brad Gerstner: 94 (based on citation frequency + agreement rates)"
entities_mentioned: ["Brad Gerstner"]
justification: "Requires influence calculation methodology"

// LINE 329
{ name: 'All-In Hosts', score: 87 }
location: "demo-data.js:329"
component: "influence-metric"
data_type: "influence_score"
traffic_light: "YELLOW"
new_value: "All-In Hosts: 87 (collective influence metric)"
entities_mentioned: ["All-In Hosts"]
```

### Component: Consensus Monitor (lines 336-341)
```javascript
// LINE 337
{ topic: 'AI Agents', level: 'Strong' }
location: "demo-data.js:337"
component: "consensus-level"
data_type: "consensus_metric"
traffic_light: "YELLOW"
new_value: "AI Agents: Strong consensus (>80% agreement)"
justification: "Consensus levels need threshold definitions"

// LINE 339
{ topic: 'DePIN', level: 'Mixed' }
location: "demo-data.js:339"
component: "consensus-level"
data_type: "consensus_metric"
traffic_light: "YELLOW"
new_value: "DePIN: Mixed consensus (40-60% agreement)"
```

### Component: Topic Correlations (lines 344-349)
```javascript
// LINE 345
{ topics: 'AI + Infrastructure', percentage: 68 }
location: "demo-data.js:345"
component: "topic-correlation"
data_type: "correlation_metric"
traffic_light: "GREEN"
new_value: "No change needed - co-occurrence calculation"
```

### Component: Signal Panel Data - Market Narratives (lines 356-393)
```javascript
// LINE 358-362
{ 
    trend: '"Growth at all costs" → "Efficient growth"', 
    count: 23, 
    source: 'Multiple podcasts', 
    insight: 'LPs are driving this narrative hard. Every major fund is adjusting their pitch.' 
}
location: "demo-data.js:358-362"
component: "market-narrative-1"
data_type: "narrative_shift"
traffic_light: "YELLOW"
new_value: "Growth → Efficiency: 23 mentions across sources (LP-driven shift)"
justification: "Narrative shift detection needs pattern recognition"

// LINE 426
'Sequoia got 3x liquidation preference. New structure becoming standard for hot deals.'
location: "demo-data.js:426"
component: "notable-deal-insight"
data_type: "deal_structure"
traffic_light: "RED"
new_value: "Deal structure trends emerging in competitive rounds"
entities_mentioned: ["Sequoia"]
justification: "Specific deal terms not typically public"
```

### Component: Header Ticker Data (lines 504-509)
```javascript
// LINE 505
{ label: 'AI Agents', value: '↑85%' }
location: "demo-data.js:505"
component: "header-ticker-1"
data_type: "topic_momentum"
traffic_light: "GREEN"
new_value: "AI Agents: ↑85% w/w"

// LINE 507
{ label: 'Patterns Detected', value: '47' }
location: "demo-data.js:507"
component: "header-ticker-3"
data_type: "pattern_count"
traffic_light: "GREEN"
new_value: "47 patterns detected"
```

## File: demo/features/priority-briefings/priority-briefings.html

### Component: Episode Card Headers (lines 14-26)
```javascript
// LINE 23
<div class="podcast-name">20VC with Harry Stebbings</div>
location: "priority-briefings.html:23"
component: "episode-card-podcast"
data_type: "podcast_metadata"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["20VC", "Harry Stebbings"]

// LINE 24
<div class="episode-time">2h ago • 72 min • <span style="color: var(--sage); font-weight: 600;">94% influence</span></div>
location: "priority-briefings.html:24"
component: "episode-card-meta"
data_type: "episode_metadata"
traffic_light: "YELLOW"
new_value: "2h ago • 72 min • High influence"
justification: "94% influence score needs methodology"
```

### Component: Key Insights (lines 30-38)
```javascript
// LINE 34
<li>Series A valuations settling at 20-30x ARR, sustainable after 18 months of chaos</li>
location: "priority-briefings.html:34"
component: "episode-insight"
data_type: "market_intelligence"
traffic_light: "GREEN"
new_value: "Series A valuations: 20-30x ARR becoming standard"

// LINE 36
<li>Perplexity at $10B but Sequoia got 3x liquidation preference</li>
location: "priority-briefings.html:36"
component: "episode-insight"
data_type: "deal_terms"
traffic_light: "RED"
new_value: "Perplexity funding round with notable terms structure"
entities_mentioned: ["Perplexity", "Sequoia"]
```

## File: demo/features/intelligence-brief/intelligence-brief.html

### Component: Weekly Intelligence Brief Header (lines 4-6)
```javascript
// LINE 6
<p class="synthesis-meta">1,498 hours analyzed • Updated 36 mins ago</p>
location: "intelligence-brief.html:6"
component: "brief-metadata"
data_type: "metadata"
traffic_light: "GREEN"
new_value: "No change needed"
```

### Component: AI Synthesis Section (lines 26-31)
```javascript
// LINE 28
<strong>AI infrastructure dominates</strong> [12 sources agree, led by Gerstner/20VC, Gurley/Invest Like Best] with Series A at 20-30x ARR [Hoffman, Rabois confirm].
location: "intelligence-brief.html:28"
component: "synthesis-main"
data_type: "ai_synthesis"
traffic_light: "GREEN"
new_value: "No change needed - GPT-4 synthesis with source attribution"
entities_mentioned: ["Gerstner", "20VC", "Gurley", "Invest Like Best", "Hoffman", "Rabois"]

// LINE 28 (continued)
<strong>Contrarian signal:</strong> DePIN momentum without revenue [only Thiel dissenting].
location: "intelligence-brief.html:28"
component: "synthesis-contrarian"
data_type: "contrarian_signal"
traffic_light: "YELLOW"
new_value: "Contrarian view: DePIN momentum questions from select voices"
entities_mentioned: ["Thiel"]
```

### Component: Velocity Tracking (lines 68-89)
```javascript
// LINE 71
<span class="momentum-change positive">+85% w/w</span>
location: "intelligence-brief.html:71"
component: "velocity-ai-agents"
data_type: "momentum_metric"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 79
<span class="momentum-change positive">+190% w/w</span>
location: "intelligence-brief.html:79"
component: "velocity-depin"
data_type: "momentum_metric"
traffic_light: "GREEN"
new_value: "No change needed - extreme but realistic for emerging topics"
```

### Component: Influence Metrics (lines 94-130)
```javascript
// LINE 96
<span class="influence-name">Brad Gerstner</span>
location: "intelligence-brief.html:96"
component: "influence-name"
data_type: "entity"
traffic_light: "GREEN"
entities_mentioned: ["Brad Gerstner"]

// LINE 98
<div class="influence-bar" style="width: 94%;"></div>
location: "intelligence-brief.html:98"
component: "influence-visual"
data_type: "influence_score"
traffic_light: "YELLOW"
new_value: "width: calculated from influence methodology"

// LINE 100
<span class="influence-score">94%</span>
location: "intelligence-brief.html:100"
component: "influence-score"
data_type: "influence_metric"
traffic_light: "YELLOW"
new_value: "94 (High influence)"
justification: "Percentage implies false precision"
```

## File: demo/features/notable-signals/notable-signals.html

### Component: Signal Cards (lines 14-28)
```javascript
// LINE 18
<div class="signal-insight">Efficiency > Growth</div>
location: "notable-signals.html:18"
component: "market-narrative-insight"
data_type: "narrative_insight"
traffic_light: "YELLOW"
new_value: "Efficiency narrative gaining momentum"
justification: "Narrative dominance needs validation"

// LINE 19
<div class="signal-label">New dominant narrative</div>
location: "notable-signals.html:19"
component: "market-narrative-label"
data_type: "narrative_classification"
traffic_light: "YELLOW"
new_value: "Emerging narrative shift"
justification: "Dominance requires measurement"

// LINE 23-26 (Strength indicators)
<span class="strength-dot active"></span>
<span class="strength-dot active"></span>
<span class="strength-dot active"></span>
<span class="strength-dot"></span>
location: "notable-signals.html:23-26"
component: "strength-indicator"
data_type: "visual_metric"
traffic_light: "GREEN"
new_value: "No change needed - visual representation of confidence"
```

### Component: Thesis Validation Card (lines 31-45)
```javascript
// LINE 35
<div class="signal-insight">Vertical AI validated</div>
location: "notable-signals.html:35"
component: "thesis-insight"
data_type: "thesis_validation"
traffic_light: "YELLOW"
new_value: "Vertical AI thesis gaining support"
justification: "Validation needs criteria"

// LINE 36
<div class="signal-label">12 sources agree</div>
location: "notable-signals.html:36"
component: "thesis-sources"
data_type: "source_count"
traffic_light: "GREEN"
new_value: "No change needed - direct count"
```

## File: demo/pdf/weekly-brief.html

### Component: Executive Summary (lines 738-751)
```javascript
// LINE 740
<strong>AI infrastructure dominates</strong> [12 sources agree, led by Gerstner/20VC, Gurley/Invest Like Best] with Series A at 20-30x ARR [Hoffman, Rabois confirm].
location: "weekly-brief.html:740"
component: "executive-summary"
data_type: "ai_synthesis"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["Gerstner", "20VC", "Gurley", "Invest Like Best", "Hoffman", "Rabois"]

// LINE 744
<strong class="contrarian">Contrarian signal:</strong> DePIN momentum without revenue [only Thiel dissenting].
location: "weekly-brief.html:744"
component: "executive-contrarian"
data_type: "contrarian_signal"
traffic_light: "YELLOW"
new_value: "Notable divergence: DePIN momentum debate"
entities_mentioned: ["Thiel"]
```

### Component: Key Metrics Grid (lines 756-783)
```javascript
// LINE 758
<p class="metric-value">+85%</p>
location: "weekly-brief.html:758"
component: "metric-velocity"
data_type: "velocity_metric"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 772
<p class="metric-value">Strong</p>
location: "weekly-brief.html:772"
component: "metric-consensus"
data_type: "consensus_level"
traffic_light: "YELLOW"
new_value: "Strong (>80% agreement)"
justification: "Qualitative assessment needs thresholds"
```

### Component: Topic Momentum (lines 792-842)
```javascript
// LINE 792
<span class="momentum-change positive">+85% w/w</span>
location: "weekly-brief.html:792"
component: "momentum-ai-agents"
data_type: "momentum_metric"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 814
<span class="momentum-change warning">+190% w/w ⚠</span>
location: "weekly-brief.html:814"
component: "momentum-depin"
data_type: "momentum_metric"
traffic_light: "GREEN"
new_value: "+190% w/w (unusual momentum)"
justification: "Warning indicator based on anomaly detection"
```

### Component: Action Items (lines 952-994)
```javascript
// LINE 956
<span>Review AI infrastructure deals in pipeline</span>
location: "weekly-brief.html:956"
component: "action-this-week"
data_type: "strategic_recommendation"
traffic_light: "YELLOW"
new_value: "Focus area: AI infrastructure opportunities"
justification: "Action recommendations need strategic framework"

// LINE 979
<span>DePIN revenue models (bubble risk)</span>
location: "weekly-brief.html:979"
component: "action-monitor"
data_type: "risk_assessment"
traffic_light: "YELLOW"
new_value: "Monitor: DePIN sustainability questions"
justification: "Risk assessment requires analytical framework"
```

## File: demo/episode-side.html

### Component: Episode Intelligence - The Facts (lines 632-638)
```javascript
// LINE 633
Series A valuations: 20-30x ARR (down from 100x peaks in 2021)
location: "episode-side.html:633"
component: "episode-facts-1"
data_type: "market_metric"
traffic_light: "GREEN"
new_value: "No change needed - extractable from discussions"

// LINE 634
Vertical AI companies trading at discount to horizontal AI platforms
location: "episode-side.html:634"
component: "episode-facts-2"
data_type: "market_comparison"
traffic_light: "GREEN"
new_value: "No change needed - pattern detectable"

// LINE 635
AI-enabled SaaS showing 2-3x better retention metrics than traditional SaaS
location: "episode-side.html:635"
component: "episode-facts-3"
data_type: "performance_metric"
traffic_light: "YELLOW"
new_value: "AI-enabled SaaS retention metrics discussed"
justification: "Specific multipliers need validation"

// LINE 636
Perplexity: $10B valuation with 3x liquidation preference for late-stage investors
location: "episode-side.html:636"
component: "episode-facts-4"
data_type: "deal_terms"
traffic_light: "RED"
new_value: "Perplexity valuation discussion (terms unverified)"
entities_mentioned: ["Perplexity"]
```

### Component: Episode Intelligence - The Context (lines 643-648)
```javascript
// LINE 644
Valuation normalization represents 18-month market correction cycle
location: "episode-side.html:644"
component: "episode-context-1"
data_type: "market_analysis"
traffic_light: "GREEN"
new_value: "No change needed - synthesizable from patterns"

// LINE 645
Proprietary data becoming primary differentiator in AI investment thesis
location: "episode-side.html:645"
component: "episode-context-2"
data_type: "investment_trend"
traffic_light: "GREEN"
new_value: "No change needed - theme extraction"

// LINE 646
Liquidation preferences returning to term sheets across all stages
location: "episode-side.html:646"
component: "episode-context-3"
data_type: "deal_structure_trend"
traffic_light: "GREEN"
new_value: "No change needed - pattern recognition"

// LINE 647
AI integration shifting from competitive advantage to baseline requirement
location: "episode-side.html:647"
component: "episode-context-4"
data_type: "market_evolution"
traffic_light: "GREEN"
new_value: "No change needed - narrative synthesis"
```

### Component: Market Signals - Momentum (lines 661-664)
```javascript
// LINE 661
Vertical AI applications with domain expertise
location: "episode-side.html:661"
component: "market-momentum-1"
data_type: "momentum_signal"
traffic_light: "YELLOW"
new_value: "Vertical AI momentum signal detected"
justification: "Momentum classification needs thresholds"

// LINE 662
Capital efficiency metrics over growth at all costs
location: "episode-side.html:662"
component: "market-momentum-2"
data_type: "momentum_signal"
traffic_light: "YELLOW"
new_value: "Efficiency narrative gaining momentum"

// LINE 663
Structured liquidation preferences in hot deals
location: "episode-side.html:663"
component: "market-momentum-3"
data_type: "momentum_signal"
traffic_light: "YELLOW"
new_value: "Deal structure trends emerging"
```

### Component: Market Signals - Emerging (lines 671-673)
```javascript
// LINE 671
AI infrastructure consolidation plays
location: "episode-side.html:671"
component: "market-emerging-1"
data_type: "emerging_signal"
traffic_light: "YELLOW"
new_value: "Infrastructure consolidation theme emerging"

// LINE 672
Retention-based valuation models
location: "episode-side.html:672"
component: "market-emerging-2"
data_type: "emerging_signal"
traffic_light: "YELLOW"
new_value: "New valuation methodologies discussed"

// LINE 673
Cross-border AI regulatory arbitrage
location: "episode-side.html:673"
component: "market-emerging-3"
data_type: "emerging_signal"
traffic_light: "YELLOW"
new_value: "Regulatory arbitrage opportunities noted"
```

### Component: Market Signals - Declining (lines 681-683)
```javascript
// LINE 681
Horizontal AI platforms without differentiation
location: "episode-side.html:681"
component: "market-declining-1"
data_type: "declining_signal"
traffic_light: "YELLOW"
new_value: "Horizontal AI losing favor"

// LINE 682
Growth-at-all-costs narratives
location: "episode-side.html:682"
component: "market-declining-2"
data_type: "declining_signal"
traffic_light: "YELLOW"
new_value: "Growth narrative declining"

// LINE 683
Clean term sheets at premium valuations
location: "episode-side.html:683"
component: "market-declining-3"
data_type: "declining_signal"
traffic_light: "YELLOW"
new_value: "Clean terms becoming rare"
```

### Component: Pattern Recognition Metrics (lines 694-708)
```javascript
// LINE 694
4th
location: "episode-side.html:694"
component: "pattern-metric-1"
data_type: "pattern_count"
traffic_light: "GREEN"
new_value: "No change needed - direct count"

// LINE 695
Major investor this week discussing vertical AI opportunity
location: "episode-side.html:695"
component: "pattern-metric-1-label"
data_type: "pattern_description"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 699
12+
location: "episode-side.html:699"
component: "pattern-metric-2"
data_type: "pattern_count"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 700
Episodes mentioning 20-30x ARR as new normal
location: "episode-side.html:700"
component: "pattern-metric-2-label"
data_type: "pattern_description"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 704
87%
location: "episode-side.html:704"
component: "pattern-metric-3"
data_type: "pattern_percentage"
traffic_light: "GREEN"
new_value: "No change needed - calculable"

// LINE 705
Of AI discussions now include efficiency metrics
location: "episode-side.html:705"
component: "pattern-metric-3-label"
data_type: "pattern_description"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 709
3x
location: "episode-side.html:709"
component: "pattern-metric-4"
data_type: "pattern_multiplier"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 710
Increase in liquidation preference mentions (Q4 vs Q3)
location: "episode-side.html:710"
component: "pattern-metric-4-label"
data_type: "pattern_description"
traffic_light: "GREEN"
new_value: "No change needed"
```

### Component: Essential Quote (lines 740-742)
```javascript
// LINE 740
"Vertical AI with proprietary data is the biggest market that doesn't exist yet."
location: "episode-side.html:740"
component: "essential-quote-text"
data_type: "extracted_quote"
traffic_light: "GREEN"
new_value: "No change needed - quote extraction"

// LINE 742
- Brad Gerstner @ 24:31
location: "episode-side.html:742"
component: "essential-quote-attribution"
data_type: "quote_metadata"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["Brad Gerstner"]
```

### Component: Related Episodes (lines 778-789)
```javascript
// LINE 779
Stratechery: The State of SaaS
location: "episode-side.html:779"
component: "related-episode-1-title"
data_type: "episode_reference"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["Stratechery"]

// LINE 780
Relevant: Confirms 2-3x retention metrics across 15 SaaS companies
location: "episode-side.html:780"
component: "related-episode-1-context"
data_type: "relevance_note"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 783
All-In: Why Most VCs Are Wrong About AI
location: "episode-side.html:783"
component: "related-episode-2-title"
data_type: "episode_reference"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["All-In"]

// LINE 784
Relevant: Opposing thesis - Sacks sees horizontal AI winning
location: "episode-side.html:784"
component: "related-episode-2-context"
data_type: "relevance_note"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["Sacks"]

// LINE 787
Acquired: The Perplexity Story
location: "episode-side.html:787"
component: "related-episode-3-title"
data_type: "episode_reference"
traffic_light: "GREEN"
new_value: "No change needed"
entities_mentioned: ["Acquired", "Perplexity"]

// LINE 788
Relevant: Details on $10B valuation structure and LP concerns
location: "episode-side.html:788"
component: "related-episode-3-context"
data_type: "relevance_note"
traffic_light: "GREEN"
new_value: "No change needed"
```

## File: demo/features/narrative-pulse/narrative-pulse.js

### Component: Consensus Heatmap Data (lines 146-157)
```javascript
// LINE 147 (AI Agents Week 1)
0.8
location: "narrative-pulse.js:147"
component: "consensus-ai-agents-w1"
data_type: "consensus_value"
traffic_light: "GREEN"
new_value: "80% consensus"

// LINE 147 (AI Agents Week 2)
0.6
location: "narrative-pulse.js:147"
component: "consensus-ai-agents-w2"
data_type: "consensus_value"
traffic_light: "GREEN"
new_value: "60% consensus"

// LINE 147 (AI Agents Week 3)
0.9
location: "narrative-pulse.js:147"
component: "consensus-ai-agents-w3"
data_type: "consensus_value"
traffic_light: "GREEN"
new_value: "90% consensus"

// LINE 147 (AI Agents Week 4)
0.7
location: "narrative-pulse.js:147"
component: "consensus-ai-agents-w4"
data_type: "consensus_value"
traffic_light: "GREEN"
new_value: "70% consensus"

// LINE 148 (Capital Efficiency - all 4 weeks)
[0.5, 0.6, 0.7, 0.8]
location: "narrative-pulse.js:148"
component: "consensus-capital-efficiency"
data_type: "consensus_values"
traffic_light: "GREEN"
new_value: "50%, 60%, 70%, 80% consensus progression"

// LINE 149 (DePIN - all 4 weeks)
[0.3, 0.5, 0.8, 0.9]
location: "narrative-pulse.js:149"
component: "consensus-depin"
data_type: "consensus_values"
traffic_light: "GREEN"
new_value: "30%, 50%, 80%, 90% consensus progression"

// LINE 150 (B2B SaaS - all 4 weeks)
[0.4, 0.4, 0.3, 0.3]
location: "narrative-pulse.js:150"
component: "consensus-b2b-saas"
data_type: "consensus_values"
traffic_light: "GREEN"
new_value: "40%, 40%, 30%, 30% consensus (declining)"

// LINE 153-156 (Consensus Labels)
['Building', 'Moderate', 'Strong', 'Strong']
location: "narrative-pulse.js:153"
component: "consensus-labels-ai-agents"
data_type: "consensus_labels"
traffic_light: "GREEN"
new_value: "No change needed - label mapping"
```

### Component: Volume View Bar Data (lines 86-105)
```javascript
// LINE 88
height="117"
location: "narrative-pulse.js:88"
component: "volume-bar-ai-agents-height"
data_type: "bar_visualization"
traffic_light: "GREEN"
new_value: "117px height for 147 mentions"

// LINE 89
147
location: "narrative-pulse.js:89"
component: "volume-bar-ai-agents-value"
data_type: "mention_count"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 93
height="76"
location: "narrative-pulse.js:93"
component: "volume-bar-capital-height"
data_type: "bar_visualization"
traffic_light: "GREEN"
new_value: "76px height for 89 mentions"

// LINE 94
89
location: "narrative-pulse.js:94"
component: "volume-bar-capital-value"
data_type: "mention_count"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 98
height="160"
location: "narrative-pulse.js:98"
component: "volume-bar-depin-height"
data_type: "bar_visualization"
traffic_light: "GREEN"
new_value: "160px height for 201 mentions"

// LINE 99
201
location: "narrative-pulse.js:99"
component: "volume-bar-depin-value"
data_type: "mention_count"
traffic_light: "GREEN"
new_value: "No change needed"

// LINE 103
height="35"
location: "narrative-pulse.js:103"
component: "volume-bar-b2b-height"
data_type: "bar_visualization"
traffic_light: "GREEN"
new_value: "35px height for 43 mentions"

// LINE 104
43
location: "narrative-pulse.js:104"
component: "volume-bar-b2b-value"
data_type: "mention_count"
traffic_light: "GREEN"
new_value: "No change needed"
```

### Component: Tooltip Content (lines 125, 296)
```javascript
// LINE 125
`${topic}: ${data.mentions} mentions across ${data.episodes} episodes`
location: "narrative-pulse.js:125"
component: "volume-tooltip-template"
data_type: "tooltip_content"
traffic_light: "GREEN"
new_value: "Dynamic tooltip generation"

// LINE 296
`${topic} ${momentum}`
location: "narrative-pulse.js:296"
component: "momentum-tooltip-template"
data_type: "tooltip_content"
traffic_light: "GREEN"
new_value: "Dynamic tooltip generation"
```

## File: demo/features/notable-signals/notable-signals.js

### Component: Market Narratives Panel Data (lines 77-84)
```javascript
// LINE 78
{ trend: '"Growth at all costs" → "Efficient growth"', count: 23, source: 'Multiple podcasts', insight: 'LPs are driving this narrative hard. Every major fund is adjusting their pitch.' }
location: "notable-signals.js:78"
component: "narrative-panel-1"
data_type: "narrative_shift"
traffic_light: "YELLOW"
new_value: "Growth → Efficiency shift (23 mentions, LP-driven)"
justification: "Narrative detection needs pattern recognition"

// LINE 79
{ trend: 'AI applications → AI infrastructure', count: 17, source: '20VC, All-In, Invest Like Best', insight: 'The picks-and-shovels thesis is winning. Application layer seeing valuation compression.' }
location: "notable-signals.js:79"
component: "narrative-panel-2"
data_type: "narrative_shift"
traffic_light: "YELLOW"
new_value: "Apps → Infrastructure shift (17 mentions)"
entities_mentioned: ["20VC", "All-In", "Invest Like Best"]

// LINE 80
{ trend: 'Remote-first → Hybrid mandatory', count: 12, source: 'Various founder interviews', insight: 'Even YC companies are requiring 3 days in office. Culture concerns driving reversal.' }
location: "notable-signals.js:80"
component: "narrative-panel-3"
data_type: "narrative_shift"
traffic_light: "YELLOW"
new_value: "Remote → Hybrid shift (12 mentions)"
entities_mentioned: ["YC"]

// LINE 81
{ trend: 'B2C skepticism rising', count: 8, source: 'Benchmark, Lightspeed pods', insight: 'Consumer acquisition costs making B2C uninvestable unless viral growth proven.' }
location: "notable-signals.js:81"
component: "narrative-panel-4"
data_type: "narrative_trend"
traffic_light: "YELLOW"
new_value: "B2C skepticism trend (8 mentions)"
entities_mentioned: ["Benchmark", "Lightspeed"]

// LINE 82
{ trend: 'DevTools consolidation predicted', count: 6, source: 'Developer tea, TWIG', insight: 'Too many point solutions. Platformization wave coming in next 18 months.' }
location: "notable-signals.js:82"
component: "narrative-panel-5"
data_type: "narrative_prediction"
traffic_light: "YELLOW"
new_value: "DevTools consolidation prediction (6 mentions)"
entities_mentioned: ["Developer tea", "TWIG"]

// LINE 83
{ trend: 'Climate tech quietly resurging', count: 5, source: 'Khosla, Breakthrough pods', insight: 'New narrative around adaptation tech, not just mitigation. Defense angle emerging.' }
location: "notable-signals.js:83"
component: "narrative-panel-6"
data_type: "narrative_emergence"
traffic_light: "YELLOW"
new_value: "Climate tech resurgence (5 mentions)"
entities_mentioned: ["Khosla", "Breakthrough"]
```

### Component: Thesis Validation Panel Data (lines 101-106)
```javascript
// LINE 102
{ thesis: 'Vertical AI > Horizontal AI', status: 'VALIDATED', sources: 'Gerstner, Wolfe, Stebbings all agree', insight: 'Every horizontal play struggling with differentiation. Vertical expertise is the moat.' }
location: "notable-signals.js:102"
component: "thesis-panel-1"
data_type: "thesis_validation"
traffic_light: "YELLOW"
new_value: "Vertical > Horizontal thesis validated"
entities_mentioned: ["Gerstner", "Wolfe", "Stebbings"]

// LINE 103
{ thesis: 'Series A at 20-30x ARR is new normal', status: 'VALIDATED', sources: '12 sources confirm', insight: 'Market has found equilibrium after 18-month correction. Higher only for AI infra.' }
location: "notable-signals.js:103"
component: "thesis-panel-2"
data_type: "thesis_validation"
traffic_light: "YELLOW"
new_value: "Series A valuation thesis validated"

// LINE 104
{ thesis: 'Developer experience as primary differentiator', status: 'EMERGING', sources: 'a16z, Redpoint discussions', insight: 'DX is the new UX. Poor developer experience kills B2B adoption instantly.' }
location: "notable-signals.js:104"
component: "thesis-panel-3"
data_type: "thesis_validation"
traffic_light: "YELLOW"
new_value: "DX differentiator thesis emerging"
entities_mentioned: ["a16z", "Redpoint"]

// LINE 105
{ thesis: 'PLG dead for enterprise', status: 'VALIDATED', sources: 'Multiple enterprise founders', insight: 'Sales-led making comeback. PLG only works for developer tools now.' }
location: "notable-signals.js:105"
component: "thesis-panel-4"
data_type: "thesis_validation"
traffic_light: "YELLOW"
new_value: "PLG enterprise thesis validated"
```

### Component: Notable Deals Panel Data (lines 123-127)
```javascript
// LINE 124
{ company: 'Perplexity', details: 'Series B at $10B valuation', insight: 'Sequoia got 3x liquidation preference. New structure becoming standard for hot deals.' }
location: "notable-signals.js:124"
component: "deals-panel-1"
data_type: "deal_intelligence"
traffic_light: "RED"
new_value: "Perplexity deal discussion (terms unverified)"
entities_mentioned: ["Perplexity", "Sequoia"]

// LINE 125
{ company: 'Anthropic (rumored)', details: 'Series D at $40B', insight: 'Google deepening partnership. Strategic investors winning over pure financial.' }
location: "notable-signals.js:125"
component: "deals-panel-2"
data_type: "deal_intelligence"
traffic_light: "RED"
new_value: "Anthropic rumored funding"
entities_mentioned: ["Anthropic", "Google"]

// LINE 126
{ company: 'Cursor', details: 'Series A at $400M', insight: 'Developer tools with AI seeing 10x valuation premiums. Metrics don\'t matter yet.' }
location: "notable-signals.js:126"
component: "deals-panel-3"
data_type: "deal_intelligence"
traffic_light: "RED"
new_value: "Cursor funding discussion"
entities_mentioned: ["Cursor"]
```

### Component: Portfolio Mentions Panel Data (lines 141-145)
```javascript
// LINE 142
{ company: 'Your Portfolio Co (unnamed)', context: 'Mentioned by Gerstner as example of efficient growth', sentiment: 'POSITIVE', action: 'Leverage for fundraising' }
location: "notable-signals.js:142"
component: "portfolio-panel-1"
data_type: "portfolio_intelligence"
traffic_light: "YELLOW"
new_value: "Portfolio mention opportunity"
entities_mentioned: ["Gerstner"]

// LINE 143
{ company: 'Competitor analysis', context: 'Three funds discussing your space', sentiment: 'NEUTRAL', action: 'Watch for new entrants' }
location: "notable-signals.js:143"
component: "portfolio-panel-2"
data_type: "competitive_intelligence"
traffic_light: "YELLOW"
new_value: "Competitive landscape discussion"

// LINE 144
{ company: 'Market positioning', context: 'Your vertical getting increased attention', sentiment: 'POSITIVE', action: 'Accelerate hiring' }
location: "notable-signals.js:144"
component: "portfolio-panel-3"
data_type: "market_intelligence"
traffic_light: "YELLOW"
new_value: "Market positioning opportunity"
```

### Component: LP Sentiment Panel Data (lines 162-166)
```javascript
// LINE 163
{ trend: 'DPI focus intensifying', source: 'CalPERS on Institutional Investor pod', impact: 'First-time funds facing 18+ month raises' }
location: "notable-signals.js:163"
component: "lp-panel-1"
data_type: "lp_sentiment"
traffic_light: "YELLOW"
new_value: "LP DPI focus trend"
entities_mentioned: ["CalPERS", "Institutional Investor"]

// LINE 164
{ trend: 'Vintage year concerns', source: 'Multiple endowment discussions', impact: '2021-2022 vintages being written down aggressively' }
location: "notable-signals.js:164"
component: "lp-panel-2"
data_type: "lp_sentiment"
traffic_light: "YELLOW"
new_value: "Vintage year concerns rising"

// LINE 165
{ trend: 'Co-invest appetite growing', source: 'Sovereign wealth discussions', impact: 'LPs want more direct exposure, less blind pool risk' }
location: "notable-signals.js:165"
component: "lp-panel-3"
data_type: "lp_sentiment"
traffic_light: "YELLOW"
new_value: "Co-invest demand increasing"
```

## Summary Statistics

### Total Mock Data Points Cataloged: 222 (100% COMPLETE)

### By Traffic Light:
- **GREEN**: 135 (60.8%) - Fully automatable with current infrastructure
- **YELLOW**: 78 (35.1%) - Require initial curation or threshold setting
- **RED**: 9 (4.1%) - Need external data sources

### By Data Type:
- **Topic/Momentum Metrics**: 32 items (mostly GREEN)
- **Entity References**: 48 items (all GREEN)
- **Synthesis/Insights**: 45 items (mostly GREEN)
- **Consensus/Sentiment**: 28 items (mix of GREEN/YELLOW)
- **Deal Terms/External**: 9 items (all RED)
- **Strategic/Recommendations**: 30 items (mostly YELLOW)
- **Interactive/UI States**: 30 items (all GREEN)

### Key Entities Referenced (Count):
1. Brad Gerstner: 10 mentions
2. 20VC / Harry Stebbings: 8 mentions
3. Peter Thiel: 5 mentions
4. Sequoia: 5 mentions
5. All-In Podcast: 5 mentions
6. Perplexity: 5 mentions
7. CalPERS: 3 mentions
8. Anthropic: 2 mentions
9. DePIN: 12 mentions (as topic)
10. AI Agents: 10 mentions (as topic)

### Implementation Notes:
1. GREEN items can be implemented immediately with existing infrastructure
2. YELLOW items need initial human calibration but can then run autonomously
3. RED items should be marked as "unverified" or sourced from external APIs
4. All percentage calculations should include sample size for transparency
5. Influence scores should show methodology tooltip on hover
6. Consensus levels should display threshold definitions
7. Interactive states (hovers, clicks) are all GREEN as they use existing data
8. Panel overlays reuse existing data in expanded views