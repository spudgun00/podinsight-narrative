// Comprehensive data for Narrative Pulse charts
// Generated from docs/new_comprehensive_data_charts_RAW.md

window.narrativePulseData = {
    sevenDayData: {
        timeRange: {
            start: 'Aug 22, 2025',
            end: 'Aug 28, 2025',
            dataPoints: 7,
            interval: 'daily',
            labels: ['Thu 22', 'Fri 23', 'Sat 24', 'Sun 25', 'Mon 26', 'Tue 27', 'Wed 28']
        },
        topics: {
            'AI Agents': {
                color: '#4a7c59',
                displayMomentum: '+59%',
                actualMomentum: '+59.1%',
                dataPoints: [3, 1, 2, 6, 8, 9, 6],
                startValue: 22,
                endValue: 35,
                weekTotal: 35,
                dailyAverage: 5.0,
                peakDay: 'Wed 28',
                consensusLevel: 'Strong',
                yPositions: {start: 180, end: 40},
                quotes: {
                    'Thu 22': 'Early week momentum building',
                    'Fri 23': 'Gerstner mentions agent infrastructure on All-In',
                    'Sat 24': 'Weekend lull, only crypto podcasts active',
                    'Sun 25': 'Pomp discusses AI agents briefly',
                    'Mon 26': 'Monday surge: 3 shows cover agent strategies',
                    'Tue 27': '20VC deep dive with Anthropic drives discussion',
                    'Wed 28': 'Peak day: Multiple tier-1 shows align on thesis'
                }
            },
            'AI Infrastructure': {
                color: '#a87c68',
                displayMomentum: '+37%',
                actualMomentum: '+36.8%',
                dataPoints: [5, 2, 3, 8, 10, 12, 12],
                startValue: 38,
                endValue: 52,
                weekTotal: 52,
                dailyAverage: 7.4,
                peakDay: 'Wed 28 & Thu 29',
                consensusLevel: 'Peak',
                yPositions: {start: 200, end: 20},
                quotes: {
                    'Thu 22': 'Infrastructure thesis gains traction',
                    'Fri 23': 'Databricks valuation sparks infrastructure debates',
                    'Sat 24': 'Technical podcasts discuss GPU economics',
                    'Sun 25': 'Light coverage, focus on compute costs',
                    'Mon 26': 'Multiple shows: "picks and shovels" thesis',
                    'Tue 27': 'All-In dedicates segment to AI infrastructure',
                    'Wed 28': 'Peak coverage: everyone wants foundation layer'
                }
            },
            'Capital Efficiency': {
                color: '#f4a261',
                displayMomentum: '+15%',
                actualMomentum: '+15.4%',
                dataPoints: [2, 0, 1, 3, 4, 3, 2],
                startValue: 13,
                endValue: 15,
                weekTotal: 15,
                dailyAverage: 2.1,
                peakDay: 'Tue 27',
                consensusLevel: 'Strong',
                yPositions: {start: 195, end: 145},
                quotes: {
                    'Thu 22': 'Efficiency narrative continues from previous week',
                    'Fri 23': 'End of week: LP meetings set efficiency tone',
                    'Sat 24': 'No coverage on weekend shows',
                    'Sun 25': 'Single mention on Acquired',
                    'Mon 26': 'Board meeting prep drives efficiency talk',
                    'Tue 27': 'Peak: multiple shows discuss burn rates',
                    'Wed 28': 'Continued focus on path to profitability'
                }
            },
            'DePIN': {
                color: '#5a6c8c',
                displayMomentum: '+78%',
                actualMomentum: '+77.8%',
                dataPoints: [2, 1, 1, 5, 7, 8, 8],
                startValue: 18,
                endValue: 32,
                weekTotal: 32,
                dailyAverage: 4.6,
                peakDay: 'Wed 28 & Thu 29',
                consensusLevel: 'Building',
                yPositions: {start: 210, end: 65},
                quotes: {
                    'Thu 22': 'DePIN momentum building from prior week',
                    'Fri 23': 'Helium case study surfaces on crypto pod',
                    'Sat 24': 'Minimal weekend coverage',
                    'Sun 25': 'Single mention on Bankless',
                    'Mon 26': 'Monday catalyst: major funding rumor',
                    'Tue 27': 'Multiple shows pick up DePIN narrative',
                    'Wed 28': 'Peak interest: "physical meets digital"'
                }
            },
            'Crypto/Web3': {
                color: '#5c7cfa',
                displayMomentum: '+18%',
                actualMomentum: '+18.2%',
                dataPoints: [3, 2, 2, 4, 5, 5, 5],
                startValue: 22,
                endValue: 26,
                weekTotal: 26,
                dailyAverage: 3.7,
                peakDay: 'Tue-Thu',
                consensusLevel: 'Moderate',
                yPositions: {start: 160, end: 120},
                quotes: {
                    'Thu 22': 'Crypto sentiment stabilizing',
                    'Fri 23': 'Base ecosystem gains discussed',
                    'Sat 24': 'Crypto-native pods maintain coverage',
                    'Sun 25': 'Bankless covers DeFi resurgence',
                    'Mon 26': 'Regulatory clarity boosts sentiment',
                    'Tue 27': 'Multiple shows on Solana momentum',
                    'Wed 28': 'Sustained interest in infrastructure'
                }
            },
            'B2B SaaS': {
                color: '#c77d7d',
                displayMomentum: '-20%',
                actualMomentum: '-20.0%',
                dataPoints: [1, 0, 1, 2, 2, 1, 1],
                startValue: 10,
                endValue: 8,
                weekTotal: 8,
                dailyAverage: 1.1,
                peakDay: 'Mon 26 & Tue 27',
                consensusLevel: 'Weak',
                yPositions: {start: 150, end: 165},
                quotes: {
                    'Thu 22': 'B2B SaaS struggles continue',
                    'Fri 23': 'Single mention of consolidation trends',
                    'Sat 24': 'Zero coverage on weekend',
                    'Sun 25': 'Acquired mentions M&A activity',
                    'Mon 26': 'Brief discussion of mature markets',
                    'Tue 27': 'Focus shifting to AI-native solutions',
                    'Wed 28': 'Legacy SaaS struggles mentioned'
                }
            },
            'Developer Tools': {
                color: '#8a68a8',
                displayMomentum: '+29%',
                actualMomentum: '+28.6%',
                dataPoints: [2, 1, 1, 3, 4, 4, 3],
                startValue: 14,
                endValue: 18,
                weekTotal: 18,
                dailyAverage: 2.6,
                peakDay: 'Tue 27 & Wed 28',
                consensusLevel: 'Strong',
                yPositions: {start: 170, end: 90},
                quotes: {
                    'Thu 22': 'Developer tools gaining momentum',
                    'Fri 23': 'Cursor rumors spark dev tools interest',
                    'Sat 24': 'Light weekend coverage',
                    'Sun 25': 'Single mention on technical podcast',
                    'Mon 26': 'GitHub Copilot adoption stats shared',
                    'Tue 27': 'Multiple shows on AI coding assistants',
                    'Wed 28': 'Peak: "developer productivity renaissance"'
                }
            }
        }
    },

    thirtyDayData: {
        timeRange: {
            start: 'Aug 1, 2025',
            end: 'Aug 28, 2025',
            dataPoints: 4,
            interval: 'weekly',
            labels: ['Aug 1-7', 'Aug 8-14', 'Aug 15-21', 'Aug 22-28']
        },
        topics: {
            'AI Agents': {
                color: '#4a7c59',
                displayMomentum: '+337%',
                actualMomentum: '+337.5%',
                dataPoints: [8, 15, 22, 35],
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
                    'Aug 1-7': 'Early whispers about agent potential',
                    'Aug 8-14': 'Gerstner validates thesis, momentum builds',
                    'Aug 15-21': 'Multiple tier-1 VCs align on opportunity',
                    'Aug 22-28': 'Mainstream adoption narrative emerges'
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
                    'Aug 1-7': 'GPU economics drive initial interest',
                    'Aug 8-14': 'Major funding rounds validate thesis',
                    'Aug 15-21': 'Everyone wants foundation layer exposure',
                    'Aug 22-28': 'Peak interest: "picks and shovels" wins'
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
                    'Aug 1-7': 'LP pressure begins to mount',
                    'Aug 8-14': 'Board meetings reinforce discipline',
                    'Aug 15-21': 'Slight dip as other topics dominate',
                    'Aug 22-28': 'Rebounds as fundamentals matter again'
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
                    'Aug 1-7': 'Barely on the radar',
                    'Aug 8-14': 'Helium success story gains traction',
                    'Aug 15-21': 'Major funds announce DePIN strategies',
                    'Aug 22-28': 'Full narrative emergence: "DePIN summer"'
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
                    'Aug 1-7': 'Steady coverage from crypto-native shows',
                    'Aug 8-14': 'Slight decline as AI dominates',
                    'Aug 15-21': 'Bottom reached, sentiment stabilizing',
                    'Aug 22-28': 'Modest recovery on regulatory clarity'
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
                    'Aug 1-7': 'Consolidation themes dominate',
                    'Aug 8-14': 'M&A activity but little excitement',
                    'Aug 15-21': 'AI-native stealing all attention',
                    'Aug 22-28': 'Legacy SaaS = yesterday\'s news'
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
                    'Aug 1-7': 'AI coding assistants emerge',
                    'Aug 8-14': 'Cursor and similar tools gain traction',
                    'Aug 15-21': 'Developer productivity metrics impress',
                    'Aug 22-28': 'Full renaissance narrative established'
                }
            }
        }
    },

    ninetyDayData: {
        timeRange: {
            start: 'Jun 5, 2025',
            end: 'Aug 28, 2025',
            dataPoints: 13,
            interval: 'weekly',
            labels: ['Jun 5', 'Jun 12', 'Jun 19', 'Jun 26', 'Jul 3', 'Jul 10', 'Jul 17', 'Jul 24', 'Jul 31', 'Aug 7', 'Aug 14', 'Aug 21', 'Aug 28']
        },
        topics: {
            'AI Agents': {
                color: '#4a7c59',
                displayMomentum: '+133%',
                actualMomentum: '+133.3%',
                dataPoints: [15, 16, 17, 18, 19, 20, 22, 24, 26, 24, 27, 30, 35],
                startValue: 15,
                endValue: 35,
                totalGrowth: 133.3,
                totalMentions: 283,
                consensusProgression: ['Weak', 'Weak', 'Building', 'Building', 'Building', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
                narrative: 'From 15 mentions in early June to 35 by late August - strong emerging trend',
                keyInflectionPoint: 'Week 11 (Aug 14): Crossed 15 mentions, tier-1 VCs aligned',
                quotes: {
                    'Jun 5': 'AI agents gaining early traction',
                    'Jun 12': 'Technical challenges discussed',
                    'Jun 19': 'Early frameworks emerge',
                    'Jun 26': 'Use cases start crystallizing',
                    'Jul 3': 'Summer lull but steady interest',
                    'Jul 10': 'Infrastructure questions raised',
                    'Jul 17': 'Breakthrough capabilities shown',
                    'Jul 24': 'Market education accelerates',
                    'Jul 31': 'Approaching critical mass',
                    'Aug 7': 'August surge begins',
                    'Aug 14': 'Gerstner validates thesis publicly',
                    'Aug 21': 'Multiple funds announce strategies',
                    'Aug 28': 'Mainstream narrative forms'
                }
            },
            'AI Infrastructure': {
                color: '#a87c68',
                displayMomentum: '+160%',
                actualMomentum: '+160.0%',
                dataPoints: [20, 22, 24, 26, 28, 30, 33, 36, 40, 35, 40, 46, 52],
                startValue: 20,
                endValue: 52,
                totalGrowth: 160.0,
                totalMentions: 420,
                consensusProgression: ['Building', 'Building', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Peak', 'Peak', 'Peak'],
                narrative: 'Consistent growth throughout summer, accelerating in August as "picks and shovels" thesis dominates',
                keyInflectionPoint: 'Week 7 (Jul 17): Major funding rounds validate infrastructure plays',
                quotes: {
                    'Jun 5': 'Infrastructure discussions intensify',
                    'Jun 12': 'Compute economics debate begins',
                    'Jun 19': 'Infrastructure bottlenecks identified',
                    'Jun 26': 'Foundation layer thesis emerges',
                    'Jul 3': 'Databricks rumored valuation',
                    'Jul 10': 'Major infrastructure rounds close',
                    'Jul 17': 'Everyone wants exposure',
                    'Jul 24': 'Full stack platforms emerge',
                    'Jul 31': 'Infrastructure = moats',
                    'Aug 7': 'August momentum begins',
                    'Aug 14': 'Massive interest surge',
                    'Aug 21': 'Peak momentum building',
                    'Aug 28': 'Universal consensus reached'
                }
            },
            'Capital Efficiency': {
                color: '#f4a261',
                displayMomentum: '+36%',
                actualMomentum: '+36.4%',
                dataPoints: [11, 10, 9, 8, 8, 9, 10, 11, 12, 12, 14, 13, 15],
                startValue: 11,
                endValue: 15,
                totalGrowth: 36.4,
                totalMentions: 142,
                consensusProgression: ['Strong', 'Strong', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong'],
                narrative: 'U-shaped recovery: dipped during July uncertainty, recovered as markets stabilized',
                keyInflectionPoint: 'Week 8 (Jul 24): LPs reassert discipline requirements',
                quotes: {
                    'Jun 5': 'Early efficiency push from LPs',
                    'Jun 12': 'Burn rate scrutiny increases',
                    'Jun 19': 'Some pushback on constraints',
                    'Jun 26': 'Market uncertainty impacts focus',
                    'Jul 3': 'Efficiency takes backseat briefly',
                    'Jul 10': 'Bottom of the U-curve',
                    'Jul 17': 'Discipline returns to conversation',
                    'Jul 24': 'LPs win the narrative battle',
                    'Jul 31': 'New normal established',
                    'Aug 7': 'Consistent drumbeat begins',
                    'Aug 14': 'Every board meeting topic',
                    'Aug 21': 'Slight dip as AI dominates',
                    'Aug 28': 'Fundamental requirement clear'
                }
            },
            'DePIN': {
                color: '#5a6c8c',
                displayMomentum: '+220%',
                actualMomentum: '+220.0%',
                dataPoints: [10, 10, 11, 12, 13, 14, 15, 17, 19, 18, 22, 27, 32],
                startValue: 10,
                endValue: 32,
                totalGrowth: 220.0,
                totalMentions: 217,
                consensusProgression: ['None', 'None', 'None', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Building', 'Weak', 'Building', 'Strong', 'Peak'],
                narrative: 'Steady emergence from niche to mainstream topic over the quarter',
                keyInflectionPoint: 'Week 11 (Aug 14): Major success stories drive acceleration',
                quotes: {
                    'Jun 5': 'DePIN concept gaining awareness',
                    'Jun 12': 'Early adopters exploring use cases',
                    'Jun 19': 'Technical infrastructure focus',
                    'Jun 26': 'Helium case study surfaces',
                    'Jul 3': 'Slow community building',
                    'Jul 10': 'First tier-2 VC interest',
                    'Jul 17': 'Use cases multiply',
                    'Jul 24': 'Thesis starts forming',
                    'Jul 31': 'Pre-explosion buildup',
                    'Aug 7': 'Continued growth trajectory',
                    'Aug 14': '4x growth week-over-week',
                    'Aug 21': 'DePIN summer declared',
                    'Aug 28': 'Everyone wants exposure'
                }
            },
            'Crypto/Web3': {
                color: '#5c7cfa',
                displayMomentum: '-28%',
                actualMomentum: '-27.8%',
                dataPoints: [36, 34, 32, 30, 28, 26, 24, 23, 22, 28, 25, 22, 26],
                startValue: 36,
                endValue: 26,
                totalGrowth: -27.8,
                totalMentions: 356,
                consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Building', 'Building', 'Weak', 'Building'],
                narrative: 'Gradual decline through summer, signs of stabilization in August',
                keyInflectionPoint: 'Week 10 (Aug 7): Regulatory clarity sparks modest recovery',
                quotes: {
                    'Jun 5': 'Strong coverage from crypto pods',
                    'Jun 12': 'AI begins stealing attention',
                    'Jun 19': 'Sentiment cooling continues',
                    'Jun 26': 'Bear market narrative persists',
                    'Jul 3': 'Summer doldrums hit',
                    'Jul 10': 'Lowest point of coverage',
                    'Jul 17': 'Sustained low interest',
                    'Jul 24': 'Bottom forming',
                    'Jul 31': 'Slight uptick begins',
                    'Aug 7': 'Recovery to 28 mentions',
                    'Aug 14': 'Base ecosystem excitement',
                    'Aug 21': 'Dip on AI dominance',
                    'Aug 28': 'Stabilizing with clear use cases'
                }
            },
            'B2B SaaS': {
                color: '#c77d7d',
                displayMomentum: '-60%',
                actualMomentum: '-60.0%',
                dataPoints: [20, 19, 18, 17, 16, 15, 14, 13, 12, 15, 12, 10, 8],
                startValue: 20,
                endValue: 8,
                totalGrowth: -60.0,
                totalMentions: 189,
                consensusProgression: ['Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak', 'Weak'],
                narrative: 'Steady decline as AI-native approaches dominate all conversations',
                keyInflectionPoint: 'Never recovered - continuous decline throughout quarter',
                quotes: {
                    'Jun 5': 'Consolidation wave discussed',
                    'Jun 12': 'Growth challenges mounting',
                    'Jun 19': 'M&A only bright spot',
                    'Jun 26': 'Innovation concerns raised',
                    'Jul 3': 'Focus shifts to profitability',
                    'Jul 10': 'Market maturity accepted',
                    'Jul 17': 'Legacy playbook questioned',
                    'Jul 24': 'AI-native competition clear',
                    'Jul 31': 'Existential questions raised',
                    'Aug 7': 'Brief uptick to 15',
                    'Aug 14': 'Reality sets in again',
                    'Aug 21': 'Yesterday\'s opportunity',
                    'Aug 28': 'Minimal coverage continues'
                }
            },
            'Developer Tools': {
                color: '#8a68a8',
                displayMomentum: '+125%',
                actualMomentum: '+125.0%',
                dataPoints: [8, 8, 9, 9, 10, 11, 12, 13, 14, 12, 14, 16, 18],
                startValue: 8,
                endValue: 18,
                totalGrowth: 125.0,
                totalMentions: 155,
                consensusProgression: ['Moderate', 'Moderate', 'Moderate', 'Moderate', 'Strong', 'Strong', 'Strong', 'Strong', 'Strong', 'Moderate', 'Strong', 'Strong', 'Strong'],
                narrative: 'Consistent growth throughout quarter as AI transforms developer productivity',
                keyInflectionPoint: 'Week 12 (Aug 21): AI coding assistants hit mainstream awareness',
                quotes: {
                    'Jun 5': 'Developer tools momentum building',
                    'Jun 12': 'Early AI experiments',
                    'Jun 19': 'Productivity metrics shared',
                    'Jun 26': 'Tool consolidation discussed',
                    'Jul 3': 'Next-gen tools emerge',
                    'Jul 10': 'Adoption accelerating',
                    'Jul 17': 'Enterprise interest grows',
                    'Jul 24': 'ROI becomes clear',
                    'Jul 31': 'Developer-first narrative',
                    'Aug 7': 'Sustained developer interest',
                    'Aug 14': 'Cursor raises huge round',
                    'Aug 21': 'Multiple success stories',
                    'Aug 28': 'Renaissance narrative peaks'
                }
            }
        }
    }
};