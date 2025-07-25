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
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Create search elements if they don't exist
        this.createSearchElements();
        
        // Get references
        this.searchInput = document.getElementById('searchInput');
        this.searchDropdown = document.getElementById('searchDropdown');
        this.searchResults = document.getElementById('searchResults');
        this.backdrop = document.getElementById('searchBackdrop');
        this.queryDisplay = document.getElementById('queryDisplay');
        
        if (!this.searchInput) {
            console.error('Search input not found');
            return;
        }
        
        // Bind events
        this.bindEvents();
        
        this.isInitialized = true;
    }
    
    createSearchElements() {
        // Check if backdrop exists, if not create it
        if (!document.getElementById('searchBackdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'search-backdrop';
            backdrop.id = 'searchBackdrop';
            document.body.appendChild(backdrop);
        }
        
        // Check if results overlay exists, if not create it
        if (!document.getElementById('searchResults')) {
            const resultsHtml = `
                <div class="search-results" id="searchResults">
                    <button class="close-results" onclick="patternFlowSearch.closeResults()">×</button>
                    
                    <div class="results-header">
                        <div class="results-title">Intelligence synthesis for:</div>
                        <div class="query-display" id="queryDisplay">What's the consensus on vertical AI?</div>
                    </div>
                    
                    <div class="synthesis-content">
                        <div class="confidence-row">
                            <span class="confidence-badge">89% confidence</span>
                            <span class="source-count">Based on 14 podcast discussions</span>
                        </div>
                        
                        <div class="key-insight">
                            <div class="insight-text">
                                <strong>Strong consensus forming:</strong> Vertical AI applications with <span class="highlight">proprietary data moats</span> are seeing 2-3x better retention than horizontal plays. The narrative has shifted from "AI for everything" to <span class="highlight">"AI for specific workflows"</span> with deep domain expertise.
                            </div>
                        </div>
                        
                        <div class="source-previews">
                            <div class="source-card">
                                <div class="source-header">
                                    <div class="source-info">
                                        <span>🎙️</span>
                                        <span>Brad Gerstner on 20VC</span>
                                        <span>• 2 days ago</span>
                                    </div>
                                    <button class="play-btn">▶</button>
                                </div>
                                <div class="quote-text">
                                    "The winners in AI won't be the broadest platforms, they'll be the ones who own the workflow..."
                                </div>
                            </div>
                            
                            <div class="source-card">
                                <div class="source-header">
                                    <div class="source-info">
                                        <span>🎙️</span>
                                        <span>Elad Gil on Invest Like Best</span>
                                        <span>• 4 days ago</span>
                                    </div>
                                    <button class="play-btn">▶</button>
                                </div>
                                <div class="quote-text">
                                    "Vertical AI is where we're seeing actual revenue, not just usage. Legal, healthcare, finance..."
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="action-row">
                        <button class="btn btn-primary" onclick="patternFlowSearch.viewDeepAnalysis()">View Deep Analysis</button>
                        <button class="btn" onclick="patternFlowSearch.shareInsight()">Share Insight</button>
                        <button class="btn" onclick="patternFlowSearch.saveToNotebook()">Save to Notebook</button>
                    </div>
                </div>
            `;
            
            const resultsDiv = document.createElement('div');
            resultsDiv.innerHTML = resultsHtml;
            document.body.appendChild(resultsDiv.firstElementChild);
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
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeResults());
        }
        
        // Play button clicks
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('In production: Play audio snippet from podcast');
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
        
        // ESC to close results
        if (e.key === 'Escape' && this.searchResults?.classList.contains('active')) {
            this.closeResults();
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
        
        if (this.backdrop) {
            this.backdrop.classList.add('active');
        }
        
        if (this.searchResults) {
            this.searchResults.classList.add('active');
        }
        
        if (this.queryDisplay) {
            this.queryDisplay.textContent = this.searchInput.value;
        }
        
        // Update results based on query
        this.updateResultsForQuery(this.searchInput.value);
    }
    
    updateResultsForQuery(query) {
        const confidenceBadge = document.querySelector('.confidence-badge');
        const sourceCount = document.querySelector('.source-count');
        const insightText = document.querySelector('.insight-text');
        
        if (!confidenceBadge || !sourceCount || !insightText) return;
        
        if (query.toLowerCase().includes('contrarian')) {
            confidenceBadge.textContent = '76% confidence';
            sourceCount.textContent = 'Based on 3 dissenting voices';
            insightText.innerHTML = '<strong>Limited contrarian views:</strong> While the majority is bullish on AI, Peter Thiel and others question <span class="highlight">timeline to profitability</span>. "We\'re building infrastructure for use cases that don\'t exist yet."';
        } else if (query.toLowerCase().includes('series a')) {
            confidenceBadge.textContent = '91% confidence';
            sourceCount.textContent = 'Based on 8 recent discussions';
            insightText.innerHTML = '<strong>Valuation normalization:</strong> Series A rounds settling at <span class="highlight">20-30x ARR</span> for AI companies, down from 50-100x in 2023. "Reality is setting in," per Benchmark\'s latest.';
        } else if (query.toLowerCase().includes('brad gerstner')) {
            confidenceBadge.textContent = '94% confidence';
            sourceCount.textContent = 'Based on 3 recent appearances';
            insightText.innerHTML = '<strong>Gerstner\'s thesis evolution:</strong> Shifted focus to <span class="highlight">AI infrastructure plays</span> and companies with "10x productivity gains". Emphasizing capital efficiency over growth at all costs.';
        }
    }
    
    closeResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('active');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
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