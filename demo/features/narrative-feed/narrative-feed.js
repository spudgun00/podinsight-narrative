const NarrativeFeed = {
    expandedEntries: new Set(),
    
    init: function(container) {
        this.container = container;
        this.bindEvents();
        this.render();
    },
    
    bindEvents: function() {
        this.container.addEventListener('click', (e) => {
            // Handle quote clicks - link to random briefing card
            const quote = e.target.closest('.expansion-quote');
            if (quote) {
                e.preventDefault();
                e.stopPropagation();
                this.handleQuoteClick();
                return;
            }
            
            // Handle feed entry expansion
            const header = e.target.closest('.feed-entry-header');
            if (header) {
                this.toggleFeedEntry(header.closest('.feed-entry'));
                return;
            }
            
            // Handle action buttons
            const actionLink = e.target.closest('.feed-action-link');
            if (actionLink) {
                e.preventDefault();
                const action = actionLink.dataset.action;
                const itemId = actionLink.dataset.itemId;
                this.handleAction(action, itemId);
            }
        });
    },
    
    handleQuoteClick: function() {
        // Get random priority briefing to open (same logic as tooltip quotes)
        const briefings = window.unifiedData?.priorityBriefings?.items || [];
        if (briefings.length > 0) {
            const randomBriefing = briefings[Math.floor(Math.random() * briefings.length)];
            
            // Open episode panel
            if (window.episodePanelV2 && window.episodePanelV2.open) {
                window.episodePanelV2.open(randomBriefing.id);
            } else if (window.openEpisodePanel) {
                window.openEpisodePanel(randomBriefing.id);
            }
        }
    },
    
    handleAction: function(action, itemId) {
        // Placeholder actions - replace with actual functionality
        switch(action) {
            case 'email':
                console.log(`Email summary for item ${itemId}`);
                // TODO: Implement email functionality
                alert('Email summary functionality coming soon');
                break;
            case 'share':
                console.log(`Share item ${itemId}`);
                // TODO: Implement share functionality
                alert('Share functionality coming soon');
                break;
        }
    },
    
    toggleFeedEntry: function(entry) {
        entry.classList.toggle('expanded');
        
        // Close other entries
        const allEntries = this.container.querySelectorAll('.feed-entry');
        allEntries.forEach(e => {
            if (e !== entry && e.classList.contains('expanded')) {
                e.classList.remove('expanded');
            }
        });
    },
    
    getCategoryClass: function(category) {
        const categoryMap = {
            'consensus': 'consensus',
            'divergence': 'divergence',
            'trend': 'trend',
            'lp-intel': 'lp-intel',
            'pattern': 'pattern'
        };
        return categoryMap[category] || 'pattern';
    },
    
    renderFeedEntry: function(item) {
        const categoryClass = this.getCategoryClass(item.category);
        
        let expansionContent = '';
        
        // Build expansion content based on the category
        if (item.expansion) {
            expansionContent = '<div class="feed-expansion-inner">';
            
            // Render sources for consensus/trend/pattern
            if (item.expansion.sources) {
                expansionContent += '<div class="expansion-section">';
                expansionContent += '<div class="expansion-section-title">Sources Reaching Consensus</div>';
                
                item.expansion.sources.forEach(source => {
                    expansionContent += `
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${source.name}</span>
                                <span class="expansion-source-time">(${source.time})</span>
                            </div>
                            <div class="expansion-quote">"${source.quote}"</div>
                        </div>
                    `;
                });
                
                expansionContent += '</div>';
            }
            
            // Render contrarian/dissent section
            if (item.expansion.dissent) {
                expansionContent += `
                    <div class="expansion-section expansion-dissent">
                        <div class="expansion-section-title">Dissenting Voice</div>
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${item.expansion.dissent.name}</span>
                                <span class="expansion-source-time">(${item.expansion.dissent.time})</span>
                            </div>
                            <div class="expansion-quote">"${item.expansion.dissent.quote}"</div>
                        </div>
                    </div>
                `;
            }
            
            // Render contrarian position for divergence
            if (item.expansion.contrarian) {
                expansionContent += `
                    <div class="expansion-section">
                        <div class="expansion-section-title">Contrarian Position</div>
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${item.expansion.contrarian.name}</span>
                                <span class="expansion-source-time">(${item.expansion.contrarian.time})</span>
                            </div>
                            <div class="expansion-quote">"${item.expansion.contrarian.quote}"</div>
                        </div>
                    </div>
                `;
            }
            
            // Render mainstream consensus
            if (item.expansion.mainstream) {
                expansionContent += '<div class="expansion-section">';
                expansionContent += '<div class="expansion-section-title">Mainstream Consensus</div>';
                
                item.expansion.mainstream.forEach(source => {
                    expansionContent += `
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${source.name}</span>
                                <span class="expansion-source-time">(${source.time})</span>
                            </div>
                            <div class="expansion-quote">"${source.quote}"</div>
                        </div>
                    `;
                });
                
                expansionContent += '</div>';
            }
            
            // Render pattern details
            if (item.expansion.pattern) {
                expansionContent += '<div class="expansion-section">';
                expansionContent += '<div class="expansion-section-title">Pattern Emerging Across Shows</div>';
                
                item.expansion.pattern.forEach(source => {
                    expansionContent += `
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${source.name}</span>
                                <span class="expansion-source-time">(${source.time})</span>
                            </div>
                            <div class="expansion-quote">"${source.quote}"</div>
                        </div>
                    `;
                });
                
                expansionContent += '</div>';
            }
            
            // Render momentum indicator
            if (item.expansion.momentum) {
                expansionContent += `
                    <div class="expansion-section">
                        <div class="expansion-section-title">Momentum Indicator</div>
                        <p style="font-size: 0.813rem; color: var(--gray-600);">${item.expansion.momentum}</p>
                    </div>
                `;
            }
            
            // Render LP indicators
            if (item.expansion.indicators) {
                expansionContent += '<div class="expansion-section">';
                expansionContent += '<div class="expansion-section-title">LP Sentiment Indicators</div>';
                
                item.expansion.indicators.forEach(indicator => {
                    expansionContent += `
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${indicator.name}</span>
                                <span class="expansion-source-time">(${indicator.time})</span>
                            </div>
                            <div class="expansion-quote">"${indicator.quote}"</div>
                        </div>
                    `;
                });
                
                expansionContent += '</div>';
            }
            
            // Render impact
            if (item.expansion.impact) {
                expansionContent += `
                    <div class="expansion-section">
                        <div class="expansion-section-title">Impact on Fundraising</div>
                        <p style="font-size: 0.813rem; color: var(--gray-600);">${item.expansion.impact}</p>
                    </div>
                `;
            }
            
            // Render validation details
            if (item.expansion.validation) {
                expansionContent += '<div class="expansion-section">';
                expansionContent += '<div class="expansion-section-title">Converging Thesis Validation</div>';
                
                item.expansion.validation.forEach(source => {
                    expansionContent += `
                        <div class="expansion-source">
                            <div class="expansion-source-header">
                                <span class="expansion-source-name">${source.name}</span>
                                <span class="expansion-source-time">(${source.time})</span>
                            </div>
                            <div class="expansion-quote">"${source.quote}"</div>
                        </div>
                    `;
                });
                
                expansionContent += '</div>';
            }
            
            // Render implications
            if (item.expansion.implications) {
                expansionContent += `
                    <div class="expansion-section">
                        <div class="expansion-section-title">Investment Implications</div>
                        <p style="font-size: 0.813rem; color: var(--gray-600);">${item.expansion.implications}</p>
                    </div>
                `;
            }
            
            // Action buttons - Share and Email (matching Weekly Intelligence Brief)
            expansionContent += `
                <div class="feed-action-separator"></div>
                <div class="feed-action-buttons">
                    <a href="#" class="feed-action-link" title="Share" data-action="share" data-item-id="${item.id}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z" stroke-width="2"/>
                            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke-width="2"/>
                        </svg>
                        <span>Share</span>
                    </a>
                    <span class="feed-action-divider">|</span>
                    <a href="#" class="feed-action-link" title="Email" data-action="email" data-item-id="${item.id}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="4" width="20" height="16" rx="2" stroke-width="2"/>
                            <path d="M22 7l-10 5L2 7" stroke-width="2"/>
                        </svg>
                        <span>Email</span>
                    </a>
                </div>
            `;
            expansionContent += '</div>';
        }
        
        return `
            <div class="feed-entry" data-id="${item.id}">
                <div class="feed-entry-header" data-action="toggleEntry">
                    <span class="feed-time">${item.time}</span>
                    <span class="feed-event">${item.event}</span>
                    <span class="feed-category ${categoryClass}">${this.formatCategory(item.category)}</span>
                </div>
                <div class="feed-entry-content">
                    ${expansionContent}
                </div>
            </div>
        `;
    },
    
    formatCategory: function(category) {
        const categoryLabels = {
            'consensus': 'Consensus',
            'divergence': 'Divergence',
            'trend': 'Trend',
            'lp-intel': 'LP Intel',
            'pattern': 'Pattern'
        };
        return categoryLabels[category] || category;
    },
    
    render: function() {
        // Clear existing content (except header)
        const feedContainer = this.container.querySelector('.feed-container');
        if (!feedContainer) {
            console.error('Feed container not found');
            return;
        }
        
        // Get data from unified data source
        const feedData = window.unifiedData?.narrativeFeed?.items || [];
        
        if (feedData.length === 0) {
            feedContainer.innerHTML = '<p class="no-data-message">No feed items available</p>';
            return;
        }
        
        // Render all feed items
        feedContainer.innerHTML = feedData.map(item => this.renderFeedEntry(item)).join('');
    }
};

window.NarrativeFeed = NarrativeFeed;