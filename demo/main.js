// PatternFlow - Main Application Initializer

// Initialize header ticker with data
function initializeHeaderTicker() {
    const headerMetricsInner = document.querySelector('.header-metrics-inner');
    if (headerMetricsInner && window.tickerData && window.tickerData.items) {
        const tickerHTML = [];
        window.tickerData.items.forEach((item, index) => {
            if (index > 0) {
                tickerHTML.push('<span class="ticker-item">•</span>');
            }
            if (item.label === 'Patterns Detected') {
                tickerHTML.push(`<span class="ticker-item"><span class="ticker-value">${item.value}</span> ${item.label}</span>`);
            } else {
                tickerHTML.push(`<span class="ticker-item">${item.label} <span class="ticker-value">${item.value}</span></span>`);
            }
        });
        headerMetricsInner.innerHTML = tickerHTML.join('\n            ');
    }
}

// Portfolio Button State Management
class PortfolioManager {
    constructor() {
        this.button = document.querySelector('.portfolio-button');
        this.badge = document.querySelector('.notification-badge');
        this.pulseIndicator = document.querySelector('.pulse-indicator');
        this.closeButton = document.querySelector('.portfolio-panel .close-button');
        this.backdrop = document.querySelector('.portfolio-backdrop');
        
        // Flag for scaffold creation
        this.scaffoldCreated = false;
        
        // Debounce configuration
        this.debounceDelay = 300;
        
        // Configuration for both lists
        this.listConfig = {
            portfolio: {
                storageKey: 'patternFlow_portfolio_companies',
                container: '.portfolio-companies',
                countElement: '.portfolio-count',
                cardClass: 'validated',
                iconClass: 'positive',
                icon: '✓'
            },
            watchlist: {
                storageKey: 'patternFlow_watchlist_companies',
                container: '.watchlist-companies',
                countElement: '.watchlist-count',
                cardClass: 'watchlist',
                iconClass: 'watchlist',
                icon: '⚠'
            }
        };
        
        // Initialize companies data for both lists
        this.companies = {
            portfolio: this.loadCompanies('portfolio'),
            watchlist: this.loadCompanies('watchlist')
        };
        
        // Initialize from localStorage or defaults
        this.state = this.loadState();
        
        // Cache DOM elements (will be populated after scaffold)
        this.elements = {};
        
        // Bind event handlers
        if (this.button) {
            this.button.addEventListener('click', this.handleClick.bind(this));
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.closePanel.bind(this));
        }
        if (this.backdrop) {
            this.backdrop.addEventListener('click', this.closePanel.bind(this));
        }
        
        // Initialize UI
        this.updateUI();
        
        // Simulate new mentions for demo
        this.simulateNewMentions();
    }
    
    loadState() {
        const saved = localStorage.getItem('patternFlow_portfolio_state');
        if (saved) {
            const state = JSON.parse(saved);
            // Always reset panel state to closed on page load
            state.panelState = 'closed';
            return state;
        }
        return {
            portfolioCount: 2,
            newMentions: 2,
            panelState: 'closed',
            lastVisit: Date.now()
        };
    }
    
    // Cache DOM elements after scaffold is created
    cacheElements() {
        this.elements = {
            companyInput: document.querySelector('.company-input[data-list="portfolio"]'),
            addBtn: document.querySelector('.add-button[data-list="portfolio"]'),
            suggestions: document.getElementById('suggestions'),
            error: document.getElementById('inputError'),
            portfolioList: document.querySelector('.portfolio-companies'),
            watchlistList: document.querySelector('.watchlist-companies'),
            counts: {
                total: document.getElementById('companyCount'),
                portfolio: document.querySelector('.portfolio-count'),
                watchlist: document.querySelector('.watchlist-count'),
                mentions: document.getElementById('mentionCount'),
                alerts: document.getElementById('alertCount')
            }
        };
    }
    
    saveState() {
        localStorage.setItem('patternFlow_portfolio_state', JSON.stringify(this.state));
        
        // Persist newMentions and nextUpdateTime separately for the 5-minute cycle
        localStorage.setItem('patternFlow_newMentionsValue', this.state.newMentions.toString());
        if (this.state.nextUpdateTime) {
            localStorage.setItem('patternFlow_nextMentionsUpdateTime', this.state.nextUpdateTime.toString());
        }
    }
    
    // Load companies from localStorage for a specific list
    loadCompanies(listType) {
        // For demo purposes, always return the default companies
        // Don't load from localStorage so they reappear on refresh
        if (listType === 'portfolio') {
            return [
                { 
                    name: 'Anthropic', 
                    mentions: 7, 
                    sentiment: '5 positive, 1 negative, 1 neutral', 
                    sentimentArray: ['positive', 'positive', 'positive', 'positive', 'positive', 'negative', 'neutral'],
                    status: 'validated',
                    lastInsight: 'Strong momentum with Claude 3.5'
                },
                { 
                    name: 'OpenAI', 
                    mentions: 12, 
                    sentiment: '4 positive, 3 negative, 5 neutral', 
                    sentimentArray: ['positive', 'positive', 'positive', 'positive', 'negative', 'negative', 'negative', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
                    status: 'threat',
                    lastInsight: 'Competitive landscape intensifying'
                }
            ];
        }
        if (listType === 'watchlist') {
            return [
                {
                    name: 'Perplexity',
                    mentions: 7,
                    sentiment: '3 positive, 2 negative, 2 neutral',
                    sentimentArray: ['positive', 'positive', 'positive', 'negative', 'negative', 'neutral', 'neutral'],
                    status: 'neutral',
                    lastInsight: 'Search disruption thesis gaining traction'
                }
            ];
        }
        return [];
    }
    
    // Save companies to localStorage for a specific list
    saveCompanies(listType) {
        // For demo purposes, don't save to localStorage
        // Companies will reset on page refresh
        // const config = this.listConfig[listType];
        // localStorage.setItem(config.storageKey, JSON.stringify(this.companies[listType]));
    }
    
    // Bind form submission handlers
    bindFormHandlers() {
        const forms = document.querySelectorAll('.add-company-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const listType = form.getAttribute('data-list');
                const input = form.querySelector('.company-input');
                const companyName = input.value.trim();
                
                if (companyName) {
                    this.addCompany(companyName, listType);
                    input.value = '';
                }
            });
        });
    }
    
    // Generate mock company data
    _generateMockCompanyData(name) {
        // Special companies with predefined data
        const specialCompanies = {
            'stripe': {
                mentions: 11,
                sentimentArray: ['positive', 'positive', 'positive', 'positive', 'positive', 'positive', 'positive', 'neutral', 'neutral', 'positive', 'positive'],
                sentiment: '9 positive, 0 negative, 2 neutral',
                status: 'validated',
                lastInsight: 'Strong payments infrastructure play'
            },
            'databricks': {
                mentions: 8,
                sentimentArray: ['positive', 'positive', 'positive', 'negative', 'negative', 'neutral', 'neutral', 'neutral'],
                sentiment: '3 positive, 2 negative, 3 neutral',
                status: 'neutral',
                lastInsight: 'AI infrastructure competition heating up'
            },
            'figma': {
                mentions: 6,
                sentimentArray: ['positive', 'positive', 'positive', 'positive', 'neutral', 'positive'],
                sentiment: '5 positive, 0 negative, 1 neutral',
                status: 'validated',
                lastInsight: 'Design tool market leader post-Adobe'
            }
        };
        
        const lowerName = name.toLowerCase();
        if (specialCompanies[lowerName]) {
            return specialCompanies[lowerName];
        }
        
        // Generate random data for other companies
        const mentions = Math.floor(Math.random() * 11) + 5; // 5-15 mentions
        const sentimentArray = [];
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
        
        // Generate sentiment array with 60% positive, 20% negative, 20% neutral
        for (let i = 0; i < mentions; i++) {
            const rand = Math.random();
            if (rand < 0.6) {
                sentimentArray.push('positive');
                positiveCount++;
            } else if (rand < 0.8) {
                sentimentArray.push('negative');
                negativeCount++;
            } else {
                sentimentArray.push('neutral');
                neutralCount++;
            }
        }
        
        // Determine status based on sentiment
        let status = 'neutral';
        if (positiveCount > mentions * 0.7) {
            status = 'validated';
        } else if (negativeCount > mentions * 0.4) {
            status = 'threat';
        }
        
        return {
            mentions: mentions,
            sentimentArray: sentimentArray,
            sentiment: `${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral`,
            status: status,
            lastInsight: 'Emerging player'
        };
    }
    
    // Add a company to a specific list
    addCompany(name, listType) {
        // Generate mock data
        const mockData = this._generateMockCompanyData(name);
        
        const company = {
            name: name,
            id: name.toLowerCase().replace(/\s+/g, '-'),
            mentions: mockData.mentions,
            sentiment: mockData.sentiment,
            sentimentArray: mockData.sentimentArray,
            status: listType === 'watchlist' ? 'watchlist' : mockData.status,
            lastInsight: mockData.lastInsight
        };
        
        // Add to the beginning of the list for visibility
        this.companies[listType].unshift(company);
        this.saveCompanies(listType);
        
        // Get the container
        const config = this.listConfig[listType];
        const container = this.scaffoldCreated ? 
            (listType === 'portfolio' ? this.elements.portfolioList : this.elements.watchlistList) :
            document.querySelector(config.container);
            
        if (!container) return;
        
        // Remove empty state if it exists
        const emptyState = container.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Create the new card
        const card = this.createCompanyCard(company, listType);
        card.classList.add('just-added');
        
        // Insert at the beginning
        container.insertBefore(card, container.firstChild);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            card.classList.remove('just-added');
        }, 300);
        
        // Update counts
        this.updateListCount(listType);
        
        // Update portfolio count in state if it's a portfolio company
        if (listType === 'portfolio') {
            this.state.portfolioCount = this.companies.portfolio.length;
            this.saveState();
            this.updateUI();
        }
        
        // Update metrics header
        this._renderMetrics();
    }
    
    // Update the count display for a specific list
    updateListCount(listType) {
        const config = this.listConfig[listType];
        const countElement = document.querySelector(config.countElement);
        if (countElement) {
            countElement.textContent = `(${this.companies[listType].length})`;
        }
    }
    
    // Render all lists
    renderAllLists() {
        this.renderList('portfolio');
        this.renderList('watchlist');
    }
    
    // Create a single company card element
    createCompanyCard(company, listType) {
        const card = document.createElement('div');
        card.className = 'company-card';
        card.dataset.companyId = company.id || company.name.toLowerCase();
        card.dataset.listType = listType;
        
        // Determine sentiment status
        let sentimentStatus = 'neutral';
        if (company.status === 'validated') sentimentStatus = 'positive';
        else if (company.status === 'threat') sentimentStatus = 'negative';
        card.classList.add(sentimentStatus);
        
        // Determine trend
        const trend = company.trend || (company.mentions > 5 ? 'up' : 'neutral');
        const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
        
        // Generate sentiment dots
        let sentimentDots = '';
        if (company.sentimentArray && company.sentimentArray.length > 0) {
            // Use the sentiment array if available
            company.sentimentArray.forEach(sentiment => {
                sentimentDots += `<span class="dot ${sentiment}"></span>`;
            });
        } else if (company.sentiment && company.sentiment.match(/\d+\s*positive.*?\d+\s*negative.*?\d+\s*neutral/)) {
            // Parse sentiment string for all three types
            const match = company.sentiment.match(/(\d+)\s*positive.*?(\d+)\s*negative.*?(\d+)\s*neutral/);
            if (match) {
                const positive = parseInt(match[1]) || 0;
                const negative = parseInt(match[2]) || 0;
                const neutral = parseInt(match[3]) || 0;
                
                for (let i = 0; i < positive; i++) {
                    sentimentDots += '<span class="dot positive"></span>';
                }
                for (let i = 0; i < negative; i++) {
                    sentimentDots += '<span class="dot negative"></span>';
                }
                for (let i = 0; i < neutral; i++) {
                    sentimentDots += '<span class="dot neutral"></span>';
                }
            }
        } else {
            // Default dots based on status
            const totalDots = Math.min(company.mentions || 3, 7);
            for (let i = 0; i < totalDots; i++) {
                sentimentDots += `<span class="dot ${sentimentStatus}"></span>`;
            }
        }
        
        // Determine insight
        let insight = company.lastInsight || company.sentiment || 'Analyzing podcast mentions...';
        if (!company.lastInsight) {
            if (company.status === 'validated') {
                insight = 'Strong AI safety narrative aligning with thesis';
            } else if (company.status === 'threat') {
                insight = 'Competitive landscape intensifying, monitor closely';
            }
        }
        
        card.innerHTML = `
            <div class="company-content">
                <div class="company-header">
                    <span class="company-name">${this.escapeHtml(company.name)}</span>
                    <button class="remove-btn" aria-label="Remove ${company.name}">×</button>
                </div>
                <div class="company-metrics">
                    <span class="mention-trend ${trend}">${trendIcon}</span>
                    <span class="mention-count">${company.mentions || 0} mentions</span>
                    <span class="sentiment-dots">
                        ${sentimentDots}
                    </span>
                </div>
                <div class="company-insight">
                    ${this.escapeHtml(insight)}
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Render a specific list using surgical updates
    renderList(listType) {
        const config = this.listConfig[listType];
        const container = this.scaffoldCreated ? 
            (listType === 'portfolio' ? this.elements.portfolioList : this.elements.watchlistList) :
            document.querySelector(config.container);
            
        if (!container) return;
        
        const companies = this.companies[listType];
        
        // Clear container
        container.innerHTML = '';
        
        if (companies.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <p>${listType === 'watchlist' ? 
                    'Add companies to monitor for investment opportunities' : 
                    'Track your portfolio companies to receive personalized intelligence'}</p>
                ${listType === 'portfolio' ? '<p class="empty-hint">Start by adding companies you\'ve invested in</p>' : ''}
            `;
            container.appendChild(emptyState);
        } else {
            // Add company cards
            companies.forEach(company => {
                const card = this.createCompanyCard(company, listType);
                container.appendChild(card);
            });
        }
        
        // Update count
        this.updateListCount(listType);
    }
    
    // Utility method to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Calculate aggregate metrics
    _calculateMetrics() {
        const companies = [...this.companies.portfolio, ...this.companies.watchlist];
        const totalCompanies = companies.length;
        const totalMentions = companies.reduce((sum, company) => sum + (company.mentions || 0), 0);
        
        let positiveMentions = 0;
        let neutralMentions = 0;
        let negativeMentions = 0;
        
        companies.forEach(company => {
            if (company.sentimentArray && company.sentimentArray.length > 0) {
                // Use sentiment array if available
                company.sentimentArray.forEach(sentiment => {
                    if (sentiment === 'positive') positiveMentions++;
                    else if (sentiment === 'negative') negativeMentions++;
                    else if (sentiment === 'neutral') neutralMentions++;
                });
            } else if (company.sentiment) {
                // Parse sentiment string
                const match = company.sentiment.match(/(\d+)\s*positive.*?(\d+)\s*negative.*?(\d+)\s*neutral/);
                if (match) {
                    positiveMentions += parseInt(match[1]) || 0;
                    negativeMentions += parseInt(match[2]) || 0;
                    neutralMentions += parseInt(match[3]) || 0;
                } else {
                    // Fallback to status-based calculation
                    if (company.status === 'validated') {
                        positiveMentions += company.mentions || 0;
                    } else if (company.status === 'threat') {
                        negativeMentions += company.mentions || 0;
                    } else {
                        neutralMentions += company.mentions || 0;
                    }
                }
            }
        });
        
        const totalSentiments = positiveMentions + neutralMentions + negativeMentions;
        const positiveSentimentPercentage = totalSentiments > 0 
            ? Math.round((positiveMentions / totalSentiments) * 100) 
            : 0;
        
        return { totalCompanies, totalMentions, positiveSentimentPercentage };
    }
    
    // Render metrics in unified header
    _renderMetrics() {
        const metricsContainer = document.getElementById('portfolio-metrics');
        if (!metricsContainer) return;
        
        const metrics = this._calculateMetrics();
        
        if (metrics.totalCompanies === 0) {
            metricsContainer.classList.add('zero-state');
            metricsContainer.innerHTML = '<span class="metrics-text">Add a company to begin analysis</span>';
        } else {
            metricsContainer.classList.remove('zero-state');
            metricsContainer.innerHTML = `
                <span class="metrics-text">
                    Tracking <span id="companyCount">${metrics.totalCompanies}</span> companies • 
                    <span id="mentionCount">${metrics.totalMentions}</span> mentions this week • 
                    <span id="sentimentPercent">${metrics.positiveSentimentPercentage}%</span> positive sentiment
                </span>
            `;
        }
    }
    
    updateUI() {
        if (!this.button) return;
        
        // Update data attributes
        this.button.setAttribute('data-portfolio-count', this.state.portfolioCount);
        this.button.setAttribute('data-new-mentions', this.state.newMentions);
        this.button.setAttribute('data-panel-state', this.state.panelState);
        
        // Update notification badge
        if (this.badge) {
            if (this.state.newMentions > 0) {
                this.badge.style.display = 'flex';
                this.badge.textContent = this.state.newMentions > 99 ? '99+' : this.state.newMentions;
            } else {
                this.badge.style.display = 'none';
            }
        }
        
        // Update pulse indicator
        if (this.pulseIndicator) {
            if (this.state.newMentions > 0 && this.state.panelState === 'closed') {
                this.pulseIndicator.classList.add('active');
            } else {
                this.pulseIndicator.classList.remove('active');
            }
        }
        
        // Update aria-label
        const mentionText = this.state.newMentions > 0 
            ? `, ${this.state.newMentions} new mentions` 
            : '';
        this.button.setAttribute('aria-label', `Company tracking${mentionText}`);
    }
    
    
    handleClick(e) {
        e.preventDefault();
        
        // Toggle panel state
        this.state.panelState = this.state.panelState === 'open' ? 'closed' : 'open';
        
        // Toggle portfolio panel visibility
        const panel = document.querySelector('.portfolio-panel');
        const backdrop = document.querySelector('.portfolio-backdrop');
        
        if (this.state.panelState === 'open') {
            // Initialize scaffold if needed
            if (!this.scaffoldCreated) {
                this.initializeScaffold();
            }
            
            // Update metrics
            this._renderMetrics();
            
            // Add class to body to hide scrollbar
            document.body.classList.add('portfolio-open');
            
            panel.setAttribute('data-state', 'open');
            backdrop.style.display = 'block';
            setTimeout(() => backdrop.classList.add('active'), 10);
            
            // Mark mentions as viewed after a delay
            setTimeout(() => {
                this.state.newMentions = 0;
                this.updateUI();
                this.saveState();
            }, 2000);
        } else {
            panel.setAttribute('data-state', 'closed');
            backdrop.classList.remove('active');
            document.body.classList.remove('portfolio-open');
            setTimeout(() => backdrop.style.display = 'none', 300);
        }
        
        // Dispatch custom event for panel toggle
        const event = new CustomEvent('portfolio-panel-toggle', {
            detail: {
                isOpen: this.state.panelState === 'open',
                portfolioCount: this.state.portfolioCount,
                newMentions: this.state.newMentions
            }
        });
        window.dispatchEvent(event);
        
        this.updateUI();
        this.saveState();
    }
    
    openPanel() {
        this.state.panelState = 'open';
        
        const panel = document.querySelector('.portfolio-panel');
        const backdrop = document.querySelector('.portfolio-backdrop');
        
        // Initialize scaffold if needed
        if (!this.scaffoldCreated) {
            this.initializeScaffold();
        }
        
        // Update metrics before showing
        this._renderMetrics();
        
        // Add class to body to hide scrollbar
        document.body.classList.add('portfolio-open');
        
        panel.setAttribute('data-state', 'open');
        backdrop.style.display = 'block';
        setTimeout(() => backdrop.classList.add('active'), 10);
        
        // Focus input
        if (this.elements.companyInput) {
            this.elements.companyInput.focus();
        }
        
        // Mark mentions as viewed after a delay
        setTimeout(() => {
            this.state.newMentions = 0;
            this.updateUI();
            this.saveState();
        }, 2000);
        
        // Dispatch custom event for panel toggle
        const event = new CustomEvent('portfolio-panel-toggle', {
            detail: {
                isOpen: true,
                portfolioCount: this.state.portfolioCount,
                newMentions: this.state.newMentions
            }
        });
        window.dispatchEvent(event);
        
        this.updateUI();
        this.saveState();
    }
    
    // Initialize the panel scaffold and set up event listeners
    initializeScaffold() {
        // Cache elements
        this.cacheElements();
        
        // Set up event listeners for new structure
        const addButtons = document.querySelectorAll('.add-button[data-list]');
        const companyInputs = document.querySelectorAll('.company-input[data-list]');
        
        // Handle each add button
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const listType = button.getAttribute('data-list');
                const input = button.previousElementSibling;
                if (input && input.value.trim()) {
                    this.addCompany(input.value.trim(), listType);
                    input.value = '';
                }
            });
        });
        
        // Handle Enter key on inputs
        companyInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const listType = input.getAttribute('data-list');
                    if (input.value.trim()) {
                        this.addCompany(input.value.trim(), listType);
                        input.value = '';
                    }
                }
            });
        });
        
        // Set up event delegation for remove buttons
        if (this.elements.portfolioList) {
            this.elements.portfolioList.addEventListener('click', (e) => {
                if (e.target.matches('.remove-btn')) {
                    this.handleRemoveClick(e);
                }
            });
        }
        
        if (this.elements.watchlistList) {
            this.elements.watchlistList.addEventListener('click', (e) => {
                if (e.target.matches('.remove-btn')) {
                    this.handleRemoveClick(e);
                }
            });
        }
        
        // Import link handler
        const importLink = document.getElementById('import-companies');
        if (importLink) {
            importLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showImportDialog();
            });
        }
        
        // Render initial lists
        this.renderAllLists();
        
        this.scaffoldCreated = true;
    }
    
    closePanel(e) {
        if (e) e.preventDefault();
        
        this.state.panelState = 'closed';
        
        const panel = document.querySelector('.portfolio-panel');
        const backdrop = document.querySelector('.portfolio-backdrop');
        
        panel.setAttribute('data-state', 'closed');
        backdrop.classList.remove('active');
        document.body.classList.remove('portfolio-open');
        setTimeout(() => backdrop.style.display = 'none', 300);
        
        this.updateUI();
        this.saveState();
    }
    
    // Handle add company with optimistic updates
    async handleAddCompany() {
        const name = this.elements.companyInput.value.trim();
        if (!name) return;
        
        // Check for duplicates
        const isDuplicate = this.checkDuplicate(name);
        if (isDuplicate) {
            this.showError(`You're already tracking ${name}`);
            return;
        }
        
        // Check limit
        const totalCompanies = this.companies.portfolio.length + this.companies.watchlist.length;
        if (totalCompanies >= 100) {
            this.showError('Maximum limit of 100 companies reached');
            return;
        }
        
        // Create optimistic company object
        const company = {
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name,
            mentions: 0,
            trend: 'stable',
            sentiment: 'neutral',
            lastInsight: 'Analyzing podcast mentions...',
            addedAt: new Date().toISOString()
        };
        
        // Add to portfolio by default
        this.companies.portfolio.push(company);
        
        // Clear input
        this.elements.companyInput.value = '';
        this.hideError();
        
        // Create and add card with animation
        const card = this.createCompanyCard(company, 'portfolio');
        card.classList.add('just-added');
        
        // Remove empty state if exists
        const emptyState = this.elements.portfolioList.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
        
        this.elements.portfolioList.appendChild(card);
        
        // Update metrics
        this.state.portfolioCount = this.companies.portfolio.length;
        this._renderMetrics();
        this.saveState();
        
        // Remove animation class after animation completes
        setTimeout(() => card.classList.remove('just-added'), 300);
        
        // Simulate fetching real data
        setTimeout(() => {
            company.mentions = Math.floor(Math.random() * 20) + 1;
            company.trend = Math.random() > 0.5 ? 'up' : 'stable';
            company.sentiment = Math.random() > 0.7 ? 'positive' : 'neutral';
            company.lastInsight = 'Latest insights from podcast analysis';
            
            // Update the card with new data
            this.updateCompanyCard(card, company);
        }, 2000);
    }
    
    // Handle remove button click with animation
    handleRemoveClick(e) {
        const btn = e.target.closest('.remove-btn');
        if (!btn) return;
        
        const card = btn.closest('.company-card');
        const companyId = card.dataset.companyId;
        const listType = card.dataset.listType;
        
        // Animate removal
        card.style.transition = 'all 0.3s ease-out';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            // Remove from data
            this.companies[listType] = this.companies[listType].filter(c => 
                (c.id || c.name.toLowerCase()) !== companyId
            );
            
            // Remove from DOM
            card.remove();
            
            // Update metrics
            if (listType === 'portfolio') {
                this.state.portfolioCount = this.companies.portfolio.length;
            }
            this._renderMetrics();
            this.saveState();
            
            // Check if we need to show empty state
            const list = listType === 'portfolio' ? 
                        this.elements.portfolioList : 
                        this.elements.watchlistList;
            if (list.children.length === 0) {
                this.renderList(listType);
            }
        }, 300);
    }
    
    // Update company card with new data
    updateCompanyCard(card, company) {
        const mentionCount = card.querySelector('.mention-count');
        const trendIcon = card.querySelector('.trend-icon');
        const sentimentDot = card.querySelector('.sentiment-dot');
        const insightPreview = card.querySelector('.insight-preview');
        
        if (mentionCount) mentionCount.textContent = company.mentions;
        if (trendIcon) trendIcon.textContent = company.trend === 'up' ? '↑' : 
                                               company.trend === 'down' ? '↓' : '→';
        if (sentimentDot) {
            sentimentDot.className = `sentiment-dot ${company.sentiment}`;
            sentimentDot.title = `${company.sentiment} sentiment`;
        }
        if (insightPreview) insightPreview.textContent = company.lastInsight;
    }
    
    // Check for duplicate companies
    checkDuplicate(name) {
        const normalized = name.toLowerCase();
        return [...this.companies.portfolio, ...this.companies.watchlist]
            .some(c => c.name.toLowerCase() === normalized);
    }
    
    // Update metrics in real-time
    updateMetrics() {
        if (!this.elements.counts) return;
        
        const portfolio = this.companies.portfolio;
        const watchlist = this.companies.watchlist;
        const total = portfolio.length + watchlist.length;
        
        // Update counts
        if (this.elements.counts.total) this.elements.counts.total.textContent = total;
        if (this.elements.counts.portfolio) this.elements.counts.portfolio.textContent = portfolio.length;
        if (this.elements.counts.watchlist) this.elements.counts.watchlist.textContent = watchlist.length;
        
        // Calculate aggregate metrics
        const allCompanies = [...portfolio, ...watchlist];
        const mentions = allCompanies.reduce((sum, c) => sum + (c.mentions || 0), 0);
        const alerts = allCompanies.filter(c => c.status === 'threat').length;
        
        if (this.elements.counts.mentions) this.elements.counts.mentions.textContent = mentions;
        if (this.elements.counts.alerts) this.elements.counts.alerts.textContent = alerts;
    }
    
    // Show/hide error messages
    showError(message) {
        if (this.elements.error) {
            this.elements.error.textContent = message;
            this.elements.error.hidden = false;
            this.elements.companyInput.classList.add('error');
        }
    }
    
    hideError() {
        if (this.elements.error) {
            this.elements.error.hidden = true;
            this.elements.companyInput.classList.remove('error');
        }
    }
    
    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Handle input for auto-suggestions
    handleInput(e) {
        const value = e.target.value.trim();
        if (value.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        // Mock suggestions - in real app, this would query a database
        const suggestions = [
            'Stripe', 'Square', 'Shopify', 'Spotify', 'Slack',
            'Salesforce', 'ServiceNow', 'Snowflake', 'Splunk',
            'Airbnb', 'Asana', 'Atlassian', 'Airtable',
            'Databricks', 'Datadog', 'DocuSign', 'Dropbox',
            'Figma', 'Flexport', 'Freshworks',
            'GitLab', 'Gusto', 'Grammarly'
        ].filter(s => s.toLowerCase().includes(value.toLowerCase()));
        
        if (suggestions.length > 0) {
            this.showSuggestions(suggestions.slice(0, 5));
        } else {
            this.hideSuggestions();
        }
    }
    
    // Show suggestion dropdown
    showSuggestions(suggestions) {
        if (!this.elements.suggestions) return;
        
        this.elements.suggestions.innerHTML = suggestions.map(s => `
            <div class="suggestion-item" data-value="${s}">${s}</div>
        `).join('');
        
        this.elements.suggestions.hidden = false;
        
        // Add click handlers
        this.elements.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.elements.companyInput.value = item.dataset.value;
                this.hideSuggestions();
                this.handleAddCompany();
            });
        });
    }
    
    hideSuggestions() {
        if (this.elements.suggestions) {
            this.elements.suggestions.hidden = true;
        }
    }
    
    // Show import dialog
    showImportDialog() {
        // For demo, just show an alert
        alert('Import functionality coming soon! Supports CSV, Affinity, Airtable, and PitchBook formats.');
    }
    
    // Old methods to remove/update
    bindFormHandlers() {
        // This method is no longer needed with new architecture
    }
    
    bindDeleteButtons() {
        // This method is no longer needed - using event delegation
    }
    
    simulateNewMentions() {
        // Define constants for the portfolio button cycle
        const UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
        const MENTION_VALUES = [1, 2, 3]; // The sequence of numbers to cycle through
        
        // Load the initial state for newMentions from localStorage
        this.loadMentionsState();
        
        // Determine the initial delay before the first update
        let initialDelay = 0;
        const now = Date.now();
        if (this.state.nextUpdateTime && this.state.nextUpdateTime > now) {
            initialDelay = this.state.nextUpdateTime - now;
        }
        
        // Define the core update logic for newMentions
        const updateMentionsCycle = () => {
            // Calculate the next mention value in the cycle (1 -> 2 -> 3 -> 1...)
            const currentIndex = MENTION_VALUES.indexOf(this.state.newMentions);
            const nextIndex = (currentIndex + 1) % MENTION_VALUES.length;
            this.state.newMentions = MENTION_VALUES[nextIndex];
            
            // Set the timestamp for the next update
            this.state.nextUpdateTime = Date.now() + UPDATE_INTERVAL_MS;
            
            // Update the UI and persist the state
            this.updateUI();
            this.saveState();
        };
        
        // Schedule the first update, then set up the recurring interval
        setTimeout(() => {
            updateMentionsCycle(); // Perform the first update
            setInterval(updateMentionsCycle, UPDATE_INTERVAL_MS); // Then set up recurring updates
        }, initialDelay);
    }
    
    loadMentionsState() {
        const storedMentions = localStorage.getItem('patternFlow_newMentionsValue');
        const storedNextUpdate = localStorage.getItem('patternFlow_nextMentionsUpdateTime');
        const now = Date.now();
        const MENTION_VALUES = [1, 2, 3];
        const UPDATE_INTERVAL_MS = 5 * 60 * 1000;
        
        if (storedMentions && storedNextUpdate) {
            // Parse stored values
            this.state.newMentions = parseInt(storedMentions, 10);
            this.state.nextUpdateTime = parseInt(storedNextUpdate, 10);
            
            // If the stored next update time is in the past, calculate the correct current value
            if (this.state.nextUpdateTime <= now) {
                // Calculate how many 5-minute intervals have passed
                const elapsedSinceLastUpdate = now - this.state.nextUpdateTime;
                const intervalsPassed = Math.floor(elapsedSinceLastUpdate / UPDATE_INTERVAL_MS) + 1;
                
                // Advance newMentions by the number of intervals passed
                const currentMentionsIndex = MENTION_VALUES.indexOf(this.state.newMentions);
                const newIndex = (currentMentionsIndex + intervalsPassed) % MENTION_VALUES.length;
                this.state.newMentions = MENTION_VALUES[newIndex];
                
                // Set the next update time from the current moment
                this.state.nextUpdateTime = now + UPDATE_INTERVAL_MS;
                
                // Update UI and save state immediately after catching up
                this.updateUI();
                this.saveState();
            }
        } else {
            // No stored state found, initialize with default values
            this.state.newMentions = MENTION_VALUES[0]; // Start with 1
            this.state.nextUpdateTime = now + UPDATE_INTERVAL_MS; // Schedule first update 5 minutes from now
            this.updateUI();
            this.saveState();
        }
    }
}

// Component initialization registry
const componentInitializers = [
    {
        name: 'Narrative Pulse',
        containerId: 'narrative-pulse-container',
        loaded: () => !!window.NarrativePulse
    },
    {
        name: 'Narrative Feed',
        containerId: 'narrative-feed-container',
        loaded: () => !!window.NarrativeFeed
    },
    {
        name: 'Notable Signals',
        containerId: 'notable-signals-container',
        loaded: () => !!window.NotableSignals
    },
    {
        name: 'Priority Briefings',
        containerId: 'priority-briefings-container',
        loaded: () => !!window.PriorityBriefingsCompact,
        postInit: () => {
            // Initialize the new compact Priority Briefings component
            const container = document.getElementById('priority-briefings-container');
            if (container && window.PriorityBriefingsCompact) {
                // Add white container wrapper class
                container.className = 'priority-briefings-container';
                window.PriorityBriefingsCompact.init(container);
                console.log('✓ Priority Briefings Compact initialized');
            }
        }
    },
    {
        name: 'Intelligence Brief',
        containerId: 'intelligence-brief-container',
        loaded: () => !!window.IntelligenceBrief
    }
];

// Verify all components are loaded
function verifyComponents() {
    const results = componentInitializers.map(component => ({
        name: component.name,
        container: !!document.getElementById(component.containerId),
        loaded: component.loaded()
    }));
    
    return results;
}

// Episode Panel Mediator - Bridges Priority Briefings buttons to Episode Panel
function initializeEpisodePanelMediator() {
    // Use event delegation with capture phase to intercept before the compact modal
    document.body.addEventListener('click', function(event) {
        // Check if clicked element is the "View Full Brief" button
        const viewButton = event.target.closest('.view-brief-btn');
        
        if (viewButton) {
            // Prevent the original modal from opening
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            // Get the briefing ID from the button
            const briefingId = viewButton.getAttribute('data-briefing-id');
            
            // Use Episode Panel v2 instead of Episode Library
            if (briefingId && window.episodePanelV2) {
                console.log('Mediator: Opening Episode Panel v2 for briefing:', briefingId);
                window.episodePanelV2.open(briefingId);
            } else if (briefingId && window.EpisodeLibrary && window.EpisodeLibrary.showEpisodeDetail) {
                // Fallback to Episode Library if v2 panel not available
                console.log('Mediator: Fallback to Episode Library for briefing:', briefingId);
                window.EpisodeLibrary.showEpisodeDetail(briefingId);
            } else {
                console.error('Mediator: Could not open episode panel. Missing briefing ID or panel API.');
                console.log('Briefing ID:', briefingId);
                console.log('episodePanelV2 available:', !!window.episodePanelV2);
                console.log('EpisodeLibrary available:', !!window.EpisodeLibrary);
            }
        }
    }, true); // Use capture phase (true) to run before bubble phase listeners
}

// Main initialization function
async function initializeApp() {
    console.log('💰 Initializing PatternFlow Dashboard...');
    console.log('-----------------------------------');
    
    // Initialize header ticker
    try {
        initializeHeaderTicker();
        console.log('✓ Header ticker initialized');
    } catch (error) {
        console.error('✗ Failed to initialize header ticker:', error);
    }
    
    // Initialize Portfolio Manager
    try {
        window.portfolioManager = new PortfolioManager();
        console.log('✓ Portfolio Manager initialized');
    } catch (error) {
        console.error('✗ Failed to initialize Portfolio Manager:', error);
    }
    
    // Initialize Narrative Pulse Drill-Down Panel
    try {
        if (window.NarrativePulseDrilldown) {
            window.NarrativePulseDrilldown.init();
            console.log('✓ Narrative Pulse Drill-Down initialized');
        } else {
            console.warn('⚠ Narrative Pulse Drill-Down component not found');
        }
    } catch (error) {
        console.error('✗ Failed to initialize Narrative Pulse Drill-Down:', error);
    }
    
    // Initialize Customization Panel
    try {
        if (window.CustomizationPanel) {
            const initialized = window.CustomizationPanel.init();
            if (initialized) {
                console.log('✓ Customization Panel initialized');
            } else {
                console.error('✗ Customization Panel initialization failed');
            }
            
            // Hook up the customization button
            const customizeBtn = document.querySelector('.customize-btn');
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => {
                    console.log('[Main] Customization button clicked');
                    window.CustomizationPanel.open();
                });
                console.log('✓ Customization button connected');
            } else {
                console.warn('⚠ Customization button not found (.customize-btn)');
            }
        } else {
            console.warn('⚠ Customization Panel component not found on window object');
        }
    } catch (error) {
        console.error('✗ Failed to initialize Customization Panel:', error);
    }
    
    // Wait a moment for all component scripts to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify component status
    const componentStatus = verifyComponents();
    console.log('\n📊 Component Status:');
    
    componentStatus.forEach(status => {
        const icon = status.container && status.loaded ? '✓' : '✗';
        const details = [];
        if (!status.container) details.push('no container');
        if (!status.loaded) details.push('not loaded');
        const detailStr = details.length ? ` (${details.join(', ')})` : '';
        
        console.log(`${icon} ${status.name}${detailStr}`);
    });
    
    // Check for any missing components
    const missingComponents = componentStatus.filter(s => !s.container || !s.loaded);
    if (missingComponents.length > 0) {
        console.warn('\n⚠️  Some components failed to initialize properly.');
        console.warn('Check that all component files are loaded correctly.');
    } else {
        console.log('\n✅ All components initialized successfully!');
        
        // Run post-initialization functions for components that have them
        componentInitializers.forEach(component => {
            if (component.postInit && component.loaded()) {
                try {
                    component.postInit();
                } catch (error) {
                    console.error(`✗ Failed to run postInit for ${component.name}:`, error);
                }
            }
        });
    }
    
    // Initialize Episode Panel Mediator for Priority Briefings
    try {
        initializeEpisodePanelMediator();
        console.log('✓ Episode Panel Mediator initialized');
    } catch (error) {
        console.error('✗ Failed to initialize Episode Panel Mediator:', error);
    }
    
    console.log('-----------------------------------');
    console.log('Dashboard initialization complete');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded, initialize immediately
    initializeApp();
}

// Export for debugging
window.PatternFlow = {
    verifyComponents,
    componentInitializers,
    reinitialize: initializeApp
};