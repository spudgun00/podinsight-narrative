// Narrative Pulse Component
// Modular implementation of the Narrative Pulse feature

const NarrativePulse = {
    // Component state
    activeFilter: null,
    container: null,
    
    // Chart configuration
    chartWidth: 800,
    chartHeight: 300,
    padding: 50,
    dateLabels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29'],
    xPositions: [], // Will be calculated in init
    hideTooltipTimer: null,
    mouseMoveFrame: null, // For requestAnimationFrame debouncing
    
    // Event listener management
    eventListeners: {
        momentum: [],
        volume: [],
        consensus: [],
        global: []
    },
    currentView: 'momentum',
    
    // Topic customization state
    availableTopics: ['AI Agents', 'Capital Efficiency', 'DePIN', 'B2B SaaS', 'Developer Tools', 'Vertical SaaS', 'AI Infrastructure'],
    selectedTopics: ['AI Agents', 'Capital Efficiency', 'DePIN', 'B2B SaaS'],
    tempSelectedTopics: [],
    maxTopics: 4,
    panel: null,
    backdrop: null,
    hasChanges: false,
    
    // Consensus sentiment data
    consensusData: {
        'AI Agents': {
            'Aug 1': { positive: 70, neutral: 7, negative: 2, total: 79, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Aug 8': { positive: 93, neutral: 10, negative: 2, total: 105, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Vinod Khosla', firm: 'Khosla Ventures' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 115, neutral: 11, negative: 2, total: 128, percent: 89.8, level: 'Strong',
                advocates: [
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 127, neutral: 13, negative: 2, total: 142, percent: 89.4, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 132, neutral: 12, negative: 3, total: 147, percent: 89.8, level: 'Strong',
                advocates: [
                    { name: 'Marc Andreessen', firm: 'a16z' },
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Reid Hoffman', firm: 'Greylock' }
                ],
                dissent: { quote: 'Overhyped in near term', author: 'Peter Thiel' }
            }
        },
        'Capital Efficiency': {
            'Aug 1': { positive: 38, neutral: 30, negative: 8, total: 76, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 8': { positive: 49, neutral: 28, negative: 5, total: 82, percent: 59.8, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 61, neutral: 22, negative: 4, total: 87, percent: 70.1, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 71, neutral: 14, negative: 3, total: 88, percent: 80.7, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 76, neutral: 11, negative: 2, total: 89, percent: 85.4, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: null
            }
        },
        'DePIN': {
            'Aug 1': { positive: 3, neutral: 5, negative: 3, total: 11, percent: 27.3, level: 'Weak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' }
                ],
                dissent: { quote: 'Still too early for institutional', author: 'Bill Gurley' }
            },
            'Aug 8': { positive: 17, neutral: 12, negative: 5, total: 34, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 62, neutral: 22, negative: 5, total: 89, percent: 69.7, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Ali Yahya', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 117, neutral: 35, negative: 4, total: 156, percent: 75.0, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Arianna Simpson', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 181, neutral: 18, negative: 2, total: 201, percent: 90.0, level: 'Peak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Marc Andreessen', firm: 'a16z' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            }
        },
        'B2B SaaS': {
            'Aug 1': { positive: 16, neutral: 20, negative: 4, total: 40, percent: 40.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Growth multiples unsustainable', author: 'Bill Gurley' }
            },
            'Aug 8': { positive: 16, neutral: 21, negative: 4, total: 41, percent: 39.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Consolidation inevitable', author: 'David Sacks' }
            },
            'Aug 15': { positive: 13, neutral: 25, negative: 4, total: 42, percent: 31.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'AI will eat most SaaS', author: 'Marc Andreessen' }
            },
            'Aug 22': { positive: 13, neutral: 26, negative: 4, total: 43, percent: 30.2, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'Vertical AI replacing horizontal SaaS', author: 'Sarah Guo' }
            },
            'Aug 29': { positive: 13, neutral: 26, negative: 4, total: 43, percent: 30.2, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'SaaS winter is here', author: 'Bill Gurley' }
            }
        },
        'Developer Tools': {
            'Aug 1': { positive: 28, neutral: 12, negative: 2, total: 42, percent: 66.7, level: 'Moderate',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' }
                ],
                dissent: null
            },
            'Aug 8': { positive: 32, neutral: 10, negative: 2, total: 44, percent: 72.7, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 38, neutral: 8, negative: 2, total: 48, percent: 79.2, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Nat Friedman', firm: 'Former GitHub' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 52, neutral: 10, negative: 2, total: 64, percent: 81.3, level: 'Strong',
                advocates: [
                    { name: 'Nat Friedman', firm: 'Former GitHub' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Peter Levine', firm: 'a16z' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 82, neutral: 10, negative: 2, total: 94, percent: 87.2, level: 'Strong',
                advocates: [
                    { name: 'Peter Levine', firm: 'a16z' },
                    { name: 'Nat Friedman', firm: 'Former GitHub' },
                    { name: 'Guillermo Rauch', firm: 'Vercel' }
                ],
                dissent: null
            }
        },
        'Vertical SaaS': {
            'Aug 1': { positive: 22, neutral: 14, negative: 4, total: 40, percent: 55.0, level: 'Moderate',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: null
            },
            'Aug 8': { positive: 28, neutral: 12, negative: 4, total: 44, percent: 63.6, level: 'Moderate',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' },
                    { name: 'David Ulevitch', firm: 'a16z' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 40, neutral: 10, negative: 2, total: 52, percent: 76.9, level: 'Strong',
                advocates: [
                    { name: 'Byron Deeter', firm: 'Bessemer' },
                    { name: 'David Ulevitch', firm: 'a16z' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 60, neutral: 10, negative: 2, total: 72, percent: 83.3, level: 'Strong',
                advocates: [
                    { name: 'David Ulevitch', firm: 'a16z' },
                    { name: 'Byron Deeter', firm: 'Bessemer' },
                    { name: 'Sarah Guo', firm: 'Conviction' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 98, neutral: 12, negative: 2, total: 112, percent: 87.5, level: 'Strong',
                advocates: [
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Byron Deeter', firm: 'Bessemer' },
                    { name: 'David Ulevitch', firm: 'a16z' }
                ],
                dissent: null
            }
        },
        'AI Infrastructure': {
            'Aug 1': { positive: 38, neutral: 16, negative: 4, total: 58, percent: 65.5, level: 'Moderate',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Aug 8': { positive: 56, neutral: 16, negative: 4, total: 76, percent: 73.7, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' },
                    { name: 'Soumith Chintala', firm: 'Meta' }
                ],
                dissent: null
            },
            'Aug 15': { positive: 82, neutral: 14, negative: 4, total: 100, percent: 82.0, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Soumith Chintala', firm: 'Meta' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Aug 22': { positive: 114, neutral: 20, negative: 4, total: 138, percent: 82.6, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' },
                    { name: 'Jensen Huang', firm: 'NVIDIA' }
                ],
                dissent: null
            },
            'Aug 29': { positive: 142, neutral: 12, negative: 2, total: 156, percent: 91.0, level: 'Peak',
                advocates: [
                    { name: 'Jensen Huang', firm: 'NVIDIA' },
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            }
        }
    },
    
    // Rich data for tooltips
    topicDataByDate: {
        'Aug 1': {
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
        'Aug 8': {
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
        'Aug 15': {
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
        'Aug 22': {
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
        },
        'Aug 29': {
            'AI Agents': { mentions: 147, weekOverWeek: 4, change: 5, podcasts: ['20VC', 'All-In', 'Invest Like Best'], quote: 'Agents everywhere' },
            'Capital Efficiency': { mentions: 89, weekOverWeek: 1, change: 1, podcasts: ['Acquired', 'Bankless', 'a16z Podcast'], quote: 'Sustainable growth matters' },
            'DePIN': { mentions: 201, weekOverWeek: 29, change: 45, podcasts: ['Bankless', 'Unchained'], quote: 'DePIN eating the world' },
            'B2B SaaS': { mentions: 43, weekOverWeek: 0, change: 0, podcasts: ['SaaStr', 'Invest Like Best'], quote: 'Consolidation phase' },
            'Developer Tools': { mentions: 94, weekOverWeek: 47, change: 47, podcasts: ['20VC', 'a16z Podcast'], quote: 'DevEx renaissance' },
            'Vertical SaaS': { mentions: 112, weekOverWeek: 65, change: 65, podcasts: ['SaaStr', 'Acquired'], quote: 'Niche domination' },
            'AI Infrastructure': { mentions: 156, weekOverWeek: 92, change: 92, podcasts: ['All-In', 'a16z Podcast'], quote: 'Picks and shovels' },
            'topEpisodes': [
                { title: 'Agent-First Companies', podcast: '20VC' },
                { title: 'DePIN Domination', podcast: 'Bankless' },
                { title: 'SaaS Consolidation Wave', podcast: 'SaaStr' }
            ]
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
        const drawableWidth = this.chartWidth - (2 * this.padding);
        const sectionWidth = drawableWidth / 4; // 4 sections between 5 points
        this.xPositions = this.dateLabels.map((_, i) => {
            return this.padding + (sectionWidth * i);
        });
        
        // Get panel elements (now at document level for proper viewport positioning)
        this.panel = document.querySelector('.topic-customization-panel');
        this.backdrop = document.querySelector('.topic-customization-backdrop');
        
        // Load saved topics from localStorage
        this.loadSelectedTopics();
        
        this.bindEvents();
        this.currentView = 'momentum'; // Set initial view
        this.createMomentumView(); // Create the momentum view with all elements
        
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
    
    // Create grid lines for charts
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
        if (current === '7 days') {
            timeText.textContent = '30 days';
        } else if (current === '30 days') {
            timeText.textContent = '90 days';
        } else {
            timeText.textContent = '7 days';
        }
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
    },
    
    // Create Volume View
    createVolumeView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        
        // Calculate max total mentions for scaling
        let maxTotal = 0;
        this.dateLabels.forEach(date => {
            const dateData = this.topicDataByDate[date];
            const total = Object.keys(dateData)
                .filter(key => key !== 'topEpisodes')
                .reduce((sum, topic) => sum + dateData[topic].mentions, 0);
            maxTotal = Math.max(maxTotal, total);
        });
        
        const barWidth = 60;
        const chartPaddingLeft = 20; // Add padding to prevent first bar from overlapping Y-axis
        const maxHeight = 160;
        const baseY = 220;
        const yAxisX = 35;
        
        // Topic colors - use the same colors as in getTopicColor
        const topicColors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d',
            'Developer Tools': '#8a68a8',
            'Vertical SaaS': '#7d9c8d',
            'AI Infrastructure': '#a87c68'
        };
        
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
            <text x="15" y="140" fill="#6b7280" font-size="10" text-anchor="middle" transform="rotate(-90 15 140)">Mentions</text>
        `;
        
        // Create stacked bars for each date
        this.dateLabels.forEach((date, dateIndex) => {
            const dateData = this.topicDataByDate[date];
            const x = this.xPositions[dateIndex] - barWidth / 2 + chartPaddingLeft;
            let currentY = baseY;
            
            // Create bars for each selected topic (reverse order for stacking)
            [...this.selectedTopics].reverse().forEach(topic => {
                if (dateData[topic]) {
                    const mentions = dateData[topic].mentions;
                    const barHeight = (mentions / yScale) * maxHeight;
                    currentY -= barHeight;
                    
                    html += `
                        <g class="volume-bar-segment" data-date="${date}" data-topic="${topic}">
                            <rect x="${x}" y="${currentY}" width="${barWidth}" height="${barHeight}"
                                  fill="${topicColors[topic]}" opacity="0.8" rx="2"
                                  class="volume-bar-rect"/>
                            <!-- Hover dot (initially hidden) - positioned at top of this segment -->
                            <circle cx="${x + barWidth/2}" cy="${currentY - 5}" r="4" 
                                    fill="${topicColors[topic]}" opacity="0" 
                                    class="volume-hover-dot"/>
                        </g>
                    `;
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
                const dateData = this.topicDataByDate[date];
                
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
                
                // Calculate total mentions and percentages
                const total = Object.keys(dateData)
                    .filter(key => key !== 'topEpisodes')
                    .reduce((sum, topic) => sum + dateData[topic].mentions, 0);
                
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
                
                // Add topic breakdown for selected topics
                this.selectedTopics.forEach(topic => {
                    if (dateData[topic]) {
                        const mentions = dateData[topic].mentions;
                        const percentage = ((mentions / total) * 100).toFixed(1);
                        const color = this.getTopicColor(topic);
                        
                        html += `
                            <div class="topic-row">
                                <span class="topic-dot" style="background-color: ${color}"></span>
                                <span class="topic-name">${topic}:</span>
                                <span class="topic-stats">${mentions} (${percentage}%)</span>
                            </div>
                        `;
                    }
                });
                
                // Add top episodes
                if (dateData.topEpisodes && dateData.topEpisodes.length > 0) {
                    html += `
                        </div>
                        <div class="tooltip-divider"></div>
                        <div class="tooltip-episodes">
                            <div class="episodes-label">Top episodes this day:</div>
                    `;
                    
                    dateData.topEpisodes.forEach((episode, index) => {
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
        const topicColors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d',
            'Developer Tools': '#8a68a8',
            'Vertical SaaS': '#7d9c8d',
            'AI Infrastructure': '#a87c68'
        };
        
        // Grid layout configuration - align with chart axes
        const gridStartX = this.padding; // Start at y-axis (50px)
        const gridStartY = 50;  // Moved up another 10px (was 60)
        const availableWidth = this.chartWidth - (2 * this.padding); // 700px
        const cellWidth = (availableWidth - (4 * 1)) / 5; // ~139px per cell
        const cellHeight = (220 - gridStartY) / 4 - 1; // Maximum vertical space
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
                return this.dateLabels.map((date, colIndex) => {
                    const consensusData = this.consensusData[topic][date];
                    const percent = consensusData.percent;
                    const x = gridStartX + colIndex * (cellWidth + cellGap);
                    const y = gridStartY + rowIndex * (cellHeight + cellGap);
                    const fillColor = getConsensusColor(percent);
                    const textColor = percent >= 60 ? 'white' : '#374151';
                    
                    return `
                        <g class="consensus-cell-group" data-topic="${topic}" data-date="${date}" data-percent="${percent}">
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
                const color = topicColors[topic];
                
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
                const percent = cellGroup.dataset.percent;
                const consensusData = this.consensusData[topic][date];
                
                // Format date nicely
                const [month, day] = date.split(' ');
                const formattedDate = `${month} ${day}`;
                
                // Build simplified tooltip
                let html = `
                    <div class="consensus-heatmap-tooltip">
                        <div class="tooltip-title">${topic} - ${formattedDate}</div>
                        <div class="tooltip-consensus">Consensus: ${percent}% positive</div>
                        <div class="tooltip-mentions">Based on ${consensusData.total} mentions</div>
                        <div class="tooltip-sources">${consensusData.advocates.length} sources agree</div>
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
        
        // Create paths for selected topics only
        const pathConfigs = {
            'AI Agents': { momentum: "+85%", color: "#4a7c59", yStart: 180, yEnd: 40 },
            'Capital Efficiency': { momentum: "+17%", color: "#f4a261", yStart: 195, yEnd: 145 },
            'DePIN': { momentum: "+190%", color: "#5a6c8c", yStart: 210, yEnd: 65 },
            'B2B SaaS': { momentum: "+3%", color: "#c77d7d", yStart: 150, yEnd: 165 },
            'Developer Tools': { momentum: "+47%", color: "#8a68a8", yStart: 170, yEnd: 90 },
            'Vertical SaaS': { momentum: "+65%", color: "#7d9c8d", yStart: 185, yEnd: 110 },
            'AI Infrastructure': { momentum: "+92%", color: "#a87c68", yStart: 200, yEnd: 70 }
        };
        
        const paths = this.selectedTopics.map(topic => ({
            topic: topic,
            ...pathConfigs[topic]
        }));
        
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
            <text x="35" y="44" fill="#9ca3af" font-size="10" text-anchor="end">80</text>
            <text x="35" y="84" fill="#9ca3af" font-size="10" text-anchor="end">60</text>
            <text x="35" y="124" fill="#9ca3af" font-size="10" text-anchor="end">40</text>
            <text x="35" y="164" fill="#9ca3af" font-size="10" text-anchor="end">20</text>
            <text x="35" y="204" fill="#9ca3af" font-size="10" text-anchor="end">0</text>
            
            <!-- Y-axis label -->
            <text x="15" y="130" fill="#6b7280" font-size="10" text-anchor="middle" transform="rotate(-90 15 130)">Mentions</text>
            
            <!-- Momentum view paths -->
            ${paths.map(p => {
                // Create smooth path using our consistent x-positions
                const pathData = `M ${this.xPositions[0]},${p.yStart} ` +
                    `Q ${this.xPositions[1]},${p.yStart - (p.yStart - p.yEnd) * 0.3} ` +
                    `${this.xPositions[2]},${p.yStart - (p.yStart - p.yEnd) * 0.5} ` +
                    `T ${this.xPositions[3]},${p.yStart - (p.yStart - p.yEnd) * 0.8} ` +
                    `T ${this.xPositions[4]},${p.yEnd}`;
                
                // Calculate Y positions for dots at each data point
                const yPositions = [
                    p.yStart,
                    p.yStart - (p.yStart - p.yEnd) * 0.3,
                    p.yStart - (p.yStart - p.yEnd) * 0.5,
                    p.yStart - (p.yStart - p.yEnd) * 0.8,
                    p.yEnd
                ];
                
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
        const dateData = this.topicDataByDate[date];
        
        if (!dateData) {
            console.error(`No data found for date: ${date}`);
            return;
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
        
        // Get all topics sorted by mentions (excluding metadata)
        const topics = Object.entries(dateData)
            .filter(([key]) => key !== 'topEpisodes' && this.selectedTopics.includes(key))
            .sort((a, b) => b[1].mentions - a[1].mentions);
        
        // Build tooltip HTML
        let html = `
            <div class="rich-tooltip-content">
                <div class="tooltip-date">${formattedDate}</div>
                <div class="tooltip-divider"></div>
        `;
        
        topics.forEach(([topic, data]) => {
            const color = this.getTopicColor(topic);
            const changeText = data.weekOverWeek > 0 ? 
                `+${data.weekOverWeek}% w/w` : '';
            
            // Limit sources to 2
            const sources = data.podcasts ? data.podcasts.slice(0, 2).join(', ') : '';
            
            // Truncate quote to 5 words
            const truncateQuote = (quote) => {
                if (!quote) return '';
                const words = quote.split(' ');
                return words.length > 5 ? 
                    words.slice(0, 5).join(' ') + '...' : 
                    quote;
            };
            
            const isFaded = data.mentions < 10;
            
            html += `
                <div class="topic-section ${isFaded ? 'faded-topic' : ''}">
                    <div class="topic-header">
                        <span class="topic-dot" style="background-color: ${color}"></span>
                        <span class="topic-name">${topic}</span>
                    </div>
                    <div class="topic-stats">
                        ${data.mentions} mentions${changeText ? ' • ' + changeText : ''}
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
        const colors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d'
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
                    this.selectedTopics = this.availableTopics.slice(0, 4);
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
            'Capital Efficiency': { momentum: '+17%', mentions: 89 },
            'DePIN': { momentum: '+190%', mentions: 201 },
            'B2B SaaS': { momentum: '+3%', mentions: 43 },
            'Developer Tools': { momentum: '+47%', mentions: 94 },
            'Vertical SaaS': { momentum: '+65%', mentions: 112 },
            'AI Infrastructure': { momentum: '+92%', mentions: 156 }
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
        const topicColors = {
            'AI Agents': '#4a7c59',
            'Capital Efficiency': '#f4a261',
            'DePIN': '#5a6c8c',
            'B2B SaaS': '#c77d7d',
            'Developer Tools': '#8a68a8',
            'Vertical SaaS': '#7d9c8d',
            'AI Infrastructure': '#a87c68'
        };
        
        const topicMomentum = {
            'AI Agents': '+85%',
            'Capital Efficiency': '+17%',
            'DePIN': '+190%',
            'B2B SaaS': '+3%',
            'Developer Tools': '+47%',
            'Vertical SaaS': '+65%',
            'AI Infrastructure': '+92%'
        };
        
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