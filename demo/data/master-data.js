// Master Data File - Single Source of Truth for Synthea.ai Demo
// Created: 2025-07-28
// Purpose: Consolidate all fragmented data from multiple sources

window.masterData = {
    // ============================================
    // HEADER & GLOBAL UI DATA
    // ============================================
    header: {
        ticker: [
            { label: 'AI Agents', value: '↑85%' },
            { label: 'Capital Efficiency', value: '↑17%' },
            { label: 'Patterns Detected', value: '47' },
            { label: 'DePIN Momentum', value: '↑190%' },
            { label: 'New Narratives', value: '12' },
            { label: 'Consensus Forming', value: '7 topics' },
            { label: 'LP Sentiment', value: 'Cautious' }
        ],
        search: {
            suggestions: [
                "What's the consensus on vertical AI?",
                "Series A valuations this month",
                "Brad Gerstner latest thesis",
                "Defense tech momentum analysis",
                "Climate tech profitability metrics"
            ],
            trendingTopics: [
                { name: 'AI Agents', trend: '↑85% w/w' },
                { name: 'Capital efficiency metrics', trend: '↑17% w/w' },
                { name: 'DePIN infrastructure', trend: '↑190% w/w' },
                { name: 'Developer Tools', trend: '↑29% w/w' },
                { name: 'Defense Tech', trend: '↑156% w/w' }
            ],
            quickFilters: [
                'Consensus views',
                'Contrarian takes',
                'Emerging themes',
                'Deal mentions',
                'Key people'
            ]
        }
    },
    
    // ============================================
    // NARRATIVE PULSE - CONSOLIDATED CHART DATA
    // ============================================
    narrativePulse: {
        // Configuration (from narrative-pulse.js)
        config: {
            consensusLevels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
            consensusLabels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Peak'],
            timeRangeConfigs: {
                '7 days': {
                    dateLabels: ['Aug 22', 'Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28'],
                    dataPoints: 7,
                    interval: 'daily'
                },
                '30 days': {
                    dateLabels: ['Aug 1-7', 'Aug 8-14', 'Aug 15-21', 'Aug 22-28'],
                    dataPoints: 4,
                    interval: 'weekly'
                },
                '90 days': {
                    dateLabels: ['Jun 5', 'Jun 12', 'Jun 19', 'Jun 26', 'Jul 3', 'Jul 10', 'Jul 17', 'Jul 24', 'Jul 31', 'Aug 7', 'Aug 14', 'Aug 21', 'Aug 28'],
                    dataPoints: 13,
                    interval: 'weekly'
                }
            }
        },
        
        // Topic data (merged from all sources)
        topics: {
            'AI Agents': {
                color: '#4a7c59',
                momentum: '+85%',
                mentions: 147,
                episodes: 23,
                // Chart data from narrative-pulse-data.js
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [3, 1, 2, 6, 8, 9, 6],
                            dailyAverage: 5.0,
                            peakDay: 'Wed 28'
                        },
                        volume: {
                            dataPoints: [3, 1, 2, 6, 8, 9, 6],
                            total: 35
                        },
                        consensus: {
                            levels: [0.6, 0.6, 0.7, 0.8, 0.8, 0.9, 0.9],
                            label: 'Strong'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [8, 15, 22, 35],
                            weeklyGrowth: '+337%'
                        },
                        volume: {
                            dataPoints: [8, 15, 22, 35],
                            total: 80
                        },
                        consensus: {
                            levels: [0.3, 0.5, 0.7, 0.9],
                            progression: 'Weak → Strong'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [15, 16, 17, 18, 19, 20, 22, 24, 26, 24, 27, 30, 35],
                            quarterlyGrowth: '+133%'
                        },
                        volume: {
                            dataPoints: [15, 16, 17, 18, 19, 20, 22, 24, 26, 24, 27, 30, 35],
                            total: 283
                        },
                        consensus: {
                            progression: ['Weak', 'Weak', 'Building', 'Building', 'Building', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong']
                        }
                    }
                },
                // Consensus sentiment data (from narrative-pulse.js)
                consensusData: {
                    'Aug 7': {
                        positive: 70,
                        neutral: 7,
                        negative: 2,
                        total: 79,
                        percent: 88.6,
                        level: 'Strong',
                        advocates: [
                            { name: 'Brad Gerstner', firm: 'Altimeter' },
                            { name: 'Reid Hoffman', firm: 'Greylock' },
                            { name: 'Elad Gil', firm: 'Solo GP' }
                        ]
                    },
                    'Aug 14': {
                        positive: 93,
                        neutral: 10,
                        negative: 2,
                        total: 105,
                        percent: 88.6,
                        level: 'Strong',
                        advocates: [
                            { name: 'Sarah Guo', firm: 'Conviction' },
                            { name: 'Brad Gerstner', firm: 'Altimeter' },
                            { name: 'Vinod Khosla', firm: 'Khosla Ventures' }
                        ]
                    },
                    'Aug 21': {
                        positive: 115,
                        neutral: 11,
                        negative: 2,
                        total: 128,
                        percent: 89.8,
                        level: 'Strong',
                        advocates: [
                            { name: 'Reid Hoffman', firm: 'Greylock' },
                            { name: 'Sarah Guo', firm: 'Conviction' },
                            { name: 'Elad Gil', firm: 'Solo GP' }
                        ]
                    },
                    'Aug 28': {
                        positive: 127,
                        neutral: 13,
                        negative: 2,
                        total: 142,
                        percent: 89.4,
                        level: 'Strong',
                        advocates: [
                            { name: 'Brad Gerstner', firm: 'Altimeter' },
                            { name: 'Reid Hoffman', firm: 'Greylock' },
                            { name: 'Sarah Guo', firm: 'Conviction' }
                        ]
                    }
                }
            },
            'AI Infrastructure': {
                color: '#a87c68',
                momentum: '+37%',
                mentions: 208,
                episodes: 41,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [5, 2, 3, 8, 10, 12, 12],
                            dailyAverage: 7.4,
                            peakDay: 'Wed 28 & Thu 29'
                        },
                        volume: {
                            dataPoints: [5, 2, 3, 8, 10, 12, 12],
                            total: 52
                        },
                        consensus: {
                            levels: [0.8, 0.7, 0.8, 0.9, 0.9, 1.0, 1.0],
                            label: 'Peak'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [12, 25, 38, 52],
                            weeklyGrowth: '+333%'
                        },
                        volume: {
                            dataPoints: [12, 25, 38, 52],
                            total: 127
                        },
                        consensus: {
                            levels: [0.5, 0.7, 0.9, 1.0],
                            progression: 'Building → Peak'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [20, 22, 24, 26, 28, 30, 33, 36, 40, 35, 40, 46, 52],
                            quarterlyGrowth: '+160%'
                        },
                        volume: {
                            dataPoints: [20, 22, 24, 26, 28, 30, 33, 36, 40, 35, 40, 46, 52],
                            total: 420
                        },
                        consensus: {
                            progression: ['Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Peak', 'Peak', 'Peak']
                        }
                    }
                }
            },
            'Capital Efficiency': {
                color: '#f4a261',
                momentum: '+17%',
                mentions: 89,
                episodes: 31,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [2, 0, 1, 3, 4, 3, 2],
                            dailyAverage: 2.1,
                            peakDay: 'Tue 27'
                        },
                        volume: {
                            dataPoints: [2, 0, 1, 3, 4, 3, 2],
                            total: 15
                        },
                        consensus: {
                            levels: [0.7, 0.6, 0.7, 0.8, 0.8, 0.8, 0.7],
                            label: 'Strong'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [12, 14, 13, 15],
                            weeklyGrowth: '+25%'
                        },
                        volume: {
                            dataPoints: [12, 14, 13, 15],
                            total: 54
                        },
                        consensus: {
                            levels: [0.6, 0.7, 0.7, 0.8],
                            progression: 'Moderate → Strong'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [11, 10, 9, 8, 8, 9, 10, 11, 12, 12, 14, 13, 15],
                            quarterlyGrowth: '+36%'
                        },
                        volume: {
                            dataPoints: [11, 10, 9, 8, 8, 9, 10, 11, 12, 12, 14, 13, 15],
                            total: 142
                        },
                        consensus: {
                            progression: ['Strong', 'Strong', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong']
                        }
                    }
                }
            },
            'DePIN': {
                color: '#5a6c8c',
                momentum: '+190%',
                mentions: 201,
                episodes: 18,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [2, 1, 1, 5, 7, 8, 8],
                            dailyAverage: 4.6,
                            peakDay: 'Wed 28 & Thu 29'
                        },
                        volume: {
                            dataPoints: [2, 1, 1, 5, 7, 8, 8],
                            total: 32
                        },
                        consensus: {
                            levels: [0.3, 0.3, 0.3, 0.5, 0.6, 0.7, 0.8],
                            label: 'Building'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [2, 8, 18, 32],
                            weeklyGrowth: '+1500%'
                        },
                        volume: {
                            dataPoints: [2, 8, 18, 32],
                            total: 60
                        },
                        consensus: {
                            levels: [0.1, 0.3, 0.6, 0.8],
                            progression: 'None → Building'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [10, 10, 11, 12, 13, 14, 15, 17, 19, 18, 22, 27, 32],
                            quarterlyGrowth: '+220%'
                        },
                        volume: {
                            dataPoints: [10, 10, 11, 12, 13, 14, 15, 17, 19, 18, 22, 27, 32],
                            total: 217
                        },
                        consensus: {
                            progression: ['None', 'None', 'None', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Building', 'Weak', 'Building', 'Strong', 'Peak']
                        }
                    }
                }
            },
            'Crypto/Web3': {
                color: '#5c7cfa',
                momentum: '+53%',
                mentions: 112,
                episodes: 28,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [3, 2, 2, 4, 5, 5, 5],
                            dailyAverage: 3.7,
                            peakDay: 'Tue-Thu'
                        },
                        volume: {
                            dataPoints: [3, 2, 2, 4, 5, 5, 5],
                            total: 26
                        },
                        consensus: {
                            levels: [0.5, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5],
                            label: 'Moderate'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [28, 25, 22, 26],
                            weeklyGrowth: '-7%'
                        },
                        volume: {
                            dataPoints: [28, 25, 22, 26],
                            total: 101
                        },
                        consensus: {
                            levels: [0.5, 0.4, 0.3, 0.4],
                            progression: 'Moderate → Weak'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [36, 34, 32, 30, 28, 26, 24, 23, 22, 28, 25, 22, 26],
                            quarterlyGrowth: '-28%'
                        },
                        volume: {
                            dataPoints: [36, 34, 32, 30, 28, 26, 24, 23, 22, 28, 25, 22, 26],
                            total: 356
                        },
                        consensus: {
                            progression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Weak', 'Building']
                        }
                    }
                }
            },
            'B2B SaaS': {
                color: '#c77d7d',
                momentum: '+3%',
                mentions: 43,
                episodes: 12,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [1, 0, 1, 2, 2, 1, 1],
                            dailyAverage: 1.1,
                            peakDay: 'Mon 26 & Tue 27'
                        },
                        volume: {
                            dataPoints: [1, 0, 1, 2, 2, 1, 1],
                            total: 8
                        },
                        consensus: {
                            levels: [0.3, 0.2, 0.3, 0.3, 0.3, 0.2, 0.2],
                            label: 'Weak'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [15, 12, 10, 8],
                            weeklyGrowth: '-47%'
                        },
                        volume: {
                            dataPoints: [15, 12, 10, 8],
                            total: 45
                        },
                        consensus: {
                            levels: [0.3, 0.3, 0.2, 0.2],
                            progression: 'Weak → Weak'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [20, 19, 18, 17, 16, 15, 14, 13, 12, 15, 12, 10, 8],
                            quarterlyGrowth: '-60%'
                        },
                        volume: {
                            dataPoints: [20, 19, 18, 17, 16, 15, 14, 13, 12, 15, 12, 10, 8],
                            total: 189
                        },
                        consensus: {
                            progression: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak']
                        }
                    }
                }
            },
            'Developer Tools': {
                color: '#8a68a8',
                momentum: '+29%',
                mentions: 92,
                episodes: 19,
                chartData: {
                    '7d': {
                        momentum: {
                            dataPoints: [2, 1, 1, 3, 4, 4, 3],
                            dailyAverage: 2.6,
                            peakDay: 'Tue 27 & Wed 28'
                        },
                        volume: {
                            dataPoints: [2, 1, 1, 3, 4, 4, 3],
                            total: 18
                        },
                        consensus: {
                            levels: [0.6, 0.5, 0.5, 0.7, 0.8, 0.8, 0.7],
                            label: 'Strong'
                        }
                    },
                    '30d': {
                        momentum: {
                            dataPoints: [6, 10, 14, 18],
                            weeklyGrowth: '+200%'
                        },
                        volume: {
                            dataPoints: [6, 10, 14, 18],
                            total: 48
                        },
                        consensus: {
                            levels: [0.8, 0.8, 0.9, 0.9],
                            progression: 'Strong → Strong'
                        }
                    },
                    '90d': {
                        momentum: {
                            dataPoints: [8, 8, 9, 9, 10, 11, 12, 13, 14, 12, 14, 16, 18],
                            quarterlyGrowth: '+125%'
                        },
                        volume: {
                            dataPoints: [8, 8, 9, 9, 10, 11, 12, 13, 14, 12, 14, 16, 18],
                            total: 155
                        },
                        consensus: {
                            progression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Moderate', 'Strong', 'Strong', 'Strong']
                        }
                    }
                }
            }
        }
    },
    
    // ============================================
    // ALL 9 PRIORITY BRIEFINGS
    // ============================================
    priorityBriefings: [
        // First 3 from demo-data.js
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
        },
        // 6 Additional from HTML
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
    ],
    
    // ============================================
    // ALL 5 NARRATIVE FEED ENTRIES
    // ============================================
    narrativeFeed: [
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
    ],
    
    // ============================================
    // NOTABLE SIGNALS - CONSOLIDATED
    // ============================================
    notableSignals: {
        counts: {
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
        },
        panelData: {
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
        }
    },
    
    // ============================================
    // INTELLIGENCE BRIEF - COMPLETE SIDEBAR DATA
    // ============================================
    intelligenceBrief: {
        summary: {
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
        metrics: {
            velocityTracking: [
                { theme: 'AI Agents', change: '+85% w/w', direction: 'positive' },
                { theme: 'Capital Efficiency', change: '+17% w/w', direction: 'positive' },
                { theme: 'DePIN', change: '+190% w/w', direction: 'positive' },
                { theme: 'B2B SaaS', change: '+3% w/w', direction: 'negative' },
                { theme: 'Crypto/Web3', change: '+53% w/w', direction: 'positive' },
                { theme: 'Developer Tools', change: '+29% w/w', direction: 'positive' },
                { theme: 'AI Infrastructure', change: '+37% w/w', direction: 'positive' }
            ],
            influenceMetrics: [
                { name: 'Brad Gerstner', score: 'High (94)' },
                { name: 'All-In Hosts', score: 'High (87)' },
                { name: 'Harry Stebbings', score: 'High (82)' },
                { name: 'Ben Thompson', score: 'Medium (76)' },
                { name: 'Peter Thiel', score: 'High (89)' },
                { name: 'Sam Altman', score: 'Very High (96)' },
                { name: 'Josh Wolfe', score: 'High (85)' }
            ],
            consensusMonitor: [
                { topic: 'AI Agents', level: 'Strong (>80% agreement)' },
                { topic: 'AI Infrastructure', level: 'Peak (>90% agreement)' },
                { topic: 'Capital Efficiency', level: 'Building (60-80% agreement)' },
                { topic: 'DePIN', level: 'Mixed (40-60% agreement)' },
                { topic: 'B2B SaaS', level: 'Weak (<40% agreement)' },
                { topic: 'Developer Tools', level: 'Strong (>80% agreement)' },
                { topic: 'Crypto/Web3', level: 'Moderate (50% agreement)' }
            ],
            topicCorrelations: [
                { topics: 'AI + Infrastructure', percentage: 68 },
                { topics: 'SaaS + Efficiency', percentage: 48 },
                { topics: 'Dev Tools + AI', percentage: 36 },
                { topics: 'Climate + Deep Tech', percentage: 20 },
                { topics: 'DePIN + Crypto', percentage: 42 },
                { topics: 'Defense + AI', percentage: 31 }
            ]
        }
    },
    
    // ============================================
    // PODCAST FILTER OPTIONS
    // ============================================
    podcastFilterOptions: [
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
        'BG2',
        'All-In Podcast',
        'a16z Podcast',
        'Software Engineering Daily',
        'Lenny\'s Podcast',
        'Founders Fund Podcast'
    ]
};

console.log('Master data loaded successfully');
console.log('Total Priority Briefings:', masterData.priorityBriefings.length);
console.log('Total Narrative Feed items:', masterData.narrativeFeed.length);
console.log('Total Topics tracked:', Object.keys(masterData.narrativePulse.topics).length);