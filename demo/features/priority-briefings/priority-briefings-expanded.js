// Priority Briefings Expanded View Helper Functions
// This module provides helper functions for the Episode Panel integration
const PriorityBriefingsExpanded = {
    // Helper function to parse guests string
    parseGuests: function(guestString) {
        if (!guestString) return [];
        
        // Handle: "Name (Title, Company) + Name (Title, Company)"
        return guestString.split(' + ').map(guest => {
            const match = guest.match(/(.+?)\s*\((.+?),\s*(.+?)\)/);
            if (match) {
                return { 
                    name: match[1].trim(), 
                    title: match[2].trim(), 
                    company: match[3].trim() 
                };
            }
            // Fallback for simpler formats
            return { name: guest.trim(), title: '', company: '' };
        });
    },

    // Format notable numbers
    formatNotableNumber: function(key, value) {
        // Currency formatting for $ prefix
        if (key.startsWith('$')) {
            return { key, value: value };
        }
        // Plain number display
        if (!isNaN(parseFloat(key))) {
            return { key: `${key}`, value };
        }
        return { key, value };
    },

    // Initialize expanded view functionality - now just ensures Episode Panel handles clicks
    initExpandedView: function() {
        // The Episode Panel already handles clicks on .episode-action links
        // This function is kept for backward compatibility but doesn't need to do anything
        // as Episode Panel's attachEventListeners() method handles everything
        
        console.log('Priority Briefings: Episode Panel integration ready');
    }
};

// Export for use
window.PriorityBriefingsExpanded = PriorityBriefingsExpanded;