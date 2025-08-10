// Priority Briefings Compact Cards - Clean Implementation
const PriorityBriefingsCompact = {
    init: function(container) {
        this.container = container;
        this.briefings = window.unifiedData?.priorityBriefings?.items || [];
        this.visibleCount = 4; // Start with 4 cards visible
        this.currentFilter = 'all';
        
        // Render initial view
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Modal removed - using Episode Panel instead
    },
    
    render: function() {
        // Clear container
        this.container.innerHTML = '';
        
        // Create structure
        const html = `
            <div class="section-header">
                <div class="feed-title-group">
                    <h2 class="section-title">PRIORITY BRIEFINGS</h2>
                    <span class="section-subtitle">WHAT REQUIRES YOUR ATTENTION TODAY</span>
                </div>
                <a href="#" class="view-all-link">ALL BRIEFINGS →</a>
            </div>
            
            <div class="briefings-grid" id="briefings-grid">
                ${this.renderCards()}
            </div>
            
            ${this.renderShowMoreButton()}
        `;
        
        this.container.innerHTML = html;
    },
    
    renderCards: function() {
        // Use the shared renderer
        return window.renderBriefingCards(this.briefings, {
            startIndex: 0,
            endIndex: this.visibleCount
        });
    },
    
    // Helper methods moved to shared briefing-card-renderer.js
    
    renderShowMoreButton: function() {
        if (this.briefings.length <= 3) {
            return '';
        }
        
        const hasMore = this.visibleCount < this.briefings.length;
        const buttonText = hasMore ? 'SHOW MORE' : 'SHOW FEWER';
        
        return `
            <div class="show-more-container">
                <button class="show-more-btn" id="show-more-btn">
                    <span class="btn-text">${buttonText}</span>
                    <span class="btn-icon">▼</span>
                </button>
            </div>
        `;
    },
    
    setupEventListeners: function() {
        // Show more button
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('#show-more-btn')) {
                this.handleShowMore();
            }
            
            // ALL BRIEFINGS link - opens Episode Library
            if (e.target.closest('.view-all-link')) {
                e.preventDefault();
                if (window.EpisodeLibrary && window.EpisodeLibrary.open) {
                    window.EpisodeLibrary.open();
                }
            }
            
            // View brief button - opens Episode Panel
            if (e.target.closest('.view-brief-btn')) {
                e.preventDefault();
                const briefingId = e.target.dataset.briefingId;
                // Open Episode Panel
                if (window.episodePanel && window.episodePanel.open) {
                    window.episodePanel.open(briefingId);
                }
            }
            
            // Card click (entire card is clickable) - Opens Episode Panel
            if (e.target.closest('.briefing-card') && !e.target.closest('.view-brief-btn') && !e.target.closest('.tag')) {
                e.preventDefault();
                const card = e.target.closest('.briefing-card');
                const briefingId = card.dataset.briefingId;
                
                // Open Episode Panel
                if (briefingId && window.episodePanel && window.episodePanel.open) {
                    console.log('Opening Episode Panel for briefing:', briefingId);
                    window.episodePanel.open(briefingId);
                }
            }
            
            // Prevent tag clicks from opening modal
            if (e.target.classList.contains('tag')) {
                e.preventDefault();
                // Could implement tag filtering here
            }
        });
    },
    
    handleShowMore: function() {
        if (this.visibleCount < this.briefings.length) {
            // Expand by 3 more cards
            this.visibleCount = Math.min(this.visibleCount + 3, this.briefings.length);
        } else {
            // Collapse back to 4
            this.visibleCount = 4;
        }
        
        // Re-render cards
        const grid = document.getElementById('briefings-grid');
        if (grid) {
            grid.innerHTML = this.renderCards();
        }
        
        // Update button
        const btn = document.getElementById('show-more-btn');
        if (btn) {
            const hasMore = this.visibleCount < this.briefings.length;
            const buttonText = hasMore ? 'SHOW MORE' : 'SHOW FEWER';
            btn.querySelector('.btn-text').textContent = buttonText;
            
            // Rotate icon
            const icon = btn.querySelector('.btn-icon');
            if (!hasMore) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }
        
        // Smooth scroll to top if collapsing
        if (this.visibleCount === 4) {
            this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },
    
    // Modal functionality removed - using Episode Panel instead
    
    // Expanded view functionality removed - using Episode Panel instead
    
    // Modal-related methods removed - using Episode Panel instead
};

// Export for use
window.PriorityBriefingsCompact = PriorityBriefingsCompact;