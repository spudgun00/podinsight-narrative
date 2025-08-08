const NotableSignals = {
    init: function(container) {
        this.container = container;
        this.bindEvents();
        this.setupPanelData();
        this.renderSignalCards();
    },
    
    // Calculate confidence based on signal type and data
    calculateConfidence: function(signalType, index, totalCount) {
        // Get data from unified source
        const data = window.unifiedData;
        
        switch(signalType) {
            case 'market-narratives':
                // Based on narrative count relative to max
                const narratives = data.notableSignals.panelData['market-narratives'];
                if (!narratives || narratives.length === 0) return 0.75;
                const maxCount = Math.max(...narratives.map(n => n.count || 0));
                const currentCount = narratives[0]?.count || 0;
                return currentCount / maxCount;
                
            case 'thesis-validation':
                // Based on validation status
                return 0.80; // High confidence for tracked topics
                
            case 'notable-deals':
                // Based on deal size/significance (position in list)
                return Math.max(0.75 - (index * 0.15), 0.25);
                
            case 'portfolio-mentions':
                // Low confidence when no companies configured
                return 0.0;
                
            case 'lp-sentiment':
                // Medium confidence for sentiment shifts
                return 0.50;
                
            default:
                return 0.60;
        }
    },
    
    // Render signal cards from unified data
    renderSignalCards: function() {
        const signalTypes = [
            { type: 'market-narratives', label: 'Market Narratives', icon: 'trending' },
            { type: 'thesis-validation', label: 'Tracking Topics', icon: 'check' },
            { type: 'notable-deals', label: 'Notable Deals', icon: 'briefcase' },
            { type: 'portfolio-mentions', label: 'Portfolio Mentions', icon: 'folder' },
            { type: 'lp-sentiment', label: 'LP Sentiment', icon: 'users' }
        ];
        
        const data = window.unifiedData;
        const counts = data.notableSignals.counts;
        
        signalTypes.forEach((signal, index) => {
            const card = this.container.querySelector(`[data-signal-type="${signal.type}"]`);
            if (!card) return;
            
            // Update insight text based on data
            const insightEl = card.querySelector('.signal-insight');
            const labelEl = card.querySelector('.signal-label');
            
            switch(signal.type) {
                case 'market-narratives':
                    insightEl.textContent = counts.marketNarratives.count + ' narrative shifts detected';
                    labelEl.textContent = counts.marketNarratives.trending;
                    break;
                case 'thesis-validation':
                    insightEl.textContent = counts.thesisValidation.count + ' themes reaching consensus';
                    labelEl.textContent = counts.thesisValidation.trending;
                    break;
                case 'notable-deals':
                    insightEl.textContent = counts.notableDeals.label;
                    labelEl.textContent = counts.notableDeals.trending;
                    break;
                case 'portfolio-mentions':
                    // Use backup data for portfolio if available
                    const portfolioData = window.backupData?.portfolio || data.portfolio || { companies: [] };
                    insightEl.textContent = portfolioData.companies?.length > 0 ? 
                        counts.portfolioMentions.count + ' mentions detected' : 
                        'No companies configured';
                    labelEl.textContent = portfolioData.companies?.length > 0 ?
                        counts.portfolioMentions.trending :
                        'Add to track mentions';
                    break;
                case 'lp-sentiment':
                    insightEl.textContent = counts.lpSentiment.label;
                    labelEl.textContent = counts.lpSentiment.trending;
                    break;
            }
            
            // Calculate and render confidence bar
            const confidence = this.calculateConfidence(signal.type, index, signalTypes.length);
            this.renderConfidenceBar(card, confidence);
        });
    },
    
    // Render confidence bar for a card
    renderConfidenceBar: function(card, confidence) {
        const strengthContainer = card.querySelector('.signal-strength');
        if (!strengthContainer) return;
        
        // Convert confidence (0-1) to percentage and blocks
        const percentage = Math.round(confidence * 100);
        const filledBlocks = Math.round(confidence * 4);
        const filled = '█'.repeat(filledBlocks);
        const unfilled = '░'.repeat(4 - filledBlocks);
        
        // Create confidence bar
        const confidenceBar = document.createElement('div');
        confidenceBar.className = 'confidence-bar';
        confidenceBar.innerHTML = `Confidence: <span class="confidence-blocks">${filled}${unfilled}</span> ${percentage}%`;
        
        // Replace existing content
        strengthContainer.innerHTML = '';
        strengthContainer.appendChild(confidenceBar);
    },
    
    bindEvents: function() {
        // Card clicks
        this.container.addEventListener('click', (e) => {
            const card = e.target.closest('.signal-card');
            if (card) {
                const type = card.dataset.signalType;
                const strength = card.dataset.strength;
                const insight = card.querySelector('.signal-insight').textContent;
                this.openSignalPanel(type, insight, strength);
            }
            
            // Close buttons
            if (e.target.closest('.panel-close') || 
                e.target.classList.contains('panel-backdrop')) {
                this.closeSignalPanel();
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSignalPanel();
            }
        });
        
        // Configure Portfolio link handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.configure-portfolio-link')) {
                e.preventDefault();
                // Close the signal panel first
                this.closeSignalPanel();
                
                // Wait for panel to close, then scroll and open portfolio
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Wait for scroll to complete, then open portfolio panel
                    setTimeout(() => {
                        if (window.portfolioManager && window.portfolioManager.openPanel) {
                            window.portfolioManager.openPanel();
                        } else {
                            console.error('Portfolio Manager not available');
                        }
                    }, 600);
                }, 300);
            }
        });
        
        // AI Search Pointer handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ai-search-pointer')) {
                e.preventDefault();
                // Close the signal panel first
                this.closeSignalPanel();
                
                // Wait for panel to close, then scroll and focus search
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Wait for scroll to complete, then focus search input
                    setTimeout(() => {
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) {
                            searchInput.focus();
                            searchInput.select();
                        } else {
                            console.error('Search input not found');
                        }
                    }, 600);
                }, 300);
            }
        });
    },
    
    openSignalPanel: function(signalType, insight, strength) {
        const panel = document.getElementById('signalDetailPanel');
        const backdrop = document.querySelector('.panel-backdrop');
        const titleEl = document.getElementById('panelTitle');
        const subtitleEl = document.getElementById('panelSubtitle');
        const contentEl = document.getElementById('panelContent');
        
        // Check if elements exist
        if (!panel || !backdrop || !titleEl || !subtitleEl || !contentEl) {
            console.error('Panel elements not found:', {
                panel: !!panel,
                backdrop: !!backdrop,
                titleEl: !!titleEl,
                subtitleEl: !!subtitleEl,
                contentEl: !!contentEl
            });
            return;
        }
        
        // Set title based on signal type
        const titles = {
            'market-narratives': 'Market Narratives',
            'thesis-validation': 'Tracking Topics',
            'notable-deals': 'Notable Deals',
            'portfolio-mentions': 'Portfolio Mentions',
            'lp-sentiment': 'LP Sentiment'
        };
        
        const subtitles = {
            'market-narratives': 'Dominant themes and narrative shifts',
            'thesis-validation': 'Topics you\'re tracking this week',
            'notable-deals': 'Key funding rounds with notable structures',
            'portfolio-mentions': 'Portfolio company intelligence and threats',
            'lp-sentiment': 'Limited partner mood and requirements'
        };
        
        titleEl.textContent = titles[signalType];
        subtitleEl.textContent = subtitles[signalType];
        
        // Generate content based on signal type
        let content = '<div class="signal-items-list">';
        
        if (signalType === 'market-narratives') {
            const narratives = [
                { trend: 'Growth → Efficiency shift', count: 23, source: 'Multiple podcasts', insight: 'LPs are driving this narrative hard. Every major fund is adjusting their pitch.' },
                { trend: 'Apps → Infrastructure shift', count: 17, source: '20VC, All-In, Invest Like Best', insight: 'The picks-and-shovels thesis is winning. Application layer seeing valuation compression.' },
                { trend: 'Remote → Hybrid shift', count: 12, source: 'Various founder interviews', insight: 'Even YC companies are requiring 3 days in office. Culture concerns driving reversal.' },
                { trend: 'B2C skepticism trend', count: 8, source: 'Benchmark, Lightspeed pods', insight: 'Consumer acquisition costs making B2C uninvestable unless viral growth proven.' },
                { trend: 'DevTools consolidation prediction', count: 6, source: 'Developer tea, TWIG', insight: 'Too many point solutions. Platformization wave coming in next 18 months.' },
                { trend: 'Climate tech resurgence', count: 5, source: 'Khosla, Breakthrough pods', insight: 'New narrative around adaptation tech, not just mitigation. Defense angle emerging.' }
            ];
            
            narratives.forEach(item => {
                content += `
                    <div class="signal-item">
                        <div class="signal-item-header">
                            <div class="signal-item-title">${item.trend}</div>
                            <div class="signal-item-meta">
                                <span class="signal-item-count">${item.count} mentions</span>
                            </div>
                        </div>
                        <div class="signal-item-source">${item.source}</div>
                        <div class="signal-item-insight">${item.insight}</div>
                    </div>
                `;
            });
        } else if (signalType === 'thesis-validation') {
            const topics = [
                {
                    name: 'DePIN',
                    momentum: 300,
                    mentions: 32,
                    episodes: 8,
                    keywords: ['Decentralized infrastructure', 'Physical mining', 'Token incentives'],
                    context: 'Monday surge after funding rumor'
                },
                {
                    name: 'AI Infrastructure',
                    momentum: 140,
                    mentions: 52,
                    episodes: 12,
                    keywords: ['Picks and shovels', 'GPU economics', 'Foundation layer'],
                    context: 'Peak coverage Wed - everyone wants exposure'
                },
                {
                    name: 'AI Agents',
                    momentum: 100,
                    mentions: 35,
                    episodes: 9,
                    keywords: ['Agent infrastructure', 'Autonomous systems', 'Use cases'],
                    context: '20VC deep dive Tuesday drove discussion'
                },
                {
                    name: 'Crypto/Web3',
                    momentum: 67,
                    mentions: 26,
                    episodes: 7,
                    keywords: ['Base ecosystem', 'Regulatory clarity', 'Infrastructure ready'],
                    context: 'Steady coverage from crypto-native shows'
                },
                {
                    name: 'Capital Efficiency',
                    momentum: 0,
                    mentions: 15,
                    episodes: 5,
                    keywords: ['Burn rates', 'Path to profitability', 'LP pressure'],
                    context: 'Consistent but not growing - new baseline'
                }
            ];
            
            content += '<div class="tracked-topics-header">YOUR TOPICS:</div>';
            
            topics.forEach(topic => {
                const momentumColor = topic.momentum >= 100 ? 'var(--sage)' : 
                                    topic.momentum > 0 ? 'var(--amber-glow)' : 
                                    'var(--gray-600)';
                
                content += `
                    <div class="signal-item tracked-topic">
                        <div class="topic-header">
                            <span class="topic-name">${topic.name}</span>
                            <span class="topic-momentum" style="color: ${momentumColor};">
                                ${topic.momentum > 0 ? '↑' : ''}${topic.momentum}% MOMENTUM
                            </span>
                        </div>
                        <div class="topic-stats">${topic.mentions} mentions across ${topic.episodes} episodes</div>
                        <div class="topic-keywords">
                            ${topic.keywords.map(k => `"${k}"`).join(' • ')}
                        </div>
                        <div class="topic-context">${topic.context}</div>
                    </div>
                `;
            });
        } else if (signalType === 'notable-deals') {
            const deals = [
                { company: 'Perplexity', details: 'Series B at $10B valuation', insight: 'Deal structure trends emerging in competitive rounds*' },
                { company: 'Anthropic*', details: 'Series D at $40B', insight: 'Google deepening partnership. Strategic investors winning over pure financial.' },
                { company: 'Cursor*', details: 'Series A at $400M', insight: 'Developer tools with AI seeing 10x valuation premiums. Metrics don\'t matter yet.' }
            ];
            
            deals.forEach(item => {
                content += `
                    <div class="signal-item">
                        <div class="signal-item-header">
                            <div class="signal-item-title">${item.company}</div>
                        </div>
                        <div class="signal-item-source">${item.details}</div>
                        <div class="signal-item-insight">${item.insight}</div>
                    </div>
                `;
            });
        } else if (signalType === 'portfolio-mentions') {
            content += `
                <div class="portfolio-empty-state">
                    <div class="empty-state-title">PORTFOLIO MENTIONS</div>
                    <div class="empty-state-subtitle">Portfolio company intelligence</div>
                    
                    <div class="empty-state-message">
                        <div class="empty-state-status">No companies configured</div>
                        
                        <div class="empty-state-benefits">
                            <div class="benefit-text">Add your portfolio companies to:</div>
                            <ul class="benefit-list">
                                <li>Track mentions across all podcasts</li>
                                <li>Monitor competitive landscape</li>
                                <li>Get sentiment analysis</li>
                            </ul>
                        </div>
                        
                        <a href="#" class="configure-portfolio-link" data-action="open-portfolio">
                            → Configure Portfolio
                        </a>
                    </div>
                </div>
            `;
        } else if (signalType === 'lp-sentiment') {
            const shifts = [
                { trend: 'LP DPI focus trend', source: 'CalPERS on Institutional Investor pod', impact: 'First-time funds facing 18+ month raises' },
                { trend: 'Vintage year discussions', source: 'Multiple endowment discussions', impact: '2021-2022 vintages being written down aggressively' },
                { trend: 'Co-invest demand increasing', source: 'Sovereign wealth discussions', impact: 'LPs want more direct exposure, less blind pool risk' }
            ];
            
            shifts.forEach(item => {
                content += `
                    <div class="signal-item">
                        <div class="signal-item-header">
                            <div class="signal-item-title">${item.trend}</div>
                        </div>
                        <div class="signal-item-source">${item.source}</div>
                        <div class="signal-item-insight">${item.impact}</div>
                    </div>
                `;
            });
        }
        
        content += '</div>';
        contentEl.innerHTML = content;
        
        // Show panel and backdrop
        panel.classList.add('open');
        backdrop.classList.add('visible');
    },
    
    closeSignalPanel: function() {
        const panel = document.getElementById('signalDetailPanel');
        const backdrop = document.querySelector('.panel-backdrop');
        
        panel.classList.remove('open');
        backdrop.classList.remove('visible');
    },
    
    setupPanelData: function() {
        // Future: Could move all panel data here for easier management
    }
};

window.NotableSignals = NotableSignals;