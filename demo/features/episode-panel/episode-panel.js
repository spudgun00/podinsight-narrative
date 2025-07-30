// Episode Panel - Slide-out detail view for episodes
const EpisodePanel = {
    container: null,
    backdrop: null,
    isOpen: false,
    
    init: function() {
        // Create panel HTML structure
        this.createPanelStructure();
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Initialize close handlers
        this.initCloseHandlers();
    },
    
    createPanelStructure: function() {
        // Create backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'episode-panel-backdrop';
        this.backdrop.style.display = 'none';
        
        // Create panel container
        this.container = document.createElement('div');
        this.container.className = 'episode-panel-container';
        this.container.innerHTML = `
            <!-- Panel Header -->
            <div class="panel-header">
                <div class="header-top">
                    <div class="podcast-info">
                        <div class="podcast-logo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 12L12 8L16 12M8 16L12 12L16 16" stroke-width="2.5"/>
                            </svg>
                        </div>
                        <div class="podcast-details">
                            <h3>Loading...</h3>
                            <div class="podcast-meta">
                                <span class="panel-time-ago">--</span> • 
                                <span class="panel-duration">--</span> • 
                                <span class="influence-score">--</span>
                            </div>
                        </div>
                    </div>
                    <button class="close-button" aria-label="Close panel">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 1L13 13M13 1L1 13"/>
                        </svg>
                    </button>
                </div>
                <h1 class="episode-title">Loading...</h1>
                <p class="episode-guest">Loading...</p>
            </div>

            <!-- Panel Content -->
            <div class="panel-content">
                <!-- Episode Intelligence -->
                <div class="intelligence-section">
                    <h2 class="section-header">Episode Intelligence</h2>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--deep-ink);">The Facts</h3>
                        <ul class="key-points panel-facts">
                            <!-- Dynamic facts -->
                        </ul>
                    </div>

                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--deep-ink);">The Context</h3>
                        <ul class="key-points panel-context">
                            <!-- Dynamic context -->
                        </ul>
                    </div>
                </div>

                <!-- Market Signals -->
                <div class="intelligence-section">
                    <h2 class="section-header">Market Signals</h2>
                    <div class="market-signals-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <!-- Dynamic market signals -->
                    </div>
                </div>

                <!-- Pattern Recognition -->
                <div class="intelligence-section">
                    <h2 class="section-header">Pattern Recognition</h2>
                    <div class="pattern-grid">
                        <!-- Dynamic pattern cards -->
                    </div>
                </div>

                <!-- Notable Mentions -->
                <div class="intelligence-section">
                    <h2 class="section-header">Notable Mentions</h2>
                    <div class="mentions-empty">
                        <p>⚠️ No portfolio companies detected in this episode</p>
                        <span class="add-portfolio-hint">[+ Add your portfolio companies to get alerts]</span>
                    </div>
                </div>

                <!-- Essential Quote -->
                <div class="quote-section">
                    <h2 class="section-header" style="margin-bottom: 1rem;">Essential Quote</h2>
                    <div class="quote-text">"Loading..."</div>
                    <div class="quote-attribution">
                        <span class="quote-author">- Loading</span>
                        <div class="quote-actions">
                            <button class="quote-action" onclick="EpisodePanel.copyQuote()">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <rect x="3" y="3" width="6" height="6" rx="1"/>
                                    <path d="M5 1H9a1 1 0 011 1v4"/>
                                </svg>
                                Copy
                            </button>
                            <button class="quote-action audio-button" onclick="EpisodePanel.toggleAudioPlayback(this)">
                                <svg class="play-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="6" cy="6" r="5"/>
                                    <path d="M5 4l3 2-3 2V4z" fill="currentColor" stroke="none"/>
                                </svg>
                                <svg class="pause-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" style="display: none;">
                                    <circle cx="6" cy="6" r="5"/>
                                    <rect x="4" y="4" width="1.5" height="4" fill="currentColor" stroke="none"/>
                                    <rect x="6.5" y="4" width="1.5" height="4" fill="currentColor" stroke="none"/>
                                </svg>
                                <span class="audio-text">Play clip (0:18)</span>
                            </button>
                        </div>
                    </div>
                    <!-- Audio Progress Bar -->
                    <div class="audio-progress-container" style="display: none; margin-top: 0.75rem;">
                        <div class="audio-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="18">
                            <div class="audio-progress-fill"></div>
                        </div>
                    </div>
                </div>

                <!-- Related Episodes -->
                <div class="intelligence-section">
                    <h2 class="section-header">Related Episodes</h2>
                    <div class="related-episodes">
                        <!-- Dynamic related episodes -->
                    </div>
                </div>
            </div>

            <!-- Action Bar -->
            <div class="action-bar">
                <button class="action-button primary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M7 1v8m0 0l-3-3m3 3l3-3"/>
                        <path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1"/>
                    </svg>
                    Download PDF
                </button>
                <button class="action-button secondary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="1" y="3" width="12" height="8" rx="1"/>
                        <path d="M1 4l6 3 6-3"/>
                    </svg>
                    Email
                </button>
                <button class="action-button tertiary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="2" cy="10" r="1.5"/>
                        <circle cx="12" cy="10" r="1.5"/>
                        <circle cx="7" cy="3" r="1.5"/>
                        <path d="M7 4.5v3M7 7.5l-5 2.5M7 7.5l5 2.5"/>
                    </svg>
                    Share
                </button>
                <button class="action-button tertiary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="7" cy="7" r="6"/>
                        <path d="M5.5 4.5v5l4-2.5z" fill="currentColor" stroke="none"/>
                    </svg>
                    Play
                </button>
                <button class="action-button tertiary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="2" width="10" height="10" rx="1"/>
                        <path d="M4 5h6M4 7h6M4 9h4"/>
                    </svg>
                    Read
                </button>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.container);
    },
    
    attachEventListeners: function() {
        // Listen for clicks on entire episode cards or "View Full Brief" buttons
        document.addEventListener('click', (e) => {
            // Check if click is on episode card or any of its children
            const episodeCard = e.target.closest('.episode-card');
            if (!episodeCard) return;
            
            // Check if this card is in Priority Briefings section
            const priorityBriefings = episodeCard.closest('.priority-briefings-container');
            if (!priorityBriefings) return;
            
            // Prevent opening panel twice if clicking on links within the card
            const clickedLink = e.target.closest('a');
            if (clickedLink && !clickedLink.classList.contains('episode-action')) {
                // Allow other links to work normally
                return;
            }
            
            e.preventDefault();
            this.openPanel(episodeCard);
        });
    },
    
    initCloseHandlers: function() {
        // Close button
        const closeBtn = this.container.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }
        
        // Backdrop click
        this.backdrop.addEventListener('click', () => this.closePanel());
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
    },
    
    openPanel: function(episodeCard) {
        // Extract data from episode card
        const data = this.extractEpisodeData(episodeCard);
        
        // Populate panel content
        this.populatePanel(data);
        
        // Show backdrop
        this.backdrop.style.display = 'block';
        requestAnimationFrame(() => {
            this.backdrop.classList.add('active');
        });
        
        // Show and animate panel
        this.container.classList.add('active');
        
        // Add class to body for any necessary styling
        document.body.classList.add('panel-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Set focus to close button for accessibility
        const closeBtn = this.container.querySelector('.close-button');
        if (closeBtn) closeBtn.focus();
        
        this.isOpen = true;
    },
    
    closePanel: function() {
        // Hide panel with animation
        this.container.classList.remove('active');
        this.backdrop.classList.remove('active');
        
        // Remove class from body to restore normal layout
        document.body.classList.remove('panel-open');
        
        // Wait for animation to complete
        setTimeout(() => {
            this.backdrop.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        
        this.isOpen = false;
    },
    
    extractEpisodeData: function(card) {
        // Extract data from the episode card HTML
        const podcastName = card.querySelector('.podcast-name')?.textContent || 'Unknown Podcast';
        const episodeTime = card.querySelector('.episode-time')?.textContent || '';
        const episodeTitle = card.querySelector('.episode-title')?.textContent || 'Unknown Episode';
        const episodeGuest = card.querySelector('.episode-guest')?.textContent || '';
        const insights = Array.from(card.querySelectorAll('.insight-list li')).map(li => li.textContent);
        const signals = Array.from(card.querySelectorAll('.signal-tag')).map(tag => tag.textContent);
        const priorityType = card.classList.contains('priority-critical') ? 'critical' : 
                           card.classList.contains('priority-opportunity') ? 'opportunity' : 'elevated';
        
        return {
            podcastName,
            episodeTime,
            episodeTitle,
            episodeGuest,
            insights,
            signals,
            priorityType
        };
    },
    
    populatePanel: function(data) {
        // Populate header
        this.container.querySelector('.podcast-details h3').textContent = data.podcastName;
        this.container.querySelector('.episode-title').textContent = data.episodeTitle;
        this.container.querySelector('.episode-guest').textContent = data.episodeGuest;
        
        // Update podcast logo with actual image
        const podcastLogo = this.container.querySelector('.podcast-logo');
        const podcastImages = {
            '20VC with Harry Stebbings': 'images/20vc.jpeg',
            '20VC': 'images/20vc.jpeg',
            'Invest Like the Best': 'images/investlikethebest.jpeg',
            'Acquired': 'images/acquired.jpeg',
            'This Week in Startups': 'images/theweekinstartups.jpeg',
            'Indie Hackers': 'images/indiehackers.png',
            'The Tim Ferriss Show': 'images/timf.jpeg',
            'Stratechery': 'images/stratechery.jpeg',
            'The Knowledge Project': 'images/knowledgeproject.webp',
            'BG2': 'images/bg2.png'
        };
        
        const imagePath = podcastImages[data.podcastName];
        if (imagePath) {
            podcastLogo.innerHTML = `<img src="${imagePath}" alt="${data.podcastName} logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }
        
        // Parse episode time
        const timeParts = data.episodeTime.split('•').map(s => s.trim());
        if (timeParts[0]) this.container.querySelector('.panel-time-ago').textContent = timeParts[0];
        if (timeParts[1]) this.container.querySelector('.panel-duration').textContent = timeParts[1];
        if (timeParts[2]) this.container.querySelector('.influence-score').textContent = timeParts[2];
        
        // Populate facts
        const factsList = this.container.querySelector('.panel-facts');
        const facts = this.generateFacts(data);
        factsList.innerHTML = facts.map(fact => `<li>${fact}</li>`).join('');
        
        // Generate dynamic content based on episode type
        this.generateDynamicContent(data);
    },
    
    generateDynamicContent: function(data) {
        // Generate context
        const contextList = this.container.querySelector('.panel-context');
        const context = this.generateContext(data);
        contextList.innerHTML = context.map(ctx => `<li>${ctx}</li>`).join('');
        
        // Generate market signals
        const signalsContainer = this.container.querySelector('.market-signals-container');
        const signals = this.generateMarketSignals(data);
        signalsContainer.innerHTML = signals.map(signal => `
            <div style="padding: 1rem; background: ${signal.background}; border-left: 3px solid ${signal.borderColor}; border-radius: 6px;">
                <h4 style="font-size: 0.875rem; font-weight: 600; color: ${signal.titleColor}; margin-bottom: 0.5rem;">${signal.icon} ${signal.title}</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem; color: var(--deep-ink);">
                    ${signal.items.map(item => `<li style="margin-bottom: 0.25rem;">• ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        
        // Generate pattern recognition
        const patterns = this.generatePatterns(data);
        const patternGrid = this.container.querySelector('.pattern-grid');
        patternGrid.innerHTML = patterns.map(p => `
            <div class="pattern-card">
                <div class="pattern-number">${p.number}</div>
                <div class="pattern-label">${p.label}</div>
            </div>
        `).join('');
        
        // Note: Takeaways section has been removed - no longer generating prescriptive advice
        
        // Generate quote
        const quote = this.generateQuote(data);
        this.container.querySelector('.quote-text').textContent = `"${quote.text}"`;
        this.container.querySelector('.quote-author').textContent = `- ${quote.author}`;
        
        // Generate related episodes
        const related = this.generateRelatedEpisodes(data);
        const relatedContainer = this.container.querySelector('.related-episodes');
        relatedContainer.innerHTML = related.map(r => `
            <div class="related-episode">
                <div class="related-title">${r.title}</div>
                <div class="related-note">${r.note}</div>
            </div>
        `).join('');
    },
    
    generateFacts: function(data) {
        // Convert insights to objective facts
        return data.insights.map(insight => {
            // Remove prescriptive language and make more factual
            return insight
                .replace(/should|must|need to/gi, '')
                .replace(/^\s*/, '');
        });
    },
    
    generateContext: function(data) {
        // Generate market context based on episode content
        const hasAI = data.episodeTitle.toLowerCase().includes('ai') || 
                     data.insights.some(i => i.toLowerCase().includes('ai'));
        const hasValuation = data.insights.some(i => i.toLowerCase().includes('valuation'));
        
        const context = [];
        if (hasAI) {
            context.push('AI investment thesis shifting from horizontal platforms to vertical applications');
            context.push('Proprietary data becoming primary differentiator in AI deals');
        }
        if (hasValuation) {
            context.push('Valuation metrics normalizing after 18-month correction cycle');
            context.push('Market establishing new baseline multiples across all stages');
        }
        context.push('Multiple sources confirming similar market observations this week');
        context.push('Pattern consistent with broader industry consolidation trends');
        
        return context;
    },
    
    generateMarketSignals: function(data) {
        // Generate market signals based on episode theme
        const signals = [
            {
                title: 'MOMENTUM',
                icon: '📈',
                background: 'var(--light-sage)',
                borderColor: 'var(--sage)',
                titleColor: 'var(--sage)',
                items: [
                    'Vertical AI applications with domain expertise',
                    'Capital efficiency metrics over growth at all costs',
                    'Structured liquidation preferences in hot deals'
                ]
            },
            {
                title: 'EMERGING',
                icon: '⚡',
                background: '#fef3e2',
                borderColor: 'var(--amber-glow)',
                titleColor: '#d97706',
                items: [
                    'AI infrastructure consolidation plays',
                    'Retention-based valuation models',
                    'Cross-border AI regulatory arbitrage'
                ]
            },
            {
                title: 'DECLINING',
                icon: '📉',
                background: 'var(--light-rose)',
                borderColor: 'var(--dusty-rose)',
                titleColor: '#b91c1c',
                items: [
                    'Horizontal AI platforms without differentiation',
                    'Growth-at-all-costs narratives',
                    'Clean term sheets at premium valuations'
                ]
            }
        ];
        
        return signals;
    },
    
    generatePatterns: function(data) {
        // Generate pattern recognition based on episode type
        const patterns = [];
        if (data.priorityType === 'critical') {
            patterns.push(
                { number: '4th', label: 'Major investor this week with similar thesis' },
                { number: '87%', label: 'Of discussions now include this theme' }
            );
        } else {
            patterns.push(
                { number: '12+', label: 'Sources confirming this market trend' },
                { number: '3x', label: 'Increase in related deal activity' }
            );
        }
        patterns.push(
            { number: '15', label: 'Portfolio companies potentially impacted' },
            { number: '2nd', label: 'Time this guest has discussed this topic' }
        );
        return patterns;
    },
    
    
    generateQuote: function(data) {
        // Generate a contextual quote based on episode theme
        const quotes = {
            ai: {
                text: "Vertical AI with proprietary data is the biggest market that doesn't exist yet.",
                author: `${data.episodeGuest.replace('Guest: ', '')} @ 24:31`
            },
            saas: {
                text: "The old playbook is dead.",
                author: `${data.episodeGuest.replace('Guest: ', '')} @ 18:45`
            },
            default: {
                text: "Pattern recognition beats prediction every time.",
                author: `${data.episodeGuest.replace('Guest: ', '')} @ 32:10`
            }
        };
        
        if (data.episodeTitle.toLowerCase().includes('ai')) return quotes.ai;
        if (data.episodeTitle.toLowerCase().includes('saas')) return quotes.saas;
        return quotes.default;
    },
    
    generateRelatedEpisodes: function(data) {
        // Generate contextually relevant related episodes
        return [
            {
                title: 'Stratechery: The State of SaaS',
                note: 'Relevant: Confirms 2-3x retention metrics across 15 SaaS companies'
            },
            {
                title: 'All-In: Market Dynamics Shifting',
                note: 'Relevant: Opposing thesis - different take on same data'
            },
            {
                title: 'Acquired: Deep Dive on Valuations',
                note: 'Relevant: Historical precedent for current 20-30x multiples'
            }
        ];
    },
    
    copyQuote: function() {
        const quoteText = this.container.querySelector('.quote-text').textContent;
        const quoteAuthor = this.container.querySelector('.quote-author').textContent;
        const fullQuote = `${quoteText}\n${quoteAuthor}`;
        
        navigator.clipboard.writeText(fullQuote).then(() => {
            // Visual feedback
            const copyBtn = this.container.querySelector('.quote-action');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6l2 2 4-4"/></svg> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    },
    
    // Audio playback state
    currentPlaybackTimer: null,
    progressInterval: null,
    
    toggleAudioPlayback: function(button) {
        const isPlaying = button.classList.contains('playing');
        const progressContainer = button.closest('.quote-section').querySelector('.audio-progress-container');
        const progressBar = progressContainer.querySelector('.audio-progress-bar');
        const progressFill = progressContainer.querySelector('.audio-progress-fill');
        const audioText = button.querySelector('.audio-text');
        
        if (isPlaying) {
            // Stop playback
            this.stopPlayback(button, progressContainer, progressFill, audioText);
        } else {
            // Start playback
            this.startPlayback(button, progressContainer, progressBar, progressFill, audioText);
        }
    },

    startPlayback: function(button, progressContainer, progressBar, progressFill, audioText) {
        // Clear any existing timers
        if (this.currentPlaybackTimer) clearTimeout(this.currentPlaybackTimer);
        if (this.progressInterval) clearInterval(this.progressInterval);
        
        // Update UI
        button.classList.add('playing');
        progressContainer.style.display = 'block';
        audioText.textContent = 'Pause';
        
        // Reset progress
        progressFill.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
        
        // Animate progress over 18 seconds
        const duration = 18000; // 18 seconds
        const updateInterval = 100; // Update every 100ms
        let elapsed = 0;
        
        this.progressInterval = setInterval(() => {
            elapsed += updateInterval;
            const progress = Math.min((elapsed / duration) * 100, 100);
            const seconds = Math.min(elapsed / 1000, 18);
            
            progressFill.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', Math.round(seconds));
            
            if (elapsed >= duration) {
                this.stopPlayback(button, progressContainer, progressFill, audioText);
            }
        }, updateInterval);
        
        // Set timeout as backup to stop after 18 seconds
        this.currentPlaybackTimer = setTimeout(() => {
            this.stopPlayback(button, progressContainer, progressFill, audioText);
        }, duration);
    },

    stopPlayback: function(button, progressContainer, progressFill, audioText) {
        // Clear timers
        if (this.currentPlaybackTimer) {
            clearTimeout(this.currentPlaybackTimer);
            this.currentPlaybackTimer = null;
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // Update UI
        button.classList.remove('playing');
        audioText.textContent = 'Play clip (0:18)';
        
        // Reset progress after a small delay
        setTimeout(() => {
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
            progressContainer.querySelector('.audio-progress-bar').setAttribute('aria-valuenow', '0');
        }, 300);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EpisodePanel.init());
} else {
    EpisodePanel.init();
}

window.EpisodePanel = EpisodePanel;