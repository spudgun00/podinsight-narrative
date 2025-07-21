// VCPulse - Main Application Initializer

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
        
        // Bind delete button handlers
        this.bindDeleteButtons();
        
        // Initialize UI
        this.updateUI();
        
        // Simulate new mentions for demo
        this.simulateNewMentions();
    }
    
    loadState() {
        const saved = localStorage.getItem('vcpulse_portfolio_state');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            portfolioCount: 2,
            newMentions: 2,
            panelState: 'closed',
            lastVisit: Date.now()
        };
    }
    
    saveState() {
        localStorage.setItem('vcpulse_portfolio_state', JSON.stringify(this.state));
        
        // Persist newMentions and nextUpdateTime separately for the 5-minute cycle
        localStorage.setItem('vcpulse_newMentionsValue', this.state.newMentions.toString());
        if (this.state.nextUpdateTime) {
            localStorage.setItem('vcpulse_nextMentionsUpdateTime', this.state.nextUpdateTime.toString());
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
        this.button.setAttribute('aria-label', `Portfolio tracking${mentionText}`);
    }
    
    handleClick(e) {
        e.preventDefault();
        
        // Toggle panel state
        this.state.panelState = this.state.panelState === 'open' ? 'closed' : 'open';
        
        // Toggle portfolio panel visibility
        const panel = document.querySelector('.portfolio-panel');
        const backdrop = document.querySelector('.portfolio-backdrop');
        
        if (this.state.panelState === 'open') {
            panel.setAttribute('data-state', 'open');
            backdrop.style.display = 'block';
            document.body.classList.add('portfolio-open');
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
        
        if (confirm(`Remove ${companyName} from your portfolio?`)) {
            // Add removing animation class
            card.classList.add('removing');
            
            // Update count
            const countElement = document.querySelector('.portfolio-panel .company-count');
            const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
            countElement.textContent = `(${currentCount - 1})`;
            
            // Update state
            this.state.portfolioCount = Math.max(0, this.state.portfolioCount - 1);
            this.updateUI();
            this.saveState();
            
            // After animation, hide the card
            setTimeout(() => {
                card.style.display = 'none';
                
                // Check if empty state should be shown
                const remainingCards = document.querySelectorAll('.portfolio-panel .company-card:not([style*="display: none"])');
                if (remainingCards.length === 0) {
                    const companiesContainer = document.querySelector('.portfolio-companies');
                    companiesContainer.innerHTML = `
                        <div class="empty-state">
                            <h4>Track Your Portfolio</h4>
                            <p>Add companies to receive real-time intelligence about mentions, validations, and competitive threats across VC podcasts.</p>
                        </div>
                    `;
                }
            }, 300);
        }
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
        const storedMentions = localStorage.getItem('vcpulse_newMentionsValue');
        const storedNextUpdate = localStorage.getItem('vcpulse_nextMentionsUpdateTime');
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
    console.log('💰 Initializing VCPulse Dashboard...');
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
window.VCPulse = {
    verifyComponents,
    componentInitializers,
    reinitialize: initializeApp
};