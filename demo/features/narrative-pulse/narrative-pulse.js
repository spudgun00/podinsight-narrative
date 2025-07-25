// Narrative Pulse Component
// Modular implementation of the Narrative Pulse feature

const NarrativePulse = {
    // Component state
    activeFilter: null,
    container: null,
    currentTimeRange: '7 days', // Track current time range
    
    // Chart configuration
    chartWidth: 800,
    chartHeight: 300,
    padding: 50,
    dateLabels: ['Aug 22', 'Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28'],
    xPositions: [], // Will be calculated in init
    hideTooltipTimer: null,
    mouseMoveFrame: null, // For requestAnimationFrame debouncing
    
    // Time range data configurations
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
    },
    
    // Event listener management
    eventListeners: {
        momentum: [],
        volume: [],
        consensus: [],
        global: []
    },
    currentView: 'momentum',
    
    // Topic customization state
    availableTopics: ['AI Agents', 'AI Infrastructure', 'Capital Efficiency', 'DePIN', 'Crypto/Web3', 'B2B SaaS', 'Developer Tools'],
    selectedTopics: ['AI Agents', 'AI Infrastructure', 'Capital Efficiency', 'DePIN', 'Crypto/Web3', 'B2B SaaS', 'Developer Tools'],
    tempSelectedTopics: [],
    maxTopics: 7,
    panel: null,
    backdrop: null,
    hasChanges: false,
    
    // Consensus sentiment data
    consensusData: {
        'AI Agents': {
            'Aug 7': { positive: 70, neutral: 7, negative: 2, total: 79, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Aug 14': { positive: 93, neutral: 10, negative: 2, total: 105, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Vinod Khosla', firm: 'Khosla Ventures' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 115, neutral: 11, negative: 2, total: 128, percent: 89.8, level: 'Strong',
                advocates: [
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 127, neutral: 13, negative: 2, total: 142, percent: 89.4, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' }
                ],
                dissent: null
            }
        },
        'Capital Efficiency': {
            'Aug 7': { positive: 38, neutral: 30, negative: 8, total: 76, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 14': { positive: 49, neutral: 28, negative: 5, total: 82, percent: 59.8, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 61, neutral: 22, negative: 4, total: 87, percent: 70.1, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 71, neutral: 14, negative: 3, total: 88, percent: 80.7, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 76, neutral: 11, negative: 2, total: 89, percent: 85.4, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: null
            }
        },
        'DePIN': {
            'Aug 7': { positive: 3, neutral: 5, negative: 3, total: 11, percent: 27.3, level: 'Weak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' }
                ],
                dissent: { quote: 'Still too early for institutional', author: 'Bill Gurley' }
            },
            'Aug 14': { positive: 17, neutral: 12, negative: 5, total: 34, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 62, neutral: 22, negative: 5, total: 89, percent: 69.7, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Ali Yahya', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 117, neutral: 35, negative: 4, total: 156, percent: 75.0, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Arianna Simpson', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 181, neutral: 18, negative: 2, total: 201, percent: 90.0, level: 'Peak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Marc Andreessen', firm: 'a16z' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            }
        },
        'B2B SaaS': {
            'Aug 7': { positive: 16, neutral: 20, negative: 4, total: 40, percent: 40.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Growth multiples unsustainable', author: 'Bill Gurley' }
            },
            'Aug 14': { positive: 16, neutral: 21, negative: 4, total: 41, percent: 39.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Consolidation inevitable', author: 'David Sacks' }
            },
            'Aug 21': { positive: 13, neutral: 25, negative: 4, total: 42, percent: 31.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'AI will eat most SaaS', author: 'Marc Andreessen' }
            },
            'Aug 28': { positive: 13, neutral: 26, negative: 4, total: 43, percent: 30.2, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'Vertical AI replacing horizontal SaaS', author: 'Sarah Guo' }
            }
        },
        'Developer Tools': {
            'Aug 7': { positive: 28, neutral: 12, negative: 2, total: 42, percent: 66.7, level: 'Moderate',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' }
                ],
                dissent: null
            },
            'Aug 14': { positive: 32, neutral: 10, negative: 2, total: 44, percent: 72.7, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 38, neutral: 8, negative: 2, total: 48, percent: 79.2, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Nat Friedman', firm: 'Former GitHub' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 52, neutral: 10, negative: 2, total: 64, percent: 81.3, level: 'Strong',
                advocates: [
                    { name: 'Nat Friedman', firm: 'Former GitHub' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Peter Levine', firm: 'a16z' }
                ],
                dissent: null
            }
        },
        'Crypto/Web3': {
            'Aug 7': { positive: 16, neutral: 10, negative: 2, total: 28, percent: 57.1, level: 'Building',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'David Roebuck', firm: 'Electric Capital' }
                ],
                dissent: null
            },
            'Aug 14': { positive: 14, neutral: 9, negative: 2, total: 25, percent: 56.0, level: 'Building',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'Jesse Walden', firm: 'Variant' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 12, neutral: 8, negative: 2, total: 22, percent: 54.5, level: 'Weak',
                advocates: [
                    { name: 'Linda Xie', firm: 'Scalar Capital' },
                    { name: 'Chris Dixon', firm: 'a16z' }
                ],
                dissent: { name: 'Howard Marks', firm: 'Oaktree', quote: 'Still seeking killer use cases' }
            },
            'Aug 28': { positive: 15, neutral: 9, negative: 2, total: 26, percent: 57.7, level: 'Building',
                advocates: [
                    { name: 'Jesse Walden', firm: 'Variant' },
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'Ryan Selkis', firm: 'Messari' }
                ],
                dissent: null
            }
        },
        'AI Infrastructure': {
            'Aug 7': { positive: 38, neutral: 16, negative: 4, total: 58, percent: 65.5, level: 'Moderate',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Aug 14': { positive: 56, neutral: 16, negative: 4, total: 76, percent: 73.7, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' },
                    { name: 'Soumith Chintala', firm: 'Meta' }
                ],
                dissent: null
            },
            'Aug 21': { positive: 82, neutral: 14, negative: 4, total: 100, percent: 82.0, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Soumith Chintala', firm: 'Meta' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Aug 28': { positive: 114, neutral: 20, negative: 4, total: 138, percent: 82.6, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' },
                    { name: 'Jensen Huang', firm: 'NVIDIA' }
                ],
                dissent: null
            }
        }
    },
    
    // Rich data for tooltips
    topicDataByDate: {
        'Aug 7': {
            'AI Agents': { mentions: 79, weekOverWeek: 0, change: 0, podcasts: ['20VC', 'All-In'], quote: 'AI will eat software' },
            'Capital Efficiency': { mentions: 76, weekOverWeek: 0, change: 0, podcasts: ['Acquired'], quote: 'Do more with less' },
            'DePIN': { mentions: 11, weekOverWeek: 0, change: 0, podcasts: ['Bankless'], quote: 'Infrastructure revolution' },
            'B2B SaaS': { mentions: 40, weekOverWeek: 0, change: 0, podcasts: ['SaaStr'], quote: 'Enterprise is back' },
            'Developer Tools': { mentions: 32, weekOverWeek: 0, change: 0, podcasts: ['20VC'], quote: 'Tools for builders' },
            'Vertical SaaS': { mentions: 28, weekOverWeek: 0, change: 0, podcasts: ['SaaStr'], quote: 'Industry specific wins' },
            'AI Infrastructure': { mentions: 45, weekOverWeek: 0, change: 0, podcasts: ['a16z Podcast'], quote: 'Foundation layer' },
            'topEpisodes': [
                { title: 'The AI Agent Revolution', podcast: '20VC' },
                { title: 'Capital Efficiency in 2025', podcast: 'Acquired' },
                { title: 'Why DePIN Matters Now', podcast: 'Bankless' }
            ]
        },
        'Aug 14': {
            'AI Agents': { mentions: 105, weekOverWeek: 33, change: 26, podcasts: ['20VC', 'Invest Like Best'], quote: 'Agents are the new apps' },
            'Capital Efficiency': { mentions: 82, weekOverWeek: 8, change: 6, podcasts: ['This Week in Startups'], quote: 'Efficiency is the new growth' },
            'DePIN': { mentions: 34, weekOverWeek: 209, change: 23, podcasts: ['Bankless', 'All-In'], quote: 'DePIN summer is here' },
            'B2B SaaS': { mentions: 41, weekOverWeek: 3, change: 1, podcasts: ['SaaStr'], quote: 'Steady as she goes' },
            'Developer Tools': { mentions: 38, weekOverWeek: 19, change: 6, podcasts: ['20VC', 'Acquired'], quote: 'DevEx matters' },
            'Vertical SaaS': { mentions: 34, weekOverWeek: 21, change: 6, podcasts: ['SaaStr'], quote: 'Vertical is the new horizontal' },
            'AI Infrastructure': { mentions: 62, weekOverWeek: 38, change: 17, podcasts: ['All-In'], quote: 'Infrastructure boom' },
            'topEpisodes': [
                { title: 'Agents Are Eating Software', podcast: '20VC' },
                { title: 'DePIN Infrastructure Plays', podcast: 'Bankless' },
                { title: 'Capital Efficiency Playbook', podcast: 'This Week in Startups' }
            ]
        },
        'Aug 21': {
            'AI Agents': { mentions: 128, weekOverWeek: 22, change: 23, podcasts: ['All-In', 'a16z Podcast'], quote: 'Vertical AI dominance inevitable' },
            'Capital Efficiency': { mentions: 87, weekOverWeek: 6, change: 5, podcasts: ['20VC'], quote: 'Capital discipline wins' },
            'DePIN': { mentions: 89, weekOverWeek: 162, change: 55, podcasts: ['Bankless', 'Unchained'], quote: 'Physical meets digital' },
            'B2B SaaS': { mentions: 42, weekOverWeek: 2, change: 1, podcasts: ['SaaStr', 'Invest Like Best'], quote: 'SaaS is mature' },
            'Developer Tools': { mentions: 44, weekOverWeek: 16, change: 6, podcasts: ['20VC'], quote: 'Developer first' },
            'Vertical SaaS': { mentions: 48, weekOverWeek: 41, change: 14, podcasts: ['SaaStr', 'Acquired'], quote: 'Specialization wins' },
            'AI Infrastructure': { mentions: 89, weekOverWeek: 44, change: 27, podcasts: ['a16z Podcast'], quote: 'GPU rich economy' },
            'topEpisodes': [
                { title: 'Vertical AI Winners', podcast: 'All-In' },
                { title: 'DePIN Deep Dive', podcast: 'Bankless' },
                { title: 'Capital Allocation Strategy', podcast: '20VC' }
            ]
        },
        'Aug 28': {
            'AI Agents': { mentions: 142, weekOverWeek: 11, change: 14, podcasts: ['20VC', 'All-In', 'Invest Like Best'], quote: 'Every company needs agents' },
            'Capital Efficiency': { mentions: 88, weekOverWeek: 1, change: 1, podcasts: ['Acquired', 'a16z Podcast'], quote: 'New reality for 2025 fundraising' },
            'DePIN': { mentions: 156, weekOverWeek: 75, change: 67, podcasts: ['Bankless', 'All-In'], quote: 'Infrastructure gold rush' },
            'B2B SaaS': { mentions: 43, weekOverWeek: 2, change: 1, podcasts: ['SaaStr'], quote: 'Focus on fundamentals' },
            'Developer Tools': { mentions: 64, weekOverWeek: 45, change: 20, podcasts: ['20VC', 'Acquired'], quote: 'Tools explosion' },
            'Vertical SaaS': { mentions: 68, weekOverWeek: 42, change: 20, podcasts: ['SaaStr'], quote: 'Deep domain expertise' },
            'AI Infrastructure': { mentions: 124, weekOverWeek: 39, change: 35, podcasts: ['All-In', 'a16z Podcast'], quote: 'Infrastructure layer complete' },
            'topEpisodes': [
                { title: 'Why We\'re Wrong About AI', podcast: '20VC' },
                { title: 'The State of SaaS', podcast: 'SaaStr' },
                { title: 'DePIN Infrastructure Rush', podcast: 'Bankless' }
            ]
        }
    },
    
    // Complete time range data from narrative-pulse-complete-data.md
    timeRangeData: {
        '7 days': {
            topics: {
                'AI Agents': {
                    color: '#4a7c59',
                    displayMomentum: '+59%',
                    dataPoints: [3, 1, 2, 6, 8, 9, 6],
                    consensus: [89, 88, 89, 90, 89, 88, 89],
                    startValue: 22,
                    endValue: 35,
                    consensusLevel: 'Strong'
                },
                'AI Infrastructure': {
                    color: '#a87c68',
                    displayMomentum: '+37%',
                    dataPoints: [5, 2, 3, 8, 10, 12, 12],
                    consensus: [91, 91, 92, 92, 93, 93, 94],
                    startValue: 38,
                    endValue: 52,
                    consensusLevel: 'Peak'
                },
                'Capital Efficiency': {
                    color: '#f4a261',
                    displayMomentum: '+15%',
                    dataPoints: [2, 0, 1, 3, 4, 3, 2],
                    consensus: [81, 82, 83, 84, 85, 85, 85],
                    startValue: 13,
                    endValue: 15,
                    consensusLevel: 'Strong'
                },
                'DePIN': {
                    color: '#5a6c8c',
                    displayMomentum: '+78%',
                    dataPoints: [2, 1, 1, 5, 7, 8, 8],
                    consensus: [75, 78, 82, 85, 88, 90, 90],
                    startValue: 18,
                    endValue: 32,
                    consensusLevel: 'Building'
                },
                'Crypto/Web3': {
                    color: '#5c7cfa',
                    displayMomentum: '+18%',
                    dataPoints: [3, 2, 2, 4, 5, 5, 5],
                    consensus: [60, 62, 64, 66, 68, 70, 72],
                    startValue: 22,
                    endValue: 26,
                    consensusLevel: 'Moderate'
                },
                'B2B SaaS': {
                    color: '#c77d7d',
                    displayMomentum: '-20%',
                    dataPoints: [1, 0, 1, 2, 2, 1, 1],
                    consensus: [30, 30, 30, 30, 30, 30, 30],
                    startValue: 10,
                    endValue: 8,
                    consensusLevel: 'Weak'
                },
                'Developer Tools': {
                    color: '#8a68a8',
                    displayMomentum: '+29%',
                    dataPoints: [2, 1, 1, 3, 4, 4, 3],
                    consensus: [81, 83, 85, 86, 87, 87, 87],
                    startValue: 14,
                    endValue: 18,
                    consensusLevel: 'Strong'
                }
            }
        },
        '30 days': {
            topics: {
                'AI Agents': {
                    color: '#4a7c59',
                    displayMomentum: '+337%',
                    dataPoints: [8, 15, 22, 35, 35],  // Aug 7, 14, 21, 28
                    consensus: [60, 70, 80, 90, 90],
                    startValue: 8,
                    endValue: 35,
                    consensusLevel: 'Strong'
                },
                'AI Infrastructure': {
                    color: '#a87c68',
                    displayMomentum: '+333%',
                    dataPoints: [12, 25, 38, 52, 52],  // Aug 7, 14, 21, 28
                    consensus: [85, 88, 90, 94, 94],
                    startValue: 12,
                    endValue: 52,
                    consensusLevel: 'Peak'
                },
                'Capital Efficiency': {
                    color: '#f4a261',
                    displayMomentum: '+25%',
                    dataPoints: [12, 14, 13, 15, 15],  // Aug 7, 14, 21, 28
                    consensus: [70, 75, 73, 85, 85],
                    startValue: 12,
                    endValue: 15,
                    consensusLevel: 'Strong'
                },
                'DePIN': {
                    color: '#5a6c8c',
                    displayMomentum: '+1500%',
                    dataPoints: [2, 8, 18, 32, 32],  // Aug 7, 14, 21, 28
                    consensus: [30, 50, 70, 90, 90],
                    startValue: 2,
                    endValue: 32,
                    consensusLevel: 'Peak'
                },
                'Crypto/Web3': {
                    color: '#5c7cfa',
                    displayMomentum: '-7%',
                    dataPoints: [28, 25, 22, 26, 26],  // Aug 7, 14, 21, 28
                    consensus: [57, 52, 50, 58, 58],
                    startValue: 28,
                    endValue: 26,
                    consensusLevel: 'Moderate'
                },
                'B2B SaaS': {
                    color: '#c77d7d',
                    displayMomentum: '-47%',
                    dataPoints: [15, 12, 10, 8, 8],  // Aug 7, 14, 21, 28
                    consensus: [33, 25, 20, 20, 20],
                    startValue: 15,
                    endValue: 8,
                    consensusLevel: 'Weak'
                },
                'Developer Tools': {
                    color: '#8a68a8',
                    displayMomentum: '+200%',
                    dataPoints: [6, 10, 14, 18, 18],  // Aug 7, 14, 21, 28
                    consensus: [83, 80, 86, 89, 89],
                    startValue: 6,
                    endValue: 18,
                    consensusLevel: 'Strong'
                }
            }
        },
        '90 days': {
            topics: {
                'AI Agents': {
                    color: '#4a7c59',
                    displayMomentum: '+775%',
                    dataPoints: [4, 5, 6, 7, 8, 9, 10, 11, 12, 8, 15, 22, 35, 35],  // Last 5 match 30-day
                    consensus: [30, 35, 40, 45, 50, 55, 60, 65, 70, 60, 70, 80, 90, 90],
                    startValue: 4,
                    endValue: 35,
                    consensusLevel: 'Strong'
                },
                'AI Infrastructure': {
                    color: '#a87c68',
                    displayMomentum: '+867%',
                    dataPoints: [6, 8, 10, 12, 15, 18, 22, 26, 30, 12, 25, 38, 52, 52],  // Last 5 match 30-day
                    consensus: [40, 45, 50, 55, 65, 70, 75, 80, 85, 85, 88, 90, 94, 94],
                    startValue: 6,
                    endValue: 52,
                    consensusLevel: 'Peak'
                },
                'Capital Efficiency': {
                    color: '#f4a261',
                    displayMomentum: '+36%',
                    dataPoints: [11, 10, 9, 8, 8, 9, 10, 11, 12, 12, 14, 13, 15, 15],  // Last 5 match 30-day
                    consensus: [75, 73, 65, 60, 58, 60, 65, 70, 73, 70, 75, 73, 85, 85],
                    startValue: 11,
                    endValue: 15,
                    consensusLevel: 'Strong'
                },
                'DePIN': {
                    color: '#5a6c8c',
                    displayMomentum: '+3100%',
                    dataPoints: [1, 1, 1, 2, 2, 3, 4, 5, 6, 2, 8, 18, 32, 32],  // Last 5 match 30-day
                    consensus: [10, 10, 10, 15, 20, 25, 30, 35, 40, 30, 50, 70, 90, 90],
                    startValue: 1,
                    endValue: 32,
                    consensusLevel: 'Peak'
                },
                'Crypto/Web3': {
                    color: '#5c7cfa',
                    displayMomentum: '-28%',
                    dataPoints: [36, 34, 32, 30, 28, 26, 24, 23, 22, 28, 25, 22, 26, 26],  // Last 5 match 30-day
                    consensus: [65, 63, 60, 58, 55, 50, 48, 45, 43, 57, 52, 50, 58, 58],
                    startValue: 36,
                    endValue: 26,
                    consensusLevel: 'Moderate'
                },
                'B2B SaaS': {
                    color: '#c77d7d',
                    displayMomentum: '-60%',
                    dataPoints: [20, 19, 18, 17, 16, 15, 14, 13, 12, 15, 12, 10, 8, 8],  // Last 5 match 30-day
                    consensus: [35, 33, 32, 30, 28, 27, 26, 25, 24, 33, 25, 20, 20, 20],
                    startValue: 20,
                    endValue: 8,
                    consensusLevel: 'Weak'
                },
                'Developer Tools': {
                    color: '#8a68a8',
                    displayMomentum: '+260%',
                    dataPoints: [5, 5, 6, 6, 7, 8, 9, 10, 11, 6, 10, 14, 18, 18],  // Last 5 match 30-day
                    consensus: [65, 65, 68, 70, 73, 75, 78, 80, 82, 83, 80, 86, 89, 89],
                    startValue: 5,
                    endValue: 18,
                    consensusLevel: 'Strong'
                }
            }
        }
    },
    
    // Initialize the component
    init: function(containerElement) {
        if (!containerElement) {
            console.error('NarrativePulse: No container element provided');
            return;
        }
        
        this.container = containerElement;
        
        // Check if container has the expected structure
        const chartContainer = containerElement.querySelector('.chart-container');
        if (!chartContainer) {
            console.error('NarrativePulse: Chart container not found in provided element');
            return;
        }
        
        // Initialize data if not already set
        if (!this.topicDataByDate) {
            this.topicDataByDate = NarrativePulse.topicDataByDate;
        }
        
        // Calculate consistent x-positions for 5 data points
        // Set initial time range
        this.currentTimeRange = '7 days';
        const config = this.timeRangeConfigs[this.currentTimeRange];
        this.dateLabels = config.dateLabels;
        
        // Calculate X positions
        this.calculateXPositions();
        
        // Get panel elements (now at document level for proper viewport positioning)
        this.panel = document.querySelector('.topic-customization-panel');
        this.backdrop = document.querySelector('.topic-customization-backdrop');
        
        // Load saved topics from localStorage
        this.loadSelectedTopics();
        
        this.bindEvents();
        this.currentView = 'momentum'; // Set initial view
        this.createMomentumView(); // Create the momentum view with all elements
        this.updateInsightCards(); // Initialize insight cards
        
        // Initialize interactions after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.initMomentumView(); // Initialize interactions
        }, 50);
        
        this.addTouchSupport(); // Add touch event support
        
        // Expose global functions for backward compatibility
        window.createConsensusView = this.createConsensusView.bind(this);
        window.updateTooltipPosition = this.updateTooltipPosition.bind(this);
        window.setTopicFilter = this.setTopicFilter.bind(this);
        window.clearTopicFilter = this.clearTopicFilter.bind(this);
    },
    
    // Bind event listeners
    bindEvents: function() {
        const container = this.container;
        
        // Time range toggle
        const timeRangeBtn = container.querySelector('[data-action="toggleTimeRange"]');
        if (timeRangeBtn) {
            timeRangeBtn.addEventListener('click', this.toggleTimeRange.bind(this));
        }
        
        // View toggle
        const viewBtn = container.querySelector('[data-action="toggleView"]');
        if (viewBtn) {
            viewBtn.addEventListener('click', this.toggleView.bind(this));
        }
        
        // Filter clear button
        const filterClearBtn = container.querySelector('[data-action="clearTopicFilter"]');
        if (filterClearBtn) {
            filterClearBtn.addEventListener('click', this.clearTopicFilter.bind(this));
        }
        
        // Topic customization button
        const customizeBtn = container.querySelector('[data-action="customizeTopics"]');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', this.openCustomizationPanel.bind(this));
        }
        
        // Panel close button (now at document level)
        const closeBtn = document.querySelector('[data-action="closeCustomizationPanel"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeCustomizationPanel.bind(this));
        }
        
        // Cancel button (now at document level)
        const cancelBtn = document.querySelector('[data-action="cancelCustomization"]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', this.closeCustomizationPanel.bind(this));
        }
        
        // Apply button (now at document level)
        const applyBtn = document.querySelector('[data-action="applyTopics"]');
        if (applyBtn) {
            applyBtn.addEventListener('click', this.applyTopicSelection.bind(this));
        }
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', this.closeCustomizationPanel.bind(this));
        }
    },
    
    // Create Catmull-Rom spline path
    createCatmullRomPath: function(xPoints, yPoints) {
        if (xPoints.length < 2) return '';
        
        let path = `M ${xPoints[0]},${yPoints[0]}`;
        
        for (let i = 0; i < xPoints.length - 1; i++) {
            const p0x = i > 0 ? xPoints[i - 1] : xPoints[0];
            const p0y = i > 0 ? yPoints[i - 1] : yPoints[0];
            const p1x = xPoints[i];
            const p1y = yPoints[i];
            const p2x = xPoints[i + 1];
            const p2y = yPoints[i + 1];
            const p3x = i < xPoints.length - 2 ? xPoints[i + 2] : xPoints[xPoints.length - 1];
            const p3y = i < yPoints.length - 2 ? yPoints[i + 2] : yPoints[yPoints.length - 1];
            
            // Calculate control points
            const cp1x = p1x + (p2x - p0x) / 6;
            const cp1y = p1y + (p2y - p0y) / 6;
            const cp2x = p2x - (p3x - p1x) / 6;
            const cp2y = p2y - (p3y - p1y) / 6;
            
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2x},${p2y}`;
        }
        
        return path;
    },
    
    // Create grid lines for charts
    // Calculate X positions based on date labels
    calculateXPositions: function() {
        this.xPositions = this.dateLabels.map((_, i) => 
            this.padding + (i * ((this.chartWidth - 2 * this.padding) / (this.dateLabels.length - 1)))
        );
    },
    
    // Get current time range data
    getCurrentData: function() {
        return this.timeRangeData[this.currentTimeRange];
    },
    
    // Get topic data for current time range
    getTopicData: function(topic) {
        const data = this.getCurrentData();
        return data.topics[topic] || null;
    },
    
    // Calculate Y scale for topic data points
    calculateYScale: function(dataPoints) {
        const maxValue = Math.max(...dataPoints);
        const minValue = Math.min(...dataPoints);
        const chartBottom = 220;
        const chartTop = 40;
        const range = chartBottom - chartTop;
        
        // Map min value to bottom and max value to top
        const yStart = chartBottom - ((dataPoints[0] - minValue) / (maxValue - minValue)) * range;
        const yEnd = chartBottom - ((dataPoints[dataPoints.length - 1] - minValue) / (maxValue - minValue)) * range;
        
        return { start: yStart, end: yEnd };
    },
    
    createGridLines: function() {
        return this.xPositions.map(x => 
            `<line x1="${x}" y1="40" x2="${x}" y2="240" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>`
        ).join('');
    },
    
    // Create date labels with optional mobile responsiveness
    createDateLabels: function(hideOnMobile = false) {
        return this.dateLabels.map((date, i) => {
            const className = hideOnMobile && i % 2 === 1 ? 'hide-mobile' : '';
            return `<text x="${this.xPositions[i]}" y="260" fill="#6b7280" font-size="11" 
                     text-anchor="middle" class="${className}">${date}</text>`;
        }).join('');
    },
    
    // Toggle Time Range
    toggleTimeRange: function() {
        const timeText = this.container.querySelector('#timeRangeText');
        const current = timeText.textContent;
        
        // Update time range
        if (current === '7 days') {
            this.currentTimeRange = '30 days';
        } else if (current === '30 days') {
            this.currentTimeRange = '90 days';
        } else {
            this.currentTimeRange = '7 days';
        }
        
        // Update UI text
        timeText.textContent = this.currentTimeRange;
        
        // Update date labels and recalculate x positions
        const config = this.timeRangeConfigs[this.currentTimeRange];
        this.dateLabels = config.dateLabels;
        this.calculateXPositions();
        
        // Refresh current view with new data
        const chartContent = this.container.querySelector('#chartContent');
        chartContent.classList.add('fade-out');
        
        setTimeout(() => {
            if (this.currentView === 'momentum') {
                this.createMomentumView();
            } else if (this.currentView === 'volume') {
                this.createVolumeView();
            } else {
                this.createConsensusView();
            }
            
            chartContent.classList.remove('fade-out');
            chartContent.classList.add('fade-in');
            
            setTimeout(() => {
                chartContent.classList.remove('fade-in');
            }, 150);
        }, 150);
        
        // Update insight cards for the new time range
        this.updateInsightCards();
    },
    
    // Update insight cards based on current time range
    updateInsightCards: function() {
        const insights = this.container.querySelectorAll('.insight-text');
        if (insights.length < 3) return;
        
        const currentData = this.getCurrentData();
        const timeRangeText = this.currentTimeRange;
        
        // Define insights for each time range
        const insightData = {
            '7 days': [
                {
                    highlight: 'Weekly Momentum:',
                    text: 'DePIN accelerating +28.8% this week, leading narrative shift'
                },
                {
                    highlight: 'Velocity Spike:',
                    text: 'Vertical SaaS mentions up 55.6% as specialization gains traction'
                },
                {
                    highlight: 'Daily Pattern:',
                    text: 'Developer tools discussion peaks mid-week, 46.9% weekly growth'
                }
            ],
            '30 days': [
                {
                    highlight: 'Strong Consensus:',
                    text: 'AI infrastructure investment thesis validated across 12 sources'
                },
                {
                    highlight: 'Narrative Shift:',
                    text: 'From "growth at all costs" to "efficient growth" - mentioned 47 times'
                },
                {
                    highlight: 'Emerging Theme:',
                    text: 'Developer tools seeing renewed interest after 2-year lull'
                }
            ],
            '90 days': [
                {
                    highlight: 'Quarterly Trend:',
                    text: 'DePIN exploded from 2 to 201 mentions, defining new infrastructure era'
                },
                {
                    highlight: 'Recovery Story:',
                    text: 'Capital efficiency sentiment recovered from July lows, now strong consensus'
                },
                {
                    highlight: 'Sustained Growth:',
                    text: 'AI Agents maintained 268% growth over quarter, mainstream adoption clear'
                }
            ]
        };
        
        const currentInsights = insightData[timeRangeText] || insightData['30 days'];
        
        insights.forEach((insightEl, index) => {
            if (currentInsights[index]) {
                insightEl.innerHTML = `<span class="insight-highlight">${currentInsights[index].highlight}</span> ${currentInsights[index].text}`;
            }
        });
    },
    
    // Toggle View Mode with smooth transitions
    toggleView: function() {
        const viewText = this.container.querySelector('#viewText');
        const chartContent = this.container.querySelector('#chartContent');
        const current = viewText.textContent;
        
        // Clean up existing event handlers before switching views
        this.cleanupViewEventHandlers();
        
        // Fade out current view
        chartContent.classList.add('fade-out');
        
        // Wait for fade out, then switch view and fade in
        setTimeout(() => {
            if (current === 'Momentum') {
                viewText.textContent = 'Volume';
                this.currentView = 'volume';
                this.createVolumeView();
            } else if (current === 'Volume') {
                viewText.textContent = 'Consensus';
                this.currentView = 'consensus';
                this.createConsensusView();
            } else {
                viewText.textContent = 'Momentum';
                this.currentView = 'momentum';
                this.createMomentumView();
            }
            
            // Remove fade-out and add fade-in
            chartContent.classList.remove('fade-out');
            chartContent.classList.add('fade-in');
            
            // Clean up fade-in class after animation
            setTimeout(() => {
                chartContent.classList.remove('fade-in');
            }, 150);
        }, 150);
        
        // Update insight cards for the new time range
        this.updateInsightCards();
    },
    
    // Update insight cards based on current time range
    updateInsightCards: function() {
        const insights = this.container.querySelectorAll('.insight-text');
        if (insights.length < 3) return;
        
        const currentData = this.getCurrentData();
        const timeRangeText = this.currentTimeRange;
        
        // Define insights for each time range
        const insightData = {
            '7 days': [
                {
                    highlight: 'Weekly Momentum:',
                    text: 'DePIN accelerating +28.8% this week, leading narrative shift'
                },
                {
                    highlight: 'Velocity Spike:',
                    text: 'Vertical SaaS mentions up 55.6% as specialization gains traction'
                },
                {
                    highlight: 'Daily Pattern:',
                    text: 'Developer tools discussion peaks mid-week, 46.9% weekly growth'
                }
            ],
            '30 days': [
                {
                    highlight: 'Strong Consensus:',
                    text: 'AI infrastructure investment thesis validated across 12 sources'
                },
                {
                    highlight: 'Narrative Shift:',
                    text: 'From "growth at all costs" to "efficient growth" - mentioned 47 times'
                },
                {
                    highlight: 'Emerging Theme:',
                    text: 'Developer tools seeing renewed interest after 2-year lull'
                }
            ],
            '90 days': [
                {
                    highlight: 'Quarterly Trend:',
                    text: 'DePIN exploded from 2 to 201 mentions, defining new infrastructure era'
                },
                {
                    highlight: 'Recovery Story:',
                    text: 'Capital efficiency sentiment recovered from July lows, now strong consensus'
                },
                {
                    highlight: 'Sustained Growth:',
                    text: 'AI Agents maintained 268% growth over quarter, mainstream adoption clear'
                }
            ]
        };
        
        const currentInsights = insightData[timeRangeText] || insightData['30 days'];
        
        insights.forEach((insightEl, index) => {
            if (currentInsights[index]) {
                insightEl.innerHTML = `<span class="insight-highlight">${currentInsights[index].highlight}</span> ${currentInsights[index].text}`;
            }
        });
    },
    
    // Create Volume View
    createVolumeView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const currentData = this.getCurrentData();
        
        // Update legend first
        this.updateLegend();
        
        // Calculate max total mentions for scaling
        let maxTotal = 0;
        const totalsPerDate = [];
        
        // Calculate totals for each data point
        for (let i = 0; i < this.dateLabels.length; i++) {
            let total = 0;
            this.selectedTopics.forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints[i]) {
                    total += topicData.dataPoints[i];
                }
            });
            totalsPerDate.push(total);
            maxTotal = Math.max(maxTotal, total);
        }
        
        // Adjust bar width based on number of data points
        const barWidth = this.dateLabels.length > 7 ? 40 : 60;
        const chartPaddingLeft = this.dateLabels.length > 7 ? 10 : 20;
        const maxHeight = 160;
        const baseY = 220;
        const yAxisX = 35;
        
        // Calculate Y-axis scale
        const yScale = Math.ceil(maxTotal / 50) * 50; // Round up to nearest 50
        
        let html = `
            <!-- Horizontal grid lines for Y-axis -->
            <line x1="${this.padding}" y1="60" x2="${this.chartWidth - this.padding}" y2="60" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="100" x2="${this.chartWidth - this.padding}" y2="100" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="140" x2="${this.chartWidth - this.padding}" y2="140" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="180" x2="${this.chartWidth - this.padding}" y2="180" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="220" x2="${this.chartWidth - this.padding}" y2="220" stroke="#e5e7eb" stroke-width="1"/>
            
            <!-- Vertical grid lines -->
            ${this.createGridLines()}
            
            <!-- Y-axis labels -->
            <text x="${yAxisX}" y="64" fill="#9ca3af" font-size="10" text-anchor="end">${Math.round(yScale * 0.8)}</text>
            <text x="${yAxisX}" y="104" fill="#9ca3af" font-size="10" text-anchor="end">${Math.round(yScale * 0.6)}</text>
            <text x="${yAxisX}" y="144" fill="#9ca3af" font-size="10" text-anchor="end">${Math.round(yScale * 0.4)}</text>
            <text x="${yAxisX}" y="184" fill="#9ca3af" font-size="10" text-anchor="end">${Math.round(yScale * 0.2)}</text>
            <text x="${yAxisX}" y="224" fill="#9ca3af" font-size="10" text-anchor="end">0</text>
            
            <!-- Y-axis label -->
            <text x="15" y="140" fill="#6b7280" font-size="11" text-anchor="middle" transform="rotate(-90 15 140)">Mentions</text>
        `;
        
        // Create stacked bars for each date
        this.dateLabels.forEach((date, dateIndex) => {
            const x = this.xPositions[dateIndex];
            let currentY = baseY;
            
            // Create bars for each selected topic (reverse order for stacking)
            [...this.selectedTopics].reverse().forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                    const mentions = topicData.dataPoints[dateIndex];
                    const barHeight = (mentions / yScale) * maxHeight;
                    
                    if (barHeight > 0) {
                        currentY -= barHeight;
                        
                        html += `
                            <g class="volume-bar-segment" data-date="${date}" data-topic="${topic}" data-mentions="${mentions}">
                                <rect x="${x}" y="${currentY}" width="${barWidth}" height="${barHeight}"
                                      fill="${topicData.color}" opacity="0.8" rx="2"
                                      class="volume-bar-rect"/>
                                <!-- Hover dot (initially hidden) - positioned at top of this segment -->
                                <circle cx="${x + barWidth/2}" cy="${currentY - 5}" r="4" 
                                        fill="${topicData.color}" opacity="0" 
                                        class="volume-hover-dot"/>
                            </g>
                        `;
                    }
                }
            });
        });
        
        html += `
            <!-- Date labels -->
            ${this.createDateLabels(true)}
        `;
        
        chartContent.innerHTML = html;
        
        // Initialize volume interactions
        this.initVolumeInteractions();
    },
    
    // Initialize volume interactions
    initVolumeInteractions: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const tooltip = this.container.querySelector('#chartTooltip');
        const segments = this.container.querySelectorAll('.volume-bar-segment');
        
        // Store currentHoveredDate on the object to persist state properly
        this.currentHoveredDate = null;
        
        // Handle hover on segments
        segments.forEach(segment => {
            const handleSegmentMouseEnter = (e) => {
                const date = segment.dataset.date;
                const dateIndex = this.dateLabels.indexOf(date);
                const currentData = this.getCurrentData();
                
                // Show dots for all segments of this date
                if (this.currentHoveredDate !== date) {
                    // Hide previous dots
                    if (this.currentHoveredDate) {
                        this.container.querySelectorAll(`.volume-bar-segment[data-date="${this.currentHoveredDate}"] .volume-hover-dot`)
                            .forEach(dot => dot.style.opacity = '0');
                    }
                    
                    // Show new dots
                    this.container.querySelectorAll(`.volume-bar-segment[data-date="${date}"] .volume-hover-dot`)
                        .forEach(dot => dot.style.opacity = '1');
                    
                    this.currentHoveredDate = date;
                }
                
                // Calculate total mentions for this date
                let total = 0;
                const topicBreakdown = [];
                
                this.selectedTopics.forEach(topic => {
                    const topicData = currentData.topics[topic];
                    if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                        const mentions = topicData.dataPoints[dateIndex];
                        total += mentions;
                        topicBreakdown.push({
                            topic: topic,
                            mentions: mentions,
                            color: topicData.color
                        });
                    }
                });
                
                // Format date
                const [month, day] = date.split(' ');
                const formattedDate = `${month} ${day}, 2025`;
                
                // Build tooltip content
                let html = `
                    <div class="volume-tooltip-content">
                        <div class="tooltip-header">
                            <div class="tooltip-date">${formattedDate}</div>
                            <div class="tooltip-total">Total: ${total} mentions</div>
                        </div>
                        <div class="tooltip-divider"></div>
                        <div class="tooltip-breakdown">
                            <div class="breakdown-label">Breakdown by topic:</div>
                `;
                
                // Add topic breakdown
                topicBreakdown.forEach(item => {
                    const percentage = total > 0 ? ((item.mentions / total) * 100).toFixed(1) : '0';
                    
                    html += `
                        <div class="topic-row">
                            <span class="topic-dot" style="background-color: ${item.color}"></span>
                            <span class="topic-name">${item.topic}:</span>
                            <span class="topic-stats">${item.mentions} (${percentage}%)</span>
                        </div>
                    `;
                });
                
                // Add top episodes if available in current data
                if (currentData.topEpisodes && currentData.topEpisodes[date]) {
                    const episodes = currentData.topEpisodes[date];
                    html += `
                        </div>
                        <div class="tooltip-divider"></div>
                        <div class="tooltip-episodes">
                            <div class="episodes-label">Top episodes this day:</div>
                    `;
                    
                    episodes.forEach((episode, index) => {
                        html += `
                            <div class="episode-row">
                                <span class="episode-number">${index + 1}.</span>
                                <div class="episode-content">
                                    <span class="episode-title">${episode.title}</span>
                                    <span class="episode-podcast">- ${episode.podcast}</span>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                
                html += '</div>';
                
                // Reset tooltip and add view-specific class
                tooltip.className = 'chart-tooltip chart-tooltip-volume';
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';
                
                tooltip.innerHTML = html;
                tooltip.classList.add('visible');
                this.updateTooltipPosition(e);
            };
            
            // Add event listener for each segment
            this.addEventListener(segment, 'mouseenter', handleSegmentMouseEnter, 'volume');
        });
        
        // Handle mouse leave from chart
        const handleChartMouseLeave = () => {
            // Hide all dots
            if (this.currentHoveredDate) {
                this.container.querySelectorAll('.volume-hover-dot')
                    .forEach(dot => dot.style.opacity = '0');
                this.currentHoveredDate = null;
            }
            
            // Hide tooltip with delay
            this.hideTooltipWithDelay();
        };
        
        // Update tooltip position on mouse move
        const handleChartMouseMove = (e) => {
            if (tooltip.classList.contains('visible')) {
                this.updateTooltipPosition(e);
            }
        };
        
        // Add event listeners using the new management system
        this.addEventListener(chartContent, 'mouseleave', handleChartMouseLeave, 'volume');
        this.addEventListener(chartContent, 'mousemove', handleChartMouseMove, 'volume');
        
        // Add additional listener to the chart wrapper for better boundary detection
        const chartWrapper = this.container.querySelector('.chart-wrapper');
        if (chartWrapper) {
            this.addEventListener(chartWrapper, 'mouseleave', handleChartMouseLeave, 'volume');
        }
    },
    
    // Create Consensus View  
    createConsensusView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const topicNames = this.selectedTopics;
        const currentData = this.getCurrentData();
        
        // Update legend first
        this.updateLegend();
        
        // Grid layout configuration - align with chart axes
        const gridStartX = this.padding; // Start at y-axis (50px)
        const gridStartY = 50;  // Moved up another 10px (was 60)
        const availableWidth = this.chartWidth - (2 * this.padding); // 700px
        const numCells = this.dateLabels.length;
        const cellWidth = (availableWidth - ((numCells - 1) * 1)) / numCells;
        const cellHeight = (220 - gridStartY) / topicNames.length - 1; // Maximum vertical space
        const cellGap = 1;      // 1px gap between cells
        
        // Color gradient based on consensus percentage
        const getConsensusColor = (percent) => {
            if (percent >= 90) return '#2d5a3d'; // Deep green - Peak
            if (percent >= 70) return '#4a7c59'; // Sage green - Strong
            if (percent >= 50) return '#7fa569'; // Medium green - Building
            if (percent >= 30) return '#f4a261'; // Amber - Mixed
            return '#c77d7d'; // Dusty rose - Contested
        };
        
        let html = `
            <!-- Background -->
            <rect x="0" y="0" width="${this.chartWidth}" height="${this.chartHeight}" fill="transparent"/>
            
            <!-- Grid cells -->
            ${topicNames.map((topic, rowIndex) => {
                const topicData = currentData.topics[topic];
                if (!topicData || !topicData.consensus) return '';
                
                return this.dateLabels.map((date, colIndex) => {
                    const percent = topicData.consensus[colIndex] || 0;
                    const x = gridStartX + colIndex * (cellWidth + cellGap);
                    const y = gridStartY + rowIndex * (cellHeight + cellGap);
                    const fillColor = getConsensusColor(percent);
                    const textColor = percent >= 60 ? 'white' : '#374151';
                    
                    return `
                        <g class="consensus-cell-group" data-topic="${topic}" data-date="${date}" data-percent="${percent}" data-index="${colIndex}">
                            <rect class="consensus-cell"
                                  x="${x}" y="${y}"
                                  width="${cellWidth}" height="${cellHeight}"
                                  fill="${fillColor}"
                                  stroke="#e5e7eb" stroke-width="1"/>
                            <text x="${x + cellWidth/2}" y="${y + cellHeight/2 + 4}"
                                  fill="${textColor}"
                                  font-size="13" font-weight="600" text-anchor="middle">
                                ${percent.toFixed(0)}%
                            </text>
                        </g>
                    `;
                }).join('');
            }).join('')}
            
            <!-- Topic labels (left side) -->
            ${topicNames.map((topic, i) => {
                const y = gridStartY + i * (cellHeight + cellGap) + cellHeight/2;
                const topicData = currentData.topics[topic];
                const color = topicData ? topicData.color : '#666666';
                
                // Handle multi-line text for longer topic names
                if (topic === 'Capital Efficiency') {
                    return `
                        <g>
                            <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                            <text x="${this.padding - 28}" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Capital
                            </text>
                            <text x="${this.padding - 28}" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Efficiency
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'Developer Tools') {
                    return `
                        <g>
                            <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                            <text x="${this.padding - 28}" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Developer
                            </text>
                            <text x="${this.padding - 28}" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Tools
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'AI Infrastructure') {
                    return `
                        <g>
                            <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                            <text x="${this.padding - 28}" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                AI
                            </text>
                            <text x="${this.padding - 28}" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Infrastructure
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'Vertical SaaS') {
                    return `
                        <g>
                            <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                            <text x="${this.padding - 28}" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Vertical
                            </text>
                            <text x="${this.padding - 28}" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                SaaS
                            </text>
                        </g>
                    `;
                }
                
                return `
                    <g>
                        <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                        <text x="${this.padding - 28}" y="${y + 4}"
                              fill="#666666" font-size="12" text-anchor="end">
                            ${topic}
                        </text>
                    </g>
                `;
            }).join('')}
            
            
            <!-- Legend (right side - outside chart area) -->
            <g transform="translate(${this.chartWidth - this.padding + 20}, ${gridStartY})">
                <!-- Gradient bar -->
                <defs>
                    <linearGradient id="consensusGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#c77d7d;stop-opacity:1" />
                        <stop offset="30%" style="stop-color:#f4a261;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#7fa569;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#4a7c59;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2d5a3d;stop-opacity:1" />
                    </linearGradient>
                </defs>
                
                <rect x="0" y="0" width="10" height="${4 * (cellHeight + cellGap) - cellGap}" 
                      fill="url(#consensusGradient)" stroke="#e5e7eb" stroke-width="1"/>
                
                <!-- Legend labels -->
                <text x="15" y="5" fill="#666666" font-size="10">Peak (90%+)</text>
                <text x="15" y="${cellHeight * 0.8}" fill="#666666" font-size="10">Strong (70%+)</text>
                <text x="15" y="${cellHeight * 2}" fill="#666666" font-size="10">Building (50%+)</text>
                <text x="15" y="${cellHeight * 3}" fill="#666666" font-size="10">Mixed (30%+)</text>
                <text x="15" y="${cellHeight * 4 - 5}" fill="#666666" font-size="10">Contested (&lt;30%)</text>
            </g>
            
            <!-- Date labels (bottom) -->
            ${this.dateLabels.map((date, i) => {
                const x = gridStartX + i * (cellWidth + cellGap) + cellWidth/2;
                const bottomY = 260; // Match the y position of other charts
                return `
                    <text x="${x}" y="${bottomY}"
                          fill="#6b7280" font-size="11" text-anchor="middle">
                        ${date}
                    </text>
                `;
            }).join('')}
        `;
        
        chartContent.innerHTML = html;
        
        // Initialize consensus interactions
        this.initConsensusInteractions();
    },
    
    // Initialize consensus interactions
    initConsensusInteractions: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const tooltip = this.container.querySelector('#chartTooltip');
        const cellGroups = this.container.querySelectorAll('.consensus-cell-group');
        
        cellGroups.forEach(cellGroup => {
            const handleCellMouseEnter = (e) => {
                const topic = cellGroup.dataset.topic;
                const date = cellGroup.dataset.date;
                const percent = parseFloat(cellGroup.dataset.percent);
                const dateIndex = parseInt(cellGroup.dataset.index);
                const currentData = this.getCurrentData();
                const topicData = currentData.topics[topic];
                
                // Format date nicely
                const [month, day] = date.split(' ');
                const formattedDate = `${month} ${day}`;
                
                // Calculate mentions for this date
                const mentions = topicData && topicData.dataPoints ? topicData.dataPoints[dateIndex] : 0;
                const sources = Math.round(mentions * (percent / 100)); // Estimate positive sources
                
                // Build simplified tooltip
                let html = `
                    <div class="consensus-heatmap-tooltip">
                        <div class="tooltip-title">${topic} - ${formattedDate}</div>
                        <div class="tooltip-consensus">Consensus: ${percent}% positive</div>
                        <div class="tooltip-mentions">Based on ${mentions} mentions</div>
                        <div class="tooltip-sources">${sources} sources agree</div>
                    </div>
                `;
                
                // Reset tooltip and add view-specific class
                tooltip.className = 'chart-tooltip chart-tooltip-consensus';
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';
                
                tooltip.innerHTML = html;
                tooltip.classList.add('visible');
                this.updateTooltipPosition(e);
            };
            
            const handleCellMouseLeave = () => {
                this.hideTooltipWithDelay();
            };
            
            const handleCellMouseMove = (e) => {
                if (tooltip.classList.contains('visible')) {
                    this.updateTooltipPosition(e);
                }
            };
            
            // Add event listeners using the new management system
            this.addEventListener(cellGroup, 'mouseenter', handleCellMouseEnter, 'consensus');
            this.addEventListener(cellGroup, 'mouseleave', handleCellMouseLeave, 'consensus');
            this.addEventListener(cellGroup, 'mousemove', handleCellMouseMove, 'consensus');
        });
    },
    
    // Update tooltip position
    updateTooltipPosition: function(e) {
        const chartContainer = this.container.querySelector('.chart-container');
        const tooltip = this.container.querySelector('#chartTooltip');
        const rect = chartContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Initial position (right of cursor)
        let tooltipX = x + 15;
        let tooltipY = y - 30;

        // Get tooltip dimensions
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        // Adjust horizontal position if tooltip goes off-screen
        if (tooltipX + tooltipWidth > rect.width - 20) {
            tooltipX = x - tooltipWidth - 15;
        }

        // Adjust vertical position if tooltip goes off-screen
        // Increase the threshold to ensure tooltip isn't cut off when chart is near top of viewport
        if (tooltipY < 20) {
            tooltipY = y + 30; // Position below cursor with more clearance
        } else if (tooltipY + tooltipHeight > rect.height - 10) {
            tooltipY = rect.height - tooltipHeight - 10;
        }

        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
    },
    
    // Set topic filter
    setTopicFilter: function(topic) {
        const filterIndicator = this.container.querySelector('#filterActive');
        const filterTopicSpan = this.container.querySelector('#filterTopic');
        
        this.activeFilter = topic;
        window.activeFilter = topic; // Maintain global compatibility
        filterTopicSpan.textContent = topic;
        filterIndicator.classList.add('show');
        
        this.container.querySelectorAll('.topic-line').forEach(line => {
            if (line.dataset.topic === topic) {
                line.classList.add('active');
            } else {
                line.classList.add('dimmed');
            }
        });
        
        this.container.querySelector('#chartTooltip').classList.remove('visible');
    },
    
    // Clear topic filter
    clearTopicFilter: function() {
        const filterIndicator = this.container.querySelector('#filterActive');
        
        this.activeFilter = null;
        window.activeFilter = null; // Maintain global compatibility
        filterIndicator.classList.remove('show');
        
        this.container.querySelectorAll('.topic-line, .volume-bar, .consensus-row').forEach(el => {
            el.classList.remove('active', 'dimmed');
        });
    },
    
    // Create Momentum View (to avoid page reload)
    createMomentumView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        
        // Update legend first
        this.updateLegend();
        
        // Create paths for selected topics using dynamic data
        const currentData = this.getCurrentData();
        const pathConfigs = {};
        
        // Build path configs from current time range data
        Object.keys(currentData.topics).forEach(topic => {
            const topicData = currentData.topics[topic];
            const yScale = this.calculateYScale(topicData.dataPoints);
            pathConfigs[topic] = {
                momentum: topicData.displayMomentum,
                color: topicData.color,
                yStart: yScale.start,
                yEnd: yScale.end,
                dataPoints: topicData.dataPoints
            };
        });
        
        const paths = this.selectedTopics.map(topic => ({
            topic: topic,
            ...pathConfigs[topic]
        }));
        
        // Calculate Y-axis scale based on actual data
        const allDataPoints = Object.values(currentData.topics).flatMap(t => t.dataPoints);
        const maxDataValue = Math.max(...allDataPoints);
        const minDataValue = Math.min(...allDataPoints);
        
        // Add some padding to the scale
        const range = maxDataValue - minDataValue;
        const padding = range * 0.1;
        const scaleMax = Math.ceil((maxDataValue + padding) / 10) * 10;
        const scaleMin = Math.floor((minDataValue - padding) / 10) * 10;
        
        // Calculate Y-axis labels
        const yAxisSteps = 5;
        const stepSize = (scaleMax - scaleMin) / (yAxisSteps - 1);
        const yAxisLabels = [];
        for (let i = 0; i < yAxisSteps; i++) {
            yAxisLabels.push(Math.round(scaleMax - (i * stepSize)));
        }
        
        chartContent.innerHTML = `
            <!-- Horizontal grid lines -->
            <line x1="${this.padding}" y1="40" x2="${this.chartWidth - this.padding}" y2="40" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="80" x2="${this.chartWidth - this.padding}" y2="80" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="120" x2="${this.chartWidth - this.padding}" y2="120" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="160" x2="${this.chartWidth - this.padding}" y2="160" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="200" x2="${this.chartWidth - this.padding}" y2="200" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="220" x2="${this.chartWidth - this.padding}" y2="220" stroke="#e5e7eb" stroke-width="1"/>
            
            <!-- Vertical grid lines -->
            ${this.createGridLines()}
            
            <!-- Y-axis labels for momentum -->
            <text x="35" y="44" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[0]}</text>
            <text x="35" y="84" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[1]}</text>
            <text x="35" y="124" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[2]}</text>
            <text x="35" y="164" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[3]}</text>
            <text x="35" y="204" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[4]}</text>
            
            <!-- Y-axis label -->
            <text x="15" y="130" fill="#6b7280" font-size="11" text-anchor="middle" transform="rotate(-90 15 130)">Mentions</text>
            
            <!-- Momentum view paths -->
            ${paths.map(p => {
                if (!p.dataPoints || p.dataPoints.length === 0) return '';
                
                // Use the same scale values as Y-axis labels
                const chartBottom = 220;
                const chartTop = 40;
                const range = chartBottom - chartTop;
                
                const yPositions = p.dataPoints.map(value => 
                    chartBottom - ((value - scaleMin) / (scaleMax - scaleMin)) * range
                );
                
                // Create smooth path data
                let pathData = '';
                
                if (yPositions.length > 1) {
                    // Different approaches based on number of points
                    if (yPositions.length <= 5) {
                        // For 5 or fewer points (30-day view), use quadratic curves
                        pathData = `M ${this.xPositions[0]},${yPositions[0]}`;
                        pathData += ` Q ${this.xPositions[1]},${yPositions[1]} ${this.xPositions[2]},${yPositions[2]}`;
                        if (yPositions.length > 3) {
                            pathData += ` T ${this.xPositions[3]},${yPositions[3]}`;
                        }
                        if (yPositions.length > 4) {
                            pathData += ` T ${this.xPositions[4]},${yPositions[4]}`;
                        }
                    } else {
                        // For more points (7-day and 90-day), use Catmull-Rom spline
                        pathData = this.createCatmullRomPath(this.xPositions, yPositions);
                    }
                }
                
                return `<g class="topic-line chart-transition" data-topic="${p.topic}" data-momentum="${p.momentum}" data-color="${p.color}">
                    <path d="${pathData}" 
                          fill="none" stroke="${p.color}" stroke-width="3" class="topic-path animate-path chart-transition"/>
                    <!-- Static dots at data points -->
                    ${this.xPositions.map((x, i) => `
                        <circle cx="${x}" cy="${yPositions[i]}" r="3" fill="${p.color}" 
                                class="data-point-dot chart-transition" opacity="0" data-topic="${p.topic}"/>
                    `).join('')}
                </g>`;
            }).join('')}
            
            <!-- Vertical tracking line (hidden by default) -->
            <line id="verticalTracker" x1="0" y1="40" x2="0" y2="220" 
                  stroke="#6b7280" stroke-width="1" opacity="0" stroke-dasharray="4,4"/>
            
            <!-- Date labels -->
            ${this.createDateLabels(true)}
        `;
        
        // Re-initialize momentum view interactions after DOM update
        setTimeout(() => {
            this.initMomentumView();
        }, 50);
    },
    
    // Initialize momentum view interactions
    initMomentumView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const tooltip = this.container.querySelector('#chartTooltip');
        const verticalTracker = this.container.querySelector('#verticalTracker');
        const chartContainer = this.container.querySelector('.chart-container');
        const svg = this.container.querySelector('#narrativeChart');
        const dots = this.container.querySelectorAll('.data-point-dot');
        
        // Check if elements exist
        if (!chartContent || !tooltip || !verticalTracker || !chartContainer || !svg) {
            console.error('Narrative Pulse: Required elements not found', {
                chartContent: !!chartContent,
                tooltip: !!tooltip,
                verticalTracker: !!verticalTracker,
                chartContainer: !!chartContainer,
                svg: !!svg
            });
            return;
        }
        
        // Ensure tooltip is properly positioned
        tooltip.style.pointerEvents = 'none';
        
        // Show dots and vertical line on chart hover - use chartContent instead of container
        const handleMomentumMouseEnter = () => {
            if (verticalTracker) verticalTracker.setAttribute('opacity', '0.5');
            dots.forEach(dot => dot.setAttribute('opacity', '1'));
        };
        
        const handleMomentumMouseLeave = () => {
            if (verticalTracker) verticalTracker.setAttribute('opacity', '0');
            dots.forEach(dot => dot.setAttribute('opacity', '0'));
            this.hideTooltipWithDelay();
        };
        
        const handleMomentumMouseMove = (e) => {
            // Cancel previous frame if still pending
            if (this.mouseMoveFrame) {
                cancelAnimationFrame(this.mouseMoveFrame);
            }
            
            // Schedule update for next frame
            this.mouseMoveFrame = requestAnimationFrame(() => {
                // Get mouse position relative to chart container
                const containerRect = chartContainer.getBoundingClientRect();
                const svgRect = svg.getBoundingClientRect();
                const x = e.clientX - svgRect.left;
                
                // Map client X to SVG X coordinates
                const containerWidth = svgRect.width;
                const svgWidth = this.chartWidth; // Use actual chart width
                const svgX = (x / containerWidth) * svgWidth;
                
                // Find nearest date index based on SVG coordinates
                let nearestIndex = 0;
                let minDistance = Math.abs(svgX - this.xPositions[0]);
                
                for (let i = 1; i < this.xPositions.length; i++) {
                    const distance = Math.abs(svgX - this.xPositions[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestIndex = i;
                    }
                }
                
                // Update vertical line position
                const nearestX = this.xPositions[nearestIndex];
                if (verticalTracker) {
                    verticalTracker.setAttribute('x1', nearestX);
                    verticalTracker.setAttribute('x2', nearestX);
                }
                
                // Highlight data points at this x position
                dots.forEach(dot => {
                    const dotX = parseFloat(dot.getAttribute('cx'));
                    if (Math.abs(dotX - nearestX) < 1) {
                        dot.setAttribute('r', '5');
                        dot.setAttribute('opacity', '1');
                    } else {
                        dot.setAttribute('r', '3');
                        dot.setAttribute('opacity', '0.5');
                    }
                });
                
                // Show tooltip with rich content
                this.showRichTooltip(nearestIndex, e);
                
                this.mouseMoveFrame = null;
            });
        };
        
        // Add event listeners using the new management system
        // Also add listeners to the SVG element to ensure proper boundary detection
        this.addEventListener(chartContent, 'mouseenter', handleMomentumMouseEnter, 'momentum');
        this.addEventListener(chartContent, 'mouseleave', handleMomentumMouseLeave, 'momentum');
        this.addEventListener(chartContent, 'mousemove', handleMomentumMouseMove, 'momentum');
        
        // Add additional listeners to the SVG element for better event capture
        this.addEventListener(svg, 'mouseleave', handleMomentumMouseLeave, 'momentum');
        
        // Handle click for filtering
        const topicLines = this.container.querySelectorAll('.topic-line');
        topicLines.forEach(line => {
            const handleLineClick = () => {
                const topic = line.dataset.topic;
                if (this.activeFilter === topic || window.activeFilter === topic) {
                    this.clearTopicFilter();
                } else {
                    this.setTopicFilter(topic);
                }
            };
            this.addEventListener(line, 'click', handleLineClick, 'momentum');
        });
    },
    
    // Show rich tooltip with all topic data
    showRichTooltip: function(dateIndex, mouseEvent) {
        const tooltip = this.container.querySelector('#chartTooltip');
        const date = this.dateLabels[dateIndex];
        const currentData = this.getCurrentData();
        
        // For 30-day view, try to use the old structure if available
        let dateData = null;
        if (this.currentTimeRange === '30 days' && this.topicDataByDate && this.topicDataByDate[date]) {
            dateData = this.topicDataByDate[date];
        }
        
        // Clear hide timer
        if (this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
            this.hideTooltipTimer = null;
        }
        
        // Reset tooltip and add view-specific class
        tooltip.className = 'chart-tooltip chart-tooltip-momentum';
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        
        // Format date nicely
        const [month, day] = date.split(' ');
        const formattedDate = `${month} ${day}, 2025`;
        
        // Build topic data from the new structure
        const topicStats = [];
        
        if (dateData) {
            // Use old structure for 30-day view
            const topics = Object.entries(dateData)
                .filter(([key]) => key !== 'topEpisodes' && this.selectedTopics.includes(key))
                .sort((a, b) => b[1].mentions - a[1].mentions);
            
            topics.forEach(([topic, data]) => {
                topicStats.push({
                    topic: topic,
                    mentions: data.mentions,
                    color: this.getTopicColor(topic),
                    weekOverWeek: data.weekOverWeek || 0
                });
            });
        } else {
            // Use new structure for 7-day and 90-day views
            this.selectedTopics.forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                    topicStats.push({
                        topic: topic,
                        mentions: topicData.dataPoints[dateIndex],
                        color: topicData.color,
                        weekOverWeek: 0 // Not available in new structure
                    });
                }
            });
            
            // Sort by mentions
            topicStats.sort((a, b) => b.mentions - a.mentions);
        }
        
        // Build tooltip HTML
        let html = `
            <div class="rich-tooltip-content">
                <div class="tooltip-date">${formattedDate}</div>
                <div class="tooltip-divider"></div>
        `;
        
        topicStats.forEach(stat => {
            const changeText = stat.weekOverWeek > 0 ? 
                `+${stat.weekOverWeek}% w/w` : '';
            const isFaded = stat.mentions < 10;
            
            html += `
                <div class="topic-section ${isFaded ? 'faded-topic' : ''}">
                    <div class="topic-header">
                        <span class="topic-dot" style="background-color: ${stat.color}"></span>
                        <span class="topic-name">${stat.topic}</span>
                    </div>
                    <div class="topic-stats">
                        ${stat.mentions} mentions${changeText ? ' • ' + changeText : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        tooltip.innerHTML = html;
        tooltip.classList.add('visible');
        this.updateTooltipPosition(mouseEvent);
    },
    
    // Get topic color
    getTopicColor: function(topic) {
        const currentData = this.getCurrentData();
        const topicData = currentData.topics[topic];
        if (topicData && topicData.color) {
            return topicData.color;
        }
        
        // Fallback colors
        const colors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d',
            'Developer Tools': '#8a68a8',
            'Vertical SaaS': '#7d9c8d',
            'AI Infrastructure': '#a87c68'
        };
        return colors[topic] || '#6b7280';
    },
    
    // Event listener management methods
    addEventListener: function(element, event, handler, view) {
        if (!element || !handler) return;
        
        element.addEventListener(event, handler);
        const listenerInfo = { element, event, handler };
        
        if (view && this.eventListeners[view]) {
            this.eventListeners[view].push(listenerInfo);
        } else {
            this.eventListeners.global.push(listenerInfo);
        }
    },
    
    removeViewListeners: function(view) {
        if (!this.eventListeners[view]) return;
        
        this.eventListeners[view].forEach(({ element, event, handler }) => {
            if (element && handler) {
                element.removeEventListener(event, handler);
            }
        });
        this.eventListeners[view] = [];
    },
    
    removeAllListeners: function() {
        Object.keys(this.eventListeners).forEach(view => {
            this.removeViewListeners(view);
        });
    },
    
    // Reset tooltip completely
    resetTooltip: function() {
        const tooltip = this.container?.querySelector('#chartTooltip');
        if (!tooltip) return;
        
        // Clear all content
        tooltip.innerHTML = '';
        
        // Reset to base class only
        tooltip.className = 'chart-tooltip';
        
        // Clear all inline styles
        tooltip.style.cssText = '';
        
        // Ensure it's hidden
        tooltip.classList.remove('visible');
        tooltip.style.opacity = '0';
        tooltip.style.display = 'none';
    },
    
    // Hide tooltip with delay
    hideTooltipWithDelay: function() {
        // Clear any existing timer first
        if (this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        
        this.hideTooltipTimer = setTimeout(() => {
            const tooltip = this.container.querySelector('#chartTooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
                // Also ensure display is hidden after transition
                setTimeout(() => {
                    if (!tooltip.classList.contains('visible')) {
                        tooltip.style.display = 'none';
                    }
                }, 200); // Match the opacity transition duration
            }
        }, 100);
    },
    
    // Create loading skeleton
    createLoadingSkeleton: function() {
        const chartContent = this.container.querySelector('#chartContent');
        
        let html = `
            <g class="skeleton-group">
                <!-- Y-axis skeleton -->
                <rect x="10" y="40" width="30" height="180" class="skeleton-loading" rx="2"/>
                
                <!-- X-axis skeleton -->
                <rect x="50" y="220" width="700" height="2" class="skeleton-loading"/>
                
                <!-- Chart content skeleton -->
                ${[1, 2, 3, 4].map(i => `
                    <rect x="${100 + i * 150}" y="${40 + i * 30}" 
                          width="120" height="${160 - i * 30}" 
                          class="skeleton-bar" rx="4"
                          style="animation-delay: ${i * 0.1}s"/>
                `).join('')}
                
                <!-- Date labels skeleton -->
                ${[0, 1, 2, 3, 4].map(i => `
                    <rect x="${40 + i * 175}" y="240" width="40" height="10" 
                          class="skeleton-loading" rx="2"/>
                `).join('')}
            </g>
        `;
        
        chartContent.innerHTML = html;
    },
    
    // Add touch support
    addTouchSupport: function() {
        const chartContainer = this.container.querySelector('.chart-container');
        let touchTimeout;
        
        // Touch start - show tooltip after hold
        chartContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            
            touchTimeout = setTimeout(() => {
                // Simulate mouse event for tooltip
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                chartContainer.dispatchEvent(mouseEvent);
            }, 500); // 500ms hold for tooltip
        });
        
        // Touch end - hide tooltip
        chartContainer.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            this.hideTooltipWithDelay();
        });
        
        // Touch move - clear timeout
        chartContainer.addEventListener('touchmove', () => {
            clearTimeout(touchTimeout);
        });
    },
    
    // Topic Customization Methods
    loadSelectedTopics: function() {
        const saved = localStorage.getItem('narrativePulse.selectedTopics');
        if (saved) {
            try {
                const savedTopics = JSON.parse(saved);
                // Validate saved topics exist in available topics
                this.selectedTopics = savedTopics.filter(topic => 
                    this.availableTopics.includes(topic)
                );
                // Ensure we have at least one topic
                if (this.selectedTopics.length === 0) {
                    this.selectedTopics = [...this.availableTopics];
                }
            } catch (e) {
                console.error('Error loading saved topics:', e);
            }
        }
    },
    
    saveSelectedTopics: function() {
        localStorage.setItem('narrativePulse.selectedTopics', JSON.stringify(this.selectedTopics));
    },
    
    openCustomizationPanel: function() {
        // Populate panel with topics
        this.renderTopicList();
        
        // Show panel and backdrop
        this.backdrop.style.display = 'block';
        setTimeout(() => {
            this.backdrop.classList.add('active');
            this.panel.setAttribute('data-state', 'open');
        }, 10);
        
        // Reset changes flag
        this.hasChanges = false;
        this.updateApplyButton();
    },
    
    closeCustomizationPanel: function() {
        this.backdrop.classList.remove('active');
        this.panel.setAttribute('data-state', 'closed');
        setTimeout(() => {
            this.backdrop.style.display = 'none';
        }, 300);
    },
    
    renderTopicList: function() {
        const topicList = document.querySelector('#topicList');
        topicList.innerHTML = '';
        
        // Store the initial selected topics for comparison
        this.tempSelectedTopics = [...this.selectedTopics];
        
        // Topic stats for the demo
        const topicStats = {
            'AI Agents': { momentum: '+85%', mentions: 147 },
            'AI Infrastructure': { momentum: '+92%', mentions: 156 },
            'Capital Efficiency': { momentum: '+17%', mentions: 89 },
            'DePIN': { momentum: '+190%', mentions: 201 },
            'Crypto/Web3': { momentum: '+45%', mentions: 78 },
            'B2B SaaS': { momentum: '+3%', mentions: 43 },
            'Developer Tools': { momentum: '+47%', mentions: 94 },
            'Vertical SaaS': { momentum: '+65%', mentions: 112 }
        };
        
        this.availableTopics.forEach(topic => {
            const stats = topicStats[topic];
            const isSelected = this.tempSelectedTopics.includes(topic);
            const isDisabled = !isSelected && this.tempSelectedTopics.length >= this.maxTopics;
            
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item' + 
                (isSelected ? ' selected' : '') + 
                (isDisabled ? ' disabled' : '');
            topicItem.dataset.topic = topic;
            
            topicItem.innerHTML = `
                <div class="topic-checkbox">
                    <svg viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2"/>
                    </svg>
                </div>
                <div class="topic-info">
                    <div class="topic-name">${topic}</div>
                    <div class="topic-stats">
                        <span class="topic-momentum">${stats.momentum} this week</span>
                        <span> • ${stats.mentions} mentions</span>
                    </div>
                </div>
            `;
            
            if (!isDisabled) {
                topicItem.addEventListener('click', () => this.toggleTopic(topic));
            }
            
            topicList.appendChild(topicItem);
        });
        
        this.updateSelectionCount();
    },
    
    toggleTopic: function(topic) {
        const index = this.tempSelectedTopics.indexOf(topic);
        
        if (index > -1) {
            // Deselect - ensure at least one remains
            if (this.tempSelectedTopics.length > 1) {
                this.tempSelectedTopics.splice(index, 1);
            }
        } else {
            // Select - ensure max not exceeded
            if (this.tempSelectedTopics.length < this.maxTopics) {
                this.tempSelectedTopics.push(topic);
            }
        }
        
        // Check if there are changes from the original selection
        this.hasChanges = JSON.stringify(this.tempSelectedTopics.sort()) !== JSON.stringify(this.selectedTopics.sort());
        
        // Update UI without losing state
        this.updateTopicUI();
        this.updateSelectionCount();
        this.updateApplyButton();
    },
    
    updateTopicUI: function() {
        const topicItems = document.querySelectorAll('.topic-item');
        topicItems.forEach(item => {
            const topic = item.dataset.topic;
            const isSelected = this.tempSelectedTopics.includes(topic);
            const isDisabled = !isSelected && this.tempSelectedTopics.length >= this.maxTopics;
            
            item.classList.toggle('selected', isSelected);
            item.classList.toggle('disabled', isDisabled);
            
            // Remove old event listener and add new one
            const newItem = item.cloneNode(true);
            if (!isDisabled) {
                newItem.addEventListener('click', () => this.toggleTopic(topic));
            }
            item.parentNode.replaceChild(newItem, item);
        });
    },
    
    updateSelectionCount: function() {
        const selected = document.querySelectorAll('.topic-item.selected').length;
        const counter = document.querySelector('#selectionCount');
        counter.textContent = `${selected} of ${this.maxTopics} topics selected`;
    },
    
    updateApplyButton: function() {
        const applyBtn = document.querySelector('#applyTopicsBtn');
        applyBtn.disabled = !this.hasChanges;
    },
    
    applyTopicSelection: function() {
        // Update selected topics with the temporary selection
        this.selectedTopics = [...this.tempSelectedTopics];
        this.saveSelectedTopics();
        
        // Update chart
        this.updateChartWithNewTopics();
        
        // Close panel
        this.closeCustomizationPanel();
        
        // Show toast notification
        this.showToast('Topics updated');
    },
    
    updateChartWithNewTopics: function() {
        // Clean up existing event handlers before recreating views
        this.cleanupViewEventHandlers();
        
        // Update the legend
        this.updateLegend();
        
        // Recreate the current view with new topics
        const viewText = this.container.querySelector('#viewText').textContent;
        if (viewText === 'Momentum') {
            this.createMomentumView();
        } else if (viewText === 'Volume') {
            this.createVolumeView();
        } else {
            this.createConsensusView();
        }
    },
    
    // Clean up view-specific event handlers
    cleanupViewEventHandlers: function() {
        // Remove all event listeners for the current view
        if (this.currentView) {
            this.removeViewListeners(this.currentView);
        }
        
        // Cancel any pending animation frames
        if (this.mouseMoveFrame) {
            cancelAnimationFrame(this.mouseMoveFrame);
            this.mouseMoveFrame = null;
        }
        
        // Clear any hide tooltip timers
        if (this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
            this.hideTooltipTimer = null;
        }
        
        // Reset view-specific state
        this.currentHoveredDate = null;
        this.activeFilter = null;
        
        // Reset tooltip completely
        this.resetTooltip();
        
        // Clear chart content
        const chartContent = this.container?.querySelector('#chartContent');
        if (chartContent) {
            chartContent.innerHTML = '';
        }
    },
    
    updateLegend: function() {
        const legend = this.container.querySelector('.pulse-legend');
        const currentData = this.getCurrentData();
        
        // Get colors and momentum from current data
        const topicColors = {};
        const topicMomentum = {};
        
        Object.keys(currentData.topics).forEach(topic => {
            const topicData = currentData.topics[topic];
            topicColors[topic] = topicData.color;
            topicMomentum[topic] = topicData.displayMomentum;
        });
        
        legend.innerHTML = '';
        this.selectedTopics.forEach(topic => {
            const color = topicColors[topic] || '#6b7280';
            const momentum = topicMomentum[topic] || '+0%';
            
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <span class="legend-dot" style="background: ${color};"></span>
                <span class="legend-label">${topic}</span>
                <span class="legend-value" style="color: ${color};">${momentum}</span>
            `;
            legend.appendChild(item);
        });
    },
    
    showToast: function(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--sage);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },
    
    // Extend getTopicColor to include new topics
    getTopicColor: function(topic) {
        const colors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d',
            'Developer Tools': '#8a68a8',
            'Vertical SaaS': '#7d9c8d',
            'AI Infrastructure': '#a87c68'
        };
        return colors[topic] || '#6b7280';
    }
};

// Export for use
window.NarrativePulse = NarrativePulse;