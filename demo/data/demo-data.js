// VCPulse - Venture Capital Intelligence Demo Data
// All demo data extracted from demo.html for maintainability

// ============================================
// 1. TOPIC VELOCITY DATA
// ============================================
window.topics = {
    'AI Agents': { 
        color: '#4a7c59', 
        momentum: '+85%', 
        mentions: 147, 
        episodes: 23 
    },
    'Capital Efficiency': { 
        color: '#f4a261', 
        momentum: '+17%', 
        mentions: 89, 
        episodes: 31 
    },
    'DePIN': { 
        color: '#5a6c8c', 
        momentum: '+190%', 
        mentions: 201, 
        episodes: 18 
    },
    'B2B SaaS': { 
        color: '#c77d7d', 
        momentum: '+3%', 
        mentions: 43, 
        episodes: 12 
    }
};

// ============================================
// 2. NARRATIVE FEED DATA
// ============================================
window.feedData = [
    {
        id: 'feed-1',
        time: '2h ago',
        event: 'AI infrastructure preference emerging across 5 tier-1 sources',
        category: 'consensus',
        expansion: {
            sources: [
                {
                    name: '20VC w/ Brad Gerstner',
                    time: '2h ago',
                    quote: 'Infrastructure is eating the world, not apps. We\'re seeing 10x better unit economics in picks-and-shovels plays.'
                },
                {
                    name: 'All-In Podcast',
                    time: '5h ago',
                    quote: 'Every portfolio company wants AI features, but the real money is in the infrastructure layer.'
                },
                {
                    name: 'Invest Like the Best',
                    time: '1d ago',
                    quote: 'LPs are now explicitly asking for infrastructure allocation. It\'s becoming a separate mandate.'
                }
            ],
            dissent: {
                name: 'Peter Thiel on Founders Fund',
                time: '2d ago',
                quote: 'When everyone rushes to the same conclusion, that\'s usually when the opportunity has passed.'
            }
        }
    },
    {
        id: 'feed-2',
        time: '5h ago',
        event: 'Peter Thiel diverges from mainstream AGI timeline consensus',
        category: 'divergence',
        expansion: {
            contrarian: {
                name: 'Peter Thiel on Tim Ferriss Show',
                time: '5h ago',
                quote: 'Everyone\'s talking about AGI in 2-3 years. I think we\'re seeing a classic bubble mentality. The real timeline is decades, not years.'
            },
            mainstream: [
                {
                    name: 'Sam Altman (multiple podcasts)',
                    time: 'This week',
                    quote: 'AGI could happen much sooner than most people think. We\'re measuring progress in months, not years.'
                },
                {
                    name: 'Demis Hassabis on Lex Fridman',
                    time: '3d ago',
                    quote: 'The pace of progress suggests we\'re closer than ever. 2030 is conservative.'
                }
            ]
        }
    },
    {
        id: 'feed-3',
        time: '1d ago',
        event: 'Developer experience mentioned 12 times as key differentiator',
        category: 'trend',
        expansion: {
            pattern: [
                {
                    name: 'a16z Podcast',
                    time: '1d ago',
                    quote: 'DX is the new UX. If developers hate your tool, you\'re dead in the water.'
                },
                {
                    name: 'Software Engineering Daily',
                    time: '1d ago',
                    quote: 'We\'re seeing 5x adoption rates when the developer experience is prioritized from day one.'
                },
                {
                    name: 'Lenny\'s Podcast',
                    time: '2d ago',
                    quote: 'Even in B2B SaaS, the developer is often the champion. Ignore them at your peril.'
                }
            ],
            momentum: '12 mentions this week vs. 3 mentions last week (+300%)'
        }
    },
    {
        id: 'feed-4',
        time: '1d ago',
        event: 'LP sentiment: CalPERS emphasizing DPI metrics',
        category: 'lp-intel',
        expansion: {
            indicators: [
                {
                    name: 'Institutional Investor Podcast',
                    time: '1d ago',
                    quote: 'CalPERS is done waiting for paper gains. They want DPI, and they want it now.'
                },
                {
                    name: 'StrictlyVC Event Coverage',
                    time: '2d ago',
                    quote: 'Multiple endowments are pausing new commitments until they see distributions.'
                }
            ],
            impact: 'First-time funds facing 18+ month raises. Established funds getting 50% of target.'
        }
    },
    {
        id: 'feed-5',
        time: '2d ago',
        event: 'Vertical AI thesis validated by Brad Gerstner, Josh Wolfe, Harry Stebbings',
        category: 'pattern',
        expansion: {
            validation: [
                {
                    name: 'Brad Gerstner on BG2',
                    time: '2d ago',
                    quote: 'Horizontal AI is a race to zero. Vertical AI with domain expertise is where fortunes will be made.'
                },
                {
                    name: 'Josh Wolfe on TWIG',
                    time: '2d ago',
                    quote: 'We\'re only investing in AI companies that own the full stack in their vertical.'
                },
                {
                    name: 'Harry Stebbings on 20VC',
                    time: '3d ago',
                    quote: 'Every horizontal AI company we passed on is now struggling. Every vertical play is thriving.'
                }
            ],
            implications: '3 major funds have pivoted their AI thesis in the last 30 days. Watch for vertical-specific funds launching Q1.'
        }
    }
];

// ============================================
// 3. SIGNAL COUNTS
// ============================================
window.signalCounts = {
    marketNarratives: {
        count: 47,
        trending: '↑ 14 from last week',
        label: 'Shifting Themes'
    },
    thesisValidation: {
        count: 14,
        trending: '↑ 3 reaching validation threshold',
        label: 'Consensus Signals'
    },
    notableDeals: {
        count: 9,
        trending: '3 unicorns',
        label: 'Tracked Rounds'
    },
    portfolioMentions: {
        count: 17,
        trending: '↑ 2 competitive threats',
        label: 'Company Discussions'
    },
    lpSentiment: {
        count: 5,
        trending: '↓ Sentiment trending cautious',
        label: 'Notable Shifts'
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
        podcast: '20VC with Harry Stebbings',
        time: '2h ago',
        duration: '72 min',
        influence: 'High (94)',
        title: 'Why We\'re Wrong About AI Valuations',
        guest: 'Brad Gerstner, Founder & CEO at Altimeter Capital',
        keyInsights: [
            'Series A valuations settling at 20-30x ARR, sustainable after 18 months of chaos',
            'AI adoption driving 2-3x better retention in SaaS',
            'Perplexity funding round discussed (terms unverified)*'
        ],
        signals: [
            { type: 'thesis', text: '✓ Thesis Match: Vertical AI thesis validated' },
            { type: 'portfolio', text: '⚠ Portfolio Alert: Your company mentioned by name' }
        ]
    },
    {
        id: 'briefing-2',
        priority: 'opportunity',
        priorityLabel: 'Thesis Match',
        podcast: 'Stratechery',
        time: '1d ago',
        duration: '44 min',
        influence: 'Medium (68)',
        title: 'The State of SaaS',
        guest: 'Host: Ben Thompson',
        keyInsights: [
            'Vertical SaaS companies achieving 150%+ net revenue retention',
            'Infrastructure costs dropping 80% YoY enabling new business models',
            'Developer tools consolidation wave beginning - 3 major acquisitions coming'
        ],
        signals: [
            { type: 'market', text: '◆ Market Signal: Aligns with your developer tools thesis' }
        ]
    },
    {
        id: 'briefing-3',
        priority: 'elevated',
        priorityLabel: 'Market Signal',
        podcast: 'Invest Like the Best',
        time: '3h ago',
        duration: '68 min',
        influence: 'High (82)',
        title: 'Why Developer Tools Are Harder Than We Thought',
        guest: 'Dylan Field, CEO at Figma',
        keyInsights: [
            'Developer tool reality: need 1000+ free users before first paid conversion',
            'Market bifurcating - small startups stay free forever, enterprises spending 5x more',
            'Adobe\'s failed Figma acquisition creating M&A opportunity window'
        ],
        signals: [
            { type: 'lp', text: '◇ LP Intel: Multiple LPs questioning developer tool investments' }
        ]
    }
];

// ============================================
// 5. SIDEBAR METRICS
// ============================================
window.sidebarMetrics = {
    // Weekly Intelligence Brief
    brief: {
        hoursAnalyzed: 1044,
        lastUpdated: '36 mins ago',
        collapsed: 'AI infrastructure dominates [12 sources agree, led by Gerstner/20VC, Gurley/Invest Like Best] with Series A at 20-30x ARR [Hoffman, Rabois confirm]. Notable divergence: DePIN momentum despite revenue questions. Potential blindspot: Developer tools consolidation discussions minimal.',
        expanded: {
            consensus: [
                {
                    title: 'AI infrastructure over applications',
                    sources: 'Gerstner/20VC, Gurley/Invest Like Best, All-In panel agree',
                    detail: 'Vertical AI seeing 2-3x better retention than horizontal plays'
                },
                {
                    title: 'Series A valuations stabilizing',
                    sources: '12 sources confirm: Gerstner, Hoffman, Rabois leading',
                    detail: '20-30x ARR becomes new normal after 18-month correction'
                },
                {
                    title: 'Capital efficiency replacing growth',
                    sources: 'mentioned 47x this week: Stebbings, Sacks, Palihapitiya aligned',
                    detail: 'LPs driving this narrative shift hard'
                }
            ],
            contrarian: [
                {
                    title: 'DePIN showing 190% momentum without revenue',
                    sources: 'Thiel only dissenter on Founders Fund pod, everyone else bullish',
                    detail: 'Either massive opportunity or bubble forming'
                },
                {
                    title: 'Consumer AI skepticism rising',
                    sources: 'Benchmark\'s Gurley, Lightspeed\'s Bogan pulling back',
                    detail: 'while Sequoia, a16z pile into enterprise'
                }
            ],
            blindspots: [
                {
                    title: 'Developer tools consolidation',
                    sources: '3 stealth acquisitions rumored per Acquired pod, zero tier-1 VC coverage',
                    detail: 'Market moving without public discourse'
                },
                {
                    title: 'Climate tech sentiment inverting',
                    sources: 'Khosla quietly accumulating while Founders Fund exits',
                    detail: 'Contrary indicator worth tracking'
                }
            ]
        }
    },
    
    // Velocity Tracking
    velocityTracking: [
        { theme: 'AI Agents', change: '+85% w/w', direction: 'positive' },
        { theme: 'Capital Efficiency', change: '+17% w/w', direction: 'positive' },
        { theme: 'DePIN', change: '+190% w/w', direction: 'positive' },
        { theme: 'B2B SaaS', change: '+3% w/w', direction: 'negative' },
        { theme: 'Crypto/Web3', change: '+53% w/w', direction: 'positive' }
    ],
    
    // Influence Metrics
    influenceMetrics: [
        { name: 'Brad Gerstner', score: 'High (94)' },
        { name: 'All-In Hosts', score: 'High (87)' },
        { name: 'Harry Stebbings', score: 'High (82)' },
        { name: 'Ben Thompson', score: 'Medium (76)' },
        { name: 'Ben Thompson', score: 'Medium (68)' }
    ],
    
    // Consensus Monitor
    consensusMonitor: [
        { topic: 'AI Agents', level: 'Strong (>80% agreement)' },
        { topic: 'Capital Efficiency', level: 'Building (60-80% agreement)' },
        { topic: 'DePIN', level: 'Mixed (40-60% agreement)' },
        { topic: 'B2B SaaS', level: 'Weak (<40% agreement)' }
    ],
    
    // Topic Correlations
    topicCorrelations: [
        { topics: 'AI + Infrastructure', percentage: 68 },
        { topics: 'SaaS + Efficiency', percentage: 48 },
        { topics: 'Dev Tools + AI', percentage: 36 },
        { topics: 'Climate + Deep Tech', percentage: 20 }
    ]
};

// ============================================
// 6. SIGNAL PANEL DETAILED DATA
// ============================================
window.signalPanelData = {
    'market-narratives': [
        { 
            trend: 'Growth → Efficiency shift', 
            count: 23, 
            source: 'Multiple podcasts', 
            insight: 'LPs are driving this narrative hard. Every major fund is adjusting their pitch.' 
        },
        { 
            trend: 'Apps → Infrastructure shift', 
            count: 17, 
            source: '20VC, All-In, Invest Like Best', 
            insight: 'The picks-and-shovels thesis is winning. Application layer seeing valuation compression.' 
        },
        { 
            trend: 'Remote → Hybrid shift', 
            count: 12, 
            source: 'Various founder interviews', 
            insight: 'Even YC companies are requiring 3 days in office. Culture concerns driving reversal.' 
        },
        { 
            trend: 'B2C skepticism trend', 
            count: 8, 
            source: 'Benchmark, Lightspeed pods', 
            insight: 'Consumer acquisition costs making B2C uninvestable unless viral growth proven.' 
        },
        { 
            trend: 'DevTools consolidation prediction', 
            count: 6, 
            source: 'Developer tea, TWIG', 
            insight: 'Too many point solutions. Platformization wave coming in next 18 months.' 
        },
        { 
            trend: 'Climate tech resurgence', 
            count: 5, 
            source: 'Khosla, Breakthrough pods', 
            insight: 'New narrative around adaptation tech, not just mitigation. Defense angle emerging.' 
        }
    ],
    
    'thesis-validation': [
        { 
            thesis: 'Vertical AI > Horizontal AI', 
            status: 'GAINING VALIDATION', 
            sources: 'Gerstner, Wolfe, Stebbings all agree', 
            insight: 'Every horizontal play struggling with differentiation. Vertical expertise is the moat.' 
        },
        { 
            thesis: 'Series A at 20-30x ARR is new normal', 
            status: 'GAINING VALIDATION', 
            sources: '12 sources confirm', 
            insight: 'Market has found equilibrium after 18-month correction. Higher only for AI infra.' 
        },
        { 
            thesis: 'Developer experience as primary differentiator', 
            status: 'EARLY SIGNALS', 
            sources: 'a16z, Redpoint discussions', 
            insight: 'DX is the new UX. Poor developer experience kills B2B adoption instantly.' 
        },
        { 
            thesis: 'PLG dead for enterprise', 
            status: 'GAINING VALIDATION', 
            sources: 'Multiple enterprise founders', 
            insight: 'Sales-led making comeback. PLG only works for developer tools now.' 
        }
    ],
    
    'notable-deals': [
        { 
            company: 'Perplexity', 
            details: 'Series B at $10B valuation', 
            insight: 'Deal structure trends emerging in competitive rounds*' 
        },
        { 
            company: 'Anthropic (rumored)', 
            details: 'Series D at $40B', 
            insight: 'Google deepening partnership. Strategic investors winning over pure financial.' 
        },
        { 
            company: 'Cursor', 
            details: 'Series A at $400M', 
            insight: 'Developer tools with AI seeing 10x valuation premiums. Metrics don\'t matter yet.' 
        }
    ],
    
    'portfolio-mentions': [
        { 
            company: 'Your Portfolio Co (unnamed)', 
            context: 'Mentioned by Gerstner as example of efficient growth', 
            sentiment: 'POSITIVE', 
            action: 'Leverage for fundraising' 
        },
        { 
            company: 'Competitor analysis', 
            context: 'Three funds discussing your space', 
            sentiment: 'NEUTRAL', 
            action: 'Watch for new entrants' 
        },
        { 
            company: 'Market positioning', 
            context: 'Your vertical getting increased attention', 
            sentiment: 'POSITIVE', 
            action: 'Accelerate hiring' 
        }
    ],
    
    'lp-sentiment': [
        { 
            trend: 'DPI focus intensifying', 
            source: 'CalPERS on Institutional Investor pod', 
            impact: 'First-time funds facing 18+ month raises' 
        },
        { 
            trend: 'Vintage year concerns', 
            source: 'Multiple endowment discussions', 
            impact: '2021-2022 vintages being written down aggressively' 
        },
        { 
            trend: 'Co-invest appetite growing', 
            source: 'Sovereign wealth discussions', 
            impact: 'LPs want more direct exposure, less blind pool risk' 
        }
    ]
};

// ============================================
// 7. CHART DATA (for dynamic views)
// ============================================
window.chartViewData = {
    // Consensus levels for heatmap view
    consensusLevels: [
        [0.8, 0.6, 0.9, 0.7],  // AI Agents
        [0.5, 0.6, 0.7, 0.8],  // Capital Efficiency
        [0.3, 0.5, 0.8, 0.9],  // DePIN
        [0.4, 0.4, 0.3, 0.3]   // B2B SaaS
    ],
    
    consensusLabels: [
        ['Building', 'Moderate', 'Strong', 'Strong'],
        ['Moderate', 'Moderate', 'Strong', 'Strong'],
        ['Weak', 'Moderate', 'Strong', 'Peak'],
        ['Weak', 'Weak', 'Weak', 'Weak']
    ]
};

// ============================================
// 8. HEADER TICKER DATA
// ============================================
window.tickerData = {
    items: [
        { label: 'AI Agents', value: '↑85%' },
        { label: 'Capital Efficiency', value: '↑17%' },
        { label: 'Patterns Detected', value: '47' }
    ]
};

console.log('Demo data loaded successfully');