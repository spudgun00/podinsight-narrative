// PatternFlow - Crypto Intelligence Demo Data
// All demo data extracted from demo.html for maintainability

// ============================================
// 1. TOPIC VELOCITY DATA
// ============================================
window.topics = {
    'RWAs': { 
        color: '#9333ea', 
        momentum: '+420%', 
        mentions: 312, 
        episodes: 42 
    },
    'ETH Restaking': { 
        color: '#3b82f6', 
        momentum: '+238%', 
        mentions: 287, 
        episodes: 38 
    },
    'Bitcoin L2s': { 
        color: '#f97316', 
        momentum: '+187%', 
        mentions: 156, 
        episodes: 28 
    },
    'Memecoins': { 
        color: '#eab308', 
        momentum: '-45%', 
        mentions: 89, 
        episodes: 15 
    }
};

// ============================================
// 2. NARRATIVE FEED DATA
// ============================================
window.feedData = [
    {
        id: 'feed-1',
        time: '3h ago',
        event: 'RWA tokenization reaching consensus across 8 major sources',
        category: 'consensus',
        expansion: {
            sources: [
                {
                    name: 'Raoul Pal on The Journey Man',
                    time: '3h ago',
                    quote: 'Tokenized treasuries are the gateway drug. Once institutions taste 24/7 settlement, there\'s no going back.'
                },
                {
                    name: 'Bankless w/ Larry Fink',
                    time: '6h ago',
                    quote: 'We\'re tokenizing $10 billion this quarter alone. The efficiency gains are undeniable.'
                },
                {
                    name: 'What Bitcoin Did',
                    time: '1d ago',
                    quote: 'Every asset will be tokenized. The question isn\'t if, it\'s which chain wins.'
                }
            ],
            dissent: {
                name: 'Arthur Hayes on Unchained',
                time: '2d ago',
                quote: 'Everyone\'s rushing into RWAs at the top. Real alpha is in pure crypto plays.'
            }
        }
    },
    {
        id: 'feed-2',
        time: '5h ago',
        event: 'Vitalik diverges from L2 scaling consensus, proposes L3 focus',
        category: 'divergence',
        expansion: {
            contrarian: {
                name: 'Vitalik on Bankless',
                time: '8h ago',
                quote: 'L2s are becoming too centralized. The real scaling solution is app-specific L3s with shared security.'
            },
            mainstream: [
                {
                    name: 'Arbitrum team (multiple podcasts)',
                    time: 'This week',
                    quote: 'L2s are just getting started. We\'re seeing 100x cost reduction already.'
                },
                {
                    name: 'Polygon leadership on Empire',
                    time: '4d ago',
                    quote: 'L2 dominance is inevitable. L3s add unnecessary complexity.'
                }
            ]
        }
    },
    {
        id: 'feed-3',
        time: '1d ago',
        event: 'Restaking yields mentioned 31 times as sustainable income source',
        category: 'trend',
        expansion: {
            pattern: [],
            momentum: '31 mentions this week vs. 9 mentions last week (+244%)'
        }
    },
    {
        id: 'feed-4',
        time: '1d ago',
        event: 'Major funds rotating from DeFi blue chips to RWA protocols',
        category: 'whale-intel',
        expansion: {
            indicators: [],
            impact: 'Aave, Compound seeing outflows. Ondo, Centrifuge seeing massive inflows.'
        }
    },
    {
        id: 'feed-5',
        time: '2d ago',
        event: 'Bitcoin L2 thesis validated by Muneeb Ali, Eric Wall, Udi Wertheimer',
        category: 'pattern',
        expansion: {
            validation: [],
            implications: '3 previously skeptical voices now building on Bitcoin. Stacks seeing 400% developer growth.'
        }
    }
];

// ============================================
// 3. SIGNAL COUNTS
// ============================================
window.signalCounts = {
    marketNarratives: {
        count: 127,
        trending: '↑ 34 from last week',
        label: 'Narrative Shifts'
    },
    thesisValidation: {
        count: 42,
        trending: '↑ 12 reaching validation',
        label: 'Alpha Signals'
    },
    notableDeals: {
        count: 23,
        trending: '8 major launches',
        label: 'Token Launches & Raises'
    },
    portfolioMentions: {
        count: 31,
        trending: '↑ 7 competitive threats',
        label: 'Protocol Intelligence'
    },
    lpSentiment: {
        count: 18,
        trending: '↓ Risk-off mode emerging',
        label: 'Smart Money Flows'
    }
};

// ============================================
// 4. PRIORITY BRIEFINGS DATA
// ============================================
window.priorityBriefings = [
    {
        id: 'briefing-1',
        priority: 'critical',
        priorityLabel: 'Portfolio Alert',
        podcast: 'Bankless',
        time: '3h ago',
        duration: '89 min',
        influence: 'High (96)',
        title: 'Why Every Asset Will Be Tokenized',
        guest: 'Larry Fink, CEO of BlackRock',
        keyInsights: [
            'BlackRock tokenizing $10B in treasuries this quarter alone',
            '24/7 settlement and instant liquidity changing institutional mindset',
            'Ethereum becoming the default settlement layer for RWAs'
        ],
        signals: [
            { type: 'thesis', text: '✓ Thesis Match: RWA tokenization accelerating' },
            { type: 'portfolio', text: '⚠ Portfolio Alert: Your protocol mentioned by name' }
        ]
    },
    {
        id: 'briefing-2',
        priority: 'opportunity',
        priorityLabel: 'Alpha Signal',
        podcast: 'What Bitcoin Did',
        time: '12h ago',
        duration: '76 min',
        influence: 'High (89)',
        title: 'Bitcoin L2s: The Next Trillion Dollar Opportunity',
        guest: 'Muneeb Ali, Founder of Stacks',
        keyInsights: [
            'Bitcoin DeFi TVL crossed $2B, growing 400% quarterly',
            'Ordinals proved Bitcoin users want more functionality',
            'Major exchanges integrating Bitcoin L2 support Q4 2025'
        ],
        signals: [
            { type: 'market', text: '◆ Market Signal: Bitcoin ecosystem expansion' }
        ]
    },
    {
        id: 'briefing-3',
        priority: 'elevated',
        priorityLabel: 'Narrative Shift',
        podcast: 'The Defiant',
        time: '1d ago',
        duration: '64 min',
        influence: 'High (84)',
        title: 'Why I\'m Rotating Everything to Restaking',
        guest: 'Su Zhu, Three Arrows Capital (Reformed)',
        keyInsights: [
            'Sustainable 15-25% yields through ETH restaking changing the game',
            'Risk-adjusted returns beating everything in TradFi',
            'EigenLayer TVL passing $40B, still early days'
        ],
        signals: [
            { type: 'whale', text: '◇ Whale Intel: Major funds rotating to restaking' }
        ]
    }
];

// ============================================
// 5. SIDEBAR METRICS
// ============================================
window.sidebarMetrics = {
    // Weekly Intelligence Brief
    brief: {
        hoursAnalyzed: 876,
        lastUpdated: '42 mins ago',
        collapsed: 'RWA tokenization dominates [8 sources agree, led by Fink/Bankless, Pal/Journey Man] with institutions tokenizing billions monthly. Notable divergence: Vitalik challenges L2 consensus, proposes L3 focus. Blindspot: Privacy tech renaissance as regulations clarify.',
        expanded: {
            consensus: [
                {
                    title: 'RWAs are the next trillion-dollar narrative',
                    sources: 'Fink/Bankless, Pal/Journey Man, multiple DeFi podcasts',
                    detail: 'Tokenized treasuries offering instant settlement winning institutional adoption'
                },
                {
                    title: 'Restaking sustainable yields changing DeFi',
                    sources: 'Su Zhu/Defiant, multiple yield farmers confirm 15-25% APY',
                    detail: 'EigenLayer model being copied by every major protocol'
                },
                {
                    title: 'Bitcoin programmability finally happening',
                    sources: 'Muneeb/WBD, Eric Wall, Udi all building on Bitcoin',
                    detail: 'Bitcoin DeFi TVL crossed $2B, L2s gaining real traction'
                }
            ],
            contrarian: [
                {
                    title: 'Memecoins dead, quality projects rising',
                    sources: 'Cobie/UpOnly dissenting from CT consensus',
                    detail: 'Smart money rotating to revenue-generating protocols'
                },
                {
                    title: 'L3s > L2s according to Vitalik',
                    sources: 'Vitalik/Bankless challenging entire L2 ecosystem',
                    detail: 'App-specific L3s could obsolete general purpose L2s'
                }
            ],
            blindspots: [
                {
                    title: 'Privacy tech quietly gaining enterprise adoption',
                    sources: 'ZK Podcast deep dives, zero coverage elsewhere',
                    detail: 'Regulatory clarity making confidential DeFi possible'
                },
                {
                    title: 'AI agents accumulating significant treasuries',
                    sources: 'Truth Terminal has $300k, others following',
                    detail: 'Autonomous AI economy forming without human intervention'
                }
            ]
        }
    },
    
    // Velocity Tracking
    velocityTracking: [
        { theme: 'RWAs', change: '+420% w/w', direction: 'positive' },
        { theme: 'ETH Restaking', change: '+238% w/w', direction: 'positive' },
        { theme: 'Bitcoin L2s', change: '+187% w/w', direction: 'positive' },
        { theme: 'Memecoins', change: '-45% w/w', direction: 'negative' },
        { theme: 'AI x Crypto', change: '+156% w/w', direction: 'positive' }
    ],
    
    // Influence Metrics
    influenceMetrics: [
        { name: 'Vitalik Buterin', score: 'High (98)' },
        { name: 'Raoul Pal', score: 'High (92)' },
        { name: 'Larry Fink', score: 'High (89)' },
        { name: 'Arthur Hayes', score: 'Medium (76)' },
        { name: 'Cobie', score: 'Medium (71)' }
    ],
    
    // Consensus Monitor
    consensusMonitor: [
        { topic: 'RWAs', level: 'Peak (>90% agreement)' },
        { topic: 'Restaking Yields', level: 'Strong (>80% agreement)' },
        { topic: 'Bitcoin L2s', level: 'Building (60-80% agreement)' },
        { topic: 'Memecoins', level: 'Weak (<40% agreement)' }
    ],
    
    // Topic Correlations
    topicCorrelations: [
        { topics: 'RWAs + Institutional', percentage: 84 },
        { topics: 'Restaking + Yield', percentage: 76 },
        { topics: 'AI + Autonomous', percentage: 68 },
        { topics: 'Privacy + Enterprise', percentage: 52 }
    ]
};

// ============================================
// 6. SIGNAL PANEL DETAILED DATA
// ============================================
window.signalPanelData = {
    'market-narratives': [
        { 
            trend: 'DeFi → RWAs shift', 
            count: 47, 
            source: 'Multiple podcasts', 
            insight: 'Institutional entry driving narrative. Yield farming out, treasury tokenization in.' 
        },
        { 
            trend: 'Monolithic → Modular shift', 
            count: 38, 
            source: 'Bankless, Bell Curve, Empire', 
            insight: 'Celestia\'s success proving modular thesis. Every L1 scrambling to modularize.' 
        },
        { 
            trend: 'NFT → Gaming pivot', 
            count: 29, 
            source: 'Various gaming podcasts', 
            insight: 'NFT projects pivoting to gaming. Ownership narrative evolving to utility.' 
        },
        { 
            trend: 'Memecoin exhaustion', 
            count: 24, 
            source: 'UpOnly, Cobie streams', 
            insight: 'Retail fatigue after 1000x plays disappeared. Smart money rotating to infrastructure.' 
        },
        { 
            trend: 'Privacy tech resurgence', 
            count: 18, 
            source: 'ZK Podcast, Bankless', 
            insight: 'Regulatory clarity making privacy tech investable again. ZK everything.' 
        },
        { 
            trend: 'AI agents using crypto rails', 
            count: 15, 
            source: 'AI x Crypto pods', 
            insight: 'First working examples live. Truth Terminal has $300k treasury, trades autonomously.' 
        }
    ],
    
    'thesis-validation': [
        { 
            thesis: 'Restaking > Liquid staking', 
            status: 'GAINING VALIDATION', 
            sources: 'EigenLayer, Babylon, Symbiotic all over $5B TVL', 
            insight: 'Native yields plus restaking rewards creating sustainable 15-25% APY.' 
        },
        { 
            thesis: 'Bitcoin programmability via L2s', 
            status: 'GAINING VALIDATION', 
            sources: 'Lightning, Stacks, BitVM showing traction', 
            insight: 'Bitcoin DeFi TVL crossed $2B. The orange coin is waking up.' 
        },
        { 
            thesis: 'Perp DEXs > Spot DEXs', 
            status: 'VALIDATED', 
            sources: 'dYdX, GMX, Vertex data', 
            insight: 'Perps volume 10x spot. Traders want leverage, not just swaps.' 
        },
        { 
            thesis: 'Chain abstraction critical', 
            status: 'EARLY SIGNALS', 
            sources: 'Particle, Socket discussions', 
            insight: 'Users hate bridging. Winners will abstract chains entirely.' 
        }
    ],
    
    'notable-deals': [
        { 
            company: 'EigenLayer', 
            details: 'Token launch at $15B FDV', 
            insight: 'Restaking narrative validated. Every L1 launching restaking now.*' 
        },
        { 
            company: 'Monad (rumored)', 
            details: 'Strategic round at $3B valuation', 
            insight: 'Parallel EVM attracting massive interest. Jump and Paradigm leading.' 
        },
        { 
            company: 'Movement Labs', 
            details: 'Seed round at $300M', 
            insight: 'Move language gaining traction. Aptos ecosystem expanding rapidly.' 
        }
    ],
    
    'portfolio-mentions': [],
    
    'whale-sentiment': [
        { 
            trend: 'Rotation to Bitcoin', 
            source: 'On-chain data + podcast discussions', 
            impact: 'BTC dominance hitting 58%, highest since 2021' 
        },
        { 
            trend: 'Stablecoin yields priority', 
            source: 'Multiple DeFi podcasts', 
            impact: 'USDC/USDT pools seeing massive inflows at 15% APY' 
        },
        { 
            trend: 'High FDV tokens underperforming', 
            source: 'Cobie, Hsaka discussions', 
            impact: 'High FDV, low float tokens getting crushed. Community coins outperforming 10x' 
        }
    ]
};

// ============================================
// 7. CHART DATA (for dynamic views)
// ============================================
window.chartViewData = {
    // Consensus levels for heatmap view
    consensusLevels: [
        [0.9, 0.8, 0.95, 0.92],  // RWAs
        [0.7, 0.8, 0.85, 0.9],  // ETH Restaking
        [0.4, 0.6, 0.7, 0.8],  // Bitcoin L2s
        [0.5, 0.5, 0.3, 0.3]   // Memecoins
    ],
    
    consensusLabels: [
        ['Building', 'Strong', 'Peak', 'Peak'],
        ['Moderate', 'Strong', 'Strong', 'Peak'],
        ['Weak', 'Building', 'Moderate', 'Strong'],
        ['Building', 'Building', 'Weak', 'Weak']
    ]
};

// ============================================
// 8. HEADER TICKER DATA
// ============================================
window.tickerData = {
    items: [
        { label: 'RWAs', value: '↑420%' },
        { label: 'ETH Restaking', value: '↑238%' },
        { label: 'Alpha Detected', value: '127' }
    ]
};

console.log('Demo data loaded successfully');