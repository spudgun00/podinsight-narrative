// Priority Briefings - Progressive Reveal with 3 States
const PriorityBriefings = {
    init: function(container) {
        this.container = container;
        this.currentState = 'collapsed'; // collapsed | partial | expanded
        this.states = {
            collapsed: { show: 3, buttonText: 'Show more', nextState: 'partial' },
            partial: { show: 6, buttonText: 'Show more', nextState: 'expanded' },
            expanded: { show: 9, buttonText: 'Show less', nextState: 'collapsed' }
        };
        
        // Remove checkbox approach, use button directly
        const showMoreBtn = container.querySelector('.show-more-button');
        const buttonText = container.querySelector('.show-more-text');
        const grid = container.querySelector('.episode-grid');
        
        if (showMoreBtn && grid) {
            // Apply initial state
            this.applyState(grid, buttonText);
            
            // Handle button clicks
            showMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleStateChange(grid, buttonText, showMoreBtn);
            });
            
            // Add keyboard support
            showMoreBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleStateChange(grid, buttonText, showMoreBtn);
                }
            });
        }
    },
    
    handleStateChange: function(grid, buttonText, button) {
        // Save scroll position relative to button
        const buttonRect = button.getBoundingClientRect();
        const scrollBefore = window.scrollY;
        const buttonOffsetBefore = buttonRect.top;
        
        // Transition to next state
        const nextState = this.states[this.currentState].nextState;
        this.currentState = nextState;
        this.applyState(grid, buttonText);
        
        // Restore scroll position to keep button in same place
        requestAnimationFrame(() => {
            const buttonRectAfter = button.getBoundingClientRect();
            const scrollDelta = buttonRectAfter.top - buttonOffsetBefore;
            if (Math.abs(scrollDelta) > 5) {
                window.scrollTo({
                    top: scrollBefore + scrollDelta,
                    behavior: 'instant'
                });
            }
        });
    },
    
    applyState: function(grid, buttonText) {
        const state = this.states[this.currentState];
        
        // Remove all state classes
        grid.classList.remove('show-partial', 'show-expanded');
        
        // Apply current state class
        if (this.currentState === 'partial') {
            grid.classList.add('show-partial');
        } else if (this.currentState === 'expanded') {
            grid.classList.add('show-expanded');
        }
        
        // Update button text
        if (buttonText) {
            buttonText.textContent = state.buttonText;
        }
        
        // Update ARIA
        grid.setAttribute('aria-expanded', this.currentState !== 'collapsed');
    }
};

window.PriorityBriefings = PriorityBriefings;