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
    dateLabels: ['Oct 22', 'Oct 29', 'Nov 5', 'Nov 12', 'Nov 19'],
    xPositions: [], // Will be calculated in init
    hideTooltipTimer: null,
    
    // Rich data for tooltips
    topicDataByDate: {
        'Oct 22': {
            'AI Agents': { mentions: 79, weekOverWeek: 0, change: 0, podcasts: ['20VC', 'All-In'], quote: 'AI will eat software' },
            'Capital Efficiency': { mentions: 76, weekOverWeek: 0, change: 0, podcasts: ['Acquired'], quote: 'Do more with less' },
            'DePIN': { mentions: 11, weekOverWeek: 0, change: 0, podcasts: ['Bankless'], quote: 'Infrastructure revolution' },
            'B2B SaaS': { mentions: 40, weekOverWeek: 0, change: 0, podcasts: ['SaaStr'], quote: 'Enterprise is back' }
        },
        'Oct 29': {
            'AI Agents': { mentions: 105, weekOverWeek: 33, change: 26, podcasts: ['20VC', 'Invest Like Best'], quote: 'Agents are the new apps' },
            'Capital Efficiency': { mentions: 82, weekOverWeek: 8, change: 6, podcasts: ['This Week in Startups'], quote: 'Efficiency is the new growth' },
            'DePIN': { mentions: 34, weekOverWeek: 209, change: 23, podcasts: ['Bankless', 'All-In'], quote: 'DePIN summer is here' },
            'B2B SaaS': { mentions: 41, weekOverWeek: 3, change: 1, podcasts: ['SaaStr'], quote: 'Steady as she goes' }
        },
        'Nov 5': {
            'AI Agents': { mentions: 128, weekOverWeek: 22, change: 23, podcasts: ['All-In', 'a16z Podcast'], quote: 'Vertical AI dominance inevitable' },
            'Capital Efficiency': { mentions: 87, weekOverWeek: 6, change: 5, podcasts: ['20VC'], quote: 'Capital discipline wins' },
            'DePIN': { mentions: 89, weekOverWeek: 162, change: 55, podcasts: ['Bankless', 'Unchained'], quote: 'Physical meets digital' },
            'B2B SaaS': { mentions: 42, weekOverWeek: 2, change: 1, podcasts: ['SaaStr', 'Invest Like Best'], quote: 'SaaS is mature' }
        },
        'Nov 12': {
            'AI Agents': { mentions: 142, weekOverWeek: 11, change: 14, podcasts: ['20VC', 'All-In', 'Invest Like Best'], quote: 'Every company needs agents' },
            'Capital Efficiency': { mentions: 88, weekOverWeek: 1, change: 1, podcasts: ['Acquired', 'a16z Podcast'], quote: 'New reality for 2024 fundraising' },
            'DePIN': { mentions: 156, weekOverWeek: 75, change: 67, podcasts: ['Bankless', 'All-In'], quote: 'Infrastructure gold rush' },
            'B2B SaaS': { mentions: 43, weekOverWeek: 2, change: 1, podcasts: ['SaaStr'], quote: 'Focus on fundamentals' }
        },
        'Nov 19': {
            'AI Agents': { mentions: 147, weekOverWeek: 4, change: 5, podcasts: ['20VC', 'All-In', 'Invest Like Best'], quote: 'Agents everywhere' },
            'Capital Efficiency': { mentions: 89, weekOverWeek: 1, change: 1, podcasts: ['Acquired', 'Bankless', 'a16z Podcast'], quote: 'Sustainable growth matters' },
            'DePIN': { mentions: 201, weekOverWeek: 29, change: 45, podcasts: ['Bankless', 'Unchained'], quote: 'DePIN eating the world' },
            'B2B SaaS': { mentions: 43, weekOverWeek: 0, change: 0, podcasts: ['SaaStr', 'Invest Like Best'], quote: 'Consolidation phase' }
        }
    },
    
    // Initialize the component
    init: function(containerElement) {
        this.container = containerElement;
        
        // Calculate consistent x-positions for 5 data points
        const drawableWidth = this.chartWidth - (2 * this.padding);
        const sectionWidth = drawableWidth / 4; // 4 sections between 5 points
        this.xPositions = this.dateLabels.map((_, i) => {
            return this.padding + (sectionWidth * i);
        });
        
        this.bindEvents();
        this.createMomentumView(); // Create the momentum view with all elements
        this.initMomentumView(); // Initialize interactions
        
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
    
    // Toggle View Mode
    toggleView: function() {
        const viewText = this.container.querySelector('#viewText');
        const current = viewText.textContent;
        
        if (current === 'Momentum') {
            viewText.textContent = 'Volume';
            this.createVolumeView();
        } else if (current === 'Volume') {
            viewText.textContent = 'Consensus';
            this.createConsensusView();
        } else {
            viewText.textContent = 'Momentum';
            this.createMomentumView(); // Create momentum view dynamically
        }
    },
    
    // Create Volume View
    createVolumeView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        
        // Calculate bar positions to align with grid
        const topics = [
            { name: 'AI Agents', mentions: 147, color: '#4a7c59' },
            { name: 'Capital Eff.', mentions: 89, color: '#f4a261' },
            { name: 'DePIN', mentions: 201, color: '#5a6c8c' },
            { name: 'B2B SaaS', mentions: 43, color: '#c77d7d' }
        ];
        
        const barWidth = 80;
        const maxHeight = 160;
        const baseY = 220;
        const yAxisX = 35; // X position for Y-axis labels
        
        chartContent.innerHTML = `
            <!-- Horizontal grid lines for Y-axis -->
            <line x1="${this.padding}" y1="60" x2="${this.chartWidth - this.padding}" y2="60" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="100" x2="${this.chartWidth - this.padding}" y2="100" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="140" x2="${this.chartWidth - this.padding}" y2="140" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="180" x2="${this.chartWidth - this.padding}" y2="180" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
            <line x1="${this.padding}" y1="220" x2="${this.chartWidth - this.padding}" y2="220" stroke="#e5e7eb" stroke-width="1"/>
            
            <!-- Y-axis labels -->
            <text x="${yAxisX}" y="64" fill="#9ca3af" font-size="10" text-anchor="end">200</text>
            <text x="${yAxisX}" y="104" fill="#9ca3af" font-size="10" text-anchor="end">150</text>
            <text x="${yAxisX}" y="144" fill="#9ca3af" font-size="10" text-anchor="end">100</text>
            <text x="${yAxisX}" y="184" fill="#9ca3af" font-size="10" text-anchor="end">50</text>
            <text x="${yAxisX}" y="224" fill="#9ca3af" font-size="10" text-anchor="end">0</text>
            
            <!-- Volume bars -->
            ${topics.map((topic, i) => {
                const barHeight = (topic.mentions / 200) * maxHeight;
                const x = 100 + i * 150; // Fixed spacing for bars
                const y = baseY - barHeight;
                
                return `<g class="volume-bar fade-in" data-topic="${topic.name}">
                    <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                          fill="${topic.color}" opacity="0.8" rx="4"/>
                    <text x="${x + barWidth/2}" y="${y - 8}" fill="${topic.color}" 
                          font-size="14" font-weight="600" text-anchor="middle">${topic.mentions}</text>
                    <text x="${x + barWidth/2}" y="238" fill="#6b7280" font-size="11" 
                          text-anchor="middle">${topic.name}</text>
                </g>`;
            }).join('')}
            
            <!-- Y-axis label -->
            <text x="15" y="140" fill="#6b7280" font-size="10" text-anchor="middle" transform="rotate(-90 15 140)">Volume</text>
            
            <!-- Date range context - moved up closer to topic labels -->
            <text x="${this.chartWidth / 2}" y="265" fill="#9ca3af" font-size="10" text-anchor="middle">${this.dateLabels[0]} - ${this.dateLabels[4]}</text>
        `;
        
        // Initialize volume interactions
        this.initVolumeInteractions();
    },
    
    // Initialize volume interactions
    initVolumeInteractions: function() {
        const bars = this.container.querySelectorAll('.volume-bar');
        const tooltip = this.container.querySelector('#chartTooltip');
        
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                const topic = bar.dataset.topic;
                const data = window.topics[topic];
                
                tooltip.innerHTML = `${topic}: ${data.mentions} mentions across ${data.episodes} episodes`;
                tooltip.classList.add('visible');
                this.updateTooltipPosition(e);
            });

            bar.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });

            bar.addEventListener('mousemove', (e) => {
                if (tooltip.classList.contains('visible')) {
                    this.updateTooltipPosition(e);
                }
            });
        });
    },
    
    // Create Consensus View  
    createConsensusView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const topicNames = ['AI Agents', 'Capital Efficiency', 'DePIN', 'B2B SaaS'];
        const consensusLevels = [
            [0.8, 0.6, 0.9, 0.7, 0.85],
            [0.5, 0.6, 0.7, 0.8, 0.85],
            [0.3, 0.5, 0.7, 0.75, 0.9],
            [0.4, 0.4, 0.3, 0.3, 0.3]
        ];
        const labels = [
            ['Building', 'Moderate', 'Strong', 'Strong', 'Strong'],
            ['Moderate', 'Moderate', 'Strong', 'Strong', 'Strong'],
            ['Weak', 'Moderate', 'Strong', 'Peak', 'Peak'],
            ['Weak', 'Weak', 'Weak', 'Weak', 'Weak']
        ];
        const colors = ['#4a7c59', '#f4a261', '#5a6c8c', '#c77d7d'];

        let html = `<!-- Grid lines -->${this.createGridLines()}`;
        
        // Calculate cell width based on x-positions
        const cellWidth = (this.xPositions[1] - this.xPositions[0]) - 10; // 10px gap between cells
        
        topicNames.forEach((topic, i) => {
            html += `<g class="consensus-row fade-in-slow" data-topic="${topic}">`;
            consensusLevels[i].forEach((level, j) => {
                const x = this.xPositions[j] - (cellWidth / 2);
                const y = 50 + i * 50;
                const color = colors[i];
                html += `
                    <rect class="consensus-cell" x="${x}" y="${y}" width="${cellWidth}" height="40" 
                          fill="${color}" opacity="${level}" rx="4" 
                          data-date="${this.dateLabels[j]}" data-level="${labels[i][j]}" data-percent="${Math.round(level * 100)}"/>
                `;
                if (labels[i][j] !== 'Weak') {
                    html += `<text x="${this.xPositions[j]}" y="${y + 25}" fill="white" font-size="11" text-anchor="middle">${labels[i][j]}</text>`;
                }
            });
            html += '</g>';
        });
        
        chartContent.innerHTML = html + `
            <!-- Date labels -->
            ${this.createDateLabels(true)}
        `;
    },
    
    // Update tooltip position
    updateTooltipPosition: function(e) {
        const chartContainer = this.container.querySelector('.chart-container');
        const tooltip = this.container.querySelector('#chartTooltip');
        const rect = chartContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let tooltipX = x + 10;
        let tooltipY = y - 30;

        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        if (tooltipX + tooltipWidth > rect.width - 20) {
            tooltipX = x - tooltipWidth - 10;
        }

        if (tooltipY < 10) {
            tooltipY = y + 20;
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
        
        // Update paths to use consistent x-positions
        const paths = [
            { topic: "AI Agents", momentum: "+85%", color: "#4a7c59", yStart: 180, yEnd: 40 },
            { topic: "Capital Efficiency", momentum: "+17%", color: "#f4a261", yStart: 195, yEnd: 145 },
            { topic: "DePIN", momentum: "+190%", color: "#5a6c8c", yStart: 210, yEnd: 65 },
            { topic: "B2B SaaS", momentum: "+3%", color: "#c77d7d", yStart: 150, yEnd: 165 }
        ];
        
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
                
                return `<g class="topic-line" data-topic="${p.topic}" data-momentum="${p.momentum}" data-color="${p.color}">
                    <path d="${pathData}" 
                          fill="none" stroke="${p.color}" stroke-width="3" class="topic-path animate-path"/>
                    <!-- Static dots at data points -->
                    ${this.xPositions.map((x, i) => `
                        <circle cx="${x}" cy="${yPositions[i]}" r="3" fill="${p.color}" 
                                class="data-point-dot" opacity="0" data-topic="${p.topic}"/>
                    `).join('')}
                </g>`;
            }).join('')}
            
            <!-- Vertical tracking line (hidden by default) -->
            <line id="verticalTracker" x1="0" y1="40" x2="0" y2="220" 
                  stroke="#6b7280" stroke-width="1" opacity="0" stroke-dasharray="4,4"/>
            
            <!-- Date labels -->
            ${this.createDateLabels(true)}
        `;
        
        // Re-initialize momentum view interactions
        this.initMomentumView();
    },
    
    // Initialize momentum view interactions
    initMomentumView: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const tooltip = this.container.querySelector('#chartTooltip');
        const verticalTracker = this.container.querySelector('#verticalTracker');
        const chartContainer = this.container.querySelector('.chart-container');
        const dots = this.container.querySelectorAll('.data-point-dot');
        
        // Show dots and vertical line on chart hover
        chartContainer.addEventListener('mouseenter', () => {
            dots.forEach(dot => dot.setAttribute('opacity', '1'));
            verticalTracker.setAttribute('opacity', '0.5');
        });
        
        chartContainer.addEventListener('mouseleave', () => {
            dots.forEach(dot => dot.setAttribute('opacity', '0'));
            verticalTracker.setAttribute('opacity', '0');
            this.hideTooltipWithDelay();
        });
        
        // Track mouse movement for vertical line and tooltip
        chartContainer.addEventListener('mousemove', (e) => {
            const rect = chartContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            // Find nearest date index
            let nearestIndex = 0;
            let minDistance = Math.abs(x - this.xPositions[0]);
            
            for (let i = 1; i < this.xPositions.length; i++) {
                const distance = Math.abs(x - this.xPositions[i]);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestIndex = i;
                }
            }
            
            // Update vertical line position
            const nearestX = this.xPositions[nearestIndex];
            verticalTracker.setAttribute('x1', nearestX);
            verticalTracker.setAttribute('x2', nearestX);
            
            // Show tooltip with rich content
            this.showRichTooltip(nearestIndex, e);
        });
        
        // Handle click for filtering
        const topicLines = this.container.querySelectorAll('.topic-line');
        topicLines.forEach(line => {
            line.addEventListener('click', () => {
                const topic = line.dataset.topic;
                if (this.activeFilter === topic || window.activeFilter === topic) {
                    this.clearTopicFilter();
                } else {
                    this.setTopicFilter(topic);
                }
            });
        });
    },
    
    // Show rich tooltip with all topic data
    showRichTooltip: function(dateIndex, mouseEvent) {
        const tooltip = this.container.querySelector('#chartTooltip');
        const date = this.dateLabels[dateIndex];
        const dateData = this.topicDataByDate[date];
        
        // Clear hide timer
        if (this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
            this.hideTooltipTimer = null;
        }
        
        // Format date nicely
        const [month, day] = date.split(' ');
        const formattedDate = `${month} ${day}, 2024`;
        
        // Get all topics sorted by mentions
        const topics = Object.entries(dateData)
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
            const sources = data.podcasts.slice(0, 2).join(', ');
            
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
    
    // Hide tooltip with delay
    hideTooltipWithDelay: function() {
        this.hideTooltipTimer = setTimeout(() => {
            const tooltip = this.container.querySelector('#chartTooltip');
            tooltip.classList.remove('visible');
        }, 100);
    }
};

// Export for use
window.NarrativePulse = NarrativePulse;