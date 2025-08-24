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
        
        // Timeframe options - keep it simple with 3 most relevant options
        this.timeframeOptions = [
            { label: 'Last 7 days', value: '7days', discussions: 14, default: true },
            { label: 'Last 30 days', value: '30days', discussions: 47 },
            { label: 'Last 90 days', value: '90days', discussions: 156 }
        ];
        
        // Current selected timeframe
        this.selectedTimeframe = this.timeframeOptions.find(opt => opt.default) || this.timeframeOptions[1];
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
        
        // Clean up any stuck dropdowns from previous sessions
        const timeframeDropdown = document.getElementById('timeframeDropdown');
        if (timeframeDropdown) {
            timeframeDropdown.classList.remove('active');
            timeframeDropdown.style.cssText = '';
            delete timeframeDropdown.dataset.source;
        }
        
        // Bind events
        this.bindEvents();
        
        this.isInitialized = true;
    }
    
    getQuickQuestions(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('vertical ai')) {
            return [
                'How do vertical AI valuations compare to horizontal?',
                'Which verticals are seeing highest retention?',
                'What are LPs saying about vertical AI investments?',
                'Compare vertical AI performance to 2023 AI investments'
            ];
        } else if (lowerQuery.includes('contrarian')) {
            return [
                'Who are the main contrarian voices in VC?',
                'What successful contrarian bets paid off?',
                'How do contrarian views on AI differ from consensus?',
                'Which VCs have the best contrarian track records?'
            ];
        } else if (lowerQuery.includes('series a')) {
            return [
                'How have Series A valuations changed YoY?',
                'What metrics matter most for Series A in 2024?',
                'Which sectors have the highest Series A activity?',
                'How long are companies taking to reach Series A?'
            ];
        } else if (lowerQuery.includes('brad gerstner')) {
            return [
                'What is Gerstner\'s latest investment thesis?',
                'How does Gerstner view AI infrastructure plays?',
                'What companies is Altimeter Capital backing?',
                'Compare Gerstner\'s views to other growth investors'
            ];
        } else {
            // Default questions for generic searches
            return [
                'What\'s the consensus view on this topic?',
                'Who are the contrarian voices?',
                'What are the investment implications?',
                'How has this narrative evolved over time?'
            ];
        }
    }
    
    generateTimeframeOptions() {
        return this.timeframeOptions.map(option => `
            <div class="timeframe-option ${option.value === this.selectedTimeframe.value ? 'selected' : ''}" 
                 onmousedown="event.preventDefault()"
                 onclick="patternFlowSearch.selectTimeframe('${option.value}', event)">
                ${option.value === this.selectedTimeframe.value ? '<span class="checkmark">✓</span>' : '<span class="checkmark-placeholder"></span>'}
                <span>${option.label}</span>
            </div>
        `).join('');
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
                        <div class="synthesis-content">
                            <div class="confidence-metadata">
                                <span class="confidence-value">${defaultData.confidence} confidence</span>
                                <span class="separator">•</span>
                                <span class="discussion-count">Based on ${defaultData.discussions || this.selectedTimeframe.discussions} discussions</span>
                                <span class="separator">•</span>
                                <span class="timeframe-selector" 
                                      onclick="patternFlowSearch.toggleTimeframeDropdown(event, 'results')"
                                      aria-haspopup="true" 
                                      aria-controls="timeframeDropdown" 
                                      aria-expanded="false">
                                    <span class="timeframe-text">${this.selectedTimeframe.label}</span>
                                    <span class="dropdown-arrow">▾</span>
                                    <div class="timeframe-dropdown" id="timeframeDropdown">
                                        ${this.generateTimeframeOptions()}
                                    </div>
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
                            
                            <div class="quick-questions">
                                <div class="questions-header">
                                    <span class="questions-icon">🔍</span>
                                    <span class="questions-title">Explore further:</span>
                                </div>
                                <div class="questions-list" id="quickQuestionsList">
                                    <!-- Questions will be dynamically inserted here -->
                                </div>
                            </div>
                            
                            <div class="source-previews" id="sourcePreviewsContainer">
                                ${defaultData.sources.map(source => 
                                    this.createQuoteCard(source.podcast, source.guest, source.timeAgo, source.duration, source.quote)
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="action-row">
                            <button class="panel-search-btn" onclick="patternFlowSearch.viewDeepAnalysis()">View Full Brief</button>
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
        
        // Play button clicks
        document.querySelectorAll('.play-clip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlePlayClip(btn);
            });
        });
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
            // First check if timeframe dropdown is open
            const timeframeDropdown = document.getElementById('timeframeDropdown');
            if (timeframeDropdown && timeframeDropdown.classList.contains('active')) {
                this.closeTimeframeDropdown();
            } else if (this.searchPanel?.classList.contains('active')) {
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
        
        // Populate quick questions
        this.populateQuickQuestions(this.searchInput.value);
        
        // Update results based on query BEFORE showing panel
        this.updateResultsForQuery(this.searchInput.value);
        
        // Show panel and backdrop AFTER content is updated
        if (this.backdrop) {
            this.backdrop.classList.add('active');
        }
        
        if (this.searchPanel) {
            this.searchPanel.classList.add('active');
        }
        
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
    
    updateResultsForQuery(query) {
        const searchData = window.unifiedData?.searchResults;
        if (!searchData) {
            console.error('Search data not found in unifiedData');
            return;
        }
        
        // Find matching query pattern
        let resultData = searchData.default;
        const lowerQuery = query.toLowerCase();
        
        // Check for matching patterns
        if (lowerQuery.includes('european') || lowerQuery.includes('europe')) {
            // Get the current timeframe
            const timeframeValue = this.selectedTimeframe.value;
            
            // Get the european data
            const europeanData = searchData.queries.european;
            
            // Build resultData with timeframe-specific content
            resultData = {
                confidence: europeanData.confidence,
                discussions: europeanData.discussions[timeframeValue],
                synthesis: europeanData.synthesis[timeframeValue],
                sources: europeanData.sources[timeframeValue] || searchData.default.sources
            };
        } else if (lowerQuery.includes('revolut')) {
            resultData = searchData.queries.revolut;
        } else if (lowerQuery.includes('fintech profitability')) {
            resultData = searchData.queries.fintech_profitability;
        } else if (lowerQuery.includes('contrarian')) {
            resultData = searchData.queries.contrarian;
        } else if (lowerQuery.includes('series a')) {
            resultData = searchData.queries.series_a;
        } else if (lowerQuery.includes('brad gerstner')) {
            resultData = searchData.queries.brad_gerstner;
        } else if (lowerQuery.includes('vertical ai')) {
            // Get the current timeframe
            const timeframeValue = this.selectedTimeframe.value; // '7days', '30days', or '90days'
            
            // Get the vertical_ai data
            const verticalData = searchData.queries.vertical_ai;
            
            // Build resultData with timeframe-specific content
            resultData = {
                confidence: verticalData.confidence,
                discussions: verticalData.discussions[timeframeValue],
                synthesis: verticalData.synthesis[timeframeValue],
                sources: verticalData.sources[timeframeValue] || searchData.default.sources
            };
        }
        
        // Update UI elements with data from unified source
        // IMPORTANT: Only look for elements within the search panel to avoid updating wrong elements
        const searchPanel = document.getElementById('searchPanel');
        if (!searchPanel) {
            console.error('Search panel not found');
            return;
        }
        
        const confidenceValue = searchPanel.querySelector('.confidence-value');
        const discussionCount = searchPanel.querySelector('.discussion-count');
        const insightText = searchPanel.querySelector('.insight-text');
        
        if (confidenceValue) {
            confidenceValue.textContent = `${resultData.confidence} confidence`;
        }
        
        if (discussionCount) {
            discussionCount.textContent = `Based on ${resultData.discussions} discussions`;
        }
        
        if (insightText) {
            // Apply highlighting to certain terms
            let htmlContent = resultData.synthesis.content
                .replace(/\$5M ARR/g, '<span class="highlight">$5M ARR</span>')
                .replace(/\$2-3M threshold/g, '<span class="highlight">$2-3M threshold</span>')
                .replace(/Revolut's Q2 numbers/g, '<span class="highlight">Revolut\'s Q2 numbers</span>')
                .replace(/20-30x ARR/g, '<span class="highlight">20-30x ARR</span>')
                .replace(/AI infrastructure plays/g, '<span class="highlight">AI infrastructure plays</span>')
                .replace(/timeline to profitability/g, '<span class="highlight">timeline to profitability</span>')
                .replace(/proprietary data moats/g, '<span class="highlight">proprietary data moats</span>')
                .replace(/AI for specific workflows/g, '<span class="highlight">AI for specific workflows</span>');
            
            insightText.innerHTML = `<strong>${resultData.synthesis.title}:</strong> ${htmlContent}`;
        }
        
        // Update source cards if they exist
        const sourcePreviewsContainer = document.getElementById('sourcePreviewsContainer');
        if (sourcePreviewsContainer) {
            // Use specific sources if available, otherwise use default sources
            const sources = resultData.sources && resultData.sources.length > 0 
                ? resultData.sources 
                : searchData.default.sources;
            
            if (sources && sources.length > 0) {
                sourcePreviewsContainer.innerHTML = sources
                    .map(source => this.createQuoteCard(
                        source.podcast,
                        source.guest,
                        source.timeAgo,
                        source.duration,
                        source.quote
                    ))
                    .join('');
            }
        }
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
    viewDeepAnalysis() {
        // Close the search panel
        this.closeResults();
        
        // Scroll to Priority Briefings section
        const briefingsSection = document.querySelector('.priority-briefings');
        if (briefingsSection) {
            briefingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
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
        
        // Update quick questions
        this.populateQuickQuestions(newQuery);
    }
    
    // Handle play clip animation
    handlePlayClip(button) {
        // Check if already playing
        if (button.classList.contains('playing')) {
            this.stopClip(button);
            return;
        }
        
        // Stop any other playing clips
        document.querySelectorAll('.play-clip-btn.playing').forEach(btn => {
            this.stopClip(btn);
        });
        
        // Start playing this clip
        button.classList.add('playing');
        
        // Update button content
        const originalContent = button.innerHTML;
        button.innerHTML = `
            <div class="audio-wave">
                <span></span>
                <span></span>
                <span></span>
            </div>
            Playing...
        `;
        
        // Store original content for restoration
        button.dataset.originalContent = originalContent;
        
        // Simulate clip duration (5 seconds)
        button.playTimeout = setTimeout(() => {
            this.stopClip(button);
        }, 5000);
    }
    
    stopClip(button) {
        button.classList.remove('playing');
        
        // Clear timeout if exists
        if (button.playTimeout) {
            clearTimeout(button.playTimeout);
            delete button.playTimeout;
        }
        
        // Restore original content
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
            delete button.dataset.originalContent;
        }
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
    populateQuickQuestions(query) {
        const questionsList = document.getElementById('quickQuestionsList');
        if (!questionsList) return;
        
        const questions = this.getQuickQuestions(query);
        
        // Clear existing questions
        questionsList.innerHTML = '';
        
        // Add new questions
        questions.forEach(question => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'question-link';
            link.textContent = question;
            link.onclick = (e) => this.handleQuestionClick(e, question);
            questionsList.appendChild(link);
        });
    }
    
    // Handle quick question click
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
    
    // Simple toggle for timeframe dropdown
    toggleTimeframeDropdown(event, source = 'results') {
        event.stopPropagation();
        
        const dropdown = document.getElementById('timeframeDropdown');
        if (!dropdown) return;
        
        const trigger = event.currentTarget;
        const isOpen = dropdown.classList.contains('active');
        
        if (!isOpen) {
            // Open dropdown
            dropdown.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            
            // Add click outside listener after a brief delay
            setTimeout(() => {
                document.addEventListener('click', this.handleClickOutside);
            }, 10);
        } else {
            this.closeTimeframeDropdown();
        }
    }
    
    // Handle click outside dropdown
    handleClickOutside = (event) => {
        const dropdown = document.getElementById('timeframeDropdown');
        const selector = event.target.closest('.timeframe-selector');
        
        // If clicking outside the selector, close dropdown
        if (!selector) {
            this.closeTimeframeDropdown();
        }
    }
    
    // Close timeframe dropdown
    closeTimeframeDropdown = () => {
        const dropdown = document.getElementById('timeframeDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
        
        // Reset aria-expanded on trigger
        document.querySelectorAll('.timeframe-selector')
            .forEach(el => el.setAttribute('aria-expanded', 'false'));
        
        // Remove the event listener
        document.removeEventListener('click', this.handleClickOutside);
    }
    
    // Select timeframe option
    selectTimeframe(value, event) {
        event.stopPropagation();
        
        // Find the selected option
        const option = this.timeframeOptions.find(opt => opt.value === value);
        if (!option) return;
        
        // Update selected timeframe
        this.selectedTimeframe = option;
        
        // Update BOTH filter displays
        // 1. Update results panel filter
        const timeframeText = document.querySelector('.timeframe-text');
        const discussionCount = document.querySelector('.discussion-count');
        
        if (timeframeText) {
            timeframeText.textContent = option.label;
        }
        
        if (discussionCount) {
            discussionCount.textContent = `Based on ${option.discussions} discussions`;
        }
        
        // Update dropdown options to reflect new selection
        const dropdown = document.getElementById('timeframeDropdown');
        if (dropdown) {
            dropdown.innerHTML = this.generateTimeframeOptions();
        }
        
        // Close dropdown
        this.closeTimeframeDropdown();
        
        // After closing dropdown, refresh results if a search is active
        if (this.searchPanel && this.searchPanel.classList.contains('active')) {
            const currentQuery = this.searchInput.value || 'vertical ai';
            this.updateResultsForQuery(currentQuery);
        }
        
        // Log for demo
        console.log(`Timeframe selected: ${option.label} (${option.discussions} discussions)`);
        
        // In production, this would trigger a new search with the selected timeframe
        // For demo, we just update the display
        this.updateResultsForTimeframe(option);
    }
    
    // Update results based on timeframe (demo only)
    updateResultsForTimeframe(timeframe) {
        // Update confidence based on timeframe
        const confidenceValue = document.querySelector('.confidence-value');
        if (confidenceValue) {
            // Simulate different confidence levels based on data volume
            let confidence = 89;
            if (timeframe.discussions < 10) {
                confidence = Math.floor(70 + Math.random() * 10);
            } else if (timeframe.discussions > 200) {
                confidence = Math.floor(90 + Math.random() * 8);
            } else {
                confidence = Math.floor(80 + Math.random() * 15);
            }
            confidenceValue.textContent = `${confidence}% confidence`;
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
    
    // Set time filter from dropdown
    setTimeFilter(value, element, event) {
        // Stop event propagation to prevent dropdown from closing
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        // Remove active class from all options
        const allOptions = document.querySelectorAll('.inline-time-selector .time-option');
        allOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to selected option
        if (element) {
            element.classList.add('active');
        }
        
        // Update the selected timeframe (for demo purposes)
        const timeframeMap = {
            '7days': 'Last 7 days',
            '30days': 'Last 30 days',
            '90days': 'Last 90 days',
            'all': 'All time'
        };
        
        this.selectedTimeframe = {
            label: timeframeMap[value] || 'Last 7 days',
            value: value
        };
        
        // Update the results panel timeframe if it's open
        const resultsTimeframe = document.querySelector('.timeframe-text');
        if (resultsTimeframe) {
            resultsTimeframe.textContent = this.selectedTimeframe.label;
        }
        
        // Update discussions count in metadata if visible
        const discussionCount = document.querySelector('.discussion-count');
        if (discussionCount) {
            const discussionCounts = {
                '7days': 14,
                '30days': 47,
                '90days': 156
            };
            discussionCount.textContent = `Based on ${discussionCounts[value] || 14} discussions`;
        }
        
        console.log('Time filter set to:', this.selectedTimeframe.label);
    }
    
    // Clean up method
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