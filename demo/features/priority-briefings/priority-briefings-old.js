// Priority Briefings - Works with CSS state classes
const PriorityBriefings = {
    init: function(container) {
        this.container = container;
        
        // Get elements
        const showMoreBtn = container.querySelector('.show-more-btn');
        const showMoreContainer = container.querySelector('.show-more-container');
        const briefingsContent = container.querySelector('.briefings-content');
        const cards = container.querySelectorAll('.episode-card');
        
        // Handle empty state
        if (!cards || cards.length === 0) {
            showMoreContainer.style.display = 'none';
            briefingsContent.innerHTML = '<p class="empty-state">No priority briefings at this time</p>';
            return;
        }
        
        // Hide show more button if 3 or fewer briefings
        if (cards.length <= 3) {
            showMoreContainer.style.display = 'none';
            return;
        }
        
        // Initial setup - hide cards beyond the first 3
        cards.forEach((card, index) => {
            if (index >= 3) {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        // Add event listener
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => this.toggleBriefings());
            
            // Add keyboard support
            showMoreBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleBriefings();
                }
            });
            
            // Set initial ARIA attributes
            showMoreBtn.setAttribute('aria-expanded', 'false');
            showMoreBtn.setAttribute('aria-controls', 'briefings-list');
            
            // Update button text initially
            this.updateButtonText();
        }
    },
    
    toggleBriefings: function() {
        const container = this.container;
        const cards = container.querySelectorAll('.episode-card');
        const btnText = container.querySelector('.btn-text');
        const btnIcon = container.querySelector('.btn-icon');
        const showMoreBtn = container.querySelector('.show-more-btn');
        
        if (!this.briefingsExpanded) {
            // Show more cards
            const previouslyShowing = this.currentlyShowing;
            this.currentlyShowing = Math.min(this.currentlyShowing + this.CARDS_PER_LOAD, cards.length);
            
            cards.forEach((card, index) => {
                if (index >= previouslyShowing && index < this.currentlyShowing) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                    // Add slight delay for smooth appearance
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, (index - previouslyShowing) * 50);
                }
            });
            
            // Update button based on remaining cards
            if (this.currentlyShowing >= cards.length) {
                btnText.textContent = 'Show less';
                btnIcon.textContent = '↑';
                this.briefingsExpanded = true;
            } else {
                const remaining = cards.length - this.currentlyShowing;
                btnText.textContent = `Show ${Math.min(this.CARDS_PER_LOAD, remaining)} more`;
            }
        } else {
            // Collapse back to initial 3
            cards.forEach((card, index) => {
                if (index >= 3) {
                    card.classList.remove('visible');
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }, 100);
                }
            });
            
            this.currentlyShowing = 3;
            this.briefingsExpanded = false;
            btnText.textContent = 'Show more';
            btnIcon.textContent = '↓';
            
            // Smooth scroll to top of container
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Update ARIA
        showMoreBtn.setAttribute('aria-expanded', this.briefingsExpanded.toString());
        
        // Announce changes to screen readers
        this.announceToScreenReaders(cards.length);
    },
    
    updateButtonText: function() {
        const cards = this.container.querySelectorAll('.episode-card');
        const btnText = this.container.querySelector('.btn-text');
        
        if (!btnText) return;
        
        const remaining = cards.length - this.currentlyShowing;
        if (remaining > 0) {
            btnText.textContent = `Show ${Math.min(this.CARDS_PER_LOAD, remaining)} more`;
        }
    },
    
    announceToScreenReaders: function(totalCards) {
        // Find or create live region
        let liveRegion = this.container.querySelector('.sr-only[aria-live]');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            this.container.appendChild(liveRegion);
        }
        
        liveRegion.textContent = `Showing ${this.currentlyShowing} of ${totalCards} briefings`;
    },
    
    // Method to update show more button visibility for dynamic content loading
    updateShowMoreButton: function() {
        const cards = this.container.querySelectorAll('.episode-card');
        const showMoreContainer = this.container.querySelector('.show-more-container');
        
        if (cards.length > this.currentlyShowing) {
            showMoreContainer.style.display = 'flex';
            this.updateButtonText();
        } else {
            showMoreContainer.style.display = 'none';
        }
    }
};

window.PriorityBriefings = PriorityBriefings;