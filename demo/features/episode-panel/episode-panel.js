// Episode Panel - Compact Responsive Implementation
class EpisodePanel {
    constructor() {
        this.panel = null;
        this.currentEpisodeId = null;
    }

    // Open panel with episode data
    open(episodeId) {
        
        // Find episode data in unified data
        const episode = window.unifiedData?.priorityBriefings?.items?.find(item => item.id === episodeId);
        if (!episode || !episode.expandedView) {
            return;
        }

        this.currentEpisodeId = episodeId;
        
        // Create panel if it doesn't exist
        if (!this.panel) {
            this.createPanel();
        }

        // Populate with data
        this.populate(episode);
        
        // Show panel
        this.panel.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Create the panel HTML structure matching the compact design
    createPanel() {
        const panelHTML = `
            <div class="episode-panel">
                <!-- Compact Header - 70px total -->
                <div class="epb-header">
                    <div class="epb-header-top">
                        <div class="epb-podcast-info">
                            <div class="epb-logo">20VC</div>
                            <div>
                                <div class="epb-podcast-name">The Twenty Minute VC</div>
                                <div class="epb-meta">
                                    <span class="time"></span> • <span class="duration"></span> • <span class="score">Score: 92</span>
                                </div>
                            </div>
                        </div>
                        <div class="epb-actions">
                            <div class="epb-btn" title="Transcript">📄</div>
                            <div class="epb-btn" title="Download">⬇</div>
                            <div class="epb-btn" title="Share">↗</div>
                            <div class="epb-btn epb-close" title="Close">✕</div>
                        </div>
                    </div>
                    <h1 class="epb-title"></h1>
                    <!-- Single Line Host/Guest -->
                    <div class="epb-participants">
                        <span><span class="epb-label">HOST:</span> <span class="epb-host">Harry Stebbings (20VC)</span></span>
                        <span><span class="epb-label">GUEST:</span> <span class="epb-guest">Bill Gurley (GP, Benchmark)</span></span>
                    </div>
                </div>

                <div class="epb-content">
                    <div class="epb-main">
                        <div class="epb-section">
                            <div class="epb-section-title">THE CONVERSATION</div>
                            <div class="epb-conversation" id="conversation-text"></div>
                        </div>
                        
                        <div class="epb-section">
                            <div class="epb-section-title">KEY INSIGHTS</div>
                            <div id="insights-list"></div>
                        </div>
                    </div>
                    
                    <div class="epb-sidebar">
                        <div class="epb-quote">
                            <div class="epb-section-title" style="color: rgba(255,255,255,0.9);">ESSENTIAL QUOTE</div>
                            <div class="epb-quote-text" id="quote-text"></div>
                            <div class="epb-quote-author" id="quote-author"></div>
                        </div>
                        
                        <div>
                            <div class="epb-section-title">NOTABLE NUMBERS</div>
                            <div class="epb-numbers" id="numbers-grid"></div>
                        </div>
                        
                        <div class="epb-blocks">
                            <div class="epb-block">
                                <span class="epb-block-label">📁 PORTFOLIO</span>
                                <span class="epb-block-count" id="portfolio-count">0</span>
                            </div>
                            <div class="epb-block">
                                <span class="epb-block-label">👁 WATCHLIST</span>
                                <span class="epb-block-count" id="watchlist-count">0</span>
                            </div>
                        </div>
                        
                        <div class="epb-topics">
                            <div class="epb-section-title">RELATED TOPICS</div>
                            <div class="epb-tags" id="topics-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create container and add to body
        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        this.panel = container.firstElementChild;
        this.panel.style.display = 'none';
        document.body.appendChild(this.panel);

        // Setup event listeners
        this.setupListeners();
    }

    // Generate episode number based on podcast
    getEpisodeNumber(podcast, episodeId) {
        // Map podcasts to their typical episode ranges for demo purposes
        const podcastEpisodeRanges = {
            'All-In': 180,
            '20VC': 1200,
            'The Twenty Minute VC': 1200,
            'The Information\'s 411': 89,
            'Acquired': 145,
            'Invest Like the Best': 450,
            'The Logan Bartlett Show': 67,
            'Stratechery': 234,
            'Khosla Ventures Podcast': 342,
            'Khosla Ventures': 342,
            'Indie Hackers': 289
        };
        
        // Get base episode number for the podcast, or use a default
        const baseNumber = podcastEpisodeRanges[podcast] || 100;
        
        // Create variation based on episode ID to make each one unique
        const idMatch = episodeId?.match(/\d+/);
        const variation = idMatch ? parseInt(idMatch[0]) : 0;
        
        // Generate episode number (going backwards from most recent)
        const episodeNum = baseNumber - variation;
        return `#${episodeNum} • `;
    }

    // Populate panel with episode data
    populate(episode) {
        const card = episode.cardView;
        const expanded = episode.expandedView;

        // Header info
        // Clean up podcast name - remove " Podcast" suffix if present
        const podcast = (card.podcast || 'All-In').replace(/ Podcast$/i, '');
        
        // Get episode number and combine with podcast name
        const episodeNumber = this.getEpisodeNumber(card.podcast, episode.id);
        const podcastNameWithEpisode = `${podcast} ${episodeNumber.replace(' • ', '')}`;
        this.panel.querySelector('.epb-podcast-name').textContent = podcastNameWithEpisode;
        
        // Logo - check for image first, then fallback to text
        const logoElement = this.panel.querySelector('.epb-logo');
        const podcastImages = {
            // Complete mapping for all podcasts in unified-data.js
            'All-In': 'images/allin.png',
            '20VC': 'images/20vc.jpeg',
            'The Information\'s 411': 'images/information.jpg',
            'Acquired': 'images/acquired.jpeg',
            'Invest Like the Best': 'images/investlikethebest.jpeg',
            'The Logan Bartlett Show': 'images/loganbartlett.jpg',
            'Stratechery': 'images/stratechery.jpeg',
            'Khosla Ventures Podcast': 'images/kv.png',
            'Indie Hackers': 'images/indiehackers.png'
        };
        
        // Try multiple lookups - first with original name, then cleaned name
        let imagePath = podcastImages[card.podcast];
        if (!imagePath && podcast !== card.podcast) {
            imagePath = podcastImages[podcast];
        }
        
        if (imagePath) {
            // Use image for the logo
            logoElement.innerHTML = `<img src="${imagePath}" alt="${card.podcast}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            // Fallback to text initials
            const logoText = this.getLogoText(podcast);
            logoElement.textContent = logoText;
        }
        
        // Time meta
        this.panel.querySelector('.time').textContent = card.time || '3h ago';
        this.panel.querySelector('.duration').textContent = card.duration || '94 min';
        this.panel.querySelector('.score').textContent = `Score: ${card.score || 97}`;
        
        // Title
        this.panel.querySelector('.epb-title').textContent = card.title || '';
        
        // Participants - format host and guest properly
        const host = this.extractHost(card);
        const guest = this.extractGuest(card);
        this.panel.querySelector('.epb-host').textContent = host;
        this.panel.querySelector('.epb-guest').textContent = guest;

        // Conversation
        const conversationBox = document.getElementById('conversation-text');
        conversationBox.textContent = expanded.conversationSummary || '';

        // Key Insights - limit to 3
        const insightsList = document.getElementById('insights-list');
        insightsList.innerHTML = '';
        if (expanded.keyInsights && expanded.keyInsights.length > 0) {
            expanded.keyInsights.slice(0, 3).forEach((insight, i) => {
                const cleanInsight = insight.replace(/^[•·]\s*/, '');
                const insightDiv = document.createElement('div');
                insightDiv.className = 'epb-insight';
                insightDiv.innerHTML = `
                    <div class="epb-insight-num">${i + 1}</div>
                    <div class="epb-insight-text">${cleanInsight}</div>
                `;
                insightsList.appendChild(insightDiv);
            });
        }

        // Essential Quote
        if (expanded.essentialQuote) {
            const quoteText = document.getElementById('quote-text');
            const quoteAuthor = document.getElementById('quote-author');
            
            quoteText.textContent = `"${expanded.essentialQuote.text}"`;
            quoteAuthor.textContent = `— ${expanded.essentialQuote.author}`;
            
            if (expanded.essentialQuote.time) {
                quoteAuthor.textContent += ` at ${expanded.essentialQuote.time}`;
            }
        }

        // Notable Numbers - horizontal layout format (max 3)
        const numbersGrid = document.getElementById('numbers-grid');
        numbersGrid.innerHTML = '';
        if (expanded.notableNumbers) {
            Object.entries(expanded.notableNumbers).slice(0, 3).forEach(([value, label]) => {
                const numberDiv = document.createElement('div');
                numberDiv.className = 'epb-number';
                numberDiv.innerHTML = `
                    <span class="epb-number-val">${value}</span>
                    <div class="epb-number-label">${label}</div>
                `;
                numbersGrid.appendChild(numberDiv);
            });
        }

        // Related Topics
        const topicsList = document.getElementById('topics-list');
        topicsList.innerHTML = '';
        if (expanded.relatedTopics && expanded.relatedTopics.length > 0) {
            expanded.relatedTopics.forEach(topic => {
                const tagText = topic.startsWith('#') ? topic : `#${topic}`;
                const topicTag = document.createElement('span');
                topicTag.className = 'epb-tag';
                topicTag.textContent = tagText;
                topicsList.appendChild(topicTag);
            });
        }
        
        // Portfolio and Watchlist counts
        const portfolioCount = expanded.portfolioMentions?.length || 0;
        const watchlistCount = expanded.watchlistMentions?.length || 0;
        
        document.getElementById('portfolio-count').textContent = portfolioCount;
        document.getElementById('watchlist-count').textContent = watchlistCount;
        
        this.portfolioMentions = expanded.portfolioMentions;
        this.watchlistMentions = expanded.watchlistMentions;
    }

    // Extract host from card data
    extractHost(card) {
        if (card.host) return card.host;
        
        // Try to extract from guests field
        const guests = card.guests || '';
        if (guests.includes('+')) {
            const parts = guests.split('+').map(s => s.trim());
            return parts[1] || 'Host';
        }
        
        // Default hosts by podcast
        const defaultHosts = {
            'All-In': 'Jason Calacanis (Launch Fund)',
            '20VC': 'Harry Stebbings (20VC)',
            'BG2': 'Bill Gurley & Brad Gerstner'
        };
        
        return defaultHosts[card.podcast] || 'Host';
    }

    // Extract guest from card data
    extractGuest(card) {
        const guests = card.guests || '';
        if (guests.includes('+')) {
            const parts = guests.split('+').map(s => s.trim());
            return parts[0];
        }
        return guests || 'Guest';
    }

    // Get logo text from podcast name
    getLogoText(podcast) {
        const logoMap = {
            'All-In': 'ALL-IN',
            '20VC': '20VC',
            'The Twenty Minute VC': '20VC',
            'The Information\'s 411': '411',
            'Khosla Ventures': 'KV',
            'Khosla Ventures Podcast': 'KV',
            'The Logan Bartlett Show': 'LB',
            'BG2': 'BG2',
            'Acquired': 'ACQ',
            'Invest Like the Best': 'ILTB',
            'Indie Hackers': 'IH',
            'Stratechery': 'ST'
        };
        
        return logoMap[podcast] || podcast.split(' ').map(w => w[0]).join('').toUpperCase();
    }

    // Setup event listeners
    setupListeners() {
        // Close button
        const closeBtn = this.panel.querySelector('.epb-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel && this.panel.style.display !== 'none') {
                this.close();
            }
        });
    }

    // Close panel
    close() {
        if (this.panel) {
            this.panel.style.display = 'none';
            document.body.style.overflow = '';
            
            // Check if we need to restore the drill-down panel
            if (window.drilldownReturnState && window.drilldownReturnState.isOpen) {
                // Restore the drill-down panel
                if (window.NarrativePulseDrilldown) {
                    window.NarrativePulseDrilldown.restorePanel();
                }
                // Clear the return state
                delete window.drilldownReturnState;
            }
        }
    }
}

// Create global instance
window.episodePanel = new EpisodePanel();

// Setup click handlers
document.addEventListener('DOMContentLoaded', () => {
    // Listen for clicks on briefing cards and buttons
    document.addEventListener('click', (e) => {
        // Check multiple possible selectors
        const briefingCard = e.target.closest('.briefing-card');
        const episodeCard = e.target.closest('.episode-card');
        const viewBriefBtn = e.target.closest('.view-brief-btn');
        const viewFullBrief = e.target.closest('.view-full-brief');
        
        let briefingId = null;
        
        // Get the briefing ID from various sources
        if (viewBriefBtn) {
            briefingId = viewBriefBtn.getAttribute('data-briefing-id');
        } else if (briefingCard) {
            briefingId = briefingCard.getAttribute('data-briefing-id');
        } else if (episodeCard) {
            briefingId = episodeCard.getAttribute('data-id');
        } else if (viewFullBrief) {
            briefingId = viewFullBrief.getAttribute('data-episode-id');
        }
        
        // Open panel if we have a briefing ID
        if (briefingId) {
            e.preventDefault();
            e.stopPropagation();
            window.episodePanel.open(briefingId);
        }
    });
    
    // Also handle programmatic opening
    window.openEpisodePanel = function(episodeId) {
        window.episodePanel.open(episodeId);
    };
});