// Data Gaps Audit for Synthea.ai Demo
// Generated: 2025-07-28
// Purpose: Document all missing data and hard-coded elements in the demo

window.dataGapsAudit = {
    // ============================================
    // AUDIT SUMMARY
    // ============================================
    summary: {
        auditDate: '2025-07-28',
        totalGapsFound: 15,
        criticalGaps: 6,
        dataFragmentation: 'SEVERE',
        recommendation: 'Consolidate all data into single master-data.js file',
        estimatedRefactorTime: '8-12 hours'
    },
    
    // ============================================
    // 1. PRIORITY BRIEFINGS - MISSING DATA
    // ============================================
    priorityBriefingGaps: {
        currentInDemoData: 3,
        actualInHTML: 9,
        missingCount: 6,
        location: 'demo/features/priority-briefings/priority-briefings.html',
        missingBriefings: [
            {
                id: 'briefing-4',
                priority: 'critical',
                priorityLabel: 'Portfolio Alert',
                podcast: 'Acquired',
                time: '1d ago',
                duration: '156 min',
                influence: 'High influence',
                title: 'The Nvidia Company Story: Part II',
                guest: 'Guest: Jensen Huang, CEO of Nvidia',
                keyInsights: [
                    'GPU architecture evolution mirrors platform shifts in tech history',
                    'Data center revenue now 80% of business, validating infrastructure thesis',
                    'AI training costs following Moore\'s Law in reverse - doubling every 2 years'
                ],
                signals: [
                    { type: 'thesis', text: '✓ Thesis Match: AI Infrastructure' },
                    { type: 'portfolio', text: '⚠ Competitive Intel: AMD positioning' }
                ]
            },
            {
                id: 'briefing-5',
                priority: 'opportunity',
                priorityLabel: 'Thesis Match',
                podcast: 'The Tim Ferriss Show',
                time: '1d ago',
                duration: '112 min',
                influence: '78% influence',
                title: 'Palmer Luckey on Defense Tech\'s Golden Age',
                guest: 'Guest: Palmer Luckey, Founder of Anduril',
                keyInsights: [
                    'Defense tech hitting inflection point with $1.5B Series F at $8.5B valuation',
                    'Bipartisan support creating unprecedented 10-year visibility for contracts',
                    'Software eating defense: 70% of value now in autonomous systems'
                ],
                signals: [
                    { type: 'market', text: '◆ Market Signal: Defense Tech' },
                    { type: 'thesis', text: '✓ Thesis Match: Dual-Use Technology' }
                ]
            },
            {
                id: 'briefing-6',
                priority: 'elevated',
                priorityLabel: 'Market Signal',
                podcast: 'Indie Hackers',
                time: '2d ago',
                duration: '89 min',
                influence: '71% influence',
                title: 'AI Coding Tools: The $10B Market Nobody Saw Coming',
                guest: 'Guest: Amjad Masad, CEO of Replit',
                keyInsights: [
                    'GitHub Copilot at $100M ARR in under 2 years, fastest B2B growth ever',
                    'Developer productivity tools seeing 150% net revenue retention',
                    'Next frontier: AI agents that ship production code autonomously'
                ],
                signals: [
                    { type: 'market', text: '◆ Dev Tools Opportunity' },
                    { type: 'market', text: '◆ AI Applications' }
                ]
            },
            {
                id: 'briefing-7',
                priority: 'elevated',
                priorityLabel: 'Market Signal',
                podcast: 'This Week in Startups',
                time: '2d ago',
                duration: '95 min',
                influence: '74% influence',
                title: 'OpenAI\'s Path to $100B: Lessons for AI Startups',
                guest: 'Guest: Sam Altman, CEO of OpenAI',
                keyInsights: [
                    'Revenue run rate hit $3.4B, up from $1.6B six months ago',
                    'Enterprise adoption accelerating: 92% of Fortune 500 now customers',
                    'Margin profile improving as inference costs drop 90% year-over-year'
                ],
                signals: [
                    { type: 'market', text: '◆ AI Leaders' },
                    { type: 'market', text: '◆ Market Expansion' }
                ]
            },
            {
                id: 'briefing-8',
                priority: 'opportunity',
                priorityLabel: 'Thesis Match',
                podcast: 'The Knowledge Project',
                time: '3d ago',
                duration: '102 min',
                influence: 'Medium influence',
                title: 'Climate Tech\'s Profitability Turn',
                guest: 'Guest: Ryan Orbuch, Partner at Lowercarbon Capital',
                keyInsights: [
                    'First wave of climate unicorns reaching profitability without subsidies',
                    'Industrial heat and carbon capture seeing 70% gross margins',
                    'LP interest surging: $45B allocated to climate funds in 2024'
                ],
                signals: [
                    { type: 'thesis', text: '✓ Climate Tech' },
                    { type: 'market', text: '◆ Sustainability' }
                ]
            },
            {
                id: 'briefing-9',
                priority: 'opportunity',
                priorityLabel: 'Thesis Match',
                podcast: 'BG2',
                time: '3d ago',
                duration: '118 min',
                influence: '65% influence',
                title: 'The New Physics of Venture: Power Laws in the AI Era',
                guest: 'Guest: Brad Gerstner & Bill Gurley',
                keyInsights: [
                    'Traditional 10x fund returns becoming 100x in AI-native companies',
                    'Capital efficiency paradox: AI companies need less but command more',
                    'Warning signs: Late-stage valuations disconnecting from fundamentals'
                ],
                signals: [
                    { type: 'lp', text: '◇ Fund Strategy' },
                    { type: 'market', text: '◆ Valuation Trends' }
                ]
            }
        ]
    },
    
    // ============================================
    // 2. NARRATIVE FEED - HARD-CODED DATA
    // ============================================
    narrativeFeedGaps: {
        issue: 'Entirely hard-coded in HTML, not using demo-data.js',
        location: 'demo/features/narrative-feed/narrative-feed.html',
        existingInDemoData: true,
        butNotUsed: 'feedData exists in demo-data.js but component uses hard-coded HTML',
        hardCodedEntries: 5,
        recommendation: 'Refactor to use JavaScript data binding'
    },
    
    // ============================================
    // 3. CHART DATA - FRAGMENTED SOURCES
    // ============================================
    chartDataGaps: {
        issue: 'Chart data split across 3 different sources',
        sources: {
            'demo-data.js': {
                contains: 'Basic momentum data only',
                missing: 'Volume data, comprehensive time ranges',
                structure: 'window.chartViewData with consensusLevels only'
            },
            'narrative-pulse-data.js': {
                contains: 'Complete 7/30/90-day data',
                structure: 'window.narrativePulseData with sevenDayData, thirtyDayData, ninetyDayData',
                features: ['volume bars', 'consensus heatmaps', 'momentum curves', 'quotes by date']
            },
            'narrative-pulse.js': {
                contains: 'Hard-coded consensus sentiment data',
                location: 'Lines 57-100+',
                structure: 'consensusData object with advocates and dissent info'
            }
        },
        volumeDataStructure: {
            description: 'Missing from demo-data.js but exists in narrative-pulse-data.js',
            example: {
                'AI Agents': {
                    '7d': {
                        dataPoints: [3, 1, 2, 6, 8, 9, 6],
                        dailyAverage: 5.0,
                        peakDay: 'Wed 28',
                        quotes: {
                            'Thu 22': 'Early week momentum building',
                            'Fri 23': 'Gerstner mentions agent infrastructure on All-In',
                            // ... more daily quotes
                        }
                    },
                    '30d': {
                        dataPoints: [8, 15, 22, 35],
                        weeklyNarrative: {
                            'Aug 1-7': 'Early whispers about agent potential',
                            'Aug 8-14': 'Gerstner validates thesis, momentum builds',
                            // ... more weekly narratives
                        }
                    },
                    '90d': {
                        dataPoints: [15, 16, 17, 18, 19, 20, 22, 24, 26, 24, 27, 30, 35],
                        narrative: 'From 15 mentions in early June to 35 by late August',
                        keyInflectionPoint: 'Week 11: Crossed 15 mentions, tier-1 VCs aligned'
                    }
                }
            }
        }
    },
    
    // ============================================
    // 4. SEARCH FUNCTIONALITY - HARD-CODED
    // ============================================
    searchDataGaps: {
        issue: 'All search functionality hard-coded in demo.html',
        location: 'demo/demo.html lines 114-159',
        hardCodedElements: {
            suggestions: [
                "What's the consensus on vertical AI?",
                "Series A valuations this month",
                "Brad Gerstner latest thesis"
            ],
            trendingTopics: [
                { name: 'AI Agents', trend: '↑85% w/w' },
                { name: 'Capital efficiency metrics', trend: '↑17% w/w' },
                { name: 'DePIN infrastructure', trend: '↑190% w/w' }
            ],
            quickFilters: [
                'Consensus views',
                'Contrarian takes',
                'Emerging themes',
                'Deal mentions',
                'Key people'
            ]
        },
        recommendation: 'Move to data file for easy content updates'
    },
    
    // ============================================
    // 5. INTELLIGENCE BRIEF - EXPANDED DATA
    // ============================================
    intelligenceBriefGaps: {
        issue: 'Sidebar metrics use demo-data.js but expanded view data is embedded',
        currentStructure: 'Uses window.sidebarMetrics',
        missingElements: {
            expandedConsensus: 'Hard-coded in component',
            contrarian: 'Hard-coded in component',
            blindspots: 'Hard-coded in component'
        }
    },
    
    // ============================================
    // 6. NOTABLE SIGNALS - PANEL DATA
    // ============================================
    notableSignalsGaps: {
        issue: 'Panel expansion data is separate from main counts',
        currentStructure: 'window.signalCounts for counts, window.signalPanelData for details',
        recommendation: 'Combine into single nested structure'
    },
    
    // ============================================
    // 7. PODCAST FILTER OPTIONS
    // ============================================
    podcastFilterGaps: {
        issue: 'Podcast filter options hard-coded in priority-briefings.html',
        location: 'Lines 13-25',
        hardCodedOptions: [
            'Curated for You',
            'All Episodes',
            '20VC with Harry Stebbings',
            'Stratechery',
            'Invest Like the Best',
            'Acquired',
            'The Tim Ferriss Show',
            'Indie Hackers',
            'This Week in Startups',
            'The Knowledge Project',
            'BG2'
        ],
        recommendation: 'Generate from unique podcast names in briefings data'
    },
    
    // ============================================
    // 8. HEADER TICKER
    // ============================================
    headerTickerGaps: {
        issue: 'Limited ticker data',
        current: 'Only 3 items in window.tickerData',
        recommendation: 'Expand to 5-7 rotating metrics'
    },
    
    // ============================================
    // 9. TIME RANGE CONFIGURATIONS
    // ============================================
    timeRangeGaps: {
        issue: 'Time range logic hard-coded in narrative-pulse.js',
        location: 'timeRangeConfigs object lines 20-36',
        hardCodedRanges: {
            '7 days': { dateLabels: ['Aug 22', 'Aug 23', '...'], dataPoints: 7 },
            '30 days': { dateLabels: ['Aug 1-7', 'Aug 8-14', '...'], dataPoints: 4 },
            '90 days': { dateLabels: ['Jun 5', 'Jun 12', '...'], dataPoints: 13 }
        },
        recommendation: 'Move to data file with dynamic date generation'
    },
    
    // ============================================
    // 10. CONSENSUS SENTIMENT DATA
    // ============================================
    consensusSentimentGaps: {
        issue: 'Consensus sentiment data hard-coded in narrative-pulse.js',
        location: 'consensusData object starting line 57',
        structure: {
            'AI Agents': {
                'Aug 7': { 
                    positive: 70, 
                    neutral: 7, 
                    negative: 2,
                    advocates: [
                        { name: 'Brad Gerstner', firm: 'Altimeter' },
                        { name: 'Reid Hoffman', firm: 'Greylock' }
                    ]
                }
            }
        },
        recommendation: 'Integrate with main chart data structure'
    },
    
    // ============================================
    // REFACTORING RECOMMENDATIONS
    // ============================================
    refactoringPlan: {
        priority: 'HIGH',
        approach: 'Create single master-data.js file',
        steps: [
            '1. Create new master-data.js with comprehensive structure',
            '2. Migrate all hard-coded HTML data to JavaScript',
            '3. Consolidate chart data from 3 sources into one',
            '4. Update components to read from single data source',
            '5. Remove redundant data files',
            '6. Add data validation layer'
        ],
        benefits: [
            'Single source of truth for all content',
            'Easy content updates without code changes',
            'Reduced file hunting for developers',
            'Better maintainability',
            'Preparation for CMS integration'
        ],
        estimatedStructure: `
window.masterData = {
    // All header/ticker data
    header: {
        ticker: [...],
        search: {
            suggestions: [...],
            trending: [...],
            filters: [...]
        }
    },
    
    // Complete chart data for all views
    narrativePulse: {
        topics: [...],
        chartData: {
            '7d': {...},
            '30d': {...},
            '90d': {...}
        }
    },
    
    // All 9 priority briefings
    priorityBriefings: [...],
    
    // All narrative feed entries
    narrativeFeed: [...],
    
    // Combined signal data
    notableSignals: {
        counts: {...},
        details: {...}
    },
    
    // Complete sidebar data
    intelligenceBrief: {
        summary: {...},
        expanded: {...},
        metrics: {...}
    }
};`
    }
};

console.log('Data Gaps Audit loaded. Total gaps found:', window.dataGapsAudit.summary.totalGapsFound);
console.log('Critical gaps:', window.dataGapsAudit.summary.criticalGaps);
console.log('Recommendation:', window.dataGapsAudit.summary.recommendation);