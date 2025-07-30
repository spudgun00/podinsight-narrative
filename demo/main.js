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
        
        // Bind form handlers
        this.bindFormHandlers();
        
        // Bind delete button handlers
        this.bindDeleteButtons();
        
        // Initialize UI
        this.updateUI();
        this.renderAllLists();
        
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
                { name: 'Anthropic', mentions: 7, sentiment: '5 positive, 2 neutral', status: 'validated' },
                { name: 'OpenAI', mentions: 12, sentiment: 'Competitive landscape intensifying', status: 'threat' }
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
    
    // Add a company to a specific list
    addCompany(name, listType) {
        const company = {
            name: name,
            mentions: 0,
            sentiment: 'Monitoring for signals',
            status: listType === 'watchlist' ? 'watchlist' : 'neutral'
        };
        
        this.companies[listType].push(company);
        this.saveCompanies(listType);
        this.renderList(listType);
        this.updateListCount(listType);
        
        // Update portfolio count in state if it's a portfolio company
        if (listType === 'portfolio') {
            this.state.portfolioCount = this.companies.portfolio.length;
            this.saveState();
            this.updateUI();
        }
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
    
    // Render a specific list
    renderList(listType) {
        const config = this.listConfig[listType];
        const container = document.querySelector(config.container);
        if (!container) return;
        
        const companies = this.companies[listType];
        
        if (companies.length === 0) {
            const emptyIcon = listType === 'watchlist' ? 
                `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M26 26L34 34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>` : 
                `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 36V24M16 36V12M24 36V28M32 36V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
            
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">${emptyIcon}</div>
                    <p>${listType === 'watchlist' ? 
                        'Add companies to monitor for investment opportunities' : 
                        'Add portfolio companies to track mentions'}</p>
                </div>
            `;
            return;
        }
        
        // Render company cards with appropriate styling
        container.innerHTML = companies.map(company => {
            const cardClass = company.status === 'threat' ? 'threat' : 
                             company.status === 'watchlist' ? 'watchlist' : 
                             config.cardClass;
            const iconClass = company.status === 'threat' ? 'threat' : config.iconClass;
            const icon = company.status === 'threat' ? 
                '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L11 10H1L6 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 4.5V7.5M6 8.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' : 
                '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            const mentions = company.mentions || 0;
            
            return `
                <div class="company-card ${cardClass}" data-company="${company.name}" data-list="${listType}">
                    <button class="delete-button" aria-label="Remove ${company.name}">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M4 3.5L10 10.5M10 3.5L4 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <div class="company-header">
                        <span class="company-name">${company.name}</span>
                    </div>
                    <div class="company-mention">
                        <span class="mention-badge ${iconClass}">${icon} ${mentions} mentions</span>
                    </div>
                    <div class="company-details">
                        ${company.sentiment}
                        ${company.status === 'validated' ? '<span class="validated-label">Thesis validated</span>' : ''}
                        ${company.status === 'threat' ? '<span class="threat-label">Competitive threat</span>' : ''}
                        ${company.status === 'watchlist' ? '<span class="watchlist-label">Watchlist</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Update count
        this.updateListCount(listType);
        
        // Re-bind delete buttons
        this.bindDeleteButtons();
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
    
    bindDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.portfolio-panel .delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', this.handleDelete.bind(this));
        });
    }
    
    handleDelete(e) {
        e.stopPropagation(); // Prevent card click
        const button = e.currentTarget;
        const card = button.closest('.company-card');
        const companyName = card.querySelector('.company-name').textContent;
        const listType = card.getAttribute('data-list');
        
        // Add removing animation class
        card.classList.add('removing');
        
        // Wait for animation then remove
        setTimeout(() => {
            // Remove from data array
            this.companies[listType] = this.companies[listType].filter(c => c.name !== companyName);
            this.saveCompanies(listType);
            
            // Update portfolio count in state if it's a portfolio company
            if (listType === 'portfolio') {
                this.state.portfolioCount = this.companies.portfolio.length;
                this.saveState();
                this.updateUI();
            }
            
            // Re-render the list
            this.renderList(listType);
        }, 300); // Match animation duration
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
        loaded: () => !!window.PriorityBriefings
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