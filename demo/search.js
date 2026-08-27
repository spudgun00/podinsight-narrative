/**
 * PatternFlow Intelligence Search
 * Premium search interface for venture capital intelligence
 */

class PatternFlowSearch {
    constructor() {
        this.searchInput = null;
        this.searchDropdown = null;
        this.searchResults = null;
        this.backdrop = null;
        this.queryDisplay = null;
        this.isInitialized = false;
        
        // Rotating placeholders
        this.placeholders = [
            "What's the consensus on...",
            "Which VCs are talking about...",
            "Show me contrarian views on...",
            "What's gaining momentum in..."
        ];
        this.placeholderIndex = 0;
        this.placeholderInterval = null;
        
        // Bind event handlers to preserve context
        this.boundHandleGlobalKeydown = this.handleGlobalKeydown.bind(this);

        // --- Live search API (PodInsight) -------------------------------------
        this.apiBaseUrl = window.SYNTHEA_API_BASE || 'http://localhost:8000';
        this.apiSearchLimit = 10;
        // Modal cold starts take 10-15s on the first request, so keep this well
        // above 30s.
        this.apiTimeoutMs = 45000;
        this.searchRequestId = 0;
        this.lastQuery = '';
        // The indexed corpus is fixed and /api/search accepts no date filter,
        // so the panel states the range instead of offering to change it.
        this.corpusRangeLabel = 'Jan–Jun 2025';
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Create search elements if they don't exist
        this.createSearchElements();
        
        // Get references
        this.searchInput = document.getElementById('searchInput');
        this.searchDropdown = document.getElementById('searchDropdown');
        this.searchPanel = document.getElementById('searchPanel');
        this.searchResults = document.getElementById('searchResults');
        this.backdrop = document.getElementById('searchBackdrop');
        this.queryDisplay = document.getElementById('queryDisplay');
        this.searchQueryText = null; // Removed from UI but kept for compatibility
        
        if (!this.searchInput) {
            console.error('Search input not found');
            return;
        }
        
        // Bind events
        this.bindEvents();
        
        this.isInitialized = true;
    }
    
    createQuoteCard(podcast, guest, timeAgo, duration, quoteText) {
        const truncateLength = 100;
        const needsTruncation = quoteText.length > truncateLength;
        const truncatedText = needsTruncation ? quoteText.substring(0, truncateLength) + '...' : quoteText;
        const cardId = 'quote-' + Date.now() + Math.random();
        
        return `
            <div class="source-card">
                <div class="source-header">
                    <div class="source-info">
                        <span>🎙️</span>
                        <span>${guest} on ${podcast}</span>
                        <span>• ${timeAgo} • 0:${duration}</span>
                    </div>
                </div>
                <div class="quote-text ${needsTruncation ? 'truncated' : ''}" id="${cardId}">
                    <span class="quote-content">${truncatedText}</span>
                    ${needsTruncation ? `<a href="#" class="show-more-link" onclick="patternFlowSearch.toggleQuote(event, '${cardId}')">Show more</a>` : ''}
                </div>
                <button class="play-clip-btn" data-duration="${duration}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="7" cy="7" r="6"/>
                        <path d="M5.5 4.5v5l4-2.5z" fill="currentColor" stroke="none"/>
                    </svg>
                    Play clip
                </button>
                ${needsTruncation ? `<div class="quote-full-text" style="display:none">${quoteText}</div>` : ''}
            </div>
        `;
    }
    
    createSearchElements() {
        // Check if backdrop exists, if not create it
        if (!document.getElementById('searchBackdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'search-backdrop';
            backdrop.id = 'searchBackdrop';
            document.body.appendChild(backdrop);
        }
        
        // Check if panel exists, if not create it
        if (!document.getElementById('searchPanel')) {
            // Get default search data from unified source
            const defaultData = window.unifiedData?.searchResults?.default || {
                confidence: '89%',
                discussions: 14,
                synthesis: {
                    title: 'Strong consensus forming',
                    content: 'Vertical AI applications with proprietary data moats are seeing 2-3x better retention than horizontal plays. The narrative has shifted from "AI for everything" to "AI for specific workflows" with deep domain expertise.'
                },
                sources: [
                    {
                        podcast: '20VC',
                        guest: 'Brad Gerstner',
                        timeAgo: '2 days ago',
                        duration: '45',
                        quote: "The winners in AI won't be the broadest platforms, they'll be the ones who own the workflow."
                    },
                    {
                        podcast: 'Invest Like Best',
                        guest: 'Elad Gil',
                        timeAgo: '4 days ago',
                        duration: '38',
                        quote: "Vertical AI is where we're seeing actual revenue, not just usage."
                    }
                ]
            };
            
            // Apply highlighting to default content
            const highlightedContent = defaultData.synthesis.content
                .replace(/proprietary data moats/g, '<span class="highlight">proprietary data moats</span>')
                .replace(/"AI for specific workflows"/g, '<span class="highlight">"AI for specific workflows"</span>');
            
            const panelHtml = `
                <div class="search-panel" id="searchPanel">
                    <div class="panel-header">
                        <div class="panel-header-content">
                            <div class="panel-search-wrapper">
                                <input type="text" 
                                       class="panel-search-input" 
                                       id="panelSearchInput"
                                       placeholder="New search..."
                                       onkeypress="if(event.key === 'Enter') patternFlowSearch.searchFromPanel()">
                                <button class="panel-search-btn" onclick="patternFlowSearch.searchFromPanel()">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="7" cy="7" r="5"/>
                                        <path d="M10 10l3 3"/>
                                    </svg>
                                    Search
                                </button>
                            </div>
                        </div>
                        <button class="panel-close search-panel-close">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 6L14 14M6 14L14 6"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="panel-content" id="searchResults">
                        <div class="search-state search-state--loading" id="searchLoadingState">
                            <div class="search-state-spinner" aria-hidden="true"></div>
                            <div class="search-state-title">Searching the transcript archive…</div>
                            <div class="search-state-note">Searching 54,284 passages across 1,236 episodes.</div>
                        </div>

                        <div class="search-state search-state--nomatch" id="searchNoMatchState">
                            <div class="search-state-icon" aria-hidden="true">◦</div>
                            <div class="search-state-title">No strong matches in the library</div>
                            <div class="search-state-note" id="searchNoMatchMessage"></div>
                            <div class="search-state-detail" id="searchNoMatchDetail"></div>
                        </div>

                        <div class="search-state search-state--error" id="searchErrorState">
                            <div class="search-state-title">Search unavailable</div>
                            <div class="search-state-note" id="searchErrorMessage"></div>
                            <button class="panel-search-btn" onclick="patternFlowSearch.retrySearch()">Try again</button>
                        </div>

                        <div class="synthesis-content">
                            <div class="confidence-metadata">
                                <span class="discussion-count">Based on ${defaultData.discussions || 0} discussions</span>
                                <span class="separator">•</span>
                                <span class="timeframe-static" title="The corpus is fixed and /api/search takes no date parameter">
                                    ${this.corpusRangeLabel}
                                </span>
                            </div>
                            
                            <div class="key-insight">
                                <div class="insight-header">
                                    <span class="ai-indicator">✨</span>
                                    <span class="insight-label">AI-Generated Synthesis</span>
                                </div>
                                <div class="insight-text">
                                    <strong>${defaultData.synthesis.title}:</strong> ${highlightedContent}
                                </div>
                            </div>
                            
                            <div class="weekly-brief-cta">
                                <span class="cta-icon">💡</span>
                                <span class="cta-text">Get insights like these in your Weekly Intelligence Brief</span>
                                <a href="pdf/weekly-brief.html" class="cta-link" target="_blank">Learn more</a>
                            </div>
                            
                            <div class="source-previews" id="sourcePreviewsContainer">
                                ${defaultData.sources.map(source => 
                                    this.createQuoteCard(source.podcast, source.guest, source.timeAgo, source.duration, source.quote)
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="action-row">
                            <button class="panel-search-btn" onclick="patternFlowSearch.shareInsight()">Share Insight</button>
                        </div>
                    </div>
                </div>
            `;
            
            const panelDiv = document.createElement('div');
            panelDiv.innerHTML = panelHtml;
            document.body.appendChild(panelDiv.firstElementChild);
        }
        
        // Keep the old structure temporarily for backwards compatibility
        // This will be removed once all references are updated
        if (!document.getElementById('queryDisplay')) {
            const hiddenDiv = document.createElement('div');
            hiddenDiv.innerHTML = '<div id="queryDisplay" style="display:none;"></div>';
            document.body.appendChild(hiddenDiv.firstElementChild);
        }
    }
    
    bindEvents() {
        // Focus/blur events
        this.searchInput.addEventListener('focus', () => this.handleFocus());
        this.searchInput.addEventListener('blur', (e) => this.handleBlur(e));
        
        // Input events
        this.searchInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        
        // Keyboard shortcuts - use the pre-bound handler from constructor
        // Add to both document and window with capture phase to intercept browser defaults
        document.addEventListener('keydown', this.boundHandleGlobalKeydown, true);
        window.addEventListener('keydown', this.boundHandleGlobalKeydown, true);
        
        // Close handlers
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeResults());
        }
        
        // Close button click
        const closeBtn = document.querySelector('.search-panel-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeResults());
        }
        
        // Play button clicks. Delegated from the panel: the source cards are
        // replaced on every search, so binding to the buttons directly only
        // ever reached the ones present at init.
        const panel = document.getElementById('searchPanel');
        if (panel) {
            panel.addEventListener('click', (e) => {
                const button = e.target.closest('.play-clip-btn');
                if (!button) return;
                e.stopPropagation();
                this.handlePlayClip(button);
            });
        }
    }
    
    handleFocus() {
        if (this.searchDropdown) {
            this.searchDropdown.classList.add('active');
        }
        this.startPlaceholderRotation();
    }
    
    handleBlur(e) {
        // Delay to allow click events on dropdown items
        setTimeout(() => {
            if (!this.searchInput.value && this.searchDropdown) {
                this.searchDropdown.classList.remove('active');
            }
        }, 200);
        this.stopPlaceholderRotation();
    }
    
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.performSearch();
        }
    }
    
    handleGlobalKeydown(e) {
        console.log('Keydown event:', e.key, 'Ctrl:', e.ctrlKey, 'Meta:', e.metaKey);
        
        // Cmd/Ctrl + K to focus search (handle both lowercase and uppercase)
        // Also support Cmd/Ctrl + / as fallback
        if (((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) ||
            ((e.metaKey || e.ctrlKey) && e.key === '/')) {
            console.log('Cmd/Ctrl+K detected!');
            
            // Prevent ALL default behaviors
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Return false for legacy browser support
            if (e.returnValue !== undefined) {
                e.returnValue = false;
            }
            
            console.log('Search input element:', this.searchInput);
            
            // Check if search input is visible
            if (this.searchInput) {
                const rect = this.searchInput.getBoundingClientRect();
                const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                
                if (!isInViewport) {
                    // Scroll to top if not visible
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Delay focus until scroll completes
                    setTimeout(() => {
                        this.focusSearchInput();
                    }, 300);
                } else {
                    // Focus immediately if visible
                    this.focusSearchInput();
                }
            } else {
                console.error('Search input not found! Attempting to find it...');
                // Try to find the input again
                this.searchInput = document.getElementById('searchInput');
                if (this.searchInput) {
                    this.focusSearchInput();
                }
            }
            
            return false; // Extra prevention for older browsers
        }
        
        // ESC to close results or dropdown
        if (e.key === 'Escape') {
            if (this.searchPanel?.classList.contains('active')) {
                this.closeResults();
            }
        }
    }
    
    focusSearchInput() {
        if (!this.searchInput) {
            console.error('Cannot focus: search input is null');
            return;
        }
        
        console.log('Focusing search input...');
        
        // Clear any existing focus
        if (document.activeElement && document.activeElement !== this.searchInput) {
            document.activeElement.blur();
        }
        
        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
            this.searchInput.focus();
            this.searchInput.select();
            
            // Verify focus was successful
            setTimeout(() => {
                if (document.activeElement === this.searchInput) {
                    console.log('Search input focused successfully');
                    // Send message to parent if in iframe
                    if (window.parent !== window) {
                        window.parent.postMessage({ type: 'search-focused' }, '*');
                    }
                } else {
                    console.log('Focus failed, current active element:', document.activeElement);
                    // Try one more time
                    this.searchInput.focus();
                }
            }, 10);
        });
    }
    
    startPlaceholderRotation() {
        if (this.placeholderInterval) return;
        
        this.placeholderInterval = setInterval(() => {
            if (document.activeElement !== this.searchInput) {
                this.stopPlaceholderRotation();
                return;
            }
            if (!this.searchInput.value) {
                this.searchInput.placeholder = this.placeholders[this.placeholderIndex % this.placeholders.length];
                this.placeholderIndex++;
            }
        }, 3000);
    }
    
    stopPlaceholderRotation() {
        if (this.placeholderInterval) {
            clearInterval(this.placeholderInterval);
            this.placeholderInterval = null;
        }
        this.searchInput.placeholder = "What are VCs discussing?";
    }
    
    fillSearch(query) {
        this.searchInput.value = query;
        if (this.searchDropdown) {
            this.searchDropdown.classList.remove('active');
        }
        this.performSearch();
    }
    
    filterBy(type) {
        const filterQueries = {
            'consensus': "What's the consensus on ",
            'contrarian': "Contrarian views on ",
            'emerging': "Emerging themes in ",
            'deals': "Recent deals in ",
            'people': "What is [person] saying about "
        };
        this.searchInput.value = filterQueries[type] || "";
        this.searchInput.focus();
    }
    
    performSearch() {
        if (!this.searchInput.value.trim()) return;
        
        if (this.searchDropdown) {
            this.searchDropdown.classList.remove('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Update search query text (keeping for backward compatibility)
        if (this.searchQueryText) {
            this.searchQueryText.textContent = this.searchInput.value;
        }
        
        // Legacy support
        if (this.queryDisplay) {
            this.queryDisplay.textContent = this.searchInput.value;
        }
        
        // Update panel input to match
        const panelInput = document.getElementById('panelSearchInput');
        if (panelInput) {
            panelInput.value = this.searchInput.value;
        }
        
        // Show panel and backdrop first so the loading state is visible while
        // the live search request is in flight.
        if (this.backdrop) {
            this.backdrop.classList.add('active');
        }
        
        if (this.searchPanel) {
            this.searchPanel.classList.add('active');
        }
        
        // Kick off the live search (async - renders when the API responds)
        this.updateResultsForQuery(this.searchInput.value);
        
        // Temporary console logs to verify correct pattern
        console.log('Search Panel Config:', {
            width: getComputedStyle(this.searchPanel).width,  // Should be 50% of viewport
            backdrop: getComputedStyle(this.backdrop).backgroundColor,  // Should be "rgba(0, 0, 0, 0.3)"
            blur: getComputedStyle(this.backdrop).backdropFilter,  // Should be "none"
            animation: getComputedStyle(this.searchPanel).transition  // Should match Notable Signals
        });
    }
    
    generateClipDuration() {
        // Generate random duration between 30-50 seconds
        const seconds = Math.floor(Math.random() * 21) + 30; // 30-50 seconds
        return `0:${seconds}`;
    }
    
    /**
     * Live search. Replaces the previous unified-data.js lookup with a call to
     * POST /api/search on the PodInsight API.
     */
    async updateResultsForQuery(query) {
        const trimmed = (query || '').trim();
        if (!trimmed) return;

        this.lastQuery = trimmed;
        const requestId = ++this.searchRequestId;

        this.setPanelState('loading');

        let data;
        try {
            data = await this.fetchSearchResults(trimmed);
        } catch (error) {
            if (requestId !== this.searchRequestId) return; // superseded
            console.error('Search request failed:', error);
            this.setPanelState('error', this.describeSearchError(error));
            return;
        }

        if (requestId !== this.searchRequestId) return; // superseded

        if (!data) {
            this.setPanelState('error', 'The API returned an empty response.');
            return;
        }

        // A deliberate refusal is a result, not a failure. The API sets
        // no_matches when nothing cleared the reranker cutoff, or when the
        // passages it did retrieve turned out not to answer the question.
        if (data.no_matches) {
            this.setPanelState('no_matches', {
                reason: data.no_matches_reason,
                topScore: data.top_score,
                cutoff: data.cutoff
            });
            return;
        }

        if (!data.answer || !data.answer.text) {
            this.setPanelState('error', 'The API responded but returned no synthesis for this query.');
            return;
        }

        this.renderSearchResults(trimmed, data);
        this.setPanelState('results');
    }

    async fetchSearchResults(query) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeoutMs);

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, limit: this.apiSearchLimit }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    describeSearchError(error) {
        if (error && error.name === 'AbortError') {
            return `No response after ${Math.round(this.apiTimeoutMs / 1000)} seconds. The search service may still be starting up.`;
        }
        if (error && /HTTP \d/.test(error.message || '')) {
            return `The search service returned an error (${error.message}).`;
        }
        return `Could not reach the search service at ${this.apiBaseUrl}. Check that it is running.`;
    }

    retrySearch() {
        if (this.lastQuery) {
            this.updateResultsForQuery(this.lastQuery);
        }
    }

    /**
     * Toggle between the loading skeleton, the error card and the results.
     */
    setPanelState(state, message) {
        const panel = document.getElementById('searchPanel');
        if (!panel) return;

        const loading = panel.querySelector('#searchLoadingState');
        const error = panel.querySelector('#searchErrorState');
        const noMatch = panel.querySelector('#searchNoMatchState');
        const results = panel.querySelector('.synthesis-content');
        const actions = panel.querySelector('.action-row');

        // .search-state blocks are display:none in CSS, so show them explicitly.
        const showState = (el, visible) => { if (el) el.style.display = visible ? 'block' : 'none'; };
        const show = (el, visible) => { if (el) el.style.display = visible ? '' : 'none'; };

        showState(loading, state === 'loading');
        showState(error, state === 'error');
        showState(noMatch, state === 'no_matches');
        show(results, state === 'results');
        show(actions, state === 'results');

        if (state === 'error') {
            const messageEl = panel.querySelector('#searchErrorMessage');
            if (messageEl) {
                messageEl.textContent = message || 'Something went wrong.';
            }
        }

        if (state === 'no_matches') {
            const messageEl = panel.querySelector('#searchNoMatchMessage');
            const detailEl = panel.querySelector('#searchNoMatchDetail');
            const info = message || {};
            if (messageEl) {
                messageEl.textContent = info.reason
                    || 'Nothing in the library scored above the relevance floor.';
            }
            if (detailEl) {
                // Show the numbers. A refusal the user cannot inspect reads as
                // a failure; one with a score against a threshold reads as a
                // judgement.
                detailEl.textContent = (typeof info.topScore === 'number')
                    ? `Best match scored ${info.topScore.toPrecision(3)} against a floor of `
                      + `${Number(info.cutoff).toPrecision(3)}. This is a deliberate answer, not an error.`
                    : 'This is a deliberate answer, not an error.';
            }
        }
    }

    escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Map the API response onto the existing panel markup.
     *   answer.text      -> AI-Generated Synthesis block
     *   answer.citations -> source quote cards
     */
    renderSearchResults(query, data) {
        const panel = document.getElementById('searchPanel');
        if (!panel) {
            console.error('Search panel not found');
            return;
        }

        const answer = data.answer || {};
        const citations = Array.isArray(answer.citations) ? answer.citations : [];

        const discussionCount = panel.querySelector('.discussion-count');
        if (discussionCount) {
            const total = typeof data.total_results === 'number' ? data.total_results : citations.length;
            discussionCount.textContent = `Based on ${total} matching segment${total === 1 ? '' : 's'}`;
        }

        const insightText = panel.querySelector('.insight-text');
        if (insightText) {
            // The API appends a constant "(95% confidence)" to every answer.
            // It is the same number on every query, so it is not shown.
            const body = String(answer.text)
                .replace(/\s*\(\d+% confidence\)\s*$/, '')
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => this.escapeHtml(line))
                .join('<br>');

            insightText.innerHTML = `<strong>${this.escapeHtml(query)}</strong>` +
                `<div class="synthesis-body">${body}</div>`;
        }

        const sourcePreviewsContainer = document.getElementById('sourcePreviewsContainer');
        if (sourcePreviewsContainer) {
            sourcePreviewsContainer.innerHTML = citations.length
                ? citations.map(citation => this.createCitationCard(citation)).join('')
                : '<div class="search-state-note">No supporting citations returned for this query.</div>';
        }
    }

    createCitationCard(citation) {
        const truncateLength = 100;
        const quoteText = citation.chunk_text || '';
        const needsTruncation = quoteText.length > truncateLength;
        const truncatedText = needsTruncation ? quoteText.substring(0, truncateLength) + '...' : quoteText;
        const cardId = 'quote-' + Date.now() + Math.random();

        const podcast = this.escapeHtml(citation.podcast_name || 'Unknown podcast');
        const episode = this.escapeHtml(citation.episode_title || 'Unknown episode');
        const timestamp = this.escapeHtml(citation.timestamp || '');
        const episodeId = this.escapeHtml(citation.episode_id || '');
        const startMs = Math.max(0, Math.round((citation.start_seconds || 0) * 1000));
        const score = typeof citation.similarity_score === 'number'
            ? `${Math.round(citation.similarity_score * 100)}% match`
            : '';

        return `
            <div class="source-card">
                <div class="source-header">
                    <div class="source-info">
                        <span>🎙️</span>
                        <span>${podcast}</span>
                        ${timestamp ? `<span>• ${timestamp}</span>` : ''}
                    </div>
                    ${score ? `<span class="source-score">${score}</span>` : ''}
                </div>
                <div class="source-episode">${episode}</div>
                <div class="quote-text ${needsTruncation ? 'truncated' : ''}" id="${cardId}">
                    <span class="quote-content">${this.escapeHtml(truncatedText)}</span>
                    ${needsTruncation ? `<a href="#" class="show-more-link" onclick="patternFlowSearch.toggleQuote(event, '${cardId}')">Show more</a>` : ''}
                </div>
                <button class="play-clip-btn" data-duration="${timestamp}"
                        data-episode-id="${episodeId}" data-start-ms="${startMs}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="7" cy="7" r="6"/>
                        <path d="M5.5 4.5v5l4-2.5z" fill="currentColor" stroke="none"/>
                    </svg>
                    Play clip
                </button>
                ${needsTruncation ? `<div class="quote-full-text" style="display:none">${this.escapeHtml(quoteText)}</div>` : ''}
            </div>
        `;
    }

    closeResults() {
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove active classes
        if (this.searchPanel) {
            this.searchPanel.classList.remove('active');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
        
        // Clear search input
        this.searchInput.value = '';
    }
    
    // Action handlers
    shareInsight() {
        alert('In production: Share to Slack, Email, or copy formatted insight');
    }
    
    
    newSearch() {
        // Close the panel
        this.closeResults();
        
        // Focus the search input after a brief delay to allow panel to close
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
                this.searchInput.select();
            }
        }, 300);
    }
    
    searchFromPanel() {
        const panelInput = document.getElementById('panelSearchInput');
        if (!panelInput || !panelInput.value.trim()) return;
        
        const newQuery = panelInput.value.trim();
        
        // Update the displayed query
        if (this.searchQueryText) {
            this.searchQueryText.textContent = newQuery;
        }
        
        // Legacy support
        if (this.queryDisplay) {
            this.queryDisplay.textContent = newQuery;
        }
        
        // Update main search input to keep in sync
        if (this.searchInput) {
            this.searchInput.value = newQuery;
        }
        
        // Log for demo purposes
        console.log('New search from panel:', newQuery);
        
        // Update results based on new query
        this.updateResultsForQuery(newQuery);
        
    }
    
    /**
     * Play a 30s clip for a citation.
     *
     * GET /api/v1/audio_clips/{episode_id}?start_time_ms=&duration_ms=30000
     * returns a presigned S3 URL. Generation is not instant (12-16s typical,
     * longer for long episodes), hence the explicit loading state.
     */
    async handlePlayClip(button) {
        if (button.classList.contains('loading')) return;

        if (button.classList.contains('playing')) {
            this.stopClip(button);
            return;
        }

        const episodeId = button.dataset.episodeId;
        const startMs = button.dataset.startMs;

        // The legacy mock cards carry no episode id - keep their old simulated
        // behaviour rather than firing a request that cannot succeed.
        if (!episodeId) {
            this.simulatePlayClip(button);
            return;
        }

        // Only one clip at a time
        document.querySelectorAll('.play-clip-btn.playing').forEach(other => this.stopClip(other));

        this.setButtonState(button, 'loading', 'Generating clip…');

        let clipUrl;
        try {
            clipUrl = await this.fetchClipUrl(episodeId, startMs);
        } catch (error) {
            console.error('Clip generation failed:', error);
            this.setButtonState(button, 'error', 'Clip unavailable');
            button.title = this.describeClipError(error);
            setTimeout(() => this.setButtonState(button, 'idle', 'Play clip'), 6000);
            return;
        }

        try {
            await this.startAudio(button, clipUrl);
        } catch (error) {
            console.error('Clip playback failed:', error);
            this.setButtonState(button, 'error', 'Playback failed');
            button.title = (error && error.message) || 'The browser could not play this clip.';
            setTimeout(() => this.setButtonState(button, 'idle', 'Play clip'), 6000);
        }
    }

    async fetchClipUrl(episodeId, startMs) {
        const controller = new AbortController();
        // Well above the API's own Lambda timeout
        const timeoutId = setTimeout(() => controller.abort(), 90000);

        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/v1/audio_clips/${encodeURIComponent(episodeId)}` +
                `?start_time_ms=${encodeURIComponent(startMs)}&duration_ms=30000`,
                { signal: controller.signal }
            );

            if (!response.ok) {
                let detail = '';
                try {
                    const body = await response.json();
                    detail = body.detail || '';
                } catch (e) { /* non-JSON error body */ }
                const error = new Error(`HTTP ${response.status}`);
                error.status = response.status;
                error.detail = detail;
                throw error;
            }

            const data = await response.json();
            if (!data.clip_url) throw new Error('No clip_url in response');
            console.log('Clip ready:', data.clip_url.split('?')[0], `(${data.generation_time_ms}ms, cache_hit=${data.cache_hit})`);
            return data.clip_url;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    describeClipError(error) {
        if (error && error.name === 'AbortError') {
            return 'The clip took more than 90 seconds to generate.';
        }
        if (error && error.status) {
            return `The audio service returned ${error.status}${error.detail ? ': ' + error.detail : ''}`;
        }
        return `Could not reach the audio service at ${this.apiBaseUrl}.`;
    }

    startAudio(button, clipUrl) {
        return new Promise((resolve, reject) => {
            if (this.audio) {
                this.audio.pause();
                this.audio.src = '';
            }

            const audio = new Audio(clipUrl);
            this.audio = audio;
            this.audioButton = button;

            audio.addEventListener('ended', () => this.stopClip(button));
            audio.addEventListener('error', () => reject(new Error('The clip could not be decoded.')));

            audio.play().then(() => {
                this.setButtonState(button, 'playing', 'Playing…');
                resolve();
            }).catch(reject);
        });
    }

    /** Swap the button between idle / loading / playing / error. */
    setButtonState(button, state, label) {
        button.classList.remove('loading', 'playing', 'error');
        if (state !== 'idle') button.classList.add(state);
        if (state === 'idle') button.title = '';

        const icons = {
            idle: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                     <circle cx="7" cy="7" r="6"/><path d="M5.5 4.5v5l4-2.5z" fill="currentColor" stroke="none"/></svg>`,
            loading: `<span class="clip-spinner" aria-hidden="true"></span>`,
            playing: `<div class="audio-wave"><span></span><span></span><span></span></div>`,
            error: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="7" cy="7" r="6"/><path d="M7 4v3.5M7 9.5v.5"/></svg>`
        };

        button.innerHTML = `${icons[state] || icons.idle} ${label}`;
    }

    /** Legacy behaviour for the mock cards that have no episode id. */
    simulatePlayClip(button) {
        if (button.classList.contains('playing')) {
            this.stopClip(button);
            return;
        }
        document.querySelectorAll('.play-clip-btn.playing').forEach(other => this.stopClip(other));
        this.setButtonState(button, 'playing', 'Playing…');
        button.playTimeout = setTimeout(() => this.stopClip(button), 5000);
    }

    stopClip(button) {
        if (button.playTimeout) {
            clearTimeout(button.playTimeout);
            delete button.playTimeout;
        }
        if (this.audio && this.audioButton === button) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.setButtonState(button, 'idle', 'Play clip');
    }

    // Toggle quote expansion
    toggleQuote(event, cardId) {
        event.preventDefault();
        const quoteDiv = document.getElementById(cardId);
        const card = quoteDiv.closest('.source-card');
        const fullTextDiv = card.querySelector('.quote-full-text');
        const contentSpan = quoteDiv.querySelector('.quote-content');
        const showMoreLink = quoteDiv.querySelector('.show-more-link');
        
        if (!fullTextDiv) return;
        
        const isExpanded = quoteDiv.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            quoteDiv.classList.remove('expanded');
            contentSpan.textContent = fullTextDiv.textContent.substring(0, 100) + '...';
            showMoreLink.textContent = 'Show more';
        } else {
            // Expand
            quoteDiv.classList.add('expanded');
            contentSpan.textContent = fullTextDiv.textContent;
            showMoreLink.textContent = 'Show less';
        }
    }
    
    // Populate quick questions based on query
    handleQuestionClick(event, question) {
        event.preventDefault();
        console.log(`Quick question clicked: ${question}`);
        
        // Update the search input
        const panelInput = document.getElementById('panelSearchInput');
        if (panelInput) {
            panelInput.value = question;
        }
        
        // Also update main search input
        if (this.searchInput) {
            this.searchInput.value = question;
        }
        
        // In production, this would trigger a new search
        // For demo, just log it
        console.log('Would perform new search with:', question);
        
        // Update results for demo
        this.updateResultsForQuery(question);
    }
    
    // Handle quote action clicks
    handleQuoteAction(event, action) {
        event.preventDefault();
        console.log(`Quote action clicked: ${action}`);
        
        // In production, these would have real implementations
        switch(action) {
            case 'context':
                console.log('Would show full episode context and surrounding discussion');
                break;
            case 'save':
                console.log('Would save quote to user\'s notebook/collection');
                break;
        }
    }
    
    // Handle quote action clicks
    handleQuoteAction(event, action) {
        event.preventDefault();
        console.log(`Quote action clicked: ${action}`);
        
        // In production, these would have real implementations
        switch(action) {
            case 'context':
                console.log('Would show full episode context and surrounding discussion');
                break;
            case 'save':
                console.log('Would save quote to user\'s notebook/collection');
                break;
        }
    }
    
    destroy() {
        // Remove event listeners
        if (this.boundHandleGlobalKeydown) {
            document.removeEventListener('keydown', this.boundHandleGlobalKeydown, true);
            window.removeEventListener('keydown', this.boundHandleGlobalKeydown, true);
        }
        
        // Clear intervals
        if (this.placeholderInterval) {
            clearInterval(this.placeholderInterval);
        }
        
        console.log('PatternFlowSearch destroyed');
    }
}

// Create global instance
const patternFlowSearch = new PatternFlowSearch();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => patternFlowSearch.init());
} else {
    patternFlowSearch.init();
}

// Export for use in other modules
window.patternFlowSearch = patternFlowSearch;