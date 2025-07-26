const NotableSignals = {
    init: function(container) {
        this.container = container;
        this.bindEvents();
        this.setupPanelData();
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
            'market-narratives': 'Narrative Evolution',
            'thesis-validation': 'Tracking Topics',
            'notable-deals': 'Protocol Developments',
            'portfolio-mentions': 'Protocol Mentions',
            'lp-sentiment': 'Whale Sentiment'
        };
        
        const subtitles = {
            'market-narratives': 'Emerging crypto narratives and consensus shifts',
            'thesis-validation': 'Topics you\'re tracking this week',
            'notable-deals': 'Protocol launches, updates, and developments',
            'portfolio-mentions': 'Protocol intelligence and competitive landscape',
            'lp-sentiment': 'Whale activity and market sentiment'
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
                { trend: 'Privacy coins resurgence', count: 5, source: 'Monero Talk, Privacy pods', insight: 'New narrative around financial privacy, not just anonymity. Regulatory arbitrage emerging.' }
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
                    keywords: ['Treasury burns', 'Protocol sustainability', 'Whale movements'],
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
                { company: 'EigenLayer', details: '$100M raise at $1.5B valuation', insight: 'Restaking narrative validated by a16z leading round' },
                { company: 'Celestia', details: '$55M strategic round', insight: 'Modular thesis attracting Bain Capital. TradFi entering infrastructure plays.' },
                { company: 'LayerZero', details: '$120M at $3B valuation', insight: 'Cross-chain infrastructure seeing massive premiums. Interoperability is the new hot sector.' }
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
                    <div class="empty-state-title">PROTOCOL MENTIONS</div>
                    <div class="empty-state-subtitle">Protocol tracking intelligence</div>
                    
                    <div class="empty-state-message">
                        <div class="empty-state-status">No protocols configured</div>
                        
                        <div class="empty-state-benefits">
                            <div class="benefit-text">Track your protocols to:</div>
                            <ul class="benefit-list">
                                <li>Monitor mentions across all podcasts</li>
                                <li>Track competitive landscape</li>
                                <li>Get sentiment analysis</li>
                            </ul>
                        </div>
                        
                        <a href="#" class="configure-portfolio-link" data-action="open-portfolio">
                            → Configure Protocols
                        </a>
                    </div>
                </div>
            `;
        } else if (signalType === 'lp-sentiment') {
            const shifts = [
                { trend: 'Whale accumulation patterns', source: 'On-chain analysis discussions', impact: 'Smart money accumulating ETH, rotating out of memes' },
                { trend: 'Institutional adoption accelerating', source: 'TradFi integration podcasts', impact: 'BlackRock alone bringing $10B+ this quarter' },
                { trend: 'Staking yields sustainable', source: 'DeFi yield discussions', impact: 'Real yield narrative validated, ponzinomics era ending' }
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