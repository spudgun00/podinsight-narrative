// Episode Panel v2.0 - Enhanced Implementation with Interactive Badges
class EpisodePanelV2 {
    constructor() {
        this.panel = null;
        this.backdrop = null;
        this.currentEpisodeId = null;
        this.activeListeners = [];
        this.portfolioExpanded = false;
        this.watchlistExpanded = false;
    }

    // Initialize the panel
    init() {
        this.createBackdrop();
        this.createPanel();
        this.setupGlobalListeners();
    }

    // Create backdrop element
    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'epb-backdrop';
        this.backdrop.addEventListener('click', () => this.close());
        document.body.appendChild(this.backdrop);
    }

    // Create the panel HTML structure - SPACE OPTIMIZED
    createPanel() {
        const panelContainer = document.createElement('div');
        panelContainer.className = 'epb-panel-v2';
        panelContainer.innerHTML = `
            <div class="epb-panel" id="episodePanel">
                <!-- EXPANDED Header with Host/Guest Info -->
                <div class="epb-header" style="min-height: 155px; height: 155px; display: flex; flex-direction: column; justify-content: space-between; padding: 20px 24px; box-sizing: border-box;">
                    <!-- Top Row: Logo, Podcast Info, Actions -->
                    <div class="epb-header-top" style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="epb-header-left" style="display: flex; align-items: center; gap: 16px;">
                            <div class="epb-logo" style="width: 48px; height: 48px;"></div>
                            <div class="epb-podcast-info">
                                <div class="epb-podcast-name" style="font-size: 15px; font-weight: 500; color: white;"></div>
                                <div class="epb-meta" style="font-size: 12px; opacity: 0.7;">
                                    <span class="epb-episode-number"></span> • 
                                    <span class="epb-time"></span> • 
                                    <span class="epb-duration"></span> • 
                                    Score: <span class="epb-score">--</span>
                                </div>
                            </div>
                        </div>
                        <div class="epb-actions">
                            <div class="epb-btn epb-play" title="Play Episode">▶</div>
                            <div class="epb-btn epb-transcript" title="Transcript">📄</div>
                            <div class="epb-btn epb-download" title="Download">⬇</div>
                            <div class="epb-btn epb-share" title="Share">⤴</div>
                            <div class="epb-btn epb-close" title="Close">✕</div>
                        </div>
                    </div>
                    <!-- Middle: Title -->
                    <div class="epb-header-middle" style="margin: 12px 0;">
                        <h1 class="epb-title" style="font-size: 22px; font-weight: 600; color: white; margin: 0; line-height: 1.3;"></h1>
                    </div>
                    <!-- Bottom: Host and Guest -->
                    <div class="epb-header-bottom" style="display: flex; gap: 40px;">
                        <div class="epb-header-person" style="display: flex; align-items: baseline; gap: 12px;">
                            <span class="epb-header-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; color: rgba(255,255,255,0.7);">HOST</span>
                            <span class="epb-header-name epb-host" style="font-size: 11px; font-weight: 500; color: white;"></span>
                        </div>
                        <div class="epb-header-person" style="display: flex; align-items: baseline; gap: 12px;">
                            <span class="epb-header-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; color: rgba(255,255,255,0.7);">GUEST</span>
                            <span class="epb-header-name epb-guest" style="font-size: 11px; font-weight: 500; color: white;"></span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Area -->
                <div class="epb-content" style="height: calc(100vh - 155px);">
                    <!-- Main Column -->
                    <div class="epb-main">
                        <div class="epb-section">
                            <div class="epb-section-title">THE CONVERSATION</div>
                            <div class="epb-conversation"></div>
                        </div>
                        
                        <div class="epb-section">
                            <div class="epb-section-title">KEY INSIGHTS</div>
                            <div class="epb-insights"></div>
                        </div>
                        
                        <!-- Key Quotes Section -->
                        <div class="epb-section">
                            <div class="epb-section-header">
                                <div class="epb-section-title">KEY QUOTES</div>
                                <span class="epb-quote-count"></span>
                            </div>
                            <div class="epb-key-quotes"></div>
                        </div>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="epb-sidebar">
                        <div class="epb-quote">
                            <div class="epb-section-title">ESSENTIAL QUOTE</div>
                            <div class="epb-quote-text"></div>
                            <div class="epb-quote-author"></div>
                        </div>
                        
                        <div>
                            <div class="epb-section-title">NOTABLE NUMBERS</div>
                            <div class="epb-numbers"></div>
                        </div>
                        
                        <div class="epb-topics">
                            <div class="epb-section-title">RELATED TOPICS</div>
                            <div class="epb-tags"></div>
                        </div>
                        
                        <!-- Portfolio/Watchlist Badges - Moved to bottom of Sidebar -->
                        <div class="epb-section epb-sidebar-badges">
                            <div class="epb-badges epb-badges-vertical">
                                <div class="epb-badge" data-type="portfolio">
                                    <span class="epb-badge-label">📁 PORTFOLIO</span>
                                    <span class="epb-badge-count">0</span>
                                </div>
                                <div class="epb-badge" data-type="watchlist">
                                    <span class="epb-badge-label">👁 WATCHLIST</span>
                                    <span class="epb-badge-count">0</span>
                                </div>
                            </div>
                            <!-- Expandable content area -->
                            <div class="epb-badge-content" id="badgeContent"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panelContainer);
        this.panel = panelContainer.querySelector('.epb-panel');
        this.setupPanelListeners();
    }

    // Setup panel-specific event listeners
    setupPanelListeners() {
        // Close button
        const closeBtn = this.panel.querySelector('.epb-close');
        closeBtn.addEventListener('click', () => this.close());

        // Play button
        const playBtn = this.panel.querySelector('.epb-play');
        playBtn.addEventListener('click', () => this.handleMainPlay());

        // Action buttons
        const transcriptBtn = this.panel.querySelector('.epb-transcript');
        transcriptBtn.addEventListener('click', () => this.handleTranscript());

        const downloadBtn = this.panel.querySelector('.epb-download');
        downloadBtn.addEventListener('click', () => this.handleDownload());

        const shareBtn = this.panel.querySelector('.epb-share');
        shareBtn.addEventListener('click', () => this.handleShare());

        // Interactive badges
        const badges = this.panel.querySelectorAll('.epb-badge');
        badges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                const type = badge.getAttribute('data-type');
                this.toggleBadge(type);
            });
        });
    }

    // Setup global event listeners
    setupGlobalListeners() {
        // ESC key to close
        const escListener = (e) => {
            if (e.key === 'Escape' && this.panel && this.panel.classList.contains('active')) {
                this.close();
            }
        };
        document.addEventListener('keydown', escListener);
        this.activeListeners.push({ type: 'keydown', handler: escListener });

        // Listen for clicks on briefing cards
        const clickListener = (e) => {
            const triggers = [
                '.briefing-card',
                '.episode-card',
                '.view-brief-btn',
                '.view-full-brief'
            ];
            
            for (const selector of triggers) {
                const element = e.target.closest(selector);
                if (element) {
                    const briefingId = element.getAttribute('data-briefing-id') ||
                                      element.getAttribute('data-id') ||
                                      element.getAttribute('data-episode-id');
                    if (briefingId) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.open(briefingId);
                        break;
                    }
                }
            }
        };
        document.addEventListener('click', clickListener);
        this.activeListeners.push({ type: 'click', handler: clickListener });
    }

    // Open panel with episode data
    open(episodeId) {
        
        // Find episode data
        const episode = this.findEpisodeData(episodeId);
        if (!episode) {
            return;
        }

        this.currentEpisodeId = episodeId;
        this.populate(episode);
        
        // Show panel and backdrop
        this.backdrop.classList.add('active');
        this.panel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Find episode data from unified data or fallback
    findEpisodeData(episodeId) {
        // Try unified data first
        if (window.unifiedData?.priorityBriefings?.items) {
            const episode = window.unifiedData.priorityBriefings.items.find(
                item => item.id === episodeId
            );
            if (episode) return episode;
        }

        // Fallback to demo data
        return this.getDemoEpisode(episodeId);
    }

    // Get demo episode data
    getDemoEpisode(episodeId) {
        const demoData = {
            'demo-1': {
                cardView: {
                    podcast: '20VC',
                    time: '3h ago',
                    duration: '94 min',
                    score: 92,
                    title: 'The Future of AI Agents in Enterprise Software',
                    guests: 'Reid Hoffman + Harry Stebbings'
                },
                expandedView: {
                    conversationSummary: 'Reid Hoffman discusses the transformative potential of AI agents in enterprise software, arguing that we\'re at an inflection point similar to the early days of the internet.',
                    keyInsights: [
                        'AI agents will replace 60% of repetitive enterprise workflows within 3 years',
                        'Companies not adopting AI-first strategies risk 40% productivity disadvantage',
                        'The $500B enterprise software market faces complete disruption by 2027'
                    ],
                    essentialQuote: {
                        text: 'We\'re not just automating tasks, we\'re fundamentally reimagining how work gets done.',
                        author: 'Reid Hoffman',
                        time: '23:45'
                    },
                    notableNumbers: {
                        '$2.3T': 'AI Market 2030',
                        '60%': 'Workflow Auto',
                        '3.5x': 'Productivity'
                    },
                    portfolioMentions: ['OpenAI', 'Anthropic', 'Cohere'],
                    watchlistMentions: ['Mistral', 'Adept'],
                    relatedTopics: ['AIAgents', 'EnterpriseSoftware', 'Automation']
                }
            }
        };
        
        return demoData[episodeId] || demoData['demo-1'];
    }

    // Generate episode number based on podcast and ID
    getEpisodeNumber(podcast, episodeId) {
        // Map podcasts to their typical episode ranges for demo purposes
        const podcastEpisodeRanges = {
            'All-In': 180,
            '20VC': 1200,
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
        const card = episode.cardView || {};
        const expanded = episode.expandedView || {};

        // Header info - Expanded Style
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
        
        const imagePath = podcastImages[card.podcast];
        if (imagePath) {
            // Use image for the logo
            logoElement.innerHTML = `<img src="${imagePath}" alt="${card.podcast}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            // Fallback to text initials
            logoElement.textContent = this.getLogoText(card.podcast);
        }
        
        // Clean up podcast name - remove " Podcast" suffix if present
        const podcastName = (card.podcast || 'Podcast').replace(/ Podcast$/i, '');
        
        // Set podcast name only (without episode number)
        this.panel.querySelector('.epb-podcast-name').textContent = podcastName;
        
        // Get episode number and add it to meta section
        const episodeNumber = this.getEpisodeNumber(card.podcast, this.currentEpisodeId);
        const episodeNumberClean = episodeNumber.replace(' • ', '');
        this.panel.querySelector('.epb-episode-number').textContent = episodeNumberClean;
        
        this.panel.querySelector('.epb-time').textContent = card.time || 'Recent';
        this.panel.querySelector('.epb-duration').textContent = card.duration || '--';
        this.panel.querySelector('.epb-score').textContent = card.score || '--';
        
        // Title
        this.panel.querySelector('.epb-title').textContent = card.title || 'Episode Title';
        
        // Host and Guest in header
        const { host, guest } = this.extractParticipants(card);
        this.panel.querySelector('.epb-host').textContent = host;
        this.panel.querySelector('.epb-guest').textContent = guest;

        // Conversation
        this.panel.querySelector('.epb-conversation').textContent = 
            expanded.conversationSummary || 'No summary available.';

        // Key Insights
        this.populateInsights(expanded.keyInsights || []);

        // Key Quotes
        this.populateKeyQuotes(expanded.essentialQuote);

        // Portfolio and Watchlist
        this.populateBadges('portfolio', expanded.portfolioMentions || []);
        this.populateBadges('watchlist', expanded.watchlistMentions || []);

        // Quote - Use more specific selector to target sidebar quote
        if (expanded.essentialQuote) {
            const sidebarQuote = this.panel.querySelector('.epb-sidebar .epb-quote .epb-quote-text');
            const sidebarAuthor = this.panel.querySelector('.epb-sidebar .epb-quote .epb-quote-author');
            
            if (sidebarQuote) {
                sidebarQuote.textContent = `"${expanded.essentialQuote.text}"`;
            }
            if (sidebarAuthor) {
                sidebarAuthor.textContent = `— ${expanded.essentialQuote.author}${expanded.essentialQuote.time ? ' at ' + expanded.essentialQuote.time : ''}`;
            }
        }

        // Notable Numbers
        this.populateNumbers(expanded.notableNumbers || {});

        // Related Topics
        this.populateTopics(expanded.relatedTopics || []);
    }

    // Populate insights - MAGAZINE STYLE WITH NUMBERED CIRCLES
    populateInsights(insights) {
        const container = this.panel.querySelector('.epb-insights');
        container.innerHTML = '';
        
        insights.slice(0, 3).forEach((insight, index) => {
            const cleanInsight = insight.replace(/^[•·]\s*/, '');
            const insightEl = document.createElement('div');
            insightEl.className = 'epb-insight';
            insightEl.innerHTML = `
                <div class="epb-insight-num">${index + 1}</div>
                <div class="epb-insight-text">${cleanInsight}</div>
            `;
            container.appendChild(insightEl);
        });
    }

    // Populate key quotes section
    populateKeyQuotes(essentialQuote) {
        const container = this.panel.querySelector('.epb-key-quotes');
        const countEl = this.panel.querySelector('.epb-quote-count');
        container.innerHTML = '';
        
        // Create demo quotes array mixing real and demo data
        const demoQuotes = [
            {
                text: essentialQuote?.text || "Every successful AI company is becoming an infrastructure company. The ones that don't will be eaten by OpenAI or Google.",
                speaker: essentialQuote?.author || "Chamath Palihapitiya",
                role: "Social Capital",
                timestamp: essentialQuote?.time || "34:21",
                id: 'quote-1'
            },
            {
                text: "We're not automating programmers - we're giving every business analyst the power to code. The demand for software will explode 100x.",
                speaker: "Nat Friedman",
                role: "Former GitHub CEO", 
                timestamp: "12:45",
                id: 'quote-2'
            },
            {
                text: "The biggest mistake founders make is waiting until they need an exit to build acquirer relationships. By then, you have zero leverage.",
                speaker: "Emilie Choi",
                role: "Coinbase President",
                timestamp: "56:03",
                id: 'quote-3'
            }
        ];
        
        // Limit to 2 quotes maximum
        const quotesToDisplay = demoQuotes.slice(0, 2);
        
        // Update count badge - aligned with title
        countEl.textContent = `${quotesToDisplay.length} QUOTES`;
        countEl.style.fontSize = '11px';
        countEl.style.color = 'var(--epb-gray-600)';
        countEl.style.marginLeft = 'auto';
        
        // Create quote cards
        quotesToDisplay.forEach(quote => {
            const quoteCard = document.createElement('div');
            quoteCard.className = 'epb-quote-card';
            quoteCard.dataset.quoteId = quote.id;
            
            // Truncate quote text to 80 characters for single-line display
            const truncatedText = quote.text.length > 80 
                ? quote.text.substring(0, 77) + '...' 
                : quote.text;
            
            quoteCard.innerHTML = `
                <button class="epb-quote-play-btn" data-timestamp="${quote.timestamp}" aria-label="Play quote">
                    <svg width="30" height="30" viewBox="0 0 30 30" class="play-button-svg">
                        <!-- Background circle -->
                        <circle cx="15" cy="15" r="14" fill="var(--epb-sage)" opacity="0.1"/>
                        <!-- Play icon -->
                        <path class="play-icon" d="M12 10 L12 20 L21 15 Z" fill="var(--epb-sage)"/>
                        <!-- Pause icon (hidden by default) -->
                        <g class="pause-icon" style="display: none;">
                            <rect x="10.5" y="10" width="3" height="10" fill="var(--epb-sage)"/>
                            <rect x="16.5" y="10" width="3" height="10" fill="var(--epb-sage)"/>
                        </g>
                        <!-- Progress ring -->
                        <circle class="progress-ring" cx="15" cy="15" r="13.5" 
                                fill="none" stroke="var(--epb-sage)" stroke-width="1.5"
                                stroke-dasharray="0 85" stroke-linecap="round"
                                transform="rotate(-90 15 15)" style="opacity: 0; transition: opacity 0.3s;"/>
                    </svg>
                </button>
                <div class="epb-quote-body">
                    <div class="epb-quote-text" data-full-text="${quote.text.replace(/"/g, '&quot;')}">"${truncatedText}"</div>
                    <div class="epb-quote-attribution">— ${quote.speaker}${quote.role ? ', ' + quote.role : ''} • ${quote.timestamp}</div>
                </div>
            `;
            
            // Add click handler for expand/collapse
            quoteCard.addEventListener('click', (e) => {
                // Don't toggle if clicking play button
                if (e.target.closest('.epb-quote-play-btn')) return;
                
                const isExpanded = quoteCard.classList.contains('expanded');
                const quoteTextEl = quoteCard.querySelector('.epb-quote-text');
                const fullText = quoteTextEl.getAttribute('data-full-text');
                
                // Collapse all other quotes
                container.querySelectorAll('.epb-quote-card').forEach(card => {
                    card.classList.remove('expanded');
                    const textEl = card.querySelector('.epb-quote-text');
                    const truncated = textEl.getAttribute('data-full-text');
                    if (truncated && truncated.length > 80) {
                        textEl.textContent = '"' + truncated.substring(0, 77) + '..."';
                    }
                });
                
                // Toggle this quote
                if (!isExpanded) {
                    quoteCard.classList.add('expanded');
                    quoteTextEl.textContent = '"' + fullText + '"';
                } else {
                    // If collapsing, restore truncated text
                    if (fullText.length > 80) {
                        quoteTextEl.textContent = '"' + fullText.substring(0, 77) + '..."';
                    }
                }
            });
            
            // Add play button handler with animation
            const playBtn = quoteCard.querySelector('.epb-quote-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleQuotePlayback(playBtn, quote.timestamp);
                });
            }
            
            container.appendChild(quoteCard);
        });
    }

    // Handle quote playback with professional animation
    handleQuotePlayback(button, timestamp) {
        const svg = button.querySelector('.play-button-svg');
        const playIcon = svg.querySelector('.play-icon');
        const pauseIcon = svg.querySelector('.pause-icon');
        const progressRing = svg.querySelector('.progress-ring');
        const isPlaying = button.classList.contains('playing');
        
        if (isPlaying) {
            // Stop playback
            button.classList.remove('playing');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            progressRing.style.opacity = '0';
            progressRing.style.strokeDasharray = '0 85';
            
            // Clear any existing timeout
            if (button.playbackTimeout) {
                clearTimeout(button.playbackTimeout);
                button.playbackTimeout = null;
            }
        } else {
            // Stop any other playing quotes
            this.panel.querySelectorAll('.epb-quote-play-btn.playing').forEach(btn => {
                if (btn !== button) {
                    this.handleQuotePlayback(btn, null);
                }
            });
            
            // Start playback
            button.classList.add('playing');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            progressRing.style.opacity = '1';
            
            // Animate progress ring
            const duration = 15000; // 15 seconds demo duration
            progressRing.style.transition = `stroke-dasharray ${duration}ms linear`;
            requestAnimationFrame(() => {
                progressRing.style.strokeDasharray = '85 0';
            });
            
            // Auto-stop after duration
            button.playbackTimeout = setTimeout(() => {
                this.handleQuotePlayback(button, null);
            }, duration);
        }
        
        // Trigger actual playback logic
        if (!isPlaying && timestamp) {
            console.log(`Playing quote from ${timestamp}`);
            // Here you would integrate with actual audio player
        }
    }

    // Populate badge with companies - INLINE PILLS
    populateBadges(type, companies) {
        const badge = this.panel.querySelector(`.epb-badge[data-type="${type}"]`);
        const countEl = badge.querySelector('.epb-badge-count');
        
        countEl.textContent = companies.length;
        if (companies.length === 0) {
            countEl.classList.add('zero');
        } else {
            countEl.classList.remove('zero');
        }
        
        // Store companies data for later expansion
        badge.dataset.companies = JSON.stringify(companies);
    }

    // Toggle badge expansion - INLINE PILLS WITH CONTENT BELOW
    toggleBadge(type) {
        const badge = this.panel.querySelector(`.epb-badge[data-type="${type}"]`);
        const contentArea = this.panel.querySelector('#badgeContent');
        const isActive = badge.classList.contains('active');
        
        // Close all badges first
        this.panel.querySelectorAll('.epb-badge').forEach(b => {
            b.classList.remove('active');
        });
        contentArea.classList.remove('show');
        
        // Toggle the clicked badge
        if (!isActive) {
            badge.classList.add('active');
            
            // Get companies data
            const companies = JSON.parse(badge.dataset.companies || '[]');
            
            // Build content HTML
            let contentHTML = '';
            if (companies.length === 0) {
                contentHTML = `
                    <div class="epb-empty-state">
                        <div>${type === 'portfolio' ? '📁' : '👁'}</div>
                        <p>No ${type} companies mentioned in this episode</p>
                    </div>
                `;
            } else {
                contentHTML = `
                    <div class="epb-badge-header-expanded">
                        ${type.toUpperCase()} MENTIONS
                        <span class="epb-count-label">${companies.length} ${companies.length === 1 ? 'company' : 'companies'}</span>
                    </div>
                `;
                companies.forEach(companyData => {
                    // Handle both object format and simple string format
                    const companyName = companyData.company || companyData;
                    const quotes = companyData.quotes || [];
                    
                    if (quotes.length > 0) {
                        // Display each quote for this company
                        quotes.forEach(quote => {
                            contentHTML += `
                                <div class="epb-badge-item">
                                    <div class="epb-badge-item-header">
                                        <span class="epb-play-inline" title="Play at ${quote.time}">▶</span>
                                        <span class="epb-company-name">${companyName}</span>
                                        <span class="epb-mention-time">${quote.time || '00:00'}</span>
                                    </div>
                                    <div class="epb-quote-text">"${quote.text}"</div>
                                </div>
                            `;
                        });
                    } else {
                        // Fallback for simple mentions without quotes
                        contentHTML += `
                            <div class="epb-badge-item">
                                <span class="epb-play-inline" title="Play mention">▶</span>
                                <span class="epb-company-name">${companyName}</span>
                                <span class="epb-mention-time">--:--</span>
                            </div>
                        `;
                    }
                });
            }
            
            contentArea.innerHTML = contentHTML;
            contentArea.classList.add('show');
            
            // Add event listeners to inline play buttons
            contentArea.querySelectorAll('.epb-play-inline').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const time = btn.getAttribute('title').replace('Play at ', '');
                    this.handleInlinePlay(btn, time);
                });
            });
        } else {
            contentArea.innerHTML = '';
        }
    }

    // Populate notable numbers
    populateNumbers(numbers) {
        const container = this.panel.querySelector('.epb-numbers');
        container.innerHTML = '';
        
        Object.entries(numbers).slice(0, 4).forEach(([value, label]) => {
            const numberEl = document.createElement('div');
            numberEl.className = 'epb-number';
            numberEl.innerHTML = `
                <div class="epb-number-label">${label}</div>
                <span class="epb-number-val">${value}</span>
            `;
            container.appendChild(numberEl);
        });
    }

    // Populate related topics
    populateTopics(topics) {
        const container = this.panel.querySelector('.epb-tags');
        container.innerHTML = '';
        
        topics.forEach(topic => {
            const tag = document.createElement('span');
            tag.className = 'epb-tag';
            tag.textContent = topic.startsWith('#') ? topic : `#${topic}`;
            container.appendChild(tag);
        });
    }

    // Extract host and guest from card data
    extractParticipants(card) {
        const guests = card.guests || '';
        let host = 'Host';
        let guest = 'Guest';
        
        if (guests.includes('+')) {
            const parts = guests.split('+').map(s => s.trim());
            guest = parts[0];
            host = parts[1] || this.getDefaultHost(card.podcast);
        } else {
            guest = guests;
            host = this.getDefaultHost(card.podcast);
        }
        
        return { host, guest };
    }

    // Get default host by podcast
    getDefaultHost(podcast) {
        const hosts = {
            '20VC': 'Harry Stebbings (20VC)',
            'All-In': 'Jason Calacanis (Launch Fund)',
            'BG2': 'Bill Gurley & Brad Gerstner',
            'Acquired': 'Ben Gilbert & David Rosenthal'
        };
        return hosts[podcast] || 'Host';
    }

    // Get logo text from podcast name
    getLogoText(podcast) {
        const logoMap = {
            '20VC': '20VC',
            'All-In': 'ALL-IN',
            'BG2': 'BG2',
            'Acquired': 'ACQ',
            'Invest Like the Best': 'ILTB'
        };
        return logoMap[podcast] || podcast?.substring(0, 4).toUpperCase() || 'POD';
    }

    // Handle transcript action
    handleTranscript() {
        // Implement transcript functionality
    }

    // Handle download action
    handleDownload() {
        // Implement download functionality
    }

    // Handle share action
    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: this.panel.querySelector('.epb-title').textContent,
                text: 'Check out this episode',
                url: window.location.href
            });
        }
    }

    // Handle main play button
    handleMainPlay() {
        const playBtn = this.panel.querySelector('.epb-play');
        const isPlaying = playBtn.classList.contains('playing');
        
        if (isPlaying) {
            playBtn.classList.remove('playing');
            playBtn.textContent = '▶';
        } else {
            // Stop all other play buttons
            this.panel.querySelectorAll('.epb-play-inline.playing').forEach(btn => {
                btn.classList.remove('playing');
            });
            
            playBtn.classList.add('playing');
            playBtn.textContent = '⏸';
        }
    }

    // Handle inline play buttons for quotes
    handleInlinePlay(button, time) {
        const isPlaying = button.classList.contains('playing');
        
        if (isPlaying) {
            button.classList.remove('playing');
        } else {
            // Stop all other play buttons including main
            this.panel.querySelectorAll('.epb-play-inline.playing, .epb-play.playing').forEach(btn => {
                btn.classList.remove('playing');
                if (btn.classList.contains('epb-play')) {
                    btn.textContent = '▶';
                }
            });
            
            button.classList.add('playing');
        }
    }

    // Close panel
    close() {
        this.backdrop.classList.remove('active');
        this.panel.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset badge states
        this.panel.querySelectorAll('.epb-badge').forEach(badge => {
            badge.classList.remove('active');
        });
        
        this.currentEpisodeId = null;
        
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

    // Cleanup method
    destroy() {
        this.close();
        
        // Remove event listeners
        this.activeListeners.forEach(({ type, handler }) => {
            document.removeEventListener(type, handler);
        });
        
        // Remove DOM elements
        if (this.backdrop) {
            this.backdrop.remove();
        }
        if (this.panel) {
            this.panel.closest('.epb-panel-v2').remove();
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.episodePanelV2 = new EpisodePanelV2();
        window.episodePanelV2.init();
        // Create alias for backward compatibility
        window.episodePanel = window.episodePanelV2;
    });
} else {
    window.episodePanelV2 = new EpisodePanelV2();
    window.episodePanelV2.init();
    // Create alias for backward compatibility
    window.episodePanel = window.episodePanelV2;
}

// Global function for programmatic opening
window.openEpisodePanel = function(episodeId) {
    if (window.episodePanelV2) {
        window.episodePanelV2.open(episodeId);
    }
};