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
        
        // Timeframe options
        this.timeframeOptions = [
            { label: 'Last 7 days', value: '7days', discussions: 14, default: true },
            { label: 'Last 30 days', value: '30days', discussions: 47 },
            { label: 'Last 3 months', value: '3months', discussions: 156 },
            { label: 'Last 6 months', value: '6months', discussions: 289 },
            { label: 'Since last Monday', value: 'lastmonday', discussions: 11 },
            { label: 'This quarter', value: 'quarter', discussions: 98 },
            { label: 'Year to date', value: 'ytd', discussions: 412 }
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
            // Generate initial random durations
            const duration1 = Math.floor(Math.random() * 21) + 30; // 30-50 seconds
            const duration2 = Math.floor(Math.random() * 21) + 30; // 30-50 seconds
            
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
                                <span class="confidence-value">89% confidence</span>
                                <span class="separator">•</span>
                                <span class="discussion-count">Based on ${this.selectedTimeframe.discussions} discussions</span>
                                <span class="separator">•</span>
                                <span class="timeframe-selector" onclick="patternFlowSearch.toggleTimeframeDropdown(event)">
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
                                    <strong>Strong consensus forming:</strong> Vertical AI applications with <span class="highlight">proprietary data moats</span> are seeing 2-3x better retention than horizontal plays. The narrative has shifted from "AI for everything" to <span class="highlight">"AI for specific workflows"</span> with deep domain expertise.
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
                                ${this.createQuoteCard('20VC', 'Brad Gerstner', '2 days ago', duration1, "The winners in AI won't be the broadest platforms, they'll be the ones who own the workflow. Look at what's happening with Salesforce and ServiceNow - they're embedding AI into existing enterprise workflows where the data already lives. That's the moat.")}
                                ${this.createQuoteCard('Invest Like Best', 'Elad Gil', '4 days ago', duration2, "Vertical AI is where we're seeing actual revenue, not just usage. Legal, healthcare, finance - these verticals have specific compliance needs, data requirements, and workflow patterns that horizontal platforms can't address effectively.")}
                            </div>
                        </div>
                        
                        <div class="action-row">
                            <button class="btn btn-primary" onclick="patternFlowSearch.viewDeepAnalysis()">View Deep Analysis</button>
                            <button class="btn" onclick="patternFlowSearch.shareInsight()">Share Insight</button>
                            <button class="btn" onclick="patternFlowSearch.saveToNotebook()">Save to Notebook</button>
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
        
        // Show panel and backdrop
        if (this.backdrop) {
            this.backdrop.classList.add('active');
        }
        
        if (this.searchPanel) {
            this.searchPanel.classList.add('active');
        }
        
        // Update results based on query
        this.updateResultsForQuery(this.searchInput.value);
        
        // Temporary console logs to verify correct pattern
        console.log('Search Panel Config:', {
            width: getComputedStyle(this.searchPanel).width,  // Should be "480px"
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
        const confidenceValue = document.querySelector('.confidence-value');
        const discussionCount = document.querySelector('.discussion-count');
        const insightText = document.querySelector('.insight-text');
        const sourceCards = document.querySelectorAll('.source-card');
        
        if (!confidenceValue || !discussionCount || !insightText) return;
        
        // Update source cards with random durations
        sourceCards.forEach(card => {
            const sourceInfo = card.querySelector('.source-info');
            if (sourceInfo) {
                // Get existing text and split by bullets
                const spans = sourceInfo.querySelectorAll('span');
                if (spans.length >= 3) {
                    const duration = this.generateClipDuration();
                    // Check if duration already exists to avoid duplicating
                    const currentText = spans[2].textContent;
                    if (!currentText.includes('0:')) {
                        // Only add duration if it doesn't already exist
                        spans[2].textContent = currentText + ` • ${duration}`;
                    }
                    
                    // Also update the play button data attribute
                    const playBtn = card.querySelector('.play-clip-btn');
                    if (playBtn) {
                        playBtn.setAttribute('data-duration', duration.replace('0:', ''));
                    }
                }
            }
        });
        
        if (query.toLowerCase().includes('contrarian')) {
            confidenceValue.textContent = '76% confidence';
            discussionCount.textContent = 'Based on 3 dissenting voices';
            insightText.innerHTML = '<strong>Limited contrarian views:</strong> While the majority is bullish on AI, Peter Thiel and others question <span class="highlight">timeline to profitability</span>. "We\'re building infrastructure for use cases that don\'t exist yet."';
        } else if (query.toLowerCase().includes('series a')) {
            confidenceValue.textContent = '91% confidence';
            discussionCount.textContent = 'Based on 8 discussions';
            insightText.innerHTML = '<strong>Valuation normalization:</strong> Series A rounds settling at <span class="highlight">20-30x ARR</span> for AI companies, down from 50-100x in 2023. "Reality is setting in," per Benchmark\'s latest.';
        } else if (query.toLowerCase().includes('brad gerstner')) {
            confidenceValue.textContent = '94% confidence';
            discussionCount.textContent = 'Based on 3 appearances';
            insightText.innerHTML = '<strong>Gerstner\'s thesis evolution:</strong> Shifted focus to <span class="highlight">AI infrastructure plays</span> and companies with "10x productivity gains". Emphasizing capital efficiency over growth at all costs.';
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
        alert('In production: Opens comprehensive analysis with all sources, timeline, and dissenting views');
    }
    
    shareInsight() {
        alert('In production: Share to Slack, Email, or copy formatted insight');
    }
    
    saveToNotebook() {
        alert('In production: Save to your intelligence notebook for future reference');
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
    
    // Toggle timeframe dropdown
    toggleTimeframeDropdown(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('timeframeDropdown');
        if (!dropdown) return;
        
        const isOpen = dropdown.classList.contains('active');
        
        // Close any other open dropdowns
        document.querySelectorAll('.timeframe-dropdown').forEach(d => d.classList.remove('active'));
        
        if (!isOpen) {
            dropdown.classList.add('active');
            
            // Add click outside listener
            setTimeout(() => {
                document.addEventListener('click', this.closeTimeframeDropdown);
            }, 0);
        } else {
            this.closeTimeframeDropdown();
        }
    }
    
    // Close timeframe dropdown
    closeTimeframeDropdown = () => {
        const dropdown = document.getElementById('timeframeDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
        document.removeEventListener('click', this.closeTimeframeDropdown);
    }
    
    // Select timeframe option
    selectTimeframe(value, event) {
        event.stopPropagation();
        
        // Find the selected option
        const option = this.timeframeOptions.find(opt => opt.value === value);
        if (!option) return;
        
        // Update selected timeframe
        this.selectedTimeframe = option;
        
        // Update display
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