const NarrativeFeed = {
    expandedEntries: new Set(),
    
    init: function(container) {
        this.container = container;
        this.bindEvents();
        this.render();
    },
    
    bindEvents: function() {
        this.container.addEventListener('click', (e) => {
            const header = e.target.closest('.feed-entry-header');
            if (header) {
                this.toggleFeedEntry(header.closest('.feed-entry'));
            }
        });
    },
    
    toggleFeedEntry: function(entry) {
        entry.classList.toggle('expanded');
        
        // Close other entries
        const allEntries = this.container.querySelectorAll('.feed-entry');
        allEntries.forEach(e => {
            if (e !== entry && e.classList.contains('expanded')) {
                e.classList.remove('expanded');
            }
        });
    },
    
    render: function() {
        // Optional: Could generate HTML from window.feedData
        // For now, using static HTML is fine
    }
};

window.NarrativeFeed = NarrativeFeed;