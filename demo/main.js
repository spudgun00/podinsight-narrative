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
        // For demo purposes, simulate new mentions every 30 seconds
        setInterval(() => {
            if (this.state.panelState === 'closed' && Math.random() > 0.7) {
                this.state.newMentions = Math.min(this.state.newMentions + Math.floor(Math.random() * 3) + 1, 99);
                this.updateUI();
                this.saveState();
            }
        }, 30000);
        
        // Initial demo data
        if (this.state.portfolioCount === 0) {
            this.state.portfolioCount = 2;
            this.state.newMentions = 2;
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