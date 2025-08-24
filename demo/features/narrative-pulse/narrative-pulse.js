// Narrative Pulse Component
// Modular implementation of the Narrative Pulse feature

console.log('[DEBUG] narrative-pulse.js loading...');

const NarrativePulse = {
    // Component state
    activeFilter: null,
    container: null,
    currentTimeRange: '7 days', // Track current time range
    animatedCombinations: new Set(), // Track which view+time combinations have been animated
    
    // Tooltip state management
    tooltipPinned: false,
    currentLegendItem: null,
    tooltipOpenedByClick: false,
    highlightedDots: [], // Track currently enlarged dots
    closeOnClickOutsideHandler: null, // Store reference to remove handler properly
    
    // Chart configuration
    chartWidth: 800,
    chartHeight: 300,
    padding: 50,
    dateLabels: [], // Will be populated from unified data
    xPositions: [], // Will be calculated in init
    hideTooltipTimer: null,
    mouseMoveFrame: null, // For requestAnimationFrame debouncing
    
    // Time range data configurations - will be populated from unified data
    // timeRangeConfigs: {}, // Removed - using unified data config instead
    
    // Event listener management
    eventListeners: {
        momentum: [],
        volume: [],
        consensus: [],
        global: []
    },
    currentView: 'momentum',
    
    // Topic customization state
    availableTopics: [], // Will be populated from unified-data.js
    selectedTopics: [], // Will be populated from unified-data.js
    tempSelectedTopics: [],
    maxTopics: 5,
    panel: null,
    backdrop: null,
    hasChanges: false,
    
    // Check if this view+time combination has been animated
    hasAnimated: function(viewType) {
        const key = `${viewType}-${this.currentTimeRange}`;
        return this.animatedCombinations.has(key);
    },
    
    // Mark this view+time combination as animated
    markAnimated: function(viewType) {
        const key = `${viewType}-${this.currentTimeRange}`;
        this.animatedCombinations.add(key);
    },
    
    // Consensus sentiment data
    consensusData: {
        'AI Agents': {
            'Jun 29': { positive: 70, neutral: 7, negative: 2, total: 79, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Jul 6': { positive: 93, neutral: 10, negative: 2, total: 105, percent: 88.6, level: 'Strong',
                advocates: [
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Vinod Khosla', firm: 'Khosla Ventures' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 115, neutral: 11, negative: 2, total: 128, percent: 89.8, level: 'Strong',
                advocates: [
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' },
                    { name: 'Elad Gil', firm: 'Solo GP' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 127, neutral: 13, negative: 2, total: 142, percent: 89.4, level: 'Strong',
                advocates: [
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Reid Hoffman', firm: 'Greylock' },
                    { name: 'Sarah Guo', firm: 'Conviction' }
                ],
                dissent: null
            }
        },
        'Capital Efficiency': {
            'Jun 29': { positive: 38, neutral: 30, negative: 8, total: 76, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Jul 6': { positive: 49, neutral: 28, negative: 5, total: 82, percent: 59.8, level: 'Moderate',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 61, neutral: 22, negative: 4, total: 87, percent: 70.1, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' },
                    { name: 'David Sacks', firm: 'Craft Ventures' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 71, neutral: 14, negative: 3, total: 88, percent: 80.7, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'Brad Gerstner', firm: 'Altimeter' },
                    { name: 'Keith Rabois', firm: 'Founders Fund' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 76, neutral: 11, negative: 2, total: 89, percent: 85.4, level: 'Strong',
                advocates: [
                    { name: 'Bill Gurley', firm: 'Benchmark' },
                    { name: 'David Sacks', firm: 'Craft Ventures' },
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: null
            }
        },
        'DePIN': {
            'Jun 29': { positive: 3, neutral: 5, negative: 3, total: 11, percent: 27.3, level: 'Weak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' }
                ],
                dissent: { quote: 'Still too early for institutional', author: 'Bill Gurley' }
            },
            'Jul 6': { positive: 17, neutral: 12, negative: 5, total: 34, percent: 50.0, level: 'Moderate',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 62, neutral: 22, negative: 5, total: 89, percent: 69.7, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Ali Yahya', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 117, neutral: 35, negative: 4, total: 156, percent: 75.0, level: 'Strong',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' },
                    { name: 'Arianna Simpson', firm: 'a16z crypto' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 181, neutral: 18, negative: 2, total: 201, percent: 90.0, level: 'Peak',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z crypto' },
                    { name: 'Marc Andreessen', firm: 'a16z' },
                    { name: 'Katie Haun', firm: 'Haun Ventures' }
                ],
                dissent: null
            }
        },
        'B2B SaaS': {
            'Jun 29': { positive: 16, neutral: 20, negative: 4, total: 40, percent: 40.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Growth multiples unsustainable', author: 'Bill Gurley' }
            },
            'Jul 6': { positive: 16, neutral: 21, negative: 4, total: 41, percent: 39.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' },
                    { name: 'Byron Deeter', firm: 'Bessemer' }
                ],
                dissent: { quote: 'Consolidation inevitable', author: 'David Sacks' }
            },
            'Jul 13': { positive: 13, neutral: 25, negative: 4, total: 42, percent: 31.0, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'AI will eat most SaaS', author: 'Marc Andreessen' }
            },
            'Jul 20': { positive: 13, neutral: 26, negative: 4, total: 43, percent: 30.2, level: 'Weak',
                advocates: [
                    { name: 'Jason Lemkin', firm: 'SaaStr' }
                ],
                dissent: { quote: 'Vertical AI replacing horizontal SaaS', author: 'Sarah Guo' }
            }
        },
        'Developer Tools': {
            'Jun 29': { positive: 28, neutral: 12, negative: 2, total: 42, percent: 66.7, level: 'Moderate',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' }
                ],
                dissent: null
            },
            'Jul 6': { positive: 32, neutral: 10, negative: 2, total: 44, percent: 72.7, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dylan Field', firm: 'Figma' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 38, neutral: 8, negative: 2, total: 48, percent: 79.2, level: 'Strong',
                advocates: [
                    { name: 'Guillermo Rauch', firm: 'Vercel' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Nat Friedman', firm: 'Former GitHub' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 52, neutral: 10, negative: 2, total: 64, percent: 81.3, level: 'Strong',
                advocates: [
                    { name: 'Nat Friedman', firm: 'Former GitHub' },
                    { name: 'Dev Ittycheria', firm: 'MongoDB' },
                    { name: 'Peter Levine', firm: 'a16z' }
                ],
                dissent: null
            }
        },
        'Crypto/Web3': {
            'Jun 29': { positive: 16, neutral: 10, negative: 2, total: 28, percent: 57.1, level: 'Building',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'David Roebuck', firm: 'Electric Capital' }
                ],
                dissent: null
            },
            'Jul 6': { positive: 14, neutral: 9, negative: 2, total: 25, percent: 56.0, level: 'Building',
                advocates: [
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'Jesse Walden', firm: 'Variant' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 12, neutral: 8, negative: 2, total: 22, percent: 54.5, level: 'Weak',
                advocates: [
                    { name: 'Linda Xie', firm: 'Scalar Capital' },
                    { name: 'Chris Dixon', firm: 'a16z' }
                ],
                dissent: { name: 'Howard Marks', firm: 'Oaktree', quote: 'Still seeking killer use cases' }
            },
            'Jul 20': { positive: 15, neutral: 9, negative: 2, total: 26, percent: 57.7, level: 'Building',
                advocates: [
                    { name: 'Jesse Walden', firm: 'Variant' },
                    { name: 'Chris Dixon', firm: 'a16z' },
                    { name: 'Ryan Selkis', firm: 'Messari' }
                ],
                dissent: null
            }
        },
        'AI Infrastructure': {
            'Jun 29': { positive: 38, neutral: 16, negative: 4, total: 58, percent: 65.5, level: 'Moderate',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Jul 6': { positive: 56, neutral: 16, negative: 4, total: 76, percent: 73.7, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' },
                    { name: 'Soumith Chintala', firm: 'Meta' }
                ],
                dissent: null
            },
            'Jul 13': { positive: 82, neutral: 14, negative: 4, total: 100, percent: 82.0, level: 'Strong',
                advocates: [
                    { name: 'Martin Casado', firm: 'a16z' },
                    { name: 'Soumith Chintala', firm: 'Meta' },
                    { name: 'Ali Ghodsi', firm: 'Databricks' }
                ],
                dissent: null
            },
            'Jul 20': { positive: 114, neutral: 20, negative: 4, total: 138, percent: 82.6, level: 'Strong',
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
        'Jun 29': {
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
        'Jul 6': {
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
        'Jul 13': {
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
        'Jul 20': {
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
    
    // Time range data - populated from unified data source
    timeRangeData: {
        '7 days': { topics: {} },
        '30 days': { topics: {} },
        '90 days': { topics: {} }
    },
    
    // Initialize the component
    init: function(containerElement) {
        console.log('[DEBUG] NarrativePulse.init called with:', containerElement);
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
        
        // Initialize data from unified data source
        this.initializeDataFromUnifiedSource();
        
        // Initialize data if not already set
        if (!this.topicDataByDate) {
            this.topicDataByDate = NarrativePulse.topicDataByDate;
        }
        
        // Calculate consistent x-positions for 5 data points
        // Set initial time range
        this.currentTimeRange = '7 days';
        const config = window.unifiedData.narrativePulse.config.timeRanges[this.currentTimeRange];
        this.dateLabels = config.dateLabels;
        
        // Calculate X positions
        this.calculateXPositions();
        
        // Debug initial setup
        // NarrativePulse initialized
        
        // Get panel elements (now at document level for proper viewport positioning)
        this.panel = document.querySelector('.topic-customization-panel');
        this.backdrop = document.querySelector('.topic-customization-backdrop');
        
        // Load saved topics from localStorage - now handled in initializeDataFromUnifiedSource
        // this.loadSelectedTopics();
        
        this.bindEvents();
        this.currentView = 'momentum'; // Set initial view
        this.createMomentumView(); // Create the momentum view with all elements
        this.updateInsightCards(); // Initialize insight cards
        
        // Parse URL parameters to restore shared state
        this.parseUrlState();
        
        // Initialize interactions after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.initMomentumView(); // Initialize interactions
            // Only animate on very first load
            if (!this.hasAnimated('momentum')) {
                // Set initial legend values to 0%
                const legendItems = this.container.querySelectorAll('.legend-item');
                legendItems.forEach(item => {
                    const valueElement = item.querySelector('.legend-value');
                    if (valueElement) {
                        // Get the final value from data-final attribute (already set by updateLegend)
                        const finalValue = valueElement.getAttribute('data-final') || valueElement.textContent;
                        const isPositive = finalValue.includes('+');
                        // Only reset to 0% if not already at 0%
                        if (valueElement.textContent !== '+0%' && valueElement.textContent !== '0%') {
                            valueElement.setAttribute('data-final', finalValue);
                            valueElement.textContent = isPositive ? '+0%' : '0%';
                        }
                    }
                });
                
                // Run animation
                this.animateChartOnLoad();
                this.markAnimated('momentum');
            }
        }, 100);
        
        this.addTouchSupport(); // Add touch event support
        
        // Note: Quote click handler moved to global scope at end of file
        
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
        
        // View toggle buttons
        const viewButtons = container.querySelectorAll('.view-toggle-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchToView(btn.dataset.view);
            });
        });
        
        // Filter clear button
        const filterClearBtn = container.querySelector('[data-action="clearTopicFilter"]');
        if (filterClearBtn) {
            filterClearBtn.addEventListener('click', this.clearTopicFilter.bind(this));
        }
        
        // Legend items no longer have hover handlers
        // Tooltips are now triggered by clicking on the chart
        
        // Share button
        const shareBtn = container.querySelector('[data-action="shareChart"]');
        if (shareBtn) {
            shareBtn.addEventListener('click', this.toggleShareDropdown.bind(this));
        }
        
        // Share dropdown options
        const copyLinkBtn = container.querySelector('[data-action="copyLink"]');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', this.copyShareLink.bind(this));
        }
        
        const downloadBtn = container.querySelector('[data-action="downloadImage"]');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', this.downloadChart.bind(this));
        }
        
        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('shareDropdown');
            const shareBtn = container.querySelector('[data-action="shareChart"]');
            if (dropdown && shareBtn && !dropdown.contains(e.target) && !shareBtn.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
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
    
    // Calculate momentum percentage from data points
    calculateMomentum: function(dataPoints) {
        if (!dataPoints || dataPoints.length < 2) return '0%';
        
        const start = dataPoints[0];
        const end = dataPoints[dataPoints.length - 1];
        
        if (start === 0) {
            return end > 0 ? `+${end}%` : '0%';
        }
        
        const percentChange = ((end - start) / start) * 100;
        const rounded = Math.round(percentChange);
        
        return `${rounded >= 0 ? '+' : ''}${rounded}%`;
    },
    
    // Get topic data for current time range
    getTopicData: function(topic) {
        const data = this.getCurrentData();
        if (!data || !data.topics) {
            console.warn('No data available for current time range');
            return null;
        }
        return data.topics[topic] || null;
    },
    
    // Helper function to convert topic name to kebab-case key
    getTopicKey: function(topicName) {
        return topicName.toLowerCase().replace(/\s+/g, '-');
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
        
        console.log('[DEBUG] ========== TIMELINE CHANGE START ==========');
        console.log('[DEBUG] Current time range:', current);
        console.log('[DEBUG] Current view:', this.currentView);
        console.log('[DEBUG] Active filter before timeline change:', this.activeFilter);
        
        // Update time range
        if (current === '7 days') {
            this.currentTimeRange = '30 days';
        } else if (current === '30 days') {
            this.currentTimeRange = '90 days';
        } else {
            this.currentTimeRange = '7 days';
        }
        
        console.log('[DEBUG] New time range:', this.currentTimeRange);
        
        // Update UI text
        timeText.textContent = this.currentTimeRange;
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('timeRangeChanged', {
            detail: { timeRange: this.currentTimeRange }
        }));
        
        // Update date labels and recalculate x positions
        const config = window.unifiedData.narrativePulse.config.timeRanges[this.currentTimeRange];
        this.dateLabels = config.dateLabels;
        this.calculateXPositions();
        
        // Time range changed - ensure filter is cleared
        console.log('[DEBUG] Clearing filter state on timeline change');
        this.activeFilter = null;
        window.activeFilter = null;
        
        // Hide filter indicator explicitly
        const filterIndicator = this.container.querySelector('#filterActive');
        if (filterIndicator) {
            filterIndicator.classList.remove('show');
        }
        
        // Refresh current view with new data
        const chartContent = this.container.querySelector('#chartContent');
        chartContent.classList.add('fade-out');
        
        // CRITICAL: Clean up current view handlers before recreating
        this.cleanupViewEventHandlers();
        console.log('[DEBUG] Cleaned up handlers before time range refresh');
        
        setTimeout(() => {
            if (this.currentView === 'momentum') {
                this.createMomentumView();
                
                // Trigger momentum animation if first time viewing this combination
                if (!this.hasAnimated('momentum')) {
                    // Start animation immediately - no delay
                    this.animateChartOnLoad();
                    this.markAnimated('momentum');
                }
            } else if (this.currentView === 'volume') {
                this.createVolumeView();
                
                // Trigger volume animation if first time viewing volume
                if (!this.hasAnimated('volume')) {
                    setTimeout(() => {
                        this.animateVolumeOnLoad();
                    }, 200); // Small delay to ensure DOM is ready
                }
            } else {
                this.createConsensusView();
                
                // Trigger consensus animation if first time viewing consensus
                if (!this.hasAnimated('consensus')) {
                    setTimeout(() => {
                        this.animateConsensusOnLoad();
                    }, 200); // Small delay to ensure DOM is ready
                }
            }
            
            chartContent.classList.remove('fade-out');
            chartContent.classList.add('fade-in');
            
            setTimeout(() => {
                chartContent.classList.remove('fade-in');
            }, 150);
            
            console.log('[DEBUG] Timeline change complete');
            console.log('[DEBUG] Active filter after timeline change:', this.activeFilter);
            console.log('[DEBUG] ========== TIMELINE CHANGE END ==========');
        }, 150);
        
        // Update legend and insight cards for the new time range
        this.updateLegend();
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
    
    // Switch to specific view with smooth transitions
    switchToView: function(viewName) {
        const chartContent = this.container.querySelector('#chartContent');
        
        console.log('[DEBUG] ========== VIEW SWITCH START ==========');
        console.log('[DEBUG] Switching from', this.currentView, 'to', viewName);
        console.log('[DEBUG] Current timeline:', this.currentTimeRange);
        console.log('[DEBUG] Active filter before switch:', this.activeFilter);
        
        // Update button states
        const buttons = this.container.querySelectorAll('.view-toggle-btn');
        buttons.forEach(btn => {
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // IMPORTANT: Full cleanup before switching
        console.log('[DEBUG] Starting full cleanup before view switch');
        
        // Clean up handlers for the view we're switching TO (not FROM)
        this.removeViewListeners(viewName);
        console.log('[DEBUG] Cleaned up', viewName, 'handlers before switch');
        
        // Also clean up current view handlers
        this.cleanupViewEventHandlers();
        
        // Double-check filter is cleared
        this.activeFilter = null;
        window.activeFilter = null;
        const filterIndicator = this.container.querySelector('#filterActive');
        if (filterIndicator && filterIndicator.classList.contains('show')) {
            console.warn('[DEBUG] Filter indicator still showing after cleanup! Force hiding...');
            filterIndicator.classList.remove('show');
        }
        
        // Fade out current view
        chartContent.classList.add('fade-out');
        
        // Wait for fade out, then switch view and fade in
        setTimeout(() => {
            console.log('[DEBUG] Inside setTimeout, switching to:', viewName);
            this.currentView = viewName;
            
            // Switch to appropriate view
            if (viewName === 'momentum') {
                console.log('[DEBUG] About to call createMomentumView');
                this.createMomentumView();
            } else if (viewName === 'volume') {
                this.createVolumeView();
                
                // Trigger volume animation if first time
                if (!this.hasAnimated('volume')) {
                    setTimeout(() => {
                        this.animateVolumeOnLoad();
                    }, 200); // Small delay to ensure DOM is ready
                }
            } else if (viewName === 'consensus') {
                this.createConsensusView();
                
                // Trigger consensus animation if first time
                if (!this.hasAnimated('consensus')) {
                    setTimeout(() => {
                        this.animateConsensusOnLoad();
                    }, 200); // Small delay to ensure DOM is ready
                }
            }
            
            // Remove fade-out and add fade-in
            chartContent.classList.remove('fade-out');
            chartContent.classList.add('fade-in');
            
            // Clean up fade-in class after animation
            setTimeout(() => {
                chartContent.classList.remove('fade-in');
            }, 150);
            
            console.log('[DEBUG] View switch complete to:', viewName);
            console.log('[DEBUG] Active filter after switch:', this.activeFilter);
            console.log('[DEBUG] ========== VIEW SWITCH END ==========');
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
        console.log('[DEBUG] createVolumeView - START');
        
        // Safeguard: Check for duplicate tooltips before creating view
        const allTooltips = document.querySelectorAll('#chartTooltip');
        if (allTooltips.length > 1) {
            console.warn('[DEBUG] Multiple tooltips detected in createVolumeView! Cleaning up...');
            for (let i = 1; i < allTooltips.length; i++) {
                allTooltips[i].remove();
            }
        }
        
        // Ensure filter is not showing when it shouldn't
        const filterIndicator = this.container.querySelector('#filterActive');
        if (!this.activeFilter) {
            if (filterIndicator && filterIndicator.classList.contains('show')) {
                console.warn('[DEBUG] Filter indicator showing without active filter! Hiding...');
                filterIndicator.classList.remove('show');
            }
        } else {
            // If there IS an active filter, log it (this helps debug)
            console.log('[DEBUG] Active filter in createMomentumView:', this.activeFilter);
            // For now, clear it as filters shouldn't persist across timeline changes
            console.warn('[DEBUG] Clearing unexpected filter:', this.activeFilter);
            this.clearTopicFilter();
        }
        
        // Clean up any existing volume handlers first
        this.removeViewListeners('volume');
        console.log('[DEBUG] Cleaned up old volume handlers');
        
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
                        
                        // Set initial height to 0 if not animated yet, keep bar at bottom
                        const initialHeight = !this.hasAnimated('volume') ? 0 : barHeight;
                        const initialY = !this.hasAnimated('volume') ? baseY : currentY;
                        const finalHeight = barHeight;
                        const finalY = currentY;
                        
                        html += `
                            <g class="volume-bar-segment" data-date="${date}" data-topic="${topic}" data-mentions="${mentions}" data-date-index="${dateIndex}">
                                <rect x="${x}" y="${initialY}" width="${barWidth}" height="${initialHeight}"
                                      data-final-height="${finalHeight}"
                                      data-final-y="${finalY}"
                                      fill="${topicData.color}" opacity="0.8"
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
                
                html += '</div></div>';
                
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
        console.log('[DEBUG] createConsensusView - START');
        
        // Safeguard: Check for duplicate tooltips before creating view
        const allTooltips = document.querySelectorAll('#chartTooltip');
        if (allTooltips.length > 1) {
            console.warn('[DEBUG] Multiple tooltips detected in createConsensusView! Cleaning up...');
            for (let i = 1; i < allTooltips.length; i++) {
                allTooltips[i].remove();
            }
        }
        
        // Ensure filter is not showing when it shouldn't
        const filterIndicator = this.container.querySelector('#filterActive');
        if (!this.activeFilter) {
            if (filterIndicator && filterIndicator.classList.contains('show')) {
                console.warn('[DEBUG] Filter indicator showing without active filter! Hiding...');
                filterIndicator.classList.remove('show');
            }
        } else {
            // If there IS an active filter, log it (this helps debug)
            console.log('[DEBUG] Active filter in createMomentumView:', this.activeFilter);
            // For now, clear it as filters shouldn't persist across timeline changes
            console.warn('[DEBUG] Clearing unexpected filter:', this.activeFilter);
            this.clearTopicFilter();
        }
        
        // Clean up any existing consensus handlers first
        this.removeViewListeners('consensus');
        console.log('[DEBUG] Cleaned up old consensus handlers');
        
        const chartContent = this.container.querySelector('#chartContent');
        const topicNames = this.selectedTopics;
        const currentData = this.getCurrentData();
        
        // Update legend first
        this.updateLegend();
        
        // Grid layout configuration - align with chart axes
        const gridStartX = this.padding + 20; // Start at 70px to give room for labels
        const gridStartY = 50;  // Moved up another 10px (was 60)
        const availableWidth = this.chartWidth - this.padding - 70; // Adjust for new start position
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
                    
                    // Set initial opacity to 0 if not animated yet
                    const initialOpacity = !this.hasAnimated('consensus') ? 0 : 1;
                    const initialTransform = !this.hasAnimated('consensus') ? 
                        'scale(0.95) translate(0, 5)' : '';
                    
                    return `
                        <g class="consensus-cell-group" 
                           data-topic="${topic}" 
                           data-date="${date}" 
                           data-percent="${percent}" 
                           data-row="${rowIndex}"
                           data-col="${colIndex}"
                           opacity="${initialOpacity}"
                           transform="${initialTransform}">
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
                            <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                            <text x="37" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Capital
                            </text>
                            <text x="37" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Efficiency
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'Developer Tools') {
                    return `
                        <g>
                            <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                            <text x="37" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Developer
                            </text>
                            <text x="37" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Tools
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'AI Infrastructure') {
                    return `
                        <g>
                            <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                            <text x="37" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                AI
                            </text>
                            <text x="37" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Infrastructure
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'Vertical SaaS') {
                    return `
                        <g>
                            <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                            <text x="37" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Vertical
                            </text>
                            <text x="37" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                SaaS
                            </text>
                        </g>
                    `;
                }
                
                if (topic === 'Enterprise Agents') {
                    return `
                        <g>
                            <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                            <text x="37" y="${y - 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Enterprise
                            </text>
                            <text x="37" y="${y + 6}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                Agents
                            </text>
                        </g>
                    `;
                }
                
                return `
                    <g>
                        <circle cx="45" cy="${y}" r="3" fill="${color}"/>
                        <text x="37" y="${y + 4}"
                              fill="#666666" font-size="12" text-anchor="end">
                            ${topic}
                        </text>
                    </g>
                `;
            }).join('')}
            
            
            <!-- Legend (right side - outside chart area) -->
            <g transform="translate(${this.chartWidth - this.padding}, ${gridStartY})">
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
                
                <!-- Calculate the actual grid height to match the topic grid exactly -->
                <rect x="0" y="0" width="10" height="${(topicNames.length * (cellHeight + cellGap)) - cellGap}" 
                      fill="url(#consensusGradient)" stroke="#e5e7eb" stroke-width="1"/>
                
                <!-- Legend labels evenly distributed within bounds -->
                <text x="15" y="12" fill="#666666" font-size="10">Peak (90%+)</text>
                <text x="15" y="${12 + ((((topicNames.length * (cellHeight + cellGap)) - cellGap) - 15) * 0.25)}" fill="#666666" font-size="10">Strong (70%+)</text>
                <text x="15" y="${12 + ((((topicNames.length * (cellHeight + cellGap)) - cellGap) - 15) * 0.5)}" fill="#666666" font-size="10">Building (50%+)</text>
                <text x="15" y="${12 + ((((topicNames.length * (cellHeight + cellGap)) - cellGap) - 15) * 0.75)}" fill="#666666" font-size="10">Mixed (30%+)</text>
                <text x="15" y="${((topicNames.length * (cellHeight + cellGap)) - cellGap) - 3}" fill="#666666" font-size="10">Contested (&lt;30%)</text>
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
                e.stopPropagation(); // Prevent event bubbling
                
                // Clear any existing hide timer
                if (this.hideTooltipTimer) {
                    clearTimeout(this.hideTooltipTimer);
                    this.hideTooltipTimer = null;
                }
                
                const topic = cellGroup.dataset.topic;
                const date = cellGroup.dataset.date;
                const percent = parseFloat(cellGroup.dataset.percent);
                const dateIndex = parseInt(cellGroup.dataset.col); // Use data-col instead of data-index
                const currentData = this.getCurrentData();
                const topicData = currentData.topics[topic];
                
                // Format date nicely
                const [month, day] = date.split(' ');
                const formattedDate = `${month} ${day}`;
                
                // Calculate mentions for this date - using dataPoints array at the column index
                const mentions = topicData && topicData.dataPoints && topicData.dataPoints[dateIndex] !== undefined 
                    ? topicData.dataPoints[dateIndex] 
                    : 0;
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
            
            const handleCellMouseLeave = (e) => {
                e.stopPropagation(); // Prevent event bubbling
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
    
    // Update tooltip position centered over data point and in middle of viewport
    updateTooltipPositionCentered: function(dataPointX) {
        const chartContainer = this.container.querySelector('.chart-container');
        const tooltip = this.container.querySelector('#chartTooltip');
        const svg = this.container.querySelector('#narrativeChart');
        
        if (!chartContainer || !tooltip || !svg) return;
        
        const svgRect = svg.getBoundingClientRect();
        
        // Convert SVG coordinate to viewport coordinate
        const svgWidth = svgRect.width;
        const viewBoxWidth = 800; // From viewBox="0 0 800 280"
        const xInViewport = svgRect.left + (dataPointX / viewBoxWidth) * svgWidth;
        
        // Get tooltip dimensions
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;
        
        // Use fixed positioning for center of viewport
        tooltip.style.position = 'fixed';
        
        // Center tooltip horizontally over data point (in viewport coordinates)
        let tooltipX = xInViewport - (tooltipWidth / 2);
        
        // Center tooltip vertically in viewport
        const viewportHeight = window.innerHeight;
        let tooltipY = (viewportHeight - tooltipHeight) / 2;
        
        // Ensure minimum distance from top
        if (tooltipY < 20) {
            tooltipY = 20;
        }
        
        // Adjust horizontal position if tooltip goes off-screen
        const viewportWidth = window.innerWidth;
        if (tooltipX < 10) {
            tooltipX = 10;
        } else if (tooltipX + tooltipWidth > viewportWidth - 10) {
            tooltipX = viewportWidth - tooltipWidth - 10;
        }
        
        // Apply position
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
        tooltip.style.zIndex = '10000'; // Ensure it's above everything
    },
    
    // Update tooltip position (legacy - for mouse-based positioning)
    updateTooltipPosition: function(e) {
        const chartContainer = this.container.querySelector('.chart-container');
        const tooltip = this.container.querySelector('#chartTooltip');
        const rect = chartContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Get tooltip dimensions first
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        // Initial position (right of cursor, above cursor)
        let tooltipX = x + 15;
        let tooltipY = y - 25; // Fixed offset above cursor - between original (-30) and center

        // Adjust horizontal position if tooltip goes off-screen
        if (tooltipX + tooltipWidth > rect.width - 20) {
            tooltipX = x - tooltipWidth - 15;
        }

        // Adjust vertical position if tooltip goes off-screen
        // Check if too close to top
        if (tooltipY < 20) {
            tooltipY = 20;
        } 
        // Check if too close to bottom
        else if (tooltipY + tooltipHeight > rect.height - 10) {
            tooltipY = rect.height - tooltipHeight - 10;
        }

        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
    },
    
    // Set topic filter
    setTopicFilter: function(topic) {
        console.log('[DEBUG] setTopicFilter called with topic:', topic);
        console.trace('[DEBUG] setTopicFilter call stack');
        
        const filterIndicator = this.container.querySelector('#filterActive');
        const filterTopicSpan = this.container.querySelector('#filterTopic');
        
        if (!topic) {
            console.warn('[DEBUG] setTopicFilter called with empty topic! Ignoring...');
            return;
        }
        
        this.activeFilter = topic;
        window.activeFilter = topic; // Maintain global compatibility
        filterTopicSpan.textContent = topic;
        filterIndicator.classList.add('show');
        console.log('[DEBUG] Filter indicator shown for topic:', topic);
        
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
        console.log('[DEBUG] clearTopicFilter called');
        const filterIndicator = this.container.querySelector('#filterActive');
        const filterTopicSpan = this.container.querySelector('#filterTopic');
        
        this.activeFilter = null;
        window.activeFilter = null; // Maintain global compatibility
        
        if (filterIndicator) {
            filterIndicator.classList.remove('show');
            console.log('[DEBUG] Filter indicator hidden');
        }
        
        if (filterTopicSpan) {
            filterTopicSpan.textContent = '';
        }
        
        this.container.querySelectorAll('.topic-line, .volume-bar, .consensus-row').forEach(el => {
            el.classList.remove('active', 'dimmed');
        });
        
        console.log('[DEBUG] Filter cleared completely');
    },
    
    // Share functionality methods
    toggleShareDropdown: function(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('shareDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    },
    
    getCurrentState: function() {
        // Get active view
        const viewBtns = this.container.querySelectorAll('.view-toggle-btn');
        let activeView = 'momentum';
        viewBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeView = btn.dataset.view;
            }
        });
        
        // Get time range
        const timeText = this.container.querySelector('#timeRangeText').textContent;
        const timeMap = {'7 days': '7d', '30 days': '30d', '90 days': '90d'};
        const time = timeMap[timeText] || '30d';
        
        // Get active topics from legend (non-inactive items)
        const activeTopics = [];
        this.container.querySelectorAll('.legend-item:not(.inactive)').forEach(item => {
            activeTopics.push(item.dataset.topic);
        });
        
        return { 
            view: activeView, 
            time: time, 
            topics: activeTopics.join(',') 
        };
    },
    
    copyShareLink: function() {
        const state = this.getCurrentState();
        const params = new URLSearchParams(state);
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        
        navigator.clipboard.writeText(url).then(() => {
            // Show success feedback
            const dropdown = document.getElementById('shareDropdown');
            const copyBtn = dropdown.querySelector('[data-action="copyLink"] span');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                dropdown.style.display = 'none';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show feedback
            const dropdown = document.getElementById('shareDropdown');
            const copyBtn = dropdown.querySelector('[data-action="copyLink"] span');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                dropdown.style.display = 'none';
            }, 1500);
        });
    },
    
    downloadChart: function() {
        const svg = this.container.querySelector('#narrativeChart');
        const svgData = new XMLSerializer().serializeToString(svg);
        
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Set canvas dimensions
        canvas.width = 800;
        canvas.height = 280;
        
        img.onload = function() {
            // Fill white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the SVG image
            ctx.drawImage(img, 0, 0);
            
            // Trigger download
            const link = document.createElement('a');
            link.download = 'narrative-pulse-chart.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        // Convert SVG to blob and create URL
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        
        // Close dropdown
        document.getElementById('shareDropdown').style.display = 'none';
    },
    
    // Parse URL state to restore from shared links
    parseUrlState: function() {
        const params = new URLSearchParams(window.location.search);
        
        // Restore view if present
        if (params.has('view')) {
            const view = params.get('view');
            if (['momentum', 'volume', 'consensus'].includes(view)) {
                // Find and click the appropriate view button
                const viewBtn = this.container.querySelector(`[data-view="${view}"]`);
                if (viewBtn && view !== 'momentum') { // momentum is default, only switch if different
                    setTimeout(() => {
                        viewBtn.click();
                    }, 100);
                }
            }
        }
        
        // Restore time range if present
        if (params.has('time')) {
            const timeMap = {'7d': '7 days', '30d': '30 days', '90d': '90 days'};
            const timeText = timeMap[params.get('time')];
            if (timeText && timeText !== '7 days') { // 7 days is default
                const timeTextElement = document.getElementById('timeRangeText');
                if (timeTextElement) {
                    timeTextElement.textContent = timeText;
                    this.currentTimeRange = timeText;
                    
                    // Trigger update after a short delay
                    setTimeout(() => {
                        this.updateChart();
                    }, 200);
                }
            }
        }
        
        // Restore topics if present
        if (params.has('topics')) {
            const topics = params.get('topics').split(',');
            // This would require integration with the topic customization panel
            // For now, we'll just log it
            console.log('Shared topics:', topics);
            // TODO: Implement topic restoration when topic customization is fully integrated
        }
    },
    
    // Create Momentum View (to avoid page reload)
    createMomentumView: function() {
        console.log('[DEBUG] createMomentumView called');
        
        // Safeguard: Check for duplicate tooltips before creating view
        const allTooltips = document.querySelectorAll('#chartTooltip');
        if (allTooltips.length > 1) {
            console.warn('[DEBUG] Multiple tooltips detected in createMomentumView! Cleaning up...');
            for (let i = 1; i < allTooltips.length; i++) {
                allTooltips[i].remove();
            }
        }
        
        // Ensure filter is not showing when it shouldn't
        const filterIndicator = this.container.querySelector('#filterActive');
        if (!this.activeFilter) {
            if (filterIndicator && filterIndicator.classList.contains('show')) {
                console.warn('[DEBUG] Filter indicator showing without active filter! Hiding...');
                filterIndicator.classList.remove('show');
            }
        } else {
            // If there IS an active filter, log it (this helps debug)
            console.log('[DEBUG] Active filter in createMomentumView:', this.activeFilter);
            // For now, clear it as filters shouldn't persist across timeline changes
            console.warn('[DEBUG] Clearing unexpected filter:', this.activeFilter);
            this.clearTopicFilter();
        }
        
        const chartContent = this.container.querySelector('#chartContent');
        
        // Ensure X positions are calculated for current date labels
        this.calculateXPositions();
        
        // Update legend first
        this.updateLegend();
        
        // Create paths for selected topics using dynamic data
        const currentData = this.getCurrentData();
        const pathConfigs = {};
        
        // Debug logging
        console.log('Selected topics:', this.selectedTopics);
        console.log('Available topics in data:', Object.keys(currentData.topics));
        
        // Build path configs ONLY for selected topics
        console.log('[DEBUG] Building paths for time range:', this.currentTimeRange);
        console.log('[DEBUG] Current data keys:', Object.keys(currentData));
        console.log('[DEBUG] Date labels:', this.dateLabels);
        console.log('[DEBUG] X positions:', this.xPositions);
        
        this.selectedTopics.forEach(topic => {
            const topicData = currentData.topics[topic];
            if (!topicData) {
                console.warn(`No data found for selected topic: ${topic}`);
                return;
            }
            
            if (!topicData.dataPoints || topicData.dataPoints.length === 0) {
                console.warn(`No dataPoints for topic: ${topic}`);
                return;
            }
            
            console.log(`[DEBUG] Topic ${topic} has ${topicData.dataPoints.length} data points`);
            
            const yScale = this.calculateYScale(topicData.dataPoints);
            pathConfigs[topic] = {
                momentum: topicData.displayMomentum || topicData.actualMomentum || this.calculateMomentum(topicData.dataPoints),
                color: topicData.color,
                yStart: yScale.start,
                yEnd: yScale.end,
                dataPoints: topicData.dataPoints
            };
        });
        
        const paths = this.selectedTopics
            .filter(topic => pathConfigs[topic]) // Only include topics with valid data
            .map(topic => ({
                topic: topic,
                ...pathConfigs[topic]
            }));
        
        // Calculate Y-axis scale based on selected topics data only
        const selectedTopicsData = this.selectedTopics
            .map(topic => currentData.topics[topic])
            .filter(data => data && data.dataPoints);
        
        const allDataPoints = selectedTopicsData.flatMap(t => t.dataPoints);
        const maxDataValue = allDataPoints.length > 0 ? Math.max(...allDataPoints) : 100;
        const minDataValue = allDataPoints.length > 0 ? Math.min(...allDataPoints) : 0;
        
        // Add some padding to the scale
        const range = maxDataValue - minDataValue;
        const padding = range * 0.1;
        const scaleMax = Math.ceil((maxDataValue + padding) / 10) * 10;
        const scaleMin = 0; // Always start at 0, never go negative
        
        // Calculate Y-axis labels
        const yAxisSteps = 5;
        const stepSize = (scaleMax - scaleMin) / (yAxisSteps - 1);
        const yAxisLabels = [];
        for (let i = 0; i < yAxisSteps; i++) {
            const value = Math.round(scaleMax - (i * stepSize));
            yAxisLabels.push(Math.max(0, value)); // Ensure no negative values
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
                
                console.log(`[DEBUG PATH] Creating path for ${p.topic}:`);
                console.log(`  - yPositions count: ${yPositions.length}`);
                console.log(`  - yPositions values:`, yPositions);
                console.log(`  - this.xPositions:`, this.xPositions);
                
                if (yPositions.length > 1 && this.xPositions && this.xPositions.length > 0) {
                    // Use the pre-calculated xPositions, ensuring we have the right number
                    const xPosToUse = this.xPositions.slice(0, yPositions.length);
                    console.log(`  - xPosToUse:`, xPosToUse);
                    
                    // Different approaches based on number of points
                    if (yPositions.length <= 5) {
                        console.log(`  - Using quadratic curves for ${yPositions.length} points`);
                        // For 5 or fewer points (30-day view), use quadratic curves
                        pathData = `M ${xPosToUse[0]},${yPositions[0]}`;
                        if (yPositions.length >= 3) {
                            pathData += ` Q ${xPosToUse[1]},${yPositions[1]} ${xPosToUse[2]},${yPositions[2]}`;
                        }
                        if (yPositions.length > 3) {
                            pathData += ` T ${xPosToUse[3]},${yPositions[3]}`;
                        }
                        if (yPositions.length > 4) {
                            pathData += ` T ${xPosToUse[4]},${yPositions[4]}`;
                        }
                        console.log(`  - Generated pathData: "${pathData}"`);
                    } else {
                        console.log(`  - Using Catmull-Rom spline for ${yPositions.length} points`);
                        // For more points (7-day and 90-day), use Catmull-Rom spline
                        pathData = this.createCatmullRomPath(xPosToUse, yPositions);
                        console.log(`  - Generated pathData length: ${pathData.length} chars`);
                    }
                } else {
                    console.log(`  - SKIPPING PATH: Not enough data or missing xPositions`);
                    console.log(`    - yPositions.length: ${yPositions.length}`);
                    console.log(`    - this.xPositions exists: ${!!this.xPositions}`);
                    console.log(`    - this.xPositions length: ${this.xPositions ? this.xPositions.length : 0}`);
                }
                
                // Calculate animation delay based on topic index
                const topicIndex = this.selectedTopics.indexOf(p.topic);
                const animationDelay = topicIndex * 0.1; // 100ms stagger
                
                // Only hide initially if this is the first load
                const initialStyle = !this.hasAnimated('momentum') ? 
                    `stroke-dasharray: 1000; stroke-dashoffset: 1000; opacity: 0;` : 
                    '';
                
                console.log(`  - Path will be rendered: ${pathData.length > 0 ? 'YES' : 'NO'}`);
                if (!pathData) {
                    console.warn(`  - WARNING: Empty pathData for ${p.topic}!`);
                }
                
                return `<g class="topic-line chart-transition" data-topic="${p.topic}" data-momentum="${p.momentum}" data-color="${p.color}">
                    <path d="${pathData}" 
                          fill="none" stroke="${p.color}" stroke-width="3" 
                          class="topic-path"
                          style="${initialStyle}"/>
                    <!-- Static dots at data points -->
                    ${yPositions.map((y, i) => {
                        // Use pre-calculated xPositions with bounds checking
                        const x = (this.xPositions && i < this.xPositions.length) ? 
                            this.xPositions[i] : 
                            this.padding + i * ((this.chartWidth - 2 * this.padding) / (yPositions.length - 1));
                        return `
                            <circle cx="${x}" cy="${y}" r="3" fill="${p.color}" 
                                    class="data-point-dot chart-transition" opacity="0" data-topic="${p.topic}"/>
                        `;
                    }).join('')}
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
            
            // CRITICAL FIX: Always make paths visible when switching back to momentum view
            // If we've already animated before, paths need to be made visible immediately
            if (this.hasAnimated('momentum')) {
                console.log('[DEBUG] Making paths visible (already animated before)');
                const paths = this.container.querySelectorAll('.topic-path');
                const dots = this.container.querySelectorAll('.data-point-dot');
                
                paths.forEach(path => {
                    // Reset to visible state
                    path.style.strokeDasharray = '';
                    path.style.strokeDashoffset = '';
                    path.style.opacity = '1';
                });
                
                // Also make dots visible
                dots.forEach(dot => {
                    dot.style.opacity = '1';
                });
                
                // Update legend values to their final state
                const legendItems = this.container.querySelectorAll('.legend-item');
                legendItems.forEach(item => {
                    const valueElement = item.querySelector('.legend-value');
                    if (valueElement) {
                        const finalValue = valueElement.getAttribute('data-final');
                        if (finalValue) {
                            valueElement.textContent = finalValue;
                        }
                    }
                });
            } else {
                // First time showing momentum view - animate it
                console.log('[DEBUG] First time showing momentum - animating');
                this.animateChartOnLoad();
                this.markAnimated('momentum');
            }
        }, 50);
    },
    
    // Topic mapping between unified data and component's internal names
    unifiedToInternalTopicMap: {
        'AI Infrastructure': 'AI Infrastructure',  // Same name
        'Enterprise Agents': 'AI Agents',
        'Defense Tech': 'Developer Tools',  // Map to similar topic for demo
        'Exit Strategies': 'Capital Efficiency',  // Map to similar topic
        'Vertical AI': 'Vertical SaaS',
        'Traditional SaaS': 'B2B SaaS',
        'Climate Tech': 'Crypto/Web3'  // Map to available slot
    },
    
    // Initialize data from unified data source
    initializeDataFromUnifiedSource: function() {
        // Check if narrativePulseData is available (created by unified-data-adapter.js)
        if (!window.narrativePulseData) {
            console.warn('NarrativePulse: narrativePulseData not found, waiting...');
            // Try again after a short delay
            setTimeout(() => this.initializeDataFromUnifiedSource(), 100);
            return;
        }
        
        // Loading data from narrativePulseData
        
        // Set timeRangeData from narrativePulseData
        this.timeRangeData = {
            '7 days': window.narrativePulseData.sevenDayData,
            '30 days': window.narrativePulseData.thirtyDayData,
            '90 days': window.narrativePulseData.ninetyDayData
        };
        
        // Extract available topics from the data
        const topics = Object.keys(window.narrativePulseData.sevenDayData.topics);
        this.availableTopics = [...topics];
        
        // Define default topics to show (first 5 from available topics)
        // This ensures we always show 5 topics by default, regardless of which ones they are
        const defaultTopics = topics.slice(0, this.maxTopics);
        
        // Load saved topics or use the default topics
        const savedTopics = localStorage.getItem('narrativePulse_selectedTopics');
        if (savedTopics) {
            try {
                const parsed = JSON.parse(savedTopics);
                // Ensure saved topics still exist in the data
                this.selectedTopics = parsed.filter(topic => topics.includes(topic));
            } catch (e) {
                console.error('Failed to parse saved topics:', e);
                // Use default topics
                this.selectedTopics = defaultTopics;
            }
        } else {
            // Use default topics (first 5 available)
            this.selectedTopics = defaultTopics;
        }
        
        // If no topics selected or less than maxTopics, use first maxTopics from available
        if (this.selectedTopics.length === 0 || this.selectedTopics.length > this.maxTopics) {
            this.selectedTopics = topics.slice(0, this.maxTopics);
        }
        
        
        // Update time range configs with date labels from the data
        // IMPORTANT: Use unified data config instead to ensure consistency
        
        // Comment out the old approach - we'll use unified data directly
        // this.timeRangeConfigs = {
        //     '7 days': {
        //         dateLabels: window.narrativePulseData.sevenDayData.timeRange.labels,
        //         dataPoints: window.narrativePulseData.sevenDayData.timeRange.dataPoints
        //     },
        //     '30 days': {
        //         dateLabels: window.narrativePulseData.thirtyDayData.timeRange.labels,
        //         dataPoints: window.narrativePulseData.thirtyDayData.timeRange.dataPoints
        //     },
        //     '90 days': {
        //         dateLabels: window.narrativePulseData.ninetyDayData.timeRange.labels,
        //         dataPoints: window.narrativePulseData.ninetyDayData.timeRange.dataPoints
        //     }
        // };
        
        // Topics loaded successfully
    },
    
    // Initialize momentum view interactions
    initMomentumView: function() {
        console.log('[DEBUG] initMomentumView - START');
        console.log('[DEBUG] Current timeline:', this.currentTimeRange);
        console.log('[DEBUG] Active filter at momentum init:', this.activeFilter);
        
        // CRITICAL: Ensure no filter is active when initializing after timeline change
        // The filter should only be set by explicit user action
        if (this.activeFilter) {
            console.warn('[DEBUG] Filter active at momentum init! This should not happen. Clearing...');
            this.clearTopicFilter();
        }
        
        // CRITICAL: Clean up any existing momentum handlers first
        this.removeViewListeners('momentum');
        console.log('[DEBUG] Cleaned up old momentum handlers');
        
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
        
        // Make tooltip interactive so users can click on quotes
        tooltip.style.pointerEvents = 'auto';
        
        // Show dots and vertical line on chart hover - use chartContent instead of container
        const handleMomentumMouseEnter = () => {
            if (verticalTracker) verticalTracker.setAttribute('opacity', '0.5');
            dots.forEach(dot => dot.setAttribute('opacity', '1'));
        };
        
        const handleMomentumMouseLeave = () => {
            if (verticalTracker) verticalTracker.setAttribute('opacity', '0');
            dots.forEach(dot => {
                dot.setAttribute('opacity', '0');
                // Also reset radius to normal size
                dot.setAttribute('r', '3');
            });
            // Only hide tooltip if it wasn't opened by click
            if (!this.tooltipOpenedByClick) {
                this.hideTooltipWithDelay();
            }
        };
        
        // Handle mouse hover for visual feedback only (vertical line and dot enlargement)
        const handleMomentumHover = (e) => {
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
                
                // Map client X to SVG viewBox coordinates
                // The SVG has viewBox="0 0 800 280" so we need to map from rendered width to viewBox width
                const containerWidth = svgRect.width;
                const viewBoxWidth = 800; // From viewBox="0 0 800 280"
                let svgX = (x / containerWidth) * viewBoxWidth;
                
                // Apply offset for 90-day view with 13 data points
                // Find nearest date index based on SVG coordinates
                // Simple nearest-point detection - same as 7-day and 30-day views
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
                let nearestX = this.xPositions[nearestIndex];
                
                // Apply offset for specific dates in 90-day view to fix May 2 and May 9 hover issue
                if (this.currentTimeRange === '90 days') {
                    const dateLabel = this.dateLabels[nearestIndex] || '';
                    // Apply different offsets for each date
                    if (dateLabel === 'May 2') {
                        // May 2 needs to shift right by 8 pixels (was 5px too far left)
                        nearestX = nearestX + 8;
                    } else if (dateLabel === 'May 9') {
                        // May 9 needs only 3 pixels
                        nearestX = nearestX + 3;
                    }
                }
                
                if (verticalTracker) {
                    verticalTracker.setAttribute('x1', nearestX);
                    verticalTracker.setAttribute('x2', nearestX);
                }
                
                // Reset previously highlighted dots
                this.resetHighlightedDots();
                
                // Highlight data points at this x position
                dots.forEach(dot => {
                    const dotX = parseFloat(dot.getAttribute('cx'));
                    if (Math.abs(dotX - nearestX) < 1) {
                        dot.setAttribute('r', '5');
                        dot.setAttribute('opacity', '1');
                        // Track this dot as highlighted
                        this.highlightedDots.push(dot);
                    } else {
                        dot.setAttribute('r', '3');
                        dot.setAttribute('opacity', '0.5');
                    }
                });
                
                // Store the current hover position for click handler
                this.currentHoverIndex = nearestIndex;
                this.currentHoverX = nearestX;
                
                this.mouseMoveFrame = null;
            });
        };

        // Handle click to show tooltip (reuses hover logic for consistency)
        const handleMomentumClick = (e) => {
            // Get mouse position relative to chart container
            const containerRect = chartContainer.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            const x = e.clientX - svgRect.left;
            
            // Map client X to SVG viewBox coordinates
            const containerWidth = svgRect.width;
            const viewBoxWidth = 800; // From viewBox="0 0 800 280"
            let svgX = (x / containerWidth) * viewBoxWidth;
            
            // Find nearest date index
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
            let nearestX = this.xPositions[nearestIndex];
            
            // Apply offset for specific dates in 90-day view
            if (this.currentTimeRange === '90 days') {
                const dateLabel = this.dateLabels[nearestIndex] || '';
                if (dateLabel === 'May 2') {
                    nearestX = nearestX + 8;
                } else if (dateLabel === 'May 9') {
                    nearestX = nearestX + 3;
                }
            }
            
            // Update visual feedback (in case user clicks without hovering first)
            if (verticalTracker) {
                verticalTracker.setAttribute('x1', nearestX);
                verticalTracker.setAttribute('x2', nearestX);
            }
            
            // Reset previously highlighted dots
            this.resetHighlightedDots();
            
            // Highlight data points at this x position
            dots.forEach(dot => {
                const dotX = parseFloat(dot.getAttribute('cx'));
                if (Math.abs(dotX - nearestX) < 1) {
                    dot.setAttribute('r', '5');
                    dot.setAttribute('opacity', '1');
                    // Track this dot as highlighted
                    this.highlightedDots.push(dot);
                } else {
                    dot.setAttribute('r', '3');
                    dot.setAttribute('opacity', '0.5');
                }
            });
            
            // Show tooltip with rich content
            this.showRichTooltip(nearestIndex, e, nearestX);
        };
        
        // Add event listeners using the new management system
        // Show visual feedback on hover but only show tooltip on click
        console.log('[DEBUG] Adding momentum event handlers');
        this.addEventListener(chartContent, 'mouseenter', handleMomentumMouseEnter, 'momentum');
        console.log('[DEBUG] Added mouseenter handler');
        this.addEventListener(chartContent, 'mouseleave', handleMomentumMouseLeave, 'momentum');
        console.log('[DEBUG] Added mouseleave handler');
        this.addEventListener(chartContent, 'mousemove', handleMomentumHover, 'momentum'); // Visual feedback on hover
        console.log('[DEBUG] Added mousemove handler');
        this.addEventListener(chartContent, 'click', handleMomentumClick, 'momentum'); // Show tooltip on click
        console.log('[DEBUG] Added click handler');
        
        // Add additional listeners to the SVG element for better event capture
        this.addEventListener(svg, 'mouseleave', handleMomentumMouseLeave, 'momentum');
        
        // REMOVED: Chart lines should NOT toggle filters when clicked
        // Filters should only be toggled via legend items or dedicated filter controls
        // This was causing the filter box to appear unintentionally when clicking
        // on chart lines to view tooltips
        console.log('[DEBUG] Filter toggle handler removed from chart lines - tooltips only now');
    },
    
    // Show rich tooltip with all topic data
    showRichTooltip: function(dateIndex, mouseEvent, dataPointX) {
        console.log('[DEBUG] showRichTooltip called for timeline:', this.currentTimeRange);
        const tooltip = this.container.querySelector('#chartTooltip');
        
        // Ensure tooltip has correct classes and is clean
        tooltip.className = 'chart-tooltip chart-tooltip-momentum';
        
        const date = this.dateLabels[dateIndex];
        const currentData = this.getCurrentData();
        
        // Set flag to indicate tooltip was opened by click
        this.tooltipOpenedByClick = true;
        
        // Tooltip data ready
        
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
        
        // Build topic data from the unified structure
        const topicStats = [];
        let dailyQuote = null;
        
        // Extract data based on time range
        this.selectedTopics.forEach(topic => {
            const topicData = currentData.topics[topic];
            if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                // Calculate week-over-week change if possible
                let weekOverWeek = 0;
                if (this.currentTimeRange === '7 days' && dateIndex >= 1) {
                    const previousValue = topicData.dataPoints[dateIndex - 1];
                    if (previousValue > 0) {
                        weekOverWeek = Math.round(((topicData.dataPoints[dateIndex] - previousValue) / previousValue) * 100);
                    }
                }
                
                // Get quote from unified data if available
                let quote = null;
                if (topicData.quotes && topicData.quotes[date]) {
                    // Try to get quote for the specific date
                    quote = topicData.quotes[date];
                } else if (this.currentTimeRange !== '7 days' && topicData.quotes) {
                    // For 30/90 day views, use a sample quote from available quotes
                    const availableQuotes = Object.values(topicData.quotes).filter(q => q);
                    if (availableQuotes.length > 0) {
                        // Use a consistent quote based on the date index to avoid randomness
                        quote = availableQuotes[dateIndex % availableQuotes.length];
                    }
                }
                
                // Store the first quote we find as the daily quote
                if (!dailyQuote && quote) {
                    dailyQuote = quote;
                }
                
                topicStats.push({
                    topic: topic,
                    mentions: topicData.dataPoints[dateIndex],
                    color: topicData.color,
                    weekOverWeek: weekOverWeek,
                    quote: quote,
                    momentum: this.calculateMomentum(topicData.dataPoints)
                });
            }
        });
        
        // Sort by mentions
        topicStats.sort((a, b) => b.mentions - a.mentions);
        
        // Build tooltip HTML
        let html = `
            <div class="rich-tooltip-content">
                <div class="tooltip-date">${formattedDate}</div>
                <div class="tooltip-divider"></div>
        `;
        
        topicStats.forEach(stat => {
            const changeText = stat.weekOverWeek !== 0 ? 
                (stat.weekOverWeek > 0 ? `+${stat.weekOverWeek}%` : `${stat.weekOverWeek}%`) : 
                (stat.momentum ? stat.momentum : '');
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
                    ${stat.quote ? `<div class="topic-quote">"${stat.quote}"</div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        tooltip.innerHTML = html;
        tooltip.classList.add('visible');
        
        // Position tooltip centered over the data point
        if (dataPointX !== undefined) {
            this.updateTooltipPositionCentered(dataPointX);
        } else {
            this.updateTooltipPosition(mouseEvent);
        }
        
        // Add mouse event handlers to the tooltip
        // When mouse enters tooltip, cancel any pending hide timer
        tooltip.onmouseenter = () => {
            if (this.hideTooltipTimer) {
                clearTimeout(this.hideTooltipTimer);
                this.hideTooltipTimer = null;
            }
        };
        
        // When mouse leaves tooltip, hide it with delay
        tooltip.onmouseleave = () => {
            this.hideTooltipWithDelay();
            this.tooltipOpenedByClick = false; // Reset flag
            this.resetHighlightedDots(); // Reset dot sizes
        };
        
        // Remove any existing click-outside handler
        if (this.closeOnClickOutsideHandler) {
            document.removeEventListener('click', this.closeOnClickOutsideHandler);
            this.closeOnClickOutsideHandler = null;
        }
        
        // Add click-outside handler to close tooltip
        const closeOnClickOutside = (e) => {
            // Skip if this is the same click that opened the tooltip
            if (e === mouseEvent) {
                console.log('[DEBUG] Same click that opened tooltip, skipping...');
                return;
            }
            
            console.log('[DEBUG] closeOnClickOutside fired, target:', e.target.className);
            
            // Skip if this is a quote click - let the quote handler manage it
            if (e.target.closest('.topic-quote')) {
                console.log('[DEBUG] Quote click detected in closeOnClickOutside, skipping...');
                return;
            }
            
            // Use closest() instead of contains() to handle innerHTML DOM recreation
            if (!e.target.closest('#chartTooltip')) {
                console.log('[DEBUG] Click was outside tooltip, closing...');
                this.tooltipOpenedByClick = false; // Reset flag
                this.resetHighlightedDots(); // Reset dot sizes
                this.hideTooltipWithDelay();
                document.removeEventListener('click', closeOnClickOutside);
                this.closeOnClickOutsideHandler = null;
            } else {
                console.log('[DEBUG] Click was inside tooltip, not closing');
            }
        };
        
        // Store reference for cleanup
        this.closeOnClickOutsideHandler = closeOnClickOutside;
        
        // Add immediately, no setTimeout to avoid race conditions
        document.addEventListener('click', closeOnClickOutside);
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
            'AI Infrastructure': '#a87c68',
            'Crypto/Web3': '#68a8a8'
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
        if (!this.eventListeners[view]) {
            console.log('[DEBUG] No listeners to remove for view:', view);
            return;
        }
        
        console.log('[DEBUG] Removing', this.eventListeners[view].length, 'listeners for view:', view);
        
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
        
        // Remove click-outside handler if it exists
        if (this.closeOnClickOutsideHandler) {
            document.removeEventListener('click', this.closeOnClickOutsideHandler);
            this.closeOnClickOutsideHandler = null;
        }
        
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
    
    // Reset highlighted dots to normal size
    resetHighlightedDots: function() {
        this.highlightedDots.forEach(dot => {
            if (dot) {
                dot.setAttribute('r', '3');
                dot.setAttribute('opacity', '0');
            }
        });
        this.highlightedDots = [];
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
                this.tooltipOpenedByClick = false; // Reset flag when hiding
                // Also ensure display is hidden after transition
                setTimeout(() => {
                    if (!tooltip.classList.contains('visible')) {
                        tooltip.style.display = 'none';
                    }
                }, 200); // Match the opacity transition duration
            }
        }, 300); // Increased delay for consensus view
    },
    
    // Animate consensus cells with mosaic effect
    animateConsensusOnLoad: function() {
        const cells = this.container.querySelectorAll('.consensus-cell-group');
        
        // Animation parameters
        const baseUnitDelay = 40; // ms - controls the speed of the diagonal wave
        const maxRandomJitter = 40; // ms - controls the randomness range
        const animationDuration = 300; // ms - duration for each cell's fade/pop animation
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            // Calculate base delay for diagonal wave
            const baseDelay = (row + col) * baseUnitDelay;
            
            // Add random jitter for mosaic effect
            const randomOffset = (Math.random() - 0.5) * maxRandomJitter;
            
            // Calculate final delay (ensure non-negative)
            const finalDelay = Math.max(0, baseDelay + randomOffset);
            
            // Animate cell with transition
            setTimeout(() => {
                cell.style.transition = `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms ease-out`;
                cell.setAttribute('opacity', '1');
                cell.setAttribute('transform', '');
            }, finalDelay);
        });
        
        // Animate legend numbers (consistent with momentum view animation)
        const legendItems = this.container.querySelectorAll('.legend-item');
        legendItems.forEach((legendItem, index) => {
            const valueElement = legendItem.querySelector('.legend-value');
            if (valueElement) {
                const finalValue = valueElement.getAttribute('data-final');
                if (finalValue && finalValue !== 'N/A') {
                    const numericValue = parseInt(finalValue.replace(/[^0-9-]/g, ''));
                    const isPositive = finalValue.includes('+');
                    
                    // Same timing as momentum view for consistency
                    setTimeout(() => {
                        let currentValue = 0;
                        const duration = 1000; // Same as animateChartOnLoad
                        const frames = 30;
                        const increment = numericValue / frames;
                        const startTime = Date.now();
                        
                        function updateNumber() {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            currentValue = Math.round(numericValue * progress);
                            valueElement.textContent = `${isPositive ? '+' : ''}${currentValue}%`;
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateNumber);
                            } else {
                                valueElement.textContent = finalValue;
                            }
                        }
                        
                        requestAnimationFrame(updateNumber);
                    }, 100); // Fixed delay for all legend values to animate simultaneously
                }
            }
        });
        
        this.markAnimated('consensus');
    },
    
    // Animate volume bars on first view
    animateVolumeOnLoad: function() {
        const volumeBars = this.container.querySelectorAll('.volume-bar-rect');
        
        // Group bars by date index for cascading effect
        const barsByDate = {};
        volumeBars.forEach(bar => {
            const segment = bar.parentElement;
            const dateIndex = segment.dataset.dateIndex;
            if (!barsByDate[dateIndex]) {
                barsByDate[dateIndex] = [];
            }
            barsByDate[dateIndex].push(bar);
        });
        
        // Animate each date column with cascade effect
        Object.keys(barsByDate).sort((a, b) => parseInt(a) - parseInt(b)).forEach((dateIndex, index) => {
            const bars = barsByDate[dateIndex];
            
            setTimeout(() => {
                bars.forEach(bar => {
                    const finalHeight = bar.getAttribute('data-final-height');
                    const finalY = bar.getAttribute('data-final-y');
                    
                    // Animate both height and y position for vertical growth (optimized at 0.3s)
                    bar.style.transition = 'height 0.3s cubic-bezier(0.42, 0, 0.58, 1), y 0.3s cubic-bezier(0.42, 0, 0.58, 1)';
                    bar.setAttribute('height', finalHeight);
                    bar.setAttribute('y', finalY);
                });
            }, index * 50); // 50ms stagger between date columns
        });
        
        this.markAnimated('volume');
    },
    
    // Animate chart on page load
    animateChartOnLoad: function() {
        const paths = this.container.querySelectorAll('.topic-path');
        const legendItems = this.container.querySelectorAll('.legend-item');
        
        console.log('Animating chart with topics:', this.selectedTopics);
        console.log('Found paths:', paths.length);
        console.log('Found legend items:', legendItems.length);
        
        // Simply animate in DOM order (left to right cascade)
        paths.forEach((path, index) => {
            const parentG = path.parentElement;
            const topic = parentG.dataset.topic;
            const length = path.getTotalLength();
            
            console.log(`Animating path for topic: ${topic}, length: ${length}`);
            
            // Safety check for zero-length or malformed paths
            if (!length || length === 0) {
                console.warn(`Path for topic "${topic}" has zero length, skipping animation`);
                path.style.opacity = '1'; // Just make it visible
                return;
            }
            
            // Ensure proper initial state
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.opacity = '1'; // Make visible
            
            // Apply animation with stagger
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.42, 0, 0.58, 1)';
                path.style.strokeDashoffset = '0';
            }, index * 100);
            
            // Legend items use the actual topic name, not kebab-case
            console.log(`Looking for legend item with data-topic="${topic}"`);
            
            const legendItem = Array.from(legendItems).find(legendEl => 
                legendEl.getAttribute('data-topic') === topic
            );
            
            if (legendItem) {
                console.log(`Found legend item for ${topic}`);
                const valueElement = legendItem.querySelector('.legend-value');
                if (valueElement) {
                    // Get final value from data attribute
                    const finalValue = valueElement.getAttribute('data-final') || valueElement.textContent;
                    console.log(`Animating legend value for ${topic}: ${finalValue}`);
                    const numericValue = parseInt(finalValue.replace(/[^0-9-]/g, ''));
                    const isPositive = finalValue.includes('+');
                    const finalText = finalValue;
                    
                    // Start counting animation when this line starts drawing
                    setTimeout(() => {
                        let currentValue = 0;
                        const duration = 1000; // 1 second
                        const frames = 30;
                        const increment = numericValue / frames;
                        const frameTime = duration / frames;
                        
                        const countInterval = setInterval(() => {
                            currentValue += increment;
                            
                            // Check if animation is complete (handles both positive and negative)
                            const isComplete = numericValue >= 0 ? 
                                currentValue >= numericValue : 
                                currentValue <= numericValue;
                            
                            if (isComplete) {
                                currentValue = numericValue;
                                valueElement.textContent = finalText; // Use exact final value
                                clearInterval(countInterval);
                            } else {
                                // Format the text based on whether it's positive or negative
                                const displayValue = Math.round(currentValue);
                                if (displayValue > 0) {
                                    valueElement.textContent = '+' + displayValue + '%';
                                } else {
                                    valueElement.textContent = displayValue + '%';
                                }
                            }
                        }, frameTime);
                    }, 100); // Fixed delay for all legend values to animate simultaneously
                } else {
                    console.warn(`No value element found in legend item for ${topic}`);
                }
            } else {
                console.warn(`No legend item found for topic "${topic}" with key "${legendKey}"`);
                // Log all available legend items for debugging
                console.log('Available legend items:', Array.from(legendItems).map(el => el.getAttribute('data-topic')));
            }
        });
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
        const saved = localStorage.getItem('narrativePulse_selectedTopics');
        if (saved) {
            try {
                const savedTopics = JSON.parse(saved);
                // Validate saved topics exist in available topics
                this.selectedTopics = savedTopics.filter(topic => 
                    this.availableTopics.includes(topic)
                );
            } catch (e) {
                console.error('Failed to parse saved topics:', e);
            }
        }
        
        // If no saved topics or no valid topics, select first maxTopics from available
        if (this.selectedTopics.length === 0 && this.availableTopics.length > 0) {
            this.selectedTopics = [...this.availableTopics].slice(0, this.maxTopics);
        }
    },
    
    saveSelectedTopics: function() {
        localStorage.setItem('narrativePulse_selectedTopics', JSON.stringify(this.selectedTopics));
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
        if (!topicList) {
            console.error('Topic list element not found');
            return;
        }
        topicList.innerHTML = '';
        
        // Store the initial selected topics for comparison
        this.tempSelectedTopics = [...this.selectedTopics];
        
        // Generate topic stats dynamically from current data
        const topicStats = {};
        const currentData = this.getCurrentData();
        // Rendering topic list
        
        // Build stats from the actual data
        this.availableTopics.forEach(topic => {
            const topicData = currentData.topics[topic];
            if (topicData) {
                topicStats[topic] = {
                    momentum: this.calculateMomentum(topicData.dataPoints),
                    mentions: topicData.mentions || topicData.weekTotal || 
                             (topicData.dataPoints ? topicData.dataPoints.reduce((a, b) => a + b, 0) : 0)
                };
            } else {
                // Fallback for missing topics
                topicStats[topic] = { momentum: '0%', mentions: 0 };
            }
        });
        
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
        // Debug logging
        console.log('Applying topic selection:');
        console.log('- Previous topics:', this.selectedTopics);
        console.log('- New topics:', this.tempSelectedTopics);
        
        // Update selected topics with the temporary selection
        this.selectedTopics = [...this.tempSelectedTopics];
        this.saveSelectedTopics();
        
        console.log('- Saved topics:', this.selectedTopics);
        
        // Update chart
        this.updateChartWithNewTopics();
        
        // Close panel
        this.closeCustomizationPanel();
        
        // Show toast notification
        this.showToast('Topics updated');
    },
    
    updateChartWithNewTopics: function() {
        console.log('Updating chart with new topics');
        console.log('Current view:', this.currentView);
        console.log('Selected topics:', this.selectedTopics);
        
        // Clean up existing event handlers before recreating views
        this.cleanupViewEventHandlers();
        
        // Reset animation state to allow animations to run for new topics
        // Clear the current view/time combination so animations can run again
        const currentKey = `${this.currentView}-${this.currentTimeRange}`;
        this.animatedCombinations.delete(currentKey);
        
        // Recalculate X positions (critical for chart rendering)
        this.calculateXPositions();
        
        // Update the legend
        this.updateLegend();
        
        // Get current view from the active button
        const viewBtns = this.container.querySelectorAll('.view-toggle-btn');
        let activeView = 'momentum';
        viewBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeView = btn.dataset.view;
            }
        });
        
        console.log('Active view:', activeView);
        
        // Recreate the current view with new topics
        if (activeView === 'momentum') {
            this.createMomentumView();
            // Reattach event listeners for momentum view
            setTimeout(() => {
                this.initMomentumView();
                // Trigger animation for new topics
                if (!this.hasAnimated('momentum')) {
                    this.animateChartOnLoad();
                    this.markAnimated('momentum');
                }
            }, 100);
        } else if (activeView === 'volume') {
            this.createVolumeView();
            // Volume view handles events inline, trigger animation
            setTimeout(() => {
                if (!this.hasAnimated('volume')) {
                    this.animateVolumeOnLoad();
                    this.markAnimated('volume');
                }
            }, 100);
        } else {
            this.createConsensusView();
            // Consensus view handles events inline, trigger animation
            setTimeout(() => {
                if (!this.hasAnimated('consensus')) {
                    this.animateConsensusOnLoad();
                    this.markAnimated('consensus');
                }
            }, 100);
        }
    },
    
    // Clean up view-specific event handlers
    cleanupViewEventHandlers: function() {
        console.log('[DEBUG] cleanupViewEventHandlers called');
        console.log('[DEBUG] Current view:', this.currentView);
        console.log('[DEBUG] Active filter before cleanup:', this.activeFilter);
        
        // Remove all event listeners for the current view
        if (this.currentView) {
            console.log('[DEBUG] Removing listeners for view:', this.currentView);
            this.removeViewListeners(this.currentView);
        }
        
        // Cancel any pending animation frames
        if (this.mouseMoveFrame) {
            console.log('[DEBUG] Cancelling animation frame');
            cancelAnimationFrame(this.mouseMoveFrame);
            this.mouseMoveFrame = null;
        }
        
        // Clear any hide tooltip timers
        if (this.hideTooltipTimer) {
            console.log('[DEBUG] Clearing hide tooltip timer');
            clearTimeout(this.hideTooltipTimer);
            this.hideTooltipTimer = null;
        }
        
        // Reset view-specific state
        console.log('[DEBUG] Resetting view-specific state');
        this.currentHoveredDate = null;
        this.activeFilter = null;
        window.activeFilter = null; // Also clear global filter
        
        // Hide the filter indicator
        const filterIndicator = this.container.querySelector('#filterActive');
        if (filterIndicator) {
            console.log('[DEBUG] Hiding filter indicator');
            filterIndicator.classList.remove('show');
        }
        
        // Clear filter topic text
        const filterTopicSpan = this.container.querySelector('#filterTopic');
        if (filterTopicSpan) {
            filterTopicSpan.textContent = '';
        }
        
        // Reset tooltip completely
        console.log('[DEBUG] Resetting tooltip');
        this.resetTooltip();
        
        // Remove any duplicate tooltips
        const allTooltips = document.querySelectorAll('#chartTooltip');
        console.log('[DEBUG] Found', allTooltips.length, 'tooltip elements');
        if (allTooltips.length > 1) {
            console.warn('[DEBUG] Multiple tooltips detected! Removing extras...');
            for (let i = 1; i < allTooltips.length; i++) {
                allTooltips[i].remove();
            }
        }
        
        console.log('[DEBUG] cleanupViewEventHandlers complete');
        
        // Clear chart content
        const chartContent = this.container?.querySelector('#chartContent');
        if (chartContent) {
            chartContent.innerHTML = '';
        }
    },
    
    // Calculate consensus percentage point change for a topic
    calculateConsensusChange: function(topicName) {
        const currentData = this.getCurrentData();
        const topicData = currentData.topics[topicName];
        
        if (!topicData || !topicData.consensus || topicData.consensus.length < 2) {
            return null;
        }
        
        // Consensus is already an array of percentages [65, 68, 72, ...]
        const firstValue = topicData.consensus[0];
        const lastValue = topicData.consensus[topicData.consensus.length - 1];
        
        // Calculate percentage point change
        // Example: 84% - 65% = +19 percentage points
        return lastValue - firstValue;
    },

    updateLegend: function() {
        const legend = this.container.querySelector('.pulse-legend');
        
        // Get current active view
        const viewBtns = this.container.querySelectorAll('.view-toggle-btn');
        let activeView = 'momentum';
        viewBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeView = btn.dataset.view;
            }
        });
        
        // Get data from unified source
        const unifiedTopics = window.unifiedData?.narrativePulse?.topics || {};
        
        // Use currently selected topics dynamically
        const topicsToShow = this.selectedTopics.map(topicName => ({
            name: topicName,
            key: this.getTopicKey(topicName),
            unifiedKey: topicName
        }));
        
        legend.innerHTML = '';
        console.log('Creating legend for topics:', topicsToShow);
        
        topicsToShow.forEach(topic => {
            const topicData = unifiedTopics[topic.unifiedKey];
            if (!topicData) {
                console.warn(`No data found for topic: ${topic.unifiedKey}`);
                return;
            }
            console.log(`Creating legend item for ${topic.name} with key ${topic.key}`);
            
            let displayValue, finalValue, valueColor;
            
            // Check if we're in consensus view
            if (activeView === 'consensus') {
                // Calculate consensus percentage point change
                const consensusChange = this.calculateConsensusChange(topic.unifiedKey);
                
                if (consensusChange !== null) {
                    // Format as percentage point change
                    const rounded = Math.round(consensusChange);
                    finalValue = `${rounded >= 0 ? '+' : ''}${rounded}%`;
                    
                    // Check if first view for animation (same pattern as momentum view)
                    const isFirstView = this.currentView === 'consensus' && !this.hasAnimated('consensus');
                    displayValue = isFirstView ? (rounded >= 0 ? '+0%' : '0%') : finalValue;
                    
                    // Use red color for negative changes
                    valueColor = rounded >= 0 ? topicData.color : '#c77d7d';
                } else {
                    // No consensus data available
                    displayValue = 'N/A';
                    finalValue = 'N/A';
                    valueColor = '#9ca3af';
                }
            } else {
                // Use momentum values for Momentum and Volume views
                let momentum = '+0%';
                if (this.currentTimeRange === '7 days') {
                    momentum = topicData.momentum || topicData.weeklyChange || '+0%';
                } else if (this.currentTimeRange === '30 days') {
                    momentum = topicData.chartData?.['30d']?.momentum?.weeklyGrowth || '+0%';
                } else if (this.currentTimeRange === '90 days') {
                    momentum = topicData.chartData?.['90d']?.momentum?.quarterlyGrowth || '+0%';
                }
                
                finalValue = momentum;
                valueColor = topicData.color;
                
                // Check if this view+time combination has been animated
                const isFirstView = this.currentView === 'momentum' && !this.hasAnimated('momentum');
                displayValue = isFirstView ? (momentum.includes('+') ? '+0%' : '0%') : momentum;
            }
            
            const item = document.createElement('div');
            item.className = 'legend-item';
            // Use the actual topic name, not the kebab-case key, to match paths
            item.setAttribute('data-topic', topic.name);
            // Add data-has-clickable attribute for unified hover effect
            item.setAttribute('data-has-clickable', 'true');
            console.log(`Creating legend item with data-topic="${topic.name}"`);
            
            // Make both legend-label and legend-value clickable for drill-down
            item.innerHTML = `
                <span class="legend-dot" style="background: ${topicData.color};"></span>
                <span class="legend-label" 
                      data-topic="${topic.name}"
                      role="button"
                      tabindex="0"
                      title="Click for details">
                    ${topic.name}
                </span>
                <span class="legend-value" 
                      style="color: ${valueColor};" 
                      data-final="${finalValue}"
                      data-topic="${topic.name}"
                      role="button"
                      tabindex="0"
                      title="Click for details">
                    ${displayValue}
                </span>
            `;
            
            // Legend items no longer have hover handlers
            // Tooltips are now triggered by clicking on the chart
            
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
    
};

// Export for use
window.NarrativePulse = NarrativePulse;

// Add global event delegation for quote clicks
// This runs immediately when the script loads, not waiting for init
console.log('[DEBUG] Adding global quote click handler');
document.addEventListener('click', (e) => {
    console.log('[DEBUG] Document click detected on:', e.target.className || e.target.tagName);
    const quote = e.target.closest('#chartTooltip .topic-quote');
    if (quote) {
        console.log('[DEBUG] Quote click handler fired!');
        e.preventDefault();
        e.stopPropagation();
        
        // Get random priority briefing to open
        const briefings = window.unifiedData?.priorityBriefings?.items || [];
        console.log('[DEBUG] Found', briefings.length, 'briefings');
        if (briefings.length > 0) {
            const randomBriefing = briefings[Math.floor(Math.random() * briefings.length)];
            console.log('[DEBUG] Opening briefing:', randomBriefing.id);
            
            // Open episode panel
            if (window.episodePanelV2?.open) {
                window.episodePanelV2.open(randomBriefing.id);
            } else if (window.openEpisodePanel) {
                window.openEpisodePanel(randomBriefing.id);
            }
            
            // Hide tooltip - use NarrativePulse instance
            if (window.NarrativePulse && window.NarrativePulse.resetTooltip) {
                window.NarrativePulse.resetTooltip();
            }
        }
    }
});